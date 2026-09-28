"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Student,
  listStudents,
  getActiveStudentId,
  setActiveStudentId,
  getStudent,
  createStudent,
  removeStudent,
  updateStudent,
  reassignStudents,
  login as loginStudent,
  applyMissionReward,
} from "./students";
import { Mission, hasPassed, isTaskMission } from "./missions";
import { listMissions, createMission, updateMission, deleteMission, reassignMissions } from "./missionsStore";
import {
  Teacher,
  listTeachers,
  getTeacherSessionId,
  setTeacherSessionId,
  teacherLogin,
  createTeacher,
  updateTeacher,
  removeTeacher,
  markTeacherTutorialDone,
} from "./teachers";
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
  PENDING_ITEM_NOTE,
  friendRequestMessage,
  friendAcceptedMessage,
} from "./messages";
import {
  FriendLink,
  ChatMessage,
  listFriendLinks,
  listChatMessages,
  friendStatusIn,
  sendFriendRequest,
  acceptFriendRequest,
  deleteFriendRequest,
  removeFriend,
  deleteFriendsOf,
  conversationIn,
  sendChatPhrase,
  markConversationRead,
  unreadByFriendIn,
} from "./friends";
import { Offer, listOffersTo, listOffersFrom, createOffer, acceptOffer, withdrawOffer, deleteOffersOf } from "./market";
import { GiftItem, Giver, giveItemTo } from "./gifts";
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
import { Trade, listTradesTo, listTradesFrom, proposeTrade, acceptTrade, declineTrade, cancelTrade, cancelTradesBetween, deleteTradesOf } from "./trades";
import { subscribe, emitChange } from "./events";
import { Theme, getTheme, setTheme, applyTheme } from "./theme";
import { ShopItem, ShopItemData, listShopItems, createShopItem, updateShopItem, deleteShopItem, buyShopItem, addCollection, removeCollection } from "./shop";
import { CosmeticCollection } from "./avatar";
import type { EventId } from "./specialEvents";
import { EventRuns, EventStatus, listEventRuns, statusIn, startEvent, endEvent, deleteEventRunsOf, releasedPhasesIn, releaseNextPhase } from "./eventSchedule";

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

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const sync = useCallback(() => {
    setStudents(listStudents());
    setActiveId(getActiveStudentId());
    setReady(true);
  }, []);

  useSyncOnChange(sync);

  const signUp = useCallback((data: { name: string; email: string; turma: string; username: string; password: string; teacherId: string }) => {
    const s = createStudent(data);
    emitChange();
    return s;
  }, []);

  // Lê o aluno ativo direto do localStorage no momento da escrita, em vez de
  // confiar no estado local — evita salvar no aluno errado caso outra parte
  // da tela tenha trocado o aluno ativo há pouco.
  const patchActive = useCallback((patch: Partial<Student>) => {
    const id = getActiveStudentId();
    if (!id) return;
    updateStudent(id, patch);
    emitChange();
  }, []);

  // Usado pelo painel do professor, que altera alunos que não são o ativo.
  const patchStudent = useCallback((id: string, patch: Partial<Student>) => {
    updateStudent(id, patch);
    emitChange();
  }, []);

  const login = useCallback((username: string, password: string) => {
    const result = loginStudent(username, password);
    if (result.ok) emitChange();
    return result;
  }, []);

  const selectStudent = useCallback((id: string) => {
    setActiveStudentId(id);
    emitChange();
  }, []);

  // Usado pelo professor. Se o aluno excluído era o ativo neste navegador,
  // removeStudent já o desloga — não troca pra outro aluno, senão o próximo
  // a abrir a Academia cairia na conta de outra pessoa.
  const deleteStudent = useCallback((id: string) => {
    deleteOffersOf(id);
    deleteTradesOf(id);
    deleteSubmissionsOf(id);
    deleteTeacherMessagesOf(id);
    deleteFriendsOf(id);
    removeStudent(id);
    deleteMessagesOf(id);
    emitChange();
  }, []);

  const logout = useCallback(() => {
    setActiveStudentId(null);
    emitChange();
  }, []);

  const refresh = sync;

  const activeStudent = students.find((s) => s.id === activeId) ?? null;

  return { students, activeStudent, activeId, ready, signUp, login, patchActive, patchStudent, selectStudent, deleteStudent, logout, refresh };
}

export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [ready, setReady] = useState(false);

  const sync = useCallback(() => {
    setMissions(listMissions());
    setReady(true);
  }, []);

  useSyncOnChange(sync);

  const addMission = useCallback((data: Omit<Mission, "id">) => {
    const m = createMission(data);
    emitChange();
    return m;
  }, []);

  const editMission = useCallback((id: string, patch: Omit<Partial<Mission>, "id">) => {
    updateMission(id, patch);
    emitChange();
  }, []);

  const removeMission = useCallback((id: string) => {
    deleteMission(id);
    deleteSubmissionsOfMission(id); // as entregas (e os arquivos) da missão somem junto
    emitChange();
  }, []);

  const refresh = sync;

  return { missions, ready, refresh, addMission, editMission, removeMission };
}

