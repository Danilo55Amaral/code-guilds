"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStudents, useMissions, useMessages, useTeachers } from "@/engine/store";
import { Mission, MissionContent, Rarity } from "@/engine/missions";
import { grantItem, removeItem, validateCredentials, normalizeUsername, validateStudentProfile, StudentProfile, houseChangePatch } from "@/engine/students";
import { MessageKind, itemGiftMessage } from "@/engine/messages";
import { HOUSES, HouseId } from "@/engine/houses";
import MissionEditor from "@/components/MissionEditor";
import StudentList from "@/components/StudentList";
import MissionList from "@/components/MissionList";
import EventMissionsManager from "@/components/EventMissionsManager";
import StudentDetails from "@/components/StudentDetails";
import BroadcastComposer from "@/components/BroadcastComposer";
import TutorialModal from "@/components/TutorialModal";
import ThemeToggle from "@/components/ThemeToggle";
import { teacherTutorial } from "@/engine/tutorial";
import { EventId, getEvent } from "@/engine/specialEvents";

export default function PainelProfessorPage() {
  const router = useRouter();
  const { currentTeacher, ready: teachersReady, logout: teacherLogout, finishTutorial } = useTeachers();
  const { students: allStudents, ready, patchStudent, deleteStudent } = useStudents();
  const { missions: allMissions, ready: missionsReady, addMission, editMission, removeMission } = useMissions();
  const [editorTarget, setEditorTarget] = useState<Mission | "new" | null>(null);
  // Evento da missão nova sendo criada (null = missão normal).
  const [newMissionEventId, setNewMissionEventId] = useState<EventId | null>(null);
  // Guarda só o id: o aluno é relido da lista a cada render, então a ficha
  // aberta já mostra o item dado/excluído na hora.
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const { messages: selectedMessages, send: sendMessage } = useMessages(selectedStudentId);
  const [tutorialOpen, setTutorialOpen] = useState(false);

  useEffect(() => {
    if (teachersReady && !currentTeacher) router.replace("/professor");
  }, [teachersReady, currentTeacher, router]);

  // Primeiro acesso do professor ao painel: o tutorial abre sozinho.
  const needsTutorial = !!currentTeacher && !currentTeacher.tutorialDone;
  useEffect(() => {
    if (needsTutorial) setTutorialOpen(true);
  }, [needsTutorial]);

  if (!teachersReady || !currentTeacher || !ready || !missionsReady) return null;

  const teacher = currentTeacher;
  // O professor só enxerga (e só altera) os próprios alunos e as próprias missões.
  const students = allStudents.filter((s) => s.teacherId === teacher.id);
  const missions = allMissions.filter((m) => m.teacherId === teacher.id);
  // As missões de evento ficam no card de Eventos; aqui são só as normais.
  const regularMissions = missions.filter((m) => !m.eventId);

  function closeEditor() {
    setEditorTarget(null);
    setNewMissionEventId(null);
  }

  function handleSave(data: MissionContent) {
    if (editorTarget && editorTarget !== "new") {
      editMission(editorTarget.id, data);
    } else {
      addMission({ ...data, teacherId: teacher.id, ...(newMissionEventId && { eventId: newMissionEventId }) });
    }
    closeEditor();
  }

  function handleDelete() {
    if (editorTarget && editorTarget !== "new") {
      removeMission(editorTarget.id);
    }
    closeEditor();
  }

  function eventLabelOf(eventId: string | null | undefined): string | undefined {
    const event = eventId ? getEvent(eventId) : undefined;
    return event ? `${event.icon} ${event.title}` : undefined;
  }

  function createEventMission(eventId: EventId) {
    setNewMissionEventId(eventId);
    setEditorTarget("new");
  }

  /** Adiciona ao evento as missões prontas dele que o professor ainda não tem (comparando pelo título). */
  function addEventPresets(eventId: EventId) {
    const event = getEvent(eventId);
    if (!event) return;
    const current = missions.filter((m) => m.eventId === eventId);
    event.presetMissions
      .filter((p) => !current.some((m) => m.title === p.title))
      .forEach((p) => addMission({ ...p, teacherId: teacher.id, eventId }));
  }

  const selectedStudent = students.find((s) => s.id === selectedStudentId) ?? null;

  function handleGrantItem(item: { name: string; icon: string; description: string; rarity: Rarity; value: number; xp: number }) {
    if (!selectedStudent) return;
    patchStudent(selectedStudent.id, { inventory: grantItem(selectedStudent, item).inventory });
    sendMessage({
      studentId: selectedStudent.id,
      senderId: teacher.id,
      kind: "presente",
      body: itemGiftMessage({ studentName: selectedStudent.name, item, giverName: teacher.name, giverRole: "professor" }),
    });
  }

  function handleRemoveItem(itemId: string) {
    if (!selectedStudent) return;
    patchStudent(selectedStudent.id, { inventory: removeItem(selectedStudent, itemId).inventory });
  }

  function handleSendMessage(data: { kind: MessageKind; body: string }) {
    if (!selectedStudent) return;
    sendMessage({ studentId: selectedStudent.id, senderId: teacher.id, ...data });
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

  function handleDeleteStudent() {
    if (!selectedStudent) return;
    deleteStudent(selectedStudent.id);
    setSelectedStudentId(null);
  }

  function closeTutorial() {
    setTutorialOpen(false);
    if (!teacher.tutorialDone) finishTutorial(teacher.id);
  }

  function logout() {
    teacherLogout();
    router.push("/professor");
  }

  return (
    <div className="mx-auto cg-screen max-w-5xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Painel do Mestre • Professor {teacher.name}</p>
          <h1 className="text-2xl font-bold text-white">Visão Geral da Turma</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setTutorialOpen(true)} className="cg-btn-secondary !px-4 !py-2 text-xs" title="Ver o tutorial do painel">
            ❓ Tutorial
          </button>
          {teacher.isAdmin && (
            <Link href="/admin/painel" className="cg-btn-primary !px-4 !py-2 text-xs">
              🛡 Painel ADM
            </Link>
          )}
          <button onClick={logout} className="cg-btn-secondary !px-4 !py-2 text-xs">
            Sair
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="cg-card p-4">
          <p className="text-[11px] uppercase tracking-wider text-slate-500">Alunos</p>
          <p className="mt-1 text-2xl font-bold text-white">{students.length}</p>
        </div>
        <div className="cg-card p-4">
          <p className="text-[11px] uppercase tracking-wider text-slate-500">Missões</p>
          <p className="mt-1 text-2xl font-bold text-white">{regularMissions.length}</p>
        </div>
        {HOUSES.map((h) => (
          <div key={h.id} className="cg-card p-4">
            <p className={`text-[11px] uppercase tracking-wider ${h.colorClass}`}>{h.name}</p>
            <p className="mt-1 text-2xl font-bold text-white">{students.filter((s) => s.houseId === h.id).length}</p>
          </div>
        ))}
      </div>

      <StudentList
        title="Alunos cadastrados"
        students={students}
        missions={missions}
        emptyText="Nenhum aluno seu cadastrado ainda neste dispositivo — no cadastro, o aluno escolhe você como professor."
        onSelect={setSelectedStudentId}
      />

      <BroadcastComposer students={students} senderId={teacher.id} />

      <MissionList
        title="Missões cadastradas"
        missions={regularMissions}
        students={students}
        emptyText="Você ainda não criou nenhuma missão — seus alunos só veem as missões criadas por você."
        headerRight={
          <button onClick={() => setEditorTarget("new")} className="cg-btn-primary !px-3 !py-1.5 text-xs">
            + Nova Missão
          </button>
        }
        onSelect={setEditorTarget}
      />

      <EventMissionsManager
        missions={missions}
        students={students}
        onEdit={setEditorTarget}
        onCreate={createEventMission}
        onAssign={(missionId, eventId) => editMission(missionId, { eventId })}
        onUnassign={(missionId) => editMission(missionId, { eventId: undefined })}
        onAddPresets={addEventPresets}
      />

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
          onUpdateProfile={handleUpdateProfile}
          onChangeHouse={handleChangeHouse}
          onClose={() => setSelectedStudentId(null)}
        />
      )}

      {editorTarget && (
        <MissionEditor
          existingMission={editorTarget === "new" ? undefined : editorTarget}
          eventLabel={eventLabelOf(editorTarget === "new" ? newMissionEventId : editorTarget.eventId)}
          onSave={handleSave}
          onDelete={editorTarget !== "new" ? handleDelete : undefined}
          onClose={closeEditor}
        />
      )}

      {tutorialOpen && <TutorialModal steps={teacherTutorial(teacher.isAdmin)} label="Tutorial do professor" onClose={closeTutorial} />}
    </div>
  );
}
