"use client";

import { useEffect, useRef, useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { CAT_COLOR, OrangeCat, Panel, SCR_DARK, Script } from "./art";

// ============================================================================
// CAPÍTULO 9 — CANETA E MEUS BLOCOS (missões "Blocos de Código no Scratch" e
// "Scratch parte 2", a parte da Caneta e de Meus Blocos): o lápis desenhando
// a estrela, o desenhista de polígonos (de tocar), a estrela e a espiral se
// desenhando e o bloco que a gente mesmo cria.
// ============================================================================

const FLAG = "quando 🚩 for clicado";
const [PEN, PEN_DARK] = CAT_COLOR.can;

/** Os pontos de um caminho de tartaruga: anda `step`, gira `turn` graus, `n` vezes (começa virado pra direita). */
function turtle(n: number, step: (i: number) => number, turn: number, x0: number, y0: number): string {
  let x = x0;
  let y = y0;
  let a = 0;
  const pts = [`${x.toFixed(1)} ${y.toFixed(1)}`];
  for (let i = 0; i < n; i++) {
    x += step(i) * Math.cos((a * Math.PI) / 180);
    y += step(i) * Math.sin((a * Math.PI) / 180);
    a += turn;
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return `M${pts.join(" L")}`;
}

// ---------------------------------------------------------------------------
// Abertura: o lápis desenhando a estrela
// ---------------------------------------------------------------------------

function StarOpenerArt() {
  const star = turtle(5, () => 220, 144, 120, 120);
  return (
    <Art viewBox="0 0 460 300" label="Um lápis desenha uma estrela de cinco pontas, linha por linha, girando 144 graus em cada ponta">
      <rect width="460" height="300" fill="#ecfdf5" />
      <path d={star} fill="none" stroke={PEN} strokeWidth="6" strokeLinejoin="round" strokeDasharray="1100" strokeDashoffset="1100">
        <animate attributeName="stroke-dashoffset" values="1100;0;0" keyTimes="0;0.75;1" dur="6s" repeatCount="indefinite" />
      </path>
      <g>
        <animateMotion path={star} dur="6s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;0.75;1" calcMode="linear" />
        <g transform="rotate(-35)">
          <rect x="-4" y="-46" width="8" height="40" fill="#fde047" stroke="#a16207" strokeWidth="1.5" />
          <path d="M-4 -6 L0 2 L4 -6 Z" fill="#78350f" />
          <rect x="-4" y="-52" width="8" height="6" fill="#f472b6" />
        </g>
      </g>
      <text x="230" y="285" textAnchor="middle" fontSize="16" fontWeight="900" fill={SCR_DARK} fontFamily="Georgia, serif">
        repita 5 vezes: mova 220 passos, gire 144 graus
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O desenhista de polígonos (de tocar)
// ---------------------------------------------------------------------------

export function PenPolygon() {
  const [n, setN] = useState(4);
  // o desenho recomeça a cada mudança (a animação só começa quando a gente manda)
  const draw = useRef<SVGAnimateElement>(null);
  useEffect(() => {
    draw.current?.beginElement();
  }, [n]);
  const turn = 360 / n;
  const side = Math.min(90, 300 / n);
  const path = turtle(n, () => side, turn, 0, 0);
  // centraliza o desenho no palco
  const cx = -side / 2;
  const cy = -(side / 2) / Math.tan(Math.PI / n);
  const len = side * n + 10;
  const name = ["", "", "", "triângulo", "quadrado", "pentágono", "hexágono", "heptágono", "octógono", "eneágono", "decágono"][n];
  return (
    <Panel title="O desenhista de polígonos">
      <div className="flex flex-wrap items-center justify-center gap-[0.6em]">
        <svg viewBox="-110 -110 220 220" className="h-[7em] w-[7em] rounded-md border border-[#cbd5e1] bg-white" aria-label={`Um ${name} desenhado com a caneta`}>
          <g transform={`translate(${cx.toFixed(1)} ${cy.toFixed(1)})`}>
            <path d={path} fill="none" stroke={PEN} strokeWidth="5" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset="0">
              <animate ref={draw} attributeName="stroke-dashoffset" from={len} to="0" dur="1.4s" begin="indefinite" fill="freeze" />
            </path>
          </g>
        </svg>
        <div className="min-w-[12em] flex-1 space-y-[0.3em]">
          <label className="flex items-center gap-[0.4em] text-[0.82em] font-bold text-[#3b2a14]">
            lados
            <input type="range" min={3} max={10} value={n} onChange={(e) => setN(Number(e.target.value))} className="min-w-0 flex-1 accent-[#0fbd8c]" />
            <span className="w-[1.5em] text-right">{n}</span>
          </label>
          <p className="cg-book-title text-center text-[1.05em] font-black" style={{ color: PEN_DARK }}>
            {name}: gire 360 ÷ {n} = {Number.isInteger(turn) ? turn : turn.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}°
          </p>
          <Script
            em={0.044}
            scripts={[
              [
                { c: "can", t: "abaixe a caneta" },
                {
                  c: "con",
                  t: `repita (${n}) vezes`,
                  inner: [
                    { c: "mov", t: `mova (${Math.round(side)}) passos` },
                    { c: "mov", t: `gire ↻ (${Number.isInteger(turn) ? turn : turn.toFixed(1)}) graus` },
                  ],
                },
                { c: "can", t: "levante a caneta" },
              ],
            ]}
          />
        </div>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// A estrela e a espiral
// ---------------------------------------------------------------------------

function StarSpiralArt() {
  const star = turtle(5, () => 120, 144, 40, 76);
  const spiral = turtle(36, (i) => 4 + i * 2.6, 70, 420, 84);
  return (
    <Art viewBox="0 0 560 200" label="À esquerda, uma estrela feita girando 144 graus; à direita, uma espiral feita aumentando os passos a cada volta">
      <rect width="560" height="200" rx="14" fill="#ecfdf5" />
      <path d={star} fill="none" stroke={PEN} strokeWidth="4" strokeLinejoin="round" strokeDasharray="620" strokeDashoffset="620">
        <animate attributeName="stroke-dashoffset" values="620;0;0" keyTimes="0;0.6;1" dur="5s" repeatCount="indefinite" />
      </path>
      <path d={spiral} fill="none" stroke="#9333ea" strokeWidth="3" strokeDasharray="2600" strokeDashoffset="2600">
        <animate attributeName="stroke-dashoffset" values="2600;0;0" keyTimes="0;0.75;1" dur="5s" repeatCount="indefinite" />
      </path>
      <g fontFamily="Helvetica, Arial, sans-serif" fontWeight="900" fontSize="12" textAnchor="middle">
        <text x="100" y="190" fill={PEN_DARK}>
          estrela: gire 144°
        </text>
        <text x="420" y="190" fill="#7e22ce">
          espiral: passos cada vez maiores
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 9, content, bare });

export const chapter9: BookPage[] = [
  page(
    <ChapterOpener
      n={9}
      title="Caneta e Meus Blocos"
      goals={["A extensão Caneta: desenhar com o ator", "Por que o quadrado gira 90 graus", "Estrelas e espirais", "Criar os seus próprios blocos"]}
    >
      <Fig h={34}>
        <StarOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="✏️">A caneta</H>
      <P>
        Os blocos da <T>Caneta</T> (verde-água) vêm numa extensão: clique no botão azul do canto de baixo da tela de blocos e escolha “Caneta”. Com a caneta abaixada, o
        ator desenha por onde passa.
      </P>
      <div className="flex flex-wrap items-center justify-center gap-[0.8em]">
        <Script
          em={0.048}
          scripts={[
            [
              { c: "eve", t: FLAG, hat: true },
              { c: "can", t: "apague tudo" },
              { c: "can", t: "mude a cor da caneta para (verde)" },
              { c: "can", t: "abaixe a caneta" },
              { c: "mov", t: "mova (100) passos" },
              { c: "can", t: "levante a caneta" },
            ],
          ]}
        />
        <svg viewBox="-30 -80 180 90" className="h-[4.5em] w-[9em]" aria-label="O gato andou 100 passos deixando uma linha verde">
          <line x1="0" y1="-20" x2="100" y2="-20" stroke={PEN} strokeWidth="5" strokeLinecap="round" strokeDasharray="100" strokeDashoffset="100">
            <animate attributeName="stroke-dashoffset" values="100;0;0" keyTimes="0;0.6;1" dur="3s" repeatCount="indefinite" />
          </line>
          <g>
            <animateTransform attributeName="transform" type="translate" values="0 0;100 0;100 0" keyTimes="0;0.6;1" dur="3s" repeatCount="indefinite" />
            <OrangeCat x={-20} y={10} s={0.8} />
          </g>
        </svg>
      </div>
      <Box kind="lembre">Comece com “apague tudo” pra limpar os desenhos da vez anterior, e use “levante a caneta” pra andar sem riscar.</Box>
    </>,
  ),

  page(
    <>
      <H icon="⬛">Polígonos com a caneta</H>
      <P>
        Pra desenhar um quadrado: 4 vezes, ande um lado e <T>gire 90 graus</T>. 4 × 90 = 360, uma volta completa. Pra qualquer polígono, gire <T>360 ÷ o número de lados</T>.
      </P>
      <PenPolygon />
    </>,
  ),

  page(
    <>
      <H icon="⭐">Estrelas e espirais</H>
      <P>
        Girando <T>144 graus</T> em cada ponta, o ator dá duas voltas e desenha uma estrela de 5 pontas (5 × 144 = 720). E aumentando os passos a cada repetição, sai
        uma <T>espiral</T>.
      </P>
      <Fig n="9.1" caption="Mudando o ângulo e os passos, os desenhos mudam." h={20}>
        <StarSpiralArt />
      </Fig>
      <Cards
        items={[
          { icon: "🎨", title: "Cores", text: "“adicione 10 à cor da caneta” dentro do repita faz um arco-íris." },
          { icon: "🖊️", title: "Espessura", text: "“mude o tamanho da caneta para 5” deixa a linha mais grossa." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🧩">Meus Blocos</H>
      <P>
        Em <T>Meus Blocos</T> (rosa) você cria um bloco novo, dá um nome e define o que ele faz. Depois é só usar o bloco sempre que precisar, em vez de repetir vários
        blocos. Ele pode até receber um valor, como o tamanho:
      </P>
      <Script
        em={0.046}
        scripts={[
          [
            { c: "meu", t: "defina desenhe quadrado {tamanho}", hat: true },
            { c: "con", t: "repita (4) vezes", inner: [{ c: "mov", t: "mova {tamanho} passos" }, { c: "mov", t: "gire ↻ (90) graus" }] },
          ],
          [
            { c: "eve", t: FLAG, hat: true },
            { c: "meu", t: "desenhe quadrado (50)" },
            { c: "meu", t: "desenhe quadrado (100)" },
          ],
        ]}
      />
      <Box kind="mago" title="Por que criar blocos?">
        O script fica mais curto e fácil de ler, e se precisar mudar o jeito de desenhar, você muda num lugar só. Programadores de verdade fazem isso o tempo todo: são as{" "}
        <strong>funções</strong>.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "A Caneta é uma extensão: abaixe a caneta pra desenhar e levante pra parar.",
          "Apague tudo limpa o palco; dá pra mudar a cor e a espessura da caneta.",
          "Quadrado: repita 4 vezes, mova e gire 90 graus (4 × 90 = 360).",
          "Pra um polígono de n lados, gire 360 ÷ n; a estrela gira 144 graus.",
          "Em Meus Blocos você cria os seus blocos, que podem receber valores, como o tamanho.",
        ]}
      />
      <Glossary
        items={[
          ["Extensão", "Um pacote de blocos extras (Caneta, Música…)."],
          ["Polígono", "Figura fechada de lados retos."],
          ["Ângulo externo", "Quanto o ator gira em cada canto: 360 ÷ lados."],
          ["Bloco personalizado", "Um bloco criado em Meus Blocos."],
          ["Parâmetro", "O valor que o bloco recebe, como o tamanho."],
        ]}
      />
      <Quiz
        items={[
          ["Pra desenhar um quadrado, quantos graus o ator gira em cada canto?", "90 graus."],
          ["Quanto gira o ator pra desenhar um hexágono?", "60 graus (360 ÷ 6)."],
          ["Pra que serve a categoria Meus Blocos?", "Pra criar os seus próprios blocos, juntando vários em um só."],
          ["Qual bloco faz o ator andar sem riscar?", "Levante a caneta."],
        ]}
      />
    </>,
  ),
];
