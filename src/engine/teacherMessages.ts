// ============================================================================
// MENSAGENS PRO PROFESSOR — o aluno escreve pro professor dele (dúvida de
// missão, ajuda com entrega, problema na plataforma...). O professor vê no
// painel, marca como lida e responde; a resposta chega na caixa de Mensagens
// do aluno. Diferente da conversa entre amigos (só balões prontos), aqui o
// aluno pode escrever, porque quem lê é um adulto.
//
// Desde a fase 4 do back end, as mensagens ficam na API (tabela
// teacher_messages). Aqui ficam os assuntos, os limites (a API usa os
// mesmos) e o cache ("cg-teacher-messages"): o aluno tem as que ele mandou, o
// professor as que recebeu. Mandar, ler e responder ficam em
// engine/messagesApi.ts. Este arquivo não pode importar nada com "@/".
// ============================================================================

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
  missionId?: string | null; // missão sobre a qual ele está falando (opcional)
  body: string;
  sentAt: string;
  readAt?: string | null;
  reply?: string | null;
  repliedAt?: string | null;
  replierName?: string | null;
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

/** Todas as mensagens do cache, mais recentes primeiro. */
export function listTeacherMessages(): TeacherMessage[] {
  return readAll().sort((a, b) => b.sentAt.localeCompare(a.sentAt));
}

/** Troca o cache pelas mensagens que a API devolveu. */
export function saveTeacherMessages(list: TeacherMessage[]) {
  writeAll(list);
}

/** Uma mensagem nova ou alterada (lida, respondida) que a API confirmou. */
export function rememberTeacherMessage(message: TeacherMessage) {
  writeAll([...readAll().filter((m) => m.id !== message.id), message]);
}

/** Aluno excluído: as mensagens dele pro professor saem do cache. */
export function deleteTeacherMessagesOf(studentId: string) {
  writeAll(readAll().filter((m) => m.studentId !== studentId));
}
