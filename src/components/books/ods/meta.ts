import type { BookInfo } from "../types";

// A ficha do livro de ODS (a estante e o sumário usam). Os capítulos são os
// assuntos das missões do tomo de ODS (as três "ODS" de programacao-12-anos*.ts
// e as cinco de ods.ts, em api/scripts/missions), na ordem de um livro.
export const ODS_INFO: BookInfo = {
  subject: "ods",
  title: "ODS: O Livro do Futuro do Planeta",
  subtitle: "Os 17 Objetivos de Desenvolvimento Sustentável",
  chapters: [
    { title: "A Agenda 2030 e os 17 ODS", icon: "🌍", summary: "O que são os ODS, quem os criou, os 5 Ps e as parcerias" },
    { title: "Pequenas Atitudes, Grande Impacto", icon: "♻️", summary: "Os 3 Rs, a coleta seletiva, a compostagem e o tempo do lixo" },
    { title: "Água e Saneamento", icon: "💧", summary: "A água doce do planeta, as estações de tratamento e o ODS 6" },
    { title: "O Clima do Planeta", icon: "🌡️", summary: "O efeito estufa, o aquecimento global, o IPCC e a COP30" },
    { title: "Energia Limpa", icon: "☀️", summary: "Fontes renováveis, a matriz elétrica do Brasil e o ODS 7" },
    { title: "Igualdade e Direitos", icon: "⚖️", summary: "Direitos humanos, o ECA, leis de inclusão e equidade" },
    { title: "Fome Zero, Saúde e Educação", icon: "🌾", summary: "Os ODS 2, 3 e 4, a agroecologia e o desperdício de comida" },
    { title: "Consumo Responsável", icon: "🛒", summary: "Economia circular, obsolescência programada e logística reversa" },
    { title: "Cidades Sustentáveis", icon: "🏙️", summary: "Transporte, áreas verdes, moradia digna e o ODS 11" },
    { title: "A Vida na Água e na Terra", icon: "🐠", summary: "Biodiversidade, oceanos, unidades de conservação e os ODS 14 e 15" },
  ],
};
