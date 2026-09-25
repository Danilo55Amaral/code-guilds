// ============================================================================
// SHOP — a Loja da Academia. O ADM cadastra os itens à venda (itens comuns,
// como poções de XP, ou visuais exclusivos do avatar); os alunos compram com
// moedas. Mesmo padrão de CRUD em localStorage de missionsStore.ts: na
// primeira vez, a Loja já vem com alguns itens pra não abrir vazia.
//
// Comprar desconta as moedas, põe o item no inventário e manda uma mensagem
// 🛒 Compra pro aluno. Visual do avatar não pode ser comprado duas vezes.
// ============================================================================

import { Rarity } from "./missions";
import { Cosmetic, CosmeticCollection, sameCosmetic } from "./avatar";
import { InventoryItem, getStudent, updateStudent, ownsCosmetic } from "./students";
import { SYSTEM_SENDER_ID, sendMessage, shopPurchaseMessage } from "./messages";

export interface ShopItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: Rarity;
  price: number; // quanto custa na Loja
  value: number; // quanto o sistema paga se o aluno vender depois
  xp: number; // XP ao usar (0 = não consumível); visuais nunca são consumíveis
  cosmetic?: Cosmetic; // presente = é um visual do avatar
  featured: boolean; // aparece no destaque do topo da Loja
  collection?: CosmeticCollection; // item de coleção temática (ganha seção própria na Loja)
  sold: number; // quantas vezes já foi comprado
  createdAt: string;
}

export type ShopItemData = Omit<ShopItem, "id" | "sold" | "createdAt">;

const SHOP_KEY = "cg-shop";

const SEED_DATE = "2026-01-01T00:00:00.000Z";

const DEFAULT_SHOP: ShopItem[] = [
  {
    id: "loja-aureola",
    name: "Auréola Divina",
    icon: "😇",
    description: "Um anel de luz que flutua sobre a sua cabeça. Dizem que só os programadores de código limpo conseguem mantê-la acesa.",
    rarity: "lendario",
    price: 300,
    value: 150,
    xp: 0,
    cosmetic: { slot: "hat", value: "aureola" },
    featured: true,
  },
  {
    id: "loja-dragao",
    name: "Dragãozinho de Estimação",
    icon: "🐉",
    description: "Um filhote de dragão que vive no seu ombro e cospe fogo em bugs. Leal até o último commit.",
    rarity: "lendario",
    price: 350,
    value: 175,
    xp: 0,
    cosmetic: { slot: "pet", value: "dragao" },
    featured: true,
  },
  {
    id: "loja-aura-fogo",
    name: "Aura de Fogo",
    icon: "🔥",
    description: "Chamas que dançam ao seu redor — pra todo mundo ver que você está pegando fogo nas missões.",
    rarity: "epico",
    price: 220,
    value: 110,
    xp: 0,
    cosmetic: { slot: "aura", value: "fogo" },
    featured: true,
  },
  {
    id: "loja-oculos-neon",
    name: "Óculos Neon",
    icon: "🕶️",
    description: "Lentes que brilham em rosa e ciano. Perfeitos pra codar de madrugada.",
    rarity: "raro",
    price: 120,
    value: 60,
    xp: 0,
    cosmetic: { slot: "eyewear", value: "neon" },
    featured: false,
  },
  {
    id: "loja-chifres",
    name: "Chifres do Caos",
    icon: "😈",
    description: "Pra quem resolve os bugs mais cabeludos com um sorriso de canto.",
    rarity: "epico",
    price: 180,
    value: 90,
    xp: 0,
    cosmetic: { slot: "hat", value: "chifres" },
    featured: false,
  },
  {
    id: "loja-coruja",
    name: "Coruja Sábia",
    icon: "🦉",
    description: "Sua conselheira noturna. Não sabe programar, mas faz cara de quem sabe.",
    rarity: "raro",
    price: 150,
    value: 75,
    xp: 0,
    cosmetic: { slot: "pet", value: "coruja" },
    featured: false,
  },
  {
    id: "loja-roupa-ouro",
    name: "Traje de Ouro Real",
    icon: "👕",
    description: "Tinge a sua roupa de ouro puro. Brilho garantido no ranking da casa.",
    rarity: "epico",
    price: 200,
    value: 100,
    xp: 0,
    cosmetic: { slot: "outfitColor", value: "#ca8a04" },
    featured: false,
  },
  {
    id: "loja-aura-estelar",
    name: "Aura Estelar",
    icon: "✨",
    description: "Estrelinhas que giram ao seu redor, como se o universo estivesse torcendo por você.",
    rarity: "raro",
    price: 160,
    value: 80,
    xp: 0,
    cosmetic: { slot: "aura", value: "estrelas" },
    featured: false,
  },
  {
    id: "loja-pocao-xp",
    name: "Poção de XP",
    icon: "🧪",
    description: "Um gole e pronto: +120 XP direto na veia. Use no Inventário.",
    rarity: "comum",
    price: 40,
    value: 15,
    xp: 120,
    featured: false,
  },
  {
    id: "loja-pergaminho",
    name: "Pergaminho do Saber",
    icon: "📜",
    description: "Anotações de um mestre antigo. Ler (usar) dá +300 XP.",
    rarity: "raro",
    price: 90,
    value: 35,
    xp: 300,
    featured: false,
  },
].map((item) => ({ ...item, sold: 0, createdAt: SEED_DATE }) as ShopItem);

