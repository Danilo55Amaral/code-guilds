import { MissionContent } from "../../../src/engine/missions";
import { quizMission } from "./quiz-materia";

// Missões de História do Brasil pra Biblioteca de Missões (tomo de História do
// Brasil): 5 missões de 10 perguntas comentadas, nos níveis 1, 5, 10, 15 e 20,
// com o conteúdo do fundamental e do ensino médio. Não repetem as perguntas
// sobre o Brasil das missões de História Geral (historia.ts).
// Importar com:
//   npm run missions:import -- <e-mail do professor> scripts/missions/historia-do-brasil.ts
const missions: MissionContent[] = [
    quizMission({
        subject: "historia-brasil",
        level: 1,
        title: "História do Brasil: Os Primeiros Povos e a Colonização",
        icon: "🏹",
        description: "Os povos indígenas, as capitanias hereditárias e o Governo-Geral",
        item: { name: "Cocar de Penas", icon: "🏹", description: "Um cocar colorido que conta a história dos primeiros povos. Usar dá XP de quem conhece as raízes do Brasil." },
        questions: [
            ["Qual destes é um tronco linguístico de povos indígenas do Brasil?", ["Tupi", "Latim", "Árabe", "Grego"], 0, "Os troncos Tupi e Macro-Jê reúnem muitas línguas indígenas. Palavras como \"pipoca\", \"capivara\" e \"Itaquera\" vêm do tupi."],
            ["O que eram as capitanias hereditárias?", ["Grandes faixas de terra entregues pelo rei de Portugal a donatários, que passavam de pai para filho", "Navios de guerra", "Escolas dos jesuítas", "Tribos indígenas"], 0, "Criadas em 1534, elas tentavam ocupar e defender o território sem gastar dinheiro da Coroa."],
            ["Quais duas capitanias hereditárias deram certo, principalmente por causa do açúcar?", ["Pernambuco e São Vicente", "Bahia e Rio Grande", "Ceará e Maranhão", "Pará e Amazonas"], 0, "Pernambuco, de Duarte Coelho, e São Vicente prosperaram; a maioria das outras fracassou."],
            ["Por que foi criado o Governo-Geral em 1548?", ["Para centralizar a administração da colônia, já que a maioria das capitanias fracassou", "Para dar a independência ao Brasil", "Para acabar com a escravidão", "Para mudar a capital para Brasília"], 0, "O primeiro governador-geral foi Tomé de Sousa, que fundou Salvador em 1549, a primeira capital."],
            ["Qual foi a primeira capital do Brasil?", ["Salvador", "Rio de Janeiro", "São Paulo", "Recife"], 0, "Salvador foi capital de 1549 a 1763, quando a sede passou para o Rio de Janeiro."],
            ["Quem eram os jesuítas que chegaram ao Brasil com Tomé de Sousa?", ["Religiosos católicos que catequizavam os indígenas e fundaram escolas", "Soldados holandeses", "Comerciantes ingleses", "Piratas franceses"], 0, "Padres como Manuel da Nóbrega e José de Anchieta fundaram colégios e aldeamentos e ajudaram a fundar São Paulo, em 1554."],
            ["Como se chamava a troca de trabalho por objetos entre portugueses e indígenas no começo da colonização?", ["Escambo", "Salário", "Imposto", "Leilão"], 0, "No escambo, os indígenas cortavam o pau-brasil em troca de facas, espelhos e tecidos."],
            ["Que povo europeu invadiu o Nordeste e dominou Pernambuco no século XVII, por causa do açúcar?", ["Os holandeses", "Os ingleses", "Os russos", "Os italianos"], 0, "Os holandeses ficaram em Pernambuco de 1630 a 1654. Maurício de Nassau governou a região e trouxe artistas e cientistas."],
            ["Quem foi o bandeirante paulista famoso por expedições ao interior em busca de ouro e indígenas?", ["Fernão Dias (o \"Caçador de Esmeraldas\")", "Tiradentes", "Dom Pedro II", "Getúlio Vargas"], 0, "As bandeiras ajudaram a expandir o território para o interior, mas também escravizaram indígenas."],
            ["O Dia dos Povos Indígenas é comemorado em qual data?", ["19 de abril", "22 de abril", "7 de setembro", "15 de novembro"], 0, "A data lembra a diversidade dos povos originários. Hoje existem mais de 300 povos indígenas no Brasil."],
        ],
    }),
    quizMission({
        subject: "historia-brasil",
        level: 5,
        title: "História do Brasil: Escravidão e Resistência",
        icon: "⛓️",
        description: "O tráfico de africanos, as revoltas e a luta pela liberdade",
        item: { name: "Correntes Partidas", icon: "⛓️", description: "Elos quebrados que lembram a luta pela liberdade. Usar dá XP de quem conhece a história da resistência." },
        questions: [
            ["Como se chamava o comércio de pessoas africanas escravizadas trazidas à força para a América?", ["Tráfico negreiro (tráfico atlântico)", "Escambo", "Mercantilismo", "Feudalismo"], 0, "Estima-se que cerca de 4,8 milhões de africanos foram trazidos à força para o Brasil, o maior destino do tráfico."],
            ["Como eram chamados os navios que traziam os africanos escravizados?", ["Navios negreiros (tumbeiros)", "Caravelas reais", "Galeões de ouro", "Barcas de pesca"], 0, "O apelido \"tumbeiros\" vem das condições terríveis, em que muitas pessoas morriam na travessia."],
            ["Qual revolta de africanos muçulmanos aconteceu em Salvador em 1835?", ["Revolta dos Malês", "Revolta da Vacina", "Cabanagem", "Inconfidência Mineira"], 0, "Os malês eram africanos muçulmanos, muitos alfabetizados em árabe. A revolta foi a maior rebelião urbana de escravizados do Brasil."],
            ["Quem foi Dandara?", ["Uma guerreira de Palmares, companheira de Zumbi, símbolo da resistência negra feminina", "Uma princesa portuguesa", "Uma bandeirante paulista", "A primeira presidenta do Brasil"], 0, "Dandara lutou na defesa de Palmares e hoje é lembrada como heroína da resistência."],
            ["Quem foi Luiz Gama?", ["Um advogado e poeta, ex-escravizado, que libertou centenas de pessoas na Justiça", "Um imperador do Brasil", "Um bandeirante", "Um general da Guerra do Paraguai"], 0, "Luiz Gama aprendeu a ler sozinho e usou as leis para provar que muitas pessoas estavam escravizadas ilegalmente."],
            ["O que determinava a Lei do Ventre Livre, de 1871?", ["Que os filhos de mulheres escravizadas nascidos a partir dela seriam livres", "Que todos os escravizados estavam livres", "Que os idosos estavam livres", "Que o tráfico estava proibido"], 0, "Na prática, as crianças continuavam sob o controle dos senhores até os 21 anos."],
            ["O que determinava a Lei dos Sexagenários, de 1885?", ["A liberdade dos escravizados com mais de 60 anos", "A liberdade das crianças", "O fim do tráfico", "A abolição completa"], 0, "Também chamada de Lei Saraiva-Cotegipe, beneficiou poucas pessoas, porque poucos escravizados chegavam a essa idade."],
            ["Qual lei de 1850 proibiu o tráfico de africanos escravizados para o Brasil?", ["Lei Eusébio de Queirós", "Lei Áurea", "Lei do Ventre Livre", "Lei de Terras"], 0, "A pressão da Inglaterra foi decisiva para essa lei, que finalmente acabou com o tráfico."],
            ["Quem foi André Rebouças?", ["Um engenheiro negro e abolicionista do Império", "Um padre jesuíta", "O primeiro governador-geral", "Um pintor holandês"], 0, "Rebouças projetou obras importantes e defendia que os ex-escravizados recebessem terras depois da abolição."],
            ["O 20 de novembro, Dia Nacional de Zumbi e da Consciência Negra, virou feriado nacional em que ano?", ["2024", "1888", "1988", "2000"], 0, "A data já era celebrada havia décadas, e a lei de 2023 a transformou em feriado nacional a partir de 2024."],
        ],
    }),
    quizMission({
        subject: "historia-brasil",
        level: 10,
        title: "História do Brasil: Regências e Segundo Reinado",
        icon: "👑",
        description: "As revoltas regenciais, a Guerra do Paraguai e o fim do Império",
        item: { name: "Cetro Imperial", icon: "🔱", description: "O cetro dourado do Império. Usar dá XP de quem conhece o século XIX brasileiro." },
        questions: [
            ["Por que o Brasil foi governado por regentes de 1831 a 1840?", ["Porque D. Pedro I abdicou e seu filho, D. Pedro II, ainda era criança", "Porque o Brasil virou república", "Porque Portugal voltou a governar", "Porque não havia eleições"], 0, "D. Pedro II tinha só 5 anos quando o pai voltou para Portugal; regentes governaram até a maioridade dele."],
            ["Qual revolta do Período Regencial aconteceu no Pará e teve grande participação de indígenas e ribeirinhos?", ["Cabanagem", "Farroupilha", "Sabinada", "Balaiada"], 0, "A Cabanagem (1835-1840) chegou a tomar Belém. O nome vem das cabanas onde viviam muitos rebeldes."],
            ["Qual revolta no Rio Grande do Sul chegou a proclamar uma república e durou cerca de 10 anos?", ["Revolução Farroupilha", "Cabanagem", "Revolta dos Malês", "Balaiada"], 0, "A Farroupilha (1835-1845) criou a República Rio-Grandense e terminou num acordo com o Império."],
            ["A Sabinada (1837-1838) aconteceu em qual província?", ["Bahia", "Maranhão", "Pará", "Rio Grande do Sul"], 0, "Liderada pelo médico Francisco Sabino, proclamou uma república temporária em Salvador."],
            ["A Balaiada (1838-1841) aconteceu principalmente em qual província?", ["Maranhão", "São Paulo", "Bahia", "Minas Gerais"], 0, "O nome vem de um dos líderes, Manuel dos Anjos Ferreira, o \"Balaio\", que fazia cestos de palha."],
            ["Contra qual país o Brasil, a Argentina e o Uruguai lutaram na Tríplice Aliança (1864-1870)?", ["Paraguai", "Chile", "Bolívia", "Peru"], 0, "A Guerra do Paraguai foi o maior conflito da América do Sul e devastou a população paraguaia."],
            ["Qual militar brasileiro ficou famoso na Guerra do Paraguai e é o patrono do Exército?", ["Duque de Caxias", "Tiradentes", "Marechal Rondon", "Barão do Rio Branco"], 0, "Luís Alves de Lima e Silva, o Duque de Caxias, também reprimiu revoltas regenciais."],
            ["O que foi a Lei de Terras de 1850?", ["Uma lei que só permitia obter terras pela compra, dificultando o acesso de pobres e ex-escravizados", "A divisão do Brasil em estados", "A doação de terras a todos", "A criação dos parques nacionais"], 0, "Na prática, a lei concentrou ainda mais a terra nas mãos dos grandes fazendeiros."],
            ["No Segundo Reinado, quem passou a substituir a mão de obra escravizada nas fazendas de café do Sudeste?", ["Imigrantes europeus, principalmente italianos", "Soldados paraguaios", "Engenheiros ingleses", "Indígenas da Amazônia"], 0, "A partir da década de 1870, milhares de italianos, e depois espanhóis, portugueses e japoneses, vieram trabalhar no café."],
            ["Qual destes fatos ajudou a enfraquecer o Império antes de 1889?", ["Os conflitos com o Exército e com a Igreja e o descontentamento dos fazendeiros com a abolição", "A vitória na Copa do Mundo", "A descoberta do pré-sal", "A construção de Brasília"], 0, "A Questão Militar, a Questão Religiosa e a perda do apoio dos cafeicultores abriram caminho para a República."],
        ],
    }),
    quizMission({
        subject: "historia-brasil",
        level: 15,
        title: "História do Brasil: República Velha e Era Vargas",
        icon: "☕",
        description: "Café com leite, coronelismo, Canudos, tenentismo e o governo de Vargas",
        item: { name: "Saca de Café Antiga", icon: "☕", description: "Um saquinho do café que movia a República. Usar dá XP de quem entende a Primeira República." },
        questions: [
            ["O que foi a \"política do café com leite\"?", ["O revezamento de presidentes ligados a São Paulo (café) e Minas Gerais (leite)", "Uma lei sobre alimentação escolar", "Um acordo comercial com a Europa", "A merenda das escolas"], 0, "As oligarquias paulista e mineira controlaram a presidência durante boa parte da República Velha."],
            ["O que era o coronelismo?", ["O poder dos grandes fazendeiros (coronéis) que controlavam os votos da população local", "O comando do Exército", "O governo dos militares", "Um tipo de festa"], 0, "Com o voto aberto, o coronel pressionava os eleitores: era o \"voto de cabresto\"."],
            ["O que foi a Guerra de Canudos (1896-1897)?", ["O conflito entre o Exército e a comunidade sertaneja liderada por Antônio Conselheiro, na Bahia", "Uma guerra contra a Argentina", "Uma revolta de marinheiros", "A independência do Acre"], 0, "Euclides da Cunha contou essa guerra no livro \"Os Sertões\"."],
            ["O que foi a Revolta da Vacina (1904)?", ["Um protesto no Rio de Janeiro contra a vacinação obrigatória contra a varíola e as reformas urbanas", "Uma revolta pela criação de vacinas", "Uma greve de médicos", "Uma guerra contra o Paraguai"], 0, "A campanha de Oswaldo Cruz era necessária, mas foi imposta sem explicação, o que gerou revolta."],
            ["O que foi a Revolta da Chibata (1910)?", ["A rebelião de marinheiros contra os castigos físicos na Marinha, liderada por João Cândido", "Uma revolta de fazendeiros", "Uma greve de estudantes", "Um conflito religioso"], 0, "João Cândido, o \"Almirante Negro\", liderou os marinheiros que tomaram navios de guerra."],
            ["O que foi o Tenentismo, nos anos 1920?", ["O movimento de jovens oficiais do Exército contra as oligarquias, que fez revoltas como a Coluna Prestes", "Um clube de futebol", "Um partido comunista", "Um sindicato de professores"], 0, "A Coluna Prestes percorreu cerca de 25 mil km pelo interior do Brasil."],
            ["Como Getúlio Vargas chegou ao poder em 1930?", ["Pela Revolução de 1930, um movimento armado que derrubou o presidente Washington Luís", "Por uma eleição direta com voto secreto", "Por herança", "Por indicação de Portugal"], 0, "A Revolução de 1930 encerrou a República Velha."],
            ["Em que ano as mulheres conquistaram o direito de votar no Brasil?", ["1932", "1888", "1964", "1988"], 0, "O Código Eleitoral de 1932 garantiu o voto feminino e criou o voto secreto e a Justiça Eleitoral."],
            ["Qual empresa estatal de petróleo foi criada no governo Vargas, com a campanha \"O petróleo é nosso\"?", ["Petrobras", "Vale", "Embraer", "Eletrobras"], 0, "A Petrobras foi criada em 1953, no segundo governo Vargas."],
            ["Como terminou o segundo governo de Getúlio Vargas, em 1954?", ["Com o suicídio de Vargas, no Palácio do Catete, em meio a uma grave crise política", "Com a vitória numa eleição", "Com a independência do Brasil", "Com uma guerra"], 0, "Ele deixou uma carta-testamento com a frase \"Saio da vida para entrar na história\"."],
        ],
    }),
    quizMission({
        subject: "historia-brasil",
        level: 20,
        title: "História do Brasil: Ditadura e Redemocratização",
        icon: "🗳️",
        description: "O golpe de 1964, o AI-5, as Diretas Já e a Nova República",
        item: { name: "Urna da Democracia", icon: "🗳️", description: "A urna que guarda a voz do povo. Usar dá XP de quem valoriza a democracia." },
        questions: [
            ["Em que ano começou a ditadura militar no Brasil?", ["1964", "1930", "1985", "1945"], 0, "Um golpe militar derrubou o presidente João Goulart em 31 de março/1º de abril de 1964. A ditadura durou até 1985."],
            ["O que foi o AI-5, de 1968?", ["O ato institucional mais duro da ditadura, que fechou o Congresso e suspendeu direitos", "Uma lei que criou as eleições diretas", "Um acordo de paz", "Uma reforma da escola"], 0, "O AI-5 permitiu cassar políticos, censurar a imprensa e suspendeu o habeas corpus para crimes políticos."],
            ["Como era chamado o período de crescimento econômico acelerado do Brasil entre 1968 e 1973?", ["Milagre econômico", "Plano Real", "Década perdida", "Belle Époque"], 0, "A economia cresceu muito, mas a desigualdade aumentou e a dívida externa disparou."],
            ["O que foi a censura durante a ditadura?", ["O controle do governo sobre jornais, músicas, filmes e livros", "Uma lei de proteção ao consumidor", "Um imposto sobre livros", "Um tipo de eleição"], 0, "Muitos artistas, como Chico Buarque, usavam metáforas para driblar os censores."],
            ["O que foi a Lei da Anistia, de 1979?", ["Uma lei que perdoou crimes políticos e permitiu a volta dos exilados", "Uma lei que criou a ditadura", "Uma lei sobre impostos", "Uma reforma agrária"], 0, "A anistia permitiu a volta de exilados, mas também perdoou agentes da repressão, o que é debatido até hoje."],
            ["O que pedia o movimento das Diretas Já (1983-1984)?", ["Eleições diretas para presidente da República", "O fim do futebol", "A volta da monarquia", "Uma nova capital"], 0, "Milhões foram às ruas. A emenda Dante de Oliveira foi derrotada, mas o movimento acelerou a redemocratização."],
            ["Quem foi eleito presidente de forma indireta em 1985, mas morreu antes de tomar posse?", ["Tancredo Neves", "José Sarney", "Fernando Collor", "Ulysses Guimarães"], 0, "O vice, José Sarney, assumiu e foi o primeiro presidente civil depois da ditadura."],
            ["Qual foi o primeiro presidente eleito pelo voto direto depois da ditadura, em 1989?", ["Fernando Collor", "Lula", "Fernando Henrique Cardoso", "Itamar Franco"], 0, "Collor sofreu impeachment em 1992, após denúncias de corrupção, e Itamar Franco assumiu."],
            ["Qual plano econômico, de 1994, acabou com a hiperinflação e criou a moeda que usamos hoje?", ["Plano Real", "Plano Cruzado", "Plano Collor", "Plano de Metas"], 0, "Lançado no governo Itamar Franco, o Plano Real criou a URV e depois o real."],
            ["Ulysses Guimarães chamou um documento de 1988 de \"Constituição Cidadã\". Por quê?", ["Porque ela ampliou muito os direitos dos cidadãos depois da ditadura", "Porque foi escrita só por cidadãos estrangeiros", "Porque acabou com as eleições", "Porque criou a monarquia"], 0, "A Constituição garantiu direitos como o voto dos analfabetos e dos jovens de 16 anos, o SUS e a proteção às terras indígenas."],
        ],
    }),
]

export default missions
