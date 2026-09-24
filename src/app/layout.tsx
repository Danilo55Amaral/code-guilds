import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeGuilds",
  description: "Academia de Código gamificada — quatro casas, missões reais, XP, moedas e itens lendários.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        {children}
        {/* altura fixa (h-12 = 3rem) — as telas descontam isso em .cg-screen, pra o rodapé caber sem precisar rolar */}
        <footer className="flex h-12 items-center justify-center border-t border-slate-800/60 bg-[#08080c] px-4 text-center text-[11px] text-slate-500">
          © 2026 Copyright Danilo Amaral
        </footer>
      </body>
    </html>
  );
}
