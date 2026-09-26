"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useStudents } from "@/engine/store";
import { HOUSES, House } from "@/engine/houses";
import { FOUNDING_LEGEND, HOUSE_LORE } from "@/engine/houseLore";
import { Student, totalXp } from "@/engine/students";
import { Crest, HouseScene } from "@/components/guilds/HouseAnimals";
import { Stars } from "@/components/events/common";

// ============================================================================
// GUILDAS — onde o aluno conhece as quatro casas: a Lenda da Fundação, uma
// seção pra cada casa (o animal animado no cenário dela, brasão, lema,
// fundador, história, salão comunal, especialidade e dados de verdade da
// plataforma) e a disputa da Taça das Guildas. Sempre escura, nos dois temas.
// ============================================================================

/** Aparece subindo quando entra na tela (sem IntersectionObserver, aparece direto). */
function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`${shown ? "cg-anim-rise" : "opacity-0"} ${className}`}>
      {children}
    </div>
  );
}

interface HouseStats {
  members: number;
  points: number;
  top: Student | null;
}

function statsOf(house: House, students: Student[]): HouseStats {
  const members = students.filter((s) => s.houseId === house.id);
  const top = [...members].sort((a, b) => totalXp(b.level, b.xp) - totalXp(a.level, a.xp))[0] ?? null;
  return { members: members.length, points: members.reduce((sum, s) => sum + totalXp(s.level, s.xp), 0), top };
}

