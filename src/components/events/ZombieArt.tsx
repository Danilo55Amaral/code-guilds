"use client";

import { wornAvatar } from "@/engine/students";
import { getEvent } from "@/engine/specialEvents";
import Avatar from "../Avatar";
import WizardDanilo from "../WizardDanilo";
import { Castle, Confetti, Fog, Lightning, Rays, RewardShowcase, Stage, Stars } from "./common";
import type { EventArtProps } from "./registry";

// ============================================================================
// ARTE DO EVENTO APOCALIPSE ZUMBI — o castelo sob um céu verde-ácido, com a
// sirene do laboratório girando, fita de quarentena, o Dr. Necrose, a horda
// de zumbis do Ctrl+C/Ctrl+V, os frascos do Antídoto Z e a chuva de cura.
// Mesmo esquema do Halloween: cada cena ocupa o elemento pai inteiro.
// ============================================================================

const SKIES = {
  toxico: "radial-gradient(60% 50% at 72% 18%, rgba(190,242,100,0.35), transparent 70%), linear-gradient(180deg, #06120a 0%, #14301a 50%, #1c1917 100%)",
  alerta: "radial-gradient(70% 60% at 50% 32%, rgba(220,38,38,0.35), transparent 70%), linear-gradient(180deg, #0a0f05 0%, #1a2e05 60%, #0c0a09 100%)",
  laboratorio:
    "radial-gradient(55% 45% at 50% 30%, rgba(163,230,53,0.22), transparent 70%), repeating-linear-gradient(0deg, transparent 0 58px, rgba(0,0,0,0.35) 58px 60px), repeating-linear-gradient(90deg, transparent 0 58px, rgba(0,0,0,0.35) 58px 60px), linear-gradient(180deg, #0f1a17 0%, #1e2b26 100%)",
  vitoria: "radial-gradient(60% 55% at 50% 42%, rgba(190,242,100,0.5), transparent 70%), linear-gradient(180deg, #052e16 0%, #166534 55%, #3f6212 100%)",
} as const;

function Sky({ variant, stars = true }: { variant: keyof typeof SKIES; stars?: boolean }) {
  return (
    <div className="absolute inset-0" style={{ background: SKIES[variant] }}>
      {stars && <Stars opacity={0.5} />}
    </div>
  );
}

function ToxicMoon({ className = "right-[10%] top-[8%] w-[14%]" }: { className?: string }) {
  return (
    <div
      className={`absolute aspect-square min-w-[60px] max-w-[180px] rounded-full ${className}`}
      style={{
        background: "radial-gradient(circle at 36% 34%, #f7fee7 0%, #bef264 35%, #65a30d 75%, #365314 100%)",
        boxShadow: "0 0 60px 18px rgba(163,230,53,0.4), 0 0 150px 50px rgba(163,230,53,0.15)",
      }}
    >
      <span className="absolute left-[24%] top-[32%] h-[15%] w-[15%] rounded-full bg-lime-900/40" />
      <span className="absolute left-[58%] top-[56%] h-[10%] w-[10%] rounded-full bg-lime-900/40" />
    </div>
  );
}

/** Sirene do laboratório no alto da torre esquerda do castelo (desenhada dentro do SVG do castelo). */
function Siren() {
  return (
    <g>
      <g className="cg-anim-siren">
        <path d="M445 120 L720 70 L720 170 Z M445 120 L170 70 L170 170 Z" fill="#ef4444" opacity="0.28" />
      </g>
      <circle cx="445" cy="120" r="30" fill="#ef4444" opacity="0.4" className="cg-anim-eye" />
      <path d="M433 130 L433 118 A12 12 0 0 1 457 118 L457 130 Z" fill="#dc2626" stroke="#fecaca" strokeWidth="1.5" />
      <rect x="428" y="130" width="34" height="7" rx="2" fill="#3f3f46" />
    </g>
  );
}

/** Clarão vermelho piscando na tela toda (alarme ligado). */
function AlarmWash() {
  return <div className="cg-anim-alarm pointer-events-none absolute inset-0 bg-red-600" style={{ mixBlendMode: "overlay" }} />;
}

