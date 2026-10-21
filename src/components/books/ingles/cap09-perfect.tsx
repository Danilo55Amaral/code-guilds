"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { ChoiceGame } from "../portugues/art";
import { ENG, ENG_DARK, Say, WordCards } from "./art";

// ============================================================================
// CAPÍTULO 9 — PRESENT PERFECT (missão "Inglês: Present Perfect"): o
// passaporte com os carimbos das viagens, as cartas dos particípios, o jogo do
// Have you ever…? (de tocar), a linha do since e do for e o jogo do since,
// for e yet.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o passaporte e o avião
// ---------------------------------------------------------------------------

function PassportOpenerArt() {
  const stamps = [
    { x: 250, y: 100, t: "LONDON", c: "#dc2626", r: -12 },
    { x: 360, y: 120, t: "PARIS", c: "#2563eb", r: 10 },
    { x: 280, y: 200, t: "TOKYO", c: "#16a34a", r: 6 },
    { x: 385, y: 215, t: "NEW YORK", c: "#9333ea", r: -8 },
  ];
  return (
    <Art viewBox="0 0 460 300" label="Um passaporte aberto ganhando carimbos de Londres, Paris, Tóquio e Nova York, e um avião passando: I have been to many places">
      <rect width="460" height="300" fill="#e0f2fe" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="-80 0;540 -40" dur="6s" repeatCount="indefinite" />
        <text x="0" y="60" fontSize="40">
          ✈️
        </text>
      </g>
      <rect x="40" y="70" width="180" height="200" rx="10" fill={ENG_DARK} />
      <text x="130" y="140" textAnchor="middle" fontSize="18" fontWeight="900" fill="#fde68a" fontFamily="Georgia, serif">
        PASSPORT
      </text>
      <circle cx="130" cy="190" r="26" fill="none" stroke="#fde68a" strokeWidth="3" />
      <rect x="220" y="70" width="200" height="200" rx="10" fill="#fff" stroke="#cbd5e1" strokeWidth="2" />
      {stamps.map((s, i) => (
        <g key={s.t} transform={`translate(${s.x} ${s.y}) rotate(${s.r})`}>
          <g opacity="0">
            <animate attributeName="opacity" values="0;0;1;1;0" keyTimes={`0;${(0.1 + i * 0.18).toFixed(2)};${(0.13 + i * 0.18).toFixed(2)};0.92;1`} dur="7s" repeatCount="indefinite" />
            <rect x="-42" y="-20" width="84" height="40" rx="6" fill="none" stroke={s.c} strokeWidth="3" />
            <text y="6" textAnchor="middle" fontSize="13" fontWeight="900" fill={s.c} fontFamily="Georgia, serif">
              {s.t}
            </text>
          </g>
        </g>
      ))}
      <text x="230" y="292" textAnchor="middle" fontSize="16" fontWeight="900" fill={ENG_DARK} fontFamily="Georgia, serif">
        I have been to many places!
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O jogo do Have you ever…? (de tocar)
// ---------------------------------------------------------------------------

const EXPERIENCES: { base: string; part: string; rest: string; pt: string; icon: string }[] = [
  { base: "fly", part: "flown", rest: "in a plane", pt: "voar de avião", icon: "✈️" },
  { base: "see", part: "seen", rest: "snow", pt: "ver neve", icon: "❄️" },
  { base: "eat", part: "eaten", rest: "sushi", pt: "comer sushi", icon: "🍣" },
  { base: "ride", part: "ridden", rest: "a horse", pt: "andar a cavalo", icon: "🐴" },
  { base: "swim", part: "swum", rest: "in the sea", pt: "nadar no mar", icon: "🌊" },
  { base: "climb", part: "climbed", rest: "a mountain", pt: "escalar uma montanha", icon: "⛰️" },
];

export function HaveYouEver() {
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);
  const e = EXPERIENCES[i];
  const question = `Have you ever ${e.part} ${e.rest}?`;
  const reply = answer === "yes" ? `Yes! I have ${e.part} ${e.rest}.` : `No, I have never ${e.part} ${e.rest}.`;
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <div key={i} className="cg-anim-fade text-center">
        <p className="text-[1.8em] leading-none">{e.icon}</p>
        <p className="mt-[0.2em] text-[1.1em] font-black" style={{ color: ENG_DARK }}>
          {question} <Say text={question} />
        </p>
        <p className="text-[0.78em] text-[#3b2a14]">Você já… {e.pt}?</p>
      </div>
      <div className="mt-[0.3em] flex justify-center gap-[0.4em]">
        {(["yes", "no"] as const).map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAnswer(a)}
            className="rounded-full px-[1em] py-[0.1em] text-[0.85em] font-black text-white shadow hover:scale-105"
            style={{ background: a === "yes" ? "#16a34a" : "#64748b" }}
          >
            {a === "yes" ? "Yes" : "No"}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            setI((n) => (n + 1) % EXPERIENCES.length);
            setAnswer(null);
          }}
          className="rounded-full border px-[0.9em] py-[0.1em] text-[0.85em] font-bold"
          style={{ borderColor: ENG, color: ENG }}
        >
          Próxima ➜
        </button>
      </div>
      {answer && (
        <p key={`${i}-${answer}`} className="cg-anim-pop mt-[0.35em] text-center text-[1em] font-black" style={{ color: answer === "yes" ? "#166534" : "#334155" }}>
          {reply} <Say text={reply} />
        </p>
      )}
      <p className="mt-[0.2em] text-center text-[0.72em] text-[#8a7146]">
        {e.base} → {e.part} (particípio)
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A linha do since e do for
// ---------------------------------------------------------------------------

