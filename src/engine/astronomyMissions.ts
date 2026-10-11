// ============================================================================
// MISSÕES PRONTAS DO EVENTO "ASTRONOMIA EM: SALVE O WI-FI" — 3 por fase, com
// 10 perguntas cada, todas de astronomia, um pouco de astrofísica e de
// cosmologia (o evento é engine/specialEvents.ts). O professor adiciona com um
// clique no card do evento. A Fase 1 começa pelo Sistema Solar e pela Terra,
// a Fase 2 vai pros meteoros, satélites e estrelas, e a Fase 3 chega aos
// buracos negros, à relatividade e à origem do universo.
// ============================================================================

import type { MissionContent } from "./missions";

type Q = [prompt: string, options: [string, string, string, string], correct: "a" | "b" | "c" | "d", explanation: string];

/** Monta as perguntas da missão (ids q1, q2... e as opções a, b, c, d). */
function questions(list: Q[]): MissionContent["questions"] {
  return list.map(([prompt, options, correct, explanation], i) => ({
    id: `q${i + 1}`,
    prompt,
    options: options.map((text, j) => ({ id: "abcd"[j], text })),
    correctOptionId: correct,
    explanation,
  }));
}

// ---------------------------------------------------------------------------
// FASE 1 — Sem Sinal: cada missão liga um sistema do foguete Vitória-1
// ---------------------------------------------------------------------------