/**
 * Termina uma tentativa de missão do aluno logado (tela de Missões e tela de evento):
 * com 60%+ de acertos numa missão ainda não concluída, aplica XP, moedas e item
 * e manda a mensagem de recompensa. Revisão de missão já concluída ou nota
 * abaixo de 60% não dão nada. Devolve o nível antigo e o novo quando o aluno
 * subiu de nível, pra tela abrir a cena de nível; senão, null.
 */
export function useMissionAttempt() {
  const { activeStudent, patchActive } = useStudents();
  const { send } = useMessages(activeStudent?.id ?? null);

  return useCallback(
    (mission: Mission, correctCount: number): { from: number; to: number } | null => {
      if (!activeStudent || activeStudent.completedMissionIds.includes(mission.id)) return null;
      // missão de entrega só dá recompensa quando o professor aprova (engine/submissions.ts)
      if (isTaskMission(mission)) return null;
      if (!hasPassed(correctCount, mission.questions.length)) return null;
      const result = applyMissionReward(activeStudent, mission);
      patchActive(result.student);
      const waiting = result.student.pendingItems.length > activeStudent.pendingItems.length;
      send({
        studentId: activeStudent.id,
        senderId: SYSTEM_SENDER_ID,
        kind: "missao",
        body: missionRewardMessage({ mission, item: mission.rewardItem, xp: mission.rewardXp, coins: mission.rewardCoins }) + (waiting ? PENDING_ITEM_NOTE : ""),
      });
      return result.leveledUp ? { from: activeStudent.level, to: result.newLevel } : null;
    },
    [activeStudent, patchActive, send],
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

/** Professores cadastrados, o professor logado (sessão) e o CRUD usado pelo Painel ADM. */
export function useTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const sync = useCallback(() => {
    setTeachers(listTeachers());
    setSessionId(getTeacherSessionId());
    setReady(true);
  }, []);

  useSyncOnChange(sync);

  const login = useCallback((email: string, password: string, adminOnly = false) => {
    const result = teacherLogin(email, password, adminOnly);
    if (result.ok) emitChange();
    return result;
  }, []);

  const logout = useCallback(() => {
    setTeacherSessionId(null);
    emitChange();
  }, []);

  const addTeacher = useCallback((data: { name: string; email: string; password: string }) => {
    const t = createTeacher(data);
    emitChange();
    return t;
  }, []);

  const editTeacher = useCallback((id: string, patch: { name?: string; email?: string; password?: string }) => {
    updateTeacher(id, patch);
    emitChange();
  }, []);

  // Os alunos e as missões do professor excluído passam pro professor escolhido
  // (heirId) — ninguém fica sem professor nem missão fica sem dono.
  const deleteTeacher = useCallback((id: string, heirId: string) => {
    if (id === heirId) return;
    reassignStudents(id, heirId);
    reassignMissions(id, heirId);
    deleteEventRunsOf(id);
    removeTeacher(id);
    emitChange();
  }, []);

  const finishTutorial = useCallback((id: string) => {
    markTeacherTutorialDone(id);
    emitChange();
  }, []);

  const currentTeacher = teachers.find((t) => t.id === sessionId) ?? null;

  return { teachers, currentTeacher, ready, login, logout, addTeacher, editTeacher, deleteTeacher, finishTutorial };
}

/** Loja da Academia: itens à venda, CRUD do ADM e a compra do aluno. */
export function useShop() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [ready, setReady] = useState(false);

  const sync = useCallback(() => {
    setItems(listShopItems());
    setReady(true);
  }, []);

  useSyncOnChange(sync);

  const addItem = useCallback((data: ShopItemData) => {
    const item = createShopItem(data);
    emitChange();
    return item;
  }, []);

  const editItem = useCallback((id: string, data: ShopItemData) => {
    updateShopItem(id, data);
    emitChange();
  }, []);

  const removeItem = useCallback((id: string) => {
    deleteShopItem(id);
    emitChange();
  }, []);

  const buy = useCallback((studentId: string, shopItemId: string) => {
    const result = buyShopItem(studentId, shopItemId);
    if (result.ok) emitChange();
    return result;
  }, []);

  const addItemsOfCollection = useCallback((collection: CosmeticCollection) => {
    const n = addCollection(collection);
    emitChange();
    return n;
  }, []);

  const removeItemsOfCollection = useCallback((collection: CosmeticCollection) => {
    const n = removeCollection(collection);
    emitChange();
    return n;
  }, []);

  return { items, ready, addItem, editItem, removeItem, buy, addCollection: addItemsOfCollection, removeCollection: removeItemsOfCollection };
}

/**
 * Amigos do aluno logado: pedidos recebidos e enviados, a lista de amigos e a
 * conversa com balões. Pedido novo e pedido aceito também chegam como
 * mensagem "🤝 Amizade" no sino do outro aluno.
 */
