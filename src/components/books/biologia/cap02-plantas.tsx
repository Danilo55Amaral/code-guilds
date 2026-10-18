"use client";

import { Art, Box, ChapterOpener, Fig, Glossary, H, Label, List, P, Quiz, Summary, T, Table, useUid } from "../BookParts";
import type { BookPage } from "../types";

// ============================================================================
// CAPÍTULO 2 — O MUNDO DAS PLANTAS (missão "Biologia: O Mundo das Plantas" e
// a fotossíntese da missão de Ecologia): a semente brotando, as partes da
// planta com a seiva bruta subindo e a elaborada descendo, a fotossíntese
// (a luz chegando, o gás carbônico entrando e o oxigênio saindo), a flor por
// dentro com a abelha levando o pólen e os quatro grupos de plantas.
// ============================================================================

/** O sol com os raios girando (em volta de cx, cy). */
function Sun({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r * 1.9} fill="#fde68a" opacity="0.35" className="cg-anim-glow" />
      <g>
        <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="24s" repeatCount="indefinite" />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M${cx} ${cy - r * 1.25} L${cx + r * 0.16} ${cy - r * 1.6} L${cx - r * 0.16} ${cy - r * 1.6} Z`} fill="#f59e0b" transform={`rotate(${i * 30} ${cx} ${cy})`} />
        ))}
      </g>
      <circle cx={cx} cy={cy} r={r} fill="#fbbf24" stroke="#f59e0b" strokeWidth="3" />
      <circle cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.28} fill="#fef3c7" opacity="0.7" />
    </g>
  );
}

/** Uma folha com a nervura, desenhada da base (0, 0) pra direita, com `len` de comprimento. */
function Leaf({ len, color = "#22c55e", dark = "#15803d" }: { len: number; color?: string; dark?: string }) {
  const w = len * 0.42;
  return (
    <g>
      <path d={`M0 0 C${len * 0.25} ${-w} ${len * 0.75} ${-w} ${len} 0 C${len * 0.75} ${w} ${len * 0.25} ${w} 0 0 Z`} fill={color} stroke={dark} strokeWidth="1.8" />
      <path d={`M0 0 L${len * 0.95} 0`} stroke={dark} strokeWidth="1.4" />
      {[0.3, 0.55, 0.78].map((t) => (
        <path key={t} d={`M${len * t} 0 L${len * (t + 0.12)} ${-w * 0.55} M${len * t} 0 L${len * (t + 0.12)} ${w * 0.55}`} stroke={dark} strokeWidth="1" opacity="0.7" />
      ))}
    </g>
  );
}

// ---------------------------------------------------------------------------
// Abertura: a semente brota, as folhas abrem e a flor desabrocha (em loop)
// ---------------------------------------------------------------------------

function SproutArt() {
  const u = useUid("spr");
  const loop = { dur: "9s", repeatCount: "indefinite" };
  return (
    <Art viewBox="0 0 460 300" label="Uma semente brotando: o caule cresce, as folhas abrem e a flor desabrocha">
      <defs>
        <linearGradient id={`${u}-soil`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#92400e" />
          <stop offset="1" stopColor="#451a03" />
        </linearGradient>
      </defs>
      <Sun cx={70} cy={62} r={30} />
      {/* gotas de chuva caindo da nuvem */}
      <g>
        <path d="M330 52 C330 34 352 26 364 38 C372 22 400 24 404 44 C420 44 424 66 408 70 L336 70 C322 70 320 56 330 52 Z" fill="#e0f2fe" stroke="#7dd3fc" strokeWidth="2" />
        {[346, 366, 386, 400].map((x, i) => (
          <path key={x} d={`M${x} 80 q-4 8 0 10 q4 -2 0 -10 Z`} fill="#38bdf8">
            <animateTransform attributeName="transform" type="translate" values="0 0;0 120" dur="1.6s" begin={`${i * 0.4 - 1.6}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.8;1" dur="1.6s" begin={`${i * 0.4 - 1.6}s`} repeatCount="indefinite" />
          </path>
        ))}
      </g>
      {/* o chão e as raízes */}
      <rect x="0" y="222" width="460" height="78" fill={`url(#${u}-soil)`} />
      <path d="M0 222 Q115 214 230 222 T460 222" fill="#65a30d" />
      <ellipse cx="230" cy="244" rx="16" ry="10" fill="#d6a756" stroke="#78350f" strokeWidth="2" />
      <path d="M230 250 C228 262 222 270 214 282 M230 252 C234 266 240 274 250 286 M230 252 L231 292" stroke="#fef3c7" strokeWidth="2.5" fill="none" strokeDasharray="60" strokeDashoffset="60">
        <animate attributeName="stroke-dashoffset" values="60;0;0;60" keyTimes="0;0.25;0.92;1" {...loop} />
      </path>
      {/* o caule crescendo */}
      <path d="M230 236 C226 200 236 160 230 112" stroke="#16a34a" strokeWidth="7" fill="none" strokeLinecap="round" strokeDasharray="130" strokeDashoffset="130">
        <animate attributeName="stroke-dashoffset" values="130;130;0;0;130" keyTimes="0;0.1;0.4;0.92;1" {...loop} />
      </path>
      {/* as folhas abrindo */}
      {[
        [229, 190, 200, 0.42],
        [231, 160, -20, 0.5],
        [230, 136, 210, 0.56],
      ].map(([x, y, rot, t], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
          <g>
            <animateTransform attributeName="transform" type="scale" values="0;0;1;1;0" keyTimes={`0;${t};${t + 0.12};0.92;1`} {...loop} />
            <Leaf len={52} />
          </g>
        </g>
      ))}
      {/* a flor desabrochando */}
      <g transform="translate(230 108)">
        <g>
          <animateTransform attributeName="transform" type="scale" values="0;0;1.08;1;1;0" keyTimes="0;0.6;0.7;0.75;0.92;1" {...loop} />
          {Array.from({ length: 6 }, (_, i) => (
            <ellipse key={i} cx="0" cy="-17" rx="10" ry="17" fill="#f472b6" stroke="#be185d" strokeWidth="1.5" transform={`rotate(${i * 60})`} />
          ))}
          <circle r="10" fill="#facc15" stroke="#a16207" strokeWidth="1.5" />
        </g>
      </g>
      {/* borboleta passando */}
      <g>
        <animateMotion dur="12s" repeatCount="indefinite" path="M-20 150 C80 90 140 170 230 90 S380 120 480 70" />
        <g className="cg-anim-flap">
          <path d="M0 0 C-12 -14 -18 -2 -8 4 C-16 10 -8 18 0 6 C8 18 16 10 8 4 C18 -2 12 -14 0 0 Z" fill="#a855f7" stroke="#581c87" strokeWidth="1" />
        </g>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As partes da planta, com a seiva bruta subindo e a elaborada descendo
