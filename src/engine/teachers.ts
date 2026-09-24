// ============================================================================
// TEACHERS — cadastro de professores e sessão do professor logado.
// Mesmo padrão de CRUD em localStorage de students.ts. Na primeira vez que o
// app roda num navegador, a lista é semeada com o Professor Danilo, que é o
// ADM: além do painel do professor, ele acessa o Painel ADM (/admin), onde
// cadastra novos professores e vê/altera tudo da plataforma.
//
// Cada aluno e cada missão pertencem a um professor (teacherId). Alunos e
// missões salvos antes de existir professor ficam com o Danilo.
// Como no aluno, a senha fica em texto puro de propósito (app de demonstração).
// ============================================================================

export interface Teacher {
  id: string;
  name: string;
  email: string; // sempre minúsculo
  password: string;
  isAdmin: boolean;
  tutorialDone?: boolean; // já viu (ou pulou) o tutorial do Painel do Mestre
  createdAt: string;
}

const TEACHERS_KEY = "cg-teachers";
const SESSION_KEY = "cg-teacher-session";

export const DEFAULT_TEACHER_ID = "t_danilo";

/** Código mestre antigo: nos dois campos, entra como o ADM. */
export const MASTER_CODE = "KAIROIS2024";

export const MIN_TEACHER_PASSWORD_LENGTH = 4;

const DEFAULT_TEACHER: Teacher = {
  id: DEFAULT_TEACHER_ID,
  name: "Danilo",
  email: "danilo@codeguilds.com",
  password: "prof123",
  isAdmin: true,
  createdAt: "2026-01-01T00:00:00.000Z",
};

function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

function readAll(): Teacher[] {
  if (typeof window === "undefined") return [DEFAULT_TEACHER];
  try {
    const raw = window.localStorage.getItem(TEACHERS_KEY);
    if (!raw) {
      writeAll([DEFAULT_TEACHER]);
      return [DEFAULT_TEACHER];
    }
    return JSON.parse(raw) as Teacher[];
  } catch {
    return [DEFAULT_TEACHER];
  }
}

function writeAll(teachers: Teacher[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TEACHERS_KEY, JSON.stringify(teachers));
}

/** ADM primeiro, depois por ordem de cadastro. */
export function listTeachers(): Teacher[] {
  return readAll().sort((a, b) => Number(b.isAdmin) - Number(a.isAdmin) || a.createdAt.localeCompare(b.createdAt));
}

export function getTeacher(id: string): Teacher | undefined {
  return readAll().find((t) => t.id === id);
}

/**
 * Valida os dados de um professor (cadastro e edição pelo ADM). Devolve a
 * mensagem de erro, ou null se estiver tudo certo. `exceptId` ignora o
 * próprio professor na checagem de e-mail repetido.
 */
export function validateTeacher(data: { name: string; email: string; password: string }, exceptId?: string): string | null {
  const email = normalizeEmail(data.email);
  if (!data.name.trim()) return "Informe o nome do professor.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Informe um e-mail válido.";
  if (data.password.length < MIN_TEACHER_PASSWORD_LENGTH) return `A senha precisa ter pelo menos ${MIN_TEACHER_PASSWORD_LENGTH} caracteres.`;
  if (readAll().some((t) => t.email === email && t.id !== exceptId)) return `O e-mail "${email}" já é de outro professor.`;
  return null;
}

/** Quem chama deve validar antes com validateTeacher(). */
export function createTeacher(data: { name: string; email: string; password: string }): Teacher {
  const teacher: Teacher = {
    id: `t_${Date.now()}_${Math.round(Math.random() * 9999)}`,
    name: data.name.trim(),
    email: normalizeEmail(data.email),
    password: data.password,
    isAdmin: false,
    createdAt: new Date().toISOString(),
  };
  writeAll([...readAll(), teacher]);
  return teacher;
}

/** O papel de ADM não muda por aqui — só nome, e-mail e senha. */
export function updateTeacher(id: string, patch: { name?: string; email?: string; password?: string }) {
  const all = readAll();
  const idx = all.findIndex((t) => t.id === id);
  if (idx === -1) return;
  all[idx] = {
    ...all[idx],
    ...(patch.name !== undefined && { name: patch.name.trim() }),
    ...(patch.email !== undefined && { email: normalizeEmail(patch.email) }),
    ...(patch.password !== undefined && { password: patch.password }),
  };
  writeAll(all);
}

export function markTeacherTutorialDone(id: string) {
  writeAll(readAll().map((t) => (t.id === id ? { ...t, tutorialDone: true } : t)));
}

/** O ADM não pode ser excluído. Quem chama transfere antes os alunos e missões do professor. */
export function removeTeacher(id: string) {
  writeAll(readAll().filter((t) => t.id !== id || t.isAdmin));
  if (getTeacherSessionId() === id) setTeacherSessionId(null);
}

// ============================================================================
// SESSÃO — fica no localStorage (como era o "cg-teacher-auth"), então o
// professor continua logado ao voltar pro painel.
// ============================================================================

export function getTeacherSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SESSION_KEY);
}

export function setTeacherSessionId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) window.localStorage.setItem(SESSION_KEY, id);
  else window.localStorage.removeItem(SESSION_KEY);
}

export type TeacherLoginResult = { ok: true; teacher: Teacher } | { ok: false; error: string };

/**
 * Confere e-mail e senha (ou o código mestre, que entra como ADM); se baterem,
 * abre a sessão. Com `adminOnly` (login do Painel ADM), um professor comum é
 * recusado e a sessão atual não muda.
 */
export function teacherLogin(email: string, password: string, adminOnly = false): TeacherLoginResult {
  const all = readAll();
  const byMasterCode = email.trim() === MASTER_CODE && password === MASTER_CODE;
  const teacher = byMasterCode ? all.find((t) => t.isAdmin) : all.find((t) => t.email === normalizeEmail(email));
  if (!teacher) return { ok: false, error: "E-mail de professor não encontrado." };
  const passwordOk = byMasterCode || password === teacher.password || (teacher.isAdmin && password === MASTER_CODE);
  if (!passwordOk) return { ok: false, error: "Senha incorreta." };
  if (adminOnly && !teacher.isAdmin) return { ok: false, error: "Essa conta de professor não tem acesso ao Painel ADM." };
  setTeacherSessionId(teacher.id);
  return { ok: true, teacher };
}
