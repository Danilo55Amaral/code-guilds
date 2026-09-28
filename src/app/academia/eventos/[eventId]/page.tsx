"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStudents, useMissions, useMessages, useMissionAttempt, useEventRuns, useSubmissions, useGameActions } from "@/engine/store";
import { Mission, RewardItem, isTaskMission, requiredCorrect } from "@/engine/missions";
import { latestSubmissionIn } from "@/engine/submissions";
import TaskSubmissionModal from "@/components/TaskSubmissionModal";
import { PENDING_ITEM_NOTE, SYSTEM_SENDER_ID, eventPhaseRewardMessage, eventRewardMessage } from "@/engine/messages";
import {
  canFinishPhase,
  currentPhase,
  eventMissionsFor,
  eventPhases,
  getEvent,
  getPhase,
  phaseLock,
  phaseProgress,
} from "@/engine/specialEvents";
import { EVENT_VISUALS, progressNounFor } from "@/components/events/registry";
import PhaseTrail from "@/components/events/PhaseTrail";
import EventScene from "@/components/EventScene";
import QuizModal from "@/components/QuizModal";
import LevelUpScreen from "@/components/LevelUpScreen";
import ItemDetailsModal from "@/components/ItemDetailsModal";
import EventRanking from "@/components/EventRanking";
import HousemateSheet from "@/components/HousemateSheet";
import { CoinIcon, DifficultyBadge, RarityBadge } from "@/components/GameUI";

// ============================================================================
// TELA DO EVENTO — a história em resumo, o progresso (no Halloween, uma
// Lanterna Sagrada por missão), as missões exclusivas do evento (do professor
// do aluno) e, quando todas forem concluídas, o botão "Finalizar evento", que
// abre a cena final e entrega a recompensa. Quem chega pelo link sem ter visto
// a abertura vê a cena de abertura primeiro.
// Evento em fases (Natal): a trilha das fases no topo; cada fase tem a própria
// abertura, missões e final ("Concluir a fase"), e só abre depois que o
// professor libera e o aluno conclui a fase anterior.
// ============================================================================

