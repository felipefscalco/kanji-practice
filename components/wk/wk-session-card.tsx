import type { ReactNode } from "react";

export function WkSessionCard({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-lg shadow-lg">{children}</div>
  );
}
