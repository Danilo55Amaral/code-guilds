// ============================================================================
// DASHBOARD API — os números do dashboard do aluno (professor e ADM), vindos
// de GET /students/:id/dashboard. Nada aqui fica em cache: o dashboard é
// buscado na hora em que abre e quando o professor clica em "Atualizar".
// ============================================================================

import { api, describeError } from "@/services/api";
import type { Student } from "./students";
import { AvatarConfig, normalizeAvatar } from "./avatar";
import { normalizeRewardItem } from "./missions";

export interface DashboardAttempt {
  id: string;
  missionId: string;
  title: string;
  icon: string;
  correct: number;
  total: number;
  passed: boolean;
  createdAt: string;
}

export interface DashboardMissionScore {
  missionId: string;
  title: string;
  icon: string;
  attempts: number;
  /** Melhor tentativa, de 0 a 1. */
  best: number | null;
  /** Média de acertos de todas as tentativas, de 0 a 1. */
  average: number | null;
  lastAt: string;
}

export interface StudentDashboard {
  student: Student;
  online: {
    now: boolean;
    lastSeenAt: string | null;
    lastLoginAt: string | null;
    totalSeconds: number;
    activeDays: number;
    /** Primeiro dia com tempo online registrado (YYYY-MM-DD), ou null. */
    since: string | null;
    /** Tempo online por dia nos últimos 30 dias (só os dias com acesso). */
    days: { day: string; seconds: number }[];
  };
  missions: {
    completedTotal: number;
    available: number;
    completedAvailable: number;
    completedQuiz: number;
    completedTasks: number;
    /** Missões concluídas por semana (segunda-feira da semana, YYYY-MM-DD). */
    weekly: { week: string; count: number }[];
  };
  quiz: {
    attempts: number;
    passed: number;
    correct: number;
    total: number;
    since: string | null;
    byMission: DashboardMissionScore[];
    recent: DashboardAttempt[];
  };
  /** Entregas por situação: enviando, pendente, aprovada, refazer. */
  submissions: Record<string, number>;
}

export async function loadStudentDashboard(studentId: string): Promise<{ data: StudentDashboard } | { error: string }> {
  try {
    const data = await api.get<StudentDashboard>(`/students/${studentId}/dashboard`);
    // o aluno vem cru da API: completa o avatar e os itens como o resto do site
    // faz (saveStudentAccounts), senão o desenho do avatar quebra
    const student = data.student;
    data.student = {
      ...student,
      avatar: normalizeAvatar((student.avatar ?? {}) as Partial<AvatarConfig>),
      inventory: (student.inventory ?? []).map((i) => ({ ...i, ...normalizeRewardItem(i) })),
      equipped: student.equipped ?? {},
    };
    return { data };
  } catch (error) {
    return { error: describeError(error) };
  }
}
