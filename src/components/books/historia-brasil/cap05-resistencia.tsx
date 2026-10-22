"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Kid } from "../ods/art";
import { HB, HB_DARK, Palm, Panel, TapTimeline } from "./art";

// ============================================================================
// CAPÍTULO 5 — RESISTÊNCIA E LIBERDADE (missão "História do Brasil:
// Escravidão e Resistência"): o Quilombo dos Palmares na Serra da Barriga,
// a roda de capoeira, a linha do tempo de Palmares (de tocar), a Revolta dos
// Malês e as cartas da cultura afro-brasileira (de tocar).
// ============================================================================

const SKINS = ["#7c4a1e", "#5b3412", "#a16207", "#8b5a2b"];

// ---------------------------------------------------------------------------
// Abertura: o Quilombo dos Palmares
// ---------------------------------------------------------------------------

function PalmaresOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="O Quilombo dos Palmares no alto da Serra da Barriga, protegido por uma cerca de troncos, com casas, palmeiras, plantações e pessoas livres trabalhando e dançando">
      <rect width="460" height="300" fill="#fde68a" />
      <path d="M0 220 Q120 90 230 100 Q340 90 460 220 L460 300 L0 300 Z" fill="#65a30d" />
      <Palm x={60} y={200} s={0.9} />
      <Palm x={410} y={200} s={0.9} />
      <Palm x={330} y={130} s={0.7} />
      {Array.from({ length: 16 }, (_, i) => (
        <rect key={i} x={110 + i * 15} y={i === 7 || i === 8 ? 140 : 132} width="10" height={i === 7 || i === 8 ? 28 : 40} rx="3" fill="#92400e" stroke="#78350f" />
      ))}
      {[150, 230, 310].map((x) => (
        <g key={x} transform={`translate(${x} 124)`}>
          <rect x="-16" y="-20" width="32" height="20" fill="#d6b77a" stroke="#78350f" />
          <path d="M-22 -20 L0 -36 L22 -20 Z" fill="#a16207" />
        </g>
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${130 + i * 50} 250)`}>
          <g>
            <animateTransform attributeName="transform" type="translate" values="0 0;0 -8;0 0" dur="0.9s" begin={`${-i * 0.2}s`} repeatCount="indefinite" />
            <Kid x={0} y={0} s={0.9} shirt={["#dc2626", "#ca8a04", "#16a34a", "#7c3aed", "#ea580c"][i]} skin={SKINS[i % SKINS.length]} hair="#1e293b" />
          </g>
        </g>
      ))}
      <text x="230" y="40" textAnchor="middle" fontSize="20" fontWeight="900" fill={HB_DARK} fontFamily="Georgia, serif">
        Palmares: terra de liberdade
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A roda de capoeira
// ---------------------------------------------------------------------------

function CapoeiraArt() {
  return (
    <Art viewBox="0 0 560 180" label="Uma roda de capoeira: duas pessoas jogando no meio, uma girando com a perna no alto, e em volta pessoas tocando berimbau e batendo palmas">
      <rect width="560" height="180" rx="14" fill="#fef3c7" />
      <ellipse cx="280" cy="150" rx="200" ry="24" fill="#d6b77a" />
      {[120, 180, 380, 440].map((x, i) => (
        <g key={x} transform={`translate(${x} 160)`}>
          <Kid x={0} y={0} s={1} shirt="#fff" skin={SKINS[i % SKINS.length]} hair="#1e293b" />
          {i === 0 && <path d="M18 -50 Q30 -70 22 -96" stroke="#78350f" strokeWidth="3" fill="none" />}
        </g>
      ))}
      <g transform="translate(250 150)">
        <g>
          <animateTransform attributeName="transform" type="rotate" values="0 0 -30;-25 0 -30;0 0 -30" dur="1.6s" repeatCount="indefinite" />
          <Kid x={0} y={0} s={1.1} shirt="#fff" skin={SKINS[1]} hair="#1e293b" />
          <path d="M6 -20 L40 -50" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
        </g>
      </g>
      <g transform="translate(320 150)">
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0;-6 6;0 0" dur="1.6s" repeatCount="indefinite" />
          <Kid x={0} y={0} s={1.1} shirt="#fff" skin={SKINS[2]} hair="#1e293b" />
        </g>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O bilhete dos malês
// ---------------------------------------------------------------------------

function MalesArt() {
  return (
    <Art viewBox="0 0 560 150" label="Um bilhete escrito em letras árabes passando de mão em mão pelas ruas de Salvador, com o casario colorido ao fundo">
      <rect width="560" height="150" rx="14" fill="#fef3c7" />
      {[40, 110, 180, 380, 450, 520].map((x, i) => (
        <g key={x} transform={`translate(${x} 120)`}>
          <rect x="-30" y="-60" width="60" height="60" fill={["#f9a8d4", "#fde68a", "#93c5fd", "#bbf7d0", "#fdba74", "#c4b5fd"][i]} stroke="#78350f" />
          <rect x="-8" y="-28" width="16" height="28" fill="#78350f" />
          <rect x="-22" y="-50" width="12" height="12" fill="#fff" />
          <rect x="10" y="-50" width="12" height="12" fill="#fff" />
        </g>
      ))}
      <rect y="120" width="560" height="30" fill="#a8a29e" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -6;0 0" dur="2s" repeatCount="indefinite" />
        <rect x="220" y="24" width="120" height="84" rx="4" fill="#fffbeb" stroke="#a16207" strokeWidth="2" transform="rotate(-4 280 66)" />
        {[0, 1, 2, 3].map((k) => (
          <path key={k} d={`M330 ${44 + k * 16} q-10 -8 -20 0 t-20 0 t-20 0 t-20 0 t-20 0`} fill="none" stroke="#1e293b" strokeWidth="2.5" transform="rotate(-4 280 66)" />
        ))}
        <circle cx="236" cy="40" r="3" fill="#1e293b" />
      </g>
      <text x="280" y="140" textAnchor="middle" fontSize="12" fontWeight="900" fill={HB_DARK} fontFamily="Georgia, serif">
        os planos em árabe, de mão em mão
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A linha do tempo de Palmares
// ---------------------------------------------------------------------------

const PALMARES = [
  { year: "1597", name: "As primeiras fugas", text: "Pessoas escravizadas fogem dos engenhos de Pernambuco e se escondem na Serra da Barriga, hoje em Alagoas." },
  { year: "1630", name: "Palmares cresce", text: "Com a guerra contra os holandeses, mais gente foge. Palmares vira um conjunto de aldeias, os mocambos, com plantações e comércio." },
  { year: "1678", name: "Ganga Zumba", text: "O líder Ganga Zumba faz um acordo com o governo, mas muitos quilombolas não aceitam. Zumbi assume a liderança." },
  { year: "1694", name: "A queda", text: "Depois de quase um século de resistência, tropas do bandeirante Domingos Jorge Velho destroem a capital, Macaco." },
  { year: "1695", name: "Zumbi", text: "Zumbi é morto em 20 de novembro. A data virou o Dia Nacional de Zumbi e da Consciência Negra." },
];

// ---------------------------------------------------------------------------
// A cultura afro-brasileira (de tocar)
// ---------------------------------------------------------------------------

const CULTURE = [
  ["🥋", "Capoeira", "Luta, dança e jogo ao som do berimbau, criada pelos africanos escravizados. É Patrimônio da Humanidade."],
  ["🥁", "Samba", "Nasceu dos batuques afro-brasileiros, na Bahia e no Rio de Janeiro."],
  ["🌊", "Candomblé", "Religião de matriz africana que cultua os orixás, como Iemanjá e Xangô."],
  ["🍤", "Acarajé", "Bolinho de feijão-fradinho frito no azeite de dendê, comida das baianas."],
  ["👑", "Maracatu", "Cortejo de Pernambuco com rei, rainha e tambores."],
  ["💬", "Palavras", "Cafuné, moleque, caçula, quitanda e samba vieram de línguas africanas."],
] as const;

export function CultureCards() {
  const [sel, setSel] = useState(0);
  return (
    <Panel title="Toque para conhecer">
      <div className="grid grid-cols-6 gap-[0.25em]">
        {CULTURE.map(([icon, name], i) => (
          <button
            key={name}
            type="button"
            onClick={() => setSel(i)}
            className="flex flex-col items-center rounded-lg border py-[0.25em] text-[0.68em] font-bold leading-tight transition-colors"
            style={sel === i ? { background: HB, borderColor: HB, color: "#fff" } : { background: "#fff", borderColor: "#d9c79d", color: "#3b2a14" }}
          >
            <span className="text-[1.7em]">{icon}</span>
            {name}
          </button>
        ))}
      </div>
      <p key={sel} className="cg-anim-fade mt-[0.4em] text-[0.88em] leading-snug">
        <strong style={{ color: HB_DARK }}>{CULTURE[sel][1]}: </strong>
        {CULTURE[sel][2]}
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 5, content, bare });

export const chapter5: BookPage[] = [
  page(
    <ChapterOpener n={5} title="Resistência e Liberdade" goals={["As formas de resistência à escravidão", "O Quilombo dos Palmares, Zumbi e Dandara", "A Revolta dos Malês e os quilombos de hoje", "A cultura afro-brasileira"]}>
      <Fig h={34}>
        <PalmaresOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="✊">Ninguém aceitou a escravidão</H>
      <P>
        As pessoas escravizadas resistiram de muitas formas, todos os dias. Algumas fugiam e formavam <T>quilombos</T>, comunidades livres escondidas nas matas. Outras
        faziam revoltas, compravam a própria liberdade (a <T>alforria</T>) ou mantinham vivas as suas línguas, religiões, músicas e danças.
      </P>
      <Fig n="5.1" caption="A capoeira: luta disfarçada de dança." h={20}>
        <CapoeiraArt />
      </Fig>
      <Box kind="sabia">
        Diz a tradição que a capoeira parecia uma dança para os senhores não perceberem que era um treino de luta.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🛡️">O Quilombo dos Palmares</H>
      <P>
        O maior quilombo da América ficava na <T>Serra da Barriga</T>, em Alagoas, e resistiu por quase cem anos. Chegou a ter milhares de moradores, que plantavam,
        criavam animais e se defendiam. Seus grandes líderes foram <T>Ganga Zumba</T>, <T>Zumbi</T> e a guerreira <T>Dandara</T>.
      </P>
      <TapTimeline items={PALMARES} start={4} />
      <Box kind="lembre">
        O <strong>20 de novembro</strong>, dia da morte de Zumbi, é o Dia Nacional de Zumbi e da Consciência Negra, feriado em todo o Brasil.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="📿">A Revolta dos Malês e os quilombos de hoje</H>
      <P>
        Em 1835, em Salvador, africanos muçulmanos, chamados <T>malês</T>, organizaram uma das maiores revoltas urbanas de escravizados da América. Eles sabiam ler e
        escrever em árabe e espalharam os planos em bilhetes. A revolta foi derrotada, mas assustou os senhores.
      </P>
      <Fig n="5.2" caption="Os malês escreviam em árabe, que os senhores não sabiam ler." h={16}>
        <MalesArt />
      </Fig>
      <Table
        head={["Hoje", "Os quilombolas"]}
        rows={[
          ["Quantos são", "Cerca de 1,3 milhão de pessoas (Censo 2022)"],
          ["Onde vivem", "Em comunidades remanescentes de quilombos, em quase todo o país"],
          ["Direitos", "A Constituição de 1988 garante o título das terras que ocupam"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🥁">A cultura afro-brasileira</H>
      <P>
        Os africanos e seus descendentes ajudaram a formar o jeito de ser do Brasil: na música, na dança, na comida, nas religiões e na língua. Hoje, mais da metade dos
        brasileiros se declara preta ou parda.
      </P>
      <CultureCards />
      <Box kind="mago" title="Uma lei importante">
        Desde 2003, uma lei obriga as escolas a ensinar a história e a cultura afro-brasileira e africana. Conhecer essa história ajuda a combater o racismo.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Os escravizados resistiram com fugas, quilombos, revoltas, alforrias e a sua cultura.",
          "Palmares, na Serra da Barriga, resistiu por quase cem anos.",
          "Zumbi morreu em 20 de novembro de 1695: o Dia da Consciência Negra.",
          "A Revolta dos Malês aconteceu em Salvador, em 1835.",
          "Capoeira, samba, candomblé e muitas palavras são heranças africanas.",
        ]}
      />
      <Glossary
        items={[
          ["Quilombo", "Comunidade formada por pessoas que fugiam da escravidão."],
          ["Quilombola", "Quem vive num quilombo."],
          ["Alforria", "A liberdade dada ou comprada por uma pessoa escravizada."],
          ["Malês", "Africanos muçulmanos que se revoltaram em Salvador em 1835."],
          ["Orixá", "Divindade das religiões de matriz africana."],
        ]}
      />
      <Quiz
        items={[
          ["O que era um quilombo?", "Uma comunidade livre formada por pessoas que fugiam da escravidão."],
          ["Onde ficava o Quilombo dos Palmares?", "Na Serra da Barriga, em Alagoas."],
          ["Por que o 20 de novembro é uma data importante?", "É o dia da morte de Zumbi, o Dia da Consciência Negra."],
          ["Cite duas heranças da cultura africana no Brasil.", "Por exemplo: capoeira, samba, acarajé, candomblé."],
        ]}
      />
    </>,
  ),
];
