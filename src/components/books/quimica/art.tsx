"use client";

import type { ReactNode } from "react";
import { useUid } from "../BookParts";

// ============================================================================
// AS PEÇAS DE DESENHO DO LIVRO DE QUÍMICA — os átomos coloridos (cada
// elemento com a sua cor, como nos modelos de bolinha das escolas), as
// moléculas prontas (água, gás carbônico, oxigênio, hidrogênio, metano), o
// átomo de Bohr com os elétrons girando em cada camada, o béquer e o
// erlenmeyer com o líquido e as bolhas subindo, e a chama do bico de Bunsen.
// ============================================================================

export const ELEMENT_COLOR: Record<string, [string, string]> = {
  H: ["#f8fafc", "#94a3b8"],
  O: ["#f87171", "#b91c1c"],
  C: ["#475569", "#0f172a"],
  N: ["#60a5fa", "#1d4ed8"],
  Na: ["#c084fc", "#7e22ce"],
  Cl: ["#4ade80", "#15803d"],
  S: ["#fde047", "#a16207"],
  Fe: ["#fb923c", "#9a3412"],
  Cu: ["#f59e0b", "#92400e"],
  Zn: ["#cbd5e1", "#475569"],
};

/** Um átomo de bolinha, com o símbolo dentro. */
export function Ball({ el, x = 0, y = 0, r = 12, label = true }: { el: string; x?: number; y?: number; r?: number; label?: boolean }) {
  const [light, dark] = ELEMENT_COLOR[el] ?? ["#e2e8f0", "#475569"];
  const u = useUid("ball");
  return (
    <g>
      <defs>
        <radialGradient id={u} cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="0.35" stopColor={light} />
          <stop offset="1" stopColor={dark} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r} fill={`url(#${u})`} stroke={dark} strokeWidth="1.2" />
      {label && (
        <text x={x} y={y + r * 0.38} textAnchor="middle" fontSize={r * 0.95} fontWeight="900" fill={el === "H" ? "#334155" : "#fff"} fontFamily="Georgia, serif">
          {el}
        </text>
      )}
    </g>
  );
}

/** Molécula de água (H₂O): o oxigênio no meio e os dois hidrogênios em ângulo. */
export function Water({ x = 0, y = 0, s = 1, label = true }: { x?: number; y?: number; s?: number; label?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Ball el="H" x={-15} y={11} r={9} label={label} />
      <Ball el="H" x={15} y={11} r={9} label={label} />
      <Ball el="O" r={14} label={label} />
    </g>
  );
}

/** Gás carbônico (CO₂): O=C=O, em linha. */
export function CarbonDioxide({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Ball el="O" x={-22} r={11} />
      <Ball el="O" x={22} r={11} />
      <Ball el="C" r={12} />
    </g>
  );
}

/** Uma molécula de dois átomos iguais (O₂, H₂, Cl₂...). */
export function Diatomic({ el, x = 0, y = 0, s = 1 }: { el: string; x?: number; y?: number; s?: number }) {
  const r = el === "H" ? 9 : 12;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Ball el={el} x={-r * 0.75} r={r} />
      <Ball el={el} x={r * 0.75} r={r} />
    </g>
  );
}

/** Metano (CH₄): o carbono no meio e os quatro hidrogênios em volta. */
export function Methane({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[
        [0, -24],
        [-22, 10],
        [22, 10],
        [0, 22],
      ].map(([hx, hy], i) => (
        <g key={i}>
          <line x1="0" y1="0" x2={hx} y2={hy} stroke="#64748b" strokeWidth="3" />
          <Ball el="H" x={hx} y={hy} r={9} />
        </g>
      ))}
      <Ball el="C" r={13} />
    </g>
  );
}

/**
 * O átomo de Bohr: o núcleo (prótons vermelhos e nêutrons cinza) e uma
 * camada por número do array `shells`, com os elétrons girando (as camadas
 * de fora giram mais devagar).
 */
