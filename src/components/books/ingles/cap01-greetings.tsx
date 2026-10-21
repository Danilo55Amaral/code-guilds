"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Kid } from "../ods/art";
import { Balloon } from "../portugues/art";
import { En, ENG, ENG_DARK, Say, speak } from "./art";

// ============================================================================
// CAPÍTULO 1 — GREETINGS, COLORS AND NUMBERS (missão "Inglês: Greetings and
// Colors"): os dois amigos se cumprimentando, a conversa de quem se conhece
// pela primeira vez, a paleta de cores de tocar (com a voz) e os números e os
// dias da semana.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: dois amigos se cumprimentando
// ---------------------------------------------------------------------------

function HelloOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Dois amigos acenando um para o outro; os balões de fala trocam entre Hello!, Hi! e How are you? I'm fine, thank you!">
      <rect width="460" height="300" fill="#eff6ff" />
      <rect y="240" width="460" height="60" fill="#bbf7d0" />
      <Kid x={120} y={250} s={2} shirt={ENG} />
      <Kid x={340} y={250} s={2} shirt={ENG_DARK} skin="#8d5524" hair="#1c1917" />
      {/* as mãos acenando */}
      {[
        { x: 152, d: 0 },
        { x: 308, d: -0.5 },
      ].map((h) => (
        <g key={h.x} transform={`translate(${h.x} 170)`}>
          <g>
            <animateTransform attributeName="transform" type="rotate" values="-20;20;-20" dur="1s" begin={`${h.d}s`} repeatCount="indefinite" />
            <circle cy="-24" r="9" fill={h.x < 230 ? "#d6a77a" : "#8d5524"} />
            <line x1="0" y1="0" x2="0" y2="-18" stroke={h.x < 230 ? "#d6a77a" : "#8d5524"} strokeWidth="8" strokeLinecap="round" />
          </g>
        </g>
      ))}
      {/* os balões trocando: cada par aparece num terço do tempo */}
      {[
        { l: "Hello!", r: "Hi!", vals: "1;1;0;0;1", kt: "0;0.32;0.33;0.99;1" },
        { l: "How are you?", r: "I'm fine, thank you!", vals: "0;0;1;1;0;0", kt: "0;0.33;0.34;0.65;0.66;1" },
        { l: "Nice to meet you!", r: "Nice to meet you too!", vals: "0;0;1;1;0", kt: "0;0.66;0.67;0.99;1" },
      ].map((b, i) => (
        <g key={i} opacity={i === 0 ? 1 : 0}>
          <animate attributeName="opacity" values={b.vals} keyTimes={b.kt} dur="9s" repeatCount="indefinite" />
          <Balloon x={20} y={24} w={190} h={52} text={b.l} color="#fff" ink={ENG_DARK} size={18} />
          <Balloon x={250} y={44} w={195} h={52} text={b.r} color="#fee2e2" ink="#7f1d1d" size={b.r.length > 14 ? 15 : 18} />
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A conversa de quem se conhece
// ---------------------------------------------------------------------------

function MeetArt() {
  const lines = [
    { who: 0, text: "What's your name?" },
    { who: 1, text: "My name is Ana." },
    { who: 0, text: "Nice to meet you!" },
    { who: 1, text: "Nice to meet you too!" },
  ];
  return (
    <Art viewBox="0 0 560 200" label="Uma conversa em quatro balões: What's your name? My name is Ana. Nice to meet you! Nice to meet you too!">
      <rect width="560" height="200" rx="14" fill="#eff6ff" />
      <Kid x={50} y={185} s={1.4} shirt={ENG_DARK} />
      <Kid x={510} y={185} s={1.4} shirt={ENG} skin="#f1c9a5" hair="#92400e" />
      {lines.map((l, i) => (
        <g key={i} opacity="0">
          <animate attributeName="opacity" values="0;0;1;1;0" keyTimes={`0;${(i * 0.2).toFixed(1)};${(i * 0.2 + 0.05).toFixed(2)};0.92;1`} dur="8s" repeatCount="indefinite" />
          <rect x={l.who ? 270 : 95} y={18 + i * 42} width="200" height="32" rx="14" fill={l.who ? "#fee2e2" : "#fff"} stroke={l.who ? ENG : ENG_DARK} strokeWidth="2" />
          <text x={l.who ? 370 : 195} y={39 + i * 42} textAnchor="middle" fontSize="15" fontWeight="900" fill={l.who ? "#7f1d1d" : ENG_DARK} fontFamily="Georgia, serif">
            {l.text}
          </text>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A paleta de cores (de tocar)
// ---------------------------------------------------------------------------

const COLORS: [string, string, string][] = [
  ["red", "vermelho", "#dc2626"],
  ["blue", "azul", "#2563eb"],
  ["yellow", "amarelo", "#facc15"],
  ["green", "verde", "#16a34a"],
  ["orange", "laranja", "#f97316"],
  ["purple", "roxo", "#9333ea"],
  ["pink", "rosa", "#ec4899"],
  ["brown", "marrom", "#78350f"],
  ["black", "preto", "#111827"],
  ["white", "branco", "#ffffff"],
  ["gray", "cinza", "#9ca3af"],
];

export function ColorPalette() {
  const [sel, setSel] = useState(0);
  const [en, pt, hex] = COLORS[sel];
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <div className="flex flex-wrap justify-center gap-[0.35em]">
        {COLORS.map(([name, , c], i) => (
          <button
            key={name}
            type="button"
            aria-label={name}
            onClick={() => {
              setSel(i);
              speak(name);
            }}
            className="h-[1.9em] w-[1.9em] rounded-full border-2 shadow transition-transform hover:scale-110"
            style={{ background: c, borderColor: sel === i ? "#1e293b" : "#e5e7eb", transform: sel === i ? "scale(1.15)" : undefined }}
          />
        ))}
      </div>
      <div key={sel} className="cg-anim-pop mt-[0.4em] flex items-center justify-center gap-[0.6em]">
        <span className="h-[2.4em] w-[2.4em] rounded-xl border border-[#d1d5db]" style={{ background: hex }} />
        <div>
          <p className="text-[1.6em] font-black leading-none" style={{ color: ENG_DARK }}>
            {en} <Say text={en} />
          </p>
          <p className="text-[0.85em] text-[#3b2a14]">{pt}</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Os números (de tocar)
// ---------------------------------------------------------------------------

const NUMBERS = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];

export function NumberChips() {
  const [sel, setSel] = useState(11);
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.5em]">
      <div className="grid grid-cols-10 gap-[0.2em]">
        {NUMBERS.map((w, i) => (
          <button
            key={w}
            type="button"
            onClick={() => {
              setSel(i);
              speak(w);
            }}
            className="rounded-md border py-[0.1em] text-[0.8em] font-black"
            style={sel === i ? { background: ENG, borderColor: ENG, color: "#fff" } : { background: "#fff", borderColor: "#bfdbfe", color: ENG_DARK }}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <p key={sel} className="cg-anim-fade mt-[0.3em] text-center text-[1.05em] font-black" style={{ color: ENG_DARK }}>
        {sel + 1} = {NUMBERS[sel]}
      </p>
    </div>
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
      title="Greetings, Colors and Numbers"
      goals={["Como cumprimentar e se despedir", "Como se apresentar e conhecer alguém", "As cores em inglês", "Os números e os dias da semana"]}
    >
      <Fig h={34}>
        <HelloOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="👋">Greetings: os cumprimentos</H>
      <P>
        Em inglês, o cumprimento muda com a hora do dia. Toque no 🔊 pra ouvir a pronúncia de cada um (a voz é a do seu aparelho).
      </P>
      <Table
        head={["Inglês", "Português", "Quando usar"]}
        rows={[
          [<En key="a">Good morning</En>, "Bom dia", "de manhã"],
          [<En key="b">Good afternoon</En>, "Boa tarde", "depois do meio-dia"],
          [<En key="c">Good evening</En>, "Boa noite", "ao chegar, à noite"],
          [<En key="d">Good night</En>, "Boa noite", "ao se despedir ou ir dormir"],
          [<En key="e">Hello / Hi</En>, "Olá / Oi", "a qualquer hora"],
          [<En key="f">See you later</En>, "Até mais", "pra se despedir"],
        ]}
      />
      <Box kind="lembre">
        <strong>How are you?</strong> (como você está?) se responde com <strong>I&apos;m fine, thank you</strong> (estou bem, obrigado).
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🤝">Nice to meet you!</H>
      <P>
        Pra perguntar o nome: <En>What&apos;s your name?</En> E pra responder: <En>My name is Ana.</En> Quando conhecemos alguém, dizemos <T>Nice to meet you</T>{" "}
        (prazer em conhecer você).
      </P>
      <Fig n="1.1" caption="A primeira conversa com alguém novo." h={20}>
        <MeetArt />
      </Fig>
      <Cards
        items={[
          { icon: "🙏", title: "Please", text: "Por favor." },
          { icon: "😊", title: "Thank you", text: "Obrigado (ou obrigada)." },
          { icon: "😔", title: "Sorry", text: "Desculpa." },
          { icon: "🚪", title: "Excuse me", text: "Com licença." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🎨">Colors: as cores</H>
      <P>
        Toque numa cor pra ver e ouvir o nome dela em inglês. Repare que, em inglês, a cor vem <T>antes</T> da coisa: <em>a red car</em> é “um carro vermelho”.
      </P>
      <ColorPalette />
      <Box kind="sabia">
        Cinza tem duas grafias: <strong>gray</strong> (nos Estados Unidos) e <strong>grey</strong> (na Inglaterra). As duas estão certas!
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🔢">Numbers and days</H>
      <P>
        Toque nos números pra ouvir. Depois do 12, os números terminam em <T>-teen</T> (thirteen, fourteen…), e as dezenas em <T>-ty</T> (twenty, thirty, forty…).
      </P>
      <NumberChips />
      <Table
        head={["Day", "Dia"]}
        rows={[
          [<En key="1">Monday</En>, "segunda-feira"],
          [<En key="2">Tuesday</En>, "terça-feira"],
          [<En key="3">Wednesday</En>, "quarta-feira"],
          [<En key="4">Thursday · Friday</En>, "quinta · sexta"],
          [<En key="5">Saturday · Sunday</En>, "sábado · domingo"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Good morning, good afternoon e good evening cumprimentam; good night é pra despedida.",
          "What's your name? — My name is… · How are you? — I'm fine, thank you.",
          "Nice to meet you é o “prazer em conhecer”.",
          "Em inglês, a cor vem antes do nome: a red car.",
          "Os números de 13 a 19 terminam em -teen; os dias da semana começam com letra maiúscula.",
        ]}
      />
      <Glossary
        items={[
          ["Greeting", "Cumprimento."],
          ["Please", "Por favor."],
          ["Thank you", "Obrigado."],
          ["Twelve", "Doze (12)."],
          ["Wednesday", "Quarta-feira."],
        ]}
      />
      <Quiz
        items={[
          ["Como se diz “bom dia” em inglês?", "Good morning."],
          ["O que significa “See you later!”?", "Até mais tarde!"],
          ["Qual cor é “yellow”?", "Amarelo."],
          ["Que dia é “Wednesday”?", "Quarta-feira."],
        ]}
      />
    </>,
  ),
];
