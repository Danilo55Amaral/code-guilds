"use client";

import { useId } from "react";
import type { SubjectId } from "@/engine/subjects";

// ============================================================================
// OS TOMOS DA BIBLIOTECA DE MISSÕES — o desenho de cada matéria na tela de
// Missões: grimório (livro de capa de couro com cantoneiras douradas, o
// medalhão e a gema), pergaminho (enrolado em cima e embaixo nos bastões de
// madeira com as pontas brilhando, e o selo de cera) e papiro (a folha aberta
// com a ponta enrolada e as runas brilhando na borda). Cada matéria tem o seu
// emblema. O nome da matéria vai por cima, em HTML, na área marcada por
// TOME_LABEL (em % do desenho), pra quebrar a linha direitinho.
// ============================================================================

export type TomeId = SubjectId | "outras";
type TomeKind = "grimorio" | "pergaminho" | "papiro";

interface TomeStyle {
  kind: TomeKind;
  /** grimório: a capa; pergaminho: o selo de cera; papiro: a tinta das runas */
  color: string;
  dark: string;
  /** a cor do brilho em volta (e da barra de progresso) */
  glow: string;
}

export const TOME_STYLE: Record<TomeId, TomeStyle> = {
  ods: { kind: "pergaminho", color: "#16a34a", dark: "#14532d", glow: "#4ade80" },
  astronomia: { kind: "papiro", color: "#1d4ed8", dark: "#1e3a8a", glow: "#60a5fa" },
  programacao: { kind: "grimorio", color: "#6d28d9", dark: "#2e1065", glow: "#a78bfa" },
  scratch: { kind: "pergaminho", color: "#ea580c", dark: "#7c2d12", glow: "#fb923c" },
  roblox: { kind: "grimorio", color: "#b91c1c", dark: "#450a0a", glow: "#f87171" },
  informatica: { kind: "papiro", color: "#0f766e", dark: "#134e4a", glow: "#2dd4bf" },
  "app-inventor": { kind: "pergaminho", color: "#65a30d", dark: "#365314", glow: "#a3e635" },
  hardware: { kind: "grimorio", color: "#334155", dark: "#0f172a", glow: "#94a3b8" },
  outras: { kind: "grimorio", color: "#92400e", dark: "#431407", glow: "#fbbf24" },
};

/** Onde o nome da matéria fica em cima de cada tipo de tomo (em % do desenho) e a cor da letra. */
export const TOME_LABEL: Record<TomeKind, { left: string; right: string; top: string; bottom: string; ink: string; shadow: string }> = {
  grimorio: { left: "24%", right: "29%", top: "51.5%", bottom: "26.5%", ink: "#fde68a", shadow: "0 1px 0 #000, 0 0 10px rgba(0,0,0,0.8)" },
  pergaminho: { left: "22%", right: "22%", top: "49.5%", bottom: "31%", ink: "#3b1d0a", shadow: "0 1px 0 rgba(255,240,200,0.6)" },
  papiro: { left: "19%", right: "24%", top: "50.5%", bottom: "25.5%", ink: "#2b1606", shadow: "0 1px 0 rgba(255,240,200,0.6)" },
};

// ---------------------------------------------------------------------------
// Emblemas (cada um desenhado numa caixa de 40×40 centrada em 0, 0)
// ---------------------------------------------------------------------------

// As cores dos 17 Objetivos de Desenvolvimento Sustentável, na ordem.
const ODS_COLORS = ["#e5243b", "#dda63a", "#4c9f38", "#c5192d", "#ff3a21", "#26bde2", "#fcc30b", "#a21942", "#fd6925", "#dd1367", "#fd9d24", "#bf8b2e", "#3f7e44", "#0a97d9", "#56c02b", "#00689d", "#19486a"];

function arc(r1: number, r2: number, a1: number, a2: number): string {
  const p = (r: number, a: number) => `${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`;
  return `M${p(r2, a1)} A${r2} ${r2} 0 0 1 ${p(r2, a2)} L${p(r1, a2)} A${r1} ${r1} 0 0 0 ${p(r1, a1)} Z`;
}

