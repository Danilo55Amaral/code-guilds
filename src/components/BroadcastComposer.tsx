"use client";

import { useState } from "react";
import { Student } from "@/engine/students";
import { HOUSES, HouseId } from "@/engine/houses";
import { useBroadcasts } from "@/engine/store";
import { MessageKind, MESSAGE_KIND_META, COMPOSABLE_MESSAGE_KINDS, MESSAGE_MAX_LENGTH, audienceLabel, formatMessageDate } from "@/engine/messages";
import { MessageAudienceBadge, MessageKindBadge } from "./GameUI";
import { PaginationFooter, usePagination } from "./Pagination";

// "turma" = todos os alunos; senão, o id da casa.
type Target = "turma" | HouseId;

const HISTORY_PER_PAGE = 5;

/** Card do painel do professor: envia um comunicado pra turma toda (os alunos dele) ou pra uma casa. */
export default function BroadcastComposer({ students, senderId }: { students: Student[]; senderId: string }) {
  const { broadcasts, broadcast } = useBroadcasts(senderId);
  const [target, setTarget] = useState<Target>("turma");
  const [kind, setKind] = useState<MessageKind>("aviso");
  const [body, setBody] = useState("");
  const [sentMsg, setSentMsg] = useState<string | null>(null);
  const pager = usePagination(broadcasts, HISTORY_PER_PAGE);

  const recipients = target === "turma" ? students : students.filter((s) => s.houseId === target);

  function handleSend() {
    const text = body.trim();
    if (!text || recipients.length === 0) return;
    const audience = target === "turma" ? ({ type: "turma" } as const) : ({ type: "casa", houseId: target } as const);
    broadcast({ studentIds: recipients.map((s) => s.id), audience, kind, body: text });
    const n = recipients.length;
    setSentMsg(`${MESSAGE_KIND_META[kind].icon} Enviado para ${audienceLabel(audience)} (${n} ${n === 1 ? "aluno" : "alunos"}).`);
    setTimeout(() => setSentMsg(null), 3000);
    setBody("");
  }

  const targets: { id: Target; label: string; count: number; colorClass: string }[] = [
    { id: "turma", label: "📢 Toda a turma", count: students.length, colorClass: "text-violet-300" },
    ...HOUSES.map((h) => ({ id: h.id, label: h.name, count: students.filter((s) => s.houseId === h.id).length, colorClass: h.colorClass })),
  ];

  return (
    <div className="cg-card mb-6 p-5">
      <p className="mb-3 text-sm font-semibold text-slate-300">Comunicados</p>

      <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">Para quem</p>
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {targets.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTarget(t.id)}
            className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
              target === t.id ? "border-white bg-white text-cg-ink" : `border-slate-700 hover:border-slate-500 ${t.colorClass}`
            }`}
          >
            {t.label} <span className="text-slate-500">({t.count})</span>
          </button>
        ))}
      </div>

      <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">Tipo</p>
      <div className="mb-3 grid grid-cols-2 gap-2">
        {COMPOSABLE_MESSAGE_KINDS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
              kind === k ? "border-white bg-white text-cg-ink" : "border-slate-700 text-slate-300 hover:border-slate-500"
            }`}
          >
            {MESSAGE_KIND_META[k].icon} {MESSAGE_KIND_META[k].label}
          </button>
        ))}
      </div>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={MESSAGE_MAX_LENGTH}
        rows={3}
        placeholder={kind === "aviso" ? "Ex: A prova de loops foi adiada para sexta-feira." : "Ex: Parabéns a todos pelo desempenho na última missão!"}
        className="cg-input resize-y"
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span className="text-[11px] text-slate-500">
          {body.length}/{MESSAGE_MAX_LENGTH}
          {recipients.length === 0 && <span className="ml-2 text-amber-300">Nenhum aluno nesse grupo ainda.</span>}
        </span>
        <button
          onClick={handleSend}
          disabled={!body.trim() || recipients.length === 0}
          className="cg-btn-primary !px-4 !py-2 text-sm disabled:cursor-not-allowed disabled:opacity-30"
        >
          Enviar para {recipients.length} {recipients.length === 1 ? "aluno" : "alunos"}
        </button>
      </div>

      {sentMsg && <p className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200">{sentMsg}</p>}

      {broadcasts.length > 0 && (
        <div className="mt-5 border-t border-slate-800 pt-4">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">Enviados ({broadcasts.length})</p>
          <div className="flex flex-col gap-2">
            {pager.pageItems.map((b) => (
              <div key={b.broadcastId} className="rounded-xl border border-slate-800 bg-cg-sunken px-4 py-3">
                <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                  <span className="flex flex-wrap items-center gap-1.5">
                    <MessageKindBadge kind={b.kind} />
                    <MessageAudienceBadge audience={b.audience} />
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {formatMessageDate(b.createdAt)} •{" "}
                    <span className={b.read === b.total ? "text-emerald-400" : ""}>
                      {b.read === b.total ? "✓ " : ""}Lida por {b.read}/{b.total}
                    </span>
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm text-slate-300">{b.body}</p>
              </div>
            ))}
          </div>
          <PaginationFooter pager={pager} noun="comunicados" />
        </div>
      )}
    </div>
  );
}
