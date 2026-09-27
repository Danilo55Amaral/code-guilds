// ============================================================================
// ENTREGAS — as respostas dos alunos às missões de entrega (resposta aberta
// e/ou arquivos). Mesmo padrão de CRUD em localStorage dos outros engines; os
// arquivos em si ficam no IndexedDB (engine/fileStore.ts).
//
// O aluno envia → a entrega fica "pendente" até o professor (ou o ADM)
// corrigir. Aprovada: o aluno ganha a recompensa da missão (XP, moedas e item)
// e a missão conta como concluída. "Refazer": o aluno recebe o comentário e
// pode enviar de novo (cada envio é uma tentativa nova, com o histórico).
// ============================================================================

import { Mission, SUBMISSION_FILE_TYPES, SubmissionFileKind, fileKindOf, isTaskMission } from "./missions";
import { applyMissionReward, getStudent, updateStudent } from "./students";
import { PENDING_ITEM_NOTE, SYSTEM_SENDER_ID, missionRewardMessage, sendMessage, taskApprovedNote, taskRedoMessage } from "./messages";
import { deleteFiles, saveFile } from "./fileStore";

export type SubmissionStatus = "pendente" | "aprovada" | "refazer";

export const SUBMISSION_STATUS_META: Record<SubmissionStatus, { label: string; className: string }> = {
  pendente: { label: "⏳ Aguardando correção", className: "border-amber-400/50 bg-amber-400/10 text-amber-200" },
  aprovada: { label: "✅ Aprovada", className: "border-emerald-400/50 bg-emerald-500/10 text-emerald-200" },
  refazer: { label: "↩ Refazer", className: "border-rose-400/50 bg-rose-500/10 text-rose-200" },
};

export interface SubmissionFile {
  id: string; // chave do arquivo no IndexedDB
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
  reviewedAt?: string;
  reviewerName?: string;
  feedback?: string;
}

export type SubmissionResult = { ok: true } | { ok: false; error: string };

/** Limites de uma entrega. */
export const SUBMISSION_TEXT_MAX = 5000;
export const SUBMISSION_MAX_FILES = 5;
export const SUBMISSION_MAX_FILE_MB = 25;
export const FEEDBACK_MAX = 1000;

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

/** Confere se os arquivos escolhidos servem pra essa missão (tipo, tamanho e quantidade). Devolve o erro, ou null. */
export function checkFiles(mission: Mission, files: File[]): string | null {
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
    if (f.size > SUBMISSION_MAX_FILE_MB * 1024 * 1024) return `"${f.name}" passa de ${SUBMISSION_MAX_FILE_MB} MB.`;
  }
  return null;
}

/** O aluno envia a entrega: guarda os arquivos e deixa a entrega esperando a correção. */
export async function submitTask(data: { mission: Mission; studentId: string; text: string; files: File[] }): Promise<SubmissionResult> {
  const { mission } = data;
  const task = mission.task;
  if (!isTaskMission(mission) || !task) return { ok: false, error: "Esta missão não é de entrega." };
  const student = getStudent(data.studentId);
  if (!student) return { ok: false, error: "Aluno não encontrado." };
  if (student.completedMissionIds.includes(mission.id)) return { ok: false, error: "Você já concluiu esta missão." };
  const current = latestSubmissionIn(readAll(), student.id, mission.id);
  if (current?.status === "pendente") return { ok: false, error: "Sua entrega já está com o professor, esperando a correção." };

  const text = task.allowText ? data.text.trim().slice(0, SUBMISSION_TEXT_MAX) : "";
  const files = task.allowFiles ? data.files : [];
  if (!text && files.length === 0) {
    return { ok: false, error: task.allowText && task.allowFiles ? "Escreva a resposta ou envie um arquivo." : task.allowText ? "Escreva a sua resposta." : "Escolha o arquivo pra enviar." };
  }
  const fileError = checkFiles(mission, files);
  if (fileError) return { ok: false, error: fileError };

  const stamp = `${Date.now()}_${Math.round(Math.random() * 9999)}`;
  const saved: SubmissionFile[] = [];
  try {
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const id = `arq_${stamp}_${i}`;
      await saveFile(id, f);
      saved.push({ id, name: f.name, size: f.size, kind: fileKindOf(f.name)! });
    }
  } catch {
    await deleteFiles(saved.map((f) => f.id)).catch(() => {});
    return { ok: false, error: "Não foi possível guardar os arquivos neste navegador. Tente um arquivo menor." };
  }

  writeAll([
    ...readAll(),
    {
      id: `ent_${stamp}`,
      missionId: mission.id,
      studentId: student.id,
      teacherId: mission.teacherId,
      text,
      files: saved,
      status: "pendente",
      attempt: (current?.attempt ?? 0) + 1,
      submittedAt: new Date().toISOString(),
    },
  ]);
  return { ok: true };
}

