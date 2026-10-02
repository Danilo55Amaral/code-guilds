// ============================================================================
// TEACHERS — professores e a sessão do professor logado.
//
// Desde a ligação com o back end (pasta api/), quem cadastra, confere a senha
// e guarda os professores é a API. Aqui fica só um CACHE no localStorage
// ("cg-teachers") com o que a API devolveu, pra as telas lerem na hora, e o
// id do professor logado ("cg-teacher-session"), que espelha a sessão da API
// (o login de verdade é o cookie httpOnly). Quem fala com a API é o
// engine/accounts.ts. Senha de professor não existe mais no site.
//
// Cada aluno e cada missão pertencem a um professor (teacherId). O ADM é o
// professor com isAdmin; além do painel do professor, ele acessa o Painel ADM.
// ============================================================================

export interface Teacher {
  id: string;
  name: string;
  email: string; // "" quando o site só conhece os dados públicos (lista do cadastro do aluno)
  isAdmin: boolean;
  tutorialDone?: boolean; // já viu (ou pulou) o tutorial do Painel do Mestre
  createdAt: string;
}

const TEACHERS_KEY = "cg-teachers";
const SESSION_KEY = "cg-teacher-session";

/**
 * Id do professor-semente de antes do back end. As missões de exemplo (e as
 * antigas, sem professor) são dele; hoje elas pertencem ao ADM da API.
 */
export const DEFAULT_TEACHER_ID = "t_danilo";

export const MIN_TEACHER_PASSWORD_LENGTH = 4;

function readAll(): Teacher[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(TEACHERS_KEY);
    if (!raw) return [];
    // professores guardados antes do back end (com senha e ids "t_...") não valem mais
    return (JSON.parse(raw) as Teacher[]).filter((t) => !t.id.startsWith("t_"));
  } catch {
    return [];
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

/** Id do ADM (dono das missões de exemplo), ou null se o site ainda não sabe quem é. */
export function getAdminTeacherId(): string | null {
  return readAll().find((t) => t.isAdmin)?.id ?? null;
}

/**
 * Guarda no cache os professores que a API devolveu. Com `replace`, a lista
 * vira exatamente essa (quem saiu da API sai do cache); sem ele, só atualiza
 * e acrescenta. Dados que a lista não traz (ex.: o e-mail, na lista pública)
 * continuam os que o cache já tinha.
 */
export function saveTeachers(teachers: (Partial<Teacher> & { id: string })[], replace: boolean) {
  const current = readAll();
  const byId = new Map(current.map((t) => [t.id, t]));
  const merged = teachers.map((t) => {
    const old = byId.get(t.id);
    return {
      id: t.id,
      name: t.name ?? old?.name ?? "",
      email: t.email ?? old?.email ?? "",
      isAdmin: t.isAdmin ?? old?.isAdmin ?? false,
      tutorialDone: t.tutorialDone ?? old?.tutorialDone,
      createdAt: t.createdAt ?? old?.createdAt ?? new Date().toISOString(),
    };
  });
  if (replace) {
    writeAll(merged);
    return;
  }
  const incoming = new Set(merged.map((t) => t.id));
  writeAll([...current.filter((t) => !incoming.has(t.id)), ...merged]);
}

/** Tira um professor do cache (depois que a API o excluiu). */
export function forgetTeacher(id: string) {
  writeAll(readAll().filter((t) => t.id !== id));
  if (getTeacherSessionId() === id) setTeacherSessionId(null);
}

/**
 * Confere nome, e-mail e senha antes de mandar pra API (cadastro e edição
 * pelo ADM). Na edição a senha é opcional: em branco, continua a mesma.
 * O e-mail repetido quem confere é a API. Devolve a mensagem de erro, ou null.
 */
export function validateTeacher(data: { name: string; email: string; password: string }, editing = false): string | null {
  if (!data.name.trim()) return "Informe o nome do professor.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) return "Informe um e-mail válido.";
  if (!(editing && !data.password) && data.password.length < MIN_TEACHER_PASSWORD_LENGTH) {
    return `A senha precisa ter pelo menos ${MIN_TEACHER_PASSWORD_LENGTH} caracteres.`;
  }
  return null;
}

// ============================================================================
// SESSÃO — o id do professor logado, espelhando o cookie da API. Fica no
// localStorage, então o painel abre direto ao voltar (a API confirma logo
// depois, no refreshAccounts do engine/accounts.ts).
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
