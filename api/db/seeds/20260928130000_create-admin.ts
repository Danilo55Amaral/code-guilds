import { Kysely } from "kysely";
import { config } from "dotenv";
import { hashPassword } from "../../src/utils/password";

config({ quiet: true })

// Cria o primeiro ADM da plataforma com os dados do .env
// (ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD). Se ele já existir, não faz nada,
// então dá pra rodar o seed quantas vezes quiser.
export async function seed(db: Kysely<any>): Promise<void> {
    const name = process.env.ADMIN_NAME || 'ADM'
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
    const password = process.env.ADMIN_PASSWORD

    if (!email || !password) {
        console.log('Defina ADMIN_EMAIL e ADMIN_PASSWORD no .env para criar o ADM.')
        return
    }

    const admin = await db
        .selectFrom('teachers')
        .select('id')
        .where('email', '=', email)
        .executeTakeFirst()

    if (admin) {
        console.log(`O ADM ${email} já existe.`)
        return
    }

    await db
        .insertInto('teachers')
        .values({
            name,
            email,
            password_hash: await hashPassword(password),
            is_admin: true,
        })
        .execute()

    console.log(`ADM ${email} criado com sucesso!`)
}
