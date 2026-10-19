"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Robed } from "./art";

// ============================================================================
// CAPÍTULO 5 — ROMA ANTIGA (missão "História: Grécia e Roma Antigas", a
// parte de Roma): o Coliseu ao pôr do sol, a loba com os gêmeos Rômulo e
// Remo, o aqueduto levando água, o conversor de números romanos (de mexer)
// e o Império dividido em dois.
// ============================================================================

/** O Coliseu (o meio da base em x, y). */
function Colosseum({ x, y, w = 260 }: { x: number; y: number; w?: number }) {
  const h = w * 0.42;
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M${-w / 2} 0 L${-w / 2} ${-h} Q0 ${-h - 18} ${w / 2} ${-h * 0.75} L${w / 2} 0 Z`} fill="#d6a77a" stroke="#92400e" strokeWidth="2" />
      {[0, 1, 2].map((row) =>
        Array.from({ length: 9 }, (_, i) => {
          const ax = -w / 2 + 14 + i * ((w - 28) / 9);
          const ay = -h + 10 + row * (h / 3.2);
          return <path key={`${row}-${i}`} d={`M${ax} ${ay + 22} L${ax} ${ay + 8} Q${ax + 9} ${ay} ${ax + 18} ${ay + 8} L${ax + 18} ${ay + 22} Z`} fill="#78350f" opacity="0.75" />;
        }),
      )}
    </g>
  );
}

// ---------------------------------------------------------------------------
// Abertura: o Coliseu ao pôr do sol
// ---------------------------------------------------------------------------

function ColosseumOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="O Coliseu de Roma ao pôr do sol, com uma bandeira vermelha com a águia romana tremulando">
      <defs>
        <linearGradient id="roma-ceu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fb923c" />
          <stop offset="1" stopColor="#fde68a" />
        </linearGradient>
      </defs>
      <rect width="460" height="300" fill="url(#roma-ceu)" />
      <circle cx="350" cy="160" r="40" fill="#fde047" opacity="0.9" />
      <rect y="240" width="460" height="60" fill="#a16207" />
      <Colosseum x={220} y={244} w={300} />
      {/* a bandeira com a águia */}
      <g transform="translate(400 240)">
        <path d="M0 0 L0 -130" stroke="#78350f" strokeWidth="4" />
        <path fill="#b91c1c">
          <animate attributeName="d" values="M0 -128 Q20 -122 40 -128 L40 -90 Q20 -84 0 -90 Z;M0 -128 Q20 -134 40 -126 L40 -88 Q20 -96 0 -90 Z;M0 -128 Q20 -122 40 -128 L40 -90 Q20 -84 0 -90 Z" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M12 -110 L20 -118 L28 -110 L20 -100 Z" fill="#fbbf24" />
        <text x="20" y="-94" textAnchor="middle" fontSize="7" fontWeight="900" fill="#fbbf24" fontFamily="Georgia, serif">
          SPQR
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A loba com Rômulo e Remo
// ---------------------------------------------------------------------------

function WolfArt() {
  return (
    <Art viewBox="0 0 560 200" label="A lenda da fundação de Roma: uma loba amamentando os gêmeos Rômulo e Remo perto do rio Tibre">
      <rect width="560" height="200" rx="14" fill="#fef3c7" />
      <path d="M0 170 Q280 150 560 172 L560 200 L0 200 Z" fill="#38bdf8" />
      <rect y="120" width="560" height="52" fill="#86efac" opacity="0.7" />
      {/* a loba */}
      <g transform="translate(250 130)">
        <ellipse rx="70" ry="28" fill="#78716c" />
        <circle cx="70" cy="-20" r="22" fill="#78716c" />
        <path d="M80 -40 L86 -56 L92 -36 M64 -40 L66 -56 L76 -40" fill="#78716c" />
        <path d="M86 -14 L106 -10 L88 -6 Z" fill="#57534e" />
        <circle cx="78" cy="-24" r="2.5" fill="#1e293b" />
        <path d="M-60 20 L-62 50 M-30 22 L-30 50 M30 22 L30 50 M56 18 L60 48" stroke="#78716c" strokeWidth="9" strokeLinecap="round" />
        <path d="M-70 -6 Q-100 -20 -96 -40" stroke="#78716c" strokeWidth="9" fill="none" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" values="-6 -70 -6;6 -70 -6;-6 -70 -6" dur="1.5s" repeatCount="indefinite" />
        </path>
      </g>
      {/* os gêmeos */}
      {[210, 252].map((x, i) => (
        <g key={x} transform={`translate(${x} 176)`}>
          <g className="cg-anim-float" style={{ animationDelay: `${i * 0.4}s` }}>
            <ellipse rx="16" ry="9" fill="#f1c9a5" />
            <circle cx="-14" cy="-6" r="8" fill="#f1c9a5" />
          </g>
        </g>
      ))}
      <g fontFamily="Georgia, serif" fontWeight="900">
        <text x="420" y="60" fontSize="14" fill="#78350f">Rômulo e Remo</text>
        <text x="420" y="82" fontSize="12" fill="#92400e">753 a.C., pela lenda</text>
        <text x="40" y="190" fontSize="11.5" fill="#0c4a6e">rio Tibre</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O aqueduto levando água
// ---------------------------------------------------------------------------

function AqueductArt() {
  return (
    <Art viewBox="0 0 560 200" label="Um aqueduto romano de arcos de pedra levando água das montanhas até a cidade, com a água correndo no canal de cima">
      <rect width="560" height="200" rx="14" fill="#e0f2fe" />
      <path d="M0 80 L80 30 L140 70 L0 110 Z" fill="#94a3b8" />
      <rect y="170" width="560" height="30" fill="#86efac" />
      <path d="M60 70 L520 70 L520 82 L60 82 Z" fill="#d6a77a" stroke="#92400e" />
      <path d="M60 72 L520 72" stroke="#38bdf8" strokeWidth="5" strokeDasharray="12 8" className="cg-anim-dash" />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M${70 + i * 50} 170 L${70 + i * 50} 110 Q${95 + i * 50} 84 ${120 + i * 50} 110 L${120 + i * 50} 170`} fill="none" stroke="#d6a77a" strokeWidth="10" />
      ))}
      {/* a cidade com a fonte */}
      <g transform="translate(520 170)">
        <rect x="-30" y="-50" width="40" height="50" fill="#fde68a" stroke="#92400e" />
        <path d="M-34 -50 L-10 -66 L14 -50 Z" fill="#b91c1c" />
      </g>
      <path d="M520 82 Q530 120 520 150" stroke="#38bdf8" strokeWidth="4" fill="none" strokeDasharray="6 5" className="cg-anim-dash" />
      <text x="325" y="40" textAnchor="middle" fontSize="13" fontWeight="900" fill="#0c4a6e" fontFamily="Georgia, serif">
        o aqueduto levava água das montanhas até a cidade
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O conversor de números romanos (de mexer)
// ---------------------------------------------------------------------------

