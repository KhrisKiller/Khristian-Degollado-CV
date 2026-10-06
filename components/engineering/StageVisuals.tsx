"use client";

import { AlertTriangle, ArrowRight, CheckCircle2, Factory, PackageCheck, Truck, Warehouse } from "lucide-react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/cn";

/** One illustration per stage of the running example. */
export function StageVisual({ stage }: { stage: number }) {
  switch (stage) {
    case 0:
      return <ProblemVisual />;
    case 1:
      return <ProcessVisual />;
    case 2:
      return <DataVisual />;
    case 3:
      return <SystemVisual />;
    case 4:
      return <InsightVisual />;
    default:
      return <DecisionVisual />;
  }
}

function ProblemVisual() {
  const { t } = useI18n();
  const v = t.approach.visuals.problem;
  const spots = [
    "left-[4%] top-[10%] -rotate-6",
    "right-[6%] top-[6%] rotate-3",
    "left-[12%] bottom-[18%] rotate-2",
    "right-[10%] bottom-[24%] -rotate-3",
  ];
  return (
    <div className="relative h-full">
      {v.notes.map((note, i) => (
        <p
          key={note}
          className={cn(
            "absolute max-w-[46%] rounded-md border border-[#e9d9a8]/20 bg-[#2a2516] px-4 py-3 font-serif text-lg italic leading-snug text-[#f1e3b5] shadow-[0_12px_30px_-10px_rgb(0_0_0/0.8)] light:border-[#e9d9a8] light:bg-[#fff6d6] light:text-[#5c4a12] light:shadow-[0_12px_30px_-14px_rgb(92_74_18/0.35)]",
            spots[i],
          )}
        >
          {note}
        </p>
      ))}
      <p className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-critical/40 bg-critical/15 px-4 py-2 text-sm text-fg shadow-xl">
        <AlertTriangle className="size-4 text-critical" aria-hidden />
        {v.alert}
      </p>
    </div>
  );
}

function ProcessVisual() {
  const { t } = useI18n();
  const v = t.approach.visuals;
  const icons = [Truck, Factory, Warehouse, PackageCheck];
  return (
    <div className="flex h-full flex-col justify-center">
      <ol className="grid grid-cols-4 gap-2">
        {v.process.map((label, i) => {
          const Icon = icons[i];
          return (
            <li key={label} className="relative flex flex-col items-center gap-2 text-center">
              <span className={cn("grid size-14 place-items-center rounded-2xl border", i === 2 ? "border-critical/40 bg-critical/10 text-critical" : "border-line-strong bg-ink-800 text-fg-muted")}>
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="text-[11px] text-fg-muted sm:text-xs">{label}</span>
              {i < 3 ? (
                <ArrowRight
                  className={cn("absolute -right-3 top-[1.15rem] size-4", i === 1 ? "text-critical" : "text-fg-subtle")}
                  aria-hidden
                />
              ) : null}
            </li>
          );
        })}
      </ol>
      <div className="mx-auto mt-8 flex items-center gap-2 rounded-full border border-dashed border-critical/50 px-3.5 py-1.5 text-xs text-fg">
        <span className="size-1.5 animate-pulse-soft rounded-full bg-critical" aria-hidden />
        {v.processGap}
      </div>
    </div>
  );
}

