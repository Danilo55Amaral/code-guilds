import { MissionContent } from "../../../src/engine/missions";
import { quizMission } from "./quiz-materia";

// Missões de Matemática pra Biblioteca de Missões (tomo de Matemática): 5
// missões de 10 perguntas comentadas, nos níveis 1, 5, 10, 15 e 20, com o
// conteúdo do fundamental e do ensino médio: operações e frações,
// porcentagem e proporção, equações e funções, geometria e trigonometria, e
// probabilidade, estatística e progressões. Cada explicação mostra a conta.
// Importar com:
//   npm run missions:import -- <e-mail do professor> scripts/missions/matematica.ts
const missions: MissionContent[] = [
    quizMission({
        subject: "matematica",
        level: 1,
        title: "Matemática: Operações e Frações",
        icon: "➗",
        description: "As quatro operações, a ordem das contas, frações e números primos",
        item: { name: "Ábaco Encantado", icon: "🧮", description: "As contas deslizam sozinhas pro resultado certo. Usar dá XP de quem domina as operações." },
        questions: [
            ["Quanto é 7 × 8?", ["56", "54", "48", "64"], 0, "7 × 8 = 56. Um truque: 5, 6, 7, 8 → 56 = 7 × 8."],
            ["Quanto é 144 ÷ 12?", ["12", "14", "11", "13"], 0, "12 × 12 = 144, então 144 ÷ 12 = 12."],
            ["Quanto é 2 + 3 × 4?", ["14", "20", "24", "9"], 0, "A multiplicação vem antes da soma: 3 × 4 = 12, e 2 + 12 = 14."],
            ["Quanto é 1/2 + 1/4?", ["3/4", "2/6", "1/6", "2/4"], 0, "1/2 = 2/4. Então 2/4 + 1/4 = 3/4."],
            ["Qual fração é igual a 0,5?", ["1/2", "1/5", "5/1", "2/5"], 0, "1 ÷ 2 = 0,5. Já 1/5 = 0,2."],
            ["Quanto é 3/4 de 20?", ["15", "12", "5", "16"], 0, "20 ÷ 4 = 5, e 5 × 3 = 15."],
            ["Qual é o mínimo múltiplo comum (MMC) de 4 e 6?", ["12", "24", "2", "10"], 0, "Múltiplos de 4: 4, 8, 12... Múltiplos de 6: 6, 12... O menor em comum é 12."],
            ["Qual destes números é primo?", ["7", "9", "15", "21"], 0, "7 só é divisível por 1 e por ele mesmo. 9 = 3 × 3, 15 = 3 × 5 e 21 = 3 × 7."],
            ["Qual é o perímetro de um quadrado com lado de 5 cm?", ["20 cm", "25 cm", "10 cm", "15 cm"], 0, "O perímetro é a soma dos lados: 5 + 5 + 5 + 5 = 20 cm. (25 cm² seria a área.)"],
            ["Quanto é 2³ (dois elevado ao cubo)?", ["8", "6", "9", "5"], 0, "2³ = 2 × 2 × 2 = 8."],
        ],
    }),
    quizMission({
        subject: "matematica",
        level: 5,
        title: "Matemática: Porcentagem e Proporção",
        icon: "💯",
        description: "Porcentagem, descontos, razão, escala e regra de três",
        item: { name: "Calculadora de Bronze", icon: "🔢", description: "Uma calculadora antiga que nunca erra uma porcentagem. Usar dá XP de quem faz contas rápido." },
        questions: [
            ["Quanto é 10% de 250?", ["25", "2,5", "250", "10"], 0, "10% é dividir por 10: 250 ÷ 10 = 25."],
            ["Uma camiseta de R$ 80 está com 25% de desconto. Quanto ela custa agora?", ["R$ 60", "R$ 55", "R$ 20", "R$ 75"], 0, "25% de 80 = 20. Então 80 − 20 = R$ 60."],
            ["Um produto de R$ 200 teve aumento de 15%. Qual é o novo preço?", ["R$ 230", "R$ 215", "R$ 300", "R$ 185"], 0, "15% de 200 = 30. Então 200 + 30 = R$ 230."],
            ["Quanto é 1/5 em porcentagem?", ["20%", "15%", "25%", "5%"], 0, "1 ÷ 5 = 0,2 = 20%."],
            ["Se 3 cadernos custam R$ 18, quanto custam 5 cadernos?", ["R$ 30", "R$ 25", "R$ 36", "R$ 15"], 0, "Cada caderno custa 18 ÷ 3 = R$ 6. Então 5 × 6 = R$ 30."],
            ["Numa turma há 12 meninos e 18 meninas. Qual é a razão entre meninos e meninas, simplificada?", ["2 para 3", "3 para 2", "1 para 2", "12 para 30"], 0, "12/18: dividindo os dois por 6, fica 2/3."],
            ["Num mapa com escala 1:100, uma parede mede 3 cm. Qual é o tamanho real dela?", ["3 m", "30 cm", "300 m", "30 m"], 0, "3 cm × 100 = 300 cm = 3 m."],
            ["Um carro anda a 60 km/h. Quanto tempo leva para percorrer 150 km?", ["2 horas e meia", "2 horas", "3 horas", "1 hora e meia"], 0, "150 ÷ 60 = 2,5 horas = 2 horas e 30 minutos."],
            ["4 pedreiros constroem um muro em 12 dias. Em quantos dias 6 pedreiros, no mesmo ritmo, constroem o mesmo muro?", ["8 dias", "18 dias", "10 dias", "6 dias"], 0, "É regra de três inversa: mais pedreiros, menos dias. 4 × 12 = 48 e 48 ÷ 6 = 8."],
            ["Quanto rende de juros, em um mês, R$ 400 aplicados a 5% ao mês?", ["R$ 20", "R$ 5", "R$ 40", "R$ 200"], 0, "5% de 400 = 400 × 0,05 = R$ 20."],
        ],
    }),
    quizMission({
        subject: "matematica",
        level: 10,
        title: "Matemática: Equações e Funções",
        icon: "✖️",
        description: "Equações do 1º e do 2º grau, sistemas e funções",
        item: { name: "Pergaminho do X", icon: "📜", description: "Um pergaminho onde o x sempre aparece. Usar dá XP de quem resolve qualquer equação." },
        questions: [
            ["Qual é o valor de x em 2x + 6 = 14?", ["4", "10", "3", "7"], 0, "2x = 14 − 6 = 8, então x = 8 ÷ 2 = 4."],
            ["Qual é o valor de x em 3x − 5 = 2x + 7?", ["12", "2", "6", "-12"], 0, "3x − 2x = 7 + 5, então x = 12."],
            ["Se f(x) = 2x + 3, quanto vale f(5)?", ["13", "10", "11", "16"], 0, "f(5) = 2 × 5 + 3 = 10 + 3 = 13."],
            ["Qual é a forma do gráfico de uma função do 1º grau, como f(x) = 2x + 1?", ["Uma reta", "Uma parábola", "Um círculo", "Uma onda"], 0, "A função afim f(x) = ax + b tem gráfico em forma de reta."],
            ["Na função f(x) = −3x + 1, o que acontece com f(x) quando x aumenta?", ["Diminui, pois o coeficiente angular é negativo", "Aumenta", "Fica igual", "Vira zero"], 0, "Com a = −3 (negativo), a reta é decrescente."],
            ["Quais são as soluções de x² − 9 = 0?", ["3 e −3", "Só 3", "9 e −9", "Só 0"], 0, "x² = 9, então x = 3 ou x = −3, porque (−3)² também dá 9."],
            ["Quais são as raízes de x² − 5x + 6 = 0?", ["2 e 3", "1 e 6", "−2 e −3", "5 e 6"], 0, "Dois números com soma 5 e produto 6: 2 e 3. Confere: 2² − 5 × 2 + 6 = 0."],
            ["Numa equação do 2º grau, se o discriminante (Δ = b² − 4ac) é negativo, o que acontece?", ["Não existem raízes reais", "Existem duas raízes iguais", "Existem duas raízes reais diferentes", "A equação vira do 1º grau"], 0, "Com Δ < 0, não há raiz quadrada real de Δ. Com Δ = 0 há uma raiz dupla; com Δ > 0, duas raízes reais."],
            ["Qual é a forma do gráfico de uma função do 2º grau?", ["Uma parábola", "Uma reta", "Um triângulo", "Uma espiral"], 0, "Se o a é positivo, a parábola tem a \"boca\" para cima; se é negativo, para baixo."],
            ["No sistema x + y = 10 e x − y = 4, quais são os valores de x e y?", ["x = 7 e y = 3", "x = 6 e y = 4", "x = 5 e y = 5", "x = 8 e y = 2"], 0, "Somando as equações: 2x = 14, então x = 7. Daí y = 10 − 7 = 3."],
        ],
    }),
    quizMission({
        subject: "matematica",
        level: 15,
        title: "Matemática: Geometria e Trigonometria",
        icon: "📐",
        description: "Áreas, volumes, o Teorema de Pitágoras e seno e cosseno",
        item: { name: "Esquadro de Prata", icon: "📐", description: "Sempre forma um ângulo reto perfeito. Usar dá XP de quem domina a geometria." },
        questions: [
            ["Num triângulo retângulo, os catetos medem 3 e 4. Quanto mede a hipotenusa?", ["5", "7", "6", "12"], 0, "Pelo Teorema de Pitágoras: h² = 3² + 4² = 9 + 16 = 25, então h = 5."],
            ["Quanto vale a soma dos ângulos internos de qualquer triângulo?", ["180°", "90°", "360°", "270°"], 0, "Em qualquer triângulo plano, os três ângulos somam 180°."],
            ["Qual é a área de um retângulo de 8 m por 5 m?", ["40 m²", "26 m²", "13 m²", "80 m²"], 0, "Área do retângulo = base × altura = 8 × 5 = 40 m². (26 m seria o perímetro.)"],
            ["Qual é a área de um triângulo com base 10 cm e altura 6 cm?", ["30 cm²", "60 cm²", "16 cm²", "36 cm²"], 0, "Área do triângulo = (base × altura) ÷ 2 = (10 × 6) ÷ 2 = 30 cm²."],
            ["Qual é a área de um círculo de raio 3 cm?", ["9π cm²", "6π cm²", "3π cm²", "18π cm²"], 0, "Área do círculo = π × r² = π × 3² = 9π cm² (cerca de 28,3 cm²)."],
            ["Qual é o comprimento de uma circunferência de raio 5 cm?", ["10π cm", "25π cm", "5π cm", "20π cm"], 0, "Comprimento = 2 × π × r = 2 × π × 5 = 10π cm (cerca de 31,4 cm)."],
            ["Qual é o volume de um cubo com aresta de 4 cm?", ["64 cm³", "16 cm³", "48 cm³", "12 cm³"], 0, "Volume do cubo = aresta³ = 4 × 4 × 4 = 64 cm³."],
            ["Num triângulo retângulo, o seno de um ângulo agudo é:", ["Cateto oposto dividido pela hipotenusa", "Cateto adjacente dividido pela hipotenusa", "Cateto oposto dividido pelo cateto adjacente", "Hipotenusa dividida pelo cateto oposto"], 0, "Seno = oposto/hipotenusa; cosseno = adjacente/hipotenusa; tangente = oposto/adjacente."],
            ["Quanto vale o seno de 30°?", ["1/2", "√3/2", "1", "√2/2"], 0, "sen 30° = 1/2, cos 30° = √3/2 e sen 45° = cos 45° = √2/2."],
            ["Quanto vale a soma dos ângulos internos de um hexágono?", ["720°", "540°", "360°", "1080°"], 0, "A fórmula é (n − 2) × 180°. Para n = 6: 4 × 180° = 720°."],
        ],
    }),
    quizMission({
        subject: "matematica",
        level: 20,
        title: "Matemática: Probabilidade, Estatística e Progressões",
        icon: "🎲",
        description: "Probabilidade, média, mediana, moda, PA, PG e contagem",
        item: { name: "Dado da Sorte Calculada", icon: "🎲", description: "Um dado que sabe exatamente as próprias chances. Usar dá XP de quem domina a probabilidade." },
        questions: [
            ["Ao jogar um dado comum, qual é a probabilidade de sair o número 6?", ["1/6", "1/2", "6/6", "1/3"], 0, "Há 6 resultados possíveis e 1 favorável: 1/6 (cerca de 16,7%)."],
            ["Ao jogar uma moeda duas vezes, qual é a probabilidade de sair cara nas duas?", ["1/4", "1/2", "1/3", "2/4"], 0, "1/2 × 1/2 = 1/4. Os resultados possíveis são cara-cara, cara-coroa, coroa-cara e coroa-coroa."],
            ["Qual é a média de 4, 6, 8 e 10?", ["7", "6", "8", "28"], 0, "(4 + 6 + 8 + 10) ÷ 4 = 28 ÷ 4 = 7."],
            ["Qual é a mediana de 3, 7, 9, 12 e 15?", ["9", "7", "9,2", "12"], 0, "A mediana é o valor do meio da lista em ordem: 3, 7, 9, 12, 15. (A média seria 9,2.)"],
            ["Qual é a moda do conjunto 2, 3, 3, 5, 7, 3, 8?", ["3", "5", "2", "8"], 0, "A moda é o valor que mais se repete: o 3 aparece três vezes."],
            ["Na progressão aritmética 2, 5, 8, 11..., qual é o 10º termo?", ["29", "32", "30", "27"], 0, "A razão é 3. a10 = a1 + 9 × r = 2 + 9 × 3 = 29."],
            ["Na progressão geométrica 3, 6, 12, 24..., qual é o 6º termo?", ["96", "48", "72", "192"], 0, "A razão é 2. a6 = 3 × 2⁵ = 3 × 32 = 96."],
            ["Quantos anagramas tem a palavra AMOR?", ["24", "16", "12", "4"], 0, "Com 4 letras diferentes, é 4! = 4 × 3 × 2 × 1 = 24."],
            ["Numa sala com 5 pessoas, cada uma aperta a mão de todas as outras uma vez. Quantos apertos de mão acontecem?", ["10", "20", "25", "5"], 0, "É a combinação de 5, 2 a 2: (5 × 4) ÷ 2 = 10."],
            ["Quanto dá a soma 1 + 2 + 3 + ... + 100?", ["5050", "5000", "10100", "4950"], 0, "Gauss, criança, juntou os pares 1 + 100, 2 + 99... São 50 pares de 101: 50 × 101 = 5050."],
        ],
    }),
]

export default missions
