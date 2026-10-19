"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Earth, Moon, Stars, Sun } from "./art";

// ============================================================================
// CAPÍTULO 2 — A LUA E OS ECLIPSES (missão "Astronomia: A Lua e os
// Eclipses"): a Lua girando em volta da Terra, as fases de mexer (como
// aparecem no céu do Brasil, no Hemisfério Sul), os eclipses solar e lunar
// (com a Lua de Sangue), a cratera se formando e as marés.
// ============================================================================

/** O caminho da parte iluminada da Lua vista daqui (Hemisfério Sul), no dia `day` do ciclo. */
export function litPath(day: number, r: number): string {
  const angle = (day / 29.5) * Math.PI * 2;
  const k = (1 - Math.cos(angle)) / 2;
  const rx = Math.max(0.01, r * Math.abs(Math.cos(angle)));
  const waxing = angle < Math.PI;
  if (k < 0.02) return "";
  if (waxing) {
    // crescente: iluminada do lado esquerdo (no Hemisfério Sul)
    return `M0 ${-r} A${r} ${r} 0 0 0 0 ${r} A${rx} ${r} 0 0 ${k < 0.5 ? 1 : 0} 0 ${-r} Z`;
  }
  return `M0 ${-r} A${r} ${r} 0 0 1 0 ${r} A${rx} ${r} 0 0 ${k < 0.5 ? 0 : 1} 0 ${-r} Z`;
}

function phaseName(day: number): string {
  if (day < 1.5 || day > 28) return "Lua Nova";
  if (day < 6.4) return "Crescente";
  if (day < 8.4) return "Quarto Crescente";
  if (day < 13.8) return "Crescente gibosa";
  if (day < 15.8) return "Lua Cheia";
  if (day < 21.2) return "Minguante gibosa";
  if (day < 23.2) return "Quarto Minguante";
  return "Minguante";
}

// ---------------------------------------------------------------------------
// Abertura: a Lua girando em volta da Terra
// ---------------------------------------------------------------------------

function MoonOrbitOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="A Lua girando em volta da Terra, sempre com o lado virado para o Sol iluminado">
      <rect width="460" height="300" fill="#020617" />
      <Stars w={460} h={300} n={50} />
      <Sun x={-10} y={150} r={50} />
      <ellipse cx="270" cy="150" rx="140" ry="100" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="5 5" />
      <Earth x={270} y={150} r={40} />
      <g>
        <animateMotion path="M410 150 A140 100 0 1 0 130 150 A140 100 0 1 0 410 150" dur="12s" repeatCount="indefinite" />
        <circle r="16" fill="#3f3f46" />
        <path d="M0 -16 A16 16 0 0 0 0 16 Z" fill="#e4e4e7" />
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As fases da Lua de mexer
// ---------------------------------------------------------------------------

