// ============================================================================
// MARKET — venda de itens entre alunos.
//
// Vender pra um colega vira uma OFERTA: o item sai do inventário do vendedor e
// fica guardado na oferta até o comprador decidir. Comprar desconta as moedas
// do comprador, paga o vendedor e entrega o item; recusar (ou o vendedor
// cancelar) devolve o item pro vendedor. Assim ninguém recebe item nem perde
// moedas sem concordar, e o mesmo item não pode ser vendido duas vezes.
//
// Desde a fase 3 do back end, as ofertas são da API (tabela offers) e quem
// decide é o servidor. Este arquivo ficou com as regras puras (a API importa
// elas) e o cache ("cg-offers") das ofertas do aluno logado. As chamadas à
// API ficam em engine/gameApi.ts. As mensagens de compra e venda saem no
// store.ts, depois que a API confirma.
// ============================================================================

import { InventoryItem, Student, freeSlots, inventoryFullError, removeItem, storeItems } from "./students";
import { normalizeRewardItem } from "./missions";

export interface Offer {
  id: string;
  sellerId: string;
  buyerId: string;
  item: InventoryItem;
  price: number;
  createdAt: string;
}

export type MarketResult = { ok: true } | { ok: false; error: string };

/** Maior preço que um aluno pode pedir numa oferta. */
export const MAX_OFFER_PRICE = 100000;

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

/** Troca o cache pelas ofertas que a API devolveu. */
export function saveOffers(offers: Offer[]) {
  writeAll(offers);
}

/** Oferta nova que a API confirmou. */
export function rememberOffer(offer: Offer) {
  writeAll([...readAll().filter((o) => o.id !== offer.id), offer]);
}

/** Oferta que saiu (comprada, recusada ou cancelada). */
export function forgetOffer(offerId: string) {
  writeAll(readAll().filter((o) => o.id !== offerId));
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

/** Aluno excluído: as ofertas dele saem do cache (a API já devolveu os itens). */
export function deleteOffersOf(studentId: string) {
  writeAll(readAll().filter((o) => o.buyerId !== studentId && o.sellerId !== studentId));
}

// ============================================================================
// REGRAS — usadas pela API pra decidir cada passo. Não salvam nada.
// ============================================================================

export type TakeOfferItemResult = { ok: true; seller: Student; item: InventoryItem } | { ok: false; error: string };

/** Criar a oferta: confere o preço e tira o item do vendedor (se estava equipado, sai do avatar). */
export function takeItemForOffer(seller: Student, itemId: string, price: number): TakeOfferItemResult {
  const item = seller.inventory.find((i) => i.id === itemId);
  if (!item) return { ok: false, error: "Esse item não está mais no seu inventário." };
  if (!Number.isInteger(price) || price < 0 || price > MAX_OFFER_PRICE) return { ok: false, error: "Preço inválido." };
  return { ok: true, seller: removeItem(seller, itemId), item };
}

export type AcceptOfferResult = { ok: true; buyer: Student; seller: Student | null } | { ok: false; error: string };

/** Aceitar a oferta: o comprador paga e recebe o item; o vendedor (se ainda existe) recebe as moedas. */
export function acceptOfferFor(buyer: Student, seller: Student | null, offer: Pick<Offer, "item" | "price">): AcceptOfferResult {
  if (buyer.coins < offer.price) return { ok: false, error: `Moedas insuficientes — faltam ${offer.price - buyer.coins}.` };
  if (freeSlots(buyer) < 1) return { ok: false, error: inventoryFullError(buyer) };
  return {
    ok: true,
    buyer: { ...buyer, coins: buyer.coins - offer.price, inventory: [...buyer.inventory, { ...offer.item, obtainedAt: new Date().toISOString() }] },
    seller: seller ? { ...seller, coins: seller.coins + offer.price } : null,
  };
}

/** Recusar (comprador) ou cancelar (vendedor): o item volta pro vendedor (sem espaço, fica esperando espaço). */
export function returnOfferItem(seller: Student, offer: Pick<Offer, "item">): Student {
  return storeItems(seller, [offer.item]);
}
