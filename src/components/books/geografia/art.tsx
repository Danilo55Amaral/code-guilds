"use client";

import type { ReactNode } from "react";
import { useUid } from "../BookParts";

// ============================================================================
// AS PEÇAS DO LIVRO DE GEOGRAFIA — as cores do livro, o painel das figuras de
// tocar (com os botões e o controle deslizante), a rosa dos ventos, o globo
// com as linhas imaginárias, a montanha, o prédio e a casa, que vários
// capítulos usam.
// ============================================================================

export const GEO = "#0e7490";
export const GEO_DARK = "#164e63";

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
export function Pill({ on = false, onClick, children, color = GEO }: { on?: boolean; onClick: () => void; children: ReactNode; color?: string }) {
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
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  suffix?: string;
  labelWidth?: string;
  format?: (v: number) => string;
}) {
  return (
    <label className="flex items-center gap-[0.5em] text-[0.82em] font-bold text-[#3b2a14]">
      <span className="shrink-0" style={{ width: labelWidth }}>
        {label}
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="min-w-0 flex-1 accent-[#0e7490]" />
      <span className="w-[3.6em] shrink-0 text-right tabular-nums" style={{ color: GEO_DARK }}>
        {format ? format(value) : `${value.toLocaleString("pt-BR")}${suffix}`}
      </span>
    </label>
  );
}

/** A rosa dos ventos (o centro em x, y), com os pontos cardeais e colaterais. */
export function CompassRose({ x, y, r = 50, spin = false }: { x: number; y: number; r?: number; spin?: boolean }) {
  const points = [
    ["N", 0],
    ["L", 90],
    ["S", 180],
    ["O", 270],
  ] as const;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="#fffaf0" stroke={GEO_DARK} strokeWidth="2" />
      <circle r={r * 0.72} fill="none" stroke="#d9c79d" strokeDasharray="3 3" />
      <g>
        {spin && <animateTransform attributeName="transform" type="rotate" values="-8;8;-8" dur="4s" repeatCount="indefinite" />}
        {[45, 135, 225, 315].map((a) => (
          <path key={a} d={`M0 ${-r * 0.55} L${r * 0.1} 0 L0 ${r * 0.1} L${-r * 0.1} 0 Z`} fill="#94a3b8" transform={`rotate(${a})`} />
        ))}
        {points.map(([, a]) => (
          <path key={a} d={`M0 ${-r * 0.85} L${r * 0.14} 0 L0 ${r * 0.14} L${-r * 0.14} 0 Z`} fill={a === 0 ? "#dc2626" : GEO_DARK} transform={`rotate(${a})`} />
        ))}
        <circle r={r * 0.08} fill="#fde047" stroke={GEO_DARK} />
      </g>
      {points.map(([l, a]) => {
        const rad = ((a - 90) * Math.PI) / 180;
        return (
          <text key={l} x={Math.cos(rad) * (r + 12)} y={Math.sin(rad) * (r + 12) + 5} textAnchor="middle" fontSize={r * 0.3} fontWeight="900" fill={l === "N" ? "#dc2626" : GEO_DARK} fontFamily="Georgia, serif">
            {l}
          </text>
        );
      })}
    </g>
  );
}

/** O globo (o centro em x, y) com os continentes, o Equador e o Meridiano de Greenwich; `turn` gira os continentes. */
export function GlobeLines({ x, y, r = 70, turn = true }: { x: number; y: number; r?: number; turn?: boolean }) {
  const clip = useUid("geoglobe");
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <clipPath id={clip}>
          <circle r={r} />
        </clipPath>
      </defs>
      <circle r={r} fill="#38bdf8" stroke={GEO_DARK} strokeWidth="2" />
      <g clipPath={`url(#${clip})`}>
        <g>
          {turn && <animateTransform attributeName="transform" type="translate" values={`0 0;${-r * 2} 0`} dur="14s" repeatCount="indefinite" />}
          {[0, r * 2].map((dx) => (
            <g key={dx} transform={`translate(${dx} 0) scale(${r / 70})`} fill="#4ade80" stroke="#15803d" strokeWidth="1">
              <path d="M-40 -48 Q-20 -58 -6 -44 Q-14 -30 -26 -26 Q-36 -14 -30 0 Q-44 -12 -50 -30 Z" />
              <path d="M-20 6 Q-6 2 0 14 Q-4 34 -14 52 Q-22 34 -26 18 Z" />
              <path d="M18 -46 Q40 -52 56 -40 Q48 -30 36 -32 Q28 -20 20 -24 Z" />
              <path d="M22 -16 Q40 -18 46 0 Q42 22 30 36 Q20 20 18 4 Z" />
              <path d="M58 20 Q70 16 76 26 Q68 36 58 32 Z" />
            </g>
          ))}
        </g>
        <ellipse rx={r} ry={r * 0.18} cy={-r * 0.45} fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
        <ellipse rx={r} ry={r * 0.18} cy={r * 0.45} fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
      </g>
      <line x1={-r} y1="0" x2={r} y2="0" stroke="#dc2626" strokeWidth="2.5" />
      <ellipse rx={r * 0.12} ry={r} fill="none" stroke="#facc15" strokeWidth="2.5" />
      <circle r={r} fill="none" stroke={GEO_DARK} strokeWidth="2" />
    </g>
  );
}

/** Uma montanha (o meio da base em x, y), com neve no pico. */
export function Mountain({ x, y, w = 140, h = 100, color = "#78716c", snow = true }: { x: number; y: number; w?: number; h?: number; color?: string; snow?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M${-w / 2} 0 L0 ${-h} L${w / 2} 0 Z`} fill={color} stroke="#44403c" strokeWidth="1.5" />
      <path d={`M0 ${-h} L${w / 2} 0 L${w * 0.1} 0 Z`} fill="#000" opacity="0.15" />
      {snow && <path d={`M0 ${-h} L${w * 0.13} ${-h * 0.74} L${w * 0.04} ${-h * 0.79} L${-w * 0.04} ${-h * 0.72} L${-w * 0.13} ${-h * 0.74} Z`} fill="#fff" />}
    </g>
  );
}

/** Um prédio (o canto de baixo à esquerda em x, y), com as janelas acesas. */
export function Building({ x, y, w = 40, h = 110, color = "#64748b" }: { x: number; y: number; w?: number; h?: number; color?: string }) {
  const rows = Math.floor((h - 16) / 16);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect y={-h} width={w} height={h} fill={color} stroke="#1e293b" strokeWidth="1.2" />
      {Array.from({ length: rows }, (_, r) =>
        [0, 1].map((c) => <rect key={`${r}-${c}`} x={6 + c * (w / 2)} y={-h + 8 + r * 16} width={w / 2 - 12} height="9" fill={(r + c) % 3 ? "#fde68a" : "#334155"} />),
      )}
    </g>
  );
}

/** Uma casinha (o meio do chão em x, y). */
export function House({ x, y, s = 1, wall = "#fde68a", roof = "#b91c1c" }: { x: number; y: number; s?: number; wall?: string; roof?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-18" y="-26" width="36" height="26" fill={wall} stroke="#78350f" strokeWidth="1.2" />
      <path d="M-24 -26 L0 -44 L24 -26 Z" fill={roof} stroke="#7f1d1d" strokeWidth="1.2" />
      <rect x="-5" y="-14" width="10" height="14" fill="#92400e" />
      <rect x="8" y="-20" width="7" height="7" fill="#7dd3fc" />
    </g>
  );
}
