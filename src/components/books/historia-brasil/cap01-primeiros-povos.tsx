"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Kid, Tree } from "../ods/art";
import { HB, HB_DARK, Oca, Panel } from "./art";

// ============================================================================
// CAPÍTULO 1 — OS PRIMEIROS POVOS (missão "História do Brasil: Os Primeiros
// Povos e a Colonização", a parte dos povos indígenas): a aldeia com a fumaça
// da fogueira e a canoa no rio, o sambaqui, o vaso marajoara, as cartas das
// palavras de origem tupi (de tocar) e os povos indígenas de hoje.
// ============================================================================

const SKIN = "#a16207";

// ---------------------------------------------------------------------------
// Abertura: a aldeia
// ---------------------------------------------------------------------------

function VillageOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma aldeia indígena com ocas em volta de um pátio, uma fogueira soltando fumaça, crianças brincando e uma canoa descendo o rio">
      <rect width="460" height="300" fill="#bbf7d0" />
      <rect width="460" height="110" fill="#bae6fd" />
      {Array.from({ length: 8 }, (_, i) => (
        <Tree key={i} x={20 + i * 60} y={120} s={0.9 + (i % 2) * 0.2} color={i % 2 ? "#166534" : "#15803d"} />
      ))}
      <ellipse cx="230" cy="200" rx="170" ry="50" fill="#e7c873" />
      <Oca x={110} y={200} s={0.9} />
      <Oca x={350} y={200} s={0.9} />
      <Oca x={230} y={170} s={0.7} />
      <g transform="translate(230 222)">
        <path d="M-12 6 L12 6 M-10 10 L10 2" stroke="#78350f" strokeWidth="4" />
        <path d="M-8 4 Q0 -18 8 4 Z" fill="#f97316">
          <animate attributeName="d" values="M-8 4 Q0 -18 8 4 Z;M-8 4 Q2 -24 8 4 Z;M-8 4 Q0 -18 8 4 Z" dur="0.6s" repeatCount="indefinite" />
        </path>
        {[0, 1, 2].map((k) => (
          <circle key={k} cx="0" r="8" fill="#a8a29e" opacity="0.6">
            <animate attributeName="cy" values="-10;-90" dur="3s" begin={`${-k}s`} repeatCount="indefinite" />
            <animate attributeName="r" values="5;18" dur="3s" begin={`${-k}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0" dur="3s" begin={`${-k}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </g>
      {[170, 290].map((x, i) => (
        <g key={x} transform={`translate(${x} 236)`}>
          <g>
            <animateTransform attributeName="transform" type="translate" values="0 0;0 -8;0 0" dur="0.8s" begin={`${-i * 0.4}s`} repeatCount="indefinite" />
            <Kid x={0} y={0} s={0.8} shirt="#dc2626" skin={SKIN} hair="#1e293b" />
          </g>
        </g>
      ))}
      <path d="M0 280 Q230 250 460 285 L460 300 L0 300 Z" fill="#0ea5e9" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="-80 0;520 0" dur="12s" repeatCount="indefinite" />
        <path d="M0 278 Q30 288 60 278 L54 284 Q30 292 6 284 Z" fill="#78350f" />
        <Kid x={30} y={280} s={0.5} shirt="#ca8a04" skin={SKIN} hair="#1e293b" />
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O sambaqui e o vaso marajoara
// ---------------------------------------------------------------------------

function SambaquiArt() {
  return (
    <Art viewBox="0 0 560 190" label="À esquerda, um sambaqui: um morro feito de conchas no litoral, com camadas; à direita, um vaso de cerâmica marajoara com desenhos geométricos vermelhos e pretos">
      <rect width="560" height="190" rx="14" fill="#fffaf0" />
      <rect x="10" y="150" width="280" height="30" fill="#0ea5e9" />
      <path d="M30 150 Q150 30 270 150 Z" fill="#e7e5e4" stroke="#a8a29e" strokeWidth="2" />
      {[60, 90, 120].map((y, i) => (
        <path key={y} d={`M${60 + i * 12} ${y + 30} Q150 ${y - 10} ${240 - i * 12} ${y + 30}`} fill="none" stroke="#d6d3d1" strokeWidth="2" />
      ))}
      {Array.from({ length: 14 }, (_, i) => (
        <path key={i} d="M0 0 q4 -6 8 0 q-4 3 -8 0" fill="#fff" stroke="#a8a29e" transform={`translate(${70 + (i * 37) % 150} ${80 + (i * 19) % 60})`} />
      ))}
      <text x="150" y="176" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff" fontFamily="Georgia, serif">
        sambaqui: um morro de conchas
      </text>
      <g transform="translate(420 100)">
        <path d="M-40 -60 Q-60 -20 -44 30 Q0 60 44 30 Q60 -20 40 -60 Z" fill="#fde68a" stroke="#78350f" strokeWidth="2" />
        <path d="M-40 -60 L40 -60" stroke="#78350f" strokeWidth="4" />
        {[-34, -6, 22].map((y) => (
          <path key={y} d={`M-46 ${y} L-24 ${y - 10} L0 ${y} L24 ${y - 10} L46 ${y}`} fill="none" stroke="#b91c1c" strokeWidth="4" />
        ))}
        {[-20, 8].map((y) => (
          <path key={y} d={`M-40 ${y} h80`} stroke="#1e293b" strokeWidth="2" strokeDasharray="6 4">
            <animate attributeName="stroke-dashoffset" values="0;20" dur="2s" repeatCount="indefinite" />
          </path>
        ))}
        <circle cx="-14" cy="-44" r="4" fill="#1e293b" />
        <circle cx="14" cy="-44" r="4" fill="#1e293b" />
      </g>
      <text x="420" y="182" textAnchor="middle" fontSize="13" fontWeight="900" fill={HB_DARK} fontFamily="Georgia, serif">
        cerâmica marajoara
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As palavras de origem tupi (de tocar)
// ---------------------------------------------------------------------------

const TUPI = [
  ["🍍", "abacaxi", "fruta cheirosa"],
  ["🍿", "pipoca", "pele estourada"],
  ["🐢", "jabuti", "o que não bebe"],
  ["🌊", "Paraná", "parecido com o mar"],
  ["🥔", "mandioca", "a casa de Mani"],
  ["🐹", "capivara", "comedor de capim"],
  ["🏖️", "Ipanema", "água ruim (para pescar)"],
  ["🍎", "caju", "fruta que se produz"],
] as const;

export function TupiCards() {
  const [open, setOpen] = useState<boolean[]>(() => TUPI.map(() => false));
  return (
    <Panel title="Vire as cartas: o que a palavra queria dizer em tupi?">
      <div className="grid grid-cols-4 gap-[0.35em]">
        {TUPI.map(([icon, word, meaning], i) => (
          <button
            key={word}
            type="button"
            onClick={() => setOpen((o) => o.map((v, j) => (j === i ? !v : v)))}
            className="flex min-h-[4.2em] flex-col items-center justify-center rounded-lg border px-[0.2em] py-[0.3em] text-center leading-tight transition-colors"
            style={open[i] ? { background: HB, borderColor: HB, color: "#fff" } : { background: "#fff", borderColor: "#d9c79d", color: "#3b2a14" }}
          >
            {open[i] ? (
              <span className="cg-anim-fade text-[0.74em] font-bold">“{meaning}”</span>
            ) : (
              <>
                <span className="text-[1.3em]">{icon}</span>
                <span className="text-[0.8em] font-black">{word}</span>
              </>
            )}
          </button>
        ))}
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 1, content, bare });

export const chapter1: BookPage[] = [
  page(
    <ChapterOpener n={1} title="Os Primeiros Povos" goals={["Quem vivia aqui antes de 1500", "Os sambaquis, Luzia e a cerâmica marajoara", "O modo de vida nas aldeias", "As palavras tupi e os povos indígenas de hoje"]}>
      <Fig h={34}>
        <VillageOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🏹">Antes de 1500</H>
      <P>
        Quando os portugueses chegaram, milhões de pessoas já viviam aqui havia milhares de anos, divididas em centenas de <T>povos indígenas</T>, cada um com sua
        língua e seus costumes. Os principais troncos de línguas eram o <T>Tupi</T> e o <T>Macro-Jê</T>.
      </P>
      <Fig n="1.1" caption="Os sambaquis do litoral e a cerâmica da Ilha de Marajó." h={22}>
        <SambaquiArt />
      </Fig>
      <Box kind="sabia">
        <strong>Luzia</strong>, encontrada em Lagoa Santa (MG), é um dos esqueletos mais antigos das Américas: viveu há cerca de 11.500 anos.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🏡">A vida na aldeia</H>
      <P>
        Muitos povos viviam em <T>aldeias</T> de ocas em volta de um pátio. Plantavam <T>mandioca</T>, milho e batata-doce em roças abertas na mata, e também caçavam,
        pescavam e coletavam frutos. A terra era de uso de todos, e não de um dono só.
      </P>
      <Cards
        items={[
          { icon: "🔥", title: "Coivara", text: "Cortar e queimar um pedaço pequeno de mata para plantar, e depois deixar a floresta voltar." },
          { icon: "🌿", title: "Pajé", text: "O líder espiritual, que conhecia as plantas que curam." },
          { icon: "🧺", title: "Tarefas", text: "Divididas por idade e por gênero: caçar, plantar, fazer cestos e cerâmica." },
          { icon: "🗣️", title: "Tradição oral", text: "Os mais velhos ensinavam as histórias e os saberes contando." },
        ]}
      />
      <Box kind="lembre">
        A rede de dormir, a farinha de mandioca, o guaraná e o hábito do banho diário são heranças indígenas na vida de todos os brasileiros.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🗣️">Palavras que vieram do tupi</H>
      <P>
        O português falado no Brasil tem milhares de palavras de origem indígena: nomes de frutas, de animais, de rios, de cidades e de comidas. Vire as cartas:
      </P>
      <TupiCards />
      <Box kind="experimente">
        Procure no mapa nomes de lugares que começam com <strong>Ita</strong> (pedra), como Itaquera e Itajaí, ou que têm <strong>pará</strong> (rio, mar), como Pará e
        Paraíba.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🌎">Os povos indígenas hoje</H>
      <P>
        Com a colonização, a população indígena caiu muito por causa das guerras, da escravização e de doenças trazidas da Europa. Mas os povos indígenas resistiram: o
        Censo de 2022 contou cerca de <T>1,7 milhão</T> de indígenas no Brasil, de <T>305 povos</T>, falando <T>274 línguas</T>.
      </P>
      <Table
        head={["Povo", "Onde vive (principalmente)"]}
        rows={[
          ["Guarani", "Mato Grosso do Sul, Sul e Sudeste"],
          ["Ticuna", "Amazonas, perto do Rio Solimões"],
          ["Kaingang", "Os três estados do Sul e São Paulo"],
          ["Yanomami", "Roraima e Amazonas, na fronteira com a Venezuela"],
          ["Pataxó", "Sul da Bahia e Minas Gerais"],
        ]}
      />
      <Box kind="lembre">
        A Constituição de 1988 garante aos povos indígenas o direito às suas terras, línguas e culturas. O <strong>19 de abril</strong> é o Dia dos Povos Indígenas.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Antes de 1500, milhões de indígenas de centenas de povos viviam aqui.",
          "Os principais troncos de línguas eram o Tupi e o Macro-Jê.",
          "Sambaquis, a cerâmica marajoara e Luzia mostram como essa história é antiga.",
          "Mandioca, rede, guaraná e muitas palavras vieram dos indígenas.",
          "Hoje são cerca de 1,7 milhão de indígenas, de 305 povos e 274 línguas.",
        ]}
      />
      <Glossary
        items={[
          ["Povo indígena", "Povo que já vivia na terra antes da chegada dos europeus."],
          ["Sambaqui", "Morro de conchas e restos deixado por povos antigos do litoral."],
          ["Oca", "Casa indígena feita de madeira e palha."],
          ["Pajé", "O líder espiritual e curandeiro."],
          ["Terra indígena", "Área garantida por lei para um povo indígena viver."],
        ]}
      />
      <Quiz
        items={[
          ["Quais eram os dois principais troncos de línguas indígenas?", "O Tupi e o Macro-Jê."],
          ["O que é um sambaqui?", "Um morro de conchas deixado por povos antigos do litoral."],
          ["Cite duas palavras de origem tupi.", "Por exemplo: abacaxi, pipoca, capivara, mandioca."],
          ["Quantos povos indígenas o Censo de 2022 contou?", "305 povos."],
        ]}
      />
    </>,
  ),
];
