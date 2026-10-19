import { BackPage, EndPage, LetterPage, TimelinePage, TitlePage, TocPage } from "../FrontMatter";
import type { BookContent, BookPage } from "../types";
import { PORTUGUES_INFO } from "./meta";
import { chapter1 } from "./cap01-classes";
import { chapter2 } from "./cap02-sentido";
import { chapter3 } from "./cap03-ortografia";
import { chapter4 } from "./cap04-pontuacao";
import { chapter5 } from "./cap05-oracao";
import { chapter6 } from "./cap06-coesao";
import { chapter7 } from "./cap07-generos";
import { chapter8 } from "./cap08-figuras";
import { chapter9 } from "./cap09-escolas";
import { chapter10 } from "./cap10-modernismo";

// ============================================================================
// O LIVRO DE LÍNGUA PORTUGUESA — a folha de rosto, a carta do Mago Danilo, o
// sumário, os 10 capítulos (os assuntos das missões do tomo de Língua
// Portuguesa), a linha do tempo da literatura brasileira, os parabéns e a
// contracapa. Cada capítulo tem um número par de páginas, pra abertura cair
// sempre na página da esquerda.
// ============================================================================

const TIMELINE = [
  ["1500", "Pero Vaz de Caminha escreve a carta sobre a nova terra ao rei de Portugal."],
  ["1843", "Gonçalves Dias escreve a Canção do Exílio."],
  ["1865", "José de Alencar publica “Iracema”."],
  ["1881", "Machado de Assis publica “Memórias Póstumas de Brás Cubas”."],
  ["1897", "Nasce a Academia Brasileira de Letras, com Machado como presidente."],
  ["1922", "A Semana de Arte Moderna agita São Paulo."],
  ["1928", "Mário de Andrade publica “Macunaíma”."],
  ["1938", "Graciliano Ramos publica “Vidas Secas”."],
  ["1956", "Guimarães Rosa publica “Grande Sertão: Veredas”."],
  ["1960", "Carolina Maria de Jesus publica “Quarto de Despejo”."],
  ["2009", "Entra em vigor no Brasil o Novo Acordo Ortográfico."],
] as const;

const front: BookPage[] = [
  { bare: true, content: <TitlePage subject="portugues" title={PORTUGUES_INFO.title} subtitle={PORTUGUES_INFO.subtitle} /> },
  {
    content: (
      <LetterPage>
        <p className="mb-[0.5em]">
          Bem-vindo ao <strong>Livro das Palavras</strong>! A língua portuguesa é a ferramenta que usamos para pensar, conversar, contar histórias e mudar o mundo. Neste
          livro você vai das classes de palavras até os grandes escritores do Brasil.
        </p>
        <p>
          Mexa nas figuras de tocar (tem palavras que mostram a classe, a vírgula que muda tudo, os jogos dos porquês e das figuras de linguagem!) e faça os testes
          rápidos. Depois, as missões do tomo de Língua Portuguesa vão ficar bem mais fáceis. Boa leitura!
        </p>
      </LetterPage>
    ),
  },
  { toc: true, content: <TocPage first from={0} to={5} /> },
  { content: <TocPage from={5} to={10} /> },
];

const end: BookPage[] = [
  { content: <TimelinePage subject="Literatura Brasileira" items={TIMELINE} /> },
  { bare: true, content: <EndPage subject="portugues" name="Língua Portuguesa" /> },
  { bare: true, content: <BackPage subject="portugues" /> },
];

const book: BookContent = {
  info: PORTUGUES_INFO,
  pages: [...front, ...chapter1, ...chapter2, ...chapter3, ...chapter4, ...chapter5, ...chapter6, ...chapter7, ...chapter8, ...chapter9, ...chapter10, ...end],
};

export default book;
