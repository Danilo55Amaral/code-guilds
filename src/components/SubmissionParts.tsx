"use client";

import { useState } from "react";
import { SUBMISSION_FILE_TYPES } from "@/engine/missions";
import { SUBMISSION_STATUS_META, Submission, SubmissionFile, SubmissionStatus } from "@/engine/submissions";
import { downloadFile, formatFileSize } from "@/engine/fileStore";

// ============================================================================
// PEÇAS DAS ENTREGAS — usadas pelo aluno (janela da entrega) e pelo professor
// (correção): a situação da entrega, a lista de arquivos com o botão de baixar
// e o texto da resposta.
// ============================================================================

export function SubmissionStatusBadge({ status }: { status: SubmissionStatus }) {
  const meta = SUBMISSION_STATUS_META[status];
  return <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${meta.className}`}>{meta.label}</span>;
}

/** Arquivos da entrega, cada um com o botão de baixar (o arquivo vem do IndexedDB deste navegador). */
export function SubmissionFileList({ files }: { files: SubmissionFile[] }) {
  const [missing, setMissing] = useState<string | null>(null);
  if (files.length === 0) return null;

  async function download(f: SubmissionFile) {
    const ok = await downloadFile(f.id, f.name).catch(() => false);
    setMissing(ok ? null : f.name);
  }

  return (
    <div className="flex flex-col gap-1.5">
      {files.map((f) => (
        <div key={f.id} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-cg-card px-3 py-2">
          <span className="text-xl">{SUBMISSION_FILE_TYPES[f.kind]?.icon ?? "📎"}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-white">{f.name}</span>
            <span className="text-[11px] text-slate-500">
              {SUBMISSION_FILE_TYPES[f.kind]?.label ?? "Arquivo"} • {formatFileSize(f.size)}
            </span>
          </span>
          <button onClick={() => download(f)} className="shrink-0 rounded-lg border border-slate-600 px-2.5 py-1 text-xs font-semibold text-slate-200 transition-colors hover:border-slate-400">
            ⬇ Baixar
          </button>
        </div>
      ))}
      {missing && <p className="text-[11px] text-rose-300">Não achei o arquivo &quot;{missing}&quot; neste navegador (ele fica salvo só no computador onde foi enviado).</p>}
    </div>
  );
}

/** O que o aluno mandou: o texto e os arquivos. */
export function SubmissionContent({ submission }: { submission: Submission }) {
  return (
    <div className="flex flex-col gap-2">
      {submission.text && (
        <div className="rounded-xl border border-slate-800 bg-cg-card p-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">✍️ Resposta</p>
          <p className="whitespace-pre-wrap break-words text-sm text-slate-200">{submission.text}</p>
        </div>
      )}
      <SubmissionFileList files={submission.files} />
    </div>
  );
}

export function formatSubmissionDate(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString("pt-BR")} às ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
}
