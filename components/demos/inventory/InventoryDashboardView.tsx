"use client";

import { AlertTriangle, ArrowRight, Boxes, CircleDollarSign, PackageX, Repeat } from "lucide-react";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Counter } from "@/components/ui/Counter";
import { coverageDays, stockStatus, stockValue, suggestedReorder } from "@/data/inventory";
import { MOVEMENT_TYPES, type Movement, type MovementType } from "@/data/movements";
import { categories, type CategoryId, type Product } from "@/data/products";
import { cn } from "@/lib/cn";
import { formatCompactCurrency, formatCurrency, formatNumber } from "@/lib/format";
import { AXIS_TICK, ChartTooltipBox, GRID_STROKE, SERIES } from "../chart-ui";
import type { Filters } from "./InventoryApp";
import { MOVEMENT_ICON, Panel, StatusBadge } from "./ui";

/** Everyday floor events, in the order they usually happen. */
const QUICK: MovementType[] = ["inbound", "production", "outbound", "adjustment"];

type Props = {
  products: Product[];
  movements: Movement[];
  now: number;
  onOpenInventory: (patch?: Partial<Filters>) => void;
  onOpenMovements: () => void;
  onQuickAction: (type: MovementType) => void;
  onSelect: (sku: string) => void;
};

export function InventoryDashboardView({ products, movements, now, onOpenInventory, onOpenMovements, onQuickAction, onSelect }: Props) {
  const { t, l, lang } = useI18n();
  const inv = t.inventory;

  const stats = useMemo(() => {
    const value = products.reduce((s, p) => s + stockValue(p), 0);
    const low = products.filter((p) => stockStatus(p) === "low").length;
    const out = products.filter((p) => stockStatus(p) === "out").length;
    const weekAgo = now - 7 * 86_400_000;
    const recent = movements.filter((m) => m.date.getTime() >= weekAgo);
    return { value, low, out, recent };
  }, [products, movements, now]);

  const byCategory = useMemo(() => {
    const totals = new Map<CategoryId, number>();
    products.forEach((p) => totals.set(p.category, (totals.get(p.category) ?? 0) + stockValue(p)));
    return [...totals.entries()].map(([id, value]) => ({ id, name: l(categories[id]), value })).sort((a, b) => b.value - a.value);
  }, [products, l]);

  const byType = useMemo(
    () =>
      MOVEMENT_TYPES.map((type) => {
        const list = stats.recent.filter((m) => m.type === type);
        return { type, name: inv.movementTypes[type], count: list.length, units: list.reduce((s, m) => s + Math.abs(m.qty), 0) };
      }),
    [stats.recent, inv.movementTypes],
  );

  const alerts = products
    .filter((p) => stockStatus(p) !== "ok")
    .sort((a, b) => a.stock / a.min - b.stock / b.min);

  const kpis = [
    { key: "total", icon: Boxes, label: inv.kpis.totalProducts, value: products.length, fmt: (n: number) => formatNumber(n, lang), sub: inv.kpis.skus, onClick: () => onOpenInventory() },
    { key: "value", icon: CircleDollarSign, label: inv.kpis.inventoryValue, value: stats.value, fmt: (n: number) => formatCompactCurrency(n, lang, 1), sub: inv.kpis.atCost, onClick: () => onOpenInventory() },
    { key: "low", icon: AlertTriangle, label: inv.kpis.lowStock, value: stats.low, fmt: (n: number) => formatNumber(n, lang), sub: inv.kpis.belowMin, onClick: () => onOpenInventory({ status: "low" }), tone: "warning" },
    { key: "out", icon: PackageX, label: inv.kpis.outOfStock, value: stats.out, fmt: (n: number) => formatNumber(n, lang), sub: inv.kpis.needAction, onClick: () => onOpenInventory({ status: "out" }), tone: "critical" },
    { key: "moves", icon: Repeat, label: inv.kpis.recentMovements, value: stats.recent.length, fmt: (n: number) => formatNumber(n, lang), sub: inv.kpis.last7, onClick: onOpenMovements },
  ] as const;

  return (
    <div className="space-y-4">
      <section aria-labelledby="inv-quick-title">
        <h4 id="inv-quick-title" className="sr-only">
          {inv.quick.title}
        </h4>
        <ul className="grid grid-cols-2 gap-2 @3xl:grid-cols-4">
          {QUICK.map((type) => {
            const Icon = MOVEMENT_ICON[type];
            return (
              <li key={type}>
                <button
                  type="button"
                  onClick={() => onQuickAction(type)}
                  className="group flex w-full items-center gap-2.5 rounded-xl border border-line bg-ink-850 px-3 py-2.5 text-left transition-colors hover:border-accent/40 hover:bg-accent/[0.05]"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-line bg-overlay/[0.03] text-fg-muted transition-colors group-hover:text-accent-soft">
                    <Icon className="size-3.5" aria-hidden />
                  </span>
                  <span className="min-w-0 leading-tight">
                    <span className="block truncate text-[13px] text-fg">{inv.quick[type]}</span>
                    <span className="block truncate text-[11px] text-fg-subtle">{inv.movementTypes[type]}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <ul className="grid grid-cols-2 gap-3 @2xl:grid-cols-3 @5xl:grid-cols-5">
        {kpis.map((k) => {
          const Icon = k.icon;
          const tone = "tone" in k ? k.tone : undefined;
          return (
            <li key={k.key} className={cn(k.key === "total" && "col-span-2 @2xl:col-span-1")}>
              <button
                type="button"
                onClick={k.onClick}
                className="group flex h-full w-full flex-col rounded-xl border border-line bg-ink-850 p-4 text-left transition-colors hover:border-line-strong"
              >
                <span className="flex items-center justify-between text-[12px] text-fg-muted">
                  {k.label}
                  <Icon
                    className={cn("size-3.5", tone === "warning" ? "text-warning" : tone === "critical" ? "text-critical" : "text-fg-subtle")}
                    aria-hidden
                  />
                </span>
                <Counter value={k.value} format={k.fmt} className="mt-3 block text-2xl font-semibold tracking-tight tabular" />
                <span className="mt-1 flex items-center justify-between text-[11px] text-fg-subtle">
                  {k.sub}
                  <ArrowRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="grid gap-4 @4xl:grid-cols-[1.4fr_1fr]">
        <Panel title={inv.valueByCategory}>
          <div className="h-60 px-2 py-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCategory} layout="vertical" margin={{ top: 4, right: 56, bottom: 4, left: 4 }} barCategoryGap={10}>
                <CartesianGrid horizontal={false} stroke={GRID_STROKE} />
                <XAxis type="number" tick={AXIS_TICK} axisLine={false} tickLine={false} tickFormatter={(v: number) => formatCompactCurrency(v, lang)} />
                <YAxis type="category" dataKey="name" tick={{ ...AXIS_TICK, fill: "var(--color-fg-muted)" }} axisLine={false} tickLine={false} width={124} />
                <Tooltip
                  cursor={{ fill: "var(--chart-cursor)" }}
                  content={({ active, payload }) =>
                    active && payload?.length ? (
                      <ChartTooltipBox
                        title={payload[0].payload.name}
                        rows={[{ label: inv.columns.value, value: formatCurrency(payload[0].payload.value, lang), color: SERIES.s1 }]}
                      />
                    ) : null
                  }
                />
                <Bar
                  dataKey="value"
                  fill={SERIES.s1}
                  radius={[0, 4, 4, 0]}
                  maxBarSize={22}
                  label={{ position: "right", fill: "var(--color-fg-muted)", fontSize: 11, formatter: (v: unknown) => formatCompactCurrency(Number(v), lang) }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel
          title={
            <span className="flex items-center gap-2">
              {inv.alerts}
              <span className="rounded-full bg-warning/15 px-1.5 text-[10px] tabular text-warning">{alerts.length}</span>
            </span>
          }
        >
          {alerts.length === 0 ? (
            <p className="p-4 text-[13px] text-fg-muted">{inv.noAlerts}</p>
          ) : (
            <ul className="divide-y divide-line">
              {alerts.map((p) => {
                const days = coverageDays(p);
                return (
                  <li key={p.sku}>
                    <button type="button" onClick={() => onSelect(p.sku)} className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-overlay/[0.03]">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] text-fg">
                          {l(p.name)} {p.variant ? <span className="text-fg-subtle">· {l(p.variant)}</span> : null}
                        </p>
                        <p className="font-mono text-[11px] text-fg-subtle">
                          {p.sku} · {formatNumber(p.stock, lang)}/{formatNumber(p.min, lang)}
                          {Number.isFinite(days) && p.stock > 0 ? ` · ${formatNumber(days, lang, 1)} ${inv.detail.days}` : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={stockStatus(p)} />
                        <p className="mt-1 text-[11px] text-fg-subtle">
                          {inv.reorder}: <span className="tabular text-fg-muted">{formatNumber(suggestedReorder(p), lang)}</span>
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {alerts.length > 0 ? <p className="border-t border-line px-4 py-2.5 text-[11px] text-fg-subtle">{inv.reorderRule}</p> : null}
        </Panel>
      </div>

      <Panel title={inv.movementsByType}>
        <div className="h-48 px-2 py-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byType} margin={{ top: 18, right: 12, bottom: 0, left: -12 }}>
              <CartesianGrid vertical={false} stroke={GRID_STROKE} />
              <XAxis dataKey="name" tick={{ ...AXIS_TICK, fill: "var(--color-fg-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: "var(--chart-cursor)" }}
                content={({ active, payload }) =>
                  active && payload?.length ? (
                    <ChartTooltipBox
                      title={payload[0].payload.name}
                      rows={[
                        { label: inv.kpis.recentMovements, value: payload[0].payload.count, color: SERIES.s2 },
                        { label: inv.units, value: formatNumber(payload[0].payload.units, lang) },
                      ]}
                    />
                  ) : null
                }
              />
              <Bar dataKey="count" fill={SERIES.s2} radius={[4, 4, 0, 0]} maxBarSize={24} label={{ position: "top", fill: "var(--color-fg-muted)", fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}
