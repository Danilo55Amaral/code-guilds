"use client";

import { useEffect, useState } from "react";
import { InventoryItem, Student } from "@/engine/students";
import { RARITY_ICON } from "@/engine/missions";
import { getHouse } from "@/engine/houses";
import Avatar from "./Avatar";
import { CoinIcon, ItemStats, RarityBadge } from "./GameUI";

// ============================================================================
// SELL ITEM — janela de venda de um item do inventário: pro sistema (recebe o
// valor na hora) ou pra um colega (vira uma oferta que ele aceita ou recusa).
// ============================================================================

type Mode = "sistema" | "colega";

export default function SellItemModal({
  item,
  buyers,
  onSellToSystem,
  onOffer,
  onClose,
}: {
  item: InventoryItem;
  /** Outros alunos que podem receber a oferta. */
  buyers: Student[];
  onSellToSystem: () => void;
  /** Devolve a mensagem de erro, ou null se a oferta foi enviada. */
  onOffer: (buyerId: string, price: number) => string | null;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<Mode>("sistema");
  const [buyerId, setBuyerId] = useState<string | null>(null);
  const [price, setPrice] = useState(item.value);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function sendOffer() {
    if (!buyerId) return;
    setError(onOffer(buyerId, price));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="cg-card cg-anim-pop flex max-h-[90vh] w-full max-w-md flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h2 className="text-lg font-bold text-white">💰 Vender item</h2>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-slate-800 bg-[#0d0d14] p-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1a1a24] text-2xl">{RARITY_ICON[item.rarity]}</div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-white">{item.name}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <RarityBadge rarity={item.rarity} />
                <ItemStats value={item.value} xp={item.xp} />
              </div>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl border border-slate-800 bg-[#0d0d14] p-1">
            {(["sistema", "colega"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError(null);
                }}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                  mode === m ? "bg-white text-[#0a0a0f]" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {m === "sistema" ? "🏛️ Para o sistema" : "🤝 Para um colega"}
              </button>
            ))}
          </div>

          {mode === "sistema" ? (
            <div className="text-center">
              <p className="text-sm text-slate-400">O sistema compra na hora pelo valor do item:</p>
              <p className="my-3 flex items-center justify-center gap-1.5 text-3xl font-black text-amber-300">
                <CoinIcon size={30} /> {item.value}
              </p>
              <button onClick={onSellToSystem} className="cg-btn-primary w-full">
                Vender por {item.value} moedas
              </button>
            </div>
          ) : buyers.length === 0 ? (
            <p className="text-center text-sm text-slate-500">Ainda não há outros alunos na Academia pra comprar.</p>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">Para quem?</p>
                <div className="flex max-h-48 flex-col gap-1.5 overflow-y-auto">
                  {buyers.map((b) => {
                    const house = b.houseId ? getHouse(b.houseId) : null;
                    return (
                      <button
                        key={b.id}
                        onClick={() => setBuyerId(b.id)}
                        className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors ${
                          buyerId === b.id ? "border-white bg-white/10" : "border-slate-800 bg-[#0d0d14] hover:border-slate-600"
                        }`}
                      >
                        <Avatar config={b.avatar} size={30} ringColor={buyerId === b.id ? house?.hex : undefined} />
                        <span className="min-w-0 flex-1 truncate text-sm text-white">{b.name}</span>
                        {house && <span className={`shrink-0 text-[11px] ${house.colorClass}`}>{house.name}</span>}
                        <span className="flex shrink-0 items-center gap-0.5 text-[11px] text-amber-300">
                          <CoinIcon size={11} /> {b.coins}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">Preço (moedas)</p>
                <input type="number" min={0} value={price} onChange={(e) => setPrice(Math.max(0, Math.round(Number(e.target.value) || 0)))} className="cg-input" />
                <p className="mt-1 text-[11px] text-slate-500">
                  Valor do item: {item.value}. O item fica reservado até o colega comprar ou recusar — se recusar, ele volta pra você.
                </p>
              </div>
              {error && <p className="text-xs text-rose-300">{error}</p>}
              <button onClick={sendOffer} disabled={!buyerId} className="cg-btn-primary w-full disabled:cursor-not-allowed disabled:opacity-30">
                🤝 Enviar oferta
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
