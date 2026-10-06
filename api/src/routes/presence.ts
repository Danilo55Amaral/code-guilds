import { FastifyInstance } from "fastify";
import { sql } from "kysely";
import { db } from "../database";
import { ensureAuthenticated, ensureStudent } from "../middlewares/auth";

// ============================================================================
// STATUS ONLINE — quais alunos estão na plataforma agora.
//
// Enquanto o aluno está no site, o navegador manda um "sinal de vida" a cada
// 30 segundos (POST /presence). Está online quem deu sinal nos últimos
// ONLINE_WINDOW_SECONDS: a folga cobre os navegadores, que atrasam os timers
// das abas em segundo plano (até 1 vez por minuto). Fechou o site? Em até 90
// segundos ele aparece offline. Saiu da conta? Fica offline na hora (o logout
// apaga o sinal, em routes/auth.ts).
// Todo mundo logado pode ver quem está online (como a comunidade, em
// GET /students/community): o professor e o ADM acompanham a turma, e os
// alunos veem os amigos e os colegas nos rankings. Sai só o id de quem está
// online, nada mais.
// ============================================================================

export const ONLINE_WINDOW_SECONDS = 90

// O dia de hoje no horário de Brasília (o tempo online é somado por dia)
export const TODAY_IN_BRAZIL = sql`(now() at time zone 'America/Sao_Paulo')::date`

// Os ids dos alunos online agora
async function onlineStudentIds() {
    const rows = await db
        .selectFrom('studentPresence')
        .select('studentId')
        .where('lastSeenAt', '>', sql<Date>`now() - make_interval(secs => ${ONLINE_WINDOW_SECONDS})`)
        .execute()

    return rows.map((row) => row.studentId)
}

export async function presenceRoutes(app: FastifyInstance) {
    // Sinal de vida do aluno: marca que ele está online e já devolve quem
    // está online (assim o site faz uma chamada só a cada 30 segundos).
    // Também soma o tempo online do dia (student_activity_days, que alimenta
    // o dashboard do aluno): o tempo desde o sinal anterior conta se o aluno
    // ainda estava online (até ONLINE_WINDOW_SECONDS). Primeiro sinal depois
    // de sair da conta ou de um tempo fora não soma nada.
    // Sinal repetido em menos de 15 segundos (duas abas abertas, por exemplo)
    // não grava nada.
    app.post('/', { preHandler: ensureStudent }, async (request) => {
        const studentId = request.user!.id

        await db.transaction().execute(async (trx) => {
            // O tempo desde o último sinal, calculado pelo relógio do banco
            const previous = await trx
                .selectFrom('studentPresence')
                .select(sql<number>`extract(epoch from now() - last_seen_at)::float8`.as('elapsed'))
                .where('studentId', '=', studentId)
                .forUpdate()
                .executeTakeFirst()

            if (!previous) {
                await trx
                    .insertInto('studentPresence')
                    .values({ studentId })
                    .onConflict((oc) => oc.column('studentId').doNothing())
                    .execute()
                return
            }

            if (previous.elapsed < 15) return

            await trx
                .updateTable('studentPresence')
                .set({ lastSeenAt: sql`now()` })
                .where('studentId', '=', studentId)
                .execute()

            if (previous.elapsed > ONLINE_WINDOW_SECONDS) return

            const seconds = Math.round(previous.elapsed)

            await trx
                .insertInto('studentActivityDays')
                .values({ studentId, day: sql`${TODAY_IN_BRAZIL}`, onlineSeconds: seconds })
                .onConflict((oc) => oc
                    .columns(['studentId', 'day'])
                    .doUpdateSet({ onlineSeconds: sql`student_activity_days.online_seconds + ${seconds}` }))
                .execute()
        })

        return { online: await onlineStudentIds() }
    })

    // Consultando quem está online (o professor e o ADM, que não mandam sinal de vida)
    app.get('/', { preHandler: ensureAuthenticated }, async () => {
        return { online: await onlineStudentIds() }
    })
}
