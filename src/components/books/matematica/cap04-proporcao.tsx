"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Kid } from "../ods/art";
import { MATH, MATH_DARK, Panel, Pill } from "./art";

// ============================================================================
// CAPÍTULO 4 — RAZÃO, PROPORÇÃO E REGRA DE TRÊS (missão "Matemática:
// Porcentagem e Proporção", a parte da proporção): a balança dos cadernos, a
// turma da razão, a planta da casa em escala, a receita que muda com o número
// de pessoas (de tocar) e os pedreiros da regra de três inversa.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a balança equilibrada
// ---------------------------------------------------------------------------

function Notebook({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-16" y="-22" width="32" height="22" rx="2" fill={color} stroke="#1e293b" strokeWidth="1.5" />
      <path d="M-12 -22 L-12 0" stroke="#fff" strokeWidth="2" strokeDasharray="2 2" />
    </g>
  );
}

function BalanceOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma balança de dois pratos balançando de leve: num prato, três cadernos; no outro, 18 reais. Os dois lados valem o mesmo">
      <rect width="460" height="300" fill="#f5f3ff" />
      <rect x="160" y="250" width="140" height="20" rx="6" fill="#78350f" />
      <rect x="222" y="110" width="16" height="145" fill="#92400e" />
      <g transform="translate(230 110)">
        <g>
          <animateTransform attributeName="transform" type="rotate" values="-4;4;-4" dur="4s" repeatCount="indefinite" />
          <rect x="-150" y="-6" width="300" height="12" rx="6" fill="#b45309" />
          <circle r="12" fill="#fbbf24" stroke="#78350f" strokeWidth="3" />
          {/* prato da esquerda: 3 cadernos */}
          <g transform="translate(-130 0)">
            <g>
              <animateTransform attributeName="transform" type="rotate" values="4;-4;4" dur="4s" repeatCount="indefinite" />
              <path d="M0 0 L-40 70 M0 0 L40 70" stroke="#78350f" strokeWidth="2" />
              <path d="M-55 70 L55 70 Q50 92 0 92 Q-50 92 -55 70 Z" fill="#fde68a" stroke="#78350f" strokeWidth="2" />
              <Notebook x={-30} y={70} color="#2563eb" />
              <Notebook x={0} y={70} color="#dc2626" />
              <Notebook x={30} y={70} color="#16a34a" />
            </g>
          </g>
          {/* prato da direita: R$ 18 */}
          <g transform="translate(130 0)">
            <g>
              <animateTransform attributeName="transform" type="rotate" values="4;-4;4" dur="4s" repeatCount="indefinite" />
              <path d="M0 0 L-40 70 M0 0 L40 70" stroke="#78350f" strokeWidth="2" />
              <path d="M-55 70 L55 70 Q50 92 0 92 Q-50 92 -55 70 Z" fill="#fde68a" stroke="#78350f" strokeWidth="2" />
              <rect x="-34" y="44" width="68" height="26" rx="4" fill="#86efac" stroke="#166534" strokeWidth="2" />
              <text y="63" textAnchor="middle" fontSize="16" fontWeight="900" fill="#14532d" fontFamily="Georgia, serif">
                R$ 18
              </text>
            </g>
          </g>
        </g>
      </g>
      <text x="230" y="50" textAnchor="middle" fontSize="22" fontWeight="900" fill={MATH_DARK} fontFamily="Georgia, serif">
        3 cadernos = R$ 18
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A turma da razão
// ---------------------------------------------------------------------------

