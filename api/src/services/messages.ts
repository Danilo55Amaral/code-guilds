import { Kysely } from "kysely";
import { db } from "../database";
import { AuthUser } from "../middlewares/auth";
import { DB, Json } from "../types/database";
import { MessageAudience, MessageKind } from "../../../src/engine/messages";

// ============================================================================
// MENSAGENS DO ALUNO (fase 4)
//
// Desde a fase 4, quem cria as mensagens automáticas (missão concluída,
// compra, venda, troca, presente, amizade, entrega) é a própria API, na MESMA
// transação da ação: se a compra der errado, a mensagem "compra realizada"
// também não fica. Os textos são os mesmos do site (src/engine/messages.ts).
// ============================================================================

export type NewMessage = {
    studentId: string
    kind: MessageKind
    body: string
    senderId?: string | null // professor que mandou; vazio = mensagem automática da plataforma
    audience?: MessageAudience
    broadcastId?: string
}

// O banco aceita até 3000 caracteres (as mensagens automáticas mais longas
// juntam a recompensa, o comentário do professor e o aviso de espaço)
const MESSAGE_BODY_LIMIT = 3000

// Todas as colunas da mensagem, no formato do site
export function messagesQuery() {
    return db
        .selectFrom('messages')
        .select(['id', 'studentId', 'senderId', 'kind', 'body', 'audience', 'broadcastId', 'createdAt', 'readAt'])
}

// Grava as mensagens. Recebe o "trx" de quem chamou (pra ficar na mesma
// transação da ação) ou o próprio "db".
export async function sendMessages(executor: Kysely<DB>, messages: NewMessage[]) {
    if (messages.length === 0) return

    await executor
        .insertInto('messages')
        .values(messages.map((m) => ({
            studentId: m.studentId,
            kind: m.kind,
            body: m.body.trim().slice(0, MESSAGE_BODY_LIMIT),
            senderId: m.senderId ?? null,
            audience: m.audience ? (JSON.stringify(m.audience) as Json) : null,
            broadcastId: m.broadcastId ?? null,
        })))
        .execute()
}

// Como o professor aparece nas mensagens: "Professor Fulano" ou "ADM Fulano"
// (o mesmo texto que o site usava)
export async function teacherSignature(user: AuthUser) {
    const teacher = await db.selectFrom('teachers').select(['name', 'isAdmin']).where('id', '=', user.id).executeTakeFirst()
    const name = teacher?.name ?? ''

    return {
        name,
        role: teacher?.isAdmin ? 'adm' as const : 'professor' as const,
        label: teacher?.isAdmin ? `ADM ${name}` : `Professor ${name}`,
    }
}
