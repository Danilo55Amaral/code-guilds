"use client";

import { useEffect, useRef, useState } from "react";
import ElderDragon, { DRAGON_FEET, DRAGON_VIEW, dragonMouth } from "./ElderDragon";
import { playArcaneSurge, playDragonLanding, playDragonRoar, playDragonWhoosh } from "@/engine/sfx";
import { DragonMoment, DragonPose } from "@/engine/elderDragon";

// ============================================================================
// MUNDO 1 — O CENÁRIO E A COREOGRAFIA DO DRAGÃO ANCESTRAL.
//
// Camadas (de trás pra frente): o céu de brasa girando em redemoinho → rochas
// e obeliscos de basalto flutuando → o chão de lava com as chamas → a Pirâmide
// Dourada → o dragão → o fogo e as faíscas (canvas) → as chamas da frente →
// as ondas do rugido.
//
// Um laço de ~32s, calculado a cada quadro (requestAnimationFrame), com o
// dragão de lado (vira pro lado em que voa): ele cruza o céu lá longe, volta
// num rasante baixo cuspindo fogo, pousa no topo da pirâmide e se exibe, as
// runas do corpo acendem e o anel de runas gira em volta dele, ele solta um
// jato de fogo pelo horizonte, ruge (coluna de fogo, a tela treme e as ondas
// atravessam tudo) e levanta voo de novo.
// ============================================================================

const CYCLE = 32;

/** y de uma parada: fração da altura da tela, ou { p } = o topo da pirâmide + p da altura. */
type Y = number | { p: number };
// Caminho do voo: [tempo s, x (fração da largura), y, escala, giro° (na tela), lado (1 = olhando pra direita)]
type Key = [number, number, Y, number, number, 1 | -1];

const FLIGHTS: Key[][] = [
  // lá longe, cruzando o céu
  [
    [0, -0.35, 0.3, 0.36, -3, 1],
    [2.3, 0.5, 0.24, 0.4, 2, 1],
    [4.6, 1.35, 0.3, 0.44, 5, 1],
  ],
  // o rasante, baixo e pertinho, cuspindo fogo
  [
    [4.6, 1.5, 0.66, 0.92, 7, -1],
    [6.2, 0.56, 0.74, 1.08, 0, -1],
    [7.8, -0.6, 0.5, 0.98, 9, -1],
  ],
  // voltando por cima e descendo na pirâmide
  [
    [7.8, -0.55, 0.2, 0.72, 6, 1],
    [9.1, 0.24, 0.16, 0.86, 4, 1],
    [10.0, 0.45, { p: -0.2 }, 1, 0, 1],
    [10.7, 0.46, { p: 0 }, 1, 0, 1],
  ],
  // a partida
  [
    [27.4, 0.46, { p: 0 }, 1, 0, 1],
    [28.2, 0.5, { p: -0.16 }, 1.02, -6, 1],
    [29.2, 0.74, 0.22, 1.16, -12, 1],
    [30.6, 1.45, -0.18, 1.45, -14, 1],
  ],
];
const PERCH_FROM = 10.7;
const PERCH_TO = 27.4;

function momentAt(t: number): DragonMoment {
  if (t < 4.6) return "chegada";
  if (t < 8) return "rasante";
  if (t < 11.6) return "pouso";
  if (t < 14) return "exibir";
  if (t < 18.4) return "runas";
  if (t < 22.4) return "fogo";
  if (t < 27) return "rugido";
  return "partida";
}

function poseAt(t: number): DragonPose {
  if (t < 10) return "voo";
  if (t < 10.9) return "pouso";
  if (t < 18.4) return "pe";
  if (t < 22.4) return "fogo";
  if (t < 26.6) return "rugido";
  if (t < 27.6) return "impulso";
  return "voo";
}

const smooth = (x: number) => x * x * (3 - 2 * x);

function catmull(p0: number, p1: number, p2: number, p3: number, u: number) {
  return 0.5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (-p0 + 3 * p1 - 3 * p2 + p3) * u * u * u);
}

interface Place {
  x: number;
  y: number;
  s: number;
  r: number;
  f: 1 | -1;
  visible: boolean;
}

/** Posição dos pés (px), escala, giro e lado do dragão no tempo t. */
function placeAt(t: number, W: number, H: number, perch: { x: number; y: number }): Place {
  if (t >= PERCH_FROM && t < PERCH_TO) return { x: perch.x, y: perch.y, s: 1, r: 0, f: 1, visible: true };
  const path = FLIGHTS.find((k) => t >= k[0][0] && t < k[k.length - 1][0]);
  if (!path) return { x: -W, y: -H, s: 1, r: 0, f: 1, visible: false };
  const pts = path.map(([kt, x, y, s, r, f]) => ({ t: kt, x: x * W, y: typeof y === "number" ? y * H : perch.y + y.p * H, s, r, f }));
  let i = 0;
  while (i < pts.length - 2 && t > pts[i + 1].t) i++;
  const a = pts[Math.max(0, i - 1)];
  const b = pts[i];
  const c = pts[i + 1];
  const d = pts[Math.min(pts.length - 1, i + 2)];
  const u = Math.min(1, Math.max(0, (t - b.t) / (c.t - b.t)));
  const e = smooth(u);
  // o corpo sobe e desce um pouco a cada batida das asas
  const bob = Math.sin(t * 7) * H * 0.008 * b.s;
  return {
    x: catmull(a.x, b.x, c.x, d.x, u),
    y: catmull(a.y, b.y, c.y, d.y, u) + bob,
    s: b.s + (c.s - b.s) * e,
    r: b.r + (c.r - b.r) * e,
    f: b.f,
    visible: true,
  };
}

// ---------------------------------------------------------------------------
// medidas da cena
// ---------------------------------------------------------------------------

