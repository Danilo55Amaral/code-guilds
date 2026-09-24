// ============================================================================
// AVATAR — as opções de personalização do personagem do aluno (pele, olhos,
// cabelo, rosto, roupa, óculos e chapéu). Dados estáticos + normalização de
// avatares salvos no formato antigo. O desenho em si fica em components/Avatar.tsx.
// ============================================================================

export type HairStyle = "curto" | "espetado" | "cacheado" | "afro" | "longo" | "rabo" | "coque" | "moicano" | "careca";
export type Expression = "feliz" | "sorrisao" | "confiante" | "serio";
export type FaceDetail = "nenhum" | "sardas" | "bochechas" | "barba" | "bigode" | "cicatriz";
export type Outfit = "tunica" | "moletom" | "manto" | "armadura";
export type Eyewear = "nenhum" | "redondo" | "quadrado" | "escuro" | "visor" | "monoculo" | "tapa-olho";
export type Hat = "nenhum" | "mago" | "coroa" | "bone" | "elmo" | "pirata" | "fones";

export interface AvatarConfig {
  skinTone: number; // índice em SKIN_TONES
  eyeColor: string; // hex
  hairStyle: HairStyle;
  hairColor: string; // hex
  expression: Expression;
  faceDetail: FaceDetail;
  outfit: Outfit;
  outfitColor: string; // hex
  eyewear: Eyewear;
  hat: Hat;
}

export const SKIN_TONES = ["#ffe0cc", "#fcd9b6", "#f5c9a0", "#f1c27d", "#e0ac69", "#d19a66", "#c68642", "#a86b3c", "#8d5524", "#5c3a21"];

export const EYE_COLORS: { hex: string; label: string }[] = [
  { hex: "#3b2314", label: "Castanho escuro" },
  { hex: "#6b4423", label: "Castanho" },
  { hex: "#a0712b", label: "Mel" },
  { hex: "#3f8f4f", label: "Verde" },
  { hex: "#3b82c4", label: "Azul" },
  { hex: "#7c8a99", label: "Cinza" },
  { hex: "#8b5cf6", label: "Violeta (mágico)" },
  { hex: "#dc2626", label: "Vermelho (mágico)" },
];

export const HAIR_COLORS: { hex: string; label: string }[] = [
  { hex: "#1f1b24", label: "Preto" },
  { hex: "#3b2417", label: "Castanho escuro" },
  { hex: "#6b3f2a", label: "Castanho" },
  { hex: "#b4441c", label: "Ruivo" },
  { hex: "#e3b448", label: "Loiro" },
  { hex: "#efe6cf", label: "Platinado" },
  { hex: "#9ca3af", label: "Grisalho" },
  { hex: "#f472b6", label: "Rosa" },
  { hex: "#8b5cf6", label: "Roxo" },
  { hex: "#3b82f6", label: "Azul" },
  { hex: "#22c55e", label: "Verde" },
];

export const OUTFIT_COLORS: { hex: string; label: string }[] = [
  { hex: "#7c3aed", label: "Roxo" },
  { hex: "#2563eb", label: "Azul" },
  { hex: "#059669", label: "Verde" },
  { hex: "#dc2626", label: "Vermelho" },
  { hex: "#d97706", label: "Âmbar" },
  { hex: "#db2777", label: "Rosa" },
  { hex: "#334155", label: "Grafite" },
  { hex: "#e2e8f0", label: "Branco" },
];

export const HAIR_STYLE_LABELS: Record<HairStyle, string> = {
  curto: "Curto",
  espetado: "Espetado",
  cacheado: "Cacheado",
  afro: "Black",
  longo: "Longo",
  rabo: "Rabo de cavalo",
  coque: "Coque",
  moicano: "Moicano",
  careca: "Careca",
};

export const EXPRESSION_LABELS: Record<Expression, string> = {
  feliz: "Feliz",
  sorrisao: "Sorrisão",
  confiante: "Confiante",
  serio: "Sério",
};

