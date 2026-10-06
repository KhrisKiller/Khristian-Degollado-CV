"use client";

import { ArrowUpRight } from "lucide-react";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

const TARGETS = ["#web", "#systems", "#dashboard", "#about"];

export function Capabilities() {
  const { t } = useI18n();
  const visuals = [<WebVisual key="w" />, <SystemVisual key="s" />, <DataVisual key="d" />, <ProcessVisual key="p" />];

  return (
    <section id="work" aria-labelledby="work-title" className="relative py-24 md:py-32">
      <div className="container-page">
        <SectionHeader index="01" eyebrow={t.capabilities.eyebrow} title={t.capabilities.title} subtitle={t.capabilities.subtitle} titleId="work-title" />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 xl:grid-cols-4">
          {t.capabilities.items.map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 80} className="h-full">
              <CapabilityCard
                index={`0${i + 1}`}
                title={item.title}
                description={item.description}
                tags={item.tags}
                href={TARGETS[i]}
                cta={t.capabilities.cta}
                visual={visuals[i]}
              />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

type CardProps = {
  index: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
  cta: string;
  visual: ReactNode;
};

function CapabilityCard({ index, title, description, tags, href, cta, visual }: CardProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <a
      ref={ref}
      href={href}
      onPointerMove={onMove}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-ink-900 p-6 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-line-strong"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(360px circle at var(--mx,50%) var(--my,0%), rgb(255 122 69 / 0.08), transparent 60%)" }}
      />
      <div className="relative flex items-center justify-between">
        <span className="font-mono text-xs text-fg-subtle">{index}</span>
        <ArrowUpRight
          className="size-4 text-fg-subtle transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
          aria-hidden
        />
      </div>

      <div className="relative mt-6 h-28 overflow-hidden rounded-xl border border-line bg-ink-950/60" aria-hidden>
        {visual}
      </div>

      <h3 className="relative mt-6 text-lg font-semibold tracking-[-0.02em] text-fg">{title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-fg-muted">{description}</p>

      <ul className="relative mt-5 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <li key={tag} className="rounded-full border border-line px-2.5 py-1 text-[11px] text-fg-subtle">
            {tag}
          </li>
        ))}
      </ul>

      <span className="relative mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-fg-muted transition-colors group-hover:text-accent-soft">
        {cta}
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </span>
    </a>
  );
}

/* ---- Mini visuals: abstract previews of each demo ---- */

function WebVisual() {
  return (
    <div className="absolute inset-3 flex gap-2">
      <div className="flex flex-1 flex-col gap-1.5 rounded-md bg-[#efe7dc] p-2 transition-transform duration-700 group-hover:-translate-y-1">
        <div className="h-1.5 w-8 rounded-full bg-[#2b1d14]/70" />
        <div className="mt-1 h-2.5 w-[80%] rounded-sm bg-[#2b1d14]/80" />
        <div className="h-2.5 w-[55%] rounded-sm bg-[#b4572e]/80" />
        <div className="mt-auto flex gap-1">
          <div className="h-6 flex-1 rounded-sm bg-[#d9cbb8]" />
          <div className="h-6 flex-1 rounded-sm bg-[#d9cbb8]" />
          <div className="h-6 flex-1 rounded-sm bg-[#d9cbb8]" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 rounded-md bg-black p-2 ring-1 ring-white/10 transition-transform delay-75 duration-700 group-hover:translate-y-1">
        <div className="h-1.5 w-8 rounded-full bg-[#d4ff3f]" />
        <div className="mt-1 h-2.5 w-[85%] rounded-sm bg-white/80" />
        <div className="h-2.5 w-[50%] rounded-sm bg-white/30" />
        <div className="mt-auto flex h-6 items-end gap-0.5">
          {[30, 55, 40, 70, 60, 90, 75].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-[1px] bg-[#d4ff3f]/70" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SystemVisual() {
  const rows = [
    ["MC-012", "bg-good"],
    ["MF-100", "bg-warning"],
    ["FL-020", "bg-critical"],
    ["CZ-020", "bg-good"],
  ];
  return (
    <div className="absolute inset-3 flex gap-2">
      <div className="w-8 rounded-md bg-white/[0.04] p-1.5">
        <div className="h-1.5 rounded-full bg-accent/70" />
        <div className="mt-1.5 h-1.5 rounded-full bg-white/15" />
        <div className="mt-1.5 h-1.5 rounded-full bg-white/15" />
      </div>
      <div className="flex flex-1 flex-col justify-between">
        {rows.map(([sku, dot], i) => (
          <div
            key={sku}
            className="flex items-center gap-2 rounded-md border border-line bg-white/[0.02] px-2 py-1 transition-transform duration-500 group-hover:translate-x-1"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <span className="font-mono text-[9px] text-fg-subtle">{sku}</span>
            <span className="h-1 flex-1 rounded-full bg-white/10" />
            <span className={`size-1.5 rounded-full ${dot}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function DataVisual() {
  const bars = [38, 52, 45, 61, 58, 72, 66, 80, 77, 88];
  return (
    <div className="absolute inset-3 flex flex-col">
      <div className="flex gap-2">
        <div className="h-5 flex-1 rounded-md bg-white/[0.04]" />
        <div className="h-5 flex-1 rounded-md bg-white/[0.04]" />
        <div className="h-5 flex-1 rounded-md border border-accent/30 bg-accent/10" />
      </div>
      <div className="mt-2 flex flex-1 items-end gap-1">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 origin-bottom rounded-t-[2px] bg-series-1/70 transition-transform duration-700 group-hover:scale-y-110"
            style={{ height: `${h}%`, transitionDelay: `${i * 35}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function ProcessVisual() {
  return (
    <svg viewBox="0 0 200 90" className="absolute inset-0 h-full w-full">
      <path
        d="M24 45 H 76 M 124 45 H 176"
        stroke="rgb(255 255 255 / 0.18)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        className="animate-flow"
        fill="none"
      />
      <path d="M100 22 V 12 M100 68 V 78" stroke="rgb(255 255 255 / 0.12)" strokeWidth="1.5" fill="none" />
      {[24, 100, 176].map((x, i) => (
        <g key={x}>
          <rect
            x={x - 16}
            y={29}
            width={32}
            height={32}
            rx={8}
            fill={i === 1 ? "rgb(255 122 69 / 0.14)" : "rgb(255 255 255 / 0.04)"}
            stroke={i === 1 ? "rgb(255 122 69 / 0.6)" : "rgb(255 255 255 / 0.14)"}
          />
          <circle cx={x} cy={45} r={3} fill={i === 1 ? "#ff7a45" : "rgb(255 255 255 / 0.35)"} />
        </g>
      ))}
    </svg>
  );
}
