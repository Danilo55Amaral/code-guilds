import type { ComponentType } from "react";
import type { EventId, SceneSpeaker } from "@/engine/specialEvents";
import type { Student } from "@/engine/students";
import HalloweenArt, { Lantern } from "./HalloweenArt";
import ZombieArt, { AntidoteVial } from "./ZombieArt";
import AlienArt, { EnergyCrystal } from "./AlienArt";
import ChristmasArt, { ChristmasProgress } from "./ChristmasArt";
import DracodingArt, { DracodingProgress } from "./DracodingArt";

// ============================================================================
// VISUAL DOS EVENTOS — pra cada evento: o desenho das cenas, o ícone de
// progresso (no Halloween, uma Lanterna Sagrada por missão; no Apocalipse
// Zumbi, um frasco do antídoto; na Invasão Alienígena, um Cristal de Energia; no Natal,
// um por fase: presente, Estrela da Aurora e Selo de Gelo; em A Noite de Dracoding,
// abóbora amaldiçoada, Fragmento da Lua e Vitral do Amanhecer) e as cores do card, do banner,
// dos botões e do balão do vilão. Os textos da história ficam em engine/specialEvents.ts.
// ============================================================================

export interface EventArtProps {
  art: string; // qual cena desenhar ("noite", "rei"... ou "poster" pro card/banner)
  speaker?: SceneSpeaker; // quem está falando (mexe a boca do personagem certo)
  mouthOpen?: boolean;
  student?: Student | null;
}

export interface ProgressNoun {
  one: string;
  many: string;
  doneOne: string;
  doneMany: string;
}

