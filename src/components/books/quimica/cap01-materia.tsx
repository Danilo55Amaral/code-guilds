"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table, useUid } from "../BookParts";
import type { BookPage } from "../types";
import { Bubbles, Flame } from "./art";

// ============================================================================
// CAPÍTULO 1 — A MATÉRIA E OS ESTADOS FÍSICOS (missão "Química: A Matéria e
// os Estados Físicos"): o gelo derretendo e a água fervendo, a balança que
// mostra que o ar tem massa, os estados físicos de tocar (as partículas
// presas, deslizando ou voando), o ciclo das mudanças de estado e o copo com
// mel, água e óleo pra explicar a densidade.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o gelo derrete, a água ferve e o vapor sobe
// ---------------------------------------------------------------------------

function StatesOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Um cubo de gelo derretendo, uma panela com água fervendo e o vapor subindo">
      {/* o gelo derretendo e pingando */}
      <g transform="translate(70 150)">
        <rect x="-40" y="-40" width="80" height="80" rx="12" fill="#bae6fd" stroke="#0284c7" strokeWidth="3" />
        <path d="M-30 -30 L-6 -30 M-30 -30 L-30 -8" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
        <path d="M-40 30 Q-30 46 -18 40 Q-6 50 6 40 Q20 48 40 30 L40 40 L-40 40 Z" fill="#7dd3fc" />
        {[-20, 4, 26].map((x, i) => (
          <path key={x} d={`M${x} 44 q-4 7 0 9 q4 -2 0 -9 Z`} fill="#38bdf8">
            <animateTransform attributeName="transform" type="translate" values="0 0;0 50" dur="1.4s" begin={`${-i * 0.45}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.8;1" dur="1.4s" begin={`${-i * 0.45}s`} repeatCount="indefinite" />
          </path>
        ))}
        <ellipse cx="0" cy="104" rx="50" ry="8" fill="#7dd3fc" opacity="0.8" />
      </g>
      <text x="70" y="278" textAnchor="middle" fontSize="15" fontWeight="900" fill="#0369a1" fontFamily="Georgia, serif">
        sólido
      </text>
      {/* a panela fervendo */}
      <path d="M140 150 L170 150" stroke="#b08a52" strokeWidth="3" strokeDasharray="6 4" className="cg-anim-dash" />
      <g transform="translate(250 0)">
        <path d="M-62 150 L62 150 L54 228 Q52 236 44 236 L-44 236 Q-52 236 -54 228 Z" fill="#94a3b8" stroke="#334155" strokeWidth="3" />
        <path d="M-56 168 L56 168 L50 226 L-50 226 Z" fill="#38bdf8" opacity="0.9" />
        <Bubbles x0={-44} x1={44} bottom={222} top={172} n={8} />
        <path d="M-62 150 L-80 144 M62 150 L80 144" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
        <rect x="-70" y="250" width="140" height="14" rx="4" fill="#1e293b" />
        <Flame x={-30} y={250} s={0.55} />
        <Flame x={0} y={250} s={0.6} />
        <Flame x={30} y={250} s={0.55} />
        {/* o vapor subindo */}
        {[-30, 0, 30].map((x, i) => (
          <path
            key={x}
            d={`M${x} 140 c-12 -14 12 -24 0 -40 c-12 -14 12 -24 0 -40`}
            stroke="#cbd5e1"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            className="cg-anim-aura-rise"
            style={{ "--cg-dur": "2.6s", "--cg-delay": `${i * 0.8}s` } as React.CSSProperties}
          />
        ))}
      </g>
      <text x="250" y="292" textAnchor="middle" fontSize="15" fontWeight="900" fill="#1d4ed8" fontFamily="Georgia, serif">
        líquido → gasoso
      </text>
      {/* o termômetro subindo */}
      <g transform="translate(400 50)">
        <rect x="-10" y="0" width="20" height="190" rx="10" fill="#fff" stroke="#475569" strokeWidth="2.5" />
        <circle cx="0" cy="200" r="18" fill="#ef4444" stroke="#475569" strokeWidth="2.5" />
        <rect x="-5" y="170" width="10" height="30" rx="5" fill="#ef4444">
          <animate attributeName="y" values="170;30;170" dur="6s" repeatCount="indefinite" />
          <animate attributeName="height" values="30;170;30" dur="6s" repeatCount="indefinite" />
        </rect>
        {[0, 1, 2, 3, 4, 5, 6].map((k) => (
          <path key={k} d={`M10 ${20 + k * 25} L18 ${20 + k * 25}`} stroke="#475569" strokeWidth="1.5" />
        ))}
        <text x="0" y="-10" textAnchor="middle" fontSize="13" fontWeight="900" fill="#b91c1c" fontFamily="Georgia, serif">
          °C
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O ar tem massa: a balança pende pro lado da bexiga cheia
// ---------------------------------------------------------------------------

function AirMassArt() {
  return (
    <Art viewBox="0 0 520 210" label="Uma balança com uma bexiga cheia de um lado e uma vazia do outro: o lado da cheia desce, porque o ar tem massa">
      <path d="M260 196 L260 70" stroke="#78350f" strokeWidth="8" />
      <path d="M220 200 L300 200" stroke="#78350f" strokeWidth="10" strokeLinecap="round" />
      <circle cx="260" cy="66" r="9" fill="#d97706" />
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0 260 66;-9 260 66;-9 260 66;0 260 66" keyTimes="0;0.35;0.85;1" dur="5s" repeatCount="indefinite" />
        <path d="M110 66 L410 66" stroke="#92400e" strokeWidth="7" strokeLinecap="round" />
        {/* a bexiga cheia */}
        <line x1="120" y1="66" x2="120" y2="96" stroke="#475569" strokeWidth="1.5" />
        <ellipse cx="120" cy="130" rx="32" ry="38" fill="#f43f5e" stroke="#9f1239" strokeWidth="2" />
        <path d="M108 112 Q114 104 122 106" stroke="#fff" strokeWidth="4" opacity="0.6" fill="none" strokeLinecap="round" />
        <path d="M116 168 L124 168 L120 174 Z" fill="#9f1239" />
        {/* a bexiga vazia */}
        <line x1="400" y1="66" x2="400" y2="100" stroke="#475569" strokeWidth="1.5" />
        <path d="M392 100 C380 120 396 140 400 150 C404 140 420 120 408 100 Z" fill="#60a5fa" stroke="#1d4ed8" strokeWidth="2" />
      </g>
      <g fontFamily="Georgia, serif" fontSize="13" fontWeight="900">
        <text x="120" y="200" textAnchor="middle" fill="#9f1239">
          cheia de ar
        </text>
        <text x="400" y="200" textAnchor="middle" fill="#1d4ed8">
          vazia
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os estados físicos de tocar: as partículas presas, deslizando ou voando
// ---------------------------------------------------------------------------

const STATES = [
  { id: "solido", name: "Sólido", icon: "❄️", temp: "−10 °C", level: 0.15, color: "#0ea5e9", text: "As partículas ficam bem juntinhas e presas no lugar: só vibram. Por isso o sólido tem forma e volume próprios (o gelo)." },
  { id: "liquido", name: "Líquido", icon: "💧", temp: "25 °C", level: 0.45, color: "#2563eb", text: "As partículas continuam perto, mas deslizam umas sobre as outras. O líquido tem volume fixo, mas toma a forma do recipiente (a água)." },
  { id: "gasoso", name: "Gasoso", icon: "💨", temp: "110 °C", level: 0.85, color: "#7c3aed", text: "As partículas ficam bem afastadas e voam pra todo lado, rapidíssimo. O gás ocupa todo o recipiente: não tem forma nem volume fixos (o vapor)." },
] as const;

function particlePosition(i: number, state: number): [number, number] {
  if (state === 0) return [70 + (i % 6) * 24, 112 + Math.floor(i / 6) * 22];
  if (state === 1) return [62 + ((i * 47) % 156), 120 + ((i * 29) % 66)];
  return [40 + ((i * 71) % 200), 30 + ((i * 53) % 160)];
}

export function StatesSim() {
  const [state, setState] = useState(1);
  const s = STATES[state];
  return (
    <div>
      <Art viewBox="0 0 400 220" label={`Partículas no estado ${s.name.toLowerCase()}`}>
        <defs>
          <clipPath id="states-box">
            <rect x="26" y="16" width="230" height="190" rx="10" />
          </clipPath>
        </defs>
        <rect x="26" y="16" width="230" height="190" rx="10" fill="#f8fafc" stroke="#64748b" strokeWidth="3" />
        <g clipPath="url(#states-box)">
          {Array.from({ length: 24 }, (_, i) => {
            const [x, y] = particlePosition(i, state);
            return (
              <g key={i} style={{ transform: `translate(${x}px, ${y}px)`, transition: "transform 1.1s cubic-bezier(0.4, 0, 0.2, 1)" }}>
                {state === 0 && (
                  <g className="cg-anim-shiver" style={{ animationDelay: `${(i % 5) * 0.05}s` }}>
                    <circle r="10" fill={s.color} stroke="#0c4a6e" strokeWidth="1.2" />
                  </g>
                )}
                {state === 1 && (
                  <g className="cg-anim-aura-drift" style={{ "--cg-dur": `${2 + (i % 4) * 0.6}s`, animationDelay: `${-(i % 7) * 0.4}s` } as React.CSSProperties}>
                    <circle r="10" fill={s.color} stroke="#1e3a8a" strokeWidth="1.2" />
                  </g>
                )}
                {state === 2 && (
                  <g>
                    <animateMotion path={`M0 0 L${((i * 37) % 90) - 45} ${((i * 23) % 80) - 40} L${((i * 19) % 70) - 35} ${((i * 41) % 90) - 45} Z`} dur={`${0.9 + (i % 4) * 0.25}s`} repeatCount="indefinite" />
                    <circle r="10" fill={s.color} stroke="#3b0764" strokeWidth="1.2" />
                  </g>
                )}
              </g>
            );
          })}
        </g>
        {/* o termômetro */}
        <g transform="translate(320 20)">
          <rect x="-10" y="0" width="20" height="160" rx="10" fill="#fff" stroke="#475569" strokeWidth="2.5" />
          <circle cx="0" cy="172" r="16" fill="#ef4444" stroke="#475569" strokeWidth="2.5" />
          <rect x="-5" y="8" width="10" height="164" rx="5" fill="#ef4444" style={{ transform: `scaleY(${0.1 + s.level * 0.9})`, transformBox: "fill-box", transformOrigin: "50% 100%", transition: "transform 1s" }} />
          <text x="22" y="178" fontSize="15" fontWeight="900" fill="#b91c1c" fontFamily="Georgia, serif">
            {s.temp}
          </text>
        </g>
      </Art>
      <div className="mt-[0.3em] flex justify-center gap-[0.4em]">
        {STATES.map((st, i) => (
          <button
            key={st.id}
            type="button"
            onClick={() => setState(i)}
            className={`rounded-full border px-[0.8em] py-[0.15em] text-[0.85em] font-bold transition-colors ${state === i ? "border-[#7e22ce] bg-[#7e22ce] text-white" : "border-[#d9c79d] bg-[#fffaf0] text-[#5b4a2e] hover:bg-[#f3e8ff]"}`}
          >
            {st.icon} {st.name}
          </button>
        ))}
      </div>
      <p key={state} className="cg-anim-fade mt-[0.4em] rounded-xl border border-[#e9d5ff] bg-[#faf5ff] px-[0.8em] py-[0.4em] text-[0.88em] leading-[1.45] text-[#3b0764]">
        <strong>{s.name}:</strong> {s.text}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// O ciclo das mudanças de estado
// ---------------------------------------------------------------------------

function StateChangesArt() {
  const u = useUid("chg");
  const arrow = (d: string, color: string, label: string, lx: number, ly: number, k: number) => (
    <g key={label}>
      <path d={d} stroke={color} strokeWidth="4" fill="none" strokeDasharray="8 6" className="cg-anim-dash" markerEnd={`url(#${u}-${color.slice(1)})`} />
      <text x={lx} y={ly} textAnchor="middle" fontSize="13" fontWeight="900" fill={color} fontFamily="Georgia, serif" className="cg-anim-fade" style={{ animationDelay: `${k * 0.15}s` }}>
        {label}
      </text>
    </g>
  );
  return (
    <Art viewBox="0 0 540 280" label="As mudanças de estado: fusão, solidificação, vaporização, condensação, sublimação e ressublimação">
      <defs>
        {["dc2626", "2563eb"].map((c) => (
          <marker key={c} id={`${u}-${c}`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 Z" fill={`#${c}`} />
          </marker>
        ))}
      </defs>
      {/* os três estados */}
      <g>
        <circle cx="90" cy="220" r="46" fill="#e0f2fe" stroke="#0284c7" strokeWidth="3" />
        <rect x="68" y="196" width="44" height="40" rx="8" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" />
        <circle cx="450" cy="220" r="46" fill="#dbeafe" stroke="#2563eb" strokeWidth="3" />
        <path d="M450 192 C466 214 470 226 462 238 C456 246 444 246 438 238 C430 226 434 214 450 192 Z" fill="#60a5fa" stroke="#1d4ed8" strokeWidth="2" />
        <circle cx="270" cy="60" r="46" fill="#f5f3ff" stroke="#7c3aed" strokeWidth="3" />
        <path d="M244 70 c0 -12 14 -18 22 -10 c6 -14 30 -12 30 4 c12 0 12 16 0 16 l-44 0 c-12 0 -14 -10 -8 -10 Z" fill="#ddd6fe" stroke="#7c3aed" strokeWidth="2" className="cg-anim-hover" />
      </g>
      <g fontFamily="Georgia, serif" fontSize="15" fontWeight="900" textAnchor="middle">
        <text x="90" y="160" fill="#0369a1">Sólido</text>
        <text x="450" y="160" fill="#1d4ed8">Líquido</text>
        <text x="270" y="126" fill="#6d28d9">Gasoso</text>
      </g>
      {/* recebendo calor (vermelho) e perdendo calor (azul) */}
      {arrow("M140 206 C220 186 320 186 400 206", "#dc2626", "fusão", 270, 180, 0)}
      {arrow("M400 240 C320 262 220 262 140 240", "#2563eb", "solidificação", 270, 274, 1)}
      {arrow("M430 174 C410 120 360 80 322 66", "#dc2626", "vaporização", 420, 104, 2)}
      {arrow("M318 96 C356 112 388 140 404 178", "#2563eb", "condensação", 338, 160, 3)}
      {arrow("M110 174 C130 120 180 80 218 66", "#dc2626", "sublimação", 120, 104, 4)}
      {arrow("M222 96 C184 112 152 140 136 178", "#2563eb", "ressublimação", 205, 160, 5)}
      <g fontFamily="Georgia, serif" fontSize="11.5" fontWeight="700">
        <rect x="8" y="8" width="12" height="12" fill="#dc2626" />
        <text x="26" y="18" fill="#991b1b">
          recebe calor
        </text>
        <rect x="8" y="28" width="12" height="12" fill="#2563eb" />
        <text x="26" y="38" fill="#1e3a8a">
          perde calor
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A densidade: mel, água e óleo no copo, e o navio flutuando
// ---------------------------------------------------------------------------

function DensityArt() {
  return (
    <Art viewBox="0 0 540 250" label="Um copo com mel embaixo, água no meio e óleo em cima, com uma moeda no fundo, uma uva na água e uma rolha no óleo, e um navio flutuando no mar">
      {/* o copo em camadas */}
      <path d="M60 30 L70 230 Q72 240 82 240 L178 240 Q188 240 190 230 L200 30" fill="#fffaf0" />
      <path d="M66 160 L194 160 L190 230 Q188 240 178 240 L82 240 Q72 240 70 230 Z" fill="#d97706" opacity="0.9" />
      <path d="M63 100 L197 100 L194 160 L66 160 Z" fill="#38bdf8" opacity="0.75" />
      <path d="M61 56 L199 56 L197 100 L63 100 Z" fill="#fde047" opacity="0.8" />
      <path d="M60 30 L70 230 Q72 240 82 240 L178 240 Q188 240 190 230 L200 30" fill="none" stroke="#64748b" strokeWidth="3" />
      {/* a moeda no fundo, a uva na água e a rolha no óleo */}
      <ellipse cx="110" cy="232" rx="16" ry="5" fill="#a8a29e" stroke="#57534e" strokeWidth="1.5" />
      <g className="cg-anim-hover" style={{ animationDuration: "4s" }}>
        <circle cx="150" cy="152" r="10" fill="#7e22ce" stroke="#3b0764" strokeWidth="1.5" />
      </g>
      <g className="cg-anim-hover" style={{ animationDuration: "3s" }}>
        <rect x="96" y="44" width="30" height="20" rx="4" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
      </g>
      <g fontFamily="Georgia, serif" fontSize="12.5" fontWeight="900">
        <text x="212" y="80" fill="#a16207">óleo (menos denso)</text>
        <text x="212" y="134" fill="#0369a1">água</text>
        <text x="212" y="204" fill="#92400e">mel (mais denso)</text>
      </g>
      {/* o navio no mar */}
      <rect x="350" y="170" width="190" height="80" fill="#38bdf8" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -4;0 0" dur="3s" repeatCount="indefinite" />
        <path d="M368 150 L522 150 L506 182 L384 182 Z" fill="#475569" stroke="#1e293b" strokeWidth="2" />
        <rect x="410" y="118" width="60" height="32" rx="3" fill="#f8fafc" stroke="#1e293b" strokeWidth="2" />
        <rect x="430" y="96" width="14" height="22" fill="#dc2626" />
        {[418, 438, 458].map((x) => (
          <circle key={x} cx={x} cy="134" r="4" fill="#38bdf8" />
        ))}
      </g>
      <path d="M350 172 Q370 166 390 172 T430 172 T470 172 T510 172 T550 172" stroke="#e0f2fe" strokeWidth="3" fill="none">
        <animateTransform attributeName="transform" type="translate" values="0 0;-40 0" dur="2.5s" repeatCount="indefinite" />
      </path>
      <text x="445" y="240" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff" fontFamily="Georgia, serif">
        casco oco, cheio de ar
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 1, content, bare });

export const chapter1: BookPage[] = [
  page(
    <ChapterOpener
      n={1}
      title="A Matéria e os Estados Físicos"
      goals={["O que é matéria e quais são as suas propriedades", "Como as partículas se comportam no sólido, no líquido e no gás", "Os nomes de cada mudança de estado", "O que é densidade e por que o navio flutua"]}
    >
      <Fig h={34}>
        <StatesOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🌎">O que é matéria?</H>
      <P>
        <T>Matéria</T> é tudo aquilo que <T>tem massa e ocupa lugar no espaço</T>. Uma pedra, a água, o seu corpo e até o ar são matéria. A Química é a ciência que estuda a
        matéria, do que ela é feita e como ela se transforma.
      </P>
      <P>
        O ar a gente não vê, mas ele também é matéria. Quer uma prova? Pendure uma bexiga cheia e uma vazia numa balança: o lado da cheia desce, porque o ar dentro dela tem
        massa.
      </P>
      <Fig n="1.1" caption="O ar tem massa: o lado da bexiga cheia fica mais pesado." h={20}>
        <AirMassArt />
      </Fig>
      <Cards
        items={[
          { icon: "⚖️", title: "Massa", text: "A quantidade de matéria. Medida em quilogramas (kg) ou gramas (g)." },
          { icon: "📦", title: "Volume", text: "O espaço que a matéria ocupa. Medido em litros (L) ou metros cúbicos (m³)." },
        ]}
      />
      <Box kind="lembre">
        Uma porção limitada de matéria é um <strong>corpo</strong> (um pedaço de madeira); quando ela tem uma utilidade, é um <strong>objeto</strong> (uma cadeira de madeira).
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🔬">Os estados físicos</H>
      <P>
        A matéria é formada por partículas minúsculas que estão sempre se mexendo. O jeito como elas se arrumam define o <T>estado físico</T>. Os três estados mais comuns são o{" "}
        <T>sólido</T>, o <T>líquido</T> e o <T>gasoso</T>. Toque nos botões e veja as partículas mudarem:
      </P>
      <Fig n="1.2" caption="O gelo, a água e o vapor são a mesma substância (H₂O) em estados físicos diferentes." h={26}>
        <StatesSim />
      </Fig>
      <Table
        head={["Estado", "Forma", "Volume"]}
        rows={[
          ["Sólido", "Fixa", "Fixo"],
          ["Líquido", "A do recipiente", "Fixo"],
          ["Gasoso", "A do recipiente", "Ocupa todo o recipiente"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🔄">As mudanças de estado</H>
      <P>
        Quando a matéria <T>recebe calor</T>, as partículas se agitam mais e podem se afastar; quando <T>perde calor</T>, elas se acalmam e se aproximam. É assim que acontecem
        as mudanças de estado:
      </P>
      <Fig n="1.3" caption="As setas vermelhas recebem calor; as azuis perdem calor." h={30}>
        <StateChangesArt />
      </Fig>
      <List3 />
      <Box kind="sabia">
        A <strong>naftalina</strong> e o <strong>gelo-seco</strong> (gás carbônico sólido) passam do sólido direto para o gasoso: é a <strong>sublimação</strong>. Aquela
        &ldquo;fumacinha&rdquo; dos shows é feita com gelo-seco!
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🚢">Densidade: quem afunda e quem flutua</H>
      <P>
        Por que o óleo boia na água? Por causa da <T>densidade</T>, que mede quanta massa existe em cada pedacinho de volume:
      </P>
      <div className="my-[0.4em] rounded-xl border-2 border-[#a21caf] bg-[#fdf4ff] px-[0.8em] py-[0.4em] text-center font-bold text-[#701a75]">densidade = massa ÷ volume</div>
      <Fig n="1.4" caption="No copo, o mais denso fica embaixo. O navio de aço flutua porque o casco é oco e cheio de ar." h={24}>
        <DensityArt />
      </Fig>
      <P>
        O que é <T>menos denso</T> que a água flutua; o que é <T>mais denso</T> afunda. Uma bola de aço maciça afunda, mas o navio, que é oco e cheio de ar, tem uma densidade
        média menor que a da água e recebe uma força para cima, o <T>empuxo</T>, que equilibra o peso.
      </P>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Matéria é tudo o que tem massa e ocupa lugar no espaço, até o ar.",
          "Sólido: forma e volume fixos. Líquido: volume fixo, forma do recipiente. Gás: ocupa todo o recipiente.",
          "Fusão, vaporização e sublimação recebem calor; solidificação, condensação e ressublimação perdem calor.",
          "Densidade = massa ÷ volume. O menos denso flutua sobre o mais denso.",
        ]}
      />
      <Glossary
        items={[
          ["Matéria", "Tudo o que tem massa e ocupa espaço."],
          ["Fusão", "Passagem do sólido para o líquido (o gelo derretendo)."],
          ["Condensação", "Passagem do gasoso para o líquido (as gotas no copo gelado)."],
          ["Sublimação", "Passagem do sólido direto para o gasoso."],
          ["Densidade", "A relação entre a massa e o volume."],
        ]}
      />
      <Quiz
        items={[
          ["Como se chama a passagem do sólido para o líquido?", "Fusão."],
          ["As gotinhas do lado de fora de um copo gelado vêm de onde?", "Do vapor de água do ar, que encosta no copo frio e condensa."],
          ["Em qual estado as partículas estão mais afastadas?", "No gasoso."],
          ["Por que o óleo fica por cima da água?", "Porque é menos denso que a água."],
        ]}
      />
    </>,
  ),
];

/** As explicações de cada mudança de estado (a lista da página do ciclo). */
function List3() {
  return (
    <ul className="mb-[0.6em] grid grid-cols-2 gap-x-[0.8em] gap-y-[0.2em] text-[0.9em] leading-[1.4]">
      <li>
        <T>Fusão</T>: o gelo derrete (a 0 °C).
      </li>
      <li>
        <T>Solidificação</T>: a água congela.
      </li>
      <li>
        <T>Vaporização</T>: a água vira vapor. Pode ser <em>evaporação</em> (devagar, como a roupa no varal) ou <em>ebulição</em> (fervendo, a 100 °C).
      </li>
      <li>
        <T>Condensação</T> (ou liquefação): o vapor vira líquido, como as gotas no copo gelado.
      </li>
    </ul>
  );
}
