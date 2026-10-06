export type Lang = "en" | "es";

/** A value that exists in every supported language. */
export type Localized<T = string> = Record<Lang, T>;

export const LANGS: readonly Lang[] = ["en", "es"] as const;
export const LOCALE: Record<Lang, string> = { en: "en-US", es: "es-MX" };
