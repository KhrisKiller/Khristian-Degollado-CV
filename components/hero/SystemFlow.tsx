"use client";

import { useReducedMotion } from "framer-motion";
import { BarChart3, Boxes, Database, Factory, Target, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";

const ICONS: LucideIcon[] = [Factory, Database, Boxes, BarChart3, Target];
const STEP_MS = 1500;
const ROW = 72; // px — keep in sync with row height below

/**
 * OPERATIONS → DATA → SYSTEM → INSIGHTS → DECISIONS
 * A data "packet" walks the pipeline while each stage's readout stays live.
 */
export function SystemFlow() {
  const { t, lang } = useI18n();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [orders, setOrders] = useState(128);
  const [records, setRecords] = useState(12480);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % ICONS.length);
      setRecords((r) => r + 3 + Math.floor(Math.random() * 14));
      if (Math.random() > 0.55) setOrders((o) => o + 1);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [reduce]);

  const metrics = [
    formatNumber(orders, lang),
    formatNumber(records, lang),
    "128/128",
    "94.2%",
    "3",
  ];

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <figure
      ref={cardRef}
      onPointerMove={onPointerMove}
      className="group relative overflow-hidden rounded-3xl border border-line-strong bg-ink-900/80 p-5 shadow-[0_40px_120px_-50px_rgb(255_122_69/0.35)] backdrop-blur sm:p-6"
    >
      {/* cursor-aware spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: "radial-gradient(420px circle at var(--mx, 50%) var(--my, 30%), rgb(255 122 69 / 0.09), transparent 60%)",
        }}
      />

      <div className="relative flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-subtle">{t.hero.flow.title}</p>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-good/30 bg-good/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-good">
          <span className="size-1.5 rounded-full bg-good animate-pulse-soft" aria-hidden />
          {t.hero.flow.live}
        </span>
      </div>

      <ol className="relative mt-5 pl-6" aria-label={t.hero.flow.title}>
        {/* rail */}
        <span aria-hidden className="absolute left-[5px] w-px bg-line-strong" style={{ top: ROW / 2, bottom: ROW / 2 }} />
        <span
          aria-hidden
          className="absolute left-[5px] w-px bg-gradient-to-b from-accent/0 to-accent transition-[height] duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{ top: ROW / 2, height: active * ROW }}
        />
        {/* travelling packet */}
        <span
          aria-hidden
          className="absolute left-0 z-10 size-[11px] rounded-full border-2 border-ink-900 bg-accent shadow-[0_0_16px_rgb(255_122_69/0.9)] transition-[top] duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{ top: ROW / 2 - 5.5 + active * ROW }}
        />
        {t.hero.flow.nodes.map((node, i) => {
          const Icon = ICONS[i];
          const isActive = reduce || i === active;
          const isPast = !reduce && i < active;
          return (
            <li key={node.label} className="relative flex items-center gap-4" style={{ height: ROW }}>
              <span
                aria-hidden
                className={cn(
                  "absolute -left-[22px] size-[7px] rounded-full transition-colors duration-500",
                  isActive || isPast ? "bg-accent/70" : "bg-ink-600",
                )}
              />
              <span
                className={cn(
                  "grid size-11 shrink-0 place-items-center rounded-xl border transition-all duration-500",
                  isActive
                    ? "border-accent/50 bg-accent/15 text-accent-soft shadow-[0_0_24px_-6px_rgb(255_122_69/0.6)]"
                    : isPast
                      ? "border-line-strong bg-ink-800 text-fg-muted"
                      : "border-line bg-ink-850 text-fg-subtle",
                )}
              >
                <Icon className="size-[18px]" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "font-mono text-xs uppercase tracking-[0.16em] transition-colors duration-500",
                    isActive ? "text-fg" : "text-fg-muted",
                  )}
                >
                  {node.label}
                </p>
                <p className="mt-0.5 truncate text-[13px] text-fg-subtle">{node.detail}</p>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "tabular font-mono text-sm transition-colors duration-500",
                    isActive ? "text-accent-soft" : "text-fg-muted",
                  )}
                >
                  {metrics[i]}
                </p>
                <p className="hidden text-[11px] text-fg-subtle sm:block">{node.metric}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <figcaption className="relative mt-4 border-t border-line pt-4 text-xs leading-relaxed text-fg-subtle">
        {t.hero.flow.caption}
      </figcaption>
    </figure>
  );
}
