import { Kysely, sql } from "kysely";

// Tabela da Loja da Academia. O ADM cadastra os itens (ou coloca coleções
// inteiras à venda) e os alunos compram com moedas. O formato é o mesmo do
// ShopItem do site (src/engine/shop.ts); o visual do avatar fica em jsonb.
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('shop_items')
        .addColumn('id', 'varchar(80)', (col) => col.primaryKey())
        .addColumn('name', 'varchar(60)', (col) => col.notNull())
        .addColumn('icon', 'varchar(32)', (col) => col.notNull())
        .addColumn('description', 'text', (col) => col.notNull())
        .addColumn('rarity', 'varchar(10)', (col) => col.notNull())
        .addColumn('price', 'integer', (col) => col.notNull())
        .addColumn('value', 'integer', (col) => col.notNull().defaultTo(0))
        .addColumn('xp', 'integer', (col) => col.notNull().defaultTo(0))
        .addColumn('cosmetic', 'jsonb')
        .addColumn('slots', 'integer')
        .addColumn('hidden', 'boolean', (col) => col.notNull().defaultTo(false))
        .addColumn('event_item_key', 'varchar(80)')
        .addColumn('featured', 'boolean', (col) => col.notNull().defaultTo(false))
        .addColumn('collection', 'varchar(20)')
        .addColumn('sold', 'integer', (col) => col.notNull().defaultTo(0))
        .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .addCheckConstraint('shop_items_rarity_check', sql`rarity in ('comum', 'raro', 'epico', 'lendario')`)
        .addCheckConstraint('shop_items_price_check', sql`price >= 1`)
        .addCheckConstraint('shop_items_numbers_check', sql`value >= 0 and xp >= 0 and sold >= 0`)
        .addCheckConstraint('shop_items_slots_check', sql`slots is null or (slots >= 1 and slots <= 200)`)
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('shop_items').execute()
}
