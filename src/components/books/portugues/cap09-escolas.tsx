"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Quill } from "./art";

// ============================================================================
// CAPÍTULO 9 — AS ESCOLAS LITERÁRIAS (missão "Língua Portuguesa: As Escolas
// Literárias" e o começo de "Literatura Brasileira"): a caravela e a carta
// de Caminha, a linha do tempo das escolas (de tocar), a palmeira com o
// sabiá da Canção do Exílio, os “olhos de ressaca” de Capitu e o desenho
// do soneto.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a caravela e a carta de Caminha
// ---------------------------------------------------------------------------

function CaminhaOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma caravela portuguesa balançando no mar perto da praia e, na frente, a carta de Pero Vaz de Caminha sendo escrita com uma pena">
      <rect width="460" height="180" fill="#bae6fd" />
      <rect y="150" width="460" height="150" fill="#0284c7" />
      <path d="M300 150 Q380 120 460 130 L460 160 Z" fill="#fcd34d" />
      <path d="M360 132 L372 96 L384 132 Z" fill="#16a34a" />
      <g>
        <animateTransform attributeName="transform" type="rotate" values="-3 140 150;3 140 150;-3 140 150" dur="3s" repeatCount="indefinite" />
        <path d="M70 140 L210 140 L190 168 L90 168 Z" fill="#92400e" />
        <path d="M140 140 L140 40" stroke="#78350f" strokeWidth="5" />
        <path d="M144 48 Q190 80 144 120 Z" fill="#fff" stroke="#cbd5e1" />
        <path d="M136 56 Q96 86 136 116 Z" fill="#fff" stroke="#cbd5e1" />
        <path d="M128 70 L152 70 M140 60 L140 82" stroke="#dc2626" strokeWidth="5" />
      </g>
      <g transform="translate(150 190)">
        <rect x="0" y="0" width="200" height="96" fill="#fef3c7" stroke="#a16207" strokeWidth="2" />
        <text x="16" y="28" fontSize="13" fontStyle="italic" fill="#78350f" fontFamily="Georgia, serif">
          Senhor,
        </text>
        <text x="16" y="50" fontSize="11.5" fontStyle="italic" fill="#78350f" fontFamily="Georgia, serif">
          esta terra é muito boa...
        </text>
        <text x="110" y="84" fontSize="11" fontWeight="900" fill="#92400e" fontFamily="Georgia, serif">
          1500
        </text>
      </g>
      <Quill x={322} y={252} s={0.7} />
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A linha do tempo das escolas (de tocar)
// ---------------------------------------------------------------------------

const SCHOOLS = [
  { name: "Quinhentismo", year: "1500", color: "#0891b2", authors: "Pero Vaz de Caminha, José de Anchieta", text: "Os primeiros textos sobre o Brasil: a carta de Caminha ao rei de Portugal e os textos dos jesuítas para catequizar os indígenas." },
  { name: "Barroco", year: "1601", color: "#7c2d12", authors: "Gregório de Matos, Padre Antônio Vieira", text: "Contrastes e conflitos: fé e prazer, céu e terra. Gregório de Matos, o “Boca do Inferno”, fazia sátiras da sociedade de Salvador." },
  { name: "Arcadismo", year: "1768", color: "#15803d", authors: "Tomás Antônio Gonzaga, Cláudio Manuel da Costa", text: "A vida simples no campo, com pastores e natureza. Gonzaga escreveu “Marília de Dirceu” e participou da Inconfidência Mineira." },
  { name: "Romantismo", year: "1836", color: "#be185d", authors: "Gonçalves Dias, José de Alencar, Castro Alves", text: "Amor, saudade e orgulho do Brasil. O indígena virou herói nacional (indianismo) e Castro Alves lutou contra a escravidão." },
  { name: "Realismo e Naturalismo", year: "1881", color: "#334155", authors: "Machado de Assis, Aluísio Azevedo", text: "Um olhar objetivo e crítico da sociedade, sem idealizar. O Naturalismo mostra as pessoas influenciadas pelo meio, como em “O Cortiço”." },
  { name: "Parnasianismo", year: "1882", color: "#a16207", authors: "Olavo Bilac", text: "A “arte pela arte”: sonetos de forma perfeita, rimas ricas e palavras raras. Bilac escreveu a letra do Hino à Bandeira." },
  { name: "Simbolismo", year: "1893", color: "#6d28d9", authors: "Cruz e Sousa, Alphonsus de Guimaraens", text: "Mistério, sonho e musicalidade. Cruz e Sousa, poeta negro de Santa Catarina, publicou “Broquéis” em 1893." },
];

