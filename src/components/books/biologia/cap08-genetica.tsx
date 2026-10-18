"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T, useUid } from "../BookParts";
import type { BookPage } from "../types";

// ============================================================================
// CAPÍTULO 8 — GENÉTICA E DNA (missão "Biologia: Genética e DNA"): a dupla
// hélice girando (cada degrau calculado quadro a quadro), o zoom do corpo até
// o gene, a escada do DNA abrindo como um zíper, o cruzamento das ervilhas de
// Mendel e o quadro de Punnett de tocar: o aluno escolhe os pais e vê a
// chance de cada filho.
// ============================================================================

const BASE_COLOR: Record<string, string> = { A: "#ef4444", T: "#3b82f6", C: "#22c55e", G: "#f59e0b" };
const PAIR: Record<string, string> = { A: "T", T: "A", C: "G", G: "C" };

// ---------------------------------------------------------------------------
// Abertura: a dupla hélice girando
// ---------------------------------------------------------------------------

const HELIX = { cx: 230, top: 26, gap: 19, amp: 66, frames: 24, twist: 0.52 };
const HELIX_BASES = "ATCGGATCCATGC".split("");

function helixX(i: number, f: number, side: 1 | -1): number {
  const a = (2 * Math.PI * f) / HELIX.frames + i * HELIX.twist;
  return HELIX.cx + side * HELIX.amp * Math.sin(a);
}
function helixZ(i: number, f: number, side: 1 | -1): number {
  return side * Math.cos((2 * Math.PI * f) / HELIX.frames + i * HELIX.twist);
}
const frames = Array.from({ length: HELIX.frames + 1 }, (_, f) => f % HELIX.frames);
/** os valores de um atributo em todos os quadros, no formato do SMIL */
const over = (fn: (f: number) => number) => frames.map((f) => fn(f).toFixed(1)).join(";");

function strandPath(f: number, side: 1 | -1): string {
  const pts: string[] = [];
  for (let k = 0; k <= (HELIX_BASES.length - 1) * 4; k++) {
    const i = k / 4;
    pts.push(`${helixX(i, f, side).toFixed(1)} ${(HELIX.top + i * HELIX.gap).toFixed(1)}`);
  }
  return `M${pts.join(" L")}`;
}

