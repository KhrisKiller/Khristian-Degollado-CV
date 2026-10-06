"use client";

import { AnimatePresence, m } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";
import { StageVisual } from "./StageVisuals";

/** Steps that are demonstrated in the inventory system above. */
const STEP_LINKS: ({ key: "data" | "system" | "insight"; href: string } | null)[] = [
  null,
  null,
  { key: "data", href: "#systems" },
  { key: "system", href: "#systems" },
  { key: "insight", href: "#systems" },
  null,
];

export function Approach() {
  const { t } = useI18n();
  const a = t.approach;
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const els = stepRefs.current.filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="about" aria-labelledby="about-title" className="relative border-t border-line py-24 md:py-32">
      <div className="container-page">
        <SectionHeader index="04" eyebrow={a.eyebrow} chapter={a.chapter} title={a.title} subtitle={a.body} titleId="about-title" />

        <Reveal className="mt-8">
          <p className="inline-flex flex-wrap items-center gap-2 rounded-full border border-line bg-white/[0.02] px-3.5 py-1.5 text-[13px] text-fg-muted">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">{a.exampleLabel}</span>
            {a.example}
          </p>
        </Reveal>

        {/* The whole case at a glance: stage + what it means here */}
        <Reveal delay={80} className="mt-12">
          <FlowRail steps={a.steps} active={active} />
        </Reveal>

        <div className="mt-10 grid gap-10 lg:mt-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <ol className="relative">
            {a.steps.map((step, i) => (
              <li
                key={step.label}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                data-step={i}
                className="flex min-h-0 flex-col justify-center border-l border-line py-10 pl-6 lg:min-h-[48vh] lg:py-0"
              >
                <div className="group/step" data-active={active === i}>
                  <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em]">
                    <span className={cn("-ml-[29px] size-2.5 rounded-full border-2 transition-colors duration-500", active >= i ? "border-accent bg-accent" : "border-ink-600 bg-ink-950")} aria-hidden />
                    <span className="text-accent">0{i + 1}</span>
                    <span className="text-fg-subtle">{step.label}</span>
                    <span aria-hidden className="text-fg-subtle/50">·</span>
                    <span className="normal-case tracking-normal text-fg-muted">{step.focus}</span>
                  </p>
                  <h3 className="mt-4 text-balance text-[clamp(1.5rem,2.6vw,2.1rem)] font-semibold leading-[1.1] tracking-[-0.03em] transition-colors duration-500 lg:text-fg-subtle lg:group-data-[active=true]/step:text-fg">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-md text-pretty leading-relaxed text-fg-muted transition-colors duration-500 lg:text-fg-subtle lg:group-data-[active=true]/step:text-fg-muted">
                    {step.text}
                  </p>
                  {STEP_LINKS[i] ? (
                    <a
                      href={STEP_LINKS[i]!.href}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm text-fg-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent-soft hover:decoration-accent"
                    >
                      {a.links[STEP_LINKS[i]!.key]}
                      <ArrowUpRight className="size-3.5" aria-hidden />
                    </a>
                  ) : null}
                </div>
                {/* Inline visual on small screens */}
                <div className="mt-6 lg:hidden">
                  <VisualFrame>
                    <StageVisual stage={i} />
                  </VisualFrame>
                </div>
              </li>
            ))}
          </ol>

          {/* Sticky visual on large screens */}
          <div className="hidden lg:block">
            <div className="sticky top-[calc(50vh-13rem)]">
              <VisualFrame>
                <AnimatePresence mode="wait" initial={false}>
                  <m.div
                    key={active}
                    initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full"
                  >
                    <StageVisual stage={active} />
                  </m.div>
                </AnimatePresence>
              </VisualFrame>
              <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-fg-subtle" aria-live="polite">
                0{active + 1} / 0{a.steps.length} · {a.steps[active].label}
              </p>
            </div>
          </div>
        </div>

        {/* How I approach any problem, compact */}
        <Reveal className="mt-20 md:mt-28">
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-fg-subtle">{a.method.title}</h3>
          <ol className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {a.method.steps.map((m, i) => (
              <li key={m.title} className="bg-ink-900 p-5">
                <p className="font-mono text-xs text-accent">0{i + 1}</p>
                <p className="mt-3 text-base font-semibold tracking-[-0.01em] text-fg">{m.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{m.text}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

function VisualFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-[22rem] overflow-hidden rounded-3xl border border-line-strong bg-ink-900 p-6 sm:h-[26rem]">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

function FlowRail({ steps, active }: { steps: Dictionary["approach"]["steps"]; active: number }) {
  return (
    <ol className="no-scrollbar -mx-5 flex items-stretch overflow-x-auto px-5 md:mx-0 md:px-0">
      {steps.map((step, i) => (
        <li key={step.label} className="flex shrink-0 items-center md:flex-1">
          <span
            className={cn(
              "flex h-full w-36 flex-col rounded-xl border px-3 py-2.5 transition-colors duration-500 md:w-auto md:flex-1",
              i === active ? "border-accent/60 bg-accent/10" : i < active ? "border-line-strong" : "border-line",
            )}
          >
            <span className={cn("font-mono text-[10px] uppercase tracking-[0.16em]", i === active ? "text-accent-soft" : "text-fg-subtle")}>{step.label}</span>
            <span className={cn("mt-1 text-[13px] leading-snug", i <= active ? "text-fg" : "text-fg-muted")}>{step.focus}</span>
          </span>
          {i < steps.length - 1 ? (
            <span aria-hidden className="relative mx-1.5 h-px w-4 shrink-0 bg-line-strong">
              <span className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-700" style={{ width: i < active ? "100%" : "0%" }} />
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
