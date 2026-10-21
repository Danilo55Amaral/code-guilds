"use client";

import { useEffect, useRef, useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { ChoiceGame } from "../portugues/art";
import { BlocksG, type Blk, OrangeCat, Panel, SCR, SCR_DARK, Script, StageFrame } from "./art";

// ============================================================================
// CAPÍTULO 5 — CONTROLE: REPETIÇÕES E CONDIÇÕES (missões "Blocos de Código no
// Scratch" e "Scratch parte 3", a parte do Controle): a seta da repetição
// girando, o executor do repita (de tocar), o gato seguindo o mouse pra
// sempre, o caminho do se… senão e o jogo de seguir o código.
// ============================================================================

const FLAG = "quando 🚩 for clicado";

// ---------------------------------------------------------------------------
// Abertura: a seta da repetição
// ---------------------------------------------------------------------------

function LoopOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma grande seta circular girando em volta do gato, que dá passinhos sem parar, com o bloco repita 4 vezes ao lado">
      <rect width="460" height="300" fill="#fff7ed" />
      <g transform="translate(150 150)">
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="5s" repeatCount="indefinite" />
          <path d="M0 -100 A100 100 0 1 1 -96 -28" fill="none" stroke="#FFAB19" strokeWidth="16" strokeLinecap="round" />
          <path d="M-118 -38 L-96 -8 L-74 -40 Z" fill="#FFAB19" />
        </g>
      </g>
      {[0, 1].map((c) => (
        <g key={c} opacity={c ? 0 : 1}>
          <animate attributeName="opacity" values={c ? "0;1" : "1;0"} keyTimes="0;0.5" dur="0.6s" calcMode="discrete" repeatCount="indefinite" />
          <OrangeCat x={140} y={196} s={1.5} costume={c as 0 | 1} />
        </g>
      ))}
      <BlocksG blocks={[{ c: "con", t: "repita (4) vezes", inner: [{ c: "mov", t: "mova (10) passos" }] }]} x={290} y={110} />
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O executor do repita (de tocar)
// ---------------------------------------------------------------------------

export function LoopRunner() {
  const [times, setTimes] = useState(4);
  const [steps, setSteps] = useState(10);
  const [done, setDone] = useState(0); // quantas voltas já rodaram
  const timer = useRef<number | null>(null);
  useEffect(() => () => {
    if (timer.current) window.clearInterval(timer.current);
  }, []);
  function run() {
    if (timer.current) window.clearInterval(timer.current);
    setDone(0);
    let n = 0;
    timer.current = window.setInterval(() => {
      n++;
      setDone(n);
      if (n >= times && timer.current) window.clearInterval(timer.current);
    }, 450);
  }
  const scale = 300 / (6 * 50); // 6 vezes × 50 passos cabem no palco
  return (
    <Panel title="Rode o repita">
      <div className="flex flex-wrap items-center justify-center gap-[0.6em]">
        <Script em={0.048} scripts={[[{ c: "eve", t: FLAG, hat: true }, { c: "mov", t: "vá para x: (-150) y: (0)" }, { c: "con", t: `repita (${times}) vezes`, inner: [{ c: "mov", t: `mova (${steps}) passos` }] }]]} />
        <div className="min-w-[12em] flex-1 space-y-[0.25em]">
          <svg viewBox="0 0 340 90" className="block h-[4.6em] w-full rounded-md border border-[#cbd5e1] bg-white" aria-label={`O gato andou ${done * steps} passos`}>
            {Array.from({ length: times + 1 }, (_, i) => (
              <line key={i} x1={20 + i * steps * scale} y1="74" x2={20 + i * steps * scale} y2="86" stroke={i <= done ? SCR : "#cbd5e1"} strokeWidth="2" />
            ))}
            <line x1="20" y1="80" x2={20 + times * steps * scale} y2="80" stroke="#e2e8f0" strokeWidth="2" />
            <g style={{ transform: `translate(${20 + done * steps * scale}px, 72px)`, transition: "transform 0.35s ease-out" }}>
              <OrangeCat s={0.9} costume={(done % 2) as 0 | 1} />
            </g>
          </svg>
          <div className="flex flex-wrap items-center justify-center gap-[0.4em] text-[0.8em] font-bold text-[#3b2a14]">
            <label className="flex items-center gap-[0.2em]">
              vezes
              <input type="range" min={1} max={6} value={times} onChange={(e) => setTimes(Number(e.target.value))} className="w-[4em] accent-[#ffab19]" />
              {times}
            </label>
            <label className="flex items-center gap-[0.2em]">
              passos
              <input type="range" min={10} max={50} step={10} value={steps} onChange={(e) => setSteps(Number(e.target.value))} className="w-[4em] accent-[#4c97ff]" />
              {steps}
            </label>
            <button type="button" onClick={run} className="rounded-full bg-[#4cbf56] px-[0.8em] py-[0.05em] font-black text-white">
              ▶ Rodar
            </button>
          </div>
          <p className="text-center text-[0.85em] font-black" style={{ color: SCR_DARK }}>
            {done} de {times} voltas · {done * steps} de {times * steps} passos ({times} × {steps})
          </p>
        </div>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// O gato seguindo o mouse pra sempre
// ---------------------------------------------------------------------------

function ForeverArt() {
  const path = "M60 120 C120 30 220 30 250 100 C280 160 160 170 120 130 C90 100 160 60 220 80";
  return (
    <Art viewBox="0 0 560 190" label="O ponteiro do mouse passeia pelo palco e o gato vai atrás dele sem parar, por causa do bloco sempre">
      <rect width="560" height="190" rx="14" fill="#fff7ed" />
      <StageFrame x={20} y={14} w={290} h={164} />
      <g>
        <animateMotion path={path} dur="6s" repeatCount="indefinite" />
        <path d="M0 0 L0 18 L5 13 L9 22 L12 20 L8 12 L15 12 Z" fill="#fff" stroke="#1e293b" strokeWidth="1.5" />
      </g>
      <g>
        <animateMotion path={path} dur="6s" begin="-5.4s" repeatCount="indefinite" />
        <g transform="translate(-8 22)">
          <OrangeCat s={0.8} />
        </g>
      </g>
      <g transform="translate(316 16) scale(0.86)">
        <BlocksG
          blocks={[
            { c: "eve", t: FLAG, hat: true },
            { c: "con", t: "sempre", inner: [{ c: "mov", t: "aponte para [ponteiro do mouse]" }, { c: "mov", t: "mova (5) passos" }] },
          ]}
          x={0}
          y={0}
        />
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O caminho do se… senão
// ---------------------------------------------------------------------------

const IF_ELSE: Blk[] = [
  {
    c: "con",
    t: "se «tocando em [Maçã]?» então",
    inner: [{ c: "var", t: "adicione (1) a [pontos]" }, { c: "som", t: "toque o som [Pop]" }],
    mid: "senão",
    inner2: [{ c: "mov", t: "mova (5) passos" }],
  },
];

function DecisionArt() {
  return (
    <Art viewBox="0 0 560 200" label="Um losango de decisão: está tocando na maçã? Se sim, ganha 1 ponto; se não, continua andando. Uma bolinha percorre os dois caminhos">
      <rect width="560" height="200" rx="14" fill="#fff7ed" />
      <polygon points="150,30 250,90 150,150 50,90" fill="#5CB1D6" stroke="#2E8EB8" strokeWidth="3" />
      <text x="150" y="86" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff" fontFamily="Helvetica, Arial, sans-serif">
        tocando na
      </text>
      <text x="150" y="102" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff" fontFamily="Helvetica, Arial, sans-serif">
        maçã? 🍎
      </text>
      <path d="M250 90 L300 90 L300 50 L330 50" fill="none" stroke="#16a34a" strokeWidth="3" />
      <path d="M150 150 L150 175 L330 175" fill="none" stroke="#dc2626" strokeWidth="3" />
      <g fontFamily="Georgia, serif" fontWeight="900" fontSize="13">
        <text x="262" y="82" fill="#16a34a">
          sim
        </text>
        <text x="160" y="170" fill="#dc2626">
          não
        </text>
      </g>
      <rect x="330" y="32" width="200" height="36" rx="8" fill="#FF8C1A" />
      <text x="430" y="55" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff" fontFamily="Helvetica, Arial, sans-serif">
        então: +1 ponto!
      </text>
      <rect x="330" y="157" width="200" height="36" rx="8" fill="#4C97FF" />
      <text x="430" y="180" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff" fontFamily="Helvetica, Arial, sans-serif">
        senão: continua andando
      </text>
      <circle r="7" fill="#fde047" stroke="#a16207" strokeWidth="2">
        <animateMotion path="M150 10 L150 30 L150 90 L250 90 L300 90 L300 50 L330 50 M150 10 L150 150 L150 175 L330 175" dur="6s" repeatCount="indefinite" />
      </circle>
      <line x1="150" y1="6" x2="150" y2="30" stroke="#94a3b8" strokeWidth="3" />
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O jogo de seguir o código
// ---------------------------------------------------------------------------

const TRACE_GAME = [
  { prompt: "“repita 4 vezes: mova 10 passos”. Quantos passos ao todo?", options: ["10", "14", "40"], answer: 2, explain: "O repita roda o de dentro 4 vezes: 10 + 10 + 10 + 10 = 40." },
  { prompt: "Qual bloco repete sem parar até alguém clicar no botão vermelho?", options: ["repita 10 vezes", "sempre", "espere 1 segundo"], answer: 1, explain: "O sempre nunca para sozinho; o repita para depois do número de vezes." },
  { prompt: "O que o “espere até «tocando em [Bola]?»” faz?", options: ["Pula o script", "Pausa até o ator encostar na Bola", "Repete pra sempre"], answer: 1, explain: "Ele segura o script até a condição ficar verdadeira, e só então segue." },
  { prompt: "Num “se… então… senão”, quando a condição é falsa, o que roda?", options: ["Os blocos do então", "Os blocos do senão", "Nada nunca"], answer: 1, explain: "Verdadeira roda o então; falsa roda o senão. Um dos dois sempre roda." },
];

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 5, content, bare });

export const chapter5: BookPage[] = [
  page(
    <ChapterOpener
      n={5}
      title="Controle: Repetições e Condições"
      goals={["O repita e o sempre", "A diferença entre os dois", "O se… então e o senão", "O espere e o espere até"]}
    >
      <Fig h={34}>
        <LoopOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🔁">O repita</H>
      <P>
        Os blocos de <T>Controle</T> (laranja) decidem a ordem e as repetições. O <T>“repita 4 vezes”</T> tem formato de C e roda os blocos de dentro 4 vezes, em vez de a
        gente empilhar o mesmo bloco várias vezes. Mude os números e rode:
      </P>
      <LoopRunner />
    </>,
  ),

  page(
    <>
      <H icon="♾️">O sempre</H>
      <P>
        O <T>“sempre”</T> repete os blocos de dentro <T>sem parar</T>, até o projeto ser parado. É perfeito pro que acontece o jogo inteiro, como um ator seguindo o
        mouse:
      </P>
      <Fig n="5.1" caption="Sempre: apontar pro mouse e dar um passinho, de novo e de novo." h={21}>
        <ForeverArt />
      </Fig>
      <Box kind="lembre">
        Use o <strong>repita</strong> quando você sabe quantas vezes quer repetir, e o <strong>sempre</strong> pro que não tem fim. Nada se encaixa embaixo do sempre!
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🔀">Se… então, senão</H>
      <P>
        O <T>“se… então”</T> só roda os blocos de dentro se a <T>condição</T> (o bloco de ponta hexagonal) for verdadeira. Com o <T>“senão”</T>, dá pra dizer o que fazer
        quando ela é falsa:
      </P>
      <Fig n="5.2" caption="O se escolhe um caminho de acordo com a condição." h={20}>
        <DecisionArt />
      </Fig>
      <Script em={0.048} scripts={[IF_ELSE]} />
    </>,
  ),

  page(
    <>
      <H icon="⏳">Espere, e teste o seu raciocínio</H>
      <P>
        O <T>“espere 1 segundo”</T> faz uma pausa. O <T>“espere até”</T> segura o script até a condição ficar verdadeira, como “espere até a tecla espaço ser
        pressionada”. Agora, siga o código de cabeça:
      </P>
      <Script
        em={0.046}
        scripts={[
          [
            { c: "eve", t: FLAG, hat: true },
            { c: "apa", t: "diga (Aperte o espaço pra largar!)" },
            { c: "con", t: "espere até «tecla [espaço] pressionada?»" },
            { c: "apa", t: "diga (Vai!) por (1) segundos" },
          ],
        ]}
      />
      <ChoiceGame items={TRACE_GAME} color={SCR} title="O que o código faz?" />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Os blocos de Controle (laranja) cuidam das repetições, das condições e das pausas.",
          "Repita 4 vezes roda os blocos de dentro 4 vezes: 4 × mova 10 passos = 40 passos.",
          "Sempre repete sem parar, até o projeto ser parado.",
          "Se… então roda os blocos só quando a condição é verdadeira; senão, roda os do senão.",
          "Espere faz uma pausa; espere até segura o script até a condição ficar verdadeira.",
        ]}
      />
      <Glossary
        items={[
          ["Repetição (laço)", "Rodar os mesmos blocos várias vezes."],
          ["Condição", "Uma pergunta de verdadeiro ou falso."],
          ["Bloco em C", "Bloco que abraça outros (repita, sempre, se)."],
          ["Senão", "O caminho de quando a condição é falsa."],
          ["Espere até", "Pausa até a condição ficar verdadeira."],
        ]}
      />
      <Quiz
        items={[
          ["Quantos passos o ator anda em “repita 4 vezes: mova 10 passos”?", "40."],
          ["Qual é a diferença entre “sempre” e “repita 10 vezes”?", "O sempre não para; o repita para depois de 10 vezes."],
          ["O que o “se… então” precisa pra rodar o de dentro?", "Que a condição seja verdadeira."],
          ["O que faz o “espere até”?", "Pausa o script até a condição ficar verdadeira."],
        ]}
      />
    </>,
  ),
];
