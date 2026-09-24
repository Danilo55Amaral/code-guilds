// ============================================================================
// MISSIONS STORE — as missões agora são editáveis pelo professor, então
// migram de um array fixo (em missions.ts) para localStorage — mesmo padrão
// de CRUD usado em students.ts. Na primeira vez que o app roda num
// navegador, o localStorage é semeado com as 4 missões padrão.
// Cada missão pertence a um professor (teacherId); as padrão e as salvas
// antes de existir professor ficam com o professor padrão (Danilo).
// ============================================================================

import { Mission, MISSIONS as SEED_MISSIONS, normalizeRewardItem } from "./missions";
import { DEFAULT_TEACHER_ID } from "./teachers";

const MISSIONS_KEY = "cg-missions";

const DEFAULT_MISSIONS: Mission[] = SEED_MISSIONS.map((m) => ({ ...m, teacherId: DEFAULT_TEACHER_ID }));

function slugify(text: string): string {
  const base = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
  return base || `missao-${Date.now()}`;
}

function readAll(): Mission[] {
  if (typeof window === "undefined") return DEFAULT_MISSIONS;
  try {
    const raw = window.localStorage.getItem(MISSIONS_KEY);
    if (!raw) {
      writeAll(DEFAULT_MISSIONS);
      return DEFAULT_MISSIONS;
    }
    // Missões salvas antes de o item ter valor/XP ganham os padrões da raridade;
    // as de antes de existir professor ficam com o professor padrão.
    return (JSON.parse(raw) as Mission[]).map((m) => ({
      ...m,
      teacherId: m.teacherId ?? DEFAULT_TEACHER_ID,
      rewardItem: normalizeRewardItem(m.rewardItem),
    }));
  } catch {
    return DEFAULT_MISSIONS;
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

export function createMission(data: Omit<Mission, "id">): Mission {
  const all = readAll();
  let id = slugify(data.title);
  let n = 1;
  while (all.some((m) => m.id === id)) {
    id = `${slugify(data.title)}-${n++}`;
  }
  const mission: Mission = { ...data, id };
  writeAll([...all, mission]);
  return mission;
}

/** O id nunca muda numa edição — evita quebrar completedMissionIds já gravados nos alunos. */
export function updateMission(id: string, patch: Omit<Partial<Mission>, "id">) {
  const all = readAll();
  const idx = all.findIndex((m) => m.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], ...patch, id };
  writeAll(all);
}

export function deleteMission(id: string) {
  writeAll(readAll().filter((m) => m.id !== id));
}

/** Passa todas as missões de um professor para outro (usado antes de excluir um professor). */
export function reassignMissions(fromTeacherId: string, toTeacherId: string) {
  writeAll(readAll().map((m) => (m.teacherId === fromTeacherId ? { ...m, teacherId: toTeacherId } : m)));
}

export function resetToDefaultMissions() {
  writeAll(DEFAULT_MISSIONS);
}
