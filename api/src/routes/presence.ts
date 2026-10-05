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
    // O "where" no update evita gravar de novo se o último sinal foi há menos
    // de 15 segundos (duas abas abertas, por exemplo).
    app.post('/', { preHandler: ensureStudent }, async (request) => {
        const studentId = request.user!.id

        await db
            .insertInto('studentPresence')
            .values({ studentId })
            .onConflict((oc) => oc
                .column('studentId')
                .doUpdateSet({ lastSeenAt: sql`now()` })
                .where('studentPresence.lastSeenAt', '<', sql<Date>`now() - interval '15 seconds'`))
            .execute()

        return { online: await onlineStudentIds() }
    })

    // Consultando quem está online (o professor e o ADM, que não mandam sinal de vida)
    app.get('/', { preHandler: ensureAuthenticated }, async () => {
        return { online: await onlineStudentIds() }
    })
}
