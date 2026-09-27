"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStudents, useTeachers } from "@/engine/store";
import { MULTIVERSE_WORLDS, MultiverseWorld, spendMultiverseAccessPatch } from "@/engine/multiverse";
import { isSoundMuted, playCosmicAmbience, setSoundMuted } from "@/engine/sfx";
import { pauseMusic, resumeMusic } from "@/engine/music";
import { BlackHole, Nebulae, PortalVortex, Starfield } from "@/components/multiverse/CosmicArt";

// ============================================================================
// SALA DO MULTIVERSO — página secreta em tela cheia: o buraco negro no centro
// e os portais pra outros mundos em volta (no futuro, cada um leva a missões
// secretas; por enquanto estão selados).
//
// Quem entra: professor/ADM sempre (?modo=mestre, pelo botão dos painéis); o
// aluno só com o passe de uma 🌀 Chave do Multiverso usada no Inventário. O
// passe é gasto ao entrar: sair (ou recarregar a página) fecha o portal.
// ============================================================================

type Mode = "carregando" | "mestre" | "aluno" | "fechado";

const INTRO_MS = 3200;

// Posição de cada portal em volta do buraco negro (tela larga): [esquerda %, topo %].
const RING_POSITIONS: [number, number][] = [
  [50, 1],
  [86, 25],
  [74, 64],
  [26, 64],
  [14, 25],
];