interface Layout {
  W: number;
  H: number;
  D: number; // largura do desenho do dragão (px)
  pyramidW: number;
  pyramidBottom: number;
  perch: { x: number; y: number }; // onde ficam os pés no topo da pirâmide
}

const PYRAMID_VIEW = { w: 1000, h: 420, top: 40 };
// quanto do desenho fica acima dos pés (asas e chifres), em fração da largura
const ABOVE_FEET = 0.6;

function measure(W: number, H: number): Layout {
  // tela em pé (celular): pirâmide maior (o dragão pousa mais alto) e ele mais pra esquerda (o fogo vai pra direita)
  const portrait = H > W * 1.1;
  const place = (D: number) => {
    const pyramidW = portrait ? Math.max(D * 1.15, W * 1.9) : Math.max(D * 1.15, Math.min(W * 0.62, D * 1.45));
    const ph = (pyramidW * PYRAMID_VIEW.h) / PYRAMID_VIEW.w;
    const bottom = -ph * 0.24; // a base da pirâmide passa da borda de baixo
    const perchY = H - (ph * (PYRAMID_VIEW.h - PYRAMID_VIEW.top)) / PYRAMID_VIEW.h - bottom;
    return { W, H, D, pyramidW, pyramidBottom: bottom, perch: { x: W * (portrait ? 0.38 : 0.47), y: perchY } };
  };
  let layout = place(Math.min(W * 0.96, H * 1.05));
  // se as asas passarem da barra do topo, diminui tudo até caber
  for (let i = 0; i < 10 && layout.perch.y - layout.D * ABOVE_FEET < 64; i++) layout = place(layout.D * 0.93);
  return layout;
}

// ---------------------------------------------------------------------------
// o céu de brasa em redemoinho
// ---------------------------------------------------------------------------

const SPIRAL_COLORS = ["#fdba74", "#fb923c", "#fca5a5", "#fcd34d", "#f97316", "#e879f9"];

/**
 * Um braço de espiral por cor, desenhado UMA vez num canvas (com desfoque) — quem gira é o
 * elemento, pela placa de vídeo. Em SVG com filtro, desse tamanho, o navegador sofria pra desenhar.
 */
function SpiralLayer({ count, turns, seed, seconds, inset, blur, reverse = false }: { count: number; turns: number; seed: number; seconds: number; inset: number; blur: number; reverse?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const S = 900;
    canvas.width = canvas.height = S;
    const c = S / 2;
    ctx.clearRect(0, 0, S, S);
    ctx.filter = `blur(${blur}px)`;
    ctx.lineCap = "round";
    for (let k = 0; k < count; k++) {
      const start = (k / count) * Math.PI * 2 + seed;
      ctx.beginPath();
      for (let i = 0; i <= 90; i++) {
        const u = i / 90;
        const angle = start + u * turns * Math.PI * 2;
        const r = 12 + Math.pow(u, 1.55) * (S * 0.47);
        const x = c + Math.cos(angle) * r;
        const y = c + Math.sin(angle) * r;
        if (i) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      }
      ctx.strokeStyle = SPIRAL_COLORS[k % SPIRAL_COLORS.length];
      ctx.globalAlpha = 0.12 + ((k * 3) % 4) * 0.06;
      ctx.lineWidth = 2.5 + ((k * 7) % 5) * 2.6;
      ctx.stroke();
    }
  }, [count, turns, seed, blur]);
  return (
    <canvas
      ref={ref}
      className="cg-anim-dragon-spiral absolute"
      style={{ inset: `${inset}%`, width: `${100 - inset * 2}%`, height: `${100 - inset * 2}%`, "--cg-dur": `${seconds}s`, animationDirection: reverse ? "reverse" : undefined } as React.CSSProperties}
    />
  );
}

function SkyVortex({ cx, cy, size, charged }: { cx: number; cy: number; size: number; charged: boolean }) {
  return (
    <div className="pointer-events-none absolute" style={{ left: cx - size / 2, top: cy - size / 2, width: size, height: size }} aria-hidden="true">
      {/* o olho do redemoinho, em brasa */}
      <div
        className="absolute inset-0 rounded-full transition-opacity duration-1000"
        style={{
          background: "radial-gradient(circle, rgba(255,237,213,0.85) 0%, rgba(251,146,60,0.5) 5%, rgba(185,28,28,0.42) 14%, rgba(88,18,12,0.35) 28%, rgba(30,8,8,0.15) 45%, transparent 62%)",
          opacity: charged ? 1 : 0.75,
        }}
      />
      {/* dois redemoinhos: o de dentro gira mais rápido (parece um sorvedouro) */}
      <SpiralLayer count={16} turns={1.15} seed={0} seconds={150} inset={0} blur={3} />
      <SpiralLayer count={12} turns={1.4} seed={0.4} seconds={70} inset={19} blur={2} />
      {/* quando a magia acontece, um terceiro redemoinho aparece girando rápido */}
      <div className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: charged ? 1 : 0 }}>
        <SpiralLayer count={10} turns={1.7} seed={1.1} seconds={22} inset={30} blur={2} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// cenário: rochas de basalto flutuando, obeliscos, chão de lava e chamas
// ---------------------------------------------------------------------------

