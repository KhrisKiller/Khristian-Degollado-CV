"use client";

import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useI18n } from "@/components/providers/LanguageProvider";
import type { CustomerRow } from "@/data/customers";
import { OTIF_TARGET, type SeriesPoint } from "@/data/sales";
import { cn } from "@/lib/cn";
import { formatCompactCurrency, formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { AXIS_TICK, ChartTooltipBox, GRID_STROKE, SERIES } from "../chart-ui";
import type { Lang } from "@/lib/i18n";
import { formatAxis, pointLabel, type KpiKey } from "./model";

function ChartCard({ title, meta, children, className }: { title: string; meta?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("flex flex-col rounded-xl border border-line bg-ink-850", className)}>
      <header className="flex items-center justify-between gap-3 px-4 pt-3.5">
        <h4 className="text-[13px] font-medium">{title}</h4>
        {meta ? <span className="text-[11px] text-fg-subtle">{meta}</span> : null}
      </header>
      <div className="flex-1 px-2 pb-2 pt-3">{children}</div>
    </section>
  );
}

function useChartData(points: SeriesPoint[]) {
  const { t } = useI18n();
  return points.map((p) => ({ ...p, label: pointLabel(p, t) }));
}

type TipProps = { active?: boolean; payload?: ReadonlyArray<{ payload?: unknown }> };

function seriesTooltip(key: KpiKey, color: string, label: string, lang: Lang) {
  return function SeriesTooltip({ active, payload }: TipProps) {
    const p = payload?.[0]?.payload as (SeriesPoint & { label: string }) | undefined;
    if (!active || !p) return null;
    const value =
      key === "otif" ? formatPercent(p.otif, lang) : key === "orders" ? formatNumber(p.orders, lang) : formatCurrency(p[key], lang);
    return <ChartTooltipBox title={p.label} rows={[{ label, value, color }]} />;
  };
}

