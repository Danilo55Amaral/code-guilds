"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStudents, useMissions, useMessages, useTeachers, useShop, useEventRuns, useGifts, useSubmissions, useGameActions } from "@/engine/store";
import SubmissionReviewer from "@/components/SubmissionReviewer";
import { Mission, MissionContent, MissionKind } from "@/engine/missions";
import { validateCredentials, normalizeUsername, validateStudentProfile, StudentProfile } from "@/engine/students";
import { Teacher, validateTeacher } from "@/engine/teachers";
import { MessageKind } from "@/engine/messages";
import { HOUSES, HouseId } from "@/engine/houses";
import MissionEditor from "@/components/MissionEditor";
import StudentList from "@/components/StudentList";
import MissionList from "@/components/MissionList";
import TeacherList from "@/components/TeacherList";
import StudentDetails from "@/components/StudentDetails";
import GiftComposer from "@/components/GiftComposer";
import { GiftItem } from "@/engine/gifts";
import TeacherEditor from "@/components/TeacherEditor";
import ThemeToggle from "@/components/ThemeToggle";
import ShopManager from "@/components/ShopManager";
import EventMissionsManager from "@/components/EventMissionsManager";
import { eventMissionItemKey, resolveEventItem } from "@/engine/eventItems";
import { EventId, eventMissionFields, eventMissionLabel, getEvent, missingPresets } from "@/engine/specialEvents";

type Tab = "professores" | "alunos" | "missoes" | "entregas" | "eventos" | "loja";

const TAB_LABELS: Record<Tab, string> = { professores: "Professores", alunos: "Alunos", missoes: "Missões", entregas: "📥 Entregas", eventos: "📅 Eventos", loja: "🛍️ Loja" };

const ALL_TEACHERS = "todos";

