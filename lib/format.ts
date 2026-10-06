import { LOCALE, type Lang } from "./i18n/types";

export function formatNumber(value: number, lang: Lang, digits = 0) {
  return value.toLocaleString(LOCALE[lang], {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatCurrency(value: number, lang: Lang, digits = 0) {
  return "$" + formatNumber(value, lang, digits);
}

/** $2.48M · $184K · $950 — same notation in both languages for consistency. */
export function formatCompactCurrency(value: number, lang: Lang, digits?: number) {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}$${formatNumber(abs / 1_000_000, lang, digits ?? 2)}M`;
  if (abs >= 1_000) return `${sign}$${formatNumber(abs / 1_000, lang, digits ?? 0)}K`;
  return `${sign}$${formatNumber(abs, lang, digits ?? 0)}`;
}

export function formatPercent(value: number, lang: Lang, digits = 1) {
  return `${formatNumber(value, lang, digits)}%`;
}

export function formatSigned(value: number, lang: Lang, digits = 0) {
  const s = formatNumber(Math.abs(value), lang, digits);
  if (value > 0) return `+${s}`;
  if (value < 0) return `−${s}`;
  return s;
}

export function formatShortDate(date: Date, lang: Lang) {
  return new Intl.DateTimeFormat(LOCALE[lang], { day: "2-digit", month: "short" }).format(date);
}

export function formatDateTime(date: Date, lang: Lang) {
  return new Intl.DateTimeFormat(LOCALE[lang], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
