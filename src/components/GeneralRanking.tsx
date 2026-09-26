"use client";

import { useState } from "react";
import { HOUSES, HouseId, getHouse } from "@/engine/houses";
import { Student, matchesStudentSearch, totalXp, wornAvatar } from "@/engine/students";
import Avatar from "./Avatar";
import { CoinIcon } from "./GameUI";
import SearchInput from "./SearchInput";
import { PaginationFooter, usePagination } from "./Pagination";

// ============================================================================
// RANKING GERAL — todos os alunos de todas as casas da plataforma, em Minha
// Casa. Ordem: XP total, depois moedas, depois nome. A posição é sempre a do
// ranking geral, mesmo filtrando por casa ou buscando. Pódio com os 3
// primeiros, filtro por casa, busca (nome, nível ou casa) e 10 por página.
// Clicar num aluno abre o perfil público dele (HousemateSheet).
// ============================================================================

const PER_PAGE = 10;
const MEDALS = ["🥇", "🥈", "🥉"];

type HouseFilter = HouseId | "todas";

function compareRank(a: Student, b: Student): number {
  return totalXp(b.level, b.xp) - totalXp(a.level, a.xp) || b.coins - a.coins || a.name.localeCompare(b.name, "pt-BR");
}

export default function GeneralRanking({ students, meId, onSelect }: { students: Student[]; meId: string; onSelect: (studentId: string) => void }) {
  const [houseFilter, setHouseFilter] = useState<HouseFilter>("todas");
  const [search, setSearch] = useState("");

  // Só entra quem já escolheu a casa (alunos no meio do primeiro acesso ainda não têm).
  const ranked = students.filter((s) => s.houseId).sort(compareRank);
  const position = new Map(ranked.map((s, i) => [s.id, i + 1]));
  const filtered = ranked.filter((s) => (houseFilter === "todas" || s.houseId === houseFilter) && matchesStudentSearch(s, search));
  const pager = usePagination(filtered, PER_PAGE, `${houseFilter}|${search}`);
  const myPosition = position.get(meId);
  const showPodium = houseFilter === "todas" && !search.trim() && ranked.length > 0;
  // No pódio: 2º à esquerda, 1º no meio (mais alto), 3º à direita.
  const podium = [ranked[1], ranked[0], ranked[2]];

  return (
    <div className="cg-card p-6 lg:col-span-3">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-300">🏆 Ranking Geral da Academia</p>
          <p className="text-[11px] text-slate-500">Todos os alunos de todas as casas, por XP total. Clique num aluno pra ver o avatar, o nível, as moedas e os itens dele.</p>
        </div>
        {myPosition && (
          <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
            Você está em #{myPosition} de {ranked.length}
          </span>
        )}
      </div>

      {/* ---- pódio ---- */}
      {showPodium && (
        <div className="mb-5 grid grid-cols-3 items-end gap-2 sm:gap-4">
          {podium.map((s, slot) => {
            if (!s) return <div key={slot} />;
            const place = position.get(s.id)!;
            const house = getHouse(s.houseId!);
            const first = place === 1;
            return (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border px-2 pb-3 text-center transition-transform hover:-translate-y-1 ${
                  first ? "border-amber-400/50 bg-amber-400/10 pt-4" : "border-slate-800 bg-cg-sunken pt-3"
                } ${s.id === meId ? "ring-2 ring-white/60" : ""}`}
              >
                <span className={first ? "text-3xl" : "text-2xl"}>{MEDALS[place - 1]}</span>
                <Avatar config={wornAvatar(s)} ringColor={house.hex} size={first ? 76 : 58} />
                <span className="w-full truncate text-sm font-semibold text-white">{s.name}</span>
                <span className={`text-[11px] ${house.colorClass}`}>{house.name}</span>
                <span className="text-xs font-bold text-slate-200">{totalXp(s.level, s.xp)} XP</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ---- filtros ---- */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        <button
          onClick={() => setHouseFilter("todas")}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            houseFilter === "todas" ? "border-white bg-white text-cg-ink" : "border-slate-700 text-slate-300 hover:border-slate-500"
          }`}
        >
          Todas as casas ({ranked.length})
        </button>
        {HOUSES.map((h) => (
          <button
            key={h.id}
            onClick={() => setHouseFilter(h.id)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              houseFilter === h.id ? `${h.borderClass} ${h.bgClass} ${h.colorClass}` : "border-slate-700 text-slate-400 hover:border-slate-500"
            }`}
          >
            {h.name} ({ranked.filter((s) => s.houseId === h.id).length})
          </button>
        ))}
      </div>
      <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nome, nível (ex.: Nv 3) ou casa…" className="mb-3" />

      {/* ---- lista ---- */}
      {filtered.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500">
          {search.trim() ? `Nenhum aluno encontrado para "${search.trim()}".` : "Nenhum aluno nesta casa ainda."}
        </p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {pager.pageItems.map((s) => {
            const place = position.get(s.id)!;
            const house = getHouse(s.houseId!);
            const isYou = s.id === meId;
            return (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
                  isYou ? "bg-white text-cg-ink" : "border border-slate-800 bg-cg-sunken text-slate-300 hover:border-slate-600"
                }`}
              >
                <span className="flex min-w-0 items-center gap-2.5 text-sm">
                  <span className="w-7 shrink-0 text-center text-xs font-bold opacity-70">{place <= 3 ? <span className="text-base">{MEDALS[place - 1]}</span> : `#${place}`}</span>
                  <Avatar config={wornAvatar(s)} ringColor={house.hex} size={34} />
                  <span className="min-w-0">
                    <span className="block truncate font-medium">
                      {s.name} {isYou && <span className="text-xs opacity-60">(você)</span>}
                    </span>
                    <span className={`block text-[11px] ${isYou ? "opacity-70" : house.colorClass}`}>
                      {house.name} • Nv {s.level}
                    </span>
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end text-xs font-semibold leading-tight">
                  {totalXp(s.level, s.xp)} XP
                  <span className={`flex items-center gap-0.5 text-[11px] ${isYou ? "text-amber-600" : "text-amber-300"}`}>
                    <CoinIcon size={11} /> {s.coins}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
      <PaginationFooter pager={pager} noun="alunos" />
    </div>
  );
}
