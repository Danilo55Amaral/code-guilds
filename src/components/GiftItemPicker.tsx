"use client";

import { useState } from "react";
import { DEFAULT_AVATAR, applyCosmetic } from "@/engine/avatar";
import { DEFAULT_ITEM_ICON, ITEM_DESCRIPTION_MAX_LENGTH, Mission, RARITY_DEFAULT_VALUE, RARITY_ICON, RARITY_META, Rarity } from "@/engine/missions";
import { ShopItem } from "@/engine/shop";
import { ACADEMY_EVENTS, getEvent } from "@/engine/specialEvents";
import { EVENT_ITEMS, eventItemOfReward, resolveEventItem } from "@/engine/eventItems";
import { GiftItem } from "@/engine/gifts";
import Avatar from "./Avatar";
import EmojiPicker from "./EmojiPicker";
import ItemEconomyFields from "./ItemEconomyFields";
import ShopItemPicker from "./ShopItemPicker";
import { ItemStats, RarityBadge } from "./GameUI";

// ============================================================================
// ESCOLHA DO PRESENTE — de onde vem o item que o professor/ADM vai dar:
// ✏️ criado na hora, 🛍️ da Loja, ⚔️ a recompensa de uma missão ou 🎉 um item
// de evento. Usado na ficha do aluno (um aluno) e no card de presentes (turma
// toda ou uma casa). Itens da Loja, de missão e de evento vão como estão: só o
// ADM altera itens de evento (na Loja). Professor não vê os itens da Loja que
// estão fora da vitrine nem os itens de espaço (esses só o ADM dá).
// ============================================================================

type Source = "criar" | "loja" | "missao" | "evento";

const SOURCES: [Source, string][] = [
  ["criar", "✏️ Criar item"],
  ["loja", "🛍️ Da Loja"],
  ["missao", "⚔️ De uma missão"],
  ["evento", "🎉 De um evento"],
];

function toGift(item: GiftItem): GiftItem {
  return {
    name: item.name,
    icon: item.icon,
    description: item.description,
    rarity: item.rarity,
    value: item.value,
    xp: item.cosmetic || item.slots ? 0 : item.xp,
    ...(item.cosmetic && { cosmetic: item.cosmetic }),
    ...(item.slots && { slots: item.slots }),
  };
}

