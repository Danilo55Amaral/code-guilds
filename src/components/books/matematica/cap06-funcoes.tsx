"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table, useUid } from "../BookParts";
import type { BookPage } from "../types";
import { MATH, MATH_DARK, Panel, Pill, Slider } from "./art";

// ============================================================================
// CAPÍTULO 6 — FUNÇÕES E EQUAÇÃO DO 2º GRAU (missão "Matemática: Equações e
// Funções", a parte das funções): a máquina de funções (abertura e de tocar),
// o traçador de retas (de tocar), a soma e o produto das raízes e a bolinha
// rolando na parábola.
// ============================================================================

const num = (v: number) => v.toLocaleString("pt-BR", { maximumFractionDigits: 2 });

// ---------------------------------------------------------------------------
// Abertura: a máquina de funções
// ---------------------------------------------------------------------------

function MachineOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma máquina com a regra f(x) = 2x + 3: a bolinha com o número 2 entra por um lado e sai a bolinha com o número 7 do outro">
      <rect width="460" height="300" fill="#f5f3ff" />
      <rect x="20" y="200" width="420" height="16" rx="8" fill="#94a3b8" />
      {/* a máquina */}
      <rect x="150" y="80" width="160" height="130" rx="14" fill={MATH} stroke={MATH_DARK} strokeWidth="4" />
      <rect x="165" y="95" width="130" height="40" rx="6" fill="#ede9fe" />
      <text x="230" y="122" textAnchor="middle" fontSize="19" fontWeight="900" fill={MATH_DARK} fontFamily="Georgia, serif">
        f(x) = 2x + 3
      </text>
      {[185, 230, 275].map((x, i) => (
        <circle key={x} cx={x} cy="168" r="10" fill="#fde047" stroke="#a16207" strokeWidth="2">
          <animate attributeName="fill" values="#fde047;#f97316;#fde047" dur="1s" begin={`${-i * 0.33}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <g transform="translate(230 54)">
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="4s" repeatCount="indefinite" />
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x="-4" y="-34" width="8" height="12" fill={MATH_DARK} transform={`rotate(${i * 45})`} />
          ))}
          <circle r="24" fill="#a78bfa" stroke={MATH_DARK} strokeWidth="3" />
        </g>
      </g>
      {/* a bolinha que entra e a que sai */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;110 0;110 0" keyTimes="0;0.4;1" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.38;0.42;1" dur="4s" repeatCount="indefinite" />
        <circle cx="40" cy="178" r="20" fill="#38bdf8" stroke="#0369a1" strokeWidth="3" />
        <text x="40" y="186" textAnchor="middle" fontSize="22" fontWeight="900" fill="#fff" fontFamily="Georgia, serif">
          2
        </text>
      </g>
      <g opacity="0">
        <animateTransform attributeName="transform" type="translate" values="0 0;0 0;110 0;110 0" keyTimes="0;0.55;0.95;1" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.55;0.6;0.95;1" dur="4s" repeatCount="indefinite" />
        <circle cx="310" cy="178" r="20" fill="#f97316" stroke="#9a3412" strokeWidth="3" />
        <text x="310" y="186" textAnchor="middle" fontSize="22" fontWeight="900" fill="#fff" fontFamily="Georgia, serif">
          7
        </text>
      </g>
      <text x="230" y="260" textAnchor="middle" fontSize="18" fontWeight="900" fill={MATH_DARK} fontFamily="Georgia, serif">
        f(2) = 2 × 2 + 3 = 7
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A máquina de funções (de tocar)
// ---------------------------------------------------------------------------

const RULES: { label: string; f: (x: number) => number; how: (x: number) => string }[] = [
  { label: "f(x) = 2x + 3", f: (x) => 2 * x + 3, how: (x) => `2 × ${x} + 3` },
  { label: "f(x) = x²", f: (x) => x * x, how: (x) => `${x} × ${x}` },
  { label: "f(x) = 3x − 1", f: (x) => 3 * x - 1, how: (x) => `3 × ${x} − 1` },
];

export function FunctionMachine() {
  const [rule, setRule] = useState(0);
  const [x, setX] = useState(5);
  const r = RULES[rule];
  return (
    <Panel title="A máquina de funções">
      <div className="flex flex-wrap justify-center gap-[0.3em]">
        {RULES.map((rr, i) => (
          <Pill key={rr.label} on={rule === i} onClick={() => setRule(i)}>
            {rr.label}
          </Pill>
        ))}
      </div>
      <div className="mt-[0.4em]">
        <Slider label="Entra o x" value={x} min={0} max={10} onChange={setX} />
      </div>
      <div key={`${rule}-${x}`} className="cg-anim-fade mt-[0.3em] flex items-center justify-center gap-[0.5em] text-[1.05em] font-black">
        <span className="rounded-full bg-[#38bdf8] px-[0.6em] py-[0.1em] text-white">{x}</span>
        <span style={{ color: MATH }}>➜ ⚙️ ➜</span>
        <span className="rounded-full bg-[#f97316] px-[0.6em] py-[0.1em] text-white">{r.f(x)}</span>
      </div>
      <p className="mt-[0.2em] text-center text-[0.85em] text-[#3b2a14]">
        f({x}) = {r.how(x)} = <strong style={{ color: MATH_DARK }}>{r.f(x)}</strong>
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// O traçador de retas (de tocar)
// ---------------------------------------------------------------------------

export function LinePlotter() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const clip = useUid("reta");
  // o plano vai de -5 a 5 nos dois eixos; cada unidade são 20 px
  const px = (x: number) => 110 + x * 20;
  const py = (y: number) => 110 - y * 20;
  const kind = a > 0 ? "crescente: sobe da esquerda pra direita" : a < 0 ? "decrescente: desce da esquerda pra direita" : "constante: fica na mesma altura";
  const formula = `f(x) = ${a === 0 ? "" : `${a === 1 ? "" : a === -1 ? "−" : num(a).replace("-", "−")}x`}${b === 0 ? (a === 0 ? "0" : "") : `${a === 0 ? "" : b > 0 ? " + " : " − "}${a === 0 ? num(b).replace("-", "−") : Math.abs(b)}`}`;
  return (
    <Panel title="O gráfico da reta">
      <div className="flex flex-wrap items-center justify-center gap-[0.8em]">
        <svg viewBox="0 0 220 220" className="h-[9em] w-[9em] shrink-0" aria-label={`O gráfico de ${formula}`}>
          <defs>
            <clipPath id={clip}>
              <rect width="220" height="220" />
            </clipPath>
          </defs>
          <rect width="220" height="220" fill="#fff" />
          {Array.from({ length: 11 }, (_, i) => (
            <g key={i}>
              <line x1={10 + i * 20} y1="10" x2={10 + i * 20} y2="210" stroke="#ede9fe" />
              <line x1="10" y1={10 + i * 20} x2="210" y2={10 + i * 20} stroke="#ede9fe" />
            </g>
          ))}
          <line x1="10" y1="110" x2="210" y2="110" stroke="#334155" strokeWidth="1.5" />
          <line x1="110" y1="10" x2="110" y2="210" stroke="#334155" strokeWidth="1.5" />
          <g clipPath={`url(#${clip})`}>
            <line x1={px(-6)} y1={py(a * -6 + b)} x2={px(6)} y2={py(a * 6 + b)} stroke={MATH} strokeWidth="3.5" />
          </g>
          <circle cx={px(0)} cy={py(b)} r="5" fill="#f97316" stroke="#fff" strokeWidth="1.5" />
        </svg>
        <div className="min-w-[11em] flex-1 space-y-[0.3em]">
          <p className="text-center text-[1.2em] font-black" style={{ color: MATH_DARK }}>
            {formula}
          </p>
          <Slider label="a" labelWidth="1em" value={a} min={-3} max={3} step={0.5} onChange={setA} />
          <Slider label="b" labelWidth="1em" value={b} min={-4} max={4} onChange={setB} />
          <p className="text-center text-[0.8em] text-[#3b2a14]">A reta é {kind}.</p>
        </div>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// A bolinha rolando na parábola
// ---------------------------------------------------------------------------

function ParabolaArt() {
  // y = x² − 5x + 6, com x de 0 a 5; cada unidade são 40 px na horizontal e 30 na vertical
  const px = (x: number) => 60 + x * 40;
  const py = (y: number) => 150 - y * 30;
  const pts = Array.from({ length: 51 }, (_, i) => {
    const x = i / 10;
    return `${px(x).toFixed(1)} ${py(x * x - 5 * x + 6).toFixed(1)}`;
  });
  const d = `M${pts.join(" L")}`;
  return (
    <Art viewBox="0 0 560 200" label="A parábola de x² − 5x + 6, com a boca pra cima, cortando o eixo x nos pontos 2 e 3, as raízes; uma bolinha rola por ela">
      <rect width="560" height="200" rx="14" fill="#faf5ff" />
      <line x1="40" y1="150" x2="290" y2="150" stroke="#334155" strokeWidth="2" />
      <line x1="60" y1="190" x2="60" y2="10" stroke="#334155" strokeWidth="2" />
      {[1, 2, 3, 4, 5].map((x) => (
        <text key={x} x={px(x)} y="166" textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155" fontFamily="Georgia, serif">
          {x}
        </text>
      ))}
      <path d={d} fill="none" stroke={MATH} strokeWidth="3.5" />
      {[2, 3].map((x) => (
        <circle key={x} cx={px(x)} cy={py(0)} r="6" fill="#f97316" stroke="#fff" strokeWidth="2" />
      ))}
      <circle r="8" fill="#38bdf8" stroke="#0369a1" strokeWidth="2">
        <animateMotion path={d} dur="4s" repeatCount="indefinite" keyPoints="0;1;0" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
      </circle>
      <g fontFamily="Georgia, serif" fontWeight="900">
        <text x="320" y="50" fontSize="17" fill={MATH_DARK}>
          x² − 5x + 6 = 0
        </text>
        <text x="320" y="82" fontSize="14" fill="#334155">
          raízes: x = 2 e x = 3
        </text>
        <text x="320" y="112" fontSize="14" fill="#334155">
          soma 2 + 3 = 5
        </text>
        <text x="320" y="138" fontSize="14" fill="#334155">
          produto 2 × 3 = 6
        </text>
        <text x="320" y="172" fontSize="13" fill="#f97316">
          é onde a parábola corta o eixo x
        </text>
      </g>
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
      title="Funções e Equação do 2º Grau"
      goals={["O que é uma função e como calcular f(x)", "Por que o gráfico da função do 1º grau é uma reta", "Como resolver equações do 2º grau", "A parábola e o discriminante (Δ)"]}
    >
      <Fig h={34}>
        <MachineOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="⚙️">A máquina de funções</H>
      <P>
        Uma <T>função</T> é como uma máquina: entra um número (o x), ela aplica sempre a mesma regra, e sai um único resultado, o f(x). Com f(x) = 2x + 3, se entra o 5,
        sai f(5) = 2 × 5 + 3 = <T>13</T>.
      </P>
      <FunctionMachine />
      <Box kind="sabia">Funções estão em todo lugar: o preço da corrida de táxi depende dos quilômetros, e a conta de luz depende de quanto você gastou.</Box>
    </>,
  ),

  page(
    <>
      <H icon="📈">A reta da função do 1º grau</H>
      <P>
        A <T>função afim</T> f(x) = ax + b tem gráfico em forma de <T>reta</T>. O <T>a</T> (coeficiente angular) diz a inclinação: positivo, a reta sobe; negativo,
        desce. O <T>b</T> é onde ela corta o eixo vertical. Experimente:
      </P>
      <LinePlotter />
    </>,
  ),

  page(
    <>
      <H icon="🔢">A equação do 2º grau</H>
      <P>
        Na <T>equação do 2º grau</T> o x aparece ao quadrado: ax² + bx + c = 0. Ela pode ter duas soluções. Em x² − 9 = 0, x² = 9, então x = 3 ou x = −3, porque (−3)²
        também dá 9.
      </P>
      <Table
        head={["Equação", "Como pensar", "Raízes"]}
        rows={[
          ["x² − 9 = 0", "x² = 9", "3 e −3"],
          ["x² − 5x + 6 = 0", "soma 5, produto 6", "2 e 3"],
          ["x² − 7x + 10 = 0", "soma 7, produto 10", "2 e 5"],
        ]}
      />
      <Box kind="mago" title="O truque da soma e do produto">
        Em x² − Sx + P = 0, procure dois números que somam S e multiplicam P. Pra x² − 5x + 6 = 0: 2 + 3 = 5 e 2 × 3 = 6, então as raízes são 2 e 3.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🎢">Bhaskara e a parábola</H>
      <P>
        O gráfico da função do 2º grau é uma <T>parábola</T>. A fórmula de Bhaskara calcula as raízes: x = (−b ± √Δ) ÷ 2a, com o <T>discriminante</T> Δ = b² − 4ac.
      </P>
      <Fig n="6.1" caption="As raízes são os pontos onde a parábola corta o eixo x." h={20}>
        <ParabolaArt />
      </Fig>
      <Table
        head={["Δ", "Quantas raízes reais"]}
        rows={[
          ["Δ > 0", "duas (a parábola corta o eixo x duas vezes)"],
          ["Δ = 0", "uma (a parábola só encosta no eixo)"],
          ["Δ < 0", "nenhuma (a parábola não toca o eixo)"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Função é uma regra que, pra cada x, dá um único resultado f(x): se f(x) = 2x + 3, f(5) = 13.",
          "O gráfico de f(x) = ax + b é uma reta: a > 0 sobe, a < 0 desce, e b é onde ela corta o eixo y.",
          "Equação do 2º grau tem x²: x² − 9 = 0 tem as raízes 3 e −3.",
          "Soma e produto: as raízes de x² − 5x + 6 = 0 são 2 e 3.",
          "O gráfico do 2º grau é uma parábola; com Δ < 0, não há raízes reais.",
        ]}
      />
      <Glossary
        items={[
          ["Função", "Regra que liga cada x a um único f(x)."],
          ["Coeficiente angular", "O a de ax + b: a inclinação da reta."],
          ["Parábola", "A curva do gráfico da função do 2º grau."],
          ["Discriminante", "Δ = b² − 4ac, que diz quantas raízes existem."],
          ["Bhaskara", "A fórmula que resolve a equação do 2º grau."],
        ]}
      />
      <Quiz
        items={[
          ["Se f(x) = 2x + 3, quanto vale f(5)?", "13."],
          ["Qual é a forma do gráfico de f(x) = 2x + 1?", "Uma reta."],
          ["Quais são as raízes de x² − 5x + 6 = 0?", "2 e 3."],
          ["O que acontece quando Δ é negativo?", "Não existem raízes reais."],
        ]}
      />
    </>,
  ),
];