export function useFriends(meId: string | null) {
  const [links, setLinks] = useState<FriendLink[]>([]);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [ready, setReady] = useState(false);

  const sync = useCallback(() => {
    setLinks(listFriendLinks());
    setChats(listChatMessages());
    setReady(true);
  }, []);

  useSyncOnChange(sync);

  const notify = useCallback((studentId: string, body: string) => {
    sendMessage({ studentId, senderId: SYSTEM_SENDER_ID, kind: "amizade", body });
  }, []);

  const request = useCallback(
    (otherId: string) => {
      if (!meId) return { ok: false as const, error: "Entre na sua conta primeiro." };
      const result = sendFriendRequest(meId, otherId);
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
    (link: FriendLink) => {
      acceptFriendRequest(link.id);
      notify(link.fromId, friendAcceptedMessage(getStudent(link.toId)?.name ?? "Um colega"));
      emitChange();
    },
    [notify],
  );

  /** Recusar um pedido recebido ou cancelar um enviado. */
  const dismiss = useCallback((link: FriendLink) => {
    deleteFriendRequest(link.id);
    emitChange();
  }, []);

  const unfriend = useCallback(
    (otherId: string) => {
      if (!meId) return;
      cancelTradesBetween(meId, otherId); // trocas pendentes entre os dois são canceladas (os itens voltam)
      removeFriend(meId, otherId);
      emitChange();
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

/** Agenda dos eventos: qual evento está acontecendo pra turma de cada professor, e o iniciar/encerrar. */
export function useEventRuns() {
  const [runs, setRuns] = useState<EventRuns>({});
  const [ready, setReady] = useState(false);

  const sync = useCallback(() => {
    setRuns(listEventRuns());
    setReady(true);
  }, []);

  useSyncOnChange(sync);

  const statusOf = useCallback((teacherId: string, eventId: EventId): EventStatus => statusIn(runs, teacherId, eventId), [runs]);

  const start = useCallback((teacherId: string, eventId: EventId) => {
    startEvent(teacherId, eventId);
    emitChange();
  }, []);

  const end = useCallback((teacherId: string, eventId: EventId) => {
    endEvent(teacherId, eventId);
    emitChange();
  }, []);

  /** Quantas fases do evento o professor liberou (evento comum: 1 se já foi iniciado). */
  const releasedOf = useCallback((teacherId: string, eventId: EventId): number => releasedPhasesIn(runs, teacherId, eventId), [runs]);

  const releasePhase = useCallback((teacherId: string, eventId: EventId, totalPhases: number) => {
    releaseNextPhase(teacherId, eventId, totalPhases);
    emitChange();
  }, []);

  return { runs, ready, statusOf, releasedOf, start, end, releasePhase };
}

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

/** Ofertas de venda de itens entre alunos — as que o aluno recebeu e as que ele fez. */
export function useOffers(studentId: string | null) {
  const [received, setReceived] = useState<Offer[]>([]);
  const [sent, setSent] = useState<Offer[]>([]);

  const sync = useCallback(() => {
    setReceived(studentId ? listOffersTo(studentId) : []);
    setSent(studentId ? listOffersFrom(studentId) : []);
  }, [studentId]);

  useSyncOnChange(sync);

  const offer = useCallback((data: { sellerId: string; buyerId: string; itemId: string; price: number }) => {
    const result = createOffer(data);
    if (result.ok) emitChange();
    return result;
  }, []);

  const accept = useCallback((offerId: string) => {
    const result = acceptOffer(offerId);
    if (result.ok) emitChange();
    return result;
  }, []);

  const withdraw = useCallback((offerId: string) => {
    withdrawOffer(offerId);
    emitChange();
  }, []);

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

  const review = useCallback((submissionId: string, decision: "aprovada" | "refazer", feedback: string, mission: Mission, reviewerName: string) => {
    const result = reviewSubmission(submissionId, decision, feedback, mission, reviewerName);
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

/** Presentes do professor/ADM (engine/gifts.ts): dar um item pra um aluno, pra turma toda ou pra uma casa. */
export function useGifts() {
  const give = useCallback((studentIds: string[], item: GiftItem, giver: Giver) => {
    const result = giveItemTo(studentIds, item, giver);
    emitChange();
    return result;
  }, []);
  return { give };
}

/** Trocas de itens entre amigos (engine/trades.ts): propostas recebidas e enviadas, propor, aceitar, recusar e cancelar. */
export function useTrades(studentId: string | null) {
  const [received, setReceived] = useState<Trade[]>([]);
  const [sent, setSent] = useState<Trade[]>([]);

  const sync = useCallback(() => {
    setReceived(studentId ? listTradesTo(studentId) : []);
    setSent(studentId ? listTradesFrom(studentId) : []);
  }, [studentId]);

  useSyncOnChange(sync);

  const propose = useCallback((data: { fromId: string; toId: string; offeredIds: string[]; requestedIds: string[] }) => {
    const result = proposeTrade(data);
    if (result.ok) emitChange();
    return result;
  }, []);

  const accept = useCallback((tradeId: string) => {
    const result = acceptTrade(tradeId);
    if (result.ok) emitChange();
    return result;
  }, []);

  const decline = useCallback((tradeId: string) => {
    declineTrade(tradeId);
    emitChange();
  }, []);

  const cancel = useCallback((tradeId: string) => {
    cancelTrade(tradeId);
    emitChange();
  }, []);

  return { received, sent, propose, accept, decline, cancel };
}
