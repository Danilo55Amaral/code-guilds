// ============================================================================
// EVENTOS ESPECIAIS — eventos temáticos da Academia (ex.: Halloween). Cada
// evento tem uma história contada em cenas de tela cheia (abertura e final,
// em components/EventScene.tsx), missões exclusivas que o professor cria ou
// atribui (Mission.eventId) e uma recompensa pra quem finaliza.
// O evento de Natal é em fases: uma trilha de 3 fases seguidas, cada uma com
// abertura, missões (Mission.eventPhase), final e um item lendário.
// O desenho de cada cena fica em components/events/; o progresso do aluno
// (viu a abertura? finalizou?) fica em Student.events.
// ============================================================================

import { Mission, MissionContent, RewardItem } from "./missions";
import { EventProgress, Student, addXp, grantItem } from "./students";
import { HOUSES, HouseId } from "./houses";

export type EventId = "halloween" | "zumbi" | "alien" | "natal";

/** Quem fala na cena — define o nome no balão, a cor e a voz. */
export type SceneSpeaker = "narrador" | "mago" | "vilao" | "noel";

/** Efeito sonoro que toca quando a cena começa. */
export type SceneSound = "sino" | "trovao" | "plim" | "fanfarra" | "alarme" | "gemido" | "ovni" | "laser" | "guizos" | "vento";

export interface EventSceneStep {
  art: string; // qual desenho aparece (cada evento tem os seus, em components/events/)
  speaker: SceneSpeaker;
  text: string;
  sound?: SceneSound;
}

export interface EventReward {
  xp: number;
  coins: number;
  item: RewardItem;
}

/**
 * Uma parte jogável da história: abertura, missões, final e recompensa.
 * Evento comum tem uma só (o próprio evento); evento em fases (Natal) tem uma por fase.
 */
export interface EventChapter {
  goal: string; // o que o aluno precisa fazer, em uma frase
  /** Frase embaixo do título "Missões do evento" (o que cada missão vencida faz). */
  missionHint: string;
  /** Convite pra finalizar, quando todas as missões foram concluídas. */
  finishCall: { title: string; text: string };
  intro: EventSceneStep[];
  outro: EventSceneStep[];
  reward: EventReward;
  /** Missões prontas que o professor pode adicionar com um clique. */
  presetMissions: MissionContent[];
}

interface EventBase {
  id: EventId;
  icon: string;
  title: string;
  tagline: string;
  summary: string; // resumo da história, no card do evento
  /** O vilão da história: nome e ícone no balão de fala e a voz dele (pitch 0 a 2, rate = velocidade). */
  villain: { name: string; icon: string; voice: { pitch: number; rate: number } };
}

/** Uma fase de um evento em fases: tem a própria abertura, missões, final e item lendário. */
export interface EventPhase extends EventChapter {
  number: number; // 1, 2, 3...
  icon: string;
  title: string; // ex.: "O Sequestro"
  summary: string;
}

/** Evento de uma parte só (Halloween, Apocalipse Zumbi, Invasão Alienígena). */
export interface SingleEvent extends EventBase, EventChapter {
  phases?: undefined;
}

/**
 * Evento em fases (Natal): uma trilha de fases seguidas. O professor libera
 * uma fase por vez (uma por semana) e o aluno só entra numa fase depois de
 * finalizar a anterior. O final da última fase é o final do evento.
 */
export interface PhasedEvent extends EventBase {
  phases: EventPhase[];
  goal: string; // o objetivo do evento inteiro (cada fase tem o seu)
}

export type AcademyEvent = SingleEvent | PhasedEvent;

// ============================================================================
// 🎃 HALLOWEEN — A Noite do Bug Assombrado
// ============================================================================

const HALLOWEEN_MISSIONS: MissionContent[] = [
  {
    title: "O Fantasma do undefined",
    icon: "👻",
    difficulty: "iniciante",
    minLevel: 1,
    description: "Descubra por que o fantasma que assombra o corredor não tem valor nenhum",
    rewardXp: 150,
    rewardCoins: 60,
    rewardItem: {
      name: "Vela Assombrada",
      icon: "🕯️",
      description: "Acende sozinha quando o sino bate meia-noite. Usar derrete a cera mágica em XP.",
      rarity: "comum",
      value: 15,
      xp: 60,
    },
    questions: [
      {
        id: "q1",
        prompt: "Qual valor tem uma variável declarada sem valor inicial?",
        code: "let fantasma;\nconsole.log(fantasma);",
        options: [
          { id: "a", text: "null" },
          { id: "b", text: "undefined" },
          { id: "c", text: "0" },
          { id: "d", text: '""' },
        ],
        correctOptionId: "b",
        explanation: "Toda variável declarada sem valor começa como undefined: o fantasma existe, mas ainda não tem nada dentro.",
      },
      {
        id: "q2",
        prompt: "O que typeof undefined retorna?",
        options: [
          { id: "a", text: '"undefined"' },
          { id: "b", text: '"null"' },
          { id: "c", text: '"object"' },
          { id: "d", text: '"fantasma"' },
        ],
        correctOptionId: "a",
        explanation: 'undefined tem um tipo só dele: typeof undefined é "undefined".',
      },
      {
        id: "q3",
        prompt: "Qual dessas comparações é verdadeira?",
        code: "null == undefined\nnull === undefined",
        options: [
          { id: "a", text: "As duas" },
          { id: "b", text: "Só null == undefined" },
          { id: "c", text: "Só null === undefined" },
          { id: "d", text: "Nenhuma" },
        ],
        correctOptionId: "b",
        explanation: "O == considera null e undefined iguais (os dois são \"vazios\"); o === exige o mesmo tipo, e eles são tipos diferentes.",
      },
    ],
  },
  {
    title: "O Caldeirão das Arrays",
    icon: "🧪",
    difficulty: "iniciante",
    minLevel: 1,
    description: "Misture, filtre e transforme os ingredientes da poção do Rei Abóbora",
    rewardXp: 180,
    rewardCoins: 70,
    rewardItem: {
      name: "Poção Borbulhante",
      icon: "🧪",
      description: "Verde, quente e cheirando a abóbora queimada. Beber (usar) dá um bom tanto de XP.",
      rarity: "raro",
      value: 30,
      xp: 120,
    },
    questions: [
      {
        id: "q1",
        prompt: "Qual método coloca um ingrediente no fim da array?",
        code: "const caldeirao = ['sapo', 'morcego'];\ncaldeirao.???('aranha');",
        options: [
          { id: "a", text: "push" },
          { id: "b", text: "pop" },
          { id: "c", text: "shift" },
          { id: "d", text: "slice" },
        ],
        correctOptionId: "a",
        explanation: "push adiciona no fim; pop tira do fim, shift tira do começo e slice copia um pedaço.",
      },
      {
        id: "q2",
        prompt: "O que esse código imprime?",
        code: "const ossos = [1, 2, 3];\nconsole.log(ossos.map(o => o * 2));",
        options: [
          { id: "a", text: "[1, 2, 3]" },
          { id: "b", text: "[2, 4, 6]" },
          { id: "c", text: "6" },
          { id: "d", text: "[1, 4, 9]" },
        ],
        correctOptionId: "b",
        explanation: "map cria uma array nova aplicando a função em cada item: cada osso vira o dobro.",
      },
      {
        id: "q3",
        prompt: "Qual linha devolve só as abóboras maduras (peso maior que 5)?",
        code: "const aboboras = [3, 8, 6, 2];",
        options: [
          { id: "a", text: "aboboras.filter(p => p > 5)" },
          { id: "b", text: "aboboras.map(p => p > 5)" },
          { id: "c", text: "aboboras.find(p => p > 5)" },
          { id: "d", text: "aboboras.push(p > 5)" },
        ],
        correctOptionId: "a",
        explanation: "filter devolve uma array nova só com quem passou no teste: [8, 6]. O find devolveria só a primeira (8), e o map devolveria true/false pra cada uma.",
      },
    ],
  },
  {
    title: "O Labirinto das Condições",
    icon: "🕸️",
    difficulty: "medio",
    minLevel: 1,
    description: "Escolha o caminho certo entre if, else e === pra não se perder na teia",
    rewardXp: 220,
    rewardCoins: 90,
    rewardItem: {
      name: "Teia Encantada",
      icon: "🕸️",
      description: "Tecida por uma aranha que entende de lógica: cada fio é um if, cada nó é um else.",
      rarity: "epico",
      value: 80,
      xp: 0,
    },
    questions: [
      {
        id: "q1",
        prompt: "O que é impresso?",
        code: "const hora = 0;\nif (hora) {\n  console.log('dia');\n} else {\n  console.log('meia-noite');\n}",
        options: [
          { id: "a", text: "dia" },
          { id: "b", text: "meia-noite" },
          { id: "c", text: "undefined" },
          { id: "d", text: "Erro" },
        ],
        correctOptionId: "b",
        explanation: "0 é um valor \"falsy\": dentro do if ele conta como falso, então o else roda.",
      },
      {
        id: "q2",
        prompt: "Qual é o resultado de '5' === 5?",
        options: [
          { id: "a", text: "true" },
          { id: "b", text: "false" },
          { id: "c", text: "'5'" },
          { id: "d", text: "Erro" },
        ],
        correctOptionId: "b",
        explanation: "O === compara valor E tipo: '5' é texto (string) e 5 é número, então é false.",
      },
      {
        id: "q3",
        prompt: "Qual operador significa \"E\" (as duas condições precisam ser verdadeiras)?",
        options: [
          { id: "a", text: "&&" },
          { id: "b", text: "||" },
          { id: "c", text: "!" },
          { id: "d", text: "??" },
        ],
        correctOptionId: "a",
        explanation: "&& é o \"E\"; || é o \"OU\", ! é o \"NÃO\" e ?? devolve o da direita quando o da esquerda é null ou undefined.",
      },
    ],
  },
  {
    title: "O Duelo contra o Rei Abóbora",
    icon: "👑",
    difficulty: "avancado",
    minLevel: 1,
    description: "A missão final: enfrente o feitiço das funções e quebre a maldição",
    rewardXp: 300,
    rewardCoins: 120,
    rewardItem: {
      name: "Orbe do Bug Aprisionado",
      icon: "🔮",
      description: "O bug mais perigoso do Rei Abóbora, preso pra sempre dentro de uma esfera de vidro. Ele ainda tenta escapar à noite.",
      rarity: "lendario",
      value: 200,
      xp: 0,
    },
    questions: [
      {
        id: "q1",
        prompt: "O que esse código imprime?",
        code: "function feitico(x) {\n  return x * 3;\n}\nconsole.log(feitico(4));",
        options: [
          { id: "a", text: "7" },
          { id: "b", text: "12" },
          { id: "c", text: "43" },
          { id: "d", text: "undefined" },
        ],
        correctOptionId: "b",
        explanation: "A função recebe 4 e devolve 4 * 3 = 12.",
      },
      {
        id: "q2",
        prompt: "E esse aqui, o truque favorito do Rei Abóbora?",
        code: "function semRetorno() {\n  const magia = 42;\n}\nconsole.log(semRetorno());",
        options: [
          { id: "a", text: "42" },
          { id: "b", text: "undefined" },
          { id: "c", text: "null" },
          { id: "d", text: "Erro" },
        ],
        correctOptionId: "b",
        explanation: "Sem return, a função devolve undefined, mesmo tendo criado a variável magia lá dentro.",
      },
      {
        id: "q3",
        prompt: "Qual arrow function faz exatamente o mesmo que essa função?",
        code: "function dobro(n) {\n  return n * 2;\n}",
        options: [
          { id: "a", text: "const dobro = n => n * 2;" },
          { id: "b", text: "const dobro = n => { n * 2 };" },
          { id: "c", text: "const dobro => n * 2;" },
          { id: "d", text: "dobro = function => n * 2;" },
        ],
        correctOptionId: "a",
        explanation: "Sem chaves, a arrow function devolve a expressão sozinha. Com chaves ela precisaria de return, senão devolve undefined.",
      },
    ],
  },
];

