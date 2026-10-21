"use client";

import { useState } from "react";

// ============================================================================
// PEÇAS DO LIVRO DE INGLÊS — o que mais de um capítulo usa: o botão que fala a
// palavra em inglês (a voz do próprio navegador, sem internet) e as cartas de
// virar (o inglês na frente, o português atrás).
// ============================================================================

/** A cor do livro (a do tomo de Inglês) e o azul-marinho dos títulos. */
export const ENG = "#dc2626";
export const ENG_DARK = "#1e3a8a";

/** Fala o texto em inglês com a voz do navegador (se ele tiver). */
export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

/** O botãozinho 🔊 que lê o texto em inglês. */
export function Say({ text }: { text: string }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
      title={`Ouvir: ${text}`}
      aria-label={`Ouvir: ${text}`}
      className="ml-[0.2em] inline-flex h-[1.4em] w-[1.4em] shrink-0 items-center justify-center rounded-full border border-[#bfdbfe] bg-white align-middle text-[0.8em] transition-transform hover:scale-110"
    >
      🔊
    </button>
  );
}

/** Uma palavra em inglês com o botão de ouvir do lado. */
export function En({ children }: { children: string }) {
  return (
    <span className="whitespace-nowrap">
      <em className="font-bold not-italic" style={{ color: ENG_DARK }}>
        {children}
      </em>
      <Say text={children} />
    </span>
  );
}

/**
 * As cartas de virar: na frente a palavra em inglês (com o botão de ouvir), atrás a tradução.
 * `cols` é quantas cartas por linha.
 */
export function WordCards({ items, cols = 4, title }: { items: [string, string, string?][]; cols?: number; title?: string }) {
  const [open, setOpen] = useState<boolean[]>(() => items.map(() => false));
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.5em]">
      {title && <p className="mb-[0.3em] text-center text-[0.78em] font-bold uppercase tracking-wider text-[#8a7146]">{title}</p>}
      <div className="grid gap-[0.3em]" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {items.map(([en, pt, icon], i) => (
          <div
            key={en}
            role="button"
            tabIndex={0}
            onClick={() => setOpen((o) => o.map((v, j) => (j === i ? !v : v)))}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setOpen((o) => o.map((v, j) => (j === i ? !v : v)));
            }}
            className="flex min-h-[2.6em] cursor-pointer flex-col items-center justify-center rounded-lg border px-[0.2em] py-[0.2em] text-center leading-tight shadow-sm transition-colors"
            style={open[i] ? { background: "#fef3c7", borderColor: "#f59e0b" } : { background: "#fff", borderColor: "#bfdbfe" }}
          >
            {open[i] ? (
              <span key="pt" className="cg-anim-fade text-[0.85em] font-bold text-[#78350f]">
                {pt}
              </span>
            ) : (
              <span key="en" className="cg-anim-fade flex items-center text-[0.85em] font-black" style={{ color: ENG_DARK }}>
                {icon && <span className="mr-[0.2em]">{icon}</span>}
                {en}
                <Say text={en} />
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="mt-[0.25em] text-center text-[0.72em] text-[#8a7146]">Toque na carta pra ver a tradução; no 🔊 pra ouvir.</p>
    </div>
  );
}
