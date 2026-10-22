"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Caravel } from "../historia/art";
import { HB_DARK, Panel, TapTimeline } from "./art";

// ============================================================================
// CAPÍTULO 7 — A FAMÍLIA REAL E A INDEPENDÊNCIA (missão "Regências e Segundo
// Reinado", a parte de 1808 a 1831): Dom Pedro erguendo a espada no Ipiranga,
// a frota da corte atravessando o Atlântico, a linha do tempo da
// Independência (de tocar) e os quatro poderes da Constituição de 1824 (de
// tocar).
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o grito do Ipiranga
// ---------------------------------------------------------------------------

function IpirangaOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Dom Pedro montado num cavalo, erguendo a espada às margens do riacho Ipiranga, com soldados em volta e a frase Independência ou Morte">
      <rect width="460" height="300" fill="#bae6fd" />
      <rect y="210" width="460" height="90" fill="#86efac" />
      <path d="M0 270 Q120 250 230 270 T460 260" fill="none" stroke="#38bdf8" strokeWidth="10" />
      <g transform="translate(230 210)">
        <ellipse cx="0" cy="-20" rx="56" ry="24" fill="#78350f" />
        <path d="M44 -34 L70 -60 L84 -54 L66 -24 Z" fill="#78350f" />
        <path d="M78 -60 L86 -66" stroke="#1e293b" strokeWidth="3" />
        {[-36, -14, 20, 40].map((dx, i) => (
          <path key={dx} d={`M${dx} -2 L${dx + (i % 2 ? 6 : -4)} 30`} stroke="#78350f" strokeWidth="8" strokeLinecap="round" />
        ))}
        <path d="M-50 -30 Q-74 -30 -80 -6" stroke="#1e293b" strokeWidth="6" fill="none" />
        <rect x="-14" y="-74" width="28" height="36" rx="4" fill="#1e3a8a" />
        <circle cy="-86" r="12" fill="#f1c9a5" />
        <path d="M-14 -94 L14 -94 L10 -104 L-10 -104 Z" fill="#1e293b" />
        <g>
          <animateTransform attributeName="transform" type="rotate" values="0 10 -70;-10 10 -70;0 10 -70" dur="2s" repeatCount="indefinite" />
          <path d="M10 -70 L36 -110" stroke="#f1c9a5" strokeWidth="6" strokeLinecap="round" />
          <path d="M36 -110 L52 -148" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
        </g>
      </g>
      {[70, 120, 340, 390].map((x, i) => (
        <g key={x} transform={`translate(${x} 230)`}>
          <rect x="-8" y="-34" width="16" height="30" fill={i % 2 ? "#15803d" : "#ca8a04"} />
          <circle cy="-42" r="8" fill="#f1c9a5" />
          <path d="M8 -30 L18 -60" stroke="#1e293b" strokeWidth="3">
            <animateTransform attributeName="transform" type="rotate" values="0 8 -30;-8 8 -30;0 8 -30" dur="1.2s" begin={`${-i * 0.3}s`} repeatCount="indefinite" />
          </path>
        </g>
      ))}
      <text x="230" y="40" textAnchor="middle" fontSize="22" fontWeight="900" fill={HB_DARK} fontFamily="Georgia, serif">
        Independência ou Morte!
      </text>
      <text x="230" y="62" textAnchor="middle" fontSize="13" fontWeight="700" fill="#3b2a14" fontFamily="Georgia, serif">
        7 de setembro de 1822
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A corte atravessa o Atlântico
// ---------------------------------------------------------------------------

