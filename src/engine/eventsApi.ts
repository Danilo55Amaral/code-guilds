// ============================================================================
// EVENTS API — a agenda dos eventos pelo professor (ou pelo ADM, pra qualquer
// professor): iniciar/reabrir, liberar e encerrar cada fase e encerrar. A API guarda
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

async function changeRun(path: string, teacherId: string): Promise<string | null> {
  try {
    const { runs } = await api.post<{ runs: EventRuns }>(path, { teacherId });
    saveTeacherEventRuns(teacherId, runs[teacherId]);
    emitChange();
    return null;
  } catch (error) {
    return describeError(error);
  }
}

/** Inicia (ou reabre) o evento pros alunos do professor. Reabrir mantém as fases já liberadas. */
export function startEventRun(teacherId: string, eventId: EventId) {
  return changeRun(`/events/runs/${eventId}/start`, teacherId);
}

/** Evento em fases: libera (ou reabre) a fase pros alunos do professor. */
export function releaseEventPhase(teacherId: string, eventId: EventId, phase: number) {
  return changeRun(`/events/runs/${eventId}/phases/${phase}/release`, teacherId);
}

/** Evento em fases: encerra a fase (os alunos não jogam mais; o progresso deles fica guardado). */
export function closeEventPhase(teacherId: string, eventId: EventId, phase: number) {
  return changeRun(`/events/runs/${eventId}/phases/${phase}/close`, teacherId);
}

/** Encerra o evento: some da tela dos alunos do professor (o progresso deles fica guardado). */
export function endEventRun(teacherId: string, eventId: EventId) {
  return changeRun(`/events/runs/${eventId}/end`, teacherId);
}
