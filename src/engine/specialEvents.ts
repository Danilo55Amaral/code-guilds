// ============================================================================
// EVENTOS ESPECIAIS — eventos temáticos da Academia (ex.: Halloween). Cada
// evento tem uma história contada em cenas de tela cheia (abertura e final,
// em components/EventScene.tsx), missões exclusivas que o professor cria ou
// atribui (Mission.eventId) e uma recompensa pra quem finaliza.
// O desenho de cada cena fica em components/events/; o progresso do aluno
// (viu a abertura? finalizou?) fica em Student.events.
// ============================================================================

import { Mission, MissionContent, RewardItem } from "./missions";
import { Student, addXp, grantItem } from "./students";
import { HOUSES, HouseId } from "./houses";

export type EventId = "halloween" | "zumbi" | "alien";

/** Quem fala na cena — define o nome no balão, a cor e a voz. */
export type SceneSpeaker = "narrador" | "mago" | "vilao";

/** Efeito sonoro que toca quando a cena começa. */
export type SceneSound = "sino" | "trovao" | "plim" | "fanfarra" | "alarme" | "gemido" | "ovni" | "laser";

export interface EventSceneStep {
  art: string; // qual desenho aparece (cada evento tem os seus, em components/events/)
  speaker: SceneSpeaker;
  text: string;
  sound?: SceneSound;
}

export interface AcademyEvent {
  id: EventId;
  icon: string;
  title: string;
  tagline: string;
  summary: string; // resumo da história, no card do evento
  goal: string; // o que o aluno precisa fazer, em uma frase
  /** O vilão da história: nome e ícone no balão de fala e a voz dele (pitch 0 a 2, rate = velocidade). */
  villain: { name: string; icon: string; voice: { pitch: number; rate: number } };
  /** Frase embaixo do título "Missões do evento" (o que cada missão vencida faz). */
  missionHint: string;
  /** Convite pra finalizar, quando todas as missões foram concluídas. */
  finishCall: { title: string; text: string };
  intro: EventSceneStep[];
  outro: EventSceneStep[];
  reward: { xp: number; coins: number; item: RewardItem };
  /** Missões prontas que o professor pode adicionar ao evento com um clique. */
  presetMissions: MissionContent[];
}

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

const HALLOWEEN: AcademyEvent = {
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

const ZOMBIE: AcademyEvent = {
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

const ALIEN: AcademyEvent = {
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

/** Todos os eventos, na ordem em que aparecem na tela de Eventos. */
export const ACADEMY_EVENTS: AcademyEvent[] = [HALLOWEEN, ZOMBIE, ALIEN];

export function getEvent(id: string): AcademyEvent | undefined {
  return ACADEMY_EVENTS.find((e) => e.id === id);
}

/** As missões do evento que um aluno vê: as que o professor dele criou ou atribuiu ao evento. */
export function eventMissionsFor(missions: Mission[], eventId: string, teacherId: string): Mission[] {
  return missions.filter((m) => m.eventId === eventId && m.teacherId === teacherId);
}

export function eventProgress(student: Student, eventId: string) {
  return student.events[eventId] ?? {};
}

/** O aluno viu a cena de abertura (ou pulou): nas próximas vezes, "Entrar" vai direto pra tela do evento. */
export function introSeenPatch(student: Student, eventId: string): Partial<Student> {
  const current = eventProgress(student, eventId);
  if (current.introSeenAt) return {};
  return { events: { ...student.events, [eventId]: { ...current, introSeenAt: new Date().toISOString() } } };
}

/** Pode finalizar: o evento tem missões, todas foram concluídas e o aluno ainda não finalizou. */
export function canFinishEvent(student: Student, missions: Mission[], eventId: string): boolean {
  if (eventProgress(student, eventId).finishedAt) return false;
  return missions.length > 0 && missions.every((m) => student.completedMissionIds.includes(m.id));
}

export interface FinishEventResult {
  student: Student;
  leveledUp: boolean;
  newLevel: number;
}

/** Aplica a recompensa final (XP, moedas e item) e marca o evento como finalizado. */
export function finishEvent(student: Student, event: AcademyEvent): FinishEventResult {
  const { level, xp } = addXp(student, event.reward.xp);
  const withItem = grantItem(student, event.reward.item);
  const progress = eventProgress(student, event.id);
  return {
    student: {
      ...withItem,
      level,
      xp,
      coins: student.coins + event.reward.coins,
      events: { ...student.events, [event.id]: { ...progress, finishedAt: new Date().toISOString() } },
    },
    leveledUp: level > student.level,
    newLevel: level,
  };
}

// ============================================================================
// RANKING DOS EVENTOS — pontuação só do evento, separada do XP geral: o XP de
// recompensa de cada missão do evento que o aluno concluiu, mais o XP da
// recompensa final se ele finalizou o evento. A casa soma os pontos dos seus
// alunos. Entra no ranking quem participou (viu a abertura ou fez pontos).
// ============================================================================

export interface EventStanding {
  student: Student;
  points: number;
  missionsDone: number;
  finished: boolean;
}

export interface HouseEventStanding {
  houseId: HouseId;
  points: number;
  participants: number;
}

/** Pontos de um aluno num evento (missões do evento concluídas + recompensa final, se finalizou). */
export function eventStanding(student: Student, missions: Mission[], event: AcademyEvent): EventStanding {
  const done = missions.filter((m) => m.eventId === event.id && student.completedMissionIds.includes(m.id));
  const finished = !!eventProgress(student, event.id).finishedAt;
  return {
    student,
    points: done.reduce((sum, m) => sum + m.rewardXp, 0) + (finished ? event.reward.xp : 0),
    missionsDone: done.length,
    finished,
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
    .filter((st) => st.points > 0 || eventProgress(st.student, event.id).introSeenAt)
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const fa = eventProgress(a.student, event.id).finishedAt ?? "9999";
      const fb = eventProgress(b.student, event.id).finishedAt ?? "9999";
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