function CourtArt() {
  return (
    <Art viewBox="0 0 560 170" label="A frota da família real portuguesa atravessando o oceano de Lisboa até o Rio de Janeiro, fugindo das tropas de Napoleão">
      <rect width="560" height="170" rx="14" fill="#bae6fd" />
      <path d="M470 10 Q540 20 550 70 L500 80 Q470 50 470 10 Z" fill="#e9d5ff" stroke="#7c3aed" strokeWidth="2" />
      <text x="512" y="46" textAnchor="middle" fontSize="12" fontWeight="900" fill="#581c87" fontFamily="Georgia, serif">Lisboa</text>
      <path d="M10 90 Q60 70 110 100 L110 170 L10 170 Z" fill="#86efac" stroke="#15803d" strokeWidth="2" />
      <text x="60" y="130" textAnchor="middle" fontSize="12" fontWeight="900" fill="#14532d" fontFamily="Georgia, serif">Rio</text>
      <path d="M480 60 Q300 40 110 120" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeDasharray="6 5" />
      <g>
        <animateMotion path="M480 60 Q300 40 110 120" dur="7s" repeatCount="indefinite" />
        <Caravel x={0} y={0} s={0.4} />
        <path d="M-8 -50 L-4 -58 L0 -52 L4 -58 L8 -50 Z" fill="#facc15" />
      </g>
      <text x="300" y="150" textAnchor="middle" fontSize="13" fontWeight="900" fill={HB_DARK} fontFamily="Georgia, serif">
        1807–1808: cerca de 15 mil pessoas atravessam o oceano
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A linha do tempo da Independência
// ---------------------------------------------------------------------------

const INDEPENDENCE = [
  { year: "1808", name: "A corte chega", text: "A família real chega ao Brasil e Dom João abre os portos às nações amigas, acabando com o monopólio de Portugal." },
  { year: "1815", name: "Reino Unido", text: "O Brasil vira Reino Unido a Portugal e Algarves: deixa de ser colônia." },
  { year: "1821", name: "Dom João volta", text: "Pressionado pela Revolução do Porto, Dom João VI volta a Portugal e deixa o filho Pedro como príncipe regente." },
  { year: "1822", name: "O Dia do Fico", text: "Em 9 de janeiro, Pedro desobedece às Cortes de Lisboa e fica no Brasil: “Digam ao povo que fico!”." },
  { year: "1822", name: "Independência", text: "Em 7 de setembro, às margens do Ipiranga, em São Paulo, Pedro proclama a Independência. Em dezembro, é coroado Dom Pedro I." },
  { year: "1823", name: "2 de Julho", text: "Na Bahia, as tropas portuguesas só são expulsas em 2 de julho de 1823, com heroínas como Maria Quitéria e Maria Felipa." },
];

// ---------------------------------------------------------------------------
// Os quatro poderes de 1824 (de tocar)
// ---------------------------------------------------------------------------

const POWERS = [
  { name: "Executivo", icon: "👑", color: "#2563eb", text: "O imperador e os ministros governavam e cumpriam as leis." },
  { name: "Legislativo", icon: "📜", color: "#16a34a", text: "A Assembleia (deputados e senadores) fazia as leis. Os senadores eram vitalícios." },
  { name: "Judiciário", icon: "⚖️", color: "#ca8a04", text: "Os juízes e tribunais julgavam." },
  { name: "Moderador", icon: "🔱", color: "#b91c1c", text: "Só do imperador: podia fechar a Câmara, trocar ministros e vigiar os outros três poderes. Na prática, dava a ele a última palavra." },
];

export function FourPowers() {
  const [sel, setSel] = useState(3);
  const p = POWERS[sel];
  return (
    <Panel title="Os poderes na Constituição de 1824">
      <div className="grid grid-cols-4 gap-[0.3em]">
        {POWERS.map((x, i) => (
          <button
            key={x.name}
            type="button"
            onClick={() => setSel(i)}
            className={`flex flex-col items-center rounded-lg border py-[0.3em] text-[0.74em] font-black transition-transform ${sel === i ? "scale-105" : ""}`}
            style={sel === i ? { background: x.color, borderColor: x.color, color: "#fff" } : { background: "#fff", borderColor: "#d9c79d", color: x.color }}
          >
            <span className="text-[1.6em]">{x.icon}</span>
            {x.name}
          </button>
        ))}
      </div>
      <p key={sel} className="cg-anim-fade mt-[0.4em] rounded-lg px-[0.6em] py-[0.3em] text-[0.88em] leading-snug" style={{ background: `${p.color}14`, borderLeft: `5px solid ${p.color}` }}>
        <strong style={{ color: p.color }}>Poder {p.name}: </strong>
        {p.text}
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 7, content, bare });

export const chapter7: BookPage[] = [
  page(
    <ChapterOpener n={7} title="A Família Real e a Independência" goals={["Por que a corte portuguesa veio para o Brasil", "As mudanças de 1808 a 1821", "O Dia do Fico e o 7 de Setembro", "O Primeiro Reinado e a Constituição de 1824"]}>
      <Fig h={34}>
        <IpirangaOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="👑">A corte vem para o Brasil</H>
      <P>
        Em 1807, as tropas de <T>Napoleão</T> invadiram Portugal, que não tinha obedecido ao Bloqueio Continental contra a Inglaterra. Protegida pelos ingleses, a
        família real fugiu para o Brasil e chegou em 1808, primeiro a Salvador e depois ao <T>Rio de Janeiro</T>.
      </P>
      <Fig n="7.1" caption="A viagem da corte portuguesa." h={18}>
        <CourtArt />
      </Fig>
      <Cards
        items={[
          { icon: "⚓", title: "Abertura dos portos", text: "O Brasil pôde comerciar com outros países." },
          { icon: "🏦", title: "Banco do Brasil", text: "Criado em 1808, junto com a imprensa." },
          { icon: "🌴", title: "Jardim Botânico", text: "E a Biblioteca Real, a Escola de Medicina e o teatro." },
          { icon: "🗺️", title: "Reino Unido", text: "Em 1815, o Brasil deixa de ser colônia." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🗓️">O caminho da Independência</H>
      <P>
        Em Portugal, a Revolução do Porto (1820) exigiu a volta do rei e queria que o Brasil voltasse a ser colônia. Dom João voltou, mas deixou o filho, <T>Pedro</T>, que
        foi aconselhado por <T>José Bonifácio</T> e pela princesa <T>Leopoldina</T>. Toque nos anos:
      </P>
      <TapTimeline items={INDEPENDENCE} start={4} />
      <Box kind="lembre">
        A Independência não foi pacífica em todo lugar: houve guerras na Bahia, no Pará, no Maranhão e no Piauí. Portugal só a reconheceu em 1825, depois que o Brasil pagou
        uma indenização de 2 milhões de libras.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="📜">O Primeiro Reinado</H>
      <P>
        Dom Pedro I fechou a Assembleia que escrevia a Constituição e <T>outorgou</T> (impôs) a <T>Constituição de 1824</T>. Ela criou quatro poderes e o{" "}
        <T>voto censitário</T>: só votava quem tinha uma renda mínima. Conheça os poderes:
      </P>
      <FourPowers />
      <Box kind="atencao">
        A independência manteve a escravidão, a monarquia e o poder dos grandes proprietários: mudou o governo, mas a sociedade continuou muito desigual.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🚪">O fim do Primeiro Reinado</H>
      <P>
        O governo de Dom Pedro I enfrentou muitos problemas: a <T>Confederação do Equador</T> (1824), uma revolta republicana em Pernambuco e no Nordeste; a Guerra da
        Cisplatina, que fez o Brasil perder a província que virou o <T>Uruguai</T> (1828); e a crise econômica.
      </P>
      <Box kind="sabia">
        Em <strong>7 de abril de 1831</strong>, Dom Pedro I abdicou do trono e voltou a Portugal, deixando o filho, <strong>Pedro de Alcântara</strong>, com apenas 5 anos.
        Ele seria o futuro Dom Pedro II.
      </Box>
      <P>
        Como o novo imperador era uma criança, o Brasil passou a ser governado por <T>regentes</T>. Mas essa é a história do próximo capítulo.
      </P>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Fugindo de Napoleão, a família real chegou ao Brasil em 1808.",
          "Dom João abriu os portos e criou o Banco do Brasil; em 1815 o Brasil virou Reino Unido.",
          "Em 9 de janeiro de 1822, Dom Pedro ficou: o Dia do Fico.",
          "Em 7 de setembro de 1822, ele proclamou a Independência.",
          "A Constituição de 1824 criou o Poder Moderador; Dom Pedro I abdicou em 1831.",
        ]}
      />
      <Glossary
        items={[
          ["Abertura dos portos", "A permissão para o Brasil comerciar com outros países."],
          ["Regente", "Quem governa no lugar do rei que é criança ou está longe."],
          ["Outorgar", "Impor uma lei sem que ela seja votada."],
          ["Poder Moderador", "O quarto poder, só do imperador."],
          ["Abdicar", "Renunciar ao trono."],
        ]}
      />
      <Quiz
        items={[
          ["Por que a família real veio para o Brasil?", "Para fugir das tropas de Napoleão, que invadiram Portugal."],
          ["O que foi o Dia do Fico?", "Quando Dom Pedro decidiu ficar no Brasil, em 9 de janeiro de 1822."],
          ["Onde Dom Pedro proclamou a Independência?", "Às margens do riacho Ipiranga, em São Paulo."],
          ["Qual poder era só do imperador?", "O Poder Moderador."],
        ]}
      />
    </>,
  ),
];
