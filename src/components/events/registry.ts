import type { ComponentType } from "react";
import type { EventId, SceneSpeaker } from "@/engine/specialEvents";
import type { Student } from "@/engine/students";
import HalloweenArt, { Lantern } from "./HalloweenArt";
import ZombieArt, { AntidoteVial } from "./ZombieArt";

// ============================================================================
// VISUAL DOS EVENTOS — pra cada evento: o desenho das cenas, o ícone de
// progresso (no Halloween, uma Lanterna Sagrada por missão; no Apocalipse
// Zumbi, um frasco do antídoto) e as cores do card, do banner, dos botões e
// do balão do vilão. Os textos da história ficam em engine/specialEvents.ts.
// ============================================================================

export interface EventArtProps {
  art: string; // qual cena desenhar ("noite", "rei"... ou "poster" pro card/banner)
  speaker?: SceneSpeaker; // quem está falando (mexe a boca do personagem certo)
  mouthOpen?: boolean;
  student?: Student | null;
}

export interface EventVisual {
  Art: ComponentType<EventArtProps>;
  ProgressIcon: ComponentType<{ lit: boolean; delay?: number; className?: string }>;
  /** Como o progresso se chama: "2 de 4 lanternas acesas", "✓ lanterna acesa". */
  progressNoun: { one: string; many: string; doneOne: string; doneMany: string };
  missionsTitle: string; // título da lista de missões na tela do evento
  titleClass: string;
  titleGlow: string; // text-shadow do título
  accentClass: string; // texto de destaque (tagline, contadores)
  accentDot: string; // bolinha da cena atual e cursor do texto (classe bg-*)
  accentDotSoft: string; // bolinhas das cenas que já passaram
  chipClass: string; // botões pequenos de contorno (Rever a abertura...)
  borderClass: string;
  buttonClass: string; // botão principal (Entrar, Finalizar)
  progressBar: string; // gradiente da barra de progresso (from-*/to-*)
  glow: string; // cor da sombra do card
  panelBackground: string; // fundo das seções escuras da tela do evento
  villainStyle: { plate: string; border: string; glow: string }; // balão de fala do vilão
}

export const EVENT_VISUALS: Record<EventId, EventVisual> = {
  halloween: {
    Art: HalloweenArt,
    ProgressIcon: Lantern,
    progressNoun: { one: "lanterna", many: "lanternas", doneOne: "acesa", doneMany: "acesas" },
    missionsTitle: "🕯️ Missões do evento",
    titleClass: "text-orange-400",
    titleGlow: "0 0 24px rgba(249,115,22,0.8), 0 0 60px rgba(220,38,38,0.45)",
    accentClass: "text-orange-200",
    accentDot: "bg-orange-400",
    accentDotSoft: "bg-orange-200/70",
    chipClass: "border-orange-300/50 text-orange-100 hover:border-orange-200",
    borderClass: "border-orange-500/40",
    buttonClass: "bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 text-cg-ink shadow-lg shadow-orange-500/40",
    progressBar: "from-orange-500 to-amber-300",
    glow: "#f97316",
    panelBackground:
      "radial-gradient(45% 60% at 90% 0%, rgba(249,115,22,0.25), transparent 70%), radial-gradient(40% 60% at 0% 100%, rgba(126,34,206,0.35), transparent 70%), linear-gradient(160deg, #0c0a09 0%, #1c0a02 45%, #2e1065 100%)",
    villainStyle: {
      plate: "border-orange-500/80 bg-orange-950/95 text-orange-300",
      border: "border-orange-500/60",
      glow: "0 12px 50px -10px rgba(249,115,22,0.8)",
    },
  },
  zumbi: {
    Art: ZombieArt,
    ProgressIcon: AntidoteVial,
    progressNoun: { one: "frasco", many: "frascos", doneOne: "cheio", doneMany: "cheios" },
    missionsTitle: "☣️ Missões do evento",
    titleClass: "text-lime-300",
    titleGlow: "0 0 24px rgba(163,230,53,0.8), 0 0 60px rgba(22,163,74,0.45)",
    accentClass: "text-lime-200",
    accentDot: "bg-lime-400",
    accentDotSoft: "bg-lime-200/70",
    chipClass: "border-lime-300/50 text-lime-100 hover:border-lime-200",
    borderClass: "border-lime-400/40",
    buttonClass: "bg-gradient-to-r from-lime-400 via-yellow-300 to-lime-400 text-cg-ink shadow-lg shadow-lime-500/40",
    progressBar: "from-lime-500 to-yellow-300",
    glow: "#84cc16",
    panelBackground:
      "radial-gradient(45% 60% at 90% 0%, rgba(132,204,22,0.28), transparent 70%), radial-gradient(40% 60% at 0% 100%, rgba(194,65,12,0.3), transparent 70%), linear-gradient(160deg, #0a0f05 0%, #1a2e05 50%, #292524 100%)",
    villainStyle: {
      plate: "border-lime-400/80 bg-lime-950/95 text-lime-300",
      border: "border-lime-400/60",
      glow: "0 12px 50px -10px rgba(163,230,53,0.75)",
    },
  },
};
