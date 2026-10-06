"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTeachers } from "@/engine/store";
import { StudentDashboard, loadStudentDashboard } from "@/engine/dashboardApi";
import { totalXp, wornAvatar, xpToNextLevel } from "@/engine/students";
import { getHouse } from "@/engine/houses";
import Avatar from "@/components/Avatar";
import ThemeToggle from "@/components/ThemeToggle";
import { CoinIcon, HousePill, LevelPill, XPBar } from "@/components/GameUI";
import { OnlineBadge } from "@/components/OnlineStatus";
import { BarDatum, ColumnChart, DashboardStyles, DataTable, ProgressRing, ScoreBars, SplitBar } from "@/components/dashboard/charts";

// ============================================================================
// DASHBOARD DO ALUNO — o professor (dos alunos dele) e o ADM (de todos) abrem
// pelo botão "📊 Dashboard" da ficha do aluno. Mostra os indicadores (missões,
// horas online, último acesso, média de acertos), os gráficos (tempo online
// por dia, missões por semana, progresso no catálogo, acertos x erros,
// acertos por missão) e as últimas tentativas. Os dados vêm de
// GET /students/:id/dashboard e se atualizam sozinhos a cada minuto.
// ============================================================================

const BR_TZ = "America/Sao_Paulo";
const ONLINE_DAYS = 30;
const WEEKS = 12;
const REFRESH_MS = 60000;

// ---------------------------------------------------------------------------
// Datas e durações (sempre no horário de Brasília)
// ---------------------------------------------------------------------------

