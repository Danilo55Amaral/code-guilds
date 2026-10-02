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

// Id de missão a partir do título: "Loops com For!" vira "loops-com-for"
// (a mesma regra do site, em src/engine/missionsStore.ts)
export function slugify(text: string): string {
    const base = text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-+|-+$)/g, '')

    return base || `missao-${Date.now()}`
}

// E-mail sempre minúsculo e sem espaços nas pontas
export function normalizeEmail(raw: string): string {
    return raw.trim().toLowerCase()
}
