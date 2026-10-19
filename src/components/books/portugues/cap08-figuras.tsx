"use client";

import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Balloon, ChoiceGame } from "./art";

// ============================================================================
// CAPÍTULO 8 — FIGURAS DE LINGUAGEM (missão "Língua Portuguesa: Figuras de
// Linguagem"): as máscaras do teatro com os olhos de estrela, a comparação
// (forte como um leão) e a metáfora, o vento cantando na janela e as
// onomatopeias, e o jogo de descobrir a figura.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: as máscaras do teatro
// ---------------------------------------------------------------------------

function MasksOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="As duas máscaras do teatro, a feliz e a triste, balançando, com estrelinhas brilhando em volta">
      <rect width="460" height="300" fill="#1e1b4b" />
      {Array.from({ length: 14 }, (_, i) => (
        <text key={i} x={30 + ((i * 67) % 400)} y={30 + ((i * 43) % 240)} fontSize="14" fill="#fde047" className="cg-anim-twinkle" style={{ animationDelay: `${i * 0.3}s` }}>
          ✦
        </text>
      ))}
      {[
        { x: 170, color: "#fbbf24", happy: true, rot: -12 },
        { x: 290, color: "#a78bfa", happy: false, rot: 12 },
      ].map((m) => (
        <g key={m.x} transform={`translate(${m.x} 150)`}>
          <g>
            <animateTransform attributeName="transform" type="rotate" values={`${m.rot - 6};${m.rot + 6};${m.rot - 6}`} dur="3s" repeatCount="indefinite" />
            <path d="M-60 -60 Q0 -84 60 -60 Q66 20 0 76 Q-66 20 -60 -60 Z" fill={m.color} stroke="#1e1b4b" strokeWidth="3" />
            <path d={m.happy ? "M-36 -20 Q-24 -32 -12 -20" : "M-36 -28 Q-24 -16 -12 -28"} stroke="#1e1b4b" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d={m.happy ? "M12 -20 Q24 -32 36 -20" : "M12 -28 Q24 -16 36 -28"} stroke="#1e1b4b" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d={m.happy ? "M-28 20 Q0 50 28 20" : "M-28 40 Q0 14 28 40"} stroke="#1e1b4b" strokeWidth="6" fill="none" strokeLinecap="round" />
          </g>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Comparação e metáfora
// ---------------------------------------------------------------------------

function ComparisonArt() {
  return (
    <Art viewBox="0 0 560 220" label="À esquerda, uma menina forte levantando peso ao lado de um leão: “forte como um leão”, a comparação; à direita, um rosto com olhos brilhando como estrelas: “seus olhos são duas estrelas”, a metáfora">
      <rect width="560" height="220" rx="14" fill="#fff7ed" />
      <line x1="280" y1="16" x2="280" y2="204" stroke="#fed7aa" strokeWidth="2" strokeDasharray="6 5" />
      {/* a comparação: menina e leão */}
      <g transform="translate(90 150)">
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0;0 -10;0 0" dur="1.6s" repeatCount="indefinite" />
          <path d="M-36 -78 L36 -78" stroke="#475569" strokeWidth="5" />
          <circle cx="-38" cy="-78" r="10" fill="#1e293b" />
          <circle cx="38" cy="-78" r="10" fill="#1e293b" />
        </g>
        <rect x="-12" y="-44" width="24" height="34" rx="8" fill="#ea580c" />
        <circle cy="-54" r="12" fill="#c68642" />
        <path d="M-10 -40 L-20 -70 M10 -40 L20 -70" stroke="#c68642" strokeWidth="5" strokeLinecap="round" />
        <path d="M-6 -10 L-7 14 M6 -10 L7 14" stroke="#1e293b" strokeWidth="5" />
      </g>
      <g transform="translate(200 150)">
        <circle r="26" fill="#d97706" />
        <circle r="17" fill="#fbbf24" />
        <circle cx="-6" cy="-4" r="2.5" fill="#1e293b" />
        <circle cx="6" cy="-4" r="2.5" fill="#1e293b" />
        <path d="M-5 6 Q0 10 5 6" stroke="#1e293b" strokeWidth="2" fill="none" />
        <ellipse cx="0" cy="36" rx="26" ry="14" fill="#fbbf24" />
      </g>
      <text x="140" y="34" textAnchor="middle" fontSize="15" fontWeight="900" fill="#9a3412" fontFamily="Georgia, serif">
        forte COMO um leão
      </text>
      <text x="140" y="206" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#c2410c" fontFamily="Georgia, serif">
        comparação (tem o “como”)
      </text>
      {/* a metáfora: olhos de estrela */}
      <g transform="translate(420 120)">
        <circle r="54" fill="#f1c9a5" />
        <path d="M-54 -10 Q-50 -66 0 -64 Q50 -66 54 -10 Q40 -40 0 -42 Q-40 -40 -54 -10 Z" fill="#3f2a14" />
        {[-20, 20].map((x) => (
          <g key={x} transform={`translate(${x} -2)`}>
            <g className="cg-anim-twinkle">
              <path d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
            </g>
          </g>
        ))}
        <path d="M-16 26 Q0 38 16 26" stroke="#9a3412" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      <text x="420" y="34" textAnchor="middle" fontSize="15" fontWeight="900" fill="#9a3412" fontFamily="Georgia, serif">
        seus olhos SÃO duas estrelas
      </text>
      <text x="420" y="206" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#c2410c" fontFamily="Georgia, serif">
        metáfora (sem o “como”)
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O vento cantando e as onomatopeias
// ---------------------------------------------------------------------------

function SoundsArt() {
  return (
    <Art viewBox="0 0 560 210" label="Uma janela com o vento soprando as cortinas e notas musicais saindo, “o vento cantava”; um relógio fazendo tic-tac e um cachorro latindo au-au">
      <rect width="560" height="210" rx="14" fill="#eef2ff" />
      {/* a janela e o vento cantando */}
      <rect x="30" y="40" width="140" height="130" fill="#bae6fd" stroke="#78350f" strokeWidth="5" />
      <line x1="100" y1="40" x2="100" y2="170" stroke="#78350f" strokeWidth="4" />
      <path fill="#f9a8d4">
        <animate attributeName="d" values="M34 44 Q60 100 40 166 L34 166 Z;M34 44 Q80 100 56 166 L34 166 Z;M34 44 Q60 100 40 166 L34 166 Z" dur="2s" repeatCount="indefinite" />
      </path>
      {["♪", "♫", "♪"].map((n, i) => (
        <text key={i} x="190" fontSize="22" fill="#4f46e5" fontWeight="900">
          <animate attributeName="y" values="140;60" dur="2.4s" begin={`${-i * 0.8}s`} repeatCount="indefinite" />
          <animate attributeName="x" values="150;230" dur="2.4s" begin={`${-i * 0.8}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0" dur="2.4s" begin={`${-i * 0.8}s`} repeatCount="indefinite" />
          {n}
        </text>
      ))}
      <text x="100" y="196" textAnchor="middle" fontSize="12" fontWeight="900" fill="#3730a3" fontFamily="Georgia, serif">
        “o vento cantava”
      </text>
      {/* o relógio */}
      <g transform="translate(330 100)">
        <circle r="44" fill="#fff" stroke="#475569" strokeWidth="4" />
        <line x1="0" y1="0" x2="0" y2="-34" stroke="#dc2626" strokeWidth="2">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="6s" repeatCount="indefinite" />
        </line>
        <line x1="0" y1="0" x2="20" y2="0" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
        <circle r="4" fill="#1e293b" />
      </g>
      <Balloon x={380} y={20} w={80} h={34} text="tic-tac" size={13} />
      {/* o cachorro */}
      <g transform="translate(480 160)">
        <ellipse rx="30" ry="18" fill="#d6a77a" />
        <circle cx="28" cy="-18" r="16" fill="#d6a77a" />
        <ellipse cx="22" cy="-30" rx="6" ry="10" fill="#92400e" />
        <circle cx="34" cy="-20" r="2.5" fill="#1e293b" />
        <path d="M-20 16 L-20 30 M20 16 L20 30" stroke="#d6a77a" strokeWidth="6" />
      </g>
      <g className="cg-anim-pop">
        <Balloon x={440} y={70} w={80} h={34} text="au-au!" size={13} />
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O jogo das figuras
// ---------------------------------------------------------------------------

const FIGURE_GAME = [
  { prompt: "“Já te falei um milhão de vezes!”", options: ["Hipérbole", "Ironia", "Metonímia"], answer: 0, explain: "Um exagero de propósito, para dar ênfase." },
  { prompt: "“Que belo dia para um piquenique!”, disse ele, olhando a tempestade.", options: ["Eufemismo", "Ironia", "Comparação"], answer: 1, explain: "Diz o contrário do que quer dizer; o contexto (a tempestade) mostra a intenção." },
  { prompt: "“Ele partiu desta para melhor.” (no lugar de “ele morreu”)", options: ["Eufemismo", "Pleonasmo", "Hipérbole"], answer: 0, explain: "Suaviza uma ideia triste." },
  { prompt: "“Li Machado de Assis nas férias.”", options: ["Metáfora", "Metonímia", "Personificação"], answer: 1, explain: "Troca a obra pelo autor: leu os livros de Machado." },
  { prompt: "“Subir para cima” e “entrar para dentro”", options: ["Pleonasmo", "Antítese", "Onomatopeia"], answer: 0, explain: "Repete uma ideia já dita (redundância)." },
  { prompt: "“É dor que desatina sem doer.” (Camões)", options: ["Paradoxo", "Comparação", "Eufemismo"], answer: 0, explain: "Junta ideias opostas de um jeito que parece impossível." },
];

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 8, content, bare });

export const chapter8: BookPage[] = [
  page(
    <ChapterOpener
      n={8}
      title="Figuras de Linguagem"
      goals={["A diferença entre comparação e metáfora", "A hipérbole, a personificação e a onomatopeia", "A ironia, o eufemismo, a metonímia e outras", "Como reconhecer as figuras nos textos"]}
    >
      <Fig h={34}>
        <MasksOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🦁">Comparação e metáfora</H>
      <P>
        As <T>figuras de linguagem</T> deixam o texto mais expressivo. Na <T>comparação</T>, dois termos são ligados por um conectivo (“como”, “feito”, “tal qual”). Na{" "}
        <T>metáfora</T>, a comparação é direta, sem conectivo.
      </P>
      <Fig n="8.1" caption="A comparação usa “como”; a metáfora não." h={22}>
        <ComparisonArt />
      </Fig>
    </>,
  ),

  page(
    <>
      <H icon="🎵">Exagero, gente e sons</H>
      <P>
        A <T>hipérbole</T> é um exagero proposital: “morri de rir”. A <T>personificação</T> (ou prosopopeia) dá características humanas a coisas e animais. E a{" "}
        <T>onomatopeia</T> imita sons, muito usada nas histórias em quadrinhos.
      </P>
      <Fig n="8.2" caption="O vento que canta e os sons do relógio e do cachorro." h={21}>
        <SoundsArt />
      </Fig>
    </>,
  ),

  page(
    <>
      <H icon="🎭">Mais figuras</H>
      <Table
        head={["Figura", "O que faz", "Exemplo"]}
        rows={[
          ["Ironia", "Diz o contrário do que pensa", "“Que ótimo, choveu no passeio!”"],
          ["Eufemismo", "Suaviza uma ideia triste", "“Ele partiu desta para melhor.”"],
          ["Antítese", "Opõe ideias", "“Riso e choro.”"],
          ["Paradoxo", "Junta opostos que parecem impossíveis", "“Dor que desatina sem doer.”"],
          ["Pleonasmo", "Repete uma ideia", "“Subir para cima.”"],
          ["Metonímia", "Troca uma palavra por outra relacionada", "“Li Machado de Assis.”"],
        ]}
      />
      <Box kind="sabia">
        A metonímia está em toda parte: “tomei um copo d'água” (o copo pelo conteúdo) e “a cidade inteira foi à festa” (a cidade pelas pessoas).
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🔎">Descubra a figura</H>
      <P>Agora é com você. Que figura de linguagem aparece em cada frase?</P>
      <ChoiceGame items={FIGURE_GAME} color="#ea580c" title="O jogo das figuras" />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Comparação usa conectivo (como); metáfora compara direto.",
          "Hipérbole exagera; personificação dá ações humanas a coisas; onomatopeia imita sons.",
          "Ironia diz o contrário; eufemismo suaviza; pleonasmo repete.",
          "Antítese opõe ideias; paradoxo junta opostos que parecem impossíveis.",
          "Metonímia troca uma palavra por outra relacionada (o autor pela obra).",
        ]}
      />
      <Glossary
        items={[
          ["Metáfora", "Comparação direta, sem conectivo."],
          ["Hipérbole", "Exagero proposital."],
          ["Personificação", "Dar características humanas a seres não humanos."],
          ["Onomatopeia", "Palavra que imita um som."],
          ["Metonímia", "Troca de uma palavra por outra relacionada."],
        ]}
      />
      <Quiz
        items={[
          ["Que figura aparece em “Seus olhos são duas estrelas”?", "Metáfora."],
          ["E em “Ela é forte como um leão”?", "Comparação."],
          ["“Tic-tac” e “au-au” são exemplos de quê?", "Onomatopeia."],
          ["“O vento cantava na janela” é que figura?", "Personificação (prosopopeia)."],
        ]}
      />
    </>,
  ),
];
