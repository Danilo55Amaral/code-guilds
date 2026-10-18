"use client";

import BookCover, { COVER_LABEL } from "./BookCover";
import { TOME_STYLE } from "./SubjectTome";
import type { Subject } from "@/engine/subjects";
import type { BookInfo } from "@/components/books/types";

// ============================================================================
// UM LIVRO NA ESTANTE DA BIBLIOTECA VIRTUAL — a capa flutuando em cima da
// prateleira de madeira, com o brilho da cor da matéria. Tocar na capa abre a
// ficha do livro (os capítulos); o botão "Abrir o livro" já abre a leitura
// (ou continua da página onde o aluno parou). Matéria que ainda não tem livro
// fica apagada, com a fita "Em breve".
// ============================================================================

export default function BookCard({
  subject,
  info,
  savedPage,
  onOpen,
  onDetails,
  delay = 0,
}: {
  subject: Subject;
  info?: BookInfo;
  /** a página onde o aluno parou (undefined = ainda não abriu) */
  savedPage?: number;
  onOpen: () => void;
  onDetails: () => void;
  delay?: number;
}) {
  const style = TOME_STYLE[subject.id];
  const ready = !!info;
  const reading = ready && savedPage !== undefined && savedPage > 0;
  // a letra do nome acompanha a largura da capa e encolhe até a palavra mais comprida caber
  const room = 100 - parseFloat(COVER_LABEL.left) - parseFloat(COVER_LABEL.right);
  const longest = Math.max(...subject.name.split(/\s+/).map((w) => w.length));
  const fit = Math.min(9, room / (0.8 * longest));

  return (
    <div
      className="cg-dark-scope cg-anim-pop group relative flex flex-col rounded-3xl border p-3 sm:p-4"
      style={{
        animationDelay: `${delay}s`,
        background: "linear-gradient(180deg, rgba(41,24,12,0.95) 0%, rgba(20,12,6,0.98) 100%)",
        borderColor: ready ? `${style.glow}55` : "rgba(100,116,139,0.35)",
        boxShadow: ready ? `0 18px 50px -28px ${style.glow}` : undefined,
      }}
    >
      <button
        type="button"
        onClick={ready ? onDetails : undefined}
        disabled={!ready}
        aria-label={ready ? `Ver o livro de ${subject.name}` : `${subject.name}: em breve`}
        className={`relative mx-auto block aspect-[200/270] w-full max-w-[200px] ${ready ? "cursor-pointer" : "cursor-default"}`}
        style={{ containerType: "inline-size", perspective: "800px" }}
      >
        <div className="cg-anim-glow-pulse pointer-events-none absolute inset-[14%] rounded-full blur-2xl" style={{ background: style.glow, opacity: ready ? 0.45 : 0.1, animationDelay: `${delay}s` }} />
        <div className="cg-anim-float h-full" style={{ animationDelay: `${delay * 1.7}s` }}>
          <div className={`relative h-full transition-transform duration-500 [transform-style:preserve-3d] ${ready ? "group-hover:[transform:rotateY(-16deg)_translateY(-6px)_scale(1.04)]" : "grayscale-[0.7]"}`}>
            <BookCover id={subject.id} className="h-full w-full" />
            <div
              lang="pt-BR"
              className="absolute flex items-center justify-center text-center font-serif font-black uppercase leading-tight text-amber-100"
              style={{
                left: COVER_LABEL.left,
                right: COVER_LABEL.right,
                top: COVER_LABEL.top,
                bottom: COVER_LABEL.bottom,
                textShadow: "0 1px 0 #000, 0 0 10px rgba(0,0,0,0.8)",
                fontSize: `clamp(8px, ${fit.toFixed(2)}cqw, 16px)`,
                overflowWrap: "break-word",
              }}
            >
              {subject.name}
            </div>
          </div>
        </div>
        {!ready && (
          <span className="absolute -right-1 top-3 rotate-6 rounded-md border border-slate-500/70 bg-slate-800/90 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-200">
            Em breve
          </span>
        )}
        {reading && (
          <span className="absolute -right-1 top-3 rotate-6 rounded-md border border-amber-300/80 bg-gradient-to-r from-amber-500 to-yellow-300 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-950 shadow-lg">
            🔖 Lendo
          </span>
        )}
      </button>

      {/* a prateleira */}
      <div className="relative -mx-1 mt-1 h-3 rounded-sm shadow-[0_6px_10px_-4px_rgba(0,0,0,0.8)]" style={{ background: "linear-gradient(180deg, #8b5a2b 0%, #5c3a1a 60%, #3b2410 100%)" }} aria-hidden="true" />

      <div className="mt-3 flex flex-1 flex-col">
        <p className="line-clamp-2 min-h-[2rem] text-center text-[11px] leading-snug text-amber-100/70">{ready ? info.subtitle : subject.tagline}</p>
        <p className="mt-1 text-center text-[11px] font-semibold text-amber-50/90">
          {ready ? (reading ? `🔖 Você parou na página ${savedPage + 1}` : `📑 ${info.chapters.length} capítulos ilustrados`) : "O livro está sendo escrito"}
        </p>
        {ready ? (
          <button
            type="button"
            onClick={onOpen}
            className="mt-3 rounded-full border border-amber-300/50 bg-amber-400/15 py-1.5 text-center text-xs font-bold text-amber-100 transition-colors hover:bg-amber-400/30"
          >
            {reading ? "📖 Continuar a leitura" : "📖 Abrir o livro"}
          </button>
        ) : (
          <span className="mt-3 rounded-full border border-slate-600/50 bg-slate-800/40 py-1.5 text-center text-xs font-bold text-slate-400">🔒 Em breve</span>
        )}
      </div>
    </div>
  );
}
