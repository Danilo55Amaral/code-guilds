"use client";

import { useId, useMemo } from "react";
import { DragonPose } from "@/engine/elderDragon";

// ============================================================================
// VAELZHAR, O DRAGÃO ANCESTRAL — desenhado em SVG (viewBox 600×600, de
// frente, com as garras dos pés em y≈575). O lado esquerdo é desenhado e o
// direito é o espelho dele. Cada junta (ombro, cotovelo, quadril, joelho,
// asa) gira sozinha, então as poses são só ângulos: a troca de pose anima
// com transição, e as asas batem/respiram com as classes cg-anim-dragon-*.
//
// Magia: na pose "magia" aparecem as esferas de energia nas mãos, os
// relâmpagos saindo delas, as esferas orbitando e os anéis orbitais. Na pose
// "rugido" a cabeça sobe e a mandíbula abre (a boca brilha em azul-verde).
// ============================================================================


interface Arm {
  shoulder: number; // graus; positivo = pra fora
  elbow: number; // graus; positivo = antebraço subindo pra fora
  open: boolean; // garras abertas
}

// [esquerdo, direito]
const ARMS: Record<DragonPose, [Arm, Arm]> = {
  voo: [
    { shoulder: 30, elbow: -70, open: false },
    { shoulder: 30, elbow: -70, open: false },
  ],
  pouso: [
    { shoulder: 34, elbow: -40, open: true },
    { shoulder: 34, elbow: -40, open: true },
  ],
  exibir: [
    { shoulder: 17, elbow: -22, open: false },
    { shoulder: 17, elbow: -22, open: false },
  ],
  magia: [
    { shoulder: 122, elbow: 34, open: true },
    { shoulder: 72, elbow: 18, open: true },
  ],
  rugido: [
    { shoulder: 52, elbow: 58, open: true },
    { shoulder: 52, elbow: 58, open: true },
  ],
  impulso: [
    { shoulder: 36, elbow: -62, open: false },
    { shoulder: 36, elbow: -62, open: false },
  ],
};

const WINGS: Record<DragonPose, number> = { voo: 0, pouso: 10, exibir: 6, magia: 16, rugido: -4, impulso: 32 };

const LEGS: Record<DragonPose, { hip: number; knee: number }> = {
  voo: { hip: 18, knee: -52 },
  pouso: { hip: 12, knee: -20 },
  exibir: { hip: 8, knee: -6 },
  magia: { hip: 10, knee: -7 },
  rugido: { hip: 12, knee: -9 },
  impulso: { hip: 14, knee: -26 },
};

const EASE = "transform 0.85s cubic-bezier(0.4, 0, 0.2, 1)";

// ---------------------------------------------------------------------------
// relâmpagos: caminhos em zigue-zague sorteados uma vez (semente fixa)
// ---------------------------------------------------------------------------

