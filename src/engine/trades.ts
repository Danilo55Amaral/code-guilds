// ============================================================================
// TROCAS — troca de itens entre amigos.
//
// Quem propõe escolhe um amigo, os itens que vai dar e os itens do amigo que
// quer receber. Os itens oferecidos saem do inventário de quem propõe e ficam
// guardados na proposta (não dá pra usar, vender ou trocar duas vezes). Os
// itens pedidos continuam com o amigo até ele decidir: aceitar troca tudo de
// uma vez (se ele ainda tiver todos os itens pedidos); recusar, ou quem propôs
// cancelar, devolve os itens oferecidos. Cada lado recebe uma mensagem 🔄 Troca.
//
// Desde a fase 3 do back end, as trocas são da API (tabela trades) e quem
// decide é o servidor (que também confere se os dois são amigos). Este
// arquivo ficou com as regras puras (a API importa elas) e o cache
// ("cg-trades") das propostas do aluno logado. As chamadas à API ficam em
// engine/gameApi.ts.
// ============================================================================

import { InventoryItem, Student, inventoryCapacity, inventoryFullError, removeItem, storeItems } from "./students";
import { normalizeRewardItem } from "./missions";

export interface Trade {
  id: string;
  fromId: string; // quem propôs
  toId: string; // o amigo que decide
  offered: InventoryItem[]; // itens de quem propôs, guardados na proposta
  requestedIds: string[]; // ids dos itens do amigo pedidos na troca
  requested: InventoryItem[]; // cópia dos itens pedidos (pra mostrar, mesmo se o amigo mexer no inventário)
  createdAt: string;
}

export type TradeResult = { ok: true } | { ok: false; error: string };

/** Máximo de itens de cada lado numa troca. */
export const TRADE_MAX_ITEMS = 6;
/** Máximo de propostas esperando resposta que um aluno pode ter ao mesmo tempo. */
export const TRADE_MAX_PENDING = 5;

const TRADES_KEY = "cg-trades";

function normalizeItem(item: InventoryItem): InventoryItem {
  return { ...item, ...normalizeRewardItem(item) };
}

function readAll(): Trade[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(TRADES_KEY);
    return raw ? (JSON.parse(raw) as Trade[]).map((t) => ({ ...t, offered: t.offered.map(normalizeItem), requested: t.requested.map(normalizeItem) })) : [];
  } catch {
    return [];
  }
}

function writeAll(trades: Trade[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TRADES_KEY, JSON.stringify(trades));
}

/** Troca o cache pelas propostas que a API devolveu. */
export function saveTrades(trades: Trade[]) {
  writeAll(trades);
}

/** Proposta nova que a API confirmou. */
export function rememberTrade(trade: Trade) {
  writeAll([...readAll().filter((t) => t.id !== trade.id), trade]);
}

/** Proposta que saiu (aceita, recusada ou cancelada). */
export function forgetTrade(tradeId: string) {
  writeAll(readAll().filter((t) => t.id !== tradeId));
}

