import { Kysely, sql } from "kysely";

// Tabela de missões. Cada missão é de um professor; os alunos dele veem as
// missões dele. O id continua sendo o "slug" do título (ex.: loops-com-for),
// o mesmo formato do site, porque os alunos guardam as missões feitas
// (completed_mission_ids) por esse id.
// As partes aninhadas (item de recompensa, perguntas do quiz e a tarefa da
// missão de entrega) ficam em jsonb, no formato de src/engine/missions.ts.
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('missions')
        .addColumn('id', 'varchar(120)', (col) => col.primaryKey())
        .addColumn('teacher_id', 'uuid', (col) => col.notNull().references('teachers.id').onDelete('restrict'))
        .addColumn('title', 'varchar(120)', (col) => col.notNull())
        .addColumn('icon', 'varchar(32)', (col) => col.notNull())
        .addColumn('difficulty', 'varchar(12)', (col) => col.notNull())
        .addColumn('min_level', 'integer', (col) => col.notNull().defaultTo(1))
        .addColumn('description', 'text', (col) => col.notNull().defaultTo(''))
        .addColumn('reward_xp', 'integer', (col) => col.notNull().defaultTo(0))
        .addColumn('reward_coins', 'integer', (col) => col.notNull().defaultTo(0))
        .addColumn('reward_item', 'jsonb', (col) => col.notNull())
        .addColumn('questions', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
        .addColumn('kind', 'varchar(10)', (col) => col.notNull().defaultTo('quiz'))
        .addColumn('task', 'jsonb')
        .addColumn('event_id', 'varchar(40)')
        .addColumn('event_phase', 'integer')
        .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .addCheckConstraint('missions_difficulty_check', sql`difficulty in ('iniciante', 'medio', 'avancado', 'epico')`)
        .addCheckConstraint('missions_kind_check', sql`kind in ('quiz', 'entrega')`)
        .addCheckConstraint('missions_min_level_check', sql`min_level >= 1`)
        .addCheckConstraint('missions_rewards_check', sql`reward_xp >= 0 and reward_coins >= 0`)
        .execute()

    // Índice pra buscar rápido as missões de um professor
    await db.schema
        .createIndex('missions_teacher_id_index')
        .on('missions')
        .column('teacher_id')
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('missions').execute()
}
