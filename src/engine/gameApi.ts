// ============================================================================
// GAME API — as ações do jogo que mudam o progresso do aluno (XP, moedas,
// itens...). Desde a fase 3 do back end, quem decide é o servidor: a tela
// pede a ação, a API aplica a regra (as mesmas funções de students.ts) e
// devolve o aluno atualizado, que vai pro cache. Assim ninguém consegue se
// dar moedas ou itens pelo DevTools.
//
// Toda função devolve { ok: true, ...o que a ação contou } ou
// { ok: false, error } com a mensagem da API pra mostrar na tela.
// ============================================================================

import { api, describeError } from "@/services/api";
import { emitChange } from "./events";
import { InventoryItem, StudentAccount, saveStudentAccounts } from "./students";
import { Offer, forgetOffer, rememberOffer } from "./market";
import { Trade, forgetTrade, rememberTrade } from "./trades";
import { GiftItem } from "./gifts";
import { RewardItem } from "./missions";
import type { EventId } from "./specialEvents";
import { refreshFromApi } from "./accounts";
import { scheduleInboxRefresh } from "./messagesApi";

export type GameResult<T = object> = ({ ok: true } & T) | { ok: false; error: string };

/** Roda a chamada, guarda o aluno que voltou no cache e avisa as telas. */
async function run<T extends object = object>(request: Promise<unknown>): Promise<GameResult<T>> {
  try {
    const { student, ...rest } = (await request) as { student: StudentAccount } & T;
    saveStudentAccounts([student]);
    emitChange();
    // a ação pode ter criado mensagens (🏆 recompensa, 🛒 compra...): o sininho busca de novo
    scheduleInboxRefresh();
    return { ok: true, ...(rest as unknown as T) };
  } catch (error) {
    return { ok: false, error: describeError(error) };
  }
}

// ---------------------------------------------------------------------------
// Inventário do aluno logado
// ---------------------------------------------------------------------------

/** O que aconteceu ao usar um item (cada tipo tem um efeito). */
export type ItemEffect =
  | { kind: "xp"; xpGained: number; leveledUp: boolean; fromLevel: number; newLevel: number }
  | { kind: "espaco"; slotsGained: number; claimed: number }
  | { kind: "multiverso" };

/** Usa um item: consumível (dá XP), de espaço (aumenta o inventário) ou a Chave do Multiverso. */
export function activateItem(itemId: string) {
  return run<{ effect: ItemEffect }>(api.post(`/inventory/${itemId}/use`));
}

/** Vende o item pro sistema pelo valor dele. */
export function sellItem(itemId: string) {
  return run<{ coinsGained: number }>(api.post(`/inventory/${itemId}/sell`));
}

/** Descarta o item (se estava equipado, sai do avatar). */
export function discardItem(itemId: string) {
  return run(api.delete(`/inventory/${itemId}`));
}

export function equipCosmetic(itemId: string) {
  return run(api.post(`/inventory/${itemId}/equip`));
}

export function unequipCosmetic(itemId: string) {
  return run(api.post(`/inventory/${itemId}/unequip`));
}

/** Guarda os itens que esperavam espaço (todos que couberem, ou só um). */
export function claimWaitingItems(itemId?: string) {
  return run<{ moved: number }>(api.post("/inventory/pending/claim", itemId ? { itemId } : undefined));
}

/** Entrou na Sala do Multiverso: o passe da Chave é gasto. */
export function enterMultiverse() {
  return run(api.post("/inventory/multiverse/enter"));
}

// ---------------------------------------------------------------------------
// Missões
// ---------------------------------------------------------------------------

/** O que a API contou sobre a tentativa do quiz. */
export interface AttemptOutcome {
  correctCount: number;
  total: number;
  passed: boolean;
  rewarded: boolean; // ganhou a recompensa agora (passou numa missão ainda não concluída)
  leveledUp?: boolean;
  fromLevel?: number;
  newLevel?: number;
  itemWaiting?: boolean; // o item da recompensa não coube e ficou esperando espaço
}

/** Manda as respostas do quiz ({ idDaPergunta: idDaOpção }); a API corrige e dá a recompensa. */
export function attemptMission(missionId: string, answers: Record<string, string>) {
  return run<AttemptOutcome>(api.post(`/missions/${missionId}/attempt`, { answers }));
}

// ---------------------------------------------------------------------------
// Eventos
// ---------------------------------------------------------------------------

/** O aluno viu (ou pulou) a abertura da fase: nas próximas vezes, "Entrar" vai direto pra tela do evento. */
export function markEventIntroSeen(eventId: EventId, phase: number) {
  return run(api.post(`/events/${eventId}/phases/${phase}/intro`));
}

