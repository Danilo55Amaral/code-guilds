// ============================================================================
// SALA DO MULTIVERSO — uma sala secreta com portais pra outros mundos (no
// futuro, cada portal leva a missões secretas de outro universo).
//
// Não existe botão pra ela na Academia: o aluno só entra usando uma
// 🌀 Chave do Multiverso (item que o professor/ADM cria como recompensa de
// missão ou dá de presente). Usar a chave some com ela e deixa um passe
// (Student.multiverseAccess) que é gasto ao entrar na sala: quando o aluno
// sai, o portal se fecha e ele precisa de outra chave. Professor e ADM entram
// sempre, pelo botão dos painéis.
// ============================================================================

import { Student, removeItem } from "./students";

/** A Chave do Multiverso pronta (o professor/ADM pode mudar nome, ícone, raridade e descrição). */
export const MULTIVERSE_KEY_ITEM = {
  name: "Chave do Multiverso",
  icon: "🌀",
  description:
    "Uma chave feita de luz de estrelas que abre, uma única vez, a porta da Sala do Multiverso. Use no Inventário: a chave some e o portal se abre. Quando você sair da sala, ele se fecha de novo.",
  rarity: "lendario" as const,
  value: 50,
  xp: 0,
  multiverse: true,
};

export interface MultiverseWorld {
  id: string;
  name: string;
  tagline: string;
  lore: string;
  glyph: string; // emoji do mundo
  colors: [string, string, string]; // cores do redemoinho do portal (de fora pra dentro)
  /** Futuro: a página das missões secretas desse universo. Sem valor = portal ainda selado. */
  href?: string;
}

/** Os portais da sala (os 5 primeiros mundos). */
export const MULTIVERSE_WORLDS: MultiverseWorld[] = [
  {
    id: "nebulosa",
    name: "Nebulosa de Código",
    tagline: "Mundo 1",
    lore: "Uma nebulosa rosa e violeta onde as estrelas nascem de linhas de código. Dizem que cada algoritmo perfeito acende uma estrela nova.",
    glyph: "🌌",
    colors: ["#7c3aed", "#ec4899", "#fdf4ff"],
  },
  {
    id: "cristal",
    name: "Reino do Cristal Binário",
    tagline: "Mundo 2",
    lore: "Montanhas de cristal que guardam zeros e uns congelados no tempo. Só quem entende de lógica consegue atravessar as cavernas espelhadas.",
    glyph: "💎",
    colors: ["#0e7490", "#22d3ee", "#ecfeff"],
  },
  {
    id: "quantico",
    name: "Abismo Quântico",
    tagline: "Mundo 3",
    lore: "Um universo onde as coisas estão em dois lugares ao mesmo tempo e todo if tem as duas respostas certas... até alguém olhar.",
    glyph: "⚛️",
    colors: ["#15803d", "#a3e635", "#f7fee7"],
  },
  {
    id: "pixel",
    name: "Dimensão Pixel",
    tagline: "Mundo 4",
    lore: "Um mundo de 8 bits feito dos primeiros videogames da história. Os chefões de fase ainda esperam por um herói que saiba programar.",
    glyph: "👾",
    colors: ["#c2410c", "#fbbf24", "#fffbeb"],
  },
  {
    id: "galaxia",
    name: "Galáxia Esquecida",
    tagline: "Mundo 5",
    lore: "Ruínas de uma civilização antiga flutuam entre planetas dourados. Os antigos programadores deixaram enigmas que ninguém resolveu.",
    glyph: "🌠",
    colors: ["#1d4ed8", "#facc15", "#fefce8"],
  },
];

/** O aluno usa a Chave do Multiverso: ela some e o portal fica aberto até ele entrar na sala. */
export function openMultiversePatch(student: Student, itemId: string): Partial<Student> | null {
  const item = student.inventory.find((i) => i.id === itemId);
  if (!item?.multiverse) return null;
  const { inventory, equipped } = removeItem(student, itemId);
  return { inventory, equipped, multiverseAccess: new Date().toISOString() };
}

/** Entrou na sala: o passe é gasto (sair ou recarregar fecha o portal). */
export function spendMultiverseAccessPatch(): Partial<Student> {
  return { multiverseAccess: undefined };
}
