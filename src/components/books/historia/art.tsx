"use client";

// ============================================================================
// AS PEÇAS DE DESENHO DO LIVRO DE HISTÓRIA GERAL — a pirâmide, a coluna
// grega, a pessoa de túnica, a caravela, o pergaminho e o Sol do deserto,
// que vários capítulos usam.
// ============================================================================

/** Uma pirâmide (o meio da base em x, y), com a luz do Sol num dos lados. */
export function Pyramid({ x, y, w = 120, color = "#e7c873" }: { x: number; y: number; w?: number; color?: string }) {
  const h = w * 0.62;
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M${-w / 2} 0 L0 ${-h} L${w / 2} 0 Z`} fill={color} stroke="#a16207" strokeWidth="1.5" />
      <path d={`M0 ${-h} L${w / 2} 0 L${w * 0.12} 0 Z`} fill="#b45309" opacity="0.35" />
      {Array.from({ length: 5 }, (_, i) => {
        const yy = -h * (i + 1) / 6;
        const half = (w / 2) * (1 - (i + 1) / 6);
        return <line key={i} x1={-half} y1={yy} x2={half} y2={yy} stroke="#a16207" strokeWidth="0.8" opacity="0.6" />;
      })}
    </g>
  );
}

/** Uma coluna grega (o pé em x, y). */
export function Column({ x, y, h = 120, w = 22 }: { x: number; y: number; h?: number; w?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2 - 5} y={-8} width={w + 10} height="8" fill="#e7e5e4" stroke="#78716c" />
      <rect x={-w / 2} y={-h + 10} width={w} height={h - 18} fill="#f5f5f4" stroke="#78716c" />
      {[-w / 4, 0, w / 4].map((dx) => (
        <line key={dx} x1={dx} y1={-h + 12} x2={dx} y2={-10} stroke="#d6d3d1" strokeWidth="2" />
      ))}
      <rect x={-w / 2 - 6} y={-h} width={w + 12} height="10" rx="3" fill="#e7e5e4" stroke="#78716c" />
    </g>
  );
}

/** Uma pessoa de túnica (o pé em x, y), da Antiguidade; `crown` põe a coroa de louros. */
export function Robed({
  x,
  y,
  s = 1,
  robe = "#f8fafc",
  sash = "#b91c1c",
  skin = "#d6a77a",
  hair = "#3f2a14",
  crown = false,
}: {
  x: number;
  y: number;
  s?: number;
  robe?: string;
  sash?: string;
  skin?: string;
  hair?: string;
  crown?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-14 -46 L14 -46 L18 0 L-18 0 Z" fill={robe} stroke="#94a3b8" strokeWidth="1.2" />
      <path d="M-12 -44 L12 -20" stroke={sash} strokeWidth="5" />
      <path d="M-14 -40 L-22 -18 M14 -40 L22 -18" stroke={skin} strokeWidth="5" strokeLinecap="round" />
      <circle cy="-56" r="11" fill={skin} />
      <path d="M-11 -58 Q-10 -70 0 -69 Q10 -70 11 -58 Q6 -64 0 -63 Q-6 -64 -11 -58 Z" fill={hair} />
      {crown && <path d="M-12 -63 Q-6 -70 0 -66 Q6 -70 12 -63" stroke="#16a34a" strokeWidth="3.5" fill="none" strokeLinecap="round" />}
      <circle cx="-4" cy="-56" r="1.4" fill="#1e293b" />
      <circle cx="4" cy="-56" r="1.4" fill="#1e293b" />
    </g>
  );
}

/** Uma caravela (o meio do casco em x, y), balançando nas ondas. */
export function Caravel({ x, y, s = 1, cross = "#dc2626" }: { x: number; y: number; s?: number; cross?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g>
        <animateTransform attributeName="transform" type="rotate" values="-4;4;-4" dur="3s" repeatCount="indefinite" />
        <path d="M-60 0 L60 0 L46 22 L-46 22 Z" fill="#92400e" stroke="#78350f" strokeWidth="2" />
        <path d="M-60 0 L-70 -12 L-56 0 Z" fill="#92400e" />
        <path d="M0 0 L0 -86 M-34 0 L-34 -60" stroke="#78350f" strokeWidth="4" />
        <path d="M4 -80 Q44 -50 4 -18 Z" fill="#fef3c7" stroke="#d6b77a" />
        <path d="M-30 -56 Q-4 -38 -30 -16 Z" fill="#fef3c7" stroke="#d6b77a" />
        <path d="M10 -58 L26 -58 M18 -66 L18 -48" stroke={cross} strokeWidth="5" />
      </g>
    </g>
  );
}

/** Um pergaminho aberto (o canto em x, y) com linhas de texto. */
export function Scroll({ x, y, w = 140, h = 90, title }: { x: number; y: number; w?: number; h?: number; title?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="6" width={w} height={h - 12} fill="#fef3c7" stroke="#a16207" strokeWidth="1.5" />
      <rect x="-6" y="0" width={w + 12} height="12" rx="6" fill="#d97706" />
      <rect x="-6" y={h - 12} width={w + 12} height="12" rx="6" fill="#d97706" />
      {title && (
        <text x={w / 2} y="30" textAnchor="middle" fontSize="12" fontWeight="900" fill="#78350f" fontFamily="Georgia, serif">
          {title}
        </text>
      )}
      {Array.from({ length: 3 }, (_, i) => (
        <line key={i} x1="12" y1={(title ? 44 : 28) + i * 12} x2={w - 12 - (i % 2) * 20} y2={(title ? 44 : 28) + i * 12} stroke="#c8a96a" strokeWidth="3" />
      ))}
    </g>
  );
}

/** O Sol forte do deserto (o centro em x, y). */
export function DesertSun({ x, y, r = 26 }: { x: number; y: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r * 1.6} fill="#fde047" opacity="0.25">
        <animate attributeName="r" values={`${r * 1.4};${r * 1.8};${r * 1.4}`} dur="3s" repeatCount="indefinite" />
      </circle>
      <circle r={r} fill="#facc15" />
    </g>
  );
}