function RatioArt() {
  return (
    <Art viewBox="0 0 560 190" label="Uma turma com 12 meninos de camiseta azul e 18 meninas de camiseta laranja, separados em 6 grupos de 2 meninos e 3 meninas">
      <rect width="560" height="190" rx="14" fill="#faf5ff" />
      {Array.from({ length: 6 }, (_, g) => (
        <g key={g} transform={`translate(${30 + g * 88} 0)`}>
          <rect x="0" y="22" width="80" height="140" rx="10" fill="#fff" stroke="#c4b5fd" strokeWidth="2" strokeDasharray="5 4" />
          <Kid x={22} y={85} s={0.75} shirt="#2563eb" />
          <Kid x={56} y={85} s={0.75} shirt="#2563eb" hair="#78350f" />
          <Kid x={14} y={150} s={0.75} shirt="#ea580c" hair="#1c1917" />
          <Kid x={40} y={150} s={0.75} shirt="#ea580c" skin="#f1c9a5" />
          <Kid x={66} y={150} s={0.75} shirt="#ea580c" skin="#8d5524" />
        </g>
      ))}
      <text x="280" y="16" textAnchor="middle" fontSize="13" fontWeight="900" fill={MATH_DARK} fontFamily="Georgia, serif">
        12 meninos para 18 meninas = 6 grupos de 2 para 3
      </text>
      <text x="280" y="182" textAnchor="middle" fontSize="13" fontWeight="900" fill={MATH} fontFamily="Georgia, serif">
        razão 12/18 = 2/3
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A planta da casa em escala
// ---------------------------------------------------------------------------

function ScaleArt() {
  return (
    <Art viewBox="0 0 560 190" label="A planta de um quarto desenhada na escala 1 para 100: uma parede de 3 centímetros no papel mede 3 metros de verdade">
      <rect width="560" height="190" rx="14" fill="#eff6ff" />
      <rect x="40" y="30" width="200" height="130" fill="#fff" stroke="#1e3a8a" strokeWidth="5" />
      <path d="M150 160 L150 140 Q170 140 175 160" fill="none" stroke="#1e3a8a" strokeWidth="2" />
      <rect x="60" y="45" width="70" height="40" rx="4" fill="#bfdbfe" stroke="#1e3a8a" strokeWidth="1.5" />
      <text x="95" y="70" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1e3a8a" fontFamily="Georgia, serif">
        cama
      </text>
      {/* a régua medindo a parede */}
      <g>
        <rect x="40" y="168" width="150" height="14" fill="#fde68a" stroke="#a16207" />
        {Array.from({ length: 4 }, (_, i) => (
          <g key={i}>
            <line x1={40 + i * 50} y1="168" x2={40 + i * 50} y2="178" stroke="#78350f" strokeWidth="1.5" />
            <text x={43 + i * 50} y="180" fontSize="8" fontWeight="700" fill="#78350f">
              {i}
            </text>
          </g>
        ))}
      </g>
      <path d="M40 22 L190 22" stroke="#dc2626" strokeWidth="2.5">
        <animate attributeName="stroke-dasharray" values="0 160;150 10;150 10" keyTimes="0;0.5;1" dur="3s" repeatCount="indefinite" />
      </path>
      <g fontFamily="Georgia, serif" fontWeight="900">
        <text x="300" y="60" fontSize="16" fill={MATH_DARK}>
          Escala 1 : 100
        </text>
        <text x="300" y="90" fontSize="13" fill="#334155">
          1 cm no papel = 100 cm de verdade
        </text>
        <text x="300" y="125" fontSize="18" fill="#dc2626">
          3 cm × 100 = 300 cm = 3 m
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A receita que muda com o número de pessoas (de tocar)
// ---------------------------------------------------------------------------

// a quantidade pra 4 pessoas e como escrever o resto da linha
const RECIPE: { icon: string; qty: number; text: (q: number) => string }[] = [
  { icon: "🌾", qty: 2, text: (q) => `${q > 1 ? "xícaras" : "xícara"} de farinha` },
  { icon: "🥚", qty: 3, text: (q) => (q > 1 ? "ovos" : "ovo") },
  { icon: "🥛", qty: 1, text: (q) => `${q > 1 ? "xícaras" : "xícara"} de leite` },
  { icon: "🍫", qty: 100, text: () => "g de chocolate" },
];

export function RecipeScaler() {
  const [people, setPeople] = useState(4);
  const k = people / 4;
  const fmt = (v: number) => v.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  return (
    <Panel title="O bolo da regra de três">
      <div className="flex flex-wrap items-center justify-center gap-[0.3em]">
        <span className="text-[0.82em] font-bold text-[#3b2a14]">Pessoas:</span>
        {[2, 4, 6, 8, 12].map((n) => (
          <Pill key={n} on={people === n} onClick={() => setPeople(n)}>
            {n}
          </Pill>
        ))}
      </div>
      <div className="mt-[0.4em] grid grid-cols-2 gap-[0.3em] text-[0.88em]">
        {RECIPE.map((r) => (
          <p key={r.icon} className="rounded-lg bg-white px-[0.5em] py-[0.15em]">
            {r.icon}{" "}
            <strong key={people} className="cg-anim-fade inline-block" style={{ color: MATH_DARK }}>
              {fmt(r.qty * k)}
            </strong>{" "}
            {r.text(r.qty * k)}
          </p>
        ))}
      </div>
      <p className="mt-[0.35em] text-center text-[0.8em] text-[#3b2a14]">
        A receita é pra 4 pessoas. Pra {people}, tudo é multiplicado por {people} ÷ 4 = <strong>{fmt(k)}</strong>.
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Os pedreiros da regra de três inversa
// ---------------------------------------------------------------------------

function WorkersArt() {
  const row = (y: number, workers: number, days: number, color: string, label: string) => (
    <g transform={`translate(0 ${y})`}>
      {Array.from({ length: workers }, (_, i) => (
        <g key={i} transform={`translate(${40 + i * 22} 50)`}>
          <circle cy="-30" r="7" fill="#d6a77a" />
          <path d="M-8 -36 Q0 -46 8 -36 Z" fill="#facc15" stroke="#a16207" />
          <rect x="-7" y="-22" width="14" height="18" rx="4" fill={color} />
          <path d="M-4 -4 L-4 6 M4 -4 L4 6" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
        </g>
      ))}
      {Array.from({ length: days }, (_, d) => (
        <rect key={d} x={200 + d * 24} y="22" width="20" height="26" rx="3" fill="#fff" stroke={color} strokeWidth="2">
          <animate attributeName="fill" values="#fff;#fff;#ede9fe;#ede9fe" keyTimes={`0;${(d / days) * 0.8};${(d / days) * 0.8 + 0.02};1`} dur="5s" repeatCount="indefinite" />
        </rect>
      ))}
      <text x="200" y="66" fontSize="12" fontWeight="900" fill={color} fontFamily="Georgia, serif">
        {label}
      </text>
    </g>
  );
  return (
    <Art viewBox="0 0 560 190" label="Em cima, 4 pedreiros e 12 dias de obra; embaixo, 6 pedreiros e só 8 dias. Nos dois casos, o trabalho todo é 48 dias de pedreiro">
      <rect width="560" height="190" rx="14" fill="#faf5ff" />
      {row(8, 4, 12, "#2563eb", "4 pedreiros × 12 dias = 48")}
      {row(98, 6, 8, "#ea580c", "6 pedreiros × 8 dias = 48")}
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
      title="Razão, Proporção e Regra de Três"
      goals={["O que é uma razão e como simplificar", "Escala de mapas e velocidade", "A regra de três direta", "A regra de três inversa"]}
    >
      <Fig h={34}>
        <BalanceOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="➗">Razão</H>
      <P>
        <T>Razão</T> é a comparação de duas quantidades por uma divisão. Numa turma com 12 meninos e 18 meninas, a razão entre meninos e meninas é 12/18. Dividindo os
        dois por 6, fica <T>2/3</T>: para cada 2 meninos, há 3 meninas.
      </P>
      <Fig n="4.1" caption="12 para 18 é o mesmo que 2 para 3: seis grupos iguais." h={21}>
        <RatioArt />
      </Fig>
      <Box kind="lembre">A razão 2/3 também se escreve 2 : 3 (lê-se “2 para 3”). Simplificar é dividir os dois números pelo mesmo valor.</Box>
    </>,
  ),

  page(
    <>
      <H icon="🗺️">Proporção, escala e velocidade</H>
      <P>
        <T>Proporção</T> é uma igualdade entre duas razões. A <T>escala</T> de um mapa é uma razão: na escala 1 : 100, cada centímetro no papel vale 100 centímetros
        de verdade.
      </P>
      <Fig n="4.2" caption="Na escala 1 : 100, uma parede de 3 cm no papel tem 3 m de verdade." h={21}>
        <ScaleArt />
      </Fig>
      <Cards
        items={[
          { icon: "🚗", title: "Velocidade", text: "A 60 km/h, 150 km levam 150 ÷ 60 = 2,5 horas (2 h e 30 min)." },
          { icon: "📏", title: "Unidades", text: "300 cm = 3 m; 1 km = 1.000 m; 1 h = 60 min." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🎂">Regra de três direta</H>
      <P>
        Quando uma grandeza aumenta e a outra aumenta na mesma proporção, elas são <T>diretamente proporcionais</T>. Se 3 cadernos custam R$ 18, cada um custa R$ 6, e 5
        cadernos custam 5 × 6 = <T>R$ 30</T>. Numa receita é igual:
      </P>
      <RecipeScaler />
      <Box kind="mago" title="Monte a regra de três">
        Escreva as grandezas em colunas: 3 cadernos → R$ 18; 5 cadernos → x. Multiplique em cruz: 3 · x = 5 · 18, então x = 90 ÷ 3 = 30.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="👷">Regra de três inversa</H>
      <P>
        Às vezes, quando uma grandeza aumenta, a outra <T>diminui</T>. Se 4 pedreiros constroem um muro em 12 dias, 6 pedreiros no mesmo ritmo terminam mais rápido. O
        trabalho total é 4 × 12 = 48; então 48 ÷ 6 = <T>8 dias</T>.
      </P>
      <Fig n="4.3" caption="Mais pedreiros, menos dias: o produto continua 48." h={21}>
        <WorkersArt />
      </Fig>
      <Box kind="atencao">Antes de calcular, pergunte: se uma aumenta, a outra aumenta (direta) ou diminui (inversa)? Na inversa, o produto fica constante.</Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Razão compara duas quantidades por uma divisão: 12/18 = 2/3.",
          "Proporção é a igualdade de duas razões; a escala 1 : 100 diz que 1 cm vale 100 cm.",
          "Velocidade média = distância ÷ tempo: 150 km a 60 km/h levam 2,5 h.",
          "Na regra de três direta, as duas grandezas crescem juntas (mais cadernos, mais caro).",
          "Na inversa, uma cresce e a outra diminui (mais pedreiros, menos dias).",
        ]}
      />
      <Glossary
        items={[
          ["Razão", "A divisão que compara duas quantidades."],
          ["Proporção", "A igualdade entre duas razões."],
          ["Escala", "A razão entre o tamanho no desenho e o real."],
          ["Grandeza", "Tudo o que pode ser medido ou contado."],
          ["Regra de três", "O método pra achar um valor de uma proporção."],
        ]}
      />
      <Quiz
        items={[
          ["Se 3 cadernos custam R$ 18, quanto custam 5?", "R$ 30."],
          ["Num mapa 1 : 100, uma parede de 3 cm mede quanto?", "3 m."],
          ["4 pedreiros fazem um muro em 12 dias. Quantos dias levam 6 pedreiros?", "8 dias (regra de três inversa)."],
          ["Qual é a razão simplificada entre 12 e 18?", "2/3 (2 para 3)."],
        ]}
      />
    </>,
  ),
];
