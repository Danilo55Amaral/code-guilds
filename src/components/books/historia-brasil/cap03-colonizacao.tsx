"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Caravel } from "../historia/art";
import { ChoiceGame } from "../portugues/art";
import { HB, HB_DARK, Panel } from "./art";

// ============================================================================
// CAPÍTULO 3 — A COLONIZAÇÃO (missão "História do Brasil: Os Primeiros Povos
// e a Colonização", a parte das capitanias e do Governo-Geral): Salvador, a
// primeira capital, com a cidade alta e a cidade baixa, o mapa das
// capitanias hereditárias (de tocar), a igreja dos jesuítas com o sino e o
// jogo "quem foi?".
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: Salvador, a primeira capital
// ---------------------------------------------------------------------------

function SalvadorOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="A cidade de Salvador em 1549: igreja e casas na cidade alta, sobre o morro, o porto na cidade baixa e uma caravela chegando na baía">
      <rect width="460" height="300" fill="#bae6fd" />
      <path d="M0 150 L200 120 Q260 110 300 160 L300 300 L0 300 Z" fill="#65a30d" />
      <path d="M300 160 L300 300 L180 300 Q240 240 300 160 Z" fill="#4d7c0f" />
      {[40, 90, 140].map((x, i) => (
        <g key={x} transform={`translate(${x} ${140 - i * 4})`}>
          <rect x="-16" y="-22" width="32" height="22" fill="#fef3c7" stroke="#78350f" />
          <path d="M-20 -22 L0 -36 L20 -22 Z" fill="#b91c1c" />
        </g>
      ))}
      <g transform="translate(220 122)">
        <rect x="-24" y="-40" width="48" height="40" fill="#fff" stroke="#78350f" strokeWidth="2" />
        <rect x="-10" y="-70" width="20" height="30" fill="#fff" stroke="#78350f" strokeWidth="2" />
        <path d="M-12 -70 L0 -84 L12 -70 Z" fill="#78350f" />
        <path d="M0 -92 V-84 M-4 -88 H4" stroke="#78350f" strokeWidth="2" />
        <rect x="-6" y="-18" width="12" height="18" fill="#78350f" />
      </g>
      <rect x="0" y="230" width="460" height="70" fill="#0ea5e9" />
      <rect x="240" y="214" width="80" height="16" fill="#a16207" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="80 0;0 0;80 0" dur="10s" repeatCount="indefinite" />
        <Caravel x={380} y={240} s={0.55} />
      </g>
      <text x="90" y="200" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff" stroke={HB_DARK} strokeWidth="3" paintOrder="stroke" fontFamily="Georgia, serif">
        cidade alta
      </text>
      <text x="280" y="210" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff" stroke={HB_DARK} strokeWidth="3" paintOrder="stroke" fontFamily="Georgia, serif">
        cidade baixa
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O mapa das capitanias (de tocar)
// ---------------------------------------------------------------------------

const CAPITANIAS = [
  { name: "Maranhão", owner: "João de Barros e Aires da Cunha", ok: false },
  { name: "Ceará", owner: "Antônio Cardoso de Barros", ok: false },
  { name: "Rio Grande", owner: "João de Barros e Aires da Cunha", ok: false },
  { name: "Itamaracá", owner: "Pero Lopes de Sousa", ok: false },
  { name: "Pernambuco", owner: "Duarte Coelho", ok: true },
  { name: "Baía de Todos os Santos", owner: "Francisco Pereira Coutinho", ok: false },
  { name: "Ilhéus", owner: "Jorge de Figueiredo Correia", ok: false },
  { name: "Porto Seguro", owner: "Pero do Campo Tourinho", ok: false },
  { name: "Espírito Santo", owner: "Vasco Fernandes Coutinho", ok: false },
  { name: "São Tomé", owner: "Pero de Góis", ok: false },
  { name: "São Vicente", owner: "Martim Afonso de Sousa", ok: true },
  { name: "Santana", owner: "Pero Lopes de Sousa", ok: false },
];

