import { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../database";
import { ensureAuthenticated, ensureStudent, ensureTeacher } from "../middlewares/auth";
import { sendMessages, teacherSignature } from "../services/messages";
import { NotFoundError, ValidationError } from "../validation/validations";
import { TEACHER_MESSAGE_MAX, TEACHER_MESSAGE_MAX_UNREAD, TEACHER_MESSAGE_TOPICS, TeacherMessageTopic } from "../../../src/engine/teacherMessages";

// ============================================================================
// MENSAGENS PRO PROFESSOR — o aluno escreve pro professor dele (dúvida de
// missão, ajuda com entrega, problema na plataforma...). O professor lê e
// responde; a resposta fica na mensagem e chega na caixa de Mensagens do aluno.
// ============================================================================

const TOPICS = Object.keys(TEACHER_MESSAGE_TOPICS) as [TeacherMessageTopic, ...TeacherMessageTopic[]]

// Todas as colunas da mensagem, no formato do site
function teacherMessagesQuery() {
    return db
        .selectFrom('teacherMessages')
        .select(['id', 'studentId', 'teacherId', 'topic', 'missionId', 'body', 'sentAt', 'readAt', 'reply', 'repliedAt', 'replierName'])
}

export async function teacherMessagesRoutes(app: FastifyInstance) {
    const teacherMessageParamsSchema = z.object({
        id: z.uuid(),
    })

    // Consultando as mensagens, mais recentes primeiro:
    // - aluno: as que ele mandou (com a situação e a resposta);
    // - professor (e o ADM): as que os alunos mandaram pra ele.
    app.get('/', { preHandler: ensureAuthenticated }, async (request) => {
        const user = request.user!

        const messages = await teacherMessagesQuery()
            .where(user.role === 'aluno' ? 'studentId' : 'teacherId', '=', user.id)
            .orderBy('sentAt', 'desc')
            .execute()

        return { messages }
    })

    // Escrevendo pro professor (o aluno). Vai pro professor atual dele. No
    // máximo 5 mensagens esperando o professor ler.
    app.post('/', { preHandler: ensureStudent }, async (request, reply) => {
        const insertTeacherMessageBodySchema = z.object({
            topic: z.enum(TOPICS),
            missionId: z.string().min(1).max(120).optional(),
            body: z.string().trim().min(1, 'Escreva a sua mensagem.').max(TEACHER_MESSAGE_MAX),
        })

        const { topic, missionId, body } = insertTeacherMessageBodySchema.parse(request.body)
        const user = request.user!

        // (o ensureStudent já garantiu; isto só ensina o TypeScript que é um aluno)
        if (user.role !== 'aluno') throw new ValidationError('Apenas alunos podem fazer isso.')

        const { waiting } = await db
            .selectFrom('teacherMessages')
            .select((eb) => eb.fn.countAll<string>().as('waiting'))
            .where('studentId', '=', user.id)
            .where('readAt', 'is', null)
            .executeTakeFirstOrThrow()

        if (Number(waiting) >= TEACHER_MESSAGE_MAX_UNREAD) {
            throw new ValidationError(`Você já tem ${TEACHER_MESSAGE_MAX_UNREAD} mensagens esperando o professor ler. Espere ele ler antes de mandar outra.`)
        }

        const message = await db
            .insertInto('teacherMessages')
            .values({ studentId: user.id, teacherId: user.teacherId, topic, missionId: missionId ?? null, body })
            .returning(['id', 'studentId', 'teacherId', 'topic', 'missionId', 'body', 'sentAt', 'readAt', 'reply', 'repliedAt', 'replierName'])
            .executeTakeFirstOrThrow()

        return reply.status(201).send({ message })
    })

    // Marcando como lida (o professor que recebeu)
    app.post('/:id/read', { preHandler: ensureTeacher }, async (request) => {
        const { id } = teacherMessageParamsSchema.parse(request.params)
        const me = request.user!.id

        await db
            .updateTable('teacherMessages')
            .set({ readAt: new Date() })
            .where('id', '=', id)
            .where('teacherId', '=', me)
            .where('readAt', 'is', null)
            .execute()

        const message = await teacherMessagesQuery().where('id', '=', id).where('teacherId', '=', me).executeTakeFirst()

        if (!message) throw new NotFoundError('Essa mensagem não existe mais.')

        return { message }
    })

    // Respondendo (o professor que recebeu). A resposta fica na mensagem e
    // chega na caixa de Mensagens do aluno, numa transação só.
    app.post('/:id/reply', { preHandler: ensureTeacher }, async (request) => {
        const replyTeacherMessageBodySchema = z.object({
            reply: z.string().trim().min(1, 'Escreva a resposta.').max(TEACHER_MESSAGE_MAX),
        })

        const { id } = teacherMessageParamsSchema.parse(request.params)
        const { reply: text } = replyTeacherMessageBodySchema.parse(request.body)
        const me = request.user!.id

        // "Professor Fulano" (ou "ADM Fulano"): é como a resposta aparece pro aluno
        const replier = await teacherSignature(request.user!)

        const message = await db.transaction().execute(async (trx) => {
            const now = new Date()

            const message = await trx
                .updateTable('teacherMessages')
                .set((eb) => ({
                    reply: text,
                    repliedAt: now,
                    replierName: replier.label,
                    readAt: eb.fn.coalesce('readAt', eb.val(now)),
                }))
                .where('id', '=', id)
                .where('teacherId', '=', me)
                .returning(['id', 'studentId', 'teacherId', 'topic', 'missionId', 'body', 'sentAt', 'readAt', 'reply', 'repliedAt', 'replierName'])
                .executeTakeFirst()

            if (!message) throw new NotFoundError('Essa mensagem não existe mais.')

            const excerpt = message.body.length > 80 ? `${message.body.slice(0, 80)}…` : message.body

            await sendMessages(trx, [{
                studentId: message.studentId,
                kind: 'mensagem',
                senderId: me,
                body: `💬 Resposta à sua mensagem ("${excerpt}"):\n\n${text}`,
            }])

            return message
        })

        return { message }
    })
}
