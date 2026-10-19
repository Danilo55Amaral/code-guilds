"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, useUid } from "../BookParts";
import type { BookPage } from "../types";
import { Cloud, Kid, Sun, Tree } from "./art";

// ============================================================================
// CAPÍTULO 9 — CIDADES SUSTENTÁVEIS (missão "ODS: Consumo, Cidades e
// Biodiversidade", a parte das cidades, e "ODS: Pequenas Atitudes", a do
// transporte): a cidade verde com o ônibus e as bicicletas, a comparação do
// gás carbônico de cada transporte (de tocar), a ilha de calor do asfalto ×
// o parque e o bairro com moradia digna e acessível.
// ============================================================================

/** Um prédio (o pé em x, y), com janelas acesas e telhado verde se `green`. */
function Building({ x, y, w, h, color, green = false }: { x: number; y: number; w: number; h: number; color: string; green?: boolean }) {
  const cols = Math.max(1, Math.floor((w - 8) / 16));
  const rows = Math.max(1, Math.floor((h - 14) / 20));
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill={color} stroke="#334155" strokeWidth="1.5" />
      {green && <rect x={x - 2} y={y - h - 8} width={w + 4} height="9" rx="3" fill="#22c55e" />}
      {Array.from({ length: rows * cols }, (_, i) => (
        <rect key={i} x={x + 6 + (i % cols) * 16} y={y - h + 10 + Math.floor(i / cols) * 20} width="9" height="11" fill={i % 3 === 0 ? "#fde68a" : "#e0f2fe"} />
      ))}
    </g>
  );
}

// ---------------------------------------------------------------------------
// Abertura: a cidade verde
// ---------------------------------------------------------------------------

