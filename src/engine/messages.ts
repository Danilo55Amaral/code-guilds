// ============================================================================
// MESSAGES — mensagens do professor para um aluno (avisos ou comunicação).
// Mesmo padrão de CRUD em localStorage de students.ts. Cada mensagem guarda
// quando foi lida (readAt) — é isso que alimenta o sino de notificações.
// Comunicados (pra turma toda ou pra uma casa) viram uma cópia por aluno,
// ligadas pelo mesmo broadcastId — assim cada aluno tem o seu próprio readAt.
// ============================================================================

import { HouseId, getHouse } from "./houses";
import { DEFAULT_TEACHER_ID } from "./teachers";

export type MessageKind = "aviso" | "mensagem";

export const MESSAGE_KIND_META: Record<MessageKind, { label: string; icon: string; colorClass: string; borderClass: string; bgClass: string }> = {
  aviso: { label: "Aviso", icon: "⚠️", colorClass: "text-amber-300", borderClass: "border-amber-500/40", bgClass: "bg-amber-500/10" },
  mensagem: { label: "Mensagem", icon: "💬", colorClass: "text-sky-300", borderClass: "border-sky-500/40", bgClass: "bg-sky-500/10" },
};

export interface Message {
  id: string;
  studentId: string;
  kind: MessageKind;
  body: string;
  createdAt: string;
  readAt: string | null;
  audience?: MessageAudience;
  broadcastId?: string;
  senderId?: string; // professor que enviou; mensagens antigas são do professor padrão
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

export function sendMessage(data: { studentId: string; senderId: string; kind: MessageKind; body: string }): Message {
  const message: Message = {
    id: `m_${Date.now()}_${Math.round(Math.random() * 9999)}`,
    studentId: data.studentId,
    kind: data.kind,
    body: data.body.trim().slice(0, MESSAGE_MAX_LENGTH),
    createdAt: new Date().toISOString(),
    readAt: null,
    senderId: data.senderId,
  };
  writeAll([...readAll(), message]);
  return message;
}

/** Comunicado: grava uma cópia da mesma mensagem pra cada aluno destinatário. */
export function broadcastMessage(data: {
  studentIds: string[];
  senderId: string;
  audience: MessageAudience;
  kind: MessageKind;
  body: string;
}): Message[] {
  const stamp = `${Date.now()}_${Math.round(Math.random() * 9999)}`;
  const createdAt = new Date().toISOString();
  const body = data.body.trim().slice(0, MESSAGE_MAX_LENGTH);
  const copies: Message[] = data.studentIds.map((studentId) => ({
    id: `m_${stamp}_${studentId}`,
    studentId,
    kind: data.kind,
    body,
    createdAt,
    readAt: null,
    audience: data.audience,
    broadcastId: `b_${stamp}`,
    senderId: data.senderId,
  }));
  writeAll([...readAll(), ...copies]);
  return copies;
}

/** Comunicados que um professor já enviou (agrupados por broadcastId), mais recentes primeiro. */
export function listBroadcasts(senderId: string): BroadcastSummary[] {
  const groups = new Map<string, BroadcastSummary>();
  for (const m of readAll()) {
    if (!m.broadcastId || !m.audience) continue;
    if ((m.senderId ?? DEFAULT_TEACHER_ID) !== senderId) continue;
    const g = groups.get(m.broadcastId);
    if (g) {
      g.total++;
      if (m.readAt) g.read++;
    } else {
      groups.set(m.broadcastId, {
        broadcastId: m.broadcastId,
        audience: m.audience,
        kind: m.kind,
        body: m.body,
        createdAt: m.createdAt,
        total: 1,
        read: m.readAt ? 1 : 0,
      });
    }
  }
  return Array.from(groups.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Marcar de novo uma mensagem já lida não muda o readAt original. */
export function markAsRead(id: string) {
  const now = new Date().toISOString();
  writeAll(readAll().map((m) => (m.id === id && !m.readAt ? { ...m, readAt: now } : m)));
}

export function markAllAsRead(studentId: string) {
  const now = new Date().toISOString();
  writeAll(readAll().map((m) => (m.studentId === studentId && !m.readAt ? { ...m, readAt: now } : m)));
}

/** Usado quando o aluno é excluído — não deixa mensagens órfãs no localStorage. */
export function deleteMessagesOf(studentId: string) {
  writeAll(readAll().filter((m) => m.studentId !== studentId));
}
