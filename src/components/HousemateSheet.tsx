"use client";

import { useEffect } from "react";
import { Student } from "@/engine/students";
import { getHouse } from "@/engine/houses";
import Avatar from "./Avatar";
import { CoinCount, HousePill, ItemStats, LevelPill, RarityBadge } from "./GameUI";

// ============================================================================
// HOUSEMATE SHEET — o perfil de um colega da mesma casa, aberto pelo ranking
// de Minha Casa. Mostra só o que é público entre colegas: avatar, nome, nível,
// moedas e itens (nada de e-mail, login ou senha).
// ============================================================================

export default function HousemateSheet({ student, isYou, onClose }: { student: Student; isYou: boolean; onClose: () => void }) {
  const house = student.houseId ? getHouse(student.houseId) : null;
  // Mais recentes primeiro
  const inventory = [...student.inventory].sort((a, b) => b.obtainedAt.localeCompare(a.obtainedAt));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="cg-card cg-anim-pop flex max-h-[90vh] w-full max-w-lg flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h2 className="text-lg font-bold text-white">{isYou ? "Seu perfil na casa" : "Colega de casa"}</h2>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="relative mb-5 flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-slate-800 bg-[#0d0d14] px-4 py-6">
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: `radial-gradient(60% 45% at 50% 35%, ${house?.hex ?? "#6366f1"}33, transparent)` }}
            />
            <div className="relative cg-anim-float">
              <Avatar config={student.avatar} ringColor={house?.hex} size={150} />
            </div>
            <div className="relative text-center">
              <p className="text-lg font-bold text-white">
                {student.name} {isYou && <span className="text-xs font-medium text-slate-400">(você)</span>}
              </p>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-1.5">
                <LevelPill level={student.level} />
                {house && <HousePill house={house} />}
                <CoinCount coins={student.coins} />
              </div>
            </div>
          </div>

          <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">
            Itens ({inventory.length})
          </p>
          {inventory.length === 0 ? (
            <p className="text-sm text-slate-500">{isYou ? "Você" : student.name} ainda não tem itens.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {inventory.map((item, i) => (
                <div
                  key={item.id}
                  className="cg-anim-rise flex flex-col items-center gap-1.5 rounded-xl border border-slate-800 bg-[#0d0d14] p-3 text-center"
                  style={{ animationDelay: `${0.1 + i * 0.05}s` }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a1a24] text-xl">{item.icon}</div>
                  <p className="text-xs font-semibold text-white">{item.name}</p>
                  <RarityBadge rarity={item.rarity} />
                  <ItemStats value={item.value} xp={item.xp} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