// ---------------------------------------------------------------------------

const XYLEM = "M196 318 C198 290 199 262 199 250 C201 200 197 150 200 96";
const PHLOEM = "M262 140 C236 146 212 152 204 162 C204 200 204 240 204 300";

function PlantPartsArt() {
  const u = useUid("pp");
  return (
    <Art viewBox="0 0 540 340" label="As partes de uma planta com a seiva bruta subindo e a seiva elaborada descendo">
      <defs>
        <linearGradient id={`${u}-soil`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a16207" />
          <stop offset="1" stopColor="#57300c" />
        </linearGradient>
      </defs>
      <Sun cx={60} cy={56} r={24} />
      <rect x="0" y="250" width="540" height="90" fill={`url(#${u}-soil)`} />
      <path d="M0 250 L540 250" stroke="#65a30d" strokeWidth="6" />
      {/* raízes */}
      <path d="M200 250 C198 280 196 300 196 330 M198 272 C182 282 170 290 160 306 M198 284 C214 292 226 300 238 318 M197 300 C186 308 180 316 176 328 M197 296 C206 306 212 314 214 330" stroke="#fde68a" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* caule */}
      <path d="M200 250 C202 200 196 150 200 92" stroke="#16a34a" strokeWidth="11" fill="none" strokeLinecap="round" />
      <g className="cg-anim-sway" style={{ animationDuration: "5s" }}>
        {/* galho com o fruto */}
        <path d="M201 210 C226 214 246 220 262 232" stroke="#15803d" strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="270" cy="244" r="20" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
        <path d="M270 244 L270 264 A20 20 0 0 1 250 244 Z" fill="#fed7aa" />
        <ellipse cx="262" cy="250" rx="3" ry="4.5" fill="#78350f" />
        <ellipse cx="258" cy="244" rx="2.5" ry="4" fill="#78350f" />
        <path d="M270 224 l4 -6" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* folhas */}
      <g transform="translate(200 170) rotate(200)">
        <Leaf len={74} />
      </g>
      <g transform="translate(201 140) rotate(-18)">
        <Leaf len={68} />
      </g>
      {/* flor */}
      <g transform="translate(200 84)">
        {Array.from({ length: 5 }, (_, i) => (
          <ellipse key={i} cx="0" cy="-16" rx="10" ry="16" fill="#f9a8d4" stroke="#be185d" strokeWidth="1.5" transform={`rotate(${i * 72})`} />
        ))}
        <circle r="9" fill="#facc15" stroke="#a16207" strokeWidth="1.5" />
      </g>
      {/* seiva bruta (água e sais, azul) subindo e seiva elaborada (açúcar, laranja) descendo */}
      {[0, 1, 2, 3].map((i) => (
        <circle key={`x${i}`} r="4" fill="#38bdf8" stroke="#0369a1" strokeWidth="1">
          <animateMotion dur="4s" begin={`${i - 4}s`} repeatCount="indefinite" path={XYLEM} />
        </circle>
      ))}
      {[0, 1, 2].map((i) => (
        <rect key={`p${i}`} x="-3.5" y="-3.5" width="7" height="7" rx="1.5" fill="#fb923c" stroke="#9a3412" strokeWidth="1">
          <animateMotion dur="5s" begin={`${i * 1.66 - 5}s`} repeatCount="indefinite" path={PHLOEM} />
        </rect>
      ))}
      <Label x={212} y={84} tx={330} ty={40}>
        Flor
      </Label>
      <Label x={250} y={124} tx={330} ty={92}>
        Folha
      </Label>
      <Label x={205} y={196} tx={330} ty={160}>
        Caule
      </Label>
      <Label x={286} y={244} tx={330} ty={212}>
        Fruto
      </Label>
      <Label x={260} y={248} tx={330} ty={236}>
        Semente
      </Label>
      <Label x={230} y={312} tx={330} ty={300}>
        Raiz
      </Label>
      <g fontFamily="Georgia, serif" fontSize="12.5" fontWeight="700">
        <circle cx="420" cy="134" r="5" fill="#38bdf8" stroke="#0369a1" />
        <text x="430" y="138" fill="#0369a1">
          seiva bruta sobe
        </text>
        <text x="430" y="153" fill="#5b4a2e" fontWeight="400" fontSize="11">
          (água e sais minerais)
        </text>
        <rect x="415" y="176" width="10" height="10" rx="2" fill="#fb923c" stroke="#9a3412" />
        <text x="430" y="185" fill="#9a3412">
          seiva elaborada desce
        </text>
        <text x="430" y="200" fill="#5b4a2e" fontWeight="400" fontSize="11">
          (o açúcar da fotossíntese)
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Fotossíntese: luz + gás carbônico + água → glicose + oxigênio
// ---------------------------------------------------------------------------

function Co2() {
  return (
    <g>
      <circle cx="-9" r="5.5" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1" />
      <circle cx="0" r="6.5" fill="#334155" stroke="#0f172a" strokeWidth="1" />
      <circle cx="9" r="5.5" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1" />
    </g>
  );
}

function O2() {
  return (
    <g>
      <circle cx="-4.5" r="5.5" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1" />
      <circle cx="4.5" r="5.5" fill="#f87171" stroke="#7f1d1d" strokeWidth="1" />
    </g>
  );
}

function PhotosynthesisArt() {
  return (
    <Art viewBox="0 0 540 300" label="A fotossíntese: a folha recebe luz, gás carbônico e água e produz glicose e oxigênio">
      <Sun cx={70} cy={60} r={30} />
      {/* raios de luz chegando na folha */}
      {[
        [104, 80, 250, 140],
        [92, 100, 220, 170],
        [118, 70, 300, 120],
      ].map(([x1, y1, x2, y2], i) => (
        <path key={i} d={`M${x1} ${y1} L${x2} ${y2}`} stroke="#f59e0b" strokeWidth="4" strokeDasharray="10 10" className="cg-anim-dash" opacity="0.85" />
      ))}
      {/* o cabinho e a folha grande */}
      <path d="M150 300 C156 260 170 220 186 190" stroke="#15803d" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M186 190 C230 100 380 70 470 120 C400 210 260 240 186 190 Z" fill="#4ade80" stroke="#15803d" strokeWidth="3" />
      <path d="M186 190 C270 150 380 120 466 122" stroke="#15803d" strokeWidth="2.5" fill="none" />
      {[
        [250, 168, 268, 128],
        [310, 152, 330, 108],
        [370, 136, 390, 98],
        [250, 168, 280, 200],
        [310, 152, 340, 190],
        [370, 136, 404, 166],
      ].map(([x1, y1, x2, y2], i) => (
        <path key={i} d={`M${x1} ${y1} L${x2} ${y2}`} stroke="#15803d" strokeWidth="1.5" opacity="0.7" />
      ))}
      {/* os cloroplastos brilhando dentro da folha */}
      {[
        [240, 140], [290, 128], [340, 118], [400, 112], [280, 178], [340, 168], [400, 150], [430, 128],
      ].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="7" ry="4" fill="#166534" className="cg-anim-twinkle" style={{ animationDelay: `${(i % 4) * 0.4}s` }} />
      ))}
      {/* a glicose sendo feita */}
      <g transform="translate(330 150)">
        <g className="cg-anim-glow" style={{ "--cg-dur": "2s" } as React.CSSProperties}>
          <path d="M0 -16 L14 -8 L14 8 L0 16 L-14 8 L-14 -8 Z" fill="#fef08a" stroke="#a16207" strokeWidth="2.5" />
          <text y="4" textAnchor="middle" fontSize="9" fontWeight="900" fill="#713f12" fontFamily="Georgia, serif">
            C₆H₁₂O₆
          </text>
        </g>
      </g>
      {/* água subindo pelo cabinho */}
      {[0, 1, 2].map((i) => (
        <path key={i} d="M0 -6 q-5 8 0 11 q5 -3 0 -11 Z" fill="#38bdf8" stroke="#0369a1" strokeWidth="1">
          <animateMotion dur="3s" begin={`${i - 3}s`} repeatCount="indefinite" path="M150 300 C156 260 170 220 196 186" />
        </path>
      ))}
      {/* gás carbônico entrando e oxigênio saindo */}
      {[0, 1, 2].map((i) => (
        <g key={`c${i}`}>
          <animateMotion dur="4.5s" begin={`${i * 1.5 - 4.5}s`} repeatCount="indefinite" path="M20 250 C80 230 160 220 250 176" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="4.5s" begin={`${i * 1.5 - 4.5}s`} repeatCount="indefinite" />
          <Co2 />
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <g key={`o${i}`}>
          <animateMotion dur="4s" begin={`${i * 1.33 - 4}s`} repeatCount="indefinite" path="M400 120 C430 90 460 60 520 30" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.8;1" dur="4s" begin={`${i * 1.33 - 4}s`} repeatCount="indefinite" />
          <O2 />
        </g>
      ))}
      <g fontFamily="Georgia, serif" fontSize="13" fontWeight="700">
        <text x="120" y="40" fill="#b45309">
          luz do Sol
        </text>
        <text x="14" y="282" fill="#334155">
          gás carbônico (CO₂) entra
        </text>
        <text x="205" y="292" fill="#0369a1">
          água (H₂O) sobe da raiz
        </text>
        <text x="420" y="22" fill="#b91c1c" textAnchor="end">
          oxigênio (O₂) sai
        </text>
        <text x="330" y="190" fill="#713f12" textAnchor="middle" fontSize="12">
          glicose
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A flor por dentro e a abelha levando o pólen
// ---------------------------------------------------------------------------

const BEE_PATH = "M180 92 C230 30 340 40 410 120 C440 150 400 190 360 160 C320 130 260 140 220 110 C200 96 186 96 180 92 Z";

function Bee() {
  return (
    <g>
      <g className="cg-anim-flap" style={{ animationDuration: "0.12s" }}>
        <ellipse cx="-3" cy="-10" rx="7" ry="10" fill="#e0f2fe" stroke="#7dd3fc" strokeWidth="1" opacity="0.9" />
        <ellipse cx="5" cy="-9" rx="6" ry="9" fill="#e0f2fe" stroke="#7dd3fc" strokeWidth="1" opacity="0.9" />
      </g>
      <ellipse rx="13" ry="8.5" fill="#facc15" stroke="#1c1917" strokeWidth="1.5" />
      <path d="M-4 -8 L-4 8 M3 -8 L3 8" stroke="#1c1917" strokeWidth="3" />
      <circle cx="13" cy="-1" r="5" fill="#1c1917" />
      <circle cx="-6" cy="7" r="2" fill="#fde047" stroke="#ca8a04" strokeWidth="0.8" />
      <circle cx="1" cy="8" r="2" fill="#fde047" stroke="#ca8a04" strokeWidth="0.8" />
    </g>
  );
}

function FlowerArt() {
  return (
    <Art viewBox="0 0 540 300" label="As partes da flor e uma abelha levando pólen de uma flor para outra">
      {/* caule e sépalas */}
      <path d="M180 300 L180 214" stroke="#16a34a" strokeWidth="8" />
      <path d="M180 216 C160 214 140 204 130 190 C150 194 166 200 180 206 Z M180 216 C200 214 220 204 230 190 C210 194 194 200 180 206 Z" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" />
      {/* pétalas cortadas ao meio */}
      <path d="M176 204 C120 196 92 130 108 86 C140 110 160 150 176 196 Z" fill="#f9a8d4" stroke="#be185d" strokeWidth="2" />
      <path d="M184 204 C240 196 268 130 252 86 C220 110 200 150 184 196 Z" fill="#f9a8d4" stroke="#be185d" strokeWidth="2" />
      {/* pistilo: ovário com óvulos, estilete e estigma */}
      <path d="M180 112 L180 172" stroke="#84cc16" strokeWidth="6" />
      <ellipse cx="180" cy="186" rx="18" ry="20" fill="#bef264" stroke="#4d7c0f" strokeWidth="2" />
      {[
        [174, 180], [186, 180], [174, 192], [186, 192],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill="#fff" stroke="#4d7c0f" strokeWidth="1" />
      ))}
      <path d="M170 108 C174 98 186 98 190 108 Z" fill="#65a30d" />
      {/* estames: filete e antera com pólen */}
      {[
        [150, 112, 168, 196],
        [210, 112, 192, 196],
      ].map(([x, y, bx, by], i) => (
        <g key={i}>
          <path d={`M${bx} ${by} C${bx} ${by - 40} ${x} ${y + 40} ${x} ${y + 6}`} stroke="#fde68a" strokeWidth="3" fill="none" />
          <ellipse cx={x} cy={y} rx="7" ry="10" fill="#f59e0b" stroke="#a16207" strokeWidth="1.5" />
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={x + (k - 1) * 5} cy={y - 12} r="1.8" fill="#fde047" className="cg-anim-twinkle" style={{ animationDelay: `${k * 0.3}s` }} />
          ))}
        </g>
      ))}
      {/* a outra flor, de cima */}
      <g transform="translate(410 150)">
        <path d="M0 150 L0 20" stroke="#16a34a" strokeWidth="6" />
        {Array.from({ length: 8 }, (_, i) => (
          <ellipse key={i} cx="0" cy="-16" rx="8" ry="16" fill="#fbcfe8" stroke="#be185d" strokeWidth="1.2" transform={`rotate(${i * 45})`} />
        ))}
        <circle r="9" fill="#f59e0b" />
      </g>
      {/* a abelha voando entre as duas */}
      <g>
        <animateMotion dur="8s" repeatCount="indefinite" rotate="auto" path={BEE_PATH} />
        <Bee />
      </g>
      <Label x={110} y={110} tx={40} ty={70} anchor="end" size={12}>
        Pétala
      </Label>
      <Label x={140} y={198} tx={40} ty={230} anchor="end" size={12}>
        Sépala
      </Label>
      <Label x={150} y={108} tx={40} ty={30} anchor="end" size={12}>
        Antera (pólen)
      </Label>
      <Label x={160} y={150} tx={40} ty={150} anchor="end" size={12}>
        Filete
      </Label>
      <Label x={182} y={104} tx={300} ty={60} size={12}>
        Estigma
      </Label>
      <Label x={182} y={140} tx={300} ty={210} size={12}>
        Estilete
      </Label>
      <Label x={196} y={188} tx={300} ty={240} size={12}>
        Ovário com óvulos
      </Label>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os quatro grupos de plantas e o que cada um "conquistou"
