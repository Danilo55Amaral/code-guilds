// ============================================================================
// SOCIAL API — pedidos de amizade e amizades entre alunos (fase 3 do back
// end). A API guarda os vínculos (trocar itens só é permitido entre amigos, e
// quem confere é o servidor); aqui cada ação chama a API e atualiza o cache
// "cg-friends" (engine/friends.ts). A conversa com balões continua neste
// navegador até a fase 4.
//
// Toda função devolve { ok: true, ... } ou { ok: false, error } com a
// mensagem da API pra mostrar na tela.
// ============================================================================

import { api, describeError } from "@/services/api";
import { emitChange } from "./events";
import { StudentAccount, saveStudentAccounts } from "./students";
import { FriendLink, deleteChatBetween, forgetFriendLink, rememberFriendLink } from "./friends";
import { deleteTradesBetween } from "./trades";

export type SocialResult<T = object> = ({ ok: true } & T) | { ok: false; error: string };

/**
 * Manda um pedido de amizade. Se o outro aluno já tinha mandado um pedido pra
 * este, os dois viram amigos na hora (`accepted: true`).
 */
export async function requestFriend(toId: string): Promise<SocialResult<{ accepted: boolean }>> {
  try {
    const { friendship, accepted } = await api.post<{ friendship: FriendLink; accepted: boolean }>("/friends", { toId });
    rememberFriendLink(friendship);
    emitChange();
    return { ok: true, accepted };
  } catch (error) {
    return { ok: false, error: describeError(error) };
  }
}

/** Aceita um pedido recebido. */
export async function acceptFriend(linkId: string): Promise<SocialResult> {
  try {
    const { friendship } = await api.post<{ friendship: FriendLink }>(`/friends/${linkId}/accept`);
    rememberFriendLink(friendship);
    emitChange();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: describeError(error) };
  }
}

/**
 * Recusa ou cancela um pedido, ou desfaz uma amizade. Desfazer a amizade
 * cancela as propostas de troca entre os dois (os itens oferecidos voltam pra
 * quem propôs) e apaga a conversa deste navegador.
 */
export async function removeFriendLink(link: FriendLink): Promise<SocialResult> {
  try {
    const { student } = await api.delete<{ student: StudentAccount }>(`/friends/${link.id}`);
    saveStudentAccounts([student]);
    forgetFriendLink(link.id);
    if (link.status === "aceito") {
      deleteTradesBetween(link.fromId, link.toId);
      deleteChatBetween(link.fromId, link.toId);
    }
    emitChange();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: describeError(error) };
  }
}
