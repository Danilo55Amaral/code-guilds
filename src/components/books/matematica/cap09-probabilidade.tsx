"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Kid } from "../ods/art";
import { Coin, Die, MATH, MATH_DARK, Panel, Pill } from "./art";

// ============================================================================
// CAPÍTULO 9 — PROBABILIDADE E CONTAGEM (missão "Matemática: Probabilidade,
// Estatística e Progressões", a parte das chances): o dado rolando e a moeda
// girando, o laboratório de dados (de tocar), a árvore das duas moedas, o
// provador de roupas do princípio da contagem (de tocar) e os apertos de mão.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o dado rolando e a moeda girando
// ---------------------------------------------------------------------------

function ChanceOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Um dado rolando e trocando de face e uma moeda girando no ar, com a pergunta: qual é a chance?">
      <rect width="460" height="300" fill="#f5f3ff" />
      <ellipse cx="230" cy="250" rx="200" ry="24" fill="#16a34a" opacity="0.25" />
      <g transform="translate(140 170)">
        <g>
          <animateTransform attributeName="transform" type="rotate" values="0;90;180;270;360" dur="3s" repeatCount="indefinite" />
          {[1, 2, 3, 4, 5, 6].map((n, i) => (
            <g key={n} opacity="0">
              {/* cada face aparece num sexto da volta */}
              <animate attributeName="opacity" values={[0, 1, 2, 3, 4, 5].map((j) => (j === i ? 1 : 0)).join(";")} keyTimes="0;0.1667;0.3333;0.5;0.6667;0.8333" dur="3s" repeatCount="indefinite" calcMode="discrete" />
              <Die x={0} y={0} n={n} s={90} />
            </g>
          ))}
        </g>
      </g>
      <g transform="translate(330 120)">
        <g>
          <animateTransform attributeName="transform" type="scale" values="1 1;0.1 1;1 1;0.1 1;1 1" dur="1.6s" repeatCount="indefinite" />
          <Coin x={0} y={0} r={48} />
        </g>
      </g>
      <text x="230" y="50" textAnchor="middle" fontSize="26" fontWeight="900" fill={MATH_DARK} fontFamily="Georgia, serif">
        Qual é a chance?
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O laboratório de dados (de tocar)
// ---------------------------------------------------------------------------

