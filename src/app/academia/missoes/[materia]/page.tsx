"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useStudents, useMissions, useMissionAttempt, useSubmissions } from "@/engine/store";
import { latestSubmissionIn } from "@/engine/submissions";
import TaskSubmissionModal from "@/components/TaskSubmissionModal";
import { Mission, RewardItem, isTaskMission, matchesSearch, requiredCorrect } from "@/engine/missions";
import { CoinIcon, DifficultyBadge, RarityBadge } from "@/components/GameUI";
import QuizModal from "@/components/QuizModal";
import Pagination from "@/components/Pagination";
import LevelUpScreen from "@/components/LevelUpScreen";
import ItemDetailsModal from "@/components/ItemDetailsModal";
import SubjectTome, { TOME_STYLE } from "@/components/library/SubjectTome";
import { OTHER_SUBJECTS, getSubject, missionSubject } from "@/engine/subjects";

// ============================================================================
// O TOMO DE UMA MATÉRIA — as missões de uma matéria só (aberta pela Biblioteca
// de Missões, /academia/missoes): o cabeçalho com o tomo e o progresso, a
// busca, os filtros (todas, ativas, concluídas) e a lista paginada.
// /academia/missoes/outras = as missões que não são de nenhuma matéria.
// ============================================================================

const MISSIONS_PER_PAGE = 10;

type StatusFilter = "ativas" | "concluidas" | "todas";

const FILTER_LABELS: Record<StatusFilter, string> = { todas: "Todas", ativas: "Ativas", concluidas: "Concluídas" };

const EMPTY_MESSAGES: Record<StatusFilter, string> = {
  todas: "Seu professor ainda não criou nenhuma missão desta matéria. Volte em breve!",
  ativas: "Nenhuma missão ativa no momento — você concluiu todas. Bom trabalho!",
  concluidas: "Você ainda não concluiu nenhuma missão.",
};

