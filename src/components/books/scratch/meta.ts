import type { BookInfo } from "../types";

// A ficha do livro de Scratch (a estante e o sumário usam). Os capítulos são os
// assuntos das quatro missões de Scratch do tomo (Introdução ao Scratch, Blocos de
// Código no Scratch e Scratch partes 2 e 3, em api/scripts/missions/programacao-12-anos*.ts),
// organizados pelas categorias de blocos, na ordem de um livro.
export const SCRATCH_INFO: BookInfo = {
  subject: "scratch",
  title: "Scratch: O Livro dos Blocos",
  subtitle: "Programe jogos, histórias e animações encaixando blocos",
  chapters: [
    { title: "Conhecendo o Scratch", icon: "🐱", summary: "O que é o Scratch, a tela dele, a bandeira verde e a comunidade" },
    { title: "Atores, Fantasias e Cenários", icon: "🎭", summary: "Os atores, as fantasias que animam, os cenários e as coordenadas x e y" },
    { title: "Movimento", icon: "🧭", summary: "Mover, girar, as direções, deslizar e quicar na borda" },
    { title: "Eventos e Mensagens", icon: "🚩", summary: "Os blocos de chapéu, as teclas e os atores conversando com mensagens" },
    { title: "Controle: Repetições e Condições", icon: "🔁", summary: "Repita, sempre, se… então, senão e espere" },
    { title: "Sensores e Operadores", icon: "🎲", summary: "Tocando em, pergunte e resposta, número aleatório, comparar e juntar" },
    { title: "Variáveis e Listas", icon: "📦", summary: "Guardar pontos e vidas, para todos os atores ou só pra um, e as listas" },
    { title: "Aparência e Som", icon: "🎨", summary: "Diga e pense, tamanho, efeitos, camadas, esconda e mostre e os sons" },
    { title: "Caneta e Meus Blocos", icon: "✏️", summary: "Desenhar polígonos com a caneta e criar os seus próprios blocos" },
    { title: "Clones e o Seu Primeiro Jogo", icon: "🎮", summary: "Os clones e um jogo completo, do plano ao compartilhamento" },
  ],
};
