"use client";

import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { ChoiceGame } from "../portugues/art";
import { ENG, ENG_DARK, Say, WordCards } from "./art";

// ============================================================================
// CAPÍTULO 7 — SIMPLE PAST (missão "Inglês: Simple Past"): o relógio andando
// pra trás e o álbum de fotos de ontem, as cartas dos verbos irregulares, o
// jogo do was, were e did e a linha do tempo do yesterday e do ago.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o relógio voltando e a foto de ontem
// ---------------------------------------------------------------------------

function PastOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Um relógio com os ponteiros girando para trás ao lado de uma foto antiga de uma praia, com a frase Yesterday I went to the beach">
      <rect width="460" height="300" fill="#fef9c3" />
      {/* o relógio voltando no tempo */}
      <g transform="translate(120 140)">
        <circle r="78" fill="#fff" stroke={ENG_DARK} strokeWidth="6" />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1="0" y1="-64" x2="0" y2="-54" stroke={ENG_DARK} strokeWidth="3" transform={`rotate(${i * 30})`} />
        ))}
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="2s" repeatCount="indefinite" />
          <line x1="0" y1="0" x2="0" y2="-56" stroke={ENG} strokeWidth="4" strokeLinecap="round" />
        </g>
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="24s" repeatCount="indefinite" />
          <line x1="0" y1="0" x2="0" y2="-36" stroke={ENG_DARK} strokeWidth="6" strokeLinecap="round" />
        </g>
        <circle r="6" fill={ENG_DARK} />
        <path d="M-96 -20 A98 98 0 0 1 -40 -88" fill="none" stroke={ENG} strokeWidth="4" strokeDasharray="8 6" />
        <path d="M-46 -98 L-38 -86 L-52 -82" fill="none" stroke={ENG} strokeWidth="4" strokeLinecap="round" />
      </g>
      {/* a foto de ontem */}
      <g transform="translate(330 140)">
        <g>
          <animateTransform attributeName="transform" type="rotate" values="-6;-2;-6" dur="4s" repeatCount="indefinite" />
          <rect x="-90" y="-80" width="180" height="160" fill="#fff" stroke="#a8a29e" strokeWidth="2" />
          <rect x="-78" y="-68" width="156" height="112" fill="#7dd3fc" />
          <rect x="-78" y="10" width="156" height="34" fill="#fde68a" />
          <circle cx="40" cy="-40" r="14" fill="#fde047" />
          <path d="M-78 4 Q-40 -6 0 4 T78 4 L78 12 L-78 12 Z" fill="#38bdf8" />
          <text y="66" textAnchor="middle" fontSize="13" fontWeight="900" fill="#57534e" fontFamily="Georgia, serif">
            last summer
          </text>
        </g>
      </g>
      <text x="230" y="275" textAnchor="middle" fontSize="20" fontWeight="900" fill={ENG_DARK} fontFamily="Georgia, serif">
        Yesterday I went to the beach.
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O jogo do was, were e did
// ---------------------------------------------------------------------------

const PAST_GAME = [
  { prompt: "“Yesterday I ___ a great movie.” (see)", options: ["see", "saw", "seen"], answer: 1, explain: "See é irregular: see → saw → seen." },
  { prompt: "“I ___ at home last night.”", options: ["was", "were", "am"], answer: 0, explain: "Com I, he, she e it, o passado do to be é was." },
  { prompt: "“They ___ very tired.”", options: ["was", "were", "did"], answer: 1, explain: "Com you, we e they, o passado do to be é were." },
  { prompt: "“___ you finish your homework?”", options: ["Do", "Did", "Was"], answer: 1, explain: "Pra perguntar no passado, use did, e o verbo fica na forma base." },
  { prompt: "Negativa de “She visited her grandma.”", options: ["She didn't visited…", "She didn't visit…", "She not visited…"], answer: 1, explain: "Com didn't, o verbo volta pra forma base: didn't visit." },
];

// ---------------------------------------------------------------------------
// A linha do tempo do yesterday e do ago
// ---------------------------------------------------------------------------

function TimelineArt() {
  const marks = [
    { x: 70, t: "two years ago", s: "dois anos atrás" },
    { x: 200, t: "last week", s: "semana passada" },
    { x: 320, t: "yesterday", s: "ontem" },
    { x: 470, t: "today", s: "hoje" },
  ];
  return (
    <Art viewBox="0 0 560 160" label="Uma linha do tempo de hoje para trás: yesterday, last week e two years ago; uma bolinha volta de hoje até o passado">
      <rect width="560" height="160" rx="14" fill="#eff6ff" />
      <line x1="40" y1="80" x2="520" y2="80" stroke={ENG_DARK} strokeWidth="4" />
      <path d="M40 80 L56 70 L56 90 Z" fill={ENG_DARK} />
      {marks.map((m) => (
        <g key={m.t}>
          <circle cx={m.x} cy="80" r="8" fill={m.t === "today" ? "#16a34a" : ENG} stroke="#fff" strokeWidth="2" />
          <text x={m.x} y="56" textAnchor="middle" fontSize="15" fontWeight="900" fill={ENG_DARK} fontFamily="Georgia, serif">
            {m.t}
          </text>
          <text x={m.x} y="110" textAnchor="middle" fontSize="12" fontWeight="700" fill="#475569" fontFamily="Georgia, serif">
            {m.s}
          </text>
        </g>
      ))}
      <circle cx="470" cy="80" r="12" fill="#fde047" stroke="#a16207" strokeWidth="2">
        <animate attributeName="cx" values="470;70;70" keyTimes="0;0.8;1" dur="5s" repeatCount="indefinite" />
      </circle>
      <text x="280" y="145" textAnchor="middle" fontSize="13" fontWeight="900" fill={ENG} fontFamily="Georgia, serif">
        ← o passado (simple past)
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 7, content, bare });

