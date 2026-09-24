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
  login as loginStudent,
} from "./students";
import { Mission } from "./missions";
import { listMissions, createMission, updateMission, deleteMission } from "./missionsStore";
import { Message, MessageKind, listMessages, sendMessage, markAsRead, markAllAsRead, deleteMessagesOf } from "./messages";
import { Offer, listOffersTo, listOffersFrom, createOffer, acceptOffer, withdrawOffer, deleteOffersOf } from "./market";
import { subscribe, emitChange } from "./events";

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

  const signUp = useCallback((data: { name: string; email: string; turma: string; username: string; password: string }) => {
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

  const send = useCallback((data: { studentId: string; kind: MessageKind; body: string }) => {
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
