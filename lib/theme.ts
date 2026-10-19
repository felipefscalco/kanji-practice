/** Saved theme choice; absent means "follow the system". */
export const THEME_STORAGE_KEY = "oyster-theme";
export const THEME_EVENT = "oyster-theme";

export type ThemeChoice = "system" | "light" | "dark";

export function getThemeChoice(): ThemeChoice {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

export function resolveTheme(choice: ThemeChoice, prefersLight: boolean): "light" | "dark" {
  return choice === "system" ? (prefersLight ? "light" : "dark") : choice;
}

export function applyTheme(choice: ThemeChoice): void {
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  document.documentElement.dataset.theme = resolveTheme(choice, prefersLight);
}

export function setThemeChoice(choice: ThemeChoice): void {
  try {
    if (choice === "system") {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, choice);
    }
  } catch {
    // Blocked storage: the choice still applies to this page.
  }
  applyTheme(choice);
  window.dispatchEvent(new Event(THEME_EVENT));
}

/**
 * Runs in <head> before first paint so the page never flashes the wrong theme.
 * Kept in sync with getThemeChoice/resolveTheme above.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var c=localStorage.getItem("${THEME_STORAGE_KEY}");var l=c==="light"||(c!=="dark"&&matchMedia("(prefers-color-scheme: light)").matches);document.documentElement.dataset.theme=l?"light":"dark"}catch(e){}})();`;
