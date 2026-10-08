"use client";

import { AvatarConfig } from "@/engine/avatar";
import { wornAvatar } from "@/engine/students";
import { getEvent, getPhase } from "@/engine/specialEvents";
import Avatar from "../Avatar";
import WizardDanilo from "../WizardDanilo";
import { Castle, Confetti, Rays, RewardShowcase, Stage, Stars } from "./common";
import type { EventArtProps } from "./registry";

// ============================================================================
// ARTE DO EVENTO DE NATAL — "O Resgate do Papai Noel", em 3 fases:
// 1) o sequestro no pátio enfeitado da CodeGuilds (trenó, presentes congelados,
//    a renazinha Cometa); 2) a jornada ao Polo Norte (aurora boreal, oficina
//    dos elfos, Estrelas da Aurora); 3) a Fortaleza de Gelo (o Papai Noel preso
//    no cristal, os Bonecos de Neve Bugados, os Selos de Gelo) e o final.
// O vilão é o Lorde Glacius, o Senhor do Inverno Eterno. Mesmo esquema dos
// outros eventos: cada cena ocupa o pai inteiro.
// ============================================================================

const SKIES = {
  noite: "radial-gradient(50% 45% at 78% 18%, rgba(191,219,254,0.28), transparent 70%), linear-gradient(180deg, #020617 0%, #0f1f4a 55%, #1e3a5f 100%)",
  nevasca: "radial-gradient(60% 50% at 50% 30%, rgba(125,211,252,0.4), transparent 70%), linear-gradient(180deg, #0c1a33 0%, #1e3a5f 50%, #475569 100%)",
  polo: "linear-gradient(180deg, #020617 0%, #0b1d3a 50%, #134e4a 100%)",
  gelo: "radial-gradient(60% 55% at 50% 40%, rgba(56,189,248,0.4), transparent 70%), linear-gradient(180deg, #082f49 0%, #0c4a6e 50%, #0f172a 100%)",
  oficina: "radial-gradient(50% 50% at 50% 35%, rgba(147,197,253,0.25), transparent 70%), linear-gradient(180deg, #1e293b 0%, #292524 100%)",
  oficinaQuente: "radial-gradient(55% 55% at 50% 38%, rgba(251,191,36,0.4), transparent 70%), linear-gradient(180deg, #431407 0%, #292524 100%)",
  festa: "radial-gradient(55% 50% at 50% 40%, rgba(253,230,138,0.6), transparent 70%), linear-gradient(180deg, #0f1f4a 0%, #7f1d1d 58%, #14532d 100%)",
} as const;

function Sky({ variant, stars = true }: { variant: keyof typeof SKIES; stars?: boolean }) {
  return (
    <div className="absolute inset-0" style={{ background: SKIES[variant] }}>
      {stars && <Stars />}
    </div>
  );
}

// Flocos: [esquerda %, tamanho px, atraso (negativo = já está nevando), duração, deriva].
const FLAKES = Array.from({ length: 46 }, (_, i) => ({
  left: (i * 41 + 7) % 100,
  size: 3 + (i % 4) * 1.6,
  delay: -((i * 0.73) % 9),
  duration: 7 + (i % 5) * 1.3,
  drift: ((i % 7) - 3) * 18,
}));

