import { FastifyRequest } from "fastify";
import { RateLimitOptions } from "@fastify/rate-limit";

// Limite de tentativas de login: no máximo 5 por minuto para cada IP + login.
//
// Por que IP + login, e não só o IP? Numa escola a turma inteira sai para a
// internet pelo mesmo IP. Se o limite fosse só por IP, 5 alunos errando a
// senha travariam o login da sala toda. Assim, só quem erra muito a própria
// senha espera um minuto.
//
// O hook 'preHandler' faz o limite rodar depois de o corpo da requisição ser
// lido (no 'onRequest', que é o padrão, o body ainda não existe).
export function loginRateLimit(field: 'email' | 'username'): RateLimitOptions {
    return {
        max: 5,
        timeWindow: '1 minute',
        hook: 'preHandler',
        keyGenerator: (request: FastifyRequest) => {
            const body = request.body as Record<string, unknown> | undefined
            const login = String(body?.[field] ?? '').trim().toLowerCase()

            return `${request.ip}:${login}`
        },
    }
}
