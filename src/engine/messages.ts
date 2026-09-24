// ============================================================================
// MESSAGES — mensagens do professor para um aluno (avisos ou comunicação).
// Mesmo padrão de CRUD em localStorage de students.ts. Cada mensagem guarda
// quando foi lida (readAt) — é isso que alimenta o sino de notificações.
// ============================================================================

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

export function sendMessage(data: { studentId: string; kind: MessageKind; body: string }): Message {
  const message: Message = {
    id: `m_${Date.now()}_${Math.round(Math.random() * 9999)}`,
    studentId: data.studentId,
    kind: data.kind,
    body: data.body.trim().slice(0, MESSAGE_MAX_LENGTH),
    createdAt: new Date().toISOString(),
    readAt: null,
  };
  writeAll([...readAll(), message]);
  return message;
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
