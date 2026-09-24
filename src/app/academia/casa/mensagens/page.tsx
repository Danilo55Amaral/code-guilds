"use client";

import { useStudents, useMessages } from "@/engine/store";
import { formatMessageDate } from "@/engine/messages";
import { MessageKindBadge } from "@/components/GameUI";

export default function MensagensPage() {
  const { activeStudent } = useStudents();
  const { messages, unreadCount, ready, markRead, markAllRead } = useMessages(activeStudent?.id ?? null);

  if (!activeStudent || !ready) return null;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Mensagens</h1>
          <p className="text-xs text-slate-500">
            Avisos e recados do professor •{" "}
            {unreadCount === 0 ? "tudo lido" : `${unreadCount} não ${unreadCount === 1 ? "lida" : "lidas"}`}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="cg-btn-secondary !px-4 !py-2 text-xs">
            ✓ Marcar todas como lidas
          </button>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="cg-card flex flex-col items-center gap-2 px-6 py-12 text-center">
          <p className="text-3xl">📭</p>
          <p className="text-sm text-slate-500">Nenhuma mensagem ainda — quando o professor mandar um aviso, ele aparece aqui.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((m) => {
            const unread = !m.readAt;
            return (
              // Clicar numa mensagem não lida marca como lida (e tira do contador do sino).
              <button
                key={m.id}
                onClick={() => unread && markRead(m.id)}
                className={`cg-card w-full p-5 text-left transition-colors ${unread ? "!border-violet-500/50 hover:!border-violet-400" : "cursor-default"}`}
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <MessageKindBadge kind={m.kind} />
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
    </div>
  );
}
