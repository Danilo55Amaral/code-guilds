import { MissionContent } from "../../../src/engine/missions";
import { quizMission } from "./quiz-materia";

// Missões de Inglês pra Biblioteca de Missões (tomo de Inglês): 5 missões de
// 10 perguntas comentadas, nos níveis 1, 5, 10, 15 e 20, com o conteúdo do
// fundamental e do ensino médio: cumprimentos e vocabulário, verb to be e
// pronomes, simple present, simple past e, por fim, futuro, comparativos e
// leitura. Os enunciados são em português, pra ninguém travar no comando.
// O professor ajusta XP, moedas e itens no painel. Importar com:
//   npm run missions:import -- <e-mail do professor> scripts/missions/ingles.ts
const missions: MissionContent[] = [
    quizMission({
        subject: "ingles",
        level: 1,
        title: "Inglês: Greetings and Colors",
        icon: "👋",
        description: "Cumprimentos, cores, números e os dias da semana",
        item: { name: "Crachá Hello!", icon: "👋", description: "Um crachá que cumprimenta todo mundo em inglês. Usar dá XP de quem já começou a conversar." },
        questions: [
            ["Como se diz \"Bom dia\" em inglês?", ["Good morning", "Good night", "Good afternoon", "Goodbye"], 0, "Good morning é bom dia; good afternoon, boa tarde; good evening, boa noite (ao chegar); good night, boa noite (ao se despedir ou ir dormir)."],
            ["O que significa \"What's your name?\"?", ["Qual é o seu nome?", "Quantos anos você tem?", "Onde você mora?", "Como você está?"], 0, "Pra responder: \"My name is...\" (meu nome é...). \"How old are you?\" é que pergunta a idade."],
            ["Como se responde \"How are you?\" dizendo que está bem?", ["I'm fine, thank you.", "I'm twelve.", "I'm from Brazil.", "My name is Ana."], 0, "\"How are you?\" quer dizer \"Como você está?\". \"I'm fine, thank you\" é \"Estou bem, obrigado\"."],
            ["Qual é a cor \"yellow\"?", ["Amarelo", "Azul", "Verde", "Vermelho"], 0, "Yellow é amarelo. Blue é azul, green é verde e red é vermelho."],
            ["Como se escreve o número 12 em inglês?", ["Twelve", "Twenty", "Two", "Eleven"], 0, "Twelve é 12. Twenty é 20, two é 2 e eleven é 11."],
            ["Qual dia da semana é \"Wednesday\"?", ["Quarta-feira", "Segunda-feira", "Sexta-feira", "Domingo"], 0, "Monday (segunda), Tuesday (terça), Wednesday (quarta), Thursday (quinta), Friday (sexta), Saturday (sábado), Sunday (domingo)."],
            ["O que significa \"See you later!\"?", ["Até mais tarde!", "Bom apetite!", "Muito prazer!", "Com licença!"], 0, "\"See you later\" (ou \"see you\") é um jeito informal de se despedir: até mais, até logo."],
            ["Como se diz \"obrigado\" em inglês?", ["Thank you", "Please", "Sorry", "Excuse me"], 0, "Thank you é obrigado. Please é por favor, sorry é desculpa e excuse me é com licença."],
            ["Qual é o significado de \"Nice to meet you\"?", ["Prazer em conhecer você", "Bom te ver de novo", "Tenha um bom dia", "Até amanhã"], 0, "Usamos \"Nice to meet you\" quando conhecemos alguém pela primeira vez. A resposta pode ser \"Nice to meet you too\"."],
            ["Como se diz \"preto\" em inglês?", ["Black", "White", "Brown", "Gray"], 0, "Black é preto, white é branco, brown é marrom e gray (ou grey) é cinza."],
        ],
    }),
    quizMission({
        subject: "ingles",
        level: 5,
        title: "Inglês: Verb To Be and Pronouns",
        icon: "🙋",
        description: "Os pronomes pessoais, o verbo to be e os possessivos",
        item: { name: "Dicionário de Bolso", icon: "📘", description: "Um dicionário inglês-português que cabe na palma da mão. Usar dá XP de quem já forma frases." },
        questions: [
            ["Complete: \"She ___ my sister.\"", ["is", "am", "are", "be"], 0, "Com he, she e it, o verbo to be no presente é \"is\": she is (she's)."],
            ["Complete: \"I ___ twelve years old.\"", ["am", "is", "are", "be"], 0, "Com \"I\", o to be é sempre \"am\": I am (I'm). Em inglês, a idade usa o verbo to be, não o \"ter\"."],
            ["Complete: \"They ___ my friends.\"", ["are", "is", "am", "be"], 0, "Com we, you e they, o to be é \"are\": they are (they're)."],
            ["Qual pronome substitui \"the cat\" (o gato)?", ["It", "He", "She", "They"], 0, "\"It\" é usado pra animais (quando não sabemos o sexo ou não importa) e objetos."],
            ["Como fica a negativa de \"He is happy\"?", ["He is not happy.", "He not is happy.", "He don't happy.", "He no is happy."], 0, "Na negativa do to be, o \"not\" vem depois do verbo: he is not (he isn't) happy."],
            ["Como fica a pergunta de \"You are Brazilian\"?", ["Are you Brazilian?", "You are Brazilian?", "Do you Brazilian?", "Is you Brazilian?"], 0, "Na pergunta com to be, o verbo vai pra frente do sujeito: Are you Brazilian?"],
            ["Qual é o pronome possessivo de \"I\"?", ["My", "Me", "Mine", "I'm"], 0, "\"My\" vem antes do substantivo: my book (meu livro). \"Mine\" é usado sozinho: the book is mine."],
            ["Complete: \"This is Maria. ___ dog is very cute.\"", ["Her", "His", "She", "Their"], 0, "Pra algo que pertence a uma mulher, usa-se \"her\". Pra um homem, \"his\": João and his dog."],
            ["O que significa \"We are students\"?", ["Nós somos estudantes", "Eles são estudantes", "Você é estudante", "Eu sou estudante"], 0, "We = nós. They = eles/elas. You = você ou vocês."],
            ["Qual é a forma contraída de \"they are\"?", ["They're", "Their", "There", "Theyr"], 0, "They're = they are. Cuidado: \"their\" é \"deles\" e \"there\" é \"lá\". As três soam parecido!"],
        ],
    }),
    quizMission({
        subject: "ingles",
        level: 10,
        title: "Inglês: Simple Present and Daily Routine",
        icon: "⏰",
        description: "A rotina, o simple present, o do/does e as horas",
        item: { name: "Despertador Britânico", icon: "⏰", description: "Toca \"Good morning!\" todo dia às 7h. Usar dá XP de quem fala da própria rotina em inglês." },
        questions: [
            ["Complete: \"She ___ to school every day.\"", ["goes", "go", "going", "gone"], 0, "No simple present, com he, she e it, o verbo ganha -s ou -es: she goes, he plays, it works."],
            ["Complete: \"I ___ soccer on Saturdays.\"", ["play", "plays", "playing", "played"], 0, "Com I, you, we e they, o verbo fica na forma base, sem -s: I play."],
            ["Como fica a negativa de \"He likes pizza\"?", ["He doesn't like pizza.", "He don't like pizza.", "He doesn't likes pizza.", "He not likes pizza."], 0, "Com he, she e it, a negativa usa \"doesn't\" e o verbo volta à forma base (sem o -s): doesn't like."],
            ["Complete a pergunta: \"___ you speak English?\"", ["Do", "Does", "Are", "Is"], 0, "Pra perguntar no simple present com I, you, we e they usa-se \"do\". Com he, she e it, \"does\": Does she speak English?"],
            ["O que significa \"I wake up at seven o'clock\"?", ["Eu acordo às sete horas", "Eu durmo às sete horas", "Eu almoço às sete horas", "Eu tenho sete relógios"], 0, "Wake up = acordar. \"O'clock\" indica hora cheia: seven o'clock = sete horas."],
            ["O que significa \"brush my teeth\"?", ["Escovar os dentes", "Tomar banho", "Pentear o cabelo", "Lavar as mãos"], 0, "Brush my teeth é escovar os dentes. Take a shower é tomar banho, comb my hair é pentear o cabelo e wash my hands é lavar as mãos."],
            ["Qual palavra completa a frase sobre frequência: \"I ___ eat vegetables\" (eu sempre como verduras)?", ["always", "never", "sometimes", "rarely"], 0, "Always = sempre; usually = geralmente; sometimes = às vezes; rarely = raramente; never = nunca."],
            ["Como é o -s de \"watch\" com he/she/it?", ["watches", "watchs", "watchies", "watch"], 0, "Verbos terminados em -ch, -sh, -ss, -x e -o ganham -es: watches, washes, kisses, fixes, goes."],
            ["Como é o -s de \"study\" com he/she/it?", ["studies", "studys", "studyes", "study"], 0, "Verbos terminados em consoante + y trocam o y por -ies: study → studies, fly → flies. Mas play → plays (vogal + y)."],
            ["O que significa \"What time is it?\"?", ["Que horas são?", "Que dia é hoje?", "Quanto tempo falta?", "Que tempo está fazendo?"], 0, "A resposta pode ser \"It's three o'clock\" (são três horas) ou \"It's half past three\" (três e meia)."],
        ],
    }),
    quizMission({
        subject: "ingles",
        level: 15,
        title: "Inglês: Simple Past",
        icon: "📜",
        description: "O passado: verbos regulares, irregulares e o did",
        item: { name: "Diário de Viagem", icon: "📔", description: "Cada página conta uma aventura no passado, em inglês. Usar dá XP de quem fala do que já aconteceu." },
        questions: [
            ["Qual é o passado de \"play\"?", ["played", "plaied", "playd", "plays"], 0, "Verbos regulares ganham -ed no passado: play → played, watch → watched, walk → walked."],
            ["Qual é o passado de \"go\"?", ["went", "goed", "gone", "goes"], 0, "\"Go\" é irregular: o passado é \"went\". \"Gone\" é o particípio (usado no present perfect: I have gone)."],
            ["Qual é o passado de \"eat\"?", ["ate", "eated", "eaten", "eats"], 0, "Eat → ate (passado) → eaten (particípio). É um verbo irregular, então precisa ser memorizado."],
            ["Complete: \"Yesterday I ___ a great movie.\"", ["saw", "see", "seen", "sees"], 0, "\"Yesterday\" (ontem) pede passado. See é irregular: see → saw → seen."],
            ["Como fica a negativa de \"She visited her grandma\"?", ["She didn't visit her grandma.", "She didn't visited her grandma.", "She doesn't visited her grandma.", "She not visited her grandma."], 0, "Na negativa do passado usa-se \"didn't\" e o verbo volta para a forma base: didn't visit (o did já mostra que é passado)."],
            ["Complete a pergunta: \"___ you finish your homework?\"", ["Did", "Do", "Does", "Were"], 0, "Pra perguntar no passado usa-se \"did\" com todas as pessoas, e o verbo fica na forma base: Did you finish...?"],
            ["Qual é o passado do verbo to be com \"they\"?", ["were", "was", "are", "been"], 0, "No passado do to be: I/he/she/it was; you/we/they were."],
            ["Complete: \"I ___ at home last night.\"", ["was", "were", "am", "be"], 0, "Com I, o passado do to be é \"was\". \"Last night\" (ontem à noite) indica passado."],
            ["Qual é o passado de \"buy\"?", ["bought", "buyed", "brought", "buied"], 0, "Buy → bought (comprou). Cuidado pra não confundir com \"brought\", passado de bring (trazer)."],
            ["O que significa \"two years ago\"?", ["Dois anos atrás", "Daqui a dois anos", "Por dois anos", "A cada dois anos"], 0, "\"Ago\" indica há quanto tempo algo aconteceu e vem depois do tempo: two years ago, five minutes ago."],
        ],
    }),
    quizMission({
        subject: "ingles",
        level: 20,
        title: "Inglês: Future, Comparatives and Reading",
        icon: "🗽",
        description: "Will e going to, comparativos, superlativos, modais e falsos cognatos",
        item: { name: "Passaporte do Poliglota", icon: "🗺️", description: "Carimbado em todos os países onde se fala inglês. Usar dá XP de quem já se vira no idioma." },
        questions: [
            ["Complete com o futuro de um plano já decidido: \"I ___ visit my cousins next weekend.\"", ["am going to", "going to", "will to", "am go to"], 0, "\"Be going to\" é usado pra planos e intenções já decididos: I am going to visit..."],
            ["Qual frase usa \"will\" corretamente?", ["I think it will rain tomorrow.", "I think it will rains tomorrow.", "I think it wills rain tomorrow.", "I think it will to rain tomorrow."], 0, "Depois de \"will\", o verbo fica na forma base, sem -s e sem \"to\": it will rain."],
            ["Qual é o comparativo de \"tall\" (alto)?", ["taller", "more tall", "tallest", "most tall"], 0, "Adjetivos curtos ganham -er no comparativo: tall → taller than (mais alto que)."],
            ["Qual é o comparativo de \"beautiful\"?", ["more beautiful", "beautifuler", "most beautiful", "beautifullest"], 0, "Adjetivos longos usam \"more\": more beautiful than. No superlativo, \"the most\": the most beautiful."],
            ["Qual é o superlativo de \"good\"?", ["the best", "the goodest", "the better", "the most good"], 0, "\"Good\" é irregular: good → better → the best. O mesmo vale pra bad → worse → the worst."],
            ["O que significa \"You should study more\"?", ["Você deveria estudar mais", "Você pode estudar mais", "Você vai estudar mais", "Você estudou mais"], 0, "\"Should\" é um modal de conselho: deveria. \"Can\" é poder ou saber fazer e \"must\" é obrigação forte."],
            ["\"Can you swim?\" pergunta se a pessoa:", ["Sabe (consegue) nadar", "Gosta de nadar", "Nadou ontem", "Vai nadar amanhã"], 0, "\"Can\" indica habilidade ou permissão. A resposta curta é \"Yes, I can\" ou \"No, I can't\"."],
            ["\"Pretend\" é um falso cognato. O que ele significa?", ["Fingir", "Pretender", "Prender", "Pretexto"], 0, "Falsos cognatos parecem palavras em português mas têm outro significado. \"Pretender\" (ter intenção) em inglês é \"intend\"."],
            ["E \"push\", escrito em muitas portas, significa:", ["Empurre", "Puxe", "Feche", "Abra"], 0, "\"Push\" é empurrar, apesar de parecer \"puxar\". Puxar é \"pull\"."],
            ["Leia: \"Tom has a dog and a cat. The dog is bigger than the cat, but the cat is older.\" Qual frase está correta?", ["O gato é mais velho que o cachorro", "O gato é maior que o cachorro", "O cachorro é mais velho que o gato", "Tom tem dois cachorros"], 0, "\"Bigger\" é maior (o cachorro) e \"older\" é mais velho (o gato). Ler com atenção os comparativos resolve a questão."],
        ],
    }),
]

export default missions
