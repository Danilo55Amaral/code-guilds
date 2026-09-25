// ============================================================================
// MISSIONS — missões/quizzes. Dados estáticos criados pelo professor.
// No painel do professor, isso viraria dados editáveis (hoje é só leitura).
// ============================================================================

export type Rarity = "comum" | "raro" | "epico" | "lendario";
export type Difficulty = "iniciante" | "medio" | "avancado" | "epico";

export const RARITY_META: Record<Rarity, { label: string; colorClass: string; borderClass: string }> = {
  comum: { label: "Comum", colorClass: "text-slate-300", borderClass: "border-slate-500/40" },
  raro: { label: "Raro", colorClass: "text-sky-300", borderClass: "border-sky-500/40" },
  epico: { label: "Épico", colorClass: "text-purple-300", borderClass: "border-purple-500/40" },
  lendario: { label: "Lendário", colorClass: "text-amber-300", borderClass: "border-amber-500/40" },
};

export const RARITY_ICON: Record<Rarity, string> = { comum: "🔹", raro: "🔷", epico: "💠", lendario: "👑" };

/** Cor do brilho de cada raridade (card de item, cards da Loja) — mesmos tons dos badges. */
export const RARITY_GLOW: Record<Rarity, string> = { comum: "#94a3b8", raro: "#38bdf8", epico: "#c084fc", lendario: "#fbbf24" };

/** Valor em moedas usado quando um item não tem valor definido (itens antigos, criados antes do mercado). */
export const RARITY_DEFAULT_VALUE: Record<Rarity, number> = { comum: 10, raro: 30, epico: 80, lendario: 200 };

/**
 * Item que uma missão dá de recompensa. `value` é quanto ele vale em moedas
 * (preço de venda pro sistema); `xp` é quanto XP ele dá ao ser usado —
 * 0 significa que o item não é consumível (não tem botão "Usar").
 */
export interface RewardItem {
  name: string;
  icon: string; // emoji escolhido pelo professor
  description: string; // aparece no card do item; "" = item antigo, sem descrição
  rarity: Rarity;
  value: number;
  xp: number;
}

/** Ícone sugerido pra um item novo (o professor troca no seletor de emojis). */
export const DEFAULT_ITEM_ICON = "🎁";

export const ITEM_DESCRIPTION_MAX_LENGTH = 300;

/** Completa itens salvos antes de existir valor/XP/ícone/descrição — os sem ícone ficam com o da raridade, como antes. */
export function normalizeRewardItem(item: {
  name: string;
  rarity: Rarity;
  icon?: string;
  description?: string;
  value?: number;
  xp?: number;
}): RewardItem {
  return {
    ...item,
    icon: item.icon || RARITY_ICON[item.rarity] || DEFAULT_ITEM_ICON,
    description: item.description ?? "",
    value: item.value ?? RARITY_DEFAULT_VALUE[item.rarity] ?? 10,
    xp: item.xp ?? 0,
  };
}

export const DIFFICULTY_META: Record<Difficulty, { label: string; colorClass: string; borderClass: string }> = {
  iniciante: { label: "Iniciante", colorClass: "text-emerald-300", borderClass: "border-emerald-500/40" },
  medio: { label: "Médio", colorClass: "text-amber-300", borderClass: "border-amber-500/40" },
  avancado: { label: "Avançado", colorClass: "text-orange-300", borderClass: "border-orange-500/40" },
  epico: { label: "Épico", colorClass: "text-purple-300", borderClass: "border-purple-500/40" },
};

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  code?: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
}

export interface Mission {
  id: string;
  teacherId: string; // professor dono — só os alunos dele veem a missão
  title: string;
  icon: string;
  difficulty: Difficulty;
  minLevel: number;
  description: string;
  rewardXp: number;
  rewardCoins: number;
  rewardItem: RewardItem;
  questions: QuizQuestion[];
}

/** O que o editor de missão preenche — o id é gerado ao criar e o professor dono vem de quem cria. */
export type MissionContent = Omit<Mission, "id" | "teacherId">;

