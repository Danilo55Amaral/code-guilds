"use client";

import { wornAvatar } from "@/engine/students";
import { getEvent } from "@/engine/specialEvents";
import Avatar from "../Avatar";
import WizardDanilo from "../WizardDanilo";
import { Castle, Confetti, Fog, Lightning, Rays, RewardShowcase, Stage, Stars } from "./common";
import type { EventArtProps } from "./registry";

// ============================================================================
// ARTE DO EVENTO DE HALLOWEEN — cada cena da história ("noite", "rei",
// "lanternas"...) é montada em camadas: céu → lua → personagens → castelo →
// névoa. Tudo ocupa o elemento pai (absolute inset-0), então a mesma arte
// serve pra tela cheia da cena, pro card do evento e pro banner ("poster").
// As animações (cg-anim-*) ficam em globals.css.
// ============================================================================

const SKIES = {
  noite: "radial-gradient(55% 45% at 80% 16%, rgba(248,113,113,0.28), transparent 70%), linear-gradient(180deg, #05020d 0%, #1a0b2e 55%, #2a0f24 100%)",
  sangue: "radial-gradient(70% 60% at 50% 35%, rgba(220,38,38,0.5), transparent 70%), linear-gradient(180deg, #1a0205 0%, #3b0714 60%, #12030a 100%)",
  maldicao:
    "radial-gradient(55% 45% at 25% 40%, rgba(132,204,22,0.28), transparent 70%), radial-gradient(60% 60% at 78% 55%, rgba(126,34,206,0.5), transparent 70%), linear-gradient(180deg, #060212 0%, #1b0b33 60%, #0b1a0a 100%)",
  dourado: "radial-gradient(60% 55% at 50% 42%, rgba(251,191,36,0.55), transparent 70%), linear-gradient(180deg, #1e1034 0%, #4a1d4f 55%, #7c2d12 100%)",
  muralha:
    "radial-gradient(60% 50% at 50% 30%, rgba(251,146,60,0.18), transparent 70%), repeating-linear-gradient(0deg, transparent 0 46px, rgba(0,0,0,0.4) 46px 49px), repeating-linear-gradient(90deg, transparent 0 94px, rgba(0,0,0,0.3) 94px 97px), linear-gradient(180deg, #17121f 0%, #2a2238 100%)",
} as const;

function Sky({ variant, stars = true }: { variant: keyof typeof SKIES; stars?: boolean }) {
  return (
    <div className="absolute inset-0" style={{ background: SKIES[variant] }}>
      {stars && <Stars />}
    </div>
  );
}

function BloodMoon({ rising = false, className = "right-[9%] top-[8%] w-[15%]" }: { rising?: boolean; className?: string }) {
  return (
    <div
      className={`absolute aspect-square min-w-[64px] max-w-[190px] rounded-full ${rising ? "cg-anim-moon-rise" : ""} ${className}`}
      style={{
        background: "radial-gradient(circle at 36% 34%, #fee2e2 0%, #f87171 32%, #b91c1c 72%, #7f1d1d 100%)",
        boxShadow: "0 0 60px 18px rgba(239,68,68,0.45), 0 0 150px 50px rgba(239,68,68,0.18)",
      }}
    >
      <span className="absolute left-[22%] top-[30%] h-[16%] w-[16%] rounded-full bg-red-900/40" />
      <span className="absolute left-[58%] top-[54%] h-[11%] w-[11%] rounded-full bg-red-900/40" />
      <span className="absolute left-[46%] top-[20%] h-[8%] w-[8%] rounded-full bg-red-900/30" />
    </div>
  );
}

const BAT_PATH =
  "M0 0 C-2 -3 -5 -4 -8 -2 C-6 -1 -5.5 0.5 -6 2 C-4 1 -2.5 1.3 -1.5 2.5 C-0.8 1.6 0.8 1.6 1.5 2.5 C2.5 1.3 4 1 6 2 C5.5 0.5 6 -1 8 -2 C5 -4 2 -3 0 0 Z";

