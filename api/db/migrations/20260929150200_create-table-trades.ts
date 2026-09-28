import { Kysely, sql } from "kysely";

// Propostas de troca entre amigos. Os itens oferecidos saem do inventário de
// quem propõe e ficam guardados aqui (offered) até o amigo decidir; os itens
// pedidos continuam com o amigo (requested_ids, mais uma cópia em requested
// pra mostrar na tela). Excluir quem propôs apaga as propostas dele; as que
// um aluno excluído RECEBEU devolvem os itens (rota de exclusão do aluno).
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('trades')
        .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('from_id', 'uuid', (col) => col.notNull().references('students.id').onDelete('cascade'))
        .addColumn('to_id', 'uuid', (col) => col.notNull().references('students.id').onDelete('cascade'))
        .addColumn('offered', 'jsonb', (col) => col.notNull())
        .addColumn('requested_ids', 'jsonb', (col) => col.notNull())
        .addColumn('requested', 'jsonb', (col) => col.notNull())
        .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .addCheckConstraint('trades_not_self_check', sql`from_id <> to_id`)
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('trades').execute()
}
