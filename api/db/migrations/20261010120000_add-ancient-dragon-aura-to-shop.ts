import { Kysely } from "kysely";

// A Aura do Dragão Ancestral entra à venda na Loja por 15.000 moedas: um dragão
// escuro de asas vermelhas enrolado atrás do aluno, todo animado. Depois o ADM
// muda o preço (e o resto) quando quiser, no Painel ADM. Só acrescenta um item
// na Loja: nada dos alunos muda.
//
// Numa Loja vazia (banco novo) não faz nada, porque aí o seed coloca os itens
// iniciais, que já trazem a aura (ANCIENT_DRAGON_AURA_SHOP em src/engine/shop.ts).
// Se o item (mesmo id) ou esse visual já estiver à venda, não entra de novo.
const ITEM = {
    id: 'loja-aura-dragao-ancestral',
    name: 'Aura do Dragão Ancestral',
    icon: '🐉',
    description:
        'Um dragão ancestral, escuro e de asas vermelhas, se enrola atrás de você: mexe a cabeça, bate as asas, balança a cauda e solta brasas pelo focinho. Só os maiores aventureiros da CodeGuilds têm um guardião assim!',
    cosmetic: { slot: 'aura', value: 'dragao-ancestral' },
}

export async function up(db: Kysely<any>): Promise<void> {
    const current = await db.selectFrom('shop_items').select(['id', 'cosmetic']).execute()

    if (current.length === 0) return

    const onSale = current.some(
        (row) => row.id === ITEM.id || (row.cosmetic?.slot === ITEM.cosmetic.slot && row.cosmetic?.value === ITEM.cosmetic.value),
    )

    if (onSale) return

    await db
        .insertInto('shop_items')
        .values({
            id: ITEM.id,
            name: ITEM.name,
            icon: ITEM.icon,
            description: ITEM.description,
            rarity: 'lendario',
            price: 15000,
            value: 7500,
            xp: 0,
            cosmetic: JSON.stringify(ITEM.cosmetic),
            featured: true,
        })
        .execute()
}

// Tira a aura da Loja. Quem já comprou continua com o item no inventário.
export async function down(db: Kysely<any>): Promise<void> {
    await db.deleteFrom('shop_items').where('id', '=', ITEM.id).execute()
}
