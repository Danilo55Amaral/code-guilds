"use client";

import { useId } from "react";
import { RocketShape, type FlameSize } from "./craft";

// ============================================================================
// O CHÃO DE ASTRONOMIA EM: SALVE O WI-FI — os morros da CodeGuilds à noite, o
// observatório (a cúpula com a fenda aberta, o telescópio da Catarina e a
// antena de rádio) e a plataforma de lançamento do Vitória-1 (a torre, os
// braços de serviço, as luzes e a fumaça da ignição).
// ============================================================================

/** Morros no horizonte (ocupa a largura toda, colado embaixo), com casinhas acesas ao longe. */
export function Hills({ className = "h-[30%]", lights = true }: { className?: string; lights?: boolean }) {
  return (
    <svg viewBox="0 0 1200 200" preserveAspectRatio="xMidYMax slice" className={`absolute bottom-0 left-0 w-full ${className}`} aria-hidden="true">
      <path d="M0 200 L0 96 C140 60 260 70 380 92 C520 118 640 64 800 70 C940 76 1060 104 1200 86 L1200 200 Z" fill="#1e1b4b" />
      <path d="M0 96 C140 60 260 70 380 92 C520 118 640 64 800 70 C940 76 1060 104 1200 86" fill="none" stroke="#a78bfa" strokeWidth="2" opacity="0.35" />
      <path d="M0 200 L0 140 C160 118 300 128 460 146 C620 162 760 120 920 126 C1040 130 1120 144 1200 138 L1200 200 Z" fill="#0f0b2e" />
      {lights &&
        [
          [90, 134],
          [150, 128],
          [540, 152],
          [610, 150],
          [980, 128],
          [1050, 134],
          [1110, 140],
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="6" height="5" rx="1" fill="#fde68a" className="cg-anim-eye" style={{ animationDelay: `${i * 0.43}s`, filter: "drop-shadow(0 0 4px #fbbf24)" }} />
        ))}
      {[220, 260, 700, 860, 900].map((x, i) => (
        <path key={x} d={`M${x} ${150 - (i % 2) * 6} L${x + 10} ${120 - (i % 2) * 6} L${x + 20} ${150 - (i % 2) * 6} Z`} fill="#070520" />
      ))}
    </svg>
  );
}

/** O observatório da CodeGuilds: a cúpula com a fenda aberta, o telescópio iluminando o céu e a antena de rádio. */
export function Observatory({ className = "" }: { className?: string }) {
  const id = `ob${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 300 230" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-dome`} cx="0.35" cy="0.25" r="0.85">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#c7d2fe" />
          <stop offset="1" stopColor="#6366f1" />
        </radialGradient>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#cbd5e1" />
          <stop offset="0.4" stopColor="#f1f5f9" />
          <stop offset="1" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a5f3fc" stopOpacity="0.55" />
          <stop offset="1" stopColor="#a5f3fc" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* o morrinho */}
      <path d="M-30 230 L-30 212 C40 196 120 194 160 196 C220 198 280 204 330 212 L330 230 Z" fill="#1e1b4b" />
      {/* o feixe do telescópio subindo pro céu */}
      <g transform="rotate(-35 150 96)">
        <path d="M243 88 L460 50 L460 146 L243 106 Z" fill={`url(#${id}-beam)`} className="cg-anim-beam" />
      </g>
      {/* paredes */}
      <rect x="70" y="120" width="160" height="88" fill={`url(#${id}-wall)`} stroke="#475569" strokeWidth="1.5" />
      <rect x="62" y="110" width="176" height="13" rx="3" fill="#e2e8f0" stroke="#475569" strokeWidth="1.2" />
      <text x="150" y="119.5" textAnchor="middle" fontSize="8" fontWeight="900" fontFamily="sans-serif" fill="#4c1d95" letterSpacing="1.5">
        OBSERVATÓRIO
      </text>
      <path d="M138 208 L138 178 A12 12 0 0 1 162 178 L162 208 Z" fill="#fbbf24" stroke="#92400e" strokeWidth="1.2" style={{ filter: "drop-shadow(0 0 8px #fbbf24)" }} />
      <circle cx="102" cy="150" r="7" fill="#fde68a" stroke="#475569" strokeWidth="1.5" />
      <circle cx="198" cy="150" r="7" fill="#fde68a" stroke="#475569" strokeWidth="1.5" />
      {/* a cúpula, com a fenda aberta */}
      <path d="M70 112 A80 80 0 0 1 230 112 Z" fill={`url(#${id}-dome)`} stroke="#4338ca" strokeWidth="1.5" />
      <path d="M100 112 C104 76 120 50 140 38 M200 112 C196 76 180 50 160 38" stroke="#818cf8" strokeWidth="1.5" fill="none" opacity="0.7" />
      <path d="M140 34 C146 32 154 32 160 34 L168 112 L132 112 Z" fill="#0f172a" />
      {/* o telescópio saindo pela fenda */}
      <g transform="rotate(-35 150 96)">
        <rect x="140" y="88" width="96" height="18" rx="5" fill="#7c3aed" stroke="#3b0764" strokeWidth="1.5" />
        <rect x="226" y="84" width="16" height="26" rx="4" fill="#5b21b6" stroke="#3b0764" strokeWidth="1.5" />
        <rect x="186" y="88" width="6" height="18" fill="#fbbf24" />
        <ellipse cx="242" cy="97" rx="3" ry="11" fill="#a5f3fc" className="cg-anim-glow" />
      </g>
      {/* bandeirinha da CodeGuilds */}
      <path d="M216 74 L216 40" stroke="#475569" strokeWidth="2" />
      <path d="M216 40 L238 46 L216 52 Z" fill="#d946ef" className="cg-anim-flutter" />
      {/* antena de rádio (de onde a Catarina fala com os satélites) */}
      <path d="M262 212 L262 170" stroke="#64748b" strokeWidth="4" />
      <path d="M240 150 Q262 186 290 158 Z" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
      <path d="M264 166 L254 146" stroke="#64748b" strokeWidth="1.5" />
      <circle cx="253" cy="144" r="3" fill="#22d3ee" className="cg-anim-twinkle" />
    </svg>
  );
}

