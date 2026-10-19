"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Student, wornAvatar } from "@/engine/students";
import { applyCosmetic } from "@/engine/avatar";
import { RARITY_GLOW } from "@/engine/missions";
import { useMissions } from "@/engine/store";
import { WHEEL_PRIZES, WHEEL_SPIN_PRICE, WheelPrize, prizeChance } from "@/engine/luckyWheel";
import { WheelSpinOutcome, WheelStatus, spinWheel } from "@/engine/gameApi";
import { isSoundMuted, playWheelPrize, playWheelTicks, setSoundMuted } from "@/engine/sfx";
import Avatar from "./Avatar";
import LevelUpScreen from "./LevelUpScreen";
import { CoinIcon, RarityBadge } from "./GameUI";

// ============================================================================
// ROLETA DA SORTE — a tela cheia que abre pelo botão do topo da Loja. A
// roleta tem as 20 fatias de WHEEL_PRIZES (engine/luckyWheel.ts); quem
// sorteia é a API, e a roleta gira até a fatia que voltou. O aluno atualizado
// só vai pro cache quando a roleta para (as moedas não "contam" o prêmio
// antes da hora).
// ============================================================================

const SPIN_MS = 5600;
const SLICE = 360 / WHEEL_PRIZES.length;
const C = 220; // centro da roleta no viewBox
const R = 196; // raio das fatias

// As cores das fatias (alternadas); prêmio lendário ganha a borda dourada.
const SLICE_COLORS = ["#7c3aed", "#db2777", "#2563eb", "#ea580c", "#0d9488"];

/** Ponto na borda do círculo: o ângulo é em graus, a partir do topo, no sentido do relógio. */
function polar(angle: number, radius: number) {
  const a = (angle * Math.PI) / 180;
  return { x: C + radius * Math.sin(a), y: C - radius * Math.cos(a) };
}

function slicePath(i: number) {
  const a = polar(i * SLICE - SLICE / 2, R);
  const b = polar(i * SLICE + SLICE / 2, R);
  return `M${C} ${C} L${a.x.toFixed(2)} ${a.y.toFixed(2)} A${R} ${R} 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)} Z`;
}

function prizeText(prize: WheelPrize) {
  if (prize.coins) return `+${prize.coins} moedas`;
  if (prize.xp) return `+${prize.xp} XP`;
  return prize.label;
}

/** A roleta desenhada (as fatias giram; o ponteiro e o aro de luzes ficam parados). */
function WheelArt({ rotation, spinning }: { rotation: number; spinning: boolean }) {
  return (
    <svg viewBox="0 0 440 440" className="block h-full w-full" role="img" aria-label="A Roleta da Sorte com 20 prêmios">
      <defs>
        <radialGradient id="roleta-hub" cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#b45309" />
        </radialGradient>
        <radialGradient id="roleta-brilho" cx="50%" cy="50%" r="50%">
          <stop offset="0.7" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.35" />
        </radialGradient>
      </defs>

      {/* o aro dourado */}
      <circle cx={C} cy={C} r={216} fill="#78350f" />
      <circle cx={C} cy={C} r={210} fill="#f59e0b" />
      <circle cx={C} cy={C} r={202} fill="#451a03" />

      {/* as fatias girando */}
      <g
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: `${C}px ${C}px`,
          transition: spinning ? `transform ${SPIN_MS}ms cubic-bezier(0.33, 1, 0.68, 1)` : "none",
        }}
      >
        {WHEEL_PRIZES.map((prize, i) => {
          const icon = polar(i * SLICE, R * 0.82);
          const text = polar(i * SLICE, R * 0.56);
          return (
            <g key={prize.key}>
              <path
                d={slicePath(i)}
                fill={SLICE_COLORS[i % SLICE_COLORS.length]}
                stroke={prize.rarity === "lendario" ? "#fde047" : "#1e1b4b"}
                strokeWidth={prize.rarity === "lendario" ? 3 : 1.5}
              />
              <text
                x={icon.x}
                y={icon.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="22"
                transform={`rotate(${i * SLICE} ${icon.x} ${icon.y})`}
              >
                {prize.icon}
              </text>
              <text
                x={text.x}
                y={text.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="12.5"
                fontWeight="900"
                fill="#fff"
                stroke="#1e1b4b"
                strokeWidth="2.5"
                paintOrder="stroke"
                // na metade esquerda o texto vira 180° pra não ficar de cabeça pra baixo
                transform={`rotate(${i * SLICE - 90 + (i * SLICE > 180 ? 180 : 0)} ${text.x} ${text.y})`}
              >
                {prize.short}
              </text>
            </g>
          );
        })}
        <circle cx={C} cy={C} r={R} fill="url(#roleta-brilho)" />
      </g>

      {/* as luzes do aro, piscando alternadas */}
      {WHEEL_PRIZES.map((_, i) => {
        const p = polar(i * SLICE + SLICE / 2, 206);
        return (
          <circle key={i} cx={p.x} cy={p.y} r="4.5" fill="#fef9c3">
            <animate
              attributeName="fill"
              values="#fef9c3;#f59e0b;#fef9c3"
              dur={spinning ? "0.35s" : "1.4s"}
              begin={`${-(i % 2) * (spinning ? 0.175 : 0.7)}s`}
              repeatCount="indefinite"
            />
          </circle>
        );
      })}

      {/* o miolo */}
      <circle cx={C} cy={C} r={34} fill="#78350f" />
      <circle cx={C} cy={C} r={29} fill="url(#roleta-hub)" />
      <text x={C} y={C + 1} textAnchor="middle" dominantBaseline="central" fontSize="24">
        ⭐
      </text>

      {/* o ponteiro, no topo */}
      <path d={`M${C - 18} 2 L${C + 18} 2 L${C} 44 Z`} fill="#ef4444" stroke="#7f1d1d" strokeWidth="3" strokeLinejoin="round" />
      <circle cx={C} cy={12} r="6" fill="#fecaca" />
    </svg>
  );
}

