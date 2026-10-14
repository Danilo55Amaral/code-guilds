"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Cinzel, Cinzel_Decorative } from "next/font/google";
import { isSoundMuted, playHyperspaceJump } from "@/engine/sfx";
import WizardDanilo from "../WizardDanilo";
import Catarina from "../events/astronomia/Catarina";
import Ton618 from "../events/astronomia/Ton618";
import { CountDracoding } from "../events/dracoding/villains";
import { LordGlacius } from "../events/ChristmasArt";
import { PumpkinKing } from "../events/HalloweenArt";
import { DrNecrose } from "../events/ZombieArt";
import ElderDragon, { DRAGON_VIEW, dragonMouth } from "../multiverse/ElderDragon";
import { Nebulae, Starfield } from "../multiverse/CosmicArt";
import { Castle, Fog, Rays, Stars } from "../events/common";
import { DragonBreath, PlayButtonArt, TitleLogo, TitleRibbon } from "./TitleArt";

// ============================================================================
// TELA INICIAL — a primeira tela da plataforma (o endereço "/"). No meio, o
// nome CodeGuilds em ouro com a magia do Mago Danilo e o botão Play; à
// esquerda, os heróis (o Mago Danilo e a Catarina Vitória) na luz dourada; à
// direita, os vilões (o Conde Dracoding, o Lorde Glacius, o Rei Abóbora e o
// Dr. Necrose) na luz vermelha, com o Dragão Ancestral no alto cuspindo fogo e o
// buraco negro TON 618 no céu; atrás, o castelo da Academia. O Play mergulha
// no portal: a tela dá um zoom pra dentro dele e vem o salto pelo hiperespaço
// (o mesmo da entrada da Sala do Multiverso), com o som do salto (se o som
// estiver ligado), e no fim o aluno chega no login.
// No celular ficam o mago e o Conde, um de cada lado, e o dragão atrás do nome.
// ============================================================================

const decorative = Cinzel_Decorative({ subsets: ["latin"], weight: ["700", "900"], display: "swap" });
const cinzel = Cinzel({ subsets: ["latin"], weight: ["700"], display: "swap" });

const LOGIN_PATH = "/entrar";
// Quanto dura a viagem do Play até o login: o zoom pra dentro do portal e o salto pelo hiperespaço
const WARP_MS = 2800;

// O dragão cospe fogo a cada BREATH_EVERY_MS, por BREATH_MS (a chama sai da boca dele, na pose "pe")
const BREATH_EVERY_MS = 7000;
const BREATH_MS = 2600;
const MOUTH = dragonMouth("pe");

/**
 * O lugar do Dragão Ancestral no lado dos vilões (no alto, espelhado pra olhar pros heróis),
 * no sistema de coordenadas do desenho dele. Serve pro dragão, atrás do nome, e pro fogo,
 * numa camada na frente do nome: os dois ficam no mesmo lugar.
 */
function DragonSpot({ children, glow = false }: { children: React.ReactNode; glow?: boolean }) {
  return (
    <div
      className="absolute right-[-6%] top-[6%] h-[24%] sm:h-[36%] md:h-[48%]"
      style={glow ? { filter: "drop-shadow(0 0 30px rgba(239,68,68,0.45))" } : undefined}
    >
      <div className="relative h-full -scale-x-100" style={{ aspectRatio: `${DRAGON_VIEW.w} / ${DRAGON_VIEW.h}` }}>
        {children}
      </div>
    </div>
  );
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return reduced;
}

