"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStudents, useMissions, useMessages, useMissionAttempt, useEventRuns } from "@/engine/store";
import { Mission, RewardItem, requiredCorrect } from "@/engine/missions";
import { SYSTEM_SENDER_ID, eventRewardMessage } from "@/engine/messages";
import { canFinishEvent, eventMissionsFor, eventProgress, finishEvent, getEvent, introSeenPatch } from "@/engine/specialEvents";
import { EVENT_VISUALS } from "@/components/events/registry";
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
// ============================================================================

export default function EventoPage() {
  const params = useParams<{ eventId: string }>();
  const event = getEvent(params.eventId);
  const { activeStudent, students, patchActive } = useStudents();
  const { missions: allMissions, ready } = useMissions();
  const { send } = useMessages(activeStudent?.id ?? null);
  const attemptMission = useMissionAttempt();
  const { statusOf, ready: runsReady } = useEventRuns();
  const [scene, setScene] = useState<"intro" | "outro" | null>(null);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [levelUp, setLevelUp] = useState<{ from: number; to: number } | null>(null);
  const [viewingReward, setViewingReward] = useState<RewardItem | null>(null);
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);

  // O evento só existe pro aluno enquanto o professor dele deixar ele acontecendo.
  const live = !!event && !!activeStudent && runsReady && statusOf(activeStudent.teacherId, event.id) === "ativo";
  const needsIntro = live && !!event && !!activeStudent && !eventProgress(activeStudent, event.id).introSeenAt;
  useEffect(() => {
    if (needsIntro) setScene("intro");
  }, [needsIntro]);

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
  const missions = eventMissionsFor(allMissions, ev.id, me.teacherId);
  const completedIds = me.completedMissionIds;
  const done = missions.filter((m) => completedIds.includes(m.id)).length;
  const progress = eventProgress(me, ev.id);
  const canFinish = canFinishEvent(me, missions, ev.id);
  const percent = missions.length ? Math.round((done / missions.length) * 100) : 0;
  const viewingProfile = students.find((s) => s.id === viewingProfileId) ?? null;

  function handleComplete(correctCount: number) {
    if (!activeMission) return;
    const levelUpResult = attemptMission(activeMission, correctCount);
    if (levelUpResult) setLevelUp(levelUpResult);
    setActiveMission(null);
  }

  // Fechar a abertura marca como vista; fechar o final (vendo até o fim ou pulando) entrega a recompensa.
  function closeScene() {
    if (scene === "intro") patchActive(introSeenPatch(me, ev.id));
    if (scene === "outro" && canFinish) {
      const result = finishEvent(me, ev);
      patchActive(result.student);
      send({
        studentId: me.id,
        senderId: SYSTEM_SENDER_ID,
        kind: "missao",
        body: eventRewardMessage({ event: ev, item: ev.reward.item, xp: ev.reward.xp, coins: ev.reward.coins }),
      });
      if (result.leveledUp) setLevelUp({ from: me.level, to: result.newLevel });
    }
    setScene(null);
  }

  const noun = missions.length === 1 ? visual.progressNoun.one : visual.progressNoun.many;

  return (
    <div>
      <Link href="/academia/eventos" className="mb-3 inline-block text-xs font-medium text-slate-400 hover:text-white">
        ← Salão dos Eventos
      </Link>

      {/* ===== PÔSTER DO EVENTO ===== */}
      <div className={`cg-dark-scope relative mb-6 overflow-hidden rounded-3xl border ${visual.borderClass}`} style={{ boxShadow: `0 24px 70px -30px ${visual.glow}` }}>
        <div className="relative h-72 sm:h-96">
          <Art art="poster" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
            <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${visual.accentClass}`}>{ev.tagline}</p>
            <h1 className={`mt-1 text-3xl font-black uppercase leading-tight sm:text-5xl ${visual.titleClass}`} style={{ textShadow: visual.titleGlow }}>
              {ev.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-200">{ev.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => setScene("intro")} className={`rounded-full border bg-black/50 px-4 py-2 text-xs font-semibold backdrop-blur transition-colors ${visual.chipClass}`}>
                📜 Rever a abertura
              </button>
              {progress.finishedAt && (
                <button onClick={() => setScene("outro")} className="rounded-full border border-amber-300/60 bg-black/50 px-4 py-2 text-xs font-semibold text-amber-100 backdrop-blur transition-colors hover:border-amber-200">
                  🎬 Rever o final
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ---- progresso ---- */}
        <div className="relative p-5 sm:p-7" style={{ background: visual.panelBackground }}>
          <p className={`text-sm font-semibold ${visual.accentClass}`}>🎯 {ev.goal}</p>
          {missions.length > 0 && (
            <>
              <div className="mt-4 flex flex-wrap items-end justify-center gap-3 sm:justify-start">
                {missions.map((m, i) => (
                  <div key={m.id} className="flex flex-col items-center gap-1">
                    <ProgressIcon lit={completedIds.includes(m.id)} delay={i * 0.2} className="h-16 w-auto sm:h-20" />
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
                {noun} {visual.progressNoun.doneMany}
              </p>
            </>
          )}
        </div>
      </div>

      {/* ===== FINALIZAR / CONCLUÍDO ===== */}
      {canFinish && (
        <div className="cg-dark-scope relative mb-6 overflow-hidden rounded-3xl border-2 border-amber-300/70 p-6 text-center" style={{ background: "radial-gradient(60% 80% at 50% 0%, rgba(251,191,36,0.4), transparent 70%), linear-gradient(160deg, #1c0a02 0%, #431407 60%, #2e1065 100%)", boxShadow: "0 0 60px -10px rgba(251,191,36,0.6)" }}>
          <p className="cg-anim-float text-4xl">🏆</p>
          <p className="mt-2 text-xl font-black uppercase tracking-wide text-amber-200 sm:text-2xl">{ev.finishCall.title}</p>
          <p className="mx-auto mt-1 max-w-lg text-sm text-amber-50/80">{ev.finishCall.text}</p>
          <button onClick={() => setScene("outro")} className={`mt-5 rounded-full px-8 py-3.5 text-base font-black uppercase tracking-wider transition-transform hover:scale-[1.04] ${visual.buttonClass}`}>
            Finalizar evento 🏆
          </button>
        </div>
      )}

      {progress.finishedAt && (
        <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4">
          <span className="text-3xl">🏆</span>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-emerald-300">Evento concluído em {new Date(progress.finishedAt).toLocaleDateString("pt-BR")}. Você salvou a CodeGuilds!</p>
            <p className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-slate-400">
              Recompensa recebida: {ev.reward.item.icon} {ev.reward.item.name} <RarityBadge rarity={ev.reward.item.rarity} /> • +{ev.reward.xp} XP • +{ev.reward.coins} moedas
            </p>
          </div>
        </div>
      )}

      {/* ===== MISSÕES DO EVENTO ===== */}
      <div className={`cg-dark-scope relative overflow-hidden rounded-3xl border p-5 sm:p-6 ${visual.borderClass}`} style={{ background: visual.panelBackground }}>
        <h2 className={`text-xl font-black uppercase tracking-wide ${visual.titleClass}`} style={{ textShadow: visual.titleGlow }}>
          {visual.missionsTitle}
        </h2>
        <p className="mt-1 text-sm text-slate-300">{ev.missionHint}</p>

        {missions.length === 0 ? (
          <div className="mt-5 flex flex-col items-center gap-2 rounded-2xl border border-slate-700/60 bg-black/30 px-6 py-10 text-center">
            <p className="text-4xl">🕸️</p>
            <p className="text-sm text-slate-300">Seu professor ainda não colocou missões neste evento. Volte mais tarde, se tiver coragem!</p>
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-3">
            {missions.map((m) => {
              const unlocked = me.level >= m.minLevel;
              const completed = completedIds.includes(m.id);
              return (
                <div
                  key={m.id}
                  className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-black/40 p-4 sm:p-5 ${completed ? "border-amber-400/50" : "border-slate-700/70"}`}
                >
                  <div className="flex items-start gap-4">
                    <ProgressIcon lit={completed} className="h-14 w-auto shrink-0" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-lg">{m.icon}</span>
                        <p className="font-semibold text-white">{m.title}</p>
                        <DifficultyBadge difficulty={m.difficulty} />
                        <span className="text-xs text-slate-500">Nv {m.minLevel}+</span>
                        {completed && (
                          <span className="text-xs font-semibold text-amber-300">
                            ✓ {visual.progressNoun.one} {visual.progressNoun.doneOne}
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
                        {!completed && (
                          <span>
                            🎯 Mín. {requiredCorrect(m.questions.length)}/{m.questions.length} acertos
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {unlocked ? (
                    <button
                      onClick={() => setActiveMission(m)}
                      className={
                        completed
                          ? "shrink-0 rounded-full border border-slate-600 bg-black/40 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-400"
                          : `shrink-0 rounded-full px-5 py-2 text-sm font-black transition-transform hover:scale-[1.04] ${visual.buttonClass}`
                      }
                    >
                      {completed ? "👁 Visualizar" : "Enfrentar →"}
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

      {activeMission && (
        <QuizModal mission={activeMission} onClose={() => setActiveMission(null)} onComplete={handleComplete} viewOnly={completedIds.includes(activeMission.id)} />
      )}

      {scene && <EventScene event={ev} kind={scene} student={me} onClose={closeScene} />}
    </div>
  );
}
