import { Mission, QuizQuestion } from "../../../src/engine/missions";

// Sorteio das perguntas das missões de evento montadas a partir das missões que
// o professor já tem (scripts/missions/halloween.ts e dracoding.ts):
// - nenhuma pergunta se repete entre as missões sorteadas;
// - dentro de uma missão, cada pergunta vem de uma missão de origem diferente,
//   preferindo assuntos diferentes ("Hardware" e "Hardware parte 2" são o mesmo
//   assunto): só repete assunto se faltar;
// - o sorteio usa uma semente fixa e as missões de origem vêm sempre na mesma
//   ordem: com as mesmas missões no banco, o resultado é sempre o mesmo.
// Cada pergunta ganha o assunto na frente (ex.: "(Python) O que este código
// mostra?"), porque fora da missão original não dá pra saber de que linguagem
// é um trecho de código.

/** O assunto de cada missão de origem, pra colocar na frente da pergunta. */
export function subjectOf(title: string): string {
    const base = title.replace(/\s+parte\s+\d+$/i, '')
    const names: Record<string, string> = {
        'Introdução ao Scratch': 'Scratch',
        'Blocos de Código no Scratch': 'Scratch',
        'O Mundo da Programação': 'Programação',
        'Linguagem Lua': 'Lua',
        'MIT App Inventor': 'App Inventor',
        'A História da Computação': 'História da Computação',
    }
    return names[base] ?? base
}

/** A pergunta "sem o assunto na frente" + a resposta certa: o que identifica a pergunta em qualquer missão. */
export function questionKey(question: QuizQuestion): string {
    const prompt = question.prompt.replace(/^\([^)]*\)\s*/, '')
    const answer = question.options.find((o) => o.id === question.correctOptionId)?.text ?? ''
    return `${prompt}|${answer}`
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

/**
 * Sorteia `count` missões de `perMission` perguntas cada. `skip` diz quais
 * perguntas não podem sair (ex.: as que já estão em missões de outro evento).
 */
export function drawQuestions(sources: Mission[], count: number, perMission: number, seed: number, skip: (q: QuizQuestion) => boolean = () => false): QuizQuestion[][] {
    const random = seededRandom(seed)

    // As perguntas de cada missão de origem, já embaralhadas
    const pools = sources.map((source) => ({
        subject: subjectOf(source.title),
        questions: shuffle(source.questions.filter((q) => !skip(q)), random),
    }))

    const result: QuizQuestion[][] = []

    for (let m = 0; m < count; m++) {
        // `perMission` missões de origem diferentes, entre as que ainda têm
        // pergunta sobrando, preferindo assuntos diferentes
        const available = shuffle(pools.filter((p) => p.questions.length > 0), random)
        const subjects = new Set<string>()
        const chosen: typeof pools = []

        for (const pool of available) {
            if (chosen.length < perMission && !subjects.has(pool.subject)) {
                chosen.push(pool)
                subjects.add(pool.subject)
            }
        }

        for (const pool of available) {
            if (chosen.length < perMission && !chosen.includes(pool)) chosen.push(pool)
        }

        if (chosen.length < perMission) {
            throw new Error(`Não há perguntas suficientes nas missões do professor pra montar ${count} missões de ${perMission} perguntas.`)
        }

        const questions = chosen.map((pool, i) => {
            const question = pool.questions.pop()!
            return { ...question, id: `q${i + 1}`, prompt: `(${pool.subject}) ${question.prompt}` }
        })

        result.push(questions)
    }

    return result
}
