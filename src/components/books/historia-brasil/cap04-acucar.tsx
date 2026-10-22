"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { HB, Panel, Pill } from "./art";

// ============================================================================
// CAPÍTULO 4 — O AÇÚCAR E A ESCRAVIDÃO (missões "Os Primeiros Povos e a
// Colonização" e "Escravidão e Resistência", a parte do açúcar e do
// tráfico): a roda-d'água do engenho girando, o engenho por dentro (de
// tocar), as rotas do Atlântico e Recife no tempo dos holandeses.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o engenho
// ---------------------------------------------------------------------------

function MillOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Um engenho de açúcar: o canavial verde, a casa do engenho com a roda-d'água girando no rio e a chaminé soltando fumaça">
      <rect width="460" height="300" fill="#fef3c7" />
      <rect y="200" width="460" height="100" fill="#84cc16" />
      {Array.from({ length: 24 }, (_, i) => (
        <path key={i} d={`M${i * 20 + 4} 260 Q${i * 20 + 8} 220 ${i * 20 + 2} 196`} stroke="#4d7c0f" strokeWidth="3" fill="none">
          <animateTransform attributeName="transform" type="rotate" values={`-3 ${i * 20 + 4} 260;3 ${i * 20 + 4} 260;-3 ${i * 20 + 4} 260`} dur="3s" begin={`${-i * 0.1}s`} repeatCount="indefinite" />
        </path>
      ))}
      <rect x="160" y="110" width="170" height="100" fill="#fff" stroke="#78350f" strokeWidth="2" />
      <path d="M150 110 L245 70 L340 110 Z" fill="#b45309" />
      <rect x="290" y="40" width="20" height="60" fill="#78350f" />
      {[0, 1, 2].map((k) => (
        <circle key={k} cx="300" r="12" fill="#a8a29e" opacity="0.6">
          <animate attributeName="cy" values="36;-20" dur="3s" begin={`${-k}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0" dur="3s" begin={`${-k}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <path d="M0 230 Q100 220 160 236 L160 250 Q100 240 0 250 Z" fill="#0ea5e9" />
      <g transform="translate(140 200)">
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="5s" repeatCount="indefinite" />
          <circle r="34" fill="none" stroke="#78350f" strokeWidth="5" />
          {Array.from({ length: 8 }, (_, i) => (
            <g key={i} transform={`rotate(${i * 45})`}>
              <line y2="-34" stroke="#78350f" strokeWidth="3" />
              <rect x="-6" y="-42" width="12" height="10" fill="#92400e" />
            </g>
          ))}
        </g>
        <circle r="6" fill="#78350f" />
      </g>
      <rect x="200" y="160" width="30" height="50" fill="#78350f" />
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O engenho por dentro (de tocar)
// ---------------------------------------------------------------------------

const MILL_PARTS = {
  canavial: { x: 70, y: 150, text: "Canavial: a plantação de cana, num latifúndio. O trabalho começava antes de o Sol nascer, cortando a cana com foice." },
  moenda: { x: 200, y: 120, text: "Moenda: a máquina que espremia a cana para tirar o caldo, movida por bois ou pela roda-d'água." },
  caldeiras: { x: 280, y: 120, text: "Casa das caldeiras: o caldo fervia em grandes tachos de cobre até engrossar. Era o trabalho mais quente e perigoso." },
  purgar: { x: 350, y: 120, text: "Casa de purgar: o açúcar secava e era clareado em formas de barro, e depois era encaixotado para a Europa." },
  "casa-grande": { x: 120, y: 60, text: "Casa-grande: a casa do senhor de engenho e da família dele, o centro do poder." },
  senzala: { x: 330, y: 60, text: "Senzala: a construção simples onde ficavam presas as pessoas escravizadas." },
};

export function MillTour() {
  const [part, setPart] = useState<keyof typeof MILL_PARTS>("moenda");
  const label = (k: string) => (k === "casa-grande" ? "casa-grande" : k === "caldeiras" ? "caldeiras" : k === "purgar" ? "purgar" : k);
  return (
    <Panel title="Toque nas partes do engenho">
      <svg viewBox="0 0 420 180" className="w-full" role="img" aria-label="O desenho de um engenho com o canavial, a moenda, a casa das caldeiras, a casa de purgar, a casa-grande e a senzala">
        <rect width="420" height="180" rx="10" fill="#fef9c3" />
        <rect y="140" width="420" height="40" fill="#a3e635" />
        {Array.from({ length: 10 }, (_, i) => (
          <path key={i} d={`M${10 + i * 12} 176 Q${14 + i * 12} 150 ${8 + i * 12} 128`} stroke="#4d7c0f" strokeWidth="3" fill="none" />
        ))}
        <rect x="80" y="36" width="90" height="44" fill="#fff" stroke="#78350f" strokeWidth="2" />
        <path d="M74 36 L125 14 L176 36 Z" fill="#b91c1c" />
        <rect x="290" y="46" width="90" height="30" fill="#d6b77a" stroke="#78350f" strokeWidth="2" />
        <path d="M286 46 L335 32 L384 46 Z" fill="#a16207" />
        <rect x="170" y="100" width="210" height="44" fill="#fff" stroke="#78350f" strokeWidth="2" />
        <circle cx="200" cy="122" r="14" fill="none" stroke="#78350f" strokeWidth="3">
          <animateTransform attributeName="transform" type="rotate" from="0 200 122" to="360 200 122" dur="3s" repeatCount="indefinite" />
        </circle>
        <path d="M268 132 Q280 112 292 132 Z" fill="#b45309" />
        {[0, 1].map((k) => (
          <circle key={k} cx="280" r="5" fill="#d6d3d1">
            <animate attributeName="cy" values="110;80" dur="1.5s" begin={`${-k * 0.75}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0" dur="1.5s" begin={`${-k * 0.75}s`} repeatCount="indefinite" />
          </circle>
        ))}
        {[340, 356].map((x) => (
          <path key={x} d={`M${x} 112 L${x + 10} 112 L${x + 6} 134 L${x + 4} 134 Z`} fill="#fef3c7" stroke="#a16207" />
        ))}
        {(Object.keys(MILL_PARTS) as (keyof typeof MILL_PARTS)[]).map((k) => (
          <g key={k} className="cursor-pointer" onClick={() => setPart(k)}>
            <circle cx={MILL_PARTS[k].x} cy={MILL_PARTS[k].y} r="10" fill={part === k ? "#dc2626" : HB} stroke="#fff" strokeWidth="2" />
            <text x={MILL_PARTS[k].x} y={MILL_PARTS[k].y + 4} textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff">
              ?
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-[0.3em] flex flex-wrap justify-center gap-[0.25em]">
        {(Object.keys(MILL_PARTS) as (keyof typeof MILL_PARTS)[]).map((k) => (
          <Pill key={k} on={part === k} onClick={() => setPart(k)}>
            {label(k)}
          </Pill>
        ))}
      </div>
      <p key={part} className="cg-anim-fade mt-[0.3em] text-[0.86em] leading-snug">
        {MILL_PARTS[part].text}
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As rotas do Atlântico
// ---------------------------------------------------------------------------

function AtlanticArt() {
  const routes = [
    { d: "M420 120 Q330 140 220 150", color: "#7f1d1d", label: "pessoas escravizadas" },
    { d: "M220 150 Q300 60 400 40", color: "#ca8a04", label: "açúcar" },
    { d: "M400 40 Q430 80 420 120", color: "#2563eb", label: "tecidos, armas, aguardente" },
  ];
  return (
    <Art viewBox="0 0 560 200" label="Um mapa do Oceano Atlântico com as rotas: navios levando pessoas escravizadas da África para o Brasil, o açúcar do Brasil para a Europa e mercadorias da Europa para a África">
      <rect width="560" height="200" rx="14" fill="#bae6fd" />
      <path d="M120 60 Q200 50 240 100 Q250 160 200 196 L120 196 Q100 120 120 60 Z" fill="#86efac" stroke="#15803d" strokeWidth="2" />
      <text x="170" y="130" textAnchor="middle" fontSize="13" fontWeight="900" fill="#14532d" fontFamily="Georgia, serif">Brasil</text>
      <path d="M390 80 Q450 70 480 110 Q480 170 440 196 L410 196 Q400 140 390 80 Z" fill="#fde68a" stroke="#a16207" strokeWidth="2" />
      <text x="440" y="150" textAnchor="middle" fontSize="13" fontWeight="900" fill="#78350f" fontFamily="Georgia, serif">África</text>
      <path d="M370 6 Q440 0 470 30 Q450 50 400 50 Q370 40 370 6 Z" fill="#e9d5ff" stroke="#7c3aed" strokeWidth="2" />
      <text x="420" y="32" textAnchor="middle" fontSize="13" fontWeight="900" fill="#581c87" fontFamily="Georgia, serif">Europa</text>
      {routes.map((r, i) => (
        <g key={r.label}>
          <path d={r.d} fill="none" stroke={r.color} strokeWidth="3" strokeDasharray="8 5" />
          <circle r="7" fill={r.color}>
            <animateMotion path={r.d} dur="3.6s" begin={`${-i * 1.2}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      <text x="300" y="168" textAnchor="middle" fontSize="12" fontWeight="900" fill="#7f1d1d">pessoas escravizadas</text>
      <text x="290" y="80" textAnchor="middle" fontSize="12" fontWeight="900" fill="#a16207">açúcar</text>
      <text x="500" y="70" textAnchor="middle" fontSize="11" fontWeight="900" fill="#1d4ed8">mercadorias</text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 4, content, bare });

export const chapter4: BookPage[] = [
  page(
    <ChapterOpener n={4} title="O Açúcar e a Escravidão" goals={["Por que o açúcar foi o grande negócio da colônia", "Como funcionava um engenho", "O tráfico de africanos escravizados", "Os holandeses no Nordeste"]}>
      <Fig h={34}>
        <MillOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🍬">O ouro branco</H>
      <P>
        Nos séculos XVI e XVII, o <T>açúcar</T> era caríssimo na Europa. O litoral do Nordeste tinha clima quente e o solo de <T>massapê</T>, perfeito para a cana. Os
        portugueses montaram ali o sistema de <T>plantation</T>.
      </P>
      <Cards
        items={[
          { icon: "🏞️", title: "Latifúndio", text: "Fazendas enormes, nas mãos de poucos senhores." },
          { icon: "🌱", title: "Monocultura", text: "Plantava-se quase só cana, um produto só." },
          { icon: "⛓️", title: "Trabalho escravo", text: "Primeiro de indígenas e depois, principalmente, de africanos escravizados." },
          { icon: "🚢", title: "Exportação", text: "O açúcar ia para a Europa, e o lucro ficava com os senhores e a Coroa." },
        ]}
      />
      <Box kind="lembre">
        O Brasil chegou a ser o maior produtor de açúcar do mundo. Pernambuco e a Bahia foram os grandes centros açucareiros.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🏭">Por dentro de um engenho</H>
      <P>
        O <T>engenho</T> era a fazenda de açúcar inteira, com o canavial, as construções onde a cana virava açúcar, a casa do senhor e a senzala. Explore:
      </P>
      <MillTour />
    </>,
  ),

  page(
    <>
      <H icon="⛓️">O tráfico de africanos</H>
      <P>
        Para trabalhar nos engenhos e, depois, nas minas e nos cafezais, cerca de <T>4,8 milhões</T> de africanos foram trazidos à força ao Brasil, o maior destino do{" "}
        <T>tráfico negreiro</T> no mundo. A viagem nos <T>navios negreiros</T> era terrível, e muitos morriam no caminho.
      </P>
      <Fig n="4.1" caption="As rotas do comércio no Atlântico." h={20}>
        <AtlanticArt />
      </Fig>
      <Table
        head={["Povos", "De onde vinham"]}
        rows={[
          ["Bantos", "Regiões de Angola, do Congo e de Moçambique"],
          ["Iorubás (nagôs), jejes e haussás", "A Costa da Mina, no golfo da Guiné (hoje Nigéria e Benin)"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🌷">Os holandeses no Nordeste</H>
      <P>
        Os holandeses ajudavam a refinar e vender o açúcar. Quando Portugal passou a ser governado pela Espanha, inimiga deles, a <T>Companhia das Índias Ocidentais</T>{" "}
        invadiu Salvador (1624) e depois Pernambuco (1630), onde ficou até 1654.
      </P>
      <Box kind="sabia">
        O governador holandês <strong>Maurício de Nassau</strong> trouxe artistas e cientistas, construiu pontes e transformou Recife numa das cidades mais modernas da
        América.
      </Box>
      <P>
        Em 1654, os holandeses foram expulsos na <T>Insurreição Pernambucana</T>. Eles levaram para o Caribe o que aprenderam e começaram a produzir açúcar lá, e o açúcar
        brasileiro perdeu valor.
      </P>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "O açúcar foi o grande negócio da colônia, no litoral do Nordeste.",
          "A plantation tinha latifúndio, monocultura, trabalho escravo e exportação.",
          "O engenho tinha canavial, moenda, casa das caldeiras, casa de purgar, casa-grande e senzala.",
          "Cerca de 4,8 milhões de africanos foram trazidos à força ao Brasil.",
          "Os holandeses ocuparam Pernambuco de 1630 a 1654.",
        ]}
      />
      <Glossary
        items={[
          ["Plantation", "Sistema de grandes fazendas de um produto, com trabalho escravo, para exportar."],
          ["Engenho", "A fazenda de açúcar e a fábrica onde a cana virava açúcar."],
          ["Senhor de engenho", "O dono do engenho e das terras."],
          ["Tráfico negreiro", "O comércio de pessoas escravizadas trazidas da África."],
          ["Massapê", "Solo escuro e fértil do litoral nordestino."],
        ]}
      />
      <Quiz
        items={[
          ["Por que a cana foi plantada no litoral do Nordeste?", "Pelo clima quente e pelo solo fértil de massapê."],
          ["Para que servia a moenda?", "Para espremer a cana e tirar o caldo."],
          ["Quantos africanos foram trazidos à força ao Brasil, aproximadamente?", "Cerca de 4,8 milhões."],
          ["Quem foi Maurício de Nassau?", "O governador holandês de Pernambuco, que modernizou Recife."],
        ]}
      />
    </>,
  ),
];
