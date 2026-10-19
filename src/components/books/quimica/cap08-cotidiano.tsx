"use client";

import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";

// ============================================================================
// CAPÍTULO 8 — QUÍMICA NO DIA A DIA (missão "Química: Química no Dia a
// Dia"): os fogos de artifício estourando em cores, a massa do pão crescendo
// com as bolhas de gás, a mistura proibida de produtos de limpeza, o caminho
// da água tratada (com o cloro e o flúor) e o teste de chama, que mostra a
// cor de cada metal.
// ============================================================================

const FIREWORK_COLORS: { metal: string; color: string }[] = [
  { metal: "estrôncio", color: "#ef4444" },
  { metal: "sódio", color: "#facc15" },
  { metal: "bário", color: "#22c55e" },
  { metal: "cobre", color: "#3b82f6" },
  { metal: "cálcio", color: "#f97316" },
];

// ---------------------------------------------------------------------------
// Abertura: os fogos de artifício
// ---------------------------------------------------------------------------

function Burst({ x, y, color, delay }: { x: number; y: number; color: string; delay: number }) {
  const anim = { dur: "3s", begin: `${-delay}s`, repeatCount: "indefinite" };
  return (
    <g>
      {/* o rojão subindo */}
      <circle cx={x} r="3" fill="#fde68a">
        <animate attributeName="cy" values={`300;${y};${y}`} keyTimes="0;0.3;1" {...anim} />
        <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.3;0.31;1" {...anim} />
      </circle>
      {/* a explosão de faíscas */}
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        return (
          <circle key={i} cx={x} cy={y} r="3.5" fill={color} opacity="0">
            <animate attributeName="cx" values={`${x};${x};${x + Math.cos(a) * 60}`} keyTimes="0;0.3;1" {...anim} />
            <animate attributeName="cy" values={`${y};${y};${y + Math.sin(a) * 60 + 20}`} keyTimes="0;0.3;1" {...anim} />
            <animate attributeName="opacity" values="0;0;1;0" keyTimes="0;0.3;0.4;1" {...anim} />
          </circle>
        );
      })}
    </g>
  );
}

