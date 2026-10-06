"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { MOVEMENT_TYPES, type Movement, type MovementType } from "@/data/movements";
import type { Product } from "@/data/products";
import { cn } from "@/lib/cn";
import { formatDateTime, formatNumber, formatSigned } from "@/lib/format";
import { MovementBadge, MOVEMENT_ICON } from "./ui";

type Props = { products: Product[]; movements: Movement[]; onSelect: (sku: string) => void };

export function MovementsView({ products, movements, onSelect }: Props) {
  const { t, l, lang } = useI18n();
  const inv = t.inventory;
  const [type, setType] = useState<MovementType | "all">("all");
  const bySku = useMemo(() => new Map(products.map((p) => [p.sku, p])), [products]);
  const list = type === "all" ? movements : movements.filter((m) => m.type === type);

  const label = (sku: string) => {
    const p = bySku.get(sku);
    return p ? `${l(p.name)}${p.variant ? ` · ${l(p.variant)}` : ""}` : sku;
  };

  return (
    <div className="space-y-3">
      <div role="group" aria-label={inv.movementColumns.type} className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1">
        {(["all", ...MOVEMENT_TYPES] as const).map((k) => {
          const Icon = k === "all" ? null : MOVEMENT_ICON[k];
          const count = k === "all" ? movements.length : movements.filter((m) => m.type === k).length;
          return (
            <button
              key={k}
              type="button"
              aria-pressed={type === k}
              onClick={() => setType(k)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] transition-colors",
                type === k ? "border-line-strong bg-overlay/[0.07] text-fg" : "border-line text-fg-muted hover:text-fg",
              )}
            >
              {Icon ? <Icon className="size-3.5" aria-hidden /> : null}
              {k === "all" ? inv.allTypes : inv.movementTypes[k]}
              <span className="tabular text-fg-subtle">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-line @2xl:block">
        <table className="w-full text-left text-[13px]">
          <caption className="sr-only">{inv.nav.movements}</caption>
          <thead className="border-b border-line bg-ink-850 text-[11px] uppercase tracking-[0.08em] text-fg-subtle">
            <tr>
              <th scope="col" className="px-3 py-2.5 font-medium">{inv.movementColumns.date}</th>
              <th scope="col" className="px-3 py-2.5 font-medium">{inv.movementColumns.type}</th>
              <th scope="col" className="px-3 py-2.5 font-medium">{inv.movementColumns.product}</th>
              <th scope="col" className="px-3 py-2.5 text-right font-medium">{inv.movementColumns.qty}</th>
              <th scope="col" className="hidden px-3 py-2.5 text-right font-medium @3xl:table-cell">{inv.movementColumns.balance}</th>
              <th scope="col" className="hidden px-3 py-2.5 font-medium @4xl:table-cell">{inv.movementColumns.ref}</th>
              <th scope="col" className="hidden px-3 py-2.5 font-medium @5xl:table-cell">{inv.movementColumns.user}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.map((mv) => (
              <tr key={mv.id} className="bg-ink-900">
                <td className="whitespace-nowrap px-3 py-2.5 text-fg-muted">{formatDateTime(mv.date, lang)}</td>
                <td className="px-3 py-2.5">
                  <MovementBadge type={mv.type} />
                </td>
                <td className="px-3 py-2.5">
                  <button type="button" onClick={() => onSelect(mv.sku)} className="text-left text-fg hover:text-accent-soft">
                    {label(mv.sku)}
                    <span className="block font-mono text-[11px] text-fg-subtle">{mv.sku}</span>
                  </button>
                </td>
                <td className={cn("px-3 py-2.5 text-right font-mono tabular", mv.qty >= 0 ? "text-good" : "text-fg")}>{formatSigned(mv.qty, lang)}</td>
                <td className="hidden px-3 py-2.5 text-right tabular text-fg-muted @3xl:table-cell">{formatNumber(mv.balance, lang)}</td>
                <td className="hidden px-3 py-2.5 font-mono text-[12px] text-fg-muted @4xl:table-cell">{mv.ref}</td>
                <td className="hidden px-3 py-2.5 text-fg-muted @5xl:table-cell">{mv.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-2 @2xl:hidden">
        {list.map((mv) => (
          <li key={mv.id}>
            <button type="button" onClick={() => onSelect(mv.sku)} className="flex w-full items-center gap-3 rounded-xl border border-line bg-ink-850 p-3 text-left">
              <div className="min-w-0 flex-1">
                <MovementBadge type={mv.type} />
                <p className="mt-1 truncate text-[13px] text-fg">{label(mv.sku)}</p>
                <p className="text-[11px] text-fg-subtle">
                  {formatDateTime(mv.date, lang)} · {mv.ref}
                </p>
              </div>
              <span className={cn("font-mono text-sm tabular", mv.qty >= 0 ? "text-good" : "text-fg")}>{formatSigned(mv.qty, lang)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
