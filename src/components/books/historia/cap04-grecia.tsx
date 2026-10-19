"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Column, DesertSun, Robed } from "./art";

// ============================================================================
// CAPÍTULO 4 — A GRÉCIA ANTIGA (missão "História: Grécia e Roma Antigas", a
// parte da Grécia): o Partenon no alto da Acrópole, a assembleia de Atenas
// (quem podia votar, de tocar), o treino dos soldados de Esparta, os atletas
// correndo nos Jogos Olímpicos e os filósofos conversando.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o Partenon na Acrópole
// ---------------------------------------------------------------------------

function ParthenonOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="O Partenon, templo grego de colunas brancas, no alto da colina da Acrópole, com uma oliveira e o Sol brilhando no céu azul">
      <rect width="460" height="300" fill="#bae6fd" />
      <DesertSun x={390} y={56} r={24} />
      <path d="M0 300 L0 210 Q120 170 230 176 Q340 170 460 210 L460 300 Z" fill="#a8a29e" />
      <path d="M100 196 L360 196 L360 186 L100 186 Z" fill="#e7e5e4" stroke="#78716c" />
      {Array.from({ length: 8 }, (_, i) => (
        <Column key={i} x={118 + i * 32} y={186} h={86} w={16} />
      ))}
      <path d="M100 100 L360 100 L360 112 L100 112 Z" fill="#e7e5e4" stroke="#78716c" />
      <path d="M96 100 L230 66 L364 100 Z" fill="#f5f5f4" stroke="#78716c" strokeWidth="2" />
      {/* a oliveira */}
      <g transform="translate(410 236)">
        <path d="M0 0 Q-4 -20 4 -40" stroke="#57534e" strokeWidth="6" fill="none" />
        <g className="cg-anim-float">
          <ellipse cx="4" cy="-52" rx="30" ry="18" fill="#65a30d" />
          {[-14, 0, 14].map((x) => (
            <circle key={x} cx={4 + x} cy={-50 + (x % 2)} r="3" fill="#1e1b4b" />
          ))}
        </g>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Quem podia votar em Atenas (de tocar)
// ---------------------------------------------------------------------------

const ATHENIANS = [
  { who: "Homem adulto, filho de pais atenienses", votes: true, robe: "#f8fafc", sash: "#1d4ed8", skin: "#d6a77a", s: 1 },
  { who: "Mulher ateniense", votes: false, robe: "#fce7f3", sash: "#be185d", skin: "#f1c9a5", s: 0.95 },
  { who: "Pessoa escravizada", votes: false, robe: "#d6d3d1", sash: "#57534e", skin: "#8d5524", s: 1 },
  { who: "Estrangeiro que morava em Atenas (meteco)", votes: false, robe: "#fef3c7", sash: "#a16207", skin: "#c68642", s: 1 },
  { who: "Menino ateniense", votes: false, robe: "#f8fafc", sash: "#1d4ed8", skin: "#e0ac69", s: 0.7 },
];

export function AthensVote() {
  const [sel, setSel] = useState<number | null>(null);
  const [seen, setSeen] = useState<number[]>([]);
  const p = sel === null ? null : ATHENIANS[sel];
  const pick = (i: number) => {
    setSel(i);
    setSeen((v) => (v.includes(i) ? v : [...v, i]));
  };
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.5em]">
      <svg viewBox="0 0 520 150" className="block w-full rounded-lg" aria-label="Cinco pessoas de Atenas: toque em cada uma para saber se podia votar">
        <rect width="520" height="150" fill="#e0f2fe" />
        <rect y="128" width="520" height="22" fill="#d6d3d1" />
        {ATHENIANS.map((a, i) => (
          <g key={i} onClick={() => pick(i)} style={{ cursor: "pointer" }}>
            <rect x={20 + i * 100} y="20" width="80" height="112" rx="10" fill={sel === i ? "#fef3c7" : "transparent"} />
            <Robed x={60 + i * 100} y={128} s={a.s * 1.2} robe={a.robe} sash={a.sash} skin={a.skin} />
            {seen.includes(i) && (
              <text x={60 + i * 100} y="22" textAnchor="middle" fontSize="18">
                {ATHENIANS[i].votes ? "✅" : "❌"}
              </text>
            )}
          </g>
        ))}
      </svg>
      <p key={String(sel)} className="cg-anim-fade mt-[0.35em] min-h-[2.6em] rounded-lg bg-[#eff6ff] px-[0.7em] py-[0.3em] text-[0.86em] leading-[1.4] text-[#1e3a8a]">
        {p ? (
          <>
            <strong>{p.who}:</strong> {p.votes ? "podia votar na assembleia. Era um cidadão." : "não podia votar. Não era considerado cidadão."}
          </>
        ) : (
          "Toque em cada pessoa para descobrir se ela podia votar na assembleia de Atenas."
        )}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// O treino dos soldados de Esparta
// ---------------------------------------------------------------------------

