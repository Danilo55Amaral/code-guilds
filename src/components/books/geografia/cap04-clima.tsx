"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { ChoiceGame } from "../portugues/art";
import { Cloud, Kid } from "../ods/art";
import { GEO, GEO_DARK, Mountain, Panel, Pill, Slider } from "./art";

// ============================================================================
// CAPÍTULO 4 — TEMPO E CLIMA (missão "Geografia: Relevo, Clima e Águas", a
// parte do clima): o céu com Sol, chuva e arco-íris, o jogo "tempo ou
// clima?", o termômetro da altitude (de tocar), os climogramas dos climas do
// Brasil (de tocar) e os três tipos de chuva.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: Sol, chuva e arco-íris
// ---------------------------------------------------------------------------

function WeatherOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Um céu com Sol de um lado e nuvem de chuva do outro, um arco-íris no meio e uma estação meteorológica com cata-vento girando">
      <rect width="460" height="300" fill="#bae6fd" />
      {["#ef4444", "#f97316", "#facc15", "#22c55e", "#3b82f6", "#8b5cf6"].map((c, i) => (
        <path key={c} d={`M${90 + i * 10} 230 A${140 - i * 10} ${140 - i * 10} 0 0 1 ${370 - i * 10} 230`} fill="none" stroke={c} strokeWidth="10" opacity="0.8" />
      ))}
      <g transform="translate(90 70)">
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="20s" repeatCount="indefinite" />
          {Array.from({ length: 10 }, (_, i) => (
            <line key={i} y1="-38" y2="-50" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" transform={`rotate(${i * 36})`} />
          ))}
        </g>
        <circle r="30" fill="#fde047" stroke="#f59e0b" strokeWidth="3" />
      </g>
      <Cloud x={360} y={70} s={1.4} color="#94a3b8" />
      {Array.from({ length: 6 }, (_, i) => (
        <line key={i} x1={330 + i * 12} x2={326 + i * 12} y1="96" y2="108" stroke="#2563eb" strokeWidth="3">
          <animate attributeName="y1" values="96;170" dur="1s" begin={`${-i * 0.17}s`} repeatCount="indefinite" />
          <animate attributeName="y2" values="108;182" dur="1s" begin={`${-i * 0.17}s`} repeatCount="indefinite" />
        </line>
      ))}
      <rect y="230" width="460" height="70" fill="#86efac" />
      <g transform="translate(230 280)">
        <rect x="-3" y="-80" width="6" height="80" fill="#475569" />
        <g transform="translate(0 -80)">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1.4s" repeatCount="indefinite" additive="sum" />
          {[0, 120, 240].map((a) => (
            <g key={a} transform={`rotate(${a})`}>
              <line y2="-18" stroke="#475569" strokeWidth="2" />
              <circle cy="-20" r="5" fill="#f97316" />
            </g>
          ))}
        </g>
        <rect x="-26" y="-40" width="18" height="22" fill="#fff" stroke="#475569" />
        <text x="-17" y="-24" textAnchor="middle" fontSize="12">🌡️</text>
      </g>
      <Kid x={150} y={286} s={1.2} shirt={GEO} />
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O jogo "tempo ou clima?"
// ---------------------------------------------------------------------------

const WEATHER_GAME = [
  { prompt: "“Hoje vai chover à tarde em São Paulo.”", options: ["Tempo", "Clima"], answer: 0, explain: "É o estado da atmosfera num momento: tempo." },
  { prompt: "“No Nordeste, o sertão tem poucas chuvas o ano inteiro.”", options: ["Tempo", "Clima"], answer: 1, explain: "É um padrão de muitos anos: clima (o semiárido)." },
  { prompt: "“Agora está fazendo 32 °C em Manaus.”", options: ["Tempo", "Clima"], answer: 0, explain: "Uma temperatura de agora é tempo." },
  { prompt: "“No Sul os invernos são frios e às vezes neva na serra.”", options: ["Tempo", "Clima"], answer: 1, explain: "É como costuma ser todo ano: clima (o subtropical)." },
  { prompt: "“Amanhã vai ventar forte no litoral.”", options: ["Tempo", "Clima"], answer: 0, explain: "Uma previsão para amanhã é sobre o tempo." },
];

// ---------------------------------------------------------------------------
// O termômetro da altitude (de tocar)
// ---------------------------------------------------------------------------

