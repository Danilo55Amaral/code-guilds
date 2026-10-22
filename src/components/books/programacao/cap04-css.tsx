"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Code, PROG, PROG_DARK, Panel, Pill, Slider } from "./art";

// ============================================================================
// CAPÍTULO 4 — CSS: O ESTILO (missões "CSS" e "CSS parte 2"): o pincel
// pintando a página sem graça, as partes de uma regra CSS, o estilizador de
// botão que escreve o CSS (de tocar), as camadas da caixa do CSS e o flexbox
// arrumando as caixas (de tocar).
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o pincel
// ---------------------------------------------------------------------------

function BrushOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma página sem graça, cinza, sendo pintada por um pincel que passa e deixa a página colorida, com título roxo, botão arredondado e fundo bonito">
      <rect width="460" height="300" fill="#ede9fe" />
      <defs>
        <clipPath id="prog-css-wipe">
          <rect x="60" y="30" width="0" height="240">
            <animate attributeName="width" values="0;340;340;0" keyTimes="0;0.45;0.85;1" dur="6s" repeatCount="indefinite" />
          </rect>
        </clipPath>
      </defs>
      <g>
        <rect x="60" y="30" width="340" height="240" rx="10" fill="#fff" stroke="#94a3b8" strokeWidth="2" />
        <rect x="90" y="60" width="200" height="22" fill="#cbd5e1" />
        {[0, 1, 2].map((k) => (
          <rect key={k} x="90" y={100 + k * 16} width={240 - k * 30} height="8" fill="#e2e8f0" />
        ))}
        <rect x="90" y="190" width="100" height="34" fill="#cbd5e1" />
      </g>
      <g clipPath="url(#prog-css-wipe)">
        <rect x="60" y="30" width="340" height="240" rx="10" fill="#fdf4ff" stroke={PROG} strokeWidth="3" />
        <rect x="90" y="60" width="200" height="22" rx="6" fill={PROG} />
        {[0, 1, 2].map((k) => (
          <rect key={k} x="90" y={100 + k * 16} width={240 - k * 30} height="8" rx="4" fill="#c4b5fd" />
        ))}
        <rect x="90" y="190" width="100" height="34" rx="17" fill="#ec4899" />
        <text x="140" y="212" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff">
          Jogar!
        </text>
        <circle cx="340" cy="200" r="34" fill="#fde047" />
      </g>
      <g>
        <animateTransform attributeName="transform" type="translate" values="60 0;400 0;400 0;60 0" keyTimes="0;0.45;0.85;1" dur="6s" repeatCount="indefinite" />
        <rect x="-8" y="70" width="16" height="120" rx="6" fill="#92400e" />
        <rect x="-12" y="190" width="24" height="16" fill="#94a3b8" />
        <path d="M-12 206 L12 206 L8 250 L-8 250 Z" fill={PROG} />
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As partes de uma regra CSS
// ---------------------------------------------------------------------------

