"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMessages } from "@/engine/store";
import { formatMessageDate } from "@/engine/messages";
import { MessageAudienceBadge, MessageKindBadge } from "./GameUI";

const PREVIEW_LIMIT = 5;
const MESSAGES_HREF = "/academia/casa/mensagens";

export default function NotificationBell({ studentId }: { studentId: string }) {
  const router = useRouter();
  const { messages, unreadCount, markRead, markAllRead } = useMessages(studentId);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora do sino/lista ou apertar Esc.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function openMessage(id: string) {
    markRead(id);
    setOpen(false);
    router.push(MESSAGES_HREF);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={unreadCount > 0 ? `Notificações: ${unreadCount} não ${unreadCount === 1 ? "lida" : "lidas"}` : "Notificações"}
        className="relative flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-cg-card text-sm transition-colors hover:border-slate-500"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-cg-onaccent">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        // No celular o cabeçalho quebra linha e o sino pode ficar em qualquer ponto da tela,
        // então a lista ocupa a largura da tela (logo abaixo do sino); do sm pra cima, fica alinhada ao sino.
        <div className="cg-card fixed inset-x-4 z-40 mt-2 overflow-hidden shadow-2xl shadow-black/60 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:w-80">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
            <p className="text-sm font-semibold text-white">Notificações</p>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-[11px] text-slate-400 hover:text-slate-200">
                Marcar todas como lidas
              </button>
            )}
          </div>

          {messages.length === 0 ? (
            <p className="px-4 py-6 text-center text-xs text-slate-500">Nenhuma mensagem do professor ainda.</p>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {messages.slice(0, PREVIEW_LIMIT).map((m) => (
                <button
                  key={m.id}
                  onClick={() => openMessage(m.id)}
                  className={`flex w-full gap-3 border-b border-slate-800/60 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-cg-hover ${
                    m.readAt ? "" : "bg-violet-500/5"
                  }`}
                >
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${m.readAt ? "bg-transparent" : "bg-violet-400"}`} />
                  <span className="min-w-0 flex-1">
                    <span className="mb-1 flex items-center justify-between gap-2">
                      <span className="flex flex-wrap items-center gap-1">
                        <MessageKindBadge kind={m.kind} />
                        {m.audience && <MessageAudienceBadge audience={m.audience} />}
                      </span>
                      <span className="shrink-0 text-[10px] text-slate-500">{formatMessageDate(m.createdAt)}</span>
                    </span>
                    <span className={`line-clamp-2 text-xs ${m.readAt ? "text-slate-400" : "text-white"}`}>{m.body}</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          <Link
            href={MESSAGES_HREF}
            onClick={() => setOpen(false)}
            className="block border-t border-slate-800 px-4 py-2.5 text-center text-xs font-medium text-slate-300 hover:bg-cg-hover"
          >
            Ver todas as mensagens →
          </Link>
        </div>
      )}
    </div>
  );
}
