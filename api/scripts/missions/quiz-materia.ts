import { Difficulty, MissionContent, Rarity } from "../../../src/engine/missions";
import { SubjectId } from "../../../src/engine/subjects";

// Ajudante das missões das matérias da escola (scripts/missions/astronomia.ts,
// biologia.ts, fisica.ts, quimica.ts, lingua-portuguesa.ts, historia.ts e
// ingles.ts): monta a missão a partir da lista curta de perguntas
// [enunciado, [a, b, c, d], índice da certa (0 a 3), explicação]. A certa é
// trocada de lugar pra seguir o padrão de ANSWER_SLOTS (a ordem escrita no
// arquivo não é a que o aluno vê).
// O nível mínimo (1, 5, 10, 15 ou 20) decide a dificuldade e a recompensa
// padrão; o professor ajusta XP, moedas e o item depois, no painel.
// Este arquivo não é de missões: não passe ele pro missions:import.

export type Question = [string, [string, string, string, string], 0 | 1 | 2 | 3, string];

export type MissionLevel = 1 | 5 | 10 | 15 | 20;

const LEVELS: Record<MissionLevel, { difficulty: Difficulty; xp: number; coins: number; rarity: Rarity; value: number; itemXp: number }> = {
    1: { difficulty: 'iniciante', xp: 120, coins: 50, rarity: 'comum', value: 15, itemXp: 40 },
    5: { difficulty: 'iniciante', xp: 150, coins: 60, rarity: 'comum', value: 20, itemXp: 50 },
    10: { difficulty: 'medio', xp: 180, coins: 75, rarity: 'raro', value: 30, itemXp: 70 },
    15: { difficulty: 'avancado', xp: 220, coins: 90, rarity: 'raro', value: 40, itemXp: 90 },
    20: { difficulty: 'epico', xp: 260, coins: 110, rarity: 'epico', value: 55, itemXp: 120 },
}

const OPTION_IDS = ['a', 'b', 'c', 'd'] as const

// Onde a resposta certa de cada pergunta vai parar (a, b, c ou d), pra ela não cair
// sempre na mesma letra e o aluno não acertar no chute. Cada nível começa num ponto
// diferente do padrão, então as missões de uma matéria não repetem a sequência.
const ANSWER_SLOTS = [2, 0, 3, 1, 1, 3, 0, 2, 3, 1] as const
const LEVEL_OFFSET: Record<MissionLevel, number> = { 1: 0, 5: 3, 10: 6, 15: 1, 20: 4 }

// Põe a certa na posição do padrão, trocando de lugar com a que estava lá.
function placeAnswer(options: string[], correct: number, slot: number): string[] {
    const placed = [...options];
    [placed[correct], placed[slot]] = [placed[slot], placed[correct]]
    return placed
}

export function quizMission(mission: {
    subject: SubjectId
    level: MissionLevel
    title: string
    icon: string
    description: string
    item: { name: string; icon: string; description: string }
    questions: Question[]
}): MissionContent {
    const level = LEVELS[mission.level]

    return {
        title: mission.title,
        icon: mission.icon,
        subject: mission.subject,
        difficulty: level.difficulty,
        minLevel: mission.level,
        description: mission.description,
        rewardXp: level.xp,
        rewardCoins: level.coins,
        rewardItem: { ...mission.item, rarity: level.rarity, value: level.value, xp: level.itemXp },
        kind: 'quiz',
        questions: mission.questions.map(([prompt, options, correct, explanation], i) => {
            const slot = ANSWER_SLOTS[(i + LEVEL_OFFSET[mission.level]) % ANSWER_SLOTS.length]

            return {
                id: `q${i + 1}`,
                prompt,
                options: placeAnswer(options, correct, slot).map((text, k) => ({ id: OPTION_IDS[k], text })),
                correctOptionId: OPTION_IDS[slot],
                explanation,
            }
        }),
    }
}
