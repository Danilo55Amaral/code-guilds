// ============================================================================
// LORE DAS CASAS — a história da fundação da CodeGuilds e de cada guilda,
// mostrada na tela Guildas (app/academia/guildas). Dados estáticos, sem estado;
// os dados das casas (nome, animal, cores, brasão) ficam em houses.ts.
// ============================================================================

import type { HouseId } from "./houses";

export interface HouseLore {
  guildTitle: string; // "Guilda do Leão", "Guilda da Serpente"... (com o artigo certo)
  founder: string;
  motto: string; // lema, em forma de frase
  story: string; // como o fundador e o animal se encontraram na Torre do Compilador
  commonRoom: string; // o salão comunal da guilda no castelo
  specialty: string; // o jeito da guilda de programar
  traits: string[]; // "quem é da guilda..."
}

/** A Lenda da Fundação: parágrafos contados em ordem na tela Guildas. */
export const FOUNDING_LEGEND: string[] = [
  "Há mil anos, antes das telas e dos teclados, o mundo inteiro era escrito num único livro: o Código-Fonte. Cada rio, cada estrela e cada pessoa era uma linha desse código, e enquanto ele compilasse sem erros, tudo funcionava em harmonia.",
  "Até que surgiu o Grande Bug. Ninguém sabe de onde ele veio: uma vírgula fora do lugar, um laço que nunca terminava... e o mundo começou a travar. Os rios corriam ao contrário, as estrelas piscavam em loop e as pessoas repetiam a mesma frase sem parar.",
  "Quatro aprendizes subiram a Torre do Compilador pra enfrentar o Grande Bug: Aurélia Brasa, que nunca recuava diante de um erro; Silas Umbra, que enxergava caminhos que ninguém via; Heitor Solaris, que jamais deixava um companheiro pra trás; e Minerva Corvina, que resolvia qualquer enigma com lógica pura.",
  "Sozinhos, cada um falhou. Mas juntos, com a coragem de Aurélia, a astúcia de Silas, a lealdade de Heitor e a lógica de Minerva, eles depuraram o Código-Fonte linha por linha e aprisionaram o Grande Bug no fundo do castelo. Dizem que ele ainda sussurra lá embaixo, esperando uma linha mal escrita pra escapar.",
  "Para que o mundo nunca mais ficasse desprotegido, os quatro fundaram a CodeGuilds, e cada um criou uma guilda guardada pelo animal que o acompanhou na torre: o Leão, a Serpente, a Águia e o Corvo. Desde então, todo aprendiz que atravessa os portões do castelo é escolhido por uma delas... e a sua jornada começa.",
];

export const HOUSE_LORE: Record<HouseId, HouseLore> = {
  ignis: {
    guildTitle: "Guilda do Leão",
    founder: "Aurélia Brasa",
    motto: "Nenhum erro é grande demais pra quem tem coragem de ler a mensagem inteira.",
    story:
      "Aurélia foi a primeira a subir a Torre do Compilador. Quando o Grande Bug soltou uma tempestade de erros vermelhos, ela não fugiu: leu cada mensagem, linha por linha, até achar a causa. O Leão dourado que dormia na forja da torre acordou com o rugido dela, e desde então os dois nunca mais se separaram. A Ignis acredita que todo código quebrado pode ser consertado, desde que alguém tenha coragem de tentar de novo.",
    commonRoom: "A Forja: um salão quente no alto da torre leste, com uma lareira que nunca apaga e paredes cobertas pelas mensagens de erro que os alunos já venceram.",
    specialty: "Depuração corajosa: ler o erro, testar de novo e não parar até funcionar.",
    traits: ["Encaram os desafios mais difíceis primeiro", "Não desistem na primeira mensagem de erro", "Lideram o grupo nos momentos de aperto", "Transformam cada falha numa lição"],
  },
  noctis: {
    guildTitle: "Guilda da Serpente",
    founder: "Silas Umbra",
    motto: "Quem observa em silêncio encontra o atalho que ninguém viu.",
    story:
      "Enquanto os outros atacavam o Grande Bug de frente, Silas se esgueirava pelas sombras da torre, estudando cada movimento dele. Foi assim que descobriu a passagem secreta que levava ao coração do código. Uma serpente de escamas verdes o guiou pelo escuro, sussurrando os segredos das variáveis escondidas. A Noctis ensina que a solução mais elegante raramente é a mais óbvia.",
    commonRoom: "O Covil das Sombras: sob o lago do castelo, iluminado por lanternas verdes, com paredes de vidro por onde se vê os peixes nadando lá fora.",
    specialty: "Otimização astuta: o caminho mais curto, o código mais limpo, o truque que ninguém tinha pensado.",
    traits: ["Enxergam atalhos e soluções elegantes", "Planejam antes de escrever a primeira linha", "Acham os bugs escondidos que ninguém percebeu", "Se adaptam rápido a qualquer desafio"],
  },
  flavus: {
    guildTitle: "Guilda da Águia",
    founder: "Heitor Solaris",
    motto: "Voamos alto, mas nunca voamos sozinhos.",
    story:
      "Heitor era o único que via a torre inteira de cima. Nas asas de uma águia dourada, ele percebeu que o Grande Bug só seria vencido se os quatro trabalhassem juntos, e voou de andar em andar levando mensagens, reunindo os amigos e protegendo quem ficava pra trás. A Flavus acredita que o melhor código é aquele que a equipe inteira consegue entender.",
    commonRoom: "O Ninho do Sol: a torre mais alta do castelo, aberta pro céu, onde o amanhecer entra dourado e dá pra ver o reino inteiro lá de cima.",
    specialty: "Arquitetura e trabalho em equipe: ver o panorama, organizar as partes e fazer todo mundo chegar junto.",
    traits: ["Ajudam os colegas sem pensar duas vezes", "Enxergam o projeto inteiro, não só a própria parte", "Cumprem o que prometem", "Deixam o código organizado pra quem vem depois"],
  },
  sapientia: {
    guildTitle: "Guilda do Corvo",
    founder: "Minerva Corvina",
    motto: "Todo enigma tem uma resposta; basta seguir a lógica até o fim.",
    story:
      "Minerva foi quem decifrou o Grande Bug. Enquanto os outros lutavam, ela se trancou na biblioteca da torre com um corvo negro de olhos azuis, que virava as páginas pra ela durante a noite. Ao amanhecer, ela tinha escrito o algoritmo perfeito que aprisionou o Bug pra sempre. A Sapientia acredita que não existe problema impossível, só problema que ainda não foi dividido em partes pequenas o bastante.",
    commonRoom: "A Grande Biblioteca: estantes em espiral que sobem até o teto, velas flutuantes e um observatório no topo, onde os alunos estudam as estrelas e os algoritmos.",
    specialty: "Algoritmos e lógica: pensar passo a passo, provar que funciona e achar a solução mais inteligente.",
    traits: ["Dividem problemas grandes em partes pequenas", "Explicam o porquê de cada linha de código", "Amam enigmas, lógica e matemática", "Estudam a fundo antes de responder"],
  },
};
