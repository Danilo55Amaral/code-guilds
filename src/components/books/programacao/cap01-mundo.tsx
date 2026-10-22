"use client";

import { useEffect, useRef, useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { ChoiceGame } from "../portugues/art";
import { Code, PROG, PROG_DARK, Panel, Pill } from "./art";

// ============================================================================
// CAPÍTULO 1 — O MUNDO DA PROGRAMAÇÃO (missão "O Mundo da Programação"): o
// robô andando pelo caminho do programa, o jogo de pôr o algoritmo em ordem
// (de tocar), o robô que você programa e executa passo a passo (de tocar),
// a sequência, a repetição e a condição, e o jogo de achar o bug.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o robô seguindo o programa
// ---------------------------------------------------------------------------

function RobotOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Um robozinho andando por um caminho de quadradinhos até uma estrela, seguindo um cartão de programa com as setas andar, andar, virar e andar">
      <rect width="460" height="300" fill="#ede9fe" />
      {Array.from({ length: 25 }, (_, i) => (
        <rect key={i} x={40 + (i % 5) * 50} y={50 + Math.floor(i / 5) * 46} width="46" height="42" rx="6" fill={i % 2 ? "#ddd6fe" : "#c4b5fd"} />
      ))}
      <path d="M63 251 L63 117 L213 117" fill="none" stroke={PROG} strokeWidth="4" strokeDasharray="8 6">
        <animate attributeName="stroke-dashoffset" values="28;0" dur="1s" repeatCount="indefinite" />
      </path>
      <text x="213" y="126" textAnchor="middle" fontSize="28">⭐</text>
      <g>
        <animateMotion path="M63 251 L63 117 L213 117" dur="4s" repeatCount="indefinite" />
        <rect x="-14" y="-20" width="28" height="24" rx="6" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
        <circle cx="-6" cy="-9" r="3" fill={PROG} />
        <circle cx="6" cy="-9" r="3" fill={PROG} />
        <line x1="0" y1="-20" x2="0" y2="-28" stroke="#475569" strokeWidth="2" />
        <circle cy="-30" r="3" fill="#f97316" />
      </g>
      <g transform="translate(320 60)">
        <rect width="110" height="170" rx="10" fill="#1e1b4b" />
        <text x="55" y="24" textAnchor="middle" fontSize="13" fontWeight="900" fill="#c4b5fd">programa</text>
        {["⬆ andar", "⬆ andar", "⬆ andar", "↻ virar", "⬆ andar", "⬆ andar", "⬆ andar"].map((t, i) => (
          <text key={i} x="18" y={46 + i * 18} fontSize="13" fontFamily="monospace" fill="#e2e8f0">
            {t}
          </text>
        ))}
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O algoritmo em ordem (de tocar)
// ---------------------------------------------------------------------------

const BRUSH = ["Pegar a escova", "Colocar a pasta na escova", "Escovar todos os dentes", "Enxaguar a boca", "Lavar e guardar a escova"];
const SHUFFLED = [2, 4, 0, 3, 1];

export function OrderGame() {
  const [picked, setPicked] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);
  const done = picked.length === BRUSH.length;
  function pick(i: number) {
    if (picked.includes(i) || done) return;
    if (i === picked.length) {
      setPicked((p) => [...p, i]);
      setWrong(null);
    } else setWrong(i);
  }
  return (
    <Panel title="Algoritmo: escovar os dentes. Toque na ordem certa">
      <div className="grid grid-cols-2 gap-[0.3em]">
        <div className="flex flex-col gap-[0.25em]">
          {SHUFFLED.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => pick(i)}
              disabled={picked.includes(i)}
              className={`rounded-lg border px-[0.5em] py-[0.2em] text-left text-[0.8em] font-bold transition-colors disabled:opacity-30 ${wrong === i ? "cg-anim-shake" : ""}`}
              style={{ background: wrong === i ? "#fee2e2" : "#fff", borderColor: wrong === i ? "#dc2626" : "#d9c79d" }}
            >
              {BRUSH[i]}
            </button>
          ))}
        </div>
        <ol className="rounded-lg bg-[#1e1b4b] px-[0.6em] py-[0.3em] font-mono text-[0.76em] text-[#e2e8f0]">
          {picked.map((i, k) => (
            <li key={i} className="cg-anim-fade">
              <span className="text-[#c4b5fd]">{k + 1}.</span> {BRUSH[i]}
            </li>
          ))}
          {!done && <li className="animate-pulse text-[#6d6a9c]">{picked.length + 1}. ?</li>}
        </ol>
      </div>
      <p className="mt-[0.3em] text-center text-[0.82em]" style={{ color: done ? "#15803d" : wrong !== null ? "#b91c1c" : "#5b4a2e" }}>
        {done ? "✅ Algoritmo certinho! A ordem dos passos faz toda a diferença." : wrong !== null ? "Ops, esse passo ainda não é agora. Pense no que vem antes!" : "Escolha o primeiro passo."}
      </p>
      {done && (
        <button type="button" onClick={() => setPicked([])} className="mx-auto block text-[0.75em] font-bold underline" style={{ color: PROG_DARK }}>
          ↺ De novo
        </button>
      )}
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// O robô programável (de tocar)
// ---------------------------------------------------------------------------

