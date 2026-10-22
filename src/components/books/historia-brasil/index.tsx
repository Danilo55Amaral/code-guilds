import { BackPage, EndPage, LetterPage, TimelinePage, TitlePage, TocPage } from "../FrontMatter";
import type { BookContent, BookPage } from "../types";
import { HISTORIA_BRASIL_INFO } from "./meta";
import { chapter1 } from "./cap01-primeiros-povos";
import { chapter2 } from "./cap02-chegada";
import { chapter3 } from "./cap03-colonizacao";
import { chapter4 } from "./cap04-acucar";
import { chapter5 } from "./cap05-resistencia";
import { chapter6 } from "./cap06-ouro";
import { chapter7 } from "./cap07-independencia";
import { chapter8 } from "./cap08-segundo-reinado";
import { chapter9 } from "./cap09-republica-vargas";
import { chapter10 } from "./cap10-redemocratizacao";

// ============================================================================
// O LIVRO DE HISTÓRIA DO BRASIL — a folha de rosto, a carta do Mago Danilo,
// o sumário, os 10 capítulos (os assuntos das missões do tomo de História do
// Brasil, dos povos indígenas à Nova República), a linha do tempo do Brasil,
// os parabéns e a contracapa. Cada capítulo tem um número par de páginas, pra
// abertura cair sempre na página da esquerda.
// ============================================================================

const TIMELINE = [
  ["1500", "A esquadra de Cabral chega ao litoral da Bahia."],
  ["1549", "Tomé de Sousa funda Salvador, a primeira capital."],
  ["1695", "Zumbi dos Palmares é morto em 20 de novembro."],
  ["1792", "Tiradentes é enforcado, depois da Inconfidência Mineira."],
  ["1808", "A família real portuguesa chega ao Brasil."],
  ["1822", "Dom Pedro proclama a Independência, em 7 de setembro."],
  ["1888", "A Lei Áurea abole a escravidão, em 13 de maio."],
  ["1889", "É proclamada a República, em 15 de novembro."],
  ["1932", "As mulheres conquistam o direito de votar."],
  ["1960", "Brasília é inaugurada como a nova capital."],
  ["1964", "Um golpe militar começa uma ditadura de 21 anos."],
  ["1988", "É promulgada a Constituição Cidadã."],
] as const;

const front: BookPage[] = [
  { bare: true, content: <TitlePage subject="historia-brasil" title={HISTORIA_BRASIL_INFO.title} subtitle={HISTORIA_BRASIL_INFO.subtitle} /> },
  {
    content: (
      <LetterPage>
        <p className="mb-[0.5em]">
          Bem-vindo ao <strong>Livro da Nossa Terra</strong>! Aqui você vai conhecer a história do Brasil: os povos que já viviam aqui, a chegada dos portugueses, a
          escravidão e a resistência, o Império, a República e a luta pela democracia.
        </p>
        <p>
          Mexa nas figuras de tocar (tem as palavras tupi, o mapa das capitanias, o engenho, o quinto do ouro, os poderes de 1824, as revoltas e a história do voto!) e
          faça os testes rápidos. Depois, as missões do tomo de História do Brasil vão ficar bem mais fáceis. Boa viagem pela nossa história!
        </p>
      </LetterPage>
    ),
  },
  { toc: true, content: <TocPage first from={0} to={5} /> },
  { content: <TocPage from={5} to={10} /> },
];

const end: BookPage[] = [
  { content: <TimelinePage subject="História do Brasil" items={TIMELINE} /> },
  { bare: true, content: <EndPage subject="historia-brasil" name="História do Brasil" /> },
  { bare: true, content: <BackPage subject="historia-brasil" /> },
];

const book: BookContent = {
  info: HISTORIA_BRASIL_INFO,
  pages: [...front, ...chapter1, ...chapter2, ...chapter3, ...chapter4, ...chapter5, ...chapter6, ...chapter7, ...chapter8, ...chapter9, ...chapter10, ...end],
};

export default book;
