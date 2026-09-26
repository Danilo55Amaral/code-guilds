"use client";

import { useEffect, useState } from "react";
import { InventoryItem, Student, wornAvatar } from "@/engine/students";
import { getHouse } from "@/engine/houses";
import Avatar from "./Avatar";
import ItemDetailsModal from "./ItemDetailsModal";
import FriendActions from "./FriendActions";
import { CoinCount, HousePill, ItemStats, LevelPill, RarityBadge } from "./GameUI";

// ============================================================================
// HOUSEMATE SHEET — o perfil público de um aluno, aberto pelo ranking da casa
// ou pelo ranking geral de Minha Casa. Mostra só o que é público entre
// colegas: avatar, nome, nível, casa, moedas e itens (nada de e-mail, login ou senha).
// Embaixo do nome ficam as ações de amizade (FriendActions).
// ============================================================================

export default function HousemateSheet({
  student,
  isYou,
  sameHouse = true,
  onChat,
  onClose,
}: {
  student: Student;
  isYou: boolean;
  /** false = aluno de outra casa (aberto pelo ranking geral). */
  sameHouse?: boolean;
  /** Abrir a conversa sem mudar de página (usado na própria tela de Amigos). */
  onChat?: () => void;
  onClose: () => void;
}) {
  const house = student.houseId ? getHouse(student.houseId) : null;
  // Mais recentes primeiro
  const inventory = [...student.inventory].sort((a, b) => b.obtainedAt.localeCompare(a.obtainedAt));

  const [viewingItem, setViewingItem] = useState<InventoryItem | null>(null);

  // Com o card de um item aberto, o Esc fecha só o item (o card cuida disso).
  useEffect(() => {
    if (viewingItem) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, viewingItem]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="cg-card cg-anim-pop flex max-h-[90vh] w-full max-w-lg flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h2 className="text-lg font-bold text-white">{isYou ? "Seu perfil na casa" : sameHouse ? "Colega de casa" : "Aluno da Academia"}</h2>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="relative mb-5 flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-slate-800 bg-cg-sunken px-4 py-6">
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: `radial-gradient(60% 45% at 50% 35%, ${house?.hex ?? "#6366f1"}33, transparent)` }}
            />
            <div className="relative cg-anim-float">
              <Avatar config={wornAvatar(student)} ringColor={house?.hex} size={150} />
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
            {!isYou && (
              <div className="relative w-full max-w-sm">
                <FriendActions other={student} onChat={onChat} />
              </div>
            )}
          </div>

          <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">
            Itens ({inventory.length})
          </p>
          {inventory.length === 0 ? (
            <p className="text-sm text-slate-500">{isYou ? "Você" : student.name} ainda não tem itens.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {inventory.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setViewingItem(item)}
                  title="Ver detalhes do item"
                  className="cg-anim-rise flex flex-col items-center gap-1.5 rounded-xl border border-slate-800 bg-cg-sunken p-3 text-center transition-colors hover:border-slate-600"
                  style={{ animationDelay: `${0.1 + i * 0.05}s` }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cg-tile text-xl">{item.icon}</div>
                  <p className="text-xs font-semibold text-white">{item.name}</p>
                  <RarityBadge rarity={item.rarity} />
                  <ItemStats value={item.value} xp={item.xp} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {viewingItem && (
        // Fica dentro do fundo do perfil: sem parar o clique aqui, fechar o item fecharia o perfil também.
        <div onClick={(e) => e.stopPropagation()}>
          <ItemDetailsModal item={viewingItem} onClose={() => setViewingItem(null)} />
        </div>
      )}
    </div>
  );
}
