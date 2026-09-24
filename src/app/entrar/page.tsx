"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useStudents } from "@/engine/store";
import { HOUSES } from "@/engine/houses";

export default function EntrarPage() {
  const { signUp } = useStudents();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [turma, setTurma] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !turma.trim()) return;
    signUp({ name, email, turma });
    router.push("/casa-selecao");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black text-[#0a0a0f]">C</div>
        <span className="text-lg font-bold tracking-tight text-white">CODEGUILDS</span>
        <span className="rounded-full border border-slate-700 bg-[#12121a] px-2 py-0.5 text-[11px] font-medium text-slate-400">BETA</span>
      </div>

      <div className="cg-card w-full max-w-md p-8">
        <h1 className="text-3xl font-bold leading-tight text-white">
          Entre para a
          <br />
          Academia de Código
        </h1>
        <p className="mt-3 text-sm text-slate-400">
          Quatro casas. Missões reais. XP, moedas e itens lendários. Aprenda programando.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">Nome do aprendiz</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Ana Turing" required className="cg-input" />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ana@escola.com"
              required
              className="cg-input"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">Turma</label>
            <input
              value={turma}
              onChange={(e) => setTurma(e.target.value)}
              placeholder="3ºA - Manhã"
              required
              className="cg-input"
            />
          </div>

          <button type="submit" className="cg-btn-primary mt-2 w-full">
            Iniciar Jornada →
          </button>
        </form>
        <p className="mt-4 text-center text-[11px] text-slate-600">Ao continuar, você aceita o juramento das 4 Casas</p>
      </div>

      <div className="mt-8 flex items-center gap-3">
        {HOUSES.map((h) => (
          <div key={h.id} className="h-11 w-11 overflow-hidden rounded-full border border-slate-800 bg-[#101018] p-1.5 opacity-80">
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
