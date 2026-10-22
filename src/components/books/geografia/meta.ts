import type { BookInfo } from "../types";

// A ficha do livro de Geografia (a estante e o sumário usam). Os capítulos
// são os assuntos das 5 missões do tomo de Geografia (geografia.ts, em
// api/scripts/missions), em ordem: dos mapas e da Terra por dentro até a
// população, as cidades, a economia, a globalização e o meio ambiente.
export const GEOGRAFIA_INFO: BookInfo = {
  subject: "geografia",
  title: "Geografia: O Livro do Mundo",
  subtitle: "Dos mapas à geopolítica",
  chapters: [
    { title: "Mapas e Orientação", icon: "🧭", summary: "Pontos cardeais, rosa dos ventos, escala, legenda e os tipos de mapa" },
    { title: "Coordenadas e Fusos Horários", icon: "🌐", summary: "Equador, Greenwich, latitude, longitude, os trópicos, o GPS e os fusos" },
    { title: "A Terra e o Relevo", icon: "⛰️", summary: "As camadas da Terra, as placas tectônicas, as formas de relevo e o relevo do Brasil" },
    { title: "Tempo e Clima", icon: "🌦️", summary: "A diferença entre tempo e clima, os fatores do clima e os climas do Brasil" },
    { title: "Águas e Biomas", icon: "🌳", summary: "O ciclo da água, as bacias hidrográficas e os seis biomas brasileiros" },
    { title: "População", icon: "👥", summary: "Demografia, a pirâmide etária, o crescimento da população e as migrações" },
    { title: "Cidades e Urbanização", icon: "🏙️", summary: "O êxodo rural, as metrópoles, a rede urbana e os problemas das cidades" },
    { title: "Economia e Energia", icon: "⚡", summary: "Os setores da economia, o agronegócio e as fontes de energia" },
    { title: "Globalização e Geopolítica", icon: "🤝", summary: "O mundo conectado, os blocos econômicos e as organizações internacionais" },
    { title: "Meio Ambiente", icon: "🌱", summary: "O efeito estufa, as mudanças climáticas, o desmatamento e os acordos ambientais" },
  ],
};
