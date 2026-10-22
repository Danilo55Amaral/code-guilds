"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { ChoiceGame } from "../portugues/art";
import { INF, INF_DARK, Panel } from "./art";

// ============================================================================
// CAPÍTULO 3 — ARQUIVOS E PASTAS (missões "Informática" e "Informática parte
// 3"): os arquivos voando para dentro das pastas, o jogo das extensões, a
// árvore de pastas que abre e fecha (de tocar) e os arquivos sendo
// espremidos no ZIP.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: os arquivos indo para as pastas
// ---------------------------------------------------------------------------

function Folder({ x, y, s = 1, color = "#facc15", label }: { x: number; y: number; s?: number; color?: string; label?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-40 -30 L-12 -30 L-4 -22 L40 -22 L40 26 L-40 26 Z" fill={color} stroke="#a16207" strokeWidth="2" />
      <path d="M-40 -14 L40 -14 L40 26 L-40 26 Z" fill="#fde68a" stroke="#a16207" strokeWidth="2" />
      {label && (
        <text y="12" textAnchor="middle" fontSize="11" fontWeight="900" fill="#78350f">
          {label}
        </text>
      )}
    </g>
  );
}

function FileIcon({ x, y, color, ext }: { x: number; y: number; color: string; ext: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-14 -18 L6 -18 L14 -10 L14 18 L-14 18 Z" fill="#fff" stroke="#94a3b8" strokeWidth="1.5" />
      <path d="M6 -18 L6 -10 L14 -10" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
      <rect x="-14" y="4" width="28" height="12" fill={color} />
      <text y="13" textAnchor="middle" fontSize="8" fontWeight="900" fill="#fff">
        {ext}
      </text>
    </g>
  );
}