function readAll(): ShopItem[] {
  if (typeof window === "undefined") return DEFAULT_SHOP;
  try {
    const raw = window.localStorage.getItem(SHOP_KEY);
    if (!raw) {
      writeAll(DEFAULT_SHOP);
      return DEFAULT_SHOP;
    }
    return JSON.parse(raw) as ShopItem[];
  } catch {
    return DEFAULT_SHOP;
  }
}

function writeAll(items: ShopItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SHOP_KEY, JSON.stringify(items));
}

/** Destaques primeiro, depois os mais novos. */
export function listShopItems(): ShopItem[] {
  return readAll().sort((a, b) => Number(b.featured) - Number(a.featured) || b.createdAt.localeCompare(a.createdAt));
}

/** Valida o cadastro do ADM. Devolve a mensagem de erro, ou null. `exceptId` ignora o próprio item. */
export function validateShopItem(data: ShopItemData, exceptId?: string): string | null {
  if (!data.name.trim()) return "Informe o nome do item.";
  if (!data.description.trim()) return "Escreva uma descrição — ela aparece no card da Loja.";
  if (!Number.isInteger(data.price) || data.price < 1) return "O preço precisa ser de pelo menos 1 moeda.";
  if (data.cosmetic && readAll().some((i) => i.id !== exceptId && sameCosmetic(i.cosmetic, data.cosmetic))) {
    return "Esse visual já está à venda na Loja.";
  }
  return null;
}

/** Quem chama deve validar antes com validateShopItem(). */
export function createShopItem(data: ShopItemData): ShopItem {
  const item: ShopItem = {
    ...data,
    xp: data.cosmetic ? 0 : data.xp,
    id: `loja_${Date.now()}_${Math.round(Math.random() * 9999)}`,
    sold: 0,
    createdAt: new Date().toISOString(),
  };
  writeAll([...readAll(), item]);
  return item;
}

export function updateShopItem(id: string, data: ShopItemData) {
  writeAll(readAll().map((i) => (i.id === id ? { ...i, ...data, xp: data.cosmetic ? 0 : data.xp, id } : i)));
}

/** Tirar da Loja não mexe em quem já comprou — o item continua no inventário dessas pessoas. */
export function deleteShopItem(id: string) {
  writeAll(readAll().filter((i) => i.id !== id));
}

// ============================================================================
// COLEÇÕES TEMÁTICAS — itens prontos (nome, descrição, preço) que o ADM
// coloca à venda de uma vez pelo Painel ADM, e tira quando quiser.
// Revenda = metade do preço, como nos outros itens da Loja.
//
// COLEÇÃO DE HALLOWEEN
// ============================================================================

type Preset = Omit<ShopItemData, "value" | "featured" | "collection" | "xp"> & { featured?: boolean; xp?: number };

