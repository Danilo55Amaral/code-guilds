"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Balloon, ChoiceGame } from "./art";

// ============================================================================
// CAPÍTULO 2 — O SENTIDO DAS PALAVRAS (missão "Língua Portuguesa: O Sentido
// das Palavras"): os balões trocando de palavra (sinônimos e antônimos), as
// cartas dos homônimos e parônimos (de virar), a casinha que vira casa e
// casarão e o jogo do sentido literal ou figurado.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: os balões dos sinônimos e dos antônimos
// ---------------------------------------------------------------------------

function MeaningOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Dois balões de fala: num, “feliz” e “contente” se revezam, que querem dizer a mesma coisa; no outro, “dia” e “noite”, que são opostos, com o céu mudando de cor">
      <rect width="460" height="150" fill="#ecfdf5" />
      {/* o céu dos antônimos vira noite junto com a palavra */}
      <rect y="150" width="460" height="150" fill="#fef3c7">
        <animate attributeName="fill" values="#fef3c7;#fef3c7;#1e1b4b;#1e1b4b;#fef3c7" keyTimes="0;0.4;0.5;0.9;1" dur="6s" repeatCount="indefinite" />
      </rect>
      {/* sinônimos: feliz = contente */}
      <g>
        <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.4;0.5;0.9;1" dur="6s" repeatCount="indefinite" />
        <Balloon x={60} y={40} w={150} h={56} text="feliz" color="#dcfce7" />
      </g>
      <g opacity="0">
        <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.4;0.5;0.9;1" dur="6s" repeatCount="indefinite" />
        <Balloon x={60} y={40} w={150} h={56} text="contente" color="#dcfce7" />
      </g>
      <text x="300" y="76" fontSize="16" fontWeight="900" fill="#16a34a" fontFamily="Georgia, serif">
        = sinônimos
      </text>
      {/* antônimos: dia × noite */}
      <g>
        <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.4;0.5;0.9;1" dur="6s" repeatCount="indefinite" />
        <Balloon x={60} y={190} w={150} h={56} text="dia ☀️" color="#fef9c3" />
      </g>
      <g opacity="0">
        <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.4;0.5;0.9;1" dur="6s" repeatCount="indefinite" />
        <Balloon x={60} y={190} w={150} h={56} text="noite 🌙" color="#c7d2fe" />
      </g>
      <text x="300" y="226" fontSize="16" fontWeight="900" fill="#dc2626" fontFamily="Georgia, serif">
        <animate attributeName="fill" values="#dc2626;#dc2626;#fca5a5;#fca5a5;#dc2626" keyTimes="0;0.4;0.5;0.9;1" dur="6s" repeatCount="indefinite" />
        × antônimos
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As cartas dos homônimos e parônimos (de virar)
// ---------------------------------------------------------------------------

const PAIRS = [
  { a: "cela", am: "o quarto da prisão", b: "sela", bm: "o assento do cavalo", kind: "homônimos" },
  { a: "concerto", am: "a apresentação de música", b: "conserto", bm: "o reparo de algo quebrado", kind: "homônimos" },
  { a: "comprimento", am: "a medida, o tamanho", b: "cumprimento", bm: "a saudação, o “olá”", kind: "parônimos" },
  { a: "descrição", am: "o ato de descrever", b: "discrição", bm: "ser discreto, reservado", kind: "parônimos" },
];