function FireworksArt() {
  return (
    <Art viewBox="0 0 460 300" label="Fogos de artifício estourando em vermelho, amarelo, verde, azul e laranja no céu da noite">
      <rect width="460" height="300" fill="#0f172a" />
      {Array.from({ length: 24 }, (_, i) => (
        <circle key={i} cx={(i * 97) % 460} cy={(i * 37) % 200} r="1.2" fill="#fff" className="cg-anim-twinkle" style={{ animationDelay: `${(i % 7) * 0.4}s` }} />
      ))}
      {FIREWORK_COLORS.map((f, i) => (
        <Burst key={f.metal} x={70 + i * 80} y={70 + (i % 2) * 50} color={f.color} delay={i * 0.6} />
      ))}
      <path d="M0 270 L60 240 L100 260 L160 230 L220 262 L280 236 L340 258 L400 232 L460 252 L460 300 L0 300 Z" fill="#1e293b" />
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O pão crescendo com o fermento
// ---------------------------------------------------------------------------

function BreadArt() {
  return (
    <Art viewBox="0 0 540 200" label="A massa do pão numa tigela crescendo, com as leveduras soltando bolhas de gás carbônico">
      {/* a tigela e a massa crescendo */}
      <g transform="translate(150 170)">
        <g>
          <animateTransform attributeName="transform" type="scale" values="1 0.7;1.08 1.25;1.08 1.25;1 0.7" keyTimes="0;0.6;0.9;1" dur="6s" repeatCount="indefinite" />
          <path d="M-90 0 C-90 -70 90 -70 90 0 Z" fill="#fde68a" stroke="#d97706" strokeWidth="3" />
          {[
            [-50, -20], [-20, -40], [20, -30], [50, -16], [0, -14], [-34, -50], [34, -46],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={4 + (i % 3) * 2} fill="#fffbeb" stroke="#f59e0b" strokeWidth="1" />
          ))}
        </g>
        <path d="M-110 0 L110 0 L96 30 Q90 40 76 40 L-76 40 Q-90 40 -96 30 Z" fill="#94a3b8" stroke="#475569" strokeWidth="3" transform="translate(0 -12)" />
      </g>
      {/* as leveduras trabalhando */}
      <g transform="translate(380 90)">
        <circle r="56" fill="#fffaf0" stroke="#d6b77a" strokeWidth="2" />
        {[
          [-20, -12], [16, -18], [-6, 18], [24, 16],
        ].map(([x, y], i) => (
          <g key={i}>
            <ellipse cx={x} cy={y} rx="11" ry="9" fill="#fde68a" stroke="#a16207" strokeWidth="1.5" />
            <circle cx={x + 6} cy={y + 5} r="3.5" fill="#fde68a" stroke="#a16207" strokeWidth="1" />
            <circle cx={x} cy={y - 12} r="3" fill="none" stroke="#475569" strokeWidth="1.2" className="cg-anim-aura-rise" style={{ "--cg-dur": "2s", "--cg-delay": `${i * 0.5}s` } as React.CSSProperties} />
          </g>
        ))}
        <text y="76" textAnchor="middle" fontSize="12" fontWeight="900" fill="#78350f" fontFamily="Georgia, serif">
          leveduras soltando CO₂
        </text>
      </g>
      <path d="M262 90 L318 90" stroke="#b08a52" strokeWidth="1.5" strokeDasharray="4 3" />
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A mistura proibida
// ---------------------------------------------------------------------------

function DangerArt() {
  return (
    <Art viewBox="0 0 540 180" label="Dois frascos de produtos de limpeza com um X vermelho: misturar água sanitária com outros produtos solta gases tóxicos">
      <g transform="translate(140 100)">
        <path d="M-30 -50 L-10 -50 L-10 -64 L10 -64 L10 -50 L30 -50 L34 60 L-34 60 Z" fill="#bfdbfe" stroke="#1d4ed8" strokeWidth="2.5" />
        <text y="10" textAnchor="middle" fontSize="11" fontWeight="900" fill="#1e3a8a" fontFamily="Georgia, serif">
          água
        </text>
        <text y="24" textAnchor="middle" fontSize="11" fontWeight="900" fill="#1e3a8a" fontFamily="Georgia, serif">
          sanitária
        </text>
      </g>
      <text x="220" y="110" textAnchor="middle" fontSize="30" fontWeight="900" fill="#3b2a14">
        +
      </text>
      <g transform="translate(300 100)">
        <path d="M-26 -40 L26 -40 L30 60 L-30 60 Z" fill="#fde68a" stroke="#a16207" strokeWidth="2.5" />
        <rect x="-10" y="-56" width="20" height="16" fill="#a16207" />
        <text y="14" textAnchor="middle" fontSize="11" fontWeight="900" fill="#78350f" fontFamily="Georgia, serif">
          outro produto
        </text>
      </g>
      <g transform="translate(220 100)">
        <g className="cg-anim-glow">
          <path d="M-120 -80 L120 80 M120 -80 L-120 80" stroke="#dc2626" strokeWidth="10" strokeLinecap="round" opacity="0.85" />
        </g>
      </g>
      {/* o gás tóxico */}
      {[0, 1, 2].map((k) => (
        <circle key={k} cx={220 + (k - 1) * 30} cy="40" r="16" fill="#a3e635" opacity="0.5" className="cg-anim-aura-rise" style={{ "--cg-dur": "3s", "--cg-delay": `${k * 0.9}s` } as React.CSSProperties} />
      ))}
      <g fontFamily="Georgia, serif" fontSize="13" fontWeight="900" fill="#991b1b">
        <text x="400" y="80">Nunca misture</text>
        <text x="400" y="100">produtos de limpeza:</text>
        <text x="400" y="120">soltam gases tóxicos!</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O caminho da água tratada
// ---------------------------------------------------------------------------

function WaterTreatmentArt() {
  const steps = ["Captação", "Floculação", "Decantação", "Filtração", "Cloro e flúor", "Casas"];
  return (
    <Art viewBox="0 0 600 170" label="As etapas do tratamento de água: captação, floculação, decantação, filtração, cloração com flúor e distribuição para as casas">
      <path d="M40 80 L560 80" stroke="#38bdf8" strokeWidth="14" strokeLinecap="round" opacity="0.6" />
      <path d="M40 80 L560 80" stroke="#e0f2fe" strokeWidth="3" strokeDasharray="10 10" className="cg-anim-dash" />
      {steps.map((s, i) => {
        const x = 50 + i * 100;
        return (
          <g key={s} className="cg-anim-pop" style={{ animationDelay: `${i * 0.2}s` }}>
            <circle cx={x} cy="80" r="34" fill="#fffaf0" stroke="#0284c7" strokeWidth="3" />
            {i === 0 && <path d={`M${x - 20} 86 Q${x - 10} 76 ${x} 86 T${x + 20} 86`} stroke="#0284c7" strokeWidth="3" fill="none" />}
            {i === 1 &&
              [-12, 0, 12].map((dx) => <circle key={dx} cx={x + dx} cy={80 + (dx % 2) * 4} r="6" fill="#a16207" opacity="0.7" className="cg-anim-hover" />)}
            {i === 2 && (
              <g>
                <rect x={x - 20} y="66" width="40" height="30" rx="4" fill="#bae6fd" />
                <rect x={x - 20} y="88" width="40" height="8" fill="#a16207" />
              </g>
            )}
            {i === 3 && (
              <g>
                <rect x={x - 18} y="64" width="36" height="10" fill="#fde68a" />
                <rect x={x - 18} y="74" width="36" height="10" fill="#d6d3d1" />
                <rect x={x - 18} y="84" width="36" height="10" fill="#57534e" />
              </g>
            )}
            {i === 4 && (
              <text x={x} y="88" textAnchor="middle" fontSize="16" fontWeight="900" fill="#0369a1" fontFamily="Georgia, serif">
                Cl F
              </text>
            )}
            {i === 5 && <path d={`M${x - 16} 96 L${x - 16} 78 L${x} 64 L${x + 16} 78 L${x + 16} 96 Z`} fill="#fca5a5" stroke="#991b1b" strokeWidth="2" />}
            <text x={x} y="138" textAnchor="middle" fontSize="12" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
              {s}
            </text>
          </g>
        );
      })}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O teste de chama: cada metal, uma cor
// ---------------------------------------------------------------------------

function FlameTestArt() {
  const metals = [
    ["Sódio", "#facc15"],
    ["Estrôncio", "#ef4444"],
    ["Bário", "#22c55e"],
    ["Cobre", "#2dd4bf"],
    ["Potássio", "#c084fc"],
    ["Cálcio", "#f97316"],
  ];
  return (
    <Art viewBox="0 0 600 200" label="O teste de chama: sódio dá amarelo, estrôncio vermelho, bário verde, cobre azul-esverdeado, potássio lilás e cálcio laranja">
      {metals.map(([name, color], i) => {
        const x = 50 + i * 100;
        return (
          <g key={name}>
            <rect x={x - 12} y="150" width="24" height="30" rx="3" fill="#64748b" />
            <g transform={`translate(${x} 150)`}>
              <g className="cg-anim-flicker" style={{ animationDelay: `${i * 0.15}s` }}>
                <path d="M0 -96 C26 -60 26 -18 0 0 C-26 -18 -26 -60 0 -96 Z" fill={color} opacity="0.85" />
                <path d="M0 -50 C10 -34 10 -10 0 -4 C-10 -10 -10 -34 0 -50 Z" fill="#fff" opacity="0.6" />
              </g>
            </g>
            <text x={x} y="196" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
              {name}
            </text>
          </g>
        );
      })}
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
      title="Química no Dia a Dia"
      goals={["A química da cozinha: o fermento, a maçã escura e os conservantes", "Por que nunca misturar produtos de limpeza", "Por que a água tem cloro, o sal tem iodo e a pasta tem flúor", "De onde vêm as cores dos fogos de artifício"]}
    >
      <Fig h={34}>
        <FireworksArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🍞">A química da cozinha</H>
      <P>
        A cozinha é um laboratório! O <T>fermento biológico</T> é feito de leveduras, fungos microscópicos que fazem a <T>fermentação</T>: comem o açúcar da massa e soltam gás
        carbônico. As bolhinhas de gás ficam presas na massa, que cresce; no forno, o gás se expande e o pão fica fofo.
      </P>
      <Fig n="8.1" caption="As leveduras soltam gás carbônico, e a massa cresce." h={20}>
        <BreadArt />
      </Fig>
      <Cards
        items={[
          { icon: "🧁", title: "Bicarbonato", text: "Fermento químico: com o calor ou com um ácido, solta gás carbônico. Também é antiácido." },
          { icon: "🍎", title: "Maçã escura", text: "A fruta cortada reage com o oxigênio do ar. Pingar limão (vitamina C) retarda a reação." },
          { icon: "🧂", title: "Conservantes", text: "Sal, açúcar e vinagre são usados há séculos para os alimentos não estragarem." },
          { icon: "🥫", title: "Industrializados", text: "Os conservantes impedem que micróbios cresçam e que o alimento se estrague." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🧼">Limpeza com segurança</H>
      <P>
        O <T>sabão</T> e o <T>detergente</T> limpam porque têm uma parte que se mistura com a água e outra que se mistura com a gordura (lembra das micelas do capítulo 3?). As
        moléculas cercam a sujeira gordurosa e a água leva tudo embora.
      </P>
      <Fig n="8.2" caption="Misturar produtos de limpeza é perigoso." h={18}>
        <DangerArt />
      </Fig>
      <Box kind="atencao">
        Nunca misture <strong>água sanitária</strong> com amoníaco, desinfetantes, álcool ou outros produtos: a reação solta <strong>gases tóxicos</strong>, que podem causar
        intoxicação. Use um produto de cada vez, com o ambiente ventilado, e guarde tudo longe das crianças e dos animais.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🚰">Química pela saúde</H>
      <P>
        A água que chega às casas passa por uma estação de tratamento. Uma das etapas mais importantes é a <T>cloração</T>: o <T>cloro</T> mata os micróbios que causam doenças.
        Em muitas cidades brasileiras, a água também recebe <T>flúor</T>.
      </P>
      <Fig n="8.3" caption="As etapas do tratamento da água, do rio até a torneira." h={18}>
        <WaterTreatmentArt />
      </Fig>
      <Cards
        items={[
          { icon: "🧂", title: "Sal iodado", text: "O iodo é essencial para a tireoide produzir os hormônios. Por isso a lei manda iodar o sal." },
          { icon: "🦷", title: "Flúor", text: "Na pasta de dente e na água: deixa o esmalte dos dentes mais resistente às cáries." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🎆">As cores dos fogos de artifício</H>
      <P>
        Cada metal, quando é aquecido, solta uma luz de <T>cor própria</T>. Os elétrons recebem energia do calor, &ldquo;pulam&rdquo; para camadas mais externas e, ao voltarem,
        devolvem essa energia como luz. Os químicos usam isso no <T>teste de chama</T> para descobrir qual metal existe numa amostra:
      </P>
      <Fig n="8.4" caption="Cada metal dá uma cor à chama. Os fogos de artifício usam esses metais." h={24}>
        <FlameTestArt />
      </Fig>
      <Box kind="sabia">A luz amarela dos postes de rua antigos vem do vapor de sódio, o mesmo amarelo do teste de chama!</Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "As leveduras do fermento fazem fermentação e soltam gás carbônico: a massa cresce.",
          "A maçã cortada escurece por oxidação; o limão (vitamina C) retarda a reação.",
          "Nunca misture produtos de limpeza: podem soltar gases tóxicos.",
          "O cloro trata a água, o iodo do sal protege a tireoide e o flúor protege os dentes.",
          "Cada metal aquecido emite luz de uma cor: é o que colore os fogos de artifício.",
        ]}
      />
      <Glossary
        items={[
          ["Fermentação", "Processo em que leveduras transformam açúcar e soltam gás."],
          ["Oxidação", "Reação com o oxigênio, como a da maçã cortada."],
          ["Conservante", "Substância que evita que o alimento estrague."],
          ["Cloração", "Etapa do tratamento da água que usa cloro contra micróbios."],
          ["Teste de chama", "Teste que identifica metais pela cor da chama."],
        ]}
      />
      <Quiz
        items={[
          ["Por que a massa do pão cresce?", "Porque as leveduras do fermento soltam gás carbônico, que fica preso na massa."],
          ["Por que o sal de cozinha é iodado?", "Porque o iodo é essencial para a tireoide produzir os seus hormônios."],
          ["Para que serve o cloro na água tratada?", "Para matar os micróbios que causam doenças."],
          ["O que dá as cores aos fogos de artifício?", "Os metais, que soltam luz de uma cor característica quando aquecidos."],
        ]}
      />
    </>,
  ),
];
