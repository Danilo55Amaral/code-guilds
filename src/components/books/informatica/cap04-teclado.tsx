"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { INF, INF_DARK, Key, Panel } from "./art";

// ============================================================================
// CAPÍTULO 4 — TECLADO E ATALHOS (missões "Informática", "Informática parte
// 2" e "parte 3", a parte dos atalhos): o teclado com as teclas acendendo,
// as teclas especiais (de tocar), o laboratório de atalhos com copiar,
// colar, desfazer e negrito (de tocar) e as mãos na posição de digitar.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o teclado acendendo
// ---------------------------------------------------------------------------

function KeyboardOpenerArt() {
  const rows = [12, 11, 10];
  return (
    <Art viewBox="0 0 460 300" label="Um teclado grande com as teclas Ctrl e C acendendo juntas e, em cima, um documento sendo copiado e aparecendo duplicado">
      <rect width="460" height="300" fill="#ccfbf1" />
      <rect x="40" y="150" width="380" height="120" rx="14" fill="#334155" />
      {rows.map((n, r) =>
        Array.from({ length: n }, (_, i) => {
          const x = 56 + r * 12 + i * 29;
          const lit = (r === 2 && i === 0) || (r === 2 && i === 3);
          return (
            <rect key={`${r}-${i}`} x={x} y={164 + r * 30} width="24" height="24" rx="4" fill="#f8fafc">
              {lit && <animate attributeName="fill" values="#f8fafc;#2dd4bf;#2dd4bf;#f8fafc" keyTimes="0;0.2;0.5;0.7" dur="3s" repeatCount="indefinite" />}
            </rect>
          );
        }),
      )}
      <rect x="140" y="252" width="180" height="12" rx="4" fill="#f8fafc" />
      <text x="80" y="241" textAnchor="middle" fontSize="9" fontWeight="900" fill="#0f172a">Ctrl</text>
      <text x="167" y="241" textAnchor="middle" fontSize="11" fontWeight="900" fill="#0f172a">C</text>
      <g transform="translate(170 40)">
        <rect width="60" height="80" rx="4" fill="#fff" stroke="#94a3b8" strokeWidth="2" />
        {[0, 1, 2, 3].map((k) => (
          <line key={k} x1="10" x2="50" y1={16 + k * 14} y2={16 + k * 14} stroke="#94a3b8" strokeWidth="4" />
        ))}
      </g>
      <g transform="translate(250 40)">
        <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.4;0.5;0.9;1" dur="3s" repeatCount="indefinite" />
        <rect width="60" height="80" rx="4" fill="#fff" stroke={INF} strokeWidth="2" />
        {[0, 1, 2, 3].map((k) => (
          <line key={k} x1="10" x2="50" y1={16 + k * 14} y2={16 + k * 14} stroke="#5eead4" strokeWidth="4" />
        ))}
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As teclas especiais (de tocar)
// ---------------------------------------------------------------------------

const SPECIAL: { key: string; wide?: boolean; text: string }[] = [
  { key: "Esc", text: "Escape: cancela ou fecha o que está aberto (como um menu ou a tela cheia)." },
  { key: "Tab", wide: true, text: "Pula para o próximo campo de um formulário, ou faz um recuo no texto." },
  { key: "Caps Lock", wide: true, text: "Liga e desliga as LETRAS MAIÚSCULAS para tudo que você digitar." },
  { key: "Shift", wide: true, text: "Segurando, faz uma letra maiúscula ou o símbolo de cima da tecla (como o ! no 1)." },
  { key: "Ctrl", text: "Control: combinada com outras teclas, faz os atalhos (Ctrl + C, Ctrl + V...)." },
  { key: "⊞", text: "A tecla Windows: abre o menu Iniciar e faz atalhos do sistema." },
  { key: "Alt", text: "Alternativa: faz atalhos, como Alt + Tab, que troca de janela." },
  { key: "Espaço", wide: true, text: "A barra de espaço separa as palavras." },
  { key: "⌫", wide: true, text: "Backspace: apaga a letra à esquerda do cursor." },
  { key: "Delete", wide: true, text: "Apaga a letra à direita do cursor, ou o arquivo selecionado." },
  { key: "Enter", wide: true, text: "Confirma uma ação ou começa um novo parágrafo." },
];

export function KeyExplorer() {
  const [sel, setSel] = useState(4);
  return (
    <Panel title="Toque numa tecla">
      <div className="flex flex-wrap justify-center gap-[0.25em] rounded-lg bg-[#334155] p-[0.4em]">
        {SPECIAL.map((k, i) => (
          <Key key={k.key} on={sel === i} wide={k.wide} onClick={() => setSel(i)}>
            {k.key}
          </Key>
        ))}
      </div>
      <p key={sel} className="cg-anim-fade mt-[0.4em] text-[0.88em] leading-snug">
        <strong style={{ color: INF_DARK }}>{SPECIAL[sel].key}: </strong>
        {SPECIAL[sel].text}
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// O laboratório de atalhos (de tocar)
// ---------------------------------------------------------------------------

type Doc = { words: string[]; bold: boolean; selected: boolean; clipboard: string | null };
const START_DOC: Doc = { words: ["Olá,", "aprendiz!"], bold: false, selected: false, clipboard: null };

export function ShortcutLab() {
  const [doc, setDoc] = useState<Doc>(START_DOC);
  const [history, setHistory] = useState<Doc[]>([]);
  const [last, setLast] = useState<string | null>(null);
  const [message, setMessage] = useState("Experimente os atalhos na ordem: Ctrl + A, Ctrl + C, Ctrl + V...");

  function apply(name: string, next: Doc, msg: string, undoable = true) {
    if (undoable) setHistory((h) => [...h, doc]);
    setDoc(next);
    setLast(name);
    setMessage(msg);
  }

  const shortcuts: { name: string; run: () => void }[] = [
    { name: "A", run: () => apply("A", { ...doc, selected: true }, "Ctrl + A seleciona tudo.", false) },
    {
      name: "C",
      run: () =>
        doc.selected
          ? apply("C", { ...doc, clipboard: doc.words.join(" ") }, "Ctrl + C copiou o texto selecionado (ele continua lá).", false)
          : apply("C", doc, "Nada selecionado para copiar. Use Ctrl + A antes.", false),
    },
    {
      name: "V",
      run: () =>
        doc.clipboard
          ? apply("V", { ...doc, words: [...doc.words, ...doc.clipboard.split(" ")].slice(0, 12), selected: false }, "Ctrl + V colou o que estava copiado.")
          : apply("V", doc, "A área de transferência está vazia: copie algo antes.", false),
    },
    { name: "B", run: () => apply("B", { ...doc, bold: !doc.bold }, "Ctrl + B (de bold) liga e desliga o negrito. No Word em português também é Ctrl + N.") },
    {
      name: "Z",
      run: () => {
        if (history.length === 0) {
          setLast("Z");
          setMessage("Não há nada para desfazer.");
          return;
        }
        setDoc(history[history.length - 1]);
        setHistory((h) => h.slice(0, -1));
        setLast("Z");
        setMessage("Ctrl + Z desfez a última ação. Salva-vidas!");
      },
    },
  ];

  return (
    <Panel title="Laboratório de atalhos">
      <div className="mb-[0.4em] min-h-[3.4em] rounded-md border border-[#cbd5e1] bg-white px-[0.6em] py-[0.4em] text-[0.95em]">
        <span className={`${doc.bold ? "font-black" : ""} ${doc.selected ? "bg-[#93c5fd]" : ""}`}>{doc.words.join(" ")}</span>
        <span className="animate-pulse">|</span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-[0.35em]">
        {shortcuts.map((s) => (
          <button key={s.name} type="button" onClick={s.run} className="flex items-center gap-[0.15em]">
            <Key on={last === s.name}>Ctrl</Key>
            <span className="text-[0.7em] font-bold">+</span>
            <Key on={last === s.name}>{s.name}</Key>
          </button>
        ))}
      </div>
      <p className="mt-[0.4em] text-center text-[0.82em] text-[#5b4a2e]">{message}</p>
      <button
        type="button"
        onClick={() => {
          setDoc(START_DOC);
          setHistory([]);
          setLast(null);
        }}
        className="mx-auto block text-[0.75em] font-bold underline"
        style={{ color: INF_DARK }}
      >
        ↺ Recomeçar
      </button>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As mãos na posição de digitar
// ---------------------------------------------------------------------------

function HomeRowArt() {
  const keys = "ASDFGHJKLÇ".split("");
  const colors = ["#f87171", "#fb923c", "#facc15", "#4ade80", "#4ade80", "#60a5fa", "#60a5fa", "#a78bfa", "#f472b6", "#f472b6"];
  return (
    <Art viewBox="0 0 560 150" label="A linha do meio do teclado, de A até Ç, com cada tecla pintada da cor do dedo que aperta, e os relevinhos nas teclas F e J">
      <rect width="560" height="150" rx="14" fill="#f0fdfa" />
      <rect x="20" y="40" width="520" height="62" rx="10" fill="#334155" />
      {keys.map((k, i) => (
        <g key={k} transform={`translate(${32 + i * 50} 50)`}>
          <rect width="44" height="42" rx="6" fill={colors[i]} />
          <text x="22" y="28" textAnchor="middle" fontSize="18" fontWeight="900" fill="#1e293b">
            {k}
          </text>
          {(k === "F" || k === "J") && (
            <rect x="15" y="34" width="14" height="3" rx="1.5" fill="#1e293b">
              <animate attributeName="opacity" values="1;0.2;1" dur="1.4s" repeatCount="indefinite" />
            </rect>
          )}
        </g>
      ))}
      <text x="155" y="128" textAnchor="middle" fontSize="13" fontWeight="900" fill={INF_DARK} fontFamily="Georgia, serif">
        mão esquerda: A S D F
      </text>
      <text x="420" y="128" textAnchor="middle" fontSize="13" fontWeight="900" fill={INF_DARK} fontFamily="Georgia, serif">
        mão direita: J K L Ç
      </text>
      <text x="280" y="26" textAnchor="middle" fontSize="12" fontWeight="700" fill="#3b2a14" fontFamily="Georgia, serif">
        os indicadores ficam no F e no J (sinta o relevinho!)
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 4, content, bare });

export const chapter4: BookPage[] = [
  page(
    <ChapterOpener n={4} title="Teclado e Atalhos" goals={["As teclas especiais do teclado", "Copiar, colar, desfazer e outros atalhos", "Os atalhos do sistema", "A posição certa para digitar"]}>
      <Fig h={34}>
        <KeyboardOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="⌨️">As teclas especiais</H>
      <P>
        Além das letras e dos números, o teclado tem <T>teclas especiais</T>, que não escrevem nada sozinhas mas fazem muita coisa. Conheça cada uma:
      </P>
      <KeyExplorer />
      <Box kind="sabia">
        O teclado se chama <strong>QWERTY</strong> por causa das seis primeiras letras da fileira de cima. Esse jeito de arrumar as letras é do tempo das máquinas de
        escrever!
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="⚡">Os atalhos mágicos</H>
      <P>
        Um <T>atalho</T> é apertar duas ou mais teclas juntas para fazer uma ação rápida, sem usar o mouse. Segure o <T>Ctrl</T> e aperte a letra. Teste:
      </P>
      <ShortcutLab />
      <Box kind="mago" title="Os três mais importantes">
        <strong>Ctrl + C</strong> copia, <strong>Ctrl + V</strong> cola e <strong>Ctrl + Z</strong> desfaz. Com esses três você já economiza muito tempo.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🔑">Atalhos do sistema</H>
      <Table
        head={["Atalho", "O que faz"]}
        rows={[
          ["Alt + Tab", "Troca entre as janelas abertas"],
          ["Windows + D", "Mostra a área de trabalho"],
          ["Windows + E", "Abre o Explorador de Arquivos"],
          ["Windows + L", "Bloqueia a tela"],
          ["Windows + Shift + S", "Tira um print de uma parte da tela"],
          ["Ctrl + S", "Salva o arquivo"],
          ["Ctrl + F", "Procura uma palavra na página ou no texto"],
          ["Ctrl + P", "Imprime"],
          ["F5", "Atualiza a página do navegador"],
        ]}
      />
      <Box kind="experimente">
        Abra três programas e aperte <strong>Alt + Tab</strong> várias vezes, segurando o Alt. Você vai pulando de janela em janela!
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🖐️">Digitando com os dez dedos</H>
      <P>
        Quem digita com os dez dedos escreve mais rápido e sem olhar para o teclado. Os dedos descansam na <T>linha do meio</T>, e cada um cuida das teclas da sua cor.
      </P>
      <Fig n="4.1" caption="A posição dos dedos na linha do meio." h={18}>
        <HomeRowArt />
      </Fig>
      <Box kind="lembre">
        Sente com as costas retas, os pés no chão, a tela na altura dos olhos e os pulsos sem dobrar. Faça pausas para descansar os olhos.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Shift, Ctrl, Alt e a tecla Windows não escrevem: ajudam a fazer atalhos.",
          "Backspace apaga à esquerda; Delete apaga à direita.",
          "Ctrl + C copia, Ctrl + V cola, Ctrl + X recorta e Ctrl + Z desfaz.",
          "Alt + Tab troca de janela; Windows + L bloqueia a tela.",
          "Os indicadores ficam nas teclas F e J, que têm um relevinho.",
        ]}
      />
      <Glossary
        items={[
          ["Atalho", "Teclas apertadas juntas para fazer uma ação rápida."],
          ["Cursor", "A barrinha que pisca mostrando onde o texto vai aparecer."],
          ["Área de transferência", "O lugar invisível onde fica o que você copiou."],
          ["QWERTY", "O jeito mais comum de arrumar as letras do teclado."],
          ["Print", "Uma foto da tela do computador."],
        ]}
      />
      <Quiz
        items={[
          ["Qual atalho desfaz a última ação?", "Ctrl + Z."],
          ["Para que serve a tecla Caps Lock?", "Liga e desliga as letras maiúsculas."],
          ["Qual atalho troca entre as janelas abertas?", "Alt + Tab."],
          ["Em quais teclas ficam os dedos indicadores?", "No F e no J."],
        ]}
      />
    </>,
  ),
];
