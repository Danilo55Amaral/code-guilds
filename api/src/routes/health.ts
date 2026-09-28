import { FastifyInstance } from "fastify";
import { sql } from "kysely";
import { db } from "../database";

export async function healthRoutes(app: FastifyInstance) {
    // Conferindo se a API e o banco estão no ar.
    // O cron-job.org chama esta rota a cada 10 minutos pra o Render não
    // colocar a API pra dormir no plano gratuito.
    app.get('/', async () => {
        await sql`select 1`.execute(db)

        return { status: 'ok' }
    })
}