export default function MultiversoPage() {
  const router = useRouter();
  const { activeStudent, ready, patchActive } = useStudents();
  const { currentTeacher, ready: teachersReady } = useTeachers();
  const [mode, setMode] = useState<Mode>("carregando");
  const [backTo, setBackTo] = useState("/professor/painel");
  const [intro, setIntro] = useState(true);
  const [selected, setSelected] = useState<MultiverseWorld | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);

  // Quem está entrando: mestre (sempre pode) ou aluno com o passe da chave (gasto agora).
  useEffect(() => {
    if (!ready || !teachersReady || mode !== "carregando") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("volta") === "admin") setBackTo("/admin/painel");
    if (params.get("modo") === "mestre" && currentTeacher) {
      setMode("mestre");
      return;
    }
    if (activeStudent?.multiverseAccess) {
      setMode("aluno");
      patchActive(spendMultiverseAccessPatch());
      return;
    }
    setMode("fechado");
  }, [ready, teachersReady, mode, currentTeacher, activeStudent, patchActive]);

  // Entrada: o salto pelo hiperespaço (quem pede menos movimento pula direto).
  useEffect(() => {
    if (mode !== "mestre" && mode !== "aluno") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIntro(false);
      return;
    }
    const timer = window.setTimeout(() => setIntro(false), INTRO_MS);
    return () => window.clearTimeout(timer);
  }, [mode]);

  // Som: a música do castelo pausa; o zumbido cósmico toca se o som estiver ligado.
  useEffect(() => {
    if (mode !== "mestre" && mode !== "aluno") return;
    setSoundOn(!isSoundMuted());
    pauseMusic();
    return () => resumeMusic();
  }, [mode]);
  useEffect(() => {
    if (!soundOn || (mode !== "mestre" && mode !== "aluno")) return;
    return playCosmicAmbience();
  }, [soundOn, mode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    setSoundMuted(!next);
  }

  function leave() {
    if (mode === "aluno" && !confirmExit) {
      setConfirmExit(true);
      return;
    }
    router.push(mode === "mestre" ? backTo : "/academia/inventario");
  }

  if (mode === "carregando") return <div className="fixed inset-0" style={{ background: "#030014" }} />;

  // ---------------- portal fechado ----------------
  if (mode === "fechado") {
    const locked = MULTIVERSE_WORLDS[0];
    return (
      <div className="cg-dark-scope fixed inset-0 flex flex-col items-center justify-center overflow-hidden px-6 text-center" style={{ background: "radial-gradient(circle at 50% 40%, #1e1b4b 0%, #030014 70%)" }}>
        <Starfield warp={false} />
        <div className="relative w-48 opacity-40 grayscale">
          <PortalVortex world={locked} />
        </div>
        <p className="relative mt-6 text-3xl">🔒</p>
        <h1 className="relative mt-2 text-2xl font-black uppercase tracking-widest text-slate-200">O portal está fechado</h1>
        <p className="relative mt-2 max-w-md text-sm text-slate-400">
          Só quem usa uma 🌀 Chave do Multiverso consegue atravessar. Complete missões e fique de olho nos presentes do seu professor: quem sabe uma chave aparece no seu Inventário...
        </p>
        <button onClick={() => router.push(activeStudent ? "/academia/inventario" : "/entrar")} className="relative mt-6 rounded-full border border-slate-600 bg-black/40 px-5 py-2 text-sm font-semibold text-slate-200 hover:border-slate-400">
          ← Voltar
        </button>
      </div>
    );
  }

  // ---------------- a sala ----------------
  return (
    <div className="cg-dark-scope fixed inset-0 overflow-y-auto overflow-x-hidden" style={{ background: "#030014" }}>
      <div className="pointer-events-none fixed inset-0">
        <Starfield warp={intro} />
        <Nebulae />
      </div>

      {/* topo */}
      <div className="sticky top-0 z-20 flex items-center justify-between gap-3 bg-gradient-to-b from-black/70 to-transparent px-4 py-3 sm:px-6">
        <p className="flex min-w-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-violet-200">
          🌀 <span className="truncate">Sala do Multiverso</span>
          <span className="hidden rounded-full border border-violet-400/50 bg-violet-500/15 px-2 py-0.5 text-[10px] tracking-wider text-violet-100 sm:inline">
            {mode === "mestre" ? `🧙 Modo Mestre • ${currentTeacher?.name ?? ""}` : `✦ Viajante: ${activeStudent?.name ?? ""}`}
          </span>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={toggleSound}
            title={soundOn ? "Desligar o som" : "Ligar o som do espaço"}
            aria-label={soundOn ? "Desligar o som" : "Ligar o som do espaço"}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-violet-400/50 bg-black/50 text-sm"
          >
            {soundOn ? "🔊" : "🔇"}
          </button>
          <button
            onClick={leave}
            onBlur={() => setConfirmExit(false)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              confirmExit ? "border-rose-300 bg-rose-500/30 text-rose-50" : "border-slate-500 bg-black/50 text-slate-200 hover:border-slate-300"
            }`}
          >
            {mode === "mestre" ? "← Voltar ao painel" : confirmExit ? "Sair? O portal vai se fechar" : "🚪 Sair da sala"}
          </button>
        </div>
      </div>

      <div className={`relative z-10 mx-auto max-w-6xl px-4 pb-16 transition-opacity duration-1000 ${intro ? "opacity-0" : "opacity-100"}`}>
        <div className="mt-2 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.5em] text-cyan-200/80">✦ Entre todos os mundos ✦</p>
          <h1 className="cg-anim-shimmer-cosmic mt-2 text-4xl font-black uppercase tracking-wider sm:text-6xl">Sala do Multiverso</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-violet-100/80">
            No coração da sala, um buraco negro dobra o espaço e o tempo. À volta dele, portais se abrem para outros universos. Cada mundo guarda segredos, e um dia seus portais vão levar a
            missões que ninguém da CodeGuilds jamais viu.
          </p>
        </div>

        {/* tela larga: os portais em volta do buraco negro, ligados por feixes de energia */}
        <div className="relative mx-auto mt-6 hidden aspect-[16/11] w-full md:block">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
            {RING_POSITIONS.map(([x, y], i) => (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={x}
                y2={y + 11}
                stroke={MULTIVERSE_WORLDS[i].colors[1]}
                strokeWidth="0.25"
                strokeDasharray="1.2 2"
                strokeOpacity="0.7"
                className="cg-anim-dash"
                vectorEffect="non-scaling-stroke"
                style={{ strokeWidth: 2 }}
              />
            ))}
          </svg>
          <div className="absolute left-1/2 top-1/2 w-[30%] -translate-x-1/2 -translate-y-1/2">
            <BlackHole />
          </div>
          {MULTIVERSE_WORLDS.map((world, i) => {
            const [x, y] = RING_POSITIONS[i];
            return (
              <button
                key={world.id}
                onClick={() => setSelected(world)}
                className="group absolute flex w-[15%] -translate-x-1/2 flex-col items-center text-center focus:outline-none"
                style={{ left: `${x}%`, top: `${y}%` }}
                aria-label={`Portal para ${world.name}`}
              >
                <div className="w-full transition-transform duration-500 group-hover:scale-110 group-focus-visible:scale-110">
                  <PortalVortex world={world} />
                </div>
                <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: world.colors[1] }}>
                  {world.tagline}
                </span>
                <span className="text-sm font-black text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.9)]">{world.name}</span>
                <span className="mt-1 rounded-full border border-white/20 bg-black/50 px-2 py-0.5 text-[10px] text-slate-300">{world.href ? "✨ Aberto" : "🔒 Selado"}</span>
              </button>
            );
          })}
        </div>

        {/* celular: o buraco negro em cima e os portais em grade */}
        <div className="mt-6 md:hidden">
          <div className="mx-auto w-[70%] max-w-xs">
            <BlackHole />
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8">
            {MULTIVERSE_WORLDS.map((world, i) => (
              <button
                key={world.id}
                onClick={() => setSelected(world)}
                className={`flex flex-col items-center text-center ${i === MULTIVERSE_WORLDS.length - 1 ? "col-span-2 mx-auto w-1/2" : ""}`}
                aria-label={`Portal para ${world.name}`}
              >
                <PortalVortex world={world} />
                <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: world.colors[1] }}>
                  {world.tagline}
                </span>
                <span className="text-sm font-black text-white">{world.name}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="mt-10 text-center text-[11px] text-slate-500">
          {mode === "aluno" ? "Aproveite a viagem: quando você sair, o portal se fecha e só uma nova Chave do Multiverso abre ele de novo." : "Modo Mestre: você entra sempre que quiser."}
        </p>
      </div>

      {/* entrada: o salto pelo hiperespaço */}
      {intro && (
        <button type="button" onClick={() => setIntro(false)} className="fixed inset-0 z-30 flex flex-col items-center justify-center text-center">
          <span className="cg-anim-fade text-[11px] font-semibold uppercase tracking-[0.5em] text-cyan-100">Atravessando o portal...</span>
          <span className="cg-anim-title-flicker cg-anim-shimmer-cosmic mt-4 block text-4xl font-black uppercase sm:text-6xl">Multiverso</span>
          <span className="cg-anim-fade mt-8 text-[11px] text-slate-400" style={{ animationDelay: "1.5s" }}>
            clique pra chegar
          </span>
        </button>
      )}

      {/* janela do mundo */}
      {selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div
            className="cg-anim-pop relative w-full max-w-md overflow-hidden rounded-3xl border p-6 text-center"
            style={{ borderColor: `${selected.colors[1]}88`, background: `radial-gradient(circle at 50% 0%, ${selected.colors[0]}55, #05010f 70%)`, boxShadow: `0 0 80px -10px ${selected.colors[1]}` }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={selected.name}
          >
            <button onClick={() => setSelected(null)} className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 text-slate-300 hover:text-white">
              ✕
            </button>
            <div className="mx-auto w-44">
              <PortalVortex world={selected} />
            </div>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: selected.colors[1] }}>
              {selected.tagline}
            </p>
            <h2 className="text-2xl font-black text-white">{selected.name}</h2>
            <p className="mt-3 text-sm text-slate-300">{selected.lore}</p>
            {selected.href ? (
              <button onClick={() => router.push(selected.href!)} className="mt-5 rounded-full px-6 py-2.5 text-sm font-black text-cg-ink" style={{ background: `linear-gradient(90deg, ${selected.colors[1]}, ${selected.colors[2]})` }}>
                Atravessar o portal →
              </button>
            ) : (
              <p className="mt-5 rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-xs text-slate-300">
                🔒 Este portal ainda está selado. Em breve, as missões secretas deste universo vão aparecer aqui.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
