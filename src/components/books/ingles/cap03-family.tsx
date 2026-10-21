"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { ENG, ENG_DARK, Say, speak, WordCards } from "./art";

// ============================================================================
// CAPÍTULO 3 — FAMILY AND HOME (missão "Inglês: Family and Home"): a casa com
// a família nas janelas, a árvore da família (de tocar), a casa por dentro
// (de tocar) e as cartas dos móveis.
// ============================================================================

/** Um rostinho (o centro em x, y), pra árvore da família e a casa. */
function Face({ x, y, r = 16, skin = "#f1c9a5", hair = "#3f2a14", gray = false, bun = false }: { x: number; y: number; r?: number; skin?: string; hair?: string; gray?: boolean; bun?: boolean }) {
  const h = gray ? "#d1d5db" : hair;
  return (
    <g transform={`translate(${x} ${y})`}>
      {bun && <circle cy={-r * 0.95} r={r * 0.4} fill={h} />}
      <circle r={r} fill={skin} />
      <path d={`M${-r} ${-r * 0.1} Q${-r * 0.95} ${-r * 1.15} 0 ${-r * 1.05} Q${r * 0.95} ${-r * 1.15} ${r} ${-r * 0.1} Q${r * 0.5} ${-r * 0.6} 0 ${-r * 0.55} Q${-r * 0.5} ${-r * 0.6} ${-r} ${-r * 0.1} Z`} fill={h} />
      <circle cx={-r * 0.35} cy={r * 0.05} r={r * 0.1} fill="#1e293b" />
      <circle cx={r * 0.35} cy={r * 0.05} r={r * 0.1} fill="#1e293b" />
      <path d={`M${-r * 0.3} ${r * 0.4} Q0 ${r * 0.62} ${r * 0.3} ${r * 0.4}`} stroke="#1e293b" strokeWidth={r * 0.08} fill="none" strokeLinecap="round" />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Abertura: a casa com a família nas janelas
// ---------------------------------------------------------------------------

function HouseOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma casa de dois andares com a família nas janelas: os avós em cima, os pais e as crianças embaixo, acenando; fumacinha saindo da chaminé">
      <rect width="460" height="300" fill="#eff6ff" />
      <rect y="250" width="460" height="50" fill="#86efac" />
      <rect x="300" y="40" width="26" height="60" fill="#7f1d1d" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx="313" cy="30" r="10" fill="#e5e7eb">
          <animate attributeName="cy" values="34;-10" dur="3s" begin={`${-i}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0" dur="3s" begin={`${-i}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <path d="M80 120 L230 30 L380 120 Z" fill={ENG} stroke="#7f1d1d" strokeWidth="4" strokeLinejoin="round" />
      <rect x="100" y="120" width="260" height="130" fill="#fef3c7" stroke="#92400e" strokeWidth="4" />
      <line x1="100" y1="185" x2="360" y2="185" stroke="#92400e" strokeWidth="3" />
      {/* as janelas com a família */}
      {[
        { x: 140, y: 152, faces: [{ gray: true }, { gray: true, bun: true }] },
        { x: 320, y: 152, faces: [{ hair: "#1c1917" }] },
        { x: 140, y: 218, faces: [{ hair: "#92400e", bun: true }, { hair: "#1c1917" }] },
        { x: 320, y: 218, faces: [{ hair: "#3f2a14" }, { hair: "#92400e", bun: true }] },
      ].map((w, i) => (
        <g key={i}>
          <rect x={w.x - 32} y={w.y - 24} width="64" height="44" rx="4" fill="#bfdbfe" stroke="#1e3a8a" strokeWidth="3" />
          {w.faces.map((f, j) => (
            <g key={j}>
              <animateTransform attributeName="transform" type="translate" values="0 0;0 -4;0 0" dur="2s" begin={`${-(i + j) * 0.4}s`} repeatCount="indefinite" />
              <Face x={w.x + (w.faces.length > 1 ? (j ? 14 : -14) : 0)} y={w.y + 4} r={12} skin={(i + j) % 2 ? "#8d5524" : "#f1c9a5"} {...f} />
            </g>
          ))}
        </g>
      ))}
      <rect x="208" y="200" width="44" height="50" rx="4" fill="#92400e" />
      <circle cx="244" cy="226" r="3" fill="#fde68a" />
      <text x="230" y="285" textAnchor="middle" fontSize="18" fontWeight="900" fill={ENG_DARK} fontFamily="Georgia, serif">
        This is my family!
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A árvore da família (de tocar)
// ---------------------------------------------------------------------------

const FAMILY: { en: string; pt: string; x: number; y: number; gray?: boolean; bun?: boolean; skin?: string; hair?: string }[] = [
  { en: "grandfather", pt: "avô (grandpa)", x: 110, y: 40, gray: true },
  { en: "grandmother", pt: "avó (grandma)", x: 190, y: 40, gray: true, bun: true },
  { en: "father", pt: "pai (dad)", x: 70, y: 115, hair: "#1c1917" },
  { en: "mother", pt: "mãe (mom)", x: 150, y: 115, bun: true, hair: "#92400e" },
  { en: "aunt", pt: "tia", x: 230, y: 115, bun: true, skin: "#8d5524", hair: "#1c1917" },
  { en: "uncle", pt: "tio", x: 290, y: 115, skin: "#c68642" },
  { en: "me", pt: "eu", x: 60, y: 190, hair: "#92400e" },
  { en: "sister", pt: "irmã", x: 115, y: 190, bun: true },
  { en: "brother", pt: "irmão", x: 170, y: 190, hair: "#1c1917" },
  { en: "cousin", pt: "primo ou prima", x: 260, y: 190, skin: "#c68642", hair: "#1c1917" },
];

export function FamilyTree() {
  const [sel, setSel] = useState(3);
  const f = FAMILY[sel];
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.5em]">
      <svg viewBox="0 0 340 222" className="mx-auto block h-[9.5em] w-full" aria-label="A árvore da família: toque em cada pessoa">
        {/* os casais (traço entre os dois) e os filhos de cada casal */}
        <g stroke="#94a3b8" strokeWidth="2" fill="none">
          <path d="M131 40 L169 40 M150 40 L150 78 L230 78 L230 94 M150 78 L150 94" />
          <path d="M91 115 L129 115 M251 115 L269 115" />
          <path d="M110 115 L110 160 M60 160 L170 160 M60 160 L60 169 M115 160 L115 169 M170 160 L170 169 M260 115 L260 169" />
        </g>
        {FAMILY.map((m, i) => (
          <g
            key={m.en}
            role="button"
            tabIndex={0}
            aria-label={m.en}
            onClick={() => {
              setSel(i);
              speak(m.en);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSel(i);
                speak(m.en);
              }
            }}
            className="cursor-pointer"
          >
            <circle cx={m.x} cy={m.y} r="21" fill={sel === i ? "#fee2e2" : "#fff"} stroke={sel === i ? ENG : "#bfdbfe"} strokeWidth="3" />
            <Face x={m.x} y={m.y + 2} r={14} gray={m.gray} bun={m.bun} skin={m.skin} hair={m.hair} />
            <text x={m.x} y={m.y + 33} textAnchor="middle" fontSize="10" fontWeight="900" fill={sel === i ? ENG : ENG_DARK} fontFamily="Georgia, serif">
              {m.en}
            </text>
          </g>
        ))}
      </svg>
      <p key={sel} className="cg-anim-fade text-center text-[1.15em] font-black" style={{ color: ENG_DARK }}>
        {f.en} <Say text={f.en} /> <span className="text-[0.75em] font-bold text-[#3b2a14]">= {f.pt}</span>
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A casa por dentro (de tocar)
// ---------------------------------------------------------------------------

const ROOMS: { en: string; pt: string; x: number; y: number; w: number; h: number; color: string; icon: string }[] = [
  { en: "bedroom", pt: "quarto", x: 60, y: 60, w: 110, h: 70, color: "#dbeafe", icon: "🛏️" },
  { en: "bathroom", pt: "banheiro", x: 170, y: 60, w: 90, h: 70, color: "#cffafe", icon: "🛁" },
  { en: "living room", pt: "sala de estar", x: 60, y: 130, w: 110, h: 70, color: "#fef3c7", icon: "🛋️" },
  { en: "kitchen", pt: "cozinha", x: 170, y: 130, w: 90, h: 70, color: "#fee2e2", icon: "🍳" },
  { en: "garden", pt: "jardim", x: 270, y: 150, w: 70, h: 50, color: "#dcfce7", icon: "🌻" },
];

export function HouseRooms() {
  const [sel, setSel] = useState(3);
  const r = ROOMS[sel];
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.5em]">
      <svg viewBox="40 10 310 196" className="mx-auto block h-[8.5em] w-full" aria-label="Uma casa por dentro: toque em cada cômodo">
        <path d="M50 60 L160 18 L270 60 Z" fill={ENG} stroke="#7f1d1d" strokeWidth="3" strokeLinejoin="round" />
        {ROOMS.map((room, i) => (
          <g
            key={room.en}
            role="button"
            tabIndex={0}
            aria-label={room.en}
            onClick={() => {
              setSel(i);
              speak(room.en);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSel(i);
                speak(room.en);
              }
            }}
            className="cursor-pointer"
          >
            <rect x={room.x} y={room.y} width={room.w} height={room.h} fill={sel === i ? "#fecaca" : room.color} stroke={room.en === "garden" ? "#16a34a" : "#92400e"} strokeWidth="3" />
            <text x={room.x + room.w / 2} y={room.y + room.h / 2 - 2} textAnchor="middle" fontSize="24">
              {room.icon}
            </text>
            <text x={room.x + room.w / 2} y={room.y + room.h - 8} textAnchor="middle" fontSize="10" fontWeight="900" fill={ENG_DARK} fontFamily="Georgia, serif">
              {room.en}
            </text>
          </g>
        ))}
      </svg>
      <p key={sel} className="cg-anim-fade text-center text-[1.15em] font-black" style={{ color: ENG_DARK }}>
        {r.en} <Say text={r.en} /> <span className="text-[0.75em] font-bold text-[#3b2a14]">= {r.pt}</span>
      </p>
    </div>
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
      title="Family and Home"
      goals={["Os nomes da família em inglês", "Os parentes: tios, primos, sobrinhos", "Os cômodos da casa", "Os móveis e as coisas da casa"]}
    >
      <Fig h={34}>
        <HouseOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="👪">My family</H>
      <P>
        Toque em cada pessoa da árvore pra ouvir como se diz em inglês. Pra apresentar alguém: <em>This is my mother</em> (esta é a minha mãe).
      </P>
      <FamilyTree />
      <Box kind="sabia">
        <strong>Parents</strong> quer dizer “pais” (o pai e a mãe), não “parentes”. Parentes em inglês são <strong>relatives</strong>.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🌳">Mais parentes</H>
      <P>Os parentes que faltam, e as palavras pros filhos e os netos:</P>
      <Table
        head={["Inglês", "Português", "Inglês", "Português"]}
        rows={[
          ["son", "filho", "daughter", "filha"],
          ["nephew", "sobrinho", "niece", "sobrinha"],
          ["grandson", "neto", "granddaughter", "neta"],
          ["husband", "marido", "wife", "esposa"],
          ["child", "criança", "children", "crianças"],
        ]}
      />
      <Box kind="mago" title="Cuidado com a pronúncia">
        <strong>Son</strong> (filho) e <strong>sun</strong> (sol) têm a mesma pronúncia. Ouça: son <Say text="son" /> sun <Say text="sun" />
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🏠">The house</H>
      <P>
        Toque em cada cômodo. Pra dizer onde você mora: <em>I live in a house with a big garden</em> (eu moro numa casa com um jardim grande).
      </P>
      <HouseRooms />
      <Box kind="lembre">
        <strong>House</strong> é a casa (o prédio); <strong>home</strong> é o lar, o lugar onde a gente vive: <em>I&apos;m at home</em> (estou em casa).
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🛋️">Furniture: os móveis</H>
      <P>
        Os móveis em inglês são <T>furniture</T>, uma palavra que não tem plural. Vire as cartas:
      </P>
      <WordCards
        cols={4}
        items={[
          ["bed", "cama", "🛏️"],
          ["chair", "cadeira", "💺"],
          ["table", "mesa", "🍽️"],
          ["door", "porta", "🚪"],
          ["window", "janela"],
          ["sofa", "sofá", "🛋️"],
          ["fridge", "geladeira", "❄️"],
          ["lamp", "luminária", "💡"],
        ]}
      />
      <Box kind="mago" title="Descreva o seu quarto">
        Junte as palavras numa frase: <em>In my bedroom there is a bed, a chair and a lamp</em> <Say text="In my bedroom there is a bed, a chair and a lamp." /> (no meu
        quarto tem uma cama, uma cadeira e uma luminária).
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Mother, father, sister, brother, grandmother, grandfather: a família.",
          "Aunt e uncle são tia e tio; cousin é primo ou prima; nephew e niece, sobrinho e sobrinha.",
          "Parents são os pais; parentes são relatives.",
          "Kitchen, bedroom, bathroom, living room e garden: os cômodos.",
          "Bed, chair, table e door: os móveis (furniture).",
        ]}
      />
      <Glossary
        items={[
          ["Family", "Família."],
          ["Cousin", "Primo ou prima."],
          ["Kitchen", "Cozinha."],
          ["Living room", "Sala de estar."],
          ["Furniture", "Móveis."],
        ]}
      />
      <Quiz
        items={[
          ["Como se diz “mãe” em inglês?", "Mother."],
          ["O que significa “aunt”?", "Tia."],
          ["Como se chama a cozinha em inglês?", "Kitchen."],
          ["Complete: “This is my ___. She is my father's mother.”", "Grandmother."],
        ]}
      />
    </>,
  ),
];
