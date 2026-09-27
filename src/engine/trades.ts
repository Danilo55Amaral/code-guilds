// ============================================================================
// TROCAS — troca de itens entre amigos. Mesmo padrão de CRUD em localStorage
// de market.ts/friends.ts.
//
// Quem propõe escolhe um amigo, os itens que vai dar e os itens do amigo que
// quer receber. Os itens oferecidos saem do inventário de quem propõe e ficam
// guardados na proposta (não dá pra usar, vender ou trocar duas vezes). Os
// itens pedidos continuam com o amigo até ele decidir: aceitar troca tudo de
// uma vez (se ele ainda tiver todos os itens pedidos); recusar, ou quem propôs
// cancelar, devolve os itens oferecidos. Cada lado recebe uma mensagem 🔄 Troca.
// ============================================================================

import { InventoryItem, Student, getStudent, inventoryCapacity, inventoryFullError, removeItem, storeItems, updateStudent } from "./students";
import { normalizeRewardItem } from "./missions";
import { areFriends } from "./friends";
import { SYSTEM_SENDER_ID, sendMessage, tradeAcceptedMessage, tradeDeclinedMessage, tradeProposalMessage } from "./messages";

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

export function proposeTrade(data: { fromId: string; toId: string; offeredIds: string[]; requestedIds: string[] }): TradeResult {
  const from = getStudent(data.fromId);
  const to = getStudent(data.toId);
  if (!from || !to) return { ok: false, error: "Aluno não encontrado." };
  if (from.id === to.id) return { ok: false, error: "Escolha um amigo pra trocar." };
  if (!areFriends(from.id, to.id)) return { ok: false, error: "Vocês precisam ser amigos pra trocar itens." };
  const offeredIds = Array.from(new Set(data.offeredIds));
  const requestedIds = Array.from(new Set(data.requestedIds));
  if (offeredIds.length === 0 || requestedIds.length === 0) return { ok: false, error: "Escolha pelo menos um item seu e um item do seu amigo." };
  if (offeredIds.length > TRADE_MAX_ITEMS || requestedIds.length > TRADE_MAX_ITEMS) return { ok: false, error: `No máximo ${TRADE_MAX_ITEMS} itens de cada lado.` };
  if (listTradesFrom(from.id).length >= TRADE_MAX_PENDING) {
    return { ok: false, error: `Você já tem ${TRADE_MAX_PENDING} propostas esperando resposta. Espere uma resposta ou cancele uma delas.` };
  }
  const offered = offeredIds.map((id) => from.inventory.find((i) => i.id === id));
  if (offered.some((i) => !i)) return { ok: false, error: "Um dos seus itens não está mais no seu inventário." };
  const requested = requestedIds.map((id) => to.inventory.find((i) => i.id === id));
  if (requested.some((i) => !i)) return { ok: false, error: `Um dos itens pedidos não está mais com ${to.name}.` };

  // Os itens oferecidos ficam guardados na proposta até o amigo decidir (e saem do avatar, se estavam equipados).
  const withoutOffered = offeredIds.reduce((s, id) => removeItem(s, id), from);
  updateStudent(from.id, { inventory: withoutOffered.inventory, equipped: withoutOffered.equipped });
  const trade: Trade = {
    id: `t_${Date.now()}_${Math.round(Math.random() * 9999)}`,
    fromId: from.id,
    toId: to.id,
    offered: offered as InventoryItem[],
    requestedIds,
    requested: requested as InventoryItem[],
    createdAt: new Date().toISOString(),
  };
  writeAll([...readAll(), trade]);
  sendMessage({
    studentId: to.id,
    senderId: SYSTEM_SENDER_ID,
    kind: "troca",
    body: tradeProposalMessage({ fromName: from.name, give: trade.offered, ask: trade.requested }),
  });
  return { ok: true };
}

/** Devolve os itens oferecidos a quem propôs (sem espaço, eles ficam esperando espaço: nada se perde). */
function returnOffered(trade: Trade) {
  const from = getStudent(trade.fromId);
  if (!from) return;
  const back = storeItems(from, trade.offered);
  updateStudent(from.id, { inventory: back.inventory, pendingItems: back.pendingItems });
}

