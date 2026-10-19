import type { BookInfo } from "../types";

// A ficha do livro de Química (a estante e o sumário usam). Os capítulos são
// os assuntos das 10 missões do tomo de Química (quimica.ts e
// quimica-parte-2.ts, em api/scripts/missions), na ordem de um livro didático.
export const QUIMICA_INFO: BookInfo = {
  subject: "quimica",
  title: "Química: O Livro da Matéria",
  subtitle: "Dos átomos às reações do dia a dia",
  chapters: [
    { title: "A Matéria e os Estados Físicos", icon: "💧", summary: "Massa, volume, densidade, sólido, líquido, gás e as mudanças de estado" },
    { title: "Átomos e a Tabela Periódica", icon: "⚛️", summary: "Prótons, nêutrons e elétrons, os modelos atômicos e os elementos" },
    { title: "Substâncias, Misturas e Ligações", icon: "🧂", summary: "Substâncias puras, misturas, como separá-las e as ligações químicas" },
    { title: "Soluções e Concentração", icon: "🥤", summary: "Soluto, solvente, saturação, concentração e diluição" },
    { title: "Reações Químicas", icon: "🔥", summary: "Reagentes e produtos, Lavoisier, balanceamento e combustão" },
    { title: "Mol e Estequiometria", icon: "⚖️", summary: "O mol, a massa molar e os cálculos das reações" },
    { title: "Ácidos, Bases e pH", icon: "🍋", summary: "A escala de pH, os indicadores, a neutralização e a chuva ácida" },
    { title: "Química no Dia a Dia", icon: "🧼", summary: "Fermento, sabão, sal iodado, flúor, cloro e fogos de artifício" },
    { title: "Eletroquímica e Radioatividade", icon: "🔋", summary: "Pilhas, oxidação e redução, eletrólise e as radiações" },
    { title: "Química Orgânica", icon: "🛢️", summary: "O carbono, as funções orgânicas, a isomeria, o petróleo e os polímeros" },
  ],
};
