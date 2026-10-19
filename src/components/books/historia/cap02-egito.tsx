"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, useUid } from "../BookParts";
import type { BookPage } from "../types";
import { DesertSun, Pyramid, Robed } from "./art";

// ============================================================================
// CAPÍTULO 2 — MESOPOTÂMIA E EGITO (missões "Pré-História e Egito Antigo" e
// "Os Povos da Antiguidade Oriental", a parte da Mesopotâmia): o Nilo com as
// pirâmides e o barco, o zigurate entre os dois rios, as três estações do
// Nilo (de tocar), o sarcófago com a múmia e a Pedra de Roseta.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o Nilo e as pirâmides
// ---------------------------------------------------------------------------

function NileOpenerArt() {
  const u = useUid("nilo");
  return (
    <Art viewBox="0 0 460 300" label="As pirâmides de Gizé no deserto, o Sol forte, palmeiras e um barco à vela navegando no rio Nilo">
      <rect width="460" height="300" fill="#fde68a" />
      <DesertSun x={380} y={60} r={26} />
      <rect y="170" width="460" height="130" fill="#fcd34d" />
      <Pyramid x={130} y={190} w={170} />
      <Pyramid x={260} y={190} w={130} />
      <Pyramid x={340} y={190} w={70} />
      <path d="M0 240 Q120 220 230 240 Q340 260 460 236 L460 280 Q340 300 230 280 Q120 262 0 282 Z" fill="#0ea5e9" />
      {[30, 420].map((x) => (
        <g key={x} transform={`translate(${x} 230)`}>
          <path d="M0 0 Q-4 -40 4 -70" stroke="#92400e" strokeWidth="6" fill="none" />
          {[-60, -20, 20, 60].map((a) => (
            <path key={a} d="M4 -70 Q24 -78 40 -64" stroke="#16a34a" strokeWidth="5" fill="none" transform={`rotate(${a} 4 -70)`} />
          ))}
        </g>
      ))}
      {/* o barco navegando */}
      <defs>
        <clipPath id={u}>
          <rect width="460" height="300" rx="14" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${u})`}>
        <animateTransform attributeName="transform" type="translate" values="-80 0;520 0" dur="14s" repeatCount="indefinite" />
        <g transform="translate(0 256)">
          <path d="M-30 0 Q0 14 30 0 Z" fill="#92400e" />
          <path d="M0 0 L0 -40" stroke="#78350f" strokeWidth="3" />
          <path d="M2 -38 L24 -6 L2 -6 Z" fill="#fef3c7" stroke="#d6b77a" />
        </g>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O zigurate entre os dois rios
// ---------------------------------------------------------------------------

function ZigguratArt() {
  return (
    <Art viewBox="0 0 560 210" label="Um zigurate de tijolos de barro em degraus entre os rios Tigre e Eufrates, com uma carroça de rodas passando na frente">
      <rect width="560" height="210" rx="14" fill="#fef3c7" />
      <path d="M0 40 Q80 60 60 110 Q40 160 110 210 L80 210 Q10 160 30 110 Q50 60 -20 40 Z" fill="#38bdf8" />
      <path d="M560 40 Q480 60 500 110 Q520 160 450 210 L480 210 Q550 160 530 110 Q510 60 580 40 Z" fill="#38bdf8" />
      <g fill="#d6a77a" stroke="#92400e" strokeWidth="2">
        <rect x="170" y="150" width="220" height="40" />
        <rect x="200" y="114" width="160" height="36" />
        <rect x="232" y="82" width="96" height="32" />
        <rect x="256" y="56" width="48" height="26" />
      </g>
      <path d="M280 190 L280 56" stroke="#a16207" strokeWidth="10" opacity="0.5" />
      {/* a carroça com as rodas girando */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="-60 0;180 0;-60 0" dur="10s" repeatCount="indefinite" />
        <g transform="translate(150 192)">
          <rect x="-26" y="-22" width="52" height="16" fill="#92400e" />
          {[-14, 14].map((cx) => (
            <g key={cx} transform={`translate(${cx} -2)`}>
              <circle r="9" fill="#78350f" />
              <g>
                <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1s" repeatCount="indefinite" />
                <path d="M-9 0 L9 0 M0 -9 L0 9" stroke="#fde68a" strokeWidth="2" />
              </g>
            </g>
          ))}
        </g>
      </g>
      <g fontFamily="Georgia, serif" fontSize="13" fontWeight="900" fill="#0c4a6e">
        <text x="70" y="32">Tigre</text>
        <text x="450" y="32">Eufrates</text>
      </g>
      <text x="280" y="44" textAnchor="middle" fontSize="13" fontWeight="900" fill="#78350f" fontFamily="Georgia, serif">
        zigurate
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As três estações do Nilo (de tocar)
// ---------------------------------------------------------------------------

const SEASONS = [
  { name: "Cheia", egyptian: "Akhet", months: "julho a outubro", water: 0.85, plants: 0, text: "O rio transbordava e cobria as margens. Quando a água baixava, deixava um lodo escuro e fértil." },
  { name: "Plantio", egyptian: "Peret", months: "novembro a fevereiro", water: 0.4, plants: 0.6, text: "Na terra molhada e fértil, os camponeses plantavam trigo, cevada, linho e papiro." },
  { name: "Colheita", egyptian: "Shemu", months: "março a junho", water: 0.25, plants: 1, text: "Hora de colher e guardar os grãos. Parte da colheita ia como imposto para o faraó." },
];

export function NileSeasons() {
  const [sel, setSel] = useState(0);
  const s = SEASONS[sel];
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.5em]">
      <svg viewBox="0 0 520 170" className="block w-full rounded-lg" aria-label={`O Nilo na estação ${s.name}`}>
        <rect width="520" height="170" fill="#fde68a" />
        <DesertSun x={460} y={34} r={18} />
        {/* as margens */}
        <rect y="90" width="520" height="80" fill={sel === 0 ? "#a16207" : "#78350f"} />
        {/* o rio, que sobe e desce */}
        <rect x="0" width="520" fill="#0ea5e9" style={{ y: 170 - 80 * s.water, height: 80 * s.water, transition: "all 0.8s" } as React.CSSProperties} />
        {/* as plantas */}
        {Array.from({ length: 12 }, (_, i) => (
          <g key={i} transform={`translate(${30 + i * 42} 92)`}>
            <g style={{ transform: `scaleY(${s.plants})`, transformOrigin: "50% 100%", transformBox: "fill-box", transition: "transform 0.8s" } as React.CSSProperties}>
              <path d="M0 0 L0 -26" stroke="#15803d" strokeWidth="3" />
              <ellipse cx="0" cy="-30" rx="4" ry="8" fill={sel === 2 ? "#ca8a04" : "#22c55e"} />
            </g>
          </g>
        ))}
        <Robed x={70} y={92} s={0.6} robe="#fef3c7" sash="#0ea5e9" skin="#a16207" />
      </svg>
      <div className="mt-[0.35em] flex justify-center gap-[0.3em] text-[0.85em]">
        {SEASONS.map((x, i) => (
          <button
            key={x.name}
            type="button"
            onClick={() => setSel(i)}
            className={`rounded-full border px-[0.7em] py-[0.1em] font-bold ${sel === i ? "border-[#0369a1] bg-[#0369a1] text-white" : "border-[#d9c79d] bg-white"}`}
          >
            {x.name}
          </button>
        ))}
      </div>
      <p key={sel} className="cg-anim-fade mt-[0.35em] rounded-lg bg-[#e0f2fe] px-[0.7em] py-[0.3em] text-[0.86em] leading-[1.4] text-[#0c4a6e]">
        <strong>
          {s.name} ({s.egyptian}, de {s.months}):
        </strong>{" "}
        {s.text}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// O sarcófago e a múmia
// ---------------------------------------------------------------------------

function MummyArt() {
  return (
    <Art viewBox="0 0 560 210" label="O sarcófago dourado de um faraó se abrindo e mostrando a múmia enrolada em faixas de linho, com vasos e tesouros em volta">
      <rect width="560" height="210" rx="14" fill="#1c1917" />
      <rect x="20" y="150" width="520" height="50" fill="#44403c" />
      {/* a múmia */}
      <g transform="translate(280 110)">
        <path d="M-30 -80 Q0 -96 30 -80 L36 70 Q0 84 -36 70 Z" fill="#e7e5e4" />
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M-32 ${-64 + i * 15} L32 ${-58 + i * 15}`} stroke="#a8a29e" strokeWidth="2" />
        ))}
        {/* a tampa do sarcófago abrindo */}
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0;0 0;110 0;110 0;0 0" keyTimes="0;0.2;0.45;0.8;1" dur="7s" repeatCount="indefinite" />
          <path d="M-36 -86 Q0 -104 36 -86 L42 74 Q0 90 -42 74 Z" fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
          <circle cy="-62" r="16" fill="#fde68a" />
          <path d="M-16 -62 Q-18 -84 0 -84 Q18 -84 16 -62" fill="#1d4ed8" />
          {[-30, -10, 10, 30].map((y) => (
            <path key={y} d={`M-38 ${y} L38 ${y}`} stroke="#1d4ed8" strokeWidth="5" />
          ))}
        </g>
      </g>
      {/* os tesouros */}
      {[90, 140, 440, 490].map((x, i) => (
        <g key={x} transform={`translate(${x} 150)`}>
          <path d={i % 2 ? "M-12 0 Q-16 -24 0 -30 Q16 -24 12 0 Z" : "M-14 0 L-10 -26 L10 -26 L14 0 Z"} fill={i % 2 ? "#b45309" : "#ca8a04"} />
          <circle cy="-36" r="4" fill="#fde047" className="cg-anim-twinkle" />
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A Pedra de Roseta
// ---------------------------------------------------------------------------

function RosettaArt() {
  const bands = [
    { name: "hieróglifos", color: "#1d4ed8", y: 40 },
    { name: "demótico", color: "#15803d", y: 92 },
    { name: "grego antigo", color: "#b91c1c", y: 144 },
  ];
  return (
    <Art viewBox="0 0 560 210" label="A Pedra de Roseta, com o mesmo texto escrito três vezes: em hieróglifos, em demótico e em grego antigo, uma faixa acendendo de cada vez">
      <rect width="560" height="210" rx="14" fill="#f5f5f4" />
      <path d="M54 28 L262 22 L276 192 L46 198 Z" fill="#57534e" />
      {bands.map((b, i) => (
        <g key={b.name}>
          <rect x="66" y={b.y} width="190" height="42" fill={b.color} opacity="0.15">
            <animate attributeName="opacity" values="0.1;0.1;0.55;0.1;0.1" keyTimes={`0;${i * 0.3};${i * 0.3 + 0.1};${i * 0.3 + 0.25};1`} dur="6s" repeatCount="indefinite" />
          </rect>
          {Array.from({ length: 3 }, (_, k) => (
            <path key={k} d={`M76 ${b.y + 10 + k * 12} ${Array.from({ length: 14 }, (_, j) => `l6 ${j % 2 ? 4 : -4} l6 0`).join(" ")}`} stroke="#d6d3d1" strokeWidth="1.5" fill="none" />
          ))}
          <text x="300" y={b.y + 26} fontSize="14" fontWeight="900" fill={b.color} fontFamily="Georgia, serif">
            {b.name}
          </text>
        </g>
      ))}
      <text x="430" y="196" textAnchor="middle" fontSize="12" fontStyle="italic" fill="#57534e" fontFamily="Georgia, serif">
        o mesmo texto, três escritas
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
    <ChapterOpener
      n={2}
      title="Mesopotâmia e Egito"
      goals={["Por que as primeiras civilizações nasceram perto de rios", "A Mesopotâmia, os zigurates e o Código de Hamurábi", "As cheias do Nilo, os faraós e as pirâmides", "Como os hieróglifos foram decifrados"]}
    >
      <Fig h={34}>
        <NileOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🏺">A Mesopotâmia</H>
      <P>
        <T>Mesopotâmia</T> quer dizer “terra entre rios”: ela ficava entre os rios <T>Tigre</T> e <T>Eufrates</T>, onde hoje é principalmente o Iraque. Ali os sumérios
        criaram algumas das primeiras cidades, a escrita cuneiforme e a <T>roda</T>.
      </P>
      <Fig n="2.1" caption="O zigurate, templo em degraus, entre os dois rios." h={21}>
        <ZigguratArt />
      </Fig>
      <Box kind="sabia">
        O rei <strong>Hamurábi</strong>, da Babilônia, criou por volta de 1750 a.C. um dos primeiros códigos de leis escritas, gravado numa pedra. Ele ficou famoso pelo
        “olho por olho, dente por dente”.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🌊">O Egito e o Nilo</H>
      <P>
        No deserto do norte da África, a vida do Egito dependia do rio <T>Nilo</T>. Todo ano ele transbordava e deixava um lodo fértil nas margens. O historiador grego
        Heródoto disse que “o Egito é uma dádiva do Nilo”. Veja as estações:
      </P>
      <NileSeasons />
    </>,
  ),

  page(
    <>
      <H icon="👑">Os faraós e as pirâmides</H>
      <P>
        O rei do Egito, o <T>faraó</T>, era considerado um deus vivo, com poder político e religioso. As <T>pirâmides de Gizé</T> foram construídas como{" "}
        <T>túmulos</T> para os faraós. Os egípcios acreditavam na vida após a morte e por isso <T>mumificavam</T> os corpos.
      </P>
      <Fig n="2.2" caption="O sarcófago se abre e mostra a múmia." h={21}>
        <MummyArt />
      </Fig>
      <Cards
        items={[
          { icon: "🔺", title: "Grande Pirâmide", text: "A única das Sete Maravilhas do Mundo Antigo que continua de pé." },
          { icon: "🎭", title: "Tutancâmon", text: "O faraó menino, cujo túmulo cheio de tesouros foi achado em 1922." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="📜">Os hieróglifos</H>
      <P>
        A escrita egípcia era feita de desenhos e símbolos: os <T>hieróglifos</T>. Por muito tempo ninguém conseguia lê-los. A chave foi a <T>Pedra de Roseta</T>, que
        tem o mesmo texto em três escritas.
      </P>
      <Fig n="2.3" caption="A Pedra de Roseta: comparar as três escritas revelou os hieróglifos." h={21}>
        <RosettaArt />
      </Fig>
      <Box kind="lembre">
        Comparando o grego, que ele sabia ler, com os hieróglifos, o francês <strong>Champollion</strong> decifrou a escrita egípcia em <strong>1822</strong>.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "As primeiras civilizações nasceram perto de rios, que davam água e terra fértil.",
          "A Mesopotâmia ficava entre o Tigre e o Eufrates; ali surgiram a escrita cuneiforme, a roda e os zigurates.",
          "Hamurábi criou um dos primeiros códigos de leis escritas.",
          "No Egito, as cheias do Nilo fertilizavam as margens; o faraó era um deus vivo.",
          "As pirâmides eram túmulos; Champollion decifrou os hieróglifos com a Pedra de Roseta (1822).",
        ]}
      />
      <Glossary
        items={[
          ["Mesopotâmia", "A “terra entre rios”, entre o Tigre e o Eufrates."],
          ["Zigurate", "Templo em forma de torre com degraus."],
          ["Faraó", "O rei do Egito, considerado um deus."],
          ["Mumificação", "Técnica de conservar o corpo depois da morte."],
          ["Hieróglifos", "A escrita de desenhos e símbolos do Egito."],
        ]}
      />
      <Quiz
        items={[
          ["Entre quais rios ficava a Mesopotâmia?", "Entre o Tigre e o Eufrates."],
          ["Por que o Nilo era tão importante para o Egito?", "Porque suas cheias deixavam um lodo fértil nas margens."],
          ["Para que serviam as pirâmides de Gizé?", "Eram túmulos dos faraós."],
          ["Quem decifrou os hieróglifos?", "Champollion, em 1822, com a Pedra de Roseta."],
        ]}
      />
    </>,
  ),
];
