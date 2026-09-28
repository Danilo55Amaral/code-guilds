// Funções de validação das regras de negócio (as mesmas do SPE System).
// Quando uma regra falha, elas lançam um ValidationError, e o tratamento de
// erros do app.ts transforma isso numa resposta 400 com a mensagem.

export class ValidationError extends Error {
    statusCode = 400
}

// Se o valor não existir (vazio, array vazio ou texto em branco), lança o erro
export function existsOrError(value: unknown, msg: string): void {
    if (!value) throw new ValidationError(msg)
    if (Array.isArray(value) && value.length === 0) throw new ValidationError(msg)
    if (typeof value === 'string' && !value.trim()) throw new ValidationError(msg)
}

// O oposto: se o valor existir, lança o erro (ex.: login já cadastrado)
export function notExistsError(value: unknown, msg: string): void {
    try {
        existsOrError(value, msg)
    } catch (error) {
        return
    }
    throw new ValidationError(msg)
}

// Se os dois valores forem diferentes, lança o erro
export function equalsOrError(valueA: unknown, valueB: unknown, msg: string): void {
    if (valueA !== valueB) throw new ValidationError(msg)
}
