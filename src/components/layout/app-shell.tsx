"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Star,
  Bookmark,
  Bell,
  User,
  Search,
  type LucideIcon,
} from "lucide-react";
import { BrandMark, Wordmark } from "@/components/brand/mark";

const NAV_ITEMS: { href: string; icon: LucideIcon; label: string }[] = [
  { href: "/feed", icon: Home, label: "Home" },
  { href: "/for-you", icon: Star, label: "For You" },
  { href: "/saved", icon: Bookmark, label: "Saved" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-60 flex-col border-r border-line shrink-0" style={{ background: 'rgba(10, 10, 10, 0.4)', backdropFilter: 'blur(32px)' }}>
        <Link href="/feed" className="px-5 py-5 flex items-center gap-3">
          <BrandMark size={32} />
          <Wordmark />
        </Link>

        <nav className="flex-1 px-3 space-y-1 mt-2">
          {NAV_ITEMS.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={pathname === item.href || pathname.startsWith(item.href + "/")}
            />
          ))}
          <SidebarItem
            href="/notifications"
            icon={Bell}
            label="Alerts"
            active={pathname === "/notifications"}
          />
        </nav>

        <div className="px-3 pb-4 pt-2 border-t border-line">
          <button className="flex items-center gap-3 w-full p-3 rounded-lg text-ink-2 text-sm font-medium hover:bg-[rgba(255,255,255,0.05)] transition-colors">
            <Search className="w-4 h-4" />
            <span>Search</span>
            <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.05)] border border-line text-ink-3 font-mono">⌘K</kbd>
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 h-full overflow-y-auto relative">
        {/* Mobile top bar */}
        <header className="md:hidden glass-bar sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
          <Link href="/feed" className="flex items-center gap-2">
            <BrandMark size={28} />
            <Wordmark />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/notifications"
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[rgba(255,255,255,0.05)] transition-colors relative"
            >
              <Bell className="w-[18px] h-[18px] text-ink-2" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger shadow-[0_0_8px_var(--color-danger)]" />
            </Link>
          </div>
        </header>

        <div className="w-full max-w-6xl mx-auto pb-24 md:pb-8">
          {children}
        </div>

        {/* ── Mobile bottom pill nav ── */}
        <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50 pill-nav px-2 py-2">
          <div className="flex items-center justify-around">
            {NAV_ITEMS.map((item) => (
              <PillNavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={pathname === item.href || pathname.startsWith(item.href + "/")}
              />
            ))}
          </div>
        </nav>
      </main>
    </div>
  );
}

function SidebarItem({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-control)] transition-all text-sm font-medium ${
        active
          ? "bg-[rgba(255,255,255,0.1)] text-white font-semibold shadow-[inset_2px_0_0_var(--color-signal-500)]"
          : "text-ink-2 hover:bg-[rgba(255,255,255,0.03)] hover:text-ink"
      }`}
    >
      <Icon className="w-[18px] h-[18px]" style={active ? { filter: 'drop-shadow(0 0 8px var(--color-signal-500))', color: 'var(--color-signal-500)' } : undefined} />
      <span>{label}</span>
    </Link>
  );
}

function PillNavItem({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
        active ? "text-signal-600" : "text-ink-3"
      }`}
    >
      <Icon className="w-5 h-5" style={active ? { fill: "var(--color-signal-50)" } : undefined} />
      <span className={`text-[10px] ${active ? "font-bold" : "font-medium"}`}>{label}</span>
    </Link>
  );
}
