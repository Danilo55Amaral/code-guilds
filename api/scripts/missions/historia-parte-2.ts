import { MissionContent } from "../../../src/engine/missions";
import { quizMission } from "./quiz-materia";

// Mais 5 missões de História Geral (tomo de História Geral), nos níveis 1, 5,
// 10, 15 e 20: a Antiguidade Oriental, os povos da América e da África, a
// Reforma e o Absolutismo, o Iluminismo e as revoluções, e o século XX. Não
// repetem as perguntas de historia.ts.
// Importar com:
//   npm run missions:import -- <e-mail do professor> scripts/missions/historia-parte-2.ts
const missions: MissionContent[] = [
    quizMission({
        subject: "historia",
        level: 1,
        title: "História Geral: Os Povos da Antiguidade Oriental",
        icon: "🏺",
        description: "Mesopotâmia, hebreus, fenícios, persas e chineses",
        item: { name: "Tábua de Argila", icon: "🧱", description: "Uma tábua com escrita cuneiforme de 4 mil anos. Usar dá XP de quem conhece as primeiras civilizações." },
        questions: [
            ["Qual rei da Babilônia criou um dos primeiros códigos de leis escritas, famoso pelo \"olho por olho, dente por dente\"?", ["Hamurábi", "Nabucodonosor", "Ciro", "Ramsés"], 0, "O Código de Hamurábi, de cerca de 1750 a.C., foi gravado numa grande pedra de basalto."],
            ["Quais construções em forma de torres de degraus eram templos na Mesopotâmia?", ["Zigurates", "Pirâmides lisas", "Castelos", "Catedrais"], 0, "Os zigurates eram feitos de tijolos de barro e ficavam no centro das cidades."],
            ["Qual povo da Antiguidade foi um dos primeiros a acreditar num deus único (monoteísmo)?", ["Os hebreus", "Os egípcios", "Os gregos", "Os romanos"], 0, "A religião dos hebreus deu origem ao judaísmo, que influenciou o cristianismo e o islamismo."],
            ["Os fenícios ficaram famosos por quais atividades?", ["O comércio pelo mar Mediterrâneo e a criação de um alfabeto", "A construção das pirâmides", "A invenção da democracia", "As Olimpíadas"], 0, "O alfabeto fenício, com poucos sinais, deu origem ao alfabeto grego e depois ao latino, que usamos hoje."],
            ["Qual povo, liderado por reis como Ciro e Dario, formou um enorme império e construiu a Estrada Real?", ["Os persas", "Os fenícios", "Os hebreus", "Os maias"], 0, "A Estrada Real ligava o império e permitia levar mensagens rapidamente."],
            ["Qual grande construção chinesa foi erguida para proteger o império contra invasões do norte?", ["A Grande Muralha", "O Coliseu", "A Torre de Babel", "O Partenon"], 0, "Ela foi construída e reconstruída por séculos e tem milhares de quilômetros."],
            ["Os sumérios, da Mesopotâmia, estão entre os primeiros a usar qual invenção, muito útil para o transporte?", ["A roda", "O avião", "A bússola", "O papel"], 0, "A roda aparece na Mesopotâmia há mais de 5 mil anos, primeiro em carroças e na cerâmica."],
            ["Qual destas foi uma das Sete Maravilhas do Mundo Antigo, na Babilônia?", ["Os Jardins Suspensos", "A Torre Eiffel", "O Cristo Redentor", "Machu Picchu"], 0, "Das sete maravilhas antigas, só a Grande Pirâmide de Gizé continua de pé."],
            ["Qual sistema dividia rigidamente a sociedade da Índia antiga em grupos fechados, em que se nascia e se morria no mesmo grupo?", ["O sistema de castas", "O feudalismo", "A democracia", "O capitalismo"], 0, "As castas eram ligadas à religião hindu. Hoje a discriminação por casta é proibida por lei na Índia."],
            ["O papel, a pólvora e a bússola foram inventados por qual civilização?", ["Os chineses", "Os romanos", "Os incas", "Os gregos"], 0, "Junto com a impressão, são chamadas de as quatro grandes invenções da China antiga."],
        ],
    }),
    quizMission({
        subject: "historia",
        level: 5,
        title: "História Geral: Os Povos da América e da África",
        icon: "🌎",
        description: "Maias, astecas, incas e os grandes reinos africanos",
        item: { name: "Máscara de Jade", icon: "🗿", description: "Uma máscara de um antigo rei da América. Usar dá XP de quem conhece outros povos." },
        questions: [
            ["Qual civilização da América Central tinha um calendário muito preciso e usava o número zero?", ["Os maias", "Os incas", "Os vikings", "Os persas"], 0, "Os maias também tinham escrita própria e cidades com grandes pirâmides, como Chichén Itzá."],
            ["Qual era a capital dos astecas, construída sobre um lago, onde hoje fica a Cidade do México?", ["Tenochtitlán", "Cusco", "Machu Picchu", "Roma"], 0, "Tenochtitlán tinha canais, jardins flutuantes e chegou a ter centenas de milhares de habitantes."],
            ["Qual famosa cidade inca fica no alto das montanhas dos Andes, no Peru?", ["Machu Picchu", "Tenochtitlán", "Chichén Itzá", "Timbuktu"], 0, "Machu Picchu foi construída no século XV e é Patrimônio da Humanidade."],
            ["O que eram os quipos, usados pelos incas?", ["Cordões com nós que serviam para registrar números e informações", "Armas de guerra", "Templos", "Barcos"], 0, "Sem escrita como a nossa, os incas guardavam dados de impostos e da população nos quipos."],
            ["Qual conquistador espanhol derrotou os astecas em 1521?", ["Hernán Cortés", "Francisco Pizarro", "Cristóvão Colombo", "Pedro Álvares Cabral"], 0, "Pizarro conquistou o Império Inca, na década de 1530."],
            ["Qual rei do Império do Mali, no século XIV, é considerado uma das pessoas mais ricas da história?", ["Mansa Musa", "Ramsés II", "Hamurábi", "Carlos Magno"], 0, "Em sua peregrinação a Meca, Mansa Musa levou tanto ouro que o preço do metal caiu no Egito."],
            ["Qual cidade africana do Império do Mali ficou famosa pelas suas bibliotecas e universidades?", ["Timbuktu", "Cairo", "Tenochtitlán", "Cusco"], 0, "Timbuktu guardava milhares de manuscritos de ciência, religião e direito."],
            ["Qual antigo reino da África Ocidental era tão rico em ouro que ficou conhecido como \"terra do ouro\"?", ["Reino de Gana", "Reino da Pérsia", "Reino de Castela", "Reino da Prússia"], 0, "O antigo Reino de Gana ficava onde hoje estão a Mauritânia e o Mali, longe do país Gana atual."],
            ["Qual antigo reino da atual Etiópia foi uma grande potência comercial e um dos primeiros a adotar o cristianismo?", ["Reino de Axum", "Reino de Gana", "Império Asteca", "Império Inca"], 0, "Axum tinha moeda própria e enormes obeliscos de pedra."],
            ["Por que muitos povos indígenas da América morreram depois da chegada dos europeus, além das guerras?", ["Por doenças trazidas pelos europeus, como a varíola, contra as quais não tinham defesa", "Porque fugiram para a Europa", "Por falta de comida no inverno europeu", "Porque não houve nenhuma morte"], 0, "As epidemias mataram milhões de pessoas e facilitaram a conquista."],
        ],
    }),
    quizMission({
        subject: "historia",
        level: 10,
        title: "História Geral: Reforma Protestante e Absolutismo",
        icon: "⛪",
        description: "Lutero, Calvino, a Contrarreforma, o mercantilismo e os reis absolutos",
        item: { name: "As 95 Teses", icon: "📃", description: "Uma cópia das teses pregadas na porta da igreja. Usar dá XP de quem entende as grandes rupturas." },
        questions: [
            ["Quem iniciou a Reforma Protestante ao publicar as 95 Teses, em 1517?", ["Martinho Lutero", "João Calvino", "Henrique VIII", "Inácio de Loyola"], 0, "Lutero criticava a venda de indulgências pela Igreja Católica."],
            ["O que eram as indulgências, criticadas por Lutero?", ["O perdão dos pecados oferecido pela Igreja em troca de dinheiro ou boas ações", "Impostos sobre o trigo", "Festas religiosas", "Livros proibidos"], 0, "A venda de indulgências financiava, entre outras coisas, obras da Igreja em Roma."],
            ["Qual reformador defendia a ideia de predestinação e influenciou países como a Suíça e a Holanda?", ["João Calvino", "Martinho Lutero", "Erasmo de Roterdã", "Galileu"], 0, "Para o calvinismo, Deus já escolheu quem será salvo, e o trabalho honesto era valorizado."],
            ["Qual rei da Inglaterra rompeu com o papa e criou a Igreja Anglicana?", ["Henrique VIII", "Luís XIV", "Carlos Magno", "Filipe II"], 0, "O papa não aceitou anular o casamento de Henrique VIII, que então se tornou chefe da Igreja na Inglaterra."],
            ["Como se chama a reação da Igreja Católica à Reforma, com o Concílio de Trento?", ["Contrarreforma (Reforma Católica)", "Renascimento", "Iluminismo", "Cruzadas"], 0, "A Contrarreforma reafirmou os dogmas católicos, fortaleceu a Inquisição e apoiou os jesuítas."],
            ["Qual rei francês é lembrado pela frase \"O Estado sou eu\"?", ["Luís XIV, o Rei Sol", "Luís XVI", "Napoleão Bonaparte", "Carlos Magno"], 0, "Luís XIV construiu o Palácio de Versalhes e é o grande símbolo do absolutismo."],
            ["O que defendia a teoria do direito divino dos reis?", ["Que o poder do rei vinha diretamente de Deus e por isso não podia ser questionado", "Que o povo escolhia o rei pelo voto", "Que a Igreja devia governar sozinha", "Que não deveria haver reis"], 0, "O francês Bossuet foi um dos principais defensores dessa teoria."],
            ["O que foi o mercantilismo?", ["O conjunto de práticas econômicas dos Estados modernos para acumular metais preciosos e vender mais do que comprar", "O comércio de produtos por computador", "Um tipo de feudalismo", "A economia dos povos indígenas"], 0, "Exploração de colônias, metalismo e balança comercial favorável eram ideias centrais."],
            ["Qual revolução inglesa de 1688 limitou o poder do rei e fortaleceu o Parlamento?", ["Revolução Gloriosa", "Revolução Francesa", "Revolução Russa", "Revolução Industrial"], 0, "Ela levou à Declaração de Direitos (Bill of Rights) de 1689."],
            ["Qual invenção do século XV ajudou as ideias de Lutero a se espalharem rapidamente pela Europa?", ["A imprensa de tipos móveis", "O telégrafo", "O rádio", "A fotografia"], 0, "Lutero também traduziu a Bíblia para o alemão, para que mais pessoas pudessem lê-la."],
        ],
    }),
    quizMission({
        subject: "historia",
        level: 15,
        title: "História Geral: Iluminismo e Revoluções",
        icon: "🗽",
        description: "As Luzes, a independência dos EUA, a Revolução Francesa e Napoleão",
        item: { name: "Tocha das Luzes", icon: "🔥", description: "A chama da razão que iluminou um século. Usar dá XP de quem entende as revoluções." },
        questions: [
            ["Por que o século XVIII ficou conhecido como o \"Século das Luzes\"?", ["Porque o Iluminismo valorizava a razão para iluminar e criticar a sociedade", "Porque foi inventada a lâmpada elétrica", "Porque não houve noites", "Por causa das fogueiras da Inquisição"], 0, "Os iluministas defendiam a razão, a liberdade e a crítica aos privilégios e ao absolutismo."],
            ["Qual pensador iluminista defendia fortemente a liberdade de expressão e criticava a intolerância religiosa?", ["Voltaire", "Luís XIV", "Martinho Lutero", "Maquiavel"], 0, "A ele se atribui a ideia de defender o direito de alguém falar, mesmo discordando do que diz."],
            ["Qual obra, organizada por Diderot e d'Alembert, tentou reunir todo o conhecimento da época?", ["A Enciclopédia", "A Bíblia de Gutenberg", "O Contrato Social", "A Divina Comédia"], 0, "A Enciclopédia espalhou as ideias iluministas por toda a Europa."],
            ["Em que ano as Treze Colônias declararam a independência dos Estados Unidos?", ["1776", "1789", "1822", "1492"], 0, "A Declaração de Independência, de 4 de julho de 1776, foi escrita principalmente por Thomas Jefferson."],
            ["Qual acontecimento de 14 de julho de 1789 marcou o início da Revolução Francesa?", ["A Queda da Bastilha", "A coroação de Napoleão", "A morte de Luís XIV", "A Batalha de Waterloo"], 0, "A Bastilha era uma prisão que simbolizava o poder absoluto do rei."],
            ["Qual documento de 1789 afirmou que \"os homens nascem e permanecem livres e iguais em direitos\"?", ["Declaração dos Direitos do Homem e do Cidadão", "Lei Áurea", "Carta Magna", "Código de Hamurábi"], 0, "Ele inspirou muitas constituições e a Declaração Universal dos Direitos Humanos, de 1948."],
            ["Qual código de leis criado por Napoleão influenciou o direito de muitos países, inclusive o Brasil?", ["O Código Civil napoleônico", "O Código de Hamurábi", "O Código Morse", "O Código de Trânsito"], 0, "O Código de 1804 garantia a igualdade perante a lei e o direito à propriedade."],
            ["O que foi o Bloqueio Continental decretado por Napoleão em 1806?", ["A proibição de os países europeus comerciarem com a Inglaterra", "Um muro em volta da França", "O fechamento dos portos franceses", "A proibição de viagens pelo mar"], 0, "Portugal desobedeceu ao bloqueio, foi invadido, e a família real fugiu para o Brasil."],
            ["Em qual batalha, de 1815, Napoleão foi derrotado definitivamente?", ["Waterloo", "Austerlitz", "Hastings", "Stalingrado"], 0, "Depois de Waterloo, Napoleão foi exilado na ilha de Santa Helena, no Atlântico Sul."],
            ["Qual país foi a primeira república negra do mundo, independente desde 1804 após uma revolução de escravizados?", ["Haiti", "Estados Unidos", "Brasil", "Jamaica"], 0, "A Revolução Haitiana, liderada por Toussaint Louverture e Jean-Jacques Dessalines, assustou os senhores de escravizados de toda a América."],
        ],
    }),
    quizMission({
        subject: "historia",
        level: 20,
        title: "História Geral: O Século XX",
        icon: "🕊️",
        description: "Revolução Russa, nazismo, Holocausto, descolonização e o fim da URSS",
        item: { name: "Pomba da Paz", icon: "🕊️", description: "Uma pomba de origami que lembra as lições do século XX. Usar dá XP de quem aprende com a história." },
        questions: [
            ["Qual revolução de 1917 levou os bolcheviques, liderados por Lênin, ao poder?", ["Revolução Russa", "Revolução Francesa", "Revolução Industrial", "Revolução Gloriosa"], 0, "A Revolução Russa deu origem, em 1922, à União Soviética (URSS)."],
            ["Qual regime, liderado por Adolf Hitler, governou a Alemanha de 1933 a 1945?", ["O nazismo", "O absolutismo", "A democracia liberal", "O feudalismo"], 0, "O nazismo era autoritário, racista e antissemita e levou o mundo à Segunda Guerra."],
            ["O que foi o Holocausto?", ["O genocídio de cerca de 6 milhões de judeus e de outros grupos perseguidos pelo regime nazista", "Uma batalha naval", "Uma crise econômica", "Um tratado de paz"], 0, "Ciganos, pessoas com deficiência e opositores políticos também foram perseguidos e assassinados."],
            ["Quem foi Anne Frank?", ["Uma menina judia que escreveu um diário enquanto se escondia dos nazistas em Amsterdã", "Uma rainha da Inglaterra", "Uma cientista russa", "Uma atriz de Hollywood"], 0, "O \"Diário de Anne Frank\" é um dos livros mais lidos do mundo."],
            ["Em quais cidades japonesas foram lançadas bombas atômicas em agosto de 1945?", ["Hiroshima e Nagasaki", "Tóquio e Osaka", "Pequim e Xangai", "Seul e Busan"], 0, "Foram as únicas vezes em que armas nucleares foram usadas numa guerra."],
            ["Qual líder da independência da Índia ficou famoso pela resistência pacífica (não violenta)?", ["Mahatma Gandhi", "Nelson Mandela", "Winston Churchill", "Lênin"], 0, "A Índia se tornou independente do Reino Unido em 1947."],
            ["O que foi o apartheid?", ["O regime de segregação racial oficial da África do Sul", "Um tratado de paz na Europa", "Um partido comunista", "Uma revolução industrial"], 0, "O apartheid durou de 1948 até o começo dos anos 1990."],
            ["Quem foi Nelson Mandela?", ["Um líder contra o apartheid que ficou 27 anos preso e virou o primeiro presidente negro da África do Sul", "O primeiro presidente dos Estados Unidos", "Um rei do Egito", "Um general da Primeira Guerra"], 0, "Mandela recebeu o Nobel da Paz em 1993 e foi eleito presidente em 1994."],
            ["Quem liderou a Revolução Chinesa de 1949, que criou a República Popular da China?", ["Mao Tsé-Tung", "Gandhi", "Stalin", "Fidel Castro"], 0, "Fidel Castro liderou a Revolução Cubana, em 1959."],
            ["Em que ano a União Soviética deixou de existir, dividida em vários países?", ["1991", "1917", "1945", "1989"], 0, "Com o fim da URSS, surgiram países como Rússia, Ucrânia, Cazaquistão e os países bálticos."],
        ],
    }),
]

export default missions
