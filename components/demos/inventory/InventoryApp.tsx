"use client";

import { AnimatePresence, m } from "framer-motion";
import { ArrowLeftRight, Boxes, CheckCircle2, LayoutDashboard, Plus, Search, type LucideIcon } from "lucide-react";
import { useCallback, useMemo, useReducer, useState } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { buildHistory, stockStatus, type StockStatus } from "@/data/inventory";
import { hydrateMovements, seedMovements, type Movement, type MovementType } from "@/data/movements";
import { products as catalog, type CategoryId, type Product, type WarehouseId } from "@/data/products";
import { cn } from "@/lib/cn";
import { formatSigned } from "@/lib/format";
import { InventoryDashboardView } from "./InventoryDashboardView";
import { InventoryTableView } from "./InventoryTableView";
import { MovementForm } from "./MovementForm";
import { MovementsView } from "./MovementsView";
import { ProductDrawer } from "./ProductDrawer";

export type View = "dashboard" | "inventory" | "movements";

export type Filters = {
  search: string;
  category: CategoryId | "all";
  status: StockStatus | "all";
  warehouse: WarehouseId | "all";
};

export const EMPTY_FILTERS: Filters = { search: "", category: "all", status: "all", warehouse: "all" };

type State = {
  /** When this session opened — anchors "last 7 days". */
  openedAt: number;
  products: Product[];
  movements: Movement[];
  history: Record<string, number[]>;
};

export type RegisterInput = { sku: string; type: MovementType; delta: number; ref: string };

type Action = { type: "register"; input: RegisterInput; user: string };

function init(): State {
  const now = new Date();
  const stockBySku = Object.fromEntries(catalog.map((p) => [p.sku, p.stock]));
  return {
    openedAt: now.getTime(),
    products: catalog.map((p) => ({ ...p })),
    movements: hydrateMovements(seedMovements, stockBySku, now),
    history: Object.fromEntries(catalog.map((p) => [p.sku, buildHistory(p)])),
  };
}

function reducer(state: State, action: Action): State {
  const { sku, type, delta, ref } = action.input;
  const product = state.products.find((p) => p.sku === sku);
  if (!product) return state;
  const balance = Math.max(0, product.stock + delta);
  const movement: Movement = {
    id: `m-${Date.now()}`,
    sku,
    type,
    qty: balance - product.stock,
    ref: ref || "—",
    user: action.user,
    date: new Date(),
    balance,
  };
  const series = state.history[sku];
  return {
    ...state,
    products: state.products.map((p) => (p.sku === sku ? { ...p, stock: balance } : p)),
    movements: [movement, ...state.movements],
    history: { ...state.history, [sku]: [...series.slice(0, -1), balance] },
  };
}

const NAV: { id: View; icon: LucideIcon }[] = [
  { id: "dashboard", icon: LayoutDashboard },
  { id: "inventory", icon: Boxes },
  { id: "movements", icon: ArrowLeftRight },
];

