import type { BookInfo } from "../types";

// A ficha do livro de Informática (a estante e o sumário usam). Os capítulos
// são os assuntos das missões de Informática, Pacote Office, Computação em
// Nuvem e A História da Computação (programacao-12-anos-parte-3, 5 e 7.ts,
// em api/scripts/missions): do computador por dentro até a nuvem.
export const INFORMATICA_INFO: BookInfo = {
  subject: "informatica",
  title: "Informática: O Livro do Computador",
  subtitle: "Do mouse à nuvem",
  chapters: [
    { title: "O Computador", icon: "🖥️", summary: "Hardware e software, entrada, processamento, saída e armazenamento, bits e bytes" },
    { title: "O Sistema Operacional", icon: "💻", summary: "Windows, Linux, macOS e Android, a área de trabalho, as janelas e o gerenciador de tarefas" },
    { title: "Arquivos e Pastas", icon: "📁", summary: "As extensões, o explorador de arquivos, renomear, organizar e compactar em ZIP" },
    { title: "Teclado e Atalhos", icon: "⌨️", summary: "As teclas especiais e os atalhos que todo mundo devia saber" },
    { title: "Internet e Navegadores", icon: "🌐", summary: "Como a internet funciona, o endereço de um site, as boas pesquisas, download e upload" },
    { title: "Segurança na Internet", icon: "🔒", summary: "Senhas fortes, golpes e phishing, o cadeado do HTTPS, antivírus e backup" },
    { title: "O Editor de Texto", icon: "📝", summary: "Word: formatar, salvar, revisar e imprimir um documento" },
    { title: "Planilhas, Slides e E-mail", icon: "📊", summary: "Excel e suas fórmulas, PowerPoint e Outlook" },
    { title: "A Computação em Nuvem", icon: "☁️", summary: "Os data centers, os serviços que você já usa, a escalabilidade e a segurança" },
    { title: "A História da Computação", icon: "⏳", summary: "Do ábaco e de Ada Lovelace ao ENIAC, ao computador pessoal e à inteligência artificial" },
  ],
};
