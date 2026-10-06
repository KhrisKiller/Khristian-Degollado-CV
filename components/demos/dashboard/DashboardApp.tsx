"use client";

import { m } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, BarChart3, FileText, Minus } from "lucide-react";
import { useMemo, useState } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Counter } from "@/components/ui/Counter";
import { customerRows } from "@/data/customers";
import { aging, OTIF_TARGET, PERIODS, previousSummary, series, summarize, type PeriodId } from "@/data/sales";
import { cn } from "@/lib/cn";
import { formatNumber, formatPercent } from "@/lib/format";
import { CustomerDetail } from "./CustomerDetail";
import { AgingChart, CustomersPanel, InventoryChart, OrdersChart, OtifChart, RevenueChart } from "./DashboardCharts";
import { KpiDetail } from "./KpiDetail";
import { delta, formatKpi, KPI_KEYS, periodLabel, type KpiKey } from "./model";

export default function DashboardApp() {
  const { t, lang } = useI18n();
  const d = t.dashboard;
  const [period, setPeriod] = useState<PeriodId>("FY");
  const [kpi, setKpi] = useState<KpiKey | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);

  const data = useMemo(() => {
    const current = summarize(period);
    const previous = previousSummary(period);
    return { current, previous, points: series(period), aging: aging(period), customers: customerRows(period) };
  }, [period]);

  const customer = data.customers.find((c) => c.id === customerId) ?? null;
  const comparison = period === "FY" ? d.vsPrevYear : d.vsPrevQuarter;

  // Written summary: what an operations manager would say about this period.
  const rev = delta("revenue", data.current.revenue, data.previous.revenue);
  const inv = delta("inventory", data.current.inventory, data.previous.inventory);
  const rec = delta("receivables", data.current.receivables, data.previous.receivables);
  const gap = data.current.otif - OTIF_TARGET;
  const pct = (n: number) => formatPercent(Math.abs(n), lang, 1);
  const summary = d.summary({
    period: periodLabel(period, t),
    revenue: formatKpi("revenue", data.current.revenue, lang),
    revenueChange: d.change(pct(rev.change), rev.change >= 0),
    comparison,
    otif: formatPercent(data.current.otif, lang, 1),
    otifVsTarget: d.vsTarget(formatNumber(Math.abs(gap), lang, 1), gap >= 0),
    inventoryMove: d.move(pct(inv.change), inv.change >= 0),
    receivablesMove: d.move(pct(rec.change), rec.change >= 0),
  });
  const view = period === "FY" ? d.charts.monthly : d.charts.weekly;

  return (
    <div className="@container relative h-full overflow-hidden bg-ink-900 text-fg">
      <div className="h-full overflow-y-auto scrollbar-thin">
        {/* ---------- Header ---------- */}
        <header className="sticky top-0 z-20 flex flex-col gap-3 border-b border-line bg-ink-900/90 px-4 py-3 backdrop-blur @3xl:flex-row @3xl:items-center @3xl:justify-between @3xl:px-5">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-lg bg-series-2/20 text-series-2">
              <BarChart3 className="size-4" aria-hidden />
            </span>
            <div className="leading-tight">
              <p className="text-[11px] text-fg-subtle">{d.company}</p>
              <h3 className="text-sm font-semibold">{d.title}</h3>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] text-fg-subtle" aria-live="polite">
              <span className="sr-only">{d.period}: </span>
              {d.periodRange[period]} · {view.toLowerCase()}
            </p>
            <div role="group" aria-label={d.period} className="flex rounded-lg border border-line bg-ink-850 p-0.5">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={period === p}
                  onClick={() => setPeriod(p)}
                  className={cn(
                    "relative rounded-md px-3 py-1.5 font-mono text-[12px] transition-colors",
                    period === p ? "text-fg" : "text-fg-muted hover:text-fg",
                  )}
                >
                  {period === p ? <m.span layoutId="dash-period" className="absolute inset-0 rounded-md bg-overlay/[0.09]" transition={{ type: "spring", stiffness: 420, damping: 34 }} /> : null}
                  <span className="relative">{p === "FY" ? "2026" : `${d.quarterPrefix}${p[1]}`}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="space-y-3 p-4 @3xl:p-5">
          <section aria-labelledby="dash-summary" className="flex gap-3 rounded-xl border border-line bg-ink-850/60 px-4 py-3">
            <FileText className="mt-0.5 size-4 shrink-0 text-series-2" aria-hidden />
            <div>
              <h4 id="dash-summary" className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
                {d.summaryTitle}
              </h4>
              <p key={`${period}-${lang}`} className="mt-1 animate-[rise_0.5s_cubic-bezier(0.16,1,0.3,1)] text-[13px] leading-relaxed text-fg">
                {summary}
              </p>
            </div>
          </section>
          {/* ---------- KPIs ---------- */}
          <ul className="grid grid-cols-2 gap-3 @3xl:grid-cols-3 @5xl:grid-cols-5">
            {KPI_KEYS.map((key, i) => {
              const cur = data.current[key];
              const dl = delta(key, cur, data.previous[key]);
              const spark = data.points.map((p) => p[key]);
              return (
                <li key={key} className={cn(i === 0 && "col-span-2 @3xl:col-span-1")}>
                  <button
                    type="button"
                    onClick={() => setKpi(key)}
                    aria-haspopup="dialog"
                    className="group flex h-full w-full flex-col rounded-xl border border-line bg-ink-850 p-4 text-left transition-colors hover:border-line-strong"
                  >
                    <span className="flex items-center justify-between text-[12px] text-fg-muted">
                      {d.kpis[key]}
                      <span className="text-[10px] text-fg-subtle opacity-0 transition-opacity group-hover:opacity-100">↗</span>
                    </span>
                    <Counter value={cur} format={(v) => formatKpi(key, v, lang)} className="mt-2 block text-[1.6rem] font-semibold leading-tight tracking-tight tabular" />
                    <span className="mt-2 flex items-end justify-between gap-2">
                      <span className="text-[11px] leading-snug">
                        <span
                          className={cn(
                            "inline-flex items-center gap-0.5 font-medium tabular",
                            dl.good === null ? "text-fg-muted" : dl.good ? "text-good" : "text-critical",
                          )}
                        >
                          {dl.change > 0 ? <ArrowUpRight className="size-3" aria-hidden /> : dl.change < 0 ? <ArrowDownRight className="size-3" aria-hidden /> : <Minus className="size-3" aria-hidden />}
                          {dl.change > 0 ? "+" : dl.change < 0 ? "−" : ""}
                          {formatNumber(Math.abs(dl.change), lang, 1)}
                          {dl.unit}
                        </span>{" "}
                        <span className="text-fg-subtle">{comparison}</span>
                        {key === "otif" ? (
                          <span className="mt-1.5 flex items-center gap-1.5 whitespace-nowrap text-fg-muted">
                            <span className={cn("size-1.5 rounded-full", cur >= OTIF_TARGET ? "bg-good" : "bg-warning")} aria-hidden />
                            {cur >= OTIF_TARGET ? d.target.on : d.target.below}
                          </span>
                        ) : null}
                      </span>
                      <Sparkline values={spark} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* ---------- Charts ---------- */}
          <div className="grid gap-3 @4xl:grid-cols-3">
            <RevenueChart points={data.points} className="@4xl:col-span-2" />
            <OrdersChart points={data.points} />
            <OtifChart points={data.points} className="@4xl:col-span-2" />
            <CustomersPanel rows={data.customers} selected={customerId} onSelect={setCustomerId} />
            <InventoryChart points={data.points} className="@4xl:col-span-2" />
            <AgingChart buckets={data.aging} />
          </div>
          <p className="pt-1 text-[11px] text-fg-subtle">{t.common.fictional}</p>
        </div>
      </div>

      <KpiDetail kpi={kpi} period={period} current={data.current} previous={data.previous} points={data.points} onClose={() => setKpi(null)} />
      <CustomerDetail customer={customer} avgDso={Math.round(data.customers.reduce((a, c) => a + c.dso, 0) / data.customers.length)} period={period} onClose={() => setCustomerId(null)} />
    </div>
  );
}

/** 12-ish point trend, drawn in the de-emphasis tone. */
function Sparkline({ values }: { values: number[] }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 64},${22 - ((v - min) / span) * 20}`).join(" ");
  const last = pts.split(" ").pop()!.split(",");
  return (
    <svg viewBox="0 0 64 24" className="h-6 w-16 shrink-0 overflow-visible" aria-hidden>
      <polyline points={pts} fill="none" stroke="var(--color-fg-subtle)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r="2.5" fill="#ec6534" stroke="var(--color-ink-850)" strokeWidth="1.5" />
    </svg>
  );
}