export default function MateriaPage() {
  const { materia } = useParams<{ materia: string }>();
  const router = useRouter();
  const subject = getSubject(materia);
  const isOther = materia === OTHER_SUBJECTS;
  const { activeStudent } = useStudents();
  const { missions: allMissions, ready: missionsReady } = useMissions();
  const attemptMission = useMissionAttempt();
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  // Missão de entrega aberta (resposta aberta/arquivos, corrigida pelo professor).
  const [taskMission, setTaskMission] = useState<Mission | null>(null);
  const { submissions } = useSubmissions();
  const [levelUp, setLevelUp] = useState<{ from: number; to: number } | null>(null);
  // Erro da API ao registrar a tentativa (ex.: sem internet): a recompensa não foi dada
  const [attemptError, setAttemptError] = useState<string | null>(null);
  const [viewingReward, setViewingReward] = useState<RewardItem | null>(null);
  const [filter, setFilter] = useState<StatusFilter>("todas");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Endereço de matéria que não existe: volta pra Biblioteca.
  useEffect(() => {
    if (!subject && !isOther) router.replace("/academia/missoes");
  }, [subject, isOther, router]);

  if (!activeStudent || !missionsReady || (!subject && !isOther)) return null;

  // O aluno só vê as missões do professor que escolheu no cadastro; as de evento ficam na tela do evento.
  const studentMissions = allMissions.filter((m) => m.teacherId === activeStudent.teacherId && !m.eventId);
  // ...e aqui, só as da matéria deste tomo.
  const missions = studentMissions.filter((m) => missionSubject(m) === (subject?.id ?? null));
  const tome = TOME_STYLE[subject?.id ?? "outras"];
  const title = subject?.name ?? "Outras missões";
  const doneHere = missions.filter((m) => activeStudent.completedMissionIds.includes(m.id)).length;
  const completedIds = activeStudent.completedMissionIds;
  // A busca vem antes do filtro de status, então os contadores das abas já refletem o que foi digitado.
  const searchedMissions = missions.filter((m) => matchesSearch(m, search));
  const counts: Record<StatusFilter, number> = {
    todas: searchedMissions.length,
    ativas: searchedMissions.filter((m) => !completedIds.includes(m.id)).length,
    concluidas: searchedMissions.filter((m) => completedIds.includes(m.id)).length,
  };

  const filteredMissions = searchedMissions.filter((m) => {
    const completed = completedIds.includes(m.id);
    if (filter === "ativas") return !completed;
    if (filter === "concluidas") return completed;
    return true;
  });

  // A paginação só fatia o resultado final (busca + filtro), então a busca sempre
  // percorre todas as missões, não só as da página atual. Se a lista encolher
  // (ex.: missão concluída saiu das "Ativas"), a página é limitada à última que existe.
  const totalPages = Math.max(1, Math.ceil(filteredMissions.length / MISSIONS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * MISSIONS_PER_PAGE;
  const pagedMissions = filteredMissions.slice(pageStart, pageStart + MISSIONS_PER_PAGE);

  function changePage(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const alreadyCompleted = activeMission ? completedIds.includes(activeMission.id) : false;

  // As respostas vão pra API, que corrige e dá a recompensa. Revisão ou nota
  // abaixo de 60% não dão nada (a missão continua ativa pra tentar de novo).
  // A cena de nível abre logo depois que a tela de recompensas fecha.
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

  return (
    <div>
      {attemptError && (
        <p className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
          {attemptError}{" "}
          <button onClick={() => setAttemptError(null)} className="font-semibold underline">
            Fechar
          </button>
        </p>
      )}
      {/* ===== o tomo da matéria ===== sempre escuro, nos dois temas */}
      <div
        className="cg-dark-scope relative mb-5 overflow-hidden rounded-3xl border p-5 sm:p-6"
        style={{
          borderColor: `${tome.glow}55`,
          background: `radial-gradient(60% 90% at 88% 40%, ${tome.glow}33, transparent 70%), linear-gradient(135deg, #120a05 0%, #2a1609 60%, ${tome.dark} 140%)`,
          boxShadow: `0 20px 60px -32px ${tome.glow}`,
        }}
      >
        <Link href="/academia/missoes" className="inline-flex items-center gap-1 rounded-full border border-amber-300/40 bg-black/30 px-3 py-1 text-xs font-semibold text-amber-100 hover:bg-amber-400/20">
          ← Biblioteca de Missões
        </Link>
        <div className="mt-3 flex items-center gap-4 sm:gap-6">
          <div className="cg-anim-float relative h-32 w-[102px] shrink-0 sm:h-40 sm:w-[128px]">
            <div className="absolute inset-[15%] rounded-full blur-2xl" style={{ background: tome.glow, opacity: 0.4 }} />
            <SubjectTome id={subject?.id ?? "outras"} className="relative h-full w-full" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200">📖 Tomo da matéria</p>
            <h1
              className="mt-1 font-serif font-black uppercase leading-tight tracking-wide"
              style={{ color: "#fde68a", textShadow: `0 0 18px ${tome.glow}`, fontSize: "clamp(1.05rem, 5.2vw, 2.25rem)", overflowWrap: "break-word" }}
            >
              {subject?.icon ?? "📜"} {title}
            </h1>
            <p className="mt-1 text-sm text-amber-50/80">{subject?.tagline ?? "Missões que ainda não estão em nenhuma matéria"}</p>
            <div className="mt-3 max-w-md">
              <div className="h-2 overflow-hidden rounded-full bg-black/50">
                <div className="h-full rounded-full" style={{ width: `${missions.length ? (doneHere / missions.length) * 100 : 0}%`, background: tome.glow, boxShadow: `0 0 10px ${tome.glow}` }} />
              </div>
              <p className="mt-1 text-xs font-semibold text-amber-50/90">
                {missions.length === 0 ? "Nenhuma missão ainda" : `${doneHere} de ${missions.length} missões concluídas${doneHere === missions.length ? " • 🏆 tomo dominado!" : ""}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-white">Missões de {title}</h2>

        <div className="inline-flex gap-1 rounded-xl border border-slate-800 bg-cg-card p-1">
          {(Object.keys(FILTER_LABELS) as StatusFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f ? "bg-white text-cg-ink" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {FILTER_LABELS[f]}
              <span className={`rounded-full px-1.5 text-[10px] ${filter === f ? "bg-slate-200 text-slate-700" : "bg-slate-800 text-slate-400"}`}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative mb-4">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">🔍</span>
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Buscar por nome, raridade ou item (ex.: Loop, Épico, Anel)…"
          className="cg-input !pl-11"
        />
      </div>

      {filteredMissions.length === 0 ? (
        <p className="text-sm text-slate-500">
          {missions.length === 0
            ? EMPTY_MESSAGES.todas
            : searchedMissions.length === 0
              ? `Nenhuma missão encontrada para "${search.trim()}" — tente outro nome, raridade ou item.`
              : EMPTY_MESSAGES[filter]}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {pagedMissions.map((m) => {
            const unlocked = activeStudent.level >= m.minLevel;
            const completed = completedIds.includes(m.id);
            const isTask = isTaskMission(m);
            const delivery = isTask && !completed ? latestSubmissionIn(submissions, activeStudent.id, m.id) : undefined;
            return (
              <div key={m.id} className="cg-card flex flex-wrap items-center justify-between gap-4 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cg-tile text-xl">{m.icon}</div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-white">{m.title}</p>
                      <DifficultyBadge difficulty={m.difficulty} />
                      <span className="text-xs text-slate-500">Nv {m.minLevel}+</span>
                      {isTask && (
                        <span className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-2 text-[10px] font-semibold text-indigo-300">📝 Entrega</span>
                      )}
                      {completed && <span className="text-xs text-emerald-400">✓ Concluída</span>}
                      {delivery?.status === "pendente" && <span className="text-xs font-semibold text-amber-300">⏳ Aguardando correção</span>}
                      {delivery?.status === "refazer" && <span className="text-xs font-semibold text-rose-300">↩ O professor pediu pra refazer</span>}
                    </div>
                    <p className="mt-1 text-sm text-slate-400">{m.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="text-violet-300">✦ {m.rewardXp} XP</span>
                      <span className="flex items-center gap-1 text-amber-300">
                        <CoinIcon size={14} /> {m.rewardCoins}
                      </span>
                      <button
                        type="button"
                        onClick={() => setViewingReward(m.rewardItem)}
                        title="Ver detalhes do item de recompensa"
                        className="flex items-center gap-1 hover:text-slate-300 hover:underline"
                      >
                        {m.rewardItem.icon} {m.rewardItem.name} <RarityBadge rarity={m.rewardItem.rarity} />
                      </button>
                      {!completed &&
                        (isTask ? (
                          <span className="text-slate-500">📝 Corrigida pelo professor</span>
                        ) : (
                          <span className="text-slate-500">
                            🎯 Mín. {requiredCorrect(m.questions.length)}/{m.questions.length} acertos
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                {unlocked ? (
                  <button
                    onClick={() => (isTask ? setTaskMission(m) : setActiveMission(m))}
                    className={completed || delivery?.status === "pendente" ? "cg-btn-secondary shrink-0 !px-4 !py-2 text-sm" : "cg-btn-primary shrink-0 !px-4 !py-2 text-sm"}
                  >
                    {completed
                      ? "👁 Visualizar"
                      : delivery?.status === "pendente"
                        ? "👁 Ver entrega"
                        : delivery?.status === "refazer"
                          ? "↩ Refazer entrega →"
                          : isTask
                            ? "📝 Fazer entrega →"
                            : "Iniciar Missão →"}
                  </button>
                ) : (
                  <span className="shrink-0 rounded-full border border-slate-800 bg-cg-sunken px-4 py-2 text-xs font-medium text-slate-600">
                    🔒 Bloqueada — Nv {m.minLevel}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {filteredMissions.length > MISSIONS_PER_PAGE && (
        <>
          <Pagination page={currentPage} totalPages={totalPages} onChange={changePage} />
          <p className="mt-2 text-center text-[11px] text-slate-500">
            Mostrando {pageStart + 1}–{pageStart + pagedMissions.length} de {filteredMissions.length} missões
          </p>
        </>
      )}

      {viewingReward && <ItemDetailsModal item={viewingReward} onClose={() => setViewingReward(null)} />}

      {levelUp && (
        <LevelUpScreen
          fromLevel={levelUp.from}
          toLevel={levelUp.to}
          unlockedMissions={studentMissions.filter((m) => m.minLevel > levelUp.from && m.minLevel <= levelUp.to)}
          onClose={() => setLevelUp(null)}
        />
      )}

      {taskMission && <TaskSubmissionModal mission={taskMission} student={activeStudent} onClose={() => setTaskMission(null)} />}

      {activeMission && (
        <QuizModal mission={activeMission} onClose={() => setActiveMission(null)} onComplete={handleComplete} viewOnly={alreadyCompleted} />
      )}
    </div>
  );
}
