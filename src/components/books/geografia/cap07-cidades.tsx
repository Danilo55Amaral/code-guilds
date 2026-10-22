"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Tree } from "../ods/art";
import { Building, GEO, GEO_DARK, House, Panel, Pill, Slider } from "./art";

// ============================================================================
// CAPÍTULO 7 — CIDADES E URBANIZAÇÃO (missão "Geografia: População e
// Cidades", a parte das cidades): os prédios crescendo ao lado do campo, a
// urbanização do Brasil de 1940 a 2020 (de tocar), a rede urbana pulsando,
// os problemas das cidades e as soluções (de tocar) e a cidade sustentável.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a cidade crescendo
// ---------------------------------------------------------------------------

function CityOpenerArt() {
  const heights = [90, 140, 70, 180, 120, 160, 100];
  return (
    <Art viewBox="0 0 460 300" label="Do lado esquerdo o campo com casinhas e árvores; do lado direito os prédios da cidade crescendo e subindo, com carros passando na avenida">
      <rect width="460" height="300" fill="#bae6fd" />
      <rect y="230" width="160" height="70" fill="#86efac" />
      <Tree x={40} y={236} s={0.8} />
      <House x={100} y={236} s={1} />
      <Tree x={140} y={236} s={0.6} />
      {heights.map((h, i) => (
        <g key={i}>
          <g transform={`translate(${170 + i * 40} 240)`}>
            <g>
              <animateTransform attributeName="transform" type="scale" values="1 0.2;1 1;1 1" keyTimes="0;0.5;1" dur="6s" begin={`${-i * 0.3}s`} repeatCount="indefinite" />
              <Building x={0} y={0} w={36} h={h} color={["#64748b", "#475569", "#0e7490", "#334155"][i % 4]} />
            </g>
          </g>
        </g>
      ))}
      <rect y="240" width="460" height="60" fill="#475569" />
      <path d="M0 270 H460" stroke="#facc15" strokeWidth="3" strokeDasharray="20 14" />
      {[0, 1].map((k) => (
        <g key={k}>
          <animateTransform attributeName="transform" type="translate" values={k ? "480 0;-60 0" : "-60 0;480 0"} dur={k ? "5s" : "4s"} repeatCount="indefinite" />
          <rect x="0" y={k ? 276 : 250} width="40" height="14" rx="4" fill={k ? "#dc2626" : "#2563eb"} />
          <circle cx="9" cy={k ? 291 : 265} r="4" fill="#1e293b" />
          <circle cx="31" cy={k ? 291 : 265} r="4" fill="#1e293b" />
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A urbanização do Brasil (de tocar)
// ---------------------------------------------------------------------------

const URBAN: Record<number, number> = { 1940: 31, 1950: 36, 1960: 45, 1970: 56, 1980: 68, 1991: 75, 2000: 81, 2010: 84, 2022: 87 };
const YEARS = Object.keys(URBAN).map(Number);

export function UrbanizationSlider() {
  const [i, setI] = useState(4);
  const year = YEARS[i];
  const urban = URBAN[year];
  const buildings = Math.round(urban / 10);
  return (
    <Panel title="Onde morava a população brasileira?">
      <svg viewBox="0 0 400 140" className="w-full" role="img" aria-label={`Em ${year}, ${urban}% da população morava nas cidades`}>
        <rect width="400" height="140" rx="10" fill="#e0f2fe" />
        <rect y="112" width="400" height="28" fill="#86efac" />
        {Array.from({ length: 10 - buildings }, (_, k) => (
          <House key={`c${k}`} x={20 + k * 34} y={116} s={0.8} />
        ))}
        {Array.from({ length: buildings }, (_, k) => (
          <Building key={`b${k}`} x={380 - (k + 1) * 34} y={116} w={30} h={50 + (k % 3) * 24} color={["#64748b", "#475569", "#0e7490"][k % 3]} />
        ))}
      </svg>
      <div className="my-[0.3em] flex h-[1.4em] overflow-hidden rounded-full text-[0.75em] font-black text-white">
        <div className="flex items-center justify-center bg-[#0e7490] transition-all" style={{ width: `${urban}%` }}>
          cidade {urban}%
        </div>
        <div className="flex flex-1 items-center justify-center bg-[#65a30d]">campo {100 - urban}%</div>
      </div>
      <Slider label="Ano" value={i} min={0} max={YEARS.length - 1} onChange={setI} format={(v) => String(YEARS[v])} />
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// A rede urbana
// ---------------------------------------------------------------------------

function UrbanNetworkArt() {
  const cities = [
    { x: 280, y: 100, r: 22, name: "Metrópole" },
    { x: 140, y: 60, r: 14, name: "Capital regional" },
    { x: 430, y: 60, r: 14, name: "Capital regional" },
    { x: 70, y: 150, r: 8, name: "Cidade local" },
    { x: 200, y: 160, r: 8, name: "Cidade local" },
    { x: 380, y: 160, r: 8, name: "Cidade local" },
    { x: 500, y: 140, r: 8, name: "Cidade local" },
  ];
  const links = [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 4],
    [2, 5],
    [2, 6],
    [0, 4],
    [0, 5],
  ];
  return (
    <Art viewBox="0 0 560 190" label="A rede urbana: uma metrópole grande no centro ligada às capitais regionais, que se ligam às cidades locais, com pontinhos indo e vindo pelas estradas">
      <rect width="560" height="190" rx="14" fill="#fffaf0" />
      {links.map(([a, b], i) => {
        const A = cities[a];
        const B = cities[b];
        const d = `M${A.x} ${A.y} L${B.x} ${B.y}`;
        return (
          <g key={i}>
            <path d={d} stroke="#a8a29e" strokeWidth="3" />
            <circle r="3.5" fill={GEO}>
              <animateMotion path={d} dur="2.4s" begin={`${-i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}
      {cities.map((c, i) => (
        <g key={i}>
          <circle cx={c.x} cy={c.y} r={c.r} fill={c.r > 20 ? "#dc2626" : c.r > 10 ? "#ea580c" : "#ca8a04"} stroke="#fff" strokeWidth="2" />
          {(i < 3 || i === 3) && (
            <text x={c.x} y={c.y + c.r + 14} textAnchor="middle" fontSize="12" fontWeight="900" fill={GEO_DARK} fontFamily="Georgia, serif">
              {c.name}
            </text>
          )}
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os problemas das cidades e as soluções (de tocar)
// ---------------------------------------------------------------------------

const PROBLEMS = [
  { icon: "🚗", problem: "Congestionamento", solution: "Metrô, ônibus de qualidade, ciclovias e calçadas boas tiram carros das ruas." },
  { icon: "🌊", problem: "Enchentes", solution: "Mais áreas verdes e asfalto que deixa a água passar; não jogar lixo nos bueiros." },
  { icon: "🗑️", problem: "Lixo", solution: "Coleta seletiva, reciclagem e compostagem do lixo orgânico." },
  { icon: "🏚️", problem: "Moradias precárias", solution: "Programas de habitação com água, esgoto, luz e transporte perto." },
  { icon: "🏭", problem: "Poluição do ar", solution: "Transporte limpo, filtros nas fábricas e mais árvores." },
];

export function CityProblems() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Panel title="Toque no problema para ver uma solução">
      <div className="grid grid-cols-5 gap-[0.3em]">
        {PROBLEMS.map((p, i) => (
          <button
            key={p.problem}
            type="button"
            onClick={() => setOpen(i)}
            className="flex flex-col items-center rounded-lg border px-[0.2em] py-[0.3em] text-[0.72em] font-bold leading-tight transition-colors"
            style={open === i ? { background: GEO, borderColor: GEO, color: "#fff" } : { background: "#fff", borderColor: "#d9c79d", color: "#3b2a14" }}
          >
            <span className="text-[1.6em]">{p.icon}</span>
            {p.problem}
          </button>
        ))}
      </div>
      {open !== null && (
        <p key={open} className="cg-anim-fade mt-[0.4em] rounded-lg px-[0.6em] py-[0.3em] text-[0.88em] leading-snug" style={{ background: "#ecfeff", borderLeft: `5px solid ${GEO}` }}>
          <strong style={{ color: GEO_DARK }}>Solução: </strong>
          {PROBLEMS[open].solution}
        </p>
      )}
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// A cidade sustentável
// ---------------------------------------------------------------------------

function GreenCityArt() {
  return (
    <Art viewBox="0 0 560 180" label="Uma cidade sustentável com painéis solares nos telhados, telhado verde, ciclovia com bicicletas passando, árvores e um ônibus elétrico">
      <rect width="560" height="180" rx="14" fill="#e0f2fe" />
      <circle cx="500" cy="36" r="20" fill="#fde047" />
      {[40, 130, 330, 430].map((x, i) => (
        <g key={x}>
          <Building x={x} y={140} w={60} h={70 + (i % 2) * 30} color={i % 2 ? "#0e7490" : "#64748b"} />
          {i % 2 ? (
            <rect x={x} y={140 - (70 + 30) - 6} width="60" height="6" fill="#16a34a" />
          ) : (
            <path d={`M${x + 4} ${140 - 70 - 2} l26 -10 l26 10 Z`} fill="#1e3a8a" stroke="#93c5fd" />
          )}
        </g>
      ))}
      <Tree x={230} y={144} s={0.8} />
      <Tree x={280} y={144} s={0.6} />
      <rect y="140" width="560" height="40" fill="#94a3b8" />
      <rect y="166" width="560" height="10" fill="#16a34a" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="-60 0;600 0" dur="7s" repeatCount="indefinite" />
        <rect x="0" y="142" width="70" height="20" rx="5" fill="#16a34a" />
        <text x="35" y="156" textAnchor="middle" fontSize="10" fontWeight="900" fill="#fff">elétrico</text>
      </g>
      <g>
        <animateTransform attributeName="transform" type="translate" values="600 0;-40 0" dur="9s" repeatCount="indefinite" />
        <circle cx="0" cy="171" r="4" fill="none" stroke="#1e293b" strokeWidth="1.5" />
        <circle cx="14" cy="171" r="4" fill="none" stroke="#1e293b" strokeWidth="1.5" />
        <path d="M0 171 L7 165 L14 171 M7 165 L7 160" stroke="#1e293b" strokeWidth="1.5" fill="none" />
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 7, content, bare });

export const chapter7: BookPage[] = [
  page(
    <ChapterOpener n={7} title="Cidades e Urbanização" goals={["O que é urbanização", "Metrópoles, megacidades e a rede urbana", "Os problemas das cidades", "Como fazer cidades sustentáveis"]}>
      <Fig h={34}>
        <CityOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🏙️">A urbanização</H>
      <P>
        <T>Urbanização</T> é o aumento da parte da população que vive nas cidades. No Brasil ela foi muito rápida: em 1940, só 3 em cada 10 brasileiros moravam em
        cidades; hoje são quase 9 em cada 10. Arraste o ano:
      </P>
      <UrbanizationSlider />
      <Box kind="lembre">
        A urbanização brasileira cresceu com a <strong>industrialização</strong> e com o <strong>êxodo rural</strong>, a saída das pessoas do campo atrás de emprego.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🌆">Metrópoles e rede urbana</H>
      <P>
        As cidades formam uma <T>rede urbana</T>: as menores dependem das maiores para hospitais, universidades e serviços. Uma <T>metrópole</T> é uma cidade enorme que
        comanda uma região. Quando várias cidades crescem e se juntam, acontece a <T>conurbação</T>.
      </P>
      <Fig n="7.1" caption="A rede urbana: as cidades ligadas por estradas, serviços e comércio." h={20}>
        <UrbanNetworkArt />
      </Fig>
      <Box kind="sabia">
        A região metropolitana de São Paulo tem mais de 20 milhões de habitantes: é uma <strong>megacidade</strong>, uma das maiores do mundo, junto com Tóquio, Délhi
        e Xangai.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🚦">Os problemas das cidades</H>
      <P>
        Quando a cidade cresce rápido e sem planejamento, aparecem problemas: falta de moradia, trânsito, enchentes, lixo e poluição. A <T>segregação</T> espacial
        separa os bairros ricos, com tudo perto, das periferias, longe dos empregos.
      </P>
      <CityProblems />
      <Box kind="atencao">
        Construir em encostas e nas beiras dos rios é perigoso: chuvas fortes podem causar deslizamentos e alagamentos.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🌿">A cidade sustentável</H>
      <P>
        Uma cidade sustentável cuida das pessoas e da natureza ao mesmo tempo: tem transporte público bom, energia limpa, áreas verdes, coleta seletiva e moradia digna
        para todos.
      </P>
      <Fig n="7.2" caption="Painéis solares, telhados verdes, ciclovias e ônibus elétrico." h={20}>
        <GreenCityArt />
      </Fig>
      <Table
        head={["Campo", "Cidade"]}
        rows={[
          ["Produz alimentos e matérias-primas", "Produz bens industriais e oferece serviços"],
          ["Usa máquinas, adubos e tecnologia da cidade", "Depende dos alimentos e da água do campo"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Urbanização é o aumento da população que vive nas cidades; no Brasil passa de 85%.",
          "A urbanização brasileira cresceu com a indústria e o êxodo rural.",
          "As cidades formam uma rede urbana comandada pelas metrópoles.",
          "Cidades sem planejamento têm problemas de moradia, trânsito, enchentes e lixo.",
          "Campo e cidade dependem um do outro.",
        ]}
      />
      <Glossary
        items={[
          ["Urbanização", "O aumento da população urbana."],
          ["Metrópole", "Cidade grande que comanda uma região."],
          ["Megacidade", "Cidade com mais de 10 milhões de habitantes."],
          ["Conurbação", "Quando cidades vizinhas crescem e se juntam."],
          ["Periferia", "Os bairros afastados do centro da cidade."],
        ]}
      />
      <Quiz
        items={[
          ["O que é urbanização?", "O aumento da parte da população que vive nas cidades."],
          ["O que é conurbação?", "Quando duas ou mais cidades crescem e se juntam."],
          ["Cite uma solução para o congestionamento.", "Metrô, ônibus de qualidade ou ciclovias."],
          ["Qual é a maior região metropolitana do Brasil?", "A de São Paulo."],
        ]}
      />
    </>,
  ),
];
