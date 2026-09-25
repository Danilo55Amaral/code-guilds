"use client";

import { useId } from "react";

// ============================================================================
// MAGO DANILO — o guia do tutorial, em SVG puro (como o Ceifador da derrota).
// Chapéu pontudo com lua e estrela, óculos redondos de programador, barba
// longa, túnica estrelada e cajado com orbe mágico. Animações (globals.css):
// pisca os olhos, acena, o orbe pulsa, as estrelas da túnica cintilam, a boca
// mexe enquanto ele fala (`mouthOpen`) e o cajado solta um clarão a cada
// passo (`burstKey` muda → o clarão recomeça).
// ============================================================================

function Star({ x, y, r, fill, delay = 0 }: { x: number; y: number; r: number; fill: string; delay?: number }) {
  return (
    <path
      className="cg-anim-twinkle"
      style={{ animationDelay: `${delay}s` }}
      d={`M${x} ${y - r * 2} L${x + r * 0.55} ${y - r * 0.55} L${x + r * 2} ${y} L${x + r * 0.55} ${y + r * 0.55} L${x} ${y + r * 2} L${x - r * 0.55} ${y + r * 0.55} L${x - r * 2} ${y} L${x - r * 0.55} ${y - r * 0.55} Z`}
      fill={fill}
    />
  );
}

