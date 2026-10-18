import { MissionContent } from "../../../src/engine/missions";
import { quizMission } from "./quiz-materia";

// Mais 5 missões de ODS (tomo de ODS), nos níveis 1, 5, 10, 15 e 20: atitudes
// do dia a dia, água e saneamento, clima e energia, igualdade e direitos, e
// consumo, cidades e biodiversidade. Não repetem as perguntas das missões
// "ODS", "ODS parte 2" e "ODS parte 3" (programacao-12-anos*.ts).
// Importar com:
//   npm run missions:import -- <e-mail do professor> scripts/missions/ods.ts
const missions: MissionContent[] = [
    quizMission({
        subject: "ods",
        level: 1,
        title: "ODS: Pequenas Atitudes, Grande Impacto",
        icon: "♻️",
        description: "Os 3 Rs, a coleta seletiva e o que cada um pode fazer",
        item: { name: "Garrafinha Reutilizável", icon: "🍶", description: "Uma garrafinha que substitui mil copos de plástico. Usar dá XP de quem cuida do planeta." },
        questions: [
            ["Quais são os 3 Rs da sustentabilidade?", ["Reduzir, reutilizar e reciclar", "Rir, rezar e reclamar", "Reformar, repintar e revender", "Recolher, rasgar e rejeitar"], 0, "A ordem importa: primeiro reduzir o consumo, depois reutilizar e, por último, reciclar."],
            ["Na coleta seletiva, qual é a cor da lixeira para o papel?", ["Azul", "Vermelha", "Verde", "Amarela"], 0, "Azul: papel; vermelha: plástico; verde: vidro; amarela: metal; marrom: orgânico."],
            ["Na coleta seletiva, qual é a cor da lixeira para o plástico?", ["Vermelha", "Azul", "Verde", "Amarela"], 0, "Garrafas PET, embalagens e sacolas plásticas vão na lixeira vermelha (limpas, de preferência)."],
            ["Na coleta seletiva, qual é a cor da lixeira para o vidro?", ["Verde", "Amarela", "Azul", "Marrom"], 0, "O vidro pode ser reciclado infinitas vezes sem perder qualidade."],
            ["O que é compostagem?", ["Transformar restos de alimentos e folhas em adubo", "Queimar o lixo", "Enterrar o plástico", "Jogar o lixo no rio"], 0, "Cascas de frutas e de legumes viram um adubo rico para hortas e jardins."],
            ["Qual atitude economiza água no dia a dia?", ["Tomar banhos mais curtos", "Lavar a calçada com mangueira", "Deixar a torneira pingando", "Encher a banheira todo dia"], 0, "Cada minuto a menos no chuveiro pode economizar vários litros de água."],
            ["Ir para a escola a pé, de bicicleta ou de ônibus, em vez de ir sozinho de carro, ajuda a:", ["Diminuir a poluição do ar e o trânsito", "Aumentar o gasto de combustível", "Piorar a saúde", "Aumentar o lixo"], 0, "Menos carros nas ruas significa menos gases do efeito estufa e mais saúde."],
            ["Por que é melhor usar uma garrafinha reutilizável do que copos descartáveis?", ["Porque gera muito menos lixo plástico", "Porque o copo descartável é mais saudável", "Porque a garrafinha é mais cara", "Não faz diferença"], 0, "Um copo descartável é usado por minutos e pode levar séculos para se decompor."],
            ["O que significa reutilizar?", ["Usar de novo um objeto, do mesmo jeito ou com outra função", "Jogar fora e comprar outro", "Derreter o objeto numa fábrica", "Esconder o objeto"], 0, "Um pote de vidro pode virar porta-lápis, e um pneu velho, um vaso de plantas."],
            ["Por que devemos apagar a luz ao sair de um cômodo?", ["Para economizar energia e diminuir o impacto da geração de eletricidade", "Para a lâmpada esfriar", "Para assustar os mosquitos", "Porque a luz faz mal ao ar"], 0, "Economizar energia ajuda o ODS 7 e o ODS 13 (ação contra a mudança do clima)."],
        ],
    }),
    quizMission({
        subject: "ods",
        level: 5,
        title: "ODS: Água e Saneamento para Todos",
        icon: "💧",
        description: "A água doce do planeta, o saneamento básico e o ODS 6",
        item: { name: "Gota Cristalina", icon: "💧", description: "Uma gota de água pura que nunca evapora. Usar dá XP de quem cuida da água." },
        questions: [
            ["Que parte da água do planeta é doce?", ["Só cerca de 2,5%, e a maior parte está congelada", "Cerca de 50%", "Mais de 90%", "Toda a água"], 0, "Quase toda a água da Terra é salgada. A água doce dos rios e lagos é uma pequena parte desses 2,5%."],
            ["O que inclui o saneamento básico?", ["Água tratada, coleta e tratamento de esgoto, coleta de lixo e drenagem da chuva", "Apenas a coleta de lixo", "Só a construção de praças", "Só a limpeza das praias"], 0, "Sem saneamento, doenças se espalham com facilidade."],
            ["Qual destas doenças está ligada à falta de saneamento básico?", ["Diarreia e hepatite A", "Miopia", "Catapora", "Asma"], 0, "Água e alimentos contaminados por esgoto transmitem muitas doenças."],
            ["Qual é o maior reservatório de água subterrânea que fica, em grande parte, no Brasil?", ["Aquífero Guarani (e o Alter do Chão, na Amazônia, é ainda maior)", "Lago Titicaca", "Mar Morto", "Rio Nilo"], 0, "Os aquíferos guardam água entre as rochas do subsolo e abastecem muitas cidades."],
            ["Em que dia se comemora o Dia Mundial da Água?", ["22 de março", "5 de junho", "7 de setembro", "25 de dezembro"], 0, "O 5 de junho é o Dia Mundial do Meio Ambiente."],
            ["Para que serve uma Estação de Tratamento de Água (ETA)?", ["Para limpar a água dos rios e represas e torná-la própria para beber", "Para tratar o esgoto", "Para produzir energia", "Para fazer gelo"], 0, "Na ETA a água passa por etapas como coagulação, decantação, filtração e desinfecção com cloro."],
            ["Para que serve uma Estação de Tratamento de Esgoto (ETE)?", ["Para limpar o esgoto antes de devolvê-lo aos rios", "Para engarrafar água mineral", "Para gerar internet", "Para regar plantações"], 0, "Esgoto sem tratamento polui os rios e mata os peixes."],
            ["O que é a pegada hídrica?", ["A quantidade de água usada, direta e indiretamente, para produzir algo ou para o nosso consumo", "A marca de um pé molhado", "Um tipo de chuva", "A profundidade de um rio"], 0, "Produzir 1 kg de carne bovina gasta milhares de litros de água, contando a água do pasto e da ração."],
            ["Qual é o número do ODS que trata de água potável e saneamento?", ["ODS 6", "ODS 1", "ODS 9", "ODS 16"], 0, "O ODS 6 busca garantir água e saneamento para todos até 2030."],
            ["O que é reuso da água?", ["Usar de novo uma água já utilizada, como a da máquina de lavar para lavar o quintal", "Beber água do mar", "Jogar água fora", "Comprar água engarrafada"], 0, "Água de chuva e água de reuso servem para descargas, limpeza e irrigação."],
        ],
    }),
    quizMission({
        subject: "ods",
        level: 10,
        title: "ODS: Clima e Energia Limpa",
        icon: "🌡️",
        description: "Gases do efeito estufa, energias renováveis, a COP30 e o ODS 13",
        item: { name: "Termômetro do Planeta", icon: "🌡️", description: "Mede a febre da Terra. Usar dá XP de quem age pelo clima." },
        questions: [
            ["Qual gás, liberado principalmente pela queima de combustíveis fósseis, é o principal responsável pelo aumento do efeito estufa?", ["Gás carbônico (CO₂)", "Oxigênio", "Nitrogênio", "Hélio"], 0, "O metano, liberado pelo gado e pelo lixo, também é um gás de efeito estufa muito potente."],
            ["Qual destas é uma fonte de energia renovável e limpa?", ["Energia eólica", "Carvão mineral", "Óleo diesel", "Gás natural"], 0, "Vento, sol, água e biomassa se renovam na natureza."],
            ["A matriz elétrica do Brasil é considerada uma das mais limpas do mundo. Por quê?", ["Porque a maior parte da eletricidade vem de fontes renováveis, como hidrelétricas, eólicas e solares", "Porque o Brasil não usa eletricidade", "Porque só usa carvão", "Porque compra toda a energia de fora"], 0, "Mais de 80% da eletricidade brasileira vem de fontes renováveis."],
            ["Em qual cidade brasileira aconteceu a conferência do clima da ONU, a COP30, em 2025?", ["Belém", "São Paulo", "Rio de Janeiro", "Brasília"], 0, "A COP30 aconteceu na Amazônia, em Belém do Pará."],
            ["O que é a pegada de carbono?", ["A quantidade de gases de efeito estufa emitida por uma pessoa, empresa ou produto", "Uma marca de carvão no chão", "Um tipo de lápis", "A poluição de uma praia"], 0, "Transporte, energia e alimentação influenciam a pegada de carbono de cada um."],
            ["Qual é uma consequência do aquecimento global?", ["O derretimento das geleiras e a subida do nível do mar", "O fim das chuvas no mundo inteiro", "O resfriamento dos oceanos", "O aumento das florestas"], 0, "Também aumentam os eventos extremos, como secas, ondas de calor e enchentes."],
            ["O que faz o IPCC, ligado à ONU?", ["Reúne cientistas para avaliar o conhecimento sobre as mudanças climáticas", "Fabrica painéis solares", "Organiza as Olimpíadas", "Cuida do comércio de petróleo"], 0, "Os relatórios do IPCC mostram que o aquecimento atual é causado pelas atividades humanas."],
            ["O que são painéis fotovoltaicos?", ["Placas que transformam a luz do Sol diretamente em eletricidade", "Placas que aquecem a água com gás", "Espelhos de decoração", "Telas de computador"], 0, "A energia solar é a fonte que mais cresce no Brasil."],
            ["Desmatar e queimar florestas contribui para as mudanças climáticas porque:", ["Libera o carbono guardado nas árvores e diminui quem absorve CO₂", "Esfria o planeta", "Aumenta as chuvas no mundo todo", "Não tem relação"], 0, "No Brasil, o desmatamento é uma das maiores fontes de emissões de gases de efeito estufa."],
            ["Qual é o número do ODS que trata da ação contra a mudança global do clima?", ["ODS 13", "ODS 3", "ODS 8", "ODS 17"], 0, "O ODS 13 pede medidas urgentes para combater a mudança do clima e seus impactos."],
        ],
    }),
    quizMission({
        subject: "ods",
        level: 15,
        title: "ODS: Igualdade e Direitos",
        icon: "🤝",
        description: "Direitos humanos, leis de proteção e a redução das desigualdades",
        item: { name: "Laço da Igualdade", icon: "🎗️", description: "Um laço que une todas as pessoas. Usar dá XP de quem defende os direitos de todos." },
        questions: [
            ["Em que ano a ONU aprovou a Declaração Universal dos Direitos Humanos?", ["1948", "1888", "1989", "2015"], 0, "Ela afirma que todos os seres humanos nascem livres e iguais em dignidade e direitos."],
            ["Qual lei brasileira, de 1990, garante os direitos de crianças e adolescentes?", ["ECA (Estatuto da Criança e do Adolescente)", "Lei Áurea", "CLT", "Código de Trânsito"], 0, "O ECA garante direitos como educação, saúde, lazer e proteção contra a violência e o trabalho infantil."],
            ["Qual lei brasileira, de 2006, combate a violência doméstica contra a mulher?", ["Lei Maria da Penha", "Lei de Cotas", "Lei do Ventre Livre", "Lei de Terras"], 0, "Ela leva o nome de Maria da Penha, que lutou por justiça depois de sofrer violência."],
            ["Desde 2002, qual língua é reconhecida por lei como meio legal de comunicação no Brasil, ao lado do português?", ["Libras (Língua Brasileira de Sinais)", "Inglês", "Espanhol", "Tupi"], 0, "A Libras é a língua da comunidade surda brasileira."],
            ["O que a Lei de Cotas (2012) garante nas universidades e institutos federais?", ["Vagas reservadas para estudantes de escolas públicas, com parte para pretos, pardos, indígenas e pessoas com deficiência", "Vagas só para estrangeiros", "Bolsas para atletas", "Vagas só para quem fez cursinho"], 0, "As cotas ajudam a reduzir desigualdades no acesso ao ensino superior."],
            ["Qual jovem paquistanesa ganhou o Nobel da Paz em 2014 lutando pelo direito das meninas à educação?", ["Malala Yousafzai", "Greta Thunberg", "Anne Frank", "Marie Curie"], 0, "Malala foi atacada por defender a educação feminina e se tornou a pessoa mais jovem a ganhar o Nobel da Paz."],
            ["Qual é o número do ODS que trata da redução das desigualdades dentro dos países e entre eles?", ["ODS 10", "ODS 2", "ODS 7", "ODS 14"], 0, "O ODS 10 busca incluir todas as pessoas, independentemente de idade, gênero, raça, deficiência ou renda."],
            ["O que é trabalho análogo à escravidão, ainda combatido no Brasil?", ["Trabalho forçado, em condições degradantes, com jornadas exaustivas ou por dívida", "Qualquer trabalho de fim de semana", "O trabalho voluntário", "O estágio"], 0, "Denúncias podem ser feitas pelo Disque 100, e trabalhadores são resgatados todos os anos."],
            ["Qual lei de 2015 garante os direitos e a inclusão das pessoas com deficiência no Brasil?", ["Lei Brasileira de Inclusão (Estatuto da Pessoa com Deficiência)", "Lei Maria da Penha", "Lei Áurea", "Código Civil de 1916"], 0, "Ela garante acessibilidade, educação inclusiva e combate à discriminação."],
            ["O que é equidade?", ["Dar a cada pessoa o apoio de que ela precisa para ter as mesmas oportunidades", "Tratar todo mundo exatamente igual, sempre", "Dar mais para quem já tem mais", "Ignorar as diferenças"], 0, "Igualdade é dar o mesmo a todos; equidade é ajustar para que todos cheguem às mesmas oportunidades."],
        ],
    }),
    quizMission({
        subject: "ods",
        level: 20,
        title: "ODS: Consumo, Cidades e Biodiversidade",
        icon: "🌿",
        description: "Economia circular, desperdício, biodiversidade e cidades sustentáveis",
        item: { name: "Muda de Pau-Brasil", icon: "🌳", description: "Uma muda da árvore que deu nome ao país. Usar dá XP de quem protege a biodiversidade." },
        questions: [
            ["O que é economia circular?", ["Um modelo em que os produtos são pensados para serem reaproveitados, consertados e reciclados, reduzindo o lixo", "Uma economia que só usa moedas redondas", "Comprar, usar e jogar fora", "Uma economia sem dinheiro"], 0, "Ela se opõe à economia linear, do \"extrair, produzir, descartar\"."],
            ["O que é obsolescência programada?", ["Quando um produto é feito para durar pouco ou ficar ultrapassado rápido, forçando nova compra", "Um programa de computador", "Um produto que dura para sempre", "Uma promoção de loja"], 0, "Ela aumenta o lixo, principalmente o eletrônico."],
            ["O que é logística reversa?", ["O caminho de volta dos produtos e embalagens usados até o fabricante, para reciclagem ou descarte correto", "Entregar produtos de trás para a frente", "Um tipo de caminhão", "A devolução de dinheiro"], 0, "Pilhas, pneus, óleo e eletrônicos têm sistemas de logística reversa no Brasil."],
            ["Segundo a ONU, cerca de que parte dos alimentos produzidos no mundo é perdida ou desperdiçada?", ["Cerca de um terço", "Quase nada", "Metade de 1%", "Tudo"], 0, "Ao mesmo tempo, milhões de pessoas passam fome. Reduzir o desperdício é meta do ODS 12."],
            ["Por que o Brasil é considerado um país megadiverso?", ["Porque abriga uma das maiores biodiversidades do planeta", "Porque tem muitos prédios", "Porque tem muitas montanhas de gelo", "Porque tem poucas espécies"], 0, "O Brasil tem a maior quantidade de espécies de plantas e um enorme número de animais."],
            ["Qual primata brasileiro, que esteve quase extinto, virou símbolo da conservação da Mata Atlântica?", ["Mico-leão-dourado", "Gorila", "Orangotango", "Babuíno"], 0, "Graças a projetos de proteção, a população de micos-leões-dourados voltou a crescer."],
            ["O que são unidades de conservação?", ["Áreas protegidas por lei, como parques nacionais e reservas", "Fábricas de reciclagem", "Bairros novos", "Rodovias"], 0, "O Parque Nacional do Iguaçu e o de Fernando de Noronha são exemplos."],
            ["Qual é o número do ODS que trata da vida terrestre: florestas, biodiversidade e combate à desertificação?", ["ODS 15", "ODS 11", "ODS 4", "ODS 9"], 0, "O ODS 14 trata da vida na água; o ODS 15, da vida na terra."],
            ["O que é uma \"cidade sustentável\" (ODS 11)?", ["Uma cidade inclusiva, segura e verde, com transporte público, áreas verdes e moradia digna", "Uma cidade sem ninguém", "Uma cidade só de prédios altos", "Uma cidade sem regras"], 0, "Transporte coletivo, ciclovias, coleta seletiva e parques fazem parte dessa ideia."],
            ["O que é agroecologia?", ["Uma forma de produzir alimentos que respeita a natureza, com pouco ou nenhum agrotóxico e valorizando a biodiversidade", "Usar o máximo de agrotóxicos possível", "Criar animais em apartamentos", "Plantar só uma espécie em áreas enormes"], 0, "A agroecologia ajuda o ODS 2 (fome zero e agricultura sustentável)."],
        ],
    }),
]

export default missions
