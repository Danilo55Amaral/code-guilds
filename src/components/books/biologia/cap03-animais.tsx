"use client";

import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, Label, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";

// ============================================================================
// CAPÍTULO 3 — O REINO ANIMAL (missão "Biologia: O Reino Animal"): o desfile
// dos bichos (peixes nadando, ave voando, sapo pulando), o esqueleto com a
// coluna vertebral × a água-viva e a minhoca, os cinco grupos de vertebrados,
// o ciclo da metamorfose do sapo e o inseto × a aranha.
// ============================================================================

// ---------------------------------------------------------------------------
// Os bichos (cada um desenhado em volta de 0, 0, virado pra direita)
// ---------------------------------------------------------------------------

function Fish({ color = "#38bdf8", dark = "#0369a1" }: { color?: string; dark?: string }) {
  return (
    <g>
      <g>
        <animateTransform attributeName="transform" type="rotate" values="-14 -26 0;14 -26 0;-14 -26 0" dur="0.6s" repeatCount="indefinite" />
        <path d="M-26 0 L-44 -14 L-40 0 L-44 14 Z" fill={color} stroke={dark} strokeWidth="1.5" />
      </g>
      <path d="M-30 0 C-20 -18 15 -18 30 0 C15 18 -20 18 -30 0 Z" fill={color} stroke={dark} strokeWidth="1.8" />
      <path d="M-6 -14 C0 -24 10 -22 14 -12 Z" fill={dark} opacity="0.7" />
      <path d="M10 -9 C6 -3 6 3 10 9" stroke={dark} strokeWidth="1.5" fill="none" />
      {[-14, -4].map((x) => (
        <path key={x} d={`M${x} -6 q4 6 0 12`} stroke="#fff" strokeWidth="1" fill="none" opacity="0.6" />
      ))}
      <circle cx="19" cy="-4" r="3.2" fill="#fff" />
      <circle cx="20" cy="-4" r="1.6" fill="#0f172a" />
    </g>
  );
}

