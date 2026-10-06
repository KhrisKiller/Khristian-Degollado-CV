"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";

/** Where each line of the thread is proven on the page. */
const PROOF_HREF = ["#about", "#experience", "#systems", "#systems", "#dashboard", "#about"];

/**
 * The central identity of the portfolio, read top to bottom:
 * problems → processes → data → systems → information → decisions.
 */
export function Thread() {
  const { t } = useI18n();
  const th = t.thread;
  const [active, setActive] = useState(0);
  const rows = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.row));
        });
      },
      { rootMargin: "-42% 0px -50% 0px" },
    );
    rows.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="work" aria-labelledby="work-title" className="relative border-t border-line py-24 md:py-32">
      <div className="container-page">
        <SectionHeader index="01" eyebrow={th.eyebrow} title={th.title} subtitle={th.subtitle} titleId="work-title" />

        <ol className="mt-14 md:mt-20">
          {th.items.map((item, i) => {
            const on = active === i;
            return (
              <Reveal
                as="li"
                key={item.text}
                delay={i * 60}
                className="border-t border-line last:border-b"
              >
                <a
                  ref={(el) => {
                    rows.current[i] = el;
                  }}
                  data-row={i}
                  href={PROOF_HREF[i]}
                  className="group grid grid-cols-[2.25rem_1fr] items-baseline gap-x-3 py-6 md:grid-cols-[3.5rem_1fr_auto] md:py-7"
                >
                  <span className={cn("font-mono text-xs transition-colors duration-500", on ? "text-accent" : "text-fg-subtle")}>0{i + 1}</span>
                  <span
                    className={cn(
                      "text-balance text-[clamp(1.6rem,3.6vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.035em] transition-colors duration-500 group-hover:text-fg",
                      on ? "text-fg" : "text-fg-subtle",
                    )}
                  >
                    {item.text}
                  </span>
                  <span className="col-start-2 mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 md:col-start-3 md:mt-0 md:flex-col md:items-end md:gap-1 md:text-right">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">{item.label}</span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-sm transition-colors duration-500 group-hover:text-accent-soft",
                        on ? "text-accent-soft" : "text-fg-muted",
                      )}
                    >
                      {item.proof}
                      <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </span>
                </a>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