/** Neve caindo. `blizzard` = nevasca (rápida e de lado). */
function Snowfall({ blizzard = false }: { blizzard?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {FLAKES.map((f, i) => (
        <span
          key={i}
          className="cg-anim-snow absolute top-0 rounded-full bg-white"
          style={
            {
              left: `${blizzard ? f.left - 30 : f.left}%`,
              width: f.size,
              height: f.size,
              "--cg-delay": `${blizzard ? f.delay * 0.4 : f.delay}s`,
              "--cg-duration": `${blizzard ? f.duration * 0.35 : f.duration}s`,
              "--cg-drift": `${blizzard ? 260 + f.drift * 3 : f.drift}px`,
              "--cg-fall": "110vh",
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** Chão de neve ondulado, colado embaixo. */
function SnowGround({ className = "h-[22%]", tint = "#e0f2fe" }: { className?: string; tint?: string }) {
  return (
    <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className={`absolute bottom-0 left-0 w-full ${className}`} aria-hidden="true">
      <path d="M0 60 C150 20 300 80 460 50 C620 20 760 70 920 40 C1040 20 1120 50 1200 36 L1200 200 L0 200 Z" fill={tint} />
      <path d="M0 90 C180 60 340 110 520 84 C700 58 860 104 1040 78 C1110 68 1160 76 1200 72 L1200 200 L0 200 Z" fill="#bae6fd" opacity="0.5" />
    </svg>
  );
}

/** Lua cheia branquinha. */
function Moon({ className = "right-[10%] top-[8%] w-[12%]" }: { className?: string }) {
  return (
    <div
      className={`cg-anim-moon-rise absolute aspect-square min-w-[60px] max-w-[170px] rounded-full ${className}`}
      style={{ background: "radial-gradient(circle at 38% 35%, #ffffff 0%, #e0f2fe 55%, #93c5fd 100%)", boxShadow: "0 0 70px 18px rgba(224,242,254,0.35)" }}
    />
  );
}

/** Castelo da CodeGuilds enfeitado de Natal: neve nas torres, estrela no alto e cordão de luzinhas. */
function ChristmasCastle({ className = "h-[46%]", scale = 0.64, lights = true }: { className?: string; scale?: number; lights?: boolean }) {
  return (
    <Castle wide className={className} scale={scale} windowColor="#fde68a" fill="#0b1026">
      <g fill="#f8fafc">
        <polygon points="253,172 275,140 297,172 285,166 275,172 264,166" />
        <polygon points="416,90 445,50 474,90 460,82 445,90 430,82" />
        <polygon points="568,40 600,-12 632,40 616,32 600,40 584,32" />
        <polygon points="723,82 755,40 787,82 771,74 755,82 739,74" />
        <polygon points="903,182 925,150 947,182 935,176 925,182 914,176" />
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={i} x={469 + i * 30} y="152" width="20" height="5" rx="2.5" />
        ))}
      </g>
      <path d="M600 -40 L606 -24 L623 -24 L609 -14 L615 3 L600 -7 L585 3 L591 -14 L577 -24 L594 -24 Z" fill="#fde047" className="cg-anim-eye" style={{ filter: "drop-shadow(0 0 10px #fde047)" }} />
      {lights &&
        Array.from({ length: 18 }, (_, i) => (
          <circle
            key={i}
            cx={476 + i * 14.5}
            cy={178 + (i % 2) * 5}
            r="3.4"
            fill={["#ef4444", "#22c55e", "#fbbf24", "#38bdf8"][i % 4]}
            className="cg-anim-eye"
            style={{ animationDelay: `${(i % 4) * 0.4}s`, filter: `drop-shadow(0 0 5px ${["#ef4444", "#22c55e", "#fbbf24", "#38bdf8"][i % 4]})` }}
          />
        ))}
    </Castle>
  );
}

/** Pinheiro de Natal com bolinhas piscando e estrela no topo. */
function ChristmasTree({ className = "", lit = true }: { className?: string; lit?: boolean }) {
  const balls: [number, number, string][] = [
    [50, 46, "#ef4444"],
    [72, 58, "#fbbf24"],
    [40, 72, "#38bdf8"],
    [66, 86, "#ef4444"],
    [30, 98, "#fbbf24"],
    [80, 104, "#a855f7"],
    [52, 112, "#22c55e"],
    [20, 122, "#ef4444"],
    [92, 124, "#38bdf8"],
  ];
  return (
    <svg viewBox="0 0 120 170" className={`overflow-visible ${className}`} aria-hidden="true">
      <rect x="52" y="140" width="16" height="24" fill="#78350f" />
      <polygon points="60,18 98,70 22,70" fill="#166534" />
      <polygon points="60,40 108,104 12,104" fill="#15803d" />
      <polygon points="60,68 118,144 2,144" fill="#166534" />
      <path d="M22 70 C50 82 76 66 98 70 M12 104 C46 118 80 96 108 104 M2 144 C40 156 86 132 118 144" stroke="#f8fafc" strokeWidth="4" fill="none" opacity="0.85" strokeLinecap="round" />
      <path d="M34 60 C52 66 70 56 86 58 M24 92 C48 100 76 86 98 90 M14 128 C44 138 84 118 108 126" stroke="#fbbf24" strokeWidth="1.5" fill="none" opacity="0.8" />
      {balls.map(([x, y, c], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill={c} className={lit ? "cg-anim-eye" : ""} style={{ animationDelay: `${i * 0.3}s`, filter: lit ? `drop-shadow(0 0 4px ${c})` : undefined }} />
      ))}
      <path d="M60 2 L64.5 12 L75 12.5 L67 19 L69.5 29.5 L60 24 L50.5 29.5 L53 19 L45 12.5 L55.5 12 Z" fill="#fde047" style={{ filter: "drop-shadow(0 0 8px #fde047)" }} className={lit ? "cg-anim-eye" : ""} />
    </svg>
  );
}

/** Pinheiros escuros de fundo (floresta). */
function PineForest({ className = "h-[30%]", fill = "#0b2b26" }: { className?: string; fill?: string }) {
  return (
    // viewBox bem largo: em tela larga o "slice" só corta as laterais, nunca a ponta dos pinheiros.
    <svg viewBox="-1500 -30 4200 250" preserveAspectRatio="xMidYMax slice" className={`absolute bottom-0 left-0 w-full ${className}`} aria-hidden="true">
      {Array.from({ length: 76 }, (_, i) => {
        const x = -1500 + i * 57 + (i % 3) * 9;
        const h = 90 + ((i * 37) % 70);
        return (
          <g key={i} fill={fill}>
            <polygon points={`${x},${220 - h} ${x + 34},${220} ${x - 34},${220}`} />
            <polygon points={`${x},${220 - h - 18} ${x + 22},${220 - h + 36} ${x - 22},${220 - h + 36}`} />
            <polygon points={`${x - 10},${220 - h - 4} ${x},${220 - h - 20} ${x + 10},${220 - h - 4}`} fill="#f8fafc" opacity="0.8" />
          </g>
        );
      })}
    </svg>
  );
}

/** Montanhas nevadas ao fundo. */
function Mountains({ className = "h-[48%]" }: { className?: string }) {
  return (
    // A cordilheira se repete pros lados num viewBox bem largo e com folga em cima:
    // em tela larga o "slice" só corta as laterais, nunca os picos nevados.
    <svg viewBox="-1500 -10 4200 310" preserveAspectRatio="xMidYMax slice" className={`absolute bottom-0 left-0 w-full ${className}`} aria-hidden="true">
      {[-1200, 0, 1200, 2400].map((dx) => (
        <g key={dx} transform={`translate(${dx} 0)`}>
          <path d="M-2 300 L-2 200 L140 80 L260 170 L400 40 L560 180 L700 70 L860 190 L1000 60 L1202 200 L1202 300 Z" fill="#1e3a5f" />
          <path d="M140 80 L180 112 L160 110 L140 128 L118 104 Z M400 40 L446 84 L420 80 L398 100 L372 70 Z M700 70 L742 108 L716 104 L698 122 L672 96 Z M1000 60 L1044 100 L1018 96 L998 116 L974 88 Z" fill="#f8fafc" />
          <path d="M-2 300 L-2 245 L200 170 L380 250 L560 190 L760 250 L940 180 L1202 245 L1202 300 Z" fill="#0f2744" />
        </g>
      ))}
    </svg>
  );
}

/** Aurora boreal: faixas de luz ondulando no céu. `faint` = fraca, piscando (o feitiço está apagando). */
function Aurora({ faint = false, className = "inset-x-0 top-0 h-[60%]" }: { faint?: boolean; className?: string }) {
  const bands: [string, string, number][] = [
    ["#4ade80", "4%", 0],
    ["#22d3ee", "18%", 1.8],
    ["#f472b6", "32%", 3.4],
  ];
  return (
    <div className={`pointer-events-none absolute ${className} ${faint ? "cg-anim-eye opacity-40" : ""}`} aria-hidden="true">
      {bands.map(([color, top, delay]) => (
        <div
          key={color}
          className="cg-anim-aurora absolute -left-[15%] h-[34%] w-[130%] rounded-[50%]"
          style={{
            top,
            background: `linear-gradient(90deg, transparent 0%, ${color}55 18%, ${color}cc 45%, ${color}88 70%, transparent 100%)`,
            filter: "blur(16px)",
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Personagens e objetos
// ---------------------------------------------------------------------------

type GlaciusMood = "mau" | "triste" | "feliz";

/** O vilão: Lorde Glacius, coroa de pingentes de gelo, barba de gelo, olhos azuis brilhando, capa e cetro de floco de neve. */
export function LordGlacius({ talking = false, mood = "mau", className = "" }: { talking?: boolean; mood?: GlaciusMood; className?: string }) {
  return (
    <svg viewBox="0 0 240 300" className={`overflow-visible ${className}`} aria-hidden="true">
      {/* capa */}
      <path d="M18 300 C28 196 60 150 120 140 C180 150 212 196 222 300 Z" fill="#1e3a8a" />
      <path d="M18 300 C28 196 60 150 120 140 C180 150 212 196 222 300" stroke="#7dd3fc" strokeWidth="3" fill="none" />
      <path d="M76 300 C78 220 96 178 120 170 C144 178 162 220 164 300 Z" fill="#0c4a6e" />
      {/* floco de neve no peito */}
      <g stroke="#bae6fd" strokeWidth="3" strokeLinecap="round">
        {[0, 60, 120].map((a) => (
          <line key={a} x1="120" y1="200" x2="120" y2="240" transform={`rotate(${a} 120 220)`} />
        ))}
      </g>
      <circle cx="120" cy="220" r="5" fill="#e0f2fe" />
      {/* gola alta de gelo */}
      <path d="M62 178 L48 132 L84 158 L96 122 L120 150 L144 122 L156 158 L192 132 L178 178 C150 166 90 166 62 178 Z" fill="#bae6fd" stroke="#0ea5e9" strokeWidth="2" strokeLinejoin="round" />
      {/* braço erguido com magia de gelo */}
      <path d="M70 188 C54 176 42 160 36 144" stroke="#1e3a8a" strokeWidth="16" fill="none" strokeLinecap="round" />
      <circle cx="35" cy="140" r="8" fill="#dbeafe" />
      <circle cx="34" cy="120" r="16" fill="#7dd3fc" opacity="0.35" className="cg-anim-orb" />
      {[
        [20, 108],
        [48, 104],
        [30, 92],
      ].map(([x, y], i) => (
        <path key={i} d={`M${x - 5} ${y} L${x + 5} ${y} M${x} ${y - 5} L${x} ${y + 5} M${x - 3.5} ${y - 3.5} L${x + 3.5} ${y + 3.5} M${x + 3.5} ${y - 3.5} L${x - 3.5} ${y + 3.5}`} stroke="#e0f2fe" strokeWidth="1.6" strokeLinecap="round" className="cg-anim-twinkle" style={{ animationDelay: `${i * 0.4}s` }} />
      ))}
      {/* cetro com cristal de floco de neve */}
      <line x1="206" y1="130" x2="214" y2="296" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
      <circle cx="204" cy="112" r="26" fill="#38bdf8" opacity="0.3" className="cg-anim-orb" />
      <g stroke="#e0f2fe" strokeWidth="3.5" strokeLinecap="round">
        {[0, 60, 120].map((a) => (
          <line key={a} x1="204" y1="94" x2="204" y2="130" transform={`rotate(${a} 204 112)`} />
        ))}
      </g>
      <circle cx="204" cy="112" r="6" fill="#f0f9ff" stroke="#38bdf8" strokeWidth="2" />
      <path d="M190 140 L218 140" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      {/* cabelo comprido branco-azulado */}
      <path d="M78 74 C70 110 68 150 74 178 L92 168 C86 140 86 110 90 86 Z M162 74 C170 110 172 150 166 178 L148 168 C154 140 154 110 150 86 Z" fill="#e0f2fe" />
      {/* rosto */}
      <ellipse cx="120" cy="100" rx="38" ry="44" fill="#dbeafe" />
      <path d="M86 108 C92 122 104 128 120 128 C136 128 148 122 154 108" fill="#bfdbfe" opacity="0.7" />
      {/* coroa de pingentes */}
      <g className={mood === "triste" ? "" : "cg-anim-float"}>
        <path
          d="M80 64 L84 20 L97 50 L107 4 L120 44 L133 4 L143 50 L156 20 L160 64 C140 58 100 58 80 64 Z"
          fill="#e0f2fe"
          stroke="#7dd3fc"
          strokeWidth="2"
          strokeLinejoin="round"
          transform={mood === "triste" ? "rotate(-14 120 50) translate(-6 6)" : undefined}
        />
        <circle cx="120" cy="52" r="5" fill="#22d3ee" transform={mood === "triste" ? "rotate(-14 120 50) translate(-6 6)" : undefined} />
      </g>
      {/* sobrancelhas */}
      {mood === "mau" && <path d="M94 84 L112 92 M146 84 L128 92" stroke="#1e3a8a" strokeWidth="4" strokeLinecap="round" />}
      {mood === "triste" && <path d="M96 90 L112 84 M144 90 L128 84" stroke="#1e3a8a" strokeWidth="3.5" strokeLinecap="round" />}
      {mood === "feliz" && <path d="M96 84 Q104 78 112 84 M128 84 Q136 78 144 84" stroke="#1e3a8a" strokeWidth="3" fill="none" strokeLinecap="round" />}
      {/* olhos */}
      {mood === "feliz" ? (
        <path d="M98 98 Q104 92 110 98 M130 98 Q136 92 142 98" stroke="#0c4a6e" strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : (
        <>
          <ellipse cx="104" cy="99" rx="8" ry="5.5" fill="#22d3ee" className="cg-anim-eye" style={{ filter: "drop-shadow(0 0 6px #22d3ee)" }} />
          <ellipse cx="136" cy="99" rx="8" ry="5.5" fill="#22d3ee" className="cg-anim-eye" style={{ filter: "drop-shadow(0 0 6px #22d3ee)" }} />
          <circle cx="104" cy="99" r="2.4" fill="#0c4a6e" />
          <circle cx="136" cy="99" r="2.4" fill="#0c4a6e" />
        </>
      )}
      {mood === "triste" && (
        <>
          <path d="M100 108 C98 114 98 118 101 120 C104 118 104 114 100 108 Z" fill="#7dd3fc" />
          <path d="M140 110 C138 116 138 120 141 122 C144 120 144 116 140 110 Z" fill="#7dd3fc" />
        </>
      )}
      {mood === "feliz" && (
        <>
          <ellipse cx="96" cy="112" rx="7" ry="4" fill="#fb7185" opacity="0.45" />
          <ellipse cx="144" cy="112" rx="7" ry="4" fill="#fb7185" opacity="0.45" />
        </>
      )}
      {/* barba de gelo */}
      <path d="M90 122 L95 160 L103 134 L110 174 L117 138 L123 178 L129 138 L137 168 L142 132 L148 154 L150 120 Q120 138 90 122 Z" fill="#f0f9ff" stroke="#93c5fd" strokeWidth="1.5" strokeLinejoin="round" />
      {/* boca */}
      {talking ? (
        <ellipse cx="120" cy="120" rx="8" ry="5.5" fill="#1e3a8a" />
      ) : mood === "feliz" ? (
        <path d="M106 116 Q120 128 134 116" stroke="#1e3a8a" strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : mood === "triste" ? (
        <path d="M108 122 Q120 114 132 122" stroke="#1e3a8a" strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M106 118 Q118 114 134 120" stroke="#1e3a8a" strokeWidth="3" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}

/** O Papai Noel: casaco vermelho, barba enorme, gorro com pompom e o saco de presentes. `frozen` = olhos fechados (preso no gelo). */
function SantaClaus({ talking = false, frozen = false, className = "" }: { talking?: boolean; frozen?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 200 250" className={`overflow-visible ${className}`} aria-hidden="true">
      {/* saco de presentes */}
      <path d="M140 150 C176 140 196 180 190 222 C186 244 150 248 136 232 C124 216 124 170 140 150 Z" fill="#92400e" />
      <path d="M136 156 C146 146 160 144 170 150" stroke="#fbbf24" strokeWidth="4" fill="none" strokeLinecap="round" />
      <rect x="150" y="128" width="16" height="16" rx="2" fill="#22c55e" transform="rotate(12 158 136)" />
      <rect x="164" y="134" width="14" height="14" rx="2" fill="#38bdf8" transform="rotate(-10 171 141)" />
      {/* corpo */}
      <path d="M40 250 C38 176 66 140 100 138 C134 140 162 176 160 250 Z" fill="#dc2626" />
      <rect x="92" y="140" width="16" height="110" fill="#f8fafc" />
      <rect x="40" y="236" width="120" height="14" rx="6" fill="#f8fafc" />
      <rect x="42" y="198" width="116" height="14" fill="#1c1917" />
      <rect x="88" y="194" width="24" height="22" rx="3" fill="none" stroke="#fbbf24" strokeWidth="4" />
      {/* braços */}
      <path d="M52 170 C36 186 30 204 34 220" stroke="#dc2626" strokeWidth="18" fill="none" strokeLinecap="round" />
      <path d="M148 170 C160 180 166 190 166 204" stroke="#dc2626" strokeWidth="18" fill="none" strokeLinecap="round" />
      <circle cx="35" cy="226" r="10" fill="#1c1917" />
      <circle cx="166" cy="210" r="10" fill="#1c1917" />
      {/* rosto */}
      <circle cx="100" cy="92" r="30" fill="#fcd9b6" />
      <ellipse cx="80" cy="100" rx="7" ry="5" fill="#fb7185" opacity="0.5" />
      <ellipse cx="120" cy="100" rx="7" ry="5" fill="#fb7185" opacity="0.5" />
      {/* barba */}
      <path d="M64 94 C58 132 78 164 100 168 C122 164 142 132 136 94 C128 110 116 116 100 116 C84 116 72 110 64 94 Z" fill="#f8fafc" />
      {talking ? <ellipse cx="100" cy="120" rx="8" ry="6" fill="#7f1d1d" /> : <path d="M92 119 Q100 124 108 119" stroke="#7f1d1d" strokeWidth="2.5" fill="none" strokeLinecap="round" />}
      <path d="M100 110 C92 104 80 106 76 114 C84 112 92 114 100 114 C108 114 116 112 124 114 C120 106 108 104 100 110 Z" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
      <circle cx="100" cy="100" r="6" fill="#fda4af" />
      {/* olhos e sobrancelhas */}
      {frozen ? (
        <path d="M82 86 Q88 90 94 86 M106 86 Q112 90 118 86" stroke="#1c1917" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : (
        <>
          <circle cx="88" cy="86" r="3.4" fill="#1c1917" />
          <circle cx="112" cy="86" r="3.4" fill="#1c1917" />
          <circle cx="89" cy="85" r="1" fill="#fff" />
          <circle cx="113" cy="85" r="1" fill="#fff" />
        </>
      )}
      <path d="M78 78 Q88 72 96 78 M104 78 Q112 72 122 78" stroke="#f8fafc" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* gorro */}
      <path d="M68 70 C72 40 92 28 110 30 C128 32 140 48 150 76 C142 68 136 66 132 66 Z" fill="#dc2626" />
      <path d="M64 72 C64 62 80 58 100 58 C120 58 136 62 136 72 C136 80 120 76 100 76 C80 76 64 80 64 72 Z" fill="#f8fafc" />
      <circle cx="152" cy="78" r="9" fill="#f8fafc" />
    </svg>
  );
}

/** Formato da rena (de lado, olhando pra direita), pra desenhar sozinha ou puxando o trenó. */
function ReindeerShape({ star = false, color = "#92400e", scarf = false }: { star?: boolean; color?: string; scarf?: boolean }) {
  return (
    <g>
      {/* pernas */}
      <g stroke={color} strokeWidth="6" strokeLinecap="round">
        <path d="M36 70 L30 100 M50 72 L50 102 M76 72 L82 100 M88 68 L96 98" />
      </g>
      <g fill="#1c1917">
        <rect x="26" y="98" width="8" height="5" rx="2" />
        <rect x="46" y="100" width="8" height="5" rx="2" />
        <rect x="78" y="98" width="8" height="5" rx="2" />
        <rect x="92" y="96" width="8" height="5" rx="2" />
      </g>
      {/* corpo, rabo e barriga */}
      <ellipse cx="62" cy="60" rx="36" ry="17" fill={color} />
      <ellipse cx="62" cy="68" rx="24" ry="7" fill="#fcd9b6" opacity={color === "#92400e" ? 0.7 : 0} />
      <ellipse cx="26" cy="52" rx="6" ry="4" fill="#f8fafc" opacity={color === "#92400e" ? 1 : 0} />
      {/* pescoço e cabeça */}
      <path d="M86 52 C92 42 96 34 100 28 L110 34 C106 42 102 52 96 60 Z" fill={color} />
      <ellipse cx="108" cy="28" rx="13" ry="10" fill={color} />
      <ellipse cx="120" cy="32" rx="8" ry="6" fill={color} />
      <circle cx="126" cy="31" r="3" fill="#3f1d0b" />
      <path d="M98 20 L92 12 L100 16 Z" fill={color} />
      {color === "#92400e" && (
        <>
          <circle cx="110" cy="25" r="3.4" fill="#1c1917" />
          <circle cx="111" cy="24" r="1.1" fill="#fff" />
        </>
      )}
      {/* chifres */}
      <g stroke={color === "#92400e" ? "#d6a15a" : color} strokeWidth="3.4" fill="none" strokeLinecap="round">
        <path d="M104 20 C100 10 100 4 104 -4 M101 10 C96 8 94 4 94 0" />
        <path d="M112 19 C116 10 120 6 126 2 M118 10 C122 12 126 12 128 10" />
      </g>
      {star && (
        <g>
          <circle cx="112" cy="0" r="11" fill="#fde68a" opacity="0.45" className="cg-anim-orb" />
          <path d="M112 -8 L114.4 -2.4 L120.4 -2 L115.8 2 L117.2 8 L112 4.8 L106.8 8 L108.2 2 L103.6 -2 L109.6 -2.4 Z" fill="#fde047" stroke="#f59e0b" strokeWidth="0.8" />
        </g>
      )}
      {scarf && (
        <g>
          <path d="M92 50 C98 54 104 52 108 46" stroke="#dc2626" strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M96 52 L90 66 L96 66 Z" fill="#dc2626" />
        </g>
      )}
    </g>
  );
}

/** A renazinha Cometa, sozinha, com cachecol e a estrela entre os chifres. */
function Cometa({ className = "", shivering = false }: { className?: string; shivering?: boolean }) {
  return (
    <svg viewBox="0 -14 136 124" className={`overflow-visible ${shivering ? "cg-anim-shiver" : ""} ${className}`} aria-hidden="true">
      <ReindeerShape star scarf />
    </svg>
  );
}

/** Formato do trenó (olhando pra direita), com a pilha de presentes e, se quiser, o Papai Noel. */
function SleighShape({ santa = true }: { santa?: boolean }) {
  return (
    <g>
      {/* presentes */}
      <rect x="18" y="4" width="22" height="20" rx="2" fill="#22c55e" />
      <rect x="27" y="4" width="4" height="20" fill="#fbbf24" />
      <rect x="34" y="-6" width="18" height="16" rx="2" fill="#38bdf8" transform="rotate(10 43 2)" />
      <rect x="8" y="12" width="16" height="14" rx="2" fill="#a855f7" />
      {santa && (
        <g>
          <circle cx="78" cy="10" r="11" fill="#fcd9b6" />
          <path d="M66 12 C64 28 72 34 78 34 C84 34 92 28 90 12 C86 18 70 18 66 12 Z" fill="#f8fafc" />
          <path d="M68 4 C70 -8 80 -12 88 -8 C94 -4 96 4 98 10 L90 4 Z" fill="#dc2626" />
          <rect x="66" y="2" width="24" height="5" rx="2.5" fill="#f8fafc" />
          <circle cx="98" cy="11" r="3.5" fill="#f8fafc" />
          <path d="M62 30 C62 20 94 20 94 30 L94 40 L62 40 Z" fill="#dc2626" />
        </g>
      )}
      {/* caixa do trenó */}
      <path d="M4 28 L112 28 C120 28 122 36 118 44 L108 58 L14 58 C6 58 2 50 4 40 Z" fill="#b91c1c" />
      <path d="M4 34 L114 34" stroke="#fbbf24" strokeWidth="3" />
      <path d="M20 46 C34 40 50 52 64 46 C78 40 92 52 104 46" stroke="#fbbf24" strokeWidth="2" fill="none" />
      {/* esquis dourados */}
      <path d="M10 70 L126 70 C140 70 144 58 136 52" stroke="#fbbf24" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M30 58 L30 70 M90 58 L90 70" stroke="#fbbf24" strokeWidth="3" />
    </g>
  );
}

/** Trenó puxado por duas renas (as rédeas ligando tudo). `lead` = a da frente é a Cometa. */
function SleighTeam({ santa = true, lead = false, className = "", children }: { santa?: boolean; lead?: boolean; className?: string; children?: React.ReactNode }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 -24 380 128" className="w-full overflow-visible" aria-hidden="true">
        <path d="M112 40 C160 30 200 44 240 40 C280 36 300 44 330 38" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
        <g transform="translate(0 20)">
          <SleighShape santa={santa} />
        </g>
        <g transform="translate(150 6) scale(0.75)">
          <ReindeerShape color="#78350f" />
        </g>
        <g transform="translate(260 0) scale(0.75)">
          <ReindeerShape color={lead ? "#92400e" : "#78350f"} star={lead} scarf={lead} />
        </g>
      </svg>
      {children}
    </div>
  );
}

/** Formato de um presente (caixa, fita e laço). */
function GiftShape({ x, y, s = 1, color, ribbon = "#fbbf24" }: { x: number; y: number; s?: number; color: string; ribbon?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-20" y="-10" width="40" height="30" rx="3" fill={color} />
      <rect x="-23" y="-18" width="46" height="10" rx="2" fill={color} stroke="#00000033" strokeWidth="1" />
      <rect x="-3.5" y="-18" width="7" height="38" fill={ribbon} />
      <path d="M0 -18 C-10 -32 -22 -24 -12 -18 Z M0 -18 C10 -32 22 -24 12 -18 Z" fill={ribbon} stroke="#00000022" strokeWidth="1" />
    </g>
  );
}

/** Presente congelado (ícone da Fase 1): preso num bloco de gelo, ou descongelado e brilhando. */
export function FrozenGift({ lit, delay = 0, className = "" }: { lit: boolean; delay?: number; className?: string }) {
  const light = { "--cg-delay": `${delay}s` } as React.CSSProperties;
  return (
    <svg viewBox="0 0 60 100" className={`overflow-visible ${className}`} aria-hidden="true">
      {lit ? (
        <g className="cg-anim-light-up" style={light}>
          <circle cx="30" cy="62" r="30" fill="#fde68a" opacity="0.4" style={{ filter: "blur(7px)" }} />
          <GiftShape x={30} y={66} s={1} color="#dc2626" ribbon="#fbbf24" />
          <path d="M8 34 L11 40 M52 34 L49 40 M30 22 L30 29" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" className="cg-anim-twinkle" />
        </g>
      ) : (
        <g>
          <GiftShape x={30} y={66} s={1} color="#64748b" ribbon="#94a3b8" />
          <rect x="3" y="36" width="54" height="56" rx="6" fill="#bae6fd" opacity="0.55" stroke="#e0f2fe" strokeWidth="2" />
          <path d="M10 44 L20 44 M10 50 L16 50 M44 82 L50 82" stroke="#f0f9ff" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

/** Estrela da Aurora (ícone da Fase 2): apagada (cinza) ou acesa, brilhando nas cores da aurora. */
export function AuroraStar({ lit, delay = 0, className = "" }: { lit: boolean; delay?: number; className?: string }) {
  const light = { "--cg-delay": `${delay}s` } as React.CSSProperties;
  const star = "M30 14 L37 34 L58 35 L41 48 L47 69 L30 57 L13 69 L19 48 L2 35 L23 34 Z";
  return (
    <svg viewBox="0 0 60 100" className={`overflow-visible ${className}`} aria-hidden="true">
      <path d="M22 76 L38 76 L42 90 L18 90 Z" fill="#475569" />
      <rect x="12" y="90" width="36" height="7" rx="2" fill="#334155" />
      <path d={star} fill="#334155" stroke="#64748b" strokeWidth="1.5" strokeLinejoin="round" />
      {lit && (
        <g className="cg-anim-light-up" style={light}>
          <circle cx="30" cy="44" r="30" fill="#4ade80" opacity="0.35" style={{ filter: "blur(8px)" }} />
          <path d={star} fill="#fde047" stroke="#86efac" strokeWidth="2" strokeLinejoin="round" />
          <path d="M30 26 L33 36 L30 50 L27 36 Z" fill="#fffbeb" />
          <circle cx="44" cy="22" r="2" fill="#f472b6" className="cg-anim-twinkle" />
          <circle cx="14" cy="26" r="1.6" fill="#22d3ee" className="cg-anim-twinkle" style={{ animationDelay: "0.6s" }} />
        </g>
      )}
    </svg>
  );
}

/** Selo de Gelo (ícone da Fase 3): inteiro (trancado) ou quebrado ao meio, com luz quente saindo da rachadura. */
export function IceSeal({ lit, delay = 0, className = "" }: { lit: boolean; delay?: number; className?: string }) {
  const light = { "--cg-delay": `${delay}s` } as React.CSSProperties;
  const hex = "M30 8 L54 22 L54 56 L30 70 L6 56 L6 22 Z";
  return (
    <svg viewBox="0 0 60 100" className={`overflow-visible ${className}`} aria-hidden="true">
      <path d="M20 74 L40 74 L44 88 L16 88 Z" fill="#475569" />
      <rect x="10" y="88" width="40" height="7" rx="2" fill="#334155" />
      {!lit ? (
        <g>
          <path d={hex} fill="#7dd3fc" stroke="#e0f2fe" strokeWidth="2.5" strokeLinejoin="round" opacity="0.9" />
          <g stroke="#f0f9ff" strokeWidth="2.5" strokeLinecap="round">
            {[0, 60, 120].map((a) => (
              <line key={a} x1="30" y1="24" x2="30" y2="54" transform={`rotate(${a} 30 39)`} />
            ))}
          </g>
          <circle cx="30" cy="39" r="4" fill="#0ea5e9" />
        </g>
      ) : (
        <g className="cg-anim-light-up" style={light}>
          <circle cx="30" cy="39" r="28" fill="#fbbf24" opacity="0.35" style={{ filter: "blur(8px)" }} />
          <path d="M30 8 L54 22 L54 56 L34 68 L36 46 L26 34 L30 8 Z" fill="#7dd3fc" stroke="#e0f2fe" strokeWidth="2" strokeLinejoin="round" transform="translate(6 -2) rotate(10 42 38)" opacity="0.85" />
          <path d="M30 8 L26 34 L36 46 L34 68 L30 70 L6 56 L6 22 Z" fill="#7dd3fc" stroke="#e0f2fe" strokeWidth="2" strokeLinejoin="round" transform="translate(-6 2) rotate(-10 18 38)" opacity="0.85" />
          <path d="M30 14 L27 34 L35 46 L32 64" stroke="#fde047" strokeWidth="3" fill="none" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px #fbbf24)" }} />
        </g>
      )}
    </svg>
  );
}

/** O ícone de progresso de cada fase: presente (Fase 1), estrela da aurora (Fase 2), selo de gelo (Fase 3). */
export function ChristmasProgress({ lit, delay, className, phase = 1 }: { lit: boolean; delay?: number; className?: string; phase?: number }) {
  if (phase === 2) return <AuroraStar lit={lit} delay={delay} className={className} />;
  if (phase === 3) return <IceSeal lit={lit} delay={delay} className={className} />;
  return <FrozenGift lit={lit} delay={delay} className={className} />;
}

/** Boneco de Neve Bugado: olhos vermelhos piscando, sorriso torto de carvão e um "glitch" na cabeça. */
function EvilSnowman({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 -8 84 128" className={`overflow-visible ${className}`} style={style} aria-hidden="true">
      <path d="M22 54 L4 34 M8 38 L2 40 M62 54 L80 32 M76 36 L82 38" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="42" cy="92" r="26" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
      <circle cx="42" cy="56" r="19" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
      <circle cx="42" cy="50" r="2.4" fill="#1c1917" />
      <circle cx="42" cy="60" r="2.4" fill="#1c1917" />
      <circle cx="42" cy="86" r="2.8" fill="#1c1917" />
      <circle cx="42" cy="28" r="15" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
      <rect x="28" y="6" width="28" height="4" rx="1" fill="#1c1917" />
      <rect x="32" y="-8" width="20" height="16" fill="#1c1917" />
      <rect x="32" y="2" width="20" height="3" fill="#0ea5e9" />
      <path d="M31 22 L39 26 M53 22 L45 26" stroke="#1c1917" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="32" y="25" width="6" height="5" fill="#ef4444" className="cg-anim-eye" style={{ filter: "drop-shadow(0 0 4px #ef4444)" }} />
      <rect x="46" y="25" width="6" height="5" fill="#ef4444" className="cg-anim-eye" style={{ filter: "drop-shadow(0 0 4px #ef4444)" }} />
      <path d="M42 31 L58 34 L42 35 Z" fill="#f97316" />
      <path d="M33 38 L36 40 L39 37 L42 40 L45 37 L48 40 L51 38" stroke="#1c1917" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <g className="cg-anim-glitch">
        <rect x="26" y="18" width="10" height="2.5" fill="#22d3ee" opacity="0.8" />
        <rect x="50" y="32" width="12" height="2.5" fill="#f0abfc" opacity="0.8" />
      </g>
    </svg>
  );
}

/** Elfo da oficina (encolhido de frio, ou pulando de alegria quando a oficina volta a funcionar). */
function Elf({ className = "", happy = false, style }: { className?: string; happy?: boolean; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 -6 50 86" className={`overflow-visible ${className}`} style={style} aria-hidden="true">
      <path d="M12 46 C12 36 38 36 38 46 L40 72 L10 72 Z" fill="#15803d" />
      <rect x="10" y="56" width="30" height="5" fill="#1c1917" />
      <rect x="21" y="55" width="8" height="7" rx="1" fill="none" stroke="#fbbf24" strokeWidth="1.6" />
      <path d="M14 72 L14 80 M36 72 L36 80" stroke="#dc2626" strokeWidth="5" strokeLinecap="round" />
      {happy ? <path d="M12 46 L2 30 M38 46 L48 30" stroke="#fcd9b6" strokeWidth="4" strokeLinecap="round" /> : <path d="M13 46 C20 52 30 52 37 46" stroke="#15803d" strokeWidth="5" strokeLinecap="round" fill="none" />}
      <path d="M8 28 L2 22 L12 24 Z M42 28 L48 22 L38 24 Z" fill="#fcd9b6" />
      <circle cx="25" cy="28" r="13" fill="#fcd9b6" />
      <circle cx="20" cy="27" r="1.8" fill="#1c1917" />
      <circle cx="30" cy="27" r="1.8" fill="#1c1917" />
      {happy ? <path d="M19 33 Q25 39 31 33" stroke="#9f1239" strokeWidth="1.8" fill="none" strokeLinecap="round" /> : <path d="M20 35 L22 33 L25 35 L28 33 L30 35" stroke="#1e3a8a" strokeWidth="1.4" fill="none" strokeLinecap="round" />}
      <ellipse cx="17" cy="32" rx="3" ry="2" fill="#fb7185" opacity="0.5" />
      <ellipse cx="33" cy="32" rx="3" ry="2" fill="#fb7185" opacity="0.5" />
      <path d="M11 22 C14 6 30 -4 44 2 C36 4 34 12 39 22 Z" fill="#dc2626" />
      <rect x="10" y="19" width="30" height="5" rx="2.5" fill="#f8fafc" />
      <circle cx="45" cy="2" r="3.4" fill="#fbbf24" />
    </svg>
  );
}

/** Engrenagem (máquina da oficina), com pingentes de gelo se estiver congelada. */
function Gear({ className = "", frozen = true }: { className?: string; frozen?: boolean }) {
  return (
    <svg viewBox="0 0 100 110" className={`overflow-visible ${className}`} aria-hidden="true">
      <g className={frozen ? "" : "cg-anim-siren"}>
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x="44" y="4" width="12" height="18" rx="2" fill={frozen ? "#94a3b8" : "#f59e0b"} transform={`rotate(${i * 45} 50 50)`} />
        ))}
        <circle cx="50" cy="50" r="34" fill={frozen ? "#94a3b8" : "#f59e0b"} />
        <circle cx="50" cy="50" r="12" fill={frozen ? "#475569" : "#92400e"} />
      </g>
      {frozen && (
        <g fill="#e0f2fe">
          <path d="M26 78 L30 100 L34 80 Z M44 84 L48 108 L52 84 Z M62 80 L66 98 L70 78 Z" />
          <path d="M20 40 C30 22 70 22 80 40 C70 34 30 34 20 40 Z" opacity="0.7" />
        </g>
      )}
    </svg>
  );
}

/** Fortaleza de Gelo do Lorde Glacius: torres pontudas de cristal com janelas azuis. */
function IceFortress({ className = "" }: { className?: string }) {
  const spires: [number, number, number][] = [
    [160, 120, 60],
    [250, 60, 70],
    [340, 20, 90],
    [430, 70, 70],
    [510, 130, 56],
  ];
  return (
    <svg viewBox="80 0 520 300" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id="cg-ice-fortress" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e0f2fe" />
          <stop offset="1" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
      <path d="M100 300 L130 200 L560 200 L590 300 Z" fill="#7dd3fc" opacity="0.6" />
      {spires.map(([x, top, w], i) => (
        <g key={i}>
          <polygon points={`${x - w / 2},300 ${x - w / 2 + 6},${top + 60} ${x},${top} ${x + w / 2 - 6},${top + 60} ${x + w / 2},300`} fill="url(#cg-ice-fortress)" stroke="#f0f9ff" strokeWidth="2" />
          <polygon points={`${x},${top} ${x + w / 2 - 6},${top + 60} ${x + w / 2},300 ${x},300`} fill="#0ea5e9" opacity="0.25" />
          <rect x={x - 7} y={top + 90} width="14" height="22" rx="7" fill="#22d3ee" className="cg-anim-eye" style={{ animationDelay: `${i * 0.4}s`, filter: "drop-shadow(0 0 8px #22d3ee)" }} />
        </g>
      ))}
      <path d="M312 300 L312 250 A28 28 0 0 1 368 250 L368 300 Z" fill="#0c4a6e" />
    </svg>
  );
}

/** Salão da Fortaleza de Gelo: pingentes no teto e o chão de gelo brilhando (o chão fica no alto do balão de fala). */
function IceHall() {
  return (
    <>
      <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 h-[12%] w-full" aria-hidden="true">
        {Array.from({ length: 34 }, (_, i) => (
          <path key={i} d={`M${i * 3} 0 L${i * 3 + 1.5} ${3 + ((i * 7) % 7)} L${i * 3 + 3} 0 Z`} fill="#e0f2fe" opacity={0.55 + (i % 3) * 0.15} />
        ))}
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-[35%]" style={{ background: "linear-gradient(180deg, #bae6fd 0%, #38bdf8 12%, #0c4a6e 100%)" }}>
        <div className="absolute inset-x-[10%] top-[6%] h-[3%] rounded-full bg-white/50 blur-sm" />
      </div>
    </>
  );
}

/** Cristal de gelo gigante com o Papai Noel preso dentro. */
function CrystalPrison({ className = "", talking = false }: { className?: string; talking?: boolean }) {
  return (
    <div className={`relative aspect-[3/4] ${className}`}>
      <div className="absolute inset-[12%_14%_6%_14%]">
        <SantaClaus frozen talking={talking} className="h-full w-full" />
      </div>
      <svg viewBox="0 0 150 200" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <polygon points="75,2 138,44 128,190 22,190 12,44" fill="#7dd3fc" opacity="0.45" stroke="#e0f2fe" strokeWidth="3" strokeLinejoin="round" />
        <polygon points="75,2 75,190 22,190 12,44" fill="#e0f2fe" opacity="0.18" />
        <path d="M30 60 L44 50 M28 80 L38 74 M112 150 L122 142" stroke="#f0f9ff" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <div className="pointer-events-none absolute inset-0 rounded-full bg-sky-300/20 blur-2xl" />
    </div>
  );
}

// Pedaços do cristal voando quando ele se parte: [dx, dy, giro, atraso].
const SHARDS: [number, number, number, number][] = [
  [-220, -160, 200, 0.9],
  [210, -180, -240, 0.95],
  [-260, 40, 160, 1],
  [250, 60, -200, 0.92],
  [-120, -240, 300, 1.05],
  [140, -250, -280, 0.98],
  [-60, 180, 120, 1.1],
  [90, 170, -140, 1.02],
];

/** A carta do Glacius criança pro Papai Noel, finalmente entregue. */
function Letter({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" className={`overflow-visible ${className}`} aria-hidden="true">
      <rect x="10" y="10" width="180" height="140" rx="6" fill="#fef9c3" stroke="#d97706" strokeWidth="2" transform="rotate(-4 100 80)" />
      <g transform="rotate(-4 100 80)" fontFamily="'Comic Sans MS', 'Segoe Print', cursive" fill="#1e3a8a">
        <text x="24" y="38" fontSize="13" fontWeight="bold">Querido Papai Noel,</text>
        <text x="24" y="62" fontSize="11">eu só queria um amigo</text>
        <text x="24" y="80" fontSize="11">pra brincar na neve.</text>
        <text x="24" y="104" fontSize="11">Pode ser?</text>
        <text x="100" y="132" fontSize="11">Glacius, 7 anos</text>
      </g>
      <circle cx="170" cy="30" r="12" fill="#dc2626" transform="rotate(-4 100 80)" />
      <path d="M166 30 L174 30 M170 26 L170 34" stroke="#fecaca" strokeWidth="2" transform="rotate(-4 100 80)" />
      <path d="M160 100 C160 94 152 92 152 98 C152 102 160 106 160 110 C160 106 168 102 168 98 C168 92 160 94 160 100 Z" fill="#f43f5e" transform="rotate(-4 100 80)" />
    </svg>
  );
}

/** O mapa de luz achado no último presente: trilha de estrelas até o Polo Norte. */
function StarMap({ className = "" }: { className?: string }) {
  const stops: [number, number][] = [
    [40, 150],
    [90, 120],
    [140, 132],
    [190, 96],
    [240, 104],
    [290, 64],
  ];
  return (
    <svg viewBox="0 0 340 200" className={`overflow-visible ${className}`} aria-hidden="true">
      <path d="M10 20 C60 10 120 26 170 16 C220 6 280 22 330 14 L330 186 C280 194 220 178 170 188 C120 198 60 182 10 190 Z" fill="#fef3c7" stroke="#b45309" strokeWidth="3" />
      <path d="M20 170 C60 150 60 110 30 90 M300 180 C320 140 300 120 320 100" stroke="#d6d3d1" strokeWidth="2" fill="none" />
      <path d="M40 150 C70 130 80 118 90 120 C110 124 120 140 140 132 C160 124 170 100 190 96 C210 92 220 110 240 104 C260 98 270 76 290 64" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 7" fill="none" strokeLinecap="round" />
      {stops.map(([x, y], i) => (
        <path
          key={i}
          d={`M${x} ${y - 9} L${x + 2.6} ${y - 2.6} L${x + 9} ${y} L${x + 2.6} ${y + 2.6} L${x} ${y + 9} L${x - 2.6} ${y + 2.6} L${x - 9} ${y} L${x - 2.6} ${y - 2.6} Z`}
          fill="#f59e0b"
          className="cg-anim-light-up"
          style={{ "--cg-delay": `${0.4 + i * 0.35}s`, filter: "drop-shadow(0 0 5px #fbbf24)" } as React.CSSProperties}
        />
      ))}
      <g className="cg-anim-light-up" style={{ "--cg-delay": "2.6s" } as React.CSSProperties}>
        <circle cx="298" cy="46" r="16" fill="#bae6fd" opacity="0.8" />
        <text x="298" y="52" fontSize="16" textAnchor="middle">❄</text>
        <text x="250" y="30" fontSize="13" fontWeight="bold" fill="#0c4a6e" fontFamily="serif">Polo Norte</text>
      </g>
      <text x="26" y="178" fontSize="11" fill="#78350f" fontFamily="serif">CodeGuilds</text>
    </svg>
  );
}

/** Um aluno com o visual de inverno (suéter e gorro), no círculo da casa. */
function WinterHero({ student, avatar, size = 170, ring = "#ef4444" }: { student: EventArtProps["student"]; avatar?: Partial<AvatarConfig>; size?: number; ring?: string }) {
  if (!student) return null;
  return (
    <div className="relative flex flex-col items-center">
      <div className="cg-anim-wizard-enter relative">
        <div className="absolute inset-0 rounded-full blur-2xl" style={{ background: ring, opacity: 0.5 }} />
        <div className="cg-anim-float relative">
          <Avatar config={{ ...wornAvatar(student), outfit: "sueter", hat: "gorro-noel", ...avatar }} ringColor={ring} size={size} />
        </div>
      </div>
      <p className="relative mt-3 rounded-full border border-red-400/60 bg-black/60 px-4 py-1 text-xs font-black uppercase tracking-widest text-red-100">✦ {student.name} ✦</p>
    </div>
  );
}

function Wizard({ talking, burstKey = 0, className = "h-full" }: { talking: boolean; burstKey?: number; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="cg-anim-wizard-enter h-full">
        <div className="cg-anim-float h-full">
          <WizardDanilo mouthOpen={talking} burstKey={burstKey} className="h-full w-auto drop-shadow-[0_0_18px_rgba(250,204,21,0.35)]" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cenas
// ---------------------------------------------------------------------------

export default function ChristmasArt({ art, speaker, mouthOpen = false, student }: EventArtProps) {
  const talkingWizard = speaker === "mago" && mouthOpen;
  const talkingVillain = speaker === "vilao" && mouthOpen;
  const talkingSanta = speaker === "noel" && mouthOpen;
  const natal = getEvent("natal")!;

  switch (art) {
    // ================= FASE 1 — O SEQUESTRO =================

    // A CodeGuilds enfeitada, nevando, com o pinheiro gigante no pátio.
    case "vila":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="noite" />
          <Moon />
          <ChristmasCastle className="h-[52%] sm:h-[74%]" scale={1} />
          <SnowGround />
          <div className="absolute bottom-[8%] left-[2%] h-[48%] max-h-[42vw]">
            <ChristmasTree className="h-full w-auto drop-shadow-[0_0_30px_rgba(253,224,71,0.35)]" />
          </div>
          <Snowfall />
        </div>
      );

    // O trenó do Papai Noel cruzando a lua cheia.
    case "treno":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="noite" />
          <Moon className="left-[40%] top-[6%] w-[22%]" />
          <div className="cg-anim-sleigh absolute top-[16%] w-[44%] min-w-[240px] max-w-[560px]" style={{ left: "30%", "--cg-duration": "8s" } as React.CSSProperties}>
            <SleighTeam className="w-full drop-shadow-[0_0_18px_rgba(253,224,71,0.45)]" />
          </div>
          <ChristmasCastle className="h-[36%]" />
          <SnowGround className="h-[14%]" />
          <Snowfall />
        </div>
      );

    // O Lorde Glacius aparece no meio da nevasca.
    case "glacius":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="nevasca" />
          <div className="cg-anim-lightning pointer-events-none absolute inset-0 bg-sky-100" style={{ mixBlendMode: "overlay" }} />
          <Stage>
            <div className="cg-anim-reaper-rise h-full">
              <div className="cg-anim-float h-full">
                <LordGlacius talking={talkingVillain} className="h-full w-auto drop-shadow-[0_0_40px_rgba(56,189,248,0.6)]" />
              </div>
            </div>
          </Stage>
          <ChristmasCastle className="h-[26%]" lights={false} />
          <SnowGround className="h-[10%]" />
          <Snowfall blizzard />
        </div>
      );

    // O sequestro: o Papai Noel preso num cristal, levado pelo vento; o trenó caído lá embaixo.
    case "sequestro":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="nevasca" />
          <div className="absolute inset-x-0 bottom-[30%] top-[2%] flex justify-end pr-[4%] opacity-40">
            <LordGlacius talking={talkingVillain} className="h-full w-auto blur-[1px]" />
          </div>
          <div className="absolute left-[18%] top-[10%] w-[16%] min-w-[100px] max-w-[200px]">
            <div className="cg-anim-spin-slow absolute inset-[-28%] rounded-full border-4 border-dashed border-sky-200/60" />
            <div className="cg-anim-spin-reverse absolute inset-[-12%] rounded-full border-2 border-dotted border-white/50" />
            <div className="cg-anim-hover">
              <CrystalPrison className="w-full" />
            </div>
          </div>
          <SnowGround className="h-[40%]" />
          <div className="absolute bottom-[30%] right-[34%] w-[22%] min-w-[140px] max-w-[280px] rotate-[18deg]">
            <svg viewBox="-4 -10 150 90" className="w-full" aria-hidden="true">
              <SleighShape santa={false} />
            </svg>
          </div>
          <svg viewBox="0 0 400 100" className="absolute bottom-[31%] left-[2%] w-[34%]" aria-hidden="true">
            <GiftShape x={40} y={60} s={1} color="#22c55e" />
            <GiftShape x={110} y={70} s={0.8} color="#a855f7" />
            <GiftShape x={170} y={62} s={0.9} color="#38bdf8" />
          </svg>
          <Snowfall blizzard />
        </div>
      );

    // O pátio: presentes congelados espalhados pela neve, e o Mago chegando.
    case "presentes":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="noite" />
          <ChristmasCastle className="h-[70%] opacity-70" scale={1} lights={false} />
          <SnowGround className="h-[38%]" />
          <Stage className="!justify-start pl-[8%]">
            <Wizard talking={talkingWizard} className="h-[92%]" />
          </Stage>
          <div className="absolute bottom-[32%] right-[6%] flex w-[50%] items-end justify-around">
            {[0, 1, 2].map((i) => (
              <FrozenGift key={i} lit={false} className={`w-auto ${i === 1 ? "h-32 sm:h-52" : "h-28 sm:h-44"}`} />
            ))}
          </div>
          <Snowfall />
        </div>
      );

    // Chamado da Fase 1: o aluno de suéter e gorro, com o Mago e os presentes congelados.
    case "chamado-1":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="noite" />
          <ChristmasCastle className="h-[30%] opacity-80" />
          <SnowGround className="h-[16%]" />
          <Stage className="gap-[4%]">
            <div className="hidden h-[78%] sm:block">
              <WizardDanilo mouthOpen={talkingWizard} burstKey={1} className="h-full w-auto drop-shadow-[0_0_18px_rgba(250,204,21,0.35)]" />
            </div>
            <WinterHero student={student} />
            <div className="hidden h-[50%] items-end gap-2 sm:flex">
              {[0, 1, 2].map((i) => (
                <FrozenGift key={i} lit={false} className="h-[70%] w-auto" />
              ))}
            </div>
          </Stage>
          <Snowfall />
        </div>
      );

    // Final da Fase 1: o mapa de luz com a trilha de estrelas até o Polo Norte.
    case "mapa":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="noite" />
          <Rays color="rgba(253,230,138,0.35)" />
          <Stage className="!items-center">
            <div className="cg-anim-pop w-[70%] max-w-[640px]" style={{ animationDelay: "0.2s" }}>
              <StarMap className="w-full drop-shadow-[0_0_40px_rgba(253,230,138,0.5)]" />
            </div>
          </Stage>
          <Snowfall />
        </div>
      );

    // A cara do Glacius no meio das nuvens da nevasca, sobre o pátio.
    case "glacius-eco":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="nevasca" stars={false} />
          <div className="absolute inset-x-0 bottom-[28%] top-0 flex justify-center opacity-60">
            <LordGlacius talking={talkingVillain} className="h-[130%] w-auto blur-[2px]" />
          </div>
          <ChristmasCastle className="h-[34%]" />
          <SnowGround className="h-[12%]" />
          <Snowfall blizzard />
        </div>
      );

    // A renazinha Cometa tremendo de frio entre os destroços do trenó.
    case "cometa":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="noite" />
          <Moon className="left-[8%] top-[8%] w-[10%]" />
          <SnowGround className="h-[34%]" />
          <div className="absolute bottom-[26%] right-[6%] w-[28%] min-w-[150px] max-w-[330px] rotate-[14deg] opacity-80">
            <svg viewBox="-4 -10 150 90" className="w-full" aria-hidden="true">
              <SleighShape santa={false} />
            </svg>
          </div>
          <Stage>
            <div className="cg-anim-pop h-[70%]" style={{ animationDelay: "0.4s" }}>
              <Cometa shivering className="h-full w-auto drop-shadow-[0_0_30px_rgba(253,224,71,0.45)]" />
            </div>
          </Stage>
          <Snowfall />
        </div>
      );

    case "recompensa-1":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0" style={{ background: "radial-gradient(60% 55% at 50% 45%, rgba(253,230,138,0.55), transparent 70%), linear-gradient(180deg, #7f1d1d 0%, #b91c1c 50%, #166534 100%)" }} />
          <Rays color="rgba(255,251,235,0.5)" />
          <Confetti colors={["#ef4444", "#22c55e", "#fbbf24", "#f8fafc", "#38bdf8"]} />
          <RewardShowcase reward={getPhase(natal, 1).reward} avatar={student ? { ...wornAvatar(student), pet: "cometa" } : null} ringColor="#fbbf24" />
        </div>
      );

    // ================= FASE 2 — A JORNADA AO POLO NORTE =================

    // O trenó (com a Cometa na frente e o aluno a bordo) sobre montanhas e florestas.
    case "viagem":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="polo" />
          <Aurora faint className="inset-x-0 top-0 h-[40%]" />
          <Mountains className="h-[62%]" />
          <PineForest className="h-[26%]" />
          <div className="cg-anim-hover absolute left-[18%] top-[14%] w-[52%] min-w-[260px] max-w-[620px]">
            <SleighTeam santa={false} lead className="w-full drop-shadow-[0_0_18px_rgba(253,224,71,0.4)]">
              {student && (
                <div className="absolute left-[9%] top-[8%] w-[16%]">
                  <Avatar config={{ ...wornAvatar(student), outfit: "sueter", hat: "gorro-noel" }} size={72} />
                </div>
              )}
            </SleighTeam>
          </div>
          <Snowfall />
        </div>
      );

    // A aurora boreal fraca, piscando, quase apagando.
    case "aurora":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="polo" />
          <Aurora faint />
          <Mountains className="h-[52%]" />
          <SnowGround className="h-[20%]" />
          <Snowfall />
        </div>
      );

    // A oficina dos elfos congelada: engrenagens paradas e elfos tremendo de frio.
    case "oficina":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="oficina" stars={false} />
          <div className="absolute inset-x-0 top-[6%] flex justify-around px-[6%] opacity-80">
            <Gear className="w-[14%] max-w-[150px]" />
            <Gear className="mt-[4%] w-[10%] max-w-[110px]" />
            <Gear className="w-[12%] max-w-[130px]" />
          </div>
          <div className="absolute inset-x-[4%] top-[37%] h-2.5 rounded bg-amber-900/90" />
          <svg viewBox="0 0 100 4" preserveAspectRatio="none" className="absolute inset-x-[4%] top-[38%] h-[4%] w-[92%]" aria-hidden="true">
            {Array.from({ length: 30 }, (_, i) => (
              <path key={i} d={`M${i * 3.4 + 0.5} 0 L${i * 3.4 + 1.3} ${1.5 + (i % 3)} L${i * 3.4 + 2.1} 0 Z`} fill="#e0f2fe" opacity="0.85" />
            ))}
          </svg>
          <div className="absolute inset-x-[4%] top-[25%] flex justify-around text-4xl sm:text-6xl" style={{ filter: "grayscale(0.7) brightness(0.85)" }} aria-hidden="true">
            <span>🧸</span>
            <span>🚂</span>
            <span>🎈</span>
            <span>⚽</span>
            <span>🎲</span>
          </div>
          <Stage className="!justify-start gap-[6%] pl-[6%]">
            <Wizard talking={talkingWizard} burstKey={2} className="h-[92%]" />
            <div className="flex h-[46%] items-end gap-3">
              <Elf className="cg-anim-shiver h-full w-auto" />
              <Elf className="cg-anim-shiver h-[86%] w-auto" style={{ animationDelay: "0.1s" }} />
              <Elf className="cg-anim-shiver hidden h-[92%] w-auto sm:block" style={{ animationDelay: "0.05s" }} />
            </div>
          </Stage>
          <Snowfall />
        </div>
      );

    // O Glacius sugando a luz da aurora com o cetro.
    case "glacius-aurora":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="polo" />
          <Aurora faint className="inset-x-0 top-0 h-[45%]" />
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
            {[
              ["M5 10 C30 28 48 30 61 30", "#4ade80"],
              ["M20 4 C38 18 52 26 61 30", "#f472b6"],
              ["M95 12 C84 20 70 26 61 30", "#22d3ee"],
            ].map(([d, c]) => (
              <path key={d} d={d} stroke={c} strokeWidth="0.8" fill="none" strokeDasharray="3 3" className="cg-anim-beam" style={{ filter: `drop-shadow(0 0 2px ${c})` }} />
            ))}
          </svg>
          <Stage>
            <div className="cg-anim-float h-full">
              <LordGlacius talking={talkingVillain} className="h-full w-auto drop-shadow-[0_0_40px_rgba(56,189,248,0.6)]" />
            </div>
          </Stage>
          <SnowGround className="h-[14%]" />
          <Snowfall />
        </div>
      );

    // As Estrelas da Aurora nos pedestais de gelo: a primeira acende pra mostrar como funciona.
    case "estrelas":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="polo" />
          <Aurora faint />
          <Mountains className="h-[48%] opacity-80" />
          <SnowGround className="h-[18%]" />
          <Stage className="!bottom-[34%] gap-[8%] px-[10%]">
            {[0, 1, 2].map((i) => (
              <AuroraStar key={i} lit={i === 0} delay={1.3} className="h-[64%] w-auto" />
            ))}
          </Stage>
          <Snowfall />
        </div>
      );

    // Final da Fase 2: a aurora forte, as estrelas acesas e os elfos pulando.
    case "aurora-viva":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="polo" />
          <Aurora />
          <Rays color="rgba(134,239,172,0.3)" />
          <Mountains className="h-[48%]" />
          <SnowGround className="h-[18%]" />
          <Stage className="!items-end gap-[4%] px-[6%]">
            {[0, 1, 2].map((i) => (
              <AuroraStar key={i} lit delay={0.3 + i * 0.4} className="cg-anim-float h-[46%] w-auto" />
            ))}
            {[0, 1, 2].map((i) => (
              <div key={`e${i}`} className="cg-anim-hop h-[34%]" style={{ animationDelay: `${i * 0.3}s` }}>
                <Elf happy className="h-full w-auto" />
              </div>
            ))}
          </Stage>
        </div>
      );

    // A ponte de luz da aurora levando até a Fortaleza de Gelo.
    case "fortaleza":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="polo" />
          <Aurora />
          <Mountains className="h-[56%]" />
          <div className="cg-anim-fade absolute bottom-[29%] right-[6%] w-[46%] max-w-[600px]" style={{ animationDelay: "0.6s" }}>
            <IceFortress className="w-full drop-shadow-[0_0_40px_rgba(56,189,248,0.55)]" />
          </div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
            <path d="M0 74 C20 42 46 42 70 68" stroke="url(#cg-bridge)" strokeWidth="2.2" fill="none" className="cg-anim-beam" />
            <defs>
              <linearGradient id="cg-bridge" x1="0" x2="1">
                <stop offset="0" stopColor="#4ade80" />
                <stop offset="0.5" stopColor="#22d3ee" />
                <stop offset="1" stopColor="#f472b6" />
              </linearGradient>
            </defs>
          </svg>
          <SnowGround className="h-[16%]" />
          <Snowfall />
        </div>
      );

    // O Glacius na porta da fortaleza, desafiando o aluno.
    case "glacius-desafio":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="gelo" />
          <div className="absolute bottom-[20%] inset-x-0 mx-auto w-[80%] max-w-[900px] opacity-50">
            <IceFortress className="w-full" />
          </div>
          <div className="cg-anim-lightning pointer-events-none absolute inset-0 bg-sky-100" style={{ mixBlendMode: "overlay" }} />
          <Stage>
            <div className="cg-anim-reaper-rise h-full">
              <LordGlacius talking={talkingVillain} className="h-full w-auto drop-shadow-[0_0_40px_rgba(56,189,248,0.6)]" />
            </div>
          </Stage>
          <SnowGround className="h-[12%]" />
          <Snowfall blizzard />
        </div>
      );

    case "recompensa-2":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #020617 0%, #134e4a 60%, #0f172a 100%)" }} />
          <Aurora />
          <Rays color="rgba(134,239,172,0.4)" />
          <Confetti colors={["#4ade80", "#22d3ee", "#f472b6", "#fde047", "#f8fafc"]} />
          <RewardShowcase reward={getPhase(natal, 2).reward} avatar={student ? { ...wornAvatar(student), aura: "estrela-polar" } : null} ringColor="#4ade80" />
        </div>
      );

    // ================= FASE 3 — O RESGATE =================

    // O salão de gelo da fortaleza, com o cristal lá no fundo.
    case "salao":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="gelo" stars={false} />
          {[6, 22, 70, 86].map((left, i) => (
            <div key={left} className="absolute bottom-[34%] top-0 w-[7%]" style={{ left: `${left}%` }}>
              <div className="h-full w-full" style={{ background: "linear-gradient(90deg, #bae6fd, #e0f2fe 40%, #7dd3fc)", clipPath: "polygon(15% 0, 85% 0, 100% 100%, 0 100%)", opacity: 0.8 - i * 0.05 }} />
            </div>
          ))}
          <IceHall />
          <Stage>
            <div className="cg-anim-fade h-[56%]" style={{ animationDelay: "0.8s" }}>
              <CrystalPrison className="h-full" />
            </div>
          </Stage>
          <Snowfall />
        </div>
      );

    // O Papai Noel preso no cristal, de perto.
    case "noel-preso":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="gelo" stars={false} />
          <Rays color="rgba(186,230,253,0.35)" />
          <Stage>
            <div className="cg-anim-pop h-full" style={{ animationDelay: "0.2s" }}>
              <CrystalPrison className="h-full drop-shadow-[0_0_50px_rgba(125,211,252,0.6)]" />
            </div>
          </Stage>
          <IceHall />
          <Snowfall />
        </div>
      );

    // O Glacius no trono de gelo, com o cristal ao lado.
    case "glacius-trono":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="gelo" stars={false} />
          <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax meet" className="absolute bottom-[12%] inset-x-0 mx-auto h-[80%] opacity-70" aria-hidden="true">
            <polygon points="60,300 80,90 120,160 160,40 200,140 240,40 280,160 320,90 340,300" fill="#bae6fd" stroke="#e0f2fe" strokeWidth="3" />
          </svg>
          <Stage className="gap-[6%]">
            <div className="h-full">
              <LordGlacius talking={talkingVillain} className="h-full w-auto drop-shadow-[0_0_40px_rgba(56,189,248,0.6)]" />
            </div>
            <div className="hidden h-[70%] sm:block">
              <CrystalPrison className="h-full" />
            </div>
          </Stage>
          <IceHall />
        </div>
      );

    // A tropa de Bonecos de Neve Bugados avançando.
    case "bonecos":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="gelo" stars={false} />
          <div className="absolute inset-x-0 bottom-[30%] top-[2%] flex justify-center opacity-30">
            <LordGlacius talking={talkingVillain} className="h-full w-auto" />
          </div>
          <IceHall />
          <Stage className="!bottom-[26%] !items-end gap-[3%] px-[4%]">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={`cg-anim-shamble ${i % 2 ? "h-[58%]" : "h-[70%]"} ${i > 2 ? "hidden sm:block" : ""}`} style={{ animationDelay: `${i * 0.25}s` }}>
                <EvilSnowman className="h-full w-auto drop-shadow-[0_0_16px_rgba(239,68,68,0.35)]" />
              </div>
            ))}
          </Stage>
          <Snowfall />
        </div>
      );

    // Os três Selos de Gelo em volta do cristal: o primeiro quebra pra mostrar como funciona.
    case "selos":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="gelo" stars={false} />
          <div className="absolute inset-x-0 bottom-[32%] top-[4%] flex justify-center opacity-35">
            <CrystalPrison className="h-full" />
          </div>
          <IceHall />
          <Stage className="!bottom-[34%] gap-[10%] px-[10%]">
            {[0, 1, 2].map((i) => (
              <IceSeal key={i} lit={i === 0} delay={1.3} className="h-[60%] w-auto" />
            ))}
          </Stage>
        </div>
      );

    // Final: o cristal se parte em mil pedaços e o Papai Noel sai rindo.
    case "libertacao":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="gelo" stars={false} />
          <Rays color="rgba(253,230,138,0.45)" />
          <Stage>
            <div className="relative flex h-full items-end justify-center">
              <div className="cg-anim-fade-out h-full" style={{ "--cg-delay": "0.9s" } as React.CSSProperties}>
                <CrystalPrison className="h-full" />
              </div>
              {SHARDS.map(([dx, dy, spin, delay], i) => (
                <span
                  key={i}
                  className="cg-anim-shatter absolute bottom-[40%] left-1/2 h-8 w-5 bg-sky-200/90"
                  style={{ clipPath: "polygon(50% 0, 100% 60%, 40% 100%, 0 40%)", "--cg-dx": `${dx}px`, "--cg-dy": `${dy}px`, "--cg-spin": `${spin}deg`, "--cg-delay": `${delay}s` } as React.CSSProperties}
                />
              ))}
              <div className="cg-anim-poof pointer-events-none absolute bottom-[20%] inset-x-0 mx-auto aspect-square w-[70%] rounded-full bg-white/80 blur-2xl" style={{ animationDelay: "0.9s" }} />
              <div className="cg-anim-pop absolute bottom-0 inset-x-0 mx-auto h-[90%] w-fit" style={{ animationDelay: "1.6s" }}>
                <SantaClaus talking={talkingSanta} className="h-full w-auto drop-shadow-[0_0_40px_rgba(253,224,71,0.55)]" />
              </div>
            </div>
          </Stage>
          <IceHall />
          <Snowfall />
        </div>
      );

    // O Glacius derrotado: a coroa torta, lágrimas congeladas.
    case "glacius-derrotado":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="gelo" stars={false} />
          <Stage>
            <div className="h-full">
              <LordGlacius talking={talkingVillain} mood="triste" className="h-full w-auto drop-shadow-[0_0_30px_rgba(56,189,248,0.45)]" />
            </div>
          </Stage>
          <IceHall />
          <Snowfall />
        </div>
      );

    // O Papai Noel mostra a cartinha do Glacius, entregue depois de cem anos.
    case "carta":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0" style={{ background: "radial-gradient(55% 55% at 50% 40%, rgba(253,230,138,0.45), transparent 70%), linear-gradient(180deg, #0c4a6e 0%, #1e3a8a 100%)" }} />
          <Stage className="gap-[3%]">
            <div className="h-[92%]">
              <SantaClaus talking={talkingSanta} className="h-full w-auto" />
            </div>
            <div className="cg-anim-pop w-[30%] max-w-[300px] self-center" style={{ animationDelay: "0.8s" }}>
              <div className="cg-anim-float">
                <Letter className="w-full drop-shadow-[0_0_30px_rgba(253,230,138,0.6)]" />
              </div>
            </div>
            <div className="hidden h-[84%] sm:block">
              <LordGlacius mood="triste" className="h-full w-auto" />
            </div>
          </Stage>
          <Snowfall />
        </div>
      );

    // O Natal salvo: o trenó voando sobre a CodeGuilds, com a aurora e o Glacius feliz.
    case "natal-salvo":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="noite" />
          <Aurora />
          <div className="cg-anim-sleigh absolute top-[10%] w-[40%] min-w-[220px] max-w-[520px]" style={{ left: "30%", "--cg-duration": "9s" } as React.CSSProperties}>
            <SleighTeam className="w-full drop-shadow-[0_0_18px_rgba(253,224,71,0.5)]" />
          </div>
          <ChristmasCastle className="h-[46%]" />
          <SnowGround className="h-[14%]" />
          <div className="cg-anim-pop absolute bottom-[32%] right-[5%] h-[30%]" style={{ animationDelay: "1s" }}>
            <div className="cg-anim-hop h-full">
              <LordGlacius mood="feliz" className="h-full w-auto" />
            </div>
          </div>
          <Confetti colors={["#ef4444", "#22c55e", "#fbbf24", "#f8fafc", "#38bdf8"]} />
          <Snowfall />
        </div>
      );

    // Última cena do evento: o visual completo de herói do Natal (Cometa, Estrela Polar e o Gorro Lendário).
    case "recompensa-3":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0" style={{ background: SKIES.festa }} />
          <Aurora className="inset-x-0 top-0 h-[40%]" />
          <Rays color="rgba(255,251,235,0.55)" />
          <Snowfall />
          <Confetti colors={["#ef4444", "#22c55e", "#fbbf24", "#f8fafc", "#38bdf8"]} />
          <RewardShowcase
            reward={getPhase(natal, 3).reward}
            avatar={student ? { ...wornAvatar(student), hat: "gorro-lendario", pet: "cometa", aura: "estrela-polar" } : null}
            ringColor="#ef4444"
          />
        </div>
      );

    // ================= PÔSTERES (card, banner e cada fase) =================

    // Fase 1: o pátio com os presentes congelados e o Glacius espiando.
    case "poster-1":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="nevasca" />
          <div className="absolute bottom-[10%] right-[4%] h-[86%] opacity-80">
            <LordGlacius className="h-full w-auto drop-shadow-[0_0_30px_rgba(56,189,248,0.5)]" />
          </div>
          <ChristmasCastle className="h-[40%]" lights={false} />
          <SnowGround className="h-[22%]" />
          <div className="absolute bottom-[8%] left-[6%] flex w-[46%] items-end gap-[4%]">
            {[0, 1, 2].map((i) => (
              <FrozenGift key={i} lit={false} className="h-16 w-auto sm:h-24" />
            ))}
          </div>
          <Snowfall blizzard />
        </div>
      );

    // Fase 2: a aurora sobre o Polo Norte, com a Cometa.
    case "poster-2":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="polo" />
          <Aurora />
          <Mountains className="h-[60%]" />
          <PineForest className="h-[24%]" />
          <div className="cg-anim-float absolute bottom-[10%] left-[8%] h-[46%]">
            <Cometa className="h-full w-auto drop-shadow-[0_0_24px_rgba(253,224,71,0.45)]" />
          </div>
          <Snowfall />
        </div>
      );

    // Fase 3: a Fortaleza de Gelo com o cristal do Papai Noel.
    case "poster-3":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="gelo" />
          <div className="absolute bottom-[6%] inset-x-0 mx-auto w-[90%] max-w-[900px] opacity-80">
            <IceFortress className="w-full" />
          </div>
          <div className="absolute bottom-[8%] left-[6%] h-[64%]">
            <CrystalPrison className="h-full drop-shadow-[0_0_30px_rgba(125,211,252,0.6)]" />
          </div>
          <div className="absolute bottom-[4%] right-[6%] flex h-[40%] items-end gap-2">
            <EvilSnowman className="cg-anim-shamble h-full w-auto" />
            <EvilSnowman className="cg-anim-shamble h-[80%] w-auto" style={{ animationDelay: "0.3s" }} />
          </div>
          <Snowfall />
        </div>
      );

    // Card do evento e banner: o castelo enfeitado, o trenó cruzando a lua e o Glacius espiando.
    case "poster":
    default:
      return (
        <div className="absolute inset-0 overflow-hidden">
          <Sky variant="noite" />
          <Moon className="left-[34%] top-[6%] w-[12%]" />
          <div className="cg-anim-float absolute bottom-[12%] right-[3%] h-[84%]">
            <LordGlacius className="h-full w-auto drop-shadow-[0_0_30px_rgba(56,189,248,0.5)]" />
          </div>
          <div className="cg-anim-hover absolute left-[6%] top-[10%] w-[38%] min-w-[200px] max-w-[460px]">
            <SleighTeam className="w-full drop-shadow-[0_0_16px_rgba(253,224,71,0.45)]" />
          </div>
          <ChristmasCastle className="h-[48%]" />
          <SnowGround className="h-[14%]" />
          <div className="absolute bottom-[4%] left-[2%] h-[44%] max-h-[30vw]">
            <ChristmasTree className="h-full w-auto" />
          </div>
          <Snowfall />
        </div>
      );
  }
}