function seeded(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function boltPath(rand: () => number, from: [number, number], to: [number, number], jitter: number, steps = 11): string {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const len = Math.hypot(x2 - x1, y2 - y1);
  const nx = -(y2 - y1) / len;
  const ny = (x2 - x1) / len;
  let d = `M${x1} ${y1}`;
  for (let i = 1; i < steps; i++) {
    const f = i / steps;
    const off = (rand() - 0.5) * 2 * jitter * Math.sin(Math.PI * f);
    d += ` L${(x1 + (x2 - x1) * f + nx * off).toFixed(1)} ${(y1 + (y2 - y1) * f + ny * off).toFixed(1)}`;
  }
  // um galho saindo do meio
  return `${d} L${x2} ${y2}`;
}

function useBolts(seed: number, targets: [number, number][]) {
  return useMemo(() => {
    const rand = seeded(seed);
    return targets.map((to) =>
      [0, 1, 2].map(() => {
        const main = boltPath(rand, [0, 36], to, 34);
        const mid: [number, number] = [to[0] * (0.45 + rand() * 0.2), to[1] * (0.45 + rand() * 0.2)];
        const branchTo: [number, number] = [mid[0] + (rand() - 0.5) * 160, mid[1] + 60 + rand() * 90];
        return `${main} ${boltPath(rand, mid, branchTo, 18, 6)}`;
      }),
    );
  }, [seed, targets]);
}

// ---------------------------------------------------------------------------
// partes
// ---------------------------------------------------------------------------

const MEMBRANE = "M0 0 L-72 -58 L-152 -138 Q-228 -150 -292 -118 Q-262 -70 -312 -8 Q-252 30 -262 98 Q-206 100 -178 152 Q-100 110 -14 118 Z";
const FINGERS = ["M-152 -138 Q-222 -142 -292 -118", "M-152 -138 Q-240 -84 -312 -8", "M-152 -138 Q-214 -24 -262 98", "M-152 -138 Q-172 0 -178 152"];
const TIPS: [number, number, number][] = [
  [-292, -118, -160],
  [-312, -8, 170],
  [-262, 98, 120],
  [-178, 152, 95],
];

function Wing({ id, angle, flap, flapSeconds }: { id: string; angle: number; flap: boolean; flapSeconds: number }) {
  return (
    <g transform="translate(252 246)">
      <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: "0 0", transition: EASE }}>
        <g className={flap ? "cg-anim-dragon-flap" : "cg-anim-dragon-wing-breathe"} style={{ "--cg-dur": `${flapSeconds}s` } as React.CSSProperties}>
          <g transform="scale(1.04)">
            {/* membrana */}
            <path d={MEMBRANE} fill={`url(#${id}-membrane)`} stroke="#1c0b03" strokeWidth="2.5" strokeLinejoin="round" />
            {/* luz mágica na borda de baixo */}
            <path d="M-312 -8 Q-252 30 -262 98 Q-206 100 -178 152 Q-100 110 -14 118" fill="none" stroke="#5eead4" strokeOpacity="0.45" strokeWidth="2.5" />
            {/* veias de energia */}
            <g className="cg-anim-dragon-glow" fill="none" stroke="#2dd4bf" strokeOpacity="0.35" strokeWidth="1.3" style={{ "--cg-dur": "3.2s" } as React.CSSProperties}>
              <path d="M-152 -138 Q-196 -70 -236 20" />
              <path d="M-152 -138 Q-150 -40 -120 70" />
              <path d="M-200 -60 Q-240 -40 -280 -60" />
              <path d="M-190 20 Q-220 60 -232 90" />
              <path d="M-120 40 Q-90 70 -60 96" />
            </g>
            {/* rasgos antigos da membrana */}
            <path d="M-270 60 l14 -6 l-6 14 Z M-110 104 l10 -8 l2 12 Z" fill="#0b0402" opacity="0.8" />
            {/* ossos: braço da asa */}
            <path d="M0 0 L-72 -58 L-152 -138" fill="none" stroke="#2a1406" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M0 0 L-72 -58 L-152 -138" fill="none" stroke={`url(#${id}-bone)`} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            {/* dedos */}
            {FINGERS.map((d) => (
              <g key={d}>
                <path d={d} fill="none" stroke="#2a1406" strokeWidth="8" strokeLinecap="round" />
                <path d={d} fill="none" stroke={`url(#${id}-bone)`} strokeWidth="5" strokeLinecap="round" />
              </g>
            ))}
            {/* garrinhas nas pontas */}
            {TIPS.map(([x, y, a]) => (
              <path key={`${x}${y}`} d="M0 -4 L16 0 L0 4 Z" transform={`translate(${x} ${y}) rotate(${a})`} fill="#fef3c7" stroke="#2a1406" strokeWidth="1.2" />
            ))}
            {/* esporão curvo no pulso (a "cabeça" da asa) */}
            <path d="M-148 -132 C-170 -168 -168 -212 -144 -242 C-150 -208 -144 -176 -130 -146 Z" fill={`url(#${id}-horn)`} stroke="#2a1406" strokeWidth="2" strokeLinejoin="round" />
            <path d="M-40 -32 L-50 -52 L-30 -40 Z M-104 -90 L-116 -112 L-94 -98 Z M-128 -114 L-142 -134 L-120 -122 Z" fill="#f5c451" stroke="#2a1406" strokeWidth="1.4" />
            <circle cx="-152" cy="-138" r="9" fill={`url(#${id}-gold)`} stroke="#2a1406" strokeWidth="2" />
            <circle cx="-72" cy="-58" r="8" fill={`url(#${id}-gold)`} stroke="#2a1406" strokeWidth="2" />
            <path d="M-72 -64 L-90 -88 L-64 -70 Z" fill="#f5c451" stroke="#2a1406" strokeWidth="1.5" />
          </g>
        </g>
      </g>
    </g>
  );
}

