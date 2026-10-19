"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Sun, Tree } from "./art";

// ============================================================================
// CAPÍTULO 5 — ENERGIA LIMPA (missão "ODS: Clima e Energia Limpa", a parte
// da energia): as turbinas de vento girando e os painéis solares, as fontes
// renováveis e não renováveis, a hidrelétrica com a água girando a turbina,
// a matriz elétrica do Brasil (de tocar) e a casa com painel solar.
// ============================================================================

/** Uma turbina de vento (o pé da torre em x, y), com as pás girando. */
function WindTurbine({ x, y, s = 1, dur = 3 }: { x: number; y: number; s?: number; dur?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-4 0 L-2 -110 L2 -110 L4 0 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
      <g transform="translate(0 -112)">
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur={`${dur}s`} repeatCount="indefinite" />
          {[0, 120, 240].map((a) => (
            <path key={a} d="M0 0 L-5 -6 L-2 -54 L3 -54 L5 -6 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.2" transform={`rotate(${a})`} />
          ))}
        </g>
        <circle r="5" fill="#64748b" />
      </g>
    </g>
  );
}

/** Um painel solar inclinado (o pé em x, y). */
function SolarPanel({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-4 0 L-4 -18 M24 0 L24 -30" stroke="#64748b" strokeWidth="3" />
      <path d="M-20 -14 L40 -36 L52 -22 L-8 0 Z" fill="#1e3a8a" stroke="#93c5fd" strokeWidth="1.5" />
      <path d="M0 -7 L44 -23 M-14 -7 L30 -23 M10 -24 L22 -2 M26 -30 L38 -8" stroke="#60a5fa" strokeWidth="1" />
      <path d="M-20 -14 L40 -36 L52 -22 L-8 0 Z" fill="#fff" opacity="0">
        <animate attributeName="opacity" values="0;0.35;0" dur="3s" repeatCount="indefinite" />
      </path>
    </g>
  );
}

// ---------------------------------------------------------------------------
// Abertura: as turbinas de vento e os painéis solares
// ---------------------------------------------------------------------------

function CleanEnergyOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Turbinas de vento girando num morro verde, painéis solares brilhando e o Sol no céu">
      <rect width="460" height="300" fill="#e0f2fe" />
      <Sun x={390} y={60} r={28} />
      <path d="M0 240 Q120 170 240 210 Q340 240 460 190 L460 300 L0 300 Z" fill="#86efac" />
      <WindTurbine x={90} y={222} s={1} dur={3} />
      <WindTurbine x={190} y={210} s={0.85} dur={2.4} />
      <WindTurbine x={290} y={226} s={0.7} dur={3.6} />
      <SolarPanel x={350} y={262} />
      <SolarPanel x={410} y={250} s={0.85} />
      <Tree x={30} y={262} s={0.6} />
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Renováveis × não renováveis
// ---------------------------------------------------------------------------

