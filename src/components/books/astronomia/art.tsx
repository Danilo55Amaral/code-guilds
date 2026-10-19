"use client";

import { useUid } from "../BookParts";

// ============================================================================
// AS PEÇAS DE DESENHO DO LIVRO DE ASTRONOMIA — o céu estrelado piscando, o
// Sol com o brilho e a coroa, os planetas com o degradê de luz e sombra
// (faixas como as de Júpiter e anéis como os de Saturno), a Terra com os
// continentes, a Lua com as crateras e o foguete.
// ============================================================================

/** Estrelinhas piscando espalhadas (sempre nas mesmas posições). */
export function Stars({ w, h, n = 40, seed = 7 }: { w: number; h: number; n?: number; seed?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <circle
          key={i}
          cx={((i + seed) * 97) % w}
          cy={((i + seed) * 53) % h}
          r={i % 6 === 0 ? 1.8 : 1.1}
          fill="#fff"
          className="cg-anim-twinkle"
          style={{ animationDelay: `${(i % 9) * 0.35}s` }}
        />
      ))}
    </g>
  );
}

/** O Sol: o brilho pulsando, a coroa girando e a superfície com manchas. */
export function Sun({ x = 0, y = 0, r = 40 }: { x?: number; y?: number; r?: number }) {
  const u = useUid("sun");
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <radialGradient id={u} cx="0.45" cy="0.42" r="0.6">
          <stop offset="0" stopColor="#fff7d6" />
          <stop offset="0.5" stopColor="#fbbf24" />
          <stop offset="1" stopColor="#f97316" />
        </radialGradient>
      </defs>
      <circle r={r * 1.8} fill="#fbbf24" opacity="0.18" className="cg-anim-glow" />
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="40s" repeatCount="indefinite" />
        {Array.from({ length: 16 }, (_, i) => (
          <path key={i} d={`M0 ${-r * 1.08} L${r * 0.12} ${-r * 1.4} L${-r * 0.12} ${-r * 1.4} Z`} fill="#fbbf24" opacity="0.8" transform={`rotate(${i * 22.5})`} />
        ))}
      </g>
      <circle r={r} fill={`url(#${u})`} />
      <circle cx={-r * 0.3} cy={r * 0.2} r={r * 0.08} fill="#ea580c" opacity="0.6" />
      <circle cx={r * 0.25} cy={-r * 0.3} r={r * 0.06} fill="#ea580c" opacity="0.6" />
    </g>
  );
}

/** Um planeta com luz de um lado e sombra do outro; com faixas e/ou anéis, se pedir. */
export function Planet({
  x = 0,
  y = 0,
  r,
  color,
  dark,
  bands,
  rings,
  tilt = -18,
}: {
  x?: number;
  y?: number;
  r: number;
  color: string;
  dark: string;
  bands?: string;
  rings?: string;
  tilt?: number;
}) {
  const u = useUid("pl");
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <radialGradient id={u} cx="0.35" cy="0.35" r="0.75">
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={dark} />
        </radialGradient>
        <clipPath id={`${u}-c`}>
          <circle r={r} />
        </clipPath>
      </defs>
      {rings && <ellipse rx={r * 2} ry={r * 0.55} fill="none" stroke={rings} strokeWidth={r * 0.28} opacity="0.75" transform={`rotate(${tilt})`} />}
      <circle r={r} fill={`url(#${u})`} />
      {bands && (
        <g clipPath={`url(#${u}-c)`}>
          {[-0.5, -0.15, 0.2, 0.5].map((t) => (
            <rect key={t} x={-r} y={r * t} width={r * 2} height={r * 0.14} fill={bands} opacity="0.55" />
          ))}
        </g>
      )}
      {rings && <path d={`M${-r * 2} 0 A${r * 2} ${r * 0.55} 0 0 0 ${r * 2} 0`} fill="none" stroke={rings} strokeWidth={r * 0.28} opacity="0.85" transform={`rotate(${tilt})`} />}
    </g>
  );
}

