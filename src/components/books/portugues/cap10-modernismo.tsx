"use client";

import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { OpenBook } from "./art";

// ============================================================================
// CAPÍTULO 10 — O MODERNISMO E ALÉM (missão "Língua Portuguesa: Literatura
// Brasileira" e o fim de "As Escolas Literárias"): o teatro de 1922 com as
// formas modernas girando, a pedra no meio do caminho, a família de
// retirantes andando no sertão com a cadela Baleia e a estante dos grandes
// autores.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o Theatro Municipal e as formas modernas
// ---------------------------------------------------------------------------

function ModernOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="A fachada do Theatro Municipal de São Paulo e, em volta, formas geométricas coloridas girando, como na arte moderna de 1922">
      <rect width="460" height="300" fill="#fef9c3" />
      {/* as formas modernas */}
      {[
        { x: 60, y: 60, c: "#ef4444", shape: "tri" },
        { x: 400, y: 70, c: "#2563eb", shape: "sq" },
        { x: 70, y: 220, c: "#16a34a", shape: "circ" },
        { x: 400, y: 220, c: "#f97316", shape: "tri" },
        { x: 230, y: 40, c: "#9333ea", shape: "circ" },
      ].map((f, i) => (
        <g key={i} transform={`translate(${f.x} ${f.y})`}>
          <g>
            <animateTransform attributeName="transform" type="rotate" from="0" to={i % 2 ? "-360" : "360"} dur={`${8 + i * 2}s`} repeatCount="indefinite" />
            {f.shape === "tri" && <path d="M0 -28 L26 18 L-26 18 Z" fill={f.c} opacity="0.85" />}
            {f.shape === "sq" && <rect x="-22" y="-22" width="44" height="44" fill={f.c} opacity="0.85" />}
            {f.shape === "circ" && (
              <g>
                <circle r="24" fill={f.c} opacity="0.85" />
                <path d="M-24 0 A24 24 0 0 1 24 0 Z" fill="#fde047" opacity="0.9" />
              </g>
            )}
          </g>
        </g>
      ))}
      {/* o teatro */}
      <g transform="translate(230 260)">
        <rect x="-110" y="-120" width="220" height="120" fill="#e7e5e4" stroke="#57534e" strokeWidth="2" />
        <path d="M-30 -120 Q0 -170 30 -120 Z" fill="#a8a29e" stroke="#57534e" strokeWidth="2" />
        <path d="M-120 -120 L120 -120 L110 -132 L-110 -132 Z" fill="#d6d3d1" stroke="#57534e" strokeWidth="2" />
        {[-80, -40, 0, 40, 80].map((x) => (
          <g key={x}>
            <rect x={x - 8} y="-110" width="16" height="96" fill="#f5f5f4" stroke="#78716c" />
            <path d={`M${x - 14} -14 L${x + 14} -14`} stroke="#78716c" strokeWidth="3" />
          </g>
        ))}
        <rect x="-20" y="-46" width="40" height="46" fill="#7c2d12" />
      </g>
      <text x="230" y="290" textAnchor="middle" fontSize="13" fontWeight="900" fill="#7c2d12" fontFamily="Georgia, serif">
        São Paulo, fevereiro de 1922
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A pedra no meio do caminho
// ---------------------------------------------------------------------------