export function CapitaniasMap() {
  const [sel, setSel] = useState(4);
  const c = CAPITANIAS[sel];
  const n = CAPITANIAS.length;
  return (
    <Panel title="Toque numa capitania">
      <div className="flex items-center gap-[0.6em]">
        <svg viewBox="0 0 180 230" className="w-[42%] shrink-0" role="img" aria-label="O litoral do Brasil dividido em faixas, as capitanias hereditárias, da linha de Tordesilhas até o mar">
          <defs>
            <clipPath id="hb-capitanias">
              <path d="M20 10 L150 10 Q172 50 170 90 Q160 150 120 200 Q90 222 60 226 L20 226 Z" />
            </clipPath>
          </defs>
          <g clipPath="url(#hb-capitanias)">
            {CAPITANIAS.map((x, i) => (
              <rect
                key={x.name}
                x="0"
                y={10 + (i * 216) / n}
                width="180"
                height={216 / n}
                fill={sel === i ? "#facc15" : x.ok ? "#4ade80" : i % 2 ? "#fde68a" : "#fef3c7"}
                stroke="#a16207"
                strokeWidth="1"
                className="cursor-pointer"
                onClick={() => setSel(i)}
              />
            ))}
          </g>
          <path d="M20 10 L150 10 Q172 50 170 90 Q160 150 120 200 Q90 222 60 226" fill="none" stroke="#0ea5e9" strokeWidth="4" />
          <line x1="20" y1="6" x2="20" y2="228" stroke="#dc2626" strokeWidth="2" strokeDasharray="5 3" />
        </svg>
        <div key={sel} className="cg-anim-fade flex-1">
          <p className="cg-book-title text-[1.05em] font-black" style={{ color: HB_DARK }}>
            {c.name}
          </p>
          <p className="text-[0.84em]">
            <strong>Donatário:</strong> {c.owner}
          </p>
          <p className="mt-[0.3em] text-[0.84em] font-bold" style={{ color: c.ok ? HB : "#b91c1c" }}>
            {c.ok ? "✅ Prosperou, com a cana-de-açúcar e os engenhos." : "❌ Não prosperou: faltou dinheiro, gente e a terra ficou abandonada."}
          </p>
          <p className="mt-[0.3em] text-[0.72em] italic text-[#6b5a3a]">As faixas iam do litoral até a linha de Tordesilhas (vermelha).</p>
        </div>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// A igreja dos jesuítas
// ---------------------------------------------------------------------------

function JesuitArt() {
  return (
    <Art viewBox="0 0 560 180" label="Uma igreja simples de taipa com o sino balançando, um padre jesuíta de batina preta ensinando crianças indígenas sentadas no pátio">
      <rect width="560" height="180" rx="14" fill="#fef9c3" />
      <rect y="150" width="560" height="30" fill="#d6b77a" />
      <g transform="translate(140 150)">
        <rect x="-60" y="-80" width="120" height="80" fill="#fff" stroke="#a16207" strokeWidth="2" />
        <path d="M-70 -80 L0 -120 L70 -80 Z" fill="#b45309" />
        <rect x="-14" y="-40" width="28" height="40" fill="#78350f" />
        <g transform="translate(0 -96)">
          <g>
            <animateTransform attributeName="transform" type="rotate" values="-25;25;-25" dur="1.4s" repeatCount="indefinite" />
            <path d="M-8 0 Q-8 -14 0 -14 Q8 -14 8 0 Z" fill="#ca8a04" stroke="#78350f" />
          </g>
        </g>
      </g>
      <g transform="translate(330 150)">
        <rect x="-12" y="-60" width="24" height="60" fill="#1e293b" />
        <circle cy="-72" r="12" fill="#f1c9a5" />
        <path d="M12 -50 L40 -66" stroke="#1e293b" strokeWidth="6" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" values="0 12 -50;-14 12 -50;0 12 -50" dur="2s" repeatCount="indefinite" />
        </path>
      </g>
      {[400, 440, 480, 520].map((x, i) => (
        <g key={x} transform={`translate(${x} 150)`}>
          <ellipse cy="-8" rx="10" ry="8" fill="#ca8a04" />
          <circle cy="-24" r="8" fill="#a16207" />
          <path d="M-8 -28 Q0 -36 8 -28" fill="#1e293b" />
          <animateTransform attributeName="transform" type="translate" values={`${x} 150;${x} 147;${x} 150`} dur="1.6s" begin={`${-i * 0.3}s`} repeatCount="indefinite" />
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O jogo "quem foi?"
// ---------------------------------------------------------------------------

const WHO_GAME = [
  { prompt: "Fundou a primeira vila do Brasil, São Vicente, em 1532.", options: ["Martim Afonso de Sousa", "Tomé de Sousa", "Mem de Sá"], answer: 0, explain: "Martim Afonso chegou em 1530 e fundou São Vicente, no litoral de São Paulo." },
  { prompt: "Foi o primeiro governador-geral e fundou Salvador em 1549.", options: ["Duarte Coelho", "Tomé de Sousa", "Cabral"], answer: 1, explain: "Tomé de Sousa trouxe os primeiros jesuítas e fundou a primeira capital." },
  { prompt: "Escreveu uma gramática da língua tupi e ajudou a fundar São Paulo.", options: ["José de Anchieta", "Pero Vaz de Caminha", "Estácio de Sá"], answer: 0, explain: "O jesuíta Anchieta ajudou a fundar o Colégio de São Paulo, em 1554." },
  { prompt: "Donatário da capitania que mais prosperou, com o açúcar.", options: ["Pero de Góis", "Duarte Coelho", "Vasco Fernandes Coutinho"], answer: 1, explain: "Duarte Coelho fez de Pernambuco a capitania mais rica, com seus engenhos." },
];

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 3, content, bare });

export const chapter3: BookPage[] = [
  page(
    <ChapterOpener n={3} title="A Colonização" goals={["Por que Portugal decidiu colonizar", "As capitanias hereditárias", "O Governo-Geral e a fundação de Salvador", "Os jesuítas e a catequese"]}>
      <Fig h={34}>
        <SalvadorOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🗺️">As capitanias hereditárias</H>
      <P>
        Com medo de perder a terra para os franceses, Portugal decidiu ocupá-la. Em 1534, o rei Dom João III dividiu o litoral em grandes faixas, as{" "}
        <T>capitanias hereditárias</T>, e entregou cada uma a um nobre, o <T>donatário</T>, que pagava a colonização com o próprio dinheiro e passava a terra aos filhos.
      </P>
      <CapitaniasMap />
    </>,
  ),

  page(
    <>
      <H icon="🏛️">O Governo-Geral</H>
      <P>
        Quase todas as capitanias fracassaram: eram enormes, longe de Portugal, sem dinheiro e atacadas por povos que resistiam à ocupação. Então, em 1548, o rei criou o{" "}
        <T>Governo-Geral</T>, um governo central para toda a colônia.
      </P>
      <Table
        head={["Governador", "O que marcou"]}
        rows={[
          ["Tomé de Sousa (1549)", "Fundou Salvador, a primeira capital, e trouxe os jesuítas"],
          ["Duarte da Costa (1553)", "Enfrentou conflitos com os colonos e os indígenas"],
          ["Mem de Sá (1558)", "Expulsou os franceses da Baía de Guanabara; Estácio de Sá fundou o Rio de Janeiro em 1565"],
        ]}
      />
      <Box kind="lembre">
        As capitanias não acabaram de uma vez: o Governo-Geral passou a coordenar todas elas. Salvador foi a capital do Brasil até 1763.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="⛪">Os jesuítas</H>
      <P>
        Os padres <T>jesuítas</T>, como <T>Manuel da Nóbrega</T> e <T>José de Anchieta</T>, vieram para <T>catequizar</T> os indígenas, ensinando a religião católica.
        Reuniam os indígenas em aldeamentos, fundaram colégios e escreveram sobre a língua tupi.
      </P>
      <Fig n="3.1" caption="Um aldeamento jesuíta." h={18}>
        <JesuitArt />
      </Fig>
      <Box kind="atencao">
        A catequese também mudou à força os costumes, as crenças e as línguas indígenas. Ao mesmo tempo, os jesuítas se opunham à escravização dos indígenas pelos colonos.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="❓">Quem foi?</H>
      <P>Teste o que você aprendeu sobre os primeiros tempos da colônia:</P>
      <ChoiceGame items={WHO_GAME} color={HB} title="Quem foi?" />
      <Cards
        items={[
          { icon: "🏘️", title: "Câmaras municipais", text: "Governavam as vilas; nelas só votavam os “homens bons”, os ricos proprietários." },
          { icon: "📅", title: "1554", text: "Os jesuítas fundam o Colégio de São Paulo, que daria origem à cidade." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Portugal decidiu colonizar o Brasil para não perder a terra para outros europeus.",
          "Em 1534, o litoral foi dividido em capitanias hereditárias, entregues a donatários.",
          "Só Pernambuco e São Vicente prosperaram.",
          "Em 1548 foi criado o Governo-Geral; Tomé de Sousa fundou Salvador em 1549.",
          "Os jesuítas catequizaram os indígenas e fundaram colégios, como o de São Paulo.",
        ]}
      />
      <Glossary
        items={[
          ["Capitania hereditária", "Faixa de terra entregue a um donatário, passada de pai para filho."],
          ["Donatário", "O nobre que recebia e administrava uma capitania."],
          ["Governo-Geral", "O governo central da colônia, criado em 1548."],
          ["Catequese", "O ensino da religião católica."],
          ["Jesuíta", "Padre da Companhia de Jesus."],
        ]}
      />
      <Quiz
        items={[
          ["Em que ano foram criadas as capitanias hereditárias?", "Em 1534."],
          ["Quais capitanias prosperaram?", "Pernambuco e São Vicente."],
          ["Qual foi a primeira capital do Brasil?", "Salvador, fundada em 1549."],
          ["O que os jesuítas vieram fazer no Brasil?", "Catequizar os indígenas e fundar colégios."],
        ]}
      />
    </>,
  ),
];
