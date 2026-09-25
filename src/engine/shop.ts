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
import { Cosmetic, sameCosmetic } from "./avatar";
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
