"use client";

import { wornAvatar } from "@/engine/students";
import { getEvent } from "@/engine/specialEvents";
import Avatar from "../Avatar";
import WizardDanilo from "../WizardDanilo";
import { Castle, Confetti, Fog, Lightning, Rays, RewardShowcase, Stage, Stars } from "./common";
import type { EventArtProps } from "./registry";

// ============================================================================
// ARTE DO EVENTO INVASÃO ALIENÍGENA — a frota de discos voadores de Bugzar
// sobre o castelo, o Imperador Zorg, o raio trator abduzindo alunos (e
// "recortando" o que eles aprenderam), os Cristais de Energia e o Escudo
// Arcano. Mesmo esquema dos outros eventos: cada cena ocupa o pai inteiro.
// ============================================================================

const SKIES = {
  espaco:
    "radial-gradient(45% 40% at 22% 30%, rgba(192,38,211,0.35), transparent 70%), radial-gradient(50% 45% at 80% 18%, rgba(34,211,238,0.3), transparent 70%), linear-gradient(180deg, #020617 0%, #1e1b4b 55%, #0f172a 100%)",
  invasao: "radial-gradient(70% 55% at 50% 25%, rgba(74,222,128,0.3), transparent 70%), linear-gradient(180deg, #030712 0%, #312e81 55%, #0c0a09 100%)",
  observatorio: "radial-gradient(60% 50% at 50% 35%, rgba(99,102,241,0.25), transparent 70%), linear-gradient(180deg, #1c1917 0%, #292524 100%)",
  escudo: "radial-gradient(60% 55% at 50% 42%, rgba(34,211,238,0.5), transparent 70%), linear-gradient(180deg, #0c4a6e 0%, #1e1b4b 60%, #020617 100%)",
} as const;

function Sky({ variant, stars = true }: { variant: keyof typeof SKIES; stars?: boolean }) {
  return (
    <div className="absolute inset-0" style={{ background: SKIES[variant] }}>
      {stars && <Stars />}
    </div>
  );
}

