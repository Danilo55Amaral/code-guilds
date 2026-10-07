"use client";

import { Stars } from "../common";
import { MapleLeaf } from "./creatures";
import { Pt, RimGradient, animVars, jagged, poly, useSvgId } from "./kit";

// ============================================================================
// CENÁRIOS DE A NOITE DE DRACODING — os céus, as luas (prateada, de sangue e
// quebrada em fragmentos), Codópolis (a cidade aos pés da CodeGuilds), o campo
// de abóboras, o circo sombrio, o castelo do vampiro no penhasco, a ponte de
// pedra, o salão do trono, o Relógio do Amanhecer e os Vitrais do Amanhecer.
// Cada peça ocupa o elemento pai (absolute) e vai empilhada nas cenas.
// ============================================================================

const SKIES = {
  cidade:
    "radial-gradient(70% 38% at 50% 100%, rgba(251,146,60,0.38), transparent 70%), linear-gradient(180deg, #04020b 0%, #170c2e 42%, #35173d 72%, #5e2a26 100%)",
  campo:
    "radial-gradient(75% 45% at 50% 100%, rgba(249,115,22,0.5), transparent 70%), radial-gradient(40% 40% at 70% 20%, rgba(94,234,212,0.12), transparent 70%), linear-gradient(180deg, #050a18 0%, #1b1a4a 38%, #4a1d4f 68%, #8a3412 100%)",
  roxo: "radial-gradient(60% 50% at 50% 45%, rgba(192,38,211,0.4), transparent 70%), linear-gradient(180deg, #08030f 0%, #2e1065 58%, #10041c 100%)",
  sangue: "radial-gradient(55% 45% at 50% 25%, rgba(239,68,68,0.5), transparent 70%), linear-gradient(180deg, #100105 0%, #3f0713 50%, #170408 100%)",
  prata: "radial-gradient(55% 45% at 50% 22%, rgba(226,232,240,0.38), transparent 70%), linear-gradient(180deg, #020617 0%, #172554 55%, #1e293b 100%)",
  castelo: "radial-gradient(60% 45% at 50% 28%, rgba(225,29,72,0.38), transparent 70%), linear-gradient(180deg, #030107 0%, #1c0716 50%, #2a0a1a 100%)",
  salao: "radial-gradient(55% 55% at 50% 28%, rgba(225,29,72,0.3), transparent 70%), linear-gradient(180deg, #0a050d 0%, #1a0c1a 100%)",
  amanhecer: "linear-gradient(180deg, #1e3a8a 0%, #7c3aed 26%, #f472b6 52%, #fdba74 76%, #fde68a 100%)",
  festa: "radial-gradient(60% 55% at 50% 42%, rgba(253,224,71,0.55), transparent 70%), linear-gradient(180deg, #3b0764 0%, #be185d 52%, #f59e0b 100%)",
} as const;

export type SkyVariant = keyof typeof SKIES;

export function Sky({ variant, stars = true }: { variant: SkyVariant; stars?: boolean }) {
  return (
    <div className="absolute inset-0" style={{ background: SKIES[variant] }}>
      {stars && <Stars opacity={variant === "amanhecer" || variant === "festa" ? 0.3 : 1} />}
    </div>
  );
}

