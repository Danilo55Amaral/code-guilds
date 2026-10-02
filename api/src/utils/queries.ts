import { db } from "../database";

// Consultas base de professores e alunos com as colunas que podem sair nas
// respostas da API. O password_hash NUNCA entra aqui: no lugar dele o aluno
// ganha o campo hasPassword (true/false), que o professor usa pra saber se
// ainda precisa definir a senha. Desde a fase 3 o aluno vem com o progresso
// do jogo completo (inventário, itens esperando espaço, missões feitas...).

export function teachersQuery() {
    return db
        .selectFrom('teachers')
        .select(['id', 'name', 'email', 'isAdmin', 'tutorialDone', 'createdAt'])
}

export function studentsQuery() {
    return db
        .selectFrom('students')
        .select([
            'id',
            'teacherId',
            'name',
            'email',
            'turma',
            'username',
            'houseId',
            'avatar',
            'level',
            'xp',
            'coins',
            'onboardingStep',
            'tutorialDone',
            'bonusSlots',
            'multiverseAccess',
            'inventory',
            'pendingItems',
            'equipped',
            'completedMissionIds',
            'events',
            'createdAt',
        ])
        .select((eb) => eb('passwordHash', 'is not', null).as('hasPassword'))
}

// Um aluno, no mesmo formato do /auth/me (as ações do jogo devolvem o aluno
// atualizado com isso)
export function findStudent(id: string) {
    return studentsQuery().where('id', '=', id).executeTakeFirst()
}
