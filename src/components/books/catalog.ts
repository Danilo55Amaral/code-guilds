import type { SubjectId } from "@/engine/subjects";
import type { BookContent, BookInfo } from "./types";
import { BIOLOGIA_INFO } from "./biologia/meta";

// ============================================================================
// O CATÁLOGO DA BIBLIOTECA VIRTUAL — os livros que já estão prontos. A ficha
// (título e capítulos) vem junto com a estante; as páginas só são baixadas
// quando o aluno abre o livro (import dinâmico, um arquivo por livro). Matéria
// sem livro aqui aparece na estante como "Em breve".
// ============================================================================

export const BOOK_INFO: Partial<Record<SubjectId, BookInfo>> = {
  biologia: BIOLOGIA_INFO,
};

export const BOOK_LOADERS: Partial<Record<SubjectId, () => Promise<BookContent>>> = {
  biologia: () => import("./biologia").then((m) => m.default),
};
