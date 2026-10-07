"use client";

import { useCallback, useEffect, useState } from "react";
import { Student, listStudents, getActiveStudentId, getStudent, updateStudent } from "./students";
import { Mission, isTaskMission } from "./missions";
import { listMissions, createMission, updateMission, deleteMission } from "./missionsStore";
import { Teacher, listTeachers, getTeacherSessionId } from "./teachers";
import {
  SignUpData,
  StudentAccountPatch,
  TeacherData,
  createTeacherAccount,
  deleteStudentAccount,
  deleteTeacherAccount,
  finishTeacherTutorial,
  isSessionChecked,
  logout as logoutAccount,
  refreshFromApi,
  setStudentPassword,
  studentLogin,
  studentSignUp,
  syncOwnProfile,
  teacherLogin,
  updateStudentAccount,
  updateTeacherAccount,
} from "./accounts";
import { Message, MessageKind, MessageAudience, BroadcastSummary, listMessages, deleteMessagesOf } from "./messages";
import * as messagesApi from "./messagesApi";
import * as presenceApi from "./presenceApi";
import { isOnline, onlineCount } from "./presence";
import {
  FriendLink,
  ChatMessage,
  listFriendLinks,
  listChatMessages,
  friendStatusIn,
  deleteFriendsOf,
  conversationIn,
  hasUnreadFrom,
  unreadByFriendIn,
} from "./friends";
import * as social from "./socialApi";
import { Offer, listOffersTo, listOffersFrom, deleteOffersOf } from "./market";
import { GiftItem, GiftResult } from "./gifts";
import { TeacherMessage, TeacherMessageTopic, deleteTeacherMessagesOf, listTeacherMessages } from "./teacherMessages";
import { Submission, deleteSubmissionsOf, deleteSubmissionsOfMission, listSubmissions } from "./submissions";
import * as submissionsApi from "./submissionsApi";
import { Trade, listTradesTo, listTradesFrom, deleteTradesOf } from "./trades";
import { subscribe, emitChange } from "./events";
import * as game from "./gameApi";
import type { GameResult } from "./gameApi";
import { Theme, getTheme, setTheme, applyTheme } from "./theme";
import { ShopItem, ShopItemData, listShopItems } from "./shop";
import * as shopApi from "./shopApi";
import { CosmeticCollection } from "./avatar";
import type { EventId, PhaseStatus } from "./specialEvents";
import { EventRuns, EventStatus, listEventRuns, statusIn, deleteEventRunsOf, phaseStatusesIn } from "./eventSchedule";
import * as eventsApi from "./eventsApi";

/**
 * Inscreve um "sync" nos avisos de mudança: tanto os avisos internos
 * (emitChange, disparado por qualquer escrita nesta aba) quanto o evento
 * "storage" do navegador (disparado quando OUTRA aba altera o localStorage).
 */
function useSyncOnChange(sync: () => void) {
  useEffect(() => {
    sync();
    const unsubscribe = subscribe(sync);
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key.startsWith("cg-")) sync();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      unsubscribe();
      window.removeEventListener("storage", onStorage);
    };
  }, [sync]);
}

/**
 * Alunos (cache da API: contas e progresso do jogo), o aluno logado e as
 * ações de conta. Login, cadastro e as mudanças de conta feitas pelo
 * professor falam com a API, então devolvem uma Promise. O progresso (XP,
 * moedas, itens) só muda pelas ações do jogo (useGameActions e os outros hooks).
 */
