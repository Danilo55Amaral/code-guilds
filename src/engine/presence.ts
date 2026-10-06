// ============================================================================
// PRESENÇA — quais alunos estão online agora (cache da API).
//
// Diferente dos outros caches, este fica só na memória da aba: o status muda
// o tempo todo e não faz sentido guardar no localStorage. Quem atualiza é o
// presenceApi.ts (sinal de vida a cada 30 segundos); as telas leem com
// isOnline() pelo hook useOnlineStatus (store.ts).
// ============================================================================

let onlineIds = new Set<string>();

/** O aluno está online agora? */
export function isOnline(studentId: string): boolean {
  return onlineIds.has(studentId);
}

/** Quantos alunos estão online agora. */
export function onlineCount(): number {
  return onlineIds.size;
}

/** Troca a lista de quem está online. Devolve true se mudou algo (pra só avisar as telas quando precisa). */
export function saveOnlineIds(ids: string[]): boolean {
  const next = new Set(ids);
  const changed = next.size !== onlineIds.size || ids.some((id) => !onlineIds.has(id));
  onlineIds = next;
  return changed;
}

/** Saiu da conta: ninguém fica marcado até o próximo sinal. */
export function forgetOnlineIds(): boolean {
  return saveOnlineIds([]);
}
