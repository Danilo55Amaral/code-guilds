// ============================================================================
// EVENTS API — a agenda dos eventos pelo professor (ou pelo ADM, pra qualquer
// professor): iniciar/reabrir, liberar a próxima fase e encerrar. A API guarda
// a agenda (tabela event_runs) e devolve a do professor, que vai pro cache
// "cg-event-runs" (engine/eventSchedule.ts).
//
// O progresso do aluno nos eventos (abertura vista, fase concluída) fica em
// engine/gameApi.ts, junto com as outras ações do jogo.
// Toda função devolve a mensagem de erro da API, ou null se deu certo.
// ============================================================================

import { api, describeError } from "@/services/api";
import { emitChange } from "./events";
import { EventRuns, saveTeacherEventRuns } from "./eventSchedule";
import type { EventId } from "./specialEvents";

type RunAction = "start" | "release" | "end";

async function changeRun(action: RunAction, teacherId: string, eventId: EventId): Promise<string | null> {
  try {
    const { runs } = await api.post<{ runs: EventRuns }>(`/events/runs/${eventId}/${action}`, { teacherId });
    saveTeacherEventRuns(teacherId, runs[teacherId]);
    emitChange();
    return null;
  } catch (error) {
    return describeError(error);
  }
}

/** Inicia (ou reabre) o evento pros alunos do professor. Reabrir mantém as fases já liberadas. */
export function startEventRun(teacherId: string, eventId: EventId) {
  return changeRun("start", teacherId, eventId);
}

/** Evento em fases: libera a próxima fase pros alunos do professor. */
export function releaseEventPhase(teacherId: string, eventId: EventId) {
  return changeRun("release", teacherId, eventId);
}

/** Encerra o evento: some da tela dos alunos do professor (o progresso deles fica guardado). */
export function endEventRun(teacherId: string, eventId: EventId) {
  return changeRun("end", teacherId, eventId);
}
