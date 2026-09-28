import { Kysely } from "kysely";
import { DEFAULT_SHOP } from "../../../src/engine/shop";

// Coloca à venda os itens iniciais da Loja (os mesmos de src/engine/shop.ts),
// pra ela não abrir vazia. Só roda com a Loja vazia: se o ADM já mexeu nela
// (mesmo que tenha tirado tudo), o seed não recoloca nada.
export async function seed(db: Kysely<any>): Promise<void> {
    const any = await db.selectFrom('shop_items').select('id').executeTakeFirst()

    if (any) {
        console.log('A Loja já tem itens: o seed da Loja não fez nada.')
        return
    }

    for (const item of DEFAULT_SHOP) {
        await db
            .insertInto('shop_items')
            .values({
                id: item.id,
                name: item.name,
                icon: item.icon,
                description: item.description,
                rarity: item.rarity,
                price: item.price,
                value: item.value,
                xp: item.xp,
                cosmetic: item.cosmetic ? JSON.stringify(item.cosmetic) : null,
                slots: item.slots ?? null,
                hidden: item.hidden ?? false,
                event_item_key: item.eventItemKey ?? null,
                featured: item.featured,
                collection: item.collection ?? null,
                created_at: item.createdAt,
            })
            .execute()
    }

    console.log(`${DEFAULT_SHOP.length} itens iniciais colocados à venda na Loja.`)
}