/** Planeta com anéis no fundo do céu (Bugzar, lá longe). */
function RingedPlanet({ className = "left-[8%] top-[10%] w-[12%]" }: { className?: string }) {
  return (
    <div className={`absolute aspect-square min-w-[56px] max-w-[160px] ${className}`}>
      <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 35% 30%, #f5d0fe 0%, #c026d3 45%, #581c87 100%)", boxShadow: "0 0 40px 8px rgba(192,38,211,0.35)" }} />
      <div className="absolute left-[-35%] top-[38%] h-[24%] w-[170%] -rotate-12 rounded-[50%] border-4 border-fuchsia-200/70" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Personagens e objetos
// ---------------------------------------------------------------------------

/** Disco voador com um alienzinho na cúpula e luzes piscando em volta. */
function Saucer({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 120 60" className={`overflow-visible ${className}`} style={style} aria-hidden="true">
      <ellipse cx="60" cy="24" rx="20" ry="17" fill="#a5f3fc" opacity="0.85" />
      <ellipse cx="60" cy="26" rx="7" ry="8.5" fill="#4ade80" />
      <ellipse cx="57" cy="25" rx="2.4" ry="1.4" fill="#0b0b10" transform="rotate(25 57 25)" />
      <ellipse cx="63" cy="25" rx="2.4" ry="1.4" fill="#0b0b10" transform="rotate(-25 63 25)" />
      <ellipse cx="53" cy="16" rx="5" ry="3" fill="#fff" opacity="0.6" />
      <ellipse cx="60" cy="36" rx="56" ry="13" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
      <ellipse cx="60" cy="33" rx="48" ry="6" fill="#cbd5e1" />
      {[14, 32, 50, 70, 88, 106].map((x, i) => (
        <circle key={x} cx={x} cy={i === 0 || i === 5 ? 38 : 42} r="3" fill={["#f87171", "#fde047", "#4ade80"][i % 3]} className="cg-anim-eye" style={{ animationDelay: `${i * 0.2}s` }} />
      ))}
      <ellipse cx="60" cy="47" rx="18" ry="4" fill="#64748b" />
    </svg>
  );
}

/** Raio trator saindo de baixo de um disco (cone de luz verde piscando). */
function TractorBeam({ className = "" }: { className?: string }) {
  return (
    <div
      className={`cg-anim-beam pointer-events-none absolute ${className}`}
      style={{ clipPath: "polygon(38% 0, 62% 0, 100% 100%, 0 100%)", background: "linear-gradient(180deg, rgba(190,242,100,0.65), rgba(190,242,100,0.06))" }}
    />
  );
}

/** Aluno sendo abduzido (ou voltando), flutuando de braços pra cima. */
function FloatingStudent({ shirt = "#6366f1", className = "", style }: { shirt?: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 40 60" className={`overflow-visible ${className}`} style={style} aria-hidden="true">
      <path d="M11 22 L3 6 M29 22 L37 6" stroke="#f1c27d" strokeWidth="4" strokeLinecap="round" />
      <rect x="12" y="20" width="16" height="20" rx="4" fill={shirt} />
      <path d="M15 40 L13 56 M25 40 L27 56" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
      <circle cx="20" cy="13" r="8" fill="#f1c27d" />
      <path d="M12 11 C13 4 27 4 28 11 C24 8 16 8 12 11 Z" fill="#3b2417" />
      <ellipse cx="20" cy="17" rx="2" ry="2.5" fill="#1c1917" />
    </svg>
  );
}

/** O vilão: alienígena de cabeça enorme, olhos pretos gigantes, coroa flutuando, capa e cetro de raio. */
export function EmperorZorg({ talking = false, className = "" }: { talking?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 240 290" className={`overflow-visible ${className}`} aria-hidden="true">
      {/* capa e manto */}
      <path d="M26 290 C36 200 64 164 120 156 C176 164 204 200 214 290 Z" fill="#581c87" />
      <path d="M26 290 C36 200 64 164 120 156 C176 164 204 200 214 290" stroke="#fbbf24" strokeWidth="3" fill="none" />
      <path d="M78 290 C80 222 96 182 120 176 C144 182 160 222 162 290 Z" fill="#1e1b4b" />
      <path d="M120 200 L128 214 L120 228 L112 214 Z" fill="#fbbf24" />
      <circle cx="120" cy="214" r="3" fill="#22d3ee" />
      {/* gola alta dourada */}
      <path d="M66 180 L56 146 L94 168 L120 150 L146 168 L184 146 L174 180 C150 170 90 170 66 180 Z" fill="#fbbf24" stroke="#a16207" strokeWidth="2" strokeLinejoin="round" />
      {/* braço esquerdo erguido com energia rosa */}
      <path d="M72 186 C56 176 44 162 38 148" stroke="#581c87" strokeWidth="16" fill="none" strokeLinecap="round" />
      <path d="M38 146 L30 132 M38 146 L40 130 M38 146 L48 134" stroke="#4ade80" strokeWidth="5" strokeLinecap="round" />
      <circle cx="38" cy="122" r="12" fill="#f0abfc" opacity="0.35" className="cg-anim-orb" />
      {/* cetro de raio */}
      <line x1="200" y1="140" x2="212" y2="284" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
      <circle cx="198" cy="126" r="24" fill="#e879f9" opacity="0.3" className="cg-anim-orb" />
      <circle cx="198" cy="126" r="12" fill="#f0abfc" stroke="#c026d3" strokeWidth="3" />
      <circle cx="194" cy="122" r="3" fill="#fff" opacity="0.8" />
      <path d="M186 140 L210 140" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      <path d="M204 188 L196 180 M204 188 L204 176 M204 188 L212 180" stroke="#4ade80" strokeWidth="5" strokeLinecap="round" />
      {/* pescoço fininho e cabeça enorme */}
      <rect x="112" y="136" width="16" height="22" fill="#22c55e" />
      <path d="M120 22 C170 22 192 56 188 90 C184 122 152 146 120 150 C88 146 56 122 52 90 C48 56 70 22 120 22 Z" fill="#4ade80" />
      <path d="M120 22 C150 22 170 36 180 58 C160 40 140 34 120 34 C100 34 80 40 60 58 C70 36 90 22 120 22 Z" fill="#86efac" opacity="0.6" />
      {/* antenas com bolinhas brilhando */}
      <path d="M92 30 C86 18 80 10 72 6 M148 30 C154 18 160 10 168 6" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="70" cy="5" r="6" fill="#f0abfc" className="cg-anim-orb" />
      <circle cx="170" cy="5" r="6" fill="#f0abfc" className="cg-anim-orb" />
      {/* coroa flutuando */}
      <g className="cg-anim-float">
        <path d="M94 16 L98 -6 L110 6 L120 -12 L130 6 L142 -6 L146 16 C132 12 108 12 94 16 Z" fill="#fbbf24" stroke="#a16207" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="120" cy="6" r="4" fill="#22d3ee" />
      </g>
      {/* olhos enormes e puxados */}
      <ellipse cx="94" cy="92" rx="24" ry="13" fill="#0b0b10" transform="rotate(28 94 92)" />
      <ellipse cx="146" cy="92" rx="24" ry="13" fill="#0b0b10" transform="rotate(-28 146 92)" />
      <ellipse cx="88" cy="85" rx="7" ry="3.5" fill="#fff" opacity="0.75" transform="rotate(28 88 85)" />
      <ellipse cx="140" cy="85" rx="7" ry="3.5" fill="#fff" opacity="0.75" transform="rotate(-28 140 85)" />
      <circle cx="103" cy="100" r="2" fill="#a5f3fc" />
      <circle cx="155" cy="100" r="2" fill="#a5f3fc" />
      {/* boca */}
      {talking ? <ellipse cx="120" cy="130" rx="8" ry="5" fill="#14532d" /> : <path d="M110 129 Q120 133 130 129" stroke="#14532d" strokeWidth="2.5" fill="none" strokeLinecap="round" />}
    </svg>
  );
}

/** O Imperador depois do próprio Ctrl+X: um alienzinho de coroa torta, bem fofo. */
function MiniZorg({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 66" className={`overflow-visible ${className}`} aria-hidden="true">
      <path d="M18 66 C18 54 24 48 30 48 C36 48 42 54 42 66 Z" fill="#581c87" />
      <path d="M22 16 L16 6 M38 16 L44 6" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="5" r="3" fill="#f0abfc" />
      <circle cx="44" cy="5" r="3" fill="#f0abfc" />
      <path d="M30 12 C46 12 52 24 50 34 C48 44 40 50 30 50 C20 50 12 44 10 34 C8 24 14 12 30 12 Z" fill="#4ade80" />
      <path d="M34 14 L36 4 L41 9 L45 3 L46 14 Z" fill="#fbbf24" stroke="#a16207" strokeWidth="0.8" transform="rotate(14 40 10)" />
      <ellipse cx="22" cy="31" rx="6" ry="4" fill="#0b0b10" transform="rotate(25 22 31)" />
      <ellipse cx="38" cy="31" rx="6" ry="4" fill="#0b0b10" transform="rotate(-25 38 31)" />
      <circle cx="20" cy="29" r="1.4" fill="#fff" />
      <circle cx="36" cy="29" r="1.4" fill="#fff" />
      <path d="M25 41 Q30 45 35 41" stroke="#14532d" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="15" cy="39" rx="3" ry="2" fill="#fb7185" opacity="0.5" />
      <ellipse cx="45" cy="39" rx="3" ry="2" fill="#fb7185" opacity="0.5" />
    </svg>
  );
}

/** Cristal de Energia do Escudo Arcano: apagado (pedra cinza) ou carregado (azul brilhando). `delay` = quando ele carrega. */
export function EnergyCrystal({ lit, delay = 0, className = "" }: { lit: boolean; delay?: number; className?: string }) {
  const charge = { "--cg-delay": `${delay}s` } as React.CSSProperties;
  return (
    <svg viewBox="0 0 60 100" className={`overflow-visible ${className}`} aria-hidden="true">
      {lit && <circle cx="30" cy="42" r="30" fill="#22d3ee" opacity="0.35" className="cg-anim-light-up" style={{ ...charge, filter: "blur(7px)" }} />}
      <polygon points="30,6 46,26 42,72 18,72 14,26" fill="#1e293b" stroke="#475569" strokeWidth="1.5" strokeLinejoin="round" />
      <polygon points="30,6 30,72 18,72 14,26" fill="#334155" opacity="0.8" />
      {lit && (
        <g className="cg-anim-light-up" style={charge}>
          <polygon points="30,6 46,26 42,72 18,72 14,26" fill="#22d3ee" stroke="#a5f3fc" strokeWidth="1.5" strokeLinejoin="round" />
          <polygon points="30,6 30,72 18,72 14,26" fill="#67e8f9" />
          <path d="M22 26 L26 20 M22 36 L24 32" stroke="#ecfeff" strokeWidth="2" strokeLinecap="round" />
          <circle cx="36" cy="18" r="2" fill="#fff" className="cg-anim-twinkle" />
        </g>
      )}
      <path d="M10 72 L50 72 L54 86 L6 86 Z" fill="#475569" />
      <rect x="4" y="86" width="52" height="8" rx="2" fill="#334155" />
      <path d="M14 78 L46 78" stroke={lit ? "#22d3ee" : "#64748b"} strokeWidth="2" opacity="0.8" />
    </svg>
  );
}

/** Cúpula do Escudo Arcano subindo sobre o castelo. */
function ShieldDome() {
  return (
    // A camada de fora centraliza (translate); a de dentro anima. Se fosse a mesma, o transform da animação apagaria o centro.
    <div className="pointer-events-none absolute bottom-0 left-1/2 aspect-[2/1] h-full -translate-x-1/2">
      <div
        className="cg-anim-moon-rise h-full w-full rounded-t-full border-4 border-cyan-300/80"
        style={{
          background:
            "repeating-linear-gradient(60deg, rgba(165,243,252,0.14) 0 2px, transparent 2px 26px), repeating-linear-gradient(-60deg, rgba(165,243,252,0.14) 0 2px, transparent 2px 26px), radial-gradient(ellipse at 50% 100%, rgba(34,211,238,0.35), rgba(34,211,238,0.08) 70%)",
          boxShadow: "0 0 60px 10px rgba(34,211,238,0.45), inset 0 0 60px rgba(165,243,252,0.35)",
        }}
      />
    </div>
  );
}

// Frota: [esquerda %, topo %, largura %, atraso da chegada (s)].
const FLEET: [number, number, number, number][] = [
  [8, 14, 13, 0],
  [34, 6, 9, 0.4],
  [58, 16, 15, 0.2],
  [80, 8, 10, 0.7],
  [20, 32, 8, 1],
  [70, 34, 7, 1.2],
];

function Fleet({ count = FLEET.length, arriving = false }: { count?: number; arriving?: boolean }) {
  return (
    <>
      {FLEET.slice(0, count).map(([left, top, width, delay], i) => (
        <div
          key={i}
          className={`absolute min-w-[44px] max-w-[170px] ${arriving ? "cg-anim-fly-in" : ""}`}
          style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, "--cg-delay": `${delay}s` } as React.CSSProperties}
        >
          <div className="cg-anim-hover" style={{ animationDelay: `${i * 0.5}s` }}>
            <Saucer className="w-full drop-shadow-[0_0_14px_rgba(165,243,252,0.5)]" />
          </div>
        </div>
      ))}
    </>
  );
}

