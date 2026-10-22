"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { ChoiceGame } from "../portugues/art";
import { Cloud } from "../ods/art";
import { GEO, GEO_DARK, Mountain, Panel, Pill } from "./art";

// ============================================================================
// CAPÍTULO 8 — ECONOMIA E ENERGIA (missão "Geografia: Meio Ambiente e
// Energia", a parte das fontes de energia e do agronegócio): as usinas
// eólica, solar e hidrelétrica funcionando, o jogo dos setores da economia,
// a colheitadeira na lavoura e a matriz elétrica do Brasil e do mundo (de
// tocar).
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: as usinas de energia
// ---------------------------------------------------------------------------

function Turbine({ x, y, s = 1, dur = 3 }: { x: number; y: number; s?: number; dur?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-3 0 L-1.5 -90 L1.5 -90 L3 0 Z" fill="#f1f5f9" stroke="#94a3b8" />
      <g transform="translate(0 -90)">
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur={`${dur}s`} repeatCount="indefinite" />
          {[0, 120, 240].map((a) => (
            <path key={a} d="M0 0 L-4 -6 L0 -46 L4 -6 Z" fill="#fff" stroke="#94a3b8" transform={`rotate(${a})`} />
          ))}
        </g>
        <circle r="4" fill="#64748b" />
      </g>
    </g>
  );
}

function EnergyOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Turbinas eólicas girando num morro, painéis solares brilhando ao Sol e uma represa de hidrelétrica com a água descendo pelas turbinas">
      <rect width="460" height="300" fill="#bae6fd" />
      <circle cx="400" cy="50" r="26" fill="#fde047" stroke="#f59e0b" strokeWidth="3" />
      <Cloud x={120} y={40} s={0.9} />
      <path d="M0 180 Q120 120 240 170 L240 300 L0 300 Z" fill="#86efac" />
      <Turbine x={60} y={168} s={0.9} dur={3} />
      <Turbine x={140} y={150} s={1} dur={2.4} />
      <Turbine x={210} y={162} s={0.8} dur={3.4} />
      {[0, 1, 2].map((k) => (
        <g key={k} transform={`translate(${30 + k * 66} 250)`}>
          <path d="M0 0 L50 0 L60 -24 L10 -24 Z" fill="#1e3a8a" stroke="#93c5fd" strokeWidth="1.5" />
          <path d="M20 -24 L14 0 M40 -24 L34 0 M5 -12 L55 -12" stroke="#93c5fd" />
          <path d="M10 -24 L60 -24" stroke="#fff" strokeWidth="2">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" begin={`${-k * 0.5}s`} repeatCount="indefinite" />
          </path>
        </g>
      ))}
      <Mountain x={360} y={300} w={220} h={170} color="#a8a29e" snow={false} />
      <rect x="300" y="160" width="160" height="70" fill="#0ea5e9" />
      <path d="M290 150 L300 150 L320 300 L280 300 Z" fill="#d6d3d1" stroke="#78716c" strokeWidth="2" />
      {[0, 1, 2].map((k) => (
        <path key={k} d="M300 240 Q260 260 250 300" fill="none" stroke="#38bdf8" strokeWidth="6" strokeDasharray="12 10">
          <animate attributeName="stroke-dashoffset" values="44;0" dur="0.8s" begin={`${-k * 0.25}s`} repeatCount="indefinite" />
        </path>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O jogo dos setores da economia
// ---------------------------------------------------------------------------

const SECTORS = ["Primário", "Secundário", "Terciário"];
const SECTOR_GAME = [
  { prompt: "🌾 Um agricultor que planta soja.", options: SECTORS, answer: 0, explain: "Tira o produto direto da natureza: setor primário." },
  { prompt: "🏭 Uma fábrica que monta carros.", options: SECTORS, answer: 1, explain: "Transforma matéria-prima em produto: setor secundário (indústria)." },
  { prompt: "🏫 Uma professora dando aula.", options: SECTORS, answer: 2, explain: "Presta um serviço: setor terciário." },
  { prompt: "⛏️ Uma mina que extrai minério de ferro.", options: SECTORS, answer: 0, explain: "A mineração (extrativismo) é do setor primário." },
  { prompt: "🛒 Um supermercado vendendo alimentos.", options: SECTORS, answer: 2, explain: "O comércio é do setor terciário." },
];

// ---------------------------------------------------------------------------
// A colheitadeira na lavoura
// ---------------------------------------------------------------------------

function HarvestArt() {
  return (
    <Art viewBox="0 0 560 170" label="Uma colheitadeira verde andando numa lavoura de soja e enchendo um caminhão, com um silo ao fundo">
      <rect width="560" height="170" rx="14" fill="#fef9c3" />
      <rect x="450" y="40" width="50" height="90" rx="10" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
      <path d="M450 46 Q475 20 500 46" fill="#94a3b8" stroke="#64748b" strokeWidth="2" />
      <rect y="120" width="560" height="50" fill="#a3e635" />
      {Array.from({ length: 28 }, (_, i) => (
        <path key={i} d={`M${i * 20 + 6} 128 q4 -12 8 0`} fill="#65a30d" />
      ))}
      <g>
        <animateTransform attributeName="transform" type="translate" values="-40 0;300 0;-40 0" dur="10s" repeatCount="indefinite" />
        <g transform="translate(60 120)">
          <rect x="0" y="-46" width="80" height="34" rx="6" fill="#16a34a" stroke="#14532d" strokeWidth="2" />
          <rect x="50" y="-66" width="28" height="22" rx="3" fill="#bbf7d0" stroke="#14532d" strokeWidth="2" />
          <rect x="80" y="-24" width="30" height="14" fill="#facc15" stroke="#a16207" />
          <circle cx="20" cy="-6" r="12" fill="#1e293b" />
          <circle cx="66" cy="-6" r="8" fill="#1e293b" />
          <path d="M10 -46 L-20 -70" stroke="#14532d" strokeWidth="5" />
          {[0, 1, 2].map((k) => (
            <circle key={k} cx="-20" r="3" fill="#ca8a04">
              <animate attributeName="cy" values="-70;-50" dur="0.6s" begin={`${-k * 0.2}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A matriz elétrica (de tocar)
// ---------------------------------------------------------------------------

const SOURCES: Record<string, { color: string; renewable: boolean }> = {
  Hidrelétrica: { color: "#0ea5e9", renewable: true },
  Eólica: { color: "#94a3b8", renewable: true },
  Solar: { color: "#facc15", renewable: true },
  Biomassa: { color: "#65a30d", renewable: true },
  "Gás natural": { color: "#f97316", renewable: false },
  Carvão: { color: "#44403c", renewable: false },
  Nuclear: { color: "#a855f7", renewable: false },
  Outras: { color: "#d6d3d1", renewable: false },
};

const MIX: Record<string, Record<string, number>> = {
  Brasil: { Hidrelétrica: 60, Eólica: 13, Solar: 7, Biomassa: 8, "Gás natural": 7, Carvão: 1, Nuclear: 2, Outras: 2 },
  Mundo: { Hidrelétrica: 15, Eólica: 8, Solar: 5, Biomassa: 2, "Gás natural": 23, Carvão: 35, Nuclear: 9, Outras: 3 },
};

export function EnergyMix() {
  const [where, setWhere] = useState<keyof typeof MIX>("Brasil");
  const mix = MIX[where];
  const renewable = Object.entries(mix)
    .filter(([k]) => SOURCES[k].renewable)
    .reduce((s, [, v]) => s + v, 0);
  return (
    <Panel title="De onde vem a eletricidade?">
      <div className="mb-[0.4em] flex justify-center gap-[0.3em]">
        {Object.keys(MIX).map((k) => (
          <Pill key={k} on={where === k} onClick={() => setWhere(k as keyof typeof MIX)}>
            {k}
          </Pill>
        ))}
      </div>
      <div className="flex h-[1.8em] overflow-hidden rounded-lg border border-[#d9c79d]">
        {Object.entries(mix).map(([k, v]) => (
          <div key={k} className="transition-all duration-500" style={{ width: `${v}%`, background: SOURCES[k].color }} title={`${k}: ${v}%`} />
        ))}
      </div>
      <div className="mt-[0.4em] grid grid-cols-2 gap-x-[0.8em] gap-y-[0.1em] text-[0.78em]">
        {Object.entries(mix).map(([k, v]) => (
          <span key={k} className="flex items-center gap-[0.3em]">
            <span className="inline-block h-[0.8em] w-[0.8em] rounded-sm" style={{ background: SOURCES[k].color }} />
            {k}: <strong>{v}%</strong> {SOURCES[k].renewable ? "♻️" : ""}
          </span>
        ))}
      </div>
      <p className="mt-[0.3em] text-center text-[0.9em] font-bold" style={{ color: GEO_DARK }}>
        ♻️ Renováveis: {renewable}%
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 8, content, bare });

export const chapter8: BookPage[] = [
  page(
    <ChapterOpener n={8} title="Economia e Energia" goals={["Os setores da economia", "O agronegócio e a agricultura familiar", "As fontes de energia renováveis e não renováveis", "A matriz elétrica do Brasil"]}>
      <Fig h={34}>
        <EnergyOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🏭">Os setores da economia</H>
      <P>
        O <T>setor primário</T> tira produtos da natureza (agricultura, pecuária, pesca, mineração). O <T>secundário</T> transforma esses produtos (a indústria). O{" "}
        <T>terciário</T> oferece serviços e comércio. Classifique:
      </P>
      <ChoiceGame items={SECTOR_GAME} color={GEO} title="Qual é o setor?" />
      <Box kind="sabia">
        Hoje o setor terciário é o que mais emprega no Brasil: lojas, escolas, hospitais, bancos, transporte e tecnologia.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🌾">O agronegócio</H>
      <P>
        O <T>agronegócio</T> junta a produção no campo, a indústria que fornece máquinas e adubos e a que processa os alimentos. O Brasil é um dos maiores exportadores
        do mundo de <T>soja</T>, <T>café</T>, <T>carne</T>, açúcar e suco de laranja.
      </P>
      <Fig n="8.1" caption="A colheita mecanizada da soja." h={18}>
        <HarvestArt />
      </Fig>
      <Box kind="lembre">
        As grandes fazendas exportam muito, mas boa parte dos alimentos da mesa dos brasileiros, como feijão, mandioca e verduras, vem da{" "}
        <strong>agricultura familiar</strong>.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="⚡">As fontes de energia</H>
      <P>
        As fontes <T>renováveis</T> se refazem na natureza: água, vento, Sol e biomassa. As <T>não renováveis</T> acabam um dia e poluem mais: petróleo, carvão e gás
        natural (os <T>combustíveis fósseis</T>). Compare a eletricidade do Brasil com a do mundo:
      </P>
      <EnergyMix />
      <Box kind="mago" title="O Brasil sai na frente">
        Graças aos rios, o Brasil tem uma das matrizes elétricas mais limpas do mundo: quase 9 de cada 10 lâmpadas acendem com energia renovável.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="⚖️">Cada fonte tem prós e contras</H>
      <Table
        head={["Fonte", "Vantagem", "Problema"]}
        rows={[
          ["Hidrelétrica", "Renovável e barata", "A represa alaga florestas e desaloja pessoas"],
          ["Eólica", "Limpa; forte no Nordeste", "Depende do vento; muda a paisagem"],
          ["Solar", "Limpa; dá para pôr no telhado", "Só gera de dia; precisa de baterias"],
          ["Petróleo", "Muita energia num litro", "Polui e aumenta o efeito estufa"],
          ["Nuclear", "Não solta gás carbônico", "Lixo radioativo e risco de acidentes"],
        ]}
      />
      <Box kind="sabia">
        O <strong>pré-sal</strong> é uma camada de petróleo a mais de 5 km de profundidade no fundo do mar do Sudeste. O Brasil também usa muito <strong>etanol</strong>, o
        álcool da cana-de-açúcar, nos carros.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Primário: tira da natureza; secundário: transforma; terciário: serviços e comércio.",
          "O Brasil é um grande exportador de soja, café e carne.",
          "A agricultura familiar produz boa parte dos alimentos da mesa.",
          "Renováveis: água, vento, Sol e biomassa. Fósseis: petróleo, carvão e gás.",
          "A eletricidade do Brasil vem principalmente das hidrelétricas.",
        ]}
      />
      <Glossary
        items={[
          ["Setor primário", "Atividades que tiram produtos da natureza."],
          ["Agronegócio", "A cadeia da produção agropecuária e da indústria ligada a ela."],
          ["Energia renovável", "Energia de fontes que se refazem na natureza."],
          ["Combustível fóssil", "Petróleo, carvão e gás, formados há milhões de anos."],
          ["Matriz elétrica", "O conjunto das fontes que geram a eletricidade."],
        ]}
      />
      <Quiz
        items={[
          ["Uma fábrica de móveis é de qual setor?", "Do secundário (indústria)."],
          ["Cite três fontes renováveis de energia.", "Água (hidrelétrica), vento (eólica) e Sol (solar)."],
          ["De onde vem a maior parte da eletricidade do Brasil?", "Das hidrelétricas."],
          ["O que é o pré-sal?", "Uma camada de petróleo bem funda no fundo do mar."],
        ]}
      />
    </>,
  ),
];
