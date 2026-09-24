"use client";

import Link from "next/link";
import { Student, XP_PER_LEVEL } from "@/engine/students";
import { getHouse } from "@/engine/houses";
import Avatar from "./Avatar";
import NotificationBell from "./NotificationBell";
import MusicToggle from "./MusicToggle";
import { CoinCount, HouseAnimalIcon, LevelPill, XPBar } from "./GameUI";

export default function AcademyHeader({ student }: { student: Student }) {
  const house = student.houseId ? getHouse(student.houseId) : null;

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-[#0a0a0f] px-6 py-3">
      <div className="flex items-center gap-3">
        <Avatar config={student.avatar} ringColor={house?.hex} size={44} />
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-white">{student.name}</p>
            <LevelPill level={student.level} />
            {house && (
              <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${house.colorClass} ${house.borderClass}`}>
                {house.name}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <XPBar xp={student.xp} xpToNext={XP_PER_LEVEL} className="w-32" />
            <span className="text-[11px] text-slate-500">
              {student.xp}/{XP_PER_LEVEL} XP
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <CoinCount coins={student.coins} />
        <NotificationBell studentId={student.id} />
        <MusicToggle />
        {house && (
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-[#101018] text-sm" title={house.name}>
            <HouseAnimalIcon house={house} size={18} />
          </span>
        )}
        <Link href="/professor" className="cg-btn-secondary !px-3 !py-1.5 text-xs">
          🔒 Área do Professor
        </Link>
      </div>
    </header>
  );
}
