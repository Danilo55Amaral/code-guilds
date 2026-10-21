"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { MATH, MATH_DARK, Panel, Slider } from "./art";

// ============================================================================
// CAPÍTULO 8 — PITÁGORAS, CÍRCULO E TRIGONOMETRIA (missão "Matemática:
// Geometria e Trigonometria", a outra metade): os quadrados do triângulo 3, 4
// e 5, os quadrados de Pitágoras (de tocar), a roda que desenrola o π, a caixa
// se enchendo de cubinhos e os lados do triângulo retângulo da trigonometria.
// ============================================================================

const num = (v: number) => v.toLocaleString("pt-BR", { maximumFractionDigits: 2 });

// ---------------------------------------------------------------------------
// Os quadrados nos lados do triângulo retângulo (a abertura e o de tocar usam)
// ---------------------------------------------------------------------------

/** Os pontos (já na tela, y pra baixo) do triângulo de catetos a e b e dos três quadrados. */
function pythagorasShapes(a: number, b: number, u: number) {
  const pt = (x: number, y: number): [number, number] => [x * u, -y * u];
  const tri = [pt(0, 0), pt(a, 0), pt(0, b)];
  const sqA = [pt(0, 0), pt(a, 0), pt(a, -a), pt(0, -a)];
  const sqB = [pt(0, 0), pt(0, b), pt(-b, b), pt(-b, 0)];
  const sqC = [pt(0, b), pt(a, 0), pt(a + b, a), pt(b, a + b)];
  const all = [...tri, ...sqA, ...sqB, ...sqC];
  const xs = all.map((p) => p[0]);
  const ys = all.map((p) => p[1]);
  const box = { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
  const str = (ps: [number, number][]) => ps.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ");
  return { tri: str(tri), sqA: str(sqA), sqB: str(sqB), sqC: str(sqC), box };
}

function PythagorasOpenerArt() {
  const s = pythagorasShapes(4, 3, 26);
  const pad = 20;
  return (
    <Art viewBox={`${s.box.x - pad} ${s.box.y - pad} ${s.box.w + pad * 2} ${s.box.h + pad * 2}`} label="Um triângulo retângulo de lados 3, 4 e 5 com um quadrado em cada lado: 9 mais 16 dá 25, a área do quadrado maior">
      <rect x={s.box.x - pad} y={s.box.y - pad} width={s.box.w + pad * 2} height={s.box.h + pad * 2} fill="#f5f3ff" />
      {[
        { pts: s.sqA, c: "#93c5fd", t: "16", d: 0 },
        { pts: s.sqB, c: "#fdba74", t: "9", d: 1 },
        { pts: s.sqC, c: "#c4b5fd", t: "25", d: 2 },
      ].map((q) => (
        <polygon key={q.t} points={q.pts} fill={q.c} stroke={MATH_DARK} strokeWidth="2.5">
          <animate attributeName="fill-opacity" values="0.25;0.25;1;1;0.25" keyTimes={`0;${(q.d * 0.25).toFixed(2)};${(q.d * 0.25 + 0.15).toFixed(2)};0.85;1`} dur="6s" repeatCount="indefinite" />
        </polygon>
      ))}
      <polygon points={s.tri} fill="#fde68a" stroke={MATH_DARK} strokeWidth="3" />
      <g fontFamily="Georgia, serif" fontWeight="900" textAnchor="middle" fill={MATH_DARK}>
        <text x={2 * 26} y={2 * 26 + 10} fontSize="30">
          16
        </text>
        <text x={-1.5 * 26} y={-1.5 * 26 + 10} fontSize="30">
          9
        </text>
        <text x={3.5 * 26} y={-3.5 * 26 + 10} fontSize="34">
          25
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os quadrados de Pitágoras (de tocar)
// ---------------------------------------------------------------------------

export function PythagorasExplorer() {
  const [a, setA] = useState(4);
  const [b, setB] = useState(3);
  const s = pythagorasShapes(a, b, 10);
  const c = Math.sqrt(a * a + b * b);
  const pad = 6;
  return (
    <Panel title="Os quadrados de Pitágoras">
      <div className="flex flex-wrap items-center justify-center gap-[0.8em]">
        <svg viewBox={`${s.box.x - pad} ${s.box.y - pad} ${s.box.w + pad * 2} ${s.box.h + pad * 2}`} className="h-[8.5em] w-[8.5em] shrink-0" aria-label={`Triângulo de catetos ${a} e ${b}`}>
          <polygon points={s.sqA} fill="#93c5fd" stroke={MATH_DARK} strokeWidth="1.5" />
          <polygon points={s.sqB} fill="#fdba74" stroke={MATH_DARK} strokeWidth="1.5" />
          <polygon points={s.sqC} fill="#c4b5fd" stroke={MATH_DARK} strokeWidth="1.5" />
          <polygon points={s.tri} fill="#fde68a" stroke={MATH_DARK} strokeWidth="2" />
        </svg>
        <div className="min-w-[11em] flex-1 space-y-[0.3em]">
          <Slider label="cateto a" labelWidth="4.5em" value={a} min={1} max={8} onChange={setA} />
          <Slider label="cateto b" labelWidth="4.5em" value={b} min={1} max={8} onChange={setB} />
          <p className="text-center text-[0.9em]">
            <span style={{ color: "#2563eb" }}>{a * a}</span> + <span style={{ color: "#ea580c" }}>{b * b}</span> ={" "}
            <strong style={{ color: MATH_DARK }}>{a * a + b * b}</strong>
          </p>
          <p className="cg-book-title text-center text-[1.1em] font-black" style={{ color: MATH_DARK }}>
            hipotenusa = √{a * a + b * b} {Number.isInteger(c) ? `= ${c}` : `≈ ${num(c)}`}
          </p>
        </div>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// A roda que desenrola o π
// ---------------------------------------------------------------------------

function PiWheelArt() {
  const r = 26;
  const len = 2 * Math.PI * r; // ≈ 163
  return (
    <Art viewBox="0 0 560 160" label="Uma roda de raio 1 dá uma volta inteira no chão e deixa uma linha de comprimento 2 vezes pi, mais ou menos 6,28">
      <rect width="560" height="160" rx="14" fill="#faf5ff" />
      <line x1="40" y1="120" x2="520" y2="120" stroke="#334155" strokeWidth="2" />
      {/* o rastro que a roda deixa */}
      <line x1="80" y1="120" x2={80 + len * 2} y2="120" stroke="#f97316" strokeWidth="5" strokeDasharray={len * 2} strokeDashoffset={len * 2}>
        <animate attributeName="stroke-dashoffset" values={`${len * 2};0;0`} keyTimes="0;0.7;1" dur="5s" repeatCount="indefinite" />
      </line>
      <g>
        <animateTransform attributeName="transform" type="translate" values={`0 0;${len * 2} 0;${len * 2} 0`} keyTimes="0;0.7;1" dur="5s" repeatCount="indefinite" />
        <g transform={`translate(80 ${120 - r * 2})`}>
          <g>
            <animateTransform attributeName="transform" type="rotate" values="0;360;360" keyTimes="0;0.7;1" dur="5s" repeatCount="indefinite" />
            <circle r={r * 2} fill="#ede9fe" stroke={MATH_DARK} strokeWidth="3" />
            <line x1="0" y1="0" x2="0" y2={r * 2} stroke="#f97316" strokeWidth="3" />
            <circle cy={r * 2} r="5" fill="#f97316" />
          </g>
        </g>
      </g>
      <text x="300" y="148" textAnchor="middle" fontSize="13" fontWeight="900" fill={MATH_DARK} fontFamily="Georgia, serif">
        uma volta da roda = 2 × π × raio ≈ 6,28 raios
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A caixa se enchendo de cubinhos
// ---------------------------------------------------------------------------

function VolumeArt() {
  const u = 22;
  const h = u * 0.866;
  const cube = (i: number, j: number, k: number, n: number) => {
    const x = 170 + (i - j) * h;
    const y = 70 + (i + j) * u * 0.5 - k * u;
    return (
      <g key={`${i}${j}${k}`}>
        <animate attributeName="opacity" values="0;0;1;1;0" keyTimes={`0;${(n / 64) * 0.75};${(n / 64) * 0.75 + 0.01};0.9;1`} dur="7s" repeatCount="indefinite" />
        <path d={`M${x} ${y} L${x + h} ${y + u / 2} L${x} ${y + u} L${x - h} ${y + u / 2} Z`} fill="#ddd6fe" stroke={MATH_DARK} strokeWidth="0.8" />
        <path d={`M${x - h} ${y + u / 2} L${x} ${y + u} L${x} ${y + 2 * u} L${x - h} ${y + 1.5 * u} Z`} fill="#a78bfa" stroke={MATH_DARK} strokeWidth="0.8" />
        <path d={`M${x + h} ${y + u / 2} L${x} ${y + u} L${x} ${y + 2 * u} L${x + h} ${y + 1.5 * u} Z`} fill="#7c3aed" stroke={MATH_DARK} strokeWidth="0.8" />
      </g>
    );
  };
  const cubes: React.ReactNode[] = [];
  let n = 0;
  for (let k = 0; k < 4; k++) for (let s = 0; s <= 6; s++) for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) if (i + j === s) cubes.push(cube(i, j, k, n++));
  return (
    <Art viewBox="0 0 560 200" label="Um cubo de aresta 4 sendo montado com cubinhos de 1 centímetro, camada por camada: 4 vezes 4 vezes 4 dá 64 cubinhos">
      <rect width="560" height="200" rx="14" fill="#faf5ff" />
      {cubes}
      <g fontFamily="Georgia, serif" fontWeight="900">
        <text x="330" y="70" fontSize="16" fill="#334155">
          cada camada: 4 × 4 = 16
        </text>
        <text x="330" y="100" fontSize="16" fill="#334155">
          4 camadas: 16 × 4
        </text>
        <text x="330" y="138" fontSize="22" fill={MATH_DARK}>
          4³ = 64 cm³
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os lados do triângulo retângulo (trigonometria)
// ---------------------------------------------------------------------------

function TrigArt() {
  const sides = [
    { d: "M230 40 L230 160", label: "cateto oposto", x: 240, y: 104, c: "#ea580c", anchor: "start" as const },
    { d: "M40 160 L230 160", label: "cateto adjacente", x: 135, y: 182, c: "#2563eb", anchor: "middle" as const },
    { d: "M40 160 L230 40", label: "hipotenusa", x: 128, y: 92, c: MATH, anchor: "end" as const },
  ];
  return (
    <Art viewBox="0 0 560 200" label="Um triângulo retângulo com o ângulo alfa no canto esquerdo: o cateto oposto em frente a ele, o cateto adjacente encostado nele e a hipotenusa, o maior lado">
      <rect width="560" height="200" rx="14" fill="#faf5ff" />
      <polygon points="40,160 230,160 230,40" fill="#fffbeb" />
      <path d="M216 160 L216 146 L230 146" fill="none" stroke="#334155" strokeWidth="1.5" />
      <path d="M80 160 A40 40 0 0 0 73.8 138.6" fill="none" stroke="#dc2626" strokeWidth="2.5" />
      <text x="86" y="154" fontSize="16" fontWeight="900" fill="#dc2626" fontFamily="Georgia, serif">
        α
      </text>
      {sides.map((sd, i) => (
        <g key={sd.label}>
          <path d={sd.d} stroke={sd.c} strokeWidth="4" strokeLinecap="round" fill="none">
            <animate attributeName="stroke-width" values="4;4;9;4;4" keyTimes={`0;${(i * 0.3).toFixed(1)};${(i * 0.3 + 0.12).toFixed(2)};${(i * 0.3 + 0.25).toFixed(2)};1`} dur="5s" repeatCount="indefinite" />
          </path>
          <text x={sd.x} y={sd.y} textAnchor={sd.anchor} fontSize="13" fontWeight="900" fill={sd.c} fontFamily="Georgia, serif">
            {sd.label}
          </text>
        </g>
      ))}
      <g fontFamily="Georgia, serif" fontWeight="900" fontSize="12">
        <text x="342" y="70" fill="#334155">
          sen α = oposto ÷ hipotenusa
        </text>
        <text x="342" y="102" fill="#334155">
          cos α = adjacente ÷ hipotenusa
        </text>
        <text x="342" y="134" fill="#334155">
          tg α = oposto ÷ adjacente
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 8, content, bare });

export const chapter8: BookPage[] = [
  page(
    <ChapterOpener
      n={8}
      title="Pitágoras, Círculo e Trigonometria"
      goals={["O Teorema de Pitágoras", "O número π e o círculo", "Como calcular volumes", "O seno, o cosseno e a tangente"]}
    >
      <Fig h={34}>
        <PythagorasOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🔺">O Teorema de Pitágoras</H>
      <P>
        No <T>triângulo retângulo</T>, o lado maior, em frente ao ângulo reto, é a <T>hipotenusa</T>; os outros dois são os <T>catetos</T>. Pitágoras mostrou que a
        área do quadrado da hipotenusa é a soma das áreas dos quadrados dos catetos: <T>h² = a² + b²</T>.
      </P>
      <PythagorasExplorer />
      <Box kind="sabia">Com catetos 3 e 4, a hipotenusa é 5: 9 + 16 = 25. Os pedreiros usam esse “3, 4, 5” com barbantes pra conferir se uma parede está no esquadro.</Box>
    </>,
  ),

  page(
    <>
      <H icon="⭕">O círculo e o número π</H>
      <P>
        Em qualquer círculo, o contorno é um pouco mais que 3 vezes o diâmetro. Esse número é o <T>π</T> (pi), que vale cerca de 3,14. O comprimento da circunferência é{" "}
        <T>2 × π × r</T> e a área do círculo é <T>π × r²</T>.
      </P>
      <Fig n="8.1" caption="Uma volta completa da roda percorre 2 × π × o raio." h={18}>
        <PiWheelArt />
      </Fig>
      <Cards
        items={[
          { icon: "🔵", title: "Raio 3 cm", text: "Área = π × 3² = 9π ≈ 28,3 cm²." },
          { icon: "🔘", title: "Raio 5 cm", text: "Comprimento = 2 × π × 5 = 10π ≈ 31,4 cm." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="📦">Volume</H>
      <P>
        O <T>volume</T> é o espaço que um objeto ocupa, medido em cubinhos: cm³, m³. O volume do cubo é <T>aresta³</T>: um cubo de 4 cm tem 4 × 4 × 4 = 64 cm³.
      </P>
      <Fig n="8.2" caption="64 cubinhos de 1 cm³ formam um cubo de 4 cm de aresta." h={20}>
        <VolumeArt />
      </Fig>
      <Table
        head={["Sólido", "Volume"]}
        rows={[
          ["Cubo", "aresta × aresta × aresta"],
          ["Paralelepípedo (caixa)", "comprimento × largura × altura"],
          ["Cilindro (lata)", "π × r² × altura"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="📏">Seno, cosseno e tangente</H>
      <P>
        A <T>trigonometria</T> relaciona os ângulos de um triângulo retângulo com as medidas dos lados. Olhando de um ângulo α, um cateto fica de frente (o{" "}
        <T>oposto</T>) e o outro encostado (o <T>adjacente</T>).
      </P>
      <Fig n="8.3" caption="Os três lados vistos a partir do ângulo α." h={20}>
        <TrigArt />
      </Fig>
      <Table
        head={["", "30°", "45°", "60°"]}
        rows={[
          ["sen", "1/2", "√2/2", "√3/2"],
          ["cos", "√3/2", "√2/2", "1/2"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Teorema de Pitágoras: hipotenusa² = cateto² + cateto². Com catetos 3 e 4, a hipotenusa é 5.",
          "π ≈ 3,14 é quantas vezes o contorno do círculo é maior que o diâmetro.",
          "Comprimento da circunferência: 2πr. Área do círculo: πr².",
          "Volume do cubo: aresta³ (4 cm → 64 cm³).",
          "Seno = oposto ÷ hipotenusa; cosseno = adjacente ÷ hipotenusa; sen 30° = 1/2.",
        ]}
      />
      <Glossary
        items={[
          ["Hipotenusa", "O maior lado do triângulo retângulo."],
          ["Catetos", "Os dois lados que formam o ângulo reto."],
          ["Raio", "A distância do centro até a borda do círculo."],
          ["Diâmetro", "Duas vezes o raio, atravessando o centro."],
          ["Volume", "O espaço ocupado, em unidades ao cubo."],
        ]}
      />
      <Quiz
        items={[
          ["Os catetos medem 3 e 4. Quanto mede a hipotenusa?", "5."],
          ["Qual é a área de um círculo de raio 3 cm?", "9π cm² (cerca de 28,3 cm²)."],
          ["Qual é o volume de um cubo de aresta 4 cm?", "64 cm³."],
          ["Quanto vale o seno de 30°?", "1/2."],
        ]}
      />
    </>,
  ),
];
