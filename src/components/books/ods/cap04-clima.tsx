"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Cloud, Globe, Kid, Sun, Tree } from "./art";

// ============================================================================
// CAPÍTULO 4 — O CLIMA DO PLANETA (missão "ODS: Clima e Energia Limpa", a
// parte do clima): o planeta com o termômetro subindo, a simulação do efeito
// estufa (de mexer), as fontes de gás carbônico e metano, a geleira
// derretendo com o mar subindo e a mesa da COP30 em Belém.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o planeta e o termômetro subindo
// ---------------------------------------------------------------------------

function WarmingOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="O planeta Terra com um termômetro ao lado, a temperatura subindo devagar e o Sol brilhando">
      <defs>
        <radialGradient id="ods-calor" cx="50%" cy="50%" r="50%">
          <stop offset="0.5" stopColor="#fb923c" stopOpacity="0" />
          <stop offset="1" stopColor="#f97316" stopOpacity="0.45" />
        </radialGradient>
      </defs>
      <rect width="460" height="300" fill="#fff7ed" />
      <Sun x={70} y={60} r={26} />
      <circle cx="220" cy="160" r="104" fill="url(#ods-calor)">
        <animate attributeName="r" values="96;112;96" dur="3s" repeatCount="indefinite" />
      </circle>
      <Globe x={220} y={160} r={80} />
      {/* o termômetro */}
      <g transform="translate(380 60)">
        <rect x="-12" y="0" width="24" height="170" rx="12" fill="#fff" stroke="#7c2d12" strokeWidth="3" />
        <circle cy="186" r="22" fill="#ef4444" stroke="#7c2d12" strokeWidth="3" />
        <rect x="-6" y="40" width="12" height="150" rx="6" fill="#ef4444">
          <animate attributeName="y" values="120;30;120" dur="6s" repeatCount="indefinite" />
          <animate attributeName="height" values="70;160;70" dur="6s" repeatCount="indefinite" />
        </rect>
        {[30, 70, 110, 150].map((y) => (
          <line key={y} x1="12" y1={y} x2="22" y2={y} stroke="#7c2d12" strokeWidth="2" />
        ))}
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A simulação do efeito estufa (de mexer)
// ---------------------------------------------------------------------------

const GAS_LEVELS = [
  { label: "Sem gases", temp: "−18 °C", trapped: 0, text: "Sem o efeito estufa, o calor escaparia todo para o espaço e a Terra seria uma bola de gelo." },
  { label: "Natural", temp: "15 °C", trapped: 2, text: "Uma camada natural de gases segura parte do calor: é ela que deixa a Terra quentinha para a vida." },
  { label: "Gases demais", temp: "subindo!", trapped: 4, text: "Com gases demais (da queima de combustíveis e do desmatamento), a Terra segura calor demais e esquenta." },
];

export function GreenhouseSim() {
  const [level, setLevel] = useState(1);
  const g = GAS_LEVELS[level];
  const rays = [0, 1, 2, 3, 4];
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.5em]">
      <svg key={level} viewBox="0 0 520 210" className="block w-full rounded-lg" aria-label={`Efeito estufa: ${g.label}`}>
        <rect width="520" height="210" fill="#0f172a" />
        <Sun x={460} y={40} r={20} />
        {/* a camada de gases */}
        <rect x="0" y="62" width="520" height={level === 0 ? 0 : 10 + level * 8} fill="#f97316" opacity={0.15 + level * 0.12} />
        {/* o chão */}
        <path d="M0 210 L0 170 Q260 150 520 170 L520 210 Z" fill={level === 2 ? "#a16207" : "#16a34a"} />
        {/* a luz do Sol chegando */}
        {[120, 220, 320].map((x, i) => (
          <line key={x} x1={x + 120} y1="0" x2={x} y2="168" stroke="#fde047" strokeWidth="3" strokeDasharray="10 8">
            <animate attributeName="stroke-dashoffset" values="0;-36" dur="1s" begin={`${-i * 0.3}s`} repeatCount="indefinite" />
          </line>
        ))}
        {/* o calor voltando: parte escapa, parte é segurada pelos gases */}
        {rays.map((k) => {
          const x = 70 + k * 95;
          const trapped = k < g.trapped;
          return (
            <path
              key={k}
              d={trapped ? `M${x} 165 Q${x + 18} 110 ${x + 10} 78 Q${x + 30} 110 ${x + 40} 160` : `M${x} 165 Q${x + 14} 100 ${x + 6} 0`}
              stroke="#ef4444"
              strokeWidth="3"
              fill="none"
              strokeDasharray="8 7"
            >
              <animate attributeName="stroke-dashoffset" values="0;-30" dur="0.9s" repeatCount="indefinite" />
            </path>
          );
        })}
        <text x="16" y="28" fontSize="14" fontWeight="900" fill="#fde68a" fontFamily="Georgia, serif">
          temperatura média: {g.temp}
        </text>
        {level > 0 && (
          <text x="16" y="56" fontSize="11.5" fontWeight="700" fill="#fdba74" fontFamily="Georgia, serif">
            camada de gases de efeito estufa
          </text>
        )}
      </svg>
      <div className="mt-[0.35em] flex flex-wrap justify-center gap-[0.3em] text-[0.85em]">
        {GAS_LEVELS.map((x, i) => (
          <button
            key={x.label}
            type="button"
            onClick={() => setLevel(i)}
            className={`rounded-full border px-[0.7em] py-[0.1em] font-bold ${level === i ? "border-[#c2410c] bg-[#c2410c] text-white" : "border-[#d9c79d] bg-white hover:bg-[#fff7ed]"}`}
          >
            {x.label}
          </button>
        ))}
      </div>
      <p key={`t${level}`} className="cg-anim-fade mt-[0.35em] rounded-lg bg-[#fff7ed] px-[0.7em] py-[0.3em] text-[0.86em] leading-[1.4] text-[#7c2d12]">
        {g.text}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// As fontes dos gases de efeito estufa
