"use client";

import { useEffect } from "react";
import BookCover, { COVER_LABEL } from "./BookCover";
import { TOME_STYLE } from "./SubjectTome";
import type { Subject } from "@/engine/subjects";
import type { BookInfo } from "@/components/books/types";

// ============================================================================
// A FICHA DO LIVRO — abre ao tocar na capa, na estante da Biblioteca Virtual:
// a capa grande, o título, os capítulos e os botões de abrir o livro do
// começo ou continuar da página onde o aluno parou. Fecha no ✕, no Esc ou
// tocando fora.
// ============================================================================

export default function BookDetails({
  subject,
  info,
  savedPage,
  onOpen,
  onClose,
}: {
  subject: Subject;
  info: BookInfo;
  savedPage?: number;
  onOpen: (page: number) => void;
  onClose: () => void;
}) {
  const style = TOME_STYLE[subject.id];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="cg-dark-scope fixed inset-0 z-50 flex overflow-y-auto bg-black/80 p-4 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-label={info.title}>
      <div
        className="cg-anim-pop relative m-auto w-full max-w-3xl overflow-hidden rounded-3xl border p-5 sm:p-7"
        onClick={(e) => e.stopPropagation()}
        style={{
          borderColor: `${style.glow}66`,
          background: `radial-gradient(60% 50% at 20% 30%, ${style.glow}33, transparent 70%), linear-gradient(160deg, #1f1209 0%, #120a05 100%)`,
          boxShadow: `0 30px 80px -30px ${style.glow}`,
        }}
      >
        <button type="button" onClick={onClose} aria-label="Fechar" className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-lg text-amber-100 hover:bg-black/60">
          ✕
        </button>
        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="relative mx-auto aspect-[200/270] w-40 shrink-0 sm:w-48" style={{ containerType: "inline-size" }}>
            <div className="cg-anim-float h-full">
              <BookCover id={subject.id} className="h-full w-full" />
              <div
                lang="pt-BR"
                className="absolute flex items-center justify-center text-center font-serif font-black uppercase leading-tight text-amber-100"
                style={{ left: COVER_LABEL.left, right: COVER_LABEL.right, top: COVER_LABEL.top, bottom: COVER_LABEL.bottom, textShadow: "0 1px 0 #000", fontSize: "clamp(8px, 8cqw, 16px)" }}
              >
                {subject.name}
              </div>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200">📚 Biblioteca Virtual</p>
            <h2 className="mt-1 font-serif text-2xl font-black text-amber-50 sm:text-3xl">{info.title}</h2>
            <p className="mt-1 text-sm text-amber-100/75">{info.subtitle}</p>
            <ol className="mt-4 grid gap-1.5 sm:grid-cols-2">
              {info.chapters.map((c, i) => (
                <li key={c.title} className="flex items-start gap-2 rounded-xl border border-amber-200/10 bg-black/25 px-2.5 py-1.5 text-xs text-amber-50/90">
                  <span className="text-base leading-none">{c.icon}</span>
                  <span>
                    <span className="font-bold text-amber-100">
                      {i + 1}. {c.title}
                    </span>
                    <span className="block text-[11px] leading-snug text-amber-100/60">{c.summary}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-5 flex flex-wrap gap-2">
              {savedPage !== undefined && savedPage > 0 && (
                <button type="button" onClick={() => onOpen(savedPage)} className="rounded-full bg-gradient-to-b from-amber-400 to-amber-600 px-5 py-2.5 text-sm font-black text-amber-950 shadow-lg transition-transform hover:scale-[1.03]">
                  🔖 Continuar da página {savedPage + 1}
                </button>
              )}
              <button
                type="button"
                onClick={() => onOpen(0)}
                className={`rounded-full px-5 py-2.5 text-sm font-black shadow-lg transition-transform hover:scale-[1.03] ${savedPage ? "border border-amber-300/50 bg-black/30 text-amber-100" : "bg-gradient-to-b from-amber-400 to-amber-600 text-amber-950"}`}
              >
                📖 {savedPage ? "Abrir do começo" : "Abrir o livro"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
