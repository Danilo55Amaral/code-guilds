"use client";

import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";

// ============================================================================
// CAPÍTULO 4 — MICRORGANISMOS E SAÚDE (missão "Biologia: Microrganismos e
// Saúde" e as vacinas da missão do Corpo Humano): o mundo invisível na lente,
// a bactéria se dividindo em duas, o vírus invadindo a célula e saindo em
// cópias, o Aedes aegypti e a água parada, e os anticorpos agarrando os vírus.
// ============================================================================

function Virus({ r = 12, color = "#ef4444", dark = "#991b1b" }: { r?: number; color?: string; dark?: string }) {
  return (
    <g>
      {Array.from({ length: 10 }, (_, i) => (
        <g key={i} transform={`rotate(${i * 36})`}>
          <line x1="0" y1={-r} x2="0" y2={-r * 1.45} stroke={dark} strokeWidth={r * 0.16} />
          <circle cx="0" cy={-r * 1.5} r={r * 0.2} fill={color} />
        </g>
      ))}
      <circle r={r} fill={color} stroke={dark} strokeWidth={r * 0.14} />
      <path d={`M${-r * 0.5} ${-r * 0.2} q${r * 0.3} ${-r * 0.4} ${r * 0.5} 0 t${r * 0.5} 0`} stroke="#fef3c7" strokeWidth={r * 0.12} fill="none" />
    </g>
  );
}

function Bacillus({ color = "#a3e635", dark = "#4d7c0f" }: { color?: string; dark?: string }) {
  return (
    <g>
      <rect x="-20" y="-8" width="40" height="16" rx="8" fill={color} stroke={dark} strokeWidth="2" />
      <path d="M-10 0 C-5 -4 0 4 5 0 S12 -3 14 0" stroke={dark} strokeWidth="1.5" fill="none" />
      <path d="M20 0 C28 -6 32 6 40 0" stroke={dark} strokeWidth="1.5" fill="none">
        <animate attributeName="d" values="M20 0 C28 -6 32 6 40 0;M20 0 C28 6 32 -6 40 0;M20 0 C28 -6 32 6 40 0" dur="0.5s" repeatCount="indefinite" />
      </path>
    </g>
  );
}

const AMOEBA_A = "M0 -26 C16 -30 30 -14 26 0 C34 14 18 30 2 24 C-14 34 -32 18 -24 2 C-34 -12 -16 -30 0 -26 Z";
const AMOEBA_B = "M2 -30 C20 -24 24 -10 32 2 C26 20 12 26 -2 28 C-16 26 -26 14 -30 -2 C-24 -18 -12 -24 2 -30 Z";

// ---------------------------------------------------------------------------
// Abertura: a lente cheia de micróbios
// ---------------------------------------------------------------------------

function MicrobesArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma gota vista no microscópio, com bactérias, vírus, uma ameba e esporos de fungo">
      <defs>
        <radialGradient id="mic4-drop" cx="0.45" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#f0fdfa" />
          <stop offset="1" stopColor="#99f6e4" />
        </radialGradient>
        <clipPath id="mic4-clip">
          <circle cx="230" cy="150" r="136" />
        </clipPath>
      </defs>
      <circle cx="230" cy="150" r="146" fill="#1f2937" />
      <g clipPath="url(#mic4-clip)">
        <rect x="80" y="0" width="300" height="300" fill="url(#mic4-drop)" />
        {/* ameba mudando de forma */}
        <g transform="translate(160 110)">
          <path d={AMOEBA_A} fill="#c4b5fd" stroke="#6d28d9" strokeWidth="2" opacity="0.9">
            <animate attributeName="d" values={`${AMOEBA_A};${AMOEBA_B};${AMOEBA_A}`} dur="4s" repeatCount="indefinite" />
          </path>
          <circle cx="2" cy="0" r="8" fill="#7c3aed" />
          <circle cx="-10" cy="10" r="3" fill="#a78bfa" />
        </g>
        {/* bacilos nadando */}
        {[
          ["M80 220 C160 180 260 250 400 200", "9s", "0s"],
          ["M400 80 C300 120 200 40 60 90", "11s", "-4s"],
        ].map(([path, dur, begin], i) => (
          <g key={i}>
            <animateMotion dur={dur} begin={begin} repeatCount="indefinite" rotate="auto" path={path} />
            <Bacillus />
          </g>
        ))}
        {/* cocos (bactérias redondas) em cachinho */}
        <g transform="translate(300 220)">
          {[
            [0, 0], [12, -4], [6, 10], [-10, 8], [18, 8], [-4, -12], [10, -16],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="7" fill="#fdba74" stroke="#c2410c" strokeWidth="1.5" className="cg-anim-twinkle" style={{ animationDelay: `${i * 0.25}s`, animationDuration: "3s" }} />
          ))}
        </g>
        {/* vírus girando */}
        <g transform="translate(300 100)">
          <g className="cg-anim-spin-slow">
            <Virus r={14} />
          </g>
        </g>
        <g transform="translate(250 170)">
          <g className="cg-anim-spin-slow" style={{ animationDirection: "reverse" }}>
            <Virus r={9} color="#f472b6" dark="#9d174d" />
          </g>
        </g>
        {/* esporos de fungo boiando */}
        {[
          [120, 200], [200, 240], [350, 150], [180, 60],
        ].map(([x, y], i) => (
          <g key={i} className="cg-anim-hover" style={{ animationDelay: `${i * 0.7}s` }}>
            <circle cx={x} cy={y} r="5" fill="#fef08a" stroke="#a16207" strokeWidth="1.2" />
            <circle cx={x + 7} cy={y + 3} r="3.5" fill="#fef08a" stroke="#a16207" strokeWidth="1" />
          </g>
        ))}
      </g>
      <circle cx="230" cy="150" r="140" fill="none" stroke="#475569" strokeWidth="6" />
      <path d="M140 50 A126 126 0 0 1 290 30" stroke="#fff" strokeWidth="5" opacity="0.35" fill="none" strokeLinecap="round" />
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A bactéria se dividindo em duas (divisão binária)
// ---------------------------------------------------------------------------

