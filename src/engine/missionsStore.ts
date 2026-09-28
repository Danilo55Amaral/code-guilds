// ============================================================================
// MISSIONS STORE — as missões dos professores.
//
// Desde a fase 3 do back end, as missões são da API (tabela missions): o
// professor cria, edita e exclui lá, e as 4 missões de exemplo são criadas
// pelo seed da API como missões do ADM. Aqui o localStorage ("cg-missions")
// é só um cache do que a API devolveu, pras telas lerem na hora; quem
// atualiza o cache é o refreshFromApi (engine/accounts.ts) e as funções abaixo.
// Cada missão pertence a um professor (teacherId); o aluno vê as do professor dele.
// ============================================================================

import { api, describeError } from "@/services/api";
import { Mission, normalizeRewardItem } from "./missions";

const MISSIONS_KEY = "cg-missions";

/** Missão como a API manda: os campos opcionais vêm como null. */
type MissionFromApi = Omit<Mission, "task" | "eventId" | "eventPhase" | "kind"> & {
  kind?: Mission["kind"] | null;
  task?: Mission["task"] | null;
  eventId?: string | null;
  eventPhase?: number | null;
};

/** Deixa a missão no formato do site (null vira "sem valor"). */
function fromApi(m: MissionFromApi): Mission {
  return {
    ...m,
    kind: m.kind ?? undefined,
    task: m.task ?? undefined,
    eventId: m.eventId ?? undefined,
    eventPhase: m.eventPhase ?? undefined,
    rewardItem: { ...m.rewardItem, ...normalizeRewardItem(m.rewardItem) },
  };
}

function readAll(): Mission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(MISSIONS_KEY);
    if (!raw) return [];
    // missões de antes do back end (do professor-semente "t_danilo") não valem mais
    return (JSON.parse(raw) as Mission[]).filter((m) => !m.teacherId.startsWith("t_"));
  } catch {
    return [];
  }
}

function writeAll(missions: Mission[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MISSIONS_KEY, JSON.stringify(missions));
}

export function listMissions(): Mission[] {
  return readAll();
}

export function getMissionById(id: string): Mission | undefined {
  return readAll().find((m) => m.id === id);
}

/** Troca o cache pela lista que a API devolveu (as missões que a pessoa logada pode ver). */
export function saveMissions(missions: MissionFromApi[]) {
  writeAll(missions.map(fromApi));
}

/** Guarda (ou atualiza) uma missão que a API devolveu. */
function saveMission(mission: MissionFromApi) {
  const saved = fromApi(mission);
  writeAll([...readAll().filter((m) => m.id !== saved.id), saved]);
}

export type MissionResult = { ok: true; mission: Mission } | { ok: false; error: string };

/** Cria a missão na API. O id é gerado lá (a partir do título). */
export async function createMission(data: Omit<Mission, "id">): Promise<MissionResult> {
  try {
    const { mission } = await api.post<{ mission: MissionFromApi }>("/missions", data);
    saveMission(mission);
    return { ok: true, mission: fromApi(mission) };
  } catch (error) {
    return { ok: false, error: describeError(error) };
  }
}

/**
 * Altera só os campos do patch. O id nunca muda numa edição (evita quebrar as
 * missões feitas já gravadas nos alunos). Campo com undefined no patch (ex.:
 * tirar a missão do evento) vai como null, que pra API quer dizer "tirar".
 */
export async function updateMission(id: string, patch: Omit<Partial<Mission>, "id">): Promise<MissionResult> {
  try {
    const body = Object.fromEntries(Object.entries(patch).map(([key, value]) => [key, value === undefined ? null : value]));
    const { mission } = await api.put<{ mission: MissionFromApi }>(`/missions/${id}`, body);
    saveMission(mission);
    return { ok: true, mission: fromApi(mission) };
  } catch (error) {
    return { ok: false, error: describeError(error) };
  }
}

export async function deleteMission(id: string): Promise<string | null> {
  try {
    await api.delete(`/missions/${id}`);
    writeAll(readAll().filter((m) => m.id !== id));
    return null;
  } catch (error) {
    return describeError(error);
  }
}
