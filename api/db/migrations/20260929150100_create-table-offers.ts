import { Kysely, sql } from "kysely";

// Ofertas de venda entre alunos (o Mercado). O item sai do inventário de
// quem vende e fica guardado aqui (item, em jsonb) até o comprador aceitar
// ou recusar. Excluir o vendedor apaga as ofertas dele; o que acontece com as
// ofertas que um aluno excluído RECEBEU (o item volta pro vendedor) é feito
// pela rota de exclusão do aluno.
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('offers')
        .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('seller_id', 'uuid', (col) => col.notNull().references('students.id').onDelete('cascade'))
        .addColumn('buyer_id', 'uuid', (col) => col.notNull().references('students.id').onDelete('cascade'))
        .addColumn('item', 'jsonb', (col) => col.notNull())
        .addColumn('price', 'integer', (col) => col.notNull())
        .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .addCheckConstraint('offers_price_check', sql`price >= 0`)
        .addCheckConstraint('offers_not_self_check', sql`seller_id <> buyer_id`)
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('offers').execute()
}
