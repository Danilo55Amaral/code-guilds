"use client";

import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";

// ============================================================================
// GRÁFICOS DO DASHBOARD — desenhados em SVG, sem biblioteca. Seguem as regras
// do guia de visualização de dados do projeto:
// - cores por papel, definidas como variáveis CSS (--viz-*) no DashboardStyles,
//   com valores próprios pro tema claro e pro escuro (paleta validada);
// - barras finas com a ponta de cima arredondada (4px), 2px de espaço entre
//   elas, grade e eixos discretos, texto sempre nas cores de texto (nunca na
//   cor da série);
// - tooltip em toda barra (mouse e teclado) e tabela com os dados.
// ============================================================================

/** As cores dos gráficos (variáveis CSS). Tema escuro é o padrão; html.light troca. */
export function DashboardStyles() {
  return (
    <style>{`
      .cg-viz {
        --viz-series-1: #3987e5;
        --viz-series-2: #d95926;
        --viz-good: #0ca30c;
        --viz-critical: #d03b3b;
        --viz-track: rgba(255, 255, 255, 0.08);
        --viz-grid: rgba(255, 255, 255, 0.07);
        --viz-axis: rgba(255, 255, 255, 0.18);
        --viz-surface: #101018;
      }
      html.light .cg-viz {
        --viz-series-1: #2a78d6;
        --viz-series-2: #eb6834;
        --viz-track: rgba(15, 23, 42, 0.08);
        --viz-grid: rgba(15, 23, 42, 0.07);
        --viz-axis: rgba(15, 23, 42, 0.2);
        --viz-surface: #ffffff;
      }
    `}</style>
  );
}

/** Largura atual de um elemento (os gráficos se redesenham quando a tela muda de tamanho). */
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) return;
    setWidth(ref.current.clientWidth);
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}

/**
 * Marcas do eixo Y "redondas" (0, 5, 10, 15...) que cobrem o maior valor.
 * `steps` troca os passos possíveis (ex.: minutos: 15, 30, 60...).
 */
function niceTicks(max: number, count = 4, steps?: number[]): number[] {
  if (max <= 0) return [0, steps?.[0] ?? 1];
  const rough = max / count;
  const power = Math.pow(10, Math.floor(Math.log10(rough)));
  const step = (steps ? steps.find((s) => s >= rough) ?? steps[steps.length - 1] * Math.ceil(rough / steps[steps.length - 1]) : undefined)
    ?? [1, 2, 2.5, 5, 10].map((m) => m * power).find((s) => s >= rough)
    ?? 10 * power;
  const ticks: number[] = [];
  for (let v = 0; v <= max + step * 0.001; v += step) ticks.push(Math.round(v * 1000) / 1000);
  if (ticks[ticks.length - 1] < max) ticks.push(ticks[ticks.length - 1] + step);
  return ticks;
}

/** Caminho de uma barra com só os cantos de cima arredondados (a base fica reta, no eixo). */
function barPath(x: number, y: number, w: number, h: number, r = 4): string {
  if (h <= 0) return "";
  const rr = Math.min(r, w / 2, h);
  return `M${x},${y + h} V${y + rr} Q${x},${y} ${x + rr},${y} H${x + w - rr} Q${x + w},${y} ${x + w},${y + rr} V${y + h} Z`;
}

export interface BarDatum {
  key: string;
  /** Rótulo do eixo X (pode ser vazio pra não amontoar). */
  label: string;
  value: number;
  /** Título do tooltip (ex.: "Seg, 06/10"). */
  tooltipTitle: string;
  /** Valor formatado do tooltip (ex.: "1h 20min"). */
  tooltipValue: string;
}

/**
 * Gráfico de colunas de uma série só (ex.: tempo online por dia).
 * `formatTick` escreve os valores do eixo Y; `color` é a variável CSS da série.
 */
