"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";

// ============================================================================
// CAPÍTULO 10 — EVOLUÇÃO E BIOTECNOLOGIA (missão "Biologia: Evolução e
// Biotecnologia"): a árvore da vida crescendo, o Beagle navegando e os bicos
// dos tentilhões, a seleção natural de tocar (o passarinho come os besouros
// que aparecem mais e a população muda geração após geração), Lamarck ×
// Darwin com as girafas, as camadas de fósseis e o parentesco com os
// chimpanzés, a classificação até Homo sapiens e a bactéria que fabrica
// insulina. No fim, a linha do tempo da Biologia.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a árvore da vida crescendo do ancestral comum
// ---------------------------------------------------------------------------

const TREE_BRANCHES: { d: string; tip: [number, number]; label: string; t: number }[] = [
  { d: "M230 270 C230 230 226 210 200 190 C170 170 120 160 80 120", tip: [80, 112], label: "Bactérias", t: 0.18 },
  { d: "M230 270 C230 230 226 210 200 190 C180 150 160 110 150 70", tip: [150, 60], label: "Plantas", t: 0.24 },
  { d: "M230 270 C230 230 230 190 228 150 C226 110 214 70 206 40", tip: [206, 32], label: "Fungos", t: 0.3 },
  { d: "M230 270 C230 230 234 200 256 180 C270 150 276 110 270 60", tip: [270, 52], label: "Peixes", t: 0.36 },
  { d: "M230 270 C230 230 234 200 256 180 C290 160 320 120 330 76", tip: [330, 68], label: "Anfíbios", t: 0.42 },
  { d: "M230 270 C230 230 234 200 256 180 C300 170 350 150 384 116", tip: [384, 108], label: "Aves", t: 0.48 },
  { d: "M230 270 C230 230 234 200 256 180 C310 186 370 180 410 160", tip: [410, 152], label: "Mamíferos", t: 0.54 },
];

