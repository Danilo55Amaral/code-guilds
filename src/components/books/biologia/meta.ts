import type { BookInfo } from "../types";

// A ficha do livro de Biologia (a estante e o sumário usam). Os capítulos são
// os assuntos das 10 missões do tomo de Biologia (biologia.ts e
// biologia-parte-2.ts, em api/scripts/missions), na ordem de um livro didático.
export const BIOLOGIA_INFO: BookInfo = {
  subject: "biologia",
  title: "Biologia: O Livro da Vida",
  subtitle: "Das células aos ecossistemas",
  chapters: [
    { title: "Seres Vivos e Células", icon: "🔬", summary: "O que é estar vivo, a descoberta da célula e as partes dela" },
    { title: "O Mundo das Plantas", icon: "🌱", summary: "Raiz, caule, folha, flor e fruto, a fotossíntese e os grupos de plantas" },
    { title: "O Reino Animal", icon: "🦁", summary: "Vertebrados, invertebrados e o que cada grupo tem de especial" },
    { title: "Microrganismos e Saúde", icon: "🦠", summary: "Vírus, bactérias, protozoários e fungos, as doenças e as defesas" },
    { title: "O Corpo Humano", icon: "🧠", summary: "Digestão, respiração, circulação, sistema nervoso, ossos e rins" },
    { title: "Hormônios e Reprodução", icon: "🧪", summary: "As glândulas, os hormônios, a puberdade e a reprodução humana" },
    { title: "Ecologia e Cadeias Alimentares", icon: "🌳", summary: "Ecossistemas, cadeias alimentares, relações, biomas e o clima" },
    { title: "Genética e DNA", icon: "🧬", summary: "DNA, genes, cromossomos, as leis de Mendel e o quadro de Punnett" },
    { title: "Divisão Celular e Proteínas", icon: "🧫", summary: "Mitose, meiose, do DNA à proteína, enzimas e biotecnologia moderna" },
    { title: "Evolução e Biotecnologia", icon: "🦕", summary: "Darwin, seleção natural, fósseis, classificação, transgênicos e clones" },
  ],
};
