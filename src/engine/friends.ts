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
      { id: "opa", text: "Opa!", emoji: "🙌" },
      { id: "que-bom-te-ver", text: "Que bom te ver por aqui!", emoji: "🤗" },
      { id: "cheguei", text: "Cheguei!", emoji: "🚪" },
      { id: "esta-ai", text: "Você está aí?", emoji: "👀" },
      { id: "tudo-certo", text: "Tudo certo por aí?", emoji: "😃" },
      { id: "bom-fim-semana", text: "Bom fim de semana!", emoji: "🎈" },
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
      { id: "com-certeza", text: "Com certeza!", emoji: "💯" },
      { id: "acho-que-sim", text: "Acho que sim.", emoji: "🙂" },
      { id: "acho-que-nao", text: "Acho que não.", emoji: "😕" },
      { id: "nao-sei", text: "Não sei.", emoji: "🤷" },
      { id: "combinado", text: "Combinado!", emoji: "🤝" },
      { id: "ta-bom", text: "Tá bom!", emoji: "👌" },
      { id: "pode-deixar", text: "Pode deixar!", emoji: "😉" },
      { id: "verdade", text: "Verdade!", emoji: "✔️" },
      { id: "concordo", text: "Concordo!", emoji: "👍" },
      { id: "agradeco", text: "Agradeço muito!", emoji: "💖" },
      { id: "desculpa", text: "Desculpa!", emoji: "😅" },
      { id: "sem-problemas", text: "Sem problemas!", emoji: "😌" },
      { id: "ja-volto", text: "Já volto!", emoji: "🔙" },
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
      { id: "terminei-todas", text: "Terminei todas as missões!", emoji: "🎯" },
      { id: "travei", text: "Travei nessa pergunta...", emoji: "🧩" },
      { id: "me-explica-codigo", text: "Me explica esse código?", emoji: "💻" },
      { id: "vamos-juntos", text: "Vamos fazer juntos?", emoji: "👫" },
      { id: "missao-nova", text: "Tem missão nova!", emoji: "📜" },
      { id: "fiz-entrega", text: "Já enviei a minha entrega!", emoji: "📤" },
      { id: "entrega-aprovada", text: "Minha entrega foi aprovada!", emoji: "✅" },
      { id: "quase-la", text: "Estou quase lá!", emoji: "🏁" },
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
      { id: "orgulho", text: "Que orgulho de você!", emoji: "🏅" },
      { id: "continue-assim", text: "Continue assim!", emoji: "🚀" },
      { id: "vai-dar-certo", text: "Vai dar tudo certo!", emoji: "🌈" },
      { id: "voce-aprende", text: "Errar faz parte de aprender!", emoji: "🧠" },
      { id: "incrivel", text: "Você foi incrível!", emoji: "🤩" },
      { id: "juntos", text: "Juntos somos mais fortes!", emoji: "🤝" },
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
      { id: "qual-mascote", text: "Qual é o seu mascote?", emoji: "🐉" },
      { id: "vi-ranking", text: "Vi você no ranking!", emoji: "🏅" },
      { id: "mesma-casa", text: "Somos da mesma casa!", emoji: "🛡️" },
      { id: "casa-rival", text: "Sua casa está forte!", emoji: "⚔️" },
      { id: "viu-guildas", text: "Já leu a história das Guildas?", emoji: "⚜️" },
      { id: "mensagens-prof", text: "O professor mandou aviso!", emoji: "📣" },
      { id: "meu-visual", text: "Olha o meu visual novo!", emoji: "✨" },
    ],
  },
  {
    id: "perguntas",
    label: "Perguntas",
    icon: "❓",
    phrases: [
      { id: "o-que-fazendo", text: "O que você está fazendo?", emoji: "👀" },
      { id: "como-foi-dia", text: "Como foi o seu dia?", emoji: "🌞" },
      { id: "qual-nivel", text: "Qual é o seu nível?", emoji: "📊" },
      { id: "item-favorito", text: "Qual é o seu item favorito?", emoji: "🎁" },
      { id: "missao-recomenda", text: "Qual missão você recomenda?", emoji: "🗺️" },
      { id: "viu-evento", text: "Já viu o evento novo?", emoji: "📅" },
      { id: "quer-dupla", text: "Quer ser minha dupla nas missões?", emoji: "👫" },
      { id: "gosta-programar", text: "Você gosta de programar?", emoji: "💻" },
      { id: "o-que-aprendeu", text: "O que você aprendeu hoje?", emoji: "📚" },
      { id: "quantas-moedas", text: "Quantas moedas você tem?", emoji: "🤑" },
      { id: "online-amanha", text: "Você vem amanhã?", emoji: "📆" },
      { id: "precisa-ajuda", text: "Precisa de ajuda?", emoji: "🙋" },
    ],
  },
  {
    id: "estudos",
    label: "Estudos",
    icon: "📚",
    phrases: [
      { id: "estudar-juntos", text: "Vamos estudar juntos?", emoji: "📚" },
      { id: "aprendi-novo", text: "Aprendi uma coisa nova!", emoji: "💡" },
      { id: "programar-legal", text: "Programar é muito legal!", emoji: "💻" },
      { id: "loops-demais", text: "Loops são demais!", emoji: "🔁" },
      { id: "aprendi-funcoes", text: "Hoje aprendi funções!", emoji: "🧮" },
      { id: "treinar-mais", text: "Vamos treinar mais?", emoji: "🏋️" },
      { id: "revisar", text: "Que tal revisar a matéria?", emoji: "📝" },
      { id: "estudando-agora", text: "Estou estudando agora.", emoji: "🤓" },
      { id: "ja-fez-licao", text: "Já fez a lição?", emoji: "✏️" },
      { id: "dica-leia", text: "Dica: leia o enunciado com calma!", emoji: "🔎" },
      { id: "testa-codigo", text: "Testa o código passo a passo!", emoji: "🐞" },
      { id: "entendi-agora", text: "Agora eu entendi tudo!", emoji: "🌟" },
    ],
  },
  {
    id: "diversao",
    label: "Diversão",
    icon: "🎮",
    phrases: [
      { id: "adorei-evento", text: "Adorei o evento!", emoji: "🎃" },
      { id: "bora", text: "Bora!", emoji: "⚡" },
      { id: "que-divertido", text: "Que divertido!", emoji: "😆" },
      { id: "mascote-fofo", text: "Que mascote fofo!", emoji: "🐱" },
      { id: "ganhei-moedas", text: "Ganhei um monte de moedas!", emoji: "💰" },
      { id: "vou-comprar", text: "Vou comprar algo na Loja!", emoji: "🛒" },
      { id: "desafio", text: "Te desafio a passar essa missão!", emoji: "🎯" },
      { id: "corrida", text: "Quem sobe de nível primeiro?", emoji: "🏎️" },
      { id: "dancinha", text: "Dancinha da vitória!", emoji: "💃" },
      { id: "melhor-dia", text: "Melhor dia na Academia!", emoji: "🏰" },
    ],
  },
  {
    id: "sentimentos",
    label: "Como estou",
    icon: "😊",
    phrases: [
      { id: "estou-feliz", text: "Estou feliz!", emoji: "😄" },
      { id: "muita-energia", text: "Hoje estou com muita energia!", emoji: "⚡" },
      { id: "com-sono", text: "Estou com sono...", emoji: "😴" },
      { id: "com-fome", text: "Estou com fome!", emoji: "😋" },
      { id: "focando", text: "Estou focando nos estudos.", emoji: "🎧" },
      { id: "pouco-triste", text: "Estou um pouco triste.", emoji: "🥺" },
      { id: "saudade", text: "Estava com saudade!", emoji: "🤗" },
      { id: "dia-legal", text: "Que dia legal!", emoji: "🌈" },
      { id: "nervoso-prova", text: "Estou com frio na barriga pra prova.", emoji: "😰" },
      { id: "empolgado", text: "Que empolgação!", emoji: "🤩" },
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
      { id: "kkk", text: "Kkkkk!", emoji: "🤣" },
      { id: "que-incrivel", text: "Que incrível!", emoji: "🤯" },
      { id: "serio", text: "Sério?!", emoji: "😯" },
      { id: "caramba", text: "Caramba!", emoji: "😵" },
      { id: "perfeito", text: "Perfeito!", emoji: "💯" },
      { id: "show", text: "Show!", emoji: "🤘" },
      { id: "ufa", text: "Ufa!", emoji: "😮" },
      { id: "adorei", text: "Adorei!", emoji: "🥰" },
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
      { id: "falou", text: "Falou!", emoji: "🤙" },
      { id: "ate-proxima-missao", text: "Até a próxima missão!", emoji: "⚔️" },
      { id: "bom-descanso", text: "Bom descanso!", emoji: "🛌" },
      { id: "ate-ja", text: "Até já!", emoji: "⏱️" },
      { id: "foi-legal", text: "Foi legal conversar!", emoji: "😊" },
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
