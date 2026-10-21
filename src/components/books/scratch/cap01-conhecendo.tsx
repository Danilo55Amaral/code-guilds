"use client";

import { useEffect, useRef, useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { BlocksG, CAT_COLOR, FlagStop, OrangeCat, Panel, SCR_DARK, Script, StageFrame } from "./art";

// ============================================================================
// CAPÍTULO 1 — CONHECENDO O SCRATCH (missão "Introdução ao Scratch"): os
// blocos se encaixando ao lado do gato, a tela do Scratch com as partes, a
// bandeira verde de tocar (o script roda de verdade) e a comunidade.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: os blocos se encaixando
// ---------------------------------------------------------------------------

const OPENER_BLOCKS = [
  { c: "eve" as const, t: "quando 🚩 for clicado", hat: true },
  { c: "mov" as const, t: "mova (10) passos" },
  { c: "apa" as const, t: "diga (Olá!)" },
];

function SnapOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Três blocos do Scratch caem e se encaixam um embaixo do outro, e o gato laranja no palco diz Olá!">
      <rect width="460" height="300" fill="#fff7ed" />
      {/* os blocos caindo e se encaixando, um de cada vez */}
      {OPENER_BLOCKS.map((b, i) => {
        const y = 60 + (i === 0 ? 0 : 46 + (i - 1) * 32);
        const t0 = 0.08 + i * 0.16;
        return (
          <g key={b.t}>
            <animateTransform attributeName="transform" type="translate" values="0 -120;0 -120;0 0;0 0" keyTimes={`0;${t0.toFixed(2)};${(t0 + 0.1).toFixed(2)};1`} dur="6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0;1;1;0" keyTimes={`0;${t0.toFixed(2)};${(t0 + 0.05).toFixed(2)};0.92;1`} dur="6s" repeatCount="indefinite" />
            <BlocksG blocks={[b]} x={20} y={y} />
          </g>
        );
      })}
      {/* o palco com o gato */}
      <StageFrame x={250} y={60} w={190} h={150}>
        <rect x="0" y="110" width="190" height="40" rx="0" fill="#bbf7d0" />
        <OrangeCat x={80} y={128} s={1.2} />
        <g opacity="0">
          <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.55;0.6;0.92;1" dur="6s" repeatCount="indefinite" />
          <rect x="104" y="14" width="70" height="30" rx="12" fill="#fff" stroke="#94a3b8" strokeWidth="2" />
          <path d="M116 44 L110 56 L126 44 Z" fill="#fff" stroke="#94a3b8" strokeWidth="2" strokeLinejoin="round" />
          <text x="139" y="35" textAnchor="middle" fontSize="14" fontWeight="700" fill="#575e75" fontFamily="Helvetica, Arial, sans-serif">
            Olá!
          </text>
        </g>
      </StageFrame>
      <FlagStop x={262} y={40} s={1.1} />
      <text x="230" y="260" textAnchor="middle" fontSize="20" fontWeight="900" fill={SCR_DARK} fontFamily="Georgia, serif">
        Programar é encaixar blocos!
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A tela do Scratch
// ---------------------------------------------------------------------------

function InterfaceArt() {
  const cats = ["mov", "apa", "som", "eve", "con", "sen", "ope", "var"] as const;
  const tag = (x: number, y: number, n: number) => (
    <g transform={`translate(${x} ${y})`}>
      <circle r="11" fill={SCR_DARK} />
      <text y="4" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff" fontFamily="Georgia, serif">
        {n}
      </text>
    </g>
  );
  return (
    <Art viewBox="0 0 560 230" label="A tela do Scratch: 1, as categorias e os blocos à esquerda; 2, a área de código no meio; 3, o palco em cima à direita, com a bandeira verde; 4, a lista de atores embaixo do palco">
      <rect width="560" height="230" rx="10" fill="#e9eef2" />
      <rect width="560" height="22" rx="6" fill="#855cd6" />
      <text x="12" y="16" fontSize="12" fontWeight="900" fill="#fff" fontFamily="Helvetica, Arial, sans-serif">
        SCRATCH
      </text>
      {/* 1: as categorias e a paleta de blocos */}
      <rect x="6" y="28" width="40" height="196" fill="#fff" />
      {cats.map((c, i) => (
        <circle key={c} cx="26" cy={44 + i * 22} r="8" fill={CAT_COLOR[c][0]} />
      ))}
      <rect x="48" y="28" width="120" height="196" fill="#f9f9f9" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x="56" y={40 + i * 34} width={90 - (i % 2) * 20} height="22" rx="4" fill={CAT_COLOR.mov[0]} />
      ))}
      {/* 2: a área de código */}
      <rect x="172" y="28" width="196" height="196" fill="#fff" />
      <BlocksG
        blocks={[
          { c: "eve", t: "quando 🚩 for clicado", hat: true },
          { c: "con", t: "sempre", inner: [{ c: "mov", t: "mova (10) passos" }] },
        ]}
        x={182}
        y={50}
      />
      {/* 3: o palco */}
      <rect x="374" y="44" width="180" height="120" fill="#fff" stroke="#cbd5e1" />
      <OrangeCat x={440} y={140} s={0.9} />
      <FlagStop x={386} y={35} s={0.7} />
      {/* 4: os atores */}
      <rect x="374" y="168" width="180" height="56" fill="#fff" stroke="#cbd5e1" />
      <rect x="384" y="176" width="40" height="40" rx="6" fill="#ddd6fe" stroke="#855cd6" strokeWidth="2" />
      <OrangeCat x={400} y={210} s={0.4} />
      <rect x="430" y="176" width="40" height="40" rx="6" fill="#f1f5f9" />
      <text x="450" y="203" textAnchor="middle" fontSize="18">
        ⚽
      </text>
      {tag(26, 214, 1)}
      {tag(350, 210, 2)}
      {tag(542, 60, 3)}
      {tag(542, 196, 4)}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A bandeira verde de tocar (o script roda de verdade)
