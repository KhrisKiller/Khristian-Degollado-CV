import type { Dictionary, Lang } from "@/lib/i18n";
import { formatCompactCurrency, formatNumber, formatPercent } from "@/lib/format";
import type { PeriodId, SeriesPoint, Summary } from "@/data/sales";

export type KpiKey = keyof Summary;
export const KPI_KEYS: KpiKey[] = ["revenue", "orders", "otif", "receivables", "inventory"];

/** Whether a higher value is good news for the business. */
export const HIGHER_IS_BETTER: Record<KpiKey, boolean> = {
  revenue: true,
  orders: true,
  otif: true,
  receivables: false,
  inventory: false,
};

export function formatKpi(key: KpiKey, value: number, lang: Lang) {
  switch (key) {
    case "revenue":
      return formatCompactCurrency(value, lang, value >= 1_000_000 ? 2 : 0);
    case "orders":
      return formatNumber(Math.round(value), lang);
    case "otif":
      return formatPercent(value, lang, 1);
    default:
      return formatCompactCurrency(value, lang, 0);
  }
}

/** Axis/tooltip formatting — a bit more compact than the hero KPI. */
export function formatAxis(key: KpiKey, value: number, lang: Lang) {
  if (key === "orders") return formatNumber(value, lang);
  if (key === "otif") return `${formatNumber(value, lang, 0)}%`;
  return formatCompactCurrency(value, lang, value >= 1_000_000 ? 1 : 0);
}

export function delta(key: KpiKey, current: number, previous: number) {
  // OTIF is already a percentage: report percentage points, not % of %.
  const change = key === "otif" ? current - previous : ((current - previous) / previous) * 100;
  const good = change === 0 ? null : (change > 0) === HIGHER_IS_BETTER[key];
  return { change, good, unit: key === "otif" ? "pp" : "%" };
}

export function pointLabel(p: SeriesPoint, t: Dictionary) {
  return p.kind === "month" ? t.dashboard.months[p.index] : `${t.dashboard.weekShort}${p.index}`;
}

export function periodLabel(period: PeriodId, t: Dictionary) {
  return period === "FY" ? "2026" : `${t.dashboard.quarterPrefix}${period[1]} 2026`;
}
