import { BackPage, EndPage, LetterPage, TimelinePage, TitlePage, TocPage } from "../FrontMatter";
import type { BookContent, BookPage } from "../types";
import { ASTRONOMIA_INFO } from "./meta";
import { chapter1 } from "./cap01-ceu";
import { chapter2 } from "./cap02-lua";
import { chapter3 } from "./cap03-planetas";
import { chapter4 } from "./cap04-luas";
import { chapter5 } from "./cap05-orbitas";
import { chapter6 } from "./cap06-estrelas";
import { chapter7 } from "./cap07-telescopios";
import { chapter8 } from "./cap08-exoplanetas";
import { chapter9 } from "./cap09-corrida";
import { chapter10 } from "./cap10-vida";

// ============================================================================
// O LIVRO DE ASTRONOMIA — a folha de rosto, a carta do Mago Danilo, o
// sumário, os 10 capítulos (os assuntos das missões do tomo de Astronomia), a
// linha do tempo da Astronomia, os parabéns e a contracapa. Cada capítulo tem
// um número par de páginas, pra abertura cair sempre na página da esquerda.
// ============================================================================

const TIMELINE = [
  ["c. 150", "Ptolomeu descreve um universo com a Terra no centro."],
  ["1543", "Copérnico coloca o Sol no centro do Sistema Solar."],
  ["1609", "Kepler mostra que as órbitas dos planetas são elipses."],
  ["1610", "Galileu vê as quatro maiores luas de Júpiter com a luneta."],
  ["1687", "Newton explica as órbitas com a gravitação universal."],
  ["1924", "Hubble mostra que existem outras galáxias além da Via Láctea."],
  ["1957", "O Sputnik 1 se torna o primeiro satélite artificial."],
  ["1969", "A Apollo 11 leva os primeiros seres humanos à Lua."],
  ["1995", "É achado o primeiro exoplaneta em volta de uma estrela como o Sol."],
  ["2006", "Marcos Pontes vai ao espaço, e Plutão passa a ser planeta-anão."],
  ["2019", "Os cientistas mostram a primeira foto de um buraco negro."],
] as const;

const front: BookPage[] = [
  { bare: true, content: <TitlePage subject="astronomia" title={ASTRONOMIA_INFO.title} subtitle={ASTRONOMIA_INFO.subtitle} /> },
  {
    content: (
      <LetterPage>
        <p className="mb-[0.5em]">
          Bem-vindo ao <strong>Livro do Céu</strong>! Desde sempre, as pessoas olham para o alto e se perguntam o que são as estrelas, por que a Lua muda de forma e se existe
          alguém lá fora. A Astronomia é a ciência que vai atrás dessas respostas.
        </p>
        <p>
          Mexa nas figuras de tocar (tem fases da Lua, planetas para explorar, estações do ano, constelações e até uma conta para estimar vizinhos na galáxia!) e faça os
          testes rápidos. Depois, as missões do tomo de Astronomia vão ficar bem mais fáceis. Boa viagem pelo universo!
        </p>
      </LetterPage>
    ),
  },
  { toc: true, content: <TocPage first from={0} to={5} /> },
  { content: <TocPage from={5} to={10} /> },
];

const end: BookPage[] = [
  { content: <TimelinePage subject="Astronomia" items={TIMELINE} /> },
  { bare: true, content: <EndPage subject="astronomia" name="Astronomia" /> },
  { bare: true, content: <BackPage subject="astronomia" /> },
];

const book: BookContent = {
  info: ASTRONOMIA_INFO,
  pages: [...front, ...chapter1, ...chapter2, ...chapter3, ...chapter4, ...chapter5, ...chapter6, ...chapter7, ...chapter8, ...chapter9, ...chapter10, ...end],
};

export default book;
