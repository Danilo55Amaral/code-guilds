"use client";

import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";

// ============================================================================
// CAPÍTULO 10 — FÍSICA MODERNA (missão "Física: Física Moderna"): o E = mc²
// brilhando com os fótons em volta, os dois relógios (o da nave perto da
// velocidade da luz anda mais devagar), a luz arrancando elétrons do metal,
// a órbita de Bohr × a nuvem de elétrons e a fissão nuclear em cadeia.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: E = mc²
// ---------------------------------------------------------------------------

function EinsteinOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="A equação E = m c ao quadrado brilhando, com partículas de luz girando em volta">
      <rect width="460" height="300" fill="#0f172a" />
      {Array.from({ length: 30 }, (_, i) => (
        <circle key={i} cx={(i * 97) % 460} cy={(i * 53) % 300} r="1.2" fill="#fff" className="cg-anim-twinkle" style={{ animationDelay: `${(i % 7) * 0.4}s` }} />
      ))}
      <circle cx="230" cy="150" r="110" fill="#6366f1" opacity="0.25" className="cg-anim-glow" />
      {/* os fótons girando */}
      {[0, 1, 2].map((k) => (
        <g key={k} transform="translate(230 150)">
          <g>
            <animateTransform attributeName="transform" type="rotate" from={k % 2 ? "360" : "0"} to={k % 2 ? "0" : "360"} dur={`${6 + k * 3}s`} repeatCount="indefinite" />
            <ellipse rx={120 - k * 18} ry={50 + k * 8} fill="none" stroke="#a5b4fc" strokeWidth="1" opacity="0.6" transform={`rotate(${k * 60})`} />
            <circle cx={(120 - k * 18) * Math.cos((k * Math.PI) / 3)} cy={(120 - k * 18) * Math.sin((k * Math.PI) / 3)} r="6" fill="#fde047" />
          </g>
        </g>
      ))}
      <text x="230" y="168" textAnchor="middle" fontSize="54" fontWeight="900" fill="#fef9c3" fontFamily="Georgia, serif" style={{ filter: "drop-shadow(0 0 10px #facc15)" }}>
        E = mc²
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A dilatação do tempo: os dois relógios
// ---------------------------------------------------------------------------

function Clock({ x, y, dur, label, sub }: { x: number; y: number; dur: number; label: string; sub: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="44" fill="#f8fafc" stroke="#334155" strokeWidth="4" />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1="0" y1="-38" x2="0" y2="-32" stroke="#334155" strokeWidth="2" transform={`rotate(${i * 30})`} />
      ))}
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur={`${dur}s`} repeatCount="indefinite" />
        <line x1="0" y1="0" x2="0" y2="-34" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
      </g>
      <circle r="4" fill="#dc2626" />
      <text y="66" textAnchor="middle" fontSize="13" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
        {label}
      </text>
      <text y="84" textAnchor="middle" fontSize="11.5" fontStyle="italic" fill="#6b5a3a" fontFamily="Georgia, serif">
        {sub}
      </text>
    </g>
  );
}

