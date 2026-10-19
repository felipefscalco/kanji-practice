"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cx } from "@/components/ui/cx";
import { Hanko } from "@/components/ui/hanko";
import { BookIcon, FlameIcon, HomeIcon, ListIcon, RefreshIcon } from "@/components/ui/icons";
import { useStudyDays } from "@/hooks/use-activity";
import { useStudyStats } from "@/hooks/use-study-stats";
import { currentStreak } from "@/lib/activity";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  badge?: number;
  /** The badge for items ready now is filled; counts of new things stay neutral. */
  badgeStrong?: boolean;
};

function useNavItems(): NavItem[] {
  const stats = useStudyStats();
  // TODO(design): badges should count lessons pending and reviews due once the SRS is wired;
  // today they show the next lesson round and the next practice session.
  return [
    { href: "/", label: "Início", icon: <HomeIcon /> },
    { href: "/lessons", label: "Lições", icon: <BookIcon />, badge: stats?.lessonKanji.length },
    { href: "/practice", label: "Revisões", icon: <RefreshIcon size={22} />, badge: stats?.sessionCount, badgeStrong: true },
    { href: "/study", label: "Currículo", icon: <ListIcon /> },
  ];
}

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function badgeLabel(item: NavItem): string {
  return item.badge ? `${item.label}, ${item.badge} ${item.href === "/lessons" ? "novos" : "prontos"}` : item.label;
}

function Streak() {
  const days = useStudyDays();
  if (!days) {
    return null;
  }
  const streak = currentStreak(days, new Date());
  if (streak === 0) {
    return null;
  }
  return (
    <span
      className="flex items-center gap-1.5 font-semibold tabular-nums text-shu"
      aria-label={`Sequência de ${streak} ${streak === 1 ? "dia" : "dias"}`}
    >
      <FlameIcon />
      {streak}
    </span>
  );
}

/** Desktop: 64px header with tabs. Mobile: 56px header (the tabs live in the bottom bar). */
export function AppHeader({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex h-14 max-w-[1120px] items-center gap-2.5 px-4 sm:h-16 sm:gap-8 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 text-text no-underline sm:gap-3">
          <Hanko glyph="字" />
          <span className="flex flex-col leading-[1.2]">
            <strong className="text-[17px]">Oyster</strong>
            <span lang="ja" className="hidden text-[13px] text-text-2 sm:block">
              漢字マスター N4
            </span>
          </span>
        </Link>
        <nav aria-label="Principal" className="hidden gap-7 sm:flex">
          {items.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                aria-label={badgeLabel(item)}
                className={cx(
                  "inline-flex h-16 items-center gap-2 border-b-2 px-1 text-[15px] font-semibold no-underline transition-colors duration-[var(--dur-fast)]",
                  active ? "border-shu text-text" : "border-transparent text-text-2 hover:text-text",
                )}
              >
                {item.label}
                {item.badge ? (
                  <span
                    aria-hidden
                    className={cx(
                      "inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-full px-[7px] text-xs font-bold tabular-nums",
                      item.badgeStrong ? "bg-text text-bg" : "bg-surface-3 text-text",
                    )}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Streak />
        </div>
      </div>
    </header>
  );
}

export function BottomTabBar({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-20 flex h-[72px] border-t border-line bg-surface-1/96 px-2 pb-3 pt-1 backdrop-blur-sm sm:hidden"
    >
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            aria-label={badgeLabel(item)}
            className={cx(
              "relative flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-xs font-semibold no-underline",
              active ? "text-text" : "text-text-3",
            )}
          >
            {item.icon}
            {item.badge ? (
              <span
                aria-hidden
                className="absolute left-[calc(50%+6px)] top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-text px-[5px] text-[11px] font-bold tabular-nums text-bg"
              >
                {item.badge}
              </span>
            ) : null}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Global layout for the browsing screens (not the focus-mode practice and lesson). */
export function AppShell({ children, className }: { children: ReactNode; className?: string }) {
  const items = useNavItems();
  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader items={items} />
      <main
        className={cx(
          "mx-auto flex w-full max-w-[1120px] flex-1 flex-col px-4 pb-[100px] pt-5 sm:px-6 sm:pb-16 sm:pt-10",
          className,
        )}
      >
        {children}
      </main>
      <BottomTabBar items={items} />
    </div>
  );
}
