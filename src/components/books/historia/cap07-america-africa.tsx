"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table, useUid } from "../BookParts";
import type { BookPage } from "../types";
import { DesertSun } from "./art";

// ============================================================================
// CAPÍTULO 7 — POVOS DA AMÉRICA E DA ÁFRICA (missão "História Geral: Os
// Povos da América e da África"): a pirâmide maia com o Sol, Tenochtitlán no
// meio do lago com as canoas, o quipo inca que mostra um número com nós (de
// mexer), a caravana de ouro de Mansa Musa e a tabela da conquista.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a pirâmide maia
// ---------------------------------------------------------------------------

function MayaOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma pirâmide maia de degraus com um templo no alto, cercada pela floresta, com o Sol passando por cima">
      <rect width="460" height="300" fill="#fde68a" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="-60 40;520 40" dur="14s" repeatCount="indefinite" />
        <DesertSun x={0} y={30} r={22} />
      </g>
      <rect y="230" width="460" height="70" fill="#15803d" />
      {Array.from({ length: 8 }, (_, i) => (
        <circle key={i} cx={20 + i * 60} cy="232" r="30" fill={i % 2 ? "#16a34a" : "#166534"} />
      ))}
      <g fill="#d6d3d1" stroke="#78716c" strokeWidth="2">
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={110 + i * 20} y={232 - (i + 1) * 26} width={240 - i * 40} height="26" />
        ))}
        <rect x="200" y="56" width="60" height="22" />
        <path d="M196 56 L230 40 L264 56 Z" />
      </g>
      <path d="M218 232 L218 80 L242 80 L242 232 Z" fill="#a8a29e" />
      {Array.from({ length: 14 }, (_, i) => (
        <line key={i} x1="218" y1={84 + i * 11} x2="242" y2={84 + i * 11} stroke="#78716c" strokeWidth="1.5" />
      ))}
      <rect x="220" y="62" width="20" height="16" fill="#44403c" />
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Tenochtitlán no meio do lago
// ---------------------------------------------------------------------------

