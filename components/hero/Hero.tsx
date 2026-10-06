"use client";

import { ArrowDown, ArrowRight, Download } from "lucide-react";
import type { CSSProperties } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { ButtonLink } from "@/components/ui/Button";
import { profile } from "@/data/profile";
import { SystemFlow } from "./SystemFlow";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Hero() {
  const { t } = useI18n();

  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      {/* backdrop: engineering grid fading out + one restrained glow */}
      <div
        aria-hidden
        className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_60%_20%,black,transparent_75%)]"
      />
      <div
        aria-hidden
        className="absolute -right-40 -top-40 -z-10 size-[40rem] rounded-full bg-[radial-gradient(circle,rgb(255_122_69/0.13),transparent_65%)]"
      />

      <div className="container-page grid items-center gap-14 pb-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pb-28">
        <div>
          <p className="hero-rise inline-flex items-center gap-2 rounded-full border border-line-strong bg-white/[0.03] py-1 pl-2.5 pr-3 text-xs text-fg-muted" style={d(0)}>
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-good/70" aria-hidden />
              <span className="relative inline-flex size-2 rounded-full bg-good" aria-hidden />
            </span>
            {t.hero.status}
          </p>

          <h1 id="hero-title" className="mt-8">
            <span className="hero-rise block text-lg font-medium tracking-[-0.01em] text-fg-muted sm:text-xl" style={d(60)}>
              {profile.name}
              <span className="mt-1.5 block font-mono text-xs uppercase tracking-[0.18em] text-fg-subtle sm:text-[13px]">{t.hero.eyebrow}</span>
            </span>
            <span
              className="hero-rise mt-5 block text-balance text-[clamp(2.35rem,5.4vw,3.85rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-fg"
              style={d(140)}
            >
              {t.hero.headlineA}{" "}
              <span className="relative whitespace-nowrap text-accent">
                {t.hero.headlineB}
                <svg
                  aria-hidden
                  viewBox="0 0 300 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1 left-0 h-[0.14em] w-full text-accent/50"
                >
                  <path d="M2 9 C 80 2, 200 2, 298 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>{" "}
              {t.hero.headlineC}
            </span>
          </h1>

          <p className="hero-rise mt-7 max-w-xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg" style={d(240)}>
            {t.hero.support}
          </p>

          <div className="hero-rise mt-9 flex flex-wrap items-center gap-3" style={d(320)}>
            <ButtonLink href="#work" size="lg">
              {t.hero.ctaPrimary}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" aria-hidden />
            </ButtonLink>
            <ButtonLink href={profile.cvPath} download variant="secondary" size="lg">
              <Download className="size-4" aria-hidden />
              {t.hero.ctaSecondary}
            </ButtonLink>
          </div>

          <dl className="hero-rise mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-6" style={d(420)}>
            {t.hero.proof.map((item) => (
              <div key={item.label} className="flex flex-col-reverse">
                <dt className="mt-1 text-xs leading-snug text-fg-subtle">{item.label}</dt>
                <dd className="font-mono text-2xl text-fg">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero-rise lg:pl-4" style={d(260)}>
          <SystemFlow />
        </div>
      </div>

      <a
        href="#work"
        className="hero-rise absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-subtle transition-colors hover:text-fg lg:flex"
        style={d(700)}
      >
        {t.hero.scroll}
        <ArrowDown className="size-3.5 animate-bounce" aria-hidden />
      </a>
    </section>
  );
}
