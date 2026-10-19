"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Bulb } from "./art";

// ============================================================================
// CAPÍTULO 9 — ELETRICIDADE E MAGNETISMO (missão "Física: Eletricidade e
// Magnetismo"): o ímã com as linhas de campo e as bússolas girando, o
// circuito com a pilha, o resistor e o amperímetro, o circuito de tocar (em
// série ou em paralelo, com a lâmpada que queima), o relógio de luz e os ímãs
// se atraindo e se repelindo, a Terra como um ímã e o gerador.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o ímã e as bússolas
// ---------------------------------------------------------------------------

function MagnetOpenerArt() {
  const compasses: [number, number][] = [
    [70, 80], [70, 220], [390, 80], [390, 220], [230, 50], [230, 250], [120, 150], [340, 150],
  ];
  return (
    <Art viewBox="0 0 460 300" label="Um ímã em barra com as linhas do campo magnético e bússolas em volta, todas alinhadas com o campo">
      {/* as linhas de campo */}
      {[30, 60, 90].map((r, i) => (
        <g key={r} opacity={0.7 - i * 0.15}>
          <path d={`M150 150 C150 ${150 - r - 20} 310 ${150 - r - 20} 310 150`} stroke="#94a3b8" strokeWidth="2" fill="none" strokeDasharray="6 5" className="cg-anim-dash" />
          <path d={`M150 150 C150 ${150 + r + 20} 310 ${150 + r + 20} 310 150`} stroke="#94a3b8" strokeWidth="2" fill="none" strokeDasharray="6 5" className="cg-anim-dash" />
        </g>
      ))}
      {/* o ímã */}
      <rect x="150" y="130" width="80" height="40" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2" />
      <rect x="230" y="130" width="80" height="40" fill="#2563eb" stroke="#1e3a8a" strokeWidth="2" />
      <text x="190" y="157" textAnchor="middle" fontSize="20" fontWeight="900" fill="#fff">
        N
      </text>
      <text x="270" y="157" textAnchor="middle" fontSize="20" fontWeight="900" fill="#fff">
        S
      </text>
      {/* as bússolas girando até se alinhar */}
      {compasses.map(([x, y], i) => {
        const ang = (Math.atan2(y - 150, x - 230) * 180) / Math.PI + 90;
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <circle r="18" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
            <g>
              <animateTransform attributeName="transform" type="rotate" values={`${ang + 120};${ang - 20};${ang + 8};${ang}`} keyTimes="0;0.4;0.7;1" dur="3s" fill="freeze" />
              <path d="M0 -13 L4 0 L-4 0 Z" fill="#dc2626" />
              <path d="M0 13 L4 0 L-4 0 Z" fill="#1e293b" />
            </g>
          </g>
        );
      })}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O circuito simples: pilha, resistor e amperímetro
// ---------------------------------------------------------------------------

function CircuitArt() {
  const path = "M100 60 L460 60 L460 180 L100 180 Z";
  return (
    <Art viewBox="0 0 560 220" label="Um circuito com uma pilha de 6 volts, um resistor de 2 ohms e um amperímetro marcando 3 ampères, com os elétrons andando no fio">
      <path d={path} stroke="#b45309" strokeWidth="5" fill="none" strokeLinejoin="round" />
      {Array.from({ length: 10 }, (_, i) => (
        <circle key={i} r="4.5" fill="#3b82f6" stroke="#fff" strokeWidth="1">
          <animateMotion path={path} dur="6s" begin={`${-i * 0.6}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* a pilha */}
      <rect x="70" y="90" width="60" height="60" rx="6" fill="#1e293b" />
      <text x="100" y="126" textAnchor="middle" fontSize="15" fontWeight="900" fill="#fde047">
        6 V
      </text>
      {/* o resistor */}
      <rect x="250" y="44" width="80" height="32" rx="6" fill="#d6d3d1" stroke="#57534e" strokeWidth="2" />
      {[266, 282, 298, 314].map((x, i) => (
        <rect key={x} x={x} y="44" width="6" height="32" fill={["#7c2d12", "#ef4444", "#000", "#d97706"][i]} />
      ))}
      <text x="290" y="34" textAnchor="middle" fontSize="13" fontWeight="900" fill="#57534e" fontFamily="Georgia, serif">
        resistor: 2 Ω
      </text>
      {/* o amperímetro */}
      <circle cx="460" cy="120" r="30" fill="#f8fafc" stroke="#475569" strokeWidth="3" />
      <text x="460" y="128" textAnchor="middle" fontSize="16" fontWeight="900" fill="#1e293b">
        3 A
      </text>
      <g fontFamily="Georgia, serif" fontWeight="900" fontSize="13">
        <text x="20" y="214" fill="#1d4ed8">U = R × i → 6 V = 2 Ω × 3 A</text>
        <text x="380" y="214" fill="#475569">amperímetro</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O circuito de tocar: série × paralelo, e a lâmpada que queima
// ---------------------------------------------------------------------------

export function CircuitSim() {
  const [parallel, setParallel] = useState(false);
  const [burnt, setBurnt] = useState(false);
  const on = (i: number) => (parallel ? !(burnt && i === 1) : !burnt);
  const seriesPath = "M60 150 L60 40 L460 40 L460 150 L60 150";
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <svg viewBox="0 0 520 180" className="block w-full" aria-label={parallel ? "Circuito em paralelo" : "Circuito em série"}>
        {parallel ? (
          <g stroke="#b45309" strokeWidth="4" fill="none">
            <path d="M60 150 L60 40 L460 40 M60 150 L460 150 L460 40" />
            {[160, 260, 360].map((x) => (
              <path key={x} d={`M${x} 40 L${x} 150`} />
            ))}
          </g>
        ) : (
          <path d={seriesPath} stroke="#b45309" strokeWidth="4" fill="none" />
        )}
        {/* os elétrons andando (param se o circuito abre) */}
        {(parallel || !burnt) &&
          Array.from({ length: 8 }, (_, i) => (
            <circle key={`${parallel}${i}`} r="4" fill="#3b82f6">
              <animateMotion path={seriesPath} dur="4s" begin={`${-i * 0.5}s`} repeatCount="indefinite" />
            </circle>
          ))}
        {/* a pilha */}
        <rect x="40" y="70" width="40" height="56" rx="5" fill="#1e293b" />
        <text x="60" y="104" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fde047">
          +−
        </text>
        {/* as lâmpadas */}
        {[160, 260, 360].map((x, i) => (
          <g key={x} transform={parallel ? `translate(${x} 104)` : `translate(${x} 48)`}>
            <Bulb on={on(i)} />
            {burnt && i === 1 && (
              <text y="-58" textAnchor="middle" fontSize="11" fontWeight="900" fill="#b91c1c">
                queimou
              </text>
            )}
          </g>
        ))}
      </svg>
      <div className="mt-[0.3em] flex flex-wrap justify-center gap-[0.4em] text-[0.85em]">
        <button type="button" onClick={() => setParallel(false)} className={`rounded-full border px-[0.7em] py-[0.1em] font-bold ${!parallel ? "border-[#4f46e5] bg-[#4f46e5] text-white" : "border-[#d9c79d] bg-white hover:bg-[#eef2ff]"}`}>
          Em série
        </button>
        <button type="button" onClick={() => setParallel(true)} className={`rounded-full border px-[0.7em] py-[0.1em] font-bold ${parallel ? "border-[#4f46e5] bg-[#4f46e5] text-white" : "border-[#d9c79d] bg-white hover:bg-[#eef2ff]"}`}>
          Em paralelo
        </button>
        <button type="button" onClick={() => setBurnt((b) => !b)} className="rounded-full border border-[#b91c1c] bg-white px-[0.7em] py-[0.1em] font-black text-[#b91c1c] hover:bg-[#fef2f2]">
          {burnt ? "🔧 Trocar a lâmpada" : "💥 Queimar a lâmpada do meio"}
        </button>
      </div>
      <p className="mt-[0.3em] rounded-lg bg-[#eef2ff] px-[0.6em] py-[0.3em] text-center text-[0.86em] text-[#312e81]">
        {burnt
          ? parallel
            ? "Em paralelo, cada lâmpada tem o seu caminho: as outras continuam acesas!"
            : "Em série, o caminho é um só: se uma queima, o circuito abre e tudo apaga."
          : parallel
            ? "Em paralelo, cada lâmpada tem o próprio caminho para a corrente."
            : "Em série, a corrente passa por uma lâmpada depois da outra."}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// O relógio de luz contando os quilowatts-hora
// ---------------------------------------------------------------------------

function MeterArt() {
  return (
    <Art viewBox="0 0 560 200" label="O relógio de luz com o disco girando e os números contando os quilowatts-hora gastos pelo chuveiro">
      <rect x="40" y="20" width="180" height="160" rx="14" fill="#e2e8f0" stroke="#475569" strokeWidth="3" />
      <rect x="64" y="40" width="132" height="32" rx="4" fill="#1e293b" />
      {[0, 1, 2, 3, 4].map((d) => (
        <text key={d} x={80 + d * 25} y="63" textAnchor="middle" fontSize="18" fontWeight="900" fill="#4ade80" fontFamily="monospace">
          {d === 4 ? (
            <tspan>
              <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />5
            </tspan>
          ) : (
            "0"
          )}
        </text>
      ))}
      <ellipse cx="130" cy="130" rx="60" ry="14" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
      <rect x="126" y="117" width="8" height="26" fill="#dc2626">
        <animateTransform attributeName="transform" type="translate" values="-50 0;50 0;-50 0" dur="0.6s" repeatCount="indefinite" />
      </rect>
      <text x="130" y="170" textAnchor="middle" fontSize="12" fontWeight="900" fill="#1e293b" fontFamily="Georgia, serif">
        kWh
      </text>
      {/* o chuveiro */}
      <g transform="translate(380 30)">
        <path d="M0 0 L0 40 L40 40" stroke="#64748b" strokeWidth="8" fill="none" />
        <ellipse cx="60" cy="48" rx="30" ry="10" fill="#94a3b8" />
        {Array.from({ length: 6 }, (_, i) => (
          <path key={i} d={`M${40 + i * 8} 56 l-4 14`} stroke="#38bdf8" strokeWidth="3" strokeLinecap="round">
            <animateTransform attributeName="transform" type="translate" values="0 0;-6 60" dur="0.7s" begin={`${-i * 0.12}s`} repeatCount="indefinite" />
          </path>
        ))}
      </g>
      <g fontFamily="Georgia, serif" fontSize="13" fontWeight="900">
        <text x="340" y="160" fill="#3b2a14">chuveiro de 5.000 W</text>
        <text x="340" y="180" fill="#3b2a14">por 1 hora = 5 kWh</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os ímãs: atração, repulsão, a Terra e o gerador
// ---------------------------------------------------------------------------

function MagnetsArt() {
  const bar = (x: number, left: string, right: string) => (
    <g>
      <rect x={x} y="-14" width="40" height="28" fill={left === "N" ? "#dc2626" : "#2563eb"} stroke="#1e293b" strokeWidth="1.5" />
      <rect x={x + 40} y="-14" width="40" height="28" fill={right === "N" ? "#dc2626" : "#2563eb"} stroke="#1e293b" strokeWidth="1.5" />
      <text x={x + 20} y="6" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff">
        {left}
      </text>
      <text x={x + 60} y="6" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff">
        {right}
      </text>
    </g>
  );
  return (
    <Art viewBox="0 0 600 230" label="Polos diferentes se atraem e polos iguais se repelem; a Terra é um grande ímã que orienta a bússola; e o ímã girando na bobina gera eletricidade">
      {/* atração */}
      <g transform="translate(0 50)">
        {bar(10, "S", "N")}
        <g>
          <animateTransform attributeName="transform" type="translate" values="40 0;0 0;0 0;40 0" keyTimes="0;0.4;0.8;1" dur="3s" repeatCount="indefinite" />
          {bar(96, "S", "N")}
        </g>
        <text x="96" y="40" textAnchor="middle" fontSize="12" fontWeight="900" fill="#15803d" fontFamily="Georgia, serif">
          diferentes: se atraem
        </text>
      </g>
      {/* repulsão */}
      <g transform="translate(0 150)">
        {bar(10, "S", "N")}
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0;40 0;40 0;0 0" keyTimes="0;0.4;0.8;1" dur="3s" repeatCount="indefinite" />
          {bar(96, "N", "S")}
        </g>
        <text x="96" y="40" textAnchor="middle" fontSize="12" fontWeight="900" fill="#b91c1c" fontFamily="Georgia, serif">
          iguais: se repelem
        </text>
      </g>
      {/* a Terra como ímã */}
      <g transform="translate(330 110)">
        {[40, 60].map((r) => (
          <ellipse key={r} rx={r} ry={r * 1.4} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 4" className="cg-anim-dash" />
        ))}
        <circle r="34" fill="#3b82f6" />
        <path d="M-20 -14 C-8 -24 8 -20 14 -8 C4 0 -10 4 -20 -14 Z M-6 10 C6 6 18 12 16 22 C4 26 -6 20 -6 10 Z" fill="#22c55e" />
        <text y="-96" textAnchor="middle" fontSize="11" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
          norte geográfico
        </text>
      </g>
      {/* o gerador: ímã girando dentro da bobina */}
      <g transform="translate(500 120)">
        {[-26, -14, -2, 10, 22].map((x) => (
          <ellipse key={x} cx={x} rx="6" ry="30" fill="none" stroke="#b45309" strokeWidth="3" />
        ))}
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1.5s" repeatCount="indefinite" />
          <rect x="-24" y="-7" width="24" height="14" fill="#dc2626" />
          <rect x="0" y="-7" width="24" height="14" fill="#2563eb" />
        </g>
        <path d="M30 0 L60 0 L60 -50" stroke="#b45309" strokeWidth="3" fill="none" />
        <Bulb on x={60} y={-50} s={0.8} />
        <text y="60" textAnchor="middle" fontSize="11.5" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
          gerador
        </text>
      </g>
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
      title="Eletricidade e Magnetismo"
      goals={["O que são corrente, tensão e resistência", "A diferença entre circuitos em série e em paralelo", "Como calcular o consumo de energia", "Como os ímãs funcionam e como se gera eletricidade"]}
    >
      <Fig h={34}>
        <MagnetOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🔌">Corrente, tensão e resistência</H>
      <List
        items={[
          <>
            <T>Corrente elétrica</T>: o movimento ordenado dos elétrons nos fios, medido em <T>ampères (A)</T>.
          </>,
          <>
            <T>Tensão</T> (diferença de potencial): o &ldquo;empurrão&rdquo; que faz a corrente andar, medido em <T>volts (V)</T>. As tomadas do Brasil têm 127 V ou 220 V.
          </>,
          <>
            <T>Resistência</T>: a dificuldade que o material oferece à corrente, medida em <T>ohms (Ω)</T>.
          </>,
        ]}
      />
      <Fig n="9.1" caption="A Primeira Lei de Ohm liga as três grandezas." h={22}>
        <CircuitArt />
      </Fig>
      <P>
        A <T>Primeira Lei de Ohm</T> diz que <strong>U = R × i</strong>. Os <T>metais</T>, como o cobre dos fios, são bons <T>condutores</T>; a borracha e o plástico são{" "}
        <T>isolantes</T>, e por isso cobrem os fios.
      </P>
    </>,
  ),

  page(
    <>
      <H icon="💡">Circuitos em série e em paralelo</H>
      <P>
        Num circuito <T>em série</T>, a corrente passa por um aparelho depois do outro, num caminho só. Num circuito <T>em paralelo</T>, cada aparelho tem o seu próprio caminho.
        Teste os dois e queime uma lâmpada:
      </P>
      <CircuitSim />
      <Box kind="lembre">
        As instalações das casas são <strong>em paralelo</strong>: se uma lâmpada queima, o resto da casa continua funcionando. Já os pisca-piscas antigos de Natal eram em
        série: uma lâmpada queimada apagava a fileira inteira!
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🧾">Potência e consumo de energia</H>
      <P>
        A <T>potência</T> de um aparelho (em watts) diz quanta energia ele gasta por segundo. O consumo é <strong>energia = potência × tempo</strong>, e a conta de luz usa o{" "}
        <T>quilowatt-hora (kWh)</T>.
      </P>
      <Fig n="9.2" caption="5.000 W = 5 kW. Ligado por 1 hora: 5 kW × 1 h = 5 kWh." h={20}>
        <MeterArt />
      </Fig>
      <Table
        head={["Aparelho", "Potência típica"]}
        rows={[
          ["Lâmpada de LED", "9 W"],
          ["Televisão", "100 W"],
          ["Geladeira", "150 W"],
          ["Micro-ondas", "1.200 W"],
          ["Chuveiro elétrico", "5.000 W"],
        ]}
      />
      <Box kind="atencao">
        No <strong>curto-circuito</strong>, a corrente dispara e esquenta os fios, podendo causar incêndio. Os <strong>disjuntores</strong> e os fusíveis desligam o circuito para
        evitar acidentes.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🧲">Ímãs e eletromagnetismo</H>
      <P>
        Todo <T>ímã</T> tem dois polos, o <T>norte</T> e o <T>sul</T>. <T>Polos diferentes se atraem</T> e <T>polos iguais se repelem</T>. Se você quebrar um ímã, cada pedaço vira
        um ímã novo, com norte e sul!
      </P>
      <Fig n="9.3" caption="A atração, a repulsão, a Terra como um ímã gigante e o gerador." h={24}>
        <MagnetsArt />
      </Fig>
      <List
        items={[
          <>
            A <T>Terra</T> tem um campo magnético. O norte da agulha da <T>bússola</T> aponta para perto do polo norte geográfico, onde fica o polo sul magnético da Terra.
          </>,
          <>
            Nos <T>geradores</T> das usinas, ímãs e bobinas giram e produzem corrente: é a <T>indução eletromagnética</T>, descoberta por Michael Faraday.
          </>,
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Corrente (A), tensão (V) e resistência (Ω) se ligam pela Lei de Ohm: U = R × i.",
          "Metais conduzem; borracha e plástico isolam.",
          "Em série, um caminho só; em paralelo, cada aparelho tem o seu (as casas são em paralelo).",
          "Energia = potência × tempo; a conta de luz é em kWh.",
          "Polos iguais se repelem e diferentes se atraem. Geradores usam a indução eletromagnética.",
        ]}
      />
      <Glossary
        items={[
          ["Corrente elétrica", "Movimento ordenado dos elétrons, em ampères."],
          ["Tensão", "O “empurrão” que faz a corrente andar, em volts."],
          ["Resistência", "A dificuldade à passagem da corrente, em ohms."],
          ["kWh", "Quilowatt-hora: a unidade de energia da conta de luz."],
          ["Indução eletromagnética", "Geração de corrente pelo movimento de ímãs e bobinas."],
        ]}
      />
      <Quiz
        items={[
          ["Em que unidade se mede a tensão elétrica?", "Em volts (V)."],
          ["Um chuveiro de 5.000 W ligado por 1 hora consome quanto?", "5 kWh."],
          ["Por que as lâmpadas de uma casa ficam em paralelo?", "Para cada uma ter o seu caminho: se uma queima, as outras continuam acesas."],
          ["O que acontece ao aproximar o norte de um ímã do norte de outro?", "Eles se repelem."],
        ]}
      />
    </>,
  ),
];
