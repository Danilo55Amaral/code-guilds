"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Ball } from "./art";

// ============================================================================
// CAPÍTULO 7 — ÁCIDOS, BASES E pH (missão "Química: Ácidos, Bases e Química
// Orgânica", a parte dos ácidos e das bases): o medidor de pH balançando
// entre o limão e o sabão, os íons H⁺ e OH⁻, a escala de pH de tocar com a
// cor do suco de repolho roxo, a neutralização e a chuva ácida.
// ============================================================================

/** A cor do suco de repolho roxo em cada pH (do vermelho ao amarelo). */
export function cabbageColor(ph: number): string {
  const stops: [number, string][] = [
    [1, "#dc2626"],
    [3, "#e11d48"],
    [5, "#a21caf"],
    [7, "#7c3aed"],
    [9, "#2563eb"],
    [11, "#16a34a"],
    [13, "#ca8a04"],
  ];
  let best = stops[0][1];
  for (const [p, c] of stops) if (ph >= p - 1) best = c;
  return best;
}

/** A cor da faixa da escala de pH (vermelho ácido, verde neutro, roxo básico). */
function scaleColor(ph: number): string {
  const hue = ph <= 7 ? (ph / 7) * 120 : 120 + ((ph - 7) / 7) * 150;
  return `hsl(${hue.toFixed(0)}, 75%, 50%)`;
}

// ---------------------------------------------------------------------------
// Abertura: o medidor de pH balançando entre o limão e o sabão
// ---------------------------------------------------------------------------

function PHOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Um medidor de pH com o ponteiro balançando entre o ácido (limão) e o básico (sabão)">
      {/* o arco colorido do medidor */}
      {Array.from({ length: 15 }, (_, i) => {
        const a1 = Math.PI + (i / 15) * Math.PI;
        const a2 = Math.PI + ((i + 1) / 15) * Math.PI;
        const p = (r: number, a: number) => `${(230 + Math.cos(a) * r).toFixed(1)} ${(200 + Math.sin(a) * r).toFixed(1)}`;
        return <path key={i} d={`M${p(150, a1)} A150 150 0 0 1 ${p(150, a2)} L${p(110, a2)} A110 110 0 0 0 ${p(110, a1)} Z`} fill={scaleColor(i)} stroke="#fff" strokeWidth="1.5" />;
      })}
      {[0, 7, 14].map((v) => {
        const a = Math.PI + (v / 14) * Math.PI;
        // o 7 fica em cima do arco; o 0 e o 14, embaixo das pontas (longe do limão e das bolhas do sabão)
        const [r, dy] = v === 7 ? [168, 6] : [130, 26];
        return (
          <text key={v} x={230 + Math.cos(a) * r} y={200 + dy + Math.sin(a) * r} textAnchor="middle" fontSize="16" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
            {v}
          </text>
        );
      })}
      {/* o ponteiro */}
      <g>
        <animateTransform attributeName="transform" type="rotate" values="-70 230 200;70 230 200;-70 230 200" dur="5s" repeatCount="indefinite" />
        <path d="M226 200 L230 80 L234 200 Z" fill="#1e293b" />
      </g>
      <circle cx="230" cy="200" r="12" fill="#1e293b" />
      {/* o limão e o sabão */}
      <g transform="translate(60 250)">
        <ellipse rx="34" ry="24" fill="#fde047" stroke="#a16207" strokeWidth="2.5" />
        <path d="M-34 0 L-42 -4 M34 0 L42 4" stroke="#a16207" strokeWidth="3" />
        <text y="44" textAnchor="middle" fontSize="13" fontWeight="900" fill="#b91c1c" fontFamily="Georgia, serif">
          ácido
        </text>
      </g>
      <g transform="translate(400 250)">
        <rect x="-32" y="-20" width="64" height="40" rx="12" fill="#bfdbfe" stroke="#1d4ed8" strokeWidth="2.5" />
        {[-18, 0, 18].map((x, i) => (
          <circle key={x} cx={x} cy="-30" r={6 + i * 2} fill="none" stroke="#60a5fa" strokeWidth="2" className="cg-anim-aura-rise" style={{ "--cg-dur": "2.6s", "--cg-delay": `${i * 0.7}s` } as React.CSSProperties} />
        ))}
        <text y="44" textAnchor="middle" fontSize="13" fontWeight="900" fill="#6d28d9" fontFamily="Georgia, serif">
          básico
        </text>
      </g>
      <text x="230" y="236" textAnchor="middle" fontSize="20" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
        pH
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Ácido solta H⁺ e base solta OH⁻
// ---------------------------------------------------------------------------

