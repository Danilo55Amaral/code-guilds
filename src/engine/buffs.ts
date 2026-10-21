// ============================================================================
// BUFS — itens consumíveis da Loja que multiplicam, por um tempo, o que o
// aluno ganha nas missões e nos eventos: o Buf de XP (2x ou 3x o XP) e o Buf
// de Moedas (2x ou 3x as moedas), cada um de 5 ou de 10 minutos.
//
// Usar o Buf no Inventário tira o item e liga o efeito (Student.buffs, com a
// hora em que acaba); o cronômetro (components/BuffTimer) fica na tela da
// Academia o tempo todo. Um Buf de XP e um de Moedas podem valer juntos, mas
// dois do mesmo tipo não: o segundo espera o primeiro acabar.
//
// Valem nas recompensas de missão (quiz e entrega aprovada) e de fase de
// evento. A recompensa diária, a Roleta e os itens de XP não são multiplicados.
// Estas regras são puras: a API importa este arquivo e é ela quem decide.
// ============================================================================

import type { InventoryItem, Student } from "./students";

export type BuffKind = "xp" | "moedas";

/** O que um item de Buf faz: o tipo, quanto multiplica e por quantos minutos. */
export interface BuffEffect {
  kind: BuffKind;
  multiplier: number;
  minutes: number;
}

/** Um Buf ligado: o efeito, de qual item veio e quando começou e acaba. */
export interface ActiveBuff extends BuffEffect {
  name: string;
  icon: string;
  startedAt: string;
  endsAt: string;
}

export const BUFF_KINDS: BuffKind[] = ["xp", "moedas"];
export const BUFF_MULTIPLIERS = [2, 3];
export const BUFF_MINUTES = [5, 10];

export const BUFF_LABELS: Record<BuffKind, string> = { xp: "XP", moedas: "Moedas" };

/**
 * Tolerância depois do fim do Buf: o aluno que terminou o quiz (ou viu a cena
 * final do evento) com o cronômetro ainda correndo e clicou em "Coletar" logo
 * depois ainda ganha o bônus.
 */
export const BUFF_GRACE_MS = 2 * 60_000;

/**
 * Por quanto tempo o Buf que acabou fica guardado: a entrega de uma missão é
 * corrigida depois, e vale o Buf que estava ligado quando o aluno enviou.
 */
export const BUFF_HISTORY_MS = 30 * 24 * 60 * 60_000;

/** O Buf está no formato certo (tipo, 2x/3x e 5/10 minutos)? */
export function isValidBuffEffect(buff: BuffEffect): boolean {
  return BUFF_KINDS.includes(buff.kind) && BUFF_MULTIPLIERS.includes(buff.multiplier) && BUFF_MINUTES.includes(buff.minutes);
}

/** "Buf de XP 2x • 5 min" */
export function describeBuff(buff: BuffEffect): string {
  return `Buf de ${BUFF_LABELS[buff.kind]} ${buff.multiplier}x • ${buff.minutes} min`;
}

/** Os Bufs ligados agora (que ainda não acabaram). */
export function activeBuffs(student: Pick<Student, "buffs">, now = Date.now()): ActiveBuff[] {
  return (student.buffs ?? []).filter((b) => new Date(b.endsAt).getTime() > now);
}

/** O Buf de um tipo que estava ligado num momento (com a tolerância depois do fim), se tiver. */
function buffAt(student: Pick<Student, "buffs">, kind: BuffKind, at: number): ActiveBuff | undefined {
  return (student.buffs ?? [])
    .filter((b) => b.kind === kind && new Date(b.startedAt).getTime() <= at && at < new Date(b.endsAt).getTime() + BUFF_GRACE_MS)
    .sort((a, b) => b.multiplier - a.multiplier)[0];
}

/** Quanto o XP e as moedas são multiplicados num momento (1 = sem Buf). */
export function rewardMultipliers(student: Pick<Student, "buffs">, at = Date.now()): { xp: number; coins: number } {
  return { xp: buffAt(student, "xp", at)?.multiplier ?? 1, coins: buffAt(student, "moedas", at)?.multiplier ?? 1 };
}

