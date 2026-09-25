// ============================================================================
// AVATAR — as opções de personalização do personagem do aluno (pele, olhos,
// cabelo, rosto, roupa, óculos e chapéu). Dados estáticos + normalização de
// avatares salvos no formato antigo. O desenho em si fica em components/Avatar.tsx.
// ============================================================================

export type HairStyle = "curto" | "espetado" | "cacheado" | "afro" | "longo" | "rabo" | "coque" | "moicano" | "careca";
export type Expression = "feliz" | "sorrisao" | "confiante" | "serio";
export type FaceDetail = "nenhum" | "sardas" | "bochechas" | "barba" | "bigode" | "cicatriz";
export type Outfit = "tunica" | "moletom" | "manto" | "armadura";
export type BaseEyewear = "nenhum" | "redondo" | "quadrado" | "escuro" | "visor" | "monoculo" | "tapa-olho";
export type BaseHat = "nenhum" | "mago" | "coroa" | "bone" | "elmo" | "pirata" | "fones";
// Peças exclusivas da Loja — não aparecem no editor de avatar, só dá pra usar comprando.
export type ShopEyewear = "neon" | "coracao" | "pixel";
export type ShopHat = "aureola" | "chifres" | "tiara" | "cartola";
export type Eyewear = BaseEyewear | ShopEyewear;
export type Hat = BaseHat | ShopHat;
export type Aura = "nenhum" | "fogo" | "arcana" | "gelo" | "estrelas";
export type Pet = "nenhum" | "dragao" | "coruja" | "gato" | "fantasma" | "robo";

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
  aura: Aura; // só vem de item da Loja equipado
  pet: Pet; // só vem de item da Loja equipado
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

export const EYEWEAR_LABELS: Record<BaseEyewear, string> = {
  nenhum: "Nenhum",
  redondo: "Redondo",
  quadrado: "De programador",
  escuro: "Óculos escuro",
  visor: "Visor futurista",
  monoculo: "Monóculo",
  "tapa-olho": "Tapa-olho",
};

export const HAT_LABELS: Record<BaseHat, string> = {
  nenhum: "Nenhum",
  mago: "Chapéu de mago",
  coroa: "Coroa",
  bone: "Boné",
  elmo: "Elmo",
  pirata: "Chapéu pirata",
  fones: "Fones gamer",
};

export const SHOP_EYEWEAR_LABELS: Record<ShopEyewear, string> = { neon: "Óculos neon", coracao: "Óculos de coração", pixel: "Óculos pixelado" };
export const SHOP_HAT_LABELS: Record<ShopHat, string> = { aureola: "Auréola", chifres: "Chifres", tiara: "Tiara estelar", cartola: "Cartola" };
export const AURA_LABELS: Record<Aura, string> = { nenhum: "Nenhuma", fogo: "Aura de fogo", arcana: "Aura arcana", gelo: "Aura de gelo", estrelas: "Aura estelar" };
export const PET_LABELS: Record<Pet, string> = { nenhum: "Nenhum", dragao: "Dragãozinho", coruja: "Coruja sábia", gato: "Gato", fantasma: "Fantasminha", robo: "Robô" };
/** Emoji desenhado como mascote no canto do avatar. */
export const PET_EMOJI: Record<Exclude<Pet, "nenhum">, string> = { dragao: "🐉", coruja: "🦉", gato: "🐱", fantasma: "👻", robo: "🤖" };
/** Cores de roupa que só a Loja vende. */
export const SHOP_OUTFIT_COLORS: { hex: string; label: string }[] = [
  { hex: "#ca8a04", label: "Ouro real" },
  { hex: "#94a3b8", label: "Prata lunar" },
  { hex: "#7f1d1d", label: "Carmesim sombrio" },
  { hex: "#06b6d4", label: "Ciano neon" },
];

/** Nome de qualquer óculos/chapéu (do editor ou da Loja). */
export function eyewearLabel(e: Eyewear): string {
  return e in SHOP_EYEWEAR_LABELS ? SHOP_EYEWEAR_LABELS[e as ShopEyewear] : EYEWEAR_LABELS[e as BaseEyewear];
}
export function hatLabel(h: Hat): string {
  return h in SHOP_HAT_LABELS ? SHOP_HAT_LABELS[h as ShopHat] : HAT_LABELS[h as BaseHat];
}

