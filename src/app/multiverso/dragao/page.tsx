"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStudents, useTeachers } from "@/engine/store";
import { MULTIVERSE_WORLDS, isOnMultiverseVisit } from "@/engine/multiverse";
import { isSoundMuted, playDragonAmbience, setSoundMuted } from "@/engine/sfx";
import { pauseMusic, resumeMusic } from "@/engine/music";
import { Starfield } from "@/components/multiverse/CosmicArt";
import DragonWorld from "@/components/multiverse/DragonWorld";
import { DRAGON_CAPTIONS, DragonMoment, dragonStartAt } from "@/engine/elderDragon";

// ============================================================================
// MUNDO 1 — DOMÍNIO DO DRAGÃO ANCESTRAL (/multiverso/dragao). Aberto pelo
// primeiro portal da Sala do Multiverso. Quem entra: professor/ADM no Modo
// Mestre (?modo=mestre) e o aluno que está viajando pelo multiverso (gastou a
// Chave na sala e ainda não saiu). O botão de voltar leva de volta pra sala
// sem gastar outra chave. A cena em si fica em components/multiverse/DragonWorld.
// ============================================================================

type Mode = "carregando" | "mestre" | "aluno" | "fechado";

const WORLD = MULTIVERSE_WORLDS.find((w) => w.id === "dragao")!;
const INTRO_MS = 2800;

const POWERS: [string, string, string][] = [
  ["🔥", "Chamas ancestrais", "O fogo mais antigo de todos: vermelho, laranja e ouro. Um sopro dele incendeia o horizonte inteiro."],
  ["✨", "Runas ancestrais", "Runas de ouro cobrem o corpo dele e acendem quando ele chama a magia de todos os universos."],
  ["💫", "Anel de runas", "Um círculo de runas gira em volta dele como um escudo que nenhuma magia atravessa."],
  ["🪽", "Asas de tempestade", "Cada batida das asas levanta um vendaval capaz de atravessar portais."],
  ["⚡", "Relâmpagos", "O céu do domínio dele vive em tempestade: os raios caem quando ele se aproxima."],
  ["🗣️", "O Rugido", "Dizem que dá pra ouvir o rugido dele até em outros universos."],
];

