"use client";

import { useEffect, useState } from "react";
import { TutorialStep } from "@/engine/tutorial";

/**
 * Tour em passos (aluno ou professor). Fechar de qualquer jeito — terminar,
 * "Pular tutorial", ✕ ou Esc — chama onClose, que marca o tutorial como visto.
 */
export default function TutorialModal({ steps, label, onClose }: { steps: TutorialStep[]; label: string; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const step = steps[index];
  const isLast = index === steps.length - 1;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, steps.length - 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, steps.length]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4" role="dialog" aria-modal="true" aria-label={`Tutorial: ${step.title}`}>
      <div className="cg-card flex w-full max-w-md flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            {label} • {index + 1} de {steps.length}
          </p>
          <button onClick={onClose} className="text-xs font-medium text-slate-400 hover:text-white">
            Pular tutorial ✕
          </button>
        </div>

        <div className="px-6 py-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1a1a24] text-3xl">{step.icon}</div>
          <h2 className="text-lg font-bold text-white">{step.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{step.body}</p>
        </div>

        <div className="flex justify-center gap-1.5 pb-4">
          {steps.map((s, i) => (
            <button
              key={s.title}
              onClick={() => setIndex(i)}
              aria-label={`Ir para o passo ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-white" : "w-1.5 bg-slate-600 hover:bg-slate-400"}`}
            />
          ))}
        </div>

        <div className="flex justify-between gap-2 border-t border-slate-800 px-6 py-4">
          <button
            onClick={() => setIndex((i) => i - 1)}
            disabled={index === 0}
            className="cg-btn-secondary !px-4 !py-2 text-sm disabled:cursor-not-allowed disabled:opacity-30"
          >
            ← Anterior
          </button>
          <button onClick={() => (isLast ? onClose() : setIndex((i) => i + 1))} className="cg-btn-primary !px-4 !py-2 text-sm">
            {isLast ? "Começar! 🚀" : "Próximo →"}
          </button>
        </div>
      </div>
    </div>
  );
}
