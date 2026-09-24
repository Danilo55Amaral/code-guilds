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
} from "./students";
import { Mission } from "./missions";
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
} from "./messages";
import { Offer, listOffersTo, listOffersFrom, createOffer, acceptOffer, withdrawOffer, deleteOffersOf } from "./market";
import { subscribe, emitChange } from "./events";
import { Theme, getTheme, setTheme, applyTheme } from "./theme";

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