// ============================================================================
// VISUAIS DA LOJA — cada item de visual ocupa um "espaço" do avatar. Quando o
// aluno equipa, o valor substitui o do avatar que ele montou no editor (que
// continua guardado e volta ao retirar o item).
// ============================================================================

export type CosmeticSlot = "hat" | "eyewear" | "outfitColor" | "aura" | "pet";

export const COSMETIC_SLOT_LABELS: Record<CosmeticSlot, string> = {
  hat: "Chapéu",
  eyewear: "Óculos",
  outfitColor: "Cor da roupa",
  aura: "Aura",
  pet: "Mascote",
};

export interface Cosmetic {
  slot: CosmeticSlot;
  value: string; // id do chapéu/óculos/aura/mascote, ou o hex da cor da roupa
}

export interface CosmeticOption extends Cosmetic {
  label: string;
  icon: string;
}

/** Tudo que o ADM pode colocar à venda como visual do avatar. */
export const COSMETIC_CATALOG: CosmeticOption[] = [
  { slot: "hat", value: "aureola", label: SHOP_HAT_LABELS.aureola, icon: "😇" },
  { slot: "hat", value: "chifres", label: SHOP_HAT_LABELS.chifres, icon: "😈" },
  { slot: "hat", value: "tiara", label: SHOP_HAT_LABELS.tiara, icon: "👸" },
  { slot: "hat", value: "cartola", label: SHOP_HAT_LABELS.cartola, icon: "🎩" },
  { slot: "eyewear", value: "neon", label: SHOP_EYEWEAR_LABELS.neon, icon: "🕶️" },
  { slot: "eyewear", value: "coracao", label: SHOP_EYEWEAR_LABELS.coracao, icon: "😍" },
  { slot: "eyewear", value: "pixel", label: SHOP_EYEWEAR_LABELS.pixel, icon: "😎" },
  ...SHOP_OUTFIT_COLORS.map((c) => ({ slot: "outfitColor" as const, value: c.hex, label: `Roupa ${c.label.toLowerCase()}`, icon: "👕" })),
  { slot: "aura", value: "fogo", label: AURA_LABELS.fogo, icon: "🔥" },
  { slot: "aura", value: "arcana", label: AURA_LABELS.arcana, icon: "🔮" },
  { slot: "aura", value: "gelo", label: AURA_LABELS.gelo, icon: "❄️" },
  { slot: "aura", value: "estrelas", label: AURA_LABELS.estrelas, icon: "✨" },
  { slot: "pet", value: "dragao", label: PET_LABELS.dragao, icon: PET_EMOJI.dragao },
  { slot: "pet", value: "coruja", label: PET_LABELS.coruja, icon: PET_EMOJI.coruja },
  { slot: "pet", value: "gato", label: PET_LABELS.gato, icon: PET_EMOJI.gato },
  { slot: "pet", value: "fantasma", label: PET_LABELS.fantasma, icon: PET_EMOJI.fantasma },
  { slot: "pet", value: "robo", label: PET_LABELS.robo, icon: PET_EMOJI.robo },
];

export function sameCosmetic(a: Cosmetic | undefined, b: Cosmetic | undefined): boolean {
  return !!a && !!b && a.slot === b.slot && a.value === b.value;
}

/** O avatar com um visual por cima (usado no avatar vestido e no "provar" da Loja). */
export function applyCosmetic(avatar: AvatarConfig, cosmetic: Cosmetic): AvatarConfig {
  return { ...avatar, [cosmetic.slot]: cosmetic.value };
}

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
  aura: "nenhum",
  pet: "nenhum",
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
    eyewear: Math.random() < 0.5 ? "nenhum" : pick(Object.keys(EYEWEAR_LABELS) as BaseEyewear[]),
    hat: Math.random() < 0.5 ? "nenhum" : pick(Object.keys(HAT_LABELS) as BaseHat[]),
    // aura e mascote só vêm da Loja
    aura: "nenhum",
    pet: "nenhum",
  };
}