export default function InventoryApp() {
  const { t, lang } = useI18n();
  const inv = t.inventory;
  const [state, dispatch] = useReducer(reducer, undefined, init);
  const [view, setView] = useState<View>("dashboard");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [form, setForm] = useState<{ open: boolean; sku?: string; type?: MovementType }>({ open: false });
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);

  const selected = useMemo(() => state.products.find((p) => p.sku === selectedSku) ?? null, [state.products, selectedSku]);
  const alertCount = state.products.filter((p) => stockStatus(p) !== "ok").length;

  const openInventory = useCallback((patch: Partial<Filters> = {}) => {
    setFilters({ ...EMPTY_FILTERS, ...patch });
    setView("inventory");
  }, []);

  const register = (input: RegisterInput) => {
    dispatch({ type: "register", input, user: inv.you });
    setForm({ open: false });
    const p = state.products.find((x) => x.sku === input.sku);
    const delta = p ? Math.max(0, p.stock + input.delta) - p.stock : input.delta;
    const id = Date.now();
    setToast({ id, text: `${inv.form.success} · ${input.sku} ${formatSigned(delta, lang)}` });
    window.setTimeout(() => setToast((cur) => (cur?.id === id ? null : cur)), 3200);
  };

  return (
    <div className="@container relative flex h-full bg-ink-900 text-fg">
      {/* ---------- Sidebar ---------- */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-line bg-ink-950/50 @3xl:flex">
        <div className="flex h-14 items-center gap-2.5 border-b border-line px-4">
          <span className="grid size-7 place-items-center rounded-lg bg-accent text-accent-ink">
            <Boxes className="size-4" aria-hidden />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">{inv.appName}</p>
            <p className="text-[11px] text-fg-subtle">{inv.workspace}</p>
          </div>
        </div>
        <nav className="flex-1 p-3" aria-label={inv.appName}>
          <ul className="space-y-0.5">
            {NAV.map(({ id, icon: Icon }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setView(id)}
                  aria-current={view === id ? "page" : undefined}
                  className={cn(
                    "relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors",
                    view === id ? "text-fg" : "text-fg-muted hover:bg-overlay/[0.03] hover:text-fg",
                  )}
                >
                  {view === id ? <m.span layoutId="inv-nav" className="absolute inset-0 rounded-lg border border-line bg-overlay/[0.05]" /> : null}
                  <Icon className="relative size-4" aria-hidden />
                  <span className="relative">{inv.nav[id]}</span>
                  {id === "inventory" && alertCount > 0 ? (
                    <span className="relative ml-auto rounded-full bg-warning/15 px-1.5 text-[10px] tabular text-warning">{alertCount}</span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2.5 border-t border-line p-4">
          <span className="grid size-7 place-items-center rounded-full bg-ink-700 text-[10px] font-semibold">KD</span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[12px]">Khristian D.</p>
            <p className="truncate text-[11px] text-fg-subtle">{inv.workspace}</p>
          </div>
        </div>
      </aside>

      {/* ---------- Main ---------- */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-line px-4">
          <h3 className="hidden text-sm font-semibold @xl:block">{inv.nav[view]}</h3>
          <label className="relative ml-auto w-full max-w-xs flex-1">
            <span className="sr-only">{inv.searchLabel}</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-fg-subtle" aria-hidden />
            <input
              type="search"
              value={filters.search}
              onChange={(e) => {
                setFilters((f) => ({ ...f, search: e.target.value }));
                if (view !== "inventory") setView("inventory");
              }}
              placeholder={inv.search}
              className="h-9 w-full rounded-lg border border-line bg-ink-850 pl-8 pr-3 text-[13px] text-fg outline-none placeholder:text-fg-subtle focus-visible:border-accent"
            />
          </label>
          <button
            type="button"
            onClick={() => setForm({ open: true })}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-accent px-3 text-[13px] font-medium text-accent-ink transition-colors hover:bg-accent-soft"
          >
            <Plus className="size-4" aria-hidden />
            <span className="hidden @md:inline">{inv.newMovement}</span>
          </button>
        </div>

        {/* compact nav for narrow containers */}
        <nav className="flex shrink-0 gap-1 border-b border-line px-3 py-2 @3xl:hidden" aria-label={inv.appName}>
          {NAV.map(({ id, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setView(id)}
              aria-current={view === id ? "page" : undefined}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-[12px] transition-colors",
                view === id ? "bg-overlay/[0.06] text-fg" : "text-fg-muted",
              )}
            >
              <Icon className="size-3.5" aria-hidden />
              {inv.nav[id]}
            </button>
          ))}
        </nav>

        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
          <AnimatePresence mode="wait" initial={false}>
            <m.div key={view} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="p-4">
              {view === "dashboard" ? (
                <InventoryDashboardView
                  products={state.products}
                  movements={state.movements}
                  now={state.openedAt}
                  onOpenInventory={openInventory}
                  onOpenMovements={() => setView("movements")}
                  onQuickAction={(type) => setForm({ open: true, type })}
                  onSelect={setSelectedSku}
                />
              ) : view === "inventory" ? (
                <InventoryTableView products={state.products} filters={filters} onFilters={setFilters} onSelect={setSelectedSku} />
              ) : (
                <MovementsView products={state.products} movements={state.movements} onSelect={setSelectedSku} />
              )}
            </m.div>
          </AnimatePresence>
        </div>
      </div>

      <ProductDrawer
        product={selected}
        history={selected ? state.history[selected.sku] : []}
        movements={selected ? state.movements.filter((mv) => mv.sku === selected.sku) : []}
        onClose={() => setSelectedSku(null)}
        onRegister={(sku) => setForm({ open: true, sku })}
      />

      <MovementForm
        open={form.open}
        presetSku={form.sku}
        presetType={form.type}
        products={state.products}
        onClose={() => setForm({ open: false })}
        onSubmit={register}
      />

      <div className="pointer-events-none absolute bottom-4 right-4 z-[90]" role="status" aria-live="polite">
        <AnimatePresence>
          {toast ? (
            <m.p
              key={toast.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6 }}
              className="flex items-center gap-2 rounded-lg border border-good/30 bg-ink-800 px-3.5 py-2.5 text-[13px] text-fg shadow-2xl"
            >
              <CheckCircle2 className="size-4 text-good" aria-hidden />
              {toast.text}
            </m.p>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
