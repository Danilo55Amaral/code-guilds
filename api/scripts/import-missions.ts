import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { db } from "../src/database";
import { checkMissionContent, missionBodySchema, newMissionId } from "../src/routes/missions";
import { normalizeEmail } from "../src/utils/normalize";
import { Json } from "../src/types/database";
import { getEvent } from "../../src/engine/specialEvents";
import { Mission } from "../../src/engine/missions";

// ============================================================================
// IMPORTAR MISSÕES — cadastra de uma vez as missões de um ou mais arquivos pra
// um professor, sem digitar pergunta por pergunta no editor do site.
//
//   npm run missions:import -- <e-mail do professor> <arquivo> [outros arquivos...]
//   ex.: npm run missions:import -- professor@escola.com scripts/missions/programacao-12-anos.ts
//
// Cada arquivo exporta (export default) uma lista de missões no formato do site
// (ou uma função que monta a lista a partir das missões que o professor já tem)
// (MissionContent, em src/engine/missions.ts). Cada missão passa pelas mesmas
// regras da rota POST /missions; missões de evento levam o eventId (e o
// eventPhase, nos eventos em fases). Se o professor já tem uma missão com o mesmo
// título, ela é pulada: dá pra rodar o comando de novo sem duplicar nada.
// ============================================================================

// As missões de quiz do professor, no formato do site e sempre na mesma ordem:
// as normais (`events` = false) ou só as de evento (`events` = true)
async function quizMissionsOf(teacherId: string, events = false): Promise<Mission[]> {
    const rows = await db
        .selectFrom('missions')
        .selectAll()
        .where('teacherId', '=', teacherId)
        .where('kind', '=', 'quiz')
        .where('eventId', events ? 'is not' : 'is', null)
        .orderBy('id')
        .execute()

    return rows as unknown as Mission[]
}

async function importMissions() {
    const [rawEmail, ...files] = process.argv.slice(2)

    if (!rawEmail || files.length === 0) {
        console.log('Uso: npm run missions:import -- <e-mail do professor> <arquivo> [outros arquivos...]')
        process.exitCode = 1
        return
    }

    const email = normalizeEmail(rawEmail)

    const teacher = await db
        .selectFrom('teachers')
        .select(['id', 'name'])
        .where('email', '=', email)
        .executeTakeFirst()

    if (!teacher) {
        console.log(`Nenhum professor com o e-mail ${email}.`)
        process.exitCode = 1
        return
    }

    const missions: unknown[] = []

    for (const file of files) {
        const module = await import(pathToFileURL(resolve(file)).href)
        const exported = module.default?.default ?? module.default

        // O arquivo pode exportar uma função em vez de uma lista: ela recebe
        // as missões de quiz que o professor já tem no banco (as normais e as
        // de evento) e monta as novas a partir delas (ex.: scripts/missions/halloween.ts)
        missions.push(...(typeof exported === 'function' ? exported(await quizMissionsOf(teacher.id), await quizMissionsOf(teacher.id, true)) : exported))
    }

    // Confere todas antes de gravar a primeira: um erro num arquivo não deixa
    // metade das missões cadastrada
    const bodies = missions.map((mission) => {
        const body = missionBodySchema.parse(mission)
        checkMissionContent(body)

        // Missão de evento (ex.: Halloween): o evento tem que existir no site
        if (body.eventId && !getEvent(body.eventId)) {
            throw new Error(`A missão "${body.title}" é de um evento que não existe: ${body.eventId}.`)
        }

        return body
    })

    let created = 0

    for (const body of bodies) {
        const exists = await db
            .selectFrom('missions')
            .select('id')
            .where('teacherId', '=', teacher.id)
            .where('title', '=', body.title!)
            .executeTakeFirst()

        if (exists) {
            console.log(`- "${body.title}" já existe, pulei.`)
            continue
        }

        await db
            .insertInto('missions')
            .values({
                id: await newMissionId(body.title!),
                teacherId: teacher.id,
                title: body.title!,
                icon: body.icon!,
                difficulty: body.difficulty!,
                minLevel: body.minLevel ?? 1,
                description: body.description ?? '',
                rewardXp: body.rewardXp ?? 0,
                rewardCoins: body.rewardCoins ?? 0,
                rewardItem: JSON.stringify(body.rewardItem) as Json,
                questions: JSON.stringify(body.questions ?? []) as Json,
                kind: body.kind ?? 'quiz',
                eventId: body.eventId ?? null,
                eventPhase: body.eventPhase ?? null,
            })
            .execute()

        const event = body.eventId ? ` no evento ${getEvent(body.eventId)!.title}` : ''
        console.log(`+ "${body.title}" (${body.questions?.length ?? 0} perguntas)${event}`)
        created++
    }

    console.log(`${created} missões criadas para ${teacher.name}.`)
}

importMissions()
    .catch((error) => {
        console.error('Não deu pra importar as missões:', error)
        process.exitCode = 1
    })
    .finally(() => db.destroy())
