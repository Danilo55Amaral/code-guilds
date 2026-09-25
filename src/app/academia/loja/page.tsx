"use client";

import { useState } from "react";
import Link from "next/link";
import { useStudents, useShop } from "@/engine/store";
import { ShopItem } from "@/engine/shop";
import { RARITY_GLOW } from "@/engine/missions";
import { COSMETIC_SLOT_LABELS, applyCosmetic } from "@/engine/avatar";
import { Student, equipItem, getStudent, ownsCosmetic, wornAvatar } from "@/engine/students";
import { getHouse } from "@/engine/houses";
import Avatar from "@/components/Avatar";
import { CoinIcon, RarityBadge } from "@/components/GameUI";

type Tab = "todos" | "visuais" | "itens";
type Sort = "destaques" | "menor" | "maior" | "populares";

const TAB_LABELS: Record<Tab, string> = { todos: "✨ Tudo", visuais: "👕 Visuais do avatar", itens: "🧪 Itens" };
const SORT_LABELS: Record<Sort, string> = { destaques: "Destaques", menor: "Menor preço", maior: "Maior preço", populares: "Mais vendidos" };

/** Vendido 3+ vezes ganha o selo 🔥 Popular. */
const POPULAR_FROM = 3;

// Brilhos decorativos do banner (posição em %, atraso da animação).
const SPARKLES = [
  { left: 6, top: 18, delay: 0, size: 14 },
  { left: 22, top: 72, delay: 0.8, size: 10 },
  { left: 41, top: 12, delay: 1.6, size: 12 },
  { left: 55, top: 80, delay: 0.4, size: 9 },
  { left: 63, top: 28, delay: 2.2, size: 11 },
  { left: 88, top: 14, delay: 1.2, size: 13 },
  { left: 94, top: 70, delay: 2.8, size: 10 },
];

/** Prévia do item: o próprio aluno vestindo o visual, ou o ícone flutuando. */
function ItemPreview({ item, me, size }: { item: ShopItem; me: Student; size: number }) {
  const glow = RARITY_GLOW[item.rarity];
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{ height: size + 32, background: `radial-gradient(60% 70% at 50% 45%, ${glow}33, transparent 75%)` }}
    >
      {item.cosmetic ? (
        <div className="transition-transform duration-300 group-hover:scale-105">
          <Avatar config={applyCosmetic(wornAvatar(me), item.cosmetic)} size={size} ringColor={glow} />
        </div>
      ) : (
        <div
          className="cg-anim-float flex items-center justify-center rounded-2xl border bg-cg-tile"
          style={{ width: size * 0.8, height: size * 0.8, fontSize: size * 0.42, borderColor: `${glow}66`, boxShadow: `0 0 28px -8px ${glow}` }}
        >
          {item.icon}
        </div>
      )}
    </div>
  );
}