export function RevenueChart({ points, className }: { points: SeriesPoint[]; className?: string }) {
  const { t, lang } = useI18n();
  const data = useChartData(points);
  const tip = seriesTooltip("revenue", SERIES.s1, t.dashboard.kpis.revenue, lang);
  return (
    <ChartCard title={t.dashboard.charts.revenue} meta={points[0]?.kind === "month" ? t.dashboard.charts.monthly : t.dashboard.charts.weekly} className={className}>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="dash-rev" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor={SERIES.s1} stopOpacity={0.25} />
                <stop offset="1" stopColor={SERIES.s1} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={GRID_STROKE} />
            <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} interval="preserveStartEnd" minTickGap={8} />
            <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={52} tickFormatter={(v: number) => formatAxis("revenue", v, lang)} />
            <Tooltip cursor={{ stroke: "var(--chart-cursor-line)" }} content={tip} />
            <Area type="monotone" dataKey="revenue" stroke={SERIES.s1} strokeWidth={2} fill="url(#dash-rev)" activeDot={{ r: 4, stroke: "var(--color-ink-850)", strokeWidth: 2 }} animationDuration={700} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function OrdersChart({ points, className }: { points: SeriesPoint[]; className?: string }) {
  const { t, lang } = useI18n();
  const data = useChartData(points);
  const tip = seriesTooltip("orders", SERIES.s2, t.dashboard.kpis.orders, lang);
  return (
    <ChartCard title={t.dashboard.charts.orders} meta={points[0]?.kind === "month" ? t.dashboard.charts.monthly : t.dashboard.charts.weekly} className={className}>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: -8 }} barCategoryGap="22%">
            <CartesianGrid vertical={false} stroke={GRID_STROKE} />
            <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} interval="preserveStartEnd" minTickGap={6} />
            <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={40} tickFormatter={(v: number) => formatNumber(v, lang)} />
            <Tooltip cursor={{ fill: "var(--chart-cursor)" }} content={tip} />
            <Bar dataKey="orders" fill={SERIES.s2} radius={[4, 4, 0, 0]} maxBarSize={22} animationDuration={700} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function OtifChart({ points, className }: { points: SeriesPoint[]; className?: string }) {
  const { t, lang } = useI18n();
  const data = useChartData(points);
  const tip = seriesTooltip("otif", SERIES.s3, "OTIF", lang);
  return (
    <ChartCard
      title={t.dashboard.charts.otif}
      meta={
        <span className="inline-flex items-center gap-1.5">
          <span className="h-px w-4 border-t border-dashed border-fg-muted" aria-hidden />
          {t.dashboard.charts.target}
        </span>
      }
      className={className}
    >
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 6, right: 12, bottom: 0, left: -8 }}>
            <CartesianGrid vertical={false} stroke={GRID_STROKE} />
            <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} interval="preserveStartEnd" minTickGap={8} />
            <YAxis domain={[88, 100]} ticks={[88, 91, 94, 97, 100]} tick={AXIS_TICK} axisLine={false} tickLine={false} width={48} tickFormatter={(v: number) => `${v}%`} />
            <ReferenceLine y={OTIF_TARGET} stroke="var(--color-fg-muted)" strokeDasharray="4 4" strokeOpacity={0.6} />
            <Tooltip cursor={{ stroke: "var(--chart-cursor-line)" }} content={tip} />
            <Line type="monotone" dataKey="otif" stroke={SERIES.s3} strokeWidth={2} dot={{ r: 3, fill: SERIES.s3, stroke: "var(--color-ink-850)", strokeWidth: 2 }} activeDot={{ r: 5, stroke: "var(--color-ink-850)", strokeWidth: 2 }} animationDuration={700} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function InventoryChart({ points, className }: { points: SeriesPoint[]; className?: string }) {
  const { t, lang } = useI18n();
  const data = useChartData(points);
  const tip = seriesTooltip("inventory", SERIES.s2, t.dashboard.kpis.inventory, lang);
  const values = points.map((p) => p.inventory);
  const lo = Math.floor((Math.min(...values) * 0.97) / 10_000) * 10_000;
  const hi = Math.ceil((Math.max(...values) * 1.02) / 10_000) * 10_000;
  return (
    <ChartCard title={t.dashboard.charts.inventory} className={className}>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 6, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke={GRID_STROKE} />
            <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} interval="preserveStartEnd" minTickGap={8} />
            <YAxis domain={[lo, hi]} tick={AXIS_TICK} axisLine={false} tickLine={false} width={52} tickFormatter={(v: number) => formatCompactCurrency(v, lang)} />
            <Tooltip cursor={{ stroke: "var(--chart-cursor-line)" }} content={tip} />
            <Line type="monotone" dataKey="inventory" stroke={SERIES.s2} strokeWidth={2} dot={false} activeDot={{ r: 4, stroke: "var(--color-ink-850)", strokeWidth: 2 }} animationDuration={700} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function AgingChart({ buckets, className }: { buckets: { current: number; d60: number; d90: number; over: number }; className?: string }) {
  const { t, lang } = useI18n();
  const a = t.dashboard.aging;
  const data = [
    { key: "current", label: a.current, value: buckets.current },
    { key: "d60", label: a.d60, value: buckets.d60 },
    { key: "d90", label: a.d90, value: buckets.d90 },
    { key: "over", label: a.over, value: buckets.over },
  ];
  const total = data.reduce((s, x) => s + x.value, 0);
  return (
    <ChartCard title={t.dashboard.charts.receivables} meta={formatCompactCurrency(total, lang)} className={className}>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 18, right: 6, bottom: 0, left: -14 }} barCategoryGap="26%">
            <CartesianGrid vertical={false} stroke={GRID_STROKE} />
            <XAxis dataKey="label" tick={{ ...AXIS_TICK, fontSize: 10 }} axisLine={false} tickLine={false} interval={0} />
            <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={46} tickFormatter={(v: number) => formatCompactCurrency(v, lang)} />
            <Tooltip
              cursor={{ fill: "var(--chart-cursor)" }}
              content={({ active, payload }) =>
                active && payload?.length ? (
                  <ChartTooltipBox
                    title={payload[0].payload.label}
                    rows={[
                      { label: t.dashboard.kpis.receivables, value: formatCurrency(payload[0].payload.value, lang), color: SERIES.s1 },
                      { label: "%", value: formatPercent((payload[0].payload.value / total) * 100, lang, 0) },
                    ]}
                  />
                ) : null
              }
            />
            <Bar
              dataKey="value"
              fill={SERIES.s1}
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
              animationDuration={700}
              label={{ position: "top", fill: "var(--color-fg-muted)", fontSize: 10, formatter: (v: unknown) => formatCompactCurrency(Number(v), lang) }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

/** HTML bar list — every row is a real button, so it's keyboard- and touch-friendly. */
export function CustomersPanel({ rows, selected, onSelect, className }: { rows: CustomerRow[]; selected: string | null; onSelect: (id: string) => void; className?: string }) {
  const { t, l, lang } = useI18n();
  const max = Math.max(...rows.map((r) => r.revenue));
  return (
    <ChartCard title={t.dashboard.charts.customers} meta={t.dashboard.charts.clickCustomer} className={className}>
      <ul className="space-y-0.5 px-1">
        {rows.map((r) => (
          <li key={r.id}>
            <button
              type="button"
              onClick={() => onSelect(r.id)}
              aria-haspopup="dialog"
              className={cn(
                "group grid w-full grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-overlay/[0.04]",
                selected === r.id && "bg-overlay/[0.05]",
              )}
            >
              <span className="truncate text-[12px] text-fg-muted group-hover:text-fg">{l(r.name)}</span>
              <span className="flex items-center gap-1 text-[12px] tabular text-fg">
                {formatCompactCurrency(r.revenue, lang, 0)}
                <ChevronRight className="size-3 text-fg-subtle transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
              <span className="col-span-2 block h-1.5 overflow-hidden rounded-full bg-overlay/[0.05]" aria-hidden>
                <span className="block h-full rounded-full transition-[width] duration-700 ease-out" style={{ width: `${(r.revenue / max) * 100}%`, background: r.id === "other" ? "var(--color-ink-600)" : SERIES.s1 }} />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}
