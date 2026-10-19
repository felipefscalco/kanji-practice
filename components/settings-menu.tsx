"use client";

import { useEffect, useId, useSyncExternalStore } from "react";

import { cx } from "@/components/ui/cx";
import { applyTheme, getThemeChoice, setThemeChoice, THEME_EVENT, type ThemeChoice } from "@/lib/theme";

const OPTIONS: Array<{ value: ThemeChoice; label: string }> = [
  { value: "system", label: "Automático (do sistema)" },
  { value: "light", label: "Claro" },
  { value: "dark", label: "Escuro" },
];

function subscribe(onChange: () => void) {
  window.addEventListener(THEME_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function useThemeChoice(): ThemeChoice {
  return useSyncExternalStore(subscribe, getThemeChoice, () => "system");
}

/** Header settings: a popover with the theme choice. */
export function SettingsMenu() {
  const choice = useThemeChoice();
  const popoverId = useId();

  // In "Automático", follow system changes while the app is open.
  useEffect(() => {
    if (choice !== "system") {
      return;
    }
    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => applyTheme("system");
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [choice]);

  return (
    <>
      <button
        type="button"
        popoverTarget={popoverId}
        aria-label="Configurações"
        title="Configurações"
        className="inline-flex size-11 items-center justify-center rounded-full text-text-2 transition-colors duration-[var(--dur-fast)] hover:text-text sm:size-10 sm:border sm:border-line-strong sm:bg-surface-2"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
        </svg>
      </button>
      <div
        id={popoverId}
        popover="auto"
        className="fixed inset-auto right-4 top-14 m-0 w-[min(280px,calc(100vw-32px))] rounded-lg border border-line-strong bg-surface-1 p-4 text-text shadow-toast sm:right-6 sm:top-16"
      >
        <fieldset className="m-0 flex flex-col gap-1 border-0 p-0">
          <legend className="eyebrow mb-2">Tema</legend>
          {OPTIONS.map((option) => (
            <label
              key={option.value}
              className={cx(
                "flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-2 text-[15px]",
                choice === option.value ? "bg-surface-3 font-semibold" : "hover:bg-surface-2",
              )}
            >
              <input
                type="radio"
                name="theme"
                value={option.value}
                checked={choice === option.value}
                onChange={() => setThemeChoice(option.value)}
                className="size-4 accent-[var(--color-text)]"
              />
              {option.label}
            </label>
          ))}
        </fieldset>
      </div>
    </>
  );
}
