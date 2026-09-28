// ============================================================================
// STUDENTS — alunos, avatar, progressão (XP/nível/moedas) e inventário.
//
// Desde a ligação com o back end (pasta api/), a CONTA do aluno é da API:
// cadastro, login, senha e o perfil (nome, e-mail, turma, login, professor,
// casa, avatar e etapa do primeiro acesso). Quem fala com a API é o
// engine/accounts.ts. Aqui o localStorage ("cg-students") guarda:
//   - uma cópia do perfil que a API devolveu (cache, pras telas lerem na hora);
//   - o PROGRESSO DO JOGO (nível, XP, moedas, inventário, missões feitas,
//     visuais equipados...), que por enquanto continua neste navegador e vai
//     pro servidor nas próximas fases do back end.
// Vários alunos podem estar no mesmo navegador, com um "aluno ativo" por vez
// (o id dele fica no sessionStorage, espelhando o cookie de login da API).
// A senha nunca fica no site: o aluno só tem o hasPassword (true/false).
// ============================================================================

import { HouseId, getHouse } from "./houses";
import { Mission, Rarity, DEFAULT_ITEM_ICON, ITEM_DESCRIPTION_MAX_LENGTH, normalizeRewardItem, normalizeSearch } from "./missions";
import { AvatarConfig, Cosmetic, CosmeticSlot, applyCosmetic, normalizeAvatar, sameCosmetic } from "./avatar";

export interface InventoryItem {
  id: string;
  name: string;
  icon: string; // emoji do item (itens antigos ganham o da raridade na leitura)
  description: string; // "" = item antigo, sem descrição
  cosmetic?: Cosmetic; // item de visual do avatar (vem da Loja) — pode ser equipado
  slots?: number; // item de espaço (criado pelo ADM na Loja): usar aumenta o inventário em tantos espaços
  multiverse?: boolean; // Chave do Multiverso: usar abre a Sala do Multiverso uma vez (engine/multiverse.ts)
  rarity: Rarity;
  value: number; // moedas que o sistema paga por ele
  xp: number; // XP ao usar; 0 = não é consumível
  obtainedAt: string;
}

export type OnboardingStep = "casa" | "avatar" | "completo";

/** Progresso do aluno num evento especial (engine/specialEvents.ts). */
export interface EventProgress {
  introSeenAt?: string; // já viu a cena de abertura
  finishedAt?: string; // já viu a cena final e ganhou a recompensa
}

export interface Student {
  id: string;
  name: string;
  email: string;
  turma: string;
  username: string; // login, sempre minúsculo e sem espaços ("" nos colegas: a API não manda)
  hasPassword: boolean; // false = conta ainda sem senha (o professor define); a senha em si fica só na API
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
  equipped: Partial<Record<CosmeticSlot, string>>; // espaço do avatar -> id do item de visual equipado
  events: Record<string, EventProgress>; // id do evento -> progresso
  bonusSlots: number; // espaços extras no inventário, ganhos usando itens de espaço (além dos BASE_INVENTORY_SLOTS)
  pendingItems: InventoryItem[]; // itens ganhos com o inventário cheio, esperando espaço (nada se perde)
  multiverseAccess?: string; // usou uma Chave do Multiverso e ainda não entrou na sala (o passe é gasto ao entrar)
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
const VISIBLE_KEY = "cg-visible-students";

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
    return (
      (JSON.parse(raw) as Student[])
        // alunos criados antes do back end (ids "s_...") não têm conta na API
        .filter((s) => !s.id.startsWith("s_"))
        .map((s) => ({
          ...s,
          hasPassword: s.hasPassword ?? false,
          avatar: normalizeAvatar(s.avatar ?? {}),
          equipped: s.equipped ?? {},
          events: s.events ?? {},
          bonusSlots: s.bonusSlots ?? 0,
          pendingItems: (s.pendingItems ?? []).map((i) => ({ ...i, ...normalizeRewardItem(i) })),
          // itens de antes do mercado ganham valor pela raridade e não são consumíveis;
          // itens de antes do ícone próprio ficam com o ícone da raridade
          inventory: (s.inventory ?? []).map((i) => ({ ...i, ...normalizeRewardItem(i) })),
        }))
    );
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

/**
 * Quais alunos as telas podem mostrar: os que a API devolveu na última
 * consulta (os do professor, ou a comunidade toda pro aluno). O cache pode ter
 * mais gente (outros alunos que já usaram este navegador), mas só esses aparecem.
 */
function visibleIds(): Set<string> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(VISIBLE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : null;
  } catch {
    return null;
  }
}

export function setVisibleStudentIds(ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(VISIBLE_KEY, JSON.stringify(ids));
}

