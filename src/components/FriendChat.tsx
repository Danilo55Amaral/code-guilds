"use client";

import { useEffect, useRef, useState } from "react";
import { getHouse } from "@/engine/houses";
import { Student, wornAvatar } from "@/engine/students";
import { CHAT_PHRASE_GROUPS, ChatMessage, getPhrase } from "@/engine/friends";
import Avatar from "./Avatar";

// ============================================================================
// CONVERSA ENTRE AMIGOS — os dois alunos frente a frente, cada um com o
// último balão que mandou; embaixo, o histórico e a escolha do balão.
// Não existe campo de texto: o aluno só escolhe entre os balões prontos
// (engine/friends.ts), o que evita qualquer palavra imprópria na conversa.
// ============================================================================

/** Tempo mínimo entre dois balões (evita enxurrada de mensagens). */
const SEND_COOLDOWN_MS = 1500;

function formatTime(iso: string): string {
  const d = new Date(iso);
  const today = new Date().toDateString() === d.toDateString();
  const time = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return today ? time : `${d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })} ${time}`;
}

/** Um dos dois alunos no palco, com o último balão que ele mandou por cima. */
function Speaker({ student, last, isMe }: { student: Student; last: ChatMessage | undefined; isMe: boolean }) {
  const house = student.houseId ? getHouse(student.houseId) : null;
  const phrase = last ? getPhrase(last.phraseId) : undefined;
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center">
      <div className="flex h-20 items-end">
        {phrase && (
          <div key={last!.id} className="cg-anim-bubble relative max-w-[180px] rounded-2xl bg-white px-3 py-2 text-center text-sm font-bold text-cg-ink shadow-lg">
            <span className="mr-1">{phrase.emoji}</span>
            {phrase.text}
            <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-white" />
          </div>
        )}
      </div>
      <div className="cg-anim-float mt-3" style={{ animationDelay: isMe ? "0.8s" : "0s" }}>
        <Avatar config={wornAvatar(student)} ringColor={house?.hex} size={88} />
      </div>
      <p className="mt-1.5 max-w-full truncate text-sm font-bold text-white">
        {student.name.split(" ")[0]} {isMe && <span className="text-xs font-medium text-slate-400">(você)</span>}
      </p>
      {house && <p className={`text-[11px] ${house.colorClass}`}>{house.name}</p>}
    </div>
  );
}

