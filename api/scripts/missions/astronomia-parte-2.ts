import { MissionContent } from "../../../src/engine/missions";
import { quizMission } from "./quiz-materia";

// Mais 5 missões de Astronomia (tomo de Astronomia), nos níveis 1, 5, 10, 15 e
// 20: observar o céu, a corrida espacial, as luas do Sistema Solar, telescópios
// e luz, e a busca por vida no universo. Não repetem as perguntas de
// astronomia.ts nem as do evento Astronomia em: Salve o Wi-Fi!.
// Importar com:
//   npm run missions:import -- <e-mail do professor> scripts/missions/astronomia-parte-2.ts
const missions: MissionContent[] = [
    quizMission({
        subject: "astronomia",
        level: 1,
        title: "Astronomia: Observando o Céu",
        icon: "🔭",
        description: "O que dá pra ver a olho nu, a cor do céu e as auroras",
        item: { name: "Binóculo de Astrônomo", icon: "🔭", description: "Mostra as crateras da Lua do quintal de casa. Usar dá XP de quem observa o céu." },
        questions: [
            ["Quantos planetas, além da Terra, podemos ver a olho nu no céu noturno?", ["5: Mercúrio, Vênus, Marte, Júpiter e Saturno", "Nenhum", "Todos os 7", "Só Marte"], 0, "Eles parecem estrelas brilhantes que não piscam tanto. Urano e Netuno precisam de telescópio."],
            ["Por que vemos bem menos estrelas nas grandes cidades?", ["Por causa da poluição luminosa, a luz artificial que clareia o céu", "Porque as estrelas fogem das cidades", "Porque os prédios tampam todas", "Porque na cidade é sempre dia"], 0, "Em lugares bem escuros, longe das cidades, dá para ver milhares de estrelas e até a Via Láctea."],
            ["Qual fase da Lua é a melhor para observar estrelas fracas e a Via Láctea?", ["Lua Nova, porque o céu fica mais escuro", "Lua Cheia", "Quarto Crescente", "Tanto faz"], 0, "A luz da Lua Cheia clareia o céu e esconde as estrelas mais fracas."],
            ["É possível ver a Lua durante o dia?", ["Sim, em muitos dias do mês ela aparece no céu de dia", "Não, ela só aparece à noite", "Só em eclipses", "Só no inverno"], 0, "A Lua passa cerca de metade do tempo acima do horizonte de dia; dá para vê-la com o céu azul."],
            ["O que é um planetário?", ["Um lugar com uma cúpula onde um projetor mostra o céu e os astros", "Um planeta pequeno", "Um tipo de telescópio de bolso", "Um museu de rochas"], 0, "Em um planetário dá para ver o céu de qualquer época e lugar, mesmo de dia."],
            ["Por que o céu é azul durante o dia?", ["Porque a atmosfera espalha mais a luz azul do Sol do que as outras cores", "Porque reflete a cor do mar", "Porque o espaço é azul", "Porque o Sol é azul"], 0, "Esse espalhamento da luz pelas moléculas do ar se chama espalhamento de Rayleigh."],
            ["Por que o céu fica alaranjado ou avermelhado no pôr do sol?", ["Porque a luz do Sol atravessa mais atmosfera, e o azul é espalhado antes de chegar até nós", "Porque o Sol esquenta o céu", "Porque o Sol muda de cor", "Por causa das nuvens de chuva"], 0, "Com o Sol baixo, a luz percorre um caminho maior no ar, e sobram mais o laranja e o vermelho."],
            ["O que causa as auroras (boreal e austral), luzes coloridas no céu perto dos polos?", ["Partículas do Sol que interagem com o campo magnético e a atmosfera da Terra", "Fogos de artifício", "O reflexo do gelo", "A luz da Lua"], 0, "As partículas do vento solar fazem os gases da atmosfera brilharem em verde, rosa e roxo."],
            ["O que é um eclipse solar anular?", ["Quando a Lua está mais longe e não cobre o Sol inteiro, deixando um anel de luz em volta", "Quando a Lua fica vermelha", "Quando o Sol some por um dia", "Quando a Terra tampa a Lua"], 0, "Ele é chamado de \"anel de fogo\". Nunca olhe sem proteção própria."],
            ["O que Galileu Galilei viu ao apontar sua luneta para a Lua, em 1609?", ["Montanhas e crateras, mostrando que a Lua não era lisa e perfeita", "Cidades de extraterrestres", "Rios de água", "Uma Lua de cristal"], 0, "Isso contrariava a ideia antiga de que os astros eram esferas perfeitas."],
        ],
    }),
    quizMission({
        subject: "astronomia",
        level: 5,
        title: "Astronomia: A Corrida Espacial",
        icon: "🚀",
        description: "Os primeiros astronautas, as agências espaciais e as missões a Marte",
        item: { name: "Capacete de Astronauta", icon: "🚀", description: "O capacete de quem já foi ao espaço. Usar dá XP de quem sonha com as estrelas." },
        questions: [
            ["Quem foi o primeiro ser humano a ir ao espaço, em 1961?", ["Yuri Gagarin", "Neil Armstrong", "Buzz Aldrin", "Marcos Pontes"], 0, "Gagarin, da União Soviética, deu uma volta na Terra na nave Vostok 1 e disse \"A Terra é azul!\"."],
            ["Qual foi o primeiro animal a orbitar a Terra, em 1957?", ["A cadela Laika", "Um macaco chamado Albert", "Um gato", "Uma tartaruga"], 0, "Laika foi a bordo do Sputnik 2. Ela não sobreviveu à missão, que ajudou a preparar os voos humanos."],
            ["Quem foi a primeira mulher a ir ao espaço, em 1963?", ["Valentina Tereshkova", "Sally Ride", "Marie Curie", "Valentina Gagarina"], 0, "A soviética Valentina Tereshkova ficou quase 3 dias em órbita. Sally Ride foi a primeira americana, em 1983."],
            ["Como se chamava a missão que levou os primeiros humanos à Lua, em 1969?", ["Apollo 11", "Sputnik 1", "Gemini 4", "Artemis 1"], 0, "A Apollo 11 levou Neil Armstrong, Buzz Aldrin e Michael Collins."],
            ["Quem foi o primeiro astronauta brasileiro a ir ao espaço, em 2006?", ["Marcos Pontes", "Santos Dumont", "Yuri Gagarin", "César Lattes"], 0, "Marcos Pontes ficou alguns dias na Estação Espacial Internacional."],
            ["O que é a NASA?", ["A agência espacial dos Estados Unidos", "Um foguete russo", "Um planeta anão", "Um telescópio europeu"], 0, "A NASA foi criada em 1958. A ESA é a agência europeia e a AEB, a brasileira."],
            ["Onde fica o Centro de Lançamento de Alcântara, uma base de lançamento de foguetes do Brasil?", ["No Maranhão", "Em São Paulo", "No Rio Grande do Sul", "No Amazonas"], 0, "Por estar perto do Equador, Alcântara gasta menos combustível para lançar foguetes."],
            ["Como se chamam os robôs com rodas, como o Curiosity e o Perseverance, que exploram a superfície de Marte?", ["Rovers (jipes-robôs)", "Satélites", "Sondas solares", "Ônibus espaciais"], 0, "O Perseverance chegou a Marte em 2021 levando até um pequeno helicóptero, o Ingenuity."],
            ["Qual programa da NASA quer levar seres humanos de volta à Lua neste século?", ["Artemis", "Apollo", "Vostok", "Gemini"], 0, "Na mitologia grega, Ártemis é a irmã gêmea de Apolo."],
            ["O que era o ônibus espacial (Space Shuttle)?", ["Uma nave que decolava como foguete e pousava como avião, podendo ser reutilizada", "Um ônibus que leva turistas ao espaço até hoje", "Um satélite de TV", "Uma estação espacial"], 0, "Os ônibus espaciais voaram de 1981 a 2011 e ajudaram a montar a Estação Espacial Internacional."],
        ],
    }),
    quizMission({
        subject: "astronomia",
        level: 10,
        title: "Astronomia: As Luas do Sistema Solar",
        icon: "🌘",
        description: "Europa, Titã, Io, Ganimedes, Encélado e outras luas incríveis",
        item: { name: "Coleção de Luas", icon: "🌘", description: "Mini luas de vários planetas num estojo de veludo. Usar dá XP de quem conhece cada uma." },
        questions: [
            ["Qual é a maior lua do Sistema Solar, maior até que o planeta Mercúrio?", ["Ganimedes, de Júpiter", "A Lua, da Terra", "Titã, de Saturno", "Fobos, de Marte"], 0, "Ganimedes também é a única lua conhecida com campo magnético próprio."],
            ["Qual lua de Júpiter tem um oceano de água salgada escondido debaixo de uma crosta de gelo?", ["Europa", "Io", "Calisto", "Tritão"], 0, "Por causa desse oceano, Europa é um dos lugares mais promissores para procurar vida."],
            ["Qual lua de Júpiter é o lugar com mais vulcões ativos do Sistema Solar?", ["Io", "Europa", "Ganimedes", "Titã"], 0, "A gravidade de Júpiter \"aperta\" Io o tempo todo, e esse calor alimenta os vulcões."],
            ["Qual lua de Saturno tem uma atmosfera grossa e lagos de metano líquido?", ["Titã", "Encélado", "Mimas", "Fobos"], 0, "Titã é a única lua com atmosfera densa. A sonda Huygens pousou lá em 2005."],
            ["Qual lua de Saturno lança jatos de água para o espaço por rachaduras no gelo do polo sul?", ["Encélado", "Titã", "Io", "Caronte"], 0, "Os jatos de Encélado foram descobertos pela sonda Cassini."],
            ["Como se chamam as duas pequenas luas de Marte?", ["Fobos e Deimos", "Io e Europa", "Titã e Reia", "Tritão e Nereida"], 0, "Os nomes significam \"medo\" e \"terror\", filhos de Ares (Marte) na mitologia grega."],
            ["Qual é a maior lua de Plutão, tão grande que os dois giram em volta de um ponto entre eles?", ["Caronte", "Tritão", "Fobos", "Titã"], 0, "Caronte tem cerca de metade do diâmetro de Plutão."],
            ["Qual lua de Netuno gira em volta do planeta no sentido contrário ao da rotação dele?", ["Tritão", "Europa", "Fobos", "Calisto"], 0, "Essa órbita \"ao contrário\" indica que Tritão pode ter sido capturado pela gravidade de Netuno."],
            ["Qual é a hipótese mais aceita para a origem da Lua da Terra?", ["Um grande impacto de um corpo do tamanho de Marte com a Terra jovem, cujos detritos formaram a Lua", "A Lua veio de outra galáxia", "A Lua sempre esteve lá desde o Big Bang", "A Lua é um pedaço do Sol"], 0, "O corpo que teria batido na Terra é chamado de Theia."],
            ["Qual lua de Saturno tem uma cratera tão grande que lembra a Estrela da Morte de Star Wars?", ["Mimas", "Titã", "Ganimedes", "Io"], 0, "A cratera Herschel tem cerca de um terço do diâmetro de Mimas."],
        ],
    }),
    quizMission({
        subject: "astronomia",
        level: 15,
        title: "Astronomia: Telescópios e a Luz",
        icon: "📡",
        description: "Tipos de telescópio, o espectro da luz e os grandes observatórios",
        item: { name: "Antena de Radiotelescópio", icon: "📡", description: "Escuta os sussurros do universo. Usar dá XP de quem enxerga o invisível." },
        questions: [
            ["Qual é a diferença entre um telescópio refrator e um refletor?", ["O refrator usa lentes; o refletor usa espelhos", "O refrator usa espelhos; o refletor usa lentes", "Não há diferença", "O refletor só funciona de dia"], 0, "Isaac Newton construiu um dos primeiros telescópios refletores, em 1668."],
            ["Por que os grandes telescópios usam espelhos enormes?", ["Porque quanto maior o espelho, mais luz ele capta e mais detalhes mostra", "Porque espelhos são mais bonitos", "Para refletir a luz do Sol", "Para servir de enfeite"], 0, "Coletar mais luz permite ver objetos fracos e muito distantes."],
            ["O que um radiotelescópio capta?", ["Ondas de rádio emitidas pelos astros", "Músicas das rádios da Terra", "Apenas a luz visível", "Sons do espaço"], 0, "Com ondas de rádio dá para estudar o gás frio das galáxias, pulsares e quasares."],
            ["Por que muitos observatórios ficam no alto de montanhas, em lugares secos como o deserto do Atacama?", ["Porque lá o ar é seco, limpo e há menos atmosfera e luz atrapalhando", "Porque fica mais perto das estrelas", "Porque é mais barato", "Porque lá não tem gravidade"], 0, "O Chile abriga grandes observatórios, como o ALMA e o futuro ELT."],
            ["Qual destas \"cores\" de luz nossos olhos NÃO conseguem ver?", ["Infravermelho", "Vermelho", "Verde", "Azul"], 0, "Infravermelho, ultravioleta, raios X e ondas de rádio fazem parte do espectro, mas são invisíveis para nós."],
            ["Por que os telescópios de raios X precisam ficar no espaço?", ["Porque a atmosfera da Terra bloqueia os raios X", "Porque os raios X só existem em Marte", "Porque são muito pesados", "Porque precisam de gravidade zero para funcionar"], 0, "Ainda bem: a atmosfera nos protege dessa radiação perigosa."],
            ["O que é a espectroscopia, usada pelos astrônomos?", ["A análise da luz separada em cores, que revela a composição e o movimento dos astros", "A fotografia de estrelas", "A medição do tamanho dos planetas com régua", "O estudo das constelações"], 0, "Cada elemento químico deixa linhas próprias no espectro, como uma impressão digital."],
            ["Qual instituição brasileira, fundada em 1827 no Rio de Janeiro, é uma das mais antigas do país dedicadas à astronomia?", ["Observatório Nacional", "Museu Nacional", "Instituto Butantan", "Biblioteca Nacional"], 0, "O Observatório Nacional também é responsável pela hora legal brasileira."],
            ["O que é uma luneta?", ["Um telescópio pequeno do tipo refrator, com lentes", "Uma lua pequena", "Um óculos de sol", "Um tipo de satélite"], 0, "Galileu usou uma luneta para fazer suas descobertas no século XVII."],
            ["Por que muitos astrônomos usam lanterna de luz vermelha ao observar o céu à noite?", ["Porque a luz vermelha atrapalha menos a adaptação dos olhos ao escuro", "Porque atrai as estrelas", "Porque a luz vermelha esquenta o telescópio", "Porque é mais bonita nas fotos"], 0, "Os olhos levam uns 20 a 30 minutos para se adaptar ao escuro, e uma luz branca forte desfaz essa adaptação."],
        ],
    }),
    quizMission({
        subject: "astronomia",
        level: 20,
        title: "Astronomia: A Busca por Vida no Universo",
        icon: "👽",
        description: "Astrobiologia, extremófilos, a equação de Drake e o paradoxo de Fermi",
        item: { name: "Mensagem para as Estrelas", icon: "📨", description: "Um recado da Terra pra quem estiver ouvindo. Usar dá XP de quem procura vida lá fora." },
        questions: [
            ["Qual ciência estuda a origem, a evolução e a possibilidade de vida fora da Terra?", ["Astrobiologia", "Astrologia", "Geologia", "Meteorologia"], 0, "A astrobiologia junta astronomia, biologia, química e geologia."],
            ["O que são extremófilos?", ["Seres vivos que sobrevivem em condições extremas, como muito calor, frio, sal ou radiação", "Alienígenas", "Animais extintos", "Planetas gelados"], 0, "Os tardígrados, os \"ursos-d'água\", aguentam até o vácuo do espaço por um tempo."],
            ["Para que serve a equação de Drake, criada em 1961?", ["Para estimar quantas civilizações capazes de se comunicar podem existir na nossa galáxia", "Para calcular a idade do Sol", "Para medir a distância até a Lua", "Para prever eclipses"], 0, "Ela multiplica fatores como o número de estrelas, de planetas e a chance de surgir vida inteligente."],
            ["O que pergunta o paradoxo de Fermi?", ["Se o universo é tão grande e antigo, por que ainda não encontramos sinais de outras civilizações?", "Por que a Lua mostra sempre a mesma face?", "Por que o céu é azul?", "Por que Plutão não é planeta?"], 0, "O físico Enrico Fermi teria perguntado: \"Onde está todo mundo?\"."],
            ["O que faz o projeto SETI?", ["Procura sinais de rádio ou de luz que possam ter sido enviados por civilizações extraterrestres", "Lança foguetes para Marte", "Estuda os dinossauros", "Fabrica telescópios de bolso"], 0, "SETI quer dizer \"busca por inteligência extraterrestre\", em inglês."],
            ["Que evidência os robôs encontraram de que Marte já teve água líquida?", ["Leitos de rios secos, minerais que se formam na água e antigos deltas", "Peixes fossilizados", "Oceanos cheios hoje", "Nuvens de chuva"], 0, "Hoje a água de Marte está congelada nos polos e no subsolo."],
            ["O que é uma bioassinatura, procurada na atmosfera de exoplanetas?", ["Um sinal químico que pode indicar a presença de vida, como certas combinações de gases", "A assinatura de um astronauta", "Uma foto de um alienígena", "O nome de um planeta"], 0, "O oxigênio junto com o metano, por exemplo, seria um sinal interessante."],
            ["O sistema TRAPPIST-1, a cerca de 40 anos-luz, ficou famoso por quê?", ["Tem sete planetas do tamanho da Terra, alguns na zona habitável", "É uma galáxia anã", "É um buraco negro próximo", "É a estrela mais quente conhecida"], 0, "Ele é um dos melhores lugares para estudar atmosferas de planetas rochosos."],
            ["O que foi a mensagem de Arecibo, de 1974?", ["Uma mensagem de rádio enviada da Terra para um aglomerado de estrelas, com informações sobre a humanidade", "Um sinal recebido de alienígenas", "O primeiro e-mail da história", "Uma carta enviada à Lua"], 0, "A mensagem levará cerca de 25 mil anos para chegar ao seu destino."],
            ["Qual telescópio espacial da NASA, lançado em 2009, descobriu milhares de exoplanetas pelo método do trânsito?", ["Kepler", "Hubble", "Spitzer", "Chandra"], 0, "O Kepler observou mais de 150 mil estrelas ao mesmo tempo, esperando os pequenos \"apagões\"."],
        ],
    }),
]

export default missions
