import type { BookInfo } from "../types";

// A ficha do livro de Inglês (a estante e o sumário usam). Os capítulos são os
// assuntos das dez missões do tomo de Inglês (ingles.ts e ingles-parte-2.ts, em
// api/scripts/missions), na ordem de um livro.
export const INGLES_INFO: BookInfo = {
  subject: "ingles",
  title: "Inglês: Let's Talk!",
  subtitle: "Do Hello ao Present Perfect",
  chapters: [
    { title: "Greetings, Colors and Numbers", icon: "👋", summary: "Cumprimentos, se apresentar, as cores, os números e os dias da semana" },
    { title: "Verb To Be and Pronouns", icon: "🙋", summary: "Os pronomes, o verbo to be e os possessivos (my, your, his, her…)" },
    { title: "Family and Home", icon: "🏠", summary: "A família, os cômodos da casa e os móveis" },
    { title: "Food and There Is, There Are", icon: "🍎", summary: "Comidas, refeições, there is e there are, how much e how many" },
    { title: "Simple Present and Daily Routine", icon: "⏰", summary: "O presente simples, a rotina, as horas e a frequência" },
    { title: "Present Continuous and Prepositions", icon: "🏃", summary: "O que está acontecendo agora e as preposições de lugar e de tempo" },
    { title: "Simple Past", icon: "📷", summary: "Os verbos regulares e irregulares, was e were e o did" },
    { title: "Future, Comparatives and Modals", icon: "🔮", summary: "Will e going to, comparativos, can, should, must e os falsos cognatos" },
    { title: "Present Perfect", icon: "✈️", summary: "Have e has, o particípio, ever, never, since e for" },
    { title: "Conditionals, Passive and Phrasal Verbs", icon: "💡", summary: "If, a voz passiva e os phrasal verbs" },
  ],
};