const HALLOWEEN_PRESETS: Preset[] = [
  // mascotes
  { name: "Abobrinha Assombrada", icon: "🎃", rarity: "epico", price: 240, featured: true, cosmetic: { slot: "pet", value: "abobora" },
    description: "Uma abóbora de Halloween que mora no seu ombro e sorri no escuro. Cuidado: ela morde bugs." },
  { name: "Lobinho da Lua Cheia", icon: "🐺", rarity: "lendario", price: 380, featured: true, cosmetic: { slot: "pet", value: "lobo" },
    description: "Uiva toda vez que você acerta uma questão. Na lua cheia, fica ainda mais leal (e mais peludo)." },
  { name: "Morceguinho Noturno", icon: "🦇", rarity: "raro", price: 160, cosmetic: { slot: "pet", value: "morcego" },
    description: "Dorme de cabeça pra baixo o dia inteiro e acorda na hora das missões noturnas." },
  { name: "Aranha Tecelã", icon: "🕷️", rarity: "raro", price: 150, cosmetic: { slot: "pet", value: "aranha" },
    description: "Tece teias de código perfeitas enquanto você dorme. Oito patas, zero bugs." },
  { name: "Caveirinha Tagarela", icon: "💀", rarity: "epico", price: 210, cosmetic: { slot: "pet", value: "caveira" },
    description: "Não para de contar piadas de programador. Todas ossudas." },
  { name: "Fantasminha Camarada", icon: "👻", rarity: "raro", price: 170, cosmetic: { slot: "pet", value: "fantasma" },
    description: "Um fantasma gente boa que atravessa paredes pra te entregar a resposta certa (só que não)." },
  // chapéus
  { name: "Chapéu de Bruxa", icon: "🧙", rarity: "epico", price: 230, featured: true, cosmetic: { slot: "hat", value: "bruxa" },
    description: "Pontudo, preto e com fivela dourada. Aumenta em 100% a vontade de gargalhar na lua cheia." },
  { name: "Cabeça de Abóbora", icon: "🎃", rarity: "lendario", price: 320, cosmetic: { slot: "hat", value: "cabeca-abobora" },
    description: "Uma Jack-o'-Lantern de verdade na sua cabeça, com olhos que brilham. O item mais assustador da temporada!" },
  { name: "Orelhas de Lobisomem", icon: "🐺", rarity: "raro", price: 140, cosmetic: { slot: "hat", value: "orelhas-lobo" },
    description: "Orelhas peludas que aparecem sozinhas quando a lua fica cheia. Auuu!" },
  { name: "Tiara de Morcego", icon: "🦇", rarity: "raro", price: 130, cosmetic: { slot: "hat", value: "morcego" },
    description: "Um morcego de olhinhos vermelhos pousado na sua cabeça. Estiloso e levemente sinistro." },
  // óculos
  { name: "Óculos Jack-o'-Lantern", icon: "🎃", rarity: "raro", price: 120, cosmetic: { slot: "eyewear", value: "oculos-abobora" },
    description: "Lentes triangulares cor de abóbora, iguaizinhas aos olhos de uma lanterna de Halloween." },
  { name: "Óculos de Vampiro", icon: "🧛", rarity: "epico", price: 170, cosmetic: { slot: "eyewear", value: "vampiro" },
    description: "Lentes vermelho-sangue pra enxergar no escuro. Protegem do sol (vampiros agradecem)." },
  { name: "Óculos Teia de Aranha", icon: "🕸️", rarity: "raro", price: 130, cosmetic: { slot: "eyewear", value: "teia" },
    description: "Teias nas lentes e uma aranhinha pendurada na haste. Ela não morde… muito." },
  // fantasias
  { name: "Fantasia de Vampiro", icon: "🧛", rarity: "lendario", price: 350, featured: true, cosmetic: { slot: "outfit", value: "vampiro" },
    description: "Capa preta de gola alta forrada de vermelho e um broche de rubi. Conde Drácula aprovaria." },
  { name: "Fantasia de Esqueleto", icon: "💀", rarity: "epico", price: 260, cosmetic: { slot: "outfit", value: "esqueleto" },
    description: "Um traje preto com os ossos à mostra. Perfeito pra quem estuda até os ossos." },
  { name: "Fantasia de Abóbora", icon: "🎃", rarity: "epico", price: 250, cosmetic: { slot: "outfit", value: "abobora" },
    description: "Vire uma abóbora de Halloween completa, com carinha brilhando na barriga e folhinhas no pescoço." },
  // cores de roupa
  { name: "Traje Laranja Abóbora", icon: "👕", rarity: "comum", price: 80, cosmetic: { slot: "outfitColor", value: "#ea580c" },
    description: "Tinge a sua roupa com o laranja mais Halloween que existe." },
  { name: "Traje Preto Meia-Noite", icon: "👕", rarity: "raro", price: 100, cosmetic: { slot: "outfitColor", value: "#18181b" },
    description: "Preto como a noite de 31 de outubro. Combina com tudo que é assustador." },
  { name: "Traje Verde Poção", icon: "👕", rarity: "comum", price: 80, cosmetic: { slot: "outfitColor", value: "#65a30d" },
    description: "Da cor da poção borbulhando no caldeirão da bruxa." },
  { name: "Traje Roxo Bruxa", icon: "👕", rarity: "raro", price: 100, cosmetic: { slot: "outfitColor", value: "#581c87" },
    description: "Um roxo profundo e misterioso, direto do guarda-roupa da bruxa mais poderosa do reino." },
  // auras
  { name: "Aura Assombrada", icon: "👻", rarity: "epico", price: 240, cosmetic: { slot: "aura", value: "assombrada" },
    description: "Um brilho verde fantasmagórico com fantasminhas flutuando ao seu redor. Buuu!" },
  { name: "Aura da Lua Sangrenta", icon: "🌕", rarity: "lendario", price: 360, cosmetic: { slot: "aura", value: "lua-sangrenta" },
    description: "Uma lua vermelha gigante atrás de você e morcegos voando. A aura mais sinistra do castelo." },
  { name: "Revoada de Morcegos", icon: "🦇", rarity: "epico", price: 220, cosmetic: { slot: "aura", value: "morcegos" },
    description: "Uma nuvem de morcegos rodopiando ao seu redor num céu roxo." },
  { name: "Aura de Abóboras", icon: "🎃", rarity: "raro", price: 180, cosmetic: { slot: "aura", value: "abobora" },
    description: "Aboborinhas iluminadas flutuando num brilho laranja. Doce ou travessura?" },
  // itens comuns
  { name: "Doce ou Travessura", icon: "🍬", rarity: "comum", price: 30, xp: 100,
    description: "Um doce encantado de Halloween. Use no Inventário e ganhe +100 XP… ou será travessura?" },
  { name: "Poção da Bruxa", icon: "🧪", rarity: "raro", price: 70, xp: 250,
    description: "Borbulhante e verde, tirada direto do caldeirão. Use pra ganhar +250 XP." },
];

