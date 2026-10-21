"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { ChoiceGame } from "../portugues/art";
import { ENG, ENG_DARK, Say } from "./art";

// ============================================================================
// CAPÍTULO 5 — SIMPLE PRESENT AND DAILY ROUTINE (missão "Inglês: Simple
// Present and Daily Routine"): o despertador tocando ao nascer do sol, o jogo
// do -s, -es e -ies, o relógio da rotina (de tocar) e a régua da frequência.
// ============================================================================

const HOURS = ["twelve", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven"];

/** A hora em inglês: “seven o'clock”, “half past seven” ou “noon”. */
function timeInEnglish(h: number, m: number): string {
  if (h === 12 && m === 0) return "noon";
  const word = HOURS[h % 12];
  return m === 0 ? `${word} o'clock` : `half past ${word}`;
}

/** O relógio de ponteiros (o centro em cx, cy). */
function ClockFace({ cx, cy, r, h, m }: { cx: number; cy: number; r: number; h: number; m: number }) {
  const hourAngle = ((h % 12) + m / 60) * 30;
  const minAngle = m * 6;
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle r={r} fill="#fff" stroke={ENG_DARK} strokeWidth={r * 0.08} />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1="0" y1={-r * 0.82} x2="0" y2={-r * (i % 3 ? 0.88 : 0.72)} stroke={ENG_DARK} strokeWidth={r * 0.04} transform={`rotate(${i * 30})`} />
      ))}
      <line x1="0" y1="0" x2="0" y2={-r * 0.48} stroke={ENG_DARK} strokeWidth={r * 0.08} strokeLinecap="round" transform={`rotate(${hourAngle})`} />
      <line x1="0" y1="0" x2="0" y2={-r * 0.72} stroke={ENG} strokeWidth={r * 0.05} strokeLinecap="round" transform={`rotate(${minAngle})`} />
      <circle r={r * 0.06} fill={ENG_DARK} />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Abertura: o despertador ao nascer do sol
// ---------------------------------------------------------------------------

function AlarmOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="O sol nascendo atrás de um despertador que treme tocando às sete horas, com a frase I wake up at seven o'clock">
      <rect width="460" height="300" fill="#fef3c7" />
      <circle cx="230" cy="250" r="120" fill="#fde047" opacity="0.6">
        <animate attributeName="cy" values="300;230;230" keyTimes="0;0.4;1" dur="6s" repeatCount="indefinite" />
      </circle>
      <rect y="240" width="460" height="60" fill="#fdba74" />
      <g transform="translate(230 150)">
        <g>
          <animateTransform attributeName="transform" type="rotate" values="-6;6;-6;6;0;0" keyTimes="0;0.05;0.1;0.15;0.2;1" dur="2.4s" repeatCount="indefinite" />
          <circle cx="-56" cy="-62" r="22" fill={ENG} stroke="#7f1d1d" strokeWidth="4" />
          <circle cx="56" cy="-62" r="22" fill={ENG} stroke="#7f1d1d" strokeWidth="4" />
          <path d="M-50 70 L-62 92 M50 70 L62 92" stroke="#7f1d1d" strokeWidth="8" strokeLinecap="round" />
          <circle r="80" fill={ENG} stroke="#7f1d1d" strokeWidth="5" />
          <ClockFace cx={0} cy={0} r={64} h={7} m={0} />
        </g>
      </g>
      <text x="230" y="282" textAnchor="middle" fontSize="20" fontWeight="900" fill={ENG_DARK} fontFamily="Georgia, serif">
        I wake up at seven o&apos;clock.
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O jogo do -s, -es e -ies
// ---------------------------------------------------------------------------

const S_GAME = [
  { prompt: "She ___ to school every day. (go)", options: ["go", "gos", "goes"], answer: 2, explain: "Verbos terminados em -o ganham -es: go → goes, do → does." },
  { prompt: "He ___ TV after dinner. (watch)", options: ["watchs", "watches", "watch"], answer: 1, explain: "Terminados em -ch, -sh, -ss, -x ganham -es: watches, washes." },
  { prompt: "My brother ___ every night. (study)", options: ["studys", "studies", "studyes"], answer: 1, explain: "Consoante + y vira -ies: study → studies, fly → flies." },
  { prompt: "Ana ___ the guitar. (play)", options: ["plaies", "plays", "play"], answer: 1, explain: "Vogal + y só ganha -s: play → plays." },
  { prompt: "I ___ soccer on Saturdays. (play)", options: ["plays", "play", "playes"], answer: 1, explain: "Com I, you, we e they o verbo não muda: I play." },
];

