"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { ChoiceGame } from "../portugues/art";
import { INF, INF_DARK, Monitor, Panel, Pill } from "./art";

// ============================================================================
// CAPÍTULO 1 — O COMPUTADOR (missões "Informática" e "Hardware", a parte do
// computador por dentro): a mesa com o computador ligado e as engrenagens do
// processador, o jogo "hardware ou software?", o caminho entrada →
// processamento → saída (de tocar), a mesa e o armário da memória e as
// lâmpadas dos bits (de tocar).
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o computador na mesa
// ---------------------------------------------------------------------------

function DeskOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Um computador ligado em cima da mesa, com teclado e mouse, e engrenagens girando dentro da tela, mostrando que ele está processando">
      <rect width="460" height="300" fill="#ccfbf1" />
      <rect y="220" width="460" height="80" fill="#a16207" />
      <rect y="214" width="460" height="10" fill="#ca8a04" />
      <Monitor x={230} y={214} w={240} screen="#0f172a">
        {[
          { x: -30, r: 26, dur: 4, dir: 1 },
          { x: 18, r: 18, dur: 3, dir: -1 },
        ].map((g) => (
          <g key={g.x} transform={`translate(${g.x} 0)`}>
            <g>
              <animateTransform attributeName="transform" type="rotate" from="0" to={`${360 * g.dir}`} dur={`${g.dur}s`} repeatCount="indefinite" />
              {Array.from({ length: 8 }, (_, i) => (
                <rect key={i} x="-4" y={-g.r - 6} width="8" height="10" fill="#2dd4bf" transform={`rotate(${i * 45})`} />
              ))}
              <circle r={g.r} fill="#14b8a6" />
              <circle r={g.r * 0.35} fill="#0f172a" />
            </g>
          </g>
        ))}
        <text x="60" y="-30" fontSize="12" fontFamily="monospace" fill="#5eead4">
          01101
          <animate attributeName="opacity" values="1;0.2;1" dur="1s" repeatCount="indefinite" />
        </text>
      </Monitor>
      <rect x="140" y="236" width="150" height="26" rx="5" fill="#e2e8f0" stroke="#94a3b8" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={146 + (i % 6) * 24} y={240 + Math.floor(i / 6) * 10} width="20" height="7" rx="1.5" fill="#94a3b8" />
      ))}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;8 4;0 0" dur="2s" repeatCount="indefinite" />
        <ellipse cx="330" cy="250" rx="14" ry="20" fill="#e2e8f0" stroke="#94a3b8" />
        <line x1="330" y1="232" x2="330" y2="246" stroke="#94a3b8" />
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Hardware ou software?
// ---------------------------------------------------------------------------

const HW_GAME = [
  { prompt: "⌨️ O teclado", options: ["Hardware", "Software"], answer: 0, explain: "É uma peça física, que dá para tocar: hardware." },
  { prompt: "🧩 O Windows", options: ["Hardware", "Software"], answer: 1, explain: "É um programa (o sistema operacional): software." },
  { prompt: "🧠 O processador", options: ["Hardware", "Software"], answer: 0, explain: "É um chip, uma peça física: hardware." },
  { prompt: "🎮 Um jogo de computador", options: ["Hardware", "Software"], answer: 1, explain: "Jogos são programas: software." },
  { prompt: "🌐 O navegador Chrome", options: ["Hardware", "Software"], answer: 1, explain: "Navegador é um programa: software." },
];

// ---------------------------------------------------------------------------
// Entrada, processamento, saída e armazenamento (de tocar)
// ---------------------------------------------------------------------------

const STAGES = ["Entrada", "Processamento", "Saída", "Armazenamento"] as const;
const STAGE_COLOR = ["#2563eb", "#dc2626", "#16a34a", "#ca8a04"];
const DEVICES: { name: string; icon: string; stage: number; text: string }[] = [
  { name: "Teclado", icon: "⌨️", stage: 0, text: "Leva as letras que você digita para dentro do computador." },
  { name: "Mouse", icon: "🖱️", stage: 0, text: "Leva os movimentos e os cliques para o computador." },
  { name: "Microfone", icon: "🎤", stage: 0, text: "Leva o som da sua voz para dentro." },
  { name: "Processador", icon: "🧠", stage: 1, text: "A CPU é o cérebro: faz bilhões de contas por segundo e comanda tudo." },
  { name: "Monitor", icon: "🖥️", stage: 2, text: "Mostra na tela o resultado do que o computador processou." },
  { name: "Impressora", icon: "🖨️", stage: 2, text: "Coloca o resultado no papel." },
  { name: "Caixa de som", icon: "🔊", stage: 2, text: "Toca o som para fora." },
  { name: "SSD", icon: "💾", stage: 3, text: "Guarda os arquivos e programas mesmo com o computador desligado." },
];