/** Fita amarela de quarentena atravessando a cena. */
function QuarantineTape({ className = "top-[34%] -rotate-6" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute -left-[10%] w-[120%] overflow-hidden border-y-2 border-zinc-900 bg-yellow-400 py-0.5 shadow-lg shadow-black/40 ${className}`}>
      <p className="whitespace-nowrap text-[10px] font-black uppercase tracking-[0.25em] text-zinc-900 sm:text-xs">
        {"☣ Quarentena • Não ultrapasse • ".repeat(8)}
      </p>
    </div>
  );
}

// Esporos do vírus subindo: posição, tamanho e ritmo fixos.
const SPORES = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 41 + 7) % 100,
  size: 3 + (i % 3) * 2,
  delay: (i * 0.53) % 4,
  duration: 4 + (i % 4) * 1.2,
}));

function Spores() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {SPORES.map((s, i) => (
        <span
          key={i}
          className="cg-anim-sparkle absolute -bottom-2 rounded-full bg-lime-300"
          style={{ left: `${s.left}%`, width: s.size, height: s.size, boxShadow: `0 0 ${s.size * 2}px #a3e635`, "--cg-delay": `${s.delay}s`, "--cg-duration": `${s.duration}s` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Personagens e objetos
// ---------------------------------------------------------------------------

/** O vilão: cientista maluco de jaleco manchado, óculos de laboratório verdes e a seringa do Vírus Z. */
export function DrNecrose({ talking = false, className = "" }: { talking?: boolean; className?: string }) {
  const skin = "#c5d6a9";
  return (
    <svg viewBox="0 0 240 280" className={`overflow-visible ${className}`} aria-hidden="true">
      {/* jaleco */}
      <path d="M40 280 C46 200 70 160 120 150 C170 160 194 200 200 280 Z" fill="#e7e5e4" />
      <path d="M104 158 L120 200 L136 158 Z" fill="#1c1917" />
      <path d="M120 200 L104 280 M120 200 L136 280" stroke="#a8a29e" strokeWidth="2" />
      <path d="M40 280 L48 270 L56 280 L64 271 L72 280 M168 280 L176 271 L184 280 L192 270 L200 280" stroke="#a8a29e" strokeWidth="2" fill="none" />
      <rect x="64" y="222" width="24" height="18" rx="2" fill="#d6d3d1" />
      <path d="M70 222 L70 212 M76 222 L76 214" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="82" cy="252" rx="11" ry="6" fill="#84cc16" opacity="0.65" />
      <ellipse cx="160" cy="246" rx="8" ry="5" fill="#84cc16" opacity="0.65" />
      <ellipse cx="152" cy="206" rx="5" ry="4" fill="#84cc16" opacity="0.55" />
      {/* braço esquerdo gesticulando, com faíscas verdes */}
      <path d="M72 180 C54 172 42 160 34 146" stroke="#e7e5e4" strokeWidth="18" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="140" r="9" fill={skin} />
      <circle cx="24" cy="124" r="2.4" fill="#d9f99d" className="cg-anim-twinkle" />
      <circle cx="40" cy="120" r="1.8" fill="#d9f99d" className="cg-anim-twinkle" style={{ animationDelay: "0.6s" }} />
      {/* braço direito erguendo a seringa */}
      <path d="M168 180 C188 170 202 152 208 132" stroke="#e7e5e4" strokeWidth="18" fill="none" strokeLinecap="round" />
      <circle cx="210" cy="112" r="26" fill="#a3e635" opacity="0.3" className="cg-anim-orb" />
      <g transform="rotate(12 212 100)">
        <rect x="205" y="72" width="14" height="42" rx="3" fill="#ecfccb" stroke="#65a30d" strokeWidth="1.5" />
        <rect x="207" y="86" width="10" height="26" rx="2" fill="#84cc16" />
        <path d="M212 72 L212 50" stroke="#d4d4d8" strokeWidth="2" />
        <rect x="203" y="112" width="18" height="4" rx="1" fill="#52525b" />
        <path d="M212 116 L212 130" stroke="#52525b" strokeWidth="4" />
      </g>
      <circle cx="210" cy="128" r="9" fill={skin} />
      {/* pescoço e cabeça */}
      <rect x="110" y="130" width="20" height="24" fill={skin} />
      <ellipse cx="120" cy="100" rx="38" ry="42" fill={skin} />
      <path d="M92 116 L100 124 M94 122 L98 118" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
      {/* cabelo espetado e maluco */}
      <path
        d="M78 96 L64 70 L86 76 L78 46 L102 64 L106 34 L124 60 L140 32 L146 62 L168 44 L160 76 L180 70 L162 98 C150 78 90 78 78 96 Z"
        fill="#e5e7eb"
        stroke="#9ca3af"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* sobrancelhas bravas e óculos de laboratório brilhando */}
      <path d="M90 76 L114 83 M150 76 L126 83" stroke="#52525b" strokeWidth="4" strokeLinecap="round" />
      <path d="M82 94 L158 94" stroke="#3f3f46" strokeWidth="5" />
      <g style={{ filter: "drop-shadow(0 0 6px #a3e635)" }}>
        <circle cx="104" cy="96" r="13" fill="#84cc16" opacity="0.9" stroke="#3f3f46" strokeWidth="4" />
        <circle cx="136" cy="96" r="13" fill="#84cc16" opacity="0.9" stroke="#3f3f46" strokeWidth="4" />
      </g>
      <circle cx="105" cy="98" r="2.6" fill="#052e16" />
      <circle cx="135" cy="98" r="2.6" fill="#052e16" />
      <path d="M98 90 L102 88 M130 90 L134 88" stroke="#f7fee7" strokeWidth="2" strokeLinecap="round" />
      {/* sorriso maluco */}
      <path d={talking ? "M98 116 Q120 146 142 116 Q120 124 98 116 Z" : "M98 118 Q120 134 142 118 Q120 125 98 118 Z"} fill="#1c1917" />
      <path d={talking ? "M106 120 L110 126 L114 121 L118 127 L122 121 L126 127 L130 121 L134 126" : "M106 121 L110 125 L114 122 L118 126 L122 122 L126 126 L130 122 L134 125"} stroke="#f5f5f4" strokeWidth="2" fill="none" strokeLinejoin="round" />
    </svg>
  );
}

/** Zumbi do Ctrl+C/Ctrl+V andando de braços esticados; `cured` = voltou a ser aluno (pele normal e sorriso). */
function Walker({ shirt = "#475569", cured = false, className = "" }: { shirt?: string; cured?: boolean; className?: string }) {
  const skin = cured ? "#f1c27d" : "#9fb58a";
  return (
    <svg viewBox="-4 0 72 112" className={`overflow-visible ${className}`} aria-hidden="true">
      {/* pernas */}
      <rect x="19" y="72" width="9" height="36" rx="3" fill="#3f3f46" />
      <rect x="32" y="72" width="9" height="34" rx="3" fill="#27272a" transform="rotate(8 36 72)" />
      {/* camiseta rasgada */}
      <path d="M15 40 L45 40 L47 74 L43 70 L39 75 L35 70 L31 75 L27 70 L23 75 L19 70 L13 74 Z" fill={shirt} />
      {!cured && <path d="M22 50 L27 56 L24 62" stroke="#1c1917" strokeWidth="1.5" fill="none" opacity="0.6" />}
      {/* braços: esticados pra frente (zumbi) ou pra cima comemorando (curado) */}
      {cured ? (
        <g fill={skin}>
          <path d="M16 44 L4 22 L10 19 L22 42 Z" />
          <path d="M44 44 L56 22 L50 19 L38 42 Z" />
          <circle cx="6" cy="19" r="4.5" />
          <circle cx="54" cy="19" r="4.5" />
        </g>
      ) : (
        <g fill={skin}>
          <path d="M40 44 L66 40 L66 47 L42 52 Z" />
          <path d="M38 53 L63 51 L63 58 L40 60 Z" />
          <circle cx="67" cy="43.5" r="4.2" />
          <circle cx="64" cy="54.5" r="4" />
        </g>
      )}
      {/* cabeça */}
      <circle cx="30" cy="25" r="14" fill={skin} />
      <path d="M17 20 C18 10 42 8 44 20 C38 15 24 15 17 20 Z" fill="#3b2417" />
      {cured ? (
        <g>
          <circle cx="25" cy="26" r="1.8" fill="#1c1917" />
          <circle cx="35" cy="26" r="1.8" fill="#1c1917" />
          <path d="M24 32 Q30 37 36 32" stroke="#1c1917" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <circle cx="25" cy="25" r="3.6" fill="#f7fee7" />
          <circle cx="35" cy="26" r="3" fill="#f7fee7" />
          <circle cx="25.6" cy="25.6" r="1" fill="#44403c" />
          <circle cx="35" cy="26.4" r="0.9" fill="#44403c" />
          <ellipse cx="30" cy="34" rx="3.2" ry="2.4" fill="#1c1917" />
          <path d="M38 17 L42 23" stroke="#57534e" strokeWidth="1.2" />
        </g>
      )}
    </svg>
  );
}

/** Frasco do Antídoto Z: vazio (vidro escuro) ou cheio de líquido verde borbulhando. `delay` = quando ele enche. */
export function AntidoteVial({ lit, delay = 0, className = "" }: { lit: boolean; delay?: number; className?: string }) {
  const fill = { "--cg-delay": `${delay}s` } as React.CSSProperties;
  return (
    <svg viewBox="0 0 60 100" className={`overflow-visible ${className}`} aria-hidden="true">
      {lit && <circle cx="30" cy="70" r="30" fill="#a3e635" opacity="0.3" className="cg-anim-light-up" style={{ ...fill, filter: "blur(6px)" }} />}
      <rect x="22" y="5" width="16" height="9" rx="2" fill="#a16207" />
      <path d="M24 14 L24 38 L10 84 C8 90 12 95 18 95 L42 95 C48 95 52 90 50 84 L36 38 L36 14 Z" fill="#1e293b" fillOpacity="0.55" stroke="#94a3b8" strokeWidth="2" strokeLinejoin="round" />
      {lit && (
        <g className="cg-anim-light-up" style={fill}>
          <path d="M16.5 62 L43.5 62 L50 84 C52 90 48 95 42 95 L18 95 C12 95 8 90 10 84 Z" fill="#84cc16" />
          <path d="M16.5 62 L43.5 62" stroke="#d9f99d" strokeWidth="2" />
          {[
            [22, 86, 2, 0],
            [34, 80, 2.6, 0.5],
            [28, 90, 1.6, 1],
            [40, 88, 1.8, 0.3],
          ].map(([x, y, r, d]) => (
            <circle key={x} cx={x} cy={y} r={r} fill="#ecfccb" className="cg-anim-fizz" style={{ "--cg-delay": `${d}s` } as React.CSSProperties} />
          ))}
        </g>
      )}
      <path d="M27 20 L27 34" stroke="#f8fafc" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      <text x="30" y="82" textAnchor="middle" fontSize="12" fontWeight="bold" fontFamily="monospace" fill={lit ? "#1a2e05" : "#64748b"}>
        Z
      </text>
    </svg>
  );
}

/** O Dr. Necrose depois do final: um zumbizinho de bolso, bonzinho, com os óculos no alto da cabeça. */
function MiniNecrose({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 64" className={`overflow-visible ${className}`} aria-hidden="true">
      <path d="M16 64 C16 50 22 44 30 44 C38 44 44 50 44 64 Z" fill="#e7e5e4" />
      <circle cx="30" cy="28" r="18" fill="#9fb58a" />
      <path d="M13 26 L8 14 L18 18 L16 6 L26 14 L30 3 L34 14 L44 6 L42 18 L52 14 L47 26 C40 18 20 18 13 26 Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" strokeLinejoin="round" />
      <path d="M14 22 L46 22" stroke="#3f3f46" strokeWidth="3" />
      <circle cx="22" cy="21" r="5" fill="#84cc16" stroke="#3f3f46" strokeWidth="2" />
      <circle cx="38" cy="21" r="5" fill="#84cc16" stroke="#3f3f46" strokeWidth="2" />
      <circle cx="23" cy="31" r="2.4" fill="#1c1917" />
      <circle cx="37" cy="31" r="2.4" fill="#1c1917" />
      <circle cx="24" cy="30" r="0.8" fill="#fff" />
      <circle cx="38" cy="30" r="0.8" fill="#fff" />
      <path d="M24 38 Q30 43 36 38" stroke="#1c1917" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="17" cy="36" rx="3" ry="2" fill="#fb7185" opacity="0.5" />
      <ellipse cx="43" cy="36" rx="3" ry="2" fill="#fb7185" opacity="0.5" />
    </svg>
  );
}

/** Frascos e tubos numa prateleira do laboratório. */
function Shelf({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute flex items-end gap-[6%] border-b-4 border-amber-900 px-[4%] ${className}`}>
      {[
        ["#a3e635", 70],
        ["#f472b6", 55],
        ["#38bdf8", 80],
        ["#a3e635", 50],
        ["#fbbf24", 65],
      ].map(([color, h], i) => (
        <div key={i} className="relative w-[12%] rounded-b-lg rounded-t-sm border-2 border-slate-400/60 bg-slate-800/40" style={{ height: `${h}%` }}>
          <div className="absolute inset-x-0 bottom-0 h-1/2 rounded-b-md" style={{ background: color as string, boxShadow: `0 0 14px ${color}` }} />
        </div>
      ))}
    </div>
  );
}

// Zumbis da horda: [camiseta, fala, atraso da caminhada (s, negativo = já no meio), duração da travessia (s)].
const HORDE: [string, string, number, number][] = [
  ["#475569", "Ctrl+C...", 0, 22],
  ["#7c2d12", "Ctrl+V...", -5, 19],
  ["#1e3a8a", "cóóódigo...", -10, 24],
  ["#4d7c0f", "copiar... colar...", -15, 21],
  ["#6b21a8", "cééérebro... digo, código...", -19, 26],
];

// Gotas da chuva de antídoto: posição, atraso e velocidade fixos.
const RAIN = Array.from({ length: 34 }, (_, i) => ({
  left: (i * 29 + 5) % 100,
  delay: -((i * 0.37) % 2),
  duration: 1.3 + (i % 4) * 0.25,
}));

// ---------------------------------------------------------------------------
// Cenas
// ---------------------------------------------------------------------------

export default function ZombieArt({ art, speaker, mouthOpen = false, student }: EventArtProps) {
  const talkingWizard = speaker === "mago" && mouthOpen;
  const talkingVillain = speaker === "vilao" && mouthOpen;

  switch (art) {
    // Primeira cena: as sirenes tocam e a névoa verde toma o castelo.
    case "cidade":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="toxico" />
          <ToxicMoon />
          <Spores />
          <Castle className="h-[58%]" scale={1} windowColor="#a3e635">
            <Siren />
          </Castle>
          <AlarmWash />
          <QuarantineTape className="bottom-[34%] -rotate-3" />
          <Fog tint="rgba(163,230,53,0.35)" />
        </div>
      );

    case "laboratorio":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="laboratorio" stars={false} />
          <Shelf className="left-[4%] top-[12%] h-[16%] w-[34%]" />
          <Shelf className="right-[4%] top-[20%] h-[14%] w-[30%]" />
          <AlarmWash />
          {/* frasco quebrado no chão, soltando fumaça verde */}
          <div className="absolute bottom-[31%] right-[12%] h-[5%] w-[22%] rounded-[50%] bg-lime-400/60 blur-md" />
          <div className="absolute bottom-[32%] right-[18%] text-3xl sm:text-4xl">🧪</div>
          <Spores />
          <Stage>
            <div className="relative h-full">
              <div className="pointer-events-none absolute bottom-[2%] left-1/2 aspect-square w-[130%]" style={{ transform: "translate(-50%, 50%) scaleY(0.25)" }}>
                <div className="cg-anim-spin-slow absolute inset-0 rounded-full border-2 border-dashed border-violet-300/70 shadow-[0_0_40px_6px_rgba(139,92,246,0.45)]" />
                <div className="cg-anim-spin-reverse absolute inset-[12%] rounded-full border border-lime-300/60" />
              </div>
              <div className="cg-anim-wizard-enter h-full">
                <div className="cg-anim-float h-full">
                  <WizardDanilo mouthOpen={talkingWizard} burstKey={0} className="h-full w-auto drop-shadow-[0_0_24px_rgba(139,92,246,0.55)]" />
                </div>
              </div>
            </div>
          </Stage>
        </div>
      );

    // O vilão surge entre raios verdes.
    case "vilao":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="alerta" />
          <ToxicMoon className="left-[7%] top-[9%] w-[16%]" />
          <Lightning flash="bg-lime-200" glow="#a3e635" />
          <Spores />
          <Stage>
            <div className="cg-anim-reaper-rise h-full">
              <div className="cg-anim-float h-full">
                <DrNecrose talking={talkingVillain} className="h-full w-auto drop-shadow-[0_0_40px_rgba(163,230,53,0.55)]" />
              </div>
            </div>
          </Stage>
          <Castle className="h-[26%]" windowColor="#a3e635" />
          <Fog tint="rgba(163,230,53,0.3)" />
        </div>
      );

    // A horda de zumbis do Ctrl+C, Ctrl+V atravessando a tela.
    case "horda":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="toxico" />
          <ToxicMoon className="right-[12%] top-[7%] w-[12%]" />
          <div className="absolute inset-x-0 bottom-[34%] top-[6%] flex justify-center opacity-25">
            <DrNecrose talking={talkingVillain} className="h-full w-auto blur-[1px]" />
          </div>
          <Castle className="h-[34%]" windowColor="#a3e635" />
          {HORDE.map(([shirt, line, delay, duration], i) => (
            <div
              key={line}
              className="cg-anim-walk absolute flex w-[10%] min-w-[58px] max-w-[120px] flex-col items-center"
              style={{ bottom: `${31 + (i % 2) * 4}%`, "--cg-delay": `${delay}s`, "--cg-duration": `${duration}s` } as React.CSSProperties}
            >
              <span className="mb-1 whitespace-nowrap rounded-lg bg-black/70 px-1.5 py-0.5 font-mono text-[9px] text-lime-300 sm:text-[11px]">{line}</span>
              <div className="cg-anim-shamble w-full" style={{ animationDelay: `${i * 0.3}s` }}>
                <Walker shirt={shirt} className="w-full" />
              </div>
            </div>
          ))}
          <Fog tint="rgba(163,230,53,0.3)" />
        </div>
      );

    // Os frascos do antídoto na bancada: o primeiro enche pra mostrar como funciona.
    case "antidoto":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="laboratorio" stars={false} />
          <Shelf className="left-[6%] top-[8%] h-[12%] w-[30%] opacity-70" />
          <div className="absolute inset-x-[4%] bottom-[31%] h-[4%] rounded-md" style={{ background: "linear-gradient(180deg, #78350f, #451a03)" }} />
          <Stage className="!bottom-[35%] gap-[6%] px-[8%]">
            {[0, 1, 2, 3].map((i) => (
              <AntidoteVial key={i} lit={i === 0} delay={1.3} className="h-[62%] w-auto" />
            ))}
          </Stage>
        </div>
      );

    // Chamado: o aluno equipado pra sobreviver (máscara e capacete), com o mago ao lado.
    case "chamado":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="toxico" />
          <ToxicMoon className="right-[10%] top-[7%] w-[11%]" />
          <Castle className="h-[30%] opacity-80" windowColor="#a3e635" />
          <Stage className="gap-[4%]">
            <div className="hidden h-[78%] sm:block">
              <WizardDanilo mouthOpen={talkingWizard} burstKey={1} className="h-full w-auto drop-shadow-[0_0_24px_rgba(139,92,246,0.55)]" />
            </div>
            <div className="relative flex flex-col items-center">
              <div className="pointer-events-none absolute bottom-0 left-1/2 aspect-square w-[260px]" style={{ transform: "translate(-50%, 45%) scaleY(0.28)" }}>
                <div className="cg-anim-spin-slow absolute inset-0 rounded-full border-2 border-dashed border-lime-300/80 shadow-[0_0_40px_8px_rgba(163,230,53,0.5)]" />
                <div className="cg-anim-spin-reverse absolute inset-[14%] rounded-full border border-violet-300/70" />
              </div>
              <div className="cg-anim-wizard-enter relative">
                <div className="absolute inset-0 rounded-full bg-lime-500/50 blur-2xl" />
                <div className="cg-anim-float relative">
                  {student && <Avatar config={{ ...wornAvatar(student), eyewear: "mascara-gas", hat: "capacete-tatico" }} ringColor="#a3e635" size={170} />}
                </div>
              </div>
              {student && <p className="relative mt-3 rounded-full border border-lime-400/60 bg-black/60 px-4 py-1 text-xs font-black uppercase tracking-widest text-lime-200">✦ {student.name} ✦</p>}
            </div>
            <div className="hidden h-[60%] items-end gap-2 sm:flex">
              {[0, 1, 2, 3].map((i) => (
                <AntidoteVial key={i} lit={false} className="h-[44%] w-auto opacity-80" />
              ))}
            </div>
          </Stage>
          <Fog tint="rgba(163,230,53,0.25)" />
        </div>
      );

    // ---------------- final ----------------

    case "frascos-cheios":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="vitoria" />
          <Rays color="rgba(217,249,157,0.5)" />
          <Stage className="!items-center gap-[6%] px-[8%]">
            {[0, 1, 2, 3].map((i) => (
              <AntidoteVial key={i} lit delay={0.3 + i * 0.45} className="cg-anim-float h-[62%] w-auto" />
            ))}
          </Stage>
          <Castle className="h-[30%]" windowColor="#a3e635" />
        </div>
      );

    // O Dr. Necrose gira, encolhe numa nuvem verde e sobra o zumbizinho de bolso.
    case "vilao-derrotado":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="alerta" />
          <Rays color="rgba(217,249,157,0.45)" />
          <Stage>
            <div className="relative flex h-full items-end justify-center">
              <div className="cg-anim-shrink-away h-full">
                <DrNecrose talking={talkingVillain} className="h-full w-auto drop-shadow-[0_0_40px_rgba(163,230,53,0.55)]" />
              </div>
              <div className="cg-anim-poof pointer-events-none absolute bottom-[10%] inset-x-0 mx-auto aspect-square w-[60%] rounded-full bg-lime-300/70 blur-2xl" />
              <div className="cg-anim-pop absolute bottom-[4%] inset-x-0 mx-auto w-[22%] min-w-[70px] max-w-[120px]" style={{ animationDelay: "3s" }}>
                <div className="cg-anim-float">
                  <MiniNecrose className="w-full drop-shadow-[0_0_18px_rgba(163,230,53,0.7)]" />
                </div>
              </div>
            </div>
          </Stage>
          <Castle className="h-[26%]" windowColor="#a3e635" />
        </div>
      );

    // Chuva de antídoto: o céu clareia e os zumbis voltam a ser alunos.
    case "cura":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="toxico" />
          <div className="cg-anim-dawn absolute inset-0" style={{ background: "linear-gradient(180deg, #0ea5e9 0%, #7dd3fc 45%, #bbf7d0 80%, #fef9c3 100%)" }} />
          {RAIN.map((d, i) => (
            <span
              key={i}
              className="cg-anim-rain pointer-events-none absolute top-0 h-3 w-1 rounded-full bg-lime-300"
              style={{ left: `${d.left}%`, boxShadow: "0 0 6px #a3e635", "--cg-delay": `${d.delay}s`, "--cg-duration": `${d.duration}s` } as React.CSSProperties}
            />
          ))}
          <Castle lit={false} fill="#14532d" className="h-[40%]" />
          <div className="absolute inset-x-0 bottom-[31%] flex justify-around px-[6%]">
            {HORDE.slice(0, 4).map(([shirt], i) => (
              <div key={shirt} className="relative w-[11%] min-w-[54px] max-w-[110px]">
                <div className="cg-anim-fade-out" style={{ "--cg-delay": `${1.4 + i * 0.35}s` } as React.CSSProperties}>
                  <Walker shirt={shirt} className="w-full" />
                </div>
                <div className="cg-anim-light-up absolute inset-0" style={{ "--cg-delay": `${1.6 + i * 0.35}s` } as React.CSSProperties}>
                  <div className="cg-anim-hop" style={{ animationDelay: `${i * 0.25}s` }}>
                    <Walker shirt={shirt} cured className="w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "recompensa":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0" style={{ background: "radial-gradient(60% 55% at 50% 45%, rgba(217,249,157,0.55), transparent 70%), linear-gradient(180deg, #0ea5e9 0%, #4ade80 55%, #fde68a 100%)" }} />
          <Rays color="rgba(236,252,203,0.55)" />
          <Confetti colors={["#a3e635", "#facc15", "#38bdf8", "#f8fafc", "#4ade80"]} />
          <RewardShowcase event={getEvent("zumbi")!} avatar={student ? { ...wornAvatar(student), pet: "zumbi" } : null} ringColor="#a3e635" />
        </div>
      );

    // Card do evento e banner: o castelo com a sirene ligada, o Dr. Necrose espiando e zumbis por perto.
    case "poster":
    default:
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="toxico" />
          <ToxicMoon className="right-[42%] top-[9%] w-[10%]" />
          <div className="cg-anim-float absolute bottom-[14%] right-[4%] h-[78%]">
            <DrNecrose className="h-full w-auto drop-shadow-[0_0_30px_rgba(163,230,53,0.5)]" />
          </div>
          <Castle className="h-[52%]" windowColor="#a3e635">
            <Siren />
          </Castle>
          <div className="absolute bottom-[3%] left-[5%] flex items-end gap-2">
            {HORDE.slice(0, 3).map(([shirt], i) => (
              <div key={shirt} className="cg-anim-shamble w-10 sm:w-12" style={{ animationDelay: `${i * 0.4}s` }}>
                <Walker shirt={shirt} className="w-full" />
              </div>
            ))}
          </div>
          <Fog tint="rgba(163,230,53,0.3)" />
        </div>
      );
  }
}
