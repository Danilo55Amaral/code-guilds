"use client";

import { ShopItem } from "@/engine/shop";
import { COLLECTIONS, DEFAULT_AVATAR, applyCosmetic } from "@/engine/avatar";
import { RARITY_META } from "@/engine/missions";
import { COLLECTION_THEME } from "./collections";
import Avatar from "./Avatar";
import { CoinIcon, ItemStats, RarityBadge } from "./GameUI";

/**
 * Escolha de um item da Loja (Painel ADM): lista agrupada por coleção e uma
 * prévia do item escolhido. Usado pra dar item da Loja a um aluno e pra usar
 * um item da Loja como recompensa de missão.
 */
export default function ShopItemPicker({
  items,
  value,
  onChange,
  placeholder = "Escolha um item da Loja…",
  note,
}: {
  items: ShopItem[];
  value: string;
  onChange: (shopItemId: string) => void;
  placeholder?: string;
  /** Aviso extra embaixo da prévia (ex.: "o aluno já tem esse visual"). */
  note?: string | null;
}) {
  const selected = items.find((i) => i.id === value) ?? null;
  const groups = [
    { key: "ano-todo", label: "🛍️ Ano todo", list: items.filter((i) => !i.collection) },
    ...COLLECTIONS.map((c) => ({ key: c, label: `${COLLECTION_THEME[c].emoji} ${COLLECTION_THEME[c].title}`, list: items.filter((i) => i.collection === c) })),
  ].filter((g) => g.list.length > 0);

  return (
    <div className="flex flex-col gap-3">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="cg-input" aria-label="Item da Loja">
        <option value="">{placeholder}</option>
        {groups.map((g) => (
          <optgroup key={g.key} label={g.label}>
            {g.list.map((i) => (
              <option key={i.id} value={i.id}>
                {i.icon} {i.name} — {RARITY_META[i.rarity].label} • {i.price} moedas
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {items.length === 0 && <p className="text-xs text-slate-500">A Loja está vazia — cadastre itens na aba Loja do Painel ADM.</p>}

      {selected && (
        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-cg-sunken p-3">
          {selected.cosmetic ? (
            <Avatar config={applyCosmetic(DEFAULT_AVATAR, selected.cosmetic)} size={56} />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-cg-tile text-3xl">{selected.icon}</div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">
              {selected.icon} {selected.name}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <RarityBadge rarity={selected.rarity} />
              <ItemStats value={selected.value} xp={selected.xp} />
              <span className="flex items-center gap-0.5 text-[11px] text-slate-500">
                (na Loja: <CoinIcon size={10} /> {selected.price})
              </span>
            </div>
            <p className="mt-1 line-clamp-2 text-[11px] text-slate-400">{selected.description}</p>
            {selected.cosmetic && <p className="mt-1 text-[11px] text-violet-300">👕 Visual do avatar — o aluno vai poder equipar.</p>}
            {note && <p className="mt-1 text-[11px] text-amber-300">{note}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