type Cmd = "andar" | "direita" | "esquerda";
const DIRS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];
const GOAL = { x: 4, y: 0 };
const WALLS = [
  { x: 2, y: 2 },
  { x: 1, y: 1 },
  { x: 3, y: 1 },
];
const CMD_LABEL: Record<Cmd, string> = { andar: "⬆ andar", direita: "↻ virar à direita", esquerda: "↺ virar à esquerda" };

function simulate(program: Cmd[], steps: number) {
  let x = 0;
  let y = 4;
  let d = 0;
  let crashed = false;
  for (const c of program.slice(0, steps)) {
    if (c === "direita") d = (d + 1) % 4;
    else if (c === "esquerda") d = (d + 3) % 4;
    else {
      const nx = x + DIRS[d][0];
      const ny = y + DIRS[d][1];
      if (nx < 0 || ny < 0 || nx > 4 || ny > 4 || WALLS.some((w) => w.x === nx && w.y === ny)) {
        crashed = true;
        break;
      }
      x = nx;
      y = ny;
    }
  }
  return { x, y, d, crashed };
}

export function RobotProgram() {
  const [program, setProgram] = useState<Cmd[]>([]);
  const [step, setStep] = useState<number | null>(null);
  const timer = useRef<number | null>(null);
  useEffect(() => () => {
    if (timer.current) window.clearInterval(timer.current);
  }, []);
  const running = step !== null;
  const state = simulate(program, step ?? 0);
  const won = running && step === program.length && !state.crashed && state.x === GOAL.x && state.y === GOAL.y;

  function run() {
    if (timer.current) window.clearInterval(timer.current);
    setStep(0);
    let n = 0;
    timer.current = window.setInterval(() => {
      n += 1;
      setStep(n);
      if (n >= program.length && timer.current) window.clearInterval(timer.current);
    }, 450);
  }

  function add(c: Cmd) {
    if (program.length >= 14) return;
    setStep(null);
    setProgram((p) => [...p, c]);
  }

  return (
    <Panel title="Programe o robô até a estrela">
      <div className="flex gap-[0.6em]">
        <svg viewBox="0 0 210 210" className="w-[48%] shrink-0" role="img" aria-label="Um tabuleiro com o robô, paredes e a estrela">
          <rect width="210" height="210" rx="10" fill="#ede9fe" />
          {Array.from({ length: 25 }, (_, i) => (
            <rect key={i} x={6 + (i % 5) * 40} y={6 + Math.floor(i / 5) * 40} width="38" height="38" rx="5" fill="#ddd6fe" />
          ))}
          {WALLS.map((w) => (
            <rect key={`${w.x}${w.y}`} x={6 + w.x * 40} y={6 + w.y * 40} width="38" height="38" rx="5" fill="#78716c" />
          ))}
          <text x={25 + GOAL.x * 40} y={34 + GOAL.y * 40} textAnchor="middle" fontSize="24">
            ⭐
          </text>
          <g transform={`translate(${25 + state.x * 40} ${25 + state.y * 40}) rotate(${state.d * 90})`} style={{ transition: "transform 0.35s" }}>
            <rect x="-13" y="-13" width="26" height="26" rx="6" fill={state.crashed ? "#fca5a5" : "#e2e8f0"} stroke="#475569" strokeWidth="2" />
            <path d="M0 -12 L6 -4 L-6 -4 Z" fill={PROG} />
            <circle cx="-5" cy="3" r="2.5" fill={PROG} />
            <circle cx="5" cy="3" r="2.5" fill={PROG} />
          </g>
        </svg>
        <div className="flex min-w-0 flex-1 flex-col gap-[0.25em]">
          {(Object.keys(CMD_LABEL) as Cmd[]).map((c) => (
            <Pill key={c} onClick={() => add(c)}>
              {CMD_LABEL[c]}
            </Pill>
          ))}
          <ol className="min-h-[4em] flex-1 overflow-y-auto rounded-md bg-[#1e1b4b] px-[0.4em] py-[0.2em] font-mono text-[0.68em] text-[#e2e8f0]">
            {program.map((c, i) => (
              <li key={i} style={{ background: running && step === i + 1 ? "rgba(250,204,21,0.25)" : undefined }}>
                {i + 1}. {CMD_LABEL[c]}
              </li>
            ))}
          </ol>
          <div className="flex gap-[0.25em]">
            <Pill on onClick={run}>
              ▶ Executar
            </Pill>
            <Pill
              onClick={() => {
                setProgram([]);
                setStep(null);
              }}
            >
              ↺
            </Pill>
          </div>
        </div>
      </div>
      <p className="mt-[0.3em] text-center text-[0.82em]" style={{ color: won ? "#15803d" : state.crashed ? "#b91c1c" : "#5b4a2e" }}>
        {won ? "✅ Chegou! Você escreveu um programa." : state.crashed ? "💥 Bateu! Achou um bug: corrija o programa e execute de novo." : "Monte os comandos e aperte ▶ Executar."}
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Ache o bug
// ---------------------------------------------------------------------------

const BUG_GAME = [
  {
    prompt: (
      <Code
        lang="text"
        code={"1  Encher a panela de água\n2  Colocar o macarrão\n3  Ligar o fogo e esperar ferver\n4  Esperar 10 minutos\n5  Escorrer a água"}
        title="Algoritmo: fazer macarrão"
      />
    ),
    options: ["Linha 2", "Linha 3", "Linha 5"],
    answer: 0,
    explain: "O macarrão só vai na panela depois que a água ferve: a linha 2 tinha que vir depois da 3.",
  },
  {
    prompt: <Code lang="text" code={"1  REPITA 4 VEZES\n2     andar\n3     virar à direita\n4  FIM\n5  Desenhar uma estrela"} title="Algoritmo: desenhar um triângulo" />,
    options: ["Linha 1", "Linha 3", "Linha 5"],
    answer: 0,
    explain: "Um triângulo tem 3 lados: o certo é REPITA 3 VEZES (e virar 120°). Com 4, sai um quadrado!",
  },
];

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 1, content, bare });

