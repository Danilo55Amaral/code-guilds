"use client";

import { useState, type ReactNode } from "react";

// ============================================================================
// AS PEÇAS DO LIVRO DE HISTÓRIA DO BRASIL — as cores do livro, o painel das
// figuras de tocar, os botões, a linha do tempo de tocar (que vários
// capítulos usam), a bandeira do Brasil, a palmeira e a oca.
// ============================================================================

export const HB = "#15803d";
export const HB_DARK = "#14532d";

/** A moldura das figuras de tocar, com o título em cima. */
export function Panel({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      {title && <p className="mb-[0.3em] text-center text-[0.78em] font-bold uppercase tracking-wider text-[#8a7146]">{title}</p>}
      {children}
    </div>
  );
}

/** Um botão pequeno das figuras de tocar (aceso quando `on`). */
export function Pill({ on = false, onClick, children, color = HB }: { on?: boolean; onClick: () => void; children: ReactNode; color?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border px-[0.7em] py-[0.1em] text-[0.82em] font-bold transition-colors"
      style={on ? { background: color, borderColor: color, color: "#fff" } : { background: "#fff", borderColor: "#d9c79d", color: "#3b2a14" }}
    >
      {children}
    </button>
  );
}

/** Um controle deslizante com o rótulo e o valor. */
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
  labelWidth = "5.5em",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  labelWidth?: string;
}) {
  return (
    <label className="flex items-center gap-[0.5em] text-[0.82em] font-bold text-[#3b2a14]">
      <span className="shrink-0" style={{ width: labelWidth }}>
        {label}
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="min-w-0 flex-1 accent-[#15803d]" />
      <span className="w-[3.6em] shrink-0 text-right tabular-nums" style={{ color: HB_DARK }}>
        {format ? format(value) : value.toLocaleString("pt-BR")}
      </span>
    </label>
  );
}

/** A linha do tempo de tocar: os anos numa linha e o texto do ano escolhido embaixo. */
export function TapTimeline({ items, start = 0 }: { items: { year: string; name: string; text: ReactNode; color?: string }[]; start?: number }) {
  const [sel, setSel] = useState(start);
  const e = items[sel];
  const color = e.color ?? HB;
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <div className="relative flex justify-between">
        <div className="absolute left-[5%] right-[5%] top-[0.95em] h-[3px] bg-[#d9c79d]" />
        {items.map((x, i) => (
          <button key={x.year + x.name} type="button" onClick={() => setSel(i)} className="relative flex flex-col items-center" title={x.name}>
            <span
              className={`flex h-[1.9em] w-[1.9em] items-center justify-center rounded-full border-2 text-[0.62em] font-black text-white transition-transform ${sel === i ? "scale-125" : ""}`}
              style={{ background: x.color ?? HB, borderColor: sel === i ? "#1e293b" : "#fff" }}
            >
              {x.year.slice(-2)}
            </span>
            <span className="mt-[0.2em] text-[0.62em] font-bold text-[#5b4a2e]">{x.year}</span>
          </button>
        ))}
      </div>
      <div key={sel} className="cg-anim-fade mt-[0.5em] rounded-lg px-[0.7em] py-[0.4em]" style={{ background: `${color}14`, borderLeft: `5px solid ${color}` }}>
        <p className="cg-book-title font-black" style={{ color }}>
          {e.year} · {e.name}
        </p>
        <p className="text-[0.88em] leading-[1.45] text-[#2b2113]">{e.text}</p>
      </div>
    </div>
  );
}

/** A bandeira do Brasil (o canto em x, y), tremulando. */
export function BrazilFlag({ x, y, w = 90, wave = true }: { x: number; y: number; w?: number; wave?: boolean }) {
  const h = w * 0.7;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-3" y="0" width="4" height={h * 2.2} fill="#78350f" />
      <g>
        {wave && <animateTransform attributeName="transform" type="skewY" values="0;3;0;-3;0" dur="3s" repeatCount="indefinite" />}
        <rect x="1" y="0" width={w} height={h} fill="#16a34a" />
        <path d={`M${1 + w / 2} ${h * 0.08} L${w * 0.94} ${h / 2} L${1 + w / 2} ${h * 0.92} L${w * 0.08} ${h / 2} Z`} fill="#facc15" />
        <circle cx={1 + w / 2} cy={h / 2} r={h * 0.25} fill="#1d4ed8" />
        <path d={`M${1 + w / 2 - h * 0.25} ${h / 2 - 2} Q${1 + w / 2} ${h / 2 - 8} ${1 + w / 2 + h * 0.25} ${h / 2 + 2}`} stroke="#fff" strokeWidth={h * 0.05} fill="none" />
      </g>
    </g>
  );
}

/** Uma palmeira (o pé em x, y), balançando ao vento. */
export function Palm({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 Q-4 -40 4 -80" stroke="#92400e" strokeWidth="7" fill="none" strokeLinecap="round" />
      <g transform="translate(4 -80)">
        <g>
          <animateTransform attributeName="transform" type="rotate" values="-5;5;-5" dur="4s" repeatCount="indefinite" />
          {[-150, -110, -70, -30, 10].map((a) => (
            <path key={a} d="M0 0 Q20 -10 40 6" stroke="#16a34a" strokeWidth="6" fill="none" strokeLinecap="round" transform={`rotate(${a + 60})`} />
          ))}
        </g>
      </g>
    </g>
  );
}

/** Uma oca indígena (o meio do chão em x, y). */
export function Oca({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-46 0 Q-46 -60 0 -64 Q46 -60 46 0 Z" fill="#d6b77a" stroke="#a16207" strokeWidth="2" />
      {[-30, -15, 0, 15, 30].map((dx) => (
        <path key={dx} d={`M${dx} -62 Q${dx * 1.4} -30 ${dx * 1.5} 0`} stroke="#a16207" strokeWidth="1.2" fill="none" />
      ))}
      <path d="M-10 0 Q-10 -20 0 -20 Q10 -20 10 0 Z" fill="#78350f" />
    </g>
  );
}