export default function TitleScreen() {
  const router = useRouter();
  const reducedMotion = usePrefersReducedMotion();
  const [leaving, setLeaving] = useState(false);
  const [breathing, setBreathing] = useState(false);
  // o mouse (ou o foco do teclado) em cima do Play: o portal gira mais rápido
  const [charging, setCharging] = useState(false);
  // de onde sai o zoom pra dentro do portal (o meio do portal do Play, na tela)
  const [zoomOrigin, setZoomOrigin] = useState("50% 60%");
  const mainRef = useRef<HTMLElement>(null);
  const playRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    router.prefetch(LOGIN_PATH);
  }, [router]);

  // O sopro de fogo do dragão, de tempos em tempos (quem pediu menos movimento não vê)
  useEffect(() => {
    if (reducedMotion) return;
    let stop = 0;
    const breathe = () => {
      setBreathing(true);
      stop = window.setTimeout(() => setBreathing(false), BREATH_MS);
    };
    const first = window.setTimeout(breathe, 1800);
    const every = window.setInterval(breathe, BREATH_EVERY_MS);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(every);
      window.clearTimeout(stop);
    };
  }, [reducedMotion]);

  // O Play: mergulha no portal e faz o salto pelo hiperespaço até o login
  function play() {
    if (leaving) return;
    const button = playRef.current?.getBoundingClientRect();
    const scene = mainRef.current?.getBoundingClientRect();
    // o portal fica a 45% da altura do desenho do botão
    if (button && scene) setZoomOrigin(`${button.left + button.width / 2 - scene.left}px ${button.top + button.height * 0.45 - scene.top}px`);
    setLeaving(true);
    if (!isSoundMuted()) playHyperspaceJump();
    window.setTimeout(() => router.push(LOGIN_PATH), reducedMotion ? 0 : WARP_MS);
  }

  return (
    <main
      ref={mainRef}
      className="cg-dark-scope relative min-h-[560px] w-full overflow-hidden"
      style={{
        // a tela toda menos o rodapé (h-12) do layout
        height: "calc(100dvh - 3rem)",
        background:
          "radial-gradient(45% 55% at 12% 78%, rgba(251,191,36,0.32), transparent 70%), radial-gradient(45% 55% at 88% 78%, rgba(220,38,38,0.38), transparent 70%), radial-gradient(40% 35% at 50% 38%, rgba(168,85,247,0.35), transparent 75%), linear-gradient(180deg, #05030f 0%, #12082a 45%, #24093f 75%, #1a0626 100%)",
      }}
    >
      {/* a cena toda; no Play, ela dá um zoom pra dentro do portal e some */}
      <div
        className="absolute inset-0"
        style={{
          transformOrigin: zoomOrigin,
          transition: "transform 1.1s cubic-bezier(0.55, 0, 0.9, 0.4), opacity 0.8s ease-in 0.3s, filter 1.1s ease-in",
          ...(leaving && { transform: "scale(3.2)", opacity: 0, filter: "brightness(1.6)" }),
        }}
      >
        {/* ---- o céu ---- */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <Stars />
          <Rays color="rgba(253,230,138,0.35)" />
          {/* o buraco negro no céu dos vilões */}
          <div className="absolute right-[22%] top-[1%] w-[clamp(64px,9vw,150px)] opacity-90 sm:right-[30%]">
            <Ton618 className="w-full" />
          </div>
          {/* a lua dourada no céu dos heróis */}
          <div className="absolute left-[6%] top-[7%] h-[clamp(56px,9vw,120px)] w-[clamp(56px,9vw,120px)] rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff7d6,#fde68a_40%,#f59e0b_75%)] opacity-80 shadow-[0_0_60px_18px_rgba(251,191,36,0.35)]" />
          <div className="absolute left-[8.5%] top-[6%] h-[clamp(52px,8.5vw,112px)] w-[clamp(52px,8.5vw,112px)] rounded-full bg-[#0b0620]" />
        </div>

        {/* ---- o castelo da Academia ---- */}
        <Castle wide className="h-[44%]" fill="#0a0514" scale={0.62} />

        {/* ---- os heróis, na luz dourada ---- */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2" aria-hidden="true">
          <div className="absolute bottom-[2%] left-[42%] hidden h-[46%] md:block lg:left-[46%]" style={{ filter: "drop-shadow(0 0 22px rgba(251,191,36,0.35))" }}>
            <Catarina pose="comemora" className="h-full w-auto" />
          </div>
          <div className="absolute bottom-0 left-[-14%] h-[46%] sm:left-[-6%] sm:h-[62%] md:h-[80%] lg:left-[0%]" style={{ filter: "drop-shadow(0 0 26px rgba(251,191,36,0.45))" }}>
            <div className="cg-anim-float h-full">
              <WizardDanilo mouthOpen={false} burstKey={0} className="h-full w-auto" />
            </div>
          </div>
        </div>

        {/* ---- os vilões, na luz vermelha ---- */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2" aria-hidden="true">
          {/* o Dragão Ancestral no alto, virado pros heróis; o fogo dele fica na camada da frente, depois do nome */}
          <DragonSpot glow>
            <ElderDragon pose="pe" mouthOpen={breathing} runes={1} aura className="h-full w-auto" />
          </DragonSpot>
          <div className="absolute bottom-[10%] right-[40%] hidden h-[44%] md:block" style={{ filter: "drop-shadow(0 0 20px rgba(56,189,248,0.35))" }}>
            <LordGlacius className="h-full w-auto" />
          </div>
          <div className="absolute bottom-[1%] right-[50%] hidden h-[33%] md:block" style={{ filter: "drop-shadow(0 0 18px rgba(163,230,53,0.35))" }}>
            <DrNecrose className="h-full w-auto" />
          </div>
          <div className="absolute bottom-0 right-[68%] hidden h-[22%] lg:block" style={{ filter: "drop-shadow(0 0 16px rgba(249,115,22,0.45))" }}>
            <PumpkinKing className="h-full w-auto" />
          </div>
          <div className="absolute bottom-0 right-[-18%] h-[46%] sm:right-[-14%] sm:h-[58%] md:h-[72%] lg:right-[-8%]" style={{ filter: "drop-shadow(0 0 28px rgba(220,38,38,0.55))" }}>
            <CountDracoding magic className="h-full w-auto" />
          </div>
        </div>

        {/* ---- névoa no chão e o escuro das bordas ---- */}
        <Fog tint="rgba(167,139,250,0.28)" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-[#05030f] to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_140px_40px_rgba(0,0,0,0.75)]" aria-hidden="true" />

        {/* ---- o nome e o Play ---- */}
        <div className="relative z-10 flex h-full flex-col items-center px-4 pt-[9vh] sm:justify-center sm:pt-0 sm:pb-[10vh]">
          <h1 className="sr-only">CodeGuilds</h1>
          <div className="cg-anim-pop w-[min(94vw,980px,92vh)]" style={{ filter: "drop-shadow(0 10px 24px rgba(0,0,0,0.7))" }}>
            <TitleLogo fontFamily={decorative.style.fontFamily} animate={!reducedMotion} className="w-full" />
          </div>
          <div className="cg-anim-rise -mt-[2%] w-[min(82vw,640px,62vh)]" style={{ animationDelay: "0.35s" }}>
            <TitleRibbon text="A ACADEMIA DOS HERÓIS DO CONHECIMENTO" fontFamily={cinzel.style.fontFamily} className="w-full" />
          </div>

          <button
            ref={playRef}
            type="button"
            onClick={play}
            onMouseEnter={() => setCharging(true)}
            onMouseLeave={() => setCharging(false)}
            onFocus={() => setCharging(true)}
            onBlur={() => setCharging(false)}
            aria-label="Play: entrar na CodeGuilds"
            className="cg-anim-rise group relative mt-[2vh] w-[min(62vw,400px,40vh)] rounded-full outline-none transition-transform duration-200 hover:scale-[1.06] focus-visible:ring-4 focus-visible:ring-amber-300/70 active:scale-95"
            style={{ animationDelay: "0.6s" }}
          >
            <span className="block transition-[filter] duration-200 group-hover:brightness-125">
              <PlayButtonArt label="Play" fontFamily={decorative.style.fontFamily} fast={charging || leaving} />
            </span>
          </button>
        </div>

        {/* ---- o sopro de fogo do dragão, na frente do nome (sai pra cima, por cima das letras) ---- */}
        {breathing && (
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-1/2" aria-hidden="true">
            <DragonSpot>
              <DragonBreath
                className="absolute w-[85%]"
                style={{
                  left: `${(MOUTH.x / DRAGON_VIEW.w) * 100}%`,
                  top: `${(MOUTH.y / DRAGON_VIEW.h) * 100}%`,
                  transform: `translateY(-50%) rotate(${MOUTH.angle - 24}deg)`,
                  transformOrigin: "0 50%",
                  filter: "drop-shadow(0 0 18px rgba(249,115,22,0.8))",
                }}
              />
            </DragonSpot>
          </div>
        )}
      </div>

      {/* ---- o salto pelo hiperespaço (o mesmo da Sala do Multiverso), por cima de tudo até chegar no login ---- */}
      {leaving && (
        <div className="cg-anim-fade fixed inset-0 z-[70]" style={{ background: "#030014", animationDelay: "0.45s" }} aria-hidden="true">
          <Starfield warp />
          <Nebulae />
        </div>
      )}
    </main>
  );
}
