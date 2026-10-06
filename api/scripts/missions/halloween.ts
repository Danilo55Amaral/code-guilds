import { Mission, MissionContent, QuizQuestion, RewardItem } from "../../../src/engine/missions";

// Missões do evento de Halloween (A Noite do Bug Assombrado): 5 quizzes de 10
// perguntas, "Missão de Halloween Parte 1" a "Parte 5". As perguntas vêm das
// missões de quiz que o PRÓPRIO professor já tem no banco (o import passa
// essas missões pra função abaixo), sorteadas e misturadas:
// - nenhuma pergunta se repete entre as 5 missões;
// - dentro de uma missão, as 10 perguntas vêm de 10 missões diferentes, então
//   cada uma mistura vários assuntos (Scratch, Python, ODS, hardware...);
// - o sorteio usa uma semente fixa e as missões vêm sempre na mesma ordem:
//   com as mesmas missões no banco, o resultado é sempre o mesmo.
// Cada pergunta ganha o assunto na frente (ex.: "(Python) O que este código
// mostra?"), porque fora da missão original não dá pra saber de que linguagem
// é um trecho de código. Importar com:
//   npm run missions:import -- <e-mail do professor> scripts/missions/halloween.ts

const TITLE_PREFIX = 'Missão de Halloween Parte'

// O assunto de cada missão de origem, pra colocar na frente da pergunta
function subjectOf(title: string): string {
    const base = title.replace(/\s+parte\s+\d+$/i, '')
    const names: Record<string, string> = {
        'Introdução ao Scratch': 'Scratch',
        'Blocos de Código no Scratch': 'Scratch',
        'O Mundo da Programação': 'Programação',
        'Linguagem Lua': 'Lua',
        'MIT App Inventor': 'App Inventor',
    }
    return names[base] ?? base
}

// Gerador de números "aleatórios" com semente (mulberry32): a mesma semente
// sempre dá a mesma sequência
function seededRandom(seed: number) {
    return () => {
        seed = (seed + 0x6d2b79f5) | 0
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

function shuffle<T>(list: T[], random: () => number): T[] {
    const copy = [...list]
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
}

const MISSIONS_COUNT = 5
const QUESTIONS_PER_MISSION = 10

function drawQuestions(sources: Mission[]): QuizQuestion[][] {
    const random = seededRandom(31102026)

    // As perguntas de cada missão de origem, já embaralhadas
    const pools = sources.map((source) => ({
        subject: subjectOf(source.title),
        questions: shuffle(source.questions, random),
    }))

    const result: QuizQuestion[][] = []

    for (let m = 0; m < MISSIONS_COUNT; m++) {
        // 10 missões de origem diferentes, entre as que ainda têm pergunta
        // sobrando, preferindo assuntos diferentes ("Hardware" e "Hardware
        // parte 2" são o mesmo assunto): só repete assunto se faltar
        const available = shuffle(pools.filter((p) => p.questions.length > 0), random)
        const subjects = new Set<string>()
        const sources: typeof pools = []

        for (const pool of available) {
            if (sources.length < QUESTIONS_PER_MISSION && !subjects.has(pool.subject)) {
                sources.push(pool)
                subjects.add(pool.subject)
            }
        }

        for (const pool of available) {
            if (sources.length < QUESTIONS_PER_MISSION && !sources.includes(pool)) sources.push(pool)
        }

        if (sources.length < QUESTIONS_PER_MISSION) {
            throw new Error('Não há perguntas suficientes nas missões do professor pra montar as de Halloween.')
        }

        const questions = sources.map((pool, i) => {
            const question = pool.questions.pop()!
            return { ...question, id: `q${i + 1}`, prompt: `(${pool.subject}) ${question.prompt}` }
        })

        result.push(questions)
    }

    return result
}

// Recompensas crescentes, como as missões prontas do evento
const LEVELS: { icon: string, rewardXp: number, rewardCoins: number, description: string, item: RewardItem }[] = [
    {
        icon: "🎃",
        rewardXp: 150,
        rewardCoins: 60,
        description: "O Rei Abóbora misturou as lições de todas as missões. Responda certo e acenda a primeira lanterna!",
        item: {
            name: "Doce Enfeitiçado",
            icon: "🍬",
            description: "Um doce que brilha no escuro, colhido na noite de Halloween. Usar transforma o feitiço em XP.",
            rarity: "comum",
            value: 15,
            xp: 40,
        },
    },
    {
        icon: "👻",
        rewardXp: 170,
        rewardCoins: 70,
        description: "Fantasmas embaralharam perguntas de Scratch, Python, ODS e muito mais. Mostre que nenhuma assombração te pega!",
        item: {
            name: "Lençol de Fantasma",
            icon: "👻",
            description: "O lençol de um fantasma que desistiu de assustar programadores. Usar transforma o susto em XP.",
            rarity: "raro",
            value: 30,
            xp: 60,
        },
    },
    {
        icon: "🦇",
        rewardXp: 190,
        rewardCoins: 80,
        description: "Uma revoada de morcegos espalhou perguntas por todos os corredores da CodeGuilds. Junte o que você aprendeu!",
        item: {
            name: "Morcego de Estimação",
            icon: "🦇",
            description: "Um morcego que dorme de cabeça para baixo em cima do seu teclado. Usar transforma as asas em XP.",
            rarity: "raro",
            value: 35,
            xp: 70,
        },
    },
    {
        icon: "🕸️",
        rewardXp: 220,
        rewardCoins: 90,
        description: "A teia da maldição prendeu perguntas de todas as matérias. Desfaça cada fio com a resposta certa!",
        item: {
            name: "Teia Encantada",
            icon: "🕸️",
            description: "Uma teia tecida com fios de código. Usar desfaz a teia e libera o XP preso nela.",
            rarity: "epico",
            value: 50,
            xp: 90,
        },
    },
    {
        icon: "🕯️",
        rewardXp: 260,
        rewardCoins: 110,
        description: "O último desafio antes do amanhecer: perguntas de todas as missões, misturadas pelo Rei Abóbora em pessoa.",
        item: {
            name: "Lanterna do Amanhecer",
            icon: "🏮",
            description: "A lanterna que acendeu quando a maldição começou a se quebrar. Usar transforma a luz em XP.",
            rarity: "epico",
            value: 60,
            xp: 110,
        },
    },
]

export default function halloweenMissions(teacherMissions: Mission[]): MissionContent[] {
    // Só as missões normais com perguntas (nunca as de Halloween já criadas)
    const sources = teacherMissions.filter((m) => m.questions.length > 0 && !m.title.startsWith(TITLE_PREFIX))

    if (sources.length < QUESTIONS_PER_MISSION) {
        throw new Error(`O professor precisa ter pelo menos ${QUESTIONS_PER_MISSION} missões de quiz pra montar as de Halloween (tem ${sources.length}).`)
    }

    const drawn = drawQuestions(sources)

    return LEVELS.map((level, i) => ({
        title: `${TITLE_PREFIX} ${i + 1}`,
        icon: level.icon,
        difficulty: "medio",
        minLevel: 1,
        description: level.description,
        rewardXp: level.rewardXp,
        rewardCoins: level.rewardCoins,
        rewardItem: level.item,
        kind: "quiz",
        questions: drawn[i],
        // Missão exclusiva do evento: só aparece na tela do Halloween
        eventId: "halloween",
    }))
}