const HALLOWEEN: SingleEvent = {
  id: "halloween",
  icon: "🎃",
  title: "A Noite do Bug Assombrado",
  tagline: "🎃 Evento de Halloween",
  summary:
    "O Rei Abóbora voltou do exílio e lançou a Maldição do Bug Eterno sobre a CodeGuilds. Fantasmas de undefined vagam pelos corredores e nenhum feitiço compila mais!",
  goal: "Vença as missões assombradas, acenda todas as Lanternas Sagradas e quebre a maldição antes do amanhecer.",
  villain: { name: "Rei Abóbora", icon: "🎃", voice: { pitch: 0.2, rate: 0.85 } },
  missionHint: "Missões exclusivas: só existem durante o evento. Cada uma que você vencer acende uma Lanterna Sagrada.",
  finishCall: {
    title: "Todas as lanternas estão acesas!",
    text: "A maldição está por um fio... Só falta o último passo pra salvar a CodeGuilds e ganhar a recompensa final.",
  },
  intro: [
    {
      art: "noite",
      speaker: "narrador",
      sound: "sino",
      text: "Era a noite de 31 de outubro na CodeGuilds. A lua cheia subiu vermelha sobre o castelo... e, quando o sino bateu meia-noite, todos os relógios pararam de uma vez.",
    },
    {
      art: "mago",
      speaker: "mago",
      sound: "plim",
      text: "Aprendiz, que bom que você chegou! Algo terrível está acontecendo. Sinto uma magia antiga e sombria no ar... uma magia que eu não sentia há cem anos.",
    },
    {
      art: "rei",
      speaker: "vilao",
      sound: "trovao",
      text: "Muahahaha! Lembram de mim? Eu sou o Rei Abóbora! Fui expulso desta academia por escrever código sem testes... e agora voltei pra me vingar!",
    },
    {
      art: "maldicao",
      speaker: "vilao",
      sound: "trovao",
      text: "Lancei a Maldição do Bug Eterno! Fantasmas de undefined assombram os corredores, as abóboras ganharam vida e nenhum feitiço de vocês vai compilar nunca mais!",
    },
    {
      art: "lanternas",
      speaker: "mago",
      sound: "plim",
      text: "Não perca a esperança! Existe um jeito de quebrar a maldição: acender as Lanternas Sagradas do castelo. O Rei Abóbora escondeu cada uma atrás de um desafio assombrado, e cada missão que você vencer acende uma lanterna.",
    },
    {
      art: "chamado",
      speaker: "mago",
      sound: "plim",
      text: "Se todas as lanternas brilharem antes do amanhecer, a maldição se desfaz e o Rei Abóbora perde todo o poder. A CodeGuilds conta com você, aprendiz. Que comece a Noite do Bug Assombrado!",
    },
  ],
  outro: [
    {
      art: "lanternas-acesas",
      speaker: "narrador",
      sound: "plim",
      text: "A última lanterna se acendeu. Uma luz dourada correu pelas torres, atravessou os corredores e iluminou cada canto escuro da CodeGuilds.",
    },
    {
      art: "rei-derrotado",
      speaker: "vilao",
      sound: "trovao",
      text: "Nããão! Minha maldição... meu código sem testes... Eu estou encolhendo! Isso não estava na documentação!",
    },
    {
      art: "amanhecer",
      speaker: "narrador",
      sound: "sino",
      text: "O Rei Abóbora encolheu até virar uma aboborinha do tamanho de uma mão. Os fantasmas de undefined finalmente ganharam um valor e subiram em paz. O sol nasceu, e os relógios voltaram a andar.",
    },
    {
      art: "recompensa",
      speaker: "mago",
      sound: "fanfarra",
      text: "Você salvou a academia, aprendiz! E olha só: a aboborinha arrependida pediu pra ser o seu mascote. Leve também este tesouro. A CodeGuilds nunca vai esquecer a Noite do Bug Assombrado!",
    },
  ],
  reward: {
    xp: 500,
    coins: 300,
    item: {
      name: "Rei Abóbora de Estimação",
      icon: "🎃",
      description:
        "O Rei Abóbora derrotado, agora pequenininho e arrependido, jurou te seguir pra sempre. Equipe no Inventário e ele vira o mascote no seu ombro.",
      rarity: "lendario",
      value: 200,
      xp: 0,
      cosmetic: { slot: "pet", value: "abobora" },
    },
  },
  presetMissions: HALLOWEEN_MISSIONS,
};

// ============================================================================
// 🧟 APOCALIPSE ZUMBI — O Surto do Vírus Z
// ============================================================================

const ZOMBIE_MISSIONS: MissionContent[] = [
  {
    title: "O Zumbi do Ctrl+C",
    icon: "🧟",
    difficulty: "iniciante",
    minLevel: 1,
    description: "Descubra quando uma variável é uma cópia de verdade e quando é só um zumbi da original",
    rewardXp: 150,
    rewardCoins: 60,
    rewardItem: {
      name: "Sopa em Lata Quentinha",
      icon: "🥫",
      description: "Achada num armário da cantina abandonada. Esquenta a alma do sobrevivente: usar dá XP.",
      rarity: "comum",
      value: 15,
      xp: 60,
    },
    questions: [
      {
        id: "q1",
        prompt: "O que é impresso?",
        code: "const a = [1, 2];\nconst b = a;\nb.push(3);\nconsole.log(a);",
        options: [
          { id: "a", text: "[1, 2]" },
          { id: "b", text: "[1, 2, 3]" },
          { id: "c", text: "[3]" },
          { id: "d", text: "Erro" },
        ],
        correctOptionId: "b",
        explanation: "b = a não copia a array: as duas variáveis apontam pra MESMA array. Mexeu numa, mexeu na outra, igual zumbi copiado.",
      },
      {
        id: "q2",
        prompt: "Qual linha cria uma cópia de verdade da array a?",
        options: [
          { id: "a", text: "const b = [...a];" },
          { id: "b", text: "const b = a;" },
          { id: "c", text: "const b = a.copy();" },
          { id: "d", text: "const b = &a;" },
        ],
        correctOptionId: "a",
        explanation: "O spread [...a] espalha os itens numa array nova. Arrays não têm .copy() e & não existe em JavaScript.",
      },
      {
        id: "q3",
        prompt: "E com texto? O que é impresso?",
        code: "let x = 'humano';\nlet y = x;\ny = 'zumbi';\nconsole.log(x);",
        options: [
          { id: "a", text: "humano" },
          { id: "b", text: "zumbi" },
          { id: "c", text: "undefined" },
          { id: "d", text: "Erro" },
        ],
        correctOptionId: "a",
        explanation: "Textos, números e booleanos são copiados pelo valor: y ganhou uma cópia, então trocar y não infecta x.",
      },
    ],
  },
  {
    title: "O Laboratório dos Objetos",
    icon: "🔬",
    difficulty: "iniciante",
    minLevel: 1,
    description: "Examine as amostras do Dr. Necrose sem deixar nenhuma propriedade escapar",
    rewardXp: 180,
    rewardCoins: 70,
    rewardItem: {
      name: "Amostra Brilhante",
      icon: "🧪",
      description: "Um frasquinho verde que brilha no escuro, recolhido do laboratório. Usar dá um bom tanto de XP.",
      rarity: "raro",
      value: 30,
      xp: 120,
    },
    questions: [
      {
        id: "q1",
        prompt: "Como ler a propriedade virus da amostra?",
        code: "const amostra = { virus: 'Z', nivel: 3 };",
        options: [
          { id: "a", text: "amostra.virus" },
          { id: "b", text: "amostra[virus]" },
          { id: "c", text: "amostra->virus" },
          { id: "d", text: "virus.amostra" },
        ],
        correctOptionId: "a",
        explanation: "Com ponto: amostra.virus. Com colchetes também dá, mas com aspas: amostra['virus']. Sem aspas, virus seria uma variável.",
      },
      {
        id: "q2",
        prompt: "O que é impresso?",
        code: "const sobrevivente = { nome: 'Ana' };\nconsole.log(sobrevivente.idade);",
        options: [
          { id: "a", text: "undefined" },
          { id: "b", text: "null" },
          { id: "c", text: "0" },
          { id: "d", text: "Erro" },
        ],
        correctOptionId: "a",
        explanation: "Ler uma propriedade que não existe não dá erro: devolve undefined.",
      },
      {
        id: "q3",
        prompt: "O que Object.keys devolve aqui?",
        code: "const kit = { agua: 2, lanterna: 1 };\nconsole.log(Object.keys(kit));",
        options: [
          { id: "a", text: "['agua', 'lanterna']" },
          { id: "b", text: "[2, 1]" },
          { id: "c", text: "2" },
          { id: "d", text: "{ agua, lanterna }" },
        ],
        correctOptionId: "a",
        explanation: "Object.keys devolve uma array com os nomes das propriedades. Pros valores, seria Object.values.",
      },
    ],
  },
  {
    title: "A Fuga pelo Loop",
    icon: "🏃",
    difficulty: "medio",
    minLevel: 1,
    description: "Atravesse os corredores cheios de zumbis sem cair num loop sem saída",
    rewardXp: 220,
    rewardCoins: 90,
    rewardItem: {
      name: "Tênis de Fuga",
      icon: "👟",
      description: "O par de tênis mais rápido da academia. Nenhum zumbi alcança quem sabe usar um break na hora certa.",
      rarity: "epico",
      value: 80,
      xp: 0,
    },
    questions: [
      {
        id: "q1",
        prompt: "Quantas vezes 'corre!' é impresso?",
        code: "for (let i = 0; i < 3; i++) {\n  console.log('corre!');\n}",
        options: [
          { id: "a", text: "2" },
          { id: "b", text: "3" },
          { id: "c", text: "4" },
          { id: "d", text: "Pra sempre" },
        ],
        correctOptionId: "b",
        explanation: "i vale 0, 1 e 2; quando chega em 3, a condição i < 3 fica falsa e o loop para: 3 vezes.",
      },
      {
        id: "q2",
        prompt: "O que é impresso?",
        code: "for (const porta of ['trancada', 'aberta', 'trancada']) {\n  if (porta === 'aberta') break;\n  console.log(porta);\n}",
        options: [
          { id: "a", text: "trancada" },
          { id: "b", text: "trancada, aberta" },
          { id: "c", text: "trancada, trancada" },
          { id: "d", text: "Nada" },
        ],
        correctOptionId: "a",
        explanation: "Imprime a primeira porta; na segunda (aberta) o break encerra o loop na hora, então a terceira nunca é vista.",
      },
      {
        id: "q3",
        prompt: "Qual loop percorre os VALORES de uma array?",
        options: [
          { id: "a", text: "for...of" },
          { id: "b", text: "for...in" },
          { id: "c", text: "while (true)" },
          { id: "d", text: "do...until" },
        ],
        correctOptionId: "a",
        explanation: "for...of passa pelos valores; for...in passa pelas chaves (numa array, os índices). do...until não existe em JavaScript.",
      },
    ],
  },
  {
    title: "O Antídoto Final",
    icon: "💉",
    difficulty: "avancado",
    minLevel: 1,
    description: "A última fórmula: segure os erros, some as doses e entenda o tempo do código",
    rewardXp: 300,
    rewardCoins: 120,
    rewardItem: {
      name: "Seringa do Antídoto Z",
      icon: "💉",
      description: "A primeira dose do Antídoto Z, ainda brilhando. Guardada como lembrança do dia em que a academia foi salva.",
      rarity: "lendario",
      value: 200,
      xp: 0,
    },
    questions: [
      {
        id: "q1",
        prompt: "O que é impresso? (a função infectar não existe)",
        code: "try {\n  infectar();\n} catch (erro) {\n  console.log('antídoto!');\n}",
        options: [
          { id: "a", text: "antídoto!" },
          { id: "b", text: "O programa trava com ReferenceError" },
          { id: "c", text: "undefined" },
          { id: "d", text: "Nada" },
        ],
        correctOptionId: "a",
        explanation: "O erro acontece dentro do try, e o catch segura ele antes de travar o programa: imprime antídoto!.",
      },
      {
        id: "q2",
        prompt: "Qual é o total de doses?",
        code: "const doses = [1, 2, 3, 4];\nconst total = doses.reduce((soma, d) => soma + d, 0);\nconsole.log(total);",
        options: [
          { id: "a", text: "10" },
          { id: "b", text: '"1234"' },
          { id: "c", text: "24" },
          { id: "d", text: "[1, 2, 3, 4]" },
        ],
        correctOptionId: "a",
        explanation: "reduce começa em 0 e vai somando cada dose: 0 + 1 + 2 + 3 + 4 = 10.",
      },
      {
        id: "q3",
        prompt: "Em que ordem as letras aparecem?",
        code: "console.log('A');\nsetTimeout(() => console.log('B'), 0);\nconsole.log('C');",
        options: [
          { id: "a", text: "A, C, B" },
          { id: "b", text: "A, B, C" },
          { id: "c", text: "B, A, C" },
          { id: "d", text: "C, B, A" },
        ],
        correctOptionId: "a",
        explanation: "Mesmo com 0 ms, o setTimeout só roda depois que o código atual termina: primeiro A e C, depois B.",
      },
    ],
  },
];

