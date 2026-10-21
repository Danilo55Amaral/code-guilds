"use client";

import { useRef, useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { CAT_COLOR, OrangeCat, Panel, SCR_DARK, Script } from "./art";

// ============================================================================
// CAPÍTULO 8 — APARÊNCIA E SOM (missões "Blocos de Código no Scratch",
// "Scratch parte 2" e "parte 3", a parte de Aparência e Som): o gato falando,
// pensando e crescendo, o laboratório de efeitos (de tocar), o gato saindo de
// trás da árvore e o tecladinho de notas (de tocar).
// ============================================================================

const FLAG = "quando 🚩 for clicado";
const [LOOKS, LOOKS_DARK] = CAT_COLOR.apa;

/** O balão de fala (ou a nuvem de pensamento) acima do gato, com a ponta em (x, y). */
function Bubble({ x, y, text, think = false }: { x: number; y: number; text: string; think?: boolean }) {
  const w = text.length * 8 + 24;
  return (
    <g>
      <rect x={x} y={y - 40} width={w} height="30" rx="14" fill="#fff" stroke="#94a3b8" strokeWidth="2" />
      {think ? (
        <>
          <circle cx={x + 6} cy={y - 4} r="5" fill="#fff" stroke="#94a3b8" strokeWidth="2" />
          <circle cx={x - 2} cy={y + 6} r="3" fill="#fff" stroke="#94a3b8" strokeWidth="2" />
        </>
      ) : (
        <path d={`M${x + 10} ${y - 10} L${x + 2} ${y + 4} L${x + 22} ${y - 10} Z`} fill="#fff" stroke="#94a3b8" strokeWidth="2" strokeLinejoin="round" />
      )}
      <text x={x + w / 2} y={y - 20} textAnchor="middle" fontSize="14" fontWeight="700" fill="#575e75" fontFamily="Helvetica, Arial, sans-serif">
        {text}
      </text>
    </g>
  );
}

// ---------------------------------------------------------------------------
// Abertura: o gato falando, pensando e crescendo
// ---------------------------------------------------------------------------

function LooksOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="O gato cresce e diminui, fala Olá! e depois pensa Hmm..., enquanto notas musicais saem flutuando">
      <rect width="460" height="300" fill="#f5f3ff" />
      <rect y="240" width="460" height="60" fill="#ddd6fe" />
      <g transform="translate(200 250)">
        <g>
          <animateTransform attributeName="transform" type="scale" values="1.6;2.1;1.6" dur="4s" repeatCount="indefinite" />
          <OrangeCat />
        </g>
      </g>
      <g>
        <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.45;0.5;0.95;1" dur="6s" repeatCount="indefinite" />
        <Bubble x={250} y={110} text="Olá!" />
      </g>
      <g opacity="0">
        <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.45;0.5;0.95;1" dur="6s" repeatCount="indefinite" />
        <Bubble x={250} y={110} text="Hmm..." think />
      </g>
      {["♪", "♫", "♪"].map((n, i) => (
        <text key={i} x={330 + i * 30} y="200" fontSize="30" fontWeight="900" fill={CAT_COLOR.som[0]}>
          <animate attributeName="y" values="230;60" dur="3s" begin={`${-i}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0" dur="3s" begin={`${-i}s`} repeatCount="indefinite" />
          {n}
        </text>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Diga × pense
// ---------------------------------------------------------------------------

function SayThinkArt() {
  return (
    <Art viewBox="0 0 560 170" label="Dois gatos: um diz Olá! num balão de fala e o outro pensa Que fome... numa nuvem de pensamento">
      <rect width="560" height="170" rx="14" fill="#f5f3ff" />
      <OrangeCat x={90} y={150} s={1.3} />
      <Bubble x={130} y={88} text="Olá!" />
      <OrangeCat x={350} y={150} s={1.3} />
      <Bubble x={390} y={88} text="Que fome..." think />
      <g fontFamily="Helvetica, Arial, sans-serif" fontWeight="900" fontSize="13" fill={LOOKS_DARK}>
        <text x="90" y="24" textAnchor="middle">
          diga
        </text>
        <text x="350" y="24" textAnchor="middle">
          pense
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O laboratório de efeitos (de tocar)
// ---------------------------------------------------------------------------

export function EffectsLab() {
  const [color, setColor] = useState(0);
  const [ghost, setGhost] = useState(0);
  const [size, setSize] = useState(100);
  const row = (label: string, value: number, min: number, max: number, set: (v: number) => void) => (
    <label className="flex items-center gap-[0.4em] text-[0.8em] font-bold text-[#3b2a14]">
      <span className="w-[4.2em] shrink-0">{label}</span>
      <input type="range" min={min} max={max} step={5} value={value} onChange={(e) => set(Number(e.target.value))} className="min-w-0 flex-1 accent-[#9966ff]" />
      <span className="w-[2.5em] shrink-0 text-right tabular-nums">{value}{label === "tamanho" ? "%" : ""}</span>
    </label>
  );
  return (
    <Panel title="Laboratório de efeitos">
      <div className="flex flex-wrap items-center justify-center gap-[0.6em]">
        <svg viewBox="-110 -150 220 160" className="h-[6.5em] w-[8.5em] rounded-md border border-[#cbd5e1] bg-white" aria-label={`O gato com cor ${color}, fantasma ${ghost} e tamanho ${size}%`}>
          <g style={{ filter: `hue-rotate(${color * 1.8}deg)`, opacity: 1 - ghost / 100, transform: `scale(${size / 100})`, transformOrigin: "0px 0px", transition: "transform 0.2s" }}>
            <OrangeCat />
          </g>
        </svg>
        <div className="min-w-[12em] flex-1 space-y-[0.25em]">
          {row("cor", color, 0, 200, setColor)}
          {row("fantasma", ghost, 0, 100, setGhost)}
          {row("tamanho", size, 50, 200, setSize)}
          <Script em={0.044} scripts={[[{ c: "apa", t: `mude o efeito [cor] para (${color})` }, { c: "apa", t: `mude o efeito [fantasma] para (${ghost})` }, { c: "apa", t: `mude o tamanho para (${size}) %` }]]} />
        </div>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Camadas: o gato saindo de trás da árvore
// ---------------------------------------------------------------------------

function LayersArt() {
  const tree = (
    <g>
      <rect x="160" y="80" width="26" height="80" fill="#92400e" />
      <circle cx="173" cy="70" r="46" fill="#16a34a" stroke="#14532d" strokeWidth="2" />
    </g>
  );
  return (
    <Art viewBox="0 0 560 180" label="À esquerda, o gato escondido atrás da árvore; à direita, depois do bloco vá para a camada da frente, o gato aparece na frente dela">
      <rect width="560" height="180" rx="14" fill="#f5f3ff" />
      <rect y="150" width="560" height="30" fill="#bbf7d0" />
      {/* antes: o gato atrás */}
      <OrangeCat x={170} y={156} s={1.2} />
      {tree}
      {/* depois: o gato na frente */}
      <g transform="translate(260 0)">
        {tree}
        <OrangeCat x={170} y={156} s={1.2} />
      </g>
      <text x="300" y="100" textAnchor="middle" fontSize="28" fontWeight="900" fill={LOOKS}>
        ➜
      </text>
      <g fontFamily="Helvetica, Arial, sans-serif" fontWeight="900" fontSize="12" fill={LOOKS_DARK} textAnchor="middle">
        <text x="173" y="172">
          antes
        </text>
        <text x="433" y="172">
          vá para a camada da frente
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O tecladinho de notas (de tocar)
// ---------------------------------------------------------------------------

const NOTES: [string, number][] = [
  ["dó", 261.63],
  ["ré", 293.66],
  ["mi", 329.63],
  ["fá", 349.23],
  ["sol", 392.0],
  ["lá", 440.0],
];

export function NotePad() {
  const ctx = useRef<AudioContext | null>(null);
  const [last, setLast] = useState<number | null>(null);
  function play(i: number) {
    setLast(i);
    if (typeof window === "undefined" || !("AudioContext" in window)) return;
    ctx.current ??= new AudioContext();
    const ac = ctx.current;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "triangle";
    osc.frequency.value = NOTES[i][1];
    gain.gain.setValueAtTime(0.25, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.5);
    osc.connect(gain).connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.5);
  }
  const [SOUND, SOUND_DARK] = CAT_COLOR.som;
  return (
    <Panel title="Toque as notas">
      <div className="flex justify-center gap-[0.25em]">
        {NOTES.map(([name], i) => (
          <button
            key={name}
            type="button"
            onClick={() => play(i)}
            className="flex h-[3.4em] w-[2.4em] items-end justify-center rounded-b-lg border-2 pb-[0.2em] text-[0.8em] font-black transition-colors"
            style={last === i ? { background: SOUND, borderColor: SOUND_DARK, color: "#fff" } : { background: "#fff", borderColor: "#cbd5e1", color: SOUND_DARK }}
          >
            {name}
          </button>
        ))}
      </div>
      <p className="mt-[0.25em] text-center text-[0.75em] text-[#8a7146]">No Scratch, a extensão Música tem blocos pra tocar notas e tambores.</p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 8, content, bare });

export const chapter8: BookPage[] = [
  page(
    <ChapterOpener
      n={8}
      title="Aparência e Som"
      goals={["Diga e pense, com e sem tempo", "O tamanho e os efeitos gráficos", "As camadas e o esconda e mostre", "Os blocos de som"]}
    >
      <Fig h={34}>
        <LooksOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="💬">Diga e pense</H>
      <P>
        Os blocos de <T>Aparência</T> (roxo) mudam como o ator aparece. O <T>“diga”</T> mostra um balão de fala; o <T>“pense”</T>, uma nuvem de pensamento.
      </P>
      <Fig n="8.1" caption="Diga e pense." h={17}>
        <SayThinkArt />
      </Fig>
      <Box kind="atencao">
        O <strong>“diga Olá!”</strong> mostra o balão e já segue pro próximo bloco, deixando o balão na tela. O <strong>“diga Olá! por 2 segundos”</strong> espera 2
        segundos, apaga o balão e só então segue.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="✨">Tamanho e efeitos</H>
      <P>
        O tamanho original do ator é <T>100%</T>: 50% é a metade e 200% é o dobro. Os <T>efeitos gráficos</T> mudam a cor, deixam transparente (o efeito{" "}
        <T>fantasma</T>), pixelado, girando… Mexa nos controles:
      </P>
      <EffectsLab />
      <Box kind="mago" title="Arco-íris">
        Dentro de um “sempre”, o “adicione 25 ao efeito cor” faz o ator trocar de cor sem parar. E o “limpe os efeitos gráficos” volta tudo ao normal.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🌳">Camadas, esconda e mostre</H>
      <P>
        Os atores ficam em <T>camadas</T>, como folhas empilhadas. Se o gato ficou atrás da árvore, o <T>“vá para a camada da frente”</T> traz ele pra frente de todos.
      </P>
      <Fig n="8.2" caption="Antes e depois do vá para a camada da frente." h={18}>
        <LayersArt />
      </Fig>
      <Cards
        items={[
          { icon: "🙈", title: "esconda", text: "O ator some, mas continua existindo e rodando os scripts." },
          { icon: "👀", title: "mostre", text: "O ator aparece de novo. Ótimo pra itens e fases." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🔊">Os sons</H>
      <P>
        Os blocos de <T>Som</T> (rosa) tocam os sons do ator. O <T>“toque o som Miau até o fim”</T> espera o som acabar pra seguir; o <T>“inicie o som Miau”</T> começa
        o som e já segue em frente, ótimo pra música de fundo.
      </P>
      <Script em={0.048} scripts={[[{ c: "eve", t: FLAG, hat: true }, { c: "con", t: "sempre", inner: [{ c: "som", t: "toque o som [Música] até o fim" }] }], [{ c: "eve", t: "quando este ator for clicado", hat: true }, { c: "som", t: "inicie o som [Miau]" }]]} />
      <NotePad />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Diga mostra um balão de fala; pense, uma nuvem. Com “por 2 segundos”, o bloco espera e apaga o balão.",
          "Mude o tamanho para 50% deixa o ator com metade do tamanho; 100% é o original.",
          "Os efeitos gráficos (cor, fantasma, pixelização…) mudam a aparência; limpe os efeitos desfaz tudo.",
          "Vá para a camada da frente traz o ator pra frente; esconda e mostre fazem ele sumir e aparecer.",
          "Toque o som até o fim espera o som acabar; inicie o som segue em frente.",
        ]}
      />
      <Glossary
        items={[
          ["Aparência", "A categoria roxa: falas, fantasias, tamanho e efeitos."],
          ["Efeito fantasma", "Deixa o ator transparente."],
          ["Camada", "A posição do ator na pilha: na frente ou atrás."],
          ["Esconda", "Faz o ator sumir do palco."],
          ["Som", "A categoria rosa: tocar e parar sons."],
        ]}
      />
      <Quiz
        items={[
          ["Qual é a diferença entre “diga Olá!” e “diga Olá! por 2 segundos”?", "O primeiro deixa o balão e segue; o segundo espera 2 segundos, apaga o balão e segue."],
          ["O que faz “mude o tamanho para 50%”?", "Deixa o ator com metade do tamanho original."],
          ["Qual efeito deixa o ator transparente?", "O efeito fantasma."],
          ["Qual bloco traz o gato pra frente da árvore?", "Vá para a camada da frente."],
        ]}
      />
    </>,
  ),
];
