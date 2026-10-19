"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Ball, Beaker, Bubbles, Water } from "./art";

// ============================================================================
// CAPÍTULO 4 — SOLUÇÕES E CONCENTRAÇÃO (missão "Química: Soluções e
// Concentração"): o açúcar dissolvendo no chá, o cristal de sal se
// desmanchando em íons cercados de água, os copos insaturado, saturado e com
// corpo de fundo, o laboratório de concentração de mexer (massa e volume) e
// a diluição do suco.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o açúcar caindo no chá e sumindo
// ---------------------------------------------------------------------------

function TeaOpenerArt() {
  const loop = { dur: "5s", repeatCount: "indefinite" };
  return (
    <Art viewBox="0 0 460 300" label="Cubos de açúcar caindo numa xícara de chá e se dissolvendo enquanto a colher mexe">
      {/* a xícara */}
      <path d="M110 120 L350 120 L330 240 Q326 262 300 262 L160 262 Q134 262 130 240 Z" fill="#fef3c7" stroke="#b45309" strokeWidth="4" />
      <path d="M350 150 C400 150 400 210 340 214" stroke="#b45309" strokeWidth="12" fill="none" />
      <ellipse cx="230" cy="122" rx="118" ry="16" fill="#b45309" opacity="0.9" />
      <ellipse cx="230" cy="276" rx="150" ry="12" fill="#e7d3a8" stroke="#b45309" strokeWidth="2" />
      {/* o vapor */}
      {[190, 230, 270].map((x, i) => (
        <path key={x} d={`M${x} 104 c-10 -12 10 -20 0 -34 c-10 -12 10 -20 0 -34`} stroke="#cbd5e1" strokeWidth="5" fill="none" strokeLinecap="round" className="cg-anim-aura-rise" style={{ "--cg-dur": "3s", "--cg-delay": `${i}s` } as React.CSSProperties} />
      ))}
      {/* os cubos caindo e sumindo */}
      {[0, 1].map((k) => (
        <g key={k}>
          <animateTransform attributeName="transform" type="translate" values={`${k * 40} -60;${k * 40} 110;${k * 40} 110`} keyTimes="0;0.35;1" begin={`${-k * 2.5}s`} {...loop} />
          <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.35;0.5;1" begin={`${-k * 2.5}s`} {...loop} />
          <rect x="190" y="0" width="26" height="26" rx="4" fill="#fff" stroke="#94a3b8" strokeWidth="2" />
          <path d="M194 6 L202 6" stroke="#cbd5e1" strokeWidth="2" />
        </g>
      ))}
      {/* as partículas de açúcar se espalhando */}
      {Array.from({ length: 10 }, (_, i) => (
        <circle key={i} cx={200 + ((i * 23) % 80)} cy={124} r="3" fill="#fff">
          <animate attributeName="opacity" values="0;0;0.9;0" keyTimes="0;0.35;0.5;1" dur="5s" begin={`${-(i % 2) * 2.5}s`} repeatCount="indefinite" />
          <animate attributeName="cx" values={`${215};${150 + ((i * 41) % 160)}`} dur="5s" begin={`${-(i % 2) * 2.5}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* a colher mexendo */}
      <g>
        <animateTransform attributeName="transform" type="rotate" values="-12 300 100;12 300 100;-12 300 100" dur="1.6s" repeatCount="indefinite" />
        <path d="M300 20 L280 130" stroke="#94a3b8" strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="278" cy="138" rx="10" ry="14" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O cristal de sal se desmanchando na água
// ---------------------------------------------------------------------------

function SaltDissolvingArt() {
  const crystal: [number, number, string][] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) crystal.push([100 + c * 24, 70 + r * 24, (r + c) % 2 ? "Cl" : "Na"]);
  return (
    <Art viewBox="0 0 540 220" label="Um cristal de sal (sódio e cloro) na água: os íons se soltam e ficam cercados de moléculas de água">
      <rect x="10" y="10" width="520" height="200" rx="16" fill="#e0f2fe" />
      {crystal.map(([x, y, el], i) => (
        <Ball key={i} el={el} x={x} y={y} r={el === "Na" ? 9 : 11} label={false} />
      ))}
      {/* os íons que se soltaram, cercados de água */}
      {[
        ["Na", 330, 70, 0],
        ["Cl", 430, 130, 1.5],
        ["Na", 360, 170, 3],
      ].map(([el, x, y, d]) => (
        <g key={`${x}`}>
          <animateMotion path={`M${-(x as number) + 200} ${-(y as number) + 100} L0 0`} dur="4.5s" begin={`${-(d as number)}s`} repeatCount="indefinite" />
          <g transform={`translate(${x} ${y})`}>
            <Ball el={el as string} r={el === "Na" ? 10 : 12} label={false} />
            <text y="-14" textAnchor="middle" fontSize="11" fontWeight="900" fill={el === "Na" ? "#7e22ce" : "#15803d"} fontFamily="Georgia, serif">
              {el === "Na" ? "Na⁺" : "Cl⁻"}
            </text>
            {[0, 1, 2, 3].map((k) => {
              const a = (k / 4) * Math.PI * 2 + 0.4;
              return <Water key={k} x={Math.cos(a) * 30} y={Math.sin(a) * 26} s={0.38} label={false} />;
            })}
          </g>
        </g>
      ))}
      <g fontFamily="Georgia, serif" fontSize="12.5" fontWeight="900">
        <text x="136" y="186" textAnchor="middle" fill="#3b2a14">
          cristal de sal (NaCl)
        </text>
        <text x="400" y="34" textAnchor="middle" fill="#075985">
          íons cercados de água
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Insaturada, saturada e com corpo de fundo
// ---------------------------------------------------------------------------

function SaturationArt() {
  const glasses = [
    { title: "Insaturada", sub: "ainda dissolve mais", dots: 6, bottom: 0 },
    { title: "Saturada", sub: "no limite", dots: 14, bottom: 0 },
    { title: "Com corpo de fundo", sub: "o excesso não dissolve", dots: 14, bottom: 9 },
  ];
  return (
    <Art viewBox="0 0 560 200" label="Três copos: solução insaturada, saturada e saturada com o açúcar sobrando no fundo">
      {glasses.map((g, i) => {
        const x = 40 + i * 180;
        return (
          <g key={g.title}>
            <Beaker x={x} y={30} w={110} h={110} liquid="#fde68a" level={0.75}>
              {Array.from({ length: g.dots }, (_, k) => (
                <circle key={k} cx={x + 12 + ((k * 29) % 86)} cy={70 + ((k * 17) % 60)} r="3" fill="#fff" className="cg-anim-aura-drift" style={{ "--cg-dur": `${2 + (k % 3)}s` } as React.CSSProperties} />
              ))}
              {Array.from({ length: g.bottom }, (_, k) => (
                <rect key={`b${k}`} x={x + 14 + k * 9} y={128 + (k % 2) * 4} width="8" height="8" rx="1.5" fill="#fff" stroke="#cbd5e1" />
              ))}
            </Beaker>
            {i === 2 && (
              <g>
                <animateTransform attributeName="transform" type="translate" values="0 -20;0 40;0 40" keyTimes="0;0.5;1" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.6;1" dur="3s" repeatCount="indefinite" />
                <rect x={x + 50} y="20" width="10" height="10" rx="2" fill="#fff" stroke="#94a3b8" />
              </g>
            )}
            <text x={x + 55} y="168" textAnchor="middle" fontSize="13" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
              {g.title}
            </text>
            <text x={x + 55} y="186" textAnchor="middle" fontSize="11.5" fontStyle="italic" fill="#6b5a3a" fontFamily="Georgia, serif">
              {g.sub}
            </text>
          </g>
        );
      })}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O laboratório de concentração: massa de soluto e volume de solução
// ---------------------------------------------------------------------------

export function ConcentrationLab() {
  const [mass, setMass] = useState(20);
  const [volume, setVolume] = useState(2);
  const c = mass / volume;
  // a cor do suco fica mais forte com a concentração (até 50 g/L)
  const strength = Math.min(1, c / 50);
  const level = Math.min(0.92, 0.2 + volume * 0.14);
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <div className="flex flex-wrap items-center gap-[0.8em]">
        <svg viewBox="0 0 160 170" className="h-[9em] w-auto shrink-0" aria-label={`Suco com ${mass} g em ${volume} L`}>
          <Beaker x={30} y={20} w={100} h={130} liquid={`rgba(234, 88, 12, ${0.15 + strength * 0.85})`} level={level}>
            <Bubbles x0={40} x1={120} bottom={140} top={150 - level * 120} n={5} />
          </Beaker>
        </svg>
        <div className="min-w-[12em] flex-1 space-y-[0.5em] text-[0.88em]">
          <label className="block">
            <span className="font-bold text-[#3b2a14]">Massa de açúcar (soluto): {mass} g</span>
            <input type="range" min={0} max={50} step={5} value={mass} onChange={(e) => setMass(Number(e.target.value))} className="w-full accent-[#a21caf]" />
          </label>
          <label className="block">
            <span className="font-bold text-[#3b2a14]">Volume do suco (solução): {volume.toLocaleString("pt-BR")} L</span>
            <input type="range" min={0.5} max={5} step={0.5} value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-full accent-[#a21caf]" />
          </label>
          <p className="rounded-lg bg-[#fdf4ff] px-[0.6em] py-[0.3em] text-center font-bold text-[#701a75]">
            C = {mass} g ÷ {volume.toLocaleString("pt-BR")} L = <span className="text-[1.15em]">{c.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} g/L</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A diluição: mais água, a mesma quantidade de soluto, a cor mais fraca
// ---------------------------------------------------------------------------

function DilutionArt() {
  const loop = { dur: "6s", repeatCount: "indefinite" };
  return (
    <Art viewBox="0 0 540 210" label="Água sendo colocada num suco concentrado: o volume aumenta, a quantidade de soluto continua a mesma e a cor fica mais fraca">
      {/* o jarro de água derramando */}
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0 160 60;40 160 60;40 160 60;0 160 60" keyTimes="0;0.2;0.7;1" {...loop} />
        <path d="M130 20 L190 20 L186 86 L134 86 Z" fill="#bae6fd" stroke="#0284c7" strokeWidth="2.5" />
        <path d="M190 20 L204 12" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
      </g>
      <path d="M226 54 C234 76 244 96 250 140" stroke="#38bdf8" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0">
        <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.2;0.25;0.65;0.7;1" {...loop} />
      </path>
      {/* o copo: o nível sobe e a cor clareia */}
      <path d="M220 100 L320 100 L314 196 Q312 204 304 204 L236 204 Q228 204 226 196 Z" fill="#fffaf0" />
      <rect x="226" y="150" width="88" height="52" fill="#ea580c" opacity="0.95">
        <animate attributeName="y" values="150;150;110;110;150" keyTimes="0;0.2;0.7;0.95;1" {...loop} />
        <animate attributeName="height" values="52;52;92;92;52" keyTimes="0;0.2;0.7;0.95;1" {...loop} />
        <animate attributeName="opacity" values="0.95;0.95;0.45;0.45;0.95" keyTimes="0;0.2;0.7;0.95;1" {...loop} />
      </rect>
      <path d="M220 100 L226 196 Q228 204 236 204 L304 204 Q312 204 314 196 L320 100" fill="none" stroke="#64748b" strokeWidth="2.5" />
      {/* as mesmas partículas de soluto, mais espalhadas */}
      {Array.from({ length: 8 }, (_, i) => (
        <circle key={i} cx={236 + ((i * 23) % 70)} r="3.5" fill="#fff">
          <animate attributeName="cy" values={`${160 + (i % 3) * 12};${160 + (i % 3) * 12};${120 + (i % 4) * 20};${120 + (i % 4) * 20};${160 + (i % 3) * 12}`} keyTimes="0;0.2;0.7;0.95;1" {...loop} />
        </circle>
      ))}
      <g fontFamily="Georgia, serif" fontSize="12.5" fontWeight="900">
        <text x="380" y="120" fill="#c2410c">
          mesmo soluto
        </text>
        <text x="380" y="140" fill="#0369a1">
          + volume
        </text>
        <text x="380" y="160" fill="#3b2a14">
          = menos concentrado
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 4, content, bare });

export const chapter4: BookPage[] = [
  page(
    <ChapterOpener
      n={4}
      title="Soluções e Concentração"
      goals={["O que são soluto, solvente e solução", "O que é uma solução saturada", "Como calcular a concentração em g/L", "O que acontece quando diluímos uma solução"]}
    >
      <Fig h={34}>
        <TeaOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🥄">Soluto, solvente e solução</H>
      <P>
        Quando você dissolve açúcar na água, forma uma <T>solução</T>: uma mistura homogênea, em que não dá para ver as partes separadas. Quem se dissolve é o <T>soluto</T> (o
        açúcar); quem dissolve é o <T>solvente</T> (a água), que geralmente está em maior quantidade.
      </P>
      <Fig n="4.1" caption="O sal na água: os íons se soltam do cristal e ficam cercados de moléculas de água." h={22}>
        <SaltDissolvingArt />
      </Fig>
      <P>
        A água é chamada de <T>solvente universal</T> porque dissolve muita coisa: sais, açúcares e até gases. Mas não dissolve tudo: a gordura, por exemplo, não se dissolve
        nela.
      </P>
      <Cards
        items={[
          { icon: "💧", title: "Solução líquida", text: "Água do mar, soro, café coado." },
          { icon: "💨", title: "Solução gasosa", text: "O ar: 78% de nitrogênio e 21% de oxigênio." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🍵">Solubilidade e saturação</H>
      <P>
        Existe um limite de quanto soluto um solvente consegue dissolver: é a <T>solubilidade</T>. Quando a solução chega nesse limite, ela está <T>saturada</T>. Se você
        colocar mais açúcar num suco saturado, ele vai para o fundo do copo: é o <T>corpo de fundo</T>.
      </P>
      <Fig n="4.2" caption="No terceiro copo, o açúcar a mais não dissolve e se acumula no fundo." h={22}>
        <SaturationArt />
      </Fig>
      <List
        items={[
          <>
            Para a maioria dos sólidos, <T>quanto mais quente, mais soluto dissolve</T>: por isso o açúcar some mais rápido no chá quente.
          </>,
          <>
            Com os <T>gases</T> é o contrário: quanto mais quente, menos gás fica dissolvido. É por isso que o refrigerante quente perde o gás mais rápido!
          </>,
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🧮">Concentração</H>
      <P>
        A <T>concentração</T> diz quanto soluto existe em cada litro de solução. Uma das formas de calcular é a <T>concentração comum</T>, em gramas por litro (g/L):
      </P>
      <div className="my-[0.4em] rounded-xl border-2 border-[#a21caf] bg-[#fdf4ff] px-[0.8em] py-[0.4em] text-center font-bold text-[#701a75]">C = massa do soluto (g) ÷ volume da solução (L)</div>
      <P>Mexa nos controles e veja o suco ficar mais forte ou mais fraco:</P>
      <ConcentrationLab />
      <Box kind="mago" title="Por cento quer dizer “por cem”">
        O soro fisiológico tem <strong>0,9% de sal</strong>: em cada 100 partes de soro, 0,9 parte é sal. Exemplo de conta: 20 g de sal em 2 L de água dão 20 ÷ 2 ={" "}
        <strong>10 g/L</strong>.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🚰">Diluição</H>
      <P>
        <T>Diluir</T> é acrescentar mais solvente. O suco concentrado de caixinha, por exemplo, precisa de água. Na diluição, a <T>quantidade de soluto continua a mesma</T>,
        mas o volume aumenta; então a concentração <T>diminui</T>.
      </P>
      <Fig n="4.3" caption="Colocando água no suco: o mesmo açúcar fica espalhado num volume maior." h={22}>
        <DilutionArt />
      </Fig>
      <P>
        No ensino médio, a diluição tem uma fórmula: <strong>C₁ · V₁ = C₂ · V₂</strong>. Se 1 L de suco com 40 g/L vira 4 L, a nova concentração é 40 × 1 ÷ 4 ={" "}
        <strong>10 g/L</strong>.
      </P>
      <Box kind="experimente">
        Faça três copos de suco em pó: um com a medida certa, um com metade da água e outro com o dobro. Compare a cor e o sabor: você está vendo a concentração mudar!
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Solução = mistura homogênea. Soluto é o que se dissolve; solvente é o que dissolve.",
          "Saturada é a solução no limite; o excesso de soluto forma o corpo de fundo.",
          "Sólidos dissolvem mais no quente; gases dissolvem menos no quente.",
          "Concentração comum: C = massa ÷ volume, em g/L.",
          "Na diluição, o soluto é o mesmo, o volume aumenta e a concentração diminui.",
        ]}
      />
      <Glossary
        items={[
          ["Soluto", "O que se dissolve (o açúcar no suco)."],
          ["Solvente", "O que dissolve (a água)."],
          ["Solubilidade", "O máximo de soluto que dá para dissolver."],
          ["Saturada", "Solução que já está no limite da solubilidade."],
          ["Diluir", "Acrescentar solvente e diminuir a concentração."],
        ]}
      />
      <Quiz
        items={[
          ["Numa solução de água com açúcar, qual é o soluto?", "O açúcar."],
          ["20 g de sal em 2 L de água: qual é a concentração?", "20 ÷ 2 = 10 g/L."],
          ["Por que o refrigerante quente perde o gás mais rápido?", "Porque a solubilidade dos gases diminui quando a temperatura aumenta."],
          ["O que acontece com a concentração quando se acrescenta água?", "Ela diminui: o soluto é o mesmo num volume maior."],
        ]}
      />
    </>,
  ),
];
