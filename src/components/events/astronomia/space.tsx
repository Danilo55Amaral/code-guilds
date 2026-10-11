"use client";

import { useId } from "react";

// ============================================================================
// O ESPAÇO DE ASTRONOMIA EM: SALVE O WI-FI — o céu (da manhã sem sinal até o
// coração da galáxia do TON 618), as estrelas, as nebulosas, a Terra girando
// (de dia, apagada sem sinal ou acesa com o Wi-Fi de volta), os meteoros, o
// túnel de luz da viagem, o buraco de minhoca com os três anéis e o holograma
// do espaço-tempo que a Catarina usa pra explicar o plano. Tudo ocupa o pai
// (absolute) ou vira um SVG que cresce com a classe que receber.
// ============================================================================

export type SpaceSkyVariant = "manha" | "observatorio" | "terra" | "orbita" | "galaxia" | "festa" | "tunel";

const SKIES: Record<SpaceSkyVariant, string> = {
  manha: "linear-gradient(180deg, #172554 0%, #3730a3 30%, #a855f7 58%, #f472b6 78%, #fdba74 100%)",
  observatorio: "linear-gradient(180deg, #05061a 0%, #141045 45%, #3b1d6e 75%, #7e2f7a 100%)",
  terra: "radial-gradient(120% 70% at 50% 115%, #1e3a8a 0%, #0b1437 45%, #030515 100%)",
  orbita:
    "radial-gradient(60% 50% at 75% 25%, rgba(124,58,237,0.28), transparent 70%), radial-gradient(50% 40% at 12% 70%, rgba(14,165,233,0.2), transparent 70%), linear-gradient(180deg, #02030c 0%, #070a24 60%, #0b0f33 100%)",
  galaxia:
    "radial-gradient(45% 40% at 50% 45%, rgba(251,146,60,0.32), transparent 70%), radial-gradient(75% 65% at 50% 50%, rgba(124,58,237,0.32), transparent 75%), linear-gradient(180deg, #05020c 0%, #12051f 60%, #1f0816 100%)",
  festa: "radial-gradient(70% 60% at 50% 40%, #7c3aed 0%, #3b0764 45%, #0b0820 100%)",
  tunel: "radial-gradient(38% 38% at 50% 50%, #f0f9ff 0%, #7dd3fc 18%, #2563eb 42%, #1e1b4b 72%, #02030c 100%)",
};

// Estrelas do céu inteiro: [left %, top %, tamanho px, cor, atraso s]
const STAR_COLORS = ["#ffffff", "#ffffff", "#bae6fd", "#fde68a", "#f5d0fe", "#ffffff"];
const SPACE_STARS = Array.from({ length: 78 }, (_, i) => ({
  left: (i * 37 + 13) % 100,
  top: (i * 53 + 7) % 100,
  size: 1 + (i % 4 === 0 ? 2 : i % 3 === 0 ? 1 : 0),
  color: STAR_COLORS[i % STAR_COLORS.length],
  delay: (i % 11) * 0.31,
}));
// Estrelas grandes em cruz (brilho de 4 pontas)
const SPARKLES: [number, number, number, number][] = [
  [12, 14, 18, 0],
  [82, 10, 14, 1.1],
  [64, 32, 10, 0.5],
  [24, 46, 12, 1.7],
  [92, 52, 16, 0.8],
];

/** Uma estrela de 4 pontas (o brilho cruzado das estrelas grandes). */
export function Sparkle({ className = "", color = "#ffffff", style }: { className?: string; color?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="-10 -10 20 20" className={className} style={style} aria-hidden="true">
      <path d="M0 -10 C1 -2 2 -1 10 0 C2 1 1 2 0 10 C-1 2 -2 1 -10 0 C-2 -1 -1 -2 0 -10 Z" fill={color} />
      <circle r="1.8" fill="#fff" />
    </svg>
  );
}

