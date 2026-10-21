"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { BlockButton, BlocksG, OrangeCat, Panel, SCR, SCR_DARK, Script, StageFrame } from "./art";

// ============================================================================
// CAPÍTULO 3 — MOVIMENTO (missões "Blocos de Código no Scratch" e "Scratch
// parte 2", a parte do Movimento): o gato deslizando pelo caminho, o palco
// de tocar com os blocos de movimento, a rosa das direções, o vá para × o
// deslize e o gato quicando na borda.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o gato deslizando
// ---------------------------------------------------------------------------

function GlideOpenerArt() {
  const path = "M70 230 L200 120 L330 210 L400 90";
  return (
    <Art viewBox="0 0 460 300" label="O gato laranja desliza por um caminho em zigue-zague, de ponto em ponto, com as setas mostrando a direção">
      <rect width="460" height="300" fill="#eff6ff" />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="300" stroke="#dbeafe" strokeWidth="2" />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 40} x2="460" y2={i * 40} stroke="#dbeafe" strokeWidth="2" />
      ))}
      <path d={path} fill="none" stroke={SCR} strokeWidth="4" strokeDasharray="10 8" className="cg-anim-dash" />
      {[
        [70, 230],
        [200, 120],
        [330, 210],
        [400, 90],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="8" fill="#4C97FF" stroke="#fff" strokeWidth="3" />
      ))}
      <g>
        <animateMotion path={path} dur="6s" repeatCount="indefinite" keyPoints="0;0.364;0.364;0.703;0.703;1;1" keyTimes="0;0.2;0.3;0.5;0.6;0.8;1" calcMode="linear" />
        <OrangeCat x={0} y={8} s={1.3} />
      </g>
      <text x="230" y="285" textAnchor="middle" fontSize="18" fontWeight="900" fill={SCR_DARK} fontFamily="Georgia, serif">
        deslize até o próximo ponto
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O palco de tocar com os blocos de movimento
// ---------------------------------------------------------------------------

