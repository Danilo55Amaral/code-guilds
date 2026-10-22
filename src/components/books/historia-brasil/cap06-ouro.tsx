"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Kid } from "../ods/art";
import { HB_DARK, Panel, Slider } from "./art";

// ============================================================================
// CAPÍTULO 6 — O OURO E AS REVOLTAS COLONIAIS (missão "Escravidão e
// Resistência" e a parte colonial de "Regências e Segundo Reinado"): o
// garimpo com a bateia brilhando, a calculadora do quinto e da derrama (de
// tocar), a igreja barroca de Ouro Preto e a bandeira da Inconfidência.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o garimpo
// ---------------------------------------------------------------------------

function GoldOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Um garimpeiro com a bateia num rio entre montanhas, e pepitas de ouro brilhando na peneira; ao fundo, as torres de uma igreja barroca">
      <rect width="460" height="300" fill="#fef9c3" />
      <path d="M0 170 L80 70 L160 150 L240 60 L330 140 L400 80 L460 130 L460 300 L0 300 Z" fill="#78716c" />
      <path d="M0 200 L460 180 L460 300 L0 300 Z" fill="#65a30d" />
      <g transform="translate(380 150)">
        <rect x="-30" y="-50" width="60" height="50" fill="#fff" stroke="#a16207" strokeWidth="2" />
        {[-24, 24].map((dx) => (
          <g key={dx} transform={`translate(${dx} -50)`}>
            <rect x="-8" y="-40" width="16" height="40" fill="#fff" stroke="#a16207" strokeWidth="2" />
            <circle cy="-46" r="8" fill="#ca8a04" />
          </g>
        ))}
        <rect x="-8" y="-24" width="16" height="24" fill="#78350f" />
      </g>
      <path d="M0 250 Q230 220 460 260 L460 300 L0 300 Z" fill="#0ea5e9" />
      <g transform="translate(200 268)">
        <Kid x={0} y={0} s={1.3} shirt="#a16207" skin="#7c4a1e" hair="#1e293b" />
        <g transform="translate(36 -40)">
          <g>
            <animateTransform attributeName="transform" type="rotate" values="-12;12;-12" dur="1.4s" repeatCount="indefinite" />
            <ellipse rx="34" ry="10" fill="#92400e" stroke="#78350f" strokeWidth="2" />
            {[-12, 0, 12].map((dx, i) => (
              <circle key={dx} cx={dx} cy="-2" r="3.5" fill="#facc15">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="1s" begin={`${-i * 0.3}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </g>
        </g>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O quinto e a derrama (de tocar)
// ---------------------------------------------------------------------------

export function FifthCalculator() {
  const [gold, setGold] = useState(500);
  const fifth = gold / 5;
  const goal = 100;
  const derrama = fifth < goal;
  return (
    <Panel title="O ouro de uma região num ano">
      <Slider label="Ouro tirado" value={gold} min={100} max={1000} step={50} onChange={setGold} format={(v) => `${v} arr.`} />
      <svg viewBox="0 0 400 118" className="mt-[0.3em] w-full" role="img" aria-label={`De ${gold} arrobas, ${fifth} iam para a Coroa`}>
        <rect width="400" height="118" rx="10" fill="#fffaf0" />
        <rect x="20" y="16" width="360" height="26" rx="6" fill="#fde68a" stroke="#a16207" />
        <rect x="20" y="16" width={(360 * gold) / 1000} height="26" rx="6" fill="#facc15" style={{ transition: "width 0.3s" }} />
        <rect x="20" y="16" width={(360 * fifth) / 1000} height="26" rx="6" fill="#b91c1c" style={{ transition: "width 0.3s" }} />
        <line x1={20 + (360 * goal) / 1000} y1="10" x2={20 + (360 * goal) / 1000} y2="48" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 3" />
        <rect x="20" y="54" width="12" height="12" rx="2" fill="#b91c1c" />
        <text x="38" y="64" fontSize="12" fontWeight="900" fill="#b91c1c">
          o quinto, para a Coroa: {fifth} arrobas
        </text>
        <text x="380" y="64" textAnchor="end" fontSize="11" fontWeight="700" fill="#1e293b">
          ┆ meta: 100 arrobas
        </text>
        <text x="200" y="98" textAnchor="middle" fontSize="14" fontWeight="900" fill={derrama ? "#b91c1c" : "#15803d"} fontFamily="Georgia, serif">
          {derrama ? `Faltaram ${goal - fifth} arrobas: vem aí a DERRAMA!` : "A meta foi atingida: sem derrama este ano."}
        </text>
      </svg>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// A bandeira da Inconfidência
// ---------------------------------------------------------------------------

function InconfidenciaArt() {
  return (
    <Art viewBox="0 0 560 180" label="A bandeira branca da Inconfidência Mineira, com um triângulo vermelho e as palavras em latim Libertas quae sera tamen, tremulando ao lado de Tiradentes">
      <rect width="560" height="180" rx="14" fill="#fef3c7" />
      <rect x="160" y="20" width="4" height="150" fill="#78350f" />
      <g>
        <animateTransform attributeName="transform" type="skewY" values="0;2;0;-2;0" dur="3s" repeatCount="indefinite" />
        <rect x="164" y="22" width="220" height="140" fill="#fff" stroke="#cbd5e1" />
        <path d="M274 42 L314 112 L234 112 Z" fill="none" stroke="#dc2626" strokeWidth="9" />
        <text x="274" y="138" textAnchor="middle" fontSize="13" fontWeight="900" fill="#dc2626" fontFamily="Georgia, serif">
          LIBERTAS QUÆ SERA TAMEN
        </text>
      </g>
      <g transform="translate(470 170)">
        <path d="M-24 0 L-20 -60 L20 -60 L24 0 Z" fill="#f8fafc" stroke="#94a3b8" />
        <ellipse cy="-74" rx="18" ry="20" fill="#78350f" />
        <circle cy="-76" r="12" fill="#f1c9a5" />
        <path d="M-12 -72 Q0 -50 12 -72 Q0 -64 -12 -72 Z" fill="#78350f" />
        <circle cx="-4.5" cy="-79" r="1.6" fill="#1e293b" />
        <circle cx="4.5" cy="-79" r="1.6" fill="#1e293b" />
      </g>
      <text x="80" y="90" textAnchor="middle" fontSize="13" fontWeight="900" fill={HB_DARK} fontFamily="Georgia, serif">
        “Liberdade,
      </text>
      <text x="80" y="108" textAnchor="middle" fontSize="13" fontWeight="900" fill={HB_DARK} fontFamily="Georgia, serif">
        ainda que tardia”
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A igreja barroca
// ---------------------------------------------------------------------------

function BaroqueArt() {
  return (
    <Art viewBox="0 0 560 170" label="A fachada de uma igreja barroca de Ouro Preto, com torres redondas, curvas e enfeites dourados, e os sinos balançando">
      <rect width="560" height="170" rx="14" fill="#e0f2fe" />
      <rect y="150" width="560" height="20" fill="#a8a29e" />
      <g transform="translate(280 150)">
        <path d="M-90 0 L-90 -90 Q-60 -110 0 -120 Q60 -110 90 -90 L90 0 Z" fill="#fff" stroke="#a16207" strokeWidth="2" />
        {[-110, 110].map((dx) => (
          <g key={dx} transform={`translate(${dx} 0)`}>
            <rect x="-20" y="-110" width="40" height="110" fill="#fff" stroke="#a16207" strokeWidth="2" />
            <path d="M-20 -110 Q0 -140 20 -110 Z" fill="#ca8a04" />
            <g transform="translate(0 -92)">
              <g>
                <animateTransform attributeName="transform" type="rotate" values="-20;20;-20" dur="1.8s" repeatCount="indefinite" />
                <path d="M-7 0 Q-7 -12 0 -12 Q7 -12 7 0 Z" fill="#ca8a04" stroke="#78350f" />
              </g>
            </g>
          </g>
        ))}
        <path d="M-20 0 L-20 -44 Q0 -60 20 -44 L20 0 Z" fill="#1e3a8a" />
        <circle cy="-80" r="14" fill="#facc15" stroke="#a16207" strokeWidth="2" />
        <path d="M-60 -60 q10 -14 20 0 M40 -60 q10 -14 20 0" stroke="#ca8a04" strokeWidth="4" fill="none" />
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 6, content, bare });

export const chapter6: BookPage[] = [
  page(
    <ChapterOpener n={6} title="O Ouro e as Revoltas Coloniais" goals={["A corrida do ouro em Minas Gerais", "O quinto e a derrama", "O barroco mineiro e Aleijadinho", "A Inconfidência Mineira e a Conjuração Baiana"]}>
      <Fig h={34}>
        <GoldOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="💰">A corrida do ouro</H>
      <P>
        No fim do século XVII, os <T>bandeirantes</T> paulistas encontraram ouro onde hoje é Minas Gerais. Milhares de pessoas correram para lá, e o ouro virou a
        riqueza da colônia no século XVIII. Para controlar tudo, a Coroa cobrava um imposto pesado: o <T>quinto</T>, ou seja, 20% de todo o ouro.
      </P>
      <FifthCalculator />
      <Box kind="atencao">
        Se o quinto não chegasse a 100 arrobas por ano, a Coroa fazia a <strong>derrama</strong>: soldados cobravam o que faltava à força, de casa em casa.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="⛪">A vida nas Minas e o barroco</H>
      <P>
        Surgiram vilas ricas, como <T>Vila Rica</T> (hoje Ouro Preto), Mariana e Sabará, e diamantes foram achados em Diamantina. O centro da colônia mudou para o
        Sudeste, e em 1763 a capital passou de Salvador para o <T>Rio de Janeiro</T>, porto por onde o ouro saía.
      </P>
      <Fig n="6.1" caption="Uma igreja barroca de Ouro Preto." h={18}>
        <BaroqueArt />
      </Fig>
      <Box kind="sabia">
        O grande artista do <strong>barroco mineiro</strong> foi <strong>Aleijadinho</strong>, que esculpiu os 12 profetas de pedra-sabão de Congonhas, mesmo com uma
        doença que deformava as mãos.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🔺">A Inconfidência Mineira</H>
      <P>
        Em 1789, revoltados com a derrama e inspirados pela independência dos Estados Unidos e pelo Iluminismo, poetas, padres, militares e fazendeiros de Vila Rica
        planejaram separar Minas de Portugal. O mais conhecido era o alferes <T>Joaquim José da Silva Xavier</T>, o <T>Tiradentes</T>.
      </P>
      <Fig n="6.2" caption="A bandeira dos inconfidentes: “Liberdade, ainda que tardia”." h={18}>
        <InconfidenciaArt />
      </Fig>
      <Box kind="lembre">
        Traídos por Joaquim Silvério dos Reis, os inconfidentes foram presos antes da revolta. Tiradentes assumiu a culpa e foi enforcado em <strong>21 de abril de 1792</strong>,
        hoje feriado nacional.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🧵">A Conjuração Baiana</H>
      <P>
        Em 1798, em Salvador, alfaiates, soldados, artesãos e pessoas escravizadas e libertas espalharam cartazes pedindo uma república, a <T>igualdade</T> entre as
        pessoas e o <T>fim da escravidão</T>. Por isso ela é chamada também de <T>Revolta dos Alfaiates</T>.
      </P>
      <Table
        head={["", "Inconfidência Mineira", "Conjuração Baiana"]}
        rows={[
          ["Ano", "1789", "1798"],
          ["Quem", "A elite: poetas, padres e fazendeiros", "O povo: alfaiates, soldados, escravizados"],
          ["Escravidão", "Não falava em acabar", "Queria acabar com ela"],
          ["Fim", "Tiradentes enforcado", "Quatro líderes negros e pardos enforcados"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Os bandeirantes acharam ouro em Minas Gerais no fim do século XVII.",
          "A Coroa cobrava o quinto (20% do ouro) e fazia a derrama quando faltava.",
          "Em 1763, a capital passou de Salvador para o Rio de Janeiro.",
          "Aleijadinho foi o grande artista do barroco mineiro.",
          "A Inconfidência (1789) e a Conjuração Baiana (1798) lutaram contra Portugal.",
        ]}
      />
      <Glossary
        items={[
          ["Bandeirante", "Paulista que entrava pelo sertão atrás de ouro e de indígenas para escravizar."],
          ["Quinto", "Imposto de 20% sobre o ouro."],
          ["Derrama", "A cobrança à força dos impostos atrasados."],
          ["Inconfidência", "Falta de fidelidade, traição ao rei."],
          ["Barroco", "Estilo de arte cheio de curvas, enfeites e emoção."],
        ]}
      />
      <Quiz
        items={[
          ["O que era o quinto?", "Um imposto de 20% sobre todo o ouro."],
          ["Por que a capital foi para o Rio de Janeiro em 1763?", "Porque o ouro saía pelo porto do Rio."],
          ["Quem foi o inconfidente enforcado em 21 de abril de 1792?", "Tiradentes."],
          ["O que a Conjuração Baiana defendia que a Inconfidência não defendia?", "O fim da escravidão."],
        ]}
      />
    </>,
  ),
];
