"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { GraphPaper, MATH, MATH_DARK, Panel, Pill } from "./art";

// ============================================================================
// CAPÍTULO 5 — EQUAÇÕES E SISTEMAS (missão "Matemática: Equações e Funções", a
// parte das equações): a balança das equações, a caixinha que esconde o x, a
// balança de tocar que resolve a equação passo a passo e as duas retas do
// sistema se cruzando.
// ============================================================================

/** Um prato da balança: as caixinhas de x e os pesinhos de 1, arrumados em fileiras. */
function PanLoad({ xs, units }: { xs: number; units: number }) {
  const items: ("x" | "1")[] = [...Array(xs).fill("x"), ...Array(units).fill("1")];
  const perRow = 7;
  return (
    <g>
      {items.map((it, i) => {
        const col = i % perRow;
        const row = Math.floor(i / perRow);
        const n = Math.min(perRow, items.length - row * perRow);
        const cx = (col - (n - 1) / 2) * 15;
        const cy = -8 - row * 15;
        return it === "x" ? (
          <g key={i}>
            <rect x={cx - 7} y={cy - 7} width="14" height="14" rx="2" fill={MATH} stroke={MATH_DARK} />
            <text x={cx} y={cy + 4} textAnchor="middle" fontSize="10" fontWeight="900" fill="#fff" fontFamily="Georgia, serif">
              x
            </text>
          </g>
        ) : (
          <circle key={i} cx={cx} cy={cy} r="6" fill="#fbbf24" stroke="#b45309" />
        );
      })}
    </g>
  );
}

/** A balança com os dois pratos (a carga de cada lado), equilibrada. */
function Balance({ left, right, sway = false }: { left: [number, number]; right: [number, number]; sway?: boolean }) {
  return (
    <g>
      <rect x="150" y="168" width="100" height="14" rx="5" fill="#78350f" />
      <rect x="194" y="62" width="12" height="108" fill="#92400e" />
      <g transform="translate(200 62)">
        <g>
          {sway && <animateTransform attributeName="transform" type="rotate" values="-3;3;-3" dur="4s" repeatCount="indefinite" />}
          <rect x="-150" y="-5" width="300" height="10" rx="5" fill="#b45309" />
          <circle r="9" fill="#fbbf24" stroke="#78350f" strokeWidth="2" />
          {[-1, 1].map((side) => (
            <g key={side} transform={`translate(${side * 125} 0)`}>
              <g>
                {sway && <animateTransform attributeName="transform" type="rotate" values="3;-3;3" dur="4s" repeatCount="indefinite" />}
                <path d="M0 0 L-45 74 M0 0 L45 74" stroke="#78350f" strokeWidth="1.5" />
                <g transform="translate(0 74)">
                  <PanLoad xs={side < 0 ? left[0] : right[0]} units={side < 0 ? left[1] : right[1]} />
                  <path d="M-60 0 L60 0 Q54 16 0 16 Q-54 16 -60 0 Z" fill="#fde68a" stroke="#78350f" strokeWidth="2" />
                </g>
              </g>
            </g>
          ))}
        </g>
      </g>
    </g>
  );
}

// ---------------------------------------------------------------------------
// Abertura: a balança da equação 2x + 6 = 14
// ---------------------------------------------------------------------------

