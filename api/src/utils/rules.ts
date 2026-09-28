// Regras fixas da plataforma (as mesmas do front, em src/engine)

export const MIN_PASSWORD_LENGTH = 4
export const MIN_USERNAME_LENGTH = 3

// As quatro casas da Academia (src/engine/houses.ts)
export const HOUSES = ['ignis', 'noctis', 'flavus', 'sapientia'] as const

// Etapas do primeiro acesso do aluno: escolher a casa, montar o avatar, pronto
export const ONBOARDING_STEPS = ['casa', 'avatar', 'completo'] as const
