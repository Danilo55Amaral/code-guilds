"use client";

import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T, Table, useUid } from "../BookParts";
import type { BookPage } from "../types";

// ============================================================================
// CAPÍTULO 7 — ECOLOGIA E CADEIAS ALIMENTARES (missão "Biologia: Ecologia e
// Cadeias Alimentares"): a paisagem viva, os níveis da ecologia, a cadeia
// alimentar com a energia correndo pelas setas, a pirâmide de energia
// perdendo calor em cada degrau, as relações entre os seres vivos, os seis
// biomas do Brasil e o efeito estufa, com o calor preso pelos gases.
// ============================================================================

function Tree({ x, y, s = 1, color = "#16a34a" }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-4" y="-30" width="8" height="30" fill="#78350f" />
      <g className="cg-anim-sway" style={{ animationDuration: "5s" }}>
        <circle cx="0" cy="-44" r="20" fill={color} stroke="#14532d" strokeWidth="1.5" />
        <circle cx="-12" cy="-34" r="12" fill={color} stroke="#14532d" strokeWidth="1.5" />
        <circle cx="12" cy="-34" r="12" fill={color} stroke="#14532d" strokeWidth="1.5" />
      </g>
    </g>
  );
}

function Cloud({ x, y, dur = 30 }: { x: number; y: number; dur?: number }) {
  return (
    <g>
      <animateTransform attributeName="transform" type="translate" values="-40 0;40 0;-40 0" dur={`${dur}s`} repeatCount="indefinite" />
      <path d={`M${x} ${y} c0 -12 16 -18 26 -8 c6 -14 30 -12 32 4 c12 0 14 16 2 18 l-56 0 c-12 0 -14 -12 -4 -14 Z`} fill="#fff" stroke="#bae6fd" strokeWidth="2" />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Abertura: a paisagem viva
// ---------------------------------------------------------------------------

function EcosystemArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma paisagem com sol, nuvens, árvores, um rio correndo, aves voando e animais">
      <rect x="0" y="0" width="460" height="300" fill="#e0f2fe" />
      <circle cx="390" cy="56" r="28" fill="#fde047" className="cg-anim-glow" />
      <Cloud x={60} y={60} />
      <Cloud x={250} y={44} dur={40} />
      <path d="M0 170 C80 120 160 150 230 130 C300 110 380 140 460 120 L460 300 L0 300 Z" fill="#86efac" />
      <path d="M0 210 C100 180 200 220 300 196 C360 184 420 200 460 190 L460 300 L0 300 Z" fill="#4ade80" />
      {/* o rio */}
      <path d="M150 300 C170 260 230 250 260 230 C290 210 330 214 380 200" stroke="#38bdf8" strokeWidth="26" fill="none" strokeLinecap="round" />
      <path d="M150 300 C170 260 230 250 260 230 C290 210 330 214 380 200" stroke="#e0f2fe" strokeWidth="2.5" fill="none" strokeDasharray="10 10" className="cg-anim-dash" />
      {/* um peixe pulando */}
      <g>
        <animateMotion path="M250 240 Q262 206 276 234" dur="2.4s" repeatCount="indefinite" rotate="auto" />
        <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.05;0.4;0.45;1" dur="2.4s" repeatCount="indefinite" />
        <path d="M-8 0 C-4 -5 4 -5 8 0 C4 5 -4 5 -8 0 Z M-8 0 L-13 -4 L-13 4 Z" fill="#fb923c" stroke="#9a3412" strokeWidth="1" />
      </g>
      <Tree x={60} y={200} s={1.2} />
      <Tree x={110} y={190} s={0.9} color="#22c55e" />
      <Tree x={420} y={180} s={1.1} />
      <Tree x={340} y={150} s={0.7} color="#22c55e" />
      {/* ipê amarelo */}
      <Tree x={200} y={150} s={0.8} color="#facc15" />
      {/* aves voando */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <animateMotion path={`M-20 ${90 + i * 16} C120 ${60 + i * 10} 260 ${110 - i * 6} 480 ${70 + i * 8}`} dur={`${10 + i * 2}s`} begin={`${-i * 3}s`} repeatCount="indefinite" />
          <path d="M-8 0 Q-4 -6 0 0 Q4 -6 8 0" stroke="#1e293b" strokeWidth="2" fill="none">
            <animate attributeName="d" values="M-8 0 Q-4 -6 0 0 Q4 -6 8 0;M-8 0 Q-4 4 0 0 Q4 4 8 0;M-8 0 Q-4 -6 0 0 Q4 -6 8 0" dur="0.5s" repeatCount="indefinite" />
          </path>
        </g>
      ))}
      {/* flores no chão */}
      {[30, 300, 440, 120].map((x, i) => (
        <g key={x} transform={`translate(${x} ${262 - (i % 2) * 20})`}>
          <g className="cg-anim-sway" style={{ animationDelay: `${i * 0.5}s` }}>
            <path d="M0 0 L0 -14" stroke="#15803d" strokeWidth="2" />
            <circle cx="0" cy="-16" r="4.5" fill={["#f472b6", "#f59e0b", "#a855f7", "#ef4444"][i]} />
          </g>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os níveis da ecologia: indivíduo → população → comunidade → ecossistema → biosfera
// ---------------------------------------------------------------------------

function EcoLevelsArt() {
  const names = ["Indivíduo", "População", "Comunidade", "Ecossistema", "Biosfera"];
  return (
    <Art viewBox="0 0 600 150" label="Os níveis da ecologia: indivíduo, população, comunidade, ecossistema e biosfera">
      {names.map((n, i) => {
        const x = 60 + i * 120;
        return (
          <g key={n} className="cg-anim-pop" style={{ animationDelay: `${i * 0.3}s` }}>
            <circle cx={x} cy="62" r="48" fill={["#fef3c7", "#fde68a", "#d9f99d", "#bbf7d0", "#bae6fd"][i]} stroke="#b08a52" strokeWidth="2" />
            {i === 0 && <circle cx={x} cy="62" r="9" fill="#a16207" />}
            {i === 1 && [-16, 0, 16, -8, 8].map((dx, k) => <circle key={k} cx={x + dx} cy={62 + (k > 2 ? 14 : -4)} r="7" fill="#a16207" />)}
            {i >= 2 && (
              <g>
                {i >= 3 && <rect x={x - 40} y="80" width="80" height="12" rx="4" fill="#38bdf8" opacity="0.7" />}
                {i >= 3 && <circle cx={x + 26} cy="30" r="8" fill="#fbbf24" />}
                <circle cx={x - 18} cy="58" r="6" fill="#a16207" />
                <circle cx={x - 6} cy="66" r="6" fill="#a16207" />
                <path d={`M${x + 4} 74 l0 -16 l8 0 l-4 -8 l-4 8`} fill="#16a34a" stroke="#14532d" strokeWidth="1" />
                <circle cx={x + 20} cy="66" r="5" fill="#1d4ed8" />
                <circle cx={x + 10} cy="50" r="4" fill="#f472b6" />
              </g>
            )}
            {i === 4 && <circle cx={x} cy="62" r="40" fill="none" stroke="#2563eb" strokeWidth="3" strokeDasharray="6 4" className="cg-anim-spin-slow" style={{ transformOrigin: `${x}px 62px`, transformBox: "view-box" }} />}
            <text x={x} y="132" textAnchor="middle" fontSize="13.5" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
              {n}
            </text>
          </g>
        );
      })}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A cadeia alimentar com a energia correndo pelas setas
// ---------------------------------------------------------------------------

function FoodChainArt() {
  const roles = ["Produtor", "Consumidor primário", "Consumidor secundário", "Consumidor terciário"];
  const xs = [70, 200, 330, 460];
  return (
    <Art viewBox="0 0 540 250" label="Cadeia alimentar: capim, gafanhoto, sapo e cobra, com a energia do Sol passando de um para o outro e os decompositores">
      {/* o sol dando energia ao capim */}
      <circle cx="40" cy="30" r="18" fill="#fbbf24" className="cg-anim-glow" />
      <path d="M52 44 L66 70" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" className="cg-anim-dash" />
      {/* capim */}
      <g transform="translate(70 120)">
        <g className="cg-anim-sway">
          {[-16, -8, 0, 8, 16].map((x, i) => (
            <path key={x} d={`M${x} 30 C${x - 4} 10 ${x + (i % 2 ? 6 : -6)} -10 ${x + (i % 2 ? 10 : -10)} -30`} stroke="#16a34a" strokeWidth="4" fill="none" strokeLinecap="round" />
          ))}
        </g>
      </g>
      {/* gafanhoto */}
      <g transform="translate(200 128)">
        <g className="cg-anim-hop" style={{ animationDuration: "2s" }}>
          <ellipse cx="0" cy="0" rx="22" ry="8" fill="#84cc16" stroke="#3f6212" strokeWidth="1.5" />
          <circle cx="22" cy="-3" r="7" fill="#84cc16" stroke="#3f6212" strokeWidth="1.5" />
          <circle cx="24" cy="-5" r="1.8" fill="#1c1917" />
          <path d="M4 -4 L-10 -20 L-24 8 M-2 6 L-6 16 M8 6 L12 16" stroke="#3f6212" strokeWidth="2.5" fill="none" />
          <path d="M26 -8 C34 -20 40 -22 46 -20" stroke="#3f6212" strokeWidth="1.2" fill="none" />
        </g>
      </g>
      {/* sapo */}
      <g transform="translate(330 128)">
        <ellipse cx="0" cy="4" rx="22" ry="15" fill="#4ade80" stroke="#15803d" strokeWidth="2" />
        <circle cx="-10" cy="-10" r="7" fill="#4ade80" stroke="#15803d" strokeWidth="2" />
        <circle cx="10" cy="-10" r="7" fill="#4ade80" stroke="#15803d" strokeWidth="2" />
        <circle cx="-10" cy="-10" r="3" fill="#0f172a" />
        <circle cx="10" cy="-10" r="3" fill="#0f172a" />
        <path d="M-8 2 Q0 8 8 2" stroke="#15803d" strokeWidth="1.5" fill="none" />
        <path d="M0 4 L0 4" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d" values="M0 4 L0 4;M0 4 L-40 2;M0 4 L0 4;M0 4 L0 4" keyTimes="0;0.1;0.2;1" dur="3s" repeatCount="indefinite" />
        </path>
      </g>
      {/* cobra */}
      <g transform="translate(460 130)">
        <path d="M-40 10 C-30 -6 -14 22 0 6 C12 -8 24 16 34 -2" stroke="#a16207" strokeWidth="11" fill="none" strokeLinecap="round">
          <animate attributeName="d" values="M-40 10 C-30 -6 -14 22 0 6 C12 -8 24 16 34 -2;M-40 6 C-30 20 -14 -6 0 10 C12 22 24 -6 34 -2;M-40 10 C-30 -6 -14 22 0 6 C12 -8 24 16 34 -2" dur="2.4s" repeatCount="indefinite" />
        </path>
        <ellipse cx="38" cy="-4" rx="10" ry="7" fill="#a16207" stroke="#57300c" strokeWidth="1.5" />
        <circle cx="41" cy="-7" r="1.8" fill="#1c1917" />
      </g>
      {/* as setas: a energia passando de um para o outro */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <path d={`M${xs[i] + 34} 126 L${xs[i + 1] - 36} 126`} stroke="#b45309" strokeWidth="4" strokeDasharray="8 6" className="cg-anim-dash" />
          <path d={`M${xs[i + 1] - 44} 118 L${xs[i + 1] - 34} 126 L${xs[i + 1] - 44} 134`} stroke="#b45309" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      ))}
      {roles.map((r, i) => {
        const [first, ...rest] = r.split(" ");
        return (
          <text key={r} x={xs[i]} y="172" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
            {first}
            {rest.length > 0 && (
              <tspan x={xs[i]} dy="14">
                {rest.join(" ")}
              </tspan>
            )}
          </text>
        );
      })}
      {/* os decompositores embaixo, recebendo de todos */}
      <rect x="120" y="200" width="300" height="40" rx="12" fill="#f5e6c8" stroke="#a16207" strokeWidth="2" />
      <g transform="translate(150 222)">
        <path d="M-10 6 L-10 -2 C-14 -2 -16 -10 -8 -12 C-2 -14 4 -10 2 -4 C-2 -4 -6 -2 -6 6 Z" fill="#fca5a5" stroke="#991b1b" strokeWidth="1.2" />
      </g>
      <text x="280" y="225" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#78350f" fontFamily="Georgia, serif">
        Decompositores (fungos e bactérias)
      </text>
      {xs.map((x) => (
        <path key={x} d={`M${x} 190 L${Math.min(Math.max(x, 140), 400)} 200`} stroke="#a16207" strokeWidth="1.5" strokeDasharray="4 3" />
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A pirâmide de energia: em cada degrau, uns 90% se perdem como calor
// ---------------------------------------------------------------------------

function PyramidArt() {
  const levels = [
    { name: "Produtores", pct: "100%", color: "#86efac" },
    { name: "Consumidores primários", pct: "10%", color: "#fde047" },
    { name: "Consumidores secundários", pct: "1%", color: "#fdba74" },
    { name: "Consumidores terciários", pct: "0,1%", color: "#fca5a5" },
  ];
  return (
    <Art viewBox="0 0 540 230" label="A pirâmide de energia: a cada nível só cerca de 10% da energia passa adiante, o resto se perde como calor">
      {levels.map((l, i) => {
        const w = 360 - i * 80;
        const y = 180 - i * 44;
        return (
          <g key={l.name}>
            <rect x={200 - w / 2} y={y} width={w} height="40" rx="6" fill={l.color} stroke="#7c6a48" strokeWidth="2" />
            <text x="200" y={y + 25} textAnchor="middle" fontSize="12" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
              {l.pct}
            </text>
            <text x="400" y={y + 25} fontSize="12" fontWeight="700" fill="#3b2a14" fontFamily="Georgia, serif">
              {l.name}
            </text>
            {/* o calor indo embora */}
            {[0, 1].map((k) => (
              <path
                key={k}
                d={`M${200 - w / 2 - 12} ${y + 18} q-6 -6 0 -12 q6 -6 0 -12`}
                stroke="#ef4444"
                strokeWidth="2.5"
                fill="none"
                className="cg-anim-aura-rise"
                style={{ "--cg-dur": "2.4s", "--cg-delay": `${i * 0.4 + k * 1.2}s` } as React.CSSProperties}
              />
            ))}
          </g>
        );
      })}
      <text x="20" y="24" fontSize="12" fontWeight="700" fill="#b91c1c" fontFamily="Georgia, serif">
        ~ calor perdido
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As relações entre os seres vivos
// ---------------------------------------------------------------------------

function RelationsArt() {
  return (
    <Art viewBox="0 0 560 160" label="Mutualismo: abelha e flor. Parasitismo: carrapato no cachorro. Predatismo: coruja e rato. Competição: dois animais pela mesma comida">
      {/* mutualismo: abelha e flor */}
      <g transform="translate(70 70)">
        <circle r="56" fill="#ecfccb" />
        <path d="M0 50 L0 10" stroke="#16a34a" strokeWidth="4" />
        {Array.from({ length: 6 }, (_, i) => (
          <ellipse key={i} cx="0" cy="-10" rx="7" ry="11" fill="#f9a8d4" transform={`translate(0 6) rotate(${i * 60})`} />
        ))}
        <circle cx="0" cy="6" r="7" fill="#facc15" />
        <g>
          <animateMotion path="M-30 -30 C0 -50 30 -30 20 -6 C10 10 -20 0 -30 -30 Z" dur="4s" repeatCount="indefinite" />
          <ellipse rx="8" ry="5" fill="#facc15" stroke="#1c1917" strokeWidth="1.2" />
          <path d="M-2 -5 L-2 5 M2 -5 L2 5" stroke="#1c1917" strokeWidth="1.8" />
          <ellipse cx="0" cy="-7" rx="5" ry="3.5" fill="#e0f2fe" className="cg-anim-flap" style={{ animationDuration: "0.1s" }} />
        </g>
      </g>
      {/* parasitismo: carrapato no cachorro */}
      <g transform="translate(210 70)">
        <circle r="56" fill="#fee2e2" />
        <path d="M-34 10 C-34 -10 20 -14 26 4 L30 24 L-30 24 Z" fill="#d6a756" stroke="#78350f" strokeWidth="1.5" />
        <circle cx="30" cy="-6" r="13" fill="#d6a756" stroke="#78350f" strokeWidth="1.5" />
        <path d="M24 -16 L18 -28 L30 -18" fill="#92400e" />
        <circle cx="34" cy="-8" r="2" fill="#1c1917" />
        <circle cx="42" cy="-2" r="3" fill="#1c1917" />
        <g className="cg-anim-glow">
          <ellipse cx="-6" cy="0" rx="6" ry="5" fill="#57534e" stroke="#1c1917" strokeWidth="1" />
          <path d="M-12 -2 l-4 -3 M-12 2 l-4 3 M0 -2 l4 -3 M0 2 l4 3" stroke="#1c1917" strokeWidth="1" />
        </g>
      </g>
      {/* predatismo: coruja e rato */}
      <g transform="translate(350 70)">
        <circle r="56" fill="#e0e7ff" />
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 -20;0 -4;0 -20" dur="2.6s" repeatCount="indefinite" />
          <ellipse cx="0" cy="-8" rx="16" ry="20" fill="#a16207" stroke="#57300c" strokeWidth="1.5" />
          <circle cx="-6" cy="-14" r="5" fill="#fef3c7" />
          <circle cx="6" cy="-14" r="5" fill="#fef3c7" />
          <circle cx="-6" cy="-14" r="2.2" fill="#1c1917" />
          <circle cx="6" cy="-14" r="2.2" fill="#1c1917" />
          <path d="M-2 -8 L0 -4 L2 -8 Z" fill="#f59e0b" />
        </g>
        <g transform="translate(0 34)">
          <ellipse rx="12" ry="6" fill="#94a3b8" stroke="#475569" strokeWidth="1.2" />
          <circle cx="12" cy="-2" r="4" fill="#94a3b8" />
          <path d="M-12 0 C-20 -2 -24 6 -30 2" stroke="#475569" strokeWidth="1.2" fill="none" />
        </g>
      </g>
      {/* competição: dois pássaros pelo mesmo fruto */}
      <g transform="translate(490 70)">
        <circle r="56" fill="#fef3c7" />
        <circle cx="0" cy="10" r="7" fill="#ef4444" />
        {[-1, 1].map((s) => (
          <g key={s}>
            <animateTransform attributeName="transform" type="translate" values={`${s * 24} 6;${s * 16} 6;${s * 24} 6`} dur="1.2s" repeatCount="indefinite" />
            <g transform={`scale(${s} 1)`}>
              <ellipse rx="12" ry="8" fill="#60a5fa" stroke="#1e3a8a" strokeWidth="1.2" />
              <circle cx="-10" cy="-6" r="6" fill="#60a5fa" stroke="#1e3a8a" strokeWidth="1.2" />
              <path d="M-16 -6 L-22 -4 L-16 -2 Z" fill="#f59e0b" />
            </g>
          </g>
        ))}
      </g>
      {["Mutualismo (+ +)", "Parasitismo (+ −)", "Predatismo (+ −)", "Competição (− −)"].map((t, i) => (
        <text key={t} x={70 + i * 140} y="150" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
          {t}
        </text>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os seis biomas do Brasil, cada um num quadrinho
// ---------------------------------------------------------------------------

function BiomesArt() {
  const u = useUid("bio");
  const tile = (i: number, name: string, sky: string, ground: string, body: React.ReactNode) => {
    const x = (i % 3) * 180;
    const y = Math.floor(i / 3) * 130;
    return (
      <g key={name} transform={`translate(${x + 4} ${y + 4})`}>
        <clipPath id={`${u}-${i}`}>
          <rect width="172" height="122" rx="12" />
        </clipPath>
        <g clipPath={`url(#${u}-${i})`}>
          <rect width="172" height="122" fill={sky} />
          <rect y="80" width="172" height="42" fill={ground} />
          {body}
          <rect y="98" width="172" height="24" fill="#000" opacity="0.35" />
          <text x="86" y="115" textAnchor="middle" fontSize="13.5" fontWeight="900" fill="#fff" fontFamily="Georgia, serif">
            {name}
          </text>
        </g>
        <rect width="172" height="122" rx="12" fill="none" stroke="#7c6a48" strokeWidth="2" />
      </g>
    );
  };
  const cactus = (cx: number, h: number) => (
    <g key={cx} className="cg-anim-sway" style={{ animationDuration: "8s" }}>
      <rect x={cx - 5} y={84 - h} width="10" height={h} rx="5" fill="#65a30d" stroke="#365314" strokeWidth="1.2" />
      <path d={`M${cx - 5} ${84 - h * 0.55} h-8 v-${h * 0.25}`} stroke="#65a30d" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d={`M${cx + 5} ${84 - h * 0.4} h8 v-${h * 0.3}`} stroke="#65a30d" strokeWidth="7" fill="none" strokeLinecap="round" />
    </g>
  );
  return (
    <Art viewBox="0 0 544 268" label="Os seis biomas do Brasil: Amazônia, Cerrado, Caatinga, Mata Atlântica, Pantanal e Pampa">
      {tile(
        0,
        "Amazônia",
        "#bbf7d0",
        "#166534",
        <g>
          {[10, 34, 58, 84, 110, 136, 160].map((x, k) => (
            <Tree key={x} x={x} y={88} s={0.75 + (k % 3) * 0.12} color={k % 2 ? "#15803d" : "#16a34a"} />
          ))}
          <path d="M0 96 C50 88 110 100 172 90" stroke="#0ea5e9" strokeWidth="6" fill="none" />
        </g>,
      )}
      {tile(
        1,
        "Cerrado",
        "#fef3c7",
        "#ca8a04",
        <g>
          {[30, 90, 140].map((x, k) => (
            <g key={x} transform={`translate(${x} 84)`}>
              <path d="M0 0 C-4 -14 6 -20 2 -32" stroke="#78350f" strokeWidth="4" fill="none" />
              <circle cx="2" cy="-38" r="12" fill={k === 1 ? "#facc15" : "#65a30d"} className="cg-anim-sway" />
            </g>
          ))}
          {[10, 50, 70, 110, 160].map((x) => (
            <path key={x} d={`M${x} 84 l-3 -10 M${x} 84 l3 -9 M${x} 84 l0 -12`} stroke="#a16207" strokeWidth="1.5" />
          ))}
        </g>,
      )}
      {tile(
        2,
        "Caatinga",
        "#fed7aa",
        "#c2410c",
        <g>
          <circle cx="140" cy="26" r="14" fill="#f59e0b" className="cg-anim-glow" />
          {cactus(40, 50)}
          {cactus(110, 36)}
          <path d="M70 84 L70 60 M70 70 L60 56 M70 66 L80 54" stroke="#78350f" strokeWidth="2.5" fill="none" />
          <path d="M10 92 l12 -4 M130 94 l14 -3" stroke="#7c2d12" strokeWidth="1.5" />
        </g>,
      )}
      {tile(
        3,
        "Mata Atlântica",
        "#dbeafe",
        "#15803d",
        <g>
          <path d="M0 84 C30 30 70 40 90 70 C110 40 150 30 172 60 L172 90 L0 90 Z" fill="#16a34a" />
          {[20, 50, 80, 120, 150].map((x) => (
            <circle key={x} cx={x} cy={60 + (x % 3) * 4} r="10" fill="#22c55e" stroke="#14532d" strokeWidth="1" />
          ))}
          <path d="M0 92 L172 92 L172 122 L0 122 Z" fill="#38bdf8" />
          <path d="M0 92 Q20 88 40 92 T80 92 T120 92 T160 92 T200 92" stroke="#e0f2fe" strokeWidth="2" fill="none">
            <animateTransform attributeName="transform" type="translate" values="0 0;-40 0" dur="3s" repeatCount="indefinite" />
          </path>
        </g>,
      )}
      {tile(
        4,
        "Pantanal",
        "#e0f2fe",
        "#7dd3fc",
        <g>
          <path d="M0 80 L172 80" stroke="#bae6fd" strokeWidth="3" />
          {[20, 150].map((x) => (
            <Tree key={x} x={x} y={82} s={0.6} />
          ))}
          {/* o tuiuiú */}
          <g transform="translate(86 70)">
            <path d="M-2 14 L-4 26 M4 14 L6 26" stroke="#1c1917" strokeWidth="2" />
            <ellipse cx="0" cy="6" rx="12" ry="9" fill="#fff" stroke="#94a3b8" strokeWidth="1" />
            <path d="M6 0 L10 -16" stroke="#1c1917" strokeWidth="4" />
            <path d="M10 -14 L12 -6" stroke="#dc2626" strokeWidth="4" />
            <path d="M10 -18 L28 -12" stroke="#1c1917" strokeWidth="3" />
          </g>
          {/* jacaré boiando */}
          <path d="M40 96 C50 90 70 90 80 96" stroke="#3f6212" strokeWidth="5" fill="none" className="cg-anim-hover" />
        </g>,
      )}
      {tile(
        5,
        "Pampa",
        "#e0f2fe",
        "#84cc16",
        <g>
          <path d="M0 84 C40 70 80 76 120 70 C150 66 160 72 172 70 L172 90 L0 90 Z" fill="#a3e635" />
          {[20, 44, 70, 100, 130, 154].map((x) => (
            <path key={x} d={`M${x} 88 l-3 -10 M${x} 88 l3 -9`} stroke="#4d7c0f" strokeWidth="1.5" className="cg-anim-sway" />
          ))}
          {/* o gado pastando */}
          <g transform="translate(110 76)">
            <rect x="-14" y="-8" width="24" height="12" rx="4" fill="#78350f" />
            <rect x="8" y="-4" width="10" height="8" rx="3" fill="#78350f" />
            <path d="M-10 4 v6 M6 4 v6" stroke="#451a03" strokeWidth="2.5" />
          </g>
          <Cloud x={20} y={30} dur={20} />
        </g>,
      )}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O efeito estufa: a luz entra, o calor tenta sair e os gases seguram uma parte
// ---------------------------------------------------------------------------

function GreenhouseArt() {
  return (
    <Art viewBox="0 0 540 260" label="O efeito estufa: a luz do Sol aquece a Terra, e os gases da atmosfera seguram parte do calor que tenta sair">
      <rect x="0" y="0" width="540" height="260" fill="#0f172a" />
      <circle cx="60" cy="50" r="30" fill="#fbbf24" className="cg-anim-glow" />
      {/* a atmosfera com os gases */}
      <path d="M0 120 C140 96 400 96 540 120" stroke="#7dd3fc" strokeWidth="26" fill="none" opacity="0.3" />
      {[
        [80, 112], [170, 104], [260, 100], [350, 102], [440, 108], [510, 116],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <g className="cg-anim-hover" style={{ animationDelay: `${i * 0.4}s` }}>
            <circle cx="-7" r="4" fill="#ef4444" />
            <circle r="5" fill="#94a3b8" />
            <circle cx="7" r="4" fill="#ef4444" />
          </g>
        </g>
      ))}
      <text x="530" y="90" textAnchor="end" fontSize="12" fontWeight="700" fill="#7dd3fc" fontFamily="Georgia, serif">
        gases de efeito estufa (CO₂...)
      </text>
      {/* a Terra */}
      <path d="M0 210 C140 196 400 196 540 210 L540 260 L0 260 Z" fill="#16a34a" />
      <path d="M300 205 L540 205 L540 260 L300 260 Z" fill="#2563eb" opacity="0.6" />
      {/* a fábrica soltando fumaça e a queimada */}
      <g transform="translate(400 200)">
        <rect x="-20" y="-30" width="40" height="30" fill="#475569" />
        <rect x="6" y="-56" width="10" height="28" fill="#334155" />
        {[0, 1, 2].map((k) => (
          <circle key={k} cx="11" cy="-62" r="8" fill="#64748b" className="cg-anim-aura-rise" style={{ "--cg-dur": "3s", "--cg-delay": `${k}s` } as React.CSSProperties} />
        ))}
      </g>
      <g transform="translate(160 202)">
        {[-10, 0, 10].map((x, k) => (
          <path key={x} d={`M${x} 0 C${x - 8} -12 ${x - 2} -20 ${x} -28 C${x + 4} -18 ${x + 8} -12 ${x} 0 Z`} fill={k === 1 ? "#f97316" : "#ef4444"} className="cg-anim-flicker" style={{ animationDelay: `${k * 0.2}s` }} />
        ))}
        <circle cx="0" cy="-36" r="8" fill="#64748b" className="cg-anim-aura-rise" style={{ "--cg-dur": "3s" } as React.CSSProperties} />
      </g>
      {/* a luz entrando (amarela) */}
      {[0, 1].map((k) => (
        <path key={k} d={`M${86 + k * 20} 74 L${220 + k * 40} 200`} stroke="#fde047" strokeWidth="3" strokeDasharray="10 10" className="cg-anim-dash" />
      ))}
      {/* o calor saindo: uma parte escapa pro espaço, outra volta pra Terra */}
      <path d="M280 200 C290 170 270 150 290 120 C300 100 290 60 300 10" stroke="#f87171" strokeWidth="3" strokeDasharray="8 12" fill="none" className="cg-anim-dash" />
      <path d="M340 200 C350 170 330 150 350 124 C370 140 380 170 380 200" stroke="#ef4444" strokeWidth="3.5" strokeDasharray="8 12" fill="none" className="cg-anim-dash" />
      <path d="M220 200 C230 170 210 150 230 124 C250 140 250 170 252 200" stroke="#ef4444" strokeWidth="3.5" strokeDasharray="8 12" fill="none" className="cg-anim-dash" />
      <g fontFamily="Georgia, serif" fontSize="12" fontWeight="700">
        <text x="120" y="160" fill="#fde047">
          luz do Sol
        </text>
        <text x="306" y="40" fill="#fca5a5">
          calor que escapa
        </text>
        <text x="390" y="160" fill="#f87171">
          calor que fica preso
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 7, content, bare });

export const chapter7: BookPage[] = [
  page(
    <ChapterOpener
      n={7}
      title="Ecologia e Cadeias Alimentares"
      goals={["O que é um ecossistema", "Como a energia passa de um ser vivo para outro", "As relações entre os seres vivos", "Os biomas do Brasil e o aquecimento global"]}
    >
      <Fig h={34}>
        <EcosystemArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🌎">Ecossistemas: tudo está ligado</H>
      <P>
        <T>Ecologia</T> é a parte da Biologia que estuda as relações dos seres vivos entre si e com o ambiente. Um <T>ecossistema</T> é o conjunto dos seres vivos de um lugar
        e do ambiente onde eles vivem, interagindo o tempo todo. Uma floresta, um lago e até um aquário são ecossistemas.
      </P>
      <Cards
        items={[
          { icon: "🐾", title: "Fatores bióticos", text: "A parte viva: plantas, animais, fungos, bactérias." },
          { icon: "🌡️", title: "Fatores abióticos", text: "A parte não viva: água, luz, solo, ar e temperatura." },
        ]}
      />
      <P>Os ecólogos estudam a natureza em níveis, do menor para o maior:</P>
      <Fig n="7.1" caption="Indivíduo (um ser), população (vários da mesma espécie), comunidade (várias espécies), ecossistema (com o ambiente) e biosfera (todos os ecossistemas da Terra)." h={20}>
        <EcoLevelsArt />
      </Fig>
      <Box kind="lembre">
        <strong>População</strong> = indivíduos da <em>mesma</em> espécie no mesmo lugar (as capivaras de um rio). <strong>Comunidade</strong> = as populações de{" "}
        <em>todas</em> as espécies desse lugar.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🔗">Cadeias alimentares</H>
      <P>
        Uma <T>cadeia alimentar</T> mostra quem come quem e, principalmente, por onde passa a <T>energia</T>. Ela começa sempre nos <T>produtores</T> (plantas e algas), que
        fazem o próprio alimento com a luz do Sol. Depois vêm os <T>consumidores</T>:
      </P>
      <Fig n="7.2" caption="A seta aponta para quem come, mostrando o caminho da energia. Os decompositores recebem os restos de todos." h={28}>
        <FoodChainArt />
      </Fig>
      <List
        items={[
          <>
            <T>Consumidor primário</T>: come o produtor. É o herbívoro (o gafanhoto).
          </>,
          <>
            <T>Consumidor secundário</T>: come o primário (o sapo). O <T>terciário</T> come o secundário (a cobra).
          </>,
          <>
            <T>Decompositores</T> (fungos e bactérias): decompõem os restos de todos e devolvem os nutrientes ao solo, para os produtores usarem de novo.
          </>,
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🕸️">Teias alimentares e a pirâmide de energia</H>
      <P>
        Na natureza, um animal come várias coisas e é comido por vários outros. Por isso as cadeias se cruzam e formam uma <T>teia alimentar</T>. Se uma espécie desaparece,
        toda a teia sente: sem os sapos, por exemplo, os gafanhotos se multiplicam e as cobras passam fome.
      </P>
      <P>
        A cada passo da cadeia, o ser vivo usa a maior parte da energia para viver (se mexer, manter o corpo quente) e ela se perde como <T>calor</T>. Só uns <T>10%</T> passam
        para o nível seguinte.
      </P>
      <Fig n="7.3" caption="A pirâmide de energia: a energia diminui a cada degrau, e o calor vai embora." h={24}>
        <PyramidArt />
      </Fig>
      <Box kind="mago">
        É por isso que as cadeias raramente têm mais de 4 ou 5 elos, e que existem muito menos onças do que capivaras: no topo da pirâmide sobra pouca energia!
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🤝">Relações entre os seres vivos</H>
      <P>Os seres vivos de uma comunidade se relacionam de muitas formas. Algumas são boas para os dois; outras, boas só para um.</P>
      <Fig n="7.4" caption="(+) quem ganha, (−) quem perde." h={20}>
        <RelationsArt />
      </Fig>
      <Table
        head={["Relação", "Como é", "Exemplo"]}
        rows={[
          ["Mutualismo", "As duas espécies ganham", "A abelha leva o pólen e ganha o néctar da flor"],
          ["Parasitismo", "O parasita ganha e o hospedeiro perde", "O carrapato suga o sangue do cachorro"],
          ["Predatismo", "O predador mata e come a presa", "A coruja caçando o rato"],
          ["Comensalismo", "Um ganha e o outro nem percebe", "A rêmora come os restos da comida do tubarão"],
          ["Competição", "Os dois disputam o mesmo recurso", "Dois pássaros querendo o mesmo fruto"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🗺️">Os biomas do Brasil</H>
      <P>
        <T>Bioma</T> é uma grande região com clima, vegetação e animais parecidos. O Brasil tem seis biomas e uma das maiores biodiversidades do planeta.
      </P>
      <Fig n="7.5" caption="Os seis biomas brasileiros." h={30}>
        <BiomesArt />
      </Fig>
      <List
        items={[
          <>
            <T>Amazônia</T>: a maior floresta tropical do mundo, quente e chuvosa, com rios enormes.
          </>,
          <>
            <T>Cerrado</T>: a &ldquo;savana&rdquo; brasileira, com árvores de troncos tortos e o ipê. É o berço de muitos rios.
          </>,
          <>
            <T>Caatinga</T>: só existe no Brasil! Seca, com plantas que guardam água, como o mandacaru.
          </>,
          <>
            <T>Mata Atlântica</T>: floresta do litoral, muito devastada; restam poucos pedaços.
          </>,
          <>
            <T>Pantanal</T>: a maior planície alagável do mundo, terra do tuiuiú e do jacaré. <T>Pampa</T>: os campos do Sul, com capim e pouca árvore.
          </>,
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🔥">Efeito estufa e aquecimento global</H>
      <P>
        O <T>efeito estufa</T> é natural e muito importante: gases da atmosfera, como o <T>gás carbônico</T> (CO₂) e o metano, seguram parte do calor do Sol, como o vidro de uma
        estufa. Sem ele, a Terra seria uma bola de gelo, com uns −18 °C!
      </P>
      <Fig n="7.6" caption="A luz entra e aquece a Terra; parte do calor escapa para o espaço e parte fica presa pelos gases." h={26}>
        <GreenhouseArt />
      </Fig>
      <P>
        O problema é o <T>excesso</T>. A queima de combustíveis fósseis (gasolina, diesel, carvão) e o <T>desmatamento</T> com queimadas soltam muito CO₂, e o planeta está
        esquentando: é o <T>aquecimento global</T>, que derrete geleiras, aumenta o nível do mar e torna secas e tempestades mais fortes.
      </P>
      <Box kind="experimente" title="O que você pode fazer">
        Economize energia elétrica, prefira andar a pé, de bicicleta ou de ônibus, evite o desperdício de comida, separe o lixo para a reciclagem e plante árvores. Pequenas
        atitudes de muita gente fazem uma grande diferença!
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Ecossistema = seres vivos (bióticos) + ambiente (abióticos) interagindo.",
          "Cadeia alimentar: produtores → consumidores primários → secundários → terciários; os decompositores reciclam os nutrientes.",
          "Só cerca de 10% da energia passa de um nível para o outro; o resto se perde como calor.",
          "Relações: mutualismo (+ +), parasitismo (+ −), predatismo (+ −), comensalismo (+ 0) e competição (− −).",
          "Biomas do Brasil: Amazônia, Cerrado, Caatinga, Mata Atlântica, Pantanal e Pampa.",
        ]}
      />
      <Glossary
        items={[
          ["Produtor", "Ser vivo que faz o próprio alimento (plantas e algas)."],
          ["Herbívoro", "Animal que come plantas: o consumidor primário."],
          ["Teia alimentar", "O conjunto das cadeias alimentares que se cruzam."],
          ["Bioma", "Região grande com clima, plantas e animais parecidos."],
          ["Biodiversidade", "A variedade de seres vivos de um lugar."],
        ]}
      />
      <Quiz
        items={[
          ["Na cadeia capim → gafanhoto → sapo → cobra, o que é o sapo?", "Consumidor secundário."],
          ["Qual é o papel dos decompositores?", "Decompor os restos dos seres vivos e devolver os nutrientes ao solo."],
          ["Qual bioma existe só no Brasil?", "A Caatinga."],
          ["Qual é a principal causa do aquecimento global atual?", "O excesso de gases do efeito estufa, liberados pela queima de combustíveis fósseis e pelo desmatamento."],
        ]}
      />
    </>,
  ),
];