/** Fundo que vai chegando bem devagar mais perto (zoom de cinema); os personagens ficam fora dele. */
export function Backdrop({ children, pan = "0%" }: { children: React.ReactNode; pan?: string }) {
  return (
    <div className="cg-anim-kenburns absolute inset-0" style={{ "--cg-pan-x": pan } as React.CSSProperties}>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Lua cheia (prateada ou de sangue), com crateras e mares, e os fragmentos
// ---------------------------------------------------------------------------

const CRATERS: [number, number, number, number][] = [
  [-38, -30, 22, 16],
  [30, -52, 12, 9],
  [40, 22, 26, 20],
  [-22, 48, 16, 12],
  [-62, 16, 10, 8],
  [8, -8, 9, 7],
  [64, -14, 8, 6],
  [-6, 74, 9, 6],
];
/** Os três pedaços da lua que o feitiço do Dracoding arrancou (Fase 2). */
export const MOON_SHARDS: Pt[][] = [
  [
    [-24, -104],
    [34, -104],
    [20, -40],
    [-30, -50],
  ],
  [
    [58, -22],
    [104, -6],
    [104, 50],
    [48, 30],
  ],
  [
    [-82, 28],
    [-30, 40],
    [-46, 104],
    [-104, 60],
  ],
];

export type MoonTone = "prata" | "sangue";

export function Moon({
  tone = "prata",
  className = "",
  rising = false,
  missing = [],
  assemble = false,
}: {
  tone?: MoonTone;
  className?: string;
  rising?: boolean;
  /** Fragmentos que estão faltando (0, 1, 2): ficam buracos escuros com rachaduras. */
  missing?: number[];
  /** Os fragmentos voam de volta pro lugar e o vermelho vai sumindo (fim da Fase 2). */
  assemble?: boolean;
}) {
  const id = useSvgId();
  const blood = tone === "sangue";
  const halo = blood ? "239,68,68" : "226,232,240";
  return (
    <div className={`pointer-events-none absolute aspect-square ${className}`}>
      <div className={`relative h-full w-full ${rising ? "cg-anim-moon-rise" : ""}`}>
      <div className="absolute inset-[4%] rounded-full" style={{ boxShadow: `0 0 70px 24px rgba(${halo},0.42), 0 0 200px 70px rgba(${halo},0.16)` }} />
      <svg viewBox="-104 -104 208 208" className="relative h-full w-full overflow-visible">
        <defs>
          <radialGradient id={`${id}-m`} cx="-34" cy="-34" r="160" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={blood ? "#fee2e2" : "#ffffff"} />
            <stop offset="0.38" stopColor={blood ? "#f87171" : "#e2e8f0"} />
            <stop offset="0.8" stopColor={blood ? "#991b1b" : "#94a3b8"} />
            <stop offset="1" stopColor={blood ? "#450a0a" : "#475569"} />
          </radialGradient>
          <clipPath id={`${id}-clip`}>
            <circle r="100" />
          </clipPath>
        </defs>
        <circle r="100" fill={`url(#${id}-m)`} />
        <g clipPath={`url(#${id}-clip)`}>
          {/* mares escuros */}
          <path d="M-70 -40 C-50 -60 -10 -56 4 -36 C14 -20 -6 -6 -26 -10 C-46 -14 -60 0 -78 -12 Z M10 30 C30 10 66 14 74 40 C80 60 56 74 34 66 C18 60 4 48 10 30 Z" fill={blood ? "#7f1d1d" : "#64748b"} opacity="0.35" />
          {CRATERS.map(([x, y, rx, ry]) => (
            <g key={`${x}-${y}`}>
              <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={blood ? "#7f1d1d" : "#64748b"} opacity="0.45" />
              <path d={`M${x - rx} ${y} A${rx} ${ry} 0 0 0 ${x + rx} ${y}`} stroke={blood ? "#fecaca" : "#f8fafc"} strokeWidth="1.6" fill="none" opacity="0.45" />
            </g>
          ))}
          {assemble && <circle r="100" fill="#b91c1c" opacity="0.65" className="cg-anim-fade-out" style={{ "--cg-delay": "1.9s", animationDuration: "1.6s" } as React.CSSProperties} />}
          {MOON_SHARDS.map((shard, i) => {
            const hole = (
              <>
                <path d={poly(shard)} fill="#0a0206" stroke={blood ? "#fca5a5" : "#e2e8f0"} strokeWidth="1.5" strokeOpacity="0.6" />
                <path d={`M${shard[0][0]} ${shard[0][1]} L${shard[2][0] + 6} ${shard[2][1] + 10} M${shard[3][0]} ${shard[3][1]} L${shard[3][0] - 14} ${shard[3][1] + 16}`} stroke="#0a0206" strokeWidth="2" />
              </>
            );
            if (missing.includes(i)) return <g key={i}>{hole}</g>;
            if (!assemble) return null;
            // o buraco some quando o fragmento chega voando e encaixa
            const delay = 0.3 + i * 0.35;
            return (
              <g key={i}>
                <g className="cg-anim-fade-out" style={{ "--cg-delay": `${delay + 1.1}s` } as React.CSSProperties}>
                  {hole}
                </g>
                <path
                  d={poly(shard)}
                  fill={`url(#${id}-m)`}
                  stroke="#fff"
                  strokeWidth="1"
                  strokeOpacity="0.5"
                  className="cg-anim-assemble"
                  style={animVars({ dx: [-160, 200, -220][i], dy: [-140, 120, 180][i], spin: [140, -200, 240][i], delay })}
                />
              </g>
            );
          })}
        </g>
      </svg>
      </div>
    </div>
  );
}

/** Um fragmento da lua solto, brilhando (flutua pela cena da Fase 2). */
export function MoonShard({ index, className = "", style }: { index: number; className?: string; style?: React.CSSProperties }) {
  const id = useSvgId();
  const shard = MOON_SHARDS[index % MOON_SHARDS.length];
  // a caixa do desenho é só em volta do fragmento (com folga pro brilho)
  const xs = shard.map(([x]) => x);
  const ys = shard.map(([, y]) => y);
  const box = `${Math.min(...xs) - 12} ${Math.min(...ys) - 12} ${Math.max(...xs) - Math.min(...xs) + 24} ${Math.max(...ys) - Math.min(...ys) + 24}`;
  return (
    <svg viewBox={box} className={`overflow-visible ${className}`} style={style} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-s`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#94a3b8" />
        </linearGradient>
      </defs>
      <g style={{ filter: "drop-shadow(0 0 14px rgba(226,232,240,0.9))" }}>
        <path d={poly(shard)} fill={`url(#${id}-s)`} stroke="#fff" strokeWidth="2" />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Nuvens e névoa
// ---------------------------------------------------------------------------

/** Faixa de nuvens enroladas, com a borda acesa pela lua. */
export function CloudBank({ className = "", fill = "#1b1030", rim = "#c4b5fd", flip = false }: { className?: string; fill?: string; rim?: string; flip?: boolean }) {
  return (
    <div className={`cg-anim-dragon-mist pointer-events-none absolute ${className}`} style={animVars({ dur: 26 })}>
      <svg viewBox="0 0 600 120" preserveAspectRatio="none" className="h-full w-full" style={flip ? { transform: "scaleX(-1)" } : undefined} aria-hidden="true">
        <path
          d="M0 120 L0 70 C20 50 50 52 62 66 C70 40 110 34 128 56 C140 30 186 26 200 52 C214 36 250 38 258 60 C276 34 320 30 338 58 C352 40 384 42 392 64 C410 44 446 46 456 66 C474 46 512 48 524 70 C540 56 572 58 600 74 L600 120 Z"
          fill={fill}
        />
        <path
          d="M0 70 C20 50 50 52 62 66 C70 40 110 34 128 56 C140 30 186 26 200 52 C214 36 250 38 258 60 C276 34 320 30 338 58 C352 40 384 42 392 64 C410 44 446 46 456 66 C474 46 512 48 524 70 C540 56 572 58 600 74"
          stroke={rim}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        <path d="M70 96 C100 80 140 84 160 98 M300 92 C330 76 370 80 390 96 M470 100 C500 86 540 88 560 100" stroke={rim} strokeWidth="1.5" fill="none" opacity="0.25" />
      </svg>
    </div>
  );
}

/** Névoa rasteira em camadas (uma mais rápida que a outra). */
export function GroundMist({ tint = "rgba(203,213,225,0.28)", className = "h-[26%]" }: { tint?: string; className?: string }) {
  return (
    <>
      <div className={`cg-anim-fog pointer-events-none absolute -left-[20%] bottom-0 w-[140%] ${className}`} style={{ background: `radial-gradient(50% 65% at 50% 100%, ${tint}, transparent 70%)`, filter: "blur(12px)" }} />
      <div
        className={`cg-anim-dragon-mist pointer-events-none absolute -left-[10%] bottom-[-4%] w-[120%] ${className}`}
        style={{ background: `radial-gradient(40% 55% at 30% 100%, ${tint}, transparent 70%), radial-gradient(40% 55% at 75% 100%, ${tint}, transparent 70%)`, filter: "blur(16px)", ...animVars({ dur: 14 }) }}
      />
    </>
  );
}

// Folhas: [esquerda %, tamanho px, atraso, duração, deriva px, cor].
const LEAVES: [number, number, number, number, number, string][] = Array.from({ length: 16 }, (_, i) => [
  (i * 61 + 7) % 100,
  12 + (i % 4) * 4,
  -((i * 1.37) % 9),
  7 + (i % 5),
  -60 + ((i * 47) % 120),
  ["#dc2626", "#ea580c", "#f59e0b", "#b45309"][i % 4],
]);

/** Folhas de outono caindo, rodopiando. */
export function FallingLeaves({ count = LEAVES.length }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {LEAVES.slice(0, count).map(([left, size, delay, duration, drift, color], i) => (
        <svg
          key={i}
          viewBox="-12 -12 24 28"
          className="cg-anim-snow absolute top-0"
          style={{ left: `${left}%`, width: size, "--cg-delay": `${delay}s`, "--cg-duration": `${duration}s`, "--cg-drift": `${drift}px`, "--cg-fall": "105vh" } as React.CSSProperties}
          aria-hidden="true"
        >
          <MapleLeaf x={0} y={0} color={color} />
        </svg>
      ))}
    </div>
  );
}

// Brasas: [esquerda %, atraso, duração, tamanho].
const EMBERS: [number, number, number, number][] = Array.from({ length: 22 }, (_, i) => [(i * 43 + 11) % 100, -((i * 0.83) % 7), 5 + (i % 4) * 1.5, 2 + (i % 3)]);

/** Faíscas subindo (fogo das abóboras, velas, magia). */
export function Embers({ color = "#fb923c", count = EMBERS.length }: { color?: string; count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {EMBERS.slice(0, count).map(([left, delay, duration, size], i) => (
        <span
          key={i}
          className="cg-anim-sparkle absolute bottom-0 rounded-full"
          style={{ left: `${left}%`, width: size, height: size, background: color, boxShadow: `0 0 8px 2px ${color}`, "--cg-delay": `${delay}s`, "--cg-duration": `${duration}s` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Árvore seca e retorcida (moldura das cenas), do lado esquerdo; `flip` = lado direito
// ---------------------------------------------------------------------------

const TREE_BRANCHES: [string, number][] = [
  ["M60 520 C66 430 38 370 70 300 C90 258 80 220 100 178", 30],
  ["M70 300 C112 290 140 252 190 240", 13],
  ["M190 240 C222 236 244 210 274 214", 6],
  ["M190 240 C202 212 196 190 216 168", 5],
  ["M100 178 C120 140 110 110 140 80", 11],
  ["M140 80 C150 60 172 50 182 28", 5],
  ["M140 80 C120 60 126 40 110 18", 4],
  ["M100 178 C70 160 50 130 30 120", 8],
  ["M30 120 C20 110 10 116 0 104", 4],
  ["M64 400 C40 390 30 380 8 386", 8],
  ["M240 222 L256 196 M216 168 L230 150 M182 28 L196 20 M110 18 L100 6 M30 120 L24 98 M8 386 L-6 376", 3],
];

export function DeadTree({ className = "", flip = false, color = "#07040c", rim = "#7c3aed" }: { className?: string; flip?: boolean; color?: string; rim?: string }) {
  return (
    <svg viewBox="-10 0 300 520" preserveAspectRatio="xMinYMax meet" className={`pointer-events-none absolute ${className}`} style={flip ? { transform: "scaleX(-1)" } : undefined} aria-hidden="true">
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {TREE_BRANCHES.map(([d, w]) => (
          <path key={d} d={d} stroke={rim} strokeWidth={w + 3} opacity="0.35" />
        ))}
        {TREE_BRANCHES.map(([d, w]) => (
          <path key={`${d}-c`} d={d} stroke={color} strokeWidth={w} />
        ))}
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Codópolis: as casas tortas, a torre do relógio, a igreja e a CodeGuilds no morro
// ---------------------------------------------------------------------------

interface House {
  x: number;
  w: number;
  top: number;
  peak: number;
  skew: number;
}

const FRONT_HOUSES: House[] = [
  { x: 0, w: 120, top: 330, peak: 250, skew: -10 },
  { x: 112, w: 92, top: 362, peak: 300, skew: 8 },
  { x: 196, w: 140, top: 300, peak: 206, skew: -14 },
  { x: 326, w: 100, top: 352, peak: 282, skew: 6 },
  { x: 418, w: 128, top: 318, peak: 236, skew: 12 },
  { x: 538, w: 108, top: 362, peak: 302, skew: -6 },
  { x: 744, w: 120, top: 330, peak: 250, skew: 10 },
  { x: 856, w: 100, top: 362, peak: 296, skew: -8 },
  { x: 1062, w: 130, top: 318, peak: 232, skew: -12 },
  { x: 1184, w: 100, top: 356, peak: 292, skew: 6 },
  { x: 1276, w: 140, top: 310, peak: 218, skew: 14 },
  { x: 1408, w: 110, top: 350, peak: 280, skew: -10 },
  { x: 1510, w: 110, top: 330, peak: 250, skew: 8 },
];
const BACK_HOUSES: House[] = FRONT_HOUSES.map((h, i) => ({ x: h.x + 50, w: h.w * 0.9, top: h.top - 60 - (i % 3) * 14, peak: h.peak - 60 - (i % 3) * 14, skew: -h.skew }));

function housePath({ x, w, top, peak, skew }: House): string {
  return poly([
    [x, 500],
    [x, top + 4],
    [x + w / 2 + skew, peak],
    [x + w, top],
    [x + w, 500],
  ]);
}

function houseWindows({ x, w, top }: House, index: number): { d: string; lit: boolean; delay: number }[] {
  const cols = w > 110 ? [0.24, 0.6] : [0.36];
  const rows = [top + 28, top + 84].filter((y) => y < 450);
  return rows.flatMap((y, r) =>
    cols.map((c, k) => {
      const wx = x + w * c;
      return {
        d: `M${wx} ${y + 22} L${wx} ${y + 7} L${wx + 7} ${y} L${wx + 14} ${y + 7} L${wx + 14} ${y + 22} Z`,
        lit: (index * 7 + r * 3 + k) % 4 !== 0,
        delay: ((index * 13 + r * 5 + k * 3) % 17) * 0.29,
      };
    }),
  );
}

const CITY_TONES = {
  noite: { far: "#2a1c40", mid: "#160d24", front: "#06030b", window: "#fbbf24", rim: "#fb923c" },
  sangue: { far: "#3a0d18", mid: "#1f060d", front: "#070104", window: "#fb923c", rim: "#ef4444" },
  prata: { far: "#1e2a44", mid: "#101a2e", front: "#03060d", window: "#fde68a", rim: "#e2e8f0" },
  roxo: { far: "#2e1b4a", mid: "#180c2a", front: "#05020a", window: "#c084fc", rim: "#d946ef" },
  amanhecer: { far: "#6d4a8a", mid: "#4b2d63", front: "#2a163c", window: "#fde68a", rim: "#fde68a" },
} as const;

export type CityTone = keyof typeof CITY_TONES;

export function Codopolis({
  tone = "noite",
  className = "h-[60%]",
  lamps = true,
  castle = true,
  clockLit = true,
}: {
  tone?: CityTone;
  className?: string;
  lamps?: boolean;
  /** A CodeGuilds no morro, lá atrás. */
  castle?: boolean;
  clockLit?: boolean;
}) {
  const c = CITY_TONES[tone];
  const id = useSvgId();
  const dawn = tone === "amanhecer";
  return (
    <svg viewBox="0 0 1600 500" preserveAspectRatio="xMidYMax slice" className={`pointer-events-none absolute bottom-0 left-0 w-full ${className}`} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-lamp`}>
          <stop offset="0" stopColor="#fde68a" stopOpacity="0.7" />
          <stop offset="1" stopColor="#fde68a" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* o morro com o castelo da CodeGuilds */}
      {castle && (
        <g>
          <path d="M860 380 C980 250 1180 220 1400 290 L1600 320 L1600 500 L860 500 Z" fill={c.far} />
          <g fill={c.far}>
            <path d="M1160 250 L1160 150 L1150 150 L1176 92 L1202 150 L1192 150 L1192 250 Z" />
            <path d="M1200 250 L1200 120 L1188 120 L1222 46 L1256 120 L1244 120 L1244 250 Z" />
            <path d="M1250 250 L1250 160 L1240 160 L1268 104 L1296 160 L1286 160 L1286 250 Z" />
            <rect x="1150" y="200" width="150" height="60" />
          </g>
          {!dawn &&
            [
              [1170, 170],
              [1216, 140],
              [1230, 190],
              [1262, 186],
              [1200, 222],
            ].map(([x, y], i) => <rect key={i} x={x} y={y} width="6" height="10" fill="#fbbf24" className="cg-anim-eye" style={{ animationDelay: `${i * 0.4}s` }} />)}
        </g>
      )}
      {/* casas do fundo */}
      {BACK_HOUSES.map((h, i) => (
        <g key={`b${i}`}>
          <path d={housePath(h)} fill={c.mid} />
          {!dawn &&
            houseWindows(h, i + 3)
              .filter((_, k) => k % 2 === 0)
              .map((w, k) => <path key={k} d={w.d} fill={c.window} opacity={w.lit ? 0.45 : 0.08} />)}
        </g>
      ))}
      {/* torre do relógio */}
      <g>
        <path d="M652 500 L652 170 L640 170 L690 34 L740 170 L728 170 L728 500 Z" fill={c.front} stroke={c.rim} strokeOpacity="0.35" strokeWidth="2" />
        <circle cx="690" cy="214" r="31" fill={clockLit && !dawn ? "#fde68a" : "#cbd5e1"} opacity={clockLit ? 0.95 : 0.4} style={clockLit && !dawn ? { filter: "drop-shadow(0 0 14px #fde68a)" } : undefined} />
        <circle cx="690" cy="214" r="31" fill="none" stroke={c.front} strokeWidth="4" />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d="M690 187 L690 192" stroke={c.front} strokeWidth="2.5" transform={`rotate(${i * 30} 690 214)`} />
        ))}
        <path d="M690 214 L690 192 M690 214 L690 198" stroke={c.front} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M676 300 L676 284 L690 272 L704 284 L704 300 Z M676 380 L676 364 L690 352 L704 364 L704 380 Z" fill={c.window} opacity={dawn ? 0.2 : 0.8} />
      </g>
      {/* igreja de torre fina */}
      <g>
        <path d="M960 500 L960 304 L1005 262 L1050 304 L1050 500 Z" fill={c.front} />
        <path d="M990 270 L990 170 L984 170 L1005 72 L1026 170 L1020 170 L1020 270 Z" fill={c.front} stroke={c.rim} strokeOpacity="0.35" strokeWidth="2" />
        <path d="M994 380 L994 344 Q1005 326 1016 344 L1016 380 Z" fill={c.window} opacity={dawn ? 0.2 : 0.85} className={dawn ? undefined : "cg-anim-eye"} />
        <circle cx="1005" cy="306" r="12" fill={c.window} opacity={dawn ? 0.2 : 0.7} />
      </g>
      {/* casas da frente, tortas, com chaminés e janelas acesas */}
      {FRONT_HOUSES.map((h, i) => (
        <g key={`f${i}`}>
          {i % 3 === 0 && <path d={poly([[h.x + h.w * 0.68, h.top - 30], [h.x + h.w * 0.68 + 18, h.top - 36], [h.x + h.w * 0.68 + 18, h.top + 6], [h.x + h.w * 0.68, h.top + 6]])} fill={c.front} />}
          <path d={housePath(h)} fill={c.front} stroke={c.rim} strokeOpacity="0.28" strokeWidth="2" />
          {houseWindows(h, i).map((w, k) => (
            <path key={k} d={w.d} fill={c.window} opacity={dawn ? 0.15 : w.lit ? 0.92 : 0.1} className={!dawn && w.lit ? "cg-anim-eye" : undefined} style={!dawn && w.lit ? { animationDelay: `${w.delay}s`, animationDuration: "3.4s" } : undefined} />
          ))}
          {i % 2 === 1 && !dawn && (
            <g>
              <path d={`M${h.x + h.w * 0.5 - 12} 500 L${h.x + h.w * 0.5 - 12} 470 L${h.x + h.w * 0.5} 460 L${h.x + h.w * 0.5 + 12} 470 L${h.x + h.w * 0.5 + 12} 500 Z`} fill="#1c0d07" />
              <circle cx={h.x + h.w * 0.5 + 22} cy="492" r="7" fill="#ea580c" />
              <circle cx={h.x + h.w * 0.5 + 22} cy="492" r="16" fill="#fb923c" opacity="0.25" className="cg-anim-eye" />
            </g>
          )}
        </g>
      ))}
      {/* postes de luz */}
      {lamps &&
        [262, 600, 910, 1240].map((x, i) => (
          <g key={x}>
            <path d={`M${x} 500 L${x} 414 M${x - 10} 414 L${x + 10} 414`} stroke={c.front} strokeWidth="5" />
            <path d={`M${x - 8} 414 L${x - 6} 398 L${x + 6} 398 L${x + 8} 414 Z`} fill={dawn ? "#e5e7eb" : "#fde68a"} />
            {!dawn && <circle cx={x} cy="406" r="42" fill={`url(#${id}-lamp)`} className="cg-anim-eye" style={{ animationDelay: `${i * 0.6}s`, animationDuration: "4s" }} />}
          </g>
        ))}
      <rect x="0" y="494" width="1600" height="6" fill={c.front} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Campo de abóboras: o celeiro velho, a estrada de terra e o milharal seco
// ---------------------------------------------------------------------------

const STALKS: [number, number, number][] = Array.from({ length: 34 }, (_, i) => {
  const left = i < 17;
  const k = left ? i : i - 17;
  const x = left ? 10 + k * 26 + ((k * 7) % 11) : 1590 - k * 26 - ((k * 5) % 13);
  return [x, 300 + ((k * 37) % 70) - k * 3, ((i * 13) % 9) - 4];
});

function CornStalk({ x, top, lean }: { x: number; top: number; lean: number }) {
  const leaves: [number, number][] = [
    [0.3, -1],
    [0.45, 1],
    [0.6, -1],
    [0.75, 1],
  ];
  const h = 500 - top;
  return (
    <g>
      <path d={`M${x} 500 Q${x + lean * 2} ${top + h * 0.5} ${x + lean * 4} ${top}`} stroke="#3a2f14" strokeWidth="4" fill="none" />
      {leaves.map(([f, side]) => {
        const y = 500 - h * f;
        const bx = x + lean * 4 * f;
        return <path key={f} d={poly([[bx, y], [bx + side * 34, y - 18 + lean], [bx + side * 46, y - 4], [bx + side * 30, y - 8]])} fill={f > 0.5 ? "#4d3f17" : "#3a2f14"} />;
      })}
      <path d={`M${x + lean * 4} ${top} l-6 -16 m6 16 l2 -20 m-2 20 l8 -14`} stroke="#8a6d2a" strokeWidth="2" />
    </g>
  );
}

export function PumpkinField({ className = "h-[62%]", barn = true }: { className?: string; barn?: boolean }) {
  return (
    <svg viewBox="0 0 1600 500" preserveAspectRatio="xMidYMax slice" className={`pointer-events-none absolute bottom-0 left-0 w-full ${className}`} aria-hidden="true">
      {/* morros lá longe */}
      <path d="M0 250 C200 200 380 230 560 210 C760 190 900 240 1100 216 C1300 196 1460 224 1600 214 L1600 500 L0 500 Z" fill="#1d1236" />
      <path d="M0 290 C240 260 420 290 640 270 C860 252 1040 290 1260 268 C1420 252 1520 270 1600 262 L1600 500 L0 500 Z" fill="#140b22" />
      {/* celeiro velho com as janelas acesas */}
      {barn && (
        <g transform="translate(330 168)">
          <path d={poly([[0, 120], [0, 50], [30, 16], [80, 0], [130, 16], [160, 50], [160, 120]])} fill="#0d0710" stroke="#fb923c" strokeOpacity="0.3" strokeWidth="2" />
          <path d={poly([[-8, 52], [30, 12], [80, -6], [130, 12], [168, 52], [160, 56], [128, 20], [80, 4], [32, 20], [0, 56]])} fill="#1a0f14" />
          <rect x="58" y="62" width="44" height="58" fill="#1c0d07" />
          <path d="M58 62 L102 120 M102 62 L58 120" stroke="#3b2414" strokeWidth="3" />
          <rect x="18" y="62" width="18" height="16" fill="#fbbf24" className="cg-anim-eye" />
          <rect x="124" y="62" width="18" height="16" fill="#fbbf24" className="cg-anim-eye" style={{ animationDelay: "0.8s" }} />
          <path d="M72 28 L80 20 L88 28 L88 40 L72 40 Z" fill="#fbbf24" opacity="0.8" />
        </g>
      )}
      {/* estrada de terra serpenteando até o celeiro */}
      <path d="M700 500 C720 440 600 420 560 380 C520 344 560 316 450 292 L470 290 C590 312 560 344 600 376 C650 416 800 440 820 500 Z" fill="#2a1a12" />
      <path d="M560 380 C520 344 560 316 450 292" stroke="#5b3a22" strokeWidth="2" fill="none" opacity="0.6" />
      {/* cerquinha torta */}
      {[520, 560, 600, 640, 680].map((x, i) => (
        <path key={x} d={`M${x} ${352 + i * 22} L${x - 2} ${322 + i * 22}`} stroke="#3b2414" strokeWidth="5" />
      ))}
      <path d="M520 336 L682 410 M520 346 L682 420" stroke="#3b2414" strokeWidth="3" />
      {/* chão e milharal seco dos dois lados */}
      <path d="M0 420 C300 400 500 430 800 420 C1100 410 1300 432 1600 418 L1600 500 L0 500 Z" fill="#0e0708" />
      {STALKS.map(([x, top, lean], i) => (
        <CornStalk key={i} x={x} top={top} lean={lean} />
      ))}
      {/* abobrinhas no fundo */}
      {[
        [220, 450],
        [470, 470],
        [1120, 456],
        [1350, 474],
        [900, 480],
      ].map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx="16" ry="12" fill="#9a3412" />
          <path d={`M${x - 6} ${y - 2} l3 -3 l3 3 Z M${x + 6} ${y - 2} l-3 -3 l-3 3 Z M${x - 6} ${y + 4} L${x + 6} ${y + 4}`} fill="#fde047" stroke="#fde047" strokeWidth="1.2" />
        </g>
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Circo sombrio: a lona listrada e rasgada, as luzinhas e o carrossel
// ---------------------------------------------------------------------------

export function CircusTent({ className = "" }: { className?: string }) {
  const id = useSvgId();
  const stripes = Array.from({ length: 12 }, (_, i) => i);
  return (
    <svg viewBox="0 0 800 520" className={`pointer-events-none overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <clipPath id={`${id}-roof`}>
          <path d="M400 40 L130 226 L670 226 Z" />
        </clipPath>
        <clipPath id={`${id}-wall`}>
          <rect x="160" y="222" width="480" height="276" />
        </clipPath>
        <radialGradient id={`${id}-door`} cx="400" cy="420" r="120" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f0abfc" />
          <stop offset="0.5" stopColor="#a21caf" />
          <stop offset="1" stopColor="#2e1065" />
        </radialGradient>
      </defs>
      {/* bandeira rasgada no topo */}
      <path d="M400 40 L400 -6" stroke="#1c1917" strokeWidth="4" />
      <g className="cg-anim-cape" style={animVars({ dur: 1.4 })}>
        <path d={jagged([[402, -6], [446, 2], [440, 12], [450, 22], [402, 18]], 3, 8, 107)} fill="#7f1d1d" />
      </g>
      {/* telhado listrado */}
      <g clipPath={`url(#${id}-roof)`}>
        <rect x="120" y="30" width="560" height="200" fill="#1c0a10" />
        {stripes.map((i) => (
          <path key={i} d={`M400 40 L${130 + i * 45} 230 L${152 + i * 45} 230 Z`} fill="#7f1d1d" />
        ))}
      </g>
      {/* paredes listradas */}
      <g clipPath={`url(#${id}-wall)`}>
        <rect x="160" y="222" width="480" height="280" fill="#1c0a10" />
        {stripes.map((i) => (
          <rect key={i} x={160 + i * 44} y="222" width="22" height="280" fill="#6b1420" />
        ))}
        <path d={jagged([[540, 300], [600, 296], [596, 360], [548, 352]], 5, 9, 109)} fill="#050307" />
      </g>
      <path d="M160 222 L160 498 M640 222 L640 498" stroke="#fb923c" strokeOpacity="0.3" strokeWidth="2" />
      {/* barrado em ondas pontudas */}
      <path d={`M130 226 ${Array.from({ length: 12 }, (_, i) => `L${152 + i * 45} 252 L${175 + i * 45} 226`).join(" ")} Z`} fill="#a3123a" stroke="#1c0a10" strokeWidth="2" />
      {/* entrada em arco com luz roxa lá dentro */}
      <path d="M346 498 L346 400 Q400 330 454 400 L454 498 Z" fill={`url(#${id}-door)`} className="cg-anim-eye" style={{ animationDuration: "3s" }} />
      <path d="M340 498 L340 398 Q400 322 460 398 L460 498" stroke="#1c0a10" strokeWidth="8" fill="none" />
      {/* placa */}
      <path d={poly([[300, 288], [500, 288], [512, 306], [500, 324], [300, 324], [288, 306]])} fill="#140a24" stroke="#fbbf24" strokeWidth="2" />
      <text x="400" y="313" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="bold" fontSize="22" letterSpacing="3" fill="#fde68a">
        CIRCO SOMBRIO
      </text>
      {/* cordões de luzinhas */}
      {[
        [400, 40, 130, 226],
        [400, 40, 670, 226],
        [400, 40, 280, 226],
        [400, 40, 520, 226],
      ].map(([x1, y1, x2, y2], s) =>
        Array.from({ length: 9 }, (_, i) => {
          const f = (i + 1) / 10;
          return (
            <circle
              key={`${s}-${i}`}
              cx={x1 + (x2 - x1) * f}
              cy={y1 + (y2 - y1) * f + Math.sin(f * Math.PI) * 10}
              r="4"
              fill={["#fde047", "#f43f5e", "#a855f7"][(i + s) % 3]}
              className="cg-anim-eye"
              style={{ animationDelay: `${((i + s * 2) % 6) * 0.25}s`, animationDuration: "1.5s" }}
            />
          );
        }),
      )}
    </svg>
  );
}

const HORSE = "M0 0 L10 -4 L22 -2 L30 -12 L36 -10 L34 -2 L30 2 L28 12 L24 12 L22 4 L8 6 L6 14 L2 14 L2 4 Z";

export function Carousel({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 260" className={`pointer-events-none overflow-visible ${className}`} aria-hidden="true">
      {/* cobertura listrada e mastro */}
      <path d="M150 10 L20 90 L280 90 Z" fill="#1c0a10" />
      {Array.from({ length: 7 }, (_, i) => (
        <path key={i} d={`M150 10 L${20 + i * 40} 90 L${40 + i * 40} 90 Z`} fill="#6b1420" />
      ))}
      <path d={`M20 90 ${Array.from({ length: 7 }, (_, i) => `L${38 + i * 37} 104 L${57 + i * 37} 90`).join(" ")} Z`} fill="#a3123a" />
      <rect x="146" y="90" width="8" height="130" fill="#d4a017" />
      {/* cavalinhos subindo e descendo, girando ao contrário */}
      {[50, 110, 190, 250].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 104 L${x} 220`} stroke="#d4a017" strokeWidth="3" />
          <g className="cg-anim-float" style={{ animationDelay: `${-i * 0.7}s`, animationDuration: "2.2s" }}>
            <g transform={`translate(${x - 18} 160) scale(${i % 2 ? -1.2 : 1.2} 1.2) translate(${i % 2 ? -30 : 0} 0)`}>
              <path d={HORSE} fill={["#e2e8f0", "#1c1917", "#7f1d1d", "#4c1d95"][i]} stroke="#fde68a" strokeWidth="0.8" />
              <circle cx="31" cy="-8" r="1.2" fill="#f43f5e" />
            </g>
          </g>
        </g>
      ))}
      <ellipse cx="150" cy="226" rx="138" ry="18" fill="#2a0a14" stroke="#d4a017" strokeWidth="3" />
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} cx={30 + i * 30} cy="96" r="3.5" fill={i % 2 ? "#fde047" : "#f43f5e"} className="cg-anim-eye" style={{ animationDelay: `${(8 - i) * 0.18}s`, animationDuration: "1.6s" }} />
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// O Castelo de Dracoding no alto do penhasco (viewBox 900×700)
// ---------------------------------------------------------------------------

/** Torre gótica: corpo de (x, top) até o chão do castelo, com o telhado pontudo subindo até `spire`. */
function Tower({ x, w, top, spire, fill }: { x: number; w: number; top: number; spire: number; fill: string }) {
  return (
    <g>
      <path d={poly([[x, 440], [x, top], [x - 8, top], [x + w / 2, spire], [x + w + 8, top], [x + w, top], [x + w, 440]])} fill={fill} />
      <path d={`M${x + w / 2} ${spire} L${x + w / 2} ${spire - 16}`} stroke={fill} strokeWidth="3" />
    </g>
  );
}

export function CrimsonCastle({ className = "", lit = true }: { className?: string; lit?: boolean }) {
  const id = useSvgId();
  const stone = "#08050c";
  const glow = lit ? "#ef4444" : "#4b5563";
  const windows: [number, number, number][] = [
    [404, 230, 14],
    [482, 230, 14],
    [320, 300, 10],
    [560, 290, 10],
    [262, 350, 8],
    [622, 340, 8],
    [430, 330, 12],
    [458, 330, 12],
    [340, 380, 9],
    [540, 380, 9],
  ];
  return (
    <svg viewBox="0 0 900 700" preserveAspectRatio="xMidYMax meet" className={`pointer-events-none overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-cliff`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a0d16" />
          <stop offset="1" stopColor="#050206" />
        </linearGradient>
        <RimGradient id={`${id}-rim`} x1={100} x2={800} left="#a5b4fc" right="#fb7185" leftOpacity={0.5} rightOpacity={0.7} />
      </defs>
      {/* penhasco de rocha, com as faces das pedras */}
      <path
        d={jagged(
          [
            [60, 700],
            [120, 610],
            [150, 560],
            [196, 520],
            [214, 470],
            [240, 446],
            [300, 432],
            [600, 432],
            [664, 450],
            [690, 494],
            [736, 540],
            [762, 604],
            [830, 700],
          ],
          14,
          26,
          113,
          true,
          0.9,
        )}
        fill={`url(#${id}-cliff)`}
        stroke={`url(#${id}-rim)`}
        strokeWidth="2"
      />
      <g opacity="0.85">
        <path d={poly([[214, 470], [290, 452], [330, 520], [262, 560], [196, 522]])} fill="#241221" />
        <path d={poly([[600, 440], [664, 452], [690, 494], [640, 540], [586, 500]])} fill="#2a1424" />
        <path d={poly([[330, 520], [430, 470], [470, 560], [400, 640], [300, 610]])} fill="#120810" />
        <path d={poly([[520, 470], [600, 500], [640, 560], [570, 640], [480, 590]])} fill="#1a0c18" />
        <path d={poly([[150, 560], [262, 560], [300, 610], [220, 680], [120, 612]])} fill="#0d060c" />
        <path d={poly([[640, 540], [736, 540], [762, 604], [700, 680], [600, 640]])} fill="#14090f" />
      </g>
      <path d="M262 560 L330 520 L430 470 M300 610 L400 640 L480 590 L570 640 M600 500 L640 540 L700 680" stroke="#fb7185" strokeWidth="1.5" opacity="0.25" fill="none" />
      {/* torres (as de trás mais claras, pra dar profundidade) */}
      <Tower x={250} w={40} top={300} spire={210} fill="#140a14" />
      <Tower x={612} w={40} top={290} spire={196} fill="#140a14" />
      <g stroke={`url(#${id}-rim)`} strokeWidth="2">
        <Tower x={300} w={62} top={230} spire={112} fill={stone} />
        <Tower x={540} w={62} top={220} spire={96} fill={stone} />
        {/* muralha com ameias */}
        <path d={`M240 440 L240 360 ${Array.from({ length: 21 }, (_, i) => `L${240 + i * 20} ${i % 2 ? 360 : 346}`).join(" ")} L660 360 L660 440 Z`} fill={stone} />
        <Tower x={380} w={140} top={180} spire={18} fill={stone} />
      </g>
      {/* rosácea vermelha na torre principal */}
      <circle cx="450" cy="268" r="26" fill={glow} opacity={lit ? 0.9 : 0.4} className={lit ? "cg-anim-eye" : undefined} style={lit ? { filter: "drop-shadow(0 0 12px #ef4444)" } : undefined} />
      <g stroke={stone} strokeWidth="3">
        {[0, 30, 60, 90, 120, 150].map((a) => (
          <line key={a} x1="424" y1="268" x2="476" y2="268" transform={`rotate(${a} 450 268)`} />
        ))}
      </g>
      <circle cx="450" cy="268" r="8" fill={stone} />
      {/* janelas pontudas acesas de vermelho */}
      {windows.map(([x, y, w], i) => (
        <path
          key={i}
          d={`M${x - w / 2} ${y + w * 2} L${x - w / 2} ${y + w * 0.6} L${x} ${y} L${x + w / 2} ${y + w * 0.6} L${x + w / 2} ${y + w * 2} Z`}
          fill={glow}
          opacity={lit ? 0.92 : 0.35}
          className={lit ? "cg-anim-eye" : undefined}
          style={lit ? { animationDelay: `${i * 0.31}s`, filter: "drop-shadow(0 0 6px #ef4444)" } : undefined}
        />
      ))}
      {/* portão com a grade levadiça */}
      <path d="M420 440 L420 392 Q450 360 480 392 L480 440 Z" fill="#020103" />
      <path d="M428 440 L428 390 M440 440 L440 378 M452 440 L452 372 M464 440 L464 378 M476 440 L476 390 M422 404 L478 404 M422 420 L478 420" stroke="#3f3f46" strokeWidth="2" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Ponte de pedra sobre o abismo, em perspectiva até o portão (viewBox 900×360)
// ---------------------------------------------------------------------------

export function StoneBridge({ className = "" }: { className?: string }) {
  const id = useSvgId();
  return (
    <svg viewBox="0 0 900 360" preserveAspectRatio="xMidYMax meet" className={`pointer-events-none overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-deck`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#2a2230" />
          <stop offset="1" stopColor="#0b0710" />
        </linearGradient>
      </defs>
      <path d="M200 360 L700 360 L478 40 L422 40 Z" fill={`url(#${id}-deck)`} />
      {/* juntas das pedras, todas fugindo pro portão */}
      {[0.12, 0.26, 0.42, 0.6, 0.8].map((f) => {
        const y = 40 + 320 * f;
        const half = 28 + 222 * f;
        return <path key={f} d={`M${450 - half} ${y} L${450 + half} ${y}`} stroke="#000" strokeWidth={1 + f * 2} opacity="0.55" />;
      })}
      {[-0.5, 0, 0.5].map((k) => (
        <path key={k} d={`M${450 + k * 28} 40 L${450 + k * 250} 360`} stroke="#000" strokeWidth="1.5" opacity="0.4" />
      ))}
      {/* parapeitos com ameias */}
      {[-1, 1].map((side) => (
        <g key={side}>
          <path d={`M${450 + side * 28} 40 L${450 + side * 250} 360 L${450 + side * 286} 360 L${450 + side * 34} 26 Z`} fill="#120c16" stroke="#fb7185" strokeOpacity="0.3" strokeWidth="1.5" />
          {[0.2, 0.4, 0.6, 0.8].map((f) => {
            const x = 450 + side * (28 + 222 * f);
            const y = 40 + 320 * f;
            const s = 0.4 + f * 1.4;
            return (
              <g key={f}>
                <path d={`M${x} ${y} L${x} ${y - 30 * s} M${x - 3 * s} ${y - 30 * s} L${x + 3 * s} ${y - 30 * s}`} stroke="#0b0710" strokeWidth={3 * s} />
                <circle cx={x} cy={y - 34 * s} r={4 * s} fill="#ef4444" className="cg-anim-eye" style={{ animationDelay: `${f * 2}s`, filter: "drop-shadow(0 0 6px #ef4444)" }} />
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Vitral do Amanhecer: janela gótica com rosácea — apagado ou aceso (viewBox 120×260)
// ---------------------------------------------------------------------------

const GLASS_PALETTES = [
  ["#ef4444", "#f59e0b", "#fde047"],
  ["#f59e0b", "#fde047", "#fb923c"],
  ["#3b82f6", "#22d3ee", "#a78bfa"],
] as const;

export function StainedGlassShape({ lit, palette = 0 }: { lit: boolean; palette?: number }) {
  const colors = GLASS_PALETTES[palette % GLASS_PALETTES.length];
  const pane = (i: number) => (lit ? colors[i % 3] : ["#1e1b2e", "#241f36", "#1a1726"][i % 3]);
  const panes: [string, number][] = [
    ["M14 120 L58 120 L58 178 L14 178 Z", 0],
    ["M62 120 L106 120 L106 178 L62 178 Z", 1],
    ["M14 182 L58 182 L58 256 L14 256 Z", 2],
    ["M62 182 L106 182 L106 256 L62 256 Z", 0],
    ["M14 116 L14 92 Q14 54 36 34 L58 64 L58 116 Z", 1],
    ["M106 116 L106 92 Q106 54 84 34 L62 64 L62 116 Z", 2],
  ];
  return (
    <g>
      {lit && <path d="M10 260 L10 90 Q10 30 60 4 Q110 30 110 90 L110 260 Z" fill={colors[1]} opacity="0.5" style={{ filter: "blur(10px)" }} />}
      <path d="M10 260 L10 90 Q10 30 60 4 Q110 30 110 90 L110 260 Z" fill="#0b0710" />
      {panes.map(([d, i]) => (
        <path key={d} d={d} fill={pane(i)} opacity={lit ? 0.95 : 0.9} />
      ))}
      {/* losangos de chumbo */}
      <g stroke="#0b0710" strokeWidth="2" opacity="0.8">
        {[132, 150, 168, 200, 222, 244].map((y) => (
          <path key={y} d={`M14 ${y} L106 ${y}`} />
        ))}
        {[36, 84].map((x) => (
          <path key={x} d={`M${x} 120 L${x} 256`} />
        ))}
      </g>
      {/* rosácea no alto */}
      <circle cx="60" cy="66" r="24" fill={lit ? "#fde68a" : "#2a2440"} />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <path key={a} d="M60 66 L60 44 Q70 52 60 66 Z" fill={lit ? colors[(a / 60) % 3] : "#1e1b2e"} transform={`rotate(${a} 60 66)`} />
      ))}
      <circle cx="60" cy="66" r="6" fill={lit ? "#fff7ed" : "#151221"} />
      <path d="M10 260 L10 90 Q10 30 60 4 Q110 30 110 90 L110 260 Z M60 4 L60 260 M10 118 L110 118 M10 180 L110 180" stroke="#1c1424" strokeWidth="6" fill="none" />
      <circle cx="60" cy="66" r="24" stroke="#1c1424" strokeWidth="4" fill="none" />
    </g>
  );
}

// ---------------------------------------------------------------------------
// O Relógio do Amanhecer (viewBox -110 -110 220 220)
// ---------------------------------------------------------------------------

const NUMERALS = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];

export function ClockFace({
  hour = 23,
  minute = 59,
  running = false,
  glow = "#fde68a",
  className = "",
}: {
  hour?: number;
  minute?: number;
  /** Os ponteiros giram até as 6 da manhã (fim do evento). */
  running?: boolean;
  glow?: string;
  className?: string;
}) {
  const id = useSvgId();
  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = minute * 6;
  return (
    <svg viewBox="-110 -110 220 220" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-face`}>
          <stop offset="0" stopColor="#fffbeb" />
          <stop offset="0.75" stopColor={glow} />
          <stop offset="1" stopColor="#b45309" />
        </radialGradient>
      </defs>
      <g className="cg-anim-glow"><circle r="108" fill={glow} opacity="0.25" /></g>
      <path d={jagged(Array.from({ length: 24 }, (_, i) => [Math.cos((i * Math.PI) / 12) * 100, Math.sin((i * Math.PI) / 12) * 100] as Pt), 8, 12, 127)} fill="#1c1424" stroke="#a16207" strokeWidth="2" />
      <circle r="92" fill={`url(#${id}-face)`} stroke="#713f12" strokeWidth="4" />
      <circle r="70" fill="none" stroke="#92400e" strokeWidth="1.2" opacity="0.6" />
      {Array.from({ length: 60 }, (_, i) => (
        <path key={i} d={`M0 -88 L0 ${i % 5 ? -84 : -80}`} stroke="#451a03" strokeWidth={i % 5 ? 1 : 2.4} transform={`rotate(${i * 6})`} />
      ))}
      {NUMERALS.map((n, i) => {
        const a = (i * 30 - 90) * (Math.PI / 180);
        return (
          <text key={n} x={Math.cos(a) * 66} y={Math.sin(a) * 66 + 5} textAnchor="middle" fontFamily="Georgia, serif" fontWeight="bold" fontSize={i % 3 === 0 ? 16 : 12} fill="#451a03">
            {n}
          </text>
        );
      })}
      {/* ponteiros (rodando até as 6h no final) */}
      <g
        className={running ? "cg-anim-clock-run" : undefined}
        style={running ? ({ "--cg-from": `${hourAngle}deg`, "--cg-to": "540deg", "--cg-origin": "0px 0px", transform: "rotate(540deg)" } as React.CSSProperties) : { transform: `rotate(${hourAngle}deg)` }}
      >
        <path d="M-5 8 L-3 -36 L0 -50 L3 -36 L5 8 Z M0 -50 L-8 -40 L0 -32 L8 -40 Z" fill="#1c1917" />
      </g>
      <g
        className={running ? "cg-anim-clock-run" : undefined}
        style={running ? ({ "--cg-from": `${minuteAngle}deg`, "--cg-to": "2520deg", "--cg-origin": "0px 0px", transform: "rotate(2520deg)" } as React.CSSProperties) : { transform: `rotate(${minuteAngle}deg)` }}
      >
        <path d="M-3 12 L-2 -70 L0 -80 L2 -70 L3 12 Z" fill="#1c1917" />
      </g>
      <circle r="7" fill="#a16207" stroke="#451a03" strokeWidth="2" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Salão do trono do Dracoding (viewBox 1600×900): arcos, colunas, os três
// vitrais, o tapete vermelho, os candelabros e o trono de asas de morcego
// ---------------------------------------------------------------------------

function Candelabrum({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 L0 -150 M-40 -150 Q-40 -120 0 -120 Q40 -120 40 -150 M-24 30 L24 30 L10 0 L-10 0 Z" stroke="#a16207" strokeWidth="6" fill="#a16207" />
      {[-40, 0, 40].map((cx) => (
        <g key={cx}>
          <rect x={cx - 6} y={-186} width="12" height="36" fill="#f5f5f4" />
          <g className="cg-anim-glow"><circle cx={cx} cy={-200} r="26" fill="#fbbf24" opacity="0.25" /></g>
          <path d={`M${cx} -210 C${cx - 7} -200 ${cx - 5} -190 ${cx} -188 C${cx + 5} -190 ${cx + 7} -200 ${cx} -210 Z`} fill="#fb923c" className="cg-anim-flicker" />
        </g>
      ))}
    </g>
  );
}

export function ThroneHall({ className = "", sunlight = false, litWindows = 0 }: { className?: string; sunlight?: boolean; litWindows?: number }) {
  const id = useSvgId();
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#120910" />
          <stop offset="1" stopColor="#2a1622" />
        </linearGradient>
        <linearGradient id={`${id}-carpet`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4c0519" />
          <stop offset="1" stopColor="#9f1239" />
        </linearGradient>
        <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fef3c7" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fde68a" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* parede de pedra */}
      <rect width="1600" height="900" fill="#0d070d" />
      {Array.from({ length: 14 }, (_, r) => (
        <path key={r} d={`M0 ${r * 46} L1600 ${r * 46}`} stroke="#000" strokeWidth="2" opacity="0.5" />
      ))}
      {Array.from({ length: 14 }, (_, r) =>
        Array.from({ length: 17 }, (_, c) => <path key={`${r}-${c}`} d={`M${c * 100 + (r % 2) * 50} ${r * 46} L${c * 100 + (r % 2) * 50} ${r * 46 + 46}`} stroke="#000" strokeWidth="2" opacity="0.4" />),
      )}
      {/* os três vitrais (os da esquerda acendem primeiro) */}
      {[560, 740, 920].map((x, i) => (
        <g key={x} transform={`translate(${x} 110) scale(1.05)`}>
          <StainedGlassShape lit={i < litWindows} palette={i} />
        </g>
      ))}
      {/* colunas e arcos pontudos */}
      {[260, 1340].map((x) => (
        <g key={x}>
          <rect x={x - 34} y="60" width="68" height="640" fill="#1a0f18" stroke="#2a1622" strokeWidth="4" />
          <rect x={x - 46} y="660" width="92" height="40" fill="#120910" />
        </g>
      ))}
      <path d="M226 60 Q800 -120 1374 60" stroke="#1a0f18" strokeWidth="40" fill="none" />
      <path d="M226 60 Q520 -60 800 60 Q1080 -60 1374 60" stroke="#120910" strokeWidth="20" fill="none" />
      {/* estandartes com o morcego */}
      {[420, 1180].map((x) => (
        <g key={x}>
          <path d={`M${x - 46} 60 L${x + 46} 60 L${x + 46} 330 L${x} 300 L${x - 46} 330 Z`} fill="#7f1d1d" stroke="#d4a017" strokeWidth="3" />
          <path transform={`translate(${x} 170) scale(2.2)`} d="M0 -3 L-4 -6 L-10 -9 L-18 -8 L-27 -13 L-22 -3 L-25 4 L-16 1 L-12 7 L-6 2 L0 6 L6 2 L12 7 L16 1 L25 4 L22 -3 L27 -13 L18 -8 L10 -9 L4 -6 Z" fill="#0b0710" />
        </g>
      ))}
      {/* chão em perspectiva e tapete vermelho */}
      <path d="M0 640 L1600 640 L1600 900 L0 900 Z" fill={`url(#${id}-floor)`} />
      {[-6, -4, -2, 0, 2, 4, 6].map((k) => (
        <path key={k} d={`M${800 + k * 40} 640 L${800 + k * 260} 900`} stroke="#000" strokeWidth="2" opacity="0.5" />
      ))}
      {[680, 740, 820].map((y) => (
        <path key={y} d={`M0 ${y} L1600 ${y}`} stroke="#000" strokeWidth="2" opacity="0.4" />
      ))}
      <path d="M720 640 L880 640 L1060 900 L540 900 Z" fill={`url(#${id}-carpet)`} />
      <path d="M720 640 L540 900 M880 640 L1060 900" stroke="#d4a017" strokeWidth="4" />
      {/* degraus e o trono de asas de morcego */}
      <path d="M640 640 L960 640 L940 610 L660 610 Z M670 610 L930 610 L914 586 L686 586 Z" fill="#1c1018" stroke="#3a2030" strokeWidth="2" />
      <path d="M740 586 L740 470 L700 440 L726 430 L716 380 L760 420 L800 330 L840 420 L884 380 L874 430 L900 440 L860 470 L860 586 Z" fill="#0b0710" stroke="#d4a017" strokeWidth="3" strokeLinejoin="round" />
      <path d="M760 586 L760 490 Q800 470 840 490 L840 586 Z" fill="#7f1d1d" />
      <circle cx="800" cy="410" r="10" fill="#e11d48" className="cg-anim-eye" style={{ filter: "drop-shadow(0 0 8px #e11d48)" }} />
      {/* candelabros */}
      <Candelabrum x={470} y={640} s={1.1} />
      <Candelabrum x={1130} y={640} s={1.1} />
      {/* luz do sol entrando pelos vitrais */}
      {sunlight &&
        [560, 740, 920].map((x, i) => (
          <path key={x} d={`M${x + 12} 380 L${x + 116} 380 L${x + 260 - i * 140} 900 L${x - 120 - i * 40} 900 Z`} fill={`url(#${id}-beam)`} className="cg-anim-beam-in" style={animVars({ delay: 0.4 + i * 0.3 })} />
        ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Caldeirão das bruxas, borbulhando (viewBox 220×180)
// ---------------------------------------------------------------------------

export function Cauldron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 180" className={`pointer-events-none overflow-visible ${className}`} aria-hidden="true">
      <g className="cg-anim-glow">
        <ellipse cx="110" cy="46" rx="86" ry="22" fill="#a3e635" opacity="0.35" style={{ filter: "blur(10px)" }} />
      </g>
      {/* fogo embaixo */}
      {[70, 110, 150].map((x, i) => (
        <path key={x} d={`M${x - 16} 178 C${x - 20} 154 ${x - 4} 150 ${x} 128 C${x + 6} 150 ${x + 20} 154 ${x + 16} 178 Z`} fill={i === 1 ? "#f97316" : "#ea580c"} className="cg-anim-flicker" style={{ animationDelay: `${i * 0.3}s` }} />
      ))}
      <path d="M50 170 L170 150 M50 150 L170 172" stroke="#3b2414" strokeWidth="9" strokeLinecap="round" />
      {/* panela */}
      <path d="M26 54 L194 54 L184 104 Q170 150 110 152 Q50 150 36 104 Z" fill="#0b0b10" stroke="#84cc16" strokeOpacity="0.4" strokeWidth="2" />
      <path d="M44 70 Q56 120 96 136" stroke="#3f3f46" strokeWidth="4" fill="none" opacity="0.7" />
      <ellipse cx="110" cy="54" rx="92" ry="16" fill="#18181b" stroke="#3f3f46" strokeWidth="4" />
      <ellipse cx="110" cy="54" rx="80" ry="11" fill="#65a30d" />
      <ellipse cx="110" cy="52" rx="56" ry="6" fill="#bef264" opacity="0.6" />
      {/* bolhas subindo */}
      {[
        [80, 0],
        [112, 0.5],
        [140, 1],
        [96, 1.4],
        [126, 1.9],
      ].map(([x, d]) => (
        <circle key={`${x}-${d}`} cx={x} cy="48" r="6" fill="#d9f99d" className="cg-anim-fizz" style={{ "--cg-delay": `${d}s` } as React.CSSProperties} />
      ))}
    </svg>
  );
}
