"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { BohrAtom } from "./art";

// ============================================================================
// CAPÍTULO 2 — ÁTOMOS E A TABELA PERIÓDICA (missão "Química: Átomos e a
// Tabela Periódica"): o átomo de oxigênio com os elétrons girando, as partes
// do átomo, os quatro modelos atômicos, os isótopos do carbono e a Tabela
// Periódica de tocar (cada elemento mostra o átomo, a família e uma
// curiosidade).
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o átomo de oxigênio e os símbolos flutuando
// ---------------------------------------------------------------------------

function AtomOpenerArt() {
  const symbols: [string, number, number, number][] = [
    ["H", 60, 60, 0],
    ["He", 400, 70, 0.6],
    ["C", 70, 230, 1.2],
    ["Na", 390, 230, 1.8],
    ["Au", 330, 40, 2.4],
    ["Fe", 120, 140, 3],
    ["Cl", 360, 150, 0.9],
  ];
  return (
    <Art viewBox="0 0 460 300" label="Um átomo de oxigênio com os elétrons girando em volta do núcleo, e símbolos de elementos flutuando">
      <circle cx="230" cy="150" r="130" fill="#f0abfc" opacity="0.22" className="cg-anim-glow" style={{ "--cg-dur": "4s" } as React.CSSProperties} />
      <BohrAtom shells={[2, 6]} x={230} y={150} r0={46} gap={44} label="Oxigênio (8 prótons, 8 elétrons)" />
      {symbols.map(([sym, x, y, d]) => (
        <g key={sym} transform={`translate(${x} ${y})`}>
          <g className="cg-anim-hover" style={{ animationDelay: `${d}s` }}>
            <rect x="-20" y="-20" width="40" height="40" rx="6" fill="#fdf4ff" stroke="#a21caf" strokeWidth="2" />
            <text y="7" textAnchor="middle" fontSize="18" fontWeight="900" fill="#701a75" fontFamily="Georgia, serif">
              {sym}
            </text>
          </g>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As partes do átomo
// ---------------------------------------------------------------------------

function AtomPartsArt() {
  return (
    <Art viewBox="0 0 540 250" label="O átomo de carbono: no núcleo, prótons e nêutrons; em volta, na eletrosfera, os elétrons">
      <BohrAtom shells={[2, 4]} x={170} y={125} r0={44} gap={42} />
      <g fontFamily="Georgia, serif" fontSize="12.5" fontWeight="900">
        <line x1="178" y1="120" x2="300" y2="50" stroke="#7c6a48" strokeDasharray="3 2" />
        <text x="304" y="54" fill="#3b2a14">
          Núcleo (prótons + nêutrons)
        </text>
        <line x1="256" y1="125" x2="300" y2="125" stroke="#7c6a48" strokeDasharray="3 2" />
        <text x="304" y="129" fill="#3b2a14">
          Eletrosfera (onde ficam os elétrons)
        </text>
      </g>
      {/* a legenda das partículas */}
      <g transform="translate(320 168)" fontFamily="Georgia, serif" fontSize="12.5">
        {[
          ["#ef4444", "Próton", "carga positiva (+)"],
          ["#94a3b8", "Nêutron", "sem carga (0)"],
          ["#3b82f6", "Elétron", "carga negativa (−)"],
        ].map(([c, n, d], i) => (
          <g key={n} transform={`translate(0 ${i * 24})`}>
            <circle cx="6" cy="-4" r="7" fill={c} stroke="#1e293b" strokeWidth="1" />
            <text x="20" y="0" fontWeight="900" fill="#3b2a14">
              {n}
            </text>
            <text x="86" y="0" fill="#5b4a2e">
              {d}
            </text>
          </g>
        ))}
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os modelos atômicos ao longo da história
// ---------------------------------------------------------------------------

function ModelsArt() {
  return (
    <Art viewBox="0 0 600 190" label="Os modelos atômicos: Dalton, a bola maciça; Thomson, o pudim de passas; Rutherford, o núcleo com elétrons em volta; e Bohr, as camadas">
      {/* Dalton */}
      <g transform="translate(75 80)">
        <circle r="44" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
        <circle cx="-14" cy="-16" r="12" fill="#fff" opacity="0.5" />
      </g>
      {/* Thomson */}
      <g transform="translate(225 80)">
        <circle r="44" fill="#fca5a5" stroke="#b91c1c" strokeWidth="2" />
        {[
          [-20, -18], [10, -26], [24, 2], [-6, 6], [-26, 18], [12, 26], [30, -18],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="5" fill="#3b82f6" className="cg-anim-twinkle" style={{ animationDelay: `${i * 0.25}s` }} />
        ))}
      </g>
      {/* Rutherford */}
      <g transform="translate(375 80)">
        {[0, 60, 120].map((rot) => (
          <ellipse key={rot} rx="46" ry="16" fill="none" stroke="#a855f7" strokeWidth="1.5" transform={`rotate(${rot})`} />
        ))}
        <circle r="7" fill="#ef4444" />
        {[0, 60, 120].map((rot, i) => (
          <g key={rot} transform={`rotate(${rot})`}>
            <circle r="4.5" fill="#3b82f6">
              <animateMotion dur={`${2 + i * 0.6}s`} repeatCount="indefinite" path="M46 0 A46 16 0 1 1 -46 0 A46 16 0 1 1 46 0" />
            </circle>
          </g>
        ))}
      </g>
      {/* Bohr */}
      <BohrAtom shells={[2, 4]} x={525} y={80} r0={22} gap={20} />
      {[
        ["Dalton (1808)", "bola maciça"],
        ["Thomson (1897)", "“pudim de passas”"],
        ["Rutherford (1911)", "núcleo pequeno"],
        ["Bohr (1913)", "camadas de energia"],
      ].map(([n, d], i) => (
        <g key={n} fontFamily="Georgia, serif" textAnchor="middle">
          <text x={75 + i * 150} y="158" fontSize="13.5" fontWeight="900" fill="#3b2a14">
            {n}
          </text>
          <text x={75 + i * 150} y="176" fontSize="12" fontStyle="italic" fill="#6b5a3a">
            {d}
          </text>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os isótopos do carbono
// ---------------------------------------------------------------------------

function Nucleus({ p, n, x, y }: { p: number; n: number; x: number; y: number }) {
  const total = p + n;
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: total }, (_, i) => {
        const a = i * 2.4;
        const d = Math.sqrt(i) * 7;
        // prótons e nêutrons alternados; o que sobra de um deles fica na borda
        const proton = i < 2 * Math.min(p, n) ? i % 2 === 0 : p > n;
        return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r="8" fill={proton ? "#ef4444" : "#94a3b8"} stroke="#1e293b" strokeWidth="1" />;
      })}
    </g>
  );
}

function IsotopesArt() {
  return (
    <Art viewBox="0 0 540 190" label="Os isótopos do carbono: o carbono-12 tem 6 prótons e 6 nêutrons, e o carbono-14 tem 6 prótons e 8 nêutrons">
      <Nucleus p={6} n={6} x={130} y={80} />
      <Nucleus p={6} n={8} x={400} y={80} />
      <g fontFamily="Georgia, serif" textAnchor="middle">
        <text x="130" y="150" fontSize="15" fontWeight="900" fill="#3b2a14">
          Carbono-12
        </text>
        <text x="130" y="170" fontSize="12" fill="#5b4a2e">
          6 prótons + 6 nêutrons
        </text>
        <text x="400" y="150" fontSize="15" fontWeight="900" fill="#3b2a14">
          Carbono-14
        </text>
        <text x="400" y="170" fontSize="12" fill="#5b4a2e">
          6 prótons + 8 nêutrons
        </text>
        <text x="265" y="86" fontSize="13" fontWeight="900" fill="#a21caf">
          mesmo Z = 6
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A Tabela Periódica de tocar
// ---------------------------------------------------------------------------

type Family = "alcalino" | "alcalinoTerroso" | "transicao" | "outroMetal" | "semimetal" | "ametal" | "halogenio" | "nobre" | "hidrogenio";

const FAMILY: Record<Family, { name: string; color: string }> = {
  hidrogenio: { name: "Hidrogênio (fica sozinho)", color: "#e2e8f0" },
  alcalino: { name: "Metal alcalino (grupo 1)", color: "#fca5a5" },
  alcalinoTerroso: { name: "Metal alcalinoterroso (grupo 2)", color: "#fdba74" },
  transicao: { name: "Metal de transição", color: "#fde68a" },
  outroMetal: { name: "Metal", color: "#cbd5e1" },
  semimetal: { name: "Semimetal", color: "#99f6e4" },
  ametal: { name: "Ametal", color: "#bbf7d0" },
  halogenio: { name: "Halogênio (grupo 17)", color: "#d9f99d" },
  nobre: { name: "Gás nobre (grupo 18)", color: "#ddd6fe" },
};

interface Element {
  z: number;
  sym: string;
  name: string;
  row: number;
  col: number;
  family: Family;
  shells: number[];
  fact: string;
}

const ELEMENTS: Element[] = [
  { z: 1, sym: "H", name: "Hidrogênio", row: 1, col: 1, family: "hidrogenio", shells: [1], fact: "O mais leve e o mais abundante do universo: é o combustível das estrelas." },
  { z: 2, sym: "He", name: "Hélio", row: 1, col: 18, family: "nobre", shells: [2], fact: "O gás dos balões que sobem: é leve e quase não reage, por isso é seguro." },
  { z: 3, sym: "Li", name: "Lítio", row: 2, col: 1, family: "alcalino", shells: [2, 1], fact: "Um metal tão leve que boia na água. Está nas baterias de celular." },
  { z: 4, sym: "Be", name: "Berílio", row: 2, col: 2, family: "alcalinoTerroso", shells: [2, 2], fact: "Metal leve e duro, usado em peças de aviões e satélites." },
  { z: 5, sym: "B", name: "Boro", row: 2, col: 13, family: "semimetal", shells: [2, 3], fact: "Vai no vidro que pode ir ao forno sem rachar." },
  { z: 6, sym: "C", name: "Carbono", row: 2, col: 14, family: "ametal", shells: [2, 4], fact: "O átomo da vida! Forma o diamante, o grafite do lápis e todos os seres vivos." },
  { z: 7, sym: "N", name: "Nitrogênio", row: 2, col: 15, family: "ametal", shells: [2, 5], fact: "78% do ar que respiramos é gás nitrogênio." },
  { z: 8, sym: "O", name: "Oxigênio", row: 2, col: 16, family: "ametal", shells: [2, 6], fact: "21% do ar. Essencial para a respiração e para o fogo." },
  { z: 9, sym: "F", name: "Flúor", row: 2, col: 17, family: "halogenio", shells: [2, 7], fact: "Está na pasta de dente e protege os dentes contra as cáries." },
  { z: 10, sym: "Ne", name: "Neônio", row: 2, col: 18, family: "nobre", shells: [2, 8], fact: "Gás nobre que brilha em vermelho-alaranjado nos letreiros luminosos." },
  { z: 11, sym: "Na", name: "Sódio", row: 3, col: 1, family: "alcalino", shells: [2, 8, 1], fact: "Símbolo do latim natrium. Junto com o cloro, forma o sal de cozinha (NaCl)." },
  { z: 12, sym: "Mg", name: "Magnésio", row: 3, col: 2, family: "alcalinoTerroso", shells: [2, 8, 2], fact: "Queima com uma luz branca fortíssima e forma ligas metálicas leves." },
  { z: 13, sym: "Al", name: "Alumínio", row: 3, col: 13, family: "outroMetal", shells: [2, 8, 3], fact: "O metal das latinhas de refrigerante, que podem ser recicladas infinitas vezes." },
  { z: 14, sym: "Si", name: "Silício", row: 3, col: 14, family: "semimetal", shells: [2, 8, 4], fact: "A base dos chips de computador e da areia." },
  { z: 15, sym: "P", name: "Fósforo", row: 3, col: 15, family: "ametal", shells: [2, 8, 5], fact: "Está nos ossos, nos dentes, no DNA e na cabeça do palito de fósforo." },
  { z: 16, sym: "S", name: "Enxofre", row: 3, col: 16, family: "ametal", shells: [2, 8, 6], fact: "Um pó amarelo. Seus gases têm cheiro de ovo podre e causam a chuva ácida." },
  { z: 17, sym: "Cl", name: "Cloro", row: 3, col: 17, family: "halogenio", shells: [2, 8, 7], fact: "Usado no tratamento da água. Com o sódio, forma o sal de cozinha." },
  { z: 18, sym: "Ar", name: "Argônio", row: 3, col: 18, family: "nobre", shells: [2, 8, 8], fact: "O gás nobre mais comum do ar, usado dentro de lâmpadas." },
  { z: 19, sym: "K", name: "Potássio", row: 4, col: 1, family: "alcalino", shells: [2, 8, 8, 1], fact: "Símbolo do latim kalium. Importante para os músculos; a banana tem bastante." },
  { z: 20, sym: "Ca", name: "Cálcio", row: 4, col: 2, family: "alcalinoTerroso", shells: [2, 8, 8, 2], fact: "Forma os ossos e os dentes. Está no leite e no giz." },
  { z: 26, sym: "Fe", name: "Ferro", row: 4, col: 8, family: "transicao", shells: [2, 8, 14, 2], fact: "Do latim ferrum. O aço é feito de ferro, e o ferro está na hemoglobina do sangue." },
  { z: 29, sym: "Cu", name: "Cobre", row: 4, col: 11, family: "transicao", shells: [2, 8, 18, 1], fact: "Do latim cuprum. Ótimo condutor: os fios elétricos são de cobre." },
  { z: 47, sym: "Ag", name: "Prata", row: 5, col: 11, family: "transicao", shells: [2, 8, 18, 18, 1], fact: "Do latim argentum, que deu nome à Argentina. É o melhor condutor elétrico." },
  { z: 79, sym: "Au", name: "Ouro", row: 6, col: 11, family: "transicao", shells: [2, 8, 18, 32, 18, 1], fact: "Do latim aurum. Não enferruja: vai em joias e nos contatos dos circuitos." },
  { z: 82, sym: "Pb", name: "Chumbo", row: 6, col: 14, family: "outroMetal", shells: [2, 8, 18, 32, 18, 4], fact: "Do latim plumbum. Denso e tóxico, bloqueia a radiação no avental do raio X." },
];

/** As casas vazias, só pra mostrar o desenho da tabela (até o 6º período). */
function emptyCells(): [number, number][] {
  const taken = new Set(ELEMENTS.map((e) => `${e.row}-${e.col}`));
  const cells: [number, number][] = [];
  for (let row = 1; row <= 6; row++) {
    for (let col = 1; col <= 18; col++) {
      const exists = row === 1 ? col === 1 || col === 18 : row <= 3 ? col <= 2 || col >= 13 : true;
      if (exists && !taken.has(`${row}-${col}`)) cells.push([row, col]);
    }
  }
  return cells;
}
const EMPTY = emptyCells();

export function PeriodicTable() {
  const [sel, setSel] = useState<Element>(ELEMENTS[5]);
  const fam = FAMILY[sel.family];
  const size = sel.shells.length > 4 ? 0.62 : sel.shells.length > 2 ? 0.8 : 1;
  return (
    <div>
      <div className="grid gap-[2px]" style={{ gridTemplateColumns: "repeat(18, minmax(0, 1fr))" }}>
        {EMPTY.map(([row, col]) => (
          <div key={`${row}-${col}`} className="aspect-square rounded-[3px] bg-[#efe4c8]" style={{ gridRow: row, gridColumn: col }} />
        ))}
        {ELEMENTS.map((e) => (
          <button
            key={e.sym}
            type="button"
            onClick={() => setSel(e)}
            title={e.name}
            className={`flex aspect-square flex-col items-center justify-center rounded-[3px] border font-black leading-none transition-transform hover:scale-110 ${sel.sym === e.sym ? "z-10 scale-110 border-[#701a75] shadow-md" : "border-[#c9b483]"}`}
            style={{ gridRow: e.row, gridColumn: e.col, background: FAMILY[e.family].color }}
          >
            <span className="text-[0.42em] font-bold text-[#475569]">{e.z}</span>
            <span className="text-[0.72em] text-[#1e293b]">{e.sym}</span>
          </button>
        ))}
      </div>
      <div key={sel.sym} className="cg-anim-fade mt-[0.5em] flex items-center gap-[0.6em] rounded-xl border border-[#e9d5ff] bg-[#faf5ff] p-[0.5em]">
        <svg viewBox="-120 -120 240 240" className="h-[7em] w-[7em] shrink-0" aria-hidden="true">
          <g transform={`scale(${size})`}>
            <BohrAtom shells={sel.shells} r0={24} gap={sel.shells.length > 4 ? 14 : 22} protons={sel.z} />
          </g>
        </svg>
        <div className="min-w-0 text-[0.86em] leading-[1.45] text-[#3b0764]">
          <p className="cg-book-title text-[1.15em] font-black">
            {sel.name} <span className="font-mono text-[#a21caf]">({sel.sym})</span>
          </p>
          <p>
            Número atômico <strong>Z = {sel.z}</strong>: {sel.z} prótons e {sel.z} elétrons ({sel.shells.join(", ")} por camada).
          </p>
          <p className="mt-[0.1em]">
            <span className="rounded px-[0.3em] text-[0.9em] font-bold" style={{ background: fam.color }}>
              {fam.name}
            </span>
          </p>
          <p className="mt-[0.2em]">{sel.fact}</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 2, content, bare });

export const chapter2: BookPage[] = [
  page(
    <ChapterOpener
      n={2}
      title="Átomos e a Tabela Periódica"
      goals={["Do que o átomo é feito", "Como os cientistas imaginaram o átomo ao longo da história", "O que são número atômico, símbolos e isótopos", "Como a Tabela Periódica organiza os elementos"]}
    >
      <Fig h={34}>
        <AtomOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="⚛️">Por dentro do átomo</H>
      <P>
        Toda matéria é feita de <T>átomos</T>, tão pequenos que cabem milhões deles na espessura de um fio de cabelo. Mas o átomo tem partes ainda menores:
      </P>
      <Fig n="2.1" caption="O átomo de carbono, com 6 prótons, 6 nêutrons e 6 elétrons." h={26}>
        <AtomPartsArt />
      </Fig>
      <List
        items={[
          <>
            No <T>núcleo</T>, no centro, ficam os <T>prótons</T> (carga positiva) e os <T>nêutrons</T> (sem carga).
          </>,
          <>
            Na <T>eletrosfera</T>, em volta, giram os <T>elétrons</T> (carga negativa), muito mais leves.
          </>,
          <>Num átomo neutro, o número de elétrons é igual ao de prótons: as cargas se equilibram.</>,
        ]}
      />
      <Box kind="sabia">Se o núcleo de um átomo fosse do tamanho de uma formiga no meio de um estádio de futebol, os elétrons estariam girando lá na arquibancada. O átomo é quase todo espaço vazio!</Box>
    </>,
  ),

  page(
    <>
      <H icon="🔭">Os modelos atômicos</H>
      <P>
        Ninguém consegue ver um átomo a olho nu. Por isso os cientistas criaram <T>modelos</T>, que foram sendo melhorados a cada nova descoberta:
      </P>
      <Fig n="2.2" caption="Quatro modelos que mudaram a forma de enxergar o átomo." h={22}>
        <ModelsArt />
      </Fig>
      <List
        items={[
          <>
            <T>Dalton</T>: o átomo seria uma bolinha maciça e indivisível, como uma bola de bilhar.
          </>,
          <>
            <T>Thomson</T>: descobriu o elétron e imaginou uma massa positiva com os elétrons espalhados, como passas num pudim.
          </>,
          <>
            <T>Rutherford</T>: atirou partículas numa folha de ouro e descobriu que o átomo tem um <em>núcleo</em> pequeno e denso, com muito espaço vazio em volta.
          </>,
          <>
            <T>Bohr</T>: os elétrons giram em <em>camadas</em> de energia bem definidas, como andares de um prédio.
          </>,
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🔢">Número atômico, símbolos e isótopos</H>
      <P>
        O que define um elemento químico é o número de prótons, chamado de <T>número atômico (Z)</T>. Todo átomo com 6 prótons é carbono; todo átomo com 8 é oxigênio. Já a{" "}
        <T>massa (A)</T> é a soma dos prótons com os nêutrons: <strong>A = Z + n</strong>.
      </P>
      <P>
        Cada elemento tem um <T>símbolo</T> de uma ou duas letras, sempre com a primeira maiúscula. Alguns vêm do latim:
      </P>
      <Table
        head={["Símbolo", "Elemento", "Vem do latim"]}
        rows={[
          ["Na", "Sódio", "natrium"],
          ["K", "Potássio", "kalium"],
          ["Fe", "Ferro", "ferrum"],
          ["Ag", "Prata", "argentum"],
          ["Au", "Ouro", "aurum"],
        ]}
      />
      <P>
        Átomos do mesmo elemento com números de nêutrons diferentes são <T>isótopos</T>:
      </P>
      <Fig n="2.3" caption="O carbono-14 é usado para descobrir a idade de fósseis." h={18}>
        <IsotopesArt />
      </Fig>
    </>,
  ),

  page(
    <>
      <H icon="🗂️">A Tabela Periódica</H>
      <P>
        Em 1869, o russo <T>Dmitri Mendeleev</T> organizou os elementos numa tabela, em ordem de número atômico. As linhas são os <T>períodos</T> (7) e as colunas são os{" "}
        <T>grupos</T> ou famílias (18): elementos da mesma coluna têm propriedades parecidas. Toque num elemento:
      </P>
      <PeriodicTable />
      <P>
        Os <T>gases nobres</T> (última coluna), como o hélio e o neônio, quase não reagem: a camada de fora deles já está completa. Os metais ficam à esquerda; os ametais, à
        direita.
      </P>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "O átomo tem núcleo (prótons + e nêutrons) e eletrosfera (elétrons −).",
          "Modelos: Dalton (bola), Thomson (pudim de passas), Rutherford (núcleo) e Bohr (camadas).",
          "O número de prótons (Z) define o elemento. Isótopos têm o mesmo Z e nêutrons diferentes.",
          "Na Tabela Periódica, as colunas são os grupos e as linhas, os períodos. Os gases nobres quase não reagem.",
        ]}
      />
      <Glossary
        items={[
          ["Átomo", "A menor parte de um elemento químico."],
          ["Número atômico (Z)", "O número de prótons do átomo."],
          ["Isótopos", "Átomos do mesmo elemento com nêutrons diferentes."],
          ["Grupo (família)", "Uma coluna da Tabela Periódica."],
          ["Período", "Uma linha da Tabela Periódica."],
        ]}
      />
      <Quiz
        items={[
          ["Quais partículas ficam no núcleo do átomo?", "Os prótons e os nêutrons."],
          ["Qual partícula tem carga negativa?", "O elétron."],
          ["Qual é o símbolo do ouro?", "Au, do latim aurum."],
          ["Por que os gases nobres quase não reagem?", "Porque a camada de fora deles (a de valência) já está completa."],
        ]}
      />
    </>,
  ),
];
