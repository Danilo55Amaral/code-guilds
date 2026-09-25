"use client";

import { useState } from "react";
import { ShopItem, ShopItemData } from "@/engine/shop";
import { Rarity, RARITY_META, normalizeSearch } from "@/engine/missions";
import { COLLECTIONS, CosmeticCollection } from "@/engine/avatar";
import { COLLECTION_THEME } from "./collections";
import SearchInput from "./SearchInput";
import { PaginationFooter, usePagination } from "./Pagination";
import { CoinIcon } from "./GameUI";

type Draft = { rarity: Rarity; price: number; value: number; xp: number };
type Filter = "todos" | "sem-colecao" | CosmeticCollection;

const ROWS_PER_PAGE = 20;

const toInt = (raw: string) => Math.max(0, Math.round(Number(raw) || 0));

/** Os campos editáveis de um item, sem id/vendas/data (o formato que o updateShopItem recebe). */
function dataOf(item: ShopItem): ShopItemData {
  const { id: _id, sold: _sold, createdAt: _createdAt, ...data } = item;
  return data;
}

/**
 * Edição rápida da Loja (Painel ADM): raridade, preço, valor de revenda e XP
 * de vários itens numa tabela, salvando tudo de uma vez. Dá pra filtrar por
 * coleção, buscar e ajustar o preço dos itens filtrados em % (promoção).
 */
