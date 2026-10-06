"use client";

import { Download, FileText } from "lucide-react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { profile } from "@/data/profile";

export function CvCta() {
  const { t, lang } = useI18n();
  const other = lang === "en" ? "es" : "en";
  return (
    <section id="cv" aria-labelledby="cv-title" className="border-t border-line py-20 md:py-28">
      <div className="container-page">
        <Reveal className="relative grid items-center gap-10 overflow-hidden rounded-3xl border border-line-strong bg-ink-900 p-8 md:grid-cols-[1fr_auto] md:p-12">
          <div aria-hidden className="absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(circle,rgb(255_122_69/0.14),transparent_70%)]" />
          <div className="relative">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-fg-subtle">{t.cv.eyebrow}</p>
            <h2 id="cv-title" className="mt-4 text-balance text-[clamp(1.75rem,3.4vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.035em]">
              {t.cv.title}
            </h2>
            <p className="mt-3 max-w-lg text-fg-muted">{t.cv.text}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href={profile.cv[lang]} download size="lg">
                <Download className="size-4" aria-hidden />
                {t.cv[lang]}
              </ButtonLink>
              <ButtonLink href={profile.cv[other]} download variant="secondary" size="lg" lang={other}>
                <Download className="size-4" aria-hidden />
                {t.cv[other]}
              </ButtonLink>
            </div>
            <p className="mt-4 font-mono text-xs text-fg-subtle">{t.cv.meta}</p>
          </div>
          {/* Document preview */}
          <div aria-hidden className="relative mx-auto hidden w-48 rotate-3 rounded-xl border border-line-strong bg-ink-800 p-5 shadow-2xl transition-transform duration-700 hover:rotate-0 md:block">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-md bg-accent text-[10px] font-bold text-accent-ink">KD</span>
              <div className="space-y-1">
                <div className="h-1.5 w-20 rounded-full bg-fg/70" />
                <div className="h-1 w-14 rounded-full bg-fg/25" />
              </div>
            </div>
            <div className="mt-5 space-y-1.5">
              {[100, 92, 96, 70].map((w, i) => (
                <div key={i} className="h-1 rounded-full bg-fg/15" style={{ width: `${w}%` }} />
              ))}
            </div>
            <div className="mt-4 h-1.5 w-16 rounded-full bg-accent/70" />
            <div className="mt-2 space-y-1.5">
              {[95, 88, 76, 90, 60].map((w, i) => (
                <div key={i} className="h-1 rounded-full bg-fg/15" style={{ width: `${w}%` }} />
              ))}
            </div>
            <FileText className="absolute bottom-4 right-4 size-4 text-fg-subtle" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
