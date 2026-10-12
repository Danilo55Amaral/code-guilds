import { FastifyInstance } from "fastify";
import { sql } from "kysely";
import { db } from "../database";
import { ensureStudent } from "../middlewares/auth";
import { lockStudents, saveProgress } from "../services/progress";
import { studentsQuery } from "../utils/queries";
import { NotFoundError } from "../validation/validations";
import { TODAY_IN_BRAZIL } from "./presence";
import { DAILY_REWARD, applyDailyReward } from "../../../src/engine/dailyReward";

// ============================================================================
// RECOMPENSA DIÁRIA — no primeiro acesso do dia, o aluno ganha DAILY_REWARD
// (80 moedas e 120 XP, em src/engine/dailyReward.ts). O site pede ao abrir a
// Academia; o servidor é quem decide se já foi dada hoje.
//
// Uma recompensa só por dia: tudo numa transação, que começa gravando a linha
// do dia em daily_rewards (chave = aluno + dia de Brasília). Se a linha já
// existia, o aluno já ganhou a de hoje e nada muda. Se duas abas pedirem ao
// mesmo tempo, a segunda espera a primeira terminar e encontra a linha.
// ============================================================================

export async function dailyRewardRoutes(app: FastifyInstance) {
    // Pegando a recompensa de hoje (o aluno).
    // A resposta diz se ela foi dada agora (claimed) e, se foi, o que o aluno
    // ganhou e se subiu de nível; sempre volta o aluno atualizado.
    app.post('/', { preHandler: ensureStudent }, async (request) => {
        const studentId = request.user!.id

        const result = await db.transaction().execute(async (trx) => {
            const today = await trx
                .insertInto('dailyRewards')
                .values({ studentId, day: sql`${TODAY_IN_BRAZIL}`, xp: DAILY_REWARD.xp, coins: DAILY_REWARD.coins })
                .onConflict((oc) => oc.columns(['studentId', 'day']).doNothing())
                .returning('day')
                .executeTakeFirst()

            // a linha de hoje já existia: recompensa já recebida
            if (!today) return null

            const student = (await lockStudents(trx, [studentId])).get(studentId)

            if (!student) throw new NotFoundError('Aluno não encontrado!')

            const { student: rewarded, ...levels } = applyDailyReward(student)

            await saveProgress(trx, rewarded)

            return levels
        })

        const student = await studentsQuery().where('id', '=', studentId).executeTakeFirst()

        if (!result) return { claimed: false, student }

        return { claimed: true, reward: DAILY_REWARD, ...result, student }
    })
}
