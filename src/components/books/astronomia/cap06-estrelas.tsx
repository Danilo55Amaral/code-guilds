"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Stars } from "./art";

// ============================================================================
// CAPÍTULO 6 — ESTRELAS E CONSTELAÇÕES (missão "Astronomia: Estrelas e
// Constelações"): Órion se desenhando no céu, as cores das estrelas (das
// azuis, mais quentes, às vermelhas), a vida das estrelas da nebulosa ao
// buraco negro, as constelações de tocar (Órion, Cruzeiro do Sul, Escorpião e
// a Ema dos povos guarani) e o Cruzeiro do Sul apontando para o sul.
// ============================================================================

interface Constellation {
  name: string;
  stars: [number, number, number, string?][];
  lines: [number, number][];
  text: string;
}

const CONSTELLATIONS: Constellation[] = [
  {
    name: "Órion",
    stars: [
      [90, 40, 6, "#f97316"],
      [190, 50, 4],
      [120, 120, 4],
      [140, 115, 4],
      [160, 110, 4],
      [100, 190, 4],
      [200, 185, 6, "#93c5fd"],
    ],
    lines: [
      [0, 1],
      [0, 2],
      [1, 4],
      [2, 3],
      [3, 4],
      [2, 5],
      [4, 6],
    ],
    text: "O caçador. As Três Marias são o cinturão dele. Betelgeuse (o “ombro”, alaranjada) é uma supergigante vermelha; Rigel (o “pé”, azulada) é muito quente.",
  },
  {
    name: "Cruzeiro do Sul",
    stars: [
      [150, 36, 5, "#fdba74"],
      [150, 192, 6],
      [92, 108, 5],
      [200, 96, 4],
      [176, 142, 2.5],
    ],
    lines: [
      [0, 1],
      [2, 3],
    ],
    text: "A constelação mais famosa do céu do Hemisfério Sul, que está na bandeira do Brasil. Ajuda a achar a direção do sul.",
  },
  {
    name: "Escorpião",
    stars: [
      [60, 36, 4],
      [80, 58, 4],
      [96, 86, 4],
      [112, 108, 4],
      [124, 122, 7, "#ef4444"],
      [140, 142, 4],
      [150, 166, 4],
      [170, 186, 4],
      [196, 192, 4],
      [216, 176, 4],
      [222, 152, 4],
      [206, 138, 4],
    ],
    lines: Array.from({ length: 11 }, (_, i) => [i, i + 1] as [number, number]),
    text: "Tem a forma de um escorpião, com o ferrão curvado. A estrela vermelha Antares é o “coração” dele.",
  },
  {
    name: "Ema (guarani)",
    stars: [
      [90, 40, 4],
      [104, 52, 5, "#fdba74"],
      [118, 80, 4],
      [130, 108, 4],
      [150, 130, 4],
      [196, 124, 4],
      [222, 146, 4],
      [196, 168, 4],
      [150, 166, 4],
      [160, 196, 4],
      [190, 200, 4],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 8],
      [8, 4],
      [8, 9],
      [7, 10],
    ],
    text: "Constelação dos povos tupi-guarani, perto do Cruzeiro do Sul. Quando aparece inteira ao anoitecer, em junho, avisa a chegada do inverno no sul do Brasil.",
  },
];

