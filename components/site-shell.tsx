import Link from "next/link";
import type { ReactNode } from "react";

import { Hanko } from "@/components/ui/hanko";

const navLink =
  "rounded-md px-3 py-2 text-sm font-medium text-[var(--wk-text-muted)] transition-colors hover:bg-[var(--wk-surface)] hover:text-[var(--wk-text)]";

export function SiteShell({
  children,
  title,
  hideTitle,
  fullWidth,
}: {
  children: ReactNode;
  title?: string;
  hideTitle?: boolean;
  fullWidth?: boolean;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-[var(--wk-border)] bg-[var(--wk-surface)]">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="flex items-center gap-3 text-text no-underline">
            <Hanko glyph="字" />
            <span className="flex flex-col leading-[1.2]">
              <strong className="text-[17px]">Oyster</strong>
              <span lang="ja" className="text-[13px] text-text-2">漢字マスター N4</span>
            </span>
          </Link>
          <nav className="flex gap-1">
            <Link href="/" className={navLink}>Início</Link>
            <Link href="/study" className={navLink}>Currículo</Link>
            <Link href="/lessons" className={navLink}>Lições</Link>
            <Link href="/practice" className={navLink}>Prática</Link>
          </nav>
        </div>
      </header>
      <div
        className={`mx-auto flex w-full flex-1 flex-col px-4 py-8 ${
          fullWidth ? "max-w-3xl" : "max-w-lg"
        }`}
      >
        {title && !hideTitle ? (
          <h1 className="mb-8 text-2xl font-bold tracking-tight">{title}</h1>
        ) : null}
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
      <footer className="border-t border-[var(--wk-border)] py-4 text-center text-xs text-[var(--wk-text-muted)]">
        Oyster · SRS inspirado no WaniKani · currículo 漢字マスター N4
      </footer>
    </div>
  );
}
