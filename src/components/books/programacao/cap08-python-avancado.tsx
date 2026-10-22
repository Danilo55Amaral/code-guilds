"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Code, Console, PROG, Panel, Pill, RunCode, Slider } from "./art";

// ============================================================================
// CAPÍTULO 8 — PYTHON AVANÇANDO (missões "Python parte 2" e "Python parte
// 3"): a cobra que virou dragão, as funções (para executar), o dicionário com
// a f-string (de tocar), as fatias de um texto (de tocar) e o random com o
// try/except (para executar).
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a cobra que virou dragão
// ---------------------------------------------------------------------------

function DragonOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="A cobra do Python crescida, virando um dragão azul e amarelo com asas batendo, soltando chaves e colchetes pela boca em vez de fogo">
      <rect width="460" height="300" fill="#1e1b4b" />
      {Array.from({ length: 20 }, (_, i) => (
        <circle key={i} cx={(i * 83) % 460} cy={(i * 47) % 300} r="1.2" fill="#fff" opacity="0.6" />
      ))}
      {[
        { d: "M185 222 L128 118 Q146 140 160 132 Q166 158 180 150 Q188 176 206 170 Z", at: "185 222", swing: -12 },
        { d: "M212 226 L196 100 Q208 128 220 118 Q224 148 236 140 Q242 168 254 168 Z", at: "212 226", swing: 12 },
      ].map((w) => (
        <path key={w.at} d={w.d} fill="#60a5fa" stroke="#1d4ed8" strokeWidth="2" strokeLinejoin="round">
          <animateTransform attributeName="transform" type="rotate" values={`0 ${w.at};${w.swing} ${w.at};0 ${w.at}`} dur="1s" repeatCount="indefinite" />
        </path>
      ))}
      <path d="M60 270 Q120 200 200 230 Q280 260 300 180 Q310 130 270 110" fill="none" stroke="#2563eb" strokeWidth="30" strokeLinecap="round" />
      <path d="M60 270 Q120 200 200 230 Q280 260 300 180 Q310 130 270 110" fill="none" stroke="#facc15" strokeWidth="8" strokeDasharray="12 16" strokeLinecap="round" />
      <g transform="translate(268 104)">
        <ellipse rx="30" ry="22" fill="#2563eb" />
        <path d="M-10 -20 L-18 -38 L-2 -24 M10 -20 L16 -38 L4 -24" fill="#facc15" />
        <circle cx="-10" cy="-6" r="5" fill="#fff" />
        <circle cx="-11" cy="-6" r="2.5" fill="#1e293b" />
      </g>
      {["{ }", "[ ]", "( )"].map((t, i) => (
        <text key={t} x={236 - i * 58} y={110 - i * 17} fontSize="22" fontWeight="900" fontFamily="monospace" fill="#fdba74">
          {t}
          <animate attributeName="x" values="236;60" dur="2.4s" begin={`${-i * 0.8}s`} repeatCount="indefinite" />
          <animate attributeName="y" values="110;60" dur="2.4s" begin={`${-i * 0.8}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0" dur="2.4s" begin={`${-i * 0.8}s`} repeatCount="indefinite" />
        </text>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O dicionário e a f-string (de tocar)
// ---------------------------------------------------------------------------

const NAMES = ["Ana", "Leo", "Bia"];
const HOUSES = ["Ignis", "Noctis", "Flavus", "Sapientia"];

export function DictLab() {
  const [name, setName] = useState(0);
  const [level, setLevel] = useState(5);
  const [house, setHouse] = useState(0);
  const code = `aluno = {"nome": "${NAMES[name]}", "nivel": ${level}, "casa": "${HOUSES[house]}"}\nprint(f"{aluno['nome']} é da casa {aluno['casa']}")\nprint(f"Nível {aluno['nivel']}, falta {10 - aluno['nivel']} para o 10")`;
  return (
    <Panel title="Mude o dicionário">
      <div className="mb-[0.2em] flex flex-wrap justify-center gap-[0.25em]">
        {NAMES.map((n, i) => (
          <Pill key={n} on={name === i} onClick={() => setName(i)}>
            {n}
          </Pill>
        ))}
        {HOUSES.map((h, i) => (
          <Pill key={h} on={house === i} onClick={() => setHouse(i)} color="#ec4899">
            {h}
          </Pill>
        ))}
      </div>
      <Slider label="nivel" value={level} min={1} max={10} onChange={setLevel} />
      <Code code={code} lang="python" />
      <Console lines={[`${NAMES[name]} é da casa ${HOUSES[house]}`, `Nível ${level}, falta ${10 - level} para o 10`]} />
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As fatias (de tocar)
// ---------------------------------------------------------------------------

const WORD = "CODEGUILDS";

export function SliceLab() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(4);
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  return (
    <Panel title="Fatie a palavra">
      <div className="flex justify-center gap-[0.15em]">
        {WORD.split("").map((ch, i) => (
          <span key={i} className="flex flex-col items-center">
            <span
              className="flex h-[1.8em] w-[1.6em] items-center justify-center rounded-md font-mono text-[0.95em] font-black transition-colors"
              style={i >= lo && i < hi ? { background: PROG, color: "#fff" } : { background: "#fff", color: "#1e293b", border: "1px solid #d9c79d" }}
            >
              {ch}
            </span>
            <span className="text-[0.6em] text-[#8a7146]">{i}</span>
          </span>
        ))}
      </div>
      <Slider label="começo" value={a} min={0} max={10} onChange={setA} />
      <Slider label="fim" value={b} min={0} max={10} onChange={setB} />
      <Code code={`palavra = "${WORD}"\nprint(palavra[${lo}:${hi}])`} lang="python" />
      <Console lines={[WORD.slice(lo, hi) || "(vazio)"]} />
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 8, content, bare });

export const chapter8: BookPage[] = [
  page(
    <ChapterOpener n={8} title="Python Avançando" goals={["Funções com def e return", "Dicionários e f-strings", "Fatias de textos e listas", "O random e o try/except"]}>
      <Fig h={34}>
        <DragonOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🧰">Funções com def</H>
      <P>
        No Python, uma função começa com <T>def</T>, o nome e os parâmetros entre parênteses, e termina a linha com dois-pontos. O que fica indentado é o corpo da função, e
        o <T>return</T> devolve o resultado. Um parâmetro pode ter um <T>valor padrão</T>:
      </P>
      <RunCode
        lang="python"
        code={'def area(base, altura):\n    return base * altura\n\ndef saudar(nome="aprendiz"):\n    print("Olá,", nome)\n\nprint(area(5, 3))\nsaudar()\nsaudar("Mago")'}
        output={["15", "Olá, aprendiz", "Olá, Mago"]}
      />
    </>,
  ),

  page(
    <>
      <H icon="📒">Dicionários e f-strings</H>
      <P>
        Um <T>dicionário</T> guarda pares de <T>chave: valor</T> entre chaves, como uma ficha. A <T>f-string</T> (um f antes das aspas) coloca valores dentro do texto
        com chaves. Mude a ficha:
      </P>
      <DictLab />
    </>,
  ),

  page(
    <>
      <H icon="🔪">As fatias</H>
      <P>
        Textos e listas podem ser <T>fatiados</T> com <T>[começo:fim]</T>: pega do começo até antes do fim, como no range. Os índices começam no 0, e os negativos contam
        do fim: palavra[-1] é a última letra.
      </P>
      <SliceLab />
    </>,
  ),

  page(
    <>
      <H icon="🎲">random e try/except</H>
      <P>
        O módulo <T>random</T> sorteia: <T>random.randint(1, 6)</T> dá um número de 1 a 6, e <T>random.choice(lista)</T> escolhe um item. O <T>try/except</T> tenta um
        código e, se der erro, faz outra coisa em vez de quebrar o programa:
      </P>
      <RunCode
        lang="python"
        code={'import random\nprint(random.choice(["pedra", "papel", "tesoura"]))\ntry:\n    numero = int("doze")\nexcept ValueError:\n    print("Isso não é um número!")'}
        output={["tesoura", "Isso não é um número!"]}
      />
      <Table
        head={["Comando", "O que faz"]}
        rows={[
          ["max(lista) / min(lista)", "O maior e o menor valor"],
          ["sorted(lista)", "Uma cópia da lista em ordem"],
          ["\"ana\" in lista", "True se o item está na lista"],
          ["break", "Sai do laço na hora"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "def cria funções; return devolve o resultado; parâmetros podem ter valor padrão.",
          "Dicionários guardam pares chave: valor entre chaves.",
          "f-strings colocam valores no texto: f\"Olá, {nome}\".",
          "[começo:fim] fatia textos e listas; -1 é o último item.",
          "random sorteia; try/except trata os erros sem quebrar o programa.",
        ]}
      />
      <Glossary
        items={[
          ["def", "A palavra que cria uma função no Python."],
          ["Dicionário", "Uma coleção de pares chave: valor."],
          ["f-string", "Um texto com valores dentro, entre chaves."],
          ["Fatia", "Um pedaço de um texto ou de uma lista: [começo:fim]."],
          ["Exceção", "Um erro que acontece enquanto o programa roda."],
        ]}
      />
      <Quiz
        items={[
          ["Qual palavra cria uma função em Python?", "def."],
          ["O que mostra print(\"PYTHON\"[0:2])?", "PY."],
          ["Como pegar o valor da chave \"nome\" no dicionário aluno?", "aluno[\"nome\"]."],
          ["Para que serve o try/except?", "Para tratar um erro sem o programa quebrar."],
        ]}
      />
    </>,
  ),
];
