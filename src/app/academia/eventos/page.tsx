"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStudents, useMissions } from "@/engine/store";
import { Mission } from "@/engine/missions";
import { Student } from "@/engine/students";
import { ACADEMY_EVENTS, AcademyEvent, eventMissionsFor, eventProgress, introSeenPatch } from "@/engine/specialEvents";
import { EVENT_VISUALS } from "@/components/events/registry";
import EventScene from "@/components/EventScene";
import { CoinIcon, RarityBadge } from "@/components/GameUI";

// ============================================================================
// SALÃO DOS EVENTOS — o banner e um card grande por evento. "Entrar" na
// primeira vez abre a cena de abertura em tela cheia; depois de ver (ou pular),
// vai direto pra tela do evento (/academia/eventos/[id]).
// ============================================================================

// Enfeites flutuando no banner: [emoji, esquerda %, topo %, tamanho, atraso].
const BANNER_DECOR: [string, number, number, number, number][] = [
  ["🎃", 5, 16, 26, 0],
  ["🧟", 24, 70, 20, 0.9],
  ["👻", 43, 10, 20, 1.7],
  ["☣️", 62, 76, 18, 0.5],
  ["✦", 74, 20, 14, 2.2],
  ["🦇", 90, 12, 22, 1.3],
  ["🧪", 95, 68, 16, 2.8],
];