function FloatingRock({ x, y, w, delay, ember }: { x: string; y: string; w: string; delay: number; ember: string }) {
  return (
    <div className="cg-anim-dragon-hover absolute" style={{ left: x, top: y, width: w, "--cg-delay": `${delay}s`, "--cg-dur": `${6 + (delay % 3)}s` } as React.CSSProperties}>
      <svg viewBox="0 0 200 160" className="h-auto w-full" style={{ filter: `drop-shadow(0 0 14px ${ember}66)` }}>
        <path d="M10 60 L60 40 L140 44 L192 62 L170 80 L130 118 L100 158 L72 116 L30 84 Z" fill="#1c1210" stroke="#4a2a1c" strokeWidth="2" />
        <path d="M10 60 L60 40 L140 44 L192 62 L150 70 L60 70 Z" fill="#2e1d16" />
        {/* rachaduras de lava */}
        <path d="M60 72 L80 96 L74 118 M120 74 L112 100 L126 122 M96 80 L100 140" fill="none" stroke={ember} strokeWidth="2.5" strokeLinecap="round" className="cg-anim-dragon-glow" style={{ "--cg-dur": "2.2s" } as React.CSSProperties} />
        <path d="M82 42 L94 6 L104 42 Z M112 44 L124 18 L130 46 Z" fill="#3a2419" stroke="#4a2a1c" strokeWidth="1.5" />
        <path d="M100 150 L100 158" stroke={ember} strokeWidth="2" />
      </svg>
    </div>
  );
}

function Spires({ side }: { side: "left" | "right" }) {
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMax meet" className="pointer-events-none absolute bottom-0 h-[62%] w-auto" style={{ [side]: "-2%", transform: side === "right" ? "scaleX(-1)" : undefined }} aria-hidden="true">
      <defs>
        <linearGradient id={`spire-${side}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2e1712" />
          <stop offset="1" stopColor="#0c0504" />
        </linearGradient>
      </defs>
      <g fill={`url(#spire-${side})`} stroke="#f97316" strokeOpacity="0.28" strokeWidth="1.5">
        <path d="M40 500 L58 120 L70 60 L82 120 L100 500 Z" />
        <path d="M110 500 L124 220 L136 170 L148 220 L160 500 Z" />
        <path d="M0 500 L10 300 L22 260 L34 300 L44 500 Z" />
        <path d="M170 500 L180 340 L190 310 L200 340 L210 500 Z" />
      </g>
      {[
        [70, 90],
        [136, 196],
        [22, 280],
        [190, 326],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#fdba74" className="cg-anim-dragon-glow" style={{ "--cg-delay": `${-i * 0.7}s` } as React.CSSProperties} />
      ))}
    </svg>
  );
}

/** Uma labareda (três camadas: vermelho, laranja e o miolo amarelo), tremulando. */
function Flame({ x, h, w, delay }: { x: number; h: number; w: number; delay: number }) {
  return (
    <g className="cg-anim-aura-flicker" style={{ "--cg-dur": `${0.55 + (delay % 0.4)}s`, "--cg-delay": `${-delay}s` } as React.CSSProperties}>
      <path d={`M${x - w} 0 C${x - w * 1.1} ${-h * 0.4} ${x - w * 0.2} ${-h * 0.55} ${x} ${-h} C${x + w * 0.3} ${-h * 0.55} ${x + w * 1.1} ${-h * 0.4} ${x + w} 0 Z`} fill="#dc2626" opacity="0.85" />
      <path d={`M${x - w * 0.7} 0 C${x - w * 0.8} ${-h * 0.32} ${x - w * 0.1} ${-h * 0.45} ${x + w * 0.05} ${-h * 0.78} C${x + w * 0.3} ${-h * 0.42} ${x + w * 0.8} ${-h * 0.3} ${x + w * 0.7} 0 Z`} fill="#f97316" />
      <path d={`M${x - w * 0.38} 0 C${x - w * 0.42} ${-h * 0.2} ${x} ${-h * 0.3} ${x + w * 0.08} ${-h * 0.5} C${x + w * 0.2} ${-h * 0.28} ${x + w * 0.45} ${-h * 0.18} ${x + w * 0.38} 0 Z`} fill="#fde047" />
    </g>
  );
}

// labaredas do chão: [x (de 0 a 1000), altura, largura]
const GROUND_FLAMES: [number, number, number][] = [
  [30, 90, 26],
  [90, 130, 34],
  [160, 80, 22],
  [230, 110, 30],
  [300, 70, 20],
  [700, 76, 22],
  [770, 118, 30],
  [840, 84, 24],
  [905, 140, 36],
  [970, 96, 26],
];

/** O chão de basalto com os rios de lava e as chamas subindo (fica atrás da pirâmide). */
function LavaField() {
  return (
    <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-[24%] w-full" aria-hidden="true">
      <defs>
        <linearGradient id="lava-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a110c" />
          <stop offset="1" stopColor="#0c0403" />
        </linearGradient>
        <linearGradient id="lava-river" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fde047" />
          <stop offset="0.5" stopColor="#f97316" />
          <stop offset="1" stopColor="#dc2626" />
        </linearGradient>
      </defs>
      {/* o brilho da lava no ar */}
      <rect x="0" y="40" width="1000" height="160" fill="#f97316" opacity="0.12" />
      <path d="M0 70 C120 56 220 80 340 66 C460 54 540 74 660 64 C780 54 880 76 1000 62 L1000 200 L0 200 Z" fill="url(#lava-ground)" />
      {/* rios de lava pulsando */}
      <g className="cg-anim-dragon-glow" style={{ "--cg-dur": "3s" } as React.CSSProperties} fill="none" strokeLinecap="round">
        <path d="M0 120 C80 110 140 136 220 122 C300 108 330 150 420 142" stroke="#f97316" strokeOpacity="0.45" strokeWidth="18" />
        <path d="M0 120 C80 110 140 136 220 122 C300 108 330 150 420 142" stroke="url(#lava-river)" strokeWidth="6" />
        <path d="M1000 112 C930 124 880 104 800 118 C720 132 690 100 610 126" stroke="#f97316" strokeOpacity="0.45" strokeWidth="18" />
        <path d="M1000 112 C930 124 880 104 800 118 C720 132 690 100 610 126" stroke="url(#lava-river)" strokeWidth="6" />
        <path d="M60 170 C160 160 240 184 360 174 M640 178 C760 166 860 188 980 172" stroke="#fb923c" strokeWidth="4" />
        <path d="M150 94 L190 104 L180 120 M820 90 L860 100 L850 116" stroke="#fdba74" strokeWidth="2.5" />
      </g>
      <g transform="translate(0 96)">
        {GROUND_FLAMES.map(([x, h, w], i) => (
          <Flame key={x} x={x} h={h * 0.6} w={w * 0.7} delay={i * 0.37} />
        ))}
      </g>
    </svg>
  );
}