// ============================================================================
// COLEÇÃO MITOLOGIA GREGA — deuses do Olimpo, heróis e criaturas.
// ============================================================================

const GREEK_PRESETS: Preset[] = [
  // mascotes
  { name: "Águia de Zeus", icon: "🦅", rarity: "lendario", price: 380, featured: true, cosmetic: { slot: "pet", value: "aguia" },
    description: "A mensageira do rei dos deuses pousada no seu ombro. Enxerga um bug a quilômetros de distância." },
  { name: "Serpente da Medusa", icon: "🐍", rarity: "epico", price: 220, cosmetic: { slot: "pet", value: "serpente" },
    description: "Fugiu do cabelo da Medusa e resolveu te seguir. Não olhe nos olhos dela… ou olhe, ela é fofa." },
  { name: "Minotaurinho", icon: "🐂", rarity: "epico", price: 240, cosmetic: { slot: "pet", value: "minotauro" },
    description: "Cresceu no labirinto de Creta, por isso é ótimo em achar a saída de loops infinitos." },
  { name: "Golfinho de Poseidon", icon: "🐬", rarity: "raro", price: 160, cosmetic: { slot: "pet", value: "golfinho" },
    description: "Enviado pelo deus dos mares pra te acompanhar em águas profundas (e em códigos mais ainda)." },
  // chapéus
  { name: "Coroa de Louros Dourada", icon: "🌿", rarity: "epico", price: 230, featured: true, cosmetic: { slot: "hat", value: "louros" },
    description: "A coroa dos campeões das Olimpíadas. Só os mais dedicados da academia merecem usá-la." },
  { name: "Elmo Espartano", icon: "⚔️", rarity: "lendario", price: 340, cosmetic: { slot: "hat", value: "elmo-espartano" },
    description: "Bronze polido e crista vermelha de crina. Isto… é… CODEGUILDS!" },
  { name: "Asas de Hermes", icon: "🕊️", rarity: "epico", price: 210, cosmetic: { slot: "hat", value: "asas-hermes" },
    description: "As asinhas do mensageiro dos deuses. Dizem que deixam o seu código mais rápido." },
  { name: "Cabelo de Serpentes", icon: "🐍", rarity: "lendario", price: 320, cosmetic: { slot: "hat", value: "serpentes" },
    description: "Cinco cobrinhas no lugar do cabelo, igualzinho à Medusa. Petrifica qualquer bug." },
  // óculos
  { name: "Olhar da Medusa", icon: "👁️", rarity: "epico", price: 190, cosmetic: { slot: "eyewear", value: "olhar-medusa" },
    description: "Olhos verdes com pupila de cobra. Quem encara vira estátua de pedra (ou só fica impressionado)." },
  { name: "Venda do Oráculo", icon: "🔮", rarity: "raro", price: 140, cosmetic: { slot: "eyewear", value: "oraculo" },
    description: "A venda dourada do Oráculo de Delfos. Não enxerga nada, mas prevê a resposta certa." },
  // fantasias
  { name: "Toga Grega", icon: "🏛️", rarity: "raro", price: 170, cosmetic: { slot: "outfit", value: "toga" },
    description: "Toga branca com faixa dourada e broche no ombro. Perfeita pra filosofar sobre algoritmos." },
  { name: "Armadura de Hoplita", icon: "🛡️", rarity: "epico", price: 270, cosmetic: { slot: "outfit", value: "hoplita" },
    description: "Peitoral de bronze e capa vermelha dos guerreiros de Esparta. Pronto pra batalha contra os bugs." },
  { name: "Manto de Zeus", icon: "⚡", rarity: "lendario", price: 360, featured: true, cosmetic: { slot: "outfit", value: "zeus" },
    description: "Branco e azul do Olimpo, com um raio dourado no peito. O traje do rei dos deuses." },
  // cores de roupa
  { name: "Traje Mármore do Partenon", icon: "👕", rarity: "comum", price: 80, cosmetic: { slot: "outfitColor", value: "#e7e5e4" },
    description: "Branco como as colunas de mármore de Atenas." },
  { name: "Traje Azul do Mar Egeu", icon: "👕", rarity: "raro", price: 100, cosmetic: { slot: "outfitColor", value: "#0369a1" },
    description: "O azul profundo do mar que banha as ilhas gregas." },
  { name: "Traje Oliva de Atena", icon: "👕", rarity: "comum", price: 80, cosmetic: { slot: "outfitColor", value: "#4d7c0f" },
    description: "Da cor da oliveira sagrada, presente da deusa da sabedoria." },
  // auras
  { name: "Raios de Zeus", icon: "⚡", rarity: "lendario", price: 370, cosmetic: { slot: "aura", value: "raios" },
    description: "Nuvens de tempestade e raios caindo ao seu redor. O poder do rei do Olimpo nas suas mãos." },
  { name: "Mar de Poseidon", icon: "🌊", rarity: "epico", price: 230, cosmetic: { slot: "aura", value: "poseidon" },
    description: "Ondas e bolhas do fundo do oceano. O deus dos mares está do seu lado." },
  { name: "Luz do Olimpo", icon: "☀️", rarity: "raro", price: 180, cosmetic: { slot: "aura", value: "olimpo" },
    description: "Raios dourados como os que iluminam o topo do Monte Olimpo." },
  // itens comuns
  { name: "Ambrosia", icon: "🍯", rarity: "epico", price: 100, xp: 400,
    description: "O alimento dos deuses! Use no Inventário e ganhe +400 XP de sabedoria divina." },
  { name: "Maçã de Ouro", icon: "🍎", rarity: "raro", price: 60, xp: 200,
    description: "Colhida no jardim das Hespérides. Use pra ganhar +200 XP." },
];

