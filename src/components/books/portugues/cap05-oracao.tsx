"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table, useUid } from "../BookParts";
import type { BookPage } from "../types";
import { ChoiceGame } from "./art";

// ============================================================================
// CAPÍTULO 5 — A ORAÇÃO E SEUS TERMOS (missões "Língua Portuguesa: Pontuação
// e Concordância", a parte do sujeito, e "Orações e Período Composto", a dos
// termos): o trem da frase com os vagões, o analisador de sujeito e
// predicado (de tocar), o jogo dos complementos e a frase virando da voz
// ativa pra passiva.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o trem da frase
// ---------------------------------------------------------------------------

function SentenceTrainArt() {
  const u = useUid("trem");
  const cars = [
    { text: "As crianças", color: "#2563eb" },
    { text: "brincavam", color: "#dc2626" },
    { text: "no parque.", color: "#16a34a" },
  ];
  return (
    <Art viewBox="0 0 460 300" label="Um trem com três vagões, cada um com um pedaço da frase “As crianças brincavam no parque”, andando nos trilhos">
      <rect width="460" height="300" fill="#eff6ff" />
      <rect y="200" width="460" height="100" fill="#bbf7d0" />
      <path d="M0 214 L460 214" stroke="#78350f" strokeWidth="4" />
      {Array.from({ length: 24 }, (_, i) => (
        <rect key={i} x={i * 20} y="214" width="10" height="6" fill="#92400e" />
      ))}
      <defs>
        <clipPath id={u}>
          <rect width="460" height="300" rx="14" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${u})`}>
        <animateTransform attributeName="transform" type="translate" values="-470 0;0 0;0 0;470 0" keyTimes="0;0.2;0.8;1" dur="9s" repeatCount="indefinite" />
        {/* a locomotiva */}
        <g transform="translate(372 200)">
          <rect x="0" y="-56" width="70" height="50" rx="6" fill="#7c3aed" />
          <rect x="44" y="-80" width="16" height="26" fill="#5b21b6" />
          <circle cx="16" cy="-4" r="11" fill="#1e293b" />
          <circle cx="52" cy="-4" r="11" fill="#1e293b" />
          <text x="35" y="-24" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff" fontFamily="Georgia, serif">
            Frase
          </text>
        </g>
        {cars.map((c, i) => (
          <g key={c.text} transform={`translate(${20 + i * 118} 200)`}>
            <rect x="0" y="-50" width="108" height="44" rx="6" fill={c.color} />
            <circle cx="20" cy="-4" r="10" fill="#1e293b" />
            <circle cx="88" cy="-4" r="10" fill="#1e293b" />
            <text x="54" y="-23" textAnchor="middle" fontSize="13.5" fontWeight="900" fill="#fff" fontFamily="Georgia, serif">
              {c.text}
            </text>
            <path d="M108 -20 L118 -20" stroke="#1e293b" strokeWidth="4" />
          </g>
        ))}
      </g>
      <g fontFamily="Georgia, serif" fontSize="14" fontWeight="900" textAnchor="middle">
        <text x="74" y="110" fill="#2563eb">sujeito</text>
        <text x="270" y="110" fill="#dc2626">predicado</text>
      </g>
      <path d="M20 118 L128 118 M150 118 L362 118" stroke="#94a3b8" strokeWidth="2" />
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O analisador de sujeito e predicado (de tocar)
// ---------------------------------------------------------------------------

const ANALYSIS: { parts: [string, "s" | "p"][]; kind: string; note: string }[] = [
  { parts: [["As crianças", "s"], ["brincavam no parque.", "p"]], kind: "Sujeito simples", note: "Um núcleo só: “crianças”." },
  { parts: [["Ana e Léo", "s"], ["chegaram cedo.", "p"]], kind: "Sujeito composto", note: "Dois núcleos: “Ana” e “Léo”." },
  { parts: [["Fomos ao cinema ontem.", "p"]], kind: "Sujeito oculto (desinencial)", note: "Não aparece, mas o verbo mostra: fomos = nós." },
  { parts: [["Choveu muito ontem.", "p"]], kind: "Oração sem sujeito", note: "Fenômenos da natureza (chover, nevar, trovejar) não têm sujeito." },
];

export function SubjectFinder() {
  const [sel, setSel] = useState(0);
  const [show, setShow] = useState(false);
  const a = ANALYSIS[sel];
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <div className="flex flex-wrap justify-center gap-[0.3em] text-[0.8em]">
        {ANALYSIS.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setSel(i);
              setShow(false);
            }}
            className={`rounded-full border px-[0.6em] py-[0.05em] font-bold ${sel === i ? "border-[#2563eb] bg-[#2563eb] text-white" : "border-[#d9c79d] bg-white"}`}
          >
            Frase {i + 1}
          </button>
        ))}
      </div>
      <p key={sel} className="cg-anim-fade cg-book-title mt-[0.5em] text-center text-[1.35em] font-black leading-[1.6]">
        {a.parts.map(([text, role], i) => (
          <span
            key={i}
            className="mx-[0.1em] rounded px-[0.2em] transition-colors"
            style={show ? { background: role === "s" ? "#dbeafe" : "#fee2e2", color: role === "s" ? "#1d4ed8" : "#b91c1c", boxShadow: `inset 0 -3px 0 ${role === "s" ? "#2563eb" : "#dc2626"}` } : { color: "#2b2113" }}
          >
            {text}
          </span>
        ))}
      </p>
      <div className="mt-[0.3em] flex justify-center">
        <button type="button" onClick={() => setShow((v) => !v)} className="rounded-full bg-[#2563eb] px-[0.9em] py-[0.15em] text-[0.85em] font-black text-white">
          {show ? "Esconder" : "🔍 Mostrar sujeito e predicado"}
        </button>
      </div>
      {show && (
        <p className="cg-anim-fade mt-[0.35em] rounded-lg bg-[#eff6ff] px-[0.6em] py-[0.25em] text-center text-[0.86em] text-[#1e3a8a]">
          <strong>{a.kind}.</strong> {a.note}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// O jogo dos complementos
// ---------------------------------------------------------------------------

const TERMS = [
  { prompt: "Em “O menino comprou um livro”, o que é “um livro”?", options: ["Objeto direto", "Objeto indireto", "Sujeito"], answer: 0, explain: "Comprou o quê? Um livro. Completa o verbo sem preposição." },
  { prompt: "Em “Gosto de chocolate”, o que é “de chocolate”?", options: ["Objeto direto", "Objeto indireto", "Adjunto adverbial"], answer: 1, explain: "Quem gosta, gosta DE algo: o complemento vem com preposição." },
  { prompt: "Em “A menina parecia cansada”, o que é “cansada”?", options: ["Predicativo do sujeito", "Objeto direto", "Aposto"], answer: 0, explain: "Com verbo de ligação (ser, estar, parecer), a característica do sujeito é o predicativo." },
  { prompt: "Em “Machado de Assis, o fundador da ABL, nasceu no Rio”, o trecho entre vírgulas é:", options: ["Vocativo", "Aposto", "Sujeito"], answer: 1, explain: "O aposto explica um termo anterior e costuma vir entre vírgulas." },
  { prompt: "Em “Ontem choveu na cidade”, “ontem” e “na cidade” são:", options: ["Objetos", "Adjuntos adverbiais", "Predicativos"], answer: 1, explain: "Indicam circunstâncias: tempo (ontem) e lugar (na cidade)." },
];

// ---------------------------------------------------------------------------
// Da voz ativa pra voz passiva
// ---------------------------------------------------------------------------

function VoiceArt() {
  const row = (y: number, words: [string, number, string][]) =>
    words.map(([w, x, color]) => (
      <text key={w} x={x} y={y} fontSize="20" fill={color}>
        {w}
      </text>
    ));
  return (
    <Art viewBox="0 0 560 200" label="A frase na voz ativa, “A professora escreveu o livro”, troca de lugar e vira a voz passiva, “O livro foi escrito pela professora”">
      <rect width="560" height="200" rx="14" fill="#fefce8" />
      <g fontFamily="Georgia, serif" fontWeight="900">
        <text x="24" y="30" fontSize="13" fill="#854d0e">
          voz ativa: o sujeito faz a ação
        </text>
        {row(66, [
          ["A professora", 24, "#2563eb"],
          ["escreveu", 188, "#dc2626"],
          ["o livro.", 300, "#16a34a"],
        ])}
        {row(168, [
          ["O livro", 24, "#16a34a"],
          ["foi escrito", 122, "#dc2626"],
          ["pela professora.", 260, "#2563eb"],
        ])}
        <text x="24" y="192" fontSize="13" fill="#854d0e">
          voz passiva: o sujeito sofre a ação
        </text>
      </g>
      {/* as palavras trocando de lugar */}
      <g fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M99 78 C99 112 355 112 355 146" stroke="#2563eb" strokeDasharray="8 7" className="cg-anim-dash" />
        <path d="M349 138 L355 147 L361 138" stroke="#2563eb" />
        <path d="M335 78 C335 112 66 112 66 146" stroke="#16a34a" strokeDasharray="8 7" className="cg-anim-dash" />
        <path d="M60 138 L66 147 L72 138" stroke="#16a34a" />
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 5, content, bare });

export const chapter5: BookPage[] = [
  page(
    <ChapterOpener
      n={5}
      title="A Oração e Seus Termos"
      goals={["A diferença entre frase, oração e período", "Como achar o sujeito e o predicado", "Os objetos, o predicativo, os adjuntos e o aposto", "A voz ativa e a voz passiva"]}
    >
      <Fig h={34}>
        <SentenceTrainArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🚂">Frase, oração e período</H>
      <Table
        head={["Nome", "O que é", "Exemplo"]}
        rows={[
          ["Frase", "Qualquer enunciado com sentido completo", "Socorro! / Que dia lindo!"],
          ["Oração", "Enunciado organizado em torno de um verbo", "Choveu."],
          ["Período simples", "Uma oração só (um verbo)", "Ana estudou."],
          ["Período composto", "Duas ou mais orações", "Ana estudou e passou."],
        ]}
      />
      <Box kind="mago" title="Macete do Mago">
        Para contar as orações de um período, conte os <strong>verbos</strong>: “Cheguei, tomei banho e fui dormir” tem três verbos, então tem três orações.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🔍">Sujeito e predicado</H>
      <P>
        O <T>sujeito</T> é o ser de quem se fala; o <T>predicado</T> é o que se diz sobre ele. Nem sempre o sujeito aparece, e às vezes ele nem existe. Analise:
      </P>
      <SubjectFinder />
      <P>
        Para achar o sujeito, pergunte ao verbo “quem?”: <em>quem</em> brincava no parque? As crianças.
      </P>
    </>,
  ),

  page(
    <>
      <H icon="🧩">Os outros termos</H>
      <P>
        Alguns verbos pedem um complemento: o <T>objeto direto</T> (sem preposição) ou o <T>objeto indireto</T> (com preposição). E há termos que dão mais
        informações, como o <T>adjunto adverbial</T> e o <T>aposto</T>. Teste:
      </P>
      <ChoiceGame items={TERMS} color="#2563eb" title="Que termo é esse?" />
    </>,
  ),

  page(
    <>
      <H icon="🔄">Voz ativa e voz passiva</H>
      <P>
        Na <T>voz ativa</T>, o sujeito pratica a ação. Na <T>voz passiva</T>, o sujeito sofre a ação, e quem fez aparece como <T>agente da passiva</T> (“pela
        professora”).
      </P>
      <Fig n="5.1" caption="A mesma ideia nas duas vozes." h={20}>
        <VoiceArt />
      </Fig>
      <Box kind="lembre">A voz passiva é muito usada nas notícias: “O ladrão foi preso pela polícia.”</Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Frase tem sentido completo; oração tem verbo; período tem uma ou mais orações.",
          "O sujeito é de quem se fala; o predicado é o que se diz dele.",
          "Sujeito simples, composto, oculto e a oração sem sujeito (choveu).",
          "Objeto direto (sem preposição), objeto indireto (com preposição), predicativo, adjunto adverbial e aposto.",
          "Na voz passiva, o sujeito sofre a ação: “O livro foi escrito pela professora”.",
        ]}
      />
      <Glossary
        items={[
          ["Oração", "Enunciado com verbo."],
          ["Sujeito oculto", "Sujeito que não aparece, mas o verbo indica."],
          ["Objeto direto", "Complemento do verbo sem preposição."],
          ["Predicativo", "Característica do sujeito ligada por verbo de ligação."],
          ["Aposto", "Termo que explica outro, entre vírgulas."],
        ]}
      />
      <Quiz
        items={[
          ["Qual é o sujeito de “As crianças brincavam no parque”?", "As crianças."],
          ["Qual é o sujeito de “Choveu muito ontem”?", "Não tem: é uma oração sem sujeito."],
          ["Em “Gosto de chocolate”, o que é “de chocolate”?", "Objeto indireto."],
          ["Passe para a voz passiva: “A professora escreveu o livro.”", "“O livro foi escrito pela professora.”"],
        ]}
      />
    </>,
  ),
];
