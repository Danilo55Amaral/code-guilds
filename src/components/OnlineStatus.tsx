"use client";

import { useOnlineStatus, usePresencePolling } from "@/engine/store";

// ============================================================================
// STATUS ONLINE — a bolinha verde (online) ou vermelha (offline) ao lado do
// nome do aluno nos rankings, nas listas e nos perfis, e o selo com o nome do
// status ("Online"/"Offline") no perfil que abre ao clicar no aluno.
// ============================================================================

/** Bolinha verde (online) ou vermelha (offline). Passando o mouse, aparece o nome do status. */
export function OnlineDot({ studentId, className = "" }: { studentId: string; className?: string }) {
  const { isOnline } = useOnlineStatus();
  const online = isOnline(studentId);
  const label = online ? "Online" : "Offline";

  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-black/20 ${online ? "bg-emerald-400" : "bg-rose-500"} ${className}`}
    />
  );
}

/** Selo com a bolinha e o nome do status, pro perfil do aluno. */
export function OnlineBadge({ studentId, className = "" }: { studentId: string; className?: string }) {
  const { isOnline } = useOnlineStatus();
  const online = isOnline(studentId);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
        online ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300" : "border-rose-500/40 bg-rose-500/10 text-rose-300"
      } ${className}`}
    >
      <span className={`h-2 w-2 rounded-full ${online ? "bg-emerald-400" : "bg-rose-500"}`} />
      {online ? "Online" : "Offline"}
    </span>
  );
}

/** Quantos alunos estão online (pro painel do professor e do ADM). */
export function OnlineCount({ studentIds }: { studentIds: string[] }) {
  const { isOnline } = useOnlineStatus();
  const count = studentIds.filter((id) => isOnline(id)).length;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
      <span className="h-2 w-2 rounded-full bg-emerald-400" />
      {count} {count === 1 ? "aluno online" : "alunos online"}
    </span>
  );
}

/** Mantém o status online atualizado em todas as telas (montado no layout raiz). Não desenha nada. */
export function PresenceHeartbeat() {
  usePresencePolling();
  return null;
}
