import { Kysely, sql } from "kysely";

// Mensagens do aluno pro professor dele (dúvida de missão, ajuda com
// entrega, problema na plataforma...). O professor lê e responde; a resposta
// fica na própria linha (reply) e também chega na caixa de Mensagens do aluno.
// - teacher_id é o professor do aluno quando ele escreveu. A exclusão do
//   professor passa essas mensagens pro herdeiro (on delete restrict).
// - mission_id não é chave estrangeira: a missão pode ser excluída depois e a
//   mensagem continua existindo.
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('teacher_messages')
        .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('student_id', 'uuid', (col) => col.notNull().references('students.id').onDelete('cascade'))
        .addColumn('teacher_id', 'uuid', (col) => col.notNull().references('teachers.id').onDelete('restrict'))
        .addColumn('topic', 'varchar(20)', (col) => col.notNull())
        .addColumn('mission_id', 'varchar(120)')
        .addColumn('body', 'text', (col) => col.notNull())
        .addColumn('sent_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .addColumn('read_at', 'timestamptz')
        .addColumn('reply', 'text')
        .addColumn('replied_at', 'timestamptz')
        .addColumn('replier_name', 'varchar(90)')
        .addCheckConstraint('teacher_messages_topic_check', sql`topic in ('duvida-missao', 'ajuda-entrega', 'problema', 'outro')`)
        .addCheckConstraint('teacher_messages_body_check', sql`char_length(body) between 1 and 1000`)
        .addCheckConstraint('teacher_messages_reply_check', sql`reply is null or char_length(reply) between 1 and 1000`)
        .execute()

    await db.schema
        .createIndex('teacher_messages_teacher_index')
        .on('teacher_messages')
        .column('teacher_id')
        .execute()

    await db.schema
        .createIndex('teacher_messages_student_index')
        .on('teacher_messages')
        .column('student_id')
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('teacher_messages').execute()
}