// ============================================================================
// COLEÇÃO MITOLOGIA EGÍPCIA — faraós, deuses do Nilo e o deserto.
// ============================================================================

const EGYPTIAN_PRESETS: Preset[] = [
  // mascotes
  { name: "Gato de Bastet", icon: "🐈", rarity: "lendario", price: 360, featured: true, cosmetic: { slot: "pet", value: "bastet" },
    description: "O gato sagrado da deusa Bastet. Protege o seu código de ratos e de bugs." },
  { name: "Escorpião Dourado", icon: "🦂", rarity: "epico", price: 210, cosmetic: { slot: "pet", value: "escorpiao" },
    description: "Guardião das tumbas dos faraós. A picada dele só dói nos bugs." },
  { name: "Crocodilo de Sobek", icon: "🐊", rarity: "epico", price: 230, cosmetic: { slot: "pet", value: "crocodilo" },
    description: "Direto das margens do Nilo, abençoado pelo deus Sobek. Sorri com muitos dentes." },
  { name: "Camelo do Deserto", icon: "🐫", rarity: "raro", price: 150, cosmetic: { slot: "pet", value: "camelo" },
    description: "Aguenta dias sem água e horas de estudo sem reclamar." },
  // chapéus
  { name: "Nemes do Faraó", icon: "👑", rarity: "lendario", price: 380, featured: true, cosmetic: { slot: "hat", value: "nemes" },
    description: "O lenço listrado de azul e ouro dos faraós, com a cobra real na testa. Digno de Tutancâmon." },
  { name: "Orelhas de Anúbis", icon: "🐺", rarity: "epico", price: 200, cosmetic: { slot: "hat", value: "anubis" },
    description: "As orelhas pontudas do deus chacal, guardião do submundo." },
  { name: "Coroa da Cobra Real", icon: "🐍", rarity: "epico", price: 220, cosmetic: { slot: "hat", value: "uraeus" },
    description: "Uma tiara dourada com a cobra sagrada erguida, símbolo da realeza do Egito." },
  { name: "Disco Solar de Rá", icon: "🌞", rarity: "lendario", price: 330, cosmetic: { slot: "hat", value: "disco-ra" },
    description: "O sol vermelho entre chifres dourados, a coroa do deus do sol." },
  // óculos
  { name: "Olho de Hórus", icon: "👁️", rarity: "epico", price: 180, cosmetic: { slot: "eyewear", value: "horus" },
    description: "O delineado mágico do olho de Hórus: proteção, saúde e muito estilo." },
  { name: "Óculos do Faraó", icon: "🕶️", rarity: "raro", price: 130, cosmetic: { slot: "eyewear", value: "oculos-farao" },
    description: "Aros de ouro e lentes turquesa pra enfrentar o sol do deserto." },
  // fantasias
  { name: "Traje de Faraó", icon: "👑", rarity: "lendario", price: 350, featured: true, cosmetic: { slot: "outfit", value: "farao" },
    description: "Linho branco e o grande colar dourado e azul dos reis do Egito." },
  { name: "Fantasia de Múmia", icon: "🧟", rarity: "epico", price: 240, cosmetic: { slot: "outfit", value: "mumia" },
    description: "Enrolado em faixas milenares, com uma pontinha solta. Acordou de um sono de 3 mil anos." },
  { name: "Vestido de Cleópatra", icon: "💃", rarity: "epico", price: 260, cosmetic: { slot: "outfit", value: "cleopatra" },
    description: "Turquesa do Nilo com colar de ouro e rubi. Elegância de rainha." },
  // cores de roupa
  { name: "Traje Areia do Deserto", icon: "👕", rarity: "comum", price: 80, cosmetic: { slot: "outfitColor", value: "#d6b370" },
    description: "Da cor das dunas que cercam as pirâmides." },
  { name: "Traje Turquesa do Nilo", icon: "👕", rarity: "raro", price: 100, cosmetic: { slot: "outfitColor", value: "#0d9488" },
    description: "O verde-azulado das águas do rio mais famoso do Egito." },
  { name: "Traje Lápis-Lazúli", icon: "👕", rarity: "raro", price: 100, cosmetic: { slot: "outfitColor", value: "#1e3a8a" },
    description: "O azul da pedra preciosa preferida dos faraós." },
  // auras
  { name: "Sol de Rá", icon: "🌞", rarity: "lendario", price: 360, cosmetic: { slot: "aura", value: "ra" },
    description: "Um sol dourado brilhando atrás de você, como o deus Rá cruzando o céu." },
  { name: "Tempestade do Deserto", icon: "🏜️", rarity: "epico", price: 220, cosmetic: { slot: "aura", value: "areia" },
    description: "Pirâmides no horizonte e areia rodopiando ao vento." },
  { name: "Aura dos Hieróglifos", icon: "📜", rarity: "raro", price: 180, cosmetic: { slot: "aura", value: "hieroglifos" },
    description: "Símbolos sagrados flutuando em ouro: ankhs, olhos de Hórus e a água do Nilo." },
  // itens comuns
  { name: "Papiro dos Sábios", icon: "📜", rarity: "raro", price: 80, xp: 280,
    description: "Anotações dos escribas do faraó. Leia (use) e ganhe +280 XP." },
  { name: "Tâmaras do Oásis", icon: "🌴", rarity: "comum", price: 35, xp: 120,
    description: "Docinhas e cheias de energia. Use pra ganhar +120 XP." },
];

