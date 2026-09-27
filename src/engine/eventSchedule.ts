// ============================================================================
// AGENDA DOS EVENTOS — cada professor decide quando um evento começa e quando
// termina pra turma dele (e o ADM pode fazer isso por qualquer professor).
// Evento que nunca foi iniciado ou que foi encerrado fica escondido dos
// alunos; o progresso deles (Student.events) continua guardado, então
// reabrir o evento devolve tudo como estava.
// Evento em fases (Natal): iniciar libera a Fase 1 e o professor libera as
// seguintes, uma por vez (a ideia é uma por semana).
// Mesmo padrão de CRUD em localStorage dos outros engines.
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

/** Inicia (ou reabre) o evento pros alunos do professor. Reabrir mantém as fases já liberadas. */
export function startEvent(teacherId: string, eventId: EventId) {
  const all = readAll();
  const now = new Date().toISOString();
  const previous = all[teacherId]?.[eventId];
  all[teacherId] = {
    ...all[teacherId],
    [eventId]: { status: "ativo", startedAt: now, phasesReleasedAt: previous?.phasesReleasedAt ?? [now] },
  };
  writeAll(all);
}

/** Evento em fases: libera a próxima fase pros alunos do professor (até `totalPhases`). */
export function releaseNextPhase(teacherId: string, eventId: EventId, totalPhases: number) {
  const all = readAll();
  const run = all[teacherId]?.[eventId];
  if (!run || run.status !== "ativo") return;
  const released = run.phasesReleasedAt ?? [run.startedAt];
  if (released.length >= totalPhases) return;
  all[teacherId] = { ...all[teacherId], [eventId]: { ...run, phasesReleasedAt: [...released, new Date().toISOString()] } };
  writeAll(all);
}

/** Encerra o evento: some da tela dos alunos do professor (o progresso deles fica guardado). */
export function endEvent(teacherId: string, eventId: EventId) {
  const all = readAll();
  const run = all[teacherId]?.[eventId];
  if (!run) return;
  all[teacherId] = { ...all[teacherId], [eventId]: { ...run, status: "encerrado", endedAt: new Date().toISOString() } };
  writeAll(all);
}

/** Apaga a agenda de um professor excluído (os alunos dele passam pra outro professor, que tem a própria agenda). */
export function deleteEventRunsOf(teacherId: string) {
  const all = readAll();
  if (!(teacherId in all)) return;
  delete all[teacherId];
  writeAll(all);
}
