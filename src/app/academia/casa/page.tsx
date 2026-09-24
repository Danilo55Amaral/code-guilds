"use client";

import Image from "next/image";
import { useStudents } from "@/engine/store";
import { HOUSES } from "@/engine/houses";
import { XP_PER_LEVEL } from "@/engine/students";
import { HAIR_STYLE_LABELS, OUTFIT_LABELS } from "@/engine/avatar";
import Avatar from "@/components/Avatar";

function totalXp(level: number, xp: number) {
  return (level - 1) * XP_PER_LEVEL + xp;
}

export default function CasaPage() {
  const { activeStudent, students } = useStudents();
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

        <div className="mt-5 flex items-center gap-3 rounded-xl border border-slate-800 bg-[#0d0d14] p-3">
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
        <p className="mb-4 text-sm font-semibold text-slate-300">Ranking da Casa</p>
        <div className="flex flex-col gap-2">
          {housemates.map((s, i) => (
            <div
              key={s.id}
              className={`flex items-center justify-between rounded-xl px-3 py-2 ${
                s.id === activeStudent.id ? "bg-white text-[#0a0a0f]" : "text-slate-300"
              }`}
            >
              <span className="flex items-center gap-2 text-sm">
                <span className="w-4 text-xs opacity-60">{i + 1}.</span>
                {s.name} <span className="text-xs opacity-60">Nv {s.level}</span>
              </span>
              <span className="text-xs font-semibold">{totalXp(s.level, s.xp)} XP</span>
            </div>
          ))}
        </div>
        {housemates.length <= 1 && (
          <p className="mt-4 text-xs text-slate-600">Convide colegas de turma pra aparecerem no ranking aqui (mesmo navegador/dispositivo).</p>
        )}
      </div>
    </div>
  );
}