export function MoonPhases() {
  const [day, setDay] = useState(7);
  const a = (day / 29.5) * Math.PI * 2;
  // na vista de cima, o Sol fica à esquerda e a Lua gira em volta da Terra
  const mx = 230 - Math.cos(a) * 80;
  const my = 100 + Math.sin(a) * 80;
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <div className="flex flex-wrap items-center justify-center gap-[0.6em]">
        <svg viewBox="0 0 320 200" className="h-[10em] w-auto" aria-label="A Lua em volta da Terra, vista de cima">
          <rect width="320" height="200" rx="10" fill="#020617" />
          {[40, 100, 160].map((y) => (
            <path key={y} d={`M10 ${y} L60 ${y}`} stroke="#fde047" strokeWidth="3" strokeDasharray="8 6" className="cg-anim-dash" />
          ))}
          <text x="14" y="24" fontSize="11" fontWeight="900" fill="#fde047">
            luz do Sol →
          </text>
          <circle cx="230" cy="100" r="80" fill="none" stroke="#475569" strokeDasharray="4 4" />
          <circle cx="230" cy="100" r="22" fill="#2563eb" />
          <g transform={`translate(${mx} ${my})`}>
            <circle r="12" fill="#3f3f46" />
            <path d="M0 -12 A12 12 0 0 0 0 12 Z" fill="#e4e4e7" />
          </g>
        </svg>
        <svg viewBox="-60 -60 120 140" className="h-[10em] w-auto" aria-label={phaseName(day)}>
          <circle r="50" fill="#1c1917" />
          <path d={litPath(day, 50)} fill="#e7e5e4" />
          <circle cx="-14" cy="-12" r="8" fill="#a8a29e" opacity="0.35" />
          <circle cx="16" cy="18" r="6" fill="#a8a29e" opacity="0.35" />
          <text y="74" textAnchor="middle" fontSize="13" fontWeight="900" fill="#1e3a8a" fontFamily="Georgia, serif">
            {phaseName(day)}
          </text>
        </svg>
      </div>
      <label className="mt-[0.3em] block text-[0.86em]">
        <span className="font-bold">Dia {Math.round(day)} do ciclo (de 29,5 dias)</span>
        <input type="range" min={0} max={29.5} step={0.5} value={day} onChange={(e) => setDay(Number(e.target.value))} className="w-full accent-[#1d4ed8]" />
      </label>
      <p className="text-center text-[0.8em] italic text-[#6b5a3a]">A Lua vista do Brasil (Hemisfério Sul): a crescente aparece como um “C”.</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Os eclipses: solar e lunar
// ---------------------------------------------------------------------------

function EclipsesArt() {
  return (
    <Art viewBox="0 0 560 240" label="No eclipse solar, a Lua passa entre o Sol e a Terra e faz sombra na Terra; no eclipse lunar, a Terra fica entre o Sol e a Lua, e a Lua fica avermelhada">
      <rect width="560" height="240" rx="14" fill="#020617" />
      {/* eclipse solar */}
      <Sun x={50} y={60} r={30} />
      <path d="M210 52 L330 56 L330 64 L210 68 Z" fill="#000" opacity="0.6" />
      <Moon x={210} y={60} r={10} />
      <Earth x={340} y={60} r={26} />
      <text x="480" y="56" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#fde68a" fontFamily="Georgia, serif">
        eclipse solar
      </text>
      <text x="480" y="74" textAnchor="middle" fontSize="11" fill="#e2e8f0" fontFamily="Georgia, serif">
        a Lua no meio
      </text>
      {/* eclipse lunar */}
      <Sun x={50} y={180} r={30} />
      <path d="M220 166 L360 176 L360 184 L220 194 Z" fill="#000" opacity="0.7" />
      <Earth x={220} y={180} r={26} />
      <g transform="translate(372 180)">
        <circle r="14">
          <animate attributeName="fill" values="#e4e4e7;#e4e4e7;#b91c1c;#b91c1c;#e4e4e7" keyTimes="0;0.3;0.5;0.85;1" dur="6s" repeatCount="indefinite" />
        </circle>
      </g>
      <text x="480" y="176" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#fca5a5" fontFamily="Georgia, serif">
        eclipse lunar
      </text>
      <text x="480" y="194" textAnchor="middle" fontSize="11" fill="#e2e8f0" fontFamily="Georgia, serif">
        a Terra no meio
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A superfície da Lua: a cratera se formando e a pegada
// ---------------------------------------------------------------------------

function CraterArt() {
  const loop = { dur: "4s", repeatCount: "indefinite" };
  return (
    <Art viewBox="0 0 560 210" label="Uma rocha espacial cai na Lua sem atmosfera, faz um clarão e deixa uma cratera; ao lado, a pegada de um astronauta que continua lá até hoje">
      <rect width="560" height="210" rx="14" fill="#020617" />
      <Stars w={560} h={120} n={24} seed={13} />
      <path d="M0 150 C120 140 240 156 360 146 C440 140 500 150 560 146 L560 210 L0 210 Z" fill="#a8a29e" />
      {/* a rocha caindo */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="-160 -130;0 0;0 0" keyTimes="0;0.3;1" {...loop} />
        <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.3;0.31;1" {...loop} />
        <circle cx="200" cy="150" r="8" fill="#78716c" />
        <path d="M194 144 L170 120" stroke="#f97316" strokeWidth="3" />
      </g>
      {/* o clarão e a cratera */}
      <circle cx="200" cy="150" r="10" fill="#fef3c7" opacity="0">
        <animate attributeName="r" values="10;10;50;50" keyTimes="0;0.3;0.45;1" {...loop} />
        <animate attributeName="opacity" values="0;0;0.9;0;0" keyTimes="0;0.3;0.35;0.5;1" {...loop} />
      </circle>
      <g opacity="0">
        <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.33;0.4;0.95;1" {...loop} />
        <ellipse cx="200" cy="156" rx="40" ry="10" fill="#57534e" />
        <ellipse cx="200" cy="154" rx="46" ry="12" fill="none" stroke="#d6d3d1" strokeWidth="3" />
      </g>
      {/* a pegada */}
      <g transform="translate(430 176)">
        <path d="M-14 -8 C-14 -18 14 -18 14 -8 L12 10 C10 18 -10 18 -12 10 Z" fill="#78716c" />
        {[-8, -2, 4, 10].map((x) => (
          <path key={x} d={`M${x} -12 L${x} 12`} stroke="#57534e" strokeWidth="1.5" />
        ))}
      </g>
      <g fontFamily="Georgia, serif" fontSize="12" fontWeight="900">
        <text x="200" y="196" textAnchor="middle" fill="#1c1917">sem ar, a rocha chega inteira</text>
        <text x="430" y="130" textAnchor="middle" fill="#f5f5f4">a pegada continua lá</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As marés
// ---------------------------------------------------------------------------

function TidesArt() {
  return (
    <Art viewBox="0 0 560 220" label="A gravidade da Lua puxa a água dos oceanos, formando um calombo de maré alta do lado da Lua e do lado oposto">
      <rect width="560" height="220" rx="14" fill="#020617" />
      <g transform="translate(160 110)">
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="14s" repeatCount="indefinite" />
          <ellipse rx="86" ry="62" fill="#38bdf8" opacity="0.55" />
          <g transform="translate(140 0)">
            <Moon r={16} />
          </g>
        </g>
        <Earth r={52} />
      </g>
      {/* a praia: a maré sobe e desce */}
      <g transform="translate(330 30)">
        <rect width="210" height="160" rx="12" fill="#e0f2fe" />
        <path d="M0 160 L0 120 L210 70 L210 160 Z" fill="#fde68a" />
        <path d="M0 160 L0 110 L210 110 L210 160 Z" fill="#38bdf8" opacity="0.8">
          <animateTransform attributeName="transform" type="translate" values="0 26;0 -10;0 26" dur="7s" repeatCount="indefinite" />
        </path>
        <text x="105" y="22" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#0c4a6e" fontFamily="Georgia, serif">
          maré alta e maré baixa
        </text>
      </g>
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
      title="A Lua e os Eclipses"
      goals={["Por que a Lua muda de fase", "Como acontecem os eclipses do Sol e da Lua", "Como se formaram as crateras e os mares lunares", "Por que existem as marés"]}
    >
      <Fig h={34}>
        <MoonOrbitOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🌗">As fases da Lua</H>
      <P>
        A Lua não tem luz própria: ela <T>reflete a luz do Sol</T>. Metade dela está sempre iluminada, mas, enquanto ela gira em volta da Terra (num ciclo de cerca de{" "}
        <T>29,5 dias</T>), vemos pedaços diferentes dessa metade. Arraste os dias:
      </P>
      <MoonPhases />
      <P>
        A sequência é <T>Lua Nova</T> → <T>Quarto Crescente</T> → <T>Lua Cheia</T> → <T>Quarto Minguante</T>, e o ciclo recomeça. A Lua também gira em volta de si mesma no mesmo
        tempo, por isso vemos sempre o mesmo lado dela.
      </P>
    </>,
  ),

  page(
    <>
      <H icon="🌑">Os eclipses</H>
      <P>
        Um <T>eclipse</T> acontece quando o Sol, a Terra e a Lua ficam alinhados e um faz sombra no outro.
      </P>
      <Fig n="2.1" caption="No eclipse solar, a Lua fica no meio; no lunar, a Terra fica no meio." h={26}>
        <EclipsesArt />
      </Fig>
      <List
        items={[
          <>
            <T>Eclipse solar</T>: a Lua passa entre o Sol e a Terra, e a sombra dela cai sobre a Terra. Só acontece na Lua Nova.
          </>,
          <>
            <T>Eclipse lunar</T>: a Terra fica entre o Sol e a Lua, e a sombra da Terra cobre a Lua. Só acontece na Lua Cheia. A Lua fica avermelhada, a &ldquo;Lua de Sangue&rdquo;,
            porque a atmosfera da Terra desvia a luz vermelha do Sol até ela, como num pôr do sol.
          </>,
        ]}
      />
      <Box kind="atencao">Nunca olhe diretamente para o Sol, nem durante um eclipse: a luz pode lesar a retina sem dor e para sempre. Use óculos próprios para eclipse ou projete a imagem num papel.</Box>
    </>,
  ),

  page(
    <>
      <H icon="🌕">A superfície da Lua</H>
      <P>
        A Lua não tem atmosfera. Por isso as rochas espaciais chegam inteiras até o chão e deixam <T>crateras</T>, e não há vento nem chuva para apagar nada: as pegadas dos
        astronautas podem durar milhões de anos.
      </P>
      <Fig n="2.2" caption="Uma cratera se formando e a pegada de astronauta que continua lá." h={24}>
        <CraterArt />
      </Fig>
      <P>
        As manchas escuras que vemos são os <T>mares lunares</T>: há bilhões de anos, lava cobriu essas regiões e esfriou, formando rochas escuras. Não há água lá! A Lua tem
        cerca de <T>3.474 km</T> de diâmetro, mais ou menos <T>1/4 da Terra</T>: caberiam umas 50 Luas dentro da Terra.
      </P>
    </>,
  ),

  page(
    <>
      <H icon="🌊">As marés</H>
      <P>
        A <T>gravidade da Lua</T> puxa a água dos oceanos, formando um &ldquo;calombo&rdquo; de água do lado virado para ela (e outro do lado oposto). Enquanto a Terra gira, cada
        praia passa por esses calombos: são as <T>marés altas</T> e as <T>marés baixas</T>, duas de cada por dia.
      </P>
      <Fig n="2.3" caption="Os calombos de água acompanham a Lua; na praia, a maré sobe e desce." h={24}>
        <TidesArt />
      </Fig>
      <Box kind="sabia">O Sol também puxa a água, com menos força. Na Lua Cheia e na Lua Nova, Sol e Lua puxam juntos e as marés ficam mais fortes: são as marés de sizígia.</Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "A Lua reflete a luz do Sol. As fases são: Nova, Quarto Crescente, Cheia e Quarto Minguante (ciclo de 29,5 dias).",
          "Eclipse solar: a Lua entre o Sol e a Terra (Lua Nova). Eclipse lunar: a Terra no meio (Lua Cheia).",
          "No eclipse lunar total, a Lua fica avermelhada: a Lua de Sangue.",
          "Sem atmosfera, a Lua guarda crateras e pegadas; os mares lunares são lava antiga.",
          "As marés são causadas principalmente pela gravidade da Lua.",
        ]}
      />
      <Glossary
        items={[
          ["Fase da Lua", "A parte iluminada da Lua que vemos da Terra."],
          ["Eclipse", "Quando um astro faz sombra no outro."],
          ["Cratera", "Buraco formado pelo choque de uma rocha espacial."],
          ["Mar lunar", "Região escura da Lua, de lava antiga solidificada."],
          ["Maré", "A subida e descida do nível do mar."],
        ]}
      />
      <Quiz
        items={[
          ["Qual fase vem logo depois da Lua Nova?", "A Lua Crescente (até o Quarto Crescente)."],
          ["No eclipse lunar, quem fica no meio?", "A Terra, entre o Sol e a Lua."],
          ["Por que as pegadas dos astronautas continuam na Lua?", "Porque lá não há atmosfera, nem vento, nem chuva."],
          ["O que causa as marés?", "Principalmente a gravidade da Lua puxando a água dos oceanos."],
        ]}
      />
    </>,
  ),
];
