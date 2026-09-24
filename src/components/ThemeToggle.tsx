"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "@/engine/store";

function SunIcon() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" fill="currentColor" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1z" fill="currentColor" />
    </svg>
  );
}

/**
 * Botão que alterna o tema: no escuro mostra o ☀️ (vai pro claro); no claro
 * mostra a 🌙 (volta pro escuro).
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? "Ativar modo claro" : "Ativar modo escuro";
  return (
    <button
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-cg-card transition-colors hover:border-slate-500 ${
        isDark ? "text-amber-300" : "text-violet-400"
      } ${className}`}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

// Telas que já têm o botão no próprio cabeçalho.
const PAGES_WITH_HEADER_TOGGLE = ["/academia", "/professor/painel", "/admin/painel"];

/** Botão flutuante (canto superior direito) pras telas sem cabeçalho: login, cadastro, casa e avatar. */
export function FloatingThemeToggle() {
  const pathname = usePathname() ?? "";
  if (PAGES_WITH_HEADER_TOGGLE.some((p) => pathname.startsWith(p))) return null;
  return <ThemeToggle className="fixed right-4 top-4 z-40 shadow-lg shadow-black/20" />;
}
