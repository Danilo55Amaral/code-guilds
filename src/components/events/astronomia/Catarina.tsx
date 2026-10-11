"use client";

import { useId } from "react";

// ============================================================================
// CATARINA VITÓRIA — a protagonista de Astronomia em: Salve o Wi-Fi, homenagem
// à aluna que teve a ideia do evento: a astrônoma mais jovem da CodeGuilds.
// Cabelo castanho-escuro comprido com franja de lado, olhos castanhos grandes,
// o headset de rádio (é ela quem fala com os satélites) e o traje espacial
// branco com detalhes fúcsia e violeta, o painel de luzes no peito, o emblema
// do Wi-Fi e a mochila de oxigênio. SVG puro (viewBox 240×360, os pés em
// y≈344). Animações: respira, pisca, o cabelo balança, a boca mexe quando ela
// fala (mouthOpen), os braços mudam de pose (pose) e, no espaço, aparece o
// capacete de vidro (helmet).
// ============================================================================

export type CatarinaPose = "neutra" | "aponta" | "comemora" | "acena";

const C = {
  skin: "#c68a62",
  skinShade: "#a96d47",
  hair: "#24150f",
  hairLight: "#5a3626",
  suit: "#f8fafc",
  suitShade: "#cbd5e1",
  line: "#64748b",
  accent: "#d946ef",
  accentDark: "#a21caf",
  violet: "#7c3aed",
  gold: "#fbbf24",
  cyan: "#22d3ee",
  ink: "#1e1b2e",
};

// ângulo do braço e do antebraço (graus; 0 = pendurado; positivo = abre pra fora do corpo)
const POSES: Record<CatarinaPose, { left: [number, number]; right: [number, number]; wave?: boolean }> = {
  neutra: { left: [8, -6], right: [42, -78] },
  aponta: { left: [8, -6], right: [138, 12] },
  comemora: { left: [148, 14], right: [148, 14] },
  acena: { left: [8, -6], right: [132, -6], wave: true },
};

const EASE = "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)";

/** Um braço do traje: ombreira, braço, cotovelo, antebraço com o punho fúcsia e a luva violeta. */
function Arm({ angles, wave }: { angles: [number, number]; wave?: boolean }) {
  return (
    <g style={{ transform: `rotate(${angles[0]}deg)`, transformOrigin: "0 0", transition: EASE }}>
      <path d="M-11 0 C-12 16 -11 32 -9 46 L9 46 C11 32 12 16 11 0 C8 -9 -8 -9 -11 0 Z" fill={C.suit} stroke={C.line} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M6 4 C8 18 8 32 6 44" stroke={C.suitShade} strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="0" cy="2" r="12.5" fill={C.violet} stroke={C.ink} strokeWidth="1.2" />
      <circle cx="-3" cy="-1" r="4" fill="#a78bfa" opacity="0.7" />
      <g transform="translate(0 46)">
        <g style={{ transform: `rotate(${angles[1]}deg)`, transformOrigin: "0 0", transition: EASE }}>
          <g className={wave ? "cg-anim-aura-turn" : undefined} style={wave ? ({ "--cg-turn": "16deg", "--cg-dur": "0.9s", transformOrigin: "0 0" } as React.CSSProperties) : undefined}>
            <path d="M-9 -2 C-10 14 -9 28 -8 40 L8 40 C9 28 10 14 9 -2 Z" fill={C.suit} stroke={C.line} strokeWidth="1.5" strokeLinejoin="round" />
            <circle r="9.5" fill={C.suit} stroke={C.line} strokeWidth="1.3" />
            <rect x="-9.5" y="31" width="19" height="9" rx="3" fill={C.accent} stroke={C.accentDark} strokeWidth="1" />
            <path d="M-9 40 C-11 49 -9 57 -3 60 C2 62 8 60 10 54 C12 48 11 43 9 40 Z" fill={C.violet} stroke={C.ink} strokeWidth="1.2" />
            <path d="M8 44 C13 44 15 48 13 52" stroke={C.ink} strokeWidth="1.2" fill="#8b5cf6" />
          </g>
        </g>
      </g>
    </g>
  );
}