function Hand({ id, open }: { id: string; open: boolean }) {
  const spread = open ? 1 : 0.45;
  return (
    <g>
      <path d="M-11 0 C-13 9 -11 17 -7 21 L7 21 C11 17 13 9 11 0 Z" fill={`url(#${id}-gold)`} stroke="#2a1406" strokeWidth="1.8" />
      {[-30, -11, 9, 28].map((a, i) => (
        <g key={a} transform={`translate(${-7 + i * 4.6} 18) rotate(${a * spread})`}>
          <path d="M-3 0 C-4 12 -3 22 0 34 C2 24 4 12 3 0 Z" fill={`url(#${id}-gold)`} stroke="#2a1406" strokeWidth="1.3" />
          <path d="M-1.6 30 C-1 38 0 42 3 46 C3 40 2 34 1.8 29 Z" fill="#fef9e7" stroke="#2a1406" strokeWidth="0.9" />
        </g>
      ))}
    </g>
  );
}

function HandMagic({ id, bolts, delay }: { id: string; bolts: string[][]; delay: number }) {
  return (
    <g>
      {/* relâmpagos (três versões de cada, piscando em rodízio = o raio "tremendo") */}
      <g filter={`url(#${id}-glow)`}>
        {bolts.map((variants, b) =>
          variants.map((d, v) => (
            <g key={`${b}-${v}`} className="cg-anim-dragon-bolt" style={{ "--cg-delay": `${-(v * 0.12 + b * 0.05 + delay)}s` } as React.CSSProperties}>
              <path d={d} fill="none" stroke="#22d3ee" strokeOpacity="0.45" strokeWidth="9" strokeLinejoin="round" strokeLinecap="round" />
              <path d={d} fill="none" stroke="#a5f3fc" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
              <path d={d} fill="none" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" />
            </g>
          )),
        )}
      </g>
      {/* esfera de energia na palma */}
      <circle cx="0" cy="36" r="24" fill={`url(#${id}-orb)`} opacity="0.75" className="cg-anim-dragon-glow" style={{ "--cg-dur": "0.9s" } as React.CSSProperties} />
      <circle cx="0" cy="36" r="10" fill="#f0fdfa" filter={`url(#${id}-glow)`} />
      <circle cx="0" cy="36" r="16" fill="none" stroke="#99f6e4" strokeWidth="1.4" strokeDasharray="4 5" className="cg-anim-dragon-orbital" style={{ "--cg-dur": "1.2s" } as React.CSSProperties} />
    </g>
  );
}

function ArmPart({ id, arm, magic, bolts, delay }: { id: string; arm: Arm; magic: boolean; bolts: string[][]; delay: number }) {
  return (
    <g transform="translate(236 264)">
      <g style={{ transform: `rotate(${arm.shoulder}deg)`, transformOrigin: "0 0", transition: EASE }}>
        {/* braço */}
        <path d="M-17 0 C-24 22 -20 52 -11 76 L11 76 C17 54 22 26 17 0 Z" fill={`url(#${id}-gold)`} stroke="#2a1406" strokeWidth="2" />
        <path d="M-7 8 C-14 26 -12 46 -5 62" fill="none" stroke="#fff4c2" strokeOpacity="0.55" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M-15 30 Q0 37 15 30 M-12 54 Q0 60 12 54" fill="none" stroke="#6e430d" strokeWidth="1.6" />
        <g transform="translate(0 74)">
          <g style={{ transform: `rotate(${arm.elbow}deg)`, transformOrigin: "0 0", transition: EASE }}>
            {/* espinho do cotovelo */}
            <path d="M-8 -6 L-26 18 L0 6 Z" fill="#f5c451" stroke="#2a1406" strokeWidth="1.5" />
            {/* antebraço com manopla */}
            <path d="M-15 0 C-17 20 -12 48 -9 68 L9 68 C12 48 17 20 15 0 Z" fill={`url(#${id}-plate)`} stroke="#2a1406" strokeWidth="2" />
            <path d="M-12 8 L-24 14 L-12 20 M-11 30 L-22 36 L-11 42 M-10 52 L-19 57 L-10 61" fill="#f5c451" stroke="#2a1406" strokeWidth="1.2" />
            <path d="M-9 14 Q0 18 9 14 M-9 36 Q0 40 9 36" fill="none" stroke="#fde68a" strokeOpacity="0.6" strokeWidth="1.4" />
            <g transform="translate(0 66)">
              <Hand id={id} open={arm.open} />
              <g style={{ opacity: magic ? 1 : 0, transition: "opacity 0.6s" }}>{magic && <HandMagic id={id} bolts={bolts} delay={delay} />}</g>
            </g>
          </g>
        </g>
        {/* junta do ombro */}
        <circle cx="0" cy="0" r="13" fill={`url(#${id}-gold)`} stroke="#2a1406" strokeWidth="2" />
      </g>
    </g>
  );
}

