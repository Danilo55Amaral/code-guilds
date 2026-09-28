// ============================================================================
// MENSAGENS PRO PROFESSOR — o aluno escreve pro professor dele (dúvida de
// missão, ajuda com entrega, problema na plataforma...). O professor vê no
// painel, marca como lida e responde; a resposta chega na caixa de Mensagens
// do aluno. Mesmo padrão de CRUD em localStorage dos outros engines.
// Diferente da conversa entre amigos (só balões prontos), aqui o aluno pode
// escrever, porque quem lê é um adulto.
// ============================================================================

import { getStudent } from "./students";
import { sendMessage } from "./messages";

export type TeacherMessageTopic = "duvida-missao" | "ajuda-entrega" | "problema" | "outro";

export const TEACHER_MESSAGE_TOPICS: Record<TeacherMessageTopic, { label: string; icon: string }> = {
  "duvida-missao": { label: "Dúvida sobre uma missão", icon: "⚔️" },
  "ajuda-entrega": { label: "Ajuda com uma entrega", icon: "📝" },
  problema: { label: "Problema na plataforma", icon: "🛠️" },
  outro: { label: "Outro assunto", icon: "💬" },
};

export interface TeacherMessage {
  id: string;
  studentId: string;
  teacherId: string; // o professor do aluno quando ele escreveu
  topic: TeacherMessageTopic;
  missionId?: string; // missão sobre a qual ele está falando (opcional)
  body: string;
  sentAt: string;
  readAt?: string;
  reply?: string;
  repliedAt?: string;
  replierName?: string;
}

export type TeacherMessageResult = { ok: true } | { ok: false; error: string };

export const TEACHER_MESSAGE_MAX = 1000;
/** Máximo de mensagens que o aluno pode ter esperando o professor ler. */
export const TEACHER_MESSAGE_MAX_UNREAD = 5;

const KEY = "cg-teacher-messages";

function readAll(): TeacherMessage[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as TeacherMessage[];
  } catch {
    return [];
  }
}

function writeAll(list: TeacherMessage[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

/** Todas as mensagens, mais recentes primeiro. */
export function listTeacherMessages(): TeacherMessage[] {
  return readAll().sort((a, b) => b.sentAt.localeCompare(a.sentAt));
}

export function sendToTeacher(data: { studentId: string; topic: TeacherMessageTopic; missionId?: string; body: string }): TeacherMessageResult {
  const student = getStudent(data.studentId);
  if (!student) return { ok: false, error: "Aluno não encontrado." };
  const body = data.body.trim().slice(0, TEACHER_MESSAGE_MAX);
  if (!body) return { ok: false, error: "Escreva a sua mensagem." };
  const waiting = readAll().filter((m) => m.studentId === student.id && !m.readAt).length;
  if (waiting >= TEACHER_MESSAGE_MAX_UNREAD) {
    return { ok: false, error: `Você já tem ${TEACHER_MESSAGE_MAX_UNREAD} mensagens esperando o professor ler. Espere ele ler antes de mandar outra.` };
  }
  writeAll([
    ...readAll(),
    {
      id: `pm_${Date.now()}_${Math.round(Math.random() * 9999)}`,
      studentId: student.id,
      teacherId: student.teacherId,
      topic: data.topic,
      ...(data.missionId && { missionId: data.missionId }),
      body,
      sentAt: new Date().toISOString(),
    },
  ]);
  return { ok: true };
}

export function markTeacherMessageRead(id: string) {
  writeAll(readAll().map((m) => (m.id === id && !m.readAt ? { ...m, readAt: new Date().toISOString() } : m)));
}

/** O professor responde: a resposta fica na mensagem e chega na caixa de Mensagens do aluno. */
export function replyToStudent(id: string, reply: string, replier: { id: string; name: string }): TeacherMessageResult {
  const message = readAll().find((m) => m.id === id);
  if (!message) return { ok: false, error: "Essa mensagem não existe mais." };
  const text = reply.trim().slice(0, TEACHER_MESSAGE_MAX);
  if (!text) return { ok: false, error: "Escreva a resposta." };
  const now = new Date().toISOString();
  writeAll(readAll().map((m) => (m.id === id ? { ...m, reply: text, repliedAt: now, replierName: replier.name, readAt: m.readAt ?? now } : m)));
  const excerpt = message.body.length > 80 ? `${message.body.slice(0, 80)}…` : message.body;
  sendMessage({
    studentId: message.studentId,
    senderId: replier.id,
    kind: "mensagem",
    body: `💬 Resposta à sua mensagem ("${excerpt}"):\n\n${text}`,
  });
  return { ok: true };
}

/** Aluno excluído: as mensagens dele pro professor somem junto. */
export function deleteTeacherMessagesOf(studentId: string) {
  writeAll(readAll().filter((m) => m.studentId !== studentId));
}
