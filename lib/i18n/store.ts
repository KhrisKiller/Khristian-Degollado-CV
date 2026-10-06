import type { Lang } from "./types";

/**
 * Language store shared by the whole app.
 * - Server render always uses English (deterministic HTML).
 * - On the client: saved preference → browser language (es-* → Spanish) → English.
 */
export const LANG_STORAGE_KEY = "kd-lang";

let current: Lang | null = null;
const listeners = new Set<() => void>();

export function detectBrowserLang(languages: readonly string[]): Lang {
  const first = (languages[0] ?? "en").toLowerCase();
  return first === "es" || first.startsWith("es-") ? "es" : "en";
}

function readInitial(): Lang {
  try {
    const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === "en" || saved === "es") return saved;
  } catch {
    // storage unavailable (private mode, blocked cookies) — fall through
  }
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
  return detectBrowserLang(langs);
}

export function getLangSnapshot(): Lang {
  if (current === null) current = readInitial();
  return current;
}

export function getServerLangSnapshot(): Lang {
  return "en";
}

export function subscribeLang(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setLang(lang: Lang) {
  current = lang;
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // ignore — preference simply won't persist
  }
  listeners.forEach((l) => l());
}
