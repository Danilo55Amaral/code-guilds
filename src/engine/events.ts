// ============================================================================
// EVENTS — avisa todas as partes da tela quando algum dado salvo muda.
//
// Por que isso existe: cada componente que chama useStudents()/useMissions()
// guarda sua própria cópia dos dados em estado local. Sem um aviso, quando a
// tela de Missões salvava a recompensa, o cabeçalho (nível/XP/moedas)
// continuava mostrando a cópia antiga até a página ser recarregada.
//
// Agora, toda escrita chama emitChange(), e cada hook inscrito relê os dados
// do localStorage na hora — todas as cópias ficam iguais imediatamente.
// ============================================================================

type Listener = () => void;

const listeners = new Set<Listener>();

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function emitChange() {
  listeners.forEach((listener) => listener());
}

export function listenerCount(): number {
  return listeners.size;
}
