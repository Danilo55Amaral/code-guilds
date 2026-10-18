import type { ReactNode } from "react";
import type { SubjectId } from "@/engine/subjects";

// ============================================================================
// OS LIVROS DA BIBLIOTECA VIRTUAL — cada matéria dos tomos do conhecimento
// pode ter um livro didático. A estante só precisa da ficha (BookInfo: título
// e capítulos); as páginas (BookContent) ficam num arquivo à parte, carregado
// só quando o aluno abre o livro.
// ============================================================================

export interface BookChapterInfo {
  title: string;
  icon: string;
  /** a frase curtinha do capítulo, no sumário e na ficha do livro */
  summary: string;
}

export interface BookInfo {
  subject: SubjectId;
  title: string;
  subtitle: string;
  chapters: BookChapterInfo[];
}

/** Uma página do livro: o conteúdo e o número do capítulo (1, 2...) a que ela pertence. */
export interface BookPage {
  chapter?: number;
  content: ReactNode;
  /** a página sem cabeçalho nem número (a folha de rosto e as aberturas de capítulo) */
  bare?: boolean;
  /** a página do sumário (o botão "Sumário" do topo leva pra ela) */
  toc?: boolean;
}

export interface BookContent {
  info: BookInfo;
  pages: BookPage[];
}
