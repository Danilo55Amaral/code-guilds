"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Caravel, Scroll } from "../historia/art";
import { Kid } from "../ods/art";
import { HB_DARK, Palm, Panel, Pill } from "./art";

// ============================================================================
// CAPÍTULO 2 — A CHEGADA DOS PORTUGUESES (missão "História do Brasil: Os
// Primeiros Povos e a Colonização", a parte de 1500): a esquadra de Cabral
// avistando o Monte Pascoal, a linha de Tordesilhas e o Brasil de hoje (de
// tocar), a pena escrevendo a carta de Caminha e a troca do pau-brasil.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a esquadra de Cabral
// ---------------------------------------------------------------------------

function FleetOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="As caravelas da esquadra de Cabral no mar, chegando a uma praia com palmeiras e o Monte Pascoal ao fundo">
      <rect width="460" height="300" fill="#bae6fd" />
      <path d="M260 150 Q330 60 400 150 Z" fill="#65a30d" stroke="#3f6212" strokeWidth="2" />
      <text x="330" y="80" textAnchor="middle" fontSize="12" fontWeight="900" fill="#14532d" fontFamily="Georgia, serif">
        Monte Pascoal
      </text>
      <path d="M240 150 L460 150 L460 210 Q350 200 250 190 Z" fill="#fde68a" />
      <Palm x={300} y={180} s={0.7} />
      <Palm x={360} y={186} s={0.9} />
      <Palm x={420} y={182} s={0.6} />
      <path d="M0 160 Q120 150 250 190 L460 210 L460 300 L0 300 Z" fill="#0ea5e9" />
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <animateTransform attributeName="transform" type="translate" values={`${-k * 20} 0;${40 - k * 20} 0;${-k * 20} 0`} dur="8s" repeatCount="indefinite" />
          <Caravel x={70 + k * 70} y={200 + k * 28} s={0.6 - k * 0.08} />
        </g>
      ))}
      <text x="110" y="40" textAnchor="middle" fontSize="20" fontWeight="900" fill={HB_DARK} fontFamily="Georgia, serif">
        22 de abril de 1500
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Tordesilhas e o Brasil de hoje (de tocar)
// ---------------------------------------------------------------------------

