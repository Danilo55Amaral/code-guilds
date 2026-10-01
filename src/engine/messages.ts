// ============================================================================
// MESSAGES — as mensagens que o aluno recebe: avisos e mensagens do professor
// e as mensagens automáticas da plataforma (missão concluída, compra, venda,
// troca, presente...). Cada mensagem guarda quando foi lida (readAt) — é isso
// que alimenta o sino de notificações. Comunicados (pra turma toda ou pra uma
// casa) viram uma cópia por aluno, ligadas pelo mesmo broadcastId — assim
// cada aluno tem o seu próprio readAt.
//
// Desde a fase 4 do back end, as mensagens ficam na API. Os textos das
// mensagens automáticas (missionRewardMessage, saleMessage...) continuam
// aqui e a API importa este arquivo pra criar cada uma no servidor.
// ============================================================================

import { HouseId, getHouse } from "./houses";
import { Rarity, RARITY_META } from "./missions";

export type MessageKind = "aviso" | "mensagem" | "presente" | "missao" | "compra" | "venda" | "amizade" | "troca" | "entrega";

export const MESSAGE_KIND_META: Record<MessageKind, { label: string; plural: string; icon: string; colorClass: string; borderClass: string; bgClass: string }> = {
  aviso: { label: "Aviso", plural: "Avisos", icon: "⚠️", colorClass: "text-amber-300", borderClass: "border-amber-500/40", bgClass: "bg-amber-500/10" },
  mensagem: { label: "Mensagem", plural: "Mensagens", icon: "💬", colorClass: "text-sky-300", borderClass: "border-sky-500/40", bgClass: "bg-sky-500/10" },
  presente: { label: "Presente", plural: "Presentes", icon: "🎁", colorClass: "text-emerald-300", borderClass: "border-emerald-500/40", bgClass: "bg-emerald-500/10" },
  missao: { label: "Missão", plural: "Missões", icon: "⚔️", colorClass: "text-violet-300", borderClass: "border-violet-500/40", bgClass: "bg-violet-500/10" },
  compra: { label: "Compra", plural: "Compras", icon: "🛒", colorClass: "text-cyan-300", borderClass: "border-cyan-500/40", bgClass: "bg-cyan-500/10" },
  venda: { label: "Venda", plural: "Vendas", icon: "💰", colorClass: "text-lime-300", borderClass: "border-lime-500/40", bgClass: "bg-lime-500/10" },
  amizade: { label: "Amizade", plural: "Amizades", icon: "🤝", colorClass: "text-pink-300", borderClass: "border-pink-500/40", bgClass: "bg-pink-500/10" },
  troca: { label: "Troca", plural: "Trocas", icon: "🔄", colorClass: "text-teal-300", borderClass: "border-teal-500/40", bgClass: "bg-teal-500/10" },
  entrega: { label: "Entrega", plural: "Entregas", icon: "📝", colorClass: "text-indigo-300", borderClass: "border-indigo-500/40", bgClass: "bg-indigo-500/10" },
};

/** Ordem dos tipos nos filtros da caixa de mensagens. */
export const MESSAGE_KINDS = Object.keys(MESSAGE_KIND_META) as MessageKind[];

/** Tipos que o professor escolhe ao escrever — os outros são enviados automaticamente pela plataforma. */
export const COMPOSABLE_MESSAGE_KINDS: MessageKind[] = ["aviso", "mensagem"];

/** Remetente das mensagens automáticas da plataforma (missão concluída, compra e venda entre alunos). */
export const SYSTEM_SENDER_ID = "sistema";

type ItemSummary = { name: string; icon: string; rarity: Rarity };

function describeItem(item: ItemSummary): string {
  return `${item.icon} ${item.name} (${RARITY_META[item.rarity].label})`;
}

/** Aluno passou numa missão: o item e as recompensas daquela missão específica. */
export function missionRewardMessage(data: { mission: { title: string; icon: string }; item: ItemSummary; xp: number; coins: number }): string {
  return (
    `🏆 Missão concluída: ${data.mission.icon} ${data.mission.title}!\n\n` +
    `Como recompensa por essa missão você ganhou o item ${describeItem(data.item)}, +${data.xp} XP e ${data.coins} moedas. ` +
    `O item já está no seu Inventário.`
  );
}

/** Aluno finalizou um evento especial: a recompensa final do evento. */
export function eventRewardMessage(data: { event: { title: string; icon: string }; item: ItemSummary; xp: number; coins: number }): string {
  return (
    `🏆 Evento finalizado: ${data.event.icon} ${data.event.title}!\n\n` +
    `Você salvou a Academia! Como recompensa final você ganhou o item ${describeItem(data.item)}, +${data.xp} XP e ${data.coins} moedas. ` +
    `O item já está no seu Inventário.`
  );
}

