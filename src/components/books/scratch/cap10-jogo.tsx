"use client";

import { useEffect, useRef, useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Panel, SCR, SCR_DARK, Script } from "./art";

// ============================================================================
// CAPÍTULO 10 — CLONES E O SEU PRIMEIRO JOGO (missão "Scratch parte 2", a
// parte dos clones, e tudo o que veio antes): a nave atirando clones, o
// rascunho do jogo em três quadros, o jogo de pegar maçãs (de jogar!) e os
// scripts que fazem esse jogo no Scratch.
// ============================================================================

const FLAG = "quando 🚩 for clicado";

/** A navezinha (o centro em x, y). */
function Ship({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -30 L16 10 L0 2 L-16 10 Z" fill="#e2e8f0" stroke="#475569" strokeWidth="2" strokeLinejoin="round" />
      <circle cy="-8" r="6" fill="#38bdf8" stroke="#0369a1" strokeWidth="1.5" />
      <path d="M-8 10 L0 22 L8 10 Z" fill="#f97316" />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Abertura: a nave atirando clones
// ---------------------------------------------------------------------------

function ClonesOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma nave no espaço atira vários tiros iguais, todos clones do mesmo ator, que sobem e somem lá em cima">
      <rect width="460" height="300" fill="#0f172a" />
      {[
        [40, 40],
        [120, 90],
        [380, 50],
        [300, 140],
        [60, 200],
        [420, 220],
        [200, 30],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" fill="#e2e8f0">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" begin={`${-i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x="226" y="120" width="8" height="22" rx="4" fill="#fde047">
          <animate attributeName="y" values="220;-30" dur="1.6s" begin={`${-i * 0.4}s`} repeatCount="indefinite" />
        </rect>
      ))}
      <g>
        <animateTransform attributeName="transform" type="translate" values="-40 0;40 0;-40 0" dur="4s" repeatCount="indefinite" />
        <Ship x={230} y={250} s={1.6} />
      </g>
      <text x="230" y="290" textAnchor="middle" fontSize="15" fontWeight="900" fill="#fde68a" fontFamily="Georgia, serif">
        crie clone de mim mesmo
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O rascunho do jogo em três quadros
// ---------------------------------------------------------------------------

function StoryboardArt() {
  const frames = ["1. começa", "2. joga", "3. fim"];
  return (
    <Art viewBox="0 0 560 170" label="Um rascunho em três quadros: o começo com o título, o meio com as maçãs caindo na cesta e o fim com a pontuação">
      <rect width="560" height="170" rx="14" fill="#fff7ed" />
      {frames.map((f, i) => (
        <g key={f} transform={`translate(${24 + i * 180} 18)`}>
          <rect width="152" height="114" rx="8" fill="#fff" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 4" />
          <text x="76" y="134" textAnchor="middle" fontSize="13" fontWeight="900" fill={SCR_DARK} fontFamily="Georgia, serif">
            {f}
          </text>
        </g>
      ))}
      <g fontFamily="Georgia, serif" fontWeight="900" textAnchor="middle">
        <text x="100" y="66" fontSize="15" fill={SCR}>
          PEGA MAÇÃ
        </text>
        <text x="100" y="92" fontSize="11" fill="#475569">
          clique na bandeira
        </text>
        <text x="460" y="66" fontSize="15" fill={SCR}>
          FIM!
        </text>
        <text x="460" y="92" fontSize="12" fill="#475569">
          pontos: 12
        </text>
      </g>
      {[0, 1].map((i) => (
        <text key={i} x={260 + i * 40} y="60" fontSize="20">
          <animate attributeName="y" values="30;110" dur="1.8s" begin={`${-i * 0.9}s`} repeatCount="indefinite" />
          🍎
        </text>
      ))}
      <path d="M262 112 L318 112 L312 126 L268 126 Z" fill="#a16207" />
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O jogo de pegar maçãs (de jogar)
// ---------------------------------------------------------------------------

type Apple = { id: number; x: number; y: number; gold: boolean };

export function CatchGame() {
  const [running, setRunning] = useState(false);
  const [apples, setApples] = useState<Apple[]>([]);
  const [basket, setBasket] = useState(50);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  // as maçãs ficam num ref (o relógio do jogo mexe nelas) e o estado só redesenha
  const applesRef = useRef<Apple[]>([]);
  const basketRef = useRef(50);
  const nextId = useRef(0);
  basketRef.current = basket;

  useEffect(() => {
    if (!running) return;
    const tick = window.setInterval(() => {
      let caught = 0;
      const kept: Apple[] = [];
      for (const a of applesRef.current) {
        const y = a.y + (a.gold ? 3.2 : 2.4);
        if (y >= 84 && y <= 94 && Math.abs(a.x - basketRef.current) < 11) caught += a.gold ? 3 : 1;
        else if (y < 104) kept.push({ ...a, y });
      }
      applesRef.current = kept;
      setApples(kept);
      if (caught) setScore((sc) => sc + caught);
    }, 50);
    const spawn = window.setInterval(() => {
      applesRef.current = [...applesRef.current, { id: nextId.current++, x: 8 + Math.random() * 84, y: -6, gold: Math.random() < 0.15 }];
      setApples(applesRef.current);
    }, 750);
    const clock = window.setInterval(() => setTime((t) => t - 1), 1000);
    return () => {
      window.clearInterval(tick);
      window.clearInterval(spawn);
      window.clearInterval(clock);
    };
  }, [running]);

  useEffect(() => {
    if (running && time <= 0) {
      setRunning(false);
      applesRef.current = [];
      setApples([]);
    }
  }, [running, time]);

  function start() {
    setScore(0);
    setTime(30);
    applesRef.current = [];
    setApples([]);
    setRunning(true);
  }
  const move = (d: number) => setBasket((b) => Math.max(8, Math.min(92, b + d)));

  return (
    <Panel title="Pega maçã!">
      <div
        className="relative mx-auto h-[9em] max-w-[22em] touch-none overflow-hidden rounded-md border border-[#cbd5e1]"
        style={{ background: "linear-gradient(#bae6fd, #e0f2fe 70%, #86efac 70%)" }}
        onPointerMove={(e) => {
          if (!running) return;
          const r = e.currentTarget.getBoundingClientRect();
          setBasket(Math.max(8, Math.min(92, ((e.clientX - r.left) / r.width) * 100)));
        }}
        role="application"
        aria-label="O jogo: mova a cesta pra pegar as maçãs"
      >
        {apples.map((a) => (
          <span key={a.id} className="absolute -translate-x-1/2 text-[1.3em] leading-none" style={{ left: `${a.x}%`, top: `${a.y}%` }}>
            {a.gold ? "🌟" : "🍎"}
          </span>
        ))}
        <span className="absolute bottom-[6%] -translate-x-1/2 text-[1.8em] leading-none" style={{ left: `${basket}%` }}>
          🧺
        </span>
        <span className="absolute left-[0.4em] top-[0.3em] rounded bg-white/80 px-[0.4em] text-[0.75em] font-black text-[#DB6E00]">pontos {score}</span>
        <span className="absolute right-[0.4em] top-[0.3em] rounded bg-white/80 px-[0.4em] text-[0.75em] font-black text-[#2E8EB8]">tempo {Math.max(0, time)}</span>
        {!running && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-[0.3em] bg-white/60">
            {time <= 0 && <p className="cg-book-title text-[1.1em] font-black text-[#7c2d12]">Fim! Você fez {score} pontos.</p>}
            <button type="button" onClick={start} className="rounded-full bg-[#4cbf56] px-[1em] py-[0.15em] text-[0.9em] font-black text-white shadow">
              {time <= 0 ? "▶ Jogar de novo" : "▶ Começar"}
            </button>
          </div>
        )}
      </div>
      <div className="mt-[0.3em] flex items-center justify-center gap-[0.5em]">
        <button type="button" onClick={() => move(-12)} className="rounded-md border border-[#cbd5e1] bg-white px-[0.8em] font-black" aria-label="Cesta pra esquerda">
          ◀
        </button>
        <span className="text-[0.75em] text-[#8a7146]">Mova o mouse (ou o dedo) sobre o jogo, ou use os botões. 🌟 vale 3!</span>
        <button type="button" onClick={() => move(12)} className="rounded-md border border-[#cbd5e1] bg-white px-[0.8em] font-black" aria-label="Cesta pra direita">
          ▶
        </button>
      </div>
    </Panel>
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
      title="Clones e o Seu Primeiro Jogo"
      goals={["O que são os clones e quando usar", "Como planejar um jogo", "Um jogo pronto pra jogar", "Os scripts do jogo, passo a passo"]}
    >
      <Fig h={34}>
        <ClonesOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="👯">Os clones</H>
      <P>
        Os <T>clones</T> são cópias de um ator criadas enquanto o projeto roda. Num jogo de nave, cada tiro é um clone do mesmo ator: o <T>“crie clone de mim mesmo”</T>{" "}
        faz a cópia, e o <T>“quando eu começar como clone”</T> diz o que cada cópia faz.
      </P>
      <Script
        em={0.046}
        scripts={[
          [
            { c: "eve", t: "quando a tecla [espaço] for pressionada", hat: true },
            { c: "con", t: "crie clone de [mim mesmo]" },
          ],
          [
            { c: "con", t: "quando eu começar como clone", hat: true },
            { c: "con", t: "repita até «tocando em [borda]?»", inner: [{ c: "mov", t: "adicione (10) a y" }] },
            { c: "con", t: "apague este clone", cap: true },
          ],
        ]}
      />
      <Box kind="atencao">Sempre apague os clones que não servem mais (“apague este clone”). O Scratch aceita no máximo 300 clones ao mesmo tempo!</Box>
    </>,
  ),

  page(
    <>
      <H icon="📝">Planejando um jogo</H>
      <P>Antes de programar, os criadores de jogos fazem um plano. O nosso vai ser o “Pega maçã”: as maçãs caem do céu e o jogador pega com a cesta.</P>
      <Fig n="10.1" caption="O rascunho do jogo: o começo, a partida e o fim." h={17}>
        <StoryboardArt />
      </Fig>
      <List
        items={[
          <>
            <T>Atores:</T> a cesta e a maçã (que vira muitos clones).
          </>,
          <>
            <T>Regras:</T> cada maçã pega vale 1 ponto; o jogo dura 30 segundos.
          </>,
          <>
            <T>Teste</T> com amigos e melhore: mais rápido? maçã dourada?
          </>,
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🎮">Pega maçã!</H>
      <P>Este é o jogo que vamos programar. Jogue e veja quantos pontos você faz em 30 segundos:</P>
      <CatchGame />
    </>,
  ),

  page(
    <>
      <H icon="🧩">Os scripts do jogo</H>
      <P>
        No Scratch, o jogo precisa de poucos scripts. A <T>cesta</T> segue o mouse; a <T>maçã</T> cria um clone de vez em quando, e cada clone cai até tocar na cesta (ponto!)
        ou no chão.
      </P>
      <Script
        em={0.044}
        scripts={[
          [
            { c: "eve", t: FLAG, hat: true },
            { c: "var", t: "mude [pontos] para (0)" },
            { c: "con", t: "sempre", inner: [{ c: "mov", t: "mude x para {x do mouse}" }] },
          ],
          [
            { c: "con", t: "quando eu começar como clone", hat: true },
            { c: "mov", t: "vá para x: ⟦número aleatório entre (-220) e (220)⟧ y: (180)" },
            {
              c: "con",
              t: "repita até «tocando em [Cesta]?»",
              inner: [{ c: "mov", t: "adicione (-5) a y" }],
            },
            { c: "var", t: "adicione (1) a [pontos]" },
            { c: "con", t: "apague este clone", cap: true },
          ],
        ]}
      />
      <Box kind="mago" title="Agora é com você">
        Monte o jogo no Scratch, mude as fantasias, ponha um som de “pop” e um tempo limite. Depois compartilhe, remixe o de um amigo e dê os créditos!
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Clones são cópias de um ator criadas enquanto o projeto roda.",
          "Crie clone de mim mesmo faz a cópia; quando eu começar como clone diz o que ela faz.",
          "Apague os clones que não servem mais: o limite é de 300 ao mesmo tempo.",
          "Um jogo começa com um plano: atores, regras, pontuação, começo e fim.",
          "Teste, peça a opinião dos amigos e melhore: é assim que os jogos ficam bons.",
        ]}
      />
      <Glossary
        items={[
          ["Clone", "Uma cópia de um ator criada durante o projeto."],
          ["Rascunho", "O desenho do plano do jogo (storyboard)."],
          ["Pontuação", "As regras de como se ganha pontos."],
          ["Teste", "Jogar pra achar problemas e melhorar."],
          ["Depurar", "Achar e consertar os erros do programa."],
        ]}
      />
      <Quiz
        items={[
          ["Num jogo de nave, como cada tiro pode ser uma cópia do mesmo ator?", "Com “crie clone de mim mesmo” e “quando eu começar como clone”."],
          ["O que faz o “apague este clone”?", "Remove aquela cópia do projeto."],
          ["Que bloco faz a cesta seguir o mouse?", "“mude x para x do mouse” dentro de um sempre."],
          ["Qual é a primeira coisa a fazer antes de programar um jogo?", "Um plano: atores, regras e pontuação."],
        ]}
      />
    </>,
  ),
];
