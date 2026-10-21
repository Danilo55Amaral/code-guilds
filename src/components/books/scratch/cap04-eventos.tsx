"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { BlocksG, type Blk, OrangeCat, Panel, SCR_DARK, Script } from "./art";

// ============================================================================
// CAPÍTULO 4 — EVENTOS E MENSAGENS (missões "Blocos de Código no Scratch" e
// "Scratch parte 2", a parte dos Eventos): os blocos de chapéu caindo, as
// setas de tocar que mexem o gato, o envelope da mensagem voando do gato pro
// cachorro e o gato que mia quando é clicado (de tocar).
// ============================================================================

const FLAG = "quando 🚩 for clicado";

// ---------------------------------------------------------------------------
// Abertura: os blocos de chapéu
// ---------------------------------------------------------------------------

const HATS: Blk[] = [
  { c: "eve", t: FLAG, hat: true },
  { c: "eve", t: "quando a tecla [espaço] for pressionada", hat: true },
  { c: "eve", t: "quando este ator for clicado", hat: true },
  { c: "eve", t: "quando receber [mensagem1]", hat: true },
];

function HatsOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Quatro blocos amarelos de evento, em forma de chapéu, balançando: quando a bandeira for clicada, quando a tecla espaço for pressionada, quando este ator for clicado e quando receber mensagem1">
      <rect width="460" height="300" fill="#fefce8" />
      {HATS.map((b, i) => (
        <g key={b.t} transform={`translate(${i % 2 ? 122 : 18} ${30 + i * 62})`}>
          <g>
            <animateTransform attributeName="transform" type="rotate" values="-3;3;-3" dur="2.4s" begin={`${-i * 0.5}s`} repeatCount="indefinite" />
            <BlocksG blocks={[b]} x={0} y={0} />
          </g>
        </g>
      ))}
      <text x="230" y="290" textAnchor="middle" fontSize="16" fontWeight="900" fill={SCR_DARK} fontFamily="Georgia, serif">
        Os eventos dizem QUANDO o script começa
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As setas de tocar
// ---------------------------------------------------------------------------

const KEYS = [
  { key: "seta esquerda", icon: "←", dx: -30, dy: 0, block: "adicione (-30) a x" },
  { key: "seta direita", icon: "→", dx: 30, dy: 0, block: "adicione (30) a x" },
  { key: "seta para cima", icon: "↑", dx: 0, dy: 30, block: "adicione (30) a y" },
  { key: "seta para baixo", icon: "↓", dx: 0, dy: -30, block: "adicione (-30) a y" },
];

