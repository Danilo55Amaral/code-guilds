import { Selectable, Transaction } from "kysely";
import { DB, Offers, Trades } from "../types/database";
import { lockStudents, saveProgress } from "./progress";
import { InventoryItem } from "../../../src/engine/students";
import { returnOfferItem } from "../../../src/engine/market";
import { returnTradeItems } from "../../../src/engine/trades";

// ============================================================================
// ITENS GUARDADOS — ofertas do Mercado e propostas de troca.
//
// Enquanto a outra pessoa não decide, o item da oferta (e os itens oferecidos
// numa troca) ficam guardados na própria linha da oferta/troca, fora do
// inventário de quem ofereceu. Quando ela é recusada, cancelada ou precisa
// sumir (amizade desfeita, aluno excluído), os itens VOLTAM pra quem ofereceu
// (sem espaço no inventário, ficam esperando espaço: nada se perde).
//
// As funções daqui rodam dentro da transação de quem chama, que já deve ter
// travado as ofertas/trocas (select ... for update). A ordem das travas é
// sempre a mesma em toda a API: primeiro a oferta/troca, depois os alunos
// (em ordem de id, no lockStudents).
// ============================================================================

export type OfferRow = Selectable<Offers>
export type TradeRow = Selectable<Trades>

// Os campos jsonb chegam como Json: aqui eles ganham o tipo do site
export function offerItem(offer: OfferRow) {
    return offer.item as unknown as InventoryItem
}

export function tradeItems(trade: TradeRow) {
    return {
        offered: trade.offered as unknown as InventoryItem[],
        requestedIds: trade.requestedIds as unknown as string[],
        requested: trade.requested as unknown as InventoryItem[],
    }
}

// Devolve o item de cada oferta pro vendedor e apaga as ofertas
export async function returnOffers(trx: Transaction<DB>, offers: OfferRow[]) {
    if (offers.length === 0) return

    const sellers = await lockStudents(trx, offers.map((o) => o.sellerId))

    for (const offer of offers) {
        const seller = sellers.get(offer.sellerId)
        if (seller) sellers.set(seller.id, returnOfferItem(seller, { item: offerItem(offer) }))
    }

    for (const seller of sellers.values()) await saveProgress(trx, seller)

    await trx.deleteFrom('offers').where('id', 'in', offers.map((o) => o.id)).execute()
}

// Devolve os itens oferecidos em cada proposta pra quem propôs e apaga as propostas
export async function returnTrades(trx: Transaction<DB>, trades: TradeRow[]) {
    if (trades.length === 0) return

    const proposers = await lockStudents(trx, trades.map((t) => t.fromId))

    for (const trade of trades) {
        const from = proposers.get(trade.fromId)
        if (from) proposers.set(from.id, returnTradeItems(from, tradeItems(trade)))
    }

    for (const from of proposers.values()) await saveProgress(trx, from)

    await trx.deleteFrom('trades').where('id', 'in', trades.map((t) => t.id)).execute()
}

// Aluno sendo excluído: as ofertas e propostas que ele RECEBEU devolvem os
// itens pra quem ofereceu. As que ele FEZ somem junto com ele (on delete
// cascade), com os itens dele.
export async function returnEscrowOfDeletedStudent(trx: Transaction<DB>, studentId: string) {
    const offers = await trx.selectFrom('offers').selectAll().where('buyerId', '=', studentId).forUpdate().execute()
    const trades = await trx.selectFrom('trades').selectAll().where('toId', '=', studentId).forUpdate().execute()

    // Trava todo mundo de uma vez (na ordem do id), antes de devolver: as
    // travas de dentro do returnOffers/returnTrades já estão com esta transação
    await lockStudents(trx, [studentId, ...offers.map((o) => o.sellerId), ...trades.map((t) => t.fromId)])

    await returnOffers(trx, offers)
    await returnTrades(trx, trades)
}