function TenochtitlanArt() {
  return (
    <Art viewBox="0 0 560 210" label="A cidade asteca de Tenochtitlán construída no meio de um lago, com templos, canais, jardins flutuantes e canoas navegando">
      <rect width="560" height="210" rx="14" fill="#38bdf8" />
      <ellipse cx="280" cy="110" rx="180" ry="72" fill="#d6a77a" stroke="#a16207" strokeWidth="2" />
      {/* os canais */}
      <path d="M100 110 L460 110 M280 40 L280 180" stroke="#38bdf8" strokeWidth="10" />
      {/* o templo maior */}
      <g transform="translate(280 110)">
        <path d="M-40 0 L-28 -36 L28 -36 L40 0 Z" fill="#e7e5e4" stroke="#78716c" strokeWidth="2" />
        <rect x="-24" y="-48" width="20" height="12" fill="#dc2626" />
        <rect x="4" y="-48" width="20" height="12" fill="#2563eb" />
      </g>
      {/* as casinhas e os jardins flutuantes */}
      {[
        [170, 80],
        [200, 140],
        [380, 80],
        [360, 145],
        [150, 120],
        [420, 125],
      ].map(([x, y], i) => (
        <rect key={i} x={x - 10} y={y - 8} width="20" height="14" fill={i % 2 ? "#fde68a" : "#fecaca"} stroke="#92400e" />
      ))}
      {[
        [70, 60],
        [500, 160],
        [490, 50],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="40" height="16" rx="3" fill="#4ade80" stroke="#15803d" />
      ))}
      {/* as canoas */}
      {[0, 1].map((k) => (
        <g key={k}>
          <animateMotion path={k ? "M60 190 Q280 210 510 190" : "M520 30 Q280 10 50 30"} dur={`${9 + k * 2}s`} repeatCount="indefinite" />
          <path d="M-14 0 Q0 8 14 0 Z" fill="#78350f" />
          <circle cy="-6" r="4" fill="#a16207" />
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O quipo inca (de mexer)
// ---------------------------------------------------------------------------

export function QuipuReader() {
  const [n, setN] = useState(235);
  const digits = [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10];
  const labels = ["centenas", "dezenas", "unidades"];
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.5em]">
      <svg viewBox="0 0 520 200" className="block w-full rounded-lg" aria-label={`Um quipo mostrando o número ${n} com nós`}>
        <rect width="520" height="200" fill="#fef3c7" />
        <path d="M60 30 L460 30" stroke="#a16207" strokeWidth="8" strokeLinecap="round" />
        {[0, 1, 2].map((cord) => {
          const x = 140 + cord * 120;
          return (
            <g key={cord}>
              <path d={`M${x} 30 Q${x + 6} 110 ${x - 4} 190`} stroke={["#dc2626", "#2563eb", "#16a34a"][cord]} strokeWidth="5" fill="none" />
              {/* cada nó vale 1 nessa casa (simplificado: aqui cada corda é uma casa) */}
              {Array.from({ length: digits[cord] }, (_, k) => (
                <circle key={k} cx={x + 2} cy={60 + k * 13} r="6" fill="#78350f" className="cg-anim-pop" style={{ animationDelay: `${k * 0.05}s` }} />
              ))}
              <text x={x} y="20" textAnchor="middle" fontSize="11" fontWeight="900" fill="#78350f" fontFamily="Georgia, serif">
                {labels[cord]}: {digits[cord]}
              </text>
            </g>
          );
        })}
      </svg>
      <label className="mt-[0.3em] block">
        <span className="font-bold text-[#3b2a14]">Número no quipo: {n}</span>
        <input type="range" min={0} max={999} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-full accent-[#a16207]" />
      </label>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A caravana de ouro de Mansa Musa
// ---------------------------------------------------------------------------

function CaravanArt() {
  const u = useUid("caravana");
  return (
    <Art viewBox="0 0 560 200" label="Uma caravana de camelos carregados de ouro atravessando o deserto do Saara, liderada por Mansa Musa, o rei do Mali">
      <rect width="560" height="200" rx="14" fill="#fed7aa" />
      <DesertSun x={480} y={44} r={24} />
      <path d="M0 150 Q100 120 200 140 Q320 164 440 130 Q500 116 560 128 L560 200 L0 200 Z" fill="#fcd34d" />
      <defs>
        <clipPath id={u}>
          <rect width="560" height="200" rx="14" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${u})`}>
        <animateTransform attributeName="transform" type="translate" values="-260 0;560 0" dur="16s" repeatCount="indefinite" />
        {[0, 1, 2].map((k) => (
          <g key={k} transform={`translate(${k * 80} 140)`}>
            <g>
              <animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur="0.8s" begin={`${-k * 0.2}s`} repeatCount="indefinite" />
              <ellipse rx="26" ry="12" fill="#b45309" />
              <circle cx="-4" cy="-14" r="10" fill="#b45309" />
              <path d="M22 -4 Q34 -20 34 -30 L40 -32 L40 -26 Q38 -12 26 4" fill="#b45309" />
              <path d="M-18 8 L-20 26 M-6 10 L-6 26 M8 10 L8 26 M18 8 L20 26" stroke="#b45309" strokeWidth="4" />
              <rect x="-18" y="-24" width="14" height="10" fill="#facc15" stroke="#a16207" />
              <rect x="4" y="-22" width="12" height="9" fill="#facc15" stroke="#a16207" />
            </g>
          </g>
        ))}
        {/* o rei na frente */}
        <g transform="translate(240 140)">
          <ellipse rx="26" ry="12" fill="#f5f5f4" stroke="#a8a29e" />
          <path d="M22 -4 Q34 -20 34 -30 L40 -32 L40 -26 Q38 -12 26 4" fill="#f5f5f4" stroke="#a8a29e" />
          <path d="M-18 8 L-20 26 M-6 10 L-6 26 M8 10 L8 26 M18 8 L20 26" stroke="#a8a29e" strokeWidth="4" />
          <rect x="-8" y="-38" width="16" height="22" rx="4" fill="#7c3aed" />
          <circle cy="-44" r="7" fill="#5c3a1e" />
          <path d="M-8 -50 L-6 -56 L0 -52 L6 -56 L8 -50 Z" fill="#facc15" />
        </g>
      </g>
      <text x="280" y="34" textAnchor="middle" fontSize="13" fontWeight="900" fill="#7c2d12" fontFamily="Georgia, serif">
        Mansa Musa a caminho de Meca, 1324
      </text>
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
      title="Povos da América e da África"
      goals={["Os maias e os astecas", "Os incas e os quipos", "Os grandes reinos da África", "O que aconteceu com a chegada dos europeus"]}
    >
      <Fig h={34}>
        <MayaOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🌽">Maias e astecas</H>
      <P>
        Muito antes dos europeus, a América tinha grandes civilizações. Os <T>maias</T>, na América Central, tinham escrita própria, um calendário muito preciso e
        usavam o <T>zero</T>. Os <T>astecas</T> construíram a capital <T>Tenochtitlán</T> no meio de um lago, onde hoje fica a Cidade do México.
      </P>
      <Fig n="7.1" caption="Tenochtitlán, a cidade sobre o lago, com canais e jardins flutuantes." h={21}>
        <TenochtitlanArt />
      </Fig>
    </>,
  ),

  page(
    <>
      <H icon="🦙">Os incas</H>
      <P>
        Os <T>incas</T> formaram um enorme império nos <T>Andes</T>, com estradas pelas montanhas e a cidade de <T>Machu Picchu</T>, construída no século XV. Eles não
        tinham uma escrita como a nossa, mas guardavam números nos <T>quipos</T>: cordões com nós. Monte um número:
      </P>
      <QuipuReader />
    </>,
  ),

  page(
    <>
      <H icon="👑">Os reinos da África</H>
      <P>
        A África também teve reinos riquíssimos. O antigo <T>Reino de Gana</T> era chamado de “terra do ouro”. No <T>Império do Mali</T>, o rei <T>Mansa Musa</T> levou
        tanto ouro na viagem a Meca que o preço do metal caiu no Egito.
      </P>
      <Fig n="7.2" caption="A caravana de ouro de Mansa Musa." h={20}>
        <CaravanArt />
      </Fig>
      <Cards
        items={[
          { icon: "📚", title: "Timbuktu", text: "Cidade do Mali famosa pelas bibliotecas e universidades, com milhares de manuscritos." },
          { icon: "🗿", title: "Axum", text: "Reino da atual Etiópia, com moedas próprias e enormes obeliscos de pedra." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="⚔️">A conquista da América</H>
      <P>
        Com a chegada dos europeus, a partir de 1492, os povos da América sofreram guerras e dominação. Além das batalhas, muitos morreram por <T>doenças</T> trazidas
        pelos europeus, como a <T>varíola</T>, contra as quais eles não tinham defesa.
      </P>
      <Table
        head={["Ano", "Acontecimento"]}
        rows={[
          ["1492", "Colombo chega à América"],
          ["1521", "O espanhol Hernán Cortés derrota os astecas"],
          ["1530s", "Francisco Pizarro conquista o Império Inca"],
        ]}
      />
      <Box kind="lembre">
        Os povos indígenas resistiram e resistem até hoje. Muitas línguas e costumes deles continuam vivos, como o quéchua dos Andes, falado por milhões de pessoas.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Os maias tinham escrita, um calendário preciso e usavam o zero.",
          "Os astecas construíram Tenochtitlán sobre um lago, onde hoje é a Cidade do México.",
          "Os incas viviam nos Andes, construíram Machu Picchu e registravam números nos quipos.",
          "Gana, Mali (Mansa Musa, Timbuktu) e Axum foram grandes reinos africanos.",
          "Cortés derrotou os astecas (1521); a varíola matou milhões de indígenas.",
        ]}
      />
      <Glossary
        items={[
          ["Civilização", "Sociedade com cidades, governo e cultura organizados."],
          ["Quipo", "Cordões com nós usados pelos incas para registrar números."],
          ["Chinampa", "Jardim flutuante dos astecas."],
          ["Caravana", "Grupo que viaja junto, com animais de carga."],
          ["Epidemia", "Doença que se espalha rapidamente."],
        ]}
      />
      <Quiz
        items={[
          ["Qual civilização tinha um calendário preciso e usava o zero?", "Os maias."],
          ["Qual era a capital dos astecas?", "Tenochtitlán."],
          ["O que eram os quipos?", "Cordões com nós que registravam números e informações."],
          ["Quem foi Mansa Musa?", "O rei do Império do Mali, uma das pessoas mais ricas da história."],
        ]}
      />
    </>,
  ),
];