const ROMAN: [number, string][] = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

function toRoman(n: number): string {
  let rest = n;
  let out = "";
  for (const [value, letters] of ROMAN) {
    while (rest >= value) {
      out += letters;
      rest -= value;
    }
  }
  return out;
}

export function RomanNumerals() {
  const [n, setN] = useState(2026);
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em] text-center">
      <p className="cg-book-title text-[2.2em] font-black tracking-[0.12em] text-[#991b1b]">{toRoman(n)}</p>
      <p className="text-[1.1em] font-bold text-[#3b2a14]">= {n}</p>
      <input type="range" min={1} max={3999} value={n} onChange={(e) => setN(Number(e.target.value))} className="mt-[0.3em] w-full accent-[#b91c1c]" />
      <div className="mt-[0.2em] flex flex-wrap justify-center gap-[0.3em] text-[0.78em]">
        {[4, 9, 14, 40, 476, 753, 1500, 2026].map((v) => (
          <button key={v} type="button" onClick={() => setN(v)} className="rounded-full border border-[#d9c79d] bg-white px-[0.55em] py-[0.05em] font-bold hover:bg-[#fee2e2]">
            {v}
          </button>
        ))}
      </div>
    </div>
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
      title="Roma Antiga"
      goals={["A lenda da fundação de Roma", "Monarquia, República e Império", "O latim e os números romanos", "A queda do Império Romano do Ocidente"]}
    >
      <Fig h={34}>
        <ColosseumOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🐺">A fundação de Roma</H>
      <P>
        Segundo a lenda, Roma foi fundada em <T>753 a.C.</T> pelos gêmeos <T>Rômulo e Remo</T>, que foram abandonados no rio Tibre e amamentados por uma loba.
      </P>
      <Fig n="5.1" caption="A loba e os gêmeos, símbolo de Roma." h={20}>
        <WolfArt />
      </Fig>
      <Table
        head={["Fase", "Quando", "Quem governava"]}
        rows={[
          ["Monarquia", "753 a 509 a.C.", "Reis"],
          ["República", "509 a 27 a.C.", "O Senado e os cônsules"],
          ["Império", "27 a.C. a 476 d.C.", "Os imperadores"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🏛️">O Império Romano</H>
      <P>
        <T>Júlio César</T> foi ditador, mas não imperador. Seu sobrinho <T>Otávio</T> recebeu o título de <T>Augusto</T> em <T>27 a.C.</T> e virou o primeiro imperador.
        Roma dominou as terras em volta do mar Mediterrâneo e construiu estradas, pontes e <T>aquedutos</T>.
      </P>
      <Fig n="5.2" caption="O aqueduto romano levava água até as cidades." h={20}>
        <AqueductArt />
      </Fig>
      <Box kind="sabia">
        As estradas romanas eram tão boas que surgiu o ditado “<strong>todos os caminhos levam a Roma</strong>”. Algumas são usadas até hoje!
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🔤">O latim e os números romanos</H>
      <P>
        A língua do Império era o <T>latim</T>. Do latim falado pelo povo nasceram as línguas <T>neolatinas</T>: o português, o espanhol, o francês, o italiano e o
        romeno. Os romanos também escreviam os números com letras. Experimente:
      </P>
      <RomanNumerals />
      <Box kind="mago" title="Como ler">
        I = 1, V = 5, X = 10, L = 50, C = 100, D = 500 e M = 1000. Uma letra menor antes de uma maior subtrai: IV = 4, IX = 9.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🏟️">Pão, circo e a queda</H>
      <P>
        No <T>Coliseu</T>, dezenas de milhares de pessoas assistiam às lutas de gladiadores. O governo distribuía comida e espetáculos para agradar o povo: a política do{" "}
        <T>“pão e circo”</T>.
      </P>
      <Cards
        items={[
          { icon: "✝️", title: "Cristianismo", text: "Perseguido no começo, virou a religião oficial do Império no ano 380." },
          { icon: "⚔️", title: "Invasões", text: "Povos germânicos, chamados pelos romanos de “bárbaros”, entraram no Império." },
        ]}
      />
      <Box kind="lembre">
        Em <strong>476</strong>, o último imperador romano do Ocidente foi deposto: é o fim da Antiguidade e o começo da Idade Média. A parte do Oriente, o Império
        Bizantino, durou até 1453.
      </Box>
      <div className="mt-[0.4em] flex justify-center">
        <svg viewBox="0 0 200 90" className="h-[4.5em] w-auto" aria-hidden="true">
          <Robed x={100} y={88} s={1.1} robe="#f8fafc" sash="#7c3aed" crown />
        </svg>
      </div>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Pela lenda, Roma foi fundada em 753 a.C. por Rômulo e Remo.",
          "Roma passou por Monarquia, República (Senado) e Império; Augusto foi o primeiro imperador.",
          "Do latim nasceram as línguas neolatinas, como o português.",
          "Os romanos construíram estradas, aquedutos e o Coliseu.",
          "Em 476 caiu o Império Romano do Ocidente: começa a Idade Média.",
        ]}
      />
      <Glossary
        items={[
          ["República", "Governo em que o poder não é herdado, como o de um rei."],
          ["Senado", "Assembleia dos homens mais ricos e poderosos de Roma."],
          ["Aqueduto", "Canal de pedra que leva água até as cidades."],
          ["Neolatinas", "Línguas que vieram do latim."],
          ["Gladiador", "Lutador que se apresentava nas arenas."],
        ]}
      />
      <Quiz
        items={[
          ["Segundo a lenda, quem fundou Roma?", "Os irmãos gêmeos Rômulo e Remo."],
          ["Quem foi o primeiro imperador de Roma?", "Augusto (Otávio)."],
          ["Que língua deu origem ao português?", "O latim."],
          ["Em que ano caiu o Império Romano do Ocidente?", "Em 476."],
        ]}
      />
    </>,
  ),
];
