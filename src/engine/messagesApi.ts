// ============================================================================
// MESSAGES API — as mensagens pela API (fase 4 do back end): a caixa do aluno
// (o sininho), as mensagens e os comunicados do professor, as mensagens pro
// professor e a atualização periódica da caixa.
//
// As mensagens automáticas (missão, compra, venda, troca, presente, amizade,
// entrega) quem cria é a própria API, junto com a ação. Por isso, depois de
// cada ação do jogo, o site só pede a caixa de novo (scheduleInboxRefresh).
// Toda função devolve a mensagem de erro da API, ou null se deu certo (ou um
// resultado { ok, ... }).
// ============================================================================

import { api, describeError } from "@/services/api";
import { emitChange } from "./events";
import { getActiveStudentId } from "./students";
import { getTeacherSessionId } from "./teachers";
import { BroadcastSummary, Message, MessageAudience, MessageKind, forgetMessages, markAllReadInCache, rememberMessage, saveMessagesOf } from "./messages";
import { ChatMessage, saveChatMessages } from "./friends";
import { TeacherMessage, TeacherMessageTopic, rememberTeacherMessage, saveTeacherMessages } from "./teacherMessages";

// ---------------------------------------------------------------------------
// Atualização da caixa
// ---------------------------------------------------------------------------

/** A cada quanto tempo o sininho pergunta se chegou mensagem nova (com a aba visível). */
export const INBOX_POLL_MS = 20000;
/** Com uma conversa aberta, os balões do amigo chegam mais rápido. */
export const CHAT_POLL_MS = 4000;

let refreshingInbox: Promise<void> | null = null;

/**
 * Busca na API as mensagens de quem está logado e atualiza o cache:
 * - aluno: a caixa, as conversas com os amigos e o que ele mandou pro professor;
 * - professor: as mensagens que os alunos mandaram pra ele.
 * É bem mais leve que a sincronização completa (refreshFromApi).
 */
export function refreshInbox(): Promise<void> {
  if (refreshingInbox) return refreshingInbox;
  refreshingInbox = loadInbox().finally(() => {
    refreshingInbox = null;
  });
  return refreshingInbox;
}

async function loadInbox() {
  const studentId = getActiveStudentId();
  const teacherId = getTeacherSessionId();
  try {
    if (studentId) {
      const [{ messages }, chats, sent] = await Promise.all([
        api.get<{ messages: Message[] }>("/messages"),
        api.get<{ messages: ChatMessage[] }>("/chats"),
        api.get<{ messages: TeacherMessage[] }>("/teacher-messages"),
      ]);
      if (getActiveStudentId() !== studentId) return; // trocou de conta no meio do caminho
      forgetMessages(); // só ficam as mensagens de quem está logado
      saveMessagesOf(studentId, messages);
      saveChatMessages(chats.messages);
      saveTeacherMessages(sent.messages);
      emitChange();
    } else if (teacherId) {
      const { messages } = await api.get<{ messages: TeacherMessage[] }>("/teacher-messages");
      if (getTeacherSessionId() !== teacherId) return;
      saveTeacherMessages(messages);
      emitChange();
    }
  } catch {
    // sem internet ou sessão encerrada: a próxima sincronização resolve
  }
}

let scheduled: ReturnType<typeof setTimeout> | null = null;

/** Pede a caixa de novo daqui a pouco (várias ações seguidas viram uma busca só). */
export function scheduleInboxRefresh() {
  if (typeof window === "undefined") return;
  if (scheduled) clearTimeout(scheduled);
  scheduled = setTimeout(() => {
    scheduled = null;
    void refreshInbox();
  }, 400);
}

// ---------------------------------------------------------------------------
// A caixa do aluno
// ---------------------------------------------------------------------------

/** O aluno abriu a mensagem. */
export async function markMessageRead(id: string): Promise<string | null> {
  try {
    const { message } = await api.post<{ message: Message }>(`/messages/${id}/read`);
    rememberMessage(message);
    emitChange();
    return null;
  } catch (error) {
    return describeError(error);
  }
}

export async function markAllMessagesRead(studentId: string): Promise<string | null> {
  try {
    await api.post("/messages/read-all");
    markAllReadInCache(studentId);
    emitChange();
    return null;
  } catch (error) {
    return describeError(error);
  }
}

// ---------------------------------------------------------------------------
// Pelo professor / ADM
// ---------------------------------------------------------------------------

/** A caixa de um aluno (a ficha do aluno mostra o histórico e se cada mensagem foi lida). */
export async function loadStudentMessages(studentId: string): Promise<string | null> {
  try {
    const { messages } = await api.get<{ messages: Message[] }>(`/messages?studentId=${studentId}`);
    saveMessagesOf(studentId, messages);
    emitChange();
    return null;
  } catch (error) {
    return describeError(error);
  }
}

/** Aviso ou mensagem pra um aluno. */
export async function sendMessageToStudent(data: { studentId: string; kind: MessageKind; body: string }): Promise<string | null> {
  try {
    const { message } = await api.post<{ message: Message }>("/messages", data);
    rememberMessage(message);
    emitChange();
    return null;
  } catch (error) {
    return describeError(error);
  }
}

/** Comunicado pros alunos do professor: a turma toda ou uma casa. */
export async function sendBroadcast(data: { audience: MessageAudience; kind: MessageKind; body: string }) {
  try {
    const { sent } = await api.post<{ broadcastId: string; sent: number }>("/messages/broadcast", data);
    return { ok: true as const, sent };
  } catch (error) {
    return { ok: false as const, error: describeError(error) };
  }
}

/** Os comunicados que o professor já mandou, com quantos alunos leram cada um. */
export async function loadBroadcasts(): Promise<BroadcastSummary[]> {
  try {
    const { broadcasts } = await api.get<{ broadcasts: BroadcastSummary[] }>("/messages/broadcasts");
    return broadcasts;
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Mensagens pro professor
// ---------------------------------------------------------------------------

/** O aluno escreve pro professor dele. */
export async function sendTeacherMessage(data: { topic: TeacherMessageTopic; missionId?: string; body: string }): Promise<string | null> {
  try {
    const { message } = await api.post<{ message: TeacherMessage }>("/teacher-messages", data);
    rememberTeacherMessage(message);
    emitChange();
    return null;
  } catch (error) {
    return describeError(error);
  }
}

/** O professor marca como lida. */
export async function markTeacherMessageRead(id: string): Promise<string | null> {
  try {
    const { message } = await api.post<{ message: TeacherMessage }>(`/teacher-messages/${id}/read`);
    rememberTeacherMessage(message);
    emitChange();
    return null;
  } catch (error) {
    return describeError(error);
  }
}

/** O professor responde: a resposta chega na caixa de Mensagens do aluno. */
export async function replyTeacherMessage(id: string, reply: string): Promise<string | null> {
  try {
    const { message } = await api.post<{ message: TeacherMessage }>(`/teacher-messages/${id}/reply`, { reply });
    rememberTeacherMessage(message);
    emitChange();
    return null;
  } catch (error) {
    return describeError(error);
  }
}
