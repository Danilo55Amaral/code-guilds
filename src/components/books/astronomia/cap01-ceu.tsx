"use client";

import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Moon, Stars, Sun } from "./art";

// ============================================================================
// CAPÍTULO 1 — OBSERVANDO O CÉU (missão "Astronomia: Observando o Céu"): a
// noite com a Via Láctea e a estrela cadente, o céu da cidade × o céu
// escuro, a luz do Sol se espalhando no ar (céu azul de dia, laranja no pôr
// do sol), a aurora dançando perto do polo e a luneta de Galileu.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a noite estrelada com a Via Láctea
// ---------------------------------------------------------------------------

function NightOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma noite estrelada no campo, com a faixa da Via Láctea, uma estrela cadente e uma pessoa observando o céu">
      <defs>
        <linearGradient id="ast1-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#020617" />
          <stop offset="1" stopColor="#1e1b4b" />
        </linearGradient>
      </defs>
      <rect width="460" height="300" fill="url(#ast1-sky)" />
      {/* a Via Láctea */}
      <path d="M-20 220 C120 120 300 140 480 20" stroke="#c4b5fd" strokeWidth="60" fill="none" opacity="0.18" />
      <path d="M-20 220 C120 120 300 140 480 20" stroke="#e9d5ff" strokeWidth="24" fill="none" opacity="0.2" />
      <Stars w={460} h={250} n={70} />
      {/* a estrela cadente */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;-260 120;-260 120" keyTimes="0;0.25;1" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;0;0" keyTimes="0;0.05;0.25;1" dur="5s" repeatCount="indefinite" />
        <path d="M420 30 L460 10" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <circle cx="420" cy="30" r="3" fill="#fff" />
      </g>
      <Moon x={380} y={70} r={20} />
      {/* o morro e a pessoa olhando */}
      <path d="M0 260 C100 230 200 250 300 236 C380 226 420 240 460 232 L460 300 L0 300 Z" fill="#0f172a" />
      <g transform="translate(150 246)" fill="#0f172a">
        <circle cy="-46" r="9" />
        <path d="M-8 -36 L8 -36 L6 -10 L-6 -10 Z" />
        <path d="M-5 -10 L-6 8 M5 -10 L6 8" stroke="#0f172a" strokeWidth="5" />
        <path d="M6 -32 L20 -46" stroke="#0f172a" strokeWidth="4" />
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O céu da cidade × o céu escuro do campo
// ---------------------------------------------------------------------------

function LightPollutionArt() {
  return (
    <Art viewBox="0 0 560 220" label="Do lado da cidade, a poluição luminosa esconde as estrelas; no campo escuro, aparecem milhares delas e a Via Láctea">
      <defs>
        <linearGradient id="ast1-city" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e293b" />
          <stop offset="1" stopColor="#c2410c" />
        </linearGradient>
        <clipPath id="ast1-left">
          <rect width="280" height="220" />
        </clipPath>
      </defs>
      <rect width="280" height="220" fill="url(#ast1-city)" />
      <rect x="280" width="280" height="220" fill="#020617" />
      <g clipPath="url(#ast1-left)">
        <Stars w={280} h={120} n={6} seed={3} />
      </g>
      <g transform="translate(280 0)">
        <path d="M0 200 C80 120 180 120 280 30" stroke="#e9d5ff" strokeWidth="30" fill="none" opacity="0.18" />
        <Stars w={280} h={190} n={70} seed={11} />
      </g>
      {/* os prédios com as janelas acesas */}
      {[20, 70, 120, 170, 220].map((x, i) => (
        <g key={x}>
          <rect x={x} y={130 - (i % 3) * 30} width="44" height={90 + (i % 3) * 30} fill="#0f172a" />
          {Array.from({ length: 6 }, (_, k) => (
            <rect key={k} x={x + 8 + (k % 2) * 18} y={140 - (i % 3) * 30 + Math.floor(k / 2) * 22} width="10" height="10" fill="#fde047" opacity="0.85" />
          ))}
        </g>
      ))}
      <path d="M280 200 C360 180 460 196 560 186 L560 220 L280 220 Z" fill="#0f172a" />
      <g fontFamily="Georgia, serif" fontSize="13" fontWeight="900" textAnchor="middle">
        <text x="140" y="24" fill="#fde68a">cidade: poucas estrelas</text>
        <text x="420" y="24" fill="#e9d5ff">campo escuro: milhares!</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Por que o céu é azul (e o pôr do sol é laranja)
// ---------------------------------------------------------------------------

function ScatteringArt() {
  return (
    <Art viewBox="0 0 560 220" label="De dia, a luz do Sol atravessa pouco ar e o azul se espalha por todo o céu; no pôr do sol, a luz atravessa muito ar e sobram o laranja e o vermelho">
      {/* meio-dia */}
      <rect x="4" y="4" width="270" height="212" rx="14" fill="#7dd3fc" />
      <Sun x={140} y={46} r={20} />
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} cx={30 + ((i * 37) % 220)} cy={90 + ((i * 23) % 90)} r="3" fill="#2563eb">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" begin={`${-i * 0.2}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <path d="M140 70 L140 190" stroke="#fef9c3" strokeWidth="5" strokeDasharray="10 8" className="cg-anim-dash" />
      <rect x="4" y="196" width="270" height="20" fill="#16a34a" />
      <text x="140" y="186" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#1e3a8a" fontFamily="Georgia, serif">
        meio-dia: o azul se espalha
      </text>
      {/* pôr do sol */}
      <rect x="286" y="4" width="270" height="212" rx="14" fill="#fb923c" />
      <rect x="286" y="4" width="270" height="80" rx="14" fill="#7c3aed" opacity="0.5" />
      <Sun x={420} y={176} r={22} />
      <path d="M300 150 L410 172" stroke="#fef9c3" strokeWidth="5" strokeDasharray="10 8" className="cg-anim-dash" />
      <rect x="286" y="190" width="270" height="26" fill="#1c1917" opacity="0.8" />
      <text x="421" y="40" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#fff7ed" fontFamily="Georgia, serif">
        pôr do sol: sobra o laranja
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A aurora dançando perto do polo
// ---------------------------------------------------------------------------

function AuroraArt() {
  const curtain = (d: string, color: string, delay: number) => <path d={d} fill={color} opacity="0.55" className="cg-anim-aurora" style={{ animationDelay: `${delay}s` }} />;
  return (
    <Art viewBox="0 0 560 220" label="A aurora austral: cortinas de luz verde e rosa dançando no céu perto do polo, sobre montanhas com neve">
      <rect width="560" height="220" fill="#020617" />
      <Stars w={560} h={160} n={40} seed={5} />
      {curtain("M0 120 C80 40 160 140 240 60 S400 120 560 50 L560 160 C400 140 240 150 0 170 Z", "#22c55e", 0)}
      {curtain("M0 90 C100 30 180 110 280 40 S440 90 560 30 L560 120 C420 110 260 130 0 130 Z", "#a855f7", 1.5)}
      {curtain("M40 140 C120 90 220 150 320 100 S480 140 560 110 L560 170 C400 160 220 175 40 180 Z", "#f472b6", 3)}
      <path d="M0 220 L80 160 L140 190 L220 140 L300 196 L380 150 L460 190 L560 160 L560 220 Z" fill="#334155" />
      <path d="M80 160 L96 172 L70 170 Z M220 140 L238 156 L206 154 Z M380 150 L396 162 L366 162 Z" fill="#f8fafc" />
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Galileu e a luneta apontada para a Lua
// ---------------------------------------------------------------------------

function GalileoArt() {
  return (
    <Art viewBox="0 0 560 220" label="Galileu Galilei apontando a luneta para a Lua em 1609 e vendo crateras e montanhas">
      <rect width="560" height="220" rx="14" fill="#0f172a" />
      <Stars w={560} h={220} n={30} seed={21} />
      {/* a Lua com as sombras das montanhas */}
      <g transform="translate(430 90)">
        <circle r="66" fill="#e7e5e4" />
        <path d="M0 -66 A66 66 0 0 1 0 66 A40 66 0 0 0 0 -66 Z" fill="#1c1917" opacity="0.75" />
        {[
          [-30, -20, 10], [-10, 20, 8], [-40, 26, 6], [-18, -44, 7],
        ].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#a8a29e" stroke="#78716c" strokeWidth="1" />
        ))}
        {[-50, -30, -6, 20, 44].map((y) => (
          <circle key={y} cx="2" cy={y} r="2.5" fill="#f5f5f4" className="cg-anim-twinkle" />
        ))}
      </g>
      {/* Galileu e a luneta */}
      <g transform="translate(130 200)">
        <path d="M-20 0 L-14 -60 L14 -60 L20 0 Z" fill="#7c2d12" />
        <circle cy="-72" r="13" fill="#fcd34d" stroke="#92400e" strokeWidth="1.5" />
        <path d="M-12 -66 C-14 -50 12 -50 12 -66" fill="#e5e7eb" />
        <g transform="translate(10 -70) rotate(-28)">
          <rect x="0" y="-6" width="120" height="12" rx="4" fill="#a16207" stroke="#78350f" strokeWidth="1.5" />
          <rect x="112" y="-8" width="10" height="16" rx="2" fill="#92400e" />
        </g>
      </g>
      <path d="M240 90 L364 70" stroke="#fde68a" strokeWidth="2" strokeDasharray="6 6" className="cg-anim-dash" />
      <text x="120" y="30" fontSize="13" fontWeight="900" fill="#fde68a" fontFamily="Georgia, serif">
        Galileu, 1609
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
      title="Observando o Céu"
      goals={["O que dá para ver no céu sem telescópio", "Por que o céu é azul e o pôr do sol é laranja", "O que são as auroras", "O que Galileu viu com a sua luneta"]}
    >
      <Fig h={34}>
        <NightOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="👀">O que dá para ver a olho nu</H>
      <P>
        Sem nenhum instrumento, dá para ver a Lua, milhares de estrelas, a faixa da <T>Via Láctea</T> (a nossa galáxia vista de dentro) e <T>cinco planetas</T>: Mercúrio, Vênus,
        Marte, Júpiter e Saturno. Eles parecem estrelas brilhantes que <em>não piscam</em> tanto. Urano e Netuno só com telescópio.
      </P>
      <Fig n="1.1" caption="A poluição luminosa das cidades esconde as estrelas mais fracas." h={24}>
        <LightPollutionArt />
      </Fig>
      <List
        items={[
          <>
            A melhor fase para ver estrelas fracas é a <T>Lua Nova</T>: a luz da Lua Cheia clareia o céu.
          </>,
          <>
            A Lua também aparece de <T>dia</T>: ela passa cerca de metade do tempo acima do horizonte enquanto o céu está azul.
          </>,
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🌅">Por que o céu é azul?</H>
      <P>
        A luz do Sol é branca, a mistura de todas as cores. Ao atravessar o ar, a luz <T>azul</T> é a que mais se espalha pelas moléculas do ar, e por isso o céu inteiro fica
        azul. Esse espalhamento se chama <T>espalhamento de Rayleigh</T>.
      </P>
      <Fig n="1.2" caption="De dia, o azul se espalha. No pôr do sol, a luz atravessa tanto ar que sobram o laranja e o vermelho." h={24}>
        <ScatteringArt />
      </Fig>
      <P>
        No <T>pôr do sol</T>, o Sol está baixo e a luz percorre um caminho muito maior no ar. O azul se espalha pelo caminho e o que sobra para os nossos olhos é o laranja e o
        vermelho.
      </P>
    </>,
  ),

  page(
    <>
      <H icon="✨">As auroras</H>
      <P>
        Perto dos polos, o céu às vezes se enche de cortinas de luz verde, rosa e roxa: são as <T>auroras</T> (boreal no norte, austral no sul). Elas acontecem quando as
        partículas do <T>vento solar</T> chegam à Terra, são guiadas pelo campo magnético até os polos e fazem os gases da atmosfera brilharem.
      </P>
      <Fig n="1.3" caption="A aurora austral, perto do Polo Sul." h={24}>
        <AuroraArt />
      </Fig>
      <Box kind="atencao" title="O anel de fogo">
        No <strong>eclipse solar anular</strong>, a Lua passa na frente do Sol, mas não o cobre todo, e sobra um anel brilhante. Nunca olhe para o Sol sem proteção própria, nem
        durante um eclipse!
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🔭">Galileu e a observação do céu</H>
      <P>
        Em <T>1609</T>, o italiano <T>Galileu Galilei</T> apontou uma luneta para a Lua e viu crateras e montanhas, com sombras. Isso contrariava a ideia antiga de que os astros
        eram esferas perfeitas e lisas.
      </P>
      <Fig n="1.4" caption="Galileu viu que a Lua tem relevo, como a Terra." h={22}>
        <GalileoArt />
      </Fig>
      <Cards
        items={[
          { icon: "🏛️", title: "Planetário", text: "Uma cúpula que projeta o céu de qualquer época e lugar, até de dia." },
          { icon: "🗺️", title: "Aplicativos de céu", text: "Mostram o nome das estrelas e dos planetas para onde você aponta o celular." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "A olho nu vemos a Lua, estrelas, a Via Láctea e cinco planetas (Mercúrio, Vênus, Marte, Júpiter e Saturno).",
          "A poluição luminosa das cidades esconde as estrelas; a Lua Nova é a melhor fase para observar.",
          "O céu é azul porque o azul se espalha mais no ar; no pôr do sol, sobram o laranja e o vermelho.",
          "As auroras são o vento solar fazendo os gases da atmosfera brilharem perto dos polos.",
          "Galileu viu crateras e montanhas na Lua em 1609.",
        ]}
      />
      <Glossary
        items={[
          ["Via Láctea", "A nossa galáxia, vista como uma faixa clara no céu."],
          ["Poluição luminosa", "O excesso de luz artificial que apaga o céu."],
          ["Espalhamento de Rayleigh", "A luz azul se espalhando nas moléculas do ar."],
          ["Vento solar", "Partículas que saem do Sol e viajam pelo espaço."],
          ["Planetário", "Cúpula que projeta o céu estrelado."],
        ]}
      />
      <Quiz
        items={[
          ["Quantos planetas, além da Terra, dá para ver a olho nu?", "Cinco: Mercúrio, Vênus, Marte, Júpiter e Saturno."],
          ["Por que vemos menos estrelas nas cidades?", "Por causa da poluição luminosa."],
          ["Por que o céu é azul?", "Porque a luz azul do Sol é a que mais se espalha nas moléculas do ar."],
          ["O que causa as auroras?", "As partículas do vento solar fazendo os gases da atmosfera brilharem perto dos polos."],
        ]}
      />
    </>,
  ),
];
