"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { ChoiceGame } from "./art";

// ============================================================================
// CAPÍTULO 4 — PONTUAÇÃO E CONCORDÂNCIA (missão "Língua Portuguesa:
// Pontuação e Concordância"): os sinais de pontuação dançando, a vírgula que
// muda o sentido da frase (de tocar), o jogo da concordância verbal e as
// peças de quebra-cabeça da concordância nominal se encaixando.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: os sinais de pontuação dançando
// ---------------------------------------------------------------------------

function PunctuationOpenerArt() {
  const marks = [".", ",", "!", "?", ";", ":", "…"];
  const colors = ["#dc2626", "#ea580c", "#ca8a04", "#16a34a", "#0891b2", "#2563eb", "#9333ea"];
  return (
    <Art viewBox="0 0 460 300" label="Os sinais de pontuação, ponto, vírgula, exclamação, interrogação, ponto e vírgula, dois-pontos e reticências, pulando e dançando em fila">
      <rect width="460" height="300" fill="#fdf2f8" />
      <rect y="220" width="460" height="80" fill="#fbcfe8" />
      {marks.map((m, i) => (
        <g key={i} transform={`translate(${50 + i * 60} 200)`}>
          <g>
            <animateTransform attributeName="transform" type="translate" values="0 0;0 -40;0 0" dur="1.4s" begin={`${-i * 0.2}s`} repeatCount="indefinite" />
            <circle cy="-30" r="26" fill="#fff" stroke={colors[i]} strokeWidth="3" />
            <text y="-14" textAnchor="middle" fontSize="44" fontWeight="900" fill={colors[i]} fontFamily="Georgia, serif">
              {m}
            </text>
          </g>
          <ellipse cy="22" rx="18" ry="5" fill="#f9a8d4" />
        </g>
      ))}
      <text x="230" y="70" textAnchor="middle" fontSize="22" fontWeight="900" fill="#9d174d" fontFamily="Georgia, serif">
        o baile da pontuação
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A vírgula que muda tudo (de tocar)
// ---------------------------------------------------------------------------

const COMMA_PAIRS = [
  { a: "Não, espere!", am: "A pessoa recusa e pede para esperar.", b: "Não espere!", bm: "A pessoa pede para NÃO esperar." },
  { a: "Vamos comer, crianças!", am: "Chamando as crianças para comer.", b: "Vamos comer crianças!", bm: "Socorro! Agora as crianças viraram o almoço." },
  { a: "Maria, a professora chegou.", am: "Estão avisando a Maria que a professora chegou.", b: "Maria, a professora, chegou.", bm: "Quem chegou foi a Maria, que é a professora." },
];

export function CommaToggle() {
  const [sel, setSel] = useState(0);
  const [withB, setWithB] = useState(false);
  const pair = COMMA_PAIRS[sel];
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <div className="flex justify-center gap-[0.3em] text-[0.8em]">
        {COMMA_PAIRS.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setSel(i);
              setWithB(false);
            }}
            className={`rounded-full border px-[0.6em] py-[0.05em] font-bold ${sel === i ? "border-[#db2777] bg-[#db2777] text-white" : "border-[#d9c79d] bg-white"}`}
          >
            Exemplo {i + 1}
          </button>
        ))}
      </div>
      <div key={`${sel}-${withB}`} className="cg-anim-fade mt-[0.5em] text-center">
        <p className="cg-book-title text-[1.5em] font-black text-[#831843]">{withB ? pair.b : pair.a}</p>
        <p className="text-[0.88em] text-[#3b2a14]">{withB ? pair.bm : pair.am}</p>
      </div>
      <div className="mt-[0.4em] flex justify-center">
        <button type="button" onClick={() => setWithB((v) => !v)} className="rounded-full bg-[#db2777] px-[0.9em] py-[0.2em] text-[0.85em] font-black text-white shadow hover:scale-105">
          ✏️ Mudar a vírgula de lugar
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// O jogo da concordância verbal
// ---------------------------------------------------------------------------

const AGREEMENT = [
  { prompt: "“As crianças ____ no parque.”", options: ["brincava", "brincavam"], answer: 1, explain: "O sujeito “as crianças” está no plural: o verbo vai pro plural." },
  { prompt: "“____ muitos problemas na reunião.” (no sentido de existir)", options: ["Houve", "Houveram"], answer: 0, explain: "“Haver” no sentido de existir é impessoal: fica no singular (houve, havia)." },
  { prompt: "“____ dois anos que me mudei.”", options: ["Faz", "Fazem"], answer: 0, explain: "“Fazer” indicando tempo é impessoal: faz dois anos, faz dez dias." },
  { prompt: "“Eu e meu irmão ____ ao cinema.”", options: ["fui", "fomos"], answer: 1, explain: "Eu + meu irmão = nós: o verbo vai pra 1ª pessoa do plural." },
];

// ---------------------------------------------------------------------------
// As peças da concordância nominal
// ---------------------------------------------------------------------------

