import { MissionContent } from "../../../src/engine/missions";
import { quizMission } from "./quiz-materia";

// Mais 5 missões de Física (tomo de Física), nos níveis 1, 5, 10, 15 e 20:
// pressão e fluidos, trabalho e máquinas simples, termodinâmica, lentes e
// espelhos, e física moderna. Recompensa especial: 500 XP (Nv1, Nv5 e Nv10)
// ou 800 XP (Nv15 e Nv20), sempre com 200 moedas. Não repetem as perguntas de
// fisica.ts.
// Importar com:
//   npm run missions:import -- <e-mail do professor> scripts/missions/fisica-parte-2.ts
const missions: MissionContent[] = [
    quizMission({
        subject: "fisica",
        level: 1,
        xp: 500,
        coins: 200,
        title: "Física: Pressão e Fluidos",
        icon: "🌊",
        description: "Pressão, pressão atmosférica, empuxo e o Princípio de Pascal",
        item: { name: "Barômetro de Torricelli", icon: "🌊", description: "Mede o peso do ar sobre a sua cabeça. Usar dá XP de quem entende os fluidos." },
        questions: [
            ["Como se calcula a pressão?", ["Força dividida pela área", "Força vezes a área", "Massa vezes a velocidade", "Área dividida pelo tempo"], 0, "P = F / A. A mesma força numa área menor gera uma pressão maior."],
            ["Por que uma faca afiada corta melhor que uma cega?", ["Porque o fio fino concentra a força numa área pequena, aumentando a pressão", "Porque é mais pesada", "Porque é mais brilhante", "Porque esquenta mais"], 0, "Pelo mesmo motivo, um prego tem ponta fina e um sapato de neve tem área grande, para afundar menos."],
            ["Qual é a unidade de pressão no Sistema Internacional?", ["Pascal (Pa)", "Newton (N)", "Joule (J)", "Watt (W)"], 0, "1 pascal é 1 newton por metro quadrado."],
            ["O que acontece com a pressão atmosférica quando subimos uma montanha?", ["Diminui, porque há menos ar acima de nós", "Aumenta", "Fica igual", "Vira zero no topo"], 0, "Por isso o ouvido \"tapa\" ao subir a serra ou num avião."],
            ["O que acontece com a pressão sobre um mergulhador à medida que ele desce no mar?", ["Aumenta, porque há mais água acima dele", "Diminui", "Fica igual", "Some"], 0, "Pelo Teorema de Stevin, a cada 10 m de profundidade a pressão aumenta cerca de 1 atmosfera."],
            ["Quem fez o famoso experimento com um tubo de mercúrio que mediu a pressão atmosférica?", ["Evangelista Torricelli", "Isaac Newton", "Albert Einstein", "Galileu Galilei"], 0, "Ao nível do mar, a pressão do ar sustenta uma coluna de cerca de 76 cm de mercúrio."],
            ["Um objeto mergulhado na água afunda quando:", ["A densidade dele é maior que a da água", "A densidade dele é menor que a da água", "Ele é colorido", "Ele é pequeno"], 0, "Se a densidade for menor, o empuxo vence o peso e o objeto flutua."],
            ["O que diz o Princípio de Arquimedes?", ["Um corpo mergulhado num fluido recebe uma força para cima igual ao peso do fluido que ele desloca", "Todo corpo cai com a mesma velocidade", "A energia não se perde", "Toda ação tem uma reação"], 0, "Essa força para cima é o empuxo. Dizem que Arquimedes gritou \"Eureka!\" ao descobrir isso no banho."],
            ["Qual princípio explica o macaco hidráulico, que levanta um carro com pouca força?", ["Princípio de Pascal", "Princípio da Inércia", "Lei de Ohm", "Lei da Gravitação"], 0, "A pressão aplicada num líquido se transmite igualmente para todos os pontos dele."],
            ["Por que conseguimos tomar suco com um canudinho?", ["Ao sugar, diminuímos a pressão dentro do canudo, e a pressão atmosférica empurra o suco para cima", "Porque o suco é leve", "Porque o canudo tem um ímã", "Porque a boca puxa o suco como uma corda"], 0, "Sem ar em volta (no vácuo), o canudinho não funcionaria."],
        ],
    }),
    quizMission({
        subject: "fisica",
        level: 5,
        xp: 500,
        coins: 200,
        title: "Física: Trabalho, Potência e Máquinas Simples",
        icon: "🏗️",
        description: "Trabalho, potência, alavancas, roldanas, planos inclinados e molas",
        item: { name: "Alavanca de Arquimedes", icon: "🏗️", description: "\"Deem-me um ponto de apoio e moverei o mundo.\" Usar dá XP de quem faz menos força." },
        questions: [
            ["Como se calcula o trabalho de uma força que empurra um objeto na mesma direção do movimento?", ["Força vezes deslocamento", "Força dividida pelo tempo", "Massa vezes aceleração", "Potência vezes área"], 0, "τ = F × d. Empurrar uma caixa com 10 N por 3 m realiza 30 J de trabalho."],
            ["Qual é a unidade de potência no Sistema Internacional?", ["Watt (W), que é joule por segundo", "Joule (J)", "Newton (N)", "Pascal (Pa)"], 0, "Potência mede a rapidez com que o trabalho é feito: P = trabalho ÷ tempo."],
            ["Um motor faz 600 J de trabalho em 3 segundos. Qual é a sua potência?", ["200 W", "1800 W", "600 W", "3 W"], 0, "P = 600 ÷ 3 = 200 W."],
            ["Para que serve uma máquina simples, como uma alavanca?", ["Para diminuir a força necessária ou mudar a direção dela", "Para criar energia do nada", "Para aumentar o peso das coisas", "Para medir o tempo"], 0, "As máquinas simples não criam energia: diminuem a força, mas aumentam a distância percorrida."],
            ["Numa gangorra, como uma criança leve consegue equilibrar uma pessoa mais pesada?", ["Sentando mais longe do ponto de apoio", "Sentando mais perto do ponto de apoio", "Pulando mais alto", "Não consegue"], 0, "Na alavanca, força × distância ao apoio precisa ser igual dos dois lados."],
            ["O que faz uma roldana fixa, como a que sobe o balde do poço?", ["Muda a direção da força, permitindo puxar para baixo para levantar algo", "Diminui o peso do balde pela metade", "Aumenta a força pela metade", "Faz o balde flutuar"], 0, "Já a roldana móvel divide a força necessária por dois."],
            ["Por que é mais fácil subir uma rampa do que levantar um objeto direto para cima?", ["Porque o plano inclinado exige menos força, embora a distância percorrida seja maior", "Porque a rampa diminui a gravidade", "Porque a rampa cria energia", "Não é mais fácil"], 0, "As rampas de acessibilidade usam esse princípio."],
            ["Uma tesoura e um alicate funcionam como qual máquina simples?", ["Alavanca", "Roldana", "Plano inclinado", "Roda d'água"], 0, "O eixo que une as duas lâminas é o ponto de apoio da alavanca."],
            ["Segundo a Lei de Hooke, o que acontece com uma mola quando dobramos a força aplicada?", ["Ela se deforma o dobro (dentro do limite elástico)", "Ela não se deforma", "Ela se deforma a metade", "Ela quebra sempre"], 0, "F = k × x: a força é proporcional à deformação da mola."],
            ["O que é o rendimento de uma máquina?", ["A parte da energia recebida que vira trabalho útil", "O preço da máquina", "A velocidade da máquina", "A cor da máquina"], 0, "Nenhuma máquina real tem 100% de rendimento: parte da energia vira calor pelo atrito."],
        ],
    }),
    quizMission({
        subject: "fisica",
        level: 10,
        xp: 500,
        coins: 200,
        title: "Física: Termodinâmica",
        icon: "🔥",
        description: "Escalas de temperatura, dilatação, calor específico e as leis da termodinâmica",
        item: { name: "Máquina a Vapor de Bolso", icon: "🚂", description: "Transforma calor em movimento, apitando. Usar dá XP de quem entende o calor." },
        questions: [
            ["O que é o zero absoluto?", ["A menor temperatura possível, 0 K (cerca de −273 °C)", "A temperatura de congelamento da água", "A temperatura do espaço perto do Sol", "0 °C"], 0, "No zero absoluto, a agitação das partículas seria a mínima possível."],
            ["Quanto é 25 °C na escala Kelvin?", ["298 K", "25 K", "273 K", "−248 K"], 0, "Para converter, soma-se 273: 25 + 273 = 298 K."],
            ["A água congela a 0 °C. Quanto é isso na escala Fahrenheit?", ["32 °F", "0 °F", "100 °F", "212 °F"], 0, "Na escala Fahrenheit, usada nos Estados Unidos, a água congela a 32 °F e ferve a 212 °F."],
            ["Por que as pontes e os trilhos de trem têm pequenas folgas (juntas de dilatação)?", ["Porque os materiais se dilatam com o calor e precisam de espaço para não entortar", "Para economizar material", "Para a água passar", "Por decoração"], 0, "No calor, os materiais aumentam um pouquinho de tamanho; no frio, encolhem."],
            ["Na praia, de dia, a areia esquenta muito mais rápido que a água do mar. Por quê?", ["Porque a água tem um calor específico muito maior que a areia", "Porque a água reflete toda a luz", "Porque a areia é mais leve", "Porque o mar é mais fundo"], 0, "Calor específico alto significa que é preciso muita energia para aquecer a água."],
            ["O que diz a Primeira Lei da Termodinâmica?", ["A energia se conserva: o calor recebido vira trabalho e aumento da energia interna", "O calor vai do frio para o quente sozinho", "A temperatura nunca muda", "O zero absoluto é atingido facilmente"], 0, "É o princípio da conservação da energia aplicado ao calor."],
            ["O que diz a Segunda Lei da Termodinâmica sobre o calor?", ["O calor flui espontaneamente do corpo mais quente para o mais frio", "O calor vai do frio para o quente sozinho", "O calor não existe", "O calor some sem deixar rastro"], 0, "Ela também mostra que nenhuma máquina térmica transforma todo o calor em trabalho."],
            ["Por que nenhuma máquina térmica tem 100% de rendimento?", ["Porque parte do calor sempre é perdida para o ambiente mais frio", "Porque as máquinas são mal-feitas", "Porque o combustível é caro", "Porque a gravidade atrapalha"], 0, "O motor de um carro, por exemplo, aproveita só uma parte da energia do combustível."],
            ["Enquanto a água ferve, o que acontece com a temperatura dela?", ["Fica constante, porque a energia está sendo usada para mudar de estado", "Continua subindo sem parar", "Cai", "Oscila muito"], 0, "Na mudança de estado, o calor recebido é chamado de calor latente."],
            ["Como uma geladeira consegue esfriar os alimentos?", ["Um gás circula, retira calor de dentro e o libera para fora, na grade de trás", "Ela produz frio do nada", "Ela usa gelo trazido de fora", "Ela bloqueia a luz"], 0, "Por isso a parte de trás da geladeira fica quente: é para onde vai o calor retirado."],
        ],
    }),
    quizMission({
        subject: "fisica",
        level: 15,
        xp: 800,
        coins: 200,
        title: "Física: Lentes e Espelhos",
        icon: "🔍",
        description: "Lentes convergentes e divergentes, a visão, espelhos curvos e a fibra óptica",
        item: { name: "Lupa de Cristal", icon: "🔍", description: "Aumenta tudo, até os detalhes escondidos. Usar dá XP de quem domina a óptica." },
        questions: [
            ["Que tipo de lente é uma lupa?", ["Convergente (mais grossa no meio)", "Divergente (mais fina no meio)", "Plana", "Espelhada"], 0, "A lente convergente concentra os raios de luz num ponto, o foco."],
            ["Uma pessoa míope enxerga mal de longe. Que lente corrige a miopia?", ["Divergente", "Convergente", "Bifocal só para perto", "Lente escura"], 0, "No olho míope, a imagem se forma antes da retina; a lente divergente corrige isso."],
            ["Uma pessoa hipermetrope enxerga mal de perto. Que lente corrige a hipermetropia?", ["Convergente", "Divergente", "Plana", "Prismática"], 0, "No olho hipermetrope, a imagem se forma depois da retina."],
            ["Qual parte do olho funciona como uma lente que muda de forma para focar?", ["O cristalino", "A íris", "A córnea apenas", "O nervo óptico"], 0, "Com a idade, o cristalino perde flexibilidade, e surge a presbiopia (\"vista cansada\")."],
            ["Por que os espelhos dos retrovisores de moto e os de garagem são convexos?", ["Porque mostram um campo de visão maior, embora as imagens pareçam menores", "Porque aumentam as imagens", "Porque são mais baratos", "Porque invertem as cores"], 0, "Os espelhos convexos são curvados para fora."],
            ["Que tipo de espelho é usado para fazer a barba ou se maquiar, ampliando o rosto?", ["Côncavo", "Convexo", "Plano", "Nenhum espelho amplia"], 0, "Perto do espelho côncavo, a imagem fica direita e maior."],
            ["Numa câmara escura (uma caixa com um furinho), como fica a imagem projetada?", ["Invertida (de cabeça para baixo)", "Igual ao objeto", "Colorida de azul", "Sem nenhuma imagem"], 0, "Os raios de luz se cruzam no furo. O olho humano também forma imagens invertidas na retina."],
            ["Qual fenômeno permite que a luz viaje dentro de uma fibra óptica, levando internet?", ["Reflexão total", "Difração", "Dispersão", "Absorção"], 0, "A luz bate na parede interna da fibra e se reflete por completo, seguindo pelo cabo mesmo em curvas."],
            ["O que mede o índice de refração de um material?", ["Quanto a luz fica mais lenta ao atravessar o material, em relação ao vácuo", "O peso do material", "A temperatura do material", "A cor do material"], 0, "A luz é mais lenta na água e no vidro do que no ar, por isso ela desvia ao mudar de meio."],
            ["Como se chama a distância entre o centro de uma lente e o ponto onde os raios se encontram?", ["Distância focal", "Raio de luz", "Ângulo de visão", "Índice de refração"], 0, "Quanto menor a distância focal, mais \"forte\" é a lente."],
        ],
    }),
    quizMission({
        subject: "fisica",
        level: 20,
        xp: 800,
        coins: 200,
        title: "Física: Física Moderna",
        icon: "⚛️",
        description: "Relatividade, efeito fotoelétrico, física quântica e energia nuclear",
        item: { name: "Fórmula de Einstein", icon: "✨", description: "E = mc², gravada em ouro. Usar dá XP de quem pensa como os gênios." },
        questions: [
            ["O que significa a famosa equação E = mc², de Einstein?", ["Que massa e energia são equivalentes: uma pequena massa corresponde a uma enorme energia", "Que a energia é sempre zero", "Que a massa aumenta com a cor", "Que a luz não tem velocidade"], 0, "O c é a velocidade da luz; ao quadrado, é um número gigantesco."],
            ["Segundo a relatividade, o que acontece com o tempo para quem viaja muito perto da velocidade da luz?", ["Passa mais devagar em relação a quem ficou parado", "Para completamente", "Passa mais rápido", "Volta para trás"], 0, "Esse efeito se chama dilatação do tempo e já foi medido com relógios atômicos em aviões."],
            ["Por que os satélites de GPS precisam de correções da teoria da relatividade?", ["Porque o tempo passa de forma ligeiramente diferente lá em cima, e sem correção o GPS erraria muitos quilômetros por dia", "Porque os satélites são muito pesados", "Porque o GPS usa ondas sonoras", "Não precisam"], 0, "Sem as correções, o erro de posição cresceria vários quilômetros a cada dia."],
            ["Por qual descoberta Einstein ganhou o Nobel de Física em 1921?", ["A explicação do efeito fotoelétrico", "A relatividade geral", "A bomba atômica", "A lâmpada"], 0, "No efeito fotoelétrico, a luz arranca elétrons de um metal. Ele mostrou que a luz vem em pacotes de energia, os fótons."],
            ["O que é um fóton?", ["Uma partícula (pacote) de energia da luz", "Um tipo de átomo", "Uma lente", "Uma câmera fotográfica"], 0, "A luz tem comportamento de onda e de partícula ao mesmo tempo."],
            ["Qual cientista é considerado o pai da física quântica, com a ideia de que a energia vem em pacotes (quanta)?", ["Max Planck", "Isaac Newton", "Galileu Galilei", "Michael Faraday"], 0, "Planck apresentou a ideia em 1900, ao estudar a luz emitida por corpos quentes."],
            ["Qual cientista, ganhadora de dois prêmios Nobel, estudou a radioatividade e descobriu o polônio e o rádio?", ["Marie Curie", "Rosalind Franklin", "Lise Meitner", "Ada Lovelace"], 0, "Marie Curie foi a primeira pessoa a ganhar dois Nobel, em Física (1903) e em Química (1911)."],
            ["O que é a meia-vida de um material radioativo?", ["O tempo para metade dos átomos radioativos se transformar", "A metade do tempo de vida de uma pessoa", "O tempo para o material derreter", "A metade do peso do material"], 0, "Depois de duas meias-vidas, sobra um quarto dos átomos iniciais."],
            ["Como as usinas nucleares, como as de Angra dos Reis, geram energia?", ["Pela fissão nuclear: núcleos de urânio se dividem e liberam calor, que gera vapor e move turbinas", "Pela fusão de hidrogênio, como no Sol", "Pela queima de carvão", "Pela força dos ventos"], 0, "A fusão nuclear, que acontece nas estrelas, ainda é estudada para gerar energia na Terra."],
            ["O que diz o Princípio da Incerteza, de Heisenberg?", ["Não é possível saber com precisão total, ao mesmo tempo, a posição e a velocidade de uma partícula", "Ninguém tem certeza de nada na vida", "A luz não tem velocidade", "Os átomos não existem"], 0, "É uma característica da natureza no mundo muito pequeno, não um defeito dos instrumentos."],
        ],
    }),
]

export default missions