export function AltitudeThermometer() {
  const [alt, setAlt] = useState(0);
  const temp = Math.round((30 - alt * 0.006) * 10) / 10;
  const y = 150 - (alt / 3000) * 120;
  return (
    <Panel title="Suba a montanha e veja a temperatura">
      <div className="flex items-center gap-[0.6em]">
        <svg viewBox="0 0 260 170" className="w-[70%] shrink-0" role="img" aria-label={`Uma pessoa a ${alt} metros de altitude, com ${temp} graus`}>
          <rect width="260" height="170" rx="10" fill={temp < 15 ? "#dbeafe" : "#e0f2fe"} />
          <Mountain x={130} y={160} w={240} h={140} color="#78716c" />
          <rect y="158" width="260" height="12" fill="#86efac" />
          <g transform={`translate(${130 - ((150 - y) / 140) * 30} ${y + 8})`}>
            <Kid x={0} y={0} s={0.5} shirt="#dc2626" />
          </g>
          {[0, 1000, 2000, 3000].map((m) => (
            <text key={m} x="6" y={154 - (m / 3000) * 120} fontSize="10" fontWeight="700" fill="#334155">
              {m} m
            </text>
          ))}
        </svg>
        <div className="flex flex-1 flex-col items-center">
          <svg viewBox="0 0 40 140" className="h-[7em]" aria-hidden="true">
            <rect x="14" y="6" width="12" height="110" rx="6" fill="#fff" stroke="#475569" strokeWidth="2" />
            <rect x="17" y={110 - (temp / 32) * 100} width="6" height={(temp / 32) * 100 + 6} fill="#ef4444" style={{ transition: "all 0.3s" }} />
            <circle cx="20" cy="124" r="11" fill="#ef4444" stroke="#475569" strokeWidth="2" />
          </svg>
          <p className="text-[1.3em] font-black tabular-nums" style={{ color: temp < 15 ? "#1d4ed8" : "#b91c1c" }}>
            {temp.toLocaleString("pt-BR")} °C
          </p>
        </div>
      </div>
      <Slider label="Altitude" value={alt} min={0} max={3000} step={100} onChange={setAlt} suffix=" m" />
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Os climogramas do Brasil (de tocar)
// ---------------------------------------------------------------------------

const CLIMATES = {
  Equatorial: {
    where: "Amazônia",
    rain: [260, 290, 330, 300, 250, 110, 80, 60, 80, 120, 180, 220],
    temp: [26, 26, 26, 26, 27, 27, 27, 28, 28, 28, 27, 27],
    text: "Quente e úmido o ano todo, com muita chuva e pouca diferença de temperatura entre os meses.",
  },
  Tropical: {
    where: "Centro-Oeste e Sudeste",
    rain: [250, 210, 200, 110, 50, 20, 15, 20, 60, 140, 200, 240],
    temp: [26, 26, 26, 25, 23, 21, 21, 23, 25, 26, 26, 26],
    text: "Duas estações bem marcadas: verão quente e chuvoso e inverno ameno e seco.",
  },
  Semiárido: {
    where: "Sertão do Nordeste",
    rain: [60, 90, 120, 100, 40, 15, 10, 5, 5, 10, 20, 40],
    temp: [28, 28, 27, 27, 26, 25, 25, 26, 27, 28, 28, 28],
    text: "Quente e seco, com chuvas poucas e irregulares, concentradas em poucos meses.",
  },
  Subtropical: {
    where: "Sul",
    rain: [140, 130, 120, 110, 110, 120, 130, 120, 140, 150, 120, 130],
    temp: [24, 24, 22, 19, 16, 13, 13, 14, 16, 19, 21, 23],
    text: "Chuvas bem distribuídas o ano todo e as quatro estações marcadas, com inverno frio.",
  },
};

const MONTHS = "JFMAMJJASOND";

export function Climograph() {
  const [name, setName] = useState<keyof typeof CLIMATES>("Equatorial");
  const c = CLIMATES[name];
  return (
    <Panel title="Climograma: chuva (barras) e temperatura (linha)">
      <div className="mb-[0.3em] flex flex-wrap justify-center gap-[0.3em]">
        {(Object.keys(CLIMATES) as (keyof typeof CLIMATES)[]).map((k) => (
          <Pill key={k} on={name === k} onClick={() => setName(k)}>
            {k}
          </Pill>
        ))}
      </div>
      <svg viewBox="0 0 400 150" className="w-full" role="img" aria-label={`O climograma do clima ${name}`}>
        <rect width="400" height="150" rx="8" fill="#fff" />
        <line x1="30" y1="126" x2="390" y2="126" stroke="#94a3b8" />
        {c.rain.map((r, i) => (
          <rect key={i} x={36 + i * 29.5} y={126 - r * 0.33} width="20" height={r * 0.33} fill="#60a5fa" style={{ transition: "all 0.4s" }} />
        ))}
        <polyline
          points={c.temp.map((t, i) => `${46 + i * 29.5},${126 - t * 3.6}`).join(" ")}
          fill="none"
          stroke="#dc2626"
          strokeWidth="3"
          style={{ transition: "all 0.4s" }}
        />
        {MONTHS.split("").map((m, i) => (
          <text key={i} x={46 + i * 29.5} y="142" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569">
            {m}
          </text>
        ))}
        <text x="6" y="20" fontSize="10" fill="#1d4ed8" fontWeight="700">
          mm
        </text>
        <text x="370" y="20" fontSize="10" fill="#dc2626" fontWeight="700">
          °C
        </text>
      </svg>
      <p key={name} className="cg-anim-fade mt-[0.2em] text-[0.86em] leading-snug">
        <strong style={{ color: GEO_DARK }}>{c.where}:</strong> {c.text}
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Os tipos de chuva
// ---------------------------------------------------------------------------

function RainTypesArt() {
  return (
    <Art viewBox="0 0 560 170" label="Três quadros: na chuva de convecção o ar quente sobe e vira nuvem; na orográfica o vento sobe a serra e chove; na frontal o ar frio empurra o ar quente para cima">
      <rect width="560" height="170" rx="14" fill="#fffaf0" />
      {[
        { x: 10, title: "Convecção" },
        { x: 196, title: "Orográfica (de relevo)" },
        { x: 382, title: "Frontal" },
      ].map((b) => (
        <g key={b.title}>
          <rect x={b.x} y="10" width="168" height="150" rx="10" fill="#e0f2fe" stroke="#94a3b8" />
          <text x={b.x + 84} y="154" textAnchor="middle" fontSize="12" fontWeight="900" fill={GEO_DARK} fontFamily="Georgia, serif">
            {b.title}
          </text>
        </g>
      ))}
      {/* convecção: o ar quente sobe */}
      <rect x="10" y="120" width="168" height="20" fill="#86efac" />
      {[0, 1].map((k) => (
        <path key={k} d="M74 116 q-8 -10 0 -20 q8 -10 0 -20" fill="none" stroke="#f97316" strokeWidth="3" transform={`translate(${k * 40} 0)`}>
          <animateTransform attributeName="transform" type="translate" values={`${k * 40} 10;${k * 40} -20`} dur="2s" begin={`${-k}s`} repeatCount="indefinite" />
        </path>
      ))}
      <Cloud x={94} y={36} s={0.8} color="#94a3b8" />
      {/* orográfica: a serra */}
      <Mountain x={300} y={140} w={110} h={80} color="#a16207" snow={false} />
      <path d="M206 128 Q250 120 280 80" fill="none" stroke="#38bdf8" strokeWidth="3" strokeDasharray="6 4">
        <animate attributeName="stroke-dashoffset" values="20;0" dur="0.8s" repeatCount="indefinite" />
      </path>
      <Cloud x={270} y={44} s={0.7} color="#94a3b8" />
      {[0, 1, 2].map((k) => (
        <line key={k} x1={256 + k * 12} x2={254 + k * 12} y1="58" y2="66" stroke="#2563eb" strokeWidth="2">
          <animate attributeName="y1" values="58;96" dur="0.9s" begin={`${-k * 0.3}s`} repeatCount="indefinite" />
          <animate attributeName="y2" values="66;104" dur="0.9s" begin={`${-k * 0.3}s`} repeatCount="indefinite" />
        </line>
      ))}
      {/* frontal: o ar frio empurra o quente */}
      <path d="M392 140 Q450 140 500 70 L540 70 L540 140 Z" fill="#bfdbfe" opacity="0.9">
        <animateTransform attributeName="transform" type="translate" values="-10 0;6 0;-10 0" dur="3s" repeatCount="indefinite" />
      </path>
      <text x="520" y="120" textAnchor="middle" fontSize="11" fontWeight="900" fill="#1d4ed8">frio</text>
      <text x="420" y="120" textAnchor="middle" fontSize="11" fontWeight="900" fill="#c2410c">quente</text>
      <Cloud x={470} y={40} s={0.7} color="#94a3b8" />
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 4, content, bare });

export const chapter4: BookPage[] = [
  page(
    <ChapterOpener n={4} title="Tempo e Clima" goals={["A diferença entre tempo e clima", "Os fatores que mudam o clima", "Os climas do Brasil e os climogramas", "Os tipos de chuva e a previsão do tempo"]}>
      <Fig h={34}>
        <WeatherOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🌦️">Tempo ou clima?</H>
      <P>
        O <T>tempo</T> é o estado da atmosfera num momento: se está chovendo, ventando ou fazendo calor agora. O <T>clima</T> é o padrão do tempo de um lugar
        observado durante muitos anos (pelo menos 30). Treine:
      </P>
      <ChoiceGame items={WEATHER_GAME} color={GEO} title="É tempo ou clima?" />
      <Box kind="mago" title="Um jeito de lembrar">
        Tempo é o que você veste <strong>hoje</strong>. Clima é o que tem no seu <strong>guarda-roupa</strong>: as roupas que fazem sentido para o lugar onde você mora.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🌡️">Os fatores do clima</H>
      <P>
        O clima depende de vários <T>fatores</T>: a <T>latitude</T> (perto do Equador é mais quente), a <T>altitude</T> (quanto mais alto, mais frio), a distância do{" "}
        <T>mar</T> (que deixa a temperatura mais estável), as <T>massas de ar</T> e a <T>vegetação</T>. Suba a montanha:
      </P>
      <AltitudeThermometer />
      <Box kind="sabia">
        A temperatura cai cerca de 0,6 °C a cada 100 metros de subida. Por isso Campos do Jordão, a 1.600 m, é bem mais fria que o litoral de São Paulo.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="📊">Os climas do Brasil</H>
      <P>
        Por ser enorme e ficar quase todo na zona tropical, o Brasil tem vários climas. Um <T>climograma</T> mostra a chuva de cada mês (as barras) e a temperatura
        (a linha). Compare:
      </P>
      <Climograph />
      <Box kind="lembre">
        Os climas mais comuns no Brasil são o equatorial, o tropical, o semiárido, o subtropical e o tropical de altitude, nas serras do Sudeste.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="☔">As chuvas e a previsão do tempo</H>
      <P>
        A chuva acontece quando o ar úmido sobe, esfria e o vapor vira gotinhas. Existem três jeitos de o ar subir: aquecido pelo chão (<T>convecção</T>), empurrado por
        uma serra (<T>orográfica</T>) ou por uma frente fria (<T>frontal</T>).
      </P>
      <Fig n="4.1" caption="Os três tipos de chuva." h={18}>
        <RainTypesArt />
      </Fig>
      <Cards
        items={[
          { icon: "🌡️", title: "Termômetro", text: "Mede a temperatura do ar." },
          { icon: "🌧️", title: "Pluviômetro", text: "Mede quantos milímetros de chuva caíram." },
          { icon: "🌬️", title: "Anemômetro", text: "Mede a velocidade do vento." },
          { icon: "🛰️", title: "Satélites", text: "Fotografam as nuvens para a previsão do tempo." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Tempo é a atmosfera agora; clima é o padrão de muitos anos.",
          "Latitude, altitude, mar, massas de ar e vegetação influenciam o clima.",
          "A temperatura cai cerca de 0,6 °C a cada 100 m de altitude.",
          "O Brasil tem climas equatorial, tropical, semiárido, subtropical e de altitude.",
          "As chuvas podem ser de convecção, orográficas ou frontais.",
        ]}
      />
      <Glossary
        items={[
          ["Tempo", "O estado da atmosfera num momento."],
          ["Clima", "O padrão do tempo num lugar ao longo de muitos anos."],
          ["Massa de ar", "Grande porção de ar com a mesma temperatura e umidade."],
          ["Climograma", "Gráfico com a chuva e a temperatura de cada mês."],
          ["Meteorologia", "A ciência que estuda o tempo e faz as previsões."],
        ]}
      />
      <Quiz
        items={[
          ["“Hoje à tarde vai chover” fala de tempo ou de clima?", "De tempo."],
          ["O que acontece com a temperatura quando subimos uma montanha?", "Ela cai, cerca de 0,6 °C a cada 100 m."],
          ["Qual é o clima do sertão nordestino?", "O semiárido, quente e com poucas chuvas."],
          ["Qual instrumento mede a quantidade de chuva?", "O pluviômetro."],
        ]}
      />
    </>,
  ),
];
