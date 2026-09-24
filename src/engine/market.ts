// ============================================================================
// MARKET — venda de itens entre alunos. Mesmo padrão de CRUD em localStorage
// de students.ts/messages.ts.
//
// Vender pra um colega vira uma OFERTA: o item sai do inventário do vendedor e
// fica guardado na oferta até o comprador decidir. Comprar desconta as moedas
// do comprador, paga o vendedor e entrega o item; recusar (ou o vendedor
// cancelar) devolve o item pro vendedor. Assim ninguém recebe item nem perde
// moedas sem concordar, e o mesmo item não pode ser vendido duas vezes.
// Quando a compra fecha, comprador e vendedor recebem uma mensagem automática.
// ============================================================================

import { InventoryItem, getStudent, updateStudent } from "./students";
import { normalizeRewardItem } from "./missions";
import { SYSTEM_SENDER_ID, sendMessage, purchaseMessage, saleMessage } from "./messages";

export interface Offer {
  id: string;
  sellerId: string;
  buyerId: string;
  item: InventoryItem;
  price: number;
  createdAt: string;
}

export type MarketResult = { ok: true } | { ok: false; error: string };

const OFFERS_KEY = "cg-offers";

function readAll(): Offer[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(OFFERS_KEY);
    // ofertas feitas antes do ícone próprio: o item ganha o ícone da raridade
    return raw ? (JSON.parse(raw) as Offer[]).map((o) => ({ ...o, item: { ...o.item, ...normalizeRewardItem(o.item) } })) : [];
  } catch {
    return [];
  }
}

function writeAll(offers: Offer[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(OFFERS_KEY, JSON.stringify(offers));
}

/** Ofertas que o aluno recebeu (pode comprar/recusar), mais recentes primeiro. */
export function listOffersTo(studentId: string): Offer[] {
  return readAll()
    .filter((o) => o.buyerId === studentId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Ofertas que o aluno fez (pode cancelar), mais recentes primeiro. */
export function listOffersFrom(studentId: string): Offer[] {
  return readAll()
    .filter((o) => o.sellerId === studentId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createOffer(data: { sellerId: string; buyerId: string; itemId: string; price: number }): MarketResult {
  const seller = getStudent(data.sellerId);
  const buyer = getStudent(data.buyerId);
  if (!seller || !buyer) return { ok: false, error: "Aluno não encontrado." };
  if (seller.id === buyer.id) return { ok: false, error: "Você não pode vender pra você mesmo." };
  const item = seller.inventory.find((i) => i.id === data.itemId);
  if (!item) return { ok: false, error: "Esse item não está mais no seu inventário." };
  const price = Math.round(data.price);
  if (!Number.isFinite(price) || price < 0) return { ok: false, error: "Preço inválido." };

  // o item fica "guardado" na oferta até o comprador decidir
  updateStudent(seller.id, { inventory: seller.inventory.filter((i) => i.id !== item.id) });
  writeAll([
    ...readAll(),
    {
      id: `o_${Date.now()}_${Math.round(Math.random() * 9999)}`,
      sellerId: seller.id,
      buyerId: buyer.id,
      item,
      price,
      createdAt: new Date().toISOString(),
    },
  ]);
  return { ok: true };
}

function returnItemToSeller(offer: Offer) {
  const seller = getStudent(offer.sellerId);
  if (seller) updateStudent(seller.id, { inventory: [...seller.inventory, offer.item] });
}

export function acceptOffer(offerId: string): MarketResult {
  const offer = readAll().find((o) => o.id === offerId);
  if (!offer) return { ok: false, error: "Essa oferta não existe mais." };
  const buyer = getStudent(offer.buyerId);
  const seller = getStudent(offer.sellerId);
  if (!buyer) return { ok: false, error: "Comprador não encontrado." };
  if (buyer.coins < offer.price) return { ok: false, error: `Moedas insuficientes — faltam ${offer.price - buyer.coins}.` };

  updateStudent(buyer.id, {
    coins: buyer.coins - offer.price,
    inventory: [...buyer.inventory, { ...offer.item, obtainedAt: new Date().toISOString() }],
  });
  if (seller) updateStudent(seller.id, { coins: seller.coins + offer.price });
  writeAll(readAll().filter((o) => o.id !== offerId));

  // Os dois lados recebem a confirmação na caixa de mensagens (e no sino).
  sendMessage({
    studentId: buyer.id,
    senderId: SYSTEM_SENDER_ID,
    kind: "compra",
    body: purchaseMessage({ item: offer.item, sellerName: seller?.name ?? "um colega", price: offer.price }),
  });
  if (seller) {
    sendMessage({
      studentId: seller.id,
      senderId: SYSTEM_SENDER_ID,
      kind: "venda",
      body: saleMessage({ item: offer.item, buyerName: buyer.name, price: offer.price }),
    });
  }
  return { ok: true };
}

/** Recusar (comprador) e cancelar (vendedor) dão no mesmo: o item volta pro vendedor. */
export function withdrawOffer(offerId: string) {
  const offer = readAll().find((o) => o.id === offerId);
  if (!offer) return;
  returnItemToSeller(offer);
  writeAll(readAll().filter((o) => o.id !== offerId));
}

/**
 * Usado quando o aluno é excluído: ofertas que ele recebeu devolvem o item pro
 * vendedor; ofertas que ele fez somem junto com ele.
 */
export function deleteOffersOf(studentId: string) {
  readAll()
    .filter((o) => o.buyerId === studentId && o.sellerId !== studentId)
    .forEach(returnItemToSeller);
  writeAll(readAll().filter((o) => o.buyerId !== studentId && o.sellerId !== studentId));
}
