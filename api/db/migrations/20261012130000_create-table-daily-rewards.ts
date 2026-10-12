import { Kysely, sql } from "kysely";

// Recompensa diária: no primeiro acesso do dia, o aluno ganha moedas e XP
// (POST /daily-reward). Uma tabela nova, só de registro: uma linha por aluno
// por dia (o dia é o do horário de Brasília), com o que ele ganhou. A chave
// (student_id, day) é o que garante uma recompensa só por dia, mesmo com duas
// abas pedindo ao mesmo tempo. Não mexe em nada que os alunos já têm.
// Excluir o aluno apaga as linhas dele.
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('daily_rewards')
        .addColumn('student_id', 'uuid', (col) => col.notNull().references('students.id').onDelete('cascade'))
        .addColumn('day', 'date', (col) => col.notNull())
        .addColumn('xp', 'integer', (col) => col.notNull())
        .addColumn('coins', 'integer', (col) => col.notNull())
        .addColumn('claimed_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .addPrimaryKeyConstraint('daily_rewards_pkey', ['student_id', 'day'])
        .addCheckConstraint('daily_rewards_amounts_check', sql`xp >= 0 and coins >= 0`)
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('daily_rewards').execute()
}
