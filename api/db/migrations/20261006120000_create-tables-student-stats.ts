import { Kysely, sql } from "kysely";

// Dados do dashboard do aluno (o professor e o ADM abrem pela ficha do aluno).
// Duas tabelas novas, só de registro: nenhuma mexe nos dados que o aluno já
// tem (progresso, itens, missões). Excluir o aluno apaga as linhas dele.
//
// - student_activity_days: quanto tempo o aluno ficou online em cada dia. O
//   sinal de vida (POST /presence) soma o tempo desde o sinal anterior, se ele
//   ainda estava online. O dia é o do horário de Brasília.
// - quiz_attempts: cada tentativa de quiz, com quantas perguntas o aluno
//   acertou. É daqui que sai a média de acertos e erros. Excluir a missão
//   apaga as tentativas dela.
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('student_activity_days')
        .addColumn('student_id', 'uuid', (col) => col.notNull().references('students.id').onDelete('cascade'))
        .addColumn('day', 'date', (col) => col.notNull())
        .addColumn('online_seconds', 'integer', (col) => col.notNull().defaultTo(0))
        .addPrimaryKeyConstraint('student_activity_days_pkey', ['student_id', 'day'])
        .addCheckConstraint('student_activity_days_seconds_check', sql`online_seconds >= 0`)
        .execute()

    await db.schema
        .createTable('quiz_attempts')
        .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('student_id', 'uuid', (col) => col.notNull().references('students.id').onDelete('cascade'))
        .addColumn('mission_id', 'varchar(120)', (col) => col.notNull().references('missions.id').onDelete('cascade'))
        .addColumn('correct', 'integer', (col) => col.notNull())
        .addColumn('total', 'integer', (col) => col.notNull())
        .addColumn('passed', 'boolean', (col) => col.notNull())
        .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .addCheckConstraint('quiz_attempts_score_check', sql`total >= 0 and correct between 0 and total`)
        .execute()

    // O dashboard lê as tentativas de um aluno em ordem de data
    await db.schema
        .createIndex('quiz_attempts_student_index')
        .on('quiz_attempts')
        .columns(['student_id', 'created_at'])
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('quiz_attempts').execute()
    await db.schema.dropTable('student_activity_days').execute()
}
