"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Earth, Stars, Sun } from "./art";

// ============================================================================
// CAPÍTULO 5 — GRAVIDADE E ÓRBITAS (missão "Astronomia: Gravidade e
// Órbitas"): a Terra girando em volta do Sol com a Lua em volta dela, o
// geocentrismo × o heliocentrismo, a órbita em elipse (o planeta corre mais
// perto do Sol), as estações de tocar (o eixo inclinado da Terra) e o canhão
// de Newton (cair, cair mais longe, entrar em órbita, escapar).
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a Terra em volta do Sol e a Lua em volta da Terra
// ---------------------------------------------------------------------------

function OrbitOpenerArt() {
  const earthOrbit = "M390 150 A160 90 0 1 1 70 150 A160 90 0 1 1 390 150";
  return (
    <Art viewBox="0 0 460 300" label="A Terra girando em volta do Sol, e a Lua girando em volta da Terra">
      <rect width="460" height="300" fill="#020617" />
      <Stars w={460} h={300} n={50} seed={6} />
      <ellipse cx="230" cy="150" rx="160" ry="90" fill="none" stroke="#334155" strokeDasharray="5 5" />
      <Sun x={230} y={150} r={32} />
      <g>
        <animateMotion path={earthOrbit} dur="16s" repeatCount="indefinite" />
        <Earth r={16} />
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3s" repeatCount="indefinite" />
          <circle cx="32" r="5" fill="#d4d4d8" />
        </g>
        <circle r="32" fill="none" stroke="#475569" strokeDasharray="2 3" />
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Geocentrismo × heliocentrismo
// ---------------------------------------------------------------------------

function GeoHelioArt() {
  const ring = (cx: number, r: number, dur: number, color: string, size: number, k: number) => (
    <g key={`${cx}-${r}`}>
      <circle cx={cx} cy="110" r={r} fill="none" stroke="#475569" strokeDasharray="3 4" />
      <g transform={`translate(${cx} 110)`}>
        <g>
          <animateTransform attributeName="transform" type="rotate" from={`${k * 60}`} to={`${k * 60 + 360}`} dur={`${dur}s`} repeatCount="indefinite" />
          <circle cx={r} r={size} fill={color} />
        </g>
      </g>
    </g>
  );
  return (
    <Art viewBox="0 0 560 230" label="No modelo geocêntrico, a Terra fica no centro; no modelo heliocêntrico, de Copérnico, o Sol fica no centro">
      <rect width="560" height="230" rx="14" fill="#020617" />
      {/* geocêntrico */}
      {ring(140, 40, 5, "#d4d4d8", 5, 0)}
      {ring(140, 66, 8, "#fbbf24", 9, 1)}
      {ring(140, 92, 12, "#fb923c", 6, 2)}
      <Earth x={140} y={110} r={18} />
      <text x="140" y="222" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fca5a5" fontFamily="Georgia, serif">
        Geocêntrico: a Terra no centro ✗
      </text>
      {/* heliocêntrico */}
      {ring(420, 40, 4, "#d6d3d1", 4, 0)}
      {ring(420, 64, 7, "#3b82f6", 7, 1)}
      {ring(420, 90, 11, "#fb923c", 6, 2)}
      <Sun x={420} y={110} r={18} />
      <text x="420" y="222" textAnchor="middle" fontSize="13" fontWeight="900" fill="#86efac" fontFamily="Georgia, serif">
        Heliocêntrico: o Sol no centro ✓
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A órbita em elipse: o planeta corre mais perto do Sol
// ---------------------------------------------------------------------------

function KeplerArt() {
  const orbit = "M480 110 A200 80 0 1 1 80 110 A200 80 0 1 1 480 110";
  return (
    <Art viewBox="0 0 560 220" label="A órbita em forma de elipse com o Sol num dos focos: o planeta anda mais rápido perto do Sol e mais devagar longe dele">
      <rect width="560" height="220" rx="14" fill="#020617" />
      <ellipse cx="280" cy="110" rx="200" ry="80" fill="none" stroke="#64748b" strokeDasharray="5 5" />
      {/* as áreas iguais varridas em tempos iguais */}
      <path d="M402 110 L480 110 A200 80 0 0 0 456 72 Z" fill="#fde047" opacity="0.35" />
      <path d="M402 110 L80 110 A200 80 0 0 1 100 70 Z" fill="#fde047" opacity="0.35" />
      <Sun x={402} y={110} r={20} />
      <circle cx="158" cy="110" r="3" fill="#94a3b8" />
      <g>
        <animateMotion path={orbit} dur="8s" repeatCount="indefinite" keyPoints="0;0.42;0.5;0.58;1" keyTimes="0;0.25;0.5;0.75;1" calcMode="linear" />
        <circle r="9" fill="#3b82f6" stroke="#bfdbfe" strokeWidth="2" />
      </g>
      <g fontFamily="Georgia, serif" fontSize="12" fontWeight="900">
        <text x="402" y="148" textAnchor="middle" fill="#fde68a">Sol (num foco)</text>
        <text x="500" y="40" textAnchor="end" fill="#86efac">perto: mais rápido</text>
        <text x="60" y="40" fill="#93c5fd">longe: mais devagar</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As estações do ano de tocar
// ---------------------------------------------------------------------------

const SEASONS = [
  { month: "Dezembro", x: 120, south: "Verão", north: "Inverno", note: "Solstício de verão no Sul (por volta de 21 de dezembro): o dia mais longo do ano para nós.", tiltToSun: "sul" },
  { month: "Março", x: 280, south: "Outono", north: "Primavera", note: "Equinócio (por volta de 20 de março): o dia e a noite têm a mesma duração.", tiltToSun: "nenhum" },
  { month: "Junho", x: 440, south: "Inverno", north: "Verão", note: "Solstício de inverno no Sul (por volta de 21 de junho): a noite mais longa do ano para nós.", tiltToSun: "norte" },
  { month: "Setembro", x: 280, south: "Primavera", north: "Outono", note: "Equinócio (por volta de 22 de setembro): de novo, dia e noite iguais.", tiltToSun: "nenhum" },
] as const;

export function SeasonsSim() {
  const [sel, setSel] = useState(0);
  const s = SEASONS[sel];
  // no desenho, o Sol fica no meio e a Terra de um lado ou do outro; o eixo sempre aponta pro mesmo lado
  const earthX = sel === 0 ? 100 : sel === 2 ? 460 : 280;
  const earthY = sel === 1 ? 50 : sel === 3 ? 170 : 110;
  const sunAngle = (Math.atan2(110 - earthY, 280 - earthX) * 180) / Math.PI;
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <svg viewBox="0 0 560 220" className="block w-full" aria-label={`${s.month}: ${s.south} no Sul`}>
        <rect width="560" height="220" rx="10" fill="#020617" />
        <ellipse cx="280" cy="110" rx="180" ry="60" fill="none" stroke="#334155" strokeDasharray="5 5" />
        <Sun x={280} y={110} r={26} />
        <g style={{ transform: `translate(${earthX}px, ${earthY}px)`, transition: "transform 1s cubic-bezier(0.4, 0, 0.2, 1)" }}>
          <circle r="30" fill="#1e3a8a" />
          {/* o lado iluminado, sempre virado pro Sol */}
          <path d="M0 -30 A30 30 0 0 1 0 30 Z" fill="#60a5fa" transform={`rotate(${sunAngle})`} />
          {/* o eixo, sempre inclinado pro mesmo lado */}
          <g transform="rotate(-23.5)">
            <line x1="0" y1="-44" x2="0" y2="44" stroke="#f8fafc" strokeWidth="2" />
            <text y="-48" textAnchor="middle" fontSize="10" fontWeight="900" fill="#f8fafc">
              N
            </text>
            <line x1="-30" y1="0" x2="30" y2="0" stroke="#fde047" strokeWidth="1" strokeDasharray="3 3" />
          </g>
        </g>
      </svg>
      <div className="mt-[0.3em] flex flex-wrap justify-center gap-[0.3em] text-[0.85em]">
        {SEASONS.map((x, i) => (
          <button key={x.month} type="button" onClick={() => setSel(i)} className={`rounded-full border px-[0.7em] py-[0.1em] font-bold ${sel === i ? "border-[#1d4ed8] bg-[#1d4ed8] text-white" : "border-[#d9c79d] bg-white hover:bg-[#eff6ff]"}`}>
            {x.month}
          </button>
        ))}
      </div>
      <p key={sel} className="cg-anim-fade mt-[0.4em] rounded-lg bg-[#eff6ff] px-[0.7em] py-[0.35em] text-[0.88em] leading-[1.45] text-[#1e3a8a]">
        <strong>{s.month}:</strong> {s.south} no Hemisfério Sul (Brasil) e {s.north.toLowerCase()} no Hemisfério Norte. {s.note}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// O canhão de Newton: cair, cair mais longe, entrar em órbita
// ---------------------------------------------------------------------------

function NewtonCannonArt() {
  const shots = [
    { path: "M280 26 Q330 30 350 74", dur: 1.6, color: "#fca5a5" },
    { path: "M280 26 Q400 40 400 140", dur: 2.4, color: "#fdba74" },
    { path: "M280 26 A100 100 0 1 1 279 26", dur: 4, color: "#86efac" },
    { path: "M280 26 C420 20 520 10 600 -20", dur: 2.2, color: "#93c5fd" },
  ];
  return (
    <Art viewBox="0 0 560 240" label="O canhão de Newton no alto de uma montanha: com pouca velocidade a bala cai perto, com mais cai longe, com a velocidade certa fica em órbita e com mais ainda escapa da Terra">
      <rect width="560" height="240" rx="14" fill="#020617" />
      <Stars w={560} h={240} n={30} seed={29} />
      <Earth x={280} y={126} r={88} />
      <path d="M266 40 L280 22 L294 40 Z" fill="#78716c" />
      <rect x="276" y="16" width="16" height="8" rx="3" fill="#1e293b" />
      {shots.map((s, i) => (
        <g key={i}>
          <path d={s.path} stroke={s.color} strokeWidth="2" strokeDasharray="5 5" fill="none" opacity="0.7" />
          <circle r="5" fill={s.color}>
            <animateMotion path={s.path} dur={`${s.dur}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      <g fontFamily="Georgia, serif" fontSize="11.5" fontWeight="900">
        <text x="350" y="94" fill="#fca5a5">devagar: cai perto</text>
        <text x="410" y="156" fill="#fdba74">mais rápido: cai longe</text>
        <text x="20" y="40" fill="#86efac">na velocidade certa: órbita!</text>
        <text x="400" y="30" fill="#93c5fd">11,2 km/s: escapa</text>
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
      title="Gravidade e Órbitas"
      goals={["Como a humanidade descobriu que a Terra gira em volta do Sol", "As órbitas em elipse de Kepler", "Por que existem as estações do ano", "O que é a gravidade e a velocidade de escape"]}
    >
      <Fig h={34}>
        <OrbitOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🌍">Do geocentrismo ao heliocentrismo</H>
      <P>
        Durante muitos séculos, acreditou-se no <T>geocentrismo</T>: a Terra parada no centro do universo, com tudo girando em volta dela. No século XVI, o polonês{" "}
        <T>Nicolau Copérnico</T> propôs o <T>heliocentrismo</T>: o Sol no centro e a Terra girando em volta dele, como os outros planetas.
      </P>
      <Fig n="5.1" caption="Os dois modelos do universo." h={24}>
        <GeoHelioArt />
      </Fig>
      <P>
        Em <T>1610</T>, <T>Galileu</T> viu com a luneta quatro luas girando em volta de Júpiter: uma prova de que nem tudo gira em volta da Terra. Foi uma revolução na ciência.
      </P>
    </>,
  ),

  page(
    <>
      <H icon="🥚">As órbitas de Kepler</H>
      <P>
        No começo do século XVII, o alemão <T>Johannes Kepler</T> descobriu que as órbitas dos planetas não são círculos perfeitos: são <T>elipses</T> (círculos
        &ldquo;achatados&rdquo;), com o Sol num dos focos. E o planeta anda <T>mais rápido</T> quando está perto do Sol.
      </P>
      <Fig n="5.2" caption="Em tempos iguais, o planeta varre áreas iguais: perto do Sol ele precisa correr mais." h={24}>
        <KeplerArt />
      </Fig>
      <P>
        Quanto mais longe do Sol, mais longa é a volta: Mercúrio completa a órbita em cerca de 88 dias, e Netuno leva 165 anos!
      </P>
    </>,
  ),

  page(
    <>
      <H icon="🍂">As estações do ano</H>
      <P>
        As estações não acontecem porque a Terra chega mais perto ou mais longe do Sol. Elas existem porque o <T>eixo da Terra é inclinado</T> (cerca de 23,5°). Ao longo do ano,
        ora o Hemisfério Sul, ora o Norte fica mais virado para o Sol e recebe a luz mais direta. Escolha o mês:
      </P>
      <SeasonsSim />
      <Box kind="lembre">As estações são opostas nos dois hemisférios: no Natal é verão no Brasil e inverno na Europa! Equinócio quer dizer &ldquo;noite igual&rdquo;.</Box>
    </>,
  ),

  page(
    <>
      <H icon="🍎">A gravidade e a velocidade de escape</H>
      <P>
        A <T>gravidade</T> é a força com que os corpos com massa se atraem. É ela que segura a Lua em volta da Terra e a Terra em volta do Sol. Isaac Newton imaginou um canhão no
        alto de uma montanha:
      </P>
      <Fig n="5.3" caption="O canhão de Newton: uma órbita é uma queda que nunca encontra o chão." h={26}>
        <NewtonCannonArt />
      </Fig>
      <List
        items={[
          <>
            Na Lua, a gravidade é cerca de <T>1/6</T> da da Terra: o <T>peso</T> do astronauta fica 6 vezes menor, mas a <T>massa</T> continua a mesma.
          </>,
          <>
            A <T>velocidade de escape</T> da Terra é de cerca de <T>11,2 km/s</T>: abaixo disso, o objeto volta ou fica em órbita.
          </>,
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Geocentrismo (Terra no centro) foi substituído pelo heliocentrismo de Copérnico (Sol no centro).",
          "Galileu viu as luas de Júpiter em 1610; Kepler mostrou que as órbitas são elipses.",
          "Perto do Sol o planeta anda mais rápido. Mercúrio dá a volta em 88 dias; Netuno, em 165 anos.",
          "As estações existem por causa do eixo inclinado da Terra e são opostas nos dois hemisférios.",
          "Na Lua, o peso é 1/6 do da Terra; a massa não muda. Velocidade de escape da Terra: 11,2 km/s.",
        ]}
      />
      <Glossary
        items={[
          ["Heliocentrismo", "O modelo com o Sol no centro."],
          ["Elipse", "Um círculo “achatado”, a forma das órbitas."],
          ["Solstício", "O dia mais longo ou a noite mais longa do ano."],
          ["Equinócio", "Quando o dia e a noite têm a mesma duração."],
          ["Velocidade de escape", "A velocidade para escapar da gravidade de um astro."],
        ]}
      />
      <Quiz
        items={[
          ["Quem mostrou que as órbitas dos planetas são elipses?", "Johannes Kepler."],
          ["Quando é verão no Hemisfério Sul, que estação é no Norte?", "Inverno."],
          ["O que acontece nos equinócios?", "O dia e a noite têm a mesma duração."],
          ["Na Lua, o peso de um astronauta fica como?", "Cerca de 6 vezes menor, mas a massa continua igual."],
        ]}
      />
    </>,
  ),
];
