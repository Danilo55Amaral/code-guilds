"use client";

import Image from "next/image";
import { House, HouseId } from "@/engine/houses";
import { Fog, Rays, Stars } from "../events/common";

// ============================================================================
// ANIMAIS DAS CASAS — o Leão (Ignis), a Serpente (Noctis), a Águia (Flavus) e
// o Corvo (Sapientia) em SVG animado, cada um no seu cenário: a forja em
// chamas, o pântano ao luar, o céu dourado e a biblioteca estrelada. As
// animações (cg-anim-*) ficam em globals.css.
// ============================================================================

/** Recorte do escudo dos brasões (as imagens são quadradas, com fundo). */
export const CREST_CLIP =
  "polygon(50% 12%, 82% 21.5%, 82% 55%, 78% 66%, 72% 75%, 62% 83.5%, 50% 89%, 38% 83.5%, 28% 75%, 22% 66%, 18% 55%, 18% 21.5%)";

/** Brasão recortado no formato do escudo, com o brilho da cor da casa. `priority` = carrega já (brasões do topo da página). */
export function Crest({ house, size, className = "", priority = false }: { house: House; size: number; className?: string; priority?: boolean }) {
  return (
    <div className={className} style={{ filter: `drop-shadow(0 0 ${Math.round(size / 8)}px ${house.hex}aa)` }}>
      <Image src={house.crest} alt={`Brasão da ${house.name}`} width={size} height={size} priority={priority} className="h-auto w-full" style={{ clipPath: CREST_CLIP }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Os animais
// ---------------------------------------------------------------------------

const MANE = Array.from({ length: 14 }, (_, i) => (i * 360) / 14);

/** Leão coroado de frente: a juba "respira" e, de tempos em tempos, ele ruge. */
export function Lion({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={`overflow-visible ${className}`} aria-hidden="true">
      <g className="cg-anim-mane">
        {MANE.map((a, i) => (
          <ellipse key={a} cx="100" cy="40" rx="19" ry="33" fill={i % 2 ? "#d97706" : "#f59e0b"} stroke="#b45309" strokeWidth="1.5" transform={`rotate(${a} 100 104)`} />
        ))}
      </g>
      <circle cx="64" cy="62" r="13" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
      <circle cx="64" cy="62" r="6.5" fill="#fde68a" />
      <circle cx="136" cy="62" r="13" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
      <circle cx="136" cy="62" r="6.5" fill="#fde68a" />
      <path d="M100 52 C132 52 148 76 146 104 C144 134 126 156 100 158 C74 156 56 134 54 104 C52 76 68 52 100 52 Z" fill="#fbbf24" />
      <path d="M92 60 L100 74 L108 60" stroke="#f59e0b" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M70 84 L90 89 M130 84 L110 89" stroke="#92400e" strokeWidth="3.5" strokeLinecap="round" />
      <g className="cg-anim-blink">
        <ellipse cx="80" cy="97" rx="7" ry="8" fill="#fff" />
        <ellipse cx="120" cy="97" rx="7" ry="8" fill="#fff" />
        <circle cx="81" cy="98" r="4.5" fill="#78350f" />
        <circle cx="121" cy="98" r="4.5" fill="#78350f" />
        <circle cx="82.5" cy="96" r="1.5" fill="#fff" />
        <circle cx="122.5" cy="96" r="1.5" fill="#fff" />
      </g>
      <ellipse cx="100" cy="127" rx="26" ry="20" fill="#fef3c7" />
      <path d="M91 111 L109 111 L100 121 Z" fill="#7c2d12" stroke="#7c2d12" strokeWidth="3" strokeLinejoin="round" />
      <path d="M100 121 L100 130" stroke="#7c2d12" strokeWidth="2.5" />
      {[
        [84, 124],
        [80, 130],
        [116, 124],
        [120, 130],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="#b45309" />
      ))}
      <path d="M86 133 Q100 142 114 133" stroke="#7c2d12" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* rugido: a boca abre de tempos em tempos */}
      <g className="cg-anim-roar">
        <ellipse cx="100" cy="141" rx="13" ry="10" fill="#7f1d1d" />
        <path d="M90 134 L93 141 L96 134 Z M104 134 L107 141 L110 134 Z" fill="#fff" />
      </g>
      <path d="M78 46 L82 25 L92 38 L100 19 L108 38 L118 25 L122 46 Z" fill="#fde047" stroke="#a16207" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="100" cy="36" r="3.5" fill="#dc2626" />
    </svg>
  );
}

const SERPENT_BODY = "M30 182 C30 150 62 146 100 146 C150 146 170 124 160 102 C150 80 110 90 88 84 C64 78 60 58 80 46";

/** Serpente em S balançando, com as escamas "correndo" pelo corpo e a língua saindo. */
export function Serpent({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={`overflow-visible ${className}`} aria-hidden="true">
      <g className="cg-anim-sway">
        <path d={SERPENT_BODY} stroke="#047857" strokeWidth="24" fill="none" strokeLinecap="round" />
        <path d={SERPENT_BODY} stroke="#10b981" strokeWidth="17" fill="none" strokeLinecap="round" />
        <path d={SERPENT_BODY} stroke="#a7f3d0" strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray="4 10" opacity="0.8" className="cg-anim-slither" />
        <g transform="translate(88 40)">
          <path d="M-16 6 C-18 -8 -5 -17 10 -15 C23 -13 32 -5 30 4 C28 12 15 17 0 15 C-9 14 -15 11 -16 6 Z" fill="#10b981" stroke="#047857" strokeWidth="3" />
          <path d="M-4 -12 C4 -10 14 -10 22 -6" stroke="#6ee7b7" strokeWidth="2" fill="none" opacity="0.7" />
          <g className="cg-anim-blink">
            <ellipse cx="9" cy="-3" rx="4.5" ry="5" fill="#fde047" />
            <ellipse cx="9.5" cy="-3" rx="1.3" ry="4" fill="#052e16" />
          </g>
          <circle cx="24" cy="3" r="1.2" fill="#052e16" />
          <g className="cg-anim-tongue">
            <path d="M29 6 L44 6 L50 1 M44 6 L50 11" stroke="#ef4444" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
      </g>
    </svg>
  );
}

const WING_LEFT =
  "M94 88 C76 70 48 58 10 62 C22 70 30 74 34 78 C20 80 12 86 6 96 C24 94 36 96 44 98 C34 104 28 110 26 120 C46 110 64 106 90 110 Z";
const WING_RIGHT =
  "M106 88 C124 70 152 58 190 62 C178 70 170 74 166 78 C180 80 188 86 194 96 C176 94 164 96 156 98 C166 104 172 110 174 120 C154 110 136 106 110 110 Z";

/** Águia de frente, de asas abertas batendo. */
export function Eagle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={`overflow-visible ${className}`} aria-hidden="true">
      <g className="cg-anim-wing-l">
        <path d={WING_LEFT} fill="#f59e0b" stroke="#92400e" strokeWidth="2" strokeLinejoin="round" />
        <path d="M34 78 C50 82 70 88 88 96 M44 98 C58 100 74 102 90 106" stroke="#b45309" strokeWidth="1.8" fill="none" />
      </g>
      <g className="cg-anim-wing-r">
        <path d={WING_RIGHT} fill="#f59e0b" stroke="#92400e" strokeWidth="2" strokeLinejoin="round" />
        <path d="M166 78 C150 82 130 88 112 96 M156 98 C142 100 126 102 110 106" stroke="#b45309" strokeWidth="1.8" fill="none" />
      </g>
      <path d="M88 150 L100 180 L112 150 Z M92 152 L84 174 L98 160 Z M108 152 L116 174 L102 160 Z" fill="#92400e" />
      <path d="M100 78 C114 78 120 98 116 122 C113 140 106 150 100 156 C94 150 87 140 84 122 C80 98 86 78 100 78 Z" fill="#b45309" stroke="#92400e" strokeWidth="2" />
      <ellipse cx="100" cy="114" rx="10" ry="20" fill="#d97706" opacity="0.7" />
      <path d="M92 156 L88 166 M92 156 L92 167 M92 156 L96 166 M108 156 L104 166 M108 156 L108 167 M108 156 L112 166" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="100" cy="66" r="17" fill="#fef3c7" stroke="#d6d3d1" strokeWidth="1.5" />
      <path d="M87 58 L97 61 M113 58 L103 61" stroke="#44403c" strokeWidth="2.5" strokeLinecap="round" />
      <g className="cg-anim-blink">
        <circle cx="93" cy="64" r="3" fill="#1c1917" />
        <circle cx="107" cy="64" r="3" fill="#1c1917" />
        <circle cx="94" cy="63" r="1" fill="#fff" />
        <circle cx="108" cy="63" r="1" fill="#fff" />
      </g>
      <path d="M94 70 L106 70 C106 78 102 84 97 87 C98 80 96 76 94 70 Z" fill="#facc15" stroke="#a16207" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

/** Corvo de olhos azuis empoleirado num livro aberto, inclinando a cabeça. */
export function Crow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={`overflow-visible ${className}`} aria-hidden="true">
      <ellipse cx="100" cy="186" rx="80" ry="10" fill="#60a5fa" opacity="0.3" />
      <path d="M100 170 C80 162 50 160 24 166 L24 188 C50 182 80 184 100 192 Z" fill="#fef3c7" stroke="#92400e" strokeWidth="2" strokeLinejoin="round" />
      <path d="M100 170 C120 162 150 160 176 166 L176 188 C150 182 120 184 100 192 Z" fill="#fef3c7" stroke="#92400e" strokeWidth="2" strokeLinejoin="round" />
      <path d="M36 172 L88 174 M36 178 L80 180 M112 174 L164 172 M120 180 L164 178" stroke="#a8a29e" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M100 170 L100 192" stroke="#92400e" strokeWidth="2" />
      <path d="M96 156 L94 170 M108 156 L108 170 M90 170 L98 170 M104 170 L112 170" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
      <path d="M72 146 L42 168 L56 170 L48 180 L80 158 Z" fill="#0f172a" stroke="#3b82f6" strokeWidth="1" strokeLinejoin="round" />
      <path d="M70 150 C60 120 78 92 110 90 C132 90 142 108 138 128 C134 148 110 160 86 158 Z" fill="#1e293b" stroke="#60a5fa" strokeWidth="1.5" />
      <g className="cg-anim-flutter">
        <path d="M84 112 C100 104 126 108 134 126 C122 138 100 146 78 146 C72 134 74 120 84 112 Z" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.2" />
        <path d="M86 124 C100 122 114 126 124 132 M84 134 C96 134 108 136 116 140" stroke="#3b82f6" strokeWidth="1" fill="none" opacity="0.7" />
      </g>
      <g className="cg-anim-tilt">
        <circle cx="122" cy="80" r="21" fill="#1e293b" stroke="#60a5fa" strokeWidth="1.5" />
        <path d="M138 74 L168 81 L138 90 Z" fill="#475569" stroke="#1e293b" strokeWidth="1" strokeLinejoin="round" />
        <path d="M138 82 L162 82" stroke="#1e293b" strokeWidth="1.2" />
        <g className="cg-anim-blink">
          <circle cx="128" cy="74" r="5.5" fill="#93c5fd" />
          <circle cx="129" cy="74" r="2.6" fill="#0b0b10" />
          <circle cx="130" cy="72.5" r="1" fill="#fff" />
        </g>
        <path d="M110 62 C114 58 120 58 124 60" stroke="#60a5fa" strokeWidth="1.5" fill="none" opacity="0.6" />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Cenários
// ---------------------------------------------------------------------------

// Partículas com posição e ritmo fixos (sem Math.random no render).
const EMBERS = Array.from({ length: 14 }, (_, i) => ({ left: (i * 37 + 9) % 100, size: 3 + (i % 3), delay: (i * 0.41) % 4, duration: 3 + (i % 4) * 0.8 }));
const FIREFLIES = Array.from({ length: 12 }, (_, i) => ({ left: (i * 43 + 11) % 95, top: 18 + ((i * 29) % 70), delay: (i % 6) * 0.45 }));
const CLOUDS = [
  { top: 14, width: 34, duration: 38, delay: -6 },
  { top: 58, width: 26, duration: 30, delay: -20 },
  { top: 78, width: 40, duration: 44, delay: -32 },
];
const GLYPHS: [string, number, number, number][] = [
  ["{ }", 10, 16, 0],
  ["if", 80, 12, 0.7],
  ["01", 14, 58, 1.4],
  ["λ", 84, 50, 0.4],
  ["</>", 72, 78, 1.1],
  ["for", 8, 82, 1.8],
];

const SCENE_BG: Record<HouseId, string> = {
  ignis: "radial-gradient(60% 55% at 50% 62%, rgba(251,146,60,0.6), transparent 70%), linear-gradient(180deg, #1c0a02 0%, #450a0a 60%, #7c2d12 100%)",
  noctis: "radial-gradient(50% 45% at 72% 22%, rgba(167,243,208,0.3), transparent 70%), linear-gradient(180deg, #022c22 0%, #064e3b 55%, #0f172a 100%)",
  flavus: "radial-gradient(55% 50% at 50% 40%, rgba(254,240,138,0.65), transparent 70%), linear-gradient(180deg, #0c4a6e 0%, #0369a1 50%, #f59e0b 100%)",
  sapientia: "radial-gradient(55% 50% at 50% 45%, rgba(96,165,250,0.4), transparent 70%), linear-gradient(180deg, #020617 0%, #1e1b4b 55%, #172554 100%)",
};

const ANIMALS: Record<HouseId, (props: { className?: string }) => React.ReactElement> = { ignis: Lion, noctis: Serpent, flavus: Eagle, sapientia: Crow };

/** O cenário de uma casa: fundo, partículas, o animal animado no meio e o brasão no canto. */
export function HouseScene({ house }: { house: House }) {
  const Animal = ANIMALS[house.id];
  return (
    <div className={`relative aspect-square w-full overflow-hidden rounded-3xl border-2 ${house.borderClass}`} style={{ background: SCENE_BG[house.id], boxShadow: `0 20px 60px -25px ${house.hex}` }}>
      {house.id === "ignis" && (
        <>
          {EMBERS.map((e, i) => (
            <span
              key={i}
              className="cg-anim-sparkle absolute -bottom-2 rounded-full bg-amber-300"
              style={{ left: `${e.left}%`, width: e.size, height: e.size, boxShadow: "0 0 8px #f97316", "--cg-delay": `${e.delay}s`, "--cg-duration": `${e.duration}s` } as React.CSSProperties}
            />
          ))}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-around px-[6%]">
            {[0, 0.4, 0.2, 0.6, 0.1].map((d, i) => (
              <svg key={i} viewBox="0 0 40 60" className="cg-anim-flicker w-[14%] overflow-visible" style={{ animationDelay: `${d}s` }} aria-hidden="true">
                <path d="M20 2 C8 20 6 36 12 48 C16 56 24 56 28 48 C34 36 32 20 20 2 Z" fill="#f97316" opacity="0.85" />
                <path d="M20 22 C14 32 14 42 18 48 C20 51 22 51 24 48 C27 42 26 32 20 22 Z" fill="#fde047" />
              </svg>
            ))}
          </div>
        </>
      )}
      {house.id === "noctis" && (
        <>
          <div className="absolute right-[12%] top-[8%] aspect-square w-[16%] rounded-full" style={{ boxShadow: "inset -10px 4px 0 0 #ecfdf5", filter: "drop-shadow(0 0 14px rgba(167,243,208,0.7))" }} />
          {FIREFLIES.map((f, i) => (
            <span
              key={i}
              className="cg-anim-twinkle absolute h-1.5 w-1.5 rounded-full bg-lime-300"
              style={{ left: `${f.left}%`, top: `${f.top}%`, boxShadow: "0 0 8px #bef264", animationDelay: `${f.delay}s` }}
            />
          ))}
          <Fog tint="rgba(167,243,208,0.25)" />
        </>
      )}
      {house.id === "flavus" && (
        <>
          <Rays color="rgba(254,240,138,0.5)" />
          {CLOUDS.map((c, i) => (
            <div
              key={i}
              className="cg-anim-walk absolute h-[10%] rounded-full bg-white/70 blur-[2px]"
              style={{ top: `${c.top}%`, width: `${c.width}%`, "--cg-duration": `${c.duration}s`, "--cg-delay": `${c.delay}s` } as React.CSSProperties}
            />
          ))}
        </>
      )}
      {house.id === "sapientia" && (
        <>
          <Stars />
          {GLYPHS.map(([text, left, top, delay]) => (
            <span
              key={text}
              className="cg-anim-float absolute font-mono text-sm font-bold text-blue-200/80 sm:text-base"
              style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${delay}s`, textShadow: "0 0 10px #60a5fa" }}
            >
              {text}
            </span>
          ))}
        </>
      )}

      <div className="absolute inset-[12%] flex items-center justify-center">
        <div className="cg-anim-float w-full">
          <Animal className="w-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)]" />
        </div>
      </div>

      <div className="cg-anim-float absolute bottom-[3%] right-[3%] w-[26%]" style={{ animationDelay: "1.2s" }}>
        <Crest house={house} size={160} />
      </div>
    </div>
  );
}
