"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { GEO, GEO_DARK, GlobeLines, Panel, Pill, Slider } from "./art";

// ============================================================================
// CAPÍTULO 2 — COORDENADAS E FUSOS HORÁRIOS (missão "Geografia: Mapas e
// Orientação", a parte das coordenadas): o globo girando com os satélites do
// GPS, o Equador e o Meridiano de Greenwich, o mapa das coordenadas (de
// tocar), as zonas térmicas e o relógio dos fusos horários (de tocar).
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o globo e os satélites do GPS
// ---------------------------------------------------------------------------

function GpsOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="O globo terrestre girando com a linha do Equador em vermelho e o Meridiano de Greenwich em amarelo, e três satélites de GPS em órbita mandando sinais para um celular">
      <rect width="460" height="300" fill="#0f172a" />
      {Array.from({ length: 30 }, (_, i) => (
        <circle key={i} cx={(i * 97) % 460} cy={(i * 53) % 300} r={(i % 3) * 0.6 + 0.6} fill="#fff" opacity="0.7" />
      ))}
      <GlobeLines x={230} y={160} r={90} />
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <animateTransform attributeName="transform" type="rotate" from={`${k * 120} 230 160`} to={`${k * 120 + 360} 230 160`} dur="16s" repeatCount="indefinite" />
          <g transform="translate(230 30)">
            <rect x="-8" y="-6" width="16" height="12" fill="#cbd5e1" stroke="#475569" />
            <rect x="-26" y="-4" width="16" height="8" fill="#38bdf8" />
            <rect x="10" y="-4" width="16" height="8" fill="#38bdf8" />
            <circle r="30" fill="none" stroke="#facc15" strokeWidth="1.5" opacity="0.6">
              <animate attributeName="r" values="6;36" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </g>
        </g>
      ))}
      <g transform="translate(262 210)">
        <rect x="-8" y="-14" width="16" height="26" rx="3" fill="#1e293b" stroke="#fff" strokeWidth="1.5" />
        <circle cy="-2" r="4" fill="#ef4444" />
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O Equador, Greenwich e os hemisférios
// ---------------------------------------------------------------------------