/** O céu do evento: o fundo, a faixa da Via Láctea, as nebulosas e as estrelas. `stars` = quanto das estrelas aparece. */
export function SpaceSky({ variant, stars = 1, milkyWay = true }: { variant: SpaceSkyVariant; stars?: number; milkyWay?: boolean }) {
  const deep = variant === "orbita" || variant === "galaxia" || variant === "terra" || variant === "observatorio";
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: SKIES[variant] }}>
      {deep && milkyWay && (
        <div
          className="absolute -inset-x-[30%] top-[18%] h-[34%] -rotate-[18deg] opacity-70"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(196,181,253,0.10) 30%, rgba(255,255,255,0.16) 50%, rgba(244,114,182,0.10) 70%, transparent)",
            filter: "blur(14px)",
          }}
        />
      )}
      {deep && (
        <>
          <div
            className="cg-anim-nebula absolute left-[-10%] top-[8%] h-[45%] w-[55%] rounded-full opacity-60"
            style={{ background: "radial-gradient(closest-side, rgba(217,70,239,0.35), transparent)", filter: "blur(20px)" }}
          />
          <div
            className="cg-anim-nebula absolute right-[-12%] top-[30%] h-[50%] w-[50%] rounded-full opacity-50"
            style={{ background: "radial-gradient(closest-side, rgba(34,211,238,0.28), transparent)", filter: "blur(24px)", animationDelay: "-7s" }}
          />
        </>
      )}
      {stars > 0 &&
        SPACE_STARS.map((s, i) => (
          <span
            key={i}
            className="cg-anim-twinkle absolute rounded-full"
            style={{
              left: `${s.left}%`,
              top: `${variant === "manha" || variant === "observatorio" ? s.top * 0.6 : s.top}%`,
              width: s.size,
              height: s.size,
              background: s.color,
              boxShadow: s.size > 2 ? `0 0 6px ${s.color}` : undefined,
              animationDelay: `${s.delay}s`,
              opacity: stars,
            }}
          />
        ))}
      {stars > 0 &&
        deep &&
        SPARKLES.map(([left, top, size, delay], i) => (
          <Sparkle key={i} className="cg-anim-twinkle absolute" style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, animationDelay: `${delay}s`, opacity: stars }} />
        ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// A Terra: oceano, continentes e nuvens girando dentro do círculo, a sombra
// da noite, as luzes das cidades e a atmosfera. "dia" = a Terra bonita de
// sempre; "sem-sinal" = a noite apagada, com as marquinhas vermelhas de sem
// conexão piscando; "conectada" = as cidades acesas e o sinal do Wi-Fi saindo
// de todo canto.
// ---------------------------------------------------------------------------

const CONTINENTS = [
  "M20 60 C30 40 60 36 76 50 C90 62 82 84 66 92 C58 110 44 122 34 112 C28 98 12 88 20 60 Z",
  "M54 122 C64 116 76 124 72 142 C70 160 60 178 50 172 C44 160 46 140 54 122 Z",
  "M120 48 C136 38 158 42 164 56 C170 70 156 80 146 78 C140 90 152 104 146 122 C140 142 126 152 120 138 C114 122 124 106 116 92 C108 78 108 60 120 48 Z",
  "M178 40 C202 28 242 36 254 54 C264 72 248 88 232 86 C224 98 210 102 198 94 C186 84 170 62 178 40 Z",
  "M226 132 C238 124 258 128 262 142 C264 154 250 162 238 158 C228 154 220 142 226 132 Z",
];
// As cidades (luzes acesas à noite), em cima dos continentes: [x, y]
const CITIES: [number, number][] = [
  [36, 62], [52, 74], [44, 92], [62, 66], [60, 136], [56, 152], [128, 60], [140, 66], [136, 98], [130, 120], [196, 52], [214, 60],
  [232, 54], [222, 76], [206, 86], [244, 140], [236, 148], [30, 80], [150, 58], [124, 78],
];
const CLOUDS = [
  "M10 40 C20 32 40 34 50 40 C60 36 74 38 78 44 C70 48 30 50 10 40 Z",
  "M96 112 C108 104 130 106 140 112 C150 108 162 112 164 118 C150 122 112 122 96 112 Z",
  "M180 150 C190 142 210 144 220 150 C230 146 242 150 244 156 C232 160 196 160 180 150 Z",
  "M150 30 C160 24 176 26 182 32 C174 36 158 36 150 30 Z",
  "M30 160 C40 154 58 156 64 162 C54 166 38 166 30 160 Z",
  "M240 96 C248 90 264 92 270 98 C260 102 246 102 240 96 Z",
];
// Pontos fixos do lado que a gente vê (sinal saindo / sem conexão)
const PINGS: [number, number, number][] = [
  [62, 70, 0],
  [126, 58, 0.6],
  [140, 116, 1.2],
  [96, 142, 1.8],
  [158, 82, 0.3],
  [80, 104, 0.9],
  [112, 92, 1.5],
];

export function Earth({ mode = "dia", className = "", spin = 70 }: { mode?: "dia" | "sem-sinal" | "conectada"; className?: string; spin?: number }) {
  const id = `ea${useId().replace(/:/g, "")}`;
  const night = mode !== "dia";
  const glow = mode === "conectada" ? "#22d3ee" : mode === "sem-sinal" ? "#6366f1" : "#7dd3fc";
  const tile = (
    <>
      {CONTINENTS.map((d, i) => (
        <g key={i}>
          <path d={d} fill="#22c55e" />
          <path d={d} fill="none" stroke="#15803d" strokeWidth="3" opacity="0.5" />
        </g>
      ))}
      <path d="M128 100 C134 96 140 100 138 108 C134 112 128 108 128 100 Z M200 70 C208 66 216 70 212 78 C206 80 200 76 200 70 Z" fill="#eab308" opacity="0.75" />
      <path d="M30 52 C40 46 54 46 60 52 M190 46 C204 40 222 42 232 48" stroke="#86efac" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
    </>
  );
  const lights = (
    <>
      {CITIES.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={mode === "conectada" ? 2.2 : 1.5}
            fill={mode === "conectada" ? (i % 3 === 0 ? "#67e8f9" : "#fde68a") : "#fbbf24"}
            opacity={mode === "conectada" ? 1 : 0.4}
            style={mode === "conectada" ? { filter: "drop-shadow(0 0 2px #fde68a)" } : undefined}
          />
        ))}
    </>
  );
  return (
    <svg viewBox="-14 -14 228 228" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <clipPath id={`${id}-clip`}>
          <circle cx="100" cy="100" r="90" />
        </clipPath>
        <radialGradient id={`${id}-ocean`} cx="0.38" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="0.45" stopColor="#1d4ed8" />
          <stop offset="0.8" stopColor="#1e3a8a" />
          <stop offset="1" stopColor="#0b1a4a" />
        </radialGradient>
        <radialGradient id={`${id}-shade`} cx="0.32" cy="0.28" r="0.85">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.82" stopColor="#020617" stopOpacity="0.45" />
          <stop offset="1" stopColor="#020617" stopOpacity="0.8" />
        </radialGradient>
        <radialGradient id={`${id}-air`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.8" stopColor={glow} stopOpacity="0" />
          <stop offset="0.86" stopColor={glow} stopOpacity="0.55" />
          <stop offset="1" stopColor={glow} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* atmosfera brilhando em volta */}
      <circle cx="100" cy="100" r="112" fill={`url(#${id}-air)`} className={mode === "conectada" ? "cg-anim-glow" : undefined} />
      <g clipPath={`url(#${id}-clip)`}>
        <rect x="0" y="0" width="200" height="200" fill={`url(#${id}-ocean)`} />
        {/* continentes girando (dois ladrilhos iguais, um atrás do outro) */}
        <g className="cg-anim-astro-drift" style={{ "--cg-dur": `${spin}s`, "--cg-dx": "-280px" } as React.CSSProperties}>
          {tile}
          <g transform="translate(280 0)">{tile}</g>
        </g>
        {/* calotas de gelo */}
        <ellipse cx="100" cy="8" rx="70" ry="12" fill="#f8fafc" opacity="0.85" />
        <ellipse cx="100" cy="194" rx="60" ry="10" fill="#f8fafc" opacity="0.8" />
        {/* nuvens (giram mais rápido) */}
        <g className="cg-anim-astro-drift" style={{ "--cg-dur": `${spin * 0.6}s`, "--cg-dx": "-280px" } as React.CSSProperties} fill="#ffffff" opacity="0.7">
          {CLOUDS.map((d, i) => (
            <path key={i} d={d} />
          ))}
          <g transform="translate(280 0)">
            {CLOUDS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
        </g>
        {/* a noite */}
        {night && <rect x="0" y="0" width="200" height="200" fill="#020617" opacity={mode === "sem-sinal" ? 0.62 : 0.45} />}
        {night && (
          <g className="cg-anim-astro-drift" style={{ "--cg-dur": `${spin}s`, "--cg-dx": "-280px" } as React.CSSProperties}>
            {lights}
            <g transform="translate(280 0)">{lights}</g>
          </g>
        )}
        <rect x="0" y="0" width="200" height="200" fill={`url(#${id}-shade)`} />
      </g>
      {/* contorno fininho da atmosfera */}
      <circle cx="100" cy="100" r="90.5" fill="none" stroke={glow} strokeWidth="1.6" opacity="0.7" />
      {/* sem sinal: marquinhas vermelhas piscando / conectada: o Wi-Fi saindo de todo canto */}
      {mode === "sem-sinal" &&
        PINGS.slice(0, 5).map(([x, y, delay], i) => (
          <g key={i} className="cg-anim-aura-blink" style={{ "--cg-dur": "1.3s", "--cg-delay": `${delay}s` } as React.CSSProperties}>
            <circle cx={x} cy={y} r="5" fill="#7f1d1d" stroke="#f87171" strokeWidth="1" />
            <path d={`M${x - 2.2} ${y - 2.2} L${x + 2.2} ${y + 2.2} M${x + 2.2} ${y - 2.2} L${x - 2.2} ${y + 2.2}`} stroke="#fecaca" strokeWidth="1.3" strokeLinecap="round" />
          </g>
        ))}
      {mode === "conectada" &&
        PINGS.map(([x, y, delay], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="6" fill="none" stroke="#67e8f9" strokeWidth="1.4" className="cg-anim-astro-ping" style={{ "--cg-delay": `${delay}s` } as React.CSSProperties} />
            <circle cx={x} cy={y} r="1.8" fill="#ecfeff" />
          </g>
        ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Meteoros: a pedra com o rastro de fogo. A pedra fica na esquerda e o rastro
// pra direita; a chuva gira cada um pra descer da direita pra esquerda.
// ---------------------------------------------------------------------------

export function Meteor({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const id = `me${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 160 48" className={`overflow-visible ${className}`} style={style} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-tail`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fef3c7" stopOpacity="0.95" />
          <stop offset="0.25" stopColor="#fb923c" stopOpacity="0.8" />
          <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M26 10 L160 21 L160 27 L26 38 Z" fill={`url(#${id}-tail)`} />
      <path d="M28 18 L120 23 L120 25 L28 30 Z" fill="#fffbeb" opacity="0.8" />
      <circle cx="24" cy="24" r="17" fill="#f97316" opacity="0.35" style={{ filter: "blur(4px)" }} />
      <path d="M12 18 L20 9 L32 10 L38 20 L36 32 L26 39 L14 36 L9 27 Z" fill="#78716c" stroke="#fb923c" strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 20 L20 13 L28 13" stroke="#d6d3d1" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
      <circle cx="24" cy="25" r="4" fill="#57534e" />
      <circle cx="31" cy="31" r="2.5" fill="#57534e" />
      <circle cx="16" cy="29" r="2" fill="#57534e" />
    </svg>
  );
}

/** Chuva de meteoros atravessando a tela (de cima/direita pra baixo/esquerda). */
export function MeteorShower({ count = 8, scale = 1 }: { count?: number; scale?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }, (_, i) => {
        const size = (70 + ((i * 37) % 90)) * scale;
        return (
          <div
            key={i}
            className="cg-anim-astro-meteor absolute"
            style={
              {
                left: `${70 + ((i * 29) % 45)}%`,
                top: `${-14 + ((i * 41) % 46)}%`,
                width: size,
                "--cg-duration": `${2.4 + ((i * 7) % 10) * 0.22}s`,
                "--cg-delay": `${-i * 0.67}s`,
              } as React.CSSProperties
            }
          >
            <Meteor className="w-full" style={{ transform: "rotate(-31deg)" }} />
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Velocidade da luz: os riscos de estrela saindo do centro (viagem pelo espaço
// e a travessia do buraco de minhoca).
// ---------------------------------------------------------------------------

export function WarpStreaks({ count = 40, color = "#e0f2fe" }: { count?: number; color?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }, (_, i) => {
        const angle = (i * 360) / count + ((i * 17) % 7);
        return (
          <div key={i} className="absolute left-1/2 top-1/2 h-[2px] w-[26vmax] origin-left" style={{ transform: `rotate(${angle}deg)` }}>
            <span
              className="cg-anim-astro-warp block h-full w-full rounded-full"
              style={
                {
                  background: `linear-gradient(90deg, transparent, ${color})`,
                  "--cg-duration": `${0.9 + ((i * 13) % 9) * 0.09}s`,
                  "--cg-delay": `${-((i * 7) % 12) * 0.1}s`,
                } as React.CSSProperties
              }
            />
          </div>
        );
      })}
    </div>
  );
}

/** Nuvem fofinha (a decolagem atravessa as nuvens). */
export function Cloud({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 200 90" className={className} style={style} aria-hidden="true">
      <path d="M20 78 C2 78 2 52 24 52 C22 30 52 22 64 38 C72 12 116 10 124 36 C140 22 170 30 166 54 C190 52 196 78 176 78 Z" fill="#f8fafc" />
      <path d="M20 78 C10 78 6 70 10 64 C30 70 150 72 192 66 C194 74 188 78 176 78 Z" fill="#cbd5e1" opacity="0.8" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// O buraco de minhoca: três anéis em túnel (o de fora é o mais perto), o
// redemoinho no meio e as runas do Mago girando em volta. `lit` = quantos
// anéis já estão estáveis (acesos, de fora pra dentro); `open` = o portal
// abriu (o túnel de luz azul).
// ---------------------------------------------------------------------------

const RINGS: { r: number; cx: number; cy: number; w: number }[] = [
  { r: 128, cx: 150, cy: 150, w: 11 },
  { r: 88, cx: 153, cy: 147, w: 8.5 },
  { r: 52, cx: 156, cy: 144, w: 6 },
];
const RUNES = ["✦", "☾", "✧", "⟁", "✶", "◈", "✷", "⌘"];

export function Wormhole({ lit = 0, open = false, className = "" }: { lit?: number; open?: boolean; className?: string }) {
  const id = `wh${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 300 300" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-core`} cx="0.52" cy="0.48" r="0.5">
          {open ? (
            <>
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.18" stopColor="#bae6fd" />
              <stop offset="0.45" stopColor="#3b82f6" />
              <stop offset="0.8" stopColor="#312e81" stopOpacity="0.7" />
              <stop offset="1" stopColor="#1e1b4b" stopOpacity="0" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#a5b4fc" stopOpacity="0.8" />
              <stop offset="0.3" stopColor="#4c1d95" stopOpacity="0.8" />
              <stop offset="1" stopColor="#0b0820" stopOpacity="0" />
            </>
          )}
        </radialGradient>
      </defs>
      <circle cx="152" cy="148" r="140" fill={`url(#${id}-core)`} className={open ? "cg-anim-glow" : undefined} />
      {/* redemoinho girando no meio do túnel */}
      <g className="cg-anim-orbit" style={{ "--cg-origin": "153px 147px", "--cg-dur": open ? "3s" : "9s" } as React.CSSProperties}>
        {[0, 90, 180, 270].map((a) => (
          <path
            key={a}
            d="M153 147 C153 120 175 104 200 110 C222 116 232 140 226 160"
            transform={`rotate(${a} 153 147)`}
            fill="none"
            stroke={open ? "#e0f2fe" : "#8b5cf6"}
            strokeWidth={open ? 3 : 2}
            strokeLinecap="round"
            opacity={open ? 0.75 : 0.45}
          />
        ))}
      </g>
      {/* os anéis (do mais longe pro mais perto) */}
      {[...RINGS].reverse().map((ring, k) => {
        const index = RINGS.length - 1 - k; // 0 = o anel de fora
        const on = index < lit;
        return (
          <g key={index}>
            <circle
              cx={ring.cx}
              cy={ring.cy}
              r={ring.r}
              fill="none"
              stroke={on ? "#38bdf8" : "#312e81"}
              strokeWidth={ring.w}
              style={on ? { filter: "drop-shadow(0 0 6px #38bdf8)" } : undefined}
            />
            <circle
              cx={ring.cx}
              cy={ring.cy}
              r={ring.r}
              fill="none"
              stroke={on ? "#f0f9ff" : "#6366f1"}
              strokeWidth={ring.w * 0.32}
              strokeDasharray="14 10"
              opacity={on ? 0.95 : 0.55}
              className="cg-anim-aura-flow"
              style={{ "--cg-dur": on ? `${0.7 + index * 0.25}s` : "3s" } as React.CSSProperties}
            />
            {!on && (
              <circle
                cx={ring.cx}
                cy={ring.cy - ring.r}
                r={ring.w * 0.45}
                fill="#f87171"
                className="cg-anim-aura-blink"
                style={{ "--cg-dur": "1.1s", "--cg-delay": `${index * 0.3}s` } as React.CSSProperties}
              />
            )}
          </g>
        );
      })}
      {/* as runas do Mago segurando o portal */}
      <g className="cg-anim-orbit" style={{ "--cg-origin": "150px 150px", "--cg-dur": "24s" } as React.CSSProperties}>
        {RUNES.map((rune, i) => {
          const a = (i / RUNES.length) * Math.PI * 2;
          return (
            <text
              key={i}
              x={150 + Math.cos(a) * 146}
              y={150 + Math.sin(a) * 146 + 5}
              textAnchor="middle"
              fontSize="15"
              fill="#fde68a"
              className="cg-anim-twinkle"
              style={{ animationDelay: `${i * 0.27}s`, filter: "drop-shadow(0 0 4px #fbbf24)" }}
            >
              {rune}
            </text>
          );
        })}
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// O holograma do plano da Catarina: o espaço-tempo dobrado como uma folha,
// a Terra em cima, o TON 618 embaixo e o atalho (o buraco de minhoca) ligando
// os dois; a luzinha da nave atravessa pelo atalho em vez de dar a volta.
// ---------------------------------------------------------------------------

export function SpacetimeHologram({ className = "" }: { className?: string }) {
  const top = [
    [60, 110, 22],
    [72, 80, 16],
    [84, 52, 11],
    [96, 30, 7],
  ];
  const bottom = [
    [200, 110, 22],
    [188, 80, 16],
    [176, 52, 11],
    [164, 30, 7],
  ];
  return (
    <svg viewBox="0 0 260 260" className={`overflow-visible ${className}`} aria-hidden="true">
      <g fill="none" stroke="#67e8f9" strokeWidth="1.3" className="cg-anim-beam">
        {[...top, ...bottom].map(([cy, rx, ry], i) => (
          <ellipse key={i} cx="130" cy={cy} rx={rx} ry={ry} opacity={i % 4 === 0 ? 0.9 : 0.6} />
        ))}
        {/* linhas da "folha" do espaço descendo/subindo até a garganta */}
        {[-1, -0.6, -0.2, 0.2, 0.6, 1].map((k, i) => {
          const f = Math.sqrt(1 - k * k); // a parte da frente de cada anel
          return (
            <g key={i} opacity="0.55">
              <path d={`M${130 + k * 110} ${60 + 22 * f} Q${130 + k * 52} ${74 + 14 * f} ${130 + k * 30} ${96 + 7 * f}`} />
              <path d={`M${130 + k * 110} ${200 + 22 * f} Q${130 + k * 52} ${186 + 14 * f} ${130 + k * 30} ${164 + 7 * f}`} />
            </g>
          );
        })}
        {/* a garganta do buraco de minhoca */}
        <path d="M100 96 C112 116 112 144 100 164 M160 96 C148 116 148 144 160 164" stroke="#a5f3fc" strokeWidth="2.2" />
        {/* o caminho longo (dando a volta) */}
        <path d="M60 62 C-30 90 -30 180 200 198" stroke="#f472b6" strokeDasharray="5 6" opacity="0.7" />
      </g>
      {/* a Terra e o TON 618 */}
      <circle cx="60" cy="62" r="9" fill="#3b82f6" stroke="#bae6fd" strokeWidth="1.5" />
      <path d="M55 59 C58 56 62 57 63 60 C60 63 57 63 55 59 Z" fill="#22c55e" />
      <text x="60" y="44" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#bae6fd" fontFamily="sans-serif">
        Terra
      </text>
      <circle cx="200" cy="198" r="10" fill="#000" stroke="#fb923c" strokeWidth="3" />
      <text x="200" y="228" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fdba74" fontFamily="sans-serif">
        TON 618
      </text>
      {/* a nave pegando o atalho */}
      <g className="cg-anim-astro-shortcut" style={{ "--cg-dur": "3.6s" } as React.CSSProperties}>
        <circle cx="60" cy="62" r="5" fill="#f0abfc" style={{ filter: "drop-shadow(0 0 5px #e879f9)" }} />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// A Terra vista da órbita: o topo de uma bola enorme aparecendo lá embaixo.
// A bola é um quadrado (aspect-square) mais largo que a cena e o topo dela
// fica na altura da caixa (`className`), então a curva aparece em qualquer
// tela, da mais larga à do celular. Os continentes, as nuvens e as luzes giram
// num ladrilho de 1000 de largura (dois iguais, um atrás do outro).
// ---------------------------------------------------------------------------

const LANDS = [
  "M60 70 C100 30 200 24 260 50 C310 72 290 120 240 134 C200 170 150 210 100 196 C60 180 30 110 60 70 Z",
  "M400 40 C450 10 560 14 600 40 C630 62 600 96 560 100 C520 108 500 150 460 156 C420 160 380 110 390 80 C392 60 384 50 400 40 Z",
  "M700 100 C760 70 880 78 920 110 C960 140 930 200 870 216 C810 232 730 210 700 170 C680 144 676 116 700 100 Z",
  "M160 330 C220 290 330 300 360 350 C390 400 340 470 280 490 C220 510 150 470 140 420 C134 384 140 350 160 330 Z",
  "M580 360 C640 330 740 340 770 390 C800 440 760 520 690 540 C620 560 560 500 550 450 C544 410 556 376 580 360 Z",
  "M860 520 C900 500 960 510 980 550 C996 590 960 630 920 630 C880 628 846 590 850 560 C852 540 850 528 860 520 Z",
  "M40 600 C80 570 160 580 180 630 C196 680 150 720 100 720 C50 716 20 670 40 600 Z",
  "M380 660 C430 630 520 640 540 690 C560 740 510 790 450 790 C390 786 360 720 380 660 Z",
];
const DESERTS = "M150 90 C180 76 220 80 236 96 C218 112 172 110 150 90 Z M480 50 C500 40 530 44 540 56 C524 66 496 64 480 50 Z M760 130 C790 118 830 124 846 140 C824 152 784 148 760 130 Z M620 410 C650 398 690 404 704 420 C684 434 644 430 620 410 Z";
const MOUNTAINS = "M90 150 L120 124 L146 150 M720 180 L750 154 L776 180 M220 420 L250 394 L276 420 M640 480 L670 454 L696 480";
const LAND_LIGHTS: [number, number][] = [
  [100, 80], [160, 60], [230, 70], [140, 150], [200, 120], [430, 60], [500, 40], [560, 70], [440, 120], [740, 120], [800, 100],
  [860, 150], [780, 190], [200, 360], [300, 380], [260, 450], [620, 380], [700, 420], [660, 500], [900, 560], [100, 640], [450, 700],
];
const SKY_CLOUDS: [number, number, number, number][] = [
  [200, 150, 90, 14],
  [620, 70, 110, 12],
  [820, 300, 120, 16],
  [340, 230, 100, 14],
  [80, 300, 80, 12],
  [560, 620, 110, 16],
  [900, 760, 90, 12],
  [300, 560, 90, 14],
];
const HORIZON_PINGS: [number, number, number][] = [
  [300, 70, 0],
  [520, 40, 0.7],
  [720, 110, 1.4],
  [440, 190, 2],
  [180, 260, 0.4],
  [820, 280, 1.1],
];

export function EarthHorizon({
  mode = "dia",
  className = "h-[34%]",
  size = "w-[max(160%,130vh)]",
}: {
  mode?: "dia" | "sem-sinal" | "conectada";
  /** A altura da parte da Terra que aparece (do chão da cena até o topo da bola). */
  className?: string;
  /** A largura da bola (quanto maior, mais suave a curva). */
  size?: string;
}) {
  const id = `eh${useId().replace(/:/g, "")}`;
  const night = mode !== "dia";
  const glow = mode === "conectada" ? "#22d3ee" : "#7dd3fc";
  const spin = { "--cg-dur": "200s", "--cg-dx": "-1000px" } as React.CSSProperties;
  return (
    <div className={`pointer-events-none absolute inset-x-0 bottom-0 ${className}`}>
      <svg viewBox="0 0 1000 1000" className={`absolute left-1/2 top-0 aspect-square -translate-x-1/2 overflow-visible ${size}`} aria-hidden="true">
        <defs>
          <clipPath id={`${id}-clip`}>
            <circle cx="500" cy="500" r="500" />
          </clipPath>
          <radialGradient id={`${id}-ocean`} cx="0.5" cy="0.25" r="0.75">
            <stop offset="0" stopColor="#3b82f6" />
            <stop offset="0.45" stopColor="#1d4ed8" />
            <stop offset="1" stopColor="#172554" />
          </radialGradient>
          <radialGradient id={`${id}-limb`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0.8" stopColor="#020617" stopOpacity="0" />
            <stop offset="0.95" stopColor="#020617" stopOpacity="0.35" />
            <stop offset="1" stopColor="#020617" stopOpacity="0.6" />
          </radialGradient>
          <radialGradient id={`${id}-air`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0.9" stopColor={glow} stopOpacity="0" />
            <stop offset="0.955" stopColor={glow} stopOpacity="0.5" />
            <stop offset="1" stopColor={glow} stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* a atmosfera brilhando em volta */}
        <circle cx="500" cy="500" r="530" fill={`url(#${id}-air)`} className={mode === "conectada" ? "cg-anim-glow" : undefined} />
        <g clipPath={`url(#${id}-clip)`}>
          <rect x="0" y="0" width="1000" height="1000" fill={`url(#${id}-ocean)`} />
          <g className="cg-anim-astro-drift" style={spin}>
            {[0, 1000].map((dx) => (
              <g key={dx} transform={`translate(${dx} 0)`}>
                {LANDS.map((d, i) => (
                  <path key={i} d={d} fill="#22c55e" stroke="#15803d" strokeWidth="5" strokeOpacity="0.5" />
                ))}
                <path d={DESERTS} fill="#ca8a04" opacity="0.55" />
                <path d={MOUNTAINS} stroke="#166534" strokeWidth="4" fill="none" strokeLinejoin="round" opacity="0.6" />
              </g>
            ))}
          </g>
          <g className="cg-anim-astro-drift" style={{ "--cg-dur": "110s", "--cg-dx": "-1000px" } as React.CSSProperties} fill="#ffffff" opacity="0.7">
            {[0, 1000].map((dx) => (
              <g key={dx} transform={`translate(${dx} 0)`}>
                {SKY_CLOUDS.map(([cx, cy, rx, ry], i) => (
                  <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} />
                ))}
              </g>
            ))}
          </g>
          {night && <rect x="0" y="0" width="1000" height="1000" fill="#020617" opacity={mode === "sem-sinal" ? 0.62 : 0.45} />}
          {night && (
            <g className="cg-anim-astro-drift" style={spin}>
              {[0, 1000].map((dx) => (
                <g key={dx} transform={`translate(${dx} 0)`}>
                  {LAND_LIGHTS.map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r={mode === "conectada" ? 4 : 3} fill={mode === "conectada" && i % 3 === 0 ? "#67e8f9" : "#fde68a"} opacity={mode === "conectada" ? 1 : 0.4} />
                  ))}
                </g>
              ))}
            </g>
          )}
          <rect x="0" y="0" width="1000" height="1000" fill={`url(#${id}-limb)`} />
        </g>
        {/* a borda fininha da atmosfera */}
        <circle cx="500" cy="500" r="501" fill="none" stroke={glow} strokeWidth="3" opacity="0.85" />
        {mode === "conectada" &&
          HORIZON_PINGS.map(([x, y, delay], i) => (
            <circle key={i} cx={x} cy={y} r="12" fill="none" stroke="#67e8f9" strokeWidth="3" className="cg-anim-astro-ping" style={{ "--cg-delay": `${delay}s` } as React.CSSProperties} />
          ))}
      </svg>
    </div>
  );
}
