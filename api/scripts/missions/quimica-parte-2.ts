import { MissionContent } from "../../../src/engine/missions";
import { quizMission } from "./quiz-materia";

// Mais 5 missões de Química (tomo de Química), nos níveis 1, 5, 10, 15 e 20:
// química do dia a dia, soluções, mol e estequiometria, eletroquímica e
// radioatividade, e funções orgânicas. Recompensa especial: 500 XP (Nv1, Nv5 e
// Nv10) ou 800 XP (Nv15 e Nv20), sempre com 200 moedas. Não repetem as
// perguntas de quimica.ts.
// Importar com:
//   npm run missions:import -- <e-mail do professor> scripts/missions/quimica-parte-2.ts
const missions: MissionContent[] = [
    quizMission({
        subject: "quimica",
        level: 1,
        xp: 500,
        coins: 200,
        title: "Química: Química no Dia a Dia",
        icon: "🍞",
        description: "Fermento, produtos de limpeza, sal iodado, flúor e fogos de artifício",
        item: { name: "Pão Quentinho", icon: "🍞", description: "Cresceu graças à química do fermento. Usar dá XP de quem vê química em tudo." },
        questions: [
            ["Por que a massa do pão cresce com o fermento biológico?", ["Os fungos do fermento consomem açúcares e liberam gás carbônico, que forma bolhas na massa", "O fermento é feito de ar", "O forno sopra a massa", "A farinha incha com água fria"], 0, "As leveduras (fungos) fazem fermentação. No forno, o gás se expande e o pão fica fofo."],
            ["Por que é perigoso misturar água sanitária com outros produtos de limpeza, como amoníaco ou desinfetantes?", ["Porque podem se formar gases tóxicos", "Porque a mistura perde o cheiro", "Porque fica tudo colorido", "Não há perigo nenhum"], 0, "Nunca misture produtos de limpeza: use um de cada vez e com o ambiente ventilado."],
            ["Por que o sal de cozinha vendido no Brasil é iodado?", ["Para prevenir doenças da tireoide, como o bócio", "Para ficar mais salgado", "Para durar mais tempo", "Para mudar de cor"], 0, "O iodo é essencial para a tireoide produzir seus hormônios."],
            ["Para que serve o flúor na pasta de dente?", ["Para fortalecer o esmalte dos dentes e prevenir cáries", "Para clarear a língua", "Para dar sabor de menta", "Para fazer espuma"], 0, "O flúor também é adicionado à água de muitas cidades brasileiras."],
            ["Por que o cloro é colocado na água tratada que chega às casas?", ["Para matar micróbios que causam doenças", "Para deixar a água azul", "Para tirar o sal", "Para esquentar a água"], 0, "A cloração é uma das etapas mais importantes do tratamento de água."],
            ["Como o sabão consegue tirar a gordura das mãos?", ["Suas moléculas têm uma parte que se liga à gordura e outra que se liga à água, levando a sujeira embora", "Ele derrete a gordura com calor", "Ele transforma gordura em água", "Ele esconde a gordura"], 0, "As moléculas de sabão formam pequenas bolinhas, as micelas, que prendem a gordura."],
            ["O que dá as cores diferentes aos fogos de artifício?", ["Sais de metais diferentes, como estrôncio (vermelho), bário (verde) e cobre (azul)", "Tintas comuns", "Luzes de LED", "O reflexo da Lua"], 0, "Cada metal, quando aquecido, emite luz de uma cor característica."],
            ["Por que a maçã cortada fica marrom depois de um tempo?", ["Porque substâncias da fruta reagem com o oxigênio do ar (oxidação)", "Porque a maçã apodrece em segundos", "Porque a faca solta tinta", "Porque a luz pinta a maçã"], 0, "Pingar limão ajuda a retardar essa reação, por causa da vitamina C."],
            ["Para que servem os conservantes em alimentos industrializados?", ["Para impedir o crescimento de micróbios e fazer o alimento durar mais", "Para deixar mais doce", "Para mudar a cor", "Para aumentar o peso"], 0, "Sal, açúcar e vinagre são conservantes usados há séculos."],
            ["O que é o bicarbonato de sódio, usado em bolos e como antiácido?", ["Uma substância básica que libera gás carbônico ao reagir com ácidos", "Um tipo de açúcar", "Um metal", "Uma vitamina"], 0, "Com vinagre, ele faz aquela espuma que lembra um \"vulcão\" de feira de ciências."],
        ],
    }),
    quizMission({
        subject: "quimica",
        level: 5,
        xp: 500,
        coins: 200,
        title: "Química: Soluções e Concentração",
        icon: "🥤",
        description: "Soluto, solvente, solubilidade, saturação e concentração",
        item: { name: "Béquer Graduado", icon: "🥤", description: "Mede as soluções até o último mililitro. Usar dá XP de quem prepara misturas perfeitas." },
        questions: [
            ["Numa solução de água com açúcar, qual é o soluto?", ["O açúcar", "A água", "O copo", "O ar"], 0, "O soluto é o que se dissolve; o solvente é o que dissolve, e geralmente está em maior quantidade."],
            ["Por que a água é chamada de \"solvente universal\"?", ["Porque dissolve um grande número de substâncias", "Porque existe no universo todo", "Porque dissolve tudo, até o ouro", "Porque não tem cor"], 0, "A água dissolve sais, açúcares e gases, mas não dissolve gorduras, por exemplo."],
            ["O que é uma solução saturada?", ["Uma solução que já tem a quantidade máxima de soluto que consegue dissolver naquela temperatura", "Uma solução sem soluto", "Uma solução gelada", "Uma solução colorida"], 0, "Se colocar mais açúcar num suco saturado, ele vai para o fundo do copo."],
            ["Foram dissolvidos 20 g de sal em 2 litros de água. Qual é a concentração em g/L?", ["10 g/L", "40 g/L", "20 g/L", "2 g/L"], 0, "Concentração = massa ÷ volume = 20 g ÷ 2 L = 10 g/L."],
            ["O que acontece com a concentração de um suco quando acrescentamos mais água?", ["Diminui (o suco fica diluído)", "Aumenta", "Fica igual", "Vira zero"], 0, "Na diluição, a quantidade de soluto é a mesma, mas o volume aumenta."],
            ["Por que é mais fácil dissolver açúcar no chá quente do que no chá gelado?", ["Porque a solubilidade do açúcar aumenta com a temperatura", "Porque o açúcar derrete no fogo", "Porque o chá gelado é salgado", "Não é mais fácil"], 0, "Para a maioria dos sólidos, quanto maior a temperatura, mais soluto se dissolve."],
            ["Por que o refrigerante quente perde o gás mais rápido que o gelado?", ["Porque os gases são menos solúveis em líquidos quentes", "Porque o gás congela no frio", "Porque o calor cria mais gás", "Porque a garrafa encolhe"], 0, "Ao contrário dos sólidos, a solubilidade dos gases diminui com o aumento da temperatura."],
            ["Uma solução é sempre uma mistura de que tipo?", ["Homogênea", "Heterogênea", "De duas fases", "Sólida"], 0, "Na solução, o soluto se espalha por igual e não dá para ver as partes separadas."],
            ["Um soro tem 0,9% de sal. O que isso significa?", ["Há 0,9 g de sal em cada 100 mL (ou 100 g) de soro", "Há 90 g de sal em 1 L", "Há 9 g de sal em 100 mL", "O soro não tem sal"], 0, "Por cento quer dizer \"por cem\": 0,9 parte de sal em 100 partes de solução."],
            ["Qual destes é um exemplo de solução gasosa?", ["O ar atmosférico", "Água com areia", "Óleo e água", "Granito"], 0, "O ar é uma mistura homogênea de gases, principalmente nitrogênio (78%) e oxigênio (21%)."],
        ],
    }),
    quizMission({
        subject: "quimica",
        level: 10,
        xp: 500,
        coins: 200,
        title: "Química: Mol e Estequiometria",
        icon: "⚖️",
        description: "O mol, a massa molar e os cálculos das reações químicas",
        item: { name: "Balança Analítica", icon: "⚖️", description: "Pesa até um grão de sal. Usar dá XP de quem domina os cálculos químicos." },
        questions: [
            ["Quantas partículas existem em 1 mol de qualquer substância?", ["Cerca de 6,02 × 10²³ (o número de Avogadro)", "100", "1 milhão", "12"], 0, "O mol é como uma \"dúzia\" gigante, usada para contar átomos e moléculas."],
            ["Qual é a massa molar da água (H₂O), sabendo que H = 1 g/mol e O = 16 g/mol?", ["18 g/mol", "17 g/mol", "16 g/mol", "34 g/mol"], 0, "2 × 1 + 16 = 18 g/mol."],
            ["Qual é a massa molar do gás carbônico (CO₂), sabendo que C = 12 e O = 16?", ["44 g/mol", "28 g/mol", "32 g/mol", "40 g/mol"], 0, "12 + 2 × 16 = 44 g/mol."],
            ["Quantos gramas há em 2 mols de água?", ["36 g", "18 g", "9 g", "20 g"], 0, "Cada mol de água tem 18 g: 2 × 18 = 36 g."],
            ["Na reação 2 H₂ + O₂ → 2 H₂O, quantos mols de O₂ reagem com 4 mols de H₂?", ["2 mols", "4 mols", "1 mol", "8 mols"], 0, "A proporção é 2 de H₂ para 1 de O₂. Com 4 mols de H₂, são 2 mols de O₂."],
            ["Na mesma reação (2 H₂ + O₂ → 2 H₂O), quantos mols de água se formam a partir de 4 mols de H₂?", ["4 mols", "2 mols", "8 mols", "1 mol"], 0, "A proporção H₂ : H₂O é 2 : 2, ou seja, 1 : 1."],
            ["O que é o reagente limitante?", ["O reagente que acaba primeiro e limita a quantidade de produto formado", "O reagente que sobra", "O produto da reação", "O catalisador"], 0, "O reagente que sobra é chamado de reagente em excesso."],
            ["Qual é a massa molar do cloreto de sódio (NaCl), sabendo que Na = 23 e Cl = 35,5?", ["58,5 g/mol", "35,5 g/mol", "23 g/mol", "12 g/mol"], 0, "23 + 35,5 = 58,5 g/mol."],
            ["Nas condições normais de temperatura e pressão (CNTP), qual é o volume ocupado por 1 mol de qualquer gás ideal?", ["Cerca de 22,4 L", "1 L", "100 L", "6,02 L"], 0, "Esse é o volume molar dos gases nas CNTP (0 °C e 1 atm)."],
            ["O que estuda a estequiometria?", ["As quantidades de reagentes e produtos nas reações químicas", "A cor das substâncias", "A história da química", "O cheiro dos gases"], 0, "É ela que permite calcular quanto de cada ingrediente uma indústria precisa usar."],
        ],
    }),
    quizMission({
        subject: "quimica",
        level: 15,
        xp: 800,
        coins: 200,
        title: "Química: Eletroquímica e Radioatividade",
        icon: "🔋",
        description: "Pilhas, oxidação e redução, eletrólise e radiações",
        item: { name: "Pilha Eterna", icon: "🔋", description: "Nunca descarrega, mas não jogue no lixo comum! Usar dá XP de quem entende a eletroquímica." },
        questions: [
            ["O que uma pilha faz?", ["Transforma energia química em energia elétrica", "Transforma luz em som", "Cria matéria", "Esfria o ambiente"], 0, "Dentro da pilha acontece uma reação de oxirredução que faz os elétrons andarem pelo circuito."],
            ["Numa reação de oxirredução, o que acontece na oxidação?", ["A espécie perde elétrons", "A espécie ganha elétrons", "A espécie perde prótons", "Nada acontece"], 0, "Um macete: \"OPA\" — Oxidação: Perde elétrons. Na redução, a espécie ganha elétrons."],
            ["Em que eletrodo de uma pilha ocorre a oxidação?", ["No ânodo", "No cátodo", "Na ponte salina", "No fio"], 0, "No cátodo ocorre a redução. Os elétrons saem do ânodo e vão para o cátodo."],
            ["O que é a eletrólise?", ["Uma reação química provocada pela passagem de corrente elétrica", "Uma pilha que gera eletricidade sozinha", "Um tipo de imã", "A queima de um metal"], 0, "A eletrólise é usada para obter alumínio, cloro e para revestir objetos com metal."],
            ["Por que o ferro é revestido com zinco (galvanização)?", ["Porque o zinco se oxida no lugar do ferro, protegendo-o da ferrugem", "Para deixar o ferro mais pesado", "Para o ferro conduzir menos eletricidade", "Por decoração"], 0, "O zinco funciona como \"metal de sacrifício\"."],
            ["Por que pilhas e baterias não devem ser jogadas no lixo comum?", ["Porque têm metais pesados que contaminam o solo e a água", "Porque podem voltar a funcionar", "Porque são muito leves", "Porque atraem insetos"], 0, "Elas devem ir para pontos de coleta, que fazem a logística reversa."],
            ["Qual tipo de radiação nuclear é a mais penetrante, atravessando até paredes finas de concreto?", ["Gama", "Alfa", "Beta", "Infravermelha"], 0, "A alfa é barrada por uma folha de papel; a beta, por uma placa fina de alumínio; a gama precisa de chumbo ou concreto grosso."],
            ["Qual acidente radioativo aconteceu em Goiânia, em 1987?", ["A contaminação por césio-137 de um aparelho de radioterapia abandonado", "A explosão de uma usina nuclear", "Um vazamento de petróleo", "Uma bomba atômica"], 0, "É considerado o maior acidente radiológico do mundo fora de usinas nucleares."],
            ["Qual acidente, em 1986, na atual Ucrânia, é o mais grave da história das usinas nucleares?", ["Chernobyl", "Fukushima", "Three Mile Island", "Angra"], 0, "Fukushima, no Japão, em 2011, foi causado por um terremoto seguido de tsunami."],
            ["Para que serve a radioatividade na medicina?", ["Para exames de imagem e para tratar alguns tipos de câncer (radioterapia)", "Para curar gripes", "Para fazer gesso", "Não tem uso na medicina"], 0, "Doses controladas de radiação podem destruir células doentes."],
        ],
    }),
    quizMission({
        subject: "quimica",
        level: 20,
        xp: 800,
        coins: 200,
        title: "Química: Funções Orgânicas e Isomeria",
        icon: "🧬",
        description: "Hidrocarbonetos, álcoois, ácidos, ésteres, isômeros e o petróleo",
        item: { name: "Modelo Molecular", icon: "🔮", description: "Bolinhas e varetas que montam qualquer molécula. Usar dá XP de quem domina a química orgânica." },
        questions: [
            ["O que são hidrocarbonetos?", ["Compostos formados apenas por carbono e hidrogênio", "Compostos com oxigênio e nitrogênio", "Sais minerais", "Metais"], 0, "Metano, propano e octano (da gasolina) são hidrocarbonetos."],
            ["Qual grupo funcional caracteriza os álcoois?", ["A hidroxila (–OH) ligada a um carbono saturado", "A carboxila (–COOH)", "A carbonila no meio da cadeia", "O grupo amino (–NH₂)"], 0, "O etanol (CH₃CH₂OH) é o álcool mais conhecido."],
            ["O vinagre contém ácido acético. Qual grupo funcional ele possui?", ["Carboxila (–COOH)", "Hidroxila apenas", "Amina", "Éter"], 0, "Os ácidos carboxílicos têm o grupo –COOH e sabor azedo."],
            ["Qual função orgânica é responsável por muitos aromas de frutas e perfumes?", ["Ésteres", "Hidrocarbonetos", "Aminas", "Haletos"], 0, "O aroma artificial de banana, por exemplo, vem de um éster."],
            ["A acetona, usada para tirar esmalte, pertence a qual função orgânica?", ["Cetona", "Álcool", "Ácido carboxílico", "Éster"], 0, "Nas cetonas, o grupo carbonila (C=O) fica entre dois carbonos."],
            ["O que são isômeros?", ["Compostos com a mesma fórmula molecular, mas estruturas diferentes", "Átomos do mesmo elemento", "Moléculas com o mesmo cheiro", "Misturas de água e óleo"], 0, "O etanol e o éter dimetílico têm a mesma fórmula, C₂H₆O, mas propriedades bem diferentes."],
            ["Quantos átomos de carbono tem o propano, pelo prefixo do nome?", ["3", "1", "2", "4"], 0, "Prefixos: met (1), et (2), prop (3), but (4), pent (5)."],
            ["Como o petróleo é separado em gasolina, diesel, querosene e gás de cozinha nas refinarias?", ["Por destilação fracionada, pelas diferentes temperaturas de ebulição", "Por filtração", "Por imantação", "Por peneiração"], 0, "As frações mais leves, como o gás, saem no alto da torre; as pesadas, embaixo."],
            ["O benzeno é o exemplo clássico de qual tipo de composto?", ["Aromático, com anel de 6 carbonos", "Inorgânico", "Metálico", "Iônico"], 0, "O anel benzênico tem ligações duplas alternadas e é muito estável."],
            ["O gás de cozinha (GLP) é formado principalmente por quais hidrocarbonetos?", ["Propano e butano", "Metano e etano", "Octano e decano", "Benzeno e tolueno"], 0, "GLP quer dizer gás liquefeito de petróleo; sob pressão no botijão, ele fica líquido."],
        ],
    }),
]

export default missions