function FilesOpenerArt() {
  const files = [
    { color: "#2563eb", ext: "DOCX", to: 110 },
    { color: "#16a34a", ext: "JPG", to: 230 },
    { color: "#dc2626", ext: "MP3", to: 350 },
  ];
  return (
    <Art viewBox="0 0 460 300" label="Arquivos de texto, de imagem e de música voando e entrando cada um na sua pasta: Documentos, Imagens e Músicas">
      <rect width="460" height="300" fill="#ccfbf1" />
      <Folder x={110} y={230} s={1.4} label="Documentos" />
      <Folder x={230} y={230} s={1.4} color="#4ade80" label="Imagens" />
      <Folder x={350} y={230} s={1.4} color="#f87171" label="Músicas" />
      {files.map((f, i) => (
        <g key={f.ext}>
          <animateMotion path={`M230 40 Q${(230 + f.to) / 2} 20 ${f.to} 200`} dur="3s" begin={`${-i}s`} repeatCount="indefinite" />
          <g>
            <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.85;1" dur="3s" begin={`${-i}s`} repeatCount="indefinite" />
            <FileIcon x={0} y={0} color={f.color} ext={f.ext} />
          </g>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O jogo das extensões
// ---------------------------------------------------------------------------

const EXT_GAME = [
  { prompt: "📄 trabalho.docx", options: ["Texto do Word", "Imagem", "Música"], answer: 0, explain: ".docx é o documento do Word." },
  { prompt: "🖼️ ferias.jpg", options: ["Vídeo", "Imagem", "Planilha"], answer: 1, explain: ".jpg (e .png) são imagens." },
  { prompt: "🎵 musica.mp3", options: ["Áudio", "Programa", "Texto"], answer: 0, explain: ".mp3 é um arquivo de áudio. Vídeo costuma ser .mp4." },
  { prompt: "📊 notas.xlsx", options: ["Apresentação", "Planilha do Excel", "Imagem"], answer: 1, explain: ".xlsx é a planilha do Excel; .pptx é a apresentação do PowerPoint." },
  { prompt: "🗜️ fotos.zip", options: ["Arquivo compactado", "Vírus", "Texto"], answer: 0, explain: ".zip junta e encolhe vários arquivos num só." },
  { prompt: "⚙️ instalar.exe", options: ["Imagem", "Programa", "Música"], answer: 1, explain: ".exe é um programa: só abra se vier de um lugar confiável!" },
];

// ---------------------------------------------------------------------------
// A árvore de pastas (de tocar)
// ---------------------------------------------------------------------------

type Node = { name: string; icon: string; children?: Node[] };

const TREE: Node = {
  name: "Ana",
  icon: "👤",
  children: [
    {
      name: "Documentos",
      icon: "📁",
      children: [
        { name: "Escola", icon: "📁", children: [{ name: "Matemática", icon: "📁", children: [{ name: "lista.docx", icon: "📄" }] }, { name: "História", icon: "📁", children: [{ name: "resumo.docx", icon: "📄" }] }] },
      ],
    },
    { name: "Imagens", icon: "📁", children: [{ name: "Férias", icon: "📁", children: [{ name: "praia.jpg", icon: "🖼️" }] }] },
    { name: "Downloads", icon: "📁", children: [{ name: "jogo.zip", icon: "🗜️" }] },
  ],
};

export function FolderTree() {
  const [open, setOpen] = useState<Set<string>>(() => new Set(["Ana", "Ana/Documentos"]));
  const [path, setPath] = useState("Ana/Documentos");
  function toggle(p: string, isFolder: boolean) {
    setPath(p);
    if (!isFolder) return;
    setOpen((o) => {
      const n = new Set(o);
      if (n.has(p)) n.delete(p);
      else n.add(p);
      return n;
    });
  }
  function render(node: Node, p: string, depth: number): React.ReactNode {
    const isFolder = !!node.children;
    const isOpen = open.has(p);
    return (
      <div key={p}>
        <button
          type="button"
          onClick={() => toggle(p, isFolder)}
          className="flex w-full items-center gap-[0.3em] rounded px-[0.2em] text-left text-[0.8em]"
          style={{ paddingLeft: `${depth * 1.1 + 0.2}em`, background: path === p ? "#ccfbf1" : undefined }}
        >
          <span className="w-[0.8em] text-[0.8em] text-[#64748b]">{isFolder ? (isOpen ? "▾" : "▸") : ""}</span>
          <span>{isFolder && isOpen && node.icon === "📁" ? "📂" : node.icon}</span>
          <span className={isFolder ? "font-bold" : ""}>{node.name}</span>
        </button>
        {isFolder && isOpen && node.children!.map((c) => render(c, `${p}/${c.name}`, depth + 1))}
      </div>
    );
  }
  return (
    <Panel title="Abra e feche as pastas">
      <div className="max-h-[11em] overflow-y-auto rounded-md border border-[#cbd5e1] bg-white py-[0.2em]">{render(TREE, "Ana", 0)}</div>
      <p className="mt-[0.3em] break-all rounded bg-[#0f172a] px-[0.5em] py-[0.15em] font-mono text-[0.72em] text-[#5eead4]">C:\Usuários\{path.replace(/\//g, "\\")}</p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// O ZIP espremendo os arquivos
// ---------------------------------------------------------------------------

function ZipArt() {
  return (
    <Art viewBox="0 0 560 160" label="Cinco arquivos grandes entrando num arquivo ZIP com zíper, que fica menor: de 50 megabytes para 20 megabytes">
      <rect width="560" height="160" rx="14" fill="#f0fdfa" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <g transform={`translate(${50 + (i % 3) * 50} ${50 + Math.floor(i / 3) * 56})`}>
            <animateTransform attributeName="transform" type="translate" values={`${50 + (i % 3) * 50} ${50 + Math.floor(i / 3) * 56};400 80;400 80`} keyTimes="0;0.6;1" dur="4s" begin={`${-i * 0.3}s`} repeatCount="indefinite" />
            <FileIcon x={0} y={0} color={["#2563eb", "#16a34a", "#dc2626", "#ca8a04", "#7c3aed"][i]} ext={["DOCX", "JPG", "MP3", "PDF", "PNG"][i]} />
          </g>
        </g>
      ))}
      <g transform="translate(410 80)">
        <rect x="-36" y="-50" width="72" height="100" rx="8" fill="#fde68a" stroke="#a16207" strokeWidth="2" />
        <path d="M0 -50 L0 30" stroke="#78350f" strokeWidth="6" strokeDasharray="4 4" />
        <rect x="-8" y="26" width="16" height="16" rx="3" fill="#78350f" />
        <text y="-60" textAnchor="middle" fontSize="13" fontWeight="900" fill={INF_DARK}>fotos.zip</text>
      </g>
      <text x="130" y="150" textAnchor="middle" fontSize="13" fontWeight="900" fill={INF_DARK} fontFamily="Georgia, serif">
        5 arquivos: 50 MB
      </text>
      <text x="410" y="150" textAnchor="middle" fontSize="13" fontWeight="900" fill={INF} fontFamily="Georgia, serif">
        1 ZIP: 20 MB
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 3, content, bare });

export const chapter3: BookPage[] = [
  page(
    <ChapterOpener n={3} title="Arquivos e Pastas" goals={["O que são arquivos, pastas e extensões", "Como organizar os arquivos em pastas", "Copiar, mover, renomear e excluir", "Compactar e descompactar em ZIP"]}>
      <Fig h={34}>
        <FilesOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="📄">Arquivos e extensões</H>
      <P>
        Tudo o que fica guardado no computador é um <T>arquivo</T>: um texto, uma foto, uma música. O fim do nome, depois do ponto, é a <T>extensão</T>, que diz o tipo
        do arquivo e qual programa abre ele. Adivinhe:
      </P>
      <ChoiceGame items={EXT_GAME} color={INF} title="Que arquivo é esse?" />
    </>,
  ),

  page(
    <>
      <H icon="📂">Organizando em pastas</H>
      <P>
        As <T>pastas</T> guardam arquivos e outras pastas, como gavetas dentro de gavetas. O caminho até um arquivo, pasta por pasta, se chama <T>caminho</T> (ou
        endereço). Explore:
      </P>
      <FolderTree />
      <Box kind="mago" title="Nomes bons">
        Dê nomes que expliquem o arquivo, como <strong>historia-resumo-cap3.docx</strong>, e não <strong>arquivo final 2 (1).docx</strong>. Assim você acha tudo depressa.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="✂️">Copiar, mover, renomear e excluir</H>
      <P>
        O <T>Explorador de Arquivos</T> (Windows + E) é onde você mexe nos arquivos. <T>Copiar</T> cria uma cópia e deixa o original; <T>mover</T> (recortar) leva o
        arquivo para outro lugar.
      </P>
      <Table
        head={["Ação", "Atalho", "O que faz"]}
        rows={[
          ["Copiar", "Ctrl + C", "Copia o arquivo selecionado"],
          ["Recortar", "Ctrl + X", "Prepara para mover"],
          ["Colar", "Ctrl + V", "Coloca a cópia (ou o recortado) na pasta aberta"],
          ["Renomear", "F2", "Muda o nome do arquivo"],
          ["Excluir", "Delete", "Manda para a Lixeira"],
        ]}
      />
      <Box kind="atencao">
        O que vai para a <strong>Lixeira</strong> ainda pode ser restaurado. Mas <strong>Shift + Delete</strong> apaga direto, sem passar por ela!
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🗜️">Compactando em ZIP</H>
      <P>
        <T>Compactar</T> é juntar vários arquivos num só e diminuir o tamanho, para mandar por e-mail ou guardar. O arquivo <T>.zip</T> funciona como uma mala com
        zíper. Para usar o que está dentro, você <T>extrai</T> (descompacta).
      </P>
      <Fig n="3.1" caption="Vários arquivos espremidos num ZIP." h={18}>
        <ZipArt />
      </Fig>
      <Box kind="experimente">
        No Windows, clique com o botão direito em uma pasta e escolha <strong>Compactar para arquivo ZIP</strong>. Para abrir, clique com o botão direito no ZIP e escolha{" "}
        <strong>Extrair tudo</strong>.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Arquivos guardam informações; a extensão (.docx, .jpg, .mp3) diz o tipo.",
          "Pastas organizam os arquivos, umas dentro das outras.",
          "Ctrl + C copia, Ctrl + X recorta, Ctrl + V cola e F2 renomeia.",
          "O que vai para a Lixeira pode voltar; Shift + Delete apaga de vez.",
          "O ZIP junta e encolhe vários arquivos num só.",
        ]}
      />
      <Glossary
        items={[
          ["Arquivo", "Um conjunto de informações guardado com um nome."],
          ["Pasta", "Um lugar para organizar arquivos e outras pastas."],
          ["Extensão", "O final do nome do arquivo, que mostra o tipo dele."],
          ["Caminho", "O endereço de um arquivo, pasta por pasta."],
          ["Compactar", "Juntar e diminuir o tamanho de arquivos."],
        ]}
      />
      <Quiz
        items={[
          ["Que tipo de arquivo é o .mp3?", "Um arquivo de áudio (música)."],
          ["Qual tecla renomeia um arquivo no Windows?", "F2."],
          ["Qual é a diferença entre copiar e mover?", "Copiar deixa o original; mover leva o arquivo para outro lugar."],
          ["Para que serve um arquivo .zip?", "Para juntar e diminuir o tamanho de vários arquivos."],
        ]}
      />
    </>,
  ),
];
