"use client";

import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Earth, Stars } from "./art";

// ============================================================================
// CAPÍTULO 7 — TELESCÓPIOS E A LUZ (missão "Astronomia: Telescópios e a
// Luz"): a cúpula do observatório girando e abrindo, a luneta (lentes) × o
// telescópio refletor (espelhos), o espectro da luz do rádio aos raios gama,
// os grandes observatórios e o Hubble, e a espectroscopia (as linhas de cada
// elemento e o desvio para o vermelho).
// ============================================================================

const RAINBOW = ["#ef4444", "#f97316", "#facc15", "#22c55e", "#3b82f6", "#6366f1", "#a855f7"];

// ---------------------------------------------------------------------------
// Abertura: a cúpula do observatório
// ---------------------------------------------------------------------------

function ObservatoryOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Um observatório no alto da montanha, com a cúpula abrindo e o telescópio apontado para as estrelas">
      <rect width="460" height="300" fill="#020617" />
      <Stars w={460} h={220} n={70} seed={47} />
      <path d="M0 250 L120 180 L200 220 L300 160 L460 230 L460 300 L0 300 Z" fill="#1e293b" />
      <g transform="translate(230 200)">
        <rect x="-60" y="0" width="120" height="50" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
        <path d="M-64 0 A64 64 0 0 1 64 0 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
        {/* a fenda abrindo */}
        <rect x="-10" y="-62" width="20" height="62" fill="#020617">
          <animate attributeName="width" values="0;20;20;0" keyTimes="0;0.2;0.85;1" dur="8s" repeatCount="indefinite" />
          <animate attributeName="x" values="0;-10;-10;0" keyTimes="0;0.2;0.85;1" dur="8s" repeatCount="indefinite" />
        </rect>
        <g>
          <animateTransform attributeName="transform" type="rotate" values="-10 0 -10;10 0 -10;-10 0 -10" dur="8s" repeatCount="indefinite" />
          <rect x="-6" y="-80" width="12" height="60" rx="3" fill="#475569" />
        </g>
        <rect x="-14" y="20" width="28" height="30" fill="#94a3b8" />
      </g>
      <path d="M230 120 L300 30" stroke="#fde68a" strokeWidth="1.5" strokeDasharray="5 6" className="cg-anim-dash" />
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Luneta (lentes) × telescópio refletor (espelhos)
// ---------------------------------------------------------------------------