/** Prévia do item escolhido (Loja, missão ou evento). */
function GiftPreview({ item, note }: { item: GiftItem; note?: string | null }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-cg-card p-3">
      {item.cosmetic ? (
        <Avatar config={applyCosmetic(DEFAULT_AVATAR, item.cosmetic)} size={56} />
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-cg-tile text-3xl">{item.icon}</div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white">
          {item.icon} {item.name}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <RarityBadge rarity={item.rarity} />
          <ItemStats value={item.value} xp={item.xp} />
        </div>
        <p className="mt-1 line-clamp-2 text-[11px] text-slate-400">{item.description}</p>
        {item.cosmetic && <p className="mt-1 text-[11px] text-violet-300">👕 Visual do avatar — quem já tiver ganha mais um (dá pra vender).</p>}
        {item.slots && <p className="mt-1 text-[11px] text-teal-300">📦 Item de espaço — ao usar, o inventário ganha +{item.slots} espaços.</p>}
        {note && <p className="mt-1 text-[11px] text-fuchsia-300">{note}</p>}
      </div>
    </div>
  );
}

export default function GiftItemPicker({
  shopItems,
  missions,
  isAdmin,
  actionLabel,
  actionDisabled = false,
  onGive,
}: {
  shopItems: ShopItem[];
  /** Missões que dá pra usar (professor: as dele; ADM: as da plataforma). */
  missions: Mission[];
  isAdmin: boolean;
  /** Texto do botão (ex.: "🎁 Dar item", "🎁 Doar para 12 alunos"). */
  actionLabel: string;
  actionDisabled?: boolean;
  onGive: (item: GiftItem) => void;
}) {
  const [source, setSource] = useState<Source>("criar");
  // criar
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(DEFAULT_ITEM_ICON);
  const [description, setDescription] = useState("");
  const [rarity, setRarity] = useState<Rarity>("comum");
  const [value, setValue] = useState(RARITY_DEFAULT_VALUE.comum);
  const [xp, setXp] = useState(0);
  // loja, missão, evento
  const [shopItemId, setShopItemId] = useState("");
  const [missionId, setMissionId] = useState("");
  const [eventKey, setEventKey] = useState("");

  const availableShop = isAdmin ? shopItems : shopItems.filter((i) => !i.hidden && !i.slots);
  const regularMissions = missions.filter((m) => !m.eventId);
  const eventMissions = missions.filter((m) => m.eventId);

  let chosen: GiftItem | null = null;
  let note: string | null = null;
  if (source === "criar") {
    chosen = name.trim() && description.trim() ? { name: name.trim(), icon, description: description.trim(), rarity, value, xp } : null;
  } else if (source === "loja") {
    const shop = availableShop.find((i) => i.id === shopItemId);
    chosen = shop ? toGift(shop) : null;
  } else if (source === "missao") {
    const mission = missions.find((m) => m.id === missionId);
    chosen = mission ? toGift(mission.rewardItem) : null;
    if (mission && eventItemOfReward(mission.rewardItem)) note = "🎉 Item de evento — só o ADM altera (na Loja).";
  } else {
    const entry = EVENT_ITEMS.find((e) => e.key === eventKey);
    chosen = entry ? toGift(resolveEventItem(entry.key, entry.item, shopItems)) : null;
    if (entry) note = `🎉 ${entry.origin} — só o ADM altera esse item (na Loja).`;
  }

  function give() {
    if (!chosen || actionDisabled) return;
    onGive(chosen);
    if (source === "criar") {
      setName("");
      setDescription("");
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-1 rounded-xl border border-slate-800 bg-cg-card p-1 sm:grid-cols-4">
        {SOURCES.map(([s, label]) => (
          <button
            key={s}
            type="button"
            onClick={() => setSource(s)}
            className={`rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors ${source === s ? "bg-white text-cg-ink" : "text-slate-400 hover:text-slate-200"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {source === "criar" && (
        <>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do item (ex.: Anel do Iterador)" className="cg-input" aria-label="Nome do item" />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(Object.keys(RARITY_META) as Rarity[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRarity(r)}
                title={`Valor sugerido: ${RARITY_DEFAULT_VALUE[r]} moedas`}
                className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                  rarity === r ? "border-white bg-white text-cg-ink" : "border-slate-700 text-slate-300 hover:border-slate-500"
                }`}
              >
                {RARITY_ICON[r]} {RARITY_META[r].label}
              </button>
            ))}
          </div>
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={ITEM_DESCRIPTION_MAX_LENGTH}
              rows={2}
              placeholder="Descrição do item (aparece quando o aluno clica nele)"
              aria-label="Descrição do item"
              className="cg-input resize-y"
            />
            <p className="mt-1 text-right text-[11px] text-slate-500">
              {description.length}/{ITEM_DESCRIPTION_MAX_LENGTH}
            </p>
          </div>
          <div>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-500">Ícone do item</p>
            <EmojiPicker value={icon} onChange={setIcon} defaultGroup="Itens" />
          </div>
          <ItemEconomyFields
            value={value}
            xp={xp}
            onChange={(patch) => {
              if (patch.value !== undefined) setValue(patch.value);
              if (patch.xp !== undefined) setXp(patch.xp);
            }}
          />
        </>
      )}

      {source === "loja" &&
        (availableShop.length === 0 ? (
          <p className="text-xs text-slate-500">A Loja ainda não tem itens pra dar.</p>
        ) : (
          <ShopItemPicker items={availableShop} value={shopItemId} onChange={setShopItemId} placeholder="Escolha um item da Loja…" />
        ))}

      {source === "missao" && (
        <>
          <select value={missionId} onChange={(e) => setMissionId(e.target.value)} className="cg-input" aria-label="Missão">
            <option value="">{missions.length === 0 ? "Nenhuma missão cadastrada" : "Escolha a missão (o aluno ganha o item de recompensa dela)…"}</option>
            {regularMissions.length > 0 && (
              <optgroup label="⚔️ Missões">
                {regularMissions.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.icon} {m.title} → {m.rewardItem.icon} {m.rewardItem.name}
                  </option>
                ))}
              </optgroup>
            )}
            {eventMissions.length > 0 && (
              <optgroup label="📅 Missões de eventos">
                {eventMissions.map((m) => (
                  <option key={m.id} value={m.id}>
                    {getEvent(m.eventId!)?.icon ?? "📅"} {m.title} → {m.rewardItem.icon} {m.rewardItem.name}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
          {chosen && <GiftPreview item={chosen} note={note} />}
        </>
      )}

      {source === "evento" && (
        <>
          <select value={eventKey} onChange={(e) => setEventKey(e.target.value)} className="cg-input" aria-label="Item de evento">
            <option value="">Escolha um item de evento…</option>
            {ACADEMY_EVENTS.map((ev) => (
              <optgroup key={ev.id} label={`${ev.icon} ${ev.title}`}>
                {EVENT_ITEMS.filter((e) => e.eventId === ev.id).map((e) => {
                  const item = resolveEventItem(e.key, e.item, shopItems);
                  return (
                    <option key={e.key} value={e.key}>
                      {item.icon} {item.name} — {RARITY_META[item.rarity].label} ({e.origin})
                    </option>
                  );
                })}
              </optgroup>
            ))}
          </select>
          {chosen && <GiftPreview item={chosen} note={note} />}
        </>
      )}

      <div className="flex justify-end">
        <button
          onClick={give}
          disabled={!chosen || actionDisabled}
          title={!chosen ? (source === "criar" ? "Preencha o nome e a descrição do item." : "Escolha o item.") : undefined}
          className="cg-btn-primary !px-4 !py-2 text-sm disabled:cursor-not-allowed disabled:opacity-30"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
