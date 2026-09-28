import { FastifyInstance } from "fastify";
import { z } from "zod";
import { ensureStudent } from "../middlewares/auth";
import { updateProgress } from "../services/progress";
import { studentsQuery } from "../utils/queries";
import { NotFoundError, ValidationError } from "../validation/validations";
import {
    Student,
    applySpaceItem,
    claimPendingItems,
    consumeItem,
    equipItem,
    removeItem,
    sellItemToSystem,
    unequipItem,
} from "../../../src/engine/students";
import { openMultiversePatch } from "../../../src/engine/multiverse";

// ============================================================================
// INVENTÁRIO — as ações do aluno com os próprios itens. Todas passam pelo
// updateProgress (transação + linha do aluno travada) e usam as regras do
// site (src/engine/students.ts). A resposta sempre traz o aluno atualizado.
// ============================================================================

// O item precisa estar no inventário do aluno
function findItem(student: Student, itemId: string) {
    const item = student.inventory.find((i) => i.id === itemId)

    if (!item) throw new NotFoundError('Esse item não está no seu inventário.')

    return item
}

// Aluno atualizado, no mesmo formato do /auth/me
function freshStudent(id: string) {
    return studentsQuery().where('id', '=', id).executeTakeFirst()
}

export async function inventoryRoutes(app: FastifyInstance) {
    const itemParamsSchema = z.object({
        itemId: z.string().min(1),
    })

    // Usando um item. Cada tipo de item tem um efeito:
    // - item de espaço: o inventário cresce (e guarda os itens que esperavam espaço);
    // - Chave do Multiverso: some e abre o passe da Sala do Multiverso;
    // - consumível: some e o aluno ganha o XP dele (pode subir de nível).
    app.post('/:itemId/use', { preHandler: ensureStudent }, async (request) => {
        const { itemId } = itemParamsSchema.parse(request.params)
        const studentId = request.user!.id

        const result = await updateProgress(studentId, (student) => {
            const item = findItem(student, itemId)

            if (item.slots && item.slots > 0) {
                const space = applySpaceItem(student, itemId)!
                return { student: space.student, effect: { kind: 'espaco', slotsGained: space.slotsGained, claimed: space.claimed } }
            }

            if (item.multiverse) {
                const patch = openMultiversePatch(student, itemId)!
                return { student: { ...student, ...patch }, effect: { kind: 'multiverso' } }
            }

            const consumed = consumeItem(student, itemId)

            if (!consumed) throw new ValidationError('Esse item não pode ser usado.')

            return {
                student: consumed.student,
                effect: {
                    kind: 'xp',
                    xpGained: consumed.xpGained,
                    leveledUp: consumed.leveledUp,
                    fromLevel: consumed.fromLevel,
                    newLevel: consumed.newLevel,
                },
            }
        })

        return { student: await freshStudent(studentId), effect: result.effect }
    })

    // Vendendo um item pro sistema: ele some e o aluno recebe o valor em moedas
    app.post('/:itemId/sell', { preHandler: ensureStudent }, async (request) => {
        const { itemId } = itemParamsSchema.parse(request.params)
        const studentId = request.user!.id

        const result = await updateProgress(studentId, (student) => {
            const item = findItem(student, itemId)
            return { student: sellItemToSystem(student, itemId), coinsGained: item.value }
        })

        return { student: await freshStudent(studentId), coinsGained: result.coinsGained }
    })

    // Descartando um item (se estava equipado, sai do avatar também)
    app.delete('/:itemId', { preHandler: ensureStudent }, async (request) => {
        const { itemId } = itemParamsSchema.parse(request.params)
        const studentId = request.user!.id

        await updateProgress(studentId, (student) => {
            findItem(student, itemId)
            return { student: removeItem(student, itemId) }
        })

        return { student: await freshStudent(studentId) }
    })

    // Equipando um visual no avatar (se já havia outro no mesmo espaço, ele é trocado)
    app.post('/:itemId/equip', { preHandler: ensureStudent }, async (request) => {
        const { itemId } = itemParamsSchema.parse(request.params)
        const studentId = request.user!.id

        await updateProgress(studentId, (student) => {
            const item = findItem(student, itemId)

            if (!item.cosmetic) throw new ValidationError('Esse item não é um visual do avatar.')

            return { student: equipItem(student, itemId) }
        })

        return { student: await freshStudent(studentId) }
    })

    // Tirando um visual do avatar (o item continua no inventário)
    app.post('/:itemId/unequip', { preHandler: ensureStudent }, async (request) => {
        const { itemId } = itemParamsSchema.parse(request.params)
        const studentId = request.user!.id

        await updateProgress(studentId, (student) => {
            findItem(student, itemId)
            return { student: unequipItem(student, itemId) }
        })

        return { student: await freshStudent(studentId) }
    })

    // Guardando no inventário os itens que esperavam espaço: todos os que
    // couberem, ou só um (com o itemId no corpo)
    app.post('/pending/claim', { preHandler: ensureStudent }, async (request) => {
        const claimPendingBodySchema = z.object({
            itemId: z.string().min(1).optional(),
        })

        const { itemId } = claimPendingBodySchema.parse(request.body ?? {})
        const studentId = request.user!.id

        const result = await updateProgress(studentId, (student) => {
            if (student.pendingItems.length === 0) throw new ValidationError('Não há itens esperando espaço.')

            const updated = claimPendingItems(student, itemId)
            const moved = updated.inventory.length - student.inventory.length

            if (moved === 0) {
                throw new ValidationError('Não há espaço livre no inventário. Use um item de espaço, venda ou descarte algum item.')
            }

            return { student: updated, moved }
        })

        return { student: await freshStudent(studentId), moved: result.moved }
    })

    // Entrando na Sala do Multiverso: o passe da Chave é gasto
    app.post('/multiverse/enter', { preHandler: ensureStudent }, async (request) => {
        const studentId = request.user!.id

        await updateProgress(studentId, (student) => {
            if (!student.multiverseAccess) {
                throw new ValidationError('Você não tem um passe para a Sala do Multiverso. Use uma Chave do Multiverso no Inventário.')
            }

            return { student: { ...student, multiverseAccess: undefined } }
        })

        return { student: await freshStudent(studentId) }
    })
}
