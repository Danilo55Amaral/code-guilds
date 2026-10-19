"use client";

import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";

// ============================================================================
// CAPÍTULO 5 — ENERGIA E CALOR (missão "Física: Energia e Calor"): a
// montanha-russa com as barras de energia potencial e cinética trocando de
// lugar, a corrente de energia do Sol até a corrida, o pêndulo, o equilíbrio
// térmico e as três formas de o calor se propagar.
// ============================================================================

const COASTER = "M30 90 C80 90 100 230 170 230 C240 230 250 130 300 130 C350 130 360 230 420 230";

/** As barras de energia potencial (azul) e cinética (vermelha), sincronizadas com o movimento. */
function EnergyBars({ x, y, pot, kin, dur }: { x: number; y: number; pot: string; kin: string; dur: string }) {
  return (
    <g transform={`translate(${x} ${y})`} fontFamily="Georgia, serif" fontSize="11" fontWeight="900">
      <rect x="0" y="0" width="22" height="80" fill="#e2e8f0" stroke="#64748b" />
      <rect x="34" y="0" width="22" height="80" fill="#e2e8f0" stroke="#64748b" />
      <rect x="1" width="20" fill="#3b82f6">
        <animate attributeName="height" values={pot} dur={dur} repeatCount="indefinite" />
        <animate attributeName="y" values={pot.split(";").map((v) => 80 - Number(v)).join(";")} dur={dur} repeatCount="indefinite" />
      </rect>
      <rect x="35" width="20" fill="#ef4444">
        <animate attributeName="height" values={kin} dur={dur} repeatCount="indefinite" />
        <animate attributeName="y" values={kin.split(";").map((v) => 80 - Number(v)).join(";")} dur={dur} repeatCount="indefinite" />
      </rect>
      <text x="11" y="96" textAnchor="middle" fill="#1d4ed8">Ep</text>
      <text x="45" y="96" textAnchor="middle" fill="#b91c1c">Ec</text>
    </g>
  );
}

// ---------------------------------------------------------------------------
// Abertura: a montanha-russa
// ---------------------------------------------------------------------------

function CoasterOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Um carrinho de montanha-russa descendo e subindo: no alto tem mais energia potencial, embaixo mais energia cinética">
      <rect width="460" height="300" fill="#e0f2fe" />
      <path d={`${COASTER} L420 280 L30 280 Z`} fill="#bbf7d0" />
      <path d={COASTER} stroke="#475569" strokeWidth="6" fill="none" />
      {[60, 110, 170, 230, 300, 360].map((x) => (
        <line key={x} x1={x} y1="280" x2={x} y2={x < 120 ? 120 : x < 220 ? 230 : x < 320 ? 134 : 228} stroke="#94a3b8" strokeWidth="3" />
      ))}
      <g>
        <animateMotion path={COASTER} dur="5s" repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.6 1" />
        <rect x="-18" y="-22" width="36" height="16" rx="4" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2" />
        <circle cx="-10" cy="-4" r="4" fill="#1e293b" />
        <circle cx="10" cy="-4" r="4" fill="#1e293b" />
        <circle cx="0" cy="-28" r="6" fill="#fcd34d" />
      </g>
      <EnergyBars x={372} y={20} pot="78;6;48;8;78" kin="2;74;32;72;2" dur="5s" />
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A corrente de energia: do Sol até a corrida
// ---------------------------------------------------------------------------