export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const sync = useCallback(() => {
    setStudents(listStudents());
    setActiveId(getActiveStudentId());
    // só fica pronto depois de a API confirmar a sessão (ver isSessionChecked)
    setReady(isSessionChecked());
  }, []);

  useSyncOnChange(sync);

  // Confere a sessão e as listas com a API (no máximo a cada 5s, entre todas as telas)
  useEffect(() => {
    void refreshFromApi();
  }, []);

  const signUp = useCallback((data: SignUpData) => studentSignUp(data), []);

  const login = useCallback((username: string, password: string) => studentLogin(username, password), []);

  // Lê o aluno ativo direto do cache no momento da escrita, em vez de
  // confiar no estado local — evita salvar no aluno errado caso outra parte
  // da tela tenha trocado o aluno ativo há pouco. Se o patch mexer no perfil
  // (avatar, casa, primeiro acesso, tutorial), a mudança também vai pra API.
  const patchActive = useCallback((patch: Partial<Student>) => {
    const id = getActiveStudentId();
    if (!id) return;
    const before = getStudent(id);
    updateStudent(id, patch);
    emitChange();
    if (before) syncOwnProfile(before, patch);
  }, []);

  /** Professor/ADM: altera a conta do aluno na API. Devolve o erro, ou null. */
  const updateAccount = useCallback((id: string, patch: StudentAccountPatch) => updateStudentAccount(id, patch), []);

  /** Professor/ADM: define uma senha nova pro aluno. Devolve o erro, ou null. */
  const setPassword = useCallback((id: string, password: string) => setStudentPassword(id, password), []);

  // Usado pelo professor: exclui a conta na API e limpa o que o aluno tinha
  // neste navegador. Se ele era o aluno ativo, removeStudent já o desloga.
  const deleteStudent = useCallback(async (id: string): Promise<string | null> => {
    const error = await deleteStudentAccount(id);
    if (error) return error;
    deleteOffersOf(id);
    deleteTradesOf(id);
    deleteSubmissionsOf(id);
    deleteTeacherMessagesOf(id);
    deleteFriendsOf(id);
    deleteMessagesOf(id);
    emitChange();
    return null;
  }, []);

  const logout = useCallback(() => {
    void logoutAccount();
  }, []);

  const refresh = sync;

  const activeStudent = students.find((s) => s.id === activeId) ?? null;

  return { students, activeStudent, activeId, ready, signUp, login, patchActive, updateAccount, setPassword, deleteStudent, logout, refresh };
}

/**
 * Missões (cache da API). Criar, editar e excluir falam com a API e devolvem
 * a mensagem de erro (ou null se deu certo).
 */
export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [ready, setReady] = useState(false);

  const sync = useCallback(() => {
    setMissions(listMissions());
    setReady(isSessionChecked());
  }, []);

  useSyncOnChange(sync);

  useEffect(() => {
    void refreshFromApi();
  }, []);

  const addMission = useCallback(async (data: Omit<Mission, "id">): Promise<string | null> => {
    const result = await createMission(data);
    emitChange();
    return result.ok ? null : result.error;
  }, []);

  const editMission = useCallback(async (id: string, patch: Omit<Partial<Mission>, "id">): Promise<string | null> => {
    const result = await updateMission(id, patch);
    emitChange();
    return result.ok ? null : result.error;
  }, []);

  const removeMission = useCallback(async (id: string): Promise<string | null> => {
    const error = await deleteMission(id);
    if (error) return error;
    deleteSubmissionsOfMission(id); // as entregas (e os arquivos) da missão somem junto
    emitChange();
    return null;
  }, []);

  const refresh = sync;

  return { missions, ready, refresh, addMission, editMission, removeMission };
}

/**
 * Termina uma tentativa de missão do aluno logado (tela de Missões e tela de evento).
 * As respostas escolhidas vão pra API, que corrige: com 60%+ de acertos numa
 * missão ainda não concluída, ela aplica XP, moedas e item e manda a mensagem
 * de recompensa. Revisão de missão já concluída ou nota abaixo de 60% não dão
 * nada. Devolve o nível antigo e o novo quando o aluno subiu de nível (pra
 * tela abrir a cena de nível), null quando não subiu, ou { error }.
 */
