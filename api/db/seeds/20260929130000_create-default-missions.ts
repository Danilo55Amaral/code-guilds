import { Kysely } from "kysely";
import { MISSIONS } from "../../../src/engine/missions";

// Cria as missões de exemplo do site (as mesmas de src/engine/missions.ts)
// como missões do ADM. As que já existem (mesmo id) ficam como estão, então
// dá pra rodar o seed quantas vezes quiser.
// Roda depois do seed do ADM (os seeds rodam em ordem de nome).
export async function seed(db: Kysely<any>): Promise<void> {
    const admin = await db
        .selectFrom('teachers')
        .select('id')
        .where('is_admin', '=', true)
        .orderBy('created_at', 'asc')
        .executeTakeFirst()

    if (!admin) {
        console.log('Nenhum ADM cadastrado: rode o seed do ADM antes das missões.')
        return
    }

    let created = 0

    for (const mission of MISSIONS) {
        const exists = await db.selectFrom('missions').select('id').where('id', '=', mission.id).executeTakeFirst()
        if (exists) continue

        await db
            .insertInto('missions')
            .values({
                id: mission.id,
                teacher_id: admin.id,
                title: mission.title,
                icon: mission.icon,
                difficulty: mission.difficulty,
                min_level: mission.minLevel,
                description: mission.description,
                reward_xp: mission.rewardXp,
                reward_coins: mission.rewardCoins,
                reward_item: JSON.stringify(mission.rewardItem),
                questions: JSON.stringify(mission.questions),
                kind: mission.kind ?? 'quiz',
                task: mission.task ? JSON.stringify(mission.task) : null,
                event_id: mission.eventId ?? null,
                event_phase: mission.eventPhase ?? null,
            })
            .execute()

        created++
    }

    console.log(`${created} missões de exemplo criadas para o ADM.`)
}
