import fastify from "fastify";
import cookie from "@fastify/cookie";
import rateLimit from "@fastify/rate-limit";
import { ZodError } from "zod";
import { env } from "./env";
import { loadUser } from "./middlewares/auth";
import { ValidationError } from "./validation/validations";
import { authRoutes } from "./routes/auth";
import { chatsRoutes } from "./routes/chats";
import { eventsRoutes } from "./routes/events";
import { friendsRoutes } from "./routes/friends";
import { giftsRoutes } from "./routes/gifts";
import { healthRoutes } from "./routes/health";
import { inventoryRoutes } from "./routes/inventory";
import { messagesRoutes } from "./routes/messages";
import { missionsRoutes } from "./routes/missions";
import { offersRoutes } from "./routes/offers";
import { shopRoutes } from "./routes/shop";
import { studentsRoutes } from "./routes/students";
import { teacherMessagesRoutes } from "./routes/teacherMessages";
import { teachersRoutes } from "./routes/teachers";
import { tradesRoutes } from "./routes/trades";

// O app fica separado do server.ts (que só faz o listen) para que possa ser
// importado sem subir o servidor, por exemplo em testes com app.inject().
export const app = fastify({
    // A API roda atrás de proxies (Vercel e Render): com isso o request.ip é
    // o IP real de quem acessou, e não o do proxy
    trustProxy: true,
    // Em produção os logs vão pro painel do Render
    logger: env.NODE_ENV === 'production',
})

// Plugins
app.register(cookie)

app.register(rateLimit, {
    global: false, // o limite só vale nas rotas que pedirem (login e cadastro)
    errorResponseBuilder: (request, context) => ({
        statusCode: 429,
        message: `Muitas tentativas. Espere ${Math.ceil(context.ttl / 1000)} segundos e tente de novo.`,
    }),
})

// Leitor de JSON que aceita corpo vazio. Por padrão o Fastify recusa um POST
// com "Content-Type: application/json" e sem corpo (o front faz isso no
// logout, por exemplo); aqui o corpo vazio vira simplesmente "undefined".
app.removeContentTypeParser('application/json')
app.addContentTypeParser('application/json', { parseAs: 'string' }, (request, body, done) => {
    const text = String(body).trim()

    if (!text) return done(null, undefined)

    try {
        done(null, JSON.parse(text))
    } catch (error) {
        done(new ValidationError('O corpo da requisição não é um JSON válido.'), undefined)
    }
})

// Todo request começa sem usuário; o loadUser preenche se houver sessão
app.decorateRequest('user', null)
app.addHook('onRequest', loadUser)

// Tratamento de erros: transforma cada tipo de erro na resposta certa
app.setErrorHandler((error, request, reply) => {
    // Dados que não passaram no schema do Zod
    if (error instanceof ZodError) {
        return reply.status(400).send({
            message: 'Dados inválidos.',
            issues: error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            })),
        })
    }

    // Regras de negócio (existsOrError, notExistsError, equalsOrError)
    if (error instanceof ValidationError) {
        return reply.status(400).send({ message: error.message })
    }

    // Valor repetido numa coluna única do banco (ex.: dois cadastros com o
    // mesmo login ao mesmo tempo). 23505 é o código do PostgreSQL pra isso.
    if ((error as { code?: string }).code === '23505') {
        return reply.status(409).send({ message: 'Esse registro já existe.' })
    }

    // Erros do próprio Fastify ou dos plugins (JSON malformado, 429 etc.)
    const statusCode = (error as { statusCode?: number }).statusCode
    if (statusCode && statusCode < 500) {
        return reply.status(statusCode).send({ message: (error as Error).message })
    }

    // Qualquer outra coisa é erro nosso: registra e não mostra detalhes
    request.log.error(error)
    if (env.NODE_ENV !== 'production') console.error(error)

    return reply.status(500).send({ message: 'Erro interno no servidor.' })
})

// Rotas
app.register(healthRoutes, {
    prefix: 'health',
})

app.register(authRoutes, {
    prefix: 'auth',
})

app.register(teachersRoutes, {
    prefix: 'teachers',
})

app.register(studentsRoutes, {
    prefix: 'students',
})

app.register(inventoryRoutes, {
    prefix: 'inventory',
})

app.register(missionsRoutes, {
    prefix: 'missions',
})

app.register(shopRoutes, {
    prefix: 'shop',
})

app.register(eventsRoutes, {
    prefix: 'events',
})

app.register(giftsRoutes, {
    prefix: 'gifts',
})

app.register(friendsRoutes, {
    prefix: 'friends',
})

app.register(offersRoutes, {
    prefix: 'offers',
})

app.register(tradesRoutes, {
    prefix: 'trades',
})

app.register(messagesRoutes, {
    prefix: 'messages',
})

app.register(chatsRoutes, {
    prefix: 'chats',
})

app.register(teacherMessagesRoutes, {
    prefix: 'teacher-messages',
})
