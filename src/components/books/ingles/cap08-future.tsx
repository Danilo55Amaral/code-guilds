"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { ChoiceGame } from "../portugues/art";
import { ENG, ENG_DARK, Say } from "./art";

// ============================================================================
// CAPÍTULO 8 — FUTURE, COMPARATIVES AND MODALS (missão "Inglês: Future,
// Comparatives and Reading"): a bola de cristal do futuro, o comparador (de
// tocar), as cartas dos modais, a porta do push e o jogo dos falsos cognatos.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a bola de cristal
// ---------------------------------------------------------------------------

function CrystalOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma bola de cristal brilhando, onde aparecem as frases I will travel e I'm going to study, com estrelinhas em volta">
      <rect width="460" height="300" fill="#1e1b4b" />
      {[
        [60, 50],
        [400, 70],
        [90, 220],
        [380, 230],
        [230, 30],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#fde68a">
          <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" begin={`${-i * 0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <path d="M170 240 L290 240 L270 270 L190 270 Z" fill="#92400e" stroke="#78350f" strokeWidth="3" />
      <circle cx="230" cy="150" r="100" fill="#a5b4fc" opacity="0.35">
        <animate attributeName="r" values="96;106;96" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="230" cy="150" r="92" fill="#c7d2fe" stroke="#e0e7ff" strokeWidth="4" />
      <ellipse cx="196" cy="102" rx="22" ry="12" fill="#fff" opacity="0.6" transform="rotate(-30 196 102)" />
      {[
        { t: "I will travel.", vals: "1;1;0;0;1", kt: "0;0.45;0.5;0.95;1" },
        { t: "I'm going to study.", vals: "0;0;1;1;0", kt: "0;0.45;0.5;0.95;1" },
      ].map((l) => (
        <text key={l.t} x="230" y="156" textAnchor="middle" fontSize="16" fontWeight="900" fill="#312e81" fontFamily="Georgia, serif">
          <animate attributeName="opacity" values={l.vals} keyTimes={l.kt} dur="6s" repeatCount="indefinite" />
          {l.t}
        </text>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O comparador (de tocar)
// ---------------------------------------------------------------------------

const COMPARE: { adj: string; pt: string; items: [string, string][]; comp: string; sup: string }[] = [
  { adj: "big", pt: "grande", items: [["🐭", "the mouse"], ["🐕", "the dog"], ["🐘", "the elephant"]], comp: "bigger", sup: "the biggest" },
  { adj: "fast", pt: "rápido", items: [["🐢", "the turtle"], ["🐕", "the dog"], ["🐆", "the cheetah"]], comp: "faster", sup: "the fastest" },
  { adj: "tall", pt: "alto", items: [["🐱", "the cat"], ["🐴", "the horse"], ["🦒", "the giraffe"]], comp: "taller", sup: "the tallest" },
  { adj: "expensive", pt: "caro", items: [["🍎", "the apple"], ["🚲", "the bike"], ["🚗", "the car"]], comp: "more expensive", sup: "the most expensive" },
  { adj: "good", pt: "bom", items: [["🥉", "bronze"], ["🥈", "silver"], ["🥇", "gold"]], comp: "better", sup: "the best" },
];

export function Comparator() {
  const [sel, setSel] = useState(0);
  const c = COMPARE[sel];
  const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
  const s1 = `${cap(c.items[1][1])} is ${c.comp} than ${c.items[0][1]}.`;
  const s2 = `${cap(c.items[2][1])} is ${c.sup}.`;
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.5em]">
      <div className="flex flex-wrap justify-center gap-[0.25em]">
        {COMPARE.map((x, i) => (
          <button
            key={x.adj}
            type="button"
            onClick={() => setSel(i)}
            className="rounded-full border px-[0.6em] py-[0.05em] text-[0.8em] font-bold"
            style={sel === i ? { background: ENG, borderColor: ENG, color: "#fff" } : { background: "#fff", borderColor: "#fecaca", color: ENG }}
          >
            {x.adj}
          </button>
        ))}
      </div>
      <div key={sel} className="mt-[0.3em] flex items-end justify-center gap-[1.2em]">
        {c.items.map(([icon, name], i) => (
          <div key={name} className="cg-anim-pop flex flex-col items-center" style={{ animationDelay: `${i * 0.12}s` }}>
            <span style={{ fontSize: `${1.4 + i * 0.7}em`, lineHeight: 1 }}>{icon}</span>
            <span className="text-[0.72em] font-bold text-[#3b2a14]">{name}</span>
          </div>
        ))}
      </div>
      <p className="mt-[0.3em] text-center text-[0.98em] font-black" style={{ color: ENG_DARK }}>
        {s1} <Say text={s1} />
      </p>
      <p className="text-center text-[0.98em] font-black" style={{ color: ENG }}>
        {s2} <Say text={s2} />
      </p>
      <p className="text-center text-[0.75em] text-[#3b2a14]">
        {c.adj} ({c.pt}) → {c.comp} → {c.sup}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A porta do push
// ---------------------------------------------------------------------------

function PushDoorArt() {
  return (
    <Art viewBox="0 0 560 170" label="Uma porta com a placa PUSH sendo empurrada e abrindo; ao lado, a explicação: push é empurrar e pull é puxar">
      <rect width="560" height="170" rx="14" fill="#eff6ff" />
      <rect x="60" y="20" width="130" height="140" fill="#1e293b" />
      <g transform="translate(60 20)">
        <g>
          <animateTransform attributeName="transform" type="scale" values="1 1;1 1;0.35 1;0.35 1;1 1" keyTimes="0;0.25;0.45;0.8;1" dur="5s" repeatCount="indefinite" />
          <rect width="130" height="140" fill="#93c5fd" stroke="#1e3a8a" strokeWidth="4" />
          <rect x="35" y="50" width="60" height="26" rx="4" fill="#fff" stroke={ENG} strokeWidth="2" />
          <text x="65" y="69" textAnchor="middle" fontSize="16" fontWeight="900" fill={ENG} fontFamily="Georgia, serif">
            PUSH
          </text>
        </g>
      </g>
      <g fontFamily="Georgia, serif" fontWeight="900">
        <text x="240" y="60" fontSize="20" fill={ENG}>
          push = empurre
        </text>
        <text x="240" y="95" fontSize="20" fill={ENG_DARK}>
          pull = puxe
        </text>
        <text x="240" y="135" fontSize="13" fill="#475569">
          parece “puxar”, mas é o contrário!
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O jogo dos falsos cognatos
// ---------------------------------------------------------------------------

const FALSE_FRIENDS = [
  { prompt: "pretend", options: ["pretender", "fingir"], answer: 1, explain: "Pretend é fingir. “Pretender” em inglês é intend." },
  { prompt: "push", options: ["puxar", "empurrar"], answer: 1, explain: "Push é empurrar; puxar é pull." },
  { prompt: "parents", options: ["pais", "parentes"], answer: 0, explain: "Parents são os pais. Parentes são relatives." },
  { prompt: "library", options: ["livraria", "biblioteca"], answer: 1, explain: "Library é biblioteca. Livraria é bookstore." },
  { prompt: "actually", options: ["atualmente", "na verdade"], answer: 1, explain: "Actually é na verdade. Atualmente é nowadays." },
];

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 8, content, bare });

export const chapter8: BookPage[] = [
  page(
    <ChapterOpener
      n={8}
      title="Future, Comparatives and Modals"
      goals={["O futuro com will e com going to", "Comparativos e superlativos", "Os modais can, should e must", "Os falsos cognatos"]}
    >
      <Fig h={34}>
        <CrystalOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🔮">Will e going to</H>
      <P>
        O futuro tem dois jeitos. <T>Be going to</T> é pra planos já decididos. <T>Will</T> é pra previsões e decisões na hora. Depois de will, o verbo fica na forma
        base, sem -s e sem to.
      </P>
      <Table
        head={["Forma", "Quando", "Exemplo"]}
        rows={[
          ["be going to", "plano já decidido", "I am going to visit my cousins next weekend."],
          ["will", "previsão, opinião", "I think it will rain tomorrow."],
          ["will", "decisão na hora", "The phone is ringing! I'll answer it."],
        ]}
      />
      <Box kind="lembre">
        Na negativa, will not vira <strong>won&apos;t</strong>: <em>I won&apos;t be late</em> (não vou me atrasar).
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🐘">Comparativos e superlativos</H>
      <P>
        Adjetivos curtos ganham <T>-er</T> (taller than) e <T>the -est</T> (the tallest). Os longos usam <T>more</T> e <T>the most</T>. E o good é irregular: better, the
        best. Escolha um adjetivo:
      </P>
      <Comparator />
    </>,
  ),

  page(
    <>
      <H icon="💪">Can, should, must</H>
      <P>
        Os <T>modais</T> mudam o sentido do verbo, que vem logo depois na forma base. Eles nunca ganham -s: <em>she can swim</em>.
      </P>
      <Cards
        items={[
          { icon: "🏊", title: "can", text: "Poder ou saber fazer: Can you swim? Yes, I can." },
          { icon: "🙅", title: "can't", text: "Não poder, não saber: I can't drive." },
          { icon: "📚", title: "should", text: "Conselho: You should study more." },
          { icon: "⛔", title: "must", text: "Obrigação: You must wear a helmet." },
        ]}
      />
      <Box kind="sabia">
        Lendo em inglês, use as pistas: as palavras parecidas com o português (os <strong>cognatos</strong>, como <em>animal, hospital, important</em>) ajudam muito.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🚪">Os falsos cognatos</H>
      <P>
        Cuidado com os <T>falsos cognatos</T> (false friends): palavras que parecem com o português mas significam outra coisa.
      </P>
      <Fig n="8.1" caption="A placa PUSH, que pega muita gente." h={15}>
        <PushDoorArt />
      </Fig>
      <ChoiceGame items={FALSE_FRIENDS} color={ENG} title="O que significa?" />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Going to pra planos decididos; will pra previsões e decisões na hora.",
          "Adjetivos curtos: tall → taller → the tallest. Longos: more beautiful, the most beautiful.",
          "Good → better → the best; bad → worse → the worst.",
          "Can (poder, saber), should (deveria), must (tem que).",
          "Falsos cognatos: pretend é fingir, push é empurrar, parents são os pais.",
        ]}
      />
      <Glossary
        items={[
          ["Will", "Vai (futuro)."],
          ["Than", "Do que (comparação)."],
          ["Should", "Deveria."],
          ["Must", "Tem que, deve."],
          ["False friend", "Falso cognato."],
        ]}
      />
      <Quiz
        items={[
          ["Qual é o comparativo de “tall”?", "taller."],
          ["Qual é o superlativo de “good”?", "the best."],
          ["O que significa “You should study more”?", "Você deveria estudar mais."],
          ["O que significa “pretend”?", "Fingir."],
        ]}
      />
    </>,
  ),
];
