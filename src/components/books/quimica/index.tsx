import { BackPage, EndPage, LetterPage, TimelinePage, TitlePage, TocPage } from "../FrontMatter";
import type { BookContent, BookPage } from "../types";
import { QUIMICA_INFO } from "./meta";
import { chapter1 } from "./cap01-materia";
import { chapter2 } from "./cap02-atomos";
import { chapter3 } from "./cap03-misturas";
import { chapter4 } from "./cap04-solucoes";
import { chapter5 } from "./cap05-reacoes";
import { chapter6 } from "./cap06-mol";
import { chapter7 } from "./cap07-ph";
import { chapter8 } from "./cap08-cotidiano";
import { chapter9 } from "./cap09-eletroquimica";
import { chapter10 } from "./cap10-organica";

// ============================================================================
// O LIVRO DE QUÍMICA — a folha de rosto, a carta do Mago Danilo, o sumário,
// os 10 capítulos (os assuntos das missões do tomo de Química), a linha do
// tempo da Química, os parabéns e a contracapa. Cada capítulo tem um número
// par de páginas, pra abertura cair sempre na página da esquerda.
// ============================================================================

const TIMELINE = [
  ["400 a.C.", "Demócrito imagina que a matéria é feita de átomos indivisíveis."],
  ["1789", "Lavoisier mostra que a massa se conserva nas reações."],
  ["1808", "Dalton apresenta o átomo como uma bolinha maciça."],
  ["1869", "Mendeleev organiza a Tabela Periódica."],
  ["1897", "Thomson descobre o elétron."],
  ["1898", "Marie e Pierre Curie descobrem o polônio e o rádio."],
  ["1907", "Leo Baekeland cria a baquelite, o primeiro plástico sintético."],
  ["1911", "Rutherford descobre o núcleo do átomo."],
  ["1913", "Bohr propõe as camadas de energia dos elétrons."],
  ["1987", "O acidente com o césio-137 em Goiânia."],
  ["2016", "Os elementos 113, 115, 117 e 118 ganham nome e completam a 7ª linha da Tabela."],
] as const;

const front: BookPage[] = [
  { bare: true, content: <TitlePage subject="quimica" title={QUIMICA_INFO.title} subtitle={QUIMICA_INFO.subtitle} /> },
  {
    content: (
      <LetterPage>
        <p className="mb-[0.5em]">
          Bem-vindo ao <strong>Livro da Matéria</strong>! A Química está em tudo: no pão que cresce, na água que sai da torneira, nas cores dos fogos de artifício e até no ar
          que você respira. Neste livro você vai entrar no mundo dos átomos, montar moléculas e descobrir por que as coisas se transformam.
        </p>
        <p>
          Mexa nas figuras de tocar (tem Tabela Periódica, escala de pH e até um balanceador de equações!) e faça os testes rápidos. Depois, as missões do tomo de Química vão
          ficar bem mais fáceis. Bons experimentos!
        </p>
      </LetterPage>
    ),
  },
  { toc: true, content: <TocPage first from={0} to={5} /> },
  { content: <TocPage from={5} to={10} /> },
];

const end: BookPage[] = [
  { content: <TimelinePage subject="Química" items={TIMELINE} /> },
  { bare: true, content: <EndPage subject="quimica" name="Química" /> },
  { bare: true, content: <BackPage subject="quimica" /> },
];

const book: BookContent = {
  info: QUIMICA_INFO,
  pages: [...front, ...chapter1, ...chapter2, ...chapter3, ...chapter4, ...chapter5, ...chapter6, ...chapter7, ...chapter8, ...chapter9, ...chapter10, ...end],
};

export default book;