function Frog() {
  return (
    <g>
      <path d="M-16 14 C-28 18 -30 6 -22 4 M16 14 C28 18 30 6 22 4" stroke="#15803d" strokeWidth="6" fill="none" strokeLinecap="round" />
      <ellipse cx="0" cy="4" rx="20" ry="14" fill="#4ade80" stroke="#15803d" strokeWidth="2" />
      <ellipse cx="0" cy="8" rx="11" ry="7" fill="#bbf7d0" />
      <circle cx="-9" cy="-10" r="6.5" fill="#4ade80" stroke="#15803d" strokeWidth="2" />
      <circle cx="9" cy="-10" r="6.5" fill="#4ade80" stroke="#15803d" strokeWidth="2" />
      <circle cx="-9" cy="-10" r="3" fill="#0f172a" />
      <circle cx="9" cy="-10" r="3" fill="#0f172a" />
      <path d="M-7 0 Q0 5 7 0" stroke="#15803d" strokeWidth="1.5" fill="none" />
      <path d="M-12 16 l-6 4 M12 16 l6 4" stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

function Caiman() {
  return (
    <g>
      <path d="M-30 2 C-50 0 -64 8 -76 4 C-62 12 -46 14 -30 12 Z" fill="#4d7c0f" stroke="#1a2e05" strokeWidth="1.5" />
      <path d="M-32 -6 C-10 -14 20 -12 30 -6 L58 -4 C64 -2 64 4 58 6 L30 8 C10 14 -20 14 -32 8 Z" fill="#65a30d" stroke="#1a2e05" strokeWidth="1.8" />
      {[-24, -14, -4, 6, 16].map((x) => (
        <path key={x} d={`M${x} -10 l4 -4 l4 4`} fill="#3f6212" stroke="#1a2e05" strokeWidth="0.8" />
      ))}
      <path d="M36 2 L58 2" stroke="#1a2e05" strokeWidth="1" />
      {[40, 46, 52].map((x) => (
        <path key={x} d={`M${x} 2 l1.5 3 l1.5 -3`} fill="#fff" />
      ))}
      <circle cx="30" cy="-9" r="3.5" fill="#facc15" stroke="#1a2e05" strokeWidth="1" />
      <path d="M30 -11 L30 -7" stroke="#1a2e05" strokeWidth="1.2" />
      <path d="M-20 10 l-6 10 M-2 12 l-4 10 M14 11 l4 10 M24 9 l6 9" stroke="#3f6212" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

function Bird({ flap = true }: { flap?: boolean }) {
  return (
    <g>
      <path d="M-18 0 L-32 -6 L-30 6 Z" fill="#1d4ed8" />
      <ellipse cx="0" cy="0" rx="18" ry="11" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="1.5" />
      <circle cx="16" cy="-8" r="8" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="1.5" />
      <path d="M23 -9 L32 -6 L23 -4 Z" fill="#f59e0b" />
      <circle cx="18" cy="-10" r="1.8" fill="#0f172a" />
      <ellipse cx="2" cy="4" rx="9" ry="5" fill="#bfdbfe" />
      <g className={flap ? "cg-anim-flap" : undefined} style={{ transformOrigin: "50% 100%", animationDuration: "0.25s" }}>
        <path d="M-6 -4 C-10 -26 8 -30 10 -6 Z" fill="#60a5fa" stroke="#1e3a8a" strokeWidth="1.5" />
      </g>
    </g>
  );
}

function Capybara() {
  return (
    <g>
      <rect x="-30" y="-14" width="52" height="30" rx="15" fill="#a16207" stroke="#57300c" strokeWidth="1.8" />
      <rect x="10" y="-24" width="28" height="22" rx="8" fill="#a16207" stroke="#57300c" strokeWidth="1.8" />
      <rect x="30" y="-18" width="10" height="13" rx="4" fill="#78350f" />
      <circle cx="14" cy="-25" r="4" fill="#78350f" />
      <circle cx="24" cy="-17" r="2" fill="#1c1917" />
      {[-22, -10, 2, 14].map((x) => (
        <rect key={x} x={x} y="12" width="7" height="12" rx="3" fill="#78350f" />
      ))}
    </g>
  );
}

// ---------------------------------------------------------------------------
// Abertura: o desfile dos bichos na praia
// ---------------------------------------------------------------------------

function AnimalParadeArt() {
  return (
    <Art viewBox="0 0 520 300" label="Peixes nadando, uma ave voando, um sapo pulando e uma capivara na margem">
      <rect x="0" y="0" width="520" height="180" fill="#e0f2fe" />
      <circle cx="450" cy="50" r="26" fill="#fde047" className="cg-anim-glow" />
      <path d="M0 150 C60 140 120 160 200 150 L260 180 L0 180 Z" fill="#86efac" />
      <path d="M0 178 L520 178 L520 300 L0 300 Z" fill="#38bdf8" />
      <path d="M0 178 Q30 172 60 178 T120 178 T180 178 T240 178 T300 178 T360 178 T420 178 T480 178 T540 178" stroke="#e0f2fe" strokeWidth="3" fill="none">
        <animateTransform attributeName="transform" type="translate" values="0 0;-60 0" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M200 150 C260 150 320 170 330 180 L200 180 Z" fill="#fde68a" />
      {/* algas balançando */}
      {[40, 150, 330, 470].map((x, i) => (
        <path key={x} d={`M${x} 300 C${x - 10} 280 ${x + 10} 262 ${x} 240`} stroke="#15803d" strokeWidth="5" fill="none" className="cg-anim-sway" style={{ animationDelay: `${i * 0.6}s` }} />
      ))}
      {/* peixes nadando */}
      <g>
        <animateMotion dur="10s" repeatCount="indefinite" rotate="auto" path="M-60 240 C80 210 200 270 320 230 S480 220 600 250" />
        <Fish />
      </g>
      <g>
        <animateMotion dur="13s" begin="-5s" repeatCount="indefinite" rotate="auto" path="M-60 270 C100 290 220 250 360 280 S520 260 600 270" />
        <g transform="scale(0.7)">
          <Fish color="#fb923c" dark="#9a3412" />
        </g>
      </g>
      {/* bolhinhas */}
      {[90, 260, 410].map((x, i) => (
        <circle key={x} cx={x} cy="290" r="4" fill="none" stroke="#e0f2fe" strokeWidth="1.5" className="cg-anim-aura-rise" style={{ "--cg-dur": "3s", "--cg-delay": `${i}s` } as React.CSSProperties} />
      ))}
      {/* a ave voando */}
      <g>
        <animateMotion dur="9s" repeatCount="indefinite" path="M-40 80 C100 40 260 100 380 50 S520 70 580 40" />
        <Bird />
      </g>
      {/* o sapo pulando e a capivara */}
      <g transform="translate(250 150)">
        <g className="cg-anim-hop">
          <Frog />
        </g>
      </g>
      <g transform="translate(90 140)">
        <Capybara />
      </g>
      {/* borboleta */}
      <g>
        <animateMotion dur="7s" repeatCount="indefinite" path="M400 140 C380 100 440 90 430 130 C420 170 360 150 400 140 Z" />
        <g className="cg-anim-flap">
          <path d="M0 0 C-10 -12 -15 -2 -7 3 C-13 8 -7 15 0 5 C7 15 13 8 7 3 C15 -2 10 -12 0 0 Z" fill="#f472b6" stroke="#9d174d" strokeWidth="1" />
        </g>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Vertebrado (com coluna) × invertebrados (sem coluna)
// ---------------------------------------------------------------------------

function BackboneArt() {
  return (
    <Art viewBox="0 0 540 210" label="O esqueleto de um peixe, com crânio e coluna vertebral, ao lado de uma água-viva e uma minhoca, que não têm coluna">
      {/* o esqueleto do peixe */}
      <g transform="translate(150 96)">
        <path d="M-120 0 C-60 -50 70 -50 110 0 C70 50 -60 50 -120 0 Z" fill="#e0f2fe" stroke="#7dd3fc" strokeWidth="2" opacity="0.8" />
        <path d="M-118 0 L-150 -24 L-142 0 L-150 24 Z" fill="#e0f2fe" stroke="#7dd3fc" strokeWidth="2" />
        <path d="M70 -22 C96 -18 108 -6 110 0 C100 14 84 22 64 22 C58 8 58 -8 70 -22 Z" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
        <circle cx="86" cy="-6" r="5" fill="#475569" />
        {Array.from({ length: 16 }, (_, i) => {
          const x = -110 + i * 11.5;
          return (
            <g key={i}>
              <rect x={x} y="-4" width="9" height="8" rx="2" fill="#f8fafc" stroke="#475569" strokeWidth="1.2" className="cg-anim-twinkle" style={{ animationDelay: `${i * 0.12}s`, animationDuration: "3s" }} />
              {i > 1 && i < 14 && <path d={`M${x + 4.5} -4 C${x + 2} -18 ${x + 6} -28 ${x + 10} -32 M${x + 4.5} 4 C${x + 2} 18 ${x + 6} 28 ${x + 10} 32`} stroke="#94a3b8" strokeWidth="1.5" fill="none" />}
            </g>
          );
        })}
      </g>
      <text x="150" y="176" textAnchor="middle" fontSize="13" fontWeight="900" fill="#1e3a8a" fontFamily="Georgia, serif">
        Vertebrado
      </text>
      <text x="150" y="194" textAnchor="middle" fontSize="11.5" fill="#5b4a2e" fontFamily="Georgia, serif">
        crânio + coluna vertebral
      </text>
      {/* a água-viva pulsando */}
      <g transform="translate(380 70)">
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 6;0 -6;0 6" dur="2.4s" repeatCount="indefinite" />
          <g>
            <animateTransform attributeName="transform" type="scale" values="1 1;1.12 0.82;1 1" dur="1.2s" repeatCount="indefinite" />
            <path d="M-34 0 C-34 -40 34 -40 34 0 C22 -6 12 4 0 -2 C-12 4 -22 -6 -34 0 Z" fill="#f0abfc" stroke="#a21caf" strokeWidth="2" opacity="0.9" />
          </g>
          {[-22, -10, 2, 14, 24].map((x, i) => (
            <path key={x} d={`M${x} 0 C${x - 6} 16 ${x + 6} 28 ${x} 46`} stroke="#c026d3" strokeWidth="2" fill="none" opacity="0.8" className="cg-anim-sway" style={{ animationDuration: "2s", animationDelay: `${i * 0.2}s` }} />
          ))}
        </g>
      </g>
      {/* a minhoca se mexendo */}
      <path d="M440 150 C460 136 480 164 500 150 S530 140 536 150" stroke="#f9a8d4" strokeWidth="9" fill="none" strokeLinecap="round">
        <animate attributeName="d" values="M440 150 C460 136 480 164 500 150 S530 140 536 150;M440 150 C460 164 480 136 500 150 S530 160 536 150;M440 150 C460 136 480 164 500 150 S530 140 536 150" dur="1.6s" repeatCount="indefinite" />
      </path>
      <text x="420" y="176" textAnchor="middle" fontSize="13" fontWeight="900" fill="#86198f" fontFamily="Georgia, serif">
        Invertebrados
      </text>
      <text x="420" y="194" textAnchor="middle" fontSize="11.5" fill="#5b4a2e" fontFamily="Georgia, serif">
        sem coluna vertebral
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os cinco grupos de vertebrados
// ---------------------------------------------------------------------------

function VertebrateGroupsArt() {
  const groups = [
    { name: "Peixes", note: "brânquias", el: <Fish /> },
    { name: "Anfíbios", note: "metamorfose", el: <Frog /> },
    { name: "Répteis", note: "escamas", el: <g transform="scale(0.72)"><Caiman /></g> },
    { name: "Aves", note: "penas e bico", el: <Bird /> },
    { name: "Mamíferos", note: "pelos e leite", el: <Capybara /> },
  ];
  return (
    <Art viewBox="0 0 600 150" label="Os cinco grupos de vertebrados: peixes, anfíbios, répteis, aves e mamíferos">
      {groups.map((g, i) => (
        <g key={g.name} transform={`translate(${60 + i * 120} 0)`}>
          <circle cx="0" cy="58" r="50" fill={["#e0f2fe", "#dcfce7", "#ecfccb", "#dbeafe", "#fef3c7"][i]} stroke="#d9c79d" strokeWidth="2" />
          <g transform="translate(0 60)">
            <g className="cg-anim-hover" style={{ animationDelay: `${i * 0.4}s`, animationDuration: "3.5s" }}>
              {g.el}
            </g>
          </g>
          <text y="128" textAnchor="middle" fontSize="14.5" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
            {g.name}
          </text>
          <text y="145" textAnchor="middle" fontSize="11.5" fontStyle="italic" fill="#6b5a3a" fontFamily="Georgia, serif">
            {g.note}
          </text>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A metamorfose do sapo, num ciclo (a fase da vez acende)
// ---------------------------------------------------------------------------

function FrogCycleArt() {
  const cx = 150;
  const cy = 128;
  const r = 92;
  const stages = [
    { label: "Ovos", x: cx, y: cy - r },
    { label: "Girino", x: cx + r, y: cy },
    { label: "Girino com patas", x: cx, y: cy + r },
    { label: "Sapo adulto", x: cx - r, y: cy },
  ];
  const art = [
    <g key="ovos">
      {[
        [-10, -4], [0, -8], [10, -4], [-6, 6], [6, 6], [0, 0],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="6" fill="#e0f2fe" stroke="#7dd3fc" strokeWidth="1" />
          <circle cx={x} cy={y} r="2.5" fill="#1c1917" />
        </g>
      ))}
    </g>,
    <g key="girino">
      <ellipse cx="4" cy="0" rx="10" ry="8" fill="#57534e" />
      <path d="M-5 0 C-14 -8 -22 8 -30 0" stroke="#57534e" strokeWidth="4" fill="none">
        <animate attributeName="d" values="M-5 0 C-14 -8 -22 8 -30 0;M-5 0 C-14 8 -22 -8 -30 0;M-5 0 C-14 -8 -22 8 -30 0" dur="0.6s" repeatCount="indefinite" />
      </path>
      <circle cx="9" cy="-3" r="1.8" fill="#fff" />
    </g>,
    <g key="patas">
      <ellipse cx="4" cy="0" rx="11" ry="8" fill="#4d7c0f" />
      <path d="M-6 0 C-14 -4 -20 4 -26 0" stroke="#4d7c0f" strokeWidth="3.5" fill="none" />
      <path d="M-4 6 l-6 8 M4 6 l2 9" stroke="#4d7c0f" strokeWidth="3" strokeLinecap="round" />
      <circle cx="10" cy="-3" r="1.8" fill="#fff" />
    </g>,
    <g key="sapo" transform="scale(0.85)">
      <Frog />
    </g>,
  ];
  return (
    <Art viewBox="0 0 540 256" label="O ciclo da metamorfose do sapo: ovos, girino, girino com patas e sapo adulto">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#b08a52" strokeWidth="3" strokeDasharray="8 6" />
      <circle r="7" fill="#f59e0b" stroke="#92400e" strokeWidth="2">
        <animateMotion dur="8s" repeatCount="indefinite" path={`M${cx} ${cy - r} A${r} ${r} 0 1 1 ${cx} ${cy + r} A${r} ${r} 0 1 1 ${cx} ${cy - r}`} />
      </circle>
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="13" fontWeight="900" fill="#15803d" fontFamily="Georgia, serif">
        metamorfose
      </text>
      {stages.map((s, i) => (
        <g key={s.label} opacity="0.4">
          <animate attributeName="opacity" values="1;1;0.4;0.4" keyTimes="0;0.25;0.32;1" dur="8s" begin={`${i * 2}s`} repeatCount="indefinite" />
          <circle cx={s.x} cy={s.y} r="30" fill="#fffaf0" stroke="#16a34a" strokeWidth="2.5" />
          <g transform={`translate(${s.x} ${s.y})`}>{art[i]}</g>
          <text x={s.x} y={s.y + (i === 0 ? -38 : 46)} textAnchor="middle" fontSize="12" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
            {s.label}
          </text>
        </g>
      ))}
      {/* o que muda do girino pro adulto */}
      <g fontFamily="Georgia, serif" fontSize="12.5">
        <rect x="300" y="30" width="226" height="88" rx="10" fill="#e0f2fe" stroke="#38bdf8" />
        <text x="314" y="52" fontWeight="900" fill="#0369a1">
          Girino
        </text>
        <text x="314" y="72" fill="#1e3a5f">• vive só na água</text>
        <text x="314" y="90" fill="#1e3a5f">• respira por brânquias</text>
        <text x="314" y="108" fill="#1e3a5f">• tem cauda e não tem patas</text>
        <rect x="300" y="134" width="226" height="88" rx="10" fill="#dcfce7" stroke="#22c55e" />
        <text x="314" y="156" fontWeight="900" fill="#15803d">
          Sapo adulto
        </text>
        <text x="314" y="176" fill="#14532d">• vive na terra e na água</text>
        <text x="314" y="194" fill="#14532d">• respira por pulmões e pela pele</text>
        <text x="314" y="212" fill="#14532d">• tem 4 patas e perde a cauda</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Inseto × aracnídeo
// ---------------------------------------------------------------------------

function InsectSpiderArt() {
  const leg = (d: string, k: number) => (
    <path key={d} d={d} stroke="#1c1917" strokeWidth="3" fill="none" strokeLinecap="round">
      <animateTransform attributeName="transform" type="rotate" values={`-5 0 0;5 0 0;-5 0 0`} dur="0.5s" begin={`${(k % 2) * 0.25}s`} repeatCount="indefinite" additive="sum" />
    </path>
  );
  return (
    <Art viewBox="0 0 560 250" label="Uma formiga, com 3 partes no corpo, 6 patas e antenas, e uma aranha, com 2 partes no corpo e 8 patas">
      {/* a formiga */}
      <g transform="translate(150 130)">
        {[
          "M8 4 C-4 24 -20 30 -30 44",
          "M10 4 C10 26 6 36 4 50",
          "M12 4 C24 22 34 30 44 42",
          "M8 -4 C-4 -24 -20 -30 -30 -44",
          "M10 -4 C10 -26 6 -36 4 -50",
          "M12 -4 C24 -22 34 -30 44 -42",
        ].map((d, k) => (
          <g key={d} transform="translate(0 0)">
            {leg(d, k)}
          </g>
        ))}
        <ellipse cx="-36" cy="0" rx="30" ry="20" fill="#7c2d12" stroke="#1c1917" strokeWidth="2" />
        <ellipse cx="10" cy="0" rx="16" ry="10" fill="#9a3412" stroke="#1c1917" strokeWidth="2" />
        <circle cx="44" cy="0" r="15" fill="#7c2d12" stroke="#1c1917" strokeWidth="2" />
        <circle cx="50" cy="-6" r="3" fill="#fff" />
        <path d="M54 -10 C66 -26 78 -30 88 -26 M54 10 C66 26 78 30 88 26" stroke="#1c1917" strokeWidth="2.5" fill="none" />
      </g>
      <Label x={230} y={110} tx={260} ty={60} size={12}>
        Antenas
      </Label>
      <Label x={194} y={140} tx={210} ty={214} size={12}>
        Cabeça
      </Label>
      <Label x={160} y={136} tx={140} ty={214} anchor="middle" size={12}>
        Tórax
      </Label>
      <Label x={110} y={140} tx={70} ty={214} anchor="middle" size={12}>
        Abdômen
      </Label>
      <text x="150" y="30" textAnchor="middle" fontSize="15" fontWeight="900" fill="#9a3412" fontFamily="Georgia, serif">
        Inseto: 6 patas
      </text>
      {/* a aranha pendurada no fio */}
      <path d="M430 0 L430 82" stroke="#94a3b8" strokeWidth="1.2" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 10;0 0" dur="3s" repeatCount="indefinite" />
        <g transform="translate(430 140)">
          {[-1, 1].flatMap((s) =>
            [0, 1, 2, 3].map((k) => {
              const a = -50 + k * 32;
              const rad = (a * Math.PI) / 180;
              const x1 = s * 10 * Math.cos(rad);
              const y1 = 6 * Math.sin(rad) - 18;
              const kx = s * (34 + k * 2) * Math.cos(rad * 0.8);
              const ky = -40 + k * 18;
              const ex = s * (52 + (k % 2) * 6) * Math.cos(rad * 0.6);
              const ey = -14 + k * 22;
              return leg(`M${x1.toFixed(1)} ${y1.toFixed(1)} L${kx.toFixed(1)} ${ky} L${ex.toFixed(1)} ${ey}`, k + (s > 0 ? 1 : 0));
            }),
          )}
          <circle cx="0" cy="18" r="26" fill="#3f3f46" stroke="#1c1917" strokeWidth="2" />
          <path d="M-8 8 L0 22 L8 8 Z" fill="#dc2626" />
          <ellipse cx="0" cy="-20" rx="15" ry="13" fill="#52525b" stroke="#1c1917" strokeWidth="2" />
          {[-6, -2, 2, 6].map((x) => (
            <circle key={x} cx={x} cy="-28" r="1.8" fill="#fca5a5" />
          ))}
        </g>
      </g>
      <Label x={444} y={118} tx={500} ty={80} size={12}>
        Cefalotórax
      </Label>
      <Label x={452} y={160} tx={500} ty={214} size={12}>
        Abdômen
      </Label>
      <text x="430" y="244" textAnchor="middle" fontSize="15" fontWeight="900" fill="#3f3f46" fontFamily="Georgia, serif">
        Aracnídeo: 8 patas
      </text>
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
      title="O Reino Animal"
      goals={["A diferença entre vertebrados e invertebrados", "As características de peixes, anfíbios, répteis, aves e mamíferos", "Como o girino vira sapo", "Como reconhecer um inseto e um aracnídeo"]}
    >
      <Fig h={34}>
        <AnimalParadeArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🦴">Vertebrados e invertebrados</H>
      <P>
        Os animais são seres <T>pluricelulares</T> que não fazem fotossíntese: precisam comer outros seres vivos para conseguir energia. A maioria se movimenta e reage
        rápido ao ambiente.
      </P>
      <P>
        A primeira grande divisão do reino animal é pelo esqueleto. Os <T>vertebrados</T> têm <T>crânio</T>, que protege o cérebro, e <T>coluna vertebral</T>, uma fileira de
        ossinhos (as vértebras) que sustenta o corpo. Os <T>invertebrados</T> não têm coluna vertebral.
      </P>
      <Fig n="3.1" caption="O peixe é vertebrado: tem crânio e coluna. A água-viva e a minhoca são invertebrados." h={26}>
        <BackboneArt />
      </Fig>
      <Box kind="sabia">
        Mais de <strong>95% das espécies de animais são invertebrados</strong>! Só de insetos, os cientistas já descreveram cerca de um milhão de espécies, mais do que
        todos os outros animais juntos.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🐟">Os cinco grupos de vertebrados</H>
      <Fig n="3.2" caption="Um representante de cada grupo: peixe, sapo, jacaré, ave e capivara." h={22}>
        <VertebrateGroupsArt />
      </Fig>
      <Table
        head={["Grupo", "Corpo coberto de", "Respira por", "Reprodução"]}
        rows={[
          ["Peixes", "Escamas", "Brânquias", "Ovos, na água"],
          ["Anfíbios", "Pele lisa e úmida", "Brânquias (girino), pulmões e pele (adulto)", "Ovos, na água"],
          ["Répteis", "Escamas ou placas", "Pulmões", "Ovos com casca, na terra"],
          ["Aves", "Penas", "Pulmões", "Ovos com casca dura"],
          ["Mamíferos", "Pelos", "Pulmões", "Quase todos nascem do corpo da mãe"],
        ]}
      />
      <P>
        Aves e mamíferos mantêm a <T>temperatura do corpo constante</T> (são &ldquo;de sangue quente&rdquo;). Peixes, anfíbios e répteis dependem do calor do ambiente: é por
        isso que o jacaré passa tanto tempo tomando sol!
      </P>
      <Box kind="lembre">
        A característica que <strong>só os mamíferos têm</strong> são as <strong>glândulas mamárias</strong>, que produzem o leite para alimentar os filhotes. Nem toda ave voa
        (o pinguim e o avestruz não voam), mas toda ave tem penas e bico sem dentes.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🐸">Metamorfose e respiração</H>
      <P>
        Os <T>anfíbios</T> (sapos, rãs e pererecas) têm uma vida dupla: nascem na água e, quando adultos, vivem também na terra. Para isso passam por uma grande transformação
        no corpo, a <T>metamorfose</T>.
      </P>
      <Fig n="3.3" caption="O ciclo de vida do sapo. Acompanhe a bolinha: cada fase acende na sua vez." h={30}>
        <FrogCycleArt />
      </Fig>
      <P>
        Os animais respiram de jeitos diferentes. Os peixes usam <T>brânquias</T>, que tiram o oxigênio dissolvido na água. Répteis, aves e mamíferos usam <T>pulmões</T>. E os
        anfíbios adultos respiram pelos pulmões e também pela <T>pele</T>, que precisa ficar sempre úmida.
      </P>
      <Box kind="sabia" title="Um mamífero que bota ovos">
        O <strong>ornitorrinco</strong>, da Austrália, tem bico de pato, bota ovos... e é mamífero! Depois que os filhotes nascem, a mãe os amamenta.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🐝">O mundo dos invertebrados</H>
      <P>
        O maior grupo de invertebrados é o dos <T>artrópodes</T>, animais com patas articuladas e um esqueleto do lado de fora do corpo (o <em>exoesqueleto</em>). Dois artrópodes
        muito confundidos são os insetos e as aranhas. Compare:
      </P>
      <Fig n="3.4" caption="Inseto: cabeça, tórax e abdômen, 6 patas e antenas. Aracnídeo: cefalotórax e abdômen, 8 patas e sem antenas." h={28}>
        <InsectSpiderArt />
      </Fig>
      <Cards
        items={[
          { icon: "🦀", title: "Crustáceos", text: "Caranguejo, camarão e lagosta: carapaça dura e duas antenas de cada lado." },
          { icon: "🐌", title: "Moluscos", text: "Corpo mole; alguns têm concha, como o caracol. O polvo e a lula também são!" },
          { icon: "⭐", title: "Equinodermos", text: "“Pele com espinhos”: estrela-do-mar e ouriço. Todos vivem no mar." },
          { icon: "〰️", title: "Anelídeos", text: "Corpo em anéis, como a minhoca, que deixa o solo fofo e fértil." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Vertebrados têm crânio e coluna vertebral; invertebrados não têm (e são a grande maioria dos animais).",
          "Peixes (escamas, brânquias), anfíbios (pele úmida, metamorfose), répteis (escamas, ovos com casca), aves (penas, bico) e mamíferos (pelos, leite).",
          "O girino respira por brânquias; o sapo adulto, por pulmões e pela pele.",
          "Inseto: 3 partes, 6 patas e antenas. Aracnídeo: 2 partes, 8 patas e sem antenas.",
        ]}
      />
      <Glossary
        items={[
          ["Vértebra", "Cada ossinho que forma a coluna vertebral."],
          ["Brânquias", "Órgão que retira o oxigênio dissolvido na água."],
          ["Metamorfose", "Grande mudança no corpo durante o desenvolvimento (girino → sapo)."],
          ["Exoesqueleto", "Esqueleto do lado de fora do corpo, como o dos insetos."],
          ["Glândula mamária", "Glândula que produz leite, exclusiva dos mamíferos."],
        ]}
      />
      <Quiz
        items={[
          ["Qual característica é exclusiva dos mamíferos?", "As glândulas mamárias, que produzem leite."],
          ["Quantas patas tem um inseto adulto? E uma aranha?", "O inseto tem 6 patas; a aranha (aracnídeo) tem 8."],
          ["O jacaré é anfíbio ou réptil?", "Réptil: tem pele seca com placas e bota ovos com casca na terra."],
          ["A que grupo pertencem a estrela-do-mar e o ouriço-do-mar?", "Aos equinodermos."],
        ]}
      />
    </>,
  ),
];
