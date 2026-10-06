"use client";

import { Lightbulb, X } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Dialog } from "@/components/ui/Dialog";
import { OTIF_TARGET, type PeriodId, type SeriesPoint, type Summary } from "@/data/sales";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { AXIS_TICK, ChartTooltipBox, GRID_STROKE, SERIES } from "../chart-ui";
import { delta, formatAxis, formatKpi, HIGHER_IS_BETTER, periodLabel, pointLabel, type KpiKey } from "./model";

type Props = {
  kpi: KpiKey | null;
  period: PeriodId;
  current: Summary;
  previous: Summary;
  points: SeriesPoint[];
  onClose: () => void;
};

export function KpiDetail(props: Props) {
  return (
    <Dialog open={props.kpi !== null} onClose={props.onClose} labelledBy="kpi-detail-title" variant="drawer" contained>
      {props.kpi ? <Body {...props} kpi={props.kpi} /> : null}
    </Dialog>
  );
}

function Body({ kpi, period, current, previous, points, onClose }: Props & { kpi: KpiKey }) {
  const { t, lang } = useI18n();
  const d = t.dashboard;
  const data = points.map((p) => ({ label: pointLabel(p, t), value: p[kpi] }));
  const values = data.map((x) => x.value);
  const bestIdx = values.indexOf(HIGHER_IS_BETTER[kpi] ? Math.max(...values) : Math.min(...values));
  const worstIdx = values.indexOf(HIGHER_IS_BETTER[kpi] ? Math.min(...values) : Math.max(...values));
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const dl = delta(kpi, current[kpi], previous[kpi]);
  const isStock = kpi === "receivables" || kpi === "inventory";
  const fmt = (v: number) => (kpi === "otif" ? `${formatNumber(v, lang, 1)}%` : kpi === "orders" ? formatNumber(v, lang) : formatAxis(kpi, v, lang));

  const isFlow = !isStock && kpi !== "otif";
  const lo = kpi === "otif" ? 88 : isStock ? Math.floor((Math.min(...values) * 0.9) / 10_000) * 10_000 : 0;

  // Recharts needs these as direct children, so build them as elements (not components).
  const axes = [
    <CartesianGrid key="g" vertical={false} stroke={GRID_STROKE} />,
    <XAxis key="x" dataKey="label" tick={{ ...AXIS_TICK, fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" minTickGap={4} />,
    <YAxis key="y" domain={[lo, "auto"]} tick={AXIS_TICK} axisLine={false} tickLine={false} width={50} tickFormatter={fmt} />,
  ];
  const tooltip = (
    <Tooltip
      cursor={isFlow ? { fill: "var(--chart-cursor)" } : { stroke: "var(--chart-cursor-line)" }}
      content={({ active, payload }) =>
        active && payload?.length ? (
          <ChartTooltipBox title={payload[0].payload.label} rows={[{ label: d.kpis[kpi], value: fmt(payload[0].payload.value), color: SERIES.s1 }]} />
        ) : null
      }
    />
  );

  return (
    <div className="flex min-h-full flex-col border-l border-line-strong bg-ink-850">
      <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-line bg-ink-850/95 px-5 py-4 backdrop-blur">
        <div>
          <p className="font-mono text-[11px] text-fg-subtle">{periodLabel(period, t)}</p>
          <h4 id="kpi-detail-title" className="mt-1 text-lg font-semibold">
            {d.kpis[kpi]}
          </h4>
        </div>
        <button type="button" onClick={onClose} aria-label={t.a11y.close} className="grid size-8 place-items-center rounded-lg text-fg-muted hover:bg-overlay/5 hover:text-fg">
          <X className="size-4" aria-hidden />
        </button>
      </div>

      <div className="space-y-5 px-5 py-5">
        <div>
          <p className="text-4xl font-semibold tracking-tight tabular">{formatKpi(kpi, current[kpi], lang)}</p>
          <p className={cn("mt-1 text-[13px] tabular", dl.good === null ? "text-fg-muted" : dl.good ? "text-good" : "text-critical")}>
            {dl.change > 0 ? "▲ +" : dl.change < 0 ? "▼ −" : ""}
            {formatNumber(Math.abs(dl.change), lang, 1)}
            {dl.unit} <span className="text-fg-subtle">{period === "FY" ? d.vsPrevYear : d.vsPrevQuarter}</span>
          </p>
        </div>

        <dl className="space-y-3 rounded-lg border border-line bg-ink-900 p-3.5">
          <div>
            <dt className="text-[11px] text-fg-subtle">{d.detail.definition}</dt>
            <dd className="mt-0.5 text-[13px] leading-relaxed text-fg">{d.kpiHelp[kpi]}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-fg-subtle">{d.detail.formula}</dt>
            <dd className="mt-1 rounded-md bg-overlay/[0.04] px-2.5 py-1.5 font-mono text-[12px] text-fg">{d.kpiFormula[kpi]}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-fg-subtle">{d.detail.why}</dt>
            <dd className="mt-0.5 text-[13px] leading-relaxed text-fg-muted">{d.kpiWhy[kpi]}</dd>
          </div>
        </dl>

        <section>
          <h5 className="text-[12px] font-medium text-fg-muted">{d.detail.breakdown}</h5>
          <div className="mt-2 h-44 rounded-lg border border-line bg-ink-900 p-2">
            <ResponsiveContainer width="100%" height="100%">
              {/* Flows (revenue, orders) are bars from zero; levels (OTIF, balances) are lines. */}
              {isFlow ? (
                <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -6 }} barCategoryGap="18%">
                  {axes}
                  {tooltip}
                  <Bar dataKey="value" fill={SERIES.s1} radius={[4, 4, 0, 0]} maxBarSize={20} animationDuration={600} />
                </BarChart>
              ) : (
                <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -6 }}>
                  {axes}
                  {kpi === "otif" ? <ReferenceLine y={OTIF_TARGET} stroke="var(--color-fg-muted)" strokeDasharray="4 4" strokeOpacity={0.6} /> : null}
                  {tooltip}
                  <Line type="monotone" dataKey="value" stroke={SERIES.s1} strokeWidth={2} dot={{ r: 3, fill: SERIES.s1, stroke: "var(--color-ink-850)", strokeWidth: 2 }} activeDot={{ r: 5 }} animationDuration={600} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </section>

        <dl className="grid grid-cols-3 gap-2">
          {[
            { label: d.detail.best, value: `${data[bestIdx].label} · ${fmt(values[bestIdx])}` },
            { label: d.detail.worst, value: `${data[worstIdx].label} · ${fmt(values[worstIdx])}` },
            { label: d.detail.average, value: fmt(avg) },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-line bg-ink-900 p-2.5">
              <dt className="text-[11px] text-fg-subtle">{s.label}</dt>
              <dd className="mt-1 text-[12px] tabular text-fg">{s.value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex gap-3 rounded-lg border border-accent/25 bg-accent/[0.06] p-3">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-accent-soft" aria-hidden />
          <p className="text-[13px] leading-relaxed text-fg">
            <span className="mr-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-accent-soft">
              {d.detail.insightTitle} · 2026
            </span>
            {d.insights[kpi]}
          </p>
        </div>

        <details className="group rounded-lg border border-line bg-ink-900">
          <summary className="cursor-pointer list-none px-3 py-2.5 text-[12px] text-fg-muted marker:hidden hover:text-fg">
            <span className="mr-1.5 inline-block transition-transform group-open:rotate-90">›</span>
            {d.detail.table}
          </summary>
          <table className="w-full text-[12px]">
            <caption className="sr-only">
              {d.kpis[kpi]} — {periodLabel(period, t)}
            </caption>
            <thead className="text-left text-fg-subtle">
              <tr className="border-y border-line">
                <th scope="col" className="px-3 py-2 font-medium">{d.detail.periodCol}</th>
                <th scope="col" className="px-3 py-2 text-right font-medium">{d.detail.valueCol}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.map((row) => (
                <tr key={row.label}>
                  <th scope="row" className="px-3 py-1.5 text-left font-normal text-fg-muted">{row.label}</th>
                  <td className="px-3 py-1.5 text-right tabular">{fmt(row.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </div>
    </div>
  );
}
