"use client";

import { createContext, useContext, useId, useState, type ReactNode } from "react";
import type { BookInfo } from "./types";

// ============================================================================
// AS PEÇAS DAS PÁGINAS DOS LIVROS — o que se repete em todo livro didático da
// Biblioteca Virtual: a abertura do capítulo, os títulos, os parágrafos, as
// figuras com legenda, os boxes ("Você sabia?", "Atenção", "Experimente",
// "Para lembrar", "Dica do Mago"), as tabelas, o resumo, o glossário e o
// "Teste rápido" (a resposta aparece ao tocar). As cores vêm do livro aberto
// (--bk-accent, --bk-dark e --bk-tint, no BookReader) e as medidas são em em,
// pra acompanhar a letra da página, que cresce com a tela.
// ============================================================================

/** O livro aberto, pras páginas que navegam (o sumário leva direto pra página de cada capítulo). */
export const BookNavContext = createContext<{ info: BookInfo; chapterStart: number[]; goTo: (page: number) => void } | null>(null);

/** O sumário: um item por capítulo, com o número da página; tocar leva até lá. */
export function TableOfContents({ from = 0, to }: { from?: number; to?: number }) {
  const nav = useContext(BookNavContext);
  if (!nav) return null;
  return (
    <ol className="space-y-[0.4em]">
      {nav.info.chapters.slice(from, to).map((c, i) => {
        const n = from + i + 1;
        const page = nav.chapterStart[n - 1];
        return (
          <li key={c.title}>
            <button
              type="button"
              onClick={() => nav.goTo(page)}
              className="group flex w-full items-start gap-[0.6em] rounded-xl px-[0.5em] py-[0.35em] text-left transition-colors hover:bg-[color:var(--bk-tint)]"
            >
              <span className="flex h-[2.1em] w-[2.1em] shrink-0 items-center justify-center rounded-full text-[1.05em] shadow-sm" style={{ background: "var(--bk-tint)", border: "2px solid var(--bk-accent)" }}>
                {c.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2">
                  <span className="cg-book-title font-black" style={{ color: "var(--bk-dark)" }}>
                    {n}. {c.title}
                  </span>
                  <span className="mb-[0.25em] flex-1 border-b-2 border-dotted border-[#c9b483]" aria-hidden="true" />
                  <span className="cg-book-title font-bold" style={{ color: "var(--bk-accent)" }}>
                    {page + 1}
                  </span>
                </span>
                <span className="block text-[0.82em] leading-snug text-[#6b5a3a] group-hover:text-[#3b2a14]">{c.summary}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/** Um prefixo único pros ids dos gradientes de um desenho (a mesma figura pode estar em duas páginas na virada). */
export function useUid(prefix = "bk"): string {
  return `${prefix}${useId().replace(/:/g, "")}`;
}

/** A abertura do capítulo: o número, o título, o desenho grande e o que o aluno vai aprender. */
export function ChapterOpener({ n, title, goals, children }: { n: number; title: string; goals: string[]; children: ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <div className="text-center">
        <span className="cg-book-title inline-block rounded-full px-4 py-1 text-[0.8em] font-bold uppercase tracking-[0.25em] text-white" style={{ background: "var(--bk-accent)" }}>
          Capítulo {n}
        </span>
        <h2 className="cg-book-title mt-2 text-[1.75em] font-black leading-tight" style={{ color: "var(--bk-dark)" }}>
          {title}
        </h2>
        <div className="mx-auto mt-2 flex items-center justify-center gap-2" style={{ color: "var(--bk-accent)" }} aria-hidden="true">
          <span className="h-px w-16 bg-current opacity-60" />
          <span className="text-[0.8em]">✦</span>
          <span className="h-px w-16 bg-current opacity-60" />
        </div>
      </div>
      <div className="my-[0.8em] flex min-h-0 flex-1 items-center justify-center">{children}</div>
      <div className="rounded-xl border px-[1em] py-[0.7em]" style={{ borderColor: "var(--bk-line)", background: "var(--bk-tint)" }}>
        <p className="cg-book-title text-[0.85em] font-bold uppercase tracking-wider" style={{ color: "var(--bk-dark)" }}>
          Neste capítulo você vai descobrir:
        </p>
        <ul className="mt-1 space-y-0.5 text-[0.92em]">
          {goals.map((g) => (
            <li key={g} className="flex gap-2">
              <span style={{ color: "var(--bk-accent)" }}>✓</span>
              <span>{g}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** O título de uma seção da página. */
export function H({ children, icon }: { children: ReactNode; icon?: string }) {
  return (
    <h3 className="cg-book-title mb-[0.4em] mt-[0.2em] flex items-center gap-2 text-[1.2em] font-black leading-tight first:mt-0" style={{ color: "var(--bk-dark)" }}>
      {icon && <span className="text-[0.95em]">{icon}</span>}
      <span>{children}</span>
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="mb-[0.65em] text-justify leading-[1.6] [hyphens:auto]">{children}</p>;
}

/** Um termo importante, em destaque no texto. */
export function T({ children }: { children: ReactNode }) {
  return (
    <strong className="font-bold" style={{ color: "var(--bk-dark)" }}>
      {children}
    </strong>
  );
}

/** A figura (um desenho em SVG) com a legenda embaixo. `h` é a altura máxima (em vh da tela). */
export function Fig({ children, caption, n, h = 30 }: { children: ReactNode; caption?: ReactNode; n?: string; h?: number }) {
  return (
    <figure className="my-[0.6em]">
      <div className="overflow-hidden rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.4em] shadow-inner" style={{ ["--bk-fig-h" as string]: `${h}vh` }}>
        {children}
      </div>
      {caption && (
        <figcaption className="mt-[0.35em] text-center text-[0.8em] italic leading-snug text-[#5b4a2e]">
          {n && (
            <span className="font-bold not-italic" style={{ color: "var(--bk-dark)" }}>
              Figura {n}.{" "}
            </span>
          )}
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** O SVG de uma figura: ocupa a largura toda e no máximo a altura da figura (sem distorcer). */
export function Art({ viewBox, children, label }: { viewBox: string; children: ReactNode; label: string }) {
  return (
    <svg viewBox={viewBox} role="img" aria-label={label} className="cg-book-art mx-auto block h-auto w-full overflow-visible" style={{ maxHeight: "var(--bk-fig-h, 30vh)" }}>
      {children}
    </svg>
  );
}

const BOXES = {
  sabia: { title: "Você sabia?", icon: "💡", bg: "#fef3c7", border: "#f59e0b", ink: "#78350f" },
  atencao: { title: "Atenção", icon: "⚠️", bg: "#ffe4e6", border: "#f43f5e", ink: "#881337" },
  experimente: { title: "Experimente", icon: "🔍", bg: "#e0f2fe", border: "#0ea5e9", ink: "#0c4a6e" },
  lembre: { title: "Para lembrar", icon: "📌", bg: "#dcfce7", border: "#22c55e", ink: "#14532d" },
  mago: { title: "Dica do Mago Danilo", icon: "🧙", bg: "#ede9fe", border: "#8b5cf6", ink: "#3b0764" },
} as const;

export function Box({ kind, title, children }: { kind: keyof typeof BOXES; title?: string; children: ReactNode }) {
  const b = BOXES[kind];
  return (
    <aside className="my-[0.6em] rounded-xl border-l-[5px] px-[0.9em] py-[0.55em] text-[0.93em] leading-[1.5] shadow-sm" style={{ background: b.bg, borderColor: b.border, color: b.ink }}>
      <p className="cg-book-title mb-[0.2em] text-[0.95em] font-black">
        {b.icon} {title ?? b.title}
      </p>
      <div>{children}</div>
    </aside>
  );
}

/** Uma lista com marcadores da cor do livro. */
export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mb-[0.65em] space-y-[0.3em] leading-[1.5]">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-[0.1em] shrink-0" style={{ color: "var(--bk-accent)" }}>
            ◆
          </span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

/** Cartões lado a lado (dois por linha), cada um com ícone e título. */
export function Cards({ items }: { items: { icon: string; title: string; text: ReactNode }[] }) {
  return (
    <div className="mb-[0.65em] grid grid-cols-2 gap-[0.5em]">
      {items.map((c) => (
        <div key={c.title} className="rounded-xl border border-[#e2d3ae] bg-[#fffaf0] px-[0.65em] py-[0.5em] text-[0.88em] leading-[1.45] shadow-sm">
          <p className="cg-book-title font-black" style={{ color: "var(--bk-dark)" }}>
            {c.icon} {c.title}
          </p>
          <div className="mt-[0.15em]">{c.text}</div>
        </div>
      ))}
    </div>
  );
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="my-[0.6em] overflow-x-auto rounded-xl border border-[#d9c79d]">
      <table className="w-full border-collapse text-left text-[0.86em] leading-snug">
        <thead>
          <tr style={{ background: "var(--bk-accent)" }}>
            {head.map((h, i) => (
              <th key={`${i}-${h}`} className="cg-book-title px-[0.6em] py-[0.4em] font-bold text-white">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 ? "bg-[#fbf3dc]" : "bg-[#fffaf0]"}>
              {r.map((c, j) => (
                <td key={j} className={`border-t border-[#e6d8b5] px-[0.6em] py-[0.35em] align-top ${j === 0 ? "font-bold" : ""}`} style={j === 0 ? { color: "var(--bk-dark)" } : undefined}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** O resumo do capítulo. */
export function Summary({ items }: { items: ReactNode[] }) {
  return (
    <section className="mb-[0.7em] rounded-xl border-2 border-dashed px-[0.9em] py-[0.6em]" style={{ borderColor: "var(--bk-accent)", background: "var(--bk-tint)" }}>
      <p className="cg-book-title mb-[0.3em] text-[1.05em] font-black" style={{ color: "var(--bk-dark)" }}>
        📋 Resumindo
      </p>
      <List items={items} />
    </section>
  );
}

export function Glossary({ items }: { items: [string, ReactNode][] }) {
  return (
    <section className="mb-[0.7em]">
      <p className="cg-book-title mb-[0.3em] text-[1.05em] font-black" style={{ color: "var(--bk-dark)" }}>
        📖 Glossário
      </p>
      <dl className="grid gap-x-[0.8em] gap-y-[0.25em] text-[0.88em] leading-[1.45] sm:grid-cols-[auto_1fr]">
        {items.map(([term, def]) => (
          <div key={term} className="contents">
            <dt className="font-bold" style={{ color: "var(--bk-dark)" }}>
              {term}
            </dt>
            <dd className="mb-[0.2em] sm:mb-0">{def}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** O "Teste rápido": cada pergunta tem o botão pra mostrar a resposta. */
export function Quiz({ items }: { items: [string, ReactNode][] }) {
  const [open, setOpen] = useState<boolean[]>(() => items.map(() => false));
  return (
    <section className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] px-[0.9em] py-[0.6em] shadow-sm">
      <p className="cg-book-title mb-[0.35em] text-[1.05em] font-black" style={{ color: "var(--bk-dark)" }}>
        ✏️ Teste rápido
      </p>
      <ol className="space-y-[0.45em] text-[0.92em] leading-[1.45]">
        {items.map(([q, a], i) => (
          <li key={q}>
            <p>
              <span className="font-bold" style={{ color: "var(--bk-accent)" }}>
                {i + 1}.
              </span>{" "}
              {q}
            </p>
            {open[i] ? (
              <p className="cg-anim-fade mt-[0.2em] rounded-lg px-[0.6em] py-[0.3em] text-[0.95em]" style={{ background: "var(--bk-tint)", color: "var(--bk-dark)" }}>
                <span className="font-bold">Resposta:</span> {a}
              </p>
            ) : (
              <button
                type="button"
                onClick={() => setOpen((o) => o.map((v, j) => (j === i ? true : v)))}
                className="mt-[0.2em] rounded-full border border-[color:var(--bk-accent)] px-[0.8em] py-[0.15em] text-[0.85em] font-bold text-[color:var(--bk-accent)] transition-colors hover:bg-[color:var(--bk-accent)] hover:text-white"
              >
                Ver a resposta
              </button>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Um texto de SVG com a linha que liga ao ponto do desenho (as legendas das figuras). */
export function Label({
  x,
  y,
  tx,
  ty,
  children,
  anchor = "start",
  color = "#3b2a14",
  size = 13,
}: {
  x: number;
  y: number;
  tx: number;
  ty: number;
  children: ReactNode;
  anchor?: "start" | "middle" | "end";
  color?: string;
  size?: number;
}) {
  return (
    <g>
      <line x1={x} y1={y} x2={tx} y2={ty} stroke="#7c6a48" strokeWidth="1" strokeDasharray="3 2" />
      <circle cx={x} cy={y} r="2.2" fill="#7c6a48" />
      <text x={tx + (anchor === "start" ? 4 : anchor === "end" ? -4 : 0)} y={ty + 4} textAnchor={anchor} fontSize={size} fontWeight="700" fill={color} fontFamily="Georgia, serif">
        {children}
      </text>
    </g>
  );
}
