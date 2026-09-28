import { Transaction } from "kysely";
import { db } from "../database";
import { DB, Json } from "../types/database";
import { NotFoundError } from "../validation/validations";
import { Student } from "../../../src/engine/students";

// ============================================================================
// PROGRESSO DO ALUNO NO SERVIDOR (fase 3)
//
// As regras do jogo (usar item, vender, ganhar recompensa, guardar itens com
// limite de espaço...) são as MESMAS funções do site, importadas de
// src/engine. Assim existe uma regra só: o site mostra e a API decide.
//
// Toda ação segue o mesmo caminho, dentro de uma transação:
//   1. carrega o aluno TRAVANDO a linha (select ... for update): se duas
//      ações do mesmo aluno chegarem juntas, a segunda espera a primeira;
//   2. monta o objeto Student, no formato que as regras do site esperam;
//   3. aplica a regra;
//   4. salva o progresso de volta.
// Se a regra lançar um erro (ex.: item não encontrado), nada é salvo.
// ============================================================================

type StudentRow = Awaited<ReturnType<typeof selectStudentRow>>

function selectStudentRow(trx: Transaction<DB>, studentId: string) {
    return trx
        .selectFrom('students')
        .selectAll()
        .where('id', '=', studentId)
        .forUpdate()
        .executeTakeFirst()
}

// Converte a linha do banco no Student das regras do site
export function toStudent(row: NonNullable<StudentRow>): Student {
    return {
        id: row.id,
        teacherId: row.teacherId,
        name: row.name,
        email: row.email,
        turma: row.turma,
        username: row.username,
        hasPassword: row.passwordHash !== null,
        houseId: row.houseId as Student['houseId'],
        avatar: row.avatar as unknown as Student['avatar'],
        level: row.level,
        xp: row.xp,
        coins: row.coins,
        inventory: row.inventory as unknown as Student['inventory'],
        completedMissionIds: row.completedMissionIds as unknown as Student['completedMissionIds'],
        onboardingStep: row.onboardingStep as Student['onboardingStep'],
        tutorialDone: row.tutorialDone,
        equipped: row.equipped as unknown as Student['equipped'],
        events: row.events as unknown as Student['events'],
        bonusSlots: row.bonusSlots,
        pendingItems: row.pendingItems as unknown as Student['pendingItems'],
        multiverseAccess: row.multiverseAccess?.toISOString(),
        createdAt: row.createdAt.toISOString(),
    }
}

// As colunas do progresso, prontas pra salvar. Os campos jsonb vão como
// texto JSON: o driver pg transformaria um array do JavaScript num array
// do PostgreSQL (e não num JSON), por isso o JSON.stringify.
export function progressColumns(student: Student) {
    return {
        level: student.level,
        xp: student.xp,
        coins: student.coins,
        bonusSlots: student.bonusSlots,
        multiverseAccess: student.multiverseAccess ?? null,
        inventory: JSON.stringify(student.inventory) as Json,
        pendingItems: JSON.stringify(student.pendingItems) as Json,
        equipped: JSON.stringify(student.equipped) as Json,
        completedMissionIds: JSON.stringify(student.completedMissionIds) as Json,
        events: JSON.stringify(student.events) as Json,
    }
}

// Salva o progresso de um aluno (dentro da transação de quem chamou)
export async function saveProgress(trx: Transaction<DB>, student: Student) {
    await trx
        .updateTable('students')
        .set(progressColumns(student))
        .where('id', '=', student.id)
        .execute()
}

// Carrega VÁRIOS alunos travando as linhas (ações que mexem em dois alunos,
// como aceitar uma oferta ou uma troca, e presentes pra turma toda).
// As linhas são travadas sempre na ordem do id: se duas ações cruzadas
// chegarem juntas (A aceita a troca de B enquanto B aceita a de A), as duas
// tentam travar a mesma linha primeiro e uma espera a outra, em vez de cada
// uma travar um aluno e ficar esperando o outro pra sempre (deadlock).
// Quem não existe mais simplesmente não aparece no Map.
export async function lockStudents(trx: Transaction<DB>, studentIds: string[]) {
    const ids = Array.from(new Set(studentIds)).sort()

    if (ids.length === 0) return new Map<string, Student>()

    const rows = await trx
        .selectFrom('students')
        .selectAll()
        .where('id', 'in', ids)
        .orderBy('id')
        .forUpdate()
        .execute()

    return new Map(rows.map((row) => [row.id, toStudent(row)]))
}

// Aplica uma ação no progresso de UM aluno (veja o passo a passo lá em cima).
// A ação recebe o aluno e devolve o aluno alterado, mais o que mais quiser
// contar pra tela (XP ganho, se subiu de nível...).
// `alsoSave` (opcional) grava outras coisas NA MESMA transação (ex.: a compra
// soma uma venda no item da Loja): se algo der errado, nada é salvo.
export async function updateProgress<T extends { student: Student }>(
    studentId: string,
    action: (student: Student) => T,
    alsoSave?: (trx: Transaction<DB>, result: T) => Promise<void>,
): Promise<T> {
    return db.transaction().execute(async (trx) => {
        const row = await selectStudentRow(trx, studentId)

        if (!row) throw new NotFoundError('Aluno não encontrado!')

        const result = action(toStudent(row))

        await saveProgress(trx, result.student)

        if (alsoSave) await alsoSave(trx, result)

        return result
    })
}
