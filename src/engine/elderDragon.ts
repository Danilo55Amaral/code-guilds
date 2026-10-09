// ============================================================================
// MUNDO 1 — DOMÍNIO DO DRAGÃO ANCESTRAL: as poses do desenho de Vaelzhar, os
// momentos da coreografia (a cena fica em components/multiverse/DragonWorld.tsx)
// e a legenda de cada um. As medidas do desenho (a boca, os pés) ficam junto
// do próprio desenho, em components/multiverse/ElderDragon.tsx.
// ============================================================================

/** As poses do desenho: voando, descendo pra pousar, em pé (empinado), cuspindo fogo, rugindo e agachado pra decolar. */
export type DragonPose = "voo" | "pouso" | "pe" | "fogo" | "rugido" | "impulso";

export type DragonMoment = "chegada" | "rasante" | "pouso" | "exibir" | "runas" | "fogo" | "rugido" | "partida";

/** A legenda de cada momento (a página mostra embaixo). */
export const DRAGON_CAPTIONS: Record<DragonMoment, string> = {
  chegada: "Vaelzhar sobrevoa seus domínios",
  rasante: "Um rasante de fogo corta o céu",
  pouso: "O Dragão Ancestral desce sobre a Pirâmide Dourada",
  exibir: "Ele existe desde o início dos tempos",
  runas: "As runas ancestrais despertam no seu corpo",
  fogo: "As chamas ancestrais incendeiam o horizonte",
  rugido: "O rugido ecoa por todos os universos",
  partida: "E parte de novo, rumo ao infinito",
};

/** Em que segundo do laço cada momento começa (?momento= na página pula direto pra ele). */
export const DRAGON_MOMENT_START: Partial<Record<DragonMoment, number>> = {
  chegada: 0,
  rasante: 4.6,
  pouso: 10,
  exibir: 11.6,
  runas: 14,
  fogo: 18.4,
  rugido: 22.4,
  partida: 27,
};

/** Lê o ?momento= da página (ou começa do início). */
export function dragonStartAt(moment: string | null): number {
  return (moment && DRAGON_MOMENT_START[moment as DragonMoment]) || 0;
}
