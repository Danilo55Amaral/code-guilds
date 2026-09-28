import { Kysely, sql } from "kysely";

// Tabela de professores. O ADM também é um professor, com is_admin = true.
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('teachers')
        .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('name', 'varchar(90)', (col) => col.notNull())
        .addColumn('email', 'varchar(160)', (col) => col.notNull().unique())
        .addColumn('password_hash', 'text', (col) => col.notNull())
        .addColumn('is_admin', 'boolean', (col) => col.notNull().defaultTo(false))
        .addColumn('tutorial_done', 'boolean', (col) => col.notNull().defaultTo(false))
        .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('teachers').execute()
}