function HemispheresArt() {
  return (
    <Art viewBox="0 0 560 220" label="O globo com o Equador dividindo o Hemisfério Norte e o Hemisfério Sul, e o Meridiano de Greenwich dividindo o Hemisfério Oeste e o Hemisfério Leste">
      <rect width="560" height="220" rx="14" fill="#e0f2fe" />
      <GlobeLines x={320} y={112} r={92} turn={false} />
      <text x="120" y="60" textAnchor="middle" fontSize="15" fontWeight="900" fill={GEO_DARK} fontFamily="Georgia, serif">
        Hemisfério Norte
      </text>
      <text x="120" y="172" textAnchor="middle" fontSize="15" fontWeight="900" fill={GEO_DARK} fontFamily="Georgia, serif">
        Hemisfério Sul
      </text>
      <path d="M226 112 H180" stroke="#dc2626" strokeWidth="3" />
      <text x="70" y="117" fontSize="14" fontWeight="900" fill="#dc2626" fontFamily="Georgia, serif">
        Equador (0°)
      </text>
      <text x="420" y="34" fontSize="14" fontWeight="900" fill="#a16207" fontFamily="Georgia, serif">
        Greenwich (0°)
      </text>
      <path d="M416 30 Q370 22 330 26" fill="none" stroke="#a16207" strokeWidth="2" />
      <text x="424" y="200" fontSize="13" fontWeight="700" fill={GEO_DARK} fontFamily="Georgia, serif">
        ← Oeste | Leste →
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O mapa das coordenadas (de tocar)
// ---------------------------------------------------------------------------

const PLACES = [
  { name: "Brasília", lat: -16, lon: -48 },
  { name: "Londres", lat: 51, lon: 0 },
  { name: "Nova York", lat: 41, lon: -74 },
  { name: "Tóquio", lat: 36, lon: 140 },
  { name: "Cidade do Cabo", lat: -34, lon: 18 },
];

const toX = (lon: number) => 20 + ((lon + 180) / 360) * 360;
const toY = (lat: number) => 20 + ((90 - lat) / 180) * 180;

function degrees(v: number, pos: string, neg: string) {
  if (v === 0) return "0°";
  return `${Math.abs(v)}° ${v > 0 ? pos : neg}`;
}

export function CoordinateMap() {
  const [lat, setLat] = useState(-16);
  const [lon, setLon] = useState(-48);
  const place = PLACES.find((p) => p.lat === lat && p.lon === lon);
  return (
    <Panel title="Mova o ponto pelas coordenadas">
      <svg viewBox="0 0 400 220" className="w-full" role="img" aria-label="Um mapa-múndi com a grade de latitude e longitude e um ponto vermelho nas coordenadas escolhidas">
        <rect x="20" y="20" width="360" height="180" fill="#bae6fd" stroke={GEO_DARK} />
        <g fill="#86efac" stroke="#15803d" strokeWidth="0.8">
          <path d="M60 50 Q100 30 140 50 Q150 80 120 100 Q100 104 92 120 Q70 100 60 70 Z" />
          <path d="M110 120 Q130 112 140 126 Q138 160 122 186 Q110 160 106 136 Z" transform="translate(-5 -24) scale(1.2)" />
          <path d="M190 46 Q215 36 238 46 Q230 64 210 70 Q196 62 190 46 Z" />
          <path d="M196 80 Q226 76 236 96 Q232 128 214 158 Q200 130 196 106 Z" />
          <path d="M240 40 Q300 30 350 48 Q340 80 300 90 Q260 84 244 70 Z" />
          <path d="M320 140 Q345 132 356 146 Q346 162 324 158 Z" />
        </g>
        {[-60, -30, 30, 60].map((l) => (
          <line key={`a${l}`} x1="20" x2="380" y1={toY(l)} y2={toY(l)} stroke="#fff" strokeDasharray="3 3" />
        ))}
        {[-120, -60, 60, 120].map((l) => (
          <line key={`o${l}`} y1="20" y2="200" x1={toX(l)} x2={toX(l)} stroke="#fff" strokeDasharray="3 3" />
        ))}
        <line x1="20" x2="380" y1={toY(0)} y2={toY(0)} stroke="#dc2626" strokeWidth="2" />
        <line y1="20" y2="200" x1={toX(0)} x2={toX(0)} stroke="#ca8a04" strokeWidth="2" />
        <line x1="20" x2="380" y1={toY(lat)} y2={toY(lat)} stroke={GEO_DARK} strokeWidth="1" opacity="0.5" />
        <line y1="20" y2="200" x1={toX(lon)} x2={toX(lon)} stroke={GEO_DARK} strokeWidth="1" opacity="0.5" />
        <circle cx={toX(lon)} cy={toY(lat)} r="6" fill="#dc2626" stroke="#fff" strokeWidth="2" />
        <circle cx={toX(lon)} cy={toY(lat)} r="6" fill="none" stroke="#dc2626">
          <animate attributeName="r" values="6;16" dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0" dur="1.2s" repeatCount="indefinite" />
        </circle>
      </svg>
      <Slider label="Latitude" value={lat} min={-80} max={80} onChange={setLat} format={(v) => degrees(v, "N", "S")} />
      <Slider label="Longitude" value={lon} min={-170} max={170} onChange={setLon} format={(v) => degrees(v, "L", "O")} />
      <div className="mt-[0.3em] flex flex-wrap justify-center gap-[0.3em]">
        {PLACES.map((p) => (
          <Pill
            key={p.name}
            on={place?.name === p.name}
            onClick={() => {
              setLat(p.lat);
              setLon(p.lon);
            }}
          >
            {p.name}
          </Pill>
        ))}
      </div>
      <p className="mt-[0.2em] text-center text-[0.82em] text-[#5b4a2e]">
        Hemisfério {lat >= 0 ? "Norte" : "Sul"} e {lon >= 0 ? "Leste" : "Oeste"}
        {place ? `: ${place.name}` : ""}
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As zonas térmicas
// ---------------------------------------------------------------------------

function ZonesArt() {
  const bands = [
    { y: -88, h: 22, color: "#bfdbfe", name: "Zona polar ártica" },
    { y: -66, h: 34, color: "#bbf7d0", name: "Zona temperada do norte" },
    { y: -32, h: 64, color: "#fde68a", name: "Zona tropical" },
    { y: 32, h: 34, color: "#bbf7d0", name: "Zona temperada do sul" },
    { y: 66, h: 22, color: "#bfdbfe", name: "Zona polar antártica" },
  ];
  return (
    <Art viewBox="0 0 560 210" label="O globo pintado em faixas: as zonas polares nas pontas, as temperadas no meio e a zona tropical, entre os trópicos de Câncer e de Capricórnio, recebendo os raios do Sol mais diretos">
      <rect width="560" height="210" rx="14" fill="#fffaf0" />
      <defs>
        <clipPath id="geo-zones">
          <circle cx="170" cy="105" r="88" />
        </clipPath>
      </defs>
      <g clipPath="url(#geo-zones)">
        {bands.map((b) => (
          <rect key={b.name} x="80" y={105 + b.y} width="180" height={b.h} fill={b.color} />
        ))}
      </g>
      <circle cx="170" cy="105" r="88" fill="none" stroke={GEO_DARK} strokeWidth="2" />
      <line x1="82" x2="258" y1="105" y2="105" stroke="#dc2626" strokeWidth="2" />
      {[-32, 32].map((d) => (
        <line key={d} x1="88" x2="252" y1={105 + d} y2={105 + d} stroke="#ca8a04" strokeWidth="1.5" strokeDasharray="5 3" />
      ))}
      {[0, 1, 2].map((k) => (
        <line key={k} x1="10" y1={90 + k * 15} x2="70" y2={90 + k * 15} stroke="#f59e0b" strokeWidth="3" strokeDasharray="10 6">
          <animate attributeName="stroke-dashoffset" values="32;0" dur="0.8s" repeatCount="indefinite" />
        </line>
      ))}
      {bands.map((b, i) => (
        <text key={b.name} x="290" y={34 + i * 36} fontSize="14" fontWeight="700" fill="#3b2a14" fontFamily="Georgia, serif">
          <tspan fill={b.color === "#fde68a" ? "#b45309" : b.color === "#bbf7d0" ? "#15803d" : "#1d4ed8"}>■</tspan> {b.name}
        </text>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O relógio dos fusos horários (de tocar)
// ---------------------------------------------------------------------------

const ZONES = [
  { name: "Brasília", offset: -3 },
  { name: "Manaus", offset: -4 },
  { name: "Londres", offset: 0 },
  { name: "Paris", offset: 1 },
  { name: "Tóquio", offset: 9 },
  { name: "Nova York", offset: -5 },
];

function Clock({ hour, name }: { hour: number; name: string }) {
  const h = ((hour % 24) + 24) % 24;
  const day = h >= 6 && h < 18;
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="-34 -34 68 68" className="w-[3.4em]" aria-hidden="true">
        <circle r="30" fill={day ? "#fef9c3" : "#1e293b"} stroke={GEO_DARK} strokeWidth="3" />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} y1="-26" y2="-22" stroke={day ? GEO_DARK : "#cbd5e1"} strokeWidth="2" transform={`rotate(${i * 30})`} />
        ))}
        <line y2="-16" stroke={day ? "#b91c1c" : "#fca5a5"} strokeWidth="4" strokeLinecap="round" transform={`rotate(${(h % 12) * 30})`} />
        <circle r="3" fill={day ? GEO_DARK : "#fff"} />
      </svg>
      <span className="text-[0.72em] font-bold text-[#3b2a14]">{name}</span>
      <span className="text-[0.8em] font-black tabular-nums" style={{ color: GEO_DARK }}>
        {String(h).padStart(2, "0")}h {day ? "☀️" : "🌙"}
      </span>
    </div>
  );
}

export function TimeZones() {
  const [hour, setHour] = useState(12);
  return (
    <Panel title="Que horas são em cada lugar?">
      <Slider label="Em Brasília" value={hour} min={0} max={23} onChange={setHour} format={(v) => `${String(v).padStart(2, "0")}h`} />
      <div className="mt-[0.4em] grid grid-cols-6 gap-[0.2em]">
        {ZONES.map((z) => (
          <Clock key={z.name} name={z.name} hour={hour + 3 + z.offset} />
        ))}
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 2, content, bare });

export const chapter2: BookPage[] = [
  page(
    <ChapterOpener n={2} title="Coordenadas e Fusos Horários" goals={["O Equador, Greenwich e os hemisférios", "Latitude e longitude", "Os trópicos e as zonas térmicas", "O GPS e os fusos horários"]}>
      <Fig h={34}>
        <GpsOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🌐">As linhas imaginárias</H>
      <P>
        Para localizar qualquer ponto da Terra, os geógrafos traçaram <T>linhas imaginárias</T>. A <T>Linha do Equador</T> fica à mesma distância dos dois polos e
        divide a Terra nos hemisférios <T>Norte</T> e <T>Sul</T>. O <T>Meridiano de Greenwich</T>, que passa por Londres, divide os hemisférios <T>Leste</T> e{" "}
        <T>Oeste</T>.
      </P>
      <Fig n="2.1" caption="O Equador (vermelho) e o Meridiano de Greenwich (amarelo)." h={24}>
        <HemispheresArt />
      </Fig>
      <Box kind="sabia">
        O Brasil fica quase todo no Hemisfério Sul e todo no Hemisfério Oeste. O Equador passa por Macapá, onde existe um monumento, o Marco Zero.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="📍">Latitude e longitude</H>
      <P>
        Os <T>paralelos</T> são linhas paralelas ao Equador, e a <T>latitude</T> diz a distância até ele, de 0° a 90° norte ou sul. Os <T>meridianos</T> vão de um
        polo ao outro, e a <T>longitude</T> diz a distância até Greenwich, de 0° a 180° leste ou oeste. Juntas, elas são as <T>coordenadas geográficas</T>.
      </P>
      <CoordinateMap />
    </>,
  ),

  page(
    <>
      <H icon="🔆">Os trópicos e as zonas térmicas</H>
      <P>
        O <T>Trópico de Câncer</T> (norte) e o <T>Trópico de Capricórnio</T> (sul) limitam a <T>zona tropical</T>, onde os raios do Sol chegam mais diretos e faz
        mais calor. Mais longe do Equador ficam as zonas <T>temperadas</T> e, nas pontas, as <T>polares</T>.
      </P>
      <Fig n="2.2" caption="As zonas térmicas da Terra." h={22}>
        <ZonesArt />
      </Fig>
      <Box kind="lembre">
        O Trópico de Capricórnio passa perto da cidade de São Paulo. A maior parte do Brasil fica entre ele e o Equador, na zona tropical.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🕐">O GPS e os fusos horários</H>
      <P>
        O <T>GPS</T> recebe os sinais de vários satélites e, pela distância até cada um, calcula as coordenadas do aparelho. Como a Terra gira 360° em 24 horas, ela foi
        dividida em <T>24 fusos horários</T> de 15° cada: para o leste as horas são adiantadas; para o oeste, atrasadas.
      </P>
      <TimeZones />
      <Cards
        items={[
          { icon: "⏰", title: "4 fusos no Brasil", text: "Fernando de Noronha, Brasília, Manaus e o Acre." },
          { icon: "➕", title: "Para o leste", text: "Soma horas: em Londres são 3 a mais que em Brasília." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "O Equador divide a Terra em Norte e Sul; Greenwich divide em Leste e Oeste.",
          "Latitude é a distância até o Equador; longitude é a distância até Greenwich.",
          "Os trópicos de Câncer e de Capricórnio limitam a zona tropical, a mais quente.",
          "O GPS usa satélites para descobrir as coordenadas de um aparelho.",
          "A Terra tem 24 fusos de 15°; o Brasil tem 4 fusos horários.",
        ]}
      />
      <Glossary
        items={[
          ["Paralelo", "Linha imaginária paralela ao Equador."],
          ["Meridiano", "Linha imaginária que vai de um polo ao outro."],
          ["Latitude", "A distância de um lugar até o Equador, em graus."],
          ["Longitude", "A distância de um lugar até Greenwich, em graus."],
          ["Fuso horário", "Faixa da Terra que tem a mesma hora."],
        ]}
      />
      <Quiz
        items={[
          ["Qual linha imaginária divide a Terra em Norte e Sul?", "A Linha do Equador."],
          ["A longitude é medida a partir de qual linha?", "Do Meridiano de Greenwich."],
          ["Se é meio-dia em Brasília, que horas são em Londres?", "15h (3 horas a mais)."],
          ["Quantos fusos horários tem o Brasil?", "Quatro."],
        ]}
      />
    </>,
  ),
];
