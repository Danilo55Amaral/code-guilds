"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTeachers } from "@/engine/store";

const VARIANTS = {
  professor: {
    badge: "M",
    title: "PAINEL DO MESTRE",
    subtitle: "Acesso exclusivo do professor",
    heading: "Bem-vindo, Mestre",
    intro: "Entre com seu e-mail e senha de professor para gerenciar suas missões e seus alunos.",
    submit: "Entrar no Painel →",
    target: "/professor/painel",
  },
  admin: {
    badge: "A",
    title: "PAINEL ADM",
    subtitle: "Acesso exclusivo do administrador",
    heading: "Administração da Academia",
    intro: "Entre com o e-mail e a senha do ADM para gerenciar professores, alunos e missões de toda a plataforma.",
    submit: "Entrar no Painel ADM →",
    target: "/admin/painel",
  },
};

/**
 * Login do professor (/professor) e do ADM (/admin) — o ADM usa as mesmas
 * credenciais de professor dele. Quem confere o e-mail e a senha é a API.
 */
export default function TeacherLoginCard({ variant }: { variant: keyof typeof VARIANTS }) {
  const router = useRouter();
  const { login } = useTeachers();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const v = VARIANTS[variant];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const result = await login(email, password, variant === "admin");
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(v.target);
  }

  return (
    <div className="flex cg-screen items-center justify-center px-4 py-12">
      <div className="cg-card w-full max-w-md p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-black text-cg-ink">{v.badge}</div>
          <div>
            <p className="text-sm font-bold text-white">{v.title}</p>
            <p className="text-xs text-slate-500">{v.subtitle}</p>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white">{v.heading}</h1>
        <p className="mt-2 text-sm text-slate-400">{v.intro}</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="professor@codeguilds.com" required autoComplete="username" className="cg-input" />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="sua senha"
                required
                autoComplete="current-password"
                className="cg-input !pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                title={showPassword ? "Esconder senha" : "Mostrar senha"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm opacity-60 hover:opacity-100"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-rose-400">{error}</p>}

          <button type="submit" disabled={busy} className="cg-btn-primary mt-1 w-full disabled:cursor-wait disabled:opacity-60">
            {busy ? "Entrando…" : v.submit}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-xs">
          <a href="/academia/missoes" className="text-slate-500 hover:text-slate-300">
            ← Voltar para Academia
          </a>
          {variant === "professor" ? (
            <a href="/admin" className="text-slate-500 hover:text-slate-300">
              🛡 Painel ADM →
            </a>
          ) : (
            <a href="/professor" className="text-slate-500 hover:text-slate-300">
              Área do Professor →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
