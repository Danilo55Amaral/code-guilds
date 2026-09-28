import { Kysely, sql } from "kysely";

// Agenda dos eventos: cada professor decide quando um evento começa e termina
// pra turma dele (e o ADM, por qualquer professor). Uma linha por professor e
// evento. Evento em fases (Natal): phases_released_at guarda quando cada fase
// foi liberada (a posição 0 é a Fase 1). Excluir o professor apaga a agenda
// dele (os alunos passam pro herdeiro, que tem a própria agenda).
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('event_runs')
        .addColumn('teacher_id', 'uuid', (col) => col.notNull().references('teachers.id').onDelete('cascade'))
        .addColumn('event_id', 'varchar(20)', (col) => col.notNull())
        .addColumn('status', 'varchar(10)', (col) => col.notNull())
        .addColumn('started_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .addColumn('ended_at', 'timestamptz')
        .addColumn('phases_released_at', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
        .addPrimaryKeyConstraint('event_runs_pkey', ['teacher_id', 'event_id'])
        .addCheckConstraint('event_runs_status_check', sql`status in ('ativo', 'encerrado')`)
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('event_runs').execute()
}
