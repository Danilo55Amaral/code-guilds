"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Arrow, Person } from "./art";

// ============================================================================
// CAPÍTULO 3 — TRABALHO, POTÊNCIA E MÁQUINAS SIMPLES (missão "Física:
// Trabalho, Potência e Máquinas Simples"): as engrenagens girando, a caixa
// empurrada (trabalho = força × distância), a gangorra de tocar (força ×
// distância dos dois lados), a roldana, a rampa, a mola e o rendimento.
// ============================================================================

function gearPath(r: number, teeth: number): string {
  const pts: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i / (teeth * 2)) * Math.PI * 2;
    const rr = i % 2 ? r : r + 8;
    const a2 = a + Math.PI / (teeth * 2);
    pts.push(`${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)}`, `${(Math.cos(a2) * rr).toFixed(1)} ${(Math.sin(a2) * rr).toFixed(1)}`);
  }
  return `M${pts.join(" L")} Z`;
}

// ---------------------------------------------------------------------------
// Abertura: as engrenagens girando
// ---------------------------------------------------------------------------

function GearsOpenerArt() {
  const gears = [
    { x: 160, y: 140, r: 70, t: 14, dur: 14, color: "#4f46e5" },
    { x: 296, y: 116, r: 50, t: 10, dur: 10, color: "#f59e0b", rev: true },
    { x: 300, y: 222, r: 34, t: 7, dur: 6.8, color: "#16a34a" },
  ];
  return (
    <Art viewBox="0 0 460 300" label="Três engrenagens encaixadas girando: a grande devagar e as pequenas mais rápido">
      {gears.map((g) => (
        <g key={g.color} transform={`translate(${g.x} ${g.y})`}>
          <g>
            <animateTransform attributeName="transform" type="rotate" from={g.rev ? "360" : "0"} to={g.rev ? "0" : "360"} dur={`${g.dur}s`} repeatCount="indefinite" />
            <path d={gearPath(g.r, g.t)} fill={g.color} stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
            <circle r={g.r * 0.55} fill="#f8fafc" stroke="#1e293b" strokeWidth="2" />
            <circle r={g.r * 0.18} fill="#1e293b" />
            {[0, 90, 180, 270].map((a) => (
              <rect key={a} x={-3} y={-g.r * 0.5} width="6" height={g.r * 0.3} fill={g.color} transform={`rotate(${a})`} />
            ))}
          </g>
        </g>
      ))}
      {/* a alavanca */}
      <g transform="translate(400 250)">
        <path d="M-14 0 L14 0 L0 -20 Z" fill="#78350f" />
        <g>
          <animateTransform attributeName="transform" type="rotate" values="-12 0 -20;12 0 -20;-12 0 -20" dur="3s" repeatCount="indefinite" />
          <rect x="-56" y="-26" width="112" height="8" rx="3" fill="#a16207" />
          <rect x="-56" y="-46" width="22" height="20" rx="3" fill="#475569" />
        </g>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Trabalho: empurrar a caixa por 3 metros
// ---------------------------------------------------------------------------

function WorkArt() {
  return (
    <Art viewBox="0 0 560 200" label="Uma pessoa empurra uma caixa com 10 newtons de força por 3 metros: o trabalho é de 30 joules">
      <rect y="160" width="560" height="40" fill="#d6d3d1" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;240 0;240 0;0 0" keyTimes="0;0.6;0.85;1" dur="5s" repeatCount="indefinite" />
        <g transform="translate(80 160) rotate(14)">
          <Person color="#16a34a" />
        </g>
        <rect x="104" y="100" width="70" height="60" rx="4" fill="#d97706" stroke="#78350f" strokeWidth="2.5" />
        <path d="M104 130 L174 130 M139 100 L139 160" stroke="#78350f" strokeWidth="1.5" opacity="0.6" />
        <Arrow x1={120} y1={84} x2={176} y2={84} label="F = 10 N" />
      </g>
      <path d="M140 186 L380 186" stroke="#1e293b" strokeWidth="2" />
      <path d="M140 180 L140 192 M380 180 L380 192" stroke="#1e293b" strokeWidth="2" />
      <text x="260" y="182" textAnchor="middle" fontSize="13" fontWeight="900" fill="#1e293b" fontFamily="Georgia, serif">
        d = 3 m
      </text>
      <text x="280" y="30" textAnchor="middle" fontSize="16" fontWeight="900" fill="#4f46e5" fontFamily="Georgia, serif">
        τ = F × d
      </text>
      <text x="280" y="52" textAnchor="middle" fontSize="14" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
        = 10 × 3 = 30 J
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A gangorra de tocar: força × distância dos dois lados
// ---------------------------------------------------------------------------

export function Seesaw() {
  const [d, setD] = useState(1);
  const left = 60 * 1; // o adulto de 60 kg a 1 m do apoio
  const right = 30 * d; // a criança de 30 kg a d metros
  const diff = right - left;
  const angle = Math.max(-14, Math.min(14, diff / 3));
  const balanced = diff === 0;
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <svg viewBox="0 0 520 170" className="block w-full" aria-label={balanced ? "Gangorra equilibrada" : "Gangorra desequilibrada"}>
        <path d="M244 160 L276 160 L260 120 Z" fill="#78350f" />
        <rect y="160" width="520" height="10" fill="#86efac" />
        <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: "260px 118px", transition: "transform 0.8s cubic-bezier(0.34, 1.4, 0.64, 1)" }}>
          <rect x="20" y="112" width="480" height="10" rx="4" fill="#a16207" stroke="#78350f" strokeWidth="2" />
          {[1, 2, 3].map((m) => (
            <g key={m}>
              <line x1={260 - m * 72} y1="122" x2={260 - m * 72} y2="128" stroke="#78350f" strokeWidth="2" />
              <line x1={260 + m * 72} y1="122" x2={260 + m * 72} y2="128" stroke="#78350f" strokeWidth="2" />
              <text x={260 + m * 72} y="140" textAnchor="middle" fontSize="10" fill="#5b4a2e">
                {m} m
              </text>
            </g>
          ))}
          {/* o adulto (60 kg) e a criança (30 kg) */}
          <g transform="translate(188 112)">
            <Person color="#2563eb" />
          </g>
          <g transform={`translate(${260 + d * 72} 112)`} style={{ transition: "transform 0.5s" }}>
            <Person color="#db2777" scale={0.7} />
          </g>
        </g>
        <text x="188" y="20" textAnchor="middle" fontSize="12" fontWeight="900" fill="#1d4ed8" fontFamily="Georgia, serif">
          adulto: 60 kg
        </text>
        <text x="400" y="20" textAnchor="middle" fontSize="12" fontWeight="900" fill="#be185d" fontFamily="Georgia, serif">
          criança: 30 kg
        </text>
      </svg>
      <label className="mt-[0.3em] block text-[0.88em]">
        <span className="font-bold">Distância da criança até o apoio: {d.toLocaleString("pt-BR")} m</span>
        <input type="range" min={0.5} max={3} step={0.5} value={d} onChange={(e) => setD(Number(e.target.value))} className="w-full accent-[#db2777]" />
      </label>
      <p className={`mt-[0.3em] rounded-lg px-[0.6em] py-[0.3em] text-center text-[0.9em] font-bold ${balanced ? "cg-anim-pop bg-[#dcfce7] text-[#15803d]" : "bg-[#eef2ff] text-[#312e81]"}`}>
        60 × 1 = {left} &nbsp;|&nbsp; 30 × {d.toLocaleString("pt-BR")} = {right} {balanced ? "→ equilibrada! ✓" : diff > 0 ? "→ a criança desce" : "→ o adulto desce"}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A roldana fixa, a roldana móvel e a rampa
// ---------------------------------------------------------------------------

function PulleyRampArt() {
  return (
    <Art viewBox="0 0 600 220" label="A roldana fixa muda a direção da força; a roldana móvel divide a força por dois; e a rampa diminui a força, mas aumenta a distância">
      {/* roldana fixa do poço */}
      <g>
        <rect x="40" y="20" width="120" height="8" fill="#78350f" />
        <circle cx="100" cy="44" r="16" fill="#cbd5e1" stroke="#475569" strokeWidth="3" />
        <path d="M84 44 L84 140 M116 44 L116 120" stroke="#a16207" strokeWidth="3" />
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0;0 -40;0 0" dur="3s" repeatCount="indefinite" />
          <path d="M70 140 L98 140 L94 168 L74 168 Z" fill="#64748b" stroke="#334155" strokeWidth="2" />
        </g>
        <Arrow x1={116} y1={120} x2={116} y2={180} color="#16a34a" label="F" />
        <text x="100" y="208" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
          roldana fixa
        </text>
      </g>
      {/* roldana móvel */}
      <g>
        <rect x="220" y="20" width="120" height="8" fill="#78350f" />
        <path d="M240 28 L240 110 M300 110 L300 28" stroke="#a16207" strokeWidth="3" />
        <circle cx="270" cy="110" r="30" fill="none" stroke="#a16207" strokeWidth="3" strokeDasharray="94 200" transform="rotate(0 270 110)" />
        <circle cx="270" cy="110" r="16" fill="#cbd5e1" stroke="#475569" strokeWidth="3" />
        <rect x="254" y="132" width="32" height="30" rx="3" fill="#d97706" stroke="#78350f" strokeWidth="2" />
        <text x="270" y="152" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff">
          200 N
        </text>
        <Arrow x1={300} y1={40} x2={300} y2={4} color="#16a34a" label="100 N" />
        <text x="270" y="208" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
          roldana móvel: metade
        </text>
      </g>
      {/* a rampa */}
      <g>
        <path d="M380 180 L580 180 L580 90 Z" fill="#d6d3d1" stroke="#57534e" strokeWidth="2" />
        <g>
          <animateMotion path="M400 168 L560 98" dur="3.5s" repeatCount="indefinite" rotate="auto" />
          <rect x="-16" y="-20" width="32" height="22" rx="3" fill="#d97706" stroke="#78350f" strokeWidth="2" />
        </g>
        <text x="480" y="208" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
          rampa: menos força
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A mola (Lei de Hooke) e o rendimento
// ---------------------------------------------------------------------------

function springPath(x: number, top: number, len: number): string {
  const coils = 10;
  const pts: string[] = [`M${x} ${top}`];
  for (let i = 1; i <= coils; i++) pts.push(`L${x + (i % 2 ? -12 : 12)} ${top + (len * i) / (coils + 1)}`);
  pts.push(`L${x} ${top + len}`);
  return pts.join(" ");
}

function SpringEfficiencyArt() {
  return (
    <Art viewBox="0 0 600 210" label="A mola estica o dobro quando a força dobra; e numa máquina, parte da energia que entra vira calor e não é aproveitada">
      <rect x="20" y="10" width="220" height="8" fill="#475569" />
      {[
        [70, 60, 1],
        [180, 120, 2],
      ].map(([x, len, n]) => (
        <g key={x}>
          <path d={springPath(x, 18, len)} stroke="#64748b" strokeWidth="3" fill="none" />
          {Array.from({ length: n }, (_, k) => (
            <rect key={k} x={x - 18} y={18 + len + k * 24} width="36" height="22" rx="3" fill="#4f46e5" stroke="#312e81" strokeWidth="2" />
          ))}
          <text x={x} y="196" textAnchor="middle" fontSize="12" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
            {n === 1 ? "F → x" : "2F → 2x"}
          </text>
        </g>
      ))}
      {/* o rendimento */}
      <g transform="translate(250 40)">
        <rect x="0" y="40" width="80" height="60" fill="#f59e0b" />
        <text x="40" y="76" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff">
          100 J
        </text>
        <path d="M80 40 L230 40 L230 82 L80 82 Z" fill="#22c55e" />
        <path d="M80 82 L180 82 C200 82 200 130 220 130 L250 130 L250 150 L220 150 C190 150 180 100 140 100 L80 100 Z" fill="#ef4444" opacity="0.85" />
        <text x="250" y="66" fontSize="12.5" fontWeight="900" fill="#15803d">70 J úteis</text>
        <text x="256" y="145" fontSize="12.5" fontWeight="900" fill="#b91c1c">30 J de calor</text>
        <text x="130" y="0" textAnchor="middle" fontSize="13" fontWeight="900" fill="#3b2a14">rendimento = 70%</text>
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M${226 + k * 8} 150 q-4 -6 0 -12 q4 -6 0 -12`} stroke="#ef4444" strokeWidth="2" fill="none" className="cg-anim-aura-rise" style={{ "--cg-dur": "2s", "--cg-delay": `${k * 0.6}s` } as React.CSSProperties} />
        ))}
      </g>
    </Art>
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
      title="Trabalho, Potência e Máquinas"
      goals={["O que é trabalho na Física", "O que é potência e o que é o watt", "Como alavancas, roldanas e rampas facilitam a vida", "A Lei de Hooke e o rendimento das máquinas"]}
    >
      <Fig h={34}>
        <GearsOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="📦">Trabalho e potência</H>
      <P>
        Na Física, <T>trabalho</T> é a energia transferida quando uma força faz um corpo se deslocar. Se a força tem a mesma direção do movimento, o trabalho é a força vezes a
        distância: <strong>τ = F × d</strong>, medido em <T>joules (J)</T>.
      </P>
      <Fig n="3.1" caption="Empurrar uma caixa com 10 N por 3 m realiza 30 J de trabalho." h={22}>
        <WorkArt />
      </Fig>
      <P>
        A <T>potência</T> mede a rapidez com que o trabalho é feito: <strong>P = trabalho ÷ tempo</strong>, em <T>watts (W)</T>. Um motor que faz 600 J em 3 s tem potência de
        600 ÷ 3 = <T>200 W</T>. Dois motores podem fazer o mesmo trabalho, mas o mais potente faz em menos tempo.
      </P>
      <Box kind="lembre">Segurar uma mala parada cansa, mas não realiza trabalho na Física: sem deslocamento, não há trabalho!</Box>
    </>,
  ),

  page(
    <>
      <H icon="⚖️">As alavancas</H>
      <P>
        As <T>máquinas simples</T> não criam energia, mas facilitam o trabalho: diminuem a força necessária, em troca de uma distância maior. A mais antiga é a{" "}
        <T>alavanca</T>: uma barra que gira em volta de um ponto de apoio. Ela fica equilibrada quando <strong>força × distância</strong> é igual dos dois lados.
      </P>
      <P>Mova a criança para equilibrar a gangorra com o adulto:</P>
      <Seesaw />
      <Box kind="sabia">Arquimedes teria dito: &ldquo;Dê-me uma alavanca e um ponto de apoio, e eu moverei o mundo!&rdquo;</Box>
    </>,
  ),

  page(
    <>
      <H icon="🏗️">Roldanas, rampas e ferramentas</H>
      <P>
        A <T>roldana fixa</T> (como a do poço) não diminui a força, mas muda a direção: é mais fácil puxar para baixo do que levantar. A <T>roldana móvel</T> divide a força por
        dois. E o <T>plano inclinado</T> (a rampa) diminui a força, mas o caminho fica mais longo.
      </P>
      <Fig n="3.2" caption="Três máquinas simples que usamos sem perceber." h={24}>
        <PulleyRampArt />
      </Fig>
      <Cards
        items={[
          { icon: "✂️", title: "Tesoura e alicate", text: "São alavancas: o eixo que une as duas partes é o ponto de apoio." },
          { icon: "♿", title: "Rampas de acessibilidade", text: "Usam o plano inclinado para subir com menos força." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🌀">Molas e rendimento</H>
      <P>
        Uma mola estica proporcionalmente à força: se a força dobra, a deformação dobra. É a <T>Lei de Hooke</T>: <strong>F = k × x</strong>, em que k é a constante da mola (o
        quanto ela é &ldquo;dura&rdquo;) e x é quanto ela estica.
      </P>
      <Fig n="3.3" caption="A mola estica o dobro com o dobro da força. E nenhuma máquina aproveita 100% da energia." h={22}>
        <SpringEfficiencyArt />
      </Fig>
      <P>
        O <T>rendimento</T> de uma máquina é a parte da energia que ela realmente aproveita. Nenhuma máquina real tem 100% de rendimento: parte da energia sempre vira calor por
        causa do atrito.
      </P>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Trabalho = força × distância (em joules). Sem deslocamento, não há trabalho.",
          "Potência = trabalho ÷ tempo (em watts).",
          "Na alavanca, força × distância ao apoio precisa ser igual dos dois lados.",
          "Roldana fixa muda a direção; a móvel divide a força por 2; a rampa diminui a força e aumenta o caminho.",
          "Lei de Hooke: F = k × x. Nenhuma máquina tem rendimento de 100%.",
        ]}
      />
      <Glossary
        items={[
          ["Trabalho", "Energia transferida por uma força ao deslocar um corpo."],
          ["Potência", "A rapidez com que o trabalho é feito."],
          ["Watt (W)", "A unidade de potência: 1 joule por segundo."],
          ["Máquina simples", "Alavanca, roldana, rampa: facilitam o trabalho."],
          ["Rendimento", "A parte da energia que a máquina aproveita."],
        ]}
      />
      <Quiz
        items={[
          ["Quanto trabalho realiza uma força de 10 N empurrando uma caixa por 3 m?", "30 J."],
          ["Um motor faz 600 J em 3 s. Qual a potência?", "600 ÷ 3 = 200 W."],
          ["Como uma criança leve equilibra um adulto na gangorra?", "Sentando mais longe do apoio: força × distância fica igual dos dois lados."],
          ["O que faz a roldana fixa?", "Muda a direção da força, sem diminuí-la."],
        ]}
      />
    </>,
  ),
];
