import { Kysely, sql } from "kysely";

// Tabela de sessões (quem está logado). Cada sessão é de um professor OU de
// um aluno, nunca dos dois. O token em si fica só no cookie do navegador: aqui
// guardamos apenas o hash dele (token_hash), então quem ler o banco não
// consegue entrar na conta de ninguém.
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('sessions')
        .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('token_hash', 'varchar(64)', (col) => col.notNull().unique())
        .addColumn('teacher_id', 'uuid', (col) => col.references('teachers.id').onDelete('cascade'))
        .addColumn('student_id', 'uuid', (col) => col.references('students.id').onDelete('cascade'))
        .addColumn('expires_at', 'timestamptz', (col) => col.notNull())
        .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .addCheckConstraint('sessions_owner_check', sql`(teacher_id is null) <> (student_id is null)`)
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('sessions').execute()
}
