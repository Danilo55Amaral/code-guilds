"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useStudents } from "@/engine/store";
import { HOUSES, HouseId } from "@/engine/houses";

export default function CasaSelecaoPage() {
  const { activeStudent, patchActive, ready } = useStudents();
  const router = useRouter();
  const [selected, setSelected] = useState<HouseId | null>(null);

  useEffect(() => {
    if (ready && !activeStudent) router.replace("/entrar");
  }, [ready, activeStudent, router]);

  if (!ready || !activeStudent) return null;

  function confirmar() {
    if (!selected) return;
    patchActive({ houseId: selected, onboardingStep: "avatar" });
    router.push("/avatar");
  }

  return (
    <div className="mx-auto flex cg-screen max-w-3xl flex-col justify-center px-4 py-12">
      <p className="mb-2 text-right text-[11px] font-medium uppercase tracking-wider text-slate-500">Passo 1 de 3 — Escolha sua Casa</p>
      <h1 className="mb-8 text-4xl font-bold leading-tight text-white">
        O Chapéu Seletor de Código
        <br />
        <span className="text-slate-500">vai te observar.</span>
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {HOUSES.map((h) => {
          const active = selected === h.id;
          return (
            <button
              key={h.id}
              onClick={() => setSelected(h.id)}
              className={`cg-card relative flex items-start gap-4 p-5 text-left transition-colors ${
                active ? "border-white" : "hover:border-slate-600"
              }`}
            >
              <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl ${h.bgClass} p-2`}>
                <Image src={h.crest} alt={h.name} width={56} height={56} className="h-full w-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-white">{h.name}</p>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${h.colorClass} ${h.borderClass}`}>
                    {h.animal}
                  </span>
                </div>
                <p className={`mt-1 text-xs font-semibold uppercase tracking-wider ${h.colorClass}`}>{h.virtue}</p>
                <p className="mt-1.5 text-sm text-slate-400">{h.description}</p>
              </div>
              {active && (
                <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs text-cg-ink">
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <button onClick={confirmar} disabled={!selected} className="cg-btn-primary disabled:cursor-not-allowed disabled:opacity-30">
          Confirmar Casa →
        </button>
      </div>
    </div>
  );
}