/** Uma constelação: as estrelas piscando e as linhas se desenhando. */
function ConstellationDraw({ c, dx = 0, dy = 0, s = 1 }: { c: Constellation; dx?: number; dy?: number; s?: number }) {
  return (
    <g transform={`translate(${dx} ${dy}) scale(${s})`}>
      {c.lines.map(([a, b], i) => {
        const [x1, y1] = c.stars[a];
        const [x2, y2] = c.stars[b];
        const len = Math.hypot(x2 - x1, y2 - y1);
        return (
          <line key={`${c.name}${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#93c5fd" strokeWidth="1.6" strokeDasharray={len} strokeDashoffset={len} opacity="0.8">
            <animate attributeName="stroke-dashoffset" from={len} to="0" dur="0.6s" begin={`${i * 0.25}s`} fill="freeze" />
          </line>
        );
      })}
      {c.stars.map(([x, y, r, color], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r * 2.4} fill={color ?? "#fff"} opacity="0.2" />
          <circle cx={x} cy={y} r={r} fill={color ?? "#fff"} className="cg-anim-twinkle" style={{ animationDelay: `${(i % 5) * 0.3}s`, animationDuration: "3s" }} />
        </g>
      ))}
    </g>
  );
}

// ---------------------------------------------------------------------------
// Abertura: Órion se desenhando no céu
// ---------------------------------------------------------------------------

function OrionOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="A constelação de Órion se desenhando no céu, com as Três Marias no meio, Betelgeuse alaranjada e Rigel azulada">
      <rect width="460" height="300" fill="#020617" />
      <Stars w={460} h={300} n={60} seed={31} />
      <ConstellationDraw c={CONSTELLATIONS[0]} dx={80} dy={30} s={1.2} />
      <g fontFamily="Georgia, serif" fontSize="12" fontWeight="900">
        <text x="200" y="196" fill="#e0f2fe">Três Marias</text>
        <text x="80" y="66" fill="#fdba74">Betelgeuse</text>
        <text x="300" y="276" fill="#93c5fd">Rigel</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As cores das estrelas
// ---------------------------------------------------------------------------

function StarColorsArt() {
  const stars = [
    ["#93c5fd", "azul", "30.000 °C", 24],
    ["#e0f2fe", "branca", "10.000 °C", 20],
    ["#fef08a", "amarela (o Sol)", "5.500 °C", 18],
    ["#fdba74", "laranja", "4.500 °C", 16],
    ["#f87171", "vermelha", "3.000 °C", 14],
  ] as const;
  return (
    <Art viewBox="0 0 600 170" label="A cor das estrelas mostra a temperatura: as azuis são as mais quentes e as vermelhas, as mais frias">
      <rect width="600" height="170" rx="14" fill="#020617" />
      {stars.map(([color, name, temp, r], i) => {
        const x = 60 + i * 120;
        return (
          <g key={name}>
            <circle cx={x} cy="66" r={r * 2.2} fill={color} opacity="0.2" className="cg-anim-glow" />
            <circle cx={x} cy="66" r={r} fill={color} />
            <text x={x} y="130" textAnchor="middle" fontSize="12.5" fontWeight="900" fill={color} fontFamily="Georgia, serif">
              {name}
            </text>
            <text x={x} y="150" textAnchor="middle" fontSize="11.5" fill="#e2e8f0" fontFamily="Georgia, serif">
              {temp}
            </text>
          </g>
        );
      })}
      <text x="300" y="20" textAnchor="middle" fontSize="12" fontWeight="900" fill="#e2e8f0" fontFamily="Georgia, serif">
        mais quente ←————— temperatura —————→ mais fria
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A vida das estrelas
// ---------------------------------------------------------------------------

function LifecycleArt() {
  const step = (x: number, y: number, label: string, art: React.ReactNode, delay: number) => (
    <g key={label} className="cg-anim-pop" style={{ animationDelay: `${delay}s` }}>
      <g transform={`translate(${x} ${y})`}>{art}</g>
      <text x={x} y={y + 44} textAnchor="middle" fontSize="11.5" fontWeight="900" fill="#e2e8f0" fontFamily="Georgia, serif">
        {label}
      </text>
    </g>
  );
  return (
    <Art viewBox="0 0 600 270" label="A vida das estrelas: nascem na nebulosa; as como o Sol viram gigantes vermelhas e depois anãs brancas; as muito grandes explodem como supernovas e viram estrelas de nêutrons ou buracos negros">
      <rect width="600" height="270" rx="14" fill="#020617" />
      {step(
        60,
        125,
        "nebulosa",
        <g>
          <ellipse rx="40" ry="26" fill="#a855f7" opacity="0.4" className="cg-anim-glow" />
          <ellipse cx="10" cy="-6" rx="26" ry="16" fill="#f472b6" opacity="0.4" />
          <circle r="4" fill="#fff" />
        </g>,
        0,
      )}
      {step(170, 125, "estrela", <circle r="16" fill="#fef08a" className="cg-anim-glow" />, 0.3)}
      {/* o caminho das estrelas como o Sol */}
      <path d="M200 110 L270 70" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 4" />
      {step(310, 62, "gigante vermelha", <circle r="26" fill="#f87171" opacity="0.9" />, 0.6)}
      <path d="M344 62 L420 62" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 4" />
      {step(450, 62, "anã branca", <circle r="7" fill="#f8fafc" className="cg-anim-glow" />, 0.9)}
      {/* o caminho das estrelas gigantes */}
      <path d="M200 140 L270 180" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 4" />
      {step(310, 188, "supergigante", <circle r="34" fill="#ef4444" opacity="0.85" />, 1.2)}
      <path d="M350 188 L382 188" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 4" />
      {step(
        420,
        188,
        "supernova",
        <g>
          <g className="cg-anim-glow">
            {Array.from({ length: 12 }, (_, i) => (
              <line key={i} x1="0" y1="0" x2="0" y2="-30" stroke="#fde047" strokeWidth="3" transform={`rotate(${i * 30})`} />
            ))}
          </g>
          <circle r="12" fill="#fff7d6" />
        </g>,
        1.5,
      )}
      {step(
        525,
        140,
        "estrela de nêutrons",
        <g>
          <circle r="5" fill="#bfdbfe" />
          <g className="cg-anim-orbit-rev" style={{ "--cg-dur": "1.2s" } as React.CSSProperties}>
            <path d="M0 0 L-6 -30 L6 -30 Z M0 0 L-6 30 L6 30 Z" fill="#93c5fd" opacity="0.6" />
          </g>
        </g>,
        1.8,
      )}
      {step(
        525,
        222,
        "buraco negro",
        <g>
          <ellipse rx="22" ry="7" fill="#f97316" opacity="0.8" />
          <circle r="9" fill="#000" stroke="#fdba74" strokeWidth="1.5" />
        </g>,
        2.1,
      )}
      <g fontFamily="Georgia, serif" fontSize="11" fontWeight="900">
        <text x="100" y="66" fill="#fde68a">estrelas como o Sol</text>
        <text x="100" y="192" fill="#fca5a5">estrelas gigantes</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As constelações de tocar
// ---------------------------------------------------------------------------

export function ConstellationViewer() {
  const [sel, setSel] = useState(1);
  const c = CONSTELLATIONS[sel];
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <svg key={`ceu-${sel}`} viewBox="0 0 300 230" className="mx-auto block w-full max-w-[22em]" aria-label={`Constelação: ${c.name}`}>
        <rect width="300" height="230" rx="10" fill="#020617" />
        <Stars w={300} h={230} n={30} seed={sel * 7 + 3} />
        <ConstellationDraw c={c} />
      </svg>
      <div className="mt-[0.3em] flex flex-wrap justify-center gap-[0.3em] text-[0.85em]">
        {CONSTELLATIONS.map((x, i) => (
          <button key={x.name} type="button" onClick={() => setSel(i)} className={`rounded-full border px-[0.6em] py-[0.1em] font-bold ${sel === i ? "border-[#1d4ed8] bg-[#1d4ed8] text-white" : "border-[#d9c79d] bg-white hover:bg-[#eff6ff]"}`}>
            {x.name}
          </button>
        ))}
      </div>
      <p key={sel} className="cg-anim-fade mt-[0.4em] rounded-lg bg-[#eff6ff] px-[0.7em] py-[0.35em] text-[0.88em] leading-[1.45] text-[#1e3a8a]">
        <strong>{c.name}:</strong> {c.text}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// O Cruzeiro do Sul apontando para o sul
// ---------------------------------------------------------------------------

function SouthPointerArt() {
  return (
    <Art viewBox="0 0 560 230" label="Prolongando o braço maior do Cruzeiro do Sul cerca de quatro vezes e meia, chega-se ao polo sul celeste; descendo dali até o horizonte, está a direção sul">
      <rect width="560" height="230" rx="14" fill="#020617" />
      <Stars w={560} h={200} n={30} seed={41} />
      <ConstellationDraw c={CONSTELLATIONS[1]} dx={40} dy={0} s={0.55} />
      <path d="M122 106 L360 150" stroke="#fde047" strokeWidth="2" strokeDasharray="8 6" className="cg-anim-dash" />
      <circle cx="360" cy="150" r="6" fill="none" stroke="#fde047" strokeWidth="2" />
      <path d="M360 156 L360 200" stroke="#fde047" strokeWidth="2" strokeDasharray="4 4" />
      <path d="M0 200 C120 190 300 196 560 192 L560 230 L0 230 Z" fill="#0f172a" />
      <g fontFamily="Georgia, serif" fontSize="12" fontWeight="900">
        <text x="372" y="146" fill="#fde047">polo sul celeste</text>
        <text x="360" y="222" textAnchor="middle" fill="#fde68a">SUL</text>
        <text x="200" y="110" fill="#e0f2fe">4,5 × o braço maior</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 6, content, bare });

export const chapter6: BookPage[] = [
  page(
    <ChapterOpener
      n={6}
      title="Estrelas e Constelações"
      goals={["O que é uma estrela e o que a cor dela revela", "Como as estrelas nascem, vivem e morrem", "As constelações mais famosas do nosso céu", "Como os povos antigos usavam as estrelas"]}
    >
      <Fig h={34}>
        <OrionOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="⭐">O que é uma estrela</H>
      <P>
        Uma <T>estrela</T> é uma bola gigante de gás muito quente que produz a própria luz. O <T>Sol</T> é uma estrela! As outras parecem pontinhos porque estão muito, muito mais
        longe. A cor de uma estrela revela a sua <T>temperatura</T>:
      </P>
      <Fig n="6.1" caption="As estrelas azuis são as mais quentes; as vermelhas, as mais frias." h={18}>
        <StarColorsArt />
      </Fig>
      <Cards
        items={[
          { icon: "✨", title: "Por que piscam?", text: "O ar da atmosfera está sempre se mexendo e desvia um pouco a luz delas. No espaço, elas não piscam." },
          { icon: "☀️", title: "E de dia?", text: "As estrelas continuam lá, mas a luz do Sol espalhada no céu é forte demais e esconde o brilho delas." },
        ]}
      />
      <P>
        A estrela mais brilhante do céu noturno é <T>Sirius</T>, na constelação do Cão Maior.
      </P>
    </>,
  ),

  page(
    <>
      <H icon="🌟">A vida das estrelas</H>
      <P>
        As estrelas <T>nascem nas nebulosas</T>, nuvens de gás e poeira: a gravidade vai juntando o material até o centro ficar quente o bastante para acender. Quanto{" "}
        <T>maior a massa</T> da estrela, <T>menos tempo ela vive</T>: as gigantes gastam o combustível em poucos milhões de anos; as pequenas podem durar trilhões.
      </P>
      <Fig n="6.2" caption="Dois caminhos: o das estrelas como o Sol e o das gigantes." h={28}>
        <LifecycleArt />
      </Fig>
      <Box kind="sabia">
        <strong>Betelgeuse</strong>, o &ldquo;ombro&rdquo; de Órion, é uma supergigante vermelha tão grande que, no lugar do Sol, engoliria a órbita de Marte. Um dia ela deve
        explodir como supernova!
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="✨">As constelações</H>
      <P>
        <T>Constelações</T> são grupos de estrelas que, ligadas por linhas imaginárias, formam desenhos no céu. Hoje os astrônomos dividem o céu em 88 constelações. Toque em
        cada uma:
      </P>
      <ConstellationViewer />
      <P>
        As estrelas de uma constelação parecem juntas, mas podem estar a distâncias muito diferentes de nós: é só o jeito que as vemos daqui da Terra.
      </P>
    </>,
  ),

  page(
    <>
      <H icon="🧭">O céu dos povos</H>
      <P>
        Muito antes dos relógios e das bússolas, os povos usavam o céu como <T>calendário</T> (a posição das estrelas avisava a chegada das chuvas, da seca e do frio) e como{" "}
        <T>guia</T> nas viagens. Os povos indígenas do Brasil tinham a sua própria astronomia, como a constelação da Ema.
      </P>
      <Fig n="6.3" caption="O Cruzeiro do Sul ajuda a achar a direção sul." h={22}>
        <SouthPointerArt />
      </Fig>
      <Table
        head={["", "Astronomia", "Astrologia"]}
        rows={[
          ["O que é", "Ciência que estuda os astros", "Crença nos signos e horóscopos"],
          ["Como funciona", "Observação, medição e testes", "Previsões nunca comprovadas"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Estrela é uma bola de gás quente com luz própria. O Sol é uma estrela; Sirius é a mais brilhante da noite.",
          "A cor mostra a temperatura: azul mais quente, vermelha mais fria.",
          "As estrelas nascem nas nebulosas. Quanto maior a massa, menor o tempo de vida.",
          "As Três Marias são o cinturão de Órion; o Cruzeiro do Sul ajuda a achar o sul; a Ema guarani avisa o inverno.",
          "Astronomia é ciência; astrologia não tem comprovação.",
        ]}
      />
      <Glossary
        items={[
          ["Constelação", "Grupo de estrelas que forma um desenho no céu."],
          ["Nebulosa", "Nuvem de gás e poeira onde as estrelas nascem."],
          ["Supernova", "A explosão de uma estrela muito grande."],
          ["Anã branca", "O que sobra de uma estrela como o Sol no fim da vida."],
          ["Polo sul celeste", "O ponto do céu em volta do qual as estrelas parecem girar, no sul."],
        ]}
      />
      <Quiz
        items={[
          ["As Três Marias fazem parte de qual constelação?", "Órion."],
          ["Qual é a estrela mais brilhante do céu noturno?", "Sirius."],
          ["Por que as estrelas parecem piscar?", "Porque o ar da atmosfera está sempre se mexendo e desvia a luz delas."],
          ["Onde as estrelas nascem?", "Nas nebulosas, nuvens de gás e poeira."],
        ]}
      />
    </>,
  ),
];
