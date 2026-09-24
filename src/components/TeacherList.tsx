"use client";

import { useState } from "react";
import { Teacher } from "@/engine/teachers";
import { normalizeSearch } from "@/engine/missions";
import SearchInput from "./SearchInput";
import { PaginationFooter, usePagination } from "./Pagination";

const TEACHERS_PER_PAGE = 10;

/** Card de professores do Painel ADM: busca por nome ou e-mail, paginada de 10 em 10. */
export default function TeacherList({
  teachers,
  studentCount,
  missionCount,
  onNew,
  onSelect,
}: {
  teachers: Teacher[];
  studentCount: (teacherId: string) => number;
  missionCount: (teacherId: string) => number;
  onNew: () => void;
  onSelect: (teacher: Teacher) => void;
}) {
  const [search, setSearch] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const q = normalizeSearch(search);
  const found = teachers.filter((t) => !q || normalizeSearch(t.name).includes(q) || t.email.includes(q));
  const pager = usePagination(found, TEACHERS_PER_PAGE, search);

  return (
    <div className="cg-card mb-6 p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-300">Professores cadastrados ({teachers.length})</p>
        <div className="flex gap-2">
          <button onClick={() => setShowPasswords((v) => !v)} className="cg-btn-secondary !px-3 !py-1.5 text-xs">
            {showPasswords ? "🙈 Esconder senhas" : "👁 Mostrar senhas"}
          </button>
          <button onClick={onNew} className="cg-btn-primary !px-3 !py-1.5 text-xs">
            + Novo Professor
          </button>
        </div>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Buscar professor por nome ou e-mail…" className="mb-3" />
      {found.length === 0 ? (
        <p className="text-sm text-slate-500">Nenhum professor encontrado para &quot;{search.trim()}&quot;.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {pager.pageItems.map((t) => {
            const students = studentCount(t.id);
            const missions = missionCount(t.id);
            return (
              <button
                key={t.id}
                onClick={() => onSelect(t)}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-cg-sunken px-4 py-2.5 text-left transition-colors hover:border-slate-600"
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-medium text-white">
                    {t.name}
                    {t.isAdmin && <span className="rounded-full border border-violet-500/40 px-2 py-0.5 text-[10px] font-semibold text-violet-300">🛡 ADM</span>}
                  </p>
                  <p className="break-all text-xs text-slate-500">
                    {t.email} • senha <span className="font-mono">{showPasswords ? t.password : "•".repeat(t.password.length)}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400">
                    {students} {students === 1 ? "aluno" : "alunos"}
                  </span>
                  <span className="text-slate-400">
                    {missions} {missions === 1 ? "missão" : "missões"}
                  </span>
                  <span className="text-slate-600">Editar →</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
      <PaginationFooter pager={pager} noun="professores" />
    </div>
  );
}
