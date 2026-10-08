import { Kysely } from "kysely";

// Os visuais do Mago Danilo entram à venda na Loja por 10.000 moedas cada: a
// fantasia (a armadura dele), a aura (o círculo mágico dele girando) e os olhos
// de luz. Depois o ADM muda o preço (e o resto) quando quiser, no Painel ADM.
// Só acrescenta itens na Loja: nada dos alunos muda.
//
// Numa Loja vazia (banco novo) não faz nada, porque aí o seed coloca os itens
// iniciais, que já trazem esses três (MAGO_DANILO_SHOP em src/engine/shop.ts).
// Item com o mesmo id, ou visual que já estiver à venda, não entra de novo.
const ITEMS = [
    {
        id: 'loja-mago-danilo-fantasia',
        name: 'Fantasia do Mago Danilo',
        icon: '🧙‍♂️',
        description:
            'A armadura do próprio Mago Danilo, guardião da CodeGuilds: branca e dourada, com gemas ciano, ombreiras de guardião, jabô e capa preta. Só pros aprendizes mais lendários!',
        cosmetic: { slot: 'outfit', value: 'mago-danilo' },
    },
    {
        id: 'loja-mago-danilo-aura',
        name: 'Aura do Mago Danilo',
        icon: '💫',
        description:
            'O círculo mágico divino do Mago Danilo gira devagar atrás de você, com runas e medalhões dourados brilhando. Todo mundo vai saber que você tem a bênção do guardião!',
        cosmetic: { slot: 'aura', value: 'mago-danilo' },
    },
    {
        id: 'loja-mago-danilo-olhos',
        name: 'Olhos do Mago Danilo',
        icon: '👁️',
        description:
            'Os olhos de luz do Mago Danilo: brancos no meio, ciano nas bordas, brilhando e piscando como os dele. Enxergam um bug a quilômetros de distância.',
        cosmetic: { slot: 'eyewear', value: 'olhos-mago-danilo' },
    },
]

export async function up(db: Kysely<any>): Promise<void> {
    const current = await db.selectFrom('shop_items').select(['id', 'cosmetic']).execute()

    if (current.length === 0) return

    for (const item of ITEMS) {
        const onSale = current.some(
            (row) => row.id === item.id || (row.cosmetic?.slot === item.cosmetic.slot && row.cosmetic?.value === item.cosmetic.value),
        )

        if (onSale) continue

        await db
            .insertInto('shop_items')
            .values({
                id: item.id,
                name: item.name,
                icon: item.icon,
                description: item.description,
                rarity: 'lendario',
                price: 10000,
                value: 5000,
                xp: 0,
                cosmetic: JSON.stringify(item.cosmetic),
                featured: true,
            })
            .execute()
    }
}

// Tira os três da Loja. Quem já comprou continua com o item no inventário.
export async function down(db: Kysely<any>): Promise<void> {
    await db
        .deleteFrom('shop_items')
        .where(
            'id',
            'in',
            ITEMS.map((item) => item.id),
        )
        .execute()
}
