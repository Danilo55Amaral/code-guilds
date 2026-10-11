"use client";

import { AvatarConfig } from "@/engine/avatar";
import { wornAvatar } from "@/engine/students";
import { getEvent, getPhase } from "@/engine/specialEvents";
import Avatar from "../Avatar";
import WizardDanilo from "../WizardDanilo";
import { Castle, Confetti, Rays, RewardShowcase, Stage } from "./common";
import type { EventArtProps } from "./registry";
import Catarina, { type CatarinaPose } from "./astronomia/Catarina";
import Ton618, { type Ton618Mood } from "./astronomia/Ton618";
import { Cloud, Earth, EarthHorizon, MeteorShower, SpaceSky, SpacetimeHologram, Sparkle, WarpStreaks, Wormhole } from "./astronomia/space";
import { Cockpit, ISS, LumenSat, LumenSatBody, O2Tank, O2Timer, PhoneNoSignal, Radar, Rocket, ShipWithArm, SignalBars, Telescope, WifiGlyph } from "./astronomia/craft";
import { Hills, LaunchPad, Observatory } from "./astronomia/ground";

// ============================================================================
// ARTE DE ASTRONOMIA EM: SALVE O WI-FI — o evento criado a partir da ideia da
// aluna Catarina Vitória, que também é a protagonista. 3 fases:
// 1) Sem Sinal: a Terra sem internet, o observatório, a plataforma e a
//    decolagem do foguete Vitória-1;
// 2) Chuva de Meteoros: a órbita da Terra, os meteoros, a ISS, o oxigênio
//    contado e os satélites da Constelação Lúmen;
// 3) Além do Horizonte: o TON 618, o buraco de minhoca, o resgate da
//    Lúmen-Mãe e o Wi-Fi da Terra de volta.
// As peças ficam em components/events/astronomia/. Cada cena ocupa o pai
// inteiro, como nos outros eventos; o fundo vai chegando perto devagar.
// ============================================================================

// ---------------------------------------------------------------------------
// Ícones de progresso: sistema do foguete apagado → ligado (Fase 1), satélite
// Lúmen sem sinal → realinhado (Fase 2), anel do portal → estável (Fase 3)
// ---------------------------------------------------------------------------

function Pedestal() {
  return (
    <g>
      <path d="M18 84 L42 84 L46 94 L14 94 Z" fill="#334155" />
      <rect x="10" y="94" width="40" height="6" rx="2" fill="#1e293b" />
    </g>
  );
}

const lightUp = (delay: number) => ({ "--cg-delay": `${delay}s` }) as React.CSSProperties;

/** Fase 1: o botão de cada sistema do Vitória-1 (motores, navegação, suporte de vida). */
export function RocketSystemIcon({ lit, delay = 0, className = "", index = 0 }: { lit: boolean; delay?: number; className?: string; index?: number }) {
  const system = index % 3;
  const ink = lit ? "#bbf7d0" : "#6b7280";
  return (
    <svg viewBox="0 0 60 100" className={`overflow-visible ${className}`} aria-hidden="true">
      <Pedestal />
      <path d="M30 84 L30 74" stroke="#475569" strokeWidth="3" />
      <circle cx="30" cy="52" r="23" fill="#1e293b" stroke="#475569" strokeWidth="2" />
      <circle cx="30" cy="52" r="19" fill={lit ? "#052e16" : "#111827"} stroke={lit ? "#4ade80" : "#7f1d1d"} strokeWidth="2.5" />
      {lit && (
        <g className="cg-anim-light-up" style={lightUp(delay)}>
          <circle cx="30" cy="52" r="24" fill="#4ade80" opacity="0.3" style={{ filter: "blur(6px)" }} />
          <circle cx="30" cy="52" r="19" fill="none" stroke="#86efac" strokeWidth="2.5" style={{ filter: "drop-shadow(0 0 5px #4ade80)" }} />
        </g>
      )}
      {system === 0 && <path d="M30 40 C37 48 39 55 35 62 C34 58 32 56 31 53 C29 57 26 59 26 63 C21 56 23 47 30 40 Z" fill={ink} />}
      {system === 1 && (
        <g>
          <circle cx="30" cy="52" r="10" fill="none" stroke={ink} strokeWidth="1.8" />
          <path d="M30 42 L33 52 L27 52 Z" fill={lit ? "#f87171" : "#6b7280"} />
          <path d="M30 62 L33 52 L27 52 Z" fill={ink} />
        </g>
      )}
      {system === 2 && (
        <text x="30" y="57" textAnchor="middle" fontSize="14" fontWeight="900" fontFamily="sans-serif" fill={ink}>
          O₂
        </text>
      )}
      {!lit && <circle cx="44" cy="36" r="3" fill="#ef4444" className="cg-anim-aura-blink" style={{ "--cg-dur": "1s" } as React.CSSProperties} />}
    </svg>
  );
}

/** Fase 2: o satélite Lúmen (apagado e torto → realinhado, com o Wi-Fi saindo). */
export function LumenIcon({ lit, delay = 0, className = "" }: { lit: boolean; delay?: number; className?: string }) {
  return (
    <svg viewBox="0 0 60 100" className={`overflow-visible ${className}`} aria-hidden="true">
      <Pedestal />
      <path d="M30 84 L30 70" stroke="#475569" strokeWidth="3" />
      {lit ? (
        <g className="cg-anim-light-up" style={lightUp(delay)}>
          <circle cx="30" cy="50" r="24" fill="#22d3ee" opacity="0.25" style={{ filter: "blur(7px)" }} />
          <g transform="translate(2 36) scale(0.28)">
            <LumenSatBody on />
          </g>
        </g>
      ) : (
        <g transform="rotate(-24 30 52)">
          <g transform="translate(2 36) scale(0.28)">
            <LumenSatBody on={false} />
          </g>
        </g>
      )}
    </svg>
  );
}

/** Fase 3: um anel do buraco de minhoca (apagado → aceso e girando). */
export function PortalRingIcon({ lit, delay = 0, className = "" }: { lit: boolean; delay?: number; className?: string }) {
  return (
    <svg viewBox="0 0 60 100" className={`overflow-visible ${className}`} aria-hidden="true">
      <Pedestal />
      <path d="M30 84 L30 74" stroke="#475569" strokeWidth="3" />
      <circle cx="30" cy="50" r="20" fill="none" stroke="#312e81" strokeWidth="7" />
      <circle cx="30" cy="50" r="20" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="6 5" opacity="0.6" />
      {lit ? (
        <g className="cg-anim-light-up" style={lightUp(delay)}>
          <circle cx="30" cy="50" r="15" fill="#bae6fd" opacity="0.5" style={{ filter: "blur(5px)" }} />
          <circle cx="30" cy="50" r="20" fill="none" stroke="#38bdf8" strokeWidth="7" style={{ filter: "drop-shadow(0 0 6px #38bdf8)" }} />
          <circle cx="30" cy="50" r="20" fill="none" stroke="#f0f9ff" strokeWidth="2" strokeDasharray="14 10" className="cg-anim-aura-flow" style={{ "--cg-dur": "0.9s" } as React.CSSProperties} />
        </g>
      ) : (
        <circle cx="30" cy="30" r="3" fill="#f87171" className="cg-anim-aura-blink" style={{ "--cg-dur": "1.1s" } as React.CSSProperties} />
      )}
    </svg>
  );
}

