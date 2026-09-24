import { Rarity, RARITY_META, Difficulty, DIFFICULTY_META } from "@/engine/missions";
import { House } from "@/engine/houses";
import { MessageKind, MESSAGE_KIND_META } from "@/engine/messages";

export function XPBar({ xp, xpToNext, className = "" }: { xp: number; xpToNext: number; className?: string }) {
  const pct = Math.min(100, (xp / xpToNext) * 100);
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-slate-800 ${className}`}>
      <div className="h-full rounded-full bg-violet-500 transition-all duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function RarityBadge({ rarity }: { rarity: Rarity }) {
  const m = RARITY_META[rarity];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${m.colorClass} ${m.borderClass}`}>
      {m.label}
    </span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const m = DIFFICULTY_META[difficulty];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${m.colorClass} ${m.borderClass}`}>
      {m.label}
    </span>
  );
}

export function MessageKindBadge({ kind }: { kind: MessageKind }) {
  const m = MESSAGE_KIND_META[kind];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${m.colorClass} ${m.borderClass}`}>
      {m.icon} {m.label}
    </span>
  );
}

export function HousePill({ house }: { house: House }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${house.colorClass} ${house.borderClass} ${house.bgClass}`}>
      {house.name}
    </span>
  );
}

// Moeda em SVG em vez do emoji 🪙 — ele é Unicode 13 e o Windows 10 não tem
// esse glifo na fonte de emoji, então aparecia um quadrado quebrado.
export function CoinIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={`inline-block shrink-0 ${className}`} aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#b45309" />
      <circle cx="12" cy="11.2" r="10" fill="#fbbf24" />
      <circle cx="12" cy="11.2" r="7" fill="none" stroke="#d97706" strokeWidth="1.5" />
      <path d="M12 6.8l1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4z" fill="#d97706" />
    </svg>
  );
}

// Corvo em SVG — o emoji 🐦‍⬛ é Unicode 15 e no Windows 10 aparece quebrado
// (um pássaro + um quadrado preto lado a lado).
export function CrowIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={`inline-block shrink-0 ${className}`} aria-hidden="true">
      <path d="M21.5 20l-4-5.2" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M5 9.5c0-3 2-5 4.5-5S13 6 13.5 8.5c4 .5 7 3.5 6.5 7-3 1.5-8 1.5-11-.5C6.5 13.5 5 12 5 9.5z"
        fill="#1e293b"
        stroke="#94a3b8"
        strokeWidth="1.2"
      />
      <path d="M5.4 7.2L0.8 9.4l4.8 1.1z" fill="#cbd5e1" />
      <path d="M10 12.5c2.5 1.8 5.5 2.2 8.5 1.6" fill="none" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8.2" cy="7.6" r="1" fill="#f8fafc" />
      <path d="M11 16.5v3M14 17v3" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/** Ícone do animal da casa. Leão/Serpente/Águia são emojis antigos e renderizam em todo lugar; o Corvo usa SVG. */
export function HouseAnimalIcon({ house, size = 16 }: { house: House; size?: number }) {
  if (house.animal === "Leão") return <>🦁</>;
  if (house.animal === "Serpente") return <>🐍</>;
  if (house.animal === "Águia") return <>🦅</>;
  return <CrowIcon size={size} />;
}

export function CoinCount({ coins }: { coins: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-300">
      <CoinIcon /> {coins}
    </span>
  );
}

export function LevelPill({ level }: { level: number }) {
  return <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-200">Nv {level}</span>;
}
