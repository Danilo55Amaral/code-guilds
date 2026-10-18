import { MissionContent } from "../../../src/engine/missions";
import { quizMission } from "./quiz-materia";

// Mais 5 missões de Língua Portuguesa (tomo de Língua Portuguesa), nos níveis
// 1, 5, 10, 15 e 20: significado das palavras, gêneros textuais, coesão e
// interpretação, orações e período composto, e as escolas literárias. Não
// repetem as perguntas de lingua-portuguesa.ts.
// Importar com:
//   npm run missions:import -- <e-mail do professor> scripts/missions/lingua-portuguesa-parte-2.ts
const missions: MissionContent[] = [
    quizMission({
        subject: "portugues",
        level: 1,
        title: "Língua Portuguesa: O Sentido das Palavras",
        icon: "🔤",
        description: "Sinônimos, antônimos, homônimos, parônimos, plural e feminino",
        item: { name: "Dicionário de Bolso Dourado", icon: "📗", description: "Sabe o significado de todas as palavras. Usar dá XP de quem amplia o vocabulário." },
        questions: [
            ["Qual palavra é sinônimo de \"feliz\"?", ["Contente", "Triste", "Cansado", "Bravo"], 0, "Sinônimos têm sentido parecido. Antônimos têm sentido oposto."],
            ["Qual é o antônimo de \"corajoso\"?", ["Medroso", "Valente", "Ousado", "Destemido"], 0, "Valente, ousado e destemido são sinônimos de corajoso."],
            ["\"Cela\" (de prisão) e \"sela\" (de cavalo) têm o mesmo som e sentidos diferentes. Como se chamam?", ["Homônimos", "Sinônimos", "Antônimos", "Parônimos"], 0, "Homônimos têm a mesma pronúncia (ou grafia) e sentidos diferentes, como \"concerto\" e \"conserto\"."],
            ["\"Comprimento\" (medida) e \"cumprimento\" (saudação) são parecidos, mas não iguais. Como se chamam?", ["Parônimos", "Homônimos perfeitos", "Sinônimos", "Antônimos"], 0, "Parônimos são palavras parecidas na escrita e na pronúncia, com sentidos diferentes."],
            ["Qual é o plural de \"cidadão\"?", ["Cidadãos", "Cidadões", "Cidadães", "Cidadãoes"], 0, "Cidadão faz cidadãos, assim como irmão faz irmãos. Mas pão faz pães e leão faz leões."],
            ["Qual é o feminino de \"ator\"?", ["Atriz", "Atora", "Atoresa", "Atriza"], 0, "Outros femininos especiais: imperador → imperatriz, embaixador → embaixadora (ou embaixatriz)."],
            ["Qual é o aumentativo de \"casa\"?", ["Casarão", "Casinha", "Caseiro", "Casebre"], 0, "Casinha é o diminutivo, e casebre é uma casa pobre e pequena."],
            ["Na frase \"Ele tem um coração de pedra\", o que \"coração de pedra\" quer dizer?", ["Que ele é insensível", "Que ele tem um problema de saúde", "Que ele coleciona pedras", "Que ele é muito forte"], 0, "É uma expressão no sentido figurado (conotativo), não no sentido literal."],
            ["Qual palavra completa corretamente: \"Fui ao médico fazer um ___ de sangue\"?", ["exame", "ezame", "ixame", "exami"], 0, "Exame se escreve com x com som de z, como exemplo e exato."],
            ["Qual destas palavras é um coletivo?", ["Biblioteca (de livros)", "Livro", "Página", "Leitor"], 0, "Coletivo é o substantivo que indica um conjunto: biblioteca (livros), arquipélago (ilhas), constelação (estrelas)."],
        ],
    }),
    quizMission({
        subject: "portugues",
        level: 5,
        title: "Língua Portuguesa: Gêneros Textuais",
        icon: "📰",
        description: "Notícia, receita, fábula, crônica, poema, anúncio e outros",
        item: { name: "Jornal da Academia", icon: "📰", description: "A edição de hoje traz só boas notícias. Usar dá XP de quem reconhece cada tipo de texto." },
        questions: [
            ["Qual gênero textual informa um fato recente, respondendo o quê, quem, quando, onde, como e por quê?", ["Notícia", "Poema", "Fábula", "Receita"], 0, "A notícia costuma ter manchete, lide (o primeiro parágrafo com o resumo) e corpo do texto."],
            ["Qual gênero textual dá instruções, com ingredientes e modo de preparo?", ["Receita", "Crônica", "Biografia", "Conto"], 0, "A receita é um texto instrucional, com verbos no imperativo: \"misture\", \"asse\"."],
            ["Qual gênero é uma narrativa curta, com animais que agem como gente e uma moral no final?", ["Fábula", "Notícia", "Reportagem", "Anúncio"], 0, "\"A Cigarra e a Formiga\" e \"A Lebre e a Tartaruga\" são fábulas famosas."],
            ["Como se chama cada linha de um poema?", ["Verso", "Estrofe", "Parágrafo", "Rima"], 0, "Um conjunto de versos forma uma estrofe."],
            ["Qual gênero conta, de forma leve, um fato do dia a dia, muitas vezes com humor, e é publicado em jornais?", ["Crônica", "Bula de remédio", "Receita", "Manual"], 0, "Rubem Braga, Luis Fernando Verissimo e Fernando Sabino são grandes cronistas brasileiros."],
            ["Qual é o principal objetivo de um anúncio publicitário?", ["Convencer o leitor a comprar um produto ou aderir a uma ideia", "Contar uma história de terror", "Ensinar uma receita", "Informar a previsão do tempo"], 0, "Para isso, os anúncios usam imagens, frases de efeito e o apelo às emoções."],
            ["Qual é a diferença entre biografia e autobiografia?", ["A biografia conta a vida de alguém escrita por outra pessoa; na autobiografia, a pessoa conta a própria vida", "Não há diferença", "A biografia é sempre inventada", "A autobiografia é escrita só por famosos"], 0, "O \"auto\" quer dizer \"de si mesmo\"."],
            ["Qual gênero apresenta a opinião do autor sobre um tema, com argumentos?", ["Artigo de opinião", "Receita", "Lista de compras", "Verbete de dicionário"], 0, "É um texto argumentativo, como a redação do Enem."],
            ["Qual gênero mistura desenhos e falas em balões, em poucos quadrinhos, geralmente com humor?", ["Tirinha", "Romance", "Ata", "Requerimento"], 0, "Armandinho, Mafalda e a Turma da Mônica aparecem muito em tirinhas."],
            ["Qual gênero textual é usado para pedir algo formalmente a uma autoridade ou instituição?", ["Requerimento (ou carta formal)", "Poema", "Piada", "Fábula"], 0, "Ele usa linguagem formal e identifica quem pede, o que pede e por quê."],
        ],
    }),
    quizMission({
        subject: "portugues",
        level: 10,
        title: "Língua Portuguesa: Coesão e Interpretação",
        icon: "🔗",
        description: "Conectivos, coesão, variação linguística e sentido figurado",
        item: { name: "Elo de Prata", icon: "🔗", description: "Liga as ideias de um texto sem deixar pontas soltas. Usar dá XP de quem lê nas entrelinhas." },
        questions: [
            ["Em \"Estudei muito, mas não fui bem na prova\", que ideia o \"mas\" expressa?", ["Oposição", "Causa", "Tempo", "Adição"], 0, "\"Mas\", \"porém\" e \"contudo\" são conjunções adversativas: indicam oposição."],
            ["Em \"Não fui à aula porque estava doente\", que ideia o \"porque\" expressa?", ["Causa", "Oposição", "Conclusão", "Comparação"], 0, "\"Porque\", \"pois\" e \"já que\" indicam causa."],
            ["Qual conectivo indica conclusão?", ["Portanto", "Mas", "Embora", "Quando"], 0, "\"Portanto\", \"logo\" e \"por isso\" introduzem uma conclusão."],
            ["Em \"Embora estivesse cansado, ele terminou o trabalho\", o \"embora\" indica:", ["Concessão (uma ideia contrária que não impede a ação)", "Tempo", "Finalidade", "Causa"], 0, "As conjunções concessivas, como \"embora\" e \"ainda que\", aparecem muito em redações."],
            ["Em \"Maria chegou cedo. Ela queria um bom lugar\", a palavra \"Ela\" serve para quê?", ["Retomar \"Maria\", evitando repetição (coesão)", "Indicar outra pessoa", "Marcar o tempo", "Fazer uma pergunta"], 0, "Usar pronomes e sinônimos para retomar palavras é um recurso de coesão referencial."],
            ["O que é variação linguística?", ["As diferentes formas de falar a mesma língua, conforme a região, a idade, o grupo e a situação", "Um erro de português", "O uso de outra língua", "Uma regra de acentuação"], 0, "\"Mandioca\", \"aipim\" e \"macaxeira\" são o mesmo alimento em regiões diferentes."],
            ["Em qual situação a linguagem formal é mais adequada?", ["Numa entrevista de emprego ou numa redação do Enem", "Numa conversa entre amigos", "Num bilhete para a família", "Num jogo com os colegas"], 0, "Nenhuma variedade é \"errada\": cada situação pede um registro adequado."],
            ["Qual é a diferença entre sentido denotativo e conotativo?", ["Denotativo é o sentido literal, do dicionário; conotativo é o sentido figurado", "Não há diferença", "Conotativo é sempre errado", "Denotativo é só para poemas"], 0, "\"O gato subiu no telhado\" (denotativo). \"Aquele ator é um gato\" (conotativo)."],
            ["O que é fazer uma inferência ao ler um texto?", ["Concluir algo que não está escrito diretamente, a partir das pistas do texto", "Copiar o texto", "Contar as palavras", "Ler só o título"], 0, "Se o texto diz que alguém chegou molhado e fechou o guarda-chuva, inferimos que estava chovendo."],
            ["Em \"Primeiro lave as mãos; depois, sirva-se\", que ideia \"depois\" expressa?", ["Tempo (sequência)", "Causa", "Oposição", "Condição"], 0, "Conectivos de tempo organizam a sequência dos acontecimentos e das instruções."],
        ],
    }),
    quizMission({
        subject: "portugues",
        level: 15,
        title: "Língua Portuguesa: Orações e Período Composto",
        icon: "🧩",
        description: "Período simples e composto, coordenação, subordinação e vozes verbais",
        item: { name: "Quebra-Cabeça Sintático", icon: "🧩", description: "Encaixa cada oração no lugar certo. Usar dá XP de quem domina a sintaxe." },
        questions: [
            ["O que é uma oração?", ["Um enunciado organizado em torno de um verbo (ou locução verbal)", "Qualquer palavra solta", "Um parágrafo inteiro", "Uma reza"], 0, "\"Choveu.\" já é uma oração, porque tem verbo."],
            ["Quantas orações tem o período \"Cheguei, tomei banho e fui dormir\"?", ["3", "1", "2", "4"], 0, "Cada verbo forma uma oração: cheguei / tomei banho / fui dormir. É um período composto."],
            ["Em \"Estudei e passei\", as orações são ligadas pela conjunção \"e\". Como elas se classificam?", ["Coordenadas sindéticas", "Subordinadas substantivas", "Coordenadas assindéticas", "Absolutas"], 0, "Sindéticas têm conjunção; assindéticas são ligadas só pela vírgula, sem conjunção."],
            ["Em \"Quero que você venha\", a oração \"que você venha\" é:", ["Subordinada, pois funciona como parte da outra oração (o objeto do verbo querer)", "Coordenada", "Independente", "Absoluta"], 0, "Quero o quê? \"Que você venha\": é uma oração subordinada substantiva objetiva direta."],
            ["Em \"O menino comprou um livro\", qual é o objeto direto?", ["Um livro", "O menino", "Comprou", "Não há objeto"], 0, "Comprou o quê? Um livro. O objeto direto completa o verbo sem preposição."],
            ["Em \"Gosto de chocolate\", qual é o objeto indireto?", ["De chocolate", "Gosto", "Chocolate é sujeito", "Não há objeto"], 0, "Quem gosta, gosta DE algo: o complemento vem com preposição, então é objeto indireto."],
            ["Qual frase está na voz passiva?", ["O livro foi escrito pela professora", "A professora escreveu o livro", "A professora escreve muito", "O livro é bom"], 0, "Na voz passiva o sujeito sofre a ação: \"O livro\" (sujeito) foi escrito \"pela professora\" (agente da passiva)."],
            ["Em \"A menina parecia cansada\", qual é a função de \"cansada\"?", ["Predicativo do sujeito", "Objeto direto", "Adjunto adverbial", "Vocativo"], 0, "Com verbos de ligação, como ser, estar e parecer, a característica do sujeito é o predicativo."],
            ["Em \"Machado de Assis, o fundador da Academia Brasileira de Letras, nasceu no Rio\", o trecho entre vírgulas é:", ["Um aposto", "Um vocativo", "Um sujeito", "Um objeto"], 0, "O aposto explica ou especifica um termo anterior e costuma vir entre vírgulas."],
            ["Em \"Ontem choveu muito na cidade\", \"ontem\" e \"na cidade\" são:", ["Adjuntos adverbiais (de tempo e de lugar)", "Sujeitos", "Objetos diretos", "Predicativos"], 0, "Adjuntos adverbiais indicam circunstâncias: tempo, lugar, modo, intensidade e outras."],
        ],
    }),
    quizMission({
        subject: "portugues",
        level: 20,
        title: "Língua Portuguesa: As Escolas Literárias",
        icon: "🖋️",
        description: "Do Quinhentismo ao Modernismo: autores e características",
        item: { name: "Pena dos Clássicos", icon: "🖋️", description: "Já escreveu sonetos, romances e crônicas. Usar dá XP de quem conhece a literatura brasileira." },
        questions: [
            ["Qual documento de 1500 é considerado o primeiro texto escrito sobre o Brasil, marco do Quinhentismo?", ["A Carta de Pero Vaz de Caminha", "Os Lusíadas", "A Constituição", "O Guarani"], 0, "Caminha escreveu ao rei de Portugal descrevendo a terra e os povos que encontrou."],
            ["Qual poeta barroco baiano ficou conhecido como \"Boca do Inferno\" por suas sátiras?", ["Gregório de Matos", "Castro Alves", "Olavo Bilac", "Gonçalves Dias"], 0, "Gregório de Matos criticava a sociedade de Salvador no século XVII."],
            ["Qual poeta do Arcadismo escreveu \"Marília de Dirceu\"?", ["Tomás Antônio Gonzaga", "Machado de Assis", "Cecília Meireles", "Álvares de Azevedo"], 0, "Gonzaga também participou da Inconfidência Mineira e foi exilado."],
            ["Qual poeta romântico escreveu a \"Canção do Exílio\" (\"Minha terra tem palmeiras / onde canta o sabiá\")?", ["Gonçalves Dias", "Castro Alves", "Carlos Drummond de Andrade", "Manuel Bandeira"], 0, "O poema é de 1843. É domínio público e um dos mais famosos da língua portuguesa."],
            ["Qual poeta romântico é chamado de \"poeta dos escravos\" e escreveu \"O Navio Negreiro\"?", ["Castro Alves", "Gonçalves Dias", "Álvares de Azevedo", "Gregório de Matos"], 0, "Castro Alves fez da poesia uma arma na luta abolicionista."],
            ["Qual é uma característica do Realismo, em oposição ao Romantismo?", ["A observação objetiva e crítica da sociedade, sem idealizar", "Os heróis perfeitos e o amor idealizado", "A volta à natureza e aos pastores", "A poesia sobre a morte e a noite"], 0, "O Realismo, a partir de 1881 no Brasil, analisa as pessoas e a sociedade com ironia e crítica."],
            ["Qual romance naturalista de Aluísio Azevedo retrata a vida num cortiço do Rio de Janeiro?", ["O Cortiço", "Dom Casmurro", "Iracema", "Macunaíma"], 0, "O Naturalismo mostra o ser humano influenciado pelo meio e pela biologia."],
            ["Qual movimento valorizava a \"arte pela arte\", com sonetos de forma perfeita e rimas ricas, como os de Olavo Bilac?", ["Parnasianismo", "Modernismo", "Barroco", "Romantismo"], 0, "Olavo Bilac é o grande nome do Parnasianismo e também escreveu a letra do Hino à Bandeira."],
            ["Qual poeta negro, nascido em Santa Catarina, é o maior nome do Simbolismo no Brasil?", ["Cruz e Sousa", "Olavo Bilac", "Castro Alves", "Mário de Andrade"], 0, "Ele publicou \"Broquéis\" em 1893, obra que marca o início do Simbolismo brasileiro."],
            ["Qual autor escreveu \"Grande Sertão: Veredas\", com a linguagem inventiva do sertanejo Riobaldo?", ["Guimarães Rosa", "Jorge Amado", "Érico Veríssimo", "José de Alencar"], 0, "O romance, de 1956, é uma das obras mais importantes da literatura brasileira."],
        ],
    }),
]

export default missions
