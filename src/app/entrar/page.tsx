"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useStudents, useTeachers } from "@/engine/store";
import { HOUSES } from "@/engine/houses";
import { Student, validateCredentials, normalizeUsername } from "@/engine/students";

type Mode = "entrar" | "criar";

const MODE_LABELS: Record<Mode, string> = { entrar: "Entrar", criar: "Criar conta" };

/** Pra onde o aluno vai depois de entrar: continua o primeiro acesso de onde parou. */
function nextRoute(student: Student): string {
  if (student.onboardingStep === "casa") return "/casa-selecao";
  if (student.onboardingStep === "avatar") return "/avatar";
  return "/academia/missoes";
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">{children}</label>;
}

function PasswordInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="cg-input !pr-11"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        title={visible ? "Esconder senha" : "Mostrar senha"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm opacity-60 hover:opacity-100"
      >
        {visible ? "🙈" : "👁"}
      </button>
    </div>
  );
}

export default function EntrarPage() {
  const { signUp, login, activeStudent, logout } = useStudents();
  const { teachers } = useTeachers();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("entrar");
  const [error, setError] = useState<string | null>(null);

  // entrar
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");

  // criar conta
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [turma, setTurma] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  function switchMode(m: Mode) {
    setMode(m);
    setError(null);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const result = login(loginUser, loginPass);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(nextRoute(result.student));
  }

  function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !turma.trim()) return;
    if (!teachers.some((t) => t.id === teacherId)) {
      setError("Escolha o seu professor.");
      return;
    }
    const problem = validateCredentials(username, password);
    if (problem) {
      setError(problem);
      return;
    }
    if (password !== confirm) {
      setError("As senhas não conferem.");
      return;
    }
    signUp({ name, email, turma, username, password, teacherId });
    router.push("/casa-selecao");
  }

  return (
    <div className="flex cg-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black text-cg-ink">C</div>
        <span className="text-lg font-bold tracking-tight text-white">CODEGUILDS</span>
        <span className="rounded-full border border-slate-700 bg-cg-raised px-2 py-0.5 text-[11px] font-medium text-slate-400">BETA</span>
      </div>

      <div className="cg-card w-full max-w-md p-8">
        <h1 className="text-3xl font-bold leading-tight text-white">
          {mode === "entrar" ? "Bem-vindo de volta," : "Entre para a"}
          <br />
          {mode === "entrar" ? "aprendiz" : "Academia de Código"}
        </h1>
        <p className="mt-3 text-sm text-slate-400">Quatro casas. Missões reais. XP, moedas e itens lendários. Aprenda programando.</p>

        {activeStudent && (
          <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-3 text-xs text-violet-200">
            <span>
              Conectado como <span className="font-semibold">{activeStudent.name}</span>
            </span>
            <span className="flex gap-2">
              <button onClick={() => router.push(nextRoute(activeStudent))} className="font-semibold text-white hover:underline">
                Continuar →
              </button>
              <button onClick={logout} className="text-violet-300 hover:underline">
                Sair
              </button>
            </span>
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl border border-slate-800 bg-cg-sunken p-1">
          {(Object.keys(MODE_LABELS) as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                mode === m ? "bg-white text-cg-ink" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>

        {error && <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">{error}</p>}

        {mode === "entrar" ? (
          <form onSubmit={handleLogin} className="mt-5 flex flex-col gap-4">
            <div>
              <Label>Login</Label>
              <input value={loginUser} onChange={(e) => setLoginUser(e.target.value)} placeholder="seu.login" required autoComplete="username" className="cg-input" />
            </div>
            <div>
              <Label>Senha</Label>
              <PasswordInput value={loginPass} onChange={setLoginPass} placeholder="••••••" />
            </div>
            <button type="submit" className="cg-btn-primary mt-2 w-full">
              Entrar na Academia →
            </button>
            <p className="text-center text-xs text-slate-500">
              Ainda não tem conta?{" "}
              <button type="button" onClick={() => switchMode("criar")} className="font-semibold text-slate-300 hover:text-white">
                Criar conta
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="mt-5 flex flex-col gap-4">
            <div>
              <Label>Nome do aprendiz</Label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Ana Turing" required className="cg-input" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>E-mail</Label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ana@escola.com" required className="cg-input" />
              </div>
              <div>
                <Label>Turma</Label>
                <input value={turma} onChange={(e) => setTurma(e.target.value)} placeholder="3ºA - Manhã" required className="cg-input" />
              </div>
            </div>
            <div>
              <Label>Professor</Label>
              <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)} required className="cg-input">
                <option value="" disabled>
                  Escolha seu professor
                </option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-slate-500">Você vai ver as missões criadas por esse professor.</p>
            </div>
            <div>
              <Label>Login</Label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="ana.turing" required autoComplete="username" className="cg-input" />
              {username && normalizeUsername(username) !== username && (
                <p className="mt-1 text-[11px] text-slate-500">
                  Vai ficar assim: <span className="font-mono text-slate-300">{normalizeUsername(username)}</span>
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>Senha</Label>
                <PasswordInput value={password} onChange={setPassword} placeholder="mín. 4 caracteres" />
              </div>
              <div>
                <Label>Confirmar senha</Label>
                <PasswordInput value={confirm} onChange={setConfirm} placeholder="repita a senha" />
              </div>
            </div>
            <button type="submit" className="cg-btn-primary mt-2 w-full">
              Iniciar Jornada →
            </button>
            <p className="text-center text-[11px] text-slate-600">Ao continuar, você aceita o juramento das 4 Casas</p>
          </form>
        )}
      </div>

      <div className="mt-8 flex items-center gap-3">
        {HOUSES.map((h) => (
          <div key={h.id} className="h-11 w-11 overflow-hidden rounded-full border border-slate-800 bg-cg-card p-1.5 opacity-80">
            <Image src={h.crest} alt={h.name} width={44} height={44} className="h-full w-full object-contain" />
          </div>
        ))}
      </div>

      <a href="/professor" className="mt-6 text-[11px] text-slate-600 hover:text-slate-400">
        Sou professor →
      </a>
    </div>
  );
}
