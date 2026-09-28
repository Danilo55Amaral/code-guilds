import { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../database";
import { ensureAdmin, ensureAuthenticated, ensureStudent } from "../middlewares/auth";
import { updateProgress } from "../services/progress";
import { studentsQuery } from "../utils/queries";
import { ValidationError } from "../validation/validations";
import { Json } from "../types/database";
import { MAX_SPACE_SLOTS, SHOP_COLLECTIONS, ShopItem, applyPurchase, missingFromCollection } from "../../../src/engine/shop";
import { COLLECTIONS, sameCosmetic } from "../../../src/engine/avatar";

// ============================================================================
// LOJA — os itens à venda (cadastro do ADM, com as coleções prontas) e a
// compra do aluno. A compra é decidida AQUI, com a mesma regra do site
// (applyPurchase, em src/engine/shop.ts): moedas suficientes, espaço no
// inventário e visual que o aluno ainda não tem.
// ============================================================================

// Todas as colunas do item, no formato do site
function shopItemsQuery() {
    return db
        .selectFrom('shopItems')
        .select([
            'id',
            'name',
            'icon',
            'description',
            'rarity',
            'price',
            'value',
            'xp',
            'cosmetic',
            'slots',
            'hidden',
            'eventItemKey',
            'featured',
            'collection',
            'sold',
            'createdAt',
        ])
}

// O item como as regras do site esperam (null vira "sem valor")
function toShopItem(row: Record<string, unknown>): ShopItem {
    return {
        ...(row as unknown as ShopItem),
        cosmetic: (row.cosmetic ?? undefined) as ShopItem['cosmetic'],
        slots: (row.slots ?? undefined) as number | undefined,
        eventItemKey: (row.eventItemKey ?? undefined) as string | undefined,
        collection: (row.collection ?? undefined) as ShopItem['collection'],
        createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
    }
}

const shopItemBodySchema = z.object({
    name: z.string().trim().min(1).max(60),
    icon: z.string().min(1).max(32),
    description: z.string().trim().min(1).max(300),
    rarity: z.enum(['comum', 'raro', 'epico', 'lendario']),
    price: z.number().int().min(1).max(100000),
    value: z.number().int().min(0).max(100000),
    xp: z.number().int().min(0).max(100000),
    cosmetic: z.record(z.string(), z.json()).nullable().optional(),
    slots: z.number().int().min(1).max(MAX_SPACE_SLOTS).nullable().optional(),
    hidden: z.boolean().optional(),
    eventItemKey: z.string().max(80).nullable().optional(),
    featured: z.boolean().default(false),
    collection: z.enum(COLLECTIONS as [string, ...string[]]).nullable().optional(),
})

type ShopItemBody = z.infer<typeof shopItemBodySchema>

// Um visual do avatar só pode estar à venda uma vez
async function checkCosmeticIsFree(cosmetic: ShopItemBody['cosmetic'], exceptId?: string) {
    if (!cosmetic) return

    const items = await db.selectFrom('shopItems').select(['id', 'cosmetic']).where('cosmetic', 'is not', null).execute()

    if (items.some((i) => i.id !== exceptId && sameCosmetic(i.cosmetic as never, cosmetic as never))) {
        throw new ValidationError('Esse visual já está à venda na Loja.')
    }
}

// Colunas pra salvar. Visual e item de espaço nunca dão XP.
// O tipo do item (visual, espaço, "só presente") sempre vem do formulário;
// o vínculo com o evento e a coleção, na edição, só mudam se vierem (o
// editor da Loja não manda esses campos, e eles não podem se perder).
function shopItemColumns(item: ShopItemBody) {
    return {
        name: item.name,
        icon: item.icon,
        description: item.description,
        rarity: item.rarity,
        price: item.price,
        value: item.value,
        xp: item.cosmetic || item.slots ? 0 : item.xp,
        cosmetic: item.cosmetic ? (JSON.stringify(item.cosmetic) as Json) : null,
        slots: item.slots ?? null,
        hidden: item.hidden ?? false,
        featured: item.featured,
        ...(item.eventItemKey !== undefined && { eventItemKey: item.eventItemKey }),
        ...(item.collection !== undefined && { collection: item.collection }),
    }
}

function newShopItemId(prefix = 'loja') {
    return `${prefix}_${Date.now()}_${Math.round(Math.random() * 9999)}`
}

export async function shopRoutes(app: FastifyInstance) {
    // Consultando a Loja. O ADM vê tudo; os outros não veem os itens "fora
    // da vitrine" (que o ADM só dá de presente ou usa como recompensa).
    app.get('/', { preHandler: ensureAuthenticated }, async (request) => {
        const user = request.user!

        let query = shopItemsQuery().orderBy('featured', 'desc').orderBy('createdAt', 'desc')

        if (!(user.role === 'professor' && user.isAdmin)) {
            query = query.where('hidden', '=', false)
        }

        const items = await query.execute()

        return { items }
    })

    // Cadastrando um item (só o ADM)
    app.post('/', { preHandler: ensureAdmin }, async (request, reply) => {
        const body = shopItemBodySchema.parse(request.body)

        await checkCosmeticIsFree(body.cosmetic)

        const id = newShopItemId()

        await db.insertInto('shopItems').values({ id, ...shopItemColumns(body) }).execute()

        const item = await shopItemsQuery().where('id', '=', id).executeTakeFirst()

        return reply.status(201).send({ item })
    })

    // Alterando um item (só o ADM). Os dados vêm completos, como no cadastro:
    // trocar o tipo do item (visual, espaço, só presente) apaga o do tipo antigo.
    // Quem já comprou continua com o item como era.
    app.put('/:id', { preHandler: ensureAdmin }, async (request, reply) => {
        const updateShopItemParamsSchema = z.object({
            id: z.string().min(1),
        })

        const { id } = updateShopItemParamsSchema.parse(request.params)
        const body = shopItemBodySchema.parse(request.body)

        const current = await db.selectFrom('shopItems').select('id').where('id', '=', id).executeTakeFirst()

        if (!current) {
            return reply.status(404).send({ message: 'Item não encontrado na Loja!' })
        }

        await checkCosmeticIsFree(body.cosmetic, id)

        await db.updateTable('shopItems').set(shopItemColumns(body)).where('id', '=', id).execute()

        const item = await shopItemsQuery().where('id', '=', id).executeTakeFirst()

        return { item }
    })

    // Tirando um item da Loja (só o ADM). Quem já comprou continua com ele.
    app.delete('/:id', { preHandler: ensureAdmin }, async (request, reply) => {
        const deleteShopItemParamsSchema = z.object({
            id: z.string().min(1),
        })

        const { id } = deleteShopItemParamsSchema.parse(request.params)

        const result = await db.deleteFrom('shopItems').where('id', '=', id).executeTakeFirst()

        if (Number(result.numDeletedRows) === 0) {
            return reply.status(404).send({ message: 'Item não encontrado na Loja!' })
        }

        return reply.status(200).send()
    })

    const collectionParamsSchema = z.object({
        collection: z.enum(COLLECTIONS as [string, ...string[]]),
    })

    // Colocando à venda os itens de uma coleção pronta que ainda não estão na
    // Loja (só o ADM). Devolve os itens que entraram.
    app.post('/collections/:collection', { preHandler: ensureAdmin }, async (request) => {
        const { collection } = collectionParamsSchema.parse(request.params)

        const current = (await shopItemsQuery().execute()).map(toShopItem)
        const missing = missingFromCollection(collection as keyof typeof SHOP_COLLECTIONS, current)
        const now = Date.now()

        // Uma transação: ou entra a coleção inteira, ou nada
        await db.transaction().execute(async (trx) => {
            for (const [i, item] of missing.entries()) {
                await trx
                    .insertInto('shopItems')
                    .values({
                        id: `loja_${collection}_${now}_${i}`,
                        ...shopItemColumns(item as unknown as ShopItemBody),
                        createdAt: new Date(now + i),
                    })
                    .execute()
            }
        })

        const items = await shopItemsQuery().where('collection', '=', collection).execute()

        return { added: missing.length, items }
    })

    // Tirando da Loja todos os itens de uma coleção (só o ADM).
    // Quem já comprou continua com eles.
    app.delete('/collections/:collection', { preHandler: ensureAdmin }, async (request) => {
        const { collection } = collectionParamsSchema.parse(request.params)

        const removed = await db.deleteFrom('shopItems').where('collection', '=', collection).returning('id').execute()

        return { removed: removed.length, ids: removed.map((r) => r.id) }
    })

    // Comprando um item (o aluno). Tudo numa transação: as moedas saem, o item
    // entra no inventário e a contagem de vendas do item sobe.
    app.post('/:id/buy', { preHandler: ensureStudent }, async (request, reply) => {
        const buyParamsSchema = z.object({
            id: z.string().min(1),
        })

        const { id } = buyParamsSchema.parse(request.params)
        const studentId = request.user!.id

        const row = await shopItemsQuery().where('id', '=', id).executeTakeFirst()

        if (!row) {
            return reply.status(404).send({ message: 'Esse item não está mais à venda.' })
        }

        const shopItem = toShopItem(row)

        const result = await updateProgress(
            studentId,
            (student) => {
                const purchase = applyPurchase(student, shopItem)

                if (!purchase.ok) throw new ValidationError(purchase.error)

                return { student: purchase.student, item: purchase.item }
            },
            async (trx) => {
                await trx
                    .updateTable('shopItems')
                    .set((eb) => ({ sold: eb('sold', '+', 1) }))
                    .where('id', '=', id)
                    .execute()
            },
        )

        const student = await studentsQuery().where('id', '=', studentId).executeTakeFirst()

        return { student, item: result.item }
    })
}
