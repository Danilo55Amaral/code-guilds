import { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../database";
import { AuthUser, ensureAdmin, ensureTeacher } from "../middlewares/auth";
import { notExistsError } from "../validation/validations";
import { normalizeEmail } from "../utils/normalize";
import { hashPassword } from "../utils/password";
import { teachersQuery } from "../utils/queries";
import { MIN_PASSWORD_LENGTH } from "../utils/rules";

// O professor mexe no próprio cadastro; o ADM mexe no de todos
function canManageTeacher(user: AuthUser, teacherId: string) {
    return user.role === 'professor' && (user.isAdmin || user.id === teacherId)
}

export async function teachersRoutes(app: FastifyInstance) {
    // Consultando os professores.
    // Rota pública: a tela de cadastro do aluno mostra a lista de professores,
    // mas quem não é ADM recebe só o id, o nome e se é o ADM (sem e-mail).
    // O site usa o isAdmin pra saber quem é o dono das missões de exemplo.
    app.get('/', async () => {
        const teachers = await db
            .selectFrom('teachers')
            .select(['id', 'name', 'isAdmin'])
            .orderBy('isAdmin', 'desc')
            .orderBy('createdAt', 'asc')
            .execute()

        return { teachers }
    })

    // Consultando todos os dados dos professores (só o ADM)
    app.get('/admin', { preHandler: ensureAdmin }, async () => {
        const teachers = await teachersQuery()
            .orderBy('isAdmin', 'desc')
            .orderBy('createdAt', 'asc')
            .execute()

        return { teachers }
    })

    // Consultando um único professor (o próprio professor ou o ADM)
    app.get('/:id', { preHandler: ensureTeacher }, async (request, reply) => {
        const getTeacherParamsSchema = z.object({
            id: z.uuid(),
        })

        const { id } = getTeacherParamsSchema.parse(request.params)

        if (!canManageTeacher(request.user!, id)) {
            return reply.status(403).send({ message: 'Você não tem acesso a esse professor.' })
        }

        const teacher = await teachersQuery().where('id', '=', id).executeTakeFirst()

        if (!teacher) {
            return reply.status(404).send({ message: 'Professor não encontrado!' })
        }

        return { teacher }
    })

    // Cadastrando um novo professor (só o ADM)
    app.post('/', { preHandler: ensureAdmin }, async (request, reply) => {
        const insertTeacherBodySchema = z.object({
            name: z.string().trim().min(1).max(90),
            email: z.email(),
            password: z.string().min(MIN_PASSWORD_LENGTH),
        })

        const { name, email, password } = insertTeacherBodySchema.parse(request.body)

        const emailTaken = await db
            .selectFrom('teachers')
            .select('id')
            .where('email', '=', normalizeEmail(email))
            .executeTakeFirst()

        notExistsError(emailTaken, `O e-mail "${normalizeEmail(email)}" já é de outro professor.`)

        const { id } = await db
            .insertInto('teachers')
            .values({
                name,
                email: normalizeEmail(email),
                passwordHash: await hashPassword(password),
            })
            .returning('id')
            .executeTakeFirstOrThrow()

        const teacher = await teachersQuery().where('id', '=', id).executeTakeFirst()

        return reply.status(201).send({ teacher })
    })

    // Alterando um professor (o próprio professor ou o ADM).
    // Todos os campos são opcionais: dá pra mudar só o que precisar.
    // O papel de ADM não muda por aqui.
    app.put('/:id', { preHandler: ensureTeacher }, async (request, reply) => {
        const updateTeacherParamsSchema = z.object({
            id: z.uuid(),
        })

        const updateTeacherBodySchema = z.object({
            name: z.string().trim().min(1).max(90).optional(),
            email: z.email().optional(),
            password: z.string().min(MIN_PASSWORD_LENGTH).optional(),
            tutorialDone: z.boolean().optional(),
        })

        const { id } = updateTeacherParamsSchema.parse(request.params)
        const { name, email, password, tutorialDone } = updateTeacherBodySchema.parse(request.body)

        if (!canManageTeacher(request.user!, id)) {
            return reply.status(403).send({ message: 'Você não tem acesso a esse professor.' })
        }

        const current = await db.selectFrom('teachers').select('id').where('id', '=', id).executeTakeFirst()

        if (!current) {
            return reply.status(404).send({ message: 'Professor não encontrado!' })
        }

        if (email) {
            const emailTaken = await db
                .selectFrom('teachers')
                .select('id')
                .where('email', '=', normalizeEmail(email))
                .where('id', '!=', id)
                .executeTakeFirst()

            notExistsError(emailTaken, `O e-mail "${normalizeEmail(email)}" já é de outro professor.`)
        }

        await db
            .updateTable('teachers')
            .set({
                ...(name !== undefined && { name }),
                ...(email !== undefined && { email: normalizeEmail(email) }),
                ...(password !== undefined && { passwordHash: await hashPassword(password) }),
                ...(tutorialDone !== undefined && { tutorialDone }),
            })
            .where('id', '=', id)
            .execute()

        const teacher = await teachersQuery().where('id', '=', id).executeTakeFirst()

        return { teacher }
    })

    // Excluindo um professor (só o ADM).
    // Os alunos, as missões e as mensagens dos alunos pro professor excluído passam para o professor escolhido em
    // ?heirId=... (o "herdeiro"); sem ele, passam para o ADM que fez a exclusão.
    // A transação garante que as duas coisas acontecem juntas: ou move os
    // alunos E exclui o professor, ou (se algo der errado) não faz nada.
    app.delete('/:id', { preHandler: ensureAdmin }, async (request, reply) => {
        const deleteTeacherParamsSchema = z.object({
            id: z.uuid(),
        })

        const deleteTeacherQuerySchema = z.object({
            heirId: z.uuid().optional(),
        })

        const { id } = deleteTeacherParamsSchema.parse(request.params)
        const { heirId = request.user!.id } = deleteTeacherQuerySchema.parse(request.query)

        if (heirId === id) {
            return reply.status(400).send({ message: 'Escolha outro professor para receber os alunos.' })
        }

        const heir = await db.selectFrom('teachers').select('id').where('id', '=', heirId).executeTakeFirst()

        if (!heir) {
            return reply.status(400).send({ message: 'O professor escolhido para receber os alunos não existe.' })
        }

        const teacher = await db.selectFrom('teachers').select(['id', 'isAdmin']).where('id', '=', id).executeTakeFirst()

        if (!teacher) {
            return reply.status(404).send({ message: 'Professor não encontrado!' })
        }

        if (teacher.isAdmin) {
            return reply.status(400).send({ message: 'O ADM não pode ser excluído.' })
        }

        await db.transaction().execute(async (trx) => {
            await trx
                .updateTable('students')
                .set({ teacherId: heirId })
                .where('teacherId', '=', id)
                .execute()

            // as mensagens que os alunos tinham mandado pra ele também vão pro herdeiro
            await trx
                .updateTable('teacherMessages')
                .set({ teacherId: heirId })
                .where('teacherId', '=', id)
                .execute()

            await trx
                .updateTable('missions')
                .set({ teacherId: heirId })
                .where('teacherId', '=', id)
                .execute()

            await trx.deleteFrom('teachers').where('id', '=', id).execute()
        })

        return reply.status(200).send()
    })
}