/** Quantos itens o amigo teria depois de aceitar: tem que caber no inventário dele (se a troca aumentar o total). */
export function tradeFitsFor(to: Student, trade: Trade): boolean {
  const after = to.inventory.length - trade.requestedIds.length + trade.offered.length;
  return trade.offered.length <= trade.requestedIds.length || after <= inventoryCapacity(to);
}

export function acceptTrade(tradeId: string): TradeResult {
  const trade = readAll().find((t) => t.id === tradeId);
  if (!trade) return { ok: false, error: "Essa proposta de troca não existe mais." };
  const from = getStudent(trade.fromId);
  const to = getStudent(trade.toId);
  if (!from || !to) return { ok: false, error: "Aluno não encontrado." };
  const requested = trade.requestedIds.map((id) => to.inventory.find((i) => i.id === id));
  if (requested.some((i) => !i)) {
    return { ok: false, error: "Você não tem mais todos os itens pedidos nessa troca (usou, vendeu ou trocou algum). Recuse a proposta pra devolver os itens do seu amigo." };
  }
  if (!tradeFitsFor(to, trade)) return { ok: false, error: inventoryFullError(to, trade.offered.length - trade.requestedIds.length) };

  const now = new Date().toISOString();
  const withoutRequested = trade.requestedIds.reduce((s, id) => removeItem(s, id), to);
  updateStudent(to.id, {
    inventory: [...withoutRequested.inventory, ...trade.offered.map((i) => ({ ...i, obtainedAt: now }))],
    equipped: withoutRequested.equipped,
  });
  // quem propôs recebe os itens pedidos (sem espaço, eles ficam esperando espaço)
  const fromAfter = storeItems(from, (requested as InventoryItem[]).map((i) => ({ ...i, obtainedAt: now })));
  updateStudent(from.id, { inventory: fromAfter.inventory, pendingItems: fromAfter.pendingItems });
  writeAll(readAll().filter((t) => t.id !== tradeId));

  sendMessage({
    studentId: from.id,
    senderId: SYSTEM_SENDER_ID,
    kind: "troca",
    body: tradeAcceptedMessage({ friendName: to.name, received: requested as InventoryItem[], gave: trade.offered }),
  });
  return { ok: true };
}

/** O amigo recusa: os itens oferecidos voltam pra quem propôs, que recebe uma mensagem. */
export function declineTrade(tradeId: string) {
  const trade = readAll().find((t) => t.id === tradeId);
  if (!trade) return;
  returnOffered(trade);
  writeAll(readAll().filter((t) => t.id !== tradeId));
  const to = getStudent(trade.toId);
  sendMessage({
    studentId: trade.fromId,
    senderId: SYSTEM_SENDER_ID,
    kind: "troca",
    body: tradeDeclinedMessage({ friendName: to?.name ?? "Seu amigo", returned: trade.offered }),
  });
}

/** Quem propôs desiste: os itens oferecidos voltam pro inventário dele. */
export function cancelTrade(tradeId: string) {
  const trade = readAll().find((t) => t.id === tradeId);
  if (!trade) return;
  returnOffered(trade);
  writeAll(readAll().filter((t) => t.id !== tradeId));
}

/** Desfazer a amizade cancela as trocas pendentes entre os dois (os itens oferecidos voltam). */
export function cancelTradesBetween(a: string, b: string) {
  const between = readAll().filter((t) => (t.fromId === a && t.toId === b) || (t.fromId === b && t.toId === a));
  if (between.length === 0) return;
  between.forEach(returnOffered);
  const ids = new Set(between.map((t) => t.id));
  writeAll(readAll().filter((t) => !ids.has(t.id)));
}

/**
 * Usado quando o aluno é excluído: propostas que ele recebeu devolvem os itens
 * pra quem propôs; propostas que ele fez somem junto com ele.
 */
export function deleteTradesOf(studentId: string) {
  readAll()
    .filter((t) => t.toId === studentId && t.fromId !== studentId)
    .forEach(returnOffered);
  writeAll(readAll().filter((t) => t.fromId !== studentId && t.toId !== studentId));
}
