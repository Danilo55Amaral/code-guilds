"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStudents, useFriends } from "@/engine/store";
import { Student } from "@/engine/students";

// ============================================================================
// AÇÕES DE AMIZADE no perfil de um aluno (HousemateSheet): mandar pedido,
// cancelar, aceitar/recusar um pedido recebido, abrir a conversa ou desfazer
// a amizade. Só aparece pro aluno logado olhando o perfil de outro aluno.
// ============================================================================

export default function FriendActions({ other, onChat }: { other: Student; onChat?: () => void }) {
  const router = useRouter();
  const { activeStudent } = useStudents();
  const friends = useFriends(activeStudent?.id ?? null);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!activeStudent || activeStudent.id === other.id || !friends.ready) return null;
  const status = friends.statusWith(other.id);
  const link = friends.linkWith(other.id);
  const firstName = other.name.split(" ")[0];

  function sendRequest() {
    const result = friends.request(other.id);
    setError(result.ok ? null : result.error);
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
            onClick={sendRequest}
            className="w-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-4 py-2.5 text-sm font-black text-cg-onaccent shadow-lg shadow-pink-500/30 transition-transform hover:scale-[1.02]"
          >
            🤝 Enviar pedido de amizade
          </button>
          <p className="mt-1.5 text-[11px] text-slate-400">Amigos podem conversar usando balões de fala.</p>
        </>
      )}

      {status === "enviado" && link && (
        <>
          <p className="text-sm font-semibold text-pink-200">⏳ Pedido enviado! Esperando {firstName} responder.</p>
          <button onClick={() => friends.dismiss(link)} className="mt-2 text-xs text-slate-400 underline hover:text-white">
            Cancelar pedido
          </button>
        </>
      )}

      {status === "recebido" && link && (
        <>
          <p className="text-sm font-semibold text-pink-200">🤝 {firstName} te mandou um pedido de amizade!</p>
          <div className="mt-2 flex gap-2">
            <button onClick={() => friends.accept(link)} className="flex-1 rounded-full bg-emerald-500 px-4 py-2 text-sm font-black text-cg-onaccent transition-transform hover:scale-[1.02]">
              ✅ Aceitar
            </button>
            <button onClick={() => friends.dismiss(link)} className="flex-1 rounded-full border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-slate-400">
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
            onClick={() => (confirmRemove ? friends.unfriend(other.id) : setConfirmRemove(true))}
            onBlur={() => setConfirmRemove(false)}
            className={`mt-2 text-xs underline ${confirmRemove ? "text-rose-300" : "text-slate-500 hover:text-slate-300"}`}
          >
            {confirmRemove ? "Confirmar: desfazer a amizade e apagar a conversa?" : "Desfazer amizade"}
          </button>
        </>
      )}

      {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
    </div>
  );
}
