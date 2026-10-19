"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";

// ============================================================================
// CAPÍTULO 10 — O SÉCULO XX (missões "O Mundo Contemporâneo e o Brasil
// República" e "História Geral: O Século XX"): o Muro de Berlim caindo com
// os fogos, a pomba da paz da ONU, a linha do tempo do século (de tocar),
// as pessoas marchando de mãos dadas pela liberdade e o Congresso Nacional
// em Brasília.
// ============================================================================

/** Uma pessoinha simples (o pé em x, y). */
function Person({ x, y, s = 1, shirt, skin }: { x: number; y: number; s?: number; shirt: string; skin: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-5 0 L-4 -18 M5 0 L4 -18" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
      <rect x="-10" y="-40" width="20" height="24" rx="6" fill={shirt} />
      <circle cy="-50" r="10" fill={skin} />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Abertura: o Muro de Berlim caindo
// ---------------------------------------------------------------------------

function WallOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="O Muro de Berlim sendo derrubado em 1989: pedaços do muro caindo, pessoas atravessando e comemorando e fogos de artifício no céu da noite">
      <rect width="460" height="300" fill="#1e1b4b" />
      {/* os fogos */}
      {[
        { x: 90, y: 70, c: "#f472b6" },
        { x: 230, y: 50, c: "#fde047" },
        { x: 370, y: 80, c: "#4ade80" },
      ].map((f, i) => (
        <g key={i} transform={`translate(${f.x} ${f.y})`}>
          {Array.from({ length: 10 }, (_, k) => (
            <line key={k} x1="0" y1="0" x2="0" y2="-30" stroke={f.c} strokeWidth="3" strokeLinecap="round" transform={`rotate(${k * 36})`}>
              <animate attributeName="y2" values="0;-30;-34" dur="1.6s" begin={`${-i * 0.5}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;1;0" dur="1.6s" begin={`${-i * 0.5}s`} repeatCount="indefinite" />
            </line>
          ))}
        </g>
      ))}
      <rect y="240" width="460" height="60" fill="#475569" />
      {/* o muro com o buraco no meio */}
      <rect x="0" y="150" width="180" height="90" fill="#d6d3d1" stroke="#78716c" />
      <rect x="280" y="150" width="180" height="90" fill="#d6d3d1" stroke="#78716c" />
      {[20, 70, 120, 320, 380].map((x, i) => (
        <text key={x} x={x} y={190 + (i % 2) * 24} fontSize="14" fontWeight="900" fill={["#dc2626", "#2563eb", "#16a34a", "#9333ea", "#ea580c"][i]} fontFamily="Georgia, serif">
          {["paz", "♥", "livre!", "1989", "♥"][i]}
        </text>
      ))}
      {/* os pedaços caindo */}
      {[0, 1, 2].map((k) => (
        <rect key={k} x={190 + k * 30} y="150" width="24" height="20" fill="#d6d3d1" stroke="#78716c">
          <animate attributeName="y" values="150;232" dur="1.8s" begin={`${-k * 0.6}s`} repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="rotate" values={`0 ${202 + k * 30} 160;40 ${202 + k * 30} 200`} dur="1.8s" begin={`${-k * 0.6}s`} repeatCount="indefinite" />
        </rect>
      ))}
      {/* as pessoas atravessando */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="-60 0;140 0" dur="5s" repeatCount="indefinite" />
        <Person x={170} y={276} s={1.1} shirt="#dc2626" skin="#f1c9a5" />
        <Person x={200} y={276} s={1.1} shirt="#2563eb" skin="#d6a77a" />
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A pomba da paz e a ONU
// ---------------------------------------------------------------------------

function DoveArt() {
  return (
    <Art viewBox="0 0 560 190" label="Uma pomba branca com um ramo de oliveira voando em cima de um globo cercado por folhas de oliveira, o símbolo da ONU, criada em 1945">
      <rect width="560" height="190" rx="14" fill="#e0f2fe" />
      <g transform="translate(140 100)">
        <circle r="56" fill="none" stroke="#0284c7" strokeWidth="3" />
        <path d="M-56 0 L56 0 M0 -56 L0 56" stroke="#0284c7" strokeWidth="2" />
        <ellipse rx="28" ry="56" fill="none" stroke="#0284c7" strokeWidth="2" />
        {[-1, 1].map((side) => (
          <path key={side} d={`M${side * 62} 50 Q${side * 80} 0 ${side * 50} -50`} stroke="#16a34a" strokeWidth="6" fill="none" strokeDasharray="10 4" />
        ))}
      </g>
      <g>
        <animateMotion path="M300 120 Q380 40 460 90 Q520 130 470 70 Q420 20 300 120" dur="7s" repeatCount="indefinite" />
        <ellipse rx="22" ry="12" fill="#fff" stroke="#94a3b8" />
        <circle cx="20" cy="-8" r="8" fill="#fff" stroke="#94a3b8" />
        <path d="M27 -8 L36 -6 L27 -4 Z" fill="#f59e0b" />
        <path d="M-4 -6 Q-10 -36 14 -24" fill="#fff" stroke="#94a3b8">
          <animate attributeName="d" values="M-4 -6 Q-10 -36 14 -24;M-4 -6 Q-10 10 14 4;M-4 -6 Q-10 -36 14 -24" dur="0.6s" repeatCount="indefinite" />
        </path>
        <path d="M34 -4 L46 4" stroke="#16a34a" strokeWidth="3" />
        <ellipse cx="44" cy="0" rx="5" ry="2.5" fill="#22c55e" />
      </g>
      <text x="140" y="180" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#075985" fontFamily="Georgia, serif">
        ONU, 1945
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A linha do tempo do século XX (de tocar)
// ---------------------------------------------------------------------------

const CENTURY = [
  { year: "1914", name: "Primeira Guerra Mundial", color: "#78716c", text: "Começou depois do assassinato do herdeiro do trono da Áustria-Hungria e durou até 1918." },
  { year: "1917", name: "Revolução Russa", color: "#dc2626", text: "Os bolcheviques, liderados por Lênin, tomaram o poder. Em 1922 nasceu a União Soviética (URSS)." },
  { year: "1939", name: "Segunda Guerra Mundial", color: "#475569", text: "O conflito mais mortal da história (até 1945). O Brasil enviou soldados, os pracinhas da FEB, para lutar na Itália." },
  { year: "1945", name: "Nasce a ONU", color: "#0284c7", text: "Depois da guerra, os países criaram a Organização das Nações Unidas para tentar manter a paz." },
  { year: "1961", name: "Muro de Berlim", color: "#7c3aed", text: "Na Guerra Fria, entre os Estados Unidos e a União Soviética, um muro dividiu a cidade de Berlim." },
  { year: "1989", name: "Queda do Muro", color: "#16a34a", text: "O muro caiu, a Alemanha se reunificou e, em 1991, a União Soviética deixou de existir." },
];

export function CenturyTimeline() {
  const [sel, setSel] = useState(0);
  const e = CENTURY[sel];
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <div className="relative flex justify-between">
        <div className="absolute left-[5%] right-[5%] top-[0.95em] h-[3px] bg-[#d9c79d]" />
        {CENTURY.map((x, i) => (
          <button key={x.year} type="button" onClick={() => setSel(i)} className="relative flex flex-col items-center" title={x.name}>
            <span
              className={`flex h-[1.9em] w-[1.9em] items-center justify-center rounded-full border-2 text-[0.62em] font-black text-white transition-transform ${sel === i ? "scale-125" : ""}`}
              style={{ background: x.color, borderColor: sel === i ? "#1e293b" : "#fff" }}
            >
              {x.year.slice(2)}
            </span>
            <span className="mt-[0.2em] text-[0.62em] font-bold text-[#5b4a2e]">{x.year}</span>
          </button>
        ))}
      </div>
      <div key={sel} className="cg-anim-fade mt-[0.5em] rounded-lg px-[0.7em] py-[0.4em]" style={{ background: `${e.color}14`, borderLeft: `5px solid ${e.color}` }}>
        <p className="cg-book-title font-black" style={{ color: e.color }}>
          {e.year} · {e.name}
        </p>
        <p className="text-[0.88em] leading-[1.45] text-[#2b2113]">{e.text}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// As pessoas marchando pela liberdade
// ---------------------------------------------------------------------------

function MarchArt() {
  const people = [
    { shirt: "#f59e0b", skin: "#8d5524" },
    { shirt: "#16a34a", skin: "#5c3a1e" },
    { shirt: "#fff", skin: "#c68642" },
    { shirt: "#dc2626", skin: "#8d5524" },
    { shirt: "#2563eb", skin: "#f1c9a5" },
    { shirt: "#7c3aed", skin: "#5c3a1e" },
  ];
  return (
    <Art viewBox="0 0 560 190" label="Pessoas de mãos dadas marchando juntas pela igualdade e pela liberdade, com o Sol nascendo atrás">
      <rect width="560" height="190" rx="14" fill="#fef3c7" />
      <circle cx="280" cy="150" r="80" fill="#fde047" opacity="0.6" />
      <rect y="150" width="560" height="40" fill="#d6a77a" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="-40 0;40 0;-40 0" dur="8s" repeatCount="indefinite" />
        {people.map((p, i) => (
          <g key={i}>
            <g>
              <animateTransform attributeName="transform" type="translate" values="0 0;0 -4;0 0" dur="0.7s" begin={`${-i * 0.12}s`} repeatCount="indefinite" />
              <Person x={130 + i * 60} y={156} s={1.3} shirt={p.shirt} skin={p.skin} />
              {i < people.length - 1 && <path d={`M${143 + i * 60} 124 L${177 + i * 60} 124`} stroke={p.skin} strokeWidth="5" strokeLinecap="round" />}
            </g>
          </g>
        ))}
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O Congresso Nacional em Brasília
// ---------------------------------------------------------------------------

function BrasiliaArt() {
  return (
    <Art viewBox="0 0 560 190" label="O Congresso Nacional em Brasília, com as duas torres no meio, uma cúpula virada para cima e outra virada para baixo">
      <rect width="560" height="190" rx="14" fill="#bae6fd" />
      <rect y="140" width="560" height="50" fill="#86efac" />
      <rect x="90" y="128" width="380" height="14" fill="#f8fafc" stroke="#94a3b8" />
      {/* as duas torres */}
      <rect x="262" y="30" width="16" height="98" fill="#e2e8f0" stroke="#94a3b8" />
      <rect x="282" y="30" width="16" height="98" fill="#e2e8f0" stroke="#94a3b8" />
      <rect x="262" y="70" width="36" height="6" fill="#cbd5e1" />
      {/* a Câmara é a “tigela” virada para cima; o Senado, a cúpula virada para baixo */}
      <path d="M150 104 L230 104 Q220 128 190 128 Q160 128 150 104 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
      <path d="M340 128 Q370 96 400 128 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
      <g fontFamily="Georgia, serif" fontSize="11" fontWeight="900" fill="#0c4a6e" textAnchor="middle">
        <text x="190" y="160">Câmara</text>
        <text x="370" y="160">Senado</text>
      </g>
      <text x="280" y="22" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#075985" fontFamily="Georgia, serif">
        Brasília, inaugurada em 1960
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 10, content, bare });

export const chapter10: BookPage[] = [
  page(
    <ChapterOpener
      n={10}
      title="O Século XX"
      goals={["As duas guerras mundiais e a criação da ONU", "A Guerra Fria e o Muro de Berlim", "Gandhi, Mandela e a luta pela liberdade", "O Brasil República: Vargas, JK e a Constituição de 1988"]}
    >
      <Fig h={34}>
        <WallOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🕊️">As guerras e a busca pela paz</H>
      <P>
        O século XX teve as duas guerras mais terríveis da história: a <T>Primeira Guerra Mundial</T> (1914 a 1918) e a <T>Segunda Guerra Mundial</T> (1939 a 1945). Na
        Segunda Guerra, o regime <T>nazista</T> de Hitler perseguiu e matou cerca de 6 milhões de judeus e outros grupos: o <T>Holocausto</T>.
      </P>
      <Fig n="10.1" caption="A ONU nasceu em 1945 para tentar manter a paz." h={19}>
        <DoveArt />
      </Fig>
      <Box kind="sabia">
        <strong>Anne Frank</strong> era uma menina judia que escreveu um diário enquanto se escondia dos nazistas em Amsterdã. O “Diário de Anne Frank” é um dos livros
        mais lidos do mundo.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🧱">A Guerra Fria</H>
      <P>
        Depois de 1945, os <T>Estados Unidos</T> (capitalistas) e a <T>União Soviética</T> (socialista) disputaram o poder no mundo, sem lutar diretamente entre si: foi a{" "}
        <T>Guerra Fria</T>, com corrida armamentista e até corrida espacial. Toque nos anos:
      </P>
      <CenturyTimeline />
      <Box kind="atencao">
        Em agosto de 1945, os Estados Unidos lançaram bombas atômicas sobre <strong>Hiroshima e Nagasaki</strong>, no Japão. Foram as únicas vezes em que essas armas
        foram usadas numa guerra.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="✊">A luta pela liberdade</H>
      <P>
        Em muitos lugares, os povos lutaram por independência e igualdade. <T>Mahatma Gandhi</T> liderou a independência da Índia (1947) com a resistência pacífica. Na
        África do Sul, o <T>apartheid</T> separava as pessoas pela cor da pele.
      </P>
      <Fig n="10.2" caption="De mãos dadas pela igualdade." h={19}>
        <MarchArt />
      </Fig>
      <Cards
        items={[
          { icon: "🕊️", title: "Gandhi", text: "Mostrou que dá para lutar sem violência. A Índia ficou independente do Reino Unido em 1947." },
          { icon: "✊", title: "Nelson Mandela", text: "Ficou 27 anos preso por lutar contra o apartheid. Ganhou o Nobel da Paz e, em 1994, virou o primeiro presidente negro da África do Sul." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🏛️">O Brasil República</H>
      <Table
        head={["Período", "O que aconteceu"]}
        rows={[
          ["1930 a 1945", "Getúlio Vargas governa; no Estado Novo cria a CLT (1943), com férias e salário mínimo"],
          ["1956 a 1961", "Juscelino Kubitschek (JK) promete “50 anos em 5” e constrói Brasília, inaugurada em 1960"],
          ["1964 a 1985", "Ditadura militar: sem eleições diretas para presidente e com censura"],
          ["1988", "A nova Constituição, a “Constituição Cidadã”, garante direitos e o voto"],
        ]}
      />
      <Fig n="10.3" caption="Brasília foi projetada por Lúcio Costa e Oscar Niemeyer." h={18}>
        <BrasiliaArt />
      </Fig>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Primeira Guerra (1914 a 1918) e Segunda Guerra (1939 a 1945); o Holocausto matou cerca de 6 milhões de judeus.",
          "A ONU nasceu em 1945 para tentar manter a paz.",
          "Na Guerra Fria, EUA e URSS disputaram o mundo; o Muro de Berlim caiu em 1989 e a URSS acabou em 1991.",
          "Gandhi liderou a independência da Índia; Mandela venceu o apartheid na África do Sul.",
          "No Brasil: Vargas e a CLT, JK e Brasília, a ditadura (1964 a 1985) e a Constituição de 1988.",
        ]}
      />
      <Glossary
        items={[
          ["Guerra Fria", "A disputa entre EUA e URSS, sem guerra direta entre eles."],
          ["Holocausto", "O genocídio dos judeus pelo regime nazista."],
          ["Apartheid", "A separação oficial das pessoas pela cor na África do Sul."],
          ["Ditadura", "Governo que não respeita a liberdade nem as eleições livres."],
          ["Constituição", "A lei mais importante de um país."],
        ]}
      />
      <Quiz
        items={[
          ["Em que período foi a Segunda Guerra Mundial?", "De 1939 a 1945."],
          ["Qual muro, símbolo da Guerra Fria, caiu em 1989?", "O Muro de Berlim."],
          ["Quem foi Nelson Mandela?", "O líder contra o apartheid que virou o primeiro presidente negro da África do Sul."],
          ["Qual presidente construiu Brasília?", "Juscelino Kubitschek (JK)."],
        ]}
      />
    </>,
  ),
];
