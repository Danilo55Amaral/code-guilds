"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStudents } from "@/engine/store";
import AcademyHeader from "@/components/AcademyHeader";
import AcademySidebar from "@/components/AcademySidebar";

export default function AcademiaLayout({ children }: { children: React.ReactNode }) {
  const { activeStudent, ready } = useStudents();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!activeStudent) {
      router.replace("/entrar");
    } else if (activeStudent.onboardingStep !== "completo") {
      router.replace(activeStudent.onboardingStep === "casa" ? "/casa-selecao" : "/avatar");
    }
  }, [ready, activeStudent, router]);

  if (!ready || !activeStudent || activeStudent.onboardingStep !== "completo") {
    return <div className="flex cg-screen items-center justify-center bg-cg-bg text-sm text-slate-500">Carregando…</div>;
  }

  return (
    <div className="cg-screen bg-cg-bg">
      <AcademyHeader student={activeStudent} />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:flex-row">
        <AcademySidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