/** A Terra com os continentes passando (girando) e o oceano. */
export function Earth({ x = 0, y = 0, r = 30 }: { x?: number; y?: number; r?: number }) {
  const u = useUid("earth");
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <clipPath id={u}>
          <circle r={r} />
        </clipPath>
        <radialGradient id={`${u}-g`} cx="0.35" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#60a5fa" />
          <stop offset="1" stopColor="#1e3a8a" />
        </radialGradient>
      </defs>
      <circle r={r} fill={`url(#${u}-g)`} />
      <g clipPath={`url(#${u})`}>
        <g>
          <animateTransform attributeName="transform" type="translate" values={`0 0;${-r * 2} 0`} dur="12s" repeatCount="indefinite" />
          {[0, r * 2].map((dx) => (
            <g key={dx} transform={`translate(${dx} 0)`} fill="#22c55e">
              <path d={`M${-r * 0.7} ${-r * 0.4} c${r * 0.3} ${-r * 0.3} ${r * 0.7} ${-r * 0.2} ${r * 0.6} ${r * 0.2} c${-r * 0.1} ${r * 0.3} ${-r * 0.5} ${r * 0.2} ${-r * 0.6} ${-r * 0.2} Z`} />
              <path d={`M${r * 0.2} ${r * 0.1} c${r * 0.3} 0 ${r * 0.4} ${r * 0.3} ${r * 0.2} ${r * 0.6} c${-r * 0.2} ${r * 0.1} ${-r * 0.3} ${-r * 0.3} ${-r * 0.2} ${-r * 0.6} Z`} />
              <path d={`M${r * 0.6} ${-r * 0.7} c${r * 0.3} 0 ${r * 0.5} ${r * 0.2} ${r * 0.4} ${r * 0.4} c${-r * 0.2} 0 ${-r * 0.4} ${-r * 0.2} ${-r * 0.4} ${-r * 0.4} Z`} />
            </g>
          ))}
        </g>
        <ellipse cx={-r * 0.2} cy={-r * 0.85} rx={r * 0.5} ry={r * 0.18} fill="#f8fafc" opacity="0.9" />
      </g>
      <circle r={r} fill="none" stroke="#93c5fd" strokeWidth={r * 0.08} opacity="0.6" />
    </g>
  );
}

/** A Lua cinza com as crateras. */
export function Moon({ x = 0, y = 0, r = 20 }: { x?: number; y?: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="#d4d4d8" stroke="#a1a1aa" strokeWidth={r * 0.05} />
      <circle cx={-r * 0.3} cy={-r * 0.25} r={r * 0.22} fill="#a1a1aa" />
      <circle cx={r * 0.35} cy={r * 0.1} r={r * 0.15} fill="#a1a1aa" />
      <circle cx={-r * 0.1} cy={r * 0.45} r={r * 0.12} fill="#a1a1aa" />
      <circle cx={r * 0.25} cy={-r * 0.5} r={r * 0.08} fill="#a1a1aa" />
    </g>
  );
}

/** O foguete (a ponta pra cima), com a chama tremendo embaixo. */
export function Rocket({ x = 0, y = 0, s = 1, flame = true }: { x?: number; y?: number; s?: number; flame?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {flame && (
        <g className="cg-anim-astro-flame">
          <path d="M-12 40 C-8 72 8 72 12 40 Z" fill="#f97316" />
          <path d="M-6 40 C-4 56 4 56 6 40 Z" fill="#fde047" />
        </g>
      )}
      <path d="M0 -60 C20 -36 22 0 18 40 L-18 40 C-22 0 -20 -36 0 -60 Z" fill="#f8fafc" stroke="#1e293b" strokeWidth="2.5" />
      <path d="M0 -60 C10 -48 14 -40 15 -34 L-15 -34 C-14 -40 -10 -48 0 -60 Z" fill="#dc2626" />
      <circle cy="-12" r="9" fill="#38bdf8" stroke="#1e293b" strokeWidth="2" />
      <path d="M-18 16 L-34 44 L-18 40 Z M18 16 L34 44 L18 40 Z" fill="#dc2626" stroke="#1e293b" strokeWidth="2" />
    </g>
  );
}