function Emblem({ id }: { id: TomeId }) {
  switch (id) {
    case "ods":
      // a roda colorida dos 17 objetivos
      return (
        <g>
          {ODS_COLORS.map((c, i) => {
            const a1 = -Math.PI / 2 + (i * 2 * Math.PI) / 17;
            const a2 = a1 + (2 * Math.PI) / 17 - 0.03;
            return <path key={i} d={arc(9, 18, a1, a2)} fill={c} />;
          })}
          <circle r="8" fill="#f8fafc" />
          <path d="M-4 0 C-4 -3 -1 -4.5 0 -4.5 C3 -4.5 4.5 -2 4.5 0 C4.5 3 2 4.5 0 4.5" stroke="#16a34a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M-1.5 -1 L1 -3.5 L1.8 0" fill="#16a34a" />
        </g>
      );
    case "astronomia":
      // a lua crescente, a estrela e o anel de Saturno
      return (
        <g>
          <circle r="17" fill="#0b1437" stroke="#fde68a" strokeWidth="1.5" />
          <circle cx="-3" cy="-1" r="9" fill="#fde68a" />
          <circle cx="1" cy="-4" r="8" fill="#0b1437" />
          <path d="M8 2 L9.5 6 L13.5 7.5 L9.5 9 L8 13 L6.5 9 L2.5 7.5 L6.5 6 Z" fill="#fef9c3" />
          <circle cx="9" cy="-8" r="1" fill="#fff" />
          <circle cx="-9" cy="9" r="0.9" fill="#fff" />
        </g>
      );
    case "programacao":
      return (
        <g>
          <circle r="17" fill="#1e1b4b" stroke="#fbbf24" strokeWidth="1.5" />
          <text y="5.5" textAnchor="middle" fontSize="15" fontWeight="900" fontFamily="monospace" fill="#fde68a">
            {"</>"}
          </text>
        </g>
      );
    case "scratch":
      // um bloco de encaixar laranja, com o dentinho em cima e embaixo
      return (
        <g transform="rotate(-8)">
          <path d="M-15 -9 L-7 -9 L-5 -6 L1 -6 L3 -9 L15 -9 Q17 -9 17 -7 L17 7 Q17 9 15 9 L3 9 L1 12 L-5 12 L-7 9 L-15 9 Q-17 9 -17 7 L-17 -7 Q-17 -9 -15 -9 Z" fill="#f59e0b" stroke="#9a3412" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M-12 -2 L12 -2 M-12 3 L4 3" stroke="#fff7ed" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
        </g>
      );
    case "roblox":
      // um cubo de construir, com os pininhos em cima
      return (
        <g>
          <path d="M0 -15 L15 -7 L0 1 L-15 -7 Z" fill="#f87171" stroke="#450a0a" strokeWidth="1" strokeLinejoin="round" />
          <path d="M-15 -7 L0 1 L0 17 L-15 9 Z" fill="#b91c1c" stroke="#450a0a" strokeWidth="1" strokeLinejoin="round" />
          <path d="M15 -7 L0 1 L0 17 L15 9 Z" fill="#dc2626" stroke="#450a0a" strokeWidth="1" strokeLinejoin="round" />
          {[
            [0, -10],
            [-6, -7],
            [6, -7],
            [0, -4],
          ].map(([x, y]) => (
            <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="2.6" ry="1.4" fill="#fecaca" stroke="#7f1d1d" strokeWidth="0.6" />
          ))}
        </g>
      );
    case "informatica":
      // o monitor com uma janelinha e o cursor
      return (
        <g>
          <rect x="-17" y="-14" width="34" height="23" rx="2.5" fill="#134e4a" stroke="#0f172a" strokeWidth="1.2" />
          <rect x="-14" y="-11" width="28" height="17" rx="1" fill="#99f6e4" />
          <rect x="-11" y="-8" width="14" height="9" rx="1" fill="#f8fafc" stroke="#0f766e" strokeWidth="0.8" />
          <path d="M-11 -6 L3 -6" stroke="#0f766e" strokeWidth="1.2" />
          <path d="M6 0 L6 6 L7.5 4.5 L9 7.5 L10 7 L8.5 4 L10.5 4 Z" fill="#0f172a" />
          <path d="M-4 9 L4 9 L6 15 L-6 15 Z" fill="#334155" />
        </g>
      );
    case "app-inventor":
      // o celular com os aplicativos coloridos
      return (
        <g>
          <rect x="-11" y="-18" width="22" height="36" rx="4" fill="#1e293b" stroke="#0f172a" strokeWidth="1.2" />
          <rect x="-8.5" y="-14" width="17" height="25" rx="1.5" fill="#ecfccb" />
          {["#ef4444", "#3b82f6", "#f59e0b", "#22c55e", "#a855f7", "#06b6d4"].map((c, i) => (
            <rect key={c} x={-7 + (i % 2) * 8} y={-12.5 + Math.floor(i / 2) * 7.5} width="6" height="6" rx="1.5" fill={c} />
          ))}
          <circle cy="14.8" r="1.6" fill="#64748b" />
        </g>
      );
    case "hardware":
      // o chip com as perninhas dos quatro lados
      return (
        <g>
          {[-9, -3, 3, 9].map((v) => (
            <g key={v} stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round">
              <path d={`M${v} -17 L${v} -12 M${v} 12 L${v} 17 M-17 ${v} L-12 ${v} M12 ${v} L17 ${v}`} />
            </g>
          ))}
          <rect x="-12" y="-12" width="24" height="24" rx="2.5" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.2" />
          <rect x="-6.5" y="-6.5" width="13" height="13" rx="1.5" fill="#22d3ee" opacity="0.85" />
          <path d="M-3 -3 L3 -3 L3 3 L-3 3 Z" fill="#ecfeff" />
          <circle cx="-8.5" cy="-8.5" r="1.1" fill="#94a3b8" />
        </g>
      );
    case "outras":
    default:
      // a pena de escrever
      return (
        <g transform="rotate(30)">
          <path d="M0 -18 C8 -12 8 4 1 14 L-1 14 C-8 4 -8 -12 0 -18 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
          <path d="M0 -15 L0 18" stroke="#78350f" strokeWidth="1.4" />
          <path d="M0 -8 L5 -11 M0 -2 L5.5 -5 M0 4 L5 1 M0 -8 L-5 -11 M0 -2 L-5.5 -5 M0 4 L-5 1" stroke="#cbd5e1" strokeWidth="0.8" />
        </g>
      );
  }
}

