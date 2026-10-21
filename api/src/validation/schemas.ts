import { z } from "zod";

// Schemas usados por mais de uma rota.

// O efeito de um Buf (src/engine/buffs.ts): XP ou moedas, 2x ou 3x, 5 ou 10 minutos
export const buffSchema = z.object({
    kind: z.enum(['xp', 'moedas']),
    multiplier: z.union([z.literal(2), z.literal(3)]),
    minutes: z.union([z.literal(5), z.literal(10)]),
})

// Um item do jogo (recompensa de missão, presente do professor): os mesmos
// campos do site (src/engine/missions.ts, RewardItem)
export const itemSchema = z.object({
    name: z.string().trim().min(1).max(60),
    icon: z.string().min(1).max(32),
    description: z.string().max(300),
    rarity: z.enum(['comum', 'raro', 'epico', 'lendario']),
    value: z.number().int().min(0).max(100000),
    xp: z.number().int().min(0).max(100000),
    cosmetic: z.record(z.string(), z.json()).optional(),
    slots: z.number().int().min(1).max(1000).optional(),
    multiverse: z.boolean().optional(),
    buff: buffSchema.optional(),
})
