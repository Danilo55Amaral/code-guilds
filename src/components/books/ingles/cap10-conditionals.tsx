"use client";

import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { ChoiceGame } from "../portugues/art";
import { ENG, ENG_DARK, Say, WordCards } from "./art";

// ============================================================================
// CAPÍTULO 10 — CONDITIONALS, PASSIVE AND PHRASAL VERBS (missão "Inglês:
// Conditionals, Passive and Phrasal Verbs"): o interruptor que acende a
// lâmpada, a chaleira fervendo do zero conditional, o jogo dos conditionals,
// o bolo da voz passiva e as cartas dos phrasal verbs.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o interruptor e a lâmpada
// ---------------------------------------------------------------------------

function SwitchOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Um dedo aperta o interruptor e a lâmpada acende e apaga: If you turn on the switch, the light turns on">
      <rect width="460" height="300" fill="#1e293b">
        <animate attributeName="fill" values="#1e293b;#1e293b;#fef9c3;#fef9c3;#1e293b" keyTimes="0;0.3;0.32;0.8;0.82" dur="5s" repeatCount="indefinite" />
      </rect>
      {/* a lâmpada */}
      <line x1="300" y1="0" x2="300" y2="70" stroke="#94a3b8" strokeWidth="3" />
      <circle cx="300" cy="120" r="70" fill="#fde047" opacity="0">
        <animate attributeName="opacity" values="0;0;0.45;0.45;0" keyTimes="0;0.3;0.32;0.8;0.82" dur="5s" repeatCount="indefinite" />
      </circle>
      <rect x="288" y="70" width="24" height="20" rx="3" fill="#64748b" />
      <circle cx="300" cy="115" r="30" fill="#e5e7eb" stroke="#94a3b8" strokeWidth="3">
        <animate attributeName="fill" values="#e5e7eb;#e5e7eb;#fde047;#fde047;#e5e7eb" keyTimes="0;0.3;0.32;0.8;0.82" dur="5s" repeatCount="indefinite" />
      </circle>
      <path d="M292 115 Q296 104 300 115 Q304 104 308 115" stroke="#a16207" strokeWidth="2" fill="none" />
      {/* o interruptor */}
      <rect x="90" y="110" width="70" height="110" rx="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="3" />
      <rect x="110" y="135" width="30" height="60" rx="6" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
      <rect x="114" y="164" width="22" height="26" rx="4" fill={ENG}>
        <animate attributeName="y" values="164;164;140;140;164" keyTimes="0;0.28;0.3;0.8;0.82" dur="5s" repeatCount="indefinite" />
      </rect>
      {/* o dedo */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="40 30;0 0;0 0;40 30;40 30" keyTimes="0;0.28;0.34;0.5;1" dur="5s" repeatCount="indefinite" />
        <path d="M150 150 L210 190 Q222 198 214 208 L196 214 L140 170 Z" fill="#f1c9a5" stroke="#c2956b" strokeWidth="2" />
      </g>
      <rect x="25" y="249" width="410" height="32" rx="16" fill="#fff" />
      <text x="230" y="270" textAnchor="middle" fontSize="16" fontWeight="900" fill={ENG} fontFamily="Georgia, serif">
        If you press the switch, the light turns on.
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A chaleira fervendo (zero conditional)
// ---------------------------------------------------------------------------

function KettleArt() {
  return (
    <Art viewBox="0 0 560 170" label="Uma chaleira no fogão soltando vapor, com o termômetro em 100 graus: if you heat water to 100 °C, it boils">
      <rect width="560" height="170" rx="14" fill="#eff6ff" />
      <rect x="60" y="140" width="160" height="14" rx="3" fill="#475569" />
      {[100, 140, 180].map((x, i) => (
        <path key={x} d={`M${x - 8} 140 Q${x} 124 ${x + 8} 140 Z`} fill="#f97316">
          <animate attributeName="d" values={`M${x - 8} 140 Q${x} 124 ${x + 8} 140 Z;M${x - 8} 140 Q${x} 118 ${x + 8} 140 Z;M${x - 8} 140 Q${x} 124 ${x + 8} 140 Z`} dur="0.5s" begin={`${-i * 0.15}s`} repeatCount="indefinite" />
        </path>
      ))}
      <path d="M90 128 Q90 70 140 70 Q190 70 190 128 Z" fill="#94a3b8" stroke="#475569" strokeWidth="3" />
      <path d="M190 100 L224 82" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
      <path d="M120 72 Q140 50 160 72" fill="none" stroke="#1e293b" strokeWidth="5" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx="232" cy="76" r="8" fill="#e2e8f0">
          <animate attributeName="cy" values="76;20" dur="2s" begin={`${-i * 0.66}s`} repeatCount="indefinite" />
          <animate attributeName="r" values="6;16" dur="2s" begin={`${-i * 0.66}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0" dur="2s" begin={`${-i * 0.66}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <g fontFamily="Georgia, serif" fontWeight="900">
        <text x="290" y="64" fontSize="16" fill={ENG_DARK}>
          If you heat water to 100 °C,
        </text>
        <text x="290" y="92" fontSize="16" fill={ENG}>
          it boils.
        </text>
        <text x="290" y="128" fontSize="12" fill="#475569">
          zero conditional: sempre acontece
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O jogo dos conditionals
// ---------------------------------------------------------------------------

const IF_GAME = [
  { prompt: "“If you heat water to 100 °C, it ___.”", options: ["boils", "will boil", "would boil"], answer: 0, explain: "Zero conditional (fatos): os dois verbos no presente." },
  { prompt: "“If it rains tomorrow, I ___ at home.”", options: ["stay", "will stay", "stayed"], answer: 1, explain: "First conditional (possível no futuro): if + presente, will + verbo." },
  { prompt: "“If I ___ rich, I would travel the world.”", options: ["am", "were", "will be"], answer: 1, explain: "Second conditional (imaginário): if + passado, would + verbo. Com o to be, usa-se were." },
  { prompt: "“If I had wings, I ___ fly.”", options: ["will", "would", "do"], answer: 1, explain: "Situação imaginária: would fly (voaria)." },
];

// ---------------------------------------------------------------------------
// O bolo da voz passiva
// ---------------------------------------------------------------------------

function PassiveArt() {
  return (
    <Art viewBox="0 0 560 180" label="Um bolo e duas frases: My mom made the cake vira The cake was made by my mom; as palavras mom e cake trocam de lugar">
      <rect width="560" height="180" rx="14" fill="#fff7ed" />
      <text x="80" y="110" textAnchor="middle" fontSize="64">
        🎂
      </text>
      <g fontFamily="Georgia, serif" fontWeight="900" fontSize="18">
        <text x="150" y="60" fill="#475569">
          ativa:
        </text>
        <text x="210" y="60" fill={ENG_DARK}>
          My mom made the cake.
        </text>
        <text x="150" y="130" fill="#475569">
          passiva:
        </text>
        <text x="230" y="130" fill={ENG}>
          The cake was made by my mom.
        </text>
      </g>
      {/* o cake e o mom trocando de lugar */}
      <path d="M390 68 Q340 96 290 114" fill="none" stroke="#f97316" strokeWidth="2.5" strokeDasharray="6 4" className="cg-anim-dash" />
      <path d="M255 68 Q370 100 462 114" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="6 4" className="cg-anim-dash" />
      <text x="390" y="165" textAnchor="middle" fontSize="12" fontWeight="900" fill="#9a3412" fontFamily="Georgia, serif">
        to be + particípio, e quem fez vem depois do by
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 10, content, bare });

export const chapter10: BookPage[] = [
  page(
    <ChapterOpener
      n={10}
      title="Conditionals, Passive and Phrasal Verbs"
      goals={["O zero e o first conditional", "O second conditional, o que é imaginário", "A voz passiva", "Os phrasal verbs mais usados"]}
    >
      <Fig h={34}>
        <SwitchOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="💡">Zero e first conditional</H>
      <P>
        Os <T>conditionals</T> são as frases com <T>if</T> (se). O <T>zero conditional</T> fala de fatos que sempre acontecem (presente + presente). O{" "}
        <T>first conditional</T> fala do que é possível no futuro (if + presente, will + verbo).
      </P>
      <Fig n="10.1" caption="Esquentou a água a 100 °C, ela ferve. Sempre!" h={18}>
        <KettleArt />
      </Fig>
      <Box kind="lembre">
        First conditional: <em>If it rains tomorrow, I will stay at home</em> <Say text="If it rains tomorrow, I will stay at home." /> (se chover amanhã, vou ficar em
        casa).
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="💭">Second conditional</H>
      <P>
        O <T>second conditional</T> fala do que é imaginário ou pouco provável: <T>if + passado, would + verbo</T>. Com o to be, usa-se <T>were</T> pra todas as pessoas:{" "}
        <em>If I were rich, I would travel the world</em>.
      </P>
      <ChoiceGame items={IF_GAME} color={ENG} title="Complete o if" />
      <Box kind="mago" title="Um conselho em inglês">
        Pra dar conselho, use <strong>If I were you, I would…</strong> (se eu fosse você, eu…): <em>If I were you, I would study for the test</em>{" "}
        <Say text="If I were you, I would study for the test." />.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🎂">A voz passiva</H>
      <P>
        Na <T>voz passiva</T>, o foco está em quem sofre a ação. Ela usa <T>to be + particípio</T>, e quem fez a ação vem depois do <T>by</T> (se a gente quiser dizer).
      </P>
      <Fig n="10.2" caption="Da voz ativa pra passiva." h={18}>
        <PassiveArt />
      </Fig>
      <Table
        head={["Ativa", "Passiva"]}
        rows={[
          ["People speak English all over the world.", "English is spoken all over the world."],
          ["Santos Dumont invented the 14-bis.", "The 14-bis was invented by Santos Dumont."],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🧩">Phrasal verbs</H>
      <P>
        <T>Phrasal verbs</T> são verbos com uma partícula (up, off, for, out…) que muda o sentido: <em>look</em> é olhar, mas <em>look for</em> é procurar. Vire as cartas:
      </P>
      <WordCards
        cols={3}
        items={[
          ["give up", "desistir"],
          ["look for", "procurar"],
          ["look after", "cuidar de"],
          ["turn on", "ligar, acender"],
          ["turn off", "desligar, apagar"],
          ["find out", "descobrir"],
          ["wake up", "acordar"],
          ["get up", "levantar"],
          ["look forward to", "esperar ansioso"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Zero conditional: fatos (If you heat water to 100 °C, it boils).",
          "First conditional: possível no futuro (If it rains, I will stay at home).",
          "Second conditional: imaginário (If I were rich, I would travel).",
          "Voz passiva = to be + particípio: The cake was made by my mom.",
          "Phrasal verbs: give up (desistir), look for (procurar), turn on (ligar), find out (descobrir).",
        ]}
      />
      <Glossary
        items={[
          ["If", "Se."],
          ["Would", "O “-ria” do português (would travel = viajaria)."],
          ["By", "Por (na voz passiva)."],
          ["Give up", "Desistir."],
          ["Find out", "Descobrir."],
        ]}
      />
      <Quiz
        items={[
          ["Complete: “If it rains tomorrow, I ___ at home.”", "will stay."],
          ["Complete: “If I ___ rich, I would travel the world.”", "were."],
          ["Passe pra passiva: “People speak English all over the world.”", "English is spoken all over the world."],
          ["O que significa “give up”?", "Desistir."],
        ]}
      />
    </>,
  ),
];