// ============================================================================
// COLEÇÃO ESPECIAL DE NATAL — Papai Noel, renas, neve e luzinhas.
// ============================================================================

const CHRISTMAS_PRESETS: Preset[] = [
  // mascotes
  { name: "Renazinha do Trenó", icon: "🦌", rarity: "lendario", price: 380, featured: true, cosmetic: { slot: "pet", value: "rena" },
    description: "Treinada pelo próprio Papai Noel pra puxar o trenó. Agora ela puxa você rumo ao próximo nível!" },
  { name: "Boneco de Neve", icon: "⛄", rarity: "epico", price: 220, cosmetic: { slot: "pet", value: "boneco-neve" },
    description: "Nariz de cenoura, cachecol quentinho e um sorriso gelado. Nunca derrete, nem no verão." },
  { name: "Pinguim do Polo Norte", icon: "🐧", rarity: "raro", price: 160, cosmetic: { slot: "pet", value: "pinguim" },
    description: "Veio de trenó lá do Polo Norte só pra te acompanhar nos estudos de fim de ano." },
  { name: "Elfo Ajudante", icon: "🧝", rarity: "epico", price: 240, cosmetic: { slot: "pet", value: "elfo" },
    description: "Trabalhava na fábrica de brinquedos, mas agora ajuda a embrulhar o seu código com laço de fita." },
  // chapéus
  { name: "Gorro do Papai Noel", icon: "🎅", rarity: "epico", price: 230, featured: true, cosmetic: { slot: "hat", value: "gorro-noel" },
    description: "Vermelho, com pelinho branco e pompom caído pro lado. Ho-ho-ho!" },
  { name: "Chifres de Rena", icon: "🦌", rarity: "raro", price: 150, cosmetic: { slot: "hat", value: "chifres-rena" },
    description: "Uma tiara com chifres de rena e dois guizos dourados que tilintam a cada acerto." },
  { name: "Coroa de Azevinho", icon: "🌿", rarity: "raro", price: 140, cosmetic: { slot: "hat", value: "azevinho" },
    description: "Folhas verdinhas e frutinhas vermelhas, o enfeite mais tradicional do Natal." },
  { name: "Gorro de Elfo", icon: "🔔", rarity: "epico", price: 200, cosmetic: { slot: "hat", value: "gorro-elfo" },
    description: "Verde e pontudo, com faixa listrada e um sininho na ponta. Oficial da oficina do Papai Noel." },
  // óculos
  { name: "Óculos do Papai Noel", icon: "👓", rarity: "raro", price: 120, cosmetic: { slot: "eyewear", value: "oculos-noel" },
    description: "Os óculos de meia-lua na ponta do nariz, perfeitos pra conferir a lista de quem se comportou bem." },
  { name: "Óculos Floco de Neve", icon: "❄️", rarity: "epico", price: 170, cosmetic: { slot: "eyewear", value: "flocos" },
    description: "Lentes geladinhas com um floco de neve em cada uma. Cada par é único (quase)." },
  // fantasias
  { name: "Roupa de Papai Noel", icon: "🎅", rarity: "lendario", price: 360, featured: true, cosmetic: { slot: "outfit", value: "papai-noel" },
    description: "Casaco vermelho com pelinho branco, cinto preto e fivela dourada. Só falta o saco de presentes!" },
  { name: "Suéter de Natal", icon: "🧶", rarity: "epico", price: 210, cosmetic: { slot: "outfit", value: "sueter" },
    description: "O clássico suéter de tricô com faixa verde em zigue-zague. Quentinho e cheio de estilo." },
  { name: "Roupa de Elfo", icon: "🧝", rarity: "epico", price: 240, cosmetic: { slot: "outfit", value: "elfo" },
    description: "Túnica verde com gola vermelha de pontas e sininhos dourados. Pronto pra fábrica de brinquedos." },
  // cores de roupa
  { name: "Traje Vermelho Noel", icon: "👕", rarity: "comum", price: 80, cosmetic: { slot: "outfitColor", value: "#b91c1c" },
    description: "O vermelho mais natalino que existe." },
  { name: "Traje Verde Pinheiro", icon: "👕", rarity: "comum", price: 80, cosmetic: { slot: "outfitColor", value: "#166534" },
    description: "Da cor da árvore de Natal, só faltam as bolinhas." },
  { name: "Traje Branco Neve", icon: "👕", rarity: "raro", price: 100, cosmetic: { slot: "outfitColor", value: "#f8fafc" },
    description: "Branco como a primeira neve da manhã de Natal." },
  // auras
  { name: "Nevasca", icon: "❄️", rarity: "epico", price: 230, cosmetic: { slot: "aura", value: "neve" },
    description: "Flocos de neve caindo ao seu redor num céu azul de inverno." },
  { name: "Luzinhas de Natal", icon: "💡", rarity: "lendario", price: 350, featured: true, cosmetic: { slot: "aura", value: "luzes" },
    description: "Um pisca-pisca colorido contornando você. Você vira a árvore de Natal mais bonita da academia!" },
  { name: "Aurora Boreal", icon: "🌌", rarity: "lendario", price: 370, cosmetic: { slot: "aura", value: "aurora" },
    description: "As luzes mágicas do céu do Polo Norte dançando em verde, azul e roxo atrás de você." },
  // itens comuns
  { name: "Biscoito de Gengibre", icon: "🍪", rarity: "comum", price: 35, xp: 150,
    description: "Crocante e com carinha sorridente. Use no Inventário pra ganhar +150 XP." },
  { name: "Chocolate Quente", icon: "☕", rarity: "raro", price: 70, xp: 300,
    description: "Com marshmallow e canela, pra esquentar as noites de estudo. Use pra ganhar +300 XP." },
];

