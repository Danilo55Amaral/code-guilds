import { sql } from "kysely";
import { db } from "../database";
import { ONLINE_WINDOW_SECONDS, TODAY_IN_BRAZIL } from "../routes/presence";
import { studentsQuery } from "../utils/queries";

// ============================================================================
// DASHBOARD DO ALUNO — todos os números que o professor e o ADM veem ao abrir
// o dashboard pela ficha do aluno (GET /students/:id/dashboard).
// Tudo aqui é só LEITURA: nenhuma consulta muda dados do aluno.
//
// De onde vem cada número:
// - missões concluídas: Student.completedMissionIds (desde sempre);
// - missões por semana: as mensagens 🏆 "Missão concluída" que a API manda a
//   cada missão concluída (quiz ou entrega aprovada), então também desde sempre;
// - tempo online e último acesso: student_activity_days e student_presence,
//   gravados pelo sinal de vida (desde que o status online entrou no ar);
// - último login: a sessão mais recente do aluno;
// - acertos e erros: quiz_attempts (desde que o dashboard entrou no ar).
// ============================================================================

const ONLINE_DAYS = 30 // o gráfico de tempo online mostra os últimos 30 dias
const WEEKS = 12 // o gráfico de missões mostra as últimas 12 semanas
const RECENT_ATTEMPTS = 10

