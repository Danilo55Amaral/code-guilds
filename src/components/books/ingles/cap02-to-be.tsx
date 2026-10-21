"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Kid } from "../ods/art";
import { ChoiceGame } from "../portugues/art";
import { En, ENG, ENG_DARK, Say } from "./art";

// ============================================================================
// CAPÍTULO 2 — VERB TO BE AND PRONOUNS (missão "Inglês: Verb To Be and
// Pronouns"): a turma dos pronomes, o montador de frases com o to be (de
// tocar), a Maria e o João com os bichos deles (her e his) e o jogo do to be.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a turma dos pronomes
// ---------------------------------------------------------------------------

function PronounsOpenerArt() {
  const people = [
    { x: 60, word: "I", shirt: ENG },
    { x: 130, word: "you", shirt: "#f59e0b" },
    { x: 200, word: "he", shirt: "#2563eb" },
    { x: 270, word: "she", shirt: "#db2777" },
    { x: 400, word: "they", shirt: "#16a34a" },
  ];
  return (
    <Art viewBox="0 0 460 300" label="Uma fila de crianças, cada uma com uma plaquinha: I, you, he, she, it (um gato) e they; as plaquinhas pulam uma de cada vez">
      <rect width="460" height="300" fill="#eff6ff" />
      <rect y="240" width="460" height="60" fill="#bfdbfe" />
      {people.map((p, i) => (
        <g key={p.word}>
          <Kid x={p.x} y={250} s={1.6} shirt={p.shirt} skin={i % 2 ? "#8d5524" : "#f1c9a5"} hair={i % 3 ? "#1c1917" : "#92400e"} />
          {p.word === "they" && <Kid x={p.x + 34} y={250} s={1.4} shirt="#16a34a" />}
          <g transform={`translate(${p.word === "they" ? p.x + 17 : p.x} 92)`}>
            <g>
              <animateTransform attributeName="transform" type="translate" values="0 0;0 -12;0 0;0 0" keyTimes="0;0.08;0.16;1" dur="6s" begin={`${-6 + (i === 4 ? 5 : i)}s`} repeatCount="indefinite" />
              <rect x="-26" y="-20" width="52" height="30" rx="6" fill="#fff" stroke={p.shirt} strokeWidth="3" />
              <text y="2" textAnchor="middle" fontSize="18" fontWeight="900" fill={ENG_DARK} fontFamily="Georgia, serif">
                {p.word}
              </text>
            </g>
          </g>
        </g>
      ))}
      {/* o gato é o "it" */}
      <g transform="translate(335 250)">
        <ellipse cx="0" cy="-14" rx="18" ry="12" fill="#f59e0b" />
        <circle cx="16" cy="-28" r="10" fill="#f59e0b" />
        <path d="M10 -36 L12 -46 L18 -38 Z M18 -38 L24 -46 L25 -34 Z" fill="#f59e0b" />
        <path d="M-18 -16 Q-30 -30 -22 -40" stroke="#f59e0b" strokeWidth="4" fill="none" strokeLinecap="round" />
        <g transform="translate(0 -158)">
          <g>
            <animateTransform attributeName="transform" type="translate" values="0 0;0 -12;0 0;0 0" keyTimes="0;0.08;0.16;1" dur="6s" begin="-2s" repeatCount="indefinite" />
            <rect x="-26" y="-20" width="52" height="30" rx="6" fill="#fff" stroke="#f59e0b" strokeWidth="3" />
            <text y="2" textAnchor="middle" fontSize="18" fontWeight="900" fill={ENG_DARK} fontFamily="Georgia, serif">
              it
            </text>
          </g>
        </g>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O montador de frases com o to be (de tocar)
// ---------------------------------------------------------------------------

const SUBJECTS: { pr: string; be: "am" | "is" | "are"; pt: string; neg: string }[] = [
  { pr: "I", be: "am", pt: "eu", neg: "I'm not" },
  { pr: "You", be: "are", pt: "você", neg: "You aren't" },
  { pr: "He", be: "is", pt: "ele", neg: "He isn't" },
  { pr: "She", be: "is", pt: "ela", neg: "She isn't" },
  { pr: "It", be: "is", pt: "ele/ela (coisa ou bicho)", neg: "It isn't" },
  { pr: "We", be: "are", pt: "nós", neg: "We aren't" },
  { pr: "They", be: "are", pt: "eles/elas", neg: "They aren't" },
];
const ADJECTIVES: [string, string][] = [
  ["happy", "feliz"],
  ["hungry", "com fome"],
  ["at school", "na escola"],
];

export function ToBeBuilder() {
  const [s, setS] = useState(3);
  const [form, setForm] = useState<"af" | "neg" | "q">("af");
  const [adj, setAdj] = useState(0);
  const sub = SUBJECTS[s];
  const [word] = ADJECTIVES[adj];
  const sentence = form === "af" ? `${sub.pr} ${sub.be} ${word}.` : form === "neg" ? `${sub.neg} ${word}.` : `${sub.be[0].toUpperCase()}${sub.be.slice(1)} ${sub.pr === "I" ? "I" : sub.pr.toLowerCase()} ${word}?`;
  const pill = (on: boolean) => `rounded-full border px-[0.6em] py-[0.05em] text-[0.8em] font-bold ${on ? "text-white" : "bg-white"}`;
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <div className="flex flex-wrap justify-center gap-[0.25em]">
        {SUBJECTS.map((x, i) => (
          <button key={x.pr} type="button" onClick={() => setS(i)} className={pill(s === i)} style={s === i ? { background: ENG_DARK, borderColor: ENG_DARK } : { borderColor: "#bfdbfe", color: ENG_DARK }}>
            {x.pr}
          </button>
        ))}
      </div>
      <div className="mt-[0.3em] flex flex-wrap justify-center gap-[0.25em]">
        {(
          [
            ["af", "Afirmativa"],
            ["neg", "Negativa"],
            ["q", "Pergunta"],
          ] as const
        ).map(([k, label]) => (
          <button key={k} type="button" onClick={() => setForm(k)} className={pill(form === k)} style={form === k ? { background: ENG, borderColor: ENG } : { borderColor: "#fecaca", color: ENG }}>
            {label}
          </button>
        ))}
        {ADJECTIVES.map(([en], i) => (
          <button key={en} type="button" onClick={() => setAdj(i)} className={pill(adj === i)} style={adj === i ? { background: "#16a34a", borderColor: "#16a34a" } : { borderColor: "#bbf7d0", color: "#166534" }}>
            {en}
          </button>
        ))}
      </div>
      <p key={sentence} className="cg-anim-pop mt-[0.4em] text-center text-[1.4em] font-black" style={{ color: ENG_DARK }}>
        {sentence} <Say text={sentence} />
      </p>
      <p className="text-center text-[0.8em] text-[#3b2a14]">
        {sub.pr} = {sub.pt} · o to be com {sub.pr} é <strong>{sub.be}</strong> · {ADJECTIVES[adj][1]}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Her dog e his dog
// ---------------------------------------------------------------------------

function Dog({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -5;0 0" dur="0.8s" repeatCount="indefinite" />
        <ellipse cx="0" cy="-16" rx="22" ry="12" fill={color} />
        <circle cx="22" cy="-28" r="11" fill={color} />
        <ellipse cx="28" cy="-36" rx="5" ry="9" fill="#1c1917" transform="rotate(30 28 -36)" />
        <circle cx="26" cy="-30" r="1.8" fill="#1c1917" />
        <path d="M-18 -10 L-18 0 M-8 -8 L-8 0 M8 -8 L8 0 M18 -10 L18 0" stroke={color} strokeWidth="5" strokeLinecap="round" />
        <path d="M-22 -20 Q-34 -30 -30 -38" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
}

function PossessiveArt() {
  return (
    <Art viewBox="0 0 560 190" label="À esquerda, a Maria e o cachorro dela: her dog. À direita, o João e o cachorro dele: his dog">
      <rect width="560" height="190" rx="14" fill="#eff6ff" />
      <Kid x={80} y={165} s={1.6} shirt="#db2777" hair="#92400e" skin="#f1c9a5" />
      <Dog x={150} y={165} color="#a16207" />
      <Kid x={370} y={165} s={1.6} shirt="#2563eb" skin="#8d5524" hair="#1c1917" />
      <Dog x={440} y={165} color="#e5e7eb" />
      <g fontFamily="Georgia, serif" fontWeight="900" textAnchor="middle">
        <text x="125" y="34" fontSize="18" fill="#db2777">
          Maria and her dog
        </text>
        <text x="415" y="34" fontSize="18" fill="#2563eb">
          João and his dog
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O jogo do to be
// ---------------------------------------------------------------------------

const TO_BE_GAME = [
  { prompt: "“She ___ my sister.”", options: ["am", "is", "are"], answer: 1, explain: "Com he, she e it, o to be é is: she is (she's)." },
  { prompt: "“I ___ twelve years old.”", options: ["am", "is", "are"], answer: 0, explain: "Com I é sempre am. E idade em inglês usa o to be: I am 12." },
  { prompt: "“They ___ my friends.”", options: ["am", "is", "are"], answer: 2, explain: "Com we, you e they, o to be é are." },
  { prompt: "“This is Maria. ___ dog is cute.”", options: ["His", "Her", "Its"], answer: 1, explain: "O cachorro é da Maria, uma mulher: her dog." },
  { prompt: "“___ going to the park.” (eles estão)", options: ["Their", "There", "They're"], answer: 2, explain: "They're = they are. Their é “deles” e there é “lá”." },
];

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 2, content, bare });

export const chapter2: BookPage[] = [
  page(
    <ChapterOpener
      n={2}
      title="Verb To Be and Pronouns"
      goals={["Os pronomes pessoais (I, you, he, she…)", "O verbo to be: am, is e are", "A negativa e a pergunta com o to be", "Os possessivos (my, your, his, her…)"]}
    >
      <Fig h={34}>
        <PronounsOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🙋">Os pronomes pessoais</H>
      <P>Os pronomes ficam no lugar do nome da pessoa (ou da coisa). Em inglês, o <T>I</T> (eu) é sempre escrito com letra maiúscula.</P>
      <Table
        head={["Pronome", "Português", "Pronome", "Português"]}
        rows={[
          [<En key="i">I</En>, "eu", <En key="we">we</En>, "nós"],
          [<En key="y">you</En>, "você", <En key="ys">you</En>, "vocês"],
          [<En key="h">he</En>, "ele", <En key="t">they</En>, "eles, elas"],
          [<En key="s">she</En>, "ela", "", ""],
          [<En key="it">it</En>, "coisa ou bicho", "", ""],
        ]}
      />
      <Box kind="lembre">
        Use <strong>it</strong> pra objetos e animais (quando o sexo não importa): <em>the cat → it</em>, <em>the book → it</em>.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🧩">O verbo to be</H>
      <P>
        O <T>to be</T> é o “ser” e o “estar” ao mesmo tempo. No presente ele tem três formas: <T>am</T> (com I), <T>is</T> (com he, she, it) e <T>are</T> (com you, we,
        they). Na negativa, o <T>not</T> vem depois; na pergunta, o verbo vai pra frente. Monte frases:
      </P>
      <ToBeBuilder />
    </>,
  ),

  page(
    <>
      <H icon="🐶">Os possessivos</H>
      <P>
        Os <T>possessivos</T> dizem de quem é a coisa e vêm antes do nome: <em>my book</em> (meu livro). Pra algo de uma mulher, <T>her</T>; de um homem, <T>his</T>.
      </P>
      <Fig n="2.1" caption="Her dog é o cachorro dela; his dog é o cachorro dele." h={18}>
        <PossessiveArt />
      </Fig>
      <Table
        head={["Pronome", "Possessivo", "Pronome", "Possessivo"]}
        rows={[
          ["I", "my (meu)", "it", "its (dele, de coisa)"],
          ["you", "your (seu)", "we", "our (nosso)"],
          ["he · she", "his · her", "they", "their (deles)"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="✏️">Contrações e o jogo do to be</H>
      <P>
        Na fala, o to be se junta ao pronome: I am → <T>I&apos;m</T>, she is → <T>she&apos;s</T>, they are → <T>they&apos;re</T>. E cuidado com três palavras que soam
        parecido: <em>they&apos;re</em> (eles são), <em>their</em> (deles) e <em>there</em> (lá).
      </P>
      <ChoiceGame items={TO_BE_GAME} color={ENG} title="Complete com a forma certa" />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Pronomes: I, you, he, she, it, we, they. O I é sempre maiúsculo.",
          "O to be é am (I), is (he, she, it) e are (you, we, they).",
          "Negativa: she is not (isn't) happy. Pergunta: Are you Brazilian?",
          "Possessivos vêm antes do nome: my, your, his, her, its, our, their.",
          "They're (eles são), their (deles) e there (lá) soam parecido mas são diferentes.",
        ]}
      />
      <Glossary
        items={[
          ["Pronoun", "Pronome."],
          ["To be", "Ser ou estar."],
          ["Possessive", "Possessivo: diz de quem é."],
          ["Contraction", "A forma juntinha: I'm, she's, they're."],
          ["Mine", "Meu, usado sozinho: the book is mine."],
        ]}
      />
      <Quiz
        items={[
          ["Complete: “She ___ my sister.”", "is."],
          ["Qual pronome substitui “the cat”?", "It."],
          ["Como fica a pergunta de “You are Brazilian”?", "Are you Brazilian?"],
          ["Qual é a forma contraída de “they are”?", "They're."],
        ]}
      />
    </>,
  ),
];
