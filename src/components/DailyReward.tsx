"use client";

import { useEffect, useRef, useState } from "react";
import { Student } from "@/engine/students";
import { useMissions } from "@/engine/store";
import { DailyRewardOutcome, claimDailyReward } from "@/engine/gameApi";
import { dailyRewardLetter } from "@/engine/dailyReward";
import { playDailyRewardChime, speakWizard } from "@/engine/sfx";
import WizardDanilo from "./WizardDanilo";
import LevelUpScreen from "./LevelUpScreen";
import { CoinIcon } from "./GameUI";
import { SoundToggleButton, useSceneSound } from "./SceneSound";

// ============================================================================
// RECOMPENSA DIÁRIA — fica no layout da Academia. Ao abrir a Academia (e ao
// voltar pra aba num dia novo), pede a recompensa do dia à API, que só dá uma
// vez por dia. Se ela foi dada agora, o Mago Danilo aparece entregando um
// pergaminho mágico: a folha desenrola, a carta dele vai sendo escrita (a boca
// mexe enquanto isso) e as recompensas caem carimbadas na folha. No primeiro
// acesso de todos, o pergaminho espera o tutorial fechar. Se o XP fez o aluno
// subir de nível, a cena de subir de nível vem depois.
// ============================================================================

type Gift = Extract<DailyRewardOutcome, { claimed: true }>;

const CHARS_PER_TICK = 2;
const TICK_MS = 24;
const LETTER_DELAY_MS = 1500; // a carta começa a ser escrita quando o pergaminho termina de abrir
const REWARD_DELAYS_MS = [2000, 2250]; // o XP e as moedas caem na folha (o "bling" do som é nesses tempos)

// Estrelas do fundo: posições fixas (em %), tamanho e atraso da cintilada.
const SKY = Array.from({ length: 34 }, (_, i) => ({
  left: (i * 41) % 100,
  top: (i * 29) % 100,
  size: 1 + (i % 3),
  delay: (i % 6) * 0.45,
}));

const SPARKLE_COLORS = ["#fde68a", "#fbbf24", "#fff7d6", "#c4b5fd"];

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** O dia de hoje no horário de Brasília (o mesmo dia que a API usa), como "2026-10-12". */
function todayInBrazil(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
}

/** Número que conta de 0 até `target`, começando depois de `delayMs`. */
function useCountUp(target: number, delayMs: number, durationMs = 900): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }
    let frame = 0;
    const timer = window.setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / durationMs);
        setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    }, delayMs);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [target, delayMs, durationMs]);

  return value;
}