export const ASTRONOMIA_FASE1_MISSIONS: MissionContent[] = [
  {
    title: "Motores Ligados",
    icon: "🚀",
    difficulty: "iniciante",
    minLevel: 1,
    description: "Ligue os motores do Vitória-1 mostrando que você conhece o nosso Sistema Solar",
    rewardXp: 150,
    rewardCoins: 60,
    rewardItem: {
      name: "Sorvete de Astronauta",
      icon: "🍦",
      description: "Sorvete desidratado, igual ao que os astronautas levam pro espaço: crocante e geladinho. Comer (usar) dá XP.",
      rarity: "comum",
      value: 15,
      xp: 60,
    },
    questions: questions([
      ["Qual é a estrela mais perto da Terra?", ["Sirius", "O Sol", "A Estrela Polar", "Alfa Centauro"], "b", "O Sol é uma estrela, a uns 150 milhões de km daqui. A próxima estrela depois dele é Proxima Centauri, a cerca de 4,2 anos-luz."],
      ["Quantos planetas tem o Sistema Solar?", ["7", "9", "8", "10"], "c", "São 8: Mercúrio, Vênus, Terra, Marte, Júpiter, Saturno, Urano e Netuno. Plutão passou a ser chamado de planeta-anão em 2006."],
      ["Qual é o maior planeta do Sistema Solar?", ["Júpiter", "Saturno", "Terra", "Netuno"], "a", "Júpiter é um gigante gasoso tão grande que caberiam mais de 1.300 Terras dentro dele."],
      ["Qual planeta é conhecido como o \"Planeta Vermelho\"?", ["Vênus", "Mercúrio", "Júpiter", "Marte"], "d", "Marte é coberto de poeira com óxido de ferro, a mesma substância da ferrugem. Por isso ele parece avermelhado."],
      ["Qual é o planeta mais quente do Sistema Solar?", ["Mercúrio", "Vênus", "Marte", "Terra"], "b", "Mercúrio é o mais perto do Sol, mas Vênus é mais quente (cerca de 460 °C): a atmosfera grossa de gás carbônico prende o calor num efeito estufa gigante."],
      ["O que é o Sol?", ["Um planeta muito quente", "Uma lua de fogo", "Uma estrela: uma bola gigante de gás que produz energia", "Um buraco negro"], "c", "O Sol é uma estrela: uma bola enorme de gás (plasma) que, no núcleo, junta átomos de hidrogênio pra formar hélio e libera muita luz e calor."],
      ["Qual planeta tem os anéis mais famosos e brilhantes?", ["Marte", "Saturno", "Mercúrio", "Vênus"], "b", "Os anéis de Saturno são feitos de bilhões de pedaços de gelo e rocha. Júpiter, Urano e Netuno também têm anéis, mas bem mais fracos."],
      ["Quanto tempo a luz do Sol leva pra chegar até a Terra?", ["Cerca de 8 minutos", "1 segundo", "1 dia", "1 ano"], "a", "A luz viaja a uns 300 mil km por segundo. Pra cruzar os 150 milhões de km até aqui, ela leva cerca de 8 minutos e 20 segundos."],
      ["O que fica entre a órbita de Marte e a de Júpiter?", ["O Cinturão de Asteroides", "A Lua", "A Via Láctea", "O Sol"], "a", "O Cinturão de Asteroides tem milhões de rochas girando em volta do Sol. Ele separa os planetas rochosos (de dentro) dos gigantes gasosos (de fora)."],
      ["Qual é o planeta mais distante do Sol?", ["Urano", "Plutão", "Saturno", "Netuno"], "d", "Netuno é o oitavo e último planeta, a uns 4,5 bilhões de km do Sol. Um ano lá dura 165 anos da Terra!"],
    ]),
  },
  {
    title: "Rota de Navegação",
    icon: "🧭",
    difficulty: "iniciante",
    minLevel: 1,
    description: "Programe a rota do Vitória-1: Terra, Lua, órbitas e o movimento do céu",
    rewardXp: 160,
    rewardCoins: 70,
    rewardItem: {
      name: "Bússola Estelar",
      icon: "🧭",
      description: "Uma bússola que aponta pras estrelas em vez do norte. Usar dá XP (e uma vontade enorme de viajar pelo espaço).",
      rarity: "comum",
      value: 18,
      xp: 70,
    },
    questions: questions([
      ["Por que existe dia e noite na Terra?", ["Porque o Sol apaga à noite", "Porque a Terra gira em torno de si mesma", "Porque a Lua tampa o Sol", "Porque a Terra se afasta do Sol"], "b", "É a rotação: a Terra dá uma volta em torno do próprio eixo a cada 24 horas. O lado virado pro Sol tem dia; o outro lado, noite."],
      ["Quanto tempo a Terra leva pra dar uma volta completa em volta do Sol?", ["24 horas", "1 mês", "10 anos", "Cerca de 365 dias"], "d", "Essa volta (a translação) leva cerca de 365 dias e 6 horas: é o nosso ano."],
      ["Por que existe o ano bissexto, com 29 de fevereiro?", ["Porque a volta em torno do Sol dura cerca de 365 dias e 6 horas, e essas horas viram um dia a mais a cada 4 anos", "Porque fevereiro é o mês mais curto", "Porque a Lua atrasa a Terra", "Por sorteio"], "a", "Quatro sobras de 6 horas dão 24 horas: um dia inteiro, que entra no calendário a cada 4 anos pra o ano não ficar atrasado em relação ao Sol."],
      ["O que causa as estações do ano?", ["A distância entre a Terra e o Sol", "As nuvens", "A inclinação do eixo da Terra", "As fases da Lua"], "c", "O eixo da Terra é inclinado (uns 23,5°). Durante o ano, cada hemisfério recebe a luz do Sol mais de frente (verão) ou mais de lado (inverno)."],
      ["A Lua tem luz própria?", ["Sim, ela brilha sozinha", "Não: ela reflete a luz do Sol", "Só na lua cheia", "Só no inverno"], "b", "A Lua é uma rocha que não produz luz. O brilho que vemos é a luz do Sol batendo nela e voltando pra Terra."],
      ["Por que a Lua muda de forma ao longo do mês (as fases da Lua)?", ["Porque a sombra da Terra cobre a Lua", "Porque a Lua encolhe e cresce", "Porque as nuvens tampam pedaços dela", "Porque vemos partes diferentes do lado iluminado pelo Sol enquanto ela gira em volta da Terra"], "d", "Metade da Lua está sempre iluminada pelo Sol. Conforme ela dá a volta na Terra, vemos mais ou menos dessa metade: nova, crescente, cheia e minguante."],
      ["Quanto tempo a Lua leva pra passar por todas as fases?", ["Cerca de 29 dias e meio", "1 semana", "1 ano", "24 horas"], "a", "De uma lua nova até a próxima lua nova passam cerca de 29,5 dias. Foi daí que veio a ideia do \"mês\"."],
      ["O que é um eclipse solar?", ["Quando a Terra fica entre o Sol e a Lua", "Quando a Lua passa entre a Terra e o Sol e tampa a luz dele", "Quando o Sol apaga", "Quando chove de dia"], "b", "No eclipse solar a Lua fica na frente do Sol e faz sombra na Terra. Quando a Terra fica entre o Sol e a Lua, o eclipse é lunar."],
      ["Por que vemos sempre a mesma face da Lua?", ["Porque o outro lado é escuro", "Porque a Lua não gira", "Porque ela gira em torno de si no mesmo tempo em que dá a volta na Terra", "Porque o outro lado foi destruído"], "c", "É a rotação sincronizada: a Lua leva o mesmo tempo pra girar em torno de si e pra dar a volta na Terra, então mostra sempre o mesmo lado."],
      ["Como se chama o caminho que um planeta ou satélite faz em volta de outro corpo?", ["Galáxia", "Eclipse", "Rotação", "Órbita"], "d", "Órbita é a trajetória curva de um corpo em volta de outro, puxado pela gravidade. A Terra orbita o Sol, e a Lua orbita a Terra."],
    ]),
  },
  {
    title: "Suporte de Vida",
    icon: "💨",
    difficulty: "medio",
    minLevel: 1,
    description: "Ative o suporte de vida: gravidade, atmosfera e tudo o que um astronauta precisa",
    rewardXp: 180,
    rewardCoins: 80,
    rewardItem: {
      name: "Cápsula de Oxigênio",
      icon: "💨",
      description: "Uma cápsula de oxigênio extra pra respirar tranquilo no espaço. Usar dá XP e um fôlego novo pras missões.",
      rarity: "raro",
      value: 25,
      xp: 100,
    },
    questions: questions([
      ["O que mantém a Lua girando em volta da Terra?", ["O vento solar", "A gravidade da Terra", "O campo magnético do Sol", "Nada, ela está parada"], "b", "A gravidade da Terra puxa a Lua o tempo todo. Como a Lua também anda pro lado, em vez de cair ela fica dando voltas: está em órbita."],
      ["Por que os astronautas flutuam dentro da estação espacial?", ["Porque lá em cima não existe gravidade", "Porque usam ímãs nas roupas", "Porque eles e a estação estão caindo juntos em volta da Terra o tempo todo", "Porque o ar lá é mais leve"], "c", "A gravidade lá em cima ainda é quase 90% da daqui! A estação e os astronautas estão em queda livre, caindo juntos em volta da Terra, então eles flutuam em relação à nave."],
      ["Por que o astronauta precisa de um traje espacial fora da nave?", ["Só pra ficar bonito nas fotos", "Pra não ser visto pelos alienígenas", "Porque no espaço não tem ar pra respirar nem pressão, e a temperatura muda demais", "Porque lá chove muito"], "c", "O traje é como uma mini nave: leva oxigênio, mantém a pressão do corpo e protege do frio, do calor e da radiação do espaço."],
      ["O som se propaga no espaço?", ["Sim, até mais alto que na Terra", "Não: o som precisa de matéria, como o ar, pra viajar", "Só o som de explosões", "Só perto dos planetas"], "b", "O som é uma vibração que passa de partícula em partícula. O espaço é quase vazio (vácuo), então não tem por onde o som passar."],
      ["O que é um satélite artificial?", ["Uma lua natural", "Uma estrela pequena", "Um meteoro", "Um objeto feito por pessoas e colocado em órbita, como os de internet, GPS e previsão do tempo"], "d", "Satélites artificiais são máquinas lançadas em foguetes que ficam dando voltas na Terra pra fazer comunicação, GPS, fotos do clima e pesquisas."],
      ["Qual é o satélite natural da Terra?", ["A Lua", "A Estação Espacial", "Marte", "O Sol"], "a", "A Lua é o nosso único satélite natural. Ela se formou há uns 4,5 bilhões de anos, provavelmente depois de uma colisão gigante com a Terra jovem."],
      ["O que é a atmosfera da Terra?", ["Uma camada de gelo em volta do planeta", "A camada de gases que envolve a Terra, principalmente nitrogênio e oxigênio", "O espaço entre a Terra e a Lua", "O núcleo do planeta"], "b", "O ar que respiramos é cerca de 78% nitrogênio e 21% oxigênio. A atmosfera também nos protege de raios do Sol e queima a maioria dos meteoros."],
      ["Qual gás os astronautas precisam levar pra respirar?", ["Hélio", "Gás carbônico", "Hidrogênio", "Oxigênio"], "d", "Nosso corpo usa oxigênio pra produzir energia. Por isso as naves e os trajes levam tanques de oxigênio e filtram o gás carbônico que a gente solta."],
      ["Um astronauta \"pesa\" menos na Lua do que na Terra. Por quê?", ["Porque ele emagrece na viagem", "Porque a gravidade da Lua é menor, cerca de 1/6 da gravidade da Terra", "Porque na Lua não tem ar", "Porque a Lua gira mais rápido"], "b", "A massa dele é a mesma, mas a Lua puxa com menos força: lá ele pesa uns 1/6 do que pesa aqui. Dá pra pular bem alto!"],
      ["Quem foi a primeira pessoa a pisar na Lua, em 1969?", ["Yuri Gagarin", "Marcos Pontes", "Neil Armstrong", "Buzz Lightyear"], "c", "Neil Armstrong pisou na Lua na missão Apollo 11, em 1969. Yuri Gagarin foi o primeiro ser humano no espaço (1961) e Marcos Pontes, o primeiro brasileiro (2006)."],
    ]),
  },
];

