// ============================================================================
// MATÉRIAS — as disciplinas das missões. A Biblioteca de Missões (tela de
// Missões do aluno) mostra um tomo por matéria e, ao abrir, só as missões dela.
// A missão guarda a matéria em `subject` (o professor escolhe no editor); as
// que ainda não têm (as criadas antes da Biblioteca) caem na matéria que o
// título indica (inferSubject). A que não bate com nenhuma vai pra "Outras
// missões", pra nenhuma missão sumir da tela do aluno.
// ============================================================================

import type { Mission } from "./missions";

export type SubjectId = "ods" | "astronomia" | "programacao" | "scratch" | "roblox" | "informatica" | "app-inventor" | "hardware";

export interface Subject {
  id: SubjectId;
  name: string;
  icon: string;
  /** A frase curtinha embaixo do nome, no tomo da Biblioteca. */
  tagline: string;
}

/** As matérias, na ordem da Biblioteca. */
export const SUBJECTS: Subject[] = [
  { id: "ods", name: "ODS", icon: "🌍", tagline: "Objetivos de Desenvolvimento Sustentável" },
  { id: "astronomia", name: "Astronomia", icon: "🔭", tagline: "Planetas, estrelas e os segredos do universo" },
  { id: "programacao", name: "Linguagem de Programação", icon: "💻", tagline: "JavaScript, Python, Java, Lua, HTML e CSS" },
  { id: "scratch", name: "Scratch", icon: "🐱", tagline: "Programação com blocos de encaixar" },
  { id: "roblox", name: "Roblox Studio", icon: "🧱", tagline: "Crie mundos e jogos em 3D" },
  { id: "informatica", name: "Informática", icon: "🖥️", tagline: "Computador, internet, Office e a nuvem" },
  { id: "app-inventor", name: "MIT App Inventor", icon: "📱", tagline: "Crie aplicativos de celular" },
  { id: "hardware", name: "Hardware", icon: "🔧", tagline: "As peças por dentro do computador" },
];

export const SUBJECT_IDS = SUBJECTS.map((s) => s.id);

/** As missões que não são de nenhuma matéria (o tomo "Outras missões" e o endereço dele). */
export const OTHER_SUBJECTS = "outras";

export function getSubject(id: string): Subject | undefined {
  return SUBJECTS.find((s) => s.id === id);
}

// Palavras de cada matéria, conferidas em ordem (Scratch antes de Programação, porque
// "Blocos de Código no Scratch" também fala de código). O texto vem sem acento e minúsculo.
const SUBJECT_KEYWORDS: [SubjectId, RegExp][] = [
  ["ods", /\bods\b|sustentav|objetivos de desenvolvimento/],
  ["astronomia", /astronom|astrofis|cosmolog|planeta|estrela|galaxi|universo|sistema solar|buraco negro|constela/],
  ["scratch", /scratch/],
  ["roblox", /roblox/],
  ["app-inventor", /app inventor/],
  ["hardware", /hardware|placa[ -]mae|processador|perifer|memoria ram/],
  ["informatica", /informatica|office|\bword\b|excel|powerpoint|cultura geek|nuvem|computacao|internet|sistema operacional|seguranca digital|computador/],
  ["programacao", /programa|linguage|javascript|python|\bjava\b|\blua\b|html|css|codigo|algoritm|variave|loop|funca|funco|promess|\bdom\b|logica/],
];

function plain(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function subjectIn(text: string): SubjectId | null {
  const t = plain(text);
  return SUBJECT_KEYWORDS.find(([, re]) => re.test(t))?.[0] ?? null;
}

/** A matéria que o título (ou, se ele não disser, a descrição) da missão indica. */
export function inferSubject(m: Pick<Mission, "title" | "description">): SubjectId | null {
  return subjectIn(m.title) ?? subjectIn(m.description);
}

/** A matéria da missão: a escolhida pelo professor ou, se não tiver, a que o título indica. */
export function missionSubject(m: Pick<Mission, "subject" | "title" | "description">): SubjectId | null {
  return m.subject ?? inferSubject(m);
}