function SinceForArt() {
  return (
    <Art viewBox="0 0 560 160" label="Uma linha do tempo de 2015 até agora: since 2015 marca o ponto de partida, e for ten years mede o tamanho do caminho">
      <rect width="560" height="160" rx="14" fill="#eff6ff" />
      <line x1="40" y1="90" x2="520" y2="90" stroke="#94a3b8" strokeWidth="3" />
      <line x1="120" y1="90" x2="460" y2="90" stroke={ENG} strokeWidth="6" strokeDasharray="340" strokeDashoffset="340">
        <animate attributeName="stroke-dashoffset" values="340;0;0" keyTimes="0;0.6;1" dur="5s" repeatCount="indefinite" />
      </line>
      <circle cx="120" cy="90" r="9" fill={ENG_DARK} />
      <circle cx="460" cy="90" r="9" fill="#16a34a" />
      <g fontFamily="Georgia, serif" fontWeight="900" textAnchor="middle">
        <text x="120" y="122" fontSize="15" fill={ENG_DARK}>
          2015
        </text>
        <text x="460" y="122" fontSize="15" fill="#16a34a">
          now
        </text>
        <text x="120" y="60" fontSize="17" fill={ENG_DARK}>
          since 2015
        </text>
        <text x="120" y="40" fontSize="11" fill="#475569">
          (o ponto de partida)
        </text>
        <path d="M130 70 Q290 40 450 70" fill="none" stroke={ENG} strokeWidth="2" strokeDasharray="5 4" />
        <text x="300" y="44" fontSize="17" fill={ENG}>
          for ten years
        </text>
        <text x="300" y="146" fontSize="13" fill="#334155">
          I have lived here since 2015 = I have lived here for ten years.
        </text>
      </g>
    </Art>
  );
}

const SINCE_FOR = [
  { prompt: "“I have lived here ___ 2015.”", options: ["since", "for"], answer: 0, explain: "Since marca o ponto de partida: desde 2015." },
  { prompt: "“We have studied English ___ three years.”", options: ["since", "for"], answer: 1, explain: "For mede a duração: por três anos." },
  { prompt: "“She ___ visited Paris twice.”", options: ["have", "has"], answer: 1, explain: "Com he, she e it, has; com os outros, have." },
  { prompt: "“I haven't finished my homework ___.”", options: ["yet", "already"], answer: 0, explain: "Yet aparece no fim das negativas e perguntas: ainda não." },
];

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 9, content, bare });

export const chapter9: BookPage[] = [
  page(
    <ChapterOpener
      n={9}
      title="Present Perfect"
      goals={["Como se forma o present perfect", "Os particípios dos verbos irregulares", "Ever e never: as experiências de vida", "Since, for, yet e a diferença pro simple past"]}
    >
      <Fig h={34}>
        <PassportOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="✈️">O present perfect</H>
      <P>
        O <T>present perfect</T> liga o passado ao presente: fala de experiências e de coisas que começaram antes e continuam agora. Ele é formado por{" "}
        <T>have/has + particípio</T>.
      </P>
      <Table
        head={["Sujeito", "Have/has", "Particípio"]}
        rows={[
          ["I · you · we · they", "have ('ve)", "eaten · finished · been"],
          ["he · she · it", "has ('s)", "eaten · finished · been"],
        ]}
      />
      <Box kind="atencao">
        <strong>I lost my keys</strong> (perdi, e pronto) é diferente de <strong>I have lost my keys</strong> (perdi e elas continuam perdidas agora). O present perfect
        não diz quando foi.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🌀">Os particípios</H>
      <P>
        Nos verbos regulares, o particípio é igual ao passado (played, finished). Os irregulares têm forma própria. Vire as cartas:
      </P>
      <WordCards
        cols={4}
        items={[
          ["eat", "ate → eaten"],
          ["write", "wrote → written"],
          ["see", "saw → seen"],
          ["go", "went → gone"],
          ["be", "was → been"],
          ["do", "did → done"],
          ["take", "took → taken"],
          ["speak", "spoke → spoken"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🌍">Have you ever…?</H>
      <P>
        <T>Ever</T> (alguma vez) aparece nas perguntas sobre experiências; <T>never</T> (nunca) nas respostas negativas. E você, já fez essas coisas?
      </P>
      <HaveYouEver />
    </>,
  ),

  page(
    <>
      <H icon="⏳">Since, for e yet</H>
      <P>
        <T>Since</T> marca o ponto de partida (since 2015, since Monday); <T>for</T> mede a duração (for ten years, for a long time).
      </P>
      <Fig n="9.1" caption="Since diz quando começou; for diz quanto tempo durou." h={15}>
        <SinceForArt />
      </Fig>
      <ChoiceGame items={SINCE_FOR} color={ENG} title="Since, for, have ou has?" />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Present perfect = have/has + particípio: I have eaten, she has finished.",
          "Particípios irregulares: eaten, written, seen, gone, been, done.",
          "Ever nas perguntas (Have you ever been to Brazil?) e never nas negativas (I have never seen snow).",
          "Since marca o começo (since 2015); for mede a duração (for ten years).",
          "Yet = ainda (no fim das negativas e perguntas): I haven't finished yet.",
        ]}
      />
      <Glossary
        items={[
          ["Participle", "Particípio (eaten, written)."],
          ["Ever", "Alguma vez."],
          ["Never", "Nunca."],
          ["Since", "Desde."],
          ["Yet", "Ainda (em negativas e perguntas)."],
        ]}
      />
      <Quiz
        items={[
          ["Como se forma o present perfect?", "Have/has + particípio do verbo."],
          ["Qual é o particípio de “write”?", "written."],
          ["O que significa “I have never seen snow”?", "Eu nunca vi neve."],
          ["Complete: “I have lived here ___ 2015.”", "since."],
        ]}
      />
    </>,
  ),
];