/** A recompensa de XP e moedas com os Bufs que valiam no momento `at`. */
export function boostReward(student: Pick<Student, "buffs">, reward: { xp: number; coins: number }, at = Date.now()) {
  const multipliers = rewardMultipliers(student, at);
  return { xp: reward.xp * multipliers.xp, coins: reward.coins * multipliers.coins, multipliers };
}

/** Joga fora os Bufs que acabaram há mais tempo do que o histórico guarda. */
export function pruneBuffs(buffs: ActiveBuff[] | undefined, now = Date.now()): ActiveBuff[] {
  return (buffs ?? []).filter((b) => new Date(b.endsAt).getTime() > now - BUFF_HISTORY_MS);
}

export type BuffActivation = { ok: true; student: Student; buff: ActiveBuff } | { ok: false; error: string };

/** Usa um item de Buf: ele sai do inventário e o efeito liga por N minutos a partir de agora. */
export function activateBuff(student: Student, item: InventoryItem, now = Date.now()): BuffActivation {
  if (!item.buff || !isValidBuffEffect(item.buff)) return { ok: false, error: "Esse item não é um Buf." };
  const running = activeBuffs(student, now).find((b) => b.kind === item.buff!.kind);
  if (running) {
    const left = formatCountdown(new Date(running.endsAt).getTime() - now);
    return { ok: false, error: `Você já tem um Buf de ${BUFF_LABELS[running.kind]} ${running.multiplier}x ligado (faltam ${left}). Espere ele acabar pra usar outro.` };
  }
  const buff: ActiveBuff = {
    kind: item.buff.kind,
    multiplier: item.buff.multiplier,
    minutes: item.buff.minutes,
    name: item.name,
    icon: item.icon,
    startedAt: new Date(now).toISOString(),
    endsAt: new Date(now + item.buff.minutes * 60_000).toISOString(),
  };
  // o item sai do inventário (Buf não é visual, então não precisa mexer no que está equipado)
  const inventory = student.inventory.filter((i) => i.id !== item.id);
  return { ok: true, student: { ...student, inventory, buffs: [...pruneBuffs(student.buffs, now), buff] }, buff };
}

/** "04:59" (minutos e segundos que faltam). */
export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/** O aviso que vai no fim da mensagem 🏆 quando um Buf multiplicou a recompensa (ou "" sem Buf). */
export function buffRewardNote(multipliers: { xp: number; coins: number }): string {
  const parts = [
    multipliers.xp > 1 && `o XP veio ${multipliers.xp}x`,
    multipliers.coins > 1 && `as moedas vieram ${multipliers.coins}x`,
  ].filter(Boolean);
  return parts.length ? `\n\n⚡ Seu Buf estava ligado: ${parts.join(" e ")}!` : "";
}

/** Os 8 Bufs da Loja: XP e Moedas, 2x e 3x, de 5 e de 10 minutos. O ADM muda o preço quando quiser. */
export const BUFF_SHOP_PRICE = 50000;

const BUFF_ICON: Record<BuffKind, string> = { xp: "⚡", moedas: "💰" };

export const BUFF_SHOP: { id: string; name: string; icon: string; description: string; rarity: "epico" | "lendario"; buff: BuffEffect }[] = BUFF_KINDS.flatMap((kind) =>
  BUFF_MULTIPLIERS.flatMap((multiplier) =>
    BUFF_MINUTES.map((minutes) => ({
      id: `loja-buf-${kind}-${multiplier}x-${minutes}min`,
      name: `Buf de ${BUFF_LABELS[kind]} ${multiplier}x (${minutes} min)`,
      icon: BUFF_ICON[kind],
      description:
        kind === "xp"
          ? `Por ${minutes} minutos, todo XP que você ganhar em missões e eventos vem ${multiplier === 2 ? "em dobro" : "triplicado"}. Use no Inventário quando for fazer as missões!`
          : `Por ${minutes} minutos, todas as moedas que você ganhar em missões e eventos vêm ${multiplier === 2 ? "em dobro" : "triplicadas"}. Use no Inventário quando for fazer as missões!`,
      rarity: multiplier === 3 ? ("lendario" as const) : ("epico" as const),
      buff: { kind, multiplier, minutes },
    })),
  ),
);
