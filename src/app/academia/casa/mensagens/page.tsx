"use client";

import { useState } from "react";
import { useStudents, useMessages } from "@/engine/store";
import { MessageKind, MESSAGE_KINDS, MESSAGE_KIND_META, formatMessageDate } from "@/engine/messages";
import { MessageAudienceBadge, MessageKindBadge } from "@/components/GameUI";
import { PaginationFooter, usePagination } from "@/components/Pagination";

const MESSAGES_PER_PAGE = 10;

type KindFilter = "todas" | MessageKind;

export default function MensagensPage() {
  const { activeStudent } = useStudents();
  const { messages, unreadCount, ready, markRead, markAllRead } = useMessages(activeStudent?.id ?? null);
  const [filter, setFilter] = useState<KindFilter>("todas");
  const filtered = filter === "todas" ? messages : messages.filter((m) => m.kind === filter);
  // Trocar de filtro volta pra página 1.
  const pager = usePagination(filtered, MESSAGES_PER_PAGE, filter);

  if (!activeStudent || !ready) return null;

  const countOf = (kind: MessageKind) => messages.filter((m) => m.kind === kind).length;
  const unreadOf = (kind: MessageKind) => messages.filter((m) => m.kind === kind && !m.readAt).length;
  const filters: { id: KindFilter; label: string; count: number; unread: number }[] = [
    { id: "todas", label: "Todas", count: messages.length, unread: unreadCount },
    ...MESSAGE_KINDS.map((k) => ({ id: k, label: `${MESSAGE_KIND_META[k].icon} ${MESSAGE_KIND_META[k].plural}`, count: countOf(k), unread: unreadOf(k) })),
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Mensagens</h1>
          <p className="text-xs text-slate-500">
            Avisos do professor, presentes, missões, compras e vendas •{" "}
            {unreadCount === 0 ? "tudo lido" : `${unreadCount} não ${unreadCount === 1 ? "lida" : "lidas"}`}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="cg-btn-secondary !px-4 !py-2 text-xs">
            ✓ Marcar todas como lidas
          </button>
        )}
      </div>

      {messages.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5" role="tablist" aria-label="Filtrar mensagens por tipo">
          {filters.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f.id
                  ? "border-white bg-white text-cg-ink"
                  : f.count === 0
                    ? "border-slate-800 bg-cg-card text-slate-600 hover:text-slate-400"
                    : "border-slate-800 bg-cg-card text-slate-300 hover:border-slate-600"
              }`}
            >
              {f.label}
              <span className={`rounded-full px-1.5 text-[10px] ${filter === f.id ? "bg-slate-200 text-slate-700" : "bg-slate-800 text-slate-400"}`}>{f.count}</span>
              {f.unread > 0 && <span className="h-1.5 w-1.5 rounded-full bg-violet-400" title={`${f.unread} não lidas`} />}
            </button>
          ))}
        </div>
      )}

      {messages.length === 0 ? (
        <div className="cg-card flex flex-col items-center gap-2 px-6 py-12 text-center">
          <p className="text-3xl">📭</p>
          <p className="text-sm text-slate-500">
            Nenhuma mensagem ainda — avisos do professor, presentes, missões concluídas e compras/vendas com colegas aparecem aqui.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="cg-card px-6 py-10 text-center">
          <p className="text-sm text-slate-500">
            Nenhuma mensagem do tipo {filter !== "todas" && `${MESSAGE_KIND_META[filter].icon} ${MESSAGE_KIND_META[filter].label}`} ainda.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {pager.pageItems.map((m) => {
            const unread = !m.readAt;
            return (
              // Clicar numa mensagem não lida marca como lida (e tira do contador do sino).
              <button
                key={m.id}
                onClick={() => unread && markRead(m.id)}
                className={`cg-card w-full p-5 text-left transition-colors ${unread ? "!border-violet-500/50 hover:!border-violet-400" : "cursor-default"}`}
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <MessageKindBadge kind={m.kind} />
                    {m.audience && <MessageAudienceBadge audience={m.audience} />}
                    {unread && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-violet-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-violet-400" /> Nova
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500">{formatMessageDate(m.createdAt)}</span>
                </div>
                <p className={`whitespace-pre-wrap text-sm ${unread ? "text-white" : "text-slate-400"}`}>{m.body}</p>
                {unread && <p className="mt-2 text-[11px] text-slate-500">Clique para marcar como lida</p>}
              </button>
            );
          })}
        </div>
      )}

      <PaginationFooter pager={pager} noun="mensagens" scrollToTop />
    </div>
  );
}
