import { MissionContent } from "../../../src/engine/missions";
import { quizMission } from "./quiz-materia";

// Missões de Física pra Biblioteca de Missões (tomo de Física): 5 missões de
// 10 perguntas comentadas, nos níveis 1, 5, 10, 15 e 20, com o conteúdo de
// Ciências do fundamental e de Física do ensino médio: movimento, as leis de
// Newton, energia e calor, ondas, som e luz, e eletricidade e magnetismo.
// O professor ajusta XP, moedas e itens no painel. Importar com:
//   npm run missions:import -- <e-mail do professor> scripts/missions/fisica.ts
const missions: MissionContent[] = [
    quizMission({
        subject: "fisica",
        level: 1,
        title: "Física: Movimento e Velocidade",
        icon: "🏃",
        description: "Velocidade média, unidades de medida e o que é estar em movimento",
        item: { name: "Cronômetro de Corrida", icon: "⏱️", description: "Mede o tempo de qualquer corrida até o centésimo de segundo. Usar dá XP de quem calcula a velocidade." },
        questions: [
            ["Como se calcula a velocidade média?", ["Distância percorrida dividida pelo tempo gasto", "Tempo dividido pela distância", "Distância vezes o tempo", "Distância mais o tempo"], 0, "Velocidade média = distância ÷ tempo. Quem anda 100 m em 20 s tem velocidade média de 5 m/s."],
            ["Um carro percorre 180 km em 2 horas. Qual a velocidade média dele?", ["60 km/h", "90 km/h", "360 km/h", "180 km/h"], 1, "180 km ÷ 2 h = 90 km/h."],
            ["Qual é a unidade de velocidade no Sistema Internacional (SI)?", ["km/h", "m/s", "m/s²", "km"], 1, "No SI, distância é em metros e tempo em segundos, então a velocidade é em m/s. O km/h é muito usado no dia a dia."],
            ["Quanto é 72 km/h em m/s?", ["20 m/s", "72 m/s", "7,2 m/s", "259 m/s"], 0, "Pra passar de km/h pra m/s, divide-se por 3,6: 72 ÷ 3,6 = 20 m/s."],
            ["Você está sentado num ônibus andando. Em relação ao motorista, você está:", ["Em movimento", "Em repouso", "Mais rápido que ele", "Caindo"], 1, "Movimento e repouso dependem do referencial. Em relação ao motorista você está parado; em relação à calçada, se movendo."],
            ["O que é aceleração?", ["A variação da velocidade num intervalo de tempo", "A distância total percorrida", "O tempo de uma viagem", "A força do motor"], 0, "Acelerar é mudar a velocidade. Frear também é uma aceleração (negativa), e fazer curva também muda a velocidade (a direção dela)."],
            ["Qual é a unidade de aceleração no SI?", ["m/s", "m/s²", "km/h", "N"], 1, "Aceleração mede quantos m/s a velocidade muda a cada segundo, por isso é m/s²."],
            ["Um corredor faz 100 m em 10 s. Qual a velocidade média dele?", ["1 m/s", "10 m/s", "100 m/s", "1000 m/s"], 1, "100 m ÷ 10 s = 10 m/s, que é cerca de 36 km/h. O recorde mundial dos 100 m é de 9,58 s, de Usain Bolt."],
            ["Quantos metros tem 1 quilômetro?", ["10", "100", "1000", "10000"], 2, "O prefixo \"quilo\" significa mil: 1 km = 1000 m, assim como 1 kg = 1000 g."],
            ["Um ciclista anda a 15 km/h durante 3 horas. Que distância ele percorre?", ["5 km", "18 km", "45 km", "12 km"], 2, "Distância = velocidade × tempo: 15 km/h × 3 h = 45 km."],
        ],
    }),
    quizMission({
        subject: "fisica",
        level: 5,
        title: "Física: Forças e as Leis de Newton",
        icon: "🍎",
        description: "Inércia, F = m·a, ação e reação, peso e atrito",
        item: { name: "Maçã de Newton", icon: "🍎", description: "Dizem que foi uma dessas que caiu perto do Newton. Usar dá XP de quem sente a força da gravidade." },
        questions: [
            ["O que diz a Primeira Lei de Newton (Lei da Inércia)?", ["Um corpo tende a manter seu estado de repouso ou de movimento em linha reta, se nenhuma força o mudar", "Toda ação tem uma reação", "Força é massa vezes aceleração", "Tudo que sobe desce"], 0, "Por inércia, quando o ônibus freia de repente, o corpo do passageiro continua indo pra frente. Por isso usamos cinto de segurança."],
            ["Qual é a fórmula da Segunda Lei de Newton?", ["F = m · a", "E = m · c²", "V = R · i", "P = F / A"], 0, "A força resultante é igual à massa vezes a aceleração. Quanto mais massa, mais força é preciso pra acelerar."],
            ["Qual força é necessária para dar uma aceleração de 2 m/s² a um objeto de 10 kg?", ["5 N", "12 N", "20 N", "8 N"], 2, "F = m · a = 10 kg × 2 m/s² = 20 N (newtons)."],
            ["Ao nadar, você empurra a água para trás e vai para frente. Isso mostra qual lei?", ["Lei da Inércia", "Lei da Ação e Reação (Terceira Lei)", "Lei da Gravitação", "Lei de Ohm"], 1, "Toda ação tem uma reação de mesma intensidade e sentido oposto. Foguetes funcionam assim: empurram os gases pra baixo e são empurrados pra cima."],
            ["Qual é a unidade de força no Sistema Internacional?", ["Quilograma (kg)", "Newton (N)", "Joule (J)", "Watt (W)"], 1, "A força é medida em newtons, em homenagem a Isaac Newton. 1 N é a força que acelera 1 kg a 1 m/s²."],
            ["Qual é a diferença entre massa e peso?", ["Não há diferença", "Massa é a quantidade de matéria (kg); peso é a força da gravidade sobre o corpo (N)", "Peso é medido em kg e massa em N", "Massa muda de planeta pra planeta"], 1, "A massa é a mesma em qualquer lugar; o peso muda conforme a gravidade. Na balança dizemos \"peso\", mas ela mostra a massa."],
            ["Na Terra, com g = 10 m/s², quanto pesa uma pessoa de 50 kg?", ["50 N", "500 N", "5 N", "60 N"], 1, "Peso = massa × gravidade: 50 kg × 10 m/s² = 500 N."],
            ["Qual força faz um livro empurrado sobre a mesa parar depois de um tempo?", ["A força de atrito", "A força magnética", "A força elétrica", "A inércia"], 0, "O atrito aparece entre superfícies que se esfregam e se opõe ao movimento. Sem atrito, o livro continuaria deslizando."],
            ["Sem considerar a resistência do ar, se você soltar uma bola de boliche e uma de tênis da mesma altura:", ["A de boliche chega bem antes", "As duas chegam juntas ao chão", "A de tênis chega antes", "Nenhuma cai"], 1, "Sem o ar, todos os corpos caem com a mesma aceleração (a da gravidade). Um astronauta mostrou isso na Lua com um martelo e uma pena."],
            ["Por que é mais fácil andar num chão seco do que num chão ensaboado?", ["Porque o chão seco tem mais atrito, que dá apoio pro pé empurrar o chão", "Porque o sabão aumenta a gravidade", "Porque o chão seco é mais leve", "Não tem diferença"], 0, "Pra andar, empurramos o chão pra trás (e ele nos empurra pra frente). Isso depende do atrito: no chão ensaboado, o pé escorrega."],
        ],
    }),
    quizMission({
        subject: "fisica",
        level: 10,
        title: "Física: Energia e Calor",
        icon: "🔥",
        description: "Formas de energia, conservação, temperatura e propagação do calor",
        item: { name: "Termômetro Encantado", icon: "🌡️", description: "Mede a temperatura de qualquer coisa, até de dragão. Usar dá XP de quem domina o calor." },
        questions: [
            ["Qual é a unidade de energia no Sistema Internacional?", ["Watt (W)", "Joule (J)", "Newton (N)", "Volt (V)"], 1, "Energia é medida em joules. As calorias dos alimentos também são energia: 1 caloria vale cerca de 4,18 J."],
            ["Que tipo de energia tem um objeto em movimento?", ["Energia cinética", "Energia potencial", "Energia nuclear", "Energia química"], 0, "A energia cinética depende da massa e da velocidade: Ec = m·v²/2. Quanto mais rápido, muito mais energia."],
            ["Uma pedra parada no alto de um penhasco tem qual tipo de energia por estar no alto?", ["Cinética", "Potencial gravitacional", "Elétrica", "Sonora"], 1, "A energia potencial gravitacional (Ep = m·g·h) depende da altura. Quando a pedra cai, ela vira energia cinética."],
            ["O Princípio da Conservação da Energia diz que:", ["A energia pode ser criada do nada", "A energia não é criada nem destruída, só transformada", "A energia sempre acaba", "Só existe energia elétrica"], 1, "Na usina hidrelétrica, por exemplo, a energia potencial da água vira cinética, que gira as turbinas e vira energia elétrica."],
            ["Qual é a diferença entre calor e temperatura?", ["São a mesma coisa", "Temperatura mede a agitação das partículas; calor é a energia que passa do corpo mais quente pro mais frio", "Calor é medido em °C e temperatura em joules", "Temperatura só existe no verão"], 1, "O calor é energia em trânsito e sempre flui do mais quente pro mais frio, até os dois ficarem na mesma temperatura (equilíbrio térmico)."],
            ["Como o calor do Sol chega até a Terra, atravessando o espaço vazio?", ["Por condução", "Por convecção", "Por irradiação (ondas eletromagnéticas)", "Pelo vento solar"], 2, "No vácuo não há partículas pra conduzir o calor nem ar pra formar correntes. A irradiação viaja como onda eletromagnética, como a luz."],
            ["Por que a colher de metal esquenta quando fica dentro da panela quente?", ["Por condução: o calor passa de partícula em partícula pelo metal", "Por irradiação", "Por convecção", "Porque o metal produz calor"], 0, "Na condução, as partículas mais agitadas passam a agitação pras vizinhas. Metais são bons condutores; madeira e plástico, isolantes."],
            ["Por que o ar-condicionado costuma ficar no alto da parede?", ["Por estética", "Porque o ar frio é mais denso, desce, e o ar quente sobe: forma-se uma corrente de convecção", "Pra ficar longe das crianças", "Porque o ar frio sobe"], 1, "A convecção acontece em líquidos e gases: o fluido quente sobe e o frio desce. O aquecedor, ao contrário, fica embaixo."],
            ["Ao nível do mar, a que temperatura a água ferve?", ["50 °C", "100 °C", "0 °C", "212 °C"], 1, "A água ferve a 100 °C e congela a 0 °C ao nível do mar. No alto de montanhas, onde a pressão é menor, ela ferve antes dos 100 °C."],
            ["Qual destas é uma fonte de energia renovável?", ["Petróleo", "Carvão mineral", "Energia solar", "Gás natural"], 2, "Solar, eólica (vento) e hidrelétrica se renovam. Petróleo, carvão e gás natural são combustíveis fósseis e vão se esgotar."],
        ],
    }),
    quizMission({
        subject: "fisica",
        level: 15,
        title: "Física: Ondas, Som e Luz",
        icon: "🌈",
        description: "Como o som e a luz viajam, reflexão, refração e o arco-íris",
        item: { name: "Prisma Arco-Íris", icon: "🌈", description: "Um cristal que abre a luz branca em sete cores. Usar dá XP de quem entende a luz." },
        questions: [
            ["O som consegue se propagar no vácuo do espaço?", ["Sim, mais rápido que no ar", "Não, porque o som precisa de um meio material (ar, água, sólido) para se propagar", "Só o som agudo", "Sim, igual à luz"], 1, "O som é uma onda mecânica: é a vibração das partículas do meio. No vácuo não há partículas, então não há som."],
            ["Qual é a velocidade aproximada do som no ar?", ["340 m/s", "300.000 km/s", "3 m/s", "34.000 m/s"], 0, "No ar, o som anda cerca de 340 m/s. Na água e nos sólidos ele é ainda mais rápido."],
            ["Qual é a velocidade da luz no vácuo, aproximadamente?", ["340 m/s", "300.000 km/s", "1.000 km/h", "3.000 m/s"], 1, "A luz anda cerca de 300 mil quilômetros por segundo: daria mais de 7 voltas na Terra em um segundo."],
            ["Numa tempestade, por que vemos o relâmpago antes de ouvir o trovão?", ["Porque a luz é muito mais rápida que o som", "Porque o trovão acontece depois", "Porque os olhos são mais rápidos que os ouvidos", "Por causa do vento"], 0, "Os dois acontecem juntos, mas a luz chega quase na hora e o som demora. Cada 3 segundos de espera indicam cerca de 1 km de distância."],
            ["O que é o eco?", ["O som que reflete num obstáculo e volta até quem fez o som", "Um som muito agudo", "O som dentro d'água", "Um som que não pode ser ouvido"], 0, "O eco é a reflexão do som. Morcegos e golfinhos usam o eco pra se localizar, e o sonar dos navios também."],
            ["Um som mais agudo (fininho) tem:", ["Frequência maior", "Frequência menor", "Volume maior", "Velocidade menor"], 0, "A altura do som depende da frequência: agudo é frequência alta, grave é frequência baixa. Volume é a intensidade, outra coisa."],
            ["Por que o canudo parece quebrado dentro de um copo d'água?", ["Por causa da refração: a luz muda de direção ao passar da água para o ar", "Porque a água entorta o canudo", "Por causa do eco", "Por causa da reflexão no copo"], 0, "Ao mudar de meio, a luz muda de velocidade e desvia. Isso é refração, e é o que faz as lentes dos óculos funcionarem."],
            ["Como se forma o arco-íris?", ["A luz do Sol se decompõe em cores ao refratar e refletir nas gotas de chuva", "As nuvens são pintadas de cores", "A Lua reflete cores", "O vento mistura as cores"], 0, "A luz branca é a mistura de todas as cores. Cada cor desvia um pouco diferente nas gotas, e elas se separam no céu."],
            ["Por que uma camiseta é vista como vermelha sob a luz branca?", ["Porque ela reflete a luz vermelha e absorve as outras cores", "Porque ela absorve o vermelho", "Porque ela produz luz vermelha", "Porque os olhos são vermelhos"], 0, "A cor que vemos é a cor que o objeto reflete. Uma roupa preta absorve quase todas as cores e por isso esquenta mais no sol."],
            ["No espelho plano, como fica a imagem de quem levanta a mão direita?", ["A imagem parece levantar a mão esquerda", "A imagem fica de cabeça pra baixo", "A imagem fica menor", "Não aparece imagem"], 0, "O espelho plano inverte esquerda e direita (é por isso que AMBULÂNCIA vem escrita ao contrário no capô, pra ser lida no retrovisor)."],
        ],
    }),
    quizMission({
        subject: "fisica",
        level: 20,
        title: "Física: Eletricidade e Magnetismo",
        icon: "⚡",
        description: "Corrente, tensão, resistência, circuitos, consumo de energia e ímãs",
        item: { name: "Ímã de Ferradura", icon: "🧲", description: "Um ímã vermelho que puxa até moeda da mochila. Usar dá XP de quem domina a eletricidade." },
        questions: [
            ["O que é a corrente elétrica?", ["O movimento ordenado de cargas elétricas, como os elétrons, num condutor", "A água passando no cano", "A luz da lâmpada", "Um tipo de ímã"], 0, "Quando ligamos um aparelho, os elétrons passam a se mover de forma ordenada pelos fios: isso é a corrente, medida em ampères (A)."],
            ["Em qual unidade é medida a tensão elétrica (diferença de potencial)?", ["Ampère (A)", "Volt (V)", "Ohm (Ω)", "Watt (W)"], 1, "A tensão é o \"empurrão\" que faz a corrente andar, medida em volts. As tomadas no Brasil são de 127 V ou 220 V."],
            ["Qual é a fórmula da Primeira Lei de Ohm?", ["U = R · i", "F = m · a", "P = m · g", "E = m · c²"], 0, "Tensão (U) = resistência (R) × corrente (i). Com 2 Ω de resistência e 3 A de corrente, a tensão é 6 V."],
            ["Qual destes materiais é um bom condutor de eletricidade?", ["Borracha", "Cobre", "Plástico", "Vidro"], 1, "Os metais, como o cobre dos fios, conduzem bem. Borracha e plástico são isolantes e por isso cobrem os fios."],
            ["Um chuveiro de 5.000 W ligado por 1 hora consome quanta energia?", ["5 kWh", "50 kWh", "0,5 kWh", "5.000 kWh"], 0, "Energia = potência × tempo. 5.000 W = 5 kW; 5 kW × 1 h = 5 kWh, a unidade que aparece na conta de luz."],
            ["Na instalação de uma casa, as lâmpadas ficam em paralelo. Por quê?", ["Pra que, se uma queimar, as outras continuem acesas", "Pra gastar mais energia", "Pra que todas apaguem juntas", "Porque é mais bonito"], 0, "Em paralelo, cada aparelho tem seu próprio caminho pra corrente. Em série, se um queima, o circuito todo abre e tudo apaga."],
            ["O que acontece quando aproximamos os polos iguais de dois ímãs (norte com norte)?", ["Eles se atraem", "Eles se repelem", "Nada acontece", "Eles perdem o magnetismo"], 1, "Polos iguais se repelem e polos diferentes se atraem. Se você quebrar um ímã, cada pedaço vira um ímã com norte e sul."],
            ["Por que a agulha da bússola aponta para o norte?", ["Porque a Terra se comporta como um grande ímã", "Por causa do vento", "Porque o Sol nasce no leste", "Por causa da Lua"], 0, "A Terra tem um campo magnético. O polo norte da agulha é atraído pro polo sul magnético da Terra, que fica perto do polo norte geográfico."],
            ["O que é um curto-circuito?", ["Quando a corrente passa por um caminho de resistência quase zero, ficando muito alta e podendo causar incêndio", "Um circuito muito pequeno", "Uma lâmpada fraca", "Quando falta luz"], 0, "No curto, a corrente dispara e esquenta os fios. Disjuntores e fusíveis desligam o circuito pra evitar acidentes."],
            ["Qual dispositivo transforma energia mecânica (movimento) em energia elétrica nas usinas?", ["O gerador", "A lâmpada", "O resistor", "A bateria descarregada"], 0, "Nos geradores, ímãs e bobinas giram e produzem corrente: é a indução eletromagnética, descoberta por Faraday."],
        ],
    }),
]

export default missions
