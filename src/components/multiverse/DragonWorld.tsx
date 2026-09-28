"use client";

import { useEffect, useRef, useState } from "react";
import ElderDragon from "./ElderDragon";
import { playArcaneSurge, playDragonLanding, playDragonRoar, playDragonWhoosh } from "@/engine/sfx";
import { DRAGON_FEET, DRAGON_HEAD, DRAGON_MOUTH, DragonMoment, DragonPose } from "@/engine/elderDragon";

// ============================================================================
// MUNDO 1 — O CENÁRIO E A COREOGRAFIA DO DRAGÃO ANCESTRAL.
//
// Camadas (de trás pra frente): o céu girando em redemoinho → rochas e
// obeliscos flutuando → o buraco negro que ele cria → a Pirâmide Dourada →
// o dragão → o fogo e as faíscas (canvas) → as ondas do rugido.
//
// Um laço de ~33s, calculado a cada quadro (requestAnimationFrame): ele
// chega voando de longe, dá um rasante soltando fogo na direção de quem
// olha, pousa no topo da pirâmide, se exibe, abre um buraco negro com
// esferas e anéis orbitando e relâmpagos saindo das mãos, ruge (a tela
// treme e as ondas do rugido atravessam tudo) e levanta voo de novo.
// ============================================================================

const CYCLE = 33;

// Caminho do voo: [tempo s, x (fração da largura), y (fração da altura; "P" = topo da pirâmide), escala, giro°]
type Key = [number, number, number | "P", number, number];
const FLIGHT_IN: Key[] = [
  [0, 1.32, 0.12, 0.26, -14],
  [1.7, 0.8, 0.2, 0.36, -10],
  [3.3, 0.22, 0.3, 0.5, 8],
  [4.7, 0.07, 0.6, 0.8, 14],
  [6.1, 0.5, 0.94, 1.32, 0],
  [7.5, 0.92, 0.56, 0.86, -12],
  [8.9, 0.7, 0.16, 0.72, -6],
  [10.2, 0.5, 0.05, 0.94, 0],
  [11.2, 0.5, "P", 1, 0],
];
const FLIGHT_OUT: Key[] = [
  [26.9, 0.5, "P", 1, 0],
  [27.7, 0.5, "P", 0.98, 0],
  [29.0, 0.45, 0.08, 1.3, 4],
  [30.3, 0.32, -0.6, 1.75, 8],
];

function momentAt(t: number): DragonMoment {
  if (t < 5.4) return "chegada";
  if (t < 6.9) return "rasante";
  if (t < 11.2) return t < 10.2 ? "chegada" : "pouso";
  if (t < 14.2) return "exibir";
  if (t < 20.2) return "magia";
  if (t < 24.4) return "rugido";
  if (t < 26.9) return "exibir";
  return "partida";
}

function poseAt(t: number): DragonPose {
  if (t < 10.2) return "voo";
  if (t < 11.2) return "pouso";
  if (t < 14.2) return "exibir";
  if (t < 20.2) return "magia";
  if (t < 24.4) return "rugido";
  if (t < 26.9) return "exibir";
  if (t < 28.1) return "impulso";
  return "voo";
}

const smooth = (x: number) => x * x * (3 - 2 * x);

function catmull(p0: number, p1: number, p2: number, p3: number, u: number) {
  return 0.5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (-p0 + 3 * p1 - 3 * p2 + p3) * u * u * u);
}

/** Posição das garras (px), escala e giro do dragão no tempo t. */
function placeAt(t: number, W: number, H: number, perchY: number): { x: number; y: number; s: number; r: number; visible: boolean } {
  const resolve = (k: Key) => ({ t: k[0], x: k[1] * W, y: k[2] === "P" ? perchY : k[2] * H, s: k[3], r: k[4] });
  const path = t < 11.2 ? FLIGHT_IN : t >= 26.9 ? FLIGHT_OUT : null;
  if (!path) return { x: W / 2, y: perchY, s: 1, r: 0, visible: true };
  const pts = path.map(resolve);
  if (t >= pts[pts.length - 1].t) return { ...pts[pts.length - 1], visible: path === FLIGHT_IN };
  let i = 0;
  while (i < pts.length - 2 && t > pts[i + 1].t) i++;
  const a = pts[Math.max(0, i - 1)];
  const b = pts[i];
  const c = pts[i + 1];
  const d = pts[Math.min(pts.length - 1, i + 2)];
  const u = Math.min(1, Math.max(0, (t - b.t) / (c.t - b.t)));
  const e = smooth(u);
  // um balanço leve de cima pra baixo enquanto voa
  const bob = Math.sin(t * 6.6) * H * 0.008;
  return {
    x: catmull(a.x, b.x, c.x, d.x, u),
    y: catmull(a.y, b.y, c.y, d.y, u) + (path === FLIGHT_IN && t < 10.2 ? bob : 0),
    s: b.s + (c.s - b.s) * e,
    r: b.r + (c.r - b.r) * e,
    visible: true,
  };
}

