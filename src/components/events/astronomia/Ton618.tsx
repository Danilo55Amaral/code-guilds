"use client";

import { useId } from "react";

// ============================================================================
// TON 618 — o vilão de Astronomia em: Salve o Wi-Fi. Um dos maiores buracos
// negros conhecidos (dezenas de bilhões de vezes a massa do Sol), desenhado
// do jeito que a ciência imagina: a "sombra" preta no meio, o anel de fótons
// (a luz dando a volta), o disco de gás quente girando (mais claro do lado que
// vem na nossa direção), a parte de trás do disco aparecendo curvada por cima
// (a gravidade entorta a luz), os jatos saindo pelos polos e as estrelas sendo
// puxadas em espiral. E um rosto: olhos de fogo e a boca que abre quando ele
// fala. `silhouette` = só a sombra chegando (disco apagado); `mood` muda os
// olhos ("furioso" vermelhos; "derrotado" tontos, girando).
// ============================================================================

export type Ton618Mood = "mau" | "furioso" | "derrotado";

const DEBRIS: [number, number, number][] = [
  [30, 150, 5],
  [372, 176, 4],
  [120, 40, 3],
  [300, 286, 4.5],
  [70, 270, 3],
];
// Estrelinhas sendo puxadas: [x, y, atraso s]
const INFALL: [number, number, number][] = [
  [26, 70, 0],
  [380, 96, 1.4],
  [350, 286, 2.6],
  [44, 262, 3.6],
  [200, 10, 0.8],
  [394, 210, 2],
];