function IonsArt() {
  const loop = { dur: "4s", repeatCount: "indefinite" };
  return (
    <Art viewBox="0 0 540 190" label="Na água, o ácido clorídrico solta o íon H⁺ e o hidróxido de sódio solta o íon OH⁻">
      <rect x="4" y="4" width="262" height="182" rx="14" fill="#fef2f2" stroke="#fecaca" strokeWidth="2" />
      <rect x="274" y="4" width="262" height="182" rx="14" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="2" />
      <g fontFamily="Georgia, serif" fontWeight="900" textAnchor="middle">
        <text x="135" y="28" fontSize="14" fill="#b91c1c">Ácido (HCl)</text>
        <text x="405" y="28" fontSize="14" fill="#1d4ed8">Base (NaOH)</text>
      </g>
      {/* HCl se separando */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;-30 0;-30 0;0 0" keyTimes="0;0.3;0.8;1" {...loop} />
        <Ball el="H" x={120} y={100} r={14} />
        <text x="120" y="70" textAnchor="middle" fontSize="15" fontWeight="900" fill="#b91c1c" opacity="0">
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.3;0.8;1" {...loop} />
          H⁺
        </text>
      </g>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;30 0;30 0;0 0" keyTimes="0;0.3;0.8;1" {...loop} />
        <Ball el="Cl" x={148} y={100} r={17} />
      </g>
      {/* NaOH se separando */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;-30 0;-30 0;0 0" keyTimes="0;0.3;0.8;1" {...loop} />
        <Ball el="Na" x={384} y={100} r={16} />
      </g>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;30 0;30 0;0 0" keyTimes="0;0.3;0.8;1" {...loop} />
        <Ball el="O" x={414} y={100} r={15} />
        <Ball el="H" x={434} y={88} r={10} />
        <text x="424" y="66" textAnchor="middle" fontSize="15" fontWeight="900" fill="#1d4ed8" opacity="0">
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.3;0.8;1" {...loop} />
          OH⁻
        </text>
      </g>
      <g fontFamily="Georgia, serif" fontSize="12" fill="#3b2a14" textAnchor="middle">
        <text x="135" y="160">na água, solta H⁺</text>
        <text x="405" y="160">na água, solta OH⁻</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A escala de pH de tocar
// ---------------------------------------------------------------------------

const PH_ITEMS: { name: string; icon: string; ph: number; note: string }[] = [
  { name: "Suco gástrico", icon: "🍽️", ph: 1.5, note: "O ácido clorídrico do estômago ajuda a digerir e mata micróbios." },
  { name: "Limão", icon: "🍋", ph: 2, note: "Tem ácido cítrico: por isso é azedo." },
  { name: "Vinagre", icon: "🥗", ph: 3, note: "Tem ácido acético." },
  { name: "Refrigerante", icon: "🥤", ph: 3, note: "Tem ácidos que, em excesso, desgastam o esmalte dos dentes." },
  { name: "Café", icon: "☕", ph: 5, note: "Levemente ácido." },
  { name: "Água pura", icon: "💧", ph: 7, note: "Neutra: nem ácida nem básica (a 25 °C)." },
  { name: "Sangue", icon: "❤️", ph: 7.4, note: "Levemente básico, e o corpo mantém esse pH bem certinho." },
  { name: "Bicarbonato", icon: "🧁", ph: 8.5, note: "Uma base fraca, usada em bolos e como antiácido." },
  { name: "Sabão", icon: "🧼", ph: 10, note: "As bases deixam a pele com sensação escorregadia." },
  { name: "Leite de magnésia", icon: "🥛", ph: 10.5, note: "Uma base usada como antiácido e laxante." },
  { name: "Água sanitária", icon: "🧴", ph: 12.5, note: "Muito básica e corrosiva: use com luvas." },
];

export function PHScale() {
  const [sel, setSel] = useState(1);
  const item = PH_ITEMS[sel];
  const kind = item.ph < 7 ? "ácido" : item.ph === 7 ? "neutro" : "básico";
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <div className="relative">
        <div className="flex h-[1.4em] overflow-hidden rounded-full border border-[#94a3b8]">
          {Array.from({ length: 15 }, (_, i) => (
            <div key={i} className="flex flex-1 items-center justify-center text-[0.62em] font-black text-white" style={{ background: scaleColor(i) }}>
              {i}
            </div>
          ))}
        </div>
        <div className="absolute -top-[0.9em] transition-all duration-700" style={{ left: `calc(${(item.ph / 14) * 100}% - 0.5em)` }}>
          <span className="block text-[1em] leading-none text-[#1e293b]">▼</span>
        </div>
      </div>
      <div className="mt-[0.5em] flex flex-wrap justify-center gap-[0.25em]">
        {PH_ITEMS.map((it, i) => (
          <button
            key={it.name}
            type="button"
            onClick={() => setSel(i)}
            className={`rounded-full border px-[0.55em] py-[0.1em] text-[0.76em] font-bold transition-colors ${sel === i ? "border-[#a21caf] bg-[#a21caf] text-white" : "border-[#d9c79d] bg-white text-[#5b4a2e] hover:bg-[#fdf4ff]"}`}
          >
            {it.icon} {it.name}
          </button>
        ))}
      </div>
      <div key={sel} className="cg-anim-fade mt-[0.5em] flex items-center gap-[0.7em]">
        <svg viewBox="0 0 40 110" className="h-[5em] w-auto shrink-0" aria-hidden="true">
          <path d="M8 4 L32 4 L32 90 Q32 104 20 104 Q8 104 8 90 Z" fill="#fff" stroke="#64748b" strokeWidth="2" />
          <path d="M9 40 L31 40 L31 90 Q31 103 20 103 Q9 103 9 90 Z" fill={cabbageColor(item.ph)} style={{ transition: "fill 0.7s" }} />
        </svg>
        <p className="text-[0.88em] leading-[1.45] text-[#3b0764]">
          <strong>
            {item.name}: pH {item.ph.toLocaleString("pt-BR")} ({kind})
          </strong>
          <br />
          {item.note}
          <br />
          <span className="text-[0.92em] italic">O tubo mostra a cor que o suco de repolho roxo fica com ele.</span>
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A neutralização: H⁺ + OH⁻ → H₂O
// ---------------------------------------------------------------------------

function NeutralizationArt() {
  const loop = { dur: "4s", repeatCount: "indefinite" };
  return (
    <Art viewBox="0 0 540 200" label="Na neutralização, o H⁺ do ácido se junta ao OH⁻ da base e forma água, e sobra o sal">
      <g>
        <animateMotion values="0,0;80,0;80,0;0,0" keyTimes="0;0.4;0.85;1" calcMode="linear" {...loop} />
        <Ball el="H" x={110} y={70} r={13} />
        <text x="110" y="46" textAnchor="middle" fontSize="13" fontWeight="900" fill="#b91c1c">
          H⁺
        </text>
      </g>
      <g>
        <animateMotion values="0,0;-80,0;-80,0;0,0" keyTimes="0;0.4;0.85;1" calcMode="linear" {...loop} />
        <Ball el="O" x={290} y={70} r={15} />
        <Ball el="H" x={310} y={58} r={10} />
        <text x="300" y="40" textAnchor="middle" fontSize="13" fontWeight="900" fill="#1d4ed8">
          OH⁻
        </text>
      </g>
      <g opacity="0">
        <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.38;0.45;0.85;1" {...loop} />
        <circle cx="200" cy="70" r="34" fill="#bae6fd" opacity="0.5" />
        <text x="200" y="124" textAnchor="middle" fontSize="13" fontWeight="900" fill="#0369a1">
          água!
        </text>
      </g>
      <text x="200" y="168" textAnchor="middle" fontSize="15" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
        HCl + NaOH → NaCl + H₂O
      </text>
      <text x="200" y="188" textAnchor="middle" fontSize="12" fill="#5b4a2e" fontFamily="Georgia, serif">
        ácido + base → sal + água
      </text>
      {/* os tubos de repolho roxo, do ácido ao básico */}
      {[1, 3, 5, 7, 9, 11, 13].map((ph, i) => (
        <g key={ph} transform={`translate(${380 + i * 22} 40)`}>
          <path d="M-7 0 L7 0 L7 80 Q7 88 0 88 Q-7 88 -7 80 Z" fill="#fff" stroke="#64748b" strokeWidth="1.5" />
          <path d="M-6 30 L6 30 L6 80 Q6 87 0 87 Q-6 87 -6 80 Z" fill={cabbageColor(ph)} />
          <text y="104" textAnchor="middle" fontSize="10" fontWeight="900" fill="#3b2a14">
            {ph}
          </text>
        </g>
      ))}
      <text x="446" y="164" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#5b4a2e" fontFamily="Georgia, serif">
        repolho roxo em cada pH
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A chuva ácida
// ---------------------------------------------------------------------------

function AcidRainArt() {
  return (
    <Art viewBox="0 0 540 230" label="A fumaça das fábricas e dos carros sobe, forma nuvens e cai como chuva ácida, que corrói estátuas e prejudica florestas e lagos">
      <rect width="540" height="230" fill="#e2e8f0" />
      <rect y="190" width="540" height="40" fill="#65a30d" />
      {/* a fábrica e o carro soltando os gases */}
      <g transform="translate(70 190)">
        <rect x="-40" y="-50" width="80" height="50" fill="#475569" />
        <rect x="10" y="-100" width="16" height="50" fill="#334155" />
        {[0, 1, 2].map((k) => (
          <circle key={k} cx="18" cy="-110" r="12" fill="#64748b" className="cg-anim-aura-rise" style={{ "--cg-dur": "3s", "--cg-delay": `${k}s` } as React.CSSProperties} />
        ))}
      </g>
      <g transform="translate(170 180)">
        <rect x="-26" y="-12" width="52" height="16" rx="5" fill="#dc2626" />
        <circle cx="-14" cy="6" r="6" fill="#1e293b" />
        <circle cx="14" cy="6" r="6" fill="#1e293b" />
        <circle cx="-34" cy="-2" r="6" fill="#94a3b8" className="cg-anim-aura-rise" style={{ "--cg-dur": "2.4s" } as React.CSSProperties} />
      </g>
      <text x="110" y="40" textAnchor="middle" fontSize="12" fontWeight="900" fill="#334155" fontFamily="Georgia, serif">
        óxidos de enxofre e nitrogênio
      </text>
      {/* a nuvem e a chuva */}
      <path d="M260 70 c0 -22 26 -32 42 -18 c10 -26 54 -22 56 6 c22 0 26 30 2 32 l-92 0 c-22 0 -26 -20 -8 -20 Z" fill="#94a3b8" stroke="#64748b" strokeWidth="2" />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M${270 + i * 12} 96 l-3 8`} stroke="#ca8a04" strokeWidth="2.5" strokeLinecap="round">
          <animateTransform attributeName="transform" type="translate" values="0 0;-12 90" dur="1.1s" begin={`${-i * 0.12}s`} repeatCount="indefinite" />
        </path>
      ))}
      {/* a estátua se desgastando, a árvore e o lago */}
      <g transform="translate(470 190)">
        <rect x="-18" y="-16" width="36" height="16" fill="#a8a29e" />
        <path d="M-10 -16 L-10 -60 Q0 -76 10 -60 L10 -16 Z" fill="#d6d3d1" stroke="#78716c" strokeWidth="1.5" />
        <circle cx="0" cy="-74" r="10" fill="#d6d3d1" stroke="#78716c" strokeWidth="1.5" />
        <path d="M-6 -40 l4 4 M4 -56 l3 3" stroke="#78716c" strokeWidth="1.2" />
      </g>
      <g transform="translate(390 190)">
        <path d="M0 0 L0 -50 M0 -30 L-14 -44 M0 -36 L12 -52" stroke="#78350f" strokeWidth="4" fill="none" />
        <circle cx="-12" cy="-48" r="8" fill="#a3a33a" opacity="0.7" />
      </g>
      <ellipse cx="300" cy="206" rx="60" ry="12" fill="#38bdf8" />
      <text x="300" y="226" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily="Georgia, serif">
        lago acidificado
      </text>
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
      title="Ácidos, Bases e pH"
      goals={["O que são ácidos e bases e onde eles estão", "Como funciona a escala de pH", "O que são indicadores e a neutralização", "Como se forma a chuva ácida"]}
    >
      <Fig h={34}>
        <PHOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🍋">Ácidos e bases no dia a dia</H>
      <P>
        Os <T>ácidos</T> têm sabor azedo, como o limão e o vinagre. As <T>bases</T> (ou álcalis) têm sabor amargo e deixam a pele escorregadia, como o sabão. Mas atenção: nunca
        prove substâncias de laboratório!
      </P>
      <P>
        Segundo o químico <T>Arrhenius</T>, na água o ácido libera o íon <T>H⁺</T> e a base libera o íon <T>OH⁻</T> (hidroxila):
      </P>
      <Fig n="7.1" caption="O ácido clorídrico solta H⁺; o hidróxido de sódio solta OH⁻." h={20}>
        <IonsArt />
      </Fig>
      <Cards
        items={[
          { icon: "🍋", title: "Ácidos", text: "Limão (cítrico), vinagre (acético), suco gástrico (clorídrico), refrigerante." },
          { icon: "🧼", title: "Bases", text: "Sabão, água sanitária, leite de magnésia, bicarbonato de sódio." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🌈">A escala de pH</H>
      <P>
        O <T>pH</T> diz o quanto uma solução é ácida ou básica, numa escala de <T>0 a 14</T> (a 25 °C): abaixo de 7 é <T>ácido</T>, 7 é <T>neutro</T> (a água pura) e acima de 7
        é <T>básico</T>. Toque em cada coisa e veja onde ela fica:
      </P>
      <PHScale />
      <Box kind="sabia">Cada número a menos no pH significa 10 vezes mais ácido. Um suco com pH 3 é 10 vezes mais ácido que um com pH 4, e 100 vezes mais que um com pH 5!</Box>
    </>,
  ),

  page(
    <>
      <H icon="🧪">Indicadores e neutralização</H>
      <P>
        Os <T>indicadores</T> são substâncias que mudam de cor conforme o pH. O suco de <T>repolho roxo</T> é um indicador natural: fica avermelhado no ácido, roxo no neutro e
        esverdeado na base. No laboratório usa-se, por exemplo, a fenolftaleína, que fica rosa na base.
      </P>
      <P>
        Quando um ácido encontra uma base, o H⁺ e o OH⁻ se juntam e formam água: é a <T>neutralização</T>, que produz <T>sal e água</T>.
      </P>
      <Fig n="7.2" caption="A neutralização e as cores do repolho roxo do ácido ao básico." h={24}>
        <NeutralizationArt />
      </Fig>
      <Box kind="lembre">
        O <strong>antiácido</strong> para azia é uma base fraca: ele neutraliza parte do ácido clorídrico do estômago e alivia a queimação.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🌧️">A chuva ácida</H>
      <P>
        A chuva normal já é levemente ácida. Mas a queima de carvão e de combustíveis em fábricas e carros solta <T>óxidos de enxofre e de nitrogênio</T>, que reagem com a
        água das nuvens e formam ácidos fortes. É a <T>chuva ácida</T>.
      </P>
      <Fig n="7.3" caption="Da chaminé à chuva: a chuva ácida corrói monumentos, prejudica florestas e acidifica rios e lagos." h={26}>
        <AcidRainArt />
      </Fig>
      <P>
        Filtros nas chaminés, combustíveis com menos enxofre, carros elétricos e transporte público ajudam a diminuir o problema.
      </P>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Ácidos liberam H⁺ na água (sabor azedo); bases liberam OH⁻ (sabor amargo, escorregadias).",
          "Escala de pH: 0 a 6,9 ácido, 7 neutro, 7,1 a 14 básico.",
          "Indicadores, como o repolho roxo, mudam de cor com o pH.",
          "Neutralização: ácido + base → sal + água.",
          "A chuva ácida vem dos óxidos de enxofre e nitrogênio soltos pela queima de combustíveis.",
        ]}
      />
      <Glossary
        items={[
          ["pH", "Escala de 0 a 14 que mede a acidez."],
          ["Indicador", "Substância que muda de cor conforme o pH."],
          ["Neutralização", "Reação entre ácido e base que forma sal e água."],
          ["Hidroxila (OH⁻)", "O íon que as bases liberam na água."],
          ["Antiácido", "Base fraca que alivia a azia."],
        ]}
      />
      <Quiz
        items={[
          ["Uma solução com pH 7 é ácida, neutra ou básica?", "Neutra."],
          ["O limão é ácido ou básico?", "Ácido (tem ácido cítrico, pH perto de 2)."],
          ["O que se forma quando um ácido reage com uma base?", "Sal e água: é a neutralização."],
          ["Qual ácido está no suco gástrico?", "O ácido clorídrico (HCl)."],
        ]}
      />
    </>,
  ),
];
