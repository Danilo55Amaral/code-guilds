import { MissionContent } from "../../../src/engine/missions";
import { quizMission } from "./quiz-materia";

// Missões de Geografia pra Biblioteca de Missões (tomo de Geografia): 5 missões
// de 10 perguntas comentadas, nos níveis 1, 5, 10, 15 e 20, com o conteúdo do
// fundamental e do ensino médio: cartografia, clima e relevo, população e
// cidades, globalização e geopolítica, e as questões ambientais e de energia.
// Importar com:
//   npm run missions:import -- <e-mail do professor> scripts/missions/geografia.ts
const missions: MissionContent[] = [
    quizMission({
        subject: "geografia",
        level: 1,
        title: "Geografia: Mapas e Orientação",
        icon: "🧭",
        description: "Pontos cardeais, escala, legenda, latitude e longitude",
        item: { name: "Bússola do Explorador", icon: "🧭", description: "A agulha sempre acha o norte. Usar dá XP de quem nunca se perde no mapa." },
        questions: [
            ["Quais são os quatro pontos cardeais?", ["Norte, Sul, Leste e Oeste", "Nordeste, Noroeste, Sudeste e Sudoeste", "Frente, trás, direita e esquerda", "Equador, trópicos, polos e meridianos"], 0, "Os pontos cardeais são Norte, Sul, Leste e Oeste. Nordeste, Noroeste, Sudeste e Sudoeste são os pontos colaterais."],
            ["De que lado do horizonte o Sol nasce?", ["Leste (nascente)", "Oeste", "Norte", "Sul"], 0, "O Sol nasce no lado leste (nascente) e se põe no lado oeste (poente), por causa da rotação da Terra."],
            ["Para que serve a escala de um mapa?", ["Mostrar quantas vezes a área real foi reduzida no desenho", "Mostrar as cores do mapa", "Indicar o norte", "Dizer a data em que o mapa foi feito"], 0, "Numa escala 1:100.000, 1 cm no mapa vale 100.000 cm (1 km) no terreno."],
            ["O que é a legenda de um mapa?", ["O quadro que explica o significado dos símbolos e cores", "O título do mapa", "O nome de quem fez o mapa", "A linha do Equador"], 0, "A legenda traduz os símbolos: rios em azul, estradas, capitais, áreas de floresta e assim por diante."],
            ["Qual linha imaginária divide a Terra em Hemisfério Norte e Hemisfério Sul?", ["Linha do Equador", "Meridiano de Greenwich", "Trópico de Capricórnio", "Círculo Polar Ártico"], 0, "O Equador fica à mesma distância dos dois polos e marca a latitude 0°."],
            ["Qual linha imaginária divide a Terra em Hemisfério Leste e Oeste?", ["Meridiano de Greenwich", "Linha do Equador", "Trópico de Câncer", "Linha do horizonte"], 0, "O Meridiano de Greenwich, que passa por Londres, marca a longitude 0°."],
            ["A latitude indica a distância de um lugar em relação a quê?", ["À Linha do Equador", "Ao Meridiano de Greenwich", "Ao Polo Sul apenas", "Ao nível do mar"], 0, "A latitude vai de 0° (Equador) a 90° norte ou sul. A longitude é medida a partir de Greenwich."],
            ["O Trópico de Capricórnio passa por qual região do Brasil?", ["Sudeste e Sul (passa perto da cidade de São Paulo)", "Norte (passa por Manaus)", "Nordeste (passa por Salvador)", "Ele não passa pelo Brasil"], 0, "O Trópico de Capricórnio cruza São Paulo, Paraná e Mato Grosso do Sul. A maior parte do Brasil fica entre ele e o Equador."],
            ["O que é um GPS?", ["Um sistema que usa satélites para descobrir a localização de um aparelho", "Um tipo de mapa de papel", "Uma régua para medir distâncias", "Um aplicativo de mensagens"], 0, "O GPS recebe sinais de vários satélites e calcula, pelas distâncias até eles, onde o aparelho está."],
            ["Qual é o maior país da América do Sul em área?", ["Brasil", "Argentina", "Peru", "Colômbia"], 0, "O Brasil tem cerca de 8,5 milhões de km², quase metade da América do Sul, e é o 5º maior país do mundo."],
        ],
    }),
    quizMission({
        subject: "geografia",
        level: 5,
        title: "Geografia: Relevo, Clima e Águas",
        icon: "⛰️",
        description: "Formas de relevo, tipos de clima e as bacias hidrográficas do Brasil",
        item: { name: "Maquete do Relevo", icon: "⛰️", description: "Montanhas, planaltos e planícies em miniatura. Usar dá XP de quem lê a paisagem." },
        questions: [
            ["Qual forma de relevo é uma área plana e baixa, onde os sedimentos se acumulam?", ["Planície", "Planalto", "Montanha", "Depressão absoluta"], 0, "Nas planícies predomina a deposição de sedimentos, como na Planície do Pantanal e na Amazônica."],
            ["Qual é a diferença entre tempo e clima?", ["Tempo é o estado da atmosfera num momento; clima é o padrão do tempo ao longo de muitos anos", "São a mesma coisa", "Clima muda todo dia e tempo nunca muda", "Tempo é só a temperatura"], 0, "\"Hoje vai chover\" é tempo. \"Nesta região os verões são chuvosos\" é clima."],
            ["Qual é o clima predominante na maior parte do Brasil?", ["Tropical", "Polar", "Desértico", "Temperado frio"], 0, "Como fica quase todo entre os trópicos, o Brasil tem predomínio de climas quentes: equatorial, tropical e semiárido. O subtropical aparece no Sul."],
            ["Qual clima brasileiro tem chuvas escassas e irregulares, típico do sertão nordestino?", ["Semiárido", "Equatorial", "Subtropical", "Tropical de altitude"], 0, "O semiárido tem secas longas, e as chuvas se concentram em poucos meses. É o clima da Caatinga."],
            ["Qual é a maior bacia hidrográfica do mundo, que fica em grande parte no Brasil?", ["Bacia Amazônica", "Bacia do São Francisco", "Bacia do Paraná", "Bacia do Nilo"], 0, "A Bacia Amazônica é a maior do planeta em área e em volume de água."],
            ["Qual rio é chamado de \"Velho Chico\" e corta vários estados do Nordeste?", ["Rio São Francisco", "Rio Amazonas", "Rio Tietê", "Rio Paraná"], 0, "O São Francisco nasce em Minas Gerais e atravessa a Bahia e o sertão até o oceano, entre Alagoas e Sergipe."],
            ["Qual é o ponto mais alto do Brasil?", ["Pico da Neblina", "Pico da Bandeira", "Monte Roraima", "Pão de Açúcar"], 0, "O Pico da Neblina, no Amazonas, tem cerca de 2.995 metros. O Pico da Bandeira (2.891 m) fica entre MG e ES."],
            ["O que é erosão?", ["O desgaste e o transporte do solo e das rochas pela água, pelo vento ou pelo gelo", "O nascimento de um vulcão", "A formação de nuvens", "O aumento da temperatura"], 0, "Sem vegetação para segurar o solo, a chuva leva a terra embora e podem surgir as voçorocas."],
            ["O que é uma bacia hidrográfica?", ["A área drenada por um rio principal e seus afluentes", "Uma piscina natural", "Um tipo de chuva", "Um mapa de rios"], 0, "Toda a água da chuva que cai numa bacia escorre para o mesmo rio principal."],
            ["Qual é o nome da massa de ar fria que vem do sul e derruba as temperaturas no inverno?", ["Massa Polar Atlântica", "Massa Equatorial Continental", "Massa Tropical Atlântica", "Massa Equatorial Atlântica"], 0, "A Massa Polar Atlântica traz frentes frias, geadas no Sul e até a \"friagem\" na Amazônia."],
        ],
    }),
    quizMission({
        subject: "geografia",
        level: 10,
        title: "Geografia: População e Cidades",
        icon: "🏙️",
        description: "Demografia, migrações, urbanização e os problemas das cidades",
        item: { name: "Maquete da Metrópole", icon: "🏙️", description: "Prédios, ruas e metrô em miniatura. Usar dá XP de quem entende as cidades." },
        questions: [
            ["O que é urbanização?", ["O aumento da proporção de pessoas que vivem nas cidades", "A construção de fazendas", "A volta das pessoas para o campo", "A criação de parques"], 0, "No Brasil, a urbanização foi rápida: hoje mais de 85% da população vive em áreas urbanas."],
            ["Como se chama a saída em massa de pessoas do campo para as cidades?", ["Êxodo rural", "Êxodo urbano", "Transumância", "Imigração"], 0, "O êxodo rural foi muito forte no Brasil entre as décadas de 1950 e 1980, com a mecanização do campo."],
            ["O que é densidade demográfica?", ["O número de habitantes por km²", "O total de pessoas de um país", "O número de nascimentos por ano", "A idade média da população"], 0, "Um país pode ser populoso (muita gente) e pouco povoado (pouca gente por km²), como o Brasil."],
            ["Qual é a cidade mais populosa do Brasil?", ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"], 0, "A cidade de São Paulo tem mais de 11 milhões de habitantes, e a região metropolitana passa de 20 milhões."],
            ["O que é conurbação?", ["Quando duas ou mais cidades crescem e se juntam, formando uma mancha urbana contínua", "A separação de uma cidade em bairros", "Uma cidade sem prefeito", "Uma rua sem saída"], 0, "As cidades do ABC paulista e a capital, por exemplo, formam uma só mancha urbana."],
            ["A pirâmide etária do Brasil está ficando com a base mais estreita e o topo mais largo. O que isso indica?", ["Que nascem menos crianças e a população está envelhecendo", "Que nascem cada vez mais crianças", "Que os idosos estão diminuindo", "Que a população não muda"], 0, "A queda da natalidade e o aumento da expectativa de vida estão envelhecendo a população brasileira."],
            ["Qual órgão faz o Censo, a contagem da população brasileira?", ["IBGE", "INSS", "Banco Central", "ONU"], 0, "O Instituto Brasileiro de Geografia e Estatística faz o Censo, em geral a cada 10 anos."],
            ["O que é uma metrópole?", ["Uma cidade grande que influencia uma vasta região ao seu redor", "Qualquer cidade pequena", "Uma vila rural", "Um bairro"], 0, "Metrópoles concentram serviços, empregos e decisões e atraem pessoas de muitas cidades em volta."],
            ["Qual destes é um problema comum nas grandes cidades?", ["Congestionamentos e poluição do ar", "Falta total de prédios", "Excesso de florestas", "Ausência de pessoas"], 0, "Trânsito, poluição, enchentes, moradias precárias e violência são desafios urbanos comuns."],
            ["Pessoas que deixam seu país por causa de guerra ou perseguição e pedem proteção em outro são chamadas de:", ["Refugiados", "Turistas", "Emigrantes por férias", "Nômades"], 0, "Os refugiados têm direito à proteção internacional. O Brasil recebeu, por exemplo, muitos refugiados venezuelanos, sírios e haitianos."],
        ],
    }),
    quizMission({
        subject: "geografia",
        level: 15,
        title: "Geografia: Globalização e Geopolítica",
        icon: "🌐",
        description: "Blocos econômicos, organizações internacionais e o mundo conectado",
        item: { name: "Globo das Nações", icon: "🌐", description: "Um globo com as rotas que ligam os países. Usar dá XP de quem entende o mundo conectado." },
        questions: [
            ["O que é globalização?", ["A integração econômica, cultural e tecnológica entre os países do mundo", "O fim de todos os países", "A criação de um único idioma", "A volta ao comércio local"], 0, "Internet, transportes e empresas multinacionais aproximaram os países como nunca."],
            ["Qual bloco econômico tem Brasil, Argentina, Uruguai e Paraguai como membros fundadores?", ["Mercosul", "União Europeia", "Nafta", "Asean"], 0, "O Mercosul foi criado em 1991 pelo Tratado de Assunção."],
            ["Qual bloco econômico adotou uma moeda única, o euro?", ["União Europeia", "Mercosul", "Brics", "Opep"], 0, "Boa parte dos países da União Europeia usa o euro, lançado em 1999 (as notas e moedas circulam desde 2002)."],
            ["O que significa a sigla BRICS na origem?", ["Brasil, Rússia, Índia, China e África do Sul", "Bolívia, Reino Unido, Itália, Canadá e Suécia", "Um banco internacional", "Um tratado de paz"], 0, "O grupo reúne grandes economias emergentes e foi depois ampliado com novos membros."],
            ["Qual organização internacional foi criada em 1945 para manter a paz mundial?", ["ONU (Organização das Nações Unidas)", "OTAN", "FIFA", "OMC"], 0, "A ONU surgiu no fim da Segunda Guerra Mundial. O Conselho de Segurança cuida da paz e da segurança."],
            ["O que é uma empresa multinacional (ou transnacional)?", ["Uma empresa com sede num país e filiais em vários outros", "Uma empresa só de um bairro", "Um órgão do governo", "Uma empresa sem funcionários"], 0, "As multinacionais espalham fábricas e escritórios pelo mundo em busca de mercados e custos menores."],
            ["O que é a OMC (Organização Mundial do Comércio)?", ["A organização que cuida das regras do comércio entre os países", "Um banco brasileiro", "Uma organização militar", "Uma agência de turismo"], 0, "A OMC negocia acordos e resolve disputas comerciais entre os países membros."],
            ["Como se chama a divisão do mundo entre países desenvolvidos e em desenvolvimento usada nas discussões atuais?", ["Norte e Sul (Norte Global e Sul Global)", "Leste e Oeste", "Esquerda e direita", "Terra e mar"], 0, "A ideia de Norte e Sul não segue exatamente o mapa: a Austrália, por exemplo, faz parte do \"Norte\" desenvolvido."],
            ["O que é a OTAN?", ["Uma aliança militar entre países da América do Norte e da Europa", "Um bloco de comércio da América do Sul", "Uma agência da ONU para crianças", "Uma empresa de petróleo"], 0, "A OTAN foi criada em 1949, no começo da Guerra Fria, para a defesa mútua entre os aliados."],
            ["O que é xenofobia?", ["Aversão ou preconceito contra estrangeiros", "Medo de altura", "Amor por viagens", "Estudo dos idiomas"], 0, "Com as migrações, combater a xenofobia é um desafio importante em muitos países."],
        ],
    }),
    quizMission({
        subject: "geografia",
        level: 20,
        title: "Geografia: Meio Ambiente e Energia",
        icon: "⚡",
        description: "Fontes de energia, agronegócio, mudanças climáticas e acordos ambientais",
        item: { name: "Turbina Eólica de Bolso", icon: "🌬️", description: "Gira com qualquer ventinho e acende uma luz. Usar dá XP de quem pensa no futuro do planeta." },
        questions: [
            ["Qual é a principal fonte de energia elétrica no Brasil?", ["Hidrelétrica", "Nuclear", "Carvão mineral", "Petróleo"], 0, "Os rios brasileiros geram a maior parte da eletricidade, mas a energia eólica e a solar crescem rápido."],
            ["Qual é a maior usina hidrelétrica do Brasil em capacidade instalada, na fronteira com o Paraguai?", ["Itaipu (que divide a capacidade com o Paraguai)", "Belo Monte", "Tucuruí", "Sobradinho"], 0, "Itaipu é binacional e uma das maiores do mundo em geração de energia. Belo Monte, no Pará, é a maior totalmente brasileira."],
            ["Qual região do Brasil mais produz energia eólica, por causa dos ventos fortes e constantes?", ["Nordeste", "Sul", "Norte", "Centro-Oeste"], 0, "Bahia e Rio Grande do Norte estão entre os maiores produtores de energia dos ventos."],
            ["Qual acordo internacional de 2015 tenta limitar o aquecimento global a bem menos de 2 °C?", ["Acordo de Paris", "Protocolo de Kyoto", "Tratado de Tordesilhas", "Acordo de Bretton Woods"], 0, "No Acordo de Paris, cada país definiu metas para reduzir as emissões de gases do efeito estufa."],
            ["Em que cidade foi realizada a conferência ambiental Rio-92 (Eco-92)?", ["Rio de Janeiro", "São Paulo", "Brasília", "Manaus"], 0, "A Rio-92 lançou a Agenda 21 e as convenções sobre clima e biodiversidade."],
            ["O que é agronegócio?", ["O conjunto das atividades ligadas à produção agropecuária, da semente à venda", "Só a agricultura familiar", "Uma fábrica de carros", "O comércio de roupas"], 0, "Envolve insumos, produção no campo, indústria de alimentos e exportação. Soja, milho, carne e café estão entre os destaques do Brasil."],
            ["Qual destes é o principal produto de exportação agrícola do Brasil nos últimos anos?", ["Soja", "Trigo", "Maçã", "Uva"], 0, "O Brasil é o maior produtor e exportador de soja do mundo; boa parte vai para a China."],
            ["O que é a ilha de calor nas grandes cidades?", ["O centro urbano fica mais quente que os arredores por causa do asfalto, do concreto e da pouca vegetação", "Uma ilha no meio do oceano", "Um vulcão urbano", "Um bairro sem energia"], 0, "Materiais escuros absorvem calor e prédios bloqueiam o vento; mais árvores e áreas verdes ajudam a amenizar."],
            ["O que é o pré-sal?", ["Uma camada de rochas no fundo do mar, abaixo de uma camada de sal, com grandes reservas de petróleo", "Um tipo de sal de cozinha", "Uma salina no Nordeste", "Um lago salgado"], 0, "O pré-sal fica a mais de 5 mil metros de profundidade no litoral do Sudeste e transformou o Brasil num grande produtor de petróleo."],
            ["Qual atividade é uma das principais causas do desmatamento na Amazônia?", ["A abertura de pastagens para a pecuária", "A pesca no mar", "A energia solar", "O turismo de praia"], 0, "A conversão da floresta em pasto, junto com a extração ilegal de madeira e o garimpo, está entre as maiores causas."],
        ],
    }),
]

export default missions