export default function Ton618({
  talking = false,
  mood = "mau",
  silhouette = false,
  className = "",
}: {
  talking?: boolean;
  mood?: Ton618Mood;
  silhouette?: boolean;
  className?: string;
}) {
  const id = `tn${useId().replace(/:/g, "")}`;
  const dim = silhouette ? 0.35 : 1;
  const furious = mood === "furioso";
  const dizzy = mood === "derrotado";
  const flow = (dur: string) => ({ "--cg-dur": dur }) as React.CSSProperties;
  return (
    <svg viewBox="0 0 400 320" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-halo`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.3" stopColor="#fb923c" stopOpacity="0.5" />
          <stop offset="0.6" stopColor="#c026d3" stopOpacity="0.22" />
          <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
        {/* o lado esquerdo do disco vem na nossa direção: mais claro e mais branco */}
        <linearGradient id={`${id}-disk`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fffbeb" />
          <stop offset="0.22" stopColor="#fde68a" />
          <stop offset="0.5" stopColor="#fb923c" />
          <stop offset="0.78" stopColor="#dc2626" />
          <stop offset="1" stopColor="#7f1d1d" />
        </linearGradient>
        <linearGradient id={`${id}-jet`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#e0f2fe" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#a78bfa" stopOpacity="0.45" />
          <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-shadow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000000" />
          <stop offset="0.86" stopColor="#05010a" />
          <stop offset="1" stopColor="#2e1065" />
        </radialGradient>
        <radialGradient id={`${id}-eye`} cx="0.5" cy="0.6" r="0.6">
          <stop offset="0" stopColor={furious ? "#fee2e2" : "#fffbeb"} />
          <stop offset="0.45" stopColor={furious ? "#f87171" : "#fbbf24"} />
          <stop offset="1" stopColor={furious ? "#991b1b" : "#ea580c"} />
        </radialGradient>
        <radialGradient id={`${id}-mouth`} cx="0.5" cy="0.75" r="0.75">
          <stop offset="0" stopColor="#fffbeb" />
          <stop offset="0.35" stopColor="#fdba74" />
          <stop offset="0.75" stopColor="#ea580c" />
          <stop offset="1" stopColor="#7c2d12" />
        </radialGradient>
      </defs>

      {/* brilho em volta */}
      <circle cx="200" cy="160" r="190" fill={`url(#${id}-halo)`} opacity={dim} className="cg-anim-glow" style={flow("4s")} />

      {/* jatos de luz saindo pelos polos */}
      <g opacity={silhouette ? 0.25 : 1} className="cg-anim-beam">
        <path d="M193 92 L207 92 L222 -60 L178 -60 Z" fill={`url(#${id}-jet)`} />
        <path d="M193 92 L207 92 L222 -60 L178 -60 Z" fill={`url(#${id}-jet)`} transform="rotate(180 200 160)" />
      </g>

      {/* pedrinhas orbitando */}
      <g className="cg-anim-orbit" style={{ "--cg-origin": "200px 160px", "--cg-dur": "11s" } as React.CSSProperties}>
        {DEBRIS.map(([x, y, r], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={r + 3} fill="#f97316" opacity={0.25 * dim} />
            <path d={`M${x - r} ${y} L${x - r * 0.3} ${y - r} L${x + r} ${y - r * 0.4} L${x + r * 0.6} ${y + r} L${x - r * 0.5} ${y + r * 0.8} Z`} fill="#57534e" stroke="#fb923c" strokeWidth="1" opacity={0.6 + 0.4 * dim} />
          </g>
        ))}
      </g>

      {/* parte de trás do disco (passa atrás da sombra) */}
      <g opacity={dim}>
        <path d="M40 214 A160 26 0 0 1 360 214" fill="none" stroke={`url(#${id}-disk)`} strokeWidth="16" />
        {/* a luz da parte de trás, curvada pela gravidade por cima da sombra */}
        <path d="M108 200 A96 96 0 1 1 292 200" fill="none" stroke={`url(#${id}-disk)`} strokeWidth="13" opacity="0.95" />
        <path d="M108 200 A96 96 0 1 1 292 200" fill="none" stroke="#fffbeb" strokeWidth="2" strokeDasharray="14 10" opacity="0.8" className="cg-anim-aura-flow" style={flow("0.9s")} />
        <path d="M120 204 A86 86 0 0 0 280 204" fill="none" stroke="#fdba74" strokeWidth="4" opacity="0.45" />
      </g>

      {/* anel de fótons + a sombra */}
      <circle cx="200" cy="160" r="84" fill="none" stroke="#fb923c" strokeWidth="1.5" opacity={0.6 * dim} />
      <circle cx="200" cy="160" r="80.5" fill="none" stroke="#fde68a" strokeWidth="3.2" opacity={dim} className="cg-anim-beam" style={{ filter: "drop-shadow(0 0 6px #fbbf24)" }} />
      <circle cx="200" cy="160" r="78" fill={`url(#${id}-shadow)`} />

      {/* o rosto */}
      <g className={dizzy ? undefined : "cg-anim-blink"}>
        {dizzy ? (
          [172, 228].map((x) => (
            <g key={x} className="cg-anim-aura-twirl" style={flow("1.6s")}>
              <path
                d={`M${x} 140 m-1 0 a1 1 0 1 1 2 0 a3 3 0 1 1 -6 0 a5 5 0 1 1 10 0 a7 7 0 1 1 -14 0 a9 9 0 1 1 18 0`}
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2.6"
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 4px #f97316)" }}
              />
            </g>
          ))
        ) : (
          <g style={{ filter: `drop-shadow(0 0 7px ${furious ? "#ef4444" : "#f97316"})` }}>
            <path d={furious ? "M150 120 L191 140 C189 152 179 157 169 155 C158 152 151 138 150 120 Z" : "M154 126 L190 138 C188 151 178 156 168 154 C158 151 153 140 154 126 Z"} fill={`url(#${id}-eye)`} />
            <path d={furious ? "M250 120 L209 140 C211 152 221 157 231 155 C242 152 249 138 250 120 Z" : "M246 126 L210 138 C212 151 222 156 232 154 C242 151 247 140 246 126 Z"} fill={`url(#${id}-eye)`} />
            <ellipse cx="173" cy="145" rx="2.6" ry="6.5" fill="#431407" />
            <ellipse cx="227" cy="145" rx="2.6" ry="6.5" fill="#431407" />
          </g>
        )}
      </g>
      {dizzy ? (
        <g className="cg-anim-astro-wobble" style={flow("1.2s")}>
          <ellipse cx="200" cy="194" rx={talking ? 17 : 11} ry={talking ? 20 : 12} fill={`url(#${id}-mouth)`} style={{ filter: "drop-shadow(0 0 6px #f97316)" }} />
        </g>
      ) : talking ? (
        <g style={{ filter: "drop-shadow(0 0 8px #f97316)" }}>
          <path d="M156 176 Q200 170 244 176 Q238 222 200 226 Q162 222 156 176 Z" fill={`url(#${id}-mouth)`} />
          <g className="cg-anim-orbit" style={{ "--cg-origin": "200px 204px", "--cg-dur": "2.2s" } as React.CSSProperties}>
            <path d="M200 204 m-2 0 a2 2 0 1 1 4 0 a6 6 0 1 1 -12 0 a10 10 0 1 1 20 0" fill="none" stroke="#fffbeb" strokeWidth="1.6" opacity="0.7" />
          </g>
          <path d="M160 176.5 L166 187 L172 175.6 L178 186 L184 175 L190 185 L196 174.6 L202 184.6 L208 174.7 L214 185 L220 175 L226 186 L232 175.6 L238 187 L242 176.4 Q200 171 160 176.5 Z" fill="#fef3c7" />
        </g>
      ) : (
        <g style={{ filter: "drop-shadow(0 0 6px #f97316)" }}>
          <path d="M158 180 Q200 206 242 180" fill="none" stroke="#fb923c" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M176 189.5 L180 199 L185 191.5 Z M224 189.5 L220 199 L215 191.5 Z" fill="#fde68a" />
        </g>
      )}

      {/* parte da frente do disco (passa na frente da sombra) */}
      <g opacity={dim} className={dizzy ? "cg-anim-aura-blink" : undefined} style={dizzy ? flow("0.6s") : undefined}>
        <path d="M40 214 A160 26 0 0 0 360 214" fill="none" stroke={`url(#${id}-disk)`} strokeWidth="17" />
        <path d="M40 214 A160 26 0 0 0 360 214" fill="none" stroke="#fffbeb" strokeWidth="2.2" strokeDasharray="14 10" className="cg-anim-aura-flow" style={flow("0.7s")} />
        <path d="M60 220 A140 20 0 0 0 340 220" fill="none" stroke="#fef3c7" strokeWidth="1.2" strokeDasharray="6 18" opacity="0.7" className="cg-anim-aura-flow" style={flow("1.1s")} />
      </g>

      {/* estrelinhas caindo em espiral */}
      {!silhouette && (
        <g className="cg-anim-orbit" style={{ "--cg-origin": "200px 160px", "--cg-dur": "8s" } as React.CSSProperties}>
          {INFALL.map(([x, y, delay], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3.2"
              fill="#fef9c3"
              className="cg-anim-astro-pull"
              style={{ "--cg-tx": `${200 - x}px`, "--cg-ty": `${160 - y}px`, "--cg-dur": "4.2s", "--cg-delay": `${delay}s`, filter: "drop-shadow(0 0 3px #fde68a)" } as React.CSSProperties}
            />
          ))}
        </g>
      )}
    </svg>
  );
}
