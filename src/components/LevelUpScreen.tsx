"use client";

import { useState } from "react";
import { Mission } from "@/engine/missions";
import { playLevelUpJingle } from "@/engine/sfx";
import { DifficultyBadge } from "./GameUI";
import { SoundToggleButton, useSceneSound } from "./SceneSound";

// ============================================================================
// LEVEL UP — cena que aparece depois de coletar as recompensas quando o XP
// fez o aluno subir de nível. As animações (cg-anim-*) ficam em globals.css.
// ============================================================================

const SPARKLE_COLORS = ["#c4b5fd", "#a78bfa", "#f5f3ff", "#fbbf24"];

function Sparkles() {
  // Sorteado uma vez só — as faíscas ficam subindo em loop enquanto a cena estiver aberta.
  const [sparks] = useState(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 3 + Math.random() * 4,
      color: SPARKLE_COLORS[i % SPARKLE_COLORS.length],
      delay: Math.random() * 3.5,
      duration: 2.8 + Math.random() * 2.2,
    })),
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {sparks.map((s) => (
        <span
          key={s.id}
          className="cg-anim-sparkle absolute -bottom-2 rounded-full"
          style={
            {
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              backgroundColor: s.color,
              boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
              "--cg-delay": `${s.delay}s`,
              "--cg-duration": `${s.duration}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function LevelBadge({ fromLevel, toLevel }: { fromLevel: number; toLevel: number }) {
  return (
    <div className="relative mx-auto h-44 w-44" aria-hidden="true">
      {/* ondas de choque no momento em que o número troca */}
      {[1.1, 1.35, 1.6].map((delay) => (
        <span
          key={delay}
          className="cg-anim-shockwave absolute inset-6 rounded-full border-2 border-violet-400/70"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}

      {/* anéis girando em sentidos opostos */}
      <svg viewBox="0 0 176 176" className="cg-anim-spin-slow absolute inset-0 h-full w-full">
        <circle cx="88" cy="88" r="84" fill="none" stroke="#8b5cf6" strokeOpacity="0.55" strokeWidth="2" strokeDasharray="4 10" />
      </svg>
      <svg viewBox="0 0 176 176" className="cg-anim-spin-reverse absolute inset-0 h-full w-full">
        <circle cx="88" cy="88" r="74" fill="none" stroke="#fbbf24" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="18 8 2 8" />
      </svg>

      {/* brasão hexagonal */}
      <svg viewBox="0 0 176 176" className="cg-anim-pop absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="cg-level-badge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7c3aed" />
            <stop offset="1" stopColor="#2e1065" />
          </linearGradient>
        </defs>
        <polygon
          points="88,26 142,57 142,119 88,150 34,119 34,57"
          fill="url(#cg-level-badge)"
          stroke="#c4b5fd"
          strokeWidth="3"
          style={{ filter: "drop-shadow(0 0 18px rgba(139,92,246,0.8))" }}
        />
        <polygon points="88,38 131,63 131,113 88,138 45,113 45,63" fill="none" stroke="#fbbf24" strokeOpacity="0.6" strokeWidth="1.5" />
      </svg>

      {/* número: o nível antigo sai, o novo entra */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-violet-200">Nível</span>
        <span className="relative h-12 w-20 text-center">
          <span className="cg-anim-level-out absolute inset-0 text-5xl font-black leading-[3rem] text-white/80">{fromLevel}</span>
          <span
            className="cg-anim-level-in absolute inset-0 text-5xl font-black leading-[3rem] text-white"
            style={{ textShadow: "0 0 20px rgba(251,191,36,0.8)" }}
          >
            {toLevel}
          </span>
        </span>
      </div>
    </div>
  );
}

export default function LevelUpScreen({
  fromLevel,
  toLevel,
  unlockedMissions,
  onClose,
}: {
  fromLevel: number;
  toLevel: number;
  /** Missões que passaram a ficar liberadas com o novo nível. */
  unlockedMissions: Mission[];
  onClose: () => void;
}) {
  const jumped = toLevel - fromLevel;
  const sound = useSceneSound(playLevelUpJingle);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(50%_40%_at_50%_40%,rgba(139,92,246,0.25),transparent)]" aria-hidden="true" />
      <Sparkles />
      <div className="fixed right-1 top-1 z-10">
        <SoundToggleButton muted={sound.muted} onClick={sound.toggle} />
      </div>

      <div className="relative w-full max-w-md text-center">
        <LevelBadge fromLevel={fromLevel} toLevel={toLevel} />

        <h2 className="cg-anim-shimmer-violet mt-4 text-3xl font-black uppercase tracking-wide">Subiu de nível!</h2>
        <p className="cg-anim-fade mt-1 text-sm text-slate-300" style={{ animationDelay: "1.5s" }}>
          Nível {fromLevel} → <span className="font-bold text-violet-300">Nível {toLevel}</span>
          {jumped > 1 && <span className="text-amber-300"> • {jumped} níveis de uma vez! 🔥</span>}
        </p>

        {unlockedMissions.length > 0 && (
          <div className="cg-card cg-anim-rise mt-6 p-4 text-left" style={{ animationDelay: "1.9s" }}>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">🔓 Novas missões desbloqueadas</p>
            <div className="flex flex-col gap-2">
              {unlockedMissions.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-[#0d0d14] px-3 py-2">
                  <span className="flex items-center gap-2 text-sm font-medium text-white">
                    <span className="text-lg">{m.icon}</span> {m.title}
                  </span>
                  <DifficultyBadge difficulty={m.difficulty} />
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={onClose} className="cg-btn-primary cg-anim-rise mt-6 w-full" style={{ animationDelay: "2.2s" }}>
          Continuar a jornada ⚔️
        </button>
      </div>
    </div>
  );
}
