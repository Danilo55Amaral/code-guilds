"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Robed } from "./art";

// ============================================================================
// CAPÍTULO 9 — REVOLUÇÕES E INDEPENDÊNCIAS (missões "Reforma Protestante e
// Absolutismo", "Iluminismo e Revoluções", "Brasil Colônia e Império" e "O
// Mundo Contemporâneo", a parte da Revolução Industrial): a Bastilha caindo
// com a faixa do lema da Revolução Francesa, o Palácio de Versalhes com o Sol
// do rei, a linha do tempo das revoluções (de tocar), a máquina a vapor e o
// trem do café.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a Bastilha e o lema da Revolução
// ---------------------------------------------------------------------------

function BastilleOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="O povo de Paris em frente à prisão da Bastilha, que perde as pedras do alto, com uma faixa azul, branca e vermelha: Liberdade, Igualdade, Fraternidade">
      <rect width="460" height="300" fill="#fecaca" />
      {/* a Bastilha */}
      <g>
        <rect x="150" y="70" width="160" height="150" fill="#78716c" stroke="#44403c" strokeWidth="2" />
        {[150, 270].map((x) => (
          <rect key={x} x={x - 10} y="50" width="60" height="170" fill="#a8a29e" stroke="#44403c" strokeWidth="2" />
        ))}
        {/* as pedras caindo */}
        {[0, 1, 2].map((k) => (
          <rect key={k} x={170 + k * 50} y="48" width="18" height="14" fill="#a8a29e" stroke="#44403c">
            <animate attributeName="y" values="48;48;230" keyTimes="0;0.4;1" dur="3s" begin={`${-k}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.8;1" dur="3s" begin={`${-k}s`} repeatCount="indefinite" />
          </rect>
        ))}
        <rect x="210" y="160" width="40" height="60" fill="#44403c" />
      </g>
      <rect y="220" width="460" height="80" fill="#a8a29e" />
      {/* o povo */}
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i} transform={`translate(${30 + i * 50} 284)`}>
          <g>
            <animateTransform attributeName="transform" type="translate" values="0 0;0 -6;0 0" dur="0.9s" begin={`${-i * 0.15}s`} repeatCount="indefinite" />
            <Robed x={0} y={0} s={0.8} robe={["#1d4ed8", "#f8fafc", "#dc2626"][i % 3]} sash="#1e293b" skin={["#f1c9a5", "#d6a77a", "#e0ac69"][i % 3]} />
          </g>
        </g>
      ))}
      {/* a faixa */}
      <g>
        <rect x="40" y="16" width="380" height="30" rx="6" fill="#fff" stroke="#1e293b" strokeWidth="2" />
        <rect x="40" y="16" width="126" height="30" rx="6" fill="#1d4ed8" />
        <rect x="294" y="16" width="126" height="30" rx="6" fill="#dc2626" />
        <text x="230" y="37" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff" stroke="#1e293b" strokeWidth="3" paintOrder="stroke" fontFamily="Georgia, serif">
          Liberdade, Igualdade, Fraternidade
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O Palácio de Versalhes e o Rei Sol
// ---------------------------------------------------------------------------

function VersaillesArt() {
  return (
    <Art viewBox="0 0 560 200" label="O enorme Palácio de Versalhes, com jardins e chafarizes, e o símbolo do Sol do rei Luís XIV brilhando em cima">
      <rect width="560" height="200" rx="14" fill="#dbeafe" />
      <g transform="translate(280 46)">
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="16s" repeatCount="indefinite" />
          {Array.from({ length: 12 }, (_, i) => (
            <path key={i} d="M0 -32 L5 -20 L-5 -20 Z" fill="#facc15" transform={`rotate(${i * 30})`} />
          ))}
        </g>
        <circle r="18" fill="#fbbf24" />
        <circle cx="-6" cy="-3" r="2" fill="#92400e" />
        <circle cx="6" cy="-3" r="2" fill="#92400e" />
        <path d="M-6 6 Q0 10 6 6" stroke="#92400e" strokeWidth="2" fill="none" />
      </g>
      <rect x="40" y="100" width="480" height="60" fill="#fef3c7" stroke="#a16207" strokeWidth="2" />
      <path d="M220 100 L280 80 L340 100 Z" fill="#fde68a" stroke="#a16207" strokeWidth="2" />
      {Array.from({ length: 20 }, (_, i) => (
        <rect key={i} x={52 + i * 23.5} y="112" width="12" height="20" rx="5" fill="#93c5fd" />
      ))}
      <rect y="160" width="560" height="40" fill="#86efac" />
      {[120, 280, 440].map((x) => (
        <g key={x} transform={`translate(${x} 180)`}>
          <ellipse rx="26" ry="7" fill="#38bdf8" />
          {[0, 1, 2].map((k) => (
            <circle key={k} r="2.5" fill="#bae6fd">
              <animate attributeName="cy" values="-2;-26;-2" dur="1.2s" begin={`${-k * 0.4}s`} repeatCount="indefinite" />
              <animate attributeName="cx" values={`0;${(k - 1) * 10};${(k - 1) * 16}`} dur="1.2s" begin={`${-k * 0.4}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A linha do tempo das revoluções (de tocar)
// ---------------------------------------------------------------------------

const EVENTS = [
  { year: "1688", name: "Revolução Gloriosa", color: "#7c3aed", text: "Na Inglaterra, o Parlamento limitou o poder do rei. No ano seguinte veio a Declaração de Direitos (Bill of Rights)." },
  { year: "1776", name: "Independência dos EUA", color: "#2563eb", text: "As Treze Colônias inglesas da América declararam a independência em 4 de julho, num texto escrito principalmente por Thomas Jefferson." },
  { year: "1789", name: "Revolução Francesa", color: "#dc2626", text: "Em 14 de julho, o povo tomou a Bastilha. A revolução derrubou a monarquia absolutista e aprovou a Declaração dos Direitos do Homem e do Cidadão." },
  { year: "1804", name: "Independência do Haiti", color: "#16a34a", text: "Uma revolução de pessoas escravizadas, liderada por Toussaint Louverture e Dessalines, criou a primeira república negra do mundo." },
  { year: "1806", name: "Bloqueio Continental", color: "#ca8a04", text: "Napoleão proibiu a Europa de comerciar com a Inglaterra. Portugal desobedeceu, foi invadido, e a família real fugiu para o Brasil." },
  { year: "1815", name: "Waterloo", color: "#475569", text: "Napoleão foi derrotado de vez e exilado na ilha de Santa Helena, no Atlântico Sul." },
];

export function RevolutionTimeline() {
  const [sel, setSel] = useState(2);
  const e = EVENTS[sel];
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <div className="relative flex justify-between">
        <div className="absolute left-[5%] right-[5%] top-[0.95em] h-[3px] bg-[#d9c79d]" />
        {EVENTS.map((x, i) => (
          <button key={x.year + x.name} type="button" onClick={() => setSel(i)} className="relative flex flex-col items-center" title={x.name}>
            <span
              className={`flex h-[1.9em] w-[1.9em] items-center justify-center rounded-full border-2 text-[0.62em] font-black text-white transition-transform ${sel === i ? "scale-125" : ""}`}
              style={{ background: x.color, borderColor: sel === i ? "#1e293b" : "#fff" }}
            >
              {x.year.slice(2)}
            </span>
            <span className="mt-[0.2em] text-[0.62em] font-bold text-[#5b4a2e]">{x.year}</span>
          </button>
        ))}
      </div>
      <div key={sel} className="cg-anim-fade mt-[0.5em] rounded-lg px-[0.7em] py-[0.4em]" style={{ background: `${e.color}14`, borderLeft: `5px solid ${e.color}` }}>
        <p className="cg-book-title font-black" style={{ color: e.color }}>
          {e.year} · {e.name}
        </p>
        <p className="text-[0.88em] leading-[1.45] text-[#2b2113]">{e.text}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A máquina a vapor
// ---------------------------------------------------------------------------

function SteamArt() {
  return (
    <Art viewBox="0 0 560 190" label="Uma fábrica da Revolução Industrial com chaminés soltando fumaça e um trem a vapor carregado de sacas de café andando nos trilhos">
      <rect width="560" height="190" rx="14" fill="#e7e5e4" />
      <rect x="30" y="60" width="150" height="100" fill="#b45309" stroke="#78350f" strokeWidth="2" />
      {[50, 110].map((x, i) => (
        <g key={x}>
          <rect x={x} y="20" width="20" height="40" fill="#78350f" />
          {[0, 1].map((k) => (
            <circle key={k} cx={x + 10} r="10" fill="#57534e" opacity="0.6">
              <animate attributeName="cy" values="16;-20" dur="2.4s" begin={`${-(k * 1.2 + i * 0.5)}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0" dur="2.4s" begin={`${-(k * 1.2 + i * 0.5)}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      ))}
      {Array.from({ length: 4 }, (_, i) => (
        <rect key={i} x={44 + i * 32} y="90" width="18" height="22" fill="#fde68a" />
      ))}
      <path d="M200 166 L560 166" stroke="#44403c" strokeWidth="4" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;140 0;0 0" dur="8s" repeatCount="indefinite" />
        <g transform="translate(250 160)">
          <rect x="0" y="-36" width="70" height="30" rx="4" fill="#1e293b" />
          <rect x="44" y="-56" width="14" height="22" fill="#1e293b" />
          <circle cx="51" cy="-62" r="8" fill="#a8a29e" className="cg-anim-float" />
          <circle cx="16" cy="0" r="9" fill="#475569" />
          <circle cx="52" cy="0" r="9" fill="#475569" />
          <rect x="-80" y="-30" width="74" height="24" rx="3" fill="#92400e" />
          {[-70, -48, -26].map((x) => (
            <ellipse key={x} cx={x + 6} cy="-36" rx="9" ry="7" fill="#d6a77a" stroke="#78350f" />
          ))}
          <circle cx="-64" cy="0" r="8" fill="#475569" />
          <circle cx="-22" cy="0" r="8" fill="#475569" />
        </g>
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
      title="Revoluções e Independências"
      goals={["O absolutismo e o mercantilismo", "O Iluminismo, o Século das Luzes", "As revoluções inglesa, americana, francesa e haitiana", "O Brasil da Inconfidência à República"]}
    >
      <Fig h={34}>
        <BastilleOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="👑">O absolutismo</H>
      <P>
        No <T>absolutismo</T>, o rei concentrava todo o poder. A teoria do <T>direito divino</T> dizia que esse poder vinha de Deus e não podia ser questionado. O símbolo
        maior foi <T>Luís XIV</T>, o Rei Sol, da França, lembrado pela frase “O Estado sou eu”.
      </P>
      <Fig n="9.1" caption="O Palácio de Versalhes, de Luís XIV." h={20}>
        <VersaillesArt />
      </Fig>
      <Box kind="lembre">
        O <strong>mercantilismo</strong> eram as práticas econômicas desses reis: acumular metais preciosos, vender mais do que comprar e explorar colônias, como o
        Brasil.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="💡">O Século das Luzes</H>
      <P>
        No século XVIII, o <T>Iluminismo</T> defendeu a <T>razão</T> para “iluminar” e criticar a sociedade, os privilégios e o poder absoluto dos reis. Por isso esse
        século ficou conhecido como o <T>Século das Luzes</T>.
      </P>
      <Cards
        items={[
          { icon: "🗣️", title: "Voltaire", text: "Defendia a liberdade de expressão e criticava a intolerância religiosa." },
          { icon: "⚖️", title: "Montesquieu", text: "Propôs separar o poder em três: Executivo, Legislativo e Judiciário." },
          { icon: "📚", title: "A Enciclopédia", text: "Organizada por Diderot e d'Alembert, tentou reunir todo o conhecimento da época." },
        ]}
      />
      <Box kind="sabia">
        A divisão dos <strong>três poderes</strong>, pensada por Montesquieu, existe até hoje no Brasil: o presidente, o Congresso e os tribunais.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🔥">A era das revoluções</H>
      <P>As ideias iluministas inspiraram revoluções que mudaram o mundo. Toque em cada ano:</P>
      <RevolutionTimeline />
      <P>
        Ao mesmo tempo, a <T>Revolução Industrial</T>, que começou na Inglaterra no século XVIII, trocou o trabalho artesanal por <T>máquinas a vapor</T> e fábricas.
      </P>
      <Fig n="9.2" caption="As fábricas e os trens a vapor da Revolução Industrial." h={18}>
        <SteamArt />
      </Fig>
    </>,
  ),

  page(
    <>
      <H icon="🎉">O Brasil se torna independente</H>
      <Table
        head={["Ano", "Acontecimento"]}
        rows={[
          ["1789", "Inconfidência Mineira; Tiradentes é enforcado em 21 de abril de 1792"],
          ["1808", "A família real portuguesa foge de Napoleão e vem para o Rio de Janeiro"],
          ["1822", "Dom Pedro I proclama a Independência, em 7 de setembro, às margens do Ipiranga"],
          ["1840", "Dom Pedro II começa a governar, aos 14 anos (até 1889)"],
          ["1888", "A Lei Áurea, assinada pela princesa Isabel em 13 de maio, abole a escravidão"],
          ["1889", "Marechal Deodoro da Fonseca proclama a República, em 15 de novembro"],
        ]}
      />
      <Box kind="lembre">
        No século XIX, o principal produto de exportação do Brasil foi o <strong>café</strong>. A abolição foi resultado de muita luta do movimento abolicionista e das
        próprias pessoas escravizadas.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "No absolutismo, o rei tinha todo o poder; Luís XIV disse “O Estado sou eu”.",
          "O Iluminismo defendeu a razão; Montesquieu propôs os três poderes.",
          "1776: independência dos EUA; 1789: Revolução Francesa; 1804: independência do Haiti.",
          "A Revolução Industrial trouxe as máquinas a vapor e as fábricas.",
          "Brasil: família real em 1808, Independência em 1822, Lei Áurea em 1888 e República em 1889.",
        ]}
      />
      <Glossary
        items={[
          ["Absolutismo", "Regime em que o rei concentra todo o poder."],
          ["Iluminismo", "Movimento que valorizava a razão, no século XVIII."],
          ["Revolução", "Mudança profunda e rápida na sociedade."],
          ["Abolição", "O fim da escravidão."],
          ["República", "Forma de governo com governantes eleitos."],
        ]}
      />
      <Quiz
        items={[
          ["Qual rei francês disse “O Estado sou eu”?", "Luís XIV, o Rei Sol."],
          ["Qual foi o lema da Revolução Francesa?", "Liberdade, Igualdade, Fraternidade."],
          ["Por que a família real veio para o Brasil em 1808?", "Para fugir da invasão de Portugal pelas tropas de Napoleão."],
          ["Qual lei aboliu a escravidão no Brasil?", "A Lei Áurea, de 13 de maio de 1888."],
        ]}
      />
    </>,
  ),
];