function EventCard({ event, student, missions, onEnter }: { event: AcademyEvent; student: Student; missions: Mission[]; onEnter: () => void }) {
  const visual = EVENT_VISUALS[event.id];
  const { Art, ProgressIcon } = visual;
  const list = eventMissionsFor(missions, event.id, student.teacherId);
  const done = list.filter((m) => student.completedMissionIds.includes(m.id)).length;
  const progress = eventProgress(student, event.id);

  const status = progress.finishedAt
    ? { label: "🏆 Concluído", className: "border-emerald-400/60 bg-emerald-500/20 text-emerald-200" }
    : progress.introSeenAt
      ? { label: `🔥 Em andamento • ${done}/${list.length}`, className: "border-orange-400/60 bg-orange-500/20 text-orange-200" }
      : { label: "✨ Novo evento", className: "border-amber-300/60 bg-amber-400/20 text-amber-100" };

  const buttonLabel = progress.finishedAt ? `Ver o evento ${event.icon}` : progress.introSeenAt ? "Continuar o evento →" : `${event.icon} Entrar no evento`;

  return (
    <div className={`cg-dark-scope group relative overflow-hidden rounded-3xl border ${visual.borderClass}`} style={{ boxShadow: `0 24px 70px -30px ${visual.glow}` }}>
      {/* ---- pôster animado ---- */}
      <div className="relative h-64 sm:h-80">
        <Art art="poster" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur ${status.className}`}>{status.label}</span>
          <span className="rounded-full border border-slate-500/50 bg-black/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-200 backdrop-blur">⏳ Por tempo limitado</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
          <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${visual.accentClass}`}>{event.tagline}</p>
          <h2 className={`mt-1 text-3xl font-black uppercase leading-tight sm:text-5xl ${visual.titleClass}`} style={{ textShadow: visual.titleGlow }}>
            {event.title}
          </h2>
        </div>
      </div>

      {/* ---- história, progresso e recompensa ---- */}
      <div className="relative p-5 sm:p-7" style={{ background: visual.panelBackground }}>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">{event.summary}</p>
        <p className={`mt-2 text-sm font-semibold ${visual.accentClass}`}>🎯 {event.goal}</p>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-700/60 bg-black/30 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Seu progresso</p>
            {list.length === 0 ? (
              <p className="mt-2 text-sm text-slate-400">Seu professor ainda está preparando as missões deste evento, mas a história já pode começar!</p>
            ) : (
              <>
                <div className="mt-2 flex flex-wrap items-end gap-2">
                  {list.map((m, i) => (
                    <ProgressIcon key={m.id} lit={student.completedMissionIds.includes(m.id)} delay={i * 0.15} className="h-12 w-auto" />
                  ))}
                </div>
                <p className="mt-2 text-sm text-slate-300">
                  <span className={`font-bold ${visual.accentClass}`}>
                    {done} de {list.length}
                  </span>{" "}
                  {list.length === 1 ? visual.progressNoun.one : visual.progressNoun.many} {visual.progressNoun.doneMany}
                </p>
              </>
            )}
          </div>

          <div className="rounded-2xl border border-amber-400/30 bg-black/30 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-200/80">🏆 Recompensa final</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-400/40 bg-amber-400/10 text-2xl">{event.reward.item.icon}</span>
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 font-semibold text-white">
                  {event.reward.item.name} <RarityBadge rarity={event.reward.item.rarity} />
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-3 text-sm">
                  <span className="font-bold text-violet-300">✦ +{event.reward.xp} XP</span>
                  <span className="flex items-center gap-1 font-bold text-amber-300">
                    <CoinIcon size={15} /> +{event.reward.coins}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <button onClick={onEnter} className={`mt-6 w-full rounded-full px-6 py-3.5 text-base font-black uppercase tracking-wider transition-transform hover:scale-[1.02] sm:w-auto ${visual.buttonClass}`}>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

export default function EventosPage() {
  const router = useRouter();
  const { activeStudent, patchActive } = useStudents();
  const { missions, ready } = useMissions();
  const [introOf, setIntroOf] = useState<AcademyEvent | null>(null);

  if (!activeStudent || !ready) return null;
  const me = activeStudent;

  function enter(event: AcademyEvent) {
    if (eventProgress(me, event.id).introSeenAt) router.push(`/academia/eventos/${event.id}`);
    else setIntroOf(event);
  }

  // Viu a abertura até o fim ou pulou: fica marcado e o aluno vai pra tela do evento.
  function closeIntro() {
    if (!introOf) return;
    patchActive(introSeenPatch(me, introOf.id));
    router.push(`/academia/eventos/${introOf.id}`);
    setIntroOf(null);
  }

  return (
    <div>
      {/* ===== BANNER ===== sempre escuro, nos dois temas */}
      <div
        className="cg-dark-scope relative mb-6 overflow-hidden rounded-3xl border border-orange-500/30 p-6 sm:p-8"
        style={{
          background:
            "radial-gradient(60% 80% at 85% 30%, rgba(249,115,22,0.32), transparent 70%), radial-gradient(50% 70% at 10% 90%, rgba(126,34,206,0.5), transparent 70%), linear-gradient(135deg, #0c0a09 0%, #2e1065 55%, #431407 100%)",
        }}
      >
        {BANNER_DECOR.map(([emoji, left, top, size, delay], i) => (
          <span
            key={i}
            aria-hidden="true"
            className="cg-anim-float pointer-events-none absolute select-none text-orange-200"
            style={{ left: `${left}%`, top: `${top}%`, fontSize: size, animationDelay: `${delay}s`, opacity: 0.75 }}
          >
            {emoji}
          </span>
        ))}
        <div className="relative text-center sm:text-left">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-200">📅 Eventos da Academia</p>
          <h1 className="cg-anim-shimmer mt-2 text-4xl font-black uppercase tracking-wide sm:text-5xl">Salão dos Eventos</h1>
          <p className="mt-2 max-w-xl text-sm text-orange-50/80">
            Histórias especiais, missões exclusivas e recompensas lendárias que só existem por tempo limitado. Entre... se tiver coragem!
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
            <span className="rounded-full border border-orange-400/40 bg-black/30 px-3 py-1.5 text-xs font-semibold text-orange-100 backdrop-blur">
              🔥 {ACADEMY_EVENTS.length} {ACADEMY_EVENTS.length === 1 ? "evento acontecendo" : "eventos acontecendo"}
            </span>
            <span className="rounded-full border border-amber-400/40 bg-black/30 px-3 py-1.5 text-xs font-semibold text-amber-100 backdrop-blur">🏆 Recompensas lendárias</span>
            <span className="rounded-full border border-violet-400/40 bg-black/30 px-3 py-1.5 text-xs font-semibold text-violet-100 backdrop-blur">🎬 Com história animada</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {ACADEMY_EVENTS.map((event) => (
          <EventCard key={event.id} event={event} student={me} missions={missions} onEnter={() => enter(event)} />
        ))}
      </div>

      {introOf && <EventScene event={introOf} kind="intro" student={me} onClose={closeIntro} />}
    </div>
  );
}
