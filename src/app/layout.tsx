import type { Metadata } from "next";
import "./globals.css";
import { THEME_INIT_SCRIPT } from "@/engine/theme";
import { FloatingThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "CodeGuilds",
  description: "Academia de Código gamificada — quatro casas, missões reais, XP, moedas e itens lendários.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // O script do <head> põe a classe `light` antes do React — daí o suppressHydrationWarning.
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        {children}
        <FloatingThemeToggle />
        {/* altura fixa (h-12 = 3rem) — as telas descontam isso em .cg-screen, pra o rodapé caber sem precisar rolar */}
        <footer className="flex h-12 items-center justify-center border-t border-slate-800/60 bg-cg-bg px-4 text-center text-[11px] text-slate-500">
          © 2026 Copyright Danilo Amaral
        </footer>
      </body>
    </html>
  );
}