// ---------------------------------------------------------------------------
// O relógio da rotina (de tocar)
// ---------------------------------------------------------------------------

const ROUTINE: { h: number; m: number; en: string; pt: string; icon: string }[] = [
  { h: 7, m: 0, en: "I wake up", pt: "Eu acordo", icon: "⏰" },
  { h: 7, m: 30, en: "I brush my teeth", pt: "Eu escovo os dentes", icon: "🦷" },
  { h: 8, m: 0, en: "I have breakfast", pt: "Eu tomo café da manhã", icon: "🥣" },
  { h: 8, m: 30, en: "I go to school", pt: "Eu vou pra escola", icon: "🏫" },
  { h: 12, m: 0, en: "I have lunch", pt: "Eu almoço", icon: "🍛" },
  { h: 3, m: 0, en: "I do my homework", pt: "Eu faço a lição de casa", icon: "📚" },
  { h: 5, m: 0, en: "I play soccer", pt: "Eu jogo futebol", icon: "⚽" },
  { h: 7, m: 30, en: "I have dinner", pt: "Eu janto", icon: "🍝" },
  { h: 9, m: 0, en: "I go to bed", pt: "Eu vou dormir", icon: "🛌" },
];

export function RoutineClock() {
  const [i, setI] = useState(0);
  const r = ROUTINE[i];
  const t = timeInEnglish(r.h, r.m);
  const sentence = `${r.en} at ${t}.`;
  const night = i >= 7;
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.5em]">
      <div className="flex items-center gap-[0.6em]">
        <svg viewBox="0 0 100 100" className="h-[6em] w-[6em] shrink-0 rounded-full" style={{ background: night ? "#1e3a8a" : "#fde68a" }} aria-label={`Relógio marcando ${t}`}>
          <ClockFace cx={50} cy={50} r={44} h={r.h} m={r.m} />
        </svg>
        <div key={i} className="cg-anim-fade min-w-0 flex-1">
          <p className="text-[1.6em] leading-none">{r.icon}</p>
          <p className="mt-[0.15em] text-[1.1em] font-black leading-tight" style={{ color: ENG_DARK }}>
            {sentence} <Say text={sentence} />
          </p>
          <p className="text-[0.82em] text-[#3b2a14]">{r.pt}.</p>
        </div>
      </div>
      <input type="range" min={0} max={ROUTINE.length - 1} value={i} onChange={(e) => setI(Number(e.target.value))} className="mt-[0.4em] w-full accent-[#dc2626]" aria-label="A hora do dia" />
      <p className="text-center text-[0.72em] text-[#8a7146]">Arraste pra passar o dia.</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A régua da frequência
// ---------------------------------------------------------------------------

