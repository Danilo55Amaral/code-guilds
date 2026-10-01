"use client";

import { useState } from "react";
import { Mission } from "@/engine/missions";
import { Student, wornAvatar } from "@/engine/students";
import { getHouse } from "@/engine/houses";
import { TEACHER_MESSAGE_MAX, TEACHER_MESSAGE_TOPICS, TeacherMessage } from "@/engine/teacherMessages";
import { formatMessageDate } from "@/engine/messages";
import { useInboxPolling, useTeacherMessages } from "@/engine/store";
import Avatar from "./Avatar";
import { PaginationFooter, usePagination } from "./Pagination";

// ============================================================================
// MENSAGENS DOS ALUNOS (lado do professor) — card do painel do professor com
// o que os alunos escreveram pra ele: marcar como lida e responder (a
// resposta chega na caixa de Mensagens do aluno).
// ============================================================================

const PER_PAGE = 5;

type Tab = "novas" | "todas";

function InboxCard({ message, student, mission }: { message: TeacherMessage; student: Student | undefined; mission: Mission | undefined }) {
  const { markRead, reply } = useTeacherMessages();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const house = student?.houseId ? getHouse(student.houseId) : null;

  // A resposta vai pela API, que também manda ela pra caixa de Mensagens do aluno
  async function send() {
    if (busy) return;
    setBusy(true);
    const problem = await reply(message.id, text);
    setBusy(false);
    setError(problem);
    if (!problem) setText("");
  }

  return (
    <div className={`rounded-2xl border p-4 ${message.readAt ? "border-slate-800 bg-cg-sunken" : "border-sky-500/40 bg-sky-500/5"}`}>
      <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {student && <Avatar config={wornAvatar(student)} size={36} ringColor={house?.hex} />}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">
              {student?.name ?? "Aluno removido"}
              {house && <span className={`ml-2 text-[11px] font-normal ${house.colorClass}`}>{house.name}</span>}
            </p>
            <p className="text-xs text-slate-400">
              {TEACHER_MESSAGE_TOPICS[message.topic].icon} {TEACHER_MESSAGE_TOPICS[message.topic].label}
              {mission && ` • ${mission.icon} ${mission.title}`} • {formatMessageDate(message.sentAt)}
            </p>
          </div>
        </div>
        {!message.readAt ? (
          <button onClick={() => markRead(message.id)} className="shrink-0 rounded-full border border-slate-600 px-3 py-1 text-[11px] font-semibold text-slate-300 hover:border-slate-400">
            ✓ Marcar como lida
          </button>
        ) : (
          <span className="shrink-0 text-[11px] text-slate-500">{message.reply ? "💬 Respondida" : "👁 Lida"}</span>
        )}
      </div>

      <p className="whitespace-pre-wrap break-words rounded-xl border border-slate-800 bg-cg-card p-3 text-sm text-slate-200">{message.body}</p>

      {message.reply ? (
        <div className="mt-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2">
          <p className="text-[11px] font-semibold text-emerald-300">
            💬 Sua resposta{message.repliedAt && ` • ${formatMessageDate(message.repliedAt)}`}
          </p>
          <p className="whitespace-pre-wrap break-words text-sm text-slate-100">{message.reply}</p>
        </div>
      ) : (
        <div className="mt-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={TEACHER_MESSAGE_MAX}
            rows={2}
            placeholder={`Responder ${student?.name.split(" ")[0] ?? "o aluno"}…`}
            className="cg-input resize-y"
          />
          {error && <p className="mt-1 text-xs text-rose-300">{error}</p>}
          <div className="mt-2 flex justify-end">
            <button onClick={send} disabled={!text.trim() || !student || busy} className="cg-btn-primary !px-4 !py-2 text-xs disabled:cursor-not-allowed disabled:opacity-30">
              {busy ? "Enviando…" : "💬 Responder"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudentMessagesInbox({
  messages,
  students,
  missions,
}: {
  /** As mensagens que os alunos mandaram pra esse professor. */
  messages: TeacherMessage[];
  students: Student[];
  missions: Mission[];
}) {
  // Mensagens novas dos alunos chegam sem precisar recarregar o painel
  useInboxPolling();
  const unread = messages.filter((m) => !m.readAt);
  const [tab, setTab] = useState<Tab>(unread.length > 0 ? "novas" : "todas");
  const list = tab === "novas" ? unread : messages;
  const pager = usePagination(list, PER_PAGE, tab);

  return (
    <div className={`cg-card mb-6 p-5 ${unread.length > 0 ? "!border-sky-500/50" : ""}`}>
      <div className="mb-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          ✉️ Mensagens dos alunos
          {unread.length > 0 && <span className="rounded-full bg-sky-500 px-2 py-0.5 text-[11px] font-black text-cg-onaccent">{unread.length}</span>}
        </p>
        <p className="text-xs text-slate-500">Dúvidas e pedidos que seus alunos escreveram pra você. A resposta chega na caixa de Mensagens de cada um.</p>
      </div>

      <div className="mb-3 inline-flex gap-1 rounded-xl border border-slate-800 bg-cg-sunken p-1">
        {(
          [
            ["novas", `🔵 Não lidas (${unread.length})`],
            ["todas", `Todas (${messages.length})`],
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
          {tab === "novas" ? "Nenhuma mensagem nova. 📭" : "Seus alunos ainda não mandaram mensagens."}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {pager.pageItems.map((m) => (
            <InboxCard
              key={m.id}
              message={m}
              student={students.find((s) => s.id === m.studentId)}
              mission={m.missionId ? missions.find((x) => x.id === m.missionId) : undefined}
            />
          ))}
        </div>
      )}
      <PaginationFooter pager={pager} noun="mensagens" />
    </div>
  );
}
