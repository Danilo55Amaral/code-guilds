"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { HB, HB_DARK, Panel, TapTimeline } from "./art";

// ============================================================================
// CAPÍTULO 8 — REGÊNCIAS E SEGUNDO REINADO (missões "Regências e Segundo
// Reinado" e "Escravidão e Resistência", a parte da Abolição): o trem do
// café descendo para o porto, o mapa das revoltas regenciais (de tocar), a
// fazenda de café com os imigrantes e as leis até a Abolição (de tocar).
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o trem do café
// ---------------------------------------------------------------------------

function CoffeeTrainOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Morros cobertos de pés de café e um trem a vapor carregado de sacas de café descendo a serra rumo ao porto, com navios esperando">
      <rect width="460" height="300" fill="#fef3c7" />
      <path d="M0 160 Q100 80 220 130 Q320 70 460 120 L460 300 L0 300 Z" fill="#4d7c0f" />
      {Array.from({ length: 30 }, (_, i) => (
        <circle key={i} cx={(i * 47) % 460} cy={140 + ((i * 29) % 60)} r="7" fill="#166534">
          <animate attributeName="r" values="7;8;7" dur="3s" begin={`${-i * 0.2}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <circle key={`f${i}`} cx={(i * 73) % 460 + 4} cy={146 + ((i * 41) % 50)} r="2.5" fill="#dc2626" />
      ))}
      <path d="M0 240 L460 220" stroke="#44403c" strokeWidth="5" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="-200 9;460 -20" dur="9s" repeatCount="indefinite" />
        <g transform="translate(0 228)">
          <rect x="60" y="-34" width="60" height="28" rx="4" fill="#1e293b" />
          <rect x="96" y="-54" width="12" height="22" fill="#1e293b" />
          {[0, 1].map((k) => (
            <circle key={k} cx="102" r="9" fill="#a8a29e" opacity="0.7">
              <animate attributeName="cy" values="-60;-100" dur="1.4s" begin={`${-k * 0.7}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0" dur="1.4s" begin={`${-k * 0.7}s`} repeatCount="indefinite" />
            </circle>
          ))}
          <circle cx="76" cy="0" r="8" fill="#475569" />
          <circle cx="106" cy="0" r="8" fill="#475569" />
          {[0, 1].map((w) => (
            <g key={w} transform={`translate(${-10 - w * 70} 0)`}>
              <rect x="0" y="-26" width="64" height="20" rx="3" fill="#92400e" />
              {[8, 26, 44].map((x) => (
                <ellipse key={x} cx={x + 6} cy="-30" rx="9" ry="7" fill="#d6b77a" stroke="#78350f" />
              ))}
              <circle cx="12" cy="0" r="7" fill="#475569" />
              <circle cx="52" cy="0" r="7" fill="#475569" />
            </g>
          ))}
        </g>
      </g>
      <rect y="262" width="460" height="38" fill="#0ea5e9" />
      <text x="230" y="44" textAnchor="middle" fontSize="20" fontWeight="900" fill={HB_DARK} fontFamily="Georgia, serif">
        O café, o ouro verde
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As revoltas regenciais (de tocar)
// ---------------------------------------------------------------------------

const REVOLTS = [
  { name: "Cabanagem", where: "Pará", years: "1835–1840", x: 195, y: 45, text: "A revolta dos cabanos, gente pobre que morava em cabanas na beira dos rios, chegou a tomar Belém. Foi das mais violentas." },
  { name: "Balaiada", where: "Maranhão", years: "1838–1841", x: 255, y: 62, text: "Vaqueiros, sertanejos e escravizados fugidos, com Raimundo Gomes, o Balaio, e Cosme Bento, líder de um quilombo." },
  { name: "Sabinada", where: "Bahia", years: "1837–1838", x: 280, y: 120, text: "Liderada pelo médico Francisco Sabino, declarou a Bahia uma república até Dom Pedro II crescer." },
  { name: "Farroupilha", where: "Rio Grande do Sul", years: "1835–1845", x: 190, y: 205, text: "A maior e mais longa: os estancieiros gaúchos criaram a República Rio-Grandense, com Bento Gonçalves e Giuseppe e Anita Garibaldi." },
];

export function RevoltsMap() {
  const [sel, setSel] = useState(3);
  const r = REVOLTS[sel];
  return (
    <Panel title="Toque numa revolta">
      <div className="flex items-center gap-[0.6em]">
        <svg viewBox="0 0 340 230" className="w-[48%] shrink-0" role="img" aria-label="O mapa do Brasil com as revoltas regenciais marcadas no Pará, no Maranhão, na Bahia e no Rio Grande do Sul">
          <rect width="340" height="230" rx="10" fill="#bae6fd" />
          <path d="M70 30 Q170 10 250 30 Q320 60 310 110 Q300 160 250 190 Q220 226 190 222 Q170 200 160 170 Q120 140 90 110 Q60 70 70 30 Z" fill="#fde68a" stroke="#a16207" strokeWidth="2" />
          {REVOLTS.map((x, i) => (
            <g key={x.name} className="cursor-pointer" onClick={() => setSel(i)}>
              <circle cx={x.x} cy={x.y} r="14" fill={sel === i ? "#dc2626" : HB} stroke="#fff" strokeWidth="2" />
              <circle cx={x.x} cy={x.y} r="14" fill="none" stroke="#dc2626" strokeWidth="2" opacity={sel === i ? 1 : 0}>
                <animate attributeName="r" values="14;26" dur="1.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values={sel === i ? "1;0" : "0;0"} dur="1.2s" repeatCount="indefinite" />
              </circle>
              <text x={x.x} y={x.y + 4} textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff">
                {i + 1}
              </text>
            </g>
          ))}
        </svg>
        <div key={sel} className="cg-anim-fade flex-1">
          <p className="cg-book-title text-[1.05em] font-black" style={{ color: HB_DARK }}>
            {r.name}
          </p>
          <p className="text-[0.8em] font-bold text-[#8a7146]">
            {r.where} · {r.years}
          </p>
          <p className="mt-[0.2em] text-[0.84em] leading-snug">{r.text}</p>
        </div>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As leis até a Abolição
// ---------------------------------------------------------------------------

const LAWS = [
  { year: "1850", name: "Lei Eusébio de Queirós", text: "Proibiu o tráfico de africanos escravizados para o Brasil, pressionada pela Inglaterra." },
  { year: "1871", name: "Lei do Ventre Livre", text: "Os filhos de mulheres escravizadas nasceriam livres, mas ficavam com o senhor até os 21 anos." },
  { year: "1884", name: "Ceará e Amazonas", text: "As duas províncias aboliram a escravidão antes do resto do país. O jangadeiro Francisco José do Nascimento, o Dragão do Mar, se recusou a levar escravizados." },
  { year: "1885", name: "Lei dos Sexagenários", text: "Libertava quem tinha mais de 60 anos, idade a que poucos chegavam depois de tanto trabalho." },
  { year: "1888", name: "Lei Áurea", text: "Em 13 de maio, a princesa Isabel assinou a lei que aboliu a escravidão no Brasil, o último país da América a fazer isso." },
];

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 8, content, bare });

export const chapter8: BookPage[] = [
  page(
    <ChapterOpener n={8} title="Regências e Segundo Reinado" goals={["O Período Regencial e suas revoltas", "Dom Pedro II e o café", "A Guerra do Paraguai", "A luta pela Abolição e o fim do Império"]}>
      <Fig h={34}>
        <CoffeeTrainOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="⚔️">O Período Regencial</H>
      <P>
        De 1831 a 1840, enquanto Dom Pedro II era criança, o Brasil foi governado por <T>regentes</T>. Foi uma época de grandes revoltas nas províncias, contra a pobreza e
        o poder do governo do Rio de Janeiro. Conheça as principais:
      </P>
      <RevoltsMap />
      <Box kind="lembre">
        Para acabar com a instabilidade, os políticos anteciparam a maioridade do imperador: no <strong>Golpe da Maioridade</strong> (1840), Dom Pedro II assumiu com 14 anos.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="☕">Dom Pedro II e o café</H>
      <P>
        O <T>Segundo Reinado</T> durou de 1840 a 1889. O <T>café</T> virou o principal produto do Brasil: primeiro no Vale do Paraíba (RJ e SP) e depois no Oeste
        Paulista. Com o dinheiro do café vieram as <T>ferrovias</T>, o telégrafo e as cidades começaram a crescer.
      </P>
      <Table
        head={["Mudança", "No Segundo Reinado"]}
        rows={[
          ["Trabalho", "Com o fim do tráfico, os fazendeiros trouxeram imigrantes, principalmente italianos"],
          ["Transporte", "Trens levavam o café até o porto de Santos"],
          ["Indústria", "O Barão de Mauá abriu fábricas, estaleiros e a primeira ferrovia (1854)"],
        ]}
      />
      <Box kind="sabia">
        Dom Pedro II adorava ciência: foi um dos primeiros brasileiros a fotografar e testou o telefone de Graham Bell em 1876, nos Estados Unidos.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🎖️">A Guerra do Paraguai</H>
      <P>
        De 1864 a 1870, o Brasil, a Argentina e o Uruguai, na <T>Tríplice Aliança</T>, lutaram contra o Paraguai de <T>Solano López</T>, depois que ele invadiu o Mato
        Grosso e a Argentina. Foi a maior guerra da América do Sul.
      </P>
      <Table
        head={["Consequência", "O que aconteceu"]}
        rows={[
          ["Para o Paraguai", "Perdeu grande parte da população e ficou arrasado"],
          ["Para o Brasil", "Vitória, mas com muitas mortes e dívidas com a Inglaterra"],
          ["O Exército", "Ficou forte e passou a criticar a monarquia"],
          ["A escravidão", "Muitos escravizados lutaram em troca da liberdade, e o abolicionismo cresceu"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🕊️">A Abolição e o fim do Império</H>
      <P>
        O <T>movimento abolicionista</T> cresceu com jornais, fugas em massa e líderes como <T>Luiz Gama</T>, <T>André Rebouças</T>, <T>José do Patrocínio</T> e Joaquim
        Nabuco. A escravidão foi acabando passo a passo:
      </P>
      <TapTimeline items={LAWS} start={4} />
      <Box kind="atencao">
        A Lei Áurea libertou cerca de 700 mil pessoas, mas não deu a elas terra, escola nem emprego. Em <strong>15 de novembro de 1889</strong>, o marechal Deodoro da
        Fonseca proclamou a República e a família imperial foi para o exílio.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "De 1831 a 1840, regentes governaram e estouraram revoltas como a Cabanagem e a Farroupilha.",
          "Dom Pedro II assumiu com 14 anos, no Golpe da Maioridade (1840).",
          "O café foi o principal produto do Segundo Reinado e trouxe ferrovias e imigrantes.",
          "A Guerra do Paraguai (1864–1870) fortaleceu o Exército e o abolicionismo.",
          "A Lei Áurea (1888) aboliu a escravidão; a República veio em 1889.",
        ]}
      />
      <Glossary
        items={[
          ["Regência", "O governo dos regentes, no lugar do imperador criança."],
          ["Abolicionista", "Quem lutava pelo fim da escravidão."],
          ["Tríplice Aliança", "Brasil, Argentina e Uruguai juntos contra o Paraguai."],
          ["Imigrante", "Quem vem de outro país para morar e trabalhar."],
          ["Lei Áurea", "A lei de 13 de maio de 1888 que aboliu a escravidão."],
        ]}
      />
      <Quiz
        items={[
          ["Qual foi a revolta regencial mais longa?", "A Farroupilha, no Rio Grande do Sul (1835–1845)."],
          ["Qual era o principal produto do Brasil no Segundo Reinado?", "O café."],
          ["Que lei acabou com o tráfico de africanos em 1850?", "A Lei Eusébio de Queirós."],
          ["Quem assinou a Lei Áurea e quando?", "A princesa Isabel, em 13 de maio de 1888."],
        ]}
      />
    </>,
  ),
];
