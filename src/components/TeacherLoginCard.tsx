"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTeachers } from "@/engine/store";
import { MASTER_CODE } from "@/engine/teachers";

const DEMO_EMAIL = "danilo@codeguilds.com";
const DEMO_PASSWORD = "prof123";

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
    intro: "Entre com as credenciais do Professor Danilo para gerenciar professores, alunos e missões de toda a plataforma.",
    submit: "Entrar no Painel ADM →",
    target: "/admin/painel",
  },
};

/** Login do professor (/professor) e do ADM (/admin) — o ADM usa as mesmas credenciais do Professor Danilo. */
export default function TeacherLoginCard({ variant }: { variant: keyof typeof VARIANTS }) {
  const router = useRouter();
  const { login } = useTeachers();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const v = VARIANTS[variant];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = login(email, password, variant === "admin");
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
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="professor@codeguilds.com ou código" className="cg-input" />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">Senha ou código secreto</label>
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="sua senha" className="cg-input" />
          </div>
          <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-[11px] text-amber-300">
            💡 Dica: {MASTER_CODE} nos dois campos entra como o Professor Danilo (ADM)
          </p>

          {error && <p className="text-xs text-rose-400">{error}</p>}

          <button type="submit" className="cg-btn-primary mt-1 w-full">
            {v.submit}
          </button>
        </form>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-800 bg-cg-sunken p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Professor Danilo (ADM)</p>
            <p className="mt-0.5 text-xs font-mono text-slate-300">{DEMO_EMAIL}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-cg-sunken p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Senha / Código</p>
            <p className="mt-0.5 text-xs font-mono text-slate-300">
              {DEMO_PASSWORD} • {MASTER_CODE}
            </p>
          </div>
        </div>

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
