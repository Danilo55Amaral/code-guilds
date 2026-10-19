import type { BookInfo } from "../types";

// A ficha do livro de Língua Portuguesa (a estante e o sumário usam). Os
// capítulos são os assuntos das 10 missões do tomo de Língua Portuguesa
// (lingua-portuguesa.ts e lingua-portuguesa-parte-2.ts, em api/scripts/missions),
// na ordem de um livro: da palavra à frase, ao texto e à literatura.
export const PORTUGUES_INFO: BookInfo = {
  subject: "portugues",
  title: "Língua Portuguesa: O Livro das Palavras",
  subtitle: "Da gramática à literatura brasileira",
  chapters: [
    { title: "Classes de Palavras", icon: "🔤", summary: "Substantivo, adjetivo, verbo, artigo, pronome, advérbio e os outros" },
    { title: "O Sentido das Palavras", icon: "📖", summary: "Sinônimos, antônimos, homônimos, parônimos, flexões e sentido figurado" },
    { title: "Ortografia e Acentuação", icon: "✍️", summary: "Os porquês, mal e mau, há e a, a crase e as regras de acento" },
    { title: "Pontuação e Concordância", icon: "❗", summary: "A vírgula, os sinais de pontuação e a concordância verbal e nominal" },
    { title: "A Oração e Seus Termos", icon: "🧩", summary: "Sujeito, predicado, objetos, adjuntos, aposto e voz passiva" },
    { title: "Período Composto e Coesão", icon: "🔗", summary: "Orações coordenadas e subordinadas e os conectivos" },
    { title: "Gêneros Textuais e Leitura", icon: "📰", summary: "Notícia, crônica, fábula, poema, inferência e variação linguística" },
    { title: "Figuras de Linguagem", icon: "🎭", summary: "Metáfora, comparação, hipérbole, ironia, metonímia e outras" },
    { title: "As Escolas Literárias", icon: "🖋️", summary: "Do Quinhentismo ao Simbolismo: Caminha, Gregório, Alencar e Machado" },
    { title: "O Modernismo e Além", icon: "📚", summary: "A Semana de 22, Drummond, Graciliano, Clarice, Rosa e Carolina" },
  ],
};
