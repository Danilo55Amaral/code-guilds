"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStudents, useMissions, useMessages } from "@/engine/store";
import { Mission, Rarity } from "@/engine/missions";
import { grantItem, removeItem, validateCredentials, normalizeUsername } from "@/engine/students";
import { MessageKind } from "@/engine/messages";
import { HOUSES } from "@/engine/houses";
import { CoinIcon, DifficultyBadge } from "@/components/GameUI";
import MissionEditor from "@/components/MissionEditor";
import StudentDetails from "@/components/StudentDetails";

export default function PainelProfessorPage() {
  const router = useRouter();
  const { students, ready, patchStudent, deleteStudent } = useStudents();
  const { missions, ready: missionsReady, addMission, editMission, removeMission } = useMissions();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [editorTarget, setEditorTarget] = useState<Mission | "new" | null>(null);
  // Guarda só o id: o aluno é relido da lista a cada render, então a ficha
  // aberta já mostra o item dado/excluído na hora.
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const { messages: selectedMessages, send: sendMessage } = useMessages(selectedStudentId);

  useEffect(() => {
    setAuthed(window.localStorage.getItem("cg-teacher-auth") === "1");
  }, []);

  useEffect(() => {
    if (authed === false) router.replace("/professor");
  }, [authed, router]);

  if (authed !== true || !ready || !missionsReady) return null;

  function handleSave(data: Omit<Mission, "id">) {
    if (editorTarget && editorTarget !== "new") {
      editMission(editorTarget.id, data);
    } else {
      addMission(data);
    }
    setEditorTarget(null);
  }

  function handleDelete() {
    if (editorTarget && editorTarget !== "new") {
      removeMission(editorTarget.id);
    }
    setEditorTarget(null);
  }

  const selectedStudent = students.find((s) => s.id === selectedStudentId) ?? null;

  function handleGrantItem(item: { name: string; rarity: Rarity; value: number; xp: number }) {
    if (!selectedStudent) return;
    patchStudent(selectedStudent.id, { inventory: grantItem(selectedStudent, item).inventory });
  }

  function handleRemoveItem(itemId: string) {
    if (!selectedStudent) return;
    patchStudent(selectedStudent.id, { inventory: removeItem(selectedStudent, itemId).inventory });
  }

  function handleSendMessage(data: { kind: MessageKind; body: string }) {
    if (!selectedStudent) return;
    sendMessage({ studentId: selectedStudent.id, ...data });
  }

  function handleUpdateCredentials(username: string, password: string): string | null {
    if (!selectedStudent) return null;
    const error = validateCredentials(username, password, selectedStudent.id);
    if (error) return error;
    patchStudent(selectedStudent.id, { username: normalizeUsername(username), password });
    return null;
  }

  function handleDeleteStudent() {
    if (!selectedStudent) return;
    deleteStudent(selectedStudent.id);
    setSelectedStudentId(null);
  }

  function logout() {
    window.localStorage.removeItem("cg-teacher-auth");
    router.push("/professor");
  }

  return (
    <div className="mx-auto cg-screen max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Painel do Mestre</p>
          <h1 className="text-2xl font-bold text-white">Visão Geral da Turma</h1>
        </div>
        <button onClick={logout} className="cg-btn-secondary !px-4 !py-2 text-xs">
          Sair
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="cg-card p-4">
          <p className="text-[11px] uppercase tracking-wider text-slate-500">Alunos</p>
          <p className="mt-1 text-2xl font-bold text-white">{students.length}</p>
        </div>
        <div className="cg-card p-4">
          <p className="text-[11px] uppercase tracking-wider text-slate-500">Missões</p>
          <p className="mt-1 text-2xl font-bold text-white">{missions.length}</p>
        </div>
        {HOUSES.map((h) => (
          <div key={h.id} className="cg-card p-4">
            <p className={`text-[11px] uppercase tracking-wider ${h.colorClass}`}>{h.name}</p>
            <p className="mt-1 text-2xl font-bold text-white">{students.filter((s) => s.houseId === h.id).length}</p>
          </div>
        ))}
      </div>

      <div className="cg-card mb-6 p-5">
        <p className="mb-3 text-sm font-semibold text-slate-300">Alunos cadastrados</p>
        {students.length === 0 ? (
          <p className="text-sm text-slate-500">Nenhum aluno cadastrado ainda neste dispositivo.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {students.map((s) => {
              const house = s.houseId ? HOUSES.find((h) => h.id === s.houseId) : null;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudentId(s.id)}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-[#0d0d14] px-4 py-2.5 text-left transition-colors hover:border-slate-600"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{s.name}</p>
                    <p className="text-xs text-slate-500">
                      {s.email} • {s.turma} • <span className="font-mono">@{s.username}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    {house && <span className={house.colorClass}>{house.name}</span>}
                    <span className="text-slate-400">Nv {s.level}</span>
                    <span className="flex items-center gap-1 text-amber-300">
                      <CoinIcon size={14} /> {s.coins}
                    </span>
                    <span className="text-slate-500">{s.completedMissionIds.length}/{missions.length} missões</span>
                    <span className="text-slate-600">Ver aluno →</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="cg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-300">Missões cadastradas</p>
          <button onClick={() => setEditorTarget("new")} className="cg-btn-primary !px-3 !py-1.5 text-xs">
            + Nova Missão
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {missions.map((m) => {
            const completions = students.filter((s) => s.completedMissionIds.includes(m.id)).length;
            return (
              <button
                key={m.id}
                onClick={() => setEditorTarget(m)}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-[#0d0d14] px-4 py-2.5 text-left transition-colors hover:border-slate-600"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{m.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{m.title}</p>
                    <p className="text-xs text-slate-500">{m.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <DifficultyBadge difficulty={m.difficulty} />
                  <span className="text-slate-500">{completions} concluíram</span>
                  <span className="text-slate-600">Editar →</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedStudent && (
        <StudentDetails
          student={selectedStudent}
          missions={missions}
          messages={selectedMessages}
          onGrantItem={handleGrantItem}
          onRemoveItem={handleRemoveItem}
          onSendMessage={handleSendMessage}
          onDeleteStudent={handleDeleteStudent}
          onUpdateCredentials={handleUpdateCredentials}
          onClose={() => setSelectedStudentId(null)}
        />
      )}

      {editorTarget && (
        <MissionEditor
          existingMission={editorTarget === "new" ? undefined : editorTarget}
          onSave={handleSave}
          onDelete={editorTarget !== "new" ? handleDelete : undefined}
          onClose={() => setEditorTarget(null)}
        />
      )}
    </div>
  );
}