function SourcesCompareArt() {
  const renew = [
    ["☀️", "Solar"],
    ["🌬️", "Eólica"],
    ["💧", "Hidrelétrica"],
    ["🌾", "Biomassa"],
  ];
  const fossil = [
    ["🛢️", "Petróleo"],
    ["⚫", "Carvão"],
    ["🔥", "Gás natural"],
  ];
  return (
    <Art viewBox="0 0 560 210" label="De um lado, as fontes renováveis: solar, eólica, hidrelétrica e biomassa; do outro, as não renováveis: petróleo, carvão e gás natural">
      <rect x="10" y="10" width="270" height="190" rx="14" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
      <rect x="290" y="10" width="260" height="190" rx="14" fill="#f5f5f4" stroke="#78716c" strokeWidth="2" />
      <text x="145" y="38" textAnchor="middle" fontSize="14" fontWeight="900" fill="#166534" fontFamily="Georgia, serif">
        Renováveis: se renovam
      </text>
      <text x="420" y="38" textAnchor="middle" fontSize="14" fontWeight="900" fill="#44403c" fontFamily="Georgia, serif">
        Não renováveis: acabam
      </text>
      {renew.map(([icon, name], i) => (
        <g key={name} transform={`translate(${36 + (i % 2) * 126} ${i < 2 ? 86 : 156})`}>
          <g className="cg-anim-float" style={{ animationDelay: `${i * 0.3}s` }}>
            <text textAnchor="middle" fontSize="30">
              {icon}
            </text>
          </g>
          <text x="24" y="-4" fontSize="11.5" fontWeight="900" fill="#14532d" fontFamily="Georgia, serif">
            {name}
          </text>
        </g>
      ))}
      {fossil.map(([icon, name], i) => (
        <g key={name} transform={`translate(${330 + (i % 2) * 120} ${i < 2 ? 86 : 156})`}>
          <text textAnchor="middle" fontSize="30">
            {icon}
          </text>
          <text x="34" y="-4" fontSize="12.5" fontWeight="900" fill="#292524" fontFamily="Georgia, serif">
            {name}
          </text>
        </g>
      ))}
      <text x="420" y="190" textAnchor="middle" fontSize="11" fontStyle="italic" fill="#57534e" fontFamily="Georgia, serif">
        e soltam muito gás carbônico
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A hidrelétrica: a água girando a turbina
// ---------------------------------------------------------------------------

function HydroArt() {
  return (
    <Art viewBox="0 0 560 220" label="Uma usina hidrelétrica: a represa guarda a água, a água desce pelo tubo, gira a turbina, o gerador produz eletricidade e os fios levam a energia até a cidade">
      <rect width="560" height="220" rx="14" fill="#f0f9ff" />
      {/* a represa */}
      <path d="M0 60 L170 60 L170 200 L0 200 Z" fill="#38bdf8" />
      <path d="M170 40 L200 40 L230 200 L170 200 Z" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
      {/* o tubo com a água descendo */}
      <path d="M150 120 L250 180" stroke="#0369a1" strokeWidth="14" />
      <path d="M150 120 L250 180" stroke="#7dd3fc" strokeWidth="6" strokeDasharray="10 8" className="cg-anim-dash" />
      {/* a turbina girando */}
      <g transform="translate(266 184)">
        <circle r="20" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1.2s" repeatCount="indefinite" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <path key={a} d="M0 0 L4 -16 L-4 -16 Z" fill="#475569" transform={`rotate(${a})`} />
          ))}
        </g>
      </g>
      <rect x="250" y="120" width="34" height="40" rx="5" fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
      <text x="267" y="145" textAnchor="middle" fontSize="16">
        ⚡
      </text>
      {/* os fios até a cidade */}
      {[340, 430].map((x) => (
        <path key={x} d={`M${x} 200 L${x} 70 M${x - 16} 80 L${x + 16} 80`} stroke="#64748b" strokeWidth="3" />
      ))}
      <path d="M284 130 Q312 90 340 80 Q385 96 430 80 Q470 92 500 120" stroke="#475569" strokeWidth="2" fill="none" />
      <circle r="4" fill="#fde047">
        <animateMotion path="M284 130 Q312 90 340 80 Q385 96 430 80 Q470 92 500 120" dur="2s" repeatCount="indefinite" />
      </circle>
      {[480, 510, 535].map((x, i) => (
        <rect key={x} x={x - 10} y={150 - i * 12} width="22" height={50 + i * 12} fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
      ))}
      <g fontFamily="Georgia, serif" fontSize="11.5" fontWeight="900" fill="#0c4a6e">
        <text x="20" y="84">represa</text>
        <text x="200" y="112">gerador</text>
        <text x="292" y="214">turbina</text>
        <text x="460" y="140">cidade</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A matriz elétrica do Brasil (de tocar)
// ---------------------------------------------------------------------------

/** De onde vem a eletricidade do Brasil (valores aproximados de 2023, arredondados). */
const MATRIX = [
  { name: "Hidrelétrica", icon: "💧", pct: 59, color: "#0ea5e9", renew: true, text: "A força da água das represas gira as turbinas. Itaipu, no rio Paraná, é uma das maiores do mundo." },
  { name: "Eólica", icon: "🌬️", pct: 13, color: "#14b8a6", renew: true, text: "O vento gira as pás das turbinas. O Nordeste brasileiro tem ventos ótimos e é campeão de energia eólica." },
  { name: "Biomassa", icon: "🌾", pct: 8, color: "#84cc16", renew: true, text: "A queima de restos de plantas, como o bagaço da cana-de-açúcar, gera calor e eletricidade." },
  { name: "Solar", icon: "☀️", pct: 7, color: "#facc15", renew: true, text: "Os painéis fotovoltaicos transformam a luz do Sol em eletricidade. É a fonte que mais cresce no Brasil." },
  { name: "Gás natural", icon: "🔥", pct: 6, color: "#f97316", renew: false, text: "Um combustível fóssil: as usinas a gás ajudam quando chove pouco, mas soltam gás carbônico." },
  { name: "Nuclear", icon: "⚛️", pct: 2, color: "#a855f7", renew: false, text: "As usinas de Angra dos Reis (RJ) usam urânio. Não soltam CO₂, mas o urânio não se renova e o lixo radioativo é um desafio." },
  { name: "Outras", icon: "🛢️", pct: 5, color: "#78716c", renew: false, text: "Petróleo, carvão e outras fontes, quase todas fósseis." },
];

export function EnergyMix() {
  const [sel, setSel] = useState(0);
  const m = MATRIX[sel];
  const renewable = MATRIX.filter((x) => x.renew).reduce((s, x) => s + x.pct, 0);
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <div className="flex h-[2.2em] overflow-hidden rounded-lg border border-[#94a3b8]">
        {MATRIX.map((x, i) => (
          <button
            key={x.name}
            type="button"
            onClick={() => setSel(i)}
            title={x.name}
            className={`flex items-center justify-center text-[0.85em] transition-opacity ${sel === i ? "" : "opacity-70 hover:opacity-100"}`}
            style={{ width: `${x.pct}%`, background: x.color, outline: sel === i ? "3px solid #1e293b" : "none", outlineOffset: "-3px" }}
          >
            {x.pct >= 6 ? x.icon : ""}
          </button>
        ))}
      </div>
      <div className="mt-[0.3em] flex flex-wrap justify-center gap-[0.25em] text-[0.78em]">
        {MATRIX.map((x, i) => (
          <button
            key={x.name}
            type="button"
            onClick={() => setSel(i)}
            className={`rounded-full border px-[0.55em] py-[0.05em] font-bold ${sel === i ? "border-[#1e293b] bg-[#1e293b] text-white" : "border-[#d9c79d] bg-white"}`}
          >
            {x.icon} {x.name}
          </button>
        ))}
      </div>
      <p key={sel} className="cg-anim-fade mt-[0.4em] rounded-lg px-[0.7em] py-[0.3em] text-[0.86em] leading-[1.4]" style={{ background: `${m.color}22`, color: "#1e293b" }}>
        <strong>
          {m.name}: cerca de {m.pct}% {m.renew ? "(renovável)" : "(não renovável)"}.
        </strong>{" "}
        {m.text}
      </p>
      <p className="mt-[0.3em] text-center text-[0.82em] font-bold text-[#166534]">Renováveis: cerca de {renewable}% da eletricidade do Brasil</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A casa com painel solar
// ---------------------------------------------------------------------------

function SolarHomeArt() {
  return (
    <Art viewBox="0 0 560 220" label="Uma casa com painéis solares no telhado: a luz do Sol chega, vira eletricidade e acende as lâmpadas de LED da casa">
      <rect width="560" height="220" rx="14" fill="#fef9c3" />
      <Sun x={80} y={56} r={30} />
      {[0, 1, 2].map((k) => (
        <line key={k} x1={110 + k * 16} y1={70 + k * 4} x2={250 + k * 30} y2={92 + k * 6} stroke="#f59e0b" strokeWidth="3" strokeDasharray="10 8">
          <animate attributeName="stroke-dashoffset" values="0;-36" dur="1s" begin={`${-k * 0.3}s`} repeatCount="indefinite" />
        </line>
      ))}
      <rect y="190" width="560" height="30" fill="#86efac" />
      <path d="M230 110 L340 50 L450 110 Z" fill="#b91c1c" />
      <path d="M262 98 L320 66 L346 80 L288 112 Z" fill="#1e3a8a" stroke="#93c5fd" strokeWidth="2" />
      <rect x="248" y="110" width="184" height="80" fill="#fef3c7" stroke="#92400e" strokeWidth="2" />
      {/* as lâmpadas acendendo */}
      {[290, 340, 390].map((x, i) => (
        <g key={x} transform={`translate(${x} 140)`}>
          <circle r="14" fill="#fde047" opacity="0.5">
            <animate attributeName="opacity" values="0.15;0.6;0.15" dur="2s" begin={`${-i * 0.4}s`} repeatCount="indefinite" />
          </circle>
          <circle r="7" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
        </g>
      ))}
      <path d="M300 100 L300 126" stroke="#fde047" strokeWidth="2" strokeDasharray="4 3" className="cg-anim-dash" />
      <g fontFamily="Georgia, serif" fontSize="12" fontWeight="900">
        <text x="460" y="70" fill="#1e3a8a">painel fotovoltaico</text>
        <text x="460" y="150" fill="#854d0e">lâmpadas de LED</text>
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
      title="Energia Limpa"
      goals={["A diferença entre fontes renováveis e não renováveis", "Como uma hidrelétrica produz eletricidade", "Por que a matriz elétrica do Brasil é limpa", "A energia solar e como economizar energia"]}
    >
      <Fig h={34}>
        <CleanEnergyOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🔋">Fontes de energia</H>
      <P>
        As fontes <T>renováveis</T> se renovam na natureza: o Sol, o vento, a água e a biomassa (restos de plantas). As <T>não renováveis</T>, como o petróleo, o carvão
        e o gás natural, levaram milhões de anos para se formar e um dia acabam.
      </P>
      <Fig n="5.1" caption="Fontes renováveis e não renováveis." h={22}>
        <SourcesCompareArt />
      </Fig>
      <Box kind="lembre">
        Energia <strong>limpa</strong> é a que solta pouco ou nenhum gás de efeito estufa. Por isso as renováveis ajudam o ODS 7 (energia) e o ODS 13 (clima).
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="⚡">Como a água vira eletricidade</H>
      <P>
        Na maior parte das usinas, alguma coisa gira uma <T>turbina</T>, e a turbina gira um <T>gerador</T>, que produz eletricidade. Na <T>hidrelétrica</T>, quem
        gira a turbina é a força da água que desce da represa; na eólica, é o vento.
      </P>
      <Fig n="5.2" caption="A hidrelétrica: da represa até a cidade." h={22}>
        <HydroArt />
      </Fig>
      <Box kind="sabia">
        A usina de <strong>Itaipu</strong>, na fronteira do Brasil com o Paraguai, é uma das maiores hidrelétricas do mundo. Mas as represas também alagam florestas e
        mudam a vida dos rios.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="📊">A matriz elétrica do Brasil</H>
      <P>
        A <T>matriz elétrica</T> é a mistura das fontes que geram a eletricidade de um país. A do Brasil é uma das mais limpas do mundo: <T>mais de 80%</T> vem de fontes
        renováveis. Toque em cada parte:
      </P>
      <EnergyMix />
      <P>Os números mudam um pouco a cada ano, conforme chove mais ou menos e novas usinas são construídas.</P>
    </>,
  ),

  page(
    <>
      <H icon="☀️">Energia solar e economia de energia</H>
      <P>
        Os <T>painéis fotovoltaicos</T> transformam a luz do Sol diretamente em eletricidade. Eles podem ficar no telhado das casas, das escolas e até em grandes fazendas
        solares.
      </P>
      <Fig n="5.3" caption="A casa que gera a própria energia." h={21}>
        <SolarHomeArt />
      </Fig>
      <Cards
        items={[
          { icon: "💡", title: "LED", text: "As lâmpadas de LED gastam bem menos energia que as antigas." },
          { icon: "🔌", title: "Tire da tomada", text: "Aparelhos em espera também gastam um pouquinho de energia." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Renováveis (Sol, vento, água, biomassa) se renovam; fósseis (petróleo, carvão, gás) acabam e poluem.",
          "Nas usinas, algo gira a turbina, que gira o gerador e produz eletricidade.",
          "A matriz elétrica do Brasil é uma das mais limpas: mais de 80% vem de fontes renováveis.",
          "A maior parte vem das hidrelétricas; a energia solar é a que mais cresce.",
          "O ODS 7 quer energia limpa e acessível para todos.",
        ]}
      />
      <Glossary
        items={[
          ["Energia renovável", "Vem de fontes que a natureza repõe."],
          ["Matriz elétrica", "A mistura de fontes que geram a eletricidade."],
          ["Turbina", "A roda que gira com a água, o vento ou o vapor."],
          ["Gerador", "A máquina que transforma o giro em eletricidade."],
          ["Fotovoltaico", "Que transforma luz em eletricidade."],
        ]}
      />
      <Quiz
        items={[
          ["A energia eólica é renovável?", "Sim, ela vem do vento."],
          ["Por que a matriz elétrica do Brasil é considerada limpa?", "Porque a maior parte da eletricidade vem de fontes renováveis."],
          ["O que fazem os painéis fotovoltaicos?", "Transformam a luz do Sol diretamente em eletricidade."],
          ["Qual ODS trata de energia limpa e acessível?", "ODS 7."],
        ]}
      />
    </>,
  ),
];
