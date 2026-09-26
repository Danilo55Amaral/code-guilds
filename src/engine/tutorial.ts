// ============================================================================
// TUTORIAL — os passos do tour de primeiro acesso. Dados estáticos, sem estado.
// Quem apresenta é o Mago Danilo (components/TutorialModal.tsx): cada `body` é
// a fala dele no balão (e o que a voz dele lê), por isso os textos são em
// primeira pessoa. Se o aluno/professor já viu (ou pulou) fica gravado no
// próprio cadastro (tutorialDone em students.ts / teachers.ts); o botão
// "❓ Tutorial" reabre.
// ============================================================================

export interface TutorialStep {
  icon: string;
  title: string;
  body: string;
}

export const STUDENT_TUTORIAL: TutorialStep[] = [
  {
    icon: "👋",
    title: "Saudações, jovem aprendiz!",
    body: "Eu sou o Mago Danilo, guardião da CodeGuilds! Aqui você aprende programação jogando: completa missões, ganha XP, sobe de nível, junta moedas e coleciona itens, tudo pela glória da sua casa. Venha, vou te mostrar o castelo!",
  },
  {
    icon: "⚔️",
    title: "Missões",
    body: "As missões são desafios em forma de quiz, criados pelo seu professor. Acerte pelo menos 60% das perguntas e eu te recompenso com XP, moedas e um item! As missões mais difíceis só se revelam pra quem tem nível alto. Use a busca e os filtros pra achar a próxima aventura.",
  },
  {
    icon: "✨",
    title: "XP e níveis",
    body: "Tá vendo aquela barra roxa lá no topo? É o seu XP no nível atual. Quando ela enche, você sobe de nível e novas missões são destravadas. Cada nível te deixa mais poderoso!",
  },
  {
    icon: "🛡️",
    title: "Inventário",
    body: "Todos os seus tesouros ficam guardados no Inventário. Itens consumíveis podem ser usados pra ganhar XP, e qualquer item pode ser vendido pro sistema ou pra um colega. E clicando no seu cartão, você abre a sua Ficha do Personagem.",
  },
  {
    icon: "🛍️",
    title: "Loja da Academia",
    body: "Ahh, o Mercado Arcano, meu lugar favorito! Lá você troca moedas por poções de XP e visuais exclusivos: chapéus, óculos, auras e até mascotes! Use o botão Provar pra ver como fica em você antes de comprar, e depois equipe no Inventário.",
  },
  {
    icon: "📅",
    title: "Eventos",
    body: "De vez em quando a Academia recebe eventos especiais, como a Noite do Bug Assombrado no Halloween, o Surto do Vírus Z no Apocalipse Zumbi e a Invasão de Bugzar! Cada evento tem uma história animada, missões exclusivas e uma recompensa lendária pra quem chegar até o final. Fique de olho no Salão dos Eventos!",
  },
  {
    icon: "🏰",
    title: "Minha Casa",
    body: "Em Minha Casa você vê os pontos de cada casa, o ranking dos seus colegas e o Ranking Geral com todos os alunos da Academia. Cada XP que você ganha soma pontos pra sua casa! Clique em qualquer aluno pra ver o avatar e os itens dele.",
  },
  {
    icon: "🔔",
    title: "Mensagens",
    body: "Recados do professor, presentes, missões concluídas, compras e vendas chegam no sino lá no topo e em Minha Casa, Mensagens. O numerozinho vermelho mostra quantas você ainda não leu.",
  },
  {
    icon: "🚀",
    title: "Sua jornada começa agora!",
    body: "É isso, aprendiz! O botão de música liga e desliga a trilha do castelo, e o botão Tutorial me chama de volta sempre que precisar. Agora vá, e que seu código compile de primeira!",
  },
];

const TEACHER_STEPS: TutorialStep[] = [
  {
    icon: "🎓",
    title: "Saudações, caro Mestre!",
    body: "Eu sou o Mago Danilo, guardião da CodeGuilds, e este é o seu Painel do Mestre. Daqui você comanda a sua turma: só você vê e altera os seus alunos e as suas missões. Venha, vou te mostrar as ferramentas!",
  },
  {
    icon: "👥",
    title: "Seus alunos",
    body: "Aqui aparecem os aprendizes que escolheram você como professor. No topo você vê quantos são e quantos estão em cada casa, e pode buscar por nome, nível ou casa. Clique num aluno pra abrir a ficha dele.",
  },
  {
    icon: "📜",
    title: "Ficha do aluno",
    body: "Na ficha você vê os dados, o avatar, o progresso e o inventário. Pode dar itens, que chegam com uma mensagem de parabéns, trocar a casa, alterar nome, e-mail, login e senha, e enviar mensagens individuais.",
  },
  {
    icon: "📢",
    title: "Comunicados",
    body: "Precisa avisar a turma toda? Mande um comunicado pra todos os seus alunos de uma vez, ou só pros de uma casa. No histórico você acompanha quantos já leram.",
  },
  {
    icon: "⚔️",
    title: "Missões",
    body: "Aqui nasce a magia! Crie missões com perguntas, explicações, nível mínimo, dificuldade e recompensas: XP, moedas e um item com ícone e descrição. Seus alunos precisam acertar 60% pra ganhar a recompensa.",
  },
  {
    icon: "📅",
    title: "Eventos",
    body: "Nos eventos especiais, como o de Halloween, o Apocalipse Zumbi e a Invasão Alienígena, seus alunos assistem a uma história animada e enfrentam missões exclusivas. No card de Eventos você cria missões pro evento, atribui missões que já existem ou usa as missões prontas com um clique. Quando estiver tudo pronto, clique em Iniciar: só então o evento aparece pros seus alunos, e Encerrar esconde ele de novo. Quem concluir todas as missões ganha o final da história e uma recompensa lendária!",
  },
];

const ADMIN_STEP: TutorialStep = {
  icon: "🛡",
  title: "Painel ADM",
  body: "E como você é o administrador, tem acesso ao Painel ADM: cadastra professores, vê todos os alunos e missões da plataforma, troca o professor de um aluno, cuida da Loja da Academia e, na aba Eventos, prepara, inicia e encerra os eventos de qualquer turma. Grande poder, grande responsabilidade!",
};

const TEACHER_LAST_STEP: TutorialStep = {
  icon: "🚀",
  title: "Tudo pronto!",
  body: "É isso, Mestre! Quando quiser me chamar de volta, é só clicar em Tutorial no topo do painel. Boas aulas, e que seus alunos compilem de primeira!",
};

/** O ADM ganha um passo a mais explicando o Painel ADM. */
export function teacherTutorial(isAdmin: boolean): TutorialStep[] {
  return [...TEACHER_STEPS, ...(isAdmin ? [ADMIN_STEP] : []), TEACHER_LAST_STEP];
}
