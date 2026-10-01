import { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../database";
import { AuthUser, ensureAuthenticated, ensureTeacher } from "../middlewares/auth";
import { existsOrError, notExistsError, NotFoundError, ValidationError } from "../validation/validations";
import { updateProgress } from "../services/progress";
import { returnEscrowOfDeletedStudent } from "../services/escrow";
import { removeFiles } from "../services/storage";
import { storageKeysOf } from "./submissions";
import { normalizeUsername } from "../utils/normalize";
import { hashPassword } from "../utils/password";
import { studentsQuery } from "../utils/queries";
import { HOUSES, MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH, ONBOARDING_STEPS } from "../utils/rules";
import { createSession } from "../utils/session";
import { Json } from "../types/database";
import { removeItem, welcomeItem } from "../../../src/engine/students";

type StudentOwner = { id: string, teacherId: string }

// Quem pode VER um aluno: o próprio aluno, o professor dele e o ADM
function canAccessStudent(user: AuthUser, student: StudentOwner) {
    if (user.role === 'aluno') return user.id === student.id

    return user.isAdmin || user.id === student.teacherId
}

// Quem pode ADMINISTRAR um aluno (editar dados, senha, excluir): o professor dele e o ADM
function canManageStudent(user: AuthUser, student: StudentOwner) {
    return user.role === 'professor' && (user.isAdmin || user.id === student.teacherId)
}

// Confere se o login é válido e se ninguém mais está usando.
// `exceptId` ignora o próprio aluno (quando ele está só trocando de login).
async function checkUsername(username: string, exceptId?: string) {
    const login = normalizeUsername(username)

    if (login.length < MIN_USERNAME_LENGTH) {
        throw new ValidationError(`O login precisa ter pelo menos ${MIN_USERNAME_LENGTH} caracteres (letras, números, ponto, hífen ou _).`)
    }

    let query = db.selectFrom('students').select('id').where('username', '=', login)
    if (exceptId) query = query.where('id', '!=', exceptId)

    notExistsError(await query.executeTakeFirst(), `O login "${login}" já está em uso — escolha outro.`)

    return login
}

export async function studentsRoutes(app: FastifyInstance) {
    // Cadastrando um novo aluno.
    // Rota pública (é a tela de cadastro); ao terminar, o aluno já fica logado.
    // O limite de 30 cadastros por minuto por IP evita robôs criando contas,
    // mas ainda deixa uma turma inteira se cadastrar junta na mesma rede.
    app.post('/', { config: { rateLimit: { max: 30, timeWindow: '1 minute' } } }, async (request, reply) => {
        const insertStudentBodySchema = z.object({
            name: z.string().trim().min(1).max(90),
            email: z.email(),
            turma: z.string().trim().min(1).max(40),
            username: z.string(),
            password: z.string().min(MIN_PASSWORD_LENGTH),
            teacherId: z.uuid(),
        })

        const { name, email, turma, username, password, teacherId } = insertStudentBodySchema.parse(request.body)

        const teacher = await db.selectFrom('teachers').select('id').where('id', '=', teacherId).executeTakeFirst()
        existsOrError(teacher, 'Professor não encontrado.')

        const login = await checkUsername(username)

        const { id } = await db
            .insertInto('students')
            .values({
                teacherId,
                name,
                email: email.trim(),
                turma,
                username: login,
                passwordHash: await hashPassword(password),
                // o presente de boas-vindas (o mesmo do site)
                inventory: JSON.stringify([welcomeItem()]) as Json,
            })
            .returning('id')
            .executeTakeFirstOrThrow()

        await createSession(reply, { studentId: id })

        const student = await studentsQuery().where('id', '=', id).executeTakeFirst()

        return reply.status(201).send({ student })
    })

    // Consultando os alunos: o professor vê os dele; o ADM vê todos
    // (ou só os de um professor, com ?teacherId=...)
    app.get('/', { preHandler: ensureTeacher }, async (request) => {
        const getStudentsQuerySchema = z.object({
            teacherId: z.uuid().optional(),
        })

        const { teacherId } = getStudentsQuerySchema.parse(request.query)
        const user = request.user!

        let query = studentsQuery().orderBy('createdAt', 'asc')

        if (user.role === 'professor' && !user.isAdmin) {
            query = query.where('teacherId', '=', user.id)
        } else if (teacherId) {
            query = query.where('teacherId', '=', teacherId)
        }

        const students = await query.execute()

        return { students }
    })

    // Consultando a comunidade da Academia: todos os alunos, só com os dados
    // públicos (sem e-mail, turma, login nem senha). É o que o aluno usa pra
    // ver os pontos das casas, o ranking, os amigos e com quem negociar.
    // O inventário e os visuais equipados vêm junto: o perfil de um colega
    // mostra os itens dele, e o avatar "vestido" depende do que está equipado.
    app.get('/community', { preHandler: ensureAuthenticated }, async () => {
        const students = await db
            .selectFrom('students')
            .select(['id', 'teacherId', 'name', 'houseId', 'avatar', 'level', 'xp', 'coins', 'inventory', 'equipped', 'onboardingStep', 'createdAt'])
            .orderBy('createdAt', 'asc')
            .execute()

        return { students }
    })

    // Consultando um único aluno
    app.get('/:id', { preHandler: ensureAuthenticated }, async (request, reply) => {
        const getStudentParamsSchema = z.object({
            id: z.uuid(),
        })

        const { id } = getStudentParamsSchema.parse(request.params)

        const student = await studentsQuery().where('id', '=', id).executeTakeFirst()

        if (!student) {
            return reply.status(404).send({ message: 'Aluno não encontrado!' })
        }

        if (!canAccessStudent(request.user!, student)) {
            return reply.status(403).send({ message: 'Você não tem acesso a esse aluno.' })
        }

        return { student }
    })

    // Alterando um aluno. Cada um pode mudar coisas diferentes:
    // - o professor dele / o ADM: nome, e-mail, turma, login e casa
    //   (e só o ADM troca o aluno de professor);
    // - o próprio aluno: avatar, etapa do primeiro acesso, tutorial e a
    //   casa, esta só durante o primeiro acesso (antes de ficar "completo").
    // Nível, XP e moedas NÃO mudam por aqui: quem mexe neles são as regras
    // do jogo no servidor (missões, loja, trocas), nas próximas fases.
    app.put('/:id', { preHandler: ensureAuthenticated }, async (request, reply) => {
        const updateStudentParamsSchema = z.object({
            id: z.uuid(),
        })

        const { id } = updateStudentParamsSchema.parse(request.params)
        const user = request.user!

        const current = await db
            .selectFrom('students')
            .select(['id', 'teacherId', 'onboardingStep'])
            .where('id', '=', id)
            .executeTakeFirst()

        if (!current) {
            return reply.status(404).send({ message: 'Aluno não encontrado!' })
        }

        if (canManageStudent(user, current)) {
            const teacherUpdateStudentBodySchema = z.object({
                name: z.string().trim().min(1).max(90).optional(),
                email: z.email().optional(),
                turma: z.string().trim().min(1).max(40).optional(),
                username: z.string().optional(),
                houseId: z.enum(HOUSES).optional(),
                teacherId: z.uuid().optional(),
            })

            const { name, email, turma, username, houseId, teacherId } = teacherUpdateStudentBodySchema.parse(request.body)

            if (teacherId !== undefined && !(user.role === 'professor' && user.isAdmin)) {
                return reply.status(403).send({ message: 'Apenas o ADM pode trocar o aluno de professor.' })
            }

            if (teacherId !== undefined) {
                const teacher = await db.selectFrom('teachers').select('id').where('id', '=', teacherId).executeTakeFirst()
                existsOrError(teacher, 'Professor não encontrado.')
            }

            const login = username !== undefined ? await checkUsername(username, id) : undefined

            await db
                .updateTable('students')
                .set({
                    ...(name !== undefined && { name }),
                    ...(email !== undefined && { email: email.trim() }),
                    ...(turma !== undefined && { turma }),
                    ...(login !== undefined && { username: login }),
                    ...(teacherId !== undefined && { teacherId }),
                    // Se o aluno ainda estava escolhendo a casa, a escolha do
                    // professor vale e ele já segue pro avatar
                    ...(houseId !== undefined && {
                        houseId,
                        onboardingStep: current.onboardingStep === 'casa' ? 'avatar' : current.onboardingStep,
                    }),
                })
                .where('id', '=', id)
                .execute()
        } else if (user.role === 'aluno' && user.id === id) {
            const studentUpdateBodySchema = z.object({
                avatar: z.record(z.string(), z.json()).optional(),
                houseId: z.enum(HOUSES).optional(),
                onboardingStep: z.enum(ONBOARDING_STEPS).optional(),
                tutorialDone: z.boolean().optional(),
            })

            const { avatar, houseId, onboardingStep, tutorialDone } = studentUpdateBodySchema.parse(request.body)

            // Durante o primeiro acesso (casa → avatar) o aluno pode voltar e
            // trocar a casa; depois de completo, só o professor troca
            if (houseId !== undefined && current.onboardingStep === 'completo') {
                throw new ValidationError('A casa só pode ser escolhida no primeiro acesso. Depois, só o professor troca.')
            }

            await db
                .updateTable('students')
                .set({
                    ...(avatar !== undefined && { avatar: avatar as Json }),
                    ...(houseId !== undefined && { houseId }),
                    ...(onboardingStep !== undefined && { onboardingStep }),
                    ...(tutorialDone !== undefined && { tutorialDone }),
                })
                .where('id', '=', id)
                .execute()
        } else {
            return reply.status(403).send({ message: 'Você não tem acesso a esse aluno.' })
        }

        const student = await studentsQuery().where('id', '=', id).executeTakeFirst()

        return { student }
    })

    // Definindo a senha do aluno (o professor dele ou o ADM).
    // A senha antiga não aparece pra ninguém: ela só pode ser trocada.
    app.put('/:id/password', { preHandler: ensureTeacher }, async (request, reply) => {
        const updatePasswordParamsSchema = z.object({
            id: z.uuid(),
        })

        const updatePasswordBodySchema = z.object({
            password: z.string().min(MIN_PASSWORD_LENGTH),
        })

        const { id } = updatePasswordParamsSchema.parse(request.params)
        const { password } = updatePasswordBodySchema.parse(request.body)

        const student = await db.selectFrom('students').select(['id', 'teacherId']).where('id', '=', id).executeTakeFirst()

        if (!student) {
            return reply.status(404).send({ message: 'Aluno não encontrado!' })
        }

        if (!canManageStudent(request.user!, student)) {
            return reply.status(403).send({ message: 'Você não tem acesso a esse aluno.' })
        }

        await db
            .updateTable('students')
            .set({ passwordHash: await hashPassword(password) })
            .where('id', '=', id)
            .execute()

        // Derruba as sessões abertas: com a senha nova, ele entra de novo
        await db.deleteFrom('sessions').where('studentId', '=', id).execute()

        return reply.status(200).send()
    })

    // Tirando um item do inventário do aluno (o professor dele ou o ADM).
    // Se era um visual equipado, sai do avatar também.
    app.delete('/:id/items/:itemId', { preHandler: ensureTeacher }, async (request, reply) => {
        const removeItemParamsSchema = z.object({
            id: z.uuid(),
            itemId: z.string().min(1),
        })

        const { id, itemId } = removeItemParamsSchema.parse(request.params)

        const student = await db.selectFrom('students').select(['id', 'teacherId']).where('id', '=', id).executeTakeFirst()

        if (!student) {
            return reply.status(404).send({ message: 'Aluno não encontrado!' })
        }

        if (!canManageStudent(request.user!, student)) {
            return reply.status(403).send({ message: 'Você não tem acesso a esse aluno.' })
        }

        await updateProgress(id, (current) => {
            if (!current.inventory.some((i) => i.id === itemId)) {
                throw new NotFoundError('Esse item não está no inventário do aluno.')
            }

            return { student: removeItem(current, itemId) }
        })

        const updated = await studentsQuery().where('id', '=', id).executeTakeFirst()

        return { student: updated }
    })

    // Excluindo um aluno (o professor dele ou o ADM).
    // As sessões, amizades, ofertas e propostas de troca FEITAS por ele são
    // apagadas junto (on delete cascade). As ofertas e propostas que ele
    // RECEBEU devolvem os itens pra quem ofereceu, antes de ele sair.
    app.delete('/:id', { preHandler: ensureTeacher }, async (request, reply) => {
        const deleteStudentParamsSchema = z.object({
            id: z.uuid(),
        })

        const { id } = deleteStudentParamsSchema.parse(request.params)

        const student = await db.selectFrom('students').select(['id', 'teacherId']).where('id', '=', id).executeTakeFirst()

        if (!student) {
            return reply.status(404).send({ message: 'Aluno não encontrado!' })
        }

        if (!canManageStudent(request.user!, student)) {
            return reply.status(403).send({ message: 'Você não tem acesso a esse aluno.' })
        }

        // As entregas dele somem junto (on delete cascade); os arquivos delas
        // no storage são apagados logo depois
        const fileKeys = await storageKeysOf({ studentId: id })

        await db.transaction().execute(async (trx) => {
            await returnEscrowOfDeletedStudent(trx, id)
            await trx.deleteFrom('students').where('id', '=', id).execute()
        })

        await removeFiles(fileKeys)

        return reply.status(200).send()
    })
}
