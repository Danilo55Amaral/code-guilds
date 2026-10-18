import { MissionContent } from "../../../src/engine/missions";
import { quizMission } from "./quiz-materia";

// Missões de Cultura Geek pra Biblioteca de Missões (tomo de Cultura Geek): 5
// missões de 10 perguntas comentadas, nos níveis 1, 5, 10, 15 e 20: games,
// animações, quadrinhos, filmes, séries e a história dos videogames. Não
// repetem as perguntas das missões "Cultura Geek" e "Cultura Geek parte 2"
// (programacao-12-anos-parte-5.ts).
// Importar com:
//   npm run missions:import -- <e-mail do professor> scripts/missions/cultura-geek.ts
const missions: MissionContent[] = [
    quizMission({
        subject: "cultura-geek",
        level: 1,
        title: "Cultura Geek: Personagens Famosos",
        icon: "🎮",
        description: "Heróis dos games, das animações e dos quadrinhos",
        item: { name: "Controle Retrô", icon: "🎮", description: "Um controle de videogame dos anos 80, ainda funcionando. Usar dá XP de quem conhece os clássicos." },
        questions: [
            ["Qual é o nome do irmão do Mario, que usa roupa verde?", ["Luigi", "Wario", "Toad", "Yoshi"], 0, "Luigi apareceu pela primeira vez em Mario Bros., de 1983, e é mais alto que o irmão."],
            ["Como se chama a princesa que o Mario costuma resgatar?", ["Peach", "Zelda", "Daisy", "Leia"], 0, "A Princesa Peach governa o Reino dos Cogumelos. Zelda é a princesa da série The Legend of Zelda."],
            ["Qual é o nome do vilão tartaruga que vive raptando a princesa no Reino dos Cogumelos?", ["Bowser", "Ganon", "Eggman", "Coringa"], 0, "Bowser é o rei dos Koopas. O Dr. Eggman é o vilão do Sonic, e o Ganon, da série Zelda."],
            ["No jogo Minecraft, qual material é usado para fazer a ferramenta mais resistente (antes do netherite)?", ["Diamante", "Madeira", "Pedra", "Ouro"], 0, "As ferramentas de diamante são muito duráveis; o netherite é ainda mais forte."],
            ["Qual personagem da Disney é um boneco de neve que ama abraços quentinhos?", ["Olaf", "Stitch", "Baymax", "Groot"], 0, "Olaf é de Frozen (2013). Baymax é o robô de \"Operação Big Hero\"."],
            ["Na animação \"Divertida Mente\", qual emoção é azul e fica sempre triste?", ["Tristeza", "Alegria", "Raiva", "Medo"], 0, "Alegria é amarela, Raiva é vermelha, Medo é roxo, Nojinho é verde e Tristeza é azul."],
            ["Qual herói da Marvel usa uma armadura tecnológica e se chama Tony Stark?", ["Homem de Ferro", "Capitão América", "Hulk", "Gavião Arqueiro"], 0, "Tony Stark é um inventor bilionário. Steve Rogers é o Capitão América."],
            ["Qual personagem tem um escudo redondo com uma estrela no meio?", ["Capitão América", "Thor", "Mulher-Maravilha", "Lanterna Verde"], 0, "O escudo do Capitão América é feito de vibranium, um metal fictício do universo Marvel."],
            ["No desenho \"Bob Esponja\", onde mora o personagem principal?", ["Num abacaxi no fundo do mar", "Num navio pirata", "Numa concha na praia", "Num castelo"], 0, "Ele mora na Fenda do Biquíni, num abacaxi, com o caracol Gary."],
            ["Em Pokémon, qual objeto os treinadores usam para capturar os monstrinhos?", ["Pokébola", "Pokédex", "Insígnia", "Poção"], 0, "A Pokédex é a enciclopédia dos Pokémon, e as insígnias são conquistadas vencendo os líderes de ginásio."],
        ],
    }),
    quizMission({
        subject: "cultura-geek",
        level: 5,
        title: "Cultura Geek: Mundo dos Games",
        icon: "🕹️",
        description: "Gêneros de jogos, consoles e os games mais famosos",
        item: { name: "Fliperama de Mesa", icon: "🕹️", description: "Um mini fliperama com fichas infinitas. Usar dá XP de quem é jogador de verdade." },
        questions: [
            ["Como se chama o gênero de jogo em que o jogador controla um personagem e evolui seus atributos numa história, como em Pokémon?", ["RPG (Role-Playing Game)", "FPS", "Corrida", "Esporte"], 0, "RPG quer dizer \"jogo de interpretação de papéis\": o personagem ganha experiência e sobe de nível, como aqui na CodeGuilds!"],
            ["O que significa a sigla FPS nos games de tiro?", ["First-Person Shooter (tiro em primeira pessoa)", "Fast Play Speed", "Final Player Stage", "Free Power System"], 0, "No FPS a tela mostra o que o personagem vê. FPS também pode significar \"quadros por segundo\" (frames per second)."],
            ["Qual empresa japonesa criou os consoles Game Boy, Wii e Switch?", ["Nintendo", "Sony", "Microsoft", "Sega"], 0, "A Sony faz o PlayStation e a Microsoft faz o Xbox."],
            ["Qual empresa fabrica o console Xbox?", ["Microsoft", "Sony", "Nintendo", "Apple"], 0, "O primeiro Xbox foi lançado em 2001."],
            ["Em Fortnite, como se chama o modo em que 100 jogadores lutam até sobrar um?", ["Battle Royale", "Campanha", "Corrida", "Tower Defense"], 0, "No Battle Royale, a área do mapa vai diminuindo com a tempestade, forçando o confronto."],
            ["Qual jogo de blocos foi criado por Markus \"Notch\" Persson e lançado oficialmente em 2011?", ["Minecraft", "Roblox", "Tetris", "Terraria"], 0, "Minecraft é um dos jogos mais vendidos da história."],
            ["O que é um \"speedrun\"?", ["Terminar um jogo no menor tempo possível", "Jogar sem som", "Um jogo de corrida de carros", "Um tipo de console"], 0, "Speedrunners treinam rotas e truques para bater recordes de tempo."],
            ["Na série The Legend of Zelda, como se chama o reino onde acontecem as aventuras?", ["Hyrule", "Mushroom Kingdom", "Azeroth", "Tamriel"], 0, "Hyrule é governado pela família da princesa Zelda. Azeroth é do World of Warcraft e Tamriel, de The Elder Scrolls."],
            ["O que significa NPC nos jogos?", ["Non-Player Character: um personagem controlado pelo jogo, não por um jogador", "New Power Card", "Nível de Poder do Chefe", "Nome do Personagem Criado"], 0, "Vendedores, guardas e moradores das cidades dos jogos costumam ser NPCs."],
            ["Como se chama o último e mais difícil inimigo de uma fase ou de um jogo?", ["Chefão (boss)", "Mascote", "Tutorial", "Checkpoint"], 0, "O boss costuma ter muita vida e ataques especiais. O checkpoint é o ponto onde o jogo salva o progresso."],
        ],
    }),
    quizMission({
        subject: "cultura-geek",
        level: 10,
        title: "Cultura Geek: Animes e Mangás",
        icon: "🍥",
        description: "A cultura pop japonesa: animes, mangás e estúdios famosos",
        item: { name: "Mangá Volume 1", icon: "📕", description: "O primeiro volume de uma saga lendária, lido da direita pra esquerda. Usar dá XP de otaku." },
        questions: [
            ["O que é um mangá?", ["História em quadrinhos japonesa", "Desenho animado americano", "Um tipo de videogame", "Um filme de terror"], 0, "Os mangás tradicionais são lidos da direita para a esquerda. Quando viram desenho animado, viram animes."],
            ["Em que sentido se lê um mangá tradicional japonês?", ["Da direita para a esquerda", "Da esquerda para a direita", "De baixo para cima", "Em qualquer ordem"], 0, "É o sentido da escrita japonesa tradicional: a capa fica onde, para nós, seria a contracapa."],
            ["Qual personagem de Dragon Ball é um saiyajin que vira Super Saiyajin de cabelo dourado?", ["Goku", "Naruto", "Luffy", "Ichigo"], 0, "Dragon Ball foi criado por Akira Toriyama. Naruto é ninja, Luffy é pirata e Ichigo é do anime Bleach."],
            ["Em One Piece, qual é o sonho de Monkey D. Luffy?", ["Tornar-se o Rei dos Piratas", "Ser Hokage", "Vencer o torneio de artes marciais", "Ser mestre Pokémon"], 0, "Ser Hokage é o sonho do Naruto. Luffy procura o tesouro One Piece."],
            ["Em Naruto, como se chama a raposa de nove caudas selada dentro do protagonista?", ["Kurama", "Shenlong", "Totoro", "Gyarados"], 0, "Kurama é a Raposa de Nove Caudas. Shenlong é o dragão das esferas de Dragon Ball."],
            ["Qual estúdio japonês fez \"A Viagem de Chihiro\" e \"Meu Amigo Totoro\"?", ["Studio Ghibli", "Pixar", "DreamWorks", "Toei"], 0, "O Studio Ghibli tem como diretor mais famoso Hayao Miyazaki."],
            ["\"A Viagem de Chihiro\" ganhou qual prêmio importante em 2003?", ["O Oscar de Melhor Animação", "A Copa do Mundo", "O Nobel da Paz", "O Grammy"], 0, "Foi o primeiro anime a ganhar o Oscar de Melhor Filme de Animação."],
            ["O que é cosplay?", ["Fantasiar-se de um personagem e interpretá-lo", "Um tipo de anime", "Um jogo de cartas", "Um console japonês"], 0, "A palavra junta \"costume\" (fantasia) e \"play\" (interpretar). É comum em eventos geek."],
            ["Em Demon Slayer (Kimetsu no Yaiba), o que o protagonista Tanjiro quer fazer?", ["Transformar a irmã Nezuko de volta em humana", "Ser o Rei dos Piratas", "Vencer um torneio de beisebol", "Pilotar um robô gigante"], 0, "Nezuko foi transformada em demônio, e Tanjiro se torna caçador de demônios para salvá-la."],
            ["O que é um \"otaku\"?", ["Um fã muito dedicado de animes, mangás ou games", "Um tipo de comida japonesa", "Um golpe de karatê", "Um ninja"], 0, "No Japão a palavra já teve sentido negativo; no Brasil, muitos fãs a usam com orgulho."],
        ],
    }),
    quizMission({
        subject: "cultura-geek",
        level: 15,
        title: "Cultura Geek: Filmes, Séries e Sagas",
        icon: "🎬",
        description: "Grandes sagas do cinema, séries e o mundo da ficção científica",
        item: { name: "Claquete de Diretor", icon: "🎬", description: "\"Luz, câmera, ação!\" Usar dá XP de quem conhece as grandes sagas." },
        questions: [
            ["Na saga O Senhor dos Anéis, quem é o hobbit encarregado de destruir o Um Anel?", ["Frodo Bolseiro", "Bilbo Bolseiro", "Gandalf", "Aragorn"], 0, "Frodo leva o Anel até a Montanha da Perdição, com a ajuda do fiel Sam."],
            ["Quem escreveu O Senhor dos Anéis e O Hobbit?", ["J. R. R. Tolkien", "J. K. Rowling", "George Lucas", "C. S. Lewis"], 0, "Tolkien também criou idiomas para os elfos. C. S. Lewis escreveu As Crônicas de Nárnia."],
            ["Em Star Wars, quem revela ser o pai de Luke Skywalker?", ["Darth Vader", "Yoda", "Han Solo", "Obi-Wan Kenobi"], 0, "A revelação está em \"O Império Contra-Ataca\" (1980), uma das cenas mais famosas do cinema."],
            ["Qual saga de livros e filmes tem Katniss Everdeen como protagonista?", ["Jogos Vorazes", "Divergente", "Harry Potter", "Crepúsculo"], 0, "Katniss se oferece para os jogos no lugar da irmã, Prim."],
            ["Em \"De Volta para o Futuro\", qual carro vira a máquina do tempo?", ["Um DeLorean", "Um Fusca", "Um Batmóvel", "Um ônibus escolar"], 0, "O DeLorean precisa chegar a 88 milhas por hora para viajar no tempo."],
            ["Na série \"Stranger Things\", como se chama a dimensão sombria e assustadora?", ["Mundo Invertido", "Terra Média", "Nárnia", "Matrix"], 0, "O Mundo Invertido é uma cópia escura de Hawkins, a cidade da série."],
            ["Em Harry Potter, como se chama o esporte jogado em vassouras voadoras?", ["Quadribol", "Futebol mágico", "Polo aéreo", "Torneio Tribruxo"], 0, "No Quadribol, quem pega o pomo de ouro ganha 150 pontos. Harry era apanhador do time da Grifinória."],
            ["No filme \"Matrix\", o que acontece quando Neo toma a pílula vermelha?", ["Ele descobre a verdade sobre o mundo simulado", "Ele volta a dormir e esquece tudo", "Ele ganha superforça", "Ele viaja para o passado"], 0, "A pílula azul faria tudo continuar igual. A vermelha mostra a realidade."],
            ["Qual universo de super-heróis tem Batman, Superman e Mulher-Maravilha?", ["DC Comics", "Marvel", "Image", "Mauricio de Sousa"], 0, "A Marvel tem Homem-Aranha, Vingadores e X-Men."],
            ["Na série \"Doctor Who\", o que é a TARDIS?", ["A nave que viaja no tempo e no espaço, por fora parecida com uma cabine de polícia azul", "Um robô inimigo", "Um planeta", "Uma espada laser"], 0, "A TARDIS é \"maior por dentro\". Doctor Who é uma das séries de ficção científica mais antigas, de 1963."],
        ],
    }),
    quizMission({
        subject: "cultura-geek",
        level: 20,
        title: "Cultura Geek: A História dos Videogames",
        icon: "👾",
        description: "Do Pong aos jogos online: consoles, criadores e marcos dos games",
        item: { name: "Cartucho Lendário", icon: "👾", description: "Um cartucho dourado que funciona até sem assoprar. Usar dá XP de quem conhece a história dos games." },
        questions: [
            ["Qual jogo de 1972, uma espécie de pingue-pongue eletrônico, foi um dos primeiros grandes sucessos dos videogames?", ["Pong", "Pac-Man", "Tetris", "Space Invaders"], 0, "Pong foi lançado pela Atari e ajudou a criar a indústria dos games."],
            ["Qual empresa americana lançou o console Atari 2600, sucesso no fim dos anos 70?", ["Atari", "Nintendo", "Sony", "Sega"], 0, "O Atari 2600 popularizou os jogos em cartuchos dentro de casa."],
            ["Qual jogo de 1978, com naves alienígenas descendo em fileiras, foi um enorme sucesso nos fliperamas?", ["Space Invaders", "Pong", "Donkey Kong", "Doom"], 0, "Space Invaders foi criado no Japão por Tomohiro Nishikado."],
            ["Quem é o criador de Mario e Zelda, um dos game designers mais famosos do mundo?", ["Shigeru Miyamoto", "Hideo Kojima", "Satoru Iwata", "Markus Persson"], 0, "Miyamoto também criou Donkey Kong. Hideo Kojima criou Metal Gear."],
            ["Qual crise atingiu a indústria de games nos Estados Unidos em 1983, com excesso de jogos ruins?", ["O crash dos videogames de 1983", "A crise de 1929", "A bolha da internet", "A guerra dos consoles"], 0, "O jogo E.T., da Atari, virou símbolo da crise. O NES, da Nintendo, ajudou a recuperar o mercado."],
            ["Qual console da Sony, lançado em 1994, popularizou os jogos em CD?", ["PlayStation", "Nintendo 64", "Mega Drive", "Xbox"], 0, "O CD tinha muito mais espaço que os cartuchos, permitindo vídeos e músicas melhores."],
            ["Qual console da Sega ficou muito popular no Brasil nos anos 90, com o Sonic?", ["Mega Drive", "Super Nintendo", "Atari 2600", "GameCube"], 0, "No Brasil, a Tec Toy fabricava os consoles da Sega."],
            ["O que é um jogo \"indie\"?", ["Um jogo feito por desenvolvedores independentes, sem uma grande empresa", "Um jogo só para a Índia", "Um jogo sem gráficos", "Um jogo pirata"], 0, "Jogos indie como Stardew Valley, Hollow Knight e Celeste fizeram enorme sucesso."],
            ["O que são os eSports?", ["Competições profissionais de videogames", "Esportes jogados na chuva", "Aplicativos de exercício", "Jogos de tabuleiro"], 0, "Torneios de jogos como League of Legends, Valorant e Counter-Strike lotam arenas e têm milhões de espectadores."],
            ["Qual console da Nintendo, lançado em 2017, funciona tanto na TV quanto como portátil?", ["Nintendo Switch", "Wii U", "Game Boy Advance", "Nintendo DS"], 0, "O Switch juntou o console de casa com o portátil num só aparelho."],
        ],
    }),
]

export default missions
