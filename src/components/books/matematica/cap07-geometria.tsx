"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { MATH, MATH_DARK, Panel, Pill, Slider } from "./art";

// ============================================================================
// CAPÍTULO 7 — GEOMETRIA PLANA (missão "Matemática: Geometria e
// Trigonometria", a parte da geometria plana): as formas girando em volta do
// transferidor, o ângulo abrindo, os cantos do triângulo formando 180°, o
// explorador de áreas (de tocar) e o triângulo que é metade do retângulo.
// ============================================================================

const num = (v: number) => v.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

/** Os vértices de um polígono regular de `n` lados (o centro em cx, cy). */
function polygon(cx: number, cy: number, r: number, n: number, rot = -90): string {
  return Array.from({ length: n }, (_, i) => {
    const a = ((rot + (i * 360) / n) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

// ---------------------------------------------------------------------------
// Abertura: as formas e o transferidor
// ---------------------------------------------------------------------------

function ShapesOpenerArt() {
  const shapes = [
    { n: 3, x: 90, y: 80, c: "#f97316" },
    { n: 4, x: 370, y: 80, c: "#2563eb" },
    { n: 6, x: 90, y: 230, c: "#16a34a" },
    { n: 0, x: 370, y: 230, c: "#db2777" },
  ];
  return (
    <Art viewBox="0 0 460 300" label="Um transferidor no meio, com um triângulo, um quadrado, um hexágono e um círculo girando devagar em volta dele">
      <rect width="460" height="300" fill="#f5f3ff" />
      {/* o transferidor */}
      <path d="M130 200 A100 100 0 0 1 330 200 Z" fill="#e0f2fe" fillOpacity="0.8" stroke="#0369a1" strokeWidth="3" />
      {Array.from({ length: 19 }, (_, i) => {
        const a = Math.PI - (i * Math.PI) / 18;
        return <line key={i} x1={230 + 100 * Math.cos(a)} y1={200 - 100 * Math.sin(a)} x2={230 + (i % 9 === 0 ? 80 : 90) * Math.cos(a)} y2={200 - (i % 9 === 0 ? 80 : 90) * Math.sin(a)} stroke="#0369a1" strokeWidth="1.5" />;
      })}
      <g transform="translate(230 200)">
        <g>
          <animateTransform attributeName="transform" type="rotate" values="0;-180;0" dur="6s" repeatCount="indefinite" />
          <line x1="0" y1="0" x2="95" y2="0" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>
      <circle cx="230" cy="200" r="5" fill="#0369a1" />
      {shapes.map((s, i) => (
        <g key={i} transform={`translate(${s.x} ${s.y})`}>
          <g>
            <animateTransform attributeName="transform" type="rotate" from={i % 2 ? 360 : 0} to={i % 2 ? 0 : 360} dur={`${10 + i * 2}s`} repeatCount="indefinite" />
            {s.n ? <polygon points={polygon(0, 0, 38, s.n)} fill={s.c} fillOpacity="0.85" stroke="#1e293b" strokeWidth="2" /> : <circle r="36" fill={s.c} fillOpacity="0.85" stroke="#1e293b" strokeWidth="2" />}
          </g>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os tipos de ângulo
// ---------------------------------------------------------------------------

function AnglesArt() {
  const kinds = [
    { deg: 45, name: "agudo", note: "menor que 90°", c: "#16a34a" },
    { deg: 90, name: "reto", note: "90°, o canto do papel", c: "#2563eb" },
    { deg: 135, name: "obtuso", note: "entre 90° e 180°", c: "#ea580c" },
    { deg: 180, name: "raso", note: "180°, meia volta", c: "#db2777" },
  ];
  return (
    <Art viewBox="0 0 560 170" label="Quatro ângulos: agudo de 45 graus, reto de 90, obtuso de 135 e raso de 180, cada um abrindo devagar">
      <rect width="560" height="170" rx="14" fill="#faf5ff" />
      {kinds.map((k, i) => {
        const cx = 50 + i * 135;
        const cy = 110;
        const rad = (k.deg * Math.PI) / 180;
        const end = `${(cx + 30 * Math.cos(-rad)).toFixed(1)} ${(cy + 30 * Math.sin(-rad)).toFixed(1)}`;
        return (
          <g key={k.name}>
            <line x1={cx} y1={cy} x2={cx + 70} y2={cy} stroke="#334155" strokeWidth="3" strokeLinecap="round" />
            <g transform={`translate(${cx} ${cy})`}>
              <g>
                <animateTransform attributeName="transform" type="rotate" values={`0;${-k.deg};${-k.deg};0`} keyTimes="0;0.4;0.85;1" dur="5s" repeatCount="indefinite" />
                <line x1="0" y1="0" x2="70" y2="0" stroke={k.c} strokeWidth="3" strokeLinecap="round" />
              </g>
            </g>
            {k.deg === 90 ? (
              <path d={`M${cx + 14} ${cy} L${cx + 14} ${cy - 14} L${cx} ${cy - 14}`} fill="none" stroke={k.c} strokeWidth="2" />
            ) : (
              <path d={`M${cx + 30} ${cy} A30 30 0 0 0 ${end}`} fill="none" stroke={k.c} strokeWidth="2" />
            )}
            <text x={cx + 30} y="150" textAnchor="middle" fontSize="15" fontWeight="900" fill={k.c} fontFamily="Georgia, serif">
              {k.name} ({k.deg}°)
            </text>
            <text x={cx + 30} y="28" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569" fontFamily="Georgia, serif">
              {k.note}
            </text>
          </g>
        );
      })}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os cantos do triângulo formam 180°
// ---------------------------------------------------------------------------

function TriangleCornersArt() {
  return (
    <Art viewBox="0 0 560 170" label="Um triângulo com os três cantos coloridos; os cantos são recortados e juntados lado a lado numa reta, formando 180 graus">
      <rect width="560" height="170" rx="14" fill="#faf5ff" />
      <polygon points="60,140 230,140 120,30" fill="#ede9fe" stroke={MATH_DARK} strokeWidth="3" />
      <path d="M60 140 L85 140 A25 25 0 0 0 72 118 Z" fill="#f97316" />
      <path d="M230 140 L205 140 A25 25 0 0 1 212.3 122.3 Z" fill="#16a34a" />
      <path d="M120 30 L108 52 A25 25 0 0 0 137.7 47.7 Z" fill="#2563eb" />
      <text x="275" y="95" fontSize="30" fontWeight="900" fill={MATH} fontFamily="Georgia, serif">
        ➜
      </text>
      {/* os três cantos lado a lado, numa reta */}
      <line x1="330" y1="130" x2="530" y2="130" stroke="#334155" strokeWidth="3" />
      <g transform="translate(430 130)">
        {[
          { c: "#f97316", from: 0, to: 61 },
          { c: "#2563eb", from: 61, to: 135 },
          { c: "#16a34a", from: 135, to: 180 },
        ].map((w, i) => {
          const p = (deg: number) => `${(60 * Math.cos((-deg * Math.PI) / 180)).toFixed(1)} ${(60 * Math.sin((-deg * Math.PI) / 180)).toFixed(1)}`;
          return (
            <path key={i} d={`M0 0 L${p(w.from)} A60 60 0 0 0 ${p(w.to)} Z`} fill={w.c} stroke="#fff" strokeWidth="2">
              <animate attributeName="opacity" values="0;0;1;1;0" keyTimes={`0;${(0.1 + i * 0.2).toFixed(1)};${(0.2 + i * 0.2).toFixed(1)};0.9;1`} dur="5s" repeatCount="indefinite" />
            </path>
          );
        })}
      </g>
      <text x="430" y="158" textAnchor="middle" fontSize="15" fontWeight="900" fill={MATH_DARK} fontFamily="Georgia, serif">
        juntos: 180°
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O explorador de áreas (de tocar)
// ---------------------------------------------------------------------------

type Shape = "retangulo" | "quadrado" | "triangulo" | "circulo";
const SHAPE_NAMES: Record<Shape, string> = { retangulo: "Retângulo", quadrado: "Quadrado", triangulo: "Triângulo", circulo: "Círculo" };

export function AreaExplorer() {
  const [shape, setShape] = useState<Shape>("retangulo");
  const [w, setW] = useState(8);
  const [h, setH] = useState(5);
  const [r, setR] = useState(3);
  const u = 16; // pixels por unidade
  let drawing: React.ReactNode;
  let perimeter: string;
  let area: string;
  if (shape === "retangulo") {
    drawing = <rect x={120 - (w * u) / 2} y={80 - (h * u) / 2} width={w * u} height={h * u} fill="#c4b5fd" stroke={MATH_DARK} strokeWidth="2" />;
    perimeter = `2 × (${w} + ${h}) = ${2 * (w + h)}`;
    area = `${w} × ${h} = ${w * h}`;
  } else if (shape === "quadrado") {
    drawing = <rect x={120 - (w * u) / 2} y={80 - (w * u) / 2} width={w * u} height={w * u} fill="#c4b5fd" stroke={MATH_DARK} strokeWidth="2" />;
    perimeter = `4 × ${w} = ${4 * w}`;
    area = `${w}² = ${w * w}`;
  } else if (shape === "triangulo") {
    drawing = (
      <>
        <polygon points={`${120 - (w * u) / 2},${80 + (h * u) / 2} ${120 + (w * u) / 2},${80 + (h * u) / 2} 120,${80 - (h * u) / 2}`} fill="#c4b5fd" stroke={MATH_DARK} strokeWidth="2" />
        <line x1="120" y1={80 - (h * u) / 2} x2="120" y2={80 + (h * u) / 2} stroke="#f97316" strokeWidth="2" strokeDasharray="4 3" />
      </>
    );
    const side = Math.sqrt((w / 2) ** 2 + h ** 2);
    perimeter = `${w} + 2 × ${num(side)} ≈ ${num(w + 2 * side)}`;
    area = `(${w} × ${h}) ÷ 2 = ${num((w * h) / 2)}`;
  } else {
    drawing = (
      <>
        <circle cx="120" cy="80" r={r * u} fill="#c4b5fd" stroke={MATH_DARK} strokeWidth="2" />
        <line x1="120" y1="80" x2={120 + r * u} y2="80" stroke="#f97316" strokeWidth="2.5" />
      </>
    );
    perimeter = `2 × π × ${r} ≈ ${num(2 * Math.PI * r)}`;
    area = `π × ${r}² = ${r * r}π ≈ ${num(Math.PI * r * r)}`;
  }
  return (
    <Panel title="O explorador de áreas">
      <div className="flex flex-wrap justify-center gap-[0.3em]">
        {(Object.keys(SHAPE_NAMES) as Shape[]).map((s) => (
          <Pill key={s} on={shape === s} onClick={() => setShape(s)}>
            {SHAPE_NAMES[s]}
          </Pill>
        ))}
      </div>
      <div className="mt-[0.3em] flex flex-wrap items-center justify-center gap-[0.6em]">
        <svg viewBox="0 0 240 160" className="h-[7em] w-[10.5em] shrink-0" aria-label={`Um ${SHAPE_NAMES[shape].toLowerCase()}`}>
          <rect width="240" height="160" fill="#fff" rx="8" />
          {drawing}
        </svg>
        <div className="min-w-[11em] flex-1 space-y-[0.25em]">
          {shape === "circulo" ? (
            <Slider label="raio" labelWidth="3.5em" value={r} min={1} max={4} onChange={setR} />
          ) : (
            <>
              <Slider label={shape === "quadrado" ? "lado" : "base"} labelWidth="3.5em" value={w} min={2} max={shape === "quadrado" ? 8 : 12} onChange={setW} />
              {shape !== "quadrado" && <Slider label="altura" labelWidth="3.5em" value={h} min={2} max={8} onChange={setH} />}
            </>
          )}
          <p className="text-[0.85em]">
            <strong style={{ color: MATH }}>{shape === "circulo" ? "Comprimento" : "Perímetro"}:</strong> {perimeter}
          </p>
          <p className="text-[0.85em]">
            <strong style={{ color: MATH_DARK }}>Área:</strong> {area}
          </p>
        </div>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// O triângulo é a metade do retângulo
// ---------------------------------------------------------------------------

function HalfRectangleArt() {
  return (
    <Art viewBox="0 0 560 170" label="Um retângulo de 10 por 6 é cortado na diagonal; uma metade sai e fica um triângulo de base 10 e altura 6, com área 30">
      <rect width="560" height="170" rx="14" fill="#faf5ff" />
      <polygon points="80,140 280,140 80,20" fill="#c4b5fd" stroke={MATH_DARK} strokeWidth="3" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 0;40 -10;40 -10;0 0" keyTimes="0;0.25;0.45;0.85;1" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;1;0.35;0.35;1" keyTimes="0;0.25;0.45;0.85;1" dur="5s" repeatCount="indefinite" />
        <polygon points="80,20 280,20 280,140" fill="#ede9fe" stroke={MATH_DARK} strokeWidth="3" strokeDasharray="6 4" />
      </g>
      <g fontFamily="Georgia, serif" fontWeight="900">
        <text x="180" y="160" textAnchor="middle" fontSize="13" fill={MATH_DARK}>
          base 10
        </text>
        <text x="66" y="85" textAnchor="end" fontSize="13" fill={MATH_DARK}>
          6
        </text>
        <text x="350" y="60" fontSize="15" fill="#334155">
          retângulo: 10 × 6 = 60
        </text>
        <text x="350" y="95" fontSize="15" fill="#334155">
          metade dele:
        </text>
        <text x="350" y="125" fontSize="18" fill={MATH_DARK}>
          triângulo = 30
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 7, content, bare });

export const chapter7: BookPage[] = [
  page(
    <ChapterOpener
      n={7}
      title="Geometria Plana"
      goals={["Os tipos de ângulo", "Os polígonos e a soma dos ângulos internos", "Como calcular o perímetro e a área", "Por que o triângulo é metade do retângulo"]}
    >
      <Fig h={34}>
        <ShapesOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="📐">Ângulos</H>
      <P>
        O <T>ângulo</T> mede a abertura entre duas linhas que saem do mesmo ponto, em <T>graus</T> (°). Uma volta inteira tem 360°; meia volta, 180°; e o canto de uma
        folha de papel tem 90°.
      </P>
      <Fig n="7.1" caption="Agudo, reto, obtuso e raso." h={20}>
        <AnglesArt />
      </Fig>
      <Box kind="sabia">Os babilônios dividiram a volta em 360 partes há uns 4.000 anos. Talvez porque o ano tem cerca de 360 dias, e 360 se divide por muitos números.</Box>
    </>,
  ),

  page(
    <>
      <H icon="🔷">Polígonos</H>
      <P>
        <T>Polígonos</T> são figuras fechadas formadas por segmentos de reta. Em qualquer triângulo, os três ângulos somam <T>180°</T>. Recorte os cantos e junte:
      </P>
      <Fig n="7.2" caption="Os três cantos de um triângulo formam meia volta: 180°." h={19}>
        <TriangleCornersArt />
      </Fig>
      <Table
        head={["Polígono", "Lados", "Soma dos ângulos (n − 2) × 180°"]}
        rows={[
          ["Triângulo", "3", "180°"],
          ["Quadrilátero", "4", "360°"],
          ["Pentágono", "5", "540°"],
          ["Hexágono", "6", "720°"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="📏">Perímetro e área</H>
      <P>
        O <T>perímetro</T> é a soma dos lados (o tamanho do contorno). A <T>área</T> é o tamanho da superfície, medida em quadradinhos: cm², m². No círculo, o contorno
        se chama <T>comprimento</T> da circunferência.
      </P>
      <AreaExplorer />
      <Box kind="atencao">
        Num quadrado de lado 5 cm, o perímetro é 5 + 5 + 5 + 5 = <strong>20 cm</strong> e a área é 5 × 5 = <strong>25 cm²</strong>. Não confunda!
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="✂️">O triângulo é meio retângulo</H>
      <P>
        Corte um retângulo na diagonal e você terá dois triângulos iguais. Por isso a área do triângulo é <T>(base × altura) ÷ 2</T>: com base 10 e altura 6, (10 × 6) ÷ 2 =
        30.
      </P>
      <Fig n="7.3" caption="A diagonal divide o retângulo em dois triângulos iguais." h={19}>
        <HalfRectangleArt />
      </Fig>
      <Cards
        items={[
          { icon: "⬛", title: "1 m²", text: "Um quadrado de 1 m de lado: 10.000 cm²." },
          { icon: "⚽", title: "Um campo", text: "Um campo de futebol tem uns 7.000 m²." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Ângulos se medem em graus: agudo (< 90°), reto (90°), obtuso (entre 90° e 180°) e raso (180°).",
          "Os ângulos de qualquer triângulo somam 180°; num polígono de n lados, somam (n − 2) × 180°.",
          "Perímetro é a soma dos lados; área é o tamanho da superfície.",
          "Retângulo: base × altura. Triângulo: (base × altura) ÷ 2. Círculo: π × r².",
          "O hexágono tem ângulos internos que somam 720°.",
        ]}
      />
      <Glossary
        items={[
          ["Ângulo", "A abertura entre duas linhas que saem do mesmo ponto."],
          ["Vértice", "O ponto onde as linhas se encontram."],
          ["Polígono", "Figura plana fechada formada por segmentos de reta."],
          ["Perímetro", "A soma dos lados de uma figura."],
          ["Área", "A medida da superfície, em unidades ao quadrado."],
        ]}
      />
      <Quiz
        items={[
          ["Quanto somam os ângulos internos de um triângulo?", "180°."],
          ["Qual é a área de um retângulo de 8 m por 5 m?", "40 m² (o perímetro seria 26 m)."],
          ["Qual é a área de um triângulo de base 10 cm e altura 6 cm?", "30 cm²."],
          ["Quanto somam os ângulos internos de um hexágono?", "720° ((6 − 2) × 180°)."],
        ]}
      />
    </>,
  ),
];