function EnergyChainArt() {
  const steps = [
    ["☀️", "Sol", "luz"],
    ["🌿", "Planta", "química"],
    ["🍎", "Alimento", "química"],
    ["🏃", "Corrida", "cinética"],
    ["🔥", "Corpo quente", "térmica"],
  ];
  return (
    <Art viewBox="0 0 600 140" label="A energia muda de forma: a luz do Sol vira energia química na planta e no alimento, depois movimento na corrida e calor no corpo">
      {steps.map(([icon, name, kind], i) => {
        const x = 60 + i * 120;
        return (
          <g key={name} className="cg-anim-pop" style={{ animationDelay: `${i * 0.25}s` }}>
            <circle cx={x} cy="56" r="40" fill="#fffaf0" stroke="#4f46e5" strokeWidth="2.5" />
            <text x={x} y="68" textAnchor="middle" fontSize="32">
              {icon}
            </text>
            <text x={x} y="118" textAnchor="middle" fontSize="13" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
              {name}
            </text>
            <text x={x} y="134" textAnchor="middle" fontSize="11" fontStyle="italic" fill="#6b5a3a" fontFamily="Georgia, serif">
              energia {kind}
            </text>
            {i < 4 && <path d={`M${x + 42} 56 L${x + 78} 56`} stroke="#4f46e5" strokeWidth="3" strokeDasharray="6 4" className="cg-anim-dash" />}
          </g>
        );
      })}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O pêndulo: potencial ↔ cinética
// ---------------------------------------------------------------------------

function PendulumArt() {
  return (
    <Art viewBox="0 0 560 220" label="Um pêndulo balançando: nas pontas tem mais energia potencial e no meio, mais energia cinética">
      <rect x="140" y="10" width="160" height="10" fill="#475569" />
      <g>
        <animateTransform attributeName="transform" type="rotate" values="-38 220 20;38 220 20;-38 220 20" dur="3s" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" repeatCount="indefinite" />
        <line x1="220" y1="20" x2="220" y2="170" stroke="#64748b" strokeWidth="3" />
        <circle cx="220" cy="180" r="20" fill="#f59e0b" stroke="#92400e" strokeWidth="2.5" />
      </g>
      <EnergyBars x={410} y={60} pot="76;4;76;4;76" kin="4;76;4;76;4" dur="3s" />
      <g fontFamily="Georgia, serif" fontSize="12" fontWeight="900">
        <text x="20" y="80" fill="#1d4ed8">nas pontas:</text>
        <text x="20" y="96" fill="#1d4ed8">mais potencial</text>
        <text x="190" y="216" fill="#b91c1c">no meio: mais cinética</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O equilíbrio térmico: o quente esfria e o frio esquenta
// ---------------------------------------------------------------------------

function EquilibriumArt() {
  const loop = { dur: "6s", repeatCount: "indefinite" };
  return (
    <Art viewBox="0 0 560 200" label="Um bloco quente encostado num bloco frio: o calor passa do quente para o frio até os dois ficarem na mesma temperatura">
      <rect x="120" y="60" width="140" height="100" rx="8" stroke="#7f1d1d" strokeWidth="3">
        <animate attributeName="fill" values="#ef4444;#f97316;#f97316;#ef4444" keyTimes="0;0.7;0.9;1" {...loop} />
      </rect>
      <rect x="260" y="60" width="140" height="100" rx="8" stroke="#1e3a8a" strokeWidth="3">
        <animate attributeName="fill" values="#3b82f6;#f97316;#f97316;#3b82f6" keyTimes="0;0.7;0.9;1" {...loop} />
      </rect>
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M${200 + k * 4} ${86 + k * 22} L${330 + k * 4} ${86 + k * 22}`} stroke="#fde047" strokeWidth="4" strokeDasharray="10 8" className="cg-anim-dash" opacity="0.9">
          <animate attributeName="opacity" values="0.9;0.9;0;0;0.9" keyTimes="0;0.6;0.7;0.95;1" {...loop} />
        </path>
      ))}
      <g fontFamily="Georgia, serif" fontWeight="900" textAnchor="middle">
        <text x="190" y="190" fontSize="14" fill="#b91c1c">
          <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.6;0.7;0.95;1" {...loop} />
          80 °C
        </text>
        <text x="330" y="190" fontSize="14" fill="#1d4ed8">
          <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.6;0.7;0.95;1" {...loop} />
          20 °C
        </text>
        <text x="260" y="190" fontSize="14" fill="#c2410c" opacity="0">
          <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.6;0.7;0.95;1" {...loop} />
          os dois a 50 °C: equilíbrio térmico
        </text>
        <text x="260" y="40" fontSize="13" fill="#3b2a14">
          o calor vai do mais quente para o mais frio
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Condução, convecção e irradiação
// ---------------------------------------------------------------------------

function HeatTransferArt() {
  return (
    <Art viewBox="0 0 600 230" label="A colher esquenta por condução, a água da panela circula por convecção e o calor da fogueira chega às mãos por irradiação">
      {/* a panela com a colher e a convecção */}
      <path d="M60 90 L240 90 L230 190 Q228 200 218 200 L82 200 Q72 200 70 190 Z" fill="#94a3b8" stroke="#334155" strokeWidth="3" />
      <path d="M68 104 L232 104 L226 188 L74 188 Z" fill="#7dd3fc" />
      {[100, 200].map((cx, i) => (
        <path key={cx} d={`M${cx} 180 C${cx - 30} 150 ${cx - 30} 120 ${cx} 116 C${cx + 30} 120 ${cx + 30} 150 ${cx} 180`} stroke={i ? "#ef4444" : "#ef4444"} strokeWidth="3" fill="none" strokeDasharray="8 6" className="cg-anim-dash" />
      ))}
      <path d="M200 60 L130 160" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
      <path d="M200 60 L130 160" strokeWidth="8" strokeLinecap="round" strokeDasharray="130" strokeDashoffset="130" stroke="#ef4444">
        <animate attributeName="stroke-dashoffset" values="130;0;0;130" keyTimes="0;0.6;0.9;1" dur="5s" repeatCount="indefinite" />
      </path>
      {[100, 150, 200].map((x) => (
        <g key={x} transform={`translate(${x} 214)`}>
          <g className="cg-anim-flicker">
            <path d="M0 -20 C8 -10 8 -2 0 2 C-8 -2 -8 -10 0 -20 Z" fill="#f97316" />
          </g>
        </g>
      ))}
      <g fontFamily="Georgia, serif" fontSize="12.5" fontWeight="900">
        <text x="210" y="50" fill="#b91c1c">condução (a colher)</text>
        <text x="40" y="80" fill="#0369a1">convecção (a água)</text>
      </g>
      {/* a fogueira e as mãos */}
      <g transform="translate(420 190)">
        <path d="M-40 10 L40 -6 M-40 -6 L40 10" stroke="#78350f" strokeWidth="8" strokeLinecap="round" />
        <g className="cg-anim-flicker">
          <path d="M0 -70 C26 -40 22 -10 0 0 C-22 -10 -26 -40 0 -70 Z" fill="#ef4444" />
          <path d="M0 -44 C12 -28 10 -8 0 -4 C-10 -8 -12 -28 0 -44 Z" fill="#fde047" />
        </g>
      </g>
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M460 ${120 + k * 20} q10 -6 20 0 t20 0 t20 0`} stroke="#f97316" strokeWidth="3" fill="none" strokeDasharray="8 6" className="cg-anim-dash" />
      ))}
      <path d="M540 116 C556 110 570 122 566 138 L550 150 L540 140 Z" fill="#fcd34d" stroke="#92400e" strokeWidth="2" />
      <text x="470" y="80" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#c2410c" fontFamily="Georgia, serif">
        irradiação (a fogueira)
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 5, content, bare });

