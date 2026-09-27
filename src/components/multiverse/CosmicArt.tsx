"use client";

import { useEffect, useRef } from "react";
import { MultiverseWorld } from "@/engine/multiverse";

// ============================================================================
// ARTE DA SALA DO MULTIVERSO — o céu de estrelas em canvas (com o "salto pro
// hiperespaço" na entrada), o buraco negro (disco de acreção girando, anel
// de fótons e o arco de luz dobrada pela gravidade) e os portais (redemoinhos
// de luz com o símbolo de cada mundo). Tudo em CSS/SVG/canvas, sem imagens.
// ============================================================================

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface Star {
  x: number;
  y: number;
  z: number;
  hue: number;
}

/**
 * Estrelas vindo na direção de quem olha. `warp` = salto pro hiperespaço
 * (rápido, com rastros); sem ele, as estrelas flutuam devagar.
 */
export function Starfield({ warp }: { warp: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const warpRef = useRef(warp);
  warpRef.current = warp;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    const stars: Star[] = [];
    const COUNT = 520;

    function resize() {
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function spawn(star?: Star): Star {
      const s = star ?? ({} as Star);
      s.x = (Math.random() - 0.5) * 2;
      s.y = (Math.random() - 0.5) * 2;
      s.z = Math.random() * 0.9 + 0.1;
      s.hue = [210, 270, 300, 190, 45][Math.floor(Math.random() * 5)];
      return s;
    }
    for (let i = 0; i < COUNT; i++) stars.push(spawn());
    resize();
    window.addEventListener("resize", resize);

    let speed = warpRef.current ? 0.035 : 0.0012;
    let frame = 0;
    function draw() {
      const target = warpRef.current ? 0.035 : 0.0012;
      speed += (target - speed) * 0.04;
      ctx!.fillStyle = warpRef.current ? "rgba(3, 0, 20, 0.35)" : "rgba(3, 0, 20, 0.9)";
      ctx!.fillRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.max(width, height) * 0.6;
      for (const s of stars) {
        const px = cx + (s.x / s.z) * scale;
        const py = cy + (s.y / s.z) * scale;
        s.z -= reduced ? 0 : speed;
        if (s.z <= 0.02 || px < -50 || px > width + 50 || py < -50 || py > height + 50) {
          spawn(s);
          s.z = 1;
          continue;
        }
        const nx = cx + (s.x / s.z) * scale;
        const ny = cy + (s.y / s.z) * scale;
        const size = Math.max(0.4, (1 - s.z) * 2.6);
        const alpha = Math.min(1, (1 - s.z) * 1.6);
        if (speed > 0.006) {
          ctx!.strokeStyle = `hsla(${s.hue}, 90%, 80%, ${alpha})`;
          ctx!.lineWidth = size;
          ctx!.beginPath();
          ctx!.moveTo(px, py);
          ctx!.lineTo(nx, ny);
          ctx!.stroke();
        } else {
          ctx!.fillStyle = `hsla(${s.hue}, 80%, 88%, ${alpha})`;
          ctx!.beginPath();
          ctx!.arc(nx, ny, size, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
      if (!reduced) frame = window.requestAnimationFrame(draw);
    }
    draw();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

/** Nuvens de nebulosa coloridas flutuando no fundo. */
export function Nebulae() {
  const clouds: [string, string, string, string, number][] = [
    ["8%", "10%", "46vmax", "rgba(124,58,237,0.35)", 0],
    ["60%", "0%", "40vmax", "rgba(236,72,153,0.22)", 4],
    ["70%", "55%", "44vmax", "rgba(34,211,238,0.2)", 8],
    ["-10%", "60%", "42vmax", "rgba(250,204,21,0.12)", 12],
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {clouds.map(([left, top, size, color, delay]) => (
        <div
          key={left + top}
          className="cg-anim-nebula absolute rounded-full"
          style={{ left, top, width: size, height: size, background: `radial-gradient(circle, ${color}, transparent 65%)`, filter: "blur(30px)", animationDelay: `-${delay}s` }}
        />
      ))}
    </div>
  );
}

// Partículas orbitando o buraco negro: [raio %, duração s, atraso s, tamanho px, cor].
const ORBITERS: [number, number, number, number, string][] = [
  [62, 7, 0, 5, "#fde68a"],
  [70, 11, 2, 3, "#f0abfc"],
  [78, 15, 5, 4, "#a5f3fc"],
  [66, 9, 4, 3, "#fdba74"],
  [84, 19, 8, 3, "#fef9c3"],
];

/**
 * Disco de acreção: a camada de fora (parada) achata o círculo em elipse; a de dentro gira só a luz.
 * Se girasse a elipse inteira, ela ficaria "em pé" a cada meia volta. `front` = só a metade de baixo.
 */
function AccretionDisk({ from, front = false }: { from: number; front?: boolean }) {
  return (
    <div
      className="pointer-events-none absolute aspect-square"
      style={{ left: "-22%", width: "144%", top: "50%", transform: "translateY(-50%) scaleY(0.3)", ...(front && { clipPath: "inset(50% 0 0 0)" }) }}
    >
      <div
        className="cg-anim-spin-slow h-full w-full rounded-full"
        style={{
          animationDuration: "5s",
          background: `conic-gradient(from ${from}deg, #fff7ed, #fb923c, #db2777, #7c2d12, #fdba74, #fef3c7, #f97316, #9d174d, #fff7ed)`,
          filter: "blur(2px)",
          maskImage: "radial-gradient(circle, transparent 34%, black 40%, black 60%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(circle, transparent 34%, black 40%, black 60%, transparent 70%)",
        }}
      />
    </div>
  );
}

/** O buraco negro no centro da sala. Ocupa o quadrado do elemento pai. */
export function BlackHole() {
  return (
    <div className="relative aspect-square w-full" aria-hidden="true">
      {/* brilho de fora */}
      <div className="cg-anim-glow-pulse absolute inset-[-18%] rounded-full" style={{ background: "radial-gradient(circle, rgba(251,146,60,0.35) 0%, rgba(168,85,247,0.25) 35%, transparent 65%)" }} />
      {/* disco de acreção de trás: um círculo girando, achatado em elipse pela camada de fora */}
      <AccretionDisk from={0} />
      {/* arco de luz dobrada pela gravidade (o disco aparecendo por cima e por baixo) */}
      <div className="absolute inset-[14%]">
        <div
          className="cg-anim-spin-slow h-full w-full rounded-full"
          style={{
            animationDuration: "9s",
            background: "conic-gradient(from 90deg, #fef3c7, #fb923c, #fde68a, #f472b6, #fef3c7, #fb923c, #fde68a, #f472b6, #fef3c7)",
            filter: "blur(2px)",
            maskImage: "radial-gradient(circle, transparent 56%, black 60%, black 68%, transparent 74%)",
            WebkitMaskImage: "radial-gradient(circle, transparent 56%, black 60%, black 68%, transparent 74%)",
          }}
        />
      </div>
      {/* anel de fótons e horizonte de eventos */}
      <div className="absolute inset-[27%] rounded-full" style={{ boxShadow: "0 0 18px 4px rgba(254,243,199,0.9), 0 0 60px 18px rgba(251,146,60,0.55), inset 0 0 30px rgba(0,0,0,1)" }} />
      <div className="absolute inset-[28%] rounded-full bg-black" style={{ boxShadow: "inset 0 0 40px 10px #000" }} />
      {/* disco da frente: a metade de baixo passa na frente do horizonte */}
      <AccretionDisk from={180} front />
      {/* partículas caindo em órbita */}
      {ORBITERS.map(([radius, duration, delay, size, color], i) => (
        <div
          key={i}
          className="cg-anim-spin-slow absolute left-1/2 top-1/2"
          style={{ width: `${radius * 2}%`, height: `${radius * 2}%`, marginLeft: `-${radius}%`, marginTop: `-${radius}%`, animationDuration: `${duration}s`, animationDelay: `-${delay}s` }}
        >
          <span className="absolute left-1/2 top-0 rounded-full" style={{ width: size, height: size, background: color, boxShadow: `0 0 10px 2px ${color}` }} />
        </div>
      ))}
    </div>
  );
}

/** Um portal: redemoinho de luz nas cores do mundo, com o símbolo dele flutuando no meio. */
export function PortalVortex({ world, size = "w-full" }: { world: MultiverseWorld; size?: string }) {
  const [outer, middle, core] = world.colors;
  return (
    <div className={`relative aspect-square ${size}`} aria-hidden="true">
      <div className="cg-anim-glow-pulse absolute inset-[-14%] rounded-full" style={{ background: `radial-gradient(circle, ${middle}66 0%, ${outer}33 45%, transparent 70%)` }} />
      {/* anel de energia */}
      <div
        className="cg-anim-spin-slow absolute inset-0 rounded-full"
        style={{
          animationDuration: "4s",
          background: `conic-gradient(from 0deg, ${outer}, ${middle}, ${core}, ${middle}, ${outer}, transparent, ${outer})`,
          maskImage: "radial-gradient(circle, transparent 60%, black 63%, black 70%, transparent 73%)",
          WebkitMaskImage: "radial-gradient(circle, transparent 60%, black 63%, black 70%, transparent 73%)",
          filter: `drop-shadow(0 0 10px ${middle})`,
        }}
      />
      {/* redemoinho */}
      <div className="absolute inset-[8%] overflow-hidden rounded-full" style={{ background: `radial-gradient(circle, ${core} 0%, ${middle} 28%, ${outer} 60%, #05010f 100%)` }}>
        <div
          className="cg-anim-spin-reverse absolute inset-[-20%]"
          style={{
            animationDuration: "6s",
            background: `repeating-conic-gradient(from 0deg, transparent 0deg 14deg, ${core}55 18deg 22deg, transparent 26deg 40deg)`,
            maskImage: "radial-gradient(circle, black 10%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle, black 10%, transparent 70%)",
          }}
        />
        <svg viewBox="0 0 100 100" className="cg-anim-spin-slow absolute inset-0 h-full w-full" style={{ animationDuration: "3.5s" }}>
          {[0, 90, 180, 270].map((a) => (
            <path
              key={a}
              d="M50 50 C55 40 68 38 74 48 C80 60 70 78 52 80 C30 82 16 64 20 44"
              fill="none"
              stroke={core}
              strokeOpacity="0.55"
              strokeWidth="1.4"
              strokeLinecap="round"
              transform={`rotate(${a} 50 50)`}
            />
          ))}
        </svg>
        <div className="absolute inset-[34%] rounded-full blur-md" style={{ background: core, opacity: 0.8 }} />
      </div>
      {/* símbolo do mundo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="cg-anim-float text-[min(9vw,3rem)]" style={{ filter: `drop-shadow(0 0 12px ${core}) drop-shadow(0 0 24px ${middle})` }}>
          {world.glyph}
        </span>
      </div>
    </div>
  );
}
