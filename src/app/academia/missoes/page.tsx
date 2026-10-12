"use client";

import { useStudents, useMissions } from "@/engine/store";
import { Mission } from "@/engine/missions";
import { OTHER_SUBJECTS, SUBJECTS, missionSubject } from "@/engine/subjects";
import LibraryBanner from "@/components/library/LibraryBanner";
import TomeCard from "@/components/library/TomeCard";

// ============================================================================
// BIBLIOTECA DE MISSÕES — a tela de Missões do aluno: o banner da biblioteca
// mágica com o Mago Danilo e um tomo (livro, pergaminho ou papiro) por
// matéria, com o progresso dele. Abrir um tomo leva pras missões só daquela
// matéria (/academia/missoes/[materia]), com a busca e os filtros.
// ============================================================================

export default function BibliotecaPage() {
  const { activeStudent } = useStudents();
  const { missions: allMissions, ready } = useMissions();

  if (!activeStudent || !ready) return null;

  // O aluno só vê as missões do professor que escolheu no cadastro; as de evento ficam na tela do evento.
  const missions = allMissions.filter((m) => m.teacherId === activeStudent.teacherId && !m.eventId);
  const completed = activeStudent.completedMissionIds;
  const doneIn = (list: Mission[]) => list.filter((m) => completed.includes(m.id)).length;
  const others = missions.filter((m) => missionSubject(m) === null);

  return (
    <div>
      <LibraryBanner total={missions.length} done={doneIn(missions)} subjects={SUBJECTS.length} />

      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <h2 className="font-serif text-lg font-black uppercase tracking-wide text-white">📚 Os tomos do conhecimento</h2>
        <p className="text-xs text-slate-400">Escolha uma matéria pra ver as missões dela</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {SUBJECTS.map((s, i) => {
          const list = missions.filter((m) => missionSubject(m) === s.id);
          return (
            <TomeCard key={s.id} id={s.id} name={s.name} tagline={s.tagline} total={list.length} done={doneIn(list)} href={`/academia/missoes/${s.id}`} delay={i * 0.08} />
          );
        })}
        {others.length > 0 && (
          <TomeCard
            id="outras"
            name="Outras missões"
            tagline="Missões que ainda não estão em nenhuma matéria"
            total={others.length}
            done={doneIn(others)}
            href={`/academia/missoes/${OTHER_SUBJECTS}`}
            delay={SUBJECTS.length * 0.08}
          />
        )}
      </div>
    </div>
  );
}
