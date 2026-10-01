// ============================================================================
// ACCOUNTS — a ponte entre o site e o back end (pasta api/).
//
// A API é a dona das CONTAS: login, cadastro, sessão (cookie httpOnly),
// professores e o perfil do aluno (nome, e-mail, turma, login, professor,
// casa, avatar, etapa do primeiro acesso e tutorial). Desde a fase 3, também
// é dona do PROGRESSO DO JOGO (nível, XP, moedas, inventário, missões feitas),
// das missões, da Loja, das amizades, das ofertas, das trocas e da agenda dos
// eventos; desde a fase 4, das mensagens, da conversa com balões e das
// mensagens pro professor.
//
// Tudo que a API devolve vai pros mesmos localStorage de antes ("cg-teachers",
// "cg-students" e, desde as fases 3 e 4, "cg-missions", "cg-shop", "cg-friends",
// "cg-offers", "cg-trades", "cg-event-runs", "cg-messages", "cg-chats" e
// "cg-teacher-messages"), que viraram um cache: as
// telas continuam lendo na hora, sem esperar a rede, e o refreshFromApi()
// atualiza o cache em segundo plano. Toda escrita termina com emitChange(), igual ao resto do engine,
// então os hooks do store.ts se atualizam sozinhos.
// ============================================================================

import { api, ApiError, describeError } from "@/services/api";
import { emitChange } from "./events";
import {
  LoginResult,
  Student,
  StudentAccount,
  getStudent,
  reassignStudents,
  removeStudent,
  saveStudentAccounts,
  setActiveStudentId,
  setVisibleStudentIds,
  updateStudent,
} from "./students";
import { Teacher, TeacherLoginResult, forgetTeacher, getTeacher, saveTeachers, setTeacherSessionId } from "./teachers";
import { Mission } from "./missions";
import { saveMissions } from "./missionsStore";
import { ShopItemFromApi, saveShopItems } from "./shop";
import { ChatMessage, FriendLink, saveChatMessages, saveFriendLinks } from "./friends";
import { Message, forgetMessages, saveMessagesOf } from "./messages";
import { TeacherMessage, saveTeacherMessages } from "./teacherMessages";
import { Offer, saveOffers } from "./market";
import { Trade, saveTrades } from "./trades";
import { EventRuns, saveEventRuns } from "./eventSchedule";
import type { HouseId } from "./houses";

type MeResponse = { role: "professor"; teacher: Teacher } | { role: "aluno"; student: StudentAccount };

// ---------------------------------------------------------------------------
// Sincronização com a API
// ---------------------------------------------------------------------------

/** Pausa mínima entre duas sincronizações automáticas (os hooks montam em várias telas ao mesmo tempo). */
const REFRESH_INTERVAL_MS = 5000;

let sessionChecked = false;
let refreshing: Promise<void> | null = null;
let lastRefreshAt = 0;

/**
 * Muda a cada login, cadastro ou saída. Uma sincronização que começou antes
 * disso descarta o que trouxe (senão, a resposta atrasada "ninguém logado"
 * apagaria a sessão que acabou de abrir).
 */
let sessionVersion = 0;

function markSessionChanged() {
  sessionVersion += 1;
}

/**
 * A primeira conferência de sessão com a API já terminou? Antes disso as
 * telas protegidas esperam ("Carregando…"), senão mandariam pro login quem
 * abriu uma aba nova e ainda está logado.
 */
export function isSessionChecked(): boolean {
  return sessionChecked;
}

/**
 * Busca na API quem está logado e as listas que essa pessoa pode ver (alunos,
 * professores e missões), e atualiza o cache. Chamado pelos hooks ao abrir as telas (no máximo a cada
 * 5 segundos, a não ser com `force`) e depois de login, cadastro e edições.
 */
export function refreshFromApi(force = false): Promise<void> {
  // Já tem uma em andamento: com `force`, roda outra logo depois dela (ela pode ser de antes de um login)
  if (refreshing) return force ? refreshing.then(() => refreshFromApi(true)) : refreshing;
  if (!force && sessionChecked && Date.now() - lastRefreshAt < REFRESH_INTERVAL_MS) return Promise.resolve();
  lastRefreshAt = Date.now();
  refreshing = syncWithApi().finally(() => {
    refreshing = null;
    sessionChecked = true;
    emitChange();
  });
  return refreshing;
}

