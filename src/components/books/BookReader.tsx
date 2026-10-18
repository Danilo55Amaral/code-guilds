"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Cinzel, Lora } from "next/font/google";
import { TOME_STYLE } from "@/components/library/SubjectTome";
import { isSoundMuted, playBookOpen, playPageTurn } from "@/engine/sfx";
import { BookNavContext } from "./BookParts";
import type { BookContent, BookInfo, BookPage } from "./types";

// ============================================================================
// O LIVRO ABERTO — a tela cheia de leitura da Biblioteca Virtual. Na tela
// larga o livro abre em duas páginas (como um livro de verdade em cima da
// mesa); no celular e na tela em pé, uma página por vez. Os três botões:
// ◀ página anterior, próxima página ▶ e ✕ fechar o livro (também dá pra usar
// as setas do teclado, o Esc e arrastar o dedo pro lado). A página vira em 3D
// pela lombada, com o som do papel. O sumário leva direto pra cada capítulo.
// ============================================================================

const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "700"], style: ["normal", "italic"], display: "swap", variable: "--cg-font-book" });
const cinzel = Cinzel({ subsets: ["latin"], weight: ["700", "900"], display: "swap", variable: "--cg-font-book-title" });

/** quanto dura a virada da página (duas páginas) e a da folha sozinha (uma página) */
const FLIP_MS = 800;
const PEEL_MS = 600;

interface Flip {
  dir: 1 | -1;
  from: number;
  to: number;
}

function useMedia(query: string): boolean {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return match;
}

/** Uma folha do livro: o papel, o cabeçalho com o capítulo, o conteúdo (rola se não couber) e o número da página. */
function Sheet({ page, index, side, info }: { page: BookPage | undefined; index: number; side: "left" | "right" | "single"; info: BookInfo }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState(false);

  // a setinha "role pra ver mais" só aparece quando o conteúdo passa do tamanho da página
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => setMore(el.scrollHeight - el.scrollTop - el.clientHeight > 8);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    el.addEventListener("scroll", check, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", check);
    };
  }, [page]);

  // a sombra da lombada fica do lado de dentro de cada página
  const spine =
    side === "left"
      ? "linear-gradient(to left, rgba(92,64,24,0.32) 0%, rgba(92,64,24,0.1) 3.5%, rgba(92,64,24,0) 9%)"
      : side === "right"
        ? "linear-gradient(to right, rgba(92,64,24,0.32) 0%, rgba(92,64,24,0.1) 3.5%, rgba(92,64,24,0) 9%)"
        : "linear-gradient(to right, rgba(92,64,24,0.22) 0%, rgba(92,64,24,0) 5%)";
  const paper: CSSProperties = {
    background: `${spine}, radial-gradient(120% 90% at 50% 40%, #fffaf0 0%, #fbf3dc 70%, #f3e5bf 100%)`,
    borderRadius: side === "left" ? "6px 0 0 6px" : side === "right" ? "0 6px 6px 0" : "4px 6px 6px 4px",
  };

  if (!page) {
    // depois da última página: o verso da capa
    return <div className="h-full w-full" style={{ ...paper, background: "linear-gradient(135deg, #f3e5bf, #e9d6a6)" }} />;
  }
  const chapter = page.chapter ? info.chapters[page.chapter - 1] : undefined;
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden text-[#2b2113]" style={paper}>
      {!page.bare && (
        <header className={`flex shrink-0 items-center gap-2 px-[6%] pt-[2.2%] text-[0.7em] font-bold uppercase tracking-[0.18em] text-[#8a7146] ${side === "left" ? "" : "flex-row-reverse"}`}>
          <span className="truncate">{chapter ? `${page.chapter}. ${chapter.title}` : info.title}</span>
          <span className="h-px flex-1 bg-[#cdb98a]" />
          <span style={{ color: "var(--bk-accent)" }}>✦</span>
        </header>
      )}
      <div ref={scrollRef} className="cg-book-scroll relative min-h-0 flex-1 overflow-y-auto px-[6%] pb-[1%] pt-[2.4%]">
        <div>{page.content}</div>
      </div>
      {more && (
        <div className="pointer-events-none absolute inset-x-0 bottom-[1.8em] flex justify-center">
          <span className="cg-anim-float rounded-full bg-[#3b2a14]/80 px-3 py-0.5 text-[0.7em] font-bold text-amber-50 shadow">▼ role para ver mais</span>
        </div>
      )}
      {!page.bare && (
        <footer className="flex shrink-0 items-center justify-center gap-2 pb-[1.8%] pt-[0.6%] text-[0.75em] font-bold text-[#8a7146]">
          <span className="h-px w-8 bg-[#cdb98a]" />
          <span className="cg-book-title">{index + 1}</span>
          <span className="h-px w-8 bg-[#cdb98a]" />
        </footer>
      )}
    </div>
  );
}

