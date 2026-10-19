import { BackPage, EndPage, LetterPage, TimelinePage, TitlePage, TocPage } from "../FrontMatter";
import type { BookContent, BookPage } from "../types";
import { ODS_INFO } from "./meta";
import { chapter1 } from "./cap01-agenda";
import { chapter2 } from "./cap02-atitudes";
import { chapter3 } from "./cap03-agua";
import { chapter4 } from "./cap04-clima";
import { chapter5 } from "./cap05-energia";
import { chapter6 } from "./cap06-direitos";
import { chapter7 } from "./cap07-fome-saude";
import { chapter8 } from "./cap08-consumo";
import { chapter9 } from "./cap09-cidades";
import { chapter10 } from "./cap10-vida";

// ============================================================================
// O LIVRO DE ODS — a folha de rosto, a carta do Mago Danilo, o sumário, os 10
// capítulos (os assuntos das missões do tomo de ODS), a linha do tempo da
// sustentabilidade, os parabéns e a contracapa. Cada capítulo tem um número
// par de páginas, pra abertura cair sempre na página da esquerda.
// ============================================================================

const TIMELINE = [
  ["1945", "Nasce a ONU, depois da Segunda Guerra Mundial."],
  ["1948", "A ONU aprova a Declaração Universal dos Direitos Humanos."],
  ["1972", "A Conferência de Estocolmo é a primeira grande reunião da ONU sobre o meio ambiente."],
  ["1987", "O relatório “Nosso Futuro Comum” explica o que é desenvolvimento sustentável."],
  ["1988", "Nasce o IPCC, o grupo de cientistas da ONU que estuda o clima."],
  ["1990", "O Brasil aprova o ECA, o Estatuto da Criança e do Adolescente."],
  ["1992", "A Rio-92 reúne os países do mundo no Rio de Janeiro para falar do planeta."],
  ["2000", "A ONU lança os 8 Objetivos de Desenvolvimento do Milênio."],
  ["2015", "Nascem os 17 ODS da Agenda 2030 e é assinado o Acordo de Paris."],
  ["2025", "A COP30, a conferência do clima da ONU, acontece em Belém do Pará."],
  ["2030", "O prazo para o mundo cumprir os ODS. Falta pouco!"],
] as const;

const front: BookPage[] = [
  { bare: true, content: <TitlePage subject="ods" title={ODS_INFO.title} subtitle={ODS_INFO.subtitle} /> },
  {
    content: (
      <LetterPage>
        <p className="mb-[0.5em]">
          Bem-vindo ao <strong>Livro do Futuro do Planeta</strong>! Os 17 ODS são um plano do mundo inteiro para acabar com a fome, cuidar da água, do clima e das
          florestas e garantir os direitos de todas as pessoas até 2030. E cada um de nós faz parte desse plano.
        </p>
        <p>
          Mexa nas figuras de tocar (tem o jogo da coleta seletiva, o efeito estufa, a matriz elétrica do Brasil, a cerca da equidade e os biomas!) e faça os testes
          rápidos. Depois, as missões do tomo de ODS vão ficar bem mais fáceis. Bora mudar o mundo!
        </p>
      </LetterPage>
    ),
  },
  { toc: true, content: <TocPage first from={0} to={5} /> },
  { content: <TocPage from={5} to={10} /> },
];

const end: BookPage[] = [
  { content: <TimelinePage subject="sustentabilidade" items={TIMELINE} /> },
  { bare: true, content: <EndPage subject="ods" name="ODS" /> },
  { bare: true, content: <BackPage subject="ods" /> },
];

const book: BookContent = {
  info: ODS_INFO,
  pages: [...front, ...chapter1, ...chapter2, ...chapter3, ...chapter4, ...chapter5, ...chapter6, ...chapter7, ...chapter8, ...chapter9, ...chapter10, ...end],
};

export default book;
