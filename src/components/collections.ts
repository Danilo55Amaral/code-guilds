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
  /** Algo caindo no fundo da seção: neve no Natal, pétalas na Páscoa. `alt` alterna com `char` (ex.: 0 e 1). */
  falling?: { char: string; alt?: string; colorClass: string };
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
    falling: { char: "❄", colorClass: "text-white" },
  },
  pascoa: {
    emoji: "🐰",
    title: "Especial de Páscoa",
    tagline: "🌷 Edição especial de primavera",
    subtitle: "Orelhas de coelho, ovos pintados, fantasia de ovo de chocolate, arco-íris e flores pro seu avatar. Feliz Páscoa!",
    background:
      "radial-gradient(45% 60% at 90% 0%, rgba(253,224,71,0.25), transparent 70%), radial-gradient(45% 60% at 0% 100%, rgba(52,211,153,0.35), transparent 70%), linear-gradient(160deg, #3b0764 0%, #831843 50%, #134e4a 100%)",
    borderClass: "border-pink-300/50",
    cardBorderClass: "!border-pink-300/40",
    titleClass: "text-pink-300",
    titleGlow: "0 0 18px rgba(249,168,212,0.8)",
    subtitleClass: "text-pink-100/80",
    buttonClass: "from-pink-400 to-yellow-300 shadow-pink-500/30",
    glow: "#f9a8d4",
    decor: [
      { emoji: "🥚", left: 4, top: 6, size: 24, delay: 0 },
      { emoji: "🐣", left: 88, top: 4, size: 26, delay: 0.7 },
      { emoji: "🌷", left: 68, top: 14, size: 20, delay: 1.4 },
      { emoji: "🥕", left: 46, top: 2, size: 18, delay: 2 },
      { emoji: "🦋", left: 94, top: 60, size: 22, delay: 0.9 },
      { emoji: "🐰", left: 2, top: 70, size: 22, delay: 1.7 },
    ],
    falling: { char: "🌸", colorClass: "" },
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
  zumbi: {
    emoji: "🧟",
    title: "Apocalipse Zumbi",
    tagline: "☣️ Alerta: surto do Vírus Z",
    subtitle: "Máscara de gás, colete de sobrevivente, cérebro à mostra, mãos brotando da terra e um zumbizinho de estimação. Sobreviva com estilo!",
    background:
      "radial-gradient(45% 60% at 90% 0%, rgba(132,204,22,0.3), transparent 70%), radial-gradient(45% 60% at 0% 100%, rgba(194,65,12,0.35), transparent 70%), linear-gradient(160deg, #0a0f05 0%, #1a2e05 50%, #292524 100%)",
    borderClass: "border-lime-400/40",
    cardBorderClass: "!border-lime-400/40",
    titleClass: "text-lime-300",
    titleGlow: "0 0 18px rgba(163,230,53,0.75)",
    subtitleClass: "text-lime-100/75",
    buttonClass: "from-lime-400 to-orange-500 shadow-lime-500/30",
    glow: "#a3e635",
    decor: [
      { emoji: "🧟", left: 4, top: 6, size: 26, delay: 0 },
      { emoji: "☣️", left: 88, top: 4, size: 24, delay: 0.7 },
      { emoji: "🧠", left: 68, top: 14, size: 20, delay: 1.4 },
      { emoji: "🔦", left: 46, top: 2, size: 18, delay: 2 },
      { emoji: "🦠", left: 94, top: 60, size: 22, delay: 0.9 },
      { emoji: "🖐️", left: 2, top: 70, size: 20, delay: 1.7 },
    ],
    // cinzas caindo do céu da cidade destruída
    falling: { char: "•", colorClass: "text-stone-400/60" },
  },
  alien: {
    emoji: "🛸",
    title: "Ataque Alienígena",
    tagline: "📡 Sinal desconhecido detectado",
    subtitle: "Disco voador, antenas de marciano, capacete espacial, visor laser e um alienzinho de estimação. Eles vieram em paz... será?",
    background:
      "radial-gradient(45% 60% at 90% 0%, rgba(74,222,128,0.3), transparent 70%), radial-gradient(45% 60% at 0% 100%, rgba(139,92,246,0.4), transparent 70%), linear-gradient(160deg, #030712 0%, #1e1b4b 55%, #052e16 100%)",
    borderClass: "border-emerald-400/40",
    cardBorderClass: "!border-emerald-400/40",
    titleClass: "text-emerald-300",
    titleGlow: "0 0 18px rgba(110,231,183,0.8)",
    subtitleClass: "text-emerald-100/75",
    buttonClass: "from-emerald-400 to-violet-500 shadow-emerald-500/30",
    glow: "#6ee7b7",
    decor: [
      { emoji: "🛸", left: 4, top: 6, size: 26, delay: 0 },
      { emoji: "👽", left: 88, top: 4, size: 24, delay: 0.7 },
      { emoji: "🌠", left: 68, top: 14, size: 20, delay: 1.4 },
      { emoji: "📡", left: 46, top: 2, size: 18, delay: 2 },
      { emoji: "👾", left: 94, top: 60, size: 22, delay: 0.9 },
      { emoji: "🚀", left: 2, top: 70, size: 20, delay: 1.7 },
    ],
    // estrelinhas cadentes
    falling: { char: "✦", colorClass: "text-emerald-200/70" },
  },
  futuro: {
    emoji: "🤖",
    title: "Robôs e Inteligência Artificial",
    tagline: "⚡ Sistema online: bem-vindo ao ano 3000",
    subtitle: "Armadura mecha, jaqueta cyberpunk, olho biônico, coroa holográfica, chuva de código e um núcleo de IA de estimação. O futuro chegou!",
    background:
      "radial-gradient(45% 60% at 90% 0%, rgba(34,211,238,0.3), transparent 70%), radial-gradient(45% 60% at 0% 100%, rgba(236,72,153,0.35), transparent 70%), linear-gradient(160deg, #020617 0%, #0c1a3a 55%, #2e1065 100%)",
    borderClass: "border-cyan-400/40",
    cardBorderClass: "!border-cyan-400/40",
    titleClass: "text-cyan-300",
    titleGlow: "0 0 18px rgba(103,232,249,0.8)",
    subtitleClass: "text-cyan-100/75",
    buttonClass: "from-cyan-400 to-fuchsia-500 shadow-cyan-500/30",
    glow: "#22d3ee",
    decor: [
      { emoji: "🤖", left: 4, top: 6, size: 26, delay: 0 },
      { emoji: "💾", left: 88, top: 4, size: 22, delay: 0.7 },
      { emoji: "🛰️", left: 68, top: 14, size: 20, delay: 1.4 },
      { emoji: "⚙️", left: 46, top: 2, size: 18, delay: 2 },
      { emoji: "🔋", left: 94, top: 60, size: 22, delay: 0.9 },
      { emoji: "🕹️", left: 2, top: 70, size: 20, delay: 1.7 },
    ],
    // bits caindo: zeros e uns alternados
    falling: { char: "1", alt: "0", colorClass: "font-mono text-cyan-300/50" },
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