function Leg({ id, hip, knee }: { id: string; hip: number; knee: number }) {
  return (
    <g transform="translate(280 418)">
      <g style={{ transform: `rotate(${hip}deg)`, transformOrigin: "0 0", transition: EASE }}>
        {/* coxa */}
        <path d="M-25 0 C-32 26 -25 48 -12 66 L12 66 C23 46 26 22 21 0 Z" fill={`url(#${id}-gold)`} stroke="#2a1406" strokeWidth="2" />
        <path d="M-12 8 C-20 24 -18 40 -10 54" fill="none" stroke="#fff4c2" strokeOpacity="0.5" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M-17 20 Q0 27 16 20 M-14 40 Q0 46 14 40" fill="none" stroke="#6e430d" strokeWidth="1.6" />
        <g transform="translate(0 62)">
          <g style={{ transform: `rotate(${knee}deg)`, transformOrigin: "0 0", transition: EASE }}>
            {/* canela com grevas */}
            <path d="M-11 0 C-13 24 -10 50 -7 72 L7 72 C10 50 13 24 11 0 Z" fill={`url(#${id}-plate)`} stroke="#2a1406" strokeWidth="2" />
            <path d="M-9 18 Q0 23 9 18 M-8 40 Q0 45 8 40" fill="none" stroke="#fde68a" strokeOpacity="0.55" strokeWidth="1.4" />
            {/* pé com três garras */}
            <g transform="translate(0 70)">
              <path d="M-13 0 L13 0 L15 9 L-15 9 Z" fill={`url(#${id}-gold)`} stroke="#2a1406" strokeWidth="1.6" />
              {[-26, 0, 26].map((a) => (
                <path key={a} d="M-3.5 7 C-4 14 -2 20 1 25 C2 19 3.5 13 3.5 7 Z" transform={`rotate(${a})`} fill="#fef3c7" stroke="#2a1406" strokeWidth="1.2" />
              ))}
            </g>
          </g>
        </g>
        {/* joelheira */}
        <path d="M-12 56 L0 50 L12 56 L0 74 Z" fill="#f5c451" stroke="#2a1406" strokeWidth="1.6" />
      </g>
    </g>
  );
}

/** Ombreira de placas com espinhos. */
function Pauldron({ id }: { id: string }) {
  return (
    <g>
      <path
        d="M272 236 C254 226 228 222 206 230 L178 212 L196 238 L164 236 L190 254 L166 264 L204 268 C222 280 252 278 268 262 Z"
        fill={`url(#${id}-gold)`}
        stroke="#2a1406"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M262 244 C246 236 226 236 210 244 C224 250 246 254 262 256 Z" fill={`url(#${id}-plate)`} stroke="#2a1406" strokeWidth="1.2" />
      <path d="M236 232 L230 192 L248 228 Z" fill="#f5c451" stroke="#2a1406" strokeWidth="1.6" />
      <path d="M216 232 L204 200 L226 228 Z" fill="#f5c451" stroke="#2a1406" strokeWidth="1.4" />
      <circle cx="238" cy="252" r="3.2" fill="#5eead4" className="cg-anim-dragon-glow" />
    </g>
  );
}

