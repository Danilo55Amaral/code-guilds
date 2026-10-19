import type { BookInfo } from "../types";

// A ficha do livro de Física (a estante e o sumário usam). Os capítulos são
// os assuntos das 10 missões do tomo de Física (fisica.ts e
// fisica-parte-2.ts, em api/scripts/missions), na ordem de um livro didático.
export const FISICA_INFO: BookInfo = {
  subject: "fisica",
  title: "Física: O Livro das Forças",
  subtitle: "Do movimento ao mundo quântico",
  chapters: [
    { title: "Movimento e Velocidade", icon: "🚗", summary: "Referencial, velocidade média, unidades e aceleração" },
    { title: "Forças e as Leis de Newton", icon: "🍎", summary: "Inércia, F = m · a, ação e reação, peso e atrito" },
    { title: "Trabalho, Potência e Máquinas", icon: "⚙️", summary: "Trabalho, potência, alavancas, roldanas, rampas e molas" },
    { title: "Pressão e Fluidos", icon: "💧", summary: "Pressão, pressão atmosférica, empuxo e o Princípio de Pascal" },
    { title: "Energia e Calor", icon: "⚡", summary: "Formas de energia, conservação, temperatura e propagação do calor" },
    { title: "Termodinâmica", icon: "🌡️", summary: "Escalas de temperatura, dilatação, calor latente e as leis da termodinâmica" },
    { title: "Ondas, Som e Luz", icon: "🔊", summary: "Ondas, o som, a luz, a reflexão, a refração e o arco-íris" },
    { title: "Lentes e Espelhos", icon: "🔍", summary: "Lentes, o olho humano, os óculos, os espelhos curvos e a fibra óptica" },
    { title: "Eletricidade e Magnetismo", icon: "🧲", summary: "Corrente, tensão, circuitos, consumo de energia e os ímãs" },
    { title: "Física Moderna", icon: "☢️", summary: "Relatividade, fótons, física quântica e energia nuclear" },
  ],
};