const ZOMBIE: SingleEvent = {
  id: "zumbi",
  icon: "🧟",
  title: "O Surto do Vírus Z",
  tagline: "🧟 Evento Apocalipse Zumbi",
  summary:
    "O Dr. Necrose soltou o Vírus Z no laboratório da CodeGuilds: quem pega só consegue copiar e colar código sem entender nada. Uma horda de zumbis do Ctrl+C, Ctrl+V já toma conta dos corredores!",
  goal: "Vença as missões de sobrevivência, encha os quatro frascos do Antídoto Z e cure a academia inteira.",
  villain: { name: "Dr. Necrose", icon: "🧪", voice: { pitch: 0.55, rate: 1.15 } },
  missionHint: "Missões exclusivas: só existem durante o evento. Cada uma que você vencer enche um frasco do Antídoto Z.",
  finishCall: {
    title: "Todos os frascos do antídoto estão cheios!",
    text: "O Antídoto Z está pronto... Só falta espalhar pela academia pra curar todo mundo e ganhar a recompensa final.",
  },
  intro: [
    {
      art: "cidade",
      speaker: "narrador",
      sound: "alarme",
      text: "Era uma terça-feira comum na CodeGuilds... até que as sirenes do laboratório começaram a tocar. Uma névoa verde escapou pelas janelas, e o céu inteiro ficou da cor de ácido.",
    },
    {
      art: "laboratorio",
      speaker: "mago",
      sound: "plim",
      text: "Aprendiz, rápido, entre aqui! Alguém invadiu o laboratório proibido e quebrou o frasco do Vírus Z. Eu achei que ele estava trancado pra sempre...",
    },
    {
      art: "vilao",
      speaker: "vilao",
      sound: "trovao",
      text: "Hahaha! Fui eu, o Dr. Necrose! Anos atrás eu quis criar um código que nunca morre, e me expulsaram daqui. Agora o meu Vírus Z vai transformar todos vocês em zumbis!",
    },
    {
      art: "horda",
      speaker: "vilao",
      sound: "gemido",
      text: "Quem pega o vírus só consegue copiar e colar código sem entender nada! Olhe pra eles: uma horda inteira de zumbis do Ctrl+C, Ctrl+V vagando pelos corredores!",
    },
    {
      art: "antidoto",
      speaker: "mago",
      sound: "plim",
      text: "Existe uma cura: o Antídoto Z. Pra fabricar, precisamos de quatro fórmulas, e cada uma exige resolver um desafio de verdade, sem copiar e colar. Cada missão que você vencer enche um frasco do antídoto.",
    },
    {
      art: "chamado",
      speaker: "mago",
      sound: "plim",
      text: "Com todos os frascos cheios, espalhamos o antídoto pela academia e curamos todo mundo. Coloque a máscara, aprendiz: a CodeGuilds precisa de você. Sobreviva ao Surto do Vírus Z!",
    },
  ],
  outro: [
    {
      art: "frascos-cheios",
      speaker: "narrador",
      sound: "plim",
      text: "O quarto frasco borbulhou e ficou verde brilhante. O Antídoto Z estava pronto! O Mago despejou tudo na torre de vapor da academia...",
    },
    {
      art: "vilao-derrotado",
      speaker: "vilao",
      sound: "trovao",
      text: "Não! Meu vírus perfeito! Pra trás, fique longe com esse antídoto... Ai, eu tropecei no meu próprio frasco! Estou encolhendo... estou virando um zumbi?!",
    },
    {
      art: "cura",
      speaker: "narrador",
      sound: "sino",
      text: "Uma chuva de antídoto caiu sobre o castelo. Um por um, os zumbis pararam de gemer, piscaram... e voltaram a ser alunos, lembrando de repente como escrever código de verdade. O céu verde foi clareando até ficar azul de novo.",
    },
    {
      art: "recompensa",
      speaker: "mago",
      sound: "fanfarra",
      text: "Você salvou a academia, aprendiz! E o Dr. Necrose? Virou um zumbizinho de bolso, bonzinho depois de uma gota de antídoto, e pediu pra ser o seu mascote. Leve também este tesouro: sobreviventes merecem!",
    },
  ],
  reward: {
    xp: 500,
    coins: 300,
    item: {
      name: "Zumbizinho de Bolso",
      icon: "🧟",
      description:
        "O Dr. Necrose, encolhido pelo próprio vírus e curado com uma gota de antídoto. Agora é bonzinho e jura que vai escrever testes. Equipe no Inventário e ele vira o mascote no seu ombro.",
      rarity: "lendario",
      value: 200,
      xp: 0,
      cosmetic: { slot: "pet", value: "zumbi" },
    },
  },
  presetMissions: ZOMBIE_MISSIONS,
};

// ============================================================================
// 🛸 INVASÃO ALIENÍGENA — A Invasão de Bugzar
// ============================================================================

