"use client";

import { useState } from "react";
import Image from "next/image";
import { useStudents } from "@/engine/store";
import { HOUSES } from "@/engine/houses";
import { totalXp } from "@/engine/students";
import { HAIR_STYLE_LABELS, OUTFIT_LABELS } from "@/engine/avatar";
import Avatar from "@/components/Avatar";
import { CoinIcon } from "@/components/GameUI";
import HousemateSheet from "@/components/HousemateSheet";

export default function CasaPage() {
  const { activeStudent, students } = useStudents();
  // Guarda só o id: o colega é relido da lista, então o perfil aberto acompanha mudanças.
  const [viewingId, setViewingId] = useState<string | null>(null);
  if (!activeStudent || !activeStudent.houseId) return null;

  const house = HOUSES.find((h) => h.id === activeStudent.houseId)!;

  const housePoints = HOUSES.map((h) => ({
    house: h,
    points: students.filter((s) => s.houseId === h.id).reduce((sum, s) => sum + totalXp(s.level, s.xp), 0),
  }));
  const maxPoints = Math.max(1, ...housePoints.map((h) => h.points));

  const housemates = students
    .filter((s) => s.houseId === activeStudent.houseId)
    .sort((a, b) => totalXp(b.level, b.xp) - totalXp(a.level, a.xp));
  const viewingStudent = housemates.find((s) => s.id === viewingId) ?? null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="cg-card p-6 lg:col-span-2">
        <div className="flex items-center gap-4">
          <div className={`flex h-16 w-16 items-center justify-center rounded-xl ${house.bgClass} p-2`}>
            <Image src={house.crest} alt={house.name} width={56} height={56} className="h-full w-full object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{house.name}</h1>
            <p className="text-sm text-slate-400">{house.description}</p>
            <p className="mt-1 text-xs text-slate-500">
              Lema: <span className={house.colorClass}>{house.virtue}</span> • Animal: {house.animal}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-xl border border-slate-800 bg-cg-sunken p-3">
          <Avatar config={activeStudent.avatar} ringColor={house.hex} size={48} />
          <div>
            <p className="text-sm font-semibold text-white">
              {activeStudent.name} • <span className={house.colorClass}>{house.name}</span>
            </p>
            <p className="text-xs text-slate-500">Avatar forjado • {OUTFIT_LABELS[activeStudent.avatar.outfit]} • cabelo {HAIR_STYLE_LABELS[activeStudent.avatar.hairStyle].toLowerCase()}</p>
          </div>
        </div>

        <p className="mb-3 mt-6 text-sm font-semibold text-slate-300">Pontos das Casas</p>
        <div className="flex flex-col gap-3">
          {housePoints.map(({ house: h, points }) => (
            <div key={h.id}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className={h.colorClass}>{h.name}</span>
                <span className="text-slate-500">{points} pts</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full transition-all" style={{ width: `${(points / maxPoints) * 100}%`, backgroundColor: h.hex }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cg-card p-6">
        <p className="mb-1 text-sm font-semibold text-slate-300">Ranking da Casa</p>
        <p className="mb-4 text-[11px] text-slate-500">Clique num colega pra ver o avatar, o nível, as moedas e os itens dele.</p>
        <div className="flex flex-col gap-2">
          {housemates.map((s, i) => {
            const isYou = s.id === activeStudent.id;
            return (
              <button
                key={s.id}
                onClick={() => setViewingId(s.id)}
                className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-left transition-colors ${
                  isYou ? "bg-white text-cg-ink" : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <span className="flex min-w-0 items-center gap-2 text-sm">
                  <span className="w-4 shrink-0 text-xs opacity-60">{i + 1}.</span>
                  <Avatar config={s.avatar} size={30} />
                  <span className="truncate">{s.name}</span>
                  <span className="shrink-0 text-xs opacity-60">Nv {s.level}</span>
                </span>
                <span className="flex shrink-0 flex-col items-end text-xs font-semibold leading-tight">
                  {totalXp(s.level, s.xp)} XP
                  <span className={`flex items-center gap-0.5 text-[11px] ${isYou ? "text-amber-600" : "text-amber-300"}`}>
                    <CoinIcon size={11} /> {s.coins}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        {housemates.length <= 1 && (
          <p className="mt-4 text-xs text-slate-600">Quando outros alunos entrarem na {house.name}, eles aparecem aqui (mesmo navegador/dispositivo).</p>
        )}
      </div>

      {viewingStudent && <HousemateSheet student={viewingStudent} isYou={viewingStudent.id === activeStudent.id} onClose={() => setViewingId(null)} />}
    </div>
  );
}
