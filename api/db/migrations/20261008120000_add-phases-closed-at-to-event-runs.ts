import { Kysely, sql } from "kysely";

// Evento em fases: o professor (ou o ADM) libera e encerra cada fase quando
// quiser. phases_closed_at guarda quando cada fase foi encerrada (a posição 0
// é a Fase 1; null = aberta). Só acrescenta a coluna: as agendas que já existem
// continuam iguais (nenhuma fase encerrada) e nada dos alunos muda.
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('event_runs')
        .addColumn('phases_closed_at', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.alterTable('event_runs').dropColumn('phases_closed_at').execute()
}
