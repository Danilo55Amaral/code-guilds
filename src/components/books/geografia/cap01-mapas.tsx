"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Kid, Tree } from "../ods/art";
import { CompassRose, GEO, GEO_DARK, House, Panel, Pill, Slider } from "./art";

// ============================================================================
// CAPÍTULO 1 — MAPAS E ORIENTAÇÃO (missão "Geografia: Mapas e Orientação"):
// o mapa do tesouro com o caminho se desenhando, o Sol nascendo no leste, a
// caça ao tesouro pela rosa dos ventos (de tocar), a calculadora de escala
// (de tocar) e o mapa com a legenda.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o mapa do tesouro
// ---------------------------------------------------------------------------

function TreasureOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Um mapa do tesouro antigo, com ilhas, uma rosa dos ventos e um caminho tracejado que se desenha até o X do tesouro">
      <rect width="460" height="300" fill="#bae6fd" />
      <path d="M40 30 L420 22 L430 270 L36 280 Z" fill="#fef3c7" stroke="#a16207" strokeWidth="3" />
      <path d="M80 90 Q120 60 170 80 Q200 120 160 150 Q110 160 90 130 Z" fill="#bbf7d0" stroke="#15803d" strokeWidth="2" />
      <path d="M240 160 Q300 130 360 160 Q380 210 330 240 Q270 250 250 210 Z" fill="#bbf7d0" stroke="#15803d" strokeWidth="2" />
      <Tree x={120} y={128} s={0.5} />
      <Tree x={300} y={208} s={0.5} />
      <path d="M130 110 C 200 120, 200 190, 260 190 S 320 200, 330 205" fill="none" stroke="#b91c1c" strokeWidth="4" strokeDasharray="10 7" pathLength={100}>
        <animate attributeName="stroke-dashoffset" values="100;0" dur="4s" repeatCount="indefinite" />
      </path>
      <g transform="translate(330 205)">
        <path d="M-12 -12 L12 12 M12 -12 L-12 12" stroke="#b91c1c" strokeWidth="6" strokeLinecap="round" />
        <circle r="20" fill="none" stroke="#facc15" strokeWidth="3">
          <animate attributeName="r" values="16;26;16" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.2;1" dur="1.6s" repeatCount="indefinite" />
        </circle>
      </g>
      <CompassRose x={375} y={80} r={36} spin />
      <text x="230" y="265" textAnchor="middle" fontSize="18" fontWeight="900" fill="#78350f" fontFamily="Georgia, serif">
        Siga para o sudeste!
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O Sol nasce no leste
// ---------------------------------------------------------------------------

