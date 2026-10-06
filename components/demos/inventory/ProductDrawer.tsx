"use client";

import { Plus, X } from "lucide-react";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Dialog } from "@/components/ui/Dialog";
import { coverageDays, HISTORY_DAYS, stockStatus, stockValue } from "@/data/inventory";
import type { Movement } from "@/data/movements";
import { categories, warehouses, type Product } from "@/data/products";
import { cn } from "@/lib/cn";
import { formatCurrency, formatDateTime, formatNumber, formatShortDate, formatSigned } from "@/lib/format";
import { AXIS_TICK, ChartTooltipBox, GRID_STROKE, SERIES } from "../chart-ui";
import { MovementBadge, StatusBadge } from "./ui";

type Props = {
  product: Product | null;
  history: number[];
  movements: Movement[];
  onClose: () => void;
  onRegister: (sku: string) => void;
};

export function ProductDrawer({ product, history, movements, onClose, onRegister }: Props) {
  return (
    <Dialog open={product !== null} onClose={onClose} labelledBy="inv-drawer-title" variant="drawer" contained>
      {product ? <DrawerBody product={product} history={history} movements={movements} onClose={onClose} onRegister={onRegister} /> : null}
    </Dialog>
  );
}

function DrawerBody({ product, history, movements, onClose, onRegister }: Props & { product: Product }) {
  const { t, l, lang } = useI18n();
  const inv = t.inventory;
  const status = stockStatus(product);
  const days = coverageDays(product);

  const data = useMemo(() => {
    const today = new Date();
    return history.map((stock, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (HISTORY_DAYS - 1 - i));
      return { label: formatShortDate(d, lang), stock };
    });
  }, [history, lang]);

  const stats = [
    { label: inv.detail.current, value: formatNumber(product.stock, lang), strong: true },
    { label: inv.detail.min, value: formatNumber(product.min, lang), help: inv.detail.minHelp },
    { label: inv.detail.value, value: formatCurrency(stockValue(product), lang) },
    { label: inv.detail.coverage, value: product.stock === 0 ? "0" : `${formatNumber(days, lang, 1)} ${inv.detail.days}`, help: inv.detail.coverageHelp },
  ];

  return (
    <div className="flex min-h-full flex-col border-l border-line-strong bg-ink-850">
      <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-line bg-ink-850/95 px-5 py-4 backdrop-blur">
        <div className="min-w-0">
          <p className="font-mono text-[11px] text-fg-subtle">
            {product.sku} · {l(categories[product.category])} · {l(warehouses[product.warehouse])}
          </p>
          <h4 id="inv-drawer-title" className="mt-1 truncate text-lg font-semibold">
            {l(product.name)}
            {product.variant ? <span className="font-normal text-fg-muted"> · {l(product.variant)}</span> : null}
          </h4>
          <div className="mt-2">
            <StatusBadge status={status} />
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label={t.a11y.close} className="grid size-8 shrink-0 place-items-center rounded-lg text-fg-muted hover:bg-overlay/5 hover:text-fg">
          <X className="size-4" aria-hidden />
        </button>
      </div>

      <div className="flex-1 space-y-5 px-5 py-5">
        <dl className="grid grid-cols-2 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg border border-line bg-ink-900 p-3">
              <dt className="text-[11px] text-fg-subtle">{s.label}</dt>
              <dd className={cn("mt-1 tabular", s.strong ? "text-xl font-semibold" : "text-[15px]")}>{s.value}</dd>
              {"help" in s && s.help ? <dd className="mt-1 text-[11px] leading-snug text-fg-subtle">{s.help}</dd> : null}
            </div>
          ))}
        </dl>
        <p className="text-[12px] text-fg-subtle">
          {inv.detail.unitCost}: <span className="tabular text-fg-muted">{formatCurrency(product.unitCost, lang, 2)}</span>
        </p>

        <section>
          <h5 className="text-[12px] font-medium text-fg-muted">{inv.detail.history}</h5>
          <div className="mt-2 h-44 rounded-lg border border-line bg-ink-900 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
                <defs>
                  <linearGradient id="inv-area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor={SERIES.s1} stopOpacity={0.22} />
                    <stop offset="1" stopColor={SERIES.s1} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={GRID_STROKE} />
                <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} interval={9} />
                <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={48} tickFormatter={(v: number) => formatNumber(v, lang)} />
                <ReferenceLine
                  y={product.min}
                  stroke="var(--color-warning)"
                  strokeOpacity={0.7}
                  strokeDasharray="4 4"
                  label={{ value: inv.detail.minLine, position: "insideTopRight", fill: "var(--color-fg-muted)", fontSize: 10 }}
                />
                <Tooltip
                  cursor={{ stroke: "var(--chart-cursor-line)" }}
                  content={({ active, payload }) =>
                    active && payload?.length ? (
                      <ChartTooltipBox
                        title={payload[0].payload.label}
                        rows={[{ label: inv.columns.stock, value: formatNumber(payload[0].payload.stock, lang), color: SERIES.s1 }]}
                      />
                    ) : null
                  }
                />
                <Area type="monotone" dataKey="stock" stroke={SERIES.s1} strokeWidth={2} fill="url(#inv-area)" activeDot={{ r: 4, stroke: "var(--color-ink-850)", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section>
          <h5 className="text-[12px] font-medium text-fg-muted">{inv.detail.recent}</h5>
          {movements.length === 0 ? (
            <p className="mt-2 text-[13px] text-fg-subtle">{inv.detail.noMovements}</p>
          ) : (
            <ul className="mt-2 divide-y divide-line rounded-lg border border-line bg-ink-900">
              {movements.slice(0, 6).map((mv) => (
                <li key={mv.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                  <div>
                    <MovementBadge type={mv.type} />
                    <p className="mt-0.5 text-[11px] text-fg-subtle">
                      {formatDateTime(mv.date, lang)} · {mv.ref} · {mv.user}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={cn("font-mono text-[13px] tabular", mv.qty >= 0 ? "text-good" : "text-fg")}>{formatSigned(mv.qty, lang)}</p>
                    <p className="text-[11px] tabular text-fg-subtle">{formatNumber(mv.balance, lang)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="sticky bottom-0 border-t border-line bg-ink-850 px-5 py-4">
        <button
          type="button"
          onClick={() => onRegister(product.sku)}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-accent text-[13px] font-medium text-accent-ink hover:bg-accent-soft"
        >
          <Plus className="size-4" aria-hidden />
          {inv.detail.register}
        </button>
      </div>
    </div>
  );
}
