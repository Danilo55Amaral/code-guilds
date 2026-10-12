import { MissionContent } from "../../../src/engine/missions";
import { quizMission } from "./quiz-materia";

// Missões de Astronomia pra Biblioteca de Missões (tomo de Astronomia): 5
// missões de 10 perguntas comentadas, nos níveis 1, 5, 10, 15 e 20, do mais
// básico (os planetas) às descobertas da astrofísica. As perguntas não repetem
// as das missões do evento Astronomia em: Salve o Wi-Fi! (src/engine/astronomyMissions.ts),
// que ficam só na tela do evento.
// O professor ajusta XP, moedas e itens no painel. Importar com:
//   npm run missions:import -- <e-mail do professor> scripts/missions/astronomia.ts
const missions: MissionContent[] = [
    quizMission({
        subject: "astronomia",
        level: 1,
        title: "Astronomia: Os Planetas do Sistema Solar",
        icon: "☀️",
        description: "Rochosos e gasosos: conheça os vizinhos da Terra",
        item: { name: "Miniatura do Sistema Solar", icon: "☀️", description: "Os oito planetas girando numa maquete de bolso. Usar dá XP de quem conhece a vizinhança cósmica." },
        questions: [
            ["Contando a partir do Sol, em qual posição fica a Terra?", ["Terceira", "Primeira", "Quinta", "Oitava"], 0, "A ordem é Mercúrio, Vênus, Terra, Marte, Júpiter, Saturno, Urano e Netuno. Um macete: \"Minha Vó Tem Muitas Joias, Só Usa No Natal\"."],
            ["Quais são os planetas rochosos (telúricos), com superfície sólida?", ["Mercúrio, Vênus, Terra e Marte", "Júpiter, Saturno, Urano e Netuno", "Só a Terra", "Marte, Júpiter, Saturno e Urano"], 0, "Os quatro mais perto do Sol são rochosos. Os quatro de fora são gigantes feitos principalmente de gases e gelo."],
            ["Júpiter, Saturno, Urano e Netuno são chamados de:", ["Planetas gigantes gasosos (e gelados)", "Planetas-anões", "Estrelas apagadas", "Satélites"], 0, "Esses gigantes não têm um chão firme como a Terra: são formados principalmente por hidrogênio, hélio e gelo."],
            ["O que é a Grande Mancha Vermelha de Júpiter?", ["Uma tempestade gigante, maior que a Terra, que dura há séculos", "Um oceano de lava", "Uma lua escondida", "Um buraco no planeta"], 0, "É um furacão enorme, observado há mais de 300 anos, com ventos de centenas de quilômetros por hora."],
            ["Em qual planeta fica o Monte Olimpo, o maior vulcão conhecido do Sistema Solar?", ["Marte", "Terra", "Vênus", "Júpiter"], 0, "O Monte Olimpo, em Marte, tem cerca de 22 km de altura: quase três vezes o Everest."],
            ["Hoje em dia, qual planeta tem o maior número de luas conhecidas?", ["Saturno", "Terra", "Marte", "Mercúrio"], 0, "Saturno passou de 200 luas confirmadas. Júpiter vem em segundo, a Terra tem uma e Mercúrio e Vênus não têm nenhuma."],
            ["Qual planeta brilha forte no céu ao amanhecer ou ao anoitecer e é chamado de \"Estrela d'Alva\"?", ["Vênus", "Marte", "Saturno", "Netuno"], 0, "Vênus não é estrela: brilha porque reflete muito a luz do Sol nas nuvens grossas que o cobrem."],
            ["Qual planeta gira \"deitado\", com o eixo quase paralelo à órbita?", ["Urano", "Terra", "Júpiter", "Mercúrio"], 0, "O eixo de Urano é inclinado quase 98°. Os cientistas acham que ele levou uma pancada gigante há bilhões de anos."],
            ["Desde 2006, como Plutão é classificado?", ["Planeta-anão", "Nono planeta", "Estrela", "Cometa"], 0, "Plutão não \"limpou\" a vizinhança da órbita dele, por isso virou planeta-anão, como Ceres e Éris."],
            ["Mercúrio é o planeta mais perto do Sol. Por que as noites lá chegam a -180 °C?", ["Porque ele quase não tem atmosfera pra segurar o calor", "Porque ele é feito de gelo", "Porque o Sol se apaga à noite", "Porque ele fica longe do Sol"], 0, "Sem uma atmosfera pra funcionar como cobertor, o calor do dia (mais de 400 °C) escapa todo pro espaço à noite."],
        ],
    }),
    quizMission({
        subject: "astronomia",
        level: 5,
        title: "Astronomia: A Lua e os Eclipses",
        icon: "🌙",
        description: "As fases, as crateras, as marés e o eclipse lunar",
        item: { name: "Pedrinha Lunar", icon: "🌙", description: "Uma lembrancinha cinza do nosso satélite. Usar dá XP de quem sabe tudo sobre a Lua." },
        questions: [
            ["Qual fase da Lua vem logo depois da Lua Nova?", ["Quarto Crescente", "Lua Cheia", "Quarto Minguante", "Lua Nova de novo"], 0, "A sequência é Lua Nova, Quarto Crescente, Lua Cheia e Quarto Minguante, e o ciclo recomeça."],
            ["Num eclipse lunar, quem fica no meio, entre os outros dois?", ["A Terra", "A Lua", "O Sol", "Marte"], 0, "No eclipse lunar a Terra fica entre o Sol e a Lua, e a sombra da Terra cobre a Lua."],
            ["Em qual fase da Lua pode acontecer um eclipse lunar?", ["Lua Cheia", "Lua Nova", "Quarto Crescente", "Em qualquer fase"], 0, "Só na Lua Cheia a Lua fica do lado oposto ao Sol, onde a sombra da Terra pode alcançá-la."],
            ["Num eclipse lunar total, de que cor a Lua costuma ficar?", ["Avermelhada", "Azul", "Verde", "Branca e mais brilhante"], 0, "A atmosfera da Terra desvia a luz vermelha do Sol até a Lua, como num pôr do sol. Por isso ela é chamada de \"Lua de Sangue\"."],
            ["O que causa as marés dos oceanos?", ["Principalmente a gravidade da Lua (e também a do Sol)", "O vento", "Os peixes nadando", "A chuva"], 0, "A gravidade da Lua puxa a água dos oceanos, formando as marés altas e baixas. O Sol ajuda, mas com menos força."],
            ["O que são as manchas escuras que vemos na Lua, os \"mares lunares\"?", ["Grandes planícies de lava antiga que endureceu", "Oceanos de água", "Florestas", "Sombras de nuvens"], 0, "Há bilhões de anos, lava cobriu essas regiões e esfriou, formando rochas escuras. Não há água líquida lá."],
            ["O que formou as crateras da Lua?", ["Impactos de asteroides e meteoritos", "Escavações de astronautas", "Terremotos da Terra", "Chuvas fortes"], 0, "Como a Lua não tem atmosfera, as rochas espaciais chegam inteiras até o chão e deixam crateras."],
            ["Por que as pegadas dos astronautas continuam na Lua até hoje?", ["Porque lá não tem vento nem chuva pra apagar", "Porque foram pintadas", "Porque o chão é de cimento", "Porque a Lua não gira"], 0, "Sem atmosfera, não há vento nem chuva. As pegadas podem durar milhões de anos."],
            ["Comparado ao da Terra, o diâmetro da Lua é de mais ou menos:", ["Um quarto", "O dobro", "Um centésimo", "O mesmo tamanho"], 0, "A Lua tem cerca de 3.474 km de diâmetro e a Terra, cerca de 12.742 km. Caberiam umas 50 Luas dentro da Terra."],
            ["Por que nunca devemos olhar diretamente para o Sol, nem durante um eclipse?", ["Porque a luz do Sol pode queimar a retina e prejudicar a visão para sempre", "Porque fica escuro demais", "Porque a Lua pode cair", "Não tem problema nenhum"], 0, "A luz do Sol pode lesar a retina sem dor e de forma permanente. Só com óculos próprios para eclipse ou projetando a imagem num papel."],
        ],
    }),
    quizMission({
        subject: "astronomia",
        level: 10,
        title: "Astronomia: Estrelas e Constelações",
        icon: "⭐",
        description: "As estrelas mais famosas do céu e como os povos as usavam",
        item: { name: "Carta Celeste", icon: "⭐", description: "Um mapa das constelações dobrado em quatro. Usar dá XP de quem se orienta pelas estrelas." },
        questions: [
            ["As Três Marias fazem parte de qual constelação?", ["Órion", "Cruzeiro do Sul", "Leão", "Escorpião"], 0, "As Três Marias são o \"cinturão\" de Órion, o caçador, uma das constelações mais fáceis de achar."],
            ["Qual é a estrela mais brilhante do céu noturno?", ["Sirius", "Estrela Polar", "Betelgeuse", "Próxima Centauri"], 0, "Sirius, na constelação do Cão Maior, é a mais brilhante. A Estrela Polar não é das mais brilhantes, só fica quase parada no céu do norte."],
            ["Por que as estrelas parecem piscar?", ["Porque a luz delas atravessa o ar em movimento da atmosfera", "Porque elas ligam e desligam", "Por causa das nuvens", "Por causa dos satélites"], 0, "O ar da atmosfera está sempre se mexendo e desvia um pouco a luz das estrelas, que parece tremer. No espaço, elas não piscam."],
            ["Por que não vemos as estrelas durante o dia?", ["Porque a luz do Sol espalhada pelo céu ofusca o brilho delas", "Porque elas vão embora de dia", "Porque elas só acendem à noite", "Porque as nuvens tapam todas"], 0, "As estrelas continuam lá. A atmosfera espalha tanta luz do Sol que o céu fica claro demais pra ver o brilho fraco delas."],
            ["Betelgeuse, o \"ombro\" de Órion, é uma estrela de que tipo?", ["Supergigante vermelha", "Anã branca", "Estrela de nêutrons", "Planeta"], 0, "Betelgeuse é tão grande que, no lugar do Sol, engoliria a órbita de Marte. Um dia ela deve explodir como supernova."],
            ["Onde as estrelas nascem?", ["Em nebulosas, nuvens de gás e poeira", "Dentro dos planetas", "Nos buracos negros", "Nos cometas"], 0, "Nas nebulosas, a gravidade vai juntando gás e poeira até o centro ficar quente o bastante pra acender uma estrela."],
            ["Qual é a diferença entre astronomia e astrologia?", ["Astronomia é a ciência que estuda os astros; astrologia é uma crença sem comprovação científica", "São a mesma coisa", "Astrologia é a ciência e astronomia é crença", "Astronomia só estuda a Lua"], 0, "A astronomia usa observação, medição e testes. A astrologia (os signos) nunca teve as previsões comprovadas pela ciência."],
            ["Pra que os povos antigos usavam as constelações?", ["Pra marcar as épocas de plantar e colher e pra se orientar nas viagens", "Pra iluminar as casas", "Pra prever terremotos com certeza", "Pra nada"], 0, "O céu funcionava como calendário e bússola: a posição das estrelas avisava a chegada das chuvas, da seca e mostrava o caminho."],
            ["Para povos indígenas do sul do Brasil, o que avisa a constelação da Ema quando aparece inteira ao anoitecer, em junho?", ["A chegada do inverno", "O início do verão", "Um eclipse", "O ano novo chinês"], 0, "A Ema é uma constelação de povos tupi-guarani, perto do Cruzeiro do Sul. Ela mostra que os povos indígenas também tinham sua própria astronomia."],
            ["Quanto maior a massa de uma estrela, o que acontece com o tempo de vida dela?", ["Fica mais curto, porque ela queima o combustível mais rápido", "Fica mais longo", "Não muda nada", "Ela vive pra sempre"], 0, "Estrelas gigantes brilham muito e gastam o hidrogênio em poucos milhões de anos. Estrelas pequenas podem durar trilhões de anos."],
        ],
    }),
    quizMission({
        subject: "astronomia",
        level: 15,
        title: "Astronomia: Gravidade e Órbitas",
        icon: "🛰️",
        description: "Kepler, Galileu, solstícios, equinócios e o peso na Lua",
        item: { name: "Satélite de Brinquedo", icon: "🛰️", description: "Um satélite em miniatura que nunca para de orbitar. Usar dá XP de quem entende por que nada cai do céu." },
        questions: [
            ["Quem mostrou que os planetas giram ao redor do Sol em órbitas elípticas?", ["Johannes Kepler", "Isaac Newton", "Nicolau Copérnico", "Albert Einstein"], 0, "Kepler, no começo do século XVII, descobriu que as órbitas são elipses, com o Sol num dos focos."],
            ["O que propõe o modelo heliocêntrico?", ["O Sol no centro, com os planetas girando ao redor", "A Terra no centro do universo", "A Lua no centro", "Que não existe centro"], 0, "O heliocentrismo, defendido por Copérnico no século XVI, colocou o Sol no centro e substituiu o geocentrismo (Terra no centro)."],
            ["Quando é verão no Hemisfério Sul, que estação é no Hemisfério Norte?", ["Inverno", "Verão", "Primavera", "Outono"], 0, "As estações são opostas nos dois hemisférios: no Natal é verão no Brasil e inverno na Europa."],
            ["O solstício de verão é o dia mais longo do ano. No Hemisfério Sul, ele acontece por volta de:", ["21 de dezembro", "21 de junho", "1º de janeiro", "7 de setembro"], 0, "Em dezembro o Hemisfério Sul está mais inclinado para o Sol. Em junho é o contrário: é o nosso solstício de inverno, a noite mais longa."],
            ["O que acontece nos equinócios, por volta de 20 de março e 22 de setembro?", ["O dia e a noite têm quase a mesma duração em todo o planeta", "Acontece um eclipse", "A Terra para de girar", "O Sol fica a pino nos polos"], 0, "Equinócio quer dizer \"noite igual\". Os equinócios marcam o início do outono e da primavera."],
            ["Na Lua, o peso de um astronauta fica como, comparado ao da Terra?", ["Cerca de 1/6 do peso na Terra", "Maior", "Igual", "Zero"], 0, "A gravidade da Lua é cerca de 1/6 da gravidade da Terra, por isso os astronautas pulam tão alto lá."],
            ["E a massa desse astronauta, na Lua?", ["Continua a mesma", "Diminui", "Dobra", "Vira zero"], 0, "Massa é a quantidade de matéria e não muda de lugar pra lugar. O que muda é o peso, que depende da gravidade."],
            ["O que é a velocidade de escape?", ["A velocidade mínima pra um objeto escapar da atração gravitacional de um astro", "A velocidade máxima de um avião", "A velocidade da luz", "A velocidade do som"], 0, "Na Terra, a velocidade de escape é de cerca de 11,2 km/s. Abaixo disso, o objeto acaba voltando ou fica em órbita."],
            ["O que Galileu Galilei descobriu ao apontar o telescópio para Júpiter, em 1610?", ["Quatro luas girando em volta de Júpiter", "Os anéis de Netuno", "Plutão", "Um buraco negro"], 0, "As quatro luas galileanas (Io, Europa, Ganimedes e Calisto) mostraram que nem tudo gira em torno da Terra, uma prova a favor do heliocentrismo."],
            ["Qual planeta dá a volta no Sol mais rápido?", ["Mercúrio", "Netuno", "Terra", "Júpiter"], 0, "Mercúrio, o mais perto do Sol, completa a órbita em cerca de 88 dias. Quanto mais longe do Sol, mais longa a volta: Netuno leva 165 anos."],
        ],
    }),
    quizMission({
        subject: "astronomia",
        level: 20,
        title: "Astronomia: Exoplanetas e Astrofísica",
        icon: "🔭",
        description: "Planetas de outras estrelas, a luz das estrelas e as sondas que exploram o cosmos",
        item: { name: "Disco de Ouro da Voyager", icon: "💿", description: "Uma cópia do disco com sons e imagens da Terra que viaja pelo espaço desde 1977. Usar dá XP de quem explora o cosmos." },
        questions: [
            ["Qual é a idade aproximada da Terra?", ["4,6 bilhões de anos", "13,8 bilhões de anos", "500 milhões de anos", "10 mil anos"], 0, "A Terra e o Sistema Solar se formaram há cerca de 4,6 bilhões de anos, a partir de uma nuvem de gás e poeira."],
            ["O que é um exoplaneta?", ["Um planeta que gira em torno de outra estrela, fora do Sistema Solar", "Um planeta que saiu do Sistema Solar", "Um planeta sem atmosfera", "Um satélite artificial"], 0, "O primeiro exoplaneta em volta de uma estrela como o Sol foi achado em 1995. Hoje já se conhecem mais de 5 mil."],
            ["O que é a \"zona habitável\" de uma estrela?", ["A faixa de distância em que um planeta pode ter água líquida na superfície", "O lugar onde já foram achados extraterrestres", "O interior da estrela", "A região dos asteroides"], 0, "Perto demais da estrela, a água ferve; longe demais, congela. A Terra está bem no meio dessa faixa."],
            ["No método do trânsito, como os astrônomos percebem um exoplaneta?", ["O brilho da estrela diminui um pouquinho quando o planeta passa na frente dela", "Eles veem o planeta com binóculos", "O planeta emite um som", "A estrela muda de lugar no céu"], 0, "É como uma mosca passando na frente de uma lanterna: a queda no brilho revela o tamanho do planeta e quanto tempo dura a órbita dele."],
            ["Como os cientistas descobrem do que uma estrela é feita, sem ir até ela?", ["Analisando o espectro da luz dela (espectroscopia)", "Buscando pedaços dela", "Pelo cheiro", "Medindo o barulho dela"], 0, "Cada elemento químico deixa linhas próprias no espectro da luz, como uma impressão digital. Foi assim que o hélio foi descoberto no Sol, antes de ser achado na Terra."],
            ["A luz de uma galáxia que se afasta de nós chega \"esticada\" para o lado vermelho do espectro. Como se chama isso?", ["Desvio para o vermelho (redshift)", "Eclipse", "Refração", "Aurora boreal"], 0, "É um efeito parecido com o da sirene que fica mais grave quando a ambulância se afasta (efeito Doppler), só que com a luz."],
            ["Qual sonda, lançada em 1977, é o objeto feito por humanos mais distante da Terra?", ["Voyager 1", "Sputnik 1", "Telescópio Hubble", "Apollo 11"], 0, "A Voyager 1 já saiu da heliosfera, a \"bolha\" do vento solar, e leva um disco de ouro com sons e imagens da Terra."],
            ["O que é uma unidade astronômica (UA)?", ["A distância média entre a Terra e o Sol, cerca de 150 milhões de km", "A distância até a Lua", "Um ano-luz", "O tamanho do Sol"], 0, "A UA é usada pra medir distâncias dentro do Sistema Solar: Júpiter fica a cerca de 5,2 UA do Sol."],
            ["Por que telescópios colocados no espaço, como o Hubble, enxergam melhor do que os da Terra?", ["Porque ficam acima da atmosfera, que distorce e bloqueia parte da luz", "Porque ficam mais perto das estrelas", "Porque no espaço é mais claro", "Porque usam lentes de ouro"], 0, "A atmosfera faz as estrelas \"tremerem\" e absorve luzes como o ultravioleta e parte do infravermelho. O Hubble foi lançado em 1990."],
            ["Quando uma estrela muito grande explode, o que pode sobrar se ela não virar um buraco negro?", ["Uma estrela de nêutrons, muito pequena e densíssima", "Um planeta gasoso", "Uma estrela nova e jovem", "Nada, nem poeira"], 0, "Uma estrela de nêutrons tem mais massa que o Sol num tamanho de uma cidade. As que giram mandando pulsos de luz são os pulsares."],
        ],
    }),
]

export default missions
