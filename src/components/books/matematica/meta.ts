import type { BookInfo } from "../types";

// A ficha do livro de Matemática (a estante e o sumário usam). Os capítulos são os
// assuntos das cinco missões do tomo de Matemática (api/scripts/missions/matematica.ts),
// cada missão dividida em dois capítulos, na ordem de um livro.
export const MATEMATICA_INFO: BookInfo = {
  subject: "matematica",
  title: "Matemática: O Livro dos Números",
  subtitle: "Das quatro operações à estatística",
  chapters: [
    { title: "Operações e Potências", icon: "➗", summary: "As quatro operações, a ordem de resolver uma expressão e as potências" },
    { title: "Divisores, Primos e Frações", icon: "🍕", summary: "Múltiplos, números primos, MMC, frações e números decimais" },
    { title: "Porcentagem", icon: "💯", summary: "O que é por cento, descontos, aumentos e juros" },
    { title: "Razão, Proporção e Regra de Três", icon: "⚖️", summary: "Razão, escala, velocidade e a regra de três direta e inversa" },
    { title: "Equações e Sistemas", icon: "❓", summary: "A balança das equações do 1º grau e os sistemas de duas equações" },
    { title: "Funções e Equação do 2º Grau", icon: "📈", summary: "A máquina de funções, a reta, a parábola e a fórmula de Bhaskara" },
    { title: "Geometria Plana", icon: "📐", summary: "Ângulos, polígonos, perímetro e área" },
    { title: "Pitágoras, Círculo e Trigonometria", icon: "🔺", summary: "O Teorema de Pitágoras, o número pi, volumes, seno e cosseno" },
    { title: "Probabilidade e Contagem", icon: "🎲", summary: "Chances de dados e moedas, o princípio da contagem e os anagramas" },
    { title: "Estatística e Progressões", icon: "📊", summary: "Média, mediana, moda, gráficos, PA e PG" },
  ],
};