export function useMissionAttempt() {
  const { activeStudent } = useStudents();

  return useCallback(
    async (mission: Mission, answers: Record<string, string>): Promise<{ from: number; to: number } | null | { error: string }> => {
      if (!activeStudent || activeStudent.completedMissionIds.includes(mission.id)) return null;
      // missão de entrega só dá recompensa quando o professor aprova (engine/submissions.ts)
      if (isTaskMission(mission)) return null;
      const result = await game.attemptMission(mission.id, answers);
      if (!result.ok) return { error: result.error };
      if (!result.rewarded) return null;
      return result.leveledUp ? { from: result.fromLevel!, to: result.newLevel! } : null;
    },
    [activeStudent],
  );
}

/**
 * Pergunta à API, de tempos em tempos, se chegou mensagem nova (só com a aba
 * visível): o sininho do aluno usa a cada 20s, a conversa aberta a cada 4s e
 * o painel do professor (mensagens dos alunos) a cada 20s.
 */
export function useInboxPolling(intervalMs: number = messagesApi.INBOX_POLL_MS) {
  useEffect(() => {
    void messagesApi.refreshInbox();
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void messagesApi.refreshInbox();
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs]);
}

/**
 * Status online: manda o sinal de vida (aluno) ou consulta quem está online
 * (professor/ADM) a cada 30 segundos. Fica montado no layout raiz
 * (PresenceHeartbeat), então vale em todas as telas. Ao entrar ou sair de uma
 * conta, atualiza na hora.
 */
export function usePresencePolling() {
  const [account, setAccount] = useState<string | null>(null);

  const sync = useCallback(() => {
    setAccount(getActiveStudentId() ?? getTeacherSessionId());
  }, []);

  useSyncOnChange(sync);

  useEffect(() => {
    void presenceApi.refreshPresence();
    const timer = window.setInterval(() => void presenceApi.refreshPresence(), presenceApi.PRESENCE_POLL_MS);
    return () => window.clearInterval(timer);
  }, [account]);
}

/**
 * Quem está online agora (cache da API, atualizado pelo usePresencePolling).
 * Devolve isOnline(id) e quantos estão online; a tela redesenha quando muda.
 */
export function useOnlineStatus() {
  const [count, setCount] = useState(0);
  const [, setVersion] = useState(0);

  const sync = useCallback(() => {
    setCount(onlineCount());
    setVersion((v) => v + 1);
  }, []);

  useSyncOnChange(sync);

  return { isOnline, onlineCount: count };
}

/**
 * Mensagens de um aluno (cache da API). O aluno logado vê a própria caixa; o
 * professor, ao abrir a ficha de um aluno, busca a caixa dele na API.
 * Com studentId null (ninguém logado), devolve lista vazia.
 */
export function useMessages(studentId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [ready, setReady] = useState(false);

  const sync = useCallback(() => {
    setMessages(studentId ? listMessages(studentId) : []);
    setReady(isSessionChecked());
  }, [studentId]);

  useSyncOnChange(sync);

  // Professor abrindo a ficha de um aluno: a caixa dele vem da API
  useEffect(() => {
    if (studentId && getTeacherSessionId()) void messagesApi.loadStudentMessages(studentId);
  }, [studentId]);

  /** Professor/ADM: aviso ou mensagem pro aluno. Devolve o erro, ou null. */
  const send = useCallback((data: { studentId: string; kind: MessageKind; body: string }) => messagesApi.sendMessageToStudent(data), []);

  const markRead = useCallback((id: string) => {
    void messagesApi.markMessageRead(id);
  }, []);

  const markAllRead = useCallback(() => {
    if (studentId) void messagesApi.markAllMessagesRead(studentId);
  }, [studentId]);

  const unreadCount = messages.filter((m) => !m.readAt).length;

  return { messages, unreadCount, ready, send, markRead, markAllRead };
}

