import { MissionContent } from "../../../src/engine/missions";
import { quizMission } from "./quiz-materia";

// Missões de Economia pra Biblioteca de Missões (tomo de Economia): 5 missões
// de 10 perguntas comentadas, nos níveis 1, 5, 10, 15 e 20: educação
// financeira, oferta e demanda, juros e inflação, macroeconomia e as grandes
// ideias e crises da história econômica.
// Importar com:
//   npm run missions:import -- <e-mail do professor> scripts/missions/economia.ts
const missions: MissionContent[] = [
    quizMission({
        subject: "economia",
        level: 1,
        title: "Economia: Dinheiro e Consumo Consciente",
        icon: "🐷",
        description: "Necessidades e desejos, orçamento, poupança e consumo consciente",
        item: { name: "Cofrinho Mágico", icon: "🐷", description: "Um porquinho que adora guardar moedas. Usar dá XP de quem sabe poupar." },
        questions: [
            ["Qual é a diferença entre necessidade e desejo?", ["Necessidade é o que precisamos para viver bem; desejo é o que gostaríamos de ter", "São a mesma coisa", "Desejo é sempre mais importante", "Necessidade é só comida"], 0, "Comida e moradia são necessidades; o tênis da moda é um desejo. Saber diferenciar ajuda a gastar melhor."],
            ["O que é um orçamento?", ["O planejamento de quanto se ganha e de quanto se gasta", "Um tipo de banco", "Uma nota de dinheiro", "Um imposto"], 0, "Anotar o que entra e o que sai ajuda a não gastar mais do que se tem."],
            ["O que é poupar?", ["Guardar parte do dinheiro para usar no futuro", "Gastar tudo de uma vez", "Pedir dinheiro emprestado", "Jogar dinheiro fora"], 0, "Poupar permite realizar objetivos e ter uma reserva para imprevistos."],
            ["Qual é a moeda oficial do Brasil?", ["Real", "Cruzeiro", "Dólar", "Peso"], 0, "O real existe desde 1994. Antes dele, o Brasil teve várias moedas, como o cruzeiro e o cruzado."],
            ["O que é consumo consciente?", ["Comprar pensando se precisa, no preço, na qualidade e no impacto no meio ambiente", "Comprar tudo que aparece em promoção", "Nunca comprar nada", "Comprar só coisas caras"], 0, "Antes de comprar, vale perguntar: eu preciso mesmo? Vai durar? Dá para reutilizar algo que já tenho?"],
            ["O que é uma compra por impulso?", ["Uma compra feita sem planejar, pela emoção do momento", "Uma compra planejada com antecedência", "Uma compra de comida", "Uma compra pela internet"], 0, "Esperar um dia antes de comprar algo não planejado ajuda a evitar arrependimentos."],
            ["O que é uma reserva de emergência?", ["Um dinheiro guardado para imprevistos, como uma doença ou a perda do emprego", "Um cartão de crédito", "Um empréstimo", "Uma conta de luz"], 0, "Ter uma reserva evita precisar de empréstimos caros nos momentos difíceis."],
            ["Qual órgão do governo do Brasil emite (fabrica) as notas e moedas de real, por meio da Casa da Moeda?", ["O Banco Central", "A Receita Federal", "O IBGE", "O Supremo Tribunal Federal"], 0, "O Banco Central controla a quantidade de dinheiro, e a Casa da Moeda produz as cédulas e moedas."],
            ["O que é o Pix?", ["Um sistema de pagamentos instantâneos criado pelo Banco Central", "Uma moeda estrangeira", "Um tipo de cartão de crédito", "Um imposto"], 0, "Lançado em 2020, o Pix permite enviar dinheiro em segundos, a qualquer hora."],
            ["Se você ganha R$ 50 de mesada e guarda R$ 10 por mês, quanto terá guardado em 6 meses?", ["R$ 60", "R$ 50", "R$ 300", "R$ 16"], 0, "R$ 10 × 6 meses = R$ 60. Pequenas quantias guardadas com frequência viram uma boa reserva."],
        ],
    }),
    quizMission({
        subject: "economia",
        level: 5,
        title: "Economia: Oferta, Demanda e Mercado",
        icon: "🛒",
        description: "Como os preços se formam, concorrência e os setores da economia",
        item: { name: "Balança do Mercador", icon: "⚖️", description: "Pesa as mercadorias e acerta o preço justo. Usar dá XP de quem entende o mercado." },
        questions: [
            ["O que acontece com o preço de um produto quando muita gente quer comprar e há pouca quantidade?", ["Tende a subir", "Tende a cair", "Fica sempre igual", "Vira de graça"], 0, "Pela lei da oferta e da procura, a procura alta e a oferta baixa empurram os preços para cima."],
            ["Na safra, quando há muitas frutas à venda, o que costuma acontecer com o preço?", ["Tende a cair", "Tende a subir muito", "A fruta some do mercado", "O preço é proibido"], 0, "Com a oferta grande, os vendedores baixam os preços para conseguir vender."],
            ["O que é concorrência?", ["A disputa entre empresas que vendem produtos parecidos para conquistar clientes", "Uma corrida de carros", "Um acordo entre empresas para subir preços", "Um imposto sobre vendas"], 0, "A concorrência costuma baixar os preços e melhorar a qualidade."],
            ["O que é um monopólio?", ["Quando uma só empresa domina a venda de um produto ou serviço", "Um jogo de tabuleiro sem regras", "Quando há muitas empresas concorrendo", "Uma loja de esquina"], 0, "Sem concorrência, a empresa pode cobrar caro. Por isso existem leis contra abusos."],
            ["A agricultura e a pecuária fazem parte de qual setor da economia?", ["Setor primário", "Setor secundário", "Setor terciário", "Setor digital"], 0, "Primário: extrair e produzir na natureza; secundário: indústria; terciário: comércio e serviços."],
            ["Uma fábrica de carros faz parte de qual setor da economia?", ["Setor secundário (indústria)", "Setor primário", "Setor terciário", "Nenhum setor"], 0, "A indústria transforma matérias-primas em produtos."],
            ["Lojas, escolas, hospitais e bancos fazem parte de qual setor?", ["Setor terciário (comércio e serviços)", "Setor primário", "Setor secundário", "Setor mineral"], 0, "Hoje o setor terciário é o que mais emprega pessoas no Brasil."],
            ["O que é o lucro de uma empresa?", ["O que sobra das receitas depois de pagar todos os custos", "O total que a empresa vende", "O salário dos funcionários", "O dinheiro emprestado do banco"], 0, "Se uma loja vende R$ 1.000 e gasta R$ 700, o lucro é R$ 300."],
            ["O que é o Procon?", ["Um órgão que protege os direitos do consumidor", "Uma empresa de cartões", "Um banco", "Uma loja de departamentos"], 0, "O Código de Defesa do Consumidor, de 1990, garante direitos como a troca de produtos com defeito."],
            ["O que é exportação?", ["Vender produtos para outros países", "Comprar produtos de outros países", "Fabricar produtos em casa", "Pagar impostos"], 0, "Comprar produtos de fora é importação. O Brasil exporta muita soja, minério de ferro, petróleo e carne."],
        ],
    }),
    quizMission({
        subject: "economia",
        level: 10,
        title: "Economia: Juros, Inflação e Crédito",
        icon: "📈",
        description: "Como funcionam os juros, a inflação, os empréstimos e os investimentos",
        item: { name: "Gráfico de Ouro", icon: "📈", description: "Uma linha dourada que só sobe. Usar dá XP de quem faz o dinheiro render." },
        questions: [
            ["O que é inflação?", ["O aumento geral e contínuo dos preços, que faz o dinheiro comprar menos", "A queda de todos os preços", "Um tipo de empréstimo", "O aumento dos salários"], 0, "Com inflação alta, o mesmo dinheiro compra cada vez menos coisas."],
            ["Qual índice é usado oficialmente para medir a inflação no Brasil?", ["IPCA", "PIB", "IDH", "Gini"], 0, "O IPCA é calculado pelo IBGE e é a referência para a meta de inflação do Banco Central."],
            ["O que são juros?", ["O valor pago pelo uso de um dinheiro emprestado (ou recebido ao emprestar ou investir)", "Um tipo de imposto", "O preço de uma mercadoria", "Um desconto na loja"], 0, "Quem pega emprestado paga juros; quem investe recebe juros."],
            ["Com juros simples de 10% ao mês sobre R$ 100, quanto de juros você paga em 3 meses?", ["R$ 30", "R$ 10", "R$ 33,10", "R$ 300"], 0, "Nos juros simples, o juro é sempre sobre o valor inicial: R$ 10 por mês × 3 = R$ 30."],
            ["Qual é a diferença dos juros compostos?", ["O juro de cada período é calculado sobre o valor já com os juros anteriores (\"juros sobre juros\")", "Os juros são sempre zero", "Os juros diminuem a cada mês", "Os juros são pagos só no começo"], 0, "R$ 100 a 10% ao mês compostos viram R$ 110, depois R$ 121, depois R$ 133,10."],
            ["Por que é perigoso pagar só o valor mínimo da fatura do cartão de crédito?", ["Porque o resto da dívida recebe juros muito altos, que crescem rápido", "Porque o cartão é cancelado na hora", "Porque o banco devolve o dinheiro", "Não tem perigo nenhum"], 0, "Os juros do rotativo do cartão estão entre os mais caros do mercado."],
            ["O que é a taxa Selic?", ["A taxa básica de juros da economia, definida pelo Banco Central", "O preço da gasolina", "O salário mínimo", "Um imposto sobre compras"], 0, "Quando a inflação sobe, o Banco Central costuma aumentar a Selic para frear o consumo."],
            ["O que significa diversificar os investimentos?", ["Dividir o dinheiro em aplicações diferentes para diminuir os riscos", "Colocar todo o dinheiro num só lugar", "Gastar tudo em compras", "Esconder o dinheiro embaixo do colchão"], 0, "É o famoso \"não colocar todos os ovos na mesma cesta\"."],
            ["O que é uma ação de uma empresa, negociada na Bolsa de Valores?", ["Uma pequena parte do capital da empresa, que faz de quem compra um sócio", "Um empréstimo do governo", "Um bilhete de loteria", "Uma conta de luz"], 0, "No Brasil, as ações são negociadas na B3, em São Paulo. O valor delas sobe e desce."],
            ["O que é hiperinflação?", ["Uma inflação altíssima e descontrolada, em que os preços sobem muito todo mês", "Uma inflação de 1% ao ano", "A falta de preços", "A queda dos juros"], 0, "No fim dos anos 80, o Brasil teve inflação de mais de 80% num único mês."],
        ],
    }),
    quizMission({
        subject: "economia",
        level: 15,
        title: "Economia: A Economia de um País",
        icon: "🏦",
        description: "PIB, desemprego, impostos, balança comercial e o papel do governo",
        item: { name: "Cofre do Tesouro", icon: "🏦", description: "O cofre de onde saem as contas do país. Usar dá XP de quem entende a macroeconomia." },
        questions: [
            ["O que mede o PIB (Produto Interno Bruto)?", ["O valor de todos os bens e serviços finais produzidos num país em um período", "O número de habitantes", "A quantidade de dinheiro impresso", "A dívida das pessoas"], 0, "O PIB mostra o tamanho da economia; quando cresce, a economia está se expandindo."],
            ["O que é o PIB per capita?", ["O PIB dividido pelo número de habitantes", "O PIB de uma cidade", "O PIB vezes a população", "O salário mínimo"], 0, "Ele dá uma ideia média da riqueza por pessoa, mas não mostra a desigualdade."],
            ["O que é recessão?", ["Um período em que a economia encolhe, com queda da produção e do emprego", "Um feriado nacional", "Um aumento forte do PIB", "Um tipo de imposto"], 0, "Costuma-se falar em recessão técnica quando o PIB cai por dois trimestres seguidos."],
            ["O que é a balança comercial?", ["A diferença entre o que um país exporta e o que importa", "A balança do supermercado", "O orçamento de uma família", "A dívida do governo"], 0, "Se exporta mais do que importa, tem superávit; se importa mais, déficit."],
            ["Para que servem os impostos?", ["Para financiar serviços públicos como saúde, educação, segurança e obras", "Para enriquecer os bancos", "Para pagar as dívidas das empresas", "Não servem para nada"], 0, "Exemplos: IPTU (imóveis), IPVA (veículos) e Imposto de Renda."],
            ["O que é o desemprego?", ["A situação de pessoas que querem e podem trabalhar, mas não encontram emprego", "Quem está de férias", "Quem estuda", "Quem é aposentado"], 0, "O IBGE mede a taxa de desemprego na pesquisa PNAD Contínua."],
            ["O que é o IDH (Índice de Desenvolvimento Humano)?", ["Um índice que considera renda, educação e expectativa de vida", "Só a riqueza de um país", "O número de prédios", "A quantidade de carros"], 0, "Criado pela ONU, o IDH vai de 0 a 1: quanto mais perto de 1, maior o desenvolvimento humano."],
            ["O que é dívida pública?", ["O que o governo deve a quem emprestou dinheiro a ele, como quem compra títulos do Tesouro", "As dívidas das famílias", "O que as empresas devem aos bancos", "As multas de trânsito"], 0, "O governo pega dinheiro emprestado vendendo títulos, como os do Tesouro Direto."],
            ["O que é câmbio?", ["A troca de uma moeda por outra, como o real pelo dólar", "Uma marcha de carro", "Um tipo de imposto", "Um banco estrangeiro"], 0, "Quando o dólar sobe, produtos importados e viagens ao exterior ficam mais caros."],
            ["O que é um imposto progressivo?", ["Um imposto em que quem ganha mais paga uma porcentagem maior", "Um imposto igual para todos", "Um imposto só para pobres", "Um imposto que diminui com o tempo"], 0, "O Imposto de Renda é progressivo: as faixas de renda mais altas pagam alíquotas maiores."],
        ],
    }),
    quizMission({
        subject: "economia",
        level: 20,
        title: "Economia: Grandes Ideias e Crises",
        icon: "📜",
        description: "Adam Smith, Keynes, os sistemas econômicos e as grandes crises",
        item: { name: "Moeda Antiga de Ouro", icon: "💰", description: "Uma moeda que já passou por muitas crises. Usar dá XP de quem conhece a história da economia." },
        questions: [
            ["Qual economista escreveu \"A Riqueza das Nações\" (1776) e falou da \"mão invisível\" do mercado?", ["Adam Smith", "Karl Marx", "John Maynard Keynes", "David Ricardo"], 0, "Para Smith, quando cada um busca o próprio interesse, o mercado tende a se organizar sozinho."],
            ["O que defende o liberalismo econômico?", ["A livre iniciativa e a pouca interferência do Estado na economia", "Que o Estado seja dono de todas as empresas", "O fim do comércio", "A volta do feudalismo"], 0, "O liberalismo nasceu com autores como Adam Smith, no século XVIII."],
            ["Qual crise econômica começou com a quebra da Bolsa de Nova York em 1929?", ["A Grande Depressão", "A crise do petróleo", "A crise de 2008", "A bolha da internet"], 0, "A crise espalhou desemprego pelo mundo; no Brasil, derrubou o preço do café."],
            ["Qual economista defendeu que o governo deveria gastar e investir para combater o desemprego nas crises?", ["John Maynard Keynes", "Adam Smith", "Milton Friedman", "Thomas Malthus"], 0, "As ideias de Keynes inspiraram o New Deal, nos Estados Unidos, e o Estado de bem-estar social."],
            ["O que foi o New Deal?", ["O conjunto de medidas do presidente americano Franklin Roosevelt para sair da crise de 1929, com obras públicas e direitos sociais", "Um acordo de paz", "Uma nova moeda", "Um jogo de cartas"], 0, "O governo americano contratou milhões de pessoas em obras públicas."],
            ["Numa economia planificada, como a da antiga União Soviética, quem decide o que produzir?", ["O Estado, por meio de planos centralizados", "As empresas privadas", "Cada pessoa sozinha", "Os bancos estrangeiros"], 0, "No capitalismo, essas decisões são tomadas principalmente pelo mercado."],
            ["Qual crise de 2008 começou no mercado de imóveis dos Estados Unidos?", ["A crise do subprime", "A Grande Depressão", "A crise do café", "A crise do petróleo de 1973"], 0, "Empréstimos para quem não podia pagar viraram calote em massa e quebraram bancos, como o Lehman Brothers."],
            ["O que foi a crise do petróleo de 1973?", ["A disparada do preço do petróleo depois que países produtores reduziram a oferta", "A descoberta do pré-sal", "O fim do petróleo no mundo", "Uma guerra entre bancos"], 0, "Os países da OPEP cortaram a produção, e o preço do barril quadruplicou."],
            ["O que é desenvolvimento sustentável na economia?", ["Crescer atendendo às necessidades de hoje sem comprometer as gerações futuras", "Crescer a qualquer custo", "Parar de produzir", "Usar só petróleo"], 0, "A ideia ficou conhecida no Relatório Brundtland, de 1987."],
            ["O que é economia criativa?", ["Atividades que geram valor a partir da criatividade, como games, música, design e cinema", "A economia de quem não trabalha", "Um tipo de imposto", "A economia das fábricas de aço"], 0, "Criadores de jogos, artistas e designers fazem parte de um setor que cresce no mundo todo."],
        ],
    }),
]

export default missions
