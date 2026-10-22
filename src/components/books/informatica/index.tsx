import { BackPage, EndPage, LetterPage, TimelinePage, TitlePage, TocPage } from "../FrontMatter";
import type { BookContent, BookPage } from "../types";
import { INFORMATICA_INFO } from "./meta";
import { chapter1 } from "./cap01-computador";
import { chapter2 } from "./cap02-sistema";
import { chapter3 } from "./cap03-arquivos";
import { chapter4 } from "./cap04-teclado";
import { chapter5 } from "./cap05-internet";
import { chapter6 } from "./cap06-seguranca";
import { chapter7 } from "./cap07-texto";
import { chapter8 } from "./cap08-office";
import { chapter9 } from "./cap09-nuvem";
import { chapter10 } from "./cap10-historia";

// ============================================================================
// O LIVRO DE INFORMÁTICA — a folha de rosto, a carta do Mago Danilo, o
// sumário, os 10 capítulos (os assuntos das missões de Informática, Pacote
// Office, Computação em Nuvem e A História da Computação), a linha do tempo
// da computação, os parabéns e a contracapa. Cada capítulo tem um número par
// de páginas, pra abertura cair sempre na página da esquerda.
// ============================================================================

const TIMELINE = [
  ["1642", "Blaise Pascal cria a Pascalina, uma calculadora de engrenagens."],
  ["1843", "Ada Lovelace escreve o primeiro algoritmo."],
  ["1946", "O ENIAC, um dos primeiros computadores eletrônicos, ocupa uma sala inteira."],
  ["1971", "Nasce o microprocessador: um processador num chip só."],
  ["1972", "O Patinho Feio, o primeiro computador brasileiro, é feito na USP."],
  ["1981", "O computador pessoal (PC) chega às casas."],
  ["1991", "Tim Berners-Lee cria a World Wide Web."],
  ["2006", "A computação em nuvem começa a se espalhar com os grandes data centers."],
  ["2007", "Os smartphones com tela de toque viram computadores de bolso."],
  ["2022", "A inteligência artificial generativa conversa, escreve e cria imagens."],
] as const;

const front: BookPage[] = [
  { bare: true, content: <TitlePage subject="informatica" title={INFORMATICA_INFO.title} subtitle={INFORMATICA_INFO.subtitle} /> },
  {
    content: (
      <LetterPage>
        <p className="mb-[0.5em]">
          Bem-vindo ao <strong>Livro do Computador</strong>! Você vai entender como o computador funciona por dentro, organizar seus arquivos, dominar os atalhos, navegar
          com segurança, usar o Word, o Excel e o PowerPoint e descobrir o que é a tal da nuvem.
        </p>
        <p>
          Mexa nas figuras de tocar (tem as lâmpadas dos bits, a área de trabalho de brinquedo, o laboratório de atalhos, o medidor de senha, a planilha que calcula
          sozinha e a sincronização da nuvem!) e faça os testes rápidos. Depois, as missões de Informática vão ficar bem mais fáceis. Bons cliques!
        </p>
      </LetterPage>
    ),
  },
  { toc: true, content: <TocPage first from={0} to={5} /> },
  { content: <TocPage from={5} to={10} /> },
];

const end: BookPage[] = [
  { content: <TimelinePage subject="Informática" items={TIMELINE} /> },
  { bare: true, content: <EndPage subject="informatica" name="Informática" /> },
  { bare: true, content: <BackPage subject="informatica" /> },
];

const book: BookContent = {
  info: INFORMATICA_INFO,
  pages: [...front, ...chapter1, ...chapter2, ...chapter3, ...chapter4, ...chapter5, ...chapter6, ...chapter7, ...chapter8, ...chapter9, ...chapter10, ...end],
};

export default book;
