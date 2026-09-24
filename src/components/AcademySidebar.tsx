"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStudents, useMessages } from "@/engine/store";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  children?: NavItem[];
}

const NAV_ITEMS: NavItem[] = [
  { href: "/academia/missoes", label: "Missões", icon: "⚔️" },
  { href: "/academia/inventario", label: "Inventário", icon: "🛡️" },
  {
    href: "/academia/casa",
    label: "Minha Casa",
    icon: "🏰",
    children: [{ href: "/academia/casa/mensagens", label: "Mensagens", icon: "📨" }],
  },
  { href: "/academia/guildas", label: "Guildas", icon: "⚜️" },
  { href: "/academia/lore", label: "Lore", icon: "📜" },
  { href: "/academia/eventos", label: "Eventos", icon: "📅" },
];

const MESSAGES_HREF = "/academia/casa/mensagens";

export default function AcademySidebar() {
  const pathname = usePathname();
  const { activeStudent } = useStudents();
  const { unreadCount } = useMessages(activeStudent?.id ?? null);

  function renderLink(item: NavItem, isChild: boolean) {
    const active = pathname === item.href;
    const badge = item.href === MESSAGES_HREF && unreadCount > 0 ? unreadCount : null;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex flex-1 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors sm:flex-none ${isChild ? "sm:ml-5 sm:py-2 sm:text-xs" : ""} ${
          active ? "bg-white text-[#0a0a0f]" : "border border-slate-800 bg-[#101018] text-slate-300 hover:border-slate-600"
        }`}
      >
        <span>{item.icon}</span>
        {item.label}
        {badge !== null && (
          <span className="ml-auto rounded-full bg-violet-500 px-1.5 text-[10px] font-semibold text-white">{badge > 9 ? "9+" : badge}</span>
        )}
      </Link>
    );
  }

  return (
    <aside className="w-full shrink-0 px-4 py-6 sm:w-56">
      <nav className="flex flex-row flex-wrap gap-2 sm:flex-col">
        {NAV_ITEMS.flatMap((item) => [renderLink(item, false), ...(item.children ?? []).map((child) => renderLink(child, true))])}
      </nav>
    </aside>
  );
}
