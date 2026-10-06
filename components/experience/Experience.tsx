"use client";

import { AnimatePresence, m } from "framer-motion";
import { ArrowRight, ArrowUpRight, Award, ChevronDown, GraduationCap, Languages } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";

const DEMO_LINKS: Record<string, { href: string; key: "inventory" | "dashboard" | "web" }> = {
  systems: { href: "#systems", key: "inventory" },
  dashboard: { href: "#dashboard", key: "dashboard" },
  web: { href: "#web", key: "web" },
};

export function Experience() {
  const { t } = useI18n();
  const e = t.experience;
  const [open, setOpen] = useState<number | null>(0);

  // Progression: who sits in each stage, oldest to newest.
  const columns = [
    e.items.filter((it) => it.track === 0).reverse().map((it) => ({ name: it.company, period: it.period })),
    [{ name: e.education.degree, period: e.education.period }],
    e.items.filter((it) => it.track === 2).reverse().map((it) => ({ name: it.company, period: it.period })),
  ];

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative border-t border-line py-24 md:py-32">
      <div className="container-page">
        <SectionHeader index="06" eyebrow={e.eyebrow} chapter={e.chapter} title={e.title} subtitle={e.subtitle} titleId="experience-title" />

        {/* Real operations → Engineering → Digital systems */}
        <Reveal className="mt-12">
          <ol className="grid gap-2 sm:grid-cols-3 lg:gap-0">
            {e.progression.map((stage, i) => (
              <li key={stage} className="relative flex items-stretch">
                <div className={cn("flex-1 rounded-2xl border p-5", i === 2 ? "border-accent/40 bg-accent/[0.05]" : "border-line bg-ink-900")}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
                    <span className="text-accent">0{i + 1}</span> · {stage}
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {columns[i].map((c) => (
                      <li key={c.name} className="flex flex-col text-sm xl:flex-row xl:items-baseline xl:justify-between xl:gap-3">
                        <span className="text-fg">{c.name}</span>
                        <span className="shrink-0 font-mono text-[11px] text-fg-subtle">{c.period}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {i < 2 ? (
                  <span aria-hidden className="hidden w-8 shrink-0 items-center justify-center text-fg-subtle lg:flex">
                    <ArrowRight className="size-4" />
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </Reveal>

        {/* Timeline */}
        <ol className="relative mt-16 md:mt-20">
          <span aria-hidden className="absolute bottom-6 left-[7px] top-2 w-px bg-gradient-to-b from-accent/60 via-line-strong to-transparent md:left-[calc(11rem+7px)]" />
          {e.items.map((item, i) => {
            const isOpen = open === i;
            const panelId = `exp-panel-${i}`;
            return (
              <Reveal as="li" key={item.company} delay={i * 60} className="relative grid gap-3 pb-12 pl-8 md:grid-cols-[11rem_1fr] md:gap-10 md:pl-0">
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-fg-subtle md:pr-10 md:pt-2 md:text-right">{item.period}</p>
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-0 top-1 size-[15px] rounded-full border-2 bg-ink-950 md:left-[11rem] md:top-2",
                    item.track === 2 ? "border-accent" : "border-ink-600",
                  )}
                />
                <div className="md:pl-10">
                  <h3 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">{item.company}</h3>
                  <p className="mt-1 text-fg">{item.role}</p>
                  <p className="mt-0.5 text-sm text-fg-subtle">{item.context}</p>

                  {/* What the work actually touched, in order */}
                  <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[13px]">
                    {item.flow.map((f, k) => (
                      <span key={f} className="inline-flex items-center gap-2">
                        {k > 0 ? <ArrowRight className="size-3 text-fg-subtle" aria-hidden /> : null}
                        <span className="rounded-full border border-line px-2.5 py-0.5 text-fg-muted">{f}</span>
                      </span>
                    ))}
                  </p>

                  {item.demos.length ? (
                    <p className="mt-4 text-sm text-fg-subtle">
                      {e.related}:{" "}
                      {item.demos.map((key, k) => (
                        <span key={key}>
                          {k > 0 ? " · " : ""}
                          <a
                            href={DEMO_LINKS[key].href}
                            className="inline-flex items-center gap-0.5 text-fg-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent-soft hover:decoration-accent"
                          >
                            {t.skills.proofLinks[DEMO_LINKS[key].key]}
                            <ArrowUpRight className="size-3" aria-hidden />
                          </a>
                        </span>
                      ))}
                    </p>
                  ) : null}

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
                        <ul className="mt-4 max-w-2xl space-y-2">
                          {item.highlights.map((h) => (
                            <li key={h} className="flex items-start gap-3 text-[15px] leading-relaxed text-fg-muted">
                              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
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

        {/* Education · certifications · languages */}
        <Reveal className="mt-4">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
            <div className="bg-ink-900 p-6">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
                <GraduationCap className="size-3.5 text-accent" aria-hidden />
                {e.education.title}
              </p>
              <p className="mt-3 font-semibold text-fg">{e.education.degree}</p>
              <p className="text-sm text-fg-muted">{e.education.school}</p>
              <p className="mt-2 text-xs text-fg-subtle">
                {e.education.period} · {e.education.note}
              </p>
            </div>
            <div className="bg-ink-900 p-6">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
                <Award className="size-3.5 text-accent" aria-hidden />
                {e.certifications.title}
              </p>
              <ul className="mt-3 space-y-2.5">
                {e.certifications.items.map((c) => (
                  <li key={c.name}>
                    <p className="font-semibold text-fg">{c.name}</p>
                    <p className="text-xs text-fg-subtle">
                      {c.org} · {c.date}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-ink-900 p-6">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
                <Languages className="size-3.5 text-accent" aria-hidden />
                {e.languages.title}
              </p>
              <ul className="mt-3 space-y-1.5">
                {e.languages.items.map((l) => (
                  <li key={l} className="text-fg">
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
