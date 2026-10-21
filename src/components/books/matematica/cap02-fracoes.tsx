"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { MATH, MATH_DARK, Panel, Pill } from "./art";

// ============================================================================
// CAPÍTULO 2 — DIVISORES, PRIMOS E FRAÇÕES (missão "Matemática: Operações e
// Frações", a parte das frações): a pizza sendo comida fatia por fatia, o
// crivo de Eratóstenes (de tocar), os saltos do 4 e do 6 até o MMC, a pizza
// das frações (de tocar) e as barras das frações equivalentes.
// ============================================================================

/** O caminho de uma fatia de pizza (o centro em cx, cy), da fatia `i` de `n`. */
function slice(cx: number, cy: number, r: number, i: number, n: number): string {
  if (n === 1) return `M${cx - r} ${cy} A${r} ${r} 0 1 1 ${cx + r} ${cy} A${r} ${r} 0 1 1 ${cx - r} ${cy} Z`;
  const a0 = (i / n) * 2 * Math.PI - Math.PI / 2;
  const a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
  const p = (a: number) => `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  return `M${cx} ${cy} L${p(a0)} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p(a1)} Z`;
}

// ---------------------------------------------------------------------------
// Abertura: a pizza sendo comida
// ---------------------------------------------------------------------------

function PizzaOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma pizza cortada em 8 fatias; as fatias somem uma de cada vez e a fração ao lado mostra quanto ainda sobra">
      <rect width="460" height="300" fill="#fff7ed" />
      <ellipse cx="190" cy="160" rx="128" ry="128" fill="#d6d3d1" />
      <circle cx="190" cy="152" r="118" fill="#fbbf24" />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={slice(190, 152, 108, i, 8)} fill="#f97316" stroke="#fde68a" strokeWidth="4">
          {/* as fatias 6, 7 e 8 vão sendo comidas */}
          {i >= 5 && <animate attributeName="opacity" values="1;1;0;0;1" keyTimes={`0;${0.15 + (i - 5) * 0.2};${0.2 + (i - 5) * 0.2};0.9;1`} dur="7s" repeatCount="indefinite" />}
        </path>
      ))}
      {[
        [160, 110],
        [225, 120],
        [150, 190],
        [220, 200],
        [190, 150],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="9" fill="#b91c1c" />
      ))}
      <g fontFamily="Georgia, serif" fontWeight="900" textAnchor="middle">
        <text x="380" y="130" fontSize="44" fill={MATH_DARK}>
          <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.19;0.2;0.95;1" dur="7s" repeatCount="indefinite" />
          8/8
        </text>
        <text x="380" y="130" fontSize="44" fill={MATH_DARK} opacity="0">
          <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.19;0.2;0.39;0.4;1" dur="7s" repeatCount="indefinite" />
          7/8
        </text>
        <text x="380" y="130" fontSize="44" fill={MATH_DARK} opacity="0">
          <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.39;0.4;0.59;0.6;1" dur="7s" repeatCount="indefinite" />
          6/8
        </text>
        <text x="380" y="130" fontSize="44" fill={MATH_DARK} opacity="0">
          <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.59;0.6;0.9;0.95;1" dur="7s" repeatCount="indefinite" />
          5/8
        </text>
        <text x="380" y="168" fontSize="15" fill="#9a3412">
          da pizza sobrou
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O crivo de Eratóstenes (de tocar)
// ---------------------------------------------------------------------------

const SIEVE_PRIMES = [2, 3, 5, 7];

export function PrimeSieve() {
  const [step, setStep] = useState(0);
  const used = SIEVE_PRIMES.slice(0, step);
  const done = step >= SIEVE_PRIMES.length;
  const crossedBy = (n: number) => used.find((p) => n !== p && n % p === 0);
  return (
    <Panel title="O crivo de Eratóstenes">
      <div className="mx-auto grid max-w-[17em] grid-cols-10 gap-[2px] text-center text-[0.72em] font-bold">
        {Array.from({ length: 50 }, (_, k) => {
          const n = k + 1;
          const by = crossedBy(n);
          const prime = n > 1 && !by && (done || used.includes(n));
          return (
            <span
              key={n}
              className="rounded-[3px] py-[0.15em] transition-colors"
              style={{
                background: n === 1 ? "#e7e5e4" : prime ? MATH : by ? "#fee2e2" : "#f5f3ff",
                color: n === 1 ? "#78716c" : prime ? "#fff" : by ? "#fca5a5" : MATH_DARK,
                textDecoration: by ? "line-through" : undefined,
              }}
            >
              {n}
            </span>
          );
        })}
      </div>
      <div className="mt-[0.4em] flex flex-wrap items-center justify-center gap-[0.4em] text-[0.85em]">
        {done ? (
          <>
            <span className="font-bold" style={{ color: MATH_DARK }}>
              Sobraram os 15 primos até 50!
            </span>
            <Pill onClick={() => setStep(0)}>↺ De novo</Pill>
          </>
        ) : (
          <button type="button" onClick={() => setStep((s) => s + 1)} className="rounded-full px-[1em] py-[0.15em] font-black text-white shadow hover:scale-105" style={{ background: MATH }}>
            Riscar os múltiplos de {SIEVE_PRIMES[step]}
          </button>
        )}
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Os saltos do 4 e do 6 até o MMC
// ---------------------------------------------------------------------------

function LcmArt() {
  const x = (n: number) => 40 + n * 20;
  const hops = (step: number, y: number, color: string, up: boolean) =>
    Array.from({ length: 24 / step }, (_, i) => {
      const a = x(i * step);
      const b = x((i + 1) * step);
      const mid = (a + b) / 2;
      const peak = up ? y - 34 : y + 34;
      const len = Math.ceil(step * 20 * 1.6);
      return (
        <path key={i} d={`M${a} ${y} Q${mid} ${peak} ${b} ${y}`} fill="none" stroke={color} strokeWidth="3" strokeDasharray={len} strokeDashoffset={len}>
          <animate attributeName="stroke-dashoffset" values={`${len};${len};0;0`} keyTimes={`0;${(i * 0.12).toFixed(2)};${(i * 0.12 + 0.1).toFixed(2)};1`} dur="6s" repeatCount="indefinite" />
        </path>
      );
    });
  return (
    <Art viewBox="0 0 560 200" label="Uma reta numérica de 0 a 24: o 4 salta de 4 em 4 por cima e o 6 de 6 em 6 por baixo; eles se encontram primeiro no 12, o MMC">
      <rect width="560" height="200" rx="14" fill="#faf5ff" />
      <line x1="30" y1="100" x2="530" y2="100" stroke="#475569" strokeWidth="2" />
      {Array.from({ length: 25 }, (_, n) => (
        <g key={n}>
          <line x1={x(n)} y1="95" x2={x(n)} y2="105" stroke="#475569" strokeWidth={n % 2 ? 1 : 2} />
          {n % 2 === 0 && (
            <text x={x(n)} y="122" textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155" fontFamily="Georgia, serif">
              {n}
            </text>
          )}
        </g>
      ))}
      {hops(4, 100, "#2563eb", true)}
      {hops(6, 100, "#ea580c", false)}
      <circle cx={x(12)} cy="100" r="13" fill="none" stroke={MATH} strokeWidth="3">
        <animate attributeName="r" values="11;15;11" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <g fontFamily="Georgia, serif" fontWeight="900" fontSize="13">
        <text x="40" y="34" fill="#2563eb">
          o 4 salta de 4 em 4
        </text>
        <text x="40" y="178" fill="#ea580c">
          o 6 salta de 6 em 6
        </text>
        <text x="520" y="34" textAnchor="end" fill={MATH_DARK}>
          MMC(4, 6) = 12
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A pizza das frações (de tocar)
// ---------------------------------------------------------------------------

export function FractionPizza() {
  const [num, setNum] = useState(3);
  const [den, setDen] = useState(4);
  const changeDen = (d: number) => {
    const nd = Math.max(1, Math.min(12, d));
    setDen(nd);
    setNum((n) => Math.min(n, nd));
  };
  const step = "flex h-[1.6em] w-[1.6em] items-center justify-center rounded-full border border-[#d9c79d] bg-white font-black";
  return (
    <Panel title="Monte a sua fração">
      <div className="flex flex-wrap items-center justify-center gap-[1em]">
        <svg viewBox="0 0 120 120" className="h-[7.5em] w-[7.5em]" aria-label={`Uma pizza dividida em ${den} fatias, com ${num} pintadas`}>
          <circle cx="60" cy="60" r="56" fill="#fde68a" />
          {Array.from({ length: den }, (_, i) => (
            <path key={`${den}-${i}`} d={slice(60, 60, 52, i, den)} fill={i < num ? "#f97316" : "#fff7ed"} stroke="#b45309" strokeWidth="1.5" />
          ))}
        </svg>
        <div className="flex items-center gap-[0.6em]">
          <div className="flex flex-col items-center gap-[0.2em]">
            <div className="flex items-center gap-[0.3em]">
              <button type="button" className={step} onClick={() => setNum((n) => Math.max(0, n - 1))} aria-label="Menos uma fatia pintada">
                −
              </button>
              <span className="cg-book-title w-[1.4em] text-center text-[1.6em] font-black" style={{ color: "#c2410c" }}>
                {num}
              </span>
              <button type="button" className={step} onClick={() => setNum((n) => Math.min(den, n + 1))} aria-label="Mais uma fatia pintada">
                +
              </button>
            </div>
            <span className="h-[3px] w-[5.5em] rounded bg-[#3b2a14]" />
            <div className="flex items-center gap-[0.3em]">
              <button type="button" className={step} onClick={() => changeDen(den - 1)} aria-label="Menos fatias na pizza">
                −
              </button>
              <span className="cg-book-title w-[1.4em] text-center text-[1.6em] font-black" style={{ color: MATH_DARK }}>
                {den}
              </span>
              <button type="button" className={step} onClick={() => changeDen(den + 1)} aria-label="Mais fatias na pizza">
                +
              </button>
            </div>
          </div>
          <div className="text-[0.8em] leading-[1.5] text-[#3b2a14]">
            <p>
              <strong style={{ color: "#c2410c" }}>numerador</strong>: as fatias pintadas
            </p>
            <p>
              <strong style={{ color: MATH_DARK }}>denominador</strong>: em quantas partes dividiu
            </p>
            <p className="mt-[0.2em] font-bold">= {(num / den).toLocaleString("pt-BR", { maximumFractionDigits: 3 })} em decimal</p>
          </div>
        </div>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As barras das frações equivalentes
// ---------------------------------------------------------------------------

function EquivalentArt() {
  const bars = [
    { n: 2, label: "1/2" },
    { n: 4, label: "2/4" },
    { n: 8, label: "4/8" },
  ];
  return (
    <Art viewBox="0 0 560 190" label="Três barras do mesmo tamanho: uma dividida em 2 com 1 parte pintada, outra em 4 com 2 pintadas e outra em 8 com 4 pintadas; todas pintadas até a metade">
      <rect width="560" height="190" rx="14" fill="#faf5ff" />
      {bars.map((b, row) => (
        <g key={b.n} transform={`translate(70 ${24 + row * 52})`}>
          {Array.from({ length: b.n }, (_, i) => (
            <rect key={i} x={(i * 380) / b.n} y="0" width={380 / b.n} height="36" fill={i < b.n / 2 ? "#a78bfa" : "#fff"} stroke={MATH_DARK} strokeWidth="2">
              {i < b.n / 2 && <animate attributeName="fill" values="#fff;#a78bfa;#a78bfa;#fff" keyTimes={`0;${(0.1 + row * 0.15).toFixed(2)};0.85;1`} dur="5s" repeatCount="indefinite" />}
            </rect>
          ))}
          <text x="400" y="26" fontSize="20" fontWeight="900" fill={MATH_DARK} fontFamily="Georgia, serif">
            {b.label}
          </text>
        </g>
      ))}
      <line x1="260" y1="16" x2="260" y2="176" stroke="#dc2626" strokeWidth="2" strokeDasharray="5 4" />
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 2, content, bare });

export const chapter2: BookPage[] = [
  page(
    <ChapterOpener
      n={2}
      title="Divisores, Primos e Frações"
      goals={["O que são múltiplos, divisores e números primos", "Como achar o MMC", "O que o numerador e o denominador contam", "Frações equivalentes, somas e números decimais"]}
    >
      <Fig h={34}>
        <PizzaOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🔍">Múltiplos, divisores e primos</H>
      <P>
        Os <T>múltiplos</T> de 3 são os resultados da tabuada do 3: 3, 6, 9, 12… Os <T>divisores</T> de 12 são os números que dividem 12 sem resto: 1, 2, 3, 4, 6 e 12.
        Um número <T>primo</T> tem só dois divisores: o 1 e ele mesmo, como 2, 3, 5 e 7.
      </P>
      <PrimeSieve />
      <Box kind="sabia">
        O grego <strong>Eratóstenes</strong> inventou esse jeito de achar primos há mais de 2.200 anos. O 1 não é primo (tem um divisor só), e o 2 é o único primo par.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🦘">O mínimo múltiplo comum</H>
      <P>
        O <T>MMC</T> de dois números é o menor múltiplo que eles têm em comum. Múltiplos de 4: 4, 8, <strong>12</strong>, 16… Múltiplos de 6: 6, <strong>12</strong>, 18…
        O primeiro que aparece nas duas listas é o 12.
      </P>
      <Fig n="2.1" caption="Saltando de 4 em 4 e de 6 em 6, o primeiro encontro é no 12." h={21}>
        <LcmArt />
      </Fig>
      <Box kind="mago" title="Pra que serve o MMC?">
        Pra somar frações com denominadores diferentes e pra descobrir quando duas coisas se repetem juntas: se um ônibus passa a cada 4 minutos e outro a cada 6, os
        dois passam juntos a cada 12.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🍕">As frações</H>
      <P>
        Uma <T>fração</T> mostra partes de um inteiro. Em 3/4 (três quartos), o <T>denominador</T> 4 diz em quantas partes iguais o inteiro foi dividido, e o{" "}
        <T>numerador</T> 3 diz quantas partes estamos contando. Monte a sua:
      </P>
      <FractionPizza />
      <Box kind="lembre">Toda fração é uma divisão: 3/4 = 3 ÷ 4 = 0,75. Quando o numerador é igual ao denominador, temos o inteiro: 4/4 = 1.</Box>
    </>,
  ),

  page(
    <>
      <H icon="🔁">Equivalentes, somas e decimais</H>
      <P>
        Frações <T>equivalentes</T> têm o mesmo valor: 1/2 = 2/4 = 4/8. Pra somar, os denominadores precisam ser iguais: 1/2 + 1/4 = 2/4 + 1/4 = <T>3/4</T>.
      </P>
      <Fig n="2.2" caption="1/2, 2/4 e 4/8: a mesma metade, cortada de jeitos diferentes." h={18}>
        <EquivalentArt />
      </Fig>
      <Table
        head={["Fração", "Decimal", "Como pensar"]}
        rows={[
          ["1/2", "0,5", "1 ÷ 2"],
          ["1/4", "0,25", "metade da metade"],
          ["1/5", "0,2", "1 ÷ 5"],
          ["3/4 de 20", "15", "20 ÷ 4 = 5; 5 × 3 = 15"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Múltiplos são os resultados da tabuada; divisores dividem o número sem deixar resto.",
          "Número primo tem só dois divisores, o 1 e ele mesmo: 2, 3, 5, 7, 11…",
          "O MMC é o menor múltiplo comum: MMC(4, 6) = 12.",
          "Na fração, o denominador diz em quantas partes o inteiro foi dividido e o numerador, quantas partes contamos.",
          "Frações equivalentes têm o mesmo valor (1/2 = 2/4), e toda fração é uma divisão (1/2 = 0,5).",
        ]}
      />
      <Glossary
        items={[
          ["Múltiplo", "O resultado de multiplicar o número por 1, 2, 3…"],
          ["Divisor", "Um número que divide outro sem resto."],
          ["Primo", "Número com exatamente dois divisores."],
          ["Numerador", "O número de cima da fração."],
          ["Denominador", "O número de baixo da fração."],
        ]}
      />
      <Quiz
        items={[
          ["Qual destes é primo: 9, 15 ou 7?", "7 (9 = 3 × 3 e 15 = 3 × 5)."],
          ["Qual é o MMC de 4 e 6?", "12."],
          ["Quanto é 1/2 + 1/4?", "3/4."],
          ["Quanto é 3/4 de 20?", "15."],
        ]}
      />
    </>,
  ),
];
