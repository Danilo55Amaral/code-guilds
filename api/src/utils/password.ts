import { hash, verify } from "@node-rs/argon2";

// Senhas nunca são salvas como texto: guardamos só o hash Argon2id, que não
// dá pra desfazer. No login, o verify compara a senha digitada com o hash.

export async function hashPassword(password: string): Promise<string> {
    return hash(password)
}

export async function verifyPassword(passwordHash: string, password: string): Promise<boolean> {
    return verify(passwordHash, password)
}
