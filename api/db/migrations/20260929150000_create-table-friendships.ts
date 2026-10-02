import { Kysely, sql } from "kysely";

// Amizades entre alunos: um pedido (pendente) que vira amizade (aceito).
// Trocar itens só é permitido entre amigos, por isso as amizades vieram pro
// servidor junto com as trocas. Excluir um aluno apaga as amizades dele.
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('friendships')
        .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('from_id', 'uuid', (col) => col.notNull().references('students.id').onDelete('cascade'))
        .addColumn('to_id', 'uuid', (col) => col.notNull().references('students.id').onDelete('cascade'))
        .addColumn('status', 'varchar(10)', (col) => col.notNull().defaultTo('pendente'))
        .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .addColumn('accepted_at', 'timestamptz')
        .addCheckConstraint('friendships_status_check', sql`status in ('pendente', 'aceito')`)
        .addCheckConstraint('friendships_not_self_check', sql`from_id <> to_id`)
        .execute()

    // Só pode existir UMA ligação entre dois alunos, não importa quem mandou o
    // pedido: o índice único usa o menor e o maior id do par (least/greatest).
    await sql`create unique index friendships_pair_index on friendships (least(from_id, to_id), greatest(from_id, to_id))`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('friendships').execute()
}
