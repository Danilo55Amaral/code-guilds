"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { MATH, MATH_DARK, Panel, Pill } from "./art";

// ============================================================================
// CAPÍTULO 10 — ESTATÍSTICA E PROGRESSÕES (missão "Matemática: Probabilidade,
// Estatística e Progressões", a outra metade): as barras crescendo, o
// laboratório da média, mediana e moda (de tocar), os três tipos de gráfico,
// a escada da PA e as barras que dobram da PG.
// ============================================================================

const num = (v: number) => v.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

// ---------------------------------------------------------------------------
// Abertura: o gráfico de barras crescendo
// ---------------------------------------------------------------------------

function ChartOpenerArt() {
  const bars = [90, 140, 110, 180, 150];
  const colors = ["#a78bfa", "#7c3aed", "#c4b5fd", "#6d28d9", "#8b5cf6"];
  return (
    <Art viewBox="0 0 460 300" label="Um gráfico de barras com cinco barras crescendo e uma linha ligando o topo delas, como num relatório">
      <rect width="460" height="300" fill="#f5f3ff" />
      <line x1="60" y1="250" x2="420" y2="250" stroke="#334155" strokeWidth="3" />
      <line x1="60" y1="250" x2="60" y2="40" stroke="#334155" strokeWidth="3" />
      {[1, 2, 3, 4].map((k) => (
        <line key={k} x1="60" y1={250 - k * 45} x2="420" y2={250 - k * 45} stroke="#ddd6fe" strokeDasharray="4 4" />
      ))}
      {bars.map((h, i) => (
        <rect key={i} x={85 + i * 68} y={250 - h} width="44" height={h} rx="4" fill={colors[i]}>
          <animate attributeName="height" values={`0;${h};${h};0`} keyTimes="0;0.3;0.9;1" dur="5s" begin={`${-i * 0.1}s`} repeatCount="indefinite" />
          <animate attributeName="y" values={`250;${250 - h};${250 - h};250`} keyTimes="0;0.3;0.9;1" dur="5s" begin={`${-i * 0.1}s`} repeatCount="indefinite" />
        </rect>
      ))}
      <polyline points={bars.map((h, i) => `${107 + i * 68},${250 - h}`).join(" ")} fill="none" stroke="#f97316" strokeWidth="3.5" strokeDasharray="400" strokeDashoffset="400">
        <animate attributeName="stroke-dashoffset" values="400;400;0;0;400" keyTimes="0;0.3;0.55;0.9;1" dur="5s" repeatCount="indefinite" />
      </polyline>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O laboratório da média, da mediana e da moda (de tocar)
// ---------------------------------------------------------------------------

const PRESETS: { name: string; values: number[] }[] = [
  { name: "Notas", values: [6, 7, 7, 8, 5, 9, 7] },
  { name: "Gols", values: [2, 0, 1, 3, 1, 4, 1] },
  { name: "Livros lidos", values: [1, 2, 2, 10, 3, 2, 1] },
];

export function StatsLab() {
  const [values, setValues] = useState(PRESETS[0].values);
  const [preset, setPreset] = useState(0);
  const sorted = [...values].sort((a, b) => a - b);
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const freq = new Map<number, number>();
  values.forEach((v) => freq.set(v, (freq.get(v) ?? 0) + 1));
  const top = Math.max(...freq.values());
  const modes = [...freq.entries()].filter(([, c]) => c === top && top > 1).map(([v]) => v);
  const change = (i: number, d: number) => setValues((vs) => vs.map((v, j) => (j === i ? Math.max(0, Math.min(10, v + d)) : v)));
  return (
    <Panel title="Média, mediana e moda">
      <div className="flex flex-wrap justify-center gap-[0.3em]">
        {PRESETS.map((p, i) => (
          <Pill
            key={p.name}
            on={preset === i}
            onClick={() => {
              setPreset(i);
              setValues(p.values);
            }}
          >
            {p.name}
          </Pill>
        ))}
      </div>
      {/* o gráfico: as barras começam no chão, e a linha tracejada é a média, na mesma escala */}
      <div className="relative mx-auto mt-[0.4em] flex h-[4.5em] max-w-[18em] items-end justify-between gap-[0.25em] border-b-2 border-[#3b2a14]">
        <div className="pointer-events-none absolute inset-x-0 z-10 border-t-2 border-dashed border-[#f97316]" style={{ bottom: `${mean * 0.36}em` }} />
        {values.map((v, i) => (
          <div key={i} className="flex flex-1 flex-col items-center justify-end">
            <span className="text-[0.75em] font-black leading-[1.2]" style={{ color: MATH_DARK }}>
              {v}
            </span>
            <div className="w-full rounded-t transition-all duration-200" style={{ height: `${v * 0.36}em`, background: modes.includes(v) ? "#16a34a" : MATH }} />
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-[18em] justify-between gap-[0.25em]">
        {values.map((_, i) => (
          <div key={i} className="flex flex-1 justify-center gap-[0.1em] text-[0.7em] text-[#6d28d9]">
            <button type="button" onClick={() => change(i, -1)} aria-label={`Diminuir o valor ${i + 1}`}>
              ▼
            </button>
            <button type="button" onClick={() => change(i, 1)} aria-label={`Aumentar o valor ${i + 1}`}>
              ▲
            </button>
          </div>
        ))}
      </div>
      <div className="mt-[0.3em] grid grid-cols-3 gap-[0.3em] text-center text-[0.8em]">
        <p className="rounded-lg bg-white px-[0.3em] py-[0.1em]">
          <strong style={{ color: "#ea580c" }}>Média</strong>
          <br />
          {num(mean)}
        </p>
        <p className="rounded-lg bg-white px-[0.3em] py-[0.1em]">
          <strong style={{ color: MATH_DARK }}>Mediana</strong>
          <br />
          {median}
        </p>
        <p className="rounded-lg bg-white px-[0.3em] py-[0.1em]">
          <strong style={{ color: "#16a34a" }}>Moda</strong>
          <br />
          {modes.length ? modes.sort((a, b) => a - b).join(" e ") : "nenhuma"}
        </p>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Os três tipos de gráfico
// ---------------------------------------------------------------------------

function ChartTypesArt() {
  const pie = [
    { v: 0.5, c: "#7c3aed" },
    { v: 0.3, c: "#f97316" },
    { v: 0.2, c: "#16a34a" },
  ];
  let acc = 0;
  return (
    <Art viewBox="0 0 560 180" label="Três gráficos lado a lado: um de barras, um de setores, como uma pizza, e um de linha subindo e descendo">
      <rect width="560" height="180" rx="14" fill="#faf5ff" />
      {/* barras */}
      <g transform="translate(30 20)">
        <line x1="0" y1="120" x2="140" y2="120" stroke="#334155" strokeWidth="2" />
        {[60, 100, 40, 80].map((h, i) => (
          <rect key={i} x={12 + i * 32} y={120 - h} width="22" height={h} fill={MATH}>
            <animate attributeName="height" values={`${h * 0.6};${h};${h * 0.6}`} dur="3s" begin={`${-i * 0.4}s`} repeatCount="indefinite" />
            <animate attributeName="y" values={`${120 - h * 0.6};${120 - h};${120 - h * 0.6}`} dur="3s" begin={`${-i * 0.4}s`} repeatCount="indefinite" />
          </rect>
        ))}
        <text x="70" y="148" textAnchor="middle" fontSize="13" fontWeight="900" fill={MATH_DARK} fontFamily="Georgia, serif">
          barras
        </text>
      </g>
      {/* setores */}
      <g transform="translate(280 78)">
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="18s" repeatCount="indefinite" />
          {pie.map((p) => {
            const a0 = acc * 2 * Math.PI - Math.PI / 2;
            acc += p.v;
            const a1 = acc * 2 * Math.PI - Math.PI / 2;
            const r = 56;
            return (
              <path
                key={p.c}
                d={`M0 0 L${(r * Math.cos(a0)).toFixed(1)} ${(r * Math.sin(a0)).toFixed(1)} A${r} ${r} 0 ${p.v > 0.5 ? 1 : 0} 1 ${(r * Math.cos(a1)).toFixed(1)} ${(r * Math.sin(a1)).toFixed(1)} Z`}
                fill={p.c}
                stroke="#fff"
                strokeWidth="2"
              />
            );
          })}
        </g>
        <text y="90" textAnchor="middle" fontSize="13" fontWeight="900" fill={MATH_DARK} fontFamily="Georgia, serif">
          setores (pizza)
        </text>
      </g>
      {/* linha */}
      <g transform="translate(390 20)">
        <line x1="0" y1="120" x2="140" y2="120" stroke="#334155" strokeWidth="2" />
        <polyline points="5,100 35,70 65,85 95,40 130,55" fill="none" stroke="#f97316" strokeWidth="3.5" strokeDasharray="200" strokeDashoffset="200">
          <animate attributeName="stroke-dashoffset" values="200;0;0;200" keyTimes="0;0.5;0.9;1" dur="4s" repeatCount="indefinite" />
        </polyline>
        <text x="70" y="148" textAnchor="middle" fontSize="13" fontWeight="900" fill={MATH_DARK} fontFamily="Georgia, serif">
          linha
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A escada da PA
// ---------------------------------------------------------------------------

function StairsArt() {
  const terms = [2, 5, 8, 11, 14, 17];
  return (
    <Art viewBox="0 0 560 190" label="Uma escada em que cada degrau é 3 mais alto que o anterior: 2, 5, 8, 11, 14 e 17; uma bolinha sobe pulando de degrau em degrau">
      <rect width="560" height="190" rx="14" fill="#faf5ff" />
      {terms.map((t, i) => (
        <g key={t}>
          <rect x={40 + i * 66} y={170 - t * 8} width="60" height={t * 8} fill="#ddd6fe" stroke={MATH_DARK} strokeWidth="2" />
          <text x={70 + i * 66} y={164} textAnchor="middle" fontSize="18" fontWeight="900" fill={MATH_DARK} fontFamily="Georgia, serif">
            {t}
          </text>
          {i > 0 && (
            <text x={40 + i * 66} y={170 - t * 8 - 6} textAnchor="middle" fontSize="11" fontWeight="900" fill="#ea580c" fontFamily="Georgia, serif">
              +3
            </text>
          )}
        </g>
      ))}
      <circle r="8" fill="#f97316" stroke="#9a3412" strokeWidth="2">
        <animateMotion
          path={terms.map((t, i) => `${i ? "L" : "M"}${70 + i * 66} ${170 - t * 8 - 10}`).join(" ")}
          dur="4s"
          repeatCount="indefinite"
          calcMode="linear"
        />
      </circle>
      <text x="470" y="40" textAnchor="middle" fontSize="15" fontWeight="900" fill={MATH_DARK} fontFamily="Georgia, serif">
        razão 3
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As barras que dobram (a PG)
// ---------------------------------------------------------------------------

function DoublingArt() {
  const terms = [3, 6, 12, 24, 48, 96];
  return (
    <Art viewBox="0 0 560 190" label="Seis barras que dobram de tamanho: 3, 6, 12, 24, 48 e 96, numa progressão geométrica de razão 2">
      <rect width="560" height="190" rx="14" fill="#fff7ed" />
      {terms.map((t, i) => {
        const h = t * 1.5;
        return (
          <g key={t}>
            <rect x={50 + i * 78} y={160 - h} width="54" height={h} rx="4" fill="#f97316" stroke="#9a3412" strokeWidth="2">
              <animate attributeName="height" values={`0;0;${h};${h}`} keyTimes={`0;${(i * 0.12).toFixed(2)};${(i * 0.12 + 0.1).toFixed(2)};1`} dur="5s" repeatCount="indefinite" />
              <animate attributeName="y" values={`160;160;${160 - h};${160 - h}`} keyTimes={`0;${(i * 0.12).toFixed(2)};${(i * 0.12 + 0.1).toFixed(2)};1`} dur="5s" repeatCount="indefinite" />
            </rect>
            <text x={77 + i * 78} y="178" textAnchor="middle" fontSize="15" fontWeight="900" fill="#7c2d12" fontFamily="Georgia, serif">
              {t}
            </text>
            {i > 0 && (
              <text x={38 + i * 78} y={150 - h / 2} textAnchor="middle" fontSize="11" fontWeight="900" fill={MATH} fontFamily="Georgia, serif">
                ×2
              </text>
            )}
          </g>
        );
      })}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 10, content, bare });

export const chapter10: BookPage[] = [
  page(
    <ChapterOpener
      n={10}
      title="Estatística e Progressões"
      goals={["Média, mediana e moda", "Que gráfico usar pra cada informação", "A progressão aritmética (PA) e a soma de Gauss", "A progressão geométrica (PG)"]}
    >
      <Fig h={34}>
        <ChartOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="📊">Média, mediana e moda</H>
      <P>
        A <T>média</T> é a soma dos valores dividida pela quantidade: (4 + 6 + 8 + 10) ÷ 4 = 7. A <T>mediana</T> é o valor do meio da lista em ordem. A <T>moda</T> é o valor
        que mais se repete. Mexa nas barras:
      </P>
      <StatsLab />
      <Box kind="mago" title="Por que a mediana existe?">
        Em “Livros lidos”, um aluno que leu 10 livros puxa a média pra cima. A mediana não liga pra esses valores muito diferentes e mostra melhor o aluno “do meio”.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="📉">Gráficos</H>
      <P>
        A <T>estatística</T> junta, organiza e mostra dados. Um bom gráfico deixa a informação clara num olhar, e cada tipo serve pra uma coisa:
      </P>
      <Fig n="10.1" caption="Barras comparam, setores mostram partes de um todo e a linha mostra a mudança no tempo." h={19}>
        <ChartTypesArt />
      </Fig>
      <Cards
        items={[
          { icon: "📊", title: "Barras", text: "Comparar quantidades: gols de cada time." },
          { icon: "🍕", title: "Setores", text: "Partes de um todo: como a turma vai à escola." },
          { icon: "📈", title: "Linha", text: "A mudança com o tempo: a temperatura do dia." },
          { icon: "🔍", title: "Desconfie", text: "Eixos cortados podem exagerar as diferenças." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="📶">Progressão aritmética (PA)</H>
      <P>
        Numa <T>PA</T>, cada termo é o anterior <T>mais</T> um número fixo, a <T>razão</T>. Em 2, 5, 8, 11…, a razão é 3. O 10º termo é a₁ + 9 × r = 2 + 9 × 3 = <T>29</T>.
      </P>
      <Fig n="10.2" caption="Na PA, a escada sobe sempre o mesmo tanto." h={20}>
        <StairsArt />
      </Fig>
      <Box kind="sabia">
        Diz a lenda que o pequeno Gauss somou 1 + 2 + … + 100 em segundos: juntou 1 + 100, 2 + 99, 3 + 98… São 50 pares de 101: 50 × 101 = <strong>5050</strong>.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="✖️">Progressão geométrica (PG)</H>
      <P>
        Numa <T>PG</T>, cada termo é o anterior <T>vezes</T> a razão. Em 3, 6, 12, 24…, a razão é 2, e o 6º termo é 3 × 2⁵ = 3 × 32 = <T>96</T>. A PG cresce muito mais
        rápido que a PA.
      </P>
      <Fig n="10.3" caption="Na PG de razão 2, cada barra é o dobro da anterior." h={20}>
        <DoublingArt />
      </Fig>
      <Box kind="sabia">
        Na lenda do xadrez, o rei pagou 1 grão de arroz na 1ª casa, 2 na 2ª, 4 na 3ª… Na 64ª casa seriam mais de 9 quintilhões de grãos: arroz do mundo inteiro por
        séculos!
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Média = soma ÷ quantidade: a média de 4, 6, 8 e 10 é 7.",
          "Mediana é o valor do meio (em 3, 7, 9, 12, 15 é o 9); moda é o que mais se repete.",
          "Gráfico de barras compara, de setores mostra partes de um todo e de linha mostra mudanças no tempo.",
          "Na PA soma-se a razão: em 2, 5, 8, 11…, o 10º termo é 29.",
          "Na PG multiplica-se pela razão: em 3, 6, 12, 24…, o 6º termo é 96.",
        ]}
      />
      <Glossary
        items={[
          ["Média", "A soma dos valores dividida pela quantidade."],
          ["Mediana", "O valor do meio da lista em ordem."],
          ["Moda", "O valor que mais se repete."],
          ["PA", "Sequência em que se soma sempre a mesma razão."],
          ["PG", "Sequência em que se multiplica sempre pela mesma razão."],
        ]}
      />
      <Quiz
        items={[
          ["Qual é a média de 4, 6, 8 e 10?", "7."],
          ["Qual é a moda de 2, 3, 3, 5, 7, 3, 8?", "3."],
          ["Na PA 2, 5, 8, 11…, qual é o 10º termo?", "29."],
          ["Quanto dá 1 + 2 + 3 + … + 100?", "5050."],
        ]}
      />
    </>,
  ),
];
