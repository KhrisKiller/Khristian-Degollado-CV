"use client";

import { Check, MousePointerClick } from "lucide-react";
import type { ReactNode } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { AppFrame } from "@/components/ui/Frames";
import { LazyMount } from "@/components/ui/LazyMount";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DashboardDemo, InventoryDemo } from "./lazy-demos";

type BlockProps = {
  id?: string;
  title: string;
  subtitle: string;
  points: string[];
  hint: string;
  windowTitle: string;
  children: ReactNode;
};

function SystemBlock({ id, title, subtitle, points, hint, windowTitle, children }: BlockProps) {
  const { t } = useI18n();
  return (
    <div id={id} className="scroll-mt-20">
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
        <Reveal>
          <h3 className="text-balance text-[clamp(1.6rem,3vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em]">{title}</h3>
          <p className="mt-3 max-w-lg text-pretty text-fg-muted">{subtitle}</p>
        </Reveal>
        <Reveal delay={80}>
          <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {points.map((p) => (
              <li key={p} className="flex gap-2.5 text-sm text-fg-muted">
                <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
      <Reveal delay={120} className="mt-8">
        <AppFrame title={windowTitle} label={t.web.demoLabel}>
          <LazyMount className="h-[min(84vh,760px)] min-h-[620px]">{children}</LazyMount>
        </AppFrame>
        <p className="mt-4 flex items-center gap-2 text-sm text-fg-subtle">
          <MousePointerClick className="size-4 shrink-0 text-accent" aria-hidden />
          {hint}
        </p>
      </Reveal>
    </div>
  );
}

export function SystemsShowcase() {
  const { t } = useI18n();
  const s = t.systems;
  return (
    <section id="systems" aria-labelledby="systems-title" className="relative border-t border-line py-24 md:py-32">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-96 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="container-page relative">
        <SectionHeader index="03" eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} titleId="systems-title" />
        <div className="mt-16">
          <SystemBlock
            title={s.inventory.title}
            subtitle={s.inventory.subtitle}
            points={s.inventory.points}
            hint={s.inventory.hint}
            windowTitle={`${t.inventory.appName} — ${t.inventory.workspace}`}
          >
            <InventoryDemo />
          </SystemBlock>
        </div>
      </div>
    </section>
  );
}

export function DataShowcase() {
  const { t } = useI18n();
  const s = t.systems;
  return (
    <section id="dashboard" aria-labelledby="dashboard-title" className="relative border-t border-line py-24 md:py-32">
      <div className="container-page">
        <SectionHeader index="04" eyebrow={s.dataEyebrow} title={s.dashboard.title} subtitle={s.dashboard.subtitle} titleId="dashboard-title" />
        <div className="mt-12">
          <SystemBlock
            title={t.dashboard.company}
            subtitle={s.dashboard.context}
            points={s.dashboard.points}
            hint={s.dashboard.hint}
            windowTitle={`${t.dashboard.company} — ${t.dashboard.title}`}
          >
            <DashboardDemo />
          </SystemBlock>
        </div>
      </div>
    </section>
  );
}