/** Faíscas douradas subindo pela tela inteira. */
function Sparkles() {
  const [sparks] = useState(() =>
    Array.from({ length: 26 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 3 + Math.random() * 4,
      color: SPARKLE_COLORS[i % SPARKLE_COLORS.length],
      delay: 0.8 + Math.random() * 3.5,
      duration: 3 + Math.random() * 2.5,
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

/** Um dos bastões do pergaminho: a madeira, o papel enrolado na frente e as pontas douradas brilhando. */
function ScrollRod() {
  return (
    <div className="relative z-10 mx-auto h-7 w-full" aria-hidden="true">
      <div className="absolute inset-x-3 top-1/2 h-4 -translate-y-1/2 rounded-full border border-[#3b1d0a] bg-gradient-to-b from-[#a16207] via-[#78350f] to-[#451a03]" />
      <div className="absolute inset-x-6 inset-y-0 rounded-full border border-[#a87d3f] bg-gradient-to-b from-[#e7c98d] via-[#fbefcf] to-[#c9a464] shadow-[0_3px_8px_rgba(0,0,0,0.45)]" />
      {["left-0", "right-0"].map((side) => (
        <span key={side} className={`absolute ${side} top-1/2 h-6 w-6 -translate-y-1/2`}>
          <span className="cg-anim-glow absolute -inset-1.5 rounded-full bg-amber-300/40 blur-[3px]" />
          <span className="absolute inset-0 rounded-full border border-[#3b1d0a] bg-[radial-gradient(circle_at_35%_30%,#fff7d6,#fbbf24_45%,#a16207)]" />
        </span>
      ))}
    </div>
  );
}

/** Uma recompensa carimbada na folha, com o número contando. */
function RewardStamp({ amount, label, icon, delayMs }: { amount: number; label: string; icon: React.ReactNode; delayMs: number }) {
  const value = useCountUp(amount, delayMs + 150);

  return (
    <div
      className="cg-anim-stamp flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#a16207]/70 bg-[#fff7d6]/70 px-3 py-2.5 shadow-[inset_0_0_12px_rgba(161,98,7,0.25)]"
      style={{ "--cg-delay": `${delayMs}ms` } as React.CSSProperties}
    >
      {icon}
      <span className="text-left leading-tight">
        <span className="block text-2xl font-black text-[#7c2d12]">+{value}</span>
        <span className="block text-[11px] font-bold uppercase tracking-wider text-[#92400e]">{label}</span>
      </span>
    </div>
  );
}

/** A cena: o Mago Danilo entregando o pergaminho com a carta e as recompensas. */
function DailyRewardScroll({ name, reward, onClose }: { name: string; reward: Gift["reward"]; onClose: () => void }) {
  const letter = dailyRewardLetter(name);
  const [typed, setTyped] = useState(0);
  const [mouthOpen, setMouthOpen] = useState(false);
  const typing = typed < letter.length;
  // o orbe do mago solta um clarão quando o pergaminho abre e quando as recompensas caem
  const [burst, setBurst] = useState(0);

  // Som: a música de fundo pausa, toca o presente e o mago lê a carta (se o som estiver ligado)
  const sound = useSceneSound(() => {
    const stopChime = playDailyRewardChime();
    let stopVoice = () => {};
    const timer = window.setTimeout(() => {
      stopVoice = speakWizard(letter);
    }, LETTER_DELAY_MS);
    return () => {
      window.clearTimeout(timer);
      stopChime();
      stopVoice();
    };
  });

  // A carta vai sendo escrita depois que o pergaminho abre
  useEffect(() => {
    if (prefersReducedMotion()) {
      setTyped(letter.length);
      return;
    }
    let interval = 0;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        setTyped((t) => {
          if (t >= letter.length) {
            window.clearInterval(interval);
            return t;
          }
          return Math.min(letter.length, t + CHARS_PER_TICK);
        });
      }, TICK_MS);
    }, LETTER_DELAY_MS);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [letter.length]);

  // A boca abre e fecha enquanto a carta está sendo escrita
  const writing = typing && typed > 0;
  useEffect(() => {
    if (!writing) {
      setMouthOpen(false);
      return;
    }
    const timer = window.setInterval(() => setMouthOpen((o) => !o), 130);
    return () => window.clearInterval(timer);
  }, [writing]);

  useEffect(() => {
    const timers = [600, REWARD_DELAYS_MS[0]].map((ms, i) => window.setTimeout(() => setBurst(i + 1), ms));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="cg-dark-scope fixed inset-0 z-[60] overflow-y-auto" role="dialog" aria-modal="true" aria-label="Recompensa diária">
      {/* ---- céu da noite mágica ---- */}
      <div
        className="fixed inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(45% 40% at 50% 55%, rgba(251,191,36,0.22), transparent 70%), radial-gradient(50% 45% at 20% 80%, rgba(139,92,246,0.35), transparent 70%), linear-gradient(180deg, #05030f 0%, #150a2e 55%, #1e0b3b 100%)",
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
      <Sparkles />
      <div className="fixed right-1 top-1 z-20">
        <SoundToggleButton muted={sound.muted} onClick={sound.toggle} />
      </div>

      <div className="relative flex min-h-full items-center justify-center p-4 pt-12">
        <div className="flex w-full max-w-4xl flex-col items-center gap-2 md:flex-row md:items-end md:gap-4">
          {/* ---- o mago ---- */}
          <div className="relative flex w-28 shrink-0 flex-col items-center sm:w-44 md:mb-6 md:w-60">
            {/* círculo mágico girando no chão (achatado pra parecer deitado) */}
            <div className="pointer-events-none absolute bottom-3 left-1/2 h-56 w-56 md:h-72 md:w-72" style={{ transform: "translate(-50%, 50%) scaleY(0.26)" }} aria-hidden="true">
              <div className="cg-anim-spin-slow absolute inset-0 rounded-full border-2 border-dashed border-amber-300/70 shadow-[0_0_40px_6px_rgba(251,191,36,0.4)]" />
              <div className="cg-anim-spin-reverse absolute inset-6 rounded-full border border-violet-300/60" />
              <div className="absolute inset-12 rounded-full bg-amber-400/25 blur-md" />
            </div>
            <div className="cg-anim-wizard-enter relative w-full">
              <div className="cg-anim-float">
                <WizardDanilo mouthOpen={mouthOpen} burstKey={burst} className="w-full drop-shadow-[0_0_18px_rgba(250,204,21,0.35)]" />
              </div>
            </div>
            <p className="relative mt-1 whitespace-nowrap rounded-full border border-amber-300/50 bg-gradient-to-r from-violet-700 to-fuchsia-700 px-4 py-1 text-xs font-black uppercase tracking-widest text-amber-200 shadow-lg shadow-violet-900/60">
              ✦ Mago Danilo ✦
            </p>
          </div>

          {/* ---- o pergaminho ---- */}
          <div className="cg-anim-bubble relative w-full max-w-lg flex-1" style={{ animationDelay: "0.25s" }}>
            {/* brilho atrás do pergaminho e o presente saltando dele */}
            <div className="cg-anim-glow pointer-events-none absolute -inset-6 rounded-[3rem] bg-amber-300/20 blur-2xl" aria-hidden="true" />
            <span
              className="cg-anim-gift-pop pointer-events-none absolute -top-4 left-1/2 z-20 -ml-6 text-5xl drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]"
              style={{ "--cg-delay": "0.35s" } as React.CSSProperties}
              aria-hidden="true"
            >
              🎁
            </span>

            <ScrollRod />
            <div className="cg-anim-unroll -my-3.5 grid" style={{ "--cg-delay": "0.5s" } as React.CSSProperties}>
              <div className="min-h-0 overflow-hidden">
                <div
                  className="relative mx-4 border-x border-[#a87d3f] px-5 pb-6 pt-7 text-[#3b1d0a] sm:mx-5 sm:px-7"
                  style={{
                    background:
                      "radial-gradient(120% 70% at 50% 0%, rgba(255,250,235,0.9), transparent 60%), linear-gradient(160deg, #fbf0d0 0%, #f0d9a4 60%, #e2c085 100%)",
                    boxShadow: "inset 0 0 36px rgba(120,72,20,0.35), inset 0 10px 14px -10px rgba(0,0,0,0.5), inset 0 -10px 14px -10px rgba(0,0,0,0.5)",
                  }}
                >
                  <p className="text-center text-[11px] font-black uppercase tracking-[0.25em] text-[#92400e]">✦ Recompensa diária ✦</p>
                  <h2 className="mt-1 text-center text-2xl font-black text-[#7c2d12] sm:text-3xl">Um presente do Mago!</h2>
                  <div className="mx-auto mt-2 h-px w-2/3 bg-gradient-to-r from-transparent via-[#a87d3f] to-transparent" />

                  <button
                    type="button"
                    onClick={() => setTyped(letter.length)}
                    title={typing ? "Clique pra mostrar a carta inteira" : undefined}
                    className="mt-3 block min-h-[8.5rem] w-full text-left font-serif text-[14px] italic leading-relaxed sm:text-base"
                  >
                    <span aria-hidden="true">
                      {letter.slice(0, typed)}
                      {writing && <span className="cg-anim-caret ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-[#7c2d12]" />}
                    </span>
                    <span className="sr-only">{letter}</span>
                  </button>

                  <div className="mt-4 flex gap-3">
                    <RewardStamp
                      amount={reward.xp}
                      label="de XP"
                      delayMs={REWARD_DELAYS_MS[0]}
                      icon={<span className="text-3xl drop-shadow-[0_0_6px_rgba(139,92,246,0.6)]">✨</span>}
                    />
                    <RewardStamp amount={reward.coins} label="moedas" delayMs={REWARD_DELAYS_MS[1]} icon={<CoinIcon size={34} />} />
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <p className="font-serif text-sm italic text-[#92400e]">— Mago Danilo</p>
                    {/* selo de cera com a fita */}
                    <span className="relative mr-1 h-11 w-11 shrink-0" aria-hidden="true">
                      <span className="absolute left-1.5 top-7 h-5 w-2.5 -rotate-12 bg-[#7f1d1d]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)" }} />
                      <span className="absolute right-1.5 top-7 h-5 w-2.5 rotate-12 bg-[#7f1d1d]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)" }} />
                      <span className="absolute inset-0 flex items-center justify-center rounded-full border-2 border-[#7f1d1d] bg-[radial-gradient(circle_at_35%_30%,#f87171,#b91c1c_55%,#7f1d1d)] text-sm font-black text-red-100 shadow-md">
                        ✦
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <ScrollRod />

            <button
              onClick={onClose}
              className="cg-anim-rise relative z-10 mt-5 w-full rounded-full bg-gradient-to-r from-amber-300 to-orange-400 px-6 py-3 text-sm font-black text-cg-ink shadow-lg shadow-amber-500/30 transition-transform hover:scale-[1.03]"
              style={{ animationDelay: "2.5s" }}
            >
              Obrigado, Mago Danilo! ✨
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** A cena de subir de nível, com as missões que o novo nível liberou. */
function DailyLevelUp({ student, from, to, onClose }: { student: Student; from: number; to: number; onClose: () => void }) {
  const { missions } = useMissions();
  const unlocked = missions.filter((m) => m.teacherId === student.teacherId && !m.eventId && m.minLevel > from && m.minLevel <= to);

  return <LevelUpScreen fromLevel={from} toLevel={to} unlockedMissions={unlocked} onClose={onClose} />;
}