function SpartaArt() {
  return (
    <Art viewBox="0 0 560 200" label="Soldados de Esparta, os hoplitas, treinando em fila com escudos redondos e lanças, marchando no mesmo ritmo">
      <rect width="560" height="200" rx="14" fill="#fee2e2" />
      <rect y="160" width="560" height="40" fill="#d6a77a" />
      {Array.from({ length: 5 }, (_, i) => (
        <g key={i} transform={`translate(${70 + i * 100} 160)`}>
          <g>
            <animateTransform attributeName="transform" type="translate" values="0 0;0 -6;0 0" dur="0.8s" repeatCount="indefinite" />
            <path d="M-6 0 L-6 -24 M6 0 L6 -24" stroke="#c68642" strokeWidth="5" />
            <rect x="-14" y="-62" width="28" height="40" rx="6" fill="#b91c1c" />
            <circle cy="-72" r="11" fill="#c68642" />
            <path d="M-12 -74 Q0 -96 12 -74 Z" fill="#a16207" />
            <path d="M0 -94 Q14 -92 18 -80" stroke="#dc2626" strokeWidth="5" fill="none" />
            <path d="M24 -110 L24 0" stroke="#78350f" strokeWidth="3" />
            <path d="M21 -118 L24 -108 L27 -118 Z" fill="#94a3b8" />
            <circle cx="-14" cy="-44" r="18" fill="#ca8a04" stroke="#78350f" strokeWidth="2" />
            <path d="M-24 -44 L-4 -44" stroke="#fef3c7" strokeWidth="3" />
          </g>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os atletas correndo nos Jogos Olímpicos
// ---------------------------------------------------------------------------

function OlympicsArt() {
  return (
    <Art viewBox="0 0 560 200" label="Atletas gregos correndo na pista do estádio de Olímpia, e o vencedor recebendo uma coroa de folhas de oliveira">
      <rect width="560" height="200" rx="14" fill="#fef9c3" />
      <rect y="120" width="560" height="60" fill="#fdba74" />
      <path d="M0 150 L560 150" stroke="#fff" strokeWidth="2" strokeDasharray="12 8" />
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <animateTransform attributeName="transform" type="translate" values={`${-60 - k * 50} 0;${620 - k * 50} 0`} dur={`${5 + k * 0.6}s`} repeatCount="indefinite" />
          <g transform={`translate(0 ${140 + k * 12})`}>
            <path d="M0 -14 L-10 0 M0 -14 L10 -2" stroke="#c68642" strokeWidth="4" strokeLinecap="round">
              <animateTransform attributeName="transform" type="scale" values="1 1;-1 1;1 1" dur="0.4s" repeatCount="indefinite" />
            </path>
            <path d="M0 -14 L2 -34" stroke="#c68642" strokeWidth="6" strokeLinecap="round" />
            <circle cx="3" cy="-42" r="7" fill="#c68642" />
          </g>
        </g>
      ))}
      {/* o vencedor com a coroa de oliveira */}
      <g transform="translate(470 110)">
        <rect x="-26" y="0" width="52" height="16" fill="#e7e5e4" stroke="#78716c" />
        <Robed x={0} y={0} s={1} robe="#f8fafc" sash="#16a34a" crown />
      </g>
      <text x="200" y="40" textAnchor="middle" fontSize="15" fontWeight="900" fill="#92400e" fontFamily="Georgia, serif">
        Olímpia, 776 a.C.
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os filósofos conversando
// ---------------------------------------------------------------------------

function PhilosophersArt() {
  const people = [
    { x: 100, name: "Sócrates", quote: "Só sei que nada sei.", robe: "#f8fafc" },
    { x: 280, name: "Platão", quote: "Fundou a Academia.", robe: "#e0e7ff" },
    { x: 460, name: "Aristóteles", quote: "Estudou de tudo!", robe: "#fef3c7" },
  ];
  return (
    <Art viewBox="0 0 560 210" label="Três filósofos gregos de túnica conversando: Sócrates, Platão e Aristóteles, com balões de fala aparecendo um de cada vez">
      <rect width="560" height="210" rx="14" fill="#f5f3ff" />
      <Column x={30} y={196} h={170} w={20} />
      <Column x={530} y={196} h={170} w={20} />
      <rect y="186" width="560" height="24" fill="#e7e5e4" />
      {people.map((p, i) => (
        <g key={p.name}>
          <Robed x={p.x} y={186} s={1.3} robe={p.robe} sash="#7c3aed" skin={["#d6a77a", "#e0ac69", "#c68642"][i]} hair={["#a8a29e", "#3f2a14", "#57534e"][i]} />
          <text x={p.x} y="206" textAnchor="middle" fontSize="12" fontWeight="900" fill="#4c1d95" fontFamily="Georgia, serif">
            {p.name}
          </text>
          <g opacity="0">
            <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes={`0;${i * 0.3};${i * 0.3 + 0.03};${i * 0.3 + 0.27};${i * 0.3 + 0.3};1`} dur="9s" repeatCount="indefinite" />
            <rect x={p.x - 70} y="22" width="140" height="36" rx="16" fill="#fff" stroke="#4c1d95" strokeWidth="2" />
            <path d={`M${p.x - 6} 58 L${p.x} 72 L${p.x + 8} 58 Z`} fill="#fff" stroke="#4c1d95" strokeWidth="2" />
            <text x={p.x} y="45" textAnchor="middle" fontSize="12" fontWeight="900" fill="#4c1d95" fontFamily="Georgia, serif">
              {p.quote}
            </text>
          </g>
        </g>
      ))}
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
      title="A Grécia Antiga"
      goals={["Atenas e o nascimento da democracia", "Esparta, a cidade dos guerreiros", "Os Jogos Olímpicos da Antiguidade", "Os grandes filósofos gregos"]}
    >
      <Fig h={34}>
        <ParthenonOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🗳️">Atenas e a democracia</H>
      <P>
        A Grécia era dividida em cidades-estado independentes, as <T>pólis</T>. Em <T>Atenas</T>, por volta do século V a.C., surgiu a <T>democracia</T>, palavra que
        vem do grego <em>demos</em> (povo) e <em>kratos</em> (poder): o “governo do povo”. Mas quem era o “povo”?
      </P>
      <AthensVote />
      <Box kind="lembre">
        A democracia de Atenas era <strong>direta</strong>: os cidadãos votavam pessoalmente nas decisões. Hoje, na maioria dos países, ela é{" "}
        <strong>representativa</strong>: votamos em quem decide por nós.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🛡️">Esparta</H>
      <P>
        <T>Esparta</T>, a grande rival de Atenas, era uma sociedade militar. Os meninos começavam o treinamento de soldado aos <T>7 anos</T>, e a cidade valorizava a
        disciplina e a guerra.
      </P>
      <Fig n="4.1" caption="Os hoplitas espartanos treinando em formação." h={20}>
        <SpartaArt />
      </Fig>
      <Box kind="sabia">
        Atenas e Esparta se enfrentaram na <strong>Guerra do Peloponeso</strong> (431 a 404 a.C.), que terminou com a vitória de Esparta.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🏅">Os Jogos Olímpicos</H>
      <P>
        Os <T>Jogos Olímpicos</T> começaram em <T>776 a.C.</T>, na cidade de Olímpia, em homenagem a <T>Zeus</T>, o principal deus grego. Durante os jogos, as guerras
        entre as cidades paravam. O prêmio do vencedor era uma <T>coroa de folhas de oliveira</T>.
      </P>
      <Fig n="4.2" caption="Corrida no estádio de Olímpia." h={20}>
        <OlympicsArt />
      </Fig>
      <P>As Olimpíadas modernas começaram em 1896, justamente em Atenas.</P>
    </>,
  ),

  page(
    <>
      <H icon="🤔">Os filósofos</H>
      <P>
        Os gregos queriam entender o mundo pela <T>razão</T>: nasceu a <T>filosofia</T>, o “amor pela sabedoria”. <T>Sócrates</T> ensinava fazendo perguntas e não
        deixou nada escrito; conhecemos suas ideias pelo aluno <T>Platão</T>, que teve como aluno <T>Aristóteles</T>.
      </P>
      <Fig n="4.3" caption="Sócrates, Platão e Aristóteles." h={21}>
        <PhilosophersArt />
      </Fig>
      <Cards
        items={[
          { icon: "⚡", title: "Mitologia", text: "Zeus, Atena, Poseidon e outros deuses moravam no monte Olimpo." },
          { icon: "🎭", title: "Teatro", text: "Os gregos inventaram a tragédia e a comédia." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "A Grécia era dividida em cidades-estado, as pólis.",
          "Em Atenas nasceu a democracia, o “governo do povo”; mulheres, escravizados e estrangeiros não votavam.",
          "Esparta era militar: os meninos treinavam para a guerra desde os 7 anos.",
          "Os Jogos Olímpicos começaram em 776 a.C., em Olímpia, em homenagem a Zeus.",
          "Sócrates, Platão e Aristóteles são os grandes filósofos gregos.",
        ]}
      />
      <Glossary
        items={[
          ["Pólis", "Cidade-estado grega."],
          ["Democracia", "O governo do povo."],
          ["Cidadão", "Quem tinha direitos políticos na pólis."],
          ["Filosofia", "O “amor pela sabedoria”, a busca do saber pela razão."],
          ["Hoplita", "Soldado grego de escudo e lança."],
        ]}
      />
      <Quiz
        items={[
          ["Em qual cidade grega surgiu a democracia?", "Em Atenas."],
          ["O que significa “democracia”?", "Governo do povo."],
          ["Em homenagem a qual deus eram os Jogos Olímpicos?", "Zeus."],
          ["Qual filósofo disse “Só sei que nada sei”?", "Sócrates."],
        ]}
      />
    </>,
  ),
];