/** Comunicados do professor logado (turma toda ou uma casa), com quantos leram, e o envio de novos. */
export function useBroadcasts() {
  const [broadcasts, setBroadcasts] = useState<BroadcastSummary[]>([]);

  const load = useCallback(async () => {
    setBroadcasts(await messagesApi.loadBroadcasts());
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  /** Manda o comunicado; devolve { ok, sent } ou { ok: false, error }. */
  const broadcast = useCallback(
    async (data: { audience: MessageAudience; kind: MessageKind; body: string }) => {
      const result = await messagesApi.sendBroadcast(data);
      if (result.ok) void load();
      return result;
    },
    [load],
  );

  return { broadcasts, broadcast, reload: load };
}

/** Professores (cache da API), o professor logado (sessão) e o CRUD usado pelo Painel ADM. */
export function useTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const sync = useCallback(() => {
    setTeachers(listTeachers());
    setSessionId(getTeacherSessionId());
    setReady(isSessionChecked());
  }, []);

  useSyncOnChange(sync);

  useEffect(() => {
    void refreshFromApi();
  }, []);

  const login = useCallback((email: string, password: string, adminOnly = false) => teacherLogin(email, password, adminOnly), []);

  const logout = useCallback(() => {
    void logoutAccount();
  }, []);

  const addTeacher = useCallback((data: TeacherData) => createTeacherAccount(data), []);

  const editTeacher = useCallback((id: string, data: TeacherData) => updateTeacherAccount(id, data), []);

  // Os alunos (na API) e as missões e eventos (neste navegador) do professor
  // excluído passam pro professor escolhido (heirId) — ninguém fica sem
  // professor nem missão fica sem dono.
  const deleteTeacher = useCallback(async (id: string, heirId: string): Promise<string | null> => {
    if (id === heirId) return "Escolha outro professor para receber os alunos.";
    const error = await deleteTeacherAccount(id, heirId);
    if (error) return error;
    deleteEventRunsOf(id);
    void refreshFromApi(true); // as missões do professor excluído passaram pro herdeiro na API
    emitChange();
    return null;
  }, []);

  const finishTutorial = useCallback((id: string) => finishTeacherTutorial(id), []);

  const currentTeacher = teachers.find((t) => t.id === sessionId) ?? null;

  return { teachers, currentTeacher, ready, login, logout, addTeacher, editTeacher, deleteTeacher, finishTutorial };
}

/**
 * Loja da Academia (cache da API): itens à venda, CRUD do ADM e a compra do
 * aluno. Tudo fala com a API; as funções devolvem a mensagem de erro (ou null)
 * e a compra devolve { ok, item } ou { ok: false, error }.
 */
export function useShop() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [ready, setReady] = useState(false);

  const sync = useCallback(() => {
    setItems(listShopItems());
    setReady(isSessionChecked());
  }, []);

  useSyncOnChange(sync);

  useEffect(() => {
    void refreshFromApi();
  }, []);

  const addItem = useCallback(async (data: ShopItemData) => {
    const error = await shopApi.createShopItem(data);
    emitChange();
    return error;
  }, []);

  const editItem = useCallback(async (id: string, data: ShopItemData) => {
    const error = await shopApi.updateShopItem(id, data);
    emitChange();
    return error;
  }, []);

  const removeItem = useCallback(async (id: string) => {
    const error = await shopApi.deleteShopItem(id);
    emitChange();
    return error;
  }, []);

  // A compra é decidida pela API, que também manda a mensagem 🛒 Compra pro aluno.
  const buy = useCallback((shopItem: ShopItem) => game.buyShopItem(shopItem.id), []);

  const addItemsOfCollection = useCallback(async (collection: CosmeticCollection) => {
    const result = await shopApi.addCollection(collection);
    emitChange();
    return result;
  }, []);

  const removeItemsOfCollection = useCallback(async (collection: CosmeticCollection) => {
    const result = await shopApi.removeCollection(collection);
    emitChange();
    return result;
  }, []);

  return { items, ready, addItem, editItem, removeItem, buy, addCollection: addItemsOfCollection, removeCollection: removeItemsOfCollection };
}

