"use client";

import { useStudents } from "@/engine/store";
import { RARITY_ICON } from "@/engine/missions";
import { RarityBadge } from "@/components/GameUI";

export default function InventarioPage() {
  const { activeStudent } = useStudents();
  if (!activeStudent) return null;

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-white">Inventário</h1>

      {activeStudent.inventory.length === 0 ? (
        <p className="text-sm text-slate-500">Nenhum item ainda — complete missões para ganhar itens.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {activeStudent.inventory.map((item) => (
            <div key={item.id} className="cg-card flex flex-col items-center gap-2 p-5 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#1a1a24] text-2xl">{RARITY_ICON[item.rarity]}</div>
              <p className="text-sm font-semibold text-white">{item.name}</p>
              <RarityBadge rarity={item.rarity} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
