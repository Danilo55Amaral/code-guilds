"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { GoalTile, Globe, Kid, ODS_GOALS } from "./art";

// ============================================================================
// CAPÍTULO 1 — A AGENDA 2030 E OS 17 ODS (missões "ODS", "ODS parte 2" e
// "ODS parte 3"): os 17 quadradinhos dando a volta no planeta, a linha do
// tempo dos ODM aos ODS, a grade dos 17 objetivos de tocar, os 5 Ps e as
// pessoas de mãos dadas em volta da Terra (o ODS 17, das parcerias).
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: os 17 ODS girando em volta do planeta
// ---------------------------------------------------------------------------

function GoalsOrbitArt() {
  return (
    <Art viewBox="0 0 460 300" label="O planeta Terra no meio e os 17 quadradinhos coloridos dos ODS dando a volta nele">
      <rect width="460" height="300" fill="#eff6ff" />
      <circle cx="230" cy="150" r="128" fill="none" stroke="#bfdbfe" strokeWidth="2" strokeDasharray="4 6" />
      <Globe x={230} y={150} r={58} />
      <g transform="translate(230 150)">
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="60s" repeatCount="indefinite" />
          {ODS_GOALS.map((g, i) => {
            const a = (i / 17) * Math.PI * 2;
            const x = Math.cos(a) * 118;
            const y = Math.sin(a) * 118;
            return (
              <g key={g.n} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
                {/* o quadradinho gira ao contrário pra ficar sempre de pé */}
                <g>
                  <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="60s" repeatCount="indefinite" />
                  <GoalTile n={g.n} x={-15} y={-15} s={30} />
                </g>
              </g>
            );
          })}
        </g>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Dos ODM (2000) aos ODS (2015-2030)
// ---------------------------------------------------------------------------

function TimelineArt() {
  return (
    <Art viewBox="0 0 560 200" label="Linha do tempo: os 8 Objetivos do Milênio, de 2000 a 2015, e os 17 ODS, de 2015 a 2030">
      <rect width="560" height="200" rx="14" fill="#f8fafc" />
      <line x1="90" y1="110" x2="470" y2="110" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
      {/* a parte já andada da linha */}
      <line x1="90" y1="110" x2="90" y2="110" stroke="#2563eb" strokeWidth="6" strokeLinecap="round">
        <animate attributeName="x2" values="90;470;470" keyTimes="0;0.8;1" dur="6s" repeatCount="indefinite" />
      </line>
      {[
        [90, "2000", "8 Objetivos do Milênio (ODM)", "#64748b"],
        [280, "2015", "a ONU aprova os 17 ODS", "#2563eb"],
        [470, "2030", "a meta dos ODS", "#16a34a"],
      ].map(([x, year, text, color]) => (
        <g key={year as string} fontFamily="Georgia, serif" textAnchor="middle">
          <circle cx={x as number} cy="110" r="14" fill={color as string} stroke="#fff" strokeWidth="3" />
          <text x={x as number} y="78" fontSize="20" fontWeight="900" fill={color as string}>
            {year}
          </text>
          <text x={x as number} y="146" fontSize="12" fontWeight="700" fill="#334155">
            {text}
          </text>
        </g>
      ))}
      <g>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n, i) => (
          <rect key={n} x={70 + i * 22} y="160" width="18" height="18" rx="3" fill="#94a3b8" />
        ))}
        {ODS_GOALS.map((g, i) => (
          <rect key={g.n} x={300 + (i % 9) * 22} y={i < 9 ? 160 : 180} width="18" height="16" rx="3" fill={g.color} />
        ))}
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A grade dos 17 ODS (de tocar)
// ---------------------------------------------------------------------------

export function GoalGrid() {
  const [sel, setSel] = useState(5);
  const g = ODS_GOALS[sel];
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.5em]">
      <div className="grid grid-cols-6 gap-[0.3em] sm:grid-cols-9">
        {ODS_GOALS.map((goal, i) => (
          <button
            key={goal.n}
            type="button"
            onClick={() => setSel(i)}
            title={goal.name}
            className={`flex aspect-square flex-col items-center justify-center rounded-[0.35em] text-white transition-transform hover:scale-110 ${sel === i ? "scale-110 ring-[3px] ring-[#1e293b]" : ""}`}
            style={{ background: goal.color }}
          >
            <span className="text-[0.62em] font-black leading-none">{goal.n}</span>
            <span className="text-[1em] leading-none">{goal.icon}</span>
          </button>
        ))}
      </div>
      <div key={sel} className="cg-anim-fade mt-[0.5em] rounded-lg px-[0.7em] py-[0.4em] text-white" style={{ background: g.color }}>
        <p className="cg-book-title text-[1em] font-black">
          ODS {g.n} · {g.name}
        </p>
        <p className="text-[0.88em] leading-[1.4]">{g.goal}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Os 5 Ps
// ---------------------------------------------------------------------------

const FIVE_PS = [
  { p: "Pessoas", icon: "👪", color: "#e5243b", goals: "1 a 5" },
  { p: "Planeta", icon: "🌎", color: "#3f7e44", goals: "6, 12, 13, 14, 15" },
  { p: "Prosperidade", icon: "📈", color: "#fd9d24", goals: "7 a 11" },
  { p: "Paz", icon: "🕊️", color: "#00689d", goals: "16" },
  { p: "Parcerias", icon: "🤝", color: "#19486a", goals: "17" },
];

function FivePsArt() {
  return (
    <Art viewBox="0 0 560 210" label="Os 5 Ps da Agenda 2030: Pessoas, Planeta, Prosperidade, Paz e Parcerias">
      <rect width="560" height="210" rx="14" fill="#f8fafc" />
      {FIVE_PS.map((item, i) => {
        const x = 64 + i * 108;
        return (
          <g key={item.p} transform={`translate(${x} 92)`}>
            <g className="cg-anim-pop" style={{ animationDelay: `${i * 0.15}s` }}>
              <circle r="44" fill={item.color} />
              <circle r="44" fill="none" stroke="#fff" strokeWidth="4" opacity="0.5" />
              <text y="-4" textAnchor="middle" fontSize="40" fontWeight="900" fill="#fff" fontFamily="Georgia, serif">
                P
              </text>
              <text y="24" textAnchor="middle" fontSize={item.p.length > 9 ? 9 : 11} fontWeight="900" fill="#fff" fontFamily="Georgia, serif">
                {item.p}
              </text>
            </g>
            <text y="70" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#334155" fontFamily="Georgia, serif">
              ODS {item.goals}
            </text>
          </g>
        );
      })}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As pessoas de mãos dadas em volta do planeta (ODS 17)
// ---------------------------------------------------------------------------

function HandsAroundArt() {
  const shirts = ["#e5243b", "#fcc30b", "#4c9f38", "#26bde2", "#a21942", "#fd6925", "#19486a", "#dd1367"];
  const skins = ["#f1c9a5", "#8d5524", "#d6a77a", "#5c3a1e", "#e0ac69", "#c68642", "#f1c9a5", "#8d5524"];
  return (
    <Art viewBox="0 0 560 220" label="Pessoas diferentes de mãos dadas em volta do planeta: governos, empresas, escolas e cada um de nós trabalhando juntos">
      <rect width="560" height="220" rx="14" fill="#ecfeff" />
      <Globe x={280} y={120} r={62} />
      <g transform="translate(280 120)">
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="40s" repeatCount="indefinite" />
          {shirts.map((shirt, i) => {
            const a = (i / shirts.length) * 360;
            return (
              <g key={i} transform={`rotate(${a}) translate(0 -66)`}>
                <Kid x={0} y={0} s={0.5} shirt={shirt} skin={skins[i]} />
              </g>
            );
          })}
        </g>
      </g>
      <g fontFamily="Georgia, serif" fontSize="12.5" fontWeight="900" fill="#155e75">
        <text x="24" y="32">governos</text>
        <text x="24" y="200">empresas</text>
        <text x="536" y="32" textAnchor="end">escolas</text>
        <text x="536" y="200" textAnchor="end">e você!</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 1, content, bare });

export const chapter1: BookPage[] = [
  page(
    <ChapterOpener
      n={1}
      title="A Agenda 2030 e os 17 ODS"
      goals={["O que são os ODS e quem os criou", "Quais são os 17 objetivos", "Os 5 Ps da Agenda 2030", "Por que as parcerias são tão importantes"]}
    >
      <Fig h={34}>
        <GoalsOrbitArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🌐">O que são os ODS?</H>
      <P>
        Os <T>Objetivos de Desenvolvimento Sustentável (ODS)</T> são um plano do mundo inteiro para deixar o planeta melhor para todo mundo. Eles foram aprovados em{" "}
        <T>2015</T> pela <T>ONU</T> (Organização das Nações Unidas), com os <T>193 países</T> que fazem parte dela, incluindo o Brasil.
      </P>
      <Fig n="1.1" caption="Antes dos ODS vieram os 8 Objetivos do Milênio; os 17 ODS têm 2030 como meta." h={22}>
        <TimelineArt />
      </Fig>
      <P>
        O plano se chama <T>Agenda 2030</T>, porque o prazo para cumprir as metas é o ano de 2030. São <T>17 objetivos</T>, divididos em <T>169 metas</T>.
      </P>
      <Box kind="sabia">
        <strong>Sustentável</strong> é aquilo que atende o que precisamos hoje sem prejudicar as gerações do futuro. É usar a natureza sem acabar com ela.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🎯">Os 17 objetivos</H>
      <P>
        Cada ODS tem um número, um ícone e uma cor. Eles tratam dos grandes desafios do mundo: a fome, a água, a educação, o clima, as florestas, a paz... Toque em cada
        quadradinho:
      </P>
      <GoalGrid />
      <Box kind="lembre">
        Os ODS são <strong>integrados</strong>: um ajuda o outro. Fechar a torneira enquanto escova os dentes ajuda o ODS 6 (água); apagar a luz ajuda o ODS 7 (energia) e
        o ODS 13 (clima).
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="✋">Os 5 Ps da Agenda 2030</H>
      <P>
        Para ficar mais fácil de lembrar, a ONU juntou os 17 ODS em cinco grandes áreas, todas começando com a letra P:
      </P>
      <Fig n="1.2" caption="Os 5 Ps: cada um reúne alguns ODS." h={21}>
        <FivePsArt />
      </Fig>
      <Table
        head={["P", "O que quer dizer"]}
        rows={[
          ["Pessoas", "Acabar com a pobreza e a fome, com saúde, educação e igualdade"],
          ["Planeta", "Proteger a água, o clima, os oceanos e as florestas"],
          ["Prosperidade", "Energia, trabalho digno, inovação e cidades para todos"],
          ["Paz", "Sociedades pacíficas, justas e sem violência"],
          ["Parcerias", "Todos trabalhando juntos"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🤝">Ninguém faz sozinho: o ODS 17</H>
      <P>
        O <T>ODS 17</T>, das <T>parcerias</T>, é o que segura todos os outros. Nenhum país, empresa ou pessoa consegue cumprir a Agenda 2030 sozinho: é preciso que
        governos, empresas, escolas, cientistas e cada um de nós trabalhem juntos.
      </P>
      <Fig n="1.3" caption="A Agenda 2030 depende de todo mundo de mãos dadas." h={22}>
        <HandsAroundArt />
      </Fig>
      <Cards
        items={[
          { icon: "🌐", title: "Pense global", text: "Os problemas do planeta são de todos: o clima e os oceanos não têm fronteira." },
          { icon: "🏡", title: "Aja local", text: "As mudanças começam em casa, na escola e no bairro." },
        ]}
      />
      <Box kind="experimente">Escolha um ODS e invente, com a sua turma, uma ação pequena para fazer na escola nesta semana.</Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Os ODS foram aprovados pela ONU em 2015, com 193 países: são 17 objetivos e 169 metas.",
          "O prazo é 2030, por isso o plano se chama Agenda 2030.",
          "Antes vieram os 8 Objetivos de Desenvolvimento do Milênio (2000 a 2015).",
          "Os 5 Ps: Pessoas, Planeta, Prosperidade, Paz e Parcerias.",
          "O ODS 17 (parcerias) é a base de todos os outros: ninguém faz sozinho.",
        ]}
      />
      <Glossary
        items={[
          ["ONU", "Organização das Nações Unidas, criada em 1945."],
          ["ODS", "Objetivos de Desenvolvimento Sustentável."],
          ["Agenda 2030", "O plano mundial com os 17 ODS e prazo em 2030."],
          ["Sustentável", "Que atende o presente sem prejudicar o futuro."],
          ["Meta", "Um passo concreto dentro de um objetivo."],
        ]}
      />
      <Quiz
        items={[
          ["Quantos são os ODS?", "17 objetivos, com 169 metas."],
          ["Qual é o ano-meta da Agenda 2030?", "2030."],
          ["Qual organização criou os ODS?", "A ONU, junto com os países que fazem parte dela."],
          ["Por que o ODS 17 é importante para todos os outros?", "Porque ninguém cumpre os ODS sozinho: é preciso trabalhar em parceria."],
        ]}
      />
    </>,
  ),
];
