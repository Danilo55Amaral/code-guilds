"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { LetterTiles, OpenBook } from "./art";

// ============================================================================
// CAPÍTULO 1 — CLASSES DE PALAVRAS (missão "Língua Portuguesa: Classes de
// Palavras"): as letrinhas de madeira pulando em cima do livro aberto, a
// frase em que cada palavra mostra a sua classe (de tocar), os coletivos
// (a alcateia, o cardume e o enxame) e a linha do tempo dos verbos.
// ============================================================================

const CLASS_COLORS: Record<string, string> = {
  substantivo: "#2563eb",
  artigo: "#64748b",
  adjetivo: "#16a34a",
  numeral: "#0d9488",
  pronome: "#7c3aed",
  verbo: "#dc2626",
  advérbio: "#ea580c",
  preposição: "#a16207",
  conjunção: "#db2777",
  interjeição: "#0891b2",
};

// ---------------------------------------------------------------------------
// Abertura: as letrinhas pulando em cima do livro
// ---------------------------------------------------------------------------

function WordsOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="As letrinhas de madeira da palavra PALAVRAS pulando uma de cada vez em cima de um livro aberto">
      <rect width="460" height="300" fill="#f5f3ff" />
      <LetterTiles x={64} y={60} word="PALAVRAS" s={36} />
      <OpenBook x={230} y={250} s={1.3} />
      {["A", "é", "?", "!"].map((ch, i) => (
        <text key={i} x={70 + i * 100} y="150" textAnchor="middle" fontSize="26" fontWeight="900" fill="#a78bfa" fontFamily="Georgia, serif" className="cg-anim-float" style={{ animationDelay: `${i * 0.4}s` }}>
          {ch}
        </text>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A frase em que cada palavra mostra a classe (de tocar)
// ---------------------------------------------------------------------------

const SENTENCES: [string, keyof typeof CLASS_COLORS][][] = [
  [["A", "artigo"], ["menina", "substantivo"], ["comprou", "verbo"], ["uma", "artigo"], ["bicicleta", "substantivo"], ["azul", "adjetivo"]],
  [["O", "artigo"], ["cachorro", "substantivo"], ["latiu", "verbo"], ["muito", "advérbio"], ["alto", "advérbio"], ["ontem", "advérbio"]],
  [["Ela", "pronome"], ["e", "conjunção"], ["eu", "pronome"], ["gostamos", "verbo"], ["de", "preposição"], ["chocolate", "substantivo"]],
  [["Oba!", "interjeição"], ["Ganhamos", "verbo"], ["dois", "numeral"], ["livros", "substantivo"], ["novos", "adjetivo"]],
];

export function WordPainter() {
  const [s, setS] = useState(0);
  const [shown, setShown] = useState<number[]>([]);
  const sentence = SENTENCES[s];
  const all = shown.length === sentence.length;

  function change(i: number) {
    setS(i);
    setShown([]);
  }

  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <p className="text-center text-[0.78em] font-bold uppercase tracking-wider text-[#8a7146]">Toque em cada palavra</p>
      <div key={s} className="cg-anim-fade mt-[0.3em] flex flex-wrap justify-center gap-[0.35em]">
        {sentence.map(([word, cls], i) => {
          const on = shown.includes(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() => setShown((v) => (v.includes(i) ? v : [...v, i]))}
              className="flex flex-col items-center rounded-lg border-2 px-[0.5em] py-[0.15em] transition-colors"
              style={{ borderColor: on ? CLASS_COLORS[cls] : "#d9c79d", background: on ? `${CLASS_COLORS[cls]}18` : "#fff" }}
            >
              <span className="cg-book-title text-[1.1em] font-black text-[#2b2113]">{word}</span>
              <span className="text-[0.68em] font-bold" style={{ color: on ? CLASS_COLORS[cls] : "transparent" }}>
                {cls}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-[0.45em] flex flex-wrap items-center justify-center gap-[0.3em] text-[0.8em]">
        {SENTENCES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => change(i)}
            className={`rounded-full border px-[0.6em] py-[0.05em] font-bold ${s === i ? "border-[#7c3aed] bg-[#7c3aed] text-white" : "border-[#d9c79d] bg-white"}`}
          >
            Frase {i + 1}
          </button>
        ))}
        <button type="button" onClick={() => setShown(sentence.map((_, i) => i))} disabled={all} className="rounded-full border border-[#d9c79d] bg-white px-[0.6em] py-[0.05em] font-bold disabled:opacity-40">
          Mostrar todas
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Os coletivos
// ---------------------------------------------------------------------------

function CollectivesArt() {
  return (
    <Art viewBox="0 0 560 210" label="Três coletivos: uma alcateia de lobos uivando para a lua, um cardume de peixes nadando juntos e um enxame de abelhas em volta da colmeia">
      <rect width="560" height="210" rx="14" fill="#f8fafc" />
      {/* a alcateia */}
      <g>
        <rect x="10" y="10" width="170" height="190" rx="12" fill="#1e1b4b" />
        <circle cx="140" cy="44" r="18" fill="#fef9c3" />
        {[0, 1, 2].map((k) => (
          <g key={k} transform={`translate(${50 + k * 40} ${150 - (k % 2) * 10})`}>
            <path d="M-14 10 L-10 -8 L-4 -14 L0 -26 L6 -14 L14 -10 L16 10 Z" fill="#64748b" />
            <path d="M0 -26 L-4 -34 L4 -28 Z" fill="#64748b">
              <animateTransform attributeName="transform" type="rotate" values="0 0 -26;-12 0 -26;0 0 -26" dur="2s" begin={`${-k * 0.5}s`} repeatCount="indefinite" />
            </path>
          </g>
        ))}
        <text x="95" y="190" textAnchor="middle" fontSize="14" fontWeight="900" fill="#e0e7ff" fontFamily="Georgia, serif">
          alcateia (lobos)
        </text>
      </g>
      {/* o cardume */}
      <g>
        <rect x="195" y="10" width="170" height="190" rx="12" fill="#0284c7" />
        <g>
          <animateTransform attributeName="transform" type="translate" values="-10 0;14 -6;-10 0" dur="3s" repeatCount="indefinite" />
          {Array.from({ length: 9 }, (_, i) => (
            <g key={i} transform={`translate(${230 + (i % 3) * 36 + (Math.floor(i / 3) % 2) * 14} ${60 + Math.floor(i / 3) * 34})`}>
              <ellipse rx="12" ry="6" fill="#fde047" />
              <path d="M10 0 L20 -6 L20 6 Z" fill="#fde047" />
              <circle cx="-6" cy="-1" r="1.5" fill="#1e293b" />
            </g>
          ))}
        </g>
        <text x="280" y="190" textAnchor="middle" fontSize="14" fontWeight="900" fill="#e0f2fe" fontFamily="Georgia, serif">
          cardume (peixes)
        </text>
      </g>
      {/* o enxame */}
      <g>
        <rect x="380" y="10" width="170" height="190" rx="12" fill="#fef3c7" />
        <path d="M465 70 Q440 70 440 100 Q440 140 465 140 Q490 140 490 100 Q490 70 465 70 Z" fill="#f59e0b" stroke="#92400e" strokeWidth="2" />
        {[84, 100, 116, 132].map((y) => (
          <path key={y} d={`M444 ${y} L486 ${y}`} stroke="#92400e" strokeWidth="1.5" />
        ))}
        {[0, 1, 2, 3, 4].map((k) => (
          <g key={k}>
            <animateMotion path="M465 105 m-55 0 a55 45 0 1 0 110 0 a55 45 0 1 0 -110 0" dur={`${3 + k * 0.4}s`} begin={`${-k * 0.7}s`} repeatCount="indefinite" />
            <ellipse rx="5" ry="3.5" fill="#facc15" stroke="#1e293b" strokeWidth="1" />
          </g>
        ))}
        <text x="465" y="190" textAnchor="middle" fontSize="14" fontWeight="900" fill="#78350f" fontFamily="Georgia, serif">
          enxame (abelhas)
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os tempos do verbo
// ---------------------------------------------------------------------------

function VerbTimeArt() {
  const times = [
    { when: "ontem", verb: "fomos", name: "pretérito", color: "#64748b" },
    { when: "hoje", verb: "vamos", name: "presente", color: "#dc2626" },
    { when: "amanhã", verb: "iremos", name: "futuro", color: "#2563eb" },
  ];
  return (
    <Art viewBox="0 0 560 190" label="A linha do tempo do verbo ir: ontem nós fomos (pretérito), hoje nós vamos (presente) e amanhã nós iremos (futuro)">
      <rect width="560" height="190" rx="14" fill="#fff7ed" />
      <path d="M50 100 L510 100" stroke="#fdba74" strokeWidth="6" strokeLinecap="round" />
      <path d="M498 90 L516 100 L498 110 Z" fill="#fb923c" />
      {/* o pontinho andando no tempo */}
      <circle cy="100" r="8" fill="#f97316">
        <animate attributeName="cx" values="90;280;470;470" keyTimes="0;0.4;0.8;1" dur="5s" repeatCount="indefinite" />
      </circle>
      {times.map((t, i) => (
        <g key={t.name} transform={`translate(${90 + i * 190} 100)`} fontFamily="Georgia, serif" textAnchor="middle">
          <text y="-46" fontSize="13" fontWeight="700" fill="#7c2d12">
            {t.when}
          </text>
          <text y="-20" fontSize="22" fontWeight="900" fill={t.color}>
            nós {t.verb}
          </text>
          <text y="38" fontSize="13" fontWeight="900" fill={t.color}>
            {t.name}
          </text>
        </g>
      ))}
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
      title="Classes de Palavras"
      goals={["Quais são as 10 classes de palavras", "Como reconhecer cada classe numa frase", "Os tipos de substantivo e os coletivos", "Os verbos e os tempos verbais"]}
    >
      <Fig h={34}>
        <WordsOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🔤">As 10 classes de palavras</H>
      <P>
        Cada palavra da língua tem uma função. A gramática separa as palavras em <T>10 classes</T>. Algumas mudam de forma (gênero, número, tempo):
        são as <T>variáveis</T>. Outras nunca mudam: são as <T>invariáveis</T>.
      </P>
      <Table
        head={["Classe", "O que faz", "Exemplo"]}
        rows={[
          ["Substantivo", "Dá nome aos seres", "cachorro, Brasil, saudade"],
          ["Artigo", "Acompanha o substantivo", "o, a, um, uma"],
          ["Adjetivo", "Dá uma característica", "azul, feliz"],
          ["Numeral", "Indica quantidade ou ordem", "dois, primeiro"],
          ["Pronome", "Substitui ou acompanha o nome", "eu, ela, meu"],
          ["Verbo", "Ação, estado ou fenômeno", "correr, ser, chover"],
          ["Advérbio", "Modifica o verbo ou o adjetivo", "muito, ontem, bem"],
          ["Preposição", "Liga palavras", "de, em, para"],
          ["Conjunção", "Liga orações", "e, mas, porque"],
          ["Interjeição", "Expressa emoção", "Oba! Ai! Uau!"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🎨">Cada palavra no seu lugar</H>
      <P>Agora é com você: toque em cada palavra das frases para descobrir a classe dela.</P>
      <WordPainter />
      <Box kind="mago" title="Macete do Mago">
        Para achar o <strong>adjetivo</strong>, pergunte “como é?” ao substantivo: a bicicleta é <em>azul</em>. Para achar o <strong>advérbio</strong>, pergunte “como?”,
        “quando?” ou “onde?” ao verbo: latiu <em>ontem</em>.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🐺">Os substantivos</H>
      <P>
        Os substantivos podem ser <T>próprios</T> (nomeiam um ser específico e começam com maiúscula: Maria, Brasil, Amazonas) ou <T>comuns</T> (menina, país, rio). Os{" "}
        <T>concretos</T> nomeiam seres que existem por si (mesa, fada); os <T>abstratos</T>, sentimentos e estados (saudade, coragem, alegria). E os{" "}
        <T>coletivos</T> nomeiam um grupo:
      </P>
      <Fig n="1.1" caption="Alcateia, cardume e enxame: três coletivos." h={22}>
        <CollectivesArt />
      </Fig>
      <P>
        Outros coletivos: <T>rebanho</T> (gado ou ovelhas), <T>biblioteca</T> (livros), <T>arquipélago</T> (ilhas), <T>constelação</T> (estrelas).
      </P>
    </>,
  ),

  page(
    <>
      <H icon="🏃">Os verbos</H>
      <P>
        O <T>verbo</T> indica ação (correr), estado (estar) ou fenômeno da natureza (chover). Na forma do dicionário, o <T>infinitivo</T>, ele termina em <T>-ar</T>,{" "}
        <T>-er</T> ou <T>-ir</T>. O verbo também muda conforme o <T>tempo</T>:
      </P>
      <Fig n="1.2" caption="O mesmo verbo nos três tempos." h={19}>
        <VerbTimeArt />
      </Fig>
      <Table
        head={["Pessoa", "Singular", "Plural"]}
        rows={[
          ["1ª (quem fala)", "eu", "nós"],
          ["2ª (com quem se fala)", "tu", "vós"],
          ["3ª (de quem se fala)", "ele, ela", "eles, elas"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "São 10 classes: substantivo, artigo, adjetivo, numeral, pronome, verbo, advérbio, preposição, conjunção e interjeição.",
          "Substantivos: próprios ou comuns, concretos ou abstratos, e os coletivos (alcateia, cardume, enxame).",
          "O adjetivo caracteriza o substantivo; o advérbio modifica o verbo, o adjetivo ou outro advérbio.",
          "O verbo indica ação, estado ou fenômeno; no infinitivo termina em -ar, -er ou -ir.",
          "Os tempos verbais: pretérito (passado), presente e futuro.",
        ]}
      />
      <Glossary
        items={[
          ["Substantivo próprio", "Nome de um ser específico, com maiúscula."],
          ["Substantivo abstrato", "Nomeia sentimentos e estados."],
          ["Coletivo", "Substantivo que nomeia um grupo."],
          ["Infinitivo", "A forma do verbo terminada em -ar, -er ou -ir."],
          ["Pretérito", "O tempo passado do verbo."],
        ]}
      />
      <Quiz
        items={[
          ["Qual é o substantivo em “O cachorro latiu alto”?", "Cachorro."],
          ["Qual é o coletivo de lobos?", "Alcateia."],
          ["“Saudade” e “coragem” são substantivos de que tipo?", "Abstratos."],
          ["Em “Ontem nós fomos ao parque”, em que tempo está o verbo?", "No pretérito (passado)."],
        ]}
      />
    </>,
  ),
];
