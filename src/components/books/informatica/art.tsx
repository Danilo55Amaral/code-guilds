"use client";

import type { ReactNode } from "react";

// ============================================================================
// AS PEÇAS DO LIVRO DE INFORMÁTICA — as cores do livro, o painel das figuras
// de tocar, os botões, o controle deslizante, a tecla de teclado, a janela de
// programa (com a barra de título) e, em SVG, o monitor, o notebook e o
// servidor, que vários capítulos usam.
// ============================================================================

export const INF = "#0f766e";
export const INF_DARK = "#134e4a";

/** A moldura das figuras de tocar, com o título em cima. */
export function Panel({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      {title && <p className="mb-[0.3em] text-center text-[0.78em] font-bold uppercase tracking-wider text-[#8a7146]">{title}</p>}
      {children}
    </div>
  );
}

/** Um botão pequeno das figuras de tocar (aceso quando `on`). */
export function Pill({ on = false, onClick, children, color = INF }: { on?: boolean; onClick: () => void; children: ReactNode; color?: string }) {
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
  format,
  labelWidth = "5.5em",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  labelWidth?: string;
}) {
  return (
    <label className="flex items-center gap-[0.5em] text-[0.82em] font-bold text-[#3b2a14]">
      <span className="shrink-0" style={{ width: labelWidth }}>
        {label}
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="min-w-0 flex-1 accent-[#0f766e]" />
      <span className="w-[3.6em] shrink-0 text-right tabular-nums" style={{ color: INF_DARK }}>
        {format ? format(value) : value.toLocaleString("pt-BR")}
      </span>
    </label>
  );
}

/** Uma tecla de teclado (aceita `on` para ficar apertada). Sem `onClick` é só o desenho da tecla (pode ficar dentro de outro botão). */
export function Key({ children, on = false, wide = false, onClick }: { children: ReactNode; on?: boolean; wide?: boolean; onClick?: () => void }) {
  const className = `inline-flex h-[2em] items-center justify-center rounded-md border-b-[3px] px-[0.5em] font-mono text-[0.78em] font-bold transition-all ${wide ? "min-w-[4.2em]" : "min-w-[2em]"}`;
  const style = on
    ? { background: INF, borderColor: INF_DARK, color: "#fff", transform: "translateY(2px)" }
    : { background: "#f8fafc", borderColor: "#94a3b8", color: "#1e293b", boxShadow: "0 1px 0 #cbd5e1" };
  if (!onClick) {
    return (
      <span className={className} style={style}>
        {children}
      </span>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className} style={style}>
      {children}
    </button>
  );
}

/** Uma janela de programa, com a barra de título e os três botões. */
export function AppWindow({ title, icon, children, color = "#1e3a8a" }: { title: string; icon?: string; children: ReactNode; color?: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#94a3b8] bg-white shadow-md">
      <div className="flex items-center gap-[0.4em] px-[0.5em] py-[0.15em] text-[0.74em] font-bold text-white" style={{ background: color }}>
        {icon && <span>{icon}</span>}
        <span className="flex-1 truncate">{title}</span>
        <span className="opacity-80">— ▢ ✕</span>
      </div>
      <div className="p-[0.5em] text-[#1e293b]">{children}</div>
    </div>
  );
}

/** Um monitor de computador (o meio da base em x, y), com a tela de `screen`. */
export function Monitor({ x, y, w = 160, screen = "#38bdf8", children }: { x: number; y: number; w?: number; screen?: string; children?: ReactNode }) {
  const h = w * 0.62;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2} y={-h - 30} width={w} height={h} rx="8" fill="#1e293b" />
      <rect x={-w / 2 + 6} y={-h - 24} width={w - 12} height={h - 12} rx="4" fill={screen} />
      <g transform={`translate(0 ${-h / 2 - 30})`}>{children}</g>
      <rect x="-10" y="-30" width="20" height="22" fill="#475569" />
      <rect x="-40" y="-10" width="80" height="10" rx="4" fill="#475569" />
    </g>
  );
}

/** Um servidor de data center (o canto em x, y), com as luzinhas piscando. */
export function ServerRack({ x, y, h = 120 }: { x: number; y: number; h?: number }) {
  const units = Math.floor(h / 20);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="60" height={h} rx="4" fill="#1e293b" stroke="#475569" strokeWidth="2" />
      {Array.from({ length: units }, (_, i) => (
        <g key={i} transform={`translate(6 ${6 + i * 20})`}>
          <rect width="48" height="14" rx="2" fill="#334155" />
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={8 + k * 8} cy="7" r="2.2" fill={k === 2 ? "#facc15" : "#22c55e"}>
              <animate attributeName="opacity" values="1;0.2;1" dur={`${0.6 + ((i + k) % 4) * 0.3}s`} repeatCount="indefinite" />
            </circle>
          ))}
          <rect x="32" y="5" width="12" height="4" fill="#64748b" />
        </g>
      ))}
    </g>
  );
}
