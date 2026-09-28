import { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../database";
import { ensureStudent } from "../middlewares/auth";
import { returnTrades } from "../services/escrow";
import { findStudent } from "../utils/queries";
import { existsOrError, NotFoundError, ValidationError } from "../validation/validations";

// ============================================================================
// AMIGOS — pedidos de amizade entre alunos. Trocar itens só é permitido entre
// amigos, por isso as amizades ficam no servidor. A conversa com balões
// continua no navegador até a fase 4 (mensagens).
// ============================================================================

// As colunas de um vínculo (pedido pendente ou amizade), no formato do site
function friendshipsQuery() {
    return db
        .selectFrom('friendships')
        .select(['id', 'fromId', 'toId', 'status', 'createdAt', 'acceptedAt'])
}

// O vínculo entre dois alunos, não importa quem mandou o pedido
function friendshipBetween(a: string, b: string) {
    return friendshipsQuery()
        .where((eb) => eb.or([
            eb.and([eb('fromId', '=', a), eb('toId', '=', b)]),
            eb.and([eb('fromId', '=', b), eb('toId', '=', a)]),
        ]))
        .executeTakeFirst()
}

export async function friendsRoutes(app: FastifyInstance) {
    const friendshipParamsSchema = z.object({
        id: z.uuid(),
    })

    // Consultando os vínculos do aluno logado: amigos e pedidos (recebidos e enviados)
    app.get('/', { preHandler: ensureStudent }, async (request) => {
        const me = request.user!.id

        const friendships = await friendshipsQuery()
            .where((eb) => eb.or([eb('fromId', '=', me), eb('toId', '=', me)]))
            .orderBy('createdAt', 'asc')
            .execute()

        return { friendships }
    })

    // Mandando um pedido de amizade. Se o outro aluno já tinha mandado um
    // pedido pra este, os dois viram amigos na hora (accepted: true).
    app.post('/', { preHandler: ensureStudent }, async (request, reply) => {
        const insertFriendshipBodySchema = z.object({
            toId: z.uuid(),
        })

        const { toId } = insertFriendshipBodySchema.parse(request.body)
        const me = request.user!.id

        if (toId === me) throw new ValidationError('Você não pode mandar um pedido pra você mesmo.')

        const other = await db.selectFrom('students').select('id').where('id', '=', toId).executeTakeFirst()
        existsOrError(other, 'Aluno não encontrado.')

        const existing = await friendshipBetween(me, toId)

        if (existing?.status === 'aceito') throw new ValidationError('Vocês já são amigos.')
        if (existing && existing.fromId === me) throw new ValidationError('Você já mandou um pedido pra esse aluno.')

        if (existing) {
            const friendship = await db
                .updateTable('friendships')
                .set({ status: 'aceito', acceptedAt: new Date() })
                .where('id', '=', existing.id)
                .returning(['id', 'fromId', 'toId', 'status', 'createdAt', 'acceptedAt'])
                .executeTakeFirstOrThrow()

            return { friendship, accepted: true }
        }

        const friendship = await db
            .insertInto('friendships')
            .values({ fromId: me, toId })
            .returning(['id', 'fromId', 'toId', 'status', 'createdAt', 'acceptedAt'])
            .executeTakeFirstOrThrow()

        return reply.status(201).send({ friendship, accepted: false })
    })

    // Aceitando um pedido recebido
    app.post('/:id/accept', { preHandler: ensureStudent }, async (request) => {
        const { id } = friendshipParamsSchema.parse(request.params)
        const me = request.user!.id

        const friendship = await db
            .updateTable('friendships')
            .set({ status: 'aceito', acceptedAt: new Date() })
            .where('id', '=', id)
            .where('toId', '=', me)
            .where('status', '=', 'pendente')
            .returning(['id', 'fromId', 'toId', 'status', 'createdAt', 'acceptedAt'])
            .executeTakeFirst()

        if (!friendship) throw new NotFoundError('Pedido de amizade não encontrado.')

        return { friendship }
    })

    // Recusando (quem recebeu) ou cancelando (quem mandou) um pedido, ou
    // desfazendo uma amizade. Desfazer a amizade cancela as propostas de troca
    // entre os dois, e os itens oferecidos voltam pra quem propôs.
    app.delete('/:id', { preHandler: ensureStudent }, async (request) => {
        const { id } = friendshipParamsSchema.parse(request.params)
        const me = request.user!.id

        await db.transaction().execute(async (trx) => {
            const friendship = await trx
                .selectFrom('friendships')
                .select(['id', 'fromId', 'toId', 'status'])
                .where('id', '=', id)
                .where((eb) => eb.or([eb('fromId', '=', me), eb('toId', '=', me)]))
                .forUpdate()
                .executeTakeFirst()

            if (!friendship) throw new NotFoundError('Amizade não encontrada.')

            if (friendship.status === 'aceito') {
                const { fromId: a, toId: b } = friendship

                const trades = await trx
                    .selectFrom('trades')
                    .selectAll()
                    .where((eb) => eb.or([
                        eb.and([eb('fromId', '=', a), eb('toId', '=', b)]),
                        eb.and([eb('fromId', '=', b), eb('toId', '=', a)]),
                    ]))
                    .forUpdate()
                    .execute()

                await returnTrades(trx, trades)
            }

            await trx.deleteFrom('friendships').where('id', '=', id).execute()
        })

        // Se o aluno logado tinha propostas pro ex-amigo, os itens voltaram pra ele
        return { student: await findStudent(me) }
    })
}