const ALIEN_MISSIONS: MissionContent[] = [
  {
    title: "Decifrando o Sinal",
    icon: "📡",
    difficulty: "iniciante",
    minLevel: 1,
    description: "Traduza as mensagens de texto que a frota de Bugzar está transmitindo",
    rewardXp: 150,
    rewardCoins: 60,
    rewardItem: {
      name: "Rádio de Ondas Curtas",
      icon: "📻",
      description: "Capta as transmissões da frota inimiga. Chiado de estática, bips e... XP! Usar dá um pouco de XP.",
      rarity: "comum",
      value: 15,
      xp: 60,
    },
    questions: [
      {
        id: "q1",
        prompt: "O que é impresso?",
        code: "const sinal = 'bip';\nconsole.log(sinal.toUpperCase());",
        options: [
          { id: "a", text: "BIP" },
          { id: "b", text: "bip" },
          { id: "c", text: "Bip" },
          { id: "d", text: "Erro" },
        ],
        correctOptionId: "a",
        explanation: "toUpperCase devolve o texto todo em maiúsculas: BIP.",
      },
      {
        id: "q2",
        prompt: "Quantas letras tem a mensagem?",
        code: "const msg = 'ZORG';\nconsole.log(msg.length);",
        options: [
          { id: "a", text: "4" },
          { id: "b", text: "3" },
          { id: "c", text: "5" },
          { id: "d", text: "undefined" },
        ],
        correctOptionId: "a",
        explanation: "length conta os caracteres do texto: Z, O, R, G = 4.",
      },
      {
        id: "q3",
        prompt: "O que a template string imprime?",
        code: "const planeta = 'Bugzar';\nconsole.log(`Vim de ${planeta}!`);",
        options: [
          { id: "a", text: "Vim de Bugzar!" },
          { id: "b", text: "Vim de ${planeta}!" },
          { id: "c", text: "Vim de planeta!" },
          { id: "d", text: "Erro" },
        ],
        correctOptionId: "a",
        explanation: "Com crases (`), o ${...} é trocado pelo valor da variável: Vim de Bugzar!.",
      },
    ],
  },
  {
    title: "O Idioma dos Números",
    icon: "👾",
    difficulty: "iniciante",
    minLevel: 1,
    description: "Os invasores falam em números e operadores: descubra o que eles estão calculando",
    rewardXp: 180,
    rewardCoins: 70,
    rewardItem: {
      name: "Pedaço de Meteorito",
      icon: "☄️",
      description: "Caiu do céu durante a invasão, ainda quentinho. Usar libera a energia do espaço em XP.",
      rarity: "raro",
      value: 30,
      xp: 120,
    },
    questions: [
      {
        id: "q1",
        prompt: "Qual é o resultado?",
        code: "console.log(7 % 2);",
        options: [
          { id: "a", text: "1" },
          { id: "b", text: "3.5" },
          { id: "c", text: "3" },
          { id: "d", text: "0" },
        ],
        correctOptionId: "a",
        explanation: "% é o resto da divisão: 7 dividido por 2 dá 3 e sobra 1.",
      },
      {
        id: "q2",
        prompt: "O que Math.max devolve?",
        code: "console.log(Math.max(3, 9, 4));",
        options: [
          { id: "a", text: "9" },
          { id: "b", text: "3" },
          { id: "c", text: "16" },
          { id: "d", text: "[3, 9, 4]" },
        ],
        correctOptionId: "a",
        explanation: "Math.max devolve o maior dos números recebidos: 9.",
      },
      {
        id: "q3",
        prompt: "E essa mistura de texto com número?",
        code: "console.log('2' + 2);",
        options: [
          { id: "a", text: "'22'" },
          { id: "b", text: "4" },
          { id: "c", text: "NaN" },
          { id: "d", text: "Erro" },
        ],
        correctOptionId: "a",
        explanation: "Quando um dos lados do + é texto, o JavaScript junta os dois como texto: '22'.",
      },
    ],
  },
  {
    title: "A Cabine de Comando",
    icon: "🛸",
    difficulty: "medio",
    minLevel: 1,
    description: "Invada a nave inimiga e decida o caminho certo com ternário, switch e ??",
    rewardXp: 220,
    rewardCoins: 90,
    rewardItem: {
      name: "Telescópio de Bolso",
      icon: "🔭",
      description: "Enxerga discos voadores a anos-luz de distância, e também bugs escondidos no seu código.",
      rarity: "epico",
      value: 80,
      xp: 0,
    },
    questions: [
      {
        id: "q1",
        prompt: "O que é impresso?",
        code: "const energia = 80;\nconst status = energia > 50 ? 'escudo ativo' : 'perigo';\nconsole.log(status);",
        options: [
          { id: "a", text: "escudo ativo" },
          { id: "b", text: "perigo" },
          { id: "c", text: "true" },
          { id: "d", text: "80" },
        ],
        correctOptionId: "a",
        explanation: "O ternário condição ? a : b escolhe a quando a condição é verdadeira: 80 > 50, então 'escudo ativo'.",
      },
      {
        id: "q2",
        prompt: "O que o switch imprime?",
        code: "const cor = 'verde';\nswitch (cor) {\n  case 'verde':\n    console.log('alien');\n    break;\n  default:\n    console.log('humano');\n}",
        options: [
          { id: "a", text: "alien" },
          { id: "b", text: "humano" },
          { id: "c", text: "alien e humano" },
          { id: "d", text: "Nada" },
        ],
        correctOptionId: "a",
        explanation: "O case 'verde' bate com a cor, imprime alien e o break sai do switch antes do default.",
      },
      {
        id: "q3",
        prompt: "O que é impresso?",
        code: "const nome = null;\nconsole.log(nome ?? 'visitante');",
        options: [
          { id: "a", text: "visitante" },
          { id: "b", text: "null" },
          { id: "c", text: "undefined" },
          { id: "d", text: "Erro" },
        ],
        correctOptionId: "a",
        explanation: "O ?? usa o valor da direita quando o da esquerda é null ou undefined: 'visitante'.",
      },
    ],
  },
  {
    title: "O Protocolo do Escudo",
    icon: "🛡️",
    difficulty: "avancado",
    minLevel: 1,
    description: "A última defesa: classes, JSON e desestruturação pra erguer o Escudo Arcano",
    rewardXp: 300,
    rewardCoins: 120,
    rewardItem: {
      name: "Núcleo do Escudo Arcano",
      icon: "💠",
      description: "O coração do escudo que salvou a Terra. Ainda vibra com energia azul quando alguém escreve código bom por perto.",
      rarity: "lendario",
      value: 200,
      xp: 0,
    },
    questions: [
      {
        id: "q1",
        prompt: "O que é impresso?",
        code: "class Nave {\n  constructor(nome) {\n    this.nome = nome;\n  }\n}\nconst n = new Nave('Zorg-1');\nconsole.log(n.nome);",
        options: [
          { id: "a", text: "Zorg-1" },
          { id: "b", text: "Nave" },
          { id: "c", text: "undefined" },
          { id: "d", text: "Erro" },
        ],
        correctOptionId: "a",
        explanation: "new Nave('Zorg-1') chama o constructor, que guarda o nome em this.nome: Zorg-1.",
      },
      {
        id: "q2",
        prompt: "Qual é o tipo de txt?",
        code: "const txt = JSON.stringify({ planeta: 'Terra' });\nconsole.log(typeof txt);",
        options: [
          { id: "a", text: '"string"' },
          { id: "b", text: '"object"' },
          { id: "c", text: '"json"' },
          { id: "d", text: '"undefined"' },
        ],
        correctOptionId: "a",
        explanation: "JSON.stringify transforma o objeto em texto (string) pra ser enviado ou guardado. JSON.parse faz o caminho de volta.",
      },
      {
        id: "q3",
        prompt: "O que é impresso?",
        code: "const { escudo, energia } = { escudo: 'on', energia: 100 };\nconsole.log(energia);",
        options: [
          { id: "a", text: "100" },
          { id: "b", text: "'on'" },
          { id: "c", text: "undefined" },
          { id: "d", text: "Erro" },
        ],
        correctOptionId: "a",
        explanation: "A desestruturação cria variáveis com os mesmos nomes das propriedades: energia recebe 100.",
      },
    ],
  },
];

const ALIEN: SingleEvent = {
  id: "alien",
  icon: "🛸",
  title: "A Invasão de Bugzar",
  tagline: "🛸 Evento Invasão Alienígena",
  summary:
    "Uma frota de discos voadores do planeta Bugzar cercou a CodeGuilds! O Imperador Zorg quer roubar o Código-Fonte do Universo e está abduzindo os alunos com o raio trator.",
  goal: "Vença as missões de defesa, carregue os Cristais de Energia e erga o Escudo Arcano pra expulsar a frota invasora.",
  villain: { name: "Imperador Zorg", icon: "👾", voice: { pitch: 1.9, rate: 0.9 } },
  missionHint: "Missões exclusivas: só existem durante o evento. Cada uma que você vencer carrega um Cristal de Energia do escudo.",
  finishCall: {
    title: "Todos os cristais de energia estão carregados!",
    text: "O Escudo Arcano está pronto pra subir... Só falta ativá-lo pra expulsar a frota e ganhar a recompensa final.",
  },
  intro: [
    {
      art: "ceu",
      speaker: "narrador",
      sound: "ovni",
      text: "Era uma noite tranquila de estudos na CodeGuilds, até que o céu se encheu de luzes coloridas. Dezenas de discos voadores surgiram entre as estrelas, piscando e zumbindo sobre as torres do castelo.",
    },
    {
      art: "observatorio",
      speaker: "mago",
      sound: "plim",
      text: "Pelas barbas do compilador! Aprendiz, olhe pela janela do observatório! Isso não é chuva de meteoros... é uma frota inteira vindo de outra galáxia!",
    },
    {
      art: "imperador",
      speaker: "vilao",
      sound: "laser",
      text: "Saudações, terráqueos! Eu sou o Imperador Zorg, do planeta Bugzar. Viemos buscar o Código-Fonte do Universo, que vocês escondem neste castelo. Entreguem, ou abduziremos todos!",
    },
    {
      art: "abducao",
      speaker: "vilao",
      sound: "ovni",
      text: "Meus discos já estão abduzindo os seus alunos com o raio trator! E o meu feitiço de Ctrl+X está recortando tudo o que eles aprenderam. Logo este planeta não vai saber escrever nem um Hello World!",
    },
    {
      art: "escudo",
      speaker: "mago",
      sound: "plim",
      text: "Ainda há esperança: o Escudo Arcano da academia! Ele é alimentado por Cristais de Energia, e cada cristal só se acende quando alguém resolve um desafio de programação. Cada missão que você vencer carrega um cristal.",
    },
    {
      art: "chamado",
      speaker: "mago",
      sound: "plim",
      text: "Com todos os cristais carregados, o escudo se ergue e manda os invasores de volta pra casa. Vista o traje espacial, aprendiz: a Terra conta com você. Defenda a CodeGuilds da invasão!",
    },
  ],
  outro: [
    {
      art: "cristais",
      speaker: "narrador",
      sound: "plim",
      text: "O último cristal brilhou. Uma cúpula de energia azul subiu do castelo e cobriu o céu inteiro, e os raios tratores se apagaram de uma vez.",
    },
    {
      art: "imperador-derrotado",
      speaker: "vilao",
      sound: "laser",
      text: "Impossível! O escudo refletiu o meu Ctrl+X de volta pra minha nave! Estou sendo recortado... encolhendo... Ativar retirada! Retiradaaa!",
    },
    {
      art: "partida",
      speaker: "narrador",
      sound: "ovni",
      text: "A frota fugiu em disparada pro fundo do espaço, e os alunos abduzidos desceram devagarinho, sãos e salvos, lembrando de tudo o que tinham aprendido. Mas um pequeno disco ficou pra trás...",
    },
    {
      art: "recompensa",
      speaker: "mago",
      sound: "fanfarra",
      text: "Você salvou a Terra, aprendiz! E olha só quem a frota esqueceu: o Imperador Zorg, pequenininho depois do próprio feitiço. Ele disse bip-bop, que quer dizer que agora quer ser o seu mascote. Leve também este tesouro, direto de Bugzar!",
    },
  ],
  reward: {
    xp: 500,
    coins: 300,
    item: {
      name: "Alienzinho de Bugzar",
      icon: "👽",
      description:
        "O Imperador Zorg, recortado pelo próprio Ctrl+X até ficar do tamanho de uma mão. Esqueceu o plano de invasão e agora só quer aprender a programar com você. Equipe no Inventário e ele vira o mascote no seu ombro.",
      rarity: "lendario",
      value: 200,
      xp: 0,
      cosmetic: { slot: "pet", value: "alien" },
    },
  },
  presetMissions: ALIEN_MISSIONS,
};

// ============================================================================
// 🎄 NATAL — O Resgate do Papai Noel (evento em 3 fases, uma por semana)
// ============================================================================