export const chapter7: BookPage[] = [
  page(
    <ChapterOpener
      n={7}
      title="Simple Past"
      goals={["Os verbos regulares e o -ed", "Os verbos irregulares mais usados", "Was e were, o passado do to be", "Did nas perguntas e negativas, e as palavras do passado"]}
    >
      <Fig h={34}>
        <PastOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="📷">Os verbos regulares</H>
      <P>
        O <T>simple past</T> conta o que já aconteceu e acabou. Nos verbos <T>regulares</T>, é só colocar <T>-ed</T>, e a forma é a mesma pra todas as pessoas: I played,
        she played, they played.
      </P>
      <Table
        head={["Regra", "Exemplo"]}
        rows={[
          ["A maioria: + ed", "play → played · watch → watched · walk → walked"],
          ["Termina em -e: + d", "dance → danced · like → liked"],
          ["Consoante + y: -ied", "study → studied · cry → cried"],
          ["Consoante-vogal-consoante: dobra", "stop → stopped · plan → planned"],
        ]}
      />
      <Box kind="mago" title="O som do -ed">
        Depois de t ou d, o -ed vira uma sílaba: wanted <Say text="wanted" />. Nos outros, ele quase não aparece: played <Say text="played" />, walked{" "}
        <Say text="walked" />.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🌀">Os verbos irregulares</H>
      <P>
        Os verbos <T>irregulares</T> não seguem a regra do -ed, e o jeito é decorar. Por sorte, são poucos os mais usados. Vire as cartas pra ver o passado:
      </P>
      <WordCards
        cols={4}
        items={[
          ["go", "went (ir)"],
          ["eat", "ate (comer)"],
          ["see", "saw (ver)"],
          ["buy", "bought (comprar)"],
          ["have", "had (ter)"],
          ["do", "did (fazer)"],
          ["take", "took (pegar)"],
          ["make", "made (fazer)"],
        ]}
      />
      <Box kind="atencao">
        Não confunda <strong>bought</strong> (comprou, de buy) com <strong>brought</strong> (trouxe, de bring).
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🔙">Was, were e did</H>
      <P>
        O passado do to be é <T>was</T> (I, he, she, it) e <T>were</T> (you, we, they). Pros outros verbos, a pergunta e a negativa usam <T>did</T> e <T>didn&apos;t</T>,
        com o verbo na forma base.
      </P>
      <ChoiceGame items={PAST_GAME} color={ENG} title="Complete no passado" />
    </>,
  ),

  page(
    <>
      <H icon="⏪">As palavras do passado</H>
      <P>
        Algumas palavras avisam que a frase está no passado. O <T>ago</T> diz há quanto tempo e vem <T>depois</T> do tempo: <em>two years ago</em> (dois anos atrás).
      </P>
      <Fig n="7.1" caption="Do hoje pra trás: yesterday, last week, two years ago." h={17}>
        <TimelineArt />
      </Fig>
      <Cards
        items={[
          { icon: "🌙", title: "last night", text: "ontem à noite" },
          { icon: "📆", title: "in 2010", text: "em 2010 (ano no passado)" },
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "O simple past conta o que já aconteceu: o verbo é igual pra todas as pessoas.",
          "Regulares ganham -ed: play → played, study → studied, stop → stopped.",
          "Irregulares são decorados: go → went, eat → ate, see → saw, buy → bought.",
          "Was com I, he, she, it; were com you, we, they.",
          "Did pergunta, didn't nega, e o verbo volta pra forma base: Did you finish? She didn't visit.",
        ]}
      />
      <Glossary
        items={[
          ["Yesterday", "Ontem."],
          ["Last week", "Semana passada."],
          ["Ago", "Atrás (two years ago)."],
          ["Went", "Foi (passado de go)."],
          ["Bought", "Comprou (passado de buy)."],
        ]}
      />
      <Quiz
        items={[
          ["Qual é o passado de “play”?", "played."],
          ["Qual é o passado de “go”?", "went."],
          ["Qual é o passado do to be com “they”?", "were."],
          ["O que significa “two years ago”?", "Dois anos atrás."],
        ]}
      />
    </>,
  ),
];
