import type { SubjectId } from "@/engine/subjects";
import type { BookContent, BookInfo } from "./types";
import { BIOLOGIA_INFO } from "./biologia/meta";
import { QUIMICA_INFO } from "./quimica/meta";
import { FISICA_INFO } from "./fisica/meta";
import { ASTRONOMIA_INFO } from "./astronomia/meta";

// ============================================================================
// O CATÁLOGO DA BIBLIOTECA VIRTUAL — os livros que já estão prontos. A ficha
// (título e capítulos) vem junto com a estante; as páginas só são baixadas
// quando o aluno abre o livro (import dinâmico, um arquivo por livro). Matéria
// sem livro aqui aparece na estante como "Em breve".
// ============================================================================

export const BOOK_INFO: Partial<Record<SubjectId, BookInfo>> = {
  biologia: BIOLOGIA_INFO,
  quimica: QUIMICA_INFO,
  fisica: FISICA_INFO,
  astronomia: ASTRONOMIA_INFO,
};

export const BOOK_LOADERS: Partial<Record<SubjectId, () => Promise<BookContent>>> = {
  biologia: () => import("./biologia").then((m) => m.default),
  quimica: () => import("./quimica").then((m) => m.default),
  fisica: () => import("./fisica").then((m) => m.default),
  astronomia: () => import("./astronomia").then((m) => m.default),
};