export default function WizardDanilo({ mouthOpen, burstKey, className = "" }: { mouthOpen: boolean; burstKey: number; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const ids = { robe: `wr${uid}`, hat: `wh${uid}`, orb: `wo${uid}`, glow: `wg${uid}` };
  const skin = "#f5c9a0";

  return (
    <svg viewBox="0 0 220 290" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={ids.robe} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#3b0764" />
        </linearGradient>
        <linearGradient id={ids.hat} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#4c1d95" />
        </linearGradient>
        <radialGradient id={ids.orb} cx="40%" cy="35%" r="65%">
          <stop offset="0" stopColor="#f0f9ff" />
          <stop offset="0.45" stopColor="#67e8f9" />
          <stop offset="1" stopColor="#7c3aed" />
        </radialGradient>
        <radialGradient id={ids.glow}>
          <stop offset="0" stopColor="#a5f3fc" stopOpacity="0.9" />
          <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ---- cajado (atrás da mão) ---- */}
      <line x1="176" y1="46" x2="187" y2="276" stroke="#7c4a1e" strokeWidth="6.5" strokeLinecap="round" />
      <line x1="175" y1="50" x2="185" y2="272" stroke="#a16207" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <circle cx="176" cy="34" r="24" fill={`url(#${ids.glow})`} className="cg-anim-orb" />
      <path d="M165 46 C166 38 170 33 176 31 M187 46 C186 38 182 33 176 31" stroke="#7c4a1e" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="176" cy="34" r="11" fill={`url(#${ids.orb})`} stroke="#c4b5fd" strokeWidth="1" />
      <circle cx="172" cy="30" r="3" fill="#fff" opacity="0.8" />
      <circle key={burstKey} cx="176" cy="34" r="12" fill="none" stroke="#fde68a" strokeWidth="3" className="cg-anim-burst" />
      <Star x={158} y={16} r={2.2} fill="#fde68a" delay={0.3} />
      <Star x={196} y={22} r={1.8} fill="#a5f3fc" delay={1.1} />
      <Star x={192} y={56} r={1.5} fill="#fde68a" delay={0.7} />

      {/* ---- túnica ---- */}
      <path d="M84 128 C70 152 58 210 42 272 L180 272 C164 210 152 152 136 128 Z" fill={`url(#${ids.robe})`} />
      <path d="M42 272 L180 272 L177 261 C140 268 82 268 45 261 Z" fill="#fbbf24" />
      <path d="M110 150 L110 262" stroke="#fbbf24" strokeWidth="2.5" opacity="0.8" />
      <path d="M75 172 C95 179 125 179 145 172 L147 182 C125 189 95 189 73 182 Z" fill="#fbbf24" />
      <circle cx="110" cy="180" r="5.5" fill="#a16207" stroke="#fde68a" strokeWidth="1.5" />
      <Star x={70} y={228} r={2.4} fill="#fde68a" delay={0} />
      <Star x={150} y={220} r={2.2} fill="#fde68a" delay={0.8} />
      <Star x={92} y={250} r={1.8} fill="#fef3c7" delay={1.5} />
      <Star x={132} y={246} r={2} fill="#fef3c7" delay={0.4} />
      <Star x={64} y={196} r={1.6} fill="#fde68a" delay={1.9} />
      <path d="M140 205 A7 7 0 1 0 148 214 A5.5 5.5 0 1 1 140 205 Z" fill="#fde68a" opacity="0.9" />

      {/* ---- braço direito segurando o cajado ---- */}
      <path d="M134 131 C150 137 163 145 173 151 L166 163 C154 157 142 151 128 146 Z" fill={`url(#${ids.robe})`} />
      <path d="M170 148 L165 163" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
      <circle cx="176" cy="156" r="7.5" fill={skin} />
      <path d="M170 152 C174 150 180 151 182 154" stroke="#e0a47a" strokeWidth="1.3" fill="none" />

      {/* ---- cabeça ---- */}
      <path d="M85 86 C76 97 78 114 89 120 L92 100 Z" fill="#e2e8f0" />
      <path d="M135 86 C144 97 142 114 131 120 L128 100 Z" fill="#e2e8f0" />
      <ellipse cx="85" cy="101" rx="4.5" ry="7" fill={skin} />
      <ellipse cx="135" cy="101" rx="4.5" ry="7" fill={skin} />
      <circle cx="110" cy="99" r="25" fill={skin} />
      <circle cx="96" cy="109" r="4.5" fill="#fb7185" opacity="0.35" />
      <circle cx="124" cy="109" r="4.5" fill="#fb7185" opacity="0.35" />
      <path d="M91 87 Q99 81 106 87" stroke="#f8fafc" strokeWidth="3.6" fill="none" strokeLinecap="round" />
      <path d="M114 87 Q121 81 129 87" stroke="#f8fafc" strokeWidth="3.6" fill="none" strokeLinecap="round" />
      <g className="cg-anim-blink">
        <ellipse cx="100" cy="96" rx="4.4" ry="5" fill="#fff" />
        <ellipse cx="120" cy="96" rx="4.4" ry="5" fill="#fff" />
        <circle cx="100.6" cy="96.8" r="2.5" fill="#1e1b4b" />
        <circle cx="120.6" cy="96.8" r="2.5" fill="#1e1b4b" />
        <circle cx="101.4" cy="95.6" r="0.9" fill="#fff" />
        <circle cx="121.4" cy="95.6" r="0.9" fill="#fff" />
      </g>
      {/* óculos redondos de programador */}
      <g stroke="#fbbf24" strokeWidth="1.8" fill="rgba(255,255,255,0.08)">
        <circle cx="100" cy="96" r="8" />
        <circle cx="120" cy="96" r="8" />
        <path d="M108 95 Q110 93 112 95 M92 95 L86 93 M128 95 L134 93" fill="none" />
      </g>
      <ellipse cx="110" cy="106" rx="4.6" ry="3.6" fill="#e0a47a" />

      {/* ---- barba, boca e bigode ---- */}
      <path d="M86 104 C83 132 92 162 110 190 C128 162 137 132 134 104 C128 117 120 121 110 121 C100 121 92 117 86 104 Z" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
      <path d="M100 132 C101 150 104 164 108 176 M120 132 C119 150 116 164 112 176 M110 128 L110 182" stroke="#cbd5e1" strokeWidth="1.2" fill="none" />
      {mouthOpen ? (
        <ellipse cx="110" cy="123" rx="5.5" ry="4.2" fill="#4c0519" />
      ) : (
        <path d="M105 122.5 Q110 125 115 122.5" stroke="#4c0519" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      )}
      <path d="M91 116 C97 109 105 111 110 116 C115 111 123 109 129 116 C122 121 115 121 110 118.5 C105 121 98 121 91 116 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.8" />

      {/* ---- chapéu ---- */}
      <ellipse cx="110" cy="78" rx="47" ry="10" fill="#3b0764" />
      <path d="M76 76 C84 56 92 36 104 20 C114 8 134 0 153 6 C141 10 133 18 129 30 C135 46 141 62 147 76 Z" fill={`url(#${ids.hat})`} />
      <path d="M78 69 C98 64 122 64 145 69 L147 77 C122 72 98 72 76 77 Z" fill="#fbbf24" />
      <path d="M100 38 A9 9 0 1 0 111 55 A7 7 0 1 1 100 38 Z" fill="#fde68a" />
      <Star x={124} y={46} r={2} fill="#fef3c7" delay={0.6} />
      <Star x={92} y={62} r={1.6} fill="#fef3c7" delay={1.3} />
      <Star x={153} y={6} r={3.2} fill="#fde047" delay={0} />

      {/* ---- braço esquerdo acenando (gira no ombro) ---- */}
      <g className="cg-anim-wave" style={{ transformOrigin: "88px 136px" }}>
        <path d="M88 132 C72 128 60 118 52 104 L63 96 C69 108 79 116 94 121 Z" fill={`url(#${ids.robe})`} />
        <path d="M52 104 L63 96" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
        <circle cx="55" cy="95" r="7.5" fill={skin} />
        <ellipse cx="61" cy="92" rx="2.6" ry="4" fill={skin} transform="rotate(35 61 92)" />
      </g>
    </svg>
  );
}
