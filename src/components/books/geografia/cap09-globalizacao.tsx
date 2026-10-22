"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { GlobeLines, Panel, Pill, Slider } from "./art";

// ============================================================================
// CAPÍTULO 9 — GLOBALIZAÇÃO E GEOPOLÍTICA (missão "Geografia: Globalização e
// Geopolítica"): o globo com aviões, navios e dados circulando, o celular
// montado com peças de vários países, os blocos econômicos (de tocar), as
// organizações internacionais e a calculadora do IDH (de tocar).
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o mundo conectado
// ---------------------------------------------------------------------------

function ConnectedOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="O globo terrestre com um avião e um navio dando a volta, e pulsos de dados pela internet ligando cidades nos continentes">
      <rect width="460" height="300" fill="#0f172a" />
      <GlobeLines x={230} y={150} r={100} />
      {[
        "M150 110 Q230 40 320 120",
        "M170 190 Q240 260 320 180",
        "M140 150 Q230 120 330 150",
      ].map((d, i) => (
        <g key={i}>
          <path d={d} fill="none" stroke="#facc15" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.8" />
          <circle r="4" fill="#facc15">
            <animateMotion path={d} dur="2s" begin={`${-i * 0.6}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0 230 150" to="360 230 150" dur="10s" repeatCount="indefinite" />
        <g transform="translate(230 34) rotate(90)">
          <path d="M0 -14 L3 -4 L14 2 L14 5 L3 2 L2 10 L6 13 L6 15 L0 13 L-6 15 L-6 13 L-2 10 L-3 2 L-14 5 L-14 2 L-3 -4 Z" fill="#e2e8f0" />
        </g>
      </g>
      <g>
        <animateTransform attributeName="transform" type="rotate" from="360 230 150" to="0 230 150" dur="16s" repeatCount="indefinite" />
        <g transform="translate(230 272)">
          <path d="M-16 0 L16 0 L12 8 L-12 8 Z" fill="#dc2626" />
          <rect x="-10" y="-8" width="8" height="8" fill="#2563eb" />
          <rect x="0" y="-8" width="8" height="8" fill="#16a34a" />
        </g>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O celular de peças do mundo todo
// ---------------------------------------------------------------------------

function PhoneArt() {
  const parts = [
    { from: [40, 40], label: "Projeto: Estados Unidos", color: "#2563eb" },
    { from: [520, 40], label: "Chips: Taiwan", color: "#7c3aed" },
    { from: [40, 170], label: "Minérios: Brasil e Congo", color: "#ca8a04" },
    { from: [520, 170], label: "Montagem: China", color: "#dc2626" },
  ];
  return (
    <Art viewBox="0 0 560 200" label="Um celular no meio sendo montado com peças que chegam voando de vários países: o projeto dos Estados Unidos, os chips de Taiwan, os minérios do Brasil e do Congo e a montagem na China">
      <rect width="560" height="200" rx="14" fill="#fffaf0" />
      <rect x="250" y="40" width="60" height="120" rx="10" fill="#1e293b" stroke="#475569" strokeWidth="3" />
      <rect x="256" y="52" width="48" height="94" rx="4" fill="#38bdf8">
        <animate attributeName="fill" values="#38bdf8;#a5f3fc;#38bdf8" dur="2s" repeatCount="indefinite" />
      </rect>
      {parts.map((p, i) => (
        <g key={p.label}>
          <rect x="-8" y="-8" width="16" height="16" rx="3" fill={p.color}>
            <animateMotion path={`M${p.from[0]} ${p.from[1]} L280 100`} dur="3s" begin={`${-i * 0.75}s`} repeatCount="indefinite" />
          </rect>
          <text x={p.from[0] < 280 ? 20 : 540} y={p.from[1] < 100 ? 24 : 194} textAnchor={p.from[0] < 280 ? "start" : "end"} fontSize="12" fontWeight="900" fill={p.color} fontFamily="Georgia, serif">
            {p.label}
          </text>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os blocos econômicos (de tocar)
// ---------------------------------------------------------------------------

const BLOCS = {
  Mercosul: {
    color: "#16a34a",
    members: "Brasil, Argentina, Paraguai, Uruguai e Bolívia",
    text: "Criado em 1991, facilita o comércio entre os países da América do Sul, com menos impostos entre eles.",
  },
  "União Europeia": {
    color: "#2563eb",
    members: "27 países da Europa, como França, Alemanha, Itália e Espanha",
    text: "O bloco mais integrado do mundo: as pessoas circulam livremente e 20 países usam a mesma moeda, o euro.",
  },
  "USMCA (T-MEC)": {
    color: "#dc2626",
    members: "Estados Unidos, México e Canadá",
    text: "Um acordo de livre comércio da América do Norte, que substituiu o antigo NAFTA em 2020.",
  },
  BRICS: {
    color: "#ca8a04",
    members: "Brasil, Rússia, Índia, China, África do Sul e novos membros",
    text: "Não é um bloco de comércio livre, mas um grupo de grandes economias emergentes que se reúnem para defender seus interesses.",
  },
};

export function BlocPicker() {
  const [name, setName] = useState<keyof typeof BLOCS>("Mercosul");
  const b = BLOCS[name];
  return (
    <Panel title="Os blocos econômicos">
      <div className="mb-[0.4em] flex flex-wrap justify-center gap-[0.3em]">
        {(Object.keys(BLOCS) as (keyof typeof BLOCS)[]).map((k) => (
          <Pill key={k} on={name === k} onClick={() => setName(k)} color={BLOCS[k].color}>
            {k}
          </Pill>
        ))}
      </div>
      <div key={name} className="cg-anim-fade rounded-lg px-[0.7em] py-[0.4em]" style={{ background: `${b.color}14`, borderLeft: `5px solid ${b.color}` }}>
        <p className="cg-book-title font-black" style={{ color: b.color }}>
          {name}
        </p>
        <p className="text-[0.84em] font-bold text-[#3b2a14]">👥 {b.members}</p>
        <p className="mt-[0.2em] text-[0.86em] leading-snug">{b.text}</p>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// A calculadora do IDH (de tocar)
// ---------------------------------------------------------------------------

function idhLevel(v: number) {
  if (v >= 0.8) return ["muito alto", "#16a34a"];
  if (v >= 0.7) return ["alto", "#65a30d"];
  if (v >= 0.55) return ["médio", "#ca8a04"];
  return ["baixo", "#dc2626"];
}

export function IdhCalculator() {
  const [health, setHealth] = useState(80);
  const [education, setEducation] = useState(70);
  const [income, setIncome] = useState(75);
  const idh = Math.cbrt((health / 100) * (education / 100) * (income / 100));
  const [level, color] = idhLevel(idh);
  return (
    <Panel title="Monte o IDH de um país">
      <Slider label="❤️ Saúde" value={health} min={20} max={100} onChange={setHealth} suffix="%" labelWidth="6.6em" />
      <Slider label="📚 Educação" value={education} min={20} max={100} onChange={setEducation} suffix="%" labelWidth="6.6em" />
      <Slider label="💰 Renda" value={income} min={20} max={100} onChange={setIncome} suffix="%" labelWidth="6.6em" />
      <div className="mt-[0.4em] flex items-center gap-[0.6em]">
        <div className="h-[1em] flex-1 overflow-hidden rounded-full bg-[#e7e5e4]">
          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${idh * 100}%`, background: color }} />
        </div>
        <span className="text-[1.1em] font-black tabular-nums" style={{ color }}>
          {idh.toFixed(3).replace(".", ",")}
        </span>
      </div>
      <p className="mt-[0.2em] text-center text-[0.86em]">
        Desenvolvimento humano <strong style={{ color }}>{level}</strong>. O Brasil tem IDH perto de 0,76 (alto); a Noruega, mais de 0,96.
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 9, content, bare });