function toCollection(presets: Preset[], collection: CosmeticCollection): ShopItemData[] {
  return presets.map((p) => ({ ...p, value: Math.floor(p.price / 2), xp: p.xp ?? 0, featured: p.featured ?? false, collection }));
}

/** Os itens prontos de cada coleção temática. */
export const SHOP_COLLECTIONS: Record<CosmeticCollection, ShopItemData[]> = {
  natal: toCollection(CHRISTMAS_PRESETS, "natal"),
  halloween: toCollection(HALLOWEEN_PRESETS, "halloween"),
  grega: toCollection(GREEK_PRESETS, "grega"),
  egipcia: toCollection(EGYPTIAN_PRESETS, "egipcia"),
};

/** Itens da coleção que ainda não estão na Loja. */
export function missingFromCollection(collection: CosmeticCollection, current: ShopItem[]): ShopItemData[] {
  return SHOP_COLLECTIONS[collection].filter((p) =>
    p.cosmetic ? !current.some((i) => sameCosmetic(i.cosmetic, p.cosmetic)) : !current.some((i) => i.collection === collection && i.name === p.name),
  );
}

/** Coloca à venda os itens da coleção que ainda não estão na Loja. Devolve quantos entraram. */
export function addCollection(collection: CosmeticCollection): number {
  const current = readAll();
  const missing = missingFromCollection(collection, current);
  const now = Date.now();
  const created: ShopItem[] = missing.map((p, i) => ({
    ...p,
    id: `loja_${collection}_${now}_${i}`,
    sold: 0,
    createdAt: new Date(now + i).toISOString(),
  }));
  writeAll([...current, ...created]);
  return created.length;
}

