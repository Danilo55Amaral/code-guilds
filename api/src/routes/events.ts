import { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../database";
import { AuthUser, ensureAuthenticated, ensureStudent, ensureTeacher } from "../middlewares/auth";
import { updateProgress } from "../services/progress";
import { sendMessages } from "../services/messages";
import { PENDING_ITEM_NOTE, eventPhaseRewardMessage, eventRewardMessage } from "../../../src/engine/messages";
import { findStudent } from "../utils/queries";
import { existsOrError, ForbiddenError, NotFoundError, ValidationError } from "../validation/validations";
import { Json } from "../types/database";
import { Mission, RewardItem } from "../../../src/engine/missions";
import {
    ACADEMY_EVENTS,
    EventId,
    canFinishPhase,
    eventPhases,
    finishPhase,
    getEvent,
    getPhase,
    introSeenPatch,
    phaseLock,
    phaseProgress,
} from "../../../src/engine/specialEvents";
import { eventRewardKey, resolveEventItem } from "../../../src/engine/eventItems";
import type { EventRuns } from "../../../src/engine/eventSchedule";

// ============================================================================
// EVENTOS — a agenda dos eventos (cada professor inicia, libera as fases e
// encerra os eventos da turma dele) e o progresso do aluno em cada fase:
// abertura vista e fase concluída. A recompensa da fase (XP, moedas e o item,
// com as alterações que o ADM fez na Loja) é dada AQUI, com as regras do site
// (src/engine/specialEvents.ts).
// ============================================================================

const EVENT_IDS = ACADEMY_EVENTS.map((e) => e.id) as [EventId, ...EventId[]]

// As linhas da agenda no formato do site: professor -> evento -> situação
async function listRuns(teacherId?: string): Promise<EventRuns> {
    let query = db.selectFrom('eventRuns').selectAll()
    if (teacherId) query = query.where('teacherId', '=', teacherId)

    const rows = await query.execute()
    const runs: EventRuns = {}

    for (const row of rows) {
        runs[row.teacherId] = {
            ...runs[row.teacherId],
            [row.eventId]: {
                status: row.status as 'ativo' | 'encerrado',
                startedAt: row.startedAt.toISOString(),
                ...(row.endedAt && { endedAt: row.endedAt.toISOString() }),
                phasesReleasedAt: row.phasesReleasedAt as string[],
            },
        }
    }

    return runs
}

// De qual professor é a agenda: o professor mexe na dele; o ADM escolhe
// (teacherId no corpo) ou mexe na própria
async function scheduleOwner(user: AuthUser, teacherId?: string) {
    if (!teacherId || teacherId === user.id) return user.id

    if (user.role !== 'professor' || !user.isAdmin) {
        throw new ForbiddenError('Você só pode mexer nos eventos da sua turma.')
    }

    const teacher = await db.selectFrom('teachers').select('id').where('id', '=', teacherId).executeTakeFirst()
    existsOrError(teacher, 'Professor não encontrado.')

    return teacherId
}

// Quantas fases o professor liberou (0 = evento nunca iniciado) e se o evento está acontecendo
async function eventStateFor(teacherId: string, eventId: EventId) {
    const run = await db
        .selectFrom('eventRuns')
        .select(['status', 'phasesReleasedAt'])
        .where('teacherId', '=', teacherId)
        .where('eventId', '=', eventId)
        .executeTakeFirst()

    return {
        active: run?.status === 'ativo',
        released: run ? Math.max(1, (run.phasesReleasedAt as string[]).length) : 0,
    }
}

export async function eventsRoutes(app: FastifyInstance) {
    const runParamsSchema = z.object({
        eventId: z.enum(EVENT_IDS),
    })

    const runBodySchema = z.object({
        teacherId: z.uuid().optional(),
    })

    const phaseParamsSchema = z.object({
        eventId: z.enum(EVENT_IDS),
        phase: z.coerce.number().int().min(1).max(20),
    })

    // Consultando a agenda: o aluno vê a do professor dele; professores e ADM veem todas
    app.get('/runs', { preHandler: ensureAuthenticated }, async (request) => {
        const user = request.user!

        const runs = await listRuns(user.role === 'aluno' ? user.teacherId : undefined)

        return { runs }
    })

    // Iniciando (ou reabrindo) um evento pra turma. Reabrir mantém as fases já liberadas.
    app.post('/runs/:eventId/start', { preHandler: ensureTeacher }, async (request) => {
        const { eventId } = runParamsSchema.parse(request.params)
        const { teacherId } = runBodySchema.parse(request.body ?? {})
        const owner = await scheduleOwner(request.user!, teacherId)

        await db
            .insertInto('eventRuns')
            .values({
                teacherId: owner,
                eventId,
                status: 'ativo',
                phasesReleasedAt: JSON.stringify([new Date().toISOString()]) as Json,
            })
            .onConflict((oc) => oc.columns(['teacherId', 'eventId']).doUpdateSet({
                status: 'ativo',
                startedAt: new Date(),
                endedAt: null,
            }))
            .execute()

        return { runs: await listRuns(owner) }
    })

    // Liberando a próxima fase de um evento em fases (Natal), até a última
    app.post('/runs/:eventId/release', { preHandler: ensureTeacher }, async (request) => {
        const { eventId } = runParamsSchema.parse(request.params)
        const { teacherId } = runBodySchema.parse(request.body ?? {})
        const owner = await scheduleOwner(request.user!, teacherId)
        const totalPhases = eventPhases(getEvent(eventId)!).length

        await db.transaction().execute(async (trx) => {
            const run = await trx
                .selectFrom('eventRuns')
                .select(['status', 'phasesReleasedAt'])
                .where('teacherId', '=', owner)
                .where('eventId', '=', eventId)
                .forUpdate()
                .executeTakeFirst()

            if (!run || run.status !== 'ativo') throw new ValidationError('Inicie o evento antes de liberar as fases.')

            const released = run.phasesReleasedAt as string[]

            if (released.length >= totalPhases) throw new ValidationError('Todas as fases desse evento já foram liberadas.')

            await trx
                .updateTable('eventRuns')
                .set({ phasesReleasedAt: JSON.stringify([...released, new Date().toISOString()]) as Json })
                .where('teacherId', '=', owner)
                .where('eventId', '=', eventId)
                .execute()
        })

        return { runs: await listRuns(owner) }
    })

    // Encerrando o evento: some da tela dos alunos (o progresso deles fica guardado)
    app.post('/runs/:eventId/end', { preHandler: ensureTeacher }, async (request) => {
        const { eventId } = runParamsSchema.parse(request.params)
        const { teacherId } = runBodySchema.parse(request.body ?? {})
        const owner = await scheduleOwner(request.user!, teacherId)

        const ended = await db
            .updateTable('eventRuns')
            .set({ status: 'encerrado', endedAt: new Date() })
            .where('teacherId', '=', owner)
            .where('eventId', '=', eventId)
            .executeTakeFirst()

        if (Number(ended.numUpdatedRows) === 0) throw new NotFoundError('Esse evento ainda não foi iniciado.')

        return { runs: await listRuns(owner) }
    })

    // O aluno viu (ou pulou) a abertura da fase: nas próximas vezes, "Entrar"
    // vai direto pra tela do evento. Rever a abertura não muda nada.
    app.post('/:eventId/phases/:phase/intro', { preHandler: ensureStudent }, async (request) => {
        const { eventId, phase } = phaseParamsSchema.parse(request.params)
        const user = request.user!
        const event = getEvent(eventId)!
        const { active, released } = await eventStateFor(user.role === 'aluno' ? user.teacherId : '', eventId)

        await updateProgress(user.id, (student) => {
            if (phaseProgress(student, event, phase).introSeenAt) return { student }

            if (!active) throw new ValidationError('Esse evento não está acontecendo agora.')
            if (phase > eventPhases(event).length || phaseLock(student, event, phase, released)) {
                throw new ValidationError('Essa fase ainda não está liberada pra você.')
            }

            return { student: { ...student, ...introSeenPatch(student, event, phase) } }
        })

        return { student: await findStudent(user.id) }
    })

    // Concluindo a fase (ou o evento, se for de uma fase só): todas as missões
    // da fase precisam estar concluídas. O aluno ganha a recompensa da fase.
    app.post('/:eventId/phases/:phase/finish', { preHandler: ensureStudent }, async (request) => {
        const { eventId, phase } = phaseParamsSchema.parse(request.params)
        const user = request.user!
        const teacherId = user.role === 'aluno' ? user.teacherId : ''
        const event = getEvent(eventId)!

        if (phase > eventPhases(event).length) throw new ValidationError('Essa fase não existe.')

        const { active, released } = await eventStateFor(teacherId, eventId)

        if (!active) throw new ValidationError('Esse evento não está acontecendo agora.')

        // As missões dessa fase, do professor do aluno (missão de evento comum conta como fase 1)
        const eventMissions = await db
            .selectFrom('missions')
            .select(['id', 'eventPhase'])
            .where('eventId', '=', eventId)
            .where('teacherId', '=', teacherId)
            .execute()
        const missions = eventMissions.filter((m) => (m.eventPhase ?? 1) === phase) as unknown as Mission[]

        // O item da recompensa com as alterações que o ADM fez na Loja
        const { reward } = getPhase(event, phase)
        const key = eventRewardKey(eventId, phase)
        const shopItem = await db
            .selectFrom('shopItems')
            .select(['eventItemKey', 'name', 'icon', 'description', 'rarity', 'value', 'xp', 'cosmetic', 'slots'])
            .where('eventItemKey', '=', key)
            .executeTakeFirst()
        const item: RewardItem = resolveEventItem(key, reward.item, shopItem
            ? [{
                ...shopItem,
                eventItemKey: shopItem.eventItemKey ?? undefined,
                rarity: shopItem.rarity as RewardItem['rarity'],
                cosmetic: (shopItem.cosmetic ?? undefined) as RewardItem['cosmetic'],
                slots: shopItem.slots ?? undefined,
            }]
            : [])

        const result = await updateProgress(user.id, (student) => {
            if (phaseLock(student, event, phase, released)) throw new ValidationError('Essa fase ainda não está liberada pra você.')
            if (phaseProgress(student, event, phase).finishedAt) throw new ValidationError('Você já concluiu essa fase.')
            if (!canFinishPhase(student, missions, event, phase)) {
                throw new ValidationError('Conclua todas as missões da fase antes de finalizar.')
            }

            const finished = finishPhase(student, event, phase, item)

            return {
                student: finished.student,
                leveledUp: finished.leveledUp,
                fromLevel: student.level,
                newLevel: finished.newLevel,
                // o item não coube no inventário e ficou esperando espaço
                itemWaiting: finished.student.pendingItems.length > student.pendingItems.length,
            }
        }, async (trx, result) => {
            // 🏆 a mensagem da recompensa: do evento inteiro (última fase) ou da fase
            const totalPhases = eventPhases(event).length
            const body = phase === totalPhases
                ? eventRewardMessage({ event, item, xp: reward.xp, coins: reward.coins })
                : eventPhaseRewardMessage({ event, phase: getPhase(event, phase), totalPhases, item, xp: reward.xp, coins: reward.coins })

            await sendMessages(trx, [{ studentId: user.id, kind: 'missao', body: body + (result.itemWaiting ? PENDING_ITEM_NOTE : '') }])
        })

        const { student: _unused, ...outcome } = result

        return { student: await findStudent(user.id), ...outcome, item, xp: reward.xp, coins: reward.coins }
    })
}
