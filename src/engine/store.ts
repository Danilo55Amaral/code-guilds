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
import {
  Message,
  MessageKind,
  MessageAudience,
  BroadcastSummary,
  listMessages,
  sendMessage,
  broadcastMessage,
  listBroadcasts,
  markAsRead,
  markAllAsRead,
  deleteMessagesOf,
  SYSTEM_SENDER_ID,
  missionRewardMessage,
  shopPurchaseMessage,
  PENDING_ITEM_NOTE,
  friendRequestMessage,
  friendAcceptedMessage,
  purchaseMessage,
  saleMessage,
  itemGiftMessage,
  tradeProposalMessage,
  tradeAcceptedMessage,
  tradeDeclinedMessage,
} from "./messages";
import {
  FriendLink,
  ChatMessage,
  listFriendLinks,
  listChatMessages,
  friendStatusIn,
  deleteFriendsOf,
  conversationIn,
  sendChatPhrase,
  markConversationRead,
  unreadByFriendIn,
} from "./friends";
import * as social from "./socialApi";
import { Offer, listOffersTo, listOffersFrom, deleteOffersOf } from "./market";
import { GiftItem, GiftResult, Giver } from "./gifts";
import {
  TeacherMessage,
  TeacherMessageTopic,
  deleteTeacherMessagesOf,
  listTeacherMessages,
  markTeacherMessageRead,
  replyToStudent,
  sendToTeacher,
} from "./teacherMessages";
import { Submission, deleteSubmissionsOf, deleteSubmissionsOfMission, listSubmissions, reviewSubmission, submitTask } from "./submissions";
import { Trade, listTradesTo, listTradesFrom, deleteTradesOf } from "./trades";
import { subscribe, emitChange } from "./events";
import * as game from "./gameApi";
import type { GameResult } from "./gameApi";
import { Theme, getTheme, setTheme, applyTheme } from "./theme";
import { ShopItem, ShopItemData, listShopItems } from "./shop";
import * as shopApi from "./shopApi";
import { CosmeticCollection } from "./avatar";
import type { EventId } from "./specialEvents";
import { EventRuns, EventStatus, listEventRuns, statusIn, deleteEventRunsOf, releasedPhasesIn } from "./eventSchedule";
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
 * missão ainda não concluída, ela aplica XP, moedas e item, e aqui sai a
 * mensagem de recompensa. Revisão de missão já concluída ou nota abaixo de 60%
 * não dão nada. Devolve o nível antigo e o novo quando o aluno subiu de nível
 * (pra tela abrir a cena de nível), null quando não subiu, ou { error }.
 */
export function useMissionAttempt() {
  const { activeStudent } = useStudents();
  const { send } = useMessages(activeStudent?.id ?? null);

  return useCallback(
    async (mission: Mission, answers: Record<string, string>): Promise<{ from: number; to: number } | null | { error: string }> => {
      if (!activeStudent || activeStudent.completedMissionIds.includes(mission.id)) return null;
      // missão de entrega só dá recompensa quando o professor aprova (engine/submissions.ts)
      if (isTaskMission(mission)) return null;
      const result = await game.attemptMission(mission.id, answers);
      if (!result.ok) return { error: result.error };
      if (!result.rewarded) return null;
      send({
        studentId: activeStudent.id,
        senderId: SYSTEM_SENDER_ID,
        kind: "missao",
        body: missionRewardMessage({ mission, item: mission.rewardItem, xp: mission.rewardXp, coins: mission.rewardCoins }) + (result.itemWaiting ? PENDING_ITEM_NOTE : ""),
      });
      return result.leveledUp ? { from: result.fromLevel!, to: result.newLevel! } : null;
    },
    [activeStudent, send],
  );
}

/** Mensagens de um aluno. Com studentId null (ninguém logado), devolve lista vazia. */
export function useMessages(studentId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [ready, setReady] = useState(false);

  const sync = useCallback(() => {
    setMessages(studentId ? listMessages(studentId) : []);
    setReady(true);
  }, [studentId]);

  useSyncOnChange(sync);

  const send = useCallback((data: { studentId: string; senderId: string; kind: MessageKind; body: string }) => {
    const m = sendMessage(data);
    emitChange();
    return m;
  }, []);

  const markRead = useCallback((id: string) => {
    markAsRead(id);
    emitChange();
  }, []);

  const markAllRead = useCallback(() => {
    if (!studentId) return;
    markAllAsRead(studentId);
    emitChange();
  }, [studentId]);

  const unreadCount = messages.filter((m) => !m.readAt).length;

  return { messages, unreadCount, ready, send, markRead, markAllRead };
}