export default function PainelAdminPage() {
  const router = useRouter();
  const { teachers, currentTeacher, ready: teachersReady, logout, addTeacher, editTeacher, deleteTeacher } = useTeachers();
  const { students, ready, updateAccount, setPassword, deleteStudent } = useStudents();
  const { removeStudentItem } = useGameActions();
  const { missions, ready: missionsReady, addMission, editMission, removeMission } = useMissions();
  const { items: shopItems } = useShop();
  const { give } = useGifts();
  const { submissions } = useSubmissions();
  // Tipo da missão nova: quiz (perguntas) ou entrega (resposta aberta/arquivos, corrigida pelo professor).
  const [newKind, setNewKind] = useState<MissionKind>("quiz");
  const { runs: eventRuns, start: startEvent, end: endEvent, releasePhase, closePhase } = useEventRuns();
  const [tab, setTab] = useState<Tab>("professores");
  // Filtro de professor das abas Alunos e Missões.
  const [teacherFilter, setTeacherFilter] = useState<string>(ALL_TEACHERS);
  const [teacherTarget, setTeacherTarget] = useState<Teacher | "new" | null>(null);
  const [editorTarget, setEditorTarget] = useState<Mission | "new" | null>(null);
  // Aba Eventos: de qual professor são os eventos mostrados ("" = o próprio ADM) e o evento da missão nova.
  const [eventTeacherId, setEventTeacherId] = useState("");
  // Evento (e fase) da missão nova sendo criada (null = missão normal).
  const [newMissionEvent, setNewMissionEvent] = useState<{ eventId: EventId; phase: number } | null>(null);
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
  const eventTeacher = eventTeacherId || admin.id;
  const activeEventCount = Object.values(eventRuns).reduce((n, byEvent) => n + Object.values(byEvent).filter((r) => r?.status === "ativo").length, 0);
  const counts: Record<Tab, number> = {
    professores: teachers.length,
    alunos: students.length,
    missoes: missions.length,
    entregas: submissions.filter((s) => s.status === "pendente").length,
    eventos: activeEventCount,
    loja: shopItems.length,
  };

  // ---- professores ----

  // Cadastro, edição e exclusão acontecem na API; o editor mostra o erro que voltar.
  async function handleSaveTeacher(data: { name: string; email: string; password: string }): Promise<string | null> {
    const existing = teacherTarget && teacherTarget !== "new" ? teacherTarget : null;
    const error = validateTeacher(data, !!existing);
    if (error) return error;
    const apiError = existing ? await editTeacher(existing.id, data) : await addTeacher(data);
    if (apiError) return apiError;
    setTeacherTarget(null);
    return null;
  }

  async function handleDeleteTeacher(heirId: string): Promise<string | null> {
    if (!teacherTarget || teacherTarget === "new") return null;
    const error = await deleteTeacher(teacherTarget.id, heirId);
    if (error) return error;
    if (teacherFilter === teacherTarget.id) setTeacherFilter(ALL_TEACHERS);
    setTeacherTarget(null);
    return null;
  }

  // ---- missões ----

  function closeEditor() {
    setEditorTarget(null);
    setNewMissionEvent(null);
    setNewKind("quiz");
  }

  // Salvar e excluir falam com a API; se ela recusar, o editor continua aberto mostrando o erro.
  async function handleSaveMission(data: MissionContent, teacherId?: string): Promise<string | null> {
    const owner = teacherId ?? admin.id;
    const error =
      editorTarget && editorTarget !== "new"
        ? await editMission(editorTarget.id, { ...data, teacherId: owner })
        : await addMission({ ...data, teacherId: owner, ...(newMissionEvent && eventMissionFields(newMissionEvent.eventId, newMissionEvent.phase)) });
    if (error) return error;
    closeEditor();
    return null;
  }

  async function handleDeleteMission(): Promise<string | null> {
    if (editorTarget && editorTarget !== "new") {
      const error = await removeMission(editorTarget.id);
      if (error) return error;
    }
    closeEditor();
    return null;
  }

  // ---- eventos (do professor escolhido na aba Eventos) ----

  function createEventMission(eventId: EventId, phase: number) {
    setNewMissionEvent({ eventId, phase });
    setEditorTarget("new");
  }

  /** Adiciona à fase do evento as missões prontas dela que o professor escolhido ainda não tem (comparando pelo título). */
  function addEventPresets(eventId: EventId, phase: number) {
    const event = getEvent(eventId);
    if (!event) return;
    // o item de cada missão pronta vem com as alterações que o ADM fez na Loja
    missingPresets(event, phase, missionsOf(eventTeacher)).forEach((p) =>
      addMission({ ...p, rewardItem: resolveEventItem(eventMissionItemKey(eventId, p.title), p.rewardItem, shopItems), teacherId: eventTeacher, ...eventMissionFields(eventId, phase) }),
    );
  }

  // ---- alunos ----

  /** Doa um item da Loja (igualzinho ao da Loja, inclusive se for visual pra equipar) — só o ADM faz isso. */
  // sem espaço no inventário, o presente fica esperando espaço (nada se perde)
  async function handleGrantItem(item: GiftItem): Promise<string | null> {
    if (!selectedStudent) return null;
    const result = await give([selectedStudent.id], item);
    return result.ok ? null : result.error;
  }

  // O item sai no servidor; a ficha acompanha pelo cache
  function handleRemoveItem(itemId: string) {
    if (!selectedStudent) return;
    void removeStudentItem(selectedStudent.id, itemId);
  }

  // A mensagem vai pela API; devolve o erro (ou null) pra ficha mostrar
  async function handleSendMessage(data: { kind: MessageKind; body: string }): Promise<string | null> {
    if (!selectedStudent) return null;
    return sendMessage({ studentId: selectedStudent.id, ...data });
  }

  // A conta do aluno (dados, casa, login e senha) muda na API; cada handler
  // devolve a mensagem de erro (ou null) pra ficha do aluno mostrar.

  async function handleUpdateProfile(profile: StudentProfile): Promise<string | null> {
    if (!selectedStudent) return null;
    const error = validateStudentProfile(profile);
    if (error) return error;
    return updateAccount(selectedStudent.id, { name: profile.name.trim(), email: profile.email.trim(), turma: profile.turma.trim() });
  }

  // Se o aluno ainda estava escolhendo a casa, a API já o passa pra etapa do avatar
  async function handleChangeHouse(houseId: HouseId): Promise<string | null> {
    if (!selectedStudent) return null;
    return updateAccount(selectedStudent.id, { houseId });
  }

  // Senha em branco = mantém a atual (só vale se o aluno já tem senha)
  async function handleUpdateCredentials(username: string, password: string): Promise<string | null> {
    if (!selectedStudent) return null;
    const error = validateCredentials(username, password, selectedStudent.hasPassword);
    if (error) return error;
    const login = normalizeUsername(username);
    if (login !== selectedStudent.username) {
      const loginError = await updateAccount(selectedStudent.id, { username: login });
      if (loginError) return loginError;
    }
    return password ? setPassword(selectedStudent.id, password) : null;
  }

  async function handleChangeTeacher(teacherId: string): Promise<string | null> {
    if (!selectedStudent) return null;
    return updateAccount(selectedStudent.id, { teacherId });
  }

  async function handleDeleteStudent(): Promise<string | null> {
    if (!selectedStudent) return null;
    const error = await deleteStudent(selectedStudent.id);
    if (!error) setSelectedStudentId(null);
    return error;
  }

  function handleLogout() {
    logout();
    router.push("/admin");
  }

  const teacherFilterSelect = (
    <select
      value={teacherFilter}
      onChange={(e) => setTeacherFilter(e.target.value)}
      className="rounded-lg border border-slate-700 bg-cg-sunken px-3 py-1.5 text-xs text-slate-100 focus:border-slate-400 focus:outline-none"
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
        <div className="flex flex-wrap items-center gap-2">
          <ThemeToggle />
          <Link
            href="/multiverso?modo=mestre&volta=admin"
            className="rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400 px-4 py-2 text-xs font-black text-cg-onaccent shadow-lg shadow-violet-500/30 transition-transform hover:scale-[1.04]"
            title="Entrar na Sala do Multiverso (professor e ADM entram sempre)"
          >
            🌀 Sala do Multiverso
          </Link>
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

      <div className="mb-4 inline-flex max-w-full flex-wrap gap-1 rounded-xl border border-slate-800 bg-cg-card p-1">
        {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === t ? "bg-white text-cg-ink" : "text-slate-400 hover:text-slate-200"
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
        <GiftComposer
          key={`presentes-${teacherFilter}`}
          students={visibleStudents}
          shopItems={shopItems}
          missions={missions}
          isAdmin
          scopeLabel={teacherFilter === ALL_TEACHERS ? "Todos os alunos" : `Turma de ${teacherName(teacherFilter)}`}
          headerRight={teacherFilterSelect}
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

      {tab === "entregas" && (
        <SubmissionReviewer
          key={`entregas-${teacherFilter}`}
          submissions={teacherFilter === ALL_TEACHERS ? submissions : submissions.filter((s) => s.teacherId === teacherFilter)}
          students={students}
          missions={missions}
          headerRight={teacherFilterSelect}
        />
      )}

      {tab === "loja" && <ShopManager />}

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
          teacherName={teacherName}
          onSelect={setEditorTarget}
        />
      )}

      {tab === "eventos" && (
        <EventMissionsManager
          key={eventTeacher}
          runs={eventRuns[eventTeacher] ?? {}}
          missions={missionsOf(eventTeacher)}
          students={studentsOf(eventTeacher)}
          ranking={{ students, missions }}
          onStart={(eventId) => startEvent(eventTeacher, eventId)}
          onEnd={(eventId) => endEvent(eventTeacher, eventId)}
          onReleasePhase={(eventId, phase) => releasePhase(eventTeacher, eventId, phase)}
          onClosePhase={(eventId, phase) => closePhase(eventTeacher, eventId, phase)}
          onEdit={setEditorTarget}
          onCreate={createEventMission}
          onAssign={(missionId, eventId, phase) => editMission(missionId, eventMissionFields(eventId, phase))}
          onUnassign={(missionId) => editMission(missionId, { eventId: undefined, eventPhase: undefined })}
          onAddPresets={addEventPresets}
          headerRight={
            <label className="flex items-center gap-2 text-xs text-slate-400">
              Turma do professor
              <select
                value={eventTeacher}
                onChange={(e) => setEventTeacherId(e.target.value)}
                className="rounded-lg border border-slate-700 bg-cg-sunken px-3 py-1.5 text-xs text-slate-100 focus:border-slate-400 focus:outline-none"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                    {t.isAdmin ? " (você)" : ""}
                  </option>
                ))}
              </select>
            </label>
          }
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
          shopItems={shopItems}
          isAdmin
          onClose={() => setSelectedStudentId(null)}
        />
      )}

      {editorTarget && (
        <MissionEditor
          existingMission={editorTarget === "new" ? undefined : editorTarget}
          teachers={teachers}
          newKind={newKind}
          defaultTeacherId={newMissionEvent ? eventTeacher : teacherFilter === ALL_TEACHERS ? admin.id : teacherFilter}
          shopItems={shopItems}
          eventLabel={editorTarget === "new" ? (newMissionEvent ? eventMissionLabel(newMissionEvent.eventId, newMissionEvent.phase) : undefined) : eventMissionLabel(editorTarget.eventId, editorTarget.eventPhase)}
          onSave={handleSaveMission}
          onDelete={editorTarget !== "new" ? handleDeleteMission : undefined}
          onClose={closeEditor}
        />
      )}
    </div>
  );
}
