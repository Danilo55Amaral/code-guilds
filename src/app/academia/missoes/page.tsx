"use client";

import { useState } from "react";
import { useStudents, useMissions } from "@/engine/store";
import { Mission, hasPassed, matchesSearch, requiredCorrect } from "@/engine/missions";
import { applyMissionReward } from "@/engine/students";
import { CoinIcon, DifficultyBadge, RarityBadge } from "@/components/GameUI";
import QuizModal from "@/components/QuizModal";
import Pagination from "@/components/Pagination";
import LevelUpScreen from "@/components/LevelUpScreen";

const MISSIONS_PER_PAGE = 10;

type StatusFilter = "ativas" | "concluidas" | "todas";

const FILTER_LABELS: Record<StatusFilter, string> = { todas: "Todas", ativas: "Ativas", concluidas: "Concluídas" };

const EMPTY_MESSAGES: Record<StatusFilter, string> = {
  todas: "Seu professor ainda não criou nenhuma missão — peça pra ele criar uma no Painel do Mestre.",
  ativas: "Nenhuma missão ativa no momento — você concluiu todas. Bom trabalho!",
  concluidas: "Você ainda não concluiu nenhuma missão.",
};

export default function MissoesPage() {
  const { activeStudent, patchActive } = useStudents();
  const { missions: allMissions, ready: missionsReady } = useMissions();
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [levelUp, setLevelUp] = useState<{ from: number; to: number } | null>(null);
  const [filter, setFilter] = useState<StatusFilter>("todas");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  if (!activeStudent || !missionsReady) return null;

  // O aluno só vê as missões do professor que escolheu no cadastro.
  const missions = allMissions.filter((m) => m.teacherId === activeStudent.teacherId);
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

  function handleComplete(correctCount: number) {
    if (!activeMission || !activeStudent) return;
    // Missão já concluída antes: é só revisão, não gera XP/moedas/item de novo.
    if (activeStudent.completedMissionIds.includes(activeMission.id)) {
      setActiveMission(null);
      return;
    }
    // Abaixo de 60%: nada de recompensa, e a missão continua ativa pra tentar de novo.
    if (!hasPassed(correctCount, activeMission.questions.length)) {
      setActiveMission(null);
      return;
    }
    const result = applyMissionReward(activeStudent, activeMission);
    patchActive(result.student);
    // A cena de nível abre logo depois que a tela de recompensas fecha.
    if (result.leveledUp) setLevelUp({ from: activeStudent.level, to: result.newLevel });
    setActiveMission(null);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-white">Missões</h1>

        <div className="inline-flex gap-1 rounded-xl border border-slate-800 bg-[#101018] p-1">
          {(Object.keys(FILTER_LABELS) as StatusFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f ? "bg-white text-[#0a0a0f]" : "text-slate-400 hover:text-slate-200"
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
            return (
              <div key={m.id} className="cg-card flex flex-wrap items-center justify-between gap-4 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1a1a24] text-xl">{m.icon}</div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-white">{m.title}</p>
                      <DifficultyBadge difficulty={m.difficulty} />
                      <span className="text-xs text-slate-500">Nv {m.minLevel}+</span>
                      {completed && <span className="text-xs text-emerald-400">✓ Concluída</span>}
                    </div>
                    <p className="mt-1 text-sm text-slate-400">{m.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="text-violet-300">✦ {m.rewardXp} XP</span>
                      <span className="flex items-center gap-1 text-amber-300">
                        <CoinIcon size={14} /> {m.rewardCoins}
                      </span>
                      <span className="flex items-center gap-1">
                        🎁 {m.rewardItem.name} <RarityBadge rarity={m.rewardItem.rarity} />
                      </span>
                      {!completed && (
                        <span className="text-slate-500">
                          🎯 Mín. {requiredCorrect(m.questions.length)}/{m.questions.length} acertos
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {unlocked ? (
                  <button
                    onClick={() => setActiveMission(m)}
                    className={completed ? "cg-btn-secondary shrink-0 !px-4 !py-2 text-sm" : "cg-btn-primary shrink-0 !px-4 !py-2 text-sm"}
                  >
                    {completed ? "👁 Visualizar" : "Iniciar Missão →"}
                  </button>
                ) : (
                  <span className="shrink-0 rounded-full border border-slate-800 bg-[#0d0d14] px-4 py-2 text-xs font-medium text-slate-600">
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

      {levelUp && (
        <LevelUpScreen
          fromLevel={levelUp.from}
          toLevel={levelUp.to}
          unlockedMissions={missions.filter((m) => m.minLevel > levelUp.from && m.minLevel <= levelUp.to)}
          onClose={() => setLevelUp(null)}
        />
      )}

      {activeMission && (
        <QuizModal mission={activeMission} onClose={() => setActiveMission(null)} onComplete={handleComplete} viewOnly={alreadyCompleted} />
      )}
    </div>
  );
}
