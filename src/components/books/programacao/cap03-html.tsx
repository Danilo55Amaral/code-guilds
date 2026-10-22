"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Code, PROG, Panel, Pill } from "./art";

// ============================================================================
// CAPÍTULO 3 — HTML: A ESTRUTURA (missões "HTML" e "HTML parte 2"): os
// tijolos das tags montando uma página, a tag aberta e fechada, as caixas
// da estrutura de uma página, o montador de página (de tocar, com o código e
// o resultado lado a lado) e as tabelas e formulários.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: os tijolos das tags
// ---------------------------------------------------------------------------

function BricksOpenerArt() {
  const bricks = ["<html>", "<body>", "<h1>", "<p>", "<img>", "<a>"];
  return (
    <Art viewBox="0 0 460 300" label="Tijolos com nomes de tags HTML caindo e se empilhando para montar uma página da internet, ao lado de um navegador mostrando a página pronta">
      <rect width="460" height="300" fill="#ede9fe" />
      {bricks.map((b, i) => (
        <g key={b} transform={`translate(${30 + (i % 2) * 90} ${250 - Math.floor(i / 2) * 44})`}>
          <g>
            <animateTransform attributeName="transform" type="translate" values="0 -240;0 0;0 0" keyTimes={`0;${(0.1 + i * 0.1).toFixed(2)};1`} dur="6s" repeatCount="indefinite" />
            <rect width="86" height="40" rx="4" fill={["#ea580c", "#f97316", "#fb923c", "#c2410c", "#ea580c", "#f97316"][i]} stroke="#7c2d12" strokeWidth="2" />
            <text x="43" y="26" textAnchor="middle" fontSize="15" fontWeight="900" fontFamily="monospace" fill="#fff">
              {b}
            </text>
          </g>
        </g>
      ))}
      <g transform="translate(240 60)">
        <rect width="190" height="200" rx="8" fill="#fff" stroke="#94a3b8" strokeWidth="2" />
        <rect width="190" height="22" rx="8" fill="#e2e8f0" />
        {["#f87171", "#facc15", "#4ade80"].map((c, i) => (
          <circle key={c} cx={14 + i * 12} cy="11" r="4" fill={c} />
        ))}
        <rect x="16" y="36" width="130" height="18" rx="3" fill={PROG} />
        {[0, 1, 2].map((k) => (
          <rect key={k} x="16" y={66 + k * 12} width={150 - k * 20} height="6" rx="2" fill="#cbd5e1" />
        ))}
        <rect x="16" y="110" width="80" height="56" rx="4" fill="#bae6fd" />
        <circle cx="40" cy="128" r="8" fill="#facc15" />
        <path d="M18 164 L50 136 L70 152 L94 132 L94 164 Z" fill="#4ade80" />
        <text x="110" y="180" fontSize="12" fill="#2563eb" textDecoration="underline">um link</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A estrutura da página
// ---------------------------------------------------------------------------

function StructureArt() {
  const boxes = [
    { x: 20, y: 14, w: 300, h: 168, label: "<html>", color: "#7c3aed" },
    { x: 34, y: 38, w: 272, h: 34, label: "<head> título da aba (não aparece)", color: "#2563eb" },
    { x: 34, y: 82, w: 272, h: 90, label: "<body> tudo o que aparece na página", color: "#16a34a" },
  ];
  return (
    <Art viewBox="0 0 560 196" label="A estrutura de uma página: a caixa html por fora, com a caixa head em cima, que guarda o título da aba, e a caixa body embaixo, com o que aparece na página">
      <rect width="560" height="196" rx="14" fill="#fffaf0" />
      {boxes.map((b, i) => (
        <g key={b.label}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="8" fill={`${b.color}14`} stroke={b.color} strokeWidth="3">
            <animate attributeName="stroke-width" values="2;5;2" dur="3s" begin={`${-i}s`} repeatCount="indefinite" />
          </rect>
          <text x={b.x + 10} y={b.y + 18} fontSize="12" fontWeight="900" fontFamily="monospace" fill={b.color}>
            {b.label}
          </text>
        </g>
      ))}
      <text x="48" y="128" fontSize="12" fontFamily="monospace" fill="#334155">
        &lt;h1&gt;, &lt;p&gt;, &lt;img&gt;, &lt;a&gt;...
      </text>
      <g transform="translate(350 30)">
        <rect width="190" height="140" rx="8" fill="#fff" stroke="#94a3b8" strokeWidth="2" />
        <rect width="120" height="22" rx="6" fill="#dbeafe" stroke="#2563eb" />
        <text x="10" y="15" fontSize="11" fontWeight="700" fill="#1e3a8a">Minha página</text>
        <rect x="14" y="40" width="120" height="14" rx="3" fill="#16a34a" opacity="0.7" />
        {[0, 1, 2].map((k) => (
          <rect key={k} x="14" y={64 + k * 12} width={150 - k * 30} height="6" rx="2" fill="#86efac" />
        ))}
        <text x="95" y="130" textAnchor="middle" fontSize="10" fill="#64748b">o head vira o nome da aba</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O montador de página (de tocar)
// ---------------------------------------------------------------------------

const PARTS = [
  { id: "h1", label: "Título", code: "<h1>Meu primeiro site</h1>" },
  { id: "p", label: "Parágrafo", code: "<p>Eu adoro programar!</p>" },
  { id: "img", label: "Imagem", code: '<img src="gato.png" alt="Um gato">' },
  { id: "ul", label: "Lista", code: "<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n</ul>" },
  { id: "a", label: "Link", code: '<a href="https://codeguilds.com">Visite a CodeGuilds</a>' },
  { id: "button", label: "Botão", code: "<button>Clique aqui</button>" },
];

export function HtmlBuilder() {
  const [on, setOn] = useState<string[]>(["h1", "p"]);
  const has = (id: string) => on.includes(id);
  const code = PARTS.filter((p) => has(p.id))
    .map((p) => p.code)
    .join("\n");
  return (
    <Panel title="Monte a sua página">
      <div className="mb-[0.3em] flex flex-wrap justify-center gap-[0.25em]">
        {PARTS.map((p) => (
          <Pill key={p.id} on={has(p.id)} onClick={() => setOn((o) => (o.includes(p.id) ? o.filter((x) => x !== p.id) : [...o, p.id]))}>
            {has(p.id) ? "✔" : "+"} {p.label}
          </Pill>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-[0.4em]">
        <div className="min-w-0">
          <Code code={code || "<!-- a página está vazia -->"} lang="html" title="index.html" />
        </div>
        <div className="my-[0.4em] min-w-0 overflow-hidden rounded-lg border border-[#94a3b8] bg-white px-[0.6em] py-[0.4em] text-[#111] [font-family:Arial,sans-serif]">
          {has("h1") && <div className="text-[1.3em] font-bold">Meu primeiro site</div>}
          {has("p") && <div className="my-[0.3em] text-[0.8em]">Eu adoro programar!</div>}
          {has("img") && <div className="my-[0.2em] text-[2em] leading-none">🐱</div>}
          {has("ul") && (
            <ul className="my-[0.2em] list-disc pl-[1.2em] text-[0.8em]">
              <li>HTML</li>
              <li>CSS</li>
            </ul>
          )}
          {has("a") && <div className="text-[0.8em] text-[#2563eb] underline">Visite a CodeGuilds</div>}
          {has("button") && <div className="mt-[0.3em] inline-block rounded border border-[#64748b] bg-[#e5e7eb] px-[0.5em] text-[0.75em]">Clique aqui</div>}
        </div>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 3, content, bare });

export const chapter3: BookPage[] = [
  page(
    <ChapterOpener n={3} title="HTML: a Estrutura" goals={["O que são as tags", "A estrutura de uma página", "Títulos, parágrafos, links, imagens e listas", "Tabelas e formulários"]}>
      <Fig h={34}>
        <BricksOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🏷️">As tags</H>
      <P>
        O <T>HTML</T> não é uma linguagem de programação: é uma linguagem de <T>marcação</T>, que diz o que é cada parte da página. Ele usa <T>tags</T> entre os sinais
        &lt; e &gt;. A maioria abre e fecha (a de fechar tem uma barra), e algumas têm <T>atributos</T>, que dão informações extras:
      </P>
      <Code lang="html" code={'<p>Um parágrafo de texto</p>\n<a href="https://site.com">um link</a>\n<img src="foto.jpg" alt="descrição da foto">'} />
      <Box kind="lembre">
        <strong>href</strong> diz para onde o link vai; <strong>src</strong> diz onde está a imagem; <strong>alt</strong> descreve a imagem para quem não pode vê-la. Tags
        como <strong>&lt;img&gt;</strong> e <strong>&lt;br&gt;</strong> não precisam fechar.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🏗️">A estrutura da página</H>
      <P>
        Toda página tem a mesma estrutura: a tag <T>html</T> por fora, o <T>head</T> com as informações (como o título da aba) e o <T>body</T>, com tudo o que aparece na
        tela.
      </P>
      <Fig n="3.1" caption="As caixas de uma página HTML." h={22}>
        <StructureArt />
      </Fig>
      <Code lang="html" code={"<!DOCTYPE html>\n<html>\n  <head><title>Minha página</title></head>\n  <body> ... </body>\n</html>"} />
    </>,
  ),

  page(
    <>
      <H icon="🧱">Montando uma página</H>
      <P>
        Os títulos vão do <T>h1</T> (o maior) ao <T>h6</T>; <T>p</T> é parágrafo; <T>ul</T> e <T>ol</T> fazem listas, com cada item num <T>li</T>. Ligue e desligue as
        partes e veja o código e a página:
      </P>
      <HtmlBuilder />
      <Box kind="experimente">
        Em qualquer site, aperte <strong>Ctrl + U</strong> para ver o código HTML da página. Tudo o que você vê na internet é feito de tags!
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="📋">Tabelas e formulários</H>
      <P>
        Uma <T>tabela</T> é feita de linhas (<T>tr</T>) com células (<T>td</T>, ou <T>th</T> para os títulos). Um <T>formulário</T> (<T>form</T>) tem campos para o
        usuário digitar (<T>input</T>) e um botão para enviar.
      </P>
      <Code lang="html" code={'<form>\n  <label>Nome:</label>\n  <input type="text" placeholder="Seu nome">\n  <button type="submit">Enviar</button>\n</form>'} />
      <Table
        head={["Tag", "Para quê"]}
        rows={[
          ["<h1> a <h6>", "Títulos, do maior para o menor"],
          ["<a href>", "Link para outra página"],
          ["<img src alt>", "Imagem"],
          ["<table> <tr> <td>", "Tabela, linha e célula"],
          ['<a target="_blank">', "Link que abre numa aba nova"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "HTML é a linguagem de marcação que dá a estrutura das páginas.",
          "As tags ficam entre < e >; a maioria abre e fecha.",
          "Atributos como href, src e alt dão informações extras.",
          "A página tem html, head (informações) e body (o que aparece).",
          "Há tags para títulos, parágrafos, listas, imagens, links, tabelas e formulários.",
        ]}
      />
      <Glossary
        items={[
          ["HTML", "HyperText Markup Language: a linguagem que estrutura as páginas."],
          ["Tag", "Uma marcação entre < e >, como <p>."],
          ["Atributo", "Uma informação extra dentro da tag, como href."],
          ["Body", "O corpo da página: o que aparece na tela."],
          ["Formulário", "A parte da página onde o usuário digita e envia dados."],
        ]}
      />
      <Quiz
        items={[
          ["Qual tag faz o título maior da página?", "<h1>."],
          ["Para que serve o atributo href?", "Para dizer para onde o link leva."],
          ["Em que parte fica o que aparece na tela?", "No <body>."],
          ["Qual tag faz cada item de uma lista?", "<li>."],
        ]}
      />
    </>,
  ),
];