export default function LojaPage() {
  const { activeStudent, patchActive } = useStudents();
  const { items, ready, buy } = useShop();
  const [tab, setTab] = useState<Tab>("todos");
  const [sort, setSort] = useState<Sort>("destaques");
  const [tryOn, setTryOn] = useState<ShopItem | null>(null);
  const [confirming, setConfirming] = useState<ShopItem | null>(null);
  const [bought, setBought] = useState<{ shopItem: ShopItem; inventoryId: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!activeStudent || !ready) return null;
  const me = activeStudent;
  const house = me.houseId ? getHouse(me.houseId) : null;

  const featured = items.filter((i) => i.featured);
  const visible = items
    .filter((i) => (tab === "visuais" ? !!i.cosmetic : tab === "itens" ? !i.cosmetic : true))
    .sort((a, b) => {
      if (sort === "menor") return a.price - b.price;
      if (sort === "maior") return b.price - a.price;
      if (sort === "populares") return b.sold - a.sold;
      return 0; // a lista já vem com os destaques primeiro
    });

  const owned = (i: ShopItem) => !!i.cosmetic && ownsCosmetic(me, i.cosmetic);
  const heroAvatar = tryOn?.cosmetic ? applyCosmetic(wornAvatar(me), tryOn.cosmetic) : wornAvatar(me);

  function provar(item: ShopItem) {
    setTryOn(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function confirmBuy() {
    if (!confirming) return;
    const result = buy(me.id, confirming.id);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setBought({ shopItem: confirming, inventoryId: result.item.id });
    setConfirming(null);
    setError(null);
    setTryOn(null);
  }

  function equipNow() {
    if (!bought) return;
    // relê o aluno já com o item comprado (o estado da tela ainda pode estar um passo atrás)
    const fresh = getStudent(me.id);
    if (fresh) patchActive({ equipped: equipItem(fresh, bought.inventoryId).equipped });
    setBought(null);
  }

  /** Botões de cada card: 👁 Provar (visual) + Comprar, ou "já é seu". */
  function actions(item: ShopItem) {
    const isOwned = owned(item);
    const canAfford = me.coins >= item.price;
    return (
      <div className="mt-3 flex gap-2">
        {item.cosmetic && !isOwned && (
          <button
            onClick={() => provar(item)}
            className="rounded-full border border-slate-700 bg-cg-raised px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-slate-500"
          >
            👁 Provar
          </button>
        )}
        {isOwned ? (
          <Link
            href="/academia/inventario"
            className="flex-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-center text-xs font-semibold text-emerald-300"
          >
            ✓ Já é seu — equipar no Inventário
          </Link>
        ) : (
          <button
            onClick={() => {
              setError(null);
              setConfirming(item);
            }}
            disabled={!canAfford}
            className="flex-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-2 text-xs font-bold text-cg-onaccent shadow-lg shadow-amber-500/20 transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-600 disabled:shadow-none disabled:hover:scale-100"
          >
            {canAfford ? "🛒 Comprar" : `Faltam ${item.price - me.coins}`}
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* ===== BANNER ===== sempre escuro, nos dois temas */}
      <div
        className="cg-dark-scope relative mb-6 overflow-hidden rounded-3xl border border-violet-500/30 p-6 sm:p-8"
        style={{
          background:
            "radial-gradient(60% 80% at 85% 30%, rgba(236,72,153,0.35), transparent 70%), radial-gradient(50% 70% at 10% 90%, rgba(99,102,241,0.45), transparent 70%), linear-gradient(135deg, #1e1b4b 0%, #3b0764 55%, #500724 100%)",
        }}
      >
        {SPARKLES.map((s, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="cg-anim-float pointer-events-none absolute text-amber-200"
            style={{ left: `${s.left}%`, top: `${s.top}%`, fontSize: s.size, animationDelay: `${s.delay}s`, opacity: 0.8 }}
          >
            ✦
          </span>
        ))}

        <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-200">🛍️ Loja da Academia</p>
            <h1 className="cg-anim-shimmer mt-2 text-4xl font-black uppercase tracking-wide sm:text-5xl">Mercado Arcano</h1>
            <p className="mt-2 max-w-md text-sm text-violet-100/80">
              Visuais exclusivos pro seu avatar e itens pra turbinar a sua jornada. Gaste suas moedas com estilo!
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-amber-400/40 bg-black/30 px-4 py-2 backdrop-blur">
              <span className="text-[11px] uppercase tracking-wider text-amber-100/70">Seu saldo</span>
              <CoinIcon size={22} />
              <span className="text-2xl font-black text-amber-300">{me.coins}</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="cg-anim-float relative">
              <div
                className="absolute inset-0 rounded-full blur-2xl"
                style={{ background: tryOn ? RARITY_GLOW[tryOn.rarity] : (house?.hex ?? "#8b5cf6"), opacity: 0.55 }}
              />
              <Avatar config={heroAvatar} ringColor={tryOn ? RARITY_GLOW[tryOn.rarity] : house?.hex} size={150} />
            </div>
            {tryOn ? (
              <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-xs text-white">
                <span>
                  Provando: <span className="font-semibold text-amber-200">{tryOn.name}</span>
                </span>
                <button onClick={() => setTryOn(null)} className="text-violet-200 hover:text-white" aria-label="Tirar a prova">
                  ✕
                </button>
              </div>
            ) : (
              <p className="text-xs text-violet-100/70">Seu visual atual — clique em 👁 Provar num item</p>
            )}
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="cg-card flex flex-col items-center gap-2 px-6 py-14 text-center">
          <p className="text-4xl">🏪</p>
          <p className="text-sm text-slate-400">A Loja está fechada por enquanto — o ADM ainda não colocou itens à venda.</p>
        </div>
      ) : (
        <>
          {/* ===== DESTAQUES ===== */}
          {featured.length > 0 && (
            <div className="mb-8">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
                <span className="text-lg">⭐</span> Em destaque
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((item) => {
                  const glow = RARITY_GLOW[item.rarity];
                  return (
                    <div
                      key={item.id}
                      className="group relative rounded-3xl p-[2px] transition-transform duration-300 hover:-translate-y-1"
                      style={{ background: `linear-gradient(135deg, ${glow}, transparent 45%, ${glow})`, boxShadow: `0 10px 40px -18px ${glow}` }}
                    >
                      <div className="relative h-full overflow-hidden rounded-[22px] bg-cg-card">
                        <span className="absolute left-3 top-3 z-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-cg-onaccent">
                          ⭐ Destaque
                        </span>
                        <ItemPreview item={item} me={me} size={112} />
                        <div className="px-4 pb-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-bold text-white">{item.name}</p>
                            <RarityBadge rarity={item.rarity} />
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs text-slate-400">{item.description}</p>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="flex items-center gap-1 text-lg font-black text-amber-300">
                              <CoinIcon size={18} /> {item.price}
                            </span>
                            {item.cosmetic && <span className="text-[11px] text-violet-300">👕 {COSMETIC_SLOT_LABELS[item.cosmetic.slot]}</span>}
                          </div>
                          {actions(item)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===== VITRINE ===== */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex max-w-full flex-wrap gap-1 rounded-xl border border-slate-800 bg-cg-card p-1">
              {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${tab === t ? "bg-white text-cg-ink" : "text-slate-400 hover:text-slate-200"}`}
                >
                  {TAB_LABELS[t]}
                </button>
              ))}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              aria-label="Ordenar itens"
              className="rounded-lg border border-slate-700 bg-cg-sunken px-3 py-1.5 text-xs text-slate-100 focus:border-slate-400 focus:outline-none"
            >
              {(Object.keys(SORT_LABELS) as Sort[]).map((s) => (
                <option key={s} value={s}>
                  {SORT_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          {visible.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhum item nessa categoria por enquanto.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((item, i) => {
                const glow = RARITY_GLOW[item.rarity];
                return (
                  <div
                    key={item.id}
                    className="cg-card cg-anim-rise group relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${Math.min(i, 8) * 0.05}s`, boxShadow: `0 12px 36px -24px ${glow}` }}
                  >
                    <div className="absolute left-3 top-3 z-10">
                      <RarityBadge rarity={item.rarity} />
                    </div>
                    {owned(item) ? (
                      <span className="absolute right-3 top-3 z-10 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-cg-onaccent">✓ Seu</span>
                    ) : (
                      item.sold >= POPULAR_FROM && (
                        <span className="absolute right-3 top-3 z-10 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-cg-onaccent">🔥 Popular</span>
                      )
                    )}
                    <ItemPreview item={item} me={me} size={92} />
                    <div className="px-4 pb-4">
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="mt-1 line-clamp-2 min-h-[2rem] text-xs text-slate-400">{item.description}</p>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                        <span className="flex items-center gap-1 text-base font-black text-amber-300">
                          <CoinIcon size={16} /> {item.price}
                        </span>
                        <span className="text-slate-500">
                          {item.cosmetic ? `👕 ${COSMETIC_SLOT_LABELS[item.cosmetic.slot]}` : item.xp > 0 ? `✨ +${item.xp} XP ao usar` : "🎒 Item"}
                        </span>
                      </div>
                      {actions(item)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ===== CONFIRMAR COMPRA ===== */}
      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setConfirming(null)}>
          <div className="cg-card cg-anim-pop w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <ItemPreview item={confirming} me={me} size={130} />
            <div className="px-6 pb-6 text-center">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Confirmar compra</p>
              <h2 className="mt-1 text-xl font-bold text-white">{confirming.name}</h2>
              <div className="mt-2 flex justify-center">
                <RarityBadge rarity={confirming.rarity} />
              </div>
              <p className="mt-3 text-sm text-slate-300">{confirming.description}</p>
              <div className="mt-4 rounded-xl border border-slate-800 bg-cg-sunken px-4 py-3 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Preço</span>
                  <span className="flex items-center gap-1 font-bold text-amber-300">
                    <CoinIcon size={14} /> {confirming.price}
                  </span>
                </div>
                <div className="mt-1 flex justify-between text-slate-400">
                  <span>Saldo depois da compra</span>
                  <span className="flex items-center gap-1 font-semibold text-slate-200">
                    <CoinIcon size={14} /> {me.coins - confirming.price}
                  </span>
                </div>
              </div>
              {error && <p className="mt-3 text-xs text-rose-300">{error}</p>}
              <div className="mt-5 flex gap-2">
                <button onClick={() => setConfirming(null)} className="cg-btn-secondary flex-1 !py-2.5">
                  Cancelar
                </button>
                <button
                  onClick={confirmBuy}
                  className="flex-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2.5 text-sm font-bold text-cg-onaccent shadow-lg shadow-amber-500/25 transition-transform hover:scale-[1.03]"
                >
                  Comprar por {confirming.price}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== COMPRA FEITA ===== */}
      {bought && (
        <div className="cg-dark-scope fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
          <div
            className="cg-card cg-anim-pop relative w-full max-w-sm overflow-hidden p-8 text-center"
            style={{ boxShadow: `0 0 80px -20px ${RARITY_GLOW[bought.shopItem.rarity]}` }}
          >
            {SPARKLES.map((s, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="cg-anim-float pointer-events-none absolute text-amber-200"
                style={{ left: `${s.left}%`, top: `${s.top}%`, fontSize: s.size, animationDelay: `${s.delay}s` }}
              >
                ✦
              </span>
            ))}
            <div className="relative">
              <div className="flex justify-center">
                {bought.shopItem.cosmetic ? (
                  <Avatar
                    config={applyCosmetic(wornAvatar(me), bought.shopItem.cosmetic)}
                    ringColor={RARITY_GLOW[bought.shopItem.rarity]}
                    size={130}
                  />
                ) : (
                  <div className="cg-anim-float flex h-24 w-24 items-center justify-center rounded-2xl bg-cg-tile text-5xl">{bought.shopItem.icon}</div>
                )}
              </div>
              <h2 className="cg-anim-shimmer mt-5 text-2xl font-black uppercase">Compra feita!</h2>
              <p className="mt-2 text-sm text-slate-300">
                <span className="font-semibold text-white">
                  {bought.shopItem.icon} {bought.shopItem.name}
                </span>{" "}
                agora é seu.
              </p>
              {bought.shopItem.cosmetic ? (
                <div className="mt-6 flex flex-col gap-2">
                  <button
                    onClick={equipNow}
                    className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-3 text-sm font-bold text-cg-onaccent shadow-lg shadow-violet-500/30 transition-transform hover:scale-[1.03]"
                  >
                    👕 Equipar agora
                  </button>
                  <button onClick={() => setBought(null)} className="text-xs text-slate-400 hover:text-white">
                    Depois — fica guardado no Inventário
                  </button>
                </div>
              ) : (
                <div className="mt-6 flex flex-col gap-2">
                  <Link href="/academia/inventario" className="cg-btn-primary">
                    Ver no Inventário
                  </Link>
                  <button onClick={() => setBought(null)} className="text-xs text-slate-400 hover:text-white">
                    Continuar comprando
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