export const chapter1: BookPage[] = [
  page(
    <ChapterOpener n={1} title="O Mundo da Programação" goals={["O que é um algoritmo", "O que é um programa", "Sequência, repetição e condição", "O que são bugs e como achá-los"]}>
      <Fig h={34}>
        <RobotOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="📋">O algoritmo</H>
      <P>
        Um <T>algoritmo</T> é uma sequência de passos, em ordem, para resolver um problema ou fazer uma tarefa. Uma receita de bolo é um algoritmo! Os passos precisam ser
        claros e estar na ordem certa. Teste:
      </P>
      <OrderGame />
      <Box kind="sabia">
        A palavra algoritmo vem do nome do matemático persa <strong>al-Khwarizmi</strong>, que viveu há mais de mil anos em Bagdá.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🤖">O programa</H>
      <P>
        Um <T>programa</T> é um algoritmo escrito numa linguagem que o computador entende. O computador faz <T>exatamente</T> o que está escrito, nem mais nem menos.
        Programe o robô:
      </P>
      <RobotProgram />
    </>,
  ),

  page(
    <>
      <H icon="🔁">Sequência, repetição e condição</H>
      <P>Quase todo programa é montado com três ideias:</P>
      <Cards
        items={[
          { icon: "➡️", title: "Sequência", text: "Os passos, um depois do outro, na ordem." },
          { icon: "🔁", title: "Repetição", text: "Fazer a mesma coisa várias vezes (os laços)." },
          { icon: "❓", title: "Condição", text: "Decidir: SE acontecer isso, faça aquilo; SENÃO, faça outra coisa." },
          { icon: "📦", title: "Variável", text: "Uma caixinha com nome que guarda um valor, como a pontuação." },
        ]}
      />
      <Code lang="text" code={"REPITA 3 VEZES\n   andar\n   SE tiver parede\n      virar à direita\n   FIM\nFIM"} title="Algoritmo do robô" />
    </>,
  ),

  page(
    <>
      <H icon="🐛">Os bugs</H>
      <P>
        Um <T>bug</T> é um erro no programa. Achar e consertar os bugs se chama <T>depurar</T> (em inglês, debug). Todo programador escreve bugs: o importante é saber
        encontrá-los. Ache a linha errada:
      </P>
      <ChoiceGame items={BUG_GAME} color={PROG} title="Ache o bug" />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Algoritmo é uma sequência de passos em ordem para resolver um problema.",
          "Programa é um algoritmo escrito numa linguagem de programação.",
          "O computador faz exatamente o que está escrito.",
          "Sequência, repetição, condição e variáveis montam os programas.",
          "Bug é um erro; depurar é achar e consertar os bugs.",
        ]}
      />
      <Glossary
        items={[
          ["Algoritmo", "Uma sequência de passos para resolver um problema."],
          ["Programa", "Um algoritmo que o computador consegue executar."],
          ["Laço", "Um trecho do programa que se repete."],
          ["Condição", "Uma pergunta de sim ou não que decide o caminho."],
          ["Bug", "Um erro no programa."],
        ]}
      />
      <Quiz
        items={[
          ["O que é um algoritmo?", "Uma sequência de passos em ordem para resolver um problema."],
          ["O que o computador faz quando o programa tem um erro?", "Faz exatamente o que está escrito, mesmo errado."],
          ["Como se chama fazer a mesma coisa várias vezes num programa?", "Repetição (laço)."],
          ["O que é depurar?", "Achar e consertar os bugs."],
        ]}
      />
    </>,
  ),
];