// O que o feitiço de Ctrl+X está "recortando" da cabeça dos alunos abduzidos.
const STOLEN_CODE = ["for", "if / else", "function", "const", "return", "[ ]", "=>", "{ }"];

// ---------------------------------------------------------------------------
// Cenas
// ---------------------------------------------------------------------------

export default function AlienArt({ art, speaker, mouthOpen = false, student }: EventArtProps) {
  const talkingWizard = speaker === "mago" && mouthOpen;
  const talkingVillain = speaker === "vilao" && mouthOpen;

  switch (art) {
    // Primeira cena: a frota chega sobre o castelo.
    case "ceu":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="espaco" />
          <RingedPlanet className="left-[44%] top-[28%] w-[8%]" />
          <Fleet arriving />
          <Castle className="h-[58%]" scale={1} windowColor="#a5f3fc" />
          <Fog tint="rgba(165,243,252,0.2)" />
        </div>
      );

    // O Mago no observatório, com a frota na janela redonda.
    case "observatorio":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="observatorio" stars={false} />
          <div className="absolute left-1/2 top-[6%] aspect-square w-[46%] max-w-[520px] -translate-x-1/2 overflow-hidden rounded-full border-8 border-stone-600 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]" style={{ background: SKIES.espaco }}>
            <Stars />
            <RingedPlanet className="left-[12%] top-[14%] w-[18%]" />
            <Fleet count={4} />
            <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 bg-stone-600" />
            <div className="absolute inset-y-0 left-1/2 w-1.5 -translate-x-1/2 bg-stone-600" />
          </div>
          <Stage className="!justify-start pl-[10%]">
            <div className="relative h-[92%]">
              <div className="cg-anim-wizard-enter h-full">
                <div className="cg-anim-float h-full">
                  <WizardDanilo mouthOpen={talkingWizard} burstKey={0} className="h-full w-auto drop-shadow-[0_0_24px_rgba(139,92,246,0.55)]" />
                </div>
              </div>
            </div>
          </Stage>
        </div>
      );

    // O Imperador Zorg aparece entre tiros de laser.
    case "imperador":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="invasao" />
          <Fleet count={4} />
          <Lightning flash="bg-fuchsia-200" glow="#e879f9" />
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
            {[
              ["M12 20 L40 70", "#f0abfc", "0.2s"],
              ["M86 18 L62 72", "#4ade80", "1.1s"],
              ["M48 8 L30 60", "#f0abfc", "2.3s"],
            ].map(([d, color, delay]) => (
              <path key={d} d={d} stroke={color} strokeWidth="0.8" className="cg-anim-lightning" style={{ "--cg-delay": delay, filter: `drop-shadow(0 0 2px ${color})` } as React.CSSProperties} />
            ))}
          </svg>
          <Stage>
            <div className="cg-anim-reaper-rise h-full">
              <div className="cg-anim-float h-full">
                <EmperorZorg talking={talkingVillain} className="h-full w-auto drop-shadow-[0_0_40px_rgba(74,222,128,0.5)]" />
              </div>
            </div>
          </Stage>
          <Castle className="h-[26%]" windowColor="#a5f3fc" />
        </div>
      );

    // Abdução: raios tratores levando alunos e o código "recortado" subindo junto.
    case "abducao":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="invasao" />
          <div className="absolute inset-x-0 bottom-[34%] top-[4%] flex justify-center opacity-25">
            <EmperorZorg talking={talkingVillain} className="h-full w-auto blur-[1px]" />
          </div>
          {[
            [10, "#6366f1", 0],
            [60, "#f43f5e", 0.8],
          ].map(([left, shirt, delay]) => (
            <div key={left as number} className="absolute bottom-[30%] top-[8%] w-[30%]" style={{ left: `${left}%` }}>
              <TractorBeam className="inset-x-0 bottom-0 top-[14%]" />
              <div className="cg-anim-hover absolute inset-x-[18%] top-0" style={{ animationDelay: `${delay}s` }}>
                <Saucer className="w-full drop-shadow-[0_0_16px_rgba(190,242,100,0.6)]" />
              </div>
              <div className="cg-anim-float absolute bottom-[26%] inset-x-0 mx-auto w-[22%]" style={{ animationDelay: `${delay}s` }}>
                <FloatingStudent shirt={shirt as string} className="w-full" />
              </div>
              {STOLEN_CODE.slice(0, 4).map((word, i) => (
                <span
                  key={word}
                  className="cg-anim-rise-away absolute bottom-[10%] whitespace-nowrap rounded bg-black/60 px-1.5 font-mono text-[10px] text-lime-200 sm:text-xs"
                  style={{ left: `${20 + i * 17}%`, "--cg-delay": `${(delay as number) + i * 0.9}s` } as React.CSSProperties}
                >
                  {word}
                </span>
              ))}
            </div>
          ))}
          <Castle className="h-[30%]" windowColor="#a5f3fc" />
        </div>
      );

    // Os Cristais de Energia nos pedestais: o primeiro carrega pra mostrar como funciona.
    case "escudo":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="espaco" />
          <RingedPlanet className="right-[8%] top-[8%] w-[10%]" />
          <Castle className="h-[30%] opacity-70" windowColor="#a5f3fc" />
          <Stage className="!bottom-[34%] gap-[6%] px-[8%]">
            {[0, 1, 2, 3].map((i) => (
              <EnergyCrystal key={i} lit={i === 0} delay={1.3} className="h-[64%] w-auto" />
            ))}
          </Stage>
        </div>
      );

    // Chamado: o aluno de traje e capacete espacial, com o mago ao lado.
    case "chamado":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="espaco" />
          <Fleet count={3} />
          <Castle className="h-[30%] opacity-80" windowColor="#a5f3fc" />
          <Stage className="gap-[4%]">
            <div className="hidden h-[78%] sm:block">
              <WizardDanilo mouthOpen={talkingWizard} burstKey={1} className="h-full w-auto drop-shadow-[0_0_24px_rgba(139,92,246,0.55)]" />
            </div>
            <div className="relative flex flex-col items-center">
              <div className="pointer-events-none absolute bottom-0 left-1/2 aspect-square w-[260px]" style={{ transform: "translate(-50%, 45%) scaleY(0.28)" }}>
                <div className="cg-anim-spin-slow absolute inset-0 rounded-full border-2 border-dashed border-cyan-300/80 shadow-[0_0_40px_8px_rgba(34,211,238,0.5)]" />
                <div className="cg-anim-spin-reverse absolute inset-[14%] rounded-full border border-fuchsia-300/70" />
              </div>
              <div className="cg-anim-wizard-enter relative">
                <div className="absolute inset-0 rounded-full bg-cyan-500/50 blur-2xl" />
                <div className="cg-anim-float relative">
                  {student && <Avatar config={{ ...wornAvatar(student), outfit: "traje-espacial", hat: "capacete-espacial" }} ringColor="#22d3ee" size={170} />}
                </div>
              </div>
              {student && <p className="relative mt-3 rounded-full border border-cyan-400/60 bg-black/60 px-4 py-1 text-xs font-black uppercase tracking-widest text-cyan-200">✦ {student.name} ✦</p>}
            </div>
            <div className="hidden h-[60%] items-end gap-2 sm:flex">
              {[0, 1, 2, 3].map((i) => (
                <EnergyCrystal key={i} lit={false} className="h-[44%] w-auto opacity-80" />
              ))}
            </div>
          </Stage>
        </div>
      );

    // ---------------- final ----------------

    // Os cristais carregados e o escudo subindo sobre o castelo.
    case "cristais":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="escudo" />
          <Rays color="rgba(165,243,252,0.45)" />
          <Fleet count={4} />
          <Castle className="h-[34%]" windowColor="#a5f3fc" />
          <div className="absolute inset-x-0 bottom-0 h-[62%]">
            <ShieldDome />
          </div>
          <Stage className="!items-center gap-[6%] px-[8%]">
            {[0, 1, 2, 3].map((i) => (
              <EnergyCrystal key={i} lit delay={0.3 + i * 0.45} className="cg-anim-float h-[56%] w-auto" />
            ))}
          </Stage>
        </div>
      );

    // O Imperador é recortado pelo próprio Ctrl+X: gira, encolhe e sobra o mini Zorg.
    case "imperador-derrotado":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="invasao" />
          <Rays color="rgba(165,243,252,0.4)" />
          <Stage>
            <div className="relative flex h-full items-end justify-center">
              <div className="cg-anim-shrink-away h-full">
                <EmperorZorg talking={talkingVillain} className="h-full w-auto drop-shadow-[0_0_40px_rgba(74,222,128,0.5)]" />
              </div>
              <div className="cg-anim-poof pointer-events-none absolute bottom-[10%] inset-x-0 mx-auto aspect-square w-[60%] rounded-full bg-cyan-200/70 blur-2xl" />
              <div className="cg-anim-pop absolute bottom-[4%] inset-x-0 mx-auto w-[22%] min-w-[70px] max-w-[120px]" style={{ animationDelay: "3s" }}>
                <div className="cg-anim-float">
                  <MiniZorg className="w-full drop-shadow-[0_0_18px_rgba(74,222,128,0.7)]" />
                </div>
              </div>
            </div>
          </Stage>
          <Castle className="h-[26%]" windowColor="#a5f3fc" />
        </div>
      );

    // A frota foge, os alunos descem sãos e salvos e o dia amanhece; um discozinho fica pra trás.
    case "partida":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="espaco" />
          <div className="cg-anim-dawn absolute inset-0" style={{ background: "linear-gradient(180deg, #1e3a8a 0%, #818cf8 35%, #f9a8d4 65%, #fde68a 100%)" }} />
          {FLEET.slice(0, 4).map(([left, top, width], i) => (
            <div
              key={i}
              className="cg-anim-rise-away absolute min-w-[44px] max-w-[170px]"
              style={{ left: `${left}%`, top: `${top + 14}%`, width: `${width}%`, "--cg-delay": `${0.4 + i * 0.3}s` } as React.CSSProperties}
            >
              <Saucer className="w-full" />
            </div>
          ))}
          {[
            [16, "#6366f1"],
            [38, "#f43f5e"],
            [60, "#16a34a"],
            [80, "#f59e0b"],
          ].map(([left, shirt], i) => (
            <div
              key={left as number}
              className="cg-anim-descend absolute bottom-[34%] w-[6%] min-w-[30px] max-w-[64px]"
              style={{ left: `${left}%`, "--cg-delay": `${1.2 + i * 0.35}s` } as React.CSSProperties}
            >
              <FloatingStudent shirt={shirt as string} className="w-full" />
            </div>
          ))}
          <div className="cg-anim-hover absolute bottom-[36%] right-[4%] w-[8%] min-w-[40px] max-w-[90px]">
            <Saucer className="w-full" />
          </div>
          <Castle lit={false} fill="#1e1b4b" className="h-[40%]" />
        </div>
      );

    case "recompensa":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0" style={{ background: "radial-gradient(60% 55% at 50% 45%, rgba(165,243,252,0.55), transparent 70%), linear-gradient(180deg, #312e81 0%, #22d3ee 55%, #f0abfc 100%)" }} />
          <Rays color="rgba(236,254,255,0.55)" />
          <Confetti colors={["#22d3ee", "#a3e635", "#f0abfc", "#fde047", "#f8fafc"]} />
          <RewardShowcase event={getEvent("alien")!} avatar={student ? { ...wornAvatar(student), pet: "alien" } : null} ringColor="#22d3ee" />
        </div>
      );

    // Card do evento e banner: a frota sobre o castelo, um raio trator ligado e o Imperador espiando.
    case "poster":
    default:
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="espaco" />
          <RingedPlanet className="left-[36%] top-[8%] w-[9%]" />
          <div className="cg-anim-float absolute bottom-[14%] right-[4%] h-[80%]">
            <EmperorZorg className="h-full w-auto drop-shadow-[0_0_30px_rgba(74,222,128,0.45)]" />
          </div>
          <div className="absolute bottom-[20%] left-[6%] top-[4%] w-[22%]">
            <TractorBeam className="inset-x-0 bottom-0 top-[20%]" />
            <div className="cg-anim-hover absolute inset-x-[14%] top-0">
              <Saucer className="w-full drop-shadow-[0_0_16px_rgba(190,242,100,0.6)]" />
            </div>
            <div className="cg-anim-float absolute bottom-[20%] inset-x-0 mx-auto w-[20%]">
              <FloatingStudent className="w-full" />
            </div>
          </div>
          <div className="cg-anim-hover absolute left-[52%] top-[18%] w-[10%] min-w-[44px]" style={{ animationDelay: "0.8s" }}>
            <Saucer className="w-full" />
          </div>
          <Castle className="h-[52%]" windowColor="#a5f3fc" />
          <Fog tint="rgba(165,243,252,0.18)" />
        </div>
      );
  }
}
