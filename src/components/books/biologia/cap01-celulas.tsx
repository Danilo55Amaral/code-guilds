"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, Label, List, P, Quiz, Summary, T, Table, useUid } from "../BookParts";
import type { BookPage } from "../types";

// ============================================================================
// CAPÍTULO 1 — SERES VIVOS E CÉLULAS (missão "Biologia: Seres Vivos e
// Células"): o que é estar vivo, a descoberta da célula, a célula animal por
// dentro (animada, cada organela se toca pra saber o que faz), a célula
// vegetal com os cloroplastos girando em volta do vacúolo, a bactéria com o
// flagelo batendo e os níveis de organização do corpo.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o microscópio e o que aparece na lente
// ---------------------------------------------------------------------------

function MicroscopeArt() {
  const u = useUid("mic");
  // as células da casca da cebola, em fileiras desencontradas
  const cells: [number, number][] = [];
  for (let row = 0; row < 6; row++) for (let col = 0; col < 5; col++) cells.push([262 + col * 48 + (row % 2) * 24, 48 + row * 38]);
  return (
    <Art viewBox="0 0 520 300" label="Um microscópio e, na lente, as células da casca da cebola">
      <defs>
        <clipPath id={`${u}-lens`}>
          <circle cx="370" cy="150" r="112" />
        </clipPath>
        <radialGradient id={`${u}-view`} cx="0.45" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#fffbea" />
          <stop offset="1" stopColor="#fde68a" />
        </radialGradient>
        <linearGradient id={`${u}-metal`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1e293b" />
          <stop offset="0.5" stopColor="#64748b" />
          <stop offset="1" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      {/* o feixe de luz da lente até o círculo ampliado */}
      <path d="M118 96 L262 42 L262 258 L118 132 Z" fill="#fde68a" opacity="0.28" className="cg-anim-beam" />
      {/* o microscópio */}
      <rect x="40" y="262" width="150" height="20" rx="8" fill="#334155" />
      <path d="M150 262 C150 200 176 170 168 112 L148 108 C152 160 128 196 128 262 Z" fill={`url(#${u}-metal)`} />
      <rect x="60" y="196" width="110" height="12" rx="4" fill="#475569" />
      <rect x="92" y="208" width="34" height="8" rx="2" fill="#94a3b8" />
      <circle cx="109" cy="230" r="11" fill="#fde047" stroke="#a16207" strokeWidth="2" className="cg-anim-glow" />
      <g transform="rotate(-24 118 110)">
        <rect x="100" y="60" width="34" height="96" rx="6" fill={`url(#${u}-metal)`} />
        <rect x="96" y="40" width="42" height="26" rx="5" fill="#0f172a" />
        <rect x="106" y="156" width="22" height="22" rx="3" fill="#d97706" />
        <rect x="111" y="178" width="12" height="14" rx="2" fill="#78350f" />
      </g>
      <circle cx="176" cy="150" r="10" fill="#94a3b8" stroke="#334155" strokeWidth="3" />
      {/* a lente: as células da cebola com o núcleo, e um paramécio nadando */}
      <circle cx="370" cy="150" r="118" fill="#1f2937" />
      <g clipPath={`url(#${u}-lens)`}>
        <rect x="250" y="30" width="240" height="240" fill={`url(#${u}-view)`} />
        <g transform="translate(370 150)">
          <animateTransform attributeName="transform" type="scale" values="1;1.04;1" dur="7s" repeatCount="indefinite" additive="sum" />
          <g transform="translate(-370 -150)">
          {cells.map(([x, y], i) => (
            <g key={i}>
              <rect x={x - 22} y={y - 17} width="44" height="34" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
              <circle cx={x - 6 + (i % 3) * 6} cy={y - 2 + (i % 2) * 4} r="5" fill="#a855f7" className="cg-anim-twinkle" style={{ animationDelay: `${(i % 6) * 0.35}s` }} />
            </g>
          ))}
          </g>
        </g>
        <g>
          <animateMotion dur="11s" repeatCount="indefinite" rotate="auto" path="M240 210 C300 170 360 240 420 190 S500 120 520 140" />
          <ellipse cx="0" cy="0" rx="20" ry="8" fill="#86efac" stroke="#15803d" strokeWidth="1.5" opacity="0.9" />
          <circle cx="4" cy="0" r="3" fill="#166534" />
          {[-16, -10, -4, 2, 8, 14].map((x) => (
            <path key={x} d={`M${x} -8 l-2 -4 M${x} 8 l-2 4`} stroke="#15803d" strokeWidth="1" />
          ))}
        </g>
      </g>
      <circle cx="370" cy="150" r="114" fill="none" stroke="#475569" strokeWidth="6" />
      <path d="M300 70 A100 100 0 0 1 420 52" stroke="#fff" strokeWidth="5" opacity="0.4" fill="none" strokeLinecap="round" />
      {[
        [470, 40, 0],
        [258, 262, 1.2],
        [500, 250, 0.6],
      ].map(([x, y, d], i) => (
        <path key={i} d={`M${x} ${y - 8} L${x + 2} ${y - 2} L${x + 8} ${y} L${x + 2} ${y + 2} L${x} ${y + 8} L${x - 2} ${y + 2} L${x - 8} ${y} L${x - 2} ${y - 2} Z`} fill="#fbbf24" className="cg-anim-twinkle" style={{ animationDelay: `${d}s` }} />
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A cortiça que Robert Hooke viu em 1665
// ---------------------------------------------------------------------------

function CorkArt() {
  const u = useUid("cork");
  const cells: [number, number][] = [];
  for (let row = 0; row < 7; row++) for (let col = 0; col < 9; col++) cells.push([38 + col * 36 + (row % 2) * 18, 30 + row * 30]);
  return (
    <Art viewBox="0 0 520 230" label="As caixinhas vazias da cortiça, como Robert Hooke desenhou">
      <defs>
        <clipPath id={`${u}-c`}>
          <circle cx="170" cy="115" r="100" />
        </clipPath>
      </defs>
      <circle cx="170" cy="115" r="106" fill="#3f2a14" />
      <g clipPath={`url(#${u}-c)`}>
        <rect x="60" y="10" width="230" height="220" fill="#f5deb3" />
        {cells.map(([x, y], i) => (
          <path key={i} d={`M${x} ${y - 14} L${x + 15} ${y - 7} L${x + 15} ${y + 8} L${x} ${y + 15} L${x - 15} ${y + 8} L${x - 15} ${y - 7} Z`} fill="#fff8e7" stroke="#8b5a2b" strokeWidth="3" />
        ))}
      </g>
      <circle cx="170" cy="115" r="102" fill="none" stroke="#a16207" strokeWidth="4" />
      {/* o livro de Hooke e a data */}
      <g transform="translate(330 40)">
        <rect x="0" y="0" width="150" height="120" rx="6" fill="#7c2d12" stroke="#431407" strokeWidth="2" />
        <rect x="10" y="10" width="130" height="100" rx="3" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="75" y="44" textAnchor="middle" fontSize="15" fontWeight="900" fill="#fde68a" fontFamily="Georgia, serif">
          Micrographia
        </text>
        <text x="75" y="70" textAnchor="middle" fontSize="12" fill="#fde68a" fontFamily="Georgia, serif">
          Robert Hooke
        </text>
        <text x="75" y="96" textAnchor="middle" fontSize="20" fontWeight="900" fill="#fbbf24" fontFamily="Georgia, serif">
          1665
        </text>
      </g>
      <text x="405" y="190" textAnchor="middle" fontSize="13" fontWeight="700" fill="#5b4a2e" fontFamily="Georgia, serif">
        &quot;cellula&quot; = quartinho
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A célula animal, animada e de tocar: cada organela mostra o que faz
// ---------------------------------------------------------------------------

const ORGANELLES = {
  membrana: { name: "Membrana plasmática", text: "A “porta” da célula: uma película finíssima que envolve tudo e escolhe o que entra (água, nutrientes, oxigênio) e o que sai (gás carbônico e restos)." },
  citoplasma: { name: "Citoplasma", text: "O “recheio” gelatinoso, feito principalmente de água, onde ficam as organelas e acontecem muitas reações químicas da célula." },
  nucleo: { name: "Núcleo", text: "O “centro de comando”. Guarda o DNA, com todas as instruções para a célula funcionar, crescer e se dividir." },
  nucleolo: { name: "Nucléolo", text: "Uma região mais escura dentro do núcleo, que fabrica as peças dos ribossomos." },
  mitocondria: { name: "Mitocôndria", text: "A “usina de energia”. Faz a respiração celular: usa o oxigênio para tirar a energia guardada na glicose (os brilhinhos que sobem são essa energia)." },
  ribossomos: { name: "Ribossomos", text: "Pontinhos que montam as proteínas, juntando aminoácidos. Ficam soltos no citoplasma ou grudados no retículo rugoso." },
  rugoso: { name: "Retículo endoplasmático rugoso", text: "Um labirinto de canais coberto de ribossomos (por isso parece “rugoso”): fabrica e transporta proteínas. Veja a bolsinha saindo dele até o complexo golgiense!" },
  liso: { name: "Retículo endoplasmático liso", text: "Canais sem ribossomos que produzem lipídios (as gorduras da célula) e ajudam a eliminar substâncias tóxicas." },
  golgi: { name: "Complexo golgiense", text: "Os “correios” da célula: recebe as substâncias, embala tudo em bolsinhas (vesículas) e despacha para onde precisam ir, até para fora da célula." },
  lisossomo: { name: "Lisossomo", text: "Uma bolsinha cheia de enzimas digestivas que faz a “reciclagem”: digere partículas que entram e organelas velhas." },
  centriolos: { name: "Centríolos", text: "Dois cilindros pequenininhos, em cruz, que ajudam a organizar a divisão da célula." },
} as const;
type OrganelleId = keyof typeof ORGANELLES;

const MEMBRANE_A = "M350 38 C468 36 556 96 558 186 C560 276 470 342 352 342 C232 344 142 280 140 188 C138 98 232 40 350 38 Z";
const MEMBRANE_B = "M352 44 C474 44 550 104 551 190 C552 272 466 335 348 335 C228 336 147 274 147 184 C147 104 236 44 352 44 Z";
const NUCLEUS = { x: 330, y: 188, r: 56 };
const FREE_RIBOSOMES: [number, number][] = [
  [505, 160], [515, 205], [480, 290], [350, 322], [175, 205], [260, 75], [380, 68], [300, 78], [470, 165], [395, 255], [232, 176], [190, 140], [455, 300],
];
const MITOCHONDRIA: [number, number, number][] = [
  [458, 122, 20],
  [222, 126, -30],
  [282, 298, 8],
  [402, 304, -12],
];

function arcPoint(r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [NUCLEUS.x + r * Math.cos(a), NUCLEUS.y + r * Math.sin(a)];
}

function Mitochondrion({ x, y, rot, delay }: { x: number; y: number; rot: number; delay: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <g>
        <animateTransform attributeName="transform" type="rotate" values="-6;6;-6" dur={`${3 + delay}s`} repeatCount="indefinite" />
        <ellipse rx="27" ry="12.5" fill="#fb923c" stroke="#c2410c" strokeWidth="1.8" />
        <ellipse rx="22" ry="8.5" fill="#fdba74" />
        <path d="M-19 0 L-15 -7 L-10 6 L-5 -7 L0 6 L5 -7 L10 6 L15 -7 L19 0" stroke="#c2410c" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
      </g>
      {/* a energia saindo */}
      {[0, 1].map((k) => (
        <circle key={k} cx={-6 + k * 12} cy="-14" r="2.6" fill="#facc15" className="cg-anim-aura-rise" style={{ "--cg-dur": "2.4s", "--cg-delay": `${delay + k * 1.1}s` } as React.CSSProperties} />
      ))}
    </g>
  );
}

export function AnimalCell() {
  const u = useUid("cel");
  const [sel, setSel] = useState<OrganelleId | null>(null);
  const pick = (id: OrganelleId) => ({
    onClick: () => setSel(id),
    className: "cursor-pointer",
    style: sel === id ? { filter: "drop-shadow(0 0 4px #facc15) drop-shadow(0 0 8px #f59e0b)" } : undefined,
  });
  const rerArcs = [70, 82, 94];

  return (
    <div>
      <Art viewBox="0 0 700 384" label="Célula animal com as organelas, animada">
        <defs>
          <radialGradient id={`${u}-cyto`} cx="0.5" cy="0.45" r="0.6">
            <stop offset="0" stopColor="#fff1f2" />
            <stop offset="1" stopColor="#fecdd3" />
          </radialGradient>
          <radialGradient id={`${u}-nuc`} cx="0.42" cy="0.38" r="0.7">
            <stop offset="0" stopColor="#ede9fe" />
            <stop offset="1" stopColor="#a78bfa" />
          </radialGradient>
        </defs>

        {/* membrana e citoplasma (a membrana "respira" devagar) */}
        <g {...pick("citoplasma")}>
          <path d={MEMBRANE_A} fill={`url(#${u}-cyto)`}>
            <animate attributeName="d" values={`${MEMBRANE_A};${MEMBRANE_B};${MEMBRANE_A}`} dur="7s" repeatCount="indefinite" />
          </path>
        </g>
        <g {...pick("membrana")}>
          <path d={MEMBRANE_A} fill="none" stroke="#f43f5e" strokeWidth="7">
            <animate attributeName="d" values={`${MEMBRANE_A};${MEMBRANE_B};${MEMBRANE_A}`} dur="7s" repeatCount="indefinite" />
          </path>
          <path d={MEMBRANE_A} fill="none" stroke="#fda4af" strokeWidth="2.5">
            <animate attributeName="d" values={`${MEMBRANE_A};${MEMBRANE_B};${MEMBRANE_A}`} dur="7s" repeatCount="indefinite" />
          </path>
        </g>

        {/* retículo liso */}
        <g {...pick("liso")}>
          {[0, 14].map((dy) => (
            <path key={dy} d={`M204 ${256 + dy} C216 ${244 + dy} 228 ${268 + dy} 240 ${256 + dy} S264 ${244 + dy} 276 ${258 + dy}`} stroke="#38bdf8" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.85" />
          ))}
        </g>

        {/* retículo rugoso, com os ribossomos grudados */}
        <g {...pick("rugoso")}>
          {rerArcs.map((r) => {
            const [x1, y1] = arcPoint(r, -85);
            const [x2, y2] = arcPoint(r, 25);
            return <path key={r} d={`M${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2}`} stroke="#60a5fa" strokeWidth="7" fill="none" strokeLinecap="round" />;
          })}
          {rerArcs.flatMap((r) =>
            Array.from({ length: 12 }, (_, i) => {
              const [x, y] = arcPoint(r + (i % 2 ? 4.5 : -4.5), -82 + i * 9.5);
              return <circle key={`${r}-${i}`} cx={x} cy={y} r="1.9" fill="#1e3a8a" />;
            }),
          )}
        </g>

        {/* núcleo, com o brilho, a cromatina e o nucléolo */}
        <circle cx={NUCLEUS.x} cy={NUCLEUS.y} r={NUCLEUS.r + 9} fill="#a78bfa" opacity="0.25" className="cg-anim-glow" style={{ "--cg-dur": "3.4s" } as React.CSSProperties} />
        <g {...pick("nucleo")}>
          <circle cx={NUCLEUS.x} cy={NUCLEUS.y} r={NUCLEUS.r} fill={`url(#${u}-nuc)`} stroke="#6d28d9" strokeWidth="3" />
          <circle cx={NUCLEUS.x} cy={NUCLEUS.y} r={NUCLEUS.r - 4} fill="none" stroke="#8b5cf6" strokeWidth="1.2" strokeDasharray="12 3" />
          {["M296 170 C306 160 312 182 322 170 S338 160 344 172", "M300 206 C312 214 318 196 330 206 S350 214 358 202", "M310 150 C318 146 322 156 330 150", "M352 196 C358 186 366 196 368 186"].map((d) => (
            <path key={d} d={d} stroke="#7c3aed" strokeWidth="1.8" fill="none" opacity="0.65" strokeLinecap="round" />
          ))}
        </g>
        <g {...pick("nucleolo")}>
          <circle cx="342" cy="180" r="15" fill="#5b21b6" />
          <circle cx="337" cy="175" r="4" fill="#8b5cf6" />
        </g>

        {/* complexo golgiense, com as bolsinhas saindo pra membrana */}
        <g {...pick("golgi")}>
          <g transform="translate(468 252) rotate(-28)">
            {[-14, -4, 6, 16].map((y, i) => (
              <path key={y} d={`M-30 ${y} Q0 ${y - 13} 30 ${y}`} stroke={i % 2 ? "#fbbf24" : "#f59e0b"} strokeWidth="7" fill="none" strokeLinecap="round" />
            ))}
            {[-14, 6].map((y) => (
              <circle key={y} cx="36" cy={y} r="3.5" fill="#f59e0b" />
            ))}
          </g>
        </g>
        {/* uma vesícula do retículo pro Golgi e outra do Golgi pra fora da célula */}
        <circle r="5" fill="#fbbf24" stroke="#b45309" strokeWidth="1">
          <animateMotion dur="4s" repeatCount="indefinite" path="M414 218 C428 236 440 240 452 246" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.85;1" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle r="5" fill="#fbbf24" stroke="#b45309" strokeWidth="1">
          <animateMotion dur="4s" begin="2s" repeatCount="indefinite" path="M494 240 C508 246 520 254 532 262" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.8;1" dur="4s" begin="2s" repeatCount="indefinite" />
        </circle>

        {/* mitocôndrias */}
        <g {...pick("mitocondria")}>
          {MITOCHONDRIA.map(([x, y, rot], i) => (
            <Mitochondrion key={i} x={x} y={y} rot={rot} delay={i * 0.5} />
          ))}
        </g>

        {/* lisossomos (passeando devagar) */}
        <g {...pick("lisossomo")}>
          {[
            [180, 246, 9],
            [420, 82, 8],
          ].map(([x, y, r], i) => (
            <g key={i}>
              <animateTransform attributeName="transform" type="translate" values="0 0;6 -4;0 0" dur={`${5 + i}s`} repeatCount="indefinite" />
              <circle cx={x} cy={y} r={r} fill="#bef264" stroke="#4d7c0f" strokeWidth="1.5" />
              <circle cx={x - 2} cy={y - 2} r="1.6" fill="#4d7c0f" />
              <circle cx={x + 3} cy={y + 2} r="1.4" fill="#4d7c0f" />
            </g>
          ))}
        </g>

        {/* centríolos */}
        <g {...pick("centriolos")}>
          <rect x="186" y="168" width="18" height="8" rx="3" fill="#94a3b8" stroke="#475569" strokeWidth="1.2" />
          <rect x="198" y="176" width="8" height="18" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1.2" />
        </g>

        {/* ribossomos soltos */}
        <g {...pick("ribossomos")}>
          {FREE_RIBOSOMES.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3.2" fill="#1e3a8a" />
          ))}
        </g>

        {/* os nomes */}
        <g className="pointer-events-none">
          <Label x={205} y={82} tx={128} ty={64} anchor="end" size={12.5}>
            Membrana plasmática
          </Label>
          <Label x={196} y={172} tx={128} ty={120} anchor="end" size={12.5}>
            Centríolos
          </Label>
          <Label x={245} y={205} tx={128} ty={178} anchor="end" size={12.5}>
            Citoplasma
          </Label>
          <Label x={180} y={246} tx={128} ty={236} anchor="end" size={12.5}>
            Lisossomo
          </Label>
          <Label x={232} y={268} tx={128} ty={294} anchor="end" size={12.5}>
            Retículo liso
          </Label>
          <Label x={458} y={122} tx={572} ty={64} size={12.5}>
            Mitocôndria
          </Label>
          <Label x={505} y={160} tx={572} ty={120} size={12.5}>
            Ribossomos
          </Label>
          <Label x={410} y={171} tx={572} ty={178} size={12.5}>
            Retículo rugoso
          </Label>
          <Label x={474} y={250} tx={572} ty={250} size={12.5}>
            Complexo golgiense
          </Label>
          <Label x={342} y={178} tx={342} ty={14} anchor="middle" size={12.5}>
            Nucléolo
          </Label>
          <Label x={318} y={232} tx={318} ty={366} anchor="middle" size={12.5}>
            Núcleo
          </Label>
        </g>
      </Art>

      {/* os botões de cada organela e o que ela faz */}
      <div className="mt-[0.4em] flex flex-wrap justify-center gap-[0.3em]">
        {(Object.keys(ORGANELLES) as OrganelleId[]).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setSel(id)}
            className={`rounded-full border px-[0.6em] py-[0.1em] text-[0.74em] font-bold transition-colors ${sel === id ? "border-amber-500 bg-amber-300 text-amber-950" : "border-[#d9c79d] bg-[#fffaf0] text-[#5b4a2e] hover:bg-amber-100"}`}
          >
            {ORGANELLES[id].name.replace("Retículo endoplasmático", "Retículo")}
          </button>
        ))}
      </div>
      <div className="mt-[0.4em] min-h-[3.6em] rounded-xl border border-amber-300 bg-amber-50 px-[0.8em] py-[0.45em] text-[0.88em] leading-[1.45] text-[#5b3a0a]">
        {sel ? (
          <p className="cg-anim-fade" key={sel}>
            <strong>{ORGANELLES[sel].name}:</strong> {ORGANELLES[sel].text}
          </p>
        ) : (
          <p>
            👆 <strong>Toque numa parte da célula</strong> (ou num botão) para descobrir o que ela faz.
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A célula vegetal: parede, vacúolo e os cloroplastos girando (a ciclose)
// ---------------------------------------------------------------------------

const CYCLOSIS = "M120 57 H292 Q313 57 313 78 V192 Q313 213 292 213 H120 Q92 213 92 192 V78 Q92 57 120 57 Z";

function PlantCellArt() {
  return (
    <Art viewBox="0 0 540 262" label="Célula vegetal com parede celular, vacúolo e cloroplastos se movendo">
      {/* parede e membrana */}
      <rect x="16" y="16" width="318" height="228" rx="24" fill="#d9f99d" stroke="#4d7c0f" strokeWidth="10" />
      <rect x="27" y="27" width="296" height="206" rx="16" fill="#f7fee7" stroke="#84cc16" strokeWidth="2.5" />
      {/* o vacúolo grandão */}
      <rect x="108" y="72" width="192" height="126" rx="40" fill="#bae6fd" stroke="#0ea5e9" strokeWidth="2.5">
        <animate attributeName="rx" values="40;48;40" dur="6s" repeatCount="indefinite" />
      </rect>
      <text x="204" y="140" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0369a1" fontFamily="Georgia, serif" opacity="0.8">
        água e sais
      </text>
      {/* núcleo empurrado pro canto */}
      <circle cx="60" cy="62" r="22" fill="#c4b5fd" stroke="#6d28d9" strokeWidth="2.5" />
      <circle cx="64" cy="58" r="7" fill="#5b21b6" />
      {/* mitocôndria */}
      <g transform="translate(58 196) rotate(-20)">
        <ellipse rx="18" ry="8.5" fill="#fb923c" stroke="#c2410c" strokeWidth="1.5" />
        <path d="M-12 0 L-8 -5 L-4 4 L0 -5 L4 4 L8 -5 L12 0" stroke="#c2410c" strokeWidth="1.3" fill="none" />
      </g>
      {/* cloroplastos circulando em volta do vacúolo */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <g key={i}>
          <animateMotion dur="18s" begin={`${-i * 2.57}s`} repeatCount="indefinite" rotate="auto" path={CYCLOSIS} />
          <ellipse rx="14" ry="7.5" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" />
          {[-6, 0, 6].map((x) => (
            <rect key={x} x={x - 2} y="-3.5" width="4" height="7" rx="1" fill="#166534" />
          ))}
        </g>
      ))}
      <Label x={20} y={150} tx={360} ty={232} size={13}>
        Parede celular
      </Label>
      <Label x={28} y={110} tx={360} ty={200} size={13}>
        Membrana plasmática
      </Label>
      <Label x={250} y={120} tx={360} ty={40} size={13}>
        Vacúolo
      </Label>
      <Label x={313} y={150} tx={360} ty={90} size={13}>
        Cloroplastos
      </Label>
      <Label x={70} y={50} tx={360} ty={14} size={13}>
        Núcleo
      </Label>
      <Label x={70} y={196} tx={360} ty={168} size={13}>
        Mitocôndria
      </Label>
      <text x="364" y="128" fontSize="11.5" fill="#5b4a2e" fontFamily="Georgia, serif" fontStyle="italic">
        (os cloroplastos giram
      </text>
      <text x="364" y="143" fontSize="11.5" fill="#5b4a2e" fontFamily="Georgia, serif" fontStyle="italic">
        com o citoplasma: ciclose)
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A bactéria (procarionte): o DNA solto e o flagelo batendo
// ---------------------------------------------------------------------------

function flagellum(phase: number): string {
  const pts: string[] = [];
  for (let x = 0; x <= 130; x += 5) {
    const amp = 13 * Math.min(1, x / 35);
    pts.push(`${(372 + x).toFixed(1)} ${(112 + amp * Math.sin(x / 15 + phase)).toFixed(1)}`);
  }
  return `M${pts.join(" L")}`;
}
const FLAGELLUM = [0, 1, 2, 3, 4].map((k) => flagellum((-k * Math.PI) / 2)).join(";");

function BacteriumArt() {
  return (
    <Art viewBox="0 0 540 230" label="Bactéria com cápsula, parede, membrana, DNA solto, plasmídio, ribossomos e flagelo">
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;-6 3;0 0" dur="3s" repeatCount="indefinite" />
        <path d={FLAGELLUM.split(";")[0]} stroke="#92400e" strokeWidth="3" fill="none" strokeLinecap="round">
          <animate attributeName="d" values={FLAGELLUM} dur="0.7s" repeatCount="indefinite" />
        </path>
        {/* pelinhos (fímbrias) */}
        {[130, 170, 210, 250, 290, 330].flatMap((x, i) => [
          <path key={`t${x}`} d={`M${x} 62 l${i % 2 ? 4 : -4} -12`} stroke="#b45309" strokeWidth="1.5" />,
          <path key={`b${x}`} d={`M${x} 162 l${i % 2 ? -4 : 4} 12`} stroke="#b45309" strokeWidth="1.5" />,
        ])}
        <rect x="104" y="54" width="272" height="116" rx="58" fill="#fef9c3" stroke="#facc15" strokeWidth="5" strokeDasharray="2 4" opacity="0.9" />
        <rect x="112" y="62" width="256" height="100" rx="50" fill="#fde68a" stroke="#d97706" strokeWidth="5" />
        <rect x="120" y="70" width="240" height="84" rx="42" fill="#fff7d6" stroke="#fb7185" strokeWidth="2" />
        <path d="M180 112 C186 86 214 92 220 108 C226 126 252 132 262 112 C272 92 300 100 296 118 C292 136 262 140 246 128 C230 116 206 138 192 130 C180 124 176 118 180 112 Z" fill="none" stroke="#7c3aed" strokeWidth="2.5" />
        <circle cx="318" cy="96" r="10" fill="none" stroke="#a855f7" strokeWidth="2" />
        {[
          [150, 100], [160, 128], [210, 80], [250, 146], [300, 140], [330, 124], [280, 82], [234, 114],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill="#1e3a8a" />
        ))}
      </g>
      <Label x={136} y={60} tx={60} ty={20} size={12.5}>
        Cápsula
      </Label>
      <Label x={190} y={64} tx={180} ty={20} size={12.5}>
        Parede celular
      </Label>
      <Label x={270} y={72} tx={300} ty={20} size={12.5}>
        Membrana
      </Label>
      <Label x={326} y={92} tx={430} ty={40} size={12.5}>
        Plasmídio
      </Label>
      <Label x={450} y={112} tx={470} ty={170} size={12.5}>
        Flagelo
      </Label>
      <Label x={240} y={126} tx={240} ty={212} anchor="middle" size={12.5}>
        DNA solto (sem núcleo)
      </Label>
      <Label x={160} y={128} tx={70} ty={212} size={12.5}>
        Ribossomos
      </Label>
    </Art>
  );
}

function VirusArt() {
  return (
    <svg viewBox="-50 -50 100 100" className="h-[4.6em] w-[4.6em] shrink-0" aria-hidden="true">
      <g className="cg-anim-spin-slow">
        {Array.from({ length: 12 }, (_, i) => (
          <g key={i} transform={`rotate(${i * 30})`}>
            <line x1="0" y1="-30" x2="0" y2="-42" stroke="#dc2626" strokeWidth="3" />
            <circle cx="0" cy="-43" r="4.5" fill="#ef4444" />
          </g>
        ))}
      </g>
      <circle r="30" fill="#fca5a5" stroke="#b91c1c" strokeWidth="3" />
      <path d="M-14 -8 C-6 -18 4 2 12 -8 M-12 8 C-4 -2 6 16 14 6" stroke="#7c3aed" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Níveis de organização: célula → tecido → órgão → sistema → organismo
// ---------------------------------------------------------------------------

function LevelsArt() {
  const stations = ["Célula", "Tecido", "Órgão", "Sistema", "Organismo"];
  return (
    <Art viewBox="0 0 620 160" label="Os níveis de organização: célula, tecido, órgão, sistema e organismo">
      {/* as setas entre um nível e o próximo */}
      {[
        [94, 124],
        [238, 262],
        [338, 382],
        [458, 512],
      ].map(([a, b]) => (
        <g key={a}>
          <path d={`M${a} 66 L${b} 66`} stroke="#b08a52" strokeWidth="3" strokeDasharray="6 4" className="cg-anim-dash" />
          <path d={`M${b - 8} 59 L${b + 2} 66 L${b - 8} 73`} fill="none" stroke="#b08a52" strokeWidth="3" strokeLinecap="round" />
        </g>
      ))}
      {/* célula */}
      <g className="cg-anim-pop" style={{ animationDelay: "0.1s" }}>
        <circle cx="60" cy="66" r="30" fill="#fecdd3" stroke="#f43f5e" strokeWidth="3" />
        <circle cx="64" cy="62" r="11" fill="#a78bfa" />
      </g>
      {/* tecido */}
      <g className="cg-anim-pop" style={{ animationDelay: "0.35s" }}>
        {[
          [180, 66], [160, 50], [200, 50], [160, 82], [200, 82], [140, 66], [220, 66],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="12" fill="#fecdd3" stroke="#f43f5e" strokeWidth="2" />
            <circle cx={x + 1} cy={y - 1} r="4" fill="#a78bfa" />
          </g>
        ))}
      </g>
      {/* órgão: o coração */}
      <g className="cg-anim-pop" style={{ animationDelay: "0.6s" }}>
        <g className="cg-anim-beat" style={{ "--cg-dur": "1.1s" } as React.CSSProperties}>
          <path d="M300 98 C268 78 266 46 284 40 C294 36 300 44 300 50 C300 44 306 36 316 40 C334 46 332 78 300 98 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="2.5" />
          <path d="M294 40 L292 26 M306 40 L310 26" stroke="#991b1b" strokeWidth="4" strokeLinecap="round" />
        </g>
      </g>
      {/* sistema: coração e vasos */}
      <g className="cg-anim-pop" style={{ animationDelay: "0.85s" }}>
        <path d="M420 20 V112 M420 40 C400 46 392 60 390 84 M420 40 C440 46 448 60 450 84 M420 86 C404 92 398 102 396 116 M420 86 C436 92 442 102 444 116" stroke="#ef4444" strokeWidth="3" fill="none" />
        <path d="M414 22 V110" stroke="#3b82f6" strokeWidth="2" opacity="0.8" />
        <path d="M420 74 C404 62 404 44 414 42 C418 41 420 45 420 48 C420 45 422 41 426 42 C436 44 436 62 420 74 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
      </g>
      {/* organismo */}
      <g className="cg-anim-pop" style={{ animationDelay: "1.1s" }}>
        <circle cx="540" cy="30" r="13" fill="#fcd34d" stroke="#92400e" strokeWidth="2" />
        <path d="M522 50 Q540 44 558 50 L562 92 L552 92 L550 120 L530 120 L528 92 L518 92 Z" fill="#60a5fa" stroke="#1e3a8a" strokeWidth="2" strokeLinejoin="round" />
        <path d="M540 58 C534 62 536 70 540 74 C544 70 546 62 540 58 Z" fill="#ef4444" className="cg-anim-beat" />
      </g>
      {stations.map((s, i) => (
        <text key={s} x={60 + i * 120} y="146" textAnchor="middle" fontSize="15" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
          {s}
        </text>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 1, content, bare });

export const chapter1: BookPage[] = [
  page(
    <ChapterOpener
      n={1}
      title="Seres Vivos e Células"
      goals={["O que todo ser vivo tem em comum", "Como a célula foi descoberta", "As partes da célula e o que cada uma faz", "A diferença entre a célula animal, a vegetal e a bacteriana"]}
    >
      <Fig h={34}>
        <MicroscopeArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🌱">O que é estar vivo?</H>
      <P>
        Olhe à sua volta: uma árvore, um cachorro, um cogumelo, você mesmo. Todos são <T>seres vivos</T>. Já uma pedra, um copo d&apos;água ou uma cadeira não são. Mas o que faz
        a diferença? Os cientistas perceberam que os seres vivos, por mais diferentes que sejam, compartilham algumas características:
      </P>
      <Cards
        items={[
          { icon: "🧫", title: "São feitos de células", text: "A célula é a menor parte de um ser vivo que ainda tem vida." },
          { icon: "🍎", title: "Se alimentam", text: "Precisam de energia e matéria para viver e crescer." },
          { icon: "💨", title: "Respiram", text: "Liberam a energia dos alimentos dentro das células." },
          { icon: "📏", title: "Crescem", text: "Nascem, se desenvolvem, envelhecem e morrem: é o ciclo de vida." },
          { icon: "🐣", title: "Se reproduzem", text: "Geram descendentes parecidos com eles." },
          { icon: "⚡", title: "Reagem", text: "Respondem a estímulos: a planta cresce em direção à luz, você tira a mão do fogo." },
        ]}
      />
      <P>
        Existem seres formados por <T>uma única célula</T>, os <T>unicelulares</T>, como as bactérias e as amebas. E existem os <T>pluricelulares</T>, formados por muitas
        células, como as plantas, os animais e nós: o corpo humano tem cerca de <T>30 trilhões</T> de células!
      </P>
      <Box kind="sabia">
        Os <strong>vírus</strong> são um caso especial: não têm células e só conseguem se multiplicar <em>dentro</em> da célula de outro ser vivo. Por isso, muitos cientistas
        nem consideram os vírus seres vivos.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🔭">A descoberta da célula</H>
      <P>
        As células são tão pequenas que, na maioria das vezes, não dá para vê-las a olho nu. Elas só foram descobertas depois da invenção do <T>microscópio</T>, um instrumento
        com lentes que aumenta muitas vezes a imagem.
      </P>
      <P>
        Em <T>1665</T>, o cientista inglês <T>Robert Hooke</T> observou uma fatia fininha de cortiça (a casca de uma árvore) e viu milhares de &ldquo;caixinhas&rdquo; vazias. Ele as
        chamou de <em>cellulae</em>, que em latim quer dizer &ldquo;pequenos quartos&rdquo;. Na verdade, Hooke viu só as paredes de células mortas, mas o nome pegou!
      </P>
      <Fig n="1.1" caption="O que Hooke viu na cortiça: as paredes das células mortas, como quartinhos vazios." h={24}>
        <CorkArt />
      </Fig>
      <P>
        Quase 200 anos depois, os cientistas Schleiden e Schwann reuniram as descobertas na <T>Teoria Celular</T>, que diz:
      </P>
      <List items={["Todos os seres vivos são formados por células.", "A célula é a unidade básica da vida: é nela que acontecem as atividades do organismo.", "Toda célula surge de outra célula que já existia."]} />
      <Box kind="experimente">
        Com a ajuda do professor, tire a película fininha de dentro de uma camada de cebola, pingue uma gota de iodo e observe no microscópio: você vai ver as células
        enfileiradas e um pontinho escuro em cada uma, o núcleo!
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🔬">A célula animal por dentro</H>
      <P>
        A célula funciona como uma pequena cidade: tem uma &ldquo;fronteira&rdquo; que controla quem entra e quem sai (a <T>membrana plasmática</T>), um &ldquo;recheio&rdquo; onde
        tudo acontece (o <T>citoplasma</T>), uma &ldquo;prefeitura&rdquo; que guarda as instruções (o <T>núcleo</T>) e várias &ldquo;fábricas&rdquo;, as <T>organelas</T>, cada
        uma com a sua função.
      </P>
      <Fig n="1.2" caption="Uma célula animal viva: as mitocôndrias soltam energia, as vesículas levam as substâncias e a membrana se mexe." h={36}>
        <AnimalCell />
      </Fig>
    </>,
  ),

  page(
    <>
      <H icon="🌿">A célula vegetal</H>
      <P>
        As células das plantas têm quase tudo o que a célula animal tem (membrana, citoplasma, núcleo, mitocôndrias, ribossomos...), mas também têm três estruturas
        especiais:
      </P>
      <List
        items={[
          <>
            <T>Parede celular</T>: uma &ldquo;armadura&rdquo; de <em>celulose</em> por fora da membrana, que dá firmeza à planta. É por causa dela que o caule fica de pé.
          </>,
          <>
            <T>Cloroplastos</T>: as organelas verdes que fazem a <em>fotossíntese</em>. O verde vem da <em>clorofila</em>, que captura a luz do Sol.
          </>,
          <>
            <T>Vacúolo grande</T>: uma bolsa enorme cheia de água e sais, que ocupa quase toda a célula e a mantém &ldquo;cheinha&rdquo;.
          </>,
        ]}
      />
      <Fig n="1.3" caption="Célula vegetal. Os cloroplastos giram em volta do vacúolo junto com o citoplasma, um movimento chamado ciclose." h={30}>
        <PlantCellArt />
      </Fig>
      <Box kind="lembre">
        Planta murcha é planta com o vacúolo vazio! Quando falta água, os vacúolos encolhem e a planta perde a firmeza. Basta regar para ela se levantar de novo.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🦠">Procariontes e eucariontes</H>
      <P>
        As células de animais, plantas e fungos guardam o DNA dentro de um núcleo: são células <T>eucariontes</T> (do grego, &ldquo;núcleo verdadeiro&rdquo;). Já as{" "}
        <T>bactérias</T> são <T>procariontes</T>: têm uma célula só, bem mais simples e menor, e o DNA fica <em>solto no citoplasma</em>, sem núcleo.
      </P>
      <Fig n="1.4" caption="Uma bactéria. O flagelo gira como uma hélice e empurra a bactéria pelo líquido." h={26}>
        <BacteriumArt />
      </Fig>
      <Table
        head={["", "Procarionte", "Eucarionte"]}
        rows={[
          ["Núcleo", "Não tem (DNA solto)", "Tem, com membrana"],
          ["Organelas", "Só ribossomos", "Muitas (mitocôndrias, Golgi...)"],
          ["Tamanho", "Bem pequena", "Até 100 vezes maior"],
          ["Exemplos", "Bactérias", "Animais, plantas, fungos"],
        ]}
      />
      <Box kind="sabia" title="E os vírus?">
        <div className="flex items-center gap-[0.7em]">
          <VirusArt />
          <span>Não são nem procariontes nem eucariontes: não têm célula! São só material genético dentro de uma capa de proteína, e precisam invadir uma célula para fazer cópias de si mesmos.</span>
        </div>
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🧩">Das células ao organismo</H>
      <P>
        Nos seres pluricelulares, as células trabalham em equipe. Células parecidas, que fazem a mesma função, formam um <T>tecido</T>. Tecidos diferentes juntos formam um{" "}
        <T>órgão</T>, como o coração. Órgãos que trabalham juntos formam um <T>sistema</T>, como o sistema circulatório. E todos os sistemas juntos formam o <T>organismo</T>.
      </P>
      <Fig n="1.5" caption="Os níveis de organização do corpo, do menor para o maior." h={20}>
        <LevelsArt />
      </Fig>
      <P>No corpo humano existem quatro tipos principais de tecido:</P>
      <Cards
        items={[
          { icon: "🛡️", title: "Epitelial", text: "Reveste e protege: a pele e o lado de dentro dos órgãos." },
          { icon: "🦴", title: "Conjuntivo", text: "Sustenta e une: ossos, cartilagens, gordura e até o sangue." },
          { icon: "💪", title: "Muscular", text: "Contrai e faz o corpo se mexer, inclusive o coração." },
          { icon: "⚡", title: "Nervoso", text: "Leva mensagens elétricas: forma o cérebro e os nervos." },
        ]}
      />
      <Box kind="mago">Nas células da raiz não há cloroplastos. Faz sentido: lá embaixo da terra não tem luz para a fotossíntese! Cada célula tem as organelas de que precisa.</Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Seres vivos são feitos de células, se alimentam, respiram, crescem, se reproduzem e reagem a estímulos.",
          "A célula foi descoberta por Robert Hooke em 1665, com o microscópio.",
          "Membrana: controla o que entra e sai. Núcleo: guarda o DNA. Mitocôndria: produz energia. Ribossomo: monta proteínas.",
          "A célula vegetal tem parede celular, cloroplastos e um vacúolo grande.",
          "Bactérias são procariontes (sem núcleo); animais, plantas e fungos são eucariontes.",
        ]}
      />
      <Glossary
        items={[
          ["Organela", "Uma “pecinha” dentro da célula com uma função própria."],
          ["Unicelular", "Ser vivo formado por uma única célula."],
          ["Pluricelular", "Ser vivo formado por muitas células."],
          ["Procarionte", "Célula sem núcleo, com o DNA solto (as bactérias)."],
          ["Eucarionte", "Célula com núcleo, que envolve o DNA."],
        ]}
      />
      <Quiz
        items={[
          ["Qual é a menor unidade de um ser vivo?", "A célula."],
          ["Qual organela é a “usina de energia” da célula?", "A mitocôndria, que faz a respiração celular."],
          ["Cite uma estrutura que a célula vegetal tem e a animal não tem.", "A parede celular, os cloroplastos ou o vacúolo grande."],
          ["Por que a bactéria é chamada de procarionte?", "Porque não tem núcleo: o DNA dela fica solto no citoplasma."],
        ]}
      />
    </>,
  ),
];
