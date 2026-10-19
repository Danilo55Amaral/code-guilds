"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Arrow, Wheel } from "./art";

// ============================================================================
// CAPÍTULO 6 — TERMODINÂMICA (missão "Física: Termodinâmica"): a locomotiva a
// vapor, o conversor de temperatura de mexer (Celsius, Fahrenheit e Kelvin),
// a junta de dilatação da ponte e a praia (areia × água), a curva de
// aquecimento da água com os patamares e a geladeira tirando o calor de
// dentro.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a locomotiva a vapor
// ---------------------------------------------------------------------------

function SteamTrainArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma locomotiva a vapor soltando fumaça, com as rodas girando: uma máquina térmica que transforma calor em movimento">
      <rect width="460" height="300" fill="#e0f2fe" />
      <rect y="230" width="460" height="70" fill="#a8a29e" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;-40 0" dur="0.8s" repeatCount="indefinite" />
        {Array.from({ length: 14 }, (_, i) => (
          <rect key={i} x={i * 40} y="236" width="26" height="8" fill="#78350f" />
        ))}
      </g>
      <rect y="232" width="460" height="4" fill="#475569" />
      {/* a locomotiva */}
      <g transform="translate(110 0)">
        <rect x="40" y="130" width="160" height="70" rx="10" fill="#1e293b" />
        <rect x="170" y="90" width="80" height="110" rx="6" fill="#334155" />
        <rect x="184" y="104" width="52" height="36" rx="4" fill="#fde68a" />
        <rect x="60" y="96" width="26" height="36" fill="#1e293b" />
        <path d="M54 96 L92 96 L88 86 L58 86 Z" fill="#475569" />
        <path d="M20 200 L40 160 L40 200 Z" fill="#dc2626" />
        <circle cx="200" cy="160" r="8" fill="#fde047" />
        <Wheel x={80} y={212} r={20} dur={0.8} />
        <Wheel x={140} y={212} r={20} dur={0.8} />
        <Wheel x={210} y={212} r={20} dur={0.8} />
        {/* a biela indo e vindo */}
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0;12 -6;0 0;-12 6;0 0" dur="0.8s" repeatCount="indefinite" />
          <rect x="76" y="208" width="140" height="6" rx="3" fill="#94a3b8" />
        </g>
        {/* a fumaça */}
        {[0, 1, 2, 3].map((k) => (
          <circle key={k} cx={73 - k * 6} cy="70" r={14 + k * 4} fill="#cbd5e1" opacity="0.85" className="cg-anim-aura-rise" style={{ "--cg-dur": "2.4s", "--cg-delay": `${k * 0.6}s` } as React.CSSProperties} />
        ))}
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O conversor de temperatura
// ---------------------------------------------------------------------------

const MARKS: [number, string][] = [
  [-273, "zero absoluto"],
  [0, "a água congela"],
  [37, "corpo humano"],
  [100, "a água ferve"],
];

