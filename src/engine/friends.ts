// ============================================================================
// AMIGOS E CONVERSA — pedidos de amizade entre alunos e a conversa entre
// amigos. A conversa é só com balões prontos (CHAT_PHRASES): o aluno não
// digita nada. Cada mensagem guarda apenas o id do balão, e a tela só mostra
// balões que existem no catálogo, então nenhum texto livre aparece na
// conversa, nem mexendo no localStorage.
// Mesmo padrão de CRUD em localStorage dos outros engines.
// ============================================================================

// ---------------------------------------------------------------------------
// Balões de fala
// ---------------------------------------------------------------------------

export interface ChatPhrase {
  id: string;
  text: string;
  emoji: string;
}

export interface ChatPhraseGroup {
  id: string;
  label: string;
  icon: string;
  phrases: ChatPhrase[];
}

/** Todos os balões que os alunos podem mandar, por categoria. Só frases gentis e adequadas pra qualquer idade. */
export const CHAT_PHRASE_GROUPS: ChatPhraseGroup[] = [
  {
    id: "saudacoes",
    label: "Saudações",
    icon: "👋",
    phrases: [
      { id: "oi", text: "Oi!", emoji: "👋" },
      { id: "ola", text: "Olá!", emoji: "😄" },
      { id: "bom-dia", text: "Bom dia!", emoji: "☀️" },
      { id: "boa-tarde", text: "Boa tarde!", emoji: "🌤️" },
      { id: "boa-noite", text: "Boa noite!", emoji: "🌙" },
      { id: "tudo-bem", text: "Tudo bem?", emoji: "🙂" },
      { id: "e-ai", text: "E aí, beleza?", emoji: "😎" },
      { id: "quanto-tempo", text: "Quanto tempo!", emoji: "⏳" },
    ],
  },
  {
    id: "respostas",
    label: "Respostas",
    icon: "💬",
    phrases: [
      { id: "sim", text: "Sim!", emoji: "✅" },
      { id: "nao", text: "Não.", emoji: "❌" },
      { id: "talvez", text: "Talvez...", emoji: "🤔" },
      { id: "claro", text: "Claro!", emoji: "👍" },
      { id: "tudo-otimo", text: "Tudo ótimo!", emoji: "😁" },
      { id: "estou-bem", text: "Estou bem, e você?", emoji: "😊" },
      { id: "entendi", text: "Entendi!", emoji: "💡" },
      { id: "nao-entendi", text: "Não entendi...", emoji: "❓" },
      { id: "pode-ser", text: "Pode ser!", emoji: "👌" },
      { id: "agora-nao", text: "Agora não posso.", emoji: "⏰" },
      { id: "espera", text: "Espera um pouquinho!", emoji: "✋" },
      { id: "beleza", text: "Beleza!", emoji: "🤙" },
    ],
  },
  {
    id: "missoes",
    label: "Missões",
    icon: "⚔️",
    phrases: [
      { id: "vamos-missao", text: "Vamos fazer uma missão?", emoji: "⚔️" },
      { id: "vamos", text: "Vamos!", emoji: "🚀" },
      { id: "qual-missao", text: "Qual missão você está fazendo?", emoji: "🗺️" },
      { id: "ja-fiz", text: "Já fiz essa missão!", emoji: "✅" },
      { id: "missao-dificil", text: "Essa missão é difícil!", emoji: "😅" },
      { id: "consegui", text: "Consegui passar!", emoji: "🏆" },
      { id: "quase", text: "Quase consegui!", emoji: "😬" },
      { id: "tentar-de-novo", text: "Vou tentar de novo!", emoji: "🔁" },
      { id: "me-ajuda", text: "Me ajuda nessa missão?", emoji: "🙋" },
      { id: "leia-explicacao", text: "Leia a explicação, ajuda muito!", emoji: "📖" },
      { id: "subi-nivel", text: "Subi de nível!", emoji: "⬆️" },
      { id: "item-novo", text: "Ganhei um item novo!", emoji: "🎁" },
    ],
  },
  {
    id: "incentivo",
    label: "Incentivo",
    icon: "🌟",
    phrases: [
      { id: "parabens", text: "Parabéns!", emoji: "🎉" },
      { id: "mandou-bem", text: "Mandou bem!", emoji: "👏" },
      { id: "voce-consegue", text: "Você consegue!", emoji: "💪" },
      { id: "nao-desista", text: "Não desista!", emoji: "🔥" },
      { id: "muito-legal", text: "Muito legal!", emoji: "🤩" },
      { id: "arrasou", text: "Arrasou!", emoji: "🌟" },
      { id: "voce-e-demais", text: "Você é demais!", emoji: "⭐" },
      { id: "boa-sorte", text: "Boa sorte!", emoji: "🍀" },
      { id: "valeu", text: "Valeu!", emoji: "🙏" },
      { id: "de-nada", text: "De nada!", emoji: "😊" },
    ],
  },
  {
    id: "academia",
    label: "Academia",
    icon: "🏰",
    phrases: [
      { id: "vamos-evento", text: "Vamos pro evento?", emoji: "📅" },
      { id: "viu-loja", text: "Viu as novidades da Loja?", emoji: "🛍️" },
      { id: "adorei-visual", text: "Adorei seu visual!", emoji: "😍" },
      { id: "adorei-mascote", text: "Adorei seu mascote!", emoji: "🐾" },
      { id: "qual-casa", text: "Qual é a sua casa?", emoji: "🏰" },
      { id: "subir-ranking", text: "Vamos subir no ranking!", emoji: "📈" },
      { id: "taca", text: "Nossa casa vai ganhar a Taça!", emoji: "🏆" },
      { id: "trocar-itens", text: "Quer trocar itens?", emoji: "🔄" },
    ],
  },
  {
    id: "reacoes",
    label: "Reações",
    icon: "😀",
    phrases: [
      { id: "haha", text: "Haha!", emoji: "😂" },
      { id: "legal", text: "Legal!", emoji: "😃" },
      { id: "uau", text: "Uau!", emoji: "😮" },
      { id: "eba", text: "Eba!", emoji: "🥳" },
      { id: "nossa", text: "Nossa!", emoji: "😲" },
      { id: "que-pena", text: "Que pena...", emoji: "😢" },
      { id: "hmm", text: "Hmm...", emoji: "🤔" },
      { id: "ops", text: "Ops!", emoji: "🙊" },
    ],
  },
  {
    id: "despedidas",
    label: "Despedidas",
    icon: "🌙",
    phrases: [
      { id: "tchau", text: "Tchau!", emoji: "👋" },
      { id: "ate-mais", text: "Até mais!", emoji: "✌️" },
      { id: "ate-amanha", text: "Até amanhã!", emoji: "📆" },
      { id: "preciso-ir", text: "Preciso ir, até logo!", emoji: "🏃" },
      { id: "bons-estudos", text: "Bons estudos!", emoji: "📚" },
      { id: "durma-bem", text: "Durma bem!", emoji: "😴" },
    ],
  },
];