export function ColumnChart({
  data,
  formatTick,
  color = "var(--viz-series-1)",
  height = 220,
  seriesName,
  tickSteps,
}: {
  data: BarDatum[];
  formatTick: (value: number) => string;
  color?: string;
  height?: number;
  seriesName: string;
  /** Passos possíveis do eixo Y (padrão: 1, 2, 5, 10...). */
  tickSteps?: number[];
}) {
  const { ref, width } = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);

  const max = Math.max(0, ...data.map((d) => d.value));
  const ticks = niceTicks(max, 4, tickSteps);
  const top = ticks[ticks.length - 1] || 1;

  const margin = { top: 12, right: 8, bottom: 28, left: 48 };
  const plotW = Math.max(0, width - margin.left - margin.right);
  const plotH = height - margin.top - margin.bottom;
  const band = data.length ? plotW / data.length : 0;
  const gap = Math.max(2, band * 0.25);
  const barW = Math.max(2, band - gap);
  const y = (v: number) => margin.top + plotH - (v / top) * plotH;

  const activeDatum = active !== null ? data[active] : null;
  const tipX = active !== null ? margin.left + band * active + band / 2 : 0;

  return (
    <div ref={ref} className="relative w-full" onPointerLeave={() => setActive(null)}>
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label={seriesName} className="block overflow-visible">
          {/* grade e eixo Y */}
          {ticks.map((t) => (
            <g key={t}>
              <line x1={margin.left} x2={width - margin.right} y1={y(t)} y2={y(t)} stroke={t === 0 ? "var(--viz-axis)" : "var(--viz-grid)"} strokeWidth={1} />
              <text x={margin.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-slate-500 text-[10px] tabular-nums">
                {formatTick(t)}
              </text>
            </g>
          ))}

          {/* barras */}
          {data.map((d, i) => {
            const x = margin.left + band * i + gap / 2;
            const h = (d.value / top) * plotH;
            const isActive = active === i;
            return (
              <g key={d.key}>
                <path d={barPath(x, y(d.value), barW, h)} fill={color} opacity={active === null || isActive ? 1 : 0.55} />
                {/* área de toque maior que a barra (a coluna inteira) */}
                <rect
                  x={margin.left + band * i}
                  y={margin.top}
                  width={band}
                  height={plotH}
                  fill="transparent"
                  tabIndex={0}
                  aria-label={`${d.tooltipTitle}: ${d.tooltipValue}`}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className="cursor-default outline-none"
                />
                {d.label && (
                  <text x={margin.left + band * i + band / 2} y={height - 8} textAnchor="middle" className="fill-slate-500 text-[10px]">
                    {d.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      )}

      {/* tooltip: o valor em destaque, o nome do dia embaixo */}
      {activeDatum && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-slate-700 bg-cg-card px-3 py-2 text-xs shadow-xl"
          style={{ left: Math.min(Math.max(tipX, 60), width - 60), top: y(activeDatum.value) - 8 }}
        >
          <p className="flex items-center gap-1.5 text-sm font-bold text-white">
            <span className="inline-block h-0.5 w-3 rounded" style={{ background: color }} />
            {activeDatum.tooltipValue}
          </p>
          <p className="text-slate-400">{activeDatum.tooltipTitle}</p>
        </div>
      )}
    </div>
  );
}

/** Anel de progresso (ex.: missões concluídas do catálogo). O centro mostra a porcentagem. */
export function ProgressRing({ value, total, size = 148, label }: { value: number; total: number; size?: number; label: string }) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const ratio = total > 0 ? Math.min(1, value / total) : 0;
  const pct = Math.round(ratio * 100);

  return (
    <svg width={size} height={size} role="img" aria-label={`${label}: ${value} de ${total} (${pct}%)`} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--viz-track)" strokeWidth={stroke} />
      {ratio > 0 && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--viz-series-1)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference * ratio} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-[stroke-dasharray] duration-700"
        />
      )}
      <text x="50%" y="47%" textAnchor="middle" className="fill-white text-[28px] font-black tabular-nums">
        {pct}%
      </text>
      <text x="50%" y="62%" textAnchor="middle" className="fill-slate-400 text-[11px]">
        {value} de {total}
      </text>
    </svg>
  );
}

/**
 * Barra 100% dividida em duas partes com status (acertos x erros): verde com ✓
 * e vermelho com ✗, sempre com o rótulo escrito, nunca só a cor.
 */
