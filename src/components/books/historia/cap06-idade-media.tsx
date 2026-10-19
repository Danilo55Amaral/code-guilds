"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table, useUid } from "../BookParts";
import type { BookPage } from "../types";
import { Robed } from "./art";

// ============================================================================
// CAPÍTULO 6 — A IDADE MÉDIA (missão "História: Idade Média e Grandes
// Navegações", a parte da Idade Média): o castelo com as bandeiras e o
// cavaleiro, a pirâmide da sociedade feudal (de tocar), o monge copiando o
// livro à luz de vela, a feira da cidade medieval e o rato da peste negra.
// ============================================================================

/** Um castelo (o meio da base em x, y), com as bandeiras tremulando. */
function Castle({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-70" y="-70" width="140" height="70" fill="#a8a29e" stroke="#57534e" strokeWidth="2" />
      {[-70, 40].map((tx) => (
        <g key={tx}>
          <rect x={tx} y="-110" width="30" height="110" fill="#d6d3d1" stroke="#57534e" strokeWidth="2" />
          <path d={`M${tx - 4} -110 L${tx + 15} -136 L${tx + 34} -110 Z`} fill="#1d4ed8" />
          <path d={`M${tx + 15} -136 L${tx + 15} -150`} stroke="#57534e" strokeWidth="2" />
          <path fill="#dc2626">
            <animate attributeName="d" values={`M${tx + 15} -150 L${tx + 32} -146 L${tx + 15} -142 Z;M${tx + 15} -150 L${tx + 30} -142 L${tx + 15} -142 Z;M${tx + 15} -150 L${tx + 32} -146 L${tx + 15} -142 Z`} dur="1.5s" repeatCount="indefinite" />
          </path>
        </g>
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={-66 + i * 24} y="-80" width="14" height="10" fill="#a8a29e" stroke="#57534e" />
      ))}
      <path d="M-16 0 L-16 -34 Q0 -50 16 -34 L16 0 Z" fill="#78350f" />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Abertura: o castelo e o cavaleiro
// ---------------------------------------------------------------------------

function CastleOpenerArt() {
  const u = useUid("cavaleiro");
  return (
    <Art viewBox="0 0 460 300" label="Um castelo medieval no alto de uma colina com bandeiras tremulando, a aldeia dos camponeses embaixo e um cavaleiro de armadura cavalgando">
      <rect width="460" height="300" fill="#dbeafe" />
      <path d="M0 200 Q140 110 280 150 Q380 180 460 140 L460 300 L0 300 Z" fill="#65a30d" />
      <Castle x={260} y={150} s={0.95} />
      {/* a aldeia */}
      {[60, 110, 160].map((x, i) => (
        <g key={x} transform={`translate(${x} 250)`}>
          <rect x="-16" y="-20" width="32" height="20" fill="#fde68a" stroke="#92400e" />
          <path d="M-20 -20 L0 -36 L20 -20 Z" fill="#a16207" />
          <rect x="-4" y="-12" width="8" height="12" fill="#78350f" />
          {i === 1 && <path d="M8 -30 Q14 -44 8 -56" stroke="#a8a29e" strokeWidth="3" fill="none" className="cg-anim-float" />}
        </g>
      ))}
      {/* o cavaleiro */}
      <defs>
        <clipPath id={u}>
          <rect width="460" height="300" rx="14" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${u})`}>
        <animateTransform attributeName="transform" type="translate" values="-80 0;520 0" dur="11s" repeatCount="indefinite" />
        <g transform="translate(0 270)">
          <ellipse rx="26" ry="11" fill="#f5f5f4" stroke="#78716c" />
          <path d="M18 -6 L32 -22 L38 -14 L26 -2" fill="#f5f5f4" stroke="#78716c" />
          <path d="M-16 8 L-20 24 M-6 8 L-6 24 M8 8 L8 24 M16 6 L20 22" stroke="#78716c" strokeWidth="3" />
          <rect x="-8" y="-34" width="16" height="22" rx="4" fill="#94a3b8" />
          <circle cy="-40" r="8" fill="#94a3b8" />
          <path d="M8 -26 L44 -50" stroke="#78350f" strokeWidth="3" />
          <path d="M-14 -30 L-2 -30 L-2 -14 Q-8 -8 -14 -14 Z" fill="#dc2626" />
        </g>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A pirâmide da sociedade feudal (de tocar)
// ---------------------------------------------------------------------------

const LAYERS = [
  { name: "Rei", color: "#ca8a04", text: "Dava terras aos nobres em troca de lealdade e soldados. Mas, na prática, os senhores feudais tinham muito poder nas suas terras." },
  { name: "Nobreza e clero", color: "#7c3aed", text: "Os senhores feudais eram donos dos feudos e os protegiam com cavaleiros. O clero (padres, bispos, monges) cuidava da religião e também tinha muitas terras." },
  { name: "Servos e camponeses", color: "#15803d", text: "A grande maioria. Trabalhavam a terra do senhor em troca de proteção, pagando com trabalho e parte da colheita. Não podiam deixar o feudo." },
];

export function FeudalPyramid() {
  const [sel, setSel] = useState(2);
  const l = LAYERS[sel];
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.5em]">
      <svg viewBox="0 0 520 190" className="block w-full" aria-label="A pirâmide da sociedade feudal: o rei no alto, a nobreza e o clero no meio e os servos na base">
        {LAYERS.map((layer, i) => {
          const top = 10 + i * 58;
          const half = 50 + i * 80;
          const halfB = 50 + (i + 1) * 80;
          return (
            <g key={layer.name} onClick={() => setSel(i)} style={{ cursor: "pointer" }}>
              <path d={`M${260 - half} ${top} L${260 + half} ${top} L${260 + halfB} ${top + 56} L${260 - halfB} ${top + 56} Z`} fill={layer.color} opacity={sel === i ? 1 : 0.55} stroke="#fff" strokeWidth="3" />
              <text x="260" y={top + 34} textAnchor="middle" fontSize="16" fontWeight="900" fill="#fff" fontFamily="Georgia, serif">
                {layer.name}
              </text>
            </g>
          );
        })}
      </svg>
      <p key={sel} className="cg-anim-fade mt-[0.3em] rounded-lg px-[0.7em] py-[0.3em] text-[0.86em] leading-[1.4] text-[#1e293b]" style={{ background: `${l.color}1f` }}>
        <strong>{l.name}:</strong> {l.text}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// O monge copiando o livro
// ---------------------------------------------------------------------------

function MonkArt() {
  return (
    <Art viewBox="0 0 560 200" label="Um monge copista no mosteiro escrevendo um livro à mão, com a luz de uma vela tremulando e as letras coloridas aparecendo na página">
      <rect width="560" height="200" rx="14" fill="#292524" />
      <path d="M60 20 L60 200 M500 20 L500 200" stroke="#44403c" strokeWidth="20" />
      <path d="M60 30 Q280 -20 500 30" stroke="#44403c" strokeWidth="20" fill="none" />
      {/* a vela */}
      <g transform="translate(380 140)">
        <circle cy="-40" r="40" fill="#fde047" opacity="0.15">
          <animate attributeName="r" values="34;44;34" dur="0.8s" repeatCount="indefinite" />
        </circle>
        <rect x="-6" y="-30" width="12" height="30" fill="#fef3c7" />
        <path fill="#f59e0b">
          <animate attributeName="d" values="M0 -46 Q6 -38 0 -30 Q-6 -38 0 -46 Z;M1 -50 Q7 -38 0 -30 Q-6 -38 1 -50 Z;M0 -46 Q6 -38 0 -30 Q-6 -38 0 -46 Z" dur="0.6s" repeatCount="indefinite" />
        </path>
      </g>
      {/* o livro e as letras aparecendo */}
      <path d="M200 150 L340 150 L330 120 L210 120 Z" fill="#78350f" />
      <rect x="214" y="96" width="112" height="30" fill="#fef3c7" />
      <text x="222" y="118" fontSize="20" fontWeight="900" fill="#b91c1c" fontFamily="Georgia, serif">
        A
      </text>
      {[0, 1].map((k) => (
        <line key={k} x1="242" y1={106 + k * 10} x2="242" y2={106 + k * 10} stroke="#1e293b" strokeWidth="2.5">
          <animate attributeName="x2" values="242;318;318" keyTimes="0;0.8;1" dur="4s" begin={`${-k * 2}s`} repeatCount="indefinite" />
        </line>
      ))}
      <Robed x={170} y={190} s={1.5} robe="#78350f" sash="#57534e" skin="#e0ac69" hair="#78350f" />
      <text x="400" y="186" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#fde68a" fontFamily="Georgia, serif">
        cada livro era copiado à mão
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A feira da cidade medieval
// ---------------------------------------------------------------------------

function FairArt() {
  return (
    <Art viewBox="0 0 560 200" label="Uma feira numa cidade medieval cercada por muralhas, com barracas coloridas vendendo tecidos e especiarias trazidos do Oriente">
      <rect width="560" height="200" rx="14" fill="#fef3c7" />
      <path d="M0 60 L560 60" stroke="#a8a29e" strokeWidth="14" />
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} x={i * 42} y="44" width="18" height="12" fill="#a8a29e" />
      ))}
      <rect y="150" width="560" height="50" fill="#d6a77a" />
      {[
        { x: 90, c: "#dc2626", item: "🧣" },
        { x: 230, c: "#2563eb", item: "🌶️" },
        { x: 370, c: "#16a34a", item: "🧀" },
        { x: 490, c: "#9333ea", item: "🍷" },
      ].map((b, i) => (
        <g key={b.x} transform={`translate(${b.x} 150)`}>
          <path d="M-46 -60 L46 -60 L40 -46 L-40 -46 Z" fill={b.c} />
          <path d="M-46 -60 L-30 -46 M-14 -60 L2 -46 M18 -60 L34 -46" stroke="#fff" strokeWidth="5" opacity="0.6" />
          <path d="M-40 -46 L-40 0 M40 -46 L40 0" stroke="#78350f" strokeWidth="4" />
          <rect x="-40" y="-20" width="80" height="20" fill="#92400e" />
          <text y="-24" textAnchor="middle" fontSize="20" className="cg-anim-float" style={{ animationDelay: `${i * 0.3}s` }}>
            {b.item}
          </text>
        </g>
      ))}
      <text x="280" y="190" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#78350f" fontFamily="Georgia, serif">
        as feiras fizeram as cidades crescerem
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
      title="A Idade Média"
      goals={["Como funcionava o feudalismo", "O poder da Igreja Católica", "As Cruzadas e o renascimento do comércio", "A peste negra e o fim da Idade Média"]}
    >
      <Fig h={34}>
        <CastleOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🏰">O feudalismo</H>
      <P>
        Depois da queda de Roma, em 476, a Europa entrou na <T>Idade Média</T>. A terra virou a principal riqueza, e a sociedade se organizou no <T>feudalismo</T>:
        os servos trabalhavam a terra de um senhor (o <T>feudo</T>) em troca de proteção. Toque nas partes da pirâmide:
      </P>
      <FeudalPyramid />
    </>,
  ),

  page(
    <>
      <H icon="⛪">A Igreja Católica</H>
      <P>
        A <T>Igreja Católica</T> era a instituição mais poderosa da Europa medieval: tinha muitas terras, influência política e controlava a educação e boa parte da
        cultura. Nos <T>mosteiros</T>, os monges copiavam os livros à mão.
      </P>
      <Fig n="6.1" caption="O monge copista no mosteiro." h={20}>
        <MonkArt />
      </Fig>
      <Box kind="sabia">
        Copiar um livro grande podia levar meses ou até anos! As letras iniciais eram desenhadas com cores e ouro: são as <strong>iluminuras</strong>.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="⚔️">As Cruzadas e o comércio</H>
      <P>
        Entre os séculos XI e XIII, os cristãos europeus fizeram as <T>Cruzadas</T>, expedições militares e religiosas em direção a Jerusalém, a Terra Santa. Elas
        aumentaram o contato com o Oriente, e o comércio de especiarias e tecidos cresceu.
      </P>
      <Fig n="6.2" caption="As feiras e as cidades renasceram." h={20}>
        <FairArt />
      </Fig>
      <P>
        Em volta das feiras cresceram as cidades, os <T>burgos</T>. Quem morava neles e vivia do comércio ganhou um nome: <T>burguês</T>.
      </P>
    </>,
  ),

  page(
    <>
      <H icon="🐀">A peste negra</H>
      <P>
        Por volta de <T>1347 a 1351</T>, a <T>peste negra</T> (peste bubônica) matou cerca de <T>um terço</T> da população da Europa. Ela era transmitida pelas pulgas dos
        ratos, que viajavam nos navios de comércio.
      </P>
      <Table
        head={["Ano", "Acontecimento"]}
        rows={[
          ["476", "Queda do Império Romano do Ocidente: começa a Idade Média"],
          ["1096", "Começa a primeira Cruzada"],
          ["1347", "A peste negra chega à Europa"],
          ["1453", "Queda de Constantinopla: fim da Idade Média"],
        ]}
      />
      <Box kind="lembre">
        A Idade Média durou cerca de <strong>mil anos</strong>, de 476 a 1453. Muitos castelos e catedrais daquela época ainda estão de pé na Europa.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "A Idade Média vai de 476 (queda de Roma) a 1453 (queda de Constantinopla).",
          "No feudalismo, a terra era a riqueza: servos trabalhavam o feudo em troca de proteção.",
          "A Igreja Católica era a instituição mais poderosa; os monges copiavam livros à mão.",
          "As Cruzadas aumentaram o comércio com o Oriente e as cidades (burgos) cresceram.",
          "A peste negra matou cerca de um terço da população europeia no século XIV.",
        ]}
      />
      <Glossary
        items={[
          ["Feudo", "A terra de um senhor feudal."],
          ["Servo", "Camponês que trabalhava a terra do senhor."],
          ["Clero", "Os membros da Igreja: padres, bispos e monges."],
          ["Cruzadas", "Expedições cristãs em direção a Jerusalém."],
          ["Burguês", "Morador do burgo, que vivia do comércio."],
        ]}
      />
      <Quiz
        items={[
          ["Como se chamava o sistema em que servos trabalhavam a terra de um senhor?", "Feudalismo."],
          ["Qual era a instituição mais poderosa da Europa medieval?", "A Igreja Católica."],
          ["O que foram as Cruzadas?", "Expedições militares e religiosas de cristãos europeus em direção a Jerusalém."],
          ["Qual doença matou um terço da Europa no século XIV?", "A peste negra."],
        ]}
      />
    </>,
  ),
];
