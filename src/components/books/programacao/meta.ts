import type { BookInfo } from "../types";

// A ficha do livro de Linguagem de Programação (a estante e o sumário usam).
// Os capítulos são os assuntos das missões de programação do tomo (O Mundo da
// Programação, Linguagens de Programação, HTML, CSS, JavaScript, Python, Lua
// e Java, em programacao-12-anos*.ts, em api/scripts/missions).
export const PROGRAMACAO_INFO: BookInfo = {
  subject: "programacao",
  title: "Linguagem de Programação: O Livro do Código",
  subtitle: "Do algoritmo ao Python, JavaScript, Lua e Java",
  chapters: [
    { title: "O Mundo da Programação", icon: "🤖", summary: "Algoritmos, programas, sequência, repetição, condição e bugs" },
    { title: "Como as Linguagens Funcionam", icon: "🧩", summary: "Compiladores e interpretadores, cada linguagem no seu lugar, nomes, comentários e erros" },
    { title: "HTML: a Estrutura", icon: "🧱", summary: "As tags, a estrutura da página, títulos, links, imagens, listas e tabelas" },
    { title: "CSS: o Estilo", icon: "🎨", summary: "Seletores, cores, fontes, bordas, a caixa do CSS, o hover e o flexbox" },
    { title: "JavaScript: o Básico", icon: "⚡", summary: "Variáveis, tipos, contas, textos, condições e repetições" },
    { title: "JavaScript na Página", icon: "🖱️", summary: "Funções, listas, objetos, cliques, o DOM e os sorteios" },
    { title: "Python: os Primeiros Passos", icon: "🐍", summary: "print, input, variáveis, indentação, if, for, range, while e listas" },
    { title: "Python Avançando", icon: "🐉", summary: "Funções, dicionários, f-strings, fatias, random e try/except" },
    { title: "Lua, a Linguagem Brasileira", icon: "🌙", summary: "print, local, if-then-end, laços, tabelas, ipairs e o Roblox" },
    { title: "Java e os Objetos", icon: "☕", summary: "A JVM, o main, os tipos, as classes, os objetos e o ArrayList" },
  ],
};
