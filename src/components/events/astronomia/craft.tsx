"use client";

import { useEffect, useId, useState } from "react";

// ============================================================================
// AS NAVES E OS APARELHOS DE ASTRONOMIA EM: SALVE O WI-FI — o foguete
// Vitória-1 (com a Catarina na janelinha), os satélites da Constelação Lúmen
// e a Lúmen-Mãe, a Estação Espacial Internacional, a nave com o braço robótico
// e o escudo do Mago, a cabine com o painel, o tanque e o relógio do oxigênio,
// o radar, as barrinhas de sinal, o símbolo do Wi-Fi e o celular sem sinal.
// ============================================================================

const uid = (prefix: string, raw: string) => `${prefix}${raw.replace(/:/g, "")}`;

// ---------------------------------------------------------------------------
// Foguete Vitória-1 (desenho de 120 de largura; o bico em y=8, o bocal em y=268)
// ---------------------------------------------------------------------------

export type FlameSize = "off" | "small" | "full";

/**
 * O foguete como grupo SVG (pra entrar dentro de outros desenhos). `lights` = motores, navegação, suporte de vida.
 * `tilt` = quanto o foguete está girado lá fora (graus): a Catarina na janelinha gira ao contrário e fica sempre em pé.
 */
export function RocketShape({ flame = "off", lights, tilt = 0 }: { flame?: FlameSize; lights?: [boolean, boolean, boolean]; tilt?: number }) {
  const id = uid("rk", useId());
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#cbd5e1" />
          <stop offset="0.35" stopColor="#ffffff" />
          <stop offset="0.62" stopColor="#f1f5f9" />
          <stop offset="1" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id={`${id}-nose`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5b21b6" />
          <stop offset="0.4" stopColor="#a78bfa" />
          <stop offset="0.7" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#4c1d95" />
        </linearGradient>
        <radialGradient id={`${id}-glass`} cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#f5d0fe" />
          <stop offset="0.5" stopColor="#a855f7" />
          <stop offset="1" stopColor="#1e1b4b" />
        </radialGradient>
        <clipPath id={`${id}-window`}>
          <circle cx="60" cy="120" r="12.5" />
        </clipPath>
      </defs>

      {/* fogo do motor */}
      {flame !== "off" && (
        <g transform={`translate(60 266) scale(${flame === "full" ? "1.15 1.5" : "0.6 0.6"})`}>
          <ellipse cx="0" cy="40" rx="34" ry="60" fill="#f97316" opacity="0.28" style={{ filter: "blur(8px)" }} />
          <g className="cg-anim-astro-flame">
            <path d="M-22 0 C-24 40 -10 70 0 104 C10 70 24 40 22 0 Z" fill="#f97316" />
            <path d="M-15 0 C-16 30 -6 54 0 78 C6 54 16 30 15 0 Z" fill="#fbbf24" />
            <path d="M-8 0 C-8 18 -3 32 0 46 C3 32 8 18 8 0 Z" fill="#fffbeb" />
          </g>
        </g>
      )}

      {/* aletas de trás */}
      <path d="M28 186 C14 200 6 222 6 252 L28 238 Z" fill="#7c3aed" stroke="#3b0764" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M92 186 C106 200 114 222 114 252 L92 238 Z" fill="#6d28d9" stroke="#3b0764" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M6 252 L28 238 M114 252 L92 238" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" />

      {/* motor e bocal */}
      <path d="M30 236 L90 236 L84 250 L36 250 Z" fill="#475569" stroke="#1e293b" strokeWidth="1.2" />
      <path d="M42 250 L78 250 L84 268 L36 268 Z" fill="#334155" stroke="#0f172a" strokeWidth="1.2" />
      {flame !== "off" && <ellipse cx="60" cy="267" rx="22" ry="3" fill="#fde68a" />}

      {/* corpo */}
      <path d="M60 8 C82 30 92 70 92 120 L92 236 L28 236 L28 120 C28 70 38 30 60 8 Z" fill={`url(#${id}-body)`} stroke="#64748b" strokeWidth="1.5" />
      <path d="M60 8 C75 23 84 44 88 70 L32 70 C36 44 45 23 60 8 Z" fill={`url(#${id}-nose)`} />
      <path d="M50 22 C46 32 42 46 40 62" stroke="#ddd6fe" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" />
      <rect x="31" y="68" width="58" height="7" fill="#fbbf24" stroke="#a16207" strokeWidth="0.8" />
      <circle cx="60" cy="10" r="3" fill="#fbbf24" />

      {/* luzes dos sistemas (vermelhas desligadas, verdes ligadas) */}
      {lights &&
        lights.map((on, i) => (
          <g key={i}>
            <circle cx={46 + i * 14} cy="88" r="4.6" fill="#1e293b" />
            <circle
              cx={46 + i * 14}
              cy="88"
              r="3.3"
              fill={on ? "#4ade80" : "#ef4444"}
              className={on ? "cg-anim-twinkle" : "cg-anim-aura-blink"}
              style={on ? { filter: "drop-shadow(0 0 3px #4ade80)", animationDelay: `${i * 0.3}s` } : ({ "--cg-dur": "0.9s", "--cg-delay": `${i * 0.2}s` } as React.CSSProperties)}
            />
          </g>
        ))}

      {/* a janelinha com a Catarina lá dentro */}
      <circle cx="60" cy="120" r="17" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
      <circle cx="60" cy="120" r="12.5" fill={`url(#${id}-glass)`} />
      <g clipPath={`url(#${id}-window)`}>
        <g transform={tilt ? `rotate(${-tilt} 60 120)` : undefined}>
        <path d="M49 136 C51 129 69 129 71 136 Z" fill="#f8fafc" />
        <path d="M52 128 C51 116 56 111 60 111 C65 111 69 116 68 128 Z" fill="#24150f" />
        <circle cx="60" cy="122" r="5.6" fill="#c68a62" />
        <path d="M54.5 121 C55 115.5 65 115.5 65.5 121 C63 118 57 118 54.5 121 Z" fill="#24150f" />
        <circle cx="58" cy="122.5" r="0.9" fill="#1e1b2e" />
        <circle cx="62" cy="122.5" r="0.9" fill="#1e1b2e" />
        <path d="M58.3 125 Q60 126.4 61.7 125" stroke="#7a2e1f" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M53.5 122 C53 113 67 113 66.5 122" stroke="#d946ef" strokeWidth="1.3" fill="none" />
        </g>
      </g>
      <path d="M51 114 C53 110 57 108 61 108" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.65" />

      {/* faixas e o nome */}
      <rect x="28" y="146" width="64" height="5" fill="#d946ef" />
      <rect x="28" y="154" width="64" height="2" fill="#7c3aed" />
      <text x="60" y="191" transform="rotate(-90 60 191)" textAnchor="middle" dominantBaseline="middle" fontSize="9.5" fontWeight="900" fontFamily="sans-serif" fill="#7c3aed" letterSpacing="0.8">
        VITÓRIA-1
      </text>
      <path d="M85 80 L85 230" stroke="#94a3b8" strokeWidth="5" opacity="0.35" />

      {/* aleta da frente */}
      <path d="M56.5 226 L63.5 226 L63 258 L57 258 Z" fill="#8b5cf6" stroke="#3b0764" strokeWidth="1.2" />
    </g>
  );
}