function HouseSection({ house, index, stats, mine }: { house: House; index: number; stats: HouseStats; mine: boolean }) {
  const lore = HOUSE_LORE[house.id];
  const flip = index % 2 === 1;
  return (
    <section id={house.id} className="scroll-mt-6">
      <Reveal>
        <div
          className={`cg-dark-scope grid gap-6 overflow-hidden rounded-3xl border p-5 sm:p-7 md:grid-cols-2 md:items-center ${house.borderClass}`}
          style={{ background: `radial-gradient(60% 50% at ${flip ? "0%" : "100%"} 0%, ${house.hex}30, transparent 70%), linear-gradient(160deg, #0b0b12 0%, #12121f 100%)` }}
        >
          <div className={flip ? "md:order-2" : ""}>
            <HouseScene house={house} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${house.colorClass} ${house.borderClass} ${house.bgClass}`}>
                {lore.guildTitle}
              </span>
              <span className="rounded-full border border-slate-600 bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-200">{house.virtue}</span>
              {mine && <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-wider text-cg-ink">✦ Sua casa</span>}
            </div>
            <h2 className={`mt-3 text-4xl font-black uppercase tracking-wide sm:text-5xl ${house.colorClass}`} style={{ textShadow: `0 0 24px ${house.hex}99` }}>
              {house.name}
            </h2>
            <p className="mt-1 text-sm text-slate-400">{house.description}</p>

            <blockquote className="mt-4 border-l-4 pl-4 text-base italic text-slate-100" style={{ borderColor: house.hex }}>
              “{lore.motto}”
            </blockquote>
            <p className="mt-1 pl-5 text-xs text-slate-500">Fundada por {lore.founder}</p>

            <p className="mt-4 text-sm leading-relaxed text-slate-300">{lore.story}</p>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-700/60 bg-black/30 p-3">
                <p className={`text-[11px] font-bold uppercase tracking-wider ${house.colorClass}`}>🏛️ Salão comunal</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">{lore.commonRoom}</p>
              </div>
              <div className="rounded-xl border border-slate-700/60 bg-black/30 p-3">
                <p className={`text-[11px] font-bold uppercase tracking-wider ${house.colorClass}`}>💻 Na programação</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">{lore.specialty}</p>
              </div>
            </div>

            <p className="mt-4 text-xs font-semibold text-slate-400">Quem é da {house.name}...</p>
            <ul className="mt-1.5 grid gap-1 sm:grid-cols-2">
              {lore.traits.map((t) => (
                <li key={t} className="flex gap-2 text-sm text-slate-200">
                  <span className={house.colorClass}>✦</span>
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl border border-slate-700/60 bg-black/30 p-2.5">
                <p className="text-xl font-black text-white">{stats.members}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">Membros</p>
              </div>
              <div className="rounded-xl border border-slate-700/60 bg-black/30 p-2.5">
                <p className={`text-xl font-black ${house.colorClass}`}>{stats.points}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">Pontos</p>
              </div>
              <div className="rounded-xl border border-slate-700/60 bg-black/30 p-2.5">
                <p className="truncate text-sm font-bold text-white">{stats.top?.name ?? "—"}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">Destaque</p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function GuildasPage() {
  const { activeStudent, students } = useStudents();
  if (!activeStudent) return null;
  const me = activeStudent;

  const stats = Object.fromEntries(HOUSES.map((h) => [h.id, statsOf(h, students)])) as Record<House["id"], HouseStats>;
  const standings = [...HOUSES].sort((a, b) => stats[b.id].points - stats[a.id].points);
  const maxPoints = Math.max(1, ...HOUSES.map((h) => stats[h.id].points));

  return (
    <div className="flex flex-col gap-8">
      {/* ===== BANNER ===== */}
      <div
        className="cg-dark-scope relative overflow-hidden rounded-3xl border border-violet-500/30 px-6 pb-8 pt-10 text-center sm:px-10"
        style={{
          background:
            "radial-gradient(40% 50% at 12% 20%, rgba(248,113,113,0.25), transparent 70%), radial-gradient(40% 50% at 88% 20%, rgba(52,211,153,0.22), transparent 70%), radial-gradient(40% 50% at 15% 95%, rgba(251,191,36,0.22), transparent 70%), radial-gradient(40% 50% at 85% 95%, rgba(96,165,250,0.25), transparent 70%), linear-gradient(180deg, #05030f 0%, #150a2e 60%, #0b0b12 100%)",
        }}
      >
        <Stars />
        <p className="relative text-[11px] font-semibold uppercase tracking-[0.3em] text-violet-200">⚜️ Guildas da CodeGuilds</p>
        <h1 className="cg-anim-shimmer relative mt-2 text-4xl font-black uppercase tracking-wide sm:text-6xl">As Quatro Guildas</h1>
        <p className="relative mx-auto mt-3 max-w-2xl text-sm text-violet-100/80 sm:text-base">
          Coragem, astúcia, lealdade e lógica. Conheça as casas que protegem o Código-Fonte desde a noite em que o Grande Bug foi aprisionado.
        </p>

        <div className="relative mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          {HOUSES.map((h, i) => (
            <a key={h.id} href={`#${h.id}`} className="group flex flex-col items-center gap-2">
              <div className="cg-anim-float w-full max-w-[150px] transition-transform group-hover:scale-110" style={{ animationDelay: `${i * 0.5}s` }}>
                <Crest house={h} size={180} priority />
              </div>
              <span className={`text-sm font-black uppercase tracking-wider ${h.colorClass}`}>{h.name.replace("Casa ", "")}</span>
              <span className="text-[11px] text-slate-400">
                {h.animal} • {h.virtue}
              </span>
              {me.houseId === h.id && <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black uppercase text-cg-ink">✦ Sua casa</span>}
            </a>
          ))}
        </div>
        <p className="relative mt-6 text-xs text-slate-500">Clique num brasão pra ir direto pra história da casa ↓</p>
      </div>

      {/* ===== A LENDA DA FUNDAÇÃO ===== */}
      <Reveal>
        <div
          className="cg-dark-scope relative overflow-hidden rounded-3xl border border-amber-400/30 p-6 sm:p-10"
          style={{ background: "radial-gradient(60% 60% at 50% 0%, rgba(251,191,36,0.14), transparent 70%), linear-gradient(180deg, #16110a 0%, #0f0c08 100%)" }}
        >
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-300/80">📜 Capítulo I</p>
          <h2 className="mt-1 text-center text-3xl font-black uppercase tracking-wide text-amber-200 sm:text-4xl" style={{ textShadow: "0 0 20px rgba(251,191,36,0.4)" }}>
            A Lenda da Fundação
          </h2>
          <div className="mx-auto mt-6 flex max-w-3xl flex-col gap-4 text-[15px] leading-relaxed text-amber-50/85">
            {FOUNDING_LEGEND.map((p, i) => (
              <p key={i} className={i === 0 ? "first-letter:float-left first-letter:mr-2 first-letter:text-5xl first-letter:font-black first-letter:leading-none first-letter:text-amber-300" : ""}>
                {p}
              </p>
            ))}
          </div>
          <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-3">
            {HOUSES.map((h) => (
              <Crest key={h.id} house={h} size={80} className="w-14 sm:w-16" />
            ))}
          </div>
        </div>
      </Reveal>

      {/* ===== AS CASAS ===== */}
      {HOUSES.map((h, i) => (
        <HouseSection key={h.id} house={h} index={i} stats={stats[h.id]} mine={me.houseId === h.id} />
      ))}

      {/* ===== A TAÇA DAS GUILDAS ===== */}
      <Reveal>
        <div
          className="cg-dark-scope relative overflow-hidden rounded-3xl border border-amber-400/40 p-6 text-center sm:p-10"
          style={{ background: "radial-gradient(50% 60% at 50% 0%, rgba(251,191,36,0.3), transparent 70%), linear-gradient(180deg, #1c1305 0%, #0b0b12 100%)" }}
        >
          <p className="cg-anim-float text-6xl">🏆</p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-wide text-amber-200 sm:text-4xl" style={{ textShadow: "0 0 20px rgba(251,191,36,0.5)" }}>
            A Taça das Guildas
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-amber-50/80">
            Cada XP que um aluno conquista vira pontos pra sua guilda. A guilda com mais pontos ergue a Taça e tem o nome gravado no Salão Principal do castelo. Qual guilda vai levar desta vez?
          </p>

          <div className="mx-auto mt-6 flex max-w-2xl flex-col gap-3 text-left">
            {standings.map((h, i) => {
              const s = stats[h.id];
              return (
                <div key={h.id} className={`flex items-center gap-3 rounded-2xl border bg-black/30 p-3 ${i === 0 ? "border-amber-300/60" : "border-slate-700/60"}`}>
                  <span className="w-8 text-center text-2xl">{["🥇", "🥈", "🥉", "4º"][i]}</span>
                  <Crest house={h} size={60} className="w-11 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className={`font-bold ${h.colorClass}`}>
                        {h.name}
                        {me.houseId === h.id && <span className="ml-2 text-[10px] font-black uppercase text-white">✦ sua casa</span>}
                      </span>
                      <span className="text-slate-300">
                        <b className="text-white">{s.points}</b> pts • {s.members} {s.members === 1 ? "membro" : "membros"}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full rounded-full" style={{ width: `${(s.points / maxPoints) * 100}%`, backgroundColor: h.hex, boxShadow: `0 0 12px ${h.hex}` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Link href="/academia/casa" className="mt-6 inline-block rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-black uppercase tracking-wider text-cg-ink shadow-lg shadow-amber-500/30 transition-transform hover:scale-[1.04]">
            Ver o ranking completo →
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
