import { FastifyInstance } from "fastify";
import { sql } from "kysely";
import { db } from "../database";

export async function healthRoutes(app: FastifyInstance) {
    // Conferindo se a API e o banco estão no ar (use pra testar o deploy).
    // Esta rota consulta o banco, então ela ACORDA o Neon: não use no cron.
    app.get('/', async () => {
        await sql`select 1`.execute(db)

        return { status: 'ok' }
    })

    // Só mantendo a API acordada: é esta que o cron-job.org chama a cada 10
    // minutos, pra o Render não colocar a API pra dormir no plano gratuito.
    // Ela NÃO toca no banco: assim o Neon pode dormir quando ninguém usa o
    // site e não gasta as 100 horas de processamento do plano gratuito.
    app.get('/ping', async () => {
        return { status: 'ok' }
    })
}