export default function DailyReward({ student }: { student: Student }) {
  const [gift, setGift] = useState<Gift | null>(null);
  const [levelUp, setLevelUp] = useState<{ from: number; to: number } | null>(null);
  // o último "aluno + dia" já conferido: só pede de novo se o dia virar (ou se trocar de aluno)
  const checkedRef = useRef<string | null>(null);

  useEffect(() => {
    async function check() {
      if (document.visibilityState === "hidden") return;
      const key = `${student.id}:${todayInBrazil()}`;
      if (checkedRef.current === key) return;
      checkedRef.current = key;

      const result = await claimDailyReward();
      // deu erro (sem internet, API acordando): tenta de novo quando o aluno voltar pra aba
      if (!result.ok) {
        checkedRef.current = null;
        return;
      }
      if (result.claimed) setGift(result);
    }

    void check();
    document.addEventListener("visibilitychange", check);
    return () => document.removeEventListener("visibilitychange", check);
  }, [student.id]);

  function closeScroll() {
    if (gift?.leveledUp) setLevelUp({ from: gift.fromLevel, to: gift.newLevel });
    setGift(null);
  }

  return (
    <>
      {/* no primeiro acesso de todos, o tutorial vem antes */}
      {gift && student.tutorialDone && <DailyRewardScroll name={student.name} reward={gift.reward} onClose={closeScroll} />}
      {levelUp && <DailyLevelUp student={student} from={levelUp.from} to={levelUp.to} onClose={() => setLevelUp(null)} />}
    </>
  );
}
