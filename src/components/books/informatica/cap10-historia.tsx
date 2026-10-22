"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { TapTimeline } from "../historia-brasil/art";
import { INF, INF_DARK, Panel, Slider } from "./art";

// ============================================================================
// CAPÍTULO 10 — A HISTÓRIA DA COMPUTAÇÃO (missão "A História da
// Computação"): a fila da evolução, do ábaco ao robô, o ábaco com as contas
// correndo, a linha do tempo da computação (de tocar), o computador
// encolhendo de uma sala inteira até o bolso (de tocar) e as pessoas que
// fizeram essa história.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a fila da evolução
// ---------------------------------------------------------------------------

function EvolutionOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma fila da evolução dos computadores: o ábaco, o enorme ENIAC com válvulas, o computador de mesa, o celular e um robozinho de inteligência artificial, um depois do outro">
      <rect width="460" height="300" fill="#ccfbf1" />
      <rect y="230" width="460" height="70" fill="#99f6e4" />
      <path d="M20 250 L440 250" stroke={INF_DARK} strokeWidth="3" strokeDasharray="8 6">
        <animate attributeName="stroke-dashoffset" values="28;0" dur="1s" repeatCount="indefinite" />
      </path>
      <g transform="translate(50 230)">
        <rect x="-26" y="-50" width="52" height="46" fill="none" stroke="#92400e" strokeWidth="4" />
        {[0, 1, 2].map((r) => (
          <g key={r}>
            <line x1="-24" x2="24" y1={-40 + r * 14} y2={-40 + r * 14} stroke="#92400e" strokeWidth="2" />
            {[0, 1, 2].map((k) => (
              <circle key={k} cx={-16 + k * 8} cy={-40 + r * 14} r="4" fill="#dc2626" />
            ))}
          </g>
        ))}
      </g>
      <g transform="translate(140 230)">
        <rect x="-40" y="-90" width="80" height="86" fill="#64748b" stroke="#334155" strokeWidth="2" />
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i} cx={-28 + (i % 4) * 19} cy={-76 + Math.floor(i / 4) * 24} r="5" fill="#fbbf24">
            <animate attributeName="opacity" values="1;0.3;1" dur={`${0.6 + (i % 3) * 0.3}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </g>
      <g transform="translate(240 230)">
        <rect x="-34" y="-70" width="68" height="46" rx="4" fill="#e7e5e4" stroke="#78716c" strokeWidth="2" />
        <rect x="-28" y="-64" width="56" height="34" fill="#16a34a" />
        <text x="-24" y="-44" fontSize="9" fontFamily="monospace" fill="#bbf7d0">C:\&gt;_</text>
        <rect x="-40" y="-20" width="80" height="16" rx="3" fill="#d6d3d1" />
      </g>
      <g transform="translate(320 230)">
        <rect x="-14" y="-52" width="28" height="48" rx="6" fill="#1e293b" />
        <rect x="-11" y="-46" width="22" height="36" rx="2" fill="#a5f3fc" />
      </g>
      <g transform="translate(400 230)">
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0;0 -8;0 0" dur="1.2s" repeatCount="indefinite" />
          <rect x="-20" y="-56" width="40" height="34" rx="10" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
          <circle cx="-8" cy="-40" r="5" fill={INF}>
            <animate attributeName="r" values="5;2;5" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="8" cy="-40" r="5" fill={INF}>
            <animate attributeName="r" values="5;2;5" dur="2s" repeatCount="indefinite" />
          </circle>
          <line x1="0" y1="-56" x2="0" y2="-68" stroke="#64748b" strokeWidth="2" />
          <circle cy="-70" r="4" fill="#f97316" />
          <rect x="-16" y="-20" width="32" height="16" rx="4" fill="#cbd5e1" />
        </g>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O ábaco
// ---------------------------------------------------------------------------

function AbacusArt() {
  return (
    <Art viewBox="0 0 560 160" label="Um ábaco de madeira com as contas deslizando nas varetas, fazendo uma conta, ao lado da engrenagem da Pascalina">
      <rect width="560" height="160" rx="14" fill="#fef3c7" />
      <rect x="30" y="20" width="300" height="120" rx="8" fill="none" stroke="#78350f" strokeWidth="8" />
      {Array.from({ length: 5 }, (_, r) => (
        <g key={r}>
          <line x1="34" x2="326" y1={38 + r * 22} y2={38 + r * 22} stroke="#a16207" strokeWidth="3" />
          {Array.from({ length: 5 }, (_, k) => (
            <ellipse key={k} cx={60 + k * 20} cy={38 + r * 22} rx="9" ry="8" fill={["#dc2626", "#2563eb", "#16a34a", "#ca8a04", "#7c3aed"][r]}>
              {k === 4 && <animate attributeName="cx" values={`${60 + k * 20};${290};${290};${60 + k * 20}`} keyTimes="0;0.3;0.7;1" dur="4s" begin={`${-r * 0.5}s`} repeatCount="indefinite" />}
            </ellipse>
          ))}
        </g>
      ))}
      <g transform="translate(450 80)">
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="6s" repeatCount="indefinite" />
          {Array.from({ length: 10 }, (_, i) => (
            <rect key={i} x="-6" y="-58" width="12" height="14" fill="#a8a29e" transform={`rotate(${i * 36})`} />
          ))}
          <circle r="46" fill="#d6d3d1" stroke="#78716c" strokeWidth="3" />
          {Array.from({ length: 10 }, (_, i) => (
            <text key={i} x={Math.sin((i * 36 * Math.PI) / 180) * 32} y={-Math.cos((i * 36 * Math.PI) / 180) * 32 + 5} textAnchor="middle" fontSize="12" fontWeight="900" fill="#1e293b">
              {i}
            </text>
          ))}
        </g>
      </g>
      <text x="180" y="156" textAnchor="middle" fontSize="12" fontWeight="900" fill={INF_DARK} fontFamily="Georgia, serif">o ábaco</text>
      <text x="450" y="156" textAnchor="middle" fontSize="12" fontWeight="900" fill={INF_DARK} fontFamily="Georgia, serif">a engrenagem da Pascalina</text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A linha do tempo da computação
// ---------------------------------------------------------------------------

const MILESTONES = [
  { year: "1843", name: "Ada Lovelace", color: "#7c3aed", text: "Escreve o primeiro algoritmo da história, para a Máquina Analítica de Charles Babbage, que nunca foi terminada." },
  { year: "1936", name: "Alan Turing", color: "#2563eb", text: "Descreve a Máquina de Turing, a ideia matemática do computador que faz qualquer cálculo." },
  { year: "1946", name: "ENIAC", color: "#dc2626", text: "Um dos primeiros computadores eletrônicos: pesava 30 toneladas, ocupava uma sala e tinha milhares de válvulas." },
  { year: "1971", name: "Microprocessador", color: "#ca8a04", text: "O Intel 4004 coloca um processador inteiro dentro de um único chip." },
  { year: "1981", name: "O PC", color: "#16a34a", text: "O computador pessoal chega às casas e aos escritórios." },
  { year: "1991", name: "A Web", color: "#0f766e", text: "Tim Berners-Lee cria a World Wide Web, as páginas com links da internet." },
  { year: "2007", name: "Smartphone", color: "#db2777", text: "Os celulares com tela de toque viram computadores de bolso." },
  { year: "2022", name: "IA generativa", color: "#9333ea", text: "Programas de inteligência artificial passam a conversar, escrever e criar imagens." },
];

// ---------------------------------------------------------------------------
// O computador encolhendo (de tocar)
// ---------------------------------------------------------------------------

const ERAS = [
  { year: 1946, name: "ENIAC", size: "uma sala de 160 m²", ops: "5 mil contas por segundo", w: 360, h: 120, color: "#64748b" },
  { year: 1965, name: "Computador de transistores", size: "um armário", ops: "1 milhão de contas por segundo", w: 140, h: 120, color: "#475569" },
  { year: 1981, name: "PC de mesa", size: "uma mesa", ops: "300 mil a 1 milhão de instruções por segundo", w: 90, h: 70, color: "#a8a29e" },
  { year: 2024, name: "Celular", size: "o seu bolso", ops: "trilhões de contas por segundo", w: 22, h: 44, color: "#1e293b" },
];

export function ShrinkingComputer() {
  const [i, setI] = useState(0);
  const e = ERAS[i];
  return (
    <Panel title="O computador foi encolhendo e ficando mais forte">
      <svg viewBox="0 0 400 150" className="w-full" role="img" aria-label={`${e.name}, de ${e.year}: do tamanho de ${e.size}`}>
        <rect width="400" height="150" rx="10" fill="#f0fdfa" />
        <rect y="130" width="400" height="20" fill="#99f6e4" />
        <g transform="translate(14 130)">
          <path d="M0 0 L0 -26 M-6 -10 L6 -10 M0 -26 L-6 -14 M0 -26 L6 -14" stroke="#1e293b" strokeWidth="3" fill="none" />
          <circle cy="-32" r="6" fill="#f1c9a5" />
        </g>
        <rect key={i} x={40} y={130 - e.h} width={e.w} height={e.h} rx="4" fill={e.color} className="cg-anim-pop" />
        {i === 0 &&
          Array.from({ length: 24 }, (_, k) => <circle key={k} cx={56 + (k % 12) * 28} cy={30 + Math.floor(k / 12) * 40} r="5" fill="#fbbf24" />)}
      </svg>
      <Slider label="Ano" value={i} min={0} max={ERAS.length - 1} onChange={setI} format={(v) => String(ERAS[v].year)} />
      <p key={i} className="cg-anim-fade mt-[0.2em] text-[0.86em] leading-snug">
        <strong style={{ color: INF_DARK }}>{e.name}:</strong> do tamanho de {e.size}, com {e.ops}.
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 10, content, bare });

export const chapter10: BookPage[] = [
  page(
    <ChapterOpener n={10} title="A História da Computação" goals={["As máquinas de calcular antes da eletrônica", "Ada Lovelace, Turing e o ENIAC", "As gerações dos computadores", "As pessoas que fizeram essa história"]}>
      <Fig h={34}>
        <EvolutionOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🧮">Antes da eletrônica</H>
      <P>
        Muito antes da eletricidade, as pessoas inventaram máquinas para calcular. O <T>ábaco</T>, com contas em varetas, é usado há milhares de anos. Em 1642, Blaise
        Pascal criou a <T>Pascalina</T>, com engrenagens que somavam sozinhas.
      </P>
      <Fig n="10.1" caption="O ábaco e as engrenagens da Pascalina." h={18}>
        <AbacusArt />
      </Fig>
      <Box kind="sabia">
        Em 1804, o <strong>tear de Jacquard</strong> tecia desenhos seguindo <strong>cartões perfurados</strong>: buracos e não buracos, como os 1 e 0 dos computadores.
        Charles Babbage usou essa ideia na sua Máquina Analítica.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="⏳">A linha do tempo</H>
      <P>Toque nos anos para conhecer alguns dos momentos mais importantes da computação:</P>
      <TapTimeline items={MILESTONES} start={0} />
      <Box kind="lembre">
        <strong>Ada Lovelace</strong> é considerada a primeira programadora da história, e <strong>Alan Turing</strong>, o pai da ciência da computação.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="📉">Cada vez menores</H>
      <P>
        Os computadores passaram por <T>gerações</T>: cada nova peça os deixou menores, mais baratos e mais rápidos. Hoje um celular é milhões de vezes mais rápido que
        o ENIAC. Arraste:
      </P>
      <ShrinkingComputer />
      <Table
        head={["Geração", "A peça principal"]}
        rows={[
          ["1ª (anos 1940)", "Válvulas, que esquentavam e queimavam muito"],
          ["2ª (anos 1950)", "Transistores, menores e mais confiáveis"],
          ["3ª (anos 1960)", "Circuitos integrados: vários transistores num chip"],
          ["4ª (anos 1970 em diante)", "Microprocessadores: o processador inteiro num chip"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="👥">Gente que fez história</H>
      <Cards
        items={[
          { icon: "📜", title: "Ada Lovelace", text: "Matemática inglesa que escreveu o primeiro algoritmo, em 1843." },
          { icon: "🔐", title: "Alan Turing", text: "Ajudou a decifrar códigos na Segunda Guerra e pensou as bases da computação." },
          { icon: "🐞", title: "Grace Hopper", text: "Criou linguagens de programação; sua equipe achou um inseto de verdade dentro de um computador: um “bug”." },
          { icon: "🚀", title: "Katherine Johnson", text: "Fez os cálculos das viagens espaciais da NASA, como a da Apollo 11." },
          { icon: "🌐", title: "Tim Berners-Lee", text: "Inventou a World Wide Web, em 1991, e a deixou livre para todos." },
          { icon: "🖥️", title: "Patinho Feio", text: "O primeiro computador feito no Brasil, na USP, em 1972." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "O ábaco e a Pascalina calculavam antes da eletrônica.",
          "Ada Lovelace escreveu o primeiro algoritmo; Turing pensou o computador universal.",
          "O ENIAC (1946) ocupava uma sala; hoje um celular é milhões de vezes mais rápido.",
          "As gerações foram das válvulas aos transistores, aos chips e aos microprocessadores.",
          "A Web nasceu em 1991, o smartphone se popularizou em 2007, e a IA generativa em 2022.",
        ]}
      />
      <Glossary
        items={[
          ["Ábaco", "Instrumento de calcular com contas em varetas."],
          ["Algoritmo", "Uma sequência de passos para resolver um problema."],
          ["Válvula", "Peça eletrônica antiga, grande e quente, dos primeiros computadores."],
          ["Transistor", "Pequeno interruptor eletrônico que substituiu a válvula."],
          ["Microprocessador", "Um processador inteiro dentro de um chip."],
        ]}
      />
      <Quiz
        items={[
          ["Quem é considerada a primeira programadora da história?", "Ada Lovelace."],
          ["O que foi o ENIAC?", "Um dos primeiros computadores eletrônicos, de 1946, do tamanho de uma sala."],
          ["Qual peça deixou os computadores menores depois das válvulas?", "O transistor."],
          ["Quem criou a World Wide Web?", "Tim Berners-Lee."],
        ]}
      />
    </>,
  ),
];