/**
 * Amigos do aluno logado: pedidos recebidos e enviados, a lista de amigos e a
 * conversa com balões, tudo da API (engine/socialApi.ts). Pedido novo e pedido
 * aceito também chegam como mensagem "🤝 Amizade" no sino do outro aluno (a
 * API manda). As ações devolvem { ok } ou { ok: false, error }.
 */
export function useFriends(meId: string | null) {
  const [links, setLinks] = useState<FriendLink[]>([]);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [ready, setReady] = useState(false);

  const sync = useCallback(() => {
    setLinks(listFriendLinks());
    setChats(listChatMessages());
    setReady(isSessionChecked());
  }, []);

  useSyncOnChange(sync);

  useEffect(() => {
    void refreshFromApi();
  }, []);

  const request = useCallback(
    async (otherId: string) => {
      if (!meId) return { ok: false as const, error: "Entre na sua conta primeiro." };
      return social.requestFriend(otherId);
    },
    [meId],
  );

  const accept = useCallback((link: FriendLink) => social.acceptFriend(link.id), []);

  /** Recusar um pedido recebido ou cancelar um enviado. */
  const dismiss = useCallback((link: FriendLink) => social.removeFriendLink(link), []);

  /** Desfaz a amizade: as trocas pendentes entre os dois são canceladas (os itens voltam) e a conversa some. */
  const unfriend = useCallback(
    async (otherId: string) => {
      const link = listFriendLinks().find((l) => l.status === "aceito" && ((l.fromId === meId && l.toId === otherId) || (l.fromId === otherId && l.toId === meId)));
      if (!meId || !link) return { ok: false as const, error: "Vocês não são amigos." };
      return social.removeFriendLink(link);
    },
    [meId],
  );

  /** Manda um balão pro amigo (pela API). */
  const sendPhrase = useCallback(
    async (friendId: string, phraseId: string) => {
      if (!meId) return { ok: false as const, error: "Entre na sua conta primeiro." };
      return social.sendChat(friendId, phraseId);
    },
    [meId],
  );

  /** Conversa aberta: o que o amigo mandou fica lido (só chama a API se tiver algo sem ler). */
  const markRead = useCallback(
    (friendId: string) => {
      if (meId && hasUnreadFrom(meId, friendId)) void social.markChatRead(meId, friendId);
    },
    [meId],
  );

  const mine = meId ? links.filter((l) => l.fromId === meId || l.toId === meId) : [];
  const friendIds = mine.filter((l) => l.status === "aceito").map((l) => (l.fromId === meId ? l.toId : l.fromId));
  const incoming = mine.filter((l) => l.status === "pendente" && l.toId === meId);
  const outgoing = mine.filter((l) => l.status === "pendente" && l.fromId === meId);
  const unreadByFriend = meId ? unreadByFriendIn(chats, meId) : {};
  const unreadTotal = friendIds.reduce((n, id) => n + (unreadByFriend[id] ?? 0), 0);

  const statusWith = useCallback((otherId: string) => (meId ? friendStatusIn(links, meId, otherId) : "nenhum"), [links, meId]);
  const linkWith = useCallback((otherId: string) => mine.find((l) => l.fromId === otherId || l.toId === otherId), [mine]);
  const conversationWith = useCallback((friendId: string) => (meId ? conversationIn(chats, meId, friendId) : []), [chats, meId]);

  return { ready, friendIds, incoming, outgoing, unreadByFriend, unreadTotal, statusWith, linkWith, conversationWith, request, accept, dismiss, unfriend, sendPhrase, markRead };
}

/**
 * Agenda dos eventos (cache da API): qual evento está acontecendo pra turma de
 * cada professor, e o iniciar/liberar e encerrar fase/encerrar (engine/eventsApi.ts), que
 * devolvem a mensagem de erro, ou null.
 */
