import { MissionContent } from "../../../src/engine/missions";
import { quizMission } from "./quiz-materia";

// Missões de Filosofia pra Biblioteca de Missões (tomo de Filosofia): 5 missões
// de 10 perguntas comentadas, nos níveis 1, 5, 10, 15 e 20, com o conteúdo de
// Filosofia do ensino médio: o nascimento da filosofia, os clássicos gregos, a
// filosofia medieval e moderna, ética e política, e a filosofia contemporânea.
// Importar com:
//   npm run missions:import -- <e-mail do professor> scripts/missions/filosofia.ts
const missions: MissionContent[] = [
    quizMission({
        subject: "filosofia",
        level: 1,
        title: "Filosofia: O Nascimento da Filosofia",
        icon: "🦉",
        description: "O que é filosofia, mito e razão, e os primeiros filósofos",
        item: { name: "Coruja de Atena", icon: "🦉", description: "A coruja que enxerga no escuro, símbolo da sabedoria. Usar dá XP de quem pergunta o porquê das coisas." },
        questions: [
            ["O que significa a palavra \"filosofia\", que vem do grego?", ["Amor à sabedoria", "Estudo dos números", "Medo do desconhecido", "Arte de falar bem"], 0, "Philo quer dizer amor ou amizade, e sophia, sabedoria."],
            ["Em qual lugar surgiu a filosofia ocidental, por volta do século VI a.C.?", ["Na Grécia Antiga", "No Egito", "Na China", "Em Roma"], 0, "Ela surgiu nas colônias gregas, como Mileto, na Jônia (hoje Turquia)."],
            ["Qual é a principal diferença entre o mito e a filosofia para explicar o mundo?", ["O mito explica pelos deuses e pela tradição; a filosofia busca explicações pela razão (logos)", "O mito usa a razão e a filosofia usa os deuses", "Os dois são iguais", "A filosofia só conta histórias"], 0, "Essa passagem é chamada de \"do mito ao logos\"."],
            ["Quem é considerado o primeiro filósofo, que dizia que a água era a origem de tudo?", ["Tales de Mileto", "Sócrates", "Platão", "Aristóteles"], 0, "Tales buscava o princípio de todas as coisas, a arché, e o encontrou na água."],
            ["Como são chamados os filósofos que vieram antes de Sócrates e estudavam a natureza?", ["Pré-socráticos", "Sofistas", "Escolásticos", "Iluministas"], 0, "Eles buscavam a arché, o princípio que explica a origem do cosmos."],
            ["Qual filósofo pré-socrático disse que \"ninguém se banha duas vezes no mesmo rio\", pois tudo muda?", ["Heráclito", "Parmênides", "Tales", "Pitágoras"], 0, "Para Heráclito, a realidade é movimento e transformação constante."],
            ["Qual filósofo e matemático grego acreditava que os números eram a essência de todas as coisas?", ["Pitágoras", "Heráclito", "Demócrito", "Sócrates"], 0, "Pitágoras é lembrado também pelo famoso teorema dos triângulos retângulos."],
            ["Qual filósofo pré-socrático defendia que tudo é formado por partículas indivisíveis chamadas átomos?", ["Demócrito", "Tales", "Platão", "Heráclito"], 0, "Átomo, em grego, significa \"indivisível\"."],
            ["Quem eram os sofistas?", ["Professores que ensinavam retórica (a arte de convencer) em troca de pagamento", "Sacerdotes dos templos", "Soldados de Esparta", "Os primeiros cientistas da natureza"], 0, "Sócrates criticava os sofistas por se preocuparem mais em convencer do que em buscar a verdade."],
            ["Qual é uma atitude típica da filosofia?", ["Questionar o que parece óbvio e perguntar o porquê das coisas", "Aceitar tudo sem perguntar", "Decorar respostas prontas", "Evitar o diálogo"], 0, "Para os gregos, a filosofia começa com o espanto, a admiração diante do mundo."],
        ],
    }),
    quizMission({
        subject: "filosofia",
        level: 5,
        title: "Filosofia: Sócrates, Platão e Aristóteles",
        icon: "🏛️",
        description: "O método socrático, o mundo das ideias e a lógica de Aristóteles",
        item: { name: "Pergaminho da Academia", icon: "📜", description: "Anotações tiradas na escola de Platão. Usar dá XP de quem dialoga com os clássicos." },
        questions: [
            ["Como se chama o método de Sócrates, que fazia perguntas até a pessoa perceber a própria ignorância e chegar à verdade?", ["Maiêutica", "Dialética hegeliana", "Método científico", "Retórica"], 0, "Maiêutica quer dizer \"arte de fazer o parto\": Sócrates ajudava as ideias a \"nascerem\" da pessoa."],
            ["Qual frase, inscrita no templo de Delfos, Sócrates adotou como lema?", ["\"Conhece-te a ti mesmo\"", "\"Penso, logo existo\"", "\"O homem é o lobo do homem\"", "\"Deus está morto\""], 0, "\"Penso, logo existo\" é de Descartes; \"O homem é o lobo do homem\" ficou famosa com Hobbes."],
            ["Como Sócrates morreu?", ["Foi condenado à morte e bebeu cicuta, um veneno", "Morreu numa batalha", "Morreu de velhice numa ilha", "Desapareceu no mar"], 0, "Ele foi acusado de corromper os jovens e desrespeitar os deuses de Atenas, em 399 a.C."],
            ["Qual discípulo de Sócrates escreveu diálogos em que Sócrates é o personagem principal?", ["Platão", "Aristóteles", "Tales", "Epicuro"], 0, "Sócrates não deixou nada escrito. Conhecemos suas ideias principalmente pelos diálogos de Platão."],
            ["O que Platão quis mostrar com o \"Mito da Caverna\"?", ["Que vivemos presos às aparências e precisamos da razão para conhecer a verdade", "Que as cavernas são perigosas", "Que a luz do sol faz mal", "Que não existe verdade"], 0, "Os prisioneiros só veem sombras na parede; quem sai da caverna descobre o mundo real, o mundo das ideias."],
            ["Como se chamava a escola fundada por Platão em Atenas?", ["Academia", "Liceu", "Jardim", "Pórtico"], 0, "O Liceu era a escola de Aristóteles, e o Jardim, a de Epicuro."],
            ["Aristóteles foi professor de qual conquistador famoso?", ["Alexandre, o Grande", "Júlio César", "Napoleão", "Carlos Magno"], 0, "Aristóteles ensinou o jovem Alexandre na Macedônia."],
            ["Qual área do conhecimento Aristóteles organizou, estudando as regras do pensamento correto e o silogismo?", ["Lógica", "Astronomia moderna", "Química", "Psicanálise"], 0, "Exemplo de silogismo: \"Todo homem é mortal. Sócrates é homem. Logo, Sócrates é mortal.\""],
            ["Para Aristóteles, qual é a finalidade da vida humana?", ["A felicidade (eudaimonia), alcançada pela virtude", "A riqueza", "O poder sobre os outros", "A fama"], 0, "Para ele, a virtude está no meio-termo entre dois extremos, como a coragem entre a covardia e a imprudência."],
            ["Aristóteles disse que o ser humano é um \"animal político\". O que isso quer dizer?", ["Que o ser humano é feito para viver em comunidade, na pólis", "Que todos devem ser políticos", "Que os animais votam", "Que a política é coisa de animais"], 0, "Para Aristóteles, só na vida em sociedade, na pólis, o ser humano realiza plenamente sua natureza."],
        ],
    }),
    quizMission({
        subject: "filosofia",
        level: 10,
        title: "Filosofia: Da Fé à Razão Moderna",
        icon: "🕯️",
        description: "Filosofia medieval, Descartes, empirismo e Kant",
        item: { name: "Vela do Pensador", icon: "🕯️", description: "Uma vela que ilumina as ideias mais claras e distintas. Usar dá XP de quem pensa com método." },
        questions: [
            ["Qual era o grande tema da filosofia medieval?", ["Conciliar a fé cristã com a razão", "Explicar a evolução das espécies", "Estudar os átomos", "Criar a democracia"], 0, "Os filósofos medievais usavam a filosofia grega para pensar as verdades da fé."],
            ["Qual filósofo medieval usou as ideias de Platão para pensar o cristianismo e escreveu \"Confissões\"?", ["Santo Agostinho", "São Tomás de Aquino", "René Descartes", "Maquiavel"], 0, "Agostinho viveu entre os séculos IV e V, no fim do Império Romano."],
            ["Qual filósofo medieval aproximou o pensamento de Aristóteles da fé cristã e escreveu a \"Suma Teológica\"?", ["São Tomás de Aquino", "Santo Agostinho", "Pitágoras", "Kant"], 0, "Tomás de Aquino é o grande nome da Escolástica, no século XIII."],
            ["Quem disse \"Penso, logo existo\"?", ["René Descartes", "Sócrates", "John Locke", "Friedrich Nietzsche"], 0, "Descartes duvidou de tudo e percebeu que, enquanto duvida, está pensando; então ele existe."],
            ["Como se chama a corrente que diz que o conhecimento vem principalmente da razão?", ["Racionalismo", "Empirismo", "Ceticismo", "Existencialismo"], 0, "Descartes é o principal racionalista. Os empiristas valorizam a experiência dos sentidos."],
            ["Como se chama a corrente que diz que todo conhecimento vem da experiência e dos sentidos?", ["Empirismo", "Racionalismo", "Idealismo", "Estoicismo"], 0, "Locke, Hume e Bacon são empiristas."],
            ["John Locke disse que, ao nascer, a mente humana é como uma \"tábula rasa\". O que isso significa?", ["Que nascemos sem ideias prontas e aprendemos pela experiência", "Que nascemos sabendo tudo", "Que a mente é de pedra", "Que não aprendemos nada"], 0, "Para Locke, a experiência vai \"escrevendo\" na mente as ideias."],
            ["Qual filósofo inglês defendeu o método experimental e disse que \"saber é poder\"?", ["Francis Bacon", "Thomas Hobbes", "Platão", "Santo Agostinho"], 0, "Bacon ajudou a criar as bases do método científico moderno."],
            ["Qual filósofo alemão tentou unir racionalismo e empirismo na \"Crítica da Razão Pura\"?", ["Immanuel Kant", "Karl Marx", "Hegel", "Sartre"], 0, "Para Kant, o conhecimento começa com a experiência, mas a razão organiza o que percebemos."],
            ["O que foi a \"Revolução Copernicana\" que influenciou a filosofia moderna?", ["A troca da ideia de Terra no centro do universo pela do Sol no centro", "Uma revolução política na França", "A invenção da imprensa", "A descoberta da América"], 0, "Ela mostrou que os sentidos podem enganar e incentivou o uso da razão e do método."],
        ],
    }),
    quizMission({
        subject: "filosofia",
        level: 15,
        title: "Filosofia: Ética e Política",
        icon: "⚖️",
        description: "Maquiavel, os contratualistas, Kant e o utilitarismo",
        item: { name: "Balança da Justiça", icon: "⚖️", description: "Uma balança que pesa o certo e o errado. Usar dá XP de quem pensa na justiça." },
        questions: [
            ["Qual é a diferença entre ética e moral?", ["A moral são as regras de conduta de um grupo; a ética é a reflexão filosófica sobre essas regras", "São palavras sem relação", "A ética é só para médicos", "A moral é uma lei escrita"], 0, "A ética pergunta por que agimos de um jeito e se essas regras são justas."],
            ["Qual filósofo escreveu \"O Príncipe\" e separou a política da moral religiosa?", ["Nicolau Maquiavel", "Thomas Hobbes", "Jean-Jacques Rousseau", "John Locke"], 0, "Para Maquiavel, o governante deve ser capaz de conservar o poder e o Estado."],
            ["Para Thomas Hobbes, como seria a vida no \"estado de natureza\", antes do Estado?", ["Uma guerra de todos contra todos", "Um paraíso de paz", "Uma vida sem nenhum desejo", "Igual à vida nas cidades"], 0, "Por medo, as pessoas fazem um contrato social e entregam o poder a um soberano forte, o Leviatã."],
            ["O que é o \"contrato social\" para os filósofos contratualistas?", ["Um acordo em que as pessoas aceitam regras e criam o Estado para viver em sociedade", "Um contrato de trabalho", "Um documento assinado no cartório", "Uma lei de trânsito"], 0, "Hobbes, Locke e Rousseau explicaram de jeitos diferentes por que e como esse pacto acontece."],
            ["Para John Locke, quais são os direitos naturais que o Estado deve proteger?", ["Vida, liberdade e propriedade", "Apenas o direito de votar", "O direito do rei de mandar em tudo", "Somente a religião"], 0, "As ideias de Locke influenciaram a independência dos Estados Unidos e o liberalismo."],
            ["Qual filósofo disse que \"o homem nasce bom, a sociedade o corrompe\"?", ["Jean-Jacques Rousseau", "Thomas Hobbes", "Maquiavel", "Aristóteles"], 0, "Rousseau escreveu \"O Contrato Social\" e defendia a soberania do povo, a \"vontade geral\"."],
            ["Qual pensador propôs a divisão dos poderes em Executivo, Legislativo e Judiciário?", ["Montesquieu", "Voltaire", "Descartes", "Platão"], 0, "Em \"O Espírito das Leis\", Montesquieu defendia que os poderes separados controlam uns aos outros."],
            ["Kant propôs agir de modo que sua ação possa virar uma lei para todos. Como se chama essa regra?", ["Imperativo categórico", "Lei da oferta e da procura", "Princípio da incerteza", "Navalha de Ockham"], 0, "Para Kant, uma ação é moral quando é feita por dever e poderia valer para todo mundo."],
            ["O que defende o utilitarismo, de Jeremy Bentham e John Stuart Mill?", ["Que a ação certa é a que traz a maior felicidade para o maior número de pessoas", "Que só importa a felicidade de quem age", "Que não existe certo e errado", "Que devemos obedecer ao rei"], 0, "O utilitarismo julga as ações pelas consequências."],
            ["O que é um dilema ético?", ["Uma situação em que precisamos escolher entre valores ou deveres que entram em conflito", "Uma conta de matemática difícil", "Um tipo de lei", "Uma pergunta com resposta óbvia"], 0, "Exemplo: dizer uma verdade que machuca ou uma mentira que protege alguém."],
        ],
    }),
    quizMission({
        subject: "filosofia",
        level: 20,
        title: "Filosofia: Pensadores Contemporâneos",
        icon: "💭",
        description: "Marx, Nietzsche, Sartre, Simone de Beauvoir, Hannah Arendt e outros",
        item: { name: "Lanterna de Diógenes", icon: "🏮", description: "A lanterna que procura gente honesta em plena luz do dia. Usar dá XP de quem pensa o nosso tempo." },
        questions: [
            ["Qual pensador escreveu \"O Capital\" e analisou a luta de classes no capitalismo?", ["Karl Marx", "Friedrich Nietzsche", "Jean-Paul Sartre", "Immanuel Kant"], 0, "Para Marx, a história é movida pelo conflito entre classes, como a burguesia e o proletariado."],
            ["O que Marx chamou de \"mais-valia\"?", ["O valor que o trabalhador produz a mais do que recebe de salário e que fica com o patrão", "Um imposto do governo", "O preço de uma mercadoria em promoção", "A poupança do trabalhador"], 0, "Para Marx, a mais-valia é a base do lucro no capitalismo."],
            ["Qual filósofo alemão escreveu a frase \"Deus está morto\" e criou a ideia de \"super-homem\" (além-do-homem)?", ["Friedrich Nietzsche", "Karl Marx", "Hegel", "Kant"], 0, "Nietzsche criticava os valores tradicionais e propunha criar novos valores."],
            ["Para o existencialismo de Sartre, \"a existência precede a essência\". O que isso significa?", ["Primeiro existimos, e depois nos definimos pelas nossas escolhas", "Já nascemos com um destino pronto", "A essência é mais importante que viver", "Não existimos de verdade"], 0, "Sartre também disse que estamos \"condenados a ser livres\": somos responsáveis pelo que fazemos."],
            ["Quem escreveu \"Ninguém nasce mulher: torna-se mulher\"?", ["Simone de Beauvoir", "Hannah Arendt", "Rosa Luxemburgo", "Djamila Ribeiro"], 0, "A frase está em \"O Segundo Sexo\" (1949), obra fundamental do feminismo."],
            ["Qual filósofa criou a expressão \"banalidade do mal\" ao acompanhar o julgamento de um nazista?", ["Hannah Arendt", "Simone de Beauvoir", "Marie Curie", "Simone Weil"], 0, "Arendt percebeu que pessoas comuns podem cometer males terríveis apenas por não pensar no que fazem."],
            ["A Escola de Frankfurt criou o conceito de \"indústria cultural\". O que ele critica?", ["A cultura transformada em mercadoria padronizada, feita para o consumo em massa", "As fábricas de tecido", "A arte dos museus", "A educação nas escolas"], 0, "Adorno e Horkheimer criticavam como filmes, músicas e rádio viram produtos para vender."],
            ["Qual filósofo francês estudou as relações de poder em instituições como prisões, escolas e hospitais?", ["Michel Foucault", "Descartes", "Rousseau", "Voltaire"], 0, "Em \"Vigiar e Punir\", Foucault analisou a sociedade disciplinar."],
            ["Qual filósofo brasileiro escreveu a \"Pedagogia do Oprimido\" e defendia uma educação libertadora?", ["Paulo Freire", "Machado de Assis", "Darcy Ribeiro", "Oswaldo Cruz"], 0, "Paulo Freire é o patrono da educação brasileira e um dos autores mais citados do mundo na área."],
            ["O que estuda a bioética, um ramo da ética contemporânea?", ["As questões morais ligadas à vida, à medicina e à biotecnologia", "A ética dos esportes", "As regras de trânsito", "A história das religiões"], 0, "Clonagem, transgênicos, eutanásia e testes em animais são temas da bioética."],
        ],
    }),
]

export default missions
