import { FastifyInstance } from "fastify";
import { Kysely } from "kysely";
import { z } from "zod";
import { db } from "../database";
import { DB } from "../types/database";
import { ensureStudent } from "../middlewares/auth";
import { ValidationError } from "../validation/validations";
import { CHAT_HISTORY_LIMIT, getPhrase } from "../../../src/engine/friends";

// ============================================================================
// CONVERSA ENTRE AMIGOS — só com balões prontos. O aluno manda o id do balão
// e a API confere no catálogo do site (src/engine/friends.ts): balão que não
// existe é recusado, então nenhum texto livre entra na conversa.
// ============================================================================

// Tempo mínimo entre dois balões pro mesmo amigo (evita enxurrada)
const SEND_COOLDOWN_MS = 1000

// As mensagens entre dois alunos, não importa quem mandou
function betweenPair(executor: Kysely<DB>, a: string, b: string) {
    return executor
        .selectFrom('chatMessages')
        .where((eb) => eb.or([
            eb.and([eb('fromId', '=', a), eb('toId', '=', b)]),
            eb.and([eb('fromId', '=', b), eb('toId', '=', a)]),
        ]))
}

export async function chatsRoutes(app: FastifyInstance) {
    // Consultando as conversas do aluno logado (com todos os amigos), da mais
    // antiga pra mais nova. Cada conversa guarda no máximo 200 balões.
    app.get('/', { preHandler: ensureStudent }, async (request) => {
        const me = request.user!.id

        const messages = await db
            .selectFrom('chatMessages')
            .select(['id', 'fromId', 'toId', 'phraseId', 'sentAt', 'readAt'])
            .where((eb) => eb.or([eb('fromId', '=', me), eb('toId', '=', me)]))
            .orderBy('sentAt', 'asc')
            .execute()

        return { messages }
    })

    // Mandando um balão pra um amigo
    app.post('/', { preHandler: ensureStudent }, async (request, reply) => {
        const sendChatBodySchema = z.object({
            toId: z.uuid(),
            phraseId: z.string().min(1).max(40),
        })

        const { toId, phraseId } = sendChatBodySchema.parse(request.body)
        const me = request.user!.id

        if (!getPhrase(phraseId)) throw new ValidationError('Esse balão não existe.')

        const friendship = await db
            .selectFrom('friendships')
            .select('id')
            .where('status', '=', 'aceito')
            .where((eb) => eb.or([
                eb.and([eb('fromId', '=', me), eb('toId', '=', toId)]),
                eb.and([eb('fromId', '=', toId), eb('toId', '=', me)]),
            ]))
            .executeTakeFirst()

        if (!friendship) throw new ValidationError('Vocês precisam ser amigos pra conversar.')

        const last = await db
            .selectFrom('chatMessages')
            .select('sentAt')
            .where('fromId', '=', me)
            .where('toId', '=', toId)
            .orderBy('sentAt', 'desc')
            .executeTakeFirst()

        if (last && Date.now() - last.sentAt.getTime() < SEND_COOLDOWN_MS) {
            throw new ValidationError('Calma! Espere um pouquinho pra mandar outro balão.')
        }

        const message = await db.transaction().execute(async (trx) => {
            const message = await trx
                .insertInto('chatMessages')
                .values({ fromId: me, toId, phraseId })
                .returning(['id', 'fromId', 'toId', 'phraseId', 'sentAt', 'readAt'])
                .executeTakeFirstOrThrow()

            // Guarda só as últimas CHAT_HISTORY_LIMIT mensagens da conversa
            const tooOld = await betweenPair(trx, me, toId)
                .select('id')
                .orderBy('sentAt', 'desc')
                .offset(CHAT_HISTORY_LIMIT)
                .limit(1000)
                .execute()

            if (tooOld.length > 0) {
                await trx.deleteFrom('chatMessages').where('id', 'in', tooOld.map((m) => m.id)).execute()
            }

            return message
        })

        return reply.status(201).send({ message })
    })

    // O aluno abriu a conversa: tudo que o amigo mandou fica lido
    app.post('/:friendId/read', { preHandler: ensureStudent }, async (request) => {
        const readChatParamsSchema = z.object({
            friendId: z.uuid(),
        })

        const { friendId } = readChatParamsSchema.parse(request.params)

        const result = await db
            .updateTable('chatMessages')
            .set({ readAt: new Date() })
            .where('fromId', '=', friendId)
            .where('toId', '=', request.user!.id)
            .where('readAt', 'is', null)
            .executeTakeFirst()

        return { marked: Number(result.numUpdatedRows) }
    })
}
