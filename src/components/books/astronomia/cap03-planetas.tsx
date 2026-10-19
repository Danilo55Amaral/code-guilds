"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Earth, Planet, Stars, Sun } from "./art";

// ============================================================================
// CAPÍTULO 3 — OS PLANETAS DO SISTEMA SOLAR (missão "Astronomia: Os
// Planetas do Sistema Solar"): os oito planetas girando em volta do Sol, o
// explorador de tocar (cada planeta com os seus segredos), os rochosos × os
// gigantes por dentro, a Grande Mancha Vermelha, o Monte Olimpo, Urano
// deitado, o cinturão de asteroides, Plutão e o cometa.
// ============================================================================

interface PlanetInfo {
  name: string;
  kind: string;
  year: string;
  r: number;
  color: string;
  dark: string;
  bands?: string;
  rings?: string;
  fact: string;
}

const PLANETS: PlanetInfo[] = [
  { name: "Mercúrio", kind: "rochoso", year: "88 dias", r: 7, color: "#d6d3d1", dark: "#57534e", fact: "O mais perto do Sol e sem atmosfera: de dia passa de 400 °C e à noite cai para −180 °C." },
  { name: "Vênus", kind: "rochoso", year: "225 dias", r: 11, color: "#fde68a", dark: "#d97706", fact: "O mais quente (cerca de 460 °C), por causa do efeito estufa das nuvens grossas. Brilha muito: é a “Estrela d'Alva”." },
  { name: "Terra", kind: "rochoso", year: "365 dias", r: 12, color: "#60a5fa", dark: "#1e3a8a", fact: "O único planeta conhecido com vida e com água líquida na superfície. Tem 1 lua." },
  { name: "Marte", kind: "rochoso", year: "687 dias", r: 9, color: "#fb923c", dark: "#7c2d12", fact: "O planeta vermelho (o solo tem ferrugem). Tem o Monte Olimpo, o maior vulcão do Sistema Solar." },
  { name: "Júpiter", kind: "gasoso", year: "12 anos", r: 30, color: "#fde7c4", dark: "#b45309", bands: "#92400e", fact: "O maior planeta. A Grande Mancha Vermelha é uma tempestade maior que a Terra, observada há mais de 300 anos." },
  { name: "Saturno", kind: "gasoso", year: "29 anos", r: 25, color: "#fef3c7", dark: "#a16207", bands: "#ca8a04", rings: "#eab308", fact: "Famoso pelos anéis de gelo e rocha. Tem mais de 200 luas confirmadas: o recorde do Sistema Solar." },
  { name: "Urano", kind: "gigante de gelo", year: "84 anos", r: 18, color: "#a5f3fc", dark: "#0e7490", rings: "#67e8f9", fact: "Gira “deitado”, com o eixo inclinado quase 98°: deve ter levado uma pancada gigante há bilhões de anos." },
  { name: "Netuno", kind: "gigante de gelo", year: "165 anos", r: 17, color: "#93c5fd", dark: "#1e3a8a", fact: "O mais distante do Sol, com os ventos mais fortes do Sistema Solar." },
];

// ---------------------------------------------------------------------------
// Abertura: os planetas girando em volta do Sol
// ---------------------------------------------------------------------------

