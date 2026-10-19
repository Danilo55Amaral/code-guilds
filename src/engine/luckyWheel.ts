// ============================================================================
// ROLETA DA SORTE — fica no topo da Loja. Todo dia o aluno tem UM giro grátis
// (o dia do horário de Brasília); depois dele, cada giro custa
// WHEEL_SPIN_PRICE moedas. A roleta tem 20 prêmios: moedas, XP, a Chave do
// Multiverso e visuais da Loja.
//
// Quem sorteia é a API (POST /lucky-wheel/spin), que guarda cada giro em
// lucky_wheel_spins; o site só gira a roleta até a fatia que o servidor
// mandou. As regras (os prêmios, as chances e aplicar o prêmio) são estas,
// as mesmas no site e na API.
//
// As chances seguem a raridade: prêmio pequeno sai muito, prêmio grande é
// raro. Somando moedas e o valor de revenda dos itens, um giro pago rende em
// média cerca de 75 moedas, menos que as 100 que custa, pra roleta não
// virar uma fábrica de moedas. Visual repetido entra como outra cópia (dá pra vender).
// ============================================================================

import { Rarity } from "./missions";
import { Cosmetic, sameCosmetic } from "./avatar";
import { DEFAULT_SHOP, SHOP_COLLECTIONS } from "./shop";
import { MULTIVERSE_KEY_ITEM } from "./multiverse";
import { Student, addXp, grantItem } from "./students";

/** Quanto custa cada giro depois do grátis do dia. */
export const WHEEL_SPIN_PRICE = 100;

/** O item que o prêmio dá (no formato do grantItem). */
export interface WheelPrizeItem {
  name: string;
  icon: string;
  description: string;
  rarity: Rarity;
  value: number;
  xp: number;
  cosmetic?: Cosmetic;
  multiverse?: boolean;
}

export interface WheelPrize {
  key: string; // guardado em lucky_wheel_spins (não mude o de um prêmio que já existe)
  label: string; // o nome do prêmio
  short: string; // o que cabe escrito na fatia
  icon: string;
  rarity: Rarity; // a cor do brilho quando sai
  weight: number; // a chance é weight / WHEEL_TOTAL_WEIGHT
  coins?: number;
  xp?: number;
  item?: WheelPrizeItem;
}

/** Um visual da Loja, pelos dados de lá (nome, ícone, descrição, raridade e valor de revenda). */
function shopCosmetic(cosmetic: Cosmetic): WheelPrizeItem {
  const all = [...DEFAULT_SHOP, ...Object.values(SHOP_COLLECTIONS).flat()];
  const found = all.find((i) => sameCosmetic(i.cosmetic, cosmetic));
  if (!found) throw new Error(`Roleta: visual ${cosmetic.slot}/${cosmetic.value} não existe na Loja.`);
  return { name: found.name, icon: found.icon, description: found.description, rarity: found.rarity, value: found.value, xp: 0, cosmetic };
}

function cosmeticPrize(key: string, short: string, cosmetic: Cosmetic, weight: number): WheelPrize {
  const item = shopCosmetic(cosmetic);
  return { key, label: item.name, short, icon: item.icon, rarity: item.rarity, weight, item };
}

/**
 * Os 20 prêmios, na ordem das fatias (os grandes ficam espalhados pela roleta).
 * Pesos somam 1000: weight 10 = 1% de chance.
 */
