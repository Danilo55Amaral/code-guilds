import { BackPage, EndPage, LetterPage, TimelinePage, TitlePage, TocPage } from "../FrontMatter";
import type { BookContent, BookPage } from "../types";
import { MATEMATICA_INFO } from "./meta";
import { chapter1 } from "./cap01-operacoes";
import { chapter2 } from "./cap02-fracoes";
import { chapter3 } from "./cap03-porcentagem";
import { chapter4 } from "./cap04-proporcao";
import { chapter5 } from "./cap05-equacoes";
import { chapter6 } from "./cap06-funcoes";
import { chapter7 } from "./cap07-geometria";
import { chapter8 } from "./cap08-pitagoras";
import { chapter9 } from "./cap09-probabilidade";
import { chapter10 } from "./cap10-estatistica";

// ============================================================================
// O LIVRO DE MATEMÁTICA — a folha de rosto, a carta do Mago Danilo, o sumário,
// os 10 capítulos (os assuntos das missões do tomo de Matemática), a linha do
// tempo da matemática, os parabéns e a contracapa. Cada capítulo tem um número
// par de páginas, pra abertura cair sempre na página da esquerda.
// ============================================================================

const TIMELINE = [
  ["c. 1800 a.C.", "Os babilônios usam frações e dividem o círculo em 360 graus."],
  ["c. 530 a.C.", "Os pitagóricos estudam o triângulo retângulo e os números."],
  ["c. 300 a.C.", "Euclides escreve “Os Elementos”, o grande livro da geometria."],
  ["c. 250 a.C.", "Arquimedes calcula o π com muita precisão."],
  ["c. 240 a.C.", "Eratóstenes cria o crivo dos números primos."],
  ["c. 628", "O indiano Brahmagupta escreve regras para o zero e os negativos."],
  ["c. 820", "O persa Al-Khwarizmi escreve o livro que deu nome à álgebra."],
  ["1150", "Bhaskara, na Índia, trabalha com as equações do 2º grau."],
  ["1654", "Pascal e Fermat criam as bases da probabilidade."],
  ["1785", "O menino Gauss soma de 1 a 100 em segundos."],
] as const;

const front: BookPage[] = [
  { bare: true, content: <TitlePage subject="matematica" title={MATEMATICA_INFO.title} subtitle={MATEMATICA_INFO.subtitle} /> },
  {
    content: (
      <LetterPage>
        <p className="mb-[0.5em]">
          Bem-vindo ao <strong>Livro dos Números</strong>! A matemática está no troco da cantina, no desconto da loja, no mapa do celular e até nos jogos. Neste livro você
          vai das quatro operações até a estatística, passando por frações, equações, geometria e probabilidade.
        </p>
        <p>
          Mexa nas figuras de tocar (tem a tabuada, a balança das equações, os quadrados de Pitágoras e um laboratório de dados!) e faça os testes rápidos. Depois, as
          missões do tomo de Matemática vão ficar bem mais fáceis. Bons cálculos!
        </p>
      </LetterPage>
    ),
  },
  { toc: true, content: <TocPage first from={0} to={5} /> },
  { content: <TocPage from={5} to={10} /> },
];

const end: BookPage[] = [
  { content: <TimelinePage subject="Matemática" items={TIMELINE} /> },
  { bare: true, content: <EndPage subject="matematica" name="Matemática" /> },
  { bare: true, content: <BackPage subject="matematica" /> },
];

const book: BookContent = {
  info: MATEMATICA_INFO,
  pages: [...front, ...chapter1, ...chapter2, ...chapter3, ...chapter4, ...chapter5, ...chapter6, ...chapter7, ...chapter8, ...chapter9, ...chapter10, ...end],
};

export default book;