/** O prêmio que saiu: o aluno vestindo o visual, ou o ícone grande. */
function PrizeReveal({
  prize,
  outcome,
  me,
  onClose,
}: {
  prize: WheelPrize;
  outcome: WheelSpinOutcome;
  me: Student;
  onClose: () => void;
}) {
  const glow = RARITY_GLOW[prize.rarity];
  const cosmetic = prize.item?.cosmetic;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="cg-anim-pop relative w-full max-w-sm overflow-hidden rounded-3xl border-2 bg-[#120b2e] p-6 text-center"
        style={{ borderColor: glow, boxShadow: `0 0 60px -10px ${glow}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[11px] font-black uppercase tracking-[0.25em] text-amber-300">🎉 Você ganhou!</p>
        <div className="mt-4 flex justify-center">
          {cosmetic ? (
            <Avatar config={applyCosmetic(wornAvatar(me), cosmetic)} size={140} ringColor={glow} />
          ) : (
            <div
              className="cg-anim-float flex h-28 w-28 items-center justify-center rounded-3xl border-2 bg-black/30 text-6xl"
              style={{ borderColor: `${glow}88`, boxShadow: `0 0 40px -6px ${glow}` }}
            >
              {prize.coins ? <CoinIcon size={64} /> : prize.icon}
            </div>
          )}
        </div>
        <p className="mt-4 text-2xl font-black text-white">{prizeText(prize)}</p>
        <div className="mt-2 flex justify-center">
          <RarityBadge rarity={prize.rarity} />
        </div>
        {prize.item && <p className="mt-3 text-sm text-violet-100/80">{prize.item.description}</p>}
        {outcome.itemWaiting && (
          <p className="mt-3 rounded-xl border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-xs text-amber-200">
            📦 Seu inventário está cheio: o item ficou esperando espaço. Libere espaço no Inventário pra guardar.
          </p>
        )}
        {outcome.leveledUp && <p className="mt-3 text-sm font-bold text-emerald-300">⬆️ Você subiu pro nível {outcome.newLevel}!</p>}
        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={onClose}
            className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2.5 text-sm font-black text-cg-onaccent shadow-lg shadow-amber-500/30 transition-transform hover:scale-[1.03]"
          >
            Oba! Continuar
          </button>
          {prize.item && (
            <Link href="/academia/inventario" className="text-xs font-semibold text-violet-200 underline-offset-2 hover:underline">
              {cosmetic ? "👕 Equipar no Inventário" : prize.item.multiverse ? "🌀 Usar a chave no Inventário" : "🎒 Ver no Inventário"}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function WheelLevelUp({ student, from, to, onClose }: { student: Student; from: number; to: number; onClose: () => void }) {
  const { missions } = useMissions();
  const unlocked = missions.filter((m) => m.teacherId === student.teacherId && !m.eventId && m.minLevel > from && m.minLevel <= to);
  return <LevelUpScreen fromLevel={from} toLevel={to} unlockedMissions={unlocked} onClose={onClose} />;
}

export default function LuckyWheel({
  me,
  status,
  onStatus,
  onClose,
}: {
  me: Student;
  status: WheelStatus | null;
  onStatus: (status: WheelStatus) => void;
  onClose: () => void;
}) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ prize: WheelPrize; outcome: WheelSpinOutcome } | null>(null);
  const [levelUp, setLevelUp] = useState<{ from: number; to: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showChances, setShowChances] = useState(false);
  const [muted, setMuted] = useState(true);
  // o aluno atualizado só entra no cache quando a roleta para (ou se fechar a tela no meio do giro)
  const revealRef = useRef<(() => void) | null>(null);
  const stopSoundRef = useRef<(() => void) | null>(null);
  const timerRef = useRef<number | null>(null);

  const free = status?.freeSpinAvailable ?? false;
  const price = status?.price ?? WHEEL_SPIN_PRICE;
  const canPay = me.coins >= price;

  useEffect(() => {
    setMuted(isSoundMuted());
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      stopSoundRef.current?.();
      revealRef.current?.();
    };
  }, []);

  // Esc fecha (menos no meio do giro)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !spinning) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [spinning, onClose]);

  function toggleSound() {
    setSoundMuted(!muted);
    setMuted(!muted);
  }

  async function spin() {
    if (spinning || (!free && !canPay)) return;
    setError(null);
    setSpinning(true);
    const response = await spinWheel();
    if (!response.ok) {
      setSpinning(false);
      setError(response.error);
      return;
    }
    const { reveal, ...outcome } = response;
    revealRef.current = reveal;
    onStatus({ freeSpinAvailable: outcome.freeSpinAvailable, price: outcome.price });

    // gira 6 voltas e para com a fatia sorteada embaixo do ponteiro (com uma folguinha dentro dela)
    const jitter = (Math.random() - 0.5) * SLICE * 0.6;
    const target = -(outcome.prizeIndex * SLICE) + jitter;
    const current = rotation % 360;
    const delta = ((target - current) % 360 + 360) % 360;
    const turns = 360 * 6 + delta;
    setRotation(rotation + turns);
    if (!isSoundMuted()) stopSoundRef.current = playWheelTicks(Math.round(turns / SLICE), SPIN_MS);

    timerRef.current = window.setTimeout(() => {
      const prize = WHEEL_PRIZES[outcome.prizeIndex];
      revealRef.current?.();
      revealRef.current = null;
      setSpinning(false);
      setResult({ prize, outcome });
      if (!isSoundMuted()) playWheelPrize(prize.rarity === "lendario" || prize.rarity === "epico");
    }, SPIN_MS + 250);
  }

  function closeResult() {
    if (result?.outcome.leveledUp) setLevelUp({ from: result.outcome.fromLevel, to: result.outcome.newLevel });
    setResult(null);
  }

  return (
    <div className="cg-dark-scope fixed inset-0 z-[55] flex flex-col overflow-y-auto" role="dialog" aria-modal="true" aria-label="Roleta da Sorte">
      {/* o fundo: um palco de cassino mágico */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(50% 45% at 50% 42%, rgba(251,191,36,0.25), transparent 70%), radial-gradient(60% 80% at 90% 10%, rgba(236,72,153,0.3), transparent 70%), radial-gradient(60% 80% at 10% 90%, rgba(99,102,241,0.35), transparent 70%), linear-gradient(160deg, #0f0a2e 0%, #2e1065 55%, #4a044e 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-8 pt-4">
        {/* topo */}
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-amber-400/40 bg-black/30 px-3 py-1.5">
            <CoinIcon size={20} />
            <span className="text-lg font-black text-amber-300">{me.coins}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              title={muted ? "Ligar o som" : "Desligar o som"}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-400/40 bg-black/30 text-sm"
            >
              {muted ? "🔇" : "🔊"}
            </button>
            <button
              onClick={onClose}
              disabled={spinning}
              className="rounded-full border border-rose-400/50 bg-rose-500/20 px-4 py-1.5 text-sm font-bold text-rose-100 transition-colors hover:bg-rose-500/35 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ✕ Fechar
            </button>
          </div>
        </div>

        <div className="mt-2 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-200/80">🛍️ Mercado Arcano</p>
          <h2 className="cg-anim-shimmer text-4xl font-black uppercase tracking-wide sm:text-5xl">Roleta da Sorte</h2>
          <p className="mt-1 text-sm text-violet-100/80">
            Todo dia você tem <strong className="text-amber-200">1 giro grátis</strong>. Depois dele, cada giro custa{" "}
            <strong className="text-amber-200">{price} moedas</strong>.
          </p>
        </div>

        <div className="mt-4 flex flex-1 flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center">
          {/* a roleta */}
          <div className="flex flex-col items-center">
            <div className="relative aspect-square w-[min(88vw,30rem)]">
              <div className="absolute inset-[6%] rounded-full blur-3xl" style={{ background: "rgba(251,191,36,0.35)" }} aria-hidden="true" />
              <div className="relative h-full w-full drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)]">
                <WheelArt rotation={rotation} spinning={spinning} />
              </div>
            </div>

            <button
              onClick={spin}
              disabled={spinning || (!free && !canPay)}
              className={`mt-5 flex min-w-[16rem] items-center justify-center gap-2 rounded-full px-8 py-3.5 text-lg font-black uppercase tracking-wide shadow-xl transition-transform disabled:cursor-not-allowed disabled:opacity-60 ${
                free
                  ? "cg-anim-wheel-glow bg-gradient-to-r from-emerald-400 to-teal-500 text-cg-onaccent shadow-emerald-500/40 hover:scale-[1.04]"
                  : "bg-gradient-to-r from-amber-400 to-orange-500 text-cg-onaccent shadow-amber-500/40 hover:scale-[1.04]"
              } disabled:hover:scale-100`}
            >
              {spinning ? (
                "Girando..."
              ) : !status ? (
                "Carregando..."
              ) : free ? (
                "🎁 Girar grátis"
              ) : canPay ? (
                <>
                  Girar por <CoinIcon size={20} /> {price}
                </>
              ) : (
                `Faltam ${price - me.coins} moedas`
              )}
            </button>
            {!spinning && status && !free && (
              <p className="mt-2 text-xs text-violet-100/70">O giro grátis de hoje já foi usado. Amanhã tem outro!</p>
            )}
            {error && <p className="mt-2 max-w-xs text-center text-sm font-semibold text-rose-300">{error}</p>}
          </div>

          {/* os prêmios e as chances */}
          <div className="w-full max-w-sm rounded-3xl border border-violet-400/30 bg-black/30 p-4 backdrop-blur">
            <button
              onClick={() => setShowChances((v) => !v)}
              className="flex w-full items-center justify-between text-left text-sm font-black uppercase tracking-wider text-amber-200"
            >
              🏆 Prêmios e chances
              <span className="text-violet-200 lg:hidden">{showChances ? "▲" : "▼"}</span>
            </button>
            <ul className={`mt-3 space-y-1 ${showChances ? "" : "hidden lg:block"}`}>
              {[...WHEEL_PRIZES]
                .sort((a, b) => b.weight - a.weight)
                .map((prize) => (
                  <li key={prize.key} className="flex items-center gap-2 rounded-xl px-2 py-1 text-sm hover:bg-white/5">
                    <span className="w-6 text-center text-base">{prize.coins ? <CoinIcon size={16} /> : prize.icon}</span>
                    <span className="flex-1 text-violet-50">{prizeText(prize)}</span>
                    <span className="h-2 w-2 rounded-full" style={{ background: RARITY_GLOW[prize.rarity] }} aria-hidden="true" />
                    <span className="w-12 text-right font-mono text-xs text-violet-200">
                      {prizeChance(prize).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%
                    </span>
                  </li>
                ))}
            </ul>
            <p className={`mt-3 text-[11px] leading-snug text-violet-200/70 ${showChances ? "" : "hidden lg:block"}`}>
              Visual que você já tem vem como outra cópia (dá pra vender no Inventário). Se o inventário estiver cheio, o item fica esperando
              espaço: nada se perde.
            </p>
          </div>
        </div>
      </div>

      {result && <PrizeReveal prize={result.prize} outcome={result.outcome} me={me} onClose={closeResult} />}
      {levelUp && <WheelLevelUp student={me} from={levelUp.from} to={levelUp.to} onClose={() => setLevelUp(null)} />}
    </div>
  );
}

/** A roletinha girando do botão da Loja (só enfeite: as cores das fatias, sem os prêmios). */
export function MiniWheel({ size = 72 }: { size?: number }) {
  return (
    <svg viewBox="0 0 440 440" width={size} height={size} aria-hidden="true" className="shrink-0 drop-shadow-[0_6px_14px_rgba(0,0,0,0.5)]">
      <circle cx={C} cy={C} r={216} fill="#78350f" />
      <circle cx={C} cy={C} r={208} fill="#f59e0b" />
      <g className="cg-anim-wheel-spin" style={{ transformOrigin: `${C}px ${C}px` }}>
        {WHEEL_PRIZES.map((prize, i) => (
          <path key={prize.key} d={slicePath(i)} fill={SLICE_COLORS[i % SLICE_COLORS.length]} stroke="#1e1b4b" strokeWidth="3" />
        ))}
      </g>
      <circle cx={C} cy={C} r={46} fill="url(#roleta-mini-hub)" stroke="#78350f" strokeWidth="8" />
      <defs>
        <radialGradient id="roleta-mini-hub" cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#b45309" />
        </radialGradient>
      </defs>
      <path d={`M${C - 26} 0 L${C + 26} 0 L${C} 60 Z`} fill="#ef4444" stroke="#7f1d1d" strokeWidth="6" strokeLinejoin="round" />
    </svg>
  );
}
