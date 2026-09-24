// ============================================================================
// STUDENTS — cadastro de alunos, avatar, progressão (XP/nível/moedas) e
// inventário. Mesmo padrão de CRUD em localStorage usado no projeto do
// Rejuvenation Lab Simulator (people.ts) — vários alunos podem existir no
// mesmo navegador, com um "aluno ativo" por vez.
//
// Cada aluno tem login e senha. A sessão ("aluno ativo") fica no
// sessionStorage: dura só enquanto a aba está aberta, então toda nova entrada
// na plataforma começa pela tela de login. A senha fica em texto puro de
// propósito — o professor precisa conseguir ver (é um app de demonstração,
// sem backend; não é autenticação de verdade).
// ============================================================================

import { HouseId } from "./houses";
import { Mission, Rarity, normalizeRewardItem } from "./missions";
import { AvatarConfig, DEFAULT_AVATAR, normalizeAvatar } from "./avatar";
import { DEFAULT_TEACHER_ID } from "./teachers";

export interface InventoryItem {
  id: string;
  name: string;
  rarity: Rarity;
  value: number; // moedas que o sistema paga por ele
  xp: number; // XP ao usar; 0 = não é consumível
  obtainedAt: string;
}

export type OnboardingStep = "casa" | "avatar" | "completo";

export interface Student {
  id: string;
  name: string;
  email: string;
  turma: string;
  username: string; // login, sempre minúsculo e sem espaços
  password: string; // "" = aluno antigo, ainda sem senha (o professor define)
  teacherId: string; // professor escolhido no cadastro — o aluno só vê as missões dele
  houseId: HouseId | null;
  avatar: AvatarConfig;
  level: number;
  xp: number; // xp acumulado dentro do nível atual (vai de 0 até xpToNextLevel(level))
  coins: number;
  inventory: InventoryItem[];
  completedMissionIds: string[];
  onboardingStep: OnboardingStep;
  tutorialDone?: boolean; // já viu (ou pulou) o tutorial da Academia
  createdAt: string;
}

// ============================================================================
// CURVA DE XP — do nível 1 pro 2 são 500 XP; cada nível seguinte pede 150 XP
// a mais que o anterior (30% dos 500 iniciais, sempre o mesmo acréscimo):
// 500 → 650 → 800 → 950 → ... → 5.450 no nível 34.
// Crescer em cima do nível anterior (+30% composto) explodia nos níveis altos
// (quase 2,9 milhões de XP no nível 34), por isso o acréscimo é fixo.
// ============================================================================

export const BASE_XP_TO_LEVEL_UP = 500;
export const XP_INCREASE_PER_LEVEL = 150;

/** Quanto XP o aluno precisa juntar, estando em `level`, pra subir pro próximo nível. */
export function xpToNextLevel(level: number): number {
  return BASE_XP_TO_LEVEL_UP + XP_INCREASE_PER_LEVEL * (level - 1);
}

const STUDENTS_KEY = "cg-students";
const ACTIVE_KEY = "cg-active-student";

/** Deixa o login no formato aceito: minúsculo, sem acento e só com letras, números, ponto, hífen e _. */
export function normalizeUsername(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9._-]/g, "");
}

function readAll(): Student[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STUDENTS_KEY);
    if (!raw) return [];
    const taken = new Set<string>();
    // Alunos salvos no formato antigo são completados na leitura: avatar convertido
    // e, se não tiverem login, ganham um tirado do e-mail (sem senha até o professor definir).
    return (JSON.parse(raw) as Student[]).map((s) => {
      let username = s.username;
      if (!username) {
        const base = normalizeUsername(s.email.split("@")[0] || s.name) || "aluno";
        username = base;
        for (let n = 2; taken.has(username); n++) username = `${base}${n}`;
      }
      taken.add(username);
      return {
        ...s,
        username,
        password: s.password ?? "",
        // alunos de antes de existir professor ficam com o Danilo
        teacherId: s.teacherId ?? DEFAULT_TEACHER_ID,
        avatar: normalizeAvatar(s.avatar ?? {}),
        // itens de antes do mercado ganham valor pela raridade e não são consumíveis
        inventory: (s.inventory ?? []).map((i) => ({ ...i, ...normalizeRewardItem(i) })),
      };
    });
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
  return window.sessionStorage.getItem(ACTIVE_KEY);
}

export function setActiveStudentId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) window.sessionStorage.setItem(ACTIVE_KEY, id);
  else window.sessionStorage.removeItem(ACTIVE_KEY);
}