const NATAL_FASE1_MISSIONS: MissionContent[] = [
  {
    title: "O Rastro na Neve",
    icon: "🐾",
    difficulty: "iniciante",
    minLevel: 1,
    description: "Siga as pegadas do sequestrador e descubra o que as variáveis guardam",
    rewardXp: 150,
    rewardCoins: 60,
    rewardItem: {
      name: "Biscoito da Ceia",
      icon: "🍪",
      description: "Um dos biscoitos que os alunos deixaram pro Papai Noel. Ainda está quentinho! Comer (usar) dá XP.",
      rarity: "comum",
      value: 15,
      xp: 60,
    },
    questions: [
      {
        id: "q1",
        prompt: "O que acontece quando esse código roda?",
        code: "const treno = 'vermelho';\ntreno = 'azul';",
        options: [
          { id: "a", text: "Dá erro: const não pode receber outro valor" },
          { id: "b", text: "treno passa a valer 'azul'" },
          { id: "c", text: "treno passa a valer 'vermelho azul'" },
          { id: "d", text: "Nada, a segunda linha é ignorada" },
        ],
        correctOptionId: "a",
        explanation: "Variável criada com const não pode ser reatribuída: o JavaScript dá TypeError. Pra mudar o valor depois, use let.",
      },
      {
        id: "q2",
        prompt: "O que typeof devolve aqui?",
        code: "const diaDoNatal = 25;\nconsole.log(typeof diaDoNatal);",
        options: [
          { id: "a", text: '"number"' },
          { id: "b", text: '"string"' },
          { id: "c", text: '"natal"' },
          { id: "d", text: '"undefined"' },
        ],
        correctOptionId: "a",
        explanation: "25 escrito sem aspas é um número, então typeof devolve \"number\". Com aspas ('25'), seria \"string\".",
      },
      {
        id: "q3",
        prompt: "Quantos presentes ficam no final?",
        code: "let presentes = 3;\npresentes = presentes + 2;\nconsole.log(presentes);",
        options: [
          { id: "a", text: "5" },
          { id: "b", text: "3" },
          { id: "c", text: "32" },
          { id: "d", text: "Erro" },
        ],
        correctOptionId: "a",
        explanation: "Com let dá pra trocar o valor: presentes era 3 e recebeu 3 + 2, então vale 5.",
      },
    ],
  },
  {
    title: "A Lista do Papai Noel",
    icon: "📜",
    difficulty: "iniciante",
    minLevel: 1,
    description: "Leia a lista de presentes que o Lorde Glacius deixou cair na fuga",
    rewardXp: 180,
    rewardCoins: 70,
    rewardItem: {
      name: "Cartinha Perdida",
      icon: "💌",
      description: "Uma cartinha pro Papai Noel achada no meio da neve. Ler (usar) enche o coração de espírito natalino e de XP.",
      rarity: "raro",
      value: 30,
      xp: 120,
    },
    questions: [
      {
        id: "q1",
        prompt: "Qual é o primeiro presente da lista?",
        code: "const lista = ['bola', 'boneca', 'robô'];\nconsole.log(lista[0]);",
        options: [
          { id: "a", text: "bola" },
          { id: "b", text: "boneca" },
          { id: "c", text: "robô" },
          { id: "d", text: "undefined" },
        ],
        correctOptionId: "a",
        explanation: "As posições de uma array começam do 0: lista[0] é o primeiro item, a bola.",
      },
      {
        id: "q2",
        prompt: "Quantos presentes tem na lista?",
        code: "const lista = ['bola', 'boneca', 'robô'];\nconsole.log(lista.length);",
        options: [
          { id: "a", text: "3" },
          { id: "b", text: "2" },
          { id: "c", text: "4" },
          { id: "d", text: "'robô'" },
        ],
        correctOptionId: "a",
        explanation: "length conta quantos itens a array tem: 3. O último índice é 2, porque começa do 0.",
      },
      {
        id: "q3",
        prompt: "O pião está na lista?",
        code: "const lista = ['bola', 'boneca', 'robô'];\nconsole.log(lista.includes('pião'));",
        options: [
          { id: "a", text: "false" },
          { id: "b", text: "true" },
          { id: "c", text: "-1" },
          { id: "d", text: "'pião'" },
        ],
        correctOptionId: "a",
        explanation: "includes devolve true ou false dizendo se o item está na array. O pião não está, então é false.",
      },
    ],
  },
  {
    title: "O Mistério do Trenó",
    icon: "🛷",
    difficulty: "medio",
    minLevel: 1,
    description: "Descubra com if, else, && e || por que o trenó não conseguiu decolar",
    rewardXp: 220,
    rewardCoins: 90,
    rewardItem: {
      name: "Guizo de Prata do Trenó",
      icon: "🔔",
      description: "Caiu do trenó na hora do sequestro. Toca sozinho quando alguém por perto acerta um if difícil.",
      rarity: "epico",
      value: 80,
      xp: 0,
    },
    questions: [
      {
        id: "q1",
        prompt: "O trenó decola?",
        code: "const renas = 8;\nif (renas >= 9) {\n  console.log('decola!');\n} else {\n  console.log('fica no chão');\n}",
        options: [
          { id: "a", text: "fica no chão" },
          { id: "b", text: "decola!" },
          { id: "c", text: "As duas mensagens" },
          { id: "d", text: "Nada" },
        ],
        correctOptionId: "a",
        explanation: "8 >= 9 é falso, então o if não roda e o else imprime 'fica no chão'. Faltou uma rena!",
      },
      {
        id: "q2",
        prompt: "O que é impresso?",
        code: "const nevando = true;\nconst ventando = false;\nconsole.log(nevando && ventando);",
        options: [
          { id: "a", text: "false" },
          { id: "b", text: "true" },
          { id: "c", text: "nevando" },
          { id: "d", text: "Erro" },
        ],
        correctOptionId: "a",
        explanation: "O && só dá true quando os dois lados são verdadeiros. ventando é false, então o resultado é false.",
      },
      {
        id: "q3",
        prompt: "E agora, com o OU?",
        code: "const noite = true;\nconst nevando = false;\nconsole.log(noite || nevando);",
        options: [
          { id: "a", text: "true" },
          { id: "b", text: "false" },
          { id: "c", text: "undefined" },
          { id: "d", text: "Erro" },
        ],
        correctOptionId: "a",
        explanation: "O || dá true se pelo menos um lado for verdadeiro. noite é true, então o resultado é true.",
      },
    ],
  },
];

const NATAL_FASE2_MISSIONS: MissionContent[] = [
  {
    title: "A Trilha das Estrelas",
    icon: "⭐",
    difficulty: "iniciante",
    minLevel: 1,
    description: "Conte os passos pela neve com loops e não se perca no caminho",
    rewardXp: 170,
    rewardCoins: 70,
    rewardItem: {
      name: "Chocolate Quente da Oficina",
      icon: "☕",
      description: "Servido pelos elfos pra esquentar os viajantes. Beber (usar) espanta o frio e dá XP.",
      rarity: "comum",
      value: 15,
      xp: 70,
    },
    questions: [
      {
        id: "q1",
        prompt: "Quantas estrelas são impressas?",
        code: "for (let i = 1; i <= 4; i++) {\n  console.log('estrela');\n}",
        options: [
          { id: "a", text: "4" },
          { id: "b", text: "3" },
          { id: "c", text: "5" },
          { id: "d", text: "Pra sempre" },
        ],
        correctOptionId: "a",
        explanation: "i vale 1, 2, 3 e 4 (o <= inclui o 4). Quando chega em 5, o loop para: 4 estrelas.",
      },
      {
        id: "q2",
        prompt: "Quantos passos a Cometa deu?",
        code: "let passos = 0;\nwhile (passos < 3) {\n  passos++;\n}\nconsole.log(passos);",
        options: [
          { id: "a", text: "3" },
          { id: "b", text: "2" },
          { id: "c", text: "4" },
          { id: "d", text: "0" },
        ],
        correctOptionId: "a",
        explanation: "O while repete enquanto passos < 3: vai pra 1, 2 e 3. Com 3, a condição fica falsa e o loop para.",
      },
      {
        id: "q3",
        prompt: "Qual é o total?",
        code: "let total = 0;\nfor (let i = 1; i <= 3; i++) {\n  total += i;\n}\nconsole.log(total);",
        options: [
          { id: "a", text: "6" },
          { id: "b", text: "3" },
          { id: "c", text: "123" },
          { id: "d", text: "0" },
        ],
        correctOptionId: "a",
        explanation: "O += vai somando: 0 + 1 + 2 + 3 = 6.",
      },
    ],
  },
  {
    title: "A Oficina dos Elfos",
    icon: "🧝",
    difficulty: "medio",
    minLevel: 1,
    description: "Conserte as máquinas congeladas da oficina escrevendo funções",
    rewardXp: 200,
    rewardCoins: 80,
    rewardItem: {
      name: "Martelinho de Elfo",
      icon: "🔨",
      description: "A ferramenta favorita dos elfos da oficina. Consertar um brinquedo com ele (usar) dá um bom tanto de XP.",
      rarity: "raro",
      value: 30,
      xp: 120,
    },
    questions: [
      {
        id: "q1",
        prompt: "O que a máquina de embrulhar devolve?",
        code: "function embrulhar(brinquedo) {\n  return 'presente: ' + brinquedo;\n}\nconsole.log(embrulhar('pião'));",
        options: [
          { id: "a", text: "presente: pião" },
          { id: "b", text: "pião" },
          { id: "c", text: "presente: brinquedo" },
          { id: "d", text: "undefined" },
        ],
        correctOptionId: "a",
        explanation: "A função recebe 'pião' no parâmetro brinquedo e devolve o texto juntado: 'presente: pião'.",
      },
      {
        id: "q2",
        prompt: "E se ninguém passar o nome?",
        code: "function saudar(nome = 'elfo') {\n  return 'Oi, ' + nome + '!';\n}\nconsole.log(saudar());",
        options: [
          { id: "a", text: "Oi, elfo!" },
          { id: "b", text: "Oi, undefined!" },
          { id: "c", text: "Oi, !" },
          { id: "d", text: "Erro" },
        ],
        correctOptionId: "a",
        explanation: "nome = 'elfo' é um valor padrão: quando a função é chamada sem argumento, nome vale 'elfo'.",
      },
      {
        id: "q3",
        prompt: "O que o join monta?",
        code: "const brinquedos = ['carrinho', 'boneca'];\nconsole.log(brinquedos.join(' e '));",
        options: [
          { id: "a", text: "carrinho e boneca" },
          { id: "b", text: "['carrinho', 'boneca']" },
          { id: "c", text: "carrinhoboneca" },
          { id: "d", text: "carrinho, boneca" },
        ],
        correctOptionId: "a",
        explanation: "join junta os itens da array num texto só, com o separador escolhido no meio: 'carrinho e boneca'.",
      },
    ],
  },
  {
    title: "A Dança da Aurora",
    icon: "🌌",
    difficulty: "medio",
    minLevel: 1,
    description: "Transforme, filtre e teste as luzes da aurora com map, filter e every",
    rewardXp: 240,
    rewardCoins: 100,
    rewardItem: {
      name: "Frasco de Luz da Aurora",
      icon: "🔮",
      description: "Um vidrinho com um pedaço da aurora boreal dentro. As cores mudam sozinhas: verde, rosa, azul...",
      rarity: "epico",
      value: 80,
      xp: 0,
    },
    questions: [
      {
        id: "q1",
        prompt: "O que o map devolve?",
        code: "const brilho = [1, 2, 3];\nconsole.log(brilho.map(b => b * 10));",
        options: [
          { id: "a", text: "[10, 20, 30]" },
          { id: "b", text: "[1, 2, 3]" },
          { id: "c", text: "60" },
          { id: "d", text: "[11, 12, 13]" },
        ],
        correctOptionId: "a",
        explanation: "map cria uma array nova aplicando a função em cada item: cada brilho vezes 10.",
      },
      {
        id: "q2",
        prompt: "Quantas luzes verdes tem?",
        code: "const luzes = ['verde', 'rosa', 'verde', 'azul'];\nconsole.log(luzes.filter(c => c === 'verde').length);",
        options: [
          { id: "a", text: "2" },
          { id: "b", text: "1" },
          { id: "c", text: "4" },
          { id: "d", text: "'verde'" },
        ],
        correctOptionId: "a",
        explanation: "filter devolve só as luzes que passaram no teste (['verde', 'verde']) e o length conta: 2.",
      },
      {
        id: "q3",
        prompt: "Está fazendo frio em todas as cidades do Polo Norte?",
        code: "const temperaturas = [-5, -12, -3];\nconsole.log(temperaturas.every(t => t < 0));",
        options: [
          { id: "a", text: "true" },
          { id: "b", text: "false" },
          { id: "c", text: "[-5, -12, -3]" },
          { id: "d", text: "-12" },
        ],
        correctOptionId: "a",
        explanation: "every devolve true só se TODOS os itens passam no teste. Todas as temperaturas são menores que 0: true.",
      },
    ],
  },
];

