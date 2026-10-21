"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Chalkboard, MATH, MATH_DARK, Panel, Pill } from "./art";

// ============================================================================
// CAPÍTULO 1 — OPERAÇÕES E POTÊNCIAS (missão "Matemática: Operações e
// Frações", a parte das operações): o quadro-negro com os sinais flutuando, a
// tabuada de tocar (a multiplicação como um retângulo), o passo a passo da
// ordem das operações e o cubo de 2³ se montando.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o quadro-negro e os sinais das operações flutuando
// ---------------------------------------------------------------------------

function OperationsOpenerArt() {
  const signs = [
    { s: "+", x: 70, y: 70, c: "#16a34a" },
    { s: "−", x: 390, y: 60, c: "#dc2626" },
    { s: "×", x: 60, y: 240, c: "#2563eb" },
    { s: "÷", x: 400, y: 250, c: "#ea580c" },
  ];
  return (
    <Art viewBox="0 0 460 300" label="Um quadro-negro com a conta 2 + 3 × 4 = 14 escrita a giz, e os sinais de mais, menos, vezes e dividir flutuando em volta">
      <rect width="460" height="300" fill="#f5f3ff" />
      <Chalkboard x={100} y={70} w={260} h={160}>
        <text x="130" y="78" textAnchor="middle" fontSize="30" fontWeight="700" fill="#f8fafc" fontFamily="Georgia, serif">
          2 + 3 × 4
        </text>
        <text x="130" y="122" textAnchor="middle" fontSize="30" fontWeight="700" fill="#fde68a" fontFamily="Georgia, serif">
          = 14
        </text>
        {/* o giz sublinhando a multiplicação, que vem primeiro */}
        <path d="M118 88 L190 88" stroke="#fde68a" strokeWidth="3" strokeLinecap="round" strokeDasharray="80" strokeDashoffset="80">
          <animate attributeName="stroke-dashoffset" values="80;0;0;80" keyTimes="0;0.25;0.85;1" dur="4s" repeatCount="indefinite" />
        </path>
      </Chalkboard>
      {signs.map((g, i) => (
        <g key={g.s} transform={`translate(${g.x} ${g.y})`}>
          <g>
            <animateTransform attributeName="transform" type="translate" values="0 0;0 -12;0 0" dur="3s" begin={`${-i * 0.7}s`} repeatCount="indefinite" />
            <circle r="30" fill="#fff" stroke={g.c} strokeWidth="4" />
            <text y="14" textAnchor="middle" fontSize="40" fontWeight="900" fill={g.c} fontFamily="Georgia, serif">
              {g.s}
            </text>
          </g>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A tabuada de tocar: a multiplicação vira um retângulo de quadradinhos
// ---------------------------------------------------------------------------

export function TimesTable() {
  const [a, setA] = useState(7);
  const [b, setB] = useState(8);
  return (
    <Panel title="Toque num quadradinho">
      <div className="flex flex-wrap items-center justify-center gap-[0.8em]">
        <div className="grid grid-cols-10 gap-[2px]" role="grid" aria-label="Tabuada de 1 a 10">
          {Array.from({ length: 100 }, (_, k) => {
            const row = Math.floor(k / 10) + 1;
            const col = (k % 10) + 1;
            const inside = row <= a && col <= b;
            const corner = row === a && col === b;
            return (
              <button
                key={k}
                type="button"
                aria-label={`${row} vezes ${col}`}
                onClick={() => {
                  setA(row);
                  setB(col);
                }}
                className="h-[1.15em] w-[1.15em] rounded-[3px] text-[0.55em] font-bold leading-none transition-colors"
                style={{ background: corner ? MATH_DARK : inside ? "#c4b5fd" : "#f5f3ff", color: corner ? "#fff" : "#6d28d9" }}
              >
                {corner ? row * col : ""}
              </button>
            );
          })}
        </div>
        <div className="text-center">
          <p className="cg-book-title text-[1.6em] font-black" style={{ color: MATH_DARK }}>
            {a} × {b} = {a * b}
          </p>
          <p className="text-[0.82em] text-[#3b2a14]">
            {a} linhas de {b} quadradinhos
            <br />
            dão {a * b} quadradinhos.
          </p>
        </div>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// O passo a passo da ordem das operações
// ---------------------------------------------------------------------------

const EXPRESSIONS: { steps: string[]; notes: string[] }[] = [
  { steps: ["2 + 3 × 4", "2 + 12", "14"], notes: ["A multiplicação vem antes da soma: 3 × 4 = 12.", "Agora a soma: 2 + 12 = 14."] },
  { steps: ["(2 + 3) × 4", "5 × 4", "20"], notes: ["Primeiro o que está nos parênteses: 2 + 3 = 5.", "Agora a multiplicação: 5 × 4 = 20."] },
  {
    steps: ["20 − 12 ÷ 4 + 2³", "20 − 12 ÷ 4 + 8", "20 − 3 + 8", "17 + 8", "25"],
    notes: ["A potência vem primeiro: 2³ = 8.", "Depois a divisão: 12 ÷ 4 = 3.", "Soma e subtração, da esquerda pra direita: 20 − 3 = 17.", "Por fim: 17 + 8 = 25."],
  },
  { steps: ["18 ÷ (5 − 2) × 2", "18 ÷ 3 × 2", "6 × 2", "12"], notes: ["Os parênteses: 5 − 2 = 3.", "÷ e × na ordem em que aparecem: 18 ÷ 3 = 6.", "E então 6 × 2 = 12."] },
];

export function ExpressionStepper() {
  const [ex, setEx] = useState(0);
  const [step, setStep] = useState(0);
  const { steps, notes } = EXPRESSIONS[ex];
  const last = step >= steps.length - 1;
  return (
    <Panel title="Resolva passo a passo">
      <div className="flex flex-wrap justify-center gap-[0.3em]">
        {EXPRESSIONS.map((_, i) => (
          <Pill
            key={i}
            on={ex === i}
            onClick={() => {
              setEx(i);
              setStep(0);
            }}
          >
            Conta {i + 1}
          </Pill>
        ))}
      </div>
      <div className="mt-[0.4em] space-y-[0.15em] text-center">
        {steps.slice(0, step + 1).map((s, i) => (
          <p key={`${ex}-${i}`} className={`cg-anim-fade cg-book-title font-black ${i === step ? "text-[1.35em]" : "text-[1em] opacity-50"}`} style={{ color: MATH_DARK }}>
            {i > 0 && "= "}
            {s}
          </p>
        ))}
      </div>
      <p className="mt-[0.3em] min-h-[1.4em] text-center text-[0.85em] text-[#3b2a14]">{step > 0 ? notes[step - 1] : "Toque em “Próximo passo”."}</p>
      <div className="mt-[0.3em] flex justify-center">
        <button
          type="button"
          onClick={() => setStep((s) => (last ? 0 : s + 1))}
          className="rounded-full px-[1em] py-[0.2em] text-[0.85em] font-black text-white shadow hover:scale-105"
          style={{ background: MATH }}
        >
          {last ? "↺ De novo" : "Próximo passo ➜"}
        </button>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// O cubo de 2³ se montando (e o quadrado de 3²)
// ---------------------------------------------------------------------------

/** Um cubinho em perspectiva (isométrica): (i, j, k) é a posição na pilha, `u` o lado. */
function IsoCube({ i, j, k, u, ox, oy, color }: { i: number; j: number; k: number; u: number; ox: number; oy: number; color: string }) {
  const x = ox + (i - j) * u * 0.866;
  const y = oy + (i + j) * u * 0.5 - k * u;
  const h = u * 0.866;
  return (
    <g>
      <path d={`M${x} ${y} L${x + h} ${y + u / 2} L${x} ${y + u} L${x - h} ${y + u / 2} Z`} fill={color} stroke="#3b0764" strokeWidth="1.2" />
      <path d={`M${x - h} ${y + u / 2} L${x} ${y + u} L${x} ${y + 2 * u} L${x - h} ${y + 1.5 * u} Z`} fill="#7c3aed" stroke="#3b0764" strokeWidth="1.2" />
      <path d={`M${x + h} ${y + u / 2} L${x} ${y + u} L${x} ${y + 2 * u} L${x + h} ${y + 1.5 * u} Z`} fill="#5b21b6" stroke="#3b0764" strokeWidth="1.2" />
    </g>
  );
}

function PowersArt() {
  // de trás pra frente e de baixo pra cima, pra um cubinho não tampar o que está na frente dele
  const cubes: [number, number, number][] = [];
  for (let k = 0; k < 2; k++) for (let s = 0; s <= 2; s++) for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) if (i + j === s) cubes.push([i, j, k]);
  return (
    <Art viewBox="0 0 560 210" label="À esquerda, um quadrado de 3 por 3 quadradinhos, que dá 9; à direita, um cubo de 2 por 2 por 2 cubinhos se montando, que dá 8">
      <rect width="560" height="210" rx="14" fill="#faf5ff" />
      {/* 3² = 9 */}
      {Array.from({ length: 9 }, (_, n) => (
        <rect key={n} x={70 + (n % 3) * 34} y={40 + Math.floor(n / 3) * 34} width="32" height="32" rx="3" fill="#c4b5fd" stroke="#5b21b6" strokeWidth="1.5">
          <animate attributeName="fill" values="#ede9fe;#ede9fe;#c4b5fd;#c4b5fd" keyTimes={`0;${(n * 0.07).toFixed(2)};${(n * 0.07 + 0.05).toFixed(2)};1`} dur="5s" repeatCount="indefinite" />
        </rect>
      ))}
      <text x="121" y="178" textAnchor="middle" fontSize="20" fontWeight="900" fill={MATH_DARK} fontFamily="Georgia, serif">
        3² = 3 × 3 = 9
      </text>
      {/* 2³ = 8 */}
      {cubes.map(([i, j, k], n) => (
        <g key={`${i}${j}${k}`}>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 -50;0 -50;0 0;0 0"
            keyTimes={`0;${(n * 0.07).toFixed(2)};${(n * 0.07 + 0.08).toFixed(2)};1`}
            dur="5s"
            repeatCount="indefinite"
          />
          <animate attributeName="opacity" values="0;0;1;1" keyTimes={`0;${(n * 0.07).toFixed(2)};${(n * 0.07 + 0.04).toFixed(2)};1`} dur="5s" repeatCount="indefinite" />
          <IsoCube i={i} j={j} k={k} u={30} ox={400} oy={70} color="#ddd6fe" />
        </g>
      ))}
      <text x="400" y="190" textAnchor="middle" fontSize="20" fontWeight="900" fill={MATH_DARK} fontFamily="Georgia, serif">
        2³ = 2 × 2 × 2 = 8
      </text>
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
      title="Operações e Potências"
      goals={["Os nomes dos termos das quatro operações", "A multiplicação como um retângulo", "A ordem certa de resolver uma expressão", "O que são potências e raízes"]}
    >
      <Fig h={34}>
        <OperationsOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="➕">As quatro operações</H>
      <P>
        Somar, subtrair, multiplicar e dividir são as <T>quatro operações</T>. Cada número de uma conta tem um nome, e saber esses nomes ajuda a entender os
        problemas.
      </P>
      <Table
        head={["Operação", "Os termos", "Exemplo"]}
        rows={[
          ["Adição (+)", "parcela + parcela = soma", "5 + 3 = 8"],
          ["Subtração (−)", "minuendo − subtraendo = resto ou diferença", "9 − 4 = 5"],
          ["Multiplicação (×)", "fator × fator = produto", "6 × 7 = 42"],
          ["Divisão (÷)", "dividendo ÷ divisor = quociente (e o resto)", "17 ÷ 5 = 3, resto 2"],
        ]}
      />
      <Box kind="atencao">
        Qualquer número vezes <strong>zero</strong> dá zero (8 × 0 = 0). Mas <strong>não existe divisão por zero</strong>: 8 ÷ 0 não tem resposta.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🔢">A tabuada é um retângulo</H>
      <P>
        Multiplicar é somar parcelas iguais: 7 × 8 é 8 + 8 + 8 + 8 + 8 + 8 + 8. Também dá pra ver como um <T>retângulo</T>: 7 linhas de 8 quadradinhos. Por isso a
        ordem não muda o produto: 7 × 8 = 8 × 7.
      </P>
      <TimesTable />
      <Box kind="mago" title="Truque do 5, 6, 7, 8">
        Lembra do 56? É só contar <strong>5, 6, 7, 8</strong>: 56 = 7 × 8. E a tabuada do 9 tem um segredo: os algarismos do resultado sempre somam 9 (18, 27, 36…).
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🧭">A ordem das operações</H>
      <P>
        Quanto é 2 + 3 × 4? Quem faz da esquerda pra direita encontra 20, mas a resposta certa é <T>14</T>. As expressões têm uma ordem combinada pelo mundo todo:
      </P>
      <ol className="mb-[0.5em] ml-[1.2em] list-decimal text-[0.92em] leading-[1.5]">
        <li>
          <T>parênteses</T>, depois colchetes e chaves;
        </li>
        <li>
          <T>potências</T> e raízes;
        </li>
        <li>
          <T>multiplicações e divisões</T>, na ordem em que aparecem;
        </li>
        <li>
          <T>somas e subtrações</T>, na ordem em que aparecem.
        </li>
      </ol>
      <ExpressionStepper />
    </>,
  ),

  page(
    <>
      <H icon="🎲">Potências e raízes</H>
      <P>
        A <T>potência</T> é uma multiplicação de fatores iguais: em 2³, o 2 é a <T>base</T> e o 3 é o <T>expoente</T> (quantas vezes a base aparece). 2³ = 2 × 2 × 2 =
        8. O expoente 2 se lê “ao quadrado” e o 3, “ao cubo”, por causa destas figuras:
      </P>
      <Fig n="1.1" caption="O quadrado de lado 3 tem 9 quadradinhos; o cubo de lado 2 tem 8 cubinhos." h={22}>
        <PowersArt />
      </Fig>
      <Cards
        items={[
          { icon: "√", title: "Raiz quadrada", text: "O caminho de volta: √9 = 3, porque 3² = 9." },
          { icon: "🔟", title: "Potências de 10", text: "10³ = 1.000: o expoente diz quantos zeros." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Adição: parcelas e soma. Subtração: minuendo, subtraendo e resto. Multiplicação: fatores e produto. Divisão: dividendo, divisor e quociente.",
          "Não existe divisão por zero; qualquer número vezes zero dá zero.",
          "A multiplicação pode ser vista como um retângulo, e a ordem dos fatores não muda o produto.",
          "Ordem das operações: parênteses, potências, × e ÷, + e −.",
          "Potência é multiplicar a base por ela mesma: 2³ = 2 × 2 × 2 = 8.",
        ]}
      />
      <Glossary
        items={[
          ["Produto", "O resultado da multiplicação."],
          ["Quociente", "O resultado da divisão."],
          ["Expressão", "Uma conta com várias operações."],
          ["Base", "O número que se multiplica na potência."],
          ["Expoente", "Quantas vezes a base aparece na potência."],
        ]}
      />
      <Quiz
        items={[
          ["Quanto é 7 × 8?", "56."],
          ["Quanto é 2 + 3 × 4?", "14 (a multiplicação vem antes: 3 × 4 = 12; 2 + 12 = 14)."],
          ["Quanto é 2³?", "8 (2 × 2 × 2)."],
          ["Quanto é 144 ÷ 12?", "12, porque 12 × 12 = 144."],
        ]}
      />
    </>,
  ),
];
