import { MissionContent } from "../../../src/engine/missions";
import { quizMission } from "./quiz-materia";

// Mais 5 missões de Inglês (tomo de Inglês), nos níveis 1, 5, 10, 15 e 20:
// família e casa, comida e there is/are, present continuous e preposições,
// present perfect, e condicionais, voz passiva e phrasal verbs. Os enunciados
// são em português. Não repetem as perguntas de ingles.ts.
// Importar com:
//   npm run missions:import -- <e-mail do professor> scripts/missions/ingles-parte-2.ts
const missions: MissionContent[] = [
    quizMission({
        subject: "ingles",
        level: 1,
        title: "Inglês: Family and Home",
        icon: "🏠",
        description: "A família e os cômodos da casa em inglês",
        item: { name: "Álbum de Família", icon: "📸", description: "Fotos da família com as legendas em inglês. Usar dá XP de quem fala da própria casa." },
        questions: [
            ["Como se diz \"mãe\" em inglês?", ["Mother", "Father", "Sister", "Daughter"], 0, "Mother (mãe), father (pai), sister (irmã), daughter (filha)."],
            ["O que significa \"brother\"?", ["Irmão", "Primo", "Tio", "Avô"], 0, "Primo é cousin, tio é uncle e avô é grandfather."],
            ["Como se diz \"avó\" em inglês?", ["Grandmother", "Granddaughter", "Godmother", "Aunt"], 0, "Grandmother ou grandma. Granddaughter é neta."],
            ["O que significa \"aunt\"?", ["Tia", "Prima", "Avó", "Sobrinha"], 0, "Tio é uncle. Sobrinho é nephew e sobrinha, niece."],
            ["Como se chama a cozinha em inglês?", ["Kitchen", "Bedroom", "Bathroom", "Garden"], 0, "Bedroom é o quarto, bathroom é o banheiro e garden é o jardim."],
            ["O que significa \"living room\"?", ["Sala de estar", "Cozinha", "Garagem", "Quarto"], 0, "É o cômodo onde a família se reúne para conversar e ver TV."],
            ["Como se diz \"cama\" em inglês?", ["Bed", "Chair", "Table", "Door"], 0, "Chair é cadeira, table é mesa e door é porta."],
            ["Complete: \"This is my ___. She is my father's mother.\"", ["grandmother", "sister", "aunt", "cousin"], 0, "A mãe do pai é a avó: grandmother."],
            ["O que significa \"I live in a house with a big garden\"?", ["Eu moro numa casa com um jardim grande", "Eu gosto de jardins grandes", "Eu moro num apartamento pequeno", "Minha casa tem uma garagem"], 0, "Live = morar. Big = grande. Garden = jardim."],
            ["Como se diz \"filho\" (homem) em inglês?", ["Son", "Sun", "Daughter", "Child"], 0, "Son (filho) e sun (sol) têm a mesma pronúncia. Child é criança, e o plural é children."],
        ],
    }),
    quizMission({
        subject: "ingles",
        level: 5,
        title: "Inglês: Food and There Is, There Are",
        icon: "🍎",
        description: "Comidas, refeições, there is/are e how much/how many",
        item: { name: "Lancheira Britânica", icon: "🥪", description: "Um sanduíche e um suco com etiquetas em inglês. Usar dá XP de quem pede comida em inglês." },
        questions: [
            ["Qual é a refeição \"breakfast\"?", ["Café da manhã", "Almoço", "Jantar", "Lanche da tarde"], 0, "Breakfast é o café da manhã, lunch é o almoço e dinner é o jantar."],
            ["Complete: \"There ___ an apple on the table.\"", ["is", "are", "am", "be"], 0, "There is é usado com uma coisa (singular): there is an apple."],
            ["Complete: \"There ___ three bananas in the bag.\"", ["are", "is", "am", "be"], 0, "There are é usado com várias coisas (plural)."],
            ["O que significa \"I'm hungry\"?", ["Estou com fome", "Estou com sede", "Estou cansado", "Estou feliz"], 0, "Thirsty é com sede. Tired é cansado."],
            ["Qual pergunta é correta para algo que se pode contar, como maçãs?", ["How many apples?", "How much apples?", "How many water?", "How much apple are?"], 0, "How many é para coisas contáveis; how much, para incontáveis, como water e sugar."],
            ["Qual pergunta é correta para algo que não se conta em unidades, como água?", ["How much water?", "How many waters?", "How many water?", "How much waters are?"], 0, "Water, milk, rice e sugar são incontáveis: how much."],
            ["Qual é a forma educada de pedir algo num restaurante?", ["Can I have a juice, please?", "Give me juice!", "Juice now!", "I want juice you"], 0, "Can I have... please? é uma forma educada. I'd like... também é muito usada."],
            ["O que é \"chicken\" num cardápio?", ["Frango", "Peixe", "Carne de vaca", "Porco"], 0, "Fish é peixe, beef é carne de vaca e pork é carne de porco."],
            ["Como se diz \"legumes e verduras\" em inglês?", ["Vegetables", "Fruits", "Sweets", "Drinks"], 0, "Fruits são frutas, sweets são doces e drinks, bebidas."],
            ["O que significa \"Is there any milk in the fridge?\"?", ["Tem leite na geladeira?", "O leite está quente?", "Quero leite com chocolate", "A geladeira está vazia"], 0, "Fridge é geladeira. Any é usado em perguntas e frases negativas."],
        ],
    }),
    quizMission({
        subject: "ingles",
        level: 10,
        title: "Inglês: Present Continuous and Prepositions",
        icon: "🏃",
        description: "O que está acontecendo agora e as preposições in, on, at, under",
        item: { name: "Relógio do Agora", icon: "⌚", description: "Sempre marca o momento presente. Usar dá XP de quem conta o que está fazendo." },
        questions: [
            ["Como se forma o present continuous?", ["Verbo to be + verbo com -ing", "Verbo com -ed", "Will + verbo", "Have + particípio"], 0, "I am reading. She is playing. They are running."],
            ["Complete: \"Look! The children ___ in the park.\"", ["are playing", "plays", "played", "is play"], 0, "\"Look!\" indica algo acontecendo agora. Com the children (eles), usamos are + playing."],
            ["O que significa \"What are you doing?\"?", ["O que você está fazendo?", "O que você fez?", "O que você vai fazer?", "Onde você está?"], 0, "É a pergunta mais comum com o present continuous."],
            ["Qual é a forma -ing de \"run\"?", ["running", "runing", "runeing", "runnning"], 0, "Verbos curtos terminados em consoante-vogal-consoante dobram a última letra: run → running, swim → swimming."],
            ["Qual é a forma -ing de \"write\"?", ["writing", "writeing", "writting", "writin"], 0, "Verbos terminados em -e perdem o e: write → writing, dance → dancing."],
            ["Complete: \"The cat is ___ the table\" (o gato está embaixo da mesa).", ["under", "on", "in", "at"], 0, "Under é embaixo. On é em cima (encostado), in é dentro."],
            ["Complete: \"My birthday is ___ July.\"", ["in", "on", "at", "under"], 0, "In com meses, anos e estações. On com dias e datas (on Monday). At com horas (at 3 o'clock)."],
            ["Complete: \"The class starts ___ 8 o'clock.\"", ["at", "in", "on", "under"], 0, "At é usado com horários: at 8 o'clock, at noon, at night."],
            ["Complete: \"The book is ___ the desk\" (o livro está em cima da mesa).", ["on", "in", "under", "at"], 0, "On indica uma superfície: on the desk, on the wall, on the floor."],
            ["O que significa \"The bank is between the school and the bakery\"?", ["O banco fica entre a escola e a padaria", "O banco fica atrás da escola", "O banco fica longe da padaria", "O banco fica dentro da escola"], 0, "Between = entre. Next to = ao lado. Behind = atrás. In front of = na frente."],
        ],
    }),
    quizMission({
        subject: "ingles",
        level: 15,
        title: "Inglês: Present Perfect",
        icon: "✅",
        description: "Have/has + particípio, ever, never, already, yet, since e for",
        item: { name: "Diário de Conquistas", icon: "📓", description: "Lista tudo o que você já fez na vida. Usar dá XP de quem fala de experiências em inglês." },
        questions: [
            ["Como se forma o present perfect?", ["Have/has + particípio passado do verbo", "Did + verbo", "Will + verbo", "Am/is/are + -ing"], 0, "I have eaten. She has finished. They have been to London."],
            ["Complete: \"She ___ visited Paris twice.\"", ["has", "have", "is", "did"], 0, "Com he, she e it usamos has; com I, you, we e they, have."],
            ["Qual é o particípio passado de \"eat\"?", ["eaten", "ate", "eated", "eating"], 0, "Eat → ate (passado) → eaten (particípio)."],
            ["Qual é o particípio passado de \"write\"?", ["written", "wrote", "writed", "writing"], 0, "Write → wrote → written."],
            ["O que significa \"Have you ever been to Brazil?\"?", ["Você já esteve no Brasil alguma vez?", "Você vai ao Brasil?", "Você mora no Brasil?", "Você gosta do Brasil?"], 0, "Ever é usado em perguntas sobre experiências de vida."],
            ["O que significa \"I have never seen snow\"?", ["Eu nunca vi neve", "Eu vi neve ontem", "Eu sempre vejo neve", "Eu vou ver neve"], 0, "Never = nunca. O present perfect fala de experiências sem dizer quando aconteceram."],
            ["Complete: \"I have lived here ___ 2015.\"", ["since", "for", "ago", "during"], 0, "Since indica o ponto de partida (desde 2015). For indica a duração (for ten years)."],
            ["Complete: \"We have studied English ___ three years.\"", ["for", "since", "ago", "at"], 0, "For + período de tempo: for three years, for a long time."],
            ["Qual frase usa \"yet\" corretamente?", ["I haven't finished my homework yet.", "I have yet finished my homework.", "Yet I finished my homework.", "I finished yet my homework."], 0, "Yet aparece no fim de frases negativas e perguntas: \"ainda não\"."],
            ["Qual é a diferença entre \"I lost my keys\" e \"I have lost my keys\"?", ["A segunda indica que o resultado continua agora (as chaves ainda estão perdidas)", "Não há diferença nenhuma", "A primeira é futuro", "A segunda é errada"], 0, "O simple past fala de um momento terminado; o present perfect liga o passado ao presente."],
        ],
    }),
    quizMission({
        subject: "ingles",
        level: 20,
        title: "Inglês: Conditionals, Passive and Phrasal Verbs",
        icon: "🧠",
        description: "If clauses, voz passiva e os phrasal verbs mais usados",
        item: { name: "Chave das Expressões", icon: "🗝️", description: "Abre o significado de qualquer phrasal verb. Usar dá XP de quem já é fluente." },
        questions: [
            ["Complete o zero conditional (fatos que sempre acontecem): \"If you heat water to 100 °C, it ___.\"", ["boils", "will boil", "would boil", "boiled"], 0, "No zero conditional, os dois verbos ficam no presente: if you heat... it boils."],
            ["Complete o first conditional: \"If it rains tomorrow, I ___ at home.\"", ["will stay", "stay", "would stay", "stayed"], 0, "First conditional: if + presente, will + verbo. Fala de algo possível no futuro."],
            ["Complete o second conditional (situação imaginária): \"If I ___ rich, I would travel the world.\"", ["were", "am", "will be", "be"], 0, "Second conditional: if + passado, would + verbo. Com o verbo to be, usamos were para todas as pessoas."],
            ["Qual frase em inglês está na voz passiva?", ["The cake was made by my mom.", "My mom made the cake.", "My mom is making a cake.", "My mom will make a cake."], 0, "Voz passiva: verbo to be + particípio (was made), com o agente depois de \"by\"."],
            ["Passe para a voz passiva: \"People speak English all over the world.\"", ["English is spoken all over the world.", "English speaks all over the world.", "English was speak all over the world.", "English is speaking all over the world."], 0, "Presente simples na passiva: is/are + particípio (spoken)."],
            ["O que significa o phrasal verb \"give up\"?", ["Desistir", "Dar um presente", "Levantar", "Devolver"], 0, "\"Don't give up!\" quer dizer \"Não desista!\"."],
            ["O que significa \"look for\"?", ["Procurar", "Olhar para cima", "Cuidar", "Parecer"], 0, "\"I'm looking for my keys\": estou procurando minhas chaves. Look after = cuidar."],
            ["O que significa \"turn on the light\"?", ["Acender a luz", "Apagar a luz", "Trocar a lâmpada", "Olhar para a luz"], 0, "Turn on = ligar; turn off = desligar."],
            ["O que significa \"find out\"?", ["Descobrir", "Perder", "Encontrar alguém por acaso", "Sair"], 0, "\"I found out the truth\": eu descobri a verdade."],
            ["O que significa \"I'm looking forward to the holidays\"?", ["Estou ansioso, esperando as férias com alegria", "Estou olhando as fotos das férias", "Estou com medo das férias", "Estou planejando trabalhar nas férias"], 0, "Look forward to = aguardar algo ansiosamente, com expectativa boa."],
        ],
    }),
]

export default missions