const BATS = [
  { top: 14, size: 38, duration: 9, delay: 0 },
  { top: 24, size: 24, duration: 12, delay: -4 },
  { top: 8, size: 28, duration: 10.5, delay: -7 },
  { top: 33, size: 18, duration: 14, delay: -2 },
  { top: 19, size: 32, duration: 8, delay: -5.5 },
  { top: 40, size: 22, duration: 11, delay: -9 },
];

/** Morcegos cruzando a tela batendo as asas. */
function Bats({ count = BATS.length }: { count?: number }) {
  return (
    <>
      {BATS.slice(0, count).map((b, i) => (
        <span
          key={i}
          className="cg-anim-bat pointer-events-none absolute"
          style={{ top: `${b.top}%`, width: b.size, "--cg-duration": `${b.duration}s`, "--cg-delay": `${b.delay}s` } as React.CSSProperties}
        >
          <svg viewBox="-9 -5 18 9" className="w-full overflow-visible" aria-hidden="true">
            <path className="cg-anim-flap" d={BAT_PATH} fill="#0b0712" stroke="#3b0764" strokeWidth="0.3" />
          </svg>
        </span>
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Personagens e objetos
// ---------------------------------------------------------------------------

/** O vilão: cabeça de abóbora com coroa, capa e o Cetro do Bug. `talking` abre a boca. */
export function PumpkinKing({ talking = false, className = "" }: { talking?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 240 280" className={`overflow-visible ${className}`} aria-hidden="true">
      {/* capa e corpo */}
      <path d="M28 280 C38 190 62 150 120 138 C178 150 202 190 212 280 Z" fill="#2e1065" />
      <path d="M48 280 C58 200 78 162 120 152 C162 162 182 200 192 280 Z" fill="#7f1d1d" />
      <path d="M78 280 C80 210 96 170 120 164 C144 170 160 210 162 280 Z" fill="#18181b" />
      <path d="M120 172 L120 280" stroke="#3f3f46" strokeWidth="2" />
      {[192, 216, 240].map((y) => (
        <circle key={y} cx="120" cy={y} r="3" fill="#fbbf24" />
      ))}
      {/* braço erguido soltando magia verde */}
      <path d="M72 176 C58 168 46 158 38 146" stroke="#2e1065" strokeWidth="16" fill="none" strokeLinecap="round" />
      <circle cx="36" cy="142" r="10" fill="#4d7c0f" />
      <circle cx="30" cy="124" r="12" fill="#a3e635" opacity="0.35" className="cg-anim-orb" />
      <circle cx="26" cy="112" r="2.4" fill="#d9f99d" className="cg-anim-twinkle" />
      <circle cx="40" cy="116" r="1.8" fill="#d9f99d" className="cg-anim-twinkle" style={{ animationDelay: "0.6s" }} />
      {/* cetro com o bug preso no orbe */}
      <line x1="200" y1="130" x2="214" y2="272" stroke="#3f3f46" strokeWidth="6" strokeLinecap="round" />
      <circle cx="198" cy="116" r="24" fill="#4ade80" opacity="0.3" className="cg-anim-orb" />
      <circle cx="198" cy="116" r="14" fill="#14532d" stroke="#4ade80" strokeWidth="2" />
      <ellipse cx="198" cy="118" rx="4.5" ry="6" fill="#4ade80" />
      <path d="M193.5 114 L189 111 M193.5 118 L188.5 118 M193.5 122 L189 125 M202.5 114 L207 111 M202.5 118 L207.5 118 M202.5 122 L207 125 M196 112 L194 107 M200 112 L202 107" stroke="#4ade80" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="206" cy="176" r="10" fill="#4d7c0f" />
      {/* gola de espinhos */}
      <path d="M62 170 L52 132 L90 156 L104 122 L120 150 L136 122 L150 156 L188 132 L178 170 C150 160 90 160 62 170 Z" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="2" strokeLinejoin="round" />
      {/* cabeça de abóbora */}
      <ellipse cx="120" cy="92" rx="74" ry="58" fill="#c2410c" />
      <ellipse cx="120" cy="92" rx="52" ry="58" fill="#ea580c" />
      <ellipse cx="120" cy="92" rx="26" ry="58" fill="#f97316" />
      <path d="M84 40 C74 70 74 114 84 146 M156 40 C166 70 166 114 156 146" stroke="#9a3412" strokeWidth="2" fill="none" opacity="0.6" />
      <path d="M114 38 C112 28 116 20 124 16 L128 22 C122 26 121 31 124 38 Z" fill="#3f6212" />
      {/* coroa */}
      <path d="M80 46 L84 12 L101 30 L120 2 L139 30 L156 12 L160 46 C140 40 100 40 80 46 Z" fill="#fbbf24" stroke="#a16207" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="120" cy="30" r="5" fill="#dc2626" />
      <circle cx="101" cy="38" r="3.5" fill="#7c3aed" />
      <circle cx="139" cy="38" r="3.5" fill="#16a34a" />
      {[
        [84, 12],
        [120, 2],
        [156, 12],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="3" fill="#fde68a" />
      ))}
      {/* rosto esculpido, com luz lá dentro */}
      <g className={talking ? undefined : "cg-anim-eye"} style={{ filter: "drop-shadow(0 0 7px #fde047)" }}>
        <path d="M76 84 L100 64 L106 94 Z" fill="#fde047" />
        <path d="M164 84 L140 64 L134 94 Z" fill="#fde047" />
        <path d="M114 101 L120 91 L126 101 Z" fill="#fde047" />
        <path
          d={
            talking
              ? "M74 106 L88 116 L96 108 L106 120 L120 108 L134 120 L144 108 L152 116 L166 106 C162 152 78 152 74 106 Z"
              : "M76 108 L88 118 L96 110 L106 122 L120 110 L134 122 L144 110 L152 118 L164 108 C156 138 84 138 76 108 Z"
          }
          fill="#fde047"
        />
      </g>
    </svg>
  );
}

/** Aboborinha: `evil` pula com a cara brava; sem `evil` é a versão fofa e derrotada do Rei. */
function Jack({ evil = true, crown = false, className = "", style }: { evil?: boolean; crown?: boolean; className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 60 58" className={`overflow-visible ${className}`} style={style} aria-hidden="true">
      <path d="M28 10 C27 5 30 2 34 1 L35 4 C32 5 31 7 32 10 Z" fill="#3f6212" />
      <ellipse cx="30" cy="34" rx="27" ry="22" fill="#c2410c" />
      <ellipse cx="30" cy="34" rx="18" ry="22" fill="#ea580c" />
      <ellipse cx="30" cy="34" rx="8" ry="22" fill="#f97316" />
      {crown && <path d="M18 16 L20 4 L25 11 L30 1 L35 11 L40 4 L42 16 Z" fill="#fbbf24" stroke="#a16207" strokeWidth="1" strokeLinejoin="round" />}
      {evil ? (
        <g fill="#fde047" style={{ filter: "drop-shadow(0 0 3px #fde047)" }}>
          <path d="M14 30 L24 24 L24 34 Z M46 30 L36 24 L36 34 Z" />
          <path d="M14 40 L20 44 L25 40 L30 45 L35 40 L40 44 L46 40 C42 52 18 52 14 40 Z" />
        </g>
      ) : (
        <g>
          <ellipse cx="21" cy="31" rx="3" ry="4" fill="#431407" />
          <ellipse cx="39" cy="31" rx="3" ry="4" fill="#431407" />
          <circle cx="22" cy="29.5" r="1" fill="#fff" />
          <circle cx="40" cy="29.5" r="1" fill="#fff" />
          <path d="M23 41 Q30 47 37 41" stroke="#431407" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <ellipse cx="15" cy="39" rx="3.5" ry="2.2" fill="#fb7185" opacity="0.55" />
          <ellipse cx="45" cy="39" rx="3.5" ry="2.2" fill="#fb7185" opacity="0.55" />
        </g>
      )}
    </svg>
  );
}

/** Fantasminha com a etiqueta do "valor" dele. `happy` = já ganhou um valor e está em paz. */
function Ghost({ label, happy = false, className = "", style }: { label: string; happy?: boolean; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`absolute flex flex-col items-center ${className}`} style={style}>
      <svg viewBox="0 0 60 70" className="w-full overflow-visible" style={{ filter: `drop-shadow(0 0 10px ${happy ? "rgba(254,243,199,0.8)" : "rgba(190,242,100,0.6)"})` }} aria-hidden="true">
        <path d="M30 4 C14 4 6 16 6 32 L6 62 L14 55 L22 64 L30 56 L38 64 L46 55 L54 62 L54 32 C54 16 46 4 30 4 Z" fill="#f1f5f9" opacity="0.93" />
        <ellipse cx="22" cy="28" rx="3.5" ry="5" fill="#1e1b4b" />
        <ellipse cx="38" cy="28" rx="3.5" ry="5" fill="#1e1b4b" />
        {happy ? (
          <path d="M22 40 Q30 48 38 40" stroke="#1e1b4b" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        ) : (
          <ellipse cx="30" cy="43" rx="4" ry="5.5" fill="#1e1b4b" />
        )}
      </svg>
      <span className={`mt-1 whitespace-nowrap rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] sm:text-xs ${happy ? "text-amber-200" : "text-lime-300"}`}>{label}</span>
    </div>
  );
}

/** Lanterna Sagrada: apagada (vidro escuro) ou acesa (chama tremendo e brilho). `delay` = quando ela acende. */
export function Lantern({ lit, delay = 0, className = "" }: { lit: boolean; delay?: number; className?: string }) {
  const lightUp = { "--cg-delay": `${delay}s` } as React.CSSProperties;
  return (
    <svg viewBox="0 0 60 100" className={`overflow-visible ${className}`} aria-hidden="true">
      {lit && <circle cx="30" cy="58" r="30" fill="#fbbf24" opacity="0.3" className="cg-anim-light-up" style={{ ...lightUp, filter: "blur(6px)" }} />}
      <circle cx="30" cy="7" r="5.5" fill="none" stroke="#71717a" strokeWidth="2.5" />
      <path d="M14 28 L22 15 L38 15 L46 28 Z" fill="#3f3f46" />
      <rect x="11" y="27" width="38" height="6" rx="2" fill="#27272a" />
      <rect x="15" y="33" width="30" height="45" rx="4" fill="#1e1b2e" stroke="#52525b" strokeWidth="1.5" />
      {lit && (
        <g className="cg-anim-light-up" style={lightUp}>
          <rect x="15" y="33" width="30" height="45" rx="4" fill="#fde68a" opacity="0.85" />
          <g className="cg-anim-flicker">
            <path d="M30 42 C22 52 23 64 30 70 C37 64 38 52 30 42 Z" fill="#f97316" />
            <path d="M30 51 C26 57 27 65 30 68 C33 65 34 57 30 51 Z" fill="#fef9c3" />
          </g>
        </g>
      )}
      <path d="M30 33 L30 78 M15 55 L45 55" stroke="#52525b" strokeWidth="1.5" opacity="0.8" />
      <path d="M11 78 L49 78 L44 88 L16 88 Z" fill="#27272a" />
    </svg>
  );
}

// Mensagens de erro "assombrando" a cena da maldição: [texto, posição].
const CURSED_ERRORS: [string, string][] = [
  ["TypeError: undefined is not a function", "left-[4%] top-[16%]"],
  ["ReferenceError: magia is not defined", "right-[5%] top-[30%]"],
  ["SyntaxError: Unexpected token", "left-[10%] top-[46%]"],
  ["NaN !== NaN", "right-[16%] top-[12%]"],
];

// ---------------------------------------------------------------------------
// Cenas
// ---------------------------------------------------------------------------

export default function HalloweenArt({ art, speaker, mouthOpen = false, student }: EventArtProps) {
  const talkingWizard = speaker === "mago" && mouthOpen;
  const talkingKing = speaker === "vilao" && mouthOpen;

  switch (art) {
    // Primeira cena: o castelo sob a lua vermelha.
    case "noite":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="noite" />
          <BloodMoon rising />
          <Bats />
          <Castle className="h-[58%]" scale={1} />
          <Fog />
        </div>
      );

    case "mago":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="noite" />
          <BloodMoon className="right-[8%] top-[6%] w-[11%] opacity-80" />
          <Bats count={3} />
          <Castle className="h-[34%] opacity-70" />
          <Stage>
            <div className="relative h-full">
              {/* círculo mágico girando no chão (achatado pra parecer deitado) */}
              <div className="pointer-events-none absolute bottom-[2%] left-1/2 aspect-square w-[130%]" style={{ transform: "translate(-50%, 50%) scaleY(0.25)" }}>
                <div className="cg-anim-spin-slow absolute inset-0 rounded-full border-2 border-dashed border-violet-300/70 shadow-[0_0_40px_6px_rgba(139,92,246,0.45)]" />
                <div className="cg-anim-spin-reverse absolute inset-[12%] rounded-full border border-orange-300/60" />
              </div>
              <div className="cg-anim-wizard-enter h-full">
                <div className="cg-anim-float h-full">
                  <WizardDanilo mouthOpen={talkingWizard} burstKey={0} className="h-full w-auto drop-shadow-[0_0_24px_rgba(139,92,246,0.55)]" />
                </div>
              </div>
            </div>
          </Stage>
          <Fog />
        </div>
      );

    // O vilão surge entre raios.
    case "rei":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="sangue" />
          <BloodMoon className="left-[7%] top-[9%] w-[18%] opacity-90" />
          <Lightning />
          <Bats />
          <Stage>
            <div className="cg-anim-reaper-rise h-full">
              <div className="cg-anim-float h-full">
                <PumpkinKing talking={talkingKing} className="h-full w-auto drop-shadow-[0_0_40px_rgba(249,115,22,0.6)]" />
              </div>
            </div>
          </Stage>
          <Castle className="h-[26%]" />
          <Fog tint="rgba(248,113,113,0.25)" />
        </div>
      );

    // A maldição: fantasmas de undefined, erros no ar e abóboras vivas.
    case "maldicao":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="maldicao" />
          <div className="absolute inset-x-0 bottom-[20%] top-[4%] flex justify-center opacity-30">
            <PumpkinKing talking={talkingKing} className="h-full w-auto blur-[1px]" />
          </div>
          {CURSED_ERRORS.map(([text, pos], i) => (
            <p key={text} className={`cg-anim-glitch absolute font-mono text-[10px] font-bold text-rose-400 sm:text-sm ${pos}`} style={{ animationDelay: `${i * 0.23}s`, textShadow: "0 0 8px rgba(244,63,94,0.8)" }}>
              {text}
            </p>
          ))}
          <Ghost label="undefined" className="cg-anim-ghost left-[12%] top-[24%] w-[11%] min-w-[54px] max-w-[110px]" />
          <Ghost label="null" className="cg-anim-ghost right-[14%] top-[40%] w-[9%] min-w-[46px] max-w-[92px]" style={{ animationDelay: "-1.4s" }} />
          <Ghost label="NaN" className="cg-anim-ghost left-[42%] top-[10%] w-[8%] min-w-[42px] max-w-[84px]" style={{ animationDelay: "-2.6s" }} />
          <Castle className="h-[30%]" />
          <div className="absolute inset-x-0 bottom-[30%] flex justify-around px-[8%] sm:bottom-[32%]">
            {[0, 0.4, 0.8, 0.2].map((d, i) => (
              <Jack key={i} className="cg-anim-hop w-[9%] min-w-[40px] max-w-[80px]" style={{ animationDelay: `${d}s` }} />
            ))}
          </div>
          <Fog tint="rgba(163,230,53,0.2)" />
        </div>
      );

    // As Lanternas Sagradas: apagadas; a primeira acende pra mostrar como funciona.
    case "lanternas":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="muralha" stars={false} />
          <div className="absolute inset-x-[6%] top-[13%] h-[3%] rounded-full" style={{ background: "linear-gradient(180deg, #78350f, #451a03)" }} />
          <Stage className="!items-start !top-[16%] gap-[5%] px-[6%]">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex h-[70%] flex-col items-center">
                <div className="h-[16%] w-0.5 bg-zinc-600" />
                <Lantern lit={i === 0} delay={1.3} className="h-[84%] w-auto" />
              </div>
            ))}
          </Stage>
          <Ghost label="undefined" className="cg-anim-ghost bottom-[36%] right-[4%] w-[8%] min-w-[40px] max-w-[80px] opacity-60" />
        </div>
      );

    // Chamado à aventura: o aluno no centro do círculo mágico, com o mago ao lado.
    case "chamado":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="noite" />
          <BloodMoon className="right-[10%] top-[7%] w-[12%]" />
          <Castle className="h-[30%] opacity-80" />
          <Stage className="gap-[4%]">
            <div className="hidden h-[78%] sm:block">
              <WizardDanilo mouthOpen={talkingWizard} burstKey={1} className="h-full w-auto drop-shadow-[0_0_24px_rgba(139,92,246,0.55)]" />
            </div>
            <div className="relative flex flex-col items-center">
              <div className="pointer-events-none absolute bottom-0 left-1/2 aspect-square w-[260px]" style={{ transform: "translate(-50%, 45%) scaleY(0.28)" }}>
                <div className="cg-anim-spin-slow absolute inset-0 rounded-full border-2 border-dashed border-orange-300/80 shadow-[0_0_40px_8px_rgba(249,115,22,0.5)]" />
                <div className="cg-anim-spin-reverse absolute inset-[14%] rounded-full border border-violet-300/70" />
              </div>
              <div className="cg-anim-wizard-enter relative">
                <div className="absolute inset-0 rounded-full bg-orange-500/50 blur-2xl" />
                <div className="cg-anim-float relative">{student && <Avatar config={wornAvatar(student)} ringColor="#f97316" size={170} />}</div>
              </div>
              {student && <p className="relative mt-3 rounded-full border border-orange-400/60 bg-black/60 px-4 py-1 text-xs font-black uppercase tracking-widest text-orange-200">✦ {student.name} ✦</p>}
            </div>
            <div className="hidden h-[60%] items-end gap-2 sm:flex">
              {[0, 1, 2, 3].map((i) => (
                <Lantern key={i} lit={false} className="h-[46%] w-auto opacity-80" />
              ))}
            </div>
          </Stage>
          <Fog tint="rgba(249,115,22,0.18)" />
        </div>
      );

    // ---------------- final ----------------

    case "lanternas-acesas":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="dourado" />
          <Rays />
          <Stage className="!items-center gap-[5%] px-[6%]">
            {[0, 1, 2, 3].map((i) => (
              <Lantern key={i} lit delay={0.3 + i * 0.45} className="cg-anim-float h-[62%] w-auto" />
            ))}
          </Stage>
          <Castle className="h-[30%]" />
        </div>
      );

    // O Rei gira, encolhe e some numa nuvem de fumaça; sobra a aboborinha fofa.
    case "rei-derrotado":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="maldicao" />
          <Rays />
          <Stage>
            <div className="relative flex h-full items-end justify-center">
              <div className="cg-anim-shrink-away h-full">
                <PumpkinKing talking={talkingKing} className="h-full w-auto drop-shadow-[0_0_40px_rgba(249,115,22,0.6)]" />
              </div>
              <div className="cg-anim-poof pointer-events-none absolute bottom-[10%] inset-x-0 mx-auto aspect-square w-[60%] rounded-full bg-slate-200/70 blur-2xl" />
              <div className="cg-anim-pop absolute bottom-[4%] inset-x-0 mx-auto w-[24%] min-w-[70px] max-w-[130px]" style={{ animationDelay: "3s" }}>
                <div className="cg-anim-float">
                  <Jack evil={false} crown className="w-full drop-shadow-[0_0_18px_rgba(251,191,36,0.7)]" />
                </div>
              </div>
            </div>
          </Stage>
          <Castle className="h-[26%]" />
        </div>
      );

    // O sol nasce, o céu clareia e os fantasmas sobem em paz.
    case "amanhecer":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="noite" />
          <div className="cg-anim-dawn absolute inset-0" style={{ background: "linear-gradient(180deg, #1e3a8a 0%, #7c3aed 30%, #f472b6 58%, #fdba74 80%, #fde68a 100%)" }} />
          <div className="absolute inset-x-0 bottom-[16%] flex justify-center">
            <div
              className="cg-anim-sun-rise aspect-square w-[34%] max-w-[360px] rounded-full"
              style={{ background: "radial-gradient(circle, #fef9c3 0%, #fde047 45%, #fb923c 100%)", boxShadow: "0 0 90px 30px rgba(253,224,71,0.55)" }}
            />
          </div>
          {[
            ["undefined → 42", "left-[12%]", 0.6],
            ["null → \"paz\"", "right-[14%]", 1.4],
            ["NaN → 7", "left-[46%]", 2.2],
          ].map(([label, pos, delay]) => (
            <div key={label as string} className={`cg-anim-rise-away absolute bottom-[34%] w-[9%] min-w-[46px] max-w-[92px] ${pos}`} style={{ "--cg-delay": `${delay}s` } as React.CSSProperties}>
              <Ghost label={label as string} happy className="relative w-full" />
            </div>
          ))}
          <Castle lit={false} fill="#1e1b4b" className="h-[58%]" scale={1} />
        </div>
      );

    // A recompensa: o aluno com o mascote novo, as recompensas e confete.
    case "recompensa":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0" style={{ background: "radial-gradient(60% 55% at 50% 45%, rgba(253,224,71,0.5), transparent 70%), linear-gradient(180deg, #7c3aed 0%, #f472b6 50%, #fdba74 100%)" }} />
          <Rays />
          <Confetti colors={["#f97316", "#fbbf24", "#a78bfa", "#4ade80", "#f8fafc"]} />
          <RewardShowcase event={getEvent("halloween")!} avatar={student ? { ...wornAvatar(student), pet: "abobora" } : null} />
        </div>
      );

    // Card do evento e banner: a noite de Halloween com o Rei espiando atrás do castelo.
    case "poster":
    default:
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="noite" />
          <BloodMoon className="right-[42%] top-[9%] w-[11%]" />
          <div className="cg-anim-float absolute bottom-[14%] right-[4%] h-[78%]">
            <PumpkinKing className="h-full w-auto drop-shadow-[0_0_30px_rgba(249,115,22,0.55)]" />
          </div>
          <Bats count={4} />
          <Castle className="h-[52%]" />
          <div className="absolute bottom-[4%] left-[6%] flex gap-3">
            <Jack className="cg-anim-hop w-10 sm:w-12" />
            <Jack className="cg-anim-hop w-8 sm:w-10" style={{ animationDelay: "0.5s" }} />
          </div>
          <Fog />
        </div>
      );
  }
}