export default function EventoPage() {
  const params = useParams<{ eventId: string }>();
  const event = getEvent(params.eventId);
  const { activeStudent, students } = useStudents();
  const game = useGameActions();
  const { missions: allMissions, ready } = useMissions();
  const { send } = useMessages(activeStudent?.id ?? null);
  const attemptMission = useMissionAttempt();
  const { statusOf, releasedOf, ready: runsReady } = useEventRuns();
  const [scene, setScene] = useState<{ kind: "intro" | "outro"; phase: number } | null>(null);
  // Fase escolhida na trilha (null = a fase em que o aluno está).
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  // Missão de entrega aberta (resposta aberta/arquivos, corrigida pelo professor).
  const [taskMission, setTaskMission] = useState<Mission | null>(null);
  const { submissions } = useSubmissions();
  const [levelUp, setLevelUp] = useState<{ from: number; to: number } | null>(null);
  // Erro da API ao registrar a tentativa: a recompensa não foi dada
  const [attemptError, setAttemptError] = useState<string | null>(null);
  const [viewingReward, setViewingReward] = useState<RewardItem | null>(null);
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);

  // O evento só existe pro aluno enquanto o professor dele deixar ele acontecendo.
  const live = !!event && !!activeStudent && runsReady && statusOf(activeStudent.teacherId, event.id) === "ativo";
  const released = event && activeStudent ? releasedOf(activeStudent.teacherId, event.id) : 0;
  const current = event && activeStudent ? currentPhase(activeStudent, event, released) : 1;
  const needsIntro =
    live && !!event && !!activeStudent && !phaseLock(activeStudent, event, current, released) && !phaseProgress(activeStudent, event, current).introSeenAt;

  // Chegou pelo link sem ter visto a abertura da fase atual: ela toca uma vez, ao abrir a tela.
  const autoChecked = useRef(false);
  useEffect(() => {
    if (!live || autoChecked.current) return;
    autoChecked.current = true;
    if (needsIntro) setScene({ kind: "intro", phase: current });
  }, [live, needsIntro, current]);

  if (!event || (activeStudent && runsReady && !live)) {
    return (
      <div className="cg-card flex flex-col items-center gap-3 px-6 py-12 text-center">
        <p className="text-4xl">{event ? "🌙" : "🔍"}</p>
        <p className="text-lg font-semibold text-white">{event ? "Este evento não está acontecendo agora" : "Evento não encontrado"}</p>
        {event && <p className="max-w-md text-sm text-slate-400">Seu professor ainda não iniciou este evento ou já encerrou. O seu progresso fica guardado pra quando ele voltar.</p>}
        <Link href="/academia/eventos" className="cg-btn-secondary !px-4 !py-2 text-xs">
          ← Voltar ao Salão dos Eventos
        </Link>
      </div>
    );
  }
  if (!activeStudent || !ready) return null;

  const me = activeStudent;
  const ev = event;
  const visual = EVENT_VISUALS[ev.id];
  const { Art, ProgressIcon } = visual;
  const phases = eventPhases(ev);
  const phased = phases.length > 1;
  const phaseNum = selectedPhase ?? current;
  const phase = getPhase(ev, phaseNum);
  const isLastPhase = phaseNum === phases.length;
  const lock = phaseLock(me, ev, phaseNum, released);
  const missions = eventMissionsFor(allMissions, ev.id, me.teacherId, phaseNum);
  const completedIds = me.completedMissionIds;
  const done = missions.filter((m) => completedIds.includes(m.id)).length;
  const progress = phaseProgress(me, ev, phaseNum);
  const started = !!progress.introSeenAt;
  const canFinish = !lock && canFinishPhase(me, missions, ev, phaseNum);
  const percent = missions.length ? Math.round((done / missions.length) * 100) : 0;
  const viewingProfile = students.find((s) => s.id === viewingProfileId) ?? null;
  const noun = progressNounFor(visual, phaseNum);
  const nextPhase = phased && !isLastPhase ? getPhase(ev, phaseNum + 1) : null;

  // As respostas vão pra API, que corrige e dá a recompensa (igual à tela de Missões)
  async function handleComplete(_correctCount: number, answers: Record<string, string>) {
    if (!activeMission) return;
    const mission = activeMission;
    setActiveMission(null);
    const result = await attemptMission(mission, answers);
    if (result && "error" in result) {
      setAttemptError(`Não deu pra registrar "${mission.title}": ${result.error}`);
      return;
    }
    if (result) setLevelUp(result);
  }

  // Fechar a abertura marca como vista; fechar o final (vendo até o fim ou
  // pulando) pede a recompensa da fase à API, que confere as missões e entrega
  // XP, moedas e o item (com as alterações que o ADM fez na Loja).
  async function closeScene() {
    if (!scene) return;
    const closed = scene;
    setScene(null);
    if (closed.kind === "intro") {
      if (!phaseProgress(me, ev, closed.phase).introSeenAt) {
        const seen = await game.markEventIntroSeen(ev.id, closed.phase);
        if (!seen.ok) setAttemptError(seen.error);
      }
      return;
    }
    const sceneMissions = eventMissionsFor(allMissions, ev.id, me.teacherId, closed.phase);
    if (!canFinishPhase(me, sceneMissions, ev, closed.phase)) return;
    const result = await game.finishEventPhase(ev.id, closed.phase);
    if (!result.ok) {
      setAttemptError(`Não deu pra concluir a fase: ${result.error}`);
      return;
    }
    const finished = getPhase(ev, closed.phase);
    send({
      studentId: me.id,
      senderId: SYSTEM_SENDER_ID,
      kind: "missao",
      body:
        (closed.phase === phases.length
          ? eventRewardMessage({ event: ev, item: result.item, xp: result.xp, coins: result.coins })
          : eventPhaseRewardMessage({ event: ev, phase: finished, totalPhases: phases.length, item: result.item, xp: result.xp, coins: result.coins })) +
        (result.itemWaiting ? PENDING_ITEM_NOTE : ""),
    });
    if (result.leveledUp) setLevelUp({ from: result.fromLevel, to: result.newLevel });
    setSelectedPhase(null);
  }

  return (
    <div>
      {attemptError && (
        <p className="mb-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
          {attemptError}{" "}
          <button onClick={() => setAttemptError(null)} className="font-semibold underline">
            Fechar
          </button>
        </p>
      )}
      <Link href="/academia/eventos" className="mb-3 inline-block text-xs font-medium text-slate-400 hover:text-white">
        ← Salão dos Eventos
      </Link>

      {/* ===== PÔSTER DO EVENTO (ou da fase) ===== */}
      <div className={`cg-dark-scope relative mb-6 overflow-hidden rounded-3xl border ${visual.borderClass}`} style={{ boxShadow: `0 24px 70px -30px ${visual.glow}` }}>
        <div className="relative h-72 sm:h-96">
          <Art key={phased ? phaseNum : 0} art={phased ? `poster-${phaseNum}` : "poster"} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
            <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${visual.accentClass}`}>
              {ev.tagline}
              {phased && ` • Fase ${phaseNum}: ${phase.icon} ${phase.title}`}
            </p>
            <h1 className={`mt-1 text-3xl font-black uppercase leading-tight sm:text-5xl ${visual.titleClass}`} style={{ textShadow: visual.titleGlow }}>
              {ev.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-200">{phased ? phase.summary : ev.summary}</p>
            {!lock && (
              <div className="mt-4 flex flex-wrap gap-2">
                {started && (
                  <button onClick={() => setScene({ kind: "intro", phase: phaseNum })} className={`rounded-full border bg-black/50 px-4 py-2 text-xs font-semibold backdrop-blur transition-colors ${visual.chipClass}`}>
                    📜 Rever a abertura{phased && ` da Fase ${phaseNum}`}
                  </button>
                )}
                {progress.finishedAt && (
                  <button onClick={() => setScene({ kind: "outro", phase: phaseNum })} className="rounded-full border border-amber-300/60 bg-black/50 px-4 py-2 text-xs font-semibold text-amber-100 backdrop-blur transition-colors hover:border-amber-200">
                    🎬 Rever o final{phased && ` da Fase ${phaseNum}`}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ---- trilha das fases ---- */}
        {phased && (
          <div className="relative border-t border-slate-800 p-4 sm:p-5" style={{ background: visual.panelBackground }}>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-300">🗺️ A trilha do evento: {ev.goal}</p>
            <PhaseTrail event={ev} student={me} missions={allMissions} released={released} selected={phaseNum} onSelect={setSelectedPhase} />
          </div>
        )}

        {/* ---- progresso da fase ---- */}
        {!lock && started && (
          <div className="relative p-5 sm:p-7" style={{ background: visual.panelBackground }}>
            <p className={`text-sm font-semibold ${visual.accentClass}`}>🎯 {phase.goal}</p>
            {missions.length > 0 && (
              <>
                <div className="mt-4 flex flex-wrap items-end justify-center gap-3 sm:justify-start">
                  {missions.map((m, i) => (
                    <div key={m.id} className="flex flex-col items-center gap-1">
                      <ProgressIcon lit={completedIds.includes(m.id)} phase={phaseNum} delay={i * 0.2} className="h-16 w-auto sm:h-20" />
                      <span className="text-lg">{m.icon}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-black/50">
                  <div className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${visual.progressBar}`} style={{ width: `${percent}%` }} />
                </div>
                <p className="mt-2 text-sm text-slate-300">
                  <span className={`font-bold ${visual.accentClass}`}>
                    {done} de {missions.length}
                  </span>{" "}
                  {missions.length === 1 ? noun.one : noun.many} {missions.length === 1 ? noun.doneOne : noun.doneMany}
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* ===== FASE TRANCADA ===== */}
      {lock && (
        <div className={`cg-dark-scope mb-6 flex flex-col items-center gap-3 rounded-3xl border px-6 py-10 text-center ${visual.borderClass}`} style={{ background: visual.panelBackground }}>
          <p className="text-5xl">🔒</p>
          <p className="text-xl font-black uppercase tracking-wide text-white">
            Fase {phaseNum}: {phase.title}
          </p>
          <p className="max-w-lg text-sm text-slate-300">
            {lock === "professor"
              ? "Esta fase ainda não foi liberada. O seu professor libera uma fase nova por semana: fique de olho no Salão dos Eventos!"
              : `Conclua a Fase ${phaseNum - 1} primeiro pra continuar a trilha até aqui.`}
          </p>
          <p className="flex flex-wrap items-center justify-center gap-2 text-sm text-amber-100">
            🎁 Nesta fase você pode ganhar: {phase.reward.item.icon} <span className="font-bold">{phase.reward.item.name}</span> <RarityBadge rarity={phase.reward.item.rarity} />
          </p>
          {lock === "anterior" && (
            <button onClick={() => setSelectedPhase(phaseNum - 1)} className={`mt-2 rounded-full px-6 py-2.5 text-sm font-black transition-transform hover:scale-[1.04] ${visual.buttonClass}`}>
              Ir pra Fase {phaseNum - 1} →
            </button>
          )}
        </div>
      )}

      {/* ===== COMEÇAR A FASE (abertura ainda não vista) ===== */}
      {!lock && !started && (
        <div className={`cg-dark-scope mb-6 flex flex-col items-center gap-3 rounded-3xl border-2 border-amber-300/60 px-6 py-10 text-center`} style={{ background: visual.panelBackground, boxShadow: `0 0 60px -14px ${visual.glow}` }}>
          <p className="cg-anim-float text-5xl">{phase.icon}</p>
          <p className="text-xl font-black uppercase tracking-wide text-amber-100 sm:text-2xl">{phased ? `A Fase ${phaseNum} começou!` : "Um novo evento começou!"}</p>
          <p className="max-w-lg text-sm text-slate-300">{phase.summary}</p>
          <button onClick={() => setScene({ kind: "intro", phase: phaseNum })} className={`mt-2 rounded-full px-8 py-3.5 text-base font-black uppercase tracking-wider transition-transform hover:scale-[1.04] ${visual.buttonClass}`}>
            🎬 {phased ? `Começar a Fase ${phaseNum}` : "Ver a abertura"}
          </button>
        </div>
      )}

      {/* ===== FINALIZAR / CONCLUÍDO ===== */}
      {canFinish && (
        <div
          className="cg-dark-scope relative mb-6 overflow-hidden rounded-3xl border-2 border-amber-300/70 p-6 text-center"
          style={{ background: "radial-gradient(60% 80% at 50% 0%, rgba(251,191,36,0.4), transparent 70%), linear-gradient(160deg, #1c0a02 0%, #431407 60%, #2e1065 100%)", boxShadow: "0 0 60px -10px rgba(251,191,36,0.6)" }}
        >
          <p className="cg-anim-float text-4xl">{phased && !isLastPhase ? "🎁" : "🏆"}</p>
          <p className="mt-2 text-xl font-black uppercase tracking-wide text-amber-200 sm:text-2xl">{phase.finishCall.title}</p>
          <p className="mx-auto mt-1 max-w-lg text-sm text-amber-50/80">{phase.finishCall.text}</p>
          <button onClick={() => setScene({ kind: "outro", phase: phaseNum })} className={`mt-5 rounded-full px-8 py-3.5 text-base font-black uppercase tracking-wider transition-transform hover:scale-[1.04] ${visual.buttonClass}`}>
            {phased && !isLastPhase ? `Concluir a Fase ${phaseNum} 🎁` : "Finalizar evento 🏆"}
          </button>
        </div>
      )}

      {progress.finishedAt && (
        <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4">
          <span className="text-3xl">{phased && !isLastPhase ? "🎁" : "🏆"}</span>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-emerald-300">
              {phased && !isLastPhase
                ? `Fase ${phaseNum} concluída em ${new Date(progress.finishedAt).toLocaleDateString("pt-BR")}!`
                : `Evento concluído em ${new Date(progress.finishedAt).toLocaleDateString("pt-BR")}. ${phased ? "Você completou a trilha inteira!" : "Você salvou a CodeGuilds!"}`}
            </p>
            <p className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-slate-400">
              Recompensa recebida: {phase.reward.item.icon} {phase.reward.item.name} <RarityBadge rarity={phase.reward.item.rarity} /> • +{phase.reward.xp} XP • +{phase.reward.coins} moedas
            </p>
            {nextPhase && (
              <p className="mt-1 text-sm text-slate-300">
                {nextPhase.number <= released
                  ? `A Fase ${nextPhase.number} já está liberada: ${nextPhase.icon} ${nextPhase.title}!`
                  : `A Fase ${nextPhase.number} (${nextPhase.icon} ${nextPhase.title}) chega quando o seu professor liberar. Uma por semana!`}
              </p>
            )}
          </div>
          {nextPhase && nextPhase.number <= released && (
            <button onClick={() => setSelectedPhase(nextPhase.number)} className={`shrink-0 rounded-full px-5 py-2 text-sm font-black transition-transform hover:scale-[1.04] ${visual.buttonClass}`}>
              Ir pra Fase {nextPhase.number} →
            </button>
          )}
        </div>
      )}

      {/* ===== MISSÕES DA FASE / DO EVENTO ===== */}
      {!lock && started && (
        <div className={`cg-dark-scope relative overflow-hidden rounded-3xl border p-5 sm:p-6 ${visual.borderClass}`} style={{ background: visual.panelBackground }}>
          <h2 className={`text-xl font-black uppercase tracking-wide ${visual.titleClass}`} style={{ textShadow: visual.titleGlow }}>
            {visual.missionsTitle}
            {phased && ` ${phaseNum}`}
          </h2>
          <p className="mt-1 text-sm text-slate-300">{phase.missionHint}</p>

          {missions.length === 0 ? (
            <div className="mt-5 flex flex-col items-center gap-2 rounded-2xl border border-slate-700/60 bg-black/30 px-6 py-10 text-center">
              <p className="text-4xl">{phased ? "❄️" : "🕸️"}</p>
              <p className="text-sm text-slate-300">
                {phased ? "Seu professor ainda não colocou missões nesta fase. Volte mais tarde!" : "Seu professor ainda não colocou missões neste evento. Volte mais tarde, se tiver coragem!"}
              </p>
            </div>
          ) : (
            <div className="mt-5 flex flex-col gap-3">
              {missions.map((m) => {
                const unlocked = me.level >= m.minLevel;
                const completed = completedIds.includes(m.id);
                const isTask = isTaskMission(m);
                const delivery = isTask && !completed ? latestSubmissionIn(submissions, me.id, m.id) : undefined;
                return (
                  <div
                    key={m.id}
                    className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-black/40 p-4 sm:p-5 ${completed ? "border-amber-400/50" : "border-slate-700/70"}`}
                  >
                    <div className="flex items-start gap-4">
                      <ProgressIcon lit={completed} phase={phaseNum} className="h-14 w-auto shrink-0" />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-lg">{m.icon}</span>
                          <p className="font-semibold text-white">{m.title}</p>
                          <DifficultyBadge difficulty={m.difficulty} />
                          <span className="text-xs text-slate-500">Nv {m.minLevel}+</span>
                          {completed && (
                            <span className="text-xs font-semibold text-amber-300">
                              ✓ {noun.one} {noun.doneOne}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-slate-400">{m.description}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="text-violet-300">✦ {m.rewardXp} XP</span>
                          <span className="flex items-center gap-1 text-amber-300">
                            <CoinIcon size={14} /> {m.rewardCoins}
                          </span>
                          <button type="button" onClick={() => setViewingReward(m.rewardItem)} title="Ver detalhes do item de recompensa" className="flex items-center gap-1 hover:text-slate-300 hover:underline">
                            {m.rewardItem.icon} {m.rewardItem.name} <RarityBadge rarity={m.rewardItem.rarity} />
                          </button>
                          {!completed &&
                            (isTask ? (
                              <span className="text-indigo-300">
                                📝 Entrega corrigida pelo professor
                                {delivery?.status === "pendente" && " • ⏳ aguardando correção"}
                                {delivery?.status === "refazer" && " • ↩ refazer"}
                              </span>
                            ) : (
                              <span>
                                🎯 Mín. {requiredCorrect(m.questions.length)}/{m.questions.length} acertos
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>

                    {unlocked ? (
                      <button
                        onClick={() => (isTask ? setTaskMission(m) : setActiveMission(m))}
                        className={
                          completed
                            ? "shrink-0 rounded-full border border-slate-600 bg-black/40 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-400"
                            : `shrink-0 rounded-full px-5 py-2 text-sm font-black transition-transform hover:scale-[1.04] ${visual.buttonClass}`
                        }
                      >
                        {completed
                          ? "👁 Visualizar"
                          : delivery?.status === "pendente"
                            ? "👁 Ver entrega"
                            : delivery?.status === "refazer"
                              ? "↩ Refazer entrega →"
                              : isTask
                                ? "📝 Fazer entrega →"
                                : "Enfrentar →"}
                      </button>
                    ) : (
                      <span className="shrink-0 rounded-full border border-slate-700 bg-black/40 px-4 py-2 text-xs font-medium text-slate-500">🔒 Bloqueada: Nv {m.minLevel}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===== RANKING DO EVENTO ===== */}
      <div className="mt-6">
        <EventRanking event={ev} students={students} missions={allMissions} status="ativo" meId={me.id} onSelect={setViewingProfileId} />
      </div>

      {viewingProfile && (
        <HousemateSheet student={viewingProfile} isYou={viewingProfile.id === me.id} sameHouse={viewingProfile.houseId === me.houseId} onClose={() => setViewingProfileId(null)} />
      )}

      {viewingReward && <ItemDetailsModal item={viewingReward} onClose={() => setViewingReward(null)} />}

      {levelUp && (
        <LevelUpScreen
          fromLevel={levelUp.from}
          toLevel={levelUp.to}
          unlockedMissions={allMissions.filter((m) => m.teacherId === me.teacherId && !m.eventId && m.minLevel > levelUp.from && m.minLevel <= levelUp.to)}
          onClose={() => setLevelUp(null)}
        />
      )}

      {taskMission && <TaskSubmissionModal mission={taskMission} student={me} onClose={() => setTaskMission(null)} />}

      {activeMission && (
        <QuizModal mission={activeMission} onClose={() => setActiveMission(null)} onComplete={handleComplete} viewOnly={completedIds.includes(activeMission.id)} />
      )}

      {scene && <EventScene event={ev} phase={getPhase(ev, scene.phase)} kind={scene.kind} student={me} onClose={closeScene} />}
    </div>
  );
}
