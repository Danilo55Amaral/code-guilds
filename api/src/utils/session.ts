import { createHash, randomBytes } from "node:crypto";
import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../database";
import { env } from "../env";

// Nome do cookie que guarda o token da sessão no navegador
export const SESSION_COOKIE = 'cg_session'

// Professor fica logado por 7 dias. O aluno por no máximo 12 horas e só
// enquanto o navegador estiver aberto (igual ao front de hoje, em que cada
// nova entrada na plataforma começa pela tela de login).
const TEACHER_SESSION_MS = 7 * 24 * 60 * 60 * 1000
const STUDENT_SESSION_MS = 12 * 60 * 60 * 1000

// O banco guarda só o hash do token (SHA-256), nunca o token em si
export function hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex')
}

type SessionOwner = { teacherId: string } | { studentId: string }

// Abre a sessão: cria o token, salva o hash no banco e manda o cookie
export async function createSession(reply: FastifyReply, owner: SessionOwner) {
    const token = randomBytes(32).toString('base64url')
    const isTeacher = 'teacherId' in owner
    const expiresAt = new Date(Date.now() + (isTeacher ? TEACHER_SESSION_MS : STUDENT_SESSION_MS))

    // Aproveita pra limpar as sessões vencidas
    await db.deleteFrom('sessions').where('expiresAt', '<', new Date()).execute()

    await db.insertInto('sessions').values({
        tokenHash: hashToken(token),
        teacherId: isTeacher ? owner.teacherId : null,
        studentId: isTeacher ? null : owner.studentId,
        expiresAt,
    }).execute()

    reply.setCookie(SESSION_COOKIE, token, {
        path: '/',
        httpOnly: true, // o JavaScript da página não consegue ler o cookie
        sameSite: 'lax',
        secure: env.NODE_ENV === 'production', // só por HTTPS em produção
        // sem "expires" o cookie do aluno some quando o navegador fecha
        ...(isTeacher && { expires: expiresAt }),
    })
}

// Fecha a sessão: apaga do banco e limpa o cookie
export async function destroySession(request: FastifyRequest, reply: FastifyReply) {
    const token = request.cookies[SESSION_COOKIE]

    if (token) {
        await db.deleteFrom('sessions').where('tokenHash', '=', hashToken(token)).execute()
    }

    reply.clearCookie(SESSION_COOKIE, { path: '/' })
}
