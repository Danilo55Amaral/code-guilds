"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { ChoiceGame } from "./art";

// ============================================================================
// CAPÍTULO 6 — PERÍODO COMPOSTO E COESÃO (missões "Orações e Período
// Composto" e "Coesão e Interpretação", a parte da coesão): as orações
// ligadas por correntes, a oração principal com a subordinada pendurada, o
// jogo dos conectivos e o texto repetitivo que fica coeso (de tocar).
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: as orações ligadas pelos conectivos
// ---------------------------------------------------------------------------

function LinksOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Três blocos com orações ligados por elos de corrente com os conectivos “e”, “mas” e “porque”, balançando">
      <rect width="460" height="300" fill="#ecfeff" />
      <g>
        <animateTransform attributeName="transform" type="rotate" values="-2 230 150;2 230 150;-2 230 150" dur="4s" repeatCount="indefinite" />
        {[
          { x: 20, y: 70, text: "Estudei muito", color: "#0891b2" },
          { x: 250, y: 70, text: "fiz a prova", color: "#0d9488" },
          { x: 20, y: 190, text: "não fui bem", color: "#7c3aed" },
          { x: 250, y: 190, text: "estava doente", color: "#db2777" },
        ].map((b) => (
          <g key={b.text}>
            <rect x={b.x} y={b.y} width="190" height="50" rx="12" fill={b.color} />
            <text x={b.x + 95} y={b.y + 32} textAnchor="middle" fontSize="16" fontWeight="900" fill="#fff" fontFamily="Georgia, serif">
              {b.text}
            </text>
          </g>
        ))}
        {[
          { x: 230, y: 95, word: "e" },
          { x: 230, y: 160, word: "mas" },
          { x: 230, y: 215, word: "porque" },
        ].map((l) => (
          <g key={l.word} transform={`translate(${l.x} ${l.y})`}>
            <ellipse rx="34" ry="16" fill="#fef3c7" stroke="#a16207" strokeWidth="4" />
            <text y="6" textAnchor="middle" fontSize="15" fontWeight="900" fill="#78350f" fontFamily="Georgia, serif">
              {l.word}
            </text>
          </g>
        ))}
        {/* o "mas" costura a primeira linha ("...fiz a prova") com a segunda ("não fui bem...") */}
        <path d="M345 120 Q345 160 264 160" stroke="#a16207" strokeWidth="4" fill="none" />
        <path d="M196 160 Q115 160 115 190" stroke="#a16207" strokeWidth="4" fill="none" />
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A oração principal com a subordinada pendurada
// ---------------------------------------------------------------------------

