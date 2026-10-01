import { Kysely, sql } from "kysely";

// Entregas das missões de entrega (resposta aberta e/ou arquivos) e os
// arquivos de cada entrega. Os arquivos em si ficam no storage (pasta local
// ou Supabase Storage); aqui fica só o registro (nome, tamanho, tipo e a
// chave no storage).
//
// Situação da entrega:
// - enviando: o aluno começou a enviar e os arquivos ainda estão subindo
//   (o professor não vê; se o envio não terminar, a próxima tentativa apaga);
// - pendente: esperando a correção do professor;
// - aprovada / refazer: corrigida.
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('submissions')
        .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('mission_id', 'varchar(120)', (col) => col.notNull().references('missions.id').onDelete('cascade'))
        .addColumn('student_id', 'uuid', (col) => col.notNull().references('students.id').onDelete('cascade'))
        // o professor dono da missão (quem corrige); a exclusão do professor passa pro herdeiro
        .addColumn('teacher_id', 'uuid', (col) => col.notNull().references('teachers.id').onDelete('restrict'))
        .addColumn('text', 'text', (col) => col.notNull().defaultTo(''))
        .addColumn('status', 'varchar(10)', (col) => col.notNull().defaultTo('enviando'))
        .addColumn('attempt', 'integer', (col) => col.notNull())
        .addColumn('submitted_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .addColumn('reviewed_at', 'timestamptz')
        .addColumn('reviewer_name', 'varchar(100)')
        .addColumn('feedback', 'text')
        .addCheckConstraint('submissions_status_check', sql`status in ('enviando', 'pendente', 'aprovada', 'refazer')`)
        .addCheckConstraint('submissions_text_check', sql`char_length(text) <= 5000`)
        .addCheckConstraint('submissions_attempt_check', sql`attempt >= 1`)
        .execute()

    await db.schema
        .createIndex('submissions_student_mission_index')
        .on('submissions')
        .columns(['student_id', 'mission_id'])
        .execute()

    await db.schema
        .createIndex('submissions_teacher_index')
        .on('submissions')
        .column('teacher_id')
        .execute()

    await db.schema
        .createTable('submission_files')
        .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('submission_id', 'uuid', (col) => col.notNull().references('submissions.id').onDelete('cascade'))
        .addColumn('name', 'varchar(200)', (col) => col.notNull())
        .addColumn('size', 'integer', (col) => col.notNull())
        .addColumn('kind', 'varchar(20)', (col) => col.notNull())
        // onde o arquivo está no storage (submissions/<id da entrega>/<id do arquivo>)
        .addColumn('storage_key', 'varchar(200)', (col) => col.notNull())
        .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .addCheckConstraint('submission_files_size_check', sql`size > 0`)
        .execute()

    await db.schema
        .createIndex('submission_files_submission_index')
        .on('submission_files')
        .column('submission_id')
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('submission_files').execute()
    await db.schema.dropTable('submissions').execute()
}
