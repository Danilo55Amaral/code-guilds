// ============================================================================
// ITENS DOS EVENTOS — todos os itens que os eventos especiais dão: a
// recompensa de cada fase (ou a recompensa final) e o item de cada missão
// pronta do evento. Eles entram na Loja, na coleção do evento (o Natal na
// coleção de Natal, e assim por diante), e podem ser dados de presente pelo
// professor ou pelo ADM.
//
// Só o ADM altera esses itens: editando o item na Loja (preço, XP, valor,
// nome, descrição...). A versão da Loja passa a valer também pra recompensa do
// evento e pras missões prontas adicionadas depois.
// ============================================================================

import type { CosmeticCollection } from "./avatar";
import type { RewardItem } from "./missions";
import { ACADEMY_EVENTS, EventId, eventPhases } from "./specialEvents";

export interface EventItemEntry {
  key: string; // identificador fixo do item no evento (ex.: "natal:fase2", "halloween:missao:o-fantasma-do-undefined")
  eventId: EventId;
  collection: CosmeticCollection; // coleção da Loja onde ele é vendido
  origin: string; // de onde ele vem no evento (ex.: "Recompensa da Fase 1", "Missão: O Rastro na Neve")
  item: RewardItem;
}

/** A coleção da Loja de cada evento. */
export const EVENT_COLLECTION: Record<EventId, CosmeticCollection> = {
  halloween: "halloween",
  zumbi: "zumbi",
  alien: "alien",
  natal: "natal",
};

function slug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Chave do item de uma missão pronta do evento. */
export function eventMissionItemKey(eventId: string, missionTitle: string): string {
  return `${eventId}:missao:${slug(missionTitle)}`;
}

/** Chave da recompensa de uma fase (evento comum: a recompensa final, "fase1"). */
export function eventRewardKey(eventId: string, phase: number): string {
  return `${eventId}:fase${phase}`;
}

/** Todos os itens de todos os eventos, na ordem dos eventos (recompensas primeiro, depois os itens das missões). */
export const EVENT_ITEMS: EventItemEntry[] = ACADEMY_EVENTS.flatMap((event) => {
  const phases = eventPhases(event);
  const collection = EVENT_COLLECTION[event.id];
  const rewards: EventItemEntry[] = phases.map((p) => ({
    key: eventRewardKey(event.id, p.number),
    eventId: event.id,
    collection,
    origin: phases.length > 1 ? `Recompensa da Fase ${p.number}` : "Recompensa final",
    item: p.reward.item,
  }));
  const missionItems: EventItemEntry[] = phases.flatMap((p) =>
    p.presetMissions.map((m) => ({
      key: eventMissionItemKey(event.id, m.title),
      eventId: event.id,
      collection,
      origin: `Missão: ${m.title}`,
      item: m.rewardItem,
    })),
  );
  return [...rewards, ...missionItems];
});

export function getEventItem(key: string): EventItemEntry | undefined {
  return EVENT_ITEMS.find((e) => e.key === key);
}

/** O item de evento que a missão dá, se a recompensa dela for um item oficial de evento (mesmo nome e ícone). */
export function eventItemOfReward(item: { name: string; icon: string }): EventItemEntry | undefined {
  return EVENT_ITEMS.find((e) => e.item.name === item.name && e.item.icon === item.icon);
}

/** O item com as alterações que o ADM fez na Loja (se o item do evento estiver cadastrado lá). */
export function resolveEventItem(
  key: string,
  base: RewardItem,
  shopItems: { eventItemKey?: string; name: string; icon: string; description: string; rarity: RewardItem["rarity"]; value: number; xp: number; cosmetic?: RewardItem["cosmetic"]; slots?: number }[],
): RewardItem {
  const shop = shopItems.find((i) => i.eventItemKey === key);
  if (!shop) return base;
  return {
    name: shop.name,
    icon: shop.icon,
    description: shop.description,
    rarity: shop.rarity,
    value: shop.value,
    xp: shop.cosmetic || shop.slots ? 0 : shop.xp,
    ...(shop.cosmetic && { cosmetic: shop.cosmetic }),
    ...(shop.slots && { slots: shop.slots }),
  };
}
