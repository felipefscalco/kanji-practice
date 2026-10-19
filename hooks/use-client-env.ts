"use client";

import { useEffect, useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** False during prerender and hydration, true afterwards. For screens built from browser storage. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/** Live `matchMedia` result; `false` on the server. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * Keeps the focused field inside `ref` visible when the virtual keyboard opens.
 * `interactive-widget=resizes-content` covers Chromium; iOS Safari only
 * shrinks the visual viewport, so we follow `visualViewport` there.
 */
export function useKeepFocusedInView(ref: React.RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) {
      return;
    }
    function onResize() {
      const root = ref.current;
      const active = document.activeElement;
      if (!root || !(active instanceof HTMLElement) || !root.contains(active)) {
        return;
      }
      const rect = root.getBoundingClientRect();
      const visibleBottom = vv!.offsetTop + vv!.height;
      if (rect.bottom > visibleBottom) {
        window.scrollBy({ top: rect.bottom - visibleBottom + 8 });
      }
    }
    vv.addEventListener("resize", onResize);
    return () => vv.removeEventListener("resize", onResize);
  }, [ref]);
}
