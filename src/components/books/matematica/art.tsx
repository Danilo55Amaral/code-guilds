"use client";

import type { ReactNode } from "react";

// ============================================================================
// PEÇAS DE DESENHO DO LIVRO DE MATEMÁTICA — o que mais de um capítulo usa: o
// quadro-negro, o papel quadriculado, o dado, a moeda e a moldura das figuras
// de tocar (o painel e os botões na cor do livro).
// ============================================================================

/** A cor do livro (a do tomo de Matemática) e a mais escura, pros textos. */
export const MATH = "#7c3aed";
export const MATH_DARK = "#3b0764";

/** O quadro-negro com a moldura de madeira (o canto em x, y). */
export function Chalkboard({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children?: ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} rx="8" fill="#92400e" />
      <rect x="8" y="8" width={w - 16} height={h - 16} rx="4" fill="#14532d" />
      <rect x="8" y="8" width={w - 16} height={h - 16} rx="4" fill="none" stroke="#166534" strokeWidth="3" />
      <rect x={w * 0.62} y={h - 6} width={w * 0.18} height="6" rx="2" fill="#f5f5f4" />
      {children}
    </g>
  );
}

/** O papel quadriculado (o canto em x, y), com quadradinhos de `step`. */
export function GraphPaper({ x, y, w, h, step = 20 }: { x: number; y: number; w: number; h: number; step?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} fill="#fff" />
      {Array.from({ length: Math.floor(w / step) + 1 }, (_, i) => (
        <line key={`v${i}`} x1={i * step} y1="0" x2={i * step} y2={h} stroke="#dbeafe" strokeWidth="1" />
      ))}
      {Array.from({ length: Math.floor(h / step) + 1 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * step} x2={w} y2={i * step} stroke="#dbeafe" strokeWidth="1" />
      ))}
    </g>
  );
}

// As bolinhas de cada face do dado, numa grade de 3×3 (-1, 0, 1).
const PIPS: Record<number, [number, number][]> = {
  1: [[0, 0]],
  2: [[-1, -1], [1, 1]],
  3: [[-1, -1], [0, 0], [1, 1]],
  4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
  6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]],
};

/** Um dado mostrando a face `n` (o centro em x, y; `s` é o lado). */
export function Die({ x, y, n, s = 40, color = "#fff" }: { x: number; y: number; n: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-s / 2} y={-s / 2} width={s} height={s} rx={s * 0.18} fill={color} stroke="#1e293b" strokeWidth="2" />
      {PIPS[n].map(([px, py], i) => (
        <circle key={i} cx={px * s * 0.27} cy={py * s * 0.27} r={s * 0.085} fill="#1e293b" />
      ))}
    </g>
  );
}

/** Uma moeda de cara ou coroa (o centro em x, y). */
export function Coin({ x, y, r = 22, face = "cara" }: { x: number; y: number; r?: number; face?: "cara" | "coroa" }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="#fbbf24" stroke="#b45309" strokeWidth="3" />
      <circle r={r * 0.78} fill="none" stroke="#b45309" strokeWidth="1.5" strokeDasharray="3 2" />
      <text y={r * 0.22} textAnchor="middle" fontSize={r * 0.62} fontWeight="900" fill="#78350f" fontFamily="Georgia, serif">
        {face === "cara" ? "☺" : "★"}
      </text>
    </g>
  );
}

/** A moldura das figuras de tocar. */
export function Panel({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      {title && <p className="mb-[0.3em] text-center text-[0.78em] font-bold uppercase tracking-wider text-[#8a7146]">{title}</p>}
      {children}
    </div>
  );
}

/** Um botão pequeno das figuras de tocar (aceso quando `on`). */
export function Pill({ on = false, onClick, children, color = MATH }: { on?: boolean; onClick: () => void; children: ReactNode; color?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border px-[0.7em] py-[0.1em] text-[0.82em] font-bold transition-colors"
      style={on ? { background: color, borderColor: color, color: "#fff" } : { background: "#fff", borderColor: "#d9c79d", color: "#3b2a14" }}
    >
      {children}
    </button>
  );
}

/** Um controle deslizante com o rótulo e o valor. */
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix = "",
  labelWidth = "5.5em",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  suffix?: string;
  labelWidth?: string;
}) {
  return (
    <label className="flex items-center gap-[0.5em] text-[0.82em] font-bold text-[#3b2a14]">
      <span className="shrink-0" style={{ width: labelWidth }}>
        {label}
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="min-w-0 flex-1 accent-[#7c3aed]" />
      <span className="w-[3.2em] shrink-0 text-right tabular-nums" style={{ color: MATH_DARK }}>
        {value.toLocaleString("pt-BR")}
        {suffix}
      </span>
    </label>
  );
}