function GreenCityOpenerArt() {
  const u = useUid("ods");
  return (
    <Art viewBox="0 0 460 300" label="Uma cidade verde: prédios com telhados de plantas, árvores, um ônibus passando, crianças de bicicleta na ciclovia e painéis solares">
      <rect width="460" height="300" fill="#e0f2fe" />
      <Sun x={60} y={50} r={22} />
      <Cloud x={330} y={50} s={1} />
      <Building x={20} y={220} w={60} h={110} color="#cbd5e1" green />
      <Building x={90} y={220} w={50} h={150} color="#fde68a" green />
      <Building x={150} y={220} w={70} h={90} color="#fecaca" />
      <Building x={300} y={220} w={60} h={130} color="#bfdbfe" green />
      <Building x={370} y={220} w={70} h={100} color="#ddd6fe" />
      <Tree x={250} y={222} s={1} />
      <rect y="220" width="460" height="80" fill="#64748b" />
      <rect y="276" width="460" height="24" fill="#16a34a" />
      <rect y="268" width="460" height="8" fill="#ef4444" opacity="0.7" />
      {/* o ônibus */}
      <defs>
        <clipPath id={u}>
          <rect width="460" height="300" rx="14" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${u})`}>
        <animateTransform attributeName="transform" type="translate" values="-140 0;480 0" dur="9s" repeatCount="indefinite" />
        <rect x="0" y="226" width="110" height="36" rx="6" fill="#fd9d24" />
        {[10, 34, 58, 82].map((x) => (
          <rect key={x} x={x} y="232" width="18" height="12" rx="2" fill="#e0f2fe" />
        ))}
        <circle cx="22" cy="264" r="7" fill="#1e293b" />
        <circle cx="88" cy="264" r="7" fill="#1e293b" />
      </g>
      {/* a bicicleta na ciclovia */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="480 0;-60 0" dur="12s" repeatCount="indefinite" />
        <circle cx="0" cy="262" r="7" fill="none" stroke="#1e293b" strokeWidth="2.5" />
        <circle cx="22" cy="262" r="7" fill="none" stroke="#1e293b" strokeWidth="2.5" />
        <path d="M0 262 L10 252 L22 262 M10 252 L14 244" stroke="#2563eb" strokeWidth="2.5" fill="none" />
        <Kid x={11} y={256} s={0.42} shirt="#dd1367" skin="#8d5524" />
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O gás carbônico de cada transporte (de tocar)
// ---------------------------------------------------------------------------

/** Gás carbônico por pessoa numa viagem de 10 km (valores aproximados, só pra comparar). */
const TRIPS = [
  { name: "Carro sozinho", icon: "🚗", kg: 1.9, color: "#dc2626" },
  { name: "Carona (4 pessoas)", icon: "🚙", kg: 0.5, color: "#f97316" },
  { name: "Ônibus", icon: "🚌", kg: 0.8, color: "#f59e0b" },
  { name: "Metrô", icon: "🚇", kg: 0.3, color: "#84cc16" },
  { name: "Bicicleta ou a pé", icon: "🚲", kg: 0, color: "#16a34a" },
];

export function TransportCompare() {
  const [sel, setSel] = useState(0);
  const t = TRIPS[sel];
  const max = TRIPS[0].kg;
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <p className="text-center text-[0.8em] font-bold uppercase tracking-wider text-[#8a7146]">Uma viagem de 10 km até a escola</p>
      <div className="mt-[0.3em] space-y-[0.25em]">
        {TRIPS.map((trip, i) => (
          <button key={trip.name} type="button" onClick={() => setSel(i)} className={`flex w-full items-center gap-[0.4em] rounded-lg px-[0.3em] py-[0.1em] text-left ${sel === i ? "bg-[#fef3c7]" : "hover:bg-[#fef9c3]"}`}>
            <span className="w-[1.6em] text-center text-[1.2em]">{trip.icon}</span>
            <span className="w-[9.5em] shrink-0 text-[0.82em] font-bold text-[#3b2a14]">{trip.name}</span>
            <span className="relative h-[0.9em] flex-1 overflow-hidden rounded-full bg-[#e7e5e4]">
              <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(trip.kg / max) * 100}%`, background: trip.color, transition: "width 0.6s" }} />
            </span>
          </button>
        ))}
      </div>
      <p key={sel} className="cg-anim-fade mt-[0.4em] rounded-lg bg-[#f0fdf4] px-[0.7em] py-[0.3em] text-center text-[0.88em] font-bold text-[#14532d]">
        {t.kg === 0 ? `${t.name}: zero gás carbônico, e ainda faz bem à saúde!` : `${t.name}: cerca de ${t.kg.toLocaleString("pt-BR")} kg de gás carbônico por pessoa.`}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A ilha de calor: o asfalto × o parque
// ---------------------------------------------------------------------------

