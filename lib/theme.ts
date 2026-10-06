export type Theme = "dark" | "light";

/**
 * Theme store. The boot script in <head> applies the saved theme before
 * first paint; this module keeps React in sync with <html data-theme>.
 * Default is dark, the site's primary identity.
 */
export const THEME_STORAGE_KEY = "kd-theme";
const THEME_COLOR: Record<Theme, string> = { dark: "#07080a", light: "#f6f5f2" };

const listeners = new Set<() => void>();

export function getThemeSnapshot(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function getServerThemeSnapshot(): Theme {
  return "dark";
}

export function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // preference simply won't persist
  }
  listeners.forEach((l) => l());
}
