"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useStudents, useShop, useGameActions } from "@/engine/store";
import { ShopItem, collectionsNewestFirst, maxPurchaseQuantity } from "@/engine/shop";
import { RARITY_GLOW } from "@/engine/missions";
import { AvatarConfig, COSMETIC_SLOT_LABELS, CosmeticCollection, applyCosmetic } from "@/engine/avatar";
import { COLLECTION_THEME } from "@/components/collections";
import { freeSlots, inventoryCapacity, ownsCosmetic, wornAvatar } from "@/engine/students";
import { getHouse } from "@/engine/houses";
import Avatar from "@/components/Avatar";
import { CoinIcon, RarityBadge } from "@/components/GameUI";
import LuckyWheel, { MiniWheel } from "@/components/LuckyWheel";
import { WheelStatus, fetchWheelStatus } from "@/engine/gameApi";
import { WHEEL_SPIN_PRICE } from "@/engine/luckyWheel";

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

// O que cai no fundo das seções especiais (neve no Natal, pétalas na Páscoa):
// posição, tamanho, velocidade e vento fixos (sem Math.random no render).
const FALLING = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 47) % 100,
  size: 9 + (i % 4) * 3,
  duration: 8 + (i % 5) * 1.6,
  delay: -((i * 1.3) % 11), // negativo: a neve já começa espalhada pela seção
  drift: ((i % 3) - 1) * 30,
}));

/**
 * Prévia do item: o próprio aluno vestindo o visual, ou o ícone flutuando. `base` é o visual que o
 * aluno está usando. Nos cards, `still` deixa a aura e o pet parados (animam com o mouse em cima):
 * com dezenas de cards, as auras animadas juntas deixavam a Loja lenta. O memo evita redesenhar
 * todos os avatares quando só muda a aba, a ordem, a prova ou a quantidade.
 */
