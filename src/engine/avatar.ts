// ============================================================================
// AVATAR — as opções de personalização do personagem do aluno (pele, olhos,
// cabelo, rosto, roupa, óculos e chapéu). Dados estáticos + normalização de
// avatares salvos no formato antigo. O desenho em si fica em components/Avatar.tsx.
// ============================================================================

export type HairStyle = "curto" | "espetado" | "cacheado" | "afro" | "longo" | "rabo" | "coque" | "moicano" | "careca";
export type Expression = "feliz" | "sorrisao" | "confiante" | "serio";
export type FaceDetail = "nenhum" | "sardas" | "bochechas" | "barba" | "bigode" | "cicatriz";
export type BaseOutfit = "tunica" | "moletom" | "manto" | "armadura";
export type BaseEyewear = "nenhum" | "redondo" | "quadrado" | "escuro" | "visor" | "monoculo" | "tapa-olho";
export type BaseHat = "nenhum" | "mago" | "coroa" | "bone" | "elmo" | "pirata" | "fones";
// Peças exclusivas da Loja — não aparecem no editor de avatar, só dá pra usar comprando.
// Linhas de cada tipo: do ano todo, Halloween, Mitologia Grega, Mitologia Egípcia, Natal, Páscoa, Apocalipse Zumbi, Ataque Alienígena, Robôs e IA.
export type ShopOutfit =
  | "vampiro" | "esqueleto" | "abobora"
  | "toga" | "hoplita" | "zeus"
  | "farao" | "mumia" | "cleopatra"
  | "papai-noel" | "sueter" | "elfo"
  | "fantasia-coelho" | "ovo-chocolate" | "ovo-pintado"
  | "roupa-zumbi" | "sobrevivente" | "hazmat"
  | "traje-espacial" | "fantasia-alien" | "uniforme-galactico"
  | "armadura-mecha" | "jaqueta-cyberpunk" | "traje-androide";
export type ShopEyewear = "neon" | "coracao" | "pixel"
  | "oculos-abobora" | "vampiro" | "teia"
  | "olhar-medusa" | "oraculo"
  | "horus" | "oculos-farao"
  | "oculos-noel" | "flocos"
  | "oculos-ovo" | "oculos-cenoura"
  | "mascara-gas" | "olhos-zumbi"
  | "oculos-alien" | "visor-laser"
  | "oculos-ra" | "olho-cyborg";
export type ShopHat = "aureola" | "chifres" | "tiara" | "cartola"
  | "bruxa" | "cabeca-abobora" | "orelhas-lobo" | "morcego"
  | "louros" | "elmo-espartano" | "asas-hermes" | "serpentes"
  | "nemes" | "anubis" | "uraeus" | "disco-ra"
  | "gorro-noel" | "chifres-rena" | "azevinho" | "gorro-elfo"
  | "orelhas-coelho" | "coroa-flores" | "casca-ovo" | "chapeu-pascoa"
  | "capacete-tatico" | "cerebro-exposto" | "bandana-sobrevivente" | "chapeu-xerife"
  | "antenas" | "chapeu-aluminio" | "capacete-espacial" | "chapeu-radar"
  | "capacete-cyber" | "coroa-holografica" | "implante-neural" | "antena-robo";
export type Outfit = BaseOutfit | ShopOutfit;
export type Eyewear = BaseEyewear | ShopEyewear;
export type Hat = BaseHat | ShopHat;
export type Aura = "nenhum" | "fogo" | "arcana" | "gelo" | "estrelas"
  | "assombrada" | "lua-sangrenta" | "morcegos" | "abobora"
  | "raios" | "poseidon" | "olimpo"
  | "ra" | "areia" | "hieroglifos"
  | "neve" | "luzes" | "aurora"
  | "ovos" | "flores" | "arco-iris"
  | "radioativa" | "maos-zumbi" | "cidade-ruinas"
  | "raio-trator" | "planetas" | "invasao"
  | "circuito" | "codigo-matrix" | "grade-neon";
export type Pet = "nenhum" | "dragao" | "coruja" | "gato" | "fantasma" | "robo"
  | "abobora" | "lobo" | "morcego" | "aranha" | "caveira"
  | "aguia" | "serpente" | "minotauro" | "golfinho"
  | "bastet" | "escorpiao" | "crocodilo" | "camelo"
  | "rena" | "boneco-neve" | "pinguim" | "elfo"
  | "coelho" | "pintinho" | "ovelha" | "borboleta"
  | "zumbi" | "cerebro" | "rato" | "virus"
  | "alien" | "ovni" | "invasor" | "polvo"
  | "ia-orbe" | "drone" | "gato-robo" | "satelite";

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