// ---------------------------------------------------------------------------

function SourcesArt() {
  const puff = (x: number, y: number, label: string, i: number) => (
    <g key={i}>
      {[0, 1].map((k) => (
        <g key={k}>
          <animateTransform attributeName="transform" type="translate" values="0 0;10 -50" dur="3s" begin={`${-(k * 1.5 + i * 0.4)}s`} repeatCount="indefinite" />
          <g opacity="0.8">
            <animate attributeName="opacity" values="0.85;0" dur="3s" begin={`${-(k * 1.5 + i * 0.4)}s`} repeatCount="indefinite" />
            <Cloud x={x} y={y} s={0.45} color="#64748b" />
            <text x={x} y={y + 5} textAnchor="middle" fontSize="10" fontWeight="900" fill="#fff" fontFamily="Georgia, serif">
              {label}
            </text>
          </g>
        </g>
      ))}
    </g>
  );
  return (
    <Art viewBox="0 0 560 220" label="Uma fábrica, um carro, um gado e uma queimada soltando gás carbônico e metano no ar">
      <rect width="560" height="220" rx="14" fill="#e2e8f0" />
      <rect y="176" width="560" height="44" fill="#a3a3a3" />
      {/* a fábrica */}
      <rect x="30" y="110" width="90" height="66" fill="#78716c" />
      <rect x="90" y="70" width="16" height="40" fill="#57534e" />
      {puff(98, 60, "CO₂", 0)}
      {/* o carro */}
      <g transform="translate(170 162)">
        <rect x="0" y="-18" width="70" height="20" rx="6" fill="#dc2626" />
        <path d="M12 -18 L22 -32 L50 -32 L60 -18 Z" fill="#fca5a5" />
        <circle cx="16" cy="4" r="8" fill="#1e293b" />
        <circle cx="54" cy="4" r="8" fill="#1e293b" />
      </g>
      {puff(162, 150, "CO₂", 1)}
      {/* o gado */}
      <g transform="translate(320 160)">
        <ellipse rx="34" ry="18" fill="#fafafa" stroke="#57534e" strokeWidth="2" />
        <circle cx="-14" cy="-4" r="6" fill="#1c1917" />
        <circle cx="10" cy="4" r="7" fill="#1c1917" />
        <ellipse cx="38" cy="-10" rx="12" ry="10" fill="#fafafa" stroke="#57534e" strokeWidth="2" />
        <path d="M-22 16 L-22 30 M-8 16 L-8 30 M12 16 L12 30 M24 16 L24 30" stroke="#57534e" strokeWidth="4" />
      </g>
      {puff(330, 120, "metano", 2)}
      {/* a queimada */}
      <Tree x={460} y={176} s={0.8} color="#3f6212" />
      <g transform="translate(460 176)">
        {[-18, 0, 18].map((dx, i) => (
          <path key={dx} d={`M${dx - 8} 0 Q${dx} -30 ${dx + 8} 0 Z`} fill="#f97316">
            <animate attributeName="d" values={`M${dx - 8} 0 Q${dx} -30 ${dx + 8} 0 Z;M${dx - 8} 0 Q${dx + 4} -40 ${dx + 8} 0 Z;M${dx - 8} 0 Q${dx} -30 ${dx + 8} 0 Z`} dur={`${0.6 + i * 0.15}s`} repeatCount="indefinite" />
          </path>
        ))}
      </g>
      {puff(470, 90, "CO₂", 3)}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A geleira derretendo e o mar subindo
// ---------------------------------------------------------------------------

function MeltingArt() {
  return (
    <Art viewBox="0 0 560 220" label="Uma geleira derretendo e pingando no mar, o nível do mar subindo e chegando perto das casas da praia">
      <rect width="560" height="220" rx="14" fill="#e0f2fe" />
      {/* a geleira encolhendo */}
      <path fill="#f8fafc" stroke="#7dd3fc" strokeWidth="3">
        <animate attributeName="d" values="M20 160 L60 60 L120 90 L170 50 L220 160 Z;M40 160 L70 100 L120 115 L160 95 L200 160 Z;M20 160 L60 60 L120 90 L170 50 L220 160 Z" dur="8s" repeatCount="indefinite" />
      </path>
      {[80, 130, 175].map((x, i) => (
        <circle key={x} cx={x} r="3.5" fill="#38bdf8">
          <animate attributeName="cy" values="150;175" dur="1.2s" begin={`${-i * 0.4}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0" dur="1.2s" begin={`${-i * 0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* as casas da praia */}
      <rect x="420" y="128" width="40" height="36" fill="#fde68a" stroke="#92400e" strokeWidth="2" />
      <path d="M414 128 L440 108 L466 128 Z" fill="#dc2626" />
      <rect x="480" y="122" width="44" height="42" fill="#fecaca" stroke="#92400e" strokeWidth="2" />
      <path d="M474 122 L502 100 L530 122 Z" fill="#b91c1c" />
      <path d="M380 166 L560 166 L560 220 L380 220 Z" fill="#fcd34d" />
      {/* o mar subindo */}
      <rect x="0" width="560" fill="#0ea5e9" opacity="0.85">
        <animate attributeName="y" values="172;150;172" dur="8s" repeatCount="indefinite" />
        <animate attributeName="height" values="48;70;48" dur="8s" repeatCount="indefinite" />
      </rect>
      <g fontFamily="Georgia, serif" fontSize="12.5" fontWeight="900">
        <text x="250" y="40" fill="#0c4a6e">o gelo derrete...</text>
        <text x="250" y="60" fill="#0c4a6e">... e o nível do mar sobe</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A COP30 em Belém
// ---------------------------------------------------------------------------

function CopArt() {
  const shirts = ["#2563eb", "#16a34a", "#dc2626", "#f59e0b", "#7c3aed", "#0d9488"];
  const skins = ["#f1c9a5", "#8d5524", "#d6a77a", "#5c3a1e", "#e0ac69", "#c68642"];
  return (
    <Art viewBox="0 0 560 220" label="Representantes de vários países em volta de uma grande mesa redonda, com a faixa da COP30 em Belém, na Amazônia, em 2025">
      <rect width="560" height="220" rx="14" fill="#ecfdf5" />
      <Tree x={40} y={210} s={1.1} color="#15803d" />
      <Tree x={520} y={210} s={1.1} color="#15803d" />
      <rect x="150" y="20" width="260" height="40" rx="8" fill="#047857" />
      <text x="280" y="46" textAnchor="middle" fontSize="16" fontWeight="900" fill="#fff" fontFamily="Georgia, serif">
        COP30 · Belém · 2025
      </text>
      <ellipse cx="280" cy="150" rx="150" ry="40" fill="#92400e" />
      <ellipse cx="280" cy="146" rx="150" ry="40" fill="#b45309" />
      <Globe x={280} y={140} r={24} />
      {shirts.map((shirt, i) => {
        const a = Math.PI + (i / (shirts.length - 1)) * Math.PI;
        const x = 280 + Math.cos(a) * 165;
        const y = 150 + Math.sin(a) * 50;
        return <Kid key={i} x={x} y={y + 6} s={0.6} shirt={shirt} skin={skins[i]} />;
      })}
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
      title="O Clima do Planeta"
      goals={["Como funciona o efeito estufa", "Quais gases esquentam o planeta e de onde eles vêm", "As consequências do aquecimento global", "O que o mundo está fazendo: IPCC, Acordo de Paris e COP30"]}
    >
      <Fig h={34}>
        <WarmingOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🌡️">O efeito estufa</H>
      <P>
        A luz do Sol aquece a Terra, e o calor volta para o espaço. Alguns gases do ar seguram parte desse calor, como o vidro de uma estufa de plantas: é o{" "}
        <T>efeito estufa</T>. Ele é natural e necessário. O problema é quando ele fica forte demais. Escolha:
      </P>
      <GreenhouseSim />
      <Box kind="lembre">
        O efeito estufa é bom: sem ele, a Terra seria gelada. O que está errado é o <strong>excesso</strong> de gases, que causa o <strong>aquecimento global</strong>.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🏭">De onde vêm os gases</H>
      <P>
        O principal gás de efeito estufa é o <T>gás carbônico (CO₂)</T>, liberado pela queima de <T>combustíveis fósseis</T>, como gasolina, diesel e carvão. O{" "}
        <T>metano</T>, liberado pelo gado e pelo lixo, também é muito potente.
      </P>
      <Fig n="4.1" caption="Fábricas, carros, gado e queimadas soltam gases de efeito estufa." h={22}>
        <SourcesArt />
      </Fig>
      <P>
        <T>Desmatar e queimar florestas</T> libera o carbono guardado nas árvores e ainda diminui quem absorve o CO₂. No Brasil, o desmatamento é uma das maiores fontes
        de emissões.
      </P>
    </>,
  ),

  page(
    <>
      <H icon="🌊">As consequências</H>
      <P>
        Com o <T>aquecimento global</T>, as geleiras derretem e o <T>nível do mar sobe</T>, ameaçando cidades do litoral. Também aumentam os{" "}
        <T>eventos extremos</T>: secas, ondas de calor, tempestades e enchentes.
      </P>
      <Fig n="4.2" caption="O gelo derretendo faz o mar subir." h={22}>
        <MeltingArt />
      </Fig>
      <Box kind="sabia">
        A <strong>pegada de carbono</strong> é a quantidade de gases de efeito estufa que uma pessoa, empresa ou produto emite. Transporte, energia e alimentação mudam a
        pegada de cada um.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🌎">O mundo contra a mudança do clima</H>
      <P>
        O <T>IPCC</T>, ligado à ONU, reúne cientistas do mundo todo, e seus relatórios mostram que o aquecimento atual é causado pelas atividades humanas. Em 2015, os
        países assinaram o <T>Acordo de Paris</T> para limitar o aquecimento do planeta.
      </P>
      <Fig n="4.3" caption="Em 2025, a conferência do clima da ONU aconteceu na Amazônia." h={22}>
        <CopArt />
      </Fig>
      <Cards
        items={[
          { icon: "🌳", title: "COP30", text: "A conferência do clima de 2025 foi em Belém do Pará." },
          { icon: "🎯", title: "ODS 13", text: "Pede ação urgente contra a mudança global do clima." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "O efeito estufa natural mantém a Terra quente; o excesso de gases causa o aquecimento global.",
          "O CO₂ vem da queima de combustíveis fósseis; o metano, do gado e do lixo.",
          "Desmatar e queimar florestas libera carbono e piora o problema.",
          "Consequências: geleiras derretendo, mar subindo e mais eventos extremos.",
          "IPCC, Acordo de Paris (2015) e COP30 em Belém (2025); o ODS 13 trata do clima.",
        ]}
      />
      <Glossary
        items={[
          ["Efeito estufa", "Gases do ar que seguram parte do calor da Terra."],
          ["Aquecimento global", "O aumento da temperatura média do planeta."],
          ["Combustível fóssil", "Petróleo, carvão e gás natural, formados há milhões de anos."],
          ["Pegada de carbono", "Os gases de efeito estufa emitidos por alguém ou algo."],
          ["IPCC", "O grupo de cientistas da ONU que estuda o clima."],
        ]}
      />
      <Quiz
        items={[
          ["Qual é o principal gás do aumento do efeito estufa?", "O gás carbônico (CO₂)."],
          ["Cite uma consequência do aquecimento global.", "O derretimento das geleiras e a subida do nível do mar."],
          ["Em que cidade foi a COP30?", "Em Belém, no Pará, em 2025."],
          ["Qual é o número do ODS da ação contra a mudança do clima?", "ODS 13."],
        ]}
      />
    </>,
  ),
];
