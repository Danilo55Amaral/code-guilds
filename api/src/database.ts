import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { env } from "./env";
import { DB } from "./types/database";

// Conexão com o banco de dados. O CamelCasePlugin faz a tradução dos nomes:
// no banco as colunas são snake_case (teacher_id) e no código são camelCase
// (teacherId), sem precisar de aspas nas consultas.
export const db = new Kysely<DB>({
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: env.DATABASE_URL,
            max: 10,
        }),
    }),
    plugins: [new CamelCasePlugin()],
})
