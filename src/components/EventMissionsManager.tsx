"use client";

import { useState } from "react";
import { DEFAULT_AVATAR } from "@/engine/avatar";
import { Mission } from "@/engine/missions";
import { Student } from "@/engine/students";
import {
  ACADEMY_EVENTS,
  AcademyEvent,
  EventId,
  EventPhase,
  PhaseStatus,
  eventFinishedAt,
  eventPhases,
  eventStarted,
  getPhase,
  missingPresets,
  missionPhase,
  phaseProgress,
  phaseStatuses,
} from "@/engine/specialEvents";
import { EVENT_STATUS_META, EventRun } from "@/engine/eventSchedule";
import EventRanking from "./EventRanking";
import EventScene from "./EventScene";
import { EVENT_VISUALS, EventVisual } from "./events/registry";
import { DifficultyBadge, RarityBadge } from "./GameUI";

// ============================================================================
// EVENTOS NO PAINEL DO PROFESSOR (e na aba Eventos do Painel ADM) — pra cada
// evento da Academia: iniciar/encerrar o evento pra turma (só aparece pros
// alunos enquanto está acontecendo), criar uma missão só do evento, atribuir
// uma missão que já existe (ela sai da lista normal e passa a aparecer só na
// tela do evento), tirar do evento e usar as missões prontas com um clique.
// Evento em fases (Natal, A Noite de Dracoding): as mesmas ferramentas pra cada
// fase, e liberar, encerrar ou reabrir cada fase quando quiser, em qualquer
// ordem (a ideia é uma por semana).
// Em todo evento, o professor (e o ADM) assiste à abertura e ao final de cada
// fase como os alunos vão ver, sem precisar iniciar o evento.
// Os alunos só veem os eventos e as missões do próprio professor.
// ============================================================================

/** Iniciar ou encerrar o evento (na API): devolve a mensagem de erro, ou null se deu certo. */
type RunAction = (eventId: EventId) => Promise<string | null>;

/** Liberar (ou reabrir) ou encerrar uma fase (na API): devolve a mensagem de erro, ou null se deu certo. */
type PhaseAction = (eventId: EventId, phase: number) => Promise<string | null>;

/** O aluno de exemplo das cenas assistidas pelo professor: o avatar padrão, sem nada equipado. */
const PREVIEW_STUDENT: Student = {
  id: "previa",
  name: "Aprendiz",
  email: "",
  turma: "",
  username: "",
  hasPassword: false,
  teacherId: "",
  houseId: null,
  avatar: DEFAULT_AVATAR,
  level: 1,
  xp: 0,
  coins: 0,
  inventory: [],
  completedMissionIds: [],
  onboardingStep: "completo",
  equipped: {},
  events: {},
  bonusSlots: 0,
  pendingItems: [],
  createdAt: "",
};

const PHASE_STATUS_META: Record<PhaseStatus, { label: string; className: string }> = {
  fechada: { label: "🔒 Ainda não liberada", className: "border-slate-500/60 bg-slate-800/80 text-slate-300" },
  liberada: { label: "🟢 Liberada", className: "border-emerald-400/60 bg-emerald-500/20 text-emerald-200" },
  encerrada: { label: "⏹ Encerrada", className: "border-rose-400/60 bg-rose-500/15 text-rose-200" },
};

/** Os botões de assistir à abertura e ao final de uma fase (evento comum: do evento). */
function PreviewButtons({ phase, phased, onPreview }: { phase: number; phased: boolean; onPreview: (phase: number, kind: "intro" | "outro") => void }) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
      <span className="text-slate-400">🎬 Assistir {phased ? "às cenas da fase" : "às cenas do evento"}:</span>
      <button onClick={() => onPreview(phase, "intro")} className="rounded-full border border-violet-400/50 bg-violet-500/10 px-3 py-1.5 font-semibold text-violet-100 transition-colors hover:bg-violet-500/25">
        ▶ Abertura
      </button>
      <button onClick={() => onPreview(phase, "outro")} className="rounded-full border border-violet-400/50 bg-violet-500/10 px-3 py-1.5 font-semibold text-violet-100 transition-colors hover:bg-violet-500/25">
        ▶ Final
      </button>
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR");
}