export function Rocket({
  flame = "off",
  lights,
  tilt = 0,
  className = "",
  style,
}: {
  flame?: FlameSize;
  lights?: [boolean, boolean, boolean];
  tilt?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 120 300" className={`overflow-visible ${className}`} style={style} aria-hidden="true">
      <RocketShape flame={flame} lights={lights} tilt={tilt} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Satélite da Constelação Lúmen (e a Lúmen-Mãe, o satélite principal)
// ---------------------------------------------------------------------------

function SolarPanel({ x, y, w, h, on }: { x: number; y: number; w: number; h: number; on: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="2" fill={on ? "#1e3a8a" : "#1f2937"} stroke={on ? "#fbbf24" : "#4b5563"} strokeWidth="1.6" />
      {[1, 2, 3].map((k) => (
        <path key={`v${k}`} d={`M${x + (w * k) / 4} ${y} L${x + (w * k) / 4} ${y + h}`} stroke={on ? "#60a5fa" : "#374151"} strokeWidth="0.8" />
      ))}
      {[1, 2].map((k) => (
        <path key={`h${k}`} d={`M${x} ${y + (h * k) / 3} L${x + w} ${y + (h * k) / 3}`} stroke={on ? "#60a5fa" : "#374151"} strokeWidth="0.8" />
      ))}
      {on && <path d={`M${x + 4} ${y + h - 4} L${x + w * 0.45} ${y + 4} L${x + w * 0.62} ${y + 4} L${x + w * 0.17} ${y + h - 4} Z`} fill="#ffffff" opacity="0.14" />}
    </g>
  );
}

/** O satélite como grupo SVG (desenho de 200×134 a partir de y=-14), pra entrar em outros desenhos. */
export function LumenSatBody({ on = true, mother = false }: { on?: boolean; mother?: boolean }) {
  const id = uid("ls", useId());
  const panels = mother
    ? [
        [4, 36, 56, 30],
        [4, 74, 56, 30],
        [140, 36, 56, 30],
        [140, 74, 56, 30],
      ]
    : [
        [6, 50, 56, 40],
        [138, 50, 56, 40],
      ];
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="0.5" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
      </defs>
      {mother && on && <circle cx="100" cy="70" r="58" fill="#e879f9" opacity="0.18" className="cg-anim-glow" style={{ filter: "blur(10px)" }} />}
      {/* hastes e painéis solares */}
      <path d="M60 70 L82 70 M118 70 L140 70" stroke="#94a3b8" strokeWidth="2.5" />
      {mother && <path d="M60 51 L60 89 M140 51 L140 89" stroke="#94a3b8" strokeWidth="2" />}
      {panels.map(([x, y, w, h], i) => (
        <SolarPanel key={i} x={x} y={y} w={w} h={h} on={on} />
      ))}
      {/* corpo dourado (papel térmico amassadinho) */}
      <rect x={mother ? 76 : 80} y={mother ? 44 : 50} width={mother ? 48 : 40} height={mother ? 52 : 40} rx="5" fill={on ? `url(#${id}-gold)` : "#78716c"} stroke={on ? "#92400e" : "#44403c"} strokeWidth="1.3" />
      <path d="M84 58 L94 54 L104 60 L114 55 M84 84 L92 80 L102 86 L114 81" stroke={on ? "#b45309" : "#57534e"} strokeWidth="1" fill="none" opacity="0.6" />
      {/* emblema da Constelação Lúmen */}
      <circle cx="100" cy="70" r={mother ? 10 : 8} fill="#7c3aed" stroke="#fde68a" strokeWidth="1.3" />
      <path d={mother ? "M100 62 L102.4 67.6 L108 68.2 L103.8 72 L105 78 L100 75 L95 78 L96.2 72 L92 68.2 L97.6 67.6 Z" : "M97 65 L97 75 L104 75"} fill={mother ? "#fde68a" : "none"} stroke={mother ? "none" : "#f5f3ff"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* anel da Lúmen-Mãe */}
      {mother && (
        <ellipse cx="100" cy="70" rx="38" ry="11" fill="none" stroke={on ? "#e879f9" : "#6b7280"} strokeWidth="2" strokeDasharray="14 10" className="cg-anim-aura-flow" style={{ "--cg-dur": "1.6s" } as React.CSSProperties} />
      )}
      {/* antena parabólica e a antena com a luzinha */}
      <path d={`M100 ${mother ? 44 : 50} L100 40`} stroke="#94a3b8" strokeWidth="2.4" />
      <path d="M84 34 Q100 50 116 34 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.2" />
      <path d="M100 42 L100 27" stroke="#94a3b8" strokeWidth="1.4" />
      <circle cx="100" cy="26" r="2.4" fill="#cbd5e1" />
      <path d={`M114 ${mother ? 44 : 50} L126 26`} stroke="#94a3b8" strokeWidth="1.6" />
      <circle
        cx="126"
        cy="25"
        r="3.4"
        fill={on ? "#22d3ee" : "#ef4444"}
        className={on ? "cg-anim-twinkle" : "cg-anim-aura-blink"}
        style={on ? { filter: "drop-shadow(0 0 4px #22d3ee)" } : ({ "--cg-dur": "0.8s" } as React.CSSProperties)}
      />
      {on ? (
        <g fill="none" stroke="#67e8f9" strokeWidth="2.4" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 3px #22d3ee)" }}>
          {["M92 14 Q100 6 108 14", "M86 8 Q100 -4 114 8", "M80 2 Q100 -14 120 2"].map((d, i) => (
            <path key={d} d={d} className="cg-anim-aura-blink" style={{ "--cg-dur": "1.5s", "--cg-delay": `${i * 0.25}s` } as React.CSSProperties} />
          ))}
        </g>
      ) : (
        <g className="cg-anim-aura-blink" style={{ "--cg-dur": "1.2s" } as React.CSSProperties}>
          <circle cx="76" cy="36" r="8" fill="#7f1d1d" stroke="#f87171" strokeWidth="1.4" />
          <path d="M72.5 32.5 L79.5 39.5 M79.5 32.5 L72.5 39.5" stroke="#fecaca" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

export function LumenSat({ on = true, mother = false, className = "", style }: { on?: boolean; mother?: boolean; className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 -14 200 134" className={`overflow-visible ${className}`} style={style} aria-hidden="true">
      <LumenSatBody on={on} mother={mother} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Estação Espacial Internacional (ISS): a treliça comprida, os oito painéis
// solares dourados, os radiadores e os módulos no meio.
// ---------------------------------------------------------------------------

export function ISS({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const id = uid("is", useId());
  const wings = [30, 66, 228, 264];
  return (
    <svg viewBox="0 0 320 150" className={`overflow-visible ${className}`} style={style} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-sol`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbbf24" />
          <stop offset="0.5" stopColor="#b45309" />
          <stop offset="1" stopColor="#713f12" />
        </linearGradient>
      </defs>
      {wings.map((x) => (
        <g key={x}>
          <path d={`M${x + 12} 66 L${x + 12} 84`} stroke="#94a3b8" strokeWidth="2.5" />
          {[6, 90].map((y) => (
            <g key={y}>
              <rect x={x} y={y} width="24" height="54" fill={`url(#${id}-sol)`} stroke="#fde68a" strokeWidth="0.8" />
              <path
                d={`M${x + 12} ${y} L${x + 12} ${y + 54} ${Array.from({ length: 8 }, (_, k) => `M${x} ${y + 6 * (k + 1)} L${x + 24} ${y + 6 * (k + 1)}`).join(" ")}`}
                stroke="#78350f"
                strokeWidth="0.6"
                opacity="0.7"
              />
            </g>
          ))}
        </g>
      ))}
      {/* treliça */}
      <rect x="18" y="70" width="284" height="10" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
      <path d={Array.from({ length: 28 }, (_, i) => `M${18 + i * 10} 70 L${28 + i * 10} 80`).join(" ")} stroke="#64748b" strokeWidth="0.7" />
      {/* radiadores */}
      <path d="M118 66 L104 34 L122 34 L134 66 Z M196 84 L210 116 L192 116 L180 84 Z" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
      {/* módulos */}
      <rect x="126" y="62" width="70" height="26" rx="12" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.2" />
      <rect x="148" y="36" width="24" height="78" rx="11" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.2" />
      <rect x="196" y="66" width="22" height="18" rx="8" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
      <rect x="104" y="68" width="22" height="14" rx="6" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
      <circle cx="160" cy="118" r="7" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
      <circle cx="160" cy="118" r="3.5" fill="#38bdf8" />
      {[136, 146, 176, 186].map((x) => (
        <circle key={x} cx={x} cy="75" r="2" fill="#0ea5e9" />
      ))}
      {/* luzes de navegação */}
      <circle cx="18" cy="75" r="3" fill="#ef4444" className="cg-anim-aura-blink" style={{ "--cg-dur": "1s" } as React.CSSProperties} />
      <circle cx="302" cy="75" r="3" fill="#22c55e" className="cg-anim-aura-blink" style={{ "--cg-dur": "1s", "--cg-delay": "0.5s" } as React.CSSProperties} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// A nave deitada com o braço robótico (que segura um satélite) e o escudo do Mago
// ---------------------------------------------------------------------------

export function ShipWithArm({ grab = null, shield = false, flame = "small", className = "" }: { grab?: "lumen" | "mae" | null; shield?: boolean; flame?: FlameSize; className?: string }) {
  const id = uid("sh", useId());
  return (
    <svg viewBox="0 0 440 240" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-bubble`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.6" stopColor="#8b5cf6" stopOpacity="0" />
          <stop offset="0.9" stopColor="#a78bfa" stopOpacity="0.16" />
          <stop offset="1" stopColor="#ddd6fe" stopOpacity="0.4" />
        </radialGradient>
      </defs>
      {shield && (
        <g>
          <ellipse cx="150" cy="150" rx="150" ry="74" fill={`url(#${id}-bubble)`} className="cg-anim-beam" />
          <path d="M40 112 C70 88 120 78 170 80" stroke="#f5f3ff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />
          <ellipse cx="150" cy="150" rx="150" ry="74" fill="none" stroke="#c4b5fd" strokeWidth="2.5" strokeDasharray="14 10" className="cg-anim-aura-flow" style={{ "--cg-dur": "1.2s", filter: "drop-shadow(0 0 6px #a78bfa)" } as React.CSSProperties} />
          <ellipse cx="150" cy="150" rx="132" ry="60" fill="none" stroke="#fde68a" strokeWidth="1" opacity="0.5" />
        </g>
      )}
      {/* o foguete deitado (bico pra direita) */}
      <g transform="translate(212 113) rotate(90) scale(0.62)">
        <RocketShape flame={flame} tilt={90} />
      </g>
      {/* o braço: ombro → cotovelo → punho → garra, balançando de leve */}
      <g className="cg-anim-aura-turn" style={{ "--cg-turn": "3deg", "--cg-dur": "3.6s", transformOrigin: "150px 132px" } as React.CSSProperties}>
        <path d="M150 132 L232 58" stroke="#e2e8f0" strokeWidth="11" strokeLinecap="round" />
        <path d="M150 132 L232 58" stroke="#d946ef" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        <path d="M232 58 L318 82" stroke="#e2e8f0" strokeWidth="9" strokeLinecap="round" />
        <path d="M232 58 L318 82" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        <circle cx="150" cy="132" r="10" fill="#475569" stroke="#1e293b" strokeWidth="1.5" />
        <circle cx="232" cy="58" r="9" fill="#475569" stroke="#1e293b" strokeWidth="1.5" />
        <circle cx="232" cy="58" r="3" fill="#22d3ee" />
        <circle cx="318" cy="82" r="7" fill="#475569" stroke="#1e293b" strokeWidth="1.5" />
        <path d="M322 76 L340 66 L350 74 M322 88 L340 98 L350 90" stroke="#94a3b8" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {grab && (
          <g transform={`translate(${grab === "mae" ? 300 : 312} ${grab === "mae" ? 22 : 40}) scale(${grab === "mae" ? 0.62 : 0.42})`}>
            <LumenSatBody mother={grab === "mae"} />
          </g>
        )}
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// A cabine do Vitória-1: a moldura da janela grande (o espaço aparece atrás),
// o painel com botões piscando e, no alarme, a luz vermelha.
// ---------------------------------------------------------------------------

export function Cockpit({ alarm = false }: { alarm?: boolean }) {
  const id = uid("cp", useId());
  return (
    <>
      <svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-frame`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#334155" />
            <stop offset="1" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id={`${id}-desk`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1e293b" />
            <stop offset="1" stopColor="#020617" />
          </linearGradient>
        </defs>
        <path d="M-400 -100 L1200 -100 L1200 560 L-400 560 Z M130 40 C100 40 90 50 90 80 L90 270 C90 296 104 306 130 306 L670 306 C696 306 710 296 710 270 L710 80 C710 50 700 40 670 40 Z" fill={`url(#${id}-frame)`} fillRule="evenodd" />
        <path d="M130 40 C100 40 90 50 90 80 L90 270 C90 296 104 306 130 306 L670 306 C696 306 710 296 710 270 L710 80 C710 50 700 40 670 40 Z" fill="none" stroke="#64748b" strokeWidth="5" />
        {[110, 690].flatMap((x) => [70, 170, 280].map((y) => <circle key={`${x}-${y}`} cx={x - (x > 400 ? -8 : 8)} cy={y} r="3.5" fill="#94a3b8" />))}
        {/* o painel */}
        <path d="M-400 330 L1200 330 L1200 560 L-400 560 Z" fill={`url(#${id}-desk)`} />
        <path d="M-400 330 L1200 330" stroke="#a855f7" strokeWidth="3" opacity="0.6" />
        {Array.from({ length: 14 }, (_, i) => (
          <rect
            key={i}
            x={60 + i * 50}
            y={350 + (i % 2) * 22}
            width="22"
            height="12"
            rx="3"
            fill={["#22d3ee", "#4ade80", "#fbbf24", "#e879f9", "#f87171"][i % 5]}
            className="cg-anim-twinkle"
            style={{ animationDelay: `${(i * 0.37) % 2}s` }}
          />
        ))}
        <rect x="300" y="390" width="200" height="50" rx="8" fill="#082f49" stroke="#0ea5e9" strokeWidth="2" />
        <path d="M312 420 C330 402 346 434 364 414 C382 396 398 432 416 412 C434 394 450 428 488 410" stroke="#22d3ee" strokeWidth="2" fill="none" className="cg-anim-beam" />
      </svg>
      {alarm && <div className="cg-anim-alarm pointer-events-none absolute inset-0 bg-red-600" style={{ mixBlendMode: "screen" }} />}
    </>
  );
}

/** Tanque de oxigênio com o nível (que vai descendo devagar); `low` = no fim, vermelho piscando. */
export function O2Tank({ level = 0.7, low = false, className = "" }: { level?: number; low?: boolean; className?: string }) {
  const id = uid("o2", useId());
  const top = 50 + (1 - level) * 140;
  return (
    <svg viewBox="0 0 120 230" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-liquid`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={low ? "#fca5a5" : "#a5f3fc"} />
          <stop offset="1" stopColor={low ? "#b91c1c" : "#0284c7"} />
        </linearGradient>
        <clipPath id={`${id}-glass`}>
          <rect x="34" y="50" width="52" height="140" rx="20" />
        </clipPath>
      </defs>
      <rect x="50" y="10" width="20" height="18" rx="4" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
      <rect x="22" y="26" width="76" height="190" rx="30" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
      <rect x="34" y="50" width="52" height="140" rx="20" fill="#0f172a" />
      <g clipPath={`url(#${id}-glass)`}>
        <rect
          x="34"
          y={top}
          width="52"
          height={190 - top}
          fill={`url(#${id}-liquid)`}
          className={low ? "cg-anim-aura-blink" : "cg-anim-astro-drain"}
          style={low ? ({ "--cg-dur": "0.9s" } as React.CSSProperties) : ({ "--cg-dur": "40s", "--cg-to": "0.82" } as React.CSSProperties)}
        />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={46 + i * 13} cy="180" r="2.6" fill="#f0f9ff" opacity="0.8" className="cg-anim-aura-rise" style={{ "--cg-dur": "2.2s", "--cg-delay": `${i * 0.7}s` } as React.CSSProperties} />
        ))}
      </g>
      <path d="M40 60 L40 176" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.25" />
      {[0.25, 0.5, 0.75].map((k) => (
        <path key={k} d={`M80 ${50 + k * 140} L86 ${50 + k * 140}`} stroke="#94a3b8" strokeWidth="1.5" />
      ))}
      <text x="60" y="46" textAnchor="middle" fontSize="13" fontWeight="900" fontFamily="sans-serif" fill={low ? "#dc2626" : "#0369a1"}>
        O₂
      </text>
    </svg>
  );
}

/** O relógio do oxigênio, contando de verdade os segundos que faltam. */
export function O2Timer({ seconds, low = false }: { seconds: number; low?: boolean }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <div
      className={`cg-anim-pop rounded-xl border-2 bg-black/70 px-3 py-1 font-mono text-lg font-black tracking-widest sm:text-2xl ${
        low ? "border-red-400 text-red-300" : "border-cyan-300/70 text-cyan-200"
      }`}
      style={{ boxShadow: low ? "0 0 24px rgba(239,68,68,0.6)" : "0 0 20px rgba(34,211,238,0.4)" }}
    >
      <span className={low ? "cg-anim-aura-blink" : undefined} style={{ "--cg-dur": "1s" } as React.CSSProperties}>
        O₂ {mm}:{ss}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Radar: os satélites Lúmen no lugar e a Lúmen-Mãe sendo puxada pro TON 618
// ---------------------------------------------------------------------------

export function Radar({ className = "" }: { className?: string }) {
  const id = uid("rd", useId());
  return (
    <svg viewBox="0 0 200 200" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-sweep`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#22d3ee" stopOpacity="0" />
          <stop offset="1" stopColor="#22d3ee" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill="#031a24" stroke="#0e7490" strokeWidth="4" />
      {[30, 60, 90].map((r) => (
        <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.3" />
      ))}
      <path d="M100 4 L100 196 M4 100 L196 100" stroke="#22d3ee" strokeWidth="1" opacity="0.25" />
      <g className="cg-anim-orbit" style={{ "--cg-origin": "100px 100px", "--cg-dur": "3s" } as React.CSSProperties}>
        <path d="M100 100 L100 6 A94 94 0 0 1 166 33 Z" fill={`url(#${id}-sweep)`} />
      </g>
      {/* os Lúmen no lugar */}
      {[
        [70, 120],
        [128, 132],
        [80, 72],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#67e8f9" className="cg-anim-twinkle" style={{ animationDelay: `${i * 0.4}s` }} />
      ))}
      {/* o TON 618 na borda */}
      <circle cx="166" cy="38" r="12" fill="#000" stroke="#fb923c" strokeWidth="3" style={{ filter: "drop-shadow(0 0 5px #f97316)" }} />
      <text x="166" y="64" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fdba74" fontFamily="sans-serif">
        TON 618
      </text>
      {/* a Lúmen-Mãe escorregando pra lá */}
      <g className="cg-anim-astro-slide" style={{ "--cg-dur": "4.5s", "--cg-tx": "50px", "--cg-ty": "-46px" } as React.CSSProperties}>
        <circle cx="112" cy="88" r="6" fill="#f0abfc" stroke="#fff" strokeWidth="1.5" style={{ filter: "drop-shadow(0 0 4px #e879f9)" }} />
      </g>
      <text x="100" y="186" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#a5f3fc" fontFamily="sans-serif" letterSpacing="1">
        RADAR LÚMEN
      </text>
    </svg>
  );
}

/** As barrinhas de sinal: `bars` acesas de 4; a próxima pisca tentando conectar. */
export function SignalBars({ bars = 2, className = "" }: { bars?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 80" className={`overflow-visible ${className}`} aria-hidden="true">
      {[0, 1, 2, 3].map((i) => {
        const h = 18 + i * 18;
        const on = i < bars;
        return (
          <rect
            key={i}
            x={6 + i * 24}
            y={76 - h}
            width="16"
            height={h}
            rx="3"
            fill={on ? "#22d3ee" : "#334155"}
            stroke={on ? "#a5f3fc" : "#475569"}
            strokeWidth="1.5"
            className={on ? "cg-anim-light-up" : i === bars ? "cg-anim-aura-blink" : undefined}
            style={on ? ({ "--cg-delay": `${0.6 + i * 0.6}s`, filter: "drop-shadow(0 0 5px #22d3ee)" } as React.CSSProperties) : ({ "--cg-dur": "1s" } as React.CSSProperties)}
          />
        );
      })}
    </svg>
  );
}

/** O símbolo do Wi-Fi: `arcs` acesos de 3; `crossed` = sem sinal (cortado em vermelho). */
export function WifiGlyph({ arcs = 3, crossed = false, color = "#22d3ee", className = "", style }: { arcs?: number; crossed?: boolean; color?: string; className?: string; style?: React.CSSProperties }) {
  const paths = ["M38 62 Q50 50 62 62", "M26 50 Q50 28 74 50", "M14 38 Q50 6 86 38"];
  return (
    <svg viewBox="0 0 100 90" className={`overflow-visible ${className}`} style={style} aria-hidden="true">
      {paths.map((d, i) => (
        <path key={d} d={d} fill="none" stroke={i < arcs && !crossed ? color : "#64748b"} strokeWidth="9" strokeLinecap="round" style={i < arcs && !crossed ? { filter: `drop-shadow(0 0 5px ${color})` } : undefined} />
      ))}
      <circle cx="50" cy="74" r="7" fill={crossed ? "#64748b" : color} />
      {crossed && <path d="M16 14 L84 84" stroke="#ef4444" strokeWidth="9" strokeLinecap="round" />}
    </svg>
  );
}

/** Celular travado: o Wi-Fi cortado e a rodinha de carregar que não sai do lugar. */
export function PhoneNoSignal({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 60 100" className={`overflow-visible ${className}`} style={style} aria-hidden="true">
      <rect x="4" y="4" width="52" height="92" rx="9" fill="#111827" stroke="#475569" strokeWidth="2" />
      <rect x="9" y="12" width="42" height="72" rx="3" fill="#1e1b4b" />
      <rect x="24" y="7" width="12" height="2.5" rx="1.2" fill="#334155" />
      <g transform="translate(15 22) scale(0.3)">
        <WifiGlyphShape />
      </g>
      <g className="cg-anim-orbit" style={{ "--cg-origin": "30px 64px", "--cg-dur": "1.2s" } as React.CSSProperties}>
        <path d="M30 56 A8 8 0 1 1 22.4 61.5" stroke="#a5b4fc" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      <circle cx="30" cy="90" r="2.4" fill="#334155" />
    </svg>
  );
}

function WifiGlyphShape() {
  return (
    <g>
      {["M38 62 Q50 50 62 62", "M26 50 Q50 28 74 50", "M14 38 Q50 6 86 38"].map((d) => (
        <path key={d} d={d} fill="none" stroke="#64748b" strokeWidth="9" strokeLinecap="round" />
      ))}
      <circle cx="50" cy="74" r="7" fill="#64748b" />
      <path d="M16 14 L84 84" stroke="#ef4444" strokeWidth="10" strokeLinecap="round" />
    </g>
  );
}

/** A luneta da Catarina (no tripé, apontando pro céu). */
export function Telescope({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 200" className={`overflow-visible ${className}`} aria-hidden="true">
      <path d="M80 112 L44 196 M80 112 L116 196 M80 112 L80 198" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
      <circle cx="80" cy="110" r="9" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
      <g transform="rotate(-38 80 104)">
        <rect x="22" y="92" width="118" height="24" rx="6" fill="#7c3aed" stroke="#3b0764" strokeWidth="1.5" />
        <rect x="128" y="88" width="20" height="32" rx="4" fill="#5b21b6" stroke="#3b0764" strokeWidth="1.5" />
        <rect x="58" y="92" width="8" height="24" fill="#fbbf24" />
        <rect x="98" y="92" width="8" height="24" fill="#fbbf24" />
        <rect x="8" y="96" width="16" height="16" rx="3" fill="#334155" />
        <ellipse cx="148" cy="104" rx="3" ry="14" fill="#a5f3fc" className="cg-anim-glow" />
        <path d="M30 98 L124 98" stroke="#c4b5fd" strokeWidth="2" opacity="0.6" />
      </g>
    </svg>
  );
}
