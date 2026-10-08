"use client";

import { AvatarConfig } from "@/engine/avatar";
import { wornAvatar } from "@/engine/students";
import { getEvent, getPhase } from "@/engine/specialEvents";
import Avatar from "../Avatar";
import WizardDanilo from "../WizardDanilo";
import { Confetti, Lightning, Rays, RewardShowcase, Stage } from "./common";
import type { EventArtProps } from "./registry";
import { animVars, poly } from "./dracoding/kit";
import { CountDracoding, Espantabyte, Lobisloop, Lupercio, MiniDracoding, ScarecrowHat, StrawPile } from "./dracoding/villains";
import { BatBurst, BatSwarm, Clown, CrowBurst, CursedPumpkin, HangingSpider, HowlingWolf, Kid, PumpkinGlyph, VampireSoldier, Witch, Wraith } from "./dracoding/creatures";
import {
  Backdrop,
  Carousel,
  Cauldron,
  CircusTent,
  ClockFace,
  CloudBank,
  Codopolis,
  CrimsonCastle,
  DeadTree,
  Embers,
  FallingLeaves,
  GroundMist,
  MOON_SHARDS,
  Moon,
  MoonShard,
  PumpkinField,
  Sky,
  StainedGlassShape,
  StoneBridge,
  ThroneHall,
} from "./dracoding/scenery";

// ============================================================================
// ARTE DE A NOITE DE DRACODING — o segundo evento de Halloween, em 3 fases,
// fora do castelo da CodeGuilds, em Codópolis:
// 1) A Colheita Maldita: o campo de abóboras e o Espantabyte;
// 2) A Lua de Sangue: as ruas, o circo sombrio e o Lobisloop;
// 3) O Castelo de Dracoding: a ponte, o exército, o salão do trono, os
//    Vitrais do Amanhecer e o Relógio do Amanhecer.
// O estilo é outro: personagens pontudos, sombra forte e luz de contorno
// (components/events/dracoding/). Cada cena ocupa o pai inteiro, como nos
// outros eventos; o fundo vai chegando perto devagar (Backdrop).
// ============================================================================

// ---------------------------------------------------------------------------
// Ícones de progresso: abóbora amaldiçoada → purificada (Fase 1), fragmento da
// lua apagado → prateado (Fase 2), vitral apagado → aceso (Fase 3)
// ---------------------------------------------------------------------------

function Pedestal() {
  return (
    <g>
      <path d="M18 84 L42 84 L46 94 L14 94 Z" fill="#3f3f46" />
      <rect x="10" y="94" width="40" height="6" rx="2" fill="#27272a" />
    </g>
  );
}

export function PumpkinIcon({ lit, delay = 0, className = "" }: { lit: boolean; delay?: number; className?: string }) {
  return (
    <svg viewBox="0 0 60 100" className={`overflow-visible ${className}`} aria-hidden="true">
      <Pedestal />
      <g transform="translate(4 32) scale(0.52)">
        {lit ? (
          <g className="cg-anim-light-up" style={{ "--cg-delay": `${delay}s` } as React.CSSProperties}>
            <circle cx="50" cy="66" r="56" fill="#fbbf24" opacity="0.3" style={{ filter: "blur(8px)" }} />
            <PumpkinGlyph cursed={false} />
          </g>
        ) : (
          <PumpkinGlyph cursed />
        )}
      </g>
    </svg>
  );
}

export function MoonShardIcon({ lit, delay = 0, className = "", index = 0 }: { lit: boolean; delay?: number; className?: string; index?: number }) {
  const shard = MOON_SHARDS[index % MOON_SHARDS.length].map(([x, y]) => [x * 0.24 + 30, y * 0.24 + 52] as [number, number]);
  return (
    <svg viewBox="0 0 60 100" className={`overflow-visible ${className}`} aria-hidden="true">
      <Pedestal />
      <path d="M30 84 L30 74" stroke="#52525b" strokeWidth="3" />
      {lit ? (
        <g className="cg-anim-light-up" style={{ "--cg-delay": `${delay}s` } as React.CSSProperties}>
          <circle cx="30" cy="50" r="26" fill="#e2e8f0" opacity="0.35" style={{ filter: "blur(7px)" }} />
          <path d={poly(shard)} fill="#f8fafc" stroke="#ffffff" strokeWidth="1.5" style={{ filter: "drop-shadow(0 0 6px #e2e8f0)" }} />
          <path d="M18 30 L20 34 M44 38 L46 34" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" className="cg-anim-twinkle" />
        </g>
      ) : (
        <g>
          <path d={poly(shard)} fill="#7f1d1d" stroke="#450a0a" strokeWidth="1.5" />
          <path d={`M${shard[0][0]} ${shard[0][1]} L${(shard[1][0] + shard[2][0]) / 2} ${(shard[1][1] + shard[2][1]) / 2}`} stroke="#1f0306" strokeWidth="1.5" />
        </g>
      )}
    </svg>
  );
}

export function StainedGlassIcon({ lit, delay = 0, className = "", palette = 0 }: { lit: boolean; delay?: number; className?: string; palette?: number }) {
  return (
    <svg viewBox="0 0 60 100" className={`overflow-visible ${className}`} aria-hidden="true">
      <Pedestal />
      <g transform="translate(14 6) scale(0.27)">
        <StainedGlassShape lit={false} palette={palette} />
        {lit && (
          <g className="cg-anim-light-up" style={{ "--cg-delay": `${delay}s` } as React.CSSProperties}>
            <StainedGlassShape lit palette={palette} />
          </g>
        )}
      </g>
    </svg>
  );
}

/** O ícone de progresso de cada fase. */
export function DracodingProgress({ lit, delay, className, phase = 1 }: { lit: boolean; delay?: number; className?: string; phase?: number }) {
  // cada ícone muda um pouco (qual fragmento da lua, a cor do vitral) conforme o atraso, que vem da posição
  const index = Math.round((delay ?? 0) / 0.2);
  if (phase === 2) return <MoonShardIcon lit={lit} delay={delay} className={className} index={index} />;
  if (phase === 3) return <StainedGlassIcon lit={lit} delay={delay} className={className} palette={index} />;
  return <PumpkinIcon lit={lit} delay={delay} className={className} />;
}

// ---------------------------------------------------------------------------
// Peças das cenas
// ---------------------------------------------------------------------------

