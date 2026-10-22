"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Code, Console, PROG, PROG_DARK, Panel, Pill, RunCode } from "./art";

// ============================================================================
// CAPÍTULO 6 — JAVASCRIPT NA PÁGINA (missões "JavaScript parte 2" e
// "JavaScript parte 3"): o dedo clicando e a página mudando de cor, as
// funções (para executar), o laboratório das listas (de tocar), o contador
// de cliques ligado ao código (de tocar) e o dado do Math.random (de tocar).
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o clique que muda a página
// ---------------------------------------------------------------------------

function ClickOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma mão clicando num botão e a página mudando de cor e mostrando a mensagem Você clicou, com ondas saindo do clique">
      <rect width="460" height="300" fill="#ede9fe" />
      <rect x="80" y="40" width="300" height="220" rx="12" fill="#fff" stroke="#94a3b8" strokeWidth="2">
        <animate attributeName="fill" values="#ffffff;#ffffff;#fdf4ff;#fdf4ff;#ffffff" keyTimes="0;0.4;0.45;0.9;1" dur="4s" repeatCount="indefinite" />
      </rect>
      <text x="230" y="100" textAnchor="middle" fontSize="22" fontWeight="900" fill={PROG_DARK} opacity="0">
        Você clicou! 🎉
        <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.4;0.45;0.9;1" dur="4s" repeatCount="indefinite" />
      </text>
      <rect x="160" y="150" width="140" height="50" rx="25" fill={PROG} />
      <text x="230" y="182" textAnchor="middle" fontSize="18" fontWeight="900" fill="#fff">Clique</text>
      {[0, 1].map((k) => (
        <circle key={k} cx="250" cy="185" r="10" fill="none" stroke={PROG} strokeWidth="3" opacity="0">
          <animate attributeName="r" values="6;6;40" keyTimes="0;0.4;0.7" dur="4s" begin={`${-k * 0.15}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0;1;0" keyTimes="0;0.4;0.45;0.7" dur="4s" begin={`${-k * 0.15}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <g transform="translate(258 196)">
        <animateTransform attributeName="transform" type="translate" values="290 240;258 196;258 196;290 240" keyTimes="0;0.38;0.5;1" dur="4s" repeatCount="indefinite" />
        <path d="M0 0 L0 30 L8 22 L14 36 L20 33 L14 20 L26 20 Z" fill="#fff" stroke="#1e293b" strokeWidth="2" />
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O laboratório das listas (de tocar)
// ---------------------------------------------------------------------------

const OPS: { label: string; code: string; run: (a: number[]) => number[] | string }[] = [
  { label: "push(7)", code: "lista.push(7);", run: (a) => [...a, 7] },
  { label: "pop()", code: "lista.pop();", run: (a) => a.slice(0, -1) },
  { label: "map(dobrar)", code: "lista = lista.map((n) => n * 2);", run: (a) => a.map((n) => n * 2) },
  { label: "filter(pares)", code: "lista = lista.filter((n) => n % 2 === 0);", run: (a) => a.filter((n) => n % 2 === 0) },
  { label: "length", code: "console.log(lista.length);", run: (a) => String(a.length) },
  { label: "includes(4)", code: "console.log(lista.includes(4));", run: (a) => String(a.includes(4)) },
];

export function ArrayLab() {
  const [list, setList] = useState([3, 4, 5]);
  const [last, setLast] = useState("let lista = [3, 4, 5];");
  const [out, setOut] = useState<string[]>([]);
  return (
    <Panel title="Mexa na lista">
      <div className="mb-[0.3em] flex flex-wrap justify-center gap-[0.25em]">
        {OPS.map((op) => (
          <Pill
            key={op.label}
            onClick={() => {
              const r = op.run(list);
              setLast(op.code);
              if (typeof r === "string") setOut([r]);
              else {
                setList(r.slice(0, 10));
                setOut([]);
              }
            }}
          >
            {op.label}
          </Pill>
        ))}
        <Pill
          onClick={() => {
            setList([3, 4, 5]);
            setLast("let lista = [3, 4, 5];");
            setOut([]);
          }}
        >
          ↺
        </Pill>
      </div>
      <Code code={last} lang="js" />
      <div className="flex items-center gap-[0.4em]">
        <span className="font-mono text-[0.8em] font-bold" style={{ color: PROG_DARK }}>
          lista =
        </span>
        <div className="flex flex-wrap gap-[0.2em]">
          <span className="font-mono text-[0.9em] font-bold">[</span>
          {list.map((n, i) => (
            <span key={`${i}-${n}`} className="cg-anim-pop flex flex-col items-center">
              <span className="rounded-md px-[0.45em] font-mono text-[0.85em] font-black text-white" style={{ background: PROG }}>
                {n}
              </span>
              <span className="text-[0.55em] text-[#8a7146]">[{i}]</span>
            </span>
          ))}
          <span className="font-mono text-[0.9em] font-bold">]</span>
        </div>
      </div>
      {out.length > 0 && (
        <div className="mt-[0.3em]">
          <Console lines={out} />
        </div>
      )}
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// O contador de cliques (de tocar)
// ---------------------------------------------------------------------------

const COUNTER_CODE = `let cliques = 0;
const botao = document.querySelector("#botao");
const placar = document.querySelector("#placar");
botao.addEventListener("click", () => {
  cliques++;
  placar.textContent = "Cliques: " + cliques;
});`;

export function ClickCounter() {
  const [count, setCount] = useState(0);
  const [flash, setFlash] = useState(false);
  return (
    <Panel title="O código e a página, juntos">
      <Code code={COUNTER_CODE} lang="js" highlight={flash ? 4 : undefined} />
      <div className="flex items-center justify-center gap-[0.8em] rounded-lg bg-white py-[0.4em]">
        <button
          type="button"
          onClick={() => {
            setCount((c) => c + 1);
            setFlash(true);
            window.setTimeout(() => setFlash(false), 400);
          }}
          className="rounded-full px-[1em] py-[0.25em] font-black text-white shadow transition-transform active:scale-95"
          style={{ background: PROG }}
        >
          Clique
        </button>
        <span key={count} className="cg-anim-pop font-mono text-[1em] font-black" style={{ color: PROG_DARK }}>
          Cliques: {count}
        </span>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// O dado do Math.random (de tocar)
// ---------------------------------------------------------------------------

export function DiceRoll() {
  const [r, setR] = useState<number | null>(null);
  const steps =
    r === null
      ? []
      : [`Math.random()        → ${r.toFixed(4)}`, `× 6                  → ${(r * 6).toFixed(4)}`, `Math.floor(...)      → ${Math.floor(r * 6)}`, `+ 1                  → ${Math.floor(r * 6) + 1}`];
  const face = r === null ? null : Math.floor(r * 6) + 1;
  return (
    <Panel title="Jogue o dado do JavaScript">
      <Code code={"let dado = Math.floor(Math.random() * 6) + 1;"} lang="js" />
      <div className="flex items-center gap-[0.6em]">
        <button type="button" onClick={() => setR(Math.random())} className="shrink-0 rounded-full px-[0.9em] py-[0.2em] font-black text-white" style={{ background: PROG }}>
          🎲 Sortear
        </button>
        {face !== null && (
          <span key={r} className="cg-anim-pop flex h-[2em] w-[2em] items-center justify-center rounded-lg border-2 text-[1.3em] font-black" style={{ borderColor: PROG, color: PROG_DARK }}>
            {face}
          </span>
        )}
      </div>
      <div className="mt-[0.3em]">
        <Console lines={steps} title="Passo a passo" />
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 6, content, bare });

export const chapter6: BookPage[] = [
  page(
    <ChapterOpener n={6} title="JavaScript na Página" goals={["Funções e arrow functions", "Listas (arrays) e objetos", "Os cliques e o DOM", "Sorteios com Math.random"]}>
      <Fig h={34}>
        <ClickOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🧰">Funções</H>
      <P>
        Uma <T>função</T> é um bloco de código com nome, que você chama sempre que precisar. Ela pode receber valores (os <T>parâmetros</T>) e devolver um resultado com{" "}
        <T>return</T>. A <T>arrow function</T> (=&gt;) é um jeito curto de escrever:
      </P>
      <RunCode
        lang="js"
        code={"function somar(a, b) {\n  return a + b;\n}\nconst dobro = (n) => n * 2;\nconsole.log(somar(3, 4));\nconsole.log(dobro(somar(3, 4)));"}
        output={["7", "14"]}
      />
      <Box kind="mago" title="Por que usar funções?">
        Escreva uma vez e use mil vezes. Se precisar consertar, conserta num lugar só.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="📋">Listas e objetos</H>
      <P>
        Uma <T>lista</T> (array) guarda vários valores em ordem, entre colchetes. A posição começa no <T>0</T>: lista[0] é o primeiro. Um <T>objeto</T> guarda
        informações com nomes: {"{ nome: \"Ana\", nivel: 5 }"}. Teste os comandos:
      </P>
      <ArrayLab />
    </>,
  ),

  page(
    <>
      <H icon="🖱️">Os cliques e o DOM</H>
      <P>
        O <T>DOM</T> é a página vista pelo JavaScript: cada tag vira um objeto. O <T>document.querySelector</T> acha um elemento, o <T>addEventListener</T> espera um
        evento (como o clique) e o <T>textContent</T> troca o texto. Clique:
      </P>
      <ClickCounter />
    </>,
  ),

  page(
    <>
      <H icon="🎲">Sorteios</H>
      <P>
        <T>Math.random()</T> sorteia um número com vírgula entre 0 e 1 (nunca chega a 1). Para sortear um dado de 1 a 6, multiplicamos por 6, cortamos a vírgula com{" "}
        <T>Math.floor</T> e somamos 1:
      </P>
      <DiceRoll />
      <Box kind="sabia">
        <strong>setTimeout(funcao, 1000)</strong> espera 1.000 milissegundos (1 segundo) e só depois executa a função. É assim que os jogos fazem contagens regressivas.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Funções guardam um bloco de código com nome; return devolve o resultado.",
          "Arrays guardam listas; a primeira posição é a 0.",
          "push, pop, map, filter, length e includes trabalham com as listas.",
          "querySelector acha um elemento; addEventListener espera o clique.",
          "Math.floor(Math.random() * 6) + 1 sorteia um dado.",
        ]}
      />
      <Glossary
        items={[
          ["Função", "Um bloco de código com nome que pode ser chamado."],
          ["Parâmetro", "Um valor que a função recebe."],
          ["Array", "Uma lista de valores em ordem."],
          ["Objeto", "Um conjunto de informações com nomes (propriedades)."],
          ["DOM", "A página como o JavaScript enxerga: uma árvore de elementos."],
        ]}
      />
      <Quiz
        items={[
          ["O que faz o return numa função?", "Devolve o resultado da função."],
          ["Qual é a posição do primeiro item de um array?", "A posição 0."],
          ["O que faz [1, 2, 3].map((n) => n * 2)?", "Cria a lista [2, 4, 6]."],
          ["Qual método espera um clique num botão?", "addEventListener(\"click\", ...)."],
        ]}
      />
    </>,
  ),
];
