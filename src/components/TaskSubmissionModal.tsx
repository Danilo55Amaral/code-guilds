"use client";

import { useEffect, useRef, useState } from "react";
import { Mission, SUBMISSION_FILE_TYPES } from "@/engine/missions";
import { Student } from "@/engine/students";
import { SUBMISSION_MAX_FILES, SUBMISSION_MAX_FILE_MB, SUBMISSION_TEXT_MAX, checkFiles, formatFileSize, submissionHistoryIn } from "@/engine/submissions";
import { useSubmissions } from "@/engine/store";
import { CoinIcon, DifficultyBadge, RarityBadge } from "./GameUI";
import { SubmissionContent, SubmissionStatusBadge, formatSubmissionDate } from "./SubmissionParts";

// ============================================================================
// ENTREGA DA MISSÃO — a janela do aluno numa missão de entrega: o enunciado,
// a resposta escrita e/ou os arquivos (PDF, Word, Scratch, App Inventor,
// Roblox Studio) e o botão de enviar pro professor corrigir. Depois de enviar,
// mostra a situação (esperando correção, aprovada ou refazer, com o
// comentário do professor) e o que foi enviado em cada tentativa.
// ============================================================================

export default function TaskSubmissionModal({ mission, student, onClose }: { mission: Mission; student: Student; onClose: () => void }) {
  const { submissions, submit } = useSubmissions();
  const task = mission.task;
  const history = submissionHistoryIn(submissions, student.id, mission.id);
  const latest = history[0];
  const completed = student.completedMissionIds.includes(mission.id);
  const canSend = !completed && latest?.status !== "pendente";
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !sending && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, sending]);

  if (!task) return null;
  const accept = task.fileKinds.flatMap((k) => SUBMISSION_FILE_TYPES[k].extensions).join(",");

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next = [...files, ...Array.from(list)].slice(0, SUBMISSION_MAX_FILES);
    setError(checkFiles(mission, next));
    setFiles(next);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeFile(index: number) {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    setError(checkFiles(mission, next));
  }

  async function send() {
    setSending(true);
    const result = await submit({ mission, text, files });
    setSending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSent(true);
    setText("");
    setFiles([]);
    setError(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => !sending && onClose()}>
      <div className="cg-card cg-anim-pop flex max-h-[92vh] w-full max-w-2xl flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 px-6 py-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cg-tile text-xl">{mission.icon}</div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300">📝 Missão de entrega</p>
              <h2 className="text-lg font-bold text-white">{mission.title}</h2>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                <DifficultyBadge difficulty={mission.difficulty} />
                <span className="text-violet-300">✦ {mission.rewardXp} XP</span>
                <span className="flex items-center gap-1 text-amber-300">
                  <CoinIcon size={12} /> {mission.rewardCoins}
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  {mission.rewardItem.icon} {mission.rewardItem.name} <RarityBadge rarity={mission.rewardItem.rarity} />
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} disabled={sending} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="rounded-2xl border border-indigo-500/40 bg-indigo-500/5 p-4">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-200">📋 O que fazer</p>
            <p className="whitespace-pre-wrap text-sm text-slate-200">{task.prompt}</p>
            <p className="mt-2 text-[11px] text-slate-400">
              Você ganha a recompensa quando o professor corrigir e aprovar a sua entrega.
              {task.allowFiles && ` Arquivos aceitos: ${task.fileKinds.map((k) => `${SUBMISSION_FILE_TYPES[k].icon} ${SUBMISSION_FILE_TYPES[k].label}`).join(", ")}.`}
            </p>
          </div>

          {/* situação */}
          {(sent || completed || latest) && (
            <div
              className={`mt-4 rounded-2xl border p-4 ${
                completed ? "border-emerald-500/40 bg-emerald-500/10" : latest?.status === "refazer" ? "border-rose-500/40 bg-rose-500/10" : "border-amber-400/40 bg-amber-400/10"
              }`}
            >
              <p className="text-sm font-bold text-white">
                {completed
                  ? "✅ Entrega aprovada! Você ganhou a recompensa desta missão."
                  : latest?.status === "refazer"
                    ? "↩ O professor pediu pra você refazer. Leia o comentário e envie de novo!"
                    : "⏳ Entrega enviada! Agora é só esperar o professor corrigir."}
              </p>
              {latest?.feedback && <p className="mt-1 whitespace-pre-wrap text-sm text-slate-200">💬 {latest.feedback}</p>}
              {latest?.reviewerName && latest.reviewedAt && (
                <p className="mt-1 text-[11px] text-slate-400">
                  Corrigida por {latest.reviewerName} em {formatSubmissionDate(latest.reviewedAt)}
                </p>
              )}
            </div>
          )}

          {/* nova entrega */}
          {canSend && (
            <div className="mt-4 flex flex-col gap-3">
              <p className="text-sm font-semibold text-white">{latest ? `📤 Nova entrega (${latest.attempt + 1}ª tentativa)` : "📤 Sua entrega"}</p>
              {task.allowText && (
                <div>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={SUBMISSION_TEXT_MAX}
                    rows={6}
                    placeholder="Escreva a sua resposta aqui…"
                    className="cg-input resize-y"
                    aria-label="Sua resposta"
                  />
                  <p className="mt-1 text-right text-[11px] text-slate-500">
                    {text.length}/{SUBMISSION_TEXT_MAX}
                  </p>
                </div>
              )}
              {task.allowFiles && (
                <div>
                  <input ref={inputRef} type="file" multiple accept={accept} onChange={(e) => addFiles(e.target.files)} className="hidden" aria-label="Escolher arquivos" />
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={files.length >= SUBMISSION_MAX_FILES}
                    className="flex w-full flex-col items-center gap-1 rounded-2xl border-2 border-dashed border-slate-600 px-4 py-5 text-center transition-colors hover:border-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span className="text-2xl">📎</span>
                    <span className="text-sm font-semibold text-slate-200">Escolher arquivos</span>
                    <span className="text-[11px] text-slate-500">
                      {task.fileKinds.map((k) => SUBMISSION_FILE_TYPES[k].extensions.join(" ")).join(" ")} • até {SUBMISSION_MAX_FILES} arquivos de {SUBMISSION_MAX_FILE_MB} MB
                    </span>
                  </button>
                  {files.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1.5">
                      {files.map((f, i) => (
                        <div key={`${f.name}-${i}`} className="flex items-center gap-2 rounded-lg border border-slate-800 bg-cg-sunken px-3 py-2 text-sm">
                          <span className="min-w-0 flex-1 truncate text-slate-200">{f.name}</span>
                          <span className="shrink-0 text-[11px] text-slate-500">{formatFileSize(f.size)}</span>
                          <button onClick={() => removeFile(i)} className="shrink-0 text-xs text-rose-300 hover:text-rose-200" aria-label={`Tirar ${f.name}`}>
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {error && <p className="text-xs text-rose-300">{error}</p>}
            </div>
          )}

          {/* o que já foi enviado */}
          {history.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Suas entregas</p>
              <div className="flex flex-col gap-3">
                {history.map((s) => (
                  <div key={s.id} className="rounded-xl border border-slate-800 bg-cg-sunken p-3">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs text-slate-400">
                        {s.attempt}ª tentativa • {formatSubmissionDate(s.submittedAt)}
                      </span>
                      <SubmissionStatusBadge status={s.status} />
                    </div>
                    <SubmissionContent submission={s} />
                    {s.feedback && s.id !== latest?.id && <p className="mt-2 whitespace-pre-wrap text-xs text-slate-300">💬 {s.feedback}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {canSend && (
          <div className="border-t border-slate-800 px-6 py-4">
            <button
              onClick={send}
              disabled={sending || (!text.trim() && files.length === 0) || !!error}
              className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-black text-cg-onaccent shadow-lg shadow-indigo-500/30 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              {sending ? "Enviando…" : "📤 Enviar para correção"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
