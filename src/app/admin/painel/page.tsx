"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStudents, useMissions, useMessages, useTeachers } from "@/engine/store";
import { Mission, MissionContent, Rarity } from "@/engine/missions";
import { grantItem, removeItem, validateCredentials, normalizeUsername, validateStudentProfile, StudentProfile, houseChangePatch } from "@/engine/students";
import { Teacher, validateTeacher } from "@/engine/teachers";
import { MessageKind } from "@/engine/messages";
import { HOUSES, HouseId } from "@/engine/houses";
import MissionEditor from "@/components/MissionEditor";
import StudentList from "@/components/StudentList";
import MissionList from "@/components/MissionList";
import TeacherList from "@/components/TeacherList";
import StudentDetails from "@/components/StudentDetails";
import TeacherEditor from "@/components/TeacherEditor";

type Tab = "professores" | "alunos" | "missoes";

const TAB_LABELS: Record<Tab, string> = { professores: "Professores", alunos: "Alunos", missoes: "Missões" };

const ALL_TEACHERS = "todos";

export default function PainelAdminPage() {
  const router = useRouter();
  const { teachers, currentTeacher, ready: teachersReady, logout, addTeacher, editTeacher, deleteTeacher } = useTeachers();
  const { students, ready, patchStudent, deleteStudent } = useStudents();
  const { missions, ready: missionsReady, addMission, editMission, removeMission } = useMissions();
  const [tab, setTab] = useState<Tab>("professores");
  // Filtro de professor das abas Alunos e Missões.
  const [teacherFilter, setTeacherFilter] = useState<string>(ALL_TEACHERS);
  const [teacherTarget, setTeacherTarget] = useState<Teacher | "new" | null>(null);
  const [editorTarget, setEditorTarget] = useState<Mission | "new" | null>(null);
  // Guarda só o id, como no painel do professor: a ficha acompanha as mudanças.
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const { messages: selectedMessages, send: sendMessage } = useMessages(selectedStudentId);

  // Só o ADM (Professor Danilo) entra aqui; qualquer outra sessão volta pro login do ADM.
  useEffect(() => {
    if (teachersReady && !currentTeacher?.isAdmin) router.replace("/admin");
  }, [teachersReady, currentTeacher, router]);

  if (!teachersReady || !currentTeacher?.isAdmin || !ready || !missionsReady) return null;

  const admin = currentTeacher;
  const teacherName = (id: string) => teachers.find((t) => t.id === id)?.name ?? "Sem professor";
  const missionsOf = (teacherId: string) => missions.filter((m) => m.teacherId === teacherId);
  const studentsOf = (teacherId: string) => students.filter((s) => s.teacherId === teacherId);

  const visibleStudents = teacherFilter === ALL_TEACHERS ? students : studentsOf(teacherFilter);
  const visibleMissions = teacherFilter === ALL_TEACHERS ? missions : missionsOf(teacherFilter);
  const selectedStudent = students.find((s) => s.id === selectedStudentId) ?? null;
  const counts: Record<Tab, number> = { professores: teachers.length, alunos: students.length, missoes: missions.length };

  // ---- professores ----

  function handleSaveTeacher(data: { name: string; email: string; password: string }): string | null {
    const existing = teacherTarget && teacherTarget !== "new" ? teacherTarget : null;
    const error = validateTeacher(data, existing?.id);
    if (error) return error;
    if (existing) editTeacher(existing.id, data);
    else addTeacher(data);
    setTeacherTarget(null);
    return null;
  }

  function handleDeleteTeacher(heirId: string) {
    if (!teacherTarget || teacherTarget === "new") return;
    deleteTeacher(teacherTarget.id, heirId);
    if (teacherFilter === teacherTarget.id) setTeacherFilter(ALL_TEACHERS);
    setTeacherTarget(null);
  }

  // ---- missões ----

  function handleSaveMission(data: MissionContent, teacherId?: string) {
    const owner = teacherId ?? admin.id;
    if (editorTarget && editorTarget !== "new") {
      editMission(editorTarget.id, { ...data, teacherId: owner });
    } else {
      addMission({ ...data, teacherId: owner });
    }
    setEditorTarget(null);
  }

  function handleDeleteMission() {
    if (editorTarget && editorTarget !== "new") removeMission(editorTarget.id);
    setEditorTarget(null);
  }

  // ---- alunos ----

  function handleGrantItem(item: { name: string; icon: string; rarity: Rarity; value: number; xp: number }) {
    if (!selectedStudent) return;
    patchStudent(selectedStudent.id, { inventory: grantItem(selectedStudent, item).inventory });
  }

  function handleRemoveItem(itemId: string) {
    if (!selectedStudent) return;
    patchStudent(selectedStudent.id, { inventory: removeItem(selectedStudent, itemId).inventory });
  }

  function handleSendMessage(data: { kind: MessageKind; body: string }) {
    if (!selectedStudent) return;
    sendMessage({ studentId: selectedStudent.id, senderId: admin.id, ...data });
  }

  function handleUpdateProfile(profile: StudentProfile): string | null {
    if (!selectedStudent) return null;
    const error = validateStudentProfile(profile);
    if (error) return error;
    patchStudent(selectedStudent.id, { name: profile.name.trim(), email: profile.email.trim(), turma: profile.turma.trim() });
    return null;
  }

  function handleChangeHouse(houseId: HouseId) {
    if (!selectedStudent) return;
    patchStudent(selectedStudent.id, houseChangePatch(selectedStudent, houseId));
  }

  function handleUpdateCredentials(username: string, password: string): string | null {
    if (!selectedStudent) return null;
    const error = validateCredentials(username, password, selectedStudent.id);
    if (error) return error;
    patchStudent(selectedStudent.id, { username: normalizeUsername(username), password });
    return null;
  }

  function handleChangeTeacher(teacherId: string) {
    if (!selectedStudent) return;
    patchStudent(selectedStudent.id, { teacherId });
  }

  function handleDeleteStudent() {
    if (!selectedStudent) return;
    deleteStudent(selectedStudent.id);
    setSelectedStudentId(null);
  }

  function handleLogout() {
    logout();
    router.push("/admin");
  }

  const teacherFilterSelect = (
    <select
      value={teacherFilter}
      onChange={(e) => setTeacherFilter(e.target.value)}
      className="rounded-lg border border-slate-700 bg-[#0d0d14] px-3 py-1.5 text-xs text-slate-100 focus:border-slate-400 focus:outline-none"
    >
      <option value={ALL_TEACHERS}>Todos os professores</option>
      {teachers.map((t) => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
    </select>
  );

  return (
    <div className="mx-auto cg-screen max-w-5xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-violet-300">🛡 Painel ADM • {admin.name}</p>
          <h1 className="text-2xl font-bold text-white">Visão Geral da Plataforma</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/professor/painel" className="cg-btn-secondary !px-4 !py-2 text-xs">
            Meu painel de professor
          </Link>
          <button onClick={handleLogout} className="cg-btn-secondary !px-4 !py-2 text-xs">
            Sair
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        {[
          { label: "Professores", value: teachers.length },
          { label: "Alunos", value: students.length },
          { label: "Missões", value: missions.length },
        ].map((stat) => (
          <div key={stat.label} className="cg-card p-4">
            <p className="text-[11px] uppercase tracking-wider text-slate-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
        {HOUSES.map((h) => (
          <div key={h.id} className="cg-card p-4">
            <p className={`text-[11px] uppercase tracking-wider ${h.colorClass}`}>{h.name}</p>
            <p className="mt-1 text-2xl font-bold text-white">{students.filter((s) => s.houseId === h.id).length}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 inline-flex max-w-full flex-wrap gap-1 rounded-xl border border-slate-800 bg-[#101018] p-1">
        {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === t ? "bg-white text-[#0a0a0f]" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {TAB_LABELS[t]}
            <span className={`rounded-full px-1.5 text-[10px] ${tab === t ? "bg-slate-200 text-slate-700" : "bg-slate-800 text-slate-400"}`}>{counts[t]}</span>
          </button>
        ))}
      </div>

      {tab === "professores" && (
        <TeacherList
          teachers={teachers}
          studentCount={(id) => studentsOf(id).length}
          missionCount={(id) => missionsOf(id).length}
          onNew={() => setTeacherTarget("new")}
          onSelect={setTeacherTarget}
        />
      )}

      {tab === "alunos" && (
        <StudentList
          key={teacherFilter}
          title="Alunos da plataforma"
          students={visibleStudents}
          missions={missions}
          emptyText={`Nenhum aluno cadastrado ${teacherFilter === ALL_TEACHERS ? "ainda neste dispositivo" : "com esse professor"}.`}
          headerRight={teacherFilterSelect}
          teacherName={teacherName}
          onSelect={setSelectedStudentId}
        />
      )}

      {tab === "missoes" && (
        <MissionList
          key={teacherFilter}
          title="Missões da plataforma"
          missions={visibleMissions}
          students={students}
          emptyText={`Nenhuma missão ${teacherFilter === ALL_TEACHERS ? "cadastrada ainda" : "desse professor"}.`}
          headerRight={
            <div className="flex flex-wrap gap-2">
              {teacherFilterSelect}
              <button onClick={() => setEditorTarget("new")} className="cg-btn-primary !px-3 !py-1.5 text-xs">
                + Nova Missão
              </button>
            </div>
          }
          teacherName={teacherName}
          onSelect={setEditorTarget}
        />
      )}

      {teacherTarget && (
        <TeacherEditor
          existingTeacher={teacherTarget === "new" ? undefined : teacherTarget}
          teachers={teachers}
          studentCount={teacherTarget === "new" ? 0 : studentsOf(teacherTarget.id).length}
          missionCount={teacherTarget === "new" ? 0 : missionsOf(teacherTarget.id).length}
          onSave={handleSaveTeacher}
          onDelete={teacherTarget !== "new" && !teacherTarget.isAdmin ? handleDeleteTeacher : undefined}
          onClose={() => setTeacherTarget(null)}
        />
      )}

      {selectedStudent && (
        <StudentDetails
          student={selectedStudent}
          missions={missionsOf(selectedStudent.teacherId)}
          messages={selectedMessages}
          onGrantItem={handleGrantItem}
          onRemoveItem={handleRemoveItem}
          onSendMessage={handleSendMessage}
          onDeleteStudent={handleDeleteStudent}
          onUpdateCredentials={handleUpdateCredentials}
          onUpdateProfile={handleUpdateProfile}
          onChangeHouse={handleChangeHouse}
          teachers={teachers}
          onChangeTeacher={handleChangeTeacher}
          onClose={() => setSelectedStudentId(null)}
        />
      )}

      {editorTarget && (
        <MissionEditor
          existingMission={editorTarget === "new" ? undefined : editorTarget}
          teachers={teachers}
          defaultTeacherId={teacherFilter === ALL_TEACHERS ? admin.id : teacherFilter}
          onSave={handleSaveMission}
          onDelete={editorTarget !== "new" ? handleDeleteMission : undefined}
          onClose={() => setEditorTarget(null)}
        />
      )}
    </div>
  );
}
