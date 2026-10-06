"use client";

import { m } from "framer-motion";
import { Maximize2, Monitor, MousePointerClick, Smartphone, Tablet, X } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Dialog } from "@/components/ui/Dialog";
import { BrowserFrame } from "@/components/ui/Frames";
import { LazyMount } from "@/components/ui/LazyMount";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";
import { AuraDemo, NovaDemo } from "./lazy-demos";

type DemoId = "aura" | "nova";
type Device = "desktop" | "tablet" | "mobile";

const DEMOS: Record<DemoId, { url: string; palette: string[]; mark: string }> = {
  aura: { url: "aura-cafe.mx", palette: ["#f4eee6", "#e3d6c4", "#b4572e", "#7d8b6a", "#2a1d15"], mark: "font-serif tracking-[0.3em] text-2xl" },
  nova: { url: "nova.systems", palette: ["#050505", "#0b0b0b", "#f2f2f2", "#9ecbff", "#d4ff3f"], mark: "font-grotesk font-semibold tracking-[0.18em] text-lg" },
};

const WIDTH: Record<Device, string> = { desktop: "100%", tablet: "820px", mobile: "390px" };
const DEVICE_ICON = { desktop: Monitor, tablet: Tablet, mobile: Smartphone };

export function WebShowcase() {
  const { t } = useI18n();
  const [demo, setDemo] = useState<DemoId>("aura");
  const [device, setDevice] = useState<Device>("desktop");
  const [fullscreen, setFullscreen] = useState(false);
  const copy = t.web.demos[demo];
  const Demo = demo === "aura" ? AuraDemo : NovaDemo;

  return (
    <section id="web" aria-labelledby="web-title" className="relative border-t border-line py-24 md:py-32">
      <div className="container-page">
        <SectionHeader index="02" eyebrow={t.web.eyebrow} title={t.web.title} subtitle={t.web.subtitle} titleId="web-title" />

        {/* Controls */}
        <Reveal className="mt-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div role="tablist" aria-label={t.web.eyebrow} className="grid grid-cols-2 gap-2 sm:flex">
            {(Object.keys(DEMOS) as DemoId[]).map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                id={`web-tab-${id}`}
                aria-selected={demo === id}
                aria-controls="web-panel"
                onClick={() => setDemo(id)}
                className={cn(
                  "relative flex flex-col items-start gap-1 rounded-xl border px-4 py-3 text-left transition-colors sm:min-w-56",
                  demo === id ? "border-line-strong bg-white/[0.04]" : "border-line hover:border-line-strong",
                )}
              >
                {demo === id ? <m.span layoutId="web-tab" className="absolute inset-x-4 -bottom-px h-px bg-accent" /> : null}
                <span className={cn("text-fg", DEMOS[id].mark)}>{id.toUpperCase()}</span>
                <span className="text-xs text-fg-subtle">{t.web.demos[id].tab}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div role="group" aria-label={t.web.viewport} className="hidden rounded-full border border-line p-1 md:flex">
              {(["desktop", "tablet", "mobile"] as Device[]).map((d) => {
                const Icon = DEVICE_ICON[d];
                return (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={device === d}
                    aria-label={t.web.devices[d]}
                    title={t.web.devices[d]}
                    onClick={() => setDevice(d)}
                    className={cn(
                      "relative grid size-8 place-items-center rounded-full transition-colors",
                      device === d ? "text-fg" : "text-fg-subtle hover:text-fg-muted",
                    )}
                  >
                    {device === d ? <m.span layoutId="device-pill" className="absolute inset-0 rounded-full bg-white/10" /> : null}
                    <Icon className="relative size-4" aria-hidden />
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setFullscreen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
            >
              <Maximize2 className="size-4" aria-hidden />
              {t.web.fullscreen}
            </button>
          </div>
        </Reveal>

        {/* Stage */}
        <Reveal delay={80} className="mt-6">
          <div id="web-panel" role="tabpanel" aria-labelledby={`web-tab-${demo}`} className="rounded-3xl border border-line bg-[radial-gradient(ellipse_at_top,rgb(255_255_255/0.04),transparent_70%)] p-2 sm:p-4 md:p-6">
            <div className="mx-auto transition-[max-width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ maxWidth: WIDTH[device] }}>
              <BrowserFrame url={DEMOS[demo].url} label={t.web.demoLabel}>
                <LazyMount className="h-[min(78vh,760px)] min-h-[560px]">
                  <Demo key={demo} />
                </LazyMount>
              </BrowserFrame>
            </div>
          </div>
        </Reveal>

        {/* Design brief */}
        <Reveal delay={120} className="mt-6">
          <dl className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            <BriefItem label={t.web.briefLabels.audience} className="lg:col-span-2">
              {copy.audience}
            </BriefItem>
            <BriefItem label={t.web.briefLabels.type}>{copy.type}</BriefItem>
            <BriefItem label={t.web.briefLabels.palette}>
              <span className="flex gap-1.5">
                {DEMOS[demo].palette.map((c) => (
                  <span key={c} className="size-5 rounded-full ring-1 ring-white/15" style={{ background: c }} title={c} />
                ))}
              </span>
            </BriefItem>
            <BriefItem label={t.web.briefLabels.mood}>{copy.mood}</BriefItem>
          </dl>
          <p className="mt-4 flex items-center gap-2 text-sm text-fg-subtle">
            <MousePointerClick className="size-4 text-accent" aria-hidden />
            <span className="text-fg-muted">{t.web.tryIt}:</span> {copy.tryIt}
          </p>
        </Reveal>
      </div>

      <Dialog open={fullscreen} onClose={() => setFullscreen(false)} label={`${demo.toUpperCase()} — ${t.web.demoLabel}`} variant="fullscreen">
        <div className="flex h-full flex-col p-2 sm:p-4">
          <BrowserFrame
            url={DEMOS[demo].url}
            label={t.web.demoLabel}
            className="flex h-full flex-col"
            actions={
              <button
                type="button"
                onClick={() => setFullscreen(false)}
                aria-label={t.web.exitFullscreen}
                className="grid size-7 place-items-center rounded-full text-fg-muted hover:bg-white/10 hover:text-fg"
              >
                <X className="size-4" aria-hidden />
              </button>
            }
          >
            <div className="relative min-h-0 flex-1">
              <Demo key={`fs-${demo}`} />
            </div>
          </BrowserFrame>
        </div>
      </Dialog>
    </section>
  );
}

function BriefItem({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2 bg-ink-900 p-5", className)}>
      <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">{label}</dt>
      <dd className="text-sm text-fg">{children}</dd>
    </div>
  );
}
