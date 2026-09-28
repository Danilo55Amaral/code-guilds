import { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../database";
import { ensureTeacher } from "../middlewares/auth";
import { lockStudents, saveProgress } from "../services/progress";
import { itemSchema } from "../validation/schemas";
import { ValidationError } from "../validation/validations";
import { grantItem } from "../../../src/engine/students";
import { GiftItem } from "../../../src/engine/gifts";

// ============================================================================
// PRESENTES — o professor ou o ADM dá um item pra um aluno, pra turma toda ou
// pra uma casa, de uma vez. Cada aluno ganha o próprio exemplar (regra
// grantItem do site); com o inventário cheio, o item fica esperando espaço.
// ============================================================================

export async function giftsRoutes(app: FastifyInstance) {
    // Dando um item pra uma lista de alunos.
    // O professor só presenteia os alunos dele; itens de espaço, só o ADM dá.
    // A resposta diz, pra cada aluno, se o item entrou no inventário ou ficou
    // esperando espaço (o site usa isso na mensagem 🎁 Presente).
    app.post('/', { preHandler: ensureTeacher }, async (request, reply) => {
        const giveGiftBodySchema = z.object({
            studentIds: z.array(z.uuid()).min(1).max(1000),
            item: itemSchema,
        })

        const { studentIds, item } = giveGiftBodySchema.parse(request.body)
        const user = request.user!
        const isAdmin = user.role === 'professor' && user.isAdmin

        if (item.slots && !isAdmin) {
            return reply.status(403).send({ message: 'Apenas o ADM pode dar itens de espaço.' })
        }

        const ids = Array.from(new Set(studentIds))

        const students = await db.selectFrom('students').select(['id', 'teacherId']).where('id', 'in', ids).execute()

        if (!isAdmin && students.some((s) => s.teacherId !== user.id)) {
            return reply.status(403).send({ message: 'Você só pode presentear os seus alunos.' })
        }

        if (students.length === 0) throw new ValidationError('Nenhum aluno encontrado.')

        const gift = item as GiftItem

        const results = await db.transaction().execute(async (trx) => {
            const locked = await lockStudents(trx, students.map((s) => s.id))
            const results: { studentId: string, waiting: boolean }[] = []

            for (const student of locked.values()) {
                const granted = grantItem(student, gift)
                await saveProgress(trx, granted)
                results.push({ studentId: student.id, waiting: granted.pendingItems.length > student.pendingItems.length })
            }

            return results
        })

        return {
            delivered: results.length,
            waiting: results.filter((r) => r.waiting).length,
            results,
        }
    })
}
