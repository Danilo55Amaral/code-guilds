import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import { FastifyInstance } from "fastify";
import { Kysely } from "kysely";
import { z } from "zod";
import { db } from "../database";
import { env } from "../env";
import { AuthUser, ensureAuthenticated, ensureStudent, ensureTeacher } from "../middlewares/auth";
import { sendMessages, teacherSignature } from "../services/messages";
import { updateProgress } from "../services/progress";
import { createDownload, createUploadTarget, removeFiles, saveLocalFile, storedSize } from "../services/storage";
import { studentsQuery } from "../utils/queries";
import { existsOrError, ForbiddenError, NotFoundError, ValidationError } from "../validation/validations";
import { DB } from "../types/database";
import { Mission, fileKindOf } from "../../../src/engine/missions";
import { applyMissionReward } from "../../../src/engine/students";
import { FEEDBACK_MAX, SUBMISSION_MAX_FILES, SUBMISSION_MAX_FILE_MB, SUBMISSION_TEXT_MAX, checkSubmission } from "../../../src/engine/submissions";
import { PENDING_ITEM_NOTE, missionRewardMessage, taskApprovedNote, taskRedoMessage } from "../../../src/engine/messages";

// ============================================================================
// ENTREGAS — as missões de entrega (resposta aberta e/ou arquivos). Fase 5.
//
// O envio tem 3 passos, porque os arquivos (até 25 MB) não passam pela API:
// 1. POST /submissions: a API confere a entrega com as regras do site
//    (checkSubmission), grava como "enviando" e devolve, pra cada arquivo, um
//    endereço de envio (services/storage.ts);
// 2. o navegador manda cada arquivo pro endereço (direto pro Supabase);
// 3. POST /submissions/:id/confirm: a API confere se os arquivos chegaram e a
//    entrega vai pro professor ("pendente").
// A correção (aprovar ou refazer) dá a recompensa e manda a mensagem pro aluno.
// ============================================================================

const MAX_FILE_BYTES = SUBMISSION_MAX_FILE_MB * 1024 * 1024

type SubmissionRow = Awaited<ReturnType<typeof selectSubmissions>>[number]

function selectSubmissions(executor: Kysely<DB>, filter: (query: ReturnType<typeof baseQuery>) => ReturnType<typeof baseQuery>) {
    return filter(baseQuery(executor)).orderBy('submittedAt', 'desc').execute()
}

function baseQuery(executor: Kysely<DB>) {
    return executor
        .selectFrom('submissions')
        .select(['id', 'missionId', 'studentId', 'teacherId', 'text', 'status', 'attempt', 'submittedAt', 'reviewedAt', 'reviewerName', 'feedback'])
}

// As entregas no formato do site: cada uma com a lista dos seus arquivos
async function withFiles(executor: Kysely<DB>, rows: SubmissionRow[]) {
    if (rows.length === 0) return []

    const files = await executor
        .selectFrom('submissionFiles')
        .select(['id', 'submissionId', 'name', 'size', 'kind'])
        .where('submissionId', 'in', rows.map((r) => r.id))
        .orderBy('createdAt', 'asc')
        .execute()

    return rows.map((row) => ({
        ...row,
        files: files.filter((f) => f.submissionId === row.id).map(({ submissionId: _unused, ...file }) => file),
    }))
}

async function findSubmission(executor: Kysely<DB>, id: string) {
    const [submission] = await withFiles(executor, await selectSubmissions(executor, (q) => q.where('id', '=', id)))
    return submission
}

// Quem pode ver uma entrega (e baixar os arquivos): o aluno que enviou, o
// professor que corrige e o ADM
function canSee(user: AuthUser, submission: { studentId: string, teacherId: string }) {
    if (user.role === 'aluno') return user.id === submission.studentId

    return user.isAdmin || user.id === submission.teacherId
}

// Apaga as entregas que ficaram "enviando" (o envio não terminou) e os arquivos delas
async function discardUnfinished(studentId: string, missionId: string) {
    const unfinished = await db
        .selectFrom('submissions')
        .innerJoin('submissionFiles', 'submissionFiles.submissionId', 'submissions.id')
        .select(['submissions.id', 'submissionFiles.storageKey'])
        .where('submissions.studentId', '=', studentId)
        .where('submissions.missionId', '=', missionId)
        .where('submissions.status', '=', 'enviando')
        .execute()

    await db
        .deleteFrom('submissions')
        .where('studentId', '=', studentId)
        .where('missionId', '=', missionId)
        .where('status', '=', 'enviando')
        .execute()

    await removeFiles(unfinished.map((f) => f.storageKey))
}

