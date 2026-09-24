"use client";

import { useState } from "react";
import { Student, matchesStudentSearch } from "@/engine/students";
import { Mission } from "@/engine/missions";
import { HOUSES } from "@/engine/houses";
import { CoinIcon } from "./GameUI";
import SearchInput from "./SearchInput";
import { PaginationFooter, usePagination } from "./Pagination";

const STUDENTS_PER_PAGE = 10;

/**
 * Card de alunos dos painéis (professor e ADM): busca por nome, nível ou casa,
 * paginada de 10 em 10. `teacherName` só é passado pelo ADM (mostra o professor de cada aluno).
 */
export default function StudentList({
  title,
  students,
  missions,
  emptyText,
  headerRight,
  teacherName,
  onSelect,
}: {
  title: string;
  students: Student[];
  /** Missões dos professores desses alunos — cada aluno conta só as do próprio professor. */
  missions: Mission[];
  emptyText: string;
  headerRight?: React.ReactNode;
  teacherName?: (teacherId: string) => string;
  onSelect: (studentId: string) => void;
}) {
  const [search, setSearch] = useState("");
  const found = students.filter((s) => matchesStudentSearch(s, search));
  const pager = usePagination(found, STUDENTS_PER_PAGE, search);

  return (
    <div className="cg-card mb-6 p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-300">
          {title} ({students.length})
        </p>
        {headerRight}
      </div>

      {students.length === 0 ? (
        <p className="text-sm text-slate-500">{emptyText}</p>
      ) : (
        <>
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nome, nível ou casa…" className="mb-3" />
          {found.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhum aluno encontrado para &quot;{search.trim()}&quot; — tente outro nome, nível ou casa.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {pager.pageItems.map((s) => {
                const house = s.houseId ? HOUSES.find((h) => h.id === s.houseId) : null;
                const teacherMissions = missions.filter((m) => m.teacherId === s.teacherId);
                return (
                  <button
                    key={s.id}
                    onClick={() => onSelect(s.id)}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-cg-sunken px-4 py-2.5 text-left transition-colors hover:border-slate-600"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white">{s.name}</p>
                      <p className="break-all text-xs text-slate-500">
                        {s.email} • {s.turma} • <span className="font-mono">@{s.username}</span>
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      {teacherName && <span className="text-violet-300">🎓 {teacherName(s.teacherId)}</span>}
                      {house && <span className={house.colorClass}>{house.name}</span>}
                      <span className="text-slate-400">Nv {s.level}</span>
                      <span className="flex items-center gap-1 text-amber-300">
                        <CoinIcon size={14} /> {s.coins}
                      </span>
                      <span className="text-slate-500">
                        {teacherMissions.filter((m) => s.completedMissionIds.includes(m.id)).length}/{teacherMissions.length} missões
                      </span>
                      <span className="text-slate-600">Ver aluno →</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          <PaginationFooter pager={pager} noun="alunos" />
        </>
      )}
    </div>
  );
}