function TreeOfLifeArt() {
  const loop = { dur: "12s", repeatCount: "indefinite" };
  const icons = ["🦠", "🌿", "🍄", "🐟", "🐸", "🐦", "🐒"];
  return (
    <Art viewBox="0 0 460 300" label="A árvore da vida: todos os seres vivos descendem de um ancestral comum">
      <circle cx="230" cy="150" r="140" fill="#bbf7d0" opacity="0.35" className="cg-anim-glow" style={{ "--cg-dur": "5s" } as React.CSSProperties} />
      {TREE_BRANCHES.map((b) => (
        <g key={b.label}>
          <path d={b.d} stroke="#78350f" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="400" strokeDashoffset="400">
            <animate attributeName="stroke-dashoffset" values="400;400;0;0;400" keyTimes={`0;${b.t - 0.15};${b.t};0.9;1`} {...loop} />
          </path>
          <g opacity="0">
            <animate attributeName="opacity" values="0;0;1;1;0" keyTimes={`0;${b.t};${b.t + 0.05};0.9;1`} {...loop} />
            <circle cx={b.tip[0]} cy={b.tip[1]} r="17" fill="#fffaf0" stroke="#16a34a" strokeWidth="2.5" />
            <text x={b.tip[0]} y={b.tip[1] + 6} textAnchor="middle" fontSize="17">
              {icons[TREE_BRANCHES.indexOf(b)]}
            </text>
            <text x={b.tip[0]} y={b.tip[1] - 22} textAnchor="middle" fontSize="11.5" fontWeight="900" fill="#14532d" fontFamily="Georgia, serif">
              {b.label}
            </text>
          </g>
        </g>
      ))}
      <ellipse cx="230" cy="276" rx="40" ry="10" fill="#a16207" />
      <circle cx="230" cy="268" r="9" fill="#fde047" stroke="#a16207" strokeWidth="2" className="cg-anim-glow" />
      <text x="230" y="296" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#78350f" fontFamily="Georgia, serif">
        ancestral comum
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O Beagle navegando até Galápagos e os bicos dos tentilhões
// ---------------------------------------------------------------------------

function BeagleArt() {
  const beaks = [
    { name: "grosso", food: "sementes duras", d: "M14 -6 C30 -8 34 4 14 8 Z" },
    { name: "fino", food: "insetos", d: "M14 -3 L40 0 L14 3 Z" },
    { name: "longo", food: "flores de cacto", d: "M14 -3 C30 -2 44 4 48 8 C40 6 28 3 14 3 Z" },
    { name: "curvo", food: "larvas nos troncos", d: "M14 -5 C28 -10 38 0 34 10 C30 4 24 2 14 4 Z" },
  ];
  return (
    <Art viewBox="0 0 560 220" label="O navio Beagle navegando até as ilhas Galápagos e os tentilhões com bicos diferentes para cada alimento">
      <rect x="0" y="0" width="300" height="220" rx="14" fill="#e0f2fe" />
      {/* as ilhas */}
      <path d="M190 140 C200 110 240 104 270 140 Z" fill="#a16207" />
      <path d="M210 126 C220 110 236 108 246 120" stroke="#16a34a" strokeWidth="8" fill="none" strokeLinecap="round" />
      {/* o mar */}
      <path d="M0 140 L300 140 L300 220 L0 220 Z" fill="#38bdf8" />
      {[150, 172, 194].map((y, k) => (
        <path key={y} d={`M-40 ${y} q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0`} stroke="#e0f2fe" strokeWidth="2" fill="none" opacity="0.8">
          <animateTransform attributeName="transform" type="translate" values="0 0;40 0" dur={`${2 + k * 0.6}s`} repeatCount="indefinite" />
        </path>
      ))}
      {/* o Beagle balançando */}
      <g transform="translate(100 140)">
        <g>
          <animateTransform attributeName="transform" type="rotate" values="-3;3;-3" dur="3s" repeatCount="indefinite" />
          <path d="M-60 -10 L60 -10 L46 14 L-50 14 Z" fill="#7c2d12" stroke="#451a03" strokeWidth="2" />
          <path d="M-60 -10 L60 -10" stroke="#fbbf24" strokeWidth="2" />
          {[-30, 4, 36].map((x, k) => (
            <g key={x}>
              <path d={`M${x} -10 L${x} -78`} stroke="#451a03" strokeWidth="3" />
              <path d={`M${x - 2} ${-72 + k * 4} C${x + 26} ${-64 + k * 4} ${x + 24} ${-34} ${x - 2} -26 Z`} fill="#fef9c3" stroke="#a16207" strokeWidth="1.5" />
            </g>
          ))}
          <path d="M-30 -78 L-30 -90 L-16 -85 Z" fill="#dc2626" />
        </g>
      </g>
      <text x="150" y="24" textAnchor="middle" fontSize="13" fontWeight="900" fill="#0c4a6e" fontFamily="Georgia, serif">
        HMS Beagle (1831–1836)
      </text>
      <text x="230" y="102" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#78350f" fontFamily="Georgia, serif">
        Galápagos
      </text>
      {/* os tentilhões */}
      {beaks.map((b, i) => {
        const x = 340 + (i % 2) * 110;
        const y = 54 + Math.floor(i / 2) * 100;
        return (
          <g key={b.name} transform={`translate(${x} ${y})`}>
            <g className="cg-anim-hover" style={{ animationDelay: `${i * 0.5}s` }}>
              <ellipse cx="-6" cy="10" rx="18" ry="12" fill="#a16207" stroke="#57300c" strokeWidth="1.5" />
              <circle cx="4" cy="-2" r="12" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
              <circle cx="8" cy="-5" r="2.2" fill="#fff" />
              <path d={b.d} fill="#f59e0b" stroke="#92400e" strokeWidth="1.2" />
            </g>
            <text x="4" y="36" textAnchor="middle" fontSize="11.5" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
              bico {b.name}
            </text>
            <text x="4" y="50" textAnchor="middle" fontSize="10.5" fontStyle="italic" fill="#6b5a3a" fontFamily="Georgia, serif">
              {b.food}
            </text>
          </g>
        );
      })}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A seleção natural de tocar: o passarinho e os besouros
// ---------------------------------------------------------------------------

interface Beetle {
  id: number;
  green: boolean;
  x: number;
  y: number;
}

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const POP = 24;

function spread(n: number, rnd: () => number): [number, number][] {
  return Array.from({ length: n }, (_, i) => [24 + (i % 8) * 56 + rnd() * 24, 30 + Math.floor(i / 8) * 54 + rnd() * 18]);
}

function startPopulation(): Beetle[] {
  const rnd = seeded(7);
  return spread(POP, rnd).map(([x, y], i) => ({ id: i, green: i % 2 === 0, x, y }));
}

function BeetleIcon({ green }: { green: boolean }) {
  const body = green ? "#15803d" : "#92400e";
  return (
    <g>
      <path d="M-9 -4 l-5 -4 M-9 4 l-5 4 M0 -6 l0 -6 M0 6 l0 6 M9 -4 l5 -4 M9 4 l5 4" stroke="#1c1917" strokeWidth="1.5" />
      <ellipse rx="11" ry="8" fill={body} stroke="#1c1917" strokeWidth="1.2" />
      <path d="M-11 0 L11 0" stroke="#1c1917" strokeWidth="1" opacity="0.6" />
      <circle cx="12" cy="0" r="4.5" fill="#1c1917" />
    </g>
  );
}

export function SelectionSim() {
  const [pop, setPop] = useState<Beetle[]>(startPopulation);
  const [gen, setGen] = useState(1);
  const [eaten, setEaten] = useState<Set<number>>(new Set());
  const [history, setHistory] = useState<number[]>([12]);
  const [busy, setBusy] = useState(false);
  const greens = pop.filter((b) => b.green).length;

  const nextGeneration = () => {
    if (busy) return;
    const rnd = seeded(gen * 131 + greens * 7);
    // o passarinho enxerga muito mais os marrons em cima das folhas verdes
    const victims = new Set(pop.filter((b) => rnd() < (b.green ? 0.12 : 0.6)).map((b) => b.id));
    setEaten(victims);
    setBusy(true);
    window.setTimeout(() => {
      const survivors = pop.filter((b) => !victims.has(b.id));
      const parents = survivors.length ? survivors : pop;
      const r2 = seeded(gen * 977 + 3);
      const positions = spread(POP, r2);
      const next = positions.map(([x, y], i) => {
        const parent = parents[Math.floor(r2() * parents.length)];
        // de vez em quando nasce um filhote de outra cor (variação)
        const green = r2() < 0.04 ? !parent.green : parent.green;
        return { id: gen * 100 + i, green, x, y };
      });
      setPop(next);
      setEaten(new Set());
      setGen((g) => g + 1);
      setHistory((h) => [...h, next.filter((b) => b.green).length].slice(-8));
      setBusy(false);
    }, 1500);
  };

  const restart = () => {
    setPop(startPopulation());
    setGen(1);
    setEaten(new Set());
    setHistory([12]);
    setBusy(false);
  };

  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.5em]">
      <div className="flex flex-wrap items-stretch gap-[0.6em]">
        <div className="min-w-[60%] flex-[3]">
          <Art viewBox="0 0 470 180" label={`Geração ${gen}: ${greens} besouros verdes e ${POP - greens} marrons`}>
            <rect width="470" height="180" rx="12" fill="#4ade80" />
            {Array.from({ length: 22 }, (_, i) => (
              <path key={i} d={`M${(i * 53) % 470} ${(i * 37) % 180} q14 -10 28 0 q-14 10 -28 0 Z`} fill="#22c55e" stroke="#15803d" strokeWidth="1" />
            ))}
            {pop.map((b) => (
              <g key={b.id} transform={`translate(${b.x} ${b.y})`}>
                <g className={eaten.has(b.id) ? "cg-anim-poof-out" : "cg-anim-pop"} style={{ animationDelay: eaten.has(b.id) ? "0.5s" : `${(b.id % 24) * 0.02}s` }}>
                  <BeetleIcon green={b.green} />
                </g>
              </g>
            ))}
            {busy && (
              <g className="cg-anim-swoop">
                <path d="M0 0 C-10 -14 -26 -12 -34 -4 C-24 -6 -14 -2 -10 4 Z" fill="#1e3a8a" />
                <ellipse cx="6" cy="2" rx="16" ry="9" fill="#2563eb" />
                <circle cx="20" cy="-4" r="7" fill="#2563eb" />
                <path d="M26 -4 L34 -2 L26 0 Z" fill="#f59e0b" />
                <circle cx="22" cy="-6" r="1.6" fill="#fff" />
              </g>
            )}
          </Art>
        </div>
        <div className="flex min-w-[8em] flex-1 flex-col justify-between gap-[0.4em] text-[0.85em]">
          <div>
            <p className="font-black text-[#3b2a14]">Geração {gen}</p>
            <div className="mt-[0.3em] h-[1.1em] overflow-hidden rounded-full bg-[#92400e]">
              <div className="h-full rounded-full bg-[#16a34a] transition-all duration-700" style={{ width: `${(greens / POP) * 100}%` }} />
            </div>
            <p className="mt-[0.2em] text-[0.9em]">
              <span className="font-bold text-[#15803d]">{greens} verdes</span> · <span className="font-bold text-[#92400e]">{POP - greens} marrons</span>
            </p>
            <div className="mt-[0.4em] flex h-[2.6em] items-end gap-[3px]" aria-label="Verdes em cada geração">
              {history.map((h, i) => (
                <div key={i} className="flex-1 rounded-t bg-[#16a34a] transition-all" style={{ height: `${(h / POP) * 100}%` }} title={`${h} verdes`} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-[0.3em]">
            <button type="button" onClick={nextGeneration} disabled={busy} className="rounded-full bg-[#15803d] px-[0.8em] py-[0.3em] font-bold text-white transition-transform enabled:hover:scale-[1.03] disabled:opacity-50">
              🐦 Próxima geração
            </button>
            <button type="button" onClick={restart} className="rounded-full border border-[#d9c79d] bg-white px-[0.8em] py-[0.2em] font-bold text-[#5b4a2e] hover:bg-amber-50">
              ↺ Recomeçar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Lamarck × Darwin: as girafas
// ---------------------------------------------------------------------------

function Giraffe({ neck, faded = false }: { neck: number; faded?: boolean }) {
  return (
    <g opacity={faded ? 0.35 : 1}>
      <path d="M-14 0 L-16 34 M-4 2 L-4 34 M10 2 L10 34 M20 0 L22 34" stroke="#b45309" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="2" cy="-4" rx="26" ry="13" fill="#fbbf24" stroke="#92400e" strokeWidth="1.5" />
      {[-12, 2, 14].map((x) => (
        <circle key={x} cx={x} cy={-6 + (x % 3)} r="3.5" fill="#b45309" />
      ))}
      <path d={`M20 -10 L30 ${-10 - neck}`} stroke="#fbbf24" strokeWidth="9" strokeLinecap="round" />
      <path d={`M20 -10 L30 ${-10 - neck}`} stroke="#b45309" strokeWidth="2" strokeDasharray="4 8" />
      <ellipse cx="36" cy={-12 - neck} rx="10" ry="6" fill="#fbbf24" stroke="#92400e" strokeWidth="1.5" />
      <circle cx="36" cy={-14 - neck} r="1.4" fill="#1c1917" />
      <path d={`M30 ${-17 - neck} l-2 -6 M34 ${-17 - neck} l1 -6`} stroke="#92400e" strokeWidth="2" />
    </g>
  );
}

function GiraffesArt() {
  return (
    <Art viewBox="0 0 560 230" label="Lamarck achava que a girafa esticava o pescoço e passava isso aos filhos; Darwin explicou que as de pescoço maior já nasciam assim e sobreviviam mais">
      {/* Lamarck */}
      <rect x="4" y="4" width="266" height="222" rx="14" fill="#fee2e2" stroke="#fca5a5" strokeWidth="2" />
      <text x="137" y="26" textAnchor="middle" fontSize="14" fontWeight="900" fill="#991b1b" fontFamily="Georgia, serif">
        Lamarck (errado)
      </text>
      <g transform="translate(120 170)">
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0;0 -4;0 0" dur="2s" repeatCount="indefinite" />
          <Giraffe neck={70} />
        </g>
      </g>
      <path d="M180 60 C200 50 220 60 230 80" stroke="#16a34a" strokeWidth="14" strokeLinecap="round" fill="none" />
      <text x="137" y="206" textAnchor="middle" fontSize="11.5" fill="#7f1d1d" fontFamily="Georgia, serif">
        &ldquo;esticou o pescoço e os filhos herdaram&rdquo; ✗
      </text>
      {/* Darwin */}
      <rect x="290" y="4" width="266" height="222" rx="14" fill="#dcfce7" stroke="#86efac" strokeWidth="2" />
      <text x="423" y="26" textAnchor="middle" fontSize="14" fontWeight="900" fill="#14532d" fontFamily="Georgia, serif">
        Darwin (certo)
      </text>
      <path d="M470 60 C490 50 520 56 540 76" stroke="#16a34a" strokeWidth="14" strokeLinecap="round" fill="none" />
      {[
        [330, 30, true],
        [400, 52, false],
        [470, 78, false],
      ].map(([x, neck, faded], i) => (
        <g key={i} transform={`translate(${x as number} 170)`}>
          <Giraffe neck={neck as number} faded={faded as boolean} />
        </g>
      ))}
      <text x="423" y="206" textAnchor="middle" fontSize="11.5" fill="#14532d" fontFamily="Georgia, serif">
        já nascem diferentes; as que alcançam a comida sobrevivem ✓
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As camadas de fósseis e o parentesco com os grandes macacos
// ---------------------------------------------------------------------------

function FossilsArt() {
  const layers = ["#d6b98c", "#c9a36b", "#b98b52", "#a5763f", "#8d5f2c"];
  return (
    <Art viewBox="0 0 560 230" label="Camadas de rocha com fósseis, as mais antigas embaixo, e a árvore de parentesco entre gorila, chimpanzé e ser humano">
      {layers.map((c, i) => (
        <path key={c} d={`M10 ${20 + i * 40} C90 ${14 + i * 40} 180 ${26 + i * 40} 260 ${20 + i * 40} L260 ${60 + i * 40} C180 ${66 + i * 40} 90 ${54 + i * 40} 10 ${60 + i * 40} Z`} fill={c} stroke="#7c5a2e" strokeWidth="1" />
      ))}
      {/* os fósseis, do mais novo (em cima) ao mais antigo (embaixo) */}
      <g className="cg-anim-glow" style={{ animationDelay: "0s", "--cg-dur": "4s" } as React.CSSProperties}>
        <path d="M100 42 C110 30 130 30 140 42 C132 50 108 50 100 42 Z" fill="#f5f5f4" stroke="#57534e" strokeWidth="1.5" />
        <circle cx="128" cy="40" r="2.5" fill="#57534e" />
      </g>
      <g className="cg-anim-glow" style={{ animationDelay: "0.8s", "--cg-dur": "4s" } as React.CSSProperties}>
        <path d="M70 82 L90 74 L104 84 L118 74 L132 84 L146 74 L160 82" stroke="#f5f5f4" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="62" cy="82" r="7" fill="#f5f5f4" stroke="#57534e" strokeWidth="1.2" />
      </g>
      <g className="cg-anim-glow" style={{ animationDelay: "1.6s", "--cg-dur": "4s" } as React.CSSProperties}>
        <path d="M150 120 L190 120 M160 112 L162 128 M170 112 L172 128 M180 112 L182 128" stroke="#f5f5f4" strokeWidth="2.5" />
        <path d="M150 120 L140 116 L144 124 Z" fill="#f5f5f4" />
      </g>
      <g className="cg-anim-glow" style={{ animationDelay: "2.4s", "--cg-dur": "4s" } as React.CSSProperties}>
        <path d="M80 160 m-14 0 a14 14 0 1 0 28 0 a10 10 0 1 0 -20 0 a6 6 0 1 0 12 0" stroke="#f5f5f4" strokeWidth="3" fill="none" />
      </g>
      <g className="cg-anim-glow" style={{ animationDelay: "3.2s", "--cg-dur": "4s" } as React.CSSProperties}>
        <ellipse cx="170" cy="200" rx="18" ry="11" fill="#f5f5f4" stroke="#57534e" strokeWidth="1.2" />
        <path d="M156 200 L184 200 M162 192 L162 208 M170 190 L170 210 M178 192 L178 208" stroke="#57534e" strokeWidth="1" />
      </g>
      <path d="M280 30 L280 200" stroke="#78350f" strokeWidth="3" />
      <path d="M272 190 L280 204 L288 190" stroke="#78350f" strokeWidth="3" fill="none" />
      <text x="290" y="120" fontSize="11" fontWeight="900" fill="#78350f" fontFamily="Georgia, serif" transform="rotate(90 290 120)" textAnchor="middle">
        mais antigo
      </text>
      {/* o parentesco */}
      <g fontFamily="Georgia, serif" fontWeight="900" fontSize="12" textAnchor="middle">
        {[
          ["M430 200 L430 160 L360 110 L360 46", "Gorila", 360],
          ["M430 160 L460 130 L430 80 L430 46", "Chimpanzé", 430],
          ["M460 130 L510 80 L510 46", "Ser humano", 510],
        ].map(([d, name, x], i) => (
          <g key={name as string}>
            <path d={d as string} stroke="#16a34a" strokeWidth="4" fill="none" strokeDasharray="220" strokeDashoffset="220">
              <animate attributeName="stroke-dashoffset" values="220;0;0" keyTimes="0;0.3;1" dur="6s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            </path>
            <text x={x as number} y="38" fill="#14532d">
              {name}
            </text>
          </g>
        ))}
        <circle cx="460" cy="130" r="7" fill="#fde047" stroke="#a16207" strokeWidth="2" className="cg-anim-glow" />
        <text x="480" y="160" fill="#a16207" fontSize="11" textAnchor="start">
          ancestral comum
        </text>
        <text x="480" y="174" fill="#6b5a3a" fontSize="10.5" fontWeight="700" textAnchor="start">
          (~6 a 7 milhões de anos)
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A classificação: do reino à espécie
// ---------------------------------------------------------------------------

function TaxonomyArt() {
  const ranks = [
    ["Reino", "Animalia", "todos os animais"],
    ["Filo", "Chordata", "animais com notocorda/coluna"],
    ["Classe", "Mammalia", "mamíferos"],
    ["Ordem", "Primates", "primatas"],
    ["Família", "Hominidae", "grandes macacos e humanos"],
    ["Gênero", "Homo", "humanos (atuais e extintos)"],
    ["Espécie", "Homo sapiens", "nós!"],
  ];
  return (
    <Art viewBox="0 0 560 250" label="A classificação do ser humano: Reino Animalia, Filo Chordata, Classe Mammalia, Ordem Primates, Família Hominidae, Gênero Homo, Espécie Homo sapiens">
      {ranks.map(([rank, name, note], i) => {
        const w = 520 - i * 58;
        return (
          <g key={rank} className="cg-anim-pop" style={{ animationDelay: `${i * 0.18}s` }}>
            <rect x={280 - w / 2} y={6 + i * 34} width={w} height="30" rx="8" fill={["#ede9fe", "#ddd6fe", "#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed", "#5b21b6"][i]} />
            <text x="280" y={26 + i * 34} textAnchor="middle" fontSize="12.5" fontWeight="900" fill={i > 3 ? "#fff" : "#3b0764"} fontFamily="Georgia, serif">
              {rank}: <tspan fontStyle={i >= 5 ? "italic" : "normal"}>{name}</tspan>
              {i < 5 && <tspan fontWeight="400" fontSize="11"> · {note}</tspan>}
            </text>
          </g>
        );
      })}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A bactéria que fabrica insulina humana (transgênica)
// ---------------------------------------------------------------------------

function TransgenicArt() {
  return (
    <Art viewBox="0 0 560 190" label="O gene humano da insulina é cortado, colocado no plasmídio de uma bactéria, as bactérias se multiplicam e fabricam insulina">
      {/* 1: célula humana e o gene */}
      <g>
        <circle cx="70" cy="80" r="52" fill="#fecdd3" stroke="#f43f5e" strokeWidth="3" />
        <circle cx="70" cy="80" r="26" fill="#ddd6fe" stroke="#7c3aed" strokeWidth="2" />
        <path d="M52 80 L88 80" stroke="#7c3aed" strokeWidth="5" />
        <rect x="62" y="75" width="16" height="10" fill="#fde047" stroke="#a16207" strokeWidth="1.5" className="cg-anim-glow" />
        {/* a tesoura cortando */}
        <g transform="translate(70 40)">
          <g>
            <animateTransform attributeName="transform" type="rotate" values="-18;0;-18" dur="1s" repeatCount="indefinite" />
            <path d="M0 0 L-6 -16" stroke="#475569" strokeWidth="3" />
            <circle cx="-8" cy="-20" r="4" fill="none" stroke="#475569" strokeWidth="2" />
          </g>
          <g>
            <animateTransform attributeName="transform" type="rotate" values="18;0;18" dur="1s" repeatCount="indefinite" />
            <path d="M0 0 L6 -16" stroke="#475569" strokeWidth="3" />
            <circle cx="8" cy="-20" r="4" fill="none" stroke="#475569" strokeWidth="2" />
          </g>
        </g>
      </g>
      {/* 2: o plasmídio da bactéria recebendo o gene */}
      <g transform="translate(220 80)">
        <rect x="-58" y="-34" width="116" height="68" rx="34" fill="#d9f99d" stroke="#4d7c0f" strokeWidth="3" />
        <circle r="20" fill="none" stroke="#a855f7" strokeWidth="4" />
        <rect x="12" y="-8" width="14" height="10" fill="#fde047" stroke="#a16207" strokeWidth="1.5" className="cg-anim-glow" />
      </g>
      {/* 3: as bactérias se multiplicando */}
      <g transform="translate(360 80)">
        {[
          [-26, -22], [10, -26], [-30, 12], [6, 8], [30, -2], [-6, 30],
        ].map(([x, y], i) => (
          <g key={i} className="cg-anim-pop" style={{ animationDelay: `${i * 0.25}s` }}>
            <rect x={x - 14} y={y - 7} width="28" height="14" rx="7" fill="#d9f99d" stroke="#4d7c0f" strokeWidth="1.5" />
            <circle cx={x} cy={y} r="3" fill="#fde047" />
          </g>
        ))}
      </g>
      {/* 4: o frasco de insulina */}
      <g transform="translate(490 80)">
        <rect x="-18" y="-30" width="36" height="58" rx="6" fill="#e0f2fe" stroke="#0369a1" strokeWidth="2.5" />
        <rect x="-12" y="-42" width="24" height="12" rx="2" fill="#94a3b8" />
        <rect x="-18" y="0" width="36" height="28" rx="6" fill="#7dd3fc" className="cg-anim-glow" />
        <text y="-8" textAnchor="middle" fontSize="9" fontWeight="900" fill="#0c4a6e" fontFamily="Georgia, serif">
          insulina
        </text>
      </g>
      {[
        [126, 160],
        [282, 316],
        [404, 460],
      ].map(([a, b]) => (
        <g key={a}>
          <path d={`M${a} 80 L${b} 80`} stroke="#b08a52" strokeWidth="3" strokeDasharray="6 4" className="cg-anim-dash" />
          <path d={`M${b - 8} 73 L${b + 2} 80 L${b - 8} 87`} stroke="#b08a52" strokeWidth="3" fill="none" />
        </g>
      ))}
      <g fontFamily="Georgia, serif" fontSize="11.5" fontWeight="700" fill="#3b2a14" textAnchor="middle">
        <text x="70" y="160">1. corta o gene humano</text>
        <text x="220" y="140">2. coloca na bactéria</text>
        <text x="360" y="140">3. elas se multiplicam</text>
        <text x="490" y="140">4. fabricam insulina</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 10, content, bare });

export const chapter10: BookPage[] = [
  page(
    <ChapterOpener
      n={10}
      title="Evolução e Biotecnologia"
      goals={["A teoria da evolução de Darwin", "Como a seleção natural muda uma população", "O que os fósseis contam e como os seres vivos são classificados", "O que são transgênicos e clones"]}
    >
      <Fig h={34}>
        <TreeOfLifeArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="⛵">Darwin e a seleção natural</H>
      <P>
        Em 1831, o jovem naturalista inglês <T>Charles Darwin</T> embarcou no navio <T>Beagle</T> para uma viagem de cinco anos ao redor do mundo, passando pelo Brasil. Nas
        ilhas <T>Galápagos</T>, ele reparou que os tentilhões (pequenos pássaros) de cada ilha tinham bicos diferentes, cada um adequado ao alimento do lugar.
      </P>
      <Fig n="10.1" caption="A viagem do Beagle e os bicos dos tentilhões de Galápagos." h={24}>
        <BeagleArt />
      </Fig>
      <P>
        Em 1859, Darwin publicou <em>A Origem das Espécies</em>, com a teoria da <T>evolução por seleção natural</T> (o naturalista <T>Alfred Wallace</T> chegou à mesma ideia ao
        mesmo tempo). As ideias principais são:
      </P>
      <List
        items={[
          "Os indivíduos de uma espécie são diferentes entre si (variação), e muitas diferenças passam para os filhos.",
          "Nascem mais filhotes do que o ambiente consegue sustentar, e eles competem por comida e abrigo.",
          <>
            Os mais <T>adaptados</T> ao ambiente sobrevivem e deixam mais descendentes. Com o tempo, as características vantajosas ficam mais comuns na população.
          </>,
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🐞">Seleção natural em ação</H>
      <P>
        Imagine besouros verdes e marrons vivendo em folhas verdes. Um passarinho enxerga muito mais fácil os marrons. Toque em <strong>Próxima geração</strong> e veja o que
        acontece com a população:
      </P>
      <SelectionSim />
      <P>
        Os besouros não &ldquo;escolheram&rdquo; ficar verdes: os verdes simplesmente sobreviveram mais e deixaram mais filhotes. É assim que a seleção natural funciona.
      </P>
      <Box kind="atencao" title="Bactérias resistentes">
        O mesmo acontece com os antibióticos! O remédio mata as bactérias sensíveis, mas as poucas que já eram resistentes sobrevivem e se multiplicam. Por isso só se toma
        antibiótico com receita e até o fim do tratamento.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🦒">Lamarck × Darwin</H>
      <P>
        Antes de Darwin, o francês <T>Jean-Baptiste Lamarck</T> propôs que os seres vivos mudavam pelo <em>uso e desuso</em>: a girafa teria esticado o pescoço para alcançar as
        folhas altas e passado o pescoço mais comprido aos filhos.
      </P>
      <Fig n="10.2" caption="Lamarck e Darwin explicando o pescoço da girafa." h={26}>
        <GiraffesArt />
      </Fig>
      <P>
        Hoje sabemos que <T>características adquiridas durante a vida não são herdadas</T>: só passa para os filhos o que está no DNA dos gametas. Se você malhar e ficar forte,
        seus filhos não nascem fortes por isso! Darwin explicou certo: as girafas já nasciam com pescoços de tamanhos diferentes, e as de pescoço maior comiam mais e deixavam
        mais filhotes.
      </P>
      <Box kind="mago">Lamarck errou na explicação, mas foi um dos primeiros a dizer que as espécies mudam com o tempo. Na ciência, até as ideias erradas ajudam a chegar nas certas!</Box>
    </>,
  ),

  page(
    <>
      <H icon="🦴">Fósseis e parentesco</H>
      <P>
        <T>Fósseis</T> são restos ou marcas de seres vivos que viveram há muito tempo, preservados nas rochas: ossos, conchas, pegadas e até folhas. As camadas de rocha se
        formam umas sobre as outras, então, em geral, <T>quanto mais funda a camada, mais antigo o fóssil</T>.
      </P>
      <Fig n="10.3" caption="Os fósseis nas camadas de rocha e a árvore de parentesco dos grandes macacos." h={26}>
        <FossilsArt />
      </Fig>
      <P>
        Os fósseis, a comparação dos corpos e, hoje, a comparação do DNA mostram que todos os seres vivos são parentes. Atenção: o ser humano <T>não veio do chimpanzé</T>! As duas
        espécies são &ldquo;primas&rdquo;: descendem de um <T>ancestral comum</T> que viveu há uns 6 a 7 milhões de anos.
      </P>
    </>,
  ),

  page(
    <>
      <H icon="🗂️">Classificando os seres vivos</H>
      <P>
        Para organizar os milhões de espécies, o cientista sueco <T>Carlos Lineu</T> criou um sistema de grupos dentro de grupos, do mais amplo (o reino) ao mais específico (a
        espécie). Veja onde nós ficamos:
      </P>
      <Fig n="10.4" caption="A classificação do ser humano, do reino à espécie." h={28}>
        <TaxonomyArt />
      </Fig>
      <P>
        O <T>nome científico</T> tem duas palavras, em latim: o gênero, com inicial maiúscula, e a espécie, em minúscula, escritos em <em>itálico</em> (ou sublinhados):{" "}
        <em>Homo sapiens</em>, <em>Canis familiaris</em> (o cachorro), <em>Panthera onca</em> (a onça-pintada).
      </P>
      <Box kind="mago" title="Macete do Mago">
        Para lembrar a ordem: &ldquo;<strong>Rei Fi</strong>lipe <strong>Cla</strong>ssificou a <strong>Or</strong>dem da <strong>Fa</strong>mília do <strong>Gê</strong>nero{" "}
        <strong>Es</strong>pécie&rdquo; = Reino, Filo, Classe, Ordem, Família, Gênero, Espécie.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🧪">Biotecnologia: transgênicos e clones</H>
      <P>
        <T>Biotecnologia</T> é usar seres vivos (ou partes deles) para criar produtos úteis. Um dos maiores feitos foi o <T>organismo transgênico</T>: um ser vivo que recebeu um
        gene de outra espécie, por engenharia genética.
      </P>
      <Fig n="10.5" caption="A bactéria transgênica que fabrica insulina humana para quem tem diabetes." h={22}>
        <TransgenicArt />
      </Fig>
      <Cards
        items={[
          { icon: "🐑", title: "A ovelha Dolly (1996)", text: "O primeiro mamífero clonado a partir de uma célula de um adulto, na Escócia. Um clone tem o mesmo DNA do original." },
          { icon: "🌽", title: "Plantas transgênicas", text: "Como o milho que resiste a pragas. Os cientistas estudam com cuidado os efeitos na saúde e no ambiente." },
        ]}
      />
      <Box kind="lembre" title="Ciência com responsabilidade">
        A biotecnologia salva vidas, mas também levanta debates éticos (sobre clonar animais ou editar genes, por exemplo). Por isso as pesquisas seguem regras e leis.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Darwin (e Wallace): os indivíduos variam, e os mais adaptados sobrevivem e deixam mais descendentes (seleção natural).",
          "Lamarck errou: características adquiridas durante a vida não são herdadas.",
          "Fósseis mostram seres do passado; humanos e chimpanzés têm um ancestral comum.",
          "Classificação: Reino, Filo, Classe, Ordem, Família, Gênero e Espécie. Nome científico: Homo sapiens.",
          "Transgênico recebeu um gene de outra espécie; clone tem o mesmo DNA do original (a ovelha Dolly).",
        ]}
      />
      <Glossary
        items={[
          ["Adaptação", "Característica que ajuda um ser vivo a sobreviver no seu ambiente."],
          ["Seleção natural", "Os mais adaptados sobrevivem e se reproduzem mais."],
          ["Fóssil", "Resto ou marca de um ser vivo antigo, preservado na rocha."],
          ["Espécie", "Seres parecidos que se reproduzem entre si e têm filhos férteis."],
          ["Transgênico", "Ser vivo que recebeu um gene de outra espécie."],
        ]}
      />
      <Quiz
        items={[
          ["Quem propôs a teoria da evolução por seleção natural?", "Charles Darwin (e, ao mesmo tempo, Alfred Wallace)."],
          ["Por que o uso exagerado de antibióticos cria bactérias resistentes?", "Porque as bactérias que já eram resistentes sobrevivem e se multiplicam: é a seleção natural."],
          ["Como se escreve o nome científico do ser humano?", "Homo sapiens: gênero com maiúscula, espécie com minúscula, em itálico."],
          ["O ser humano veio do chimpanzé?", "Não! Os dois descendem de um ancestral comum que viveu há uns 6 a 7 milhões de anos."],
        ]}
      />
    </>,
  ),
];

/** A linha do tempo da Biologia: a página final do livro, antes dos parabéns. */
export const TIMELINE = [
  ["1665", "Robert Hooke vê as células da cortiça no microscópio."],
  ["1859", "Darwin publica A Origem das Espécies."],
  ["1865", "Mendel apresenta as leis da herança, com as ervilhas."],
  ["1900", "Nasce no Rio o instituto que, com Oswaldo Cruz, viraria a Fiocruz."],
  ["1909", "Carlos Chagas descreve a doença de Chagas."],
  ["1928", "Alexander Fleming descobre a penicilina."],
  ["1953", "Watson, Crick e Rosalind Franklin revelam a dupla hélice."],
  ["1996", "Nasce a ovelha Dolly, o primeiro clone de mamífero adulto."],
  ["2003", "Os cientistas terminam de ler o genoma humano."],
  ["2020", "Nobel para a tesoura genética CRISPR."],
] as const;

export function TimelinePage() {
  return (
    <div>
      <H icon="⏳">A linha do tempo da Biologia</H>
      <P>Algumas das descobertas que você conheceu neste livro, em ordem:</P>
      <ol className="relative ml-[0.6em] border-l-[3px] pl-[1.1em]" style={{ borderColor: "var(--bk-accent)" }}>
        {TIMELINE.map(([year, text], i) => (
          <li key={year} className="cg-anim-rise relative mb-[0.45em]" style={{ animationDelay: `${i * 0.08}s` }}>
            <span className="absolute -left-[1.62em] top-[0.2em] h-[0.9em] w-[0.9em] rounded-full border-2 border-white" style={{ background: "var(--bk-accent)" }} />
            <span className="cg-book-title mr-[0.4em] font-black" style={{ color: "var(--bk-dark)" }}>
              {year}
            </span>
            <span className="text-[0.92em]">{text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
