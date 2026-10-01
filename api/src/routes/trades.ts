import { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../database";
import { ensureStudent } from "../middlewares/auth";
import { lockStudents, saveProgress } from "../services/progress";
import { returnTrades, tradeItems } from "../services/escrow";
import { sendMessages } from "../services/messages";
import { tradeAcceptedMessage, tradeDeclinedMessage, tradeProposalMessage } from "../../../src/engine/messages";
import { findStudent } from "../utils/queries";
import { NotFoundError, ValidationError } from "../validation/validations";
import { Json } from "../types/database";
import { TRADE_MAX_ITEMS, acceptTradeFor, proposeTradeFor } from "../../../src/engine/trades";

// ============================================================================
// TROCAS — troca de itens entre amigos. Os itens oferecidos saem do
// inventário de quem propõe e ficam guardados na proposta; os pedidos
// continuam com o amigo até ele decidir (services/escrow.ts). As regras são
// as do site (src/engine/trades.ts).
// ============================================================================

export async function tradesRoutes(app: FastifyInstance) {
    const tradeParamsSchema = z.object({
        id: z.uuid(),
    })

    // Consultando as propostas do aluno logado: as que ele recebeu (pode
    // aceitar ou recusar) e as que ele fez (pode cancelar), mais recentes primeiro
    app.get('/', { preHandler: ensureStudent }, async (request) => {
        const me = request.user!.id

        const trades = await db
            .selectFrom('trades')
            .selectAll()
            .where((eb) => eb.or([eb('toId', '=', me), eb('fromId', '=', me)]))
            .orderBy('createdAt', 'desc')
            .execute()

        return {
            received: trades.filter((t) => t.toId === me),
            sent: trades.filter((t) => t.fromId === me),
        }
    })

    // Propondo uma troca pra um amigo: os itens que vai dar e os itens do
    // amigo que quer receber (até 6 de cada lado, até 5 propostas esperando)
    app.post('/', { preHandler: ensureStudent }, async (request, reply) => {
        const insertTradeBodySchema = z.object({
            toId: z.uuid(),
            offeredIds: z.array(z.string().min(1)).min(1).max(TRADE_MAX_ITEMS),
            requestedIds: z.array(z.string().min(1)).min(1).max(TRADE_MAX_ITEMS),
        })

        const { toId, offeredIds, requestedIds } = insertTradeBodySchema.parse(request.body)
        const me = request.user!.id

        if (toId === me) throw new ValidationError('Escolha um amigo pra trocar.')

        const trade = await db.transaction().execute(async (trx) => {
            // A amizade fica travada (for share) até a proposta ser salva: se o
            // amigo desfizer a amizade ao mesmo tempo, ele espera esta proposta
            // terminar e depois a cancela junto (rota DELETE /friends/:id)
            const friendship = await trx
                .selectFrom('friendships')
                .select('id')
                .where('status', '=', 'aceito')
                .where((eb) => eb.or([
                    eb.and([eb('fromId', '=', me), eb('toId', '=', toId)]),
                    eb.and([eb('fromId', '=', toId), eb('toId', '=', me)]),
                ]))
                .forShare()
                .executeTakeFirst()

            if (!friendship) throw new ValidationError('Vocês precisam ser amigos pra trocar itens.')

            const students = await lockStudents(trx, [me, toId])
            const from = students.get(me)!
            const to = students.get(toId)

            if (!to) throw new NotFoundError('Aluno não encontrado.')

            // Contado com a linha do aluno travada: duas propostas ao mesmo
            // tempo não passam juntas do limite
            const { pending } = await trx
                .selectFrom('trades')
                .select((eb) => eb.fn.countAll<number>().as('pending'))
                .where('fromId', '=', me)
                .executeTakeFirstOrThrow()

            const result = proposeTradeFor(from, to, offeredIds, requestedIds, Number(pending))

            if (!result.ok) throw new ValidationError(result.error)

            await saveProgress(trx, result.from)

            // 🔄 o amigo fica sabendo da proposta
            await sendMessages(trx, [{
                studentId: toId,
                kind: 'troca',
                body: tradeProposalMessage({ fromName: from.name, give: result.offered, ask: result.requested }),
            }])

            return trx
                .insertInto('trades')
                .values({
                    fromId: me,
                    toId,
                    offered: JSON.stringify(result.offered) as Json,
                    requestedIds: JSON.stringify(result.requestedIds) as Json,
                    requested: JSON.stringify(result.requested) as Json,
                })
                .returningAll()
                .executeTakeFirstOrThrow()
        })

        return reply.status(201).send({ student: await findStudent(me), trade })
    })

    // Aceitando uma proposta recebida: troca tudo de uma vez, se o aluno ainda
    // tiver todos os itens pedidos e os itens recebidos couberem no inventário
    app.post('/:id/accept', { preHandler: ensureStudent }, async (request) => {
        const { id } = tradeParamsSchema.parse(request.params)
        const me = request.user!.id

        const trade = await db.transaction().execute(async (trx) => {
            const trade = await trx
                .selectFrom('trades')
                .selectAll()
                .where('id', '=', id)
                .where('toId', '=', me)
                .forUpdate()
                .executeTakeFirst()

            if (!trade) throw new NotFoundError('Essa proposta não existe mais.')

            const students = await lockStudents(trx, [trade.fromId, trade.toId])
            const from = students.get(trade.fromId)!
            const to = students.get(trade.toId)!

            const result = acceptTradeFor(from, to, tradeItems(trade))

            if (!result.ok) throw new ValidationError(result.error)

            await saveProgress(trx, result.from)
            await saveProgress(trx, result.to)

            await trx.deleteFrom('trades').where('id', '=', trade.id).execute()

            // 🔄 quem propôs fica sabendo que a troca foi feita
            await sendMessages(trx, [{
                studentId: from.id,
                kind: 'troca',
                body: tradeAcceptedMessage({ friendName: to.name, received: result.received, gave: tradeItems(trade).offered }),
            }])

            return trade
        })

        return { student: await findStudent(me), trade }
    })

    // Recusando (quem recebeu) ou cancelando (quem propôs) uma proposta: os
    // itens oferecidos voltam pra quem propôs (sem espaço, ficam esperando espaço)
    app.delete('/:id', { preHandler: ensureStudent }, async (request) => {
        const { id } = tradeParamsSchema.parse(request.params)
        const me = request.user!.id

        const trade = await db.transaction().execute(async (trx) => {
            const trade = await trx
                .selectFrom('trades')
                .selectAll()
                .where('id', '=', id)
                .where((eb) => eb.or([eb('toId', '=', me), eb('fromId', '=', me)]))
                .forUpdate()
                .executeTakeFirst()

            if (!trade) throw new NotFoundError('Essa proposta não existe mais.')

            await returnTrades(trx, [trade])

            // Recusada pelo amigo: quem propôs recebe o aviso 🔄 (cancelar a
            // própria proposta não manda mensagem)
            if (trade.toId === me) {
                const friend = await trx.selectFrom('students').select('name').where('id', '=', me).executeTakeFirst()

                await sendMessages(trx, [{
                    studentId: trade.fromId,
                    kind: 'troca',
                    body: tradeDeclinedMessage({ friendName: friend?.name ?? 'Seu amigo', returned: tradeItems(trade).offered }),
                }])
            }

            return trade
        })

        return { student: await findStudent(me), trade }
    })
}
