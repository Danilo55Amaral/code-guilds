import { PostgresDialect } from "kysely";
import { defineConfig, getKnexTimestampPrefix } from "kysely-ctl";
import { Pool } from "pg";
import { config } from "dotenv";

config({ quiet: true })

// Configuração do kysely-ctl, a CLI que roda as migrations e os seeds.
// O prefixo no padrão do Knex deixa os arquivos com a data e a hora no nome
// (ex.: 20260928120000_create-table-teachers.ts), igual ao SPE System.
export default defineConfig({
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: process.env.DATABASE_URL,
        }),
    }),
    migrations: {
        migrationFolder: 'db/migrations',
        getMigrationPrefix: getKnexTimestampPrefix,
    },
    seeds: {
        seedFolder: 'db/seeds',
        getSeedPrefix: getKnexTimestampPrefix,
    },
})
