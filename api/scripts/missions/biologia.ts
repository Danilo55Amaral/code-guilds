import { MissionContent } from "../../../src/engine/missions";
import { quizMission } from "./quiz-materia";

// Missões de Biologia pra Biblioteca de Missões (tomo de Biologia): 5 missões
// de 10 perguntas comentadas, nos níveis 1, 5, 10, 15 e 20, com o conteúdo de
// Ciências do fundamental e de Biologia do ensino médio: seres vivos e células,
// corpo humano, ecologia, genética e evolução.
// O professor ajusta XP, moedas e itens no painel. Importar com:
//   npm run missions:import -- <e-mail do professor> scripts/missions/biologia.ts
const missions: MissionContent[] = [
    quizMission({
        subject: "biologia",
        level: 1,
        title: "Biologia: Seres Vivos e Células",
        icon: "🔬",
        description: "O que é estar vivo, a célula e as partes dela",
        item: { name: "Microscópio de Bolso", icon: "🔬", description: "Uma lente que mostra o mundo pequenininho. Usar dá XP de quem já viu uma célula de perto." },
        questions: [
            ["Qual é a menor unidade de um ser vivo?", ["O átomo", "A célula", "O órgão", "O tecido"], 1, "A célula é a unidade básica da vida: todo ser vivo é formado por uma ou por muitas células."],
            ["Qual destes NÃO é um ser vivo?", ["Um cogumelo", "Uma bactéria", "Uma pedra", "Uma samambaia"], 2, "Seres vivos nascem, se alimentam, respiram, crescem e se reproduzem. A pedra não faz nada disso."],
            ["Qual parte da célula guarda o material genético (o DNA) nas células animais e vegetais?", ["O núcleo", "A membrana", "O citoplasma", "O vacúolo"], 0, "O núcleo é o \"centro de comando\" da célula e guarda o DNA, com as instruções pra ela funcionar."],
            ["Qual estrutura envolve a célula e controla o que entra e o que sai?", ["A parede de tijolos", "A membrana plasmática", "O núcleo", "O cloroplasto"], 1, "A membrana plasmática é a \"porta\" da célula: deixa passar umas substâncias e barra outras."],
            ["Qual estrutura existe na célula vegetal e NÃO existe na célula animal?", ["Núcleo", "Membrana plasmática", "Cloroplasto", "Citoplasma"], 2, "Os cloroplastos fazem a fotossíntese e só existem em plantas e algas. A célula vegetal também tem parede celular, que a animal não tem."],
            ["Qual organela é conhecida como a \"usina de energia\" da célula?", ["Mitocôndria", "Ribossomo", "Vacúolo", "Parede celular"], 0, "Na mitocôndria acontece a respiração celular, que tira energia dos alimentos usando oxigênio."],
            ["As bactérias são seres:", ["Pluricelulares com núcleo", "Unicelulares e sem núcleo organizado (procariontes)", "Feitos só de vírus", "Vegetais"], 1, "Bactérias têm uma célula só e o DNA fica solto no citoplasma, sem núcleo. Por isso são procariontes."],
            ["Por que os vírus são um caso especial entre os seres vivos?", ["Porque são os maiores seres vivos", "Porque não têm células e só se multiplicam dentro de uma célula hospedeira", "Porque fazem fotossíntese", "Porque vivem só no mar"], 1, "Vírus não têm célula nem metabolismo próprio: precisam invadir uma célula pra se multiplicar. Muitos cientistas nem os consideram vivos."],
            ["Os fungos, como cogumelos e bolores, se alimentam como?", ["Fazendo fotossíntese", "Absorvendo nutrientes de matéria orgânica, muitas vezes em decomposição", "Caçando outros animais", "Não se alimentam"], 1, "Fungos não fazem fotossíntese: soltam substâncias que digerem a matéria ao redor e absorvem os nutrientes. Muitos são decompositores."],
            ["Qual instrumento permitiu que os cientistas descobrissem as células?", ["O telescópio", "O microscópio", "O termômetro", "A bússola"], 1, "Robert Hooke usou um microscópio em 1665 pra observar cortiça e chamou os buraquinhos que viu de \"células\"."],
        ],
    }),
    quizMission({
        subject: "biologia",
        level: 5,
        title: "Biologia: O Corpo Humano",
        icon: "🧠",
        description: "Os sistemas do corpo: digestão, respiração, circulação e mais",
        item: { name: "Esqueleto de Bolso", icon: "🦴", description: "Um esqueletinho articulado de 206 ossos (pequenininhos). Usar dá XP de quem conhece o próprio corpo." },
        questions: [
            ["Qual órgão bombeia o sangue para todo o corpo?", ["O pulmão", "O coração", "O fígado", "O estômago"], 1, "O coração é um músculo que bate sem parar, empurrando o sangue pelas artérias até cada parte do corpo."],
            ["Onde acontece a troca de gases da respiração, entrando oxigênio e saindo gás carbônico?", ["Nos alvéolos dos pulmões", "No estômago", "No coração", "Nos rins"], 0, "Nos alvéolos, saquinhos minúsculos dos pulmões, o oxigênio passa pro sangue e o gás carbônico sai dele pra ser expirado."],
            ["Onde começa a digestão dos alimentos?", ["No estômago", "No intestino grosso", "Na boca", "No fígado"], 2, "A digestão começa na boca: os dentes trituram a comida e a saliva já começa a quebrar o amido."],
            ["Em qual órgão a maior parte dos nutrientes é absorvida para o sangue?", ["No intestino delgado", "No esôfago", "No intestino grosso", "Na bexiga"], 0, "O intestino delgado é longo e cheio de dobrinhas (vilosidades) que absorvem os nutrientes. O grosso absorve principalmente água."],
            ["Qual órgão filtra o sangue e produz a urina?", ["Os pulmões", "Os rins", "O pâncreas", "O baço"], 1, "Os rins filtram o sangue, tiram as substâncias que sobram e formam a urina, que vai pra bexiga."],
            ["Qual é a função dos glóbulos vermelhos (hemácias)?", ["Defender o corpo de micróbios", "Transportar oxigênio", "Fazer a coagulação", "Digerir alimentos"], 1, "As hemácias têm hemoglobina, que se liga ao oxigênio e o leva dos pulmões até as células."],
            ["Quais células do sangue defendem o corpo contra infecções?", ["As hemácias", "As plaquetas", "Os glóbulos brancos (leucócitos)", "Os neurônios"], 2, "Os leucócitos são o \"exército\" do sistema imunológico. As plaquetas ajudam a fechar machucados (coagulação)."],
            ["Quantos ossos tem o esqueleto de um adulto, aproximadamente?", ["Cerca de 50", "Cerca de 206", "Cerca de 1000", "Cerca de 12"], 1, "O adulto tem cerca de 206 ossos. O bebê nasce com mais, que vão se juntando durante o crescimento."],
            ["Qual sistema comanda o corpo e é formado pelo cérebro, pela medula e pelos nervos?", ["O sistema digestório", "O sistema nervoso", "O sistema urinário", "O sistema respiratório"], 1, "O sistema nervoso recebe as informações dos sentidos e manda as ordens pros músculos e órgãos, através de células chamadas neurônios."],
            ["Como as vacinas protegem o corpo?", ["Matam todos os micróbios do corpo na hora", "Ensinam o sistema imunológico a reconhecer o micróbio antes de uma infecção de verdade", "Substituem o sangue", "Funcionam como um antibiótico"], 1, "A vacina mostra ao corpo um micróbio enfraquecido, inativado ou só um pedaço dele. O sistema imune cria anticorpos e \"memória\" pra reagir rápido depois."],
        ],
    }),
    quizMission({
        subject: "biologia",
        level: 10,
        title: "Biologia: Ecologia e Cadeias Alimentares",
        icon: "🌳",
        description: "Ecossistemas, cadeias alimentares, fotossíntese e os biomas do Brasil",
        item: { name: "Muda de Ipê", icon: "🌳", description: "Uma árvore pequenininha pronta pra crescer. Usar dá XP de quem cuida do ecossistema." },
        questions: [
            ["Numa cadeia alimentar, quem são os produtores?", ["Os animais carnívoros", "As plantas e as algas, que fazem o próprio alimento", "Os fungos", "Os herbívoros"], 1, "Os produtores fazem o próprio alimento pela fotossíntese e são a base de toda cadeia alimentar."],
            ["Na cadeia capim → gafanhoto → sapo → cobra, o sapo é:", ["Produtor", "Consumidor primário", "Consumidor secundário", "Decompositor"], 2, "O gafanhoto come o produtor (capim) e é consumidor primário; o sapo come o gafanhoto e é consumidor secundário; a cobra, terciário."],
            ["Qual é o papel dos decompositores, como fungos e bactérias?", ["Produzir oxigênio à noite", "Decompor restos de seres vivos e devolver nutrientes ao solo", "Caçar herbívoros", "Fazer fotossíntese"], 1, "Sem decompositores, os restos de plantas e animais se acumulariam e os nutrientes não voltariam pro solo."],
            ["Na fotossíntese, a planta usa luz, água e gás carbônico para produzir:", ["Glicose e oxigênio", "Gás carbônico e água", "Sal e ferro", "Proteínas e nitrogênio"], 0, "A fotossíntese transforma a energia da luz em energia química, guardada na glicose, e solta oxigênio no ar."],
            ["O que é um ecossistema?", ["Só os animais de um lugar", "O conjunto dos seres vivos de um lugar e do ambiente onde vivem, interagindo", "Uma espécie de planta", "Um tipo de clima"], 1, "O ecossistema junta a parte viva (biótica) e a não viva (abiótica: água, luz, solo, temperatura) e as relações entre elas."],
            ["Qual bioma brasileiro é a maior floresta tropical do mundo?", ["Caatinga", "Cerrado", "Amazônia", "Pampa"], 2, "A Amazônia tem uma biodiversidade enorme e cobre boa parte do Norte do Brasil e de outros países da América do Sul."],
            ["Qual bioma é exclusivamente brasileiro e tem plantas adaptadas à seca, como o mandacaru?", ["A Caatinga", "A Mata Atlântica", "O Pantanal", "A Amazônia"], 0, "A Caatinga, no Nordeste, só existe no Brasil. As plantas guardam água e perdem as folhas na seca pra economizar."],
            ["A relação entre a abelha, que leva pólen, e a flor, que dá néctar, em que as duas ganham, é chamada de:", ["Predatismo", "Parasitismo", "Mutualismo", "Competição"], 2, "No mutualismo as duas espécies se beneficiam. No parasitismo uma ganha e a outra perde; no predatismo uma come a outra."],
            ["O carrapato que suga o sangue de um cachorro é um exemplo de:", ["Mutualismo", "Parasitismo", "Comensalismo", "Produção"], 1, "O carrapato (parasita) se beneficia e o cachorro (hospedeiro) é prejudicado: isso é parasitismo."],
            ["Qual é a principal causa do aquecimento global atual?", ["O aumento de gases do efeito estufa, como o gás carbônico, liberados pela queima de combustíveis fósseis e pelo desmatamento", "A Lua se aproximando da Terra", "Os vulcões apagados", "O buraco nos pulmões dos animais"], 0, "O efeito estufa é natural e mantém a Terra habitável, mas o excesso de gases emitidos pelas atividades humanas está aquecendo o planeta."],
        ],
    }),
    quizMission({
        subject: "biologia",
        level: 15,
        title: "Biologia: Genética e DNA",
        icon: "🧬",
        description: "DNA, genes, cromossomos e as leis de Mendel",
        item: { name: "Hélice de DNA", icon: "🧬", description: "Uma escada torcida de cristal com o seu código guardado. Usar dá XP de quem decifra a herança." },
        questions: [
            ["O que é o DNA?", ["Uma vitamina", "A molécula que guarda as informações genéticas dos seres vivos", "Um tipo de célula do sangue", "Um órgão do corpo"], 1, "O DNA guarda, em sequências de bases químicas, as instruções pra construir e fazer funcionar o organismo."],
            ["Qual é o formato da molécula de DNA?", ["Um círculo", "Uma dupla hélice, como uma escada torcida", "Um quadrado", "Uma linha reta"], 1, "Em 1953, Watson e Crick, com base nas imagens de Rosalind Franklin, descreveram o DNA como uma dupla hélice."],
            ["Quais são as quatro bases nitrogenadas do DNA?", ["Adenina, timina, citosina e guanina", "Ferro, cálcio, sódio e potássio", "Oxigênio, hidrogênio, carbono e nitrogênio", "Uracila, ribose, fosfato e glicose"], 0, "As bases são A, T, C e G. No DNA, A pareia com T e C pareia com G. No RNA, a timina é trocada pela uracila."],
            ["Quantos cromossomos tem uma célula comum do corpo humano?", ["23", "46", "12", "100"], 1, "São 46 cromossomos, em 23 pares: um cromossomo de cada par vem da mãe e o outro do pai. Os gametas (óvulo e espermatozoide) têm 23."],
            ["O que é um gene?", ["Um trecho do DNA com a informação para uma característica ou proteína", "Uma célula do sangue", "Um tipo de vírus", "O núcleo inteiro da célula"], 0, "Os genes são \"receitas\" escritas no DNA. Cada um geralmente guarda a informação pra fabricar uma proteína."],
            ["Quem é considerado o pai da genética, por estudar a herança em ervilhas?", ["Charles Darwin", "Gregor Mendel", "Louis Pasteur", "Isaac Newton"], 1, "Gregor Mendel cruzou ervilhas no século XIX e descobriu como as características passam de pais pra filhos."],
            ["Um gene recessivo só se manifesta quando:", ["Aparece uma vez só", "O indivíduo tem duas cópias dele (aa)", "Está junto de um dominante (Aa)", "A pessoa é adulta"], 1, "O alelo dominante (A) aparece mesmo com uma cópia. O recessivo (a) só aparece em dose dupla: aa."],
            ["No cruzamento Aa × Aa, qual a chance de nascer um filho aa?", ["0%", "25%", "50%", "100%"], 1, "O quadro de Punnett dá AA, Aa, Aa e aa: 1 em 4, ou seja, 25%. A chance de ter a característica dominante é de 75%."],
            ["Qual par de cromossomos sexuais tem, normalmente, uma pessoa do sexo masculino?", ["XX", "XY", "YY", "X sozinho"], 1, "Em geral, XX no sexo feminino e XY no masculino. O espermatozoide é que leva X ou Y e define o sexo biológico."],
            ["O que é uma mutação?", ["Uma mudança na sequência do DNA", "Um superpoder de filme", "O crescimento normal do corpo", "Uma vacina"], 0, "Mutações são alterações no DNA. Podem ser prejudiciais, neutras ou até vantajosas, e são a fonte da variabilidade que a evolução usa."],
        ],
    }),
    quizMission({
        subject: "biologia",
        level: 20,
        title: "Biologia: Evolução e Biotecnologia",
        icon: "🦠",
        description: "Darwin, seleção natural, classificação dos seres vivos e biotecnologia",
        item: { name: "Diário de Bordo do Beagle", icon: "📔", description: "As anotações de uma viagem que mudou a ciência. Usar dá XP de quem entende como as espécies mudam." },
        questions: [
            ["Quem propôs a teoria da evolução por seleção natural?", ["Gregor Mendel", "Charles Darwin (e, ao mesmo tempo, Alfred Wallace)", "Lamarck", "Louis Pasteur"], 1, "Darwin publicou A Origem das Espécies em 1859. Wallace chegou à mesma ideia de forma independente."],
            ["O que diz a seleção natural?", ["Os indivíduos mais adaptados ao ambiente tendem a sobreviver e a deixar mais descendentes", "Os seres vivos mudam porque querem", "Todos os indivíduos sobrevivem igualmente", "O ambiente nunca muda"], 0, "As variações vantajosas passam mais vezes pras próximas gerações, e assim a população muda ao longo do tempo."],
            ["Lamarck acreditava que a girafa tinha pescoço longo porque esticava o pescoço e passava isso aos filhos. Por que essa ideia foi descartada?", ["Porque características adquiridas durante a vida não passam pelos genes para os filhos", "Porque girafas não têm pescoço", "Porque Darwin não gostava dele", "Porque girafas não têm filhos"], 0, "Se você malha e fica forte, seus filhos não nascem fortes por isso. Só o que está no DNA dos gametas é herdado."],
            ["Por que o uso exagerado de antibióticos pode criar bactérias resistentes?", ["O remédio ensina as bactérias a ficarem fortes", "As bactérias que já eram resistentes sobrevivem e se multiplicam: é a seleção natural", "Os antibióticos viram bactérias", "Não existe resistência a antibióticos"], 1, "O antibiótico mata as sensíveis e sobram as resistentes, que viram a maioria. Por isso o tratamento deve ser feito só com receita e até o fim."],
            ["O que são fósseis?", ["Restos ou marcas de seres vivos que viveram há muito tempo, preservados em rochas", "Pedras preciosas", "Animais que hibernam", "Plantas de plástico"], 0, "Os fósseis mostram como eram os seres do passado e são uma das principais evidências da evolução."],
            ["Na classificação dos seres vivos, como se escreve corretamente o nome científico do ser humano?", ["Homo sapiens", "homo Sapiens", "HOMO SAPIENS", "Sapiens homo"], 0, "Pelo sistema de Lineu, o nome tem o gênero com inicial maiúscula e a espécie em minúscula, em itálico (ou sublinhado): Homo sapiens."],
            ["Do grupo mais amplo para o mais restrito, qual é a ordem correta?", ["Reino, filo, classe, ordem, família, gênero, espécie", "Espécie, gênero, reino, filo", "Família, reino, espécie, classe", "Filo, espécie, reino, ordem"], 0, "Reino é o grupo maior e espécie o mais específico. Um macete: \"Rei Filipe Classificou a Ordem da Família do Gênero Espécie\"."],
            ["O que é um organismo transgênico?", ["Um ser vivo que recebeu um gene de outra espécie por engenharia genética", "Um animal que muda de cor", "Um ser vivo clonado", "Um vírus"], 0, "Um exemplo é a bactéria que recebeu o gene humano da insulina e passou a produzir insulina pra quem tem diabetes."],
            ["A ovelha Dolly, de 1996, ficou famosa por ser:", ["O primeiro mamífero clonado a partir de uma célula de um adulto", "A ovelha mais velha do mundo", "Um animal transgênico verde", "A primeira ovelha a ir ao espaço"], 0, "Dolly foi clonada a partir de uma célula da glândula mamária de uma ovelha adulta, na Escócia."],
            ["Os seres humanos e os chimpanzés:", ["Descendem um do outro: o humano veio do chimpanzé", "Têm um ancestral comum que viveu há milhões de anos", "Não têm nenhum parentesco", "São a mesma espécie"], 1, "O ser humano não veio do chimpanzé: as duas espécies são \"primas\", descendentes de um ancestral comum que viveu há uns 6 a 7 milhões de anos."],
        ],
    }),
]

export default missions
