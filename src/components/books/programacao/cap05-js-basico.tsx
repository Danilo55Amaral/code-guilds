"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Code, Console, PROG, PROG_DARK, Panel, RunCode, Slider } from "./art";

// ============================================================================
// CAPÍTULO 5 — JAVASCRIPT: O BÁSICO (missões "JavaScript" e "JavaScript
// parte 3", a parte do básico): o raio dando vida à página, as variáveis e
// os tipos (para executar), as contas e os textos, a nota que passa pelo
// if/else (de tocar, com a linha executada acesa) e o laço for (de tocar).
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o raio dando vida à página
// ---------------------------------------------------------------------------

function BoltOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Um raio amarelo caindo numa página da internet, que ganha vida: o botão pisca, um contador sobe e uma estrela gira">
      <rect width="460" height="300" fill="#ede9fe" />
      <rect x="90" y="60" width="280" height="210" rx="10" fill="#fff" stroke="#94a3b8" strokeWidth="2" />
      <rect x="90" y="60" width="280" height="24" rx="10" fill="#e2e8f0" />
      <path d="M240 0 L210 70 L236 70 L220 130 L268 54 L242 54 L262 0 Z" fill="#facc15" stroke="#a16207" strokeWidth="2">
        <animate attributeName="opacity" values="1;0.3;1;1" keyTimes="0;0.1;0.2;1" dur="2s" repeatCount="indefinite" />
      </path>
      <rect x="120" y="200" width="100" height="40" rx="20" fill={PROG}>
        <animate attributeName="fill" values={`${PROG};#ec4899;${PROG}`} dur="1.4s" repeatCount="indefinite" />
      </rect>
      <text x="170" y="226" textAnchor="middle" fontSize="15" fontWeight="900" fill="#fff">clique!</text>
      <text x="300" y="160" textAnchor="middle" fontSize="40" fontWeight="900" fill={PROG_DARK} fontFamily="monospace">
        <tspan>
          0
          <animate attributeName="opacity" values="1;0;0;0;1" dur="4s" repeatCount="indefinite" />
        </tspan>
      </text>
      {[1, 2, 3].map((n, i) => (
        <text key={n} x="300" y="160" textAnchor="middle" fontSize="40" fontWeight="900" fill={PROG_DARK} fontFamily="monospace" opacity="0">
          {n}
          <animate attributeName="opacity" values="0;1;0" keyTimes="0;0.5;1" dur="4s" begin={`${(i + 1) * 1 - 4}s`} repeatCount="indefinite" />
        </text>
      ))}
      <g transform="translate(320 225)">
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3s" repeatCount="indefinite" />
          <path d="M0 -20 L5 -6 L20 -6 L8 3 L12 18 L0 9 L-12 18 L-8 3 L-20 -6 L-5 -6 Z" fill="#facc15" />
        </g>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A nota no if/else (de tocar)
// ---------------------------------------------------------------------------

const GRADE_CODE = `let nota = NOTA;
if (nota >= 9) {
  console.log("Excelente!");
} else if (nota >= 6) {
  console.log("Passou!");
} else {
  console.log("Recuperação.");
}`;