function FissionArt() {
  const loop = { dur: "5s", repeatCount: "indefinite" };
  return (
    <Art viewBox="0 0 520 130" label="Uma bactéria crescendo e se dividindo em duas bactérias iguais">
      {/* a bactéria cresce, estrangula no meio e vira duas */}
      <g transform="translate(130 64)">
        {[-1, 1].map((s) => (
          <g key={s}>
            <animateTransform attributeName="transform" type="translate" values={`0 0;0 0;${s * 22} 0;${s * 46} 0;${s * 46} 0`} keyTimes="0;0.3;0.6;0.85;1" {...loop} />
            <rect x={s < 0 ? -40 : 0} y="-20" width="40" height="40" rx="20" fill="#bef264" stroke="#4d7c0f" strokeWidth="2.5" />
            <path d={s < 0 ? "M-30 0 C-24 -8 -16 8 -8 0" : "M8 0 C16 -8 24 8 30 0"} stroke="#7c3aed" strokeWidth="2.5" fill="none" />
          </g>
        ))}
      </g>
      <text x="130" y="122" textAnchor="middle" fontSize="13" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
        1 bactéria vira 2
      </text>
      {/* e a população dobrando */}
      {[
        [300, 1],
        [370, 2],
        [440, 4],
        [510, 8],
      ].map(([x, n], i) => (
        <g key={x} className="cg-anim-pop" style={{ animationDelay: `${i * 0.4}s` }}>
          {Array.from({ length: n }, (_, k) => (
            <rect key={k} x={x - 22 + (k % 2) * 22} y={30 + Math.floor(k / 2) * 14} width="18" height="10" rx="5" fill="#bef264" stroke="#4d7c0f" strokeWidth="1.2" />
          ))}
          <text x={x - 2} y="122" textAnchor="middle" fontSize="12" fontWeight="700" fill="#5b4a2e" fontFamily="Georgia, serif">
            {i * 20} min
          </text>
        </g>
      ))}
      <path d="M262 64 L280 64" stroke="#b08a52" strokeWidth="3" />
      <path d="M274 58 L282 64 L274 70" stroke="#b08a52" strokeWidth="3" fill="none" />
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O vírus invadindo a célula (em loop): chega, gruda, injeta, copia e sai
// ---------------------------------------------------------------------------

function VirusAttackArt() {
  const loop = { dur: "9s", repeatCount: "indefinite" };
  const copies: [number, number][] = [
    [220, 120], [260, 100], [300, 128], [250, 150], [290, 168], [230, 172],
  ];
  const out: [number, number][] = [
    [140, 60], [200, 30], [380, 40], [430, 110], [400, 200], [160, 220],
  ];
  return (
    <Art viewBox="0 0 520 250" label="Um vírus gruda na célula, injeta o seu material genético, a célula fabrica cópias do vírus e elas saem para atacar outras células">
      {/* a célula (estoura no fim) */}
      <g>
        <animate attributeName="opacity" values="1;1;0.25;1" keyTimes="0;0.78;0.86;1" {...loop} />
        <ellipse cx="260" cy="135" rx="120" ry="85" fill="#fee2e2" stroke="#f43f5e" strokeWidth="5" />
        <circle cx="300" cy="130" r="26" fill="#ddd6fe" stroke="#7c3aed" strokeWidth="3" />
      </g>
      {/* o vírus chega e gruda na membrana */}
      <g>
        <animateMotion values="40,60;150,80;150,80;150,80" keyTimes="0;0.15;0.3;1" calcMode="linear" {...loop} />
        <animate attributeName="opacity" values="1;1;1;0;0" keyTimes="0;0.25;0.32;0.36;1" {...loop} />
        <Virus r={13} />
      </g>
      {/* o material genético entrando */}
      <path d="M170 92 C190 100 200 120 230 118" stroke="#7c3aed" strokeWidth="3.5" fill="none" strokeDasharray="90" strokeDashoffset="90">
        <animate attributeName="stroke-dashoffset" values="90;90;0;0;90" keyTimes="0;0.2;0.32;0.78;0.8" {...loop} />
      </path>
      {/* a célula fabricando cópias */}
      {copies.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`} opacity="0">
          <animate attributeName="opacity" values="0;0;1;1;0" keyTimes={`0;${0.36 + i * 0.05};${0.4 + i * 0.05};0.78;0.8`} {...loop} />
          <Virus r={7} />
        </g>
      ))}
      {/* as cópias saem pra atacar outras células */}
      {out.map(([x, y], i) => (
        <g key={i} opacity="0">
          <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.78;0.8;0.96;1" {...loop} />
          <animateMotion values={`${copies[i][0]},${copies[i][1]};${copies[i][0]},${copies[i][1]};${x},${y};${x},${y}`} keyTimes="0;0.78;0.96;1" calcMode="linear" {...loop} />
          <Virus r={7} />
        </g>
      ))}
      {/* os passos */}
      <g fontFamily="Georgia, serif" fontSize="12.5" fontWeight="700" fill="#3b2a14">
        {["1. gruda", "2. injeta o material genético", "3. a célula faz cópias", "4. as cópias saem"].map((s, i) => (
          <text key={s} x={i < 2 ? 14 : 506} y={i % 2 ? 248 : 232} textAnchor={i < 2 ? "start" : "end"} opacity="0.35">
            <animate attributeName="opacity" values="0.35;1;1;0.35;0.35" keyTimes={`0;${[0.15, 0.25, 0.4, 0.8][i]};${[0.3, 0.4, 0.78, 0.97][i]};${[0.32, 0.42, 0.8, 0.99][i]};1`} {...loop} />
            {s}
          </text>
        ))}
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O Aedes aegypti e a água parada
// ---------------------------------------------------------------------------

function MosquitoArt() {
  const mosquito = (
    <g>
      <g className="cg-anim-flap" style={{ animationDuration: "0.08s" }}>
        <ellipse cx="-2" cy="-10" rx="5" ry="11" fill="#e0f2fe" stroke="#94a3b8" strokeWidth="1" opacity="0.85" transform="rotate(-25)" />
        <ellipse cx="4" cy="-10" rx="5" ry="11" fill="#e0f2fe" stroke="#94a3b8" strokeWidth="1" opacity="0.85" transform="rotate(20)" />
      </g>
      <ellipse cx="-12" cy="2" rx="13" ry="4.5" fill="#1c1917" />
      {[-18, -12, -6].map((x) => (
        <rect key={x} x={x} y="-2" width="2" height="8" fill="#f8fafc" />
      ))}
      <ellipse cx="3" cy="0" rx="6" ry="5" fill="#292524" />
      <path d="M1 -2 L4 -5 L7 -2" stroke="#f8fafc" strokeWidth="1" fill="none" />
      <circle cx="11" cy="0" r="3.5" fill="#1c1917" />
      <path d="M14 1 L24 4" stroke="#1c1917" strokeWidth="1.5" />
      {[-2, 2, 6].map((x) => (
        <path key={x} d={`M${x} 4 l-6 12 M${x} 4 l3 13`} stroke="#1c1917" strokeWidth="1" />
      ))}
    </g>
  );
  return (
    <Art viewBox="0 0 520 220" label="O mosquito Aedes aegypti voando perto de um pneu e de um vaso com água parada, onde crescem as larvas">
      {/* o pneu com água parada e as larvas se mexendo */}
      <g transform="translate(130 170)">
        <ellipse rx="80" ry="30" fill="#1f2937" />
        <ellipse rx="56" ry="18" fill="#3f3f46" />
        <ellipse cx="0" cy="2" rx="50" ry="14" fill="#7dd3fc" opacity="0.85" />
        {[-24, -6, 14, 30].map((x, i) => (
          <path key={x} d={`M${x} 0 q3 4 0 8`} stroke="#1c1917" strokeWidth="2.5" fill="none" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" values={`-20 ${x} 4;20 ${x} 4;-20 ${x} 4`} dur="0.8s" begin={`${i * 0.2 - 0.8}s`} repeatCount="indefinite" />
          </path>
        ))}
      </g>
      {/* o vaso com o pratinho cheio */}
      <g transform="translate(330 150)">
        <path d="M-26 -30 L26 -30 L18 20 L-18 20 Z" fill="#c2410c" stroke="#7c2d12" strokeWidth="2" />
        <path d="M-2 -30 C-10 -60 -30 -70 -40 -64 M2 -30 C8 -64 30 -74 38 -66" stroke="#16a34a" strokeWidth="4" fill="none" />
        <ellipse cx="0" cy="24" rx="40" ry="8" fill="#9a3412" />
        <ellipse cx="0" cy="22" rx="34" ry="5" fill="#7dd3fc" />
      </g>
      {/* o X vermelho de "não pode" */}
      <g transform="translate(450 70)">
        <circle r="34" fill="#fee2e2" stroke="#dc2626" strokeWidth="4" />
        <text y="-4" textAnchor="middle" fontSize="12" fontWeight="900" fill="#991b1b" fontFamily="Georgia, serif">
          Água
        </text>
        <text y="12" textAnchor="middle" fontSize="12" fontWeight="900" fill="#991b1b" fontFamily="Georgia, serif">
          parada
        </text>
        <path d="M-24 24 L24 -24" stroke="#dc2626" strokeWidth="4" />
      </g>
      {/* os mosquitos voando */}
      <g>
        <animateMotion dur="6s" repeatCount="indefinite" path="M60 60 C140 20 220 90 300 50 S400 90 330 110 S180 120 60 60 Z" />
        {mosquito}
      </g>
      <g>
        <animateMotion dur="7s" begin="-3s" repeatCount="indefinite" path="M200 120 C250 80 320 100 280 130 S180 150 200 120 Z" />
        <g transform="scale(0.8)">{mosquito}</g>
      </g>
      <text x="130" y="214" textAnchor="middle" fontSize="12" fontWeight="700" fill="#5b4a2e" fontFamily="Georgia, serif">
        larvas na água do pneu
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As defesas: anticorpos agarrando os vírus e o glóbulo branco engolindo
// ---------------------------------------------------------------------------

function Antibody({ color = "#2563eb" }: { color?: string }) {
  return <path d="M0 12 L0 0 L-8 -10 M0 0 L8 -10" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />;
}

function DefenseArt() {
  return (
    <Art viewBox="0 0 520 210" label="Anticorpos em forma de Y agarrando os vírus e um glóbulo branco engolindo um micróbio">
      <rect x="0" y="0" width="520" height="210" rx="16" fill="#fff1f2" />
      {/* vírus cercados de anticorpos */}
      {[
        [88, 66],
        [186, 122],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <g className="cg-anim-spin-slow" style={{ animationDuration: "18s" }}>
            <Virus r={14} />
          </g>
          {[0, 72, 144, 216, 288].map((a, k) => (
            <g key={a} transform={`rotate(${a + i * 20})`}>
              <g transform="translate(0 -40) rotate(180)">
                <animateTransform attributeName="transform" type="translate" values="0 22;0 0;0 0" keyTimes="0;0.4;1" dur="3s" begin={`${k * 0.3 - 3}s`} repeatCount="indefinite" additive="sum" />
                <Antibody />
              </g>
            </g>
          ))}
        </g>
      ))}
      {/* o glóbulo branco engolindo uma bactéria */}
      <g transform="translate(390 105)">
        <path d="M0 -60 C40 -60 64 -30 60 0 C64 40 30 64 0 60 C-34 64 -64 34 -58 0 C-64 -36 -34 -60 0 -60 Z" fill="#f1f5f9" stroke="#64748b" strokeWidth="3">
          <animate
            attributeName="d"
            values="M0 -60 C40 -60 64 -30 60 0 C64 40 30 64 0 60 C-34 64 -64 34 -58 0 C-64 -36 -34 -60 0 -60 Z;M0 -62 C44 -56 70 -26 64 0 C60 44 26 60 0 64 C-30 60 -66 30 -62 0 C-60 -32 -38 -64 0 -62 Z;M0 -60 C40 -60 64 -30 60 0 C64 40 30 64 0 60 C-34 64 -64 34 -58 0 C-64 -36 -34 -60 0 -60 Z"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
        <path d="M-10 -8 C-20 -24 4 -30 10 -16 C26 -20 24 4 10 2 C14 18 -12 18 -8 4 C-24 4 -22 -14 -10 -8 Z" fill="#c4b5fd" stroke="#6d28d9" strokeWidth="2" />
        <g>
          <animateTransform attributeName="transform" type="translate" values="80 -10;30 10;30 10" keyTimes="0;0.5;1" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.6;0.9;1" dur="4s" repeatCount="indefinite" />
          <g transform="scale(0.6)">
            <Bacillus />
          </g>
        </g>
      </g>
      <g fontFamily="Georgia, serif" fontSize="12.5" fontWeight="700">
        <text x="130" y="200" textAnchor="middle" fill="#1e3a8a">
          anticorpos (Y) agarrando os vírus
        </text>
        <text x="390" y="200" textAnchor="middle" fill="#334155">
          glóbulo branco engolindo
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 4, content, bare });

export const chapter4: BookPage[] = [
  page(
    <ChapterOpener
      n={4}
      title="Microrganismos e Saúde"
      goals={["Quem são os vírus, as bactérias, os protozoários e os fungos", "Como um vírus invade a célula", "As doenças transmitidas por mosquitos e como evitá-las", "Como as vacinas e os soros protegem o corpo"]}
    >
      <Fig h={34}>
        <MicrobesArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🔬">O mundo invisível</H>
      <P>
        <T>Microrganismos</T> (ou micróbios) são seres tão pequenos que só aparecem no microscópio. Eles estão em todo lugar: no ar, na água, no solo e dentro do nosso corpo.
      </P>
      <Cards
        items={[
          { icon: "🦠", title: "Vírus", text: "Sem célula: só se multiplicam dentro de outra célula. Gripe, dengue, sarampo." },
          { icon: "🧫", title: "Bactérias", text: "Uma célula sem núcleo (procarionte). Algumas causam tuberculose e cólera." },
          { icon: "💧", title: "Protozoários", text: "Uma célula com núcleo, como a ameba. Causam malária e doença de Chagas." },
          { icon: "🍄", title: "Fungos", text: "Bolores e leveduras. Alguns causam micoses (como o pé de atleta)." },
        ]}
      />
      <Fig n="4.1" caption="A divisão binária: em condições boas, uma bactéria se divide a cada 20 minutos, e a população dobra." h={18}>
        <FissionArt />
      </Fig>
      <Box kind="lembre" title="Nem todo micróbio faz mal!">
        Bactérias transformam o leite em <strong>iogurte</strong> e queijo, leveduras (fungos) fazem o <strong>pão</strong> crescer, e as bactérias do nosso intestino ajudam na
        digestão. Fungos e bactérias também são <strong>decompositores</strong>: devolvem os nutrientes ao solo.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="⚔️">Como um vírus ataca</H>
      <P>
        O vírus não come, não cresce e não se divide sozinho. Para se multiplicar, ele precisa <T>invadir uma célula</T> e usar a &ldquo;fábrica&rdquo; dela para produzir novas
        cópias de si mesmo, que saem para atacar outras células.
      </P>
      <Fig n="4.2" caption="Acompanhe os quatro passos da infecção: o vírus gruda, injeta o material genético, a célula faz cópias e elas saem." h={28}>
        <VirusAttackArt />
      </Fig>
      <P>
        Por isso os <T>antibióticos não curam gripe nem resfriado</T>: eles atacam partes que só as bactérias têm, e o vírus não tem nenhuma delas. Contra vírus, as armas são as
        vacinas, o nosso sistema imunológico e alguns remédios antivirais.
      </P>
      <Box kind="sabia" title="O bolor que salvou milhões">
        Em 1928, <strong>Alexander Fleming</strong> percebeu que um bolor (o fungo <em>Penicillium</em>) matava as bactérias da sua placa de laboratório. Dele veio a{" "}
        <strong>penicilina</strong>, o primeiro antibiótico. Atenção: tomar antibiótico sem receita ou parar antes da hora ajuda a criar bactérias resistentes!
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🦟">Doenças transmitidas por vetores</H>
      <P>
        Algumas doenças passam de uma pessoa para outra por meio de um animal, o <T>vetor</T>. O vetor mais famoso do Brasil é o mosquito <T>Aedes aegypti</T>, que transmite os
        vírus da <T>dengue</T>, da <T>zika</T> e da <T>chikungunya</T>. Ele bota os ovos em <T>água parada</T>.
      </P>
      <Fig n="4.3" caption="O Aedes aegypti tem listras brancas. As larvas crescem em qualquer água parada: pneus, vasos, garrafas e calhas." h={24}>
        <MosquitoArt />
      </Fig>
      <Table
        head={["Doença", "Causador", "Como pega"]}
        rows={[
          ["Dengue, zika, chikungunya", "Vírus", "Picada do Aedes aegypti"],
          ["Malária", "Protozoário (Plasmodium)", "Picada do mosquito Anopheles"],
          ["Doença de Chagas", "Protozoário (Trypanosoma)", "Fezes do barbeiro, na picada"],
          ["Verminoses", "Vermes", "Água e alimentos contaminados, solo sujo"],
        ]}
      />
      <Box kind="experimente">
        Faça uma vistoria em casa: vire garrafas de boca para baixo, coloque areia nos pratinhos dos vasos, tampe a caixa d&apos;água e não deixe pneus pegando chuva. São só{" "}
        <strong>10 minutos por semana</strong>!
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🛡️">As defesas do corpo: vacinas e soros</H>
      <P>
        Quando um micróbio invade o corpo, o <T>sistema imunológico</T> reage. Os <T>glóbulos brancos</T> engolem os invasores, e alguns deles produzem <T>anticorpos</T>,
        proteínas em forma de Y que grudam no micróbio e marcam o inimigo para ser destruído.
      </P>
      <Fig n="4.4" caption="Os anticorpos agarram os vírus; o glóbulo branco engole o micróbio." h={22}>
        <DefenseArt />
      </Fig>
      <Table
        head={["", "Vacina", "Soro"]}
        rows={[
          ["O que tem", "O micróbio enfraquecido, morto ou só um pedaço dele", "Anticorpos prontos"],
          ["Para que serve", "Prevenir: ensina o corpo a produzir os próprios anticorpos", "Tratar: age na hora, contra veneno ou infecção"],
          ["Exemplo", "Vacina do sarampo", "Soro antiofídico (picada de cobra)"],
        ]}
      />
      <List
        items={[
          <>
            O sanitarista <T>Oswaldo Cruz</T> comandou as campanhas contra a febre amarela e a varíola no Rio de Janeiro; a <T>Fiocruz</T> leva o nome dele.
          </>,
          <>
            O <T>Instituto Butantan</T>, fundado por Vital Brazil, produz vacinas e soros contra veneno de cobras, aranhas e escorpiões.
          </>,
          <>
            O <T>HIV</T> ataca o sistema imunológico; hoje existe tratamento gratuito pelo <T>SUS</T>.
          </>,
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Microrganismos: vírus (sem célula), bactérias (procariontes), protozoários e fungos. Muitos são úteis!",
          "O vírus invade a célula e usa a fábrica dela para fazer cópias. Antibiótico não funciona contra vírus.",
          "O Aedes aegypti transmite dengue, zika e chikungunya: o combate é acabar com a água parada.",
          "Vacina previne (ensina o corpo a fazer anticorpos); soro trata (traz anticorpos prontos).",
        ]}
      />
      <Glossary
        items={[
          ["Vetor", "Animal que transmite um micróbio de uma pessoa para outra."],
          ["Antibiótico", "Remédio que mata bactérias ou impede que se multipliquem."],
          ["Anticorpo", "Proteína do sistema imunológico que gruda em um invasor específico."],
          ["Saneamento básico", "Água tratada, esgoto e coleta de lixo: previne muitas doenças."],
          ["Decompositor", "Ser vivo que decompõe restos e devolve nutrientes ao ambiente."],
        ]}
      />
      <Quiz
        items={[
          ["Por que o antibiótico não cura a gripe?", "Porque a gripe é causada por vírus, e o antibiótico só age contra bactérias."],
          ["Qual mosquito transmite a dengue?", "O Aedes aegypti."],
          ["A malária é causada por qual tipo de microrganismo?", "Por um protozoário, o Plasmodium, transmitido pelo mosquito Anopheles."],
          ["Qual é a diferença entre soro e vacina?", "A vacina previne, ensinando o corpo a produzir anticorpos; o soro trata, trazendo anticorpos prontos."],
        ]}
      />
    </>,
  ),
];
