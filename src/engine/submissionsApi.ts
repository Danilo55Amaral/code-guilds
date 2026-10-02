// ============================================================================
// SUBMISSIONS API — as entregas pela API (fase 5 do back end).
//
// O envio tem 3 passos, porque os arquivos (até 25 MB) não podem passar pelo
// site na Vercel (ela recusa corpos acima de 4,5 MB):
// 1. a API confere a entrega e devolve pra onde mandar cada arquivo;
// 2. o navegador manda cada arquivo pra lá (direto pro Supabase Storage em
//    produção, ou pra própria API em desenvolvimento);
// 3. a API confere se os arquivos chegaram e a entrega vai pro professor.
// Toda função devolve { ok: true } ou { ok: false, error } com a mensagem da API.
// ============================================================================

import { api, describeError } from "@/services/api";
import { emitChange } from "./events";
import { Mission } from "./missions";
import { StudentAccount, saveStudentAccounts } from "./students";
import { Submission, SubmissionResult, rememberSubmission, saveSubmissions } from "./submissions";

/** Pra onde o navegador manda um arquivo (a API escolhe). */
type UploadTarget =
  | { kind: "api"; path: string } // desenvolvimento: a própria API recebe (PUT com o arquivo cru)
  | { kind: "url"; url: string; headers: Record<string, string> }; // produção: direto pro Supabase (PUT com FormData)

/** Manda um arquivo pro endereço que a API deu. */
async function upload(target: UploadTarget, file: File) {
  const response =
    target.kind === "api"
      ? await fetch(`/api${target.path}`, {
          method: "PUT",
          headers: { "Content-Type": "application/octet-stream" },
          body: file,
          credentials: "same-origin",
        })
      : await fetch(target.url, { method: "PUT", headers: target.headers, body: formDataOf(file) });
  if (!response.ok) throw new Error(`Não foi possível enviar "${file.name}". Confira a internet e tente de novo.`);
}

/** O Supabase recebe o arquivo do mesmo jeito que a biblioteca oficial manda. */
function formDataOf(file: File) {
  const form = new FormData();
  form.append("cacheControl", "3600");
  form.append("", file);
  return form;
}

/** Busca as entregas que a pessoa logada pode ver e atualiza o cache. */
export async function loadSubmissions() {
  const { submissions } = await api.get<{ submissions: Submission[] }>("/submissions");
  saveSubmissions(submissions);
  emitChange();
}

/**
 * O aluno envia a entrega: o texto e os arquivos. Se algum arquivo não
 * subir, nada vai pro professor (a próxima tentativa começa do zero).
 */
export async function submitTask(data: { mission: Mission; text: string; files: File[] }): Promise<SubmissionResult> {
  try {
    const { submission, uploads } = await api.post<{ submission: Submission; uploads: { fileId: string; target: UploadTarget }[] }>("/submissions", {
      missionId: data.mission.id,
      text: data.text,
      files: data.files.map((f) => ({ name: f.name, size: f.size })),
    });

    if (uploads.length === 0) {
      rememberSubmission(submission);
      emitChange();
      return { ok: true };
    }

    // a resposta traz os arquivos na mesma ordem em que foram mandados
    for (let i = 0; i < uploads.length; i++) await upload(uploads[i].target, data.files[i]);

    const confirmed = await api.post<{ submission: Submission }>(`/submissions/${submission.id}/confirm`);
    rememberSubmission(confirmed.submission);
    emitChange();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: describeError(error) };
  }
}

/**
 * O professor (ou o ADM) corrige: aprovar dá a recompensa ao aluno (se ainda
 * não concluiu) e "refazer" devolve com o comentário. A API manda a mensagem.
 */
export async function reviewSubmission(submissionId: string, decision: "aprovada" | "refazer", feedback: string): Promise<SubmissionResult> {
  try {
    const { submission, student } = await api.post<{ submission: Submission; student?: StudentAccount }>(`/submissions/${submissionId}/review`, {
      decision,
      feedback,
    });
    rememberSubmission(submission);
    if (student) saveStudentAccounts([student]);
    emitChange();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: describeError(error) };
  }
}

/**
 * Baixa um arquivo da entrega. A API confere quem pode baixar e manda o
 * arquivo (ou redireciona pra um link do Supabase que vale 1 minuto); o
 * navegador salva com o nome original.
 */
export function downloadSubmissionFile(fileId: string) {
  const a = document.createElement("a");
  a.href = `/api/submissions/files/${fileId}`;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
