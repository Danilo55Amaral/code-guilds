"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Cloud, Tree } from "./art";

// ============================================================================
// CAPÍTULO 3 — ÁGUA E SANEAMENTO (missão "ODS: Água e Saneamento para
// Todos"): a chuva enchendo o rio e saindo pela torneira, as 100 gotas do
// planeta (só 2,5 de água doce), o caminho da água na estação de tratamento,
// o esgoto tratado devolvendo um rio limpo e a calculadora do banho.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a chuva, o rio e a torneira
// ---------------------------------------------------------------------------

function WaterOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma nuvem chovendo sobre as montanhas, o rio correndo até a cidade e a água limpa saindo da torneira para um copo">
      <rect width="460" height="300" fill="#e0f2fe" />
      <path d="M0 150 L80 70 L150 140 L220 80 L300 150 Z" fill="#94a3b8" />
      <path d="M68 82 L80 70 L92 82 Z M208 92 L220 80 L232 92 Z" fill="#fff" />
      <Cloud x={120} y={50} s={1.2} color="#cbd5e1" />
      {Array.from({ length: 8 }, (_, i) => (
        <line key={i} x1={96 + i * 7} y1="66" x2={92 + i * 7} y2="80" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round">
          <animateTransform attributeName="transform" type="translate" values="0 0;-6 40" dur="0.9s" begin={`${-i * 0.11}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0" dur="0.9s" begin={`${-i * 0.11}s`} repeatCount="indefinite" />
        </line>
      ))}
      <rect y="150" width="460" height="150" fill="#86efac" />
      {/* o rio */}
      <path d="M120 150 C140 190 90 220 160 250 C220 276 300 250 340 300 L380 300 C340 240 260 262 200 236 C150 214 190 180 160 150 Z" fill="#38bdf8" />
      <path d="M150 170 C160 190 130 210 170 236" stroke="#e0f2fe" strokeWidth="3" fill="none" strokeDasharray="10 12" className="cg-anim-dash" />
      <Tree x={60} y={240} s={0.8} />
      <Tree x={420} y={200} s={0.7} />
      {/* a torneira e o copo */}
      <g transform="translate(360 150)">
        <rect x="-6" y="-40" width="12" height="40" fill="#64748b" />
        <path d="M-6 -40 L30 -40 L30 -28 L18 -28" stroke="#64748b" strokeWidth="12" fill="none" strokeLinejoin="round" />
        <rect x="-14" y="-52" width="28" height="8" rx="3" fill="#475569" />
        <path d="M24 -22 L24 20" stroke="#38bdf8" strokeWidth="5" strokeDasharray="5 4" className="cg-anim-dash" />
        <path d="M8 18 L40 18 L36 56 L12 56 Z" fill="#e0f2fe" stroke="#0369a1" strokeWidth="2" />
        <rect x="13" y="34" width="22" height="20" fill="#7dd3fc">
          <animate attributeName="y" values="54;34;34" keyTimes="0;0.7;1" dur="4s" repeatCount="indefinite" />
          <animate attributeName="height" values="0;20;20" keyTimes="0;0.7;1" dur="4s" repeatCount="indefinite" />
        </rect>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As 100 gotas: quanta água do planeta é doce
// ---------------------------------------------------------------------------

function DropsArt() {
  return (
    <Art viewBox="0 0 560 220" label="Cem quadradinhos representando toda a água da Terra: 97 e meio são de água salgada, 2 e meio são de água doce, e a maior parte da doce está congelada">
      <rect width="560" height="220" rx="14" fill="#f8fafc" />
      {Array.from({ length: 100 }, (_, i) => {
        const col = i % 20;
        const row = Math.floor(i / 20);
        const fresh = i >= 97;
        const half = i === 97;
        return (
          <g key={i} transform={`translate(${30 + col * 17} ${30 + row * 17})`}>
            <rect width="14" height="14" rx="3" fill={fresh ? (i === 99 ? "#7dd3fc" : "#f1f5f9") : "#1d4ed8"} stroke={fresh ? "#0ea5e9" : "none"} strokeWidth="1.5" />
            {half && <rect width="7" height="14" rx="2" fill="#1d4ed8" />}
          </g>
        );
      })}
      <g fontFamily="Georgia, serif" fontWeight="900">
        <rect x="390" y="34" width="14" height="14" rx="3" fill="#1d4ed8" />
        <text x="410" y="46" fontSize="12.5" fill="#1e3a8a">97,5% salgada</text>
        <rect x="390" y="64" width="14" height="14" rx="3" fill="#f1f5f9" stroke="#0ea5e9" strokeWidth="1.5" />
        <text x="410" y="76" fontSize="12.5" fill="#0369a1">doce, congelada</text>
        <rect x="390" y="94" width="14" height="14" rx="3" fill="#7dd3fc" stroke="#0ea5e9" strokeWidth="1.5" />
        <text x="410" y="106" fontSize="12.5" fill="#0369a1">doce, em rios,</text>
        <text x="410" y="122" fontSize="12.5" fill="#0369a1">lagos e no subsolo</text>
      </g>
      <text x="200" y="140" textAnchor="middle" fontSize="12" fontStyle="italic" fill="#475569" fontFamily="Georgia, serif">
        cada quadradinho é 1% de toda a água da Terra
      </text>
      {/* uma gota que pinga sem parar no canto */}
      <g transform="translate(470 170)">
        <path d="M0 -26 C10 -12 14 -4 14 4 A14 14 0 0 1 -14 4 C-14 -4 -10 -12 0 -26 Z" fill="#38bdf8" className="cg-anim-float" />
      </g>
      <text x="250" y="190" textAnchor="middle" fontSize="13" fontWeight="900" fill="#0c4a6e" fontFamily="Georgia, serif">
        só uma pequena parte da água doce está fácil de usar
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O caminho da água: a estação de tratamento (ETA)
// ---------------------------------------------------------------------------

const STEP_ICONS = ["🏞️", "🧪", "⏬", "🧽", "💧", "🏠"];

function TreatmentArt() {
  const steps = [
    { name: "Captação", text: "do rio", color: "#a16207" },
    { name: "Floculação", text: "a sujeira gruda", color: "#92400e" },
    { name: "Decantação", text: "os flocos afundam", color: "#ca8a04" },
    { name: "Filtração", text: "areia e carvão", color: "#65a30d" },
    { name: "Cloro", text: "mata os micróbios", color: "#0ea5e9" },
    { name: "Casas", text: "água potável", color: "#2563eb" },
  ];
  return (
    <Art viewBox="0 0 600 190" label="As etapas da estação de tratamento de água: captação no rio, floculação, decantação, filtração, cloração e a água chegando às casas">
      <rect width="600" height="190" rx="14" fill="#f0f9ff" />
      <path d="M50 80 L550 80" stroke="#7dd3fc" strokeWidth="10" strokeLinecap="round" />
      <path d="M50 80 L550 80" stroke="#0284c7" strokeWidth="4" strokeDasharray="10 10" className="cg-anim-dash" />
      {steps.map((s, i) => {
        const x = 50 + i * 100;
        // a cor da água vai clareando a cada etapa
        return (
          <g key={s.name} transform={`translate(${x} 80)`}>
            <circle r="28" fill="#fff" stroke={s.color} strokeWidth="4" />
            <circle r="18" fill={s.color} opacity={0.25 + i * 0.1} />
            <text y="6" textAnchor="middle" fontSize="18">
              {STEP_ICONS[i]}
            </text>
            <text y="52" textAnchor="middle" fontSize="12" fontWeight="900" fill="#0c4a6e" fontFamily="Georgia, serif">
              {s.name}
            </text>
            <text y="68" textAnchor="middle" fontSize="10.5" fill="#334155" fontFamily="Georgia, serif">
              {s.text}
            </text>
          </g>
        );
      })}
      <text x="300" y="30" textAnchor="middle" fontSize="13" fontWeight="900" fill="#075985" fontFamily="Georgia, serif">
        a água fica mais limpa a cada etapa
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O esgoto tratado devolvendo um rio limpo
// ---------------------------------------------------------------------------

function SewageArt() {
  return (
    <Art viewBox="0 0 560 220" label="De um lado, esgoto sem tratamento sujando o rio e matando os peixes; do outro, o esgoto passando pela estação de tratamento e o rio limpo com peixes">
      <rect width="560" height="220" rx="14" fill="#f8fafc" />
      <line x1="280" y1="16" x2="280" y2="204" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 5" />
      {/* sem tratamento */}
      <g>
        <rect x="20" y="40" width="70" height="60" fill="#e5e7eb" stroke="#64748b" strokeWidth="2" />
        <path d="M20 40 L55 18 L90 40 Z" fill="#94a3b8" />
        <path d="M90 90 L130 120" stroke="#78716c" strokeWidth="8" />
        <path d="M20 150 Q140 130 270 150 L270 200 L20 200 Z" fill="#78716c" />
        <path d="M120 122 Q150 140 170 150" stroke="#57534e" strokeWidth="6" fill="none" strokeDasharray="6 6" className="cg-anim-dash" />
        {[60, 130, 210].map((x) => (
          <text key={x} x={x} y="182" fontSize="16" opacity="0.6">
            🐟
          </text>
        ))}
        <text x="182" y="28" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#991b1b" fontFamily="Georgia, serif">
          sem tratamento: rio poluído
        </text>
      </g>
      {/* com tratamento */}
      <g>
        <rect x="300" y="40" width="70" height="60" fill="#e5e7eb" stroke="#64748b" strokeWidth="2" />
        <path d="M300 40 L335 18 L370 40 Z" fill="#94a3b8" />
        <path d="M370 90 L400 100" stroke="#78716c" strokeWidth="8" />
        <rect x="400" y="80" width="70" height="50" rx="8" fill="#a7f3d0" stroke="#047857" strokeWidth="2" />
        <text x="435" y="110" textAnchor="middle" fontSize="13" fontWeight="900" fill="#065f46" fontFamily="Georgia, serif">
          ETE
        </text>
        <path d="M450 130 L470 150" stroke="#38bdf8" strokeWidth="6" />
        <path d="M300 150 Q420 130 540 150 L540 200 L300 200 Z" fill="#38bdf8" />
        {[330, 400, 470].map((x, i) => (
          <text key={x} x={x} y="182" fontSize="16">
            <animate attributeName="x" values={`${x};${x + 20};${x}`} dur={`${3 + i}s`} repeatCount="indefinite" />
            🐟
          </text>
        ))}
        <text x="462" y="28" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#166534" fontFamily="Georgia, serif">
          com tratamento: rio limpo
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A calculadora do banho (de mexer)
// ---------------------------------------------------------------------------

/** Chuveiro com o registro meio aberto: cerca de 9 litros por minuto (a referência da Sabesp). */
const LITERS_PER_MINUTE = 9;

export function ShowerCalc() {
  const [minutes, setMinutes] = useState(15);
  const liters = minutes * LITERS_PER_MINUTE;
  const saved = Math.max(0, (minutes - 5) * LITERS_PER_MINUTE);
  const level = Math.min(1, liters / 270);
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <div className="flex items-center gap-[0.8em]">
        <svg viewBox="0 0 120 150" className="h-[7.5em] w-auto shrink-0" aria-label={`${liters} litros de água`}>
          <path d="M20 20 L100 20 L94 140 L26 140 Z" fill="#f8fafc" stroke="#0369a1" strokeWidth="3" />
          <rect x="24" y={140 - 118 * level} width="72" height={118 * level} fill="#38bdf8" style={{ transition: "all 0.5s" }} />
          {[50, 80, 110].map((y) => (
            <line key={y} x1="20" y1={y} x2="32" y2={y} stroke="#0369a1" strokeWidth="2" />
          ))}
        </svg>
        <div className="min-w-0 flex-1">
          <label className="block">
            <span className="font-bold text-[#3b2a14]">Tempo de banho: {minutes} minutos</span>
            <input type="range" min={3} max={30} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="w-full accent-[#0284c7]" />
          </label>
          <p className="mt-[0.2em] rounded-lg bg-[#e0f2fe] px-[0.6em] py-[0.3em] text-center font-bold text-[#075985]">
            Cerca de <span className="text-[1.2em]">{liters} litros</span> de água
          </p>
          <p className="mt-[0.2em] text-[0.85em] text-[#3b2a14]">
            {saved > 0 ? (
              <>
                Com um banho de 5 minutos, você economizaria <strong>{saved} litros</strong>.
              </>
            ) : (
              "Banho rápido! Assim a água rende muito mais."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 3, content, bare });

export const chapter3: BookPage[] = [
  page(
    <ChapterOpener
      n={3}
      title="Água e Saneamento"
      goals={["Quanta água doce existe no planeta", "Como a água do rio fica boa para beber", "O que é saneamento básico", "Como economizar água no dia a dia"]}
    >
      <Fig h={34}>
        <WaterOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🌊">A água do planeta</H>
      <P>
        A Terra é chamada de planeta azul, mas quase toda a água dela é <T>salgada</T>, dos oceanos. Só cerca de <T>2,5%</T> é <T>água doce</T>, e a maior parte dessa
        água doce está congelada nas geleiras e nos polos.
      </P>
      <Fig n="3.1" caption="Se toda a água da Terra fosse dividida em 100 partes." h={22}>
        <DropsArt />
      </Fig>
      <P>
        Muita água doce fica guardada no subsolo, entre as rochas: são os <T>aquíferos</T>. O <T>Aquífero Guarani</T> fica em grande parte no Brasil, e o{" "}
        <T>Alter do Chão</T>, na Amazônia, é ainda maior.
      </P>
      <Box kind="sabia">O Dia Mundial da Água é comemorado em <strong>22 de março</strong>.</Box>
    </>,
  ),

  page(
    <>
      <H icon="🚰">Do rio até a torneira</H>
      <P>
        A água dos rios e represas não está pronta para beber. Ela passa por uma <T>Estação de Tratamento de Água (ETA)</T>, onde é limpa em várias etapas até ficar{" "}
        <T>potável</T>, ou seja, boa para beber.
      </P>
      <Fig n="3.2" caption="As etapas da estação de tratamento de água." h={20}>
        <TreatmentArt />
      </Fig>
      <List3 />
    </>,
  ),

  page(
    <>
      <H icon="🚽">Saneamento básico</H>
      <P>
        O <T>saneamento básico</T> reúne quatro serviços: <T>água tratada</T>, <T>coleta e tratamento de esgoto</T>, <T>coleta de lixo</T> e <T>drenagem da chuva</T>. Sem
        ele, doenças como <T>diarreia</T> e <T>hepatite A</T> se espalham pela água e pelos alimentos contaminados.
      </P>
      <Fig n="3.3" caption="A Estação de Tratamento de Esgoto (ETE) limpa o esgoto antes de devolvê-lo ao rio." h={22}>
        <SewageArt />
      </Fig>
      <Box kind="lembre">
        O <strong>ODS 6</strong> quer garantir água potável e saneamento para todas as pessoas até 2030. No Brasil, milhões de pessoas ainda vivem sem coleta de esgoto.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🚿">Cada gota conta</H>
      <P>Um chuveiro com o registro meio aberto gasta cerca de 9 litros de água por minuto. Mexa no tempo do banho:</P>
      <ShowerCalc />
      <P>
        A <T>pegada hídrica</T> é toda a água usada, direta e indiretamente, para produzir algo. Produzir <T>1 kg de carne bovina</T> gasta milhares de litros, contando a
        água do pasto e da ração. E o <T>reuso</T> aproveita água já usada, como a da máquina de lavar, para lavar o quintal.
      </P>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Só cerca de 2,5% da água da Terra é doce, e a maior parte está congelada.",
          "Os aquíferos (como o Guarani) guardam água doce no subsolo.",
          "Na ETA, a água do rio passa por floculação, decantação, filtração e cloração até ficar potável.",
          "Saneamento básico: água tratada, esgoto, lixo e drenagem. Sem ele, doenças se espalham.",
          "O ODS 6 trata da água e do saneamento. Banho curto e reuso economizam água.",
        ]}
      />
      <Glossary
        items={[
          ["Água potável", "Água boa para beber."],
          ["Aquífero", "Reservatório de água entre as rochas do subsolo."],
          ["ETA", "Estação de Tratamento de Água."],
          ["ETE", "Estação de Tratamento de Esgoto."],
          ["Pegada hídrica", "Toda a água usada para produzir algo."],
        ]}
      />
      <Quiz
        items={[
          ["Que parte da água do planeta é doce?", "Só cerca de 2,5%, e a maior parte está congelada."],
          ["Para que serve uma ETE?", "Para limpar o esgoto antes de devolvê-lo aos rios."],
          ["Qual é o número do ODS da água e do saneamento?", "ODS 6."],
          ["Em que dia é comemorado o Dia Mundial da Água?", "22 de março."],
        ]}
      />
    </>,
  ),
];

/** As etapas da ETA explicadas (a lista da página 3). */
function List3() {
  return (
    <Table
      head={["Etapa", "O que acontece"]}
      rows={[
        ["Floculação", "Um produto faz a sujeira grudar e formar flocos"],
        ["Decantação", "Os flocos pesados afundam no tanque"],
        ["Filtração", "A água passa por camadas de areia, cascalho e carvão"],
        ["Desinfecção", "O cloro mata os micróbios que sobraram"],
      ]}
    />
  );
}