function OrbitsOpenerArt() {
  const orbits = [
    [40, 3, "#d6d3d1", 4],
    [58, 4, "#fde68a", 6],
    [76, 4.5, "#60a5fa", 8],
    [94, 3.5, "#fb923c", 11],
    [130, 9, "#fdba74", 20],
    [160, 8, "#fde68a", 30],
    [190, 6, "#a5f3fc", 44],
    [216, 6, "#60a5fa", 58],
  ] as const;
  return (
    <Art viewBox="0 0 460 300" label="Os oito planetas girando em volta do Sol, os de perto mais rápido e os de longe mais devagar">
      <rect width="460" height="300" fill="#020617" />
      <Stars w={460} h={300} n={50} seed={2} />
      {orbits.map(([rx, r, color, dur], i) => {
        const ry = rx * 0.5;
        const path = `M${230 + rx} 150 A${rx} ${ry} 0 1 1 ${230 - rx} 150 A${rx} ${ry} 0 1 1 ${230 + rx} 150`;
        return (
          <g key={i}>
            <ellipse cx="230" cy="150" rx={rx} ry={ry} fill="none" stroke="#334155" strokeWidth="1" />
            <g>
              <animateMotion path={path} dur={`${dur}s`} begin={`${-i * 3}s`} repeatCount="indefinite" />
              <circle r={r} fill={color} />
              {i === 5 && <ellipse rx={r * 2} ry={r * 0.6} fill="none" stroke="#eab308" strokeWidth="1.5" />}
            </g>
          </g>
        );
      })}
      <Sun x={230} y={150} r={22} />
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O explorador de planetas
// ---------------------------------------------------------------------------

export function PlanetExplorer() {
  const [sel, setSel] = useState(4);
  const p = PLANETS[sel];
  let x = 10;
  const positions = PLANETS.map((pl) => {
    const cx = x + pl.r;
    x += pl.r * 2 + (pl.rings ? 22 : 10);
    return cx;
  });
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <svg viewBox={`0 0 ${x + 10} 90`} className="block w-full" aria-label="Os oito planetas, do mais perto ao mais longe do Sol">
        <rect width={x + 10} height="90" rx="10" fill="#020617" />
        {PLANETS.map((pl, i) => (
          <g key={pl.name} onClick={() => setSel(i)} className="cursor-pointer" style={{ filter: sel === i ? "drop-shadow(0 0 6px #fde047)" : undefined }}>
            {pl.name === "Terra" ? (
              <Earth x={positions[i]} y={45} r={pl.r} />
            ) : (
              <Planet x={positions[i]} y={45} r={pl.r} color={pl.color} dark={pl.dark} bands={pl.bands} rings={pl.rings} tilt={pl.name === "Urano" ? -80 : -18} />
            )}
            <circle cx={positions[i]} cy="45" r={pl.r + 8} fill="transparent" />
          </g>
        ))}
      </svg>
      <div className="mt-[0.3em] flex flex-wrap justify-center gap-[0.25em]">
        {PLANETS.map((pl, i) => (
          <button key={pl.name} type="button" onClick={() => setSel(i)} className={`rounded-full border px-[0.55em] py-[0.1em] text-[0.78em] font-bold ${sel === i ? "border-[#1d4ed8] bg-[#1d4ed8] text-white" : "border-[#d9c79d] bg-white hover:bg-[#eff6ff]"}`}>
            {i + 1}. {pl.name}
          </button>
        ))}
      </div>
      <p key={sel} className="cg-anim-fade mt-[0.4em] rounded-lg bg-[#eff6ff] px-[0.7em] py-[0.35em] text-[0.88em] leading-[1.45] text-[#1e3a8a]">
        <strong>
          {p.name}
        </strong>{" "}
        ({p.kind}, uma volta no Sol em {p.year}): {p.fact}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rochosos × gigantes, por dentro
// ---------------------------------------------------------------------------

function InsidesArt() {
  return (
    <Art viewBox="0 0 560 220" label="Por dentro: o planeta rochoso tem núcleo de metal, manto e crosta; o gigante gasoso é quase todo gás, com um núcleo pequeno">
      <g transform="translate(140 110)">
        <circle r="80" fill="#a16207" />
        <path d="M0 -80 A80 80 0 0 1 80 0 L0 0 Z" fill="#fde68a" />
        <circle r="60" fill="#ea580c" />
        <path d="M0 -60 A60 60 0 0 1 60 0 L0 0 Z" fill="#fb923c" />
        <circle r="30" fill="#facc15" />
        <path d="M0 -30 A30 30 0 0 1 30 0 L0 0 Z" fill="#fef08a" />
        <circle r="80" fill="none" stroke="#57300c" strokeWidth="3" />
        <g fontFamily="Georgia, serif" fontSize="11" fontWeight="900" fill="#1c1917">
          <text x="90" y="-56">crosta</text>
          <text x="90" y="-30">manto</text>
          <text x="90" y="-4">núcleo de metal</text>
        </g>
        <text y="104" textAnchor="middle" fontSize="13" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
          Rochoso (como a Terra)
        </text>
      </g>
      <g transform="translate(430 110)">
        <circle r="90" fill="#fde7c4" />
        <path d="M0 -90 A90 90 0 0 1 90 0 L0 0 Z" fill="#fef3c7" />
        {[-60, -30, 0, 30, 60].map((y) => (
          <path key={y} d={`M-88 ${y} Q0 ${y + 8} 88 ${y}`} stroke="#d97706" strokeWidth="5" fill="none" opacity="0.5" />
        ))}
        <circle r="22" fill="#78716c" />
        <text y="114" textAnchor="middle" fontSize="13" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
          Gasoso (como Júpiter)
        </text>
        <text y="-100" textAnchor="middle" fontSize="11" fontWeight="900" fill="#92400e" fontFamily="Georgia, serif">
          hidrogênio e hélio
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os famosos: a Grande Mancha, o Monte Olimpo e Urano deitado
// ---------------------------------------------------------------------------

function FamousArt() {
  return (
    <Art viewBox="0 0 600 220" label="A Grande Mancha Vermelha de Júpiter girando, o Monte Olimpo de Marte comparado ao Everest e Urano girando deitado">
      <rect width="600" height="220" rx="14" fill="#020617" />
      {/* a Grande Mancha Vermelha */}
      <g transform="translate(100 100)">
        <Planet r={70} color="#fde7c4" dark="#b45309" bands="#92400e" />
        <g transform="translate(18 26)">
          <g className="cg-anim-orbit-rev" style={{ "--cg-dur": "6s" } as React.CSSProperties}>
            <ellipse rx="22" ry="12" fill="#dc2626" />
            <ellipse rx="12" ry="6" fill="#f87171" />
          </g>
        </g>
        <text y="100" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fde68a" fontFamily="Georgia, serif">
          Grande Mancha Vermelha
        </text>
      </g>
      {/* o Monte Olimpo × o Everest */}
      <g transform="translate(300 180)">
        <path d="M-90 0 C-50 -10 -30 -100 0 -110 C30 -100 50 -10 90 0 Z" fill="#c2410c" />
        <path d="M-12 -108 L12 -108 L8 -100 L-8 -100 Z" fill="#7c2d12" />
        <path d="M40 0 L58 -40 L76 0 Z" fill="#94a3b8" />
        <path d="M52 -28 L58 -40 L64 -28 Z" fill="#f8fafc" />
        <text y="22" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fdba74" fontFamily="Georgia, serif">
          Monte Olimpo (22 km) × Everest (9 km)
        </text>
      </g>
      {/* Urano deitado */}
      <g transform="translate(505 100)">
        <g className="cg-anim-orbit-rev" style={{ "--cg-dur": "8s" } as React.CSSProperties}>
          <Planet r={36} color="#a5f3fc" dark="#0e7490" rings="#67e8f9" tilt={-82} />
        </g>
        <path d="M-56 0 L56 0" stroke="#fde047" strokeWidth="2" strokeDasharray="5 4" />
        <text y="100" textAnchor="middle" fontSize="12" fontWeight="900" fill="#a5f3fc" fontFamily="Georgia, serif">
          Urano gira deitado
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O cinturão de asteroides, Plutão e o cometa
// ---------------------------------------------------------------------------

function SmallBodiesArt() {
  return (
    <Art viewBox="0 0 560 230" label="O cinturão de asteroides entre Marte e Júpiter, Plutão na órbita lá longe e um cometa com a cauda apontando para longe do Sol">
      <rect width="560" height="230" rx="14" fill="#020617" />
      <Stars w={560} h={230} n={30} seed={8} />
      <Sun x={70} y={115} r={22} />
      {/* o cinturão de asteroides girando */}
      <g transform="translate(70 115)">
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="60s" repeatCount="indefinite" />
          {Array.from({ length: 50 }, (_, i) => {
            const a = (i / 50) * Math.PI * 2;
            const rr = 120 + ((i * 7) % 14);
            return <circle key={i} cx={Math.cos(a) * rr} cy={Math.sin(a) * rr * 0.7} r={1.4 + (i % 3) * 0.6} fill="#a8a29e" />;
          })}
        </g>
      </g>
      {/* a órbita inclinada de Plutão */}
      <ellipse cx="120" cy="115" rx="400" ry="90" fill="none" stroke="#64748b" strokeDasharray="4 5" transform="rotate(-8 120 115)" />
      <g>
        <animateMotion path="M520 60 A400 90 0 0 1 300 196" dur="20s" repeatCount="indefinite" />
        <circle r="5" fill="#d6d3d1" />
      </g>
      {/* o cometa */}
      <g transform="translate(400 50)">
        <path d="M0 0 L120 -30 L120 30 Z" fill="#e0f2fe" opacity="0.35" />
        <path d="M0 0 L120 -6 L120 6 Z" fill="#e0f2fe" opacity="0.6" />
        <circle r="7" fill="#f8fafc" className="cg-anim-glow" />
      </g>
      <g fontFamily="Georgia, serif" fontSize="12" fontWeight="900">
        <text x="190" y="30" fill="#d6d3d1">cinturão de asteroides</text>
        <text x="440" y="110" fill="#e0f2fe">cometa</text>
        <text x="300" y="220" fill="#94a3b8">Plutão (planeta-anão)</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 3, content, bare });

export const chapter3: BookPage[] = [
  page(
    <ChapterOpener
      n={3}
      title="Os Planetas do Sistema Solar"
      goals={["A ordem dos oito planetas e um macete para decorar", "A diferença entre planetas rochosos e gasosos", "Os recordes e as curiosidades de cada planeta", "O que são planetas-anões, asteroides e cometas"]}
    >
      <Fig h={34}>
        <OrbitsOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="☀️">Os oito planetas</H>
      <P>
        O <T>Sistema Solar</T> é o Sol e tudo o que gira em volta dele. Os oito planetas, do mais perto ao mais longe, são: Mercúrio, Vênus, Terra, Marte, Júpiter, Saturno,
        Urano e Netuno. Toque em cada um:
      </P>
      <PlanetExplorer />
      <Box kind="mago" title="Macete do Mago">
        &ldquo;<strong>M</strong>inha <strong>V</strong>ó <strong>T</strong>em <strong>M</strong>uitas <strong>J</strong>oias, <strong>S</strong>ó <strong>U</strong>sa <strong>N</strong>o{" "}
        <strong>N</strong>atal&rdquo;: Mercúrio, Vênus, Terra, Marte, Júpiter, Saturno, Urano, Netuno.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="⛰️">Rochosos e gasosos</H>
      <P>
        Os quatro planetas mais perto do Sol (Mercúrio, Vênus, Terra e Marte) são <T>rochosos</T> (ou telúricos): têm superfície sólida. Os quatro de fora são{" "}
        <T>gigantes</T>: Júpiter e Saturno são feitos principalmente de hidrogênio e hélio (gasosos), e Urano e Netuno têm muito gelo (gigantes de gelo). Eles não têm um chão
        firme como o da Terra.
      </P>
      <Fig n="3.1" caption="Por dentro de um planeta rochoso e de um gigante gasoso." h={24}>
        <InsidesArt />
      </Fig>
      <Table
        head={["Planeta", "Uma volta no Sol"]}
        rows={[
          ["Mercúrio", "88 dias (o mais rápido)"],
          ["Terra", "365 dias"],
          ["Júpiter", "12 anos"],
          ["Netuno", "165 anos (o mais lento)"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🏆">Os recordes dos planetas</H>
      <Fig n="3.2" caption="Três planetas com recordes: Júpiter, Marte e Urano." h={24}>
        <FamousArt />
      </Fig>
      <List
        items={[
          <>
            A <T>Grande Mancha Vermelha</T> de Júpiter é um furacão enorme, com ventos de centenas de km/h, observado há mais de 300 anos.
          </>,
          <>
            O <T>Monte Olimpo</T>, em Marte, é o maior vulcão do Sistema Solar: tem cerca de 22 km de altura, quase três vezes o Everest.
          </>,
          <>
            <T>Urano</T> gira &ldquo;deitado&rdquo;, com o eixo inclinado quase 98°. <T>Saturno</T> tem mais de 200 luas; Mercúrio e Vênus não têm nenhuma.
          </>,
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="☄️">Planetas-anões, asteroides e cometas</H>
      <P>
        Desde <T>2006</T>, <T>Plutão</T> é um <T>planeta-anão</T>: ele é redondo e gira em volta do Sol, mas não &ldquo;limpou&rdquo; a vizinhança da sua órbita, que tem muitos
        outros corpos. Ceres e Éris também são planetas-anões.
      </P>
      <Fig n="3.3" caption="O cinturão de asteroides, a órbita de Plutão e um cometa." h={24}>
        <SmallBodiesArt />
      </Fig>
      <List
        items={[
          <>
            O <T>cinturão de asteroides</T> fica entre Marte e Júpiter: milhões de rochas girando em volta do Sol.
          </>,
          <>
            Os <T>cometas</T> são bolas de gelo e poeira. Perto do Sol, o gelo evapora e forma uma cauda que sempre aponta para longe do Sol.
          </>,
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Ordem: Mercúrio, Vênus, Terra, Marte, Júpiter, Saturno, Urano, Netuno (Minha Vó Tem Muitas Joias, Só Usa No Natal).",
          "Os quatro de dentro são rochosos; os quatro de fora são gigantes de gás e gelo.",
          "Mercúrio dá a volta no Sol mais rápido (88 dias); Netuno, mais devagar (165 anos).",
          "Júpiter tem a Grande Mancha Vermelha; Marte, o Monte Olimpo; Urano gira deitado; Saturno tem o recorde de luas.",
          "Plutão é planeta-anão desde 2006.",
        ]}
      />
      <Glossary
        items={[
          ["Sistema Solar", "O Sol e tudo o que gira em volta dele."],
          ["Planeta rochoso", "Planeta com superfície sólida (telúrico)."],
          ["Gigante gasoso", "Planeta grande feito principalmente de gás."],
          ["Planeta-anão", "Corpo redondo que gira no Sol, mas não limpou a órbita."],
          ["Cometa", "Bola de gelo e poeira que forma uma cauda perto do Sol."],
        ]}
      />
      <Quiz
        items={[
          ["Contando a partir do Sol, em que posição fica a Terra?", "Em terceiro lugar."],
          ["Quais são os planetas rochosos?", "Mercúrio, Vênus, Terra e Marte."],
          ["Qual planeta é chamado de Estrela d'Alva?", "Vênus."],
          ["Desde 2006, como Plutão é classificado?", "Como planeta-anão."],
        ]}
      />
    </>,
  ),
];
