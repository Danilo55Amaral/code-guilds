import { Mission, MissionContent, RewardItem } from "../../../src/engine/missions";
import { drawQuestions, questionKey } from "./sorteio";

// Missões do evento A Noite de Dracoding (o Halloween em 3 fases): 3 quizzes
// por fase, 10 perguntas cada. As perguntas vêm das missões de quiz que o
// PRÓPRIO professor já tem no banco, sorteadas e misturadas com as regras de
// scripts/missions/sorteio.ts: nenhuma pergunta se repete entre as 9 missões,
// e as 10 perguntas de cada uma vêm de 10 missões diferentes. Também ficam de
// fora as perguntas que já estão nas missões de outros eventos do professor
// (ex.: as Missões de Halloween Parte 1 a 5), pra não repetir pergunta. Importar com:
//   npm run missions:import -- <e-mail do professor> scripts/missions/dracoding.ts

const QUESTIONS_PER_MISSION = 10

// Treze badaladas na noite de 31 de outubro
const SEED = 1331102026

interface DracodingMission {
    phase: number
    title: string
    icon: string
    difficulty: MissionContent['difficulty']
    description: string
    rewardXp: number
    rewardCoins: number
    item: RewardItem
}

// Recompensas crescentes ao longo da trilha, como nas fases do Natal
const MISSIONS: DracodingMission[] = [
    // ---- Fase 1: A Colheita Maldita (cada missão purifica uma abóbora) ----
    {
        phase: 1,
        title: "O Milharal Sussurrante",
        icon: "🌽",
        difficulty: "medio",
        description: "Atravesse o milharal sem dar ouvidos aos sussurros do Espantabyte e purifique a primeira abóbora amaldiçoada.",
        rewardXp: 170,
        rewardCoins: 70,
        item: {
            name: "Espiga Encantada",
            icon: "🌽",
            description: "Uma espiga dourada colhida no milharal do Espantabyte, que brilha no escuro. Usar transforma a magia da colheita em XP.",
            rarity: "comum",
            value: 15,
            xp: 60,
        },
    },
    {
        phase: 1,
        title: "O Voo dos Corvos",
        icon: "🪶",
        difficulty: "medio",
        description: "Os corvos do Espantabyte guardam a segunda abóbora. Responda certo e faça a revoada fugir!",
        rewardXp: 190,
        rewardCoins: 80,
        item: {
            name: "Pena de Corvo Prateada",
            icon: "🪶",
            description: "Caiu de um dos corvos do Espantabyte quando a revoada fugiu. Usar transforma o voo em XP.",
            rarity: "raro",
            value: 30,
            xp: 100,
        },
    },
    {
        phase: 1,
        title: "O Coração de Palha",
        icon: "🎃",
        difficulty: "medio",
        description: "O último desafio da colheita: chegue até o espantalho e apague o fogo roxo da abóbora mais amaldiçoada.",
        rewardXp: 210,
        rewardCoins: 90,
        item: {
            name: "Semente de Abóbora Dourada",
            icon: "🌱",
            description: "Achada no coração de palha do Espantabyte. Dizem que dela nasce uma abóbora cuja luz nunca se apaga.",
            rarity: "epico",
            value: 60,
            xp: 0,
        },
    },
    // ---- Fase 2: A Lua de Sangue (cada missão restaura um Fragmento da Lua) ----
    {
        phase: 2,
        title: "As Ruas Uivantes",
        icon: "🐺",
        difficulty: "medio",
        description: "Atravesse as ruas de Codópolis enquanto a alcateia uiva nos telhados e recupere o primeiro Fragmento da Lua.",
        rewardXp: 220,
        rewardCoins: 90,
        item: {
            name: "Sininho de Prata",
            icon: "🔔",
            description: "Um sininho de prata da torre do relógio. Os lobisomens fogem do som dele. Usar transforma o tilintar em XP.",
            rarity: "raro",
            value: 35,
            xp: 120,
        },
    },
    {
        phase: 2,
        title: "O Circo Sombrio",
        icon: "🎪",
        difficulty: "medio",
        description: "Entre no circo de lona rasgada, passe pelos palhaços sombrios e pelo carrossel que gira ao contrário.",
        rewardXp: 240,
        rewardCoins: 100,
        item: {
            name: "Nariz de Palhaço Encantado",
            icon: "🔴",
            description: "O nariz de um palhaço sombrio que voltou a ser palhaço de verdade. Apertar (usar) faz fom-fom e dá XP.",
            rarity: "raro",
            value: 35,
            xp: 140,
        },
    },
    {
        phase: 2,
        title: "A Teia sobre os Telhados",
        icon: "🕸️",
        difficulty: "medio",
        description: "Suba nos telhados, escape das aranhas gigantes e encaixe o último Fragmento da Lua no lugar.",
        rewardXp: 260,
        rewardCoins: 110,
        item: {
            name: "Fio de Teia Prateado",
            icon: "🕸️",
            description: "Um fio de teia que ficou prateado quando a lua voltou a brilhar. Forte como aço, leve como pluma.",
            rarity: "epico",
            value: 70,
            xp: 0,
        },
    },
    // ---- Fase 3: O Castelo de Dracoding (cada missão acende um Vitral do Amanhecer) ----
    {
        phase: 3,
        title: "A Ponte dos Morcegos",
        icon: "🦇",
        difficulty: "avancado",
        description: "Atravesse a ponte de pedra até o castelo enquanto a revoada de morcegos tenta te derrubar.",
        rewardXp: 280,
        rewardCoins: 120,
        item: {
            name: "Asa de Morcego Cristalizada",
            icon: "🦇",
            description: "Uma asinha de morcego que virou cristal quando a luz do vitral bateu nela. Usar transforma o cristal em XP.",
            rarity: "raro",
            value: 40,
            xp: 160,
        },
    },
    {
        phase: 3,
        title: "O Caldeirão das Bruxas",
        icon: "🧹",
        difficulty: "avancado",
        description: "Passe pelo exército de vampiros e derrube o caldeirão de escuridão das bruxas do castelo.",
        rewardXp: 300,
        rewardCoins: 130,
        item: {
            name: "Vassoura Encantada",
            icon: "🧹",
            description: "A vassoura que uma bruxa largou na fuga. Ainda flutua um palmo acima do chão.",
            rarity: "epico",
            value: 80,
            xp: 0,
        },
    },
    {
        phase: 3,
        title: "O Trono de Dracoding",
        icon: "🧛",
        difficulty: "avancado",
        description: "O desafio final: diante do trono do Conde Dracoding, acenda o último Vitral do Amanhecer.",
        rewardXp: 340,
        rewardCoins: 150,
        item: {
            name: "Medalhão do Amanhecer",
            icon: "🌅",
            description: "O medalhão de rubi do Conde Dracoding, que ficou dourado com a primeira luz do amanhecer. Lembrança do dia em que Codópolis foi salva.",
            rarity: "lendario",
            value: 200,
            xp: 0,
        },
    },
]

export default function dracodingMissions(teacherMissions: Mission[], eventMissions: Mission[] = []): MissionContent[] {
    // As missões normais com perguntas; as que já estão em missões de evento ficam de fora
    const sources = teacherMissions.filter((m) => m.questions.length > 0)
    const used = new Set(eventMissions.flatMap((m) => m.questions.map(questionKey)))

    if (sources.length < QUESTIONS_PER_MISSION) {
        throw new Error(`O professor precisa ter pelo menos ${QUESTIONS_PER_MISSION} missões de quiz pra montar as de A Noite de Dracoding (tem ${sources.length}).`)
    }

    const drawn = drawQuestions(sources, MISSIONS.length, QUESTIONS_PER_MISSION, SEED, (q) => used.has(questionKey(q)))

    return MISSIONS.map((m, i) => ({
        title: m.title,
        icon: m.icon,
        difficulty: m.difficulty,
        minLevel: 1,
        description: m.description,
        rewardXp: m.rewardXp,
        rewardCoins: m.rewardCoins,
        rewardItem: m.item,
        kind: "quiz",
        questions: drawn[i],
        // Missão exclusiva do evento, na fase dela
        eventId: "dracoding",
        eventPhase: m.phase,
    }))
}