const PUFFS: [number, number, number, number][] = [
  // [deslocamento x, deslocamento y, tamanho, atraso]
  [-110, -20, 22, 0],
  [-70, -40, 18, 0.3],
  [-40, -10, 16, 0.6],
  [110, -24, 22, 0.15],
  [70, -44, 18, 0.45],
  [40, -12, 16, 0.75],
  [-140, -6, 14, 0.9],
  [140, -8, 14, 1.05],
];

/** A plataforma de lançamento com o Vitória-1. `ignite` = a ignição (fogo, fumaça e o foguete tremendo). */
export function LaunchPad({
  lights,
  flame = "off",
  ignite = false,
  className = "",
}: {
  lights?: [boolean, boolean, boolean];
  flame?: FlameSize;
  ignite?: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 300 380" className={`overflow-visible ${className}`} aria-hidden="true">
      {/* luz dos holofotes */}
      {[30, 270].map((x) => (
        <path key={x} d={`M${x} 330 L${x < 150 ? x + 70 : x - 70} 20 L${x < 150 ? x + 130 : x - 130} 20 Z`} fill="#e0e7ff" opacity="0.08" />
      ))}
      {/* a torre de serviço */}
      <g stroke="#94a3b8" strokeWidth="3" fill="none">
        <path d="M40 330 L40 40 M80 330 L80 40" />
        <path d={Array.from({ length: 10 }, (_, i) => `M40 ${330 - i * 29} L80 ${301 - i * 29} M80 ${330 - i * 29} L40 ${301 - i * 29}`).join(" ")} strokeWidth="1.4" opacity="0.8" />
        <path d="M36 40 L84 40" strokeWidth="4" />
      </g>
      {/* braços de serviço até o foguete */}
      <path d="M80 140 L136 140 M80 236 L136 236" stroke="#64748b" strokeWidth="6" />
      <path d="M80 140 L136 140 M80 236 L136 236" stroke="#d946ef" strokeWidth="1.6" />
      <circle cx="60" cy="32" r="5" fill="#ef4444" className="cg-anim-aura-blink" style={{ "--cg-dur": "1s", filter: "drop-shadow(0 0 5px #ef4444)" } as React.CSSProperties} />
      {/* o foguete */}
      <g transform="translate(110 40)">
        <g className={ignite ? "cg-anim-shiver" : undefined}>
          <RocketShape flame={flame} lights={lights} />
        </g>
      </g>
      {/* a base */}
      <path d="M0 380 L0 334 L300 334 L300 380 Z" fill="#1e1b4b" />
      <rect x="34" y="322" width="232" height="14" rx="2" fill="#475569" stroke="#1e293b" strokeWidth="1.5" />
      <path d="M140 322 L200 322 L192 336 L148 336 Z" fill="#0f172a" />
      {[50, 250].map((x) => (
        <g key={x}>
          <rect x={x - 6} y="300" width="12" height="22" fill="#334155" />
          <rect x={x - 9} y="294" width="18" height="8" rx="2" fill="#fde68a" style={{ filter: "drop-shadow(0 0 6px #fde68a)" }} />
        </g>
      ))}
      {/* fumaça da ignição */}
      {ignite &&
        PUFFS.map(([tx, ty, r, delay], i) => (
          <circle
            key={i}
            cx="170"
            cy="326"
            r={r}
            fill={i % 2 ? "#e2e8f0" : "#f8fafc"}
            className="cg-anim-astro-puff"
            style={{ "--cg-tx": `${tx}px`, "--cg-ty": `${ty}px`, "--cg-dur": "1.6s", "--cg-delay": `${delay}s` } as React.CSSProperties}
          />
        ))}
    </svg>
  );
}
