"use client";

import { X } from "lucide-react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Dialog } from "@/components/ui/Dialog";
import type { CustomerRow } from "@/data/customers";
import type { PeriodId } from "@/data/sales";
import { cn } from "@/lib/cn";
import { formatCompactCurrency, formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { SERIES } from "../chart-ui";
import { periodLabel } from "./model";

const HEALTH_STYLE = {
  healthy: "border-good/25 bg-good/10 [--dot:var(--color-good)]",
  watch: "border-warning/25 bg-warning/10 [--dot:var(--color-warning)]",
  risk: "border-critical/30 bg-critical/10 [--dot:var(--color-critical)]",
} as const;

type Props = { customer: CustomerRow | null; period: PeriodId; onClose: () => void };

export function CustomerDetail({ customer, period, onClose }: Props) {
  return (
    <Dialog open={customer !== null} onClose={onClose} labelledBy="customer-detail-title" variant="drawer" contained>
      {customer ? <Body customer={customer} period={period} onClose={onClose} /> : null}
    </Dialog>
  );
}

function Body({ customer, period, onClose }: Props & { customer: CustomerRow }) {
  const { t, l, lang } = useI18n();
  const c = t.dashboard.customer;
  const max = Math.max(...customer.byQuarter);
  const activeQ = period === "FY" ? null : Number(period[1]) - 1;

  const stats = [
    { label: c.revenue, value: formatCurrency(customer.revenue, lang) },
    { label: c.share, value: formatPercent(customer.share * 100, lang) },
    { label: c.orders, value: formatNumber(customer.orders, lang) },
    { label: c.otif, value: formatPercent(customer.otif, lang) },
    { label: c.dso, value: `${customer.dso} ${c.days}` },
    { label: c.balance, value: formatCurrency(customer.balance, lang) },
  ];

  return (
    <div className="flex min-h-full flex-col border-l border-line-strong bg-ink-850">
      <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-line bg-ink-850/95 px-5 py-4 backdrop-blur">
        <div className="min-w-0">
          <p className="font-mono text-[11px] text-fg-subtle">{periodLabel(period, t)}</p>
          <h4 id="customer-detail-title" className="mt-1 truncate text-lg font-semibold">
            {l(customer.name)}
          </h4>
          <span className={cn("mt-2 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px]", HEALTH_STYLE[customer.health])}>
            <span className="size-1.5 rounded-full bg-[var(--dot)]" aria-hidden />
            {c[customer.health]}
          </span>
        </div>
        <button type="button" onClick={onClose} aria-label={t.a11y.close} className="grid size-8 shrink-0 place-items-center rounded-lg text-fg-muted hover:bg-white/5 hover:text-fg">
          <X className="size-4" aria-hidden />
        </button>
      </div>

      <div className="space-y-5 px-5 py-5">
        <dl className="grid grid-cols-2 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg border border-line bg-ink-900 p-3">
              <dt className="text-[11px] text-fg-subtle">{s.label}</dt>
              <dd className="mt-1 text-[15px] tabular">{s.value}</dd>
            </div>
          ))}
        </dl>

        <section>
          <h5 className="text-[12px] font-medium text-fg-muted">{c.byQuarter}</h5>
          <ul className="mt-3 flex h-40 items-end gap-3 rounded-lg border border-line bg-ink-900 px-4 pb-3 pt-6">
            {customer.byQuarter.map((v, q) => {
              const dim = activeQ !== null && activeQ !== q;
              return (
                <li key={q} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                  <span className={cn("text-[11px] tabular", dim ? "text-fg-subtle" : "text-fg")}>{formatCompactCurrency(v, lang, 0)}</span>
                  <span
                    className="w-full max-w-6 rounded-t-[4px] transition-[height,opacity] duration-700"
                    style={{ height: `${(v / max) * 75}%`, background: SERIES.s1, opacity: dim ? 0.3 : 1 }}
                    aria-hidden
                  />
                  <span className="font-mono text-[11px] text-fg-subtle">
                    {t.dashboard.quarterPrefix}
                    {q + 1}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