function EquationOpenerArt() {
  return (
    <Art viewBox="0 0 400 260" label="Uma balança equilibrada: num prato, duas caixinhas com x e seis pesinhos; no outro, quatorze pesinhos. A equação é 2x + 6 = 14">
      <rect width="400" height="260" fill="#f5f3ff" />
      <Balance left={[2, 6]} right={[0, 14]} sway />
      <text x="200" y="236" textAnchor="middle" fontSize="26" fontWeight="900" fill={MATH_DARK} fontFamily="Georgia, serif">
        2x + 6 = 14
      </text>
      <text x="200" y="30" textAnchor="middle" fontSize="14" fontWeight="700" fill={MATH} fontFamily="Georgia, serif">
        quanto pesa cada caixinha?
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A caixinha que esconde o número
// ---------------------------------------------------------------------------

function HiddenNumberArt() {
  return (
    <Art viewBox="0 0 560 170" label="A equação x + 3 = 7 com uma caixa no lugar do x; a tampa da caixa abre e mostra o número 4">
      <rect width="560" height="170" rx="14" fill="#faf5ff" />
      <g fontFamily="Georgia, serif" fontWeight="900" fontSize="46" fill={MATH_DARK} textAnchor="middle">
        <text x="290" y="105">+ 3 = 7</text>
      </g>
      <g transform="translate(170 62)">
        <rect x="-38" y="0" width="76" height="62" rx="6" fill="#c4b5fd" stroke={MATH_DARK} strokeWidth="3" />
        <text y="48" textAnchor="middle" fontSize="40" fontWeight="900" fill="#b91c1c" fontFamily="Georgia, serif">
          4
          <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.35;0.45;0.85;1" dur="5s" repeatCount="indefinite" />
        </text>
        {/* a tampa, que abre */}
        <g>
          <animateTransform attributeName="transform" type="rotate" values="0 -38 0;0 -38 0;-70 -38 0;-70 -38 0;0 -38 0" keyTimes="0;0.3;0.42;0.85;1" dur="5s" repeatCount="indefinite" />
          <rect x="-42" y="-10" width="84" height="12" rx="3" fill={MATH} stroke={MATH_DARK} strokeWidth="2" />
          <text y="-16" textAnchor="middle" fontSize="22" fontWeight="900" fill={MATH} fontFamily="Georgia, serif">
            x
          </text>
        </g>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A balança de tocar: resolvendo a equação passo a passo
// ---------------------------------------------------------------------------

type Load = { l: [number, number]; r: [number, number] };

const SOLVES: { eq: string; states: Load[]; moves: string[] }[] = [
  {
    eq: "2x + 6 = 14",
    states: [
      { l: [2, 6], r: [0, 14] },
      { l: [2, 0], r: [0, 8] },
      { l: [1, 0], r: [0, 4] },
    ],
    moves: ["Tire 6 pesinhos dos dois lados", "Divida os dois lados por 2"],
  },
  {
    eq: "x + 5 = 2x + 1",
    states: [
      { l: [1, 5], r: [2, 1] },
      { l: [0, 5], r: [1, 1] },
      { l: [0, 4], r: [1, 0] },
    ],
    moves: ["Tire uma caixinha dos dois lados", "Tire 1 pesinho dos dois lados"],
  },
  {
    eq: "3x + 2 = x + 10",
    states: [
      { l: [3, 2], r: [1, 10] },
      { l: [2, 2], r: [0, 10] },
      { l: [2, 0], r: [0, 8] },
      { l: [1, 0], r: [0, 4] },
    ],
    moves: ["Tire uma caixinha dos dois lados", "Tire 2 pesinhos dos dois lados", "Divida os dois lados por 2"],
  },
];

function sideText([x, u]: [number, number]): string {
  const xs = x === 0 ? "" : x === 1 ? "x" : `${x}x`;
  if (!xs) return String(u);
  return u ? `${xs} + ${u}` : xs;
}

export function BalanceSolver() {
  const [eq, setEq] = useState(0);
  const [step, setStep] = useState(0);
  const { states, moves } = SOLVES[eq];
  const state = states[step];
  const done = step >= states.length - 1;
  return (
    <Panel title="Resolva com a balança">
      <div className="flex flex-wrap justify-center gap-[0.3em]">
        {SOLVES.map((s, i) => (
          <Pill
            key={s.eq}
            on={eq === i}
            onClick={() => {
              setEq(i);
              setStep(0);
            }}
          >
            {s.eq}
          </Pill>
        ))}
      </div>
      <svg viewBox="0 0 400 190" className="mx-auto mt-[0.2em] block h-[8.5em] w-full" aria-label={`A balança mostrando ${sideText(state.l)} = ${sideText(state.r)}`}>
        <Balance left={state.l} right={state.r} />
      </svg>
      <p key={`${eq}-${step}`} className="cg-anim-fade text-center text-[1.3em] font-black" style={{ color: MATH_DARK }}>
        {done ? `x = ${state.r[1]}` : `${sideText(state.l)} = ${sideText(state.r)}`}
      </p>
      <div className="mt-[0.2em] flex justify-center">
        <button
          type="button"
          onClick={() => setStep((s) => (done ? 0 : s + 1))}
          className="rounded-full px-[1em] py-[0.15em] text-[0.85em] font-black text-white shadow hover:scale-105"
          style={{ background: MATH }}
        >
          {done ? "↺ De novo" : `${moves[step]} ➜`}
        </button>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// O sistema: duas retas se cruzando
// ---------------------------------------------------------------------------

function SystemArt() {
  // o plano de 0 a 10 nos dois eixos: cada unidade são 16 px
  const px = (x: number) => 40 + x * 16;
  const py = (y: number) => 180 - y * 16;
  return (
    <Art viewBox="0 0 560 200" label="Um gráfico com duas retas: x + y = 10, que desce, e x − y = 4, que sobe. Elas se cruzam no ponto x = 7, y = 3, a solução do sistema">
      <rect width="560" height="200" rx="14" fill="#faf5ff" />
      <GraphPaper x={40} y={20} w={176} h={160} step={16} />
      <line x1={px(0)} y1={py(0)} x2={px(11)} y2={py(0)} stroke="#334155" strokeWidth="2" />
      <line x1={px(0)} y1={py(0)} x2={px(0)} y2={py(10)} stroke="#334155" strokeWidth="2" />
      <line x1={px(0)} y1={py(10)} x2={px(10)} y2={py(0)} stroke="#2563eb" strokeWidth="3" />
      <line x1={px(4)} y1={py(0)} x2={px(11)} y2={py(7)} stroke="#ea580c" strokeWidth="3" />
      <path d={`M${px(7)} ${py(0)} L${px(7)} ${py(3)} L${px(0)} ${py(3)}`} fill="none" stroke={MATH} strokeWidth="1.5" strokeDasharray="4 3" />
      <circle cx={px(7)} cy={py(3)} r="6" fill={MATH} stroke="#fff" strokeWidth="2">
        <animate attributeName="r" values="5;8;5" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <g fontFamily="Georgia, serif" fontWeight="900">
        <text x={px(7)} y="196" textAnchor="middle" fontSize="11" fill={MATH_DARK}>
          7
        </text>
        <text x="30" y={py(3) + 4} textAnchor="middle" fontSize="11" fill={MATH_DARK}>
          3
        </text>
        <text x="270" y="60" fontSize="16" fill="#2563eb">
          x + y = 10
        </text>
        <text x="270" y="90" fontSize="16" fill="#ea580c">
          x − y = 4
        </text>
        <text x="270" y="130" fontSize="15" fill="#334155">
          somando as duas: 2x = 14
        </text>
        <text x="270" y="160" fontSize="18" fill={MATH_DARK}>
          x = 7 e y = 3
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 5, content, bare });

export const chapter5: BookPage[] = [
  page(
    <ChapterOpener
      n={5}
      title="Equações e Sistemas"
      goals={["O que é uma equação e a incógnita", "Como resolver uma equação do 1º grau", "Como transformar um problema em equação", "Como resolver um sistema de duas equações"]}
    >
      <Fig h={34}>
        <EquationOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="📦">O que é uma equação</H>
      <P>
        Uma <T>equação</T> é uma igualdade com um valor desconhecido, a <T>incógnita</T>, que costuma ser chamada de x. Em x + 3 = 7, qual número somado com 3 dá 7? O
        4. Resolver a equação é descobrir o que a caixinha esconde.
      </P>
      <Fig n="5.1" caption="O x é uma caixinha com um número escondido dentro." h={18}>
        <HiddenNumberArt />
      </Fig>
      <Cards
        items={[
          { icon: "⬅️", title: "1º membro", text: "Tudo o que fica à esquerda do sinal de igual." },
          { icon: "➡️", title: "2º membro", text: "Tudo o que fica à direita do sinal de igual." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="⚖️">Resolvendo com a balança</H>
      <P>
        Uma equação é como uma balança equilibrada: se fizermos <T>a mesma coisa dos dois lados</T> (tirar, somar, multiplicar ou dividir), ela continua equilibrada.
        O objetivo é deixar o x sozinho.
      </P>
      <BalanceSolver />
    </>,
  ),

  page(
    <>
      <H icon="🗣️">Do problema pra equação</H>
      <P>Muitos problemas viram equação quando “traduzimos” as frases pra linguagem da álgebra:</P>
      <Table
        head={["Em palavras", "Em álgebra"]}
        rows={[
          ["um número", "x"],
          ["o dobro de um número", "2x"],
          ["um número mais 5", "x + 5"],
          ["a metade de um número", "x ÷ 2"],
          ["o triplo de um número menos 5", "3x − 5"],
        ]}
      />
      <Box kind="mago" title="Um exemplo">
        “O triplo de um número menos 5 é igual ao dobro dele mais 7.” Fica 3x − 5 = 2x + 7. Passando o 2x pra esquerda e o −5 pra direita: x = 7 + 5 ={" "}
        <strong>12</strong>.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="✖️">Sistemas de equações</H>
      <P>
        Um <T>sistema</T> tem duas equações com duas incógnitas, que precisam valer ao mesmo tempo. Em x + y = 10 e x − y = 4, somando as duas equações o y some: 2x =
        14, então x = 7 e y = 3.
      </P>
      <Fig n="5.2" caption="Cada equação é uma reta; a solução é o ponto onde elas se cruzam." h={21}>
        <SystemArt />
      </Fig>
      <Box kind="lembre">Sempre confira a resposta: 7 + 3 = 10 ✔ e 7 − 3 = 4 ✔.</Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Equação é uma igualdade com uma incógnita (o x), um valor desconhecido.",
          "Pra resolver, faça a mesma operação dos dois lados até o x ficar sozinho.",
          "2x + 6 = 14 → 2x = 8 → x = 4.",
          "Problemas viram equações: “o dobro de um número mais 5” é 2x + 5.",
          "Um sistema tem duas equações; somar as equações pode fazer uma incógnita sumir.",
        ]}
      />
      <Glossary
        items={[
          ["Incógnita", "O valor desconhecido da equação."],
          ["Equação do 1º grau", "Equação em que o x não tem expoente maior que 1."],
          ["Membro", "Cada lado do sinal de igual."],
          ["Raiz", "O valor que torna a equação verdadeira."],
          ["Sistema", "Um grupo de equações que valem ao mesmo tempo."],
        ]}
      />
      <Quiz
        items={[
          ["Qual é o valor de x em 2x + 6 = 14?", "4."],
          ["Qual é o valor de x em 3x − 5 = 2x + 7?", "12."],
          ["Como se escreve “o dobro de um número” em álgebra?", "2x."],
          ["No sistema x + y = 10 e x − y = 4, quanto valem x e y?", "x = 7 e y = 3."],
        ]}
      />
    </>,
  ),
];
