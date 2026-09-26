"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useStudents, useFriends } from "@/engine/store";
import { getHouse } from "@/engine/houses";
import { Student, wornAvatar } from "@/engine/students";
import Avatar from "@/components/Avatar";
import FriendChat from "@/components/FriendChat";
import HousemateSheet from "@/components/HousemateSheet";

// ============================================================================
// AMIGOS — a lista de amigos (com as mensagens não lidas de cada um), os
// pedidos de amizade recebidos e enviados e a conversa com balões. Pedidos
// novos são enviados pelo perfil de um aluno (ranking de Minha Casa, Ranking
// Geral, rankings de evento). ?com=<id> abre direto a conversa com esse amigo.
// ============================================================================

type Tab = "amigos" | "pedidos";

function StudentRow({ student, right, onClick, active = false }: { student: Student; right?: React.ReactNode; onClick?: () => void; active?: boolean }) {
  const house = student.houseId ? getHouse(student.houseId) : null;
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left transition-colors ${
        active ? "bg-white text-cg-ink" : `border border-slate-800 bg-cg-sunken text-slate-200 ${onClick ? "hover:border-slate-600" : ""}`
      }`}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <Avatar config={wornAvatar(student)} ringColor={house?.hex} size={36} />
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{student.name}</span>
          {house && <span className={`block text-[11px] ${active ? "opacity-70" : house.colorClass}`}>{house.name} • Nv {student.level}</span>}
        </span>
      </span>
      {right}
    </Tag>
  );
}

export default function AmigosPage() {
  const { activeStudent, students } = useStudents();
  const friends = useFriends(activeStudent?.id ?? null);
  const [tab, setTab] = useState<Tab>("amigos");
  const [chatWith, setChatWith] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);

  // Veio do perfil de um amigo ("💬 Conversar"): abre a conversa dele.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("com");
    if (id) setChatWith(id);
  }, []);

  const { markRead } = friends;
  const markChatRead = useCallback(() => {
    if (chatWith) markRead(chatWith);
  }, [chatWith, markRead]);

  if (!activeStudent || !friends.ready) return null;
  const me = activeStudent;
  const byId = (id: string) => students.find((s) => s.id === id);

  // Amigos com mensagem nova primeiro, depois por nome.
  const friendList = friends.friendIds
    .map(byId)
    .filter((s): s is Student => !!s)
    .sort((a, b) => (friends.unreadByFriend[b.id] ?? 0) - (friends.unreadByFriend[a.id] ?? 0) || a.name.localeCompare(b.name, "pt-BR"));
  const chatFriend = friendList.find((s) => s.id === chatWith) ?? null;
  const profile = profileId ? byId(profileId) : undefined;

  return (
    <div>
      {/* ===== BANNER ===== */}
      <div
        className="cg-dark-scope relative mb-6 overflow-hidden rounded-3xl border border-pink-500/30 p-6 sm:p-7"
        style={{ background: "radial-gradient(50% 80% at 90% 20%, rgba(236,72,153,0.3), transparent 70%), radial-gradient(50% 80% at 5% 90%, rgba(139,92,246,0.4), transparent 70%), linear-gradient(135deg, #1e1b4b 0%, #3b0764 60%, #500724 100%)" }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-pink-200">🤝 Amigos</p>
        <h1 className="mt-1 text-3xl font-black uppercase tracking-wide text-white sm:text-4xl">Seus amigos da Academia</h1>
        <p className="mt-2 max-w-2xl text-sm text-pink-50/80">
          Converse com seus amigos usando balões de fala. Pra fazer um amigo novo, clique num colega no ranking (Minha Casa) ou num ranking de evento e envie um pedido de amizade.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ===== LISTA ===== */}
        <div className="cg-card h-fit p-4">
          <div className="mb-3 inline-flex w-full gap-1 rounded-xl border border-slate-800 bg-cg-sunken p-1">
            {(["amigos", "pedidos"] as Tab[]).map((t) => {
              const count = t === "amigos" ? friendList.length : friends.incoming.length + friends.outgoing.length;
              const badge = t === "amigos" ? friends.unreadTotal : friends.incoming.length;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    tab === t ? "bg-white text-cg-ink" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {t === "amigos" ? "🤝 Amigos" : "📨 Pedidos"} ({count})
                  {badge > 0 && <span className="rounded-full bg-pink-500 px-1.5 text-[10px] font-bold text-cg-onaccent">{badge}</span>}
                </button>
              );
            })}
          </div>

          {tab === "amigos" &&
            (friendList.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700 p-4 text-center text-sm text-slate-400">
                <p className="text-3xl">🤝</p>
                <p className="mt-1">Você ainda não tem amigos por aqui.</p>
                <Link href="/academia/casa" className="mt-3 inline-block rounded-full bg-white px-4 py-2 text-xs font-semibold text-cg-ink">
                  Encontrar colegas no ranking →
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {friendList.map((s) => {
                  const unread = friends.unreadByFriend[s.id] ?? 0;
                  return (
                    <StudentRow
                      key={s.id}
                      student={s}
                      active={s.id === chatWith}
                      onClick={() => setChatWith(s.id)}
                      right={
                        unread > 0 ? (
                          <span className="shrink-0 rounded-full bg-pink-500 px-2 py-0.5 text-[10px] font-bold text-cg-onaccent">{unread > 9 ? "9+" : unread} novas</span>
                        ) : (
                          <span className="shrink-0 text-xs opacity-60">💬</span>
                        )
                      }
                    />
                  );
                })}
              </div>
            ))}

          {tab === "pedidos" && (
            <div className="flex flex-col gap-4">
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Recebidos ({friends.incoming.length})</p>
                {friends.incoming.length === 0 ? (
                  <p className="text-xs text-slate-500">Nenhum pedido esperando resposta.</p>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {friends.incoming.map((link) => {
                      const s = byId(link.fromId);
                      if (!s) return null;
                      return (
                        <div key={link.id} className="rounded-xl border border-pink-500/30 bg-pink-500/5 p-2">
                          <StudentRow student={s} onClick={() => setProfileId(s.id)} />
                          <div className="mt-2 flex gap-2">
                            <button onClick={() => friends.accept(link)} className="flex-1 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-black text-cg-onaccent">
                              ✅ Aceitar
                            </button>
                            <button onClick={() => friends.dismiss(link)} className="flex-1 rounded-full border border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-slate-400">
                              Recusar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Enviados ({friends.outgoing.length})</p>
                {friends.outgoing.length === 0 ? (
                  <p className="text-xs text-slate-500">Você não tem pedidos esperando resposta.</p>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {friends.outgoing.map((link) => {
                      const s = byId(link.toId);
                      if (!s) return null;
                      return (
                        <StudentRow
                          key={link.id}
                          student={s}
                          right={
                            <button onClick={() => friends.dismiss(link)} className="shrink-0 text-[11px] text-slate-400 underline hover:text-white">
                              ⏳ Cancelar
                            </button>
                          }
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ===== CONVERSA ===== */}
        <div className="lg:col-span-2">
          {chatFriend ? (
            <FriendChat
              key={chatFriend.id}
              me={me}
              friend={chatFriend}
              conversation={friends.conversationWith(chatFriend.id)}
              onSend={(phraseId) => friends.sendPhrase(chatFriend.id, phraseId)}
              onMarkRead={markChatRead}
              onOpenProfile={() => setProfileId(chatFriend.id)}
            />
          ) : (
            <div className="cg-card flex flex-col items-center gap-2 px-6 py-16 text-center">
              <p className="text-5xl">💬</p>
              <p className="text-lg font-semibold text-white">{friendList.length > 0 ? "Escolha um amigo pra conversar" : "Faça amigos pra começar a conversar"}</p>
              <p className="max-w-md text-sm text-slate-400">
                A conversa é feita só com balões prontos, como &quot;Oi!&quot;, &quot;Vamos fazer uma missão?&quot; e &quot;Parabéns!&quot;. Assim todo mundo conversa com segurança.
              </p>
            </div>
          )}
        </div>
      </div>

      {profile && (
        <HousemateSheet
          student={profile}
          isYou={false}
          sameHouse={profile.houseId === me.houseId}
          onChat={() => {
            setChatWith(profile.id);
            setTab("amigos");
            setProfileId(null);
          }}
          onClose={() => setProfileId(null)}
        />
      )}
    </div>
  );
}
