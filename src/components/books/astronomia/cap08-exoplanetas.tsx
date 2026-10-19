"use client";

import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Earth, Planet, Stars, Sun } from "./art";

// ============================================================================
// CAPÍTULO 8 — EXOPLANETAS E ASTROFÍSICA (missão "Astronomia: Exoplanetas e
// Astrofísica"): a galáxia espiral girando, as distâncias (a unidade
// astronômica e a Voyager 1), o planeta passando na frente da estrela e a
// curva de brilho caindo junto, a zona habitável e o pulsar girando como um
// farol, ao lado de um buraco negro.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a galáxia espiral girando
// ---------------------------------------------------------------------------

function GalaxyOpenerArt() {
  const arms = Array.from({ length: 160 }, (_, i) => {
    const arm = i % 2;
    const t = (i / 160) * 3.2;
    const a = t * 2.2 + arm * Math.PI;
    const r = 12 + t * 38;
    return [Math.cos(a) * r, Math.sin(a) * r * 0.55, (i * 7) % 3] as [number, number, number];
  });
  return (
    <Art viewBox="0 0 460 300" label="Uma galáxia espiral, com os braços cheios de estrelas girando em volta do centro brilhante">
      <rect width="460" height="300" fill="#020617" />
      <Stars w={460} h={300} n={40} seed={59} />
      <g transform="translate(230 150)">
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="60s" repeatCount="indefinite" />
          {arms.map(([x, y, k], i) => (
            <circle key={i} cx={x} cy={y} r={0.8 + k * 0.7} fill={["#e0f2fe", "#c4b5fd", "#fde68a"][k]} opacity="0.85" />
          ))}
        </g>
        <ellipse rx="34" ry="20" fill="#fef9c3" opacity="0.85" className="cg-anim-glow" />
        <ellipse rx="70" ry="36" fill="#c4b5fd" opacity="0.15" />
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As distâncias: 1 UA, a luz do Sol e a Voyager 1
// ---------------------------------------------------------------------------

function DistanceArt() {
  return (
    <Art viewBox="0 0 600 200" label="A distância da Terra ao Sol é 1 unidade astronômica, que a luz atravessa em cerca de 8 minutos; Júpiter fica a 5,2 UA; a sonda Voyager 1 já está muito mais longe">
      <rect width="600" height="200" rx="14" fill="#020617" />
      <Stars w={600} h={200} n={30} seed={61} />
      <Sun x={40} y={100} r={26} />
      <Earth x={140} y={100} r={10} />
      <Planet x={300} y={100} r={18} color="#fde7c4" dark="#b45309" bands="#92400e" />
      {/* a luz viajando até a Terra */}
      <circle cy="100" r="4" fill="#fde047">
        <animate attributeName="cx" values="66;130" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <path d="M40 140 L140 140" stroke="#fde68a" strokeWidth="2" />
      <text x="90" y="158" textAnchor="middle" fontSize="11.5" fontWeight="900" fill="#fde68a" fontFamily="Georgia, serif">
        1 UA ≈ 150 milhões de km
      </text>
      <text x="90" y="174" textAnchor="middle" fontSize="10.5" fill="#e2e8f0" fontFamily="Georgia, serif">
        a luz leva 8 min 20 s
      </text>
      <text x="300" y="140" textAnchor="middle" fontSize="11.5" fontWeight="900" fill="#fdba74" fontFamily="Georgia, serif">
        Júpiter: 5,2 UA
      </text>
      {/* a Voyager 1 indo embora */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;40 -10;0 0" dur="6s" repeatCount="indefinite" />
        <g transform="translate(500 70)">
          <circle r="12" fill="none" stroke="#e2e8f0" strokeWidth="2" />
          <path d="M-12 0 L12 0 M0 0 L30 -14" stroke="#e2e8f0" strokeWidth="2" />
          <circle r="5" fill="#fbbf24" />
        </g>
      </g>
      <text x="510" y="120" textAnchor="middle" fontSize="11.5" fontWeight="900" fill="#e2e8f0" fontFamily="Georgia, serif">
        Voyager 1 (1977)
      </text>
      <text x="510" y="136" textAnchor="middle" fontSize="10.5" fill="#cbd5e1" fontFamily="Georgia, serif">
        o objeto humano mais distante
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O método do trânsito: o planeta passa e o brilho cai
// ---------------------------------------------------------------------------

const TRANSIT_DUR = 6;

function TransitArt() {
  const loop = { dur: `${TRANSIT_DUR}s`, repeatCount: "indefinite" };
  // a curva de brilho: reta, cai enquanto o planeta passa (40% a 60% do tempo), volta
  const curve = "M60 140 L250 140 L262 168 L338 168 L350 140 L540 140";
  return (
    <Art viewBox="0 0 600 220" label="Um planeta passa na frente da sua estrela, e o gráfico do brilho da estrela cai um pouquinho bem nessa hora">
      <rect width="600" height="220" rx="14" fill="#020617" />
      <circle cx="300" cy="60" r="44" fill="#fde047" className="cg-anim-glow" />
      <circle cx="300" cy="60" r="38" fill="#fef9c3" />
      <circle cy="62" r="9" fill="#0f172a">
        <animate attributeName="cx" values="120;480" {...loop} />
      </circle>
      {/* o gráfico */}
      <path d="M60 120 L60 190 L540 190" stroke="#64748b" strokeWidth="1.5" fill="none" />
      <path d={curve} stroke="#fde047" strokeWidth="3" fill="none" />
      <circle r="5" fill="#f97316">
        <animateMotion path={curve} {...loop} />
      </circle>
      <g fontFamily="Georgia, serif" fontSize="11.5" fontWeight="900">
        <text x="40" y="146" textAnchor="end" fill="#e2e8f0">brilho</text>
        <text x="540" y="206" textAnchor="end" fill="#e2e8f0">tempo</text>
        <text x="300" y="186" textAnchor="middle" fill="#fdba74">o planeta passou!</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A zona habitável
// ---------------------------------------------------------------------------

function HabitableZoneArt() {
  return (
    <Art viewBox="0 0 600 230" label="A zona habitável de uma estrela: perto demais a água ferve, longe demais congela; na faixa verde, ela pode ficar líquida">
      <rect width="600" height="230" rx="14" fill="#020617" />
      <g transform="translate(70 115)">
        <circle r="300" fill="#38bdf8" opacity="0.18" />
        <circle r="210" fill="#22c55e" opacity="0.3" />
        <circle r="130" fill="#ef4444" opacity="0.3" />
        <Sun r={36} />
      </g>
      <Planet x={170} y={130} r={12} color="#fca5a5" dark="#991b1b" />
      <Earth x={240} y={90} r={14} />
      <Planet x={340} y={150} r={16} color="#e0f2fe" dark="#64748b" />
      <g fontFamily="Georgia, serif" fontSize="12.5" fontWeight="900">
        <text x="150" y="40" fill="#fca5a5">quente demais:</text>
        <text x="150" y="56" fill="#fca5a5" fontWeight="700">a água ferve</text>
        <text x="236" y="190" fill="#86efac">zona habitável:</text>
        <text x="236" y="206" fill="#86efac" fontWeight="700">água líquida</text>
        <text x="420" y="60" fill="#bae6fd">frio demais:</text>
        <text x="420" y="76" fill="#bae6fd" fontWeight="700">a água congela</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O pulsar girando como um farol e o buraco negro
// ---------------------------------------------------------------------------

function PulsarBlackHoleArt() {
  return (
    <Art viewBox="0 0 600 220" label="Um pulsar girando e lançando feixes de luz como um farol, e um buraco negro com o disco de gás brilhante girando em volta">
      <rect width="600" height="220" rx="14" fill="#020617" />
      <Stars w={600} h={220} n={40} seed={67} />
      {/* o pulsar */}
      <g transform="translate(150 110)">
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1.5s" repeatCount="indefinite" />
          <path d="M0 0 L-16 -110 L16 -110 Z M0 0 L-16 110 L16 110 Z" fill="#93c5fd" opacity="0.45" />
        </g>
        <circle r="10" fill="#e0f2fe" className="cg-anim-glow" />
        <text y="104" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#bfdbfe" fontFamily="Georgia, serif">
          pulsar
        </text>
      </g>
      {/* o buraco negro */}
      <g transform="translate(430 110)">
        <ellipse rx="110" ry="26" fill="#f97316" opacity="0.25" />
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="5s" repeatCount="indefinite" />
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i / 24) * Math.PI * 2;
            return <circle key={i} cx={Math.cos(a) * 80} cy={Math.sin(a) * 80} r="3" fill="#fdba74" />;
          })}
        </g>
        <ellipse rx="86" ry="20" fill="none" stroke="#fb923c" strokeWidth="6" opacity="0.8" />
        <circle r="34" fill="#000" stroke="#fde68a" strokeWidth="2" />
        <text y="104" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#fdba74" fontFamily="Georgia, serif">
          buraco negro
        </text>
      </g>
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
      title="Exoplanetas e Astrofísica"
      goals={["Como medir as distâncias no universo", "Como os astrônomos descobrem planetas em outras estrelas", "O que é a zona habitável", "O que sobra quando uma estrela gigante morre"]}
    >
      <Fig h={34}>
        <GalaxyOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="📏">As distâncias no universo</H>
      <P>
        O universo é tão grande que precisamos de unidades especiais. A <T>unidade astronômica (UA)</T> é a distância da Terra ao Sol, cerca de <T>150 milhões de km</T>, e serve
        para medir distâncias dentro do Sistema Solar. Para as estrelas, usamos o <T>ano-luz</T>: a distância que a luz percorre em um ano (quase 10 trilhões de km).
      </P>
      <Fig n="8.1" caption="A luz do Sol leva cerca de 8 minutos para chegar até nós." h={22}>
        <DistanceArt />
      </Fig>
      <List
        items={[
          <>
            A sonda <T>Voyager 1</T>, lançada em 1977, é o objeto feito por humanos mais distante da Terra. Ela já saiu da heliosfera e leva um disco de ouro com sons e imagens da
            Terra.
          </>,
          <>
            A Terra e o Sistema Solar se formaram há cerca de <T>4,6 bilhões de anos</T>, a partir de uma nuvem de gás e poeira.
          </>,
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="💫">Exoplanetas</H>
      <P>
        <T>Exoplanetas</T> são planetas que giram em volta de <em>outras</em> estrelas. O primeiro em volta de uma estrela parecida com o Sol foi descoberto em <T>1995</T>; hoje já
        se conhecem <T>mais de 5 mil</T>. O jeito mais usado de achá-los é o <T>método do trânsito</T>:
      </P>
      <Fig n="8.2" caption="Quando o planeta passa na frente da estrela, o brilho dela cai um pouquinho." h={24}>
        <TransitArt />
      </Fig>
      <P>
        É como uma mosca passando na frente de uma lanterna. A queda no brilho revela o tamanho do planeta, e o tempo entre uma passagem e outra mostra quanto dura a órbita. O
        telescópio espacial <T>Kepler</T> (2009) observou mais de 150 mil estrelas ao mesmo tempo esperando esses pequenos &ldquo;apagões&rdquo;.
      </P>
    </>,
  ),

  page(
    <>
      <H icon="💧">A zona habitável</H>
      <P>
        A <T>zona habitável</T> é a faixa em volta de uma estrela onde a temperatura permite que exista <T>água líquida</T> na superfície de um planeta, algo essencial para a
        vida como conhecemos. A Terra está bem no meio da zona habitável do Sol.
      </P>
      <Fig n="8.3" caption="Nem perto demais, nem longe demais da estrela." h={24}>
        <HabitableZoneArt />
      </Fig>
      <Box kind="sabia">
        O sistema <strong>TRAPPIST-1</strong>, a cerca de 40 anos-luz, tem sete planetas rochosos, e vários deles estão na zona habitável. É um dos melhores lugares para estudar
        atmosferas de planetas parecidos com a Terra.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🌀">Estrelas de nêutrons e buracos negros</H>
      <P>
        Quando uma estrela muito grande explode como supernova, o centro dela desaba. Pode sobrar uma <T>estrela de nêutrons</T>: mais massa que o Sol inteiro num tamanho de uma
        cidade! As que giram mandando pulsos de luz são os <T>pulsares</T>, que parecem faróis no espaço.
      </P>
      <Fig n="8.4" caption="O pulsar girando como um farol e o buraco negro com o disco de gás." h={24}>
        <PulsarBlackHoleArt />
      </Fig>
      <Cards
        items={[
          { icon: "⚫", title: "Buraco negro", text: "Se a estrela era ainda maior, sobra um buraco negro: a gravidade é tão forte que nem a luz escapa." },
          { icon: "🔭", title: "Hubble", text: "Lançado em 1990, enxerga melhor por estar acima da atmosfera, que faz as estrelas tremerem." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "1 UA ≈ 150 milhões de km (Terra–Sol); ano-luz é a distância que a luz anda em um ano.",
          "A Voyager 1 (1977) é o objeto humano mais distante; a Terra tem cerca de 4,6 bilhões de anos.",
          "Exoplanetas giram em outras estrelas; o método do trânsito vê o brilho da estrela cair.",
          "A zona habitável é onde a água pode ser líquida; TRAPPIST-1 tem sete planetas rochosos.",
          "Estrelas gigantes viram estrelas de nêutrons (pulsares) ou buracos negros.",
        ]}
      />
      <Glossary
        items={[
          ["Unidade astronômica", "A distância média entre a Terra e o Sol."],
          ["Ano-luz", "A distância que a luz percorre em um ano."],
          ["Exoplaneta", "Planeta que gira em volta de outra estrela."],
          ["Zona habitável", "A região onde a água pode ficar líquida."],
          ["Pulsar", "Estrela de nêutrons que gira mandando pulsos de luz."],
        ]}
      />
      <Quiz
        items={[
          ["O que é um exoplaneta?", "Um planeta que gira em volta de outra estrela, fora do Sistema Solar."],
          ["Como funciona o método do trânsito?", "O brilho da estrela cai um pouquinho quando o planeta passa na frente dela."],
          ["Qual sonda é o objeto humano mais distante da Terra?", "A Voyager 1, lançada em 1977."],
          ["O que é a zona habitável?", "A faixa em volta da estrela onde a água pode existir líquida."],
        ]}
      />
    </>,
  ),
];
