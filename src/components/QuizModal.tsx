"use client";

import { useState } from "react";
import { Mission, hasPassed, requiredCorrect, PASS_THRESHOLD_PERCENT } from "@/engine/missions";
import { DefeatScreen, VictoryScreen } from "./MissionResult";

export default function QuizModal({
  mission,
  onClose,
  onComplete,
  viewOnly = false,
}: {
  mission: Mission;
  onClose: () => void;
  onComplete: (correctCount: number) => void;
  /** true quando o aluno já concluiu essa missão antes — deixa rever as perguntas, mas sem gerar recompensa de novo. */
  viewOnly?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const total = mission.questions.length;
  const needed = requiredCorrect(total);
  const question = mission.questions[index];
  const isLast = index === total - 1;
  const answered = selected !== null;

  function selectOption(id: string) {
    if (answered) return;
    setSelected(id);
    if (id === question.correctOptionId) setCorrectCount((c) => c + 1);
  }

  function next() {
    if (isLast) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  }

  function retry() {
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setFinished(false);
  }

  if (finished) {
    const passed = hasPassed(correctCount, total);
    const percent = Math.round((correctCount / total) * 100);

    // ---------- Revisão (missão já concluída antes) ----------
    if (viewOnly) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="cg-card w-full max-w-md p-8 text-center">
            <p className="mb-3 text-5xl">📖</p>
            <h2 className="text-2xl font-bold text-white">Revisão Concluída</h2>
            <p className="mt-1 text-sm text-slate-400">
              Você acertou {correctCount}/{total} perguntas ({percent}%)
            </p>
            <p className="mt-6 rounded-xl border border-slate-800 bg-cg-sunken p-4 text-xs text-slate-500">
              Você já concluiu esta missão antes, então não ganha XP, moedas nem item de novo — isso aqui foi só revisão.
            </p>
            <button onClick={() => onComplete(correctCount)} className="cg-btn-primary mt-6 w-full">
              Voltar às Missões
            </button>
          </div>
        </div>
      );
    }

    // ---------- Reprovado (abaixo de 60%): cena do Ceifador ----------
    if (!passed) {
      return (
        <DefeatScreen
          correctCount={correctCount}
          total={total}
          percent={percent}
          needed={needed}
          onRetry={retry}
          onBack={() => onComplete(correctCount)}
        />
      );
    }

    // ---------- Aprovado (60% ou mais): cena do baú ----------
    return (
      <VictoryScreen mission={mission} correctCount={correctCount} total={total} percent={percent} onBack={() => onComplete(correctCount)} />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="cg-card w-full max-w-md p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm font-semibold text-white">
            {mission.icon} {mission.title}{" "}
            <span className="text-slate-500">
              • {index + 1}/{total}
            </span>
          </p>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-white transition-all"
            style={{ width: `${((index + (answered ? 1 : 0)) / total) * 100}%` }}
          />
        </div>
        {!viewOnly && (
          <p className="mb-4 text-[11px] text-slate-500">
            🎯 Acerte pelo menos {needed} de {total} ({PASS_THRESHOLD_PERCENT}%) para concluir • acertos até agora: {correctCount}
          </p>
        )}

        <p className="mb-3 text-lg font-semibold text-white">{question.prompt}</p>
        {question.code && (
          <pre className="mb-4 overflow-x-auto rounded-xl border border-slate-800 bg-cg-sunken p-3 text-xs text-slate-300">
            <code>{question.code}</code>
          </pre>
        )}

        <div className="flex flex-col gap-2">
          {question.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            let stateClass = "border-slate-700 hover:border-slate-500";
            if (answered) {
              if (opt.id === question.correctOptionId) stateClass = "border-emerald-500 bg-emerald-500/10";
              else if (opt.id === selected) stateClass = "border-rose-500 bg-rose-500/10";
              else stateClass = "border-slate-800 opacity-50";
            }
            return (
              <button
                key={opt.id}
                onClick={() => selectOption(opt.id)}
                disabled={answered}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm text-slate-100 transition-colors ${stateClass}`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs">{letter}</span>
                {opt.text}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-4 rounded-xl border border-slate-800 bg-cg-sunken p-4">
            <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-slate-500">Explicação</p>
            <p className="text-sm text-slate-300">{question.explanation}</p>
            <button onClick={next} className="cg-btn-primary mt-3 w-full">
              {isLast ? "Ver resultado →" : "Próxima →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