/** O que a API contou sobre a fase concluída (a recompensa já está no aluno). */
export interface PhaseOutcome {
  leveledUp: boolean;
  fromLevel: number;
  newLevel: number;
  itemWaiting: boolean; // o item não coube e ficou esperando espaço
  item: RewardItem; // o item da recompensa, com as alterações que o ADM fez na Loja
  xp: number;
  coins: number;
}

/** Conclui a fase (ou o evento de uma fase só): a API confere as missões e dá a recompensa. */
export function finishEventPhase(eventId: EventId, phase: number) {
  return run<PhaseOutcome>(api.post(`/events/${eventId}/phases/${phase}/finish`));
}

// ---------------------------------------------------------------------------
// Loja
// ---------------------------------------------------------------------------

/** Compra um item da Loja: a API confere moedas, espaço e se o visual já é do aluno. */
export function buyShopItem(shopItemId: string) {
  return run<{ item: InventoryItem }>(api.post(`/shop/${shopItemId}/buy`));
}

// ---------------------------------------------------------------------------
// Mercado (ofertas entre alunos) — o cache "cg-offers" acompanha cada ação
// ---------------------------------------------------------------------------

/** Oferece um item pra um colega: o item sai do inventário e fica guardado na oferta. */
export async function createOffer(data: { buyerId: string; itemId: string; price: number }) {
  const result = await run<{ offer: Offer }>(api.post("/offers", { ...data, price: Math.round(data.price) }));
  if (result.ok) rememberOffer(result.offer);
  return result;
}

/** Compra uma oferta recebida (moedas do comprador, item pra ele, moedas pro vendedor). */
export async function acceptOffer(offerId: string) {
  const result = await run<{ offer: Offer }>(api.post(`/offers/${offerId}/accept`));
  // a oferta pode ter sumido (o vendedor cancelou): tira do cache também
  forgetOfferIfGone(result, offerId);
  return result;
}

/** Recusa (comprador) ou cancela (vendedor) uma oferta: o item volta pro vendedor. */
export async function removeOffer(offerId: string) {
  const result = await run<{ offer: Offer }>(api.delete(`/offers/${offerId}`));
  forgetOfferIfGone(result, offerId);
  return result;
}

function forgetOfferIfGone(result: GameResult, offerId: string) {
  if (result.ok || result.error.includes("não existe mais")) {
    forgetOffer(offerId);
    emitChange();
  }
}

// ---------------------------------------------------------------------------
// Trocas entre amigos — o cache "cg-trades" acompanha cada ação
// ---------------------------------------------------------------------------

/** Propõe uma troca: os itens oferecidos saem do inventário e ficam guardados na proposta. */
export async function proposeTrade(data: { toId: string; offeredIds: string[]; requestedIds: string[] }) {
  const result = await run<{ trade: Trade }>(api.post("/trades", data));
  if (result.ok) rememberTrade(result.trade);
  return result;
}

/** Aceita uma proposta recebida: os itens dos dois lados trocam de dono. */
export async function acceptTrade(tradeId: string) {
  const result = await run<{ trade: Trade }>(api.post(`/trades/${tradeId}/accept`));
  forgetTradeIfGone(result, tradeId);
  return result;
}

/** Recusa (quem recebeu) ou cancela (quem propôs) uma proposta: os itens oferecidos voltam. */
export async function removeTrade(tradeId: string) {
  const result = await run<{ trade: Trade }>(api.delete(`/trades/${tradeId}`));
  forgetTradeIfGone(result, tradeId);
  return result;
}

function forgetTradeIfGone(result: GameResult, tradeId: string) {
  if (result.ok || result.error.includes("não existe mais")) {
    forgetTrade(tradeId);
    emitChange();
  }
}

// ---------------------------------------------------------------------------
// Pelo professor / ADM
// ---------------------------------------------------------------------------

/** Tira um item do inventário de um aluno. */
export function removeStudentItem(studentId: string, itemId: string) {
  return run(api.delete(`/students/${studentId}/items/${itemId}`));
}


/** Resultado do presente: quantos receberam e, pra cada aluno, se o item ficou esperando espaço. */
export interface GiftOutcome {
  delivered: number;
  waiting: number;
  results: { studentId: string; waiting: boolean }[];
}

/**
 * Dá o item pra cada aluno da lista (cada um ganha o seu). Depois a lista de
 * alunos é buscada de novo, pra os inventários do painel mostrarem o presente.
 */
export async function giveGift(studentIds: string[], item: GiftItem): Promise<GameResult<GiftOutcome>> {
  try {
    const outcome = await api.post<GiftOutcome>("/gifts", { studentIds, item });
    void refreshFromApi(true);
    return { ok: true, ...outcome };
  } catch (error) {
    return { ok: false, error: describeError(error) };
  }
}