function HeatIslandArt() {
  const thermo = (x: number, level: number, color: string, label: string) => (
    <g transform={`translate(${x} 40)`}>
      <rect x="-8" y="0" width="16" height="90" rx="8" fill="#fff" stroke="#475569" strokeWidth="2" />
      <circle cy="98" r="13" fill={color} stroke="#475569" strokeWidth="2" />
      <rect x="-4" y={90 - level} width="8" height={level + 8} rx="4" fill={color} />
      <text y="-8" textAnchor="middle" fontSize="13" fontWeight="900" fill={color} fontFamily="Georgia, serif">
        {label}
      </text>
    </g>
  );
  return (
    <Art viewBox="0 0 560 220" label="De um lado, ruas de asfalto e prédios sem árvores, com o termômetro alto e o calor subindo; do outro, um parque com árvores e lago, com o termômetro mais baixo">
      <rect width="560" height="220" rx="14" fill="#fff7ed" />
      <line x1="280" y1="10" x2="280" y2="210" stroke="#d6d3d1" strokeWidth="2" strokeDasharray="6 5" />
      {/* o asfalto */}
      <rect x="10" y="170" width="262" height="40" fill="#44403c" />
      <Building x={30} y={170} w={60} h={110} color="#d6d3d1" />
      <Building x={100} y={170} w={50} h={80} color="#e7e5e4" />
      {[60, 130, 200].map((x, i) => (
        <path key={x} d={`M${x} 166 q6 -10 0 -20 q-6 -10 0 -20`} stroke="#f97316" strokeWidth="2.5" fill="none" opacity="0.7">
          <animateTransform attributeName="transform" type="translate" values="0 0;0 -20" dur="2s" begin={`${-i * 0.6}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0" dur="2s" begin={`${-i * 0.6}s`} repeatCount="indefinite" />
        </path>
      ))}
      {thermo(230, 78, "#dc2626", "mais quente")}
      {/* o parque */}
      <rect x="288" y="170" width="262" height="40" fill="#4ade80" />
      <ellipse cx="420" cy="186" rx="50" ry="12" fill="#38bdf8" />
      <Tree x={320} y={172} s={1.1} />
      <Tree x={380} y={172} s={0.9} color="#22c55e" />
      <Tree x={500} y={172} s={1.1} />
      {thermo(460, 40, "#0284c7", "mais fresco")}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O bairro com moradia digna
// ---------------------------------------------------------------------------

function NeighborhoodArt() {
  return (
    <Art viewBox="0 0 560 210" label="Um bairro com casas coloridas, uma praça com árvores e brinquedos, um ponto de ônibus, a calçada com rampa e as lixeiras da coleta seletiva">
      <rect width="560" height="210" rx="14" fill="#f0f9ff" />
      <rect y="170" width="560" height="40" fill="#a8a29e" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${30 + i * 64} 170)`}>
          <rect x="0" y="-60" width="54" height="60" fill={["#fecaca", "#fde68a", "#bbf7d0", "#bfdbfe"][i]} stroke="#475569" strokeWidth="1.5" />
          <path d="M-4 -60 L27 -84 L58 -60 Z" fill={["#b91c1c", "#a16207", "#15803d", "#1d4ed8"][i]} />
          <rect x="20" y="-28" width="14" height="28" fill="#78350f" />
          <rect x="6" y="-50" width="12" height="12" fill="#e0f2fe" />
        </g>
      ))}
      {/* a praça */}
      <rect x="300" y="150" width="140" height="20" fill="#86efac" />
      <Tree x={320} y={152} s={0.9} />
      <Tree x={420} y={152} s={0.8} color="#22c55e" />
      <g transform="translate(370 150)">
        <path d="M-16 0 L-16 -40 L16 -40 L16 0" stroke="#dc2626" strokeWidth="3" fill="none" />
        <g>
          <animateTransform attributeName="transform" type="rotate" values="-20 0 -40;20 0 -40;-20 0 -40" dur="2s" repeatCount="indefinite" />
          <path d="M0 -40 L0 -12 M-6 -12 L6 -12" stroke="#475569" strokeWidth="2" />
        </g>
      </g>
      {/* o ponto de ônibus e as lixeiras */}
      <g transform="translate(470 170)">
        <path d="M0 0 L0 -60 M-4 -60 L44 -60" stroke="#475569" strokeWidth="3" />
        <rect x="0" y="-60" width="44" height="8" fill="#fd9d24" />
        <text x="22" y="-30" textAnchor="middle" fontSize="18">
          🚏
        </text>
      </g>
      {["#2563eb", "#dc2626", "#16a34a", "#eab308"].map((c, i) => (
        <rect key={c} x={270 + i * 8} y="156" width="7" height="14" rx="1.5" fill={c} />
      ))}
      <text x="280" y="30" textAnchor="middle" fontSize="13" fontWeight="900" fill="#0c4a6e" fontFamily="Georgia, serif">
        moradia, praça, transporte e coleta para todos
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 9, content, bare });

