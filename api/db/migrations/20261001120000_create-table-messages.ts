import { Kysely, sql } from "kysely";

// Mensagens que o aluno recebe (o sininho e a caixa de Mensagens): avisos e
// mensagens do professor, comunicados pra turma ou pra uma casa, e as
// mensagens automáticas da plataforma (missão concluída, compra, venda,
// troca, presente, amizade, entrega).
// - sender_id nulo = mensagem automática da plataforma. Se o professor for
//   excluído, as mensagens dele continuam com o aluno (on delete set null).
// - Um comunicado vira uma linha por aluno, todas com o mesmo broadcast_id:
//   assim cada aluno tem o próprio read_at e o professor vê quantos leram.
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('messages')
        .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('student_id', 'uuid', (col) => col.notNull().references('students.id').onDelete('cascade'))
        .addColumn('sender_id', 'uuid', (col) => col.references('teachers.id').onDelete('set null'))
        .addColumn('kind', 'varchar(10)', (col) => col.notNull())
        .addColumn('body', 'text', (col) => col.notNull())
        .addColumn('audience', 'jsonb')
        .addColumn('broadcast_id', 'uuid')
        .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .addColumn('read_at', 'timestamptz')
        .addCheckConstraint('messages_kind_check', sql`kind in ('aviso', 'mensagem', 'presente', 'missao', 'compra', 'venda', 'amizade', 'troca', 'entrega')`)
        .addCheckConstraint('messages_body_check', sql`char_length(body) between 1 and 3000`)
        .execute()

    // A caixa de cada aluno é lida sempre em ordem de data
    await db.schema
        .createIndex('messages_student_index')
        .on('messages')
        .columns(['student_id', 'created_at'])
        .execute()

    // Os comunicados de um professor são agrupados pelo broadcast_id
    await db.schema
        .createIndex('messages_broadcast_index')
        .on('messages')
        .column('broadcast_id')
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('messages').execute()
}
