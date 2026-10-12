import { MissionContent } from "../../../src/engine/missions";
import { quizMission } from "./quiz-materia";

// Missões de História pra Biblioteca de Missões (tomo de História): 5 missões
// de 10 perguntas comentadas, nos níveis 1, 5, 10, 15 e 20, com o conteúdo do
// fundamental e do ensino médio: Pré-História e Egito, Grécia e Roma, Idade
// Média, Brasil Colônia e Império, e o mundo contemporâneo e a República.
// O professor ajusta XP, moedas e itens no painel. Importar com:
//   npm run missions:import -- <e-mail do professor> scripts/missions/historia.ts
const missions: MissionContent[] = [
    quizMission({
        subject: "historia",
        level: 1,
        title: "História: Pré-História e Egito Antigo",
        icon: "🏺",
        description: "Os primeiros humanos, a escrita e as pirâmides do Egito",
        item: { name: "Vaso de Argila Antigo", icon: "🏺", description: "Um vaso de milhares de anos, sem nenhuma rachadura. Usar dá XP de quem conhece o começo da história." },
        questions: [
            ["Qual acontecimento costuma marcar o fim da Pré-História e o começo da História?", ["A invenção da escrita", "A descoberta do fogo", "A invenção da roda", "O fim dos dinossauros"], 0, "A escrita surgiu por volta de 3500 a.C., na Mesopotâmia. Com ela, os povos passaram a deixar registros escritos."],
            ["Como se chamava a escrita dos antigos egípcios, feita com desenhos e símbolos?", ["Hieróglifos", "Cuneiforme", "Alfabeto latino", "Runas"], 0, "Os hieróglifos foram decifrados por Champollion em 1822, com a ajuda da Pedra de Roseta. A escrita cuneiforme era a da Mesopotâmia."],
            ["Qual rio foi essencial para a civilização egípcia, por causa das cheias que fertilizavam o solo?", ["Nilo", "Amazonas", "Tigre", "Tâmisa"], 0, "As cheias do Nilo deixavam um lodo fértil nas margens. O historiador Heródoto disse que \"o Egito é uma dádiva do Nilo\"."],
            ["Como se chamava o rei do Egito Antigo, considerado um deus?", ["Faraó", "Imperador", "Czar", "Sultão"], 0, "O faraó tinha poder político e religioso. Tutancâmon e Ramsés II são alguns dos mais famosos."],
            ["As pirâmides de Gizé foram construídas principalmente para:", ["Servir de túmulo aos faraós", "Servir de casa para o povo", "Observar o mar", "Guardar os grãos de trigo"], 0, "As pirâmides eram túmulos. Os egípcios acreditavam na vida após a morte e por isso mumificavam os corpos."],
            ["O período em que os humanos começaram a praticar a agricultura e a criar animais é chamado de:", ["Neolítico (Idade da Pedra Polida)", "Paleolítico", "Idade Média", "Idade Contemporânea"], 0, "No Neolítico, com a agricultura, muitos grupos deixaram de ser nômades e passaram a viver em aldeias fixas."],
            ["Os grupos humanos do Paleolítico eram, em geral:", ["Nômades, caçadores e coletores", "Agricultores em grandes cidades", "Comerciantes com navios", "Operários de fábricas"], 0, "No Paleolítico, os grupos se mudavam atrás de comida, caçando, pescando e coletando frutos. Também dominaram o fogo."],
            ["As pinturas feitas pelos humanos pré-históricos nas paredes de cavernas e rochas são chamadas de:", ["Pinturas rupestres", "Afrescos", "Mosaicos", "Grafites"], 0, "No Brasil, o Parque Nacional da Serra da Capivara, no Piauí, tem milhares de pinturas rupestres e é Patrimônio da Humanidade."],
            ["A Mesopotâmia, onde surgiram algumas das primeiras cidades, ficava entre quais rios?", ["Tigre e Eufrates", "Nilo e Jordão", "Amazonas e Negro", "Reno e Danúbio"], 0, "Mesopotâmia quer dizer \"terra entre rios\". A região fica onde hoje é principalmente o Iraque."],
            ["Qual é o nome do fóssil humano mais antigo encontrado nas Américas, achado em Minas Gerais?", ["Luzia", "Lucy", "Otzi", "Tutancâmon"], 0, "Luzia tem cerca de 11 mil anos e foi achada em Lagoa Santa (MG). Lucy é um fóssil bem mais antigo de hominídeo, encontrado na Etiópia."],
        ],
    }),
    quizMission({
        subject: "historia",
        level: 5,
        title: "História: Grécia e Roma Antigas",
        icon: "🏛️",
        description: "A democracia de Atenas, Esparta, os Jogos Olímpicos e o Império Romano",
        item: { name: "Coroa de Louros", icon: "🌿", description: "A coroa dos campeões olímpicos da Grécia Antiga. Usar dá XP de quem conhece os clássicos." },
        questions: [
            ["Em qual cidade grega surgiu a democracia?", ["Atenas", "Esparta", "Roma", "Troia"], 0, "Em Atenas, por volta do século V a.C., os cidadãos votavam nas decisões da cidade. Mas mulheres, escravizados e estrangeiros não eram cidadãos."],
            ["O que significa a palavra \"democracia\"?", ["Governo do povo", "Governo de um só", "Governo dos ricos", "Governo dos deuses"], 0, "Vem do grego: demos (povo) e kratos (poder, governo)."],
            ["Esparta, rival de Atenas, era famosa por:", ["Sua sociedade militar, com treinamento rigoroso desde a infância", "Seus filósofos", "Ser a capital do Império Romano", "Suas pirâmides"], 0, "Os meninos espartanos começavam o treinamento militar aos 7 anos. A cidade valorizava a disciplina e a guerra."],
            ["Os Jogos Olímpicos da Antiguidade eram realizados na cidade de Olímpia em homenagem a qual deus?", ["Zeus", "Júpiter", "Rá", "Odin"], 0, "Os Jogos começaram em 776 a.C. em homenagem a Zeus, o principal deus grego. Júpiter era o equivalente romano."],
            ["Qual filósofo grego ficou famoso pela frase \"Só sei que nada sei\"?", ["Sócrates", "Platão", "Aristóteles", "Pitágoras"], 0, "Sócrates ensinava fazendo perguntas. Ele não deixou nada escrito: conhecemos suas ideias pelos textos do aluno Platão."],
            ["Segundo a lenda, Roma foi fundada pelos irmãos gêmeos:", ["Rômulo e Remo", "Castor e Pólux", "Caim e Abel", "Zeus e Hades"], 0, "A lenda conta que eles foram amamentados por uma loba. A data tradicional da fundação de Roma é 753 a.C."],
            ["Qual era a língua falada no Império Romano, que deu origem ao português?", ["Latim", "Grego", "Árabe", "Inglês"], 0, "O português, o espanhol, o francês e o italiano são línguas neolatinas, que vieram do latim falado pelo povo."],
            ["As grandes lutas de gladiadores aconteciam em qual construção famosa de Roma?", ["Coliseu", "Partenon", "Pirâmide de Gizé", "Muralha da China"], 0, "O Coliseu recebia dezenas de milhares de pessoas. O Partenon é um templo grego, em Atenas."],
            ["Qual imperador romano é conhecido como o primeiro imperador de Roma?", ["Augusto (Otávio)", "Nero", "Júlio César", "Constantino"], 0, "Júlio César foi ditador, mas não imperador. O sobrinho dele, Otávio, recebeu o título de Augusto em 27 a.C. e virou o primeiro imperador."],
            ["Em qual ano é marcada a queda do Império Romano do Ocidente, que encerra a Antiguidade?", ["476", "1500", "1453", "1789"], 0, "Em 476, o último imperador romano do Ocidente foi deposto. A data marca o início da Idade Média. (1453 é a queda de Constantinopla.)"],
        ],
    }),
    quizMission({
        subject: "historia",
        level: 10,
        title: "História: Idade Média e Grandes Navegações",
        icon: "🏰",
        description: "Feudalismo, castelos, cruzadas e a chegada dos europeus à América",
        item: { name: "Estandarte do Castelo", icon: "🏰", description: "A bandeira do castelo mais forte do reino. Usar dá XP de quem viajou pela Idade Média." },
        questions: [
            ["Como se chamava o sistema da Idade Média em que os servos trabalhavam a terra de um senhor em troca de proteção?", ["Feudalismo", "Capitalismo", "Socialismo", "Democracia"], 0, "No feudalismo, a terra (o feudo) era a principal riqueza. Os servos pagavam com trabalho e parte da produção."],
            ["Qual era a instituição mais poderosa da Europa na Idade Média?", ["A Igreja Católica", "As fábricas", "Os bancos", "A ONU"], 0, "A Igreja tinha muitas terras, influência política e controlava a educação e boa parte da cultura da época."],
            ["O que foram as Cruzadas?", ["Expedições militares e religiosas de cristãos europeus em direção a Jerusalém e à Terra Santa", "Viagens para a América", "Festas nos castelos", "Os jogos dos cavaleiros"], 0, "As Cruzadas aconteceram entre os séculos XI e XIII e também aumentaram o comércio entre a Europa e o Oriente."],
            ["Qual doença matou cerca de um terço da população europeia no século XIV?", ["A peste negra (peste bubônica)", "A gripe espanhola", "A covid-19", "A varíola"], 0, "A peste negra era transmitida pelas pulgas dos ratos e se espalhou pela Europa por volta de 1347 a 1351."],
            ["Qual movimento cultural, iniciado na Itália, valorizou o ser humano, a razão e a arte da Antiguidade clássica?", ["Renascimento", "Feudalismo", "Iluminismo", "Barroco"], 0, "O Renascimento (séculos XIV a XVI) teve artistas como Leonardo da Vinci, autor da Mona Lisa, e Michelangelo."],
            ["Em 1492, Cristóvão Colombo, navegando a serviço da Espanha, chegou:", ["À América", "À Índia", "À China", "À África do Sul"], 0, "Colombo queria chegar às Índias navegando para o oeste e acabou chegando a ilhas do Caribe, na América."],
            ["Quem comandou a frota portuguesa que chegou ao Brasil em 1500?", ["Pedro Álvares Cabral", "Vasco da Gama", "Cristóvão Colombo", "Fernão de Magalhães"], 0, "Cabral chegou ao litoral da atual Bahia em 22 de abril de 1500. Vasco da Gama foi quem chegou à Índia por mar, em 1498."],
            ["Qual foi o tratado de 1494 que dividiu as terras \"descobertas\" e a descobrir entre Portugal e Espanha?", ["Tratado de Tordesilhas", "Tratado de Versalhes", "Tratado de Madri", "Tratado de Paris"], 0, "Uma linha imaginária a 370 léguas de Cabo Verde dividiu o mundo: o leste para Portugal e o oeste para a Espanha."],
            ["Quem já vivia nas terras que hoje formam o Brasil quando os portugueses chegaram?", ["Milhões de indígenas de muitos povos diferentes", "Ninguém", "Só os espanhóis", "Os romanos"], 0, "Estima-se que havia alguns milhões de indígenas, de centenas de povos e línguas, como os tupis, os guaranis e os jês."],
            ["Qual invenção do século XV, atribuída a Gutenberg, ajudou a espalhar o conhecimento pela Europa?", ["A prensa de tipos móveis (imprensa)", "O telefone", "A máquina a vapor", "A lâmpada elétrica"], 0, "A prensa de Gutenberg, por volta de 1450, permitiu imprimir livros muito mais rápido e barato do que copiar à mão."],
        ],
    }),
    quizMission({
        subject: "historia",
        level: 15,
        title: "História: Brasil Colônia e Império",
        icon: "👑",
        description: "Cana-de-açúcar, ouro, Independência, Império e abolição",
        item: { name: "Coroa Imperial", icon: "👑", description: "Uma réplica da coroa do Império do Brasil. Usar dá XP de quem conhece a história do país." },
        questions: [
            ["Qual foi o primeiro produto explorado pelos portugueses no Brasil e que deu nome ao país?", ["O pau-brasil", "O café", "O ouro", "A borracha"], 0, "O pau-brasil tinha uma tinta vermelha usada pra tingir tecidos na Europa. A cor de brasa deu nome à árvore e ao país."],
            ["Qual foi a principal atividade econômica do Nordeste brasileiro nos séculos XVI e XVII?", ["A produção de açúcar nos engenhos", "A mineração de ouro", "As fábricas de tecido", "O café"], 0, "O açúcar era produzido nos engenhos com o trabalho de pessoas escravizadas trazidas da África e vendido para a Europa."],
            ["O que foi o Quilombo dos Palmares?", ["Uma grande comunidade formada por pessoas que fugiram da escravidão, na Serra da Barriga", "Um engenho de açúcar", "Uma vila portuguesa", "Um forte holandês"], 0, "Palmares resistiu por quase cem anos. Seu líder mais famoso, Zumbi, morreu em 20 de novembro de 1695, data do Dia da Consciência Negra."],
            ["No século XVIII, a descoberta de ouro levou o centro da economia colonial para qual região?", ["Minas Gerais", "Rio Grande do Sul", "Amazonas", "Pernambuco"], 0, "O ciclo do ouro fez crescer cidades como Vila Rica (atual Ouro Preto) e levou a capital da colônia para o Rio de Janeiro, em 1763."],
            ["Qual movimento de 1789 em Minas Gerais queria a independência e teve Tiradentes como líder mais lembrado?", ["Inconfidência Mineira", "Revolta da Vacina", "Guerra de Canudos", "Cabanagem"], 0, "Os inconfidentes foram denunciados antes de agir. Tiradentes foi enforcado em 21 de abril de 1792, hoje feriado nacional."],
            ["Por que a família real portuguesa veio para o Brasil em 1808?", ["Para fugir da invasão de Portugal pelas tropas de Napoleão", "Para passar as férias", "Porque Portugal afundou", "Para comprar café"], 0, "Com a vinda da corte, o Rio virou a sede do Império Português, e os portos brasileiros foram abertos às nações amigas."],
            ["Quem proclamou a Independência do Brasil, em 7 de setembro de 1822?", ["Dom Pedro I", "Dom João VI", "Dom Pedro II", "Tiradentes"], 0, "Dom Pedro I, filho de D. João VI, declarou a independência às margens do riacho Ipiranga, em São Paulo, e virou imperador."],
            ["Quem governou o Brasil por quase 50 anos no Segundo Reinado?", ["Dom Pedro II", "Dom Pedro I", "Getúlio Vargas", "Deodoro da Fonseca"], 0, "Dom Pedro II assumiu com apenas 14 anos, em 1840 (o Golpe da Maioridade), e governou até a Proclamação da República, em 1889."],
            ["Qual lei, assinada em 13 de maio de 1888, aboliu a escravidão no Brasil?", ["Lei Áurea", "Lei do Ventre Livre", "Lei dos Sexagenários", "Lei Eusébio de Queirós"], 0, "A Lei Áurea, assinada pela princesa Isabel, foi o resultado de muita luta do movimento abolicionista e das próprias pessoas escravizadas. O Brasil foi o último país das Américas a abolir a escravidão."],
            ["Qual foi o principal produto de exportação do Brasil no século XIX?", ["O café", "O açúcar", "O ouro", "O petróleo"], 0, "O café se espalhou pelo Vale do Paraíba e pelo oeste paulista e fez de São Paulo um centro econômico do país."],
        ],
    }),
    quizMission({
        subject: "historia",
        level: 20,
        title: "História: O Mundo Contemporâneo e o Brasil República",
        icon: "🌎",
        description: "Revoluções, as guerras mundiais, a Guerra Fria e a República brasileira",
        item: { name: "Locomotiva a Vapor", icon: "🚂", description: "Uma miniatura da máquina que mudou o mundo. Usar dá XP de quem entende o mundo de hoje." },
        questions: [
            ["A Revolução Industrial, que começou na Inglaterra no século XVIII, foi marcada por:", ["Máquinas a vapor e fábricas substituindo a produção artesanal", "O fim da agricultura no mundo", "A invenção da escrita", "A volta do feudalismo"], 0, "Com as máquinas, a produção cresceu muito. As cidades também cresceram, e os operários trabalhavam em condições muito duras."],
            ["Qual foi o lema da Revolução Francesa de 1789?", ["Liberdade, Igualdade, Fraternidade", "Ordem e Progresso", "Paz, Terra e Pão", "Independência ou Morte"], 0, "A Revolução Francesa derrubou a monarquia absolutista e espalhou ideias do Iluminismo. \"Ordem e Progresso\" está na bandeira do Brasil."],
            ["Quem proclamou a República no Brasil, em 15 de novembro de 1889?", ["Marechal Deodoro da Fonseca", "Dom Pedro II", "Getúlio Vargas", "Tiradentes"], 0, "Deodoro liderou o movimento militar que derrubou a monarquia e se tornou o primeiro presidente do Brasil."],
            ["Em que período aconteceu a Primeira Guerra Mundial?", ["1914 a 1918", "1939 a 1945", "1822 a 1825", "1964 a 1985"], 0, "A Primeira Guerra começou após o assassinato do arquiduque Francisco Ferdinando, herdeiro do trono da Áustria-Hungria, em 1914."],
            ["Em que período aconteceu a Segunda Guerra Mundial?", ["1939 a 1945", "1914 a 1918", "1950 a 1953", "1789 a 1799"], 0, "A Segunda Guerra foi o conflito mais mortal da história. O Brasil enviou soldados, os pracinhas da FEB, para lutar na Itália."],
            ["O que foi a Guerra Fria?", ["A disputa entre Estados Unidos e União Soviética, sem confronto direto entre os dois, após a Segunda Guerra", "Uma guerra no Polo Norte", "Uma guerra na Idade Média", "Uma guerra entre Brasil e Argentina"], 0, "Capitalismo contra socialismo: as duas potências disputavam influência, armas nucleares e até a corrida espacial."],
            ["Qual muro, símbolo da Guerra Fria, caiu em 1989?", ["O Muro de Berlim", "A Muralha da China", "O Muro das Lamentações", "O Muro de Adriano"], 0, "O Muro de Berlim dividia a cidade alemã desde 1961. A queda dele, em 1989, marcou o fim da Guerra Fria."],
            ["Qual presidente brasileiro criou a CLT, com direitos como férias e salário mínimo, e governou durante o Estado Novo?", ["Getúlio Vargas", "Juscelino Kubitschek", "Deodoro da Fonseca", "Dom Pedro II"], 0, "A CLT (Consolidação das Leis do Trabalho) é de 1943, criada durante o Estado Novo de Vargas (1937 a 1945)."],
            ["Qual presidente construiu Brasília, inaugurada em 1960?", ["Juscelino Kubitschek (JK)", "Getúlio Vargas", "Jânio Quadros", "Deodoro da Fonseca"], 0, "JK prometia \"50 anos em 5\". Brasília, projetada por Lúcio Costa e Oscar Niemeyer, levou a capital do Rio para o centro do país."],
            ["Qual documento, de 1988, é a atual Constituição do Brasil, chamada de \"Constituição Cidadã\"?", ["A Constituição Federal de 1988", "A Lei Áurea", "O Tratado de Tordesilhas", "A Carta Magna inglesa"], 0, "A Constituição de 1988 veio depois da ditadura militar (1964 a 1985) e garantiu direitos como o voto direto, a saúde e a educação."],
        ],
    }),
]

export default missions