/** As chamas da frente, nos cantos de baixo (moldam a cena como na arte do Vaelzhar). */
function ForegroundFlames({ side }: { side: "left" | "right" }) {
  return (
    <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMax meet" className="pointer-events-none absolute bottom-0 hidden h-[24%] w-auto opacity-90 sm:block" style={{ [side]: "-3%", transform: side === "right" ? "scaleX(-1)" : undefined }} aria-hidden="true">
      <g transform="translate(0 200)">
        {[
          [30, 170, 40],
          [90, 120, 30],
          [150, 150, 36],
          [210, 90, 24],
        ].map(([x, h, w], i) => (
          <Flame key={x} x={x} h={h} w={w} delay={i * 0.41 + (side === "right" ? 0.2 : 0)} />
        ))}
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// a Pirâmide Dourada
// ---------------------------------------------------------------------------

const RUNES = ["M-6 -6 L6 6 M6 -6 L-6 6", "M0 -7 L0 7 M-6 -2 L6 -2", "M-6 6 L0 -7 L6 6 Z", "M0 0 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 M0 -6 L0 6", "M-6 -6 L6 -6 L-6 6 L6 6"];

function GoldenPyramid({ layout, charged, perched }: { layout: Layout; charged: boolean; perched: boolean }) {
  const tiers = 6;
  const h = (PYRAMID_VIEW.h - PYRAMID_VIEW.top) / tiers;
  return (
    <svg
      viewBox={`0 0 ${PYRAMID_VIEW.w} ${PYRAMID_VIEW.h}`}
      className="pointer-events-none absolute"
      style={{ width: layout.pyramidW, bottom: layout.pyramidBottom, left: layout.perch.x, transform: "translateX(-50%)", overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pyr-face" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="0.32" stopColor="#f2b52e" />
          <stop offset="0.6" stopColor="#b7791f" />
          <stop offset="1" stopColor="#4a2e08" />
        </linearGradient>
        <linearGradient id="pyr-stairs" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e3a431" />
          <stop offset="1" stopColor="#7a4a10" />
        </linearGradient>
        <radialGradient id="pyr-pad">
          <stop offset="0" stopColor="#fef3c7" stopOpacity="0.95" />
          <stop offset="0.4" stopColor="#f97316" stopOpacity="0.6" />
          <stop offset="1" stopColor="#b91c1c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pyr-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#140504" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      {/* feixe de luz subindo do topo quando a magia acontece */}
      <path d="M470 40 L530 40 L600 -900 L400 -900 Z" fill="#fdba74" style={{ opacity: charged ? 0.14 : 0, transition: "opacity 1.2s" }} />
      {Array.from({ length: tiers }, (_, i) => {
        const y = PYRAMID_VIEW.top + i * h;
        const w = 64 + i * 72;
        return (
          <g key={i}>
            <path d={`M${500 - w} ${y} L${500 + w} ${y} L${500 + w + 36} ${y + h} L${500 - w - 36} ${y + h} Z`} fill="url(#pyr-face)" stroke="#3b2208" strokeWidth="2" />
            <path d={`M${500 - w} ${y} L${500 + w} ${y} L${500 + w + 6} ${y + 6} L${500 - w - 6} ${y + 6} Z`} fill="#fff3c4" opacity="0.7" />
            {/* runas brilhando, acendendo em sequência */}
            {[-1, 1].map((side) =>
              [0.55, 0.8].map((f, j) => (
                <g
                  key={`${side}-${j}`}
                  transform={`translate(${500 + side * (w + 18) * f} ${y + h * 0.55}) scale(${0.8 + i * 0.12})`}
                  className="cg-anim-dragon-rune"
                  style={{ "--cg-delay": `${-(tiers - i) * 0.35 - j * 0.2}s`, "--cg-dur": charged ? "1.4s" : "4s" } as React.CSSProperties}
                >
                  {/* brilho = o mesmo traço largo e transparente por baixo (filtro aqui pesava demais) */}
                  <path d={RUNES[(i + j + (side > 0 ? 2 : 0)) % RUNES.length]} fill="none" stroke="#f97316" strokeOpacity="0.4" strokeWidth="6" strokeLinecap="round" />
                  <path d={RUNES[(i + j + (side > 0 ? 2 : 0)) % RUNES.length]} fill="none" stroke="#fef3c7" strokeWidth="2" strokeLinecap="round" />
                </g>
              )),
            )}
          </g>
        );
      })}
      {/* escadaria no meio */}
      <path d="M476 40 L524 40 L566 420 L434 420 Z" fill="url(#pyr-stairs)" stroke="#3b2208" strokeWidth="2" />
      {Array.from({ length: 30 }, (_, i) => {
        const y = 48 + i * 12.6;
        const f = (y - 40) / 380;
        return <path key={i} d={`M${476 - f * 42} ${y} L${524 + f * 42} ${y}`} stroke="#5c3a0c" strokeOpacity="0.55" strokeWidth="1.6" />;
      })}
      <rect x="0" y="0" width="1000" height="420" fill="url(#pyr-shade)" />
      {/* a lava batendo na pirâmide por baixo */}
      <rect x="0" y="300" width="1000" height="120" fill="#f97316" opacity="0.12" />
      {/* braseiros com fogo nos cantos do topo */}
      {[436, 564].map((x) => (
        <g key={x}>
          <path d={`M${x - 12} 40 L${x + 12} 40 L${x + 8} 30 L${x - 8} 30 Z`} fill="#8a5a1c" stroke="#3b2208" strokeWidth="1.5" />
          <g className="cg-anim-aura-flicker" style={{ "--cg-dur": "0.7s" } as React.CSSProperties}>
            <path d={`M${x - 8} 30 C${x - 10} 18 ${x - 2} 14 ${x} 0 C${x + 3} 12 ${x + 11} 16 ${x + 8} 30 Z`} fill="#f97316" opacity="0.9" />
            <path d={`M${x - 4} 30 C${x - 5} 22 ${x} 18 ${x + 1} 10 C${x + 3} 18 ${x + 6} 22 ${x + 4} 30 Z`} fill="#fde047" />
          </g>
        </g>
      ))}
      {/* círculo de pouso */}
      <ellipse cx="500" cy="40" rx="96" ry="15" fill="url(#pyr-pad)" style={{ opacity: perched ? 1 : 0.45, transition: "opacity 0.8s" }} className="cg-anim-dragon-glow" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// relâmpagos no céu
// ---------------------------------------------------------------------------

interface SkyBolt {
  id: number;
  d: string;
  flash: boolean;
}

function skyBoltPath(W: number, H: number): string {
  let x = W * (0.08 + Math.random() * 0.84);
  let y = -10;
  const endY = H * (0.3 + Math.random() * 0.3);
  let d = `M${x.toFixed(0)} ${y}`;
  const branches: string[] = [];
  while (y < endY) {
    x += (Math.random() - 0.5) * 70;
    y += 18 + Math.random() * 34;
    d += ` L${x.toFixed(0)} ${y.toFixed(0)}`;
    if (Math.random() < 0.18) {
      let bx = x;
      let by = y;
      let b = `M${bx.toFixed(0)} ${by.toFixed(0)}`;
      for (let i = 0; i < 4; i++) {
        bx += (Math.random() - 0.3) * 60 * (Math.random() < 0.5 ? -1 : 1);
        by += 14 + Math.random() * 24;
        b += ` L${bx.toFixed(0)} ${by.toFixed(0)}`;
      }
      branches.push(b);
    }
  }
  return [d, ...branches].join(" ");
}

function SkyLightning({ W, H, storm }: { W: number; H: number; storm: boolean }) {
  const [bolts, setBolts] = useState<SkyBolt[]>([]);
  const stormRef = useRef(storm);
  stormRef.current = storm;

  useEffect(() => {
    if (!W || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    let n = 0;
    const strike = () => {
      const id = ++n;
      setBolts((list) => [...list.slice(-3), { id, d: skyBoltPath(W, H), flash: Math.random() < 0.45 }]);
      window.setTimeout(() => setBolts((list) => list.filter((b) => b.id !== id)), 700);
      timer = window.setTimeout(strike, stormRef.current ? 450 + Math.random() * 800 : 2400 + Math.random() * 3400);
    };
    timer = window.setTimeout(strike, 1500);
    return () => window.clearTimeout(timer);
  }, [W, H]);

  return (
    <>
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        {bolts.map((b) => (
          <g key={b.id} className="cg-anim-dragon-bolt-sky">
            <path d={b.d} fill="none" stroke="#f97316" strokeOpacity="0.45" strokeWidth="9" strokeLinejoin="round" style={{ filter: "blur(4px)" }} />
            <path d={b.d} fill="none" stroke="#fed7aa" strokeWidth="2.4" strokeLinejoin="round" />
            <path d={b.d} fill="none" stroke="#fff" strokeWidth="1" strokeLinejoin="round" />
          </g>
        ))}
      </svg>
      {bolts
        .filter((b) => b.flash)
        .slice(-1)
        .map((b) => (
          <div key={`f${b.id}`} className="cg-anim-dragon-flash pointer-events-none absolute inset-0" style={{ background: "radial-gradient(circle at 50% 20%, rgba(254,215,170,0.45), rgba(234,88,12,0.12) 60%, transparent)" }} />
        ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// fogo e faíscas (canvas)
// ---------------------------------------------------------------------------

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  grow: number;
  kind: "fogo" | "brasa" | "faisca";
}

// cores do fogo: do miolo branco-amarelo pro laranja, vermelho e o vermelho-escuro da fumaça
const FIRE_STOPS = ["#fef08a", "#fde047", "#fb923c", "#f97316", "#ea580c", "#dc2626", "#991b1b", "#450a0a"];

function makeSprite(color: string): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, color);
  grad.addColorStop(0.4, `${color}aa`);
  grad.addColorStop(1, `${color}00`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return c;
}

// ---------------------------------------------------------------------------
// o jato de fogo (como na arte do Vaelzhar): um feixe grosso saindo da boca
// ---------------------------------------------------------------------------

// quando ele cospe fogo: [início s, fim s, de qual pose sai a boca, alcance (× largura do dragão)]
const BEAMS: { from: number; to: number; mouth: "voo" | "fogo" | "rugido"; reach: number }[] = [
  { from: 5.2, to: 7.0, mouth: "voo", reach: 1.05 },
  { from: 18.9, to: 21.9, mouth: "fogo", reach: 1.6 },
  { from: 22.7, to: 25.4, mouth: "rugido", reach: 1.1 },
];

/** Meia largura do jato a uma fração `u` do caminho (fino na boca, grosso na ponta). */
function beamHalf(u: number, w0: number, w1: number) {
  return w0 + (w1 - w0) * Math.pow(u, 0.45);
}

/**
 * Desenha o jato: quatro camadas uma dentro da outra (vermelho por fora, laranja, amarelo e o miolo
 * quase branco), com as bordas tremulando em ondas que correm pra frente, a ponta arredondada e
 * redemoinhos claros rolando por dentro. As labaredas que se soltam dele são partículas, à parte.
 */
function drawFireBeam(ctx: CanvasRenderingContext2D, x: number, y: number, dir: number, len: number, w0: number, w1: number, time: number, alpha: number) {
  if (len < 4 || alpha <= 0) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(dir);
  ctx.globalAlpha = alpha;
  const layers: { s: number; reach: number; phase: number; stops: [string, string, string, string]; glow?: boolean }[] = [
    { s: 1, reach: 1, phase: 0, stops: ["#ea580c", "#dc2626", "#b91c1c", "rgba(127,29,29,0.75)"], glow: true },
    { s: 0.74, reach: 0.97, phase: 1.7, stops: ["#fb923c", "#f97316", "#ea580c", "rgba(220,38,38,0.6)"] },
    { s: 0.48, reach: 0.9, phase: 3.1, stops: ["#fef08a", "#fde047", "#fbbf24", "rgba(249,115,22,0.4)"] },
    { s: 0.2, reach: 0.78, phase: 4.4, stops: ["#ffffff", "#fffbeb", "#fef3c7", "rgba(254,240,138,0)"] },
  ];
  const steps = 36;
  for (const layer of layers) {
    const L = len * layer.reach;
    const wob = (px: number, side: number) =>
      1 + 0.17 * Math.sin(px * 0.034 - time * 13 + layer.phase + side * 1.9) + 0.09 * Math.sin(px * 0.09 + time * 8 + side * 2.6) + 0.05 * Math.sin(px * 0.22 - time * 23 + side);
    const half = (i: number, side: number) => beamHalf(i / steps, w0, w1) * layer.s * wob((i / steps) * L, side);
    ctx.beginPath();
    ctx.moveTo(0, -half(0, 0));
    for (let i = 1; i <= steps; i++) ctx.lineTo((i / steps) * L, -half(i, 0));
    // ponta arredondada, empurrando pra frente
    ctx.bezierCurveTo(L + half(steps, 0) * 0.9, -half(steps, 0) * 0.6, L + half(steps, 1) * 0.9, half(steps, 1) * 0.6, L, half(steps, 1));
    for (let i = steps; i >= 0; i--) ctx.lineTo((i / steps) * L, half(i, 1));
    ctx.closePath();
    const g = ctx.createLinearGradient(0, 0, L, 0);
    g.addColorStop(0, layer.stops[0]);
    g.addColorStop(0.3, layer.stops[1]);
    g.addColorStop(0.82, layer.stops[2]);
    g.addColorStop(1, layer.stops[3]);
    ctx.fillStyle = g;
    ctx.shadowColor = layer.glow ? "rgba(249,115,22,0.95)" : "transparent";
    ctx.shadowBlur = layer.glow ? w1 * 1.1 : 0;
    ctx.fill();
  }
  // redemoinhos claros rolando por dentro do jato
  ctx.shadowBlur = 0;
  ctx.lineCap = "round";
  for (let k = 0; k < 4; k++) {
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      const px = u * len * 0.92;
      const py = Math.sin(px * (0.03 + k * 0.006) - time * (16 + k * 3) + k * 1.6) * beamHalf(u, w0, w1) * 0.55;
      if (i) ctx.lineTo(px, py);
      else ctx.moveTo(px, py);
    }
    ctx.strokeStyle = k % 2 ? "rgba(255,247,204,0.55)" : "rgba(254,215,170,0.45)";
    ctx.lineWidth = w1 * (0.1 + k * 0.03);
    ctx.stroke();
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------
// a cena
// ---------------------------------------------------------------------------

const ASPECT = DRAGON_VIEW.h / DRAGON_VIEW.w;
const FEET_X = (DRAGON_FEET.x / DRAGON_VIEW.w) * 100;
const FEET_Y = (DRAGON_FEET.y / DRAGON_VIEW.h) * 100;

export default function DragonWorld({ soundOn, onMoment, startAt = 0 }: { soundOn: boolean; onMoment: (m: DragonMoment) => void; startAt?: number }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const dragonRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [pose, setPose] = useState<DragonPose>("voo");
  const [moment, setMoment] = useState<DragonMoment>("chegada");
  const [breath, setBreath] = useState(false);
  const [roarWave, setRoarWave] = useState(0);
  const [reduced, setReduced] = useState(false);
  const soundRef = useRef(soundOn);
  soundRef.current = soundOn;
  const momentCb = useRef(onMoment);
  momentCb.current = onMoment;

  // medidas
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const update = () => setLayout(measure(stage.clientWidth, stage.clientHeight));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  // o laço da coreografia + as partículas
  useEffect(() => {
    if (!layout) return;
    const dragon = dragonRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!dragon || !canvas || !ctx) return;
    const { W, H, D, perch } = layout;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const place = (p: Place) => {
      dragon.style.transform = `translate(${p.x}px, ${p.y}px) translate(-${FEET_X}%, -${FEET_Y}%) rotate(${p.r}deg) scale(${p.s * p.f}, ${p.s})`;
      dragon.style.opacity = p.visible ? "1" : "0";
    };

    if (reduced) {
      place({ x: perch.x, y: perch.y, s: 1, r: 0, f: 1, visible: true });
      setPose("pe");
      setMoment("exibir");
      momentCb.current("exibir");
      return;
    }

    const sprites = FIRE_STOPS.map(makeSprite);
    const gold = makeSprite("#fcd34d");
    const ember = makeSprite("#fb923c");
    const particles: Particle[] = [];
    const k = D / 560; // tamanho das partículas acompanha o dragão
    const mouths: Record<"voo" | "fogo" | "rugido", ReturnType<typeof dragonMouth>> = { voo: dragonMouth("voo"), fogo: dragonMouth("fogo"), rugido: dragonMouth("rugido") };

    let lastPose: DragonPose | null = null;
    let lastMoment: DragonMoment | null = null;
    let lastBreath = false;
    let fired = new Set<string>();
    let cycleIndex = -1;
    const start = performance.now() - startAt * 1000;
    let prev = performance.now();
    let frame = 0;

    const fire = (key: string, t: number, at: number, action: () => void) => {
      if (t >= at && !fired.has(key)) {
        fired.add(key);
        action();
      }
    };

    const loop = (now: number) => {
      const dt = Math.max(0, Math.min(0.05, (now - prev) / 1000));
      prev = now;
      const elapsed = (now - start) / 1000;
      const cycle = Math.floor(elapsed / CYCLE);
      const t = elapsed - cycle * CYCLE;
      if (cycle !== cycleIndex) {
        cycleIndex = cycle;
        fired = new Set();
      }

      // dragão
      const p = placeAt(t, W, H, perch);
      place(p);
      const nextPose = poseAt(t);
      if (nextPose !== lastPose) {
        lastPose = nextPose;
        setPose(nextPose);
      }
      const nextMoment = momentAt(t);
      if (nextMoment !== lastMoment) {
        lastMoment = nextMoment;
        setMoment(nextMoment);
        momentCb.current(nextMoment);
      }
      const beam = BEAMS.find((b) => t >= b.from && t < b.to);
      const breathing = beam?.mouth === "voo";
      if (breathing !== lastBreath) {
        lastBreath = breathing;
        setBreath(breathing);
      }

      // sons e ondas nos momentos certos
      fire("rasante", t, 5.0, () => soundRef.current && playDragonWhoosh());
      fire("pouso", t, 10.6, () => soundRef.current && playDragonLanding());
      fire("runas", t, 14.1, () => soundRef.current && playArcaneSurge());
      fire("fogo", t, 18.9, () => soundRef.current && playDragonWhoosh());
      fire("rugido", t, 22.7, () => {
        setRoarWave((n) => n + 1);
        if (soundRef.current) playDragonRoar();
      });

      // ponto do desenho → tela (considerando escala, lado e giro)
      const toScreen = (lx: number, ly: number) => {
        const ox = ((lx - DRAGON_FEET.x) / DRAGON_VIEW.w) * D * p.s * p.f;
        const oy = ((ly - DRAGON_FEET.y) / DRAGON_VIEW.w) * D * p.s;
        const a = (p.r * Math.PI) / 180;
        return { x: p.x + ox * Math.cos(a) - oy * Math.sin(a), y: p.y + ox * Math.sin(a) + oy * Math.cos(a) };
      };
      // emissores
      const rand = Math.random;
      // o jato de fogo: cresce da boca em ~0,35s, fica e se apaga no fim
      let beamNow: { x: number; y: number; dir: number; len: number; w0: number; w1: number; alpha: number } | null = null;
      if (beam) {
        const m = mouths[beam.mouth];
        const at = toScreen(m.x, m.y);
        const dir = ((p.f === 1 ? m.angle : 180 - m.angle) + p.r) * (Math.PI / 180);
        const len = beam.reach * D * p.s * smooth(Math.min(1, (t - beam.from) / 0.35));
        const w0 = 0.024 * D * p.s;
        const w1 = 0.092 * D * p.s;
        beamNow = { x: at.x, y: at.y, dir, len, w0, w1, alpha: Math.min(1, (beam.to - t) / 0.3) };
        const cos = Math.cos(dir);
        const sin = Math.sin(dir);
        // labaredas se soltando das bordas do jato
        for (let i = 0; i < 7; i++) {
          const u = 0.2 + rand() * 0.8;
          const half = beamHalf(u, w0, w1);
          const off = (rand() - 0.5) * 1.6 * half;
          const out = off < 0 ? -1 : 1;
          const v = (90 + rand() * 220) * k * p.s;
          particles.push({
            x: at.x + cos * u * len - sin * off,
            y: at.y + sin * u * len + cos * off,
            vx: cos * v * 1.3 - sin * out * v * 0.55,
            vy: sin * v * 1.3 + cos * out * v * 0.55,
            life: 0,
            max: 0.3 + rand() * 0.35,
            size: half * (0.3 + rand() * 0.35),
            grow: 2.4,
            kind: "fogo",
          });
        }
        // a ponta do jato fervendo em bolas de fogo
        for (let i = 0; i < 3; i++) {
          const v = (160 + rand() * 260) * k * p.s;
          const a = dir + (rand() - 0.5) * 0.9;
          particles.push({ x: at.x + cos * len, y: at.y + sin * len, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: 0.4 + rand() * 0.4, size: w1 * (0.45 + rand() * 0.4), grow: 3, kind: "fogo" });
        }
        // faíscas voando
        if (rand() < 0.8) {
          const u = rand();
          const v = (300 + rand() * 400) * k;
          const a = dir + (rand() - 0.5) * 1.2;
          particles.push({ x: at.x + cos * u * len, y: at.y + sin * u * len, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: 0.5 + rand() * 0.5, size: (1.5 + rand() * 2) * k, grow: 0, kind: "faisca" });
        }
      }
      if (t >= 22.7 && t < 25.4) {
        // rugido: o chão pega fogo em volta das garras
        for (let i = 0; i < 3; i++) {
          particles.push({ x: perch.x + (rand() - 0.5) * D * 0.45, y: perch.y + 4, vx: (rand() - 0.5) * 30, vy: -(120 + rand() * 160) * k, life: 0, max: 0.6 + rand() * 0.4, size: (7 + rand() * 8) * k, grow: 1.6, kind: "fogo" });
        }
      }
      if (t >= 14 && t < 22.4 && rand() < 0.7) {
        // faíscas douradas subindo em volta dele enquanto as runas brilham
        particles.push({ x: perch.x + (rand() - 0.4) * D * 0.6, y: perch.y - rand() * D * 0.4, vx: (rand() - 0.5) * 40, vy: -(70 + rand() * 120), life: 0, max: 1.2 + rand(), size: (2 + rand() * 2.5) * k, grow: 0, kind: "faisca" });
      }
      // brasas subindo do chão de lava, sempre
      if (rand() < 0.55) particles.push({ x: rand() * W, y: H + 10, vx: (rand() - 0.5) * 24, vy: -(40 + rand() * 80), life: 0, max: 5 + rand() * 5, size: 1.4 + rand() * 2.6, grow: 0, kind: "brasa" });

      // desenha: primeiro o jato, depois as partículas por cima (somando a luz)
      ctx.clearRect(0, 0, W, H);
      if (beamNow) drawFireBeam(ctx, beamNow.x, beamNow.y, beamNow.dir, beamNow.len, beamNow.w0, beamNow.w1, now / 1000, beamNow.alpha);
      ctx.globalCompositeOperation = "lighter";
      for (let i = particles.length - 1; i >= 0; i--) {
        const q = particles[i];
        q.life += dt;
        if (q.life >= q.max) {
          particles.splice(i, 1);
          continue;
        }
        q.x += q.vx * dt;
        q.y += q.vy * dt;
        const f = q.life / q.max;
        let sprite: HTMLCanvasElement;
        let alpha: number;
        if (q.kind === "fogo") {
          q.vx *= 0.985;
          q.vy = q.vy * 0.985 - 60 * dt;
          q.size += q.grow * dt * 10 * k;
          sprite = sprites[Math.min(sprites.length - 1, Math.floor(f * sprites.length))];
          alpha = Math.min(1, f * 6) * (1 - f) * 0.55;
        } else if (q.kind === "faisca") {
          sprite = f < 0.5 ? sprites[1] : gold;
          alpha = (1 - f) * 0.9;
        } else {
          q.x += Math.sin((now / 1000 + i) * 1.3) * 0.25;
          sprite = i % 3 ? ember : gold;
          alpha = Math.sin(f * Math.PI) * 0.8;
        }
        const size = q.size * 2.4;
        ctx.globalAlpha = alpha;
        ctx.drawImage(sprite, q.x - size / 2, q.y - size / 2, size, size);
      }
      if (particles.length > 1600) particles.splice(0, particles.length - 1600);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      frame = window.requestAnimationFrame(loop);
    };
    frame = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(frame);
  }, [layout, reduced, startAt]);

  const charged = moment === "runas" || moment === "fogo" || moment === "rugido";
  const perched = pose !== "voo";
  const vortex = layout ? { x: layout.perch.x, y: layout.H * 0.34 } : null;

  return (
    <div ref={stageRef} className={`absolute inset-0 overflow-hidden ${moment === "rugido" && !reduced ? "cg-anim-dragon-shake" : ""}`}>
      {layout && vortex && (
        <>
          <SkyVortex cx={vortex.x} cy={vortex.y} size={Math.max(layout.W, layout.H) * 1.9} charged={charged} />
          <SkyLightning W={layout.W} H={layout.H} storm={charged} />

          {/* rochas de basalto flutuando */}
          <FloatingRock x="4%" y="18%" w="min(16vw, 150px)" delay={0} ember="#fb923c" />
          <FloatingRock x="80%" y="12%" w="min(13vw, 120px)" delay={-2} ember="#fbbf24" />
          <FloatingRock x="86%" y="46%" w="min(10vw, 90px)" delay={-4} ember="#ef4444" />
          <FloatingRock x="12%" y="52%" w="min(8vw, 76px)" delay={-1} ember="#fdba74" />
          <Spires side="left" />
          <Spires side="right" />

          {/* fumaça e o calor da lava subindo */}
          <div
            className="cg-anim-dragon-mist pointer-events-none absolute -left-[10%] bottom-0 h-[34%] w-[120%]"
            style={{ background: "radial-gradient(ellipse at 30% 100%, rgba(249,115,22,0.28), transparent 60%), radial-gradient(ellipse at 75% 100%, rgba(220,38,38,0.26), transparent 55%)" }}
          />
          <LavaField />

          <GoldenPyramid layout={layout} charged={charged} perched={perched} />
        </>
      )}

      {/* o dragão */}
      <div
        ref={dragonRef}
        className="pointer-events-none absolute left-0 top-0 will-change-transform"
        style={{ width: layout?.D ?? 0, height: (layout?.D ?? 0) * ASPECT, transformOrigin: `${FEET_X}% ${FEET_Y}%`, opacity: 0 }}
      >
        <ElderDragon pose={pose} mouthOpen={breath} runes={charged ? 1 : 0.25} aura={charged} className="h-full w-full" />
      </div>

      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />

      <ForegroundFlames side="left" />
      <ForegroundFlames side="right" />

      {/* ondas do rugido atravessando tudo */}
      {roarWave > 0 && moment === "rugido" && layout && (
        <div key={roarWave} className="pointer-events-none absolute inset-0">
          {[0, 0.35, 0.7, 1.05].map((d) => (
            <div
              key={d}
              className="cg-anim-dragon-shockwave absolute rounded-full"
              style={{
                left: layout.perch.x + layout.D * 0.2,
                top: layout.perch.y - layout.D * 0.5,
                width: "260vmax",
                height: "260vmax",
                border: "6px solid rgba(253,186,116,0.55)",
                boxShadow: "0 0 40px rgba(249,115,22,0.5), inset 0 0 40px rgba(220,38,38,0.4)",
                "--cg-delay": `${d}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}
    </div>
  );
}