const NATAL_FASE3_MISSIONS: MissionContent[] = [
  {
    title: "O Selo dos Objetos Congelados",
    icon: "🧊",
    difficulty: "medio",
    minLevel: 1,
    description: "Quebre o primeiro Selo de Gelo lendo e mudando as propriedades dos objetos",
    rewardXp: 220,
    rewardCoins: 90,
    rewardItem: {
      name: "Chave de Gelo",
      icon: "🗝️",
      description: "Abre qualquer porta da Fortaleza de Gelo. Derreter a chave (usar) libera a magia dela em XP.",
      rarity: "raro",
      value: 35,
      xp: 130,
    },
    questions: [
      {
        id: "q1",
        prompt: "Quantas renas ficam?",
        code: "const noel = { nome: 'Noel', renas: 9 };\nnoel.renas = noel.renas - 1;\nconsole.log(noel.renas);",
        options: [
          { id: "a", text: "8" },
          { id: "b", text: "9" },
          { id: "c", text: "Erro: noel é const" },
          { id: "d", text: "undefined" },
        ],
        correctOptionId: "a",
        explanation: "O const impede trocar o objeto inteiro, mas dá pra mudar as propriedades dele: renas vira 8.",
      },
      {
        id: "q2",
        prompt: "Quantas propriedades o selo tem agora?",
        code: "const selo = { cor: 'azul' };\nselo.aberto = true;\nconsole.log(Object.keys(selo).length);",
        options: [
          { id: "a", text: "2" },
          { id: "b", text: "1" },
          { id: "c", text: "true" },
          { id: "d", text: "Erro" },
        ],
        correctOptionId: "a",
        explanation: "Atribuir uma propriedade que não existia cria ela: o selo fica com cor e aberto, 2 chaves.",
      },
      {
        id: "q3",
        prompt: "O que a desestruturação pega?",
        code: "const { nome } = { nome: 'Glacius', idade: 300 };\nconsole.log(nome);",
        options: [
          { id: "a", text: "Glacius" },
          { id: "b", text: "300" },
          { id: "c", text: "{ nome: 'Glacius' }" },
          { id: "d", text: "undefined" },
        ],
        correctOptionId: "a",
        explanation: "{ nome } cria uma variável nome com o valor da propriedade de mesmo nome: 'Glacius'.",
      },
    ],
  },
  {
    title: "O Selo dos Bonecos de Neve",
    icon: "⛄",
    difficulty: "avancado",
    minLevel: 1,
    description: "Derrote os Bonecos de Neve Bugados com classes e try/catch",
    rewardXp: 260,
    rewardCoins: 110,
    rewardItem: {
      name: "Cenoura Mágica",
      icon: "🥕",
      description: "O nariz de um Boneco de Neve Bugado que voltou a ser bonzinho. Brilha em laranja quando está perto de um bug.",
      rarity: "epico",
      value: 90,
      xp: 0,
    },
    questions: [
      {
        id: "q1",
        prompt: "O que é impresso?",
        code: "class BonecoDeNeve {\n  constructor(nome) {\n    this.nome = nome;\n  }\n  derreter() {\n    return this.nome + ' derreteu!';\n  }\n}\nconst b = new BonecoDeNeve('Bugado');\nconsole.log(b.derreter());",
        options: [
          { id: "a", text: "Bugado derreteu!" },
          { id: "b", text: "BonecoDeNeve derreteu!" },
          { id: "c", text: "undefined derreteu!" },
          { id: "d", text: "Erro" },
        ],
        correctOptionId: "a",
        explanation: "new chama o constructor, que guarda 'Bugado' em this.nome; o método derreter usa esse this.nome.",
      },
      {
        id: "q2",
        prompt: "O que o catch imprime?",
        code: "try {\n  throw new Error('gelo demais');\n} catch (erro) {\n  console.log(erro.message);\n}",
        options: [
          { id: "a", text: "gelo demais" },
          { id: "b", text: "Error" },
          { id: "c", text: "O programa trava" },
          { id: "d", text: "undefined" },
        ],
        correctOptionId: "a",
        explanation: "throw lança o erro, o catch segura ele e erro.message é o texto que foi passado: 'gelo demais'.",
      },
      {
        id: "q3",
        prompt: "Qual é o tipo de um boneco criado com new?",
        code: "const b = new BonecoDeNeve('Flocos');\nconsole.log(typeof b);",
        options: [
          { id: "a", text: '"object"' },
          { id: "b", text: '"BonecoDeNeve"' },
          { id: "c", text: '"class"' },
          { id: "d", text: '"function"' },
        ],
        correctOptionId: "a",
        explanation: "Tudo que o new cria a partir de uma classe é um objeto: typeof devolve \"object\".",
      },
    ],
  },
  {
    title: "O Selo do Coração de Gelo",
    icon: "💙",
    difficulty: "avancado",
    minLevel: 1,
    description: "O último selo: spread, a ordem do tempo no código e um sort cheio de truques",
    rewardXp: 300,
    rewardCoins: 130,
    rewardItem: {
      name: "Coração de Gelo Derretido",
      icon: "💧",
      description: "O que sobrou do último Selo de Gelo: uma gota quentinha que nunca congela de novo. Lembrança do dia em que o Natal foi salvo.",
      rarity: "lendario",
      value: 200,
      xp: 0,
    },
    questions: [
      {
        id: "q1",
        prompt: "O que o spread monta?",
        code: "const saco = ['bola', 'pião'];\nconst novo = [...saco, 'robô'];\nconsole.log(novo);",
        options: [
          { id: "a", text: "['bola', 'pião', 'robô']" },
          { id: "b", text: "[['bola', 'pião'], 'robô']" },
          { id: "c", text: "['robô']" },
          { id: "d", text: "Erro" },
        ],
        correctOptionId: "a",
        explanation: "O ... espalha os itens de saco dentro da array nova, e o 'robô' entra no fim.",
      },
      {
        id: "q2",
        prompt: "Em que ordem os números aparecem?",
        code: "console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');",
        options: [
          { id: "a", text: "1, 4, 3, 2" },
          { id: "b", text: "1, 2, 3, 4" },
          { id: "c", text: "1, 4, 2, 3" },
          { id: "d", text: "4, 3, 2, 1" },
        ],
        correctOptionId: "a",
        explanation: "Primeiro roda o código normal (1 e 4). Depois a Promise (3), que tem prioridade, e por último o setTimeout (2).",
      },
      {
        id: "q3",
        prompt: "O truque final do Lorde Glacius: o que o sort faz?",
        code: "const idades = [10, 2, 33];\nidades.sort();\nconsole.log(idades);",
        options: [
          { id: "a", text: "[10, 2, 33]" },
          { id: "b", text: "[2, 10, 33]" },
          { id: "c", text: "[33, 10, 2]" },
          { id: "d", text: "Erro" },
        ],
        correctOptionId: "a",
        explanation: "Sem função, o sort compara como texto: '10' vem antes de '2' (o '1' é menor que o '2'). Pra ordenar números, use sort((a, b) => a - b).",
      },
    ],
  },
];