export const FACE_DETAIL_LABELS: Record<FaceDetail, string> = {
  nenhum: "Nenhum",
  sardas: "Sardas",
  bochechas: "Bochechas",
  barba: "Barba",
  bigode: "Bigode",
  cicatriz: "Cicatriz",
};

export const OUTFIT_LABELS: Record<Outfit, string> = {
  tunica: "Túnica",
  moletom: "Moletom",
  manto: "Manto de mago",
  armadura: "Armadura",
};

export const EYEWEAR_LABELS: Record<Eyewear, string> = {
  nenhum: "Nenhum",
  redondo: "Redondo",
  quadrado: "De programador",
  escuro: "Óculos escuro",
  visor: "Visor futurista",
  monoculo: "Monóculo",
  "tapa-olho": "Tapa-olho",
};

export const HAT_LABELS: Record<Hat, string> = {
  nenhum: "Nenhum",
  mago: "Chapéu de mago",
  coroa: "Coroa",
  bone: "Boné",
  elmo: "Elmo",
  pirata: "Chapéu pirata",
  fones: "Fones gamer",
};

export const DEFAULT_AVATAR: AvatarConfig = {
  skinTone: 3,
  eyeColor: "#6b4423",
  hairStyle: "curto",
  hairColor: "#6b3f2a",
  expression: "feliz",
  faceDetail: "nenhum",
  outfit: "tunica",
  outfitColor: "#7c3aed",
  eyewear: "nenhum",
  hat: "nenhum",
};

// Paleta antiga tinha 5 tons; cada um aponta pro tom mais parecido da paleta nova.
const LEGACY_SKIN_TONE_MAP = [1, 3, 4, 6, 8];

/**
 * Avatares salvos antes da versão atual só tinham skinTone (0-4), hairStyle,
 * hairColor e glasses (boolean). Completa o que falta com o padrão e converte
 * os campos antigos — assim nenhum aluno já cadastrado quebra.
 */
export function normalizeAvatar(raw: Partial<AvatarConfig> & { glasses?: boolean }): AvatarConfig {
  const { glasses, ...rest } = raw;
  const isLegacy = raw.eyeColor === undefined;
  const skinTone = isLegacy ? (LEGACY_SKIN_TONE_MAP[raw.skinTone ?? 1] ?? DEFAULT_AVATAR.skinTone) : (raw.skinTone ?? DEFAULT_AVATAR.skinTone);
  return {
    ...DEFAULT_AVATAR,
    ...rest,
    skinTone: Math.min(Math.max(skinTone, 0), SKIN_TONES.length - 1),
    hairStyle: raw.hairStyle && raw.hairStyle in HAIR_STYLE_LABELS ? raw.hairStyle : DEFAULT_AVATAR.hairStyle,
    eyewear: raw.eyewear ?? (glasses ? "quadrado" : "nenhum"),
  };
}

function pick<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

/** Botão "🎲 Aleatório" do editor. */
export function randomAvatar(): AvatarConfig {
  return {
    skinTone: Math.floor(Math.random() * SKIN_TONES.length),
    eyeColor: pick(EYE_COLORS).hex,
    hairStyle: pick(Object.keys(HAIR_STYLE_LABELS) as HairStyle[]),
    hairColor: pick(HAIR_COLORS).hex,
    expression: pick(Object.keys(EXPRESSION_LABELS) as Expression[]),
    // metade das vezes sem detalhe/óculos/chapéu, pra não sair tudo carregado
    faceDetail: Math.random() < 0.5 ? "nenhum" : pick(Object.keys(FACE_DETAIL_LABELS) as FaceDetail[]),
    outfit: pick(Object.keys(OUTFIT_LABELS) as Outfit[]),
    outfitColor: pick(OUTFIT_COLORS).hex,
    eyewear: Math.random() < 0.5 ? "nenhum" : pick(Object.keys(EYEWEAR_LABELS) as Eyewear[]),
    hat: Math.random() < 0.5 ? "nenhum" : pick(Object.keys(HAT_LABELS) as Hat[]),
  };
}
