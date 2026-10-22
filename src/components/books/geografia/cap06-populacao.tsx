"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Kid } from "../ods/art";
import { GEO, GEO_DARK, Panel, Pill } from "./art";

// ============================================================================
// CAPÍTULO 6 — POPULAÇÃO (missão "Geografia: População e Cidades", a parte
// da demografia): a multidão com o contador do censo, a densidade comparada
// (de tocar), a pirâmide etária do Brasil ao longo dos anos (de tocar), a
// queda do número de filhos e as setas das migrações.
// ============================================================================

const SKINS = ["#f1c9a5", "#d6a77a", "#a16207", "#7c4a1e", "#e0ac69"];
const SHIRTS = ["#0e7490", "#dc2626", "#16a34a", "#ca8a04", "#7c3aed", "#db2777"];

// ---------------------------------------------------------------------------
// Abertura: a multidão e o contador do censo
// ---------------------------------------------------------------------------

function CensusOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Muitas pessoas diferentes lado a lado, e um painel que conta a população do Brasil: mais de 203 milhões de pessoas no Censo de 2022">
      <rect width="460" height="300" fill="#cffafe" />
      <rect x="110" y="20" width="240" height="70" rx="12" fill={GEO_DARK} />
      <text x="230" y="48" textAnchor="middle" fontSize="13" fontWeight="700" fill="#a5f3fc" fontFamily="Georgia, serif">
        População do Brasil (Censo 2022)
      </text>
      <text x="230" y="78" textAnchor="middle" fontSize="26" fontWeight="900" fill="#fff" fontFamily="Georgia, serif">
        203.080.756
      </text>
      {Array.from({ length: 3 }, (_, row) =>
        Array.from({ length: 9 }, (_, i) => {
          const k = row * 9 + i;
          return (
            <g key={k} transform={`translate(${40 + i * 48 + (row % 2) * 20} ${180 + row * 42})`}>
              <g>
                <animateTransform attributeName="transform" type="translate" values="0 0;0 -5;0 0" dur="1.4s" begin={`${-(k % 7) * 0.2}s`} repeatCount="indefinite" />
                <Kid x={0} y={0} s={0.85} shirt={SHIRTS[k % SHIRTS.length]} skin={SKINS[k % SKINS.length]} hair={k % 4 ? "#3f2a14" : "#fde68a"} />
              </g>
            </g>
          );
        }),
      )}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A densidade demográfica (de tocar)
// ---------------------------------------------------------------------------

const DENSITY = [
  { name: "Canadá", value: 4 },
  { name: "Brasil", value: 24 },
  { name: "China", value: 150 },
  { name: "Japão", value: 330 },
  { name: "Bangladesh", value: 1300 },
];