/** Aluno concluiu uma fase de um evento em fases (que não é a última): o item lendário da fase. */
export function eventPhaseRewardMessage(data: {
  event: { title: string; icon: string };
  phase: { number: number; title: string };
  totalPhases: number;
  item: ItemSummary;
  xp: number;
  coins: number;
}): string {
  return (
    `🎁 Fase ${data.phase.number} de ${data.totalPhases} concluída: ${data.event.icon} ${data.event.title}, ${data.phase.title}!\n\n` +
    `Como recompensa da fase você ganhou o item ${describeItem(data.item)}, +${data.xp} XP e ${data.coins} moedas. ` +
    `O item já está no seu Inventário. A próxima fase chega quando o seu professor liberar!`
  );
}

function describeItems(items: ItemSummary[]): string {
  return items.map(describeItem).join(", ");
}

/** Um amigo propôs uma troca de itens. */
export function tradeProposalMessage(data: { fromName: string; give: ItemSummary[]; ask: ItemSummary[] }): string {
  return (
    `🔄 ${data.fromName} te propôs uma troca de itens!\n\n` +
    `Você recebe: ${describeItems(data.give)}.\nVocê dá: ${describeItems(data.ask)}.\n\n` +
    `Vá no Inventário pra aceitar ou recusar.`
  );
}

/** O amigo aceitou a troca que o aluno propôs. */
export function tradeAcceptedMessage(data: { friendName: string; received: ItemSummary[]; gave: ItemSummary[] }): string {
  return (
    `🔄 Troca feita com ${data.friendName}!\n\n` +
    `Você recebeu: ${describeItems(data.received)}.\nVocê deu: ${describeItems(data.gave)}.\n\n` +
    `Os itens novos já estão no seu Inventário.`
  );
}

/** O amigo recusou a troca (ou ela não pôde acontecer): os itens voltaram. */
export function tradeDeclinedMessage(data: { friendName: string; returned: ItemSummary[] }): string {
  return `🔄 ${data.friendName} não aceitou a sua proposta de troca.\n\nOs itens que você ofereceu (${describeItems(data.returned)}) voltaram pro seu Inventário.`;
}

/** O professor corrigiu a entrega e pediu pra refazer. */
export function taskRedoMessage(data: { mission: { title: string; icon: string }; reviewerName: string; feedback: string }): string {
  return (
    `↩ ${data.reviewerName} corrigiu a sua entrega da missão ${data.mission.icon} ${data.mission.title} e pediu pra você refazer.\n\n` +
    `💬 Comentário: ${data.feedback}\n\nVá em Missões, ajuste o que foi pedido e envie de novo!`
  );
}

/** Comentário do professor que vai junto da mensagem de recompensa quando a entrega é aprovada. */
export function taskApprovedNote(data: { reviewerName: string; feedback: string }): string {
  return `\n\n📝 Entrega aprovada por ${data.reviewerName}!` + (data.feedback ? `\n💬 Comentário: ${data.feedback}` : "");
}

/** Aviso que vai no fim da mensagem quando o item ganho não coube no inventário. */
export const PENDING_ITEM_NOTE =
  "\n\n📦 Seu inventário estava cheio, então o item ficou guardado em \"Esperando espaço\", no Inventário. Libere espaço (ou use um item de espaço) pra pegar ele.";

/** Aluno recebeu um pedido de amizade. */
export function friendRequestMessage(fromName: string): string {
  return `🤝 ${fromName} te mandou um pedido de amizade!\n\nVá em Amigos pra aceitar ou recusar. Amigos podem conversar com balões de fala.`;
}

/** O pedido de amizade que o aluno mandou foi aceito. */
export function friendAcceptedMessage(friendName: string): string {
  return `🤝 ${friendName} aceitou o seu pedido de amizade!\n\nAgora vocês são amigos e já podem conversar em Amigos.`;
}

/** Comprador: a compra de um colega deu certo. */
export function purchaseMessage(data: { item: ItemSummary; sellerName: string; price: number }): string {
  return (
    `🛒 Compra realizada com sucesso! Você comprou ${describeItem(data.item)} de ${data.sellerName} por ${data.price} moedas.\n\n` +
    `O item já está no seu Inventário.`
  );
}

