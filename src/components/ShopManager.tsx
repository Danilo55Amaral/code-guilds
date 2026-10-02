"use client";

import { useState } from "react";
import { useShop } from "@/engine/store";
import { SHOP_COLLECTIONS, ShopItem, ShopItemData, missingFromCollection, validateShopItem, eventItemCount } from "@/engine/shop";
import { RARITY_GLOW } from "@/engine/missions";
import { COLLECTIONS, COSMETIC_SLOT_LABELS, CosmeticCollection, DEFAULT_AVATAR, applyCosmetic } from "@/engine/avatar";
import { COLLECTION_THEME } from "./collections";
import Avatar from "./Avatar";
import { CoinIcon, RarityBadge } from "./GameUI";
import ShopItemEditor from "./ShopItemEditor";
import ShopQuickEdit from "./ShopQuickEdit";

/** Aba "Loja" do Painel ADM: os itens à venda, quanto já venderam, e o cadastro de novos. */
export default function ShopManager() {
  const { items, addItem, editItem, removeItem, addCollection, removeCollection } = useShop();
  const [target, setTarget] = useState<ShopItem | "new" | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<CosmeticCollection | null>(null);
  const [view, setView] = useState<"itens" | "rapida">("itens");
  const [notice, setNotice] = useState<string | null>(null);

  const existing = target && target !== "new" ? target : undefined;
  const totalSold = items.reduce((sum, i) => sum + i.sold, 0);
  const revenue = items.reduce((sum, i) => sum + i.sold * i.price, 0);

  function flash(text: string) {
    setNotice(text);
    setTimeout(() => setNotice(null), 4000);
  }

  // Tudo aqui fala com a API; os erros aparecem no aviso (ou no editor do item).
  async function add(collection: CosmeticCollection) {
    const result = await addCollection(collection);
    const theme = COLLECTION_THEME[collection];
    if (!result.ok) {
      flash(`⚠️ ${result.error}`);
      return;
    }
    const n = result.count;
    flash(`${theme.emoji} ${n} ${n === 1 ? "item entrou" : "itens entraram"} na Loja (${theme.title})!`);
  }

  async function remove(collection: CosmeticCollection) {
    if (confirmRemove !== collection) {
      setConfirmRemove(collection);
      return;
    }
    setConfirmRemove(null);
    const result = await removeCollection(collection);
    if (!result.ok) {
      flash(`⚠️ ${result.error}`);
      return;
    }
    const n = result.count;
    flash(`🧹 ${n} ${n === 1 ? "item saiu" : "itens saíram"} da Loja (${COLLECTION_THEME[collection].title}) — quem comprou continua com eles.`);
  }

  async function handleSave(data: ShopItemData): Promise<string | null> {
    const error = validateShopItem(data, existing?.id);
    if (error) return error;
    const apiError = existing ? await editItem(existing.id, data) : await addItem(data);
    if (apiError) return apiError;
    setTarget(null);
    return null;
  }

  /** Edição rápida: salva um item de cada vez e para no primeiro erro. */
  async function saveQuickEdits(changes: { id: string; data: ShopItemData }[]): Promise<string | null> {
    for (const change of changes) {
      const error = await editItem(change.id, change.data);
      if (error) return error;
    }
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

      {/* ---- coleções temáticas: colocar/tirar tudo de uma vez ---- */}
      <div className="mb-4 flex flex-col gap-3">
        {COLLECTIONS.map((collection) => {
          const theme = COLLECTION_THEME[collection];
          const onSale = items.filter((i) => i.collection === collection).length;
          const missing = missingFromCollection(collection, items).length;
          const confirming = confirmRemove === collection;
          return (
            <div
              key={collection}
              className={`cg-dark-scope flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 ${theme.borderClass}`}
              style={{ background: theme.background }}
            >
              <div>
                <p className={`text-sm font-bold ${theme.titleClass}`}>
                  {theme.emoji} Coleção {theme.title.replace(/^Coleção de /, "de ")}
                </p>
                <p className={`text-xs ${theme.subtitleClass}`}>
                  {SHOP_COLLECTIONS[collection].length} itens prontos (mascotes, chapéus, óculos, fantasias, cores, auras e itens de XP
                  {eventItemCount(collection) > 0 && `, com ${eventItemCount(collection)} itens do evento`}) •{" "}
                  {onSale > 0 ? `${onSale} à venda agora` : "nenhum à venda ainda"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {missing > 0 && (
                  <button
                    onClick={() => add(collection)}
                    className={`rounded-full bg-gradient-to-r px-4 py-2 text-xs font-bold text-cg-ink shadow-lg transition-transform hover:scale-[1.03] ${theme.buttonClass}`}
                  >
                    {theme.emoji} {onSale > 0 ? `Adicionar os ${missing} que faltam` : "Adicionar a coleção"}
                  </button>
                )}
                {onSale > 0 && (
                  <button
                    onClick={() => remove(collection)}
                    onBlur={() => setConfirmRemove(null)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                      confirming ? "border-rose-400 bg-rose-400/20 text-rose-200" : "border-white/30 text-white/85 hover:bg-white/10"
                    }`}
                  >
                    {confirming ? `Tirar os ${onSale} itens?` : "🧹 Tirar a coleção da Loja"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {notice && <p className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200">{notice}</p>}

      {items.length > 0 && (
        <div className="mb-3 inline-flex gap-1 rounded-xl border border-slate-800 bg-cg-card p-1">
          {(
            [
              ["itens", "📦 Itens à venda"],
              ["rapida", "✏️ Edição rápida (raridade, preço, moedas e XP)"],
            ] as const
          ).map(([v, label]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${view === v ? "bg-white text-cg-ink" : "text-slate-400 hover:text-slate-200"}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {items.length > 0 && view === "rapida" ? (
        <ShopQuickEdit items={items} onSave={saveQuickEdits} />
      ) : items.length === 0 ? (
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
                <div className={`relative flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl bg-cg-tile text-2xl ${item.hidden ? "opacity-60" : ""}`}>
                  {item.icon}
                  {item.slots && <span className="absolute -bottom-1.5 -right-1.5 rounded-full bg-teal-500 px-1.5 text-[10px] font-black text-cg-onaccent">+{item.slots}</span>}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {item.featured && <span title="Em destaque">⭐ </span>}
                  {item.collection && <span title={COLLECTION_THEME[item.collection].title}>{COLLECTION_THEME[item.collection].emoji} </span>}
                  {item.eventItemKey && <span title="Item de evento">🎉 </span>}
                  {item.name}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <RarityBadge rarity={item.rarity} />
                  <span className="flex items-center gap-0.5 text-xs font-bold text-amber-300">
                    <CoinIcon size={12} /> {item.price}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  {item.cosmetic ? `👕 ${COSMETIC_SLOT_LABELS[item.cosmetic.slot]}` : item.slots ? `📦 +${item.slots} espaços no inventário` : "🧪 Item comum"} • {item.sold}{" "}
                  {item.sold === 1 ? "vendido" : "vendidos"}
                </p>
                {item.hidden && <p className="mt-0.5 text-[11px] font-semibold text-slate-400">🔒 Fora da vitrine (só presente ou recompensa)</p>}
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
              ? async () => {
                  const error = await removeItem(existing.id);
                  if (!error) setTarget(null);
                  return error;
                }
              : undefined
          }
          onClose={() => setTarget(null)}
        />
      )}
    </div>
  );
}