interface PanelActions {
  onEdit: (mission: Mission) => void;
  onCreate: (eventId: EventId, phase: number) => void;
  onAssign: (missionId: string, eventId: EventId, phase: number) => void;
  onUnassign: (missionId: string) => void;
  onAddPresets: (eventId: EventId, phase: number) => void;
}

/** Criar / missões prontas / atribuir e a lista de missões de uma fase (evento comum: a única). */
function PhaseMissions({
  event,
  phase,
  visual,
  missions,
  students,
  onEdit,
  onCreate,
  onAssign,
  onUnassign,
  onAddPresets,
}: PanelActions & { event: AcademyEvent; phase: EventPhase; visual: EventVisual; missions: Mission[]; students: Student[] }) {
  const [assignId, setAssignId] = useState("");
  const [addedPresets, setAddedPresets] = useState<number | null>(null);
  const phaseList = missions.filter((m) => m.eventId === event.id && missionPhase(m) === phase.number);
  const regular = missions.filter((m) => !m.eventId);
  const missing = missingPresets(event, phase.number, missions);
  const phased = !!event.phases;

  function assign() {
    if (!assignId) return;
    onAssign(assignId, event.id, phase.number);
    setAssignId("");
  }

  function addPresets() {
    const n = missing.length;
    onAddPresets(event.id, phase.number);
    setAddedPresets(n);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => onCreate(event.id, phase.number)} className={`rounded-full px-4 py-2 text-xs font-black transition-transform hover:scale-[1.03] ${visual.buttonClass}`}>
          + Criar missão {phased ? `da Fase ${phase.number}` : "do evento"}
        </button>
        {/* evento sem missões prontas (A Noite de Dracoding: as missões são sorteadas das do professor) não mostra o botão */}
        {phase.presetMissions.length > 0 && (
          <button
            onClick={addPresets}
            disabled={missing.length === 0}
            title={missing.length === 0 ? "Todas as missões prontas já foram adicionadas" : phase.presetMissions.map((p) => `${p.icon} ${p.title}`).join("\n")}
            className={`rounded-full border bg-black/40 px-4 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${visual.chipClass}`}
          >
            ✨ {missing.length === 0 ? "Missões prontas já adicionadas" : `Usar ${missing.length} ${missing.length === 1 ? "missão pronta" : "missões prontas"}${phased ? " da fase" : " do evento"}`}
          </button>
        )}
      </div>
      {addedPresets !== null && addedPresets > 0 && (
        <p className="mt-2 text-xs text-emerald-300">
          ✓ {addedPresets} {addedPresets === 1 ? "missão adicionada" : "missões adicionadas"}. Clique numa delas pra editar.
        </p>
      )}

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <select value={assignId} onChange={(e) => setAssignId(e.target.value)} className="cg-input !py-2 text-xs sm:max-w-sm" aria-label={`Missão existente pra atribuir ${phased ? `à Fase ${phase.number}` : "ao evento"}`}>
          <option value="">{regular.length === 0 ? "Nenhuma missão normal pra atribuir" : "Atribuir uma missão que já existe…"}</option>
          {regular.map((m) => (
            <option key={m.id} value={m.id}>
              {m.icon} {m.title}
            </option>
          ))}
        </select>
        <button onClick={assign} disabled={!assignId} className="rounded-full border border-slate-600 bg-black/40 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-40">
          📥 Atribuir {phased ? "à fase" : "ao evento"}
        </button>
      </div>

      {phaseList.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-slate-700 bg-black/20 p-4 text-sm text-slate-400">
          {phased
            ? `Nenhuma missão na Fase ${phase.number} ainda. Crie uma ou atribua uma missão que já existe${phase.presetMissions.length > 0 ? " (ou use as missões prontas)" : ""}: os alunos só concluem a fase depois de vencer todas as missões dela.`
            : "Nenhuma missão neste evento ainda. Crie uma, atribua uma missão que já existe ou use as missões prontas: os alunos só conseguem finalizar o evento depois de concluir todas as missões dele."}
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-2">
          {phaseList.map((m) => {
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
    </div>
  );
}

function EventPanel({
  event,
  run,
  missions,
  students,
  ranking,
  onStart,
  onEnd,
  onReleasePhase,
  onClosePhase,
  ...actions
}: PanelActions & {
  event: AcademyEvent;
  run: EventRun | undefined;
  missions: Mission[];
  students: Student[];
  ranking: { students: Student[]; missions: Mission[] };
  onStart: RunAction;
  onEnd: RunAction;
  onReleasePhase: PhaseAction;
  onClosePhase: PhaseAction;
}) {
  const visual = EVENT_VISUALS[event.id];
  const { Art } = visual;
  // Ações que pedem confirmação (um segundo clique): "end", "release-2", "close-1"...
  const [confirming, setConfirming] = useState<string | null>(null);
  const [showRanking, setShowRanking] = useState(false);
  // A cena que o professor está assistindo (abertura ou final de uma fase)
  const [preview, setPreview] = useState<{ phase: number; kind: "intro" | "outro" } | null>(null);
  // Iniciar/liberar/encerrar falam com a API: uma ação por vez, e o erro aparece no card
  const [runBusy, setRunBusy] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);
  const status = run?.status ?? "nao-iniciado";
  const statusMeta = EVENT_STATUS_META[status];
  const phases = eventPhases(event);
  const phased = phases.length > 1;
  const statuses = phaseStatuses(event, run);
  const releasedCount = statuses.filter((s) => s === "liberada").length;

  const eventList = missions.filter((m) => m.eventId === event.id);
  const entered = students.filter((s) => eventStarted(s, event)).length;
  const finished = students.filter((s) => eventFinishedAt(s, event)).length;
  const emptyPhases = phases.filter((p) => !eventList.some((m) => missionPhase(m) === p.number));

  async function changeRun(action: () => Promise<string | null>) {
    if (runBusy) return;
    setRunBusy(true);
    setRunError(await action());
    setRunBusy(false);
  }

  /** Primeiro clique pede confirmação; o segundo faz. */
  function confirmThen(key: string, action: () => Promise<string | null>) {
    if (confirming !== key) {
      setConfirming(key);
      return;
    }
    setConfirming(null);
    void changeRun(action);
  }

  /** Quando a fase foi liberada ou encerrada (pra mostrar no card da fase). */
  function phaseDate(phase: number, kind: "released" | "closed"): string | null {
    const list = kind === "released" ? (run?.phasesReleasedAt?.length ? run.phasesReleasedAt : run ? [run.startedAt] : []) : (run?.phasesClosedAt ?? []);
    return list[phase - 1] ?? null;
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
        <span className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur ${statusMeta.className}`}>
          {statusMeta.label}
          {phased && status === "ativo" && ` • ${releasedCount} de ${phases.length} fases liberadas`}
        </span>
      </div>

      <div className="p-5" style={{ background: visual.panelBackground }}>
        {/* ---- iniciar / encerrar ---- */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-700/60 bg-black/40 p-3">
          <p className="min-w-0 flex-1 text-xs text-slate-300">
            {status === "ativo" && run
              ? `Visível pros alunos desde ${formatDate(run.startedAt)}. Encerrar esconde o evento de novo (o progresso de cada aluno fica guardado).`
              : status === "encerrado" && run?.endedAt
                ? `Encerrado em ${formatDate(run.endedAt)}: escondido dos alunos. Reabrir devolve o evento com o progresso de cada um.`
                : phased
                  ? "Escondido dos alunos. Prepare as missões e clique em Iniciar: o evento aparece no Salão dos Eventos com a Fase 1 liberada."
                  : "Escondido dos alunos. Prepare as missões e clique em Iniciar pra ele aparecer no Salão dos Eventos."}
            {status !== "ativo" && eventList.length === 0 && (
              <span className="mt-1 block text-amber-300">⚠ Ainda não há missões neste evento: os alunos veriam só a história, sem conseguir {phased ? "concluir a fase" : "finalizar"}.</span>
            )}
          </p>
          {status === "ativo" ? (
            <button
              onClick={() => confirmThen("end", () => onEnd(event.id))}
              onBlur={() => setConfirming(null)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black transition-colors ${
                confirming === "end" ? "border-rose-300 bg-rose-500/30 text-rose-100" : "border-rose-400/60 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
              }`}
            >
              {confirming === "end" ? "Confirmar: encerrar agora?" : "⏹ Encerrar evento"}
            </button>
          ) : (
            <button
              onClick={() => changeRun(() => onStart(event.id))}
              disabled={runBusy}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition-transform hover:scale-[1.03] disabled:opacity-50 ${visual.buttonClass}`}
            >
              {status === "encerrado" ? "▶ Reabrir evento" : "▶ Iniciar evento"}
            </button>
          )}
          {runError && <p className="w-full text-xs text-rose-300">{runError}</p>}
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
            <p className="text-[11px] uppercase tracking-wider text-slate-400">{phased ? `Finalizaram as ${phases.length} fases` : "Finalizaram"}</p>
          </div>
        </div>

        {!phased ? (
          <div className="mt-4">
            <PreviewButtons phase={1} phased={false} onPreview={(phase, kind) => setPreview({ phase, kind })} />
            <PhaseMissions event={event} phase={phases[0]} visual={visual} missions={missions} students={students} {...actions} />
          </div>
        ) : (
          <>
            {/* ---- como funciona a liberação das fases ---- */}
            <p className="mt-4 rounded-xl border border-amber-300/40 bg-amber-400/10 p-3 text-xs text-amber-50/90">
              {status === "ativo" ? (
                <>
                  <span className="font-bold text-amber-200">Você libera e encerra cada fase quando quiser, em qualquer ordem</span> (a ideia é uma por semana). Os alunos fazem as fases
                  liberadas em ordem e veem a abertura de cada uma ao entrar no evento. Numa fase encerrada eles não jogam mais, mas o progresso fica guardado: reabrir devolve tudo como estava.
                </>
              ) : (
                <>
                  <span className="font-bold text-amber-200">As fases se liberam com o evento acontecendo:</span> Iniciar libera a Fase 1, e depois você libera e encerra cada fase quando quiser. Dá pra
                  assistir às cenas de cada fase antes, sem os alunos verem nada.
                </>
              )}
            </p>
            {status !== "ativo" && emptyPhases.length > 0 && eventList.length > 0 && (
              <p className="mt-3 text-xs text-amber-300">⚠ Sem missões ainda: {emptyPhases.map((p) => `Fase ${p.number}`).join(", ")}.</p>
            )}

            {/* ---- as fases ---- */}
            <div className="mt-4 flex flex-col gap-4">
              {phases.map((phase) => {
                const phaseStatus = statuses[phase.number - 1];
                const meta = PHASE_STATUS_META[phaseStatus];
                const date = phaseStatus === "liberada" ? phaseDate(phase.number, "released") : phaseStatus === "encerrada" ? phaseDate(phase.number, "closed") : null;
                const phaseDone = students.filter((s) => phaseProgress(s, event, phase.number).finishedAt).length;
                const action = phaseStatus === "liberada" ? "close" : "release";
                const key = `${action}-${phase.number}`;
                return (
                  <div
                    key={phase.number}
                    className={`rounded-2xl border p-4 ${phaseStatus === "liberada" ? "border-emerald-400/40 bg-black/40" : phaseStatus === "encerrada" ? "border-rose-400/30 bg-black/30" : "border-slate-700/70 bg-black/30"}`}
                  >
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className={`text-[11px] font-bold uppercase tracking-widest ${visual.accentClass}`}>Fase {phase.number} de {phases.length}</p>
                        <p className="text-lg font-black text-white">
                          {phase.icon} {phase.title}
                        </p>
                        <p className="mt-1 max-w-2xl text-xs text-slate-400">{phase.summary}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1.5 text-right">
                        <span className={`rounded-full border px-3 py-1 text-[11px] font-bold ${meta.className}`}>
                          {meta.label}
                          {date && ` em ${formatDate(date)}`}
                        </span>
                        <span className="text-[11px] text-slate-400">{phaseDone} concluíram a fase</span>
                        {status === "ativo" && (
                          <button
                            onClick={() => confirmThen(key, () => (action === "close" ? onClosePhase(event.id, phase.number) : onReleasePhase(event.id, phase.number)))}
                            onBlur={() => setConfirming(null)}
                            disabled={runBusy}
                            className={`mt-1 rounded-full px-4 py-1.5 text-xs font-black transition-transform hover:scale-[1.03] disabled:opacity-50 ${
                              confirming === key
                                ? "border border-amber-200 bg-amber-400/30 text-amber-50"
                                : action === "close"
                                  ? "border border-rose-400/60 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
                                  : visual.buttonClass
                            }`}
                          >
                            {confirming === key
                              ? `Confirmar: ${action === "close" ? "encerrar" : phaseStatus === "encerrada" ? "reabrir" : "liberar"} a Fase ${phase.number}?`
                              : action === "close"
                                ? `⏹ Encerrar a Fase ${phase.number}`
                                : phaseStatus === "encerrada"
                                  ? `🔓 Reabrir a Fase ${phase.number}`
                                  : `🔓 Liberar a Fase ${phase.number}`}
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="mb-3 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                      🎁 Recompensa da fase: {phase.reward.item.icon} <span className="font-semibold text-white">{phase.reward.item.name}</span> <RarityBadge rarity={phase.reward.item.rarity} /> • +{phase.reward.xp} XP • +
                      {phase.reward.coins} moedas
                    </p>
                    <PreviewButtons phase={phase.number} phased onPreview={(n, kind) => setPreview({ phase: n, kind })} />
                    <PhaseMissions event={event} phase={phase} visual={visual} missions={missions} students={students} {...actions} />
                  </div>
                );
              })}
            </div>
          </>
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
          {phased ? (
            <>
              Com o evento acontecendo, os alunos encontram ele em Eventos → Entrar e seguem a trilha: cada fase tem abertura, missões e final. Quem conclui todas as missões de uma fase ganha o botão
              &quot;Concluir a fase&quot;, assiste ao final dela e recebe o item lendário da fase; o final da Fase {phases.length} é o final do evento.
            </>
          ) : (
            <>
              Com o evento acontecendo, os alunos encontram ele em Eventos → Entrar. Quem conclui todas as missões ganha o botão &quot;Finalizar evento&quot;, assiste ao final da história e recebe{" "}
              {phases[0].reward.item.icon} {phases[0].reward.item.name}, +{phases[0].reward.xp} XP e {phases[0].reward.coins} moedas.
            </>
          )}
        </p>
      </div>

      {/* a cena que o professor está assistindo (não muda nada pros alunos) */}
      {preview && <EventScene event={event} phase={getPhase(event, preview.phase)} kind={preview.kind} student={PREVIEW_STUDENT} onClose={() => setPreview(null)} />}
    </div>
  );
}

export default function EventMissionsManager({
  runs,
  headerRight,
  ...panelProps
}: PanelActions & {
  /** Situação de cada evento pra turma desse professor (iniciado, encerrado, fases liberadas...). */
  runs: Partial<Record<EventId, EventRun>>;
  /** Todas as missões do professor (as normais aparecem na opção de atribuir). */
  missions: Mission[];
  students: Student[];
  /** Quem entra no ranking de cada evento (professor: a turma dele; ADM: a plataforma toda). */
  ranking: { students: Student[]; missions: Mission[] };
  onStart: RunAction;
  onEnd: RunAction;
  onReleasePhase: PhaseAction;
  onClosePhase: PhaseAction;
  /** Só o Painel ADM passa: a escolha do professor. */
  headerRight?: React.ReactNode;
}) {
  return (
    <div className="cg-card mb-6 p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-sm font-semibold text-slate-300">📅 Eventos da Academia</p>
          <p className="text-xs text-slate-500">
            Os alunos só veem um evento enquanto ele está acontecendo. Missões de evento aparecem só na tela do evento, com história animada e recompensa. O Natal e A Noite de Dracoding são trilhas em 3 fases:
            você libera e encerra cada fase quando quiser. Em todo evento dá pra assistir às cenas antes de iniciar.
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