// ---------------------------------------------------------------------------
// FASE 2 — Chuva de Meteoros: cada missão realinha um satélite Lúmen
// ---------------------------------------------------------------------------

export const ASTRONOMIA_FASE2_MISSIONS: MissionContent[] = [
  {
    title: "Chuva de Meteoros",
    icon: "☄️",
    difficulty: "medio",
    minLevel: 1,
    description: "Desvie da chuva de meteoros entendendo meteoros, asteroides e cometas",
    rewardXp: 190,
    rewardCoins: 85,
    rewardItem: {
      name: "Pedaço de Meteorito",
      icon: "🌠",
      description: "Uma pedrinha que veio do espaço e atravessou a atmosfera sem queimar inteira. Usar dá XP de quem sobreviveu a uma chuva de meteoros.",
      rarity: "raro",
      value: 28,
      xp: 110,
    },
    questions: questions([
      ["O que é um meteoro, a famosa \"estrela cadente\"?", ["Uma estrela caindo do céu", "O risco de luz de uma pedra do espaço queimando ao entrar na atmosfera", "Um avião muito rápido", "Um raio"], "b", "Não é uma estrela! É um pedacinho de rocha ou poeira do espaço que entra na atmosfera muito rápido e esquenta tanto que brilha."],
      ["Como se chama a pedra espacial que consegue chegar até o chão?", ["Cometa", "Asteroide", "Meteorito", "Planeta"], "c", "No espaço ela é um meteoroide; o risco de luz no céu é o meteoro; e o pedaço que chega ao chão é o meteorito."],
      ["O que é um cometa?", ["Uma bola de gelo, poeira e rocha que solta gás e poeira e forma uma cauda quando chega perto do Sol", "Uma estrela muito velha", "Um planeta sem lua", "Um satélite quebrado"], "a", "Os cometas são \"bolas de neve sujas\". Perto do Sol o gelo vira gás e forma a cabeleira e a cauda brilhante."],
      ["Pra que lado aponta a cauda de um cometa?", ["Sempre pra trás do caminho dele", "Sempre pra baixo", "Sempre pra Terra", "Sempre pro lado contrário do Sol"], "d", "A cauda é empurrada pela luz e pelo vento solar, então aponta sempre pra longe do Sol, mesmo quando o cometa está se afastando dele."],
      ["Onde fica o Cinturão de Asteroides?", ["Entre Marte e Júpiter", "Entre a Terra e a Lua", "Depois de Netuno", "Dentro do Sol"], "a", "Ele fica entre as órbitas de Marte e de Júpiter e tem milhões de rochas, a maioria bem pequena."],
      ["O que é uma chuva de meteoros?", ["Pedras caindo como chuva na cidade", "Quando a Terra passa pela trilha de poeira deixada por um cometa e aparecem muitos meteoros no céu", "Um meteoro que explode", "Quando chove durante um eclipse"], "b", "Os cometas deixam poeira pelo caminho. Quando a Terra cruza essa trilha, os grãozinhos entram na atmosfera e riscam o céu, como nas Perseidas, em agosto."],
      ["Por que a maioria das pedras do espaço não chega ao chão?", ["Porque são de mentira", "Porque desviam da Terra", "Porque o atrito com o ar esquenta tanto que elas queimam no caminho", "Porque a Lua pega todas"], "c", "Elas entram a dezenas de km por segundo. O ar na frente delas esquenta muito, e a maioria vira vapor antes de chegar ao chão."],
      ["Qual cometa famoso passa perto da Terra a cada 76 anos, mais ou menos?", ["Halley", "Andrômeda", "Ceres", "Plutão"], "a", "O Cometa Halley passou por aqui em 1986 e volta em 2061. Andrômeda é uma galáxia, e Ceres e Plutão são planetas-anões."],
      ["O que provavelmente ajudou a acabar com os dinossauros, há uns 66 milhões de anos?", ["Um terremoto", "Uma nevasca", "Um vulcão na Lua", "A queda de um asteroide de uns 10 km"], "d", "Um asteroide gigante caiu onde hoje é o México (a cratera de Chicxulub), levantou poeira e mudou o clima do planeta inteiro."],
      ["Qual planeta-anão fica no Cinturão de Asteroides?", ["Plutão", "Ceres", "Éris", "Netuno"], "b", "Ceres é o maior objeto do Cinturão de Asteroides e é um planeta-anão. Plutão e Éris ficam muito mais longe, depois de Netuno."],
    ]),
  },
  {
    title: "Cuidado com a ISS",
    icon: "🛰️",
    difficulty: "medio",
    minLevel: 1,
    description: "Passe longe da Estação Espacial e entenda como funcionam os satélites",
    rewardXp: 200,
    rewardCoins: 90,
    rewardItem: {
      name: "Parafuso da ISS",
      icon: "🔩",
      description: "Um parafuso de reserva da Estação Espacial Internacional que veio flutuando até a nave. Usar dá XP de engenheiro espacial.",
      rarity: "raro",
      value: 30,
      xp: 120,
    },
    questions: questions([
      ["O que é a ISS?", ["Um planeta novo", "A Estação Espacial Internacional: um laboratório em órbita onde astronautas de vários países vivem e fazem pesquisas", "Um telescópio na Lua", "Um foguete que vai a Marte"], "b", "A ISS é a maior estrutura que a humanidade já montou no espaço, do tamanho de um campo de futebol, e tem gente morando nela desde 2000."],
      ["Mais ou menos a que altura a ISS fica da Terra?", ["Uns 40 km", "Uns 400 km", "Uns 400 mil km", "Na Lua"], "b", "A ISS orbita a cerca de 400 km de altura: mais ou menos a distância entre São Paulo e o Rio de Janeiro, só que pra cima."],
      ["Quanto tempo a ISS leva pra dar uma volta completa na Terra?", ["Uns 90 minutos", "1 dia", "1 semana", "1 mês"], "a", "Ela dá uma volta a cada uns 90 minutos. Os astronautas veem uns 16 nasceres e 16 pores do sol por dia!"],
      ["Qual é a velocidade da ISS?", ["Uns 280 km/h", "Uns 2.800 km/h", "Uns 28.000 km/h", "Ela está parada"], "c", "A ISS anda a uns 28.000 km/h, umas 8 vezes mais rápido que uma bala de fuzil. É essa velocidade que a mantém em órbita."],
      ["O que é um satélite geoestacionário?", ["Um satélite que fica sempre em cima do mesmo ponto da Terra, girando junto com ela, a uns 36 mil km de altura", "Um satélite parado no espaço", "Um satélite que gira em volta da Lua", "Um satélite que caiu"], "a", "Lá no alto, uma volta leva exatamente um dia, igual à rotação da Terra. Por isso a antena de TV pode ficar apontada sempre pro mesmo lugar do céu."],
      ["Por que as redes de internet por satélite em órbita baixa, como a Constelação Lúmen do evento, usam tantos satélites?", ["Pra enfeitar o céu", "Porque cada satélite cobre só uma área pequena e passa rápido, então são precisos muitos pra cobrir a Terra toda", "Porque eles quebram toda hora", "Porque um satélite só não sabe falar com a Terra"], "b", "Perto da Terra o sinal chega mais rápido, mas cada satélite \"enxerga\" um pedaço pequeno do planeta e não fica parado. Milhares deles juntos formam uma rede que cobre tudo."],
      ["Como o GPS do celular descobre onde você está?", ["Perguntando pra torre da cidade", "Pela câmera", "Calculando a distância até vários satélites pelo tempo que os sinais deles levam pra chegar", "Adivinhando"], "c", "Cada satélite de GPS manda um sinal com a hora exata. Comparando os sinais de pelo menos 4 satélites, o celular calcula a sua posição."],
      ["O que é lixo espacial?", ["Lixo que os astronautas jogam pela janela", "Pedaços de satélites e foguetes velhos que continuam em órbita e podem bater em outras naves", "Poeira de estrelas", "Meteoritos"], "b", "Há milhões de pedaços de lixo em órbita, desde satélites desligados até lascas de tinta. Andando muito rápido, até uma lasca pode estragar uma nave."],
      ["Qual foi o primeiro satélite artificial da história, lançado em 1957?", ["Hubble", "Sputnik 1", "ISS", "Apollo 11"], "b", "O Sputnik 1, lançado pela União Soviética, era uma esfera de metal com quatro antenas que fazia \"bip bip\" pelo rádio."],
      ["Qual telescópio espacial, lançado em 2021, observa o universo em luz infravermelha?", ["Galileu", "James Webb", "Hubble", "Sputnik"], "b", "O James Webb fica a 1,5 milhão de km da Terra e enxerga o infravermelho, que atravessa a poeira e mostra galáxias muito antigas. O Hubble foi lançado em 1990."],
    ]),
  },
  {
    title: "O Relógio do Oxigênio",
    icon: "⏱️",
    difficulty: "avancado",
    minLevel: 1,
    description: "Corra contra o relógio do oxigênio enquanto aprende sobre a luz e as estrelas",
    rewardXp: 220,
    rewardCoins: 100,
    rewardItem: {
      name: "Poeira de Estrela",
      icon: "✨",
      description: "Um frasquinho de poeira de estrela brilhando. Você também é feito disso! Usar dá XP.",
      rarity: "raro",
      value: 32,
      xp: 130,
    },
    questions: questions([
      ["Qual é a velocidade da luz no vácuo?", ["Uns 300 km/s", "Uns 300 mil km/s", "Uns 3 km/s", "A luz não tem velocidade"], "b", "A luz anda uns 300 mil km por segundo: daria mais de 7 voltas na Terra em um segundo! Nada com massa consegue ir tão rápido."],
      ["O que é um ano-luz?", ["Um ano em que faz muito sol", "O tempo que a Terra leva pra dar uma volta no Sol", "A distância que a luz percorre em um ano", "Um ano com 366 dias"], "c", "Apesar do nome, ano-luz é uma distância: uns 9,5 trilhões de km, o caminho que a luz faz em um ano."],
      ["Qual é a estrela mais próxima depois do Sol?", ["Proxima Centauri", "Sirius", "Betelgeuse", "A Estrela Polar"], "a", "Proxima Centauri fica a cerca de 4,2 anos-luz. A luz dela que vemos hoje saiu de lá há mais de 4 anos!"],
      ["Por que as estrelas têm cores diferentes?", ["Por causa das nuvens", "Por causa da temperatura: as azuladas são mais quentes e as avermelhadas, mais frias", "Porque são pintadas", "Porque algumas são planetas"], "b", "A cor da estrela mostra a temperatura da superfície: azul-esbranquiçadas passam de 10.000 °C, amarelas como o Sol têm uns 5.500 °C e as vermelhas, menos."],
      ["Que tipo de estrela é o Sol?", ["Uma gigante vermelha", "Uma anã amarela de tamanho médio", "Uma estrela de nêutrons", "Uma anã branca"], "b", "O Sol é uma anã amarela (tipo G), com uns 4,6 bilhões de anos. Ele ainda vai brilhar assim por mais uns 5 bilhões de anos."],
      ["De onde vem a energia do Sol?", ["De fogo, como uma fogueira", "De eletricidade", "Da fusão nuclear: no núcleo, o hidrogênio vira hélio e libera energia", "Da luz das outras estrelas"], "c", "No núcleo do Sol a temperatura passa de 15 milhões de graus, e os núcleos de hidrogênio se juntam (fusão) formando hélio e soltando muita energia."],
      ["Se uma estrela está a 100 anos-luz daqui, a luz que vemos dela hoje saiu de lá...", ["Agora mesmo", "Há 100 anos", "Há 100 dias", "Ainda vai sair"], "b", "A luz leva 100 anos pra fazer a viagem. Olhar pro céu é olhar pro passado: vemos as estrelas como elas eram quando a luz saiu de lá."],
      ["O que é uma constelação?", ["Um grupo de estrelas que, vistas daqui da Terra, parecem formar uma figura", "Um planeta com muitas luas", "Uma galáxia pequena", "Um cometa grande"], "a", "As estrelas de uma constelação podem estar muito longe umas das outras; só parecem juntas vistas daqui. A astronomia reconhece 88 constelações."],
      ["Qual constelação aparece na bandeira do Brasil e ajuda a achar o Sul?", ["Órion", "Escorpião", "Cruzeiro do Sul", "Ursa Maior"], "c", "O Cruzeiro do Sul aponta pro polo sul celeste. Navegadores usavam as estrelas dele pra se orientar à noite."],
      ["Pra que serve a Estrela Polar, no hemisfério norte?", ["Pra indicar o norte, porque fica quase em cima do eixo da Terra", "Pra marcar o verão", "Pra prever chuva", "Pra nada, ela é a mais fraca do céu"], "a", "A Polaris fica quase exatamente na direção do eixo da Terra, então parece parada no céu enquanto as outras estrelas giram em volta: aponta sempre pro norte."],
    ]),
  },
];