function SunriseArt() {
  return (
    <Art viewBox="0 0 560 200" label="Uma criança de costas, olhando para o norte, com o braço direito apontado para o Sol nascendo, no leste, e o esquerdo para o oeste">
      <rect width="560" height="200" rx="14" fill="#fef9c3" />
      <rect y="150" width="560" height="50" fill="#86efac" />
      <g>
        <circle cx="500" cy="150" r="26" fill="#facc15">
          <animate attributeName="cy" values="170;110;170" dur="6s" repeatCount="indefinite" />
        </circle>
      </g>
      <circle cx="60" cy="150" r="20" fill="#fb923c" opacity="0.6" />
      <Kid x={280} y={168} s={1.6} shirt="#0e7490" />
      {/* de costas, olhando para o norte: o cabelo cobre o rosto */}
      <circle cx="280" cy="81.6" r="18.4" fill="#3f2a14" />
      <path d="M296 104 L360 96" stroke="#d6a77a" strokeWidth="8" strokeLinecap="round" />
      <path d="M264 104 L200 96" stroke="#d6a77a" strokeWidth="8" strokeLinecap="round" />
      {[
        ["NORTE (frente)", 280, 28],
        ["LESTE (nascente)", 440, 70],
        ["OESTE (poente)", 120, 70],
        ["SUL (costas)", 280, 192],
      ].map(([t, x, y]) => (
        <text key={t as string} x={x as number} y={y as number} textAnchor="middle" fontSize="15" fontWeight="900" fill={GEO_DARK} fontFamily="Georgia, serif">
          {t}
        </text>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A caça ao tesouro pela rosa dos ventos (de tocar)
// ---------------------------------------------------------------------------

const SIZE = 5;
const TREASURE = { x: 4, y: 0 };
const START = { x: 0, y: 4 };
const MOVES = {
  N: { dx: 0, dy: -1, name: "Norte" },
  S: { dx: 0, dy: 1, name: "Sul" },
  L: { dx: 1, dy: 0, name: "Leste" },
  O: { dx: -1, dy: 0, name: "Oeste" },
} as const;

export function CompassHunt() {
  const [pos, setPos] = useState(START);
  const [steps, setSteps] = useState<string[]>([]);
  const found = pos.x === TREASURE.x && pos.y === TREASURE.y;

  function go(dir: keyof typeof MOVES) {
    if (found) return;
    const m = MOVES[dir];
    const next = { x: Math.min(SIZE - 1, Math.max(0, pos.x + m.dx)), y: Math.min(SIZE - 1, Math.max(0, pos.y + m.dy)) };
    setPos(next);
    setSteps((s) => [...s, dir]);
  }

  return (
    <Panel title="Caça ao tesouro: chegue ao X">
      <div className="flex items-center gap-[0.8em]">
        <svg viewBox="0 0 220 220" className="w-[55%] shrink-0" role="img" aria-label="Um mapa em quadradinhos com o explorador e o tesouro">
          <rect width="220" height="220" rx="10" fill="#fef3c7" stroke="#a16207" strokeWidth="2" />
          {Array.from({ length: SIZE * SIZE }, (_, i) => (
            <rect key={i} x={10 + (i % SIZE) * 40} y={10 + Math.floor(i / SIZE) * 40} width="40" height="40" fill="none" stroke="#e7d3a1" />
          ))}
          <path d={`M${10 + TREASURE.x * 40 + 10} ${10 + TREASURE.y * 40 + 10} l20 20 m0 -20 l-20 20`} stroke="#b91c1c" strokeWidth="5" strokeLinecap="round" />
          <g transform={`translate(${30 + pos.x * 40} ${48 + pos.y * 40})`} style={{ transition: "transform 0.3s" }}>
            <Kid x={0} y={0} s={0.55} shirt={GEO} />
          </g>
          {found && (
            <text x="110" y="120" textAnchor="middle" fontSize="22" fontWeight="900" fill="#b91c1c" stroke="#fff" strokeWidth="4" paintOrder="stroke" fontFamily="Georgia, serif">
              Achou o tesouro!
            </text>
          )}
        </svg>
        <div className="flex flex-1 flex-col items-center gap-[0.3em]">
          <Pill onClick={() => go("N")}>⬆ Norte</Pill>
          <div className="flex gap-[0.3em]">
            <Pill onClick={() => go("O")}>⬅ Oeste</Pill>
            <Pill onClick={() => go("L")}>Leste ➡</Pill>
          </div>
          <Pill onClick={() => go("S")}>⬇ Sul</Pill>
          <p className="mt-[0.3em] text-center text-[0.78em] leading-snug text-[#5b4a2e]">
            {found ? `Você chegou em ${steps.length} passos. O tesouro estava a nordeste da saída!` : `Passos: ${steps.map((s) => s).join(" ") || "nenhum"}`}
          </p>
          <Pill
            onClick={() => {
              setPos(START);
              setSteps([]);
            }}
          >
            ↺ Recomeçar
          </Pill>
        </div>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// A calculadora de escala (de tocar)
// ---------------------------------------------------------------------------

const SCALES = [10_000, 50_000, 100_000, 1_000_000, 10_000_000];

function formatDistance(cm: number) {
  if (cm >= 100_000) return `${(cm / 100_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km`;
  return `${(cm / 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} m`;
}

export function ScaleCalculator() {
  const [scale, setScale] = useState(2);
  const [cm, setCm] = useState(3);
  const denom = SCALES[scale];
  return (
    <Panel title="Calculadora de escala">
      <div className="mb-[0.4em] flex flex-wrap justify-center gap-[0.3em]">
        {SCALES.map((s, i) => (
          <Pill key={s} on={scale === i} onClick={() => setScale(i)}>
            1:{s.toLocaleString("pt-BR")}
          </Pill>
        ))}
      </div>
      <Slider label="No mapa" value={cm} min={1} max={10} onChange={setCm} suffix=" cm" />
      <svg viewBox="0 0 400 46" className="mt-[0.3em] w-full" aria-hidden="true">
        <line x1="10" y1="24" x2={10 + cm * 38} y2="24" stroke={GEO_DARK} strokeWidth="6" strokeLinecap="round" />
        {Array.from({ length: cm + 1 }, (_, i) => (
          <line key={i} x1={10 + i * 38} y1="14" x2={10 + i * 38} y2="34" stroke={GEO_DARK} strokeWidth="2" />
        ))}
      </svg>
      <p className="text-center text-[0.92em]">
        {cm} cm no mapa × {denom.toLocaleString("pt-BR")} = <strong style={{ color: GEO_DARK }}>{formatDistance(cm * denom)}</strong> no terreno
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// O mapa com a legenda
// ---------------------------------------------------------------------------

function LegendMapArt() {
  return (
    <Art viewBox="0 0 560 210" label="Um mapa de um bairro com rio, estrada, escola, hospital e praça, e ao lado o quadro da legenda explicando cada símbolo">
      <rect width="560" height="210" rx="14" fill="#fffaf0" />
      <rect x="14" y="14" width="360" height="182" rx="8" fill="#ecfccb" stroke="#a16207" strokeWidth="2" />
      <path d="M14 70 Q120 40 200 90 T374 80" fill="none" stroke="#38bdf8" strokeWidth="12" />
      <path d="M60 196 L120 14" stroke="#9ca3af" strokeWidth="10" />
      <path d="M60 196 L120 14" stroke="#fff" strokeWidth="2" strokeDasharray="8 6" />
      <path d="M14 150 L374 130" stroke="#9ca3af" strokeWidth="10" />
      <g transform="translate(210 160)">
        <rect x="-16" y="-16" width="32" height="26" fill="#fde68a" stroke="#78350f" />
        <text y="4" textAnchor="middle" fontSize="14">📚</text>
      </g>
      <g transform="translate(300 170)">
        <rect x="-15" y="-15" width="30" height="30" rx="4" fill="#fff" stroke="#dc2626" strokeWidth="2" />
        <path d="M-8 0 H8 M0 -8 V8" stroke="#dc2626" strokeWidth="4" />
      </g>
      <circle cx="250" cy="110" r="22" fill="#4ade80" stroke="#15803d" strokeWidth="2" />
      <Tree x={250} y={124} s={0.32} />
      <House x={170} y={124} s={0.7} />
      <House x={320} y={110} s={0.7} wall="#bfdbfe" roof="#1d4ed8" />
      <g transform="translate(340 40)">
        <path d="M0 -14 L6 0 L0 -4 L-6 0 Z" fill="#dc2626" />
        <text y="14" textAnchor="middle" fontSize="11" fontWeight="900" fill={GEO_DARK}>N</text>
      </g>
      <rect x="390" y="14" width="156" height="182" rx="8" fill="#fff" stroke="#a16207" strokeWidth="2" />
      <text x="468" y="36" textAnchor="middle" fontSize="14" fontWeight="900" fill={GEO_DARK} fontFamily="Georgia, serif">
        Legenda
      </text>
      {[
        [<rect key="r" x="-10" y="-5" width="20" height="10" fill="#38bdf8" />, "Rio"],
        [<rect key="e" x="-10" y="-4" width="20" height="8" fill="#9ca3af" />, "Estrada"],
        [<text key="s" x="0" y="5" textAnchor="middle" fontSize="13">📚</text>, "Escola"],
        [<path key="h" d="M-7 0 H7 M0 -7 V7" stroke="#dc2626" strokeWidth="4" />, "Hospital"],
        [<circle key="p" r="7" fill="#4ade80" stroke="#15803d" />, "Praça"],
        [<path key="c" d="M-8 6 V-2 L0 -8 L8 -2 V6 Z" fill="#fde68a" stroke="#78350f" />, "Casas"],
      ].map(([icon, name], i) => (
        <g key={name as string} transform={`translate(412 ${60 + i * 24})`}>
          {icon}
          <text x="20" y="5" fontSize="13" fontWeight="700" fill="#3b2a14" fontFamily="Georgia, serif">
            {name}
          </text>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 1, content, bare });

export const chapter1: BookPage[] = [
  page(
    <ChapterOpener n={1} title="Mapas e Orientação" goals={["Os pontos cardeais e a rosa dos ventos", "Como se orientar pelo Sol", "Para que serve a escala de um mapa", "A legenda e os tipos de mapa"]}>
      <Fig h={34}>
        <TreasureOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🧭">Os pontos cardeais</H>
      <P>
        Para dizer onde as coisas estão, usamos os <T>pontos cardeais</T>: <T>Norte</T>, <T>Sul</T>, <T>Leste</T> e <T>Oeste</T>. O Sol nasce sempre do lado leste
        (o nascente) e se põe do lado oeste (o poente), por causa da rotação da Terra.
      </P>
      <Fig n="1.1" caption="Com o braço direito apontado para onde o Sol nasce, você está de frente para o norte." h={22}>
        <SunriseArt />
      </Fig>
      <Box kind="experimente">
        De manhã, aponte o braço direito para o Sol. À sua frente fica o norte, atrás o sul e à esquerda o oeste. Agora você sabe se orientar sem bússola!
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="✳️">A rosa dos ventos</H>
      <P>
        A <T>rosa dos ventos</T> mostra os pontos cardeais e, entre eles, os <T>colaterais</T>: Nordeste (NE), Sudeste (SE), Sudoeste (SO) e Noroeste (NO). A
        <T> bússola</T> tem uma agulha imantada que aponta sempre para o norte magnético. Leve o explorador até o tesouro:
      </P>
      <CompassHunt />
      <Box kind="lembre">
        Cardeais: N, S, L e O. Colaterais: NE, SE, SO e NO, que ficam no meio do caminho entre dois cardeais.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="📏">A escala</H>
      <P>
        Um mapa é um desenho <T>reduzido</T> de um lugar. A <T>escala</T> diz quantas vezes ele foi reduzido. Na escala <T>1:100.000</T>, cada 1 cm do mapa vale
        100.000 cm, ou seja, 1 km no terreno. Calcule:
      </P>
      <ScaleCalculator />
      <Box kind="mago" title="Escala grande ou pequena?">
        Escala <strong>grande</strong> (1:10.000) mostra uma área pequena com muitos detalhes, como um bairro. Escala <strong>pequena</strong> (1:10.000.000) mostra uma
        área enorme com poucos detalhes, como o Brasil inteiro.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🗺️">A legenda e os tipos de mapa</H>
      <P>
        Todo mapa tem <T>título</T>, <T>orientação</T> (a seta do norte), <T>escala</T> e <T>legenda</T>, o quadro que explica o que cada símbolo e cada cor quer
        dizer.
      </P>
      <Fig n="1.2" caption="O mapa de um bairro e a legenda dos símbolos." h={20}>
        <LegendMapArt />
      </Fig>
      <Cards
        items={[
          { icon: "🏳️", title: "Político", text: "Mostra países, estados, fronteiras e capitais." },
          { icon: "⛰️", title: "Físico", text: "Mostra o relevo, os rios e as altitudes, com cores." },
          { icon: "📊", title: "Temático", text: "Mostra um assunto: clima, população, chuvas..." },
          { icon: "🏘️", title: "Planta e croqui", text: "Planta é um mapa bem detalhado; croqui é um esboço à mão." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Os pontos cardeais são Norte, Sul, Leste e Oeste; o Sol nasce no leste e se põe no oeste.",
          "A rosa dos ventos mostra também os colaterais: NE, SE, SO e NO.",
          "A bússola tem uma agulha imantada que aponta para o norte.",
          "A escala diz quantas vezes o lugar foi reduzido: 1:100.000 quer dizer 1 cm = 1 km.",
          "A legenda explica os símbolos; há mapas políticos, físicos e temáticos.",
        ]}
      />
      <Glossary
        items={[
          ["Pontos cardeais", "Norte, Sul, Leste e Oeste."],
          ["Nascente", "O lado em que o Sol nasce: o leste."],
          ["Bússola", "Instrumento com agulha imantada que aponta o norte."],
          ["Escala", "A relação entre o tamanho no mapa e o tamanho real."],
          ["Legenda", "O quadro que explica os símbolos do mapa."],
        ]}
      />
      <Quiz
        items={[
          ["De que lado o Sol nasce?", "Do lado leste (o nascente)."],
          ["Qual ponto colateral fica entre o Sul e o Leste?", "O Sudeste (SE)."],
          ["Numa escala 1:100.000, quanto valem 3 cm do mapa?", "3 km no terreno."],
          ["Para que serve a legenda de um mapa?", "Para explicar o significado dos símbolos e das cores."],
        ]}
      />
    </>,
  ),
];