export function KeyControl() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [last, setLast] = useState(1);
  const k = KEYS[last];
  function press(i: number) {
    const kk = KEYS[i];
    setLast(i);
    setPos((p) => ({ x: Math.max(-210, Math.min(210, p.x + kk.dx)), y: Math.max(-150, Math.min(150, p.y + kk.dy)) }));
  }
  const btn = "flex h-[1.8em] w-[1.8em] items-center justify-center rounded-md border border-[#cbd5e1] bg-white text-[1em] font-black shadow-sm hover:bg-[#fefce8]";
  return (
    <Panel title="Aperte as setas">
      <div className="flex flex-wrap items-center justify-center gap-[0.7em]">
        <svg viewBox="-240 -180 480 360" className="h-[6.6em] w-[8.8em] rounded-md border border-[#cbd5e1] bg-white" aria-label={`O gato em x ${pos.x}, y ${pos.y}`}>
          <g style={{ transform: `translate(${pos.x}px, ${-pos.y + 34}px)`, transition: "transform 0.25s ease-out" }}>
            <OrangeCat s={1.3} costume={(Math.abs(pos.x + pos.y) / 30) % 2 ? 1 : 0} />
          </g>
        </svg>
        <div className="grid grid-cols-3 gap-[0.2em]">
          <span />
          <button type="button" className={btn} onClick={() => press(2)} aria-label="Seta para cima">
            ↑
          </button>
          <span />
          <button type="button" className={btn} onClick={() => press(0)} aria-label="Seta esquerda">
            ←
          </button>
          <button type="button" className={btn} onClick={() => press(3)} aria-label="Seta para baixo">
            ↓
          </button>
          <button type="button" className={btn} onClick={() => press(1)} aria-label="Seta direita">
            →
          </button>
        </div>
        <Script key={last} em={0.046} scripts={[[{ c: "eve", t: `quando a tecla [${k.key}] for pressionada`, hat: true }, { c: "mov", t: k.block }]]} />
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// O envelope da mensagem
// ---------------------------------------------------------------------------

function Dog({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-14 -14 L-16 0 M12 -14 L14 0" stroke="#a16207" strokeWidth="7" strokeLinecap="round" />
      <ellipse cx="0" cy="-24" rx="22" ry="14" fill="#ca8a04" stroke="#713f12" strokeWidth="1.5" />
      <circle cx="-22" cy="-40" r="15" fill="#ca8a04" stroke="#713f12" strokeWidth="1.5" />
      <ellipse cx="-12" cy="-44" rx="5" ry="10" fill="#713f12" />
      <circle cx="-27" cy="-43" r="2" fill="#1e293b" />
      <circle cx="-35" cy="-36" r="3" fill="#1e293b" />
      <path d="M22 -28 Q34 -38 30 -46" stroke="#ca8a04" strokeWidth="5" fill="none" strokeLinecap="round" />
    </g>
  );
}

function MessageArt() {
  return (
    <Art viewBox="0 0 560 190" label="O gato transmite a mensagem1, um envelope voa até o cachorro, e o cachorro, ao receber, pula e diz Oi, gato!">
      <rect width="560" height="190" rx="14" fill="#fefce8" />
      <rect y="160" width="560" height="30" fill="#bbf7d0" />
      <OrangeCat x={90} y={168} s={1.3} />
      {/* o envelope voando */}
      <g>
        <animateMotion path="M140 90 Q280 20 420 90" dur="4s" repeatCount="indefinite" keyPoints="0;0;1;1" keyTimes="0;0.2;0.5;1" calcMode="linear" />
        <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.19;0.2;0.5;0.51;1" dur="4s" repeatCount="indefinite" />
        <rect x="-18" y="-12" width="36" height="24" rx="2" fill="#fff" stroke="#CC9900" strokeWidth="2" />
        <path d="M-18 -12 L0 2 L18 -12" fill="none" stroke="#CC9900" strokeWidth="2" />
      </g>
      {/* o cachorro pula quando recebe */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 0;0 -24;0 0;0 0" keyTimes="0;0.52;0.6;0.68;1" dur="4s" repeatCount="indefinite" />
        <Dog x={470} y={168} />
      </g>
      <g opacity="0">
        <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.55;0.58;0.92;1" dur="4s" repeatCount="indefinite" />
        <rect x="380" y="64" width="92" height="28" rx="12" fill="#fff" stroke="#94a3b8" strokeWidth="2" />
        <text x="426" y="83" textAnchor="middle" fontSize="13" fontWeight="700" fill="#575e75" fontFamily="Helvetica, Arial, sans-serif">
          Oi, gato!
        </text>
      </g>
      <text x="90" y="44" textAnchor="middle" fontSize="12" fontWeight="900" fill="#CC9900" fontFamily="Helvetica, Arial, sans-serif">
        transmita mensagem1
      </text>
      <text x="470" y="44" textAnchor="middle" fontSize="12" fontWeight="900" fill="#CC9900" fontFamily="Helvetica, Arial, sans-serif">
        quando receber mensagem1
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O gato que mia quando é clicado (de tocar)
// ---------------------------------------------------------------------------

export function ClickCat() {
  const [clicks, setClicks] = useState(0);
  return (
    <Panel title="Clique no gato">
      <div className="flex flex-wrap items-center justify-center gap-[0.8em]">
        <Script
          em={0.048}
          scripts={[
            [
              { c: "eve", t: "quando este ator for clicado", hat: true },
              { c: "apa", t: "diga (Miau!) por (1) segundos" },
              { c: "mov", t: "gire ↻ (15) graus" },
            ],
          ]}
        />
        <button type="button" onClick={() => setClicks((c) => c + 1)} className="rounded-xl border border-[#cbd5e1] bg-white p-[0.2em]" aria-label="O gato: clique nele">
          <svg viewBox="-60 -100 130 110" className="block h-[5em] w-[6em]" aria-hidden="true">
            <g style={{ transform: `rotate(${clicks * 15}deg)`, transformOrigin: "0px -30px", transition: "transform 0.3s" }}>
              <OrangeCat />
            </g>
            {clicks > 0 && (
              <g key={clicks} className="cg-anim-fade">
                <rect x="10" y="-98" width="56" height="24" rx="10" fill="#fff" stroke="#94a3b8" strokeWidth="2" />
                <text x="38" y="-81" textAnchor="middle" fontSize="12" fontWeight="700" fill="#575e75" fontFamily="Helvetica, Arial, sans-serif">
                  Miau!
                </text>
              </g>
            )}
          </svg>
        </button>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 4, content, bare });

export const chapter4: BookPage[] = [
  page(
    <ChapterOpener
      n={4}
      title="Eventos e Mensagens"
      goals={["Os blocos de chapéu da categoria Eventos", "Como fazer o ator andar com as setas", "Atores conversando com mensagens", "O que acontece quando clicam no ator"]}
    >
      <Fig h={34}>
        <HatsOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🎩">Os blocos de chapéu</H>
      <P>
        Os blocos de <T>Eventos</T> (a categoria amarela) dizem <T>quando</T> um script começa: ao clicar na bandeira, ao apertar uma tecla, ao clicar no ator… Eles têm
        formato de <T>chapéu</T>: nada se encaixa em cima deles.
      </P>
      <Script em={0.045} scripts={[[HATS[0], { c: "apa", t: "diga (Olá!)" }], [HATS[2], { c: "som", t: "toque o som [Miau]" }]]} />
      <Box kind="sabia">
        Um ator pode ter vários scripts, cada um com o seu chapéu, e eles rodam <strong>ao mesmo tempo</strong> quando o evento acontece. É assim que o gato anda e mia
        junto.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="⌨️">As teclas</H>
      <P>
        O bloco <T>“quando a tecla [espaço] for pressionada”</T> começa o script sempre que a tecla é apertada. Com um script pra cada seta, o jogador controla o ator.
        Aperte as setas:
      </P>
      <KeyControl />
      <Box kind="lembre">Aqui no livro as setas do teclado viram a página; por isso, use os botões. No Scratch, use as teclas de verdade!</Box>
    </>,
  ),

  page(
    <>
      <H icon="✉️">Mensagens</H>
      <P>
        Os blocos <T>“transmita [mensagem1]”</T> e <T>“quando receber [mensagem1]”</T> fazem os atores conversarem: quando um ator transmite a mensagem, todos os scripts
        que começam com “quando receber” essa mensagem passam a rodar.
      </P>
      <Fig n="4.1" caption="O gato avisa, e o cachorro reage." h={20}>
        <MessageArt />
      </Fig>
      <Script em={0.048} scripts={[[HATS[0], { c: "apa", t: "diga (Olá!) por (2) segundos" }, { c: "eve", t: "transmita [mensagem1]" }], [HATS[3], { c: "apa", t: "diga (Oi, gato!)" }]]} />
    </>,
  ),

  page(
    <>
      <H icon="👆">Clique no ator</H>
      <P>
        O <T>“quando este ator for clicado”</T> é ótimo pra botões, personagens que reagem e jogos de clicar. Cada clique roda o script de novo:
      </P>
      <ClickCat />
      <Box kind="mago" title="Dica de jogo">
        Num jogo de clicar, some um ponto a cada clique: junte o “quando este ator for clicado” com uma variável de pontos (capítulo 7).
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Os blocos de Eventos (amarelos) dizem quando um script começa e têm formato de chapéu.",
          "Quando a bandeira for clicada é o começo mais comum.",
          "Quando a tecla for pressionada deixa o jogador controlar o ator.",
          "Transmita e quando receber fazem os atores conversarem com mensagens.",
          "Quando este ator for clicado reage aos cliques no ator.",
        ]}
      />
      <Glossary
        items={[
          ["Evento", "Algo que acontece e faz um script começar."],
          ["Bloco de chapéu", "O bloco que começa um script; nada encaixa em cima dele."],
          ["Transmitir", "Enviar uma mensagem pra todos os atores."],
          ["Mensagem", "Um aviso que faz scripts começarem."],
          ["Tecla", "Um botão do teclado."],
        ]}
      />
      <Quiz
        items={[
          ["De qual categoria é o bloco “quando a bandeira for clicada”?", "Eventos."],
          ["Que bloco começa um script quando o jogador aperta o espaço?", "Quando a tecla espaço for pressionada."],
          ["Pra que servem “transmita” e “quando receber”?", "Pra um ator avisar os outros que algo aconteceu, fazendo scripts começarem."],
          ["Por que os blocos de evento têm formato de chapéu?", "Porque eles começam o script: nada se encaixa em cima."],
        ]}
      />
    </>,
  ),
];
