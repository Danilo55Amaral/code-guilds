"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { ChoiceGame, Quill } from "./art";

// ============================================================================
// CAPÍTULO 3 — ORTOGRAFIA E ACENTUAÇÃO (missão "Língua Portuguesa: Ortografia
// e Acentuação"): a pena escrevendo com os acentos flutuando, o jogo dos
// porquês, o jogo das dúvidas comuns, a sílaba tônica de cada palavra (de
// tocar) e o “a + a” virando “à” na crase.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a pena e os acentos
// ---------------------------------------------------------------------------

function AccentsOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma pena escrevendo a palavra “você” num papel, com os sinais de acento agudo, circunflexo, til e crase flutuando em volta">
      <rect width="460" height="300" fill="#fffbeb" />
      <rect x="60" y="150" width="340" height="110" rx="6" fill="#fff" stroke="#d6b77a" strokeWidth="2" />
      {[180, 210, 240].map((y) => (
        <line key={y} x1="76" y1={y} x2="384" y2={y} stroke="#e7dcc4" strokeWidth="1.5" />
      ))}
      <text x="110" y="226" fontSize="54" fontWeight="900" fill="#3b0764" fontFamily="Georgia, serif" strokeDasharray="400" strokeDashoffset="400" stroke="#3b0764" strokeWidth="1">
        <animate attributeName="stroke-dashoffset" values="400;0;0" keyTimes="0;0.6;1" dur="4s" repeatCount="indefinite" />
        você
      </text>
      <Quill x={300} y={214} s={0.9} />
      {["´", "^", "~", "`", "´"].map((mark, i) => (
        <text key={i} x={70 + i * 80} y={70 + (i % 2) * 30} textAnchor="middle" fontSize="54" fontWeight="900" fill={["#dc2626", "#2563eb", "#16a34a", "#9333ea", "#ea580c"][i]} fontFamily="Georgia, serif" className="cg-anim-float" style={{ animationDelay: `${i * 0.35}s` }}>
          {mark}
        </text>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os jogos
// ---------------------------------------------------------------------------

const PORQUES = [
  { prompt: "“____ você não veio à festa?”", options: ["Por que", "Porque", "Por quê", "Porquê"], answer: 0, explain: "Pergunta no começo da frase: por que, separado e sem acento." },
  { prompt: "“Não fui ____ estava doente.”", options: ["por que", "porque", "por quê", "porquê"], answer: 1, explain: "Explicação, resposta: porque, junto e sem acento (dá pra trocar por “pois”)." },
  { prompt: "“Você faltou ontem. ____?”", options: ["Por que", "Porque", "Por quê", "Porquê"], answer: 2, explain: "No fim da pergunta, por quê leva acento." },
  { prompt: "“Ninguém sabe o ____ da briga.”", options: ["por que", "porque", "por quê", "porquê"], answer: 3, explain: "Com artigo antes (o porquê), é substantivo: quer dizer “o motivo”." },
];

const DOUBTS = [
  { prompt: "Qual está escrita certo?", options: ["Excessão", "Exceção", "Eceção"], answer: 1, explain: "Exceção, com xc e ç. Já “excesso” é com ss." },
  { prompt: "“Ele é um menino ____.” (o contrário de bom)", options: ["mal", "mau"], answer: 1, explain: "Mau é o contrário de bom; mal é o contrário de bem." },
  { prompt: "“Ela é ____-educada.” (o contrário de bem-educada)", options: ["mal", "mau"], answer: 0, explain: "Bem-educada → mal-educada." },
  { prompt: "“____ dez anos eu morava aqui.” (tempo que já passou)", options: ["Há", "A"], answer: 0, explain: "Tempo passado: há (dá pra trocar por “faz”). Futuro: “daqui a dez anos”." },
  { prompt: "Qual está escrita certo?", options: ["Paralizar", "Paralisar"], answer: 1, explain: "Vem de paralisia, que tem s; por isso paralisar, com s (como análise → analisar)." },
];

// ---------------------------------------------------------------------------
// A sílaba tônica de cada palavra (de tocar)
// ---------------------------------------------------------------------------

const WORDS: { syl: string[]; tonic: number }[] = [
  { syl: ["ca", "fé"], tonic: 1 },
  { syl: ["li", "vro"], tonic: 0 },
  { syl: ["lâm", "pa", "da"], tonic: 0 },
  { syl: ["sa", "ci"], tonic: 1 },
  { syl: ["mé", "di", "co"], tonic: 0 },
  { syl: ["a", "çú", "car"], tonic: 1 },
];

const TYPE_NAMES = ["proparoxítona", "paroxítona", "oxítona"]; // contando de trás pra frente: última = oxítona

export function TonicFinder() {
  const [sel, setSel] = useState<number | null>(null);
  const w = sel === null ? null : WORDS[sel];
  const fromEnd = w ? w.syl.length - 1 - w.tonic : 0; // 0 = última sílaba
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <div className="flex flex-wrap justify-center gap-[0.35em]">
        {WORDS.map((word, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSel(i)}
            className={`rounded-lg border-2 px-[0.6em] py-[0.15em] font-black ${sel === i ? "border-[#7c3aed] bg-[#f5f3ff]" : "border-[#d9c79d] bg-white hover:bg-[#fef3c7]"}`}
          >
            <span className="cg-book-title text-[1.05em] text-[#2b2113]">{word.syl.join("")}</span>
          </button>
        ))}
      </div>
      {w ? (
        <div key={sel} className="cg-anim-fade mt-[0.5em] text-center">
          <p className="cg-book-title text-[1.6em] font-black tracking-wide">
            {w.syl.map((s, k) => (
              <span key={k}>
                <span className={k === w.tonic ? "rounded px-[0.15em] text-white" : "text-[#78716c]"} style={k === w.tonic ? { background: "#7c3aed" } : undefined}>
                  {s}
                </span>
                {k < w.syl.length - 1 && <span className="text-[#c8b48a]">-</span>}
              </span>
            ))}
          </p>
          <p className="text-[0.88em] font-bold text-[#3b0764]">
            A sílaba mais forte é a {["última", "penúltima", "antepenúltima"][fromEnd]}: é uma palavra <strong>{TYPE_NAMES[2 - fromEnd]}</strong>.
          </p>
        </div>
      ) : (
        <p className="mt-[0.5em] text-center text-[0.85em] text-[#8a7146]">Toque numa palavra para ver a sílaba tônica.</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// A crase: a + a = à
// ---------------------------------------------------------------------------

function CraseArt() {
  return (
    <Art viewBox="0 0 560 200" label="Na frase “Vou à escola”, a preposição “a” e o artigo “a” se juntam e viram “à”, com o acento grave; em “Vou ao colégio”, com palavra masculina, aparece “ao”">
      <rect width="560" height="200" rx="14" fill="#f5f3ff" />
      <g fontFamily="Georgia, serif" fontWeight="900">
        <text x="40" y="70" fontSize="24" fill="#3b0764">
          Vou
        </text>
        {/* o "a" da preposição e o "a" do artigo se juntando */}
        <text y="70" fontSize="24" fill="#dc2626">
          <animate attributeName="x" values="110;140;140" keyTimes="0;0.5;1" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.48;0.5;1" dur="4s" repeatCount="indefinite" />a
        </text>
        <text y="70" fontSize="24" fill="#2563eb">
          <animate attributeName="x" values="170;140;140" keyTimes="0;0.5;1" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.48;0.5;1" dur="4s" repeatCount="indefinite" />a
        </text>
        <text x="140" y="70" fontSize="24" fill="#9333ea" opacity="0">
          <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.5;0.52;1" dur="4s" repeatCount="indefinite" />à
        </text>
        <text x="210" y="70" fontSize="24" fill="#3b0764">
          escola.
        </text>
        <text x="110" y="100" fontSize="12" fill="#dc2626">preposição</text>
        <text x="170" y="116" fontSize="12" fill="#2563eb">artigo</text>
        <text x="40" y="160" fontSize="20" fill="#3b0764">
          Vou ao colégio.
        </text>
        <text x="260" y="160" fontSize="13" fill="#64748b">
          (masculino: a + o = ao, sem crase)
        </text>
      </g>
      <rect x="380" y="40" width="160" height="60" rx="10" fill="#ede9fe" stroke="#7c3aed" strokeWidth="2" />
      <text x="460" y="66" textAnchor="middle" fontSize="14" fontWeight="900" fill="#5b21b6" fontFamily="Georgia, serif">
        a + a = à
      </text>
      <text x="460" y="88" textAnchor="middle" fontSize="11.5" fill="#5b21b6" fontFamily="Georgia, serif">
        acento grave
      </text>
    </Art>
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
      title="Ortografia e Acentuação"
      goals={["Quando usar cada um dos quatro porquês", "As dúvidas mais comuns: mal ou mau, há ou a", "Como achar a sílaba tônica e quando acentuar", "O que é a crase"]}
    >
      <Fig h={34}>
        <AccentsOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="❓">Os quatro porquês</H>
      <Table
        head={["Forma", "Quando usar", "Exemplo"]}
        rows={[
          ["por que", "Pergunta (e “o motivo pelo qual”)", "Por que você riu?"],
          ["por quê", "No fim da frase", "Você riu por quê?"],
          ["porque", "Resposta, explicação", "Ri porque foi engraçado."],
          ["porquê", "Substantivo (o motivo)", "Não sei o porquê."],
        ]}
      />
      <ChoiceGame items={PORQUES} color="#7c3aed" title="O jogo dos porquês" />
    </>,
  ),

  page(
    <>
      <H icon="🤔">Dúvidas comuns</H>
      <P>
        Algumas palavras confundem todo mundo. Dois macetes: <T>mau</T> é o contrário de <T>bom</T>, e <T>mal</T>, o contrário de <T>bem</T>. E <T>há</T> indica tempo
        que já passou (troque por “faz”); para o futuro, usa-se <T>a</T>.
      </P>
      <ChoiceGame items={DOUBTS} color="#0d9488" title="Qual é o certo?" />
    </>,
  ),

  page(
    <>
      <H icon="✍️">A sílaba tônica e o acento</H>
      <P>
        A <T>sílaba tônica</T> é a mais forte da palavra. Pela posição dela, a palavra é <T>oxítona</T> (a última), <T>paroxítona</T> (a penúltima) ou{" "}
        <T>proparoxítona</T> (a antepenúltima). Toque nas palavras:
      </P>
      <TonicFinder />
      <Box kind="lembre">
        <strong>Toda proparoxítona é acentuada</strong>: lâmpada, médico, matemática. Pelo Novo Acordo Ortográfico, os ditongos abertos “ei” e “oi” das paroxítonas
        perderam o acento: <em>ideia</em>, <em>assembleia</em>, <em>heroico</em>.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🎯">A crase</H>
      <P>
        A <T>crase</T> é o encontro da preposição <T>a</T> com o artigo <T>a</T>. Ela é marcada pelo acento grave: <T>à</T>.
      </P>
      <Fig n="3.1" caption="A preposição e o artigo se juntam e viram “à”." h={20}>
        <CraseArt />
      </Fig>
      <Box kind="mago" title="Macete do Mago">
        Troque a palavra feminina por uma masculina. Se aparecer <strong>ao</strong>, tem crase: “vou à escola” → “vou ao colégio”. Não há crase antes de palavra
        masculina (a pé), de verbo (a correr) nem de pronomes como “ele” e “você”.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Por que (pergunta), por quê (fim da frase), porque (explicação) e porquê (o motivo).",
          "Mau é o contrário de bom; mal, o contrário de bem.",
          "Há indica tempo passado; para o futuro, usa-se a (daqui a dez anos).",
          "Oxítona, paroxítona e proparoxítona; toda proparoxítona é acentuada.",
          "Crase é a + a = à; troque por masculino: se der “ao”, tem crase.",
        ]}
      />
      <Glossary
        items={[
          ["Ortografia", "A escrita correta das palavras."],
          ["Sílaba tônica", "A sílaba pronunciada com mais força."],
          ["Proparoxítona", "Palavra com a tônica na antepenúltima sílaba."],
          ["Crase", "A junção da preposição a com o artigo a."],
          ["Novo Acordo", "As regras de escrita comuns aos países de língua portuguesa."],
        ]}
      />
      <Quiz
        items={[
          ["Complete: “Não fui à festa ____ estava doente.”", "Porque."],
          ["Qual é o certo: “mal-educado” ou “mau-educado”?", "Mal-educado (o contrário de bem-educado)."],
          ["“Lâmpada” é oxítona, paroxítona ou proparoxítona?", "Proparoxítona."],
          ["Qual frase tem crase: “Vou à escola” ou “Vou a pé”?", "“Vou à escola”."],
        ]}
      />
    </>,
  ),
];