export function DeviceFlow() {
  const [sel, setSel] = useState(3);
  const d = DEVICES[sel];
  return (
    <Panel title="Toque num aparelho">
      <div className="mb-[0.4em] flex flex-wrap justify-center gap-[0.25em]">
        {DEVICES.map((x, i) => (
          <Pill key={x.name} on={sel === i} onClick={() => setSel(i)} color={STAGE_COLOR[x.stage]}>
            {x.icon} {x.name}
          </Pill>
        ))}
      </div>
      <svg viewBox="0 0 400 100" className="w-full" role="img" aria-label={`${d.name} é um aparelho de ${STAGES[d.stage].toLowerCase()}`}>
        {[0, 1, 2].map((k) => (
          <g key={k}>
            <path d={`M${92 + k * 108} 36 L${116 + k * 108} 36`} stroke="#94a3b8" strokeWidth="3" />
            <path d={`M${112 + k * 108} 30 L${120 + k * 108} 36 L${112 + k * 108} 42`} fill="none" stroke="#94a3b8" strokeWidth="3" />
          </g>
        ))}
        <path d="M228 60 L228 76" stroke="#94a3b8" strokeWidth="3" strokeDasharray="3 3" />
        {STAGES.slice(0, 3).map((s, k) => (
          <g key={s}>
            <rect x={6 + k * 108} y="14" width="86" height="44" rx="8" fill={d.stage === k ? STAGE_COLOR[k] : "#fff"} stroke={STAGE_COLOR[k]} strokeWidth="2" style={{ transition: "fill 0.3s" }} />
            <text x={49 + k * 108} y="41" textAnchor="middle" fontSize="12" fontWeight="900" fill={d.stage === k ? "#fff" : STAGE_COLOR[k]}>
              {s}
            </text>
          </g>
        ))}
        <rect x="170" y="74" width="116" height="24" rx="8" fill={d.stage === 3 ? STAGE_COLOR[3] : "#fff"} stroke={STAGE_COLOR[3]} strokeWidth="2" />
        <text x="228" y="90" textAnchor="middle" fontSize="12" fontWeight="900" fill={d.stage === 3 ? "#fff" : STAGE_COLOR[3]}>
          Armazenamento
        </text>
        <circle r="5" fill={INF}>
          <animateMotion path="M20 36 L380 36" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>
      <p key={sel} className="cg-anim-fade mt-[0.2em] text-[0.86em] leading-snug">
        <strong style={{ color: STAGE_COLOR[d.stage] }}>
          {d.icon} {d.name} ({STAGES[d.stage].toLowerCase()}):
        </strong>{" "}
        {d.text}
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// A mesa e o armário
// ---------------------------------------------------------------------------

function MemoryArt() {
  return (
    <Art viewBox="0 0 560 180" label="À esquerda, uma mesa de trabalho pequena com papéis abertos, a memória RAM; à direita, um armário grande cheio de pastas, o armazenamento SSD">
      <rect width="560" height="180" rx="14" fill="#f0fdfa" />
      <g transform="translate(150 150)">
        <rect x="-100" y="-50" width="200" height="12" fill="#a16207" />
        <rect x="-92" y="-38" width="10" height="38" fill="#92400e" />
        <rect x="82" y="-38" width="10" height="38" fill="#92400e" />
        {[-60, -10, 40].map((x, i) => (
          <g key={x}>
            <rect x={x} y="-74" width="34" height="24" fill="#fff" stroke="#94a3b8">
              <animate attributeName="y" values="-74;-80;-74" dur="1.5s" begin={`${-i * 0.5}s`} repeatCount="indefinite" />
            </rect>
          </g>
        ))}
        <text y="22" textAnchor="middle" fontSize="13" fontWeight="900" fill={INF_DARK} fontFamily="Georgia, serif">
          RAM: a mesa de trabalho
        </text>
      </g>
      <g transform="translate(420 150)">
        <rect x="-80" y="-130" width="160" height="130" fill="#64748b" stroke="#334155" strokeWidth="2" />
        {[0, 1, 2, 3].map((r) => (
          <g key={r}>
            <rect x="-72" y={-122 + r * 31} width="144" height="26" fill="#94a3b8" />
            {Array.from({ length: 8 }, (_, k) => (
              <rect key={k} x={-66 + k * 17} y={-120 + r * 31} width="12" height="22" fill={["#fde68a", "#bfdbfe", "#fecaca", "#bbf7d0"][(r + k) % 4]} />
            ))}
          </g>
        ))}
        <text y="22" textAnchor="middle" fontSize="13" fontWeight="900" fill={INF_DARK} fontFamily="Georgia, serif">
          SSD: o armário
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As lâmpadas dos bits (de tocar)
// ---------------------------------------------------------------------------

export function BinaryLamps() {
  const [bits, setBits] = useState([0, 1, 0, 0, 0, 0, 0, 1]);
  const value = bits.reduce((s, b, i) => s + b * 2 ** (7 - i), 0);
  const letter = value >= 65 && value <= 90 ? String.fromCharCode(value) : value >= 97 && value <= 122 ? String.fromCharCode(value) : null;
  return (
    <Panel title="Acenda as lâmpadas: 1 = acesa, 0 = apagada">
      <div className="flex justify-center gap-[0.25em]">
        {bits.map((b, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setBits((x) => x.map((v, j) => (j === i ? 1 - v : v)))}
            className="flex flex-col items-center"
            aria-label={`Bit que vale ${2 ** (7 - i)}: ${b ? "aceso" : "apagado"}`}
          >
            <svg viewBox="-14 -18 28 34" className="w-[2.1em]" aria-hidden="true">
              <circle r="11" fill={b ? "#fde047" : "#e5e7eb"} stroke="#a16207" strokeWidth="1.5" style={{ filter: b ? "drop-shadow(0 0 4px #facc15)" : undefined }} />
              <rect x="-5" y="10" width="10" height="6" fill="#94a3b8" />
            </svg>
            <span className="font-mono text-[0.9em] font-black" style={{ color: b ? INF_DARK : "#94a3b8" }}>
              {b}
            </span>
            <span className="text-[0.6em] text-[#8a7146]">{2 ** (7 - i)}</span>
          </button>
        ))}
      </div>
      <p className="mt-[0.3em] text-center text-[0.95em]">
        <span className="font-mono font-black" style={{ color: INF_DARK }}>
          {bits.join("")}
        </span>{" "}
        = <strong>{value}</strong>
        {letter && (
          <>
            {" "}
            = a letra <strong className="text-[1.2em]" style={{ color: INF }}>{letter}</strong>
          </>
        )}
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 1, content, bare });

export const chapter1: BookPage[] = [
  page(
    <ChapterOpener n={1} title="O Computador" goals={["A diferença entre hardware e software", "Entrada, processamento, saída e armazenamento", "Memória RAM e armazenamento", "Bits, bytes e o código binário"]}>
      <Fig h={34}>
        <DeskOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🔧">Hardware e software</H>
      <P>
        O <T>hardware</T> é a parte física do computador, que dá para tocar: tela, teclado, processador, cabos. O <T>software</T> são os programas, as instruções que
        dizem ao hardware o que fazer: o sistema, os aplicativos, os jogos. Classifique:
      </P>
      <ChoiceGame items={HW_GAME} color={INF} title="Hardware ou software?" />
      <Box kind="mago" title="Um jeito de lembrar">
        Hardware é o que você pode chutar; software é o que te faz chorar quando trava. Sem software, o hardware não sabe fazer nada!
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🔁">O que o computador faz</H>
      <P>
        Todo computador faz quatro coisas: recebe dados pela <T>entrada</T>, transforma esses dados no <T>processamento</T>, mostra o resultado pela <T>saída</T> e guarda
        tudo no <T>armazenamento</T>. Toque nos aparelhos:
      </P>
      <DeviceFlow />
      <Box kind="sabia">
        Alguns aparelhos são de entrada <strong>e</strong> saída ao mesmo tempo, como a tela de toque do celular: ela mostra a imagem e também sente o seu dedo.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🗄️">Memória RAM e armazenamento</H>
      <P>
        A <T>memória RAM</T> é rápida mas esquece tudo quando o computador desliga: é onde ficam os programas abertos agora. O <T>armazenamento</T> (o SSD ou o HD) guarda
        os arquivos para sempre, mesmo desligado.
      </P>
      <Fig n="1.1" caption="A RAM é a mesa onde você trabalha; o SSD é o armário onde você guarda." h={20}>
        <MemoryArt />
      </Fig>
      <Box kind="atencao">
        Por isso é importante <strong>salvar</strong> o trabalho: o que está só na RAM se perde se a energia acabar.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="💡">Bits e bytes</H>
      <P>
        O computador só entende dois sinais: <T>0</T> (desligado) e <T>1</T> (ligado). Cada um é um <T>bit</T>. Um grupo de 8 bits é um <T>byte</T>, que pode guardar,
        por exemplo, uma letra. Monte uma letra:
      </P>
      <BinaryLamps />
      <Table
        head={["Unidade", "Tamanho (aproximado)", "Guarda mais ou menos"]}
        rows={[
          ["1 KB (quilobyte)", "mil bytes", "Um texto curto"],
          ["1 MB (megabyte)", "mil KB", "Uma foto ou uma música"],
          ["1 GB (gigabyte)", "mil MB", "Um filme"],
          ["1 TB (terabyte)", "mil GB", "Centenas de filmes"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Hardware é a parte física; software são os programas.",
          "O computador faz entrada, processamento, saída e armazenamento.",
          "A CPU (processador) é o cérebro do computador.",
          "A RAM esquece ao desligar; o SSD e o HD guardam para sempre.",
          "1 byte tem 8 bits; o computador só entende 0 e 1.",
        ]}
      />
      <Glossary
        items={[
          ["Hardware", "As peças físicas do computador."],
          ["Software", "Os programas do computador."],
          ["CPU", "O processador, o cérebro do computador."],
          ["RAM", "A memória rápida que guarda o que está aberto agora."],
          ["Bit", "A menor informação do computador: 0 ou 1."],
        ]}
      />
      <Quiz
        items={[
          ["O mouse é hardware ou software?", "Hardware."],
          ["O monitor é um aparelho de entrada ou de saída?", "De saída."],
          ["O que acontece com a memória RAM quando o computador desliga?", "Ela apaga tudo."],
          ["Quantos bits tem um byte?", "Oito."],
        ]}
      />
    </>,
  ),
];