/** Comunicados de um professor (turma toda ou uma casa) e o envio de novos em nome dele. */
export function useBroadcasts(senderId: string) {
  const [broadcasts, setBroadcasts] = useState<BroadcastSummary[]>([]);

  const sync = useCallback(() => {
    setBroadcasts(listBroadcasts(senderId));
  }, [senderId]);

  useSyncOnChange(sync);

  const broadcast = useCallback(
    (data: { studentIds: string[]; audience: MessageAudience; kind: MessageKind; body: string }) => {
      const copies = broadcastMessage({ ...data, senderId });
      emitChange();
      return copies;
    },
    [senderId]
  );

  return { broadcasts, broadcast };
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

  // A compra é decidida pela API; aqui sai a mensagem 🛒 Compra pro aluno.
  const buy = useCallback(async (studentId: string, shopItem: ShopItem) => {
    const result = await game.buyShopItem(shopItem.id);
    if (result.ok) {
      sendMessage({
        studentId,
        senderId: SYSTEM_SENDER_ID,
        kind: "compra",
        body: shopPurchaseMessage({ item: shopItem, price: shopItem.price, isCosmetic: !!shopItem.cosmetic }),
      });
      emitChange();
    }
    return result;
  }, []);

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
 * conversa com balões. Os pedidos e as amizades são da API (engine/socialApi.ts);
 * a conversa continua neste navegador. Pedido novo e pedido aceito também
 * chegam como mensagem "🤝 Amizade" no sino do outro aluno. As ações devolvem
 * { ok } ou { ok: false, error }.
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

  const notify = useCallback((studentId: string, body: string) => {
    sendMessage({ studentId, senderId: SYSTEM_SENDER_ID, kind: "amizade", body });
  }, []);

  const request = useCallback(
    async (otherId: string) => {
      if (!meId) return { ok: false as const, error: "Entre na sua conta primeiro." };
      const result = await social.requestFriend(otherId);
      if (result.ok) {
        const myName = getStudent(meId)?.name ?? "Um colega";
        notify(otherId, result.accepted ? friendAcceptedMessage(myName) : friendRequestMessage(myName));
        emitChange();
      }
      return result;
    },
    [meId, notify],
  );

  const accept = useCallback(
    async (link: FriendLink) => {
      const result = await social.acceptFriend(link.id);
      if (result.ok) {
        notify(link.fromId, friendAcceptedMessage(getStudent(link.toId)?.name ?? "Um colega"));
        emitChange();
      }
      return result;
    },
    [notify],
  );

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

  const sendPhrase = useCallback(
    (friendId: string, phraseId: string) => {
      if (!meId) return { ok: false as const, error: "Entre na sua conta primeiro." };
      const result = sendChatPhrase(meId, friendId, phraseId);
      if (result.ok) emitChange();
      return result;
    },
    [meId],
  );

  const markRead = useCallback(
    (friendId: string) => {
      if (!meId) return;
      markConversationRead(meId, friendId);
      emitChange();
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
 * cada professor, e o iniciar/liberar fase/encerrar (engine/eventsApi.ts), que
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

  /** Quantas fases do evento o professor liberou (evento comum: 1 se já foi iniciado). */
  const releasedOf = useCallback((teacherId: string, eventId: EventId): number => releasedPhasesIn(runs, teacherId, eventId), [runs]);

  const releasePhase = useCallback((teacherId: string, eventId: EventId) => eventsApi.releaseEventPhase(teacherId, eventId), []);

  return { runs, ready, statusOf, releasedOf, start, end, releasePhase };
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
 * recebeu e as que ele fez. Quem decide é a API (engine/gameApi.ts); aqui
 * saem as mensagens 🛒 Compra e 💰 Venda depois que ela confirma. As ações
 * devolvem { ok } ou { ok: false, error }.
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

  const accept = useCallback(async (offer: Offer) => {
    const result = await game.acceptOffer(offer.id);
    if (result.ok) {
      const buyer = getStudent(offer.buyerId);
      const seller = getStudent(offer.sellerId);
      sendMessage({
        studentId: offer.buyerId,
        senderId: SYSTEM_SENDER_ID,
        kind: "compra",
        body: purchaseMessage({ item: offer.item, sellerName: seller?.name ?? "um colega", price: offer.price }),
      });
      sendMessage({
        studentId: offer.sellerId,
        senderId: SYSTEM_SENDER_ID,
        kind: "venda",
        body: saleMessage({ item: offer.item, buyerName: buyer?.name ?? "Um colega", price: offer.price }),
      });
      emitChange();
    }
    return result;
  }, []);

  /** Recusar (comprador) ou cancelar (vendedor): o item volta pro vendedor. */
  const withdraw = useCallback((offerId: string) => game.removeOffer(offerId), []);

  return { received, sent, offer, accept, withdraw };
}

/** Entregas das missões de entrega (engine/submissions.ts): o aluno envia, o professor/ADM corrige. */
export function useSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [ready, setReady] = useState(false);

  const sync = useCallback(() => {
    setSubmissions(listSubmissions());
    setReady(true);
  }, []);

  useSyncOnChange(sync);

  const submit = useCallback(async (data: Parameters<typeof submitTask>[0]) => {
    const result = await submitTask(data);
    if (result.ok) emitChange();
    return result;
  }, []);

  const review = useCallback(async (submissionId: string, decision: "aprovada" | "refazer", feedback: string, mission: Mission, reviewerName: string) => {
    const result = await reviewSubmission(submissionId, decision, feedback, mission, reviewerName);
    if (result.ok) emitChange();
    return result;
  }, []);

  return { submissions, ready, submit, review };
}

/** Mensagens dos alunos pro professor (engine/teacherMessages.ts): o aluno escreve, o professor lê e responde. */
export function useTeacherMessages() {
  const [messages, setMessages] = useState<TeacherMessage[]>([]);
  const [ready, setReady] = useState(false);

  const sync = useCallback(() => {
    setMessages(listTeacherMessages());
    setReady(true);
  }, []);

  useSyncOnChange(sync);

  const send = useCallback((data: { studentId: string; topic: TeacherMessageTopic; missionId?: string; body: string }) => {
    const result = sendToTeacher(data);
    if (result.ok) emitChange();
    return result;
  }, []);

  const markRead = useCallback((id: string) => {
    markTeacherMessageRead(id);
    emitChange();
  }, []);

  const reply = useCallback((id: string, text: string, replier: { id: string; name: string }) => {
    const result = replyToStudent(id, text, replier);
    if (result.ok) emitChange();
    return result;
  }, []);

  return { messages, ready, send, markRead, reply };
}

/**
 * Presentes do professor/ADM (engine/gifts.ts): dar um item pra um aluno, pra
 * turma toda ou pra uma casa. A API entrega os itens; aqui sai a mensagem
 * 🎁 Presente pra cada aluno. Devolve { ok, delivered, waiting } ou { ok: false, error }.
 */
export function useGifts() {
  const give = useCallback(async (studentIds: string[], item: GiftItem, giver: Giver): Promise<GameResult<GiftResult>> => {
    const result = await game.giveGift(studentIds, item);
    if (!result.ok) return result;
    for (const { studentId, waiting } of result.results) {
      sendMessage({
        studentId,
        senderId: giver.id,
        kind: "presente",
        body: itemGiftMessage({ studentName: getStudent(studentId)?.name ?? "", item, giverName: giver.name, giverRole: giver.role }) + (waiting ? PENDING_ITEM_NOTE : ""),
      });
    }
    emitChange();
    return { ok: true, delivered: result.delivered, waiting: result.waiting };
  }, []);
  return { give };
}

/**
 * Trocas de itens entre amigos (cache da API): propostas recebidas e enviadas,
 * propor, aceitar, recusar e cancelar. Quem decide é a API (engine/gameApi.ts);
 * aqui saem as mensagens 🔄 Troca. As ações devolvem { ok } ou { ok: false, error }.
 */
export function useTrades(studentId: string | null) {
  const [received, setReceived] = useState<Trade[]>([]);
  const [sent, setSent] = useState<Trade[]>([]);

  const sync = useCallback(() => {
    setReceived(studentId ? listTradesTo(studentId) : []);
    setSent(studentId ? listTradesFrom(studentId) : []);
  }, [studentId]);

  useSyncOnChange(sync);

  const propose = useCallback(async (data: { toId: string; offeredIds: string[]; requestedIds: string[] }) => {
    const result = await game.proposeTrade(data);
    if (result.ok) {
      sendMessage({
        studentId: result.trade.toId,
        senderId: SYSTEM_SENDER_ID,
        kind: "troca",
        body: tradeProposalMessage({ fromName: getStudent(result.trade.fromId)?.name ?? "Um amigo", give: result.trade.offered, ask: result.trade.requested }),
      });
      emitChange();
    }
    return result;
  }, []);

  const accept = useCallback(async (trade: Trade) => {
    const result = await game.acceptTrade(trade.id);
    if (result.ok) {
      sendMessage({
        studentId: trade.fromId,
        senderId: SYSTEM_SENDER_ID,
        kind: "troca",
        body: tradeAcceptedMessage({ friendName: getStudent(trade.toId)?.name ?? "Seu amigo", received: trade.requested, gave: trade.offered }),
      });
      emitChange();
    }
    return result;
  }, []);

  /** Recusar (quem recebeu): os itens oferecidos voltam pra quem propôs, que recebe um aviso. */
  const decline = useCallback(async (trade: Trade) => {
    const result = await game.removeTrade(trade.id);
    if (result.ok) {
      sendMessage({
        studentId: trade.fromId,
        senderId: SYSTEM_SENDER_ID,
        kind: "troca",
        body: tradeDeclinedMessage({ friendName: getStudent(trade.toId)?.name ?? "Seu amigo", returned: trade.offered }),
      });
      emitChange();
    }
    return result;
  }, []);

  /** Cancelar (quem propôs): os itens oferecidos voltam. */
  const cancel = useCallback((tradeId: string) => game.removeTrade(tradeId), []);

  return { received, sent, propose, accept, decline, cancel };
}