export function DensityCompare() {
  const [sel, setSel] = useState(1);
  const d = DENSITY[sel];
  // cada bolinha = 10 pessoas por km² (no máximo 130)
  const dots = Math.max(1, Math.round(d.value / 10));
  return (
    <Panel title="Quantas pessoas por km²?">
      <div className="mb-[0.3em] flex flex-wrap justify-center gap-[0.3em]">
        {DENSITY.map((x, i) => (
          <Pill key={x.name} on={sel === i} onClick={() => setSel(i)}>
            {x.name}
          </Pill>
        ))}
      </div>
      <div className="flex items-center gap-[0.6em]">
        <svg viewBox="0 0 160 160" className="w-[45%] shrink-0" role="img" aria-label={`Um quadrado de 1 km² com ${d.value} pessoas`}>
          <rect x="4" y="4" width="152" height="152" rx="6" fill="#ecfccb" stroke={GEO_DARK} strokeWidth="2" />
          {Array.from({ length: dots }, (_, i) => (
            <circle key={`${sel}-${i}`} cx={14 + (i % 12) * 12} cy={14 + Math.floor(i / 12) * 12} r="4.5" fill={SHIRTS[i % SHIRTS.length]} className="cg-anim-pop" style={{ animationDelay: `${i * 0.01}s` }} />
          ))}
        </svg>
        <div className="flex-1">
          <p className="text-[2em] font-black leading-none tabular-nums" style={{ color: GEO_DARK }}>
            {d.value.toLocaleString("pt-BR")}
          </p>
          <p className="text-[0.82em] font-bold text-[#5b4a2e]">pessoas por km² em {d.name}</p>
          <p className="mt-[0.4em] text-[0.75em] italic text-[#6b5a3a]">Cada bolinha vale 10 pessoas.</p>
        </div>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// A pirâmide etária (de tocar)
// ---------------------------------------------------------------------------

const AGES = ["80+", "70-79", "60-69", "50-59", "40-49", "30-39", "20-29", "10-19", "0-9"];
// a porcentagem de cada faixa (homens e mulheres, cada lado), de cima para baixo
const PYRAMIDS: Record<string, number[]> = {
  "1980": [0.3, 0.8, 1.6, 2.5, 3.4, 4.6, 6.8, 11.2, 13.2],
  "2000": [0.5, 1.2, 2.0, 3.0, 4.6, 6.6, 8.6, 10.2, 9.6],
  "2022": [0.9, 1.9, 3.4, 5.4, 6.9, 7.8, 7.8, 7.4, 6.4],
  "2050": [2.2, 3.8, 5.6, 6.5, 6.8, 6.6, 6.1, 5.6, 5.0],
};

export function AgePyramid() {
  const [year, setYear] = useState("2022");
  const data = PYRAMIDS[year];
  return (
    <Panel title="A pirâmide etária do Brasil">
      <div className="mb-[0.3em] flex justify-center gap-[0.3em]">
        {Object.keys(PYRAMIDS).map((y) => (
          <Pill key={y} on={year === y} onClick={() => setYear(y)}>
            {y}
            {y === "2050" ? "*" : ""}
          </Pill>
        ))}
      </div>
      <svg viewBox="0 0 400 190" className="w-full" role="img" aria-label={`A pirâmide etária do Brasil em ${year}`}>
        <rect width="400" height="190" rx="8" fill="#fff" />
        <text x="100" y="16" textAnchor="middle" fontSize="12" fontWeight="900" fill="#1d4ed8">Homens</text>
        <text x="300" y="16" textAnchor="middle" fontSize="12" fontWeight="900" fill="#db2777">Mulheres</text>
        {AGES.map((a, i) => {
          const w = data[i] * 12;
          const y = 24 + i * 18;
          return (
            <g key={a}>
              <rect x={175 - w} y={y} width={w} height="14" fill="#60a5fa" style={{ transition: "all 0.5s" }} />
              <rect x="225" y={y} width={w * 1.04} height="14" fill="#f472b6" style={{ transition: "all 0.5s" }} />
              <text x="200" y={y + 11} textAnchor="middle" fontSize="10" fontWeight="700" fill="#334155">
                {a}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="text-[0.82em] leading-snug">
        {year === "1980"
          ? "Base larga e topo fino: muitas crianças e poucos idosos."
          : year === "2000"
            ? "A base começa a encolher: as famílias passam a ter menos filhos."
            : year === "2022"
              ? "O meio engordou: a maioria é de adultos, e os idosos aumentam."
              : "* Projeção: o topo cresce. O Brasil vai ter mais idosos que crianças."}
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// A queda do número de filhos
// ---------------------------------------------------------------------------

function FertilityArt() {
  const points = [
    [1960, 6.3],
    [1970, 5.8],
    [1980, 4.4],
    [1991, 2.9],
    [2000, 2.4],
    [2010, 1.9],
    [2022, 1.6],
  ];
  const x = (yr: number) => 60 + ((yr - 1960) / 62) * 460;
  const y = (v: number) => 160 - v * 20;
  const d = points.map(([yr, v], i) => `${i ? "L" : "M"}${x(yr)} ${y(v)}`).join(" ");
  return (
    <Art viewBox="0 0 560 190" label="Um gráfico de linha mostrando que o número médio de filhos por mulher no Brasil caiu de 6,3 em 1960 para 1,6 em 2022">
      <rect width="560" height="190" rx="14" fill="#fffaf0" />
      <line x1="50" y1="160" x2="540" y2="160" stroke="#94a3b8" />
      <line x1="50" y1="20" x2="50" y2="160" stroke="#94a3b8" />
      <path d={d} fill="none" stroke={GEO} strokeWidth="4" strokeLinejoin="round" pathLength={100} strokeDasharray="100" strokeDashoffset="100">
        <animate attributeName="stroke-dashoffset" values="100;0;0" keyTimes="0;0.6;1" dur="5s" repeatCount="indefinite" />
      </path>
      {points.map(([yr, v]) => (
        <g key={yr}>
          <circle cx={x(yr)} cy={y(v)} r="5" fill={GEO_DARK} />
          <text x={x(yr)} y={y(v) - 10} textAnchor="middle" fontSize="12" fontWeight="900" fill={GEO_DARK}>
            {v.toLocaleString("pt-BR")}
          </text>
          <text x={x(yr)} y="178" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569">
            {yr}
          </text>
        </g>
      ))}
      <text x="540" y="20" textAnchor="end" fontSize="12" fontWeight="700" fill="#475569">filhos por mulher</text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As migrações
// ---------------------------------------------------------------------------

function MigrationArt() {
  return (
    <Art viewBox="0 0 560 190" label="Setas animadas: do campo para a cidade, do Nordeste para o Sudeste e de outros países, como Itália, Japão, Síria, Haiti e Venezuela, para o Brasil">
      <rect width="560" height="190" rx="14" fill="#e0f2fe" />
      <path d="M200 20 Q300 10 360 60 Q380 120 320 170 Q260 180 240 140 Q200 100 200 60 Z" fill="#86efac" stroke="#15803d" strokeWidth="2" />
      <text x="280" y="96" textAnchor="middle" fontSize="13" fontWeight="900" fill="#14532d" fontFamily="Georgia, serif">
        Brasil
      </text>
      <circle cx="340" cy="70" r="6" fill="#ca8a04" />
      <text x="350" y="62" fontSize="11" fontWeight="700" fill="#3b2a14">Nordeste</text>
      <circle cx="300" cy="130" r="6" fill="#dc2626" />
      <text x="310" y="146" fontSize="11" fontWeight="700" fill="#3b2a14">Sudeste</text>
      {[
        ["M340 70 Q330 100 300 130", "#ca8a04"],
        ["M60 40 Q160 30 230 80", "#16a34a"],
        ["M520 40 Q440 60 360 100", "#7c3aed"],
        ["M60 160 Q150 170 250 130", "#2563eb"],
      ].map(([d, c], i) => (
        <g key={i}>
          <path d={d} fill="none" stroke={c} strokeWidth="2.5" strokeDasharray="6 5" opacity="0.6" />
          <circle r="6" fill={c}>
            <animateMotion path={d} dur="3s" begin={`${-i * 0.7}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      <text x="40" y="30" fontSize="12" fontWeight="900" fill="#16a34a">Europa (italianos, portugueses)</text>
      <text x="420" y="30" fontSize="12" fontWeight="900" fill="#7c3aed">Ásia (japoneses, sírios)</text>
      <text x="30" y="182" fontSize="12" fontWeight="900" fill="#2563eb">América (haitianos, venezuelanos)</text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 6, content, bare });

export const chapter6: BookPage[] = [
  page(
    <ChapterOpener n={6} title="População" goals={["População absoluta e densidade demográfica", "A pirâmide etária", "Natalidade, mortalidade e crescimento", "As migrações no Brasil e no mundo"]}>
      <Fig h={34}>
        <CensusOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="👥">Quantos somos?</H>
      <P>
        A <T>demografia</T> estuda a população. A <T>população absoluta</T> é o total de habitantes: o Brasil tem mais de 203 milhões e é um país <T>populoso</T>. A{" "}
        <T>densidade demográfica</T> é a média de pessoas por km², e a do Brasil é baixa: o país é <T>pouco povoado</T>.
      </P>
      <DensityCompare />
      <Box kind="sabia">
        Quem conta a população brasileira é o <strong>IBGE</strong>, no <strong>Censo</strong>, que visita todas as casas do país, em geral a cada 10 anos.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🔺">A pirâmide etária</H>
      <P>
        A <T>pirâmide etária</T> mostra quantas pessoas há em cada faixa de idade, com os homens de um lado e as mulheres do outro. Veja como a do Brasil mudou:
      </P>
      <AgePyramid />
      <Box kind="lembre">
        O Brasil está <strong>envelhecendo</strong>: nascem menos crianças e as pessoas vivem mais. A expectativa de vida passou de 76 anos.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="📉">Natalidade e mortalidade</H>
      <P>
        A <T>taxa de natalidade</T> mede os nascimentos, e a de <T>mortalidade</T>, as mortes. A diferença entre elas é o <T>crescimento vegetativo</T>. Com mais
        mulheres estudando e trabalhando, a vida na cidade e os métodos contraceptivos, o número de filhos por mulher caiu muito:
      </P>
      <Fig n="6.1" caption="O número médio de filhos por mulher no Brasil." h={20}>
        <FertilityArt />
      </Fig>
      <Box kind="mago" title="Por que isso importa?">
        Com menos jovens e mais idosos, o país precisa planejar a aposentadoria, a saúde e as escolas de um jeito diferente do passado.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🧳">As migrações</H>
      <P>
        <T>Migrar</T> é mudar de lugar para viver. Quem sai é <T>emigrante</T>; quem chega é <T>imigrante</T>. As pessoas migram em busca de trabalho e de uma vida
        melhor, ou fugindo de guerras e desastres, como os <T>refugiados</T>.
      </P>
      <Fig n="6.2" caption="Algumas migrações que formaram a população brasileira." h={20}>
        <MigrationArt />
      </Fig>
      <Cards
        items={[
          { icon: "🚜", title: "Êxodo rural", text: "A saída do campo para as cidades, muito forte entre 1950 e 1980." },
          { icon: "🧭", title: "Migração interna", text: "Milhões de nordestinos foram construir São Paulo e Brasília." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "O Brasil é populoso (mais de 203 milhões) mas pouco povoado (cerca de 24 hab/km²).",
          "O IBGE conta a população no Censo.",
          "A pirâmide etária mostra que o Brasil está envelhecendo.",
          "O número de filhos por mulher caiu de mais de 6 para cerca de 1,6.",
          "Migrações internas e imigrantes de vários países formaram a população brasileira.",
        ]}
      />
      <Glossary
        items={[
          ["Demografia", "O estudo da população."],
          ["Densidade demográfica", "A média de habitantes por km²."],
          ["Crescimento vegetativo", "Nascimentos menos mortes."],
          ["Imigrante", "Quem chega para morar num país."],
          ["Refugiado", "Quem foge de guerras ou perseguições."],
        ]}
      />
      <Quiz
        items={[
          ["Qual é a diferença entre populoso e povoado?", "Populoso tem muitos habitantes; povoado tem muita gente por km²."],
          ["Qual órgão faz o Censo no Brasil?", "O IBGE."],
          ["O que mostra uma pirâmide etária?", "Quantas pessoas há em cada faixa de idade, homens e mulheres."],
          ["Como se chama a saída das pessoas do campo para a cidade?", "Êxodo rural."],
        ]}
      />
    </>,
  ),
];
