"use client";

import { useEffect, useRef, useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Die } from "../matematica/art";
import { BlockButton, BlocksG, OrangeCat, Panel, SCR_DARK, Script } from "./art";

// ============================================================================
// CAPÍTULO 6 — SENSORES E OPERADORES (missões "Blocos de Código no Scratch",
// "Scratch parte 2" e "parte 3", a parte de Sensores e Operadores): o gato
// com a antena das perguntas, o pergunte e espere (de tocar), o laboratório
// dos operadores (de tocar) e o cronômetro (de tocar).
// ============================================================================

const FLAG = "quando 🚩 for clicado";

// ---------------------------------------------------------------------------
// Abertura: o gato com a antena das perguntas
// ---------------------------------------------------------------------------

function SensorOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="O gato com uma antena piscando e balões de pergunta em volta: tocando na borda? tecla espaço pressionada? e um dado sorteando números">
      <rect width="460" height="300" fill="#ecfeff" />
      <rect y="240" width="460" height="60" fill="#bbf7d0" />
      <OrangeCat x={210} y={250} s={2.2} />
      <path d="M262 112 L280 70" stroke="#2E8EB8" strokeWidth="4" strokeLinecap="round" />
      <circle cx="282" cy="66" r="9" fill="#5CB1D6">
        <animate attributeName="fill" values="#5CB1D6;#fde047;#5CB1D6" dur="1.2s" repeatCount="indefinite" />
      </circle>
      {[0, 1, 2].map((i) => (
        <circle key={i} cx="282" cy="66" r="12" fill="none" stroke="#5CB1D6" strokeWidth="3">
          <animate attributeName="r" values="12;48" dur="2.4s" begin={`${-i * 0.8}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0" dur="2.4s" begin={`${-i * 0.8}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <BlocksG blocks={[{ c: "con", t: "se «tocando em [borda]?» então", inner: [] }]} x={18} y={22} />
      <g transform="translate(386 180)">
        {[1, 2, 3, 4, 5, 6].map((n, i) => (
          <g key={n} opacity="0">
            <animate attributeName="opacity" values={[0, 1, 2, 3, 4, 5].map((j) => (j === i ? 1 : 0)).join(";")} keyTimes="0;0.1667;0.3333;0.5;0.6667;0.8333" dur="2.4s" calcMode="discrete" repeatCount="indefinite" />
            <Die x={0} y={0} n={n} s={56} />
          </g>
        ))}
      </g>
      <text x="386" y="236" textAnchor="middle" fontSize="12" fontWeight="900" fill="#389438" fontFamily="Helvetica, Arial, sans-serif">
        número aleatório
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O pergunte e espere (de tocar)
// ---------------------------------------------------------------------------

export function AskDemo() {
  const [name, setName] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  return (
    <Panel title="O gato quer saber o seu nome">
      <div className="flex flex-wrap items-center justify-center gap-[0.6em]">
        <Script
          em={0.046}
          scripts={[
            [
              { c: "eve", t: FLAG, hat: true },
              { c: "sen", t: "pergunte (Qual é o seu nome?) e espere" },
              { c: "apa", t: "diga ⟦junte (Olá, ) {resposta}⟧" },
            ],
          ]}
          label="Quando a bandeira for clicada, pergunte Qual é o seu nome? e espere; diga junte Olá com a resposta"
        />
        <div className="flex flex-col items-center gap-[0.3em]">
          <svg viewBox="-60 -110 160 120" className="h-[5em] w-[6.5em] rounded-md border border-[#cbd5e1] bg-white" aria-label="O gato">
            <OrangeCat />
            <rect x="0" y="-106" width="96" height="30" rx="12" fill="#fff" stroke="#94a3b8" strokeWidth="2" />
            <text x="48" y="-86" textAnchor="middle" fontSize="11" fontWeight="700" fill="#575e75" fontFamily="Helvetica, Arial, sans-serif">
              {answer === null ? "Qual é o seu nome?" : `Olá, ${answer.slice(0, 12)}!`}
            </text>
          </svg>
          <form
            className="flex gap-[0.3em]"
            onSubmit={(e) => {
              e.preventDefault();
              setAnswer(name.trim() || "aluno");
            }}
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              placeholder="Digite um nome"
              aria-label="A resposta"
              className="w-[8em] rounded-full border border-[#5CB1D6] bg-white px-[0.6em] text-[0.82em] outline-none"
            />
            <button type="submit" className="rounded-full bg-[#5CB1D6] px-[0.6em] text-[0.82em] font-black text-white">
              ✓
            </button>
          </form>
        </div>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// O laboratório dos operadores (de tocar)
// ---------------------------------------------------------------------------

export function OperatorsLab() {
  const [die, setDie] = useState(4);
  const [points, setPoints] = useState(12);
  const [a, setA] = useState("Olá");
  const [b, setB] = useState("mundo");
  const field = "w-[5em] rounded-full border border-[#389438] bg-white px-[0.5em] text-[0.82em] outline-none";
  return (
    <Panel title="Laboratório dos operadores">
      <div className="space-y-[0.4em] text-[0.85em]">
        <div className="flex flex-wrap items-center justify-center gap-[0.5em]">
          <BlockButton c="ope" onClick={() => setDie(1 + Math.floor(Math.random() * 6))}>
            número aleatório entre 1 e 6
          </BlockButton>
          <svg viewBox="-25 -25 50 50" className="h-[2.2em] w-[2.2em]" aria-label={`Saiu ${die}`}>
            <g key={die} className="cg-anim-pop" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <Die x={0} y={0} n={die} s={42} />
            </g>
          </svg>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-[0.5em]">
          <span className="font-bold text-[#3b2a14]">pontos =</span>
          <input type="range" min={0} max={20} value={points} onChange={(e) => setPoints(Number(e.target.value))} className="w-[6em] accent-[#ff8c1a]" aria-label="Os pontos" />
          <span className="font-black text-[#DB6E00]">{points}</span>
          <span className="rounded-md bg-[#59C059] px-[0.5em] font-bold text-white">(pontos) &gt; (10)</span>
          <span className="font-black" style={{ color: points > 10 ? "#16a34a" : "#dc2626" }}>
            → {points > 10 ? "verdadeiro" : "falso"}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-[0.4em]">
          <span className="rounded-md bg-[#59C059] px-[0.5em] font-bold text-white">junte</span>
          <input value={a} onChange={(e) => setA(e.target.value)} maxLength={12} className={field} aria-label="Primeiro texto" />
          <input value={b} onChange={(e) => setB(e.target.value)} maxLength={12} className={field} aria-label="Segundo texto" />
          <span className="font-black" style={{ color: SCR_DARK }}>
            → “{a + b}”
          </span>
        </div>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// O cronômetro (de tocar)
// ---------------------------------------------------------------------------

export function TimerDemo() {
  const [start, setStart] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [stopped, setStopped] = useState<number | null>(null);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    if (start === null || stopped !== null) return;
    const tick = () => {
      setNow(performance.now());
      raf.current = window.requestAnimationFrame(tick);
    };
    raf.current = window.requestAnimationFrame(tick);
    return () => {
      if (raf.current) window.cancelAnimationFrame(raf.current);
    };
  }, [start, stopped]);
  const value = start === null ? 0 : ((stopped ?? now) - start) / 1000;
  return (
    <Panel title="Pare o cronômetro no 3,0!">
      <div className="flex flex-wrap items-center justify-center gap-[0.6em]">
        <div className="rounded-lg border border-[#5CB1D6] bg-white px-[0.8em] py-[0.1em] text-center">
          <p className="text-[0.7em] font-bold text-[#2E8EB8]">cronômetro</p>
          <p className="cg-book-title text-[1.6em] font-black tabular-nums" style={{ color: SCR_DARK }}>
            {Math.max(0, value).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          </p>
        </div>
        <div className="flex flex-col gap-[0.25em]">
          <BlockButton
            c="sen"
            onClick={() => {
              const t = performance.now();
              setStart(t);
              setNow(t);
              setStopped(null);
            }}
          >
            zere o cronômetro (começar)
          </BlockButton>
          <BlockButton c="con" onClick={() => start !== null && stopped === null && setStopped(performance.now())} disabled={start === null || stopped !== null}>
            pare (pra ver o tempo)
          </BlockButton>
        </div>
      </div>
      {stopped !== null && (
        <p className="cg-anim-fade mt-[0.25em] text-center text-[0.85em] font-bold text-[#3b2a14]">
          {Math.abs(value - 3) < 0.15 ? "🎯 Na mosca!" : `Faltou ${Math.abs(value - 3).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} segundo pra acertar.`}
        </p>
      )}
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 6, content, bare });

export const chapter6: BookPage[] = [
  page(
    <ChapterOpener
      n={6}
      title="Sensores e Operadores"
      goals={["Os sensores: perguntas de verdadeiro ou falso", "Pergunte e resposta: conversar com o jogador", "Os operadores: sortear, comparar e juntar", "O cronômetro"]}
    >
      <Fig h={34}>
        <SensorOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="📡">Os sensores</H>
      <P>
        Os blocos de <T>Sensores</T> (azul-claro) fazem perguntas sobre o que está acontecendo e respondem <T>verdadeiro ou falso</T>. Por isso eles têm ponta de
        hexágono e se encaixam no “se”:
      </P>
      <Script em={0.044} scripts={[[{ c: "eve", t: FLAG, hat: true }, { c: "con", t: "sempre", inner: [{ c: "con", t: "se «tocando em [borda]?» então", inner: [{ c: "apa", t: "diga (Ai!) por (1) segundos" }] }] }]]} />
      <Cards
        items={[
          { icon: "🧱", title: "tocando em…?", text: "Na borda, no mouse ou em outro ator." },
          { icon: "🎨", title: "tocando na cor…?", text: "Ótimo pra labirintos e chão de lava." },
          { icon: "⌨️", title: "tecla … pressionada?", text: "Pra checar teclas dentro do sempre." },
          { icon: "📏", title: "distância até…", text: "Quão longe está o mouse ou outro ator." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="💬">Pergunte e resposta</H>
      <P>
        O <T>“pergunte … e espere”</T> mostra uma caixa pro jogador digitar. O que ele escrever fica guardado no bloco <T>“resposta”</T>, que dá pra usar em outros
        blocos. Responda o gato:
      </P>
      <AskDemo />
      <Box kind="mago" title="Ideia de projeto">
        Faça um quiz: pergunte “Quanto é 7 × 8?” e use um “se «(resposta) = (56)» então” pra dizer “Acertou!”.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🎲">Os operadores</H>
      <P>
        Os <T>Operadores</T> (verde) fazem contas, sorteiam, comparam e mexem com textos. O <T>“número aleatório”</T> é perfeito pra dados e inimigos que aparecem em
        lugares diferentes; o <T>maior que (&gt;)</T> compara; e o <T>“junte”</T> cola dois textos exatamente como estão:
      </P>
      <OperatorsLab />
      <Box kind="atencao">O “junte (Olá) (mundo)” dá “Olámundo”, tudo grudado. Pra ter espaço, escreva “Olá ” com um espaço no final.</Box>
    </>,
  ),

  page(
    <>
      <H icon="⏱️">O cronômetro</H>
      <P>
        O <T>cronômetro</T> do Scratch conta os segundos desde que o projeto começou ou desde o último <T>“zere o cronômetro”</T>. Numa corrida, zere na largada e, na
        chegada, mostre o tempo. Teste os seus reflexos:
      </P>
      <TimerDemo />
      <Script em={0.048} scripts={[[{ c: "eve", t: FLAG, hat: true }, { c: "sen", t: "zere o cronômetro" }, { c: "con", t: "espere até «tocando em [Chegada]?»" }, { c: "apa", t: "diga {cronômetro}" }]]} />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Os Sensores perguntam (tocando em? tecla pressionada?) e respondem verdadeiro ou falso.",
          "Pergunte e espere mostra uma caixa; o que o jogador digita fica no bloco resposta.",
          "Número aleatório entre 1 e 6 sorteia um número, como um dado.",
          "Maior que (>) compara dois valores; junte cola dois textos sem espaço.",
          "O cronômetro conta os segundos desde o último zere o cronômetro.",
        ]}
      />
      <Glossary
        items={[
          ["Sensor", "Bloco que pergunta algo sobre o projeto."],
          ["Verdadeiro/falso", "As duas respostas possíveis de uma condição."],
          ["Resposta", "O bloco que guarda o que o jogador digitou."],
          ["Operador", "Bloco de contas, comparações e textos."],
          ["Aleatório", "Sorteado, sem dar pra prever."],
        ]}
      />
      <Quiz
        items={[
          ["Qual bloco sorteia um número de 1 a 6?", "Número aleatório entre 1 e 6 (Operadores)."],
          ["Onde fica guardado o que o jogador digita no “pergunte”?", "No bloco resposta."],
          ["Qual é o resultado de “junte (Olá) (mundo)”?", "“Olámundo”, tudo grudado."],
          ["Quais blocos medem o tempo de uma corrida?", "Zere o cronômetro e o bloco cronômetro."],
        ]}
      />
    </>,
  ),
];
