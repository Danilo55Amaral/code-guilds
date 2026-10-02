// ============================================================================
// ENTREGAS — as respostas dos alunos às missões de entrega (resposta aberta
// e/ou arquivos: PDF, Word, Scratch, App Inventor, Roblox Studio).
//
// O aluno envia → a entrega fica "pendente" até o professor (ou o ADM)
// corrigir. Aprovada: o aluno ganha a recompensa da missão (XP, moedas e item)
// e a missão conta como concluída. "Refazer": o aluno recebe o comentário e
// pode enviar de novo (cada envio é uma tentativa nova, com o histórico).
//
// Desde a fase 5 do back end, as entregas ficam na API (tabelas submissions e
// submission_files) e os arquivos no storage (Supabase Storage em produção).
// Aqui ficam os limites e as regras (a API usa as mesmas: este arquivo não
// pode importar nada com "@/") e o cache ("cg-submissions"): o aluno tem as
// dele, o professor as dos alunos dele. Enviar, baixar e corrigir ficam em
// engine/submissionsApi.ts.
// ============================================================================

import { Mission, SUBMISSION_FILE_TYPES, SubmissionFileKind, fileKindOf, isTaskMission } from "./missions";

export type SubmissionStatus = "pendente" | "aprovada" | "refazer";

export const SUBMISSION_STATUS_META: Record<SubmissionStatus, { label: string; className: string }> = {
  pendente: { label: "⏳ Aguardando correção", className: "border-amber-400/50 bg-amber-400/10 text-amber-200" },
  aprovada: { label: "✅ Aprovada", className: "border-emerald-400/50 bg-emerald-500/10 text-emerald-200" },
  refazer: { label: "↩ Refazer", className: "border-rose-400/50 bg-rose-500/10 text-rose-200" },
};

export interface SubmissionFile {
  id: string; // id do arquivo na API (o download é /submissions/files/<id>)
  name: string;
  size: number;
  kind: SubmissionFileKind;
}

export interface Submission {
  id: string;
  missionId: string;
  studentId: string;
  teacherId: string; // professor dono da missão (quem corrige)
  text: string;
  files: SubmissionFile[];
  status: SubmissionStatus;
  attempt: number; // 1ª, 2ª... tentativa
  submittedAt: string;
  reviewedAt?: string | null;
  reviewerName?: string | null;
  feedback?: string | null;
}

export type SubmissionResult = { ok: true } | { ok: false; error: string };

/** Limites de uma entrega (a API confere os mesmos). */
export const SUBMISSION_TEXT_MAX = 5000;
export const SUBMISSION_MAX_FILES = 5;
export const SUBMISSION_MAX_FILE_MB = 25;
export const FEEDBACK_MAX = 1000;

// ---------------------------------------------------------------------------
// Regras (usadas pela tela antes de enviar e pela API na hora de receber)
// ---------------------------------------------------------------------------

/** Confere se os arquivos escolhidos servem pra essa missão (tipo, tamanho e quantidade). Devolve o erro, ou null. */
export function checkFiles(mission: Mission, files: { name: string; size: number }[]): string | null {
  const task = mission.task;
  if (files.length === 0) return null;
  if (!task?.allowFiles) return "Esta missão não aceita arquivos.";
  if (files.length > SUBMISSION_MAX_FILES) return `No máximo ${SUBMISSION_MAX_FILES} arquivos por entrega.`;
  for (const f of files) {
    const kind = fileKindOf(f.name);
    if (!kind || !task.fileKinds.includes(kind)) {
      const allowed = task.fileKinds.map((k) => SUBMISSION_FILE_TYPES[k].extensions.join(", ")).join(", ");
      return `"${f.name}" não é de um tipo aceito nesta missão (${allowed}).`;
    }
    if (f.size <= 0) return `"${f.name}" está vazio.`;
    if (f.size > SUBMISSION_MAX_FILE_MB * 1024 * 1024) return `"${f.name}" passa de ${SUBMISSION_MAX_FILE_MB} MB.`;
  }
  return null;
}

/**
 * Confere se o aluno pode enviar essa entrega agora: a missão é de entrega,
 * ainda não foi concluída, não tem outra entrega esperando correção e veio o
 * que a missão pede (texto e/ou arquivos válidos). Devolve o erro, ou null.
 * `latest` = a entrega mais recente do aluno nessa missão.
 */
export function checkSubmission(
  mission: Mission,
  data: { completedMissionIds: string[]; latest: { status: string } | undefined; text: string; files: { name: string; size: number }[] },
): string | null {
  const task = mission.task;
  if (!isTaskMission(mission) || !task) return "Esta missão não é de entrega.";
  if (data.completedMissionIds.includes(mission.id)) return "Você já concluiu esta missão.";
  if (data.latest?.status === "pendente") return "Sua entrega já está com o professor, esperando a correção.";
  const text = task.allowText ? data.text.trim() : "";
  const files = task.allowFiles ? data.files : [];
  if (!task.allowText && data.text.trim()) return "Esta missão não aceita resposta escrita.";
  if (!text && files.length === 0) {
    return task.allowText && task.allowFiles ? "Escreva a resposta ou envie um arquivo." : task.allowText ? "Escreva a sua resposta." : "Escolha o arquivo pra enviar.";
  }
  if (text.length > SUBMISSION_TEXT_MAX) return `A resposta passa de ${SUBMISSION_TEXT_MAX} caracteres.`;
  return checkFiles(mission, data.files);
}

/** A entrega mais recente de um aluno numa missão (é ela que vale), ou undefined. */
export function latestSubmissionIn(all: Submission[], studentId: string, missionId: string): Submission | undefined {
  return all
    .filter((s) => s.studentId === studentId && s.missionId === missionId)
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))[0];
}

/** As tentativas de um aluno numa missão, da mais recente pra mais antiga. */
export function submissionHistoryIn(all: Submission[], studentId: string, missionId: string): Submission[] {
  return all.filter((s) => s.studentId === studentId && s.missionId === missionId).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}

// ---------------------------------------------------------------------------
// Cache das entregas
// ---------------------------------------------------------------------------

const SUBMISSIONS_KEY = "cg-submissions";

function readAll(): Submission[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(SUBMISSIONS_KEY) ?? "[]") as Submission[];
  } catch {
    return [];
  }
}

function writeAll(list: Submission[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(list));
}

export function listSubmissions(): Submission[] {
  return readAll().sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

/** Troca o cache pelas entregas que a API devolveu. */
export function saveSubmissions(list: Submission[]) {
  writeAll(list);
}

/** Uma entrega nova ou alterada (enviada, corrigida) que a API confirmou. */
export function rememberSubmission(submission: Submission) {
  writeAll([...readAll().filter((s) => s.id !== submission.id), submission]);
}

/** Aluno excluído: as entregas dele saem do cache (a API já apagou, com os arquivos). */
export function deleteSubmissionsOf(studentId: string) {
  writeAll(readAll().filter((s) => s.studentId !== studentId));
}

/** Missão excluída: as entregas dela saem do cache (a API já apagou, com os arquivos). */
export function deleteSubmissionsOfMission(missionId: string) {
  writeAll(readAll().filter((s) => s.missionId !== missionId));
}
