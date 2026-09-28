// ============================================================================
// AGENDA DOS EVENTOS — cada professor decide quando um evento começa e quando
// termina pra turma dele (e o ADM pode fazer isso por qualquer professor).
// Evento que nunca foi iniciado ou que foi encerrado fica escondido dos
// alunos; o progresso deles (Student.events) continua guardado, então
// reabrir o evento devolve tudo como estava.
// Evento em fases (Natal): iniciar libera a Fase 1 e o professor libera as
// seguintes, uma por vez (a ideia é uma por semana).
//
// Desde a fase 3 do back end, a agenda é da API (tabela event_runs): aqui fica
// o cache ("cg-event-runs") e as funções de leitura. Iniciar, liberar fase e
// encerrar ficam em engine/eventsApi.ts.
// ============================================================================

import type { EventId } from "./specialEvents";

export type EventStatus = "nao-iniciado" | "ativo" | "encerrado";

export interface EventRun {
  status: "ativo" | "encerrado";
  startedAt: string;
  endedAt?: string;
  /** Evento em fases: quando cada fase foi liberada (a posição 0 é a Fase 1). Sem valor = só a Fase 1. */
  phasesReleasedAt?: string[];
}

/** professor -> evento -> situação */
export type EventRuns = Record<string, Partial<Record<EventId, EventRun>>>;

export const EVENT_STATUS_META: Record<EventStatus, { label: string; className: string }> = {
  "nao-iniciado": { label: "⏸ Não iniciado", className: "border-slate-500/60 bg-slate-800/80 text-slate-300" },
  ativo: { label: "🟢 Acontecendo", className: "border-emerald-400/60 bg-emerald-500/20 text-emerald-200" },
  encerrado: { label: "⏹ Encerrado", className: "border-rose-400/60 bg-rose-500/20 text-rose-200" },
};

const RUNS_KEY = "cg-event-runs";

function readAll(): EventRuns {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(RUNS_KEY) ?? "{}") as EventRuns;
  } catch {
    return {};
  }
}

function writeAll(runs: EventRuns) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(RUNS_KEY, JSON.stringify(runs));
}

export function listEventRuns(): EventRuns {
  return readAll();
}

export function statusIn(runs: EventRuns, teacherId: string, eventId: EventId): EventStatus {
  return runs[teacherId]?.[eventId]?.status ?? "nao-iniciado";
}

/** Quantas fases do evento o professor já liberou (0 = evento nunca iniciado). */
export function releasedPhasesIn(runs: EventRuns, teacherId: string, eventId: EventId): number {
  const run = runs[teacherId]?.[eventId];
  if (!run) return 0;
  return Math.max(1, run.phasesReleasedAt?.length ?? 1);
}

/** Troca o cache pela agenda que a API devolveu (a de todos os professores que a pessoa pode ver). */
export function saveEventRuns(runs: EventRuns) {
  writeAll(runs);
}

/** Atualiza só a agenda de um professor (a API devolve ela depois de iniciar, liberar ou encerrar). */
export function saveTeacherEventRuns(teacherId: string, runs: EventRuns[string] | undefined) {
  const all = readAll();
  if (runs) all[teacherId] = runs;
  else delete all[teacherId];
  writeAll(all);
}

/** Apaga do cache a agenda de um professor excluído (a API já apagou a dele; os alunos passam pro herdeiro, que tem a própria agenda). */
export function deleteEventRunsOf(teacherId: string) {
  const all = readAll();
  if (!(teacherId in all)) return;
  delete all[teacherId];
  writeAll(all);
}