// ---------------------------------------------------------------------------

const FLAG_SCRIPT = [
  { c: "eve" as const, t: "quando 🚩 for clicado", hat: true },
  { c: "apa" as const, t: "diga (Olá!) por (2) segundos" },
  { c: "mov" as const, t: "mova (60) passos" },
  { c: "apa" as const, t: "diga (Vamos programar!)" },
];

export function FlagDemo() {
  const [step, setStep] = useState(0); // 0 parado, 1 dizendo Olá, 2 andando, 3 dizendo a última fala
  const timers = useRef<number[]>([]);
  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => clear, []);
  function go() {
    clear();
    setStep(1);
    timers.current.push(window.setTimeout(() => setStep(2), 2000));
    timers.current.push(window.setTimeout(() => setStep(3), 2700));
  }
  function stop() {
    clear();
    setStep(0);
  }
  const catX = step >= 2 ? 150 : 70;
  const bubble = step === 1 ? "Olá!" : step === 3 ? "Vamos programar!" : null;
  return (
    <Panel title="Clique na bandeira verde">
      <div className="flex flex-wrap items-center justify-center gap-[0.6em]">
        <Script scripts={[FLAG_SCRIPT]} em={0.045} />
        <div>
          <div className="flex items-center gap-[0.4em]">
            <button type="button" onClick={go} aria-label="Bandeira verde: começar" className="rounded-md border border-[#45993d] bg-[#e7f5e8] p-[0.15em]">
              <svg viewBox="-8 -12 28 26" className="block h-[1.2em] w-[1.3em]" aria-hidden="true">
                <path d="M-6 -10 L-6 12" stroke="#4d7c0f" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M-6 -10 Q0 -14 6 -10 Q12 -6 16 -10 L16 2 Q12 6 6 2 Q0 -2 -6 2 Z" fill="#4cbf56" stroke="#45993d" strokeWidth="1.5" />
              </svg>
            </button>
            <button type="button" onClick={stop} aria-label="Parar" className="h-[1.3em] w-[1.3em] rounded-sm bg-[#ec5959]" />
          </div>
          <svg viewBox="0 0 240 150" className="mt-[0.2em] block h-[6.5em] w-[10.4em] rounded-md border border-[#cbd5e1] bg-white" aria-label="O palco">
            <rect y="110" width="240" height="40" fill="#bbf7d0" />
            <g style={{ transform: `translate(${catX}px, 125px)`, transition: "transform 0.6s ease-out" }}>
              <OrangeCat costume={step === 2 ? 1 : 0} />
            </g>
            {bubble && (
              <g key={bubble} className="cg-anim-pop" style={{ transformBox: "fill-box", transformOrigin: "left bottom" }}>
                <rect x={catX + 30} y="14" width={bubble.length * 8 + 20} height="30" rx="12" fill="#fff" stroke="#94a3b8" strokeWidth="2" />
                <path d={`M${catX + 40} 44 L${catX + 34} 56 L${catX + 50} 44 Z`} fill="#fff" stroke="#94a3b8" strokeWidth="2" strokeLinejoin="round" />
                <text x={catX + 40 + (bubble.length * 8) / 2} y="34" textAnchor="middle" fontSize="13" fontWeight="700" fill="#575e75" fontFamily="Helvetica, Arial, sans-serif">
                  {bubble}
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 1, content, bare });

export const chapter1: BookPage[] = [
  page(
    <ChapterOpener
      n={1}
      title="Conhecendo o Scratch"
      goals={["O que é o Scratch e quem criou", "As partes da tela do Scratch", "Para que servem a bandeira verde e o botão vermelho", "Como salvar, compartilhar e remixar projetos"]}
    >
      <Fig h={34}>
        <SnapOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🐱">O que é o Scratch</H>
      <P>
        O <T>Scratch</T> é uma <T>linguagem de programação visual</T>: em vez de digitar código, você arrasta e <T>encaixa blocos coloridos</T>, como peças de
        quebra-cabeça. Ele foi criado pelo <T>MIT Media Lab</T>, um laboratório de uma universidade dos Estados Unidos, lançado em 2007, e é gratuito.
      </P>
      <Cards
        items={[
          { icon: "🎮", title: "Jogos", text: "De labirinto, de nave, de pegar coisas…" },
          { icon: "🎬", title: "Animações", text: "Personagens que andam, falam e dançam." },
          { icon: "📖", title: "Histórias", text: "Contos interativos, com escolhas." },
          { icon: "🎵", title: "Música e arte", text: "Instrumentos, desenhos e efeitos." },
        ]}
      />
      <Box kind="sabia">
        O Scratch funciona direto no navegador, em <strong>scratch.mit.edu</strong>, em mais de 70 idiomas, e é usado por milhões de crianças e jovens no mundo
        inteiro.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🖥️">A tela do Scratch</H>
      <P>A tela do Scratch tem quatro partes principais:</P>
      <Fig n="1.1" caption="As partes da tela do Scratch." h={23}>
        <InterfaceArt />
      </Fig>
      <ol className="ml-[1.2em] list-decimal text-[0.9em] leading-[1.5]">
        <li>
          as <T>categorias</T> e os <T>blocos</T>, cada categoria com a sua cor;
        </li>
        <li>
          a <T>área de código</T>, onde você monta os scripts;
        </li>
        <li>
          o <T>palco</T>, onde tudo acontece (com a bandeira verde em cima);
        </li>
        <li>
          os <T>atores</T> do projeto. Todo projeto novo já começa com o gato laranja.
        </li>
      </ol>
    </>,
  ),

  page(
    <>
      <H icon="🚩">A bandeira verde</H>
      <P>
        A <T>bandeira verde</T> começa o projeto: todos os scripts que começam com “quando a bandeira for clicada” passam a rodar. O <T>botão vermelho</T>, ao lado, para
        tudo. Experimente:
      </P>
      <FlagDemo />
      <Box kind="lembre">Os blocos rodam de cima pra baixo, um de cada vez, na ordem em que estão encaixados.</Box>
    </>,
  ),

  page(
    <>
      <H icon="🌐">Salvar, compartilhar e remixar</H>
      <P>
        Um projeto do Scratch 3 salvo no computador tem a extensão <T>.sb3</T>. É esse arquivo que você envia nas missões de entrega da CodeGuilds. No site do Scratch,
        dá pra compartilhar o projeto com a comunidade.
      </P>
      <Cards
        items={[
          { icon: "💾", title: "Salvar", text: "Arquivo → Baixar para o seu computador (.sb3)." },
          { icon: "📤", title: "Compartilhar", text: "Publica o projeto pra outras pessoas verem e jogarem." },
          { icon: "🔄", title: "Remix", text: "Criar a sua versão de um projeto de outra pessoa." },
          { icon: "🙌", title: "Créditos", text: "O Scratch mostra de quem é o projeto original." },
        ]}
      />
      <Box kind="atencao">Ao remixar, agradeça e dê o crédito ao autor original. E nunca coloque dados pessoais (nome completo, endereço, telefone) num projeto.</Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "O Scratch é uma linguagem de programação visual: montamos programas encaixando blocos.",
          "Foi criado pelo MIT Media Lab e lançado em 2007; é gratuito.",
          "A tela tem os blocos, a área de código, o palco e a lista de atores.",
          "A bandeira verde começa o projeto e o botão vermelho para tudo.",
          "Projetos do Scratch 3 são salvos em .sb3; remixar é criar a sua versão dando os créditos.",
        ]}
      />
      <Glossary
        items={[
          ["Bloco", "Uma peça de código que se encaixa nas outras."],
          ["Script", "Uma pilha de blocos encaixados."],
          ["Palco", "A área onde o projeto aparece rodando."],
          [".sb3", "A extensão dos arquivos do Scratch 3."],
          ["Remix", "Uma versão nova de um projeto de outra pessoa."],
        ]}
      />
      <Quiz
        items={[
          ["Quem criou o Scratch?", "O MIT Media Lab, um laboratório de uma universidade dos Estados Unidos."],
          ["Qual personagem aparece num projeto novo?", "O gato laranja, mascote do Scratch."],
          ["Para que serve a bandeira verde?", "Para começar o projeto."],
          ["Qual é a extensão do arquivo do Scratch 3?", ".sb3."],
        ]}
      />
    </>,
  ),
];
