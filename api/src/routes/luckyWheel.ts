import { randomInt } from "node:crypto";
import { FastifyInstance } from "fastify";
import { sql } from "kysely";
import { db } from "../database";
import { ensureStudent } from "../middlewares/auth";
import { lockStudents, saveProgress } from "../services/progress";
import { studentsQuery } from "../utils/queries";
import { NotFoundError, ValidationError } from "../validation/validations";
import { TODAY_IN_BRAZIL } from "./presence";
import { WHEEL_PRIZES, WHEEL_SPIN_PRICE, WHEEL_TOTAL_WEIGHT, applyWheelSpin, prizeIndexForRoll } from "../../../src/engine/luckyWheel";

// ============================================================================
// ROLETA DA SORTE (Loja) — um giro grátis por dia (o dia de Brasília) e,
// depois dele, WHEEL_SPIN_PRICE moedas por giro. Os prêmios, as chances e a
// regra de entregar o prêmio ficam em src/engine/luckyWheel.ts; quem sorteia
// é o servidor (o site só gira a roleta até a fatia que voltou).
//
// Cada giro é uma transação: trava o aluno (dois giros do mesmo aluno ao
// mesmo tempo esperam um ao outro), confere se o grátis de hoje já foi
// usado, sorteia, aplica o prêmio, salva e grava o giro em lucky_wheel_spins.
// O índice único do giro grátis (aluno + dia, custo 0) garante um só por dia.
// ============================================================================

// O aluno já usou o giro grátis de hoje?
async function usedFreeSpinToday(studentId: string, executor: Pick<typeof db, 'selectFrom'> = db) {
    const row = await executor
        .selectFrom('luckyWheelSpins')
        .select('id')
        .where('studentId', '=', studentId)
        .where('day', '=', sql<Date>`${TODAY_IN_BRAZIL}`)
        .where('cost', '=', 0)
        .executeTakeFirst()

    return !!row
}

export async function luckyWheelRoutes(app: FastifyInstance) {
    // Como está a roleta pro aluno: se o giro grátis de hoje ainda está
    // disponível e quanto custa cada giro depois dele.
    app.get('/', { preHandler: ensureStudent }, async (request) => {
        const freeSpinAvailable = !(await usedFreeSpinToday(request.user!.id))

        return { freeSpinAvailable, price: WHEEL_SPIN_PRICE }
    })

    // Girando a roleta (o aluno). A resposta diz qual fatia saiu
    // (prizeIndex, na ordem de WHEEL_PRIZES), quanto custou, se o aluno subiu
    // de nível e se o item ficou esperando espaço; sempre volta o aluno
    // atualizado.
    app.post('/spin', { preHandler: ensureStudent }, async (request) => {
        const studentId = request.user!.id

        const result = await db.transaction().execute(async (trx) => {
            const student = (await lockStudents(trx, [studentId])).get(studentId)

            if (!student) throw new NotFoundError('Aluno não encontrado!')

            const free = !(await usedFreeSpinToday(studentId, trx))
            const prizeIndex = prizeIndexForRoll(randomInt(0, WHEEL_TOTAL_WEIGHT))
            const spin = applyWheelSpin(student, prizeIndex, free)

            if (!spin.ok) throw new ValidationError(spin.error)

            await saveProgress(trx, spin.student)

            await trx
                .insertInto('luckyWheelSpins')
                .values({ studentId, day: sql`${TODAY_IN_BRAZIL}`, cost: spin.cost, prizeKey: WHEEL_PRIZES[prizeIndex].key })
                .execute()

            const { student: _student, ok: _ok, ...outcome } = spin

            return { prizeIndex, prizeKey: WHEEL_PRIZES[prizeIndex].key, ...outcome }
        })

        const student = await studentsQuery().where('id', '=', studentId).executeTakeFirst()

        return { ...result, freeSpinAvailable: false, price: WHEEL_SPIN_PRICE, student }
    })
}
