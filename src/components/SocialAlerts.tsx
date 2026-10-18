"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useFriends, useStudents } from "@/engine/store";
import { Student, wornAvatar } from "@/engine/students";
import { getHouse } from "@/engine/houses";
import { FriendLink, getPhrase, listChatMessages } from "@/engine/friends";
import { refreshSocial } from "@/engine/socialApi";
import { isSoundMuted, playMagicChime } from "@/engine/sfx";
import Avatar from "./Avatar";

// ============================================================================
// AVISOS DE AMIGOS — fica no layout da Academia. Quando chega um pedido de
// amizade ou um balão de um amigo, abre um modal animado pra o aluno não
// deixar passar: o pedido mostra quem pediu, com corações subindo, e dá pra
// aceitar ali mesmo; a mensagem mostra o balão que o amigo mandou e leva pra
// conversa. Os amigos e a conversa são conferidos a cada SOCIAL_POLL_MS (só
// com a aba visível), sem recarregar o resto do jogo.
//
// Cada pedido e cada mensagem avisa uma vez só: os já avisados ficam
// guardados no navegador, por aluno. O que chegou enquanto o aluno estava
// fora aparece quando ele entra. Na tela de Amigos não abre modal (ali ele já
// vê tudo). No primeiro acesso de todos, espera o tutorial fechar.
// ============================================================================

const SOCIAL_POLL_MS = 20_000;
const SEEN_LIMIT = 500;
const FRIENDS_PATH = "/academia/amigos";

type Alert =
  | { kind: "pedido"; key: string; link: FriendLink; from: Student }
  | { kind: "mensagem"; key: string; ids: string[]; from: Student; phraseId: string; count: number };

const HEARTS = Array.from({ length: 12 }, (_, i) => ({
  left: 6 + ((i * 41) % 88),
  delay: (i % 6) * 0.45,
  duration: 2.6 + (i % 4) * 0.5,
  size: 14 + (i % 3) * 6,
  icon: ["💖", "✨", "💜", "⭐"][i % 4],
}));

function seenKey(studentId: string) {
  return `cg-social-alerted:${studentId}`;
}

function readSeen(studentId: string): Set<string> {
  try {
    return new Set(JSON.parse(window.localStorage.getItem(seenKey(studentId)) ?? "[]") as string[]);
  } catch {
    return new Set();
  }
}

function writeSeen(studentId: string, seen: Set<string>) {
  try {
    window.localStorage.setItem(seenKey(studentId), JSON.stringify([...seen].slice(-SEEN_LIMIT)));
  } catch {
    // sem armazenamento: o aviso pode aparecer de novo, mas nada quebra
  }
}