function SubordinateArt() {
  return (
    <Art viewBox="0 0 560 210" label="A oração principal “Quero” num bloco grande, e a oração subordinada “que você venha” pendurada embaixo, balançando, porque ela completa a principal">
      <rect width="560" height="210" rx="14" fill="#f5f3ff" />
      <rect x="40" y="30" width="200" height="56" rx="12" fill="#7c3aed" />
      <text x="140" y="66" textAnchor="middle" fontSize="20" fontWeight="900" fill="#fff" fontFamily="Georgia, serif">
        Quero
      </text>
      <text x="140" y="104" textAnchor="middle" fontSize="12" fontWeight="900" fill="#5b21b6" fontFamily="Georgia, serif">
        oração principal
      </text>
      <g>
        <animateTransform attributeName="transform" type="rotate" values="-8 140 86;8 140 86;-8 140 86" dur="3s" repeatCount="indefinite" />
        <path d="M140 86 L140 130" stroke="#a78bfa" strokeWidth="3" strokeDasharray="5 4" />
        <rect x="50" y="130" width="180" height="50" rx="12" fill="#ddd6fe" stroke="#7c3aed" strokeWidth="2" />
        <text x="140" y="162" textAnchor="middle" fontSize="18" fontWeight="900" fill="#4c1d95" fontFamily="Georgia, serif">
          que você venha
        </text>
      </g>
      <g fontFamily="Georgia, serif" fontWeight="900">
        <text x="290" y="70" fontSize="14" fill="#3b0764">Quero o quê?</text>
        <text x="290" y="96" fontSize="14" fill="#6d28d9">“que você venha”</text>
        <text x="290" y="138" fontSize="12.5" fill="#5b21b6">A subordinada depende da principal:</text>
        <text x="290" y="158" fontSize="12.5" fill="#5b21b6">ela funciona como o objeto do verbo.</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O jogo dos conectivos
// ---------------------------------------------------------------------------

const CONNECTIVES = [
  { prompt: "“Estudei muito, MAS não fui bem na prova.”", options: ["Oposição", "Causa", "Conclusão"], answer: 0, explain: "Mas, porém e contudo indicam oposição (adversativas)." },
  { prompt: "“Não fui à aula PORQUE estava doente.”", options: ["Tempo", "Causa", "Concessão"], answer: 1, explain: "Porque, pois e já que indicam causa." },
  { prompt: "“Choveu muito; PORTANTO, o jogo foi adiado.”", options: ["Conclusão", "Oposição", "Condição"], answer: 0, explain: "Portanto, logo e por isso introduzem uma conclusão." },
  { prompt: "“EMBORA estivesse cansado, ele terminou o trabalho.”", options: ["Causa", "Concessão", "Finalidade"], answer: 1, explain: "Embora e ainda que indicam concessão: uma ideia contrária que não impede a ação." },
  { prompt: "“SE chover, ficaremos em casa.”", options: ["Condição", "Tempo", "Oposição"], answer: 0, explain: "Se e caso indicam condição." },
];

// ---------------------------------------------------------------------------
// O texto que fica coeso (de tocar)
// ---------------------------------------------------------------------------

export function CohesionFix() {
  const [fixed, setFixed] = useState(false);
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <div key={String(fixed)} className="cg-anim-fade rounded-lg bg-white px-[0.7em] py-[0.4em] text-[0.95em] leading-[1.6] text-[#2b2113]">
        {fixed ? (
          <p>
            <mark className="rounded bg-[#dbeafe] px-[0.1em]">Maria</mark> chegou cedo à escola. <mark className="rounded bg-[#dcfce7] px-[0.1em]">Ela</mark> queria um bom lugar,
            pois <mark className="rounded bg-[#dcfce7] px-[0.1em]">a menina</mark> adora sentar na frente. <mark className="rounded bg-[#fef3c7] px-[0.1em]">Por isso</mark>,{" "}
            <mark className="rounded bg-[#dcfce7] px-[0.1em]">a aluna</mark> sempre sai de casa às seis.
          </p>
        ) : (
          <p>
            <mark className="rounded bg-[#fee2e2] px-[0.1em]">Maria</mark> chegou cedo à escola. <mark className="rounded bg-[#fee2e2] px-[0.1em]">Maria</mark> queria um bom lugar.{" "}
            <mark className="rounded bg-[#fee2e2] px-[0.1em]">Maria</mark> adora sentar na frente. <mark className="rounded bg-[#fee2e2] px-[0.1em]">Maria</mark> sempre sai de casa
            às seis.
          </p>
        )}
      </div>
      <div className="mt-[0.4em] flex flex-wrap items-center justify-between gap-[0.4em]">
        <p className="text-[0.82em] text-[#3b2a14]">
          {fixed ? "Pronomes e sinônimos retomam “Maria”, e os conectivos ligam as ideias." : "Repetiu “Maria” quatro vezes e as frases ficaram soltas."}
        </p>
        <button type="button" onClick={() => setFixed((v) => !v)} className="rounded-full bg-[#0891b2] px-[0.9em] py-[0.15em] text-[0.85em] font-black text-white">
          {fixed ? "Ver o texto antes" : "✨ Deixar o texto coeso"}
        </button>
      </div>
    </div>
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
      title="Período Composto e Coesão"
      goals={["As orações coordenadas", "As orações subordinadas", "Que ideia cada conectivo expressa", "Como deixar um texto coeso"]}
    >
      <Fig h={34}>
        <LinksOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🔗">As orações coordenadas</H>
      <P>
        No período composto por <T>coordenação</T>, as orações são independentes: cada uma tem sentido sozinha. Elas podem ser ligadas por uma conjunção (
        <T>sindéticas</T>: “Estudei e passei”) ou só pela vírgula (<T>assindéticas</T>: “Cheguei, vi, venci”).
      </P>
      <Table
        head={["Tipo", "Ideia", "Conjunções"]}
        rows={[
          ["Aditiva", "Soma", "e, nem"],
          ["Adversativa", "Oposição", "mas, porém, contudo"],
          ["Alternativa", "Escolha", "ou, ora... ora"],
          ["Conclusiva", "Conclusão", "portanto, logo, por isso"],
          ["Explicativa", "Explicação", "pois, porque"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="⛓️">As orações subordinadas</H>
      <P>
        No período composto por <T>subordinação</T>, uma oração depende da outra: ela funciona como um termo da <T>oração principal</T>.
      </P>
      <Fig n="6.1" caption="A subordinada fica “pendurada” na principal." h={21}>
        <SubordinateArt />
      </Fig>
      <P>
        As subordinadas <T>adverbiais</T> dão circunstâncias: causa (porque), concessão (embora), condição (se), tempo (quando), finalidade (para que).
      </P>
    </>,
  ),

  page(
    <>
      <H icon="🧭">O sentido dos conectivos</H>
      <P>Os conectivos mostram a relação entre as ideias. Trocar um conectivo pode mudar todo o sentido. Descubra a ideia de cada um:</P>
      <ChoiceGame items={CONNECTIVES} color="#0891b2" title="Que ideia o conectivo expressa?" />
    </>,
  ),

  page(
    <>
      <H icon="🧵">Coesão: as ideias costuradas</H>
      <P>
        Um texto <T>coeso</T> tem as partes bem ligadas. Para isso, usamos pronomes e sinônimos para <T>retomar</T> palavras, sem repetir, e conectivos para ligar as
        ideias. Compare:
      </P>
      <CohesionFix />
      <Box kind="lembre">
        Coesão é a ligação entre as partes do texto. <strong>Coerência</strong> é o texto fazer sentido como um todo.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Coordenadas: orações independentes, sindéticas (com conjunção) ou assindéticas (sem).",
          "Subordinadas: dependem da oração principal e funcionam como um termo dela.",
          "Mas (oposição), porque (causa), portanto (conclusão), embora (concessão), se (condição).",
          "Coesão é ligar as partes do texto com pronomes, sinônimos e conectivos.",
          "Coerência é o texto fazer sentido como um todo.",
        ]}
      />
      <Glossary
        items={[
          ["Período composto", "Período com duas ou mais orações."],
          ["Coordenação", "Ligação de orações independentes."],
          ["Subordinação", "Ligação em que uma oração depende da outra."],
          ["Conectivo", "Palavra que liga orações e ideias."],
          ["Coesão", "A ligação entre as partes do texto."],
        ]}
      />
      <Quiz
        items={[
          ["Que ideia o “mas” expressa em “Estudei, mas não passei”?", "Oposição."],
          ["Quantas orações tem “Cheguei, tomei banho e fui dormir”?", "Três."],
          ["Em “Quero que você venha”, como é a oração “que você venha”?", "Subordinada: funciona como o objeto do verbo querer."],
          ["Para que serve o “ela” em “Maria chegou. Ela queria um lugar.”?", "Retoma “Maria” sem repetir: é um recurso de coesão."],
        ]}
      />
    </>,
  ),
];