export function DiceLab() {
  const [counts, setCounts] = useState([0, 0, 0, 0, 0, 0]);
  const [last, setLast] = useState(6);
  const total = counts.reduce((s, c) => s + c, 0);
  function roll(times: number) {
    const next = [...counts];
    let face = last;
    for (let i = 0; i < times; i++) {
      face = 1 + Math.floor(Math.random() * 6);
      next[face - 1]++;
    }
    setCounts(next);
    setLast(face);
  }
  const max = Math.max(10, ...counts);
  return (
    <Panel title="Laboratório de dados">
      <div className="flex flex-wrap items-center justify-center gap-[0.8em]">
        <svg viewBox="0 0 60 60" className="h-[3.2em] w-[3.2em]" aria-label={`O dado caiu no ${last}`}>
          <g key={total} className="cg-anim-pop" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <Die x={30} y={30} n={last} s={52} />
          </g>
        </svg>
        <div className="flex h-[5.5em] items-end gap-[0.35em]" aria-label="Quantas vezes saiu cada face">
          {counts.map((c, i) => (
            <div key={i} className="flex w-[1.9em] flex-col items-center">
              <span className="text-[0.7em] font-bold text-[#3b2a14]">{c}</span>
              <div className="w-full rounded-t transition-all duration-300" style={{ height: `${(c / max) * 3.6}em`, background: MATH }} />
              <span className="text-[0.75em] font-black" style={{ color: MATH_DARK }}>
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-[0.35em] flex flex-wrap justify-center gap-[0.3em]">
        <Pill onClick={() => roll(1)}>Jogar 1 vez</Pill>
        <Pill onClick={() => roll(60)}>Jogar 60 vezes</Pill>
        <Pill onClick={() => setCounts([0, 0, 0, 0, 0, 0])}>Zerar</Pill>
      </div>
      <p className="mt-[0.25em] text-center text-[0.8em] text-[#3b2a14]">
        {total === 0 ? "Jogue o dado!" : `${total} jogadas. Cada face deveria sair perto de ${(total / 6).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} vezes (1/6).`}
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// A árvore das duas moedas
// ---------------------------------------------------------------------------

function CoinTreeArt() {
  const leaves = [
    { y: 25, a: "cara", b: "cara", t: "cara e cara" },
    { y: 70, a: "cara", b: "coroa", t: "cara e coroa" },
    { y: 115, a: "coroa", b: "cara", t: "coroa e cara" },
    { y: 160, a: "coroa", b: "coroa", t: "coroa e coroa" },
  ] as const;
  return (
    <Art viewBox="0 0 560 190" label="Uma árvore de possibilidades: a primeira moeda dá cara ou coroa, e a segunda também; são 4 resultados, e só um é cara e cara">
      <rect width="560" height="190" rx="14" fill="#faf5ff" />
      <circle cx="50" cy="95" r="10" fill={MATH} />
      {[47, 140].map((y, i) => (
        <g key={y}>
          <line x1="60" y1="95" x2="180" y2={y} stroke={i === 0 ? "#16a34a" : "#94a3b8"} strokeWidth={i === 0 ? 4 : 2} />
          <Coin x={200} y={y} r={18} face={i === 0 ? "cara" : "coroa"} />
        </g>
      ))}
      {leaves.map((l, i) => {
        const from = i < 2 ? 47 : 140;
        const hit = i === 0;
        return (
          <g key={l.t}>
            <line x1="220" y1={from} x2="330" y2={l.y} stroke={hit ? "#16a34a" : "#94a3b8"} strokeWidth={hit ? 4 : 2} />
            <Coin x={350} y={l.y} r={16} face={l.b} />
            <text x="378" y={l.y + 5} fontSize="14" fontWeight="900" fill={hit ? "#16a34a" : "#334155"} fontFamily="Georgia, serif">
              {l.t}
              {hit && " ✔"}
            </text>
          </g>
        );
      })}
      <circle r="7" fill="#16a34a">
        <animateMotion path="M50 95 L200 47 L350 25" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O provador de roupas do princípio da contagem (de tocar)
// ---------------------------------------------------------------------------

const SHIRTS = ["#dc2626", "#2563eb", "#16a34a", "#f59e0b"];
const SHORTS = ["#1e293b", "#78350f", "#64748b"];

export function OutfitCounter() {
  const [shirts, setShirts] = useState(3);
  const [shorts, setShorts] = useState(2);
  return (
    <Panel title="Quantos visuais diferentes?">
      <div className="flex flex-wrap items-center justify-center gap-[0.4em] text-[0.82em] font-bold text-[#3b2a14]">
        <span>Camisetas:</span>
        {[1, 2, 3, 4].map((n) => (
          <Pill key={n} on={shirts === n} onClick={() => setShirts(n)}>
            {n}
          </Pill>
        ))}
        <span className="ml-[0.4em]">Bermudas:</span>
        {[1, 2, 3].map((n) => (
          <Pill key={n} on={shorts === n} onClick={() => setShorts(n)}>
            {n}
          </Pill>
        ))}
      </div>
      <svg viewBox={`0 0 ${shirts * shorts * 40 + 10} 80`} className="mx-auto mt-[0.3em] block h-[4.5em] max-w-full" aria-label={`${shirts * shorts} combinações de roupa`}>
        {Array.from({ length: shirts }, (_, s) =>
          Array.from({ length: shorts }, (_, b) => {
            const i = s * shorts + b;
            return (
              <g key={i}>
                <Kid x={25 + i * 40} y={74} s={0.95} shirt={SHIRTS[s]} />
                <rect x={25 + i * 40 - 11} y={74 - 22} width="22" height="9" rx="2" fill={SHORTS[b]} />
              </g>
            );
          }),
        )}
      </svg>
      <p className="cg-book-title text-center text-[1.15em] font-black" style={{ color: MATH_DARK }}>
        {shirts} × {shorts} = {shirts * shorts} visuais
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Os apertos de mão
// ---------------------------------------------------------------------------

function HandshakeArt() {
  const pts = Array.from({ length: 5 }, (_, i) => {
    const a = ((-90 + i * 72) * Math.PI) / 180;
    return [140 + 70 * Math.cos(a), 98 + 70 * Math.sin(a)] as const;
  });
  const pairs: [number, number][] = [];
  for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) pairs.push([i, j]);
  const colors = ["#dc2626", "#2563eb", "#16a34a", "#f59e0b", "#9333ea"];
  return (
    <Art viewBox="0 0 560 196" label="Cinco pessoas em roda; uma linha aparece para cada aperto de mão, até formar 10 linhas">
      <rect width="560" height="196" rx="14" fill="#faf5ff" />
      {pairs.map(([i, j], n) => (
        <line key={`${i}${j}`} x1={pts[i][0]} y1={pts[i][1]} x2={pts[j][0]} y2={pts[j][1]} stroke={MATH} strokeWidth="2.5" opacity="0">
          <animate attributeName="opacity" values="0;0;1;1;0" keyTimes={`0;${(n * 0.07).toFixed(2)};${(n * 0.07 + 0.03).toFixed(2)};0.9;1`} dur="6s" repeatCount="indefinite" />
        </line>
      ))}
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="15" fill={colors[i]} stroke="#fff" strokeWidth="3" />
          <circle cx={x - 4} cy={y - 2} r="1.8" fill="#fff" />
          <circle cx={x + 4} cy={y - 2} r="1.8" fill="#fff" />
        </g>
      ))}
      <g fontFamily="Georgia, serif" fontWeight="900">
        <text x="270" y="64" fontSize="15" fill="#334155">
          cada um aperta a mão de 4: 5 × 4 = 20
        </text>
        <text x="270" y="96" fontSize="15" fill="#334155">
          mas cada aperto foi contado 2 vezes
        </text>
        <text x="270" y="136" fontSize="20" fill={MATH_DARK}>
          20 ÷ 2 = 10 apertos
        </text>
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
      title="Probabilidade e Contagem"
      goals={["Como calcular a chance de algo acontecer", "Por que a sorte se acerta com muitas jogadas", "O princípio fundamental da contagem", "Anagramas, fatorial e combinações"]}
    >
      <Fig h={34}>
        <ChanceOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🎲">Probabilidade</H>
      <P>
        A <T>probabilidade</T> é a chance de algo acontecer: o número de <T>casos favoráveis</T> dividido pelo de <T>casos possíveis</T>. Num dado há 6 faces e só uma é
        o 6: a chance de sair 6 é <T>1/6</T>, uns 16,7%. Jogue bastante e veja as barras ficarem parecidas:
      </P>
      <DiceLab />
    </>,
  ),

  page(
    <>
      <H icon="💰">Duas moedas</H>
      <P>
        Jogando uma moeda duas vezes, quais são os resultados? A <T>árvore de possibilidades</T> mostra os 4: só um deles é cara e cara. Então a chance é <T>1/4</T>. Dá
        pra multiplicar as chances de cada jogada: 1/2 × 1/2 = 1/4.
      </P>
      <Fig n="9.1" caption="A árvore mostra todos os resultados possíveis das duas jogadas." h={20}>
        <CoinTreeArt />
      </Fig>
      <Box kind="atencao">A moeda não tem memória: depois de três caras seguidas, a chance de dar cara de novo continua sendo 1/2.</Box>
    </>,
  ),

  page(
    <>
      <H icon="👕">O princípio da contagem</H>
      <P>
        Se uma escolha pode ser feita de 3 jeitos e outra de 2 jeitos, as duas juntas podem ser feitas de 3 × 2 = <T>6</T> jeitos. É o <T>princípio fundamental da
        contagem</T>: multiplique as possibilidades de cada etapa.
      </P>
      <OutfitCounter />
      <Box kind="sabia">É por isso que senhas longas são seguras: uma senha de 4 dígitos tem 10 × 10 × 10 × 10 = 10.000 possibilidades.</Box>
    </>,
  ),

  page(
    <>
      <H icon="🤝">Anagramas e combinações</H>
      <P>
        Quantos <T>anagramas</T> tem AMOR? A 1ª letra tem 4 opções, a 2ª tem 3, a 3ª tem 2 e a última, 1: 4 × 3 × 2 × 1 = 24. Essa conta é o <T>fatorial</T>: 4! = 24. E
        quando a ordem não importa, como nos apertos de mão, temos uma <T>combinação</T>:
      </P>
      <Fig n="9.2" caption="Numa roda de 5 pessoas, todo mundo cumprimenta todo mundo: 10 apertos." h={20}>
        <HandshakeArt />
      </Fig>
      <Cards
        items={[
          { icon: "❗", title: "Fatorial", text: "5! = 5 × 4 × 3 × 2 × 1 = 120." },
          { icon: "🔤", title: "Anagrama", text: "Outra palavra com as mesmas letras: AMOR, ROMA, MORA…" },
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Probabilidade = casos favoráveis ÷ casos possíveis: sair 6 num dado é 1/6.",
          "Com muitas jogadas, cada resultado aparece perto da sua probabilidade.",
          "Duas caras seguidas: 1/2 × 1/2 = 1/4.",
          "Princípio da contagem: multiplique as possibilidades de cada etapa (3 × 2 = 6).",
          "Anagramas de AMOR: 4! = 24. Apertos de mão de 5 pessoas: (5 × 4) ÷ 2 = 10.",
        ]}
      />
      <Glossary
        items={[
          ["Probabilidade", "A chance de um resultado acontecer."],
          ["Espaço amostral", "O conjunto de todos os resultados possíveis."],
          ["Fatorial", "n! = n × (n − 1) × … × 1."],
          ["Anagrama", "Uma troca da ordem das letras de uma palavra."],
          ["Combinação", "Um agrupamento em que a ordem não importa."],
        ]}
      />
      <Quiz
        items={[
          ["Qual é a probabilidade de sair 6 num dado?", "1/6 (cerca de 16,7%)."],
          ["Jogando uma moeda duas vezes, qual é a chance de dar cara nas duas?", "1/4."],
          ["Quantos anagramas tem a palavra AMOR?", "24 (4!)."],
          ["5 pessoas se cumprimentam uma vez cada. Quantos apertos de mão?", "10."],
        ]}
      />
    </>,
  ),
];
