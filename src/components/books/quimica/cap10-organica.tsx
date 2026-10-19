"use client";

import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Ball, Methane } from "./art";

// ============================================================================
// CAPÍTULO 10 — QUÍMICA ORGÂNICA (missões "Química: Ácidos, Bases e Química
// Orgânica", a parte do carbono, e "Química: Funções Orgânicas e
// Isomeria"): o anel de benzeno girando, as cadeias de carbono do metano ao
// butano, os grupos das funções orgânicas brilhando, os isômeros etanol e
// éter, e a torre da refinaria separando o petróleo.
// ============================================================================

/** Uma cadeia de carbonos em linha, com os hidrogênios em volta (de 1 a 4 carbonos). */
function Chain({ n, x, y, s = 1 }: { n: number; x: number; y: number; s?: number }) {
  const step = 34;
  const start = -((n - 1) * step) / 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {Array.from({ length: n }, (_, i) => {
        const cx = start + i * step;
        const hs: [number, number][] = [
          [cx, -24],
          [cx, 24],
        ];
        if (i === 0) hs.push([cx - 24, 0]);
        if (i === n - 1) hs.push([cx + 24, 0]);
        return (
          <g key={i}>
            {i > 0 && <line x1={cx - step} y1="0" x2={cx} y2="0" stroke="#475569" strokeWidth="4" />}
            {hs.map(([hx, hy], k) => (
              <g key={k}>
                <line x1={cx} y1="0" x2={hx} y2={hy} stroke="#94a3b8" strokeWidth="3" />
                <Ball el="H" x={hx} y={hy} r={8} label={false} />
              </g>
            ))}
            <Ball el="C" x={cx} r={12} />
          </g>
        );
      })}
    </g>
  );
}

// ---------------------------------------------------------------------------
// Abertura: o anel de benzeno girando e o metano
// ---------------------------------------------------------------------------

