import { BackPage, EndPage, LetterPage, TimelinePage, TitlePage, TocPage } from "../FrontMatter";
import type { BookContent, BookPage } from "../types";
import { SCRATCH_INFO } from "./meta";
import { chapter1 } from "./cap01-conhecendo";
import { chapter2 } from "./cap02-atores";
import { chapter3 } from "./cap03-movimento";
import { chapter4 } from "./cap04-eventos";
import { chapter5 } from "./cap05-controle";
import { chapter6 } from "./cap06-sensores";
import { chapter7 } from "./cap07-variaveis";
import { chapter8 } from "./cap08-aparencia";
import { chapter9 } from "./cap09-caneta";
import { chapter10 } from "./cap10-jogo";

// ============================================================================
// O LIVRO DE SCRATCH — a folha de rosto, a carta do Mago Danilo, o sumário, os
// 10 capítulos (as missões de Scratch, organizadas pelas categorias de blocos),
// a linha do tempo da programação visual, os parabéns e a contracapa. Cada
// capítulo tem um número par de páginas, pra abertura cair sempre na página da
// esquerda.
// ============================================================================

const TIMELINE = [
  ["c. 1843", "Ada Lovelace escreve o primeiro algoritmo, para a Máquina Analítica."],
  ["1967", "Nasce a linguagem Logo, com a tartaruga que desenha (a avó da Caneta)."],
  ["1980", "Seymour Papert lança o livro “Mindstorms”, sobre crianças programando."],
  ["2003", "O MIT Media Lab começa a criar o Scratch."],
  ["2007", "O Scratch é lançado, de graça, para todo mundo."],
  ["2013", "Sai o Scratch 2.0, que roda direto no navegador."],
  ["2019", "Chega o Scratch 3.0, com os arquivos .sb3 e as extensões."],
  ["Hoje", "Milhões de projetos compartilhados, em mais de 70 idiomas."],
] as const;

const front: BookPage[] = [
  { bare: true, content: <TitlePage subject="scratch" title={SCRATCH_INFO.title} subtitle={SCRATCH_INFO.subtitle} /> },
  {
    content: (
      <LetterPage>
        <p className="mb-[0.5em]">
          Bem-vindo ao <strong>Livro dos Blocos</strong>! Com o Scratch você cria jogos, animações e histórias encaixando blocos coloridos, sem precisar digitar
          código. É o primeiro passo de muitos programadores de verdade.
        </p>
        <p>
          Mexa nas figuras de tocar (tem a bandeira verde, o palco das coordenadas, o desenhista de polígonos e um jogo de pegar maçãs pra jogar!) e faça os testes
          rápidos. Depois, abra o Scratch e as missões vão ficar bem mais fáceis. Bora programar!
        </p>
      </LetterPage>
    ),
  },
  { toc: true, content: <TocPage first from={0} to={5} /> },
  { content: <TocPage from={5} to={10} /> },
];

const end: BookPage[] = [
  { content: <TimelinePage subject="Programação Visual" items={TIMELINE} /> },
  { bare: true, content: <EndPage subject="scratch" name="Scratch" /> },
  { bare: true, content: <BackPage subject="scratch" /> },
];

const book: BookContent = {
  info: SCRATCH_INFO,
  pages: [...front, ...chapter1, ...chapter2, ...chapter3, ...chapter4, ...chapter5, ...chapter6, ...chapter7, ...chapter8, ...chapter9, ...chapter10, ...end],
};

export default book;
