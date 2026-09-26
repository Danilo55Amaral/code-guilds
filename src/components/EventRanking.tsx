"use client";

import { useState } from "react";
import Image from "next/image";
import { getHouse } from "@/engine/houses";
import { Mission } from "@/engine/missions";
import { Student, matchesStudentSearch, wornAvatar } from "@/engine/students";
import { AcademyEvent, eventStandings, houseEventStandings } from "@/engine/specialEvents";
import { EventStatus } from "@/engine/eventSchedule";
import { EVENT_VISUALS } from "./events/registry";
import Avatar from "./Avatar";
import SearchInput from "./SearchInput";
import { PaginationFooter, usePagination } from "./Pagination";

// ============================================================================
// RANKING DO EVENTO — só com a pontuação do evento (engine/specialEvents.ts):
// a casa campeã (ou liderando, se o evento ainda está acontecendo), o placar
// das 4 casas e o ranking dos alunos de todas as casas, com pódio, busca e
// 10 por página. `onSelect` abre o perfil do aluno (sem ele, a lista só mostra).
// ============================================================================

const PER_PAGE = 10;
const MEDALS = ["🥇", "🥈", "🥉"];

export default function EventRanking({
  event,
  students,
  missions,
  status,
  meId,
  onSelect,
}: {
  event: AcademyEvent;
  students: Student[];
  missions: Mission[];
  /** Encerrado = "Casa campeã"; acontecendo = "Liderando". */
  status: EventStatus;
  meId?: string;
  onSelect?: (studentId: string) => void;
}) {
  const visual = EVENT_VISUALS[event.id];
  const [search, setSearch] = useState("");
  const standings = eventStandings(students, missions, event);
  const houses = houseEventStandings(standings);
  const maxHousePoints = Math.max(1, ...houses.map((h) => h.points));
  const position = new Map(standings.map((st, i) => [st.student.id, i + 1]));
  const filtered = standings.filter((st) => matchesStudentSearch(st.student, search));
  const pager = usePagination(filtered, PER_PAGE, search);
  const leader = houses[0].points > 0 ? getHouse(houses[0].houseId) : null;
  const ended = status === "encerrado";
  const myPosition = meId ? position.get(meId) : undefined;
  const podium = [standings[1], standings[0], standings[2]];

  return (
    <div className={`cg-dark-scope overflow-hidden rounded-3xl border p-5 sm:p-6 ${visual.borderClass}`} style={{ background: visual.panelBackground }}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className={`text-xl font-black uppercase tracking-wide ${visual.titleClass}`} style={{ textShadow: visual.titleGlow }}>
            🏆 Ranking do evento
          </h2>
          <p className="mt-1 text-xs text-slate-300">
            {event.icon} {event.title}: só vale a pontuação do evento (XP das missões do evento + recompensa final). Todas as casas juntas.
          </p>
        </div>
        {myPosition && (
          <span className="rounded-full border border-amber-400/40 bg-black/40 px-3 py-1 text-xs font-semibold text-amber-200">
            Você está em #{myPosition} de {standings.length}
          </span>
        )}
      </div>

      {standings.length === 0 ? (
        <p className="rounded-2xl border border-slate-700/60 bg-black/30 px-4 py-8 text-center text-sm text-slate-300">
          Ninguém pontuou neste evento ainda. Seja o primeiro a vencer uma missão!
        </p>
      ) : (
        <>
          {/* ---- casa campeã ---- */}
          {leader && (
            <div
              className="mb-4 flex items-center gap-4 rounded-2xl border-2 p-4"
              style={{ borderColor: `${leader.hex}99`, background: `linear-gradient(90deg, ${leader.hex}33, rgba(0,0,0,0.35))`, boxShadow: `0 0 40px -12px ${leader.hex}` }}
            >
              <div className={`cg-anim-float flex h-14 w-14 shrink-0 items-center justify-center rounded-xl p-1.5 ${leader.bgClass}`}>
                <Image src={leader.crest} alt={leader.name} width={52} height={52} className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200">{ended ? "👑 Casa campeã do evento" : "👑 Casa liderando o evento"}</p>
                <p className={`text-2xl font-black ${leader.colorClass}`}>{leader.name}</p>
                <p className="text-xs text-slate-300">
                  {houses[0].points} pts de evento • {houses[0].participants} {houses[0].participants === 1 ? "participante" : "participantes"}
                </p>
              </div>
            </div>
          )}

          {/* ---- placar das casas ---- */}
          <div className="mb-5 grid gap-2 sm:grid-cols-2">
            {houses.map((h, i) => {
              const house = getHouse(h.houseId);
              return (
                <div key={h.houseId} className="rounded-xl border border-slate-700/60 bg-black/30 p-3">
                  <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
                    <span className={`font-semibold ${house.colorClass}`}>
                      {i + 1}º {house.name}
                    </span>
                    <span className="text-slate-300">
                      <b className="text-white">{h.points}</b> pts • {h.participants} {h.participants === 1 ? "aluno" : "alunos"}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full transition-all" style={{ width: `${(h.points / maxHousePoints) * 100}%`, backgroundColor: house.hex }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ---- pódio dos alunos ---- */}
          {!search.trim() && (
            <div className="mb-4 grid grid-cols-3 items-end gap-2 sm:gap-4">
              {podium.map((st, slot) => {
                if (!st) return <div key={slot} />;
                const place = position.get(st.student.id)!;
                const house = getHouse(st.student.houseId!);
                const first = place === 1;
                const Tag = onSelect ? "button" : "div";
                return (
                  <Tag
                    key={st.student.id}
                    onClick={onSelect ? () => onSelect(st.student.id) : undefined}
                    className={`flex flex-col items-center gap-1.5 rounded-2xl border px-2 pb-3 text-center transition-transform ${onSelect ? "hover:-translate-y-1" : ""} ${
                      first ? "border-amber-400/60 bg-amber-400/10 pt-4" : "border-slate-700/60 bg-black/30 pt-3"
                    } ${st.student.id === meId ? "ring-2 ring-white/60" : ""}`}
                  >
                    <span className={first ? "text-3xl" : "text-2xl"}>{MEDALS[place - 1]}</span>
                    <Avatar config={wornAvatar(st.student)} ringColor={house.hex} size={first ? 72 : 56} />
                    <span className="w-full truncate text-sm font-semibold text-white">{st.student.name}</span>
                    <span className={`text-[11px] ${house.colorClass}`}>{house.name}</span>
                    <span className={`text-xs font-bold ${visual.accentClass}`}>{st.points} pts</span>
                  </Tag>
                );
              })}
            </div>
          )}

          <SearchInput value={search} onChange={setSearch} placeholder="Buscar aluno por nome, nível ou casa…" className="mb-3" />

          {/* ---- lista dos alunos ---- */}
          {filtered.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-400">Nenhum participante encontrado para &quot;{search.trim()}&quot;.</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {pager.pageItems.map((st) => {
                const place = position.get(st.student.id)!;
                const house = getHouse(st.student.houseId!);
                const isYou = st.student.id === meId;
                const Tag = onSelect ? "button" : "div";
                return (
                  <Tag
                    key={st.student.id}
                    onClick={onSelect ? () => onSelect(st.student.id) : undefined}
                    className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
                      isYou ? "bg-white text-cg-ink" : `border border-slate-700/70 bg-black/40 text-slate-200 ${onSelect ? "hover:border-slate-500" : ""}`
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-2.5 text-sm">
                      <span className="w-7 shrink-0 text-center text-xs font-bold opacity-70">{place <= 3 ? <span className="text-base">{MEDALS[place - 1]}</span> : `#${place}`}</span>
                      <Avatar config={wornAvatar(st.student)} ringColor={house.hex} size={34} />
                      <span className="min-w-0">
                        <span className="block truncate font-medium">
                          {st.student.name} {isYou && <span className="text-xs opacity-60">(você)</span>}
                        </span>
                        <span className={`block text-[11px] ${isYou ? "opacity-70" : house.colorClass}`}>
                          {house.name} • {st.missionsDone} {st.missionsDone === 1 ? "missão" : "missões"}
                          {st.finished && " • 🏆 finalizou"}
                        </span>
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-black">{st.points} pts</span>
                  </Tag>
                );
              })}
            </div>
          )}
          <PaginationFooter pager={pager} noun="participantes" />
        </>
      )}
    </div>
  );
}
