"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStudents, useMissions, useMessages, useTeachers, useEventRuns, useShop, useGifts, useSubmissions } from "@/engine/store";
import SubmissionReviewer from "@/components/SubmissionReviewer";
import { Mission, MissionContent, MissionKind } from "@/engine/missions";
import { removeItem, validateCredentials, normalizeUsername, validateStudentProfile, StudentProfile, houseChangePatch } from "@/engine/students";
import { MessageKind } from "@/engine/messages";
import { HOUSES, HouseId } from "@/engine/houses";
import MissionEditor from "@/components/MissionEditor";
import StudentList from "@/components/StudentList";
import MissionList from "@/components/MissionList";
import EventMissionsManager from "@/components/EventMissionsManager";
import StudentDetails from "@/components/StudentDetails";
import BroadcastComposer from "@/components/BroadcastComposer";
import GiftComposer from "@/components/GiftComposer";
import { GiftItem } from "@/engine/gifts";
import TutorialModal from "@/components/TutorialModal";
import ThemeToggle from "@/components/ThemeToggle";
import { teacherTutorial } from "@/engine/tutorial";
import { eventMissionItemKey, resolveEventItem } from "@/engine/eventItems";
import { EventId, eventMissionFields, eventMissionLabel, eventPhases, getEvent, missingPresets } from "@/engine/specialEvents";

export default function PainelProfessorPage() {
  const router = useRouter();
  const { currentTeacher, ready: teachersReady, logout: teacherLogout, finishTutorial } = useTeachers();
  const { students: allStudents, ready, patchStudent, deleteStudent } = useStudents();
  const { missions: allMissions, ready: missionsReady, addMission, editMission, removeMission } = useMissions();
  const { runs: eventRuns, start: startEvent, end: endEvent, releasePhase } = useEventRuns();
  const { items: shopItems } = useShop();
  const { give } = useGifts();
  const { submissions } = useSubmissions();
  // Tipo da missão nova: quiz (perguntas) ou entrega (resposta aberta/arquivos, corrigida pelo professor).
  const [newKind, setNewKind] = useState<MissionKind>("quiz");
  const [editorTarget, setEditorTarget] = useState<Mission | "new" | null>(null);
  // Evento da missão nova sendo criada (null = missão normal).
  // Evento (e fase) da missão nova sendo criada (null = missão normal).
  const [newMissionEvent, setNewMissionEvent] = useState<{ eventId: EventId; phase: number } | null>(null);
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
    setNewMissionEvent(null);
    setNewKind("quiz");
  }

  function handleSave(data: MissionContent) {
    if (editorTarget && editorTarget !== "new") {
      editMission(editorTarget.id, data);
    } else {
      addMission({ ...data, teacherId: teacher.id, ...(newMissionEvent && eventMissionFields(newMissionEvent.eventId, newMissionEvent.phase)) });
    }
    closeEditor();
  }

  function handleDelete() {
    if (editorTarget && editorTarget !== "new") {
      removeMission(editorTarget.id);
    }
    closeEditor();
  }

  function createEventMission(eventId: EventId, phase: number) {
    setNewMissionEvent({ eventId, phase });
    setEditorTarget("new");
  }

  /** Adiciona à fase do evento as missões prontas dela que o professor ainda não tem (comparando pelo título). */
  function addEventPresets(eventId: EventId, phase: number) {
    const event = getEvent(eventId);
    if (!event) return;
    // o item de cada missão pronta vem com as alterações que o ADM fez na Loja
    missingPresets(event, phase, missions).forEach((p) =>
      addMission({ ...p, rewardItem: resolveEventItem(eventMissionItemKey(eventId, p.title), p.rewardItem, shopItems), teacherId: teacher.id, ...eventMissionFields(eventId, phase) }),
    );
  }

  const selectedStudent = students.find((s) => s.id === selectedStudentId) ?? null;

  function handleGrantItem(item: GiftItem) {
    if (!selectedStudent) return;
    // sem espaço no inventário, o presente fica esperando espaço (nada se perde)
    give([selectedStudent.id], item, { id: teacher.id, name: teacher.name, role: "professor" });
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

      <SubmissionReviewer
        submissions={submissions.filter((s) => s.teacherId === teacher.id)}
        students={students}
        missions={missions}
        reviewerName={`Professor ${teacher.name}`}
      />

      <BroadcastComposer students={students} senderId={teacher.id} />

      <GiftComposer
        students={students}
        giver={{ id: teacher.id, name: teacher.name, role: "professor" }}
        shopItems={shopItems}
        missions={missions}
        isAdmin={false}
        scopeLabel="Toda a turma"
      />

      <MissionList
        title="Missões cadastradas"
        missions={regularMissions}
        students={students}
        emptyText="Você ainda não criou nenhuma missão — seus alunos só veem as missões criadas por você."
        headerRight={
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setEditorTarget("new")} className="cg-btn-primary !px-3 !py-1.5 text-xs">
              + Nova Missão
            </button>
          <button
              onClick={() => {
                setNewKind("entrega");
                setEditorTarget("new");
              }}
              className="rounded-full border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-bold text-indigo-100 transition-colors hover:bg-indigo-500/25"
              title="O aluno escreve uma resposta e/ou envia arquivos (PDF, Word, Scratch, App Inventor, Roblox Studio), e você corrige"
            >
              📝 + Nova Missão de Entrega
            </button>
          </div>
        }
        onSelect={setEditorTarget}
      />

      <EventMissionsManager
        runs={eventRuns[teacher.id] ?? {}}
        missions={missions}
        students={students}
        ranking={{ students, missions }}
        onStart={(eventId) => startEvent(teacher.id, eventId)}
        onEnd={(eventId) => endEvent(teacher.id, eventId)}
          onReleasePhase={(eventId) => releasePhase(teacher.id, eventId, eventPhases(getEvent(eventId)!).length)}
        onEdit={setEditorTarget}
        onCreate={createEventMission}
        onAssign={(missionId, eventId, phase) => editMission(missionId, eventMissionFields(eventId, phase))}
        onUnassign={(missionId) => editMission(missionId, { eventId: undefined, eventPhase: undefined })}
        onAddPresets={addEventPresets}
      />

      {selectedStudent && (
        <StudentDetails
          student={selectedStudent}
          missions={missions}
          messages={selectedMessages}
          onGrantItem={handleGrantItem}
          shopItems={shopItems}
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
          lockEventItem
          newKind={newKind}
          eventLabel={editorTarget === "new" ? (newMissionEvent ? eventMissionLabel(newMissionEvent.eventId, newMissionEvent.phase) : undefined) : eventMissionLabel(editorTarget.eventId, editorTarget.eventPhase)}
          onSave={handleSave}
          onDelete={editorTarget !== "new" ? handleDelete : undefined}
          onClose={closeEditor}
        />
      )}

      {tutorialOpen && <TutorialModal steps={teacherTutorial(teacher.isAdmin)} label="Tutorial do professor" onClose={closeTutorial} />}
    </div>
  );
}