export const OUTFIT_LABELS: Record<BaseOutfit, string> = {
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

export const SHOP_OUTFIT_LABELS: Record<ShopOutfit, string> = {
  vampiro: "Fantasia de vampiro",
  esqueleto: "Fantasia de esqueleto",
  abobora: "Fantasia de abóbora",
  toga: "Toga grega",
  hoplita: "Armadura de hoplita",
  zeus: "Manto de Zeus",
  farao: "Traje de faraó",
  mumia: "Fantasia de múmia",
  cleopatra: "Vestido de Cleópatra",
  "papai-noel": "Roupa de Papai Noel",
  sueter: "Suéter de Natal",
  elfo: "Roupa de elfo",
  "fantasia-coelho": "Fantasia de coelho",
  "ovo-chocolate": "Fantasia de ovo de chocolate",
  "ovo-pintado": "Fantasia de ovo pintado",
  "roupa-zumbi": "Roupa de zumbi",
  sobrevivente: "Colete de sobrevivente",
  hazmat: "Traje antivírus",
  "traje-espacial": "Traje de astronauta",
  "fantasia-alien": "Fantasia de alienígena",
  "uniforme-galactico": "Uniforme da Frota Galáctica",
  "armadura-mecha": "Armadura mecha",
  "jaqueta-cyberpunk": "Jaqueta cyberpunk",
  "traje-androide": "Traje de androide",
};
export const SHOP_EYEWEAR_LABELS: Record<ShopEyewear, string> = {
  neon: "Óculos neon",
  coracao: "Óculos de coração",
  pixel: "Óculos pixelado",
  "oculos-abobora": "Óculos Jack-o'-Lantern",
  vampiro: "Óculos de vampiro",
  teia: "Óculos teia de aranha",
  "olhar-medusa": "Olhar da Medusa",
  oraculo: "Venda do Oráculo",
  horus: "Olho de Hórus",
  "oculos-farao": "Óculos do faraó",
  "oculos-noel": "Óculos do Papai Noel",
  flocos: "Óculos floco de neve",
  "oculos-ovo": "Óculos de ovinho",
  "oculos-cenoura": "Óculos de cenoura",
  "mascara-gas": "Máscara de gás",
  "olhos-zumbi": "Olhos de zumbi",
  "oculos-alien": "Olhos de alienígena",
  "visor-laser": "Visor laser",
  "oculos-ra": "Óculos de realidade aumentada",
  "olho-cyborg": "Olho biônico",
};
export const SHOP_HAT_LABELS: Record<ShopHat, string> = {
  aureola: "Auréola",
  chifres: "Chifres",
  tiara: "Tiara estelar",
  cartola: "Cartola",
  bruxa: "Chapéu de bruxa",
  "cabeca-abobora": "Cabeça de abóbora",
  "orelhas-lobo": "Orelhas de lobisomem",
  morcego: "Tiara de morcego",
  louros: "Coroa de louros",
  "elmo-espartano": "Elmo espartano",
  "asas-hermes": "Asas de Hermes",
  serpentes: "Cabelo de serpentes",
  nemes: "Nemes do faraó",
  anubis: "Orelhas de Anúbis",
  uraeus: "Coroa da cobra real",
  "disco-ra": "Disco solar de Rá",
  "gorro-noel": "Gorro do Papai Noel",
  "chifres-rena": "Chifres de rena",
  azevinho: "Coroa de azevinho",
  "gorro-elfo": "Gorro de elfo",
  "orelhas-coelho": "Orelhas de coelho",
  "coroa-flores": "Coroa de flores",
  "casca-ovo": "Casca de ovo",
  "chapeu-pascoa": "Chapéu de Páscoa",
  "capacete-tatico": "Capacete com lanterna",
  "cerebro-exposto": "Cérebro à mostra",
  "bandana-sobrevivente": "Bandana de sobrevivente",
  "chapeu-xerife": "Chapéu de xerife",
  antenas: "Antenas de marciano",
  "chapeu-aluminio": "Chapéu de papel-alumínio",
  "capacete-espacial": "Capacete espacial",
  "chapeu-radar": "Antena parabólica",
  "capacete-cyber": "Capacete cyber",
  "coroa-holografica": "Coroa holográfica",
  "implante-neural": "Implante neural",
  "antena-robo": "Antena e parafusos de robô",
};
export const AURA_LABELS: Record<Aura, string> = {
  nenhum: "Nenhuma",
  fogo: "Aura de fogo",
  arcana: "Aura arcana",
  gelo: "Aura de gelo",
  estrelas: "Aura estelar",
  assombrada: "Aura assombrada",
  "lua-sangrenta": "Aura da lua sangrenta",
  morcegos: "Revoada de morcegos",
  abobora: "Aura de abóboras",
  raios: "Raios de Zeus",
  poseidon: "Mar de Poseidon",
  olimpo: "Luz do Olimpo",
  ra: "Sol de Rá",
  areia: "Tempestade do deserto",
  hieroglifos: "Aura dos hieróglifos",
  neve: "Nevasca",
  luzes: "Luzinhas de Natal",
  aurora: "Aurora boreal",
  ovos: "Aura de ovinhos",
  flores: "Jardim florido",
  "arco-iris": "Arco-íris de primavera",
  radioativa: "Aura radioativa",
  "maos-zumbi": "Horda saindo da terra",
  "cidade-ruinas": "Cidade em ruínas",
  "raio-trator": "Raio trator",
  planetas: "Sistema solar",
  invasao: "Invasão pixelada",
  circuito: "Placa de circuito",
  "codigo-matrix": "Chuva de código",
  "grade-neon": "Horizonte neon",
};
export const PET_LABELS: Record<Pet, string> = {
  nenhum: "Nenhum",
  dragao: "Dragãozinho",
  coruja: "Coruja sábia",
  gato: "Gato",
  fantasma: "Fantasminha",
  robo: "Robô",
  abobora: "Abobrinha assombrada",
  lobo: "Lobinho",
  morcego: "Morceguinho",
  aranha: "Aranha tecelã",
  caveira: "Caveirinha",
  aguia: "Águia de Zeus",
  serpente: "Serpente da Medusa",
  minotauro: "Minotaurinho",
  golfinho: "Golfinho de Poseidon",
  bastet: "Gato de Bastet",
  escorpiao: "Escorpião dourado",
  crocodilo: "Crocodilo de Sobek",
  camelo: "Camelo do deserto",
  rena: "Renazinha",
  "boneco-neve": "Boneco de neve",
  pinguim: "Pinguim do Polo Norte",
  elfo: "Elfo ajudante",
  coelho: "Coelhinho da Páscoa",
  pintinho: "Pintinho",
  ovelha: "Ovelhinha",
  borboleta: "Borboleta",
  zumbi: "Zumbizinho",
  cerebro: "Cérebro saltitante",
  rato: "Rato do esgoto",
  virus: "Vírus Z",
  alien: "Alienzinho",
  ovni: "Mini disco voador",
  invasor: "Invasor pixelado",
  polvo: "Polvo de Marte",
  "ia-orbe": "Núcleo de IA",
  drone: "Drone de estimação",
  "gato-robo": "Gato-robô",
  satelite: "Satélite de bolso",
};
/** Emoji do mascote: ícone na Loja e desenho no canto do avatar (alguns mascotes têm desenho próprio em components/Avatar.tsx). */
export const PET_EMOJI: Record<Exclude<Pet, "nenhum">, string> = {
  dragao: "🐉",
  coruja: "🦉",
  gato: "🐱",
  fantasma: "👻",
  robo: "🤖",
  abobora: "🎃",
  lobo: "🐺",
  morcego: "🦇",
  aranha: "🕷️",
  caveira: "💀",
  aguia: "🦅",
  serpente: "🐍",
  minotauro: "🐂",
  golfinho: "🐬",
  bastet: "🐈",
  escorpiao: "🦂",
  crocodilo: "🐊",
  camelo: "🐫",
  rena: "🦌",
  "boneco-neve": "⛄",
  pinguim: "🐧",
  elfo: "🧝",
  coelho: "🐰",
  pintinho: "🐣",
  ovelha: "🐑",
  borboleta: "🦋",
  zumbi: "🧟",
  cerebro: "🧠",
  rato: "🐀",
  virus: "🦠",
  alien: "👽",
  ovni: "🛸",
  invasor: "👾",
  polvo: "🐙",
  "ia-orbe": "💠",
  drone: "🚁",
  "gato-robo": "⚙️",
  satelite: "🛰️",
};
/** Cores de roupa que só a Loja vende. */
export const SHOP_OUTFIT_COLORS: { hex: string; label: string; collection?: CosmeticCollection }[] = [
  { hex: "#ca8a04", label: "Ouro real" },
  { hex: "#94a3b8", label: "Prata lunar" },
  { hex: "#7f1d1d", label: "Carmesim sombrio" },
  { hex: "#06b6d4", label: "Ciano neon" },
  { hex: "#ea580c", label: "Laranja abóbora", collection: "halloween" },
  { hex: "#18181b", label: "Preto meia-noite", collection: "halloween" },
  { hex: "#65a30d", label: "Verde poção", collection: "halloween" },
  { hex: "#581c87", label: "Roxo bruxa", collection: "halloween" },
  { hex: "#e7e5e4", label: "Mármore do Partenon", collection: "grega" },
  { hex: "#0369a1", label: "Azul do mar Egeu", collection: "grega" },
  { hex: "#4d7c0f", label: "Oliva de Atena", collection: "grega" },
  { hex: "#d6b370", label: "Areia do deserto", collection: "egipcia" },
  { hex: "#0d9488", label: "Turquesa do Nilo", collection: "egipcia" },
  { hex: "#1e3a8a", label: "Lápis-lazúli", collection: "egipcia" },
  { hex: "#b91c1c", label: "Vermelho Noel", collection: "natal" },
  { hex: "#166534", label: "Verde pinheiro", collection: "natal" },
  { hex: "#f8fafc", label: "Branco neve", collection: "natal" },
  { hex: "#f9a8d4", label: "Rosa algodão-doce", collection: "pascoa" },
  { hex: "#c4b5fd", label: "Lilás primavera", collection: "pascoa" },
  { hex: "#86efac", label: "Verde menta", collection: "pascoa" },
  { hex: "#4a5d23", label: "Verde zumbi", collection: "zumbi" },
  { hex: "#57534e", label: "Cinza das cinzas", collection: "zumbi" },
  { hex: "#9a3412", label: "Ferrugem", collection: "zumbi" },
  { hex: "#7ed957", label: "Verde marciano", collection: "alien" },
  { hex: "#cbd5e1", label: "Prata cromada", collection: "alien" },
  { hex: "#6d28d9", label: "Roxo nebulosa", collection: "alien" },
  { hex: "#38bdf8", label: "Azul holograma", collection: "futuro" },
  { hex: "#ec4899", label: "Rosa cyberpunk", collection: "futuro" },
  { hex: "#3f3f46", label: "Grafite de titânio", collection: "futuro" },
];

/** Nome de qualquer roupa/óculos/chapéu (do editor ou da Loja). */
export function outfitLabel(o: Outfit): string {
  return o in SHOP_OUTFIT_LABELS ? SHOP_OUTFIT_LABELS[o as ShopOutfit] : OUTFIT_LABELS[o as BaseOutfit];
}
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

export type CosmeticSlot = "hat" | "eyewear" | "outfit" | "outfitColor" | "aura" | "pet";

export const COSMETIC_SLOT_LABELS: Record<CosmeticSlot, string> = {
  hat: "Chapéu",
  eyewear: "Óculos",
  outfit: "Fantasia",
  outfitColor: "Cor da roupa",
  aura: "Aura",
  pet: "Mascote",
};

/** Coleções temáticas da Loja. O visual de cada uma (cores, enfeites) fica em components/collections.ts. */
export type CosmeticCollection = "natal" | "pascoa" | "halloween" | "zumbi" | "alien" | "futuro" | "grega" | "egipcia";

/** Ordem das coleções no Painel ADM e na Loja (as especiais de datas vêm primeiro). */
export const COLLECTIONS: CosmeticCollection[] = ["natal", "pascoa", "halloween", "zumbi", "alien", "futuro", "grega", "egipcia"];

export const COLLECTION_LABELS: Record<CosmeticCollection, string> = {
  natal: "🎄 Especial de Natal",
  pascoa: "🐰 Especial de Páscoa",
  halloween: "🎃 Halloween",
  zumbi: "🧟 Apocalipse Zumbi",
  alien: "🛸 Ataque Alienígena",
  futuro: "🤖 Robôs e IA",
  grega: "🏛️ Mitologia Grega",
  egipcia: "🏺 Mitologia Egípcia",
};

export interface Cosmetic {
  slot: CosmeticSlot;
  value: string; // id do chapéu/óculos/fantasia/aura/mascote, ou o hex da cor da roupa
}

export interface CosmeticOption extends Cosmetic {
  label: string;
  icon: string;
  collection?: CosmeticCollection;
}

const HALLOWEEN = "halloween" as const;
const GREGA = "grega" as const;
const EGIPCIA = "egipcia" as const;
const NATAL = "natal" as const;
const PASCOA = "pascoa" as const;
const ZUMBI = "zumbi" as const;
const ALIEN = "alien" as const;
const FUTURO = "futuro" as const;

/** Tudo que o ADM pode colocar à venda como visual do avatar. */
export const COSMETIC_CATALOG: CosmeticOption[] = [
  // ---- coleção de Halloween ----
  { slot: "hat", value: "bruxa", label: SHOP_HAT_LABELS.bruxa, icon: "🧙", collection: HALLOWEEN },
  { slot: "hat", value: "cabeca-abobora", label: SHOP_HAT_LABELS["cabeca-abobora"], icon: "🎃", collection: HALLOWEEN },
  { slot: "hat", value: "orelhas-lobo", label: SHOP_HAT_LABELS["orelhas-lobo"], icon: "🐺", collection: HALLOWEEN },
  { slot: "hat", value: "morcego", label: SHOP_HAT_LABELS.morcego, icon: "🦇", collection: HALLOWEEN },
  { slot: "eyewear", value: "oculos-abobora", label: SHOP_EYEWEAR_LABELS["oculos-abobora"], icon: "🎃", collection: HALLOWEEN },
  { slot: "eyewear", value: "vampiro", label: SHOP_EYEWEAR_LABELS.vampiro, icon: "🧛", collection: HALLOWEEN },
  { slot: "eyewear", value: "teia", label: SHOP_EYEWEAR_LABELS.teia, icon: "🕸️", collection: HALLOWEEN },
  { slot: "outfit", value: "vampiro", label: SHOP_OUTFIT_LABELS.vampiro, icon: "🧛", collection: HALLOWEEN },
  { slot: "outfit", value: "esqueleto", label: SHOP_OUTFIT_LABELS.esqueleto, icon: "💀", collection: HALLOWEEN },
  { slot: "outfit", value: "abobora", label: SHOP_OUTFIT_LABELS.abobora, icon: "🎃", collection: HALLOWEEN },
  { slot: "aura", value: "assombrada", label: AURA_LABELS.assombrada, icon: "👻", collection: HALLOWEEN },
  { slot: "aura", value: "lua-sangrenta", label: AURA_LABELS["lua-sangrenta"], icon: "🌕", collection: HALLOWEEN },
  { slot: "aura", value: "morcegos", label: AURA_LABELS.morcegos, icon: "🦇", collection: HALLOWEEN },
  { slot: "aura", value: "abobora", label: AURA_LABELS.abobora, icon: "🎃", collection: HALLOWEEN },
  { slot: "pet", value: "abobora", label: PET_LABELS.abobora, icon: PET_EMOJI.abobora, collection: HALLOWEEN },
  { slot: "pet", value: "lobo", label: PET_LABELS.lobo, icon: PET_EMOJI.lobo, collection: HALLOWEEN },
  { slot: "pet", value: "morcego", label: PET_LABELS.morcego, icon: PET_EMOJI.morcego, collection: HALLOWEEN },
  { slot: "pet", value: "aranha", label: PET_LABELS.aranha, icon: PET_EMOJI.aranha, collection: HALLOWEEN },
  { slot: "pet", value: "caveira", label: PET_LABELS.caveira, icon: PET_EMOJI.caveira, collection: HALLOWEEN },
  { slot: "pet", value: "fantasma", label: PET_LABELS.fantasma, icon: PET_EMOJI.fantasma, collection: HALLOWEEN },
  // ---- coleção Mitologia Grega ----
  { slot: "hat", value: "louros", label: SHOP_HAT_LABELS.louros, icon: "🌿", collection: GREGA },
  { slot: "hat", value: "elmo-espartano", label: SHOP_HAT_LABELS["elmo-espartano"], icon: "⚔️", collection: GREGA },
  { slot: "hat", value: "asas-hermes", label: SHOP_HAT_LABELS["asas-hermes"], icon: "🕊️", collection: GREGA },
  { slot: "hat", value: "serpentes", label: SHOP_HAT_LABELS.serpentes, icon: "🐍", collection: GREGA },
  { slot: "eyewear", value: "olhar-medusa", label: SHOP_EYEWEAR_LABELS["olhar-medusa"], icon: "👁️", collection: GREGA },
  { slot: "eyewear", value: "oraculo", label: SHOP_EYEWEAR_LABELS.oraculo, icon: "🔮", collection: GREGA },
  { slot: "outfit", value: "toga", label: SHOP_OUTFIT_LABELS.toga, icon: "🏛️", collection: GREGA },
  { slot: "outfit", value: "hoplita", label: SHOP_OUTFIT_LABELS.hoplita, icon: "🛡️", collection: GREGA },
  { slot: "outfit", value: "zeus", label: SHOP_OUTFIT_LABELS.zeus, icon: "⚡", collection: GREGA },
  { slot: "aura", value: "raios", label: AURA_LABELS.raios, icon: "⚡", collection: GREGA },
  { slot: "aura", value: "poseidon", label: AURA_LABELS.poseidon, icon: "🌊", collection: GREGA },
  { slot: "aura", value: "olimpo", label: AURA_LABELS.olimpo, icon: "☀️", collection: GREGA },
  { slot: "pet", value: "aguia", label: PET_LABELS.aguia, icon: PET_EMOJI.aguia, collection: GREGA },
  { slot: "pet", value: "serpente", label: PET_LABELS.serpente, icon: PET_EMOJI.serpente, collection: GREGA },
  { slot: "pet", value: "minotauro", label: PET_LABELS.minotauro, icon: PET_EMOJI.minotauro, collection: GREGA },
  { slot: "pet", value: "golfinho", label: PET_LABELS.golfinho, icon: PET_EMOJI.golfinho, collection: GREGA },
  // ---- coleção Mitologia Egípcia ----
  { slot: "hat", value: "nemes", label: SHOP_HAT_LABELS.nemes, icon: "👑", collection: EGIPCIA },
  { slot: "hat", value: "anubis", label: SHOP_HAT_LABELS.anubis, icon: "🐺", collection: EGIPCIA },
  { slot: "hat", value: "uraeus", label: SHOP_HAT_LABELS.uraeus, icon: "🐍", collection: EGIPCIA },
  { slot: "hat", value: "disco-ra", label: SHOP_HAT_LABELS["disco-ra"], icon: "🌞", collection: EGIPCIA },
  { slot: "eyewear", value: "horus", label: SHOP_EYEWEAR_LABELS.horus, icon: "👁️", collection: EGIPCIA },
  { slot: "eyewear", value: "oculos-farao", label: SHOP_EYEWEAR_LABELS["oculos-farao"], icon: "🕶️", collection: EGIPCIA },
  { slot: "outfit", value: "farao", label: SHOP_OUTFIT_LABELS.farao, icon: "👑", collection: EGIPCIA },
  { slot: "outfit", value: "mumia", label: SHOP_OUTFIT_LABELS.mumia, icon: "🧟", collection: EGIPCIA },
  { slot: "outfit", value: "cleopatra", label: SHOP_OUTFIT_LABELS.cleopatra, icon: "💃", collection: EGIPCIA },
  { slot: "aura", value: "ra", label: AURA_LABELS.ra, icon: "🌞", collection: EGIPCIA },
  { slot: "aura", value: "areia", label: AURA_LABELS.areia, icon: "🏜️", collection: EGIPCIA },
  { slot: "aura", value: "hieroglifos", label: AURA_LABELS.hieroglifos, icon: "📜", collection: EGIPCIA },
  { slot: "pet", value: "bastet", label: PET_LABELS.bastet, icon: PET_EMOJI.bastet, collection: EGIPCIA },
  { slot: "pet", value: "escorpiao", label: PET_LABELS.escorpiao, icon: PET_EMOJI.escorpiao, collection: EGIPCIA },
  { slot: "pet", value: "crocodilo", label: PET_LABELS.crocodilo, icon: PET_EMOJI.crocodilo, collection: EGIPCIA },
  { slot: "pet", value: "camelo", label: PET_LABELS.camelo, icon: PET_EMOJI.camelo, collection: EGIPCIA },
  // ---- coleção Especial de Natal ----
  { slot: "hat", value: "gorro-noel", label: SHOP_HAT_LABELS["gorro-noel"], icon: "🎅", collection: NATAL },
  { slot: "hat", value: "chifres-rena", label: SHOP_HAT_LABELS["chifres-rena"], icon: "🦌", collection: NATAL },
  { slot: "hat", value: "azevinho", label: SHOP_HAT_LABELS.azevinho, icon: "🌿", collection: NATAL },
  { slot: "hat", value: "gorro-elfo", label: SHOP_HAT_LABELS["gorro-elfo"], icon: "🔔", collection: NATAL },
  { slot: "eyewear", value: "oculos-noel", label: SHOP_EYEWEAR_LABELS["oculos-noel"], icon: "👓", collection: NATAL },
  { slot: "eyewear", value: "flocos", label: SHOP_EYEWEAR_LABELS.flocos, icon: "❄️", collection: NATAL },
  { slot: "outfit", value: "papai-noel", label: SHOP_OUTFIT_LABELS["papai-noel"], icon: "🎅", collection: NATAL },
  { slot: "outfit", value: "sueter", label: SHOP_OUTFIT_LABELS.sueter, icon: "🧶", collection: NATAL },
  { slot: "outfit", value: "elfo", label: SHOP_OUTFIT_LABELS.elfo, icon: "🧝", collection: NATAL },
  { slot: "aura", value: "neve", label: AURA_LABELS.neve, icon: "❄️", collection: NATAL },
  { slot: "aura", value: "luzes", label: AURA_LABELS.luzes, icon: "💡", collection: NATAL },
  { slot: "aura", value: "aurora", label: AURA_LABELS.aurora, icon: "🌌", collection: NATAL },
  { slot: "pet", value: "rena", label: PET_LABELS.rena, icon: PET_EMOJI.rena, collection: NATAL },
  { slot: "pet", value: "boneco-neve", label: PET_LABELS["boneco-neve"], icon: PET_EMOJI["boneco-neve"], collection: NATAL },
  { slot: "pet", value: "pinguim", label: PET_LABELS.pinguim, icon: PET_EMOJI.pinguim, collection: NATAL },
  { slot: "pet", value: "elfo", label: PET_LABELS.elfo, icon: PET_EMOJI.elfo, collection: NATAL },
  // ---- coleção Especial de Páscoa ----
  { slot: "hat", value: "orelhas-coelho", label: SHOP_HAT_LABELS["orelhas-coelho"], icon: "🐰", collection: PASCOA },
  { slot: "hat", value: "coroa-flores", label: SHOP_HAT_LABELS["coroa-flores"], icon: "🌸", collection: PASCOA },
  { slot: "hat", value: "casca-ovo", label: SHOP_HAT_LABELS["casca-ovo"], icon: "🥚", collection: PASCOA },
  { slot: "hat", value: "chapeu-pascoa", label: SHOP_HAT_LABELS["chapeu-pascoa"], icon: "👒", collection: PASCOA },
  { slot: "eyewear", value: "oculos-ovo", label: SHOP_EYEWEAR_LABELS["oculos-ovo"], icon: "🥚", collection: PASCOA },
  { slot: "eyewear", value: "oculos-cenoura", label: SHOP_EYEWEAR_LABELS["oculos-cenoura"], icon: "🥕", collection: PASCOA },
  { slot: "outfit", value: "fantasia-coelho", label: SHOP_OUTFIT_LABELS["fantasia-coelho"], icon: "🐰", collection: PASCOA },
  { slot: "outfit", value: "ovo-chocolate", label: SHOP_OUTFIT_LABELS["ovo-chocolate"], icon: "🍫", collection: PASCOA },
  { slot: "outfit", value: "ovo-pintado", label: SHOP_OUTFIT_LABELS["ovo-pintado"], icon: "🎨", collection: PASCOA },
  { slot: "aura", value: "ovos", label: AURA_LABELS.ovos, icon: "🥚", collection: PASCOA },
  { slot: "aura", value: "flores", label: AURA_LABELS.flores, icon: "🌷", collection: PASCOA },
  { slot: "aura", value: "arco-iris", label: AURA_LABELS["arco-iris"], icon: "🌈", collection: PASCOA },
  { slot: "pet", value: "coelho", label: PET_LABELS.coelho, icon: PET_EMOJI.coelho, collection: PASCOA },
  { slot: "pet", value: "pintinho", label: PET_LABELS.pintinho, icon: PET_EMOJI.pintinho, collection: PASCOA },
  { slot: "pet", value: "ovelha", label: PET_LABELS.ovelha, icon: PET_EMOJI.ovelha, collection: PASCOA },
  { slot: "pet", value: "borboleta", label: PET_LABELS.borboleta, icon: PET_EMOJI.borboleta, collection: PASCOA },
  // ---- coleção Apocalipse Zumbi ----
  { slot: "hat", value: "capacete-tatico", label: SHOP_HAT_LABELS["capacete-tatico"], icon: "🔦", collection: ZUMBI },
  { slot: "hat", value: "cerebro-exposto", label: SHOP_HAT_LABELS["cerebro-exposto"], icon: "🧠", collection: ZUMBI },
  { slot: "hat", value: "bandana-sobrevivente", label: SHOP_HAT_LABELS["bandana-sobrevivente"], icon: "🎒", collection: ZUMBI },
  { slot: "hat", value: "chapeu-xerife", label: SHOP_HAT_LABELS["chapeu-xerife"], icon: "🤠", collection: ZUMBI },
  { slot: "eyewear", value: "mascara-gas", label: SHOP_EYEWEAR_LABELS["mascara-gas"], icon: "😷", collection: ZUMBI },
  { slot: "eyewear", value: "olhos-zumbi", label: SHOP_EYEWEAR_LABELS["olhos-zumbi"], icon: "👁️", collection: ZUMBI },
  { slot: "outfit", value: "roupa-zumbi", label: SHOP_OUTFIT_LABELS["roupa-zumbi"], icon: "🧟", collection: ZUMBI },
  { slot: "outfit", value: "sobrevivente", label: SHOP_OUTFIT_LABELS.sobrevivente, icon: "🎒", collection: ZUMBI },
  { slot: "outfit", value: "hazmat", label: SHOP_OUTFIT_LABELS.hazmat, icon: "☣️", collection: ZUMBI },
  { slot: "aura", value: "radioativa", label: AURA_LABELS.radioativa, icon: "☢️", collection: ZUMBI },
  { slot: "aura", value: "maos-zumbi", label: AURA_LABELS["maos-zumbi"], icon: "🖐️", collection: ZUMBI },
  { slot: "aura", value: "cidade-ruinas", label: AURA_LABELS["cidade-ruinas"], icon: "🏚️", collection: ZUMBI },
  { slot: "pet", value: "zumbi", label: PET_LABELS.zumbi, icon: PET_EMOJI.zumbi, collection: ZUMBI },
  { slot: "pet", value: "cerebro", label: PET_LABELS.cerebro, icon: PET_EMOJI.cerebro, collection: ZUMBI },
  { slot: "pet", value: "rato", label: PET_LABELS.rato, icon: PET_EMOJI.rato, collection: ZUMBI },
  { slot: "pet", value: "virus", label: PET_LABELS.virus, icon: PET_EMOJI.virus, collection: ZUMBI },
  // ---- coleção Ataque Alienígena ----
  { slot: "hat", value: "antenas", label: SHOP_HAT_LABELS.antenas, icon: "👽", collection: ALIEN },
  { slot: "hat", value: "chapeu-aluminio", label: SHOP_HAT_LABELS["chapeu-aluminio"], icon: "🛡️", collection: ALIEN },
  { slot: "hat", value: "capacete-espacial", label: SHOP_HAT_LABELS["capacete-espacial"], icon: "🚀", collection: ALIEN },
  { slot: "hat", value: "chapeu-radar", label: SHOP_HAT_LABELS["chapeu-radar"], icon: "📡", collection: ALIEN },
  { slot: "eyewear", value: "oculos-alien", label: SHOP_EYEWEAR_LABELS["oculos-alien"], icon: "👽", collection: ALIEN },
  { slot: "eyewear", value: "visor-laser", label: SHOP_EYEWEAR_LABELS["visor-laser"], icon: "🥽", collection: ALIEN },
  { slot: "outfit", value: "traje-espacial", label: SHOP_OUTFIT_LABELS["traje-espacial"], icon: "🚀", collection: ALIEN },
  { slot: "outfit", value: "fantasia-alien", label: SHOP_OUTFIT_LABELS["fantasia-alien"], icon: "👽", collection: ALIEN },
  { slot: "outfit", value: "uniforme-galactico", label: SHOP_OUTFIT_LABELS["uniforme-galactico"], icon: "🌌", collection: ALIEN },
  { slot: "aura", value: "raio-trator", label: AURA_LABELS["raio-trator"], icon: "🛸", collection: ALIEN },
  { slot: "aura", value: "planetas", label: AURA_LABELS.planetas, icon: "🌍", collection: ALIEN },
  { slot: "aura", value: "invasao", label: AURA_LABELS.invasao, icon: "👾", collection: ALIEN },
  { slot: "pet", value: "alien", label: PET_LABELS.alien, icon: PET_EMOJI.alien, collection: ALIEN },
  { slot: "pet", value: "ovni", label: PET_LABELS.ovni, icon: PET_EMOJI.ovni, collection: ALIEN },
  { slot: "pet", value: "invasor", label: PET_LABELS.invasor, icon: PET_EMOJI.invasor, collection: ALIEN },
  { slot: "pet", value: "polvo", label: PET_LABELS.polvo, icon: PET_EMOJI.polvo, collection: ALIEN },
  // ---- coleção Robôs e IA ----
  { slot: "hat", value: "capacete-cyber", label: SHOP_HAT_LABELS["capacete-cyber"], icon: "⚡", collection: FUTURO },
  { slot: "hat", value: "coroa-holografica", label: SHOP_HAT_LABELS["coroa-holografica"], icon: "👑", collection: FUTURO },
  { slot: "hat", value: "implante-neural", label: SHOP_HAT_LABELS["implante-neural"], icon: "🧠", collection: FUTURO },
  { slot: "hat", value: "antena-robo", label: SHOP_HAT_LABELS["antena-robo"], icon: "📶", collection: FUTURO },
  { slot: "eyewear", value: "oculos-ra", label: SHOP_EYEWEAR_LABELS["oculos-ra"], icon: "🥽", collection: FUTURO },
  { slot: "eyewear", value: "olho-cyborg", label: SHOP_EYEWEAR_LABELS["olho-cyborg"], icon: "🔴", collection: FUTURO },
  { slot: "outfit", value: "armadura-mecha", label: SHOP_OUTFIT_LABELS["armadura-mecha"], icon: "🤖", collection: FUTURO },
  { slot: "outfit", value: "jaqueta-cyberpunk", label: SHOP_OUTFIT_LABELS["jaqueta-cyberpunk"], icon: "🧥", collection: FUTURO },
  { slot: "outfit", value: "traje-androide", label: SHOP_OUTFIT_LABELS["traje-androide"], icon: "💠", collection: FUTURO },
  { slot: "aura", value: "circuito", label: AURA_LABELS.circuito, icon: "🔌", collection: FUTURO },
  { slot: "aura", value: "codigo-matrix", label: AURA_LABELS["codigo-matrix"], icon: "💻", collection: FUTURO },
  { slot: "aura", value: "grade-neon", label: AURA_LABELS["grade-neon"], icon: "🌆", collection: FUTURO },
  { slot: "pet", value: "ia-orbe", label: PET_LABELS["ia-orbe"], icon: PET_EMOJI["ia-orbe"], collection: FUTURO },
  { slot: "pet", value: "drone", label: PET_LABELS.drone, icon: PET_EMOJI.drone, collection: FUTURO },
  { slot: "pet", value: "gato-robo", label: PET_LABELS["gato-robo"], icon: PET_EMOJI["gato-robo"], collection: FUTURO },
  { slot: "pet", value: "satelite", label: PET_LABELS.satelite, icon: PET_EMOJI.satelite, collection: FUTURO },
  // ---- visuais do ano todo ----
  { slot: "hat", value: "aureola", label: SHOP_HAT_LABELS.aureola, icon: "😇" },
  { slot: "hat", value: "chifres", label: SHOP_HAT_LABELS.chifres, icon: "😈" },
  { slot: "hat", value: "tiara", label: SHOP_HAT_LABELS.tiara, icon: "👸" },
  { slot: "hat", value: "cartola", label: SHOP_HAT_LABELS.cartola, icon: "🎩" },
  { slot: "eyewear", value: "neon", label: SHOP_EYEWEAR_LABELS.neon, icon: "🕶️" },
  { slot: "eyewear", value: "coracao", label: SHOP_EYEWEAR_LABELS.coracao, icon: "😍" },
  { slot: "eyewear", value: "pixel", label: SHOP_EYEWEAR_LABELS.pixel, icon: "😎" },
  ...SHOP_OUTFIT_COLORS.map((c) => ({
    slot: "outfitColor" as const,
    value: c.hex,
    label: `Roupa ${c.label.toLowerCase()}`,
    icon: "👕",
    ...(c.collection && { collection: c.collection }),
  })),
  { slot: "aura", value: "fogo", label: AURA_LABELS.fogo, icon: "🔥" },
  { slot: "aura", value: "arcana", label: AURA_LABELS.arcana, icon: "🔮" },
  { slot: "aura", value: "gelo", label: AURA_LABELS.gelo, icon: "❄️" },
  { slot: "aura", value: "estrelas", label: AURA_LABELS.estrelas, icon: "✨" },
  { slot: "pet", value: "dragao", label: PET_LABELS.dragao, icon: PET_EMOJI.dragao },
  { slot: "pet", value: "coruja", label: PET_LABELS.coruja, icon: PET_EMOJI.coruja },
  { slot: "pet", value: "gato", label: PET_LABELS.gato, icon: PET_EMOJI.gato },
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