/** Propostas que o aluno recebeu (pode aceitar/recusar), mais recentes primeiro. */
export function listTradesTo(studentId: string): Trade[] {
  return readAll()
    .filter((t) => t.toId === studentId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Propostas que o aluno fez (pode cancelar), mais recentes primeiro. */
export function listTradesFrom(studentId: string): Trade[] {
  return readAll()
    .filter((t) => t.fromId === studentId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Amizade desfeita: as propostas entre os dois saem do cache (a API já devolveu os itens). */
export function deleteTradesBetween(a: string, b: string) {
  writeAll(readAll().filter((t) => !((t.fromId === a && t.toId === b) || (t.fromId === b && t.toId === a))));
}

/** Aluno excluído: as propostas dele saem do cache (a API já devolveu os itens). */
export function deleteTradesOf(studentId: string) {
  writeAll(readAll().filter((t) => t.fromId !== studentId && t.toId !== studentId));
}

/** Quantos itens o amigo teria depois de aceitar: tem que caber no inventário dele (se a troca aumentar o total). */
export function tradeFitsFor(to: Student, trade: Pick<Trade, "offered" | "requestedIds">): boolean {
  const after = to.inventory.length - trade.requestedIds.length + trade.offered.length;
  return trade.offered.length <= trade.requestedIds.length || after <= inventoryCapacity(to);
}

// ============================================================================
// REGRAS — usadas pela API pra decidir cada passo. Não salvam nada. Se os
// dois são amigos, quem confere é a API (antes de chamar proposeTradeFor).
// ============================================================================

export type ProposeTradeResult =
  | { ok: true; from: Student; offered: InventoryItem[]; requestedIds: string[]; requested: InventoryItem[] }
  | { ok: false; error: string };

/**
 * Propor a troca: confere os itens dos dois lados e tira os oferecidos de quem
 * propõe (e do avatar, se estavam equipados). `pendingCount` = quantas
 * propostas quem propõe já tem esperando resposta.
 */
export function proposeTradeFor(from: Student, to: Student, offeredIdsRaw: string[], requestedIdsRaw: string[], pendingCount: number): ProposeTradeResult {
  if (from.id === to.id) return { ok: false, error: "Escolha um amigo pra trocar." };
  const offeredIds = Array.from(new Set(offeredIdsRaw));
  const requestedIds = Array.from(new Set(requestedIdsRaw));
  if (offeredIds.length === 0 || requestedIds.length === 0) return { ok: false, error: "Escolha pelo menos um item seu e um item do seu amigo." };
  if (offeredIds.length > TRADE_MAX_ITEMS || requestedIds.length > TRADE_MAX_ITEMS) return { ok: false, error: `No máximo ${TRADE_MAX_ITEMS} itens de cada lado.` };
  if (pendingCount >= TRADE_MAX_PENDING) {
    return { ok: false, error: `Você já tem ${TRADE_MAX_PENDING} propostas esperando resposta. Espere uma resposta ou cancele uma delas.` };
  }
  const offered = offeredIds.map((id) => from.inventory.find((i) => i.id === id));
  if (offered.some((i) => !i)) return { ok: false, error: "Um dos seus itens não está mais no seu inventário." };
  const requested = requestedIds.map((id) => to.inventory.find((i) => i.id === id));
  if (requested.some((i) => !i)) return { ok: false, error: `Um dos itens pedidos não está mais com ${to.name}.` };

  const withoutOffered = offeredIds.reduce((s, id) => removeItem(s, id), from);
  return { ok: true, from: withoutOffered, offered: offered as InventoryItem[], requestedIds, requested: requested as InventoryItem[] };
}

export type AcceptTradeResult = { ok: true; from: Student; to: Student; received: InventoryItem[] } | { ok: false; error: string };

/**
 * Aceitar a troca: o amigo entrega os itens pedidos e recebe os oferecidos;
 * quem propôs recebe os pedidos (sem espaço, eles ficam esperando espaço).
 */
export function acceptTradeFor(from: Student, to: Student, trade: Pick<Trade, "offered" | "requestedIds">): AcceptTradeResult {
  const requested = trade.requestedIds.map((id) => to.inventory.find((i) => i.id === id));
  if (requested.some((i) => !i)) {
    return { ok: false, error: "Você não tem mais todos os itens pedidos nessa troca (usou, vendeu ou trocou algum). Recuse a proposta pra devolver os itens do seu amigo." };
  }
  if (!tradeFitsFor(to, trade)) return { ok: false, error: inventoryFullError(to, trade.offered.length - trade.requestedIds.length) };

  const now = new Date().toISOString();
  const withoutRequested = trade.requestedIds.reduce((s, id) => removeItem(s, id), to);
  const toAfter: Student = { ...withoutRequested, inventory: [...withoutRequested.inventory, ...trade.offered.map((i) => ({ ...i, obtainedAt: now }))] };
  const received = (requested as InventoryItem[]).map((i) => ({ ...i, obtainedAt: now }));
  return { ok: true, from: storeItems(from, received), to: toAfter, received };
}

/** Recusar ou cancelar: os itens oferecidos voltam pra quem propôs (sem espaço, ficam esperando espaço). */
export function returnTradeItems(from: Student, trade: Pick<Trade, "offered">): Student {
  return storeItems(from, trade.offered);
}
