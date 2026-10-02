import { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../database";
import { ensureStudent } from "../middlewares/auth";
import { lockStudents, saveProgress } from "../services/progress";
import { offerItem, returnOffers } from "../services/escrow";
import { sendMessages } from "../services/messages";
import { purchaseMessage, saleMessage } from "../../../src/engine/messages";
import { findStudent } from "../utils/queries";
import { existsOrError, NotFoundError, ValidationError } from "../validation/validations";
import { Json } from "../types/database";
import { MAX_OFFER_PRICE, acceptOfferFor, takeItemForOffer } from "../../../src/engine/market";

// ============================================================================
// MERCADO — ofertas de venda de itens entre alunos. Vender pra um colega vira
// uma OFERTA: o item sai do inventário do vendedor e fica guardado na oferta
// até o comprador decidir (services/escrow.ts). As regras são as do site
// (src/engine/market.ts).
// ============================================================================

export async function offersRoutes(app: FastifyInstance) {
    const offerParamsSchema = z.object({
        id: z.uuid(),
    })

    // Consultando as ofertas do aluno logado: as que ele recebeu (pode comprar
    // ou recusar) e as que ele fez (pode cancelar), mais recentes primeiro
    app.get('/', { preHandler: ensureStudent }, async (request) => {
        const me = request.user!.id

        const offers = await db
            .selectFrom('offers')
            .selectAll()
            .where((eb) => eb.or([eb('buyerId', '=', me), eb('sellerId', '=', me)]))
            .orderBy('createdAt', 'desc')
            .execute()

        return {
            received: offers.filter((o) => o.buyerId === me),
            sent: offers.filter((o) => o.sellerId === me),
        }
    })

    // Oferecendo um item do inventário pra um colega, por um preço em moedas.
    // O item sai do inventário (e do avatar, se estava equipado) na hora.
    app.post('/', { preHandler: ensureStudent }, async (request, reply) => {
        const insertOfferBodySchema = z.object({
            buyerId: z.uuid(),
            itemId: z.string().min(1),
            price: z.number().int().min(0).max(MAX_OFFER_PRICE),
        })

        const { buyerId, itemId, price } = insertOfferBodySchema.parse(request.body)
        const me = request.user!.id

        if (buyerId === me) throw new ValidationError('Você não pode vender pra você mesmo.')

        const buyer = await db.selectFrom('students').select('id').where('id', '=', buyerId).executeTakeFirst()
        existsOrError(buyer, 'Aluno não encontrado.')

        const offer = await db.transaction().execute(async (trx) => {
            const seller = (await lockStudents(trx, [me])).get(me)

            if (!seller) throw new NotFoundError('Aluno não encontrado!')

            const taken = takeItemForOffer(seller, itemId, price)

            if (!taken.ok) throw new ValidationError(taken.error)

            await saveProgress(trx, taken.seller)

            return trx
                .insertInto('offers')
                .values({ sellerId: me, buyerId, item: JSON.stringify(taken.item) as Json, price })
                .returningAll()
                .executeTakeFirstOrThrow()
        })

        return reply.status(201).send({ student: await findStudent(me), offer })
    })

    // Comprando uma oferta recebida: o comprador paga, recebe o item, e o
    // vendedor recebe as moedas. Precisa ter as moedas e um espaço livre.
    app.post('/:id/accept', { preHandler: ensureStudent }, async (request) => {
        const { id } = offerParamsSchema.parse(request.params)
        const me = request.user!.id

        const offer = await db.transaction().execute(async (trx) => {
            const offer = await trx
                .selectFrom('offers')
                .selectAll()
                .where('id', '=', id)
                .where('buyerId', '=', me)
                .forUpdate()
                .executeTakeFirst()

            if (!offer) throw new NotFoundError('Essa oferta não existe mais.')

            const students = await lockStudents(trx, [offer.buyerId, offer.sellerId])
            const buyer = students.get(offer.buyerId)!
            const seller = students.get(offer.sellerId) ?? null

            const result = acceptOfferFor(buyer, seller, { item: offerItem(offer), price: offer.price })

            if (!result.ok) throw new ValidationError(result.error)

            await saveProgress(trx, result.buyer)
            if (result.seller) await saveProgress(trx, result.seller)

            await trx.deleteFrom('offers').where('id', '=', offer.id).execute()

            // 🛒 pro comprador e 💰 pro vendedor
            const item = offerItem(offer)
            await sendMessages(trx, [
                {
                    studentId: buyer.id,
                    kind: 'compra',
                    body: purchaseMessage({ item, sellerName: seller?.name ?? 'um colega', price: offer.price }),
                },
                ...(seller ? [{
                    studentId: seller.id,
                    kind: 'venda' as const,
                    body: saleMessage({ item, buyerName: buyer.name, price: offer.price }),
                }] : []),
            ])

            return offer
        })

        return { student: await findStudent(me), offer }
    })

    // Recusando (comprador) ou cancelando (vendedor) uma oferta: o item volta
    // pro vendedor (sem espaço, fica esperando espaço)
    app.delete('/:id', { preHandler: ensureStudent }, async (request) => {
        const { id } = offerParamsSchema.parse(request.params)
        const me = request.user!.id

        const offer = await db.transaction().execute(async (trx) => {
            const offer = await trx
                .selectFrom('offers')
                .selectAll()
                .where('id', '=', id)
                .where((eb) => eb.or([eb('buyerId', '=', me), eb('sellerId', '=', me)]))
                .forUpdate()
                .executeTakeFirst()

            if (!offer) throw new NotFoundError('Essa oferta não existe mais.')

            await returnOffers(trx, [offer])

            return offer
        })

        return { student: await findStudent(me), offer }
    })
}