export const chapter5: BookPage[] = [
  page(
    <ChapterOpener
      n={5}
      title="Energia e Calor"
      goals={["As formas de energia e como uma vira a outra", "As energias cinética e potencial e a conservação da energia", "A diferença entre calor e temperatura", "Como o calor se propaga"]}
    >
      <Fig h={34}>
        <CoasterOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="⚡">As formas de energia</H>
      <P>
        <T>Energia</T> é a capacidade de realizar trabalho e de provocar mudanças. Ela é medida em <T>joules (J)</T>. As calorias dos alimentos também são energia: 1 caloria
        vale cerca de 4,18 J. A energia aparece de muitas formas, e uma vira a outra o tempo todo:
      </P>
      <Fig n="5.1" caption="A energia vai mudando de forma, do Sol até o seu corpo." h={18}>
        <EnergyChainArt />
      </Fig>
      <Cards
        items={[
          { icon: "☀️", title: "Renováveis", text: "Solar, eólica (do vento) e hidrelétrica: se renovam na natureza." },
          { icon: "🛢️", title: "Não renováveis", text: "Petróleo, carvão e gás natural: combustíveis fósseis, que vão se esgotar." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🎢">Cinética, potencial e a conservação</H>
      <P>
        A <T>energia cinética</T> é a do movimento: <strong>Ec = m · v² ÷ 2</strong>. Quanto mais rápido, <em>muito</em> mais energia (a velocidade está ao quadrado!). A{" "}
        <T>energia potencial gravitacional</T> é a da altura: <strong>Ep = m · g · h</strong>.
      </P>
      <Fig n="5.2" caption="No pêndulo, uma energia vira a outra o tempo todo, e a soma se mantém." h={22}>
        <PendulumArt />
      </Fig>
      <P>
        O <T>Princípio da Conservação da Energia</T> diz que a energia <T>não é criada nem destruída</T>: só se transforma. Na usina hidrelétrica, a energia potencial da água
        no alto vira cinética na queda, que gira as turbinas e vira energia elétrica.
      </P>
    </>,
  ),

  page(
    <>
      <H icon="🌡️">Calor e temperatura</H>
      <P>
        <T>Temperatura</T> mede o grau de agitação das partículas: quanto mais agitadas, mais quente. <T>Calor</T> é a energia térmica <em>em trânsito</em>, que passa sempre do
        corpo mais quente para o mais frio, até os dois ficarem na mesma temperatura: o <T>equilíbrio térmico</T>.
      </P>
      <Fig n="5.3" caption="O calor passa do quente para o frio até as temperaturas ficarem iguais." h={22}>
        <EquilibriumArt />
      </Fig>
      <Box kind="sabia">
        Ao nível do mar, a água congela a 0 °C e ferve a 100 °C. No alto das montanhas, onde a pressão do ar é menor, ela ferve antes dos 100 °C, e o feijão demora mais para
        cozinhar!
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🔥">Como o calor se propaga</H>
      <P>O calor pode viajar de três jeitos:</P>
      <Fig n="5.4" caption="Condução, convecção e irradiação: as três formas de propagação do calor." h={24}>
        <HeatTransferArt />
      </Fig>
      <Cards
        items={[
          { icon: "🥄", title: "Condução", text: "De partícula em partícula, nos sólidos. Metais são bons condutores; madeira e plástico, isolantes." },
          { icon: "🌀", title: "Convecção", text: "Em líquidos e gases: o quente sobe e o frio desce. Por isso o ar-condicionado fica no alto." },
          { icon: "☀️", title: "Irradiação", text: "Por ondas, mesmo no vácuo: é assim que o calor do Sol chega à Terra." },
          { icon: "🧥", title: "Agasalho", text: "O casaco não esquenta: ele é isolante e segura o calor do seu corpo." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Energia é medida em joules (J) e muda de forma o tempo todo.",
          "Cinética: Ec = m · v² ÷ 2. Potencial gravitacional: Ep = m · g · h.",
          "Conservação: a energia não é criada nem destruída, só se transforma.",
          "Calor é energia em trânsito do quente para o frio; temperatura mede a agitação das partículas.",
          "O calor se propaga por condução, convecção e irradiação.",
        ]}
      />
      <Glossary
        items={[
          ["Joule (J)", "A unidade de energia do SI."],
          ["Energia cinética", "A energia do movimento."],
          ["Energia potencial", "A energia guardada pela posição (a altura)."],
          ["Equilíbrio térmico", "Quando os corpos chegam à mesma temperatura."],
          ["Isolante térmico", "Material que conduz mal o calor."],
        ]}
      />
      <Quiz
        items={[
          ["Que tipo de energia tem um objeto em movimento?", "Energia cinética."],
          ["Como o calor do Sol chega até a Terra?", "Por irradiação, em ondas, atravessando o vácuo."],
          ["Por que a colher de metal esquenta dentro da panela?", "Por condução: o metal é bom condutor de calor."],
          ["Qual é a diferença entre calor e temperatura?", "Calor é energia em trânsito; temperatura mede a agitação das partículas."],
        ]}
      />
    </>,
  ),
];