const PHRASES_BY_ID = new Map(CHAT_PHRASE_GROUPS.flatMap((g) => g.phrases).map((p) => [p.id, p]));

/** O balão pelo id — undefined se não existir no catálogo (e aí ele não é mostrado). */
export function getPhrase(id: string): ChatPhrase | undefined {
  return PHRASES_BY_ID.get(id);
}

// ---------------------------------------------------------------------------
// Pedidos de amizade
// ---------------------------------------------------------------------------

export interface FriendLink {
  id: string;
  fromId: string; // quem mandou o pedido
  toId: string;
  status: "pendente" | "aceito";
  createdAt: string;
  acceptedAt?: string;
}

/** A situação entre o aluno logado e outro aluno. */
export type FriendStatus = "nenhum" | "enviado" | "recebido" | "amigos";

const FRIENDS_KEY = "cg-friends";
const CHATS_KEY = "cg-chats";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "[]") as T[];
  } catch {
    return [];
  }
}

function write<T>(key: string, items: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(items));
}

export function listFriendLinks(): FriendLink[] {
  return read<FriendLink>(FRIENDS_KEY);
}

function linkBetween(links: FriendLink[], a: string, b: string): FriendLink | undefined {
  return links.find((l) => (l.fromId === a && l.toId === b) || (l.fromId === b && l.toId === a));
}

export function friendStatusIn(links: FriendLink[], meId: string, otherId: string): FriendStatus {
  const link = linkBetween(links, meId, otherId);
  if (!link) return "nenhum";
  if (link.status === "aceito") return "amigos";
  return link.fromId === meId ? "enviado" : "recebido";
}

export function areFriends(a: string, b: string): boolean {
  return linkBetween(listFriendLinks(), a, b)?.status === "aceito";
}

export type FriendRequestResult = { ok: true; accepted: boolean } | { ok: false; error: string };

/**
 * Manda um pedido de amizade. Se o outro aluno já tinha mandado um pedido pra
 * este, os dois viram amigos na hora (`accepted: true`).
 */
