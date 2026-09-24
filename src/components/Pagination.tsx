"use client";

import { useState } from "react";

/**
 * Fatia uma lista em páginas. Quando `resetKey` muda (ex.: o texto da busca),
 * volta pra página 1; se a lista encolher, a página é limitada à última que existe.
 */
export function usePagination<T>(items: T[], perPage: number, resetKey: string = "") {
  const [state, setState] = useState({ page: 1, key: resetKey });
  // Guarda a chave nova já na página 1 — senão, ao apagar a busca, a lista voltaria pra página antiga.
  if (state.key !== resetKey) setState({ page: 1, key: resetKey });
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const page = Math.min(state.key === resetKey ? state.page : 1, totalPages);
  const start = (page - 1) * perPage;
  return {
    page,
    totalPages,
    start,
    total: items.length,
    pageItems: items.slice(start, start + perPage),
    setPage: (p: number) => setState({ page: p, key: resetKey }),
  };
}

/**
 * Paginação + "Mostrando 1–10 de 23 alunos" — só aparece quando há mais de uma página.
 * `scrollToTop` sobe a tela ao trocar de página (pra listas que ocupam a página inteira).
 */
export function PaginationFooter({
  pager,
  noun,
  scrollToTop = false,
}: {
  pager: ReturnType<typeof usePagination<unknown>>;
  noun: string;
  scrollToTop?: boolean;
}) {
  if (pager.totalPages <= 1) return null;

  function change(p: number) {
    pager.setPage(p);
    if (scrollToTop) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <Pagination page={pager.page} totalPages={pager.totalPages} onChange={change} />
      <p className="mt-2 text-center text-[11px] text-slate-500">
        Mostrando {pager.start + 1}–{pager.start + pager.pageItems.length} de {pager.total} {noun}
      </p>
    </>
  );
}

/** Números de página a exibir: sempre a primeira, a última e as vizinhas da atual; o resto vira "…". */
function pageItems(page: number, totalPages: number): (number | "…")[] {
  const items: (number | "…")[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) items.push(p);
    else if (items[items.length - 1] !== "…") items.push("…");
  }
  return items;
}

export default function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const navBtn = "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav className="mt-6 flex flex-wrap items-center justify-center gap-1" aria-label="Paginação">
      <button onClick={() => onChange(page - 1)} disabled={page === 1} className={`${navBtn} text-slate-400 hover:text-slate-200`}>
        ← Anterior
      </button>

      {pageItems(page, totalPages).map((item, i) =>
        item === "…" ? (
          <span key={`gap-${i}`} className="px-2 text-xs text-slate-600">
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={`h-8 min-w-8 rounded-lg px-2.5 text-xs font-medium transition-colors ${
              item === page ? "bg-white text-cg-ink" : "border border-slate-800 bg-cg-card text-slate-400 hover:border-slate-600 hover:text-slate-200"
            }`}
          >
            {item}
          </button>
        ),
      )}

      <button onClick={() => onChange(page + 1)} disabled={page === totalPages} className={`${navBtn} text-slate-400 hover:text-slate-200`}>
        Próxima →
      </button>
    </nav>
  );
}