/** O ícone de progresso de cada fase. */
export function AstronomiaProgress({ lit, delay, className, phase = 1 }: { lit: boolean; delay?: number; className?: string; phase?: number }) {
  // na Fase 1, cada ícone é um sistema diferente do foguete (pela posição, que vem no atraso)
  const index = Math.round((delay ?? 0) / 0.2);
  if (phase === 2) return <LumenIcon lit={lit} delay={delay} className={className} />;
  if (phase === 3) return <PortalRingIcon lit={lit} delay={delay} className={className} />;
  return <RocketSystemIcon lit={lit} delay={delay} className={className} index={index} />;
}

// ---------------------------------------------------------------------------
// Personagens e peças das cenas
// ---------------------------------------------------------------------------

/** Fundo que vai chegando bem devagar mais perto (zoom de cinema); os personagens ficam fora dele. */
function Backdrop({ children }: { children: React.ReactNode }) {
  return <div className="cg-anim-kenburns absolute inset-0">{children}</div>;
}

function Scene({ children }: { children: React.ReactNode }) {
  return <div className="absolute inset-0 overflow-hidden">{children}</div>;
}

// Brilhos em volta da Catarina: [left %, top %, tamanho px, atraso s]
const CATARINA_SPARKS: [number, number, number, number][] = [
  [-6, 14, 16, 0],
  [96, 22, 12, 0.7],
  [100, 58, 14, 1.4],
  [-10, 52, 10, 1.9],
  [48, -4, 12, 1.1],
];

/**
 * A Catarina Vitória em cena: entra com brilho, flutua de leve, tem o brilho
 * fúcsia atrás, as estrelinhas em volta e a plaquinha com o nome em cima da
 * cabeça (embaixo ela ficaria atrás do nome de quem fala, no balão).
 */
