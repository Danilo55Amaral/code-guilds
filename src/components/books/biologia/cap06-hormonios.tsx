"use client";

import { Art, Box, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";

// ============================================================================
// CAPÍTULO 6 — HORMÔNIOS E REPRODUÇÃO (missão "Biologia: Hormônios e
// Reprodução"): as glândulas acendendo uma de cada vez no corpo, o hormônio
// viajando pelo sangue até a célula-alvo, a insulina abrindo a "porta" pra
// glicose, a linha do tempo do crescimento e a fecundação em esquema, do
// encontro das células ao embrião se dividindo. Tudo em linguagem de livro
// didático do fundamental e do médio.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: as glândulas do corpo acendendo uma de cada vez
// ---------------------------------------------------------------------------

const GLANDS: { name: string; x: number; y: number; r: number; color: string; tx: number; ty: number }[] = [
  { name: "Hipófise", x: 230, y: 52, r: 7, color: "#a855f7", tx: 330, ty: 40 },
  { name: "Tireoide", x: 230, y: 104, r: 9, color: "#ec4899", tx: 330, ty: 96 },
  { name: "Suprarrenais", x: 214, y: 186, r: 7, color: "#f97316", tx: 330, ty: 156 },
  { name: "Pâncreas", x: 238, y: 202, r: 9, color: "#eab308", tx: 330, ty: 206 },
  { name: "Gônadas", x: 230, y: 262, r: 9, color: "#10b981", tx: 330, ty: 262 },
];

function GlandsArt() {
  const loop = { dur: "10s", repeatCount: "indefinite" };
  return (
    <Art viewBox="0 0 460 300" label="O corpo com as glândulas acendendo: hipófise, tireoide, suprarrenais, pâncreas e gônadas">
      {/* o contorno do corpo */}
      <circle cx="230" cy="50" r="34" fill="#fde7d3" stroke="#c08a5e" strokeWidth="2" />
      <path d="M216 82 L216 96 L170 108 C158 112 154 128 156 150 L168 290 L292 290 L304 150 C306 128 302 112 290 108 L244 96 L244 82 Z" fill="#fde7d3" stroke="#c08a5e" strokeWidth="2" />
      {/* os vasos levando os hormônios */}
      <path d="M230 70 L230 280" stroke="#fca5a5" strokeWidth="6" opacity="0.5" />
      {GLANDS.map((g, i) => (
        <g key={g.name}>
          <circle cx={g.x} cy={g.y} r={g.r * 2.6} fill={g.color} opacity="0">
            <animate attributeName="opacity" values="0;0.45;0;0" keyTimes={`0;0.1;0.2;1`} {...loop} begin={`${i * 2 - 10}s`} />
          </circle>
          <circle cx={g.x} cy={g.y} r={g.r} fill={g.color} stroke="#3b0764" strokeWidth="1.5" />
          {/* os hormônios saindo */}
          {[0, 1].map((k) => (
            <circle key={k} r="2.6" fill={g.color}>
              <animateMotion path={`M${g.x} ${g.y} L${g.x + (k ? 18 : -18)} ${g.y + 26}`} dur="2s" begin={`${k * 0.4 - 2}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0" dur="2s" begin={`${k * 0.4 - 2}s`} repeatCount="indefinite" />
            </circle>
          ))}
          <line x1={g.x + g.r} y1={g.y} x2={g.tx - 4} y2={g.ty} stroke="#7c6a48" strokeWidth="1" strokeDasharray="3 2" />
          <text x={g.tx} y={g.ty + 4} fontSize="13.5" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif" opacity="0.45">
            <animate attributeName="opacity" values="0.45;1;1;0.45;0.45" keyTimes="0;0.05;0.2;0.25;1" {...loop} begin={`${i * 2 - 10}s`} />
            {g.name}
          </text>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O hormônio é um mensageiro: sai da glândula, viaja no sangue e chega à célula-alvo
// ---------------------------------------------------------------------------

function MessengerArt() {
  return (
    <Art viewBox="0 0 540 200" label="Uma glândula solta hormônios no sangue e eles chegam até a célula-alvo, que tem o receptor certo">
      {/* a glândula */}
      <path d="M30 60 C30 20 110 20 110 60 C110 100 30 100 30 60 Z" fill="#f9a8d4" stroke="#be185d" strokeWidth="2.5" />
      <text x="70" y="64" textAnchor="middle" fontSize="12" fontWeight="900" fill="#831843" fontFamily="Georgia, serif">
        Glândula
      </text>
      {/* o vaso sanguíneo */}
      <path d="M20 130 L520 130" stroke="#fecaca" strokeWidth="40" strokeLinecap="round" />
      {[0, 1, 2, 3, 4].map((k) => (
        <ellipse key={k} rx="9" ry="5" fill="#ef4444" stroke="#991b1b" strokeWidth="1">
          <animateMotion path="M20 138 L520 138" dur="5s" begin={`${k - 5}s`} repeatCount="indefinite" />
        </ellipse>
      ))}
      {/* os hormônios: descem da glândula, andam no sangue e encaixam na célula */}
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <animateMotion path="M70 96 L80 124 L380 124 C410 120 420 100 430 84" dur="6s" begin={`${k * 2 - 6}s`} repeatCount="indefinite" />
          <path d="M-6 -6 L6 -6 L6 6 L0 2 L-6 6 Z" fill="#a855f7" stroke="#581c87" strokeWidth="1.2" />
        </g>
      ))}
      {/* a célula-alvo com os receptores */}
      <circle cx="450" cy="50" r="40" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2.5" />
      <circle cx="458" cy="44" r="12" fill="#c4b5fd" />
      {[200, 230, 160].map((a) => {
        const rad = (a * Math.PI) / 180;
        const x = 450 + 40 * Math.cos(rad);
        const y = 50 - 40 * Math.sin(rad);
        return <path key={a} d={`M${x - 6} ${y} L${x - 6} ${y + 8} L${x + 6} ${y + 8} L${x + 6} ${y}`} stroke="#0369a1" strokeWidth="2.5" fill="none" transform={`rotate(${90 - a} ${x} ${y})`} />;
      })}
      <text x="450" y="112" textAnchor="middle" fontSize="12" fontWeight="900" fill="#075985" fontFamily="Georgia, serif">
        Célula-alvo
      </text>
      <text x="270" y="186" textAnchor="middle" fontSize="12" fontWeight="700" fill="#991b1b" fontFamily="Georgia, serif">
        o hormônio viaja pelo sangue
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A insulina é a "chave" que abre a célula pra glicose entrar
// ---------------------------------------------------------------------------

function InsulinArt() {
  const loop = { dur: "6s", repeatCount: "indefinite" };
  return (
    <Art viewBox="0 0 540 210" label="A insulina encaixa no receptor da célula, a porta abre e a glicose entra">
      {/* a célula, com a porta na membrana */}
      <rect x="300" y="20" width="220" height="170" rx="40" fill="#fef3c7" stroke="#d97706" strokeWidth="5" />
      <text x="420" y="110" textAnchor="middle" fontSize="13" fontWeight="900" fill="#92400e" fontFamily="Georgia, serif">
        Célula
      </text>
      <text x="420" y="128" textAnchor="middle" fontSize="11.5" fill="#92400e" fontFamily="Georgia, serif">
        (usa a glicose como energia)
      </text>
      <rect x="292" y="80" width="16" height="50" fill="#fbbf24" stroke="#92400e" strokeWidth="2">
        <animate attributeName="height" values="50;50;6;6;50" keyTimes="0;0.35;0.45;0.85;1" {...loop} />
      </rect>
      {/* o receptor */}
      <path d="M286 64 L286 78 L296 78" stroke="#0369a1" strokeWidth="4" fill="none" />
      {/* a insulina (a chave) */}
      <g>
        <animateMotion values="120,40;276,64;276,64;120,40" keyTimes="0;0.3;0.85;1" calcMode="linear" {...loop} />
        <circle cx="-10" cy="0" r="9" fill="none" stroke="#0ea5e9" strokeWidth="4" />
        <path d="M-1 0 L14 0 M8 0 L8 6 M13 0 L13 5" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" />
      </g>
      <text x="120" y="20" textAnchor="middle" fontSize="12" fontWeight="900" fill="#0369a1" fontFamily="Georgia, serif">
        insulina
      </text>
      {/* as glicoses no sangue, entrando quando a porta abre */}
      {[0, 1, 2, 3].map((k) => (
        <g key={k}>
          <animateMotion values={`${60 + k * 40},150;${60 + k * 40},150;300,105;${360 + k * 30},${70 + (k % 2) * 60};${360 + k * 30},${70 + (k % 2) * 60}`} keyTimes={`0;${0.4 + k * 0.08};${0.5 + k * 0.08};${0.6 + k * 0.08};1`} calcMode="linear" {...loop} />
          <path d="M0 -10 L9 -5 L9 5 L0 10 L-9 5 L-9 -5 Z" fill="#fde68a" stroke="#a16207" strokeWidth="1.8" />
        </g>
      ))}
      <text x="120" y="196" textAnchor="middle" fontSize="12" fontWeight="900" fill="#a16207" fontFamily="Georgia, serif">
        glicose no sangue
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A linha do tempo do crescimento
// ---------------------------------------------------------------------------

function GrowthArt() {
  const stages = [
    { label: "Infância", age: "0 a 9 anos", h: 60 },
    { label: "Puberdade", age: "cerca de 9 a 14", h: 86 },
    { label: "Adolescência", age: "até uns 18", h: 108 },
    { label: "Vida adulta", age: "corpo formado", h: 118 },
  ];
  return (
    <Art viewBox="0 0 540 200" label="A linha do tempo do crescimento: infância, puberdade, adolescência e vida adulta">
      <path d="M30 160 L520 160" stroke="#b08a52" strokeWidth="4" strokeLinecap="round" />
      <path d="M512 152 L524 160 L512 168" stroke="#b08a52" strokeWidth="4" fill="none" />
      {stages.map((s, i) => {
        const x = 90 + i * 125;
        const top = 160 - s.h;
        const head = s.h * 0.17;
        return (
          <g key={s.label} className="cg-anim-pop" style={{ animationDelay: `${i * 0.35}s` }}>
            <circle cx={x} cy={top + head} r={head} fill="#fcd34d" stroke="#92400e" strokeWidth="2" />
            <path d={`M${x - head * 1.1} ${top + head * 2.3} L${x + head * 1.1} ${top + head * 2.3} L${x + head * 0.9} ${160 - s.h * 0.38} L${x - head * 0.9} ${160 - s.h * 0.38} Z`} fill={["#60a5fa", "#34d399", "#a78bfa", "#f472b6"][i]} stroke="#1e293b" strokeWidth="1.5" />
            <path d={`M${x - head * 0.5} ${160 - s.h * 0.38} L${x - head * 0.5} 160 M${x + head * 0.5} ${160 - s.h * 0.38} L${x + head * 0.5} 160`} stroke="#1e293b" strokeWidth={head * 0.55} strokeLinecap="round" />
            {i === 1 && (
              <g className="cg-anim-glow">
                <circle cx={x + 30} cy={top + 6} r="11" fill="#a855f7" opacity="0.3" />
                <text x={x + 30} y={top + 10} textAnchor="middle" fontSize="11" fontWeight="900" fill="#6b21a8" fontFamily="Georgia, serif">
                  ⚡
                </text>
              </g>
            )}
            <text x={x} y="180" textAnchor="middle" fontSize="13" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
              {s.label}
            </text>
            <text x={x} y="195" textAnchor="middle" fontSize="11" fontStyle="italic" fill="#6b5a3a" fontFamily="Georgia, serif">
              {s.age}
            </text>
          </g>
        );
      })}
      <text x="270" y="22" textAnchor="middle" fontSize="12" fontWeight="700" fill="#6b21a8" fontFamily="Georgia, serif">
        ⚡ na puberdade, os hormônios dão a largada nas mudanças
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A fecundação (esquema) e as primeiras divisões do zigoto
// ---------------------------------------------------------------------------

function Sperm() {
  return (
    <g>
      <path d="M-8 0 C-18 -5 -24 5 -34 0 S-46 -5 -52 0" stroke="#64748b" strokeWidth="1.8" fill="none">
        <animate attributeName="d" values="M-8 0 C-18 -5 -24 5 -34 0 S-46 -5 -52 0;M-8 0 C-18 5 -24 -5 -34 0 S-46 5 -52 0;M-8 0 C-18 -5 -24 5 -34 0 S-46 -5 -52 0" dur="0.4s" repeatCount="indefinite" />
      </path>
      <ellipse cx="0" cy="0" rx="7" ry="4.5" fill="#cbd5e1" stroke="#475569" strokeWidth="1.2" />
    </g>
  );
}

function FertilizationArt() {
  const cells = (n: number) => {
    if (n === 1) return [[0, 0, 15]];
    if (n === 2) return [[-8, 0, 10], [8, 0, 10]];
    if (n === 4) return [[-7, -7, 8], [7, -7, 8], [-7, 7, 8], [7, 7, 8]];
    return Array.from({ length: 9 }, (_, i) => [((i % 3) - 1) * 9, (Math.floor(i / 3) - 1) * 9, 6]);
  };
  return (
    <Art viewBox="0 0 560 200" label="Esquema da fecundação: os espermatozoides nadam até o óvulo e um deles o fecunda, formando o zigoto, que se divide em 2, 4 e mais células">
      {/* o óvulo com a camada de proteção */}
      <circle cx="170" cy="90" r="62" fill="#fef3c7" stroke="#fbbf24" strokeWidth="6" strokeDasharray="4 4" className="cg-anim-glow" style={{ "--cg-dur": "4s" } as React.CSSProperties} />
      <circle cx="170" cy="90" r="52" fill="#fffbeb" stroke="#d97706" strokeWidth="2.5" />
      <circle cx="176" cy="84" r="14" fill="#fcd34d" stroke="#b45309" strokeWidth="1.5" />
      <text x="170" y="172" textAnchor="middle" fontSize="13" fontWeight="900" fill="#92400e" fontFamily="Georgia, serif">
        Óvulo
      </text>
      {/* os espermatozoides nadando até ele */}
      {[
        ["M-40 30 C20 20 60 60 112 70", "4s", "0s"],
        ["M-40 150 C20 160 60 120 114 108", "4.6s", "-1.5s"],
        ["M-40 90 C10 70 60 100 108 90", "3.6s", "-2.6s"],
      ].map(([path, dur, begin], i) => (
        <g key={i}>
          <animateMotion path={path} dur={dur} begin={begin} repeatCount="indefinite" rotate="auto" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur={dur} begin={begin} repeatCount="indefinite" />
          <Sperm />
        </g>
      ))}
      <text x="40" y="190" textAnchor="middle" fontSize="12" fontWeight="900" fill="#475569" fontFamily="Georgia, serif">
        Espermatozoides
      </text>
      {/* as primeiras divisões */}
      {[1, 2, 4, 9].map((n, i) => (
        <g key={n} className="cg-anim-pop" style={{ animationDelay: `${0.4 + i * 0.4}s` }}>
          <g transform={`translate(${300 + i * 72} 90)`}>
            <circle r="26" fill="none" stroke="#fbbf24" strokeWidth="3" strokeDasharray="3 3" />
            {cells(n).map(([x, y, r], k) => (
              <circle key={k} cx={x} cy={y} r={r} fill="#fde68a" stroke="#b45309" strokeWidth="1.3" />
            ))}
          </g>
          <text x={300 + i * 72} y="140" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#5b4a2e" fontFamily="Georgia, serif">
            {["Zigoto", "2 células", "4 células", "Mórula"][i]}
          </text>
          {i < 3 && <path d={`M${330 + i * 72} 90 L${342 + i * 72} 90`} stroke="#b08a52" strokeWidth="2.5" />}
        </g>
      ))}
      <text x="408" y="172" textAnchor="middle" fontSize="12" fontWeight="900" fill="#92400e" fontFamily="Georgia, serif">
        o zigoto se divide por mitose
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 6, content, bare });

export const chapter6: BookPage[] = [
  page(
    <ChapterOpener
      n={6}
      title="Hormônios e Reprodução"
      goals={["O que são glândulas e hormônios", "Como a insulina, a adrenalina e a melatonina agem no corpo", "O que muda no corpo durante a puberdade", "Como acontecem a fecundação e a gravidez"]}
    >
      <Fig h={34}>
        <GlandsArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="📨">O sistema endócrino</H>
      <P>
        O corpo tem dois sistemas que mandam mensagens: o <T>nervoso</T>, que usa impulsos elétricos rapidíssimos, e o <T>endócrino</T>, formado pelas <T>glândulas</T>, que
        soltam no sangue substâncias chamadas <T>hormônios</T>. O hormônio é um mensageiro químico: viaja pelo sangue e só age nas células que têm o <em>receptor</em> certo
        para ele, as células-alvo.
      </P>
      <Fig n="6.1" caption="O hormônio sai da glândula, viaja pelo sangue e encaixa no receptor da célula-alvo." h={22}>
        <MessengerArt />
      </Fig>
      <Table
        head={["Glândula", "Hormônio", "O que faz"]}
        rows={[
          ["Hipófise", "Do crescimento e outros", "A “glândula mestra”: comanda várias outras glândulas"],
          ["Tireoide", "Tiroxina", "Regula o metabolismo, o ritmo do corpo (precisa de iodo)"],
          ["Pâncreas", "Insulina", "Controla o açúcar (glicose) no sangue"],
          ["Suprarrenais", "Adrenalina", "Prepara o corpo para o perigo"],
          ["Ovários e testículos", "Estrogênio, progesterona e testosterona", "Desenvolvimento e reprodução"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🔑">Insulina, adrenalina e melatonina</H>
      <P>
        Depois de uma refeição, a glicose do alimento vai para o sangue. O <T>pâncreas</T> então solta a <T>insulina</T>, que funciona como uma chave: encaixa na célula e
        &ldquo;abre a porta&rdquo; para a glicose entrar e virar energia.
      </P>
      <Fig n="6.2" caption="A insulina encaixa no receptor, a porta abre e a glicose entra na célula." h={22}>
        <InsulinArt />
      </Fig>
      <P>
        No <T>diabetes tipo 1</T>, o pâncreas quase não produz insulina, e a glicose fica sobrando no sangue; por isso a pessoa precisa aplicar insulina. Alimentação saudável
        e exercícios ajudam a prevenir o diabetes tipo 2, o mais comum.
      </P>
      <List
        items={[
          <>
            <T>Adrenalina</T>: num susto, as suprarrenais a liberam. O coração acelera, a respiração fica rápida e os músculos recebem mais sangue: o corpo se prepara para
            &ldquo;lutar ou fugir&rdquo;.
          </>,
          <>
            <T>Melatonina</T>: produzida no escuro, avisa ao corpo que é hora de dormir.
          </>,
        ]}
      />
      <Box kind="mago">A luz do celular à noite engana o cérebro, que acha que ainda é dia e solta menos melatonina. Desligue as telas um tempinho antes de dormir!</Box>
    </>,
  ),

  page(
    <>
      <H icon="🌱">Puberdade: o corpo em transformação</H>
      <P>
        Por volta dos 9 aos 14 anos começa a <T>puberdade</T>. A <T>hipófise</T> manda um sinal para as <T>gônadas</T> (os ovários ou os testículos), que passam a produzir mais
        hormônios sexuais. É o começo da transformação do corpo de criança em corpo adulto.
      </P>
      <Fig n="6.3" caption="O crescimento ao longo da vida. Na puberdade acontece o “estirão”: crescemos vários centímetros por ano." h={22}>
        <GrowthArt />
      </Fig>
      <List
        items={[
          <>
            Em todos: o <T>estirão de crescimento</T>, pelos nas axilas e na região genital, mais suor e oleosidade na pele (as espinhas) e muitas mudanças nas emoções.
          </>,
          <>
            A <T>testosterona</T>, produzida principalmente nos testículos, engrossa a voz, faz crescer a barba e aumenta os músculos.
          </>,
          <>
            O <T>estrogênio</T> e a <T>progesterona</T>, produzidos nos ovários, desenvolvem os seios e regulam o <T>ciclo menstrual</T>: cerca de uma vez por mês, o útero se
            prepara para uma possível gravidez; se ela não acontece, a camada preparada se desfaz e sai na menstruação.
          </>,
        ]}
      />
      <Box kind="lembre">Cada pessoa tem o seu próprio tempo! Começar a puberdade um pouco antes ou um pouco depois dos colegas é normal. Dúvidas? Converse com a família, os professores ou um profissional de saúde.</Box>
    </>,
  ),

  page(
    <>
      <H icon="👶">Fecundação e gravidez</H>
      <P>
        Na reprodução humana, a célula reprodutiva masculina (o <T>espermatozoide</T>) se une à feminina (o <T>óvulo</T>). Essa união é a <T>fecundação</T> e costuma acontecer
        nas tubas uterinas. Dela surge uma célula nova, o <T>zigoto</T>, com metade do material genético de cada um dos pais.
      </P>
      <Fig n="6.4" caption="Esquema da fecundação. O zigoto se divide muitas vezes e forma o embrião." h={22}>
        <FertilizationArt />
      </Fig>
      <P>
        O embrião se instala no <T>útero</T>, onde se desenvolve por cerca de <T>9 meses</T> (40 semanas). A <T>placenta</T> liga o bebê à mãe: pelo <T>cordão umbilical</T>, o
        sangue do bebê vai até ela e volta com nutrientes e oxigênio.
      </P>
      <Box kind="atencao">
        Existem vários métodos para evitar a gravidez, mas só o <strong>preservativo</strong> (a camisinha) protege, ao mesmo tempo, da gravidez e das{" "}
        <strong>infecções sexualmente transmissíveis</strong> (ISTs), como o HIV. Informação sobre o próprio corpo é cuidado com a saúde.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "As glândulas soltam hormônios no sangue; cada hormônio age nas células que têm o receptor dele.",
          "Insulina (pâncreas) controla a glicose; adrenalina (suprarrenais) prepara para o perigo; melatonina ajuda no sono; a tireoide regula o metabolismo.",
          "Na puberdade, a hipófise ativa as gônadas: testosterona, estrogênio e progesterona trazem as mudanças do corpo.",
          "Fecundação: espermatozoide + óvulo = zigoto. A gravidez dura cerca de 40 semanas e a placenta nutre o bebê.",
        ]}
      />
      <Glossary
        items={[
          ["Glândula", "Órgão que produz e libera substâncias, como os hormônios."],
          ["Hormônio", "Mensageiro químico que viaja pelo sangue."],
          ["Gônadas", "Os ovários e os testículos, que produzem as células reprodutivas."],
          ["Zigoto", "A primeira célula de um novo ser, formada na fecundação."],
          ["Placenta", "Órgão que liga o bebê à mãe durante a gravidez."],
        ]}
      />
      <Quiz
        items={[
          ["Qual glândula produz a insulina?", "O pâncreas."],
          ["Por que a hipófise é chamada de “glândula mestra”?", "Porque controla o funcionamento de várias outras glândulas."],
          ["Qual hormônio é liberado num susto e acelera o coração?", "A adrenalina, das glândulas suprarrenais."],
          ["Qual método protege ao mesmo tempo da gravidez e das ISTs?", "O preservativo (camisinha)."],
        ]}
      />
    </>,
  ),
];