/** Missões padrão (sem dono) — o missionsStore semeia elas como do professor padrão. */
export const MISSIONS: Omit<Mission, "teacherId">[] = [
  {
    id: "variaveis-do-vazio",
    title: "Variáveis do Vazio",
    icon: "🧪",
    difficulty: "iniciante",
    minLevel: 1,
    description: "Domine let, const e os tipos primitivos",
    rewardXp: 120,
    rewardCoins: 50,
    rewardItem: {
      name: "Fragmento de Código",
      icon: "💾",
      description: "Um pedaço de código esquecido no Vazio. Usar libera o conhecimento guardado nele em forma de XP.",
      rarity: "comum",
      value: 15,
      xp: 40,
    },
    questions: [
      {
        id: "q1",
        prompt: "Qual declaração cria uma variável imutável?",
        code: "// Qual é imutável?\nlet a = 1;\nconst b = 2;",
        options: [
          { id: "a", text: "let a" },
          { id: "b", text: "const b" },
          { id: "c", text: "var a" },
          { id: "d", text: "Ambas" },
        ],
        correctOptionId: "b",
        explanation: "const cria referência imutável, let permite reatribuição.",
      },
      {
        id: "q2",
        prompt: "O que esse código imprime no console?",
        code: "console.log(typeof null);",
        options: [
          { id: "a", text: '"null"' },
          { id: "b", text: '"undefined"' },
          { id: "c", text: '"object"' },
          { id: "d", text: '"number"' },
        ],
        correctOptionId: "c",
        explanation: "É um bug histórico do JavaScript: typeof null retorna \"object\", mesmo null não sendo um objeto.",
      },
    ],
  },
  {
    id: "loop-do-infinito",
    title: "Loop do Infinito",
    icon: "♾️",
    difficulty: "medio",
    minLevel: 2,
    description: "For, while e a arte de não travar o navegador",
    rewardXp: 200,
    rewardCoins: 90,
    rewardItem: {
      name: "Anel do Iterador",
      icon: "💍",
      description: "Forjado num loop que quase nunca terminou. Quem o usa percorre qualquer lista sem perder um elemento.",
      rarity: "raro",
      value: 40,
      xp: 0,
    },
    questions: [
      {
        id: "q1",
        prompt: "Qual loop garante ao menos uma execução, mesmo com a condição falsa?",
        code: "do {\n  console.log('oi');\n} while (false);",
        options: [
          { id: "a", text: "for" },
          { id: "b", text: "while" },
          { id: "c", text: "do...while" },
          { id: "d", text: "forEach" },
        ],
        correctOptionId: "c",
        explanation: "do...while executa o bloco uma vez antes de checar a condição — por isso roda mesmo quando a condição já começa falsa.",
      },
      {
        id: "q2",
        prompt: "Por que esse loop nunca termina?",
        code: "for (let i = 0; i > -1; i++) {\n  // ...\n}",
        options: [
          { id: "a", text: "i sempre cresce, então nunca fica ≤ -1" },
          { id: "b", text: "i começa negativo" },
          { id: "c", text: "Faltou um break" },
          { id: "d", text: "É um erro de sintaxe" },
        ],
        correctOptionId: "a",
        explanation: "i++ só aumenta i — a condição i > -1 permanece verdadeira para sempre.",
      },
    ],
  },
  {
    id: "promessas-sombrias",
    title: "Promessas Sombrias",
    icon: "🌑",
    difficulty: "avancado",
    minLevel: 3,
    description: "Async/Await e o reino das Promises",
    rewardXp: 350,
    rewardCoins: 150,
    rewardItem: {
      name: "Orbe Async",
      icon: "🔮",
      description: "Uma esfera que promete poder… e cumpre, mas só quando estiver pronta. Usar resolve a promessa em XP.",
      rarity: "epico",
      value: 90,
      xp: 150,
    },
    questions: [
      {
        id: "q1",
        prompt: "O que 'await' faz dentro de uma função async?",
        options: [
          { id: "a", text: "Pausa a execução até a Promise resolver" },
          { id: "b", text: "Cancela a Promise" },
          { id: "c", text: "Roda a Promise em paralelo, sem esperar" },
          { id: "d", text: "Transforma a função inteira em síncrona" },
        ],
        correctOptionId: "a",
        explanation: "await pausa a função async naquele ponto até a Promise resolver (ou rejeitar), sem bloquear o resto do programa.",
      },
      {
        id: "q2",
        prompt: "O que é impresso no console?",
        code: "async function f() {\n  return 42;\n}\nf().then(console.log);",
        options: [
          { id: "a", text: "Promise { 42 }" },
          { id: "b", text: "42" },
          { id: "c", text: "undefined" },
          { id: "d", text: "Erro" },
        ],
        correctOptionId: "b",
        explanation: "Uma função async sempre retorna uma Promise que resolve com o valor retornado — .then() recebe o valor já resolvido, 42.",
      },
    ],
  },
  {
    id: "arquiteto-do-dom",
    title: "Arquiteto do DOM",
    icon: "👑",
    difficulty: "epico",
    minLevel: 4,
    description: "Manipule a realidade da página",
    rewardXp: 500,
    rewardCoins: 250,
    rewardItem: {
      name: "Coroa do Frontend",
      icon: "👑",
      description: "Símbolo de quem domina o DOM. Dizem que quem a usa enxerga cada elemento da página antes de ele ser renderizado.",
      rarity: "lendario",
      value: 250,
      xp: 0,
    },
    questions: [
      {
        id: "q1",
        prompt: "Qual método adiciona um elemento como último filho de outro?",
        options: [
          { id: "a", text: "appendChild" },
          { id: "b", text: "removeChild" },
          { id: "c", text: "insertBefore" },
          { id: "d", text: "cloneNode" },
        ],
        correctOptionId: "a",
        explanation: "appendChild adiciona o nó como o último filho do elemento pai.",
      },
      {
        id: "q2",
        prompt: "Qual é a forma correta de selecionar todos os elementos com a classe 'card'?",
        options: [
          { id: "a", text: "document.getElementById('.card')" },
          { id: "b", text: "document.querySelectorAll('.card')" },
          { id: "c", text: "document.getElementByClass('card')" },
          { id: "d", text: "document.class('card')" },
        ],
        correctOptionId: "b",
        explanation: "querySelectorAll aceita seletores CSS — '.card' seleciona todos os elementos com essa classe.",
      },
    ],
  },
];

