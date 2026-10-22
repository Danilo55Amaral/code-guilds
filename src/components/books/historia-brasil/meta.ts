import type { BookInfo } from "../types";

// A ficha do livro de História do Brasil (a estante e o sumário usam). Os
// capítulos são os assuntos das 5 missões do tomo de História do Brasil
// (historia-do-brasil.ts, em api/scripts/missions), em ordem cronológica,
// dos povos indígenas à Nova República.
export const HISTORIA_BRASIL_INFO: BookInfo = {
  subject: "historia-brasil",
  title: "História do Brasil: O Livro da Nossa Terra",
  subtitle: "Dos povos indígenas à Nova República",
  chapters: [
    { title: "Os Primeiros Povos", icon: "🏹", summary: "Os povos indígenas, os sambaquis, a cerâmica marajoara e as palavras de origem tupi" },
    { title: "A Chegada dos Portugueses", icon: "⛵", summary: "O Tratado de Tordesilhas, a esquadra de Cabral, a carta de Caminha e o pau-brasil" },
    { title: "A Colonização", icon: "🗺️", summary: "As capitanias hereditárias, o Governo-Geral, Salvador e os jesuítas" },
    { title: "O Açúcar e a Escravidão", icon: "🍬", summary: "O engenho, o tráfico de africanos escravizados e a vida na colônia" },
    { title: "Resistência e Liberdade", icon: "✊", summary: "Os quilombos, Palmares, Zumbi e Dandara, a Revolta dos Malês e a cultura afro-brasileira" },
    { title: "O Ouro e as Revoltas Coloniais", icon: "💰", summary: "A mineração, o quinto, o barroco mineiro, a Inconfidência e a Conjuração Baiana" },
    { title: "A Família Real e a Independência", icon: "👑", summary: "A vinda da corte em 1808, o Dia do Fico, o 7 de Setembro e o Primeiro Reinado" },
    { title: "Regências e Segundo Reinado", icon: "☕", summary: "As revoltas regenciais, Dom Pedro II, o café, a Guerra do Paraguai e a Abolição" },
    { title: "República Velha e Era Vargas", icon: "🗳️", summary: "Café com leite, coronelismo, Canudos, a Semana de 22, Vargas e Brasília" },
    { title: "Ditadura e Redemocratização", icon: "📜", summary: "O golpe de 1964, o AI-5, as Diretas Já, a Constituição de 1988 e a Nova República" },
  ],
};
