"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Kid } from "../ods/art";
import { HB, HB_DARK, Panel, TapTimeline } from "./art";

// ============================================================================
// CAPÍTULO 10 — DITADURA E REDEMOCRATIZAÇÃO (missão "História do Brasil:
// Ditadura e Redemocratização"): a multidão das Diretas Já com faixas
// amarelas, o jornal com as tarjas pretas da censura, a linha do tempo da
// volta da democracia (de tocar) e os direitos da Constituição de 1988 (de
// tocar).
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: as Diretas Já
// ---------------------------------------------------------------------------

function DiretasOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma multidão vestida de amarelo numa praça, pulando e levantando uma faixa enorme escrita Diretas Já, com papel picado caindo">
      <rect width="460" height="300" fill="#bae6fd" />
      <rect y="200" width="460" height="100" fill="#a8a29e" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -6;0 0" dur="1s" repeatCount="indefinite" />
        <rect x="70" y="60" width="320" height="60" rx="6" fill="#facc15" stroke="#a16207" strokeWidth="3" />
        <text x="230" y="102" textAnchor="middle" fontSize="34" fontWeight="900" fill="#14532d" fontFamily="Georgia, serif">
          DIRETAS JÁ!
        </text>
        <path d="M80 120 L80 180 M380 120 L380 180" stroke="#78350f" strokeWidth="5" />
      </g>
      {Array.from({ length: 3 }, (_, row) =>
        Array.from({ length: 10 }, (_, i) => {
          const k = row * 10 + i;
          return (
            <g key={k} transform={`translate(${20 + i * 46 + (row % 2) * 22} ${230 + row * 30})`}>
              <g>
                <animateTransform attributeName="transform" type="translate" values="0 0;0 -10;0 0" dur="0.8s" begin={`${-(k % 5) * 0.16}s`} repeatCount="indefinite" />
                <Kid x={0} y={0} s={0.8} shirt={k % 3 ? "#facc15" : "#16a34a"} skin={["#f1c9a5", "#a16207", "#d6a77a", "#7c4a1e"][k % 4]} />
              </g>
            </g>
          );
        }),
      )}
      {Array.from({ length: 16 }, (_, i) => (
        <rect key={i} x={(i * 31) % 460} width="6" height="4" fill={["#facc15", "#16a34a", "#2563eb", "#fff"][i % 4]}>
          <animate attributeName="y" values="-10;210" dur={`${2 + (i % 4) * 0.5}s`} begin={`${-i * 0.3}s`} repeatCount="indefinite" />
        </rect>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O jornal censurado
// ---------------------------------------------------------------------------

function CensoredArt() {
  return (
    <Art viewBox="0 0 560 170" label="A página de um jornal em que tarjas pretas vão cobrindo as notícias, como fazia a censura durante a ditadura">
      <rect width="560" height="170" rx="14" fill="#e7e5e4" />
      <rect x="150" y="10" width="260" height="150" fill="#fff" stroke="#a8a29e" strokeWidth="2" />
      <text x="280" y="34" textAnchor="middle" fontSize="18" fontWeight="900" fill="#1e293b" fontFamily="Georgia, serif">
        O DIÁRIO
      </text>
      <line x1="160" y1="42" x2="400" y2="42" stroke="#1e293b" strokeWidth="2" />
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i}>
          <line x1={166} y1={56 + i * 12} x2={i % 3 === 2 ? 330 : 394} y2={56 + i * 12} stroke="#94a3b8" strokeWidth="5" />
          {i % 2 === 0 && (
            <rect x="166" y={51 + i * 12} width="0" height="10" fill="#0f172a">
              <animate attributeName="width" values="0;228;228;0" keyTimes="0;0.3;0.9;1" dur="5s" begin={`${-i * 0.4}s`} repeatCount="indefinite" />
            </rect>
          )}
        </g>
      ))}
      <text x="470" y="80" textAnchor="middle" fontSize="13" fontWeight="900" fill="#b91c1c" fontFamily="Georgia, serif">
        CENSURADO
      </text>
      <text x="80" y="80" textAnchor="middle" fontSize="12" fontWeight="700" fill="#3b2a14" fontFamily="Georgia, serif">
        AI-5, 1968
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A volta da democracia
// ---------------------------------------------------------------------------

const DEMOCRACY = [
  { year: "1974", name: "A abertura", text: "O general Geisel anuncia uma abertura política “lenta, gradual e segura”." },
  { year: "1979", name: "A Anistia", text: "A Lei da Anistia permite a volta dos exilados e a soltura de presos políticos, mas também perdoa os agentes que torturaram." },
  { year: "1984", name: "Diretas Já", text: "Milhões de pessoas vão às ruas pedir eleição direta para presidente. A emenda Dante de Oliveira é rejeitada no Congresso." },
  { year: "1985", name: "Tancredo e Sarney", text: "Tancredo Neves é eleito pelo Congresso, mas adoece e morre antes de tomar posse. José Sarney, o vice, assume: termina a ditadura." },
  { year: "1988", name: "A Constituição", text: "Em 5 de outubro, Ulysses Guimarães apresenta a Constituição Cidadã, a mais democrática da história do Brasil." },
  { year: "1989", name: "Eleição direta", text: "Depois de 29 anos, o povo volta a eleger o presidente pelo voto direto." },
];

// ---------------------------------------------------------------------------
// Os direitos da Constituição de 1988 (de tocar)
// ---------------------------------------------------------------------------

const RIGHTS = [
  { icon: "🗳️", name: "Voto", text: "Voto direto e secreto; os jovens de 16 e 17 anos e os analfabetos podem votar." },
  { icon: "🏥", name: "Saúde", text: "Saúde é direito de todos e dever do Estado: daí nasceu o SUS, de graça para todo mundo." },
  { icon: "📚", name: "Educação", text: "Ensino público e gratuito, obrigatório para as crianças e adolescentes." },
  { icon: "✊", name: "Igualdade", text: "Homens e mulheres são iguais em direitos, e o racismo virou crime inafiançável." },
  { icon: "🏹", name: "Indígenas", text: "Os povos indígenas têm direito às suas terras, línguas e culturas." },
  { icon: "🗣️", name: "Liberdade", text: "Liberdade de expressão e de imprensa, sem censura." },
];

export function RightsCards() {
  const [sel, setSel] = useState(0);
  return (
    <Panel title="Alguns direitos da Constituição de 1988">
      <div className="grid grid-cols-6 gap-[0.25em]">
        {RIGHTS.map((r, i) => (
          <button
            key={r.name}
            type="button"
            onClick={() => setSel(i)}
            className="flex flex-col items-center rounded-lg border py-[0.25em] text-[0.68em] font-bold transition-colors"
            style={sel === i ? { background: HB, borderColor: HB, color: "#fff" } : { background: "#fff", borderColor: "#d9c79d", color: "#3b2a14" }}
          >
            <span className="text-[1.7em]">{r.icon}</span>
            {r.name}
          </button>
        ))}
      </div>
      <p key={sel} className="cg-anim-fade mt-[0.4em] text-[0.88em] leading-snug">
        <strong style={{ color: HB_DARK }}>{RIGHTS[sel].name}: </strong>
        {RIGHTS[sel].text}
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 10, content, bare });

export const chapter10: BookPage[] = [
  page(
    <ChapterOpener n={10} title="Ditadura e Redemocratização" goals={["O golpe de 1964 e os governos militares", "O AI-5, a censura e o milagre econômico", "A Anistia e as Diretas Já", "A Constituição de 1988 e a Nova República"]}>
      <Fig h={34}>
        <DiretasOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🎖️">O golpe de 1964</H>
      <P>
        Em plena <T>Guerra Fria</T>, o presidente <T>João Goulart</T> (Jango) defendia as <T>reformas de base</T>, como a reforma agrária. Os militares, com o apoio de
        empresários, de parte da população e dos Estados Unidos, deram um <T>golpe</T> em 1964 e governaram o país por 21 anos.
      </P>
      <Table
        head={["Presidente militar", "Período"]}
        rows={[
          ["Castello Branco", "1964–1967"],
          ["Costa e Silva", "1967–1969"],
          ["Médici", "1969–1974"],
          ["Geisel", "1974–1979"],
          ["Figueiredo", "1979–1985"],
        ]}
      />
      <Box kind="lembre">
        Na ditadura, o presidente não era escolhido pelo povo: era eleito de forma indireta, e só existiam dois partidos permitidos, a Arena e o MDB.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="⬛">O AI-5 e os anos de chumbo</H>
      <P>
        Em 1968, o <T>Ato Institucional nº 5</T> fechou o Congresso, acabou com garantias dos cidadãos e liberou a <T>censura</T> de jornais, livros, músicas e filmes.
        Opositores foram presos, torturados, mortos ou exilados.
      </P>
      <Fig n="10.1" caption="A censura cobria as notícias que o governo não queria publicar." h={18}>
        <CensoredArt />
      </Fig>
      <Box kind="sabia">
        No “<strong>milagre econômico</strong>” (1968–1973), o país cresceu muito, mas a desigualdade aumentou e a dívida externa explodiu. Artistas como Chico Buarque e
        Gilberto Gil criavam músicas com mensagens escondidas para driblar a censura.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🗓️">A volta da democracia</H>
      <P>Com a crise econômica e a pressão da sociedade, a ditadura foi perdendo força. Toque nos anos:</P>
      <TapTimeline items={DEMOCRACY} start={2} />
      <Box kind="mago" title="O poder das ruas">
        As Diretas Já perderam a votação, mas mostraram que a sociedade não aceitava mais a ditadura. Um ano depois, ela acabou.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="📜">A Constituição Cidadã</H>
      <P>
        A <T>Constituição de 1988</T> é a lei mais importante do Brasil e garantiu muitos direitos. Com ela começou a <T>Nova República</T>, o período democrático em que
        vivemos.
      </P>
      <RightsCards />
      <List
        items={[
          <>
            <strong>1990:</strong> o Estatuto da Criança e do Adolescente (ECA) protege os direitos de quem tem menos de 18 anos.
          </>,
          <>
            <strong>1992:</strong> o presidente Fernando Collor sofre impeachment depois de protestos dos “caras-pintadas”.
          </>,
          <>
            <strong>1994:</strong> o Plano Real cria a moeda atual e controla a inflação.
          </>,
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Em 1964, um golpe militar derrubou João Goulart; a ditadura durou 21 anos.",
          "O AI-5 (1968) fechou o Congresso e liberou a censura e a repressão.",
          "A Anistia veio em 1979 e as Diretas Já levaram milhões às ruas em 1984.",
          "A ditadura terminou em 1985; a Constituição Cidadã é de 1988.",
          "Em 1989 o povo voltou a eleger o presidente pelo voto direto.",
        ]}
      />
      <Glossary
        items={[
          ["Golpe", "Tomada do poder fora das regras da lei."],
          ["Ditadura", "Governo sem eleições livres, que limita as liberdades."],
          ["Censura", "A proibição do que pode ser publicado ou mostrado."],
          ["Anistia", "Perdão de crimes políticos."],
          ["Impeachment", "A retirada do presidente do cargo pelo Congresso."],
        ]}
      />
      <Quiz
        items={[
          ["Quem era o presidente derrubado pelo golpe de 1964?", "João Goulart (Jango)."],
          ["O que foi o AI-5?", "O ato de 1968 que fechou o Congresso e liberou a censura e a repressão."],
          ["O que pediam as Diretas Já?", "Eleição direta para presidente."],
          ["Por que a Constituição de 1988 é chamada de Cidadã?", "Porque garantiu muitos direitos aos cidadãos."],
        ]}
      />
    </>,
  ),
];
