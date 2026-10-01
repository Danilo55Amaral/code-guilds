import { randomUUID } from "node:crypto";
import { FastifyInstance } from "fastify";
import { sql } from "kysely";
import { z } from "zod";
import { db } from "../database";
import { AuthUser, ensureAuthenticated, ensureStudent, ensureTeacher } from "../middlewares/auth";
import { messagesQuery, sendMessages } from "../services/messages";
import { HOUSES } from "../utils/rules";
import { existsOrError, ForbiddenError, NotFoundError, ValidationError } from "../validation/validations";
import { MESSAGE_MAX_LENGTH, MessageAudience } from "../../../src/engine/messages";

// ============================================================================
// MENSAGENS — a caixa do aluno (o sininho e a página Mensagens), as mensagens
// que o professor manda pra um aluno e os comunicados pra turma ou pra uma
// casa. As mensagens automáticas (missão, compra, troca...) são criadas pelas
// rotas do jogo (services/messages.ts).
// ============================================================================

// Quantas mensagens a caixa traz (as mais recentes)
const INBOX_LIMIT = 300

// O professor do aluno ou o ADM
async function checkCanMessage(user: AuthUser, studentId: string) {
    const student = await db.selectFrom('students').select(['id', 'teacherId']).where('id', '=', studentId).executeTakeFirst()

    if (!student) throw new NotFoundError('Aluno não encontrado!')

    if (user.role !== 'professor' || !(user.isAdmin || user.id === student.teacherId)) {
        throw new ForbiddenError('Você não tem acesso a esse aluno.')
    }
}

export async function messagesRoutes(app: FastifyInstance) {
    const messageParamsSchema = z.object({
        id: z.uuid(),
    })

    // O que o professor escreve: só aviso ou mensagem (os outros tipos são automáticos)
    const composeBodySchema = z.object({
        kind: z.enum(['aviso', 'mensagem']),
        body: z.string().trim().min(1).max(MESSAGE_MAX_LENGTH),
    })

    // Consultando mensagens, mais recentes primeiro:
    // - aluno: a própria caixa;
    // - professor/ADM: a caixa de um aluno dele (?studentId=...), pra ver o
    //   histórico na ficha e se cada mensagem já foi lida.
    app.get('/', { preHandler: ensureAuthenticated }, async (request) => {
        const getMessagesQuerySchema = z.object({
            studentId: z.uuid().optional(),
        })

        const { studentId } = getMessagesQuerySchema.parse(request.query)
        const user = request.user!

        let ownerId = user.id

        if (user.role === 'professor') {
            existsOrError(studentId, 'Escolha o aluno (studentId).')
            await checkCanMessage(user, studentId!)
            ownerId = studentId!
        }

        const messages = await messagesQuery()
            .where('studentId', '=', ownerId)
            .orderBy('createdAt', 'desc')
            .limit(INBOX_LIMIT)
            .execute()

        return { messages }
    })

    // Mandando uma mensagem pra um aluno (o professor dele ou o ADM)
    app.post('/', { preHandler: ensureTeacher }, async (request, reply) => {
        const insertMessageBodySchema = composeBodySchema.extend({
            studentId: z.uuid(),
        })

        const { studentId, kind, body } = insertMessageBodySchema.parse(request.body)
        const user = request.user!

        await checkCanMessage(user, studentId)

        const message = await db
            .insertInto('messages')
            .values({ studentId, kind, body, senderId: user.id })
            .returning(['id', 'studentId', 'senderId', 'kind', 'body', 'audience', 'broadcastId', 'createdAt', 'readAt'])
            .executeTakeFirstOrThrow()

        return reply.status(201).send({ message })
    })

    // Mandando um comunicado pros alunos do professor: a turma toda ou uma
    // casa. Cada aluno ganha a própria cópia (com o próprio "lida"), todas
    // ligadas pelo mesmo broadcastId.
    app.post('/broadcast', { preHandler: ensureTeacher }, async (request, reply) => {
        const broadcastBodySchema = composeBodySchema.extend({
            audience: z.discriminatedUnion('type', [
                z.object({ type: z.literal('turma') }),
                z.object({ type: z.literal('casa'), houseId: z.enum(HOUSES) }),
            ]),
        })

        const { audience, kind, body } = broadcastBodySchema.parse(request.body)
        const user = request.user!

        let query = db.selectFrom('students').select('id').where('teacherId', '=', user.id)
        if (audience.type === 'casa') query = query.where('houseId', '=', audience.houseId)

        const recipients = await query.execute()

        if (recipients.length === 0) throw new ValidationError('Nenhum aluno nesse grupo ainda.')

        const broadcastId = randomUUID()

        await sendMessages(db, recipients.map((s) => ({
            studentId: s.id,
            kind,
            body,
            senderId: user.id,
            audience: audience as MessageAudience,
            broadcastId,
        })))

        return reply.status(201).send({ broadcastId, sent: recipients.length })
    })

    // Consultando os comunicados que o professor já mandou, com quantos alunos
    // já leram cada um (as cópias são agrupadas pelo broadcastId)
    app.get('/broadcasts', { preHandler: ensureTeacher }, async (request) => {
        const rows = await db
            .selectFrom('messages')
            .select(['broadcastId', 'kind', 'body'])
            .select((eb) => [
                eb.fn.min('createdAt').as('createdAt'),
                eb.fn.countAll<string>().as('total'),
                eb.fn.count<string>('readAt').as('read'),
                // todas as cópias têm o mesmo público: pega o da primeira
                sql<MessageAudience>`(array_agg(audience))[1]`.as('audience'),
            ])
            .where('senderId', '=', request.user!.id)
            .where('broadcastId', 'is not', null)
            .groupBy(['broadcastId', 'kind', 'body'])
            .orderBy('createdAt', 'desc')
            .execute()

        // o count do PostgreSQL volta como texto (bigint): vira número aqui
        const broadcasts = rows.map((b) => ({ ...b, total: Number(b.total), read: Number(b.read) }))

        return { broadcasts }
    })

    // Marcando uma mensagem como lida (o aluno). Marcar de novo não muda a data.
    app.post('/:id/read', { preHandler: ensureStudent }, async (request) => {
        const { id } = messageParamsSchema.parse(request.params)
        const me = request.user!.id

        await db
            .updateTable('messages')
            .set({ readAt: new Date() })
            .where('id', '=', id)
            .where('studentId', '=', me)
            .where('readAt', 'is', null)
            .execute()

        const message = await messagesQuery().where('id', '=', id).where('studentId', '=', me).executeTakeFirst()

        if (!message) throw new NotFoundError('Mensagem não encontrada.')

        return { message }
    })

    // Marcando todas as mensagens como lidas (o aluno)
    app.post('/read-all', { preHandler: ensureStudent }, async (request) => {
        const result = await db
            .updateTable('messages')
            .set({ readAt: new Date() })
            .where('studentId', '=', request.user!.id)
            .where('readAt', 'is', null)
            .executeTakeFirst()

        return { marked: Number(result.numUpdatedRows) }
    })
}
