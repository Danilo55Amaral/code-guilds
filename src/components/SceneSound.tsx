"use client";

import { useEffect, useRef, useState } from "react";
import { isSoundMuted, setSoundMuted } from "@/engine/sfx";
import { pauseMusic, resumeMusic } from "@/engine/music";

/**
 * Som de uma cena (derrota, vitória, subir de nível): enquanto a cena está na tela
 * a música de fundo fica pausada e o som da cena toca (a não ser que o aluno tenha
 * deixado no mudo). Ao fechar, o som para e a música volta do mesmo ponto.
 * `play` começa o som e devolve a função que o interrompe.
 */
export function useSceneSound(play: () => () => void) {
  const [muted, setMuted] = useState(true);
  const stopRef = useRef<(() => void) | null>(null);
  const playRef = useRef(play);
  playRef.current = play;

  useEffect(() => {
    pauseMusic();
    const m = isSoundMuted();
    setMuted(m);
    if (!m) stopRef.current = playRef.current();
    return () => {
      stopRef.current?.();
      resumeMusic();
    };
  }, []);

  function toggle() {
    const next = !muted;
    setMuted(next);
    setSoundMuted(next);
    stopRef.current?.();
    stopRef.current = next ? null : playRef.current();
  }

  return { muted, toggle };
}

/** Botão 🔊/🔇 do canto das cenas. */
export function SoundToggleButton({ muted, onClick }: { muted: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={muted ? "Ligar o som" : "Desligar o som"}
      className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-[#101018] text-sm transition-colors hover:border-slate-500"
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}