/** Metade esquerda da cabeça (a direita é o espelho): chifre, chifre menor, olho, sobrancelha, bochecha. */
function HeadSide({ id }: { id: string }) {
  return (
    <g>
      {/* chifre grande: abre pra fora e sobe, com a ponta virada pra fora */}
      <path d="M278 126 C238 124 194 114 168 90 C146 68 140 36 146 0 C156 28 164 54 184 72 C208 92 244 100 282 106 Z" fill={`url(#${id}-horn)`} stroke="#2a1406" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M232 104 L240 116 M200 94 L206 108 M176 76 L186 88 M160 54 L172 62 M152 30 L162 34" stroke="#5c3a0c" strokeWidth="2" strokeLinecap="round" />
      <path d="M146 2 C150 24 158 46 172 62" fill="none" stroke="#fff7d6" strokeOpacity="0.6" strokeWidth="1.6" strokeLinecap="round" />
      {/* chifre menor na bochecha */}
      <path d="M272 142 C252 148 234 160 220 182 C240 170 256 164 274 158 Z" fill={`url(#${id}-horn)`} stroke="#2a1406" strokeWidth="1.8" strokeLinejoin="round" />
      {/* franja da bochecha */}
      <path d="M268 148 L244 168 L258 170 L250 186 L272 166 Z" fill="#b7791f" stroke="#2a1406" strokeWidth="1.5" strokeLinejoin="round" />
      {/* sobrancelha de placa */}
      <path d="M300 116 L264 122 L272 138 L300 130 Z" fill={`url(#${id}-plate)`} stroke="#2a1406" strokeWidth="1.6" strokeLinejoin="round" />
      {/* olho verde brilhando */}
      <path d="M270 134 L291 142 L288 148 L273 142 Z" fill="#6ee7b7" filter={`url(#${id}-glow)`} className="cg-anim-dragon-glow" style={{ "--cg-dur": "3s" } as React.CSSProperties} />
      <path d="M279 139 L285 142 L283 145 Z" fill="#ecfdf5" />
      {/* narina e presa */}
      <path d="M294 196 L291 202" stroke="#2a1406" strokeWidth="2" strokeLinecap="round" />
      <path d="M289 204 L292 216 L295 205 Z" fill="#fef9e7" stroke="#2a1406" strokeWidth="1" />
      {/* espinho da coroa */}
      <path d="M290 96 L278 66 L294 88 Z" fill="#f5c451" stroke="#2a1406" strokeWidth="1.5" />
    </g>
  );
}

function Mirror({ children }: { children: React.ReactNode }) {
  return <g transform="translate(600 0) scale(-1 1)">{children}</g>;
}

const TAIL_STAND = "M318 426 C372 476 452 506 512 486 C566 468 594 424 578 384 C568 356 538 348 522 364";
const TAIL_FLY = "M306 430 C314 492 278 540 300 592 C318 632 292 664 258 672";

function Tail({ id, flying }: { id: string; flying: boolean }) {
  const d = flying ? TAIL_FLY : TAIL_STAND;
  // cauda afinando: o mesmo caminho em pedaços cada vez mais curtos e mais grossos
  const pieces: [number, number][] = [
    [100, 6],
    [72, 11],
    [42, 18],
    [18, 26],
  ];
  return (
    <g className="cg-anim-dragon-tail" style={{ transformOrigin: flying ? "306px 430px" : "318px 426px" }}>
      {pieces.map(([len, w]) => (
        <path key={`o${len}`} d={d} pathLength={100} strokeDasharray={`${len} 200`} fill="none" stroke="#2a1406" strokeWidth={w + 4} strokeLinecap="round" />
      ))}
      {pieces.map(([len, w]) => (
        <path key={`g${len}`} d={d} pathLength={100} strokeDasharray={`${len} 200`} fill="none" stroke={`url(#${id}-tail)`} strokeWidth={w} strokeLinecap="round" />
      ))}
      {/* lâmina na ponta */}
      {flying ? (
        <path d="M258 672 L236 666 L252 690 Z" fill="#f5c451" stroke="#2a1406" strokeWidth="1.5" />
      ) : (
        <path d="M522 364 L500 350 L532 344 Z" fill="#f5c451" stroke="#2a1406" strokeWidth="1.5" />
      )}
    </g>
  );
}

// ---------------------------------------------------------------------------
// o dragão
// ---------------------------------------------------------------------------

