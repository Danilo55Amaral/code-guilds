"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Ball, Beaker } from "./art";

// ============================================================================
// CAPÍTULO 6 — MOL E ESTEQUIOMETRIA (missão "Química: Mol e
// Estequiometria"): a balança com 18 g de água (1 mol), a dúzia, a resma e o
// mol, a calculadora de massa molar de tocar, o sanduíche que explica o
// reagente limitante e o volume de 1 mol de gás.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: 18 g de água = 1 mol = 6,02 × 10²³ moléculas
// ---------------------------------------------------------------------------

function MoleOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma balança com 18 gramas de água, que é 1 mol de moléculas: 6,02 vezes 10 elevado a 23">
      {/* a balança digital */}
      <rect x="120" y="220" width="220" height="40" rx="8" fill="#334155" />
      <rect x="150" y="230" width="100" height="22" rx="4" fill="#052e16" />
      <text x="200" y="247" textAnchor="middle" fontSize="16" fontWeight="900" fill="#4ade80" fontFamily="monospace">
        18,0 g
      </text>
      <rect x="110" y="208" width="240" height="12" rx="4" fill="#94a3b8" />
      <Beaker x={185} y={110} w={90} h={98} liquid="#7dd3fc" level={0.55} />
      {/* os números subindo como faíscas */}
      {["6", "0", "2", "×", "10²³"].map((d, i) => (
        <text
          key={i}
          x={190 + i * 18}
          y="104"
          fontSize="18"
          fontWeight="900"
          fill="#a21caf"
          fontFamily="Georgia, serif"
          className="cg-anim-aura-rise"
          style={{ "--cg-dur": "3s", "--cg-delay": `${i * 0.5}s` } as React.CSSProperties}
        >
          {d}
        </text>
      ))}
      <g fontFamily="Georgia, serif" textAnchor="middle">
        <text x="230" y="40" fontSize="22" fontWeight="900" fill="#701a75">
          1 mol de água
        </text>
        <text x="230" y="64" fontSize="15" fill="#3b2a14">
          = 6,02 × 10²³ moléculas
        </text>
      </g>
      {/* moléculas de água girando em volta */}
      {[
        [70, 120], [390, 130], [80, 220], [390, 220],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <g className="cg-anim-orbit-rev" style={{ "--cg-dur": `${8 + i * 2}s` } as React.CSSProperties}>
            <Ball el="O" r={13} label={false} />
            <Ball el="H" x={-13} y={10} r={8} label={false} />
            <Ball el="H" x={13} y={10} r={8} label={false} />
          </g>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A dúzia, a resma e o mol
// ---------------------------------------------------------------------------

function CountingArt() {
  return (
    <Art viewBox="0 0 600 190" label="Unidades de contar: uma dúzia tem 12 ovos, uma resma tem 500 folhas e um mol tem 6,02 vezes 10 elevado a 23 partículas">
      {/* a dúzia de ovos */}
      <g transform="translate(100 80)">
        <rect x="-80" y="-30" width="160" height="62" rx="10" fill="#d6d3d1" stroke="#78716c" strokeWidth="2" />
        {Array.from({ length: 12 }, (_, i) => (
          <ellipse key={i} cx={-62 + (i % 6) * 25} cy={-14 + Math.floor(i / 6) * 28} rx="10" ry="12" fill="#fef3c7" stroke="#d97706" strokeWidth="1.2" className="cg-anim-pop" style={{ animationDelay: `${i * 0.05}s` }} />
        ))}
      </g>
      {/* a resma de papel */}
      <g transform="translate(300 80)">
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={-60 + i * 1.5} y={20 - i * 7} width="120" height="10" rx="2" fill="#fff" stroke="#94a3b8" strokeWidth="1.2" />
        ))}
      </g>
      {/* o mol: um monte cintilante de partículas */}
      <g transform="translate(500 80)">
        <path d="M-80 36 Q0 -60 80 36 Z" fill="#f5d0fe" stroke="#a21caf" strokeWidth="2" />
        {Array.from({ length: 30 }, (_, i) => (
          <circle key={i} cx={-60 + ((i * 37) % 120)} cy={30 - ((i * 13) % 50) * (1 - Math.abs(((i * 37) % 120) - 60) / 90)} r="3" fill="#a21caf" className="cg-anim-twinkle" style={{ animationDelay: `${(i % 7) * 0.3}s` }} />
        ))}
      </g>
      {[
        ["1 dúzia", "12 ovos"],
        ["1 resma", "500 folhas"],
        ["1 mol", "6,02 × 10²³ partículas"],
      ].map(([a, b], i) => (
        <g key={a} fontFamily="Georgia, serif" textAnchor="middle">
          <text x={100 + i * 200} y="150" fontSize="15" fontWeight="900" fill="#3b2a14">
            {a}
          </text>
          <text x={100 + i * 200} y="170" fontSize="12.5" fill="#5b4a2e">
            {b}
          </text>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A calculadora de massa molar
// ---------------------------------------------------------------------------

const ATOMIC_MASS: Record<string, number> = { H: 1, C: 12, N: 14, O: 16, Na: 23, Cl: 35.5 };
const MOLECULES: { formula: string; name: string; atoms: [string, number][] }[] = [
  { formula: "H₂O", name: "água", atoms: [["H", 2], ["O", 1]] },
  { formula: "CO₂", name: "gás carbônico", atoms: [["C", 1], ["O", 2]] },
  { formula: "NaCl", name: "sal de cozinha", atoms: [["Na", 1], ["Cl", 1]] },
  { formula: "O₂", name: "gás oxigênio", atoms: [["O", 2]] },
  { formula: "CH₄", name: "metano", atoms: [["C", 1], ["H", 4]] },
  { formula: "C₆H₁₂O₆", name: "glicose", atoms: [["C", 6], ["H", 12], ["O", 6]] },
];

const fmt = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

export function MolarMassCalc() {
  const [sel, setSel] = useState(0);
  const m = MOLECULES[sel];
  const total = m.atoms.reduce((s, [el, n]) => s + ATOMIC_MASS[el] * n, 0);
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <div className="flex flex-wrap justify-center gap-[0.3em]">
        {MOLECULES.map((mol, i) => (
          <button
            key={mol.formula}
            type="button"
            onClick={() => setSel(i)}
            className={`rounded-full border px-[0.7em] py-[0.15em] font-mono text-[0.9em] font-black transition-colors ${sel === i ? "border-[#a21caf] bg-[#a21caf] text-white" : "border-[#d9c79d] bg-white text-[#3b2a14] hover:bg-[#fdf4ff]"}`}
          >
            {mol.formula}
          </button>
        ))}
      </div>
      <div key={sel} className="cg-anim-fade mt-[0.5em] flex flex-wrap items-center justify-center gap-[0.8em]">
        <svg viewBox="0 0 200 70" className="h-[3.6em] w-auto" aria-hidden="true">
          {m.atoms
            .flatMap(([el, n]) => Array.from({ length: Math.min(n, 6) }, () => el))
            .map((el, i) => (
              <Ball key={i} el={el} x={18 + (i % 8) * 23} y={i >= 8 ? 54 : 24} r={el === "H" ? 9 : 12} />
            ))}
        </svg>
        <div className="text-[0.9em] leading-[1.5]">
          <p className="font-bold text-[#701a75]">
            {m.formula} ({m.name})
          </p>
          <p className="font-mono">
            {m.atoms.map(([el, n], i) => (
              <span key={el}>
                {i > 0 && " + "}
                {n > 1 ? `${n} × ` : ""}
                {fmt(ATOMIC_MASS[el])}
              </span>
            ))}{" "}
            = <strong className="text-[1.15em] text-[#701a75]">{fmt(total)} g/mol</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// O reagente limitante: os sanduíches
// ---------------------------------------------------------------------------

function SandwichArt() {
  const bread = (x: number, y: number, k: number, faded = false) => (
    <path key={k} d={`M${x - 22} ${y + 8} Q${x - 24} ${y - 10} ${x} ${y - 12} Q${x + 24} ${y - 10} ${x + 22} ${y + 8} Z`} fill="#f59e0b" stroke="#92400e" strokeWidth="1.5" opacity={faded ? 0.4 : 1} />
  );
  const cheese = (x: number, y: number, k: number) => <rect key={k} x={x - 22} y={y - 5} width="44" height="10" rx="2" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />;
  return (
    <Art viewBox="0 0 560 200" label="Com 6 pães e 2 fatias de queijo, dá para fazer 2 sanduíches de 2 pães e 1 queijo: o queijo acaba primeiro e sobram 2 pães">
      <g fontFamily="Georgia, serif" fontSize="12.5" fontWeight="900" textAnchor="middle" fill="#3b2a14">
        <text x="110" y="20">Temos: 6 pães e 2 queijos</text>
        <text x="420" y="20">Receita: 2 pães + 1 queijo</text>
      </g>
      {[0, 1, 2, 3, 4, 5].map((i) => bread(50 + (i % 3) * 56, 60 + Math.floor(i / 3) * 34, i))}
      {[0, 1].map((i) => cheese(80 + i * 56, 140, 10 + i))}
      <path d="M230 100 L290 100" stroke="#a21caf" strokeWidth="4" />
      <path d="M282 92 L294 100 L282 108" stroke="#a21caf" strokeWidth="4" fill="none" />
      {/* os dois sanduíches */}
      {[0, 1].map((i) => (
        <g key={i} className="cg-anim-pop" style={{ animationDelay: `${0.3 + i * 0.3}s` }}>
          {bread(350 + i * 70, 96, 20 + i)}
          {cheese(350 + i * 70, 104, 30 + i)}
          {bread(350 + i * 70, 116, 40 + i)}
        </g>
      ))}
      {/* os pães que sobram */}
      {[0, 1].map((i) => bread(480 + i * 52, 170, 50 + i, true))}
      <g fontFamily="Georgia, serif" fontSize="12" fontWeight="700" textAnchor="middle">
        <text x="385" y="150" fill="#15803d">2 sanduíches</text>
        <text x="506" y="196" fill="#92400e">sobram 2 pães (excesso)</text>
        <text x="108" y="176" fill="#b91c1c">o queijo é o limitante</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O volume de 1 mol de gás
// ---------------------------------------------------------------------------

function GasVolumeArt() {
  return (
    <Art viewBox="0 0 540 200" label="Uma caixa de 22,4 litros, com cerca de 28 centímetros de lado, ao lado de uma bola de basquete: é o volume de 1 mol de gás nas CNTP">
      <g transform="translate(150 40)">
        <path d="M0 40 L110 40 L110 150 L0 150 Z" fill="#ede9fe" stroke="#7c3aed" strokeWidth="2.5" />
        <path d="M0 40 L36 10 L146 10 L110 40 Z" fill="#ddd6fe" stroke="#7c3aed" strokeWidth="2.5" />
        <path d="M110 40 L146 10 L146 120 L110 150 Z" fill="#c4b5fd" stroke="#7c3aed" strokeWidth="2.5" />
        {Array.from({ length: 14 }, (_, i) => (
          <circle key={i} cx={14 + ((i * 29) % 84)} cy={56 + ((i * 41) % 84)} r="4" fill="#7c3aed">
            <animateMotion path={`M0 0 L${((i * 13) % 20) - 10} ${((i * 17) % 20) - 10} Z`} dur={`${0.8 + (i % 3) * 0.3}s`} repeatCount="indefinite" />
          </circle>
        ))}
        <text x="-14" y="100" textAnchor="end" fontSize="15" fontWeight="900" fill="#5b21b6" fontFamily="Georgia, serif">
          22,4 L
        </text>
      </g>
      <g transform="translate(400 120)">
        <circle r="42" fill="#f97316" stroke="#7c2d12" strokeWidth="2.5" />
        <path d="M-42 0 L42 0 M0 -42 L0 42 M-30 -30 C-10 -10 -10 10 -30 30 M30 -30 C10 -10 10 10 30 30" stroke="#7c2d12" strokeWidth="2" fill="none" />
        <text y="66" textAnchor="middle" fontSize="12" fill="#5b4a2e" fontFamily="Georgia, serif">
          bola de basquete (≈ 7 L)
        </text>
      </g>
      <text x="200" y="22" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#3b2a14" fontFamily="Georgia, serif">
        1 mol de qualquer gás a 0 °C e 1 atm
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 6, content, bare });

export const chapter6: BookPage[] = [
  page(
    <ChapterOpener
      n={6}
      title="Mol e Estequiometria"
      goals={["O que é o mol e por que ele é uma “dúzia gigante”", "Como calcular a massa molar", "Como usar as proporções de uma reação", "O que é o reagente limitante"]}
    >
      <Fig h={34}>
        <MoleOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🥚">O mol: uma dúzia gigante</H>
      <P>
        Os átomos e as moléculas são tão pequenos que não dá para contá-los um por um. Por isso os químicos usam uma unidade de contagem especial, o <T>mol</T>. Assim como uma
        dúzia sempre tem 12 coisas, um mol sempre tem o mesmo número de partículas:
      </P>
      <div className="my-[0.4em] rounded-xl border-2 border-[#a21caf] bg-[#fdf4ff] px-[0.8em] py-[0.4em] text-center font-bold text-[#701a75]">
        1 mol = 6,02 × 10²³ partículas (a constante de Avogadro)
      </div>
      <Fig n="6.1" caption="Unidades de contar: a dúzia, a resma e o mol." h={20}>
        <CountingArt />
      </Fig>
      <Box kind="sabia">
        6,02 × 10²³ é o número 602 seguido de 21 zeros! Se você tivesse 1 mol de grãos de arroz, eles cobririam a Terra inteira, oceanos incluídos, com uma camada da altura de
        um prédio de dez andares.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="⚖️">Massa molar</H>
      <P>
        A <T>massa molar</T> é a massa de 1 mol de uma substância, em gramas por mol (g/mol). Para calcular, somamos as massas dos átomos da fórmula, que estão na Tabela
        Periódica:
      </P>
      <Table head={["Elemento", "H", "C", "N", "O", "Na", "Cl"]} rows={[["Massa (g/mol)", "1", "12", "14", "16", "23", "35,5"]]} />
      <MolarMassCalc />
      <P>
        Exemplo: a água (H₂O) tem 2 × 1 + 16 = <T>18 g/mol</T>. Então 2 mols de água pesam 2 × 18 = <T>36 g</T>.
      </P>
    </>,
  ),

  page(
    <>
      <H icon="🧁">Calculando com as reações</H>
      <P>
        A <T>estequiometria</T> é o cálculo das quantidades numa reação. Ela funciona como uma receita: os coeficientes da equação balanceada dizem a <T>proporção</T> entre os
        participantes.
      </P>
      <div className="my-[0.4em] rounded-xl border-2 border-[#a21caf] bg-[#fdf4ff] px-[0.8em] py-[0.4em] text-center font-bold text-[#701a75]">
        2 H₂ + 1 O₂ → 2 H₂O &nbsp;(proporção 2 : 1 : 2)
      </div>
      <List
        items={[
          <>Com 4 mols de H₂, reagem 2 mols de O₂ (a metade).</>,
          <>E formam-se 4 mols de água (a proporção H₂ : H₂O é 1 : 1).</>,
        ]}
      />
      <P>
        Quando um reagente acaba antes do outro, ele é o <T>reagente limitante</T>: é ele que decide quanto produto vai ser formado. O que sobra é o <T>reagente em excesso</T>.
      </P>
      <Fig n="6.2" caption="O reagente limitante explicado com sanduíches." h={22}>
        <SandwichArt />
      </Fig>
    </>,
  ),

  page(
    <>
      <H icon="🎈">O volume dos gases</H>
      <P>
        Nos gases, acontece uma coisa curiosa: 1 mol de <em>qualquer</em> gás ocupa o mesmo volume nas mesmas condições. Nas <T>CNTP</T> (condições normais de temperatura e
        pressão: 0 °C e 1 atmosfera), esse volume é de <T>22,4 litros</T>, o <T>volume molar</T>.
      </P>
      <Fig n="6.3" caption="1 mol de gás nas CNTP enche uma caixa de cerca de 28 cm de lado." h={22}>
        <GasVolumeArt />
      </Fig>
      <Box kind="lembre" title="Pra que serve tudo isso?">
        É a estequiometria que diz a uma fábrica quanto de cada ingrediente usar para fazer um remédio, um fertilizante ou um plástico, sem desperdício e sem faltar nada.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "1 mol = 6,02 × 10²³ partículas (constante de Avogadro).",
          "Massa molar = soma das massas dos átomos: H₂O = 18 g/mol, CO₂ = 44 g/mol, NaCl = 58,5 g/mol.",
          "Os coeficientes da equação balanceada dão a proporção da reação.",
          "O reagente limitante acaba primeiro e decide quanto produto se forma.",
          "1 mol de qualquer gás nas CNTP ocupa 22,4 L.",
        ]}
      />
      <Glossary
        items={[
          ["Mol", "Unidade de contagem: 6,02 × 10²³ partículas."],
          ["Massa molar", "A massa de 1 mol, em g/mol."],
          ["Estequiometria", "O cálculo das quantidades numa reação."],
          ["Reagente limitante", "O reagente que acaba primeiro."],
          ["CNTP", "0 °C e 1 atmosfera de pressão."],
        ]}
      />
      <Quiz
        items={[
          ["Quantas partículas existem em 1 mol?", "6,02 × 10²³."],
          ["Qual é a massa molar do CO₂ (C = 12, O = 16)?", "12 + 2 × 16 = 44 g/mol."],
          ["Em 2 H₂ + O₂ → 2 H₂O, quantos mols de O₂ reagem com 4 mols de H₂?", "2 mols."],
          ["Qual é o volume de 1 mol de gás nas CNTP?", "22,4 litros."],
        ]}
      />
    </>,
  ),
];