export default function ShopQuickEdit({ items, onSave }: { items: ShopItem[]; onSave: (changes: { id: string; data: ShopItemData }[]) => void }) {
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("todos");
  const [percent, setPercent] = useState(-20);
  const [saved, setSaved] = useState<string | null>(null);

  const q = normalizeSearch(search);
  const filtered = items.filter(
    (i) =>
      (filter === "todos" || (filter === "sem-colecao" ? !i.collection : i.collection === filter)) &&
      (!q || normalizeSearch(i.name).includes(q)),
  );
  const pager = usePagination(filtered, ROWS_PER_PAGE, `${search}|${filter}`);

  const current = (item: ShopItem): Draft => drafts[item.id] ?? { rarity: item.rarity, price: item.price, value: item.value, xp: item.xp };
  const isChanged = (item: ShopItem) => {
    const d = drafts[item.id];
    return !!d && (d.rarity !== item.rarity || d.price !== item.price || d.value !== item.value || d.xp !== item.xp);
  };
  const changed = items.filter(isChanged);

  function update(item: ShopItem, patch: Partial<Draft>) {
    setDrafts((ds) => ({ ...ds, [item.id]: { ...current(item), ...patch } }));
  }

  function applyPercent() {
    setDrafts((ds) => {
      const next = { ...ds };
      for (const item of filtered) {
        const base = next[item.id] ?? { rarity: item.rarity, price: item.price, value: item.value, xp: item.xp };
        next[item.id] = { ...base, price: Math.max(1, Math.round(base.price * (1 + percent / 100))) };
      }
      return next;
    });
  }

  function save() {
    onSave(changed.map((item) => ({ id: item.id, data: { ...dataOf(item), ...current(item), price: Math.max(1, current(item).price) } })));
    setSaved(`✓ ${changed.length} ${changed.length === 1 ? "item atualizado" : "itens atualizados"} na Loja.`);
    setTimeout(() => setSaved(null), 3500);
    setDrafts({});
  }

  const inputClass = "w-20 rounded-lg border border-slate-700 bg-cg-sunken px-2 py-1 text-xs text-slate-100 focus:border-slate-400 focus:outline-none disabled:opacity-40";

  return (
    <div>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar item pelo nome…" className="flex-1" />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as Filter)}
          aria-label="Filtrar por coleção"
          className="rounded-lg border border-slate-700 bg-cg-sunken px-3 py-2 text-xs text-slate-100 focus:border-slate-400 focus:outline-none"
        >
          <option value="todos">Todas as coleções</option>
          <option value="sem-colecao">Sem coleção (ano todo)</option>
          {COLLECTIONS.map((c) => (
            <option key={c} value={c}>
              {COLLECTION_THEME[c].emoji} {COLLECTION_THEME[c].title}
            </option>
          ))}
        </select>
      </div>

      {/* ajuste de preço em massa (promoção ou reajuste) */}
      <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-slate-300">
        <span>🏷️ Ajustar o preço dos {filtered.length} itens mostrados em</span>
        <input type="number" value={percent} onChange={(e) => setPercent(Math.round(Number(e.target.value) || 0))} className={inputClass} aria-label="Porcentagem" />
        <span>%</span>
        <button onClick={applyPercent} className="rounded-full border border-amber-400/60 px-3 py-1 font-semibold text-amber-200 hover:bg-amber-500/10">
          Aplicar
        </button>
        <span className="text-[11px] text-slate-500">(negativo = desconto • só vale depois de salvar)</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full min-w-[640px] text-left text-xs">
          <thead className="bg-cg-sunken text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-3 py-2">Item</th>
              <th className="px-3 py-2">Raridade</th>
              <th className="px-3 py-2">Preço</th>
              <th className="px-3 py-2" title="Quanto o aluno recebe se vender pro sistema">Moedas (revenda)</th>
              <th className="px-3 py-2" title="XP ao usar — só itens comuns (visuais não são consumíveis)">XP ao usar</th>
            </tr>
          </thead>
          <tbody>
            {pager.pageItems.map((item) => {
              const d = current(item);
              return (
                <tr key={item.id} className={`border-t border-slate-800 ${isChanged(item) ? "bg-amber-500/10" : ""}`}>
                  <td className="px-3 py-2">
                    <span className="flex items-center gap-2 text-slate-200">
                      <span className="text-lg">{item.icon}</span>
                      <span className="min-w-0">
                        <span className="block font-medium text-white">{item.name}</span>
                        <span className="text-[10px] text-slate-500">
                          {item.collection ? `${COLLECTION_THEME[item.collection].emoji} ${COLLECTION_THEME[item.collection].title}` : "Ano todo"}
                          {item.cosmetic ? " • 👕 visual" : ""}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={d.rarity}
                      onChange={(e) => update(item, { rarity: e.target.value as Rarity })}
                      className={`rounded-lg border border-slate-700 bg-cg-sunken px-2 py-1 text-xs focus:border-slate-400 focus:outline-none ${RARITY_META[d.rarity].colorClass}`}
                    >
                      {(Object.keys(RARITY_META) as Rarity[]).map((r) => (
                        <option key={r} value={r}>
                          {RARITY_META[r].label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <span className="flex items-center gap-1">
                      <CoinIcon size={12} />
                      <input type="number" min={1} value={d.price} onChange={(e) => update(item, { price: toInt(e.target.value) })} className={inputClass} aria-label={`Preço de ${item.name}`} />
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" min={0} value={d.value} onChange={(e) => update(item, { value: toInt(e.target.value) })} className={inputClass} aria-label={`Moedas de revenda de ${item.name}`} />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={0}
                      value={d.xp}
                      disabled={!!item.cosmetic}
                      title={item.cosmetic ? "Visual do avatar não é consumível — não dá XP ao usar" : undefined}
                      onChange={(e) => update(item, { xp: toInt(e.target.value) })}
                      className={inputClass}
                      aria-label={`XP de ${item.name}`}
                    />
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-slate-500">
                  Nenhum item encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <PaginationFooter pager={pager} noun="itens" />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-emerald-300">{saved}</p>
        <div className="flex gap-2">
          {changed.length > 0 && (
            <button onClick={() => setDrafts({})} className="cg-btn-secondary !px-4 !py-2 text-xs">
              Desfazer
            </button>
          )}
          <button onClick={save} disabled={changed.length === 0} className="cg-btn-primary !px-4 !py-2 text-xs disabled:cursor-not-allowed disabled:opacity-30">
            💾 Salvar {changed.length > 0 ? `${changed.length} ${changed.length === 1 ? "alteração" : "alterações"}` : "alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}
