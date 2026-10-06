"use client";

import { AnimatePresence, m } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";

export function Experience() {
  const { t } = useI18n();
  const e = t.experience;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative border-t border-line py-24 md:py-32">
      <div className="container-page">
        <SectionHeader index="06" eyebrow={e.eyebrow} title={e.title} subtitle={e.subtitle} titleId="experience-title" />

        <ol className="relative mt-14 md:mt-20">
          <span aria-hidden className="absolute bottom-6 left-[7px] top-2 w-px bg-gradient-to-b from-accent/60 via-line-strong to-transparent md:left-[calc(11rem+7px)]" />
          {e.items.map((item, i) => {
            const isOpen = open === i;
            const panelId = `exp-panel-${i}`;
            return (
              <Reveal as="li" key={item.company} delay={i * 80} className="relative grid gap-3 pb-12 pl-8 md:grid-cols-[11rem_1fr] md:gap-10 md:pl-0">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-fg-subtle md:pt-1.5 md:text-right md:pr-10">{item.period}</p>
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-0 top-1 size-[15px] rounded-full border-2 bg-ink-950 transition-colors md:left-[11rem] md:top-1.5",
                    i === 0 ? "border-accent" : "border-ink-600",
                  )}
                />
                <div className="md:pl-10">
                  <h3 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">{item.company}</h3>
                  <p className="mt-1 text-fg-muted">{item.role}</p>
                  <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-fg-muted">{item.summary}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={e.focus}>
                    {item.tags.map((tag) => (
                      <li key={tag} className="rounded-full border border-line px-2.5 py-1 text-[11px] text-fg-subtle">
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
                  >
                    {isOpen ? e.hide : e.show}
                    <ChevronDown className={cn("size-4 transition-transform duration-300", isOpen && "rotate-180")} aria-hidden />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <m.div
                        id={panelId}
                        key="panel"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <ul className="mt-4 grid max-w-2xl gap-2 sm:grid-cols-2">
                          {item.highlights.map((h) => (
                            <li key={h} className="flex items-start gap-2.5 rounded-xl border border-line bg-ink-900 px-3.5 py-3 text-sm text-fg">
                              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                              {h}
                            </li>
                          ))}
                        </ul>
                      </m.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