/** Comprador: compra na Loja da Academia. */
export function shopPurchaseMessage(data: { item: ItemSummary; price: number; isCosmetic: boolean }): string {
  return (
    `🛍️ Compra na Loja realizada com sucesso! Você comprou ${describeItem(data.item)} por ${data.price} moedas.\n\n` +
    (data.isCosmetic
      ? "É um visual pro seu avatar: vá ao Inventário e clique em 👕 Equipar pra usar."
      : "O item já está no seu Inventário.")
  );
}

/** Vendedor: o colega aceitou a oferta. */
export function saleMessage(data: { item: ItemSummary; buyerName: string; price: number }): string {
  return (
    `💰 Venda realizada com sucesso! ${data.buyerName} comprou o seu item ${describeItem(data.item)} por ${data.price} moedas.\n\n` +
    `As moedas já foram somadas ao seu saldo.`
  );
}

/**
 * Texto da mensagem de parabéns que o aluno recebe quando o professor ou o ADM
 * dá um item pra ele pela ficha do aluno.
 */
export function itemGiftMessage(data: {
  studentName: string;
  item: ItemSummary;
  giverName: string;
  giverRole: "professor" | "adm";
}): string {
  const from = data.giverRole === "adm" ? `pela Administração da Academia (ADM ${data.giverName})` : `pelo Professor ${data.giverName}`;
  return (
    `🎉 Parabéns, ${data.studentName}! Você ganhou um presente: ${describeItem(data.item)}, ` +
    `dado ${from}.\n\nO item já está no seu Inventário — clique nele pra ver a descrição.`
  );
}

export interface Message {
  id: string;
  studentId: string;
  kind: MessageKind;
  body: string;
  createdAt: string;
  readAt: string | null;
  audience?: MessageAudience | null;
  broadcastId?: string | null;
  senderId?: string | null; // professor que enviou; null = mensagem automática da plataforma
}

/** Pra quem um comunicado foi enviado. Mensagens individuais não têm audience. */
export type MessageAudience = { type: "turma" } | { type: "casa"; houseId: HouseId };

/** Um comunicado visto pelo professor: as cópias agrupadas, com quantos já leram. */
export interface BroadcastSummary {
  broadcastId: string;
  audience: MessageAudience;
  kind: MessageKind;
  body: string;
  createdAt: string;
  total: number;
  read: number;
}

const MESSAGES_KEY = "cg-messages";

export const MESSAGE_MAX_LENGTH = 1000;

/** "23/09/2026 às 14:05" — usado no sino, na caixa de mensagens e no histórico do professor. */
export function formatMessageDate(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  const time = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${date} às ${time}`;
}

/** "Toda a turma" ou "Casa Ignis". */
export function audienceLabel(audience: MessageAudience): string {
  return audience.type === "turma" ? "Toda a turma" : getHouse(audience.houseId).name;
}

// ---------------------------------------------------------------------------
// Cache das mensagens (fase 4 do back end)
//
// As mensagens são da API (tabela messages): o aluno logado tem as dele no
// cache, e o professor, as do aluno que abriu na ficha. Mandar, marcar como
// lida e os comunicados ficam em engine/messagesApi.ts. As mensagens
// automáticas (missão, compra, troca...) a própria API cria.
// Este arquivo não pode importar nada com "@/": a API usa os textos acima.
// ---------------------------------------------------------------------------

function readAll(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(MESSAGES_KEY);
    return raw ? (JSON.parse(raw) as Message[]) : [];
  } catch {
    return [];
  }
}

function writeAll(messages: Message[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

/** Mensagens de um aluno, mais recentes primeiro. */
export function listMessages(studentId: string): Message[] {
  return readAll()
    .filter((m) => m.studentId === studentId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Troca, no cache, as mensagens de um aluno pelas que a API devolveu. */
export function saveMessagesOf(studentId: string, messages: Message[]) {
  writeAll([...readAll().filter((m) => m.studentId !== studentId), ...messages]);
}

/** Uma mensagem nova ou alterada (lida) que a API confirmou. */
export function rememberMessage(message: Message) {
  writeAll([...readAll().filter((m) => m.id !== message.id), message]);
}

/** Todas as mensagens do aluno ficam lidas no cache (a API já marcou). */
export function markAllReadInCache(studentId: string) {
  const now = new Date().toISOString();
  writeAll(readAll().map((m) => (m.studentId === studentId && !m.readAt ? { ...m, readAt: now } : m)));
}

/** Esvazia o cache (ninguém logado, ou outra pessoa entrou neste navegador). */
export function forgetMessages() {
  writeAll([]);
}

/** Usado quando o aluno é excluído — não deixa mensagens órfãs no cache. */
export function deleteMessagesOf(studentId: string) {
  writeAll(readAll().filter((m) => m.studentId !== studentId));
}