// ---------------------------------------------------------------------------
// medidas da cena
// ---------------------------------------------------------------------------

interface Layout {
  W: number;
  H: number;
  D: number; // tamanho do dragão (lado do quadrado do desenho)
  pyramidW: number;
  pyramidBottom: number;
  perchY: number; // y (px) do topo da pirâmide
}

const PYRAMID_VIEW = { w: 1000, h: 420, top: 40 };

function measure(W: number, H: number): Layout {
  const feet = DRAGON_FEET.y / DRAGON_FEET.size;
  const place = (D: number) => {
    const pyramidW = Math.max(D * 1.75, Math.min(W * 0.6, D * 2.2));
    const ph = (pyramidW * PYRAMID_VIEW.h) / PYRAMID_VIEW.w;
    const bottom = -ph * 0.24; // a base da pirâmide passa da borda de baixo
    const perchY = H - (ph * (PYRAMID_VIEW.h - PYRAMID_VIEW.top)) / PYRAMID_VIEW.h - bottom;
    return { W, H, D, pyramidW, pyramidBottom: bottom, perchY };
  };
  let layout = place(Math.min(H * 0.64, W * 0.92));
  // se os chifres passarem da barra do topo, diminui tudo até caber
  for (let i = 0; i < 8 && layout.perchY - layout.D * feet < 64; i++) layout = place(layout.D * 0.93);
  return layout;
}

// ---------------------------------------------------------------------------
// o céu em redemoinho
// ---------------------------------------------------------------------------

