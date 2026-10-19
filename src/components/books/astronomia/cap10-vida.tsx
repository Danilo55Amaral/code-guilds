"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Stars } from "./art";

// ============================================================================
// CAPÍTULO 10 — A BUSCA POR VIDA NO UNIVERSO (missão "Astronomia: A Busca por
// Vida no Universo"): o radiotelescópio escutando o céu, o tardígrado (o
// urso-d'água que aguenta até o vácuo), os gêiseres de Encélado e o oceano
// escondido de Europa, a calculadora da equação de Drake com a galáxia
// acendendo as civilizações e a sonda Voyager levando o disco de ouro.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o radiotelescópio escutando o céu
// ---------------------------------------------------------------------------

function ListeningOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Um radiotelescópio, uma grande antena em forma de prato, recebendo ondas de rádio que chegam das estrelas">
      <defs>
        <linearGradient id="ast10-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#020617" />
          <stop offset="1" stopColor="#312e81" />
        </linearGradient>
      </defs>
      <rect width="460" height="300" fill="url(#ast10-sky)" />
      <Stars w={460} h={220} n={50} seed={89} />
      <circle cx="380" cy="56" r="5" fill="#fde047" className="cg-anim-twinkle" />
      {/* as ondas de rádio chegando, da estrela até a antena */}
      {[0, 1, 2].map((k) => (
        <path key={k} d="M-16 -10 Q0 0 -16 10" fill="none" stroke="#a5f3fc" strokeWidth="3" strokeLinecap="round" opacity="0">
          <animateMotion path="M372 64 L232 170" dur="3s" begin={`${-k}s`} repeatCount="indefinite" rotate="auto" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.8;1" dur="3s" begin={`${-k}s`} repeatCount="indefinite" />
        </path>
      ))}
      <rect y="258" width="460" height="42" fill="#14532d" />
      {/* a antena, balançando devagar enquanto acompanha o céu */}
      <path d="M210 258 L230 196 L250 258" fill="none" stroke="#94a3b8" strokeWidth="6" />
      <g transform="translate(230 196)">
        <g>
          <animateTransform attributeName="transform" type="rotate" values="-8;8;-8" dur="12s" repeatCount="indefinite" />
          <g transform="rotate(-35)">
            <path d="M-80 0 Q0 46 80 0 Z" fill="#e2e8f0" stroke="#64748b" strokeWidth="3" />
            <path d="M-50 4 L0 -44 M50 4 L0 -44" stroke="#94a3b8" strokeWidth="2.5" />
            <circle cy="-46" r="6" fill="#f97316">
              <animate attributeName="fill" values="#f97316;#fde047;#f97316" dur="1s" repeatCount="indefinite" />
            </circle>
          </g>
        </g>
      </g>
      {/* o sinal aparecendo na tela */}
      <rect x="20" y="214" width="120" height="34" rx="6" fill="#0f172a" stroke="#22c55e" strokeWidth="2" />
      <path d="M26 231 L44 231 L50 220 L56 242 L62 224 L68 236 L74 231 L134 231" fill="none" stroke="#4ade80" strokeWidth="2" strokeDasharray="160" strokeDashoffset="160">
        <animate attributeName="stroke-dashoffset" values="160;0;0" keyTimes="0;0.6;1" dur="3s" repeatCount="indefinite" />
      </path>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O tardígrado, o urso-d'água
// ---------------------------------------------------------------------------