function DnaHelixArt() {
  return (
    <Art viewBox="0 0 460 300" label="A molécula de DNA, uma dupla hélice girando, com os pares de bases A com T e C com G">
      <circle cx="230" cy="140" r="130" fill="#a78bfa" opacity="0.12" className="cg-anim-glow" />
      {([1, -1] as const).map((side) => (
        <path key={side} d={strandPath(0, side)} stroke={side > 0 ? "#7c3aed" : "#db2777"} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
          <animate attributeName="d" values={frames.map((f) => strandPath(f, side)).join(";")} dur="6s" repeatCount="indefinite" />
        </path>
      ))}
      {HELIX_BASES.map((b, i) => {
        const y = HELIX.top + i * HELIX.gap;
        return (
          <g key={i}>
            <line x1={helixX(i, 0, 1)} y1={y} x2={HELIX.cx} y2={y} stroke={BASE_COLOR[b]} strokeWidth="5" strokeLinecap="round">
              <animate attributeName="x1" values={over((f) => helixX(i, f, 1))} dur="6s" repeatCount="indefinite" />
            </line>
            <line x1={HELIX.cx} y1={y} x2={helixX(i, 0, -1)} y2={y} stroke={BASE_COLOR[PAIR[b]]} strokeWidth="5" strokeLinecap="round">
              <animate attributeName="x2" values={over((f) => helixX(i, f, -1))} dur="6s" repeatCount="indefinite" />
            </line>
            {([1, -1] as const).map((side) => (
              <circle key={side} cx={helixX(i, 0, side)} cy={y} r="6" fill={side > 0 ? "#8b5cf6" : "#ec4899"} stroke="#fff" strokeWidth="1.5">
                <animate attributeName="cx" values={over((f) => helixX(i, f, side))} dur="6s" repeatCount="indefinite" />
                <animate attributeName="r" values={over((f) => 5.5 + 2 * helixZ(i, f, side))} dur="6s" repeatCount="indefinite" />
              </circle>
            ))}
          </g>
        );
      })}
      {/* a legenda das bases */}
      <g fontFamily="Georgia, serif" fontSize="13" fontWeight="900">
        {[
          ["A", "adenina", 24],
          ["T", "timina", 48],
          ["C", "citosina", 72],
          ["G", "guanina", 96],
        ].map(([b, n, y]) => (
          <g key={b as string}>
            <rect x="20" y={(y as number) - 12} width="16" height="16" rx="4" fill={BASE_COLOR[b as string]} />
            <text x="28" y={(y as number) + 1} textAnchor="middle" fill="#fff" fontSize="11">
              {b}
            </text>
            <text x="42" y={(y as number) + 1} fill="#3b2a14" fontWeight="700" fontSize="12">
              {n}
            </text>
          </g>
        ))}
        <text x="440" y="40" textAnchor="end" fill="#6d28d9">
          A — T
        </text>
        <text x="440" y="60" textAnchor="end" fill="#15803d">
          C — G
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Do corpo ao gene: o zoom
// ---------------------------------------------------------------------------

function ZoomArt() {
  const names = ["Corpo", "Célula", "Núcleo", "Cromossomo", "DNA", "Gene"];
  return (
    <Art viewBox="0 0 620 140" label="Zoom do corpo até o gene: corpo, célula, núcleo, cromossomo, DNA e gene">
      {names.map((n, i) => {
        const x = 52 + i * 103;
        return (
          <g key={n} className="cg-anim-pop" style={{ animationDelay: `${i * 0.3}s` }}>
            <circle cx={x} cy="56" r="42" fill="#fffaf0" stroke="#b08a52" strokeWidth="2.5" />
            {i < 5 && <path d={`M${x + 42} 56 L${x + 61} 56`} stroke="#b08a52" strokeWidth="2.5" strokeDasharray="4 3" />}
            {i === 0 && (
              <g>
                <circle cx={x} cy="30" r="9" fill="#fcd34d" stroke="#92400e" strokeWidth="1.5" />
                <path d={`M${x - 14} 44 L${x + 14} 44 L${x + 10} 72 L${x + 6} 90 L${x - 6} 90 L${x - 10} 72 Z`} fill="#60a5fa" stroke="#1e3a8a" strokeWidth="1.5" />
              </g>
            )}
            {i === 1 && (
              <g>
                <circle cx={x} cy="56" r="30" fill="#fecdd3" stroke="#f43f5e" strokeWidth="2.5" />
                <circle cx={x + 4} cy="52" r="12" fill="#a78bfa" stroke="#6d28d9" strokeWidth="1.5" />
              </g>
            )}
            {i === 2 && (
              <g>
                <circle cx={x} cy="56" r="32" fill="#ddd6fe" stroke="#6d28d9" strokeWidth="2.5" />
                {[-14, 0, 14].map((dx) => (
                  <path key={dx} d={`M${x + dx - 5} ${46} L${x + dx + 5} ${66} M${x + dx + 5} ${46} L${x + dx - 5} ${66}`} stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
                ))}
              </g>
            )}
            {i === 3 && (
              <g>
                <path d={`M${x - 14} 24 C${x - 4} 50 ${x - 4} 62 ${x - 14} 88 M${x + 14} 24 C${x + 4} 50 ${x + 4} 62 ${x + 14} 88`} stroke="#7c3aed" strokeWidth="11" fill="none" strokeLinecap="round" />
                <circle cx={x} cy="56" r="6" fill="#4c1d95" />
              </g>
            )}
            {i === 4 && (
              <g>
                <path d={`M${x - 10} 20 C${x + 30} 36 ${x - 30} 56 ${x + 10} 72 S${x - 10} 92 ${x - 10} 92`} stroke="#7c3aed" strokeWidth="3" fill="none" />
                <path d={`M${x + 10} 20 C${x - 30} 36 ${x + 30} 56 ${x - 10} 72 S${x + 10} 92 ${x + 10} 92`} stroke="#db2777" strokeWidth="3" fill="none" />
                {[30, 44, 58, 72, 84].map((y, k) => (
                  <path key={y} d={`M${x - 8} ${y} L${x + 8} ${y}`} stroke={Object.values(BASE_COLOR)[k % 4]} strokeWidth="2.5" />
                ))}
              </g>
            )}
            {i === 5 && (
              <g>
                <rect x={x - 34} y="46" width="68" height="20" rx="4" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1.5" />
                <rect x={x - 14} y="46" width="28" height="20" fill="#fde047" stroke="#ca8a04" strokeWidth="2" className="cg-anim-glow" />
                {"ATGCATGCA".split("").map((b, k) => (
                  <text key={k} x={x - 30 + k * 7.5} y="60" fontSize="8" fontWeight="900" fill={BASE_COLOR[b]} fontFamily="monospace">
                    {b}
                  </text>
                ))}
              </g>
            )}
            <text x={x} y="122" textAnchor="middle" fontSize="13" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
              {n}
            </text>
          </g>
        );
      })}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A escada do DNA abrindo como um zíper
// ---------------------------------------------------------------------------

function LadderArt() {
  const bases = "ATGCCGATTACG".split("");
  return (
    <Art viewBox="0 0 560 170" label="A escada do DNA: os pares A com T e C com G se abrem como um zíper, um depois do outro">
      {bases.map((b, i) => {
        const x = 40 + i * 42;
        const open = { dur: "6s", begin: `${i * 0.18 - 6}s`, repeatCount: "indefinite" };
        return (
          <g key={i}>
            <g>
              <animateTransform attributeName="transform" type="translate" values="0 0;0 0;0 -16;0 -16;0 0" keyTimes="0;0.1;0.25;0.6;0.75" {...open} />
              <rect x={x - 18} y="30" width="36" height="12" rx="4" fill="#8b5cf6" />
              <rect x={x - 7} y="42" width="14" height="34" rx="3" fill={BASE_COLOR[b]} />
              <text x={x} y="64" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff" fontFamily="monospace">
                {b}
              </text>
            </g>
            <g>
              <animateTransform attributeName="transform" type="translate" values="0 0;0 0;0 16;0 16;0 0" keyTimes="0;0.1;0.25;0.6;0.75" {...open} />
              <rect x={x - 7} y="78" width="14" height="34" rx="3" fill={BASE_COLOR[PAIR[b]]} />
              <rect x={x - 18} y="112" width="36" height="12" rx="4" fill="#ec4899" />
              <text x={x} y="100" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff" fontFamily="monospace">
                {PAIR[b]}
              </text>
            </g>
          </g>
        );
      })}
      <text x="280" y="20" textAnchor="middle" fontSize="12" fontWeight="700" fill="#6d28d9" fontFamily="Georgia, serif">
        corrimão (açúcar e fosfato)
      </text>
      <text x="280" y="160" textAnchor="middle" fontSize="12" fontWeight="700" fill="#5b4a2e" fontFamily="Georgia, serif">
        os degraus são os pares de bases: A sempre com T, C sempre com G
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As ervilhas de Mendel: amarela × verde
// ---------------------------------------------------------------------------

function Pea({ x, y, yellow, label, delay }: { x: number; y: number; yellow: boolean; label?: string; delay: number }) {
  const u = useUid("pea");
  return (
    <g className="cg-anim-pop" style={{ animationDelay: `${delay}s` }}>
      <defs>
        <radialGradient id={u} cx="0.35" cy="0.3" r="0.7">
          <stop offset="0" stopColor={yellow ? "#fef9c3" : "#dcfce7"} />
          <stop offset="1" stopColor={yellow ? "#eab308" : "#16a34a"} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r="15" fill={`url(#${u})`} stroke={yellow ? "#a16207" : "#14532d"} strokeWidth="1.5" />
      {label && (
        <text x={x} y={y + 32} textAnchor="middle" fontSize="12" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
          {label}
        </text>
      )}
    </g>
  );
}

function MendelArt() {
  return (
    <Art viewBox="0 0 560 250" label="O cruzamento de Mendel: ervilha amarela AA com verde aa dá filhos todos amarelos Aa, e eles cruzados dão 3 amarelas para 1 verde">
      <g fontFamily="Georgia, serif" fontSize="13" fontWeight="900" fill="#6b21a8">
        <text x="20" y="44">Pais</text>
        <text x="20" y="124">1ª geração</text>
        <text x="20" y="204">2ª geração</text>
      </g>
      <Pea x={210} y={40} yellow label="AA" delay={0.1} />
      <text x="280" y="46" textAnchor="middle" fontSize="20" fontWeight="900" fill="#3b2a14">
        ×
      </text>
      <Pea x={350} y={40} yellow={false} label="aa" delay={0.3} />
      <path d="M280 72 L280 92" stroke="#b08a52" strokeWidth="3" />
      {[190, 250, 310, 370].map((x, i) => (
        <Pea key={x} x={x} y={120} yellow label="Aa" delay={0.8 + i * 0.15} />
      ))}
      <text x="470" y="126" fontSize="12" fill="#5b4a2e" fontFamily="Georgia, serif" fontStyle="italic">
        100% amarelas
      </text>
      <path d="M280 152 L280 172" stroke="#b08a52" strokeWidth="3" />
      {[
        [190, true, "AA"],
        [250, true, "Aa"],
        [310, true, "Aa"],
        [370, false, "aa"],
      ].map(([x, yellow, l], i) => (
        <Pea key={x as number} x={x as number} y={200} yellow={yellow as boolean} label={l as string} delay={1.6 + i * 0.15} />
      ))}
      <text x="470" y="206" fontSize="12" fill="#5b4a2e" fontFamily="Georgia, serif" fontStyle="italic">
        3 amarelas : 1 verde
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O quadro de Punnett de tocar
// ---------------------------------------------------------------------------

const GENOTYPES = ["AA", "Aa", "aa"] as const;
type Genotype = (typeof GENOTYPES)[number];

function PeaDot({ yellow }: { yellow: boolean }) {
  return (
    <span
      className="inline-block h-[1.05em] w-[1.05em] shrink-0 rounded-full border align-middle"
      style={{ background: yellow ? "radial-gradient(circle at 35% 30%, #fef9c3, #eab308)" : "radial-gradient(circle at 35% 30%, #dcfce7, #16a34a)", borderColor: yellow ? "#a16207" : "#14532d" }}
    />
  );
}

function ParentPicker({ label, value, onChange }: { label: string; value: Genotype; onChange: (g: Genotype) => void }) {
  return (
    <div className="flex flex-col items-center gap-[0.25em]">
      <span className="text-[0.8em] font-bold uppercase tracking-wider text-[#6b5a3a]">{label}</span>
      <div className="flex gap-[0.25em]">
        {GENOTYPES.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => onChange(g)}
            className={`flex items-center gap-[0.3em] rounded-full border px-[0.6em] py-[0.15em] font-mono text-[0.9em] font-black transition-colors ${value === g ? "border-[#7c3aed] bg-[#7c3aed] text-white" : "border-[#d9c79d] bg-[#fffaf0] text-[#3b2a14] hover:bg-[#ede9fe]"}`}
          >
            <PeaDot yellow={g !== "aa"} /> {g}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PunnettSquare() {
  const [mom, setMom] = useState<Genotype>("Aa");
  const [dad, setDad] = useState<Genotype>("Aa");
  const cols = dad.split("");
  const rows = mom.split("");
  const kids = rows.flatMap((r) => cols.map((c) => [r, c].sort().join("") as Genotype));
  const count = (g: Genotype) => kids.filter((k) => k === g).length;
  const yellow = kids.filter((k) => k !== "aa").length;
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <div className="flex flex-wrap items-start justify-center gap-[0.8em]">
        <ParentPicker label="Mãe" value={mom} onChange={setMom} />
        <ParentPicker label="Pai" value={dad} onChange={setDad} />
      </div>
      <div className="mt-[0.6em] flex flex-wrap items-center justify-center gap-[1em]">
        <table className="border-collapse text-center font-mono text-[1em] font-black">
          <tbody>
            <tr>
              <td className="h-[2.2em] w-[2.6em] text-[0.75em] text-[#6b5a3a]">♀ \ ♂</td>
              {cols.map((c, i) => (
                <td key={i} className="h-[2.2em] w-[3.6em] rounded-t-lg bg-[#dbeafe] text-[#1e3a8a]">
                  {c}
                </td>
              ))}
            </tr>
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="h-[3em] bg-[#fce7f3] text-[#9d174d]">{r}</td>
                {cols.map((c, j) => {
                  const g = [r, c].sort().join("");
                  return (
                    <td key={`${mom}${dad}${i}${j}`} className="cg-anim-pop h-[3em] w-[3.6em] border-2 border-[#e6d8b5] bg-white" style={{ animationDelay: `${(i * 2 + j) * 0.1}s` }}>
                      <span className="inline-flex items-center gap-[0.3em]">
                        <PeaDot yellow={g !== "aa"} />
                        {g}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-[0.88em] leading-[1.6]">
          <p className="font-bold text-[#3b2a14]">Chance de cada filho:</p>
          {GENOTYPES.filter((g) => count(g) > 0).map((g) => (
            <p key={g} className="flex items-center gap-[0.4em]">
              <PeaDot yellow={g !== "aa"} /> <span className="font-mono font-black">{g}</span>: {count(g) * 25}%
            </p>
          ))}
          <p className="mt-[0.2em] border-t border-[#e6d8b5] pt-[0.2em]">
            <PeaDot yellow /> amarelas: <strong>{yellow * 25}%</strong> · <PeaDot yellow={false} /> verdes: <strong>{(4 - yellow) * 25}%</strong>
          </p>
        </div>
      </div>
    </div>
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
      title="Genética e DNA"
      goals={["O que são DNA, genes e cromossomos", "Como é a molécula de DNA", "As descobertas de Mendel com as ervilhas", "Como calcular a chance de um filho herdar uma característica"]}
    >
      <Fig h={34}>
        <DnaHelixArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🔎">Do corpo ao DNA</H>
      <P>
        Por que você se parece com os seus pais? A resposta está no <T>DNA</T>, a molécula que guarda, como um grande livro de receitas, todas as instruções para construir e
        fazer funcionar um ser vivo. Ele fica dentro do núcleo de cada célula.
      </P>
      <Fig n="8.1" caption="Dando zoom: o corpo é feito de células; no núcleo ficam os cromossomos, que são DNA bem enrolado; e um trecho do DNA é um gene." h={18}>
        <ZoomArt />
      </Fig>
      <List
        items={[
          <>
            <T>Gene</T>: um trecho do DNA com a &ldquo;receita&rdquo; de uma proteína, que define uma característica (como a cor dos olhos). Temos uns 20 mil genes.
          </>,
          <>
            <T>Cromossomo</T>: um fio de DNA bem enrolado. A célula humana comum tem <T>46 cromossomos</T>, em <T>23 pares</T>: um de cada par veio da mãe e o outro do pai.
          </>,
          <>
            Os <T>gametas</T> (óvulo e espermatozoide) têm só <T>23</T>. Na fecundação, 23 + 23 = 46!
          </>,
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🧬">A dupla hélice</H>
      <P>
        O DNA parece uma <T>escada torcida</T>: a <T>dupla hélice</T>. Os corrimãos são feitos de açúcar e fosfato, e os degraus são pares de <T>bases nitrogenadas</T>, que
        existem em quatro tipos: <T>adenina (A)</T>, <T>timina (T)</T>, <T>citosina (C)</T> e <T>guanina (G)</T>.
      </P>
      <Fig n="8.2" caption="A escada do DNA. Quando a célula vai se dividir, ela abre como um zíper e cada lado serve de molde para um lado novo." h={20}>
        <LadderArt />
      </Fig>
      <P>
        As bases sempre se encaixam do mesmo jeito: <T>A com T</T> e <T>C com G</T>. Por isso, conhecendo um lado da escada, dá para saber o outro. A ordem das letras é o
        código genético: é ela que forma as &ldquo;palavras&rdquo; das receitas.
      </P>
      <Box kind="sabia" title="A foto que revelou a hélice">
        Em 1953, <strong>James Watson</strong> e <strong>Francis Crick</strong> descreveram a dupla hélice, com base na famosa &ldquo;Foto 51&rdquo;, uma imagem de raios X feita
        pela cientista <strong>Rosalind Franklin</strong>. No <strong>RNA</strong>, uma molécula &ldquo;prima&rdquo; do DNA, a timina é trocada pela <strong>uracila (U)</strong>.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🌱">Mendel e as ervilhas</H>
      <P>
        No século XIX, o monge <T>Gregor Mendel</T> cruzou milhares de pés de ervilha e descobriu as regras da herança. Por isso ele é chamado de <T>pai da genética</T>.
      </P>
      <Fig n="8.3" caption="Cruzando ervilhas amarelas (AA) com verdes (aa), todos os filhos saem amarelos. Mas, cruzando os filhos, o verde reaparece em 1 de cada 4." h={26}>
        <MendelArt />
      </Fig>
      <List
        items={[
          <>
            Cada característica depende de um par de genes, os <T>alelos</T>: um veio da mãe e o outro do pai.
          </>,
          <>
            O alelo <T>dominante</T> (letra maiúscula, <strong>A</strong>) aparece mesmo com uma cópia só. O <T>recessivo</T> (minúscula, <strong>a</strong>) só aparece em dose
            dupla: <strong>aa</strong>.
          </>,
          <>
            <T>Genótipo</T> é a combinação de genes (AA, Aa ou aa); <T>fenótipo</T> é o que aparece (a cor amarela ou verde). AA e aa são <T>homozigotos</T>; Aa é{" "}
            <T>heterozigoto</T>.
          </>,
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🔢">O quadro de Punnett</H>
      <P>
        O <T>quadro de Punnett</T> é uma tabela que mostra todas as combinações possíveis entre os alelos da mãe e do pai. Cada casinha vale <T>25%</T> de chance. Escolha o
        genótipo de cada um e veja os filhos possíveis:
      </P>
      <PunnettSquare />
      <P>
        No cruzamento <strong>Aa × Aa</strong>, saem AA, Aa, Aa e aa: a chance de um filho <strong>aa</strong> é de 1 em 4 (<T>25%</T>), e a de ter a característica dominante
        é de <T>75%</T>.
      </P>
      <Box kind="lembre" title="XX ou XY?">
        Um dos 23 pares é o dos <strong>cromossomos sexuais</strong>: em geral, <strong>XX</strong> no sexo feminino e <strong>XY</strong> no masculino. Como o óvulo sempre
        leva um X, é o espermatozoide (com X ou com Y) que define o sexo biológico.
      </Box>
      <P>
        Às vezes a sequência do DNA muda: é a <T>mutação</T>. Ela pode ser prejudicial, neutra ou até vantajosa, e é a fonte da variedade que a evolução usa.
      </P>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "O DNA guarda as informações genéticas; um gene é um trecho dele; os cromossomos são DNA enrolado.",
          "A célula humana tem 46 cromossomos (23 pares); os gametas têm 23.",
          "O DNA é uma dupla hélice com as bases A, T, C e G: A pareia com T e C pareia com G.",
          "Mendel: o alelo dominante aparece com uma cópia; o recessivo só em dose dupla.",
          "No cruzamento Aa × Aa: 25% AA, 50% Aa e 25% aa.",
        ]}
      />
      <Glossary
        items={[
          ["Alelo", "Cada versão de um gene (A ou a)."],
          ["Genótipo", "A combinação de alelos de um ser vivo (AA, Aa, aa)."],
          ["Fenótipo", "A característica que aparece (a cor, a forma...)."],
          ["Homozigoto", "Com os dois alelos iguais (AA ou aa)."],
          ["Mutação", "Uma mudança na sequência do DNA."],
        ]}
      />
      <Quiz
        items={[
          ["Quais são as quatro bases do DNA?", "Adenina, timina, citosina e guanina (A, T, C e G)."],
          ["Quantos cromossomos tem uma célula comum do corpo humano?", "46, em 23 pares."],
          ["Quando um gene recessivo aparece?", "Só quando a pessoa tem duas cópias dele (aa)."],
          ["No cruzamento Aa × Aa, qual a chance de nascer um filho aa?", "25% (1 em 4)."],
        ]}
      />
    </>,
  ),
];