/** "2026-10-06" do dia de uma data, no horário de Brasília. */
function brDay(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: BR_TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

/** Soma dias numa data "YYYY-MM-DD" (conta em UTC pra não sofrer com fuso). */
function addDays(day: string, days: number): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Os últimos `n` dias, do mais antigo até hoje. */
function lastDays(n: number): string[] {
  const today = brDay(new Date());
  return Array.from({ length: n }, (_, i) => addDays(today, i - (n - 1)));
}

/** As segundas-feiras das últimas `n` semanas, da mais antiga até a atual. */
function lastWeeks(n: number): string[] {
  const today = brDay(new Date());
  const weekday = new Date(`${today}T00:00:00Z`).getUTCDay(); // 0 = domingo
  const monday = addDays(today, -((weekday + 6) % 7));
  return Array.from({ length: n }, (_, i) => addDays(monday, (i - (n - 1)) * 7));
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function shortDate(day: string): string {
  const [, m, d] = day.split("-");
  return `${d}/${m}`;
}

function longDay(day: string): string {
  const weekday = WEEKDAYS[new Date(`${day}T00:00:00Z`).getUTCDay()];
  return `${weekday}, ${shortDate(day)}`;
}

/** "45 min", "2h 05min", "0 min". */
function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${String(m).padStart(2, "0")}min` : `${h}h`;
}

/** "05/10 às 21:40" (ou "05/10/2025 às 21:40" se não for deste ano). */
function formatDateTime(iso: string): string {
  const date = new Date(iso);
  const sameYear = brDay(date).slice(0, 4) === brDay(new Date()).slice(0, 4);
  const day = new Intl.DateTimeFormat("pt-BR", { timeZone: BR_TZ, day: "2-digit", month: "2-digit", ...(sameYear ? {} : { year: "numeric" }) }).format(date);
  const time = new Intl.DateTimeFormat("pt-BR", { timeZone: BR_TZ, hour: "2-digit", minute: "2-digit" }).format(date);
  return `${day} às ${time}`;
}

/** "agora", "há 5 min", "há 3 h", "ontem", "há 4 dias". */
function relativeTime(iso: string): string {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours} h`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "ontem" : `há ${days} dias`;
}

function sinceNote(since: string | null): string {
  if (!since) return "Começou a ser registrado agora: os dados aparecem conforme o aluno usa a plataforma.";
  return `Registrado desde ${shortDate(since.slice(0, 10))}/${since.slice(0, 4)}.`;
}

// ---------------------------------------------------------------------------
// Peças da tela
// ---------------------------------------------------------------------------

function KpiTile({ icon, label, value, sub, accent }: { icon: string; label: string; value: ReactNode; sub: ReactNode; accent: string }) {
  return (
    <div className="cg-card relative overflow-hidden p-4">
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-20 blur-2xl" style={{ background: accent }} />
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
        <span className="text-base">{icon}</span>
        {label}
      </p>
      <p className="mt-2 text-2xl font-black leading-none text-white tabular-nums sm:text-3xl">{value}</p>
      <p className="mt-1.5 text-xs text-slate-500">{sub}</p>
    </div>
  );
}

function Panel({ title, subtitle, right, children, className = "" }: { title: string; subtitle?: string; right?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`cg-card p-5 ${className}`}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-white">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[11px] text-slate-500">{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

function EmptyState({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-800 px-4 py-10 text-center">
      <span className="text-3xl opacity-70">{icon}</span>
      <p className="max-w-xs text-xs text-slate-500">{children}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A página
// ---------------------------------------------------------------------------

export default function StudentDashboardPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const studentId = params.id;
  const { currentTeacher, ready: teachersReady } = useTeachers();

  const [data, setData] = useState<StudentDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  // Só professor e ADM entram aqui
  useEffect(() => {
    if (teachersReady && !currentTeacher) router.replace("/professor");
  }, [teachersReady, currentTeacher, router]);

  const refresh = useCallback(async () => {
    setLoading(true);
    const result = await loadStudentDashboard(studentId);
    setLoading(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setError(null);
    setData(result.data);
    setUpdatedAt(new Date());
  }, [studentId]);

  // Busca ao abrir e de novo a cada minuto (só com a aba visível)
  useEffect(() => {
    if (!currentTeacher) return;
    void refresh();
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, REFRESH_MS);
    return () => window.clearInterval(timer);
  }, [currentTeacher, refresh]);

  if (!teachersReady || !currentTeacher) return null;

  const backHref = currentTeacher.isAdmin ? "/admin/painel" : "/professor/painel";

  return (
    <div className="cg-viz mx-auto cg-screen max-w-6xl px-4 py-8">
      <DashboardStyles />

      {/* ---- barra do topo ---- */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href={backHref} className="text-sm text-slate-400 transition-colors hover:text-white">
          ← Voltar ao painel
        </Link>
        <div className="flex items-center gap-2">
          {updatedAt && <span className="hidden text-[11px] text-slate-500 sm:inline">Atualizado às {new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(updatedAt)}</span>}
          <button onClick={() => void refresh()} disabled={loading} className="rounded-full border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-500 disabled:opacity-50">
            {loading ? "Atualizando…" : "↻ Atualizar"}
          </button>
          <ThemeToggle />
        </div>
      </div>

      {error && !data && (
        <div className="cg-card p-8 text-center">
          <p className="text-3xl">⚠️</p>
          <p className="mt-2 text-sm text-slate-300">{error}</p>
          <button onClick={() => void refresh()} className="cg-btn-primary mt-4 !py-2 text-xs">
            Tentar de novo
          </button>
        </div>
      )}

      {!data && !error && (
        <div className="cg-card flex items-center justify-center gap-3 p-16 text-sm text-slate-400">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-white" />
          Carregando o dashboard…
        </div>
      )}

      {/* ao atualizar, a tela antiga fica (mais apagada) até os dados novos chegarem */}
      {data && (
        <div className={`transition-opacity ${loading ? "opacity-70" : ""}`}>
          <Dashboard data={data} />
        </div>
      )}
    </div>
  );
}

function Dashboard({ data }: { data: StudentDashboard }) {
  const { student, online, missions, quiz, submissions } = data;
  const house = student.houseId ? getHouse(student.houseId) : null;

  const wrong = quiz.total - quiz.correct;
  const accuracy = quiz.total ? Math.round((quiz.correct / quiz.total) * 100) : null;
  const avgPerDay = online.activeDays ? online.totalSeconds / online.activeDays : 0;

  // ---- tempo online por dia (os dias sem acesso entram com zero) ----
  const secondsByDay = new Map(online.days.map((d) => [d.day, d.seconds]));
  const days = lastDays(ONLINE_DAYS);
  const onlineBars: BarDatum[] = days.map((day, i) => {
    const seconds = secondsByDay.get(day) ?? 0;
    return {
      key: day,
      label: i % 5 === 4 || i === days.length - 1 ? shortDate(day) : "",
      value: seconds / 60,
      tooltipTitle: longDay(day),
      tooltipValue: seconds ? formatDuration(seconds) : "Sem acesso",
    };
  });
  const onlineLast30 = online.days.reduce((sum, d) => sum + d.seconds, 0);

  // ---- missões concluídas por semana ----
  const countByWeek = new Map(missions.weekly.map((w) => [w.week, w.count]));
  const weeks = lastWeeks(WEEKS);
  const weeklyBars: BarDatum[] = weeks.map((week, i) => {
    const count = countByWeek.get(week) ?? 0;
    return {
      key: week,
      label: i % 2 === 1 || i === weeks.length - 1 ? shortDate(week) : "",
      value: count,
      tooltipTitle: `Semana de ${shortDate(week)} a ${shortDate(addDays(week, 6))}`,
      tooltipValue: `${count} ${count === 1 ? "missão" : "missões"}`,
    };
  });
  const weeklyTotal = missions.weekly.reduce((sum, w) => sum + w.count, 0);

  return (
    <>
      {/* ---- cabeçalho do aluno ---- */}
      <section className="cg-card relative mb-6 overflow-hidden p-6">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(70% 120% at 0% 0%, ${house?.hex ?? "#6366f1"}26, transparent 60%)` }}
        />
        <div className="relative flex flex-wrap items-center gap-6">
          <Avatar config={wornAvatar(student)} ringColor={house?.hex} size={112} />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">📊 Dashboard do aluno</p>
            <h1 className="mt-1 text-3xl font-black text-white">{student.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <OnlineBadge studentId={student.id} />
              <LevelPill level={student.level} />
              {house && <HousePill house={house} />}
              <span className="text-xs text-slate-500">
                {student.turma} • <span className="font-mono">@{student.username}</span>
              </span>
            </div>
            <div className="mt-4 max-w-sm">
              <div className="mb-1 flex justify-between text-[11px] text-slate-400">
                <span>Nível {student.level}</span>
                <span className="tabular-nums">
                  {student.xp} / {xpToNextLevel(student.level)} XP
                </span>
              </div>
              <XPBar xp={student.xp} xpToNext={xpToNextLevel(student.level)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Na plataforma desde</p>
              <p className="font-semibold text-white">{formatDateTime(student.createdAt).split(" às ")[0]}</p>
              <p className="text-[11px] text-slate-500">{relativeTime(student.createdAt).replace("agora", "hoje")}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Último login</p>
              <p className="font-semibold text-white">{online.lastLoginAt ? relativeTime(online.lastLoginAt) : "—"}</p>
              <p className="text-[11px] text-slate-500">{online.lastLoginAt ? formatDateTime(online.lastLoginAt) : "Sem registro"}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">XP total</p>
              <p className="font-semibold text-white tabular-nums">{totalXp(student.level, student.xp)} XP</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Moedas</p>
              <p className="flex items-center gap-1 font-semibold text-white tabular-nums">
                <CoinIcon size={14} /> {student.coins}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- indicadores ---- */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiTile
          icon="🏆"
          label="Missões concluídas"
          value={missions.completedTotal}
          sub={`${missions.completedQuiz} quiz • ${missions.completedTasks} entrega${missions.completedTasks === 1 ? "" : "s"}`}
          accent="var(--viz-series-1)"
        />
        <KpiTile
          icon="⏱️"
          label="Tempo online"
          value={formatDuration(online.totalSeconds)}
          sub={online.activeDays ? `em ${online.activeDays} ${online.activeDays === 1 ? "dia" : "dias"} • média de ${formatDuration(avgPerDay)}/dia` : "nenhum acesso registrado ainda"}
          accent="var(--viz-series-2)"
        />
        <KpiTile
          icon="🎯"
          label="Média de acertos"
          value={accuracy === null ? "—" : `${accuracy}%`}
          sub={quiz.attempts ? `${quiz.attempts} ${quiz.attempts === 1 ? "tentativa" : "tentativas"} de quiz` : "nenhum quiz registrado ainda"}
          accent="var(--viz-good)"
        />
        <KpiTile
          icon="🕒"
          label="Último acesso"
          value={online.lastSeenAt ? relativeTime(online.lastSeenAt) : "—"}
          sub={online.lastSeenAt ? formatDateTime(online.lastSeenAt) : "sem registro ainda"}
          accent="var(--viz-series-1)"
        />
      </div>

      {/* ---- tempo online + progresso ---- */}
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <Panel
          title="⏱️ Tempo online por dia"
          subtitle={`Últimos ${ONLINE_DAYS} dias • ${formatDuration(onlineLast30)} no total. ${sinceNote(online.since)}`}
          className="lg:col-span-2"
        >
          <ColumnChart
            data={onlineBars}
            seriesName="Tempo online por dia, em minutos"
            tickSteps={[5, 10, 15, 30, 60, 120, 180, 240]}
            formatTick={(v) => (v < 60 ? `${v} min` : v % 60 ? `${Math.floor(v / 60)}h${String(v % 60).padStart(2, "0")}` : `${v / 60}h`)}
          />
          <DataTable
            caption="Tempo online por dia"
            columns={["Dia", "Tempo online"]}
            rows={days.filter((d) => secondsByDay.has(d)).map((d) => [longDay(d), formatDuration(secondsByDay.get(d)!)])}
          />
        </Panel>

        <Panel title="🗺️ Progresso no catálogo" subtitle="Missões do professor (sem as de evento) que o aluno já concluiu.">
          {missions.available === 0 ? (
            <EmptyState icon="📭">O professor ainda não tem missões no catálogo.</EmptyState>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <ProgressRing value={missions.completedAvailable} total={missions.available} label="Missões concluídas do catálogo" />
              <div className="grid w-full grid-cols-2 gap-2 text-center text-xs">
                <div className="rounded-xl border border-slate-800 bg-cg-sunken p-2">
                  <p className="text-lg font-black text-white tabular-nums">{missions.completedQuiz}</p>
                  <p className="text-slate-500">quizzes</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-cg-sunken p-2">
                  <p className="text-lg font-black text-white tabular-nums">{missions.completedTasks}</p>
                  <p className="text-slate-500">entregas</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Faltam {missions.available - missions.completedAvailable} de {missions.available} missões.
              </p>
            </div>
          )}
        </Panel>
      </div>

      {/* ---- missões por semana + acertos x erros ---- */}
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <Panel title="📅 Missões concluídas por semana" subtitle={`Últimas ${WEEKS} semanas • ${weeklyTotal} ${weeklyTotal === 1 ? "missão" : "missões"} no período.`} className="lg:col-span-2">
          <ColumnChart data={weeklyBars} seriesName="Missões concluídas por semana" color="var(--viz-series-2)" formatTick={(v) => String(v)} height={200} />
          <DataTable
            caption="Missões concluídas por semana"
            columns={["Semana", "Missões"]}
            rows={weeks.map((w) => [`${shortDate(w)} a ${shortDate(addDays(w, 6))}`, String(countByWeek.get(w) ?? 0)])}
          />
        </Panel>

        <Panel title="🎯 Acertos x erros" subtitle={`Todas as perguntas respondidas nos quizzes. ${sinceNote(quiz.since)}`}>
          {quiz.total === 0 ? (
            <EmptyState icon="📝">Nenhum quiz respondido desde que os acertos começaram a ser registrados.</EmptyState>
          ) : (
            <div className="flex flex-col gap-5">
              <SplitBar good={quiz.correct} bad={wrong} goodLabel="Acertos" badLabel="Erros" />
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="rounded-xl border border-slate-800 bg-cg-sunken p-2">
                  <p className="text-lg font-black text-white tabular-nums">{quiz.passed}</p>
                  <p className="text-slate-500">tentativas aprovadas</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-cg-sunken p-2">
                  <p className="text-lg font-black text-white tabular-nums">{quiz.attempts - quiz.passed}</p>
                  <p className="text-slate-500">abaixo de 60%</p>
                </div>
              </div>
            </div>
          )}
        </Panel>
      </div>

      {/* ---- acertos por missão + últimas tentativas ---- */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Panel title="📈 Acertos por missão" subtitle="Média de acertos de cada quiz (todas as tentativas).">
          {quiz.byMission.length === 0 ? (
            <EmptyState icon="📈">As médias aparecem quando o aluno fizer os quizzes.</EmptyState>
          ) : (
            <ScoreBars
              rows={quiz.byMission.map((m) => ({
                key: m.missionId,
                label: (
                  <>
                    <span className="mr-1">{m.icon}</span>
                    {m.title}
                  </>
                ),
                value: m.average ?? 0,
                detail: `${m.attempts} ${m.attempts === 1 ? "tentativa" : "tentativas"} • melhor: ${Math.round((m.best ?? 0) * 100)}%`,
              }))}
            />
          )}
        </Panel>

        <Panel title="🧾 Últimas tentativas" subtitle="Os quizzes mais recentes, com a nota de cada um.">
          {quiz.recent.length === 0 ? (
            <EmptyState icon="🧾">Nenhuma tentativa registrada ainda.</EmptyState>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-[11px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="pb-2 font-semibold">Missão</th>
                    <th className="pb-2 font-semibold">Quando</th>
                    <th className="pb-2 text-right font-semibold">Acertos</th>
                    <th className="pb-2 text-right font-semibold">Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {quiz.recent.map((a) => (
                    <tr key={a.id} className="border-t border-slate-800/70">
                      <td className="max-w-[12rem] truncate py-2 pr-2 text-slate-200">
                        <span className="mr-1">{a.icon}</span>
                        {a.title}
                      </td>
                      <td className="whitespace-nowrap py-2 pr-2 text-xs text-slate-400">{formatDateTime(a.createdAt)}</td>
                      <td className="py-2 text-right font-semibold text-white tabular-nums">
                        {a.correct}/{a.total}
                      </td>
                      <td className="py-2 pl-2 text-right">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                            a.passed ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "border-rose-500/40 bg-rose-500/10 text-rose-300"
                          }`}
                        >
                          {a.passed ? "✓ Passou" : "✗ Não passou"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>

      {/* ---- entregas ---- */}
      <Panel title="📤 Missões de entrega" subtitle="Situação das entregas que o aluno enviou.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { key: "aprovada", icon: "✅", label: "Aprovadas", tone: "text-emerald-300" },
            { key: "pendente", icon: "⏳", label: "Esperando correção", tone: "text-amber-300" },
            { key: "refazer", icon: "🔁", label: "Para refazer", tone: "text-rose-300" },
            { key: "enviando", icon: "📎", label: "Envio não terminado", tone: "text-slate-300" },
          ].map((s) => (
            <div key={s.key} className="rounded-xl border border-slate-800 bg-cg-sunken p-3">
              <p className={`flex items-center gap-1.5 text-xs font-semibold ${s.tone}`}>
                <span>{s.icon}</span>
                {s.label}
              </p>
              <p className="mt-1 text-2xl font-black text-white tabular-nums">{submissions[s.key] ?? 0}</p>
            </div>
          ))}
        </div>
      </Panel>

      <p className="mt-6 text-center text-[11px] text-slate-600">
        Tempo online, último acesso e acertos começaram a ser registrados quando essas funções entraram no ar; as missões concluídas contam desde sempre.
      </p>
    </>
  );
}
