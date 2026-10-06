"use client";

import { ArrowDown, ArrowUp, ChevronRight, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { stockStatus, stockValue, type StockStatus } from "@/data/inventory";
import { categories, warehouses, type CategoryId, type Product, type WarehouseId } from "@/data/products";
import { cn } from "@/lib/cn";
import { formatCurrency, formatNumber } from "@/lib/format";
import { EMPTY_FILTERS, type Filters } from "./InventoryApp";
import { SelectField, StatusBadge } from "./ui";

type SortKey = "sku" | "stock" | "value";
type Props = {
  products: Product[];
  filters: Filters;
  onFilters: (f: Filters) => void;
  onSelect: (sku: string) => void;
};

const STATUS_ORDER: StockStatus[] = ["ok", "low", "out"];

export function InventoryTableView({ products, filters, onFilters, onSelect }: Props) {
  const { t, l, lang } = useI18n();
  const inv = t.inventory;
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "sku", dir: 1 });

  const rows = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const list = products.filter((p) => {
      if (filters.category !== "all" && p.category !== filters.category) return false;
      if (filters.warehouse !== "all" && p.warehouse !== filters.warehouse) return false;
      if (filters.status !== "all" && stockStatus(p) !== filters.status) return false;
      if (q) {
        const hay = `${p.sku} ${p.name} ${p.variant ? l(p.variant) : ""} ${l(categories[p.category])}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const val = (p: Product) => (sort.key === "sku" ? p.sku : sort.key === "stock" ? p.stock : stockValue(p));
    return list.sort((a, b) => {
      const x = val(a);
      const y = val(b);
      return (x < y ? -1 : x > y ? 1 : 0) * sort.dir;
    });
  }, [products, filters, sort, l]);

  const set = (patch: Partial<Filters>) => onFilters({ ...filters, ...patch });
  const isFiltered = JSON.stringify(filters) !== JSON.stringify(EMPTY_FILTERS);

  const toggleSort = (key: SortKey) => setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: key === "sku" ? 1 : -1 }));
  const ariaSort = (key: SortKey) => (sort.key === key ? (sort.dir === 1 ? "ascending" : "descending") : "none");

  const sortHeader = (k: SortKey, children: React.ReactNode, className?: string) => (
    <th scope="col" aria-sort={ariaSort(k)} className={cn("px-3 py-2.5 font-medium", className)}>
      <button type="button" onClick={() => toggleSort(k)} className="inline-flex items-center gap-1 uppercase tracking-[0.08em] hover:text-fg">
        {children}
        {sort.key === k ? (
          sort.dir === 1 ? <ArrowUp className="size-3" aria-hidden /> : <ArrowDown className="size-3" aria-hidden />
        ) : null}
      </button>
    </th>
  );

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="flex flex-col gap-2 @2xl:flex-row @2xl:items-center">
        <div role="group" aria-label={inv.filters.status} className="no-scrollbar flex overflow-x-auto rounded-lg border border-line bg-ink-850 p-0.5 text-[12px]">
          {(["all", ...STATUS_ORDER] as const).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={filters.status === s}
              onClick={() => set({ status: s })}
              className={cn(
                "flex shrink-0 grow items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 transition-colors",
                filters.status === s ? "bg-white/[0.08] text-fg" : "text-fg-muted hover:text-fg",
              )}
            >
              {s !== "all" ? (
                <span className={cn("size-1.5 rounded-full", s === "ok" ? "bg-good" : s === "low" ? "bg-warning" : "bg-critical")} aria-hidden />
              ) : null}
              {s === "all" ? inv.allTypes : inv.status[s]}
            </button>
          ))}
        </div>
        <div className="grid flex-1 grid-cols-2 gap-2 @2xl:flex @2xl:justify-end">
          <SelectField
            label={inv.filters.category}
            value={filters.category}
            onChange={(v) => set({ category: v as CategoryId | "all" })}
            options={[{ value: "all", label: inv.filters.allCategories }, ...Object.entries(categories).map(([value, name]) => ({ value, label: l(name) }))]}
            className="@2xl:w-44"
          />
          <SelectField
            label={inv.filters.warehouse}
            value={filters.warehouse}
            onChange={(v) => set({ warehouse: v as WarehouseId | "all" })}
            options={[{ value: "all", label: inv.filters.allWarehouses }, ...Object.entries(warehouses).map(([value, name]) => ({ value, label: l(name) }))]}
            className="@2xl:w-44"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-[12px] text-fg-subtle">
        <p aria-live="polite">
          {inv.showing} <span className="tabular text-fg-muted">{rows.length}</span> {inv.of} <span className="tabular text-fg-muted">{products.length}</span> {inv.products}
        </p>
        {isFiltered ? (
          <button type="button" onClick={() => onFilters(EMPTY_FILTERS)} className="text-fg-muted underline-offset-2 hover:text-fg hover:underline">
            {inv.filters.clear}
          </button>
        ) : null}
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line-strong py-14 text-center">
          <SearchX className="size-6 text-fg-subtle" aria-hidden />
          <p className="text-[13px] text-fg-muted">{inv.empty}</p>
          <button type="button" onClick={() => onFilters(EMPTY_FILTERS)} className="rounded-lg border border-line-strong px-3 py-1.5 text-[12px] text-fg hover:bg-white/5">
            {inv.filters.clear}
          </button>
        </div>
      ) : (
        <>
          {/* Table — wide containers */}
          <div className="hidden overflow-hidden rounded-xl border border-line @2xl:block">
            <table className="w-full text-left text-[13px]">
              <caption className="sr-only">{inv.tableCaption}</caption>
              <thead className="border-b border-line bg-ink-850 text-[11px] uppercase tracking-[0.08em] text-fg-subtle">
                <tr>
                  {sortHeader("sku", inv.columns.sku)}
                  <th scope="col" className="px-3 py-2.5 font-medium">{inv.columns.product}</th>
                  <th scope="col" className="hidden px-3 py-2.5 font-medium @4xl:table-cell">{inv.columns.category}</th>
                  <th scope="col" className="hidden px-3 py-2.5 font-medium @5xl:table-cell">{inv.columns.warehouse}</th>
                  {sortHeader("stock", inv.columns.stock, "text-right")}
                  <th scope="col" className="hidden px-3 py-2.5 text-right font-medium @3xl:table-cell">{inv.columns.min}</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">{inv.columns.status}</th>
                  {sortHeader("value", inv.columns.value, "text-right")}
                  <th scope="col" className="w-8"><span className="sr-only">—</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((p) => {
                  const status = stockStatus(p);
                  const ratio = Math.min(1, p.stock / (p.min * 3));
                  return (
                    <tr key={p.sku} onClick={() => onSelect(p.sku)} className="group cursor-pointer bg-ink-900 transition-colors hover:bg-white/[0.025]">
                      <td className="px-3 py-2.5 font-mono text-[12px] text-fg-muted">{p.sku}</td>
                      <td className="px-3 py-2.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(p.sku);
                          }}
                          className="text-left text-fg"
                        >
                          <span className="sr-only">{inv.rowHint} </span>
                          {p.name}
                          {p.variant ? <span className="block text-[11px] text-fg-subtle">{l(p.variant)}</span> : null}
                        </button>
                      </td>
                      <td className="hidden px-3 py-2.5 text-fg-muted @4xl:table-cell">{l(categories[p.category])}</td>
                      <td className="hidden px-3 py-2.5 text-fg-muted @5xl:table-cell">{l(warehouses[p.warehouse])}</td>
                      <td className="px-3 py-2.5 text-right">
                        <span className="tabular">{formatNumber(p.stock, lang)}</span>
                        <span className="relative ml-auto mt-1 block h-1 w-16 overflow-hidden rounded-full bg-white/[0.07]" aria-hidden>
                          <span
                            className={cn("absolute inset-y-0 left-0 rounded-full", status === "ok" ? "bg-good/70" : status === "low" ? "bg-warning/80" : "bg-critical")}
                            style={{ width: `${Math.max(status === "out" ? 0 : 4, ratio * 100)}%` }}
                          />
                          <span className="absolute inset-y-0 w-px bg-fg/60" style={{ left: "33.3%" }} />
                        </span>
                      </td>
                      <td className="hidden px-3 py-2.5 text-right tabular text-fg-muted @3xl:table-cell">{formatNumber(p.min, lang)}</td>
                      <td className="px-3 py-2.5">
                        <StatusBadge status={status} />
                      </td>
                      <td className="px-3 py-2.5 text-right tabular">{formatCurrency(stockValue(p), lang)}</td>
                      <td className="pr-3 text-fg-subtle">
                        <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Cards — narrow containers */}
          <ul className="space-y-2 @2xl:hidden">
            {rows.map((p) => (
              <li key={p.sku}>
                <button
                  type="button"
                  onClick={() => onSelect(p.sku)}
                  className="flex w-full items-center gap-3 rounded-xl border border-line bg-ink-850 p-3 text-left active:bg-white/[0.04]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[11px] text-fg-subtle">{p.sku}</p>
                    <p className="truncate text-[14px] text-fg">
                      {p.name}
                      {p.variant ? <span className="text-fg-subtle"> · {l(p.variant)}</span> : null}
                    </p>
                    <p className="mt-1 text-[12px] text-fg-muted">
                      <span className="tabular text-fg">{formatNumber(p.stock, lang)}</span> / {formatNumber(p.min, lang)} · {formatCurrency(stockValue(p), lang)}
                    </p>
                  </div>
                  <StatusBadge status={stockStatus(p)} />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