/** As duas faces da folha que está virando (a frente e o verso) e a sombra que passa por ela. */
function Leaf({ front, back, className, style }: { front: React.ReactNode; back: React.ReactNode; className: string; style: CSSProperties }) {
  return (
    <div className={`cg-book-leaf ${className}`} style={style}>
      <div className="cg-book-face">
        {front}
        <div className="cg-book-shade pointer-events-none absolute inset-0" />
      </div>
      <div className="cg-book-face cg-book-face-back">
        {back}
        <div className="cg-book-shade pointer-events-none absolute inset-0" />
      </div>
    </div>
  );
}

export default function BookReader({
  info,
  load,
  startPage = 0,
  onClose,
  onPageChange,
}: {
  info: BookInfo;
  load: () => Promise<BookContent>;
  startPage?: number;
  onClose: () => void;
  /** a página aberta (pra continuar de onde parou da próxima vez) */
  onPageChange?: (page: number) => void;
}) {
  const [book, setBook] = useState<BookContent | null>(null);
  const [failed, setFailed] = useState(false);
  const [page, setPage] = useState(startPage);
  const [flip, setFlip] = useState<Flip | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const flipping = useRef(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const spread = useMedia("(min-width: 1024px) and (min-aspect-ratio: 1/1)");
  const reduced = useMedia("(prefers-reduced-motion: reduce)");

  const style = TOME_STYLE[info.subject];
  const pages = book?.pages ?? [];
  const last = Math.max(0, pages.length - 1);
  const step = spread ? 2 : 1;
  /** a primeira página que aparece (na tela larga, sempre a da esquerda: par) */
  const base = spread ? page - (page % 2) : page;
  const lastBase = spread ? last - (last % 2) : last;

  // as páginas onde cada capítulo começa (pro sumário)
  const chapterStart = useMemo(() => info.chapters.map((_, i) => Math.max(0, pages.findIndex((p) => p.chapter === i + 1))), [info.chapters, pages]);

  useEffect(() => {
    let alive = true;
    load()
      .then((b) => {
        if (!alive) return;
        setBook(b);
        setPage((p) => Math.min(p, b.pages.length - 1));
        if (!isSoundMuted()) playBookOpen();
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [load]);

  useEffect(() => {
    if (book) onPageChange?.(base);
  }, [base, book, onPageChange]);

  /** vai pra página `target` virando a folha (ou direto, pra quem pediu menos movimento) */
  const goTo = useCallback(
    (target: number) => {
      if (flipping.current || !pages.length) return;
      const to = Math.max(0, Math.min(spread ? lastBase : last, spread ? target - (target % 2) : target));
      if (to === base) return;
      if (!isSoundMuted()) playPageTurn();
      if (reduced) {
        setPage(to);
        return;
      }
      flipping.current = true;
      setFlip({ dir: to > base ? 1 : -1, from: base, to });
      window.setTimeout(
        () => {
          setPage(to);
          setFlip(null);
          flipping.current = false;
        },
        spread ? FLIP_MS : PEEL_MS,
      );
    },
    [pages.length, spread, lastBase, last, base, reduced],
  );
  const next = useCallback(() => goTo(base + step), [goTo, base, step]);
  const prev = useCallback(() => goTo(base - step), [goTo, base, step]);

  const close = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    onClose();
  }, [onClose]);

  // teclado: setas viram a página, Esc fecha
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight" || e.key === "PageDown") next();
      else if (e.key === "ArrowLeft" || e.key === "PageUp") prev();
      else return;
      e.preventDefault();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close, next, prev]);

  // a página de trás não rola enquanto o livro está aberto
  useEffect(() => {
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    rootRef.current?.focus();
    setCanFullscreen(!!document.fullscreenEnabled);
    const onFs = () => setFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      document.body.style.overflow = before;
      document.removeEventListener("fullscreenchange", onFs);
    };
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else rootRef.current?.requestFullscreen().catch(() => {});
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 60 && Math.abs(dy) < 50) {
      if (dx < 0) next();
      else prev();
    }
  };

  const sheet = (i: number, side: "left" | "right" | "single") => <Sheet key={`${side}-${i}`} page={pages[i]} index={i} side={side} info={info} />;

  // o que fica embaixo da folha que vira (já com as páginas de destino) e a folha virando
  let left = base;
  let right = base + 1;
  if (flip && spread) {
    left = flip.dir === 1 ? flip.from : flip.to;
    right = flip.dir === 1 ? flip.to + 1 : flip.from + 1;
  }
  const single = flip && !spread ? (flip.dir === 1 ? flip.to : flip.from) : base;

  const visibleChapter = pages[base]?.chapter ?? pages[base + 1]?.chapter;
  const chapter = visibleChapter ? info.chapters[visibleChapter - 1] : undefined;
  const atStart = base <= 0;
  const atEnd = base >= (spread ? lastBase : last);
  const shown = spread && base + 1 <= last ? `Páginas ${base + 1} e ${base + 2}` : `Página ${base + 1}`;

  // as cores do livro (a capa, os títulos e os boxes saem da cor da matéria)
  const vars = {
    "--bk-accent": style.color,
    "--bk-dark": style.dark,
    "--bk-tint": `${style.glow}22`,
    "--bk-line": `${style.glow}66`,
    "--bk-fs": spread ? "clamp(13.5px, calc(0.55rem + 0.8vh), 17.5px)" : "clamp(14px, calc(0.6rem + 0.6vh), 17px)",
  } as CSSProperties;
  const nav = useMemo(() => ({ info, chapterStart, goTo }), [info, chapterStart, goTo]);
  const tocPage = pages.findIndex((p) => p.toc);

  return (
    <BookNavContext.Provider value={nav}>
    <div
      ref={rootRef}
      tabIndex={-1}
      lang="pt-BR"
      role="dialog"
      aria-modal="true"
      aria-label={`Livro: ${info.title}`}
      className={`cg-dark-scope fixed inset-0 z-[55] flex flex-col overflow-hidden outline-none ${lora.variable} ${cinzel.variable}`}
      style={{
        ...vars,
        background: "radial-gradient(70% 60% at 50% 45%, #3a2412 0%, #1d1108 60%, #0b0704 100%)",
      }}
    >
      {/* a luz das velas nos cantos e a poeirinha no ar */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="cg-anim-glow-pulse absolute -left-24 -top-24 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="cg-anim-glow-pulse absolute -bottom-24 -right-24 h-80 w-80 rounded-full blur-3xl" style={{ background: `${style.glow}33`, animationDelay: "1.4s" }} />
        {Array.from({ length: 18 }, (_, i) => (
          <span
            key={i}
            className="cg-anim-twinkle absolute h-1 w-1 rounded-full bg-amber-200"
            style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`, animationDelay: `${(i % 7) * 0.4}s` }}
          />
        ))}
      </div>

      {/* o topo: o livro, o capítulo aberto e o botão de fechar */}
      <div className="relative z-10 flex shrink-0 items-center gap-2 px-3 py-2 sm:px-5">
        <span className="text-xl" aria-hidden="true">
          📖
        </span>
        <div className="min-w-0 flex-1">
          <p className="cg-book-title truncate text-sm font-black text-amber-100 sm:text-base">{info.title}</p>
          <p className="truncate text-[11px] text-amber-200/70 sm:text-xs">{chapter ? `Capítulo ${visibleChapter}: ${chapter.title}` : info.subtitle}</p>
        </div>
        {tocPage >= 0 && (
          <button
            type="button"
            onClick={() => goTo(tocPage)}
            className="hidden rounded-full border border-amber-300/30 bg-black/30 px-3 py-1.5 text-xs font-bold text-amber-100 transition-colors hover:bg-amber-400/20 sm:block"
          >
            ☰ Sumário
          </button>
        )}
        {canFullscreen && (
          <button
            type="button"
            onClick={toggleFullscreen}
            title={fullscreen ? "Sair da tela cheia" : "Tela cheia"}
            aria-label={fullscreen ? "Sair da tela cheia" : "Tela cheia"}
            className="hidden h-8 w-8 items-center justify-center rounded-full border border-amber-300/30 bg-black/30 text-amber-100 transition-colors hover:bg-amber-400/20 sm:flex"
          >
            {fullscreen ? "🗗" : "⛶"}
          </button>
        )}
        <button
          type="button"
          onClick={close}
          className="rounded-full border border-rose-300/50 bg-rose-500/20 px-3 py-1.5 text-xs font-black text-rose-50 shadow-lg transition-colors hover:bg-rose-500/40 sm:px-4 sm:text-sm"
        >
          ✕ Fechar o livro
        </button>
      </div>

      {/* o livro */}
      <div className="relative z-10 flex min-h-0 flex-1 items-stretch justify-center px-2 pb-1 sm:px-6" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {!book ? (
          <div className="flex flex-col items-center justify-center gap-3 text-amber-100">
            {failed ? (
              <>
                <p className="text-sm">Não deu pra abrir o livro agora. Confira a internet e tente de novo.</p>
                <button type="button" onClick={close} className="cg-btn-secondary">
                  Voltar pra biblioteca
                </button>
              </>
            ) : (
              <>
                <span className="cg-anim-float text-5xl">📖</span>
                <p className="cg-book-title text-sm font-bold">Abrindo o livro…</p>
              </>
            )}
          </div>
        ) : (
          <div
            className="cg-anim-book-in relative flex w-full rounded-[14px] p-[clamp(5px,1.1vh,12px)]"
            style={{
              maxWidth: spread ? 1560 : 760,
              background: `linear-gradient(135deg, ${style.color} 0%, ${style.dark} 55%, ${style.dark} 100%)`,
              boxShadow: `0 30px 80px -20px rgba(0,0,0,0.9), 0 0 60px -20px ${style.glow}, inset 0 0 0 2px rgba(253,230,138,0.35)`,
              fontSize: "var(--bk-fs)",
              fontFamily: "var(--cg-font-book), Georgia, serif",
            }}
          >
            {/* a fitinha marcadora pendurada em cima */}
            <span className="absolute -bottom-3 left-[calc(50%+18px)] z-20 h-10 w-3 rounded-b-sm shadow" style={{ background: "#b91c1c", clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)" }} aria-hidden="true" />
            <div className="cg-book-scene relative flex min-h-0 w-full">
              {spread ? (
                <>
                  <div className="relative h-full w-1/2" style={{ boxShadow: "-3px 0 0 #efe0b6, -5px 0 0 #dcc795, -7px 0 0 #efe0b6" }}>
                    {sheet(left, "left")}
                  </div>
                  <div className="relative h-full w-1/2" style={{ boxShadow: "3px 0 0 #efe0b6, 5px 0 0 #dcc795, 7px 0 0 #efe0b6" }}>
                    {sheet(right, "right")}
                  </div>
                  {/* a dobra do meio */}
                  <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-6 -translate-x-1/2" style={{ background: "linear-gradient(to right, transparent, rgba(60,40,15,0.28) 45%, rgba(60,40,15,0.35) 50%, rgba(60,40,15,0.28) 55%, transparent)" }} />
                  {flip && (
                    <Leaf
                      className={flip.dir === 1 ? "cg-book-turn-next" : "cg-book-turn-prev"}
                      style={flip.dir === 1 ? { left: "50%", width: "50%", transformOrigin: "0% 50%" } : { left: 0, width: "50%", transformOrigin: "100% 50%" }}
                      front={flip.dir === 1 ? sheet(flip.from + 1, "right") : sheet(flip.from, "left")}
                      back={flip.dir === 1 ? sheet(flip.to, "left") : sheet(flip.to + 1, "right")}
                    />
                  )}
                </>
              ) : (
                <>
                  <div className="relative h-full w-full" style={{ boxShadow: "3px 0 0 #efe0b6, 5px 0 0 #dcc795" }}>
                    {sheet(single, "single")}
                  </div>
                  {flip && (
                    <div
                      className={`cg-book-leaf ${flip.dir === 1 ? "cg-book-peel-next" : "cg-book-peel-prev"}`}
                      style={{ left: 0, width: "100%", transformOrigin: "0% 50%" }}
                    >
                      <div className="cg-book-face">
                        {sheet(flip.dir === 1 ? flip.from : flip.to, "single")}
                        <div className="cg-book-shade pointer-events-none absolute inset-0" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* embaixo: página anterior, onde o aluno está e próxima página */}
      {book && (
          <div className="relative z-10 flex shrink-0 items-center gap-2 px-3 pb-3 pt-2 sm:gap-4 sm:px-6">
            <button
              type="button"
              onClick={prev}
              disabled={atStart}
              className="rounded-full border border-amber-300/50 bg-gradient-to-b from-amber-700 to-amber-900 px-3 py-2 text-xs font-black text-amber-50 shadow-lg transition-transform enabled:hover:-translate-x-0.5 disabled:opacity-35 sm:px-5 sm:text-sm"
            >
              ❮ <span className="hidden sm:inline">Página anterior</span>
              <span className="sm:hidden">Anterior</span>
            </button>
            <div className="min-w-0 flex-1 text-center">
              <p className="text-[11px] font-semibold text-amber-100/90 sm:text-xs">
                {shown} de {pages.length}
              </p>
              <div className="mx-auto mt-1 h-1.5 max-w-md overflow-hidden rounded-full bg-black/50">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${((Math.min(last, base + step - 1) + 1) / pages.length) * 100}%`, background: style.glow }} />
              </div>
            </div>
            <button
              type="button"
              onClick={next}
              disabled={atEnd}
              className="rounded-full border border-amber-300/50 bg-gradient-to-b from-amber-500 to-amber-700 px-3 py-2 text-xs font-black text-amber-950 shadow-lg transition-transform enabled:hover:translate-x-0.5 disabled:opacity-35 sm:px-5 sm:text-sm"
            >
              <span className="hidden sm:inline">Próxima página</span>
              <span className="sm:hidden">Próxima</span> ❯
            </button>
          </div>
      )}
    </div>
    </BookNavContext.Provider>
  );
}