export interface EventVisual {
  Art: ComponentType<EventArtProps>;
  /** Ícone de progresso de cada missão; `phase` = a fase (evento em fases muda o ícone por fase). */
  ProgressIcon: ComponentType<{ lit: boolean; delay?: number; className?: string; phase?: number }>;
  /** Como o progresso se chama: "2 de 4 lanternas acesas", "✓ lanterna acesa". */
  progressNoun: ProgressNoun;
  /** Evento em fases: o nome do progresso de cada fase (1, 2, 3...), se mudar. */
  phaseNouns?: Record<number, ProgressNoun>;
  /** Fundo sonoro das cenas: sombrio (padrão) ou de inverno. */
  ambience?: "sombrio" | "inverno";
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
  dracoding: {
    Art: DracodingArt,
    ProgressIcon: DracodingProgress,
    progressNoun: { one: "abóbora", many: "abóboras", doneOne: "purificada", doneMany: "purificadas" },
    phaseNouns: {
      1: { one: "abóbora", many: "abóboras", doneOne: "purificada", doneMany: "purificadas" },
      2: { one: "fragmento da lua", many: "fragmentos da lua", doneOne: "restaurado", doneMany: "restaurados" },
      3: { one: "vitral do amanhecer", many: "vitrais do amanhecer", doneOne: "aceso", doneMany: "acesos" },
    },
    missionsTitle: "🦇 Missões da fase",
    titleClass: "text-rose-500",
    titleGlow: "0 0 24px rgba(244,63,94,0.85), 0 0 60px rgba(127,29,29,0.6)",
    accentClass: "text-rose-200",
    accentDot: "bg-rose-500",
    accentDotSoft: "bg-rose-200/70",
    chipClass: "border-rose-300/50 text-rose-100 hover:border-rose-200",
    borderClass: "border-rose-600/40",
    buttonClass: "bg-gradient-to-r from-rose-500 via-orange-300 to-rose-500 text-cg-ink shadow-lg shadow-rose-600/40",
    progressBar: "from-rose-600 via-orange-400 to-slate-200",
    glow: "#e11d48",
    panelBackground:
      "radial-gradient(45% 60% at 90% 0%, rgba(225,29,72,0.3), transparent 70%), radial-gradient(40% 60% at 0% 100%, rgba(148,163,184,0.18), transparent 70%), linear-gradient(160deg, #09040a 0%, #2a0611 50%, #120a24 100%)",
    villainStyle: {
      plate: "border-rose-500/80 bg-rose-950/95 text-rose-200",
      border: "border-rose-500/60",
      glow: "0 12px 50px -10px rgba(225,29,72,0.85)",
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
  natal: {
    Art: ChristmasArt,
    ProgressIcon: ChristmasProgress,
    progressNoun: { one: "presente", many: "presentes", doneOne: "descongelado", doneMany: "descongelados" },
    phaseNouns: {
      1: { one: "presente", many: "presentes", doneOne: "descongelado", doneMany: "descongelados" },
      2: { one: "estrela da aurora", many: "estrelas da aurora", doneOne: "acesa", doneMany: "acesas" },
      3: { one: "selo de gelo", many: "selos de gelo", doneOne: "quebrado", doneMany: "quebrados" },
    },
    ambience: "inverno",
    missionsTitle: "🎄 Missões da fase",
    titleClass: "text-red-400",
    titleGlow: "0 0 24px rgba(248,113,113,0.8), 0 0 60px rgba(34,197,94,0.45)",
    accentClass: "text-emerald-200",
    accentDot: "bg-red-400",
    accentDotSoft: "bg-emerald-200/70",
    chipClass: "border-emerald-300/50 text-emerald-100 hover:border-emerald-200",
    borderClass: "border-red-500/40",
    buttonClass: "bg-gradient-to-r from-red-500 via-amber-300 to-emerald-400 text-cg-ink shadow-lg shadow-red-500/40",
    progressBar: "from-red-500 via-amber-300 to-emerald-400",
    glow: "#ef4444",
    panelBackground:
      "radial-gradient(45% 60% at 90% 0%, rgba(239,68,68,0.28), transparent 70%), radial-gradient(40% 60% at 0% 100%, rgba(34,197,94,0.28), transparent 70%), linear-gradient(160deg, #020617 0%, #0f1f4a 50%, #14532d 100%)",
    villainStyle: {
      plate: "border-sky-300/80 bg-sky-950/95 text-sky-200",
      border: "border-sky-300/60",
      glow: "0 12px 50px -10px rgba(125,211,252,0.8)",
    },
  },
  alien: {
    Art: AlienArt,
    ProgressIcon: EnergyCrystal,
    progressNoun: { one: "cristal", many: "cristais", doneOne: "carregado", doneMany: "carregados" },
    missionsTitle: "🛸 Missões do evento",
    titleClass: "text-cyan-300",
    titleGlow: "0 0 24px rgba(34,211,238,0.8), 0 0 60px rgba(192,38,211,0.45)",
    accentClass: "text-cyan-200",
    accentDot: "bg-cyan-400",
    accentDotSoft: "bg-cyan-200/70",
    chipClass: "border-cyan-300/50 text-cyan-100 hover:border-cyan-200",
    borderClass: "border-cyan-400/40",
    buttonClass: "bg-gradient-to-r from-cyan-400 via-emerald-300 to-cyan-400 text-cg-ink shadow-lg shadow-cyan-500/40",
    progressBar: "from-cyan-500 to-emerald-300",
    glow: "#22d3ee",
    panelBackground:
      "radial-gradient(45% 60% at 90% 0%, rgba(34,211,238,0.28), transparent 70%), radial-gradient(40% 60% at 0% 100%, rgba(192,38,211,0.3), transparent 70%), linear-gradient(160deg, #020617 0%, #1e1b4b 55%, #042f2e 100%)",
    villainStyle: {
      plate: "border-fuchsia-400/80 bg-fuchsia-950/95 text-fuchsia-300",
      border: "border-fuchsia-400/60",
      glow: "0 12px 50px -10px rgba(232,121,249,0.75)",
    },
  },
};

/** O nome do progresso numa fase ("presentes descongelados", "selos de gelo quebrados"...). */
export function progressNounFor(visual: EventVisual, phase: number): ProgressNoun {
  return visual.phaseNouns?.[phase] ?? visual.progressNoun;
}
