"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Kid } from "../ods/art";
import { ChoiceGame } from "../portugues/art";
import { ENG, ENG_DARK, Say } from "./art";

// ============================================================================
// CAPÍTULO 6 — PRESENT CONTINUOUS AND PREPOSITIONS (missão "Inglês: Present
// Continuous and Prepositions"): o parque com todo mundo fazendo alguma coisa
// agora, o jogo do -ing, o gato das preposições de lugar (de tocar) e os
// cartões do at, on e in.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o parque, agora
// ---------------------------------------------------------------------------

function ParkOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Um parque: uma criança correndo, uma bola quicando e uma pipa voando, com a frase Look! The children are playing in the park">
      <rect width="460" height="300" fill="#e0f2fe" />
      <rect y="210" width="460" height="90" fill="#86efac" />
      <circle cx="400" cy="50" r="26" fill="#fde047" />
      {/* a pipa */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;12 -10;0 0" dur="3s" repeatCount="indefinite" />
        <path d="M330 70 L352 100 L330 130 L308 100 Z" fill={ENG} stroke="#7f1d1d" strokeWidth="2" />
        <path d="M330 130 Q320 150 335 165 Q350 180 340 200" stroke="#7f1d1d" strokeWidth="1.5" fill="none" />
        <path d="M330 130 L300 230" stroke="#94a3b8" strokeWidth="1" />
      </g>
      <Kid x={300} y={245} s={1.5} shirt="#2563eb" skin="#8d5524" hair="#1c1917" />
      {/* a criança correndo */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="-60 0;520 0" dur="7s" repeatCount="indefinite" />
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0;0 -6;0 0" dur="0.4s" repeatCount="indefinite" />
          <Kid x={0} y={255} s={1.5} shirt={ENG} />
        </g>
      </g>
      {/* a bola quicando */}
      <circle cx="150" cy="200" r="14" fill="#fff" stroke="#1e293b" strokeWidth="2">
        <animate attributeName="cy" values="160;235;160" dur="1.1s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 1 1;0 0 0.5 1" />
      </circle>
      <text x="200" y="40" textAnchor="middle" fontSize="18" fontWeight="900" fill={ENG_DARK} fontFamily="Georgia, serif">
        Look! The children are playing.
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O jogo do -ing
// ---------------------------------------------------------------------------

const ING_GAME = [
  { prompt: "run → ?", options: ["runing", "running", "runnning"], answer: 1, explain: "Consoante-vogal-consoante dobra a última letra: run → running, swim → swimming." },
  { prompt: "write → ?", options: ["writeing", "writting", "writing"], answer: 2, explain: "Verbos terminados em -e perdem o e: write → writing, dance → dancing." },
  { prompt: "play → ?", options: ["playing", "plaing", "playying"], answer: 0, explain: "A maioria só ganha -ing: play → playing, read → reading." },
  { prompt: "“Look! The children ___ in the park.”", options: ["play", "are playing", "is playing"], answer: 1, explain: "The children = they: are + playing." },
  { prompt: "“What ___ you doing?”", options: ["are", "is", "do"], answer: 0, explain: "What are you doing? = O que você está fazendo?" },
];

// ---------------------------------------------------------------------------
// O gato das preposições de lugar (de tocar)
// ---------------------------------------------------------------------------

// onde o gato fica (os pés dele) e o fim da frase, pra cada preposição
const PLACES: { en: string; pt: string; x: number; y: number; obj: string }[] = [
  { en: "on", pt: "em cima", x: 128, y: 112, obj: "the table" },
  { en: "under", pt: "embaixo", x: 128, y: 176, obj: "the table" },
  { en: "in", pt: "dentro", x: 282, y: 150, obj: "the box" },
  { en: "next to", pt: "ao lado", x: 50, y: 176, obj: "the table" },
  { en: "behind", pt: "atrás", x: 140, y: 142, obj: "the table" },
  { en: "in front of", pt: "na frente", x: 120, y: 189, obj: "the table" },
  { en: "between", pt: "entre", x: 222, y: 176, obj: "the table and the box" },
];

function Cat() {
  return (
    <g>
      <ellipse cx="0" cy="-14" rx="20" ry="13" fill="#f59e0b" stroke="#92400e" strokeWidth="1.5" />
      <circle cx="18" cy="-28" r="11" fill="#f59e0b" stroke="#92400e" strokeWidth="1.5" />
      <path d="M11 -36 L13 -46 L19 -38 Z M19 -38 L25 -46 L26 -34 Z" fill="#f59e0b" stroke="#92400e" strokeWidth="1" />
      <circle cx="15" cy="-29" r="1.6" fill="#1e293b" />
      <circle cx="22" cy="-29" r="1.6" fill="#1e293b" />
      <path d="M-20 -16 Q-32 -28 -24 -38" stroke="#f59e0b" strokeWidth="4" fill="none" strokeLinecap="round" />
    </g>
  );
}

export function PrepositionCat() {
  const [sel, setSel] = useState(0);
  const p = PLACES[sel];
  const sentence = `The cat is ${p.en} ${p.obj}.`;
  const cat = (
    <g style={{ transform: `translate(${p.x}px, ${p.y}px)`, transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
      <Cat />
    </g>
  );
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.5em]">
      <div className="flex flex-wrap justify-center gap-[0.25em]">
        {PLACES.map((pl, i) => (
          <button
            key={pl.en}
            type="button"
            onClick={() => setSel(i)}
            className="rounded-full border px-[0.6em] py-[0.05em] text-[0.8em] font-bold"
            style={sel === i ? { background: ENG, borderColor: ENG, color: "#fff" } : { background: "#fff", borderColor: "#fecaca", color: ENG }}
          >
            {pl.en}
          </button>
        ))}
      </div>
      <svg viewBox="10 60 320 136" className="mx-auto mt-[0.2em] block h-[7em] w-full" aria-label={sentence}>
        <rect x="10" y="176" width="320" height="20" fill="#e7e5e4" />
        {/* atrás da mesa: o gato vem antes dela */}
        {p.en === "behind" && cat}
        {/* a mesa */}
        <rect x="70" y="112" width="122" height="9" rx="2" fill="#92400e" />
        <rect x="78" y="121" width="8" height="55" fill="#78350f" />
        <rect x="176" y="121" width="8" height="55" fill="#78350f" />
        {/* a caixa: o fundo, o gato se estiver dentro e a frente */}
        <rect x="254" y="122" width="62" height="54" fill="#b45309" stroke="#78350f" strokeWidth="2" />
        {p.en === "in" && cat}
        <rect x="250" y="134" width="70" height="42" fill="#d97706" stroke="#78350f" strokeWidth="2" />
        <text x="285" y="161" textAnchor="middle" fontSize="12" fontWeight="900" fill="#78350f" fontFamily="Georgia, serif">
          BOX
        </text>
        {p.en !== "behind" && p.en !== "in" && cat}
      </svg>
      <p key={sel} className="cg-anim-fade text-center text-[1.1em] font-black" style={{ color: ENG_DARK }}>
        {sentence} <Say text={sentence} /> <span className="text-[0.72em] font-bold text-[#3b2a14]">({p.pt})</span>
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Os cartões do at, on e in
// ---------------------------------------------------------------------------

function TimePrepArt() {
  const cards = [
    { word: "AT", ex: "at 8 o'clock", sub: "horas" },
    { word: "ON", ex: "on Monday", sub: "dias e datas" },
    { word: "IN", ex: "in July", sub: "meses, anos, estações" },
  ];
  return (
    <Art viewBox="0 0 560 170" label="Três cartões: at para horas (at 8 o'clock), on para dias (on Monday) e in para meses e anos (in July); cada um acende por vez">
      <rect width="560" height="170" rx="14" fill="#eff6ff" />
      {cards.map((c, i) => (
        <g key={c.word} transform={`translate(${30 + i * 175} 18)`}>
          <rect width="150" height="134" rx="12" fill="#fff" stroke={ENG_DARK} strokeWidth="3">
            <animate attributeName="fill" values="#fff;#fee2e2;#fff;#fff" keyTimes={`0;${(0.1 + i * 0.3).toFixed(1)};${(0.25 + i * 0.3).toFixed(2)};1`} dur="6s" repeatCount="indefinite" />
          </rect>
          <text x="75" y="48" textAnchor="middle" fontSize="34" fontWeight="900" fill={ENG} fontFamily="Georgia, serif">
            {c.word}
          </text>
          {i === 0 && (
            <g transform="translate(75 82)">
              <circle r="16" fill="#fff" stroke={ENG_DARK} strokeWidth="2.5" />
              <line x1="0" y1="0" x2="0" y2="-11" stroke={ENG_DARK} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="0" y1="0" x2="-9" y2="5" stroke={ENG_DARK} strokeWidth="2.5" strokeLinecap="round" />
            </g>
          )}
          {i > 0 && (
            <g transform="translate(57 66)">
              <rect width="36" height="32" rx="3" fill="#fff" stroke={ENG_DARK} strokeWidth="2" />
              <rect width="36" height="9" rx="2" fill={ENG} />
              <text x="18" y="26" textAnchor="middle" fontSize="13" fontWeight="900" fill={ENG_DARK} fontFamily="Georgia, serif">
                {i === 1 ? "MON" : "JUL"}
              </text>
            </g>
          )}
          <text x="75" y="116" textAnchor="middle" fontSize="15" fontWeight="900" fill={ENG_DARK} fontFamily="Georgia, serif">
            {c.ex}
          </text>
          <text x="75" y="131" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569" fontFamily="Georgia, serif">
            {c.sub}
          </text>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 6, content, bare });

export const chapter6: BookPage[] = [
  page(
    <ChapterOpener
      n={6}
      title="Present Continuous and Prepositions"
      goals={["O present continuous: o que está acontecendo agora", "Como escrever o -ing", "As preposições de lugar (in, on, under…)", "At, on e in com as horas, os dias e os meses"]}
    >
      <Fig h={34}>
        <ParkOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🏃">O present continuous</H>
      <P>
        O <T>present continuous</T> fala do que está acontecendo <T>agora</T>. Ele é formado pelo <T>verbo to be + verbo com -ing</T>.
      </P>
      <Table
        head={["Sujeito", "To be", "Verbo + ing"]}
        rows={[
          ["I", "am", "reading a book."],
          ["She", "is", "playing the guitar."],
          ["They", "are", "running in the park."],
        ]}
      />
      <Box kind="lembre">
        A pergunta mais comum: <strong>What are you doing?</strong> <Say text="What are you doing?" /> (o que você está fazendo?). Palavras como <em>now</em> e{" "}
        <em>Look!</em> avisam que é agora.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="✍️">Escrevendo o -ing</H>
      <P>
        Quase todo verbo só ganha <T>-ing</T>. Mas os terminados em <T>-e</T> perdem o e (write → writing), e os curtos terminados em <T>consoante-vogal-consoante</T>{" "}
        dobram a última letra (run → running).
      </P>
      <ChoiceGame items={ING_GAME} color={ENG} title="Qual é o certo?" />
    </>,
  ),

  page(
    <>
      <H icon="📦">Onde está o gato?</H>
      <P>As <T>preposições de lugar</T> dizem onde as coisas estão. Toque nos botões e veja o gato mudar de lugar:</P>
      <PrepositionCat />
      <Box kind="atencao">
        <strong>On</strong> é em cima, encostado (on the desk). <strong>In</strong> é dentro (in the box). E <strong>between</strong> precisa de duas coisas: entre a
        escola e a padaria.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="📅">At, on, in: o tempo</H>
      <P>As mesmas preposições também falam de tempo, cada uma com o seu tipo:</P>
      <Fig n="6.1" caption="At pras horas, on pros dias e in pros meses e anos." h={19}>
        <TimePrepArt />
      </Fig>
      <Table
        head={["Exemplo", "Tradução"]}
        rows={[
          ["The class starts at 8 o'clock.", "A aula começa às 8 horas."],
          ["My birthday is in July.", "Meu aniversário é em julho."],
          ["I play soccer on Saturdays.", "Eu jogo futebol aos sábados."],
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Present continuous = to be + verbo com -ing: I am reading.",
          "Write → writing (perde o e); run → running (dobra a letra).",
          "What are you doing? = O que você está fazendo?",
          "In (dentro), on (em cima), under (embaixo), next to (ao lado), behind (atrás), between (entre).",
          "At com horas, on com dias e datas, in com meses, anos e estações.",
        ]}
      />
      <Glossary
        items={[
          ["Now", "Agora."],
          ["Under", "Embaixo."],
          ["Behind", "Atrás."],
          ["Between", "Entre."],
          ["Next to", "Ao lado de."],
        ]}
      />
      <Quiz
        items={[
          ["Como se forma o present continuous?", "Verbo to be + verbo com -ing."],
          ["Qual é a forma -ing de “run”?", "running."],
          ["Complete: “My birthday is ___ July.”", "in."],
          ["Complete: “The class starts ___ 8 o'clock.”", "at."],
        ]}
      />
    </>,
  ),
];