export function TempConverter() {
  const [c, setC] = useState(25);
  const k = c + 273;
  const f = c * 1.8 + 32;
  // a altura do líquido: de −273 °C (vazio) a 120 °C (cheio)
  const level = (c + 273) / 393;
  const thermo = (x: number, label: string, value: string, color: string) => (
    <g transform={`translate(${x} 0)`}>
      <rect x="-9" y="14" width="18" height="150" rx="9" fill="#fff" stroke="#475569" strokeWidth="2" />
      <circle cy="176" r="15" fill={color} stroke="#475569" strokeWidth="2" />
      <rect x="-4.5" y="18" width="9" height="152" rx="4.5" fill={color} style={{ transform: `scaleY(${Math.max(0.03, level)})`, transformBox: "fill-box", transformOrigin: "50% 100%", transition: "transform 0.4s" }} />
      <text y="10" textAnchor="middle" fontSize="13" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
        {label}
      </text>
      <text y="210" textAnchor="middle" fontSize="15" fontWeight="900" fill={color} fontFamily="Georgia, serif">
        {value}
      </text>
    </g>
  );
  const near = MARKS.find(([t]) => Math.abs(t - c) < 4);
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <svg viewBox="0 0 400 220" className="mx-auto block w-full max-w-[26em]" aria-label={`${c} °C = ${f.toFixed(1)} °F = ${k} K`}>
        {thermo(80, "Celsius", `${c} °C`, "#dc2626")}
        {thermo(200, "Fahrenheit", `${f.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} °F`, "#2563eb")}
        {thermo(320, "Kelvin", `${k} K`, "#7c3aed")}
      </svg>
      <input type="range" min={-273} max={120} step={1} value={c} onChange={(e) => setC(Number(e.target.value))} className="w-full accent-[#4f46e5]" aria-label="Temperatura em graus Celsius" />
      <div className="mt-[0.2em] flex flex-wrap justify-center gap-[0.3em]">
        {MARKS.map(([t, name]) => (
          <button key={t} type="button" onClick={() => setC(t)} className="rounded-full border border-[#d9c79d] bg-white px-[0.6em] py-[0.1em] text-[0.78em] font-bold text-[#5b4a2e] hover:bg-[#eef2ff]">
            {name} ({t} °C)
          </button>
        ))}
      </div>
      {near && <p className="cg-anim-fade mt-[0.3em] text-center text-[0.85em] font-bold text-[#312e81]">📍 {near[1]}!</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// A dilatação da ponte e o calor específico na praia
// ---------------------------------------------------------------------------

function ExpansionArt() {
  const loop = { dur: "6s", repeatCount: "indefinite" };
  return (
    <Art viewBox="0 0 600 220" label="A junta de dilatação da ponte fecha no calor e abre no frio; na praia, a areia esquenta muito mais rápido que a água">
      {/* a ponte */}
      <circle cx="40" cy="30" r="16" fill="#fbbf24">
        <animate attributeName="opacity" values="1;1;0.2;0.2;1" keyTimes="0;0.4;0.5;0.9;1" {...loop} />
      </circle>
      <rect x="20" y="100" width="130" height="16" fill="#94a3b8" stroke="#475569" strokeWidth="2">
        <animate attributeName="width" values="136;136;126;126;136" keyTimes="0;0.4;0.5;0.9;1" {...loop} />
      </rect>
      <rect x="160" y="100" width="130" height="16" fill="#94a3b8" stroke="#475569" strokeWidth="2">
        <animate attributeName="x" values="154;154;164;164;154" keyTimes="0;0.4;0.5;0.9;1" {...loop} />
      </rect>
      <rect x="60" y="116" width="14" height="70" fill="#a8a29e" />
      <rect x="230" y="116" width="14" height="70" fill="#a8a29e" />
      <path d="M0 186 Q150 170 300 186 L300 200 L0 200 Z" fill="#38bdf8" />
      <g fontFamily="Georgia, serif" fontSize="12" fontWeight="900" textAnchor="middle">
        <text x="155" y="90" fill="#3b2a14">junta de dilatação</text>
        <text x="155" y="214" fill="#5b4a2e" fontWeight="700">calor: fecha · frio: abre</text>
      </g>
      {/* a praia */}
      <rect x="330" y="20" width="260" height="190" rx="12" fill="#e0f2fe" />
      <circle cx="560" cy="48" r="18" fill="#fbbf24" className="cg-anim-glow" />
      <path d="M330 140 L460 140 L460 210 L330 210 Z" fill="#fde68a" />
      <path d="M460 130 L590 130 L590 210 L460 210 Z" fill="#38bdf8" />
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M${360 + k * 30} 132 q-6 -8 0 -16 q6 -8 0 -16`} stroke="#ef4444" strokeWidth="2.5" fill="none" className="cg-anim-aura-rise" style={{ "--cg-dur": "2s", "--cg-delay": `${k * 0.6}s` } as React.CSSProperties} />
      ))}
      <g fontFamily="Georgia, serif" fontSize="12" fontWeight="900" textAnchor="middle">
        <text x="395" y="180" fill="#b45309">areia: 45 °C</text>
        <text x="525" y="180" fill="#0c4a6e">água: 25 °C</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A curva de aquecimento da água, com os patamares
// ---------------------------------------------------------------------------

const CURVE = "M60 190 L110 150 L190 150 L290 70 L410 70 L470 30";

function HeatingCurveArt() {
  return (
    <Art viewBox="0 0 540 230" label="A curva de aquecimento da água: a temperatura sobe, fica parada enquanto o gelo derrete, sobe de novo e fica parada enquanto a água ferve">
      <path d="M50 20 L50 200 L510 200" stroke="#1e293b" strokeWidth="2.5" fill="none" />
      <text x="20" y="20" fontSize="12" fontWeight="900" fill="#1e293b" fontFamily="Georgia, serif">
        °C
      </text>
      <text x="500" y="220" fontSize="12" fontWeight="900" fill="#1e293b" fontFamily="Georgia, serif">
        tempo
      </text>
      {[
        [150, "0"],
        [70, "100"],
      ].map(([y, t]) => (
        <g key={t}>
          <line x1="46" y1={y} x2="510" y2={y} stroke="#cbd5e1" strokeDasharray="4 4" />
          <text x="40" y={(y as number) + 4} textAnchor="end" fontSize="11" fontWeight="900" fill="#475569">
            {t}
          </text>
        </g>
      ))}
      <path d={CURVE} stroke="#dc2626" strokeWidth="5" fill="none" strokeLinejoin="round" />
      <circle r="8" fill="#fde047" stroke="#a16207" strokeWidth="2">
        <animateMotion path={CURVE} dur="8s" repeatCount="indefinite" />
      </circle>
      <g fontFamily="Georgia, serif" fontSize="11.5" fontWeight="900" textAnchor="middle">
        <text x="80" y="210" fill="#0284c7">gelo</text>
        <text x="150" y="140" fill="#7c3aed">derretendo</text>
        <text x="240" y="126" fill="#2563eb">água</text>
        <text x="350" y="60" fill="#7c3aed">fervendo</text>
        <text x="470" y="56" fill="#64748b">vapor</text>
      </g>
      <text x="290" y="226" textAnchor="middle" fontSize="11.5" fill="#5b4a2e" fontFamily="Georgia, serif">
        nos patamares, o calor vai todo para mudar o estado (calor latente)
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A geladeira e a máquina térmica
// ---------------------------------------------------------------------------

function FridgeEngineArt() {
  return (
    <Art viewBox="0 0 600 230" label="A geladeira tira o calor de dentro e joga para fora, pela parte de trás; a máquina térmica recebe calor, transforma uma parte em trabalho e solta o resto">
      {/* a geladeira */}
      <rect x="60" y="20" width="140" height="190" rx="12" fill="#f8fafc" stroke="#64748b" strokeWidth="3" />
      <line x1="60" y1="90" x2="200" y2="90" stroke="#64748b" strokeWidth="2" />
      <rect x="180" y="40" width="8" height="30" rx="3" fill="#94a3b8" />
      <rect x="180" y="110" width="8" height="40" rx="3" fill="#94a3b8" />
      {[110, 140, 170].map((y, i) => (
        <path key={y} d={`M110 ${y} L240 ${y - 30}`} stroke="#ef4444" strokeWidth="3" strokeDasharray="8 6" className="cg-anim-dash" style={{ animationDelay: `${i * 0.3}s` }} />
      ))}
      <text x="130" y="60" textAnchor="middle" fontSize="20">
        ❄️
      </text>
      <text x="255" y="70" fontSize="12" fontWeight="900" fill="#b91c1c" fontFamily="Georgia, serif">
        o calor vai
      </text>
      <text x="255" y="86" fontSize="12" fontWeight="900" fill="#b91c1c" fontFamily="Georgia, serif">
        para trás
      </text>
      {/* a máquina térmica */}
      <g transform="translate(400 30)">
        <rect x="40" y="0" width="120" height="44" rx="10" fill="#fecaca" stroke="#b91c1c" strokeWidth="2" />
        <text x="100" y="27" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#991b1b" fontFamily="Georgia, serif">
          fonte quente
        </text>
        <circle cx="100" cy="100" r="34" fill="#e2e8f0" stroke="#475569" strokeWidth="3" />
        <g transform="translate(100 100)">
          <g className="cg-anim-orbit-rev" style={{ "--cg-dur": "2s" } as React.CSSProperties}>
            <path d="M-22 0 L22 0 M0 -22 L0 22" stroke="#475569" strokeWidth="4" />
          </g>
        </g>
        <rect x="40" y="156" width="120" height="44" rx="10" fill="#bfdbfe" stroke="#1d4ed8" strokeWidth="2" />
        <text x="100" y="183" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#1e3a8a" fontFamily="Georgia, serif">
          fonte fria
        </text>
        <Arrow x1={100} y1={46} x2={100} y2={64} color="#dc2626" />
        <Arrow x1={100} y1={136} x2={100} y2={154} color="#2563eb" />
        <Arrow x1={136} y1={100} x2={186} y2={100} color="#16a34a" label="trabalho" />
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 6, content, bare });

export const chapter6: BookPage[] = [
  page(
    <ChapterOpener
      n={6}
      title="Termodinâmica"
      goals={["As escalas Celsius, Fahrenheit e Kelvin", "O que é dilatação e calor específico", "Por que a temperatura para enquanto a água ferve", "As leis da termodinâmica e como funciona a geladeira"]}
    >
      <Fig h={34}>
        <SteamTrainArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🌡️">As escalas de temperatura</H>
      <P>
        No Brasil usamos a escala <T>Celsius (°C)</T>. Os Estados Unidos usam a <T>Fahrenheit (°F)</T>, em que a água congela a 32 °F e ferve a 212 °F. E a ciência usa a{" "}
        <T>Kelvin (K)</T>, que começa no <T>zero absoluto</T> (−273 °C), a temperatura em que a agitação das partículas seria a menor possível. Mexa no termômetro:
      </P>
      <TempConverter />
      <P>
        Para converter: <strong>K = °C + 273</strong> (25 °C = 298 K) e <strong>°F = °C × 1,8 + 32</strong> (0 °C = 32 °F).
      </P>
    </>,
  ),

  page(
    <>
      <H icon="🌉">Dilatação e calor específico</H>
      <P>
        No calor, os materiais <T>aumentam</T> um pouquinho de tamanho; no frio, <T>encolhem</T>. É a <T>dilatação térmica</T>. Por isso as pontes e os trilhos de trem têm
        pequenas folgas, as <T>juntas de dilatação</T>: sem elas, o material se empurraria e racharia.
      </P>
      <Fig n="6.1" caption="A junta da ponte abre e fecha com a temperatura. Na praia, a areia esquenta bem mais que a água." h={24}>
        <ExpansionArt />
      </Fig>
      <P>
        O <T>calor específico</T> diz quanta energia é preciso para esquentar um material. A água tem calor específico <T>alto</T>: precisa de muita energia para esquentar. Por
        isso, de dia, a areia da praia fica pelando e a água do mar continua fresquinha.
      </P>
    </>,
  ),

  page(
    <>
      <H icon="📈">Calor latente e mudança de estado</H>
      <P>
        Enquanto a água ferve, a temperatura <T>fica parada</T> em 100 °C, mesmo com o fogo aceso! Toda a energia recebida vai para separar as partículas e mudar o estado: é o{" "}
        <T>calor latente</T>. O mesmo acontece quando o gelo derrete, a 0 °C.
      </P>
      <Fig n="6.2" caption="A curva de aquecimento: os trechos retos são as mudanças de estado." h={26}>
        <HeatingCurveArt />
      </Fig>
      <Box kind="mago">Aumentar o fogo depois que a água já está fervendo não faz o macarrão cozinhar mais rápido: a temperatura continua 100 °C. Só a água evapora mais depressa!</Box>
    </>,
  ),

  page(
    <>
      <H icon="❄️">As leis da termodinâmica</H>
      <List
        items={[
          <>
            <T>1ª Lei</T>: a energia se conserva. O calor recebido por um sistema vira trabalho ou aumenta a energia interna dele.
          </>,
          <>
            <T>2ª Lei</T>: o calor flui <em>sozinho</em> do quente para o frio, nunca ao contrário. E nenhuma máquina térmica transforma todo o calor em trabalho: uma parte
            sempre vai para a fonte fria.
          </>,
        ]}
      />
      <Fig n="6.3" caption="A geladeira gasta energia para levar o calor de dentro para fora. A máquina térmica transforma parte do calor em trabalho." h={24}>
        <FridgeEngineArt />
      </Fig>
      <P>
        É por isso que a parte de trás da geladeira fica quente: é para onde vai o calor tirado de dentro. E o motor de um carro aproveita só uma parte da energia do
        combustível; o resto sai como calor.
      </P>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "K = °C + 273; °F = °C × 1,8 + 32. O zero absoluto é 0 K (−273 °C).",
          "Os materiais dilatam no calor e contraem no frio: por isso existem as juntas de dilatação.",
          "A água tem calor específico alto: esquenta e esfria devagar.",
          "Na mudança de estado, a temperatura fica constante (calor latente).",
          "1ª Lei: a energia se conserva. 2ª Lei: o calor vai do quente para o frio e nenhuma máquina tem 100% de rendimento.",
        ]}
      />
      <Glossary
        items={[
          ["Zero absoluto", "A menor temperatura possível: 0 K ou −273 °C."],
          ["Dilatação", "Aumento do tamanho de um material com o calor."],
          ["Calor específico", "A energia para esquentar 1 g de um material em 1 °C."],
          ["Calor latente", "O calor usado só para mudar o estado físico."],
          ["Máquina térmica", "Máquina que transforma calor em trabalho."],
        ]}
      />
      <Quiz
        items={[
          ["Quanto é 25 °C em kelvin?", "25 + 273 = 298 K."],
          ["A que temperatura a água congela na escala Fahrenheit?", "32 °F."],
          ["Por que as pontes têm juntas de dilatação?", "Porque os materiais aumentam no calor e diminuem no frio."],
          ["Enquanto a água ferve, o que acontece com a temperatura dela?", "Fica constante, em 100 °C (ao nível do mar)."],
        ]}
      />
    </>,
  ),
];
