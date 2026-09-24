"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStudents } from "@/engine/store";

export default function Home() {
  const { activeStudent, ready } = useStudents();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!activeStudent) {
      router.replace("/entrar");
    } else if (activeStudent.onboardingStep === "casa") {
      router.replace("/casa-selecao");
    } else if (activeStudent.onboardingStep === "avatar") {
      router.replace("/avatar");
    } else {
      router.replace("/academia/missoes");
    }
  }, [ready, activeStudent, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#08080c]">
      <p className="font-mono text-sm text-slate-500">Carregando…</p>
    </div>
  );
}
