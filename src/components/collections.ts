import { CosmeticCollection } from "@/engine/avatar";

// ============================================================================
// VISUAL DAS COLEÇÕES — a cara de cada coleção temática na Loja do aluno e no
// Painel ADM: título, frase, fundo, cores e os enfeites flutuando. As seções
// são sempre escuras (.cg-dark-scope), nos dois temas.
// ============================================================================

export interface CollectionTheme {
  emoji: string;
  title: string;
  tagline: string; // frase curtinha acima do título
  subtitle: string;
  background: string; // CSS do fundo da seção
  borderClass: string;
  cardBorderClass: string; // borda dos cards dentro da seção
  titleClass: string;
  titleGlow: string; // text-shadow do título
  subtitleClass: string;
  buttonClass: string; // gradiente do botão "Adicionar" no Painel ADM
  glow: string; // cor da sombra dos cards
  decor: { emoji: string; left: number; top: number; size: number; delay: number }[];
  snow?: boolean; // neve caindo no fundo da seção (coleção de Natal)
}

export const COLLECTION_THEME: Record<CosmeticCollection, CollectionTheme> = {
  natal: {
    emoji: "🎄",
    title: "Especial de Natal",
    tagline: "❄️ Edição especial de fim de ano",
    subtitle: "Gorro do Papai Noel, renas, suéter de tricô, luzinhas, aurora boreal e muita neve pro seu avatar. Ho-ho-ho!",
    background:
      "radial-gradient(45% 60% at 90% 0%, rgba(250,204,21,0.25), transparent 70%), radial-gradient(45% 60% at 0% 100%, rgba(220,38,38,0.4), transparent 70%), linear-gradient(160deg, #052e16 0%, #14532d 45%, #7f1d1d 100%)",
    borderClass: "border-red-400/50",
    cardBorderClass: "!border-red-400/40",
    titleClass: "text-red-300",
    titleGlow: "0 0 18px rgba(248,113,113,0.8)",
    subtitleClass: "text-emerald-100/80",
    buttonClass: "from-red-500 to-emerald-400 shadow-red-500/30",
    glow: "#f87171",
    decor: [
      { emoji: "🎄", left: 4, top: 6, size: 26, delay: 0 },
      { emoji: "⭐", left: 88, top: 4, size: 24, delay: 0.7 },
      { emoji: "🎁", left: 68, top: 14, size: 22, delay: 1.4 },
      { emoji: "🔔", left: 46, top: 2, size: 18, delay: 2 },
      { emoji: "⛄", left: 94, top: 60, size: 24, delay: 0.9 },
      { emoji: "🎅", left: 2, top: 70, size: 20, delay: 1.7 },
    ],
    snow: true,
  },
  halloween: {
    emoji: "🎃",
    title: "Coleção de Halloween",
    tagline: "🕯️ Por tempo limitado",
    subtitle: "Mascotes, fantasias, chapéus, óculos e auras assustadoras pro seu avatar. Doce ou travessura?",
    background:
      "radial-gradient(45% 60% at 90% 0%, rgba(249,115,22,0.35), transparent 70%), radial-gradient(40% 60% at 0% 100%, rgba(126,34,206,0.45), transparent 70%), linear-gradient(160deg, #0c0a09 0%, #1c0a02 45%, #2e1065 100%)",
    borderClass: "border-orange-500/40",
    cardBorderClass: "!border-orange-500/40",
    titleClass: "text-orange-400",
    titleGlow: "0 0 18px rgba(249,115,22,0.7)",
    subtitleClass: "text-orange-100/70",
    buttonClass: "from-orange-500 to-amber-400 shadow-orange-500/30",
    glow: "#f97316",
    decor: [
      { emoji: "🦇", left: 4, top: 6, size: 22, delay: 0 },
      { emoji: "🎃", left: 88, top: 4, size: 28, delay: 0.6 },
      { emoji: "👻", left: 70, top: 14, size: 20, delay: 1.4 },
      { emoji: "🦇", left: 46, top: 2, size: 16, delay: 2 },
      { emoji: "🕸️", left: 94, top: 60, size: 26, delay: 0.9 },
      { emoji: "🦇", left: 2, top: 70, size: 18, delay: 1.7 },
    ],
  },
  grega: {
    emoji: "🏛️",
    title: "Mitologia Grega",
    tagline: "⚡ Direto do Monte Olimpo",
    subtitle: "Deuses, heróis e criaturas lendárias: louros dourados, elmos espartanos, togas, os raios de Zeus e mascotes do Olimpo.",
    background:
      "radial-gradient(45% 60% at 90% 0%, rgba(250,204,21,0.3), transparent 70%), radial-gradient(40% 60% at 0% 100%, rgba(59,130,246,0.45), transparent 70%), linear-gradient(160deg, #0b1437 0%, #1e3a8a 55%, #0c4a6e 100%)",
    borderClass: "border-sky-400/40",
    cardBorderClass: "!border-sky-400/40",
    titleClass: "text-amber-300",
    titleGlow: "0 0 18px rgba(250,204,21,0.6)",
    subtitleClass: "text-sky-100/75",
    buttonClass: "from-sky-400 to-amber-300 shadow-sky-500/30",
    glow: "#38bdf8",
    decor: [
      { emoji: "⚡", left: 4, top: 8, size: 22, delay: 0 },
      { emoji: "🏛️", left: 88, top: 4, size: 28, delay: 0.7 },
      { emoji: "🌿", left: 68, top: 14, size: 20, delay: 1.4 },
      { emoji: "🔱", left: 46, top: 2, size: 18, delay: 2 },
      { emoji: "🏺", left: 94, top: 60, size: 24, delay: 0.9 },
      { emoji: "⚡", left: 2, top: 70, size: 18, delay: 1.7 },
    ],
  },
  egipcia: {
    emoji: "🏺",
    title: "Mitologia Egípcia",
    tagline: "🏜️ Das areias do Nilo",
    subtitle: "Faraós, deuses e segredos do deserto: o nemes dourado, múmias, o sol de Rá, hieróglifos e mascotes sagrados.",
    background:
      "radial-gradient(45% 60% at 90% 0%, rgba(250,204,21,0.35), transparent 70%), radial-gradient(40% 60% at 0% 100%, rgba(13,148,136,0.45), transparent 70%), linear-gradient(160deg, #1c1305 0%, #78350f 50%, #134e4a 100%)",
    borderClass: "border-amber-400/40",
    cardBorderClass: "!border-amber-400/40",
    titleClass: "text-amber-300",
    titleGlow: "0 0 18px rgba(251,191,36,0.7)",
    subtitleClass: "text-amber-100/75",
    buttonClass: "from-amber-400 to-teal-400 shadow-amber-500/30",
    glow: "#fbbf24",
    decor: [
      { emoji: "🔺", left: 4, top: 8, size: 22, delay: 0 },
      { emoji: "☀️", left: 88, top: 4, size: 28, delay: 0.7 },
      { emoji: "🐫", left: 68, top: 14, size: 20, delay: 1.4 },
      { emoji: "🏺", left: 46, top: 2, size: 18, delay: 2 },
      { emoji: "🌴", left: 94, top: 60, size: 24, delay: 0.9 },
      { emoji: "🐍", left: 2, top: 70, size: 18, delay: 1.7 },
    ],
  },
};