async function syncWithApi() {
  const version = sessionVersion;
  // Houve login, cadastro ou saída enquanto a API respondia? Então o que chegou está velho.
  const outdated = () => version !== sessionVersion;

  let me: MeResponse | null = null;
  try {
    me = await api.get<MeResponse>("/auth/me");
  } catch (error) {
    // Sem internet ou com a API fora do ar, o site segue com o que tem no cache.
    if (!(error instanceof ApiError) || error.status === 0) return;
    if (error.status !== 401) console.warn("[accounts] não deu pra conferir a sessão:", error.message);
  }
  if (outdated()) return;

  try {
    if (me?.role === "professor") {
      setTeacherSessionId(me.teacher.id);
      setActiveStudentId(null);
      forgetStudentSocial();
      saveTeachers([me.teacher], false);
      const [{ students }, teachers, { missions }, { items }, { runs }, inbox] = await Promise.all([
        api.get<{ students: StudentAccount[] }>("/students"),
        me.teacher.isAdmin ? api.get<{ teachers: Teacher[] }>("/teachers/admin") : api.get<{ teachers: Teacher[] }>("/teachers"),
        api.get<{ missions: Mission[] }>("/missions"),
        api.get<{ items: ShopItemFromApi[] }>("/shop"),
        api.get<{ runs: EventRuns }>("/events/runs"),
        api.get<{ messages: TeacherMessage[] }>("/teacher-messages"),
      ]);
      if (outdated()) return;
      saveStudentAccounts(students);
      setVisibleStudentIds(students.map((s) => s.id));
      saveTeachers(teachers.teachers, true);
      saveMissions(missions);
      saveShopItems(items);
      saveEventRuns(runs);
      saveTeacherMessages(inbox.messages);
      return;
    }

    if (me?.role === "aluno") {
      setActiveStudentId(me.student.id);
      setTeacherSessionId(null);
      saveStudentAccounts([me.student]);
      const [{ students }, { teachers }, { missions }, { items }, { friendships }, offers, trades, { runs }, inbox, chats, sent] = await Promise.all([
        api.get<{ students: StudentAccount[] }>("/students/community"),
        api.get<{ teachers: Teacher[] }>("/teachers"),
        api.get<{ missions: Mission[] }>("/missions"),
        api.get<{ items: ShopItemFromApi[] }>("/shop"),
        api.get<{ friendships: FriendLink[] }>("/friends"),
        api.get<{ received: Offer[]; sent: Offer[] }>("/offers"),
        api.get<{ received: Trade[]; sent: Trade[] }>("/trades"),
        api.get<{ runs: EventRuns }>("/events/runs"),
        api.get<{ messages: Message[] }>("/messages"),
        api.get<{ messages: ChatMessage[] }>("/chats"),
        api.get<{ messages: TeacherMessage[] }>("/teacher-messages"),
      ]);
      if (outdated()) return;
      saveStudentAccounts(students);
      setVisibleStudentIds(students.map((s) => s.id));
      saveTeachers(teachers, true);
      saveMissions(missions);
      saveShopItems(items);
      saveFriendLinks(friendships);
      saveOffers([...offers.received, ...offers.sent]);
      saveTrades([...trades.received, ...trades.sent]);
      saveEventRuns(runs);
      forgetMessages(); // num computador compartilhado, só ficam as mensagens de quem está logado
      saveMessagesOf(me.student.id, inbox.messages);
      saveChatMessages(chats.messages);
      saveTeacherMessages(sent.messages);
      return;
    }

    // Ninguém logado: limpa o espelho da sessão e só busca a lista pública de
    // professores (a tela de cadastro do aluno precisa dela).
    setTeacherSessionId(null);
    setActiveStudentId(null);
    forgetStudentSocial();
    saveEventRuns({});
    forgetMessages();
    saveTeacherMessages([]);
    const { teachers } = await api.get<{ teachers: Teacher[] }>("/teachers");
    if (outdated()) return;
    saveTeachers(teachers, true);
  } catch (error) {
    console.warn("[accounts] não deu pra atualizar as contas:", describeError(error));
  }
}

