// ============================================================================
// RECOMPENSA DIÁRIA — no primeiro acesso do dia à Academia, o Mago Danilo
// presenteia o aluno com moedas e XP. Uma vez só por dia (o dia do horário de
// Brasília): quem decide é a API (POST /daily-reward, que guarda cada dia em
// daily_rewards); a regra de aplicar o prêmio é esta, a mesma no site e na API.
// ============================================================================

import { Student, addXp } from "./students";

export const DAILY_REWARD = { xp: 120, coins: 80 } as const;

export interface DailyRewardResult {
  student: Student;
  leveledUp: boolean;
  fromLevel: number;
  newLevel: number;
}

/** Aplica a recompensa diária (XP, com estouro de nível, e moedas) ao aluno. */
export function applyDailyReward(student: Student): DailyRewardResult {
  const { level, xp } = addXp(student, DAILY_REWARD.xp);

  return {
    student: { ...student, level, xp, coins: student.coins + DAILY_REWARD.coins },
    leveledUp: level > student.level,
    fromLevel: student.level,
    newLevel: level,
  };
}

/** A carta do Mago Danilo no pergaminho, com o primeiro nome do aluno. */
export function dailyRewardLetter(name: string): string {
  const firstName = name.trim().split(/\s+/)[0] || "aprendiz";

  return (
    `Saudações, ${firstName}! Que alegria ver você de volta à Academia hoje. ` +
    `Pela sua dedicação, eu, o Mago Danilo, lhe entrego a recompensa do login diário: ` +
    `${DAILY_REWARD.xp} de XP e ${DAILY_REWARD.coins} moedas. ` +
    `Parabéns, jovem aprendiz! Continue firme na jornada e volte amanhã para um novo presente.`
  );
}
