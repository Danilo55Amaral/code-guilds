"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";

// ============================================================================
// CAPÍTULO 1 — A PRÉ-HISTÓRIA (missão "História: Pré-História e Egito
// Antigo", a parte da Pré-História): a caverna com a fogueira e as pinturas
// na parede, as três idades (de tocar), os animais correndo na pedra da
// Serra da Capivara, Lucy e Luzia e a tabuinha de barro da primeira escrita.
// ============================================================================

/** Uma pessoa da Pré-História (o pé em x, y), com a lança. */
function Caveman({ x, y, s = 1, skin = "#a16207", flip = false }: { x: number; y: number; s?: number; skin?: string; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M-6 0 L-5 -18 M6 0 L5 -18" stroke={skin} strokeWidth="5" strokeLinecap="round" />
      <path d="M-12 -40 L12 -40 L10 -16 L-10 -16 Z" fill="#92400e" />
      <path d="M-12 -40 L-6 -16 M0 -40 L4 -16" stroke="#78350f" strokeWidth="1.5" />
      <circle cy="-50" r="10" fill={skin} />
      <path d="M-11 -52 Q-12 -64 0 -63 Q12 -64 11 -52 Q8 -58 0 -58 Q-8 -58 -11 -52 Z" fill="#1c1917" />
      <path d="M12 -34 L22 -20" stroke={skin} strokeWidth="5" strokeLinecap="round" />
      <path d="M20 -70 L24 2" stroke="#78350f" strokeWidth="3" />
      <path d="M17 -78 L20 -68 L24 -78 Z" fill="#57534e" />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Abertura: a caverna e a fogueira
// ---------------------------------------------------------------------------

function CaveOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="O interior de uma caverna iluminado por uma fogueira, com pinturas de animais e mãos na parede e duas pessoas em volta do fogo">
      <rect width="460" height="300" fill="#1c1917" />
      <path d="M0 300 L0 60 Q60 10 160 30 Q240 0 320 30 Q420 10 460 70 L460 300 Z" fill="#57534e" />
      <path d="M30 300 L40 90 Q120 50 230 70 Q330 50 420 100 L430 300 Z" fill="#78716c" />
      {/* a luz da fogueira na parede */}
      <ellipse cx="230" cy="230" rx="170" ry="120" fill="#f97316" opacity="0.18">
        <animate attributeName="opacity" values="0.14;0.24;0.14" dur="0.6s" repeatCount="indefinite" />
      </ellipse>
      {/* as pinturas */}
      <g fill="#b91c1c" opacity="0.85">
        <path d="M110 120 Q130 104 160 112 L170 104 L168 116 Q164 130 150 130 L148 142 M126 130 L124 142 M118 120 L104 112" stroke="#b91c1c" strokeWidth="3" fill="none" />
        <path d="M270 110 Q300 96 330 106 L342 98 L338 112 Q330 124 310 122 L308 134 M286 120 L284 132" stroke="#b91c1c" strokeWidth="3" fill="none" />
        {[200, 380].map((x) => (
          <g key={x} transform={`translate(${x} 150)`}>
            <path d="M-8 0 L-10 -18 M-3 0 L-4 -22 M2 0 L2 -22 M7 0 L9 -18 M10 2 L16 -6" stroke="#b91c1c" strokeWidth="3" strokeLinecap="round" />
            <ellipse cy="6" rx="12" ry="9" />
          </g>
        ))}
      </g>
      {/* a fogueira */}
      <g transform="translate(230 260)">
        <path d="M-30 6 L30 -2 M-30 -2 L30 6" stroke="#78350f" strokeWidth="7" strokeLinecap="round" />
        {[
          { d: 0, c: "#f97316", h: 46 },
          { d: -12, c: "#fb923c", h: 34 },
          { d: 12, c: "#fbbf24", h: 30 },
        ].map((f, i) => (
          <path key={i} fill={f.c}>
            <animate
              attributeName="d"
              values={`M${f.d - 12} 0 Q${f.d} ${-f.h} ${f.d + 12} 0 Z;M${f.d - 12} 0 Q${f.d + 6} ${-f.h - 10} ${f.d + 12} 0 Z;M${f.d - 12} 0 Q${f.d} ${-f.h} ${f.d + 12} 0 Z`}
              dur={`${0.5 + i * 0.12}s`}
              repeatCount="indefinite"
            />
          </path>
        ))}
      </g>
      <Caveman x={140} y={280} s={1.2} />
      <Caveman x={320} y={280} s={1.2} skin="#8d5524" flip />
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As três idades (de tocar)
// ---------------------------------------------------------------------------

const AGES = [
  {
    name: "Paleolítico",
    sub: "Idade da Pedra Lascada",
    when: "até cerca de 10 mil anos atrás",
    color: "#a16207",
    scene: "🦌🔥🏹🍖",
    text: "Os grupos eram nômades: mudavam de lugar atrás de comida, caçando, pescando e coletando frutos. Faziam ferramentas lascando pedras e aprenderam a dominar o fogo.",
  },
  {
    name: "Neolítico",
    sub: "Idade da Pedra Polida",
    when: "de cerca de 10 mil a 6 mil anos atrás",
    color: "#15803d",
    scene: "🌾🐑🏠🏺",
    text: "Com a agricultura e a criação de animais, muitos grupos deixaram de ser nômades e passaram a viver em aldeias: é a sedentarização. Surgem a cerâmica e as pedras polidas.",
  },
  {
    name: "Idade dos Metais",
    sub: "cobre, bronze e ferro",
    when: "de cerca de 6 mil anos atrás até a escrita",
    color: "#64748b",
    scene: "⚒️🛡️🏘️⚔️",
    text: "Os humanos aprenderam a derreter metais e fazer ferramentas e armas mais fortes. As aldeias cresceram e viraram as primeiras cidades.",
  },
];

export function AgesExplorer() {
  const [sel, setSel] = useState(0);
  const a = AGES[sel];
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <div className="flex flex-wrap justify-center gap-[0.3em] text-[0.82em]">
        {AGES.map((x, i) => (
          <button
            key={x.name}
            type="button"
            onClick={() => setSel(i)}
            className={`rounded-full border px-[0.7em] py-[0.1em] font-bold ${sel === i ? "text-white" : "border-[#d9c79d] bg-white"}`}
            style={sel === i ? { background: x.color, borderColor: x.color } : undefined}
          >
            {x.name}
          </button>
        ))}
      </div>
      <div key={sel} className="cg-anim-fade mt-[0.45em] rounded-lg p-[0.5em]" style={{ background: `${a.color}17` }}>
        <p className="text-center text-[2em] tracking-[0.25em]">{a.scene}</p>
        <p className="cg-book-title text-center font-black" style={{ color: a.color }}>
          {a.name} <span className="text-[0.8em] font-bold text-[#5b4a2e]">· {a.sub}</span>
        </p>
        <p className="text-center text-[0.75em] italic text-[#5b4a2e]">{a.when}</p>
        <p className="mt-[0.2em] text-[0.88em] leading-[1.45] text-[#2b2113]">{a.text}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A pedra da Serra da Capivara com os animais correndo
// ---------------------------------------------------------------------------

function RockArtArt() {
  return (
    <Art viewBox="0 0 560 210" label="Um paredão de pedra avermelhada da Serra da Capivara com pinturas rupestres de veados e pessoas, que parecem correr pela pedra">
      <rect width="560" height="210" rx="14" fill="#fed7aa" />
      <path d="M0 30 Q140 10 280 26 Q420 8 560 30 L560 210 L0 210 Z" fill="#c2410c" opacity="0.55" />
      <path d="M0 60 Q160 44 300 58 Q440 40 560 64" stroke="#9a3412" strokeWidth="2" fill="none" opacity="0.5" />
      {/* os veados correndo */}
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <animateTransform attributeName="transform" type="translate" values="0 0;30 0;0 0" dur="2.4s" begin={`${-k * 0.8}s`} repeatCount="indefinite" />
          <g transform={`translate(${90 + k * 130} ${110 + (k % 2) * 30})`} stroke="#7f1d1d" strokeWidth="3.5" fill="none" strokeLinecap="round">
            <path d="M-22 0 Q0 -8 22 0" />
            <path d="M-16 0 L-22 22 M-10 2 L-6 22 M12 2 L8 22 M18 0 L26 20" />
            <path d="M22 0 L30 -14 M30 -14 L26 -26 M30 -14 L38 -24" />
          </g>
        </g>
      ))}
      {/* as pessoas dançando */}
      {[440, 480].map((x, i) => (
        <g key={x} transform={`translate(${x} 150)`} stroke="#7f1d1d" strokeWidth="3.5" fill="none" strokeLinecap="round">
          <g>
            <animateTransform attributeName="transform" type="rotate" values="-8;8;-8" dur="1s" begin={`${-i * 0.5}s`} repeatCount="indefinite" />
            <circle cy="-34" r="6" fill="#7f1d1d" />
            <path d="M0 -28 L0 -6 M0 -22 L-14 -32 M0 -22 L14 -32 M0 -6 L-10 10 M0 -6 L10 10" />
          </g>
        </g>
      ))}
      <text x="280" y="200" textAnchor="middle" fontSize="13" fontWeight="900" fill="#7c2d12" fontFamily="Georgia, serif">
        Parque Nacional da Serra da Capivara (Piauí)
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Lucy e Luzia
// ---------------------------------------------------------------------------

function LucyLuziaArt() {
  return (
    <Art viewBox="0 0 560 200" label="A linha do tempo com dois fósseis famosos: Lucy, de cerca de 3,2 milhões de anos, encontrada na Etiópia, e Luzia, de cerca de 11 mil anos, encontrada em Minas Gerais">
      <rect width="560" height="200" rx="14" fill="#f5f5f4" />
      <path d="M40 120 L520 120" stroke="#a8a29e" strokeWidth="6" strokeLinecap="round" />
      {[
        { x: 90, name: "Lucy", when: "3,2 milhões de anos", where: "Etiópia, África", color: "#a16207" },
        { x: 460, name: "Luzia", when: "11 mil anos", where: "Lagoa Santa (MG)", color: "#15803d" },
      ].map((f) => (
        <g key={f.name} transform={`translate(${f.x} 120)`}>
          <circle r="12" fill={f.color} stroke="#fff" strokeWidth="3" />
          {/* o crânio */}
          <g transform="translate(0 -56)">
            <g className="cg-anim-float">
              <path d="M-22 6 Q-24 -24 0 -26 Q24 -24 22 6 Q18 18 8 20 L-8 20 Q-18 18 -22 6 Z" fill="#fafaf9" stroke="#78716c" strokeWidth="2" />
              <circle cx="-8" cy="0" r="5" fill="#57534e" />
              <circle cx="8" cy="0" r="5" fill="#57534e" />
              <path d="M-6 14 L6 14" stroke="#78716c" strokeWidth="2" />
            </g>
          </g>
          <g fontFamily="Georgia, serif" textAnchor="middle">
            <text y="36" fontSize="16" fontWeight="900" fill={f.color}>
              {f.name}
            </text>
            <text y="54" fontSize="11.5" fill="#44403c">
              {f.when}
            </text>
            <text y="70" fontSize="11.5" fill="#44403c">
              {f.where}
            </text>
          </g>
        </g>
      ))}
      <text x="280" y="108" textAnchor="middle" fontSize="12" fontStyle="italic" fill="#78716c" fontFamily="Georgia, serif">
        muito, muito tempo...
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A tabuinha de barro da primeira escrita
// ---------------------------------------------------------------------------

function ClayTabletArt() {
  return (
    <Art viewBox="0 0 560 200" label="Uma mão com um estilete de junco apertando um tablete de barro mole e formando as marcas em forma de cunha da escrita cuneiforme">
      <rect width="560" height="200" rx="14" fill="#fef3c7" />
      <rect x="140" y="30" width="220" height="140" rx="14" fill="#d6a77a" stroke="#92400e" strokeWidth="2" />
      {/* as cunhas aparecendo uma a uma */}
      {Array.from({ length: 15 }, (_, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        return (
          <path key={i} d={`M${170 + col * 38} ${60 + row * 36} l12 -6 l0 12 Z M${182 + col * 38} ${60 + row * 36} l10 0`} fill="#78350f" stroke="#78350f" strokeWidth="2" opacity="0">
            <animate attributeName="opacity" values="0;0;1;1;0" keyTimes={`0;${(i / 15) * 0.7};${(i / 15) * 0.7 + 0.02};0.95;1`} dur="7s" repeatCount="indefinite" />
          </path>
        );
      })}
      {/* o estilete */}
      <g>
        <animateMotion
          path="M170 50 L208 50 L246 50 L284 50 L322 50 L170 86 L208 86 L246 86 L284 86 L322 86 L170 122 L208 122 L246 122 L284 122 L322 122"
          dur="4.9s"
          repeatCount="indefinite"
        />
        <path d="M0 0 L60 -70" stroke="#a16207" strokeWidth="6" strokeLinecap="round" />
      </g>
      <g fontFamily="Georgia, serif" fontWeight="900">
        <text x="390" y="80" fontSize="14" fill="#78350f">escrita cuneiforme</text>
        <text x="390" y="102" fontSize="12" fill="#92400e">Mesopotâmia,</text>
        <text x="390" y="120" fontSize="12" fill="#92400e">cerca de 3500 a.C.</text>
      </g>
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
      title="A Pré-História"
      goals={["O que é a Pré-História e quando ela termina", "Paleolítico, Neolítico e Idade dos Metais", "As pinturas rupestres e a Serra da Capivara", "Luzia e a invenção da escrita"]}
    >
      <Fig h={34}>
        <CaveOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🦴">As três idades</H>
      <P>
        A <T>Pré-História</T> é o período antes da invenção da escrita. Ela é dividida pelos materiais que os humanos usavam para fazer suas ferramentas. Toque em cada
        período:
      </P>
      <AgesExplorer />
      <Box kind="lembre">
        A grande mudança do Neolítico foi a <strong>agricultura</strong>: plantando, as pessoas podiam ficar num lugar só e formar aldeias.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🎨">As pinturas rupestres</H>
      <P>
        Os humanos pré-históricos pintavam animais, pessoas e cenas de caça nas paredes de cavernas e rochas: são as <T>pinturas rupestres</T>. As tintas eram feitas
        de terra, carvão e sangue de animais.
      </P>
      <Fig n="1.1" caption="As pinturas parecem correr pela pedra." h={21}>
        <RockArtArt />
      </Fig>
      <Box kind="sabia">
        O <strong>Parque Nacional da Serra da Capivara</strong>, no Piauí, tem milhares de pinturas rupestres e é Patrimônio Mundial da Unesco.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="💀">Lucy e Luzia</H>
      <P>
        Os fósseis contam a história dos nossos antepassados. <T>Lucy</T>, encontrada na Etiópia, é uma hominídea de cerca de 3,2 milhões de anos. <T>Luzia</T>, achada em{" "}
        <T>Lagoa Santa (MG)</T>, tem cerca de 11 mil anos e é um dos fósseis humanos mais antigos das Américas.
      </P>
      <Fig n="1.2" caption="Lucy e Luzia na linha do tempo." h={20}>
        <LucyLuziaArt />
      </Fig>
      <P>Muitos cientistas acham que os primeiros humanos chegaram à América vindos da Ásia, atravessando uma passagem de terra e gelo no estreito de Bering.</P>
    </>,
  ),

  page(
    <>
      <H icon="✍️">A invenção da escrita</H>
      <P>
        Por volta de <T>3500 a.C.</T>, na <T>Mesopotâmia</T>, surgiu a escrita. Os sumérios marcavam tabuletas de barro mole com um estilete de ponta em forma de cunha:
        é a <T>escrita cuneiforme</T>. Com ela, os povos passaram a deixar registros, e começa a <T>História</T>.
      </P>
      <Fig n="1.3" caption="As cunhas no barro: uma das primeiras escritas do mundo." h={20}>
        <ClayTabletArt />
      </Fig>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "A Pré-História é o período antes da escrita, que surgiu por volta de 3500 a.C.",
          "Paleolítico: nômades, caçadores e coletores, que dominaram o fogo.",
          "Neolítico: agricultura, criação de animais e as primeiras aldeias.",
          "Idade dos Metais: ferramentas de cobre, bronze e ferro e as primeiras cidades.",
          "As pinturas rupestres da Serra da Capivara (PI) e a Luzia (MG) contam a Pré-História do Brasil.",
        ]}
      />
      <Glossary
        items={[
          ["Nômade", "Quem não tem moradia fixa e muda de lugar."],
          ["Sedentarização", "Passar a viver num lugar fixo."],
          ["Pintura rupestre", "Pintura feita em cavernas e rochas."],
          ["Fóssil", "Resto ou marca de um ser vivo muito antigo, preservado na rocha."],
          ["Cuneiforme", "A escrita em forma de cunha da Mesopotâmia."],
        ]}
      />
      <Quiz
        items={[
          ["O que marca o fim da Pré-História?", "A invenção da escrita."],
          ["Como viviam os grupos do Paleolítico?", "Eram nômades, caçadores e coletores."],
          ["Em que período surgiu a agricultura?", "No Neolítico."],
          ["Onde foi encontrada a Luzia?", "Em Lagoa Santa, Minas Gerais."],
        ]}
      />
    </>,
  ),
];