/** O aluno no centro do círculo mágico, com o nome embaixo. */
function Hero({ student, avatar, ring = "#e11d48", size = 170 }: { student: EventArtProps["student"]; avatar?: Partial<AvatarConfig>; ring?: string; size?: number }) {
  if (!student) return null;
  return (
    <div className="relative flex flex-col items-center">
      <div className="pointer-events-none absolute bottom-0 left-1/2 aspect-square w-[260px]" style={{ transform: "translate(-50%, 45%) scaleY(0.28)" }}>
        <div className="cg-anim-spin-slow absolute inset-0 rounded-full border-2 border-dashed" style={{ borderColor: ring, boxShadow: `0 0 40px 8px ${ring}80` }} />
        <div className="cg-anim-spin-reverse absolute inset-[14%] rounded-full border border-slate-200/60" />
      </div>
      <div className="cg-anim-wizard-enter relative">
        <div className="absolute inset-0 rounded-full blur-2xl" style={{ background: ring, opacity: 0.5 }} />
        <div className="cg-anim-float relative">
          <Avatar config={{ ...wornAvatar(student), ...avatar }} ringColor={ring} size={size} />
        </div>
      </div>
      <p className="relative mt-3 rounded-full border border-rose-400/60 bg-black/60 px-4 py-1 text-xs font-black uppercase tracking-widest text-rose-100">✦ {student.name} ✦</p>
    </div>
  );
}

function Wizard({ talking, burstKey = 0, className = "h-full" }: { talking: boolean; burstKey?: number; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="cg-anim-wizard-enter h-full">
        <div className="cg-anim-float h-full">
          <WizardDanilo mouthOpen={talking} burstKey={burstKey} className="h-full w-auto drop-shadow-[0_0_18px_rgba(250,204,21,0.35)]" />
        </div>
      </div>
    </div>
  );
}

/** Vilão surgindo (sobe do escuro) e flutuando. */
function Rise({ children, className = "h-full" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`cg-anim-reaper-rise ${className}`}>
      <div className="cg-anim-float h-full">{children}</div>
    </div>
  );
}

/** Abóboras amaldiçoadas pulando de telhado em telhado (atravessam a tela). */
function HoppingPumpkins({ count = 5, bottom = "bottom-[30%]", cursed = true }: { count?: number; bottom?: string; cursed?: boolean }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`cg-anim-walk absolute ${bottom} w-[7%] min-w-[38px] max-w-[84px]`} style={{ "--cg-duration": `${11 + i * 2.3}s`, "--cg-delay": `${-i * 3.1}s`, marginBottom: `${(i % 3) * 3}%` } as React.CSSProperties}>
          <CursedPumpkin cursed={cursed} className="cg-anim-hop w-full" style={{ animationDelay: `${i * 0.27}s` }} />
        </div>
      ))}
    </>
  );
}

/** Lobos uivando em cima dos telhados (silhuetas contra a lua). */
function RooftopWolves({ rim = "#fca5a5" }: { rim?: string }) {
  const wolves: [string, string, number][] = [
    ["left-[8%] bottom-[44%]", "w-[7%] min-w-[44px]", 0],
    ["left-[34%] bottom-[50%]", "w-[5%] min-w-[34px]", -1.4],
    ["right-[22%] bottom-[46%]", "w-[6%] min-w-[40px]", -2.6],
    ["right-[6%] bottom-[41%]", "w-[8%] min-w-[50px]", -0.7],
  ];
  return (
    <>
      {wolves.map(([pos, size, delay], i) => (
        <div key={i} className={`absolute ${pos} ${size} max-w-[110px]`}>
          <HowlingWolf rim={rim} className="cg-anim-howl w-full" style={animVars({ delay, dur: 4.5 })} />
        </div>
      ))}
    </>
  );
}

