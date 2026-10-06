"use client";

import { BellRing, Check, MousePointerClick } from "lucide-react";
import type { ReactNode } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { AppFrame } from "@/components/ui/Frames";
import { InteractHint } from "@/components/ui/InteractHint";
import { LazyMount } from "@/components/ui/LazyMount";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";
import { DashboardDemo, InventoryDemo } from "./lazy-demos";

function DemoStage({ windowTitle, hint, children }: { windowTitle: string; hint: string; children: ReactNode }) {
  const { t } = useI18n();
  return (
    <Reveal delay={120} className="mt-10">
      <AppFrame title={windowTitle} label={t.liveDemo}>
        <LazyMount className="h-[min(84vh,760px)] min-h-[620px]">
          <InteractHint label={t.web.tryOverlay}>{children}</InteractHint>
        </LazyMount>
      </AppFrame>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-sm text-fg-muted">
          <MousePointerClick className="size-4 shrink-0 text-accent" aria-hidden />
          {hint}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">{t.builtToDemonstrate}</p>
      </div>
    </Reveal>
  );
}

const EFFECT_STYLE: Record<string, string> = {
  "+": "border-good/30 bg-good/10 text-good",
  "−": "border-line-strong bg-white/[0.04] text-fg",
  "=": "border-accent/30 bg-accent/10 text-accent-soft",
};

export function SystemsShowcase() {
  const { t } = useI18n();
  const s = t.systems;
  return (
    <section id="systems" aria-labelledby="systems-title" className="relative border-t border-line py-24 md:py-32">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-96 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="container-page relative">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <SectionHeader index="02" eyebrow={s.eyebrow} chapter={s.chapter} title={s.title} subtitle={s.subtitle} titleId="systems-title" />

          {/* How stock moves: the operational model behind the interface */}
          <Reveal delay={100}>
            <figure className="rounded-2xl border border-line bg-ink-900 p-5">
              <figcaption className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">{s.model.title}</figcaption>
              <ul className="mt-4 divide-y divide-line">
                {s.model.flows.map((f) => (
                  <li key={f.type} className="flex items-center gap-3 py-2.5 text-sm">
                    <span
                      className={cn("grid size-7 shrink-0 place-items-center rounded-md border font-mono text-sm", EFFECT_STYLE[f.effect])}
                      aria-hidden
                    >
                      {f.effect}
                    </span>
                    <span className="flex-1 text-fg-muted">{f.event}</span>
                    <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-fg">{f.type}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex gap-2.5 rounded-xl border border-warning/25 bg-warning/[0.06] p-3 text-[13px] leading-relaxed text-fg">
                <BellRing className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
                {s.model.rule}
              </p>
            </figure>
          </Reveal>
        </div>

        <DemoStage windowTitle={`${t.inventory.appName} · ${t.inventory.workspace}`} hint={s.hint}>
          <InventoryDemo />
        </DemoStage>
      </div>
    </section>
  );
}

export function DataShowcase() {
  const { t } = useI18n();
  const s = t.dashboardSection;
  return (
    <section id="dashboard" aria-labelledby="dashboard-title" className="relative border-t border-line py-24 md:py-32">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <SectionHeader index="03" eyebrow={s.eyebrow} chapter={s.chapter} title={s.title} subtitle={s.subtitle} titleId="dashboard-title" />
          <Reveal delay={100}>
            <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {s.points.map((p) => (
                <li key={p} className="flex gap-2.5 text-sm text-fg-muted">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <DemoStage windowTitle={`${t.dashboard.company} · ${t.dashboard.title}`} hint={s.hint}>
          <DashboardDemo />
        </DemoStage>
      </div>
    </section>
  );
}
