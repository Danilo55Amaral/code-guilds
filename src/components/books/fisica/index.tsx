import { BackPage, EndPage, LetterPage, TimelinePage, TitlePage, TocPage } from "../FrontMatter";
import type { BookContent, BookPage } from "../types";
import { FISICA_INFO } from "./meta";
import { chapter1 } from "./cap01-movimento";
import { chapter2 } from "./cap02-forcas";
import { chapter3 } from "./cap03-maquinas";
import { chapter4 } from "./cap04-pressao";
import { chapter5 } from "./cap05-energia";
import { chapter6 } from "./cap06-termodinamica";
import { chapter7 } from "./cap07-ondas";
import { chapter8 } from "./cap08-lentes";
import { chapter9 } from "./cap09-eletricidade";
import { chapter10 } from "./cap10-moderna";

// ============================================================================
// O LIVRO DE FÍSICA — a folha de rosto, a carta do Mago Danilo, o sumário,
// os 10 capítulos (os assuntos das missões do tomo de Física), a linha do
// tempo da Física, os parabéns e a contracapa. Cada capítulo tem um número
// par de páginas, pra abertura cair sempre na página da esquerda.
// ============================================================================

const TIMELINE = [
  ["1638", "Galileu estuda o movimento e a queda dos corpos."],
  ["1643", "Torricelli mede a pressão atmosférica com um tubo de mercúrio."],
  ["1687", "Newton publica as três leis do movimento e a gravitação."],
  ["1831", "Faraday descobre a indução eletromagnética, base dos geradores."],
  ["1865", "Maxwell mostra que a luz é uma onda eletromagnética."],
  ["1900", "Planck propõe que a energia vem em pacotes: nasce a física quântica."],
  ["1905", "Einstein apresenta a relatividade, o E = mc² e os fótons."],
  ["1927", "Heisenberg formula o Princípio da Incerteza."],
  ["1938", "Os cientistas descobrem a fissão nuclear do urânio."],
  ["1971", "Na Lua, um astronauta solta um martelo e uma pena, e eles caem juntos."],
  ["1985", "A usina de Angra 1, no Rio de Janeiro, entra em operação comercial."],
] as const;

const front: BookPage[] = [
  { bare: true, content: <TitlePage subject="fisica" title={FISICA_INFO.title} subtitle={FISICA_INFO.subtitle} /> },
  {
    content: (
      <LetterPage>
        <p className="mb-[0.5em]">
          Bem-vindo ao <strong>Livro das Forças</strong>! A Física explica por que a maçã cai, como o carro freia, de onde vem a luz da lâmpada e até por que o tempo pode passar
          mais devagar. Ela está em cada movimento que você faz.
        </p>
        <p>
          Mexa nas figuras de tocar (tem carrinho para empurrar, gangorra, circuito e até um som de verdade para ouvir!) e faça os testes rápidos. Depois, as missões do tomo de
          Física vão ficar bem mais fáceis. Boa viagem pelas forças do universo!
        </p>
      </LetterPage>
    ),
  },
  { toc: true, content: <TocPage first from={0} to={5} /> },
  { content: <TocPage from={5} to={10} /> },
];

const end: BookPage[] = [
  { content: <TimelinePage subject="Física" items={TIMELINE} /> },
  { bare: true, content: <EndPage subject="fisica" name="Física" /> },
  { bare: true, content: <BackPage subject="fisica" /> },
];

const book: BookContent = {
  info: FISICA_INFO,
  pages: [...front, ...chapter1, ...chapter2, ...chapter3, ...chapter4, ...chapter5, ...chapter6, ...chapter7, ...chapter8, ...chapter9, ...chapter10, ...end],
};

export default book;
