// ============================================================================
// TUTORIAL — os passos do tour de primeiro acesso. Dados estáticos, sem estado.
// Se o aluno/professor já viu (ou pulou) fica gravado no próprio cadastro
// (tutorialDone em students.ts / teachers.ts); o botão "❓ Tutorial" reabre.
// ============================================================================

export interface TutorialStep {
  icon: string;
  title: string;
  body: string;
}

export const STUDENT_TUTORIAL: TutorialStep[] = [
  {
    icon: "👋",
    title: "Bem-vindo à CodeGuilds!",
    body: "Aqui você aprende programação jogando: responde missões, ganha XP, sobe de nível, junta moedas e coleciona itens — tudo representando a sua casa.",
  },
  {
    icon: "⚔️",
    title: "Missões",
    body: "Cada missão é um quiz criado pelo seu professor. Acerte pelo menos 60% das perguntas pra ganhar XP, moedas e um item. Missões mais difíceis só destravam em níveis mais altos. Use a busca e os filtros Todas/Ativas/Concluídas pra se achar.",
  },
  {
    icon: "✨",
    title: "XP e níveis",
    body: "A barra no topo mostra o seu XP no nível atual. Quando ela enche, você sobe de nível e novas missões são liberadas.",
  },
  {
    icon: "🛡️",
    title: "Inventário",
    body: "Seus itens ficam aqui. Itens consumíveis podem ser usados pra ganhar XP; qualquer item pode ser vendido pro sistema ou oferecido a um colega. Ofertas que você recebe aparecem no topo. Clique no seu cartão pra abrir a Ficha do Personagem.",
  },
  {
    icon: "🏰",
    title: "Minha Casa",
    body: "Veja os pontos de cada casa e o ranking dos seus colegas. Clique num colega pra ver o avatar, o nível e os itens dele.",
  },
  {
    icon: "🔔",
    title: "Mensagens do professor",
    body: "Avisos e recados do professor chegam no sino 🔔 do topo e em Minha Casa → Mensagens. O número vermelho mostra quantas você ainda não leu.",
  },
  {
    icon: "❓",
    title: "Pronto pra começar!",
    body: "O botão 🎶 liga e desliga a música. Se quiser ver este tutorial de novo, é só clicar em ❓ Tutorial no topo da tela. Boa jornada!",
  },
];

const TEACHER_STEPS: TutorialStep[] = [
  {
    icon: "🎓",
    title: "Bem-vindo ao Painel do Mestre!",
    body: "Aqui você gerencia a sua turma na CodeGuilds. Você só vê e só altera os seus alunos e as suas missões — os de outros professores ficam de fora.",
  },
  {
    icon: "👥",
    title: "Seus alunos",
    body: "Aparecem aqui os alunos que escolheram você como professor no cadastro. No topo você vê quantos são e quantos estão em cada casa. Clique num aluno pra abrir a ficha dele.",
  },
  {
    icon: "📜",
    title: "Ficha do aluno",
    body: "Na ficha você vê dados, avatar, progresso e inventário. Dá pra dar e excluir itens, ver e alterar o login e a senha, enviar uma mensagem individual e, se precisar, excluir o aluno.",
  },
  {
    icon: "📢",
    title: "Comunicados",
    body: "Envie um aviso ou uma mensagem pra todos os seus alunos de uma vez, ou só pros alunos de uma casa. No histórico você acompanha quantos já leram.",
  },
  {
    icon: "⚔️",
    title: "Missões",
    body: "Crie, edite e exclua as suas missões: perguntas com 4 opções e explicação, nível mínimo, dificuldade e recompensas (XP, moedas e item). Seus alunos precisam acertar 60% pra ganhar a recompensa.",
  },
];

const ADMIN_STEP: TutorialStep = {
  icon: "🛡",
  title: "Painel ADM",
  body: "Como administrador, o botão 🛡 Painel ADM abre a visão da plataforma inteira: cadastrar e editar professores, ver todos os alunos e missões, trocar o professor de um aluno e criar ou alterar qualquer missão.",
};

const TEACHER_LAST_STEP: TutorialStep = {
  icon: "❓",
  title: "Tudo pronto!",
  body: "Se quiser ver este tutorial de novo, é só clicar em ❓ Tutorial no topo do painel. Boas aulas!",
};

/** O ADM ganha um passo a mais explicando o Painel ADM. */
export function teacherTutorial(isAdmin: boolean): TutorialStep[] {
  return [...TEACHER_STEPS, ...(isAdmin ? [ADMIN_STEP] : []), TEACHER_LAST_STEP];
}