/** Amizades, ofertas e trocas só existem pro aluno logado: sem aluno, o cache fica vazio. */
function forgetStudentSocial() {
  saveFriendLinks([]);
  saveOffers([]);
  saveTrades([]);
  saveChatMessages([]);
}

// Quando a pessoa volta pra aba (depois de usar outro programa ou outra aba),
// o site confere de novo com a API: um aluno novo aparece pro professor, uma
// sessão encerrada em outro lugar sai daqui.
if (typeof window !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void refreshFromApi();
  });
}

// ---------------------------------------------------------------------------
// Login, cadastro e saída
// ---------------------------------------------------------------------------

/** Login do aluno. Um login novo encerra qualquer outra sessão deste navegador (a API só guarda uma). */
export async function studentLogin(username: string, password: string): Promise<LoginResult> {
  try {
    const { student } = await api.post<{ student: StudentAccount }>("/auth/students/login", { username, password });
    markSessionChanged();
    saveStudentAccounts([student]);
    setTeacherSessionId(null);
    setActiveStudentId(student.id);
    emitChange();
    void refreshFromApi(true);
    return { ok: true, student: getStudent(student.id)! };
  } catch (error) {
    return { ok: false, error: describeError(error) };
  }
}

export interface SignUpData {
  name: string;
  email: string;
  turma: string;
  username: string;
  password: string;
  teacherId: string;
}

/** Cadastro do aluno: a API cria a conta (já com o presente de boas-vindas) e deixa ele logado. */
export async function studentSignUp(data: SignUpData): Promise<LoginResult> {
  try {
    const { student } = await api.post<{ student: StudentAccount }>("/students", data);
    markSessionChanged();
    saveStudentAccounts([student]);
    setTeacherSessionId(null);
    setActiveStudentId(student.id);
    emitChange();
    void refreshFromApi(true);
    return { ok: true, student: getStudent(student.id)! };
  } catch (error) {
    return { ok: false, error: describeError(error) };
  }
}

/**
 * Login do professor. Com `adminOnly` (login do Painel ADM), uma conta de
 * professor comum é recusada e a sessão que a API abriu é fechada na hora.
 */
export async function teacherLogin(email: string, password: string, adminOnly = false): Promise<TeacherLoginResult> {
  try {
    const { teacher } = await api.post<{ teacher: Teacher }>("/auth/teachers/login", { email, password });
    markSessionChanged();
    if (adminOnly && !teacher.isAdmin) {
      // o login abriu uma sessão (e fechou a que existia): fecha essa também
      setTeacherSessionId(null);
      setActiveStudentId(null);
      emitChange();
      await api.post("/auth/logout").catch(() => undefined);
      return { ok: false, error: "Essa conta de professor não tem acesso ao Painel ADM." };
    }
    saveTeachers([teacher], false);
    setActiveStudentId(null);
    setTeacherSessionId(teacher.id);
    emitChange();
    void refreshFromApi(true);
    return { ok: true, teacher };
  } catch (error) {
    return { ok: false, error: describeError(error) };
  }
}

/** Sai da conta (aluno ou professor). A tela já muda na hora; a API é avisada em seguida. */
export async function logout() {
  markSessionChanged();
  setActiveStudentId(null);
  setTeacherSessionId(null);
  emitChange();
  await api.post("/auth/logout").catch(() => undefined);
}

// ---------------------------------------------------------------------------
// Perfil do próprio aluno
// ---------------------------------------------------------------------------

/** Campos do perfil que o próprio aluno muda (os outros campos do Student são progresso do jogo, locais). */
const OWN_PROFILE_KEYS = ["avatar", "houseId", "onboardingStep", "tutorialDone"] as const;

/**
 * Chamado pelo patchActive do store.ts depois de salvar no cache: se o patch
 * mudou algum campo do perfil, manda a mudança pra API em segundo plano.
 * O cache já foi atualizado, então a tela não espera a rede.
 */