function StoneRoadArt() {
  return (
    <Art viewBox="0 0 560 200" label="Uma estrada que vai até o horizonte e, no meio dela, uma pedra grande; uma pessoa caminhando para diante da pedra e para">
      <rect width="560" height="200" rx="14" fill="#e0f2fe" />
      <rect y="110" width="560" height="90" fill="#bbf7d0" />
      <path d="M200 200 L270 110 L290 110 L360 200 Z" fill="#d6d3d1" />
      <path d="M280 200 L280 186 M280 170 L280 156 M280 142 L280 132 M280 124 L280 118" stroke="#fff" strokeWidth="3" />
      {/* a pedra */}
      <path d="M248 166 Q260 136 286 140 Q314 140 316 166 Z" fill="#78716c" stroke="#44403c" strokeWidth="2" />
      <path d="M262 152 Q274 146 284 150" stroke="#a8a29e" strokeWidth="2" fill="none" />
      {/* a pessoa caminhando e parando */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 30;0 0;0 0;0 30" keyTimes="0;0.4;0.9;1" dur="6s" repeatCount="indefinite" />
        <g transform="translate(282 190)">
          <circle cy="-40" r="7" fill="#c68642" />
          <rect x="-6" y="-33" width="12" height="18" rx="4" fill="#1d4ed8" />
          <path d="M-3 -15 L-4 -2 M3 -15 L4 -2" stroke="#1e293b" strokeWidth="4" />
        </g>
      </g>
      <text x="40" y="50" fontSize="16" fontStyle="italic" fontWeight="700" fill="#334155" fontFamily="Georgia, serif">
        “tinha uma pedra no meio do caminho”
      </text>
      <text x="40" y="74" fontSize="12.5" fontWeight="900" fill="#475569" fontFamily="Georgia, serif">
        Carlos Drummond de Andrade, 1928
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A família de retirantes no sertão
// ---------------------------------------------------------------------------

function DroughtArt() {
  return (
    <Art viewBox="0 0 560 200" label="O sertão seco, com cactos e o Sol forte, e uma família de retirantes caminhando com a cadela Baleia, como em Vidas Secas">
      <rect width="560" height="200" rx="14" fill="#fed7aa" />
      <circle cx="480" cy="46" r="28" fill="#fde047" />
      <rect y="140" width="560" height="60" fill="#d97706" />
      {[70, 420].map((x) => (
        <g key={x} transform={`translate(${x} 142)`}>
          <path d="M0 0 L0 -50 M0 -30 L-14 -30 L-14 -44 M0 -36 L14 -36 L14 -48" stroke="#4d7c0f" strokeWidth="9" strokeLinecap="round" fill="none" />
        </g>
      ))}
      <path d="M150 142 L150 100 M150 116 L170 104 M150 108 L134 96" stroke="#78350f" strokeWidth="4" fill="none" />
      {/* a família andando */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;160 0" dur="12s" repeatCount="indefinite" />
        {[
          { x: 200, h: 1.1, c: "#78716c" },
          { x: 230, h: 1, c: "#b45309" },
          { x: 256, h: 0.7, c: "#a8a29e" },
          { x: 276, h: 0.6, c: "#d6d3d1" },
        ].map((p, i) => (
          <g key={i} transform={`translate(${p.x} 146) scale(${p.h})`}>
            <g>
              <animateTransform attributeName="transform" type="translate" values="0 0;0 -2;0 0" dur="0.6s" begin={`${-i * 0.15}s`} repeatCount="indefinite" />
              <circle cy="-44" r="7" fill="#8d5524" />
              <rect x="-6" y="-37" width="12" height="22" rx="4" fill={p.c} />
              <path d="M-3 -15 L-5 0 M3 -15 L5 0" stroke="#44403c" strokeWidth="4" />
            </g>
          </g>
        ))}
        {/* a Baleia */}
        <g transform="translate(300 142)">
          <ellipse rx="14" ry="7" fill="#e7e5e4" stroke="#78716c" />
          <circle cx="13" cy="-7" r="6" fill="#e7e5e4" stroke="#78716c" />
          <path d="M-14 -2 L-22 -8" stroke="#e7e5e4" strokeWidth="3" />
        </g>
      </g>
      <text x="40" y="40" fontSize="15" fontWeight="900" fill="#7c2d12" fontFamily="Georgia, serif">
        Vidas Secas, Graciliano Ramos (1938)
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A estante dos grandes autores
// ---------------------------------------------------------------------------

function ShelfArt() {
  const books = [
    { t: "A Hora da Estrela", c: "#be185d" },
    { t: "Grande Sertão", c: "#15803d" },
    { t: "Quarto de Despejo", c: "#1d4ed8" },
    { t: "Macunaíma", c: "#ca8a04" },
    { t: "Sítio do Picapau", c: "#dc2626" },
  ];
  return (
    <Art viewBox="0 0 560 200" label="Uma estante com os livros A Hora da Estrela, Grande Sertão: Veredas, Quarto de Despejo, Macunaíma e o Sítio do Picapau Amarelo, e um livro aberto virando as páginas">
      <rect width="560" height="200" rx="14" fill="#fef3c7" />
      <rect x="20" y="150" width="330" height="12" fill="#92400e" />
      {books.map((b, i) => (
        <g key={b.t} transform={`translate(${36 + i * 62} 150)`}>
          <g className="cg-anim-rise" style={{ animationDelay: `${i * 0.12}s` }}>
            <rect x="0" y="-120" width="52" height="120" rx="3" fill={b.c} />
            <rect x="6" y="-110" width="40" height="3" fill="#fde68a" />
            <text transform="translate(31 -60) rotate(-90)" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff" fontFamily="Georgia, serif">
              {b.t}
            </text>
          </g>
        </g>
      ))}
      <OpenBook x={455} y={150} s={0.85} cover="#7c3aed" />
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 10, content, bare });

export const chapter10: BookPage[] = [
  page(
    <ChapterOpener
      n={10}
      title="O Modernismo e Além"
      goals={["O que foi a Semana de Arte Moderna de 1922", "Os poetas modernistas, como Drummond", "O romance da seca e do sertão", "Clarice, Guimarães Rosa, Carolina e outros grandes autores"]}
    >
      <Fig h={34}>
        <ModernOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🎨">A Semana de Arte Moderna</H>
      <P>
        Em <T>fevereiro de 1922</T>, no <T>Theatro Municipal de São Paulo</T>, artistas e escritores fizeram a <T>Semana de Arte Moderna</T>, que marcou o início do{" "}
        <T>Modernismo</T> no Brasil. Eles queriam uma arte nova, livre das regras antigas e com a cara do Brasil.
      </P>
      <Cards
        items={[
          { icon: "📕", title: "Mário de Andrade", text: "Escreveu “Macunaíma” (1928), o “herói sem nenhum caráter”, que mistura lendas indígenas e humor." },
          { icon: "✒️", title: "Oswald de Andrade", text: "Propôs a “antropofagia”: “devorar” a cultura de fora e criar algo brasileiro." },
          { icon: "🖼️", title: "Anita Malfatti", text: "Pintora cujas telas cheias de cor chocaram o público e abriram caminho para a arte moderna." },
        ]}
      />
      <Box kind="lembre">Os modernistas usavam o verso livre, sem rima nem métrica fixa, e a linguagem do dia a dia.</Box>
    </>,
  ),

  page(
    <>
      <H icon="🛤️">Drummond e a pedra</H>
      <P>
        <T>Carlos Drummond de Andrade</T> é um dos maiores poetas brasileiros. O poema “<T>No Meio do Caminho</T>”, que repete a imagem de uma pedra no caminho, causou
        polêmica em 1928 justamente por causa das repetições.
      </P>
      <Fig n="10.1" caption="A pedra no meio do caminho, de Drummond." h={20}>
        <StoneRoadArt />
      </Fig>
      <Box kind="sabia">Monteiro Lobato criou o Sítio do Picapau Amarelo, com Emília, Narizinho e Pedrinho, e é um dos pais da literatura infantil brasileira.</Box>
    </>,
  ),

  page(
    <>
      <H icon="🌵">O romance do sertão</H>
      <P>
        Na segunda fase do Modernismo, os romances mostraram os problemas do Brasil. Em “<T>Vidas Secas</T>” (1938), <T>Graciliano Ramos</T> conta a história de
        Fabiano, sinha Vitória, os filhos e a cadela Baleia, uma família de retirantes fugindo da seca no sertão nordestino.
      </P>
      <Fig n="10.2" caption="A família de retirantes no sertão." h={20}>
        <DroughtArt />
      </Fig>
      <P>Rachel de Queiroz (“O Quinze”) e Jorge Amado também retrataram o Nordeste e a vida do povo.</P>
    </>,
  ),

  page(
    <>
      <H icon="📚">Grandes autores</H>
      <Fig n="10.3" caption="Uma estante de clássicos brasileiros." h={20}>
        <ShelfArt />
      </Fig>
      <Cards
        items={[
          { icon: "⭐", title: "Clarice Lispector", text: "“A Hora da Estrela”, com Macabéa. Mergulha nos pensamentos dos personagens." },
          { icon: "🌾", title: "Guimarães Rosa", text: "“Grande Sertão: Veredas” (1956), com a linguagem inventiva do sertanejo Riobaldo." },
          { icon: "📓", title: "Carolina Maria de Jesus", text: "“Quarto de Despejo” (1960), o diário da favela do Canindé, traduzido para mais de dez línguas." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "A Semana de Arte Moderna (1922), em São Paulo, iniciou o Modernismo no Brasil.",
          "Mário de Andrade (Macunaíma), Oswald de Andrade e Anita Malfatti estavam entre os modernistas.",
          "Drummond escreveu “No Meio do Caminho”; os modernistas usavam o verso livre.",
          "“Vidas Secas”, de Graciliano Ramos, mostra a seca no sertão.",
          "Clarice Lispector, Guimarães Rosa e Carolina Maria de Jesus são grandes nomes da literatura.",
        ]}
      />
      <Glossary
        items={[
          ["Modernismo", "Movimento que renovou a arte brasileira a partir de 1922."],
          ["Verso livre", "Verso sem rima nem métrica fixa."],
          ["Antropofagia", "A ideia de “devorar” a cultura de fora para criar algo nosso."],
          ["Retirante", "Quem deixa o sertão fugindo da seca."],
          ["Romance", "Narrativa longa, com muitos personagens."],
        ]}
      />
      <Quiz
        items={[
          ["Que movimento começou com a Semana de 1922?", "O Modernismo."],
          ["Quem escreveu “Macunaíma”?", "Mário de Andrade."],
          ["Do que trata “Vidas Secas”?", "De uma família de retirantes fugindo da seca no sertão nordestino."],
          ["Quem escreveu “Quarto de Despejo”?", "Carolina Maria de Jesus."],
        ]}
      />
    </>,
  ),
];
