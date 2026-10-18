import { BackPage, EndPage, LetterPage, TitlePage, TocPage } from "../FrontMatter";
import type { BookContent, BookPage } from "../types";
import { BIOLOGIA_INFO } from "./meta";
import { chapter1 } from "./cap01-celulas";
import { chapter2 } from "./cap02-plantas";
import { chapter3 } from "./cap03-animais";
import { chapter4 } from "./cap04-microbios";
import { chapter5 } from "./cap05-corpo";
import { chapter6 } from "./cap06-hormonios";
import { chapter7 } from "./cap07-ecologia";
import { chapter8 } from "./cap08-genetica";
import { chapter9 } from "./cap09-divisao";
import { chapter10, TimelinePage } from "./cap10-evolucao";

// ============================================================================
// O LIVRO DE BIOLOGIA — a folha de rosto, a carta do Mago Danilo, o sumário,
// os 10 capítulos (os assuntos das missões do tomo de Biologia) e o fim.
// Cada capítulo tem um número par de páginas, pra abertura cair sempre na
// página da esquerda quando o livro está aberto em duas páginas. No fim, a
// linha do tempo da Biologia, os parabéns do Mago e a contracapa.
// ============================================================================

const front: BookPage[] = [
  { bare: true, content: <TitlePage subject="biologia" title={BIOLOGIA_INFO.title} subtitle={BIOLOGIA_INFO.subtitle} /> },
  {
    content: (
      <LetterPage>
        <p className="mb-[0.5em]">
          Seja bem-vindo à Biblioteca da Academia! Este é o <strong>Livro da Vida</strong>, onde guardei tudo o que um bom estudante de Biologia precisa saber: das células,
          tão pequenas que só o microscópio enxerga, até os grandes ecossistemas do planeta.
        </p>
        <p>
          Leia com calma, observe os desenhos (muitos deles se mexem!) e responda aos testes rápidos no fim de cada capítulo. Quando terminar, as missões do tomo de Biologia
          vão ficar bem mais fáceis. Boa leitura!
        </p>
      </LetterPage>
    ),
  },
  { toc: true, content: <TocPage first from={0} to={5} /> },
  { content: <TocPage from={5} to={10} /> },
];

const end: BookPage[] = [
  { content: <TimelinePage /> },
  { bare: true, content: <EndPage subject="biologia" name="Biologia" /> },
  { bare: true, content: <BackPage subject="biologia" /> },
];

const book: BookContent = {
  info: BIOLOGIA_INFO,
  pages: [...front, ...chapter1, ...chapter2, ...chapter3, ...chapter4, ...chapter5, ...chapter6, ...chapter7, ...chapter8, ...chapter9, ...chapter10, ...end],
};

export default book;
