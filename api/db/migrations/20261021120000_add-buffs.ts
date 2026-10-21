import { Kysely, sql } from "kysely";

// Bufs (src/engine/buffs.ts): itens da Loja que, usados no Inventário, ligam
// por 5 ou 10 minutos o bônus de XP ou de moedas (2x ou 3x) nas missões e
// nos eventos. Só ACRESCENTA, nada dos alunos muda:
//   - shop_items.buff (jsonb, pode ser null): o efeito do item ({ kind,
//     multiplier, minutes }); os itens que já existem ficam com null;
//   - students.buffs (jsonb, começa vazio pra todo mundo): os Bufs que o
//     aluno ligou, com a hora em que cada um acaba;
//   - os 8 Bufs à venda na Loja, por 50.000 moedas cada (o ADM muda o preço
//     quando quiser, no Painel ADM).
//
// Numa Loja vazia (banco novo) os itens não entram, porque aí o seed coloca
// os itens iniciais, que já trazem os Bufs (BUFF_SHOP_ITEMS em
// src/engine/shop.ts). Item com o mesmo id não entra de novo.
const KINDS = [
    { kind: 'xp', label: 'XP', icon: '⚡', gain: 'todo XP que você ganhar em missões e eventos vem' },
    { kind: 'moedas', label: 'Moedas', icon: '💰', gain: 'todas as moedas que você ganhar em missões e eventos vêm' },
]

const ITEMS = KINDS.flatMap(({ kind, label, icon, gain }) =>
    [2, 3].flatMap((multiplier) =>
        [5, 10].map((minutes) => ({
            id: `loja-buf-${kind}-${multiplier}x-${minutes}min`,
            name: `Buf de ${label} ${multiplier}x (${minutes} min)`,
            icon,
            description:
                `Por ${minutes} minutos, ${gain} ` +
                (multiplier === 2 ? 'em dobro' : kind === 'xp' ? 'triplicado' : 'triplicadas') +
                '. Use no Inventário quando for fazer as missões!',
            rarity: multiplier === 3 ? 'lendario' : 'epico',
            buff: { kind, multiplier, minutes },
        })),
    ),
)

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('shop_items')
        .addColumn('buff', 'jsonb')
        .execute()

    await db.schema
        .alterTable('students')
        .addColumn('buffs', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
        .execute()

    const current = await db.selectFrom('shop_items').select('id').execute()

    if (current.length === 0) return

    const now = Date.now()

    for (const [i, item] of ITEMS.entries()) {
        if (current.some((row) => row.id === item.id)) continue

        await db
            .insertInto('shop_items')
            .values({
                id: item.id,
                name: item.name,
                icon: item.icon,
                description: item.description,
                rarity: item.rarity,
                price: 50000,
                value: 25000,
                xp: 0,
                buff: JSON.stringify(item.buff),
                featured: false,
                created_at: new Date(now + i),
            })
            .execute()
    }
}

// Tira os Bufs da Loja e as duas colunas. Quem tinha um Buf no inventário
// continua com o item (sem o efeito); os Bufs ligados param de valer.
export async function down(db: Kysely<any>): Promise<void> {
    await db
        .deleteFrom('shop_items')
        .where(
            'id',
            'in',
            ITEMS.map((item) => item.id),
        )
        .execute()

    await db.schema.alterTable('students').dropColumn('buffs').execute()
    await db.schema.alterTable('shop_items').dropColumn('buff').execute()
}