export default function DragonWorldPage() {
  const router = useRouter();
  const { activeStudent, ready } = useStudents();
  const { currentTeacher, ready: teachersReady } = useTeachers();
  const [mode, setMode] = useState<Mode>("carregando");
  const [intro, setIntro] = useState(true);
  const [soundOn, setSoundOn] = useState(false);
  const [moment, setMoment] = useState<DragonMoment>("chegada");
  const [loreOpen, setLoreOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [startAt, setStartAt] = useState(0);

  useEffect(() => {
    if (!ready || !teachersReady || mode !== "carregando") return;
    const params = new URLSearchParams(window.location.search);
    setQuery(params.toString());
    setStartAt(dragonStartAt(params.get("momento")));
    if (params.get("modo") === "mestre" && currentTeacher) setMode("mestre");
    else if (activeStudent && isOnMultiverseVisit(activeStudent.id)) setMode("aluno");
    else setMode("fechado");
  }, [ready, teachersReady, mode, currentTeacher, activeStudent]);

  // a travessia do portal (quem pede menos movimento pula)
  useEffect(() => {
    if (mode !== "mestre" && mode !== "aluno") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIntro(false);
      return;
    }
    const timer = window.setTimeout(() => setIntro(false), INTRO_MS);
    return () => window.clearTimeout(timer);
  }, [mode]);

  // som: a música do castelo pausa; o vento do mundo do dragão toca se o som estiver ligado
  useEffect(() => {
    if (mode !== "mestre" && mode !== "aluno") return;
    setSoundOn(!isSoundMuted());
    pauseMusic();
    return () => resumeMusic();
  }, [mode]);
  useEffect(() => {
    if (!soundOn || (mode !== "mestre" && mode !== "aluno")) return;
    return playDragonAmbience();
  }, [soundOn, mode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLoreOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onMoment = useCallback((m: DragonMoment) => setMoment(m), []);

  function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    setSoundMuted(!next);
  }

  function backToRoom() {
    const params = new URLSearchParams(query);
    params.delete("momento");
    params.set("chegada", "mundo");
    router.push(`/multiverso?${params.toString()}`);
  }

  if (mode === "carregando") return <div className="fixed inset-0" style={{ background: "#030014" }} />;

  if (mode === "fechado") {
    return (
      <div className="cg-dark-scope fixed inset-0 flex flex-col items-center justify-center overflow-hidden px-6 text-center" style={{ background: "radial-gradient(circle at 50% 40%, #7c2d12 0%, #0c0304 70%)" }}>
        <Starfield warp={false} />
        <p className="relative text-5xl opacity-60 grayscale">{WORLD.glyph}</p>
        <h1 className="relative mt-4 text-2xl font-black uppercase tracking-widest text-slate-200">O portal deste mundo está fechado</h1>
        <p className="relative mt-2 max-w-md text-sm text-slate-400">
          Só dá pra chegar ao {WORLD.name} atravessando a Sala do Multiverso com uma 🌀 Chave do Multiverso.
        </p>
        <button onClick={() => router.push(activeStudent ? "/academia/inventario" : "/entrar")} className="relative mt-6 rounded-full border border-slate-600 bg-black/40 px-5 py-2 text-sm font-semibold text-slate-200 hover:border-slate-400">
          ← Voltar
        </button>
      </div>
    );
  }

  const roaring = moment === "rugido";

  return (
    <div className="cg-dark-scope fixed inset-0 overflow-hidden" style={{ background: "linear-gradient(to bottom, #0d0406 0%, #1e0a0c 40%, #2a0d08 72%, #130605 100%)" }}>
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <Starfield warp={intro} />
      </div>

      <div className={`absolute inset-0 transition-opacity duration-1000 ${intro ? "opacity-0" : "opacity-100"}`}>
        <DragonWorld soundOn={soundOn} onMoment={onMoment} startAt={startAt} />
      </div>

      {/* topo */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-3 bg-gradient-to-b from-black/75 to-transparent px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-200">
            {WORLD.glyph} <span className="truncate">{WORLD.tagline} • {WORLD.name}</span>
          </p>
          <p className="mt-0.5 hidden text-[10px] tracking-wider text-orange-200/80 sm:block">
            {mode === "mestre" ? `🧙 Modo Mestre • ${currentTeacher?.name ?? ""}` : `✦ Viajante: ${activeStudent?.name ?? ""}`}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => setLoreOpen(true)}
            className="hidden rounded-full border border-amber-300/50 bg-black/50 px-3 py-1.5 text-xs font-semibold text-amber-100 hover:border-amber-200 sm:block"
          >
            📜 Quem é Vaelzhar?
          </button>
          <button
            onClick={toggleSound}
            title={soundOn ? "Desligar o som" : "Ligar o som (vento, fogo, magia e o rugido)"}
            aria-label={soundOn ? "Desligar o som" : "Ligar o som"}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-orange-300/50 bg-black/50 text-sm"
          >
            {soundOn ? "🔊" : "🔇"}
          </button>
          <button
            onClick={backToRoom}
            className="rounded-full border border-violet-300/60 bg-violet-950/60 px-3 py-1.5 text-xs font-semibold text-violet-100 shadow-lg shadow-violet-500/20 transition-colors hover:border-violet-200 hover:bg-violet-900/70"
          >
            🌀 Voltar<span className="hidden sm:inline"> pra Sala do Multiverso</span>
          </button>
        </div>
      </div>

      {/* título e legenda do momento */}
      {!intro && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-5 pt-16 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.5em] text-orange-200/80">O Dragão Ancestral</p>
          <h1 className="mt-1 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-2xl font-black uppercase tracking-wider text-transparent sm:text-4xl" style={{ filter: "drop-shadow(0 0 18px rgba(251,191,36,0.35))" }}>
            Vaelzhar
          </h1>
          <p key={moment} className="cg-anim-dragon-caption mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-orange-100 sm:text-sm">
            {DRAGON_CAPTIONS[moment]}
          </p>
          <button onClick={() => setLoreOpen(true)} className="pointer-events-auto mt-3 rounded-full border border-amber-300/40 bg-black/50 px-3 py-1 text-[11px] text-amber-100 sm:hidden">
            📜 Quem é Vaelzhar?
          </button>
        </div>
      )}

      {/* o rugido em letras enormes */}
      {roaring && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center pt-[16vh]">
          <p className="cg-anim-dragon-roar-text text-center text-4xl font-black uppercase tracking-[0.2em] text-amber-100 sm:text-7xl" style={{ textShadow: "0 0 30px #f97316, 0 0 60px #dc2626" }}>
            RROOAAARR!
          </p>
        </div>
      )}

      {/* travessia do portal */}
      {intro && (
        <button type="button" onClick={() => setIntro(false)} className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center">
          <span className="cg-anim-fade text-[11px] font-semibold uppercase tracking-[0.5em] text-orange-100">Atravessando o portal para o {WORLD.tagline}...</span>
          <span className="cg-anim-title-flicker mt-4 block bg-gradient-to-r from-amber-200 via-yellow-50 to-orange-300 bg-clip-text text-4xl font-black uppercase text-transparent sm:text-6xl">
            {WORLD.name}
          </span>
          <span className="cg-anim-fade mt-8 text-[11px] text-slate-400" style={{ animationDelay: "1.4s" }}>
            clique pra chegar
          </span>
        </button>
      )}

      {/* a lenda */}
      {loreOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={() => setLoreOpen(false)}>
          <div
            className="cg-anim-pop relative max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-amber-300/40 p-6"
            style={{ background: "radial-gradient(circle at 50% 0%, rgba(180,83,9,0.35), #07060f 70%)", boxShadow: "0 0 80px -12px rgba(251,191,36,0.6)" }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Quem é Vaelzhar"
          >
            <button onClick={() => setLoreOpen(false)} className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 text-slate-300 hover:text-white">
              ✕
            </button>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-orange-200">{WORLD.tagline} • A lenda</p>
            <h2 className="mt-1 text-2xl font-black text-amber-100">🐉 Vaelzhar, o Dragão Ancestral</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Antes da primeira estrela acender, Vaelzhar já voava pelo vazio. Ele viu os universos nascerem um por um e aprendeu todas as magias que existem, das mais simples às
              que ninguém mais lembra, e gravou cada uma delas em runas de ouro no próprio corpo. Do topo da Pirâmide Dourada, cercada pelos rios de lava, ele governa este
              mundo e vigia os portais do multiverso.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {POWERS.map(([icon, title, text]) => (
                <div key={title} className="rounded-2xl border border-orange-400/20 bg-black/40 p-3">
                  <p className="text-sm font-bold text-orange-100">
                    {icon} {title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">{text}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 rounded-2xl border border-amber-300/25 bg-amber-500/10 px-4 py-3 text-xs text-amber-100">
              ⚔️ Em breve: as missões secretas deste mundo. Dizem que quem provar seu valor para Vaelzhar ganha um pouco da magia ancestral...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
