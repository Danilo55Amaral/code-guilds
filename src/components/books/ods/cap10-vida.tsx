"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Tree } from "./art";

// ============================================================================
// CAPÍTULO 10 — A VIDA NA ÁGUA E NA TERRA (missão "ODS: Consumo, Cidades e
// Biodiversidade", a parte da biodiversidade, e o ODS 14 de "ODS"): a
// floresta em cima e o mar embaixo, os biomas do Brasil (de tocar), o
// mico-leão-dourado pulando de galho em galho, a tartaruga e a sacola
// plástica no mar e o parque nacional protegido.
// ============================================================================

/** O peixinho nadando (o centro em x, y). */
function Fish({ x, y, color, flip = false }: { x: number; y: number; color: string; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <ellipse rx="14" ry="8" fill={color} />
      <path d="M12 0 L24 -8 L24 8 Z" fill={color} />
      <circle cx="-7" cy="-2" r="2" fill="#1e293b" />
    </g>
  );
}

/** O mico-leão-dourado (o centro em x, y). */
function GoldenTamarin({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M8 6 Q30 20 22 46" stroke="#f59e0b" strokeWidth="5" fill="none" strokeLinecap="round" />
      <ellipse cx="0" cy="6" rx="12" ry="14" fill="#f59e0b" />
      <circle cx="0" cy="-12" r="14" fill="#fbbf24" />
      <circle cx="0" cy="-10" r="7" fill="#7c2d12" />
      <circle cx="-2.5" cy="-12" r="1.4" fill="#fff" />
      <circle cx="2.5" cy="-12" r="1.4" fill="#fff" />
      <path d="M-10 14 L-14 24 M10 14 L14 24" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Abertura: a floresta em cima e o mar embaixo
// ---------------------------------------------------------------------------

function LifeOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Em cima, a floresta com árvores e um mico-leão-dourado; embaixo, o mar com peixes, uma tartaruga e corais">
      <rect width="460" height="150" fill="#dcfce7" />
      {[30, 110, 200, 290, 380, 440].map((x, i) => (
        <Tree key={x} x={x} y={150} s={1 + (i % 2) * 0.3} color={i % 2 ? "#15803d" : "#16a34a"} />
      ))}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;90 -10;180 0;90 -10;0 0" dur="8s" repeatCount="indefinite" />
        <GoldenTamarin x={140} y={80} s={0.8} />
      </g>
      <rect y="150" width="460" height="150" fill="#0ea5e9" />
      <path d="M0 150 Q57 140 115 150 T230 150 T345 150 T460 150 L460 160 L0 160 Z" fill="#7dd3fc" />
      {/* os corais */}
      {[60, 170, 330, 410].map((x, i) => (
        <path key={x} d={`M${x} 300 L${x} 270 M${x} 282 L${x - 12} 266 M${x} 280 L${x + 12} 262`} stroke={["#f472b6", "#fb923c", "#facc15", "#a78bfa"][i]} strokeWidth="6" strokeLinecap="round" />
      ))}
      {/* os peixes */}
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <animateTransform attributeName="transform" type="translate" values={`${k % 2 ? 480 : -40} 0;${k % 2 ? -40 : 480} 0`} dur={`${8 + k * 2}s`} begin={`${-k * 3}s`} repeatCount="indefinite" />
          <Fish x={0} y={190 + k * 26} color={["#facc15", "#f97316", "#22d3ee"][k]} flip={k % 2 === 0} />
        </g>
      ))}
      {/* a tartaruga */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;40 -10;0 0" dur="6s" repeatCount="indefinite" />
        <g transform="translate(240 230)">
          <ellipse rx="26" ry="16" fill="#65a30d" stroke="#3f6212" strokeWidth="2" />
          <path d="M-10 -10 L10 10 M10 -10 L-10 10" stroke="#3f6212" strokeWidth="1.5" />
          <circle cx="-30" cy="-2" r="7" fill="#84cc16" />
          <ellipse cx="-14" cy="16" rx="8" ry="4" fill="#84cc16" />
          <ellipse cx="16" cy="16" rx="8" ry="4" fill="#84cc16" />
        </g>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os biomas do Brasil (de tocar)
// ---------------------------------------------------------------------------

const BIOMES = [
  { name: "Amazônia", icon: "🌳", color: "#15803d", scene: "🌳🦜🐆🌧️", text: "A maior floresta tropical do mundo, com rios enormes e milhares de espécies. Guarda muito carbono nas árvores." },
  { name: "Cerrado", icon: "🌾", color: "#ca8a04", scene: "🌾🦌🌳☀️", text: "A savana brasileira, de árvores de tronco torto e raízes profundas. É chamado de “berço das águas”: nele nascem rios importantes." },
  { name: "Mata Atlântica", icon: "🐒", color: "#16a34a", scene: "🌲🐒🦋💧", text: "A floresta da costa, onde vive a maior parte dos brasileiros. Restam só cerca de 12% da mata original. É a casa do mico-leão-dourado." },
  { name: "Caatinga", icon: "🌵", color: "#c2410c", scene: "🌵🦎☀️🐐", text: "Só existe no Brasil! As plantas guardam água e perdem as folhas na seca. Quando chove, tudo fica verde de novo." },
  { name: "Pantanal", icon: "🐊", color: "#0ea5e9", scene: "🐊🐦🐟💧", text: "A maior planície alagável do mundo. Na época das cheias, os campos viram lagoas cheias de peixes e aves." },
  { name: "Pampa", icon: "🐄", color: "#65a30d", scene: "🌾🐄🌬️🌾", text: "Os campos do sul do Brasil, com capim baixo e muito vento. É um dos biomas menos protegidos." },
];

export function BiomeExplorer() {
  const [sel, setSel] = useState(0);
  const b = BIOMES[sel];
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <div className="flex flex-wrap justify-center gap-[0.3em] text-[0.82em]">
        {BIOMES.map((x, i) => (
          <button
            key={x.name}
            type="button"
            onClick={() => setSel(i)}
            className={`rounded-full border px-[0.6em] py-[0.1em] font-bold ${sel === i ? "text-white" : "border-[#d9c79d] bg-white"}`}
            style={sel === i ? { background: x.color, borderColor: x.color } : undefined}
          >
            {x.icon} {x.name}
          </button>
        ))}
      </div>
      <div key={sel} className="cg-anim-fade mt-[0.4em] rounded-lg p-[0.5em]" style={{ background: `${b.color}1f` }}>
        <p className="text-center text-[2em] tracking-[0.2em]">{b.scene}</p>
        <p className="cg-book-title text-center font-black" style={{ color: b.color }}>
          {b.name}
        </p>
        <p className="text-[0.88em] leading-[1.4] text-[#1e293b]">{b.text}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// O mico-leão-dourado pulando de galho em galho
// ---------------------------------------------------------------------------

function TamarinArt() {
  return (
    <Art viewBox="0 0 560 210" label="Um mico-leão-dourado pulando de galho em galho na Mata Atlântica, com o gráfico da população subindo de cerca de 200 para mais de 4 mil">
      <rect width="560" height="210" rx="14" fill="#f0fdf4" />
      <path d="M0 70 Q140 50 280 80" stroke="#78350f" strokeWidth="8" fill="none" />
      <path d="M0 150 Q120 130 270 150" stroke="#78350f" strokeWidth="8" fill="none" />
      {[30, 120, 210].map((x) => (
        <ellipse key={x} cx={x} cy="58" rx="40" ry="14" fill="#16a34a" />
      ))}
      <g>
        <animateMotion path="M40 60 Q100 0 160 66 Q200 120 230 140 Q150 90 40 60" dur="5s" repeatCount="indefinite" />
        <GoldenTamarin x={0} y={-14} s={0.9} />
      </g>
      {/* o gráfico da população */}
      <g transform="translate(320 30)">
        <rect width="220" height="150" rx="10" fill="#fff" stroke="#bbf7d0" strokeWidth="2" />
        <path d="M24 130 L24 20 M24 130 L206 130" stroke="#475569" strokeWidth="2" />
        <path d="M30 124 L80 118 L130 80 L190 30" stroke="#f59e0b" strokeWidth="4" fill="none" strokeDasharray="300" strokeDashoffset="300">
          <animate attributeName="stroke-dashoffset" values="300;0;0" keyTimes="0;0.6;1" dur="5s" repeatCount="indefinite" />
        </path>
        <g fontFamily="Georgia, serif" fontSize="11" fontWeight="900">
          <text x="30" y="112" fill="#92400e">~200</text>
          <text x="150" y="26" fill="#92400e">+4 mil</text>
          <text x="30" y="146" fill="#475569">anos 1970</text>
          <text x="170" y="146" fill="#475569">hoje</text>
        </g>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A tartaruga e a sacola plástica no mar
// ---------------------------------------------------------------------------

function PlasticSeaArt() {
  return (
    <Art viewBox="0 0 560 210" label="No mar, uma tartaruga nada em direção a uma sacola plástica que parece uma água-viva; ao lado, garrafas e canudos boiando">
      <rect width="560" height="210" rx="14" fill="#0284c7" />
      <path d="M0 30 Q70 20 140 30 T280 30 T420 30 T560 30 L560 0 L0 0 Z" fill="#7dd3fc" />
      {/* a água-viva de verdade */}
      <g transform="translate(110 110)">
        <g className="cg-anim-float">
          <path d="M-20 0 Q0 -30 20 0 Z" fill="#f9a8d4" opacity="0.85" />
          {[-12, -4, 4, 12].map((x) => (
            <path key={x} d={`M${x} 0 q4 12 0 24`} stroke="#f9a8d4" strokeWidth="2" fill="none" />
          ))}
        </g>
        <text y="56" textAnchor="middle" fontSize="11.5" fontWeight="900" fill="#e0f2fe" fontFamily="Georgia, serif">
          água-viva
        </text>
      </g>
      {/* a sacola plástica */}
      <g transform="translate(330 100)">
        <g className="cg-anim-float" style={{ animationDelay: "-1s" }}>
          <path d="M-22 -10 L22 -10 L18 30 L-18 30 Z" fill="#f8fafc" opacity="0.75" />
          <path d="M-14 -10 Q-14 -26 -4 -26 M14 -10 Q14 -26 4 -26" stroke="#f8fafc" strokeWidth="3" fill="none" opacity="0.75" />
        </g>
        <text y="-36" textAnchor="middle" fontSize="11.5" fontWeight="900" fill="#fecaca" fontFamily="Georgia, serif">
          sacola plástica
        </text>
      </g>
      {/* a tartaruga indo em direção à sacola */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;90 -10;0 0" dur="6s" repeatCount="indefinite" />
        <g transform="translate(200 150)">
          <ellipse rx="28" ry="17" fill="#65a30d" stroke="#3f6212" strokeWidth="2" />
          <circle cx="32" cy="-4" r="8" fill="#84cc16" />
          <ellipse cx="-14" cy="18" rx="9" ry="4" fill="#84cc16" />
          <ellipse cx="16" cy="18" rx="9" ry="4" fill="#84cc16" />
        </g>
      </g>
      {/* o lixo boiando */}
      {["🥤", "🧴", "🥡"].map((e, i) => (
        <text key={i} x={430 + i * 36} y={60 + (i % 2) * 20} fontSize="22">
          {e}
        </text>
      ))}
      <text x="470" y="190" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fef3c7" fontFamily="Georgia, serif">
        a tartaruga confunde!
      </text>
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
      title="A Vida na Água e na Terra"
      goals={["O que é biodiversidade e por que o Brasil é megadiverso", "Os seis biomas brasileiros", "Como o plástico ameaça os oceanos", "Como proteger as espécies e as florestas"]}
    >
      <Fig h={34}>
        <LifeOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🦜">O Brasil megadiverso</H>
      <P>
        <T>Biodiversidade</T> é a variedade de vida: plantas, animais, fungos e micróbios. O Brasil é um país <T>megadiverso</T>: tem uma das maiores biodiversidades
        do planeta e a maior quantidade de espécies de plantas. Conheça os seis biomas brasileiros:
      </P>
      <BiomeExplorer />
      <Box kind="lembre">
        O <strong>ODS 14</strong> trata da vida na água; o <strong>ODS 15</strong>, da vida na terra: florestas, biodiversidade e o combate à desertificação.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🐒">O mico-leão-dourado</H>
      <P>
        O <T>mico-leão-dourado</T> vive só na Mata Atlântica e quase foi extinto: nos anos 1970, restavam cerca de 200. Graças a projetos de proteção, reflorestamento e
        corredores de mata ligando os pedaços de floresta, hoje eles passam de 4 mil.
      </P>
      <Fig n="10.1" caption="O mico-leão-dourado virou símbolo da conservação." h={21}>
        <TamarinArt />
      </Fig>
      <Cards
        items={[
          { icon: "🐆", title: "Onça-pintada", text: "O maior felino das Américas, ameaçado pelo desmatamento." },
          { icon: "🦜", title: "Ararinha-azul", text: "Desapareceu da natureza e foi reintroduzida na Bahia em 2022." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🌊">O plástico nos oceanos</H>
      <P>
        Milhões de toneladas de plástico chegam aos oceanos todos os anos. Tartarugas confundem sacolas com <T>águas-vivas</T>, aves comem pedacinhos de plástico, e os{" "}
        <T>microplásticos</T> já foram encontrados até no sal e nos peixes.
      </P>
      <Fig n="10.2" caption="Para a tartaruga, a sacola parece comida." h={22}>
        <PlasticSeaArt />
      </Fig>
      <Box kind="atencao">
        Os <strong>corais</strong> também sofrem: com o mar mais quente, eles perdem as algas que lhes dão cor e ficam brancos. É o <strong>branqueamento</strong>.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🏞️">Proteger a natureza</H>
      <P>
        As <T>unidades de conservação</T> são áreas protegidas por lei, como os parques nacionais e as reservas. O <T>Parque Nacional do Iguaçu</T> e o de{" "}
        <T>Fernando de Noronha</T> são exemplos. As <T>terras indígenas</T> também estão entre as áreas mais preservadas do país.
      </P>
      <Cards
        items={[
          { icon: "🌱", title: "Reflorestar", text: "Plantar árvores nativas devolve a casa dos animais." },
          { icon: "🚫", title: "Não comprar animais silvestres", text: "O tráfico de animais é crime e ameaça muitas espécies." },
          { icon: "🏖️", title: "Praia limpa", text: "Levar o lixo de volta para casa protege o mar." },
          { icon: "🔥", title: "Sem queimadas", text: "O fogo destrói a floresta e solta gás carbônico." },
        ]}
      />
      <Box kind="experimente">Pesquise uma unidade de conservação perto da sua cidade. Que animais e plantas vivem lá?</Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "O Brasil é megadiverso, com seis biomas: Amazônia, Cerrado, Mata Atlântica, Caatinga, Pantanal e Pampa.",
          "O mico-leão-dourado quase foi extinto e se recuperou graças a projetos de proteção.",
          "O plástico ameaça os oceanos: tartarugas confundem sacolas com águas-vivas.",
          "As unidades de conservação e as terras indígenas protegem a natureza.",
          "O ODS 14 trata da vida na água; o ODS 15, da vida na terra.",
        ]}
      />
      <Glossary
        items={[
          ["Biodiversidade", "A variedade de seres vivos de um lugar."],
          ["Bioma", "Uma grande região com clima, plantas e animais parecidos."],
          ["Megadiverso", "País com uma das maiores biodiversidades do mundo."],
          ["Unidade de conservação", "Área protegida por lei, como um parque nacional."],
          ["Microplástico", "Pedacinho minúsculo de plástico."],
        ]}
      />
      <Quiz
        items={[
          ["Por que o Brasil é megadiverso?", "Porque tem uma das maiores biodiversidades do planeta."],
          ["Qual primata virou símbolo da conservação da Mata Atlântica?", "O mico-leão-dourado."],
          ["O que são unidades de conservação?", "Áreas protegidas por lei, como parques nacionais e reservas."],
          ["Qual ODS trata da vida terrestre?", "O ODS 15."],
        ]}
      />
    </>,
  ),
];
