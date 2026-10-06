"use client";

import { ArrowDown, ArrowRight, BadgeCheck, Download, MapPin } from "lucide-react";
import type { CSSProperties } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { ButtonLink } from "@/components/ui/Button";
import { profile } from "@/data/profile";
import { SystemFlow } from "./SystemFlow";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Hero() {
  const { t, lang } = useI18n();
  const h = t.hero;

  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      {/* backdrop: engineering grid fading out + one restrained glow */}
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_60%_20%,black,transparent_75%)]" />
      <div aria-hidden className="absolute -right-40 -top-40 -z-10 size-[40rem] rounded-full bg-[radial-gradient(circle,rgb(255_122_69/0.13),transparent_65%)]" />

      <div className="container-page grid items-center gap-14 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:pb-28">
        <div>
          <p className="hero-rise inline-flex items-center gap-2 rounded-full border border-line-strong bg-overlay/[0.03] py-1 pl-2.5 pr-3 text-xs text-fg-muted" style={d(0)}>
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-good/70" aria-hidden />
              <span className="relative inline-flex size-2 rounded-full bg-good" aria-hidden />
            </span>
            {h.status}
          </p>

          <h1 id="hero-title" className="mt-8">
            <span className="hero-rise block" style={d(60)}>
              <span className="block text-2xl font-semibold tracking-[-0.025em] text-fg sm:text-[1.75rem]">{profile.name}</span>
              <span className="mt-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle sm:text-xs">{h.role}</span>
              <span className="mt-1.5 flex items-center gap-1.5 text-[13px] font-normal text-fg-subtle">
                <MapPin className="size-3.5 text-accent/80" aria-hidden />
                {h.location}
              </span>
            </span>
            <span
              className="hero-rise mt-7 block text-balance text-[clamp(2.3rem,5.2vw,3.7rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-fg"
              style={d(140)}
            >
              {h.headlineA}{" "}
              <span className="relative whitespace-nowrap text-accent">
                {h.headlineB}
                <svg aria-hidden viewBox="0 0 300 12" preserveAspectRatio="none" className="absolute -bottom-1 left-0 h-[0.14em] w-full text-accent/50">
                  <path d="M2 9 C 80 2, 200 2, 298 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>{" "}
              {h.headlineC}
            </span>
          </h1>

          <p className="hero-rise mt-7 max-w-xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg" style={d(240)}>
            {h.support}
          </p>

          <div className="hero-rise mt-9 flex flex-wrap items-center gap-3" style={d(320)}>
            <ButtonLink href="#work" size="lg">
              {h.ctaPrimary}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" aria-hidden />
            </ButtonLink>
            <ButtonLink href={profile.cv[lang]} download variant="secondary" size="lg">
              <Download className="size-4" aria-hidden />
              {h.ctaSecondary}
            </ButtonLink>
          </div>

          <div className="hero-rise mt-12 border-t border-line pt-5" style={d(420)}>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">{h.proofTitle}</p>
            <ul className="mt-4 grid gap-4 sm:grid-cols-3 sm:gap-6">
              {h.proof.map((item) => (
                <li key={item.value} className="flex gap-2.5">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                  <span>
                    <span className="block text-sm font-semibold text-fg">{item.value}</span>
                    <span className="mt-0.5 block text-xs leading-snug text-fg-subtle">{item.label}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hero-rise" style={d(260)}>
          <SystemFlow />
        </div>
      </div>

      <a
        href="#work"
        className="hero-rise absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-subtle transition-colors hover:text-fg xl:flex"
        style={d(700)}
      >
        {h.scroll}
        <ArrowDown className="size-3.5 animate-bounce" aria-hidden />
      </a>
    </section>
  );
}
