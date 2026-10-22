"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Tree } from "../ods/art";
import { GEO, GEO_DARK, Panel, Slider } from "./art";

// ============================================================================
// CAPÍTULO 10 — MEIO AMBIENTE (missão "Geografia: Meio Ambiente e Energia",
// a parte das mudanças climáticas e dos acordos ambientais): a Terra com
// febre, o efeito estufa (de tocar), a geleira derretendo, a floresta
// desmatada e a linha do tempo dos acordos ambientais (de tocar).
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a Terra com febre
// ---------------------------------------------------------------------------

function FeverOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="A Terra com um termômetro na boca, o mercúrio subindo, gotas de suor e ondas de calor em volta">
      <rect width="460" height="300" fill="#fee2e2" />
      {[0, 1, 2].map((k) => (
        <circle key={k} cx="210" cy="160" r="100" fill="none" stroke="#f97316" strokeWidth="3">
          <animate attributeName="r" values="100;150" dur="3s" begin={`${-k}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0" dur="3s" begin={`${-k}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <circle cx="210" cy="160" r="100" fill="#38bdf8" stroke={GEO_DARK} strokeWidth="3" />
      <path d="M150 90 Q190 70 220 100 Q200 130 170 130 Q150 120 150 90 Z M230 160 Q270 150 290 180 Q270 220 240 230 Q230 200 230 160 Z M130 170 Q160 160 170 190 Q150 210 130 200 Z" fill="#4ade80" stroke="#15803d" />
      <circle cx="180" cy="150" r="9" fill="#1e293b" />
      <circle cx="240" cy="150" r="9" fill="#1e293b" />
      <path d="M190 200 Q210 190 230 200" stroke="#1e293b" strokeWidth="4" fill="none" />
      <g transform="translate(250 196) rotate(-30)">
        <rect x="0" y="-6" width="120" height="12" rx="6" fill="#fff" stroke="#475569" strokeWidth="2" />
        <rect x="4" y="-3" width="60" height="6" rx="3" fill="#dc2626">
          <animate attributeName="width" values="30;110;30" dur="4s" repeatCount="indefinite" />
        </rect>
        <circle r="10" fill="#dc2626" stroke="#475569" strokeWidth="2" />
      </g>
      {[0, 1].map((k) => (
        <path key={k} d="M0 0 Q-6 10 0 14 Q6 10 0 0 Z" fill="#7dd3fc" transform={`translate(${150 + k * 130} 110)`}>
          <animateTransform attributeName="transform" type="translate" values={`${150 + k * 130} 100;${150 + k * 130} 140`} dur="1.6s" begin={`${-k * 0.8}s`} repeatCount="indefinite" />
        </path>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O efeito estufa (de tocar)
// ---------------------------------------------------------------------------

export function Greenhouse() {
  const [co2, setCo2] = useState(420);
  const trapped = Math.round(((co2 - 250) / 350) * 6) + 1;
  const warming = Math.max(0, ((co2 - 280) / 140) * 1.2);
  return (
    <Panel title="Mude o gás carbônico na atmosfera">
      <svg viewBox="0 0 400 170" className="w-full" role="img" aria-label={`Com ${co2} ppm de gás carbônico, o calor preso deixa a Terra ${warming.toFixed(1)} grau mais quente`}>
        <rect width="400" height="170" rx="10" fill="#e0f2fe" />
        <circle cx="40" cy="30" r="18" fill="#fde047" stroke="#f59e0b" strokeWidth="2" />
        <path d="M0 70 Q200 40 400 70" fill="none" stroke="#94a3b8" strokeWidth={2 + co2 / 60} opacity="0.55" />
        <text x="150" y="40" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569">camada de gases</text>
        <rect y="140" width="400" height="30" fill="#86efac" />
        <line x1="60" y1="40" x2="170" y2="140" stroke="#facc15" strokeWidth="3" />
        {Array.from({ length: 7 }, (_, i) => (
          <path
            key={i}
            d={`M${190 + i * 26} 140 L${200 + i * 26} 64 ${i < trapped ? `L${214 + i * 26} 120` : `L${206 + i * 26} 10`}`}
            fill="none"
            stroke={i < trapped ? "#ef4444" : "#fb923c"}
            strokeWidth="2.5"
            strokeDasharray="6 4"
          >
            <animate attributeName="stroke-dashoffset" values="20;0" dur="0.8s" repeatCount="indefinite" />
          </path>
        ))}
        <text x="16" y="160" fontSize="11" fontWeight="900" fill="#14532d">chão aquecido</text>
      </svg>
      <Slider label="CO₂ (ppm)" value={co2} min={280} max={600} step={10} onChange={setCo2} />
      <p className="mt-[0.2em] text-center text-[0.86em]">
        {co2 <= 290 ? "Como em 1850, antes das fábricas: " : co2 <= 430 ? "Como hoje: " : "Se continuarmos poluindo: "}a Terra fica cerca de{" "}
        <strong style={{ color: warming > 1.5 ? "#b91c1c" : GEO_DARK }}>+{warming.toFixed(1).replace(".", ",")} °C</strong> mais quente.
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// A geleira derretendo e o mar subindo
// ---------------------------------------------------------------------------

function MeltArt() {
  return (
    <Art viewBox="0 0 560 170" label="Uma geleira derretendo e pingando no mar, e o nível do mar subindo devagar perto das casas do litoral">
      <rect width="560" height="170" rx="14" fill="#e0f2fe" />
      <path d="M0 100 L40 40 L90 60 L130 30 L180 70 L200 110 L0 110 Z" fill="#f8fafc" stroke="#93c5fd" strokeWidth="2" />
      {[0, 1, 2].map((k) => (
        <circle key={k} cx={150 + k * 18} r="3" fill="#38bdf8">
          <animate attributeName="cy" values="90;120" dur="1s" begin={`${-k * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <rect x="0" y="118" width="560" height="52" fill="#0ea5e9">
        <animate attributeName="y" values="122;108;122" dur="8s" repeatCount="indefinite" />
      </rect>
      <rect x="400" y="100" width="160" height="70" fill="#d6b77a" />
      {[420, 470, 520].map((x) => (
        <g key={x} transform={`translate(${x} 100)`}>
          <rect x="-14" y="-22" width="28" height="22" fill="#fde68a" stroke="#78350f" />
          <path d="M-18 -22 L0 -36 L18 -22 Z" fill="#b91c1c" />
        </g>
      ))}
      <text x="280" y="40" textAnchor="middle" fontSize="14" fontWeight="900" fill={GEO_DARK} fontFamily="Georgia, serif">
        o gelo derrete e o mar sobe
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A floresta desmatada
// ---------------------------------------------------------------------------

function DeforestArt() {
  return (
    <Art viewBox="0 0 560 160" label="Uma floresta com um pedaço derrubado no meio, com tocos de árvores, fumaça de queimada e gado pastando onde era mata">
      <rect width="560" height="160" rx="14" fill="#fef3c7" />
      {Array.from({ length: 5 }, (_, i) => (
        <Tree key={`a${i}`} x={30 + i * 40} y={130} s={1} color={i % 2 ? "#166534" : "#15803d"} />
      ))}
      {Array.from({ length: 4 }, (_, i) => (
        <Tree key={`b${i}`} x={420 + i * 40} y={130} s={1} color={i % 2 ? "#166534" : "#15803d"} />
      ))}
      <rect x="220" y="120" width="180" height="40" fill="#d6b77a" />
      {[240, 280, 330, 370].map((x) => (
        <rect key={x} x={x} y="114" width="10" height="10" fill="#92400e" />
      ))}
      {[0, 1, 2].map((k) => (
        <circle key={k} cx={300} r={14} fill="#57534e" opacity="0.6">
          <animate attributeName="cy" values="110;20" dur="3s" begin={`${-k}s`} repeatCount="indefinite" />
          <animate attributeName="r" values="8;26" dur="3s" begin={`${-k}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0" dur="3s" begin={`${-k}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <path d="M290 120 Q296 100 300 112 Q306 96 312 120 Z" fill="#f97316">
        <animate attributeName="opacity" values="1;0.6;1" dur="0.5s" repeatCount="indefinite" />
      </path>
      <g transform="translate(350 142)">
        <ellipse rx="16" ry="9" cy="-10" fill="#fff" stroke="#44403c" />
        <circle cx="16" cy="-14" r="6" fill="#fff" stroke="#44403c" />
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A linha do tempo dos acordos (de tocar)
// ---------------------------------------------------------------------------

const AGREEMENTS = [
  { year: "1972", name: "Estocolmo", text: "A primeira grande conferência da ONU sobre o meio ambiente, na Suécia." },
  { year: "1992", name: "Rio-92", text: "A ECO-92, no Rio de Janeiro, reuniu mais de 170 países e criou a Agenda 21 e a ideia de desenvolvimento sustentável." },
  { year: "1997", name: "Kyoto", text: "O Protocolo de Kyoto, no Japão, criou metas para os países ricos diminuírem os gases do efeito estufa." },
  { year: "2015", name: "Paris", text: "O Acordo de Paris: quase todos os países se comprometeram a segurar o aquecimento bem abaixo de 2 °C, de preferência em 1,5 °C." },
  { year: "2025", name: "COP30", text: "A conferência do clima da ONU aconteceu em Belém, no Pará, na Amazônia brasileira." },
];

export function AgreementTimeline() {
  const [sel, setSel] = useState(3);
  const a = AGREEMENTS[sel];
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <div className="relative flex justify-between">
        <div className="absolute left-[5%] right-[5%] top-[0.95em] h-[3px] bg-[#d9c79d]" />
        {AGREEMENTS.map((x, i) => (
          <button key={x.year} type="button" onClick={() => setSel(i)} className="relative flex flex-col items-center" title={x.name}>
            <span
              className={`flex h-[1.9em] w-[1.9em] items-center justify-center rounded-full border-2 text-[0.62em] font-black text-white transition-transform ${sel === i ? "scale-125" : ""}`}
              style={{ background: GEO, borderColor: sel === i ? "#1e293b" : "#fff" }}
            >
              {x.year.slice(2)}
            </span>
            <span className="mt-[0.2em] text-[0.62em] font-bold text-[#5b4a2e]">{x.name}</span>
          </button>
        ))}
      </div>
      <div key={sel} className="cg-anim-fade mt-[0.5em] rounded-lg px-[0.7em] py-[0.4em]" style={{ background: "#ecfeff", borderLeft: `5px solid ${GEO}` }}>
        <p className="cg-book-title font-black" style={{ color: GEO_DARK }}>
          {a.year} · {a.name}
        </p>
        <p className="text-[0.88em] leading-[1.45] text-[#2b2113]">{a.text}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 10, content, bare });

export const chapter10: BookPage[] = [
  page(
    <ChapterOpener n={10} title="Meio Ambiente" goals={["O efeito estufa natural e o aquecimento global", "As consequências das mudanças climáticas", "O desmatamento e as queimadas", "Os acordos ambientais e o que você pode fazer"]}>
      <Fig h={34}>
        <FeverOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🔥">O efeito estufa</H>
      <P>
        Alguns gases da atmosfera, como o <T>gás carbônico</T> (CO₂) e o metano, seguram parte do calor do Sol, como o vidro de uma estufa. Esse <T>efeito estufa</T>{" "}
        natural é bom: sem ele, a Terra seria gelada. O problema é que queimar combustíveis fósseis e florestas aumenta esses gases e <T>esquenta</T> o planeta.
      </P>
      <Greenhouse />
    </>,
  ),

  page(
    <>
      <H icon="🌡️">As mudanças climáticas</H>
      <P>
        O <T>aquecimento global</T> muda o clima do planeta todo. A Terra já está cerca de 1,2 °C mais quente que antes das fábricas, e as consequências já aparecem:
      </P>
      <Fig n="10.1" caption="O gelo derrete e o nível do mar sobe." h={18}>
        <MeltArt />
      </Fig>
      <Cards
        items={[
          { icon: "❄️", title: "Gelo derretendo", text: "As geleiras e os polos perdem gelo e o mar sobe." },
          { icon: "🌀", title: "Eventos extremos", text: "Mais ondas de calor, secas fortes e tempestades." },
          { icon: "🌾", title: "Agricultura", text: "Secas e chuvas fora de época estragam as colheitas." },
          { icon: "🐾", title: "Biodiversidade", text: "Animais e plantas perdem o lugar onde vivem." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🌲">O desmatamento e as queimadas</H>
      <P>
        O <T>desmatamento</T> derruba florestas para abrir pastos, plantações, garimpos e estradas, ou para vender madeira. As <T>queimadas</T> soltam muito gás carbônico
        e fumaça. No Brasil, o desmatamento é a maior fonte de gases do efeito estufa.
      </P>
      <Fig n="10.2" caption="A floresta derrubada vira pasto." h={18}>
        <DeforestArt />
      </Fig>
      <Box kind="atencao">
        Sem a floresta, o solo sofre erosão, os rios secam, os animais perdem a casa e os rios voadores enfraquecem. Recuperar uma floresta leva muitas décadas.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🤝">Os acordos ambientais</H>
      <P>Os problemas ambientais não respeitam fronteiras, por isso os países fazem acordos juntos. Toque em cada ano:</P>
      <AgreementTimeline />
      <P>E você também pode ajudar:</P>
      <List
        items={[
          "Andar a pé, de bicicleta ou de transporte público sempre que der.",
          "Economizar energia: apagar a luz e tirar os aparelhos da tomada.",
          "Reduzir, reutilizar e reciclar, e evitar o desperdício de comida.",
          "Plantar árvores e cuidar das áreas verdes da sua cidade.",
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "O efeito estufa natural mantém a Terra quente; o excesso de gases causa o aquecimento global.",
          "O aquecimento derrete o gelo, sobe o mar e aumenta os eventos extremos.",
          "No Brasil, o desmatamento é a maior fonte de gases do efeito estufa.",
          "Rio-92, Kyoto e o Acordo de Paris são marcos da luta pelo clima.",
          "A COP30, conferência do clima da ONU, aconteceu em Belém em 2025.",
        ]}
      />
      <Glossary
        items={[
          ["Efeito estufa", "A retenção do calor do Sol pelos gases da atmosfera."],
          ["Aquecimento global", "O aumento da temperatura média da Terra."],
          ["Desmatamento", "A derrubada das florestas."],
          ["Desenvolvimento sustentável", "Crescer sem destruir os recursos das próximas gerações."],
          ["COP", "A conferência anual da ONU sobre o clima."],
        ]}
      />
      <Quiz
        items={[
          ["O efeito estufa natural é bom ou ruim?", "Bom: sem ele a Terra seria gelada. O problema é o excesso de gases."],
          ["Qual é a maior fonte de gases do efeito estufa no Brasil?", "O desmatamento."],
          ["Qual conferência ambiental aconteceu no Rio de Janeiro em 1992?", "A Rio-92 (ECO-92)."],
          ["Qual acordo, de 2015, tenta limitar o aquecimento a 1,5 °C?", "O Acordo de Paris."],
        ]}
      />
    </>,
  ),
];
