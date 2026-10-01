import { createReadStream, createWriteStream } from "node:fs";
import { mkdir, rm, rmdir, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { env } from "../env";

// ============================================================================
// STORAGE — onde ficam os arquivos das entregas (fase 5).
//
// Dois jeitos, escolhidos pelo STORAGE_DRIVER do .env, com as MESMAS funções:
// - local: numa pasta da própria API (UPLOADS_DIR). Bom pra desenvolvimento.
// - supabase: no Supabase Storage (produção). O disco do Render gratuito é
//   apagado a cada deploy, então os arquivos não podem ficar nele.
//
// O arquivo NÃO passa pela API no Supabase: a Vercel recusa corpos acima de
// 4,5 MB, e uma entrega pode ter 25 MB. Por isso a API gera um endereço de
// envio assinado (vale uma vez, pra um arquivo só) e o navegador manda o
// arquivo direto pro Supabase. O download também: a API confere a permissão
// e redireciona pra um link que vale 1 minuto.
// ============================================================================

// Pra onde o navegador manda o arquivo
export type UploadTarget =
    // local: o site manda pra própria API (PUT com o arquivo cru no corpo)
    | { kind: 'api', path: string }
    // supabase: o site manda direto pro Supabase (PUT com FormData)
    | { kind: 'url', url: string, headers: Record<string, string> }

// O que a rota de download faz: redireciona (Supabase) ou manda o arquivo (local)
export type Download =
    | { kind: 'redirect', url: string }
    | { kind: 'stream', stream: Readable, size: number }

const uploadsRoot = resolve(process.cwd(), env.UPLOADS_DIR)

// O caminho do arquivo na pasta local (as chaves são geradas pela API, com uuid)
function localPath(key: string) {
    return join(uploadsRoot, ...key.split('/'))
}

// ---------------------------------------------------------------------------
// Supabase Storage (API REST, sem biblioteca: são só 4 chamadas)
// ---------------------------------------------------------------------------

function supabaseBase() {
    return `${env.SUPABASE_URL}/storage/v1`
}

// A chave secreta vai só daqui (servidor) pro Supabase
function supabaseHeaders(extra: Record<string, string> = {}) {
    const key = env.SUPABASE_SERVICE_ROLE_KEY!
    return { Authorization: `Bearer ${key}`, apikey: key, ...extra }
}

async function supabaseJson<T>(path: string, init: RequestInit): Promise<T> {
    const response = await fetch(`${supabaseBase()}${path}`, init)

    if (!response.ok) {
        throw new Error(`Supabase Storage respondeu ${response.status}: ${await response.text()}`)
    }

    return response.json() as Promise<T>
}

// ---------------------------------------------------------------------------
// As funções usadas pelas rotas
// ---------------------------------------------------------------------------

// Endereço pra o navegador mandar o arquivo da chave `key`
export async function createUploadTarget(key: string, fileId: string): Promise<UploadTarget> {
    if (env.STORAGE_DRIVER === 'local') {
        return { kind: 'api', path: `/submissions/uploads/${fileId}` }
    }

    const { url } = await supabaseJson<{ url: string }>(`/object/upload/sign/${env.SUPABASE_BUCKET}/${key}`, {
        method: 'POST',
        headers: supabaseHeaders({ 'Content-Type': 'application/json' }),
        body: '{}',
    })

    return {
        kind: 'url',
        url: `${supabaseBase()}${url}`,
        headers: {
            'x-upsert': 'false',
            // a chave pública (anon), se configurada: ela pode ir pro navegador
            ...(env.SUPABASE_ANON_KEY && { apikey: env.SUPABASE_ANON_KEY }),
        },
    }
}

// Guarda na pasta local o arquivo que chegou na API (só no STORAGE_DRIVER=local)
export async function saveLocalFile(key: string, content: Readable) {
    const path = localPath(key)

    await mkdir(dirname(path), { recursive: true })
    await pipeline(content, createWriteStream(path))
}

// O tamanho do arquivo guardado, ou null se ele não existe (ainda não foi enviado).
// No Supabase, -1 = existe, mas o tamanho não veio na resposta.
export async function storedSize(key: string): Promise<number | null> {
    if (env.STORAGE_DRIVER === 'local') {
        try {
            return (await stat(localPath(key))).size
        } catch {
            return null
        }
    }

    const response = await fetch(`${supabaseBase()}/object/${env.SUPABASE_BUCKET}/${key}`, {
        method: 'HEAD',
        headers: supabaseHeaders(),
    })

    if (!response.ok) return null

    const length = response.headers.get('content-length')

    return length ? Number(length) : -1
}

// Como entregar o arquivo pra quem pediu (a permissão a rota já conferiu)
export async function createDownload(key: string, fileName: string): Promise<Download> {
    if (env.STORAGE_DRIVER === 'local') {
        const size = await storedSize(key)

        if (size === null) throw new Error('Arquivo não encontrado no disco.')

        return { kind: 'stream', stream: createReadStream(localPath(key)), size }
    }

    const { signedURL } = await supabaseJson<{ signedURL: string }>(`/object/sign/${env.SUPABASE_BUCKET}/${key}`, {
        method: 'POST',
        headers: supabaseHeaders({ 'Content-Type': 'application/json' }),
        // o link vale 1 minuto: dá tempo de baixar, mas não serve pra compartilhar
        body: JSON.stringify({ expiresIn: 60 }),
    })

    // "download=nome" faz o navegador baixar com o nome original do arquivo
    return { kind: 'redirect', url: `${supabaseBase()}${signedURL}&download=${encodeURIComponent(fileName)}` }
}

// Apaga os arquivos (entrega refeita sem terminar o envio, aluno ou missão excluídos).
// Se o storage falhar, só registra: o registro no banco já saiu.
export async function removeFiles(keys: string[]) {
    if (keys.length === 0) return

    try {
        if (env.STORAGE_DRIVER === 'local') {
            await Promise.all(keys.map((key) => rm(localPath(key), { force: true })))
            // a pasta da entrega fica vazia: sai também (o rmdir só apaga pasta vazia)
            const folders = Array.from(new Set(keys.map((key) => dirname(localPath(key)))))
            await Promise.all(folders.map((folder) => rmdir(folder).catch(() => undefined)))
            return
        }

        await supabaseJson(`/object/${env.SUPABASE_BUCKET}`, {
            method: 'DELETE',
            headers: supabaseHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ prefixes: keys }),
        })
    } catch (error) {
        console.error('[storage] não deu pra apagar os arquivos:', error)
    }
}
