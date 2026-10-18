import { MissionContent } from "../../../src/engine/missions";
import { quizMission } from "./quiz-materia";

// Mais 5 missões de Biologia (tomo de Biologia), nos níveis 1, 5, 10, 15 e 20:
// plantas, reino animal, microrganismos e saúde, hormônios e reprodução, e
// divisão celular e síntese de proteínas. Não repetem as perguntas de biologia.ts.
// Importar com:
//   npm run missions:import -- <e-mail do professor> scripts/missions/biologia-parte-2.ts
const missions: MissionContent[] = [
    quizMission({
        subject: "biologia",
        level: 1,
        title: "Biologia: O Mundo das Plantas",
        icon: "🌱",
        description: "Raiz, caule, folha, flor, fruto e os grupos de plantas",
        item: { name: "Semente Encantada", icon: "🌱", description: "Uma semente que brota na palma da mão. Usar dá XP de quem cuida das plantas." },
        questions: [
            ["Qual parte da planta absorve a água e os sais minerais do solo?", ["A raiz", "A flor", "A folha", "O fruto"], 0, "A raiz também fixa a planta no solo. Algumas, como a cenoura, guardam reservas de alimento."],
            ["Como se chama o pigmento verde das folhas que captura a luz do Sol?", ["Clorofila", "Hemoglobina", "Melanina", "Caroteno"], 0, "A clorofila fica nos cloroplastos e é essencial para a planta fazer o próprio alimento."],
            ["Qual é a principal função da flor?", ["A reprodução da planta", "Absorver água", "Fazer sombra", "Guardar o caule"], 0, "Na flor ficam as estruturas reprodutoras; depois da fecundação, ela pode virar fruto."],
            ["O que é polinização?", ["O transporte do pólen até a parte feminina da flor", "A queda das folhas no outono", "A rega das plantas", "O crescimento da raiz"], 0, "Abelhas, beija-flores, morcegos, o vento e a água podem levar o pólen."],
            ["O que se forma a partir do ovário da flor depois da fecundação?", ["O fruto", "A raiz", "O caule", "A folha"], 0, "O fruto protege as sementes e ajuda a espalhá-las."],
            ["Qual grupo de plantas não tem vasos condutores e vive em lugares úmidos, como os musgos?", ["Briófitas", "Angiospermas", "Gimnospermas", "Pteridófitas"], 0, "Sem vasos para levar água, as briófitas são pequenas e ficam perto do chão úmido."],
            ["As samambaias têm vasos condutores, mas não têm sementes. A que grupo pertencem?", ["Pteridófitas", "Briófitas", "Angiospermas", "Gimnospermas"], 0, "Elas se reproduzem por esporos, que aparecem como pontinhos marrons embaixo das folhas."],
            ["O pinheiro-do-paraná (araucária) tem sementes (o pinhão), mas não forma frutos. Qual é o seu grupo?", ["Gimnospermas", "Angiospermas", "Briófitas", "Pteridófitas"], 0, "Gimnosperma quer dizer \"semente nua\": a semente não fica dentro de um fruto."],
            ["Qual grupo de plantas tem flores e frutos, como a laranjeira e o feijão?", ["Angiospermas", "Gimnospermas", "Briófitas", "Pteridófitas"], 0, "As angiospermas são o maior grupo de plantas do planeta."],
            ["Por que as plantas são importantes para os outros seres vivos?", ["Produzem alimento e liberam oxigênio", "Consomem todo o oxigênio do ar", "Aumentam a poluição", "Não têm importância"], 0, "Elas estão na base das cadeias alimentares e ajudam a manter o ar e o clima."],
        ],
    }),
    quizMission({
        subject: "biologia",
        level: 5,
        title: "Biologia: O Reino Animal",
        icon: "🦁",
        description: "Vertebrados, invertebrados e as características de cada grupo",
        item: { name: "Guia de Campo dos Animais", icon: "🐾", description: "Um caderninho com pegadas de todos os bichos. Usar dá XP de quem conhece a fauna." },
        questions: [
            ["O que diferencia os animais vertebrados dos invertebrados?", ["Os vertebrados têm coluna vertebral e crânio", "Os vertebrados são sempre maiores", "Os invertebrados não se movem", "Os invertebrados vivem só no mar"], 0, "Peixes, anfíbios, répteis, aves e mamíferos são vertebrados. Insetos e minhocas são invertebrados."],
            ["Qual característica é exclusiva dos mamíferos?", ["Glândulas mamárias que produzem leite", "Botar ovos", "Ter penas", "Respirar por brânquias"], 0, "Alguns mamíferos, como o ornitorrinco, até botam ovos, mas todos amamentam os filhotes."],
            ["Os sapos nascem como girinos na água e depois vivem na terra. Como se chama essa transformação?", ["Metamorfose", "Mutação", "Fotossíntese", "Hibernação"], 0, "Os anfíbios passam por metamorfose: os girinos têm brânquias e cauda, e os adultos têm pulmões e patas."],
            ["Como os peixes respiram?", ["Por brânquias, que retiram o oxigênio dissolvido na água", "Por pulmões, como nós", "Pela pele apenas", "Não respiram"], 0, "A água passa pelas brânquias, onde o oxigênio entra no sangue."],
            ["Quantas patas tem um inseto adulto?", ["6", "8", "4", "10"], 0, "Insetos têm 6 patas e o corpo dividido em cabeça, tórax e abdômen."],
            ["Aranhas e escorpiões têm 8 patas. A que grupo pertencem?", ["Aracnídeos", "Insetos", "Crustáceos", "Moluscos"], 0, "Aracnídeos não têm antenas e têm o corpo dividido em cefalotórax e abdômen."],
            ["O polvo, a lula e o caracol fazem parte de qual grupo?", ["Moluscos", "Insetos", "Anfíbios", "Peixes"], 0, "Os moluscos têm corpo mole; alguns têm concha, como o caracol."],
            ["Qual destes animais é um réptil?", ["Jacaré", "Golfinho", "Pinguim", "Sapo"], 0, "Répteis têm pele seca com escamas ou placas. O golfinho é mamífero, o pinguim é ave e o sapo, anfíbio."],
            ["A estrela-do-mar e o ouriço-do-mar fazem parte de qual grupo de invertebrados?", ["Equinodermos", "Insetos", "Aracnídeos", "Anelídeos"], 0, "Equinodermo quer dizer \"pele com espinhos\". Todos vivem no mar."],
            ["Qual característica é típica das aves?", ["Corpo coberto de penas e bico sem dentes", "Corpo coberto de escamas", "Respiração por brânquias", "Amamentação dos filhotes"], 0, "Nem toda ave voa: o avestruz e o pinguim são aves que não voam."],
        ],
    }),
    quizMission({
        subject: "biologia",
        level: 10,
        title: "Biologia: Microrganismos e Saúde",
        icon: "🦠",
        description: "Vírus, bactérias, protozoários, fungos e as doenças que causam",
        item: { name: "Frasco de Penicilina", icon: "🧫", description: "O remédio que veio de um fungo. Usar dá XP de quem cuida da saúde." },
        questions: [
            ["Qual mosquito transmite a dengue, a zika e a chikungunya?", ["Aedes aegypti", "Anopheles", "Barbeiro", "Mosca-doméstica"], 0, "O Aedes se reproduz em água parada. Por isso é importante não deixar água acumulada em vasos e pneus."],
            ["A malária é causada por qual tipo de microrganismo?", ["Protozoário (Plasmodium)", "Vírus", "Bactéria", "Fungo"], 0, "O protozoário é transmitido pela picada do mosquito Anopheles."],
            ["Por que os antibióticos não curam gripes e resfriados?", ["Porque essas doenças são causadas por vírus, e antibióticos agem contra bactérias", "Porque gripe não é doença", "Porque os antibióticos são fracos demais", "Porque a gripe é causada por fungos"], 0, "Usar antibiótico sem necessidade também ajuda a criar bactérias resistentes."],
            ["Quem descobriu a penicilina, o primeiro antibiótico, a partir de um fungo, em 1928?", ["Alexander Fleming", "Louis Pasteur", "Oswaldo Cruz", "Charles Darwin"], 0, "Fleming percebeu que um bolor (Penicillium) matava as bactérias da sua placa de cultura."],
            ["Qual inseto transmite a doença de Chagas?", ["O barbeiro", "O Aedes aegypti", "A pulga", "A abelha"], 0, "A doença leva o nome de Carlos Chagas, cientista brasileiro que a descreveu em 1909."],
            ["Qual destes alimentos é produzido com a ajuda de bactérias?", ["Iogurte", "Arroz cru", "Sal", "Açúcar"], 0, "Bactérias fermentam o leite e produzem o iogurte. Nem todo microrganismo faz mal!"],
            ["Qual é a diferença entre soro e vacina?", ["O soro traz anticorpos prontos para tratar; a vacina ensina o corpo a produzir os próprios anticorpos", "São a mesma coisa", "O soro previne e a vacina cura", "A vacina é feita de remédio e o soro de vitaminas"], 0, "O soro antiofídico, contra veneno de cobra, é aplicado depois da picada. O Instituto Butantan produz vários."],
            ["Qual medida ajuda mais a prevenir verminoses?", ["Saneamento básico, lavar as mãos e os alimentos", "Tomar sol", "Comer muito doce", "Usar casaco"], 0, "Muitos vermes entram no corpo por água e alimentos contaminados ou pela pele, no solo sujo."],
            ["O vírus HIV ataca principalmente qual sistema do corpo?", ["O sistema imunológico", "O sistema digestório", "O sistema esquelético", "O sistema respiratório"], 0, "Sem tratamento, o HIV enfraquece as defesas do corpo. Hoje há tratamento gratuito no SUS."],
            ["Qual cientista brasileiro comandou campanhas contra a febre amarela e a varíola no Rio de Janeiro, no começo do século XX?", ["Oswaldo Cruz", "Santos Dumont", "Vital Brazil", "Carlos Drummond"], 0, "Oswaldo Cruz dá nome à Fiocruz, um dos maiores centros de pesquisa em saúde da América Latina."],
        ],
    }),
    quizMission({
        subject: "biologia",
        level: 15,
        title: "Biologia: Hormônios e Reprodução",
        icon: "🧪",
        description: "Glândulas, hormônios, puberdade e reprodução humana",
        item: { name: "Ampulheta do Crescimento", icon: "⏳", description: "Marca o tempo das grandes mudanças do corpo. Usar dá XP de quem entende o próprio corpo." },
        questions: [
            ["Qual glândula produz a insulina, que controla o açúcar no sangue?", ["Pâncreas", "Tireoide", "Hipófise", "Suprarrenal"], 0, "Na diabetes tipo 1, o pâncreas quase não produz insulina, e a pessoa precisa aplicá-la."],
            ["Qual hormônio é liberado em situações de susto ou perigo, acelerando o coração?", ["Adrenalina", "Insulina", "Estrogênio", "Melatonina"], 0, "A adrenalina, das glândulas suprarrenais, prepara o corpo para \"lutar ou fugir\"."],
            ["Qual glândula é chamada de \"glândula mestra\", porque controla várias outras?", ["Hipófise", "Pâncreas", "Tireoide", "Glândula salivar"], 0, "A hipófise fica na base do cérebro e produz, por exemplo, o hormônio do crescimento."],
            ["Qual hormônio, produzido principalmente nos testículos, está ligado às características masculinas da puberdade?", ["Testosterona", "Estrogênio", "Insulina", "Ocitocina"], 0, "Na puberdade, a testosterona engrossa a voz e faz crescer pelos, por exemplo."],
            ["Quais hormônios, produzidos nos ovários, regulam o ciclo menstrual?", ["Estrogênio e progesterona", "Insulina e glucagon", "Adrenalina e cortisol", "Testosterona e melatonina"], 0, "Esses hormônios preparam o útero todos os meses para uma possível gravidez."],
            ["O que é a fecundação?", ["A união do espermatozoide com o óvulo, formando o zigoto", "O nascimento do bebê", "A produção de leite", "A primeira menstruação"], 0, "Na espécie humana, ela costuma acontecer nas tubas uterinas."],
            ["Qual órgão liga o bebê à mãe durante a gravidez e permite a troca de nutrientes e oxigênio?", ["A placenta", "O fígado", "O estômago", "O pulmão"], 0, "Pelo cordão umbilical, o sangue do bebê vai até a placenta e volta com nutrientes e oxigênio."],
            ["Qual método protege ao mesmo tempo contra a gravidez e contra infecções sexualmente transmissíveis (ISTs)?", ["O preservativo (camisinha)", "A pílula anticoncepcional", "O DIU", "A tabelinha"], 0, "Os outros métodos evitam a gravidez, mas não protegem contra as ISTs."],
            ["A glândula tireoide fica no pescoço. O que ela regula?", ["O metabolismo, isto é, o ritmo de funcionamento do corpo", "A visão", "A produção de leite", "O crescimento do cabelo apenas"], 0, "O iodo do sal de cozinha é necessário para a tireoide produzir os seus hormônios."],
            ["Qual hormônio, produzido no escuro, ajuda a regular o sono?", ["Melatonina", "Adrenalina", "Insulina", "Testosterona"], 0, "A luz das telas à noite pode atrapalhar a produção de melatonina e o sono."],
        ],
    }),
    quizMission({
        subject: "biologia",
        level: 20,
        title: "Biologia: Divisão Celular e Síntese de Proteínas",
        icon: "🔬",
        description: "Mitose, meiose, RNA, proteínas, enzimas e biotecnologia moderna",
        item: { name: "Lâmina de Microscópio Rara", icon: "🔬", description: "Mostra uma célula no exato momento de se dividir. Usar dá XP de cientista." },
        questions: [
            ["O que acontece na mitose?", ["Uma célula se divide em duas células iguais à original", "Formam-se os gametas", "A célula morre", "Dois gametas se unem"], 0, "A mitose faz o corpo crescer e repõe células, como na cicatrização de um machucado."],
            ["O que acontece na meiose?", ["Formam-se quatro células com metade dos cromossomos, que dão origem aos gametas", "Formam-se duas células idênticas", "A célula dobra de tamanho", "O DNA é destruído"], 0, "Assim, na fecundação, o zigoto volta a ter o número completo de cromossomos."],
            ["Qual molécula leva a \"receita\" do DNA, no núcleo, até os ribossomos, no citoplasma?", ["RNA mensageiro", "Glicose", "ATP", "Clorofila"], 0, "O DNA é transcrito em RNA mensageiro, que é lido pelos ribossomos."],
            ["Em qual estrutura da célula as proteínas são montadas?", ["Nos ribossomos", "Nos vacúolos", "Na parede celular", "Nos cloroplastos"], 0, "Os ribossomos unem os aminoácidos na ordem indicada pelo RNA mensageiro."],
            ["As proteínas são formadas pela união de quais moléculas?", ["Aminoácidos", "Açúcares simples", "Ácidos graxos", "Sais minerais"], 0, "Existem 20 tipos principais de aminoácidos, que se combinam em milhares de proteínas."],
            ["Quantas bases nitrogenadas formam um códon, a \"palavra\" do código genético?", ["3", "1", "2", "4"], 0, "Cada códon do RNA mensageiro indica um aminoácido (ou o sinal de parar)."],
            ["O que são enzimas?", ["Proteínas que aceleram as reações químicas do organismo", "Vitaminas que vêm das frutas", "Células do sangue", "Tipos de vírus"], 0, "A amilase da saliva, por exemplo, começa a digerir o amido."],
            ["O que são células-tronco?", ["Células que podem se transformar em vários tipos de células do corpo", "Células das árvores", "Células mortas", "Células só do sangue"], 0, "Por isso são estudadas para tratar doenças e regenerar tecidos."],
            ["O que é a técnica CRISPR?", ["Uma ferramenta que permite editar trechos do DNA com precisão", "Um tipo de microscópio", "Uma vacina", "Um exame de sangue"], 0, "As cientistas Emmanuelle Charpentier e Jennifer Doudna ganharam o Nobel de Química de 2020 por ela."],
            ["O teste de PCR, muito usado na pandemia, detecta o quê?", ["O material genético do vírus na amostra", "A temperatura do corpo", "A quantidade de açúcar no sangue", "O tipo sanguíneo"], 0, "O PCR multiplica trechos do material genético até que fiquem detectáveis."],
        ],
    }),
]

export default missions