const SPIRAL_COLORS = ["#c4b5fd", "#93c5fd", "#67e8f9", "#f0abfc", "#a5b4fc", "#5eead4"];

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
      ctx.globalAlpha = 0.16 + ((k * 3) % 4) * 0.07;
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
      {/* brilho do olho do redemoinho */}
      <div
        className="absolute inset-0 rounded-full transition-opacity duration-1000"
        style={{
          background: "radial-gradient(circle, rgba(237,233,254,0.9) 0%, rgba(167,139,250,0.55) 5%, rgba(76,29,149,0.45) 14%, rgba(30,58,138,0.35) 28%, rgba(15,23,42,0.15) 45%, transparent 62%)",
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
// cenário: obeliscos e rochas flutuando, névoa
// ---------------------------------------------------------------------------

function FloatingRock({ x, y, w, delay, crystal }: { x: string; y: string; w: string; delay: number; crystal: string }) {
  return (
    <div className="cg-anim-dragon-hover absolute" style={{ left: x, top: y, width: w, "--cg-delay": `${delay}s`, "--cg-dur": `${6 + (delay % 3)}s` } as React.CSSProperties}>
      <svg viewBox="0 0 200 160" className="h-auto w-full" style={{ filter: `drop-shadow(0 0 14px ${crystal}55)` }}>
        <path d="M10 60 L60 40 L140 44 L192 62 L170 80 L130 118 L100 158 L72 116 L30 84 Z" fill="#141a33" stroke="#2b3563" strokeWidth="2" />
        <path d="M10 60 L60 40 L140 44 L192 62 L150 70 L60 70 Z" fill="#232c52" />
        <path d="M82 42 L94 2 L104 42 Z M112 44 L126 14 L132 46 Z M60 44 L66 24 L74 42 Z" fill={crystal} opacity="0.85" />
        <path d="M94 2 L100 42" stroke="#fff" strokeOpacity="0.6" strokeWidth="1.5" />
        <path d="M100 150 L100 158" stroke={crystal} strokeWidth="2" />
      </svg>
    </div>
  );
}

function Spires({ side }: { side: "left" | "right" }) {
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMax meet" className="pointer-events-none absolute bottom-0 h-[62%] w-auto" style={{ [side]: "-2%", transform: side === "right" ? "scaleX(-1)" : undefined }} aria-hidden="true">
      <defs>
        <linearGradient id={`spire-${side}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e2a55" />
          <stop offset="1" stopColor="#070b1c" />
        </linearGradient>
      </defs>
      <g fill={`url(#spire-${side})`} stroke="#2dd4bf" strokeOpacity="0.25" strokeWidth="1.5">
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
        <circle key={i} cx={x} cy={y} r="3" fill="#5eead4" className="cg-anim-dragon-glow" style={{ "--cg-delay": `${-i * 0.7}s` } as React.CSSProperties} />
      ))}
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
      className="pointer-events-none absolute left-1/2"
      style={{ width: layout.pyramidW, bottom: layout.pyramidBottom, transform: "translateX(-50%)", overflow: "visible" }}
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
          <stop offset="0" stopColor="#ccfbf1" stopOpacity="0.95" />
          <stop offset="0.4" stopColor="#2dd4bf" stopOpacity="0.55" />
          <stop offset="1" stopColor="#0d9488" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pyr-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#020617" stopOpacity="0.75" />
        </linearGradient>
      </defs>
      {/* feixe de luz subindo do topo quando a magia acontece */}
      <path d="M470 40 L530 40 L600 -900 L400 -900 Z" fill="#5eead4" style={{ opacity: charged ? 0.14 : 0, transition: "opacity 1.2s" }} />
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
                  <path d={RUNES[(i + j + (side > 0 ? 2 : 0)) % RUNES.length]} fill="none" stroke="#2dd4bf" strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round" />
                  <path d={RUNES[(i + j + (side > 0 ? 2 : 0)) % RUNES.length]} fill="none" stroke="#ccfbf1" strokeWidth="2" strokeLinecap="round" />
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
      {/* braseiros com fogo azul-esverdeado nos cantos do topo */}
      {[436, 564].map((x) => (
        <g key={x}>
          <path d={`M${x - 12} 40 L${x + 12} 40 L${x + 8} 30 L${x - 8} 30 Z`} fill="#8a5a1c" stroke="#3b2208" strokeWidth="1.5" />
          <g className="cg-anim-aura-flicker" style={{ "--cg-dur": "0.7s" } as React.CSSProperties}>
            <path d={`M${x - 8} 30 C${x - 10} 18 ${x - 2} 14 ${x} 0 C${x + 3} 12 ${x + 11} 16 ${x + 8} 30 Z`} fill="#2dd4bf" opacity="0.85" />
            <path d={`M${x - 4} 30 C${x - 5} 22 ${x} 18 ${x + 1} 10 C${x + 3} 18 ${x + 6} 22 ${x + 4} 30 Z`} fill="#d1fae5" />
          </g>
        </g>
      ))}
      {/* círculo de pouso */}
      <ellipse cx="500" cy="40" rx="96" ry="15" fill="url(#pyr-pad)" style={{ opacity: perched ? 1 : 0.45, transition: "opacity 0.8s" }} className="cg-anim-dragon-glow" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// o buraco negro que o dragão cria atrás da cabeça
// ---------------------------------------------------------------------------

function RiftBlackHole({ x, y, size, open }: { x: number; y: number; size: number; open: boolean }) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        transform: `scale(${open ? 1 : 0})`,
        opacity: open ? 1 : 0,
        transition: open ? "transform 1.6s cubic-bezier(0.2, 0.9, 0.3, 1.1), opacity 0.6s" : "transform 1.2s ease-in, opacity 1.2s ease-in",
      }}
      aria-hidden="true"
    >
      <div className="cg-anim-glow-pulse absolute inset-[-30%] rounded-full" style={{ background: "radial-gradient(circle, rgba(237,233,254,0.55) 18%, rgba(139,92,246,0.4) 32%, rgba(45,212,191,0.18) 48%, transparent 66%)" }} />
      {/* disco girando com a luz dobrada */}
      <div
        className="cg-anim-dragon-spiral absolute inset-[-8%] rounded-full"
        style={{
          "--cg-dur": "4s",
          background: "conic-gradient(from 0deg, #f5f3ff, #a78bfa, #1e1b4b, #5eead4, #f5f3ff, #c4b5fd, #312e81, #99f6e4, #f5f3ff)",
          maskImage: "radial-gradient(circle, transparent 44%, black 47%, black 58%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(circle, transparent 44%, black 47%, black 58%, transparent 70%)",
          filter: "blur(3px)",
        } as React.CSSProperties}
      />
      <div
        className="cg-anim-spin-reverse absolute inset-[-24%] rounded-full"
        style={{
          animationDuration: "9s",
          background: "repeating-conic-gradient(from 0deg, transparent 0deg 10deg, rgba(196,181,253,0.35) 14deg 18deg, transparent 22deg 34deg)",
          maskImage: "radial-gradient(circle, transparent 40%, black 50%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(circle, transparent 40%, black 50%, transparent 72%)",
        }}
      />
      {/* anel de fótons e o horizonte */}
      <div className="absolute inset-[18%] rounded-full" style={{ boxShadow: "0 0 22px 6px rgba(245,243,255,0.95), 0 0 70px 24px rgba(139,92,246,0.6), inset 0 0 30px #000" }} />
      <div className="absolute inset-[19%] rounded-full bg-black" style={{ boxShadow: "inset 0 0 40px 12px #000" }} />
    </div>
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
      timer = window.setTimeout(strike, stormRef.current ? 350 + Math.random() * 700 : 2200 + Math.random() * 3200);
    };
    timer = window.setTimeout(strike, 1500);
    return () => window.clearTimeout(timer);
  }, [W, H]);

  return (
    <>
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        {bolts.map((b) => (
          <g key={b.id} className="cg-anim-dragon-bolt-sky">
            <path d={b.d} fill="none" stroke="#a78bfa" strokeOpacity="0.4" strokeWidth="9" strokeLinejoin="round" style={{ filter: "blur(4px)" }} />
            <path d={b.d} fill="none" stroke="#c4b5fd" strokeWidth="2.4" strokeLinejoin="round" />
            <path d={b.d} fill="none" stroke="#fff" strokeWidth="1" strokeLinejoin="round" />
          </g>
        ))}
      </svg>
      {bolts
        .filter((b) => b.flash)
        .slice(-1)
        .map((b) => (
          <div key={`f${b.id}`} className="cg-anim-dragon-flash pointer-events-none absolute inset-0" style={{ background: "radial-gradient(circle at 50% 20%, rgba(221,214,254,0.5), rgba(99,102,241,0.12) 60%, transparent)" }} />
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

// cores do fogo do dragão: do branco no miolo pro ciano, verde-água e verde
const FIRE_STOPS = ["#f0fdfa", "#a5f3fc", "#22d3ee", "#2dd4bf", "#34d399", "#065f46"];

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
// a cena
// ---------------------------------------------------------------------------

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
    const { W, H, D, perchY } = layout;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const place = (x: number, y: number, s: number, r: number, visible: boolean) => {
      dragon.style.transform = `translate(${x}px, ${y}px) translate(-50%, -${(DRAGON_FEET.y / DRAGON_FEET.size) * 100}%) rotate(${r}deg) scale(${s})`;
      dragon.style.opacity = visible ? "1" : "0";
    };

    if (reduced) {
      place(W / 2, perchY, 1, 0, true);
      setPose("exibir");
      setMoment("exibir");
      momentCb.current("exibir");
      return;
    }

    const sprites = FIRE_STOPS.map(makeSprite);
    const gold = makeSprite("#fcd34d");
    const violet = makeSprite("#c4b5fd");
    const particles: Particle[] = [];
    const k = D / 520; // tamanho das partículas acompanha o dragão

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
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      const elapsed = (now - start) / 1000;
      const cycle = Math.floor(elapsed / CYCLE);
      const t = elapsed - cycle * CYCLE;
      if (cycle !== cycleIndex) {
        cycleIndex = cycle;
        fired = new Set();
      }

      // dragão
      const p = placeAt(t, W, H, perchY);
      place(p.x, p.y, p.s, p.r, p.visible);
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
      const breathing = t >= 5.5 && t < 6.7;
      if (breathing !== lastBreath) {
        lastBreath = breathing;
        setBreath(breathing);
      }

      // sons e ondas nos momentos certos
      fire("rasante", t, 5.4, () => soundRef.current && playDragonWhoosh());
      fire("pouso", t, 11.1, () => soundRef.current && playDragonLanding());
      fire("magia", t, 14.3, () => soundRef.current && playArcaneSurge());
      fire("rugido", t, 20.4, () => {
        setRoarWave((n) => n + 1);
        if (soundRef.current) playDragonRoar();
      });

      // ponto de um lugar do desenho → tela (considerando escala e giro)
      const toScreen = (lx: number, ly: number) => {
        const ox = ((lx - DRAGON_FEET.x) / DRAGON_FEET.size) * D * p.s;
        const oy = ((ly - DRAGON_FEET.y) / DRAGON_FEET.size) * D * p.s;
        const a = (p.r * Math.PI) / 180;
        return { x: p.x + ox * Math.cos(a) - oy * Math.sin(a), y: p.y + ox * Math.sin(a) + oy * Math.cos(a) };
      };

      // emissores
      const rand = Math.random;
      if (breathing) {
        // rasante: o fogo vem na direção de quem olha (espalha e cresce)
        const m = toScreen(DRAGON_MOUTH.x, DRAGON_MOUTH.y + 20);
        for (let i = 0; i < 14; i++) {
          const a = Math.PI / 2 + (rand() - 0.5) * 1.5;
          const v = (260 + rand() * 420) * k * p.s;
          particles.push({ x: m.x, y: m.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v * 0.7, life: 0, max: 0.55 + rand() * 0.5, size: (10 + rand() * 14) * k * p.s, grow: 5.5, kind: "fogo" });
        }
      }
      if (t >= 20.4 && t < 23.2) {
        // rugido: coluna de fogo subindo pro céu
        const m = toScreen(DRAGON_MOUTH.x, DRAGON_MOUTH.y + 8);
        for (let i = 0; i < 12; i++) {
          const a = -Math.PI / 2 + (rand() - 0.5) * 0.55;
          const v = (520 + rand() * 520) * k;
          particles.push({ x: m.x + (rand() - 0.5) * 8 * k, y: m.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: 0.7 + rand() * 0.6, size: (8 + rand() * 12) * k, grow: 3.2, kind: "fogo" });
        }
        // fogo no chão em volta das garras
        for (let i = 0; i < 4; i++) {
          particles.push({ x: W / 2 + (rand() - 0.5) * D * 0.55, y: perchY + 4, vx: (rand() - 0.5) * 30, vy: -(120 + rand() * 160) * k, life: 0, max: 0.6 + rand() * 0.4, size: (7 + rand() * 8) * k, grow: 1.6, kind: "fogo" });
        }
      }
      if (t < 10.2 || t > 28) {
        // rastro mágico do voo
        const c = toScreen(300, 330);
        if (rand() < 0.7) particles.push({ x: c.x + (rand() - 0.5) * 60 * k * p.s, y: c.y + (rand() - 0.5) * 60 * k * p.s, vx: (rand() - 0.5) * 40, vy: (rand() - 0.5) * 40, life: 0, max: 1 + rand() * 0.8, size: (2 + rand() * 3) * k * p.s, grow: 0, kind: "faisca" });
      }
      if (t >= 14.2 && t < 20.2 && rand() < 0.5) {
        // faíscas subindo da pirâmide durante a magia
        particles.push({ x: W / 2 + (rand() - 0.5) * D * 0.4, y: perchY, vx: (rand() - 0.5) * 60, vy: -(80 + rand() * 140), life: 0, max: 1.4 + rand(), size: (2 + rand() * 2.5) * k, grow: 0, kind: "faisca" });
      }
      // brasas douradas subindo do chão, sempre
      if (rand() < 0.35) particles.push({ x: rand() * W, y: H + 10, vx: (rand() - 0.5) * 20, vy: -(30 + rand() * 60), life: 0, max: 5 + rand() * 5, size: 1.4 + rand() * 2.4, grow: 0, kind: "brasa" });

      // desenha
      ctx.clearRect(0, 0, W, H);
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
          q.vy = q.vy * 0.985 - 24 * dt;
          q.size += q.grow * dt * 10 * k;
          sprite = sprites[Math.min(sprites.length - 1, Math.floor(f * sprites.length))];
          alpha = Math.min(1, f * 6) * (1 - f) * 0.9;
        } else if (q.kind === "faisca") {
          sprite = f < 0.5 ? sprites[1] : violet;
          alpha = (1 - f) * 0.9;
        } else {
          q.x += Math.sin((now / 1000 + i) * 1.3) * 0.25;
          sprite = i % 3 ? gold : sprites[3];
          alpha = Math.sin(f * Math.PI) * 0.8;
        }
        const size = q.size * 2.4;
        ctx.globalAlpha = alpha;
        ctx.drawImage(sprite, q.x - size / 2, q.y - size / 2, size, size);
      }
      if (particles.length > 1400) particles.splice(0, particles.length - 1400);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      frame = window.requestAnimationFrame(loop);
    };
    frame = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(frame);
  }, [layout, reduced, startAt]);

  const head = layout ? { x: layout.W / 2, y: layout.perchY - ((DRAGON_FEET.y - DRAGON_HEAD.y) / DRAGON_FEET.size) * layout.D } : null;
  const magicOn = moment === "magia" || moment === "rugido";
  const perched = pose !== "voo";

  return (
    <div ref={stageRef} className={`absolute inset-0 overflow-hidden ${moment === "rugido" && !reduced ? "cg-anim-dragon-shake" : ""}`}>
      {layout && head && (
        <>
          <SkyVortex cx={head.x} cy={head.y} size={Math.max(layout.W, layout.H) * 1.9} charged={magicOn} />
          <SkyLightning W={layout.W} H={layout.H} storm={magicOn} />

          {/* rochas flutuando */}
          <FloatingRock x="4%" y="18%" w="min(16vw, 150px)" delay={0} crystal="#5eead4" />
          <FloatingRock x="80%" y="12%" w="min(13vw, 120px)" delay={-2} crystal="#c4b5fd" />
          <FloatingRock x="86%" y="46%" w="min(10vw, 90px)" delay={-4} crystal="#fcd34d" />
          <FloatingRock x="12%" y="52%" w="min(8vw, 76px)" delay={-1} crystal="#a5f3fc" />
          <Spires side="left" />
          <Spires side="right" />

          <RiftBlackHole x={head.x} y={head.y} size={layout.D * 0.7} open={magicOn} />

          {/* névoa baixa */}
          <div
            className="cg-anim-dragon-mist pointer-events-none absolute -left-[10%] bottom-0 h-[30%] w-[120%]"
            style={{ background: "radial-gradient(ellipse at 30% 100%, rgba(45,212,191,0.18), transparent 60%), radial-gradient(ellipse at 75% 100%, rgba(139,92,246,0.2), transparent 55%)" }}
          />

          <GoldenPyramid layout={layout} charged={magicOn} perched={perched} />
        </>
      )}

      {/* o dragão */}
      <div
        ref={dragonRef}
        className="pointer-events-none absolute left-0 top-0 will-change-transform"
        style={{ width: layout?.D ?? 0, height: layout?.D ?? 0, transformOrigin: `50% ${(DRAGON_FEET.y / DRAGON_FEET.size) * 100}%`, opacity: 0 }}
      >
        <ElderDragon pose={pose} mouthOpen={breath} className="h-full w-full" />
      </div>

      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />

      {/* ondas do rugido atravessando tudo */}
      {roarWave > 0 && head && (
        <div key={roarWave} className="pointer-events-none absolute inset-0">
          {[0, 0.35, 0.7, 1.05].map((d) => (
            <div
              key={d}
              className="cg-anim-dragon-shockwave absolute rounded-full"
              style={{
                left: head.x,
                top: head.y + (layout?.D ?? 0) * 0.12,
                width: "260vmax",
                height: "260vmax",
                border: "6px solid rgba(153,246,228,0.55)",
                boxShadow: "0 0 40px rgba(45,212,191,0.5), inset 0 0 40px rgba(167,139,250,0.4)",
                "--cg-delay": `${d}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}
    </div>
  );
}