// ---------------------------------------------------------------------------
// Os três tipos de tomo (desenho de 200×250)
// ---------------------------------------------------------------------------

function Grimoire({ id, style, uid }: { id: TomeId; style: TomeStyle; uid: string }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-cover`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={style.color} />
          <stop offset="1" stopColor={style.dark} />
        </linearGradient>
        <linearGradient id={`${uid}-gold`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="240" rx="72" ry="7" fill="#000" opacity="0.45" />
      {/* as folhas aparecendo do lado e embaixo */}
      <path d="M150 24 L168 32 L168 236 L150 230 Z" fill="#f3e2b8" stroke="#a16207" strokeWidth="1" />
      <path d="M154 40 L164 44 M154 80 L164 84 M154 120 L164 124 M154 160 L164 164 M154 200 L164 204" stroke="#c9a46a" strokeWidth="0.8" />
      <path d="M34 230 L150 230 L168 236 L52 238 Z" fill="#e8d3a3" stroke="#a16207" strokeWidth="1" />
      {/* a capa */}
      <rect x="30" y="16" width="124" height="216" rx="8" fill={`url(#${uid}-cover)`} stroke="#0b0b10" strokeWidth="2" />
      <path d="M36 22 C70 18 120 18 148 24" stroke="#fff" strokeWidth="3" opacity="0.12" fill="none" strokeLinecap="round" />
      {/* a lombada com as faixas douradas */}
      <rect x="30" y="16" width="18" height="216" rx="6" fill={style.dark} opacity="0.75" />
      {[40, 64, 184, 208].map((y) => (
        <rect key={y} x="30" y={y} width="18" height="4" fill={`url(#${uid}-gold)`} />
      ))}
      {/* a moldura dourada e as cantoneiras */}
      <rect x="56" y="28" width="88" height="192" rx="5" fill="none" stroke={`url(#${uid}-gold)`} strokeWidth="1.5" opacity="0.85" />
      {[
        [154, 16, -1, 1],
        [154, 232, -1, -1],
        [48, 16, 1, 1],
        [48, 232, 1, -1],
      ].map(([x, y, sx, sy]) => (
        <path key={`${x}-${y}`} d={`M${x} ${y} L${x + sx * 18} ${y} L${x} ${y + sy * 18} Z`} fill={`url(#${uid}-gold)`} stroke="#78350f" strokeWidth="0.8" />
      ))}
      {/* o medalhão com o emblema da matéria */}
      <circle cx="100" cy="90" r="36" fill={style.glow} opacity="0.18" className="cg-anim-glow" />
      <circle cx="100" cy="90" r="30" fill="#0b0b10" opacity="0.55" stroke={`url(#${uid}-gold)`} strokeWidth="3" />
      <g transform="translate(100 90) scale(1.25)">
        <Emblem id={id} />
      </g>
      {/* a plaquinha do nome */}
      <rect x="46" y="128" width="98" height="56" rx="6" fill="#000" opacity="0.3" stroke={`url(#${uid}-gold)`} strokeWidth="0.8" />
      {/* a gema de baixo, com o brilho piscando */}
      <path d="M100 194 L109 204 L100 214 L91 204 Z" fill={style.glow} stroke="#78350f" strokeWidth="1" />
      <path d="M100 196 L104 202 L100 204 Z" fill="#fff" opacity="0.7" className="cg-anim-twinkle" />
    </g>
  );
}