export function SchoolsTimeline() {
  const [sel, setSel] = useState(0);
  const s = SCHOOLS[sel];
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <div className="relative flex justify-between">
        <div className="absolute left-[4%] right-[4%] top-[0.85em] h-[3px] bg-[#d9c79d]" />
        {SCHOOLS.map((x, i) => (
          <button key={x.name} type="button" onClick={() => setSel(i)} className="relative flex flex-col items-center" title={x.name}>
            <span
              className={`flex h-[1.7em] w-[1.7em] items-center justify-center rounded-full border-2 text-[0.75em] font-black text-white transition-transform ${sel === i ? "scale-125" : ""}`}
              style={{ background: x.color, borderColor: sel === i ? "#1e293b" : "#fff" }}
            >
              {i + 1}
            </span>
            <span className="mt-[0.2em] text-[0.62em] font-bold text-[#5b4a2e]">{x.year}</span>
          </button>
        ))}
      </div>
      <div key={sel} className="cg-anim-fade mt-[0.5em] rounded-lg px-[0.7em] py-[0.4em]" style={{ background: `${s.color}14`, borderLeft: `5px solid ${s.color}` }}>
        <p className="cg-book-title font-black" style={{ color: s.color }}>
          {s.name} <span className="text-[0.8em] text-[#5b4a2e]">· a partir de {s.year}</span>
        </p>
        <p className="text-[0.88em] leading-[1.45] text-[#2b2113]">{s.text}</p>
        <p className="mt-[0.2em] text-[0.8em] italic text-[#5b4a2e]">Autores: {s.authors}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A palmeira e o sabiá da Canção do Exílio
// ---------------------------------------------------------------------------

function PalmArt() {
  return (
    <Art viewBox="0 0 560 210" label="Uma palmeira com um sabiá cantando no alto, com notas musicais saindo, e os primeiros versos da Canção do Exílio ao lado">
      <rect width="560" height="210" rx="14" fill="#fdf2f8" />
      <rect y="180" width="560" height="30" fill="#86efac" />
      {/* a palmeira balançando */}
      <g transform="translate(130 180)">
        <path d="M0 0 Q-8 -70 6 -130" stroke="#92400e" strokeWidth="12" fill="none" />
        <g transform="translate(6 -130)">
          <g>
            <animateTransform attributeName="transform" type="rotate" values="-5;5;-5" dur="3s" repeatCount="indefinite" />
            {[-150, -110, -60, -20, 20].map((a) => (
              <path key={a} d="M0 0 Q34 -14 70 6" stroke="#16a34a" strokeWidth="8" fill="none" strokeLinecap="round" transform={`rotate(${a + 60})`} />
            ))}
            {/* o sabiá */}
            <g transform="translate(-6 -10)">
              <ellipse rx="11" ry="8" fill="#a16207" />
              <ellipse cx="2" cy="3" rx="7" ry="5" fill="#fb923c" />
              <circle cx="-9" cy="-5" r="6" fill="#a16207" />
              <path d="M-15 -5 L-21 -3 L-15 -2 Z" fill="#facc15" />
            </g>
          </g>
        </g>
      </g>
      {["♪", "♫"].map((n, i) => (
        <text key={i} fontSize="22" fill="#be185d" fontWeight="900">
          <animate attributeName="x" values="110;60" dur="2.4s" begin={`${-i * 1.2}s`} repeatCount="indefinite" />
          <animate attributeName="y" values="40;0" dur="2.4s" begin={`${-i * 1.2}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0" dur="2.4s" begin={`${-i * 1.2}s`} repeatCount="indefinite" />
          {n}
        </text>
      ))}
      <g fontFamily="Georgia, serif" fontStyle="italic" fill="#831843">
        <text x="260" y="70" fontSize="17">“Minha terra tem palmeiras,</text>
        <text x="260" y="98" fontSize="17">Onde canta o Sabiá;</text>
        <text x="260" y="126" fontSize="17">As aves, que aqui gorjeiam,</text>
        <text x="260" y="154" fontSize="17">Não gorjeiam como lá.”</text>
      </g>
      <text x="520" y="190" textAnchor="end" fontSize="12" fontWeight="900" fill="#9d174d" fontFamily="Georgia, serif">
        Gonçalves Dias, 1843
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os “olhos de ressaca” de Capitu
// ---------------------------------------------------------------------------

function CapituEyesArt() {
  return (
    <Art viewBox="0 0 560 200" label="Dois olhos grandes com ondas do mar se mexendo dentro deles, os “olhos de ressaca” de Capitu, ao lado do livro Dom Casmurro">
      <rect width="560" height="200" rx="14" fill="#f1f5f9" />
      <defs>
        {[150, 300].map((cx) => (
          <clipPath key={cx} id={`capitu-olho-${cx}`}>
            <ellipse cx={cx} cy="100" rx="62" ry="36" />
          </clipPath>
        ))}
      </defs>
      {[150, 300].map((cx, i) => (
        <g key={cx}>
          <ellipse cx={cx} cy="100" rx="62" ry="36" fill="#fff" stroke="#1e293b" strokeWidth="3" />
          <g clipPath={`url(#capitu-olho-${cx})`}>
            <circle cx={cx} cy="100" r="26" fill="#0e7490" />
            {[0, 1, 2].map((k) => (
              <path key={k} d={`M${cx - 70} ${92 + k * 10} q12 -8 24 0 t24 0 t24 0 t24 0 t24 0 t24 0`} stroke="#a5f3fc" strokeWidth="2.5" fill="none">
                <animateTransform attributeName="transform" type="translate" values="0 0;-24 0" dur={`${1.4 + k * 0.3}s`} begin={`${-i * 0.4}s`} repeatCount="indefinite" />
              </path>
            ))}
            <circle cx={cx} cy="100" r="9" fill="#082f49" />
          </g>
          <path d={`M${cx - 66} 70 Q${cx} 40 ${cx + 66} 70`} stroke="#1e293b" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      ))}
      <g transform="translate(410 40)">
        <rect width="110" height="130" rx="6" fill="#334155" />
        <rect x="8" y="8" width="94" height="114" rx="4" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="55" y="58" textAnchor="middle" fontSize="15" fontWeight="900" fill="#fef3c7" fontFamily="Georgia, serif">
          Dom
        </text>
        <text x="55" y="80" textAnchor="middle" fontSize="15" fontWeight="900" fill="#fef3c7" fontFamily="Georgia, serif">
          Casmurro
        </text>
        <text x="55" y="108" textAnchor="middle" fontSize="10" fill="#fde68a" fontFamily="Georgia, serif">
          Machado de Assis
        </text>
      </g>
      <text x="225" y="170" textAnchor="middle" fontSize="13" fontStyle="italic" fontWeight="700" fill="#0e7490" fontFamily="Georgia, serif">
        “olhos de ressaca”: puxam como as ondas do mar
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O soneto: 2 quartetos e 2 tercetos
// ---------------------------------------------------------------------------

function SonnetArt() {
  const stanzas = [4, 4, 3, 3];
  let line = 0;
  return (
    <Art viewBox="0 0 560 220" label="O desenho de um soneto: 14 versos divididos em duas estrofes de quatro versos, os quartetos, e duas de três, os tercetos">
      <rect width="560" height="220" rx="14" fill="#fefce8" />
      {stanzas.map((n, si) => {
        const x = 30 + si * 130;
        return (
          <g key={si}>
            <rect x={x} y="30" width="118" height={n * 26 + 18} rx="10" fill={si < 2 ? "#fef3c7" : "#ede9fe"} stroke={si < 2 ? "#ca8a04" : "#7c3aed"} strokeWidth="2" />
            {Array.from({ length: n }, (_, k) => {
              line += 1;
              const delay = line * 0.25;
              return (
                <g key={k} className="cg-anim-rise" style={{ animationDelay: `${delay}s` }}>
                  <line x1={x + 14} y1={52 + k * 26} x2={x + 104 - (k % 2) * 16} y2={52 + k * 26} stroke={si < 2 ? "#a16207" : "#6d28d9"} strokeWidth="4" strokeLinecap="round" />
                </g>
              );
            })}
            <text x={x + 59} y={n * 26 + 72} textAnchor="middle" fontSize="13" fontWeight="900" fill={si < 2 ? "#854d0e" : "#5b21b6"} fontFamily="Georgia, serif">
              {si < 2 ? "quarteto" : "terceto"}
            </text>
          </g>
        );
      })}
      <text x="280" y="200" textAnchor="middle" fontSize="14" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
        4 + 4 + 3 + 3 = 14 versos
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 9, content, bare });

export const chapter9: BookPage[] = [
  page(
    <ChapterOpener
      n={9}
      title="As Escolas Literárias"
      goals={["O que são as escolas literárias", "Do Quinhentismo ao Simbolismo, em ordem", "O Romantismo e a Canção do Exílio", "Machado de Assis e o Realismo"]}
    >
      <Fig h={34}>
        <CaminhaOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="⏳">As escolas literárias</H>
      <P>
        As <T>escolas literárias</T> são os movimentos da literatura em cada época, com jeitos parecidos de escrever. A literatura no Brasil começa em <T>1500</T>, com
        a <T>Carta de Pero Vaz de Caminha</T> ao rei de Portugal. Toque em cada escola:
      </P>
      <SchoolsTimeline />
    </>,
  ),

  page(
    <>
      <H icon="🌴">O Romantismo</H>
      <P>
        O <T>Romantismo</T> valorizou o sentimento, a saudade e o orgulho do Brasil. A <T>Canção do Exílio</T>, de <T>Gonçalves Dias</T>, é um dos poemas mais famosos
        da língua portuguesa:
      </P>
      <Fig n="9.1" caption="A saudade da terra natal na Canção do Exílio." h={21}>
        <PalmArt />
      </Fig>
      <Box kind="sabia">
        <strong>José de Alencar</strong> escreveu “Iracema” e “O Guarani”. “Iracema” é um anagrama de “América”! E <strong>Castro Alves</strong>, o “poeta dos escravos”,
        escreveu “O Navio Negreiro”.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🎩">Machado de Assis e o Realismo</H>
      <P>
        <T>Machado de Assis</T> é um dos maiores escritores do Brasil. “<T>Memórias Póstumas de Brás Cubas</T>” (1881), narrado por um defunto, marca o início do{" "}
        <T>Realismo</T>. Em “<T>Dom Casmurro</T>”, o narrador Bentinho acusa Capitu, a dos “olhos de ressaca”, de traição, mas o leitor nunca tem certeza.
      </P>
      <Fig n="9.2" caption="Capitu tem os “olhos de ressaca”, que puxam como o mar." h={20}>
        <CapituEyesArt />
      </Fig>
      <Box kind="lembre">
        Machado fundou a <strong>Academia Brasileira de Letras</strong>, em 1897, e foi o primeiro presidente dela. No mesmo período, o <strong>Naturalismo</strong> de
        Aluísio Azevedo mostrou a vida num cortiço do Rio em “O Cortiço”.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="💎">Parnasianismo e Simbolismo</H>
      <P>
        O <T>Parnasianismo</T> defendia a “arte pela arte”: o poema devia ter forma perfeita, rimas ricas e palavras raras. Seu grande nome é <T>Olavo Bilac</T>, que
        escreveu muitos sonetos:
      </P>
      <Fig n="9.3" caption="O soneto: 14 versos em 4 estrofes." h={19}>
        <SonnetArt />
      </Fig>
      <Box kind="sabia">
        <strong>Cruz e Sousa</strong>, poeta negro nascido em Santa Catarina, é o maior nome do <strong>Simbolismo</strong> no Brasil. Seus poemas buscam o mistério, o
        sonho e a música das palavras.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "A literatura no Brasil começa com a Carta de Pero Vaz de Caminha (1500), no Quinhentismo.",
          "Barroco (Gregório de Matos), Arcadismo (Gonzaga) e Romantismo (Gonçalves Dias, Alencar, Castro Alves).",
          "O Realismo, com Machado de Assis, critica a sociedade sem idealizar; o Naturalismo tem “O Cortiço”.",
          "O Parnasianismo de Bilac busca a forma perfeita; o soneto tem 14 versos.",
          "O Simbolismo, de Cruz e Sousa, busca o mistério e a musicalidade.",
        ]}
      />
      <Glossary
        items={[
          ["Escola literária", "Movimento da literatura de uma época."],
          ["Indianismo", "O indígena como herói nacional, no Romantismo."],
          ["Realismo", "Literatura objetiva e crítica, sem idealizar."],
          ["Soneto", "Poema de 14 versos: 2 quartetos e 2 tercetos."],
          ["Estrofe", "Um grupo de versos."],
        ]}
      />
      <Quiz
        items={[
          ["Qual é o primeiro texto escrito sobre o Brasil?", "A Carta de Pero Vaz de Caminha, de 1500."],
          ["Quem escreveu a Canção do Exílio?", "Gonçalves Dias."],
          ["Quem é o “poeta dos escravos”?", "Castro Alves."],
          ["Qual é a grande dúvida de “Dom Casmurro”?", "Se Capitu traiu Bentinho."],
        ]}
      />
    </>,
  ),
];