export function useEventRuns() {
  const [runs, setRuns] = useState<EventRuns>({});
  const [ready, setReady] = useState(false);

  const sync = useCallback(() => {
    setRuns(listEventRuns());
    setReady(isSessionChecked());
  }, []);

  useSyncOnChange(sync);

  useEffect(() => {
    void refreshFromApi();
  }, []);

  const statusOf = useCallback((teacherId: string, eventId: EventId): EventStatus => statusIn(runs, teacherId, eventId), [runs]);

  const start = useCallback((teacherId: string, eventId: EventId) => eventsApi.startEventRun(teacherId, eventId), []);

  const end = useCallback((teacherId: string, eventId: EventId) => eventsApi.endEventRun(teacherId, eventId), []);

  /** A situação de cada fase do evento pra turma do professor (evento comum: a Fase 1 liberada se já foi iniciado). */
  const phasesOf = useCallback((teacherId: string, eventId: EventId): PhaseStatus[] => phaseStatusesIn(runs, teacherId, eventId), [runs]);

  const releasePhase = useCallback((teacherId: string, eventId: EventId, phase: number) => eventsApi.releaseEventPhase(teacherId, eventId, phase), []);

  const closePhase = useCallback((teacherId: string, eventId: EventId, phase: number) => eventsApi.closeEventPhase(teacherId, eventId, phase), []);

  return { runs, ready, statusOf, phasesOf, start, end, releasePhase, closePhase };
}

/**
 * Ações do jogo que mudam o progresso do aluno (fase 3 do back end): quem
 * decide é a API, e o aluno atualizado volta pro cache sozinho. Cada ação
 * devolve { ok, ... } ou { ok: false, error } pra tela mostrar.
 */
export function useGameActions() {
  return GAME_ACTIONS;
}

const GAME_ACTIONS = {
  activateItem: game.activateItem,
  sellItem: game.sellItem,
  discardItem: game.discardItem,
  equipCosmetic: game.equipCosmetic,
  unequipCosmetic: game.unequipCosmetic,
  claimWaitingItems: game.claimWaitingItems,
  enterMultiverse: game.enterMultiverse,
  removeStudentItem: game.removeStudentItem,
  attemptMission: game.attemptMission,
  markEventIntroSeen: game.markEventIntroSeen,
  finishEventPhase: game.finishEventPhase,
};

/** Tema escuro/claro. Também acompanha a troca feita em outra aba (evento "storage"). */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("dark");

  const sync = useCallback(() => {
    const t = getTheme();
    applyTheme(t);
    setThemeState(t);
  }, []);

  useSyncOnChange(sync);

  const toggle = useCallback(() => {
    setTheme(getTheme() === "dark" ? "light" : "dark");
    emitChange();
  }, []);

  return { theme, toggle };
}

/**
 * Ofertas de venda de itens entre alunos (cache da API) — as que o aluno
 * recebeu e as que ele fez. Quem decide é a API (engine/gameApi.ts), que
 * também manda as mensagens 🛒 Compra e 💰 Venda. As ações devolvem { ok } ou
 * { ok: false, error }.
 */
export function useOffers(studentId: string | null) {
  const [received, setReceived] = useState<Offer[]>([]);
  const [sent, setSent] = useState<Offer[]>([]);

  const sync = useCallback(() => {
    setReceived(studentId ? listOffersTo(studentId) : []);
    setSent(studentId ? listOffersFrom(studentId) : []);
  }, [studentId]);

  useSyncOnChange(sync);

  const offer = useCallback((data: { buyerId: string; itemId: string; price: number }) => game.createOffer(data), []);

  const accept = useCallback((offer: Offer) => game.acceptOffer(offer.id), []);

  /** Recusar (comprador) ou cancelar (vendedor): o item volta pro vendedor. */
  const withdraw = useCallback((offerId: string) => game.removeOffer(offerId), []);

  return { received, sent, offer, accept, withdraw };
}

