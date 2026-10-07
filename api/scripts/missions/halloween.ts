import { Mission, MissionContent, RewardItem } from "../../../src/engine/missions";
import { drawQuestions } from "./sorteio";

// Missões do evento de Halloween (A Noite do Bug Assombrado): 5 quizzes de 10
// perguntas, "Missão de Halloween Parte 1" a "Parte 5". As perguntas vêm das
// missões de quiz que o PRÓPRIO professor já tem no banco (o import passa
// essas missões pra função abaixo), sorteadas e misturadas com as regras de
// scripts/missions/sorteio.ts: nenhuma pergunta se repete entre as 5 missões,
// e as 10 perguntas de cada missão vêm de 10 missões diferentes, então cada
// uma mistura vários assuntos (Scratch, Python, ODS, hardware...). Importar com:
//   npm run missions:import -- <e-mail do professor> scripts/missions/halloween.ts

const TITLE_PREFIX = 'Missão de Halloween Parte'

const MISSIONS_COUNT = 5
const QUESTIONS_PER_MISSION = 10

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

    const drawn = drawQuestions(sources, MISSIONS_COUNT, QUESTIONS_PER_MISSION, 31102026)

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
