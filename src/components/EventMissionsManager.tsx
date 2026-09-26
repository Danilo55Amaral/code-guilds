"use client";

import { useState } from "react";
import { Mission } from "@/engine/missions";
import { Student } from "@/engine/students";
import { ACADEMY_EVENTS, AcademyEvent, EventId, eventProgress } from "@/engine/specialEvents";
import { EVENT_STATUS_META, EventRun } from "@/engine/eventSchedule";
import EventRanking from "./EventRanking";
import { EVENT_VISUALS } from "./events/registry";
import { DifficultyBadge } from "./GameUI";

// ============================================================================
// EVENTOS NO PAINEL DO PROFESSOR (e na aba Eventos do Painel ADM) — pra cada
// evento da Academia: iniciar/encerrar o evento pra turma (só aparece pros
// alunos enquanto está acontecendo), criar uma missão só do evento, atribuir
// uma missão que já existe (ela sai da lista normal e passa a aparecer só na
// tela do evento), tirar do evento e usar as missões prontas com um clique.
// Os alunos só veem os eventos e as missões do próprio professor.
// ============================================================================

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR");
}

function EventPanel({
  event,
  run,
  missions,
  students,
  ranking,
  onStart,
  onEnd,
  onEdit,
  onCreate,
  onAssign,
  onUnassign,
  onAddPresets,
}: {
  event: AcademyEvent;
  run: EventRun | undefined;
  missions: Mission[];
  students: Student[];
  ranking: { students: Student[]; missions: Mission[] };
  onStart: (eventId: EventId) => void;
  onEnd: (eventId: EventId) => void;
  onEdit: (mission: Mission) => void;
  onCreate: (eventId: EventId) => void;
  onAssign: (missionId: string, eventId: EventId) => void;
  onUnassign: (missionId: string) => void;
  onAddPresets: (eventId: EventId) => void;
}) {
  const visual = EVENT_VISUALS[event.id];
  const { Art } = visual;
  const [assignId, setAssignId] = useState("");
  const [addedPresets, setAddedPresets] = useState<number | null>(null);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const status = run?.status ?? "nao-iniciado";
  const statusMeta = EVENT_STATUS_META[status];

  const eventList = missions.filter((m) => m.eventId === event.id);
  const regular = missions.filter((m) => !m.eventId);
  const missingPresets = event.presetMissions.filter((p) => !eventList.some((m) => m.title === p.title));
  const entered = students.filter((s) => eventProgress(s, event.id).introSeenAt).length;
  const finished = students.filter((s) => eventProgress(s, event.id).finishedAt).length;

  function assign() {
    if (!assignId) return;
    onAssign(assignId, event.id);
    setAssignId("");
  }

  function endEvent() {
    if (!confirmEnd) {
      setConfirmEnd(true);
      return;
    }
    onEnd(event.id);
    setConfirmEnd(false);
  }

  function addPresets() {
    const n = missingPresets.length;
    onAddPresets(event.id);
    setAddedPresets(n);
  }

  return (
    <div className={`cg-dark-scope overflow-hidden rounded-2xl border ${visual.borderClass}`}>
      <div className="relative h-32 sm:h-40">
        <Art art="poster" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-5">
          <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${visual.accentClass}`}>{event.tagline}</p>
          <p className={`text-2xl font-black uppercase sm:text-3xl ${visual.titleClass}`} style={{ textShadow: visual.titleGlow }}>
            {event.title}
          </p>
        </div>
        <span className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur ${statusMeta.className}`}>{statusMeta.label}</span>
      </div>

      <div className="p-5" style={{ background: visual.panelBackground }}>
        {/* ---- iniciar / encerrar ---- */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-700/60 bg-black/40 p-3">
          <p className="min-w-0 flex-1 text-xs text-slate-300">
            {status === "ativo" && run
              ? `Visível pros alunos desde ${formatDate(run.startedAt)}. Encerrar esconde o evento de novo (o progresso de cada aluno fica guardado).`
              : status === "encerrado" && run?.endedAt
                ? `Encerrado em ${formatDate(run.endedAt)}: escondido dos alunos. Reabrir devolve o evento com o progresso de cada um.`
                : "Escondido dos alunos. Prepare as missões e clique em Iniciar pra ele aparecer no Salão dos Eventos."}
            {status !== "ativo" && eventList.length === 0 && (
              <span className="mt-1 block text-amber-300">⚠ Ainda não há missões neste evento: os alunos veriam só a história, sem conseguir finalizar.</span>
            )}
          </p>
          {status === "ativo" ? (
            <button
              onClick={endEvent}
              onBlur={() => setConfirmEnd(false)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black transition-colors ${
                confirmEnd ? "border-rose-300 bg-rose-500/30 text-rose-100" : "border-rose-400/60 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
              }`}
            >
              {confirmEnd ? "Confirmar: encerrar agora?" : "⏹ Encerrar evento"}
            </button>
          ) : (
            <button onClick={() => onStart(event.id)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition-transform hover:scale-[1.03] ${visual.buttonClass}`}>
              {status === "encerrado" ? "▶ Reabrir evento" : "▶ Iniciar evento"}
            </button>
          )}
        </div>

        <p className="max-w-3xl text-sm text-slate-300">{event.summary}</p>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl border border-slate-700/60 bg-black/30 p-3">
            <p className="text-2xl font-black text-white">{eventList.length}</p>
            <p className="text-[11px] uppercase tracking-wider text-slate-400">Missões no evento</p>
          </div>
          <div className="rounded-xl border border-slate-700/60 bg-black/30 p-3">
            <p className="text-2xl font-black text-white">{entered}</p>
            <p className="text-[11px] uppercase tracking-wider text-slate-400">Alunos entraram</p>
          </div>
          <div className="rounded-xl border border-slate-700/60 bg-black/30 p-3">
            <p className="text-2xl font-black text-emerald-300">{finished}</p>
            <p className="text-[11px] uppercase tracking-wider text-slate-400">Finalizaram</p>
          </div>
        </div>

        {/* ---- ações ---- */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => onCreate(event.id)} className={`rounded-full px-4 py-2 text-xs font-black transition-transform hover:scale-[1.03] ${visual.buttonClass}`}>
            + Criar missão do evento
          </button>
          <button
            onClick={addPresets}
            disabled={missingPresets.length === 0}
            title={missingPresets.length === 0 ? "Todas as missões prontas já estão no evento" : event.presetMissions.map((p) => `${p.icon} ${p.title}`).join("\n")}
            className={`rounded-full border bg-black/40 px-4 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${visual.chipClass}`}
          >
            ✨ {missingPresets.length === 0 ? "Missões prontas já adicionadas" : `Usar ${missingPresets.length} ${missingPresets.length === 1 ? "missão pronta" : "missões prontas"} do evento`}
          </button>
        </div>
        {addedPresets !== null && addedPresets > 0 && (
          <p className="mt-2 text-xs text-emerald-300">
            ✓ {addedPresets} {addedPresets === 1 ? "missão adicionada" : "missões adicionadas"} ao evento. Clique numa delas pra editar.
          </p>
        )}

        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <select value={assignId} onChange={(e) => setAssignId(e.target.value)} className="cg-input !py-2 text-xs sm:max-w-sm" aria-label="Missão existente pra atribuir ao evento">
            <option value="">{regular.length === 0 ? "Nenhuma missão normal pra atribuir" : "Atribuir uma missão que já existe…"}</option>
            {regular.map((m) => (
              <option key={m.id} value={m.id}>
                {m.icon} {m.title}
              </option>
            ))}
          </select>
          <button onClick={assign} disabled={!assignId} className="rounded-full border border-slate-600 bg-black/40 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-40">
            📥 Atribuir ao evento
          </button>
        </div>

        {/* ---- missões do evento ---- */}
        {eventList.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-slate-700 bg-black/20 p-4 text-sm text-slate-400">
            Nenhuma missão neste evento ainda. Crie uma, atribua uma missão que já existe ou use as missões prontas: os alunos só conseguem finalizar o evento depois de concluir todas as missões dele.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            {eventList.map((m) => {
              const completions = students.filter((s) => s.completedMissionIds.includes(m.id)).length;
              return (
                <div key={m.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-700/70 bg-black/40 px-4 py-2.5">
                  <button onClick={() => onEdit(m)} className="flex min-w-0 flex-1 items-center gap-3 text-left" title="Editar missão">
                    <span className="text-lg">{m.icon}</span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-white hover:underline">{m.title}</span>
                      <span className="block truncate text-xs text-slate-500">{m.description}</span>
                    </span>
                  </button>
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <DifficultyBadge difficulty={m.difficulty} />
                    <span className="text-slate-500">{completions} concluíram</span>
                    <button onClick={() => onEdit(m)} className="text-slate-300 hover:text-white">
                      ✏️ Editar
                    </button>
                    <button onClick={() => onUnassign(m.id)} className="text-rose-300 hover:text-rose-200" title="A missão volta pra lista de missões normais">
                      ↩ Tirar do evento
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ---- ranking do evento ---- */}
        <button
          onClick={() => setShowRanking((v) => !v)}
          className={`mt-4 w-full rounded-xl border bg-black/40 px-4 py-2.5 text-sm font-bold transition-colors ${visual.chipClass}`}
        >
          {showRanking ? "▲ Esconder o ranking do evento" : "🏆 Ver ranking do evento (casas e alunos)"}
        </button>
        {showRanking && (
          <div className="mt-3">
            <EventRanking event={event} students={ranking.students} missions={ranking.missions} status={status} />
          </div>
        )}

        <p className="mt-4 text-[11px] text-slate-500">
          Com o evento acontecendo, os alunos encontram ele em Eventos → Entrar. Quem conclui todas as missões ganha o botão &quot;Finalizar evento&quot;, assiste ao final da história e recebe {event.reward.item.icon}{" "}
          {event.reward.item.name}, +{event.reward.xp} XP e {event.reward.coins} moedas.
        </p>
      </div>
    </div>
  );
}

export default function EventMissionsManager({
  runs,
  headerRight,
  ...panelProps
}: {
  /** Situação de cada evento pra turma desse professor (iniciado, encerrado...). */
  runs: Partial<Record<EventId, EventRun>>;
  /** Todas as missões do professor (as normais aparecem na opção de atribuir). */
  missions: Mission[];
  students: Student[];
  /** Quem entra no ranking de cada evento (professor: a turma dele; ADM: a plataforma toda). */
  ranking: { students: Student[]; missions: Mission[] };
  onStart: (eventId: EventId) => void;
  onEnd: (eventId: EventId) => void;
  onEdit: (mission: Mission) => void;
  onCreate: (eventId: EventId) => void;
  onAssign: (missionId: string, eventId: EventId) => void;
  onUnassign: (missionId: string) => void;
  onAddPresets: (eventId: EventId) => void;
  /** Só o Painel ADM passa: a escolha do professor. */
  headerRight?: React.ReactNode;
}) {
  return (
    <div className="cg-card mb-6 p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-sm font-semibold text-slate-300">📅 Eventos da Academia</p>
          <p className="text-xs text-slate-500">
            Os alunos só veem um evento enquanto ele está acontecendo. Missões de evento aparecem só na tela do evento, com história animada e recompensa final.
          </p>
        </div>
        {headerRight}
      </div>
      <div className="flex flex-col gap-4">
        {ACADEMY_EVENTS.map((event) => (
          <EventPanel key={event.id} event={event} run={runs[event.id]} {...panelProps} />
        ))}
      </div>
    </div>
  );
}