/** Tira da Loja todos os itens da coleção (quem já comprou continua com eles). Devolve quantos saíram. */
export function removeCollection(collection: CosmeticCollection): number {
  const all = readAll();
  const kept = all.filter((i) => i.collection !== collection);
  writeAll(kept);
  return all.length - kept.length;
}

export type ShopResult = { ok: true; item: InventoryItem } | { ok: false; error: string };

export function buyShopItem(studentId: string, shopItemId: string): ShopResult {
  const student = getStudent(studentId);
  const shopItem = readAll().find((i) => i.id === shopItemId);
  if (!student) return { ok: false, error: "Aluno não encontrado." };
  if (!shopItem) return { ok: false, error: "Esse item não está mais à venda." };
  if (shopItem.cosmetic && ownsCosmetic(student, shopItem.cosmetic)) return { ok: false, error: "Você já tem esse visual — é só equipar no Inventário." };
  if (student.coins < shopItem.price) return { ok: false, error: `Moedas insuficientes — faltam ${shopItem.price - student.coins}.` };

  const item: InventoryItem = {
    id: `i_${Date.now()}_${Math.round(Math.random() * 9999)}`,
    name: shopItem.name,
    icon: shopItem.icon,
    description: shopItem.description,
    rarity: shopItem.rarity,
    value: shopItem.value,
    xp: shopItem.cosmetic ? 0 : shopItem.xp,
    ...(shopItem.cosmetic && { cosmetic: shopItem.cosmetic }),
    obtainedAt: new Date().toISOString(),
  };
  updateStudent(student.id, { coins: student.coins - shopItem.price, inventory: [...student.inventory, item] });
  writeAll(readAll().map((i) => (i.id === shopItemId ? { ...i, sold: i.sold + 1 } : i)));
  sendMessage({
    studentId: student.id,
    senderId: SYSTEM_SENDER_ID,
    kind: "compra",
    body: shopPurchaseMessage({ item: shopItem, price: shopItem.price, isCosmetic: !!shopItem.cosmetic }),
  });
  return { ok: true, item };
}
