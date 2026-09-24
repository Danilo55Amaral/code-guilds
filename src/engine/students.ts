// ============================================================================
// STUDENTS — cadastro de alunos, avatar, progressão (XP/nível/moedas) e
// inventário. Mesmo padrão de CRUD em localStorage usado no projeto do
// Rejuvenation Lab Simulator (people.ts) — vários alunos podem existir no
// mesmo navegador, com um "aluno ativo" por vez.
// ============================================================================

import { HouseId } from "./houses";
import { Mission, Rarity } from "./missions";
import { AvatarConfig, DEFAULT_AVATAR, normalizeAvatar } from "./avatar";

export interface InventoryItem {
  id: string;
  name: string;
  rarity: Rarity;
  obtainedAt: string;
}

export type OnboardingStep = "casa" | "avatar" | "completo";

export interface Student {
  id: string;
  name: string;
  email: string;
  turma: string;
  houseId: HouseId | null;
  avatar: AvatarConfig;
  level: number;
  xp: number; // xp acumulado dentro do nível atual
  coins: number;
  inventory: InventoryItem[];
  completedMissionIds: string[];
  onboardingStep: OnboardingStep;
  createdAt: string;
}

export const XP_PER_LEVEL = 500;

const STUDENTS_KEY = "cg-students";
const ACTIVE_KEY = "cg-active-student";

function readAll(): Student[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STUDENTS_KEY);
    if (!raw) return [];
    // Avatares salvos no formato antigo são completados/convertidos na leitura.
    return (JSON.parse(raw) as Student[]).map((s) => ({ ...s, avatar: normalizeAvatar(s.avatar ?? {}) }));
  } catch {
    return [];
  }
}

function writeAll(students: Student[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
}

export function getActiveStudentId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE_KEY);
}

export function setActiveStudentId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) window.localStorage.setItem(ACTIVE_KEY, id);
  else window.localStorage.removeItem(ACTIVE_KEY);
}

export function listStudents(): Student[] {
  return readAll().sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function getStudent(id: string): Student | undefined {
  return readAll().find((s) => s.id === id);
}

export function createStudent(data: { name: string; email: string; turma: string }): Student {
  const student: Student = {
    id: `s_${Date.now()}_${Math.round(Math.random() * 9999)}`,
    name: data.name.trim(),
    email: data.email.trim(),
    turma: data.turma.trim(),
    houseId: null,
    avatar: DEFAULT_AVATAR,
    level: 1,
    xp: 0,
    coins: 0,
    inventory: [{ id: `i_${Date.now()}`, name: "Fragmento Inicial", rarity: "comum", obtainedAt: new Date().toISOString() }],
    completedMissionIds: [],
    onboardingStep: "casa",
    createdAt: new Date().toISOString(),
  };
  writeAll([...readAll(), student]);
  setActiveStudentId(student.id);
  return student;
}

export function updateStudent(id: string, patch: Partial<Student>) {
  const all = readAll();
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], ...patch };
  writeAll(all);
}

export function removeStudent(id: string) {
  writeAll(readAll().filter((s) => s.id !== id));
  if (getActiveStudentId() === id) setActiveStudentId(null);
}

/** Aplica XP com estouro de nível corretamente tratado (pode subir mais de 1 nível de uma vez). */
export function addXp(student: Student, amount: number): { level: number; xp: number } {
  let level = student.level;
  let xp = student.xp + amount;
  while (xp >= XP_PER_LEVEL) {
    xp -= XP_PER_LEVEL;
    level += 1;
  }
  return { level, xp };
}

// ============================================================================
// INVENTÁRIO PELO PROFESSOR — o professor pode dar um item avulso ou tirar
// um item de qualquer aluno. Funções puras: devolvem o aluno já alterado,
// quem chama decide onde salvar (mesmo padrão do applyMissionReward).
// ============================================================================

/** Dá um item ao aluno (nome vazio vira "Item Misterioso", igual ao editor de missões). */
export function grantItem(student: Student, item: { name: string; rarity: Rarity }): Student {
  const newItem: InventoryItem = {
    id: `i_${Date.now()}_${Math.round(Math.random() * 9999)}`,
    name: item.name.trim() || "Item Misterioso",
    rarity: item.rarity,
    obtainedAt: new Date().toISOString(),
  };
  return { ...student, inventory: [...student.inventory, newItem] };
}

/** Remove um item pelo id — só aquele exemplar, mesmo que o aluno tenha outros com o mesmo nome. */
export function removeItem(student: Student, itemId: string): Student {
  return { ...student, inventory: student.inventory.filter((i) => i.id !== itemId) };
}

export interface MissionRewardResult {
  student: Student;
  leveledUp: boolean;
  newLevel: number;
}

/** Aplica as recompensas de uma missão concluída (XP, moedas, item) ao aluno. */
export function applyMissionReward(student: Student, mission: Mission): MissionRewardResult {
  const { level, xp } = addXp(student, mission.rewardXp);
  const leveledUp = level > student.level;

  const newItem: InventoryItem = {
    id: `i_${Date.now()}_${Math.round(Math.random() * 9999)}`,
    name: mission.rewardItem.name,
    rarity: mission.rewardItem.rarity,
    obtainedAt: new Date().toISOString(),
  };

  const updated: Student = {
    ...student,
    level,
    xp,
    coins: student.coins + mission.rewardCoins,
    inventory: [...student.inventory, newItem],
    completedMissionIds: student.completedMissionIds.includes(mission.id)
      ? student.completedMissionIds
      : [...student.completedMissionIds, mission.id],
  };

  return { student: updated, leveledUp, newLevel: level };
}
