import type { SubjectId } from "@/engine/subjects";
import type { BookContent, BookInfo } from "./types";
import { BIOLOGIA_INFO } from "./biologia/meta";
import { QUIMICA_INFO } from "./quimica/meta";
import { FISICA_INFO } from "./fisica/meta";
import { ASTRONOMIA_INFO } from "./astronomia/meta";
import { ODS_INFO } from "./ods/meta";
import { PORTUGUES_INFO } from "./portugues/meta";
import { HISTORIA_INFO } from "./historia/meta";
import { MATEMATICA_INFO } from "./matematica/meta";
import { INGLES_INFO } from "./ingles/meta";
import { SCRATCH_INFO } from "./scratch/meta";
import { GEOGRAFIA_INFO } from "./geografia/meta";
import { HISTORIA_BRASIL_INFO } from "./historia-brasil/meta";
import { INFORMATICA_INFO } from "./informatica/meta";
import { PROGRAMACAO_INFO } from "./programacao/meta";

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
  ods: ODS_INFO,
  portugues: PORTUGUES_INFO,
  historia: HISTORIA_INFO,
  matematica: MATEMATICA_INFO,
  ingles: INGLES_INFO,
  scratch: SCRATCH_INFO,
  geografia: GEOGRAFIA_INFO,
  "historia-brasil": HISTORIA_BRASIL_INFO,
  informatica: INFORMATICA_INFO,
  programacao: PROGRAMACAO_INFO,
};

export const BOOK_LOADERS: Partial<Record<SubjectId, () => Promise<BookContent>>> = {
  biologia: () => import("./biologia").then((m) => m.default),
  quimica: () => import("./quimica").then((m) => m.default),
  fisica: () => import("./fisica").then((m) => m.default),
  astronomia: () => import("./astronomia").then((m) => m.default),
  ods: () => import("./ods").then((m) => m.default),
  portugues: () => import("./portugues").then((m) => m.default),
  historia: () => import("./historia").then((m) => m.default),
  matematica: () => import("./matematica").then((m) => m.default),
  ingles: () => import("./ingles").then((m) => m.default),
  scratch: () => import("./scratch").then((m) => m.default),
  geografia: () => import("./geografia").then((m) => m.default),
  "historia-brasil": () => import("./historia-brasil").then((m) => m.default),
  informatica: () => import("./informatica").then((m) => m.default),
  programacao: () => import("./programacao").then((m) => m.default),
};
