"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Ball, Bubbles, Diatomic, Water } from "./art";

// ============================================================================
// CAPÍTULO 5 — REAÇÕES QUÍMICAS (missão "Química: Reações Químicas"): o
// vulcão de bicarbonato espumando, rasgar × queimar o papel, os átomos se
// rearrumando na reação do hidrogênio com o oxigênio (nenhum some, como disse
// Lavoisier), o balanceador de tocar e o triângulo do fogo.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o vulcão de bicarbonato com vinagre
// ---------------------------------------------------------------------------

function VolcanoArt() {
  return (
    <Art viewBox="0 0 460 300" label="Um vulcão de feira de ciências soltando espuma: bicarbonato com vinagre fazendo uma reação química">
      <rect x="0" y="250" width="460" height="50" fill="#a16207" />
      <path d="M90 250 L190 110 L270 110 L370 250 Z" fill="#92400e" stroke="#451a03" strokeWidth="3" />
      <path d="M150 170 C180 160 200 180 230 168 C260 156 280 176 310 170" stroke="#78350f" strokeWidth="4" fill="none" opacity="0.6" />
      {/* a espuma subindo e escorrendo */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 30;0 0;0 0;0 30" keyTimes="0;0.25;0.85;1" dur="5s" repeatCount="indefinite" />
        <path d="M188 112 C170 80 200 60 214 74 C220 50 250 52 252 74 C266 58 292 76 272 112 Z" fill="#fef9c3" stroke="#facc15" strokeWidth="3" />
        {[200, 220, 240, 258].map((x, i) => (
          <circle key={x} cx={x} cy={80 + (i % 2) * 10} r={6 + (i % 3) * 2} fill="#fff" stroke="#fde047" strokeWidth="1.5" className="cg-anim-twinkle" style={{ animationDelay: `${i * 0.3}s` }} />
        ))}
      </g>
      {[
        ["M196 112 C180 150 170 190 160 236", 0],
        ["M262 112 C280 150 292 190 300 236", 1.2],
      ].map(([d, delay], i) => (
        <path key={i} d={d as string} stroke="#fef08a" strokeWidth="14" fill="none" strokeLinecap="round" strokeDasharray="200" strokeDashoffset="200">
          <animate attributeName="stroke-dashoffset" values="200;0;0;200" keyTimes="0;0.4;0.85;1" dur="5s" begin={`${-(delay as number)}s`} repeatCount="indefinite" />
        </path>
      ))}
      <Bubbles x0={200} x1={262} bottom={110} top={30} n={6} color="#facc15" />
      {/* o bicarbonato e o vinagre */}
      <g transform="translate(400 200)">
        <path d="M-16 -50 L16 -50 L18 40 L-18 40 Z" fill="#fef3c7" stroke="#a16207" strokeWidth="2" />
        <text y="0" textAnchor="middle" fontSize="10" fontWeight="900" fill="#92400e" fontFamily="Georgia, serif">
          vinagre
        </text>
      </g>
      <g transform="translate(50 220)">
        <rect x="-26" y="-30" width="52" height="56" rx="6" fill="#e0f2fe" stroke="#0369a1" strokeWidth="2" />
        <text y="2" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#075985" fontFamily="Georgia, serif">
          bicarbonato
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Rasgar (física) × queimar (química)
// ---------------------------------------------------------------------------

function PhysicalChemicalArt() {
  const loop = { dur: "4s", repeatCount: "indefinite" };
  return (
    <Art viewBox="0 0 540 200" label="Rasgar o papel é uma transformação física; queimar o papel é uma transformação química, que forma cinzas e fumaça">
      <rect x="4" y="4" width="262" height="192" rx="14" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="2" />
      <rect x="274" y="4" width="262" height="192" rx="14" fill="#fff7ed" stroke="#fed7aa" strokeWidth="2" />
      {/* rasgando */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <animateTransform attributeName="transform" type="translate" values={`0 0;${s * 22} 0;${s * 22} 0;0 0`} keyTimes="0;0.3;0.8;1" {...loop} />
          <path d={s < 0 ? "M70 50 L134 50 L128 80 L138 110 L130 150 L70 150 Z" : "M134 50 L200 50 L200 150 L130 150 L138 110 L128 80 Z"} fill="#fff" stroke="#94a3b8" strokeWidth="2" />
          {[70, 90, 110, 130].map((y) => (
            <path key={y} d={s < 0 ? `M80 ${y} L122 ${y}` : `M144 ${y} L190 ${y}`} stroke="#cbd5e1" strokeWidth="2" />
          ))}
        </g>
      ))}
      <text x="135" y="178" textAnchor="middle" fontSize="13.5" fontWeight="900" fill="#1e40af" fontFamily="Georgia, serif">
        Rasgar: física (continua papel)
      </text>
      {/* queimando */}
      <path d="M350 150 L460 150 L460 112 C440 120 420 100 400 112 C380 124 366 108 350 118 Z" fill="#fff" stroke="#94a3b8" strokeWidth="2" />
      <path d="M350 150 L460 150 L460 140 C430 146 380 138 350 144 Z" fill="#1c1917" opacity="0.8" />
      {[370, 400, 430].map((x, i) => (
        <g key={x} className="cg-anim-flicker" style={{ animationDelay: `${i * 0.2}s` }}>
          <path d={`M${x} 116 C${x + 14} 96 ${x + 8} 76 ${x} 60 C${x - 8} 76 ${x - 14} 96 ${x} 116 Z`} fill="#f97316" />
          <path d={`M${x} 112 C${x + 6} 100 ${x + 4} 90 ${x} 82 C${x - 4} 90 ${x - 6} 100 ${x} 112 Z`} fill="#fde047" />
        </g>
      ))}
      {[380, 420].map((x, i) => (
        <circle key={x} cx={x} cy="50" r="10" fill="#94a3b8" opacity="0.7" className="cg-anim-aura-rise" style={{ "--cg-dur": "2.4s", "--cg-delay": `${i}s` } as React.CSSProperties} />
      ))}
      <text x="405" y="178" textAnchor="middle" fontSize="13.5" fontWeight="900" fill="#c2410c" fontFamily="Georgia, serif">
        Queimar: química (cinza e gases)
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os átomos se rearrumando: 2 H₂ + O₂ → 2 H₂O
// ---------------------------------------------------------------------------

function RearrangeArt() {
  const loop = { dur: "6s", keyTimes: "0;0.25;0.6;0.95;1", repeatCount: "indefinite", calcMode: "linear" as const };
  // [elemento, posição nos reagentes, posição nos produtos]
  const atoms: [string, [number, number], [number, number]][] = [
    ["H", [56, 70], [356, 94]],
    ["H", [80, 70], [396, 94]],
    ["H", [56, 130], [436, 94]],
    ["H", [80, 130], [476, 94]],
    ["O", [168, 90], [376, 70]],
    ["O", [196, 90], [456, 70]],
  ];
  return (
    <Art viewBox="0 0 540 190" label="Dois H₂ e um O₂ se transformam em duas moléculas de água: os átomos só trocam de parceiro, nenhum some">
      {atoms.map(([el, [x1, y1], [x2, y2]], i) => (
        <g key={i}>
          <animateMotion values={`${x1},${y1};${x1},${y1};${x2},${y2};${x2},${y2};${x1},${y1}`} {...loop} />
          <Ball el={el} r={el === "H" ? 11 : 15} />
        </g>
      ))}
      <path d="M244 100 L300 100" stroke="#a21caf" strokeWidth="4" />
      <path d="M292 92 L304 100 L292 108" stroke="#a21caf" strokeWidth="4" fill="none" />
      <g fontFamily="Georgia, serif" fontSize="14" fontWeight="900" fill="#3b2a14" textAnchor="middle">
        <text x="68" y="168">2 H₂</text>
        <text x="130" y="104">+</text>
        <text x="182" y="168">O₂</text>
        <text x="416" y="168">2 H₂O</text>
        <text x="130" y="24" fill="#a21caf">reagentes</text>
        <text x="416" y="24" fill="#a21caf">produtos</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O balanceador de tocar: 2 H₂ + O₂ → 2 H₂O
// ---------------------------------------------------------------------------

function Stepper({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className="flex flex-col items-center gap-[0.2em]">
      <div className="flex items-center gap-[0.2em]">
        <button type="button" onClick={() => onChange(Math.max(1, value - 1))} className="h-[1.6em] w-[1.6em] rounded-full border border-[#d9c79d] bg-white font-black text-[#701a75] hover:bg-[#fdf4ff]" aria-label={`Diminuir ${label}`}>
          −
        </button>
        <span className="min-w-[1.2em] text-center font-mono text-[1.3em] font-black text-[#701a75]">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(4, value + 1))} className="h-[1.6em] w-[1.6em] rounded-full border border-[#d9c79d] bg-white font-black text-[#701a75] hover:bg-[#fdf4ff]" aria-label={`Aumentar ${label}`}>
          +
        </button>
      </div>
      <span className="font-mono text-[1.05em] font-black text-[#3b2a14]">{label}</span>
    </div>
  );
}

export function EquationBalancer() {
  const [h2, setH2] = useState(1);
  const [o2, setO2] = useState(1);
  const [w, setW] = useState(1);
  const left = { H: h2 * 2, O: o2 * 2 };
  const right = { H: w * 2, O: w };
  const ok = left.H === right.H && left.O === right.O;
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <div className="flex flex-wrap items-end justify-center gap-[0.7em]">
        <Stepper value={h2} onChange={setH2} label="H₂" />
        <span className="pb-[0.2em] text-[1.3em] font-black">+</span>
        <Stepper value={o2} onChange={setO2} label="O₂" />
        <span className="pb-[0.2em] text-[1.3em] font-black">→</span>
        <Stepper value={w} onChange={setW} label="H₂O" />
      </div>
      <svg viewBox="0 0 520 80" className="mt-[0.3em] block w-full" aria-hidden="true">
        {Array.from({ length: h2 }, (_, i) => (
          <Diatomic key={`h${i}`} el="H" x={30 + i * 34} y={40} s={0.8} />
        ))}
        {Array.from({ length: o2 }, (_, i) => (
          <Diatomic key={`o${i}`} el="O" x={190 + i * 40} y={40} s={0.75} />
        ))}
        {Array.from({ length: w }, (_, i) => (
          <Water key={`w${i}`} x={350 + i * 44} y={36} s={0.62} />
        ))}
      </svg>
      <div className="mt-[0.3em] grid grid-cols-3 gap-[0.3em] text-center text-[0.86em]">
        <span className="font-bold text-[#6b5a3a]">Átomo</span>
        <span className="font-bold text-[#6b5a3a]">Reagentes</span>
        <span className="font-bold text-[#6b5a3a]">Produtos</span>
        {(["H", "O"] as const).map((el) => (
          <div key={el} className="contents">
            <span className="font-black">{el}</span>
            <span className={left[el] === right[el] ? "font-bold text-[#15803d]" : "font-bold text-[#b91c1c]"}>{left[el]}</span>
            <span className={left[el] === right[el] ? "font-bold text-[#15803d]" : "font-bold text-[#b91c1c]"}>{right[el]}</span>
          </div>
        ))}
      </div>
      <p className={`mt-[0.4em] rounded-lg px-[0.6em] py-[0.25em] text-center text-[0.9em] font-black ${ok ? "cg-anim-pop bg-[#dcfce7] text-[#15803d]" : "bg-[#fee2e2] text-[#b91c1c]"}`}>
        {ok ? "✓ Balanceada! O mesmo número de átomos dos dois lados." : "Ainda não está balanceada: conte os átomos de cada lado."}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// O triângulo do fogo
// ---------------------------------------------------------------------------

function FireTriangleArt() {
  return (
    <Art viewBox="0 0 540 220" label="O triângulo do fogo: combustível, oxigênio e calor. Tirando um dos três, o fogo apaga">
      <path d="M270 20 L410 196 L130 196 Z" fill="#fff7ed" stroke="#ea580c" strokeWidth="5" strokeLinejoin="round" />
      <g transform="translate(270 150)">
        <g className="cg-anim-flicker">
          <path d="M0 -84 C30 -50 30 -14 0 0 C-30 -14 -30 -50 0 -84 Z" fill="#ef4444" />
          <path d="M0 -60 C18 -38 18 -12 0 -4 C-18 -12 -18 -38 0 -60 Z" fill="#f97316" />
          <path d="M0 -38 C8 -26 8 -10 0 -6 C-8 -10 -8 -26 0 -38 Z" fill="#fde047" />
        </g>
      </g>
      <g fontFamily="Georgia, serif" fontSize="15" fontWeight="900" textAnchor="middle">
        <text x="270" y="14" fill="#c2410c">calor</text>
        <text x="96" y="214" fill="#92400e" textAnchor="start">combustível</text>
        <text x="420" y="214" fill="#0369a1" textAnchor="middle">oxigênio</text>
      </g>
      <g fontFamily="Georgia, serif" fontSize="12" fill="#5b4a2e">
        <text x="20" y="60">💧 esfriar: tira o calor</text>
        <text x="20" y="84">🧯 abafar: tira o oxigênio</text>
        <text x="380" y="60">✂️ aceiro: tira o</text>
        <text x="380" y="78">combustível</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 5, content, bare });

export const chapter5: BookPage[] = [
  page(
    <ChapterOpener
      n={5}
      title="Reações Químicas"
      goals={["A diferença entre transformação física e química", "Os sinais de que uma reação aconteceu", "A Lei de Lavoisier e como balancear uma equação", "A combustão, a ferrugem e a velocidade das reações"]}
    >
      <Fig h={34}>
        <VolcanoArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="📄">Transformação física ou química?</H>
      <P>
        Numa <T>transformação física</T>, a substância continua a mesma: o papel rasgado ainda é papel, o gelo derretido ainda é água. Numa <T>transformação química</T> (ou{" "}
        <T>reação química</T>), surgem <T>substâncias novas</T>: o papel queimado vira cinza, gás carbônico e vapor de água.
      </P>
      <Fig n="5.1" caption="Rasgar muda só a forma; queimar cria substâncias novas." h={22}>
        <PhysicalChemicalArt />
      </Fig>
      <P>Algumas pistas de que aconteceu uma reação química:</P>
      <Cards
        items={[
          { icon: "💦", title: "Bolhas de gás", text: "O comprimido efervescente na água." },
          { icon: "🎨", title: "Mudança de cor", text: "A maçã cortada ficando marrom." },
          { icon: "👃", title: "Cheiro novo", text: "O leite azedo, a comida estragada." },
          { icon: "🔥", title: "Luz ou calor", text: "A queima da vela e da madeira." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="⚖️">Reagentes, produtos e Lavoisier</H>
      <P>
        Numa reação, as substâncias que reagem são os <T>reagentes</T> e as que se formam são os <T>produtos</T>. Na <T>equação química</T>, os reagentes ficam à esquerda da
        seta e os produtos à direita:
      </P>
      <Fig n="5.2" caption="Hidrogênio + oxigênio → água. Os átomos só trocam de parceiro: são os mesmos 4 H e 2 O antes e depois." h={22}>
        <RearrangeArt />
      </Fig>
      <P>
        No século XVIII, o francês <T>Antoine Lavoisier</T> pesou reagentes e produtos com muito cuidado e descobriu a <T>Lei da Conservação das Massas</T>: num sistema
        fechado, a massa antes e depois da reação é a mesma. Ele resumiu assim: &ldquo;Na natureza nada se cria, nada se perde, tudo se transforma&rdquo;.
      </P>
    </>,
  ),

  page(
    <>
      <H icon="🎯">Balanceando equações</H>
      <P>
        Como nenhum átomo some nem aparece, a equação precisa ter o <T>mesmo número de cada átomo dos dois lados</T>. Para isso usamos os <T>coeficientes</T>, os números na
        frente das fórmulas. Tente balancear a formação da água:
      </P>
      <EquationBalancer />
      <Box kind="mago" title="O jeito do Mago">
        Comece pelo átomo que aparece em menos lugares. Aqui: com 1 O₂ (2 oxigênios), você precisa de 2 H₂O. Aí sobram 4 hidrogênios do lado direito, então são 2 H₂. Resposta:{" "}
        <strong>2 H₂ + O₂ → 2 H₂O</strong>.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🔥">Combustão, ferrugem e a velocidade das reações</H>
      <P>
        A <T>combustão</T> (queima) precisa de três coisas ao mesmo tempo: <T>combustível</T>, <T>oxigênio</T> e <T>calor</T>. É o triângulo do fogo:
      </P>
      <Fig n="5.3" caption="O extintor apaga o fogo tirando um lado do triângulo." h={22}>
        <FireTriangleArt />
      </Fig>
      <Cards
        items={[
          { icon: "🔩", title: "Ferrugem", text: "O ferro reage com o oxigênio e a umidade. A tinta impede o contato com o ar." },
          { icon: "❄️", title: "Temperatura", text: "Quanto mais frio, mais lenta a reação: por isso a geladeira conserva os alimentos." },
          { icon: "⚡", title: "Catalisador", text: "Acelera a reação sem ser gasto. As enzimas do corpo são catalisadores." },
          { icon: "🌡️", title: "Exo e endo", text: "Exotérmica libera calor (a queima); endotérmica absorve (a bolsa de gelo instantâneo)." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Transformação química forma substâncias novas; a física não.",
          "Sinais de reação: bolhas, cor nova, cheiro, precipitado, luz ou calor.",
          "Reagentes → produtos. Lavoisier: a massa se conserva, os átomos só se rearrumam.",
          "Balancear é igualar o número de cada átomo dos dois lados: 2 H₂ + O₂ → 2 H₂O.",
          "Combustão: combustível + oxigênio + calor. Catalisador e calor aceleram as reações.",
        ]}
      />
      <Glossary
        items={[
          ["Reagente", "Substância que reage (fica antes da seta)."],
          ["Produto", "Substância formada (fica depois da seta)."],
          ["Coeficiente", "O número na frente da fórmula, usado para balancear."],
          ["Catalisador", "Substância que acelera a reação sem ser consumida."],
          ["Exotérmica", "Reação que libera calor."],
        ]}
      />
      <Quiz
        items={[
          ["Queimar a madeira é transformação física ou química?", "Química: formam-se substâncias novas (cinzas, gás carbônico, água)."],
          ["O que diz a Lei de Lavoisier?", "Na natureza nada se cria, nada se perde, tudo se transforma: a massa se conserva."],
          ["Qual é o coeficiente que falta: 2 H₂ + O₂ → __ H₂O?", "2."],
          ["Quais são os três lados do triângulo do fogo?", "Combustível, oxigênio e calor."],
        ]}
      />
    </>,
  ),
];
