"use client";

import { useEffect, useRef, useState } from "react";
import { TutorialStep } from "@/engine/tutorial";
import { isSoundMuted, playMagicChime, setSoundMuted, speakWizard } from "@/engine/sfx";
import { pauseMusic, resumeMusic } from "@/engine/music";
import WizardDanilo from "./WizardDanilo";

// ============================================================================
// TUTORIAL — o Mago Danilo apresenta a plataforma num céu estrelado. A cada
// passo: o cajado solta um clarão, toca um "plim", o balão entra com o texto
// sendo "digitado" (a boca do mago mexe enquanto isso) e a voz dele lê a fala.
// Som e voz seguem a mesma preferência 🔊/🔇 das cenas de vitória/derrota.
// Fechar de qualquer jeito — terminar, "Pular tutorial", ✕ ou Esc — chama
// onClose, que marca o tutorial como visto. A cena é sempre escura (.cg-dark-scope).
// ============================================================================

const CHARS_PER_TICK = 2;
const TICK_MS = 22;

// Estrelas do fundo: posições fixas (em %), tamanho e atraso da cintilada.
const SKY = Array.from({ length: 36 }, (_, i) => ({
  left: (i * 37) % 100,
  top: (i * 53) % 100,
  size: 1 + (i % 3),
  delay: (i % 7) * 0.4,
}));

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function TutorialModal({ steps, label, onClose }: { steps: TutorialStep[]; label: string; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(0);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const stopVoiceRef = useRef<() => void>(() => {});
  const step = steps[index];
  const isLast = index === steps.length - 1;
  const typing = typed < step.body.length;

  // Som: lê a preferência ao abrir; enquanto o mago fala, a música de fundo pausa.
  useEffect(() => {
    const on = !isSoundMuted();
    setSoundOn(on);
    if (on) pauseMusic();
    return () => {
      stopVoiceRef.current();
      resumeMusic();
    };
  }, []);

  // Novo passo: o texto recomeça a ser "digitado".
  useEffect(() => {
    const full = step.body.length;
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
  }, [index, step.body]);

  // Novo passo (ou som ligado agora): "plim" e a voz do mago lendo a fala.
  useEffect(() => {
    stopVoiceRef.current();
    if (!soundOn) return;
    const stopChime = playMagicChime();
    const voiceTimer = window.setTimeout(() => {
      stopVoiceRef.current = speakWizard(`${step.title}. ${step.body}`);
    }, 350);
    return () => {
      window.clearTimeout(voiceTimer);
      stopChime();
    };
  }, [index, step.title, step.body, soundOn]);

  // A boca abre e fecha enquanto o texto está sendo digitado.
  useEffect(() => {
    if (!typing) {
      setMouthOpen(false);
      return;
    }
    const timer = window.setInterval(() => setMouthOpen((o) => !o), 130);
    return () => window.clearInterval(timer);
  }, [typing]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, steps.length - 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, steps.length]);

  function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    setSoundMuted(!next);
    if (next) {
      pauseMusic();
    } else {
      stopVoiceRef.current();
      resumeMusic();
    }
  }

  function goTo(i: number) {
    setIndex(Math.max(0, Math.min(steps.length - 1, i)));
  }

  return (
    <div className="cg-dark-scope fixed inset-0 z-[60] overflow-y-auto" role="dialog" aria-modal="true" aria-label={`Tutorial: ${step.title}`}>
      {/* ---- céu estrelado ---- */}
      <div
        className="fixed inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(55% 45% at 30% 70%, rgba(139,92,246,0.35), transparent 70%), radial-gradient(40% 40% at 80% 20%, rgba(34,211,238,0.18), transparent 70%), linear-gradient(180deg, #05030f 0%, #150a2e 55%, #1e0b3b 100%)",
        }}
      >
        {SKY.map((s, i) => (
          <span
            key={i}
            className="cg-anim-twinkle absolute rounded-full bg-white"
            style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
          />
        ))}
      </div>

      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          {/* ---- topo ---- */}
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-200/80 sm:text-[11px] sm:tracking-[0.2em]">
              {label} • {index + 1} de {steps.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSound}
                title={soundOn ? "Desligar a voz do mago" : "Ligar a voz do mago"}
                aria-label={soundOn ? "Desligar a voz do mago" : "Ligar a voz do mago"}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-violet-400/40 bg-black/30 text-sm transition-colors hover:border-violet-300"
              >
                {soundOn ? "🔊" : "🔇"}
              </button>
              <button onClick={onClose} className="whitespace-nowrap rounded-full border border-slate-600 bg-black/30 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white">
                Pular tutorial ✕
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 md:flex-row md:items-end md:gap-6">
            {/* ---- o mago ---- */}
            <div className="relative flex w-44 shrink-0 flex-col items-center sm:w-52 md:w-64">
              {/* círculo mágico girando no chão (achatado pra parecer deitado) */}
              <div className="pointer-events-none absolute bottom-3 left-1/2 h-64 w-64 md:h-72 md:w-72" style={{ transform: "translate(-50%, 50%) scaleY(0.26)" }} aria-hidden="true">
                <div className="cg-anim-spin-slow absolute inset-0 rounded-full border-2 border-dashed border-violet-300/70 shadow-[0_0_40px_6px_rgba(139,92,246,0.45)]" />
                <div className="cg-anim-spin-reverse absolute inset-6 rounded-full border border-cyan-300/60" />
                <div className="absolute inset-12 rounded-full bg-violet-500/25 blur-md" />
              </div>
              <div className="cg-anim-wizard-enter relative w-full">
                <div className="cg-anim-float">
                  <WizardDanilo mouthOpen={mouthOpen} burstKey={index} className="w-full drop-shadow-[0_0_24px_rgba(139,92,246,0.55)]" />
                </div>
              </div>
              <p className="relative mt-1 rounded-full border border-amber-300/50 bg-gradient-to-r from-violet-700 to-fuchsia-700 px-4 py-1 text-xs font-black uppercase tracking-widest text-amber-200 shadow-lg shadow-violet-900/60">
                ✦ Mago Danilo ✦
              </p>
            </div>

            {/* ---- balão de fala ---- */}
            <div className="w-full flex-1 md:mb-24">
              <button
                key={index}
                type="button"
                onClick={() => setTyped(step.body.length)}
                title={typing ? "Clique pra mostrar a fala inteira" : undefined}
                className="cg-anim-bubble relative block w-full rounded-3xl border-4 border-violet-300 bg-white p-5 text-left shadow-[0_12px_50px_-10px_rgba(139,92,246,0.7)]"
              >
                {/* rabinho do balão: pra cima no celular, pra esquerda (no mago) no desktop */}
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-0 h-5 w-5 -translate-x-1/2 -translate-y-[62%] rotate-45 border-l-4 border-t-4 border-violet-300 bg-white md:left-0 md:top-1/2 md:-translate-x-[62%] md:-translate-y-1/2 md:border-b-4 md:border-t-0"
                />
                <span className="flex items-center gap-2 text-lg font-black text-violet-700">
                  <span className="text-2xl">{step.icon}</span>
                  {step.title}
                </span>
                <span className="mt-2 block min-h-[6rem] text-[15px] leading-relaxed text-cg-ink" aria-hidden="true">
                  {step.body.slice(0, typed)}
                  {typing && <span className="cg-anim-caret ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-violet-600" />}
                </span>
                <span className="sr-only">{step.body}</span>
                {typing && <span className="mt-2 block text-right text-[11px] text-slate-500">clique pra ver a fala inteira</span>}
              </button>

              {/* ---- navegação ---- */}
              <div className="mt-4 flex justify-center gap-1.5">
                {steps.map((s, i) => (
                  <button
                    key={s.title}
                    onClick={() => goTo(i)}
                    aria-label={`Ir para o passo ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-amber-300" : i < index ? "w-2 bg-violet-300" : "w-2 bg-slate-600 hover:bg-slate-400"}`}
                  />
                ))}
              </div>
              <div className="mt-4 flex justify-between gap-2">
                <button
                  onClick={() => goTo(index - 1)}
                  disabled={index === 0}
                  className="rounded-full border border-violet-400/40 bg-black/30 px-5 py-2.5 text-sm font-semibold text-violet-100 transition-colors hover:border-violet-300 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ← Anterior
                </button>
                <button
                  onClick={() => (isLast ? onClose() : goTo(index + 1))}
                  className="rounded-full bg-gradient-to-r from-amber-300 to-orange-400 px-6 py-2.5 text-sm font-black text-cg-ink shadow-lg shadow-amber-500/30 transition-transform hover:scale-[1.04]"
                >
                  {isLast ? "Começar a jornada! 🚀" : "Próximo →"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
