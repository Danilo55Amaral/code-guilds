"use client";

import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Planet, Stars } from "./art";

// ============================================================================
// CAPÍTULO 4 — AS LUAS DO SISTEMA SOLAR (missão "Astronomia: As Luas do
// Sistema Solar"): as luas de Galileu girando em volta de Júpiter, o choque
// de Theia que formou a nossa Lua, Io soltando lava, Europa com o oceano
// embaixo do gelo, Titã com a sonda Huygens descendo, Encélado lançando
// jatos e Plutão e Caronte girando em volta de um ponto entre eles.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: as luas de Galileu girando em volta de Júpiter
// ---------------------------------------------------------------------------

function GalileanOpenerArt() {
  const moons = [
    ["Io", 80, 4, "#fde047"],
    ["Europa", 110, 7, "#f5f5f4"],
    ["Ganimedes", 140, 11, "#a8a29e"],
    ["Calisto", 170, 16, "#78716c"],
  ] as const;
  return (
    <Art viewBox="0 0 460 300" label="Júpiter com as suas quatro grandes luas, Io, Europa, Ganimedes e Calisto, girando em volta dele">
      <rect width="460" height="300" fill="#020617" />
      <Stars w={460} h={300} n={50} seed={4} />
      {moons.map(([name, rx, dur, color], i) => {
        const ry = (rx as number) * 0.35;
        const path = `M${230 + (rx as number)} 150 A${rx} ${ry} 0 1 1 ${230 - (rx as number)} 150 A${rx} ${ry} 0 1 1 ${230 + (rx as number)} 150`;
        return (
          <g key={name}>
            <ellipse cx="230" cy="150" rx={rx} ry={ry} fill="none" stroke="#334155" />
            <g>
              <animateMotion path={path} dur={`${dur}s`} begin={`${-i * 2}s`} repeatCount="indefinite" />
              <circle r={5 + i * 1.5} fill={color as string} />
            </g>
          </g>
        );
      })}
      <Planet x={230} y={150} r={48} color="#fde7c4" dark="#b45309" bands="#92400e" />
      <ellipse cx="248" cy="166" rx="10" ry="5" fill="#dc2626" />
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A origem da nossa Lua: o choque de Theia
// ---------------------------------------------------------------------------

function GiantImpactArt() {
  const loop = { dur: "9s", repeatCount: "indefinite" };
  return (
    <Art viewBox="0 0 560 220" label="Um planeta do tamanho de Marte, chamado Theia, bate na Terra jovem; os pedaços formam um anel em volta dela, que se junta e vira a Lua">
      <rect width="560" height="220" rx="14" fill="#020617" />
      <Stars w={560} h={220} n={30} seed={17} />
      {/* a Terra jovem, quente */}
      <circle cx="280" cy="110" r="56" fill="#b45309" />
      <circle cx="280" cy="110" r="56" fill="#ef4444" opacity="0.4" className="cg-anim-glow" />
      {/* Theia chegando */}
      <circle r="24" fill="#78716c">
        <animateMotion values="40,30;230,80;230,80" keyTimes="0;0.25;1" calcMode="linear" {...loop} />
        <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.25;0.27;1" {...loop} />
      </circle>
      {/* o clarão */}
      <circle cx="236" cy="84" r="10" fill="#fef9c3" opacity="0">
        <animate attributeName="r" values="10;10;60;60" keyTimes="0;0.25;0.35;1" {...loop} />
        <animate attributeName="opacity" values="0;0;0.9;0;0" keyTimes="0;0.25;0.28;0.4;1" {...loop} />
      </circle>
      {/* o anel de pedaços */}
      <g opacity="0">
        <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.3;0.4;0.65;0.75;1" {...loop} />
        <g transform="translate(280 110)">
          <g>
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="5s" repeatCount="indefinite" />
            {Array.from({ length: 30 }, (_, i) => {
              const a = (i / 30) * Math.PI * 2;
              return <circle key={i} cx={Math.cos(a) * 100} cy={Math.sin(a) * 34} r={2 + (i % 3)} fill="#a8a29e" />;
            })}
          </g>
        </g>
      </g>
      {/* a Lua formada */}
      <circle cx="410" cy="70" r="16" fill="#d4d4d8" opacity="0">
        <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.68;0.78;1" {...loop} />
      </circle>
      <g fontFamily="Georgia, serif" fontSize="12" fontWeight="900">
        <text x="40" y="200" fill="#a8a29e">Theia</text>
        <text x="280" y="200" textAnchor="middle" fill="#fdba74">Terra jovem</text>
        <text x="440" y="60" fill="#e4e4e7">a Lua</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As luas de Júpiter: Io, Europa, Ganimedes e Calisto
// ---------------------------------------------------------------------------

function JupiterMoonsArt() {
  return (
    <Art viewBox="0 0 600 220" label="Io com vulcões soltando lava, Europa com um oceano escondido embaixo do gelo, Ganimedes, a maior lua, e Calisto cheia de crateras">
      <rect width="600" height="220" rx="14" fill="#020617" />
      {/* Io e os vulcões */}
      <g transform="translate(80 110)">
        <circle r="44" fill="#facc15" />
        {[
          [-14, -10, "#ea580c"], [12, 14, "#b91c1c"], [-4, 24, "#92400e"],
        ].map(([x, y, c], i) => (
          <circle key={i} cx={x as number} cy={y as number} r="6" fill={c as string} />
        ))}
        {[0, 1].map((k) => (
          <path key={k} d={`M${-8 + k * 22} -40 q-6 -16 0 -30`} stroke="#fb923c" strokeWidth="4" fill="none" className="cg-anim-aura-rise" style={{ "--cg-dur": "1.8s", "--cg-delay": `${k * 0.9}s` } as React.CSSProperties} />
        ))}
        <text y="70" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#fde047" fontFamily="Georgia, serif">
          Io: vulcões
        </text>
      </g>
      {/* Europa por dentro */}
      <g transform="translate(225 110)">
        <circle r="44" fill="#38bdf8" />
        <circle r="30" fill="#78716c" />
        <path d="M0 -44 A44 44 0 0 0 -44 0 L-34 0 A34 34 0 0 1 0 -34 Z" fill="#f5f5f4" />
        <path d="M0 -44 A44 44 0 0 1 44 0 L0 0 Z" fill="#f5f5f4" />
        <path d="M10 -30 L30 -14 M4 -20 L24 -36" stroke="#b45309" strokeWidth="1.5" />
        <text y="70" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#7dd3fc" fontFamily="Georgia, serif">
          Europa: oceano sob o gelo
        </text>
      </g>
      {/* Ganimedes × Mercúrio */}
      <g transform="translate(380 110)">
        <circle r="50" fill="#a8a29e" />
        <path d="M-30 -20 C-10 -30 10 -10 30 -24 M-36 10 C-10 4 20 20 40 6" stroke="#78716c" strokeWidth="5" fill="none" />
        <circle cx="62" cy="34" r="46" fill="none" stroke="#fde68a" strokeDasharray="4 4" />
        <text y="74" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#e7e5e4" fontFamily="Georgia, serif">
          Ganimedes: a maior
        </text>
      </g>
      {/* Calisto */}
      <g transform="translate(530 110)">
        <circle r="40" fill="#57534e" />
        {Array.from({ length: 10 }, (_, i) => (
          <circle key={i} cx={((i * 23) % 60) - 30} cy={((i * 31) % 60) - 30} r="3" fill="#d6d3d1" opacity="0.7" />
        ))}
        <text y="66" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#d6d3d1" fontFamily="Georgia, serif">
          Calisto
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As luas de Saturno: Titã, Encélado e Mimas
// ---------------------------------------------------------------------------

function SaturnMoonsArt() {
  return (
    <Art viewBox="0 0 600 220" label="Titã com a atmosfera laranja e a sonda Huygens descendo de paraquedas, Encélado lançando jatos de água pelo polo sul, e Mimas com uma cratera gigante">
      <rect width="600" height="220" rx="14" fill="#020617" />
      {/* Titã e a sonda Huygens */}
      <g transform="translate(110 120)">
        <circle r="56" fill="#f59e0b" />
        <circle r="62" fill="#fbbf24" opacity="0.35" />
        <ellipse cx="-14" cy="20" rx="14" ry="6" fill="#1e293b" opacity="0.6" />
        <g>
          <animateTransform attributeName="transform" type="translate" values="40 -110;10 -64;10 -64" keyTimes="0;0.8;1" dur="5s" repeatCount="indefinite" />
          <path d="M-14 -16 Q0 -30 14 -16 Z" fill="#f8fafc" />
          <path d="M-12 -16 L0 0 L12 -16" stroke="#e2e8f0" strokeWidth="1" fill="none" />
          <circle r="4" fill="#94a3b8" />
        </g>
        <text y="84" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#fbbf24" fontFamily="Georgia, serif">
          Titã (e a Huygens, 2005)
        </text>
      </g>
      {/* Encélado e os jatos */}
      <g transform="translate(310 100)">
        <circle r="40" fill="#f8fafc" />
        <path d="M-20 22 L-10 30 M0 34 L4 26 M12 30 L22 22" stroke="#7dd3fc" strokeWidth="2" />
        {[-12, 0, 12].map((x, i) => (
          <path key={x} d={`M${x} 40 q${x / 3} 30 ${x / 2} 64`} stroke="#bae6fd" strokeWidth="4" fill="none" strokeDasharray="6 6" className="cg-anim-dash" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
        <text y="-52" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#e0f2fe" fontFamily="Georgia, serif">
          Encélado: jatos de água
        </text>
      </g>
      {/* Mimas */}
      <g transform="translate(500 110)">
        <circle r="46" fill="#a8a29e" />
        <circle cx="-16" cy="-6" r="16" fill="#78716c" stroke="#d6d3d1" strokeWidth="2" />
        <circle cx="-16" cy="-6" r="4" fill="#d6d3d1" />
        <text y="72" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#d6d3d1" fontFamily="Georgia, serif">
          Mimas: a cratera Herschel
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Plutão e Caronte girando em volta de um ponto entre eles
// ---------------------------------------------------------------------------

function PlutoCharonArt() {
  return (
    <Art viewBox="0 0 560 210" label="Plutão e a sua lua Caronte girando em volta de um ponto entre os dois; ao lado, Marte com as luas Fobos e Deimos">
      <rect width="560" height="210" rx="14" fill="#020617" />
      <Stars w={560} h={210} n={30} seed={23} />
      <g transform="translate(160 105)">
        <circle r="3" fill="#fde047" />
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="6s" repeatCount="indefinite" />
          <circle cx="-34" r="26" fill="#e7e5e4" />
          <path d="M-46 -4 C-40 -14 -26 -10 -24 2 C-30 8 -42 6 -46 -4 Z" fill="#fde68a" opacity="0.8" />
          <circle cx="66" r="14" fill="#a8a29e" />
        </g>
        <text y="80" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#e7e5e4" fontFamily="Georgia, serif">
          Plutão e Caronte
        </text>
      </g>
      {/* Marte, Fobos e Deimos */}
      <g transform="translate(420 105)">
        <Planet r={30} color="#fb923c" dark="#7c2d12" />
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3s" repeatCount="indefinite" />
          <ellipse cx="48" rx="7" ry="5" fill="#a8a29e" />
        </g>
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="8s" repeatCount="indefinite" />
          <ellipse cx="-74" rx="5" ry="4" fill="#d6d3d1" />
        </g>
        <text y="80" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#fdba74" fontFamily="Georgia, serif">
          Marte: Fobos e Deimos
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
      title="As Luas do Sistema Solar"
      goals={["Como a nossa Lua provavelmente se formou", "As quatro grandes luas de Júpiter", "As luas de Saturno: Titã, Encélado e Mimas", "Luas curiosas de Marte, Plutão e Netuno"]}
    >
      <Fig h={34}>
        <GalileanOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="💥">A origem da nossa Lua</H>
      <P>
        A hipótese mais aceita é a do <T>grande impacto</T>: há cerca de 4,5 bilhões de anos, um corpo do tamanho de Marte, chamado <T>Theia</T>, bateu na Terra jovem. Os
        pedaços lançados ao espaço formaram um anel em volta da Terra, que foi se juntando até virar a Lua.
      </P>
      <Fig n="4.1" caption="O choque de Theia e o nascimento da Lua." h={24}>
        <GiantImpactArt />
      </Fig>
      <P>
        Uma <T>lua</T> (ou satélite natural) é um astro que gira em volta de um planeta. A Terra tem uma; Marte, duas; e os gigantes têm dezenas, até centenas!
      </P>
    </>,
  ),

  page(
    <>
      <H icon="🔥">As luas de Júpiter</H>
      <P>
        Em <T>1610</T>, Galileu descobriu as quatro maiores luas de Júpiter, as <T>luas galileanas</T>. Foi uma prova de que nem tudo gira em volta da Terra.
      </P>
      <Fig n="4.2" caption="As luas galileanas, cada uma com uma personalidade." h={24}>
        <JupiterMoonsArt />
      </Fig>
      <List
        items={[
          <>
            <T>Io</T>: o lugar com mais vulcões ativos do Sistema Solar. A gravidade de Júpiter &ldquo;aperta&rdquo; Io o tempo todo, e esse calor alimenta os vulcões.
          </>,
          <>
            <T>Europa</T>: tem um oceano de água salgada escondido embaixo de uma crosta de gelo. É um dos lugares mais promissores para procurar vida!
          </>,
          <>
            <T>Ganimedes</T>: a maior lua do Sistema Solar, maior até que o planeta Mercúrio, e a única lua com campo magnético próprio.
          </>,
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="💧">As luas de Saturno</H>
      <Fig n="4.3" caption="Titã, Encélado e Mimas." h={24}>
        <SaturnMoonsArt />
      </Fig>
      <List
        items={[
          <>
            <T>Titã</T>: a única lua com atmosfera grossa, e tem lagos de metano líquido. A sonda <T>Huygens</T> pousou lá em 2005.
          </>,
          <>
            <T>Encélado</T>: lança jatos de água para o espaço por rachaduras no gelo do polo sul, descobertos pela sonda Cassini.
          </>,
          <>
            <T>Mimas</T>: tem uma cratera tão grande, a <T>Herschel</T> (um terço do diâmetro dela), que lembra a Estrela da Morte de Star Wars.
          </>,
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🌀">Luas curiosas</H>
      <Fig n="4.4" caption="Plutão e Caronte giram em volta de um ponto entre eles; Fobos e Deimos são pequenas e irregulares." h={22}>
        <PlutoCharonArt />
      </Fig>
      <Cards
        items={[
          { icon: "😨", title: "Fobos e Deimos", text: "As luas de Marte: os nomes significam “medo” e “terror”, os filhos de Ares (Marte) na mitologia grega." },
          { icon: "💞", title: "Caronte", text: "A maior lua de Plutão tem metade do diâmetro dele: os dois giram em volta de um ponto entre eles." },
          { icon: "↩️", title: "Tritão", text: "A lua de Netuno gira ao contrário da rotação do planeta: deve ter sido capturada pela gravidade dele." },
          { icon: "🌕", title: "A nossa Lua", text: "É a quinta maior lua do Sistema Solar, e a única onde os humanos já pisaram." },
        ]}
      />
      <Box kind="sabia">Saturno tem mais de 200 luas confirmadas, e Júpiter vem logo atrás. Muitas são pequenas rochas capturadas pela gravidade dos gigantes.</Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "A Lua provavelmente se formou do choque de Theia com a Terra jovem.",
          "Luas de Júpiter: Io (vulcões), Europa (oceano sob o gelo), Ganimedes (a maior) e Calisto.",
          "Luas de Saturno: Titã (atmosfera e lagos de metano), Encélado (jatos de água) e Mimas (cratera Herschel).",
          "Marte tem Fobos e Deimos; Plutão e Caronte giram em volta de um ponto entre eles; Tritão gira ao contrário.",
        ]}
      />
      <Glossary
        items={[
          ["Satélite natural", "Astro que gira em volta de um planeta (uma lua)."],
          ["Luas galileanas", "As quatro maiores luas de Júpiter, vistas por Galileu."],
          ["Theia", "O corpo que teria batido na Terra e formado a Lua."],
          ["Órbita retrógrada", "Girar no sentido contrário ao da rotação do planeta."],
          ["Sonda espacial", "Nave robô enviada para estudar outros astros."],
        ]}
      />
      <Quiz
        items={[
          ["Qual é a maior lua do Sistema Solar?", "Ganimedes, de Júpiter."],
          ["Qual lua tem um oceano escondido embaixo do gelo?", "Europa, de Júpiter."],
          ["Qual lua de Saturno tem atmosfera grossa e lagos de metano?", "Titã."],
          ["Como se chamam as luas de Marte?", "Fobos e Deimos."],
        ]}
      />
    </>,
  ),
];
