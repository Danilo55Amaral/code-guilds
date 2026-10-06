import { Kysely, sql } from "kysely";

// Status online dos alunos: quando cada aluno deu o último "sinal de vida"
// (o site manda um a cada 30 segundos enquanto o aluno está na plataforma).
// Está online quem deu sinal há pouco (veja routes/presence.ts).
// Tabela separada de students de propósito: o sinal de vida é escrito o
// tempo todo, e assim ele nunca encosta nos dados dos alunos (progresso,
// itens, missões). Uma linha por aluno; excluir o aluno apaga a linha.
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('student_presence')
        .addColumn('student_id', 'uuid', (col) => col.primaryKey().references('students.id').onDelete('cascade'))
        .addColumn('last_seen_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .execute()

    // A lista de quem está online filtra pelo horário do último sinal
    await db.schema
        .createIndex('student_presence_last_seen_index')
        .on('student_presence')
        .column('last_seen_at')
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('student_presence').execute()
}
