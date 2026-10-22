"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Code, Console, PROG, PROG_DARK, Panel, RunCode, Slider } from "./art";

// ============================================================================
// CAPÍTULO 7 — PYTHON: OS PRIMEIROS PASSOS (missões "Python" e "Python
// parte 3", a parte do básico): a cobra do Python enrolada no notebook, o
// print e o input (para executar), a idade passando pelo if/elif/else (de
// tocar, com a linha executada acesa), o range do for (de tocar) e as listas
// com o while.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a cobra do Python
// ---------------------------------------------------------------------------

function SnakeOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma cobra azul e amarela, o símbolo do Python, enrolada num notebook que mostra a linha print Olá, e balançando a cabeça">
      <rect width="460" height="300" fill="#ede9fe" />
      <g transform="translate(230 200)">
        <rect x="-120" y="-120" width="240" height="140" rx="10" fill="#1e293b" />
        <rect x="-110" y="-110" width="220" height="120" rx="4" fill="#1e1b4b" />
        <text x="-96" y="-76" fontSize="18" fontFamily="monospace" fill="#67e8f9">
          print
          <tspan fill="#e2e8f0">(</tspan>
          <tspan fill="#86efac">"Olá!"</tspan>
          <tspan fill="#e2e8f0">)</tspan>
        </text>
        <text x="-96" y="-40" fontSize="18" fontFamily="monospace" fill="#86efac">
          Olá!
          <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.3;0.4;1" dur="3s" repeatCount="indefinite" />
        </text>
        <path d="M-140 20 L140 20 L120 40 L-120 40 Z" fill="#475569" />
      </g>
      <path d="M60 270 Q40 220 90 200 Q140 180 110 140 Q80 100 130 80" fill="none" stroke="#2563eb" strokeWidth="22" strokeLinecap="round" />
      <path d="M60 270 Q40 220 90 200 Q140 180 110 140 Q80 100 130 80" fill="none" stroke="#facc15" strokeWidth="6" strokeDasharray="10 14" strokeLinecap="round" />
      <g transform="translate(130 76)">
        <g>
          <animateTransform attributeName="transform" type="rotate" values="-12;12;-12" dur="2s" repeatCount="indefinite" />
          <ellipse rx="22" ry="16" fill="#2563eb" />
          <circle cx="8" cy="-5" r="4" fill="#fff" />
          <circle cx="9" cy="-5" r="2" fill="#1e293b" />
          <path d="M20 4 L32 2 M32 2 L36 -2 M32 2 L36 6" stroke="#dc2626" strokeWidth="2">
            <animate attributeName="opacity" values="1;0;1" dur="0.6s" repeatCount="indefinite" />
          </path>
        </g>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A idade no if/elif/else (de tocar)
// ---------------------------------------------------------------------------

