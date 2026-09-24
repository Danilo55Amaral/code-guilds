"use client";

import { useState } from "react";
import { Mission, matchesSearch } from "@/engine/missions";
import { Student } from "@/engine/students";
import { DifficultyBadge } from "./GameUI";
import SearchInput from "./SearchInput";
import { PaginationFooter, usePagination } from "./Pagination";

const MISSIONS_PER_PAGE = 10;

/**
 * Card de missões dos painéis (professor e ADM): mesma busca da tela de Missões
 * do aluno (nome, raridade ou item), paginada de 10 em 10.
 * `teacherName` só é passado pelo ADM (mostra o professor dono de cada missão).
 */
export default function MissionList({
  title,
  missions,
  students,
  emptyText,
  headerRight,
  teacherName,
  onSelect,
}: {
  title: string;
  missions: Mission[];
  /** Usado pra contar quantos alunos concluíram cada missão. */
  students: Student[];
  emptyText: string;
  headerRight?: React.ReactNode;
  teacherName?: (teacherId: string) => string;
  onSelect: (mission: Mission) => void;
}) {
  const [search, setSearch] = useState("");
  const found = missions.filter((m) => matchesSearch(m, search));
  const pager = usePagination(found, MISSIONS_PER_PAGE, search);

  return (
    <div className="cg-card mb-6 p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-300">
          {title} ({missions.length})
        </p>
        {headerRight}
      </div>

      {missions.length === 0 ? (
        <p className="text-sm text-slate-500">{emptyText}</p>
      ) : (
        <>
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nome, raridade ou item…" className="mb-3" />
          {found.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhuma missão encontrada para &quot;{search.trim()}&quot; — tente outro nome, raridade ou item.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {pager.pageItems.map((m) => {
                const completions = students.filter((s) => s.completedMissionIds.includes(m.id)).length;
                return (
                  <button
                    key={m.id}
                    onClick={() => onSelect(m)}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-cg-sunken px-4 py-2.5 text-left transition-colors hover:border-slate-600"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="text-lg">{m.icon}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white">{m.title}</p>
                        <p className="text-xs text-slate-500">{m.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      {teacherName && <span className="text-violet-300">🎓 {teacherName(m.teacherId)}</span>}
                      <DifficultyBadge difficulty={m.difficulty} />
                      <span className="text-slate-500">Nv {m.minLevel}+</span>
                      <span className="text-slate-500">{completions} concluíram</span>
                      <span className="text-slate-600">Editar →</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          <PaginationFooter pager={pager} noun="missões" />
        </>
      )}
    </div>
  );
}
