// Mesmas regras de formatação do front (src/engine/students.ts e teachers.ts).

// Login do aluno: minúsculo, sem acento e só com letras, números, ponto, hífen e _
export function normalizeUsername(raw: string): string {
    return raw
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9._-]/g, '')
}

// E-mail sempre minúsculo e sem espaços nas pontas
export function normalizeEmail(raw: string): string {
    return raw.trim().toLowerCase()
}
