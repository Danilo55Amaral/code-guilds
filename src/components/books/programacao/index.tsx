import { BackPage, EndPage, LetterPage, TimelinePage, TitlePage, TocPage } from "../FrontMatter";
import type { BookContent, BookPage } from "../types";
import { PROGRAMACAO_INFO } from "./meta";
import { chapter1 } from "./cap01-mundo";
import { chapter2 } from "./cap02-linguagens";
import { chapter3 } from "./cap03-html";
import { chapter4 } from "./cap04-css";
import { chapter5 } from "./cap05-js-basico";
import { chapter6 } from "./cap06-js-pagina";
import { chapter7 } from "./cap07-python";
import { chapter8 } from "./cap08-python-avancado";
import { chapter9 } from "./cap09-lua";
import { chapter10 } from "./cap10-java";

// ============================================================================
// O LIVRO DE LINGUAGEM DE PROGRAMAÇÃO — a folha de rosto, a carta do Mago
// Danilo, o sumário, os 10 capítulos (os assuntos das missões de
// programação: algoritmos, HTML, CSS, JavaScript, Python, Lua e Java), a
// linha do tempo das linguagens, os parabéns e a contracapa. Cada capítulo
// tem um número par de páginas, pra abertura cair sempre na página da
// esquerda.
// ============================================================================

const TIMELINE = [
  ["1843", "Ada Lovelace escreve o primeiro algoritmo para uma máquina."],
  ["1957", "Nasce o Fortran, uma das primeiras linguagens de programação."],
  ["1972", "É criada a linguagem C, base de muitas outras."],
  ["1991", "Nascem o Python, de Guido van Rossum, e o HTML da Web."],
  ["1993", "Brasileiros criam a linguagem Lua, na PUC-Rio."],
  ["1995", "Chegam o Java e o JavaScript (este feito em apenas 10 dias)."],
  ["1996", "O CSS dá estilo às páginas da internet."],
  ["2006", "O Roblox é lançado; hoje seus jogos são programados em Luau."],
  ["2007", "O Scratch ensina programação com blocos de encaixar."],
  ["2022", "A inteligência artificial passa a ajudar a escrever código."],
] as const;

const front: BookPage[] = [
  { bare: true, content: <TitlePage subject="programacao" title={PROGRAMACAO_INFO.title} subtitle={PROGRAMACAO_INFO.subtitle} /> },
  {
    content: (
      <LetterPage>
        <p className="mb-[0.5em]">
          Bem-vindo ao <strong>Livro do Código</strong>! Programar é ensinar o computador a fazer o que você imagina: sites, jogos, apps e robôs. Aqui você vai dos
          algoritmos ao HTML e ao CSS, e depois conhecer o JavaScript, o Python, a brasileiríssima Lua e o Java.
        </p>
        <p>
          Os códigos deste livro são de verdade: aperte ▶ Executar para ver a saída, mexa nos controles e veja as linhas acendendo (tem o robô programável, o montador de
          página, o estilizador de botão, o if da nota, o range, as fatias e a fábrica de objetos!). Depois, as missões de programação vão ficar bem mais fáceis. Bom código!
        </p>
      </LetterPage>
    ),
  },
  { toc: true, content: <TocPage first from={0} to={5} /> },
  { content: <TocPage from={5} to={10} /> },
];

const end: BookPage[] = [
  { content: <TimelinePage subject="Programação" items={TIMELINE} /> },
  { bare: true, content: <EndPage subject="programacao" name="Linguagem de Programação" /> },
  { bare: true, content: <BackPage subject="programacao" /> },
];

const book: BookContent = {
  info: PROGRAMACAO_INFO,
  pages: [...front, ...chapter1, ...chapter2, ...chapter3, ...chapter4, ...chapter5, ...chapter6, ...chapter7, ...chapter8, ...chapter9, ...chapter10, ...end],
};

export default book;
