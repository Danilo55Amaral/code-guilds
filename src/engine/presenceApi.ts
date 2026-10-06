// ============================================================================
// PRESENCE API — o status online pela API.
//
// - Aluno logado: manda o sinal de vida (POST /presence), que já devolve quem
//   está online. Ele manda mesmo com a aba em segundo plano: o aluno continua
//   na plataforma. (O navegador atrasa os timers dessas abas, e a API dá folga
//   pra isso.)
// - Professor/ADM: só consulta (GET /presence), e só com a aba visível.
// ============================================================================

import { api } from "@/services/api";
import { emitChange } from "./events";
import { getActiveStudentId } from "./students";
import { getTeacherSessionId } from "./teachers";
import { forgetOnlineIds, saveOnlineIds } from "./presence";

/** A cada quanto tempo o site manda o sinal de vida / atualiza quem está online. */
export const PRESENCE_POLL_MS = 30000;

let refreshing: Promise<void> | null = null;

/** Manda o sinal de vida (aluno) ou consulta (professor) e atualiza quem está online. */
export function refreshPresence(): Promise<void> {
  if (refreshing) return refreshing;
  refreshing = loadPresence().finally(() => {
    refreshing = null;
  });
  return refreshing;
}

async function loadPresence() {
  const studentId = getActiveStudentId();
  const teacherId = getTeacherSessionId();

  if (!studentId && !teacherId) {
    if (forgetOnlineIds()) emitChange();
    return;
  }

  // professor com a aba escondida: não precisa atualizar agora
  if (!studentId && document.visibilityState !== "visible") return;

  try {
    const { online } = studentId
      ? await api.post<{ online: string[] }>("/presence")
      : await api.get<{ online: string[] }>("/presence");

    // trocou de conta no meio do caminho
    if (getActiveStudentId() !== studentId || getTeacherSessionId() !== teacherId) return;

    if (saveOnlineIds(online)) emitChange();
  } catch {
    // sem internet ou sessão encerrada: o próximo sinal resolve
  }
}
