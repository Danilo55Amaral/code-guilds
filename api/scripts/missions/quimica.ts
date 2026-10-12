import { MissionContent } from "../../../src/engine/missions";
import { quizMission } from "./quiz-materia";

// Missões de Química pra Biblioteca de Missões (tomo de Química): 5 missões de
// 10 perguntas comentadas, nos níveis 1, 5, 10, 15 e 20, com o conteúdo de
// Ciências do fundamental e de Química do ensino médio: matéria e estados
// físicos, átomos e Tabela Periódica, substâncias e misturas, reações químicas,
// e ácidos, bases e química orgânica.
// O professor ajusta XP, moedas e itens no painel. Importar com:
//   npm run missions:import -- <e-mail do professor> scripts/missions/quimica.ts
const missions: MissionContent[] = [
    quizMission({
        subject: "quimica",
        level: 1,
        title: "Química: A Matéria e os Estados Físicos",
        icon: "🧊",
        description: "Sólido, líquido e gasoso, e as mudanças de estado da água",
        item: { name: "Cubo de Gelo Eterno", icon: "🧊", description: "Um cubo de gelo que nunca derrete. Usar dá XP de quem conhece as mudanças de estado." },
        questions: [
            ["O que é matéria?", ["Tudo que tem massa e ocupa lugar no espaço", "Só o que dá pra ver", "Só os seres vivos", "Só os líquidos"], 0, "Pedra, água, ar e o seu corpo são matéria. O ar não dá pra ver, mas tem massa e ocupa espaço."],
            ["Quais são os três estados físicos mais comuns da matéria?", ["Sólido, líquido e gasoso", "Quente, morno e frio", "Duro, mole e líquido", "Leve, médio e pesado"], 0, "Gelo (sólido), água (líquido) e vapor (gasoso) são a mesma substância em estados físicos diferentes."],
            ["Como se chama a passagem do estado sólido para o líquido?", ["Fusão", "Solidificação", "Condensação", "Evaporação"], 0, "Fusão é derreter: o gelo vira água líquida a 0 °C. O caminho de volta, de líquido pra sólido, é a solidificação."],
            ["As gotinhas que aparecem do lado de fora de um copo com água gelada vêm de onde?", ["Do vapor de água do ar, que esfria e se condensa", "Da água que vaza pelo vidro", "Do gelo que derrete por fora", "Do suor das mãos"], 0, "O vapor do ar encosta no copo frio, perde calor e vira líquido: isso é a condensação (ou liquefação)."],
            ["A roupa no varal seca porque a água passa por qual mudança de estado?", ["Vaporização (evaporação)", "Fusão", "Solidificação", "Condensação"], 0, "A água da roupa vira vapor aos poucos, mesmo sem ferver: é a evaporação, um tipo de vaporização."],
            ["Em qual estado físico as partículas estão mais afastadas e se movendo mais livremente?", ["Sólido", "Líquido", "Gasoso", "Em todos é igual"], 2, "No gás as partículas ficam bem soltas, por isso ele ocupa todo o recipiente. No sólido ficam bem presas, com forma fixa."],
            ["A naftalina (e o gelo-seco) passa do sólido direto para o gasoso. Como se chama isso?", ["Sublimação", "Fusão", "Ebulição", "Condensação"], 0, "Na sublimação a substância pula o estado líquido. O gelo-seco é gás carbônico sólido e solta aquela \"fumacinha\"."],
            ["Qual destes tem forma própria e volume próprio?", ["Um tijolo (sólido)", "O suco num copo (líquido)", "O ar num balão (gás)", "A fumaça"], 0, "O sólido tem forma e volume fixos; o líquido tem volume fixo mas toma a forma do recipiente; o gás não tem nem um nem outro fixos."],
            ["O que é densidade?", ["A relação entre a massa e o volume de um corpo", "A cor de um material", "A temperatura de um material", "O cheiro de uma substância"], 0, "Densidade = massa ÷ volume. O óleo é menos denso que a água, por isso fica boiando por cima."],
            ["Por que um navio de aço, que é tão pesado, flutua?", ["Porque o formato oco faz o navio deslocar muita água, e o empuxo da água segura o peso dele", "Porque o aço é mais leve que a água", "Porque os motores o mantêm em cima", "Porque a água do mar é sólida"], 0, "Uma bola de aço maciça afunda, mas o casco oco, cheio de ar, tem densidade média menor que a da água e recebe um empuxo que equilibra o peso."],
        ],
    }),
    quizMission({
        subject: "quimica",
        level: 5,
        title: "Química: Átomos e a Tabela Periódica",
        icon: "⚛️",
        description: "Prótons, nêutrons, elétrons e os elementos químicos",
        item: { name: "Tabela Periódica de Bolso", icon: "📋", description: "Os 118 elementos num cartãozinho dobrável. Usar dá XP de quem conhece os tijolinhos da matéria." },
        questions: [
            ["Quais partículas ficam no núcleo do átomo?", ["Prótons e nêutrons", "Elétrons e prótons", "Só elétrons", "Elétrons e nêutrons"], 0, "O núcleo tem prótons (carga positiva) e nêutrons (sem carga). Os elétrons (carga negativa) ficam ao redor, na eletrosfera."],
            ["Qual partícula do átomo tem carga elétrica negativa?", ["O próton", "O nêutron", "O elétron", "O núcleo"], 2, "O elétron é negativo, o próton é positivo e o nêutron é neutro. Num átomo neutro há tantos elétrons quanto prótons."],
            ["O que define qual é o elemento químico?", ["O número de prótons (número atômico)", "O número de nêutrons", "A cor do átomo", "O tamanho do átomo"], 0, "Todo átomo com 6 prótons é carbono, todo átomo com 8 é oxigênio. O número de prótons é o número atômico (Z)."],
            ["Qual é o símbolo químico do oxigênio?", ["Ox", "O", "Og", "Oi"], 1, "O símbolo é O. Os símbolos têm uma ou duas letras, a primeira sempre maiúscula: H (hidrogênio), C (carbono), Ca (cálcio)."],
            ["Qual elemento tem o símbolo Na?", ["Nitrogênio", "Sódio", "Níquel", "Neônio"], 1, "Na vem do latim natrium. Outros símbolos que vêm do latim: Fe (ferro), Au (ouro), Ag (prata), K (potássio) e Pb (chumbo)."],
            ["Qual é o símbolo químico do ouro?", ["Au", "Or", "Ou", "Ag"], 0, "Au vem de aurum, ouro em latim. Ag é a prata (argentum), de onde também vem o nome da Argentina."],
            ["Na Tabela Periódica, as colunas verticais são chamadas de:", ["Famílias ou grupos", "Períodos", "Linhas", "Camadas"], 0, "As 18 colunas são os grupos (famílias), com elementos de propriedades parecidas. As 7 linhas são os períodos."],
            ["Os gases nobres, como hélio e neônio, quase não reagem com outros elementos. Por quê?", ["Porque têm a última camada de elétrons completa e são estáveis", "Porque são muito pesados", "Porque são radioativos", "Porque são líquidos"], 0, "Com a camada de valência completa, os gases nobres não precisam ganhar, perder ou compartilhar elétrons. Por isso o hélio é seguro em balões."],
            ["Qual é o elemento mais leve e mais abundante do universo?", ["Oxigênio", "Hidrogênio", "Carbono", "Ferro"], 1, "O hidrogênio (H) tem número atômico 1: um próton e um elétron. É o primeiro da Tabela e o combustível das estrelas."],
            ["Átomos do mesmo elemento com números de nêutrons diferentes são chamados de:", ["Isótopos", "Íons", "Moléculas", "Misturas"], 0, "O carbono-12 e o carbono-14 são isótopos: os dois têm 6 prótons, mas 6 e 8 nêutrons. O carbono-14 é usado pra datar fósseis."],
        ],
    }),
    quizMission({
        subject: "quimica",
        level: 10,
        title: "Química: Substâncias e Misturas",
        icon: "🧪",
        description: "Substâncias puras, misturas, separação de misturas e ligações químicas",
        item: { name: "Funil de Alquimista", icon: "⚗️", description: "Separa até a areia do mar. Usar dá XP de quem sabe separar uma mistura." },
        questions: [
            ["Qual é a fórmula da água?", ["H2O", "CO2", "O2", "NaCl"], 0, "A molécula de água tem dois átomos de hidrogênio e um de oxigênio: H2O."],
            ["O sal de cozinha é formado principalmente por qual substância?", ["Cloreto de sódio (NaCl)", "Gás carbônico (CO2)", "Glicose", "Bicarbonato"], 0, "O sal de cozinha é o cloreto de sódio, NaCl, formado por íons de sódio (Na+) e cloreto (Cl-)."],
            ["Água com areia é que tipo de mistura?", ["Heterogênea, porque dá pra ver as fases separadas", "Homogênea", "Substância pura", "Composta"], 0, "Na mistura heterogênea dá pra ver mais de uma fase. Água com açúcar dissolvido é homogênea: parece uma coisa só."],
            ["Qual destas é uma substância pura?", ["Água destilada", "Ar", "Água do mar", "Café com leite"], 0, "A água destilada é só H2O. O ar é mistura de gases e a água do mar tem vários sais dissolvidos."],
            ["Qual método separa o pó de café da bebida pronta?", ["Filtração", "Destilação", "Imantação", "Decantação"], 0, "O filtro de papel deixa passar o líquido e segura o sólido que não se dissolveu: isso é filtração."],
            ["Como se pode separar limalha de ferro misturada com areia?", ["Com um ímã (separação magnética)", "Com um filtro", "Fervendo", "Com água"], 0, "O ímã atrai o ferro e deixa a areia para trás. Esse método é chamado de separação magnética (imantação)."],
            ["Nas salinas, o sal é separado da água do mar por:", ["Evaporação da água", "Filtração", "Imantação", "Peneiração"], 0, "A água do mar fica em tanques rasos, o sol evapora a água e o sal fica cristalizado no fundo."],
            ["A ligação iônica acontece quando:", ["Um átomo transfere elétrons para outro, formando íons de cargas opostas que se atraem", "Dois átomos compartilham elétrons", "Os átomos ficam soltos", "Há só gases nobres"], 0, "No NaCl, o sódio perde um elétron (vira Na+) e o cloro ganha (vira Cl-). As cargas opostas se atraem."],
            ["Na molécula de água, o hidrogênio e o oxigênio estão unidos por qual tipo de ligação?", ["Iônica", "Covalente (compartilham elétrons)", "Metálica", "Magnética"], 1, "Na ligação covalente, os átomos compartilham pares de elétrons. É o tipo de ligação típico entre ametais, como H e O."],
            ["Por que o óleo não se mistura com a água?", ["Porque a água é polar e o óleo é apolar", "Porque o óleo é mais pesado", "Porque a água é sólida", "Porque o óleo está quente"], 0, "Semelhante dissolve semelhante: substâncias polares se misturam com polares. O detergente consegue juntar as duas porque tem uma parte de cada tipo."],
        ],
    }),
    quizMission({
        subject: "quimica",
        level: 15,
        title: "Química: Reações Químicas",
        icon: "💥",
        description: "Reagentes, produtos, balanceamento, Lavoisier e combustão",
        item: { name: "Frasco Borbulhante", icon: "🧪", description: "Uma poção que nunca para de fazer bolhinhas. Usar dá XP de quem transforma a matéria." },
        questions: [
            ["Qual destes é um exemplo de transformação química?", ["Um papel queimando", "Gelo derretendo", "Um papel sendo rasgado", "Água fervendo"], 0, "Na queima formam-se substâncias novas (cinzas, gás carbônico, água). Derreter, rasgar e ferver são transformações físicas."],
            ["Quais destes são sinais de que ocorreu uma reação química?", ["Mudança de cor, liberação de gás, formação de sólido ou mudança de temperatura", "Só mudança de tamanho", "Só mudança de lugar", "Mudança de forma, como amassar"], 0, "Bolhas, cheiro novo, cor nova, precipitado e calor ou frio são pistas de que surgiram substâncias novas."],
            ["Numa reação química, as substâncias que reagem são chamadas de:", ["Reagentes", "Produtos", "Catalisadores", "Misturas"], 0, "Reagentes → produtos. Na equação, os reagentes ficam à esquerda da seta e os produtos à direita."],
            ["Lavoisier ficou famoso pela frase \"Na natureza nada se cria, nada se perde, tudo se transforma\". Isso significa que:", ["Num sistema fechado, a massa total dos reagentes é igual à massa total dos produtos", "As reações criam matéria nova", "A massa some nas reações", "Só os gases participam das reações"], 0, "É a Lei da Conservação das Massas: os átomos só se rearranjam, nenhum aparece ou desaparece."],
            ["Para a combustão (queima) acontecer, são necessários:", ["Combustível, comburente (oxigênio) e calor (energia de ativação)", "Só água", "Só gás carbônico", "Combustível e gelo"], 0, "É o triângulo do fogo. O extintor apaga o fogo tirando um dos três: abafando (sem oxigênio) ou esfriando (sem calor)."],
            ["Qual é o coeficiente que falta para balancear: 2 H2 + O2 → __ H2O?", ["1", "2", "3", "4"], 1, "À esquerda há 4 H e 2 O. Com 2 H2O, a direita também fica com 4 H e 2 O: 2 H2 + O2 → 2 H2O."],
            ["A ferrugem que aparece num portão de ferro é resultado de:", ["Uma reação do ferro com o oxigênio e a água (oxidação)", "Uma transformação física", "Sujeira do ar", "Um tipo de tinta"], 0, "O ferro reage com o oxigênio na presença de umidade e forma óxido de ferro. Pintar o portão impede o contato com o ar."],
            ["O que faz um catalisador numa reação?", ["Acelera a reação sem ser consumido", "Para a reação", "Vira produto", "Aumenta a massa dos produtos"], 0, "O catalisador diminui a energia necessária pra reação acontecer. As enzimas do corpo são catalisadores biológicos."],
            ["Por que os alimentos na geladeira estragam mais devagar?", ["Porque a temperatura baixa deixa as reações químicas e os micróbios mais lentos", "Porque a geladeira tira o oxigênio", "Porque o frio mata todos os micróbios", "Porque a luz da geladeira conserva"], 0, "Quanto menor a temperatura, mais lentas as reações. Por isso também a comida cozinha mais rápido na panela de pressão, que é mais quente."],
            ["Uma reação que libera calor para o ambiente, como a queima da madeira, é chamada de:", ["Exotérmica", "Endotérmica", "Física", "Neutra"], 0, "Exotérmica libera calor; endotérmica absorve calor, como a bolsa de gelo instantâneo que esfria quando a reação acontece."],
        ],
    }),
    quizMission({
        subject: "quimica",
        level: 20,
        title: "Química: Ácidos, Bases e Química Orgânica",
        icon: "🍋",
        description: "pH, indicadores, neutralização e os compostos do carbono",
        item: { name: "Fita de pH Mágica", icon: "🍋", description: "Muda de cor ao tocar em qualquer coisa. Usar dá XP de quem mede a acidez do mundo." },
        questions: [
            ["Na escala de pH, uma solução com pH 7 a 25 °C é:", ["Neutra", "Ácida", "Básica", "Explosiva"], 0, "A escala vai de 0 a 14: abaixo de 7 é ácido, 7 é neutro (água pura) e acima de 7 é básico (alcalino)."],
            ["Qual destes é ácido?", ["Suco de limão", "Sabão", "Água sanitária", "Leite de magnésia"], 0, "O limão tem ácido cítrico e pH perto de 2. Sabão, água sanitária e leite de magnésia são básicos."],
            ["Quando um ácido reage com uma base, formam-se sal e água. Como se chama essa reação?", ["Neutralização", "Combustão", "Fusão", "Oxidação"], 0, "Exemplo: HCl + NaOH → NaCl + H2O. O antiácido para azia neutraliza parte do ácido do estômago."],
            ["Qual ácido está presente no suco gástrico do estômago?", ["Ácido clorídrico (HCl)", "Ácido cítrico", "Ácido sulfúrico", "Ácido acético"], 0, "O estômago produz ácido clorídrico, que ajuda na digestão e mata micróbios. O ácido acético é o do vinagre."],
            ["O suco de repolho roxo muda de cor conforme o pH. Ele funciona como um:", ["Indicador ácido-base", "Catalisador", "Combustível", "Isolante"], 0, "Indicadores mudam de cor em meio ácido ou básico. O repolho roxo fica avermelhado em ácido e esverdeado em base."],
            ["Qual elemento é a base da química orgânica?", ["Carbono", "Ferro", "Sódio", "Hélio"], 0, "A química orgânica estuda os compostos de carbono, que pode fazer 4 ligações e formar cadeias longas, base da vida."],
            ["Qual é a fórmula do metano, o hidrocarboneto mais simples?", ["CH4", "H2O", "CO2", "C2H6O"], 0, "O metano tem um carbono ligado a quatro hidrogênios. É o principal componente do gás natural e do biogás."],
            ["O etanol, usado como combustível nos carros brasileiros, é produzido principalmente a partir de:", ["Cana-de-açúcar", "Petróleo", "Carvão", "Areia"], 0, "No Brasil, o etanol vem da fermentação do caldo da cana. Como a cana absorve CO2 ao crescer, ele é um combustível renovável."],
            ["Qual destes é um polímero (uma molécula grande feita de muitas unidades repetidas)?", ["O plástico das garrafas PET", "O sal de cozinha", "O gás oxigênio", "A água"], 0, "Plásticos são polímeros sintéticos. O amido, as proteínas e o próprio DNA são polímeros naturais."],
            ["A chuva ácida é causada principalmente por:", ["Óxidos de enxofre e de nitrogênio lançados por indústrias e veículos, que reagem com a água da chuva", "Excesso de limões nas árvores", "O gás hélio", "A água dos rios"], 0, "Esses gases formam ácidos na atmosfera. A chuva ácida corrói monumentos, prejudica florestas e acidifica rios e lagos."],
        ],
    }),
]

export default missions