export function listStudents(): Student[] {
  return readAll().sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function getStudent(id: string): Student | undefined {
  return readAll().find((s) => s.id === id);
}

export const MIN_USERNAME_LENGTH = 3;
export const MIN_PASSWORD_LENGTH = 4;

/**
 * Valida login e senha (cadastro e edição pelo professor). Devolve a mensagem
 * de erro pra mostrar na tela, ou null se estiver tudo certo.
 * `exceptId` ignora o próprio aluno na checagem de login repetido.
 */
export function validateCredentials(username: string, password: string, exceptId?: string): string | null {
  const login = normalizeUsername(username);
  if (login.length < MIN_USERNAME_LENGTH) return `O login precisa ter pelo menos ${MIN_USERNAME_LENGTH} caracteres (letras, números, ponto, hífen ou _).`;
  if (password.length < MIN_PASSWORD_LENGTH) return `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  if (readAll().some((s) => s.username === login && s.id !== exceptId)) return `O login "${login}" já está em uso — escolha outro.`;
  return null;
}

export type LoginResult = { ok: true; student: Student } | { ok: false; error: string };

/** Confere login e senha; se baterem, o aluno vira o ativo desta aba. */
export function login(username: string, password: string): LoginResult {
  const student = readAll().find((s) => s.username === normalizeUsername(username));
  if (!student) return { ok: false, error: "Login não encontrado. Confira ou crie uma conta." };
  if (!student.password) return { ok: false, error: "Sua conta ainda não tem senha — peça ao professor para definir uma." };
  if (student.password !== password) return { ok: false, error: "Senha incorreta." };
  setActiveStudentId(student.id);
  return { ok: true, student };
}

/** Quem chama deve validar antes com validateCredentials(). */
export function createStudent(data: { name: string; email: string; turma: string; username: string; password: string; teacherId: string }): Student {
  const student: Student = {
    id: `s_${Date.now()}_${Math.round(Math.random() * 9999)}`,
    name: data.name.trim(),
    email: data.email.trim(),
    turma: data.turma.trim(),
    username: normalizeUsername(data.username),
    password: data.password,
    teacherId: data.teacherId,
    houseId: null,
    avatar: DEFAULT_AVATAR,
    level: 1,
    xp: 0,
    coins: 0,
    inventory: [{ id: `i_${Date.now()}`, name: "Fragmento Inicial", rarity: "comum", value: 5, xp: 20, obtainedAt: new Date().toISOString() }],
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

/** Passa todos os alunos de um professor para outro (usado antes de excluir um professor). */
export function reassignStudents(fromTeacherId: string, toTeacherId: string) {
  writeAll(readAll().map((s) => (s.teacherId === fromTeacherId ? { ...s, teacherId: toTeacherId } : s)));
}

/** XP total que o aluno já conquistou desde o nível 1 (os níveis completos + o XP do nível atual). */
export function totalXp(level: number, xp: number): number {
  let total = xp;
  for (let l = 1; l < level; l++) total += xpToNextLevel(l);
  return total;
}

/** Aplica XP com estouro de nível corretamente tratado (pode subir mais de 1 nível de uma vez). */
export function addXp(student: Student, amount: number): { level: number; xp: number } {
  let level = student.level;
  let xp = student.xp + amount;
  while (xp >= xpToNextLevel(level)) {
    xp -= xpToNextLevel(level);
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
export function grantItem(student: Student, item: { name: string; rarity: Rarity; value: number; xp: number }): Student {
  const newItem: InventoryItem = {
    id: `i_${Date.now()}_${Math.round(Math.random() * 9999)}`,
    name: item.name.trim() || "Item Misterioso",
    rarity: item.rarity,
    value: Math.max(0, Math.round(item.value)),
    xp: Math.max(0, Math.round(item.xp)),
    obtainedAt: new Date().toISOString(),
  };
  return { ...student, inventory: [...student.inventory, newItem] };
}

/** Remove um item pelo id — só aquele exemplar, mesmo que o aluno tenha outros com o mesmo nome. */
export function removeItem(student: Student, itemId: string): Student {
  return { ...student, inventory: student.inventory.filter((i) => i.id !== itemId) };
}

/** Vende o item pro sistema: ele some do inventário e o aluno recebe o valor em moedas. */
export function sellItemToSystem(student: Student, itemId: string): Student {
  const item = student.inventory.find((i) => i.id === itemId);
  if (!item) return student;
  return { ...removeItem(student, itemId), coins: student.coins + item.value };
}

export interface ConsumeResult {
  student: Student;
  xpGained: number;
  leveledUp: boolean;
  fromLevel: number;
  newLevel: number;
}

/** Usa um item consumível: ele some e o aluno ganha o XP dele (pode subir de nível). */
export function consumeItem(student: Student, itemId: string): ConsumeResult | null {
  const item = student.inventory.find((i) => i.id === itemId);
  if (!item || item.xp <= 0) return null;
  const { level, xp } = addXp(student, item.xp);
  return {
    student: { ...removeItem(student, itemId), level, xp },
    xpGained: item.xp,
    leveledUp: level > student.level,
    fromLevel: student.level,
    newLevel: level,
  };
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
    value: mission.rewardItem.value,
    xp: mission.rewardItem.xp,
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
