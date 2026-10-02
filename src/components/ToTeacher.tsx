"use client";

import { useEffect, useState } from "react";
import { Mission } from "@/engine/missions";
import { Student } from "@/engine/students";
import { TEACHER_MESSAGE_MAX, TEACHER_MESSAGE_TOPICS, TeacherMessage, TeacherMessageTopic } from "@/engine/teacherMessages";
import { formatMessageDate } from "@/engine/messages";
import { useTeacherMessages } from "@/engine/store";

// ============================================================================
// MENSAGEM PRO PROFESSOR (lado do aluno) — a janela de escrever (assunto,
// missão opcional e o texto) e a lista do que ele já mandou, com a situação
// (enviada, lida, respondida) e a resposta do professor.
// ============================================================================

const TOPICS = Object.keys(TEACHER_MESSAGE_TOPICS) as TeacherMessageTopic[];

export function WriteToTeacherModal({
  student,
  teacherName,
  missions,
  onClose,
  onSent,
}: {
  student: Student;
  teacherName: string;
  /** Missões do professor (pra o aluno dizer sobre qual missão é a dúvida). */
  missions: Mission[];
  onClose: () => void;
  onSent: () => void;
}) {
  const { send } = useTeacherMessages();
  const [topic, setTopic] = useState<TeacherMessageTopic>("duvida-missao");
  const [missionId, setMissionId] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const showMission = topic === "duvida-missao" || topic === "ajuda-entrega";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // A mensagem vai pela API, pro professor atual do aluno
  async function submit() {
    if (sending) return;
    setSending(true);
    const problem = await send({ topic, missionId: showMission && missionId ? missionId : undefined, body });
    setSending(false);
    if (problem) {
      setError(problem);
      return;
    }
    onSent();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="cg-card cg-anim-pop flex max-h-[92vh] w-full max-w-lg flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-white">✉️ Escrever pro professor</h2>
            <p className="text-xs text-slate-500">Para: Professor {teacherName}</p>
          </div>
          <button onClick={onClose} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">Assunto</p>
          <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTopic(t)}
                className={`rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-colors ${
                  topic === t ? "border-white bg-white text-cg-ink" : "border-slate-700 text-slate-300 hover:border-slate-500"
                }`}
              >
                {TEACHER_MESSAGE_TOPICS[t].icon} {TEACHER_MESSAGE_TOPICS[t].label}
              </button>
            ))}
          </div>

          {showMission && missions.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">Qual missão? (opcional)</p>
              <select value={missionId} onChange={(e) => setMissionId(e.target.value)} className="cg-input" aria-label="Missão">
                <option value="">Nenhuma em especial</option>
                {missions.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.icon} {m.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">Mensagem</p>
          <textarea
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              setError(null);
            }}
            maxLength={TEACHER_MESSAGE_MAX}
            rows={6}
            placeholder="Escreva com calma o que você precisa. Ex.: Não entendi a pergunta 2 da missão de loops, pode explicar de outro jeito?"
            className="cg-input resize-y"
          />
          <p className="mt-1 text-right text-[11px] text-slate-500">
            {body.length}/{TEACHER_MESSAGE_MAX}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Seja gentil: só o seu professor lê esta mensagem. A resposta chega aqui na sua caixa de Mensagens.</p>
          {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
        </div>

        <div className="border-t border-slate-800 px-6 py-4">
          <button
            onClick={submit}
            disabled={!body.trim() || sending}
            className="w-full rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-black text-cg-onaccent shadow-lg shadow-sky-500/25 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            {sending ? "Enviando…" : "✉️ Enviar pro professor"}
          </button>
        </div>
      </div>
    </div>
  );
}

function statusOf(m: TeacherMessage): { label: string; className: string } {
  if (m.reply) return { label: "💬 Respondida", className: "border-emerald-400/50 bg-emerald-500/10 text-emerald-200" };
  if (m.readAt) return { label: "👁 Lida", className: "border-sky-400/50 bg-sky-500/10 text-sky-200" };
  return { label: "⏳ Enviada", className: "border-amber-400/50 bg-amber-400/10 text-amber-200" };
}

/** O que o aluno já mandou pro professor, com a situação e a resposta. */
export function SentToTeacher({ messages, missions, teacherName }: { messages: TeacherMessage[]; missions: Mission[]; teacherName: string }) {
  const [open, setOpen] = useState(false);
  if (messages.length === 0) return null;
  const answered = messages.filter((m) => m.reply).length;
  const shown = open ? messages : messages.slice(0, 2);
  return (
    <div className="cg-card mb-6 !border-sky-500/30 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-sky-200">
          📤 Suas mensagens pro Professor {teacherName} ({messages.length})
        </p>
        <span className="text-[11px] text-slate-500">
          {answered} {answered === 1 ? "respondida" : "respondidas"}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {shown.map((m) => {
          const status = statusOf(m);
          const mission = m.missionId ? missions.find((x) => x.id === m.missionId) : undefined;
          return (
            <div key={m.id} className="rounded-xl border border-slate-800 bg-cg-sunken p-3">
              <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-300">
                  {TEACHER_MESSAGE_TOPICS[m.topic].icon} {TEACHER_MESSAGE_TOPICS[m.topic].label}
                  {mission && <span className="font-normal text-slate-500"> • {mission.icon} {mission.title}</span>}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">{formatMessageDate(m.sentAt)}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${status.className}`}>{status.label}</span>
                </span>
              </div>
              <p className="whitespace-pre-wrap break-words text-sm text-slate-200">{m.body}</p>
              {m.reply && (
                <div className="mt-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2">
                  <p className="text-[11px] font-semibold text-emerald-300">💬 Resposta de {m.replierName}</p>
                  <p className="whitespace-pre-wrap break-words text-sm text-slate-100">{m.reply}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {messages.length > 2 && (
        <button onClick={() => setOpen((v) => !v)} className="mt-2 text-xs text-slate-400 underline hover:text-white">
          {open ? "Mostrar menos" : `Ver todas (${messages.length})`}
        </button>
      )}
    </div>
  );
}
