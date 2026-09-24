"use client";

import { useEffect, useState } from "react";
import { isMusicOff, setMusicOff, startMusic, stopMusic } from "@/engine/music";

/**
 * Botão de música do cabeçalho da Academia. Fica no layout da Academia, então
 * a música continua tocando ao trocar de página e para quando o aluno sai
 * da Academia (ex.: vai pra Área do Professor).
 */
export default function MusicToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const shouldPlay = !isMusicOff();
    setOn(shouldPlay);
    if (shouldPlay) startMusic();
    return () => stopMusic();
  }, []);

  function toggle() {
    const next = !on;
    setOn(next);
    setMusicOff(!next);
    if (next) startMusic();
    else stopMusic();
  }

  return (
    <button
      onClick={toggle}
      title={on ? "Desligar a música" : "Ligar a música"}
      aria-label={on ? "Desligar a música" : "Ligar a música"}
      aria-pressed={on}
      className={`relative flex h-8 w-8 items-center justify-center rounded-full border bg-cg-card text-sm transition-colors hover:border-slate-500 ${
        on ? "border-violet-500/50" : "border-slate-700"
      }`}
    >
      <span className={on ? "" : "opacity-60"}>{on ? "🎶" : "🎵"}</span>
      {/* risco vermelho quando a música está desligada */}
      {!on && <span className="absolute h-0.5 w-5 rotate-45 rounded-full bg-rose-400" aria-hidden="true" />}
    </button>
  );
}
