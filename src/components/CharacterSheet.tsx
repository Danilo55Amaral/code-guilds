"use client";

import { useEffect } from "react";
import { Student, xpToNextLevel, totalXp, wornAvatar } from "@/engine/students";
import { Rarity, RARITY_META, RARITY_ICON } from "@/engine/missions";
import { getHouse } from "@/engine/houses";
import {
  EYE_COLORS,
  HAIR_STYLE_LABELS,
  EXPRESSION_LABELS,
  FACE_DETAIL_LABELS,
  outfitLabel,
  eyewearLabel,
  hatLabel,
} from "@/engine/avatar";
import Avatar from "./Avatar";
import { CoinIcon, HousePill, LevelPill, XPBar } from "./GameUI";

// ============================================================================
// CHARACTER SHEET — a ficha do próprio aluno (aberta pelo Inventário):
// avatar animado, identificação, progresso, itens por raridade e a
// composição do avatar.
// ============================================================================

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">{children}</p>;
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-800/60 py-2 text-sm last:border-b-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-right text-slate-200">{children}</span>
    </div>
  );
}

function Stat({ label, value, className = "", delay }: { label: string; value: React.ReactNode; className?: string; delay: string }) {
  return (
    <div className={`cg-anim-rise rounded-xl border p-3 text-center ${className}`} style={{ animationDelay: delay }}>
      <p className="text-[10px] uppercase tracking-wider text-slate-400">{label}</p>
      <div className="mt-1 text-lg font-bold tabular-nums">{value}</div>
    </div>
  );
}

export default function CharacterSheet({
  student,
  missionsTotal,
  missionsCompleted,
  onClose,
}: {
  student: Student;
  /** Missões do professor do aluno: quantas existem e quantas ele já concluiu. */
  missionsTotal: number;
  missionsCompleted: number;
  onClose: () => void;
}) {
  const house = student.houseId ? getHouse(student.houseId) : null;
  const glow = house?.hex ?? "#6366f1";
  const av = wornAvatar(student); // com os visuais da Loja equipados
  const itemsByRarity = (Object.keys(RARITY_META) as Rarity[]).map((r) => ({
    rarity: r,
    count: student.inventory.filter((i) => i.rarity === r).length,
  }));

  // Esc fecha a ficha
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="cg-card cg-anim-pop flex max-h-[90vh] w-full max-w-3xl flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h2 className="text-lg font-bold text-white">📜 Ficha do Personagem</h2>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
            {/* avatar animado, igual à prévia do editor */}
            <div className="relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-slate-800 bg-cg-sunken px-4 py-6">
              <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(60% 45% at 50% 35%, ${glow}33, transparent)` }} />
              <div className="relative cg-anim-float">
                <Avatar config={av} ringColor={house?.hex} size={168} />
              </div>
              <div className="relative text-center">
                <p className="text-lg font-bold text-white">{student.name}</p>
                <div className="mt-1 flex flex-wrap items-center justify-center gap-1.5">
                  <LevelPill level={student.level} />
                  {house && <HousePill house={house} />}
                </div>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              {/* progresso */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Nível" value={<span className="text-white">{student.level}</span>} className="border-slate-700 bg-cg-sunken" delay="0.1s" />
                <Stat
                  label="XP adquirido"
                  value={<span className="text-violet-300">{totalXp(student.level, student.xp)}</span>}
                  className="border-violet-500/30 bg-violet-500/10"
                  delay="0.2s"
                />
                <Stat
                  label="Moedas"
                  value={
                    <span className="flex items-center justify-center gap-1 text-amber-300">
                      <CoinIcon size={18} /> {student.coins}
                    </span>
                  }
                  className="border-amber-500/30 bg-amber-500/10"
                  delay="0.3s"
                />
                <Stat
                  label="Missões"
                  value={
                    <span className="text-emerald-300">
                      {missionsCompleted}/{missionsTotal}
                    </span>
                  }
                  className="border-emerald-500/30 bg-emerald-500/10"
                  delay="0.4s"
                />
              </div>

              <div className="cg-anim-rise rounded-xl border border-slate-800 bg-cg-sunken p-4" style={{ animationDelay: "0.5s" }}>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Progresso para o nível {student.level + 1}</span>
                  <span className="tabular-nums text-slate-300">
                    {student.xp}/{xpToNextLevel(student.level)} XP
                  </span>
                </div>
                <XPBar xp={student.xp} xpToNext={xpToNextLevel(student.level)} className="!h-3" />
                <p className="mt-2 text-[11px] text-slate-500">Faltam {xpToNextLevel(student.level) - student.xp} XP para subir de nível.</p>
              </div>

              <div className="cg-anim-rise rounded-xl border border-slate-800 bg-cg-sunken px-4 py-2" style={{ animationDelay: "0.6s" }}>
                <SectionTitle>Identificação</SectionTitle>
                <InfoRow label="Nome">{student.name}</InfoRow>
                <InfoRow label="E-mail">{student.email}</InfoRow>
                <InfoRow label="Turma">{student.turma}</InfoRow>
                <InfoRow label="Casa">
                  {house ? (
                    <span className={house.colorClass}>
                      {house.name} • {house.virtue}
                    </span>
                  ) : (
                    "Ainda não escolheu"
                  )}
                </InfoRow>
                <InfoRow label="Na Academia desde">{formatDate(student.createdAt)}</InfoRow>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="cg-anim-rise rounded-xl border border-slate-800 bg-cg-sunken px-4 py-3" style={{ animationDelay: "0.7s" }}>
              <SectionTitle>Itens por raridade ({student.inventory.length} no total)</SectionTitle>
              <div className="grid grid-cols-2 gap-2">
                {itemsByRarity.map(({ rarity, count }) => (
                  <div key={rarity} className={`flex items-center justify-between rounded-lg border px-3 py-2 ${RARITY_META[rarity].borderClass}`}>
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${RARITY_META[rarity].colorClass}`}>
                      {RARITY_ICON[rarity]} {RARITY_META[rarity].label}
                    </span>
                    <span className="text-sm font-bold tabular-nums text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="cg-anim-rise rounded-xl border border-slate-800 bg-cg-sunken px-4 py-2" style={{ animationDelay: "0.8s" }}>
              <SectionTitle>Visual do avatar</SectionTitle>
              <InfoRow label="Cabelo">
                <span className="inline-flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full border border-slate-700" style={{ backgroundColor: av.hairColor }} />
                  {HAIR_STYLE_LABELS[av.hairStyle]}
                </span>
              </InfoRow>
              <InfoRow label="Olhos">{EYE_COLORS.find((c) => c.hex === av.eyeColor)?.label ?? "Personalizado"}</InfoRow>
              <InfoRow label="Expressão">
                {EXPRESSION_LABELS[av.expression]}
                {av.faceDetail !== "nenhum" && ` • ${FACE_DETAIL_LABELS[av.faceDetail]}`}
              </InfoRow>
              <InfoRow label="Roupa">
                <span className="inline-flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full border border-slate-700" style={{ backgroundColor: av.outfitColor }} />
                  {outfitLabel(av.outfit)}
                </span>
              </InfoRow>
              <InfoRow label="Acessórios">
                {[av.eyewear !== "nenhum" && eyewearLabel(av.eyewear), av.hat !== "nenhum" && hatLabel(av.hat)].filter(Boolean).join(" • ") || "Nenhum"}
              </InfoRow>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
