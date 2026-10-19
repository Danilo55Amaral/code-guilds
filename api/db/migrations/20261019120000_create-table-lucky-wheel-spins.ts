import { Kysely, sql } from "kysely";

// Roleta da Sorte (Loja): todo dia o aluno tem um giro grátis e, depois dele,
// cada giro custa moedas (POST /lucky-wheel/spin). Uma tabela nova, só de
// registro: uma linha por giro, com o dia (horário de Brasília), quanto
// custou (0 = o giro grátis) e o prêmio que saiu. O índice único parcial
// (student_id, day) where cost = 0 é o que garante um giro grátis só por dia,
// mesmo com duas abas girando ao mesmo tempo. Não mexe em nada que os alunos
// já têm. Excluir o aluno apaga as linhas dele.
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('lucky_wheel_spins')
        .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('student_id', 'uuid', (col) => col.notNull().references('students.id').onDelete('cascade'))
        .addColumn('day', 'date', (col) => col.notNull())
        .addColumn('cost', 'integer', (col) => col.notNull())
        .addColumn('prize_key', 'varchar(60)', (col) => col.notNull())
        .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .addCheckConstraint('lucky_wheel_spins_cost_check', sql`cost >= 0`)
        .execute()

    // Um giro grátis por aluno por dia
    await db.schema
        .createIndex('lucky_wheel_spins_free_daily_unique')
        .on('lucky_wheel_spins')
        .columns(['student_id', 'day'])
        .unique()
        .where(sql.ref('cost'), '=', 0)
        .execute()

    // A API confere os giros de hoje do aluno
    await db.schema
        .createIndex('lucky_wheel_spins_student_index')
        .on('lucky_wheel_spins')
        .columns(['student_id', 'day'])
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('lucky_wheel_spins').execute()
}
