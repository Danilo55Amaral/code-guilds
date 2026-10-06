import { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../database";
import { ensureAuthenticated } from "../middlewares/auth";
import { normalizeEmail, normalizeUsername } from "../utils/normalize";
import { verifyPassword } from "../utils/password";
import { studentsQuery, teachersQuery } from "../utils/queries";
import { loginRateLimit } from "../utils/rateLimit";
import { createSession, destroySession } from "../utils/session";

export async function authRoutes(app: FastifyInstance) {
    // Login do professor (e do ADM)
    app.post('/teachers/login', { config: { rateLimit: loginRateLimit('email') } }, async (request, reply) => {
        const teacherLoginBodySchema = z.object({
            email: z.string(),
            password: z.string(),
        })

        const { email, password } = teacherLoginBodySchema.parse(request.body)

        const teacher = await db
            .selectFrom('teachers')
            .select(['id', 'passwordHash'])
            .where('email', '=', normalizeEmail(email))
            .executeTakeFirst()

        // A mesma mensagem pros dois casos: assim ninguém descobre quais
        // e-mails estão cadastrados tentando fazer login
        if (!teacher || !(await verifyPassword(teacher.passwordHash, password))) {
            return reply.status(401).send({ message: 'E-mail ou senha incorretos.' })
        }

        await createSession(reply, { teacherId: teacher.id })

        const profile = await teachersQuery().where('id', '=', teacher.id).executeTakeFirst()

        return { teacher: profile }
    })

    // Login do aluno
    app.post('/students/login', { config: { rateLimit: loginRateLimit('username') } }, async (request, reply) => {
        const studentLoginBodySchema = z.object({
            username: z.string(),
            password: z.string(),
        })

        const { username, password } = studentLoginBodySchema.parse(request.body)

        const student = await db
            .selectFrom('students')
            .select(['id', 'passwordHash'])
            .where('username', '=', normalizeUsername(username))
            .executeTakeFirst()

        if (!student) {
            return reply.status(401).send({ message: 'Login ou senha incorretos.' })
        }

        // Aluno criado sem senha: quem define é o professor
        if (!student.passwordHash) {
            return reply.status(401).send({ message: 'Sua conta ainda não tem senha — peça ao professor para definir uma.' })
        }

        if (!(await verifyPassword(student.passwordHash, password))) {
            return reply.status(401).send({ message: 'Login ou senha incorretos.' })
        }

        await createSession(reply, { studentId: student.id })

        const profile = await studentsQuery().where('id', '=', student.id).executeTakeFirst()

        return { student: profile }
    })

    // Saindo da conta
    app.post('/logout', async (request, reply) => {
        // O aluno fica offline na hora, sem esperar o sinal de vida vencer
        if (request.user?.role === 'aluno') {
            await db.deleteFrom('studentPresence').where('studentId', '=', request.user.id).execute()
        }

        await destroySession(request, reply)

        return reply.status(200).send()
    })

    // Consultando quem está logado (o front chama ao abrir a página)
    app.get('/me', { preHandler: ensureAuthenticated }, async (request) => {
        const user = request.user!

        if (user.role === 'professor') {
            const teacher = await teachersQuery().where('id', '=', user.id).executeTakeFirst()

            return { role: user.role, teacher }
        }

        const student = await studentsQuery().where('id', '=', user.id).executeTakeFirst()

        return { role: user.role, student }
    })
}