/**
 * O professor (ou o ADM) corrige: aprovar dá a recompensa da missão ao aluno;
 * "refazer" devolve com o comentário (obrigatório) pro aluno tentar de novo.
 */
export function reviewSubmission(
  submissionId: string,
  decision: "aprovada" | "refazer",
  feedback: string,
  mission: Mission,
  reviewerName: string,
): SubmissionResult {
  const submission = readAll().find((s) => s.id === submissionId);
  if (!submission) return { ok: false, error: "Essa entrega não existe mais." };
  if (submission.status !== "pendente") return { ok: false, error: "Essa entrega já foi corrigida." };
  const comment = feedback.trim().slice(0, FEEDBACK_MAX);
  if (decision === "refazer" && !comment) return { ok: false, error: "Escreva um comentário dizendo o que o aluno precisa melhorar." };
  const student = getStudent(submission.studentId);
  if (!student) return { ok: false, error: "Aluno não encontrado." };

  writeAll(
    readAll().map((s) =>
      s.id === submissionId ? { ...s, status: decision, feedback: comment || undefined, reviewedAt: new Date().toISOString(), reviewerName } : s,
    ),
  );

  if (decision === "aprovada") {
    if (!student.completedMissionIds.includes(mission.id)) {
      const { student: rewarded } = applyMissionReward(student, mission);
      updateStudent(student.id, {
        level: rewarded.level,
        xp: rewarded.xp,
        coins: rewarded.coins,
        inventory: rewarded.inventory,
        pendingItems: rewarded.pendingItems,
        completedMissionIds: rewarded.completedMissionIds,
      });
      const waiting = rewarded.pendingItems.length > student.pendingItems.length;
      sendMessage({
        studentId: student.id,
        senderId: SYSTEM_SENDER_ID,
        kind: "missao",
        body:
          missionRewardMessage({ mission, item: mission.rewardItem, xp: mission.rewardXp, coins: mission.rewardCoins }) +
          taskApprovedNote({ reviewerName, feedback: comment }) +
          (waiting ? PENDING_ITEM_NOTE : ""),
      });
    }
  } else {
    sendMessage({
      studentId: student.id,
      senderId: SYSTEM_SENDER_ID,
      kind: "entrega",
      body: taskRedoMessage({ mission, reviewerName, feedback: comment }),
    });
  }
  return { ok: true };
}

function removeWhere(match: (s: Submission) => boolean) {
  const all = readAll();
  const gone = all.filter(match);
  if (gone.length === 0) return;
  writeAll(all.filter((s) => !match(s)));
  deleteFiles(gone.flatMap((s) => s.files.map((f) => f.id))).catch(() => {});
}

/** Aluno excluído: as entregas (e os arquivos) dele somem junto. */
export function deleteSubmissionsOf(studentId: string) {
  removeWhere((s) => s.studentId === studentId);
}

/** Missão excluída: as entregas (e os arquivos) dela somem junto. */
export function deleteSubmissionsOfMission(missionId: string) {
  removeWhere((s) => s.missionId === missionId);
}
