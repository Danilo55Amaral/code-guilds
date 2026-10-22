"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Cloud, Tree } from "../ods/art";
import { GEO_DARK, Mountain, Panel, Pill } from "./art";

// ============================================================================
// CAPÍTULO 5 — ÁGUAS E BIOMAS (missão "Geografia: Relevo, Clima e Águas", a
// parte das águas, e "Meio Ambiente e Energia"): o rio na floresta com o
// boto pulando, o ciclo da água, as bacias hidrográficas, os seis biomas do
// Brasil (de tocar) e os rios voadores da Amazônia.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o rio na floresta
// ---------------------------------------------------------------------------

function RiverOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Um rio largo correndo no meio da floresta, com um boto cor-de-rosa pulando para fora da água e araras voando">
      <rect width="460" height="300" fill="#bbf7d0" />
      <rect width="460" height="120" fill="#7dd3fc" />
      {Array.from({ length: 9 }, (_, i) => (
        <Tree key={i} x={20 + i * 54} y={140 + (i % 2) * 10} s={0.9 + (i % 3) * 0.15} color={["#15803d", "#16a34a", "#166534"][i % 3]} />
      ))}
      <path d="M0 200 Q120 170 230 200 T460 190 L460 300 L0 300 Z" fill="#0ea5e9" />
      {[0, 1, 2].map((k) => (
        <path key={k} d="M0 0 q20 -6 40 0" fill="none" stroke="#e0f2fe" strokeWidth="3" strokeLinecap="round">
          <animateTransform attributeName="transform" type="translate" values={`${-40 + k * 160} ${230 + k * 20};${420 + k * 40} ${230 + k * 20}`} dur="6s" begin={`${-k * 2}s`} repeatCount="indefinite" />
        </path>
      ))}
      <g>
        <animateMotion path="M180 250 Q230 160 280 250" dur="2.6s" repeatCount="indefinite" rotate="auto" />
        <path d="M-26 0 Q0 -14 26 -2 L34 -10 L32 4 L26 2 Q0 12 -26 0 Z" fill="#f9a8d4" stroke="#be185d" strokeWidth="1.5" />
        <circle cx="-16" cy="-3" r="1.8" fill="#1e293b" />
      </g>
      {[0, 1].map((k) => (
        <g key={k}>
          <animateTransform attributeName="transform" type="translate" values={`-40 ${40 + k * 26};500 ${20 + k * 30}`} dur={`${7 + k * 2}s`} begin={`${-k * 3}s`} repeatCount="indefinite" />
          <path d="M-10 0 L0 -6 L10 0 L0 2 Z" fill={k ? "#2563eb" : "#dc2626"} />
          <path d="M-2 -2 L-8 -12 M2 -2 L8 -12" stroke={k ? "#facc15" : "#2563eb"} strokeWidth="3" />
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O ciclo da água
// ---------------------------------------------------------------------------

function WaterCycleArt() {
  return (
    <Art viewBox="0 0 560 200" label="O ciclo da água: o Sol evapora a água do mar, o vapor sobe e vira nuvem, a nuvem chove sobre a montanha e a água volta pelos rios para o mar">
      <rect width="560" height="200" rx="14" fill="#e0f2fe" />
      <circle cx="60" cy="40" r="22" fill="#fde047" stroke="#f59e0b" strokeWidth="2" />
      <rect x="0" y="150" width="250" height="50" fill="#0ea5e9" />
      <Mountain x={430} y={170} w={220} h={120} color="#78716c" />
      <rect x="250" y="168" width="310" height="32" fill="#86efac" />
      <path d="M440 120 Q380 160 250 172" fill="none" stroke="#38bdf8" strokeWidth="6" />
      {[0, 1, 2].map((k) => (
        <path key={k} d="M0 0 q-5 -8 0 -16 q5 -8 0 -16" fill="none" stroke="#7dd3fc" strokeWidth="3" strokeLinecap="round">
          <animateTransform attributeName="transform" type="translate" values={`${100 + k * 50} 150;${100 + k * 50} 70`} dur="2.4s" begin={`${-k * 0.8}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0" dur="2.4s" begin={`${-k * 0.8}s`} repeatCount="indefinite" />
        </path>
      ))}
      <Cloud x={200} y={40} s={1} />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;140 0;0 0" dur="10s" repeatCount="indefinite" />
        <Cloud x={260} y={50} s={1.1} color="#94a3b8" />
      </g>
      {Array.from({ length: 5 }, (_, i) => (
        <line key={i} x1={390 + i * 14} x2={388 + i * 14} y1="72" y2="80" stroke="#2563eb" strokeWidth="2.5">
          <animate attributeName="y1" values="72;120" dur="0.9s" begin={`${-i * 0.18}s`} repeatCount="indefinite" />
          <animate attributeName="y2" values="80;128" dur="0.9s" begin={`${-i * 0.18}s`} repeatCount="indefinite" />
        </line>
      ))}
      {[
        ["evaporação", 130, 120],
        ["condensação", 230, 90],
        ["precipitação", 470, 70],
        ["escoamento", 330, 190],
      ].map(([t, x, y]) => (
        <text key={t as string} x={x as number} y={y as number} textAnchor="middle" fontSize="13" fontWeight="900" fill={GEO_DARK} stroke="#fff" strokeWidth="3" paintOrder="stroke" fontFamily="Georgia, serif">
          {t}
        </text>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os biomas do Brasil (de tocar)
// ---------------------------------------------------------------------------

const BIOMES = {
  Amazônia: { color: "#166534", area: "49% do Brasil", text: "A maior floresta tropical do mundo, com árvores altas, rios enormes e uma biodiversidade gigantesca: onça, boto, arara, castanheira." },
  Cerrado: { color: "#ca8a04", area: "24%", text: "A savana brasileira, com árvores baixas de troncos tortos e raízes profundas. É o berço das águas: nascem nele rios de várias bacias." },
  "Mata Atlântica": { color: "#15803d", area: "13%", text: "A floresta do litoral, onde vive a maior parte dos brasileiros. Restam só cerca de 12% da mata original. Mico-leão-dourado, pau-brasil." },
  Caatinga: { color: "#a16207", area: "10%", text: "O único bioma só do Brasil, no semiárido. As plantas perdem as folhas na seca e guardam água, como o mandacaru e o umbuzeiro." },
  Pampa: { color: "#65a30d", area: "2%", text: "Os campos do Rio Grande do Sul, com vegetação rasteira e coxilhas (colinas suaves), onde se cria muito gado." },
  Pantanal: { color: "#0891b2", area: "2%", text: "A maior planície alagável do mundo. Na época das cheias, metade dela fica debaixo d'água. Tuiuiú, jacaré, capivara." },
};

function BiomeScene({ name }: { name: keyof typeof BIOMES }) {
  const b = BIOMES[name];
  return (
    <svg viewBox="0 0 400 120" className="w-full" role="img" aria-label={`A paisagem do bioma ${name}`}>
      <rect width="400" height="120" rx="10" fill={name === "Caatinga" ? "#fef3c7" : "#e0f2fe"} />
      <rect y="92" width="400" height="28" fill={name === "Caatinga" ? "#d6b77a" : name === "Pampa" ? "#a3e635" : "#86efac"} />
      {name === "Amazônia" && Array.from({ length: 9 }, (_, i) => <Tree key={i} x={22 + i * 45} y={96} s={0.8 + (i % 2) * 0.15} color={i % 2 ? "#166534" : "#15803d"} />)}
      {name === "Mata Atlântica" && (
        <>
          {Array.from({ length: 5 }, (_, i) => (
            <Tree key={i} x={20 + i * 50} y={96} s={0.9 + (i % 2) * 0.2} color="#15803d" />
          ))}
          <path d="M260 92 Q330 70 400 76 L400 120 L260 120 Z" fill="#38bdf8" />
        </>
      )}
      {name === "Cerrado" &&
        Array.from({ length: 6 }, (_, i) => (
          <g key={i} transform={`translate(${40 + i * 64} 96)`}>
            <path d="M0 0 Q-6 -20 4 -36" stroke="#78350f" strokeWidth="5" fill="none" />
            <ellipse cx="4" cy="-42" rx="22" ry="12" fill="#84cc16" />
          </g>
        ))}
      {name === "Caatinga" &&
        Array.from({ length: 5 }, (_, i) => (
          <g key={i} transform={`translate(${50 + i * 75} 96)`}>
            {i % 2 ? (
              <path d="M0 0 V-50 M0 -30 H-12 V-42 M0 -24 H12 V-36" stroke="#4d7c0f" strokeWidth="8" strokeLinecap="round" fill="none" />
            ) : (
              <path d="M0 0 L0 -30 L-14 -46 M0 -30 L14 -48 M0 -18 L10 -26" stroke="#78350f" strokeWidth="3" fill="none" />
            )}
          </g>
        ))}
      {name === "Pampa" && (
        <>
          <path d="M0 96 Q100 70 200 92 T400 86 L400 120 L0 120 Z" fill="#84cc16" />
          {[90, 250, 320].map((x) => (
            <g key={x} transform={`translate(${x} 92)`}>
              <ellipse rx="16" ry="9" cy="-12" fill="#fff" stroke="#44403c" />
              <circle cx="16" cy="-16" r="6" fill="#fff" stroke="#44403c" />
              <path d="M-10 -4 V4 M10 -4 V4" stroke="#44403c" strokeWidth="2" />
            </g>
          ))}
        </>
      )}
      {name === "Pantanal" && (
        <>
          <rect y="80" width="400" height="40" fill="#38bdf8" />
          {[60, 180, 330].map((x, i) => (
            <Tree key={x} x={x} y={82} s={0.7} color={i % 2 ? "#15803d" : "#166534"} />
          ))}
          <g transform="translate(250 84)">
            <path d="M0 0 V-34" stroke="#1e293b" strokeWidth="2" />
            <ellipse cy="-30" rx="9" ry="12" fill="#fff" stroke="#475569" />
            <path d="M0 -42 V-58" stroke="#1e293b" strokeWidth="4" />
            <path d="M0 -58 L-14 -54" stroke="#1e293b" strokeWidth="3" />
            <rect x="-3" y="-48" width="6" height="6" fill="#dc2626" />
          </g>
        </>
      )}
      <text x="390" y="20" textAnchor="end" fontSize="13" fontWeight="900" fill={b.color} stroke="#fff" strokeWidth="3" paintOrder="stroke" fontFamily="Georgia, serif">
        {name} · {b.area}
      </text>
    </svg>
  );
}

export function BiomePicker() {
  const [name, setName] = useState<keyof typeof BIOMES>("Amazônia");
  return (
    <Panel title="Os seis biomas do Brasil">
      <div className="mb-[0.3em] flex flex-wrap justify-center gap-[0.3em]">
        {(Object.keys(BIOMES) as (keyof typeof BIOMES)[]).map((k) => (
          <Pill key={k} on={name === k} onClick={() => setName(k)} color={BIOMES[k].color}>
            {k}
          </Pill>
        ))}
      </div>
      <BiomeScene name={name} />
      <p key={name} className="cg-anim-fade mt-[0.3em] text-[0.86em] leading-snug">
        {BIOMES[name].text}
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Os rios voadores
// ---------------------------------------------------------------------------

function FlyingRiversArt() {
  return (
    <Art viewBox="0 0 560 180" label="O mapa da América do Sul com nuvens de vapor saindo da Floresta Amazônica, batendo nos Andes e descendo para levar chuva ao Centro-Oeste, ao Sudeste e ao Sul do Brasil">
      <rect width="560" height="180" rx="14" fill="#e0f2fe" />
      <path d="M150 20 Q230 10 300 40 Q350 60 340 100 Q320 150 260 170 Q220 175 200 140 Q170 100 150 70 Q140 40 150 20 Z" fill="#86efac" stroke="#15803d" strokeWidth="2" />
      <path d="M150 20 Q140 60 160 110 Q180 150 200 172" fill="none" stroke="#78716c" strokeWidth="8" strokeLinecap="round" />
      <ellipse cx="240" cy="55" rx="62" ry="28" fill="#15803d" opacity="0.8" />
      <text x="240" y="60" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff" fontFamily="Georgia, serif">
        Amazônia
      </text>
      {[0, 1, 2, 3].map((k) => (
        <circle key={k} r="7" fill="#fff" opacity="0.9">
          <animateMotion path="M260 50 Q170 50 175 100 Q185 140 270 140" dur="4s" begin={`${-k}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <text x="275" y="146" fontSize="12" fontWeight="900" fill="#1d4ed8" fontFamily="Georgia, serif">
        chuva no Sudeste
      </text>
      <text x="370" y="60" fontSize="15" fontWeight="900" fill={GEO_DARK} fontFamily="Georgia, serif">
        Os rios voadores
      </text>
      <text x="370" y="84" fontSize="12" fill="#3b2a14" fontFamily="Georgia, serif">
        As árvores soltam vapor,
      </text>
      <text x="370" y="102" fontSize="12" fill="#3b2a14" fontFamily="Georgia, serif">
        o vento leva até os Andes
      </text>
      <text x="370" y="120" fontSize="12" fill="#3b2a14" fontFamily="Georgia, serif">
        e ele vira chuva no sul.
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 5, content, bare });

export const chapter5: BookPage[] = [
  page(
    <ChapterOpener n={5} title="Águas e Biomas" goals={["O ciclo da água", "As bacias hidrográficas do Brasil", "Os seis biomas brasileiros", "Os rios voadores da Amazônia"]}>
      <Fig h={34}>
        <RiverOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="💧">O ciclo da água</H>
      <P>
        A água do planeta está sempre circulando. O Sol aquece mares e rios e a água <T>evapora</T>; o vapor sobe, esfria e se <T>condensa</T> em nuvens; as nuvens
        devolvem a água em <T>precipitação</T> (chuva, neve, granizo), que <T>escoa</T> pelos rios ou se infiltra no solo.
      </P>
      <Fig n="5.1" caption="O ciclo da água." h={22}>
        <WaterCycleArt />
      </Fig>
      <Box kind="atencao">
        Cerca de 97% da água da Terra é salgada e 2% está congelada. Menos de 1% é água doce fácil de usar: por isso ela precisa ser cuidada.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🏞️">As bacias hidrográficas</H>
      <P>
        Uma <T>bacia hidrográfica</T> é a área drenada por um rio principal e seus <T>afluentes</T> (os rios que deságuam nele). O Brasil tem uma das maiores reservas de
        água doce do mundo.
      </P>
      <Table
        head={["Bacia", "Destaque"]}
        rows={[
          ["Amazônica", "A maior bacia do mundo; o Rio Amazonas é o mais volumoso da Terra"],
          ["São Francisco", "O Velho Chico, rio da integração nacional, atravessa o semiárido"],
          ["Paraná", "Muitas hidrelétricas, como Itaipu, na fronteira com o Paraguai"],
          ["Tocantins-Araguaia", "Corre do Centro-Oeste ao Pará; tem a usina de Tucuruí"],
        ]}
      />
      <Box kind="sabia">
        Debaixo do chão do Brasil e de países vizinhos fica o <strong>Aquífero Guarani</strong>, uma das maiores reservas de água subterrânea do planeta.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🌳">Os biomas brasileiros</H>
      <P>
        Um <T>bioma</T> é uma grande área com clima, relevo, solo, vegetação e animais parecidos. O Brasil tem seis biomas. Toque em cada um:
      </P>
      <BiomePicker />
      <Box kind="lembre">
        A <strong>Caatinga</strong> é o único bioma que existe só no Brasil. A <strong>Amazônia</strong> é o maior, e a <strong>Mata Atlântica</strong>, o mais destruído.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="☁️">Os rios voadores</H>
      <P>
        Cada árvore grande da Amazônia solta centenas de litros de água por dia em forma de vapor. Esse vapor forma <T>rios voadores</T>: o vento leva a umidade para o
        oeste, ela bate na Cordilheira dos Andes e desce, levando chuva para o Centro-Oeste, o Sudeste e o Sul.
      </P>
      <Fig n="5.2" caption="Os rios voadores levam a chuva da Amazônia para outras regiões." h={20}>
        <FlyingRiversArt />
      </Fig>
      <Box kind="mago" title="Tudo está ligado">
        Quando a floresta é derrubada, os rios voadores enfraquecem e pode faltar chuva até nas lavouras e nas represas de cidades muito longe da Amazônia.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "No ciclo da água há evaporação, condensação, precipitação e escoamento.",
          "Menos de 1% da água do planeta é doce e fácil de usar.",
          "A bacia Amazônica é a maior do mundo; o São Francisco é o rio da integração nacional.",
          "O Brasil tem seis biomas: Amazônia, Cerrado, Mata Atlântica, Caatinga, Pampa e Pantanal.",
          "Os rios voadores levam a umidade da Amazônia para outras regiões.",
        ]}
      />
      <Glossary
        items={[
          ["Evaporação", "A passagem da água do estado líquido para o vapor."],
          ["Afluente", "Rio que deságua em outro rio maior."],
          ["Bacia hidrográfica", "A área drenada por um rio e seus afluentes."],
          ["Aquífero", "Reserva de água debaixo da terra."],
          ["Bioma", "Grande região com clima, vegetação e animais parecidos."],
        ]}
      />
      <Quiz
        items={[
          ["Como se chama a etapa em que o vapor vira nuvem?", "Condensação."],
          ["Qual é a maior bacia hidrográfica do mundo?", "A bacia Amazônica."],
          ["Qual bioma existe só no Brasil?", "A Caatinga."],
          ["O que são os rios voadores?", "A umidade da Amazônia que o vento leva e vira chuva em outras regiões."],
        ]}
      />
    </>,
  ),
];