const NATAL: PhasedEvent = {
  id: "natal",
  icon: "🎅",
  title: "O Resgate do Papai Noel",
  tagline: "🎄 Evento de Natal • 3 fases",
  summary:
    "Na noite em que o Papai Noel visitaria a CodeGuilds, o Lorde Glacius, o Senhor do Inverno Eterno, congelou o trenó e sequestrou o bom velhinho! Uma trilha em três fases, do pátio do castelo até a Fortaleza de Gelo no Polo Norte.",
  goal: "Complete as três fases da trilha e resgate o Papai Noel antes da noite de Natal. Cada fase concluída vale um item lendário!",
  villain: { name: "Lorde Glacius", icon: "❄️", voice: { pitch: 0.35, rate: 0.82 } },
  phases: [
    {
      number: 1,
      icon: "🛷",
      title: "O Sequestro",
      summary:
        "O trenó caiu no pátio e os presentes se espalharam pela academia, todos congelados. Descongele os presentes e junte as pistas pra descobrir pra onde o Lorde Glacius levou o Papai Noel.",
      goal: "Descongele os presentes espalhados pelo pátio e junte as pistas do sequestro.",
      missionHint: "Cada missão que você vencer descongela um presente, e dentro de cada presente há uma pista.",
      finishCall: {
        title: "Todos os presentes descongelaram!",
        text: "As pistas estão juntas... Só falta abrir o último presente pra descobrir o caminho e ganhar o item lendário da Fase 1.",
      },
      intro: [
        {
          art: "vila",
          speaker: "narrador",
          sound: "sino",
          text: "Era dezembro na CodeGuilds. As torres ganharam guirlandas, os corredores se encheram de luzinhas e um pinheiro gigante brilhava no pátio. Naquela noite, o Papai Noel viria visitar a academia, como faz todo ano...",
        },
        {
          art: "treno",
          speaker: "narrador",
          sound: "guizos",
          text: "À meia-noite, um som de guizos encheu o céu. Lá vinha o trenó do Papai Noel, puxado pelas renas e carregado de presentes pra todos os alunos!",
        },
        {
          art: "glacius",
          speaker: "vilao",
          sound: "vento",
          text: "Hohoho? Não, não, não! Este ano não vai ter Natal! Eu sou o Lorde Glacius, o Senhor do Inverno Eterno, e esta nevasca é minha!",
        },
        {
          art: "sequestro",
          speaker: "vilao",
          sound: "trovao",
          text: "Cem anos atrás eu mandei uma cartinha pro Papai Noel, e ela nunca chegou. Nenhum presente, nunca! Pois agora ninguém mais vai ganhar: vou levar o Papai Noel pra minha Fortaleza de Gelo e congelar o Natal pra sempre!",
        },
        {
          art: "presentes",
          speaker: "mago",
          sound: "plim",
          text: "Aprendiz, rápido! O trenó caiu no pátio e os presentes se espalharam pela academia, todos congelados. Mas veja: cada presente guarda uma pista. Se descongelarmos todos, vamos descobrir pra onde o Glacius levou o Papai Noel!",
        },
        {
          art: "chamado-1",
          speaker: "mago",
          sound: "plim",
          text: "Cada missão que você vencer descongela um presente. Esta é só a primeira fase da trilha: a cada semana, uma fase nova, até a noite de Natal. Enrole o cachecol, aprendiz: vamos resgatar o Papai Noel!",
        },
      ],
      outro: [
        {
          art: "mapa",
          speaker: "narrador",
          sound: "plim",
          text: "O último presente descongelou e, dentro dele, havia um mapa desenhado com luz: uma trilha de estrelas que atravessava as Terras Geladas até o Polo Norte, lá onde o céu dança em cores.",
        },
        {
          art: "glacius-eco",
          speaker: "vilao",
          sound: "vento",
          text: "Então acharam o meu rastro? Não importa! Ninguém atravessa as Terras Geladas sem virar picolé. Hahaha! Tentem a sorte, se tiverem coragem...",
        },
        {
          art: "cometa",
          speaker: "narrador",
          sound: "guizos",
          text: "Entre os destroços do trenó, uma renazinha tremia de frio. Era a Cometa, a rena mais nova do Papai Noel, que tinha se escondido durante o sequestro. Quando viu o mapa, a estrela entre os chifres dela brilhou forte.",
        },
        {
          art: "recompensa-1",
          speaker: "mago",
          sound: "fanfarra",
          text: "A Cometa quer ir com você e mostrar o caminho do Polo Norte! Ela é o seu prêmio lendário desta fase. Descanse bem, aprendiz: na próxima fase, partimos pra jornada!",
        },
      ],
      reward: {
        xp: 250,
        coins: 150,
        item: {
          name: "Cometa, a Renazinha Estelar",
          icon: "🦌",
          description:
            "A rena mais nova do trenó do Papai Noel, com uma estrela que brilha entre os chifres. Ela conhece o caminho do Polo Norte e agora te segue pra todo lado. Equipe no Inventário e ela vira o mascote no seu ombro.",
          rarity: "lendario",
          value: 200,
          xp: 0,
          cosmetic: { slot: "pet", value: "cometa" },
        },
      },
      presetMissions: NATAL_FASE1_MISSIONS,
    },
    {
      number: 2,
      icon: "🌌",
      title: "A Jornada ao Polo Norte",
      summary:
        "No Polo Norte, a aurora boreal, a luz do espírito do Natal, está se apagando. Reacenda as Estrelas da Aurora pra iluminar o caminho até a fortaleza escondida do Lorde Glacius.",
      goal: "Reacenda as Estrelas da Aurora e encontre o caminho até a Fortaleza de Gelo.",
      missionHint: "Cada missão que você vencer reacende uma Estrela da Aurora e ilumina mais um trecho do caminho.",
      finishCall: {
        title: "Todas as estrelas da aurora brilham!",
        text: "O caminho está iluminado... Só falta seguir a luz até o fim pra encontrar a fortaleza e ganhar o item lendário da Fase 2.",
      },
      intro: [
        {
          art: "viagem",
          speaker: "narrador",
          sound: "guizos",
          text: "Com o trenó consertado e a Cometa na frente, o aprendiz partiu. Voaram sobre florestas de pinheiros, lagos congelados e montanhas de neve, até o fim do mapa: o Polo Norte!",
        },
        {
          art: "aurora",
          speaker: "narrador",
          sound: "vento",
          text: "Lá, o céu dançava em cores: verde, rosa e azul. Era a aurora boreal, a luz do próprio espírito do Natal. Mas ela estava fraca, piscando, quase apagando...",
        },
        {
          art: "oficina",
          speaker: "mago",
          sound: "plim",
          text: "A oficina dos elfos está toda congelada! Sem a luz da aurora, as máquinas de brinquedos pararam e os elfos não conseguem trabalhar. O feitiço do Glacius está roubando a alegria do Natal!",
        },
        {
          art: "glacius-aurora",
          speaker: "vilao",
          sound: "vento",
          text: "Cada luz que se apaga deixa a minha fortaleza mais escondida. Quando a última estrela sumir do céu, o inverno será eterno e o Natal nunca mais vai chegar! Hahaha!",
        },
        {
          art: "estrelas",
          speaker: "mago",
          sound: "plim",
          text: "Os elfos guardam as Estrelas da Aurora, mas só quem resolve desafios de código consegue reacendê-las. Cada missão que você vencer acende uma estrela e ilumina mais um trecho do caminho. Siga a luz, aprendiz!",
        },
      ],
      outro: [
        {
          art: "aurora-viva",
          speaker: "narrador",
          sound: "plim",
          text: "A última estrela se acendeu e a aurora explodiu em cores, mais forte do que nunca. As máquinas da oficina voltaram a girar, e os elfos pularam de alegria!",
        },
        {
          art: "fortaleza",
          speaker: "narrador",
          sound: "vento",
          text: "As luzes da aurora desceram do céu e formaram uma ponte brilhante sobre o gelo. No fim dela, escondida atrás de uma montanha de cristal, apareceu a Fortaleza de Gelo do Lorde Glacius.",
        },
        {
          art: "glacius-desafio",
          speaker: "vilao",
          sound: "trovao",
          text: "Então vocês me acharam... Venham, entrem na minha fortaleza! O Papai Noel está preso num cristal que nenhum calor do mundo consegue derreter. Hahaha!",
        },
        {
          art: "recompensa-2",
          speaker: "mago",
          sound: "fanfarra",
          text: "Os elfos ficaram tão felizes que te deram um presente: um pedacinho da própria aurora, com a Estrela Polar brilhando no alto! Esse é o seu prêmio lendário. Descanse, aprendiz: na próxima fase, vamos entrar na fortaleza!",
        },
      ],
      reward: {
        xp: 350,
        coins: 200,
        item: {
          name: "Aura da Estrela Polar",
          icon: "🌟",
          description:
            "Um pedacinho da aurora boreal, presente dos elfos do Polo Norte, com a Estrela Polar brilhando no alto. Equipe no Inventário e ela brilha em volta do seu avatar.",
          rarity: "lendario",
          value: 250,
          xp: 0,
          cosmetic: { slot: "aura", value: "estrela-polar" },
        },
      },
      presetMissions: NATAL_FASE2_MISSIONS,
    },
    {
      number: 3,
      icon: "🧊",
      title: "O Resgate",
      summary:
        "Dentro da Fortaleza de Gelo, o Papai Noel está preso num cristal trancado por três Selos de Gelo. Enfrente os Bonecos de Neve Bugados, quebre os selos e salve o Natal!",
      goal: "Quebre os três Selos de Gelo, liberte o Papai Noel e salve o Natal.",
      missionHint: "Cada missão que você vencer quebra um Selo de Gelo do cristal onde o Papai Noel está preso.",
      finishCall: {
        title: "Todos os selos de gelo quebraram!",
        text: "O cristal está rachando... Só falta o último golpe pra libertar o Papai Noel, salvar o Natal e ganhar o item lendário final.",
      },
      intro: [
        {
          art: "salao",
          speaker: "narrador",
          sound: "vento",
          text: "Chegou a última semana antes do Natal. O aprendiz, a Cometa e o Mago atravessaram a ponte da aurora e entraram na Fortaleza de Gelo. Lá dentro, tudo era azul, frio e silencioso...",
        },
        {
          art: "noel-preso",
          speaker: "narrador",
          sound: "sino",
          text: "No centro do salão, dentro de um enorme cristal de gelo, estava ele: o Papai Noel, congelado, abraçado ao saco de presentes.",
        },
        {
          art: "glacius-trono",
          speaker: "vilao",
          sound: "trovao",
          text: "Bem-vindos ao meu palácio! Gostaram da minha estátua favorita? O cristal é trancado por três Selos de Gelo, e cada selo guarda um enigma de código que só um programador de verdade resolve!",
        },
        {
          art: "bonecos",
          speaker: "vilao",
          sound: "vento",
          text: "E, se chegarem perto, os meus Bonecos de Neve Bugados vão cuidar de vocês! Avancem, meus soldadinhos de neve!",
        },
        {
          art: "selos",
          speaker: "mago",
          sound: "plim",
          text: "Coragem, aprendiz! O único fogo que derrete esse gelo é o calor do espírito do Natal: amizade, coragem e conhecimento. Cada missão que você vencer quebra um Selo de Gelo. Vamos libertar o Papai Noel!",
        },
      ],
      outro: [
        {
          art: "libertacao",
          speaker: "narrador",
          sound: "sino",
          text: "O último selo rachou... CRACK! O cristal inteiro se partiu em mil flocos brilhantes, e o Papai Noel abriu os olhos, se espreguiçou e soltou a gargalhada mais gostosa do mundo.",
        },
        {
          art: "glacius-derrotado",
          speaker: "vilao",
          sound: "vento",
          text: "Nããão! O meu inverno eterno... Por que vocês se importam tanto com o Natal? Ninguém nunca se importou comigo! Nem a minha cartinha chegou...",
        },
        {
          art: "carta",
          speaker: "noel",
          sound: "plim",
          text: "Ho, ho, ho! Glacius, meu velho, a sua cartinha chegou sim! Ela ficou cem anos presa num bug do correio mágico, e foi o código do aprendiz que consertou tudo. E sabe o que você pediu? Um amigo pra brincar na neve.",
        },
        {
          art: "natal-salvo",
          speaker: "narrador",
          sound: "guizos",
          text: "O coração de gelo do Lorde Glacius derreteu na mesma hora. Ele chorou, sorriu e pediu desculpas a todos. A fortaleza virou um castelo de brinquedos, e o trenó do Papai Noel voou pelo céu espalhando o Natal pelo mundo inteiro.",
        },
        {
          art: "recompensa-3",
          speaker: "noel",
          sound: "fanfarra",
          text: "Você salvou o Natal, aprendiz! E um herói de verdade merece um presente de verdade: o meu Gorro Lendário, que eu nunca tinha dado pra ninguém. Feliz Natal, CodeGuilds!",
        },
      ],
      reward: {
        xp: 500,
        coins: 300,
        item: {
          name: "Gorro Lendário do Papai Noel",
          icon: "🎅",
          description:
            "O gorro do próprio Papai Noel, de veludo vermelho com barra dourada e uma estrela no pompom. Ele nunca tinha dado esse gorro pra ninguém, até você salvar o Natal. Equipe no Inventário e use no seu avatar.",
          rarity: "lendario",
          value: 300,
          xp: 0,
          cosmetic: { slot: "hat", value: "gorro-lendario" },
        },
      },
      presetMissions: NATAL_FASE3_MISSIONS,
    },
  ],
};