export function MotionStage() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [dir, setDir] = useState(90);
  const [last, setLast] = useState("vá para x: (0) y: (0)");
  const fence = (v: number, m: number) => Math.max(-m, Math.min(m, Math.round(v)));
  function move(steps: number) {
    const a = (dir * Math.PI) / 180;
    setX((v) => fence(v + steps * Math.sin(a), 210));
    setY((v) => fence(v + steps * Math.cos(a), 150));
    setLast(`mova (${steps}) passos`);
  }
  function turn(deg: number) {
    setDir((d) => {
      let n = d + deg;
      if (n > 180) n -= 360;
      if (n <= -180) n += 360;
      return n;
    });
    setLast(deg > 0 ? `gire ↻ (${deg}) graus` : `gire ↺ (${-deg}) graus`);
  }
  return (
    <Panel title="Programe o gato">
      <div className="flex flex-wrap items-center justify-center gap-[0.6em]">
        <svg viewBox="-240 -180 480 360" className="h-[7.5em] w-[10em] rounded-md border border-[#cbd5e1] bg-white" aria-label={`O gato em x ${x}, y ${y}, direção ${dir}`}>
          <line x1="-240" y1="0" x2="240" y2="0" stroke="#e2e8f0" strokeWidth="3" />
          <line x1="0" y1="-180" x2="0" y2="180" stroke="#e2e8f0" strokeWidth="3" />
          <g style={{ transform: `translate(${x}px, ${-y}px) rotate(${dir - 90}deg)`, transition: "transform 0.35s ease-out" }}>
            <g transform="translate(-10 34)">
              <OrangeCat s={1.4} />
            </g>
          </g>
        </svg>
        <div className="space-y-[0.25em] text-center">
          <p className="text-[1.05em] font-black" style={{ color: SCR_DARK }}>
            x: {x} · y: {y} · direção: {dir}
          </p>
          <Script em={0.046} scripts={[[{ c: "mov", t: last }]]} />
        </div>
      </div>
      <div className="mt-[0.35em] flex flex-wrap justify-center gap-[0.25em]">
        <BlockButton c="mov" onClick={() => move(10)}>
          mova 10 passos
        </BlockButton>
        <BlockButton c="mov" onClick={() => move(50)}>
          mova 50 passos
        </BlockButton>
        <BlockButton c="mov" onClick={() => turn(15)}>
          gire ↻ 15°
        </BlockButton>
        <BlockButton c="mov" onClick={() => turn(-15)}>
          gire ↺ 15°
        </BlockButton>
        <BlockButton
          c="mov"
          onClick={() => {
            setX(0);
            setY(0);
            setDir(90);
            setLast("vá para x: (0) y: (0)");
          }}
        >
          vá para x: 0 y: 0
        </BlockButton>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// A rosa das direções
// ---------------------------------------------------------------------------

function DirectionsArt() {
  const dirs = [
    { d: 0, label: "0 (cima)", x: 140, y: 26 },
    { d: 90, label: "90 (direita)", x: 226, y: 104 },
    { d: 180, label: "180 (baixo)", x: 140, y: 184 },
    { d: -90, label: "−90 (esquerda)", x: 54, y: 104 },
  ];
  return (
    <Art viewBox="0 0 560 200" label="Uma rosa das direções do Scratch: 0 pra cima, 90 pra direita, 180 pra baixo e −90 pra esquerda; o gato gira e aponta pra cada uma">
      <rect width="560" height="200" rx="14" fill="#eff6ff" />
      <circle cx="140" cy="100" r="70" fill="#fff" stroke="#bfdbfe" strokeWidth="3" />
      {dirs.map((d) => (
        <g key={d.d}>
          <line x1="140" y1="100" x2={140 + 64 * Math.sin((d.d * Math.PI) / 180)} y2={100 - 64 * Math.cos((d.d * Math.PI) / 180)} stroke="#4C97FF" strokeWidth="3" />
          <text x={d.x} y={d.y} textAnchor="middle" fontSize="13" fontWeight="900" fill="#1e40af" fontFamily="Georgia, serif">
            {d.label}
          </text>
        </g>
      ))}
      <g transform="translate(140 100)">
        <g>
          <animateTransform attributeName="transform" type="rotate" values="0;0;90;90;180;180;-90;-90;0" keyTimes="0;0.1;0.2;0.35;0.45;0.6;0.7;0.85;1" dur="8s" repeatCount="indefinite" />
          <path d="M0 -12 L40 0 L0 12 Z" fill={SCR} />
          <circle r="10" fill="#f59e0b" stroke="#92400e" strokeWidth="2" />
        </g>
      </g>
      <g fontFamily="Georgia, serif" fontWeight="900">
        <text x="300" y="70" fontSize="15" fill={SCR_DARK}>
          aponte para a direção (90)
        </text>
        <text x="300" y="100" fontSize="13" fill="#334155">
          É por isso que todo projeto começa
        </text>
        <text x="300" y="120" fontSize="13" fill="#334155">
          com o gato olhando pra direita:
        </text>
        <text x="300" y="140" fontSize="13" fill="#334155">
          a direção 90.
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O vá para × o deslize
// ---------------------------------------------------------------------------

function GotoGlideArt() {
  return (
    <Art viewBox="0 0 560 230" label="Em cima, o gato com vá para pula de uma vez de um lado ao outro; embaixo, o gato com deslize vai andando suavemente durante 1 segundo">
      <rect width="560" height="230" rx="14" fill="#fff7ed" />
      <StageFrame x={20} y={10} w={520} h={100} />
      <StageFrame x={20} y={118} w={520} h={100} />
      <g fontFamily="Georgia, serif" fontWeight="900" fontSize="13">
        <text x="32" y="30" fill="#1e40af">
          vá para x: 100 — pula na hora
        </text>
        <text x="32" y="138" fill="#1e40af">
          deslize por 1 segundo — vai andando
        </text>
      </g>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 0;330 0;330 0" keyTimes="0;0.45;0.46;1" dur="4s" repeatCount="indefinite" />
        <OrangeCat x={110} y={102} s={0.85} />
      </g>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 0;330 0;330 0" keyTimes="0;0.2;0.7;1" dur="4s" repeatCount="indefinite" />
        <OrangeCat x={110} y={210} s={0.85} />
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O gato quicando na borda
// ---------------------------------------------------------------------------

function BounceArt() {
  return (
    <Art viewBox="0 0 560 190" label="Uma bola anda pelo palco e, cada vez que toca na borda, quica e muda de direção; ao lado, o script: sempre, mova 10 passos e se tocar na borda, volte">
      <rect width="560" height="190" rx="14" fill="#eff6ff" />
      <StageFrame x={20} y={14} w={260} h={162} />
      <circle r="12" fill="#4C97FF" stroke="#1e40af" strokeWidth="2">
        <animateMotion path="M40 40 L260 120 L180 156 L40 90 L120 34 L260 60 L40 40" dur="6s" repeatCount="indefinite" />
      </circle>
      <BlocksG blocks={BOUNCE_SCRIPT} x={310} y={14} />
    </Art>
  );
}

const BOUNCE_SCRIPT = [
  { c: "eve" as const, t: "quando 🚩 for clicado", hat: true },
  { c: "con" as const, t: "sempre", inner: [{ c: "mov" as const, t: "mova (10) passos" }, { c: "mov" as const, t: "se tocar na borda, volte" }] },
];

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 3, content, bare });

export const chapter3: BookPage[] = [
  page(
    <ChapterOpener
      n={3}
      title="Movimento"
      goals={["Mover e girar o ator", "As direções do Scratch (0, 90, 180, −90)", "Mudar x e y, ir para e deslizar", "Quicar na borda do palco"]}
    >
      <Fig h={34}>
        <GlideOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🧭">Mova e gire</H>
      <P>
        Os blocos de <T>Movimento</T> (a categoria azul) mudam a posição e a direção do ator. O “mova 10 passos” anda pra frente, na direção pra onde ele está virado. Use
        os blocos:
      </P>
      <MotionStage />
    </>,
  ),

  page(
    <>
      <H icon="🧭">As direções</H>
      <P>
        No Scratch, a direção é um número em graus: <T>90</T> é pra direita, <T>−90</T> pra esquerda, <T>0</T> pra cima e <T>180</T> pra baixo.
      </P>
      <Fig n="3.1" caption="A rosa das direções do Scratch." h={20}>
        <DirectionsArt />
      </Fig>
      <Box kind="mago" title="Gato de cabeça pra baixo?">
        Se o gato virar pra esquerda e ficar de ponta-cabeça, use o bloco <strong>“mude o estilo de rotação para [esquerda-direita]”</strong>.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="➡️">Mudar x e y, ir e deslizar</H>
      <P>
        <T>“adicione 10 a x”</T> leva o ator pra direita (−10 leva pra esquerda); <T>“adicione 10 a y”</T> leva pra cima. O <T>“vá para”</T> teletransporta na hora, e o{" "}
        <T>“deslize”</T> mostra o caminho:
      </P>
      <Fig n="3.2" caption="Vá para pula; deslize anda." h={20}>
        <GotoGlideArt />
      </Fig>
      <Script em={0.045} scripts={[[{ c: "mov", t: "vá para x: (100) y: (0)" }], [{ c: "mov", t: "deslize por (1) segundos até x: (100) y: (0)" }]]} />
    </>,
  ),

  page(
    <>
      <H icon="🏓">Quicando na borda</H>
      <P>
        O bloco <T>“se tocar na borda, volte”</T> faz o ator mudar de direção quando encosta na borda do palco, como uma bola batendo na parede. Dentro de um “sempre”,
        o ator fica indo e voltando:
      </P>
      <Fig n="3.3" caption="Andando e quicando, sem nunca sair do palco." h={21}>
        <BounceArt />
      </Fig>
      <Box kind="lembre">O “sempre” repete os blocos de dentro sem parar, até alguém clicar no botão vermelho. Você vai ver ele melhor no capítulo 5.</Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Os blocos de Movimento (azuis) mudam a posição e a direção do ator.",
          "Mova anda pra frente; gire muda a direção em graus.",
          "Direção 90 é pra direita, −90 pra esquerda, 0 pra cima e 180 pra baixo.",
          "Adicione 10 a x vai pra direita; adicione 10 a y vai pra cima.",
          "Vá para pula na hora; deslize vai andando; se tocar na borda, volte faz quicar.",
        ]}
      />
      <Glossary
        items={[
          ["Passo", "A unidade de distância do palco."],
          ["Direção", "Pra onde o ator está virado, em graus."],
          ["Deslizar", "Ir até um ponto em movimento, durante um tempo."],
          ["Borda", "O limite do palco."],
          ["Estilo de rotação", "Como o ator gira (completo, esquerda-direita ou não gira)."],
        ]}
      />
      <Quiz
        items={[
          ["Em qual categoria fica o “mova 10 passos”?", "Movimento."],
          ["Depois de “aponte para a direção 90”, pra onde o ator olha?", "Pra direita."],
          ["“Adicione 10 a x” leva o ator pra qual lado?", "Pra direita."],
          ["Qual é a diferença entre “vá para” e “deslize”?", "O vá para pula na hora; o deslize leva o ator até lá em movimento."],
        ]}
      />
    </>,
  ),
];
