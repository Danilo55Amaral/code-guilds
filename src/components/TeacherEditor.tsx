"use client";

import { useState } from "react";
import { Teacher, MIN_TEACHER_PASSWORD_LENGTH } from "@/engine/teachers";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">{children}</label>;
}

/**
 * Cadastro/edição de professor no Painel ADM. Ao excluir, os alunos e as
 * missões do professor passam pra outro professor escolhido aqui.
 */
export default function TeacherEditor({
  existingTeacher,
  teachers,
  studentCount,
  missionCount,
  onSave,
  onDelete,
  onClose,
}: {
  existingTeacher?: Teacher;
  teachers: Teacher[];
  studentCount: number;
  missionCount: number;
  /** Devolve a mensagem de erro, ou null se salvou. */
  onSave: (data: { name: string; email: string; password: string }) => string | null;
  /** Não é passado pro ADM nem num cadastro novo. */
  onDelete?: (heirId: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(existingTeacher?.name ?? "");
  const [email, setEmail] = useState(existingTeacher?.email ?? "");
  const [password, setPassword] = useState(existingTeacher?.password ?? "");
  const [error, setError] = useState<string | null>(null);
  const heirOptions = teachers.filter((t) => t.id !== existingTeacher?.id);
  const [heirId, setHeirId] = useState(heirOptions.find((t) => t.isAdmin)?.id ?? heirOptions[0]?.id ?? "");
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleSave() {
    const problem = onSave({ name, email, password });
    setError(problem);
  }

  const hasData = studentCount > 0 || missionCount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="cg-card flex max-h-[90vh] w-full max-w-lg flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h2 className="text-lg font-bold text-white">{existingTeacher ? "Editar Professor" : "Novo Professor"}</h2>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-4">
            <div>
              <Label>Nome</Label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Ada Lovelace" className="cg-input" />
            </div>
            <div>
              <Label>E-mail (login)</Label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ada@codeguilds.com" className="cg-input" />
            </div>
            <div>
              <Label>Senha</Label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder={`mín. ${MIN_TEACHER_PASSWORD_LENGTH} caracteres`} className="cg-input" />
            </div>
            {existingTeacher?.isAdmin && (
              <p className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-[11px] text-violet-200">
                🛡 Este é o ADM — o mesmo login e senha dão acesso ao Painel ADM. Ele não pode ser excluído.
              </p>
            )}
            {error && <p className="text-xs text-rose-300">{error}</p>}
          </div>

          {onDelete && (
            <div className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/5 p-4">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-rose-300">Excluir professor</p>
              {hasData ? (
                <>
                  <p className="mb-2 text-xs text-slate-300">
                    {studentCount} {studentCount === 1 ? "aluno" : "alunos"} e {missionCount} {missionCount === 1 ? "missão" : "missões"} vão passar para:
                  </p>
                  <select value={heirId} onChange={(e) => setHeirId(e.target.value)} className="cg-input mb-3">
                    {heirOptions.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.email})
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <p className="mb-3 text-xs text-slate-400">Este professor não tem alunos nem missões.</p>
              )}
              <button
                onClick={() => (confirmDelete ? onDelete(heirId) : setConfirmDelete(true))}
                onBlur={() => setConfirmDelete(false)}
                disabled={!heirId}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-30 ${
                  confirmDelete ? "border-rose-400 bg-rose-400/20 text-rose-200" : "border-rose-500/30 bg-rose-500/5 text-rose-300 hover:bg-rose-500/10"
                }`}
              >
                {confirmDelete ? "Confirmar exclusão?" : "🗑 Excluir professor"}
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-800 px-6 py-4">
          <button onClick={onClose} className="cg-btn-secondary !px-4 !py-2 text-sm">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || !email.trim() || !password}
            className="cg-btn-primary !px-4 !py-2 text-sm disabled:cursor-not-allowed disabled:opacity-30"
          >
            {existingTeacher ? "Salvar" : "Cadastrar professor"}
          </button>
        </div>
      </div>
    </div>
  );
}