/** Todos os eventos, na ordem em que aparecem na tela de Eventos. */
export const ACADEMY_EVENTS: AcademyEvent[] = [HALLOWEEN, ZOMBIE, ALIEN, NATAL];

export function getEvent(id: string): AcademyEvent | undefined {
  return ACADEMY_EVENTS.find((e) => e.id === id);
}

// ============================================================================
// FASES — evento comum tem uma fase só (o próprio evento); evento em fases
// (Natal) tem uma trilha. O progresso de cada fase fica em Student.events
// com a chave da fase ("natal:2"; evento comum: o próprio id, como antes).
// ============================================================================

// Evento comum vira uma fase só; guardada pra devolver sempre o mesmo objeto (entra em dependências de efeitos).
const SINGLE_PHASES = new Map<EventId, EventPhase[]>();

/** As partes jogáveis do evento, na ordem: as fases, ou uma só com a história do evento inteiro. */
export function eventPhases(event: AcademyEvent): EventPhase[] {
  if (event.phases) return event.phases;
  let phases = SINGLE_PHASES.get(event.id);
  if (!phases) {
    const { icon, title, summary, goal, missionHint, finishCall, intro, outro, reward, presetMissions } = event;
    phases = [{ number: 1, icon, title, summary, goal, missionHint, finishCall, intro, outro, reward, presetMissions }];
    SINGLE_PHASES.set(event.id, phases);
  }
  return phases;
}

export function getPhase(event: AcademyEvent, phase: number): EventPhase {
  const phases = eventPhases(event);
  return phases[Math.min(Math.max(phase, 1), phases.length) - 1];
}

/** Fase de uma missão de evento (missões de evento comum contam como fase 1). */
export function missionPhase(mission: Mission): number {
  return mission.eventPhase ?? 1;
}

/** As missões do evento que um aluno vê: as que o professor dele criou ou atribuiu ao evento (e, se `phase` vier, só as dessa fase). */
export function eventMissionsFor(missions: Mission[], eventId: string, teacherId: string, phase?: number): Mission[] {
  return missions.filter((m) => m.eventId === eventId && m.teacherId === teacherId && (phase === undefined || missionPhase(m) === phase));
}

/** O que gravar numa missão pra ela ser de um evento (e da fase, se o evento for em fases). */
export function eventMissionFields(eventId: EventId, phase: number): Pick<Mission, "eventId" | "eventPhase"> {
  return { eventId, eventPhase: getEvent(eventId)?.phases ? phase : undefined };
}

/** Selo da missão no editor: "🎃 A Noite do Bug Assombrado" ou "🎅 O Resgate do Papai Noel • Fase 2: A Jornada ao Polo Norte". */
export function eventMissionLabel(eventId: string | null | undefined, phase = 1): string | undefined {
  const event = eventId ? getEvent(eventId) : undefined;
  if (!event) return undefined;
  if (!event.phases) return `${event.icon} ${event.title}`;
  const p = getPhase(event, phase);
  return `${event.icon} ${event.title} • Fase ${p.number}: ${p.title}`;
}

/** As missões prontas da fase que o professor ainda não tem no evento (compara pelo título). `eventMissions` = as missões do evento. */
export function missingPresets(event: AcademyEvent, phase: number, eventMissions: Mission[]): MissionContent[] {
  const current = eventMissions.filter((m) => m.eventId === event.id && missionPhase(m) === phase);
  return getPhase(event, phase).presetMissions.filter((p) => !current.some((m) => m.title === p.title));
}

/** Onde o progresso de uma fase fica em Student.events. */
export function phaseKey(event: AcademyEvent, phase: number): string {
  return event.phases ? `${event.id}:${phase}` : event.id;
}

export function phaseProgress(student: Student, event: AcademyEvent, phase: number): EventProgress {
  return student.events[phaseKey(event, phase)] ?? {};
}

/** O aluno já entrou no evento (viu ou pulou a abertura da primeira fase). */
export function eventStarted(student: Student, event: AcademyEvent): boolean {
  return !!phaseProgress(student, event, 1).introSeenAt;
}

/** Quando o aluno finalizou o evento inteiro (a última fase), ou undefined. */
export function eventFinishedAt(student: Student, event: AcademyEvent): string | undefined {
  return phaseProgress(student, event, eventPhases(event).length).finishedAt;
}

/**
 * A fase em que o aluno está: a primeira que ele ainda não finalizou, sem passar
 * das que o professor liberou. Se já finalizou todas as liberadas, fica na última delas.
 */
export function currentPhase(student: Student, event: AcademyEvent, released: number): number {
  const limit = Math.max(1, Math.min(released, eventPhases(event).length));
  for (let n = 1; n <= limit; n++) if (!phaseProgress(student, event, n).finishedAt) return n;
  return limit;
}

/** Por que a fase ainda está trancada pro aluno: o professor não liberou, ou falta finalizar a anterior. null = pode jogar. */
export function phaseLock(student: Student, event: AcademyEvent, phase: number, released: number): "professor" | "anterior" | null {
  if (phase > released) return "professor";
  if (phase > 1 && !phaseProgress(student, event, phase - 1).finishedAt) return "anterior";
  return null;
}

/** O aluno viu a abertura da fase (ou pulou): nas próximas vezes, "Entrar" vai direto pra tela do evento. */
export function introSeenPatch(student: Student, event: AcademyEvent, phase: number): Partial<Student> {
  const current = phaseProgress(student, event, phase);
  if (current.introSeenAt) return {};
  return { events: { ...student.events, [phaseKey(event, phase)]: { ...current, introSeenAt: new Date().toISOString() } } };
}

/** Pode finalizar a fase: ela tem missões, todas foram concluídas e o aluno ainda não finalizou. `missions` = as missões dessa fase. */
export function canFinishPhase(student: Student, missions: Mission[], event: AcademyEvent, phase: number): boolean {
  if (phaseProgress(student, event, phase).finishedAt) return false;
  return missions.length > 0 && missions.every((m) => student.completedMissionIds.includes(m.id));
}

export interface FinishEventResult {
  student: Student;
  leveledUp: boolean;
  newLevel: number;
}

/**
 * Aplica a recompensa da fase (XP, moedas e item) e marca a fase como finalizada. No evento comum, é a recompensa final.
 * `item` = o item com as alterações que o ADM fez na Loja (engine/eventItems.ts); sem ele, vale o item original do evento.
 */
export function finishPhase(student: Student, event: AcademyEvent, phase: number, item?: RewardItem): FinishEventResult {
  const { reward } = getPhase(event, phase);
  const { level, xp } = addXp(student, reward.xp);
  const withItem = grantItem(student, item ?? reward.item);
  return {
    student: {
      ...withItem,
      level,
      xp,
      coins: student.coins + reward.coins,
      events: { ...student.events, [phaseKey(event, phase)]: { ...phaseProgress(student, event, phase), finishedAt: new Date().toISOString() } },
    },
    leveledUp: level > student.level,
    newLevel: level,
  };
}

// ============================================================================
// RANKING DOS EVENTOS — pontuação só do evento, separada do XP geral: o XP de
// recompensa de cada missão do evento que o aluno concluiu, mais o XP da
// recompensa de cada fase que ele finalizou (evento comum: a recompensa final).
// A casa soma os pontos dos seus alunos. Entra no ranking quem participou
// (viu a abertura ou fez pontos).
// ============================================================================

export interface EventStanding {
  student: Student;
  points: number;
  missionsDone: number;
  phasesDone: number;
  finished: boolean;
}

export interface HouseEventStanding {
  houseId: HouseId;
  points: number;
  participants: number;
}

/** Pontos de um aluno num evento (missões do evento concluídas + recompensa de cada fase finalizada). */
export function eventStanding(student: Student, missions: Mission[], event: AcademyEvent): EventStanding {
  const done = missions.filter((m) => m.eventId === event.id && student.completedMissionIds.includes(m.id));
  const finishedPhases = eventPhases(event).filter((p) => phaseProgress(student, event, p.number).finishedAt);
  return {
    student,
    points: done.reduce((sum, m) => sum + m.rewardXp, 0) + finishedPhases.reduce((sum, p) => sum + p.reward.xp, 0),
    missionsDone: done.length,
    phasesDone: finishedPhases.length,
    finished: !!eventFinishedAt(student, event),
  };
}

/**
 * Ranking dos alunos num evento: todas as casas juntas, maior pontuação primeiro.
 * Empate: quem finalizou antes, depois o nome.
 */
export function eventStandings(students: Student[], missions: Mission[], event: AcademyEvent): EventStanding[] {
  return students
    .filter((s) => s.houseId)
    .map((s) => eventStanding(s, missions, event))
    .filter((st) => st.points > 0 || eventStarted(st.student, event))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const fa = eventFinishedAt(a.student, event) ?? "9999";
      const fb = eventFinishedAt(b.student, event) ?? "9999";
      return fa.localeCompare(fb) || a.student.name.localeCompare(b.student.name, "pt-BR");
    });
}

/**
 * Ranking das casas num evento: a soma dos pontos de evento dos alunos de cada casa.
 * Empate: fica na frente a casa do aluno mais bem colocado (`standings` já vem ordenado).
 */
export function houseEventStandings(standings: EventStanding[]): HouseEventStanding[] {
  const bestPlace = (houseId: HouseId) => {
    const i = standings.findIndex((st) => st.student.houseId === houseId);
    return i === -1 ? Infinity : i;
  };
  return HOUSES.map((h) => {
    const members = standings.filter((st) => st.student.houseId === h.id);
    return { houseId: h.id, points: members.reduce((sum, st) => sum + st.points, 0), participants: members.length };
  }).sort((a, b) => b.points - a.points || bestPlace(a.houseId) - bestPlace(b.houseId));
}