function Scroll({ id, style, uid }: { id: TomeId; style: TomeStyle; uid: string }) {
  const rod = (y: number) => (
    <g>
      <rect x="18" y={y} width="164" height="14" rx="7" fill={`url(#${uid}-wood)`} stroke="#3b1d0a" strokeWidth="1" />
      {[18, 182].map((x) => (
        <g key={x}>
          <circle cx={x} cy={y + 7} r="10" fill={style.glow} opacity="0.35" className="cg-anim-glow" />
          <circle cx={x} cy={y + 7} r="6" fill={style.glow} stroke="#3b1d0a" strokeWidth="1" />
          <circle cx={x - 1.5} cy={y + 5.5} r="1.8" fill="#fff" opacity="0.7" />
        </g>
      ))}
    </g>
  );
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-paper`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbf0d0" />
          <stop offset="0.6" stopColor="#f0d9a4" />
          <stop offset="1" stopColor="#d9b678" />
        </linearGradient>
        <linearGradient id={`${uid}-roll`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e7c98d" />
          <stop offset="0.5" stopColor="#fbefcf" />
          <stop offset="1" stopColor="#c9a464" />
        </linearGradient>
        <linearGradient id={`${uid}-wood`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a16207" />
          <stop offset="0.5" stopColor="#78350f" />
          <stop offset="1" stopColor="#451a03" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="242" rx="74" ry="6" fill="#000" opacity="0.45" />
      {/* a folha, com a borda gasta */}
      <path
        d="M36 34 C60 38 140 30 164 36 C160 70 168 110 162 150 C158 180 166 200 164 216 C130 210 70 220 36 214 C40 180 32 150 38 110 C42 80 34 60 36 34 Z"
        fill={`url(#${uid}-paper)`}
        stroke="#a87d3f"
        strokeWidth="1.4"
      />
      <path d="M48 52 C80 48 120 50 152 50 M46 202 C80 198 120 204 152 200" stroke="#c9a464" strokeWidth="1" opacity="0.7" fill="none" />
      {/* os rolos em cima e embaixo */}
      <rect x="28" y="22" width="144" height="22" rx="11" fill={`url(#${uid}-roll)`} stroke="#a87d3f" strokeWidth="1.2" />
      <rect x="28" y="206" width="144" height="22" rx="11" fill={`url(#${uid}-roll)`} stroke="#a87d3f" strokeWidth="1.2" />
      {rod(26)}
      {rod(210)}
      {/* o emblema desenhado na folha */}
      <circle cx="100" cy="88" r="28" fill={style.glow} opacity="0.16" className="cg-anim-glow" />
      <g transform="translate(100 88) scale(1.2)">
        <Emblem id={id} />
      </g>
      <path d="M62 120 L138 120" stroke="#a87d3f" strokeWidth="1" opacity="0.6" />
      {/* o selo de cera com a fita */}
      <path d="M146 176 L140 200 L146 196 L150 202 Z M156 176 L162 200 L156 196 L152 202 Z" fill={style.dark} />
      <circle cx="151" cy="176" r="11" fill={style.color} stroke={style.dark} strokeWidth="1.5" />
      <circle cx="151" cy="176" r="7" fill="none" stroke={style.dark} strokeWidth="1" opacity="0.7" />
      <path d="M147 173 L151 179 L155 173" stroke="#fff" strokeWidth="1.3" fill="none" opacity="0.6" strokeLinecap="round" />
    </g>
  );
}

