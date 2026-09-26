// Placeholder das telas que ainda não foram construídas (Lore, Guildas).
export default function ComingSoon({ title, icon, description }: { title: string; icon: string; description: string }) {
  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-white">{title}</h1>

      <div className="cg-card flex flex-col items-center gap-3 px-6 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cg-tile text-3xl">{icon}</div>
        <span className="rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-violet-300">
          Em breve
        </span>
        <p className="text-lg font-semibold text-white">Esta página será criada em breve</p>
        <p className="max-w-md text-sm text-slate-400">{description}</p>
      </div>
    </div>
  );
}