function DataVisual() {
  const { t, l } = useI18n();
  const cols = t.approach.visuals.data.columns;
  const rows = [
    ["PT-302", "+250", "A-03", { en: "Production", es: "Producción" }],
    ["PT-301", "−96", "B-11", { en: "Outbound", es: "Salida" }],
    ["MP-101", "+40", "R-07", { en: "Inbound", es: "Entrada" }],
    ["MP-102", "−2", "R-02", { en: "Adjustment", es: "Ajuste" }],
  ] as const;
  return (
    <div className="flex h-full items-center">
      <table className="w-full overflow-hidden rounded-xl border border-line text-left text-[13px]">
        <thead className="bg-ink-800 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
          <tr>
            {cols.map((c) => (
              <th key={c} scope="col" className="px-3 py-2.5 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r, i) => (
            <tr key={r[0]} className="bg-ink-900 opacity-0 [animation:rise_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]" style={{ animationDelay: `${120 + i * 110}ms` }}>
              <td className="px-3 py-2.5 font-mono text-[12px] text-fg-muted">{r[0]}</td>
              <td className={cn("px-3 py-2.5 font-mono tabular", r[1].startsWith("+") ? "text-good" : "text-fg")}>{r[1]}</td>
              <td className="px-3 py-2.5 font-mono text-[12px] text-fg-muted">{r[2]}</td>
              <td className="px-3 py-2.5 text-fg-muted">{l(r[3])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SystemVisual() {
  const { t } = useI18n();
  const v = t.approach.visuals.system;
  return (
    <div className="flex h-full items-center justify-center">
      <div className="w-full max-w-xs rounded-2xl border border-line-strong bg-ink-850 p-5 shadow-2xl">
        <p className="text-sm font-semibold">{v.title}</p>
        <div className="mt-4 space-y-2.5">
          <div className="rounded-lg border border-line bg-ink-900 px-3 py-2 text-[13px] text-fg">{v.product}</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-accent/50 bg-accent/10 px-3 py-2 text-[13px] text-fg">{v.type}</div>
            <div className="rounded-lg border border-line bg-ink-900 px-3 py-2 text-right font-mono text-[13px] text-good">{v.qty}</div>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-accent py-2 text-center text-[13px] font-medium text-accent-ink shadow-[0_0_0_0_rgb(255_122_69/0.6)] [animation:pulse-ring_2s_ease-out_infinite]">
          {v.button}
        </div>
      </div>
    </div>
  );
}

function InsightVisual() {
  const { t, l } = useI18n();
  const v = t.approach.visuals.insight;
  const rows = [
    { name: { en: "Almonds", es: "Almendra" }, sku: "MP-103", stock: 0, min: 8, days: 0, status: "out" as const },
    { name: { en: "Cocoa granola", es: "Granola de cacao" }, sku: "PT-302", stock: 120, min: 250, days: 5, status: "low" as const },
    { name: { en: "Honey", es: "Miel de abeja" }, sku: "MP-102", stock: 9, min: 12, days: 7, status: "low" as const },
  ];
  return (
    <div className="flex h-full items-center">
      <div className="w-full overflow-hidden rounded-2xl border border-line-strong bg-ink-850">
        <p className="flex items-center justify-between border-b border-line px-4 py-3 text-sm font-medium">
          {v.title}
          <span className="rounded-full bg-warning/15 px-2 text-[11px] tabular text-warning">{rows.length}</span>
        </p>
        <ul className="divide-y divide-line">
          {rows.map((r, i) => (
            <li
              key={r.sku}
              className="flex items-center gap-4 px-4 py-3 opacity-0 [animation:rise_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]"
              style={{ animationDelay: `${100 + i * 120}ms` }}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm text-fg">{l(r.name)}</p>
                <p className="font-mono text-[11px] text-fg-subtle">
                  {r.sku} · {r.stock}/{r.min} · {r.days} {v.coverage}
                </p>
                <span className="relative mt-2 block h-1.5 w-full overflow-hidden rounded-full bg-overlay/[0.06]" aria-hidden>
                  <span
                    className={cn("absolute inset-y-0 left-0 rounded-full", r.status === "out" ? "bg-critical" : "bg-warning/80")}
                    style={{ width: `${(r.stock / (r.min * 1.6)) * 100}%` }}
                  />
                  <span className="absolute inset-y-0 w-px bg-fg/70" style={{ left: `${100 / 1.6}%` }} />
                </span>
              </div>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] text-fg",
                  r.status === "out" ? "border-critical/30 bg-critical/10" : "border-warning/25 bg-warning/10",
                )}
              >
                <span className={cn("size-1.5 rounded-full", r.status === "out" ? "bg-critical" : "bg-warning")} aria-hidden />
                {r.status === "out" ? v.out : v.low}
              </span>
            </li>
          ))}
        </ul>
        <p className="flex items-center gap-2 border-t border-line px-4 py-2.5 text-[11px] text-fg-subtle">
          <span className="h-3 w-px bg-fg/70" aria-hidden />
          {v.min}
        </p>
      </div>
    </div>
  );
}

function DecisionVisual() {
  const { t } = useI18n();
  const v = t.approach.visuals.decision;
  return (
    <div className="flex h-full items-center justify-center">
      <div className="w-full max-w-sm rounded-2xl border border-good/30 bg-ink-850 p-5 shadow-[0_30px_80px_-30px_rgb(47_179_90/0.45)]">
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-good">
          <CheckCircle2 className="size-3.5" aria-hidden />
          {v.title}
        </p>
        <p className="mt-3 text-xl font-semibold leading-snug tracking-[-0.02em]">{v.text}</p>
        <p className="mt-2 text-sm text-fg-muted">{v.reason}</p>
        <svg viewBox="0 0 300 70" className="mt-5 h-16 w-full" aria-hidden>
          <line x1="0" x2="300" y1="48" y2="48" stroke="var(--color-warning)" strokeOpacity="0.6" strokeDasharray="4 4" />
          <polyline points="0,12 50,18 100,24 150,31 200,40 230,46" fill="none" stroke="#ec6534" strokeWidth="2" strokeLinecap="round" />
          <polyline points="230,46 250,20 300,22" fill="none" stroke="#2fb35a" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" />
          <circle cx="230" cy="46" r="4" fill="#ec6534" stroke="var(--color-ink-850)" strokeWidth="2" />
        </svg>
        <p className="mt-3 text-[11px] text-fg-subtle">{v.confidence}</p>
      </div>
    </div>
  );
}