// Estrelas e linhas do mapa do céu no papiro da Astronomia: [x, y]
const STAR_MAP: [number, number][] = [
  [52, 150],
  [66, 140],
  [80, 148],
  [92, 136],
  [130, 152],
  [144, 140],
  [150, 160],
  [60, 196],
  [74, 206],
  [140, 196],
];

function Papyrus({ id, style, uid }: { id: TomeId; style: TomeStyle; uid: string }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-paper`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6e7c1" />
          <stop offset="0.55" stopColor="#e8cd92" />
          <stop offset="1" stopColor="#c9a061" />
        </linearGradient>
        <linearGradient id={`${uid}-roll`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9a464" />
          <stop offset="0.5" stopColor="#fbefcf" />
          <stop offset="1" stopColor="#b8904f" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="242" rx="76" ry="6" fill="#000" opacity="0.45" />
      <g transform="rotate(-4 100 125)">
        {/* a folha aberta, com o canto de baixo rasgado */}
        <path
          d="M26 30 C60 26 120 24 156 28 L160 222 C126 226 70 226 40 230 L34 214 L28 220 Z"
          fill={`url(#${uid}-paper)`}
          stroke="#a87d3f"
          strokeWidth="1.4"
        />
        {/* o desenho de fundo: o mapa do céu (Astronomia) ou trilhas de circuito (o resto) */}
        {id === "astronomia" ? (
          <g opacity="0.45">
            <path d="M52 150 L66 140 L80 148 L92 136 M130 152 L144 140 L150 160 M60 196 L74 206" stroke={style.dark} strokeWidth="0.8" strokeDasharray="2 2" fill="none" />
            {STAR_MAP.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2 : 1.3} fill={style.dark} className="cg-anim-twinkle" style={{ animationDelay: `${i * 0.3}s` }} />
            ))}
          </g>
        ) : (
          <path d="M44 150 L64 150 L70 144 L90 144 M44 200 L60 200 L66 194 M140 150 L120 150 L114 156 L96 156 M140 204 L126 204 L120 198" stroke={style.dark} strokeWidth="1" fill="none" opacity="0.25" />
        )}
        {/* as runas brilhando na borda */}
        <path
          d="M34 38 L150 36 L153 214 L46 220"
          fill="none"
          stroke={style.glow}
          strokeWidth="1.6"
          strokeDasharray="10 6 2 6"
          opacity="0.85"
          className="cg-anim-aura-flow"
          style={{ "--cg-dur": "2.4s", filter: `drop-shadow(0 0 3px ${style.glow})` } as React.CSSProperties}
        />
        {/* o círculo mágico com o emblema */}
        <circle cx="92" cy="86" r="34" fill="none" stroke={style.glow} strokeWidth="1.2" strokeDasharray="3 4" opacity="0.8" className="cg-anim-aura-flow" style={{ "--cg-dur": "3s" } as React.CSSProperties} />
        <circle cx="92" cy="86" r="28" fill={style.glow} opacity="0.16" className="cg-anim-glow" />
        <g transform="translate(92 86) scale(1.2)">
          <Emblem id={id} />
        </g>
        {/* a ponta da direita enrolada */}
        <path d="M156 28 C170 28 176 36 172 44 L176 214 C178 224 170 228 160 222 Z" fill={`url(#${uid}-roll)`} stroke="#a87d3f" strokeWidth="1.2" />
        <path d="M162 34 C168 36 170 40 168 44 L170 210" stroke="#8a6331" strokeWidth="1" fill="none" opacity="0.6" />
      </g>
    </g>
  );
}

/** O tomo de uma matéria (desenho de 200×250, cresce com a classe que receber). */
export default function SubjectTome({ id, className = "" }: { id: TomeId; className?: string }) {
  const uid = `tm${useId().replace(/:/g, "")}`;
  const style = TOME_STYLE[id];
  return (
    <svg viewBox="0 0 200 250" className={`overflow-visible ${className}`} aria-hidden="true">
      {style.kind === "grimorio" && <Grimoire id={id} style={style} uid={uid} />}
      {style.kind === "pergaminho" && <Scroll id={id} style={style} uid={uid} />}
      {style.kind === "papiro" && <Papyrus id={id} style={style} uid={uid} />}
    </svg>
  );
}
