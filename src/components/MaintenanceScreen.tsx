"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SERVER_ERROR_EVENT } from "@/services/api";

// ============================================================================
// TELA DE MANUTENÇÃO — cobre o site inteiro quando o banco de dados está fora
// do ar (ex.: o plano gratuito do Neon atingiu o limite do mês).
//
// Ela aparece e some sozinha, sem precisar de deploy:
// - ao abrir o site, e sempre que alguma chamada da API dá erro 500, o site
//   pergunta pro GET /api/health (que faz um "select 1" no banco). Se ele
//   responder 500, o banco caiu: a tela aparece;
// - com a tela aberta, ele pergunta de novo a cada minuto (só com a aba
//   visível) e, quando o banco volta, recarrega o site.
// Sem internet ou com a API acordando (Render), o /health nem responde 500,
// então a tela não aparece à toa.
// Pra ver a tela com o banco no ar: abra o site com ?manutencao no endereço.
// ============================================================================

const RECHECK_MS = 60_000;

/** O banco respondeu? true = no ar, false = fora do ar (500), null = não deu pra saber. */
async function databaseIsUp(): Promise<boolean | null> {
  try {
    const response = await fetch("/api/health", { cache: "no-store" });
    if (response.ok) return true;
    if (response.status !== 500) return null;
    // só o 500 da nossa API (JSON com a mensagem); o do repasse do Vercel não conta
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    return body?.message ? false : null;
  } catch {
    return null;
  }
}

export function MaintenanceGate() {
  const [down, setDown] = useState(false);
  const [preview, setPreview] = useState(false);
  const [checking, setChecking] = useState(false);
  const wasDown = useRef(false);

  const check = useCallback(async () => {
    setChecking(true);
    const up = await databaseIsUp();
    setChecking(false);
    if (up === false) {
      wasDown.current = true;
      setDown(true);
    }
    // voltou: recarrega pra o site buscar tudo de novo (sessão, listas...)
    if (up === true && wasDown.current) window.location.reload();
  }, []);

  useEffect(() => {
    setPreview(new URLSearchParams(window.location.search).has("manutencao"));
    void check();
    const onServerError = () => void check();
    window.addEventListener(SERVER_ERROR_EVENT, onServerError);
    return () => window.removeEventListener(SERVER_ERROR_EVENT, onServerError);
  }, [check]);

  useEffect(() => {
    if (!down) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void check();
    }, RECHECK_MS);
    return () => window.clearInterval(timer);
  }, [down, check]);

  if (!down && !preview) return null;
  return <MaintenanceScreen checking={checking} onRetry={() => void check()} />;
}

function MaintenanceScreen({ checking, onRetry }: { checking: boolean; onRetry: () => void }) {
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="cg-maintenance-title"
      className="cg-dark-scope fixed inset-0 z-[200] overflow-y-auto bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 text-slate-100"
    >
      <div className="mx-auto flex min-h-full max-w-2xl flex-col items-center justify-center gap-5 px-4 py-8 text-center sm:px-6">
        <RobotArt />

        <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-300">
          ⚠️ Limite dos servidores atingido
        </span>

        <h1 id="cg-maintenance-title" className="text-2xl font-bold text-white sm:text-3xl">
          A CodeGuilds está em manutenção 🔧
        </h1>

        <div className="space-y-3 text-sm leading-relaxed text-slate-300 sm:text-base">
          <p>
            A CodeGuilds atingiu o limite dos seus servidores. Foi uma <strong className="text-white">quantidade enorme de acessos</strong>, e o servidor da CodeGuilds não
            deu conta de tanta gente ao mesmo tempo.
          </p>
          <p>
            A plataforma cresceu <strong className="text-white">muito mais rápido do que o esperado</strong> e, por isso, está passando por uma{" "}
            <strong className="text-white">troca de servidores</strong>, pra poder receber ainda mais alunos.
          </p>
          <p>
            O <strong className="text-amber-300">professor Danilo</strong> já está trabalhando pra que a plataforma volte o quanto antes.
          </p>
        </div>

        <div className="w-full rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          🛡️ Fique tranquilo: seu XP, suas moedas, seus itens e suas missões estão guardados e continuam do jeito que você deixou.
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={onRetry}
            disabled={checking}
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:bg-violet-500 disabled:opacity-60"
          >
            {checking ? "Conferindo..." : "🔄 Tentar de novo"}
          </button>
          <p className="text-xs text-slate-400">Esta página confere sozinha a cada minuto e abre a CodeGuilds assim que ela voltar.</p>
        </div>
      </div>
    </div>
  );
}

