"use client";

import { useEffect } from "react";
import { Rarity, RewardItem } from "@/engine/missions";
import { ItemStats, RarityBadge } from "./GameUI";

// Cor do brilho atrás do ícone, uma por raridade (mesmos tons dos badges).
const RARITY_GLOW: Record<Rarity, string> = { comum: "#94a3b8", raro: "#38bdf8", epico: "#c084fc", lendario: "#fbbf24" };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/**
 * Card grande de um item, aberto ao clicar nele (inventário, ofertas, perfil de
 * colega, ficha do aluno): ícone, raridade, valor/XP e a descrição.
 * Fecha no ✕, no Esc ou clicando fora.
 */
export default function ItemDetailsModal({ item, onClose }: { item: RewardItem & { obtainedAt?: string }; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const glow = RARITY_GLOW[item.rarity];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label={item.name}>
      <div className="cg-card cg-anim-pop relative w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(70% 40% at 50% 18%, ${glow}33, transparent)` }} />
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:text-white"
        >
          ✕
        </button>

        <div className="relative flex flex-col items-center px-6 pb-6 pt-8 text-center">
          <div
            className="cg-anim-float mb-4 flex h-24 w-24 items-center justify-center rounded-2xl border bg-cg-tile text-5xl"
            style={{ borderColor: `${glow}66`, boxShadow: `0 0 32px -8px ${glow}` }}
          >
            {item.icon}
          </div>
          <h2 className="text-xl font-bold text-white">{item.name}</h2>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <RarityBadge rarity={item.rarity} />
            <ItemStats value={item.value} xp={item.xp} />
          </div>

          <div className="mt-5 w-full rounded-xl border border-slate-800 bg-cg-sunken px-4 py-3 text-left">
            <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-slate-500">Descrição</p>
            {item.description ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">{item.description}</p>
            ) : (
              <p className="text-sm italic text-slate-500">Este item ainda não tem descrição.</p>
            )}
          </div>

          <div className="mt-3 flex w-full flex-col gap-1 text-left text-[11px] text-slate-500">
            <p>{item.xp > 0 ? `✨ Consumível — usar dá +${item.xp} XP.` : "Não é consumível."}</p>
            <p>💰 Vale {item.value} moedas na venda pro sistema.</p>
            {item.obtainedAt && <p>📅 Obtido em {formatDate(item.obtainedAt)}.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