export const chapter9: BookPage[] = [
  page(
    <ChapterOpener
      n={9}
      title="Cidades Sustentáveis"
      goals={["O que é uma cidade sustentável", "Como o transporte muda a poluição", "Por que as árvores refrescam a cidade", "Moradia digna e cidades para todos"]}
    >
      <Fig h={34}>
        <GreenCityOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🏙️">A cidade sustentável</H>
      <P>
        Hoje, mais da metade das pessoas do mundo vive em cidades. O <T>ODS 11</T> quer cidades <T>inclusivas</T>, <T>seguras</T> e <T>verdes</T>: com transporte
        público, ciclovias, parques, coleta seletiva e moradia digna para todos.
      </P>
      <Cards
        items={[
          { icon: "🚌", title: "Transporte coletivo", text: "Um ônibus cheio tira dezenas de carros das ruas." },
          { icon: "🚲", title: "Ciclovias", text: "Pedalar com segurança é bom para a saúde e para o ar." },
          { icon: "🌳", title: "Áreas verdes", text: "Parques e praças refrescam e ajudam a chuva a infiltrar." },
          { icon: "♻️", title: "Coleta seletiva", text: "O lixo reciclável volta a ser matéria-prima." },
        ]}
      />
      <Box kind="sabia">No Brasil, cerca de 85% das pessoas vivem em cidades.</Box>
    </>,
  ),

  page(
    <>
      <H icon="🚌">O transporte e o ar da cidade</H>
      <P>
        Ir a pé, de bicicleta ou de ônibus, em vez de ir sozinho de carro, diminui a <T>poluição do ar</T>, o trânsito e os gases de efeito estufa. Compare o gás
        carbônico de cada jeito de ir para a escola:
      </P>
      <TransportCompare />
      <P>Os valores são aproximados, só para comparar: dividir o carro ou usar o transporte coletivo já ajuda muito.</P>
    </>,
  ),

  page(
    <>
      <H icon="🌡️">As ilhas de calor</H>
      <P>
        O asfalto e o concreto guardam o calor do Sol, e por isso os bairros sem árvores ficam mais quentes: são as <T>ilhas de calor</T>. As árvores fazem sombra e
        soltam umidade, refrescando o ar.
      </P>
      <Fig n="9.1" caption="O parque é mais fresco que a rua de asfalto." h={22}>
        <HeatIslandArt />
      </Fig>
      <Box kind="lembre">
        O chão todo coberto de asfalto também não deixa a chuva entrar na terra, e a água corre para as ruas: é uma das causas das <strong>enchentes</strong>.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🏘️">Cidades para todos</H>
      <P>
        Uma cidade sustentável também é justa: todas as pessoas devem ter <T>moradia digna</T>, com água, esgoto, luz, transporte e segurança. As calçadas precisam de
        rampas, e as praças, de lugar para todo mundo brincar.
      </P>
      <Fig n="9.2" caption="O bairro com tudo de que as pessoas precisam." h={21}>
        <NeighborhoodArt />
      </Fig>
      <Box kind="experimente">Desenhe um mapa do seu bairro. O que já existe? O que faria dele um bairro mais sustentável?</Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "O ODS 11 quer cidades inclusivas, seguras e verdes.",
          "Transporte coletivo, ciclovias, parques e coleta seletiva fazem parte de uma cidade sustentável.",
          "Ir a pé, de bicicleta ou de ônibus polui muito menos que ir sozinho de carro.",
          "Bairros sem árvores viram ilhas de calor; o asfalto também piora as enchentes.",
          "Toda pessoa tem direito a moradia digna, com água, esgoto, luz e transporte.",
        ]}
      />
      <Glossary
        items={[
          ["Cidade sustentável", "Cidade inclusiva, segura e verde."],
          ["Transporte coletivo", "Ônibus, metrô e trem, que levam muita gente."],
          ["Ilha de calor", "Área da cidade mais quente por causa do asfalto e do concreto."],
          ["Moradia digna", "Casa segura, com água, esgoto, luz e acesso a serviços."],
          ["Ciclovia", "Pista separada para bicicletas."],
        ]}
      />
      <Quiz
        items={[
          ["O que é uma cidade sustentável?", "Uma cidade inclusiva, segura e verde, com transporte público, áreas verdes e moradia digna."],
          ["Por que ir de ônibus ou de bicicleta ajuda o planeta?", "Diminui a poluição do ar, o trânsito e os gases de efeito estufa."],
          ["O que é uma ilha de calor?", "Uma área da cidade mais quente por causa do asfalto e da falta de árvores."],
          ["Qual é o número do ODS das cidades sustentáveis?", "O ODS 11."],
        ]}
      />
    </>,
  ),
];