/** Pares de olhos acesos no escuro (a alcateia espiando). */
function GlowingEyes({ color = "#f59e0b", className = "bottom-[8%]" }: { color?: string; className?: string }) {
  const eyes: [number, number, number][] = [
    [6, 0, 0],
    [18, 3, 0.8],
    [76, 1, 1.6],
    [88, 4, 0.4],
    [62, 6, 2.2],
  ];
  return (
    <div className={`pointer-events-none absolute inset-x-0 h-[8%] ${className}`}>
      {eyes.map(([left, top, delay], i) => (
        <div key={i} className="cg-anim-eye absolute flex gap-2" style={{ left: `${left}%`, top: `${top * 6}%`, animationDelay: `${delay}s` }}>
          {[0, 1].map((k) => (
            <span key={k} className="block h-1.5 w-3 rounded-[50%]" style={{ background: color, boxShadow: `0 0 8px 2px ${color}`, transform: `skewY(${k ? -14 : 14}deg)` }} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Bruxas cruzando o céu nas vassouras. */
function FlyingWitches({ count = 3 }: { count?: number }) {
  const witches: [number, number, number, number][] = [
    [12, 150, 13, 0],
    [24, 110, 17, -6],
    [6, 90, 21, -12],
  ];
  return (
    <>
      {witches.slice(0, count).map(([top, size, duration, delay], i) => (
        <span key={i} className="cg-anim-bat pointer-events-none absolute" style={{ top: `${top}%`, width: size, "--cg-duration": `${duration}s`, "--cg-delay": `${delay}s` } as React.CSSProperties}>
          <Witch className="w-full drop-shadow-[0_0_10px_rgba(190,242,100,0.35)]" />
        </span>
      ))}
    </>
  );
}

/** Fantasmas espiando e flutuando. */
function Wraiths({ happy = false, rising = false }: { happy?: boolean; rising?: boolean }) {
  const ghosts: [string, number][] = [
    ["left-[10%] top-[30%] w-[7%]", 0],
    ["right-[12%] top-[24%] w-[6%]", -1.6],
    ["left-[44%] top-[16%] w-[5%]", -2.8],
  ];
  return (
    <>
      {ghosts.map(([pos, delay], i) => (
        <div key={i} className={`absolute min-w-[40px] max-w-[110px] ${pos} ${rising ? "cg-anim-rise-away" : ""}`} style={rising ? ({ "--cg-delay": `${0.5 + i * 0.7}s` } as React.CSSProperties) : undefined}>
          <div className="cg-anim-ghost" style={{ animationDelay: `${delay}s` }}>
            <Wraith happy={happy} className="w-full" />
          </div>
        </div>
      ))}
    </>
  );
}

// "Código" do loop infinito do Lobisloop, piscando no ar.
const LOOP_CODE: [string, string][] = [
  ["while (true) {", "left-[6%] top-[14%]"],
  ["andarEmCirculos();", "right-[6%] top-[22%]"],
  ["// sem break!", "left-[12%] top-[36%]"],
  ["}", "right-[16%] top-[40%]"],
];

const KIDS: ("bruxinha" | "fantasminha" | "abobora" | "vampirinho")[] = ["bruxinha", "fantasminha", "abobora", "vampirinho", "fantasminha", "bruxinha"];

/** Os moradores andando em círculo na praça, presos no loop (ou parados, livres). */
function LoopSquare({ free = false }: { free?: boolean }) {
  return (
    <div className="absolute bottom-[6%] left-1/2 aspect-[2.6/1] w-[70%] max-w-[760px] -translate-x-1/2">
      <div className="absolute inset-0 rounded-[50%] border-2 border-dashed border-amber-300/60" style={{ boxShadow: free ? "none" : "0 0 40px 6px rgba(245,158,11,0.35), inset 0 0 40px rgba(245,158,11,0.25)" }} />
      {KIDS.map((kind, i) => {
        const a = (i / KIDS.length) * Math.PI * 2;
        return (
          <div key={i} className="absolute h-[64%] -translate-x-1/2 -translate-y-[90%]" style={{ left: `${50 + Math.cos(a) * 44}%`, top: `${50 + Math.sin(a) * 40}%` }}>
            <Kid kind={kind} dizzy={!free} className={`h-full w-auto ${free ? "cg-anim-hop" : "cg-anim-shamble"}`} style={{ animationDelay: `${i * 0.23}s` }} />
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cenas
// ---------------------------------------------------------------------------

export default function DracodingArt({ art, speaker, mouthOpen = false, student }: EventArtProps) {
  const talkingWizard = speaker === "mago" && mouthOpen;
  const talkingCount = speaker === "vilao" && mouthOpen;
  const talkingWolf = speaker === "lobisomem" && mouthOpen;
  const talkingScarecrow = speaker === "espantalho" && mouthOpen;
  const event = getEvent("dracoding")!;

  switch (art) {
    // ================= FASE 1 — A COLHEITA MALDITA =================

    // Codópolis na noite de Halloween, com a lua subindo e as crianças pedindo doces.
    case "cidade":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <Sky variant="cidade" />
            <Moon rising className="right-[10%] top-[6%] w-[19%] min-w-[90px] max-w-[260px]" />
            <CloudBank className="right-[-4%] top-[18%] h-[10%] w-[50%]" />
            <BatSwarm count={4} />
            <Codopolis className="h-[64%]" />
          </Backdrop>
          {(["bruxinha", "abobora", "fantasminha", "vampirinho"] as const).map((kind, i) => (
            <div key={kind} className="cg-anim-walk absolute bottom-[2%] h-[13%]" style={{ "--cg-duration": `${18 + i * 3}s`, "--cg-delay": `${-i * 4.5}s` } as React.CSSProperties}>
              <Kid kind={kind} className="cg-anim-shamble h-full w-auto" />
            </div>
          ))}
          <GroundMist tint="rgba(251,146,60,0.18)" />
          <FallingLeaves count={10} />
        </div>
      );

    // O campo de abóboras: os corvos fogem e o espantalho abre os olhos lá no meio.
    case "plantacao":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <Sky variant="campo" />
            <Moon className="left-[40%] top-[5%] w-[22%] min-w-[110px] max-w-[300px]" />
            <CloudBank className="left-[-6%] top-[22%] h-[10%] w-[60%]" fill="#1d1340" />
            <PumpkinField className="h-[66%]" />
            <div className="absolute bottom-[26%] left-1/2 h-[30%] -translate-x-1/2">
              <Espantabyte className="h-full w-auto opacity-90 drop-shadow-[0_0_18px_rgba(251,146,60,0.6)]" />
            </div>
          </Backdrop>
          <DeadTree className="bottom-0 left-0 h-[86%]" />
          <DeadTree flip className="bottom-0 right-0 h-[74%]" />
          <CrowBurst />
          <GroundMist tint="rgba(249,115,22,0.18)" />
          <FallingLeaves count={8} />
        </div>
      );

    // O Espantabyte em pé no milharal, com as abóboras amaldiçoadas em volta.
    case "espantabyte":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <Sky variant="campo" />
            <Moon className="right-[8%] top-[4%] w-[16%] min-w-[80px] max-w-[220px]" />
            <PumpkinField className="h-[40%]" barn={false} />
          </Backdrop>
          <Lightning flash="bg-orange-100" glow="#fdba74" />
          <BatSwarm count={4} crows />
          <Stage>
            <Rise>
              <Espantabyte talking={talkingScarecrow} className="h-full w-auto drop-shadow-[0_0_40px_rgba(234,88,12,0.55)]" />
            </Rise>
          </Stage>
          <div className="absolute bottom-[30%] left-[4%] flex w-[26%] items-end gap-[6%]">
            <CursedPumpkin className="cg-anim-hop w-1/2" />
            <CursedPumpkin className="cg-anim-hop w-[38%]" style={{ animationDelay: "0.5s" }} />
          </div>
          <div className="absolute bottom-[30%] right-[4%] flex w-[26%] items-end justify-end gap-[6%]">
            <CursedPumpkin className="cg-anim-hop w-[38%]" style={{ animationDelay: "0.8s" }} />
            <CursedPumpkin className="cg-anim-hop w-1/2" style={{ animationDelay: "0.2s" }} />
          </div>
          <Embers color="#fb923c" count={14} />
          <GroundMist tint="rgba(192,132,252,0.18)" />
        </div>
      );

    // O Fogo Roxo: as abóboras amaldiçoadas pulando de casa em casa, e a cidade escurecendo.
    case "maldicao-roxa":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <Sky variant="roxo" />
            <div className="absolute inset-x-0 bottom-[22%] top-[2%] flex justify-center opacity-30">
              <Espantabyte talking={talkingScarecrow} className="h-full w-auto blur-[1px]" />
            </div>
            <Codopolis tone="roxo" className="h-[52%]" />
          </Backdrop>
          <HoppingPumpkins count={5} bottom="bottom-[22%]" />
          <Embers color="#d946ef" count={18} />
          <GroundMist tint="rgba(217,70,239,0.2)" />
        </div>
      );

    // A cidade invadida: bruxas na lua, fantasmas, aranhas e o circo que surgiu na praça.
    case "invasao":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <Sky variant="cidade" />
            <Moon className="left-[38%] top-[4%] w-[24%] min-w-[120px] max-w-[320px]" />
            <Codopolis className="h-[58%]" />
            <div className="absolute bottom-[2%] left-1/2 w-[38%] max-w-[480px] -translate-x-1/2">
              <CircusTent className="w-full drop-shadow-[0_0_24px_rgba(217,70,239,0.45)]" />
            </div>
          </Backdrop>
          <FlyingWitches />
          <Wraiths />
          <HangingSpider className="left-[18%] top-[18%] w-[8%] min-w-[50px] max-w-[110px]" threadVh={30} />
          <HangingSpider className="right-[16%] top-[30%] w-[6%] min-w-[40px] max-w-[90px]" delay={0.8} threadVh={40} />
          <BatSwarm count={5} />
          <GroundMist />
        </div>
      );

    // O Mago Danilo chega, com o círculo mágico girando no chão.
    case "mago-1":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <Sky variant="cidade" />
            <Moon className="right-[8%] top-[6%] w-[12%] min-w-[70px] max-w-[170px] opacity-90" />
            <Codopolis className="h-[42%] opacity-70" />
          </Backdrop>
          <Stage>
            <div className="relative h-full">
              <div className="pointer-events-none absolute bottom-[2%] left-1/2 aspect-square w-[130%]" style={{ transform: "translate(-50%, 50%) scaleY(0.25)" }}>
                <div className="cg-anim-spin-slow absolute inset-0 rounded-full border-2 border-dashed border-violet-300/70 shadow-[0_0_40px_6px_rgba(139,92,246,0.45)]" />
                <div className="cg-anim-spin-reverse absolute inset-[12%] rounded-full border border-rose-300/60" />
              </div>
              <Wizard talking={talkingWizard} />
            </div>
          </Stage>
          <div className="absolute bottom-[30%] right-[8%] flex w-[22%] items-end gap-[8%]">
            <CursedPumpkin className="cg-anim-hop w-1/2" />
            <CursedPumpkin className="cg-anim-hop w-[40%]" style={{ animationDelay: "0.6s" }} />
          </div>
          <GroundMist tint="rgba(139,92,246,0.2)" />
        </div>
      );

    // A sombra do Conde Dracoding na frente da lua: só os olhos vermelhos acesos.
    case "sombra-dracoding":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <Sky variant="sangue" />
            <Moon className="left-1/2 top-[3%] w-[42%] min-w-[220px] max-w-[560px] -translate-x-1/2" />
            <Codopolis tone="sangue" className="h-[26%]" lamps={false} />
          </Backdrop>
          <Lightning flash="bg-rose-200" glow="#fda4af" />
          <Stage>
            <Rise>
              <CountDracoding silhouette talking={talkingCount} className="h-full w-auto drop-shadow-[0_0_30px_rgba(244,63,94,0.5)]" />
            </Rise>
          </Stage>
          <BatSwarm />
          <GroundMist tint="rgba(239,68,68,0.18)" />
        </div>
      );

    // Chamado da Fase 1: o aluno, o Mago e as abóboras amaldiçoadas.
    case "chamado-1":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <Sky variant="campo" />
            <Moon className="right-[8%] top-[6%] w-[12%] min-w-[70px] max-w-[170px]" />
            <PumpkinField className="h-[38%]" />
          </Backdrop>
          <Stage className="gap-[4%]">
            <div className="hidden h-[78%] sm:block">
              <WizardDanilo mouthOpen={talkingWizard} burstKey={1} className="h-full w-auto drop-shadow-[0_0_18px_rgba(250,204,21,0.35)]" />
            </div>
            <Hero student={student} ring="#f97316" />
            <div className="hidden h-[42%] items-end gap-2 sm:flex">
              {[0, 1, 2].map((i) => (
                <CursedPumpkin key={i} className="cg-anim-hop h-[70%] w-auto" style={{ animationDelay: `${i * 0.4}s` }} />
              ))}
            </div>
          </Stage>
          <FallingLeaves count={8} />
          <GroundMist tint="rgba(249,115,22,0.16)" />
        </div>
      );

    // Final da Fase 1: as abóboras purificadas brilhando laranja.
    case "aboboras-purificadas":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <Sky variant="campo" />
            <Rays color="rgba(253,186,116,0.45)" />
            <Codopolis className="h-[34%] opacity-80" />
          </Backdrop>
          <Stage className="!items-center gap-[6%] px-[6%]">
            {[0, 1, 2].map((i) => (
              <div key={i} className="relative h-[46%]">
                <div className="cg-anim-fade-out absolute inset-0" style={{ "--cg-delay": `${0.4 + i * 0.5}s` } as React.CSSProperties}>
                  <CursedPumpkin className="h-full w-auto" />
                </div>
                <div className="cg-anim-light-up h-full" style={{ "--cg-delay": `${0.6 + i * 0.5}s` } as React.CSSProperties}>
                  <CursedPumpkin cursed={false} className="cg-anim-float h-full w-auto drop-shadow-[0_0_30px_rgba(251,191,36,0.7)]" />
                </div>
              </div>
            ))}
          </Stage>
          <Embers color="#fbbf24" count={16} />
        </div>
      );

    // O Espantabyte se desmanchando: balança, cai e vira palha.
    case "espantabyte-derrotado":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <Sky variant="campo" />
            <Rays color="rgba(253,186,116,0.4)" />
            <PumpkinField className="h-[36%]" barn={false} />
          </Backdrop>
          <Stage>
            <div className="relative flex h-full items-end justify-center">
              <div className="cg-anim-collapse h-full">
                <Espantabyte talking={talkingScarecrow} className="h-full w-auto drop-shadow-[0_0_30px_rgba(234,88,12,0.5)]" />
              </div>
              <div className="cg-anim-poof pointer-events-none absolute bottom-[4%] inset-x-0 mx-auto aspect-square w-[60%] rounded-full bg-amber-200/60 blur-2xl" />
            </div>
          </Stage>
          <CrowBurst />
          <FallingLeaves />
        </div>
      );

    // O monte de palha, a cabeça apagada com os corvos e o chapéu inteirinho.
    case "palha":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <Sky variant="campo" />
            <Moon className="left-[8%] top-[6%] w-[14%] min-w-[70px] max-w-[190px]" />
            <PumpkinField className="h-[44%]" />
          </Backdrop>
          <Stage className="!items-end gap-[3%]">
            <StrawPile className="w-[34%] max-w-[420px]" />
            <div className="relative w-[14%] max-w-[170px]">
              <CursedPumpkin cursed={false} className="w-full brightness-[0.35] saturate-50" />
              <svg viewBox="0 0 60 44" className="absolute -top-[18%] left-[14%] w-[60%] overflow-visible" aria-hidden="true">
                <g className="cg-anim-swing" style={animVars({ dur: 3, angle: 4, origin: "50% 100%" })}>
                  <path d="M18 12 L32 12 L44 18 L56 28 L46 28 L52 36 L38 32 L22 32 L14 26 Z M6 12 L14 4 L24 6 L26 16 L16 18 Z" fill="#0a0710" />
                  <circle cx="12" cy="9" r="1.6" fill="#ef4444" />
                  <path d="M6 10 L-4 12 L6 15 Z" fill="#52525b" />
                </g>
              </svg>
            </div>
            <div className="cg-anim-pop w-[26%] max-w-[320px]" style={{ animationDelay: "1s" }}>
              <ScarecrowHat glow className="cg-anim-float w-full" />
            </div>
          </Stage>
          <FallingLeaves count={8} />
          <GroundMist tint="rgba(249,115,22,0.15)" />
        </div>
      );

    // A lua começa a sangrar, os lobos uivam nos telhados e a voz do vampiro ecoa.
    case "lua-sangrando":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <Sky variant="sangue" />
            <Moon tone="sangue" rising className="left-[38%] top-[4%] w-[26%] min-w-[130px] max-w-[340px]" />
            <div className="absolute bottom-[20%] right-[2%] h-[70%] opacity-35">
              <CountDracoding silhouette talking={talkingCount} className="h-full w-auto" />
            </div>
            <Codopolis tone="sangue" className="h-[46%]" />
          </Backdrop>
          <RooftopWolves />
          <BatSwarm count={5} />
          <GroundMist tint="rgba(239,68,68,0.2)" />
        </div>
      );

    case "recompensa-1":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="festa" stars={false} />
          <Rays color="rgba(255,237,213,0.5)" />
          <Confetti colors={["#f97316", "#fbbf24", "#a855f7", "#dc2626", "#f8fafc"]} />
          <FallingLeaves count={10} />
          <RewardShowcase reward={getPhase(event, 1).reward} avatar={student ? { ...wornAvatar(student), hat: "chapeu-espantalho" } : null} ringColor="#f97316" />
        </div>
      );

    // ================= FASE 2 — A LUA DE SANGUE =================

    // A Lua de Sangue sobre Codópolis e os uivos ecoando.
    case "lua-de-sangue":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <Sky variant="sangue" />
            <Moon tone="sangue" rising className="left-1/2 top-[4%] w-[34%] min-w-[170px] max-w-[440px] -translate-x-1/2" />
            <CloudBank className="left-[-4%] top-[30%] h-[9%] w-[55%]" fill="#2a0610" rim="#fca5a5" />
            <CloudBank flip className="right-[-4%] top-[16%] h-[8%] w-[45%]" fill="#2a0610" rim="#fca5a5" />
            <Codopolis tone="sangue" className="h-[48%]" />
          </Backdrop>
          <RooftopWolves />
          <BatSwarm count={4} />
          <GroundMist tint="rgba(239,68,68,0.22)" />
        </div>
      );

    // O Lobisloop aparece, enorme, com a alcateia espiando no escuro.
    case "lobisloop":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <Sky variant="sangue" />
            <Moon tone="sangue" className="left-[6%] top-[4%] w-[24%] min-w-[120px] max-w-[320px]" />
            <Codopolis tone="sangue" className="h-[30%]" lamps={false} />
          </Backdrop>
          <Lightning flash="bg-amber-100" glow="#fcd34d" />
          <Stage>
            <Rise>
              <Lobisloop talking={talkingWolf} className="h-full w-auto drop-shadow-[0_0_36px_rgba(245,158,11,0.45)]" />
            </Rise>
          </Stage>
          <GlowingEyes />
          <GroundMist tint="rgba(239,68,68,0.2)" />
        </div>
      );

    // O loop infinito: os moradores andando em círculos na praça, tontos.
    case "loop-infinito":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <Sky variant="sangue" />
            <Moon tone="sangue" className="right-[8%] top-[4%] w-[14%] min-w-[70px] max-w-[190px]" />
            <div className="absolute inset-x-0 bottom-[18%] top-[2%] flex justify-center opacity-30">
              <Lobisloop talking={talkingWolf} className="h-full w-auto blur-[1px]" />
            </div>
            <Codopolis tone="sangue" className="h-[40%]" />
          </Backdrop>
          {LOOP_CODE.map(([text, pos], i) => (
            <p key={text} className={`cg-anim-glitch absolute font-mono text-[11px] font-bold text-amber-300 sm:text-base ${pos}`} style={{ animationDelay: `${i * 0.21}s`, textShadow: "0 0 10px rgba(245,158,11,0.9)" }}>
              {text}
            </p>
          ))}
          <LoopSquare />
          <GroundMist tint="rgba(245,158,11,0.14)" className="h-[18%]" />
        </div>
      );

    // O circo sombrio: a lona, o carrossel girando ao contrário, palhaços e aranhas.
    case "circo":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <Sky variant="roxo" />
            <Moon tone="sangue" className="left-[46%] top-[3%] w-[14%] min-w-[70px] max-w-[190px]" />
            <div className="absolute bottom-[6%] left-1/2 w-[52%] max-w-[700px] -translate-x-1/2">
              <CircusTent className="w-full drop-shadow-[0_0_30px_rgba(217,70,239,0.5)]" />
            </div>
            <div className="absolute bottom-[6%] right-[1%] w-[24%] max-w-[300px]">
              <Carousel className="w-full" />
            </div>
          </Backdrop>
          <div className="absolute bottom-[4%] left-[2%] flex h-[52%] items-end gap-1">
            <Clown className="cg-anim-shamble h-full w-auto drop-shadow-[0_0_16px_rgba(167,139,250,0.4)]" />
            <Clown balloon={false} className="cg-anim-shamble hidden h-[82%] w-auto sm:block" />
          </div>
          <HangingSpider className="left-[30%] top-[6%] w-[7%] min-w-[44px] max-w-[100px]" threadVh={20} />
          <HangingSpider className="right-[30%] top-[14%] w-[5%] min-w-[36px] max-w-[80px]" delay={0.6} threadVh={26} />
          <BatSwarm count={3} />
          <Embers color="#d946ef" count={12} />
        </div>
      );

    // A lua quebrada, com os Fragmentos da Lua caídos pela cidade.
    case "fragmentos":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <Sky variant="sangue" />
            <Moon tone="sangue" missing={[0, 1, 2]} className="left-[44%] top-[3%] w-[26%] min-w-[130px] max-w-[340px]" />
            <Codopolis tone="sangue" className="h-[42%]" />
          </Backdrop>
          {[
            ["left-[58%] bottom-[34%] w-[7%]", 0],
            ["right-[6%] bottom-[44%] w-[8%]", 1],
            ["left-[40%] bottom-[16%] w-[6%]", 2],
          ].map(([pos, i]) => (
            <div key={i as number} className={`cg-anim-float absolute min-w-[40px] max-w-[110px] ${pos}`} style={{ animationDelay: `${(i as number) * 0.7}s` }}>
              <MoonShard index={i as number} className="w-full" />
            </div>
          ))}
          <Stage className="!justify-start pl-[6%]">
            <Wizard talking={talkingWizard} className="h-[90%]" />
          </Stage>
          <GroundMist tint="rgba(226,232,240,0.12)" />
        </div>
      );

    // Chamado da Fase 2: o aluno e o Mago, com os fragmentos esperando.
    case "chamado-2":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <Sky variant="sangue" />
            <Moon tone="sangue" missing={[0, 1, 2]} className="right-[8%] top-[5%] w-[14%] min-w-[70px] max-w-[190px]" />
            <Codopolis tone="sangue" className="h-[34%] opacity-90" />
          </Backdrop>
          <Stage className="gap-[4%]">
            <div className="hidden h-[78%] sm:block">
              <WizardDanilo mouthOpen={talkingWizard} burstKey={2} className="h-full w-auto drop-shadow-[0_0_18px_rgba(250,204,21,0.35)]" />
            </div>
            <Hero student={student} ring="#e2e8f0" />
            <div className="hidden h-[46%] items-end gap-3 sm:flex">
              {[0, 1, 2].map((i) => (
                <MoonShard key={i} index={i} className="cg-anim-float h-[46%] w-auto opacity-80" style={{ animationDelay: `${i * 0.5}s` }} />
              ))}
            </div>
          </Stage>
          <GlowingEyes className="bottom-[2%]" />
        </div>
      );

    // Final da Fase 2: os fragmentos voltam pro lugar e a lua fica prateada.
    case "lua-prateada":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <Sky variant="prata" />
            <Rays color="rgba(226,232,240,0.45)" />
            <Moon assemble className="left-1/2 top-[4%] w-[34%] min-w-[170px] max-w-[440px] -translate-x-1/2" />
            <Codopolis tone="prata" className="h-[40%]" />
          </Backdrop>
          <LoopSquare free />
          <GroundMist tint="rgba(226,232,240,0.2)" className="h-[18%]" />
        </div>
      );

    // O Lobisloop perdendo a força na luz prateada.
    case "lobisloop-derrotado":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <Sky variant="prata" />
            <Moon className="left-[6%] top-[4%] w-[22%] min-w-[110px] max-w-[300px]" />
            <Rays color="rgba(226,232,240,0.5)" />
          </Backdrop>
          <div className="pointer-events-none absolute left-1/2 top-0 h-full w-[40%] -translate-x-1/2" style={{ background: "linear-gradient(180deg, rgba(241,245,249,0.45), transparent 80%)", filter: "blur(18px)" }} />
          <Stage>
            <div className="relative flex h-full items-end justify-center">
              <div className="cg-anim-morph-out h-full">
                <Lobisloop talking={talkingWolf} className="h-full w-auto drop-shadow-[0_0_36px_rgba(226,232,240,0.6)]" />
              </div>
              <div className="cg-anim-poof pointer-events-none absolute bottom-[10%] inset-x-0 mx-auto aspect-square w-[60%] rounded-full bg-slate-100/70 blur-2xl" style={{ animationDelay: "2s" }} />
            </div>
          </Stage>
          <Embers color="#e2e8f0" count={16} />
        </div>
      );

    // O Seu Lupércio, o vigia, de volta ao normal.
    case "lupercio":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <Sky variant="prata" />
            <Moon className="right-[8%] top-[5%] w-[16%] min-w-[80px] max-w-[220px]" />
            <Codopolis tone="prata" className="h-[46%]" />
          </Backdrop>
          <Stage>
            <div className="cg-anim-morph-in h-[88%]" style={{ "--cg-delay": "0.3s" } as React.CSSProperties}>
              <Lupercio className="h-full w-auto drop-shadow-[0_0_24px_rgba(251,191,36,0.4)]" />
            </div>
          </Stage>
          <GroundMist tint="rgba(226,232,240,0.18)" />
        </div>
      );

    // A névoa se abre e aparece o Castelo de Dracoding no penhasco.
    case "castelo-carmesim":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop pan="0%">
            <Sky variant="castelo" />
            <Moon className="left-[56%] top-[4%] w-[16%] min-w-[80px] max-w-[220px]" />
            <div className="absolute bottom-0 left-1/2 h-[92%] -translate-x-1/2">
              <CrimsonCastle className="h-full w-auto" />
            </div>
          </Backdrop>
          <Lightning flash="bg-rose-200" glow="#fda4af" />
          <BatSwarm />
          <CloudBank className="bottom-[10%] left-[-30%] h-[18%] w-[80%] opacity-80" fill="#1a0a16" rim="#fb7185" />
          <CloudBank flip className="bottom-[4%] right-[-30%] h-[20%] w-[80%] opacity-80" fill="#1a0a16" rim="#fb7185" />
          <GroundMist tint="rgba(225,29,72,0.18)" />
        </div>
      );

    // O convite: o Dracoding aparece no céu, sobre o castelo.
    case "convite":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <Sky variant="castelo" />
            <div className="absolute bottom-0 left-1/2 h-[60%] -translate-x-1/2 opacity-70">
              <CrimsonCastle className="h-full w-auto" />
            </div>
          </Backdrop>
          <Stage>
            <Rise>
              <CountDracoding talking={talkingCount} magic className="h-full w-auto opacity-90 drop-shadow-[0_0_40px_rgba(244,63,94,0.55)]" />
            </Rise>
          </Stage>
          <BatSwarm count={5} />
          <GroundMist tint="rgba(225,29,72,0.2)" />
        </div>
      );

    case "recompensa-2":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0" style={{ background: "radial-gradient(60% 55% at 50% 42%, rgba(241,245,249,0.55), transparent 70%), linear-gradient(180deg, #172554 0%, #6d28d9 55%, #be185d 100%)" }} />
          <Rays color="rgba(241,245,249,0.5)" />
          <Confetti colors={["#e2e8f0", "#94a3b8", "#a78bfa", "#f8fafc", "#fda4af"]} />
          <RewardShowcase reward={getPhase(event, 2).reward} avatar={student ? { ...wornAvatar(student), aura: "lua-prateada" } : null} ringColor="#e2e8f0" />
        </div>
      );

    // ================= FASE 3 — O CASTELO DE DRACODING =================

    // A ponte de pedra até o castelo, entre raios e morcegos.
    case "ponte":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <Sky variant="castelo" />
            <Moon className="left-[60%] top-[3%] w-[14%] min-w-[70px] max-w-[190px]" />
            <div className="absolute bottom-[30%] left-1/2 h-[64%] -translate-x-1/2">
              <CrimsonCastle className="h-full w-auto" />
            </div>
            <div className="absolute bottom-0 left-1/2 w-[110%] -translate-x-1/2">
              <StoneBridge className="w-full" />
            </div>
          </Backdrop>
          <Lightning flash="bg-rose-200" glow="#fda4af" />
          <BatSwarm count={6} />
          <GroundMist tint="rgba(148,163,184,0.18)" className="h-[22%]" />
        </div>
      );

    // O exército no pátio: vampiros, lobos e as bruxas em volta do caldeirão.
    case "exercito":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <Sky variant="castelo" />
            <div className="absolute bottom-[14%] left-1/2 h-[80%] -translate-x-1/2 opacity-80">
              <CrimsonCastle className="h-full w-auto" />
            </div>
          </Backdrop>
          {/* fileiras de soldados (as de trás menores) */}
          {/* no celular, menos soldados por fileira (senão embolam) */}
          {[
            { bottom: "bottom-[24%]", h: "h-[22%]", n: 9, phone: 5, o: 0.65 },
            { bottom: "bottom-[10%]", h: "h-[30%]", n: 7, phone: 4, o: 0.85 },
          ].map((row, r) => (
            <div key={r} className={`absolute inset-x-0 flex justify-between px-[2%] ${row.bottom} ${row.h}`} style={{ opacity: row.o }}>
              {Array.from({ length: row.n }, (_, i) => {
                const phone = i < row.phone ? "" : "hidden sm:block";
                return (i + r) % 4 === 3 ? (
                  <HowlingWolf key={i} className={`cg-anim-howl h-[80%] w-auto self-end ${phone}`} style={animVars({ delay: -i * 0.6 })} />
                ) : (
                  <VampireSoldier key={i} className={`cg-anim-shamble h-full w-auto ${phone}`} style={{ animationDelay: `${i * 0.2}s` }} />
                );
              })}
            </div>
          ))}
          <div className="absolute bottom-[2%] left-1/2 w-[24%] min-w-[150px] max-w-[300px] -translate-x-1/2">
            <Cauldron className="w-full drop-shadow-[0_0_30px_rgba(132,204,22,0.5)]" />
          </div>
          {/* bruxas voando em volta do caldeirão: um círculo achatado (elipse), com elas sempre em pé */}
          <div className="absolute bottom-[24%] left-1/2 h-0 w-0" style={{ transform: "scaleY(0.32)" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} className="cg-anim-orbit absolute left-0 top-0 h-0 w-0" style={animVars({ dur: 7, delay: -i * 2.33, origin: "0px 0px" })}>
                <div className="absolute top-0 w-[110px] -translate-x-1/2 -translate-y-1/2 sm:w-[150px]" style={{ left: "min(24vw, 280px)" }}>
                  <div className="cg-anim-orbit-rev" style={animVars({ dur: 7, delay: -i * 2.33 })}>
                    <div style={{ transform: "scaleY(3.125)" }}>
                      <Witch className="w-full drop-shadow-[0_0_12px_rgba(190,242,100,0.4)]" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Embers color="#bef264" count={12} />
        </div>
      );

    // O salão do trono: o Conde Dracoding se revela.
    case "dracoding":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <ThroneHall />
          </Backdrop>
          <Lightning flash="bg-rose-200" glow="#fda4af" />
          <Stage>
            <Rise>
              <CountDracoding talking={talkingCount} magic className="h-full w-auto drop-shadow-[0_0_40px_rgba(244,63,94,0.5)]" />
            </Rise>
          </Stage>
          <BatSwarm count={4} />
          <Embers color="#fb7185" count={10} />
        </div>
      );

    // O Relógio do Amanhecer parado às 23:59.
    case "relogio":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <ThroneHall className="brightness-50" />
          </Backdrop>
          <div className="cg-anim-pop absolute left-[3%] top-[9%] w-[40%] max-w-[440px]" style={{ animationDelay: "0.3s" }}>
            <ClockFace className="w-full drop-shadow-[0_0_40px_rgba(253,230,138,0.45)]" />
          </div>
          <Stage className="sm:!justify-end sm:pr-[6%]">
            <div className="h-[92%]">
              <CountDracoding talking={talkingCount} className="cg-anim-float h-full w-auto drop-shadow-[0_0_40px_rgba(244,63,94,0.5)]" />
            </div>
          </Stage>
        </div>
      );

    // Os três Vitrais do Amanhecer apagados, e o Mago mostrando o caminho.
    case "vitrais":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <ThroneHall />
          </Backdrop>
          <div className="absolute left-1/2 top-[3%] w-[12%] min-w-[70px] max-w-[160px] -translate-x-1/2 opacity-80">
            <ClockFace className="w-full" />
          </div>
          <Stage className="!justify-start pl-[4%]">
            <Wizard talking={talkingWizard} className="h-[92%]" />
          </Stage>
        </div>
      );

    // Chamado da Fase 3: o aluno, o Mago e o Seu Lupércio com a lanterna.
    case "chamado-3":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <ThroneHall className="brightness-75" />
          </Backdrop>
          <Stage className="gap-[3%]">
            <div className="hidden h-[78%] sm:block">
              <WizardDanilo mouthOpen={talkingWizard} burstKey={3} className="h-full w-auto drop-shadow-[0_0_18px_rgba(250,204,21,0.35)]" />
            </div>
            <Hero student={student} avatar={{ hat: "chapeu-espantalho", aura: "lua-prateada" }} />
            <div className="hidden h-[74%] sm:block">
              <Lupercio className="h-full w-auto" />
            </div>
          </Stage>
        </div>
      );

    // Final: os vitrais acendem, o sol entra e o relógio volta a andar até as 6h.
    case "vitrais-acesos":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <ThroneHall litWindows={3} sunlight />
          </Backdrop>
          <Rays color="rgba(254,243,199,0.4)" />
          <Stage className="!items-start pt-[2%]">
            <ClockFace running className="h-[70%] w-auto drop-shadow-[0_0_50px_rgba(253,230,138,0.7)]" />
          </Stage>
          <Embers color="#fde68a" count={14} />
        </div>
      );

    // O Dracoding se desfazendo numa nuvem de morcegos na luz do sol.
    case "dracoding-derrotado":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <ThroneHall litWindows={3} sunlight />
          </Backdrop>
          <Rays color="rgba(254,243,199,0.5)" />
          <Stage>
            <div className="relative flex h-full items-end justify-center">
              <div className="cg-anim-dissolve h-full" style={{ "--cg-delay": "1.4s" } as React.CSSProperties}>
                <div className="cg-anim-dragon-shake h-full">
                  <CountDracoding talking={talkingCount} className="h-full w-auto drop-shadow-[0_0_40px_rgba(254,243,199,0.6)]" />
                </div>
              </div>
              <BatBurst className="inset-0" delay={2} />
            </div>
          </Stage>
        </div>
      );

    // A revoada: morcegos fugindo pelas janelas e as bruxas indo embora.
    case "revoada":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Backdrop>
            <Sky variant="amanhecer" stars={false} />
            <div className="absolute bottom-0 left-1/2 h-[70%] -translate-x-1/2 opacity-90">
              <CrimsonCastle lit={false} className="h-full w-auto" />
            </div>
          </Backdrop>
          <BatSwarm speed={0.5} />
          <BatSwarm speed={0.35} count={5} />
          <FlyingWitches count={2} />
          <BatBurst className="left-1/2 top-[30%]" delay={0.2} count={14} />
        </div>
      );

    // O sol nasce sobre Codópolis: fantasmas em paz e a cidade em festa.
    case "amanhecer":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="cidade" />
          <div className="cg-anim-dawn absolute inset-0" style={{ background: "linear-gradient(180deg, #1e3a8a 0%, #7c3aed 30%, #f472b6 58%, #fdba74 80%, #fde68a 100%)" }} />
          <div className="absolute inset-x-0 bottom-[26%] flex justify-center">
            <div className="cg-anim-sun-rise aspect-square w-[30%] max-w-[340px] rounded-full" style={{ background: "radial-gradient(circle, #fef9c3 0%, #fde047 45%, #fb923c 100%)", boxShadow: "0 0 90px 30px rgba(253,224,71,0.55)" }} />
          </div>
          <Wraiths happy rising />
          <Codopolis tone="amanhecer" className="h-[52%]" />
          {(["bruxinha", "abobora", "fantasminha", "vampirinho", "bruxinha"] as const).map((kind, i) => (
            <div key={i} className="absolute bottom-[2%] h-[12%]" style={{ left: `${12 + i * 17}%` }}>
              <Kid kind={kind} className="cg-anim-hop h-full w-auto" style={{ animationDelay: `${i * 0.3}s` }} />
            </div>
          ))}
          <Confetti colors={["#f97316", "#fbbf24", "#a855f7", "#f472b6", "#f8fafc"]} />
        </div>
      );

    // O Dracoding de Bolso: o vampiro encolhido, de óculos escuros, pousando no ombro do aluno.
    case "dracoding-mini":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="amanhecer" stars={false} />
          <Rays color="rgba(255,251,235,0.5)" />
          <Codopolis tone="amanhecer" className="h-[30%]" lamps={false} />
          <Stage className="gap-[4%]">
            <Hero student={student} avatar={{ pet: "dracoding" }} ring="#fbbf24" />
            <div className="cg-anim-fly-in h-[44%]" style={{ "--cg-delay": "0.4s" } as React.CSSProperties}>
              <MiniDracoding className="cg-anim-hover h-full w-auto drop-shadow-[0_0_24px_rgba(244,63,94,0.45)]" />
            </div>
          </Stage>
        </div>
      );

    // Última cena do evento: o visual completo de herói do Halloween.
    case "recompensa-3":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="festa" stars={false} />
          <Rays color="rgba(255,251,235,0.55)" />
          <Confetti colors={["#e11d48", "#f97316", "#fbbf24", "#a855f7", "#f8fafc"]} />
          <BatSwarm count={3} />
          <RewardShowcase
            reward={getPhase(event, 3).reward}
            avatar={student ? { ...wornAvatar(student), hat: "chapeu-espantalho", aura: "lua-prateada", pet: "dracoding" } : null}
            ringColor="#e11d48"
          />
        </div>
      );

    // ================= PÔSTERES (card, banner e cada fase) =================

    // Fase 1: o campo de abóboras, o Espantabyte e as abóboras amaldiçoadas.
    case "poster-1":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="campo" />
          <Moon className="left-[30%] top-[6%] w-[16%] min-w-[70px] max-w-[200px]" />
          <PumpkinField className="h-[58%]" />
          <div className="cg-anim-float absolute bottom-[6%] right-[4%] h-[92%]">
            <Espantabyte className="h-full w-auto drop-shadow-[0_0_30px_rgba(234,88,12,0.5)]" />
          </div>
          <div className="absolute bottom-[4%] left-[6%] flex w-[34%] items-end gap-[6%]">
            <CursedPumpkin className="cg-anim-hop w-[36%]" />
            <CursedPumpkin className="cg-anim-hop w-[28%]" style={{ animationDelay: "0.5s" }} />
          </div>
          <FallingLeaves count={6} />
        </div>
      );

    // Fase 2: a Lua de Sangue, a cidade e o Lobisloop.
    case "poster-2":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="sangue" />
          <Moon tone="sangue" className="left-[24%] top-[5%] w-[22%] min-w-[100px] max-w-[280px]" />
          <Codopolis tone="sangue" className="h-[52%]" lamps={false} />
          <RooftopWolves />
          <div className="cg-anim-float absolute bottom-[4%] right-[3%] h-[92%]">
            <Lobisloop className="h-full w-auto drop-shadow-[0_0_30px_rgba(245,158,11,0.45)]" />
          </div>
        </div>
      );

    // Fase 3: o castelo no penhasco e o Conde Dracoding.
    case "poster-3":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="castelo" />
          <Moon className="left-[14%] top-[5%] w-[16%] min-w-[70px] max-w-[200px]" />
          <div className="absolute bottom-0 left-[6%] h-[88%]">
            <CrimsonCastle className="h-full w-auto" />
          </div>
          <div className="cg-anim-float absolute bottom-[4%] right-[3%] h-[96%]">
            <CountDracoding className="h-full w-auto drop-shadow-[0_0_30px_rgba(244,63,94,0.5)]" />
          </div>
          <BatSwarm count={4} />
        </div>
      );

    // Card do evento e banner: os três vilões diante do castelo e da lua.
    case "poster":
    default:
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="castelo" />
          <Moon className="left-1/2 top-[3%] w-[30%] min-w-[140px] max-w-[380px] -translate-x-1/2" />
          <div className="absolute bottom-0 left-1/2 h-[64%] -translate-x-1/2 opacity-80">
            <CrimsonCastle className="h-full w-auto" />
          </div>
          <div className="absolute bottom-[4%] left-1/2 h-[88%] -translate-x-1/2">
            <CountDracoding className="cg-anim-float h-full w-auto drop-shadow-[0_0_36px_rgba(244,63,94,0.55)]" />
          </div>
          <div className="absolute bottom-[2%] left-[2%] h-[72%]">
            <Espantabyte className="h-full w-auto drop-shadow-[0_0_24px_rgba(234,88,12,0.5)]" />
          </div>
          <div className="absolute bottom-[2%] right-[2%] h-[68%]">
            <Lobisloop className="h-full w-auto drop-shadow-[0_0_24px_rgba(245,158,11,0.45)]" />
          </div>
          <BatSwarm count={5} />
          <GroundMist tint="rgba(225,29,72,0.16)" className="h-[18%]" />
        </div>
      );
  }
}
