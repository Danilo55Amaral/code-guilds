"use client";

import { useState } from "react";
import { useShop } from "@/engine/store";
import { ShopItem, ShopItemData, validateShopItem } from "@/engine/shop";
import { RARITY_GLOW } from "@/engine/missions";
import { COSMETIC_SLOT_LABELS, DEFAULT_AVATAR, applyCosmetic } from "@/engine/avatar";
import Avatar from "./Avatar";
import { CoinIcon, RarityBadge } from "./GameUI";
import ShopItemEditor from "./ShopItemEditor";

/** Aba "Loja" do Painel ADM: os itens à venda, quanto já venderam, e o cadastro de novos. */
export default function ShopManager() {
  const { items, addItem, editItem, removeItem } = useShop();
  const [target, setTarget] = useState<ShopItem | "new" | null>(null);

  const existing = target && target !== "new" ? target : undefined;
  const totalSold = items.reduce((sum, i) => sum + i.sold, 0);
  const revenue = items.reduce((sum, i) => sum + i.sold * i.price, 0);

  function handleSave(data: ShopItemData): string | null {
    const error = validateShopItem(data, existing?.id);
    if (error) return error;
    if (existing) editItem(existing.id, data);
    else addItem(data);
    setTarget(null);
    return null;
  }

  return (
    <div className="cg-card mb-6 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-300">🛍️ Loja da Academia ({items.length})</p>
          <p className="text-xs text-slate-500">
            {totalSold} {totalSold === 1 ? "venda" : "vendas"} no total • <CoinIcon size={11} /> {revenue} moedas gastas pelos alunos
          </p>
        </div>
        <button onClick={() => setTarget("new")} className="cg-btn-primary !px-3 !py-1.5 text-xs">
          + Novo item
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">A Loja está vazia — clique em &quot;+ Novo item&quot; pra colocar o primeiro à venda.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setTarget(item)}
              className="flex items-center gap-3 rounded-xl border border-slate-800 bg-cg-sunken p-3 text-left transition-colors hover:border-slate-600"
              style={{ boxShadow: `inset 3px 0 0 ${RARITY_GLOW[item.rarity]}` }}
            >
              {item.cosmetic ? (
                <Avatar config={applyCosmetic(DEFAULT_AVATAR, item.cosmetic)} size={52} />
              ) : (
                <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl bg-cg-tile text-2xl">{item.icon}</div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {item.featured && <span title="Em destaque">⭐ </span>}
                  {item.name}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <RarityBadge rarity={item.rarity} />
                  <span className="flex items-center gap-0.5 text-xs font-bold text-amber-300">
                    <CoinIcon size={12} /> {item.price}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  {item.cosmetic ? `👕 ${COSMETIC_SLOT_LABELS[item.cosmetic.slot]}` : "🧪 Item comum"} • {item.sold} {item.sold === 1 ? "vendido" : "vendidos"}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {target && (
        <ShopItemEditor
          existing={existing}
          taken={items.filter((i) => i.id !== existing?.id).map((i) => i.cosmetic)}
          onSave={handleSave}
          onDelete={
            existing
              ? () => {
                  removeItem(existing.id);
                  setTarget(null);
                }
              : undefined
          }
          onClose={() => setTarget(null)}
        />
      )}
    </div>
  );
}
