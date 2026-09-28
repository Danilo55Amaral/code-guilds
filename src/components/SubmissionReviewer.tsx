"use client";

import { useState } from "react";
import { Mission } from "@/engine/missions";
import { Student, wornAvatar } from "@/engine/students";
import { getHouse } from "@/engine/houses";
import { FEEDBACK_MAX, Submission } from "@/engine/submissions";
import { useSubmissions } from "@/engine/store";
import Avatar from "./Avatar";
import { CoinIcon } from "./GameUI";
import { PaginationFooter, usePagination } from "./Pagination";
import { SubmissionContent, SubmissionStatusBadge, formatSubmissionDate } from "./SubmissionParts";

// ============================================================================
// CORREÇÃO DAS ENTREGAS — card do painel do professor (e aba Entregas do
// Painel ADM): as entregas das missões de entrega esperando correção e as já
// corrigidas. Aprovar dá a recompensa da missão ao aluno; "Pedir pra refazer"
// devolve com um comentário (obrigatório) pra ele enviar de novo.
// ============================================================================

const PER_PAGE = 5;

type Tab = "pendentes" | "corrigidas";

function ReviewCard({
  submission,
  student,
  mission,
  reviewerName,
}: {
  submission: Submission;
  student: Student | undefined;
  mission: Mission | undefined;
  reviewerName: string;
}) {
  const { review } = useSubmissions();
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState<string | null>(null);
  // Aprovar fala com a API (que dá a recompensa): um clique por vez
  const [busy, setBusy] = useState(false);
  const house = student?.houseId ? getHouse(student.houseId) : null;
  const pending = submission.status === "pendente";

  async function decide(decision: "aprovada" | "refazer") {
    if (!mission || busy) return;
    setBusy(true);
    const result = await review(submission.id, decision, feedback, mission, reviewerName);
    setBusy(false);
    setError(result.ok ? null : result.error);
  }

  return (
    <div className={`rounded-2xl border p-4 ${pending ? "border-indigo-500/40 bg-indigo-500/5" : "border-slate-800 bg-cg-sunken"}`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {student && <Avatar config={wornAvatar(student)} size={40} ringColor={house?.hex} />}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">
              {student?.name ?? "Aluno removido"}
              {house && <span className={`ml-2 text-[11px] font-normal ${house.colorClass}`}>{house.name}</span>}
            </p>
            <p className="text-xs text-slate-400">
              {mission ? `${mission.icon} ${mission.title}` : "Missão removida"} • {submission.attempt}ª tentativa • enviada em {formatSubmissionDate(submission.submittedAt)}
            </p>
          </div>
        </div>
        <SubmissionStatusBadge status={submission.status} />
      </div>

      {mission?.task && (
        <details className="mb-3 rounded-xl border border-slate-800 bg-cg-card px-3 py-2 text-xs text-slate-400">
          <summary className="cursor-pointer font-semibold text-slate-300">📋 Ver o enunciado da missão</summary>
          <p className="mt-2 whitespace-pre-wrap">{mission.task.prompt}</p>
        </details>
      )}

      <SubmissionContent submission={submission} />

      {pending ? (
        <div className="mt-3">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            maxLength={FEEDBACK_MAX}
            rows={2}
            placeholder="Comentário pro aluno (obrigatório pra pedir pra refazer; opcional pra aprovar)"
            className="cg-input resize-y"
          />
          {mission && (
            <p className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
              Ao aprovar, {student?.name.split(" ")[0] ?? "o aluno"} ganha: <span className="text-violet-300">✦ {mission.rewardXp} XP</span>
              <span className="flex items-center gap-0.5 text-amber-300">
                <CoinIcon size={11} /> {mission.rewardCoins}
              </span>
              <span>
                {mission.rewardItem.icon} {mission.rewardItem.name}
              </span>
            </p>
          )}
          {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
          <div className="mt-3 flex flex-wrap justify-end gap-2">
            <button
              onClick={() => decide("refazer")}
              disabled={!mission || busy}
              className="rounded-full border border-rose-400/60 bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-200 transition-colors hover:bg-rose-500/20 disabled:opacity-40"
            >
              ↩ Pedir pra refazer
            </button>
            <button
              onClick={() => decide("aprovada")}
              disabled={!mission || !student || busy}
              className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-black text-cg-onaccent transition-transform hover:scale-[1.03] disabled:opacity-40"
            >
              {busy ? "Salvando…" : "✅ Aprovar e dar a recompensa"}
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-xs text-slate-400">
          Corrigida {submission.reviewedAt && `em ${formatSubmissionDate(submission.reviewedAt)}`} {submission.reviewerName && `por ${submission.reviewerName}`}
          {submission.feedback && (
            <span className="mt-1 block whitespace-pre-wrap text-slate-300">💬 {submission.feedback}</span>
          )}
        </p>
      )}
    </div>
  );
}

export default function SubmissionReviewer({
  submissions,
  students,
  missions,
  reviewerName,
  headerRight,
}: {
  /** As entregas que essa pessoa corrige (professor: das missões dele; ADM: todas ou as da turma escolhida). */
  submissions: Submission[];
  students: Student[];
  missions: Mission[];
  reviewerName: string;
  headerRight?: React.ReactNode;
}) {
  const [tab, setTab] = useState<Tab>("pendentes");
  const pending = submissions.filter((s) => s.status === "pendente").sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
  const reviewed = submissions.filter((s) => s.status !== "pendente").sort((a, b) => (b.reviewedAt ?? "").localeCompare(a.reviewedAt ?? ""));
  const list = tab === "pendentes" ? pending : reviewed;
  const pager = usePagination(list, PER_PAGE, tab);

  return (
    <div className={`cg-card mb-6 p-5 ${pending.length > 0 ? "!border-indigo-500/50" : ""}`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-300">
            📥 Entregas para corrigir
            {pending.length > 0 && <span className="rounded-full bg-indigo-500 px-2 py-0.5 text-[11px] font-black text-cg-onaccent">{pending.length}</span>}
          </p>
          <p className="text-xs text-slate-500">Respostas e arquivos das missões de entrega. O aluno só ganha a recompensa quando a entrega é aprovada.</p>
        </div>
        {headerRight}
      </div>

      <div className="mb-3 inline-flex gap-1 rounded-xl border border-slate-800 bg-cg-sunken p-1">
        {(
          [
            ["pendentes", `⏳ Para corrigir (${pending.length})`],
            ["corrigidas", `✅ Corrigidas (${reviewed.length})`],
          ] as const
        ).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${tab === t ? "bg-white text-cg-ink" : "text-slate-400 hover:text-slate-200"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-700 p-4 text-center text-sm text-slate-500">
          {tab === "pendentes" ? "Nenhuma entrega esperando correção. 🎉" : "Nenhuma entrega corrigida ainda."}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {pager.pageItems.map((s) => (
            <ReviewCard
              key={s.id}
              submission={s}
              student={students.find((st) => st.id === s.studentId)}
              mission={missions.find((m) => m.id === s.missionId)}
              reviewerName={reviewerName}
            />
          ))}
        </div>
      )}
      <PaginationFooter pager={pager} noun="entregas" />
    </div>
  );
}