export function GradeIf() {
  const [nota, setNota] = useState(7);
  const line = nota >= 9 ? 2 : nota >= 6 ? 4 : 6;
  const out = nota >= 9 ? "Excelente!" : nota >= 6 ? "Passou!" : "Recuperação.";
  return (
    <Panel title="Mude a nota e veja qual linha roda">
      <Slider label="nota" value={nota} min={0} max={10} onChange={setNota} />
      <Code code={GRADE_CODE.replace("NOTA", String(nota))} lang="js" highlight={line} />
      <Console lines={[out]} />
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// O laço for (de tocar)
// ---------------------------------------------------------------------------

export function ForLoop() {
  const [end, setEnd] = useState(5);
  const [step, setStep] = useState(1);
  const values: number[] = [];
  for (let i = 1; i <= end; i += step) values.push(i);
  return (
    <Panel title="Mude o laço">
      <Slider label="até" value={end} min={1} max={20} onChange={setEnd} />
      <Slider label="passo" value={step} min={1} max={5} onChange={setStep} />
      <Code code={`for (let i = 1; i <= ${end}; i += ${step}) {\n  console.log("Volta " + i);\n}`} lang="js" />
      <div className="flex flex-wrap gap-[0.25em]">
        {values.map((v, k) => (
          <span key={`${end}-${step}-${v}`} className="cg-anim-pop rounded-full px-[0.5em] font-mono text-[0.75em] font-bold text-white" style={{ background: PROG, animationDelay: `${k * 0.05}s` }}>
            Volta {v}
          </span>
        ))}
      </div>
      <p className="mt-[0.2em] text-center text-[0.8em] text-[#5b4a2e]">
        O laço rodou <strong style={{ color: PROG_DARK }}>{values.length}</strong> {values.length === 1 ? "vez" : "vezes"}.
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 5, content, bare });

export const chapter5: BookPage[] = [
  page(
    <ChapterOpener n={5} title="JavaScript: o Básico" goals={["Variáveis com let e const", "Os tipos: textos, números e booleanos", "Contas, textos e o template string", "Condições com if e repetições com for"]}>
      <Fig h={34}>
        <BoltOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="📦">Variáveis e tipos</H>
      <P>
        O <T>JavaScript</T> dá vida às páginas. Uma <T>variável</T> é uma caixinha com nome: <T>let</T> cria uma que pode mudar, e <T>const</T> uma que não muda. Os
        valores têm <T>tipos</T>: texto (string), número (number) e verdadeiro ou falso (boolean). Execute:
      </P>
      <RunCode
        lang="js"
        code={`let nome = "Ana";       // string\nconst idade = 12;       // number\nlet temSenha = true;    // boolean\nconsole.log(nome);\nconsole.log(typeof idade);`}
        output={["Ana", "number"]}
      />
      <Box kind="lembre">
        <strong>console.log()</strong> mostra uma mensagem no console, a janelinha dos programadores (aperte F12 no navegador para ver).
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="➗">Contas e textos</H>
      <P>
        As contas usam <T>+</T>, <T>-</T>, <T>*</T> (vezes), <T>/</T> (dividir) e <T>%</T> (o resto da divisão). Com textos, o + <T>junta</T>. O <T>template string</T>,
        com crases, coloca variáveis dentro do texto com <T>{"${ }"}</T>:
      </P>
      <RunCode
        lang="js"
        code={"let a = 7;\nconsole.log(a * 3);\nconsole.log(a % 2);   // resto: 7 é ímpar\nlet nome = \"Leo\";\nconsole.log(`Oi, ${nome}! Você tem ${a} moedas.`);"}
        output={["21", "1", "Oi, Leo! Você tem 7 moedas."]}
      />
      <Box kind="atencao">
        Cuidado: <strong>"2" + 2</strong> dá <strong>"22"</strong>, porque um deles é texto e o + junta. Para somar, os dois precisam ser números.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🔀">Condições: if e else</H>
      <P>
        O <T>if</T> (se) executa um trecho só quando a condição é verdadeira; o <T>else</T> (senão) cuida do resto. Para comparar, use <T>===</T> (igual), <T>!==</T>{" "}
        (diferente), &gt;, &lt;, &gt;= e &lt;=. Para juntar condições, <T>&amp;&amp;</T> (e) e <T>||</T> (ou).
      </P>
      <GradeIf />
    </>,
  ),

  page(
    <>
      <H icon="🔁">Repetições: for e while</H>
      <P>
        O <T>for</T> repete um trecho um número certo de vezes. Ele tem três partes: onde começa (let i = 1), até quando vai (i &lt;= 5) e quanto anda (i++ soma 1). O{" "}
        <T>while</T> repete enquanto a condição for verdadeira.
      </P>
      <ForLoop />
      <Table
        head={["Operador", "Quer dizer"]}
        rows={[
          ["i++", "soma 1 em i"],
          ["i += 2", "soma 2 em i"],
          ["while (vidas > 0)", "repete enquanto ainda tiver vidas"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "let cria variáveis que mudam; const, as que não mudam.",
          "Os tipos básicos são string, number e boolean.",
          "+ soma números e junta textos; % é o resto da divisão.",
          "if, else if e else escolhem o caminho; === compara.",
          "for repete um número certo de vezes; while, enquanto a condição valer.",
        ]}
      />
      <Glossary
        items={[
          ["Variável", "Uma caixinha com nome que guarda um valor."],
          ["String", "Um texto, entre aspas."],
          ["Boolean", "Um valor verdadeiro (true) ou falso (false)."],
          ["Condição", "Uma comparação que dá true ou false."],
          ["Laço", "Um trecho do código que se repete."],
        ]}
      />
      <Quiz
        items={[
          ["Qual é a diferença entre let e const?", "let pode mudar de valor; const não muda."],
          ["Quanto é 10 % 3?", "1 (o resto da divisão)."],
          ["O que mostra console.log(\"2\" + 2)?", "\"22\"."],
          ["Quantas vezes roda for (let i = 1; i <= 4; i++)?", "Quatro vezes."],
        ]}
      />
    </>,
  ),
];
