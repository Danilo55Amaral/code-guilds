import { Kysely } from "kysely";

// Biblioteca de Missões: a matéria da missão (ods, astronomia, programacao,
// scratch, roblox, informatica, app-inventor, hardware — a lista fica em
// src/engine/subjects.ts e a API confere). Só acrescenta a coluna, vazia: as
// missões que já existem não mudam (o site mostra cada uma na matéria que o
// título indica até o professor escolher outra), e nada dos alunos muda.
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('missions')
        .addColumn('subject', 'varchar(30)')
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.alterTable('missions').dropColumn('subject').execute()
}