function CatarinaHero({
  talking,
  pose = "neutra",
  helmet = false,
  tag = true,
  className = "h-full",
}: {
  talking: boolean;
  pose?: CatarinaPose;
  helmet?: boolean;
  tag?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative shrink-0 ${className}`}>
      <div className="cg-anim-wizard-enter relative h-full">
        <div className="pointer-events-none absolute inset-x-[4%] bottom-[2%] top-[24%] rounded-full bg-fuchsia-500/35 blur-3xl" />
        <div className="cg-anim-float relative h-full">
          <Catarina mouthOpen={talking} pose={pose} helmet={helmet} className="h-full w-auto drop-shadow-[0_0_20px_rgba(217,70,239,0.5)]" />
        </div>
        {CATARINA_SPARKS.map(([left, top, size, delay], i) => (
          <Sparkle key={i} color="#f5d0fe" className="cg-anim-twinkle pointer-events-none absolute" style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, animationDelay: `${delay}s` }} />
        ))}
      </div>
      {tag && (
        <p className="cg-anim-pop absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full border border-fuchsia-300/70 bg-fuchsia-950/85 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-fuchsia-100 shadow-[0_0_18px_rgba(217,70,239,0.6)] sm:text-xs">
          ✦ Catarina Vitória ✦
        </p>
      )}
    </div>
  );
}

/** O aluno no centro do círculo, com o nome embaixo. */
function Hero({ student, avatar, ring = "#d946ef", size = 170 }: { student: EventArtProps["student"]; avatar?: Partial<AvatarConfig>; ring?: string; size?: number }) {
  if (!student) return null;
  return (
    <div className="relative flex shrink-0 flex-col items-center">
      <div className="pointer-events-none absolute bottom-0 left-1/2 aspect-square w-[260px]" style={{ transform: "translate(-50%, 45%) scaleY(0.28)" }}>
        <div className="cg-anim-spin-slow absolute inset-0 rounded-full border-2 border-dashed" style={{ borderColor: ring, boxShadow: `0 0 40px 8px ${ring}80` }} />
        <div className="cg-anim-spin-reverse absolute inset-[14%] rounded-full border border-cyan-200/60" />
      </div>
      <div className="cg-anim-wizard-enter relative">
        <div className="absolute inset-0 rounded-full blur-2xl" style={{ background: ring, opacity: 0.5 }} />
        <div className="cg-anim-float relative">
          <Avatar config={{ ...wornAvatar(student), ...avatar }} ringColor={ring} size={size} />
        </div>
      </div>
      <p className="relative mt-3 rounded-full border border-cyan-300/60 bg-black/60 px-4 py-1 text-xs font-black uppercase tracking-widest text-cyan-100">✦ {student.name} ✦</p>
    </div>
  );
}

function Wizard({ talking, className = "h-full" }: { talking: boolean; className?: string }) {
  return (
    <div className={`relative shrink-0 ${className}`}>
      <div className="cg-anim-wizard-enter h-full">
        <div className="cg-anim-float h-full">
          <WizardDanilo mouthOpen={talking} burstKey={0} className="h-full w-auto drop-shadow-[0_0_18px_rgba(250,204,21,0.35)]" />
        </div>
      </div>
    </div>
  );
}

/** O círculo mágico do Mago no chão. */
function MagicRing() {
  return (
    <div className="pointer-events-none absolute bottom-[2%] left-1/2 aspect-square w-[130%]" style={{ transform: "translate(-50%, 50%) scaleY(0.25)" }}>
      <div className="cg-anim-spin-slow absolute inset-0 rounded-full border-2 border-dashed border-violet-300/70 shadow-[0_0_40px_6px_rgba(139,92,246,0.45)]" />
      <div className="cg-anim-spin-reverse absolute inset-[12%] rounded-full border border-cyan-300/60" />
    </div>
  );
}

/**
 * O TON 618 em cena: a caixa tem a mesma proporção do desenho (5×4), então o
 * que vai por cima (`children`, em % da caixa) cai no lugar certo do desenho.
 * Surge do escuro e flutua.
 */
function VillainFrame({
  talking,
  mood = "mau",
  silhouette = false,
  rise = true,
  className = "h-full",
  children,
}: {
  talking: boolean;
  mood?: Ton618Mood;
  silhouette?: boolean;
  rise?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`${rise ? "cg-anim-reaper-rise" : ""} relative aspect-[5/4] shrink-0 ${className}`}>
      <div className="cg-anim-float absolute inset-0">
        <Ton618 talking={talking} mood={mood} silhouette={silhouette} className="h-full w-full" />
        {children}
      </div>
    </div>
  );
}

/** Área do vilão: maior que a dos personagens (desce um pouco por trás do balão de fala), pro TON 618 aparecer enorme. */
function VillainStage({ children }: { children: React.ReactNode }) {
  return <div className="absolute inset-x-0 bottom-[22%] top-[3%] flex items-center justify-center">{children}</div>;
}

/** A Lúmen-Mãe presa na beira do disco do TON 618, pedindo socorro. */
function TrappedMother({ className }: { className: string }) {
  return (
    <div className={`absolute ${className}`}>
      <div className="cg-anim-astro-wobble relative" style={{ "--cg-dur": "2s" } as React.CSSProperties}>
        <div className="absolute left-1/2 top-1/2 aspect-square w-[70%] -translate-x-1/2 -translate-y-1/2">
          <div className="cg-anim-astro-ping h-full w-full rounded-full border-4 border-red-400" style={{ "--cg-dur": "1.6s" } as React.CSSProperties} />
        </div>
        <LumenSat mother className="relative w-full drop-shadow-[0_0_14px_rgba(232,121,249,0.8)]" />
      </div>
      <p className="cg-anim-aura-blink mx-auto mt-1 w-fit whitespace-nowrap rounded-full border border-red-300/80 bg-red-950/85 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-red-100 sm:text-[11px]" style={{ "--cg-dur": "1.2s" } as React.CSSProperties}>
        SOS • Lúmen-Mãe
      </p>
    </div>
  );
}

/** Satélites Lúmen apagados, girando sem rumo pelo céu. */
function LostSatellites({ spots }: { spots: [string, string, number][] }) {
  return (
    <>
      {spots.map(([pos, size, i]) => (
        <div key={pos} className={`absolute ${pos} ${size}`}>
          <div className="cg-anim-float" style={{ animationDelay: `${i * 0.8}s` }}>
            <div className="cg-anim-aura-twirl" style={{ "--cg-dur": `${10 + i * 3}s`, animationDirection: i % 2 ? "reverse" : "normal" } as React.CSSProperties}>
              <LumenSat on={false} className="w-full" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

const LOST_SPOTS: [string, string, number][] = [
  ["left-[6%] top-[10%]", "w-[15%] min-w-[70px] max-w-[190px]", 0],
  ["right-[8%] top-[6%]", "w-[13%] min-w-[64px] max-w-[170px]", 1],
  ["right-[26%] top-[30%]", "w-[10%] min-w-[50px] max-w-[130px]", 2],
];

/** Aviso piscando (sem conexão, alerta...) por cima da cena. */
function Alert({ text, className = "" }: { text: string; className?: string }) {
  return (
    <p
      className={`cg-anim-aura-blink absolute rounded-full border-2 border-red-400 bg-red-950/85 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-red-200 sm:text-sm ${className}`}
      style={{ "--cg-dur": "1.2s", boxShadow: "0 0 22px rgba(239,68,68,0.55)" } as React.CSSProperties}
    >
      {text}
    </p>
  );
}

// Mensagens travadas piscando no ar (a Terra sem sinal).
const NO_SIGNAL_TEXTS: [string, string][] = [
  ["Sem conexão", "left-[5%] top-[16%]"],
  ["Vídeo travado...", "right-[6%] top-[12%]"],
  ["Mensagem não enviada", "left-[10%] top-[40%]"],
  ["Tentando reconectar...", "right-[8%] top-[36%]"],
];
const PHONES: [string, number][] = [
  ["left-[24%] top-[22%] w-[6%]", 0],
  ["right-[22%] top-[24%] w-[5%]", 0.8],
  ["left-[40%] top-[8%] w-[4.5%]", 1.6],
  ["right-[38%] top-[34%] w-[5%]", 2.3],
];

// ---------------------------------------------------------------------------
// Cenas
// ---------------------------------------------------------------------------

export default function AstronomiaArt({ art, speaker, mouthOpen = false, student }: EventArtProps) {
  const talkingWizard = speaker === "mago" && mouthOpen;
  const talkingCatarina = speaker === "catarina" && mouthOpen;
  const talkingTon = speaker === "vilao" && mouthOpen;
  const event = getEvent("astronomia")!;
  const suit = student ? { ...wornAvatar(student), outfit: "traje-estelar" as const } : null;

  switch (art) {
    // ================= FASE 1 — SEM SINAL =================

    // Segunda de manhã: a cidade e a CodeGuilds sem internet, celulares travados.
    case "terra-sem-wifi":
      return (
        <Scene>
          <Backdrop>
            <SpaceSky variant="manha" stars={0.35} />
            <div className="cg-anim-sun-rise absolute bottom-[14%] left-1/2 aspect-square w-[34%] max-w-[380px] -translate-x-1/2 rounded-full" style={{ background: "radial-gradient(circle, #fff7ed 0%, #fdba74 40%, rgba(251,146,60,0) 70%)" }} />
            <Hills className="h-[26%]" lights={false} />
            <Castle className="h-[62%]" fill="#1e1b4b" windowColor="#fde68a" />
          </Backdrop>
          <div className="cg-anim-pop absolute left-1/2 top-[6%] w-[14%] min-w-[70px] max-w-[150px] -translate-x-1/2" style={{ animationDelay: "0.6s" }}>
            <WifiGlyph crossed className="cg-anim-float w-full drop-shadow-[0_0_18px_rgba(239,68,68,0.7)]" />
          </div>
          {PHONES.map(([pos, delay], i) => (
            <div key={i} className={`absolute min-w-[30px] max-w-[70px] ${pos}`}>
              <div className="cg-anim-pop" style={{ animationDelay: `${0.9 + i * 0.35}s` }}>
                <PhoneNoSignal className="cg-anim-float w-full" style={{ animationDelay: `${delay}s` }} />
              </div>
            </div>
          ))}
          {NO_SIGNAL_TEXTS.map(([text, pos], i) => (
            <p key={text} className={`cg-anim-glitch absolute hidden rounded-md bg-black/50 px-2 py-0.5 font-mono text-xs font-bold text-red-200 sm:block sm:text-sm ${pos}`} style={{ animationDelay: `${i * 0.23}s`, textShadow: "0 0 8px rgba(239,68,68,0.9)" }}>
              ⚠ {text}
            </p>
          ))}
          <Alert text="📡 Terra sem sinal" className="left-1/2 top-[30%] -translate-x-1/2 sm:top-[26%]" />
        </Scene>
      );

    // A Catarina no observatório da CodeGuilds, acenando pra turma.
    case "observatorio":
      return (
        <Scene>
          <Backdrop>
            <SpaceSky variant="observatorio" />
            <MeteorShower count={2} scale={0.45} />
            <Hills className="h-[24%]" />
            <div className="absolute bottom-[2%] right-[-6%] w-[64%] max-w-[640px] sm:right-[4%] sm:w-[46%]">
              <Observatory className="w-full" />
            </div>
          </Backdrop>
          <Stage className="gap-1 sm:!justify-start sm:pl-[12%]">
            <CatarinaHero talking={talkingCatarina} pose="acena" className="h-[84%] sm:h-[92%]" />
            <Telescope className="mb-[2%] hidden h-[40%] w-auto sm:block" />
          </Stage>
        </Scene>
      );

    // Pelo telescópio: os satélites da Constelação Lúmen fora do lugar, apagados.
    case "lumen-perdidos":
      return (
        <Scene>
          <Backdrop>
            <SpaceSky variant="observatorio" />
            <Hills className="h-[16%]" />
          </Backdrop>
          <div className="cg-anim-pop absolute right-[4%] top-[8%] aspect-square w-[min(54%,52vh)] overflow-hidden rounded-full border-[6px] border-slate-300 shadow-[0_0_60px_rgba(34,211,238,0.4)] sm:right-[12%]" style={{ animationDelay: "0.3s" }}>
            <SpaceSky variant="orbita" milkyWay={false} />
            <EarthHorizon className="h-[30%]" size="w-[190%]" />
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <ellipse cx="50" cy="62" rx="44" ry="16" fill="none" stroke="#67e8f9" strokeWidth="0.6" strokeDasharray="4 3" opacity="0.5" />
            </svg>
            <LostSatellites
              spots={[
                ["left-[12%] top-[20%]", "w-[26%]", 0],
                ["right-[10%] top-[14%]", "w-[22%]", 1],
                ["left-[44%] top-[44%]", "w-[18%]", 2],
              ]}
            />
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <path d="M50 0 L50 40 M50 60 L50 100 M0 50 L40 50 M60 50 L100 50" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.6" />
              <circle cx="50" cy="50" r="10" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.6" />
            </svg>
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_20px_rgba(0,0,0,0.75)]" />
          </div>
          <Stage className="!justify-start pl-[3%] sm:pl-[8%]">
            <CatarinaHero talking={talkingCatarina} pose="aponta" className="h-[66%] sm:h-[92%]" />
          </Stage>
        </Scene>
      );

    // A sombra do TON 618 lá no fundo do universo: só os olhos e o anel de luz.
    case "ton618-sombra":
      return (
        <Scene>
          <Backdrop>
            <SpaceSky variant="galaxia" stars={0.8} />
          </Backdrop>
          <VillainStage>
            <VillainFrame talking={talkingTon} silhouette />
          </VillainStage>
        </Scene>
      );

    // O Mago e a Catarina combinam o plano diante do observatório e do foguete.
    case "mago-catarina":
      return (
        <Scene>
          <Backdrop>
            <SpaceSky variant="observatorio" />
            <Hills className="h-[22%]" />
            <div className="absolute bottom-[4%] left-[-4%] w-[34%] max-w-[380px] opacity-80">
              <Observatory className="w-full" />
            </div>
            <div className="absolute bottom-[2%] right-[2%] hidden h-[52%] opacity-80 sm:block">
              <LaunchPad lights={[false, false, false]} className="h-full w-auto" />
            </div>
          </Backdrop>
          <Stage className="gap-[1%]">
            <CatarinaHero talking={talkingCatarina} pose="neutra" className="h-[52%] sm:h-[90%]" />
            <div className="relative h-[60%] sm:h-full">
              <MagicRing />
              <Wizard talking={talkingWizard} />
            </div>
          </Stage>
        </Scene>
      );

    // O Vitória-1 na plataforma, com os sistemas desligados (luzes vermelhas).
    case "foguete-plataforma":
      return (
        <Scene>
          <Backdrop>
            <SpaceSky variant="observatorio" />
            <Hills className="h-[18%]" />
            <div className="absolute bottom-[1%] right-[-4%] h-[62%] sm:right-[10%] sm:h-[90%]">
              <LaunchPad lights={[false, false, false]} className="h-full w-auto" />
            </div>
          </Backdrop>
          <div className="cg-anim-alarm pointer-events-none absolute inset-0 bg-red-700" style={{ mixBlendMode: "screen" }} />
          <Alert text="Sistemas desligados" className="right-[6%] top-[8%] sm:right-[14%]" />
          <Stage className="!justify-start pl-[3%] sm:pl-[10%]">
            <CatarinaHero talking={talkingCatarina} pose="aponta" className="h-[64%] sm:h-[92%]" />
          </Stage>
        </Scene>
      );

    // Chamado da Fase 1: a Catarina, o aluno e o Mago diante do foguete.
    case "chamado-1":
      return (
        <Scene>
          <Backdrop>
            <SpaceSky variant="observatorio" />
            <Hills className="h-[20%]" />
            <div className="absolute bottom-[2%] left-1/2 h-[70%] -translate-x-1/2 opacity-30 sm:opacity-50">
              <LaunchPad lights={[false, false, false]} className="h-full w-auto" />
            </div>
          </Backdrop>
          <Stage className="gap-[3%]">
            <CatarinaHero talking={talkingCatarina} pose="comemora" className="h-[48%] sm:h-[90%]" />
            <Hero student={student} ring="#d946ef" />
            <div className="hidden h-[80%] sm:block">
              <Wizard talking={talkingWizard} />
            </div>
          </Stage>
        </Scene>
      );

    // Final da Fase 1: tudo verde no painel e a contagem regressiva.
    case "contagem":
      return (
        <Scene>
          <Backdrop>
            <SpaceSky variant="observatorio" />
            <Hills className="h-[18%]" />
          </Backdrop>
          <div className="absolute bottom-[1%] left-1/2 h-[70%] -translate-x-1/2 sm:left-[64%] sm:h-[88%]">
            <LaunchPad lights={[true, true, true]} flame="small" ignite className="h-full w-auto" />
          </div>
          <div className="absolute left-[4%] top-[8%] flex flex-col gap-1.5 sm:left-[8%] sm:top-[10%]">
            {["🔥 Motores", "🧭 Navegação", "💨 Suporte de vida"].map((label, i) => (
              <span key={label} className="cg-anim-pop rounded-full border border-emerald-300/70 bg-emerald-950/80 px-3 py-1 text-[11px] font-black text-emerald-200 sm:text-sm" style={{ animationDelay: `${0.3 + i * 0.3}s`, boxShadow: "0 0 14px rgba(74,222,128,0.45)" }}>
                ✓ {label}
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute right-[2%] top-[8%] grid h-[20%] w-[42%] place-items-center sm:left-[12%] sm:right-auto sm:top-[38%] sm:h-[24%] sm:w-[32%]">
            {Array.from({ length: 10 }, (_, i) => (
              <span
                key={i}
                className="cg-anim-astro-count col-start-1 row-start-1 text-6xl font-black text-white sm:text-8xl"
                style={{ "--cg-delay": `${0.8 + i * 0.75}s`, "--cg-dur": "0.75s", textShadow: "0 0 24px #d946ef, 0 0 50px #7c3aed" } as React.CSSProperties}
              >
                {10 - i}
              </span>
            ))}
            <span className="cg-anim-pop col-start-1 row-start-1 text-3xl font-black text-amber-200 sm:text-5xl" style={{ animationDelay: "8.4s", textShadow: "0 0 24px #f97316" }}>
              DECOLAR!
            </span>
          </div>
        </Scene>
      );

    // Decolagem: o chão ficando pra trás, as nuvens passando e o céu virando espaço.
    case "decolagem":
      return (
        <Scene>
          <SpaceSky variant="manha" stars={0.2} />
          <div className="cg-anim-dawn absolute inset-0">
            <SpaceSky variant="terra" />
          </div>
          <div className="cg-anim-astro-sink absolute inset-x-0 bottom-0 h-[30%]">
            <Hills className="h-full" />
          </div>
          {[
            ["left-[4%]", "w-[30%]", 2.6, 0],
            ["right-[2%]", "w-[34%]", 3.1, -1.2],
            ["left-[30%]", "w-[22%]", 2.2, -0.6],
            ["right-[30%]", "w-[26%]", 3.4, -2.2],
            ["left-[-6%]", "w-[24%]", 2.9, -1.8],
          ].map(([pos, size, duration, delay], i) => (
            <div key={i} className={`cg-anim-astro-fall absolute top-0 max-w-[420px] opacity-90 ${pos} ${size}`} style={{ "--cg-duration": `${duration}s`, "--cg-delay": `${delay}s` } as React.CSSProperties}>
              <Cloud className="w-full" />
            </div>
          ))}
          {Array.from({ length: 12 }, (_, i) => (
            <span
              key={i}
              className="cg-anim-astro-fall absolute top-0 w-[2px] rounded-full bg-white/60"
              style={{ left: `${(i * 37 + 5) % 100}%`, height: `${40 + (i % 4) * 30}px`, "--cg-duration": `${0.5 + (i % 5) * 0.12}s`, "--cg-delay": `${-i * 0.17}s` } as React.CSSProperties}
            />
          ))}
          <div className="absolute bottom-[-30%] left-1/2 h-[60%] w-[18%] -translate-x-1/2 rounded-full bg-gradient-to-t from-transparent via-slate-100/40 to-amber-100/70 blur-xl" />
          <div className="absolute bottom-[30%] left-1/2 h-[56%] -translate-x-1/2">
            <Rocket flame="full" className="cg-anim-shiver h-full w-auto drop-shadow-[0_0_30px_rgba(251,146,60,0.6)]" />
          </div>
        </Scene>
      );

    // Na órbita: a Terra azul lá embaixo e os satélites Lúmen girando sem rumo.
    case "orbita-terra":
      return (
        <Scene>
          <Backdrop>
            <SpaceSky variant="orbita" />
            <EarthHorizon className="h-[54%] sm:h-[42%]" />
            <LostSatellites spots={LOST_SPOTS} />
            <div className="cg-anim-hover absolute right-[6%] top-[40%] h-[22%] sm:right-[16%]">
              <Rocket flame="small" tilt={70} className="h-full w-auto" style={{ transform: "rotate(70deg)" }} />
            </div>
          </Backdrop>
          <Stage className="!justify-start pl-[3%] sm:pl-[8%]">
            <CatarinaHero talking={talkingCatarina} pose="aponta" helmet className="h-[70%] sm:h-[92%]" />
          </Stage>
        </Scene>
      );

    // O TON 618 ameaça: manda a chuva de meteoros na direção da nave.
    case "ton618-ameaca":
      return (
        <Scene>
          <Backdrop>
            <SpaceSky variant="galaxia" />
          </Backdrop>
          <VillainStage>
            <VillainFrame talking={talkingTon} />
          </VillainStage>
          <MeteorShower count={6} />
          <div className="cg-anim-hover absolute bottom-[36%] left-[6%] h-[12%]">
            <Rocket flame="small" tilt={50} className="h-full w-auto" style={{ transform: "rotate(50deg)" }} />
          </div>
        </Scene>
      );

    case "recompensa-1":
      return (
        <Scene>
          <SpaceSky variant="festa" stars={0.3} />
          <Rays color="rgba(240,171,252,0.5)" />
          <Confetti colors={["#d946ef", "#7c3aed", "#fbbf24", "#22d3ee", "#f8fafc"]} />
          <RewardShowcase reward={getPhase(event, 1).reward} avatar={suit} ringColor="#d946ef" />
          <div className="absolute bottom-[33%] left-[3%] hidden h-[52%] md:block">
            <CatarinaHero talking={talkingCatarina} pose="comemora" tag={false} />
          </div>
        </Scene>
      );

    // ================= FASE 2 — CHUVA DE METEOROS =================

    // A chuva de meteoros na órbita da Terra, com os satélites fora do lugar.
    case "meteoros":
      return (
        <Scene>
          <Backdrop>
            <SpaceSky variant="orbita" />
            <EarthHorizon className="h-[50%] sm:h-[28%]" />
            <LostSatellites spots={LOST_SPOTS} />
          </Backdrop>
          <MeteorShower count={11} />
          <div className="cg-anim-hover absolute left-[14%] top-[44%] h-[20%]">
            <Rocket flame="full" tilt={64} className="h-full w-auto" style={{ transform: "rotate(64deg)" }} />
          </div>
        </Scene>
      );

    // A Estação Espacial Internacional passando: cuidado!
    case "estacao-espacial":
      return (
        <Scene>
          <Backdrop>
            <SpaceSky variant="orbita" />
            <EarthHorizon className="h-[50%] sm:h-[32%]" />
          </Backdrop>
          <div className="cg-anim-walk absolute top-[6%] w-[46%] min-w-[220px] max-w-[600px]" style={{ "--cg-duration": "30s", "--cg-delay": "-13s" } as React.CSSProperties}>
            <ISS className="w-full drop-shadow-[0_0_24px_rgba(251,191,36,0.35)]" />
            <p className="mx-auto mt-1 w-fit rounded-full border border-amber-300/70 bg-black/70 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-amber-200 sm:text-xs">ISS • 28 mil km/h</p>
          </div>
          <Alert text="⚠ Desviar da ISS" className="bottom-[36%] right-[5%]" />
          <Stage className="!justify-start pl-[3%] sm:pl-[8%]">
            <CatarinaHero talking={talkingCatarina} pose="aponta" helmet className="h-[64%] sm:h-[92%]" />
          </Stage>
        </Scene>
      );

    // Na cabine: o marcador do oxigênio contando os minutos.
    case "oxigenio":
      return (
        <Scene>
          <Backdrop>
            <SpaceSky variant="orbita" />
            <EarthHorizon className="h-[62%]" />
          </Backdrop>
          <Cockpit />
          <div className="absolute right-[4%] top-[10%] flex flex-col items-center gap-2 sm:right-[14%] sm:top-[12%]">
            <O2Timer seconds={299} />
            <O2Tank level={0.72} className="h-[26vh] max-h-[300px] w-auto" />
          </div>
          <Stage className="!justify-start pl-[3%] sm:pl-[10%]">
            <CatarinaHero talking={talkingCatarina} pose="aponta" helmet className="h-[64%] sm:h-[92%]" />
          </Stage>
        </Scene>
      );

    // O TON 618 jogando meteoros e puxando os satélites, pouquinho a pouquinho.
    case "ton618-meteoros":
      return (
        <Scene>
          <Backdrop>
            <SpaceSky variant="galaxia" />
          </Backdrop>
          <VillainStage>
            <VillainFrame talking={talkingTon} mood="furioso" />
          </VillainStage>
          {[
            ["left-[4%] top-[18%]", "28vw", "14vh", 0],
            ["right-[4%] top-[12%]", "-28vw", "18vh", 1.6],
            ["left-[10%] top-[52%]", "24vw", "-10vh", 3.1],
          ].map(([pos, tx, ty, delay], i) => (
            <div key={i} className={`cg-anim-astro-slide absolute w-[11%] min-w-[54px] max-w-[140px] ${pos}`} style={{ "--cg-tx": tx, "--cg-ty": ty, "--cg-dur": "6s", "--cg-delay": `${delay}s` } as React.CSSProperties}>
              <div className="cg-anim-aura-twirl" style={{ "--cg-dur": "4s" } as React.CSSProperties}>
                <LumenSat on={false} className="w-full" />
              </div>
            </div>
          ))}
          <MeteorShower count={7} />
        </Scene>
      );

    // O Mago protege a nave com um escudo; o braço robótico pega um satélite.
    case "braco-robotico":
      return (
        <Scene>
          <Backdrop>
            <SpaceSky variant="orbita" />
            <EarthHorizon className="h-[48%] sm:h-[24%]" />
          </Backdrop>
          <MeteorShower count={4} />
          <div className="absolute right-[-6%] top-[8%] w-[72%] max-w-[820px] sm:right-[2%] sm:w-[58%]">
            <div className="cg-anim-hover">
              <ShipWithArm grab="lumen" shield className="w-full" />
            </div>
          </div>
          <Stage className="!justify-start pl-[2%] sm:pl-[6%]">
            <div className="relative h-[62%] sm:h-[92%]">
              <MagicRing />
              <Wizard talking={talkingWizard} />
            </div>
          </Stage>
        </Scene>
      );

    // Chamado da Fase 2: os três satélites esperando pra ser realinhados.
    case "chamado-2":
      return (
        <Scene>
          <Backdrop>
            <SpaceSky variant="orbita" />
            <EarthHorizon className="h-[48%] sm:h-[26%]" />
            <LostSatellites spots={LOST_SPOTS} />
          </Backdrop>
          <Stage className="gap-[3%]">
            <CatarinaHero talking={talkingCatarina} pose="comemora" helmet className="h-[48%] sm:h-[90%]" />
            <Hero student={student} ring="#22d3ee" />
            <div className="hidden h-[80%] sm:block">
              <Wizard talking={talkingWizard} />
            </div>
          </Stage>
        </Scene>
      );

    // Final da Fase 2: os satélites no lugar e a rede de luz em volta da Terra.
    case "lumen-alinhados":
      return (
        <Scene>
          <Backdrop>
            <SpaceSky variant="orbita" />
          </Backdrop>
          <div className="absolute left-1/2 top-[4%] aspect-square w-[min(92%,62vh)] -translate-x-1/2">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#67e8f9" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5" />
              <path d="M14 58 L72 12 L90 66 Z" fill="none" stroke="#67e8f9" strokeWidth="0.8" strokeDasharray="14 10" className="cg-anim-aura-flow cg-anim-light-up" style={{ "--cg-dur": "1.4s", "--cg-delay": "2.2s", filter: "drop-shadow(0 0 2px #22d3ee)" } as React.CSSProperties} />
            </svg>
            <div className="absolute inset-[20%]">
              <Earth mode="conectada" className="h-full w-full" />
            </div>
            {[
              [14, 58, 0.4],
              [72, 12, 1],
              [90, 66, 1.6],
            ].map(([x, y, delay], i) => (
              <div key={i} className="absolute w-[30%] -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
                <div className="cg-anim-light-up" style={lightUp(delay)}>
                  <LumenSat on className="cg-anim-float w-full" style={{ animationDelay: `${i * 0.6}s` }} />
                </div>
              </div>
            ))}
          </div>
        </Scene>
      );

    // O sinal voltando... mas fraco: falta alguém na rede.
    case "wifi-voltando":
      return (
        <Scene>
          <Backdrop>
            <SpaceSky variant="orbita" />
            <div className="absolute right-[-10%] top-[30%] w-[50%] max-w-[560px] opacity-90">
              <Earth mode="conectada" className="w-full" />
            </div>
          </Backdrop>
          <div className="absolute right-[6%] top-[6%] flex flex-col items-center gap-2 sm:right-[20%] sm:top-[10%]">
            <SignalBars bars={2} className="h-[14vh] max-h-[150px] w-auto" />
            <p className="cg-anim-aura-blink rounded-full border border-amber-300/70 bg-black/70 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-amber-200 sm:text-sm" style={{ "--cg-dur": "1.6s" } as React.CSSProperties}>
              Sinal fraco
            </p>
          </div>
          <Stage className="!justify-start pl-[3%] sm:pl-[10%]">
            <CatarinaHero talking={talkingCatarina} pose="comemora" helmet className="h-[64%] sm:h-[92%]" />
          </Stage>
        </Scene>
      );

    // O radar: a Lúmen-Mãe sendo puxada direto pro TON 618!
    case "lumen-mae-sumiu":
      return (
        <Scene>
          <Backdrop>
            <SpaceSky variant="orbita" />
          </Backdrop>
          <div className="cg-anim-alarm pointer-events-none absolute inset-0 bg-red-700" style={{ mixBlendMode: "screen" }} />
          <div className="absolute right-[3%] top-[13%] w-[min(48%,50vh)] sm:right-[12%] sm:top-[14%] sm:w-[min(58%,50vh)]">
            <Radar className="w-full drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]" />
          </div>
          <Alert text="Lúmen-Mãe sumiu do radar" className="left-1/2 top-[7%] -translate-x-1/2 whitespace-nowrap" />
          <Stage className="!justify-start pl-[3%] sm:pl-[10%]">
            <CatarinaHero talking={talkingCatarina} pose="aponta" helmet className="h-[64%] sm:h-[92%]" />
          </Stage>
        </Scene>
      );

    // O TON 618 com a Lúmen-Mãe presa na beira do disco.
    case "ton618-puxando":
      return (
        <Scene>
          <Backdrop>
            <SpaceSky variant="galaxia" />
          </Backdrop>
          <VillainStage>
            <VillainFrame talking={talkingTon}>
              <TrappedMother className="left-[22%] top-[58%] w-[22%] sm:left-[-2%] sm:top-[44%] sm:w-[24%]" />
            </VillainFrame>
          </VillainStage>
        </Scene>
      );

    case "recompensa-2":
      return (
        <Scene>
          <SpaceSky variant="festa" stars={0.3} />
          <Rays color="rgba(165,243,252,0.5)" />
          <Confetti colors={["#22d3ee", "#fbbf24", "#d946ef", "#7c3aed", "#f8fafc"]} />
          <RewardShowcase reward={getPhase(event, 2).reward} avatar={suit ? { ...suit, pet: "lumenzinho" } : null} ringColor="#22d3ee" />
          <div className="absolute bottom-[33%] left-[3%] hidden h-[52%] md:block">
            <CatarinaHero talking={talkingCatarina} pose="acena" helmet tag={false} />
          </div>
        </Scene>
      );

    // ================= FASE 3 — ALÉM DO HORIZONTE =================

    // A viagem até o coração da galáxia: o TON 618 brilhando lá na frente.
    case "viagem":
      return (
        <Scene>
          <SpaceSky variant="galaxia" />
          <WarpStreaks count={44} />
          <div className="absolute left-1/2 top-[40%] aspect-[5/4] w-[30%] max-w-[320px] -translate-x-1/2 -translate-y-1/2">
            <div className="cg-anim-glow h-full w-full">
              <Ton618 className="h-full w-full" />
            </div>
          </div>
          <div className="cg-anim-hover absolute bottom-[34%] left-[10%] h-[30%] sm:left-[18%]">
            <Rocket flame="full" tilt={36} className="h-full w-auto" style={{ transform: "rotate(36deg)" }} />
          </div>
        </Scene>
      );

    // O TON 618 enorme, e a Lúmen-Mãe quase no horizonte de eventos.
    case "ton618":
      return (
        <Scene>
          <Backdrop>
            <SpaceSky variant="galaxia" />
          </Backdrop>
          <VillainStage>
            <VillainFrame talking={talkingTon}>
              <TrappedMother className="left-[24%] top-[60%] w-[20%] sm:left-[0%] sm:top-[48%]" />
            </VillainFrame>
          </VillainStage>
        </Scene>
      );

    // A Catarina explica o plano no holograma: um atalho no espaço-tempo.
    case "catarina-plano":
      return (
        <Scene>
          <Backdrop>
            <SpaceSky variant="orbita" />
          </Backdrop>
          <div className="cg-anim-pop absolute right-[2%] top-[6%] w-[min(50%,56vh)] sm:right-[10%]" style={{ animationDelay: "0.5s" }}>
            <div className="absolute inset-[6%] rounded-full bg-cyan-400/15 blur-2xl" />
            <SpacetimeHologram className="relative w-full drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
            <p className="mx-auto mt-1 w-fit rounded-full border border-cyan-300/60 bg-black/60 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-cyan-100 sm:text-xs">Buraco de minhoca</p>
          </div>
          <Stage className="!justify-start pl-[3%] sm:pl-[10%]">
            <CatarinaHero talking={talkingCatarina} pose="aponta" helmet className="h-[64%] sm:h-[92%]" />
          </Stage>
        </Scene>
      );

    // O Mago abre o portal: os três anéis ainda apagados.
    case "buraco-minhoca":
      return (
        <Scene>
          <Backdrop>
            <SpaceSky variant="galaxia" />
          </Backdrop>
          <div className="absolute right-[-12%] top-[4%] aspect-square w-[min(84%,66vh)] sm:right-[6%]">
            <Wormhole lit={0} className="h-full w-full" />
          </div>
          <Stage className="!justify-start pl-[2%] sm:pl-[8%]">
            <div className="relative h-[66%] sm:h-full">
              <MagicRing />
              <Wizard talking={talkingWizard} />
            </div>
          </Stage>
        </Scene>
      );

    // Na cabine: o oxigênio acabando e o TON 618 puxando a nave.
    case "oxigenio-pouco":
      return (
        <Scene>
          <Backdrop>
            <SpaceSky variant="galaxia" />
            <div className="absolute left-1/2 top-[8%] aspect-[5/4] w-[44%] max-w-[480px] -translate-x-1/2">
              <Ton618 className="h-full w-full" />
            </div>
          </Backdrop>
          <Cockpit alarm />
          <div className="absolute right-[4%] top-[10%] flex flex-col items-center gap-2 sm:right-[14%] sm:top-[12%]">
            <O2Timer seconds={59} low />
            <O2Tank level={0.16} low className="h-[26vh] max-h-[300px] w-auto" />
          </div>
          <Stage className="!justify-start pl-[3%] sm:pl-[10%]">
            <CatarinaHero talking={talkingCatarina} pose="aponta" helmet className="h-[64%] sm:h-[92%]" />
          </Stage>
        </Scene>
      );

    // Chamado da Fase 3: a tripulação diante do portal.
    case "chamado-3":
      return (
        <Scene>
          <Backdrop>
            <SpaceSky variant="galaxia" />
            <div className="absolute left-1/2 top-[2%] aspect-square w-[min(90%,72vh)] -translate-x-1/2 opacity-60">
              <Wormhole lit={0} className="h-full w-full" />
            </div>
          </Backdrop>
          <Stage className="gap-[3%]">
            <CatarinaHero talking={talkingCatarina} pose="neutra" helmet className="h-[48%] sm:h-[90%]" />
            <Hero student={student} ring="#38bdf8" />
            <div className="hidden h-[80%] sm:block">
              <Wizard talking={talkingWizard} />
            </div>
          </Stage>
        </Scene>
      );

    // Final da Fase 3: o terceiro anel acende, o portal abre e o braço pega a Lúmen-Mãe.
    case "aneis-estaveis":
      return (
        <Scene>
          <SpaceSky variant="galaxia" />
          <div className="absolute left-1/2 top-[2%] aspect-square w-[min(96%,74vh)] -translate-x-1/2">
            <Wormhole lit={2} className="absolute inset-0 h-full w-full" />
            <div className="cg-anim-light-up absolute inset-0" style={lightUp(1.2)}>
              <Wormhole lit={3} open className="h-full w-full" />
            </div>
          </div>
          <div className="absolute bottom-[30%] left-[-4%] w-[70%] max-w-[700px] sm:left-[4%] sm:w-[48%]">
            <div className="cg-anim-hover">
              <ShipWithArm grab="mae" className="w-full" />
            </div>
          </div>
        </Scene>
      );

    // O TON 618 furioso, perdendo a Lúmen-Mãe.
    case "ton618-perde":
      return (
        <Scene>
          <Backdrop>
            <SpaceSky variant="galaxia" />
          </Backdrop>
          <VillainStage>
            <div className="cg-anim-shake h-full">
              <VillainFrame talking={talkingTon} mood="furioso" rise={false} />
            </div>
          </VillainStage>
          <div className="absolute left-[24%] top-[40%] w-[14%] min-w-[70px] max-w-[170px]">
            <div className="cg-anim-astro-slide" style={{ "--cg-tx": "-30vw", "--cg-ty": "-30vh", "--cg-dur": "3.5s" } as React.CSSProperties}>
              <LumenSat mother className="w-full" />
            </div>
          </div>
          <div className="absolute left-[2%] top-[4%] aspect-square w-[18%] min-w-[80px] max-w-[220px]">
            <Wormhole lit={3} open className="h-full w-full" />
          </div>
        </Scene>
      );

    // A grande heroína: a Catarina vence o TON 618 com ciência!
    case "catarina-heroina":
      return (
        <Scene>
          <SpaceSky variant="festa" stars={0.6} />
          <Rays color="rgba(240,171,252,0.55)" />
          <div className="absolute left-[4%] top-[10%] aspect-[5/4] w-[16%] min-w-[80px] max-w-[200px] opacity-80">
            <div className="cg-anim-astro-shrink h-full w-full" style={{ "--cg-to": "0.35", "--cg-dur": "5s" } as React.CSSProperties}>
              <Ton618 mood="derrotado" className="h-full w-full" />
            </div>
          </div>
          <div className="cg-anim-float absolute right-[4%] top-[12%] w-[18%] min-w-[80px] max-w-[220px]">
            <LumenSat mother className="w-full" />
          </div>
          <Confetti colors={["#f0abfc", "#d946ef", "#fbbf24", "#22d3ee", "#ffffff"]} />
          <div className="absolute inset-x-0 top-[7%] flex flex-col items-center gap-1 px-4 text-center">
            <p className="cg-anim-shimmer-cosmic text-2xl font-black uppercase tracking-[0.18em] sm:text-5xl" style={{ filter: "drop-shadow(0 0 14px rgba(217,70,239,0.7))" }}>
              Catarina Vitória
            </p>
            <p className="cg-anim-pop rounded-full border border-fuchsia-300/70 bg-black/60 px-3 py-0.5 text-[11px] font-black uppercase tracking-widest text-fuchsia-100 sm:text-sm" style={{ animationDelay: "0.9s" }}>
              ✦ a heroína do Wi-Fi ✦
            </p>
          </div>
          <div className="absolute inset-x-0 bottom-[20%] top-[19%] flex items-end justify-center sm:top-[21%]">
            <CatarinaHero talking={talkingCatarina} pose="comemora" helmet tag={false} className="h-[86%] sm:h-full" />
          </div>
        </Scene>
      );

    // A travessia pelo túnel de luz, de volta pra Terra num piscar de olhos.
    case "atravessando":
      return (
        <Scene>
          <SpaceSky variant="tunel" stars={0} />
          <WarpStreaks count={56} color="#f0f9ff" />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="absolute left-1/2 top-1/2 aspect-square w-[46vmin] -translate-x-1/2 -translate-y-1/2">
              <div
                className="cg-anim-astro-ping h-full w-full rounded-full border-4 border-sky-200"
                style={{ "--cg-dur": "2s", "--cg-delay": `${i * 0.5}s`, boxShadow: "0 0 30px rgba(125,211,252,0.8), inset 0 0 30px rgba(125,211,252,0.6)" } as React.CSSProperties}
              />
            </div>
          ))}
          <div className="absolute left-1/2 top-[44%] h-[46%] -translate-x-1/2 -translate-y-1/2">
            <Rocket flame="full" className="cg-anim-shiver h-full w-auto drop-shadow-[0_0_30px_rgba(186,230,253,0.9)]" />
          </div>
        </Scene>
      );

    // A Terra inteira acesa de novo, e todo mundo gritando o nome da Catarina.
    case "wifi-restaurado":
      return (
        <Scene>
          <Backdrop>
            <SpaceSky variant="orbita" />
          </Backdrop>
          <div className="absolute left-1/2 top-[22%] aspect-square w-[min(70%,44vh)] -translate-x-1/2">
            <Earth mode="conectada" className="h-full w-full" />
            <div className="absolute -top-[13%] left-1/2 w-[30%] -translate-x-1/2">
              <LumenSat mother className="cg-anim-float w-full" />
            </div>
            {[
              ["-left-[18%] top-[30%]", 0],
              ["-right-[18%] top-[34%]", 1],
              ["left-[2%] -bottom-[6%]", 2],
              ["right-[2%] -bottom-[4%]", 3],
            ].map(([pos, i]) => (
              <div key={pos as string} className={`absolute w-[22%] ${pos}`}>
                <LumenSat on className="cg-anim-float w-full" style={{ animationDelay: `${(i as number) * 0.5}s` }} />
              </div>
            ))}
          </div>
          {[
            ["left-[6%] top-[52%]", 0.6],
            ["right-[6%] top-[56%]", 1.1],
            ["left-[14%] top-[14%]", 1.6],
            ["right-[12%] top-[16%]", 2.1],
          ].map(([pos, delay]) => (
            <div key={pos as string} className={`cg-anim-pop absolute w-[8%] min-w-[38px] max-w-[90px] ${pos}`} style={{ animationDelay: `${delay}s` }}>
              <WifiGlyph className="cg-anim-float w-full" />
            </div>
          ))}
          <div className="absolute inset-x-0 top-[7%] flex justify-center gap-2 sm:gap-4">
            {["CA-", "TA-", "RI-", "NA!"].map((syllable, i) => (
              <span key={syllable} className="cg-anim-pop text-2xl font-black text-fuchsia-100 sm:text-5xl" style={{ animationDelay: `${1.6 + i * 0.45}s`, textShadow: "0 0 18px #d946ef, 0 0 40px #7c3aed" }}>
                {syllable}
              </span>
            ))}
          </div>
          <Confetti colors={["#22d3ee", "#d946ef", "#fbbf24", "#a3e635", "#f8fafc"]} />
        </Scene>
      );

    case "recompensa-3":
      return (
        <Scene>
          <SpaceSky variant="festa" stars={0.3} />
          <Rays color="rgba(253,186,116,0.5)" />
          <Confetti colors={["#fb923c", "#fbbf24", "#d946ef", "#22d3ee", "#f8fafc"]} />
          <RewardShowcase reward={getPhase(event, 3).reward} avatar={suit ? { ...suit, pet: "lumenzinho", aura: "buraco-negro" } : null} ringColor="#fb923c" />
          <div className="absolute bottom-[33%] left-[3%] hidden h-[52%] md:block">
            <CatarinaHero talking={talkingCatarina} pose="comemora" helmet tag={false} />
          </div>
          <div className="absolute bottom-[33%] right-[3%] hidden h-[56%] md:block">
            <Wizard talking={talkingWizard} />
          </div>
        </Scene>
      );

    // ================= PÔSTERES (card, banner e cada fase) =================

    // Fase 1: o observatório, a plataforma com o foguete e a Catarina acenando.
    case "poster-1":
      return (
        <Scene>
          <SpaceSky variant="observatorio" />
          <Hills className="h-[24%]" />
          <div className="absolute bottom-[2%] left-[2%] w-[34%]">
            <Observatory className="w-full" />
          </div>
          <div className="absolute bottom-[1%] right-[4%] h-[94%]">
            <LaunchPad lights={[true, false, false]} className="h-full w-auto" />
          </div>
          <div className="absolute bottom-[2%] left-1/2 h-[90%] -translate-x-1/2">
            <Catarina pose="acena" className="h-full w-auto drop-shadow-[0_0_20px_rgba(217,70,239,0.55)]" />
          </div>
        </Scene>
      );

    // Fase 2: a órbita, a ISS, os meteoros e os satélites Lúmen.
    case "poster-2":
      return (
        <Scene>
          <SpaceSky variant="orbita" />
          <EarthHorizon className="h-[40%]" />
          <div className="absolute left-[3%] top-[8%] w-[34%]">
            <ISS className="w-full" />
          </div>
          <MeteorShower count={4} scale={0.7} />
          <div className="cg-anim-float absolute left-[40%] top-[10%] w-[14%]">
            <LumenSat on className="w-full" />
          </div>
          <div className="absolute bottom-[2%] right-[6%] h-[92%]">
            <Catarina pose="aponta" helmet className="h-full w-auto drop-shadow-[0_0_20px_rgba(217,70,239,0.55)]" />
          </div>
        </Scene>
      );

    // Fase 3: o TON 618, o buraco de minhoca e a Catarina.
    case "poster-3":
      return (
        <Scene>
          <SpaceSky variant="galaxia" />
          <div className="absolute left-[2%] top-1/2 aspect-[5/4] h-[96%] -translate-y-1/2">
            <Ton618 className="h-full w-full" />
          </div>
          <div className="absolute right-[24%] top-[6%] aspect-square h-[70%]">
            <Wormhole lit={3} open className="h-full w-full" />
          </div>
          <div className="absolute bottom-[2%] right-[4%] h-[92%]">
            <Catarina pose="comemora" helmet className="h-full w-auto drop-shadow-[0_0_20px_rgba(217,70,239,0.55)]" />
          </div>
        </Scene>
      );

    // Card do evento e banner: a Terra, o TON 618 e a Catarina no meio.
    case "poster":
    default:
      return (
        <Scene>
          <SpaceSky variant="orbita" />
          <div className="absolute bottom-[-30%] left-[-6%] aspect-square h-[110%]">
            <Earth mode="sem-sinal" className="h-full w-full" />
          </div>
          <div className="absolute right-[-2%] top-1/2 aspect-[5/4] h-[90%] -translate-y-1/2">
            <Ton618 className="h-full w-full" />
          </div>
          <LostSatellites
            spots={[
              ["left-[30%] top-[6%]", "w-[9%]", 0],
              ["right-[34%] top-[60%]", "w-[7%]", 1],
            ]}
          />
          <div className="absolute bottom-[2%] left-1/2 h-[94%] -translate-x-1/2">
            <Catarina pose="acena" className="h-full w-auto drop-shadow-[0_0_24px_rgba(217,70,239,0.6)]" />
          </div>
        </Scene>
      );
  }
}
