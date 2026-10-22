"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Panel, Pill, Slider } from "./art";

// ============================================================================
// CAPÍTULO 7 — O EDITOR DE TEXTO (missão "Pacote Office", a parte do Word):
// a folha sendo escrita com a barra de ferramentas, as partes da janela do
// Word, o formatador de texto (de tocar) e o corretor sublinhando os erros.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a folha sendo escrita
// ---------------------------------------------------------------------------

function TypingOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma folha de documento com as linhas de texto aparecendo uma a uma, o cursor piscando e a barra com os botões de negrito, itálico e sublinhado">
      <rect width="460" height="300" fill="#dbeafe" />
      <rect x="40" y="20" width="380" height="40" rx="6" fill="#1e3a8a" />
      {["N", "I", "S"].map((b, i) => (
        <g key={b} transform={`translate(${70 + i * 40} 40)`}>
          <rect x="-14" y="-12" width="28" height="24" rx="4" fill="#fff" />
          <text y="6" textAnchor="middle" fontSize="16" fontWeight={b === "N" ? 900 : 500} fontStyle={b === "I" ? "italic" : "normal"} textDecoration={b === "S" ? "underline" : undefined} fill="#1e3a8a">
            {b}
          </text>
        </g>
      ))}
      <rect x="300" y="30" width="100" height="20" rx="4" fill="#fff" />
      <text x="308" y="45" fontSize="12" fill="#1e3a8a">Georgia ▾</text>
      <rect x="110" y="74" width="240" height="216" fill="#fff" stroke="#94a3b8" />
      <rect x="140" y="96" width="140" height="12" rx="3" fill="#1e3a8a" />
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} x="140" y={124 + i * 20} height="8" rx="3" fill="#94a3b8" width="0">
          <animate attributeName="width" values={`0;0;${i % 3 === 2 ? 120 : 180};${i % 3 === 2 ? 120 : 180}`} keyTimes={`0;${(i * 0.1).toFixed(2)};${(i * 0.1 + 0.1).toFixed(2)};1`} dur="6s" repeatCount="indefinite" />
        </rect>
      ))}
      <rect x="320" y="122" width="2" height="12" fill="#0f172a">
        <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
      </rect>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As partes da janela do Word
// ---------------------------------------------------------------------------