export function getMission(id: string): Omit<Mission, "teacherId"> | undefined {
  return MISSIONS.find((m) => m.id === id);
}

// ============================================================================
// BUSCA — o aluno pode procurar missão pelo nome, pela raridade do item
// ("épico", "lendário"...) ou pelo item em si ("anel", "coroa"...).
// Ignora maiúsculas e acentos: "epico" encontra "Épico".
// ============================================================================

/** Minúsculo, sem acento e sem espaços nas pontas — usado também na busca de alunos e professores. */
export function normalizeSearch(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

export function matchesSearch(mission: Mission, query: string): boolean {
  const q = normalizeSearch(query);
  if (!q) return true;
  const fields = [mission.title, mission.rewardItem.name, RARITY_META[mission.rewardItem.rarity].label];
  return fields.some((f) => normalizeSearch(f).includes(q));
}

// ============================================================================
// REGRA DE APROVAÇÃO — o aluno só ganha XP/moedas/item (e a missão só conta
// como concluída) se acertar no mínimo 60% das perguntas.
// A comparação é feita com números inteiros (acertos * 100 >= total * 60)
// em vez de dividir, pra evitar erro de arredondamento de ponto flutuante
// em casos exatos como 3 de 5 (60% cravado).
// ============================================================================

export const PASS_THRESHOLD_PERCENT = 60;

/** Quantos acertos são necessários, no mínimo, pra passar numa missão com `total` perguntas. */
export function requiredCorrect(total: number): number {
  return Math.ceil((total * PASS_THRESHOLD_PERCENT) / 100);
}

export function hasPassed(correctCount: number, total: number): boolean {
  if (total <= 0) return false;
  return correctCount * 100 >= total * PASS_THRESHOLD_PERCENT;
}