function Eye({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <path d={`M${cx - 9.5} ${cy} C${cx - 6} ${cy - 8.5} ${cx + 6} ${cy - 8.5} ${cx + 9.5} ${cy - 1} C${cx + 6} ${cy + 7.5} ${cx - 6} ${cy + 7.5} ${cx - 9.5} ${cy} Z`} fill="#fff" />
      <circle cx={cx} cy={cy + 0.4} r="6.4" fill="#6b3d22" />
      <circle cx={cx} cy={cy + 0.4} r="4.6" fill="#3d2213" />
      <circle cx={cx} cy={cy + 0.4} r="2.8" fill="#0f0905" />
      <circle cx={cx + 2.3} cy={cy - 2.2} r="2.1" fill="#fff" />
      <circle cx={cx - 2.1} cy={cy + 2.8} r="1" fill="#fff" opacity="0.85" />
      <path d={`M${cx - 10.5} ${cy + 0.5} C${cx - 6} ${cy - 9.5} ${cx + 6} ${cy - 9.5} ${cx + 10.5} ${cy - 1.5}`} stroke={C.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" />
    </g>
  );
}

export default function Catarina({
  mouthOpen = false,
  helmet = false,
  pose = "neutra",
  className = "",
}: {
  mouthOpen?: boolean;
  helmet?: boolean;
  pose?: CatarinaPose;
  className?: string;
}) {
  const id = `ca${useId().replace(/:/g, "")}`;
  const arms = POSES[pose];
  return (
    <svg viewBox="0 0 240 360" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-glass`} cx="0.4" cy="0.35" r="0.65">
          <stop offset="0" stopColor="#e0f2fe" stopOpacity="0.05" />
          <stop offset="0.75" stopColor="#bae6fd" stopOpacity="0.14" />
          <stop offset="1" stopColor="#7dd3fc" stopOpacity="0.38" />
        </radialGradient>
        <linearGradient id={`${id}-hair`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2219" />
          <stop offset="1" stopColor={C.hair} />
        </linearGradient>
      </defs>

      <ellipse cx="120" cy="347" rx="48" ry="6" fill="#000" opacity="0.3" />

      <g className="cg-anim-dragon-breathe">
        {/* cabelo de trás (comprido, balançando de leve) */}
        <g className="cg-anim-aura-turn" style={{ "--cg-turn": "1.6deg", "--cg-dur": "4.2s", transformOrigin: "120px 60px" } as React.CSSProperties}>
          <path
            d="M82 96 C76 58 96 36 120 36 C144 36 164 58 158 96 C160 128 166 166 172 204 C162 214 150 213 141 205 C143 186 142 166 138 150 L102 150 C98 166 97 186 99 205 C90 213 78 214 68 204 C74 166 80 128 82 96 Z"
            fill={`url(#${id}-hair)`}
          />
          <path d="M74 190 C78 170 82 150 84 128 M166 190 C162 170 158 150 156 128" stroke={C.hairLight} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
        </g>

        {/* mochila de oxigênio */}
        <rect x="70" y="156" width="100" height="82" rx="12" fill={C.suitShade} stroke={C.line} strokeWidth="1.5" />
        <rect x="74" y="164" width="10" height="56" rx="5" fill={C.violet} opacity="0.85" />
        <rect x="156" y="164" width="10" height="56" rx="5" fill={C.violet} opacity="0.85" />

        {/* pernas e botas */}
        <path d="M86 246 L117 246 L115 318 L91 318 Z" fill={C.suit} stroke={C.line} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M123 246 L154 246 L149 318 L125 318 Z" fill={C.suit} stroke={C.line} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M144 252 L148 316" stroke={C.suitShade} strokeWidth="5" />
        <ellipse cx="103" cy="282" rx="10" ry="7" fill={C.suitShade} stroke={C.line} strokeWidth="1" />
        <ellipse cx="138" cy="282" rx="10" ry="7" fill={C.suitShade} stroke={C.line} strokeWidth="1" />
        <path d="M88 314 L118 314 L119 334 C119 341 115 344 109 344 L84 344 C78 344 76 339 79 334 Z" fill={C.violet} stroke={C.ink} strokeWidth="1.4" />
        <path d="M152 314 L122 314 L121 334 C121 341 125 344 131 344 L156 344 C162 344 164 339 161 334 Z" fill={C.violet} stroke={C.ink} strokeWidth="1.4" />
        <path d="M80 338 L118 338 M122 338 L160 338" stroke={C.accent} strokeWidth="2.4" />

        {/* tronco do traje */}
        <path d="M84 156 C92 147 104 144 120 144 C136 144 148 147 156 156 C164 172 166 196 162 226 L160 248 L80 248 L78 226 C74 196 76 172 84 156 Z" fill={C.suit} stroke={C.line} strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M150 160 C158 180 160 206 156 236" stroke={C.suitShade} strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M86 162 C82 182 82 210 84 236 M154 162 C158 182 158 210 156 236" stroke={C.accent} strokeWidth="4.5" fill="none" strokeLinecap="round" />
        {/* a plaquinha com o nome, o painel de luzes e o emblema do Wi-Fi */}
        <rect x="102" y="156" width="36" height="9" rx="3" fill={C.violet} />
        <text x="120" y="163" textAnchor="middle" fontSize="6.2" fontWeight="bold" fontFamily="sans-serif" fill="#f5f3ff" letterSpacing="0.6">
          CATARINA
        </text>
        <rect x="103" y="170" width="34" height="28" rx="5" fill="#e2e8f0" stroke={C.line} strokeWidth="1.3" />
        <circle cx="111" cy="178" r="3" fill={C.cyan} className="cg-anim-twinkle" />
        <circle cx="120" cy="178" r="3" fill={C.gold} className="cg-anim-twinkle" style={{ animationDelay: "0.6s" }} />
        <circle cx="129" cy="178" r="3" fill={C.accent} className="cg-anim-twinkle" style={{ animationDelay: "1.2s" }} />
        <path d="M109 187 L131 187 M109 192 L123 192" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        <g transform="translate(120 216)">
          <circle r="11" fill={C.violet} stroke={C.gold} strokeWidth="1.8" />
          <g fill="none" stroke="#e0f2fe" strokeWidth="1.8" strokeLinecap="round">
            <path d="M-6.5 -0.5 Q0 -6.5 6.5 -0.5" />
            <path d="M-4 2.3 Q0 -1.2 4 2.3" />
          </g>
          <circle cy="5.2" r="1.6" fill="#e0f2fe" />
        </g>
        {/* cinto */}
        <rect x="80" y="234" width="80" height="12" rx="4" fill={C.accent} stroke={C.accentDark} strokeWidth="1.2" />
        <rect x="112" y="233" width="16" height="14" rx="3" fill={C.gold} stroke="#a16207" strokeWidth="1" />

        {/* pescoço, gola e as mechas da frente caindo nos ombros */}
        <path d="M110 128 L130 128 L131 148 L109 148 Z" fill={C.skinShade} />
        <ellipse cx="120" cy="148" rx="27" ry="8" fill={C.violet} stroke={C.gold} strokeWidth="2" />

        {/* braços (o da direita é o espelho do da esquerda) */}
        <g transform="translate(82 162)">
          <Arm angles={arms.left} />
        </g>
        <g transform="translate(158 162) scale(-1 1)">
          <Arm angles={arms.right} wave={arms.wave} />
        </g>

        {/* rosto */}
        <path d="M88 94 C88 66 102 52 120 52 C138 52 152 66 152 94 C152 118 139 135 120 137 C101 135 88 118 88 94 Z" fill={C.skin} />
        <path d="M140 64 C150 74 153 86 152 98 C151 116 142 130 128 135 C140 124 146 110 146 96 C146 82 144 72 140 64 Z" fill={C.skinShade} opacity="0.45" />
        <ellipse cx="99" cy="114" rx="6.5" ry="4" fill="#f472b6" opacity="0.3" />
        <ellipse cx="141" cy="114" rx="6.5" ry="4" fill="#f472b6" opacity="0.3" />
        <path d="M97 85 Q106 80.5 115 84 M125 84 Q134 80.5 143 85" stroke={C.hair} strokeWidth="2.8" fill="none" strokeLinecap="round" />
        <g className="cg-anim-blink">
          <Eye cx={106} cy={99} />
          <Eye cx={134} cy={99} />
        </g>
        <path d="M120 105 Q117.5 111 121 112.5" stroke={C.skinShade} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        {mouthOpen ? (
          <g>
            <path d="M110 120 Q120 133 130 120 Q120 123.5 110 120 Z" fill="#6b1d1d" />
            <path d="M112 120.6 Q120 123.3 128 120.6 L127 123 Q120 125.2 113 123 Z" fill="#fff" />
            <path d="M115 127.5 Q120 130.5 125 127.5 Q120 125.5 115 127.5 Z" fill="#f87171" />
          </g>
        ) : (
          <path d="M110 121 Q120 129 130 121" stroke="#7a2e1f" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        )}

        {/* cabelo da frente: o topo, a franja varrida pro lado e as mechas emoldurando o rosto */}
        <path d="M88 96 C84 62 100 42 121 42 C143 42 158 60 154 94 C150 80 142 66 130 58 C122 70 110 78 98 82 C94 86 90 90 88 96 Z" fill={`url(#${id}-hair)`} />
        <path d="M89 92 C85 120 87 152 93 182 C97 176 99 160 98 140 C97 120 95 104 92 94 Z" fill={C.hair} />
        <path d="M152 92 C156 120 154 152 148 182 C144 176 142 160 143 140 C144 120 146 104 149 94 Z" fill={C.hair} />
        <path d="M106 48 C112 45 120 44 128 46" stroke={C.hairLight} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M126 60 C118 70 108 76 98 80 M138 56 C146 64 150 76 151 88" stroke={C.hairLight} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.8" />

        {/* headset de rádio: arco, conchas e o microfone com a luzinha */}
        <path d="M86 92 C84 56 100 38 120 38 C140 38 156 56 154 92" stroke="#334155" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M86 92 C84 56 100 38 120 38 C140 38 156 56 154 92" stroke={C.accent} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <rect x="78" y="88" width="14" height="22" rx="6" fill="#475569" stroke="#1e293b" strokeWidth="1.4" />
        <rect x="148" y="88" width="14" height="22" rx="6" fill="#475569" stroke="#1e293b" strokeWidth="1.4" />
        <circle cx="85" cy="99" r="3.5" fill={C.accent} />
        <circle cx="155" cy="99" r="3.5" fill={C.accent} />
        <path d="M84 108 C86 122 96 130 107 129" stroke="#334155" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="108" cy="129" r="3.2" fill={C.cyan} className="cg-anim-glow" />

        {/* capacete de vidro (no espaço) */}
        {helmet && (
          <g>
            <circle cx="120" cy="94" r="66" fill={`url(#${id}-glass)`} stroke="#e2e8f0" strokeWidth="4.5" />
            <circle cx="120" cy="94" r="66" fill="none" stroke={C.violet} strokeWidth="1.5" opacity="0.6" />
            <path d="M74 70 C82 50 98 38 117 34" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.7" />
            <circle cx="160" cy="58" r="4" fill="#fff" opacity="0.6" />
          </g>
        )}
      </g>
    </svg>
  );
}
