"use client";

import { useEffect, useState } from "react";
import { ActiveBuff, BUFF_LABELS, activeBuffs, formatCountdown } from "@/engine/buffs";
import { Student } from "@/engine/students";
import { serverNow } from "@/services/api";

const THEME: Record<ActiveBuff["kind"], { ring: string; text: string; bar: string }> = {
  xp: { ring: "border-violet-400/70 shadow-violet-500/40", text: "text-violet-200", bar: "bg-violet-400" },
  moedas: { ring: "border-amber-400/70 shadow-amber-500/40", text: "text-amber-200", bar: "bg-amber-400" },
};

/** Nos últimos 30 segundos o cronômetro pisca, avisando que o Buf vai acabar. */
const ENDING_MS = 30_000;

/**
 * O cronômetro dos Bufs ligados (engine/buffs.ts): fica no canto de baixo da
 * tela em toda a Academia, por cima de tudo (missões, eventos, janelas), e
 * some quando o Buf acaba. Não pega cliques, pra nunca atrapalhar a tela de baixo.
 */
export default function BuffTimer({ student }: { student: Student }) {
  // a hora do servidor (o relógio do computador pode estar errado)
  const [now, setNow] = useState(() => serverNow());
  const running = activeBuffs(student, now);
  const hasRunning = running.length > 0;

  // só fica contando enquanto tem Buf ligado
  useEffect(() => {
    if (!hasRunning) return;
    const timer = window.setInterval(() => setNow(serverNow()), 1000);
    return () => window.clearInterval(timer);
  }, [hasRunning]);

  // um Buf novo (usado agora no Inventário) aparece na hora
  useEffect(() => {
    setNow(serverNow());
  }, [student.buffs]);

  if (!hasRunning) return null;

  return (
    <div className="cg-dark-scope pointer-events-none fixed bottom-2 left-2 z-[80] flex flex-col gap-1.5 sm:bottom-3 sm:left-3 sm:gap-2" role="status" aria-live="polite">
      {running.map((buff) => {
        const left = new Date(buff.endsAt).getTime() - now;
        const percent = Math.max(0, Math.min(100, (left / (buff.minutes * 60_000)) * 100));
        const theme = THEME[buff.kind];
        return (
          <div
            key={`${buff.kind}-${buff.startedAt}`}
            className={`cg-anim-pop w-40 overflow-hidden rounded-2xl sm:w-44 border bg-black/85 shadow-lg backdrop-blur-sm ${theme.ring}`}
            title={`${buff.name}: falta ${formatCountdown(left)}`}
          >
            <div className="flex items-center gap-2 px-2.5 pb-1 pt-1.5 sm:px-3 sm:pb-1.5 sm:pt-2">
              <span className="text-lg leading-none sm:text-xl">{buff.icon}</span>
              <div className="min-w-0 flex-1">
                <p className={`whitespace-nowrap text-[10px] font-bold uppercase tracking-wide ${theme.text}`}>
                  Buf de {BUFF_LABELS[buff.kind]} {buff.multiplier}x
                </p>
                <p className={`font-mono text-base font-black sm:text-lg leading-tight tabular-nums ${left <= ENDING_MS ? "animate-pulse text-rose-200" : "text-white"}`}>
                  {formatCountdown(left)}
                </p>
              </div>
            </div>
            <div className="h-1.5 bg-white/10">
              <div className={`h-full transition-[width] duration-1000 ease-linear ${theme.bar}`} style={{ width: `${percent}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
