"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Kid } from "../ods/art";
import { HB_DARK, Panel, Slider, TapTimeline } from "./art";

// ============================================================================
// CAPÍTULO 9 — REPÚBLICA VELHA E ERA VARGAS (missão "História do Brasil:
// República Velha e Era Vargas"): o café com leite de São Paulo e Minas, a
// história de quem podia votar (de tocar), as revoltas da Primeira República
// (de tocar), a Era Vargas e o Congresso Nacional de Brasília.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o café com leite
// ---------------------------------------------------------------------------

function CafeComLeiteOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma xícara de café de São Paulo recebendo leite de uma leiteira de Minas Gerais, com o vapor subindo: a política do café com leite">
      <rect width="460" height="300" fill="#fef3c7" />
      <g transform="translate(180 210)">
        <path d="M-70 -70 L70 -70 L58 20 Q0 40 -58 20 Z" fill="#fff" stroke="#78350f" strokeWidth="3" />
        <path d="M70 -50 Q110 -40 96 -10 Q86 6 62 0" fill="none" stroke="#78350f" strokeWidth="8" />
        <ellipse cy="-70" rx="70" ry="14" fill="#92400e" />
        <ellipse cy="-70" rx="40" ry="8" fill="#d6b77a">
          <animate attributeName="rx" values="10;60;10" dur="4s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cy="40" rx="110" ry="14" fill="#e7e5e4" />
        <text y="-10" textAnchor="middle" fontSize="20" fontWeight="900" fill="#78350f" fontFamily="Georgia, serif">
          SP
        </text>
      </g>
      <g transform="translate(330 70) rotate(40)">
        <path d="M-30 -40 L30 -40 L36 50 L-36 50 Z" fill="#e0f2fe" stroke="#475569" strokeWidth="3" />
        <path d="M-30 -40 L-46 -54" stroke="#475569" strokeWidth="6" />
        <text y="16" textAnchor="middle" fontSize="20" fontWeight="900" fill="#1e3a8a" fontFamily="Georgia, serif">
          MG
        </text>
      </g>
      <path d="M262 92 Q230 110 210 140" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" strokeDasharray="12 8">
        <animate attributeName="stroke-dashoffset" values="40;0" dur="0.8s" repeatCount="indefinite" />
      </path>
      {[0, 1, 2].map((k) => (
        <path key={k} d="M0 0 q-6 -12 0 -24 q6 -12 0 -24" fill="none" stroke="#a8a29e" strokeWidth="3" strokeLinecap="round">
          <animateTransform attributeName="transform" type="translate" values={`${140 + k * 30} 130;${140 + k * 30} 90`} dur="2.4s" begin={`${-k * 0.8}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0" dur="2.4s" begin={`${-k * 0.8}s`} repeatCount="indefinite" />
        </path>
      ))}
      <text x="230" y="290" textAnchor="middle" fontSize="18" fontWeight="900" fill={HB_DARK} fontFamily="Georgia, serif">
        A política do café com leite
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Quem podia votar (de tocar)
// ---------------------------------------------------------------------------

const VOTE_YEARS = [
  { year: 1824, who: ["homens ricos"], text: "Voto censitário: só homens livres com uma renda mínima. Mulheres e escravizados não votavam." },
  { year: 1891, who: ["homens ricos", "homens pobres"], text: "A República tirou a exigência de renda, mas só votavam homens alfabetizados com mais de 21 anos, e o voto era aberto." },
  { year: 1932, who: ["homens ricos", "homens pobres", "mulheres"], text: "O Código Eleitoral de Vargas criou o voto secreto e deu às mulheres o direito de votar." },
  { year: 1985, who: ["homens ricos", "homens pobres", "mulheres", "analfabetos"], text: "As pessoas que não sabiam ler conquistaram o direito ao voto." },
  { year: 1988, who: ["homens ricos", "homens pobres", "mulheres", "analfabetos", "jovens de 16"], text: "A Constituição Cidadã deixou jovens de 16 e 17 anos votarem, se quiserem." },
];
const GROUPS = ["homens ricos", "homens pobres", "mulheres", "analfabetos", "jovens de 16"];
const SHIRTS = ["#1e3a8a", "#78716c", "#db2777", "#ca8a04", "#16a34a"];

export function VoteHistory() {
  const [i, setI] = useState(0);
  const v = VOTE_YEARS[i];
  return (
    <Panel title="Quem podia votar?">
      <svg viewBox="0 0 400 110" className="w-full" role="img" aria-label={`Em ${v.year}, podiam votar: ${v.who.join(", ")}`}>
        <rect width="400" height="110" rx="10" fill="#fffaf0" />
        {GROUPS.map((g, k) => {
          const can = v.who.includes(g);
          return (
            <g key={g} transform={`translate(${44 + k * 78} 82)`} opacity={can ? 1 : 0.25} style={{ transition: "opacity 0.4s" }}>
              <Kid x={0} y={0} s={0.85} shirt={SHIRTS[k]} skin={k % 2 ? "#a16207" : "#f1c9a5"} hair={k === 2 ? "#78350f" : "#1e293b"} />
              <text y="22" textAnchor="middle" fontSize="11" fontWeight="700" fill="#3b2a14">
                {g}
              </text>
              {can && (
                <text y="-66" textAnchor="middle" fontSize="16" className="cg-anim-pop">
                  🗳️
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <Slider label="Ano" value={i} min={0} max={VOTE_YEARS.length - 1} onChange={setI} format={(k) => String(VOTE_YEARS[k].year)} />
      <p key={i} className="cg-anim-fade mt-[0.2em] text-[0.84em] leading-snug">
        {v.text}
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As revoltas da Primeira República
// ---------------------------------------------------------------------------

const FIRST_REPUBLIC = [
  { year: "1897", name: "Canudos", text: "No sertão da Bahia, milhares de sertanejos pobres seguiam Antônio Conselheiro. O Exército destruiu o arraial. Euclides da Cunha contou tudo em Os Sertões." },
  { year: "1904", name: "Revolta da Vacina", text: "No Rio de Janeiro, o povo se revoltou contra a vacinação obrigatória contra a varíola, feita à força e sem explicação, no plano de Oswaldo Cruz." },
  { year: "1910", name: "Revolta da Chibata", text: "Marinheiros, a maioria negros, liderados por João Cândido, se revoltaram contra os castigos com chicote na Marinha." },
  { year: "1916", name: "Contestado", text: "Camponeses expulsos de suas terras por uma ferrovia lutaram numa região disputada entre Paraná e Santa Catarina." },
  { year: "1922", name: "Semana de 22", text: "A Semana de Arte Moderna, em São Paulo, quis uma arte brasileira e nova, com Mário e Oswald de Andrade, Anita Malfatti e Tarsila do Amaral." },
];

// ---------------------------------------------------------------------------
// O Congresso Nacional
// ---------------------------------------------------------------------------

function BrasiliaArt() {
  return (
    <Art viewBox="0 0 560 180" label="O Congresso Nacional em Brasília, com as duas torres altas, a cúpula virada para cima, a cúpula virada para baixo e o céu mudando de cor no pôr do sol">
      <rect width="560" height="180" rx="14" fill="#fde68a">
        <animate attributeName="fill" values="#bae6fd;#fde68a;#fdba74;#bae6fd" dur="10s" repeatCount="indefinite" />
      </rect>
      <rect y="140" width="560" height="40" fill="#86efac" />
      <rect x="120" y="126" width="320" height="16" fill="#e5e7eb" stroke="#94a3b8" />
      <rect x="262" y="20" width="16" height="108" fill="#f8fafc" stroke="#94a3b8" />
      <rect x="282" y="20" width="16" height="108" fill="#f8fafc" stroke="#94a3b8" />
      <rect x="262" y="70" width="36" height="6" fill="#cbd5e1" />
      <path d="M150 126 Q190 96 230 126 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" transform="rotate(180 190 118)" />
      <path d="M330 126 Q370 100 410 126 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
      <text x="190" y="170" textAnchor="middle" fontSize="11" fontWeight="900" fill={HB_DARK}>Câmara</text>
      <text x="370" y="170" textAnchor="middle" fontSize="11" fontWeight="900" fill={HB_DARK}>Senado</text>
      <text x="80" y="40" textAnchor="middle" fontSize="13" fontWeight="900" fill={HB_DARK} fontFamily="Georgia, serif">
        Brasília, 1960
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 9, content, bare });

export const chapter9: BookPage[] = [
  page(
    <ChapterOpener n={9} title="República Velha e Era Vargas" goals={["O café com leite e o coronelismo", "Quem podia votar ao longo da história", "Canudos, a Revolta da Vacina e a Semana de 22", "Getúlio Vargas, JK e Brasília"]}>
      <Fig h={34}>
        <CafeComLeiteOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🗳️">A República Velha</H>
      <P>
        De 1889 a 1930, a <T>Primeira República</T> foi dominada pelos fazendeiros. Na <T>política do café com leite</T>, São Paulo (café) e Minas Gerais (leite) se
        revezavam na Presidência. No interior mandavam os <T>coronéis</T>, que obrigavam as pessoas a votar nos seus candidatos: o <T>voto de cabresto</T>.
      </P>
      <VoteHistory />
    </>,
  ),

  page(
    <>
      <H icon="✊">O povo se revolta</H>
      <P>
        A República dos fazendeiros deixou de fora a maioria das pessoas, e houve revoltas no campo e nas cidades. Ao mesmo tempo, artistas quiseram inventar uma arte bem
        brasileira. Toque nos anos:
      </P>
      <TapTimeline items={FIRST_REPUBLIC} start={0} />
      <Box kind="sabia">
        Em 1922, jovens oficiais do Exército, os <strong>tenentes</strong>, começaram revoltas contra o governo, como a dos 18 do Forte de Copacabana. Era o
        tenentismo.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🏭">A Era Vargas</H>
      <P>
        Na <T>Revolução de 1930</T>, <T>Getúlio Vargas</T> chegou ao poder e acabou com o café com leite. Ele governou 15 anos seguidos, até 1945, de 1937 em diante como
        ditador, no <T>Estado Novo</T>, com censura e perseguição aos opositores.
      </P>
      <Table
        head={["Ano", "Com Vargas"]}
        rows={[
          ["1932", "Voto secreto e voto das mulheres"],
          ["1940", "Criação do salário mínimo"],
          ["1943", "A CLT, Consolidação das Leis do Trabalho: férias, carteira de trabalho, jornada de 8 horas"],
          ["1953", "Já eleito presidente, cria a Petrobras: “O petróleo é nosso!”"],
        ]}
      />
      <Box kind="lembre">
        Vargas foi chamado de “pai dos pobres” pelos direitos trabalhistas, mas também governou como ditador. Morreu em 1954, durante uma grave crise política.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🏛️">JK e Brasília</H>
      <P>
        O presidente <T>Juscelino Kubitschek</T> (1956–1961) prometeu “50 anos em 5”: trouxe fábricas de carros, abriu estradas e construiu uma nova capital no meio do
        país. <T>Brasília</T>, projetada por <T>Lúcio Costa</T> e <T>Oscar Niemeyer</T>, foi inaugurada em <T>21 de abril de 1960</T>.
      </P>
      <Fig n="9.1" caption="O Congresso Nacional, de Oscar Niemeyer." h={20}>
        <BrasiliaArt />
      </Fig>
      <Box kind="sabia">
        Vista de cima, o desenho do Plano Piloto de Brasília parece um avião (ou um pássaro). Os <strong>candangos</strong>, trabalhadores de todo o país, construíram a
        cidade em menos de 4 anos.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Na República Velha, São Paulo e Minas se revezavam no poder: o café com leite.",
          "Os coronéis controlavam os votos no interior com o voto de cabresto.",
          "Canudos, a Revolta da Vacina e a da Chibata mostraram o povo excluído.",
          "Vargas criou o voto feminino, o salário mínimo, a CLT e a Petrobras, mas também foi ditador.",
          "JK construiu Brasília, inaugurada em 1960.",
        ]}
      />
      <Glossary
        items={[
          ["Coronel", "Grande fazendeiro que mandava na política do interior."],
          ["Voto de cabresto", "Voto controlado pelo coronel."],
          ["Estado Novo", "A ditadura de Vargas, de 1937 a 1945."],
          ["CLT", "A lei que reúne os direitos dos trabalhadores."],
          ["Candango", "Trabalhador que construiu Brasília."],
        ]}
      />
      <Quiz
        items={[
          ["O que foi a política do café com leite?", "São Paulo e Minas Gerais se revezando na Presidência."],
          ["Em que ano as mulheres conquistaram o direito de votar?", "Em 1932."],
          ["O que foi a CLT?", "A Consolidação das Leis do Trabalho, de 1943."],
          ["Quem foram os arquitetos de Brasília?", "Lúcio Costa e Oscar Niemeyer."],
        ]}
      />
    </>,
  ),
];