export const WHEEL_PRIZES: WheelPrize[] = [
  { key: "moedas-50", label: "50 moedas", short: "50", icon: "💰", rarity: "comum", weight: 338, coins: 50 },
  cosmeticPrize("gorro-astronomo", "Gorro", { slot: "hat", value: "gorro-astronomo" }, 66),
  { key: "xp-300", label: "300 XP", short: "300 XP", icon: "✨", rarity: "comum", weight: 50, xp: 300 },
  cosmeticPrize("aura-lua-sangrenta", "Lua Sangrenta", { slot: "aura", value: "lua-sangrenta" }, 9),
  { key: "moedas-100", label: "100 moedas", short: "100", icon: "💰", rarity: "comum", weight: 88, coins: 100 },
  cosmeticPrize("oculos-neon", "Óculos Neon", { slot: "eyewear", value: "neon" }, 59),
  { key: "xp-500", label: "500 XP", short: "500 XP", icon: "✨", rarity: "raro", weight: 30, xp: 500 },
  cosmeticPrize("tiara-morcego", "Tiara", { slot: "hat", value: "morcego" }, 51),
  {
    key: "chave-multiverso",
    label: MULTIVERSE_KEY_ITEM.name,
    short: "Chave",
    icon: MULTIVERSE_KEY_ITEM.icon,
    rarity: "lendario",
    weight: 12,
    item: { ...MULTIVERSE_KEY_ITEM },
  },
  cosmeticPrize("fantasia-abobora", "Fantasia", { slot: "outfit", value: "abobora" }, 21),
  { key: "moedas-1000", label: "1000 moedas", short: "1000", icon: "💰", rarity: "epico", weight: 4, coins: 1000 },
  cosmeticPrize("oculos-teia", "Óculos Teia", { slot: "eyewear", value: "teia" }, 51),
  cosmeticPrize("aura-fogo", "Aura de Fogo", { slot: "aura", value: "fogo" }, 26),
  { key: "xp-1000", label: "1000 XP", short: "1000 XP", icon: "🌟", rarity: "epico", weight: 44, xp: 1000 },
  cosmeticPrize("orelhas-lobisomem", "Orelhas", { slot: "hat", value: "orelhas-lobo" }, 44),
  cosmeticPrize("revoada-morcegos", "Revoada", { slot: "aura", value: "morcegos" }, 26),
  { key: "moedas-5000", label: "5000 moedas", short: "5000", icon: "💎", rarity: "lendario", weight: 2, coins: 5000 },
  cosmeticPrize("morceguinho-noturno", "Morceguinho", { slot: "pet", value: "morcego" }, 44),
  cosmeticPrize("coroa-saturno", "Coroa", { slot: "hat", value: "coroa-saturno" }, 26),
  cosmeticPrize("cometinha", "Cometinha", { slot: "pet", value: "cometinha" }, 9),
];

export const WHEEL_TOTAL_WEIGHT = WHEEL_PRIZES.reduce((sum, p) => sum + p.weight, 0);

/** A chance do prêmio em porcentagem (pra mostrar na tela). */
export function prizeChance(prize: WheelPrize): number {
  return (prize.weight / WHEEL_TOTAL_WEIGHT) * 100;
}

/** Qual fatia sai pra um número sorteado de 0 a WHEEL_TOTAL_WEIGHT - 1 (a API sorteia o número). */
export function prizeIndexForRoll(roll: number): number {
  let acc = 0;
  for (let i = 0; i < WHEEL_PRIZES.length; i++) {
    acc += WHEEL_PRIZES[i].weight;
    if (roll < acc) return i;
  }
  return WHEEL_PRIZES.length - 1;
}

export type WheelSpinResult =
  | {
      ok: true;
      student: Student;
      cost: number; // 0 = foi o giro grátis do dia
      leveledUp: boolean;
      fromLevel: number;
      newLevel: number;
      itemWaiting: boolean; // o item não coube no inventário e ficou esperando espaço
    }
  | { ok: false; error: string };

/**
 * Aplica um giro: cobra (se não for o grátis) e entrega o prêmio da fatia.
 * Item que não cabe no inventário fica esperando espaço (nada se perde).
 * Não salva nada: quem salva é a API.
 */
export function applyWheelSpin(student: Student, prizeIndex: number, free: boolean): WheelSpinResult {
  const prize = WHEEL_PRIZES[prizeIndex];
  if (!prize) return { ok: false, error: "Prêmio da roleta não encontrado." };

  const cost = free ? 0 : WHEEL_SPIN_PRICE;
  if (student.coins < cost) return { ok: false, error: `Moedas insuficientes — faltam ${cost - student.coins} pra girar.` };

  let next: Student = { ...student, coins: student.coins - cost + (prize.coins ?? 0) };

  if (prize.xp) {
    const { level, xp } = addXp(next, prize.xp);
    next = { ...next, level, xp };
  }

  const waitingBefore = next.pendingItems?.length ?? 0;
  if (prize.item) next = grantItem(next, prize.item);

  return {
    ok: true,
    student: next,
    cost,
    leveledUp: next.level > student.level,
    fromLevel: student.level,
    newLevel: next.level,
    itemWaiting: (next.pendingItems?.length ?? 0) > waitingBefore,
  };
}
