import { BackPage, EndPage, LetterPage, TimelinePage, TitlePage, TocPage } from "../FrontMatter";
import type { BookContent, BookPage } from "../types";
import { GEOGRAFIA_INFO } from "./meta";
import { chapter1 } from "./cap01-mapas";
import { chapter2 } from "./cap02-coordenadas";
import { chapter3 } from "./cap03-relevo";
import { chapter4 } from "./cap04-clima";
import { chapter5 } from "./cap05-aguas-biomas";
import { chapter6 } from "./cap06-populacao";
import { chapter7 } from "./cap07-cidades";
import { chapter8 } from "./cap08-economia-energia";
import { chapter9 } from "./cap09-globalizacao";
import { chapter10 } from "./cap10-meio-ambiente";

// ============================================================================
// O LIVRO DE GEOGRAFIA — a folha de rosto, a carta do Mago Danilo, o sumário,
// os 10 capítulos (os assuntos das missões do tomo de Geografia, dos mapas ao
// meio ambiente), a linha do tempo da Geografia, os parabéns e a contracapa.
// Cada capítulo tem um número par de páginas, pra abertura cair sempre na
// página da esquerda.
// ============================================================================

const TIMELINE = [
  ["c. 240 a.C.", "Eratóstenes mede o tamanho da Terra usando sombras e Matemática."],
  ["c. 150", "Ptolomeu desenha mapas com latitude e longitude."],
  ["1569", "Mercator cria o mapa-múndi que os navegadores usavam."],
  ["1872", "Acontece o primeiro Censo do Brasil."],
  ["1884", "O Meridiano de Greenwich vira a longitude 0°, e nascem os fusos horários."],
  ["1945", "Nasce a ONU, que reúne os países do mundo."],
  ["1972", "Os astronautas da Apollo 17 fotografam a Terra inteira: a Blue Marble, a bolinha de gude azul."],
  ["1991", "Nasce o Mercosul."],
  ["1992", "A Rio-92 reúne o mundo no Rio de Janeiro pelo meio ambiente."],
  ["2015", "O Acordo de Paris é assinado para frear o aquecimento global."],
  ["2025", "A COP30, conferência do clima da ONU, acontece em Belém."],
] as const;

const front: BookPage[] = [
  { bare: true, content: <TitlePage subject="geografia" title={GEOGRAFIA_INFO.title} subtitle={GEOGRAFIA_INFO.subtitle} /> },
  {
    content: (
      <LetterPage>
        <p className="mb-[0.5em]">
          Bem-vindo ao <strong>Livro do Mundo</strong>! A Geografia estuda o espaço onde vivemos: as paisagens, o clima, as águas, as pessoas, as cidades e como tudo
          isso está ligado, do seu bairro ao planeta inteiro.
        </p>
        <p>
          Mexa nas figuras de tocar (tem a caça ao tesouro da rosa dos ventos, o mapa das coordenadas, os fusos horários, os biomas, a pirâmide etária e o efeito estufa!)
          e faça os testes rápidos. Depois, as missões do tomo de Geografia vão ficar bem mais fáceis. Boa viagem pelo mundo!
        </p>
      </LetterPage>
    ),
  },
  { toc: true, content: <TocPage first from={0} to={5} /> },
  { content: <TocPage from={5} to={10} /> },
];

const end: BookPage[] = [
  { content: <TimelinePage subject="Geografia" items={TIMELINE} /> },
  { bare: true, content: <EndPage subject="geografia" name="Geografia" /> },
  { bare: true, content: <BackPage subject="geografia" /> },
];

const book: BookContent = {
  info: GEOGRAFIA_INFO,
  pages: [...front, ...chapter1, ...chapter2, ...chapter3, ...chapter4, ...chapter5, ...chapter6, ...chapter7, ...chapter8, ...chapter9, ...chapter10, ...end],
};

export default book;
