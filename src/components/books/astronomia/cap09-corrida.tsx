"use client";

import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Earth, Rocket, Stars } from "./art";

// ============================================================================
// CAPÍTULO 9 — A CORRIDA ESPACIAL (missão "Astronomia: A Corrida Espacial"):
// o foguete decolando, o Sputnik dando a volta na Terra com o bip-bip, o
// módulo lunar da Apollo 11 pousando, a Estação Espacial em órbita e o robô
// em Marte com o helicóptero voando.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o foguete decolando
// ---------------------------------------------------------------------------

function LaunchOpenerArt() {
  const loop = { dur: "6s", repeatCount: "indefinite" };
  return (
    <Art viewBox="0 0 460 300" label="Um foguete decolando da plataforma depois da contagem regressiva, com nuvens de fumaça embaixo">
      <defs>
        <linearGradient id="ast9-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#020617" />
          <stop offset="1" stopColor="#1e3a8a" />
        </linearGradient>
      </defs>
      <rect width="460" height="300" fill="url(#ast9-sky)" />
      <Stars w={460} h={200} n={40} seed={71} />
      <rect y="260" width="460" height="40" fill="#334155" />
      {/* a torre */}
      <rect x="270" y="110" width="16" height="150" fill="#64748b" />
      {Array.from({ length: 6 }, (_, i) => (
        <path key={i} d={`M270 ${118 + i * 24} L286 ${130 + i * 24} M286 ${118 + i * 24} L270 ${130 + i * 24}`} stroke="#475569" strokeWidth="2" />
      ))}
      {/* o foguete subindo depois da contagem */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 0;0 -330;0 -330" keyTimes="0;0.45;0.95;1" calcMode="spline" keySplines="0 0 1 1;0.6 0 1 1;0 0 1 1" {...loop} />
        <Rocket x={230} y={200} s={1.1} />
      </g>
      {/* a fumaça */}
      {[180, 230, 280].map((x, i) => (
        <circle key={x} cx={x} cy="262" r="10" fill="#e2e8f0" opacity="0">
          <animate attributeName="r" values="10;10;46;60" keyTimes="0;0.45;0.7;1" {...loop} />
          <animate attributeName="opacity" values="0;0;0.9;0" keyTimes="0;0.44;0.6;1" {...loop} />
          <animate attributeName="cx" values={`${x};${x};${x + (i - 1) * 60}`} keyTimes="0;0.45;1" {...loop} />
        </circle>
      ))}
      {/* a contagem regressiva */}
      {["3", "2", "1"].map((n, i) => (
        <text key={n} x="100" y="120" textAnchor="middle" fontSize="60" fontWeight="900" fill="#fde047" fontFamily="Georgia, serif" opacity="0">
          <animate attributeName="opacity" values="0;0;1;0;0" keyTimes={`0;${i * 0.14};${i * 0.14 + 0.02};${i * 0.14 + 0.13};1`} {...loop} />
          {n}
        </text>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O Sputnik dando a volta na Terra
// ---------------------------------------------------------------------------

function SputnikArt() {
  const orbit = "M440 110 A160 70 0 1 1 120 110 A160 70 0 1 1 440 110";
  return (
    <Art viewBox="0 0 560 220" label="O Sputnik, o primeiro satélite artificial, dando a volta na Terra em 1957 e mandando o seu bip-bip de rádio">
      <rect width="560" height="220" rx="14" fill="#020617" />
      <Stars w={560} h={220} n={40} seed={73} />
      <ellipse cx="280" cy="110" rx="160" ry="70" fill="none" stroke="#475569" strokeDasharray="5 5" />
      <Earth x={280} y={110} r={56} />
      <g>
        <animateMotion path={orbit} dur="8s" repeatCount="indefinite" />
        <circle r="8" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
        {[0, 1, 2, 3].map((k) => (
          <line key={k} x1="0" y1="0" x2={-22 + k * 4} y2={18 + (k % 2) * 4} stroke="#cbd5e1" strokeWidth="1.5" />
        ))}
        {[0, 1].map((k) => (
          <circle key={k} r="12" fill="none" stroke="#93c5fd" strokeWidth="1.5">
            <animate attributeName="r" values="10;28" dur="1s" begin={`${-k * 0.5}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0" dur="1s" begin={`${-k * 0.5}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </g>
      <text x="460" y="30" fontSize="13" fontWeight="900" fill="#bfdbfe" fontFamily="Georgia, serif">
        bip-bip!
      </text>
      <text x="20" y="206" fontSize="12" fontWeight="900" fill="#e2e8f0" fontFamily="Georgia, serif">
        Sputnik 1 (1957)
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A Apollo 11 pousando na Lua
// ---------------------------------------------------------------------------

function LandingArt() {
  const loop = { dur: "8s", repeatCount: "indefinite" };
  return (
    <Art viewBox="0 0 560 230" label="O módulo lunar da Apollo 11 descendo devagar e pousando na Lua, com a Terra no céu; depois a bandeira aparece">
      <rect width="560" height="230" rx="14" fill="#020617" />
      <Stars w={560} h={170} n={40} seed={79} />
      <Earth x={460} y={60} r={28} />
      <path d="M0 180 C100 170 220 186 330 176 C420 168 500 180 560 174 L560 230 L0 230 Z" fill="#a8a29e" />
      {[60, 140, 380].map((x) => (
        <ellipse key={x} cx={x} cy="198" rx="18" ry="5" fill="#78716c" />
      ))}
      {/* o módulo lunar descendo */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 -140;0 0;0 0" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.2 0.6 0.4 1;0 0 1 1" {...loop} />
        <g transform="translate(240 150)">
          <path d="M-22 -10 L22 -10 L28 6 L-28 6 Z" fill="#fbbf24" stroke="#92400e" strokeWidth="1.5" />
          <path d="M-16 -30 L16 -30 L20 -10 L-20 -10 Z" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
          <rect x="-6" y="-24" width="12" height="8" fill="#1e293b" />
          <path d="M-24 6 L-34 28 M24 6 L34 28 M-38 28 L-30 28 M30 28 L38 28" stroke="#cbd5e1" strokeWidth="2.5" />
          <g opacity="1">
            <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.48;0.5;1" {...loop} />
            <path d="M-6 8 C-4 22 4 22 6 8 Z" fill="#fde047" className="cg-anim-astro-flame" />
          </g>
        </g>
      </g>
      {/* a bandeira e o astronauta depois do pouso */}
      <g opacity="0">
        <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.6;0.65;1" {...loop} />
        <path d="M320 180 L320 130" stroke="#e2e8f0" strokeWidth="2" />
        <rect x="320" y="130" width="34" height="20" fill="#dc2626" />
        <rect x="320" y="130" width="14" height="10" fill="#1d4ed8" />
        <g transform="translate(296 182)">
          <circle cy="-40" r="9" fill="#f8fafc" stroke="#94a3b8" />
          <rect x="-9" y="-31" width="18" height="22" rx="4" fill="#f8fafc" stroke="#94a3b8" />
          <path d="M-5 -9 L-6 0 M5 -9 L6 0" stroke="#f8fafc" strokeWidth="5" />
        </g>
      </g>
      <text x="20" y="30" fontSize="13" fontWeight="900" fill="#fde68a" fontFamily="Georgia, serif">
        Apollo 11, 20 de julho de 1969
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A Estação Espacial em órbita
// ---------------------------------------------------------------------------

function StationArt() {
  return (
    <Art viewBox="0 0 560 220" label="A Estação Espacial Internacional em órbita da Terra, com os grandes painéis solares">
      <rect width="560" height="220" rx="14" fill="#020617" />
      <Stars w={560} h={220} n={40} seed={83} />
      <path d="M0 220 C150 150 410 150 560 220 Z" fill="#1d4ed8" />
      <path d="M0 220 C150 150 410 150 560 220" stroke="#93c5fd" strokeWidth="6" fill="none" opacity="0.6" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="-80 6;80 -6;-80 6" dur="10s" repeatCount="indefinite" />
        <g transform="translate(280 80)">
          <rect x="-60" y="-4" width="120" height="8" fill="#cbd5e1" />
          {[-56, -36, 36, 56].map((x) => (
            <rect key={x} x={x - 8} y="-40" width="16" height="80" fill="#1e40af" stroke="#93c5fd" strokeWidth="1" />
          ))}
          <rect x="-16" y="-10" width="32" height="20" rx="4" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
          <rect x="-4" y="10" width="8" height="18" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
        </g>
      </g>
      <text x="280" y="190" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#e0f2fe" fontFamily="Georgia, serif">
        a Estação Espacial dá uma volta na Terra a cada 90 minutos
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O robô em Marte e o helicóptero
// ---------------------------------------------------------------------------

function MarsRoverArt() {
  return (
    <Art viewBox="0 0 560 220" label="Um robô com rodas andando em Marte, com um pequeno helicóptero voando por cima">
      <rect width="560" height="220" rx="14" fill="#fdba74" />
      <path d="M0 150 C120 130 260 150 380 136 C460 128 520 140 560 134 L560 220 L0 220 Z" fill="#c2410c" />
      <path d="M380 136 L430 90 L480 132 Z" fill="#9a3412" />
      {/* o robô */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;160 -6;0 0" dur="12s" repeatCount="indefinite" />
        <g transform="translate(120 150)">
          <rect x="-40" y="-30" width="80" height="18" rx="4" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
          <rect x="16" y="-60" width="6" height="30" fill="#94a3b8" />
          <rect x="10" y="-70" width="20" height="12" rx="3" fill="#475569" />
          {[-30, 0, 30].map((x) => (
            <g key={x} transform={`translate(${x} 0)`}>
              <circle r="9" fill="#1e293b" />
              <g>
                <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="2s" repeatCount="indefinite" />
                <line x1="-6" y1="0" x2="6" y2="0" stroke="#94a3b8" strokeWidth="2" />
              </g>
            </g>
          ))}
        </g>
      </g>
      {/* o helicóptero */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -20;0 0" dur="3s" repeatCount="indefinite" />
        <g transform="translate(320 60)">
          <rect x="-8" y="-6" width="16" height="12" rx="3" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
          <path d="M-6 6 L-10 18 M6 6 L10 18" stroke="#475569" strokeWidth="1.5" />
          <line x1="0" y1="-6" x2="0" y2="-14" stroke="#475569" strokeWidth="2" />
          <g>
            <animateTransform attributeName="transform" type="scale" values="1 1;-1 1;1 1" dur="0.2s" repeatCount="indefinite" />
            <line x1="-30" y1="-14" x2="30" y2="-14" stroke="#1e293b" strokeWidth="3" />
          </g>
        </g>
      </g>
      <g fontFamily="Georgia, serif" fontSize="12" fontWeight="900">
        <text x="20" y="30" fill="#7c2d12">robô Perseverance (2021)</text>
        <text x="350" y="30" fill="#7c2d12">helicóptero Ingenuity</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 9, content, bare });

export const chapter9: BookPage[] = [
  page(
    <ChapterOpener
      n={9}
      title="A Corrida Espacial"
      goals={["Quem foram os primeiros a ir ao espaço", "Como foi a chegada do ser humano à Lua", "O que são as agências espaciais e a Estação Espacial", "Os robôs em Marte e a volta à Lua"]}
    >
      <Fig h={34}>
        <LaunchOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🛰️">Os primeiros no espaço</H>
      <P>
        Depois da Segunda Guerra, os Estados Unidos e a União Soviética começaram uma disputa para ver quem chegava primeiro ao espaço: a <T>corrida espacial</T>. Em 1957, os
        soviéticos lançaram o <T>Sputnik 1</T>, o primeiro satélite artificial.
      </P>
      <Fig n="9.1" caption="O Sputnik dava uma volta na Terra a cada 96 minutos, mandando sinais de rádio." h={22}>
        <SputnikArt />
      </Fig>
      <Table
        head={["Ano", "Marco"]}
        rows={[
          ["1957", "A cadela Laika, no Sputnik 2, é o primeiro animal a orbitar a Terra"],
          ["1961", "Yuri Gagarin é o primeiro ser humano no espaço: “A Terra é azul!”"],
          ["1963", "Valentina Tereshkova é a primeira mulher no espaço"],
          ["1969", "A Apollo 11 leva os primeiros humanos à Lua"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🌕">A chegada à Lua: Apollo 11</H>
      <P>
        Em <T>20 de julho de 1969</T>, a missão <T>Apollo 11</T>, da NASA, pousou na Lua. <T>Neil Armstrong</T> foi o primeiro a pisar lá e disse: &ldquo;Um pequeno passo para
        um homem, um salto gigante para a humanidade&rdquo;. <T>Buzz Aldrin</T> desceu logo depois, e <T>Michael Collins</T> ficou em órbita na nave.
      </P>
      <Fig n="9.2" caption="O módulo lunar Eagle pousando, com a Terra no céu." h={24}>
        <LandingArt />
      </Fig>
      <P>
        Entre 1969 e 1972, doze astronautas caminharam na Lua. As pegadas deles continuam lá até hoje, porque na Lua não há vento nem chuva.
      </P>
    </>,
  ),

  page(
    <>
      <H icon="🏗️">As agências e a Estação Espacial</H>
      <P>
        A <T>NASA</T>, agência espacial dos Estados Unidos, foi criada em 1958. A <T>ESA</T> é a agência europeia, e a <T>AEB</T> é a Agência Espacial Brasileira. Os{" "}
        <T>ônibus espaciais</T> voaram de 1981 a 2011 e ajudaram a montar a <T>Estação Espacial Internacional</T>.
      </P>
      <Fig n="9.3" caption="A Estação Espacial Internacional, um laboratório em órbita." h={22}>
        <StationArt />
      </Fig>
      <Cards
        items={[
          { icon: "🎖️", title: "Marcos Pontes", text: "O primeiro astronauta brasileiro: foi à Estação Espacial em 2006." },
          { icon: "🚀", title: "Alcântara", text: "Base de lançamento no Maranhão. Perto do Equador, gasta menos combustível para lançar foguetes." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🔴">Marte e a volta à Lua</H>
      <P>
        Os <T>robôs com rodas</T>, como o <T>Curiosity</T> e o <T>Perseverance</T>, exploram a superfície de Marte, analisando rochas e procurando sinais de vida antiga. O
        Perseverance chegou em 2021 levando até um pequeno helicóptero, o <T>Ingenuity</T>, o primeiro a voar em outro planeta.
      </P>
      <Fig n="9.4" caption="O robô em Marte e o helicóptero Ingenuity." h={22}>
        <MarsRoverArt />
      </Fig>
      <Box kind="sabia">
        O programa <strong>Ártemis</strong>, da NASA, quer levar seres humanos de volta à Lua. Na mitologia grega, Ártemis é a irmã gêmea de Apolo, que deu nome às missões dos
        anos 1960!
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Sputnik 1 (1957): o primeiro satélite. Laika (1957): o primeiro animal em órbita.",
          "Gagarin (1961): o primeiro humano no espaço. Tereshkova (1963): a primeira mulher.",
          "Apollo 11 (1969): Armstrong e Aldrin pisam na Lua; Collins fica em órbita.",
          "NASA (1958), ESA e AEB; Marcos Pontes, o primeiro brasileiro no espaço (2006).",
          "Robôs como o Perseverance exploram Marte; o programa Ártemis quer voltar à Lua.",
        ]}
      />
      <Glossary
        items={[
          ["Satélite artificial", "Objeto feito pelo ser humano que gira em volta da Terra."],
          ["Corrida espacial", "A disputa entre EUA e União Soviética para explorar o espaço."],
          ["Módulo lunar", "A nave que desceu até a superfície da Lua."],
          ["Estação Espacial", "Laboratório em órbita onde vivem astronautas."],
          ["Rover", "Robô com rodas que explora outro astro."],
        ]}
      />
      <Quiz
        items={[
          ["Quem foi o primeiro ser humano a ir ao espaço?", "Yuri Gagarin, em 1961."],
          ["Qual missão levou os primeiros humanos à Lua?", "A Apollo 11, em 1969."],
          ["Quem foi o primeiro astronauta brasileiro?", "Marcos Pontes, em 2006."],
          ["Por que a base de Alcântara é boa para lançar foguetes?", "Por estar perto do Equador, o que economiza combustível."],
        ]}
      />
    </>,
  ),
];