const LEFT_BOLTS: [number, number][] = [
  [-60, 380],
  [70, 440],
  [10, 560],
];
const RIGHT_BOLTS: [number, number][] = [
  [-50, 420],
  [60, 360],
  [0, 520],
];

export default function ElderDragon({ pose, mouthOpen = false, className = "" }: { pose: DragonPose; mouthOpen?: boolean; className?: string }) {
  const id = useId().replace(/:/g, "");
  const [armL, armR] = ARMS[pose];
  const leg = LEGS[pose];
  const flying = pose === "voo" || pose === "pouso";
  const magic = pose === "magia";
  const roaring = pose === "rugido";
  const jawOpen = roaring || mouthOpen;
  const leftBolts = useBolts(7, LEFT_BOLTS);
  const rightBolts = useBolts(19, RIGHT_BOLTS);

  return (
    <svg viewBox="0 0 600 600" className={className} style={{ overflow: "visible" }} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff4c2" />
          <stop offset="0.3" stopColor="#f6c453" />
          <stop offset="0.68" stopColor="#c98a1c" />
          <stop offset="1" stopColor="#6e430d" />
        </linearGradient>
        <linearGradient id={`${id}-plate`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8a5a1c" />
          <stop offset="0.45" stopColor="#e0a93a" />
          <stop offset="1" stopColor="#5c3a0c" />
        </linearGradient>
        <linearGradient id={`${id}-horn`} x1="0" y1="1" x2="0.3" y2="0">
          <stop offset="0" stopColor="#7a4a10" />
          <stop offset="0.5" stopColor="#d9a441" />
          <stop offset="1" stopColor="#fff1c2" />
        </linearGradient>
        <linearGradient id={`${id}-bone`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#b7791f" />
        </linearGradient>
        <linearGradient id={`${id}-tail`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c98a1c" />
          <stop offset="0.5" stopColor="#f5c451" />
          <stop offset="1" stopColor="#8a5a1c" />
        </linearGradient>
        <radialGradient id={`${id}-membrane`} cx="-150" cy="-138" r="330" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#b07a33" />
          <stop offset="0.28" stopColor="#6e3b1a" />
          <stop offset="0.62" stopColor="#3a1628" />
          <stop offset="1" stopColor="#12061c" />
        </radialGradient>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7a4a10" />
          <stop offset="0.3" stopColor="#f0bb4b" />
          <stop offset="0.55" stopColor="#fff1c2" />
          <stop offset="0.8" stopColor="#d49a2a" />
          <stop offset="1" stopColor="#6e430d" />
        </linearGradient>
        <linearGradient id={`${id}-cloth`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b0764" />
          <stop offset="1" stopColor="#0f0a2e" />
        </linearGradient>
        <radialGradient id={`${id}-orb`}>
          <stop offset="0" stopColor="#f0fdfa" />
          <stop offset="0.35" stopColor="#5eead4" />
          <stop offset="0.7" stopColor="#0d9488" stopOpacity="0.5" />
          <stop offset="1" stopColor="#0d9488" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-mouth`} cx="0.5" cy="0.4">
          <stop offset="0" stopColor="#f0fdfa" />
          <stop offset="0.35" stopColor="#5eead4" />
          <stop offset="0.75" stopColor="#0f766e" />
          <stop offset="1" stopColor="#042f2e" />
        </radialGradient>
        <filter id={`${id}-glow`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* anéis orbitais e esferas de energia (atrás) */}
      <g style={{ opacity: magic ? 1 : 0, transition: "opacity 0.9s" }}>
        {magic &&
          [18, -18].map((a) => (
            <g key={a} transform={`rotate(${a} 300 300)`}>
              <ellipse cx="300" cy="300" rx="262" ry="64" fill="none" stroke="#5eead4" strokeOpacity="0.18" strokeWidth="7" />
              <ellipse
                cx="300"
                cy="300"
                rx="262"
                ry="64"
                fill="none"
                stroke="#99f6e4"
                strokeOpacity="0.75"
                strokeWidth="1.6"
                strokeDasharray="3 9 14 9"
                className="cg-anim-dragon-orbital"
                style={{ "--cg-dur": a > 0 ? "3s" : "4.2s" } as React.CSSProperties}
              />
            </g>
          ))}
      </g>

      {/* asas */}
      <Wing id={id} angle={WINGS[pose]} flap={flying} flapSeconds={pose === "pouso" ? 1.5 : 0.95} />
      <Mirror>
        <Wing id={id} angle={WINGS[pose]} flap={flying} flapSeconds={pose === "pouso" ? 1.5 : 0.95} />
      </Mirror>

      {/* faixas de tecido saindo das costas */}
      {[false, true].map((mirrored) => {
        const streamer = (
          <g className="cg-anim-dragon-cloth" style={{ "--cg-dur": "4s", "--cg-delay": mirrored ? "-2s" : "0s" } as React.CSSProperties}>
            <path d="M252 262 C228 300 214 350 186 392 C170 416 150 430 126 442 C148 420 158 402 166 380 C148 398 136 404 118 408 C150 380 178 330 240 258 Z" fill={`url(#${id}-cloth)`} stroke="#5eead4" strokeOpacity="0.45" strokeWidth="1.2" />
          </g>
        );
        return mirrored ? <Mirror key="r">{streamer}</Mirror> : <g key="l">{streamer}</g>;
      })}

      <Tail id={id} flying={flying} />

      {/* pernas */}
      <Leg id={id} hip={leg.hip} knee={leg.knee} />
      <Mirror>
        <Leg id={id} hip={leg.hip} knee={leg.knee} />
      </Mirror>

      {/* tronco */}
      <g className="cg-anim-dragon-breathe">
        <path
          d="M300 228 C342 228 374 238 382 258 C386 292 362 318 336 332 C330 360 327 384 333 404 L267 404 C273 384 270 360 264 332 C238 318 214 292 218 258 C226 238 258 228 300 228 Z"
          fill={`url(#${id}-body)`}
          stroke="#2a1406"
          strokeWidth="2.4"
        />
        {/* peitoral */}
        {[false, true].map((mirrored) => {
          const plate = (
            <g>
              <path d="M298 242 C272 242 242 248 232 264 C232 294 252 314 280 324 L298 318 Z" fill={`url(#${id}-plate)`} stroke="#2a1406" strokeWidth="1.8" />
              <path d="M290 250 C270 252 250 258 242 268" fill="none" stroke="#fff4c2" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" />
              <path d="M248 304 L262 312 M252 316 L266 322 M258 327 L270 332" stroke="#6e430d" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          );
          return mirrored ? <Mirror key="r">{plate}</Mirror> : <g key="l">{plate}</g>;
        })}
        {/* runas mágicas no peito */}
        <g className="cg-anim-dragon-glow" fill="none" stroke="#5eead4" strokeWidth="1.4" strokeLinecap="round" style={{ "--cg-dur": "2.8s" } as React.CSSProperties}>
          <path d="M266 270 L276 284 L270 298 M334 270 L324 284 L330 298 M300 250 L300 312" />
        </g>
        {/* barriga de placas */}
        {[330, 348, 366, 384].map((y, i) => (
          <path key={y} d={`M${272 + i * 1.5} ${y} Q300 ${y + 6} ${328 - i * 1.5} ${y} L${326 - i * 1.5} ${y + 15} Q300 ${y + 21} ${274 + i * 1.5} ${y + 15} Z`} fill={i % 2 ? "#d9a441" : "#f0c75e"} stroke="#2a1406" strokeWidth="1.4" />
        ))}
        {/* cinto com o emblema de runa */}
        <path d="M258 398 Q300 410 342 398 L344 414 Q300 426 256 414 Z" fill="#8a5a1c" stroke="#2a1406" strokeWidth="1.8" />
        <circle cx="300" cy="411" r="11" fill="#042f2e" stroke="#f5c451" strokeWidth="2" />
        <path d="M300 403 L307 415 L293 415 Z M300 406 L300 412" fill="none" stroke="#5eead4" strokeWidth="1.6" filter={`url(#${id}-glow)`} className="cg-anim-dragon-glow" />
        {/* quadril */}
        <path d="M256 414 L344 414 L352 434 Q300 446 248 434 Z" fill={`url(#${id}-plate)`} stroke="#2a1406" strokeWidth="1.8" />
      </g>

      {/* tanga de tecido */}
      <g className="cg-anim-dragon-cloth" style={{ "--cg-dur": "3.4s" } as React.CSSProperties}>
        <path d="M282 424 L300 428 L318 424 L324 488 L314 478 L308 510 L300 494 L292 512 L286 478 L276 490 Z" fill={`url(#${id}-cloth)`} stroke="#f5c451" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M300 432 L300 490" stroke="#5eead4" strokeOpacity="0.5" strokeWidth="1.2" />
      </g>

      {/* esferas orbitando (na frente) */}
      <g style={{ opacity: magic ? 1 : 0, transition: "opacity 0.9s" }}>
        {magic && (
          <g transform="translate(300 300) rotate(-10)">
            {(
              [
                ["#5eead4", 0],
                ["#c4b5fd", -1.5],
                ["#fde68a", -3],
              ] as const
            ).map(([color, d]) => (
              <g key={color} className="cg-anim-dragon-orbit" style={{ "--cg-delay": `${d}s` } as React.CSSProperties}>
                <circle r="20" fill={color} opacity="0.3" filter={`url(#${id}-glow)`} />
                <circle r="9" fill={color} />
                <circle r="4" fill="#fff" />
              </g>
            ))}
          </g>
        )}
      </g>

      {/* braços e ombreiras */}
      <ArmPart id={id} arm={armL} magic={magic} bolts={leftBolts} delay={0} />
      <Mirror>
        <ArmPart id={id} arm={armR} magic={magic} bolts={rightBolts} delay={0.17} />
      </Mirror>
      <Pauldron id={id} />
      <Mirror>
        <Pauldron id={id} />
      </Mirror>

      {/* pescoço */}
      <path d="M282 190 L318 190 L332 242 L268 242 Z" fill={`url(#${id}-body)`} stroke="#2a1406" strokeWidth="2" />
      <path d="M280 204 Q300 210 320 204 M276 218 Q300 225 324 218 M272 232 Q300 239 328 232" fill="none" stroke="#6e430d" strokeWidth="1.6" />

      {/* cabeça (sobe e abre a boca no rugido) */}
      <g style={{ transform: roaring ? "translateY(-8px) scale(1.04, 0.94)" : "none", transformOrigin: "300px 200px", transition: EASE }}>
        {/* boca por dentro (aparece quando a mandíbula desce) */}
        <path d="M282 180 C286 204 293 228 300 240 C307 228 314 204 318 180 Z" fill={`url(#${id}-mouth)`} style={{ opacity: jawOpen ? 1 : 0, transition: "opacity 0.3s" }} filter={`url(#${id}-glow)`} />
        {/* mandíbula */}
        <g style={{ transform: jawOpen ? "translateY(24px)" : "none", transition: "transform 0.35s cubic-bezier(0.3, 1.4, 0.5, 1)" }}>
          <path d="M284 194 C288 212 295 224 300 229 C305 224 312 212 316 194 C309 203 305 207 300 207 C295 207 291 203 284 194 Z" fill="#b7791f" stroke="#2a1406" strokeWidth="1.6" />
          <path d="M290 203 L293 194 L295 205 Z M310 203 L307 194 L305 205 Z" fill="#fef9e7" stroke="#2a1406" strokeWidth="0.8" />
        </g>
        {/* crânio */}
        <path
          d="M300 86 C318 88 334 102 338 124 L332 150 C328 170 318 192 308 208 L300 214 L292 208 C282 192 272 170 268 150 L262 124 C266 102 282 88 300 86 Z"
          fill={`url(#${id}-body)`}
          stroke="#2a1406"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path d="M300 100 L300 204" stroke="#6e430d" strokeWidth="1.6" />
        <path d="M286 158 Q300 166 314 158 M290 178 Q300 184 310 178" fill="none" stroke="#6e430d" strokeWidth="1.4" />
        <HeadSide id={id} />
        <Mirror>
          <HeadSide id={id} />
        </Mirror>
        {/* crista central da coroa */}
        <path d="M300 90 L291 64 L300 36 L309 64 Z" fill={`url(#${id}-horn)`} stroke="#2a1406" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="300" cy="104" r="3.4" fill="#5eead4" filter={`url(#${id}-glow)`} className="cg-anim-dragon-glow" />
      </g>
    </svg>
  );
}
