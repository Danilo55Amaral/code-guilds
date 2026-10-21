"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { ChoiceGame } from "../portugues/art";
import { BlockButton, CAT_COLOR, OrangeCat, Panel, SCR, SCR_DARK, Script } from "./art";

// ============================================================================
// CAPÍTULO 7 — VARIÁVEIS E LISTAS (missões "Blocos de Código no Scratch" e
// "Scratch parte 3", a parte das Variáveis): as caixas com o nome contando
// os pontos, o placar (de tocar), as variáveis de todos e as de um ator só,
// a lista de frutas (de tocar) e o jogo das variáveis.
// ============================================================================

const FLAG = "quando 🚩 for clicado";
const [VAR, VAR_DARK] = CAT_COLOR.var;
const [LIST, LIST_DARK] = CAT_COLOR.lis;

/** O mostrador de uma variável no palco (o nome e o valor), em HTML. */
function Monitor({ name, value }: { name: string; value: string | number }) {
  return (
    <span className="inline-flex items-center gap-[0.3em] rounded-md border border-[#cbd5e1] bg-[#f1f5f9] px-[0.35em] py-[0.05em] text-[0.82em] font-bold text-[#575e75]">
      {name}
      <span key={String(value)} className="cg-anim-pop inline-block min-w-[1.8em] rounded px-[0.3em] text-center text-white" style={{ background: VAR }}>
        {value}
      </span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Abertura: as caixas das variáveis
// ---------------------------------------------------------------------------

function BoxesOpenerArt() {
  const box = (x: number, label: string, values: string[], dur: number) => (
    <g transform={`translate(${x} 150)`}>
      <path d="M-60 -10 L0 -40 L60 -10 L0 20 Z" fill="#fed7aa" stroke={VAR_DARK} strokeWidth="3" />
      <path d="M-60 -10 L-60 70 L0 100 L0 20 Z" fill={VAR} stroke={VAR_DARK} strokeWidth="3" />
      <path d="M60 -10 L60 70 L0 100 L0 20 Z" fill="#ea580c" stroke={VAR_DARK} strokeWidth="3" />
      <rect x="-50" y="-92" width="100" height="30" rx="8" fill="#fff" stroke={VAR_DARK} strokeWidth="2" />
      <text y="-71" textAnchor="middle" fontSize="16" fontWeight="900" fill={VAR_DARK} fontFamily="Helvetica, Arial, sans-serif">
        {label}
      </text>
      {values.map((v, i) => (
        <text key={v + i} x="0" y="10" textAnchor="middle" fontSize="30" fontWeight="900" fill="#7c2d12" fontFamily="Georgia, serif" opacity={i === 0 ? 1 : 0}>
          <animate attributeName="opacity" values={values.map((_, j) => (j === i ? 1 : 0)).join(";")} keyTimes={values.map((_, j) => (j / values.length).toFixed(3)).join(";")} dur={`${dur}s`} calcMode="discrete" repeatCount="indefinite" />
          {v}
        </text>
      ))}
    </g>
  );
  return (
    <Art viewBox="0 0 460 300" label="Duas caixas com etiquetas: na caixa pontos o número sobe de 0 a 3; na caixa vidas, os corações vão de 3 a 1">
      <rect width="460" height="300" fill="#fff7ed" />
      {box(130, "pontos", ["0", "1", "2", "3"], 4)}
      {box(330, "vidas", ["❤❤❤", "❤❤", "❤"], 4.5)}
      <text x="230" y="285" textAnchor="middle" fontSize="18" fontWeight="900" fill={SCR_DARK} fontFamily="Georgia, serif">
        Uma variável é uma caixa com nome
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O placar (de tocar)
// ---------------------------------------------------------------------------

export function ScoreDemo() {
  const [points, setPoints] = useState(7);
  return (
    <Panel title="Mexa na variável pontos">
      <div className="flex flex-wrap items-center justify-center gap-[0.6em]">
        <div className="relative rounded-md border border-[#cbd5e1] bg-white p-[0.4em]">
          <Monitor name="pontos" value={points} />
          <svg viewBox="-60 -80 120 90" className="mx-auto mt-[0.2em] block h-[3.6em] w-[5em]" aria-hidden="true">
            <OrangeCat costume={(points % 2) as 0 | 1} />
          </svg>
        </div>
        <div className="flex flex-col gap-[0.25em]">
          <BlockButton c="var" onClick={() => setPoints(0)}>
            mude pontos para 0
          </BlockButton>
          <BlockButton c="var" onClick={() => setPoints((p) => p + 1)}>
            adicione 1 a pontos
          </BlockButton>
          <BlockButton c="var" onClick={() => setPoints((p) => p - 1)}>
            adicione -1 a pontos
          </BlockButton>
        </div>
      </div>
      <p className="mt-[0.3em] text-center text-[0.8em] text-[#3b2a14]">
        <strong>mude</strong> troca o valor; <strong>adicione</strong> soma ao que já tem.
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Para todos os atores × apenas este ator
// ---------------------------------------------------------------------------

function ScopeArt() {
  const enemy = (x: number, life: number) => (
    <g transform={`translate(${x} 150)`}>
      <ellipse cy="-20" rx="26" ry="22" fill="#a855f7" stroke="#6b21a8" strokeWidth="2" />
      <circle cx="-9" cy="-26" r="5" fill="#fff" />
      <circle cx="9" cy="-26" r="5" fill="#fff" />
      <circle cx="-9" cy="-25" r="2" fill="#1e293b" />
      <circle cx="9" cy="-25" r="2" fill="#1e293b" />
      <rect x="-30" y="10" width="60" height="22" rx="5" fill="#f1f5f9" stroke="#cbd5e1" />
      <text y="26" textAnchor="middle" fontSize="12" fontWeight="900" fill={VAR_DARK} fontFamily="Helvetica, Arial, sans-serif">
        vida {life}
      </text>
    </g>
  );
  return (
    <Art viewBox="0 0 560 190" label="No palco, a variável pontos aparece uma vez só, para todos os atores; e cada um dos dois inimigos tem a sua vida, 3 e 1, só dele">
      <rect width="560" height="190" rx="14" fill="#fff7ed" />
      <rect x="20" y="14" width="300" height="164" rx="8" fill="#fff" stroke="#cbd5e1" strokeWidth="2" />
      <rect x="30" y="24" width="96" height="24" rx="5" fill="#f1f5f9" stroke="#cbd5e1" />
      <text x="40" y="41" fontSize="12" fontWeight="900" fill="#575e75" fontFamily="Helvetica, Arial, sans-serif">
        pontos
      </text>
      <rect x="88" y="28" width="32" height="16" rx="3" fill={VAR} />
      <text x="104" y="41" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff" fontFamily="Helvetica, Arial, sans-serif">
        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        12
      </text>
      <OrangeCat x={70} y={150} s={0.9} />
      {enemy(170, 3)}
      {enemy(260, 1)}
      <g fontFamily="Georgia, serif" fontWeight="900" fontSize="13">
        <text x="340" y="50" fill={VAR_DARK}>
          Para todos os atores:
        </text>
        <text x="340" y="70" fill="#334155">
          os pontos do jogo, que
        </text>
        <text x="340" y="88" fill="#334155">
          todo mundo vê e muda.
        </text>
        <text x="340" y="126" fill={VAR_DARK}>
          Apenas para este ator:
        </text>
        <text x="340" y="146" fill="#334155">
          a vida de cada inimigo,
        </text>
        <text x="340" y="164" fill="#334155">
          que é só dele.
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A lista de frutas (de tocar)
// ---------------------------------------------------------------------------

const FRUITS = ["maçã", "banana", "uva", "manga", "pera", "caju"];

export function ListDemo() {
  const [items, setItems] = useState(["maçã", "banana"]);
  const [picked, setPicked] = useState<string | null>(null);
  const next = FRUITS.find((f) => !items.includes(f));
  return (
    <Panel title="A lista frutas">
      <div className="flex flex-wrap items-start justify-center gap-[0.7em]">
        <div className="w-[8em] rounded-md border border-[#cbd5e1] bg-[#f1f5f9] p-[0.25em] text-[0.82em]">
          <p className="text-center font-bold text-[#575e75]">frutas</p>
          <ol className="min-h-[5.5em] space-y-[0.15em]">
            {items.map((f, i) => (
              <li key={f} className="cg-anim-fade flex items-center gap-[0.3em]">
                <span className="w-[1em] text-right text-[0.85em] text-[#575e75]">{i + 1}</span>
                <span className="flex-1 rounded px-[0.3em] text-white" style={{ background: LIST, outline: picked === f ? `2px solid ${LIST_DARK}` : undefined }}>
                  {f}
                </span>
              </li>
            ))}
          </ol>
          <p className="text-center text-[0.8em] text-[#575e75]">tamanho: {items.length}</p>
        </div>
        <div className="flex flex-col gap-[0.25em]">
          <BlockButton c="lis" onClick={() => next && setItems((l) => [...l, next])} disabled={!next}>
            adicione {next ?? "…"} a frutas
          </BlockButton>
          <BlockButton
            c="lis"
            onClick={() => {
              setItems((l) => l.slice(1));
              setPicked(null);
            }}
            disabled={items.length === 0}
          >
            apague o item 1 de frutas
          </BlockButton>
          <BlockButton c="lis" onClick={() => items.length && setPicked(items[Math.floor(Math.random() * items.length)])} disabled={items.length === 0}>
            item (aleatório) de frutas
          </BlockButton>
          {picked && (
            <p key={picked} className="cg-anim-pop text-center text-[0.85em] font-black" style={{ color: LIST_DARK }}>
              sorteou: {picked}
            </p>
          )}
        </div>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// O jogo das variáveis
// ---------------------------------------------------------------------------

const VAR_GAME = [
  { prompt: "“mude pontos para 0” e depois “repita 3 vezes: adicione 1 a pontos”. Quanto vale pontos?", options: ["1", "3", "4"], answer: 1, explain: "Começa em 0 e soma 1 três vezes: 0 + 1 + 1 + 1 = 3." },
  { prompt: "Você quer guardar “maçã”, “banana” e “uva” de uma vez. O que cria?", options: ["Uma variável", "Uma lista", "Um cenário"], answer: 1, explain: "A variável guarda um valor só; a lista guarda vários, em ordem." },
  { prompt: "A vida de cada inimigo deve ser:", options: ["Para todos os atores", "Apenas para este ator"], answer: 1, explain: "Cada inimigo tem a sua vida: a variável é só dele." },
  { prompt: "Por que zerar os pontos quando a bandeira é clicada?", options: ["Pra o jogo começar do zero", "Pra o gato andar mais rápido"], answer: 0, explain: "Senão a partida nova começaria com os pontos da partida anterior." },
];

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 7, content, bare });

export const chapter7: BookPage[] = [
  page(
    <ChapterOpener
      n={7}
      title="Variáveis e Listas"
      goals={["O que é uma variável", "Mudar e adicionar: o placar do jogo", "Variáveis de todos os atores e de um ator só", "As listas"]}
    >
      <Fig h={34}>
        <BoxesOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="📦">As variáveis</H>
      <P>
        Uma <T>variável</T> é como uma caixa com um nome, que guarda um valor: os pontos, as vidas, o tempo, o nome do jogador. Elas ficam na categoria{" "}
        <T>Variáveis</T> (laranja). Pra criar, clique em “Criar uma Variável”.
      </P>
      <ScoreDemo />
      <Script em={0.048} scripts={[[{ c: "eve", t: FLAG, hat: true }, { c: "var", t: "mude [pontos] para (0)" }, { c: "con", t: "repita (3) vezes", inner: [{ c: "var", t: "adicione (1) a [pontos]" }] }]]} />
    </>,
  ),

  page(
    <>
      <H icon="👥">De todos ou de um só?</H>
      <P>
        Ao criar uma variável, o Scratch pergunta: <T>“Para todos os atores”</T> ou <T>“Apenas para este ator”</T>? A primeira é compartilhada; a segunda é própria de
        cada ator (e dos clones dele).
      </P>
      <Fig n="7.1" caption="Os pontos são de todos; a vida é de cada inimigo." h={21}>
        <ScopeArt />
      </Fig>
      <Box kind="lembre">Marque a caixinha ao lado da variável pra mostrar o valor dela no palco: é o mostrador (monitor).</Box>
    </>,
  ),

  page(
    <>
      <H icon="📋">As listas</H>
      <P>
        Uma variável guarda um valor só. Uma <T>lista</T> guarda <T>vários valores, em ordem</T>, cada um com o seu número. É ótima pra perguntas de um quiz, nomes de
        jogadores ou um inventário. Mexa na lista:
      </P>
      <ListDemo />
      <Script
        em={0.046}
        scripts={[
          [
            { c: "eve", t: FLAG, hat: true },
            { c: "lis", t: "apague todos os itens de [frutas]" },
            { c: "lis", t: "adicione (maçã) a [frutas]" },
            { c: "lis", t: "adicione (banana) a [frutas]" },
            { c: "apa", t: "diga {frutas} por (2) segundos" },
          ],
        ]}
      />
      <Box kind="sabia">No Scratch, a lista começa no item 1, não no 0 como em muitas outras linguagens de programação.</Box>
    </>,
  ),

  page(
    <>
      <H icon="🧠">Teste as variáveis</H>
      <P>Hora de pensar como o computador: siga os blocos de cabeça e escolha a resposta.</P>
      <ChoiceGame items={VAR_GAME} color={SCR} title="Variáveis e listas" />
      <Cards
        items={[
          { icon: "🏆", title: "Recorde", text: "Guarde o maior placar numa variável e compare no fim." },
          { icon: "❤️", title: "Vidas", text: "Comece com 3 e tire 1 quando o jogador for pego." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Uma variável é uma caixa com nome que guarda um valor: pontos, vidas, tempo.",
          "Mude troca o valor; adicione soma ao valor que já existe.",
          "Zere as variáveis quando a bandeira for clicada, pro jogo começar do zero.",
          "Para todos os atores é compartilhada; apenas para este ator é própria de cada um.",
          "Uma lista guarda vários valores em ordem: adicione, apague e item de.",
        ]}
      />
      <Glossary
        items={[
          ["Variável", "Uma caixa com nome que guarda um valor."],
          ["Valor", "O que está guardado na variável."],
          ["Mostrador", "O quadrinho que mostra a variável no palco."],
          ["Lista", "Vários valores guardados em ordem."],
          ["Item", "Cada valor de uma lista."],
        ]}
      />
      <Quiz
        items={[
          ["Qual é a diferença entre “mude” e “adicione”?", "Mude troca o valor; adicione soma ao que já tem."],
          ["“mude pontos para 0” e “repita 3 vezes: adicione 1 a pontos”. Quanto vale pontos?", "3."],
          ["O que guarda vários valores de uma vez?", "Uma lista."],
          ["A vida de cada inimigo é para todos os atores ou apenas para este ator?", "Apenas para este ator."],
        ]}
      />
    </>,
  ),
];
