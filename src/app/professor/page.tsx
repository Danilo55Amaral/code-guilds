"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const VALID_EMAIL = "danilo@codeguilds.com";
const VALID_PASSWORD = "prof123";
const MASTER_CODE = "KAIROIS2024";

export default function ProfessorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const emailOk = email === VALID_EMAIL || email === MASTER_CODE;
    const passwordOk = password === VALID_PASSWORD || password === MASTER_CODE;
    if (emailOk && passwordOk) {
      window.localStorage.setItem("cg-teacher-auth", "1");
      router.push("/professor/painel");
    } else {
      setError("Credenciais inválidas. Confira o e-mail e a senha (ou use o código secreto).");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="cg-card w-full max-w-md p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-black text-[#0a0a0f]">M</div>
          <div>
            <p className="text-sm font-bold text-white">PAINEL DO MESTRE</p>
            <p className="text-xs text-slate-500">Acesso exclusivo do professor</p>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white">Bem-vindo, Mestre Danilo</h1>
        <p className="mt-2 text-sm text-slate-400">Entre com suas credenciais ou código secreto para gerenciar missões.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">E-mail</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="danilo@codeguilds.com ou código"
              className="cg-input"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">Senha ou código secreto</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="prof123 ou KAIROIS2024"
              className="cg-input"
            />
          </div>
          <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-[11px] text-amber-300">
            💡 Dica: {MASTER_CODE} funciona nos dois campos
          </p>

          {error && <p className="text-xs text-rose-400">{error}</p>}

          <button type="submit" className="cg-btn-primary mt-1 w-full">
            Entrar no Painel →
          </button>
        </form>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-800 bg-[#0d0d14] p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Email válido</p>
            <p className="mt-0.5 text-xs font-mono text-slate-300">{VALID_EMAIL}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-[#0d0d14] p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Senha / Código</p>
            <p className="mt-0.5 text-xs font-mono text-slate-300">
              {VALID_PASSWORD} • {MASTER_CODE}
            </p>
          </div>
        </div>

        <a href="/academia/missoes" className="mt-6 block text-center text-xs text-slate-500 hover:text-slate-300">
          ← Voltar para Academia
        </a>
      </div>
    </div>
  );
}
