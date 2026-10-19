import type { BookInfo } from "../types";

// A ficha do livro de Astronomia (a estante e o sumário usam). Os capítulos
// são os assuntos das 10 missões do tomo de Astronomia (astronomia.ts e
// astronomia-parte-2.ts, em api/scripts/missions), na ordem de um livro.
export const ASTRONOMIA_INFO: BookInfo = {
  subject: "astronomia",
  title: "Astronomia: O Livro do Céu",
  subtitle: "Do Sistema Solar às estrelas distantes",
  chapters: [
    { title: "Observando o Céu", icon: "🌌", summary: "O que dá para ver a olho nu, a cor do céu, as auroras e Galileu" },
    { title: "A Lua e os Eclipses", icon: "🌕", summary: "As fases da Lua, os eclipses, as crateras e as marés" },
    { title: "Os Planetas do Sistema Solar", icon: "☀️", summary: "Os oito planetas, rochosos e gasosos, e os planetas-anões" },
    { title: "As Luas do Sistema Solar", icon: "🌑", summary: "A origem da nossa Lua, Io, Europa, Titã, Encélado e outras" },
    { title: "Gravidade e Órbitas", icon: "🌍", summary: "Copérnico, Kepler, Galileu, as estações do ano e a gravidade" },
    { title: "Estrelas e Constelações", icon: "⭐", summary: "Como as estrelas nascem e morrem, as constelações e o céu dos povos" },
    { title: "Telescópios e a Luz", icon: "🔭", summary: "Lunetas, telescópios, o espectro da luz e os observatórios" },
    { title: "Exoplanetas e Astrofísica", icon: "💫", summary: "Distâncias no universo, exoplanetas, zona habitável e pulsares" },
    { title: "A Corrida Espacial", icon: "🚀", summary: "Sputnik, Gagarin, a Apollo 11, a Estação Espacial e Marte" },
    { title: "A Busca por Vida no Universo", icon: "👽", summary: "Astrobiologia, extremófilos, a equação de Drake e o SETI" },
  ],
};
