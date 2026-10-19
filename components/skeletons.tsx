import { cx } from "@/components/ui/cx";

/** Practice loading state with the exact geometry of the header and card (no layout shift). */
export function PracticeSkeleton() {
  return (
    <div className="flex min-h-dvh flex-col" aria-busy="true">
      <span className="sr-only" role="status">
        Carregando revisões
      </span>
      <div aria-hidden className="flex h-14 items-center gap-2 pl-1 pr-2 sm:h-16 sm:gap-6 sm:border-b sm:border-line sm:px-6">
        <span className="size-11" />
        <div className="skeleton mx-auto h-1.5 flex-1 rounded-full sm:max-w-[560px]" />
        <span className="w-24" />
      </div>
      <div aria-hidden className="flex flex-1 flex-col items-center px-4 pt-1 sm:px-6 sm:pt-10">
        <div className="w-full max-w-[720px] overflow-hidden rounded-[20px] border border-line bg-surface-1 sm:rounded-xl">
          <div className="skeleton h-[196px] rounded-none sm:h-[300px]" />
          <div className="h-[52px] bg-surface-2 sm:h-16" />
          <div className="flex flex-col gap-2.5 p-3.5 sm:gap-3.5 sm:p-5">
            <div className="skeleton h-16 rounded-[14px] sm:h-[76px]" />
            <div className="grid grid-cols-[1fr_1fr_1.5fr] gap-2 sm:grid-cols-[1fr_1fr_1.4fr] sm:gap-2.5">
              <div className="skeleton h-[52px] rounded-md sm:h-12" />
              <div className="skeleton h-[52px] rounded-md sm:h-12" />
              <div className="skeleton h-[52px] rounded-md sm:h-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Loading state for the browsing screens: a heading and a couple of cards. */
export function PageSkeleton({ cards = 2, label = "Carregando" }: { cards?: number; label?: string }) {
  return (
    <div aria-busy="true" className="flex flex-col gap-3.5 sm:gap-6">
      <span className="sr-only" role="status">
        {label}
      </span>
      <div aria-hidden className="flex flex-col gap-2">
        <div className="skeleton h-8 w-48 rounded-md sm:h-10" />
        <div className="skeleton h-4 w-64 rounded-md" />
      </div>
      <div aria-hidden className="grid gap-3.5 sm:grid-cols-2 sm:gap-4">
        {Array.from({ length: cards }, (_, i) => (
          <div key={i} className={cx("flex flex-col gap-4 rounded-[18px] border border-line bg-surface-1 p-5 sm:p-7")}>
            <div className="skeleton h-3 w-32 rounded-full" />
            <div className="skeleton h-14 w-40 rounded-md" />
            <div className="skeleton h-12 w-44 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