/** O robô de capacete consertando o servidor: a chave balança, saem faíscas e as engrenagens giram. */
function RobotArt() {
  return (
    <svg viewBox="0 0 360 230" role="img" aria-label="Um robô de capacete amarelo consertando um servidor com uma chave inglesa, com faíscas e engrenagens girando" className="w-full max-w-sm">
      {/* chão */}
      <ellipse cx="180" cy="214" rx="160" ry="10" fill="#1e1b4b" />

      {/* engrenagens girando no fundo */}
      {[
        { x: 52, y: 58, r: 22, dur: "6s", spin: "0;360", color: "#7c3aed" },
        { x: 88, y: 92, r: 14, dur: "4s", spin: "360;0", color: "#a78bfa" },
      ].map((g) => (
        <g key={g.x} transform={`translate(${g.x} ${g.y})`}>
          <g>
            {Array.from({ length: 8 }, (_, i) => (
              <rect key={i} x={-4} y={-g.r - 6} width="8" height="10" rx="2" fill={g.color} transform={`rotate(${i * 45})`} />
            ))}
            <circle r={g.r} fill={g.color} />
            <circle r={g.r * 0.4} fill="#1e1b4b" />
            <animateTransform attributeName="transform" type="rotate" values={g.spin} dur={g.dur} repeatCount="indefinite" />
          </g>
        </g>
      ))}

      {/* o servidor, com as luzes piscando */}
      <g transform="translate(232 70)">
        <rect width="96" height="142" rx="8" fill="#334155" stroke="#64748b" strokeWidth="3" />
        {[0, 1, 2, 3].map((row) => (
          <g key={row} transform={`translate(10 ${12 + row * 32})`}>
            <rect width="76" height="24" rx="4" fill="#0f172a" />
            <rect x="34" y="9" width="34" height="5" rx="2" fill="#475569" />
            {[0, 1].map((led) => (
              <circle key={led} cx={9 + led * 11} cy="12" r="4" fill={row === 1 && led === 0 ? "#f43f5e" : "#22c55e"}>
                <animate attributeName="opacity" values="1;0.2;1" dur={`${0.8 + ((row + led) % 3) * 0.4}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </g>
        ))}
        {/* a tampa aberta pra consertar */}
        <rect x="-6" y="44" width="10" height="34" rx="3" fill="#94a3b8" />
      </g>

      {/* faíscas saindo do conserto */}
      {[
        { dx: -14, dy: -18, delay: "0s" },
        { dx: -20, dy: 4, delay: "0.3s" },
        { dx: -8, dy: -26, delay: "0.6s" },
      ].map((s) => (
        <circle key={s.delay} cx="226" cy="122" r="3" fill="#fde047" opacity="0">
          <animate attributeName="cx" values={`226;${226 + s.dx}`} dur="0.9s" begin={s.delay} repeatCount="indefinite" />
          <animate attributeName="cy" values={`122;${122 + s.dy}`} dur="0.9s" begin={s.delay} repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0" dur="0.9s" begin={s.delay} repeatCount="indefinite" />
        </circle>
      ))}

      {/* o robô */}
      <g transform="translate(150 0)">
        {/* antena com a luz piscando */}
        <line x1="0" y1="40" x2="0" y2="22" stroke="#94a3b8" strokeWidth="4" />
        <circle cy="18" r="6" fill="#f43f5e">
          <animate attributeName="fill" values="#f43f5e;#fbbf24;#f43f5e" dur="1.2s" repeatCount="indefinite" />
        </circle>

        {/* cabeça com o capacete de obra */}
        <rect x="-36" y="40" width="72" height="54" rx="14" fill="#cbd5e1" stroke="#64748b" strokeWidth="3" />
        <path d="M-40 52 Q0 18 40 52 Z" fill="#facc15" stroke="#a16207" strokeWidth="3" />
        <rect x="-46" y="50" width="92" height="7" rx="3" fill="#eab308" />
        <rect x="-26" y="62" width="52" height="22" rx="8" fill="#0f172a" />
        {[-12, 12].map((ex) => (
          <circle key={ex} cx={ex} cy="73" r="5" fill="#38bdf8">
            <animate attributeName="r" values="5;5;1;5" keyTimes="0;0.9;0.95;1" dur="3s" repeatCount="indefinite" />
          </circle>
        ))}

        {/* corpo */}
        <rect x="-30" y="98" width="60" height="74" rx="12" fill="#94a3b8" stroke="#64748b" strokeWidth="3" />
        <rect x="-18" y="110" width="36" height="24" rx="5" fill="#1e293b" />
        <path d="M-12 122 L-4 122 L0 114 L5 130 L9 122 L13 122" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="-10" cy="150" r="4" fill="#f59e0b" />
        <circle cx="2" cy="150" r="4" fill="#38bdf8" />
        <circle cx="14" cy="150" r="4" fill="#a78bfa" />

        {/* braço esquerdo parado */}
        <rect x="-46" y="104" width="14" height="48" rx="7" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />

        {/* braço direito com a chave inglesa, balançando */}
        <g>
          <rect x="30" y="104" width="46" height="14" rx="7" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
          <g transform="translate(76 111)">
            <rect x="-4" y="-5" width="30" height="10" rx="4" fill="#f97316" />
            <path d="M24 -12 L36 -12 L36 -4 L30 -4 L30 4 L36 4 L36 12 L24 12 Z" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
          </g>
          <animateTransform attributeName="transform" type="rotate" values="0 36 111;-14 36 111;0 36 111" dur="0.9s" repeatCount="indefinite" />
        </g>

        {/* pernas e esteiras */}
        <rect x="-24" y="172" width="16" height="24" rx="5" fill="#64748b" />
        <rect x="8" y="172" width="16" height="24" rx="5" fill="#64748b" />
        <rect x="-36" y="194" width="72" height="16" rx="8" fill="#334155" />
        {[-24, -8, 8, 24].map((wx) => (
          <circle key={wx} cx={wx} cy="202" r="4" fill="#94a3b8" />
        ))}
      </g>

      {/* caixa de ferramentas */}
      <g transform="translate(40 178)">
        <rect width="62" height="32" rx="5" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
        <path d="M18 0 V-8 H44 V0" fill="none" stroke="#991b1b" strokeWidth="4" />
        <rect x="26" y="12" width="10" height="6" rx="2" fill="#fde047" />
      </g>
    </svg>
  );
}
