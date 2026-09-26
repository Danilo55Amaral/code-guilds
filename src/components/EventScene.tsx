"use client";

import { useEffect, useRef, useState } from "react";
import { AcademyEvent, SceneSound, SceneSpeaker } from "@/engine/specialEvents";
import { Student } from "@/engine/students";
import { isSoundMuted, playLaser, playMagicChime, playMidnightBell, playSiren, playSpookyAmbience, playThunder, playUfoHum, playVictoryFanfare, playZombieGroan, setSoundMuted, speakCharacter } from "@/engine/sfx";
import { pauseMusic, resumeMusic } from "@/engine/music";
import { EVENT_VISUALS, EventVisual } from "./events/registry";

// ============================================================================
// CENA DE EVENTO — a história do evento em tela cheia, como um filme:
// vinheta com o título, faixas pretas de cinema, o desenho de cada cena
// entrando com zoom e um balão de fala no estilo visual novel (texto sendo
// "digitado", nome e cor de quem fala). Com o som ligado: fundo sombrio,
// efeito de cada cena (sino, trovão, plim, fanfarra) e a voz do personagem.
// Abertura (`kind="intro"`) e final (`kind="outro"`) usam o mesmo player.
// Fechar de qualquer jeito (terminar, "Pular" ou Esc) chama onClose.
// ============================================================================

const CHARS_PER_TICK = 2;
const TICK_MS = 24;
const TITLE_CARD_MS = 3400;

interface SpeakerStyle {
  name: string;
  icon: string;
  plate: string;
  border: string;
  glow: string;
  voice: { pitch: number; rate: number };
}

// Narrador e Mago são iguais em todo evento; o vilão (nome, voz e cores) vem de cada evento.
const SPEAKERS: Record<Exclude<SceneSpeaker, "vilao">, SpeakerStyle> = {
  narrador: {
    name: "Narrador",
    icon: "📜",
    plate: "border-slate-500/70 bg-slate-900/95 text-slate-200",
    border: "border-slate-500/50",
    glow: "0 12px 50px -12px rgba(0,0,0,0.9)",
    voice: { pitch: 1, rate: 1 },
  },
  mago: {
    name: "Mago Danilo",
    icon: "🧙",
    plate: "border-violet-400/80 bg-violet-950/95 text-amber-200",
    border: "border-violet-400/60",
    glow: "0 12px 50px -10px rgba(139,92,246,0.75)",
    voice: { pitch: 0.8, rate: 1.05 },
  },
};

function speakerStyle(speaker: SceneSpeaker, event: AcademyEvent, visual: EventVisual): SpeakerStyle {
  if (speaker !== "vilao") return SPEAKERS[speaker];
  return { ...event.villain, ...visual.villainStyle };
}