export const chapter9: BookPage[] = [
  page(
    <ChapterOpener n={9} title="Globalização e Geopolítica" goals={["O que é a globalização", "Os blocos econômicos", "A ONU e as organizações internacionais", "O IDH e as desigualdades entre os países"]}>
      <Fig h={34}>
        <ConnectedOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🌐">A globalização</H>
      <P>
        A <T>globalização</T> é a integração dos países do mundo: mercadorias, dinheiro, informações, pessoas e culturas circulam cada vez mais rápido, graças aos
        transportes e à <T>internet</T>. Até um celular é feito com peças de vários países:
      </P>
      <Fig n="9.1" caption="Um produto global, montado com partes do mundo todo." h={20}>
        <PhoneArt />
      </Fig>
      <Cards
        items={[
          { icon: "🏢", title: "Multinacionais", text: "Empresas com fábricas e lojas em muitos países." },
          { icon: "🎬", title: "Cultura", text: "Séries, músicas e jogos fazem sucesso no mundo inteiro." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🤝">Os blocos econômicos</H>
      <P>
        Países vizinhos se juntam em <T>blocos econômicos</T> para comerciar mais, com menos impostos (as tarifas) entre eles. Alguns vão além e deixam pessoas e até
        moedas circularem livremente. Conheça:
      </P>
      <BlocPicker />
      <Box kind="lembre">
        O <strong>Mercosul</strong> é o bloco do Brasil. A <strong>União Europeia</strong> é o mais integrado, com moeda única, o euro.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🏛️">As organizações internacionais</H>
      <P>
        Depois da Segunda Guerra Mundial, os países criaram a <T>ONU</T> (Organização das Nações Unidas), em 1945, para manter a paz e cooperar. Hoje ela reúne 193
        países e tem várias agências.
      </P>
      <Table
        head={["Sigla", "O que faz"]}
        rows={[
          ["ONU", "Busca a paz e os direitos humanos; o Conselho de Segurança tem 5 membros permanentes"],
          ["OMS", "Cuida da saúde no mundo, como no combate às pandemias"],
          ["OMC", "Organiza as regras do comércio entre os países"],
          ["UNESCO", "Cuida da educação, da ciência e da cultura, e escolhe os Patrimônios da Humanidade"],
          ["FMI", "Empresta dinheiro a países com a economia em crise"],
        ]}
      />
      <Box kind="sabia">
        Os 5 membros permanentes do Conselho de Segurança, com poder de veto, são Estados Unidos, Rússia, China, Reino Unido e França.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="📈">Um mundo desigual</H>
      <P>
        A globalização não distribuiu a riqueza por igual. O <T>IDH</T> (Índice de Desenvolvimento Humano) mede a qualidade de vida de um país olhando três coisas:{" "}
        <T>saúde</T> (quanto as pessoas vivem), <T>educação</T> (quanto estudam) e <T>renda</T>. Vai de 0 a 1:
      </P>
      <IdhCalculator />
      <Box kind="mago" title="Por que três notas?">
        Um país pode ser rico e ter educação ruim, ou o contrário. O IDH junta as três para mostrar a vida das pessoas, e não só o dinheiro.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "A globalização integra o mundo pela economia, pela cultura e pela tecnologia.",
          "Os blocos econômicos facilitam o comércio entre os países membros.",
          "O Brasil faz parte do Mercosul e do BRICS.",
          "A ONU foi criada em 1945 para manter a paz; tem agências como OMS e UNESCO.",
          "O IDH mede saúde, educação e renda, de 0 a 1.",
        ]}
      />
      <Glossary
        items={[
          ["Globalização", "A integração dos países do mundo."],
          ["Multinacional", "Empresa que atua em muitos países."],
          ["Bloco econômico", "Grupo de países que fazem acordos de comércio."],
          ["Tarifa", "Imposto cobrado sobre produtos importados."],
          ["IDH", "Índice que mede saúde, educação e renda."],
        ]}
      />
      <Quiz
        items={[
          ["De qual bloco econômico o Brasil faz parte?", "Do Mercosul."],
          ["Qual bloco usa a moeda única chamada euro?", "A União Europeia."],
          ["Em que ano foi criada a ONU?", "Em 1945."],
          ["Quais são as três coisas que o IDH mede?", "Saúde, educação e renda."],
        ]}
      />
    </>,
  ),
];