function TardigradeArt() {
  return (
    <Art viewBox="0 0 560 220" label="Um tardígrado, um bichinho de menos de um milímetro com oito patinhas, andando devagar; ao redor, o calor, o gelo e o vácuo que ele aguenta">
      <rect width="560" height="220" rx="14" fill="#ecfdf5" />
      <circle cx="280" cy="110" r="96" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="3" />
      {/* o tardígrado bamboleando */}
      <g transform="translate(280 112)">
        <g>
          <animateTransform attributeName="transform" type="rotate" values="-4;4;-4" dur="2.4s" repeatCount="indefinite" />
          <ellipse rx="70" ry="34" fill="#fcd9b6" stroke="#b45309" strokeWidth="2.5" />
          {[-36, -12, 12, 36].map((x) => (
            <path key={x} d={`M${x - 10} -30 Q${x} -38 ${x + 10} -30`} fill="none" stroke="#d6a77a" strokeWidth="2" />
          ))}
          <circle cx="-62" cy="-6" r="3.5" fill="#1e293b" />
          <circle cx="-72" cy="4" r="4" fill="#b45309" />
          {[-44, -16, 14, 42].map((x, i) => (
            <g key={x} transform={`translate(${x} 30)`}>
              <g>
                <animateTransform attributeName="transform" type="rotate" values="-14;14;-14" dur="1.2s" begin={`${-i * 0.3}s`} repeatCount="indefinite" />
                <rect x="-6" y="-2" width="12" height="18" rx="6" fill="#fcd9b6" stroke="#b45309" strokeWidth="2" />
                <path d="M-5 16 L-6 20 M0 16 L0 21 M5 16 L6 20" stroke="#78350f" strokeWidth="1.5" />
              </g>
            </g>
          ))}
        </g>
      </g>
      <g fontFamily="Georgia, serif" fontSize="12.5" fontWeight="900">
        <text x="28" y="40" fill="#b91c1c">calor de 150 °C</text>
        <text x="28" y="196" fill="#1d4ed8">frio de -200 °C</text>
        <text x="420" y="40" fill="#6d28d9">vácuo do espaço</text>
        <text x="420" y="196" fill="#065f46">secura total</text>
      </g>
      <text x="280" y="212" textAnchor="middle" fontSize="11" fontStyle="italic" fill="#065f46" fontFamily="Georgia, serif">
        tamanho real: menos de 1 milímetro
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Encélado com os gêiseres e o oceano escondido
// ---------------------------------------------------------------------------

function OceanMoonArt() {
  return (
    <Art viewBox="0 0 560 220" label="A lua Encélado cortada ao meio, com uma crosta de gelo por cima de um oceano de água líquida e gêiseres de água jorrando para o espaço">
      <rect width="560" height="220" rx="14" fill="#020617" />
      <Stars w={560} h={220} n={36} seed={97} />
      <g transform="translate(200 140)">
        <circle r="96" fill="#1e3a8a" />
        <circle r="96" fill="none" stroke="#f1f5f9" strokeWidth="22" />
        <circle r="50" fill="#57534e" />
        <circle r="96" fill="none" stroke="#cbd5e1" strokeWidth="1" />
        {/* as bolhas subindo no oceano */}
        {[-30, 0, 30].map((x, i) => (
          <circle key={x} cx={x} r="4" fill="#93c5fd">
            <animate attributeName="cy" values="-52;-82" dur="2.4s" begin={`${-i * 0.8}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="2.4s" begin={`${-i * 0.8}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </g>
      {/* os gêiseres saindo pelas rachaduras do polo */}
      {[-24, 0, 24].map((dx, i) => (
        <g key={dx}>
          {[0, 1, 2, 3].map((k) => (
            <circle key={k} cx={200 + dx} cy="44" r="4" fill="#e0f2fe">
              <animate attributeName="cy" values="44;-6" dur="1.6s" begin={`${-(k * 0.4 + i * 0.2)}s`} repeatCount="indefinite" />
              <animate attributeName="cx" values={`${200 + dx};${200 + dx * 2.2}`} dur="1.6s" begin={`${-(k * 0.4 + i * 0.2)}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0" dur="1.6s" begin={`${-(k * 0.4 + i * 0.2)}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      ))}
      <g fontFamily="Georgia, serif" fontSize="12.5" fontWeight="900">
        <path d="M283 92 L370 64" stroke="#f1f5f9" strokeWidth="1.5" />
        <text x="376" y="68" fill="#f1f5f9">crosta de gelo</text>
        <path d="M268 132 L370 116" stroke="#93c5fd" strokeWidth="1.5" />
        <text x="376" y="120" fill="#93c5fd">oceano de água líquida</text>
        <path d="M230 160 L370 168" stroke="#d6d3d1" strokeWidth="1.5" />
        <text x="376" y="172" fill="#d6d3d1">núcleo de rocha</text>
        <text x="236" y="22" fill="#e0f2fe">gêiseres</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A calculadora da equação de Drake
// ---------------------------------------------------------------------------

// Posições fixas de 60 "estrelas" nos dois braços da galáxia (a espiral).
const GALAXY_DOTS = Array.from({ length: 60 }, (_, i) => {
  const arm = i % 2;
  const t = (i >> 1) / 30;
  const a = t * 4.2 + arm * Math.PI;
  const r = 10 + t * 130;
  const jitter = ((i * 37) % 11) - 5;
  return { x: 280 + Math.cos(a) * (r + jitter), y: 70 + Math.sin(a) * (r + jitter) * 0.38 };
});

const LIFETIMES = [100, 1_000, 10_000, 100_000, 1_000_000];

function DrakeCalc() {
  const [life, setLife] = useState(50);
  const [smart, setSmart] = useState(10);
  const [radio, setRadio] = useState(50);
  const [years, setYears] = useState(2);
  // R* = 2 estrelas novas por ano, fp = 1 (quase toda estrela tem planetas) e
  // ne = 0,2 planeta na zona habitável por estrela já vêm das observações.
  const n = 2 * 1 * 0.2 * (life / 100) * (smart / 100) * (radio / 100) * LIFETIMES[years];
  // A galáxia acende em escala de 10 em 10: 1 ponto para 1 civilização, 22 para 100 e todos os 60 lá pelas 400 mil.
  const lit = n < 1 ? 0 : Math.min(60, Math.round(1 + Math.log10(n) * 10.5));
  const preset = (a: number, b: number, c: number, d: number) => {
    setLife(a);
    setSmart(b);
    setRadio(c);
    setYears(d);
  };
  const sliders = [
    { label: "Planetas onde surge vida", value: life, set: setLife, text: `${life}%` },
    { label: "Vida que fica inteligente", value: smart, set: setSmart, text: `${smart}%` },
    { label: "Inteligentes que usam rádio", value: radio, set: setRadio, text: `${radio}%` },
  ];
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <svg viewBox="0 0 560 140" className="block w-full rounded-lg" aria-label={`A galáxia com ${lit} pontos verdes acesos`}>
        <rect width="560" height="140" rx="10" fill="#020617" />
        <ellipse cx="280" cy="70" rx="24" ry="12" fill="#fde68a" opacity="0.8" />
        {GALAXY_DOTS.map((d, i) => {
          // (i × 37) mod 60 embaralha a ordem: as civilizações acendem espalhadas pelos braços, não só no centro
          const on = (i * 37) % 60 < lit;
          return <circle key={i} cx={d.x} cy={d.y} r={on ? 3.4 : 1.6} fill={on ? "#4ade80" : "#cbd5e1"} opacity={on ? 1 : 0.6} className={on ? "cg-anim-twinkle" : undefined} />;
        })}
      </svg>
      <div className="mt-[0.4em] grid grid-cols-2 gap-x-[0.8em] gap-y-[0.2em] text-[0.82em]">
        {sliders.map((s) => (
          <label key={s.label} className="block">
            <span className="font-bold text-[#3b2a14]">
              {s.label}: {s.text}
            </span>
            <input type="range" min={1} max={100} value={s.value} onChange={(e) => s.set(Number(e.target.value))} className="w-full accent-[#4338ca]" />
          </label>
        ))}
        <label className="block">
          <span className="font-bold text-[#3b2a14]">Anos transmitindo: {LIFETIMES[years].toLocaleString("pt-BR")}</span>
          <input type="range" min={0} max={LIFETIMES.length - 1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full accent-[#4338ca]" />
        </label>
      </div>
      <div className="mt-[0.3em] flex flex-wrap items-center justify-center gap-[0.3em] text-[0.82em]">
        <button type="button" onClick={() => preset(1, 1, 10, 0)} className="rounded-full border border-[#d9c79d] bg-white px-[0.7em] py-[0.1em] font-bold hover:bg-[#eef2ff]">
          Pessimista
        </button>
        <button type="button" onClick={() => preset(50, 10, 50, 2)} className="rounded-full border border-[#d9c79d] bg-white px-[0.7em] py-[0.1em] font-bold hover:bg-[#eef2ff]">
          Meio-termo
        </button>
        <button type="button" onClick={() => preset(100, 100, 100, 4)} className="rounded-full border border-[#d9c79d] bg-white px-[0.7em] py-[0.1em] font-bold hover:bg-[#eef2ff]">
          Otimista
        </button>
      </div>
      <p className="mt-[0.35em] rounded-lg bg-[#eef2ff] px-[0.6em] py-[0.3em] text-center text-[0.9em] font-bold text-[#312e81]">
        {n < 1 ? "Menos de 1 civilização: talvez estejamos sozinhos na galáxia!" : `Cerca de ${Math.round(n).toLocaleString("pt-BR")} civilizações transmitindo na Via Láctea`}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A Voyager levando o disco de ouro
// ---------------------------------------------------------------------------

function VoyagerArt() {
  return (
    <Art viewBox="0 0 560 220" label="A sonda Voyager viajando para longe do Sol, levando um disco de ouro com sons e imagens da Terra">
      <rect width="560" height="220" rx="14" fill="#020617" />
      <Stars w={560} h={220} n={50} seed={101} />
      <circle cx="40" cy="110" r="14" fill="#fde047" />
      <circle cx="40" cy="110" r="22" fill="#fde047" opacity="0.25" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="-30 6;40 -6;-30 6" dur="14s" repeatCount="indefinite" />
        <g transform="translate(280 110)">
          {/* a antena grande */}
          <path d="M-46 -30 Q-20 0 -46 30 Z" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
          <path d="M-46 0 L-24 0" stroke="#94a3b8" strokeWidth="2" />
          <rect x="-24" y="-12" width="30" height="24" rx="3" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
          <path d="M6 0 L120 0 M-10 12 L-30 70 M-10 -12 L-20 -70" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="-34" y="-82" width="28" height="12" rx="2" fill="#64748b" />
          {/* o disco de ouro brilhando */}
          <g transform="translate(-9 0)">
            <circle r="9" fill="#fbbf24" stroke="#92400e" strokeWidth="1.5" />
            <circle r="3" fill="#92400e" />
            <circle r="9" fill="none" stroke="#fef3c7" strokeWidth="2" className="cg-anim-twinkle" />
          </g>
        </g>
      </g>
      <g fontFamily="Georgia, serif" fontSize="12.5" fontWeight="900">
        <text x="20" y="30" fill="#fde68a">o disco de ouro da Voyager (1977)</text>
        <text x="540" y="204" textAnchor="end" fill="#cbd5e1">sons, músicas, fotos e saudações da Terra</text>
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
      title="A Busca por Vida no Universo"
      goals={["O que estuda a astrobiologia", "Onde a vida pode existir além da Terra", "A equação de Drake e o paradoxo de Fermi", "Como estamos escutando e mandando mensagens"]}
    >
      <Fig h={34}>
        <ListeningOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🦠">A vida em lugares extremos</H>
      <P>
        A <T>astrobiologia</T> é a ciência que estuda a origem da vida e a chance de ela existir em outros planetas. Uma pista importante vem da própria Terra: os{" "}
        <T>extremófilos</T>, seres vivos que adoram lugares onde quase nada sobrevive.
      </P>
      <Fig n="10.1" caption="O tardígrado, ou urso-d'água, um dos animais mais resistentes que existem." h={22}>
        <TardigradeArt />
      </Fig>
      <Cards
        items={[
          { icon: "♨️", title: "Fontes quentes", text: "Micróbios vivem em água a mais de 100 °C, no fundo do mar." },
          { icon: "❄️", title: "Gelo", text: "Micróbios vivem em lagos escondidos sob o gelo da Antártida." },
        ]}
      />
      <Box kind="sabia">
        Em 2007, cientistas levaram tardígrados para fora de uma nave, no vácuo do espaço. Muitos voltaram vivos e tiveram filhotes!
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="💧">Onde procurar vida</H>
      <P>
        Para a vida como conhecemos, o ingrediente principal é a <T>água líquida</T>. Por isso, os cientistas procuram lugares que têm ou já tiveram água, incluindo algumas
        luas que você conheceu no capítulo 4.
      </P>
      <Fig n="10.2" caption="Encélado tem um oceano escondido sob o gelo, e a água escapa em gêiseres." h={22}>
        <OceanMoonArt />
      </Fig>
      <Table
        head={["Lugar", "Por que é promissor"]}
        rows={[
          ["Marte", "Tem leitos de rios antigos; hoje guarda gelo nos polos e embaixo do chão"],
          ["Europa (Júpiter)", "Um oceano enorme embaixo da crosta de gelo"],
          ["Encélado (Saturno)", "Gêiseres de água salgada saindo por rachaduras no gelo"],
          ["Titã (Saturno)", "Lagos de metano e uma química parecida com a da Terra antiga"],
        ]}
      />
      <Box kind="lembre">
        <strong>Bioassinaturas</strong> são pistas de vida. Oxigênio e metano juntos numa atmosfera, por exemplo, podem ser sinal de seres vivos.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🧮">A equação de Drake</H>
      <P>
        Em 1961, o astrônomo <T>Frank Drake</T> criou uma conta para estimar quantas civilizações que usam rádio podem existir na nossa galáxia. Ela multiplica várias chances.
        Mexa nos controles e veja a galáxia acender (quanto mais pontos verdes, mais civilizações):
      </P>
      <DrakeCalc />
      <Box kind="atencao">
        O <strong>paradoxo de Fermi</strong>: o físico Enrico Fermi perguntou &ldquo;Onde está todo mundo?&rdquo;. Se a galáxia é tão grande e antiga, por que ainda não
        encontramos ninguém? Até hoje ninguém sabe a resposta!
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="📡">Escutando e mandando mensagens</H>
      <P>
        O <T>SETI</T> é um grupo de projetos que usa radiotelescópios para procurar sinais de outras civilizações. A humanidade também mandou mensagens: em 1974, o
        radiotelescópio de Arecibo enviou a <T>mensagem de Arecibo</T> para um aglomerado de estrelas. Ela vai levar cerca de 25 mil anos para chegar!
      </P>
      <Fig n="10.4" caption="A sonda Voyager leva um disco com saudações em 55 línguas, incluindo o português." h={22}>
        <VoyagerArt />
      </Fig>
      <Cards
        items={[
          { icon: "🔭", title: "Telescópio Kepler", text: "Lançado em 2009, descobriu milhares de exoplanetas." },
          { icon: "✨", title: "TRAPPIST-1", text: "Uma estrela com sete planetas do tamanho da Terra, três na zona habitável." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "A astrobiologia estuda a origem da vida e a chance de ela existir fora da Terra.",
          "Extremófilos, como o tardígrado, mostram que a vida aguenta lugares muito difíceis.",
          "Marte, Europa, Encélado e Titã são os lugares mais promissores do Sistema Solar.",
          "A equação de Drake (1961) estima quantas civilizações podem existir na galáxia.",
          "O SETI escuta o céu; a mensagem de Arecibo e o disco da Voyager são nossos recados.",
        ]}
      />
      <Glossary
        items={[
          ["Astrobiologia", "Ciência que estuda a vida no universo."],
          ["Extremófilo", "Ser vivo que vive em condições extremas."],
          ["Bioassinatura", "Pista que pode indicar a presença de vida."],
          ["Paradoxo de Fermi", "A pergunta de por que ainda não achamos outras civilizações."],
          ["Radiotelescópio", "Antena gigante que capta ondas de rádio do espaço."],
        ]}
      />
      <Quiz
        items={[
          ["Qual é o ingrediente principal que os cientistas procuram?", "A água líquida."],
          ["Que lua de Saturno solta gêiseres de água?", "Encélado."],
          ["O que a equação de Drake tenta estimar?", "Quantas civilizações que usam rádio existem na nossa galáxia."],
          ["O que leva o disco de ouro da Voyager?", "Sons, músicas, fotos e saudações da Terra."],
        ]}
      />
    </>,
  ),
];