const ItemPreview = memo(function ItemPreview({ item, base, size, still = false }: { item: ShopItem; base: AvatarConfig; size: number; still?: boolean }) {
  const glow = RARITY_GLOW[item.rarity];
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{ height: size + 32, background: `radial-gradient(60% 70% at 50% 45%, ${glow}33, transparent 75%)` }}
    >
      {item.cosmetic ? (
        <div className="transition-transform duration-300 group-hover:scale-105">
          <Avatar config={applyCosmetic(base, item.cosmetic)} size={size} ringColor={glow} still={still} />
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
});

/** Quantas unidades comprar: − e +, o número digitado e os atalhos (1, 5, 10 e o máximo). */
function QuantityPicker({ value, max, onChange }: { value: number; max: number; onChange: (n: number) => void }) {
  const set = (n: number) => onChange(Math.max(1, Math.min(Math.max(1, max), Math.floor(n) || 1)));
  const step =
    "flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-cg-raised text-xl font-black text-white transition-colors hover:border-amber-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-700";
  const shortcuts = Array.from(new Set([1, 5, 10, max])).filter((n) => n >= 1 && n <= max);

  return (
    <div className="mt-4">
      <p className="text-[11px] uppercase tracking-wider text-slate-500">Quantos você quer?</p>
      <div className="mt-2 flex items-center justify-center gap-3">
        <button type="button" onClick={() => set(value - 1)} disabled={value <= 1} className={step} aria-label="Menos um">
          −
        </button>
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={Math.max(1, max)}
          value={value}
          onChange={(e) => set(Number(e.target.value))}
          onFocus={(e) => e.target.select()}
          aria-label="Quantidade"
          className="w-20 rounded-xl border border-slate-700 bg-cg-sunken py-1.5 text-center text-2xl font-black text-white outline-none focus:border-amber-400 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button type="button" onClick={() => set(value + 1)} disabled={value >= max} className={step} aria-label="Mais um">
          +
        </button>
      </div>
      {max > 1 && (
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {shortcuts.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => set(n)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                n === value ? "border-amber-400 bg-amber-400/15 text-amber-200" : "border-slate-700 text-slate-300 hover:border-slate-500"
              }`}
            >
              {n === max ? `Máx (${max})` : n}
            </button>
          ))}
        </div>
      )}
      <p className="mt-2 text-[11px] text-slate-500">
        {max >= 1 ? `Você pode comprar até ${max} agora (pelas suas moedas e pelo espaço no inventário).` : "Sem moedas ou espaço pra comprar agora."}
      </p>
    </div>
  );
}

export default function LojaPage() {
  const { activeStudent } = useStudents();
  const { items: allItems, ready, buy } = useShop();
  const { equipCosmetic } = useGameActions();
  const [busy, setBusy] = useState(false);
  // Itens "fora da vitrine" só o ADM dá (presente ou recompensa de missão): não aparecem aqui.
  const items = allItems.filter((i) => !i.hidden);
  const [tab, setTab] = useState<Tab>("todos");
  const [sort, setSort] = useState<Sort>("destaques");
  const [tryOn, setTryOn] = useState<ShopItem | null>(null);
  const [confirming, setConfirming] = useState<ShopItem | null>(null);
  // quantas unidades o aluno escolheu no modal de compra
  const [quantity, setQuantity] = useState(1);
  const [bought, setBought] = useState<{ shopItem: ShopItem; inventoryId: string; quantity: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Roleta da Sorte: aberta ou não, e se o giro grátis de hoje ainda está disponível
  const [wheelOpen, setWheelOpen] = useState(false);
  const [wheelStatus, setWheelStatus] = useState<WheelStatus | null>(null);
  // o visual que o aluno está usando (base das prévias); só muda quando o aluno muda
  const worn = useMemo(() => (activeStudent ? wornAvatar(activeStudent) : null), [activeStudent]);

  const loadWheelStatus = useCallback(async () => {
    const result = await fetchWheelStatus();
    if (result.ok) setWheelStatus({ freeSpinAvailable: result.freeSpinAvailable, price: result.price });
  }, []);

  useEffect(() => {
    void loadWheelStatus();
  }, [loadWheelStatus]);

  if (!activeStudent || !ready || !worn) return null;
  // já conferido acima (as funções de dentro da página não enxergam essa conferência)
  const base: AvatarConfig = worn;
  const me = activeStudent;
  const house = me.houseId ? getHouse(me.houseId) : null;

  // Cada coleção temática tem seção própria — os itens dela não repetem nos destaques nem na vitrine.
  const collectionItems = (c: CosmeticCollection) =>
    items.filter((i) => i.collection === c).sort((a, b) => Number(b.featured) - Number(a.featured) || b.price - a.price);
  const regular = items.filter((i) => !i.collection);
  const featured = regular.filter((i) => i.featured);
  const visible = regular
    .filter((i) => (tab === "visuais" ? !!i.cosmetic : tab === "itens" ? !i.cosmetic : true))
    .sort((a, b) => {
      if (sort === "menor") return a.price - b.price;
      if (sort === "maior") return b.price - a.price;
      if (sort === "populares") return b.sold - a.sold;
      return 0; // a lista já vem com os destaques primeiro
    });

  const owned = (i: ShopItem) => !!i.cosmetic && ownsCosmetic(me, i.cosmetic);
  const heroAvatar = tryOn?.cosmetic ? applyCosmetic(base, tryOn.cosmetic) : base;

  function provar(item: ShopItem) {
    setTryOn(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openBuy(item: ShopItem) {
    setError(null);
    setQuantity(1);
    setConfirming(item);
  }

  // A compra é decidida pela API (moedas, espaço e visual repetido)
  async function confirmBuy() {
    if (!confirming || busy) return;
    setBusy(true);
    const result = await buy(confirming, quantity);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setBought({ shopItem: confirming, inventoryId: result.item.id, quantity: result.quantity });
    setConfirming(null);
    setError(null);
    setTryOn(null);
  }

  function equipNow() {
    if (!bought) return;
    void equipCosmetic(bought.inventoryId);
    setBought(null);
  }

  /** Card da vitrine (e das seções de coleção, com a cor da coleção). */
  function card(item: ShopItem, i: number, collection?: CosmeticCollection) {
    const theme = collection ? COLLECTION_THEME[collection] : null;
    const glow = theme ? theme.glow : RARITY_GLOW[item.rarity];
    return (
      <div
        key={item.id}
        className={`cg-card cg-anim-rise group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${theme?.cardBorderClass ?? ""}`}
        style={{ animationDelay: `${Math.min(i, 8) * 0.05}s`, boxShadow: `0 12px 36px -24px ${glow}` }}
      >
        <div className="absolute left-3 top-3 z-10">
          <RarityBadge rarity={item.rarity} />
        </div>
        {owned(item) ? (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-cg-onaccent">✓ Seu</span>
        ) : item.sold >= POPULAR_FROM ? (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-cg-onaccent">🔥 Popular</span>
        ) : (
          item.featured &&
          theme && (
            <span className={`absolute right-3 top-3 z-10 rounded-full bg-gradient-to-r px-2 py-0.5 text-[10px] font-black text-cg-ink ${theme.buttonClass}`}>
              ⭐ Destaque
            </span>
          )
        )}
        <ItemPreview item={item} base={base} size={92} still />
        <div className="px-4 pb-4">
          <p className="font-semibold text-white">{item.name}</p>
          <p className="mt-1 line-clamp-2 min-h-[2rem] text-xs text-slate-400">{item.description}</p>
          {item.eventItemKey && <p className="mt-1 text-[10px] font-semibold text-fuchsia-300">🎉 Item de evento</p>}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span className="flex items-center gap-1 text-base font-black text-amber-300">
              <CoinIcon size={16} /> {item.price}
            </span>
            <span className="text-slate-500">
              {item.cosmetic
                ? `👕 ${COSMETIC_SLOT_LABELS[item.cosmetic.slot]}`
                : item.slots
                  ? `📦 +${item.slots} espaços no inventário`
                  : item.xp > 0
                    ? `✨ +${item.xp} XP ao usar`
                    : "🎒 Item"}
            </span>
          </div>
          {actions(item)}
        </div>
      </div>
    );
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
            onClick={() => openBuy(item)}
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
      {/* ===== ROLETA DA SORTE ===== o primeiro botão da Loja, sempre escuro */}
      <button
        onClick={() => {
          setWheelOpen(true);
          void loadWheelStatus();
        }}
        className="cg-dark-scope group relative mb-5 flex w-full flex-wrap items-center gap-3 overflow-hidden rounded-3xl border-2 border-amber-400/70 p-4 text-left shadow-xl shadow-amber-500/20 transition-transform hover:-translate-y-0.5 hover:scale-[1.01] sm:flex-nowrap sm:gap-4 sm:p-5"
        style={{
          background:
            "radial-gradient(40% 120% at 12% 50%, rgba(251,191,36,0.45), transparent 70%), radial-gradient(50% 120% at 90% 50%, rgba(236,72,153,0.4), transparent 70%), linear-gradient(110deg, #3b0764 0%, #6d28d9 50%, #9d174d 100%)",
        }}
      >
        {SPARKLES.slice(0, 5).map((s, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="cg-anim-float pointer-events-none absolute text-amber-200"
            style={{ left: `${(s.left + 20) % 100}%`, top: `${s.top}%`, fontSize: s.size, animationDelay: `${s.delay}s`, opacity: 0.7 }}
          >
            ✦
          </span>
        ))}
        {/* no celular a roletinha é menor e o "Girar" desce pra uma linha só dele */}
        <MiniWheel size={84} className="!h-16 !w-16 sm:!h-[84px] sm:!w-[84px]" />
        <div className="relative min-w-0 flex-1">
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-amber-200">🎰 Tente a sorte</p>
          <p className="cg-anim-shimmer text-xl font-black uppercase tracking-wide sm:text-3xl">Roleta da Sorte</p>
          <p className="mt-0.5 text-xs text-violet-100/85 sm:text-sm">
            20 prêmios: moedas, XP, a Chave do Multiverso e visuais da Loja. 1 giro grátis por dia!
          </p>
        </div>
        <span
          className={`relative w-full shrink-0 rounded-full px-4 py-2 text-center text-xs font-black uppercase tracking-wide text-cg-onaccent shadow-lg sm:w-auto sm:text-sm ${
            wheelStatus?.freeSpinAvailable
              ? "cg-anim-wheel-glow bg-gradient-to-r from-emerald-400 to-teal-500"
              : "bg-gradient-to-r from-amber-400 to-orange-500"
          }`}
        >
          {wheelStatus?.freeSpinAvailable ? "🎁 Giro grátis!" : `🎡 Girar · ${wheelStatus?.price ?? WHEEL_SPIN_PRICE} moedas`}
        </span>
      </button>
      {wheelOpen && <LuckyWheel me={me} status={wheelStatus} onStatus={setWheelStatus} onClose={() => setWheelOpen(false)} />}

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
              {/* o brilho em volta: degradê em vez de blur (o blur era recalculado a cada quadro da aura) */}
              <div
                className="absolute -inset-6 rounded-full"
                style={{ background: `radial-gradient(closest-side, ${tryOn ? RARITY_GLOW[tryOn.rarity] : (house?.hex ?? "#8b5cf6")}8c, transparent)` }}
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
          {/* ===== COLEÇÕES TEMÁTICAS ===== uma seção por coleção à venda, sempre escura, nos dois temas;
              a liberada mais recentemente fica em cima */}
          {collectionsNewestFirst(items).map((collection) => {
            const list = collectionItems(collection);
            if (list.length === 0) return null;
            const theme = COLLECTION_THEME[collection];
            return (
              <div
                key={collection}
                className={`cg-dark-scope relative mb-8 overflow-hidden rounded-3xl border p-5 sm:p-6 ${theme.borderClass}`}
                style={{ background: theme.background }}
              >
                {theme.falling &&
                  FALLING.map((f, i) => (
                    <span
                      key={`cai-${i}`}
                      aria-hidden="true"
                      className={`cg-anim-snow pointer-events-none absolute top-0 select-none ${theme.falling!.colorClass}`}
                      style={
                        {
                          left: `${f.left}%`,
                          fontSize: f.size,
                          "--cg-duration": `${f.duration}s`,
                          "--cg-delay": `${f.delay}s`,
                          "--cg-drift": `${f.drift}px`,
                        } as React.CSSProperties
                      }
                    >
                      {i % 2 && theme.falling!.alt ? theme.falling!.alt : theme.falling!.char}
                    </span>
                  ))}
                {theme.decor.map((d, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className="cg-anim-float pointer-events-none absolute select-none"
                    style={{ left: `${d.left}%`, top: `${d.top}%`, fontSize: d.size, animationDelay: `${d.delay}s`, opacity: 0.55 }}
                  >
                    {d.emoji}
                  </span>
                ))}
                <div className="relative mb-4 text-center sm:text-left">
                  <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${theme.subtitleClass}`}>{theme.tagline}</p>
                  <h2 className={`mt-1 text-2xl font-black uppercase tracking-wide sm:text-3xl ${theme.titleClass}`} style={{ textShadow: theme.titleGlow }}>
                    {theme.emoji} {theme.title}
                  </h2>
                  <p className={`mt-1 text-sm ${theme.subtitleClass}`}>{theme.subtitle}</p>
                </div>
                <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((item, i) => card(item, i, collection))}</div>
              </div>
            );
          })}

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
                        <ItemPreview item={item} base={base} size={112} still />
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
              {visible.map((item, i) => card(item, i))}
            </div>
          )}
        </>
      )}

      {/* ===== CONFIRMAR COMPRA ===== */}
      {confirming && (
        <div className="fixed inset-0 z-50 flex overflow-y-auto bg-black/80 p-4" onClick={() => setConfirming(null)}>
          <div className="cg-card cg-anim-pop m-auto w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <ItemPreview item={confirming} base={base} size={130} />
            <div className="px-6 pb-6 text-center">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Confirmar compra</p>
              <h2 className="mt-1 text-xl font-bold text-white">{confirming.name}</h2>
              <div className="mt-2 flex justify-center">
                <RarityBadge rarity={confirming.rarity} />
              </div>
              <p className="mt-3 text-sm text-slate-300">{confirming.description}</p>
              {!confirming.cosmetic && (
                <QuantityPicker value={quantity} max={maxPurchaseQuantity(me, confirming)} onChange={setQuantity} />
              )}
              <div className="mt-4 rounded-xl border border-slate-800 bg-cg-sunken px-4 py-3 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>{quantity > 1 ? "Preço de cada" : "Preço"}</span>
                  <span className="flex items-center gap-1 font-bold text-amber-300">
                    <CoinIcon size={14} /> {confirming.price}
                  </span>
                </div>
                {quantity > 1 && (
                  <>
                    <div className="mt-1 flex justify-between text-slate-400">
                      <span>Quantidade</span>
                      <span className="font-semibold text-slate-200">× {quantity}</span>
                    </div>
                    <div className="mt-2 flex justify-between border-t border-slate-800 pt-2 text-slate-300">
                      <span className="font-semibold">Total</span>
                      <span className="flex items-center gap-1 text-base font-black text-amber-300">
                        <CoinIcon size={16} /> {confirming.price * quantity}
                      </span>
                    </div>
                  </>
                )}
                <div className="mt-1 flex justify-between text-slate-400">
                  <span>Saldo depois da compra</span>
                  <span className="flex items-center gap-1 font-semibold text-slate-200">
                    <CoinIcon size={14} /> {me.coins - confirming.price * quantity}
                  </span>
                </div>
                {quantity > 1 && (
                  <div className="mt-1 flex justify-between text-slate-400">
                    <span>Espaço no inventário</span>
                    <span className="font-semibold text-slate-200">
                      {quantity} de {freeSlots(me)} livres
                    </span>
                  </div>
                )}
              </div>
              {confirming.slots && (
                <p className="mt-3 rounded-xl border border-teal-500/40 bg-teal-500/10 px-3 py-2 text-xs text-teal-100">
                  📦 Use no Inventário pra ganhar +{confirming.slots} espaços pra sempre (hoje cabem {inventoryCapacity(me)}).
                </p>
              )}
              {freeSlots(me) < 1 && (
                <p className="mt-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
                  🎒 Seu inventário está cheio ({me.inventory.length}/{inventoryCapacity(me)}). Libere espaço no Inventário pra poder comprar.
                </p>
              )}
              {error && <p className="mt-3 text-xs text-rose-300">{error}</p>}
              <div className="mt-5 flex gap-2">
                <button onClick={() => setConfirming(null)} className="cg-btn-secondary flex-1 !py-2.5">
                  Cancelar
                </button>
                <button
                  onClick={confirmBuy}
                  disabled={busy || maxPurchaseQuantity(me, confirming) < quantity}
                  className="flex-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2.5 text-sm font-bold text-cg-onaccent shadow-lg shadow-amber-500/25 transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                >
                  {busy ? "Comprando…" : quantity > 1 ? `Comprar ${quantity} por ${confirming.price * quantity}` : `Comprar por ${confirming.price}`}
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
                    config={applyCosmetic(base, bought.shopItem.cosmetic)}
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
                  {bought.quantity > 1 && `${bought.quantity}× `}
                  {bought.shopItem.icon} {bought.shopItem.name}
                </span>{" "}
                {bought.quantity > 1 ? "agora são seus." : "agora é seu."}
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
