"use client";

import { useEffect, useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { BlockButton, OrangeCat, Panel, SCR, SCR_DARK, Script } from "./art";

// ============================================================================
// CAPÍTULO 2 — ATORES, FANTASIAS E CENÁRIOS (missão "Introdução ao Scratch",
// a parte dos atores): o gato andando e trocando de cenário, a lista de
// atores, o animador de fantasias (de tocar), os cenários trocando e o palco
// das coordenadas (de tocar).
// ============================================================================

const BACKDROPS = [
  { name: "floresta", sky: "#bae6fd", ground: "#86efac" },
  { name: "espaço", sky: "#1e1b4b", ground: "#475569" },
  { name: "praia", sky: "#7dd3fc", ground: "#fde68a" },
];

// ---------------------------------------------------------------------------
// Abertura: o gato andando e o cenário trocando
// ---------------------------------------------------------------------------

function WalkOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="O gato laranja anda pelo palco trocando de fantasia, e o cenário muda de floresta para espaço e para praia">
      {BACKDROPS.map((b, i) => (
        <g key={b.name} opacity={i === 0 ? 1 : 0}>
          <animate attributeName="opacity" values={[0, 1, 2].map((j) => (j === i ? 1 : 0)).join(";")} keyTimes="0;0.3333;0.6667" dur="9s" calcMode="discrete" repeatCount="indefinite" />
          <rect width="460" height="300" fill={b.sky} />
          <rect y="220" width="460" height="80" fill={b.ground} />
          {i === 0 && [60, 140, 380].map((x) => <circle key={x} cx={x} cy="190" r="34" fill="#16a34a" />)}
          {i === 1 &&
            [
              [60, 40],
              [200, 80],
              [330, 30],
              [410, 120],
              [120, 140],
            ].map(([x, y]) => <circle key={x} cx={x} cy={y} r="2.5" fill="#fff" />)}
          {i === 2 && <circle cx="390" cy="60" r="30" fill="#fde047" />}
          <text x="230" y="40" textAnchor="middle" fontSize="16" fontWeight="900" fill={i === 1 ? "#e0e7ff" : SCR_DARK} fontFamily="Georgia, serif">
            cenário: {b.name}
          </text>
        </g>
      ))}
      <g>
        <animateTransform attributeName="transform" type="translate" values="-60 0;520 0" dur="9s" repeatCount="indefinite" />
        {[0, 1].map((c) => (
          <g key={c} opacity={c === 0 ? 1 : 0}>
            <animate attributeName="opacity" values={c === 0 ? "1;0" : "0;1"} keyTimes="0;0.5" dur="0.5s" calcMode="discrete" repeatCount="indefinite" />
            <OrangeCat x={0} y={240} s={1.6} costume={c as 0 | 1} />
          </g>
        ))}
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A lista de atores
// ---------------------------------------------------------------------------

function SpritesArt() {
  const sprites = [
    { name: "Gato", icon: null },
    { name: "Bola", icon: "⚽" },
    { name: "Estrela", icon: "⭐" },
    { name: "Cachorro", icon: "🐶" },
    { name: "Nave", icon: "🚀" },
  ];
  return (
    <Art viewBox="0 0 560 150" label="A lista de atores de um projeto: o gato, uma bola, uma estrela, um cachorro e uma nave; o gato está selecionado">
      <rect width="560" height="150" rx="14" fill="#f1f5f9" />
      {sprites.map((s, i) => (
        <g key={s.name} transform={`translate(${30 + i * 104} 22)`}>
          <rect width="88" height="96" rx="10" fill="#fff" stroke={i === 0 ? "#855cd6" : "#cbd5e1"} strokeWidth={i === 0 ? 4 : 2} />
          {s.icon ? (
            <text x="44" y="62" textAnchor="middle" fontSize="40">
              {s.icon}
            </text>
          ) : (
            <OrangeCat x={36} y={74} s={0.85} />
          )}
          <text x="44" y="88" textAnchor="middle" fontSize="12" fontWeight="700" fill="#575e75" fontFamily="Helvetica, Arial, sans-serif">
            {s.name}
          </text>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O animador de fantasias (de tocar)
// ---------------------------------------------------------------------------

export function CostumeAnimator() {
  const [costume, setCostume] = useState<0 | 1>(0);
  const [playing, setPlaying] = useState(false);
  const [wait, setWait] = useState(0.3);
  useEffect(() => {
    if (!playing) return;
    const t = window.setInterval(() => setCostume((c) => (c ? 0 : 1)), wait * 1000);
    return () => window.clearInterval(t);
  }, [playing, wait]);
  return (
    <Panel title="Troque as fantasias">
      <div className="flex flex-wrap items-center justify-center gap-[0.6em]">
        <Script
          em={0.048}
          scripts={[
            [
              { c: "eve", t: "quando 🚩 for clicado", hat: true },
              { c: "con", t: "sempre", inner: [{ c: "apa", t: "próxima fantasia" }, { c: "con", t: `espere (${wait.toLocaleString("pt-BR")}) segundos` }] },
            ],
          ]}
        />
        <div className="flex flex-col items-center gap-[0.25em]">
          <svg viewBox="-50 -80 100 90" className="h-[5em] w-[5.5em] rounded-md border border-[#cbd5e1] bg-white" aria-label={`O gato na fantasia ${costume + 1}`}>
            <OrangeCat costume={costume} />
          </svg>
          <p className="text-[0.75em] font-bold" style={{ color: SCR_DARK }}>
            fantasia {costume + 1} de 2
          </p>
        </div>
      </div>
      <div className="mt-[0.3em] flex flex-wrap items-center justify-center gap-[0.4em]">
        <BlockButton c="apa" onClick={() => setCostume((c) => (c ? 0 : 1))}>
          próxima fantasia
        </BlockButton>
        <button type="button" onClick={() => setPlaying((p) => !p)} className="rounded-full px-[0.9em] py-[0.1em] text-[0.82em] font-black text-white" style={{ background: playing ? "#ec5959" : "#4cbf56" }}>
          {playing ? "■ Parar" : "▶ Animar"}
        </button>
        <label className="flex items-center gap-[0.3em] text-[0.78em] font-bold text-[#3b2a14]">
          espere
          <input type="range" min={0.1} max={1} step={0.1} value={wait} onChange={(e) => setWait(Number(e.target.value))} className="w-[5em] accent-[#ffab19]" />
          {wait.toLocaleString("pt-BR")} s
        </label>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Os cenários trocando
// ---------------------------------------------------------------------------

function BackdropsArt() {
  return (
    <Art viewBox="0 0 560 170" label="Três palcos pequenos com o mesmo gato: na floresta, no espaço e na praia; uma setinha mostra a troca de cenário">
      <rect width="560" height="170" rx="14" fill="#fff7ed" />
      {BACKDROPS.map((b, i) => (
        <g key={b.name} transform={`translate(${24 + i * 182} 20)`}>
          <rect width="148" height="110" rx="6" fill={b.sky} stroke="#cbd5e1" strokeWidth="2" />
          <rect y="78" width="148" height="32" fill={b.ground} />
          <OrangeCat x={64} y={92} s={0.8} />
          <rect width="148" height="110" rx="6" fill="#fde047" opacity="0">
            <animate attributeName="opacity" values="0;0.35;0" keyTimes="0;0.15;0.3" dur="4.5s" begin={`${i * 1.5}s`} repeatCount="indefinite" />
          </rect>
          <text x="74" y="130" textAnchor="middle" fontSize="13" fontWeight="900" fill={SCR_DARK} fontFamily="Georgia, serif">
            {b.name}
          </text>
          {i < 2 && (
            <text x="164" y="62" textAnchor="middle" fontSize="20" fontWeight="900" fill={SCR}>
              ➜
            </text>
          )}
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O palco das coordenadas (de tocar)
// ---------------------------------------------------------------------------

export function CoordinateStage() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  function onClick(e: React.MouseEvent<SVGSVGElement>) {
    const svg = e.currentTarget;
    const r = svg.getBoundingClientRect();
    const x = Math.round(((e.clientX - r.left) / r.width) * 480 - 240);
    const y = Math.round(180 - ((e.clientY - r.top) / r.height) * 360);
    setPos({ x: Math.max(-240, Math.min(240, Math.round(x / 10) * 10)), y: Math.max(-180, Math.min(180, Math.round(y / 10) * 10)) });
  }
  return (
    <Panel title="Toque no palco">
      <div className="flex flex-wrap items-center justify-center gap-[0.6em]">
        <svg viewBox="-240 -180 480 360" onClick={onClick} className="h-[9.6em] w-[12.8em] cursor-crosshair rounded-md border border-[#cbd5e1] bg-white" aria-label="O palco com os eixos x e y; toque pra mover o gato">
          {[-200, -160, -120, -80, -40, 40, 80, 120, 160, 200].map((v) => (
            <line key={`v${v}`} x1={v} y1="-180" x2={v} y2="180" stroke="#f1f5f9" strokeWidth="2" />
          ))}
          {[-160, -120, -80, -40, 40, 80, 120, 160].map((v) => (
            <line key={`h${v}`} x1="-240" y1={v} x2="240" y2={v} stroke="#f1f5f9" strokeWidth="2" />
          ))}
          <line x1="-240" y1="0" x2="240" y2="0" stroke="#94a3b8" strokeWidth="3" />
          <line x1="0" y1="-180" x2="0" y2="180" stroke="#94a3b8" strokeWidth="3" />
          <text x="226" y="-8" textAnchor="end" fontSize="22" fontWeight="700" fill="#64748b">
            x
          </text>
          <text x="10" y="-160" fontSize="22" fontWeight="700" fill="#64748b">
            y
          </text>
          <g style={{ transform: `translate(${pos.x}px, ${-pos.y + 30}px)`, transition: "transform 0.4s ease-out" }}>
            <OrangeCat s={1.1} />
          </g>
          <circle cx={pos.x} cy={-pos.y} r="6" fill="#ec5959" />
        </svg>
        <div className="text-center">
          <p className="text-[1.4em] font-black" style={{ color: SCR_DARK }}>
            x: {pos.x} · y: {pos.y}
          </p>
          <Script em={0.05} scripts={[[{ c: "mov", t: `vá para x: (${pos.x}) y: (${pos.y})` }]]} />
        </div>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 2, content, bare });

export const chapter2: BookPage[] = [
  page(
    <ChapterOpener
      n={2}
      title="Atores, Fantasias e Cenários"
      goals={["O que são os atores (sprites)", "Como as fantasias criam animação", "O palco e os cenários", "As coordenadas x e y do palco"]}
    >
      <Fig h={34}>
        <WalkOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🐶">Os atores</H>
      <P>
        Os personagens e objetos que você programa (o gato, uma bola, uma nave…) são os <T>atores</T>, em inglês <em>sprites</em>. Cada ator tem os seus próprios{" "}
        <T>scripts</T>, <T>fantasias</T> e <T>sons</T>, e um projeto pode ter vários atores ao mesmo tempo.
      </P>
      <Fig n="2.1" caption="A lista de atores: clique num ator pra ver e mudar os scripts dele." h={15}>
        <SpritesArt />
      </Fig>
      <Box kind="mago" title="De onde vêm os atores?">
        Dá pra escolher um da biblioteca do Scratch, pintar o seu no editor de pintura, enviar uma imagem do computador ou até sortear um.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🎭">Fantasias e animação</H>
      <P>
        As <T>fantasias</T> são as aparências de um ator. Trocando rapidamente uma pela outra (com as pernas em posições diferentes), parece que ele está andando: é
        assim que se faz uma <T>animação</T>, como num desenho animado.
      </P>
      <CostumeAnimator />
    </>,
  ),

  page(
    <>
      <H icon="🏞️">O palco e os cenários</H>
      <P>
        O <T>palco</T> é onde o projeto acontece. A imagem de fundo dele é o <T>cenário</T>. O palco pode ter vários cenários e trocar entre eles, por exemplo pra mudar
        de fase num jogo.
      </P>
      <Fig n="2.2" caption="O mesmo ator em três cenários." h={18}>
        <BackdropsArt />
      </Fig>
      <Script scripts={[[{ c: "eve", t: "quando 🚩 for clicado", hat: true }, { c: "apa", t: "mude para o cenário [floresta]" }, { c: "con", t: "espere (2) segundos" }, { c: "apa", t: "mude para o cenário [espaço]" }]]} em={0.045} />
    </>,
  ),

  page(
    <>
      <H icon="📍">As coordenadas x e y</H>
      <P>
        O palco é um plano com <T>coordenadas</T>. O <T>x</T> é a posição na horizontal, de −240 (esquerda) a 240 (direita), e o <T>y</T> é a vertical, de −180 (embaixo) a
        180 (em cima). O centro é <T>x: 0, y: 0</T>.
      </P>
      <CoordinateStage />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Atores (sprites) são os personagens e objetos que programamos; cada um tem scripts, fantasias e sons.",
          "Fantasias são as aparências do ator; trocá-las rápido cria a ilusão de movimento.",
          "O cenário é o fundo do palco, e dá pra trocar de cenário pra mudar de fase.",
          "O palco tem coordenadas: x de −240 a 240 e y de −180 a 180.",
          "O centro do palco é x: 0, y: 0.",
        ]}
      />
      <Glossary
        items={[
          ["Ator (sprite)", "Um personagem ou objeto do projeto."],
          ["Fantasia", "Uma das aparências de um ator."],
          ["Cenário", "A imagem de fundo do palco."],
          ["Coordenada", "O número que diz a posição: x (horizontal) e y (vertical)."],
          ["Animação", "A ilusão de movimento feita trocando imagens."],
        ]}
      />
      <Quiz
        items={[
          ["Como se chamam os personagens e objetos do Scratch?", "Atores (sprites)."],
          ["Como se chama a imagem de fundo do palco?", "Cenário."],
          ["Onde fica a posição x: 0, y: 0?", "Bem no centro do palco."],
          ["Pra que serve trocar rapidamente as fantasias?", "Pra criar a ilusão de movimento, como numa animação."],
        ]}
      />
    </>,
  ),
];
