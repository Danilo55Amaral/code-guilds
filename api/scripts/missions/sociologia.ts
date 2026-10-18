import { MissionContent } from "../../../src/engine/missions";
import { quizMission } from "./quiz-materia";

// Missões de Sociologia pra Biblioteca de Missões (tomo de Sociologia): 5
// missões de 10 perguntas comentadas, nos níveis 1, 5, 10, 15 e 20, com o
// conteúdo de Sociologia do ensino médio: sociedade e socialização, os
// clássicos (Durkheim, Weber e Marx), cultura e identidade, trabalho e
// desigualdade, e cidadania, Estado e democracia.
// Importar com:
//   npm run missions:import -- <e-mail do professor> scripts/missions/sociologia.ts
const missions: MissionContent[] = [
    quizMission({
        subject: "sociologia",
        level: 1,
        title: "Sociologia: Viver em Sociedade",
        icon: "👥",
        description: "Sociedade, grupos sociais, socialização e normas",
        item: { name: "Roda de Amigos", icon: "🤝", description: "Um bracelete da amizade trançado pela turma toda. Usar dá XP de quem sabe viver em grupo." },
        questions: [
            ["O que a Sociologia estuda?", ["A sociedade: as relações entre as pessoas, os grupos e as instituições", "Apenas os animais", "Os planetas", "Só a história dos reis"], 0, "A Sociologia surgiu no século XIX para entender as grandes mudanças trazidas pela industrialização."],
            ["Quem é considerado o criador da palavra \"Sociologia\"?", ["Auguste Comte", "Karl Marx", "Platão", "Charles Darwin"], 0, "Comte, filósofo francês do século XIX, também criou o positivismo, que inspirou o lema \"Ordem e Progresso\"."],
            ["O que é socialização?", ["O processo pelo qual aprendemos os valores, os costumes e as regras da sociedade", "Usar redes sociais", "Mudar de cidade", "Ganhar dinheiro"], 0, "A socialização começa na família e continua na escola, entre amigos, no trabalho e pela mídia."],
            ["Qual costuma ser o primeiro grupo social de uma pessoa?", ["A família", "O trabalho", "O partido político", "O time de futebol"], 0, "A família é responsável pela socialização primária."],
            ["O que são instituições sociais?", ["Estruturas organizadas e duradouras, como a família, a escola, a religião e o Estado", "Apenas prédios do governo", "Grupos de amigos de uma festa", "Lojas e mercados"], 0, "As instituições orientam o comportamento das pessoas e se mantêm ao longo das gerações."],
            ["O que são normas sociais?", ["Regras de comportamento esperadas pela sociedade, escritas ou não", "Somente as leis do trânsito", "Os gostos de cada pessoa", "As notas da escola"], 0, "Respeitar a fila e cumprimentar as pessoas são normas não escritas; as leis são normas escritas."],
            ["O que é um status social?", ["A posição que uma pessoa ocupa num grupo ou na sociedade", "Uma postagem numa rede social", "O humor de alguém", "O tamanho de uma família"], 0, "Uma pessoa pode ser, ao mesmo tempo, filha, aluna, irmã e capitã do time."],
            ["O que é um papel social?", ["O comportamento esperado de quem ocupa uma posição, como o de professor ou aluno", "Um personagem de novela", "Um documento oficial", "Um tipo de jornal"], 0, "Cada status traz expectativas: do professor se espera que ensine, do aluno, que estude."],
            ["Qual destes é um exemplo de grupo secundário, com relações mais formais?", ["Uma empresa", "A família", "Os melhores amigos", "Os vizinhos de infância"], 0, "Nos grupos primários as relações são próximas e afetivas; nos secundários, mais formais e objetivas."],
            ["O que é preconceito?", ["Um julgamento negativo sobre alguém antes de conhecê-lo, baseado em estereótipos", "Uma opinião bem informada", "Uma regra da escola", "Um tipo de amizade"], 0, "Quando o preconceito vira ação que prejudica alguém, chama-se discriminação."],
        ],
    }),
    quizMission({
        subject: "sociologia",
        level: 5,
        title: "Sociologia: Os Clássicos",
        icon: "📚",
        description: "Durkheim, Weber e Marx: as ideias que fundaram a Sociologia",
        item: { name: "Estante dos Clássicos", icon: "📚", description: "Os três grandes autores lado a lado. Usar dá XP de quem leu os clássicos." },
        questions: [
            ["Qual sociólogo francês criou o conceito de \"fato social\"?", ["Émile Durkheim", "Max Weber", "Karl Marx", "Auguste Comte"], 0, "Fatos sociais são maneiras de agir e pensar exteriores ao indivíduo, gerais e coercitivas, como a língua e as leis."],
            ["Para Durkheim, o que é a \"solidariedade orgânica\", típica das sociedades modernas?", ["A união que nasce da divisão do trabalho, em que todos dependem uns dos outros", "A união por semelhança, como numa tribo", "A falta de regras", "A amizade entre vizinhos"], 0, "Na solidariedade mecânica, das sociedades simples, as pessoas se unem por serem parecidas."],
            ["Como Durkheim chamava a situação em que as regras sociais perdem a força e as pessoas ficam sem referência?", ["Anomia", "Alienação", "Mais-valia", "Burocracia"], 0, "Durkheim estudou a anomia no livro \"O Suicídio\", de 1897."],
            ["Qual sociólogo alemão estudou a \"ação social\" e escreveu \"A Ética Protestante e o Espírito do Capitalismo\"?", ["Max Weber", "Émile Durkheim", "Karl Marx", "Pierre Bourdieu"], 0, "Weber mostrou como valores religiosos influenciaram o desenvolvimento do capitalismo."],
            ["Quais são os três tipos de dominação legítima segundo Weber?", ["Tradicional, carismática e racional-legal", "Rica, média e pobre", "Militar, religiosa e esportiva", "Antiga, medieval e moderna"], 0, "Um rei (tradicional), um líder admirado (carismática) e um governo baseado em leis (racional-legal)."],
            ["O que é burocracia para Weber?", ["Uma forma de organização baseada em regras, hierarquia e funções definidas", "Uma bagunça de papéis", "Um tipo de religião", "Um partido político"], 0, "Para Weber, a burocracia é eficiente, mas pode virar uma \"jaula de ferro\" que prende as pessoas."],
            ["Para Marx, quais são as duas classes principais do capitalismo?", ["Burguesia e proletariado", "Nobreza e clero", "Patrícios e plebeus", "Senhores e vassalos"], 0, "A burguesia é dona dos meios de produção; o proletariado vende sua força de trabalho."],
            ["O que Marx chamava de alienação do trabalho?", ["Quando o trabalhador não se reconhece no que produz e perde o controle sobre o próprio trabalho", "Quando alguém viaja para o exterior", "Quando o trabalhador fica rico", "Quando a fábrica fecha"], 0, "Na linha de montagem, por exemplo, o operário faz uma só parte e não se vê no produto final."],
            ["Para Marx, o que move a história?", ["A luta de classes", "A vontade dos reis", "O clima", "As religiões"], 0, "\"A história de todas as sociedades até hoje é a história da luta de classes\", diz o Manifesto Comunista."],
            ["Os três autores clássicos se preocupavam principalmente em entender qual mudança histórica?", ["A formação da sociedade industrial e capitalista moderna", "A queda do Império Romano", "A descoberta da América", "A chegada do ser humano à Lua"], 0, "A Revolução Industrial transformou o trabalho, as cidades e as relações sociais."],
        ],
    }),
    quizMission({
        subject: "sociologia",
        level: 10,
        title: "Sociologia: Cultura e Identidade",
        icon: "🎭",
        description: "Cultura, etnocentrismo, relativismo cultural e diversidade",
        item: { name: "Máscaras do Mundo", icon: "🎭", description: "Máscaras de festas de vários povos. Usar dá XP de quem respeita a diversidade." },
        questions: [
            ["Para a Sociologia e a Antropologia, o que é cultura?", ["Tudo o que os seres humanos criam e aprendem em sociedade: costumes, crenças, saberes, arte e técnicas", "Só a arte dos museus", "Apenas quem estudou muito", "A comida de um país"], 0, "Nesse sentido amplo, todos os povos têm cultura; não existe povo \"sem cultura\"."],
            ["O que é etnocentrismo?", ["Julgar outras culturas tomando a própria como a melhor ou a correta", "Respeitar todas as culturas", "Estudar os povos antigos", "Viajar pelo mundo"], 0, "O etnocentrismo pode levar ao preconceito e à intolerância."],
            ["O que é relativismo cultural?", ["Entender cada cultura a partir dos seus próprios valores, sem tomar a nossa como medida", "Achar que nenhuma cultura vale nada", "Copiar outra cultura", "Proibir festas tradicionais"], 0, "O relativismo ajuda a combater o etnocentrismo, embora haja debates sobre seus limites, como os direitos humanos."],
            ["O que é aculturação?", ["As mudanças que acontecem quando culturas diferentes entram em contato", "A perda da memória", "Uma doença", "O fim de um país"], 0, "Os contatos podem ser trocas, mas também imposições, como na colonização."],
            ["O que é diversidade cultural?", ["A existência de muitas culturas diferentes convivendo", "Ter uma única cultura no mundo", "Um tipo de festival de música", "Uma lei de imigração"], 0, "O Brasil tem enorme diversidade: indígenas, afro-brasileiros, imigrantes de várias origens e culturas regionais."],
            ["O que é um estereótipo?", ["Uma ideia simplificada e generalizada sobre um grupo de pessoas", "Uma pesquisa científica", "Um tipo de música", "Um documento"], 0, "\"Todo nordestino é igual\" é um estereótipo: apaga as diferenças entre as pessoas."],
            ["O que é racismo estrutural?", ["O racismo que está presente no funcionamento das instituições e da sociedade, não só em atitudes individuais", "O racismo só nas construções", "Uma regra de arquitetura", "O racismo que já acabou"], 0, "Ele aparece, por exemplo, nas diferenças de salário, de acesso à universidade e na violência policial."],
            ["Qual lei brasileira tornou obrigatório o ensino de história e cultura afro-brasileira e africana nas escolas?", ["Lei 10.639/2003", "Lei Áurea", "Lei Maria da Penha", "Lei do Ventre Livre"], 0, "Em 2008, a Lei 11.645 incluiu também a história e a cultura indígena."],
            ["O que é cultura de massa?", ["Produtos culturais feitos em grande escala para o grande público, como novelas e músicas pop", "A cultura dos povos indígenas", "A arte feita à mão", "A culinária regional"], 0, "A cultura de massa se espalha pelos meios de comunicação, como TV, rádio e internet."],
            ["O que é a identidade cultural?", ["O sentimento de pertencer a um grupo, com sua história, língua e costumes", "O número do RG", "A nacionalidade no passaporte", "A profissão de alguém"], 0, "A identidade é construída na relação com os outros e pode mudar ao longo da vida."],
        ],
    }),
    quizMission({
        subject: "sociologia",
        level: 15,
        title: "Sociologia: Trabalho e Desigualdade",
        icon: "🏭",
        description: "Fordismo, toyotismo, desigualdade social e mobilidade",
        item: { name: "Engrenagem da Fábrica", icon: "⚙️", description: "Uma engrenagem que nunca para de girar. Usar dá XP de quem entende o mundo do trabalho." },
        questions: [
            ["O que foi o fordismo?", ["Um modelo de produção em massa com linha de montagem e trabalho repetitivo, criado por Henry Ford", "Um tipo de carro elétrico", "Uma lei trabalhista", "Um sindicato"], 0, "Na linha de montagem, cada operário fazia sempre a mesma tarefa, e o carro passava por todos."],
            ["O que caracteriza o toyotismo?", ["Produção flexível, sob demanda (just in time), com trabalhadores que fazem várias funções", "Produção em enorme estoque", "Trabalho só manual", "Fábricas sem máquinas"], 0, "O modelo surgiu no Japão, na Toyota, e reduziu estoques e desperdícios."],
            ["O que é desigualdade social?", ["A diferença no acesso a renda, educação, saúde e oportunidades entre grupos da sociedade", "As pessoas terem gostos diferentes", "A diferença de idade", "A variedade de profissões"], 0, "O Brasil está entre os países mais desiguais do mundo em distribuição de renda."],
            ["O que é mobilidade social?", ["A mudança de uma pessoa ou grupo de uma posição social para outra", "Mudar de casa", "Usar transporte público", "Viajar nas férias"], 0, "Pode ser ascendente (subir) ou descendente (descer). A educação costuma ser um caminho de ascensão."],
            ["O que é trabalho informal?", ["O trabalho sem carteira assinada e sem os direitos garantidos por lei", "O trabalho feito de roupa esporte", "O trabalho voluntário", "O trabalho do governo"], 0, "Muitos brasileiros trabalham na informalidade, sem férias remuneradas nem aposentadoria garantida."],
            ["O que é a \"uberização\" do trabalho?", ["O trabalho por aplicativos, sem vínculo de emprego e com renda instável", "Um tipo de carro de luxo", "A criação de sindicatos", "O trabalho em fábricas"], 0, "Entregadores e motoristas de aplicativo têm flexibilidade, mas poucas garantias trabalhistas."],
            ["O que são sindicatos?", ["Associações de trabalhadores que defendem os direitos da categoria", "Empresas de tecnologia", "Partidos do governo", "Clubes de futebol"], 0, "Os sindicatos negociam salários e condições de trabalho e podem organizar greves."],
            ["O que é o desemprego estrutural?", ["O desemprego causado por mudanças na economia, como a automação, que eliminam postos de trabalho", "Ficar sem emprego por um dia", "Trabalhar em construções", "Pedir demissão"], 0, "Robôs e programas de computador substituíram muitas funções repetitivas."],
            ["O que mede o Índice de Gini?", ["A desigualdade na distribuição de renda de um país", "A altura média da população", "O número de escolas", "A temperatura das cidades"], 0, "O índice vai de 0 (igualdade total) a 1 (desigualdade máxima)."],
            ["O que é estratificação social?", ["A divisão da sociedade em camadas, como castas, estamentos ou classes", "A divisão do solo em camadas", "Uma técnica de pintura", "A organização de uma biblioteca"], 0, "Nas castas da Índia tradicional, quase não havia mobilidade; nas classes sociais ela é possível."],
        ],
    }),
    quizMission({
        subject: "sociologia",
        level: 20,
        title: "Sociologia: Cidadania, Estado e Democracia",
        icon: "🗳️",
        description: "Direitos, movimentos sociais, poder e participação política",
        item: { name: "Bandeira do Cidadão", icon: "🏳️", description: "Uma bandeira para levantar nas causas justas. Usar dá XP de quem participa da democracia." },
        questions: [
            ["O que é cidadania?", ["O exercício dos direitos e deveres civis, políticos e sociais", "Morar numa cidade grande", "Ter muito dinheiro", "Trabalhar no governo"], 0, "Ser cidadão é participar da vida em sociedade, com direitos e responsabilidades."],
            ["Segundo T. H. Marshall, quais são os três tipos de direitos da cidadania?", ["Civis, políticos e sociais", "Antigos, medievais e modernos", "Ricos, médios e pobres", "Locais, estaduais e federais"], 0, "Civis: liberdade e igualdade perante a lei; políticos: votar e ser votado; sociais: educação, saúde e trabalho."],
            ["O direito à educação e à saúde públicas é um exemplo de qual tipo de direito?", ["Social", "Civil", "Político", "Comercial"], 0, "Os direitos sociais buscam garantir condições dignas de vida para todos."],
            ["O que são movimentos sociais?", ["Ações coletivas organizadas para defender causas ou mudar a sociedade", "Danças populares", "Partidas de futebol", "Mudanças de casa"], 0, "Movimento negro, feminista, ambientalista e estudantil são exemplos."],
            ["Qual é a diferença entre democracia direta e representativa?", ["Na direta o povo decide pessoalmente; na representativa, elege representantes para decidir", "Não há diferença", "A direta não tem eleições e a representativa não tem leis", "A representativa só existe em monarquias"], 0, "O Brasil é uma democracia representativa, com instrumentos diretos como o plebiscito e o referendo."],
            ["O que é um plebiscito?", ["Uma consulta ao povo antes de uma lei ou decisão ser tomada", "Uma eleição para prefeito", "Um tipo de imposto", "Uma reunião de vizinhos"], 0, "Em 1993, um plebiscito no Brasil manteve a república e o presidencialismo."],
            ["Qual é a função do Poder Legislativo?", ["Fazer as leis e fiscalizar o Executivo", "Julgar os crimes", "Administrar o país no dia a dia", "Comandar o Exército"], 0, "No Brasil, o Legislativo federal é o Congresso Nacional: Câmara dos Deputados e Senado."],
            ["A partir de que idade o voto é facultativo (opcional) no Brasil?", ["16 anos", "12 anos", "18 anos", "21 anos"], 0, "O voto é obrigatório dos 18 aos 70 anos e facultativo para quem tem 16 ou 17, mais de 70 ou é analfabeto."],
            ["O que é o Estado para Weber?", ["A instituição que detém o monopólio do uso legítimo da força num território", "Um estado do Brasil, como Minas Gerais", "Um partido político", "Uma empresa privada"], 0, "Por isso só a polícia e as Forças Armadas podem usar a força, dentro da lei."],
            ["O que é a sociedade civil organizada?", ["Associações, ONGs, sindicatos e coletivos que atuam fora do governo e das empresas", "Apenas os militares", "Os funcionários públicos", "Os bancos"], 0, "Ela fiscaliza o poder público e defende interesses da população."],
        ],
    }),
]

export default missions