export default function SocialAlerts({ student }: { student: Student }) {
  const router = useRouter();
  const pathname = usePathname();
  const { students } = useStudents();
  const friends = useFriends(student.id);
  const [seen, setSeen] = useState<Set<string>>(() => new Set());
  const [seenLoaded, setSeenLoaded] = useState(false);
  // o pedido aceito fica na tela (ele sai da lista de pedidos) até o aluno fechar
  const [acceptedAlert, setAcceptedAlert] = useState<Alert | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chimedRef = useRef<string | null>(null);

  // os já avisados deste aluno (guardados no navegador)
  useEffect(() => {
    setSeen(readSeen(student.id));
    setSeenLoaded(true);
  }, [student.id]);

  // confere os amigos e a conversa de tempos em tempos, com a aba visível
  useEffect(() => {
    void refreshSocial();
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void refreshSocial();
    }, SOCIAL_POLL_MS);
    return () => window.clearInterval(timer);
  }, [student.id]);

  // a fila de avisos: os pedidos recebidos e, por amigo, os balões ainda não lidos
  const alerts = useMemo<Alert[]>(() => {
    if (!seenLoaded || !friends.ready) return [];
    const byId = (id: string) => students.find((s) => s.id === id);
    const list: Alert[] = [];
    for (const link of friends.incoming) {
      const from = byId(link.fromId);
      if (from && !seen.has(`pedido:${link.id}`)) list.push({ kind: "pedido", key: `pedido:${link.id}`, link, from });
    }
    const unread = listChatMessages()
      .filter((m) => m.toId === student.id && !m.readAt && getPhrase(m.phraseId) && friends.friendIds.includes(m.fromId) && !seen.has(`chat:${m.id}`))
      .sort((a, b) => a.sentAt.localeCompare(b.sentAt));
    const byFriend = new Map<string, typeof unread>();
    for (const m of unread) byFriend.set(m.fromId, [...(byFriend.get(m.fromId) ?? []), m]);
    for (const [friendId, messages] of byFriend) {
      const from = byId(friendId);
      const last = messages[messages.length - 1];
      if (from) list.push({ kind: "mensagem", key: `chat:${last.id}`, ids: messages.map((m) => `chat:${m.id}`), from, phraseId: last.phraseId, count: messages.length });
    }
    return list;
    // friends.unreadByFriend muda quando chega balão novo; listChatMessages lê o cache atualizado
  }, [seenLoaded, friends.ready, friends.incoming, friends.friendIds, friends.unreadByFriend, students, seen, student.id]);

  const onFriendsPage = pathname === FRIENDS_PATH || pathname.startsWith(`${FRIENDS_PATH}/`);

  function markSeen(keys: string[]) {
    setSeen((old) => {
      const next = new Set(old);
      keys.forEach((k) => next.add(k));
      writeSeen(student.id, next);
      return next;
    });
  }

  // na tela de Amigos o aluno já vê tudo: conta como avisado
  useEffect(() => {
    if (onFriendsPage && alerts.length > 0) markSeen(alerts.flatMap((a) => (a.kind === "mensagem" ? a.ids : [a.key])));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onFriendsPage, alerts]);

  const current = acceptedAlert ?? (!onFriendsPage && student.tutorialDone ? alerts[0] ?? null : null);

  // um "plim" quando abre um aviso novo (se o som estiver ligado)
  useEffect(() => {
    if (!current || chimedRef.current === current.key) return;
    chimedRef.current = current.key;
    if (!isSoundMuted()) playMagicChime();
  }, [current]);

  if (!current) return null;

  const house = current.from.houseId ? getHouse(current.from.houseId) : null;
  const firstName = current.from.name.split(" ")[0];
  const remaining = alerts.filter((a) => a.key !== current.key).length;

  function close() {
    if (!current) return;
    markSeen(current.kind === "mensagem" ? current.ids : [current.key]);
    setAcceptedAlert(null);
    setError(null);
  }

  function go(href: string) {
    close();
    router.push(href);
  }

  async function accept(link: FriendLink) {
    if (busy) return;
    setBusy(true);
    const result = await friends.accept(link);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setAcceptedAlert(current);
  }

  const isRequest = current.kind === "pedido";
  const justAccepted = isRequest && acceptedAlert?.key === current.key;
  const phrase = current.kind === "mensagem" ? getPhrase(current.phraseId) : undefined;

  return (
    <div className="cg-dark-scope fixed inset-0 z-[58] flex overflow-y-auto bg-black/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={isRequest ? "Novo pedido de amizade" : "Nova mensagem de um amigo"}>
      {/* corações e brilhos subindo */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        {HEARTS.map((h, i) => (
          <span
            key={i}
            className="cg-anim-sparkle absolute -bottom-6"
            style={{ left: `${h.left}%`, fontSize: h.size, "--cg-delay": `${h.delay}s`, "--cg-duration": `${h.duration}s` } as React.CSSProperties}
          >
            {isRequest ? h.icon : ["💬", "✨", "💭", "⭐"][i % 4]}
          </span>
        ))}
      </div>

      <div
        className="cg-anim-pop relative m-auto w-full max-w-sm overflow-hidden rounded-3xl border-2 p-6 text-center shadow-2xl"
        style={{
          borderColor: isRequest ? "rgba(244,114,182,0.7)" : "rgba(34,211,238,0.7)",
          background: isRequest
            ? "radial-gradient(80% 60% at 50% 0%, rgba(236,72,153,0.45), transparent 70%), linear-gradient(160deg, #3b0764 0%, #1e1b4b 100%)"
            : "radial-gradient(80% 60% at 50% 0%, rgba(34,211,238,0.35), transparent 70%), linear-gradient(160deg, #0c4a6e 0%, #1e1b4b 100%)",
          boxShadow: isRequest ? "0 0 60px -10px rgba(236,72,153,0.8)" : "0 0 60px -10px rgba(34,211,238,0.7)",
        }}
      >
        <p className={`text-[11px] font-black uppercase tracking-[0.25em] ${isRequest ? "text-pink-200" : "text-cyan-200"}`}>
          {isRequest ? (justAccepted ? "🎉 Amizade feita!" : "💌 Pedido de amizade") : current.count > 1 ? `💬 ${current.count} mensagens novas` : "💬 Mensagem nova"}
        </p>

        {/* o avatar de quem mandou, com as ondas pulsando em volta */}
        <div className="relative mx-auto mt-4 flex h-32 w-32 items-center justify-center">
          <span className={`absolute inset-2 animate-ping rounded-full ${isRequest ? "bg-pink-400/40" : "bg-cyan-400/40"}`} />
          <span className={`absolute inset-0 rounded-full border-2 border-dashed ${isRequest ? "border-pink-300/70" : "border-cyan-300/70"} cg-anim-spin-slow`} />
          <div className="cg-anim-float relative">
            <Avatar config={wornAvatar(current.from)} ringColor={house?.hex} size={104} />
          </div>
          <span className="cg-anim-pop absolute -bottom-1 -right-1 text-3xl" style={{ animationDelay: "0.4s" }} aria-hidden="true">
            {isRequest ? (justAccepted ? "🤝" : "💌") : "💬"}
          </span>
        </div>

        {isRequest ? (
          <>
            <h2 className="mt-4 text-2xl font-black text-white">{justAccepted ? `Você e ${firstName} agora são amigos!` : `${firstName} quer ser seu amigo!`}</h2>
            <p className="mt-1 text-sm text-pink-100/80">
              {current.from.name}
              {house && <span className={`ml-1 ${house.colorClass}`}>• {house.name}</span>} • Nv {current.from.level}
            </p>
            {justAccepted ? (
              <div className="mt-5 flex flex-col gap-2">
                <button onClick={() => go(`${FRIENDS_PATH}?com=${current.from.id}`)} className="rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-pink-500/30 transition-transform hover:scale-[1.03]">
                  💬 Mandar um oi
                </button>
                <button onClick={close} className="text-xs text-slate-300 hover:text-white">
                  Fechar
                </button>
              </div>
            ) : (
              <div className="mt-5 flex flex-col gap-2">
                <button
                  onClick={() => accept(current.link)}
                  disabled={busy}
                  className="rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-pink-500/30 transition-transform hover:scale-[1.03] disabled:opacity-60"
                >
                  {busy ? "Aceitando…" : "✅ Aceitar amizade"}
                </button>
                <button onClick={() => go(`${FRIENDS_PATH}?aba=pedidos`)} className="rounded-full border border-pink-300/50 bg-black/30 px-5 py-2.5 text-sm font-semibold text-pink-100 hover:border-pink-200">
                  Ver pedidos
                </button>
                <button onClick={close} className="text-xs text-slate-300 hover:text-white">
                  Depois
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="mt-4 text-2xl font-black text-white">{firstName} mandou uma mensagem!</h2>
            {phrase && (
              <div className="cg-anim-bubble relative mx-auto mt-4 max-w-[16rem] rounded-2xl border-2 border-cyan-200 bg-white px-4 py-3 text-left text-cg-ink shadow-lg" style={{ animationDelay: "0.3s" }}>
                <span aria-hidden="true" className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l-2 border-t-2 border-cyan-200 bg-white" />
                <span className="text-lg">{phrase.emoji}</span> <span className="text-sm font-semibold">{phrase.text}</span>
              </div>
            )}
            <div className="mt-5 flex flex-col gap-2">
              <button onClick={() => go(`${FRIENDS_PATH}?com=${current.from.id}`)} className="rounded-full bg-gradient-to-r from-cyan-300 to-sky-500 px-5 py-3 text-sm font-black text-cg-ink shadow-lg shadow-cyan-500/30 transition-transform hover:scale-[1.03]">
                💬 Responder
              </button>
              <button onClick={close} className="text-xs text-slate-300 hover:text-white">
                Depois
              </button>
            </div>
          </>
        )}

        {error && <p className="mt-3 text-xs text-rose-300">{error}</p>}
        {remaining > 0 && <p className="mt-4 text-[11px] text-slate-400">+{remaining} {remaining === 1 ? "aviso esperando" : "avisos esperando"}</p>}
      </div>
    </div>
  );
}
