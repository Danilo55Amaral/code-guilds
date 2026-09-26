"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Student,
  listStudents,
  getActiveStudentId,
  setActiveStudentId,
  createStudent,
  removeStudent,
  updateStudent,
  reassignStudents,
  login as loginStudent,
  applyMissionReward,
} from "./students";
import { Mission, hasPassed } from "./missions";
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
} from "./messages";
import { Offer, listOffersTo, listOffersFrom, createOffer, acceptOffer, withdrawOffer, deleteOffersOf } from "./market";
import { subscribe, emitChange } from "./events";
import { Theme, getTheme, setTheme, applyTheme } from "./theme";
import { ShopItem, ShopItemData, listShopItems, createShopItem, updateShopItem, deleteShopItem, buyShopItem, addCollection, removeCollection } from "./shop";
import { CosmeticCollection } from "./avatar";
import type { EventId } from "./specialEvents";
import { EventRuns, EventStatus, listEventRuns, statusIn, startEvent, endEvent, deleteEventRunsOf } from "./eventSchedule";

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
      if (!hasPassed(correctCount, mission.questions.length)) return null;
      const result = applyMissionReward(activeStudent, mission);
      patchActive(result.student);
      send({
        studentId: activeStudent.id,
        senderId: SYSTEM_SENDER_ID,
        kind: "missao",
        body: missionRewardMessage({ mission, item: mission.rewardItem, xp: mission.rewardXp, coins: mission.rewardCoins }),
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

  return { runs, ready, statusOf, start, end };
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