function TimeDilationArt() {
  return (
    <Art viewBox="0 0 560 220" label="O relógio na Terra anda normalmente; o relógio de uma nave perto da velocidade da luz anda mais devagar">
      <Clock x={120} y={90} dur={3} label="Relógio na Terra" sub="anda normal" />
      <Clock x={420} y={90} dur={9} label="Relógio na nave" sub="perto da velocidade da luz: mais devagar" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;30 0;0 0" dur="1s" repeatCount="indefinite" />
        <path d="M290 40 L330 30 L330 50 Z" fill="#94a3b8" />
        <path d="M258 36 L290 36 M262 44 L290 44" stroke="#a5b4fc" strokeWidth="2" strokeDasharray="6 4" />
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O efeito fotoelétrico: a luz arranca elétrons do metal
// ---------------------------------------------------------------------------

function PhotoelectricArt() {
  return (
    <Art viewBox="0 0 560 220" label="Pacotinhos de luz, os fótons, batem numa placa de metal e arrancam elétrons dela">
      <rect x="300" y="30" width="34" height="170" fill="#94a3b8" stroke="#475569" strokeWidth="2.5" />
      <text x="317" y="216" textAnchor="middle" fontSize="12" fontWeight="900" fill="#475569" fontFamily="Georgia, serif">
        metal
      </text>
      {/* os fótons chegando, como pacotinhos ondulados */}
      {[60, 110, 160].map((y, i) => (
        <g key={y}>
          <animateTransform attributeName="transform" type="translate" values="-60 0;220 0" dur="2s" begin={`${-i * 0.66}s`} repeatCount="indefinite" />
          <path d={`M40 ${y} q8 -10 16 0 t16 0 t16 0`} stroke="#a855f7" strokeWidth="4" fill="none" />
          <circle cx="92" cy={y} r="5" fill="#fde047" />
        </g>
      ))}
      {/* os elétrons saindo */}
      {[70, 120, 170].map((y, i) => (
        <circle key={y} cx="340" cy={y} r="6" fill="#3b82f6" stroke="#fff" strokeWidth="1.5">
          <animate attributeName="cx" values="340;340;520" keyTimes="0;0.45;1" dur="2s" begin={`${-i * 0.66}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0;1;0" keyTimes="0;0.44;0.5;1" dur="2s" begin={`${-i * 0.66}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <g fontFamily="Georgia, serif" fontSize="12.5" fontWeight="900">
        <text x="40" y="24" fill="#7e22ce">fótons (luz)</text>
        <text x="420" y="24" fill="#1d4ed8">elétrons arrancados</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A órbita de Bohr × a nuvem de elétrons
// ---------------------------------------------------------------------------

function CloudArt() {
  const dots = Array.from({ length: 70 }, (_, i) => {
    const a = (i * 137.5 * Math.PI) / 180;
    const r = 12 + ((i * 29) % 60) * (0.6 + ((i * 7) % 10) / 25);
    return [Math.cos(a) * r, Math.sin(a) * r] as [number, number];
  });
  return (
    <Art viewBox="0 0 560 210" label="No modelo de Bohr o elétron anda numa órbita certinha; na física quântica, só dá para dizer onde ele provavelmente está: uma nuvem">
      <g transform="translate(140 100)">
        <circle r="60" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 4" />
        <circle r="8" fill="#ef4444" />
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3s" repeatCount="indefinite" />
          <circle cx="60" r="7" fill="#3b82f6" />
        </g>
        <text y="88" textAnchor="middle" fontSize="13" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
          Bohr: órbita certinha
        </text>
      </g>
      <g transform="translate(420 100)">
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.6" fill="#3b82f6" className="cg-anim-twinkle" style={{ animationDelay: `${(i % 11) * 0.21}s`, animationDuration: "1.6s" }} />
        ))}
        <circle r="8" fill="#ef4444" />
        <text y="88" textAnchor="middle" fontSize="13" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
          Quântica: uma nuvem
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A fissão nuclear em cadeia
// ---------------------------------------------------------------------------

function FissionArt() {
  const loop = { dur: "4s", repeatCount: "indefinite" };
  return (
    <Art viewBox="0 0 560 220" label="Um nêutron bate num núcleo de urânio, que se divide em dois e solta mais nêutrons e muita energia, que vão dividir outros núcleos: a reação em cadeia">
      {/* o nêutron chegando */}
      <circle cy="110" r="7" fill="#94a3b8" stroke="#475569" strokeWidth="1.5">
        <animate attributeName="cx" values="20;190;190" keyTimes="0;0.3;1" {...loop} />
        <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.3;0.32;1" {...loop} />
      </circle>
      {/* o urânio, que treme e se divide */}
      <g>
        <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.32;0.35;1" {...loop} />
        <circle cx="220" cy="110" r="34" fill="#4ade80" stroke="#15803d" strokeWidth="2.5" />
        <text x="220" y="115" textAnchor="middle" fontSize="13" fontWeight="900" fill="#14532d">
          U-235
        </text>
      </g>
      {[-1, 1].map((s) => (
        <g key={s} opacity="0">
          <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.32;0.35;0.9;1" {...loop} />
          <circle cx="220" cy="110" r="24" fill="#fde047" stroke="#a16207" strokeWidth="2">
            <animate attributeName="cy" values={`110;110;${110 + s * 60}`} keyTimes="0;0.33;1" {...loop} />
            <animate attributeName="cx" values="220;220;300" keyTimes="0;0.33;1" {...loop} />
          </circle>
        </g>
      ))}
      {/* o clarão de energia */}
      <circle cx="220" cy="110" r="10" fill="#fff7d6" opacity="0">
        <animate attributeName="r" values="10;10;80;80" keyTimes="0;0.33;0.5;1" {...loop} />
        <animate attributeName="opacity" values="0;0;0.8;0" keyTimes="0;0.33;0.4;0.55" {...loop} />
      </circle>
      {/* os novos nêutrons indo atrás de outros núcleos */}
      {[-50, 0, 50].map((dy) => (
        <circle key={dy} r="6" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" opacity="0">
          <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.34;0.36;0.9;1" {...loop} />
          <animate attributeName="cx" values="220;220;460" keyTimes="0;0.34;1" {...loop} />
          <animate attributeName="cy" values={`110;110;${110 + dy}`} keyTimes="0;0.34;1" {...loop} />
        </circle>
      ))}
      {[60, 110, 160].map((y) => (
        <circle key={y} cx="490" cy={y} r="20" fill="#4ade80" stroke="#15803d" strokeWidth="2" opacity="0.8" />
      ))}
      <g fontFamily="Georgia, serif" fontSize="12" fontWeight="900">
        <text x="20" y="96" fill="#475569">nêutron</text>
        <text x="420" y="210" fill="#15803d">outros núcleos: reação em cadeia</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 10, content, bare });

export const chapter10: BookPage[] = [
  page(
    <ChapterOpener
      n={10}
      title="Física Moderna"
      goals={["O que dizem a relatividade e a famosa E = mc²", "Por que a luz é feita de fótons", "Como o mundo quântico é diferente do nosso", "Como funciona a energia nuclear"]}
    >
      <Fig h={34}>
        <EinsteinOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="⏰">A relatividade</H>
      <P>
        No começo do século XX, <T>Albert Einstein</T> mudou a forma de enxergar o espaço e o tempo. A <T>teoria da relatividade</T> mostra que o tempo não passa igual para todo
        mundo: para quem viaja muito perto da velocidade da luz, ele passa <T>mais devagar</T>. É a <T>dilatação do tempo</T>.
      </P>
      <Fig n="10.1" caption="Na nave muito rápida, o relógio anda mais devagar que o da Terra." h={22}>
        <TimeDilationArt />
      </Fig>
      <P>
        A famosa <T>E = mc²</T> diz que massa e energia são duas formas da mesma coisa: um pouquinho de massa (m) vale uma quantidade enorme de energia, porque c (a velocidade
        da luz) ao quadrado é um número gigantesco.
      </P>
      <Box kind="sabia">
        Os satélites de <strong>GPS</strong> precisam de correções da relatividade: os relógios deles andam num ritmo um pouquinho diferente dos da Terra. Sem as correções, o
        erro de posição cresceria vários quilômetros por dia!
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="💡">A luz em pacotes: os fótons</H>
      <P>
        Em 1900, o alemão <T>Max Planck</T> propôs que a energia vem em pacotinhos, os <T>quanta</T>: ele é considerado o pai da física quântica. Einstein usou a ideia para
        explicar o <T>efeito fotoelétrico</T>: a luz arranca elétrons de um metal.
      </P>
      <Fig n="10.2" caption="Cada fóton que chega pode arrancar um elétron do metal." h={22}>
        <PhotoelectricArt />
      </Fig>
      <P>
        A luz chega em pacotes de energia, os <T>fótons</T>. Por essa descoberta, Einstein ganhou o <T>Nobel de Física de 1921</T>. A luz tem comportamento de <T>onda</T> e de{" "}
        <T>partícula</T> ao mesmo tempo. O efeito fotoelétrico está nas portas automáticas e nos painéis solares!
      </P>
    </>,
  ),

  page(
    <>
      <H icon="🎲">O mundo quântico</H>
      <P>
        No mundo muito pequeno dos átomos, as regras são diferentes. O <T>Princípio da Incerteza</T>, de <T>Werner Heisenberg</T>, diz que não dá para saber, ao mesmo tempo e com
        precisão total, a posição e a velocidade de uma partícula. Não é defeito dos instrumentos: é uma característica da natureza.
      </P>
      <Fig n="10.3" caption="Em vez de uma órbita, a física quântica fala da região onde o elétron provavelmente está." h={22}>
        <CloudArt />
      </Fig>
      <Cards
        items={[
          { icon: "🔦", title: "Laser e LED", text: "Funcionam graças à física quântica, como os chips dos celulares." },
          { icon: "🔬", title: "Marie Curie", text: "Estudou a radioatividade e foi a primeira pessoa a ganhar dois Nobel: Física (1903) e Química (1911)." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="⚛️">A energia nuclear</H>
      <P>
        Na <T>fissão nuclear</T>, um nêutron bate num núcleo pesado, como o do urânio, que se divide em dois e solta muita energia e novos nêutrons. Esses nêutrons dividem outros
        núcleos: é a <T>reação em cadeia</T>.
      </P>
      <Fig n="10.4" caption="A fissão do urânio: um pouquinho de massa vira muita energia (E = mc²)." h={22}>
        <FissionArt />
      </Fig>
      <List
        items={[
          <>
            As usinas nucleares, como as de <T>Angra dos Reis</T> (RJ), usam o calor da fissão para ferver água; o vapor gira as turbinas e gera eletricidade.
          </>,
          <>
            Na <T>fusão nuclear</T>, que acontece no Sol, núcleos leves de hidrogênio se juntam e formam hélio. Os cientistas ainda estudam como usá-la para gerar energia na
            Terra.
          </>,
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Relatividade (Einstein): o tempo passa mais devagar perto da velocidade da luz; o GPS precisa dessas correções.",
          "E = mc²: massa e energia são formas da mesma coisa.",
          "Planck (1900): a energia vem em pacotes. A luz é feita de fótons (Einstein, Nobel de 1921).",
          "Heisenberg: não dá para saber ao mesmo tempo a posição e a velocidade exatas de uma partícula.",
          "Fissão divide núcleos pesados (usinas); fusão junta núcleos leves (o Sol).",
        ]}
      />
      <Glossary
        items={[
          ["Fóton", "O pacotinho de energia da luz."],
          ["Dilatação do tempo", "O tempo passando mais devagar em alta velocidade."],
          ["Efeito fotoelétrico", "A luz arrancando elétrons de um metal."],
          ["Fissão", "A divisão de um núcleo pesado, que libera energia."],
          ["Fusão", "A união de núcleos leves, como no Sol."],
        ]}
      />
      <Quiz
        items={[
          ["O que significa E = mc²?", "Que massa e energia são equivalentes: um pouco de massa vale muita energia."],
          ["Por qual descoberta Einstein ganhou o Nobel de 1921?", "Pela explicação do efeito fotoelétrico."],
          ["Quem é considerado o pai da física quântica?", "Max Planck."],
          ["Como as usinas nucleares geram energia?", "Pela fissão nuclear, que aquece a água e faz o vapor girar as turbinas."],
        ]}
      />
    </>,
  ),
];
