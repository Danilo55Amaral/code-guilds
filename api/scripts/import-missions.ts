import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { db } from "../src/database";
import { checkMissionContent, missionBodySchema, newMissionId } from "../src/routes/missions";
import { normalizeEmail } from "../src/utils/normalize";
import { Json } from "../src/types/database";

// ============================================================================
// IMPORTAR MISSÕES — cadastra de uma vez as missões de um arquivo pra um
// professor, sem digitar pergunta por pergunta no editor do site.
//
//   npm run missions:import -- <e-mail do professor> <arquivo de missões>
//   ex.: npm run missions:import -- professor@escola.com scripts/missions/scratch-ods.ts
//
// O arquivo exporta (export default) uma lista de missões no formato do site
// (MissionContent, em src/engine/missions.ts). Cada missão passa pelas mesmas
// regras da rota POST /missions. Se o professor já tem uma missão com o mesmo
// título, ela é pulada: dá pra rodar o comando de novo sem duplicar nada.
// ============================================================================

async function importMissions() {
    const [rawEmail, file] = process.argv.slice(2)

    if (!rawEmail || !file) {
        console.log('Uso: npm run missions:import -- <e-mail do professor> <arquivo de missões>')
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

    const module = await import(pathToFileURL(resolve(file)).href)
    const missions: unknown[] = module.default?.default ?? module.default

    // Confere todas antes de gravar a primeira: um erro no arquivo não deixa
    // metade das missões cadastrada
    const bodies = missions.map((mission) => {
        const body = missionBodySchema.parse(mission)
        checkMissionContent(body)
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
            })
            .execute()

        console.log(`+ "${body.title}" (${body.questions?.length ?? 0} perguntas)`)
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
