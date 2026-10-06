"use client";

import type { ReactNode } from "react";

/** Recharts-compatible tooltip shell matching the portfolio's dark UI. */
export function ChartTooltipBox({ title, rows }: { title?: ReactNode; rows: { label: ReactNode; value: ReactNode; color?: string }[] }) {
  return (
    <div className="min-w-36 rounded-lg border border-line-strong bg-ink-800/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      {title ? <p className="mb-1.5 font-medium text-fg">{title}</p> : null}
      <ul className="space-y-1">
        {rows.map((r, i) => (
          <li key={i} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-fg-muted">
              {r.color ? <span className="size-2 rounded-full" style={{ background: r.color }} aria-hidden /> : null}
              {r.label}
            </span>
            <span className="tabular font-mono text-fg">{r.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const AXIS_TICK = { fill: "var(--color-fg-subtle)", fontSize: 11 } as const;
export const GRID_STROKE = "var(--chart-grid)";
export const SERIES = { s1: "#ec6534", s2: "#3f86ee", s3: "#1a9a71" } as const;
