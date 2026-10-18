"use client";

import { Emblem, TOME_STYLE, type TomeId } from "./SubjectTome";
import { useUid } from "@/components/books/BookParts";

// ============================================================================
// A CAPA DE UM LIVRO DA BIBLIOTECA VIRTUAL — o livro em pé, de capa dura da
// cor da matéria: a lombada com as faixas douradas, as folhas aparecendo do
// lado, a moldura dourada com as cantoneiras, o medalhão com o emblema da
// matéria, a fitinha marcadora saindo embaixo e um brilho passando pela capa.
// O nome da matéria vai por cima, em HTML (na plaquinha: 22% a 80% da largura,
// 53% a 72% da altura), pra quebrar a linha direitinho.
// ============================================================================

export const COVER_LABEL = { left: "22%", right: "20%", top: "53%", bottom: "28%" };

export default function BookCover({ id, className = "" }: { id: TomeId; className?: string }) {
  const u = useUid("cv");
  const style = TOME_STYLE[id];
  return (
    <svg viewBox="0 0 200 270" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={`${u}-cover`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={style.color} />
          <stop offset="1" stopColor={style.dark} />
        </linearGradient>
        <linearGradient id={`${u}-gold`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fef3c7" />
          <stop offset="0.5" stopColor="#fbbf24" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id={`${u}-shine`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${u}-clip`}>
          <rect x="22" y="12" width="146" height="240" rx="6" />
        </clipPath>
      </defs>
      <ellipse cx="100" cy="262" rx="78" ry="7" fill="#000" opacity="0.45" />
      {/* as folhas aparecendo do lado e embaixo */}
      <path d="M166 18 L182 26 L182 256 L166 250 Z" fill="#f6e7c1" stroke="#a16207" strokeWidth="1" />
      {[44, 84, 124, 164, 204, 236].map((y) => (
        <path key={y} d={`M169 ${y} L180 ${y + 4}`} stroke="#d6b77a" strokeWidth="0.8" />
      ))}
      <path d="M26 250 L166 250 L182 256 L42 258 Z" fill="#ead6a4" stroke="#a16207" strokeWidth="1" />
      {/* a fitinha marcadora */}
      <path d="M140 248 L140 270 L146 264 L152 270 L152 248 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1" />
      {/* a capa */}
      <rect x="22" y="12" width="146" height="240" rx="6" fill={`url(#${u}-cover)`} stroke="#0b0b10" strokeWidth="2" />
      <g clipPath={`url(#${u}-clip)`}>
        {/* textura de couro */}
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M22 ${30 + i * 26} Q95 ${22 + i * 26} 168 ${32 + i * 26}`} stroke="#000" strokeWidth="0.6" opacity="0.12" fill="none" />
        ))}
        {/* o brilho passando */}
        <rect x="-60" y="0" width="50" height="270" fill={`url(#${u}-shine)`} transform="skewX(-18)">
          <animate attributeName="x" values="-80;260;260" keyTimes="0;0.35;1" dur="6s" repeatCount="indefinite" />
        </rect>
      </g>
      {/* a lombada com as faixas douradas */}
      <rect x="22" y="12" width="16" height="240" rx="5" fill={style.dark} opacity="0.85" />
      {[34, 54, 210, 230].map((y) => (
        <rect key={y} x="22" y={y} width="16" height="4" fill={`url(#${u}-gold)`} />
      ))}
      {/* a moldura e as cantoneiras */}
      <rect x="46" y="24" width="110" height="216" rx="5" fill="none" stroke={`url(#${u}-gold)`} strokeWidth="1.6" />
      <rect x="51" y="29" width="100" height="206" rx="4" fill="none" stroke={`url(#${u}-gold)`} strokeWidth="0.6" opacity="0.7" />
      {[
        [168, 12, -1, 1],
        [168, 252, -1, -1],
        [38, 12, 1, 1],
        [38, 252, 1, -1],
      ].map(([x, y, sx, sy]) => (
        <path key={`${x}-${y}`} d={`M${x} ${y} L${x + sx * 20} ${y} Q${x + sx * 8} ${y + sy * 8} ${x} ${y + sy * 20} Z`} fill={`url(#${u}-gold)`} stroke="#78350f" strokeWidth="0.8" />
      ))}
      {/* o medalhão com o emblema */}
      <circle cx="101" cy="86" r="38" fill={style.glow} opacity="0.2" className="cg-anim-glow" />
      <circle cx="101" cy="86" r="31" fill="#0b0b10" opacity="0.55" stroke={`url(#${u}-gold)`} strokeWidth="3" />
      <g transform="translate(101 86) scale(1.3)">
        <Emblem id={id} />
      </g>
      {/* a plaquinha do nome */}
      <rect x="50" y="140" width="102" height="58" rx="6" fill="#000" opacity="0.32" stroke={`url(#${u}-gold)`} strokeWidth="0.9" />
      {/* as estrelinhas embaixo */}
      {[84, 101, 118].map((x, i) => (
        <path key={x} d={`M${x} 212 l2 5 l5 1 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -1 Z`} fill="#fde68a" className="cg-anim-twinkle" style={{ animationDelay: `${i * 0.5}s` }} />
      ))}
    </svg>
  );
}
