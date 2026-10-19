"use client";

import { Art, Box, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Ball, Diatomic, Water } from "./art";

// ============================================================================
// CAPÍTULO 3 — SUBSTÂNCIAS, MISTURAS E LIGAÇÕES (missão "Química:
// Substâncias e Misturas"): o funil filtrando e o ímã puxando a limalha, as
// partículas de cada tipo de substância e de mistura, os métodos de separar
// misturas, a ligação iônica (o elétron pulando do sódio pro cloro) e a
// covalente, e o detergente juntando o óleo e a água.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: filtrando e separando com o ímã
// ---------------------------------------------------------------------------

function SeparationOpenerArt() {
  const filings: [number, number][] = [
    [300, 236], [318, 240], [336, 234], [352, 242], [370, 236], [388, 240], [326, 246], [362, 248],
  ];
  return (
    <Art viewBox="0 0 460 300" label="Um funil com filtro pingando num frasco e um ímã puxando a limalha de ferro da areia">
      {/* o funil e o filtro */}
      <path d="M50 40 L170 40 L120 120 L120 150 L100 150 L100 120 Z" fill="#e2e8f0" stroke="#64748b" strokeWidth="2.5" />
      <path d="M62 46 L158 46 L112 116 Z" fill="#fef3c7" stroke="#d6b77a" strokeWidth="1.5" />
      <path d="M70 52 L150 52 L132 80 L88 80 Z" fill="#78350f" opacity="0.85" />
      {/* as gotas caindo */}
      {[0, 1, 2].map((i) => (
        <path key={i} d="M110 154 q-4 7 0 9 q4 -2 0 -9 Z" fill="#b45309">
          <animateTransform attributeName="transform" type="translate" values="0 0;0 70" dur="1.2s" begin={`${-i * 0.4}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.85;1" dur="1.2s" begin={`${-i * 0.4}s`} repeatCount="indefinite" />
        </path>
      ))}
      <path d="M70 200 L150 200 L150 270 Q150 280 140 280 L80 280 Q70 280 70 270 Z" fill="#b45309" opacity="0.7" />
      <path d="M70 180 L70 270 Q70 280 80 280 L140 280 Q150 280 150 270 L150 180" fill="none" stroke="#64748b" strokeWidth="2.5" />
      <text x="110" y="296" textAnchor="middle" fontSize="13" fontWeight="900" fill="#78350f" fontFamily="Georgia, serif">
        filtração
      </text>
      {/* o ímã puxando a limalha */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 20;0 0" dur="3s" repeatCount="indefinite" />
        <path d="M300 60 L300 140 Q300 180 344 180 Q388 180 388 140 L388 60 L362 60 L362 140 Q362 154 344 154 Q326 154 326 140 L326 60 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2" />
        <rect x="300" y="60" width="26" height="22" fill="#e2e8f0" stroke="#7f1d1d" strokeWidth="2" />
        <rect x="362" y="60" width="26" height="22" fill="#e2e8f0" stroke="#7f1d1d" strokeWidth="2" />
      </g>
      <path d="M270 250 Q344 226 420 250 L420 262 L270 262 Z" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
      {filings.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="8" height="3" rx="1" fill="#334155" transform={`rotate(${(i * 37) % 180} ${x + 4} ${y + 1.5})`}>
          <animate attributeName="y" values={`${y};${y};206;206;${y}`} keyTimes="0;0.3;0.5;0.85;1" dur="3s" begin={`${-i * 0.05}s`} repeatCount="indefinite" />
        </rect>
      ))}
      <text x="344" y="296" textAnchor="middle" fontSize="13" fontWeight="900" fill="#7f1d1d" fontFamily="Georgia, serif">
        separação magnética
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Substâncias e misturas vistas de pertinho
// ---------------------------------------------------------------------------

function ZoomCircle({ cx, title, sub, children }: { cx: number; title: string; sub: string; children: React.ReactNode }) {
  return (
    <g>
      <circle cx={cx} cy="78" r="60" fill="#fffaf0" stroke="#a21caf" strokeWidth="2.5" />
      <g>{children}</g>
      <text x={cx} y="160" textAnchor="middle" fontSize="13" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
        {title}
      </text>
      <text x={cx} y="176" textAnchor="middle" fontSize="11.5" fontStyle="italic" fill="#6b5a3a" fontFamily="Georgia, serif">
        {sub}
      </text>
    </g>
  );
}

function SubstancesArt() {
  const drift = (i: number) => ({ className: "cg-anim-aura-drift", style: { "--cg-dur": `${2.5 + (i % 3) * 0.7}s`, animationDelay: `${-i * 0.5}s` } as React.CSSProperties });
  return (
    <Art viewBox="0 0 620 185" label="De pertinho: substância simples (oxigênio), substância composta (água), mistura homogênea (água com açúcar) e mistura heterogênea (água com areia)">
      <ZoomCircle cx={80} title="Substância simples" sub="gás oxigênio (O₂)">
        {[
          [60, 54], [100, 60], [72, 94], [104, 100],
        ].map(([x, y], i) => (
          <g key={i} {...drift(i)}>
            <Diatomic el="O" x={x} y={y} s={0.75} />
          </g>
        ))}
      </ZoomCircle>
      <ZoomCircle cx={235} title="Substância composta" sub="água (H₂O)">
        {[
          [214, 56], [256, 62], [222, 98], [262, 100],
        ].map(([x, y], i) => (
          <g key={i} {...drift(i)}>
            <Water x={x} y={y} s={0.6} label={false} />
          </g>
        ))}
      </ZoomCircle>
      <ZoomCircle cx={390} title="Mistura homogênea" sub="água com açúcar">
        {[
          [366, 52], [406, 54], [376, 92], [414, 96], [392, 74],
        ].map(([x, y], i) => (
          <g key={i} {...drift(i)}>
            {i % 2 ? <rect x={x - 8} y={y - 6} width="16" height="12" rx="3" fill="#f8fafc" stroke="#94a3b8" /> : <Water x={x} y={y} s={0.5} label={false} />}
          </g>
        ))}
      </ZoomCircle>
      <ZoomCircle cx={545} title="Mistura heterogênea" sub="água com areia">
        <rect x="490" y="98" width="110" height="38" fill="#fde68a" opacity="0.9" />
        {[
          [520, 62], [560, 56], [540, 82],
        ].map(([x, y], i) => (
          <g key={i} {...drift(i)}>
            <Water x={x} y={y} s={0.5} label={false} />
          </g>
        ))}
        {[505, 525, 545, 565, 585, 515, 555, 575].map((x, i) => (
          <circle key={i} cx={x} cy={112 + (i % 3) * 7} r="4" fill="#b45309" />
        ))}
      </ZoomCircle>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os métodos de separar misturas
// ---------------------------------------------------------------------------

function SeparationMethodsArt() {
  const panel = (i: number, title: string, body: React.ReactNode) => (
    <g key={title} transform={`translate(${i * 150} 0)`}>
      <rect x="6" y="6" width="138" height="180" rx="12" fill="#fffaf0" stroke="#d9c79d" strokeWidth="2" />
      {body}
      <text x="75" y="176" textAnchor="middle" fontSize="13" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
        {title}
      </text>
    </g>
  );
  return (
    <Art viewBox="0 0 600 192" label="Métodos de separação: filtração, decantação, evaporação e destilação">
      {panel(
        0,
        "Filtração",
        <g>
          <path d="M40 30 L110 30 L80 80 L80 96 L70 96 L70 80 Z" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
          <path d="M50 34 L100 34 L75 72 Z" fill="#78350f" opacity="0.8" />
          <circle cx="75" cy="104" r="3" fill="#b45309">
            <animate attributeName="cy" values="100;136" dur="1s" repeatCount="indefinite" />
          </circle>
          <path d="M48 120 L102 120 L102 150 Q102 156 96 156 L54 156 Q48 156 48 150 Z" fill="#b45309" opacity="0.6" stroke="#64748b" strokeWidth="2" />
        </g>,
      )}
      {panel(
        1,
        "Decantação",
        <g>
          <path d="M40 40 L110 40 L110 150 Q110 158 102 158 L48 158 Q40 158 40 150 Z" fill="#7dd3fc" opacity="0.7" stroke="#64748b" strokeWidth="2" />
          {[52, 64, 76, 88, 100, 58, 82, 94].map((x, i) => (
            <circle key={i} cx={x} cy="150" r="4" fill="#b45309">
              <animate attributeName="cy" values={`${60 + (i % 4) * 10};150;150`} keyTimes="0;0.6;1" dur="4s" begin={`${-i * 0.2}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>,
      )}
      {panel(
        2,
        "Evaporação",
        <g>
          <circle cx="110" cy="38" r="14" fill="#fbbf24" className="cg-anim-glow" />
          <path d="M24 130 L126 130 L118 150 L32 150 Z" fill="#7dd3fc" opacity="0.8" stroke="#64748b" strokeWidth="2" />
          {[44, 60, 76, 92, 108].map((x) => (
            <path key={x} d={`M${x} 146 l3 -6 l3 6 Z`} fill="#fff" stroke="#94a3b8" strokeWidth="0.8" />
          ))}
          {[50, 75, 100].map((x, i) => (
            <path key={x} d={`M${x} 124 c-6 -8 6 -14 0 -22`} stroke="#94a3b8" strokeWidth="3" fill="none" className="cg-anim-aura-rise" style={{ "--cg-dur": "2.2s", "--cg-delay": `${i * 0.7}s` } as React.CSSProperties} />
          ))}
        </g>,
      )}
      {panel(
        3,
        "Destilação",
        <g>
          <path d="M30 120 L50 80 L60 80 L80 120 Z" fill="#c084fc" opacity="0.7" stroke="#64748b" strokeWidth="2" />
          <path d="M55 80 L55 66 L120 92" stroke="#64748b" strokeWidth="5" fill="none" />
          <path d="M70 70 L110 86" stroke="#7dd3fc" strokeWidth="9" opacity="0.6" />
          <path d="M108 104 L134 104 L134 140 L108 140 Z" fill="#e0f2fe" stroke="#64748b" strokeWidth="2" />
          <circle cx="121" cy="98" r="3" fill="#38bdf8">
            <animate attributeName="cy" values="94;130" dur="1.3s" repeatCount="indefinite" />
          </circle>
          <g transform="translate(55 140)">
            <path d="M0 -12 C6 -4 6 2 0 6 C-6 2 -6 -4 0 -12 Z" fill="#60a5fa" className="cg-anim-flicker" />
          </g>
        </g>,
      )}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As ligações: iônica (o elétron pula) e covalente (os elétrons são divididos)
// ---------------------------------------------------------------------------

function BondsArt() {
  const loop = { dur: "4s", repeatCount: "indefinite" };
  return (
    <Art viewBox="0 0 560 210" label="Ligação iônica: o sódio dá um elétron ao cloro e os íons se atraem. Ligação covalente: na água, o oxigênio e os hidrogênios dividem elétrons">
      <rect x="4" y="4" width="290" height="202" rx="14" fill="#faf5ff" stroke="#e9d5ff" strokeWidth="2" />
      <text x="149" y="26" textAnchor="middle" fontSize="14" fontWeight="900" fill="#6b21a8" fontFamily="Georgia, serif">
        Ligação iônica (NaCl)
      </text>
      <Ball el="Na" x={80} y={100} r={30} />
      <Ball el="Cl" x={220} y={100} r={36} />
      {/* o elétron pulando do sódio pro cloro */}
      <circle r="6" fill="#3b82f6" stroke="#fff" strokeWidth="1.5">
        <animateMotion path="M108 80 C140 50 170 50 196 74" keyPoints="0;0;1;1" keyTimes="0;0.2;0.5;1" calcMode="linear" {...loop} />
      </circle>
      <g fontFamily="Georgia, serif" fontWeight="900" fontSize="22">
        <text x="80" y="58" textAnchor="middle" fill="#7e22ce" opacity="0">
          <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.5;0.55;1" {...loop} />+
        </text>
        <text x="220" y="52" textAnchor="middle" fill="#15803d" opacity="0">
          <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.5;0.55;1" {...loop} />−
        </text>
      </g>
      <text x="149" y="168" textAnchor="middle" fontSize="12" fill="#3b0764" fontFamily="Georgia, serif">
        o sódio perde 1 elétron (Na⁺) e o cloro
      </text>
      <text x="149" y="184" textAnchor="middle" fontSize="12" fill="#3b0764" fontFamily="Georgia, serif">
        ganha (Cl⁻): as cargas opostas se atraem
      </text>
      <rect x="306" y="4" width="250" height="202" rx="14" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="2" />
      <text x="431" y="26" textAnchor="middle" fontSize="14" fontWeight="900" fill="#1e40af" fontFamily="Georgia, serif">
        Ligação covalente (H₂O)
      </text>
      <g transform="translate(431 100)">
        <circle cx="-40" cy="26" r="26" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" opacity="0.8" />
        <circle cx="40" cy="26" r="26" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" opacity="0.8" />
        <circle r="36" fill="#fecaca" stroke="#b91c1c" strokeWidth="2" opacity="0.85" />
        <text y="8" textAnchor="middle" fontSize="22" fontWeight="900" fill="#b91c1c" fontFamily="Georgia, serif">
          O
        </text>
        <text x="-46" y="34" textAnchor="middle" fontSize="16" fontWeight="900" fill="#475569" fontFamily="Georgia, serif">
          H
        </text>
        <text x="46" y="34" textAnchor="middle" fontSize="16" fontWeight="900" fill="#475569" fontFamily="Georgia, serif">
          H
        </text>
        {/* os pares de elétrons divididos */}
        {[
          [-26, 14], [-20, 22], [26, 14], [20, 22],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4.5" fill="#3b82f6" stroke="#fff" strokeWidth="1" className="cg-anim-glow" style={{ animationDelay: `${i * 0.3}s` }} />
        ))}
      </g>
      <text x="431" y="176" textAnchor="middle" fontSize="12" fill="#1e3a8a" fontFamily="Georgia, serif">
        os átomos compartilham pares de elétrons
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O detergente: a cabeça gosta de água, a cauda gosta de gordura
// ---------------------------------------------------------------------------

function DetergentArt() {
  const molecules = Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2);
  return (
    <Art viewBox="0 0 540 210" label="A molécula de detergente tem uma cabeça que se mistura com a água e uma cauda que se mistura com o óleo; várias delas cercam a gota de óleo">
      {/* uma molécula sozinha */}
      <g transform="translate(70 70)">
        <path d="M14 0 C30 -8 44 8 60 0 S88 -8 100 0" stroke="#a16207" strokeWidth="4" fill="none" />
        <circle r="13" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="2" />
        <text x="0" y="40" textAnchor="middle" fontSize="11.5" fontWeight="900" fill="#1e3a8a" fontFamily="Georgia, serif">
          cabeça: gosta de água
        </text>
        <text x="74" y="-16" textAnchor="middle" fontSize="11.5" fontWeight="900" fill="#92400e" fontFamily="Georgia, serif">
          cauda: gosta de gordura
        </text>
      </g>
      {/* a micela prendendo a gota de óleo, girando devagar */}
      <rect x="250" y="10" width="280" height="190" rx="16" fill="#e0f2fe" />
      <g transform="translate(390 105)">
        <circle r="34" fill="#fde047" stroke="#ca8a04" strokeWidth="2" className="cg-anim-glow" />
        <text y="5" textAnchor="middle" fontSize="12" fontWeight="900" fill="#713f12" fontFamily="Georgia, serif">
          óleo
        </text>
        <g className="cg-anim-orbit-rev" style={{ "--cg-dur": "24s" } as React.CSSProperties}>
          {molecules.map((a, i) => (
            <g key={i} transform={`rotate(${(a * 180) / Math.PI})`}>
              <path d="M30 0 C40 -4 46 4 54 0" stroke="#a16207" strokeWidth="3" fill="none" />
              <circle cx="62" r="9" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="1.5" />
            </g>
          ))}
        </g>
      </g>
      <text x="390" y="194" textAnchor="middle" fontSize="12" fontWeight="700" fill="#075985" fontFamily="Georgia, serif">
        a água leva a gota embora
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
      title="Substâncias, Misturas e Ligações"
      goals={["A diferença entre substância pura e mistura", "Como separar os componentes de uma mistura", "O que são as ligações iônica e covalente", "Por que o óleo e a água não se misturam"]}
    >
      <Fig h={34}>
        <SeparationOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🧪">Substâncias puras e misturas</H>
      <P>
        Uma <T>substância pura</T> é formada por um só tipo de partícula e tem uma <T>fórmula</T>: a água é H₂O (dois hidrogênios e um oxigênio); o sal de cozinha é NaCl
        (cloreto de sódio). Ela pode ser <T>simples</T>, com um só elemento (o O₂), ou <T>composta</T>, com elementos diferentes (a H₂O).
      </P>
      <Fig n="3.1" caption="Vistas de pertinho: as substâncias têm um tipo só de partícula; as misturas, mais de um." h={22}>
        <SubstancesArt />
      </Fig>
      <List
        items={[
          <>
            Na <T>mistura homogênea</T>, não dá para ver as partes: parece uma coisa só (água com açúcar, o ar).
          </>,
          <>
            Na <T>mistura heterogênea</T>, dá para ver mais de uma <em>fase</em> (água com areia, água com óleo).
          </>,
        ]}
      />
      <Box kind="atencao">A água do mar e o ar parecem uma coisa só, mas são misturas: a água do mar tem vários sais dissolvidos, e o ar é uma mistura de gases. A água destilada é que é substância pura.</Box>
    </>,
  ),

  page(
    <>
      <H icon="⚗️">Separando as misturas</H>
      <P>Para separar os componentes de uma mistura, os químicos escolhem o método de acordo com o que está misturado:</P>
      <Fig n="3.2" caption="Quatro métodos de separação usados no laboratório e no dia a dia." h={22}>
        <SeparationMethodsArt />
      </Fig>
      <Table
        head={["Método", "Como funciona", "Exemplo"]}
        rows={[
          ["Filtração", "O filtro segura o sólido e deixa o líquido passar", "Coar o café"],
          ["Decantação", "O sólido mais denso vai para o fundo", "Água barrenta parada"],
          ["Separação magnética", "O ímã atrai o metal", "Limalha de ferro na areia"],
          ["Evaporação", "O líquido evapora e o sólido fica", "O sal das salinas"],
          ["Destilação", "Ferve, o vapor esfria e vira líquido de novo", "Água destilada"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🔗">As ligações químicas</H>
      <P>
        Os átomos se juntam por meio das <T>ligações químicas</T>, trocando ou dividindo elétrons para ficarem mais estáveis, com a camada de fora completa (como os gases
        nobres).
      </P>
      <Fig n="3.3" caption="Na ligação iônica, o elétron passa de um átomo para o outro; na covalente, os elétrons são divididos." h={26}>
        <BondsArt />
      </Fig>
      <List
        items={[
          <>
            <T>Ligação iônica</T>: um átomo <em>perde</em> elétrons e o outro <em>ganha</em>, formando íons de cargas opostas que se atraem. Acontece entre metais e ametais,
            como no NaCl.
          </>,
          <>
            <T>Ligação covalente</T>: os átomos <em>compartilham</em> pares de elétrons. Acontece entre ametais, como na água e no gás oxigênio.
          </>,
          <>
            <T>Ligação metálica</T>: nos metais, os elétrons ficam livres, num &ldquo;mar de elétrons&rdquo;. Por isso os metais conduzem eletricidade.
          </>,
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🧴">Por que o óleo não se mistura com a água?</H>
      <P>
        Algumas moléculas têm um lado mais positivo e outro mais negativo: são <T>polares</T>, como a água. Outras não têm esses polos: são <T>apolares</T>, como o óleo. A regra
        é: <T>semelhante dissolve semelhante</T>. Polar se mistura com polar; apolar, com apolar. Por isso o óleo fica separado da água.
      </P>
      <Fig n="3.4" caption="O detergente tem uma parte de cada tipo: a cauda prende a gordura e a cabeça fica na água, que leva tudo embora." h={24}>
        <DetergentArt />
      </Fig>
      <P>
        O <T>detergente</T> e o sabão conseguem juntar os dois: a molécula deles tem uma <em>cabeça polar</em>, que gosta de água, e uma <em>cauda apolar</em>, que gosta de
        gordura. Várias moléculas cercam a gotinha de óleo, formando uma <T>micela</T>, e a água leva a sujeira embora.
      </P>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Substância pura tem um só tipo de partícula e fórmula própria (H₂O, NaCl); mistura tem mais de uma.",
          "Mistura homogênea parece uma coisa só; a heterogênea tem fases visíveis.",
          "Separação: filtração, decantação, ímã, evaporação e destilação.",
          "Ligação iônica: um átomo dá elétrons ao outro. Covalente: os átomos dividem elétrons.",
          "Semelhante dissolve semelhante: o óleo (apolar) não se mistura com a água (polar).",
        ]}
      />
      <Glossary
        items={[
          ["Fórmula", "A receita da substância: quais átomos e quantos (H₂O)."],
          ["Fase", "Cada parte que dá para distinguir numa mistura."],
          ["Íon", "Átomo que ganhou ou perdeu elétrons e ficou com carga."],
          ["Polar", "Molécula com um lado positivo e outro negativo, como a água."],
          ["Micela", "Bolinha de moléculas de sabão em volta da gordura."],
        ]}
      />
      <Quiz
        items={[
          ["Água com areia é que tipo de mistura?", "Heterogênea: dá para ver as duas fases."],
          ["Qual método separa o pó de café da bebida pronta?", "A filtração."],
          ["Como o sal é separado da água do mar nas salinas?", "Por evaporação: o sol evapora a água e o sal fica."],
          ["Que tipo de ligação une o hidrogênio e o oxigênio na água?", "Ligação covalente: eles compartilham elétrons."],
        ]}
      />
    </>,
  ),
];
