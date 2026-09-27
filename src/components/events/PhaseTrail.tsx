"use client";

import { Mission } from "@/engine/missions";
import { Student } from "@/engine/students";
import { AcademyEvent, EventPhase, eventMissionsFor, eventPhases, phaseLock, phaseProgress } from "@/engine/specialEvents";
import { RarityBadge } from "../GameUI";
import { EVENT_VISUALS } from "./registry";

// ============================================================================
// TRILHA DAS FASES — evento em fases (Natal): um cartão por fase, ligados por
// uma trilha, com a situação do aluno em cada uma (concluída, em andamento,
// nova, esperando o professor liberar, esperando terminar a anterior) e o item
// lendário de cada fase. Com `onSelect`, cada cartão vira um botão (tela do
// evento); sem, é só pra mostrar (card no Salão dos Eventos).
// ============================================================================

export type PhaseState = "concluida" | "andamento" | "nova" | "em-breve" | "trancada";

export function phaseState(student: Student, event: AcademyEvent, phase: number, released: number): PhaseState {
  const progress = phaseProgress(student, event, phase);
  if (progress.finishedAt) return "concluida";
  const lock = phaseLock(student, event, phase, released);
  if (lock) return lock === "professor" ? "em-breve" : "trancada";
  return progress.introSeenAt ? "andamento" : "nova";
}

const STATE_META: Record<PhaseState, { label: string; className: string }> = {
  concluida: { label: "🏆 Concluída", className: "border-emerald-400/60 bg-emerald-500/20 text-emerald-200" },
  andamento: { label: "🔥 Em andamento", className: "border-orange-400/60 bg-orange-500/20 text-orange-200" },
  nova: { label: "✨ Liberada!", className: "border-amber-300/60 bg-amber-400/20 text-amber-100" },
  "em-breve": { label: "🔒 Em breve", className: "border-slate-500/60 bg-slate-800/80 text-slate-300" },
  trancada: { label: "🔒 Termine a anterior", className: "border-slate-500/60 bg-slate-800/80 text-slate-300" },
};

export default function PhaseTrail({
  event,
  student,
  missions,
  released,
  selected,
  onSelect,
}: {
  event: AcademyEvent;
  student: Student;
  /** Todas as missões (a trilha filtra as do evento, do professor do aluno, de cada fase). */
  missions: Mission[];
  released: number;
  selected?: number;
  onSelect?: (phase: number) => void;
}) {
  const visual = EVENT_VISUALS[event.id];
  const { ProgressIcon } = visual;
  const phases = eventPhases(event);

  function card(phase: EventPhase) {
    const state = phaseState(student, event, phase.number, released);
    const meta = STATE_META[state];
    const list = eventMissionsFor(missions, event.id, student.teacherId, phase.number);
    const done = list.filter((m) => student.completedMissionIds.includes(m.id)).length;
    const locked = state === "em-breve" || state === "trancada";
    const active = selected === phase.number;
    const content = (
      <>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className={`text-[10px] font-bold uppercase tracking-widest ${visual.accentClass}`}>Fase {phase.number}</p>
            <p className={`mt-0.5 text-sm font-black leading-tight ${locked ? "text-slate-400" : "text-white"}`}>
              {phase.icon} {phase.title}
            </p>
          </div>
          <ProgressIcon lit={state === "concluida"} phase={phase.number} className={`h-12 w-auto shrink-0 ${locked ? "opacity-50 grayscale" : ""}`} />
        </div>
        <span className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${meta.className}`}>
          {meta.label}
          {state === "andamento" && list.length > 0 && ` • ${done}/${list.length}`}
        </span>
        <p className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-300">
          <span className="text-base">{phase.reward.item.icon}</span>
          <span className={`font-semibold ${locked ? "text-slate-400" : "text-amber-100"}`}>{phase.reward.item.name}</span>
          <RarityBadge rarity={phase.reward.item.rarity} />
        </p>
      </>
    );
    const className = `relative flex-1 rounded-2xl border p-3 text-left transition-colors ${
      active ? "border-amber-300 bg-black/60 ring-2 ring-amber-300/50" : state === "concluida" ? "border-emerald-400/40 bg-black/40" : locked ? "border-slate-700/70 bg-black/30" : "border-amber-300/40 bg-black/40"
    }`;
    return onSelect ? (
      <button key={phase.number} type="button" onClick={() => onSelect(phase.number)} className={`${className} hover:border-amber-200`} aria-pressed={active}>
        {content}
      </button>
    ) : (
      <div key={phase.number} className={className}>
        {content}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
      {phases.map((phase, i) => (
        <div key={phase.number} className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          {card(phase)}
          {i < phases.length - 1 && (
            <span className={`self-center text-lg sm:text-xl ${phaseProgress(student, event, phase.number).finishedAt ? visual.accentClass : "text-slate-600"}`} aria-hidden="true">
              <span className="hidden sm:inline">➜</span>
              <span className="sm:hidden">⬇</span>
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