export function sendFriendRequest(fromId: string, toId: string): FriendRequestResult {
  if (fromId === toId) return { ok: false, error: "Você não pode mandar um pedido pra você mesmo." };
  const links = listFriendLinks();
  const existing = linkBetween(links, fromId, toId);
  if (existing?.status === "aceito") return { ok: false, error: "Vocês já são amigos." };
  if (existing && existing.fromId === fromId) return { ok: false, error: "Você já mandou um pedido pra esse aluno." };
  if (existing) {
    acceptFriendRequest(existing.id);
    return { ok: true, accepted: true };
  }
  const link: FriendLink = { id: `f_${Date.now()}_${Math.round(Math.random() * 9999)}`, fromId, toId, status: "pendente", createdAt: new Date().toISOString() };
  write(FRIENDS_KEY, [...links, link]);
  return { ok: true, accepted: false };
}

export function acceptFriendRequest(linkId: string) {
  write(FRIENDS_KEY, listFriendLinks().map((l) => (l.id === linkId ? { ...l, status: "aceito" as const, acceptedAt: new Date().toISOString() } : l)));
}

/** Recusar (quem recebeu) ou cancelar (quem mandou): o pedido some, e dá pra mandar outro depois. */
export function deleteFriendRequest(linkId: string) {
  write(FRIENDS_KEY, listFriendLinks().filter((l) => l.id !== linkId));
}

/** Desfaz a amizade e apaga a conversa dos dois. */
export function removeFriend(a: string, b: string) {
  write(FRIENDS_KEY, listFriendLinks().filter((l) => !((l.fromId === a && l.toId === b) || (l.fromId === b && l.toId === a))));
  write(CHATS_KEY, listChatMessages().filter((m) => !isBetween(m, a, b)));
}

/** Aluno excluído: some das amizades, dos pedidos e das conversas de todo mundo. */
export function deleteFriendsOf(studentId: string) {
  write(FRIENDS_KEY, listFriendLinks().filter((l) => l.fromId !== studentId && l.toId !== studentId));
  write(CHATS_KEY, listChatMessages().filter((m) => m.fromId !== studentId && m.toId !== studentId));
}

// ---------------------------------------------------------------------------
// Conversa
// ---------------------------------------------------------------------------

export interface ChatMessage {
  id: string;
  fromId: string;
  toId: string;
  phraseId: string; // só o id do balão; o texto vem do catálogo
  sentAt: string;
  readAt: string | null;
}

/** Quantas mensagens cada conversa guarda (as mais antigas vão saindo). */
export const CHAT_HISTORY_LIMIT = 200;

function isBetween(m: ChatMessage, a: string, b: string): boolean {
  return (m.fromId === a && m.toId === b) || (m.fromId === b && m.toId === a);
}

export function listChatMessages(): ChatMessage[] {
  return read<ChatMessage>(CHATS_KEY);
}

/** A conversa entre dois alunos, da mais antiga pra mais nova, só com balões que existem no catálogo. */
export function conversationIn(all: ChatMessage[], a: string, b: string): ChatMessage[] {
  return all.filter((m) => isBetween(m, a, b) && getPhrase(m.phraseId)).sort((x, y) => x.sentAt.localeCompare(y.sentAt));
}

export type SendChatResult = { ok: true } | { ok: false; error: string };

/** Manda um balão pro amigo. Só funciona entre amigos e só com balões do catálogo. */
export function sendChatPhrase(fromId: string, toId: string, phraseId: string): SendChatResult {
  if (!getPhrase(phraseId)) return { ok: false, error: "Esse balão não existe." };
  if (!areFriends(fromId, toId)) return { ok: false, error: "Vocês precisam ser amigos pra conversar." };
  const message: ChatMessage = { id: `c_${Date.now()}_${Math.round(Math.random() * 9999)}`, fromId, toId, phraseId, sentAt: new Date().toISOString(), readAt: null };
  const all = [...listChatMessages(), message];
  // Guarda só as últimas CHAT_HISTORY_LIMIT mensagens de cada conversa.
  const conversation = all.filter((m) => isBetween(m, fromId, toId));
  const tooOld = new Set(conversation.slice(0, Math.max(0, conversation.length - CHAT_HISTORY_LIMIT)).map((m) => m.id));
  write(CHATS_KEY, all.filter((m) => !tooOld.has(m.id)));
  return { ok: true };
}

/** O aluno abriu a conversa: as mensagens que o amigo mandou ficam lidas. */
export function markConversationRead(meId: string, friendId: string) {
  const all = listChatMessages();
  if (!all.some((m) => m.fromId === friendId && m.toId === meId && !m.readAt)) return;
  const now = new Date().toISOString();
  write(CHATS_KEY, all.map((m) => (m.fromId === friendId && m.toId === meId && !m.readAt ? { ...m, readAt: now } : m)));
}

/** Mensagens não lidas que chegaram pro aluno, por amigo. */
export function unreadByFriendIn(all: ChatMessage[], meId: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const m of all) {
    if (m.toId === meId && !m.readAt && getPhrase(m.phraseId)) counts[m.fromId] = (counts[m.fromId] ?? 0) + 1;
  }
  return counts;
}
