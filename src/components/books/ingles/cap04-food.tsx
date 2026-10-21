"use client";

import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { ChoiceGame } from "../portugues/art";
import { En, ENG, ENG_DARK, WordCards } from "./art";

// ============================================================================
// CAPÍTULO 4 — FOOD AND THERE IS, THERE ARE (missão "Inglês: Food and There
// Is, There Are"): a mesa do café da manhã, as cartas das comidas, a geladeira
// do there is e there are, o jogo do how much e how many e a conversa no
// restaurante.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a mesa do café da manhã
// ---------------------------------------------------------------------------

function BreakfastOpenerArt() {
  const foods = [
    { x: 110, e: "🍞", d: 0 },
    { x: 180, e: "🥛", d: 0.3 },
    { x: 250, e: "🍎", d: 0.6 },
    { x: 320, e: "🧀", d: 0.9 },
    { x: 380, e: "🍌", d: 1.2 },
  ];
  return (
    <Art viewBox="0 0 460 300" label="Uma mesa de café da manhã com pão, leite, maçã, queijo e banana pulando de leve, e a placa Breakfast time!">
      <rect width="460" height="300" fill="#fff7ed" />
      <rect x="40" y="170" width="380" height="20" rx="6" fill="#92400e" />
      <rect x="70" y="190" width="14" height="90" fill="#78350f" />
      <rect x="376" y="190" width="14" height="90" fill="#78350f" />
      <path d="M40 170 L420 170 L404 196 L56 196 Z" fill="#fecaca" opacity="0.9" />
      {[60, 100, 140, 180, 220, 260, 300, 340, 380].map((x) => (
        <rect key={x} x={x} y="170" width="20" height="26" fill="#fff" opacity="0.6" />
      ))}
      {foods.map((f) => (
        <g key={f.x}>
          <animateTransform attributeName="transform" type="translate" values="0 0;0 -10;0 0" dur="1.6s" begin={`${-f.d}s`} repeatCount="indefinite" />
          <text x={f.x} y="160" textAnchor="middle" fontSize="44">
            {f.e}
          </text>
        </g>
      ))}
      <rect x="130" y="40" width="200" height="50" rx="12" fill="#fff" stroke={ENG} strokeWidth="4" />
      <text x="230" y="73" textAnchor="middle" fontSize="22" fontWeight="900" fill={ENG_DARK} fontFamily="Georgia, serif">
        Breakfast time!
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A geladeira do there is e there are
// ---------------------------------------------------------------------------

function FridgeArt() {
  return (
    <Art viewBox="0 0 560 200" label="Uma geladeira aberta: there is an apple, there is some milk e there are three bananas, com as frases ao lado">
      <rect width="560" height="200" rx="14" fill="#eff6ff" />
      <rect x="40" y="14" width="170" height="176" rx="12" fill="#e5e7eb" stroke="#64748b" strokeWidth="3" />
      <rect x="52" y="26" width="146" height="152" rx="6" fill="#f8fafc" />
      <line x1="52" y1="80" x2="198" y2="80" stroke="#94a3b8" strokeWidth="3" />
      <line x1="52" y1="132" x2="198" y2="132" stroke="#94a3b8" strokeWidth="3" />
      <text x="125" y="74" textAnchor="middle" fontSize="36">
        🍎
      </text>
      <text x="125" y="126" textAnchor="middle" fontSize="36">
        🥛
      </text>
      <text x="125" y="176" textAnchor="middle" fontSize="30">
        🍌🍌🍌
      </text>
      {[
        { y: 62, t: "There is an apple.", c: ENG_DARK },
        { y: 112, t: "There is some milk.", c: ENG_DARK },
        { y: 164, t: "There are three bananas.", c: ENG },
      ].map((l, i) => (
        <g key={l.t}>
          <animate attributeName="opacity" values="0;0;1;1" keyTimes={`0;${(0.15 + i * 0.15).toFixed(2)};${(0.2 + i * 0.15).toFixed(2)};1`} dur="6s" repeatCount="indefinite" />
          <path d={`M218 ${l.y - 6} L240 ${l.y - 6}`} stroke={l.c} strokeWidth="2" strokeDasharray="3 3" />
          <text x="250" y={l.y} fontSize="19" fontWeight="900" fill={l.c} fontFamily="Georgia, serif">
            {l.t}
          </text>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O jogo do there is / there are e do how much / how many
// ---------------------------------------------------------------------------

const THERE_GAME = [
  { prompt: "“There ___ an apple on the table.”", options: ["is", "are"], answer: 0, explain: "Uma coisa só (singular): there is." },
  { prompt: "“There ___ three bananas in the bag.”", options: ["is", "are"], answer: 1, explain: "Várias coisas (plural): there are." },
  { prompt: "“How ___ apples do you want?”", options: ["much", "many"], answer: 1, explain: "Maçãs se contam (uma, duas…): how many." },
  { prompt: "“How ___ water do you drink?”", options: ["much", "many"], answer: 0, explain: "Água não se conta em unidades: how much." },
  { prompt: "“How ___ rice is there?”", options: ["much", "many"], answer: 0, explain: "Rice (arroz) é incontável, como milk, sugar e water." },
  { prompt: "“Is there ___ milk in the fridge?”", options: ["any", "a"], answer: 0, explain: "Any é usado em perguntas e negativas: is there any milk?" },
];

// ---------------------------------------------------------------------------
// A conversa no restaurante
// ---------------------------------------------------------------------------

function RestaurantArt() {
  const lines = [
    { right: false, t: "Are you ready to order?" },
    { right: true, t: "Can I have a juice, please?" },
    { right: false, t: "Sure! Anything else?" },
    { right: true, t: "I'd like the chicken, please." },
  ];
  return (
    <Art viewBox="0 0 560 200" label="Num restaurante, o garçom pergunta Are you ready to order? e o cliente pede Can I have a juice, please? e I'd like the chicken, please">
      <rect width="560" height="200" rx="14" fill="#fff7ed" />
      {/* o garçom e o cliente */}
      <g transform="translate(50 190)">
        <rect x="-16" y="-70" width="32" height="44" rx="8" fill="#1e293b" />
        <path d="M-6 -70 L0 -60 L6 -70 Z" fill="#fff" />
        <circle cy="-84" r="14" fill="#c68642" />
        <path d="M-6 -26 L-6 0 M6 -26 L6 0" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
        <path d="M16 -60 L34 -66" stroke="#c68642" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="40" cy="-68" rx="18" ry="4" fill="#cbd5e1" />
      </g>
      <g transform="translate(510 190)">
        <rect x="-16" y="-70" width="32" height="44" rx="8" fill={ENG} />
        <circle cy="-84" r="14" fill="#f1c9a5" />
        <path d="M-14 -86 Q-12 -102 0 -100 Q12 -102 14 -86 Q6 -94 0 -93 Q-6 -94 -14 -86 Z" fill="#92400e" />
        <path d="M-6 -26 L-6 0 M6 -26 L6 0" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
      </g>
      {lines.map((l, i) => (
        <g key={i} opacity="0">
          <animate attributeName="opacity" values="0;0;1;1;0" keyTimes={`0;${(i * 0.2).toFixed(1)};${(i * 0.2 + 0.05).toFixed(2)};0.92;1`} dur="8s" repeatCount="indefinite" />
          <rect x={l.right ? 250 : 100} y={14 + i * 44} width="210" height="32" rx="14" fill={l.right ? "#fee2e2" : "#fff"} stroke={l.right ? ENG : ENG_DARK} strokeWidth="2" />
          <text x={l.right ? 355 : 205} y={35 + i * 44} textAnchor="middle" fontSize="14" fontWeight="900" fill={l.right ? "#7f1d1d" : ENG_DARK} fontFamily="Georgia, serif">
            {l.t}
          </text>
        </g>
      ))}
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
      title="Food and There Is, There Are"
      goals={["As refeições e as comidas em inglês", "There is e there are", "How much e how many", "Como pedir comida no restaurante"]}
    >
      <Fig h={34}>
        <BreakfastOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🍽️">Meals and food</H>
      <P>
        As três refeições do dia são o <En>breakfast</En> (café da manhã), o <En>lunch</En> (almoço) e o <En>dinner</En> (jantar). Vire as cartas das comidas:
      </P>
      <WordCards
        cols={4}
        items={[
          ["apple", "maçã", "🍎"],
          ["bread", "pão", "🍞"],
          ["milk", "leite", "🥛"],
          ["rice", "arroz", "🍚"],
          ["chicken", "frango", "🍗"],
          ["fish", "peixe", "🐟"],
          ["cheese", "queijo", "🧀"],
          ["vegetables", "verduras e legumes", "🥦"],
        ]}
      />
      <Box kind="sabia">
        <strong>Breakfast</strong> vem de <em>break</em> (quebrar) + <em>fast</em> (jejum): é a refeição que “quebra o jejum” da noite. E <em>snack</em> é o lanchinho
        entre as refeições.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="❄️">There is, there are</H>
      <P>
        <T>There is</T> e <T>there are</T> quer dizer “tem” ou “há”. Use <T>there is</T> com uma coisa só (singular) e <T>there are</T> com várias (plural).
      </P>
      <Fig n="4.1" caption="O que tem na geladeira?" h={20}>
        <FridgeArt />
      </Fig>
      <Box kind="lembre">
        Na pergunta, o verbo vem antes: <em>Is there any milk in the fridge?</em> (tem leite na geladeira?) E <em>fridge</em> é a geladeira.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="⚖️">How much, how many</H>
      <P>
        Pra perguntar a quantidade de coisas que se <T>contam</T> (maçãs, ovos, bananas), use <T>how many</T>. Pras que <T>não se contam</T> em unidades (água,
        leite, arroz, açúcar), use <T>how much</T>.
      </P>
      <ChoiceGame items={THERE_GAME} color={ENG} title="Escolha a palavra certa" />
    </>,
  ),

  page(
    <>
      <H icon="🍴">At the restaurant</H>
      <P>
        Pra pedir com educação: <En>Can I have a juice, please?</En> ou <En>I&apos;d like the chicken, please.</En> E pra dizer como você está:
      </P>
      <Fig n="4.2" caption="Fazendo o pedido no restaurante." h={20}>
        <RestaurantArt />
      </Fig>
      <Cards
        items={[
          { icon: "😋", title: "I'm hungry", text: "Estou com fome." },
          { icon: "💧", title: "I'm thirsty", text: "Estou com sede." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Breakfast, lunch e dinner: café da manhã, almoço e jantar.",
          "There is com uma coisa (there is an apple); there are com várias (there are three bananas).",
          "How many pra coisas contáveis; how much pras incontáveis (water, milk, rice).",
          "Any aparece em perguntas e negativas: Is there any milk?",
          "Pra pedir: Can I have…, please? ou I'd like…, please.",
        ]}
      />
      <Glossary
        items={[
          ["Breakfast", "Café da manhã."],
          ["Hungry", "Com fome."],
          ["Thirsty", "Com sede."],
          ["Fridge", "Geladeira."],
          ["Chicken", "Frango."],
        ]}
      />
      <Quiz
        items={[
          ["Que refeição é “breakfast”?", "O café da manhã."],
          ["Complete: “There ___ three bananas in the bag.”", "are."],
          ["Qual pergunta é certa pra água: how much ou how many?", "How much water?"],
          ["O que significa “I'm hungry”?", "Estou com fome."],
        ]}
      />
    </>,
  ),
];
