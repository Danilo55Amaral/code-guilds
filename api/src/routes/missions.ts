import { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../database";
import { AuthUser, ensureAuthenticated, ensureStudent, ensureTeacher } from "../middlewares/auth";
import { updateProgress } from "../services/progress";
import { sendMessages } from "../services/messages";
import { removeFiles } from "../services/storage";
import { storageKeysOf } from "./submissions";
import { slugify } from "../utils/normalize";
import { studentsQuery } from "../utils/queries";
import { existsOrError, ValidationError } from "../validation/validations";
import { itemSchema } from "../validation/schemas";
import { Json } from "../types/database";
import { Mission, SUBMISSION_FILE_KINDS, hasPassed } from "../../../src/engine/missions";
import { applyMissionReward } from "../../../src/engine/students";
import { PENDING_ITEM_NOTE, missionRewardMessage } from "../../../src/engine/messages";

// ============================================================================
// MISSÕES — o catálogo de missões de cada professor e a tentativa do quiz.
// (A correção das missões de entrega fica em routes/submissions.ts.)
// A recompensa (XP, moedas e item) é decidida AQUI: o aluno manda as
// respostas que escolheu, o servidor corrige e, se ele passou (60%+) numa
// missão ainda não concluída, aplica a recompensa com a mesma regra do site
// (applyMissionReward, em src/engine/students.ts).
// ============================================================================

// Todas as colunas da missão, já no formato do site (camelCase)
function missionsQuery() {
    return db
        .selectFrom('missions')
        .select([
            'id',
            'teacherId',
            'title',
            'icon',
            'difficulty',
            'minLevel',
            'description',
            'rewardXp',
            'rewardCoins',
            'rewardItem',
            'questions',
            'kind',
            'task',
            'eventId',
            'eventPhase',
        ])
}

// O professor mexe nas missões dele; o ADM, em todas
function canManageMission(user: AuthUser, mission: { teacherId: string }) {
    return user.role === 'professor' && (user.isAdmin || user.id === mission.teacherId)
}

// ---------------------------------------------------------------------------
// Schemas do conteúdo da missão (o que o editor de missões manda).
// O scripts/import-missions.ts usa os mesmos, pra missão importada passar
// pelas mesmas regras de uma criada no site.
// ---------------------------------------------------------------------------

const questionSchema = z.object({
    id: z.string().min(1).max(40),
    prompt: z.string().trim().min(1).max(1000),
    code: z.string().max(4000).optional(),
    options: z.array(z.object({ id: z.string().min(1).max(20), text: z.string().trim().min(1).max(500) })).min(2).max(8),
    correctOptionId: z.string().min(1),
    explanation: z.string().max(2000),
})

const taskSchema = z.object({
    prompt: z.string().trim().min(1).max(5000),
    allowText: z.boolean(),
    allowFiles: z.boolean(),
    fileKinds: z.array(z.enum(SUBMISSION_FILE_KINDS as [string, ...string[]])).max(5),
})

// Todos os campos são opcionais: o cadastro confere se o que é obrigatório
// veio (checkMissionContent) e a edição muda só o que vier. Nos campos do
// evento e da tarefa, null = tirar.
export const missionBodySchema = z.object({
    title: z.string().trim().min(1).max(120).optional(),
    icon: z.string().min(1).max(32).optional(),
    difficulty: z.enum(['iniciante', 'medio', 'avancado', 'epico']).optional(),
    minLevel: z.number().int().min(1).max(100).optional(),
    description: z.string().max(2000).optional(),
    rewardXp: z.number().int().min(0).max(100000).optional(),
    rewardCoins: z.number().int().min(0).max(100000).optional(),
    rewardItem: itemSchema.optional(),
    questions: z.array(questionSchema).max(50).optional(),
    kind: z.enum(['quiz', 'entrega']).optional(),
    task: taskSchema.nullable().optional(),
    eventId: z.string().max(40).nullable().optional(),
    eventPhase: z.number().int().min(1).max(10).nullable().optional(),
    teacherId: z.uuid().optional(),
})

export type MissionBody = z.infer<typeof missionBodySchema>

// A missão completa precisa fazer sentido: quiz com perguntas (e cada
// pergunta com a resposta certa entre as opções), entrega com a tarefa
export function checkMissionContent(mission: MissionBody) {
    for (const field of ['title', 'icon', 'difficulty', 'rewardItem'] as const) {
        existsOrError(mission[field], `Falta o campo "${field}" da missão.`)
    }

    if (mission.kind === 'entrega') {
        existsOrError(mission.task, 'A missão de entrega precisa do enunciado da tarefa.')
        return
    }

    existsOrError(mission.questions, 'O quiz precisa de pelo menos uma pergunta.')

    for (const question of mission.questions!) {
        if (!question.options.some((o) => o.id === question.correctOptionId)) {
            throw new ValidationError(`A pergunta "${question.prompt}" não tem a resposta certa entre as opções.`)
        }
    }
}

// Colunas pra salvar (os campos jsonb vão como texto JSON)
function missionColumns(mission: MissionBody) {
    return {
        ...(mission.title !== undefined && { title: mission.title }),
        ...(mission.icon !== undefined && { icon: mission.icon }),
        ...(mission.difficulty !== undefined && { difficulty: mission.difficulty }),
        ...(mission.minLevel !== undefined && { minLevel: mission.minLevel }),
        ...(mission.description !== undefined && { description: mission.description }),
        ...(mission.rewardXp !== undefined && { rewardXp: mission.rewardXp }),
        ...(mission.rewardCoins !== undefined && { rewardCoins: mission.rewardCoins }),
        ...(mission.rewardItem !== undefined && { rewardItem: JSON.stringify(mission.rewardItem) as Json }),
        ...(mission.questions !== undefined && { questions: JSON.stringify(mission.questions) as Json }),
        ...(mission.kind !== undefined && { kind: mission.kind }),
        ...(mission.task !== undefined && { task: mission.task === null ? null : (JSON.stringify(mission.task) as Json) }),
        ...(mission.eventId !== undefined && { eventId: mission.eventId }),
        ...(mission.eventPhase !== undefined && { eventPhase: mission.eventPhase }),
    }
}

// Id único a partir do título (loops-com-for, loops-com-for-1, ...)
export async function newMissionId(title: string) {
    const base = slugify(title)
    let id = base

    for (let n = 1; await db.selectFrom('missions').select('id').where('id', '=', id).executeTakeFirst(); n++) {
        id = `${base}-${n}`
    }

    return id
}

export async function missionsRoutes(app: FastifyInstance) {
    // Consultando as missões:
    // - aluno: as do professor dele;
    // - professor: as dele;
    // - ADM: todas (ou só as de um professor, com ?teacherId=...).
    app.get('/', { preHandler: ensureAuthenticated }, async (request) => {
        const getMissionsQuerySchema = z.object({
            teacherId: z.uuid().optional(),
        })

        const { teacherId } = getMissionsQuerySchema.parse(request.query)
        const user = request.user!

        let query = missionsQuery().orderBy('createdAt', 'asc')

        if (user.role === 'aluno') {
            query = query.where('teacherId', '=', user.teacherId)
        } else if (!user.isAdmin) {
            query = query.where('teacherId', '=', user.id)
        } else if (teacherId) {
            query = query.where('teacherId', '=', teacherId)
        }

        const missions = await query.execute()

        return { missions }
    })

    // Cadastrando uma missão (professor: pra ele mesmo; ADM: pra quem escolher)
    app.post('/', { preHandler: ensureTeacher }, async (request, reply) => {
        const body = missionBodySchema.parse(request.body)
        const user = request.user!

        checkMissionContent(body)

        const teacherId = user.role === 'professor' && user.isAdmin && body.teacherId ? body.teacherId : user.id

        const teacher = await db.selectFrom('teachers').select('id').where('id', '=', teacherId).executeTakeFirst()
        existsOrError(teacher, 'Professor não encontrado.')

        const id = await newMissionId(body.title!)

        await db
            .insertInto('missions')
            .values({
                id,
                teacherId,
                title: body.title!,
                icon: body.icon!,
                difficulty: body.difficulty!,
                rewardItem: JSON.stringify(body.rewardItem) as Json,
                ...missionColumns(body),
            })
            .execute()

        const mission = await missionsQuery().where('id', '=', id).executeTakeFirst()

        return reply.status(201).send({ mission })
    })

    // Alterando uma missão (o dono ou o ADM). Muda só os campos que vierem;
    // o id nunca muda (os alunos guardam as missões feitas por ele).
    app.put('/:id', { preHandler: ensureTeacher }, async (request, reply) => {
        const updateMissionParamsSchema = z.object({
            id: z.string().min(1),
        })

        const { id } = updateMissionParamsSchema.parse(request.params)
        const body = missionBodySchema.parse(request.body)
        const user = request.user!

        const current = await missionsQuery().where('id', '=', id).executeTakeFirst()

        if (!current) {
            return reply.status(404).send({ message: 'Missão não encontrada!' })
        }

        if (!canManageMission(user, current)) {
            return reply.status(403).send({ message: 'Você não tem acesso a essa missão.' })
        }

        if (body.teacherId !== undefined && !(user.role === 'professor' && user.isAdmin)) {
            return reply.status(403).send({ message: 'Apenas o ADM pode trocar o professor da missão.' })
        }

        // Confere a missão como ela vai ficar depois da alteração
        checkMissionContent({ ...(current as unknown as MissionBody), ...body })

        await db
            .updateTable('missions')
            .set({
                ...missionColumns(body),
                ...(body.teacherId !== undefined && { teacherId: body.teacherId }),
            })
            .where('id', '=', id)
            .execute()

        const mission = await missionsQuery().where('id', '=', id).executeTakeFirst()

        return { mission }
    })

    // Excluindo uma missão (o dono ou o ADM). Quem já concluiu continua com
    // a missão na lista de feitas, e a recompensa que ganhou não sai.
    app.delete('/:id', { preHandler: ensureTeacher }, async (request, reply) => {
        const deleteMissionParamsSchema = z.object({
            id: z.string().min(1),
        })

        const { id } = deleteMissionParamsSchema.parse(request.params)

        const mission = await db.selectFrom('missions').select(['id', 'teacherId']).where('id', '=', id).executeTakeFirst()

        if (!mission) {
            return reply.status(404).send({ message: 'Missão não encontrada!' })
        }

        if (!canManageMission(request.user!, mission)) {
            return reply.status(403).send({ message: 'Você não tem acesso a essa missão.' })
        }

        // As entregas da missão somem junto (on delete cascade); os arquivos
        // delas no storage são apagados logo depois
        const fileKeys = await storageKeysOf({ missionId: id })

        await db.deleteFrom('missions').where('id', '=', id).execute()

        await removeFiles(fileKeys)

        return reply.status(200).send()
    })

    // Terminando o quiz de uma missão (o aluno).
    // O aluno manda as respostas que escolheu ({ idDaPergunta: idDaOpção }) e
    // o SERVIDOR corrige. Com 60% ou mais numa missão ainda não concluída,
    // ganha a recompensa. Revisão (missão já feita) ou nota baixa não dão nada.
    app.post('/:id/attempt', { preHandler: ensureStudent }, async (request, reply) => {
        const attemptParamsSchema = z.object({
            id: z.string().min(1),
        })

        const attemptBodySchema = z.object({
            answers: z.record(z.string(), z.string()),
        })

        const { id } = attemptParamsSchema.parse(request.params)
        const { answers } = attemptBodySchema.parse(request.body)
        const user = request.user!

        const mission = (await missionsQuery().where('id', '=', id).executeTakeFirst()) as unknown as Mission | undefined

        if (!mission) {
            return reply.status(404).send({ message: 'Missão não encontrada!' })
        }

        if (user.role !== 'aluno' || mission.teacherId !== user.teacherId) {
            return reply.status(403).send({ message: 'Essa missão não é do seu professor.' })
        }

        if (mission.kind === 'entrega') {
            return reply.status(400).send({ message: 'Missão de entrega é corrigida pelo professor: envie a entrega.' })
        }

        const result = await updateProgress(user.id, (student) => {
            if (student.level < mission.minLevel) {
                throw new ValidationError(`Essa missão libera no nível ${mission.minLevel}.`)
            }

            const total = mission.questions.length
            const correctCount = mission.questions.filter((q) => answers[q.id] === q.correctOptionId).length
            const passed = hasPassed(correctCount, total)
            const alreadyCompleted = student.completedMissionIds.includes(mission.id)

            if (!passed || alreadyCompleted) {
                return { student, correctCount, total, passed, rewarded: false }
            }

            const reward = applyMissionReward(student, mission)

            return {
                student: reward.student,
                correctCount,
                total,
                passed,
                rewarded: true,
                leveledUp: reward.leveledUp,
                fromLevel: student.level,
                newLevel: reward.newLevel,
                // o item não coube no inventário e ficou esperando espaço
                itemWaiting: reward.student.pendingItems.length > student.pendingItems.length,
            }
        }, async (trx, result) => {
            // a mensagem 🏆 da recompensa, na mesma transação
            if (!result.rewarded) return

            await sendMessages(trx, [{
                studentId: user.id,
                kind: 'missao',
                body: missionRewardMessage({ mission, item: mission.rewardItem, xp: mission.rewardXp, coins: mission.rewardCoins }) +
                    ('itemWaiting' in result && result.itemWaiting ? PENDING_ITEM_NOTE : ''),
            }])
        })

        const { student: _unused, ...attempt } = result
        const student = await studentsQuery().where('id', '=', user.id).executeTakeFirst()

        return { student, ...attempt }
    })
}