function FrequencyArt() {
  const words = [
    { w: "never", pct: "0%", c: "#64748b" },
    { w: "sometimes", pct: "50%", c: "#f59e0b" },
    { w: "usually", pct: "80%", c: "#16a34a" },
    { w: "always", pct: "100%", c: ENG },
  ];
  return (
    <Art viewBox="0 0 560 150" label="Uma régua de 0 a 100 por cento: never, sometimes, usually e always, com uma barra enchendo">
      <rect width="560" height="150" rx="14" fill="#eff6ff" />
      <rect x="40" y="70" width="480" height="20" rx="10" fill="#e2e8f0" />
      <rect x="40" y="70" width="480" height="20" rx="10" fill={ENG}>
        <animate attributeName="width" values="0;480;480" keyTimes="0;0.7;1" dur="4s" repeatCount="indefinite" />
      </rect>
      {words.map((w, i) => {
        const x = 40 + [0, 0.5, 0.8, 1][i] * 480;
        return (
          <g key={w.w}>
            <line x1={x} y1="62" x2={x} y2="98" stroke="#1e293b" strokeWidth="2" />
            <text x={x} y="50" textAnchor="middle" fontSize="16" fontWeight="900" fill={w.c} fontFamily="Georgia, serif">
              {w.w}
            </text>
            <text x={x} y="118" textAnchor="middle" fontSize="12" fontWeight="700" fill="#475569" fontFamily="Georgia, serif">
              {w.pct}
            </text>
          </g>
        );
      })}
    </Art>
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
      title="Simple Present and Daily Routine"
      goals={["O simple present e o -s de he, she e it", "As regras do -es e do -ies", "Do e does nas perguntas e negativas", "A rotina, as horas e a frequência"]}
    >
      <Fig h={34}>
        <AlarmOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🔁">O simple present</H>
      <P>
        O <T>simple present</T> fala de hábitos, rotinas e verdades: <em>I play soccer on Saturdays</em>. Com <T>he, she e it</T>, o verbo ganha um <T>-s</T>.
      </P>
      <Table
        head={["Sujeito", "Verbo", "Exemplo"]}
        rows={[
          ["I · you · we · they", "play", "I play soccer."],
          ["he · she · it", "plays", "She plays soccer."],
          ["I · you · we · they", "like", "We like pizza."],
          ["he · she · it", "likes", "He likes pizza."],
        ]}
      />
      <Box kind="mago" title="Truque do -s">
        Lembre do “3º lugar do pódio”: he, she e it são a 3ª pessoa do singular, a única que ganha o -s.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="✍️">-s, -es ou -ies?</H>
      <P>
        Verbos terminados em <T>-ch, -sh, -ss, -x e -o</T> ganham <T>-es</T>. Os terminados em <T>consoante + y</T> trocam o y por <T>-ies</T>. Teste:
      </P>
      <ChoiceGame items={S_GAME} color={ENG} title="Qual é a forma certa?" />
    </>,
  ),

  page(
    <>
      <H icon="❔">Do, does, don&apos;t e doesn&apos;t</H>
      <P>
        Pra perguntar e negar, o simple present usa os ajudantes <T>do</T> e <T>does</T>. Com does e doesn&apos;t, o verbo <T>perde o -s</T>.
      </P>
      <Table
        head={["", "I · you · we · they", "he · she · it"]}
        rows={[
          ["Pergunta", "Do you speak English?", "Does she speak English?"],
          ["Negativa", "I don't like fish.", "He doesn't like fish."],
          ["Resposta curta", "Yes, I do. / No, I don't.", "Yes, she does. / No, she doesn't."],
        ]}
      />
      <Fig n="5.1" caption="Do never ao always: o quanto você faz alguma coisa." h={14}>
        <FrequencyArt />
      </Fig>
    </>,
  ),

  page(
    <>
      <H icon="⏰">Daily routine</H>
      <P>
        Pra perguntar as horas: <em>What time is it?</em> Hora cheia é <T>o&apos;clock</T> (seven o&apos;clock) e a meia hora é <T>half past</T> (half past seven). Passe o
        dia:
      </P>
      <RoutineClock />
      <Box kind="lembre">
        Os advérbios de frequência vêm antes do verbo: <em>I always eat vegetables</em>, <em>She never drinks soda</em>.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "O simple present fala de hábitos e rotinas: I play soccer on Saturdays.",
          "Com he, she e it, o verbo ganha -s (plays), -es (goes, watches) ou -ies (studies).",
          "Do e does fazem perguntas; don't e doesn't fazem negativas (e o verbo perde o -s).",
          "What time is it? It's seven o'clock / half past seven.",
          "Always, usually, sometimes e never mostram a frequência e vêm antes do verbo.",
        ]}
      />
      <Glossary
        items={[
          ["Wake up", "Acordar."],
          ["Brush my teeth", "Escovar os dentes."],
          ["O'clock", "Hora cheia."],
          ["Always", "Sempre."],
          ["Sometimes", "Às vezes."],
        ]}
      />
      <Quiz
        items={[
          ["Complete: “She ___ to school every day.” (go)", "goes."],
          ["Como fica a negativa de “He likes pizza”?", "He doesn't like pizza."],
          ["Qual é o -s de “study” com he?", "studies."],
          ["O que significa “What time is it?”?", "Que horas são?"],
        ]}
      />
    </>,
  ),
];
