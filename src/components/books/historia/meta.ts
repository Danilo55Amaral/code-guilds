import type { BookInfo } from "../types";

// A ficha do livro de História Geral (a estante e o sumário usam). Os
// capítulos são os assuntos das 10 missões do tomo de História Geral
// (historia.ts e historia-parte-2.ts, em api/scripts/missions), em ordem
// cronológica, da Pré-História ao século XX.
export const HISTORIA_INFO: BookInfo = {
  subject: "historia",
  title: "História Geral: O Livro do Tempo",
  subtitle: "Das cavernas ao século XX",
  chapters: [
    { title: "A Pré-História", icon: "🦴", summary: "Paleolítico, Neolítico, pinturas rupestres, Luzia e a invenção da escrita" },
    { title: "Mesopotâmia e Egito", icon: "🏺", summary: "Os rios, a escrita cuneiforme, Hamurábi, os faraós e as pirâmides" },
    { title: "Outros Povos da Antiguidade", icon: "🐉", summary: "Hebreus, fenícios, persas, a China e a Índia antigas" },
    { title: "A Grécia Antiga", icon: "🏛️", summary: "Atenas e a democracia, Esparta, as Olimpíadas e os filósofos" },
    { title: "Roma Antiga", icon: "🛡️", summary: "Rômulo e Remo, a República, o Império, o latim e a queda em 476" },
    { title: "A Idade Média", icon: "🏰", summary: "Feudalismo, a Igreja, as Cruzadas e a peste negra" },
    { title: "Povos da América e da África", icon: "🌽", summary: "Maias, astecas, incas, os reinos africanos e a conquista" },
    { title: "Renascimento, Navegações e Reformas", icon: "⛵", summary: "Da imprensa às caravelas, o Brasil colônia e a Reforma Protestante" },
    { title: "Revoluções e Independências", icon: "🗽", summary: "Absolutismo, Iluminismo, as revoluções e o Brasil independente" },
    { title: "O Século XX", icon: "🌐", summary: "As guerras mundiais, a Guerra Fria, Mandela e o Brasil República" },
  ],
};
