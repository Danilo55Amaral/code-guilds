import { Kysely, sql } from "kysely";

// Fase 3: o progresso do jogo passa a ser guardado no servidor.
// Nível, XP, moedas, espaços extras e o passe do Multiverso já eram colunas;
// aqui entram o inventário e o resto, em jsonb, com exatamente o mesmo
// formato que o site usa (InventoryItem, equipped etc., em src/engine/students.ts).
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('students')
        .addColumn('inventory', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
        .addColumn('pending_items', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
        .addColumn('equipped', 'jsonb', (col) => col.notNull().defaultTo(sql`'{}'::jsonb`))
        .addColumn('completed_mission_ids', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
        .addColumn('events', 'jsonb', (col) => col.notNull().defaultTo(sql`'{}'::jsonb`))
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('students')
        .dropColumn('inventory')
        .dropColumn('pending_items')
        .dropColumn('equipped')
        .dropColumn('completed_mission_ids')
        .dropColumn('events')
        .execute()
}
