"use client";

// ============================================================================
// AS PEÇAS DE DESENHO DO LIVRO DE FÍSICA — a seta de força (vetor) com o
// nome, o carro com as rodas girando, uma pessoa simples (pra empurrar,
// sentar no ônibus, andar de gangorra) e a lâmpada.
// ============================================================================

/** Uma seta de força (vetor) de (x1, y1) até (x2, y2), com o nome perto da ponta. */
export function Arrow({ x1, y1, x2, y2, color = "#dc2626", label, width = 4 }: { x1: number; y1: number; x2: number; y2: number; color?: string; label?: string; width?: number }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = 10 + width;
  const p1 = `${x2 - Math.cos(a - 0.45) * h} ${y2 - Math.sin(a - 0.45) * h}`;
  const p2 = `${x2 - Math.cos(a + 0.45) * h} ${y2 - Math.sin(a + 0.45) * h}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - Math.cos(a) * h * 0.6} y2={y2 - Math.sin(a) * h * 0.6} stroke={color} strokeWidth={width} strokeLinecap="round" />
      <path d={`M${x2} ${y2} L${p1} L${p2} Z`} fill={color} />
      {label && (
        <text x={x2 + Math.cos(a) * 8} y={y2 + Math.sin(a) * 8 - 6} textAnchor={Math.cos(a) < -0.3 ? "end" : Math.cos(a) > 0.3 ? "start" : "middle"} fontSize="13" fontWeight="900" fill={color} fontFamily="Georgia, serif">
          {label}
        </text>
      )}
    </g>
  );
}

/** Uma roda girando (o raio gira em volta do centro). */
export function Wheel({ x, y, r = 12, dur = 0.6 }: { x: number; y: number; r?: number; dur?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="#1e293b" />
      <circle r={r * 0.55} fill="#94a3b8" />
      <g>
        {dur > 0 && <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur={`${dur}s`} repeatCount="indefinite" />}
        <path d={`M${-r * 0.5} 0 L${r * 0.5} 0 M0 ${-r * 0.5} L0 ${r * 0.5}`} stroke="#334155" strokeWidth="2" />
      </g>
    </g>
  );
}

/** O carrinho visto de lado (a frente pra direita), com o chão em y = 0. */
export function Car({ color = "#dc2626", wheelDur = 0.6 }: { color?: string; wheelDur?: number }) {
  return (
    <g>
      <path d="M-46 -14 L-40 -30 L-16 -32 L-4 -48 L26 -48 L40 -30 L50 -28 Q56 -26 56 -18 L56 -12 L-46 -12 Z" fill={color} stroke="#1e293b" strokeWidth="2" strokeLinejoin="round" />
      <path d="M-10 -32 L0 -44 L14 -44 L14 -32 Z M18 -32 L18 -44 L24 -44 L34 -32 Z" fill="#bae6fd" stroke="#1e293b" strokeWidth="1.5" />
      <circle cx="52" cy="-22" r="3" fill="#fde047" />
      <Wheel x={-26} y={-10} r={11} dur={wheelDur} />
      <Wheel x={34} y={-10} r={11} dur={wheelDur} />
    </g>
  );
}

/** Uma pessoa simples (de pé), com os pés em y = 0. */
export function Person({ color = "#2563eb", skin = "#fcd34d", scale = 1 }: { color?: string; skin?: string; scale?: number }) {
  return (
    <g transform={`scale(${scale})`}>
      <circle cy="-62" r="10" fill={skin} stroke="#92400e" strokeWidth="1.5" />
      <path d="M-12 -50 L12 -50 L10 -22 L-10 -22 Z" fill={color} stroke="#1e293b" strokeWidth="1.5" />
      <path d="M-6 -22 L-8 0 M6 -22 L8 0" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
      <path d="M-12 -46 L-18 -28 M12 -46 L18 -28" stroke={skin} strokeWidth="4.5" strokeLinecap="round" />
    </g>
  );
}

/** A lâmpada, acesa ou apagada (a base em 0, 0). */
export function Bulb({ on = true, x = 0, y = 0, s = 1 }: { on?: boolean; x?: number; y?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {on && <circle cy="-26" r="30" fill="#fde047" opacity="0.4" className="cg-anim-glow" />}
      <circle cy="-26" r="17" fill={on ? "#fef9c3" : "#e5e7eb"} stroke={on ? "#ca8a04" : "#9ca3af"} strokeWidth="2.5" />
      <path d="M-6 -24 Q-3 -32 0 -24 Q3 -32 6 -24" stroke={on ? "#f59e0b" : "#9ca3af"} strokeWidth="2" fill="none" />
      <rect x="-8" y="-10" width="16" height="10" rx="2" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
    </g>
  );
}