function PuzzleArt() {
  const piece = (x: number, word: string, color: string, delay: number, fromLeft: boolean) => (
    <g>
      <animateTransform attributeName="transform" type="translate" values={`${fromLeft ? -30 : 30} 0;0 0;0 0;${fromLeft ? -30 : 30} 0`} keyTimes="0;0.3;0.8;1" dur="5s" begin={`${-delay}s`} repeatCount="indefinite" />
      <path
        d={fromLeft ? `M${x} 60 L${x + 150} 60 L${x + 150} 82 a14 14 0 0 1 0 28 L${x + 150} 140 L${x} 140 Z` : `M${x} 60 L${x + 150} 60 L${x + 150} 140 L${x} 140 L${x} 110 a14 14 0 0 0 0 -28 Z`}
        fill={color}
        stroke="#1e293b"
        strokeWidth="2"
      />
      <text x={x + 75} y="108" textAnchor="middle" fontSize="20" fontWeight="900" fill="#fff" fontFamily="Georgia, serif">
        {word}
      </text>
    </g>
  );
  return (
    <Art viewBox="0 0 560 200" label="Duas peças de quebra-cabeça que se encaixam: “meninas” e “alegres”, ambas no feminino plural; e “o livro” com “novo”, ambas no masculino singular">
      <rect width="560" height="200" rx="14" fill="#f0fdf4" />
      {piece(110, "as meninas", "#db2777", 0, true)}
      {piece(260, "alegres", "#9333ea", 0, false)}
      <text x="280" y="176" textAnchor="middle" fontSize="13" fontWeight="900" fill="#14532d" fontFamily="Georgia, serif">
        feminino + plural combinam com feminino + plural
      </text>
      <text x="280" y="36" textAnchor="middle" fontSize="15" fontWeight="900" fill="#166534" fontFamily="Georgia, serif">
        as palavras se encaixam quando concordam
      </text>
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
      title="Pontuação e Concordância"
      goals={["Para que serve cada sinal de pontuação", "As regras da vírgula", "Como o verbo concorda com o sujeito", "Como os nomes concordam entre si"]}
    >
      <Fig h={34}>
        <PunctuationOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="❗">Os sinais de pontuação</H>
      <P>Na fala, a gente usa pausas e entonação. Na escrita, quem faz esse papel são os sinais de pontuação.</P>
      <Table
        head={["Sinal", "Para que serve", "Exemplo"]}
        rows={[
          ["Ponto final (.)", "Termina uma frase", "Hoje choveu."],
          ["Interrogação (?)", "Faz uma pergunta direta", "Você vem?"],
          ["Exclamação (!)", "Surpresa, emoção, ordem", "Que lindo!"],
          ["Vírgula (,)", "Uma pausa curta, separa termos", "Pedro, venha cá."],
          ["Dois-pontos (:)", "Anuncia uma fala, lista ou explicação", "Comprei: pão e leite."],
          ["Reticências (…)", "Uma ideia que fica no ar", "Eu ia dizer, mas…"],
          ["Travessão (—)", "Marca a fala no diálogo", "— Bom dia!"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="✏️">A vírgula muda tudo</H>
      <P>
        A vírgula separa os itens de uma <T>enumeração</T> (arroz, feijão, ovos e leite), o <T>vocativo</T> (Pedro, venha aqui!) e as explicações no meio da frase. E
        uma vírgula fora do lugar muda o sentido. Veja:
      </P>
      <CommaToggle />
      <Box kind="atencao">
        Nunca separe o <strong>sujeito</strong> do <strong>verbo</strong> com vírgula. Errado: “Os alunos, gostam de jogar.” Certo: “Os alunos gostam de jogar.”
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🤝">Concordância verbal</H>
      <P>
        O verbo <T>concorda</T> com o sujeito em número e pessoa: “a criança brinca”, “as crianças brincam”. Mas atenção aos verbos <T>impessoais</T>, que ficam
        sempre no singular: <T>haver</T> no sentido de existir e <T>fazer</T> indicando tempo.
      </P>
      <ChoiceGame items={AGREEMENT} color="#db2777" title="Qual é a forma certa?" />
    </>,
  ),

  page(
    <>
      <H icon="🧩">Concordância nominal</H>
      <P>
        O artigo, o adjetivo, o numeral e o pronome concordam com o <T>substantivo</T> em gênero e número: “as meninas alegres”, “o livro novo”.
      </P>
      <Fig n="4.1" caption="As palavras que concordam se encaixam como peças." h={20}>
        <PuzzleArt />
      </Fig>
      <Box kind="mago" title="Casos que pegam">
        “Mesmo” no sentido de “próprio” concorda: <em>elas mesmas</em> fizeram o bolo. “Anexo” também: <em>as fotos seguem anexas</em>. Já “meio”, no sentido de “um
        pouco”, não muda: <em>ela está meio cansada</em>.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Os sinais de pontuação fazem na escrita o papel das pausas e da entonação da fala.",
          "A vírgula separa enumerações, o vocativo e explicações; não separa o sujeito do verbo.",
          "O verbo concorda com o sujeito em número e pessoa.",
          "Haver (existir) e fazer (tempo) são impessoais: houve problemas, faz dois anos.",
          "Artigo, adjetivo e pronome concordam com o substantivo: elas mesmas, fotos anexas.",
        ]}
      />
      <Glossary
        items={[
          ["Vocativo", "O termo usado para chamar alguém."],
          ["Enumeração", "Uma lista de itens."],
          ["Concordância", "A combinação de gênero, número e pessoa entre as palavras."],
          ["Verbo impessoal", "Verbo sem sujeito, que fica no singular."],
          ["Travessão", "O traço que marca a fala no diálogo."],
        ]}
      />
      <Quiz
        items={[
          ["Qual frase está certa: “Pedro, venha aqui!” ou “Pedro venha aqui!”?", "“Pedro, venha aqui!” (o vocativo leva vírgula)."],
          ["Por que “Os alunos, gostam de jogar” está errada?", "Porque não se separa o sujeito do verbo com vírgula."],
          ["Qual é o certo: “Houve problemas” ou “Houveram problemas”?", "“Houve problemas”."],
          ["Complete: “Seguem ____ as fotos.” (anexo)", "Anexas."],
        ]}
      />
    </>,
  ),
];