const SOUNDS: Record<SceneSound, () => () => void> = {
  sino: () => playMidnightBell(),
  trovao: playThunder,
  plim: playMagicChime,
  fanfarra: playVictoryFanfare,
  alarme: playSiren,
  gemido: playZombieGroan,
  ovni: playUfoHum,
  laser: playLaser,
};

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function EventScene({ event, kind, student, onClose }: { event: AcademyEvent; kind: "intro" | "outro"; student: Student; onClose: () => void }) {
  const steps = kind === "intro" ? event.intro : event.outro;
  const visual = EVENT_VISUALS[event.id];
  const Art = visual.Art;
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(0);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [titleCard, setTitleCard] = useState(true);
  const stopVoiceRef = useRef<() => void>(() => {});
  const step = steps[index];
  const speaker = speakerStyle(step.speaker, event, visual);
  const isLast = index === steps.length - 1;
  const typing = !titleCard && typed < step.text.length;
  // O fundo sombrio toca na abertura e no começo do final; some quando o dia amanhece.
  const spooky = kind === "intro" || index < 2;

  // Som: lê a preferência ao abrir; a música do castelo pausa durante a cena.
  useEffect(() => {
    setSoundOn(!isSoundMuted());
    pauseMusic();
    return () => {
      stopVoiceRef.current();
      resumeMusic();
    };
  }, []);

  // Vinheta do título: some sozinha (ou no clique); quem pede menos movimento pula direto.
  useEffect(() => {
    if (prefersReducedMotion()) {
      setTitleCard(false);
      return;
    }
    const timer = window.setTimeout(() => setTitleCard(false), TITLE_CARD_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!soundOn || !spooky) return;
    return playSpookyAmbience();
  }, [soundOn, spooky]);

  // Nova cena: o texto recomeça a ser "digitado".
  useEffect(() => {
    if (titleCard) return;
    const full = step.text.length;
    setTyped(prefersReducedMotion() ? full : 0);
    const timer = window.setInterval(() => {
      setTyped((t) => {
        if (t >= full) {
          window.clearInterval(timer);
          return t;
        }
        return Math.min(full, t + CHARS_PER_TICK);
      });
    }, TICK_MS);
    return () => window.clearInterval(timer);
  }, [index, step.text, titleCard]);

  // Nova cena (ou som ligado agora): o efeito da cena e a voz de quem fala.
  useEffect(() => {
    stopVoiceRef.current();
    if (!soundOn || titleCard) return;
    const stopSound = step.sound ? SOUNDS[step.sound]() : () => {};
    const { voice } = speakerStyle(step.speaker, event, visual);
    // Sons longos (trovão, sirene, gemido, disco voador) tocam um pouco antes de a voz começar.
    const voiceDelay = step.sound === "trovao" || step.sound === "alarme" || step.sound === "gemido" || step.sound === "ovni" ? 900 : 400;
    const voiceTimer = window.setTimeout(() => {
      stopVoiceRef.current = speakCharacter(step.text, voice);
    }, voiceDelay);
    return () => {
      window.clearTimeout(voiceTimer);
      stopSound();
    };
  }, [index, step.text, step.sound, step.speaker, event, visual, soundOn, titleCard]);

  // A boca de quem fala abre e fecha enquanto o texto está sendo digitado.
  useEffect(() => {
    if (!typing) {
      setMouthOpen(false);
      return;
    }
    const timer = window.setInterval(() => setMouthOpen((o) => !o), 130);
    return () => window.clearInterval(timer);
  }, [typing]);

  function advance() {
    if (titleCard) {
      setTitleCard(false);
      return;
    }
    if (typing) {
      setTyped(step.text.length);
      return;
    }
    if (isLast) onClose();
    else setIndex((i) => i + 1);
  }

  const advanceRef = useRef(advance);
  advanceRef.current = advance;
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
        e.preventDefault();
        advanceRef.current();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    setSoundMuted(!next);
    if (!next) stopVoiceRef.current();
  }

  const finalLabel = kind === "intro" ? `Aceitar o desafio ${event.icon}` : "Finalizar evento 🏆";

  return (
    <div className="cg-dark-scope fixed inset-0 z-[70] overflow-hidden bg-black" role="dialog" aria-modal="true" aria-label={`${event.title}: ${kind === "intro" ? "abertura" : "final"}`}>
      {/* ---- a cena ---- */}
      <div key={index} className="cg-anim-scene-in absolute inset-0">
        <Art art={step.art} speaker={step.speaker} mouthOpen={mouthOpen} student={student} />
      </div>
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.75) 100%)" }} />

      {/* ---- faixas pretas de cinema ---- */}
      <div className="cg-anim-letterbox pointer-events-none absolute inset-x-0 top-0 h-[5vh] origin-top bg-black" />
      <div className="cg-anim-letterbox pointer-events-none absolute inset-x-0 bottom-0 h-[5vh] origin-bottom bg-black" />

      {/* ---- topo ---- */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-2 p-3 sm:p-4">
        <p className={`truncate text-[10px] font-semibold uppercase tracking-wider sm:text-[11px] sm:tracking-[0.2em] ${visual.accentClass}`}>
          {event.icon} {event.title} • {kind === "intro" ? "Abertura" : "Final"} • {index + 1} de {steps.length}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={toggleSound}
            title={soundOn ? "Desligar o som e as vozes" : "Ligar o som e as vozes"}
            aria-label={soundOn ? "Desligar o som e as vozes" : "Ligar o som e as vozes"}
            className={`flex h-8 w-8 items-center justify-center rounded-full border bg-black/50 text-sm transition-colors ${visual.chipClass}`}
          >
            {soundOn ? "🔊" : "🔇"}
          </button>
          <button onClick={onClose} className="whitespace-nowrap rounded-full border border-slate-600 bg-black/50 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white">
            Pular ✕
          </button>
        </div>
      </div>

      {titleCard ? (
        // ---- vinheta de abertura com o título ----
        <button type="button" onClick={advance} className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 px-6 text-center">
          <span className="cg-anim-fade text-[11px] font-semibold uppercase tracking-[0.4em] text-slate-300">{kind === "intro" ? "A CodeGuilds apresenta" : "✦ Capítulo final ✦"}</span>
          <span className={`cg-anim-title-flicker mt-4 block text-4xl font-black uppercase sm:text-6xl ${visual.titleClass}`} style={{ textShadow: visual.titleGlow }}>
            {event.title}
          </span>
          <span className={`cg-anim-fade mt-4 text-sm font-semibold ${visual.accentClass}`} style={{ animationDelay: "1.5s" }}>
            {event.tagline}
          </span>
          <span className="cg-anim-fade mt-10 text-[11px] text-slate-500" style={{ animationDelay: "2.2s" }}>
            clique pra começar
          </span>
        </button>
      ) : (
        // ---- balão de fala ----
        <div className="absolute inset-x-0 bottom-[5vh] z-10 px-3 pb-3 sm:px-6 sm:pb-5">
          <div key={index} className="cg-anim-bubble mx-auto max-w-3xl">
            <span className={`relative ml-4 inline-flex items-center gap-1.5 rounded-t-xl border border-b-0 px-4 py-1.5 text-xs font-black uppercase tracking-widest ${speaker.plate}`}>
              <span className="text-base">{speaker.icon}</span> {speaker.name}
            </span>
            <button
              type="button"
              onClick={advance}
              className={`block w-full rounded-2xl rounded-tl-none border-2 bg-black/80 p-4 text-left backdrop-blur-md sm:p-5 ${speaker.border}`}
              style={{ boxShadow: speaker.glow }}
            >
              <span className="block min-h-[5.5rem] text-[15px] leading-relaxed text-slate-100 sm:text-base" aria-hidden="true">
                {step.text.slice(0, typed)}
                {typing && <span className={`cg-anim-caret ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 ${visual.accentDot}`} />}
              </span>
              <span className="sr-only">{step.text}</span>
              <span className="mt-3 flex items-center justify-between gap-3">
                <span className="flex gap-1.5" aria-hidden="true">
                  {steps.map((s, i) => (
                    <span key={i} className={`h-1.5 rounded-full transition-all ${i === index ? `w-5 ${visual.accentDot}` : i < index ? `w-1.5 ${visual.accentDotSoft}` : "w-1.5 bg-slate-600"}`} />
                  ))}
                </span>
                <span
                  className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-black transition-transform ${
                    typing ? "border border-slate-600 text-slate-300" : isLast ? `${visual.buttonClass} hover:scale-[1.04]` : "bg-white text-cg-ink hover:scale-[1.04]"
                  }`}
                >
                  {typing ? "⏩ Mostrar tudo" : isLast ? finalLabel : "Continuar ▸"}
                </span>
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
