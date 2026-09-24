"use client";

import { useEffect, useState } from "react";
import { Mission, RARITY_META, PASS_THRESHOLD_PERCENT } from "@/engine/missions";
import { playDeathSound, playVictoryFanfare } from "@/engine/sfx";
import { CoinIcon, ItemStats, RarityBadge } from "./GameUI";
import { SoundToggleButton, useSceneSound } from "./SceneSound";

// ============================================================================
// MISSION RESULT — as telas animadas de fim de missão (vitória e derrota).
// O QuizModal decide qual mostrar; aqui é só a encenação. As animações
// (keyframes + classes cg-anim-*) ficam em globals.css.
// ============================================================================

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Conta de 0 até `target` (easing suave), começando depois de `delayMs`. */
function useCountUp(target: number, delayMs: number, durationMs = 1000): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now() + delayMs;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / durationMs));
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, delayMs, durationMs]);

  return value;
}

// ---------------------------------------------------------------------------
// VITÓRIA
// ---------------------------------------------------------------------------

const CONFETTI_COLORS = ["#a78bfa", "#fbbf24", "#34d399", "#60a5fa", "#f87171", "#f8fafc"];

function Confetti() {
  // Sorteado uma vez só por tela de vitória — senão cada re-render (contador subindo) embaralharia tudo.
  const [pieces] = useState(() =>
    Array.from({ length: 70 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      width: 6 + Math.random() * 6,
      height: 8 + Math.random() * 8,
      round: Math.random() < 0.25,
      delay: 0.9 + Math.random() * 1.2,
      duration: 2.4 + Math.random() * 1.6,
      drift: -90 + Math.random() * 180,
      spin: 360 + Math.random() * 900,
    })),
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="cg-anim-confetti absolute top-0"
          style={
            {
              left: `${p.left}%`,
              width: p.width,
              height: p.round ? p.width : p.height,
              backgroundColor: p.color,
              borderRadius: p.round ? "9999px" : "2px",
              "--cg-delay": `${p.delay}s`,
              "--cg-duration": `${p.duration}s`,
              "--cg-drift": `${p.drift}px`,
              "--cg-spin": `${p.spin}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function TreasureChest({ itemIcon }: { itemIcon: string }) {
  return (
    <div className="relative mx-auto h-40 w-48" aria-hidden="true">
      {/* raios de luz girando atrás do baú */}
      <div
        className="cg-anim-fade absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2"
        style={{ animationDelay: "1.2s" }}
      >
        <div
          className="cg-anim-spin-slow h-full w-full rounded-full"
          style={{
            background: "repeating-conic-gradient(rgba(251,191,36,0.22) 0deg 10deg, transparent 10deg 30deg)",
            maskImage: "radial-gradient(circle, black 20%, transparent 68%)",
            WebkitMaskImage: "radial-gradient(circle, black 20%, transparent 68%)",
          }}
        />
      </div>

      {/* item subindo de dentro do baú */}
      <div className="cg-anim-item-rise absolute left-1/2 top-10 z-10 -ml-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/40 bg-cg-tile text-3xl shadow-[0_0_30px_rgba(251,191,36,0.6)]">
        {itemIcon}
      </div>

      <svg viewBox="0 0 120 100" className="cg-anim-chest-shake absolute inset-x-0 bottom-0 mx-auto w-40" style={{ transformOrigin: "50% 90%" }}>
        <defs>
          <linearGradient id="cg-chest-wood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9a6534" />
            <stop offset="1" stopColor="#5c3614" />
          </linearGradient>
          <linearGradient id="cg-chest-beam" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#fde68a" stopOpacity="0.9" />
            <stop offset="1" stopColor="#fde68a" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* feixe de luz saindo do baú aberto */}
        <polygon points="22,46 98,46 118,0 2,0" fill="url(#cg-chest-beam)" className="cg-anim-fade" style={{ animationDelay: "1.25s" }} />

        {/* corpo */}
        <rect x="10" y="45" width="100" height="47" rx="6" fill="url(#cg-chest-wood)" stroke="#3b200a" strokeWidth="2" />
        <rect x="10" y="60" width="100" height="6" fill="#fbbf24" />
        <rect x="22" y="45" width="7" height="47" fill="#d97706" />
        <rect x="91" y="45" width="7" height="47" fill="#d97706" />
        <rect x="52" y="52" width="16" height="18" rx="3" fill="#fbbf24" stroke="#92400e" strokeWidth="1.5" />
        <circle cx="60" cy="60" r="2.5" fill="#78350f" />

        {/* tampa — salta pra cima e inclina, girando pelo centro */}
        <g className="cg-anim-chest-lid" style={{ transformOrigin: "60px 32px" }}>
          <path d="M10 46 L10 32 Q60 6 110 32 L110 46 Z" fill="url(#cg-chest-wood)" stroke="#3b200a" strokeWidth="2" />
          <path d="M10 38 Q60 13 110 38" fill="none" stroke="#fbbf24" strokeWidth="5" />
          <rect x="22" y="18" width="7" height="28" fill="#d97706" transform="rotate(-8 25 32)" />
          <rect x="91" y="18" width="7" height="28" fill="#d97706" transform="rotate(8 95 32)" />
        </g>
      </svg>
    </div>
  );
}

export function VictoryScreen({
  mission,
  correctCount,
  total,
  percent,
  onBack,
}: {
  mission: Mission;
  correctCount: number;
  total: number;
  percent: number;
  onBack: () => void;
}) {
  const xp = useCountUp(mission.rewardXp, 1700);
  const coins = useCountUp(mission.rewardCoins, 1850);
  const rarity = RARITY_META[mission.rewardItem.rarity];
  const sound = useSceneSound(playVictoryFanfare);

  return (
    <div className="cg-dark-scope fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <Confetti />
      <div
        className="cg-card cg-anim-pop relative w-full max-w-md overflow-hidden p-8 text-center"
        style={{ boxShadow: "0 0 80px -20px rgba(251,191,36,0.45)" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_25%,rgba(251,191,36,0.14),transparent)]" />
        <SoundToggleButton muted={sound.muted} onClick={sound.toggle} />

        <div className="relative">
          <TreasureChest itemIcon={mission.rewardItem.icon} />

          <h2 className="cg-anim-shimmer mt-4 text-3xl font-black uppercase tracking-wide">Missão Concluída!</h2>
          <p className="cg-anim-fade mt-1 text-sm text-slate-400" style={{ animationDelay: "0.4s" }}>
            Você acertou {correctCount}/{total} perguntas ({percent}%)
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="cg-anim-rise rounded-xl border border-violet-500/30 bg-violet-500/10 p-3" style={{ animationDelay: "1.6s" }}>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">XP</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-violet-300">+{xp}</p>
            </div>
            <div className="cg-anim-rise rounded-xl border border-amber-500/30 bg-amber-500/10 p-3" style={{ animationDelay: "1.75s" }}>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Moedas</p>
              <p className="mt-1 flex items-center justify-center gap-1 text-lg font-bold tabular-nums text-amber-300">
                <CoinIcon size={18} /> +{coins}
              </p>
            </div>
            <div className={`cg-anim-rise rounded-xl border bg-cg-sunken p-3 ${rarity.borderClass}`} style={{ animationDelay: "1.9s" }}>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Item</p>
              <p className={`mt-1 text-xs font-bold ${rarity.colorClass}`}>{mission.rewardItem.name}</p>
              <div className="mt-1">
                <RarityBadge rarity={mission.rewardItem.rarity} />
              </div>
              <ItemStats value={mission.rewardItem.value} xp={mission.rewardItem.xp} className="mt-1" />
            </div>
          </div>

          <button onClick={onBack} className="cg-btn-primary cg-anim-rise mt-6 w-full" style={{ animationDelay: "2.3s" }}>
            Coletar recompensas ✨
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DERROTA
// ---------------------------------------------------------------------------

function GrimReaper() {
  return (
    // overflow visível: quando a foice balança, a ponta da lâmina passa um pouco do viewBox.
    <svg viewBox="0 0 200 220" className="mx-auto mt-4 w-44 overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="cg-reaper-cloak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e1b2e" />
          <stop offset="1" stopColor="#07070c" />
        </linearGradient>
        <linearGradient id="cg-reaper-blade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f1f5f9" />
          <stop offset="1" stopColor="#64748b" />
        </linearGradient>
        <radialGradient id="cg-reaper-eye">
          <stop offset="0" stopColor="#fecaca" />
          <stop offset="0.4" stopColor="#ef4444" />
          <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* manto com a barra rasgada */}
      <path
        d="M100 16 C 68 16 54 44 54 76 L 38 204 L 54 192 L 64 208 L 78 193 L 90 210 L 103 194 L 116 209 L 128 193 L 140 207 L 148 191 L 164 203 L 146 76 C 146 44 132 16 100 16 Z"
        fill="url(#cg-reaper-cloak)"
        stroke="#2e2a44"
        strokeWidth="2"
      />
      <path d="M78 110 C 84 150 82 180 76 196 M122 110 C 118 150 120 180 126 196" fill="none" stroke="#2e2a44" strokeWidth="2" />

      {/* capuz vazio + caveira */}
      <ellipse cx="100" cy="68" rx="27" ry="31" fill="#030306" />
      <circle cx="100" cy="64" r="16" fill="#e7e5e4" />
      <rect x="91" y="74" width="18" height="10" rx="3" fill="#e7e5e4" />
      <ellipse cx="93" cy="64" rx="4.5" ry="5" fill="#0a0a0f" />
      <ellipse cx="107" cy="64" rx="4.5" ry="5" fill="#0a0a0f" />
      <circle cx="93" cy="64" r="5" fill="url(#cg-reaper-eye)" className="cg-anim-eye" />
      <circle cx="107" cy="64" r="5" fill="url(#cg-reaper-eye)" className="cg-anim-eye" />
      <path d="M100 69 L97.5 73 L102.5 73 Z" fill="#0a0a0f" />
      <path d="M94 78 V83 M98 78 V84 M102 78 V84 M106 78 V83" stroke="#57534e" strokeWidth="1.2" />

      {/* foice na frente do corpo, balançando a partir da mão */}
      <g className="cg-anim-scythe" style={{ transformOrigin: "158px 122px" }}>
        <line x1="176" y1="10" x2="140" y2="214" stroke="#5b3b22" strokeWidth="6" strokeLinecap="round" />
        <path d="M176 12 C 128 -6, 74 8, 44 48 C 84 26, 126 22, 172 32 Z" fill="url(#cg-reaper-blade)" stroke="#334155" strokeWidth="1.5" />
        <path d="M168 22 C 128 12, 92 20, 64 38" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="1.5" />
      </g>

      {/* braço e mão ossuda segurando a foice */}
      <path d="M134 96 C 146 104 152 112 156 120" fill="none" stroke="url(#cg-reaper-cloak)" strokeWidth="14" strokeLinecap="round" />
      <circle cx="158" cy="122" r="6" fill="#e7e5e4" />
      <path d="M154 118 L162 126 M156 116 L164 124" stroke="#a8a29e" strokeWidth="1.2" />
    </svg>
  );
}

export function DefeatScreen({
  correctCount,
  total,
  percent,
  needed,
  onRetry,
  onBack,
}: {
  correctCount: number;
  total: number;
  percent: number;
  needed: number;
  onRetry: () => void;
  onBack: () => void;
}) {
  const sound = useSceneSound(playDeathSound);

  return (
    <div className="cg-dark-scope fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
      {/* vinheta vermelha pulsando e o corte da foice atravessando a tela */}
      <div
        className="cg-anim-red-flash pointer-events-none fixed inset-0 bg-[radial-gradient(circle,transparent_35%,rgba(127,29,29,0.75))]"
        aria-hidden="true"
      />
      <div className="pointer-events-none fixed inset-x-0 top-1/2 z-[60] flex justify-center overflow-hidden" aria-hidden="true">
        <div className="cg-anim-slash h-1.5 w-[140%] rounded-full bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_24px_6px_rgba(255,255,255,0.7)]" />
      </div>

      <div className="cg-anim-shake w-full max-w-md">
        <div className="cg-card relative overflow-hidden !border-rose-900/60 !bg-cg-deep p-8 text-center">
          {/* névoa no pé da cena */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 overflow-hidden" aria-hidden="true">
            <div className="cg-anim-fog absolute -left-1/4 bottom-[-40px] h-32 w-[150%] rounded-full bg-slate-400/10 blur-2xl" />
            <div className="cg-anim-fog absolute -left-1/4 bottom-[-60px] h-28 w-[150%] rounded-full bg-rose-900/20 blur-2xl" style={{ animationDelay: "-4s" }} />
          </div>

          <SoundToggleButton muted={sound.muted} onClick={sound.toggle} />

          <div className="relative">
            <div className="cg-anim-reaper-rise">
              <div className="cg-anim-float">
                <GrimReaper />
              </div>
            </div>

            <h2
              className="cg-anim-death-letters mt-2 font-serif text-3xl font-bold uppercase text-rose-500"
              style={{ textShadow: "0 0 18px rgba(239,68,68,0.7)" }}
            >
              Você morreu
            </h2>
            <p className="cg-anim-fade mt-2 text-sm italic text-slate-400" style={{ animationDelay: "1.4s" }}>
              O Ceifador levou sua missão desta vez…
            </p>
            <p className="cg-anim-fade mt-1 text-xs text-slate-500" style={{ animationDelay: "1.6s" }}>
              Você acertou {correctCount}/{total} perguntas ({percent}%)
            </p>

            <div className="cg-anim-rise mt-6 rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 text-sm text-rose-200" style={{ animationDelay: "1.9s" }}>
              Para concluir a missão e ganhar as recompensas, você precisa acertar pelo menos{" "}
              <span className="font-semibold">
                {needed} de {total}
              </span>{" "}
              ({PASS_THRESHOLD_PERCENT}%). Revise as explicações e tente de novo!
            </div>
            <div className="cg-anim-rise mt-6 flex flex-col gap-2" style={{ animationDelay: "2.1s" }}>
              <button onClick={onRetry} className="cg-btn-primary w-full">
                Renascer e tentar de novo ↻
              </button>
              <button onClick={onBack} className="cg-btn-secondary w-full">
                Voltar às Missões
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
