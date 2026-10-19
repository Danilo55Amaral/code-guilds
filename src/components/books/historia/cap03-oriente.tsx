"use client";

import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { ChoiceGame } from "../portugues/art";

// ============================================================================
// CAPÍTULO 3 — OUTROS POVOS DA ANTIGUIDADE (missão "História Geral: Os Povos
// da Antiguidade Oriental"): a Grande Muralha serpenteando nas montanhas, a
// cabeça de boi que virou a letra A, os mensageiros a cavalo na Estrada Real
// dos persas, as quatro invenções chinesas e o jogo “quem inventou?”.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a Grande Muralha
// ---------------------------------------------------------------------------

function WallOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="A Grande Muralha da China serpenteando por cima das montanhas verdes, com torres de vigia e uma pipa de dragão voando no céu">
      <rect width="460" height="300" fill="#fef3c7" />
      <path d="M0 200 L80 120 L150 180 L240 100 L330 170 L400 110 L460 160 L460 300 L0 300 Z" fill="#65a30d" />
      <path d="M0 240 L100 190 L200 230 L300 180 L460 220 L460 300 L0 300 Z" fill="#4d7c0f" />
      {/* a muralha */}
      <path d="M-10 230 Q60 150 120 170 Q180 190 240 120 Q300 60 360 140 Q410 200 470 150" stroke="#a8a29e" strokeWidth="16" fill="none" strokeLinecap="round" />
      <path d="M-10 230 Q60 150 120 170 Q180 190 240 120 Q300 60 360 140 Q410 200 470 150" stroke="#78716c" strokeWidth="16" fill="none" strokeDasharray="4 8" strokeLinecap="butt" transform="translate(0 -8)" />
      {[
        [120, 170],
        [240, 120],
        [360, 140],
      ].map(([x, y]) => (
        <rect key={x} x={x - 12} y={y - 30} width="24" height="28" fill="#a8a29e" stroke="#57534e" strokeWidth="2" />
      ))}
      {/* a pipa de dragão */}
      <g>
        <animateMotion path="M60 60 Q160 20 260 60 Q360 100 420 40 Q300 80 180 60 Q120 50 60 60" dur="9s" repeatCount="indefinite" />
        <path d="M0 0 L-14 -10 L-20 4 Z" fill="#dc2626" />
        <path d="M-18 0 Q-40 14 -60 0 Q-80 -14 -100 0" stroke="#dc2626" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="-8" cy="-4" r="2" fill="#fde047" />
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A cabeça de boi que virou a letra A
// ---------------------------------------------------------------------------

