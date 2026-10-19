"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Kid } from "./art";

// ============================================================================
// CAPÍTULO 6 — IGUALDADE E DIREITOS (missão "ODS: Igualdade e Direitos"):
// crianças diferentes de mãos dadas com a balança da justiça, o pergaminho
// da Declaração de 1948, os direitos do ECA, a cerca do jogo de futebol
// (igualdade × equidade, de tocar) e a escola acessível.
// ============================================================================

const SKINS = ["#f1c9a5", "#8d5524", "#d6a77a", "#5c3a1e", "#e0ac69", "#c68642"];
const SHIRTS = ["#e5243b", "#26bde2", "#fcc30b", "#4c9f38", "#dd1367", "#fd6925"];

// ---------------------------------------------------------------------------
// Abertura: as crianças de mãos dadas e a balança equilibrada
// ---------------------------------------------------------------------------

function RightsOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Seis crianças diferentes de mãos dadas e, em cima delas, uma balança da justiça equilibrada balançando devagar">
      <rect width="460" height="300" fill="#fdf4ff" />
      {/* a balança */}
      <g transform="translate(230 50)">
        <path d="M0 0 L0 90 M-30 96 L30 96" stroke="#a16207" strokeWidth="6" strokeLinecap="round" />
        <g>
          <animateTransform attributeName="transform" type="rotate" values="-6;6;-6" dur="4s" repeatCount="indefinite" />
          <path d="M-90 10 L90 10" stroke="#a16207" strokeWidth="5" strokeLinecap="round" />
          {[-80, 80].map((x) => (
            <g key={x} transform={`translate(${x} 10)`}>
              <path d="M0 0 L-18 36 M0 0 L18 36" stroke="#ca8a04" strokeWidth="2" />
              <path d="M-26 36 L26 36 Q0 56 -26 36 Z" fill="#fbbf24" stroke="#a16207" strokeWidth="2" />
            </g>
          ))}
        </g>
        <circle r="8" fill="#fbbf24" stroke="#a16207" strokeWidth="2" />
      </g>
      <rect y="262" width="460" height="38" fill="#e9d5ff" />
      {SHIRTS.map((shirt, i) => (
        <g key={i}>
          <Kid x={60 + i * 68} y={264} s={1.05} shirt={shirt} skin={SKINS[i]} hair={i % 2 ? "#1c1917" : "#78350f"} />
          {i < 5 && <path d={`M${78 + i * 68} 232 L${110 + i * 68} 232`} stroke={SKINS[i]} strokeWidth="5" strokeLinecap="round" />}
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A Declaração Universal dos Direitos Humanos (1948)
// ---------------------------------------------------------------------------

function DeclarationArt() {
  return (
    <Art viewBox="0 0 560 210" label="O pergaminho da Declaração Universal dos Direitos Humanos de 1948, que diz que todos nascem livres e iguais em dignidade e direitos">
      <rect width="560" height="210" rx="14" fill="#eff6ff" />
      <g transform="translate(150 20)">
        <rect x="0" y="10" width="260" height="160" fill="#fef3c7" stroke="#a16207" strokeWidth="2" />
        <rect x="-8" y="0" width="276" height="16" rx="8" fill="#d97706" />
        <rect x="-8" y="166" width="276" height="16" rx="8" fill="#d97706" />
        <text x="130" y="42" textAnchor="middle" fontSize="13" fontWeight="900" fill="#78350f" fontFamily="Georgia, serif">
          Declaração Universal dos
        </text>
        <text x="130" y="60" textAnchor="middle" fontSize="13" fontWeight="900" fill="#78350f" fontFamily="Georgia, serif">
          Direitos Humanos · 1948
        </text>
        <text x="130" y="94" textAnchor="middle" fontSize="12" fontStyle="italic" fill="#3b2a14" fontFamily="Georgia, serif">
          “Todos os seres humanos nascem
        </text>
        <text x="130" y="112" textAnchor="middle" fontSize="12" fontStyle="italic" fill="#3b2a14" fontFamily="Georgia, serif">
          livres e iguais em dignidade
        </text>
        <text x="130" y="130" textAnchor="middle" fontSize="12" fontStyle="italic" fill="#3b2a14" fontFamily="Georgia, serif">
          e em direitos.”
        </text>
        <circle cx="220" cy="148" r="12" fill="#dc2626" className="cg-anim-pop" />
      </g>
      <Kid x={70} y={190} s={1} shirt="#2563eb" skin={SKINS[1]} />
      <Kid x={490} y={190} s={1} shirt="#16a34a" skin={SKINS[4]} />
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Igualdade × equidade (de tocar)
// ---------------------------------------------------------------------------

/** As alturas das três crianças e quantas caixas cada uma ganha em cada jeito. */
const VIEWERS = [
  { h: 1.4, skin: SKINS[0], shirt: "#2563eb", equal: 1, equity: 0 },
  { h: 1.0, skin: SKINS[3], shirt: "#16a34a", equal: 1, equity: 1 },
  { h: 0.7, skin: SKINS[2], shirt: "#e5243b", equal: 1, equity: 2 },
];

export function EquityToggle() {
  const [equity, setEquity] = useState(false);
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.5em]">
      <svg viewBox="0 0 520 220" className="block w-full rounded-lg" aria-label={equity ? "Equidade: cada criança ganha as caixas de que precisa e todas veem o jogo" : "Igualdade: todas ganham uma caixa, mas a menor ainda não vê o jogo"}>
        <rect width="520" height="220" fill="#bae6fd" />
        <rect y="40" width="520" height="70" fill="#4ade80" />
        <path d="M60 80 L460 80" stroke="#fff" strokeWidth="2" />
        <circle cx="300" cy="75" r="6" fill="#fff" stroke="#1e293b">
          <animate attributeName="cx" values="200;360;200" dur="3s" repeatCount="indefinite" />
        </circle>
        <rect y="200" width="520" height="20" fill="#a16207" />
        {/* a cerca */}
        <rect x="40" y="134" width="440" height="66" fill="#92400e" />
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={46 + i * 36} y="126" width="28" height="74" rx="4" fill="#b45309" stroke="#78350f" />
        ))}
        {VIEWERS.map((v, i) => {
          const boxes = equity ? v.equity : v.equal;
          const x = 120 + i * 140;
          const top = 200 - boxes * 34;
          // os olhos ficam 54 × h acima do pé; vê o jogo quem tem os olhos acima da cerca (y 126)
          const sees = top - 54 * v.h < 126;
          return (
            <g key={i}>
              {Array.from({ length: boxes }, (_, k) => (
                <g key={k} className="cg-anim-pop" style={{ animationDelay: `${k * 0.1}s` }}>
                  <rect x={x - 26} y={200 - (k + 1) * 34} width="52" height="34" fill="#fde68a" stroke="#a16207" strokeWidth="2" />
                  <path d={`M${x - 26} ${200 - (k + 1) * 34} L${x + 26} ${200 - k * 34}`} stroke="#ca8a04" strokeWidth="1.5" />
                </g>
              ))}
              <g style={{ transform: `translateY(${top - 200}px)`, transition: "transform 0.6s" }}>
                <Kid x={x} y={200} s={v.h} shirt={v.shirt} skin={v.skin} />
              </g>
              <text x={x} y="30" textAnchor="middle" fontSize="18">
                {sees ? "😄" : "😕"}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-[0.35em] flex justify-center gap-[0.4em] text-[0.88em]">
        <button type="button" onClick={() => setEquity(false)} className={`rounded-full border px-[0.8em] py-[0.1em] font-bold ${!equity ? "border-[#2563eb] bg-[#2563eb] text-white" : "border-[#d9c79d] bg-white"}`}>
          Igualdade
        </button>
        <button type="button" onClick={() => setEquity(true)} className={`rounded-full border px-[0.8em] py-[0.1em] font-bold ${equity ? "border-[#16a34a] bg-[#16a34a] text-white" : "border-[#d9c79d] bg-white"}`}>
          Equidade
        </button>
      </div>
      <p key={String(equity)} className="cg-anim-fade mt-[0.35em] rounded-lg bg-[#f0fdf4] px-[0.7em] py-[0.3em] text-[0.86em] leading-[1.4] text-[#14532d]">
        {equity
          ? "Equidade: cada um recebe o apoio de que precisa. Agora as três crianças veem o jogo!"
          : "Igualdade: todos recebem a mesma coisa. Mas a criança menor continua sem ver o jogo."}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A escola acessível
// ---------------------------------------------------------------------------

function AccessibleSchoolArt() {
  return (
    <Art viewBox="0 0 560 220" label="Uma escola acessível: a rampa com uma cadeira de rodas subindo, o piso tátil no chão e uma intérprete de Libras ao lado do quadro">
      <rect width="560" height="220" rx="14" fill="#f0fdf4" />
      <rect x="200" y="40" width="330" height="150" fill="#fef3c7" stroke="#92400e" strokeWidth="2" />
      <rect x="220" y="60" width="140" height="80" fill="#14532d" stroke="#78350f" strokeWidth="4" />
      <text x="290" y="96" textAnchor="middle" fontSize="15" fontWeight="900" fill="#f0fdf4" fontFamily="Georgia, serif">
        Bem-vindos!
      </text>
      <text x="290" y="118" textAnchor="middle" fontSize="12" fill="#bbf7d0" fontFamily="Georgia, serif">
        todo mundo aprende
      </text>
      {/* a intérprete de Libras, com as mãos mexendo */}
      <g transform="translate(420 160)">
        <Kid x={0} y={20} s={1.15} shirt="#7c3aed" skin={SKINS[3]} />
        {[-1, 1].map((side) => (
          <circle key={side} cx={side * 18} cy="-40" r="6" fill={SKINS[3]}>
            <animate attributeName="cy" values="-40;-56;-40" dur={side < 0 ? "1s" : "1.3s"} repeatCount="indefinite" />
          </circle>
        ))}
        <text x="0" y="-66" textAnchor="middle" fontSize="11" fontWeight="900" fill="#5b21b6" fontFamily="Georgia, serif">
          Libras
        </text>
      </g>
      {/* a rampa */}
      <path d="M20 190 L200 190 L200 150 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
      <path d="M30 186 L200 154" stroke="#94a3b8" strokeWidth="2" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;120 -22;120 -22;0 0" keyTimes="0;0.6;0.85;1" dur="7s" repeatCount="indefinite" />
        <g transform="translate(60 178) rotate(-12)">
          <circle cx="0" cy="0" r="12" fill="none" stroke="#1d4ed8" strokeWidth="3" />
          <path d="M0 0 L0 -26 L16 -26 M0 -12 L18 -12 L22 0" stroke="#1d4ed8" strokeWidth="3" fill="none" />
          <circle cx="4" cy="-38" r="7" fill={SKINS[2]} />
          <rect x="-2" y="-31" width="12" height="18" rx="4" fill="#f59e0b" />
        </g>
      </g>
      {/* o piso tátil */}
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={210 + i * 30} y="194" width="24" height="10" rx="2" fill="#facc15" />
      ))}
      <g fontFamily="Georgia, serif" fontSize="11.5" fontWeight="900" fill="#1e293b">
        <text x="40" y="140">rampa</text>
        <text x="300" y="216">piso tátil</text>
      </g>
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
      title="Igualdade e Direitos"
      goals={["O que são os direitos humanos", "Os direitos das crianças e dos adolescentes (ECA)", "A diferença entre igualdade e equidade", "As leis que protegem e incluem as pessoas"]}
    >
      <Fig h={34}>
        <RightsOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="📜">Os direitos humanos</H>
      <P>
        Depois da Segunda Guerra Mundial, em <T>1948</T>, a ONU aprovou a <T>Declaração Universal dos Direitos Humanos</T>. Ela diz que todas as pessoas têm direitos,
        sem importar a cor, o gênero, a religião, a origem ou a renda.
      </P>
      <Fig n="6.1" caption="A Declaração de 1948 vale para todos os seres humanos." h={21}>
        <DeclarationArt />
      </Fig>
      <Box kind="lembre">
        O <strong>ODS 10</strong> quer reduzir as desigualdades, e o <strong>ODS 16</strong> quer paz, justiça e instituições que funcionem para todos.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🧒">Os direitos das crianças</H>
      <P>
        No Brasil, o <T>ECA (Estatuto da Criança e do Adolescente)</T>, de <T>1990</T>, garante os direitos de quem tem menos de 18 anos: educação, saúde, lazer,
        convivência com a família e proteção contra a violência e o <T>trabalho infantil</T>.
      </P>
      <Cards
        items={[
          { icon: "🏫", title: "Educação", text: "Toda criança tem direito a estudar numa escola de qualidade." },
          { icon: "⚽", title: "Brincar", text: "O lazer e o descanso também são direitos." },
          { icon: "🛡️", title: "Proteção", text: "Nenhuma criança pode sofrer violência ou ser obrigada a trabalhar." },
          { icon: "📞", title: "Disque 100", text: "O número gratuito para denunciar violações de direitos humanos." },
        ]}
      />
      <Box kind="sabia">
        <strong>Malala Yousafzai</strong>, do Paquistão, foi atacada por defender o direito das meninas de estudar. Em 2014, com 17 anos, ela ganhou o Nobel da Paz.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="⚖️">Igualdade ou equidade?</H>
      <P>
        <T>Igualdade</T> é dar a mesma coisa para todos. <T>Equidade</T> é dar a cada pessoa o apoio de que ela precisa para ter as mesmas oportunidades. Compare:
      </P>
      <EquityToggle />
      <P>
        A <T>Lei de Cotas</T> (2012) é um exemplo de equidade: ela reserva vagas nas universidades federais para estudantes de escolas públicas, com parte para pretos,
        pardos, indígenas e pessoas com deficiência.
      </P>
    </>,
  ),

  page(
    <>
      <H icon="♿">Leis que protegem e incluem</H>
      <Fig n="6.2" caption="A escola acessível: rampa, piso tátil e Libras." h={21}>
        <AccessibleSchoolArt />
      </Fig>
      <Table
        head={["Ano", "Lei", "O que garante"]}
        rows={[
          ["2002", "Lei da Libras", "A Libras é reconhecida como meio legal de comunicação"],
          ["2006", "Lei Maria da Penha", "Combate à violência doméstica contra a mulher"],
          ["2012", "Lei de Cotas", "Vagas reservadas nas universidades federais"],
          ["2015", "Lei Brasileira de Inclusão", "Acessibilidade e inclusão das pessoas com deficiência"],
        ]}
      />
      <Box kind="atencao">
        O <strong>trabalho análogo à escravidão</strong> (forçado, com jornadas exaustivas ou por dívida) ainda existe e é crime. Denúncias podem ser feitas pelo Disque
        100.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "A Declaração Universal dos Direitos Humanos (1948) diz que todos nascem livres e iguais em direitos.",
          "O ECA (1990) garante os direitos das crianças e dos adolescentes no Brasil.",
          "Igualdade é dar o mesmo a todos; equidade é dar a cada um o que precisa.",
          "Leis de inclusão: Libras (2002), Maria da Penha (2006), Cotas (2012) e LBI (2015).",
          "Os ODS 5, 10 e 16 tratam de igualdade, inclusão, paz e justiça.",
        ]}
      />
      <Glossary
        items={[
          ["Direitos humanos", "Direitos que toda pessoa tem, só por ser humana."],
          ["ECA", "Estatuto da Criança e do Adolescente (1990)."],
          ["Equidade", "Dar a cada um o apoio de que precisa."],
          ["Libras", "Língua Brasileira de Sinais, da comunidade surda."],
          ["Acessibilidade", "Lugares e serviços que todos conseguem usar."],
        ]}
      />
      <Quiz
        items={[
          ["Em que ano foi aprovada a Declaração Universal dos Direitos Humanos?", "1948."],
          ["Qual lei garante os direitos das crianças e dos adolescentes no Brasil?", "O ECA, de 1990."],
          ["O que é equidade?", "Dar a cada pessoa o apoio de que ela precisa para ter as mesmas oportunidades."],
          ["Quem ganhou o Nobel da Paz em 2014 lutando pela educação das meninas?", "Malala Yousafzai."],
        ]}
      />
    </>,
  ),
];
