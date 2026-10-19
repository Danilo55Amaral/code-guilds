"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Car, Person } from "./art";

// ============================================================================
// CAPÍTULO 1 — MOVIMENTO E VELOCIDADE (missão "Física: Movimento e
// Velocidade"): o carro na estrada com o velocímetro, o ônibus e o
// referencial (parado pra quem está dentro, andando pra quem está na
// calçada), a calculadora de velocidade média de mexer, as conversões de
// unidade e o diagrama do carro andando constante × acelerando.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o carro na estrada e o velocímetro
// ---------------------------------------------------------------------------

function RoadOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Um carro andando na estrada, com as faixas passando e o velocímetro marcando a velocidade">
      <rect width="460" height="300" fill="#e0f2fe" />
      <path d="M0 150 C80 130 160 140 230 128 C310 116 380 132 460 120 L460 300 L0 300 Z" fill="#86efac" />
      <rect y="190" width="460" height="70" fill="#475569" />
      {/* as faixas passando */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;-80 0" dur="0.5s" repeatCount="indefinite" />
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={i * 80} y="222" width="44" height="6" rx="3" fill="#fde047" />
        ))}
      </g>
      {/* as placas de quilômetro passando */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;-500 0" dur="4s" repeatCount="indefinite" />
        {[480, 730].map((x, i) => (
          <g key={x} transform={`translate(${x} 186)`}>
            <rect x="-2" y="-40" width="4" height="40" fill="#64748b" />
            <rect x="-22" y="-60" width="44" height="24" rx="4" fill="#16a34a" stroke="#fff" strokeWidth="2" />
            <text y="-43" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff">
              km {i + 1}
            </text>
          </g>
        ))}
      </g>
      <g transform="translate(150 246)">
        <g className="cg-anim-shiver">
          <Car wheelDur={0.25} />
        </g>
      </g>
      {/* o velocímetro */}
      <g transform="translate(360 80)">
        <circle r="56" fill="#1e293b" stroke="#94a3b8" strokeWidth="4" />
        {Array.from({ length: 9 }, (_, i) => {
          const a = Math.PI * 0.75 + (i / 8) * Math.PI * 1.5;
          return (
            <g key={i}>
              <line x1={Math.cos(a) * 42} y1={Math.sin(a) * 42} x2={Math.cos(a) * 50} y2={Math.sin(a) * 50} stroke="#e2e8f0" strokeWidth="2" />
              <text x={Math.cos(a) * 32} y={Math.sin(a) * 32 + 4} textAnchor="middle" fontSize="8.5" fill="#e2e8f0" fontWeight="700">
                {i * 20}
              </text>
            </g>
          );
        })}
        <g>
          <animateTransform attributeName="transform" type="rotate" values="-100;40;10;60;-100" dur="6s" repeatCount="indefinite" />
          <path d="M-3 0 L0 -46 L3 0 Z" fill="#ef4444" />
        </g>
        <circle r="6" fill="#ef4444" />
        <text y="34" textAnchor="middle" fontSize="10" fontWeight="900" fill="#e2e8f0">
          km/h
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O referencial: o ônibus e quem está na calçada
// ---------------------------------------------------------------------------

function ReferenceArt() {
  return (
    <Art viewBox="0 0 560 220" label="Um ônibus andando com um passageiro sentado: para o motorista ele está parado, para a pessoa na calçada ele está em movimento">
      <rect width="560" height="220" fill="#f8fafc" />
      <rect y="170" width="560" height="50" fill="#94a3b8" />
      <rect y="160" width="560" height="10" fill="#cbd5e1" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="-200 0;360 0" dur="6s" repeatCount="indefinite" />
        <rect x="40" y="70" width="190" height="90" rx="14" fill="#f59e0b" stroke="#92400e" strokeWidth="3" />
        {[56, 102, 148].map((x) => (
          <rect key={x} x={x} y="84" width="38" height="34" rx="4" fill="#bae6fd" stroke="#92400e" strokeWidth="2" />
        ))}
        <rect x="196" y="84" width="24" height="60" rx="3" fill="#bae6fd" stroke="#92400e" strokeWidth="2" />
        {/* o passageiro sentado */}
        <circle cx="121" cy="96" r="8" fill="#fcd34d" stroke="#92400e" strokeWidth="1.5" />
        <rect x="113" y="104" width="16" height="14" rx="3" fill="#7c3aed" />
        <circle cx="76" cy="160" r="14" fill="#1e293b" />
        <circle cx="196" cy="160" r="14" fill="#1e293b" />
      </g>
      <g transform="translate(470 166)">
        <Person color="#16a34a" />
      </g>
      <g fontFamily="Georgia, serif" fontSize="12" fontWeight="900">
        <text x="20" y="30" fill="#7c3aed">
          para o motorista: o passageiro está parado
        </text>
        <text x="20" y="50" fill="#15803d">
          para quem está na calçada: ele está se movendo
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A calculadora de velocidade média
// ---------------------------------------------------------------------------

export function SpeedCalc() {
  const [dist, setDist] = useState(180);
  const [time, setTime] = useState(2);
  const v = dist / time;
  const ms = v / 3.6;
  // o carrinho atravessa a pista mais rápido quanto maior a velocidade
  const dur = Math.max(0.6, Math.min(8, 360 / v));
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <svg viewBox="0 0 520 70" className="block w-full" aria-hidden="true">
        <rect y="40" width="520" height="24" fill="#475569" />
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={i} x={i * 64 + 10} y="50" width="34" height="4" fill="#fde047" />
        ))}
        <g key={dur} style={{ animation: `cg-drive-across ${dur}s linear infinite` }}>
          <g transform="translate(0 62) scale(0.7)">
            <Car color="#2563eb" wheelDur={Math.max(0.15, dur / 10)} />
          </g>
        </g>
      </svg>
      <div className="mt-[0.4em] grid gap-[0.4em] text-[0.88em] sm:grid-cols-2">
        <label className="block">
          <span className="font-bold text-[#3b2a14]">Distância: {dist} km</span>
          <input type="range" min={30} max={300} step={30} value={dist} onChange={(e) => setDist(Number(e.target.value))} className="w-full accent-[#4f46e5]" />
        </label>
        <label className="block">
          <span className="font-bold text-[#3b2a14]">Tempo: {time.toLocaleString("pt-BR")} h</span>
          <input type="range" min={0.5} max={5} step={0.5} value={time} onChange={(e) => setTime(Number(e.target.value))} className="w-full accent-[#4f46e5]" />
        </label>
      </div>
      <p className="mt-[0.3em] rounded-lg bg-[#eef2ff] px-[0.6em] py-[0.3em] text-center font-bold text-[#312e81]">
        v = {dist} km ÷ {time.toLocaleString("pt-BR")} h = <span className="text-[1.15em]">{v.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km/h</span>{" "}
        <span className="font-normal">(≈ {ms.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} m/s)</span>
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// As conversões: 1 km = 1000 m, 1 h = 3600 s, ÷ 3,6
// ---------------------------------------------------------------------------

function ConversionArt() {
  return (
    <Art viewBox="0 0 560 170" label="Para passar de quilômetros por hora para metros por segundo, divide-se por 3,6; para o caminho de volta, multiplica-se por 3,6">
      <rect x="40" y="50" width="160" height="70" rx="16" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="3" />
      <text x="120" y="96" textAnchor="middle" fontSize="28" fontWeight="900" fill="#312e81" fontFamily="Georgia, serif">
        km/h
      </text>
      <rect x="360" y="50" width="160" height="70" rx="16" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />
      <text x="440" y="96" textAnchor="middle" fontSize="28" fontWeight="900" fill="#92400e" fontFamily="Georgia, serif">
        m/s
      </text>
      <path d="M210 66 C260 30 300 30 350 66" stroke="#dc2626" strokeWidth="4" fill="none" strokeDasharray="10 6" className="cg-anim-dash" />
      <path d="M340 58 L352 68 L338 72" stroke="#dc2626" strokeWidth="4" fill="none" />
      <path d="M350 104 C300 140 260 140 210 104" stroke="#16a34a" strokeWidth="4" fill="none" strokeDasharray="10 6" className="cg-anim-dash" />
      <path d="M220 112 L208 102 L222 98" stroke="#16a34a" strokeWidth="4" fill="none" />
      <g fontFamily="Georgia, serif" fontWeight="900" textAnchor="middle">
        <text x="280" y="28" fontSize="18" fill="#dc2626">÷ 3,6</text>
        <text x="280" y="158" fontSize="18" fill="#16a34a">× 3,6</text>
        <text x="280" y="92" fontSize="12" fill="#5b4a2e" fontWeight="700">72 km/h = 20 m/s</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Velocidade constante × acelerando: as fotos do carro a cada segundo
// ---------------------------------------------------------------------------

function MotionDiagramArt() {
  const constant = [40, 140, 240, 340, 440];
  const accel = [40, 60, 110, 190, 300, 440];
  return (
    <Art viewBox="0 0 560 230" label="Fotos do carro a cada segundo: com velocidade constante, os espaços são iguais; acelerando, os espaços aumentam">
      <g fontFamily="Georgia, serif" fontSize="13" fontWeight="900">
        <text x="10" y="22" fill="#2563eb">Velocidade constante: espaços iguais</text>
        <text x="10" y="128" fill="#dc2626">Acelerando: os espaços aumentam</text>
      </g>
      <rect y="94" width="560" height="6" fill="#94a3b8" />
      <rect y="200" width="560" height="6" fill="#94a3b8" />
      {constant.map((x, i) => (
        <g key={`c${i}`} transform={`translate(${x} 94) scale(0.55)`} className="cg-anim-fade" style={{ animationDelay: `${i * 0.4}s` }}>
          <Car color="#3b82f6" wheelDur={0} />
        </g>
      ))}
      {accel.map((x, i) => (
        <g key={`a${i}`} transform={`translate(${x} 200) scale(0.55)`} className="cg-anim-fade" style={{ animationDelay: `${i * 0.4}s` }}>
          <Car color="#ef4444" wheelDur={0} />
        </g>
      ))}
      {constant.map((x, i) => (
        <text key={`tc${i}`} x={x} y="114" textAnchor="middle" fontSize="10.5" fill="#5b4a2e">
          {i} s
        </text>
      ))}
      {accel.map((x, i) => (
        <text key={`ta${i}`} x={x} y="220" textAnchor="middle" fontSize="10.5" fill="#5b4a2e">
          {i} s
        </text>
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
    <ChapterOpener
      n={1}
      title="Movimento e Velocidade"
      goals={["Por que movimento e repouso dependem do referencial", "Como calcular a velocidade média", "Como converter km/h em m/s", "O que é aceleração"]}
    >
      <Fig h={34}>
        <RoadOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🚌">O que é estar em movimento?</H>
      <P>
        Você está parado agora? Depende! Em relação à cadeira, sim. Mas a Terra gira e anda em volta do Sol: em relação ao Sol, você está viajando a mais de 100 mil km/h. Por
        isso, para dizer se algo está em <T>movimento</T> ou em <T>repouso</T>, precisamos escolher um <T>referencial</T>: o ponto de vista de quem observa.
      </P>
      <Fig n="1.1" caption="O mesmo passageiro está parado e em movimento, dependendo de quem observa." h={24}>
        <ReferenceArt />
      </Fig>
      <List
        items={[
          <>
            Um corpo está em <T>movimento</T> quando a posição dele muda em relação ao referencial.
          </>,
          <>
            Está em <T>repouso</T> quando a posição não muda em relação ao referencial.
          </>,
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="⏱️">Velocidade média</H>
      <P>
        A <T>velocidade média</T> diz quanta distância é percorrida em cada unidade de tempo. É só dividir a distância pelo tempo gasto:
      </P>
      <div className="my-[0.4em] rounded-xl border-2 border-[#4f46e5] bg-[#eef2ff] px-[0.8em] py-[0.4em] text-center font-bold text-[#312e81]">v = distância ÷ tempo</div>
      <P>Mexa nos controles: quanto maior a velocidade, mais rápido o carrinho atravessa a estrada.</P>
      <SpeedCalc />
      <Box kind="sabia">
        O recorde mundial dos 100 metros rasos é de <strong>Usain Bolt</strong>: 9,58 segundos. Isso dá uma velocidade média de mais de 10 m/s, ou cerca de 37 km/h!
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="📏">Unidades e conversões</H>
      <P>
        Na ciência usamos o <T>Sistema Internacional de Unidades (SI)</T>, para que todo mundo meça do mesmo jeito. Nele, a distância é medida em <T>metros (m)</T>, o tempo em{" "}
        <T>segundos (s)</T> e a velocidade em <T>metros por segundo (m/s)</T>. No dia a dia, o mais comum é o km/h.
      </P>
      <Table
        head={["Grandeza", "Unidade do SI", "Lembrete"]}
        rows={[
          ["Distância", "metro (m)", "1 km = 1000 m (“quilo” = mil)"],
          ["Tempo", "segundo (s)", "1 h = 60 min = 3600 s"],
          ["Massa", "quilograma (kg)", "1 kg = 1000 g"],
          ["Velocidade", "metro por segundo (m/s)", "km/h ÷ 3,6 = m/s"],
        ]}
      />
      <Fig n="1.2" caption="Para converter, divida ou multiplique por 3,6." h={18}>
        <ConversionArt />
      </Fig>
      <P>
        E dá para usar a fórmula ao contrário: <strong>distância = velocidade × tempo</strong>. Um ciclista a 15 km/h durante 3 h percorre 15 × 3 = <T>45 km</T>.
      </P>
    </>,
  ),

  page(
    <>
      <H icon="🏎️">Aceleração</H>
      <P>
        <T>Acelerar</T> é mudar a velocidade. Quando o carro arranca, a velocidade aumenta; quando freia, ela diminui (é uma aceleração negativa). E fazer uma curva também é
        acelerar, porque muda a <em>direção</em> da velocidade.
      </P>
      <Fig n="1.3" caption="Fotos do carro tiradas a cada segundo." h={24}>
        <MotionDiagramArt />
      </Fig>
      <P>
        A aceleração mede quanto a velocidade muda a cada segundo: <strong>a = variação da velocidade ÷ tempo</strong>. A unidade é o <T>metro por segundo ao quadrado (m/s²)</T>.
        Um carro que vai de 0 a 20 m/s em 5 s tem aceleração de 20 ÷ 5 = <T>4 m/s²</T>.
      </P>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Movimento e repouso dependem do referencial (de quem observa).",
          "Velocidade média = distância ÷ tempo. Distância = velocidade × tempo.",
          "No SI: metro, segundo, quilograma e m/s. Para passar de km/h para m/s, divida por 3,6.",
          "Aceleração é a mudança da velocidade; a unidade é m/s².",
        ]}
      />
      <Glossary
        items={[
          ["Referencial", "O ponto de vista de quem observa o movimento."],
          ["Velocidade média", "A distância percorrida dividida pelo tempo."],
          ["SI", "Sistema Internacional de Unidades."],
          ["Aceleração", "A rapidez com que a velocidade muda."],
          ["m/s²", "A unidade de aceleração no SI."],
        ]}
      />
      <Quiz
        items={[
          ["Um carro percorre 180 km em 2 h. Qual a velocidade média?", "180 ÷ 2 = 90 km/h."],
          ["Quanto é 72 km/h em m/s?", "72 ÷ 3,6 = 20 m/s."],
          ["Sentado no ônibus, você está parado ou em movimento em relação ao motorista?", "Parado: depende do referencial."],
          ["Qual é a unidade de aceleração no SI?", "Metro por segundo ao quadrado (m/s²)."],
        ]}
      />
    </>,
  ),
];