export function SplitBar({ good, bad, goodLabel, badLabel }: { good: number; bad: number; goodLabel: string; badLabel: string }) {
  const total = good + bad;
  const goodPct = total ? Math.round((good / total) * 100) : 0;
  const badPct = total ? 100 - goodPct : 0;

  return (
    <div>
      <div className="flex h-4 w-full gap-0.5 overflow-hidden rounded-full" role="img" aria-label={`${goodLabel}: ${good} (${goodPct}%). ${badLabel}: ${bad} (${badPct}%).`}>
        {good > 0 && <div className="h-full rounded-l-full" style={{ width: `${(good / total) * 100}%`, background: "var(--viz-good)" }} />}
        {bad > 0 && <div className="h-full rounded-r-full" style={{ width: `${(bad / total) * 100}%`, background: "var(--viz-critical)" }} />}
        {total === 0 && <div className="h-full w-full rounded-full" style={{ background: "var(--viz-track)" }} />}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="flex items-center gap-1.5 text-slate-400">
            <span className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-black text-white" style={{ background: "var(--viz-good)" }}>✓</span>
            {goodLabel}
          </p>
          <p className="mt-0.5 text-2xl font-black text-white tabular-nums">
            {good} <span className="text-sm font-semibold text-slate-400">({goodPct}%)</span>
          </p>
        </div>
        <div className="text-right">
          <p className="flex items-center justify-end gap-1.5 text-slate-400">
            {badLabel}
            <span className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-black text-white" style={{ background: "var(--viz-critical)" }}>✗</span>
          </p>
          <p className="mt-0.5 text-2xl font-black text-white tabular-nums">
            {bad} <span className="text-sm font-semibold text-slate-400">({badPct}%)</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export interface ScoreRow {
  key: string;
  label: ReactNode;
  /** De 0 a 1. */
  value: number;
  detail: string;
}

/**
 * Lista de barras horizontais de 0 a 100% (ex.: média de acertos por missão),
 * com a linha da nota mínima pra passar (60%).
 */
export function ScoreBars({ rows, threshold = 0.6, thresholdLabel = "nota para passar" }: { rows: ScoreRow[]; threshold?: number; thresholdLabel?: string }) {
  return (
    <div className="flex flex-col gap-3">
      {rows.map((row) => {
        const pct = Math.round(row.value * 100);
        return (
          <div key={row.key} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1">
            <p className="truncate text-sm text-slate-200">{row.label}</p>
            <p className="text-sm font-bold text-white tabular-nums">{pct}%</p>
            <div className="relative col-span-2 h-2.5 rounded-full" style={{ background: "var(--viz-track)" }} title={`${pct}% · ${row.detail}`}>
              <div className="h-full rounded-full" style={{ width: `${Math.max(pct, 1)}%`, background: "var(--viz-series-1)" }} />
              <span
                className="absolute -top-1 bottom-[-4px] w-0.5 rounded"
                style={{ left: `${threshold * 100}%`, background: "var(--viz-axis)" }}
                aria-hidden
              />
            </div>
            <p className="col-span-2 text-[11px] text-slate-500">{row.detail}</p>
          </div>
        );
      })}
      <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
        <span className="inline-block h-3 w-0.5 rounded" style={{ background: "var(--viz-axis)" }} />
        {Math.round(threshold * 100)}% = {thresholdLabel}
      </p>
    </div>
  );
}

/** Tabela com os dados de um gráfico, escondida num "Ver dados em tabela" (acessibilidade e conferência). */
export function DataTable({ caption, columns, rows }: { caption: string; columns: string[]; rows: string[][] }) {
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [caption]);

  return (
    <div className="mt-3">
      <button onClick={() => setOpen((o) => !o)} className="text-[11px] font-semibold text-slate-500 underline-offset-2 hover:text-slate-300 hover:underline">
        {open ? "Esconder tabela" : "Ver dados em tabela"}
      </button>
      {open && (
        <div className="mt-2 max-h-56 overflow-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs">
            <caption className="sr-only">{caption}</caption>
            <thead className="sticky top-0 bg-cg-card text-slate-400">
              <tr>
                {columns.map((c) => (
                  <th key={c} className="px-3 py-1.5 font-semibold">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-slate-800/70">
                  {r.map((cell, j) => (
                    <td key={j} className="px-3 py-1.5 tabular-nums">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