export function TordesilhasMap() {
  const [today, setToday] = useState(false);
  return (
    <Panel title="O Brasil de Tordesilhas e o de hoje">
      <div className="mb-[0.3em] flex justify-center gap-[0.3em]">
        <Pill on={!today} onClick={() => setToday(false)}>
          1494: Tordesilhas
        </Pill>
        <Pill on={today} onClick={() => setToday(true)}>
          Hoje
        </Pill>
      </div>
      <svg viewBox="0 0 400 210" className="mx-auto w-[80%]" role="img" aria-label={today ? "O mapa do Brasil de hoje, muito maior que a parte de Portugal em 1494" : "A linha de Tordesilhas cortando a América do Sul: o lado leste era de Portugal e o oeste, da Espanha"}>
        <rect width="400" height="210" rx="10" fill="#bae6fd" />
        <path d="M120 20 Q200 10 270 40 Q330 60 320 110 Q300 170 240 200 Q200 205 190 170 Q160 130 130 100 Q110 60 120 20 Z" fill="#fde68a" stroke="#a16207" strokeWidth="2" />
        {!today && (
          <>
            <path d="M248 20 L248 210" stroke="#dc2626" strokeWidth="3" strokeDasharray="8 5" />
            <path d="M248 20 Q300 30 320 60 Q332 100 316 120 Q300 170 248 196 Z" fill="#16a34a" opacity="0.5" />
            <text x="290" y="100" textAnchor="middle" fontSize="13" fontWeight="900" fill="#14532d">Portugal</text>
            <text x="180" y="100" textAnchor="middle" fontSize="13" fontWeight="900" fill="#b45309">Espanha</text>
            <text x="252" y="16" fontSize="11" fontWeight="900" fill="#dc2626">linha de Tordesilhas</text>
          </>
        )}
        {today && (
          <>
            <g className="cg-anim-fade">
              <path d="M160 40 Q230 26 300 52 Q332 90 318 120 Q300 168 252 196 Q226 200 214 176 Q196 150 186 130 Q166 120 150 100 Q140 70 160 40 Z" fill="#16a34a" opacity="0.6" />
            </g>
            <text x="240" y="112" textAnchor="middle" fontSize="15" fontWeight="900" fill="#14532d">Brasil</text>
          </>
        )}
      </svg>
      <p className="mt-[0.2em] text-[0.84em] leading-snug">
        {today
          ? "Com as bandeiras, os bandeirantes, a mineração e vários tratados, o Brasil cresceu muito além de Tordesilhas e virou o maior país da América do Sul."
          : "Em 1494, Portugal e Espanha dividiram as terras “descobertas e por descobrir” com uma linha a 370 léguas de Cabo Verde."}
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// A carta de Caminha
// ---------------------------------------------------------------------------

function LetterArt() {
  return (
    <Art viewBox="0 0 560 170" label="Um pergaminho aberto com a carta de Pero Vaz de Caminha e uma pena de escrever se mexendo como se escrevesse">
      <rect width="560" height="170" rx="14" fill="#fef9c3" />
      <Scroll x={150} y={20} w={260} h={130} title="Carta a el-rei Dom Manuel" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;80 6;0 12;80 18;0 0" dur="4s" repeatCount="indefinite" />
        <g transform="translate(250 60) rotate(30)">
          <path d="M0 0 Q8 -40 4 -70 Q-6 -40 0 0 Z" fill="#fff" stroke="#94a3b8" />
          <line x1="0" y1="0" x2="3" y2="-60" stroke="#94a3b8" />
        </g>
      </g>
      <text x="80" y="160" textAnchor="middle" fontSize="12" fontWeight="900" fill={HB_DARK} fontFamily="Georgia, serif">
        1º de maio de 1500
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O pau-brasil e o escambo
// ---------------------------------------------------------------------------

function BrazilwoodArt() {
  return (
    <Art viewBox="0 0 560 180" label="Indígenas carregando toras de pau-brasil até uma caravela, e em troca recebendo machados e espelhos; a madeira cortada solta uma tinta vermelha">
      <rect width="560" height="180" rx="14" fill="#ecfccb" />
      <g transform="translate(70 150)">
        <path d="M-6 0 L-4 -70 L4 -70 L6 0 Z" fill="#991b1b" />
        <circle cy="-90" r="34" fill="#15803d" />
        <circle cx="-20" cy="-74" r="20" fill="#16a34a" />
        <circle cx="20" cy="-74" r="20" fill="#16a34a" />
        {[0, 1].map((k) => (
          <circle key={k} cx="0" r="3" fill="#dc2626">
            <animate attributeName="cy" values="-40;0" dur="1.4s" begin={`${-k * 0.7}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </g>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;220 0;220 0;0 0" keyTimes="0;0.45;0.55;1" dur="6s" repeatCount="indefinite" />
        <Kid x={150} y={160} s={0.9} shirt="#ca8a04" skin="#a16207" hair="#1e293b" />
        <rect x="128" y="104" width="50" height="10" rx="4" fill="#991b1b" />
      </g>
      <Caravel x={470} y={140} s={0.7} />
      <rect y="150" width="560" height="30" fill="#0ea5e9" opacity="0.5" />
      <text x="400" y="40" textAnchor="middle" fontSize="13" fontWeight="900" fill={HB_DARK} fontFamily="Georgia, serif">
        toras ⇄ machados, facas e espelhos
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 2, content, bare });

export const chapter2: BookPage[] = [
  page(
    <ChapterOpener n={2} title="A Chegada dos Portugueses" goals={["As Grandes Navegações e o Tratado de Tordesilhas", "A esquadra de Pedro Álvares Cabral", "A carta de Pero Vaz de Caminha", "O pau-brasil e o escambo"]}>
      <Fig h={34}>
        <FleetOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🧭">As Grandes Navegações</H>
      <P>
        No século XV, Portugal e Espanha se lançaram ao mar em busca de um caminho para as <T>Índias</T> e suas especiarias. Para não brigarem pelas terras novas,
        assinaram em 1494 o <T>Tratado de Tordesilhas</T>, que dividia o mundo com uma linha imaginária.
      </P>
      <TordesilhasMap />
      <Box kind="sabia">
        A <strong>caravela</strong> foi a grande invenção dos portugueses: leve e com velas triangulares, conseguia navegar até contra o vento.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="⛵">A esquadra de Cabral</H>
      <P>
        Em 1500, uma esquadra de 13 navios comandada por <T>Pedro Álvares Cabral</T> saiu de Lisboa rumo às Índias. Em <T>22 de abril</T>, os marinheiros avistaram um
        monte, que chamaram de <T>Monte Pascoal</T>, no sul da Bahia. Os indígenas Tupiniquim estavam na praia.
      </P>
      <Table
        head={["Data", "O que aconteceu"]}
        rows={[
          ["9 de março", "A esquadra sai de Lisboa, em Portugal"],
          ["22 de abril", "Os portugueses avistam o Monte Pascoal"],
          ["26 de abril", "É rezada a primeira missa na nova terra"],
          ["2 de maio", "A esquadra segue viagem para as Índias"],
        ]}
      />
      <Box kind="atencao">
        Dizer que o Brasil foi “descoberto” é olhar só pelo lado europeu: milhões de indígenas já viviam aqui. Por isso muitos historiadores falam em{" "}
        <strong>chegada</strong> dos portugueses.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="✒️">A certidão de nascimento</H>
      <P>
        O escrivão <T>Pero Vaz de Caminha</T> escreveu uma longa carta ao rei Dom Manuel contando tudo o que viu: a natureza, a água boa e os indígenas, que andavam sem
        roupas e eram “de bons rostos e bons narizes”. Ela é chamada de certidão de nascimento do Brasil.
      </P>
      <Fig n="2.1" caption="A carta de Caminha, escrita em Porto Seguro." h={18}>
        <LetterArt />
      </Fig>
      <Box kind="lembre">
        Caminha escreveu que a terra era tão boa que, “em se plantando, dar-se-á nela tudo”. Os portugueses chamaram a terra de Ilha de Vera Cruz, depois Terra de
        Santa Cruz e, por fim, Brasil.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🌳">O pau-brasil e o escambo</H>
      <P>
        Nos primeiros 30 anos, Portugal quase não ocupou a terra: só explorou o <T>pau-brasil</T>, uma árvore que dava tinta vermelha para tingir tecidos. Os indígenas
        cortavam as árvores e as levavam até os navios em troca de objetos, um comércio sem dinheiro chamado <T>escambo</T>.
      </P>
      <Fig n="2.2" caption="O escambo do pau-brasil." h={18}>
        <BrazilwoodArt />
      </Fig>
      <Cards
        items={[
          { icon: "🔥", title: "O nome do país", text: "Pau-brasil vem de “brasa”, por causa da cor vermelha da madeira." },
          { icon: "⚓", title: "Os franceses", text: "Também vinham buscar pau-brasil, o que preocupou Portugal." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Portugal e Espanha buscavam um caminho para as Índias pelo mar.",
          "O Tratado de Tordesilhas (1494) dividiu as terras entre os dois reinos.",
          "A esquadra de Cabral chegou em 22 de abril de 1500, no sul da Bahia.",
          "A carta de Pero Vaz de Caminha é a certidão de nascimento do Brasil.",
          "Até 1530, Portugal só explorou o pau-brasil, pelo escambo com os indígenas.",
        ]}
      />
      <Glossary
        items={[
          ["Especiarias", "Temperos caros do Oriente, como pimenta e canela."],
          ["Caravela", "Navio português leve, de velas triangulares."],
          ["Tratado", "Acordo assinado entre países ou reinos."],
          ["Escambo", "Troca de mercadorias sem usar dinheiro."],
          ["Pau-brasil", "Árvore de madeira vermelha que dava tinta."],
        ]}
      />
      <Quiz
        items={[
          ["Que tratado dividiu as terras entre Portugal e Espanha?", "O Tratado de Tordesilhas, de 1494."],
          ["Em que dia a esquadra de Cabral avistou o Monte Pascoal?", "Em 22 de abril de 1500."],
          ["Quem escreveu a carta chamada de certidão de nascimento do Brasil?", "Pero Vaz de Caminha."],
          ["O que era o escambo?", "A troca de mercadorias sem dinheiro, como o pau-brasil por machados."],
        ]}
      />
    </>,
  ),
];