function RuleArt() {
  return (
    <Art viewBox="0 0 560 150" label="A regra CSS h1 abre chaves color dois pontos purple ponto e vírgula fecha chaves, com setas mostrando o seletor, a propriedade e o valor">
      <rect width="560" height="150" rx="14" fill="#1e1b4b" />
      <text x="40" y="84" fontSize="30" fontFamily="monospace" fontWeight="900">
        <tspan fill="#f9a8d4">h1</tspan>
        <tspan fill="#e2e8f0"> {"{"} </tspan>
        <tspan fill="#7dd3fc">color</tspan>
        <tspan fill="#e2e8f0">: </tspan>
        <tspan fill="#fdba74">purple</tspan>
        <tspan fill="#e2e8f0">; {"}"}</tspan>
      </text>
      {[
        { x: 60, label: "seletor", color: "#f9a8d4" },
        { x: 230, label: "propriedade", color: "#7dd3fc" },
        { x: 380, label: "valor", color: "#fdba74" },
      ].map((a, i) => (
        <g key={a.label}>
          <path d={`M${a.x} 96 L${a.x} 116`} stroke={a.color} strokeWidth="3">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" begin={`${-i}s`} repeatCount="indefinite" />
          </path>
          <text x={a.x} y="136" textAnchor="middle" fontSize="15" fontWeight="900" fill={a.color} fontFamily="Georgia, serif">
            {a.label}
          </text>
        </g>
      ))}
      <text x="536" y="34" textAnchor="end" fontSize="12" fill="#c4b5fd" fontFamily="Georgia, serif">
        “todo h1 fica roxo”
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O estilizador de botão (de tocar)
// ---------------------------------------------------------------------------

const BG = ["#6d28d9", "#ec4899", "#16a34a", "#f97316", "#0ea5e9"];

export function ButtonStyler() {
  const [bg, setBg] = useState(BG[0]);
  const [radius, setRadius] = useState(8);
  const [pad, setPad] = useState(10);
  const [size, setSize] = useState(16);
  const [border, setBorder] = useState(0);
  const [hover, setHover] = useState(false);
  const css = `.botao {\n  background-color: ${bg};\n  color: white;\n  font-size: ${size}px;\n  padding: ${pad}px ${pad * 2}px;\n  border-radius: ${radius}px;\n  border: ${border}px solid black;\n}\n.botao:hover {\n  transform: scale(1.1);\n}`;
  return (
    <Panel title="Estilize o botão">
      <div className="mb-[0.3em] flex items-center justify-center gap-[0.3em]">
        {BG.map((c) => (
          <button key={c} type="button" onClick={() => setBg(c)} className="h-[1.4em] w-[1.4em] rounded-full border-2" style={{ background: c, borderColor: bg === c ? "#1e293b" : "#fff" }} aria-label={`Cor ${c}`} />
        ))}
      </div>
      <Slider label="Cantos" value={radius} min={0} max={30} onChange={setRadius} format={(v) => `${v}px`} />
      <Slider label="Espaço" value={pad} min={2} max={20} onChange={setPad} format={(v) => `${v}px`} />
      <Slider label="Letra" value={size} min={10} max={24} onChange={setSize} format={(v) => `${v}px`} />
      <Slider label="Borda" value={border} min={0} max={6} onChange={setBorder} format={(v) => `${v}px`} />
      <div className="grid grid-cols-[1fr_auto] items-center gap-[0.4em]">
        <Code code={css} lang="css" title="estilo.css" />
        <div className="flex h-full min-w-[7.5em] items-center justify-center rounded-lg bg-white">
          <button
            type="button"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="font-bold text-white transition-transform"
            style={{
              background: bg,
              borderRadius: radius / 16 + "em",
              padding: `${pad / 16}em ${(pad * 2) / 16}em`,
              fontSize: `${size / 16}em`,
              border: `${border}px solid black`,
              transform: hover ? "scale(1.1)" : undefined,
            }}
          >
            Jogar
          </button>
        </div>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// A caixa do CSS
// ---------------------------------------------------------------------------

function BoxModelArt() {
  const layers = [
    { inset: 0, color: "#fde68a", name: "margin: o espaço de fora" },
    { inset: 22, color: "#1e293b", name: "border: a borda" },
    { inset: 28, color: "#bbf7d0", name: "padding: o espaço de dentro" },
    { inset: 52, color: "#bfdbfe", name: "content: o conteúdo" },
  ];
  return (
    <Art viewBox="0 0 560 180" label="A caixa do CSS: o conteúdo no meio, em volta o padding, depois a borda e por fora a margin, cada camada com uma cor">
      <rect width="560" height="180" rx="14" fill="#fffaf0" />
      {layers.map((l, i) => (
        <rect key={l.name} x={30 + l.inset} y={14 + l.inset} width={260 - l.inset * 2} height={152 - l.inset * 2} rx="6" fill={l.color}>
          {i === 2 && <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite" />}
        </rect>
      ))}
      <text x="160" y="96" textAnchor="middle" fontSize="14" fontWeight="900" fill="#1e3a8a">Texto</text>
      {layers.map((l, i) => (
        <g key={l.name}>
          <rect x="320" y={30 + i * 32} width="18" height="18" rx="4" fill={l.color} stroke="#94a3b8" />
          <text x="346" y={44 + i * 32} fontSize="13" fontWeight="700" fill="#3b2a14" fontFamily="Georgia, serif">
            {l.name}
          </text>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O flexbox (de tocar)
// ---------------------------------------------------------------------------

const JUSTIFY = ["flex-start", "center", "space-between", "space-around"] as const;

export function FlexDemo() {
  const [justify, setJustify] = useState<(typeof JUSTIFY)[number]>("space-between");
  const [column, setColumn] = useState(false);
  const [gap, setGap] = useState(8);
  return (
    <Panel title="Arrume as caixas com o flexbox">
      <div className="mb-[0.3em] flex flex-wrap justify-center gap-[0.25em]">
        {JUSTIFY.map((j) => (
          <Pill key={j} on={justify === j} onClick={() => setJustify(j)}>
            {j}
          </Pill>
        ))}
        <Pill on={column} onClick={() => setColumn(!column)} color="#ec4899">
          {column ? "column" : "row"}
        </Pill>
      </div>
      <Slider label="gap" value={gap} min={0} max={24} onChange={setGap} format={(v) => `${v}px`} />
      <div
        className="mt-[0.3em] flex h-[7em] rounded-lg border-2 border-dashed p-[0.3em]"
        style={{ borderColor: PROG, justifyContent: justify, flexDirection: column ? "column" : "row", gap: gap / 16 + "em", background: "#faf5ff" }}
      >
        {["#6d28d9", "#ec4899", "#f97316"].map((c, i) => (
          <div key={c} className="flex h-[1.8em] w-[3.2em] items-center justify-center rounded-md text-[0.8em] font-black text-white transition-all" style={{ background: c }}>
            {i + 1}
          </div>
        ))}
      </div>
      <p className="mt-[0.2em] text-center font-mono text-[0.72em]" style={{ color: PROG_DARK }}>
        display: flex; flex-direction: {column ? "column" : "row"}; justify-content: {justify}; gap: {gap}px;
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 4, content, bare });

export const chapter4: BookPage[] = [
  page(
    <ChapterOpener n={4} title="CSS: o Estilo" goals={["As partes de uma regra CSS", "Seletores de tag, de classe e de id", "Cores, fontes, bordas e a caixa do CSS", "O hover e o flexbox"]}>
      <Fig h={34}>
        <BrushOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🎨">A regra CSS</H>
      <P>
        Se o HTML é o esqueleto da página, o <T>CSS</T> é a roupa: cores, tamanhos, fontes e posições. Uma regra CSS tem o <T>seletor</T> (o que vai mudar), a{" "}
        <T>propriedade</T> (o que muda) e o <T>valor</T> (como fica).
      </P>
      <Fig n="4.1" caption="As partes de uma regra CSS." h={16}>
        <RuleArt />
      </Fig>
      <Code lang="css" code={"p { font-size: 18px; }       /* todos os parágrafos */\n.aviso { color: red; }       /* quem tem class=\"aviso\" */\n#topo { background: navy; }  /* o elemento com id=\"topo\" */"} />
    </>,
  ),

  page(
    <>
      <H icon="🖌️">Estilizando um botão</H>
      <P>
        Mexa nos controles e veja o CSS mudar junto. Passe o mouse no botão para ver o <T>:hover</T>, o estilo de quando o mouse está em cima:
      </P>
      <ButtonStyler />
    </>,
  ),

  page(
    <>
      <H icon="📦">A caixa do CSS</H>
      <P>
        Para o CSS, todo elemento é uma <T>caixa</T> com camadas: o <T>conteúdo</T>, o <T>padding</T> (espaço de dentro), a <T>border</T> (borda) e a <T>margin</T> (espaço
        de fora, que afasta dos vizinhos).
      </P>
      <Fig n="4.2" caption="As camadas da caixa do CSS." h={20}>
        <BoxModelArt />
      </Fig>
      <Table
        head={["Valor", "Exemplo"]}
        rows={[
          ["Cores", "red · #6d28d9 · rgb(109, 40, 217)"],
          ["Tamanhos", "16px (pixels) · 50% (da largura) · 1.5em (da letra)"],
          ["Fontes", "font-family: Arial; font-weight: bold;"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🧲">O flexbox</H>
      <P>
        O <T>flexbox</T> (display: flex) arruma os elementos lado a lado ou um embaixo do outro e distribui o espaço entre eles. É o jeito mais fácil de montar menus e
        cartões. Teste:
      </P>
      <FlexDemo />
      <Box kind="mago" title="A cascata">
        CSS quer dizer <strong>Cascading Style Sheets</strong>, folhas de estilo em cascata: quando duas regras brigam, vale a mais específica (o id ganha da classe, que
        ganha da tag) ou a que vem por último.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "O CSS dá o estilo às páginas: cores, fontes, tamanhos e posições.",
          "Uma regra tem seletor, propriedade e valor.",
          "Seletores: p (tag), .classe e #id.",
          "A caixa do CSS tem conteúdo, padding, border e margin.",
          ":hover muda o estilo com o mouse em cima; o flexbox arruma os elementos.",
        ]}
      />
      <Glossary
        items={[
          ["CSS", "Cascading Style Sheets: a linguagem do estilo das páginas."],
          ["Seletor", "A parte da regra que escolhe o que vai mudar."],
          ["Padding", "O espaço entre o conteúdo e a borda."],
          ["Margin", "O espaço de fora, entre o elemento e os vizinhos."],
          ["Flexbox", "Um jeito de arrumar elementos em linha ou em coluna."],
        ]}
      />
      <Quiz
        items={[
          ["Quais são as três partes de uma regra CSS?", "Seletor, propriedade e valor."],
          ["Qual seletor escolhe os elementos com class=\"aviso\"?", ".aviso"],
          ["Qual é a diferença entre padding e margin?", "Padding é o espaço de dentro; margin é o espaço de fora."],
          ["O que faz o :hover?", "Muda o estilo quando o mouse está em cima."],
        ]}
      />
    </>,
  ),
];
