import { MissionContent } from "../../../src/engine/missions";
import { quizMission } from "./quiz-materia";

// Missões de Língua Portuguesa pra Biblioteca de Missões (tomo de Língua
// Portuguesa): 5 missões de 10 perguntas comentadas, nos níveis 1, 5, 10, 15 e
// 20, com o conteúdo do fundamental e do ensino médio: classes de palavras,
// ortografia e acentuação, pontuação e concordância, figuras de linguagem e
// literatura brasileira.
// O professor ajusta XP, moedas e itens no painel. Importar com:
//   npm run missions:import -- <e-mail do professor> scripts/missions/lingua-portuguesa.ts
const missions: MissionContent[] = [
    quizMission({
        subject: "portugues",
        level: 1,
        title: "Língua Portuguesa: Classes de Palavras",
        icon: "📝",
        description: "Substantivo, adjetivo, verbo, pronome e advérbio",
        item: { name: "Caderno de Caligrafia", icon: "📒", description: "Cada palavra escrita nele fica no lugar certo. Usar dá XP de quem conhece as classes de palavras." },
        questions: [
            ["Qual palavra é um substantivo na frase \"O cachorro latiu alto\"?", ["Cachorro", "Latiu", "Alto", "O"], 0, "Substantivo é a palavra que dá nome a seres, objetos, lugares e sentimentos: cachorro."],
            ["Na frase \"A menina comprou uma bicicleta azul\", qual palavra é um adjetivo?", ["Menina", "Comprou", "Azul", "Uma"], 2, "O adjetivo dá uma característica ao substantivo: a bicicleta é azul."],
            ["Qual destas palavras é um verbo?", ["Correr", "Rápido", "Casa", "Feliz"], 0, "O verbo indica ação, estado ou fenômeno da natureza. No infinitivo, termina em -ar, -er ou -ir: correr."],
            ["\"Brasil\", \"Maria\" e \"Amazonas\" são substantivos:", ["Próprios", "Comuns", "Coletivos", "Abstratos"], 0, "Os substantivos próprios nomeiam um ser ou lugar específico e começam com letra maiúscula."],
            ["Qual é o coletivo de lobos?", ["Alcateia", "Cardume", "Enxame", "Rebanho"], 0, "Alcateia é o grupo de lobos. Cardume é de peixes, enxame é de abelhas e rebanho é de gado (ou ovelhas)."],
            ["Na frase \"Ela chegou cedo\", qual palavra é um pronome?", ["Ela", "Chegou", "Cedo", "Nenhuma"], 0, "O pronome substitui ou acompanha o substantivo. \"Ela\" é pronome pessoal do caso reto."],
            ["Na frase \"Ele corre muito rápido\", a palavra \"muito\" é um:", ["Advérbio", "Substantivo", "Verbo", "Artigo"], 0, "O advérbio modifica o verbo, o adjetivo ou outro advérbio. Aqui, \"muito\" intensifica o advérbio \"rápido\"."],
            ["Quais são os artigos definidos?", ["O, a, os, as", "Um, uma, uns, umas", "Eu, tu, ele", "De, em, por"], 0, "Os artigos definidos (o, a, os, as) indicam algo específico; os indefinidos (um, uma, uns, umas), algo qualquer."],
            ["\"Saudade\", \"alegria\" e \"coragem\" são substantivos:", ["Abstratos", "Concretos", "Próprios", "Coletivos"], 0, "Substantivos abstratos nomeiam sentimentos, estados e ações que não existem por si só, como saudade e coragem."],
            ["Na frase \"Ontem nós fomos ao parque\", o verbo \"fomos\" está em qual tempo?", ["Pretérito (passado)", "Presente", "Futuro", "Infinitivo"], 0, "\"Ontem\" já dá a pista: \"fomos\" é o verbo ir no pretérito perfeito, uma ação que já terminou."],
        ],
    }),
    quizMission({
        subject: "portugues",
        level: 5,
        title: "Língua Portuguesa: Ortografia e Acentuação",
        icon: "✒️",
        description: "Escrita correta, acentos e as palavras que confundem",
        item: { name: "Pena de Escritor", icon: "✒️", description: "Uma pena que nunca erra o acento. Usar dá XP de quem escreve sem erros." },
        questions: [
            ["Qual destas palavras está escrita corretamente?", ["Exceção", "Excessão", "Esceção", "Exseção"], 0, "O certo é exceção, com xc e ç. Já \"excesso\" é com ss. Vale a pena decorar os dois."],
            ["Qual é a forma correta?", ["Por que você não veio?", "Porque você não veio?", "Porquê você não veio?", "Por quê você não veio?"], 0, "Em perguntas, no começo da frase, usa-se \"por que\" separado e sem acento. \"Porque\" junto é usado na resposta, pra explicar."],
            ["Complete: \"Eu não fui à festa ____ estava doente.\"", ["porque", "por que", "porquê", "por quê"], 0, "Pra explicar o motivo, usa-se \"porque\", junto e sem acento (dá pra trocar por \"pois\")."],
            ["Todas as palavras proparoxítonas (a sílaba tônica é a antepenúltima) são acentuadas. Qual destas é proparoxítona?", ["Lâmpada", "Café", "Caderno", "Jacaré"], 0, "Lâm-pa-da: a sílaba mais forte é a antepenúltima. Toda proparoxítona leva acento, como lâmpada, médico e matemática."],
            ["Qual destas palavras está escrita corretamente?", ["Mal-educado", "Mau-educado", "Malducado", "Mau educado"], 0, "\"Mal\" é o contrário de \"bem\" (bem-educado → mal-educado). \"Mau\" é o contrário de \"bom\" (bom humor → mau humor)."],
            ["Complete corretamente: \"Ele é um menino ____ e acordou de ____ humor.\"", ["mau / mau", "mal / mal", "mau / mal", "mal / mau"], 0, "Nos dois casos dá pra trocar por \"bom\" (menino bom, bom humor), então é \"mau\" nos dois."],
            ["Qual frase usa a crase corretamente?", ["Vou à escola amanhã.", "Vou à pé.", "Ela começou à correr.", "Entreguei à ele o livro."], 0, "Crase é a + a: \"vou a\" + \"a escola\". Não há crase antes de palavra masculina (pé), de verbo (correr) nem de pronome como \"ele\"."],
            ["Qual palavra está escrita corretamente segundo o Acordo Ortográfico atual?", ["Ideia", "Idéia", "Idêia", "Ideía"], 0, "Desde o Novo Acordo Ortográfico, os ditongos abertos \"ei\" e \"oi\" nas paroxítonas perderam o acento: ideia, assembleia, heroico."],
            ["Qual destas palavras está escrita corretamente?", ["Paralisar", "Paralizar", "Paraliçar", "Paralissar"], 0, "Paralisar vem de \"paralisia\", que já tem s. Quando a palavra de origem tem s, o verbo mantém o s (análise → analisar)."],
            ["Qual é a forma correta?", ["Há dez anos eu morava aqui.", "A dez anos eu morava aqui.", "À dez anos eu morava aqui.", "Ha dez anos eu morava aqui."], 0, "Pra tempo que já passou, usa-se \"há\" (do verbo haver; dá pra trocar por \"faz\"). \"Daqui a dez anos\" (futuro) é com \"a\"."],
        ],
    }),
    quizMission({
        subject: "portugues",
        level: 10,
        title: "Língua Portuguesa: Pontuação e Concordância",
        icon: "❗",
        description: "Vírgula, sujeito e predicado, e concordância verbal e nominal",
        item: { name: "Vírgula Dourada", icon: "🖋️", description: "Uma vírgula de ouro que sempre cai no lugar certo. Usar dá XP de quem domina a frase." },
        questions: [
            ["Qual frase está pontuada corretamente?", ["Comprei arroz, feijão, ovos e leite.", "Comprei, arroz feijão ovos e leite.", "Comprei arroz feijão, ovos, e, leite.", "Comprei arroz feijão ovos e, leite."], 0, "A vírgula separa os itens de uma enumeração. Antes do \"e\" final, normalmente não se usa vírgula."],
            ["Qual frase está correta?", ["Pedro, venha aqui!", "Pedro venha, aqui!", "Pedro venha aqui,!", "Pedro: venha aqui"], 0, "O vocativo (quando chamamos alguém) é separado por vírgula: \"Pedro, venha aqui!\"."],
            ["Por que a frase \"Os alunos, gostam de jogar\" está errada?", ["Porque não se separa o sujeito do verbo com vírgula", "Porque falta ponto de exclamação", "Porque \"alunos\" deveria estar no singular", "Ela está correta"], 0, "Sujeito e verbo não são separados por vírgula: \"Os alunos gostam de jogar\"."],
            ["Na frase \"As crianças brincavam no parque\", qual é o sujeito?", ["As crianças", "Brincavam", "No parque", "Parque"], 0, "O sujeito é de quem se fala: \"as crianças\". O resto (\"brincavam no parque\") é o predicado."],
            ["Na frase \"Choveu muito ontem\", o sujeito é:", ["Inexistente (oração sem sujeito)", "Ontem", "Muito", "Chuva"], 0, "Verbos que indicam fenômenos da natureza, como chover, nevar e trovejar, formam orações sem sujeito."],
            ["Qual frase está com a concordância verbal correta?", ["Fazem dois anos que me mudei.", "Faz dois anos que me mudei.", "Fizeram dois anos que me mudei.", "Fazem-se dois anos que me mudei."], 1, "O verbo \"fazer\" indicando tempo decorrido é impessoal e fica no singular: \"faz dois anos\"."],
            ["Qual frase está correta?", ["Houveram muitos problemas.", "Houve muitos problemas.", "Haviam muitos problemas.", "Houveram-se muitos problemas."], 1, "\"Haver\" no sentido de existir é impessoal e fica no singular: \"houve problemas\", \"havia pessoas\"."],
            ["Qual frase tem a concordância nominal correta?", ["Elas mesmas fizeram o bolo.", "Elas mesmo fizeram o bolo.", "Elas mesma fizeram o bolo.", "Elas mesmos fizeram o bolo."], 0, "\"Mesmo\" com o sentido de \"próprio\" concorda com o nome: ela mesma, eles mesmos, elas mesmas."],
            ["Complete: \"Seguem ____ as fotos da viagem.\"", ["anexas", "anexo", "anexa", "anexos"], 0, "\"Anexo\" é adjetivo e concorda com o substantivo: as fotos seguem anexas, o documento segue anexo."],
            ["Para que serve o ponto de interrogação?", ["Para indicar uma pergunta direta", "Para indicar surpresa ou espanto", "Para terminar uma frase afirmativa", "Para separar itens"], 0, "O ponto de interrogação marca pergunta. A surpresa, o espanto e as ordens costumam usar o ponto de exclamação."],
        ],
    }),
    quizMission({
        subject: "portugues",
        level: 15,
        title: "Língua Portuguesa: Figuras de Linguagem",
        icon: "🎭",
        description: "Metáfora, comparação, hipérbole, ironia e outras figuras",
        item: { name: "Máscara do Poeta", icon: "🎭", description: "Quem a usa fala por imagens e metáforas. Usar dá XP de quem lê nas entrelinhas." },
        questions: [
            ["\"Seus olhos são duas estrelas.\" Qual figura de linguagem aparece aqui?", ["Metáfora", "Hipérbole", "Ironia", "Onomatopeia"], 0, "A metáfora compara sem usar conectivo (\"como\"): os olhos são estrelas, ou seja, brilhantes."],
            ["\"Ela é forte como um leão.\" Qual figura aparece?", ["Comparação (símile)", "Metáfora", "Ironia", "Eufemismo"], 0, "A comparação liga os dois termos com um conectivo, como \"como\", \"feito\" ou \"tal qual\"."],
            ["\"Já te falei um milhão de vezes!\" é um exemplo de:", ["Hipérbole", "Eufemismo", "Personificação", "Antítese"], 0, "A hipérbole é um exagero proposital pra dar ênfase. Ninguém falou mesmo um milhão de vezes."],
            ["\"O vento cantava na janela.\" Qual figura aparece?", ["Personificação (prosopopeia)", "Hipérbole", "Ironia", "Pleonasmo"], 0, "A personificação dá características humanas a seres não humanos: o vento não canta de verdade."],
            ["\"Que belo dia para um piquenique!\", disse ele, olhando a tempestade. Qual é a figura?", ["Ironia", "Metáfora", "Comparação", "Onomatopeia"], 0, "Na ironia, se diz o contrário do que se quer dizer. O contexto (a tempestade) mostra a intenção."],
            ["\"Ele partiu desta para melhor\", no lugar de \"ele morreu\", é um exemplo de:", ["Eufemismo", "Hipérbole", "Ironia", "Antítese"], 0, "O eufemismo suaviza uma ideia triste ou desagradável."],
            ["\"Tic-tac\", \"au-au\" e \"cocoricó\" são exemplos de:", ["Onomatopeia", "Metáfora", "Antítese", "Eufemismo"], 0, "A onomatopeia imita sons: do relógio, do cachorro, do galo. É muito usada em histórias em quadrinhos."],
            ["\"É dor que desatina sem doer\" (Camões) junta ideias contrárias que parecem impossíveis juntas. Isso é um:", ["Paradoxo", "Pleonasmo", "Eufemismo", "Comparação"], 0, "No paradoxo, ideias opostas se juntam de um jeito aparentemente absurdo. Na antítese elas só se opõem (\"riso e choro\")."],
            ["\"Subir para cima\" e \"entrar para dentro\" são exemplos de:", ["Pleonasmo (redundância)", "Metáfora", "Ironia", "Hipérbole"], 0, "O pleonasmo repete uma ideia já dita. Às vezes é usado de propósito pra dar ênfase; sem intenção, é visto como um vício de linguagem."],
            ["\"Li Machado de Assis nas férias\" significa ler os livros de Machado de Assis. Qual é a figura?", ["Metonímia", "Hipérbole", "Personificação", "Onomatopeia"], 0, "A metonímia troca uma palavra por outra que tem relação com ela: o autor pela obra, a marca pelo produto, a parte pelo todo."],
        ],
    }),
    quizMission({
        subject: "portugues",
        level: 20,
        title: "Língua Portuguesa: Literatura Brasileira",
        icon: "📚",
        description: "Os grandes autores e as escolas literárias do Brasil",
        item: { name: "Biblioteca de Bolso", icon: "📚", description: "Os clássicos da literatura brasileira cabendo na mochila. Usar dá XP de quem ama ler." },
        questions: [
            ["Quem escreveu \"Dom Casmurro\" e \"Memórias Póstumas de Brás Cubas\"?", ["Machado de Assis", "José de Alencar", "Monteiro Lobato", "Carlos Drummond de Andrade"], 0, "Machado de Assis é um dos maiores escritores brasileiros e fundou a Academia Brasileira de Letras, em 1897."],
            ["Em \"Dom Casmurro\", qual é a grande dúvida que até hoje divide os leitores?", ["Se Capitu traiu Bentinho", "Quem matou o narrador", "Onde está o tesouro", "Quem é o pai de Brás Cubas"], 0, "O narrador Bentinho conta a história do jeito dele e acusa Capitu, a dos \"olhos de ressaca\". Mas o leitor nunca tem certeza."],
            ["Quem criou o Sítio do Picapau Amarelo, com Emília, Narizinho e Pedrinho?", ["Monteiro Lobato", "Ziraldo", "Machado de Assis", "Cecília Meireles"], 0, "Monteiro Lobato é um dos pais da literatura infantil brasileira. Ziraldo criou o Menino Maluquinho."],
            ["\"Iracema\" e \"O Guarani\", de José de Alencar, pertencem a qual escola literária?", ["Romantismo (indianismo)", "Modernismo", "Realismo", "Barroco"], 0, "No Romantismo, Alencar idealizou o indígena como herói nacional. \"Iracema\" é um anagrama de \"América\"."],
            ["A Semana de Arte Moderna, em 1922, marcou o início de qual movimento no Brasil?", ["Modernismo", "Arcadismo", "Romantismo", "Parnasianismo"], 0, "A Semana aconteceu no Theatro Municipal de São Paulo, com Mário de Andrade, Oswald de Andrade e Anita Malfatti, entre outros."],
            ["Quem escreveu \"Macunaíma, o herói sem nenhum caráter\"?", ["Mário de Andrade", "Oswald de Andrade", "Graciliano Ramos", "Jorge Amado"], 0, "Macunaíma (1928), de Mário de Andrade, mistura lendas indígenas, humor e as várias culturas do Brasil."],
            ["O poema \"No Meio do Caminho\", que repete várias vezes a imagem de uma pedra no caminho, é de qual poeta?",["Carlos Drummond de Andrade", "Vinicius de Moraes", "Manuel Bandeira", "Olavo Bilac"], 0, "O poema \"No Meio do Caminho\", de Drummond, causou polêmica em 1928 por causa das repetições, típicas do Modernismo."],
            ["\"Vidas Secas\", de Graciliano Ramos, conta a história de:", ["Uma família de retirantes fugindo da seca no sertão nordestino", "Um príncipe europeu", "Uma viagem à Lua", "Um detetive no Rio de Janeiro"], 0, "Fabiano, sinha Vitória, os filhos e a cadela Baleia mostram a dureza da vida no sertão. É um romance da segunda fase do Modernismo."],
            ["Qual escritora brasileira escreveu \"A Hora da Estrela\", com a personagem Macabéa?", ["Clarice Lispector", "Cecília Meireles", "Rachel de Queiroz", "Cora Coralina"], 0, "Clarice Lispector é famosa pela escrita introspectiva, que mergulha nos pensamentos dos personagens."],
            ["Qual livro de Carolina Maria de Jesus, escrito como um diário na favela do Canindé, em São Paulo, ficou famoso no mundo todo?", ["Quarto de Despejo", "Vidas Secas", "O Cortiço", "Capitães da Areia"], 0, "\"Quarto de Despejo\" (1960) foi traduzido pra mais de dez línguas e mostra o dia a dia da fome e da pobreza pela voz de quem vivia aquilo."],
        ],
    }),
]

export default missions