// ---------------------------------------------------------------------------
// FASE 3 — Além do Horizonte: cada missão estabiliza um anel do buraco de minhoca
// ---------------------------------------------------------------------------

export const ASTRONOMIA_FASE3_MISSIONS: MissionContent[] = [
  {
    title: "O Gigante TON 618",
    icon: "🕳️",
    difficulty: "avancado",
    minLevel: 1,
    description: "Encare o TON 618 descobrindo como funcionam os buracos negros",
    rewardXp: 230,
    rewardCoins: 110,
    rewardItem: {
      name: "Fragmento do Horizonte",
      icon: "🌑",
      description: "Um pedacinho de escuridão que escapou da beirada do TON 618 (e ninguém sabe como). Usar dá muito XP.",
      rarity: "epico",
      value: 40,
      xp: 160,
    },
    questions: questions([
      ["O que é um buraco negro?", ["Um buraco no chão do espaço", "Uma estrela apagada que ficou preta", "Uma região onde a gravidade é tão forte que nada consegue escapar, nem a luz", "Um planeta escuro"], "c", "Num buraco negro, muita massa fica espremida num espaço pequeno. A gravidade fica tão forte que nem a luz, a coisa mais rápida do universo, consegue sair."],
      ["O que é o horizonte de eventos?", ["A fronteira do buraco negro: depois de passar dela, nada volta", "O nascer do sol visto do espaço", "A linha onde o céu encontra o mar", "O centro da galáxia"], "a", "O horizonte de eventos é o \"ponto sem volta\". Fora dele ainda dá pra escapar com velocidade suficiente; dentro, nem a luz sai."],
      ["Como se forma um buraco negro estelar?", ["Quando um planeta explode", "Quando uma estrela muito maior que o Sol acaba o combustível e o núcleo dela desaba sobre si mesmo", "Quando dois cometas se chocam", "Quando a Lua apaga"], "b", "Estrelas gigantes, no fim da vida, explodem como supernova. O núcleo que sobra pode desabar tanto que vira um buraco negro."],
      ["O que é o TON 618?", ["Um planeta do Sistema Solar", "Um foguete", "Um quasar com um dos maiores buracos negros já encontrados, com dezenas de bilhões de vezes a massa do Sol", "Uma estrela vizinha"], "c", "O TON 618 fica a bilhões de anos-luz daqui. O buraco negro dele tem por volta de 40 a 66 bilhões de vezes a massa do Sol, segundo as estimativas."],
      ["O que é um quasar?", ["Um cometa muito rápido", "O centro de uma galáxia que brilha demais porque um buraco negro gigante está engolindo gás e poeira", "Uma estrela que pisca", "Um tipo de satélite"], "b", "O gás que cai no buraco negro gira, esquenta e brilha mais que trilhões de sóis antes de ser engolido. É esse brilho que chamamos de quasar."],
      ["Se nem a luz escapa de um buraco negro, como os cientistas descobrem que ele está lá?", ["Não descobrem, é só uma teoria", "Pelo cheiro", "Pelo barulho que ele faz", "Pelo disco de gás quente que brilha em volta dele e pelo jeito que ele puxa as estrelas próximas"], "d", "O disco de acreção em volta brilha muito, e as estrelas perto dele giram rápido demais, como se fossem puxadas por algo invisível e muito pesado."],
      ["Qual foi o primeiro buraco negro a ser fotografado, em 2019?", ["O do centro da galáxia M87", "O TON 618", "O do centro do Sol", "O da Lua"], "a", "A rede de telescópios Event Horizon Telescope fotografou o buraco negro da galáxia M87 em 2019 e, em 2022, o Sagitário A*, do centro da nossa galáxia."],
      ["Como se chama o buraco negro gigante que fica no centro da Via Láctea?", ["TON 618", "Sagitário A*", "Andrômeda", "Proxima"], "b", "Sagitário A* tem uns 4 milhões de vezes a massa do Sol. Fica a uns 26 mil anos-luz da Terra, então não há perigo pra gente!"],
      ["O Sol vai virar um buraco negro um dia?", ["Sim, daqui a 10 anos", "Sim, todas as estrelas viram", "Não: ele não tem massa suficiente; vai virar uma gigante vermelha e depois uma anã branca", "Ele já é um buraco negro"], "c", "Só estrelas muito maiores que o Sol viram buracos negros. O Sol vai inchar como gigante vermelha daqui a uns 5 bilhões de anos e depois encolher numa anã branca."],
      ["Perto de um buraco negro, o tempo...", ["Passa mais devagar, por causa da gravidade muito forte", "Para totalmente pra todo mundo", "Passa mais rápido", "Anda de trás pra frente"], "a", "Einstein previu que a gravidade forte faz o tempo passar mais devagar. Um relógio perto de um buraco negro andaria mais devagar que um aqui na Terra."],
    ]),
  },
  {
    title: "Atalho no Espaço-Tempo",
    icon: "🌀",
    difficulty: "avancado",
    minLevel: 1,
    description: "Abra o buraco de minhoca entendendo o espaço-tempo e as galáxias",
    rewardXp: 240,
    rewardCoins: 115,
    rewardItem: {
      name: "Mapa do Buraco de Minhoca",
      icon: "🗺️",
      description: "O mapa que a Catarina desenhou pra cruzar o atalho do espaço-tempo. Usar dá muito XP.",
      rarity: "epico",
      value: 45,
      xp: 180,
    },
    questions: questions([
      ["O que é um buraco de minhoca?", ["Um buraco que as minhocas cavam na Lua", "Um atalho que a teoria prevê no espaço-tempo, ligando dois lugares distantes do universo", "Um tipo de buraco negro que já foi visitado", "Um cometa com formato de túnel"], "b", "Os buracos de minhoca aparecem nas equações da Relatividade Geral, mas ninguém nunca encontrou um de verdade. No nosso evento, a magia do Mago ajuda!"],
      ["Quem criou a Teoria da Relatividade Geral, que explica a gravidade como a curvatura do espaço-tempo?", ["Isaac Newton", "Galileu Galilei", "Albert Einstein", "Marie Curie"], "c", "Einstein publicou a Relatividade Geral em 1915. Newton tinha explicado a gravidade como uma força, mais de 200 anos antes."],
      ["Na Relatividade Geral, o que é a gravidade?", ["A curvatura do espaço-tempo causada pela massa, como uma bola pesada afundando uma cama elástica", "Um ímã gigante dentro da Terra", "O vento que sopra pra baixo", "O peso do ar"], "a", "A massa \"afunda\" o espaço-tempo à sua volta, e os outros corpos seguem essa curva. Por isso os planetas giram em volta do Sol."],
      ["Em qual galáxia nós vivemos?", ["Andrômeda", "Via Láctea", "Galáxia do Sombrero", "TON 618"], "b", "A Via Láctea recebeu esse nome por causa da faixa clara, \"cor de leite\", que vemos no céu escuro: são bilhões de estrelas dela."],
      ["Qual é o formato da Via Láctea?", ["Redondo como uma bola", "Quadrado", "Espiral com uma barra no centro", "Uma linha reta"], "c", "A Via Láctea é uma galáxia espiral barrada: um disco com braços em espiral e uma barra de estrelas no meio."],
      ["Qual é a grande galáxia mais próxima da Via Láctea?", ["Andrômeda", "A Nuvem de Oort", "O Cinturão de Kuiper", "TON 618"], "a", "Andrômeda fica a uns 2,5 milhões de anos-luz e está vindo na nossa direção: daqui a uns 4,5 bilhões de anos as duas galáxias vão se juntar."],
      ["Mais ou menos quantas estrelas tem a Via Láctea?", ["Umas 100", "Uns 100 mil", "Centenas de bilhões", "Exatamente 8"], "c", "As estimativas ficam entre 100 e 400 bilhões de estrelas. E a maioria delas deve ter planetas em volta!"],
      ["O que são ondas gravitacionais?", ["Ondas do mar causadas pela Lua", "Ondulações no espaço-tempo, causadas por objetos muito pesados se movendo, como dois buracos negros se juntando", "Ondas de rádio dos satélites", "Terremotos no espaço"], "b", "Einstein previu essas ondas em 1916, e elas foram detectadas pela primeira vez em 2015 pelo LIGO, vindas da fusão de dois buracos negros."],
      ["Onde fica o nosso Sistema Solar dentro da Via Láctea?", ["Bem no centro", "Fora da galáxia", "Num dos braços da espiral, a uns 26 mil anos-luz do centro", "Dentro de um buraco negro"], "c", "Moramos num braço menor da espiral, o Braço de Órion, longe do centro. O Sistema Solar leva uns 230 milhões de anos pra dar uma volta na galáxia."],
      ["Segundo a física, nada que tem massa pode ir mais rápido que...", ["O som", "Um foguete", "A luz", "A ISS"], "c", "A velocidade da luz é o limite do universo. Por isso um buraco de minhoca seria tão incrível: um atalho pra chegar longe sem precisar correr mais que a luz."],
    ]),
  },
  {
    title: "A Origem de Tudo",
    icon: "🌌",
    difficulty: "epico",
    minLevel: 1,
    description: "Feche o portal descobrindo como o universo começou e do que ele é feito",
    rewardXp: 260,
    rewardCoins: 120,
    rewardItem: {
      name: "Luz do Big Bang",
      icon: "🌌",
      description: "Um pouquinho da luz mais antiga do universo, guardada num frasco. Usar dá muito XP.",
      rarity: "epico",
      value: 50,
      xp: 200,
    },
    questions: questions([
      ["O que foi o Big Bang?", ["Uma explosão de uma estrela perto da Terra", "O começo da expansão do universo, há uns 13,8 bilhões de anos, a partir de um estado muito quente e denso", "O choque entre dois planetas", "O barulho de um trovão no espaço"], "b", "O Big Bang não foi uma explosão num lugar do espaço: foi o próprio espaço começando a se expandir, a partir de um universo minúsculo, quentíssimo e denso."],
      ["Qual é a idade aproximada do universo?", ["6 mil anos", "4,6 bilhões de anos", "13,8 bilhões de anos", "100 anos"], "c", "O universo tem uns 13,8 bilhões de anos. O Sistema Solar é bem mais novo: uns 4,6 bilhões de anos."],
      ["O que os astrônomos descobriram quando viram que as galáxias estão se afastando umas das outras?", ["Que o universo está se expandindo", "Que as galáxias estão com medo", "Que a Terra é o centro de tudo", "Que o universo está encolhendo"], "a", "Nos anos 1920, Georges Lemaître e Edwin Hubble mostraram que as galáxias se afastam: o espaço entre elas está crescendo."],
      ["O que é a radiação cósmica de fundo?", ["O barulho dos satélites", "A luz das cidades vista do espaço", "O calor do Sol", "Um \"eco\" de luz do universo bem novinho, que hoje chega em todas as direções como micro-ondas"], "d", "Uns 380 mil anos depois do Big Bang, a luz conseguiu viajar livre pela primeira vez. Essa luz antiquíssima ainda chega até nós, esticada em micro-ondas."],
      ["De quais elementos foram feitas principalmente as primeiras estrelas?", ["Ferro e ouro", "Hidrogênio e hélio", "Água e terra", "Carbono e prata"], "b", "Logo depois do Big Bang o universo tinha quase só hidrogênio e hélio. Os outros elementos foram fabricados depois, dentro das estrelas."],
      ["De onde vieram o ferro do nosso sangue e o cálcio dos nossos ossos?", ["Da Lua", "Dos vulcões", "De dentro de estrelas antigas, que fabricaram esses elementos e os espalharam ao explodir", "Das plantas"], "c", "Esses elementos foram forjados em estrelas e espalhados por supernovas. Como dizia Carl Sagan, somos feitos de poeira de estrelas!"],
      ["O que é a matéria escura?", ["Matéria que não brilha nem reflete luz, mas cuja gravidade a gente percebe nas galáxias", "Poeira preta em volta da Terra", "A sombra dos planetas", "O carvão do espaço"], "a", "As galáxias giram rápido demais pra quantidade de estrelas que têm. Algo invisível, com muita gravidade, segura elas: a matéria escura, que é uns 5 vezes mais abundante que a matéria comum."],
      ["O que é a energia escura?", ["A energia dos buracos negros", "Algo misterioso que faz a expansão do universo ficar cada vez mais rápida", "A energia da noite", "A eletricidade dos satélites"], "b", "Em 1998 os astrônomos descobriram que a expansão do universo está acelerando. Chamaram a causa desconhecida de energia escura."],
      ["Como fica uma estrela parecida com o Sol no fim da vida?", ["Vira um buraco negro gigante", "Some sem deixar nada", "Vira um planeta", "Incha como gigante vermelha e depois encolhe numa anã branca, cercada por uma nebulosa colorida"], "d", "As camadas de fora se espalham formando uma nebulosa planetária, e o núcleo que sobra vira uma anã branca, do tamanho da Terra e muito quente."],
      ["O que é uma supernova?", ["Uma estrela recém-nascida", "A explosão gigantesca de uma estrela muito pesada no fim da vida, que pode brilhar mais que uma galáxia inteira por um tempo", "Um planeta muito brilhante", "Um satélite novo"], "b", "Numa supernova, uma estrela pode brilhar mais que bilhões de sóis por semanas. É nela que se formam muitos elementos pesados do universo."],
    ]),
  },
];
