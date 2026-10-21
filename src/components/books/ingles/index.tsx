import { BackPage, EndPage, LetterPage, TimelinePage, TitlePage, TocPage } from "../FrontMatter";
import type { BookContent, BookPage } from "../types";
import { INGLES_INFO } from "./meta";
import { chapter1 } from "./cap01-greetings";
import { chapter2 } from "./cap02-to-be";
import { chapter3 } from "./cap03-family";
import { chapter4 } from "./cap04-food";
import { chapter5 } from "./cap05-present";
import { chapter6 } from "./cap06-continuous";
import { chapter7 } from "./cap07-past";
import { chapter8 } from "./cap08-future";
import { chapter9 } from "./cap09-perfect";
import { chapter10 } from "./cap10-conditionals";

// ============================================================================
// O LIVRO DE INGLÊS — a folha de rosto, a carta do Mago Danilo, o sumário, os
// 10 capítulos (as missões do tomo de Inglês), a linha do tempo da língua
// inglesa, os parabéns e a contracapa. Cada capítulo tem um número par de
// páginas, pra abertura cair sempre na página da esquerda.
// ============================================================================

const TIMELINE = [
  ["c. 450", "Povos germânicos chegam à Grã-Bretanha e nasce o inglês antigo."],
  ["c. 1000", "É escrito “Beowulf”, um dos primeiros grandes poemas em inglês."],
  ["1066", "Os normandos conquistam a Inglaterra e o inglês ganha milhares de palavras francesas."],
  ["c. 1400", "Chaucer escreve “Os Contos da Cantuária”, em inglês médio."],
  ["1476", "A primeira impressora da Inglaterra espalha os livros em inglês."],
  ["c. 1600", "Shakespeare escreve suas peças e inventa centenas de palavras."],
  ["1755", "Samuel Johnson publica um dos primeiros grandes dicionários de inglês."],
  ["1828", "Noah Webster lança o dicionário do inglês americano (color, e não colour)."],
  ["1990", "Nasce a World Wide Web, e o inglês vira a língua da internet."],
  ["Hoje", "Mais de 1,5 bilhão de pessoas falam inglês no mundo."],
] as const;

const front: BookPage[] = [
  { bare: true, content: <TitlePage subject="ingles" title={INGLES_INFO.title} subtitle={INGLES_INFO.subtitle} /> },
  {
    content: (
      <LetterPage>
        <p className="mb-[0.5em]">
          Welcome! Bem-vindo ao <strong>Let&apos;s Talk!</strong> O inglês está nos jogos, nas músicas, nos filmes e na internet, e aprender a língua abre portas no mundo
          inteiro. Neste livro você vai do primeiro Hello até o present perfect.
        </p>
        <p>
          Toque no 🔊 pra ouvir a pronúncia (a voz é a do seu aparelho), vire as cartas de palavras e jogue os joguinhos. Depois, as missões do tomo de Inglês vão ficar
          bem mais fáceis. Let&apos;s go!
        </p>
      </LetterPage>
    ),
  },
  { toc: true, content: <TocPage first from={0} to={5} /> },
  { content: <TocPage from={5} to={10} /> },
];

const end: BookPage[] = [
  { content: <TimelinePage subject="Língua Inglesa" items={TIMELINE} /> },
  { bare: true, content: <EndPage subject="ingles" name="Inglês" /> },
  { bare: true, content: <BackPage subject="ingles" /> },
];

const book: BookContent = {
  info: INGLES_INFO,
  pages: [...front, ...chapter1, ...chapter2, ...chapter3, ...chapter4, ...chapter5, ...chapter6, ...chapter7, ...chapter8, ...chapter9, ...chapter10, ...end],
};

export default book;