/**
 * Entregas das missões de entrega (cache da API): o aluno envia (texto e
 * arquivos), o professor/ADM corrige (engine/submissionsApi.ts). As ações
 * devolvem { ok } ou { ok: false, error }.
 */
export function useSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [ready, setReady] = useState(false);

  const sync = useCallback(() => {
    setSubmissions(listSubmissions());
    setReady(isSessionChecked());
  }, []);

  useSyncOnChange(sync);

  const submit = useCallback((data: { mission: Mission; text: string; files: File[] }) => submissionsApi.submitTask(data), []);

  const review = useCallback(
    (submissionId: string, decision: "aprovada" | "refazer", feedback: string) => submissionsApi.reviewSubmission(submissionId, decision, feedback),
    [],
  );

  return { submissions, ready, submit, review };
}

/**
 * Mensagens dos alunos pro professor (cache da API): o aluno escreve, o
 * professor lê e responde (engine/messagesApi.ts). As ações devolvem a
 * mensagem de erro, ou null.
 */
export function useTeacherMessages() {
  const [messages, setMessages] = useState<TeacherMessage[]>([]);
  const [ready, setReady] = useState(false);

  const sync = useCallback(() => {
    setMessages(listTeacherMessages());
    setReady(isSessionChecked());
  }, []);

  useSyncOnChange(sync);

  const send = useCallback(
    (data: { topic: TeacherMessageTopic; missionId?: string; body: string }) => messagesApi.sendTeacherMessage(data),
    [],
  );

  const markRead = useCallback((id: string) => messagesApi.markTeacherMessageRead(id), []);

  const reply = useCallback((id: string, text: string) => messagesApi.replyTeacherMessage(id, text), []);

  return { messages, ready, send, markRead, reply };
}

/**
 * Presentes do professor/ADM (engine/gifts.ts): dar um item pra um aluno, pra
 * turma toda ou pra uma casa. A API entrega os itens e manda a mensagem
 * 🎁 Presente pra cada aluno. Devolve { ok, delivered, waiting } ou { ok: false, error }.
 */
export function useGifts() {
  const give = useCallback(async (studentIds: string[], item: GiftItem): Promise<GameResult<GiftResult>> => {
    const result = await game.giveGift(studentIds, item);
    if (!result.ok) return result;
    return { ok: true, delivered: result.delivered, waiting: result.waiting };
  }, []);
  return { give };
}

/**
 * Trocas de itens entre amigos (cache da API): propostas recebidas e enviadas,
 * propor, aceitar, recusar e cancelar. Quem decide é a API (engine/gameApi.ts),
 * que também manda as mensagens 🔄 Troca. As ações devolvem { ok } ou
 * { ok: false, error }.
 */
export function useTrades(studentId: string | null) {
  const [received, setReceived] = useState<Trade[]>([]);
  const [sent, setSent] = useState<Trade[]>([]);

  const sync = useCallback(() => {
    setReceived(studentId ? listTradesTo(studentId) : []);
    setSent(studentId ? listTradesFrom(studentId) : []);
  }, [studentId]);

  useSyncOnChange(sync);

  const propose = useCallback((data: { toId: string; offeredIds: string[]; requestedIds: string[] }) => game.proposeTrade(data), []);

  const accept = useCallback((trade: Trade) => game.acceptTrade(trade.id), []);

  /** Recusar (quem recebeu): os itens oferecidos voltam pra quem propôs, que recebe um aviso. */
  const decline = useCallback((trade: Trade) => game.removeTrade(trade.id), []);

  /** Cancelar (quem propôs): os itens oferecidos voltam. */
  const cancel = useCallback((tradeId: string) => game.removeTrade(tradeId), []);

  return { received, sent, propose, accept, decline, cancel };
}
