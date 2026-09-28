import { config } from "dotenv";
import { z } from "zod";

config({ quiet: true })

// Mensagens de erro do Zod em português
z.config(z.locales.ptBR())

// Todas as variáveis de ambiente que a API usa, validadas na hora em que o
// servidor sobe. Se faltar alguma, a API nem inicia (melhor que quebrar depois).
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(3333),
    DATABASE_URL: z.string().min(1),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
    console.error('Variáveis de ambiente inválidas:', _env.error.issues)
    throw new Error('Variáveis de ambiente inválidas.')
}

export const env = _env.data