export function PairCards() {
  const [open, setOpen] = useState<string[]>([]);
  const toggle = (k: string) => setOpen((v) => (v.includes(k) ? v.filter((x) => x !== k) : [...v, k]));
  return (
    <div className="grid grid-cols-2 gap-[0.4em]">
      {PAIRS.map((p) =>
        (["a", "b"] as const).map((side) => {
          const key = `${p.a}-${side}`;
          const word = side === "a" ? p.a : p.b;
          const meaning = side === "a" ? p.am : p.bm;
          const on = open.includes(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key)}
              className={`min-h-[3.4em] rounded-xl border-2 px-[0.4em] py-[0.25em] text-center transition-colors ${on ? "border-[#7c3aed] bg-[#f5f3ff]" : "border-[#d9c79d] bg-[#fffaf0] hover:bg-[#fef3c7]"}`}
            >
              <span className="cg-book-title block text-[1.05em] font-black text-[#3b0764]">{word}</span>
              <span key={String(on)} className={`block text-[0.78em] ${on ? "cg-anim-fade text-[#5b21b6]" : "text-[#a8a29e]"}`}>
                {on ? meaning : `toque · ${p.kind}`}
              </span>
            </button>
          );
        }),
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// A casinha, a casa e o casarão
// ---------------------------------------------------------------------------

function HouseDegreeArt() {
  const house = (x: number, s: number, label: string, color: string) => (
    <g key={label} transform={`translate(${x} 170)`}>
      <g className="cg-anim-pop">
        <g transform={`scale(${s})`}>
          <rect x="-30" y="-50" width="60" height="50" fill={color} stroke="#7c2d12" strokeWidth="2" />
          <path d="M-38 -50 L0 -80 L38 -50 Z" fill="#b91c1c" stroke="#7c2d12" strokeWidth="2" />
          <rect x="-8" y="-24" width="16" height="24" fill="#78350f" />
          <rect x="-24" y="-42" width="12" height="12" fill="#bae6fd" />
          <rect x="12" y="-42" width="12" height="12" fill="#bae6fd" />
        </g>
      </g>
      <text y="26" textAnchor="middle" fontSize="15" fontWeight="900" fill="#7c2d12" fontFamily="Georgia, serif">
        {label}
      </text>
    </g>
  );
  return (
    <Art viewBox="0 0 560 210" label="Três casas de tamanhos diferentes: a casinha (diminutivo), a casa e o casarão (aumentativo)">
      <rect width="560" height="210" rx="14" fill="#fff7ed" />
      <rect y="170" width="560" height="40" fill="#bbf7d0" />
      {house(100, 0.6, "casinha", "#fde68a")}
      {house(270, 1, "casa", "#fecaca")}
      {house(450, 1.55, "casarão", "#bfdbfe")}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O jogo do sentido literal ou figurado
// ---------------------------------------------------------------------------

const MEANING_GAME = [
  { prompt: "“O gato subiu no telhado.”", options: ["Sentido literal (denotativo)", "Sentido figurado (conotativo)"], answer: 0, explain: "É um gato de verdade subindo no telhado: sentido do dicionário." },
  { prompt: "“Ele tem um coração de pedra.”", options: ["Sentido literal (denotativo)", "Sentido figurado (conotativo)"], answer: 1, explain: "Ninguém tem um coração feito de pedra: quer dizer que ele é insensível." },
  { prompt: "“Estou morrendo de fome!”", options: ["Sentido literal (denotativo)", "Sentido figurado (conotativo)"], answer: 1, explain: "É um exagero para dizer que a fome é grande." },
  { prompt: "“A pedra rolou da montanha.”", options: ["Sentido literal (denotativo)", "Sentido figurado (conotativo)"], answer: 0, explain: "Aqui a pedra é pedra mesmo." },
];

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 2, content, bare });

export const chapter2: BookPage[] = [
  page(
    <ChapterOpener
      n={2}
      title="O Sentido das Palavras"
      goals={["O que são sinônimos e antônimos", "A diferença entre homônimos e parônimos", "Como as palavras mudam de gênero, número e grau", "O sentido literal e o sentido figurado"]}
    >
      <Fig h={34}>
        <MeaningOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🔁">Sinônimos e antônimos</H>
      <P>
        <T>Sinônimos</T> são palavras de sentido parecido: feliz e contente, corajoso e valente. <T>Antônimos</T> têm sentido oposto: corajoso e medroso, dia e noite.
        Usar sinônimos deixa o texto mais rico, sem repetir sempre a mesma palavra.
      </P>
      <Table
        head={["Palavra", "Sinônimo", "Antônimo"]}
        rows={[
          ["feliz", "contente", "triste"],
          ["corajoso", "valente", "medroso"],
          ["rápido", "veloz", "lento"],
          ["bonito", "belo", "feio"],
        ]}
      />
      <Box kind="experimente">Escolha uma palavra que você usa muito e procure três sinônimos dela num dicionário.</Box>
    </>,
  ),

  page(
    <>
      <H icon="👯">Homônimos e parônimos</H>
      <P>
        <T>Homônimos</T> têm a mesma pronúncia (ou a mesma grafia) e sentidos diferentes, como <em>cela</em> e <em>sela</em>. <T>Parônimos</T> são parecidos, mas não
        iguais, como <em>comprimento</em> e <em>cumprimento</em>. Toque nas cartas:
      </P>
      <PairCards />
      <Box kind="atencao">Esses pares confundem muita gente na escrita. Na dúvida, o contexto da frase mostra qual é o certo.</Box>
    </>,
  ),

  page(
    <>
      <H icon="🏠">Gênero, número e grau</H>
      <P>
        Muitas palavras mudam de forma. No <T>gênero</T>: ator vira atriz; imperador, imperatriz. No <T>número</T>: cidadão vira cidadãos, mas pão vira pães e leão
        vira leões. E no <T>grau</T>, ficam menores ou maiores:
      </P>
      <Fig n="2.1" caption="Diminutivo e aumentativo de casa." h={21}>
        <HouseDegreeArt />
      </Fig>
      <Box kind="sabia">
        <strong>Casebre</strong> também é uma casa pequena, mas pobre. E o diminutivo às vezes mostra carinho: “minha casinha”.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🔍">Literal ou figurado?</H>
      <P>
        O sentido <T>denotativo</T> é o literal, o do dicionário. O sentido <T>conotativo</T> é o figurado, que depende do contexto. Descubra:
      </P>
      <ChoiceGame items={MEANING_GAME} color="#7c3aed" />
      <P>Os poemas, as músicas e as propagandas usam muito o sentido figurado. As notícias e os manuais preferem o literal.</P>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Sinônimos têm sentido parecido; antônimos, sentido oposto.",
          "Homônimos: mesma pronúncia ou grafia e sentidos diferentes (cela e sela).",
          "Parônimos: palavras parecidas com sentidos diferentes (comprimento e cumprimento).",
          "As palavras variam em gênero (ator, atriz), número (cidadãos, pães) e grau (casinha, casarão).",
          "Denotativo é o sentido literal; conotativo é o figurado.",
        ]}
      />
      <Glossary
        items={[
          ["Sinônimo", "Palavra de sentido parecido com outra."],
          ["Antônimo", "Palavra de sentido oposto."],
          ["Homônimo", "Mesmo som ou escrita, sentido diferente."],
          ["Parônimo", "Palavra parecida, mas com sentido diferente."],
          ["Conotativo", "Sentido figurado."],
        ]}
      />
      <Quiz
        items={[
          ["Qual é o antônimo de “corajoso”?", "Medroso."],
          ["“Cela” e “sela” são o quê?", "Homônimos."],
          ["Qual é o plural de “cidadão”?", "Cidadãos."],
          ["O que quer dizer “coração de pedra”?", "Que a pessoa é insensível (sentido figurado)."],
        ]}
      />
    </>,
  ),
];
