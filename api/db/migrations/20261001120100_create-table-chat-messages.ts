import { Kysely, sql } from "kysely";

// Conversa entre amigos. Só existem balões prontos: a mensagem guarda apenas
// o id do balão (phrase_id) e o texto vem do catálogo do site
// (CHAT_PHRASE_GROUPS em src/engine/friends.ts). Assim nenhum texto livre
// entra na conversa. Cada conversa guarda as últimas 200 mensagens (a rota
// apaga as mais antigas) e some quando a amizade é desfeita.
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('chat_messages')
        .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('from_id', 'uuid', (col) => col.notNull().references('students.id').onDelete('cascade'))
        .addColumn('to_id', 'uuid', (col) => col.notNull().references('students.id').onDelete('cascade'))
        .addColumn('phrase_id', 'varchar(40)', (col) => col.notNull())
        .addColumn('sent_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .addColumn('read_at', 'timestamptz')
        .addCheckConstraint('chat_messages_not_self_check', sql`from_id <> to_id`)
        .execute()

    // Uma conversa é o par de alunos, não importa quem mandou (least/greatest)
    await sql`create index chat_messages_pair_index on chat_messages (least(from_id, to_id), greatest(from_id, to_id), sent_at)`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('chat_messages').execute()
}