export function listStudents(): Student[] {
  const visible = visibleIds();
  const activeId = getActiveStudentId();
  return readAll()
    .filter((s) => !visible || visible.has(s.id) || s.id === activeId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function getStudent(id: string): Student | undefined {
  return readAll().find((s) => s.id === id);
}

// ============================================================================
// CONTAS VINDAS DA API — o engine/accounts.ts chama estas funções pra guardar
// no cache o que a API devolveu. O perfil sempre vem da API; o progresso do
// jogo de quem já está no cache é mantido.
// ============================================================================

/** Um aluno como a API manda (a comunidade manda só os dados públicos, sem e-mail, turma e login). */
export interface StudentAccount {
  id: string;
  teacherId: string;
  name: string;
  houseId: HouseId | null;
  avatar: unknown;
  onboardingStep: OnboardingStep;
  createdAt: string;
  level?: number;
  xp?: number;
  coins?: number;
  email?: string;
  turma?: string;
  username?: string;
  tutorialDone?: boolean;
  hasPassword?: boolean;
}

/** Presente de boas-vindas que todo aluno ganha ao criar a conta. */
export function welcomeItem(): InventoryItem {
  return {
    id: `i_${Date.now()}`,
    name: "Fragmento Inicial",
    icon: "✨",
    description: "Presente de boas-vindas da Academia. Usar dá um pouco de XP pra começar a jornada.",
    rarity: "comum",
    value: 5,
    xp: 20,
    obtainedAt: new Date().toISOString(),
  };
}

/** Progresso inicial de um aluno que ainda não tinha nada neste navegador. */
type LocalProgress = Pick<Student, "level" | "xp" | "coins" | "inventory" | "completedMissionIds" | "equipped" | "events" | "bonusSlots" | "pendingItems">;

function newLocalProgress(account: StudentAccount): LocalProgress {
  return {
    level: account.level ?? 1,
    xp: account.xp ?? 0,
    coins: account.coins ?? 0,
    inventory: [],
    completedMissionIds: [],
    equipped: {},
    events: {},
    bonusSlots: 0,
    pendingItems: [],
  };
}

/**
 * Guarda no cache os alunos que a API devolveu. Quem já estava no cache
 * mantém o progresso do jogo (e os dados que a API não mandou, como o e-mail
 * de um colega); quem é novo começa do zero. `withWelcomeItem` dá o presente
 * de boas-vindas (só no cadastro).
 */
export function saveStudentAccounts(accounts: StudentAccount[], withWelcomeItem = false) {
  const byId = new Map(readAll().map((s) => [s.id, s]));
  for (const account of accounts) {
    const old = byId.get(account.id);
    const progress = old ?? { ...newLocalProgress(account), ...(withWelcomeItem && { inventory: [welcomeItem()] }) };
    byId.set(account.id, {
      ...(old ?? {}),
      ...progress,
      id: account.id,
      teacherId: account.teacherId,
      name: account.name,
      houseId: account.houseId,
      avatar: normalizeAvatar((account.avatar ?? {}) as Partial<AvatarConfig>),
      onboardingStep: account.onboardingStep,
      createdAt: account.createdAt,
      email: account.email ?? old?.email ?? "",
      turma: account.turma ?? old?.turma ?? "",
      username: account.username ?? old?.username ?? "",
      tutorialDone: account.tutorialDone ?? old?.tutorialDone,
      hasPassword: account.hasPassword ?? old?.hasPassword ?? false,
    } as Student);
  }
  writeAll([...byId.values()]);
}

export const MIN_USERNAME_LENGTH = 3;
export const MIN_PASSWORD_LENGTH = 4;

/** Confere o formato do login. Se ele já está em uso, quem diz é a API. Devolve a mensagem de erro, ou null. */
export function validateUsername(username: string): string | null {
  const login = normalizeUsername(username);
  if (login.length < MIN_USERNAME_LENGTH) return `O login precisa ter pelo menos ${MIN_USERNAME_LENGTH} caracteres (letras, números, ponto, hífen ou _).`;
  return null;
}

/**
 * Confere login e senha antes de mandar pra API (cadastro e troca pelo
 * professor). Com `passwordOptional`, senha em branco = continua a mesma.
 * Devolve a mensagem de erro pra mostrar na tela, ou null se estiver tudo certo.
 */
export function validateCredentials(username: string, password: string, passwordOptional = false): string | null {
  const usernameError = validateUsername(username);
  if (usernameError) return usernameError;
  if (passwordOptional && !password) return null;
  if (password.length < MIN_PASSWORD_LENGTH) return `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  return null;
}

export interface StudentProfile {
  name: string;
  email: string;
  turma: string;
}

/** Valida nome, e-mail e turma (edição pelo professor/ADM). Devolve a mensagem de erro, ou null. */
export function validateStudentProfile(data: StudentProfile): string | null {
  if (!data.name.trim()) return "Informe o nome do aluno.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) return "Informe um e-mail válido.";
  if (!data.turma.trim()) return "Informe a turma do aluno.";
  return null;
}

export type LoginResult = { ok: true; student: Student } | { ok: false; error: string };

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

/** Passa todos os alunos de um professor para outro (espelha no cache o que a API fez ao excluir um professor). */
export function reassignStudents(fromTeacherId: string, toTeacherId: string) {
  writeAll(readAll().map((s) => (s.teacherId === fromTeacherId ? { ...s, teacherId: toTeacherId } : s)));
}

// ============================================================================
// BUSCA — o professor procura aluno pelo nome, pelo nível ("Nv 3", "nível 3"
// ou só "3") ou pela casa ("ignis", "Casa Noctis"). Ignora maiúsculas e acentos.
// ============================================================================

export function matchesStudentSearch(student: Student, query: string): boolean {
  const q = normalizeSearch(query);
  if (!q) return true;
  const levelQuery = q.match(/^(?:nv|nivel|level|lv)?\.?\s*(\d+)$/);
  if (levelQuery && student.level === Number(levelQuery[1])) return true;
  const fields = [student.name, student.username, student.houseId ? getHouse(student.houseId).name : ""];
  return fields.some((f) => normalizeSearch(f).includes(q));
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

// ============================================================================
// ESPAÇO NO INVENTÁRIO — todo aluno começa com BASE_INVENTORY_SLOTS espaços e
// ganha mais usando itens de espaço (criados pelo ADM na Loja, com quantos
// espaços cada um dá). O que o aluno ganha sem ter pedido (recompensa de
// missão e de evento, presente, item devolvido de troca/oferta) nunca se
// perde: se não couber, fica em pendingItems ("esperando espaço") até ele
// liberar espaço. O que ele escolhe pegar (comprar, aceitar oferta ou troca)
// é bloqueado quando não cabe.
// ============================================================================

export const BASE_INVENTORY_SLOTS = 20;

export function inventoryCapacity(student: Student): number {
  return BASE_INVENTORY_SLOTS + (student.bonusSlots ?? 0);
}

export function freeSlots(student: Student): number {
  return Math.max(0, inventoryCapacity(student) - student.inventory.length);
}

/** Mensagem de inventário cheio pra quem tenta pegar mais itens do que cabe. */
export function inventoryFullError(student: Student, needed = 1): string {
  const cap = inventoryCapacity(student);
  return needed <= 1
    ? `Seu inventário está cheio (${student.inventory.length}/${cap}). Use um item de espaço, venda ou descarte itens pra liberar espaço.`
    : `Não cabe no seu inventário: você precisa de ${needed} espaços livres e tem ${freeSlots(student)} (${student.inventory.length}/${cap}). Libere espaço e tente de novo.`;
}

/** Guarda itens no inventário; o que não couber vai pra "esperando espaço" (nada se perde). */
export function storeItems(student: Student, items: InventoryItem[]): Student {
  const fits = items.slice(0, freeSlots(student));
  const rest = items.slice(fits.length);
  return { ...student, inventory: [...student.inventory, ...fits], pendingItems: [...(student.pendingItems ?? []), ...rest] };
}

/** Passa pro inventário os itens que estavam esperando espaço (todos que couberem, ou só um pelo id). */
export function claimPendingItems(student: Student, itemId?: string): Student {
  const pending = student.pendingItems ?? [];
  const wanted = itemId ? pending.filter((i) => i.id === itemId) : pending;
  const moving = wanted.slice(0, freeSlots(student));
  if (moving.length === 0) return student;
  const ids = new Set(moving.map((i) => i.id));
  return { ...student, inventory: [...student.inventory, ...moving], pendingItems: pending.filter((i) => !ids.has(i.id)) };
}

export interface SpaceItemResult {
  student: Student;
  slotsGained: number;
  claimed: number; // itens que estavam esperando e entraram no inventário
}

/** Usa um item de espaço: ele some, o inventário cresce e os itens que esperavam espaço entram (os que couberem). */
export function applySpaceItem(student: Student, itemId: string): SpaceItemResult | null {
  const item = student.inventory.find((i) => i.id === itemId);
  if (!item || !item.slots || item.slots <= 0) return null;
  const grown: Student = { ...removeItem(student, itemId), bonusSlots: (student.bonusSlots ?? 0) + item.slots };
  const claimed = claimPendingItems(grown);
  return { student: claimed, slotsGained: item.slots, claimed: claimed.inventory.length - grown.inventory.length };
}

/** Dá um item ao aluno (nome vazio vira "Item Misterioso", igual ao editor de missões). Sem espaço, ele fica esperando espaço. */
export function grantItem(
  student: Student,
  item: { name: string; icon: string; description: string; rarity: Rarity; value: number; xp: number; cosmetic?: Cosmetic; slots?: number; multiverse?: boolean },
): Student {
  const newItem: InventoryItem = {
    // item da Loja doado pelo ADM: se for visual, o aluno pode equipar (e visual não é consumível)
    ...(item.cosmetic && { cosmetic: item.cosmetic }),
    // item de espaço doado pelo ADM: usar aumenta o inventário (e não dá XP)
    ...(item.slots && item.slots > 0 && { slots: Math.round(item.slots) }),
    // Chave do Multiverso: usar abre a Sala do Multiverso (e não dá XP)
    ...(item.multiverse && { multiverse: true }),
    id: `i_${Date.now()}_${Math.round(Math.random() * 9999)}`,
    name: item.name.trim() || "Item Misterioso",
    icon: item.icon.trim() || DEFAULT_ITEM_ICON,
    description: item.description.trim().slice(0, ITEM_DESCRIPTION_MAX_LENGTH),
    rarity: item.rarity,
    value: Math.max(0, Math.round(item.value)),
    xp: item.cosmetic || item.slots || item.multiverse ? 0 : Math.max(0, Math.round(item.xp)),
    obtainedAt: new Date().toISOString(),
  };
  return storeItems(student, [newItem]);
}

/** Remove um item pelo id — só aquele exemplar, mesmo que o aluno tenha outros com o mesmo nome. */
export function removeItem(student: Student, itemId: string): Student {
  // Item de visual que sai do inventário (vendido, oferecido, excluído) sai do avatar também.
  const equipped = Object.fromEntries(Object.entries(student.equipped).filter(([, id]) => id !== itemId));
  return { ...student, inventory: student.inventory.filter((i) => i.id !== itemId), equipped };
}

// ============================================================================
// VISUAIS DO AVATAR — itens da Loja com `cosmetic` podem ser equipados (um
// por espaço: chapéu, óculos, cor da roupa, aura, mascote). O avatar que o
// aluno montou no editor não muda: o "avatar vestido" é calculado na hora.
// ============================================================================

/** Equipa um item de visual — se já havia outro no mesmo espaço, ele é trocado. */
export function equipItem(student: Student, itemId: string): Student {
  const item = student.inventory.find((i) => i.id === itemId);
  if (!item?.cosmetic) return student;
  return { ...student, equipped: { ...student.equipped, [item.cosmetic.slot]: itemId } };
}

export function unequipItem(student: Student, itemId: string): Student {
  return { ...student, equipped: Object.fromEntries(Object.entries(student.equipped).filter(([, id]) => id !== itemId)) };
}

export function isEquipped(student: Student, itemId: string): boolean {
  return Object.values(student.equipped).includes(itemId);
}

/** O aluno já tem esse visual no inventário? (a Loja não deixa comprar duas vezes) */
export function ownsCosmetic(student: Student, cosmetic: Cosmetic): boolean {
  return student.inventory.some((i) => sameCosmetic(i.cosmetic, cosmetic));
}

/** O avatar como aparece pra todo mundo: o do editor + os visuais equipados. */
export function wornAvatar(student: Student): AvatarConfig {
  let avatar = student.avatar;
  for (const itemId of Object.values(student.equipped)) {
    const cosmetic = student.inventory.find((i) => i.id === itemId)?.cosmetic;
    if (cosmetic) avatar = applyCosmetic(avatar, cosmetic);
  }
  return avatar;
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
    icon: mission.rewardItem.icon,
    description: mission.rewardItem.description,
    rarity: mission.rewardItem.rarity,
    value: mission.rewardItem.value,
    xp: mission.rewardItem.cosmetic || mission.rewardItem.slots || mission.rewardItem.multiverse ? 0 : mission.rewardItem.xp,
    // recompensa que é item de visual da Loja: o aluno pode equipar
    ...(mission.rewardItem.cosmetic && { cosmetic: mission.rewardItem.cosmetic }),
    // recompensa que é item de espaço da Loja: usar aumenta o inventário
    ...(mission.rewardItem.slots && { slots: mission.rewardItem.slots }),
    // recompensa que é Chave do Multiverso: usar abre a Sala do Multiverso
    ...(mission.rewardItem.multiverse && { multiverse: true }),
    obtainedAt: new Date().toISOString(),
  };

  // sem espaço, o item fica esperando espaço (a recompensa nunca se perde)
  const updated: Student = {
    ...storeItems(student, [newItem]),
    level,
    xp,
    coins: student.coins + mission.rewardCoins,
    completedMissionIds: student.completedMissionIds.includes(mission.id)
      ? student.completedMissionIds
      : [...student.completedMissionIds, mission.id],
  };

  return { student: updated, leveledUp, newLevel: level };
}