function WordWindowArt() {
  return (
    <Art viewBox="0 0 560 210" label="A janela do Word com a faixa de opções em cima, a régua, a área do texto no meio e a barra de status embaixo, cada parte com o nome ao lado">
      <rect width="560" height="210" rx="14" fill="#fffaf0" />
      <rect x="20" y="14" width="330" height="184" rx="6" fill="#e2e8f0" stroke="#94a3b8" />
      <rect x="20" y="14" width="330" height="18" rx="6" fill="#1e3a8a" />
      <rect x="20" y="32" width="330" height="34" fill="#f8fafc" stroke="#cbd5e1" />
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={30 + i * 34} y="38" width="26" height="22" rx="3" fill={i % 3 ? "#cbd5e1" : "#93c5fd"} />
      ))}
      <rect x="70" y="70" width="230" height="8" fill="#fff" stroke="#cbd5e1" />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={74 + i * 19} y1="72" x2={74 + i * 19} y2="76" stroke="#94a3b8" />
      ))}
      <rect x="70" y="82" width="230" height="100" fill="#fff" stroke="#cbd5e1" />
      {Array.from({ length: 5 }, (_, i) => (
        <rect key={i} x="84" y={94 + i * 16} width={i === 4 ? 120 : 200} height="6" rx="2" fill="#cbd5e1" />
      ))}
      <rect x="20" y="186" width="330" height="12" fill="#1e3a8a" opacity="0.8" />
      {[
        ["Faixa de Opções: os botões", 49],
        ["Régua: as margens", 74],
        ["Área do texto: a folha", 130],
        ["Barra de status: páginas e palavras", 192],
      ].map(([t, y]) => (
        <g key={t as string}>
          <line x1="352" y1={y as number} x2="372" y2={y as number} stroke="#7c6a48" strokeDasharray="3 2" />
          <text x="376" y={(y as number) + 4} fontSize="12" fontWeight="700" fill="#3b2a14" fontFamily="Georgia, serif">
            {t}
          </text>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O formatador de texto (de tocar)
// ---------------------------------------------------------------------------

const ALIGNS = [
  ["left", "⬅ Esquerda"],
  ["center", "↔ Centro"],
  ["right", "➡ Direita"],
  ["justify", "▤ Justificado"],
] as const;
const COLORS = ["#1e293b", "#dc2626", "#2563eb", "#16a34a", "#9333ea"];
const FONTS = [
  ["Georgia, serif", "Georgia"],
  ["Arial, sans-serif", "Arial"],
  ["'Courier New', monospace", "Courier"],
] as const;

export function TextFormatter() {
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [under, setUnder] = useState(false);
  const [size, setSize] = useState(14);
  const [align, setAlign] = useState<(typeof ALIGNS)[number][0]>("left");
  const [color, setColor] = useState(COLORS[0]);
  const [font, setFont] = useState<string>(FONTS[0][0]);
  return (
    <Panel title="Formate o texto">
      <div className="mb-[0.3em] flex flex-wrap items-center justify-center gap-[0.25em]">
        <Pill on={bold} onClick={() => setBold(!bold)}>
          <strong>N</strong>
        </Pill>
        <Pill on={italic} onClick={() => setItalic(!italic)}>
          <em>I</em>
        </Pill>
        <Pill on={under} onClick={() => setUnder(!under)}>
          <u>S</u>
        </Pill>
        {COLORS.map((c) => (
          <button key={c} type="button" onClick={() => setColor(c)} className="h-[1.3em] w-[1.3em] rounded-full border-2" style={{ background: c, borderColor: color === c ? "#facc15" : "#fff" }} aria-label={`Cor ${c}`} />
        ))}
        {FONTS.map(([f, name]) => (
          <Pill key={name} on={font === f} onClick={() => setFont(f)}>
            <span style={{ fontFamily: f }}>{name}</span>
          </Pill>
        ))}
      </div>
      <div className="mb-[0.3em] flex flex-wrap justify-center gap-[0.25em]">
        {ALIGNS.map(([a, label]) => (
          <Pill key={a} on={align === a} onClick={() => setAlign(a)}>
            {label}
          </Pill>
        ))}
      </div>
      <Slider label="Tamanho" value={size} min={10} max={24} onChange={setSize} format={(v) => `${v} pt`} />
      <div className="mt-[0.3em] h-[6.5em] overflow-hidden rounded-md border border-[#cbd5e1] bg-white px-[0.6em] py-[0.4em]">
        <p
          style={{
            fontWeight: bold ? 900 : 400,
            fontStyle: italic ? "italic" : "normal",
            textDecoration: under ? "underline" : "none",
            fontSize: `${size / 16}em`,
            textAlign: align,
            color,
            fontFamily: font,
            lineHeight: 1.35,
          }}
        >
          O Mago Danilo abriu o livro e disse: quem aprende a formatar um texto deixa as ideias mais fáceis de ler!
        </p>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// O corretor ortográfico
// ---------------------------------------------------------------------------

function SpellArt() {
  return (
    <Art viewBox="0 0 560 120" label="Uma frase com a palavra excessão sublinhada com uma linha vermelha ondulada e o corretor sugerindo a forma certa, exceção">
      <rect width="560" height="120" rx="14" fill="#fff" stroke="#cbd5e1" />
      <text x="30" y="50" fontSize="22" fill="#1e293b" fontFamily="Georgia, serif">
        Todos foram, com uma
      </text>
      <text x="268" y="50" fontSize="22" fill="#1e293b" fontFamily="Georgia, serif">
        excessão.
      </text>
      <path d="M268 58 q4 -4 8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0" fill="none" stroke="#dc2626" strokeWidth="2">
        <animate attributeName="opacity" values="0;1;1" keyTimes="0;0.3;1" dur="3s" repeatCount="indefinite" />
      </path>
      <g transform="translate(268 66)">
        <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.4;0.5;1" dur="3s" repeatCount="indefinite" />
        <rect width="150" height="40" rx="6" fill="#f8fafc" stroke="#94a3b8" />
        <text x="12" y="26" fontSize="16" fontWeight="900" fill="#16a34a" fontFamily="Georgia, serif">
          ✔ exceção
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 7, content, bare });

export const chapter7: BookPage[] = [
  page(
    <ChapterOpener n={7} title="O Editor de Texto" goals={["Para que serve um editor de texto", "As partes da janela do Word", "Como formatar o texto", "Salvar, revisar e imprimir"]}>
      <Fig h={34}>
        <TypingOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="📝">O editor de texto</H>
      <P>
        O <T>editor de texto</T> é o programa para escrever trabalhos, cartas e relatórios. O mais usado é o <T>Microsoft Word</T>, do pacote Office; outros são o Google
        Docs (na nuvem) e o LibreOffice Writer (gratuito). O arquivo do Word termina em <T>.docx</T>.
      </P>
      <Fig n="7.1" caption="As partes da janela do Word." h={22}>
        <WordWindowArt />
      </Fig>
      <Box kind="sabia">
        No Word em português, o negrito é o botão <strong>N</strong>, o itálico é o <strong>I</strong> e o sublinhado é o <strong>S</strong>.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🎨">Formatando o texto</H>
      <P>
        <T>Formatar</T> é mudar a aparência do texto sem mudar as palavras: a fonte, o tamanho, a cor, o negrito e o <T>alinhamento</T>. Experimente cada botão:
      </P>
      <TextFormatter />
      <Box kind="mago" title="Menos é mais">
        Use no máximo duas fontes e poucas cores. Negrito só nas palavras mais importantes: se tudo estiver em destaque, nada fica em destaque!
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="💾">Salvar e organizar</H>
      <P>
        Salve logo no começo e muitas vezes: <T>Ctrl + S</T>. Use <T>Salvar como</T> para escolher o nome, a pasta ou outro formato, como o <T>PDF</T>, que abre igual
        em qualquer aparelho.
      </P>
      <Table
        head={["Quero...", "Onde fica"]}
        rows={[
          ["Fazer títulos", "Página Inicial → Estilos (Título 1, Título 2)"],
          ["Fazer uma lista", "Página Inicial → Marcadores ou Numeração"],
          ["Pôr uma imagem ou tabela", "Inserir → Imagens ou Tabela"],
          ["Mudar as margens", "Layout → Margens"],
          ["Contar as palavras", "Revisão → Contar Palavras"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🔍">Revisar e imprimir</H>
      <P>
        O <T>corretor ortográfico</T> sublinha em vermelho as palavras que ele acha que estão erradas e sugere a forma certa. Clique com o botão direito na palavra para
        ver as sugestões.
      </P>
      <Fig n="7.2" caption="O corretor sublinha e sugere." h={14}>
        <SpellArt />
      </Fig>
      <Box kind="atencao">
        O corretor não pega tudo: “mas” e “mais” estão as duas certas, mas cada uma tem um sentido. Releia sempre o texto antes de entregar.
      </Box>
      <P>
        Para imprimir, use <T>Ctrl + P</T>: dá para escolher a impressora, quantas cópias e quais páginas, e ver como vai ficar antes de gastar papel.
      </P>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "O editor de texto serve para escrever; o Word salva em .docx.",
          "A janela tem a Faixa de Opções, a régua, a área do texto e a barra de status.",
          "Formatar é mudar a fonte, o tamanho, a cor, o negrito e o alinhamento.",
          "Ctrl + S salva; dá para salvar também em PDF.",
          "O corretor ajuda, mas é preciso reler; Ctrl + P imprime.",
        ]}
      />
      <Glossary
        items={[
          ["Fonte", "O desenho das letras, como Arial ou Georgia."],
          ["Formatar", "Mudar a aparência do texto."],
          ["Alinhamento", "Como o texto se encaixa nas margens: esquerda, centro, direita ou justificado."],
          ["PDF", "Um formato de documento que abre igual em todos os aparelhos."],
          ["Corretor ortográfico", "A ferramenta que aponta erros de escrita."],
        ]}
      />
      <Quiz
        items={[
          ["Qual é a extensão dos arquivos do Word?", ".docx"],
          ["Qual atalho salva o documento?", "Ctrl + S."],
          ["O que é o alinhamento justificado?", "O texto encostado nas duas margens, a esquerda e a direita."],
          ["Por que é preciso reler mesmo com o corretor?", "Porque ele não pega todos os erros, como palavras certas usadas no lugar errado."],
        ]}
      />
    </>,
  ),
];