function AlphabetArt() {
  const stages = [
    { name: "fenício", sub: "álef (boi)", d: "M-22 -24 L0 20 L22 -24 M-26 -10 L26 -10", rot: 90 },
    { name: "grego", sub: "alfa", d: "M-22 24 L0 -24 L22 24 M-12 6 L12 6", rot: 0 },
    { name: "latino", sub: "A", d: "M-22 24 L0 -24 L22 24 M-12 6 L12 6", rot: 0 },
  ];
  return (
    <Art viewBox="0 0 560 210" label="A evolução da letra A: no alfabeto fenício era o desenho de uma cabeça de boi, deitada; os gregos a viraram e criaram o alfa; os romanos fizeram o nosso A">
      <rect width="560" height="210" rx="14" fill="#ecfeff" />
      {/* a cabeça de boi desenhada */}
      <g transform="translate(70 100)">
        <ellipse rx="26" ry="22" fill="#d6a77a" stroke="#78350f" strokeWidth="2" />
        <path d="M-22 -14 Q-40 -30 -30 -44 M22 -14 Q40 -30 30 -44" stroke="#fef3c7" strokeWidth="6" strokeLinecap="round" fill="none" />
        <circle cx="-9" cy="-4" r="3" fill="#1e293b" />
        <circle cx="9" cy="-4" r="3" fill="#1e293b" />
        <ellipse cy="12" rx="12" ry="7" fill="#fca5a5" />
        <text y="58" textAnchor="middle" fontSize="12" fontWeight="900" fill="#164e63" fontFamily="Georgia, serif">
          boi
        </text>
      </g>
      {stages.map((st, i) => (
        <g key={st.name} transform={`translate(${200 + i * 130} 100)`}>
          <g className="cg-anim-pop" style={{ animationDelay: `${i * 0.4}s` }}>
            <circle r="40" fill="#fff" stroke="#0891b2" strokeWidth="3" />
            <path d={st.d} stroke="#164e63" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" transform={`rotate(${st.rot})`} />
          </g>
          <text y="62" textAnchor="middle" fontSize="13" fontWeight="900" fill="#0e7490" fontFamily="Georgia, serif">
            {st.name}
          </text>
          <text y="80" textAnchor="middle" fontSize="11" fill="#155e75" fontFamily="Georgia, serif">
            {st.sub}
          </text>
        </g>
      ))}
      {[130, 260, 390].map((x) => (
        <path key={x} d={`M${x} 100 L${x + 16} 100 M${x + 10} 94 L${x + 16} 100 L${x + 10} 106`} stroke="#0891b2" strokeWidth="3" fill="none" />
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os mensageiros da Estrada Real
// ---------------------------------------------------------------------------

function RoyalRoadArt() {
  return (
    <Art viewBox="0 0 560 200" label="Os mensageiros persas a cavalo levando uma mensagem pela Estrada Real, trocando de cavalo nos postos ao longo do caminho">
      <rect width="560" height="200" rx="14" fill="#fef9c3" />
      <path d="M20 140 Q160 110 280 140 Q400 170 540 130" stroke="#d6b77a" strokeWidth="22" fill="none" strokeLinecap="round" />
      {[110, 280, 450].map((x) => (
        <g key={x} transform={`translate(${x} 104)`}>
          <rect x="-16" y="-30" width="32" height="26" fill="#fde68a" stroke="#a16207" strokeWidth="2" />
          <path d="M-20 -30 L0 -44 L20 -30 Z" fill="#b45309" />
        </g>
      ))}
      {/* o cavaleiro com a mensagem */}
      <g>
        <animateMotion path="M20 134 Q160 104 280 134 Q400 164 540 124" dur="6s" repeatCount="indefinite" />
        <g transform="translate(0 -18)">
          <ellipse rx="20" ry="9" fill="#78350f" />
          <path d="M14 -6 L26 -18 L30 -12 L20 -2" fill="#78350f" />
          <path d="M-12 6 L-16 20 M-4 6 L-4 20 M8 6 L8 20 M14 4 L18 18" stroke="#78350f" strokeWidth="3" />
          <rect x="-6" y="-26" width="12" height="18" rx="4" fill="#7c3aed" />
          <circle cy="-32" r="6" fill="#c68642" />
          <rect x="-16" y="-24" width="10" height="7" fill="#fef3c7" stroke="#a16207" />
        </g>
      </g>
      <text x="280" y="34" textAnchor="middle" fontSize="13" fontWeight="900" fill="#78350f" fontFamily="Georgia, serif">
        a Estrada Real ligava o Império Persa
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O jogo “quem inventou?”
// ---------------------------------------------------------------------------

const WHO_GAME = [
  { prompt: "Quem foram dos primeiros a usar a roda, há mais de 5 mil anos?", options: ["Os sumérios", "Os persas", "Os hebreus"], answer: 0, explain: "A roda aparece na Mesopotâmia, primeiro em carroças e na cerâmica." },
  { prompt: "Qual povo criou um alfabeto que deu origem ao grego e ao nosso?", options: ["Os chineses", "Os fenícios", "Os egípcios"], answer: 1, explain: "O alfabeto fenício tinha poucos sinais e foi adotado pelos gregos." },
  { prompt: "O papel, a pólvora e a bússola foram inventados por qual civilização?", options: ["Os chineses", "Os babilônios", "Os persas"], answer: 0, explain: "Junto com a impressão, são as quatro grandes invenções da China antiga." },
  { prompt: "Qual povo foi um dos primeiros a acreditar num deus único?", options: ["Os fenícios", "Os hebreus", "Os sumérios"], answer: 1, explain: "A religião dos hebreus deu origem ao judaísmo, que influenciou o cristianismo e o islamismo." },
  { prompt: "Os algarismos que usamos hoje (0, 1, 2, 3...) nasceram onde?", options: ["Na Índia", "Em Roma", "No Egito"], answer: 0, explain: "Nasceram na Índia, com o zero, e chegaram à Europa pelos árabes: por isso se chamam indo-arábicos." },
];

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 3, content, bare });

export const chapter3: BookPage[] = [
  page(
    <ChapterOpener
      n={3}
      title="Outros Povos da Antiguidade"
      goals={["Os hebreus e o monoteísmo", "Os fenícios e o alfabeto", "O grande Império Persa", "As invenções da China e da Índia antigas"]}
    >
      <Fig h={34}>
        <WallOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🔠">Hebreus e fenícios</H>
      <P>
        Os <T>hebreus</T> foram um dos primeiros povos a acreditar num deus único: o <T>monoteísmo</T>. Sua religião deu origem ao <T>judaísmo</T>. Os{" "}
        <T>fenícios</T>, grandes comerciantes do mar Mediterrâneo, criaram um <T>alfabeto</T> com poucos sinais, que deu origem ao grego e depois ao latino, o que
        usamos hoje.
      </P>
      <Fig n="3.1" caption="A letra A nasceu do desenho de uma cabeça de boi." h={21}>
        <AlphabetArt />
      </Fig>
    </>,
  ),

  page(
    <>
      <H icon="🐎">O Império Persa</H>
      <P>
        Os <T>persas</T>, liderados por reis como <T>Ciro</T> e <T>Dario</T>, formaram um dos maiores impérios da Antiguidade. Para governar terras tão grandes, eles
        construíram a <T>Estrada Real</T>, por onde mensageiros a cavalo levavam ordens rapidamente, trocando de cavalo em postos pelo caminho.
      </P>
      <Fig n="3.2" caption="Os mensageiros da Estrada Real." h={20}>
        <RoyalRoadArt />
      </Fig>
      <Box kind="sabia">
        Os <strong>Jardins Suspensos da Babilônia</strong> eram uma das Sete Maravilhas do Mundo Antigo. Delas, só a Grande Pirâmide de Gizé continua de pé.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🐉">China e Índia</H>
      <P>
        A <T>Grande Muralha</T> foi construída e reconstruída por séculos para proteger a China das invasões do norte. Os chineses inventaram o <T>papel</T>, a{" "}
        <T>pólvora</T>, a <T>bússola</T> e a <T>impressão</T>: as quatro grandes invenções.
      </P>
      <Cards
        items={[
          { icon: "📜", title: "Papel", text: "Feito de fibras de plantas; mudou o jeito de guardar o conhecimento." },
          { icon: "🧭", title: "Bússola", text: "A agulha que aponta o norte ajudou os navegadores." },
          { icon: "🎆", title: "Pólvora", text: "Usada primeiro em fogos de artifício e depois em armas." },
          { icon: "🔢", title: "Algarismos", text: "Da Índia vieram os nossos números, com o zero." },
        ]}
      />
      <Box kind="lembre">
        Na Índia antiga, o <strong>sistema de castas</strong> dividia a sociedade em grupos fechados: quem nascia numa casta morria nela. Hoje a discriminação por
        casta é proibida por lei na Índia.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="💡">Quem inventou?</H>
      <P>Muita coisa que usamos até hoje nasceu na Antiguidade. Descubra quem inventou cada uma:</P>
      <ChoiceGame items={WHO_GAME} color="#b45309" title="O jogo das invenções" />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Os hebreus foram dos primeiros monoteístas; sua religião deu origem ao judaísmo.",
          "Os fenícios eram comerciantes do Mediterrâneo e criaram um alfabeto que originou o nosso.",
          "Os persas, de Ciro e Dario, formaram um enorme império ligado pela Estrada Real.",
          "A China construiu a Grande Muralha e inventou o papel, a pólvora, a bússola e a impressão.",
          "Da Índia vieram os algarismos com o zero; lá existia o sistema de castas.",
        ]}
      />
      <Glossary
        items={[
          ["Monoteísmo", "A crença num deus único."],
          ["Politeísmo", "A crença em vários deuses."],
          ["Alfabeto", "Conjunto de letras que representam sons."],
          ["Império", "Um território enorme governado por um soberano."],
          ["Castas", "Grupos sociais fechados da Índia antiga."],
        ]}
      />
      <Quiz
        items={[
          ["Qual povo foi um dos primeiros a acreditar num deus único?", "Os hebreus."],
          ["Por que os fenícios ficaram famosos?", "Pelo comércio no Mediterrâneo e pela criação de um alfabeto."],
          ["Para que servia a Estrada Real dos persas?", "Para levar mensagens rapidamente por todo o império."],
          ["Cite uma invenção chinesa.", "O papel, a pólvora, a bússola ou a impressão."],
        ]}
      />
    </>,
  ),
];