function OrganicOpenerArt() {
  const ring = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    return [Math.cos(a) * 70, Math.sin(a) * 70] as [number, number];
  });
  return (
    <Art viewBox="0 0 460 300" label="O anel de benzeno, com seis carbonos, girando devagar, e moléculas de metano em volta">
      <circle cx="230" cy="150" r="130" fill="#f0abfc" opacity="0.2" className="cg-anim-glow" />
      <g transform="translate(230 150)">
        <g className="cg-anim-orbit-rev" style={{ "--cg-dur": "30s" } as React.CSSProperties}>
          {ring.map(([x, y], i) => {
            const [nx, ny] = ring[(i + 1) % 6];
            return <line key={i} x1={x} y1={y} x2={nx} y2={ny} stroke="#475569" strokeWidth={i % 2 ? 4 : 9} />;
          })}
          {ring.map(([x, y], i) => (
            <g key={`h${i}`}>
              <line x1={x} y1={y} x2={x * 1.5} y2={y * 1.5} stroke="#94a3b8" strokeWidth="3" />
              <Ball el="H" x={x * 1.5} y={y * 1.5} r={11} />
            </g>
          ))}
          {ring.map(([x, y], i) => (
            <Ball key={`c${i}`} el="C" x={x} y={y} r={16} />
          ))}
          <circle r="34" fill="none" stroke="#a21caf" strokeWidth="3" strokeDasharray="6 5" />
        </g>
      </g>
      {[
        [60, 70], [400, 80], [70, 240], [390, 230],
      ].map(([x, y], i) => (
        <g key={i} className="cg-anim-hover" style={{ animationDelay: `${i * 0.6}s` }}>
          <Methane x={x} y={y} s={0.8} />
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As cadeias: metano, etano, propano e butano
// ---------------------------------------------------------------------------

function ChainsArt() {
  const names = [
    ["Metano", "CH₄", 1],
    ["Etano", "C₂H₆", 2],
    ["Propano", "C₃H₈", 3],
    ["Butano", "C₄H₁₀", 4],
  ] as const;
  return (
    <Art viewBox="0 0 600 170" label="Hidrocarbonetos em cadeia: metano com 1 carbono, etano com 2, propano com 3 e butano com 4">
      {names.map(([name, formula, n], i) => {
        const x = [55, 165, 305, 485][i];
        return (
          <g key={name} className="cg-anim-pop" style={{ animationDelay: `${i * 0.25}s` }}>
            <Chain n={n} x={x} y={70} s={0.95} />
            <text x={x} y="132" textAnchor="middle" fontSize="14" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
              {name}
            </text>
            <text x={x} y="152" textAnchor="middle" fontSize="12.5" fill="#701a75" fontFamily="Georgia, serif">
              {formula}
            </text>
          </g>
        );
      })}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As funções orgânicas, com o grupo de cada uma brilhando
// ---------------------------------------------------------------------------

function FunctionsArt() {
  const items = [
    { name: "Álcool", ex: "etanol", parts: ["CH₃–CH₂–", "OH"], color: "#2563eb" },
    { name: "Ácido carboxílico", ex: "ácido acético (vinagre)", parts: ["CH₃–", "COOH"], color: "#dc2626" },
    { name: "Cetona", ex: "acetona (removedor de esmalte)", parts: ["CH₃–", "CO", "–CH₃"], color: "#16a34a" },
    { name: "Éster", ex: "aromas de frutas e perfumes", parts: ["CH₃–", "COO", "–R"], color: "#d97706" },
  ];
  return (
    <Art viewBox="0 0 600 200" label="As funções orgânicas: álcool com o grupo OH, ácido carboxílico com COOH, cetona com CO entre carbonos e éster com COO">
      {items.map((it, i) => {
        const x = 8 + (i % 2) * 296;
        const y = 8 + Math.floor(i / 2) * 96;
        return (
          <g key={it.name}>
            <rect x={x} y={y} width="284" height="86" rx="12" fill="#fffaf0" stroke="#d9c79d" strokeWidth="2" />
            <text x={x + 14} y={y + 24} fontSize="14" fontWeight="900" fill={it.color} fontFamily="Georgia, serif">
              {it.name}
            </text>
            {/* o brilho fica atrás do grupo funcional (fill-opacity, porque a animação mexe na opacity) */}
            <rect x={x + 14 + it.parts[0].length * 12} y={y + 34} width={it.parts[1].length * 12.4} height="28" rx="6" fill={it.color} fillOpacity="0.18" className="cg-anim-glow" />
            <text x={x + 14} y={y + 56} fontSize="20" fontWeight="900" fill="#3b2a14" fontFamily="monospace">
              {it.parts.map((p, k) => (
                <tspan key={k} fill={k === 1 ? it.color : "#3b2a14"}>
                  {p}
                </tspan>
              ))}
            </text>
            <text x={x + 14} y={y + 76} fontSize="11.5" fontStyle="italic" fill="#6b5a3a" fontFamily="Georgia, serif">
              {it.ex}
            </text>
          </g>
        );
      })}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Isômeros: a mesma fórmula, moléculas diferentes
// ---------------------------------------------------------------------------

function IsomersArt() {
  return (
    <Art viewBox="0 0 560 190" label="Dois isômeros com a mesma fórmula C₂H₆O: o etanol, um álcool, e o éter dimetílico">
      {/* etanol: C–C–O–H */}
      <g transform="translate(140 80)">
        <line x1="-40" y1="0" x2="40" y2="0" stroke="#475569" strokeWidth="4" />
        <line x1="40" y1="0" x2="64" y2="-18" stroke="#94a3b8" strokeWidth="3" />
        {[
          [-40, -24], [-40, 24], [-64, 0], [0, -24], [0, 24],
        ].map(([x, y], i) => (
          <g key={i}>
            <line x1={x < -40 ? -40 : x} y1="0" x2={x} y2={y} stroke="#94a3b8" strokeWidth="3" />
            <Ball el="H" x={x} y={y} r={8} label={false} />
          </g>
        ))}
        <Ball el="C" x={-40} r={12} />
        <Ball el="C" x={0} r={12} />
        <Ball el="O" x={40} r={13} />
        <Ball el="H" x={64} y={-18} r={8} label={false} />
      </g>
      {/* éter dimetílico: C–O–C */}
      <g transform="translate(420 80)">
        <line x1="-44" y1="0" x2="44" y2="0" stroke="#475569" strokeWidth="4" />
        {[
          [-44, -24], [-44, 24], [-68, 0], [44, -24], [44, 24], [68, 0],
        ].map(([x, y], i) => (
          <g key={i}>
            <line x1={x < 0 ? -44 : 44} y1="0" x2={x} y2={y} stroke="#94a3b8" strokeWidth="3" />
            <Ball el="H" x={x} y={y} r={8} label={false} />
          </g>
        ))}
        <Ball el="C" x={-44} r={12} />
        <Ball el="O" x={0} r={13} />
        <Ball el="C" x={44} r={12} />
      </g>
      <g fontFamily="Georgia, serif" textAnchor="middle">
        <text x="140" y="140" fontSize="14" fontWeight="900" fill="#2563eb">Etanol (álcool)</text>
        <text x="140" y="160" fontSize="12" fill="#5b4a2e">líquido, é o álcool dos carros</text>
        <text x="420" y="140" fontSize="14" fontWeight="900" fill="#16a34a">Éter dimetílico</text>
        <text x="420" y="160" fontSize="12" fill="#5b4a2e">um gás, nada parecido!</text>
        <text x="280" y="86" fontSize="16" fontWeight="900" fill="#a21caf">C₂H₆O</text>
        <text x="280" y="106" fontSize="11.5" fill="#701a75">mesma fórmula</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A torre da refinaria separando o petróleo
// ---------------------------------------------------------------------------

function RefineryArt() {
  const fractions = [
    ["Gás de cozinha (GLP)", "#e0f2fe"],
    ["Gasolina", "#fef9c3"],
    ["Querosene (aviões)", "#fde68a"],
    ["Óleo diesel", "#fdba74"],
    ["Óleos lubrificantes", "#d97706"],
    ["Asfalto", "#44403c"],
  ];
  return (
    <Art viewBox="0 0 560 260" label="A torre de destilação da refinaria: o petróleo aquecido sobe como vapor e se separa em gás, gasolina, querosene, diesel, óleos e asfalto">
      {/* a torre */}
      <rect x="180" y="20" width="110" height="220" rx="20" fill="#cbd5e1" stroke="#475569" strokeWidth="3" />
      {fractions.map(([, c], i) => (
        <rect key={i} x="186" y={30 + i * 34} width="98" height="30" rx="6" fill={c as string} opacity="0.9" />
      ))}
      {/* os vapores subindo */}
      {Array.from({ length: 6 }, (_, i) => (
        <circle key={i} cx={210 + (i % 3) * 25} r="4" fill="#fff" opacity="0.8">
          <animate attributeName="cy" values="220;40" dur="3s" begin={`${-i * 0.5}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.9;0" dur="3s" begin={`${-i * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* as saídas de cada fração */}
      {fractions.map(([name], i) => (
        <g key={name as string}>
          <path d={`M290 ${45 + i * 34} L330 ${45 + i * 34}`} stroke="#475569" strokeWidth="5" />
          <text x="338" y={50 + i * 34} fontSize="13" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
            {name}
          </text>
        </g>
      ))}
      {/* o petróleo entrando aquecido */}
      <path d="M40 220 L180 220" stroke="#1c1917" strokeWidth="10" />
      <g transform="translate(100 244)">
        <g className="cg-anim-flicker">
          <path d="M0 -26 C10 -14 10 -2 0 4 C-10 -2 -10 -14 0 -26 Z" fill="#f97316" />
        </g>
      </g>
      <g fontFamily="Georgia, serif" fontSize="12" fontWeight="900">
        <text x="40" y="206" fill="#1c1917">petróleo aquecido</text>
        <text x="172" y="40" textAnchor="end" fill="#0369a1">mais leve: sai em cima</text>
      </g>
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
      title="Química Orgânica"
      goals={["Por que o carbono é o átomo da vida", "Como reconhecer as funções orgânicas", "O que são isômeros", "De onde vêm a gasolina, o gás de cozinha e os plásticos"]}
    >
      <Fig h={34}>
        <OrganicOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="⛓️">O carbono, o átomo da vida</H>
      <P>
        A <T>Química Orgânica</T> estuda os compostos do <T>carbono</T>. Ele é especial porque faz <T>4 ligações</T> e consegue se ligar a outros carbonos, formando cadeias
        longuíssimas, anéis e ramificações. É a base de toda a vida: proteínas, açúcares, gorduras e o DNA.
      </P>
      <P>
        Os compostos mais simples são os <T>hidrocarbonetos</T>, feitos só de carbono e hidrogênio. O nome deles começa com um prefixo que conta os carbonos:
      </P>
      <Fig n="10.1" caption="Metano (gás natural e biogás), etano, propano e butano (os dois do gás de cozinha)." h={20}>
        <ChainsArt />
      </Fig>
      <Table head={["Prefixo", "met", "et", "prop", "but", "pent"]} rows={[["Carbonos", "1", "2", "3", "4", "5"]]} />
    </>,
  ),

  page(
    <>
      <H icon="🏷️">As funções orgânicas</H>
      <P>
        Quando a cadeia de carbono ganha um grupo de outros átomos, ela muda de comportamento. Esse grupo é o <T>grupo funcional</T>, e define a <T>função orgânica</T>:
      </P>
      <Fig n="10.2" caption="O grupo que brilha é o que dá o nome e o jeito de cada função." h={24}>
        <FunctionsArt />
      </Fig>
      <Cards
        items={[
          { icon: "🚗", title: "Álcoois (–OH)", text: "O etanol é o álcool mais conhecido: é o álcool de limpeza e o combustível dos carros." },
          { icon: "🥗", title: "Ácidos (–COOH)", text: "Sabor azedo, como o ácido acético do vinagre." },
          { icon: "💅", title: "Cetonas (C=O)", text: "A acetona tira o esmalte das unhas." },
          { icon: "🍌", title: "Ésteres", text: "Dão o cheiro das frutas: o aroma artificial de banana é um éster." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🔀">Isômeros e o benzeno</H>
      <P>
        <T>Isômeros</T> são substâncias com a <T>mesma fórmula molecular</T>, mas com os átomos arrumados de jeitos diferentes, e por isso com propriedades diferentes:
      </P>
      <Fig n="10.3" caption="O etanol e o éter dimetílico têm a mesma fórmula, C₂H₆O." h={22}>
        <IsomersArt />
      </Fig>
      <P>
        Outra molécula famosa é o <T>benzeno</T> (C₆H₆), o exemplo clássico dos compostos <T>aromáticos</T>: seis carbonos num anel, com ligações duplas alternadas (o anel da
        abertura do capítulo). O anel benzênico é muito estável e aparece em muitos remédios e corantes.
      </P>
    </>,
  ),

  page(
    <>
      <H icon="🛢️">Petróleo, combustíveis e polímeros</H>
      <P>
        O <T>petróleo</T> é uma mistura de muitos hidrocarbonetos. Na refinaria, ele é aquecido e separado por <T>destilação fracionada</T>: os componentes mais leves sobem e
        saem no alto da torre; os mais pesados ficam embaixo.
      </P>
      <Fig n="10.4" caption="Cada “andar” da torre recolhe uma parte do petróleo." h={26}>
        <RefineryArt />
      </Fig>
      <Cards
        items={[
          { icon: "🌱", title: "Etanol da cana", text: "No Brasil vem da fermentação do caldo da cana. É renovável: a cana absorve CO₂ ao crescer." },
          { icon: "🧸", title: "Polímeros", text: "Moléculas gigantes feitas de unidades repetidas: os plásticos, o amido, as proteínas e o DNA." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "O carbono faz 4 ligações e forma cadeias: é a base da Química Orgânica e da vida.",
          "Hidrocarbonetos têm só C e H; o metano (CH₄) é o mais simples.",
          "Funções: álcool (–OH), ácido carboxílico (–COOH), cetona (C=O entre carbonos) e éster (aromas).",
          "Isômeros têm a mesma fórmula e estruturas diferentes (etanol e éter dimetílico).",
          "O petróleo é separado por destilação fracionada; o GLP é propano + butano.",
        ]}
      />
      <Glossary
        items={[
          ["Hidrocarboneto", "Composto feito só de carbono e hidrogênio."],
          ["Grupo funcional", "O grupo de átomos que define a função orgânica."],
          ["Isômeros", "Substâncias com a mesma fórmula e estruturas diferentes."],
          ["Aromático", "Composto com o anel do benzeno."],
          ["Polímero", "Molécula gigante feita de unidades repetidas."],
        ]}
      />
      <Quiz
        items={[
          ["Qual é a fórmula do metano?", "CH₄: um carbono ligado a quatro hidrogênios."],
          ["Qual grupo funcional caracteriza os álcoois?", "A hidroxila, –OH."],
          ["Quantos carbonos tem o propano?", "Três (prefixo prop)."],
          ["Como o petróleo é separado nas refinarias?", "Por destilação fracionada, numa torre."],
        ]}
      />
    </>,
  ),
];