function TelescopesArt() {
  return (
    <Art viewBox="0 0 600 220" label="A luneta usa lentes para juntar a luz; o telescópio refletor usa um espelho curvo no fundo do tubo">
      {/* a luneta */}
      <rect x="40" y="70" width="220" height="60" rx="6" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
      <path d="M50 64 Q62 100 50 136 Q38 100 50 64 Z" fill="#bae6fd" stroke="#0369a1" strokeWidth="2" />
      <path d="M250 84 Q256 100 250 116 Q244 100 250 84 Z" fill="#bae6fd" stroke="#0369a1" strokeWidth="2" />
      {[80, 100, 120].map((y) => (
        <path key={y} d={`M0 ${y} L50 ${y} L230 100 L280 ${100 + (100 - y) * 0.3}`} stroke="#fde047" strokeWidth="2.5" fill="none" strokeDasharray="8 6" className="cg-anim-dash" />
      ))}
      <text x="150" y="158" textAnchor="middle" fontSize="13" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
        Luneta (refratora): lentes
      </text>
      {/* o refletor newtoniano */}
      <rect x="330" y="60" width="240" height="80" rx="6" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
      <path d="M560 62 Q548 100 560 138" stroke="#64748b" strokeWidth="6" fill="none" />
      <rect x="380" y="92" width="16" height="16" fill="#94a3b8" transform="rotate(45 388 100)" />
      <rect x="380" y="40" width="16" height="22" fill="#475569" />
      {[76, 100, 124].map((y) => (
        <path key={y} d={`M300 ${y} L556 ${y} L388 100 L388 40`} stroke="#fde047" strokeWidth="2.5" fill="none" strokeDasharray="8 6" className="cg-anim-dash" />
      ))}
      <text x="450" y="166" textAnchor="middle" fontSize="13" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
        Refletor: espelho curvo
      </text>
      <text x="450" y="184" textAnchor="middle" fontSize="11.5" fill="#5b4a2e" fontFamily="Georgia, serif">
        (Newton construiu um em 1668)
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O espectro: do rádio aos raios gama
// ---------------------------------------------------------------------------

function SpectrumArt() {
  const bands = [
    ["Rádio", "#94a3b8", true],
    ["Micro-ondas", "#a8a29e", true],
    ["Infravermelho", "#fca5a5", false],
    ["Visível", "rainbow", true],
    ["Ultravioleta", "#c4b5fd", false],
    ["Raios X", "#93c5fd", false],
    ["Gama", "#a78bfa", false],
  ] as const;
  const wave = Array.from({ length: 140 }, (_, i) => {
    const x = 20 + i * 4;
    const f = 0.04 + (i / 140) ** 2 * 0.9;
    return `${x} ${(70 + 20 * Math.sin(i * 4 * f)).toFixed(1)}`;
  });
  return (
    <Art viewBox="0 0 600 230" label="O espectro eletromagnético, do rádio, com ondas longas, aos raios gama, com ondas curtíssimas; os olhos só veem a faixa visível">
      <path d={`M${wave.join(" L")}`} stroke="#4f46e5" strokeWidth="3" fill="none" strokeDasharray="10 4" className="cg-anim-dash" />
      {bands.map(([name, color], i) => {
        const x = 20 + i * 80;
        return (
          <g key={name}>
            {color === "rainbow" ? (
              RAINBOW.map((c, k) => <rect key={c} x={x + k * (76 / 7)} y="110" width={76 / 7 + 0.5} height="40" fill={c} />)
            ) : (
              <rect x={x} y="110" width="76" height="40" fill={color} />
            )}
            <text x={x + 38} y={i % 2 ? 182 : 166} textAnchor="middle" fontSize="11.5" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
              {name}
            </text>
          </g>
        );
      })}
      <g fontFamily="Georgia, serif" fontSize="12" fontWeight="900">
        <text x="20" y="30" fill="#4f46e5">ondas longas</text>
        <text x="580" y="30" textAnchor="end" fill="#4f46e5">ondas curtíssimas</text>
        <text x="300" y="200" textAnchor="middle" fill="#15803d">os olhos só veem a faixa visível</text>
        <text x="300" y="220" textAnchor="middle" fill="#b91c1c" fontWeight="700">raios X e boa parte do ultravioleta ficam presos na atmosfera</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os observatórios: o Atacama, os radiotelescópios e o Hubble
// ---------------------------------------------------------------------------

function ObservatoriesArt() {
  return (
    <Art viewBox="0 0 600 230" label="Os radiotelescópios do deserto do Atacama girando e o telescópio espacial Hubble em órbita da Terra">
      <rect width="600" height="230" rx="14" fill="#020617" />
      <Stars w={600} h={150} n={40} seed={53} />
      {/* o deserto e as antenas */}
      <path d="M0 230 L0 170 C80 150 200 160 320 168 L320 230 Z" fill="#b45309" />
      {[40, 110, 180, 250].map((x, i) => (
        <g key={x} transform={`translate(${x} 176)`}>
          <rect x="-3" y="0" width="6" height="22" fill="#e2e8f0" />
          <g>
            <animateTransform attributeName="transform" type="rotate" values="-20;20;-20" dur={`${6 + i}s`} repeatCount="indefinite" />
            <path d="M-24 -10 Q0 18 24 -10 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
            <line x1="0" y1="2" x2="0" y2="-20" stroke="#94a3b8" strokeWidth="2" />
          </g>
        </g>
      ))}
      <text x="160" y="220" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fef3c7" fontFamily="Georgia, serif">
        radiotelescópios no Atacama
      </text>
      {/* o Hubble em órbita */}
      <Earth x={470} y={150} r={60} />
      <ellipse cx="470" cy="150" rx="100" ry="40" fill="none" stroke="#475569" strokeDasharray="4 4" />
      <g>
        <animateMotion path="M570 150 A100 40 0 1 1 370 150 A100 40 0 1 1 570 150" dur="10s" repeatCount="indefinite" />
        <rect x="-10" y="-6" width="20" height="12" rx="2" fill="#cbd5e1" />
        <rect x="-24" y="-4" width="12" height="8" fill="#2563eb" />
        <rect x="12" y="-4" width="12" height="8" fill="#2563eb" />
      </g>
      <text x="470" y="40" textAnchor="middle" fontSize="12" fontWeight="900" fill="#bfdbfe" fontFamily="Georgia, serif">
        telescópio espacial Hubble (1990)
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A espectroscopia: as linhas de cada elemento e o desvio para o vermelho
// ---------------------------------------------------------------------------

function SpectroscopyArt() {
  const lines = [70, 150, 190, 260];
  return (
    <Art viewBox="0 0 600 220" label="O espectro de uma estrela tem linhas escuras que são a impressão digital dos elementos; numa galáxia se afastando, as linhas se deslocam para o vermelho">
      {/* o espectro com as linhas */}
      {[0, 1].map((row) => (
        <g key={row} transform={`translate(160 ${30 + row * 100})`}>
          <defs>
            <linearGradient id={`ast7-spec${row}`} x1="0" y1="0" x2="1" y2="0">
              {RAINBOW.slice()
                .reverse()
                .map((c, k) => (
                  <stop key={c} offset={k / 6} stopColor={c} />
                ))}
            </linearGradient>
          </defs>
          <rect width="400" height="50" fill={`url(#ast7-spec${row})`} />
          {lines.map((x) => (
            <rect key={x} x={x} y="0" width="4" height="50" fill="#0f172a">
              {row === 1 && <animate attributeName="x" values={`${x};${x + 40};${x}`} dur="4s" repeatCount="indefinite" />}
            </rect>
          ))}
        </g>
      ))}
      <g fontFamily="Georgia, serif" fontSize="12" fontWeight="900">
        <text x="10" y="54" fill="#3b2a14">estrela parada</text>
        <text x="10" y="70" fill="#5b4a2e" fontWeight="700">linhas do hidrogênio</text>
        <text x="10" y="154" fill="#b91c1c">galáxia se afastando</text>
        <text x="10" y="170" fill="#5b4a2e" fontWeight="700">linhas vão pro vermelho</text>
        <text x="160" y="214" fill="#6d28d9">violeta</text>
        <text x="560" y="214" textAnchor="end" fill="#b91c1c">vermelho</text>
      </g>
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
      title="Telescópios e a Luz"
      goals={["A diferença entre luneta e telescópio refletor", "As “cores” da luz que não enxergamos", "Por que os observatórios ficam no alto e no espaço", "Como descobrimos do que as estrelas são feitas"]}
    >
      <Fig h={34}>
        <ObservatoryOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🔭">Lunetas e telescópios</H>
      <P>
        Os instrumentos de observação servem para <T>juntar mais luz</T> do que o nosso olho consegue. A <T>luneta</T> (ou telescópio refrator) usa <T>lentes</T>: foi com uma
        delas que Galileu fez as suas descobertas. O <T>telescópio refletor</T> usa um <T>espelho curvo</T>, e o primeiro foi construído por Isaac Newton, em 1668.
      </P>
      <Fig n="7.1" caption="A luneta junta a luz com lentes; o refletor, com um espelho." h={24}>
        <TelescopesArt />
      </Fig>
      <P>
        Os grandes telescópios usam <T>espelhos enormes</T>, de vários metros, porque um espelho maior coleta mais luz e permite ver objetos fracos e muito distantes.
      </P>
    </>,
  ),

  page(
    <>
      <H icon="🌈">O espectro da luz</H>
      <P>
        A luz que vemos é só uma pequena faixa de algo muito maior: o <T>espectro eletromagnético</T>. Existem &ldquo;luzes&rdquo; invisíveis para nós: as ondas de rádio, as
        micro-ondas, o infravermelho, o ultravioleta, os raios X e os raios gama.
      </P>
      <Fig n="7.2" caption="Cada tipo de luz mostra um lado diferente do universo." h={24}>
        <SpectrumArt />
      </Fig>
      <List
        items={[
          <>
            Os <T>radiotelescópios</T> captam ondas de rádio e estudam o gás frio das galáxias, os pulsares e os quasares.
          </>,
          <>
            A atmosfera <T>bloqueia os raios X</T> (ainda bem: eles são perigosos!). Por isso os telescópios de raios X precisam ficar no espaço.
          </>,
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🏔️">Os grandes observatórios</H>
      <P>
        Muitos observatórios ficam no <T>alto de montanhas</T>, em lugares secos, como o <T>deserto do Atacama</T>, no Chile: ali o ar é rarefeito, seco e o céu é escuro. O
        Chile abriga o ALMA e o futuro ELT, que será o maior telescópio do mundo.
      </P>
      <Fig n="7.3" caption="As antenas do Atacama e o telescópio espacial Hubble." h={24}>
        <ObservatoriesArt />
      </Fig>
      <Cards
        items={[
          { icon: "🛰️", title: "Telescópios no espaço", text: "Longe da atmosfera, o Hubble (1990) e o James Webb veem sem o céu tremer." },
          { icon: "🏛️", title: "Observatório Nacional", text: "Fundado em 1827, no Rio de Janeiro, cuida também da hora legal do Brasil." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🔬">A impressão digital das estrelas</H>
      <P>
        Como saber do que uma estrela é feita sem ir até ela? Pela <T>espectroscopia</T>: a luz da estrela passa por um prisma e se abre num arco-íris cheio de{" "}
        <T>linhas escuras</T>. Cada elemento químico deixa linhas próprias, como uma impressão digital.
      </P>
      <Fig n="7.4" caption="As linhas mostram os elementos; o deslocamento delas mostra o movimento." h={24}>
        <SpectroscopyArt />
      </Fig>
      <P>
        Foi assim que o <T>hélio</T> foi descoberto no Sol, antes de ser achado na Terra. E a luz de uma galáxia que se afasta de nós chega &ldquo;esticada&rdquo;: as linhas se
        deslocam para o vermelho. É o <T>desvio para o vermelho</T>, parecido com a sirene da ambulância que fica mais grave quando ela se afasta (o efeito Doppler).
      </P>
      <Box kind="experimente">Para observar o céu à noite, use uma lanterna de luz vermelha: os olhos levam 20 a 30 minutos para se acostumar ao escuro, e a luz branca desfaz essa adaptação.</Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "A luneta usa lentes; o refletor usa espelhos (Newton, 1668). Espelhos maiores coletam mais luz.",
          "O espectro eletromagnético vai do rádio aos raios gama; só vemos a faixa visível.",
          "Observatórios ficam no alto de montanhas secas (Atacama) ou no espaço (Hubble, 1990).",
          "A espectroscopia revela os elementos das estrelas; o hélio foi descoberto no Sol.",
          "O desvio para o vermelho mostra que uma galáxia está se afastando.",
        ]}
      />
      <Glossary
        items={[
          ["Luneta", "Telescópio que usa lentes (refrator)."],
          ["Refletor", "Telescópio que usa um espelho curvo."],
          ["Espectro", "A luz separada nas suas “cores”."],
          ["Radiotelescópio", "Antena que capta ondas de rádio do espaço."],
          ["Desvio para o vermelho", "As linhas do espectro deslocadas de um astro que se afasta."],
        ]}
      />
      <Quiz
        items={[
          ["Qual é a diferença entre luneta e telescópio refletor?", "A luneta usa lentes; o refletor usa espelhos."],
          ["Por que os grandes telescópios usam espelhos enormes?", "Para coletar mais luz e ver objetos fracos e distantes."],
          ["O que um radiotelescópio capta?", "Ondas de rádio vindas do espaço."],
          ["Por que os astrônomos usam lanterna vermelha à noite?", "Para não desfazer a adaptação dos olhos ao escuro."],
        ]}
      />
    </>,
  ),
];