export async function studentDashboard(studentId: string) {
    const student = await studentsQuery().where('id', '=', studentId).executeTakeFirstOrThrow()

    const [presence, lastLogin, activityDays, activityTotal, missions, weekly, attemptsTotal, attemptsByMission, recentAttempts, submissions] = await Promise.all([
        // último sinal de vida e se está online agora
        db.selectFrom('studentPresence')
            .select(['lastSeenAt', sql<boolean>`last_seen_at > now() - make_interval(secs => ${ONLINE_WINDOW_SECONDS})`.as('online')])
            .where('studentId', '=', studentId)
            .executeTakeFirst(),

        // o login mais recente
        db.selectFrom('sessions')
            .select((eb) => eb.fn.max('createdAt').as('lastLoginAt'))
            .where('studentId', '=', studentId)
            .executeTakeFirst(),

        // tempo online por dia, nos últimos 30 dias
        db.selectFrom('studentActivityDays')
            .select([sql<string>`to_char(day, 'YYYY-MM-DD')`.as('day'), 'onlineSeconds'])
            .where('studentId', '=', studentId)
            // o ::int é necessário: sem ele o Postgres lê o 30 como data (data - data = número)
            .where('day', '>', sql<Date>`${TODAY_IN_BRAZIL} - ${ONLINE_DAYS}::int`)
            .orderBy('day')
            .execute(),

        // tempo online de sempre, dias com acesso e desde quando conta
        db.selectFrom('studentActivityDays')
            .select((eb) => [
                eb.fn.coalesce(eb.fn.sum<number>('onlineSeconds'), sql<number>`0`).as('seconds'),
                eb.fn.countAll<number>().as('activeDays'),
                sql<string | null>`to_char(min(day), 'YYYY-MM-DD')`.as('since'),
            ])
            .where('studentId', '=', studentId)
            .executeTakeFirstOrThrow(),

        // as missões normais do professor dele (as de evento ficam de fora)
        db.selectFrom('missions')
            .select(['id', 'kind'])
            .where('teacherId', '=', student.teacherId)
            .where('eventId', 'is', null)
            .execute(),

        // missões concluídas por semana (segunda a domingo, horário de Brasília)
        db.selectFrom('messages')
            .select([
                sql<string>`to_char(date_trunc('week', created_at at time zone 'America/Sao_Paulo'), 'YYYY-MM-DD')`.as('week'),
                (eb) => eb.fn.countAll<number>().as('count'),
            ])
            .where('studentId', '=', studentId)
            .where('kind', '=', 'missao')
            .where('body', 'like', '🏆 Missão concluída%')
            .where('createdAt', '>', sql<Date>`date_trunc('week', now() at time zone 'America/Sao_Paulo') - make_interval(weeks => ${WEEKS - 1})`)
            .groupBy(sql`1`)
            .execute(),

        // acertos e erros de todas as tentativas
        db.selectFrom('quizAttempts')
            .select((eb) => [
                eb.fn.countAll<number>().as('attempts'),
                eb.fn.coalesce(eb.fn.sum<number>('correct'), sql<number>`0`).as('correct'),
                eb.fn.coalesce(eb.fn.sum<number>('total'), sql<number>`0`).as('total'),
                sql<number>`count(*) filter (where passed)`.as('passed'),
                sql<string | null>`min(created_at)`.as('since'),
            ])
            .where('studentId', '=', studentId)
            .executeTakeFirstOrThrow(),

        // por missão: tentativas, melhor e média de acertos
        db.selectFrom('quizAttempts')
            .innerJoin('missions', 'missions.id', 'quizAttempts.missionId')
            .select((eb) => [
                'quizAttempts.missionId',
                'missions.title',
                'missions.icon',
                eb.fn.countAll<number>().as('attempts'),
                sql<number>`max(quiz_attempts.correct::float8 / nullif(quiz_attempts.total, 0))`.as('best'),
                sql<number>`sum(quiz_attempts.correct)::float8 / nullif(sum(quiz_attempts.total), 0)`.as('average'),
                eb.fn.max('quizAttempts.createdAt').as('lastAt'),
            ])
            .where('quizAttempts.studentId', '=', studentId)
            .groupBy(['quizAttempts.missionId', 'missions.title', 'missions.icon'])
            .orderBy('lastAt', 'desc')
            .execute(),

        // as últimas tentativas
        db.selectFrom('quizAttempts')
            .innerJoin('missions', 'missions.id', 'quizAttempts.missionId')
            .select(['quizAttempts.id', 'quizAttempts.missionId', 'missions.title', 'missions.icon', 'quizAttempts.correct', 'quizAttempts.total', 'quizAttempts.passed', 'quizAttempts.createdAt'])
            .where('quizAttempts.studentId', '=', studentId)
            .orderBy('quizAttempts.createdAt', 'desc')
            .limit(RECENT_ATTEMPTS)
            .execute(),

        // entregas por situação
        db.selectFrom('submissions')
            .select(['status', (eb) => eb.fn.countAll<number>().as('count')])
            .where('studentId', '=', studentId)
            .groupBy('status')
            .execute(),
    ])

    const completedIds = new Set(student.completedMissionIds as string[])
    // das missões que estão no catálogo agora, quais ele já concluiu
    const done = missions.filter((m) => completedIds.has(m.id))

    return {
        student,
        online: {
            now: presence?.online ?? false,
            lastSeenAt: presence?.lastSeenAt ?? null,
            lastLoginAt: lastLogin?.lastLoginAt ?? null,
            totalSeconds: Number(activityTotal.seconds),
            activeDays: Number(activityTotal.activeDays),
            since: activityTotal.since,
            days: activityDays.map((d) => ({ day: d.day, seconds: d.onlineSeconds })),
        },
        missions: {
            completedTotal: completedIds.size,
            available: missions.length,
            completedAvailable: done.length,
            completedQuiz: done.filter((m) => m.kind === 'quiz').length,
            completedTasks: done.filter((m) => m.kind === 'entrega').length,
            weekly: weekly.map((w) => ({ week: w.week, count: Number(w.count) })),
        },
        quiz: {
            attempts: Number(attemptsTotal.attempts),
            passed: Number(attemptsTotal.passed),
            correct: Number(attemptsTotal.correct),
            total: Number(attemptsTotal.total),
            since: attemptsTotal.since,
            byMission: attemptsByMission.map((m) => ({ ...m, attempts: Number(m.attempts) })),
            recent: recentAttempts,
        },
        submissions: Object.fromEntries(submissions.map((s) => [s.status, Number(s.count)])) as Record<string, number>,
    }
}
