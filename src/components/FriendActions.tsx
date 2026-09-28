"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStudents, useFriends } from "@/engine/store";
import { Student } from "@/engine/students";

// ============================================================================
// AÇÕES DE AMIZADE no perfil de um aluno (HousemateSheet): mandar pedido,
// cancelar, aceitar/recusar um pedido recebido, abrir a conversa, propor troca de itens ou desfazer
// a amizade. Só aparece pro aluno logado olhando o perfil de outro aluno.
// ============================================================================

export default function FriendActions({ other, onChat }: { other: Student; onChat?: () => void }) {
  const router = useRouter();
  const { activeStudent } = useStudents();
  const friends = useFriends(activeStudent?.id ?? null);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Um pedido por vez (evita dois cliques rápidos mandarem o mesmo pedido)
  const [busy, setBusy] = useState(false);

  if (!activeStudent || activeStudent.id === other.id || !friends.ready) return null;
  const status = friends.statusWith(other.id);
  const link = friends.linkWith(other.id);
  const firstName = other.name.split(" ")[0];

  /** Roda a ação na API e mostra o erro, se houver. */
  async function run(action: () => Promise<{ ok: true } | { ok: false; error: string }>) {
    if (busy) return;
    setBusy(true);
    const result = await action();
    setBusy(false);
    setError(result.ok ? null : result.error);
    setConfirmRemove(false);
  }

  function openChat() {
    if (onChat) onChat();
    else router.push(`/academia/amigos?com=${other.id}`);
  }

  return (
    <div className="mt-4 w-full rounded-2xl border border-pink-500/30 bg-pink-500/5 p-3 text-center">
      {status === "nenhum" && (
        <>
          <button
            onClick={() => run(() => friends.request(other.id))}
            disabled={busy}
            className="w-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-4 py-2.5 text-sm font-black text-cg-onaccent shadow-lg shadow-pink-500/30 transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            🤝 Enviar pedido de amizade
          </button>
          <p className="mt-1.5 text-[11px] text-slate-400">Amigos podem conversar usando balões de fala.</p>
        </>
      )}

      {status === "enviado" && link && (
        <>
          <p className="text-sm font-semibold text-pink-200">⏳ Pedido enviado! Esperando {firstName} responder.</p>
          <button onClick={() => run(() => friends.dismiss(link))} disabled={busy} className="mt-2 text-xs text-slate-400 underline hover:text-white">
            Cancelar pedido
          </button>
        </>
      )}

      {status === "recebido" && link && (
        <>
          <p className="text-sm font-semibold text-pink-200">🤝 {firstName} te mandou um pedido de amizade!</p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => run(() => friends.accept(link))}
              disabled={busy}
              className="flex-1 rounded-full bg-emerald-500 px-4 py-2 text-sm font-black text-cg-onaccent transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              ✅ Aceitar
            </button>
            <button
              onClick={() => run(() => friends.dismiss(link))}
              disabled={busy}
              className="flex-1 rounded-full border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-slate-400 disabled:opacity-50"
            >
              Recusar
            </button>
          </div>
        </>
      )}

      {status === "amigos" && (
        <>
          <p className="text-sm font-semibold text-pink-200">🌟 Vocês são amigos!</p>
          <button
            onClick={openChat}
            className="mt-2 w-full rounded-full bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-2.5 text-sm font-black text-cg-onaccent shadow-lg shadow-violet-500/30 transition-transform hover:scale-[1.02]"
          >
            💬 Conversar com {firstName}
          </button>
          <button
            onClick={() => router.push(`/academia/inventario?trocar=${other.id}`)}
            className="mt-2 w-full rounded-full border border-teal-400/60 bg-teal-500/10 px-4 py-2 text-sm font-bold text-teal-100 transition-colors hover:bg-teal-500/20"
          >
            🔄 Propor troca de itens
          </button>
          <button
            onClick={() => (confirmRemove ? run(() => friends.unfriend(other.id)) : setConfirmRemove(true))}
            disabled={busy}
            onBlur={() => setConfirmRemove(false)}
            className={`mt-2 text-xs underline ${confirmRemove ? "text-rose-300" : "text-slate-500 hover:text-slate-300"}`}
          >
            {confirmRemove ? "Confirmar: desfazer a amizade, cancelar as trocas e apagar a conversa?" : "Desfazer amizade"}
          </button>
        </>
      )}

      {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
    </div>
  );
}