export function BohrAtom({ shells, x = 0, y = 0, r0 = 22, gap = 16, protons, label }: { shells: number[]; x?: number; y?: number; r0?: number; gap?: number; protons?: number; label?: string }) {
  const p = protons ?? shells.reduce((a, b) => a + b, 0);
  const nucleons = Math.min(14, Math.max(2, p * 2));
  return (
    <g transform={`translate(${x} ${y})`}>
      {shells.map((_, k) => (
        <circle key={k} r={r0 + k * gap} fill="none" stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="3 3" />
      ))}
      {/* o núcleo */}
      <circle r={r0 * 0.55} fill="#fde68a" opacity="0.35" className="cg-anim-glow" />
      {Array.from({ length: nucleons }, (_, i) => {
        const a = i * 2.4;
        const d = Math.sqrt(i) * 3.1;
        return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r="3.6" fill={i % 2 ? "#94a3b8" : "#ef4444"} stroke="#1e293b" strokeWidth="0.6" />;
      })}
      {/* os elétrons girando em cada camada */}
      {shells.map((n, k) => (
        <g key={k}>
          <animateTransform attributeName="transform" type="rotate" from={k % 2 ? "360" : "0"} to={k % 2 ? "0" : "360"} dur={`${4 + k * 3}s`} repeatCount="indefinite" />
          {Array.from({ length: n }, (_, e) => {
            const a = (e / n) * Math.PI * 2;
            const rr = r0 + k * gap;
            return <circle key={e} cx={Math.cos(a) * rr} cy={Math.sin(a) * rr} r="3.4" fill="#3b82f6" stroke="#fff" strokeWidth="0.8" />;
          })}
        </g>
      ))}
      {label && (
        <text y={r0 + (shells.length - 1) * gap + 22} textAnchor="middle" fontSize="13" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
          {label}
        </text>
      )}
    </g>
  );
}

/** Bolhas subindo dentro de um recipiente (de x0 a x1, do fundo `bottom` até `top`). */
export function Bubbles({ x0, x1, bottom, top, n = 6, color = "#fff", dur = 2.4 }: { x0: number; x1: number; bottom: number; top: number; n?: number; color?: string; dur?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + ((i * 37) % Math.max(1, x1 - x0));
        const d = dur * (0.8 + (i % 3) * 0.2);
        return (
          <circle key={i} cx={x} cy={bottom} r={2 + (i % 3)} fill="none" stroke={color} strokeWidth="1.4" opacity="0.9">
            <animate attributeName="cy" values={`${bottom};${top}`} dur={`${d}s`} begin={`${-(i * d) / n}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.1;0.8;1" dur={`${d}s`} begin={`${-(i * d) / n}s`} repeatCount="indefinite" />
          </circle>
        );
      })}
    </g>
  );
}

/** O béquer: o vidro com a graduação e o líquido até `level` (0 a 1). */
export function Beaker({ x, y, w = 80, h = 100, liquid = "#7dd3fc", level = 0.6, children }: { x: number; y: number; w?: number; h?: number; liquid?: string; level?: number; children?: ReactNode }) {
  const top = y + h * (1 - level);
  return (
    <g>
      <path d={`M${x} ${top} L${x} ${y + h - 6} Q${x} ${y + h} ${x + 6} ${y + h} L${x + w - 6} ${y + h} Q${x + w} ${y + h} ${x + w} ${y + h - 6} L${x + w} ${top} Z`} fill={liquid} opacity="0.85" />
      {children}
      <path d={`M${x - 4} ${y - 2} L${x} ${y + 4} L${x} ${y + h - 6} Q${x} ${y + h} ${x + 6} ${y + h} L${x + w - 6} ${y + h} Q${x + w} ${y + h} ${x + w} ${y + h - 6} L${x + w} ${y}`} fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinejoin="round" />
      {[0.25, 0.5, 0.75].map((t) => (
        <path key={t} d={`M${x + w - 14} ${y + h * t} L${x + w - 4} ${y + h * t}`} stroke="#94a3b8" strokeWidth="1.5" />
      ))}
      <path d={`M${x + 6} ${y + 10} L${x + 6} ${y + h - 14}`} stroke="#fff" strokeWidth="3" opacity="0.5" strokeLinecap="round" />
    </g>
  );
}

/** O erlenmeyer (o frasco cônico). */
export function Flask({ x, y, s = 1, liquid = "#c084fc", children }: { x: number; y: number; s?: number; liquid?: string; children?: ReactNode }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-30 40 L-8 0 L8 0 L30 40 Q32 46 26 46 L-26 46 Q-32 46 -30 40 Z" fill={liquid} opacity="0.85" />
      {children}
      <path d="M-8 -40 L-8 -2 L-34 42 Q-36 48 -28 48 L28 48 Q36 48 34 42 L8 -2 L8 -40" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M-12 -40 L12 -40" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

/** A chama azul do bico de Bunsen, tremendo (a base em 0, 0). */
export function Flame({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="cg-anim-flicker">
        <path d="M0 -44 C12 -26 12 -8 0 0 C-12 -8 -12 -26 0 -44 Z" fill="#60a5fa" opacity="0.8" />
        <path d="M0 -26 C6 -16 6 -6 0 -2 C-6 -6 -6 -16 0 -26 Z" fill="#dbeafe" />
      </g>
    </g>
  );
}
