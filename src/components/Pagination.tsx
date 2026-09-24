"use client";

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
              item === page ? "bg-white text-[#0a0a0f]" : "border border-slate-800 bg-[#101018] text-slate-400 hover:border-slate-600 hover:text-slate-200"
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
