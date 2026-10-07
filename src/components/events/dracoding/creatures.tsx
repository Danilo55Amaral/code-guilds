"use client";

import { Pt, RimGradient, animVars, claw, ellipsePoints, jagged, mirror, poly, useSvgId } from "./kit";

// ============================================================================
// AS CRIATURAS DE A NOITE DE DRACODING — corvos, morcegos, bruxas, palhaços
// sombrios, aranhas, fantasmas, o exército de vampiros, os lobos da alcateia,
// as abóboras amaldiçoadas e os moradores de Codópolis. Peças menores que os
// vilões, no mesmo estilo pontudo, pra espalhar pelas cenas.
// ============================================================================

// ---------------------------------------------------------------------------
// Folha de bordo (enfeite de outono), centrada em (x, y)
// ---------------------------------------------------------------------------

const MAPLE = "M0 -10 L2 -5 L6 -7 L5 -2 L10 -2 L6 2 L8 6 L2 4 L0 9 L-2 4 L-8 6 L-6 2 L-10 -2 L-5 -2 L-6 -7 L-2 -5 Z";

export function MapleLeaf({ x, y, s = 1, rotate = 0, color = "#dc2626" }: { x: number; y: number; s?: number; rotate?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
      <path d={MAPLE} fill={color} stroke="#450a0a" strokeWidth="0.6" strokeLinejoin="round" />
      <path d="M0 9 L0 14 M0 6 L0 -6 M0 2 L-5 -1 M0 2 L5 -1" stroke="#450a0a" strokeWidth="0.7" opacity="0.7" />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Corvo: pousado (olhando pra esquerda, balançando a cabeça) ou voando
// ---------------------------------------------------------------------------

export function Crow({ perched = false }: { perched?: boolean }) {
  if (!perched) {
    return (
      <g>
        <g className="cg-anim-flap">
          <path d="M26 20 L12 4 L4 2 L10 10 L2 12 L14 16 Z M30 20 L44 4 L52 2 L46 10 L54 12 L42 16 Z" fill="#0a0710" stroke="#4c1d95" strokeWidth="0.6" />
        </g>
        <path d={poly([[16, 20], [28, 16], [40, 20], [46, 24], [38, 26], [26, 26]])} fill="#0a0710" />
        <path d="M16 20 L8 21 L16 23 Z" fill="#3f3f46" />
        <circle cx="19" cy="20.5" r="1.1" fill="#ef4444" />
      </g>
    );
  }
  return (
    <g>
      <path d={poly([[18, 12], [32, 12], [44, 18], [56, 28], [46, 28], [52, 36], [38, 32], [22, 32], [14, 26]])} fill="#0a0710" stroke="#6d28d9" strokeWidth="0.8" strokeLinejoin="round" />
      <path d="M26 18 L40 20 L48 27" stroke="#7c3aed" strokeWidth="1" fill="none" opacity="0.6" />
      <path d="M26 32 L25 39 M33 32 L34 39 M22 39 L28 39 M30 39 L37 39" stroke="#3f3f46" strokeWidth="1.4" strokeLinecap="round" />
      <g className="cg-anim-swing" style={animVars({ dur: 2.6, angle: 9, origin: "100% 100%" })}>
        <path d={poly([[6, 12], [14, 4], [24, 6], [26, 16], [16, 18]])} fill="#0a0710" stroke="#6d28d9" strokeWidth="0.8" />
        <path d="M6 10 L-4 12 L6 15 Z" fill="#52525b" />
        <circle cx="12" cy="9" r="1.6" fill="#ef4444" style={{ filter: "drop-shadow(0 0 2px #ef4444)" }} />
      </g>
    </g>
  );
}

/** Revoada de corvos fugindo do milharal: cada um sai voando pra cima numa direção. */
export function CrowBurst({ className = "" }: { className?: string }) {
  const crows: [number, number, number, number, number][] = [
    // [esquerda %, topo %, dx, dy, atraso]
    [30, 55, 160, -260, 0.2],
    [44, 60, -120, -300, 0.35],
    [52, 52, 220, -200, 0.5],
    [38, 64, -240, -180, 0.65],
    [60, 58, 120, -320, 0.8],
    [24, 60, -80, -340, 0.95],
    [66, 62, 260, -240, 1.1],
  ];
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      {crows.map(([left, top, dx, dy, delay], i) => (
        <svg
          key={i}
          viewBox="0 0 56 30"
          className="cg-anim-shatter absolute w-[5%] min-w-[30px] max-w-[64px] overflow-visible"
          style={{ left: `${left}%`, top: `${top}%`, ...animVars({ dx, dy, delay, spin: 0 }) }}
          aria-hidden="true"
        >
          <g transform={dx < 0 ? "translate(56 0) scale(-1 1)" : undefined}>
            <Crow />
          </g>
        </svg>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Morcego anguloso e a revoada cruzando a tela
// ---------------------------------------------------------------------------

const BAT_WINGS = "M0 -3 L-4 -6 L-10 -9 L-18 -8 L-27 -13 L-22 -3 L-25 4 L-16 1 L-12 7 L-6 2 L0 6 L6 2 L12 7 L16 1 L25 4 L22 -3 L27 -13 L18 -8 L10 -9 L4 -6 Z";

export function Bat({ eyes = true, fill = "#07050b" }: { eyes?: boolean; fill?: string }) {
  return (
    <g>
      <path className="cg-anim-flap" d={BAT_WINGS} fill={fill} stroke="#4c0519" strokeWidth="0.5" strokeLinejoin="round" />
      <path d="M-3.5 -4 L-4.5 -10 L-1 -5 Z M3.5 -4 L4.5 -10 L1 -5 Z M-3 -5 L3 -5 L2 3 L-2 3 Z" fill={fill} />
      {eyes && <path d="M-2 -3 L-0.6 -2.4 L-2 -1.8 Z M2 -3 L0.6 -2.4 L2 -1.8 Z" fill="#f43f5e" />}
    </g>
  );
}

const SWARM = [
  { top: 10, size: 46, duration: 9, delay: 0 },
  { top: 22, size: 28, duration: 12, delay: -4 },
  { top: 6, size: 34, duration: 10.5, delay: -7 },
  { top: 30, size: 22, duration: 14, delay: -2 },
  { top: 16, size: 38, duration: 8, delay: -5.5 },
  { top: 36, size: 26, duration: 11, delay: -9 },
  { top: 4, size: 20, duration: 13, delay: -11 },
  { top: 26, size: 32, duration: 9.5, delay: -3 },
];

/** Morcegos (ou corvos) cruzando a tela batendo as asas. `speed` < 1 = mais rápido (fugindo). */
export function BatSwarm({ count = SWARM.length, crows = false, speed = 1 }: { count?: number; crows?: boolean; speed?: number }) {
  return (
    <>
      {SWARM.slice(0, count).map((b, i) => (
        <span
          key={i}
          className="cg-anim-bat pointer-events-none absolute"
          style={{ top: `${b.top}%`, width: crows ? b.size * 1.3 : b.size, "--cg-duration": `${b.duration * speed}s`, "--cg-delay": `${b.delay * speed}s` } as React.CSSProperties}
        >
          {crows ? (
            <svg viewBox="0 0 56 30" className="w-full overflow-visible" style={{ transform: "scaleX(-1)" }} aria-hidden="true">
              <Crow />
            </svg>
          ) : (
            <svg viewBox="-28 -14 56 24" className="w-full overflow-visible" aria-hidden="true">
              <Bat />
            </svg>
          )}
        </span>
      ))}
    </>
  );
}

/** Revoada saindo de um ponto pra todos os lados (o Dracoding se desfazendo em morcegos). */
export function BatBurst({ className = "", count = 18, delay = 1 }: { className?: string; count?: number; delay?: number }) {
  return (
    <div className={`pointer-events-none absolute ${className}`}>
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2 + (i % 3) * 0.2;
        const dist = 260 + (i % 5) * 70;
        return (
          <svg
            key={i}
            viewBox="-28 -14 56 24"
            className="cg-anim-shatter absolute left-1/2 top-1/2 w-10 overflow-visible sm:w-14"
            style={animVars({ dx: Math.round(Math.cos(a) * dist), dy: Math.round(Math.sin(a) * dist * 0.7 - 80), spin: (i % 2 ? 1 : -1) * 30, delay: delay + (i % 6) * 0.08 })}
            aria-hidden="true"
          >
            <Bat />
          </svg>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bruxa voando na vassoura (de perfil, indo pra direita) — viewBox 180×110
// ---------------------------------------------------------------------------

export function Witch({ className = "" }: { className?: string }) {
  const id = useSvgId();
  const rim = `url(#${id}-rim)`;
  return (
    <svg viewBox="-10 -24 190 120" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <RimGradient id={`${id}-rim`} x1={-10} x2={180} left="#c4b5fd" right="#bef264" leftOpacity={0.6} rightOpacity={0.7} />
        <linearGradient id={`${id}-skin`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3f6212" />
          <stop offset="1" stopColor="#84cc16" />
        </linearGradient>
      </defs>
      {/* vassoura: cabo comprido e as cerdas abertas em leque */}
      <path d="M26 62 L28 76 L-2 92 L-12 82 L-14 70 L-6 58 Z" fill="#a16207" stroke="#422006" strokeWidth="1" strokeLinejoin="round" />
      <g stroke="#713f12" strokeWidth="1.2" strokeLinecap="round">
        {[58, 64, 70, 76, 82, 88].map((y, i) => (
          <path key={y} d={`M26 ${66 + i * 2} L${-12 + (i % 2) * 4} ${y}`} />
        ))}
      </g>
      <path d="M22 70 L172 56" stroke="#5b3a22" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M24 64 L30 76 M28 64 L34 75" stroke="#7c2d12" strokeWidth="2.4" />
      {/* capa em tiras, esvoaçando pra trás */}
      <g className="cg-anim-cape" style={animVars({ dur: 1.6 })}>
        <path d="M106 32 L118 44 L110 68 L92 72 L74 70 L52 64 L60 58 L40 58 L56 50 L38 44 L66 42 L84 34 Z" fill="#2e1065" stroke={rim} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M100 40 L72 52 M98 50 L62 58" stroke="#4c1d95" strokeWidth="2" opacity="0.8" />
      </g>
      {/* corpo, braço na vassoura e bota pontuda */}
      <path d={poly([[104, 30], [124, 34], [130, 60], [142, 62], [140, 70], [110, 70], [98, 54]])} fill="#1e1b4b" stroke={rim} strokeWidth="1.5" />
      <path d={poly([[134, 60], [158, 54], [154, 62], [136, 68]])} fill="#0a0710" />
      <path d="M118 44 L146 60" stroke="#1e1b4b" strokeWidth="6" strokeLinecap="round" />
      <circle cx="147" cy="60" r="3.5" fill={`url(#${id}-skin)`} />
      {/* cabelo, rosto de perfil (nariz e queixo pontudos) e chapéu torto */}
      <g stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" fill="none">
        <path d="M114 24 C106 30 100 38 92 46" />
        <path d="M116 28 C110 36 106 44 98 52" />
        <path d="M112 22 C104 26 98 30 90 36" />
      </g>
      <path d={poly([[114, 20], [126, 18], [134, 26], [146, 30], [133, 33], [131, 38], [136, 46], [122, 42], [114, 34]])} fill={`url(#${id}-skin)`} stroke={rim} strokeWidth="1" />
      <circle cx="127" cy="25" r="1.6" fill="#fde047" style={{ filter: "drop-shadow(0 0 2px #fde047)" }} />
      <path d="M126 36 L131 37" stroke="#1a2e05" strokeWidth="1.2" />
      <path d={poly([[98, 20], [144, 12], [146, 17], [100, 25]])} fill="#1e1b4b" stroke={rim} strokeWidth="1" />
      <path d={poly([[108, 18], [136, 14], [126, 2], [112, -12], [94, -20], [104, -6], [106, 8]])} fill="#1e1b4b" stroke={rim} strokeWidth="1" />
      <path d="M108 16 L136 12" stroke="#a3e635" strokeWidth="2.5" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Palhaço sombrio (viewBox 160×330), fazendo malabarismo com abóboras
// ---------------------------------------------------------------------------

export function Clown({ className = "", balloon = true }: { className?: string; balloon?: boolean }) {
  const id = useSvgId();
  const rim = `url(#${id}-rim)`;
  return (
    <svg viewBox="0 -10 170 340" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <pattern id={`${id}-diamonds`} width="20" height="28" patternUnits="userSpaceOnUse">
          <rect width="20" height="28" fill="#140a24" />
          <path d="M10 0 L20 14 L10 28 L0 14 Z" fill="#6d28d9" />
          <path d="M10 0 L20 14 L10 28 L0 14 Z" fill="none" stroke="#c4b5fd" strokeWidth="0.6" opacity="0.5" />
        </pattern>
        <linearGradient id={`${id}-face`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a8a2bd" />
          <stop offset="1" stopColor="#f8fafc" />
        </linearGradient>
        <RimGradient id={`${id}-rim`} x1={0} x2={170} left="#a5b4fc" right="#fb923c" />
      </defs>
      {/* balão vermelho preso na mão */}
      {balloon && (
        <g className="cg-anim-swing" style={animVars({ dur: 3.4, angle: 6, origin: "50% 100%" })}>
          <path d="M136 226 Q150 140 146 74" stroke="#e5e7eb" strokeWidth="1" fill="none" opacity="0.7" />
          <path d="M146 22 L166 34 L170 56 L158 74 L146 78 L134 74 L122 56 L126 34 Z" fill="#b91c1c" stroke={rim} strokeWidth="1.5" />
          <path d="M134 38 L142 30" stroke="#fecaca" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
          <path d="M143 78 L146 84 L149 78 Z" fill="#7f1d1d" />
        </g>
      )}
      {/* sapatos enormes e pernas compridas */}
      <path d="M58 314 L28 312 L14 320 L22 330 L66 330 Z M92 314 L122 312 L140 318 L134 330 L88 330 Z" fill="#7f1d1d" stroke={rim} strokeWidth="1.5" />
      <path d={poly([[58, 230], [76, 230], [72, 316], [56, 316]])} fill={`url(#${id}-diamonds)`} />
      <path d={poly([[84, 230], [102, 230], [104, 316], [88, 316]])} fill={`url(#${id}-diamonds)`} />
      {/* casaco de losangos com pompons */}
      <path d={poly([[44, 128], [116, 128], [126, 238], [34, 238]])} fill={`url(#${id}-diamonds)`} stroke={rim} strokeWidth="2" />
      {[158, 186, 214].map((y) => (
        <circle key={y} cx="80" cy={y} r="5" fill="#f97316" stroke="#7c2d12" strokeWidth="1" />
      ))}
      {/* braço erguido fazendo malabarismo e braço segurando o balão */}
      <path d={poly([[46, 134], [56, 146], [32, 96], [22, 70], [12, 74], [22, 102]])} fill={`url(#${id}-diamonds)`} stroke={rim} strokeWidth="1.5" />
      <path d={poly([[112, 134], [124, 140], [140, 226], [130, 230]])} fill={`url(#${id}-diamonds)`} stroke={rim} strokeWidth="1.5" />
      <circle cx="17" cy="68" r="7" fill="#f1f5f9" />
      <circle cx="135" cy="230" r="7" fill="#f1f5f9" />
      {[0, 1, 2].map((i) => (
        <g key={i} className="cg-anim-orbit" style={animVars({ dur: 1.8, delay: -i * 0.6, origin: "18px 34px" })}>
          <g transform="translate(18 6)">
            <path d="M0 -8 C6 -8 9 -4 9 0 C9 5 5 8 0 8 C-5 8 -9 5 -9 0 C-9 -4 -6 -8 0 -8 Z" fill="#ea580c" stroke="#7c2d12" strokeWidth="0.8" />
            <path d="M-4 -2 L-1 -1 L-4 1 Z M4 -2 L1 -1 L4 1 Z M-4 3 L4 3 L0 5 Z" fill="#fde047" />
          </g>
        </g>
      ))}
      {/* gola de babados */}
      <path d={jagged(ellipsePoints(80, 128, 46, 12, 16), 7, 7, 83)} fill="#e5e7eb" stroke="#475569" strokeWidth="1" />
      {/* cabeça comprida, cabelo de fogo, maquiagem em losango e sorriso pintado */}
      <g className="cg-anim-swing" style={animVars({ dur: 3, angle: 4, origin: "50% 100%" })}>
        <path d={jagged([[60, 70], [34, 58], [40, 74], [24, 78], [40, 88], [56, 92]], 5, 7, 89)} fill="#ea580c" stroke={rim} strokeWidth="1" />
        <path d={jagged(mirror([[60, 70], [34, 58], [40, 74], [24, 78], [40, 88], [56, 92]], 80), 5, 7, 97)} fill="#ea580c" stroke={rim} strokeWidth="1" />
        <path d={poly([[60, 62], [100, 62], [108, 90], [96, 120], [64, 120], [52, 90]])} fill={`url(#${id}-face)`} stroke={rim} strokeWidth="1.5" />
        <path d={poly([[66, 82], [74, 68], [82, 82], [74, 96]])} fill="#4c1d95" />
        <path d={poly([[86, 82], [94, 68], [102, 82], [94, 96]])} fill="#4c1d95" />
        <g style={{ filter: "drop-shadow(0 0 3px #fde047)" }}>
          <path d="M70 82 L78 81 L74 85 Z M90 81 L98 82 L94 85 Z" fill="#fde047" />
        </g>
        <path d="M64 70 Q74 62 82 72 M86 72 Q94 62 104 70" stroke="#0f0a18" strokeWidth="1.6" fill="none" />
        <path d="M58 102 L70 108 L84 110 L98 108 L110 98 L106 112 L92 120 L76 120 L62 112 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1" />
        <path d="M68 110 L100 109" stroke="#fef2f2" strokeWidth="2" strokeDasharray="3 2" />
        <circle cx="84" cy="96" r="6.5" fill="#dc2626" />
        <circle cx="82" cy="94" r="2" fill="#fecaca" />
        <path d={poly([[68, 50], [92, 48], [90, 64], [70, 66]])} fill="#4c1d95" stroke={rim} strokeWidth="1" />
        <path d={poly([[60, 64], [100, 60], [100, 66], [60, 70]])} fill="#2e1065" />
        <circle cx="74" cy="56" r="3" fill="#f43f5e" />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Aranha de cabeça pra baixo, pendurada no fio (viewBox -70 -70 140 130)
// ---------------------------------------------------------------------------

const SPIDER_LEGS: [number, number, number, number, number, number][] = [
  // [quadril x, y, joelho x, y, ponta x, y] — lado esquerdo; o direito é o espelho
  [-8, -2, -34, -32, -58, -6],
  [-8, 2, -40, -18, -64, 16],
  [-8, 6, -36, -2, -56, 36],
  [-6, 10, -26, 14, -40, 48],
];

export function Spider({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="-70 -70 140 130" className={`overflow-visible ${className}`} style={style} aria-hidden="true">
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {SPIDER_LEGS.flatMap(([hx, hy, kx, ky, tx, ty], i) =>
          [1, -1].map((side) => (
            <g key={`${i}-${side}`} className="cg-anim-swing" style={animVars({ dur: 1.4 + i * 0.2, delay: -i * 0.3, angle: 4, origin: side === 1 ? "100% 50%" : "0% 50%" })}>
              <path d={`M${hx * side} ${hy} L${kx * side} ${ky} L${tx * side} ${ty}`} stroke="#050307" strokeWidth="3.6" />
              <path d={`M${hx * side} ${hy} L${kx * side} ${ky}`} stroke="#7c3aed" strokeWidth="1" opacity="0.5" />
            </g>
          )),
        )}
      </g>
      {/* abdômen (em cima) com a ampulheta vermelha, cabeça embaixo */}
      <path d={poly([[0, -46], [16, -40], [22, -22], [14, -6], [0, 0], [-14, -6], [-22, -22], [-16, -40]])} fill="#120a1f" stroke="#6d28d9" strokeWidth="1.2" />
      <path d="M-5 -34 L5 -34 L0 -25 Z M-5 -16 L5 -16 L0 -25 Z" fill="#dc2626" />
      <path d={poly([[0, -2], [10, 4], [10, 14], [0, 18], [-10, 14], [-10, 4]])} fill="#0b0712" stroke="#6d28d9" strokeWidth="1" />
      <g fill="#f43f5e" style={{ filter: "drop-shadow(0 0 2px #f43f5e)" }}>
        <circle cx="-4" cy="10" r="1.8" />
        <circle cx="4" cy="10" r="1.8" />
        <circle cx="-2" cy="14" r="1.1" />
        <circle cx="2" cy="14" r="1.1" />
      </g>
      <path d={`${claw(-3, 17, -4, 24, 1.4, 0.3)} ${claw(3, 17, 4, 24, 1.4, -0.3)}`} fill="#e5e7eb" />
    </svg>
  );
}

/** Aranha descendo pelo fio até a posição dela e ficando ali, balançando. */
export function HangingSpider({ className, delay = 0, threadVh = 60 }: { className: string; delay?: number; threadVh?: number }) {
  return (
    <div className={`pointer-events-none absolute ${className}`}>
      <div className="cg-anim-spider" style={animVars({ delay })}>
        <div className="absolute bottom-full left-1/2 w-px -translate-x-1/2 bg-slate-200/50" style={{ height: `${threadVh}vh` }} />
        <Spider className="w-full drop-shadow-[0_0_10px_rgba(124,58,237,0.45)]" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fantasma de lençol rasgado (viewBox 100×170)
// ---------------------------------------------------------------------------

export function Wraith({ className = "", style, happy = false }: { className?: string; style?: React.CSSProperties; happy?: boolean }) {
  const id = useSvgId();
  return (
    <svg viewBox="0 0 100 170" className={`overflow-visible ${className}`} style={style} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-sheet`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={happy ? "#fffbeb" : "#f8fafc"} stopOpacity="0.95" />
          <stop offset="0.6" stopColor={happy ? "#fde68a" : "#a5f3fc"} stopOpacity="0.6" />
          <stop offset="1" stopColor={happy ? "#fde68a" : "#67e8f9"} stopOpacity="0" />
        </linearGradient>
      </defs>
      <g style={{ filter: `drop-shadow(0 0 10px ${happy ? "rgba(253,230,138,0.7)" : "rgba(165,243,252,0.6)"})` }}>
        <g className="cg-anim-cape" style={animVars({ dur: 2.2 })}>
          <path
            d="M50 6 C72 6 84 24 84 46 L86 70 L100 84 L84 82 L80 100 Q76 128 62 150 L58 168 L50 150 L44 166 L38 146 Q22 124 20 100 L16 82 L0 84 L14 70 L16 46 C16 24 28 6 50 6 Z"
            fill={`url(#${id}-sheet)`}
          />
        </g>
        <path d="M30 26 C36 16 50 14 60 18" stroke="#fff" strokeWidth="2" fill="none" opacity="0.6" strokeLinecap="round" />
        {happy ? (
          <g fill="#1e1b4b">
            <path d="M34 46 Q40 40 46 46 L44 48 Q40 44 36 48 Z M54 46 Q60 40 66 46 L64 48 Q60 44 56 48 Z" />
            <path d="M40 60 Q50 70 60 60 L58 64 Q50 70 42 64 Z" />
          </g>
        ) : (
          <g fill="#0f172a">
            <path d="M33 40 L46 44 L44 55 L34 53 Z M67 40 L54 44 L56 55 L66 53 Z" />
            <path d="M43 64 L57 64 L54 82 L46 82 Z" />
          </g>
        )}
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Soldado do exército de vampiros (silhueta de capa, olhos vermelhos) — viewBox 80×170
// ---------------------------------------------------------------------------

export function VampireSoldier({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const id = useSvgId();
  return (
    <svg viewBox="0 0 80 170" className={`overflow-visible ${className}`} style={style} aria-hidden="true">
      <defs>
        <RimGradient id={`${id}-rim`} x1={0} x2={80} left="#818cf8" right="#fb7185" />
      </defs>
      <path d={jagged([[40, 40], [58, 50], [70, 120], [78, 168], [2, 168], [10, 120], [22, 50]], 4, 9, 101)} fill="#06040a" stroke={`url(#${id}-rim)`} strokeWidth="1.5" />
      <path d={poly([[28, 50], [16, 30], [26, 34], [24, 20], [36, 42]])} fill="#06040a" stroke={`url(#${id}-rim)`} strokeWidth="1" />
      <path d={poly(mirror([[28, 50], [16, 30], [26, 34], [24, 20], [36, 42]], 40))} fill="#06040a" stroke={`url(#${id}-rim)`} strokeWidth="1" />
      <path d="M40 16 C50 16 54 24 54 32 C54 42 48 50 40 52 C32 50 26 42 26 32 C26 24 30 16 40 16 Z" fill="#0b0810" stroke={`url(#${id}-rim)`} strokeWidth="1" />
      <path d="M26 30 C24 18 32 10 40 10 C48 10 56 18 54 30 C52 24 48 21 44 20 L40 27 L36 20 C32 21 28 24 26 30 Z" fill="#040306" />
      <path d="M26 30 L19 22 L27 35 Z M54 30 L61 22 L53 35 Z" fill="#0b0810" />
      <path d="M31 33 L38 34.5 L35 37 Z M49 33 L42 34.5 L45 37 Z" fill="#f43f5e" className="cg-anim-eye" style={{ filter: "drop-shadow(0 0 3px #f43f5e)" }} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Lobo sentado uivando pra lua (silhueta, de perfil) — viewBox 120×120
// ---------------------------------------------------------------------------

// Sentado de lado, de cabeça erguida pra lua: rabo no chão, costas, orelhas,
// focinho aberto uivando, peito, pata da frente e a coxa de trás.
const HOWLER: Pt[] = [
  [4, 116],
  [10, 104],
  [20, 98],
  [26, 88],
  [30, 76],
  [38, 62],
  [48, 50],
  [56, 40],
  [58, 30],
  [56, 16],
  [64, 26],
  [68, 18],
  [72, 24],
  [82, 12],
  [92, 4],
  [93, 9],
  [86, 16],
  [92, 17],
  [82, 28],
  [78, 38],
  [80, 52],
  [84, 70],
  [86, 92],
  [92, 114],
  [80, 116],
  [76, 96],
  [72, 84],
  [66, 100],
  [70, 116],
  [24, 116],
];

export function HowlingWolf({ className = "", style, color = "#050307", rim = "#fca5a5" }: { className?: string; style?: React.CSSProperties; color?: string; rim?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={`overflow-visible ${className}`} style={style} aria-hidden="true">
      <path d={jagged(HOWLER, 1.8, 6, 103, true, 0.6)} fill={color} stroke={rim} strokeWidth="1.2" strokeOpacity="0.6" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Abóbora entalhada: amaldiçoada (fogo roxo) ou purificada (fogo laranja) — viewBox 100×110
// ---------------------------------------------------------------------------

const PUMPKIN_SHAPE = "M50 36 L64 33 C79 35 89 46 91 60 C93 76 87 90 74 98 L50 102 L26 98 C13 90 7 76 9 60 C11 46 21 35 36 33 Z";
const PUMPKIN_FACE = "M24 56 L42 62 L37 70 Z M76 56 L58 62 L63 70 Z M22 76 L32 80 L38 76 L44 84 L50 78 L56 84 L62 76 L68 80 L78 76 C74 90 62 96 50 96 C38 96 26 90 22 76 Z";

export function CursedPumpkin({ cursed = true, className = "", style }: { cursed?: boolean; className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 -14 100 124" className={`overflow-visible ${className}`} style={style} aria-hidden="true">
      <PumpkinGlyph cursed={cursed} />
    </svg>
  );
}

/** A abóbora em si (nas coordenadas 0..100 × -14..110), pra usar dentro de outro desenho. */
export function PumpkinGlyph({ cursed = true }: { cursed?: boolean }) {
  const id = useSvgId();
  const glow = cursed ? "#c084fc" : "#fbbf24";
  return (
    <g>
      <defs>
        <radialGradient id={`${id}-skin`} cx="62" cy="52" r="56" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={cursed ? "#fb923c" : "#fdba74"} />
          <stop offset="0.5" stopColor={cursed ? "#9a3412" : "#ea580c"} />
          <stop offset="1" stopColor={cursed ? "#3b1206" : "#7c2d12"} />
        </radialGradient>
        <radialGradient id={`${id}-fire`} cx="50" cy="74" r="34" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={cursed ? "#fae8ff" : "#fefce8"} />
          <stop offset="0.45" stopColor={cursed ? "#d946ef" : "#fde047"} />
          <stop offset="1" stopColor={cursed ? "#6b21a8" : "#f97316"} />
        </radialGradient>
        <linearGradient id={`${id}-flame`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#7e22ce" />
          <stop offset="0.6" stopColor="#d946ef" />
          <stop offset="1" stopColor="#fae8ff" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="102" rx="40" ry="6" fill="#000" opacity="0.35" />
      <path d={PUMPKIN_SHAPE} fill={`url(#${id}-skin)`} stroke={cursed ? "#a855f7" : "#fb923c"} strokeOpacity="0.5" strokeWidth="1.5" />
      <path d="M50 38 C46 56 46 84 50 100 M34 36 C24 54 24 84 32 98 M66 36 C76 54 76 84 68 98" stroke="#431407" strokeWidth="1.8" fill="none" opacity="0.5" />
      <path d="M47 36 L44 22 L52 16 L55 20 L52 24 L53 36 Z" fill="#365314" stroke="#1a2e05" strokeWidth="1" />
      <path d={PUMPKIN_FACE} fill="#2a0c03" stroke="#2a0c03" strokeWidth="3.5" strokeLinejoin="round" />
      <g style={{ filter: `drop-shadow(0 0 6px ${glow})` }}>
        <path d={PUMPKIN_FACE} fill={`url(#${id}-fire)`} />
        <path d={PUMPKIN_FACE} fill="#fff" opacity="0.35" className="cg-anim-eye" />
      </g>
      {cursed && (
        <g className="cg-anim-flicker" style={{ filter: "drop-shadow(0 0 8px #d946ef)" }}>
          <path d="M50 30 C38 18 44 4 52 -10 C54 2 64 6 60 18 C68 12 68 4 68 -2 C78 12 70 28 58 32 Z" fill={`url(#${id}-flame)`} />
          <path d="M52 28 C46 20 50 12 54 4 C56 12 60 16 58 24 Z" fill="#fdf4ff" opacity="0.8" />
        </g>
      )}
    </g>
  );
}

// ---------------------------------------------------------------------------
// Moradores de Codópolis fantasiados (silhuetas) — viewBox 50×90
// ---------------------------------------------------------------------------

export type Townsfolk = "bruxinha" | "fantasminha" | "abobora" | "vampirinho";

export function Kid({ kind, dizzy = false, className = "", style }: { kind: Townsfolk; dizzy?: boolean; className?: string; style?: React.CSSProperties }) {
  const fill = "#0a0712";
  return (
    <svg viewBox="0 -18 50 108" className={`overflow-visible ${className}`} style={style} aria-hidden="true">
      {/* pernas e corpo */}
      <path d="M18 88 L20 66 L24 66 L23 88 Z M27 88 L26 66 L30 66 L32 88 Z" fill={fill} />
      {kind === "fantasminha" ? (
        <path d="M25 22 C36 22 40 32 40 44 L42 70 L36 66 L31 72 L25 66 L19 72 L14 66 L8 70 L10 44 C10 32 14 22 25 22 Z" fill="#e2e8f0" opacity="0.92" />
      ) : (
        <>
          <path d={poly([[14, 40], [36, 40], [40, 70], [10, 70]])} fill={kind === "vampirinho" ? "#3b0a14" : fill} />
          <circle cx="25" cy="30" r="10" fill="#1f1a2e" />
        </>
      )}
      {kind === "fantasminha" && <path d="M19 38 L23 40 L22 44 Z M31 38 L27 40 L28 44 Z" fill="#0f172a" />}
      {kind === "bruxinha" && <path d="M10 24 L40 22 L40 25 L10 27 Z M16 24 L34 23 L28 10 L22 -2 L20 12 Z" fill="#4c1d95" />}
      {kind === "vampirinho" && <path d="M14 40 L8 30 L18 34 Z M36 40 L42 30 L32 34 Z" fill="#7f1d1d" />}
      {kind === "abobora" && (
        <g>
          <path d="M34 52 C42 52 46 58 44 64 C42 70 36 72 32 70 C28 72 24 66 26 60 C26 55 30 52 34 52 Z" fill="#ea580c" />
          <path d="M31 58 L33 60 L30 61 Z M37 58 L35 60 L38 61 Z M30 64 L38 64 L34 67 Z" fill="#fde047" />
          <path d="M34 52 Q34 44 28 44" stroke="#71717a" strokeWidth="1" fill="none" />
        </g>
      )}
      {/* tonto, preso no loop: uma espiral girando em cima da cabeça */}
      {dizzy && (
        <g className="cg-anim-orbit" style={animVars({ dur: 1.2, origin: "25px 6px" })}>
          <path d="M25 6 m-7 0 a7 3 0 1 0 14 0 a7 3 0 1 0 -14 0" stroke="#fde047" strokeWidth="1.4" fill="none" strokeDasharray="4 3" />
          <circle cx="32" cy="6" r="1.6" fill="#fde047" />
        </g>
      )}
    </svg>
  );
}
