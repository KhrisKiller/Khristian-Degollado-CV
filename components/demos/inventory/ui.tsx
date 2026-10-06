"use client";

import { ArrowDownLeft, ArrowUpRight, Factory, SlidersHorizontal, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import type { StockStatus } from "@/data/inventory";
import type { MovementType } from "@/data/movements";
import { cn } from "@/lib/cn";

const STATUS_STYLE: Record<StockStatus, { dot: string; chip: string }> = {
  ok: { dot: "bg-good", chip: "border-good/25 bg-good/10" },
  low: { dot: "bg-warning", chip: "border-warning/25 bg-warning/10" },
  out: { dot: "bg-critical", chip: "border-critical/30 bg-critical/10" },
};

export function StatusBadge({ status }: { status: StockStatus }) {
  const { t } = useI18n();
  const s = STATUS_STYLE[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] text-fg", s.chip)}>
      <span className={cn("size-1.5 rounded-full", s.dot)} aria-hidden />
      {t.inventory.status[status]}
    </span>
  );
}

export const MOVEMENT_ICON: Record<MovementType, LucideIcon> = {
  inbound: ArrowDownLeft,
  outbound: ArrowUpRight,
  adjustment: SlidersHorizontal,
  production: Factory,
};

export function MovementBadge({ type }: { type: MovementType }) {
  const { t } = useI18n();
  const Icon = MOVEMENT_ICON[type];
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[12px] text-fg-muted">
      <span className="grid size-5 place-items-center rounded-md border border-line bg-overlay/[0.03]">
        <Icon className="size-3" aria-hidden />
      </span>
      {t.inventory.movementTypes[type]}
    </span>
  );
}

export function Panel({ title, action, children, className }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-xl border border-line bg-ink-850", className)}>
      {title ? (
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <h4 className="text-[13px] font-medium text-fg">{title}</h4>
          {action}
        </header>
      ) : null}
      {children}
    </section>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <label className={cn("relative block", className)}>
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full appearance-none rounded-lg border border-line bg-ink-850 pl-3 pr-8 text-[13px] text-fg outline-none transition-colors hover:border-line-strong focus-visible:border-accent"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-ink-850">
            {o.label}
          </option>
        ))}
      </select>
      <svg aria-hidden viewBox="0 0 16 16" className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-fg-subtle">
        <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </label>
  );
}