export function syncOwnProfile(before: Student, patch: Partial<Student>) {
  const changes: Record<string, unknown> = {};
  for (const key of OWN_PROFILE_KEYS) {
    if (!(key in patch)) continue;
    if (JSON.stringify(patch[key]) !== JSON.stringify(before[key])) changes[key] = patch[key];
  }
  if (Object.keys(changes).length === 0) return;

  api
    .put<{ student: StudentAccount }>(`/students/${before.id}`, changes)
    .then(({ student }) => {
      saveStudentAccounts([student]);
      emitChange();
    })
    .catch((error) => console.warn("[accounts] não deu pra salvar o perfil na API:", describeError(error)));
}

// ---------------------------------------------------------------------------
// Alunos, pelo professor ou pelo ADM
// ---------------------------------------------------------------------------

export interface StudentAccountPatch {
  name?: string;
  email?: string;
  turma?: string;
  username?: string;
  houseId?: HouseId;
  teacherId?: string; // só o ADM
}

/** Altera a conta de um aluno. Devolve a mensagem de erro da API, ou null se salvou. */
export async function updateStudentAccount(id: string, patch: StudentAccountPatch): Promise<string | null> {
  try {
    const { student } = await api.put<{ student: StudentAccount }>(`/students/${id}`, patch);
    saveStudentAccounts([student]);
    emitChange();
    return null;
  } catch (error) {
    return describeError(error);
  }
}

/** Define uma senha nova pro aluno (a antiga não aparece pra ninguém). Devolve o erro, ou null. */
export async function setStudentPassword(id: string, password: string): Promise<string | null> {
  try {
    await api.put(`/students/${id}/password`, { password });
    updateStudent(id, { hasPassword: true });
    emitChange();
    return null;
  } catch (error) {
    return describeError(error);
  }
}

/** Exclui a conta do aluno na API e tira ele do cache. Quem chama limpa o resto (mensagens, trocas...). */
export async function deleteStudentAccount(id: string): Promise<string | null> {
  try {
    await api.delete(`/students/${id}`);
    removeStudent(id);
    return null;
  } catch (error) {
    return describeError(error);
  }
}

// ---------------------------------------------------------------------------
// Professores (Painel ADM) e o tutorial do professor
// ---------------------------------------------------------------------------

export interface TeacherData {
  name: string;
  email: string;
  password: string; // na edição, "" = continua a mesma
}

export async function createTeacherAccount(data: TeacherData): Promise<string | null> {
  try {
    const { teacher } = await api.post<{ teacher: Teacher }>("/teachers", data);
    saveTeachers([teacher], false);
    emitChange();
    return null;
  } catch (error) {
    return describeError(error);
  }
}

export async function updateTeacherAccount(id: string, data: TeacherData): Promise<string | null> {
  try {
    const { teacher } = await api.put<{ teacher: Teacher }>(`/teachers/${id}`, {
      name: data.name,
      email: data.email,
      ...(data.password && { password: data.password }),
    });
    saveTeachers([teacher], false);
    emitChange();
    return null;
  } catch (error) {
    return describeError(error);
  }
}

/** Exclui o professor; os alunos dele passam pro herdeiro (na API e no cache). */
export async function deleteTeacherAccount(id: string, heirId: string): Promise<string | null> {
  try {
    await api.delete(`/teachers/${id}?heirId=${encodeURIComponent(heirId)}`);
    reassignStudents(id, heirId);
    forgetTeacher(id);
    return null;
  } catch (error) {
    return describeError(error);
  }
}

/** O professor terminou (ou pulou) o tutorial do painel. A tela não espera a API. */
export function finishTeacherTutorial(id: string) {
  const teacher = getTeacher(id);
  if (teacher) saveTeachers([{ ...teacher, tutorialDone: true }], false);
  emitChange();
  api.put(`/teachers/${id}`, { tutorialDone: true }).catch((error) => console.warn("[accounts] não deu pra salvar o tutorial:", describeError(error)));
}
