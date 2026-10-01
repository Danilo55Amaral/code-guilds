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

    // Onde ficam os arquivos das entregas (fase 5):
    // - local: numa pasta da própria API (desenvolvimento);
    // - supabase: no Supabase Storage (produção: o disco do Render gratuito
    //   é apagado a cada deploy).
    STORAGE_DRIVER: z.enum(['local', 'supabase']).default('local'),
    UPLOADS_DIR: z.string().default('uploads'),
    SUPABASE_URL: z.url().optional(),
    // A chave secreta (service_role): só a API usa, nunca vai pro navegador
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
    // A chave pública (anon): vai junto no envio direto do navegador pro Supabase
    SUPABASE_ANON_KEY: z.string().min(1).optional(),
    SUPABASE_BUCKET: z.string().min(1).default('entregas'),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
    console.error('Variáveis de ambiente inválidas:', _env.error.issues)
    throw new Error('Variáveis de ambiente inválidas.')
}

if (_env.data.STORAGE_DRIVER === 'supabase' && (!_env.data.SUPABASE_URL || !_env.data.SUPABASE_SERVICE_ROLE_KEY)) {
    throw new Error('Com STORAGE_DRIVER=supabase, defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.')
}

export const env = _env.data
