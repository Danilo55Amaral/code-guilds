import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../database";
import { SESSION_COOKIE, hashToken } from "../utils/session";

// Quem está fazendo a requisição
export type AuthUser =
    | { role: 'professor', id: string, isAdmin: boolean }
    | { role: 'aluno', id: string, teacherId: string }

// Ensina ao TypeScript que toda requisição tem o campo "user"
declare module "fastify" {
    interface FastifyRequest {
        user: AuthUser | null
    }
}

// Roda antes de TODAS as rotas (hook onRequest registrado no app.ts):
// lê o cookie, procura a sessão no banco e preenche request.user.
// Sem cookie, ou com a sessão vencida, request.user fica null.
export async function loadUser(request: FastifyRequest) {
    request.user = null

    const token = request.cookies[SESSION_COOKIE]
    if (!token) return

    const session = await db
        .selectFrom('sessions')
        .leftJoin('teachers', 'teachers.id', 'sessions.teacherId')
        .leftJoin('students', 'students.id', 'sessions.studentId')
        .select([
            'sessions.teacherId',
            'sessions.studentId',
            'sessions.expiresAt',
            'teachers.isAdmin',
            'students.teacherId as studentTeacherId',
        ])
        .where('sessions.tokenHash', '=', hashToken(token))
        .executeTakeFirst()

    if (!session || session.expiresAt < new Date()) return

    if (session.teacherId) {
        request.user = { role: 'professor', id: session.teacherId, isAdmin: session.isAdmin ?? false }
    } else if (session.studentId && session.studentTeacherId) {
        request.user = { role: 'aluno', id: session.studentId, teacherId: session.studentTeacherId }
    }
}

// Middlewares de permissão: vão no preHandler das rotas.
// Se a regra não bater, respondem na hora e a rota nem é executada.

// Qualquer pessoa logada (professor, ADM ou aluno)
export async function ensureAuthenticated(request: FastifyRequest, reply: FastifyReply) {
    if (!request.user) {
        return reply.status(401).send({ message: 'Faça login para continuar.' })
    }
}

// Só professores (o ADM também é professor)
export async function ensureTeacher(request: FastifyRequest, reply: FastifyReply) {
    if (!request.user) {
        return reply.status(401).send({ message: 'Faça login para continuar.' })
    }

    if (request.user.role !== 'professor') {
        return reply.status(403).send({ message: 'Apenas professores podem fazer isso.' })
    }
}

// Só o ADM
export async function ensureAdmin(request: FastifyRequest, reply: FastifyReply) {
    if (!request.user) {
        return reply.status(401).send({ message: 'Faça login para continuar.' })
    }

    if (request.user.role !== 'professor' || !request.user.isAdmin) {
        return reply.status(403).send({ message: 'Apenas o ADM pode fazer isso.' })
    }
}
