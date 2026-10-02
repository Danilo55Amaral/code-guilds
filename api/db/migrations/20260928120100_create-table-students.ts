import { Kysely, sql } from "kysely";

// Tabela de alunos. Cada aluno pertence a um professor (teacher_id).
// As regras (check) garantem no próprio banco que moedas e XP nunca ficam
// negativos e que casa e etapa do primeiro acesso só aceitam valores válidos.
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('students')
        .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('teacher_id', 'uuid', (col) => col.notNull().references('teachers.id').onDelete('restrict'))
        .addColumn('name', 'varchar(90)', (col) => col.notNull())
        .addColumn('email', 'varchar(160)', (col) => col.notNull())
        .addColumn('turma', 'varchar(40)', (col) => col.notNull())
        .addColumn('username', 'varchar(40)', (col) => col.notNull().unique())
        .addColumn('password_hash', 'text')
        .addColumn('house_id', 'varchar(20)')
        .addColumn('avatar', 'jsonb', (col) => col.notNull().defaultTo(sql`'{}'::jsonb`))
        .addColumn('level', 'integer', (col) => col.notNull().defaultTo(1))
        .addColumn('xp', 'integer', (col) => col.notNull().defaultTo(0))
        .addColumn('coins', 'integer', (col) => col.notNull().defaultTo(0))
        .addColumn('onboarding_step', 'varchar(10)', (col) => col.notNull().defaultTo('casa'))
        .addColumn('tutorial_done', 'boolean', (col) => col.notNull().defaultTo(false))
        .addColumn('bonus_slots', 'integer', (col) => col.notNull().defaultTo(0))
        .addColumn('multiverse_access', 'timestamptz')
        .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .addCheckConstraint('students_level_check', sql`level >= 1`)
        .addCheckConstraint('students_xp_check', sql`xp >= 0`)
        .addCheckConstraint('students_coins_check', sql`coins >= 0`)
        .addCheckConstraint('students_bonus_slots_check', sql`bonus_slots >= 0`)
        .addCheckConstraint('students_house_check', sql`house_id in ('ignis', 'noctis', 'flavus', 'sapientia')`)
        .addCheckConstraint('students_onboarding_check', sql`onboarding_step in ('casa', 'avatar', 'completo')`)
        .execute()

    // Índice pra buscar rápido os alunos de um professor
    await db.schema
        .createIndex('students_teacher_id_index')
        .on('students')
        .column('teacher_id')
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('students').execute()
}