// ---------------------------------------------------------------------------

function PlantGroupsArt() {
  const names = ["Briófitas", "Pteridófitas", "Gimnospermas", "Angiospermas"];
  const examples = ["musgo", "samambaia", "araucária", "laranjeira"];
  const gains = ["+ vasos", "+ sementes", "+ flores e frutos"];
  return (
    <Art viewBox="0 0 620 250" label="Os quatro grupos de plantas: briófitas, pteridófitas, gimnospermas e angiospermas">
      <rect x="0" y="196" width="620" height="16" fill="#a16207" />
      <rect x="0" y="192" width="620" height="6" fill="#65a30d" />
      {/* as conquistas de um grupo pro outro */}
      {gains.map((g, i) => (
        <g key={g}>
          <path d={`M${120 + i * 155} 30 L${170 + i * 155} 30`} stroke="#b08a52" strokeWidth="3" strokeDasharray="6 4" className="cg-anim-dash" />
          <path d={`M${164 + i * 155} 24 L${172 + i * 155} 30 L${164 + i * 155} 36`} stroke="#b08a52" strokeWidth="3" fill="none" />
          <text x={145 + i * 155} y="18" textAnchor="middle" fontSize="12" fontWeight="900" fill="#15803d" fontFamily="Georgia, serif">
            {g}
          </text>
        </g>
      ))}
      {/* musgo */}
      <g className="cg-anim-sway" style={{ animationDuration: "6s" }}>
        {[40, 55, 70, 85, 100, 115].map((x, i) => (
          <g key={x}>
            <path d={`M${x} 194 L${x + (i % 2 ? 2 : -2)} 172`} stroke="#15803d" strokeWidth="3" />
            {[176, 182, 188].map((y) => (
              <path key={y} d={`M${x} ${y} l-5 -3 M${x} ${y} l5 -3`} stroke="#22c55e" strokeWidth="2.5" />
            ))}
            {i % 2 === 0 && (
              <g>
                <path d={`M${x} 172 L${x + 3} 140`} stroke="#a16207" strokeWidth="1.2" />
                <ellipse cx={x + 3} cy="136" rx="3" ry="5" fill="#92400e" />
              </g>
            )}
          </g>
        ))}
      </g>
      {/* samambaia */}
      <g className="cg-anim-sway" style={{ animationDuration: "5s" }}>
        {[-50, -20, 15, 45].map((rot, i) => (
          <g key={rot} transform={`translate(232 194) rotate(${rot})`}>
            <path d="M0 0 C-6 -40 -2 -80 14 -110" stroke="#15803d" strokeWidth="3" fill="none" />
            {Array.from({ length: 8 }, (_, k) => {
              const y = -14 - k * 12;
              const len = 18 - k * 1.6;
              return (
                <g key={k}>
                  <path d={`M${-3 + k * 1.6} ${y} l${-len} -4 M${-3 + k * 1.6} ${y} l${len} -6`} stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
                  {i % 2 === 0 && k % 2 === 1 && <circle cx={-3 + k * 1.6 - len / 2} cy={y - 1} r="1.6" fill="#92400e" />}
                </g>
              );
            })}
          </g>
        ))}
      </g>
      {/* araucária, com a pinha no chão */}
      <g className="cg-anim-sway" style={{ animationDuration: "7s" }}>
        <path d="M385 194 L385 70" stroke="#78350f" strokeWidth="8" />
        {[
          [70, 54],
          [96, 46],
          [122, 36],
        ].map(([y, w]) => (
          <g key={y}>
            <path d={`M385 ${y + 8} C${385 - w * 0.6} ${y - 8} ${385 - w} ${y - 4} ${385 - w - 6} ${y + 6}`} stroke="#166534" strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d={`M385 ${y + 8} C${385 + w * 0.6} ${y - 8} ${385 + w} ${y - 4} ${385 + w + 6} ${y + 6}`} stroke="#166534" strokeWidth="7" fill="none" strokeLinecap="round" />
          </g>
        ))}
      </g>
      <g transform="translate(420 184)">
        <ellipse rx="10" ry="8" fill="#92400e" stroke="#451a03" strokeWidth="1.5" />
        <path d="M-7 -3 L7 -3 M-8 2 L8 2" stroke="#451a03" strokeWidth="1" />
      </g>
      {/* laranjeira, com flores e frutos */}
      <path d="M540 194 L540 130" stroke="#78350f" strokeWidth="9" />
      <g className="cg-anim-sway" style={{ animationDuration: "6.5s" }}>
        <circle cx="540" cy="100" r="50" fill="#16a34a" stroke="#14532d" strokeWidth="2" />
        <circle cx="516" cy="88" r="22" fill="#22c55e" opacity="0.6" />
        {[
          [520, 110], [556, 80], [566, 118], [532, 74],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="8" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
        ))}
        {[
          [546, 128], [506, 84], [574, 96],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            {Array.from({ length: 5 }, (_, k) => (
              <circle key={k} cx="0" cy="-3.5" r="2.6" fill="#fff" transform={`rotate(${k * 72})`} />
            ))}
            <circle r="1.6" fill="#facc15" />
          </g>
        ))}
      </g>
      {names.map((n, i) => (
        <g key={n} fontFamily="Georgia, serif" textAnchor="middle">
          <text x={78 + i * 155} y="230" fontSize="14" fontWeight="900" fill="#3b2a14">
            {n}
          </text>
          <text x={78 + i * 155} y="246" fontSize="11.5" fontStyle="italic" fill="#6b5a3a">
            ({examples[i]})
          </text>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 2, content, bare });

export const chapter2: BookPage[] = [
  page(
    <ChapterOpener
      n={2}
      title="O Mundo das Plantas"
      goals={["As partes de uma planta e a função de cada uma", "Como a planta fabrica o próprio alimento", "Como a flor vira fruto e a semente vira planta", "Os quatro grandes grupos de plantas"]}
    >
      <Fig h={34}>
        <SproutArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🌿">As partes de uma planta</H>
      <P>
        Uma planta com flor, como um pé de tomate ou uma laranjeira, tem seis partes principais. Cada uma tem um trabalho importante:
      </P>
      <List
        items={[
          <>
            <T>Raiz</T>: fixa a planta no solo e <em>absorve água e sais minerais</em>. Algumas guardam alimento, como a cenoura e a mandioca.
          </>,
          <>
            <T>Caule</T>: sustenta a planta e funciona como uma &ldquo;estrada&rdquo;, levando as substâncias da raiz até as folhas e das folhas para o resto da planta.
          </>,
          <>
            <T>Folha</T>: a &ldquo;cozinha&rdquo; da planta, onde acontece a <em>fotossíntese</em>.
          </>,
          <>
            <T>Flor</T>, <T>fruto</T> e <T>semente</T>: as partes da <em>reprodução</em>, que vamos estudar daqui a pouco.
          </>,
        ]}
      />
      <Fig n="2.1" caption="As partes de uma planta. Pelos vasos do caule, a seiva bruta sobe da raiz e a seiva elaborada desce das folhas." h={32}>
        <PlantPartsArt />
      </Fig>
      <P>
        Dentro do caule existem tubinhos chamados <T>vasos condutores</T>. O <T>xilema</T> leva a <T>seiva bruta</T> (água e sais) da raiz para cima; o <T>floema</T> leva a{" "}
        <T>seiva elaborada</T> (o açúcar feito nas folhas) para a planta inteira.
      </P>
    </>,
  ),

  page(
    <>
      <H icon="☀️">Fotossíntese: a fábrica de alimento</H>
      <P>
        Nós precisamos comer para ter energia. As plantas não: elas <T>fabricam o próprio alimento</T>! Esse processo se chama <T>fotossíntese</T> (&ldquo;foto&rdquo; = luz;
        &ldquo;síntese&rdquo; = produção) e acontece nos <T>cloroplastos</T> das folhas, graças à <T>clorofila</T>, o pigmento verde que captura a luz do Sol.
      </P>
      <Fig n="2.2" caption="Na folha, a energia da luz transforma gás carbônico e água em glicose, e o oxigênio é liberado no ar." h={30}>
        <PhotosynthesisArt />
      </Fig>
      <div className="my-[0.5em] rounded-xl border-2 border-[#16a34a] bg-[#f0fdf4] px-[0.8em] py-[0.5em] text-center">
        <p className="text-[0.95em] font-bold text-[#14532d]">gás carbônico + água + luz → glicose + oxigênio</p>
        <p className="mt-[0.1em] text-[0.85em] text-[#166534]">6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂</p>
      </div>
      <P>
        A <T>glicose</T> é o alimento da planta: ela é usada para crescer e dar energia. E o <T>oxigênio</T> que sai é justamente o gás que nós respiramos!
      </P>
      <Box kind="atencao">
        As plantas também <strong>respiram</strong>, de dia e de noite, como todo ser vivo: usam oxigênio e soltam gás carbônico. Durante o dia, a fotossíntese é mais forte
        que a respiração, e por isso a planta libera mais oxigênio do que consome.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🌸">A flor, a polinização e o fruto</H>
      <P>
        A <T>flor</T> é o órgão de reprodução das plantas que têm flores. A parte masculina é o <T>estame</T>, que produz os grãos de <T>pólen</T> na antera. A parte feminina é
        o <T>pistilo</T> (ou carpelo), que tem o <T>estigma</T> grudento, o estilete e o <T>ovário</T>, onde ficam os óvulos.
      </P>
      <Fig n="2.3" caption="A flor cortada ao meio. A abelha visita as flores atrás do néctar e, sem querer, leva o pólen de uma para outra." h={30}>
        <FlowerArt />
      </Fig>
      <P>
        A <T>polinização</T> é o transporte do pólen até o estigma. Quem faz esse trabalho são os <em>polinizadores</em>: abelhas, borboletas, beija-flores, morcegos, e também
        o vento e a água. Depois da fecundação, o <T>ovário vira o fruto</T> e os <T>óvulos viram as sementes</T>.
      </P>
      <P>
        O fruto protege as sementes e ajuda a espalhá-las (a <T>dispersão</T>): pelo vento (o dente-de-leão), pelos animais que comem o fruto e deixam as sementes em outro
        lugar, ou pela água (o coco flutua até outras praias!).
      </P>
    </>,
  ),

  page(
    <>
      <H icon="🌲">Os quatro grandes grupos de plantas</H>
      <P>
        As plantas são divididas em quatro grupos. Ao longo da evolução, cada grupo &ldquo;ganhou&rdquo; uma novidade que ajudou as plantas a conquistar a terra firme:
      </P>
      <Fig n="2.4" caption="Dos musgos às plantas com flores: vasos condutores, depois sementes e, por fim, flores e frutos." h={28}>
        <PlantGroupsArt />
      </Fig>
      <Table
        head={["Grupo", "Vasos", "Sementes", "Flores e frutos"]}
        rows={[
          ["Briófitas", "Não", "Não (esporos)", "Não"],
          ["Pteridófitas", "Sim", "Não (esporos)", "Não"],
          ["Gimnospermas", "Sim", "Sim, “nuas”", "Não"],
          ["Angiospermas", "Sim", "Sim, no fruto", "Sim"],
        ]}
      />
      <List
        items={[
          <>
            <T>Briófitas</T> (musgos): sem vasos, são pequenas e vivem em lugares úmidos e sombreados.
          </>,
          <>
            <T>Pteridófitas</T> (samambaias): têm vasos, mas se reproduzem por <em>esporos</em>, os pontinhos marrons embaixo das folhas.
          </>,
          <>
            <T>Gimnospermas</T> (pinheiros, araucária): têm sementes &ldquo;nuas&rdquo;, sem fruto em volta, como o pinhão.
          </>,
          <>
            <T>Angiospermas</T> (feijão, laranjeira, ipê): têm flores e frutos. São o maior grupo do planeta!
          </>,
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "A raiz absorve água e sais; o caule sustenta e transporta; a folha faz fotossíntese; flor, fruto e semente servem à reprodução.",
          "Fotossíntese: gás carbônico + água + luz → glicose + oxigênio, nos cloroplastos, com a clorofila.",
          "Polinização é o transporte do pólen até o estigma; depois da fecundação o ovário vira fruto e os óvulos viram sementes.",
          "Grupos: briófitas (sem vasos), pteridófitas (vasos, sem sementes), gimnospermas (sementes nuas) e angiospermas (flores e frutos).",
        ]}
      />
      <Glossary
        items={[
          ["Clorofila", "Pigmento verde que captura a energia da luz."],
          ["Xilema", "Vaso que leva a seiva bruta da raiz para as folhas."],
          ["Floema", "Vaso que leva a seiva elaborada das folhas para a planta toda."],
          ["Polinização", "O transporte do pólen até a parte feminina da flor."],
          ["Esporo", "Célula de reprodução de musgos e samambaias, que não é semente."],
        ]}
      />
      <Quiz
        items={[
          ["Qual parte da planta absorve a água do solo?", "A raiz."],
          ["O que a planta produz na fotossíntese?", "Glicose (o alimento dela) e oxigênio."],
          ["Depois da fecundação, em que se transforma o ovário da flor?", "No fruto. Os óvulos viram as sementes."],
          ["A samambaia tem sementes?", "Não. Ela tem vasos, mas se reproduz por esporos: é uma pteridófita."],
        ]}
      />
    </>,
  ),
];