// As chaves no storage dos arquivos das entregas que vão sumir (aluno ou
// missão excluídos): a rota pega antes de excluir e apaga depois
export async function storageKeysOf(filter: { studentId?: string, missionId?: string }) {
    let query = db
        .selectFrom('submissionFiles')
        .innerJoin('submissions', 'submissions.id', 'submissionFiles.submissionId')
        .select('submissionFiles.storageKey')

    if (filter.studentId) query = query.where('submissions.studentId', '=', filter.studentId)
    if (filter.missionId) query = query.where('submissions.missionId', '=', filter.missionId)

    return (await query.execute()).map((f) => f.storageKey)
}

export async function submissionsRoutes(app: FastifyInstance) {
    // O arquivo do envio local chega cru (application/octet-stream). Este
    // leitor só vale dentro deste plugin e entrega o corpo como stream, sem
    // carregar o arquivo inteiro na memória.
    app.addContentTypeParser('application/octet-stream', { bodyLimit: MAX_FILE_BYTES + 1024 }, (request, payload, done) => {
        done(null, payload)
    })

    const submissionParamsSchema = z.object({
        id: z.uuid(),
    })

    // Consultando as entregas, mais recentes primeiro:
    // - aluno: as dele (todas as tentativas);
    // - professor: as dos alunos dele (das missões dele);
    // - ADM: todas (ou só as de um professor, com ?teacherId=...).
    // As que ainda estão "enviando" não aparecem.
    app.get('/', { preHandler: ensureAuthenticated }, async (request) => {
        const getSubmissionsQuerySchema = z.object({
            teacherId: z.uuid().optional(),
        })

        const { teacherId } = getSubmissionsQuerySchema.parse(request.query)
        const user = request.user!

        const rows = await selectSubmissions(db, (q) => {
            q = q.where('status', '!=', 'enviando')
            if (user.role === 'aluno') return q.where('studentId', '=', user.id)
            if (!user.isAdmin) return q.where('teacherId', '=', user.id)
            return teacherId ? q.where('teacherId', '=', teacherId) : q
        })

        return { submissions: await withFiles(db, rows) }
    })

    // Enviando uma entrega (passo 1 de 3). O corpo traz o texto e só o NOME e
    // o TAMANHO de cada arquivo; a resposta traz pra onde mandar cada um.
    app.post('/', { preHandler: ensureStudent }, async (request, reply) => {
        const insertSubmissionBodySchema = z.object({
            missionId: z.string().min(1).max(120),
            text: z.string().max(SUBMISSION_TEXT_MAX).default(''),
            files: z.array(z.object({
                name: z.string().trim().min(1).max(200),
                size: z.number().int().positive().max(MAX_FILE_BYTES),
            })).max(SUBMISSION_MAX_FILES).default([]),
        })

        const { missionId, text, files } = insertSubmissionBodySchema.parse(request.body)
        const user = request.user!

        if (user.role !== 'aluno') throw new ForbiddenError('Apenas alunos podem fazer isso.')

        const mission = (await db
            .selectFrom('missions')
            .select(['id', 'teacherId', 'kind', 'task'])
            .where('id', '=', missionId)
            .executeTakeFirst()) as unknown as Mission | undefined

        if (!mission) throw new NotFoundError('Missão não encontrada!')
        if (mission.teacherId !== user.teacherId) throw new ForbiddenError('Essa missão não é do seu professor.')

        const student = await db.selectFrom('students').select('completedMissionIds').where('id', '=', user.id).executeTakeFirstOrThrow()
        const latest = await db
            .selectFrom('submissions')
            .select(['status', 'attempt'])
            .where('studentId', '=', user.id)
            .where('missionId', '=', missionId)
            .where('status', '!=', 'enviando')
            .orderBy('submittedAt', 'desc')
            .executeTakeFirst()

        // As mesmas regras que a tela confere antes de enviar
        const problem = checkSubmission(mission, {
            completedMissionIds: student.completedMissionIds as unknown as string[],
            latest,
            text,
            files,
        })

        if (problem) throw new ValidationError(problem)

        // Um envio anterior que não terminou (a internet caiu, a aba fechou...) é descartado
        await discardUnfinished(user.id, missionId)

        const submissionId = randomUUID()
        const newFiles = files.map((f) => {
            const fileId = randomUUID()
            return {
                id: fileId,
                submissionId,
                name: f.name,
                size: f.size,
                kind: fileKindOf(f.name)!,
                storageKey: `submissions/${submissionId}/${fileId}`,
            }
        })

        await db.transaction().execute(async (trx) => {
            await trx
                .insertInto('submissions')
                .values({
                    id: submissionId,
                    missionId,
                    studentId: user.id,
                    teacherId: mission.teacherId,
                    text: mission.task?.allowText ? text.trim() : '',
                    // sem arquivos, a entrega já vai direto pro professor
                    status: newFiles.length > 0 ? 'enviando' : 'pendente',
                    attempt: (latest?.attempt ?? 0) + 1,
                })
                .execute()

            if (newFiles.length > 0) await trx.insertInto('submissionFiles').values(newFiles).execute()
        })

        const uploads = await Promise.all(newFiles.map(async (f) => ({
            fileId: f.id,
            target: await createUploadTarget(f.storageKey, f.id),
        })))

        return reply.status(201).send({ submission: await findSubmission(db, submissionId), uploads })
    })

    // Recebendo um arquivo (passo 2, só com STORAGE_DRIVER=local). No
    // Supabase, o navegador manda direto pra lá e esta rota nem é usada.
    app.put('/uploads/:fileId', { preHandler: ensureStudent }, async (request) => {
        const uploadParamsSchema = z.object({
            fileId: z.uuid(),
        })

        const { fileId } = uploadParamsSchema.parse(request.params)

        if (env.STORAGE_DRIVER !== 'local') throw new NotFoundError('Os arquivos vão direto pro storage.')

        const file = await db
            .selectFrom('submissionFiles')
            .innerJoin('submissions', 'submissions.id', 'submissionFiles.submissionId')
            .select(['submissionFiles.storageKey', 'submissionFiles.size'])
            .where('submissionFiles.id', '=', fileId)
            .where('submissions.studentId', '=', request.user!.id)
            .where('submissions.status', '=', 'enviando')
            .executeTakeFirst()

        if (!file) throw new NotFoundError('Esse envio não existe mais. Envie a entrega de novo.')

        if (!(request.body instanceof Readable)) throw new ValidationError('Mande o arquivo com Content-Type: application/octet-stream.')

        await saveLocalFile(file.storageKey, request.body)

        return { received: await storedSize(file.storageKey) }
    })

    // Terminando o envio (passo 3): confere se todos os arquivos chegaram (e
    // com o tamanho que o aluno disse) e manda a entrega pro professor
    app.post('/:id/confirm', { preHandler: ensureStudent }, async (request) => {
        const { id } = submissionParamsSchema.parse(request.params)

        const submission = await findSubmission(db, id)

        if (!submission || submission.studentId !== request.user!.id) throw new NotFoundError('Entrega não encontrada.')
        if (submission.status !== 'enviando') throw new ValidationError('Essa entrega já foi enviada.')

        const keys = await db.selectFrom('submissionFiles').select(['name', 'size', 'storageKey']).where('submissionId', '=', id).execute()

        for (const file of keys) {
            const size = await storedSize(file.storageKey)

            if (size === null) throw new ValidationError(`O arquivo "${file.name}" não chegou. Envie a entrega de novo.`)
            if (size >= 0 && size !== file.size) throw new ValidationError(`O arquivo "${file.name}" chegou incompleto. Envie a entrega de novo.`)
        }

        await db
            .updateTable('submissions')
            .set({ status: 'pendente', submittedAt: new Date() })
            .where('id', '=', id)
            .execute()

        return { submission: await findSubmission(db, id) }
    })

    // Baixando um arquivo (o aluno que enviou, o professor que corrige ou o ADM).
    // No Supabase, redireciona pra um link que vale 1 minuto.
    app.get('/files/:fileId', { preHandler: ensureAuthenticated }, async (request, reply) => {
        const downloadParamsSchema = z.object({
            fileId: z.uuid(),
        })

        const { fileId } = downloadParamsSchema.parse(request.params)

        const file = await db
            .selectFrom('submissionFiles')
            .innerJoin('submissions', 'submissions.id', 'submissionFiles.submissionId')
            .select(['submissionFiles.name', 'submissionFiles.storageKey', 'submissions.studentId', 'submissions.teacherId'])
            .where('submissionFiles.id', '=', fileId)
            .executeTakeFirst()

        if (!file) throw new NotFoundError('Arquivo não encontrado.')
        if (!canSee(request.user!, file)) throw new ForbiddenError('Você não tem acesso a esse arquivo.')

        const download = await createDownload(file.storageKey, file.name)

        if (download.kind === 'redirect') return reply.redirect(download.url)

        return reply
            .header('Content-Type', 'application/octet-stream')
            .header('Content-Length', download.size)
            // filename* aceita acentos (o nome vai codificado em UTF-8)
            .header('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`)
            .send(download.stream)
    })

    // Corrigindo uma entrega (o professor da missão ou o ADM):
    // - aprovada: o aluno ganha a recompensa (se ainda não tinha concluído a
    //   missão) e a mensagem 🏆 com o comentário;
    // - refazer: o comentário é obrigatório e chega como mensagem 📝 Entrega.
    // A recompensa, a situação da entrega e a mensagem são gravadas juntas.
    app.post('/:id/review', { preHandler: ensureTeacher }, async (request) => {
        const reviewSubmissionBodySchema = z.object({
            decision: z.enum(['aprovada', 'refazer']),
            feedback: z.string().trim().max(FEEDBACK_MAX).default(''),
        })

        const { id } = submissionParamsSchema.parse(request.params)
        const { decision, feedback } = reviewSubmissionBodySchema.parse(request.body)
        const user = request.user!

        const submission = await findSubmission(db, id)

        if (!submission || submission.status === 'enviando') throw new NotFoundError('Essa entrega não existe mais.')
        if (!canSee(user, submission)) throw new ForbiddenError('Você só corrige as entregas dos seus alunos.')
        if (submission.status !== 'pendente') throw new ValidationError('Essa entrega já foi corrigida.')
        if (decision === 'refazer') existsOrError(feedback, 'Escreva um comentário dizendo o que o aluno precisa melhorar.')

        const mission = (await db
            .selectFrom('missions')
            .select(['id', 'title', 'icon', 'rewardXp', 'rewardCoins', 'rewardItem'])
            .where('id', '=', submission.missionId)
            .executeTakeFirstOrThrow()) as unknown as Mission

        const reviewer = await teacherSignature(user)

        // A situação da entrega muda junto com a recompensa (mesma transação)
        const markReviewed = (trx: Kysely<DB>) => trx
            .updateTable('submissions')
            .set({ status: decision, feedback: feedback || null, reviewedAt: new Date(), reviewerName: reviewer.label })
            .where('id', '=', id)
            .where('status', '=', 'pendente')
            .executeTakeFirst()

        if (decision === 'refazer') {
            await db.transaction().execute(async (trx) => {
                const updated = await markReviewed(trx)

                if (Number(updated.numUpdatedRows) === 0) throw new ValidationError('Essa entrega já foi corrigida.')

                await sendMessages(trx, [{
                    studentId: submission.studentId,
                    kind: 'entrega',
                    senderId: user.id,
                    body: taskRedoMessage({ mission, reviewerName: reviewer.label, feedback }),
                }])
            })

            return { submission: await findSubmission(db, id), rewarded: false }
        }

        const result = await updateProgress(submission.studentId, (student) => {
            if (student.completedMissionIds.includes(mission.id)) return { student, rewarded: false }

            const reward = applyMissionReward(student, mission)

            return {
                student: reward.student,
                rewarded: true,
                itemWaiting: reward.student.pendingItems.length > student.pendingItems.length,
            }
        }, async (trx, result) => {
            const updated = await markReviewed(trx)

            // Dois cliques ao mesmo tempo: o segundo encontra a entrega já corrigida e desfaz tudo
            if (Number(updated.numUpdatedRows) === 0) throw new ValidationError('Essa entrega já foi corrigida.')

            if (!result.rewarded) return

            await sendMessages(trx, [{
                studentId: submission.studentId,
                kind: 'missao',
                body: missionRewardMessage({ mission, item: mission.rewardItem, xp: mission.rewardXp, coins: mission.rewardCoins }) +
                    taskApprovedNote({ reviewerName: reviewer.label, feedback }) +
                    ('itemWaiting' in result && result.itemWaiting ? PENDING_ITEM_NOTE : ''),
            }])
        })

        return {
            submission: await findSubmission(db, id),
            student: await studentsQuery().where('id', '=', submission.studentId).executeTakeFirst(),
            rewarded: result.rewarded,
        }
    })
}
