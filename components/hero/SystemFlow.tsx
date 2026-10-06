"use client";

import { AnimatePresence, m, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ArrowRight, BarChart3, Boxes, Database, Factory, Target, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";

const ICONS: LucideIcon[] = [Factory, Database, Boxes, BarChart3, Target];
/** Where each stage is proven on the page. */
const TARGETS = ["#experience", "#systems", "#systems", "#dashboard", "#about"];
const STEP_MS = 2400;
const ROW = 64; // px, keep in sync with the row height below

/**
 * The portfolio's signature: OPERATIONS → DATA → SYSTEM → INSIGHTS → DECISIONS.
 * Plays on its own, follows the page once the visitor scrolls,
 * and holds on any stage the visitor points at.
 */
export function SystemFlow() {
  const { t, lang } = useI18n();
  const flow = t.hero.flow;
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLElement>(null);

  const [auto, setAuto] = useState(0);
  const [held, setHeld] = useState<number | null>(null);
  const [scrollStage, setScrollStage] = useState<number | null>(null);
  const [orders, setOrders] = useState(128);
  const [records, setRecords] = useState(12480);

  // Scroll-linked mode: as the card travels up the viewport the packet walks the pipeline.
  const { scrollY } = useScroll();
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["start 0.9", "end 0.1"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (scrollY.get() < 40) {
      setScrollStage(null);
      return;
    }
    const next = Math.min(ICONS.length - 1, Math.max(0, Math.floor(p * ICONS.length * 1.15)));
    setScrollStage((cur) => (cur === next ? cur : next));
  });

  const paused = reduce || held !== null || scrollStage !== null;

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setAuto((a) => (a + 1) % ICONS.length);
      setRecords((r) => r + 3 + Math.floor(Math.random() * 14));
      if (Math.random() > 0.5) setOrders((o) => o + 1);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  const active = held ?? scrollStage ?? (reduce ? 4 : auto);
  const metrics = [formatNumber(orders, lang), formatNumber(records, lang), "128/128", "94.2%", "3"];

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
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
        style={{ background: "radial-gradient(420px circle at var(--mx, 50%) var(--my, 30%), rgb(255 122 69 / 0.08), transparent 60%)" }}
      />

      <div className="relative flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-subtle">{flow.title}</p>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-good/30 bg-good/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-good">
          <span className="size-1.5 animate-pulse-soft rounded-full bg-good" aria-hidden />
          {flow.live}
        </span>
      </div>

      <ol className="relative mt-4 pl-6" aria-label={flow.title} onMouseLeave={() => setHeld(null)}>
        {/* rail + progress */}
        <span aria-hidden className="absolute left-[5px] w-px bg-line-strong" style={{ top: ROW / 2, bottom: ROW / 2 }} />
        <span
          aria-hidden
          className="absolute left-[5px] w-px bg-gradient-to-b from-accent/0 to-accent transition-[height] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{ top: ROW / 2, height: active * ROW }}
        />
        <span
          aria-hidden
          className="absolute left-0 z-10 size-[11px] rounded-full border-2 border-ink-900 bg-accent shadow-[0_0_16px_rgb(255_122_69/0.9)] transition-[top] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{ top: ROW / 2 - 5.5 + active * ROW }}
        />
        {flow.nodes.map((node, i) => {
          const Icon = ICONS[i];
          const isActive = i === active;
          const isPast = i < active;
          return (
            <li key={node.label} className="relative" style={{ height: ROW }}>
              <span
                aria-hidden
                className={cn(
                  "absolute -left-[22px] top-1/2 size-[7px] -translate-y-1/2 rounded-full transition-colors duration-500",
                  isActive || isPast ? "bg-accent/70" : "bg-ink-600",
                )}
              />
              <button
                type="button"
                aria-pressed={held === i}
                onMouseEnter={() => setHeld(i)}
                onFocus={() => setHeld(i)}
                onClick={() => setHeld(i)}
                className="-mx-2 flex h-full w-[calc(100%+1rem)] items-center gap-4 rounded-xl px-2 text-left transition-colors hover:bg-white/[0.025]"
              >
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-xl border transition-all duration-500",
                    isActive
                      ? "border-accent/50 bg-accent/15 text-accent-soft shadow-[0_0_24px_-6px_rgb(255_122_69/0.6)]"
                      : isPast
                        ? "border-line-strong bg-ink-800 text-fg-muted"
                        : "border-line bg-ink-850 text-fg-subtle",
                  )}
                >
                  <Icon className="size-[17px]" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cn("block font-mono text-xs uppercase tracking-[0.16em] transition-colors duration-500", isActive ? "text-fg" : "text-fg-muted")}>
                    {node.label}
                  </span>
                  <span className="mt-0.5 block truncate text-[13px] text-fg-subtle">{node.detail}</span>
                </span>
                <span className="text-right">
                  <span className={cn("block font-mono text-sm tabular transition-colors duration-500", isActive ? "text-accent-soft" : "text-fg-muted")}>
                    {metrics[i]}
                  </span>
                  <span className="hidden text-[11px] text-fg-subtle sm:block">{node.metric}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* What this stage means, and where it's proven */}
      <div className="relative mt-3 flex min-h-[3.75rem] items-center gap-3 rounded-xl border border-line bg-ink-950/60 px-4 py-3">
        <AnimatePresence mode="wait" initial={false}>
          <m.p
            key={`${lang}-${active}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="flex-1 text-[13px] leading-snug text-fg-muted"
          >
            {flow.nodes[active].note}
          </m.p>
        </AnimatePresence>
        <a
          href={TARGETS[active]}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-line-strong px-3 py-1.5 text-xs text-fg transition-colors hover:border-accent/60 hover:text-accent-soft"
        >
          {flow.see}
          <span className="sr-only">: {flow.nodes[active].label}</span>
          <ArrowRight className="size-3" aria-hidden />
        </a>
      </div>

      <figcaption className="relative mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
        <span className="text-[13px] font-medium text-fg">{t.signature}</span>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle sm:block">{flow.hint}</span>
      </figcaption>
    </figure>
  );
}
