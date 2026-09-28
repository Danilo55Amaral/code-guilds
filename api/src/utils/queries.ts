import { db } from "../database";

// Consultas base de professores e alunos com as colunas que podem sair nas
// respostas da API. O password_hash NUNCA entra aqui: no lugar dele o aluno
// ganha o campo hasPassword (true/false), que o professor usa pra saber se
// ainda precisa definir a senha.

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
            'createdAt',
        ])
        .select((eb) => eb('passwordHash', 'is not', null).as('hasPassword'))
}