export default function FriendChat({
  me,
  friend,
  conversation,
  onSend,
  onMarkRead,
  onOpenProfile,
}: {
  me: Student;
  friend: Student;
  conversation: ChatMessage[];
  onSend: (phraseId: string) => { ok: true } | { ok: false; error: string };
  onMarkRead: () => void;
  onOpenProfile: () => void;
}) {
  const [groupId, setGroupId] = useState(CHAT_PHRASE_GROUPS[0].id);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [coolingDown, setCoolingDown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  const group = CHAT_PHRASE_GROUPS.find((g) => g.id === groupId) ?? CHAT_PHRASE_GROUPS[0];
  const selected = selectedId ? getPhrase(selectedId) : undefined;
  const lastFromFriend = [...conversation].reverse().find((m) => m.fromId === friend.id);
  const lastFromMe = [...conversation].reverse().find((m) => m.fromId === me.id);
  const hasUnread = conversation.some((m) => m.fromId === friend.id && !m.readAt);

  // Conversa aberta: o que o amigo mandou fica lido, e o histórico desce até a última mensagem.
  useEffect(() => {
    if (hasUnread) onMarkRead();
  }, [hasUnread, onMarkRead]);

  useEffect(() => {
    const el = historyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [conversation.length, friend.id]);

  function send(phraseId: string) {
    if (coolingDown) return;
    const result = onSend(phraseId);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    setSelectedId(null);
    setCoolingDown(true);
    window.setTimeout(() => setCoolingDown(false), SEND_COOLDOWN_MS);
  }

  return (
    <div className="cg-card overflow-hidden">
      {/* ---- palco: os dois alunos frente a frente ---- */}
      <div
        className="cg-dark-scope relative px-4 pb-4 pt-3"
        style={{
          background: `radial-gradient(40% 80% at 18% 70%, ${friend.houseId ? getHouse(friend.houseId).hex : "#8b5cf6"}33, transparent 70%), radial-gradient(40% 80% at 82% 70%, ${me.houseId ? getHouse(me.houseId).hex : "#8b5cf6"}33, transparent 70%), linear-gradient(180deg, #0f0f1a 0%, #1a1530 100%)`,
        }}
      >
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-200/80">💬 Conversa com balões</p>
          <button onClick={onOpenProfile} className="rounded-full border border-slate-600 bg-black/30 px-3 py-1 text-[11px] font-semibold text-slate-200 hover:border-slate-400">
            👤 Perfil de {friend.name.split(" ")[0]}
          </button>
        </div>
        <div className="flex items-end justify-between gap-2">
          <Speaker student={friend} last={lastFromFriend} isMe={false} />
          <span className="mb-16 shrink-0 text-2xl" aria-hidden="true">
            🤝
          </span>
          <Speaker student={me} last={lastFromMe} isMe />
        </div>
      </div>

      {/* ---- histórico ---- */}
      <div ref={historyRef} className="flex max-h-72 min-h-[9rem] flex-col gap-2 overflow-y-auto border-y border-slate-800 bg-cg-sunken p-4">
        {conversation.length === 0 ? (
          <p className="m-auto text-center text-sm text-slate-500">Diga oi pro {friend.name.split(" ")[0]}! Escolha um balão aqui embaixo e envie. 👋</p>
        ) : (
          conversation.map((m) => {
            const phrase = getPhrase(m.phraseId)!;
            const mine = m.fromId === me.id;
            const author = mine ? me : friend;
            return (
              <div key={m.id} className={`flex items-end gap-2 ${mine ? "flex-row-reverse" : ""}`}>
                <Avatar config={wornAvatar(author)} size={28} />
                <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${mine ? "rounded-br-sm bg-violet-600 text-cg-onaccent" : "rounded-bl-sm border border-slate-700 bg-cg-card text-slate-100"}`}>
                  <span className="mr-1">{phrase.emoji}</span>
                  {phrase.text}
                  <span className={`ml-2 text-[10px] ${mine ? "text-violet-200" : "text-slate-500"}`}>{formatTime(m.sentAt)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ---- escolha do balão ---- */}
      <div className="p-4">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {CHAT_PHRASE_GROUPS.map((g) => (
            <button
              key={g.id}
              onClick={() => setGroupId(g.id)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                g.id === group.id ? "border-white bg-white text-cg-ink" : "border-slate-700 text-slate-300 hover:border-slate-500"
              }`}
            >
              {g.icon} {g.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {group.phrases.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id === selectedId ? null : p.id)}
              onDoubleClick={() => send(p.id)}
              className={`rounded-2xl border px-3 py-2 text-left text-sm transition-colors ${
                p.id === selectedId ? "border-violet-400 bg-violet-500/20 text-white" : "border-slate-700 bg-cg-raised text-slate-200 hover:border-slate-500"
              }`}
            >
              <span className="mr-1">{p.emoji}</span>
              {p.text}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-800 bg-cg-sunken p-3">
          <p className="min-w-0 text-sm text-slate-400">
            {selected ? (
              <>
                Você vai dizer:{" "}
                <span className="font-bold text-white">
                  {selected.emoji} {selected.text}
                </span>
              </>
            ) : (
              "Escolha um balão pra enviar (ou dê dois cliques nele)."
            )}
          </p>
          <button
            onClick={() => selected && send(selected.id)}
            disabled={!selected || coolingDown}
            className="shrink-0 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 px-5 py-2 text-sm font-black text-cg-onaccent shadow-lg shadow-violet-500/30 transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            {coolingDown ? "Enviado ✓" : "Enviar 💬"}
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
      </div>
    </div>
  );
}
