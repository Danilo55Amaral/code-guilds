import { BackPage, EndPage, LetterPage, TimelinePage, TitlePage, TocPage } from "../FrontMatter";
import type { BookContent, BookPage } from "../types";
import { HISTORIA_INFO } from "./meta";
import { chapter1 } from "./cap01-pre-historia";
import { chapter2 } from "./cap02-egito";
import { chapter3 } from "./cap03-oriente";
import { chapter4 } from "./cap04-grecia";
import { chapter5 } from "./cap05-roma";
import { chapter6 } from "./cap06-idade-media";
import { chapter7 } from "./cap07-america-africa";
import { chapter8 } from "./cap08-renascimento";
import { chapter9 } from "./cap09-revolucoes";
import { chapter10 } from "./cap10-seculo-xx";

// ============================================================================
// O LIVRO DE HISTÓRIA GERAL — a folha de rosto, a carta do Mago Danilo, o
// sumário, os 10 capítulos (os assuntos das missões do tomo de História
// Geral, da Pré-História ao século XX), a linha do tempo da História, os
// parabéns e a contracapa. Cada capítulo tem um número par de páginas, pra
// abertura cair sempre na página da esquerda.
// ============================================================================

const TIMELINE = [
  ["3500 a.C.", "Surge a escrita cuneiforme na Mesopotâmia: termina a Pré-História."],
  ["2560 a.C.", "Os egípcios constroem a Grande Pirâmide de Gizé."],
  ["776 a.C.", "Acontecem os primeiros Jogos Olímpicos, na Grécia."],
  ["476", "Cai o Império Romano do Ocidente: começa a Idade Média."],
  ["1450", "Gutenberg cria a prensa de tipos móveis."],
  ["1492", "Colombo chega à América."],
  ["1500", "A frota de Cabral chega ao Brasil."],
  ["1789", "Começa a Revolução Francesa."],
  ["1888", "A Lei Áurea abole a escravidão no Brasil."],
  ["1945", "Termina a Segunda Guerra Mundial e nasce a ONU."],
  ["1989", "Cai o Muro de Berlim."],
] as const;

const front: BookPage[] = [
  { bare: true, content: <TitlePage subject="historia" title={HISTORIA_INFO.title} subtitle={HISTORIA_INFO.subtitle} /> },
  {
    content: (
      <LetterPage>
        <p className="mb-[0.5em]">
          Bem-vindo ao <strong>Livro do Tempo</strong>! A História conta como os seres humanos viveram, o que inventaram, como lutaram por seus direitos e como chegamos
          até aqui. Nesta viagem você vai das cavernas da Pré-História até o século XX.
        </p>
        <p>
          Mexa nas figuras de tocar (tem as idades da Pré-História, as cheias do Nilo, a votação de Atenas, os números romanos, o quipo inca e as linhas do tempo das
          revoluções!) e faça os testes rápidos. Depois, as missões do tomo de História Geral vão ficar bem mais fáceis. Boa viagem no tempo!
        </p>
      </LetterPage>
    ),
  },
  { toc: true, content: <TocPage first from={0} to={5} /> },
  { content: <TocPage from={5} to={10} /> },
];

const end: BookPage[] = [
  { content: <TimelinePage subject="História" items={TIMELINE} /> },
  { bare: true, content: <EndPage subject="historia" name="História Geral" /> },
  { bare: true, content: <BackPage subject="historia" /> },
];

const book: BookContent = {
  info: HISTORIA_INFO,
  pages: [...front, ...chapter1, ...chapter2, ...chapter3, ...chapter4, ...chapter5, ...chapter6, ...chapter7, ...chapter8, ...chapter9, ...chapter10, ...end],
};

export default book;
