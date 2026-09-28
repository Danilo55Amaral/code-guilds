// ============================================================================
// MUNDO 1 — DOMÍNIO DO DRAGÃO ANCESTRAL: as poses e medidas do desenho de
// Vaelzhar, os momentos da coreografia (a cena fica em
// components/multiverse/DragonWorld.tsx) e a legenda de cada um.
// ============================================================================

/** As poses do desenho (components/multiverse/ElderDragon.tsx). */
export type DragonPose = "voo" | "pouso" | "exibir" | "magia" | "rugido" | "impulso";

/** Onde ficam as garras dos pés no desenho de 600×600 (âncora pra posicionar o dragão na cena). */
export const DRAGON_FEET = { x: 300, y: 575, size: 600 };
/** A boca e o centro da cabeça no desenho (pra o fogo e o buraco negro saírem do lugar certo). */
export const DRAGON_MOUTH = { x: 300, y: 222 };
export const DRAGON_HEAD = { x: 300, y: 150 };

export type DragonMoment = "chegada" | "rasante" | "pouso" | "exibir" | "magia" | "rugido" | "partida";

/** A legenda de cada momento (a página mostra embaixo). */
export const DRAGON_CAPTIONS: Record<DragonMoment, string> = {
  chegada: "Vaelzhar sobrevoa seus domínios",
  rasante: "Chamas azul-esverdeadas cortam o céu",
  pouso: "O Dragão Ancestral desce sobre a Pirâmide Dourada",
  exibir: "Ele existe desde o início dos tempos",
  magia: "Com um gesto, ele abre um buraco negro",
  rugido: "O rugido ecoa por todos os universos",
  partida: "E parte de novo, rumo ao infinito",
};

/** Em que segundo do laço cada momento começa (?momento= na página pula direto pra ele). */
export const DRAGON_MOMENT_START: Partial<Record<DragonMoment, number>> = { chegada: 0, rasante: 5.2, pouso: 10.2, magia: 14.2, rugido: 20.2, partida: 26.8 };

/** Lê o ?momento= da página (ou começa do início). */
export function dragonStartAt(moment: string | null): number {
  return (moment && DRAGON_MOMENT_START[moment as DragonMoment]) || 0;
}