export function AgeIf() {
  const [age, setAge] = useState(12);
  const line = age < 13 ? 2 : age < 18 ? 4 : 6;
  const out = age < 13 ? "Criança" : age < 18 ? "Adolescente" : "Adulto";
  return (
    <Panel title="Mude a idade e veja qual linha roda">
      <Slider label="idade" value={age} min={1} max={30} onChange={setAge} />
      <Code
        lang="python"
        highlight={line}
        code={`idade = ${age}\nif idade < 13:\n    print("Criança")\nelif idade < 18:\n    print("Adolescente")\nelse:\n    print("Adulto")`}
      />
      <Console lines={[out]} />
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// O range (de tocar)
// ---------------------------------------------------------------------------

export function RangeLab() {
  const [start, setStart] = useState(1);
  const [stop, setStop] = useState(6);
  const [step, setStep] = useState(1);
  const values: number[] = [];
  for (let i = start; i < stop; i += step) values.push(i);
  return (
    <Panel title="Monte o range">
      <Slider label="começo" value={start} min={0} max={10} onChange={setStart} />
      <Slider label="fim" value={stop} min={1} max={20} onChange={setStop} />
      <Slider label="passo" value={step} min={1} max={5} onChange={setStep} />
      <Code code={`for i in range(${start}, ${stop}, ${step}):\n    print(i)`} lang="python" />
      <div className="flex flex-wrap gap-[0.25em]">
        {values.length === 0 && <span className="text-[0.8em] italic text-[#8a7146]">(nada: o começo já passou do fim)</span>}
        {values.map((v) => (
          <span key={`${start}-${stop}-${step}-${v}`} className="cg-anim-pop rounded-md px-[0.5em] font-mono text-[0.85em] font-black text-white" style={{ background: PROG }}>
            {v}
          </span>
        ))}
      </div>
      <p className="mt-[0.2em] text-center text-[0.78em] text-[#5b4a2e]">
        O <strong style={{ color: PROG_DARK }}>{stop}</strong> nunca aparece: o range para antes do fim.
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 7, content, bare });

export const chapter7: BookPage[] = [
  page(
    <ChapterOpener n={7} title="Python: os Primeiros Passos" goals={["print, input e as variáveis", "A indentação e o if/elif/else", "O for com range", "O while e as listas"]}>
      <Fig h={34}>
        <SnakeOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🐍">print, input e variáveis</H>
      <P>
        O <T>Python</T> é a linguagem mais fácil de ler: parece inglês e não precisa de ponto e vírgula nem de chaves. <T>print()</T> mostra na tela, <T>input()</T>{" "}
        pergunta algo para o usuário e as variáveis nascem quando você dá um valor a elas:
      </P>
      <RunCode
        lang="python"
        code={'nome = input("Qual é o seu nome? ")\nidade = 12\nprint("Olá,", nome)\nprint("Ano que vem você terá", idade + 1, "anos")'}
        output={["Qual é o seu nome? Ana", "Olá, Ana", "Ano que vem você terá 13 anos"]}
      />
      <Box kind="atencao">
        O <strong>input()</strong> sempre devolve um <strong>texto</strong>. Para fazer contas, converta: <strong>int(input())</strong> vira número inteiro.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="↔️">A indentação e o if</H>
      <P>
        No Python, o que fica <T>dentro</T> do if é marcado pela <T>indentação</T>: os 4 espaços no começo da linha. Depois da condição vêm os <T>dois-pontos</T>. O{" "}
        <T>elif</T> é o “senão, se” e o <T>else</T>, o “senão”.
      </P>
      <AgeIf />
      <Box kind="mago" title="Os espaços mandam">
        Se a indentação estiver errada, o Python reclama com um <strong>IndentationError</strong>. Use sempre 4 espaços.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🔁">O for e o range</H>
      <P>
        O <T>for</T> percorre uma sequência. O <T>range(começo, fim, passo)</T> cria os números: começa no começo, anda de passo em passo e <T>para antes do fim</T>.
        Experimente:
      </P>
      <RangeLab />
    </>,
  ),

  page(
    <>
      <H icon="📋">Listas e while</H>
      <P>
        Uma <T>lista</T> guarda vários valores entre colchetes; <T>append</T> põe mais um no fim e <T>len</T> conta os itens. O <T>while</T> repete enquanto a condição for
        verdadeira:
      </P>
      <RunCode
        lang="python"
        code={'frutas = ["maçã", "banana"]\nfrutas.append("uva")\nprint(len(frutas))\nfor fruta in frutas:\n    print("Eu gosto de", fruta)\nn = 3\nwhile n > 0:\n    print(n)\n    n = n - 1'}
        output={["3", "Eu gosto de maçã", "Eu gosto de banana", "Eu gosto de uva", "3", "2", "1"]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "print() mostra na tela; input() pergunta e devolve um texto.",
          "As variáveis nascem quando recebem um valor; int() converte para número.",
          "A indentação (4 espaços) diz o que fica dentro do if, do for e do while.",
          "if, elif e else escolhem o caminho; depois da condição vêm os dois-pontos.",
          "range(1, 6) dá 1, 2, 3, 4, 5; listas usam append e len.",
        ]}
      />
      <Glossary
        items={[
          ["print", "Mostra uma mensagem na tela."],
          ["input", "Pergunta algo e espera o usuário digitar."],
          ["Indentação", "Os espaços no começo da linha, que agrupam o código."],
          ["range", "Gera uma sequência de números."],
          ["Lista", "Vários valores guardados em ordem, entre colchetes."],
        ]}
      />
      <Quiz
        items={[
          ["Qual comando mostra uma mensagem na tela em Python?", "print()."],
          ["Que números gera range(2, 6)?", "2, 3, 4 e 5."],
          ["Para que serve a indentação no Python?", "Para mostrar o que fica dentro do if, do for, do while e das funções."],
          ["Como colocar um item no fim de uma lista?", "Com append, por exemplo frutas.append(\"uva\")."],
        ]}
      />
    </>,
  ),
];
