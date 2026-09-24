"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Toda entrada na plataforma começa pela tela de login. */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/entrar");
  }, [router]);

  return (
    <div className="flex cg-screen items-center justify-center bg-cg-bg">
      <p className="font-mono text-sm text-slate-500">Carregando…</p>
    </div>
  );
}
