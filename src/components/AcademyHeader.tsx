"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStudents } from "@/engine/store";
import { Student, xpToNextLevel } from "@/engine/students";
import { getHouse } from "@/engine/houses";
import { STUDENT_TUTORIAL } from "@/engine/tutorial";
import Avatar from "./Avatar";
import NotificationBell from "./NotificationBell";
import MusicToggle from "./MusicToggle";
import TutorialModal from "./TutorialModal";
import { CoinCount, HouseAnimalIcon, LevelPill, XPBar } from "./GameUI";

export default function AcademyHeader({ student }: { student: Student }) {
  const house = student.houseId ? getHouse(student.houseId) : null;
  const { logout, patchActive } = useStudents();
  const router = useRouter();
  // Primeiro acesso à Academia (depois de casa e avatar): o tutorial abre sozinho.
  const [tutorialOpen, setTutorialOpen] = useState(!student.tutorialDone);

  function closeTutorial() {
    setTutorialOpen(false);
    if (!student.tutorialDone) patchActive({ tutorialDone: true });
  }

  function sair() {
    logout();
    router.push("/entrar");
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-[#0a0a0f] px-4 py-3 sm:px-6">
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
            <XPBar xp={student.xp} xpToNext={xpToNextLevel(student.level)} className="w-32" />
            <span className="text-[11px] text-slate-500">
              {student.xp}/{xpToNextLevel(student.level)} XP
            </span>
          </div>
        </div>
      </div>

      {/* No celular os botões com texto viram só o ícone e o grupo quebra linha — nada passa da largura da tela. */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <CoinCount coins={student.coins} />
        <NotificationBell studentId={student.id} />
        <MusicToggle />
        {house && (
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-[#101018] text-sm" title={house.name}>
            <HouseAnimalIcon house={house} size={18} />
          </span>
        )}
        <button
          onClick={() => setTutorialOpen(true)}
          className="cg-btn-secondary whitespace-nowrap !px-3 !py-1.5 text-xs"
          title="Ver o tutorial da plataforma"
          aria-label="Tutorial"
        >
          ❓<span className="hidden sm:inline"> Tutorial</span>
        </button>
        <Link href="/professor" className="cg-btn-secondary whitespace-nowrap !px-3 !py-1.5 text-xs" title="Área do Professor" aria-label="Área do Professor">
          🔒<span className="hidden sm:inline"> Área do Professor</span>
        </Link>
        <button onClick={sair} className="cg-btn-secondary whitespace-nowrap !px-3 !py-1.5 text-xs" title="Sair da conta" aria-label="Sair">
          🚪<span className="hidden sm:inline"> Sair</span>
        </button>
      </div>

      {tutorialOpen && <TutorialModal steps={STUDENT_TUTORIAL} label="Tutorial do aluno" onClose={closeTutorial} />}
    </header>
  );
}
