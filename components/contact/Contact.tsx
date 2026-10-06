"use client";

import { ArrowUpRight, Check, Copy, Mail, MapPin, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { buttonClasses } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { profile, whatsappHref } from "@/data/profile";

export function Contact() {
  const { t } = useI18n();
  const c = t.contact;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard blocked: the address stays visible and selectable.
    }
  };

  const links = [
    { href: `mailto:${profile.email}`, label: c.email, icon: <Mail className="size-4" aria-hidden />, primary: true, external: false },
    { href: whatsappHref(c.whatsappMessage), label: c.whatsapp, icon: <MessageCircle className="size-4" aria-hidden />, primary: false, external: true },
    { href: profile.linkedin, label: c.linkedin, icon: <LinkedInIcon className="size-4" />, primary: false, external: true },
    { href: profile.github, label: c.github, icon: <GitHubIcon className="size-4" />, primary: false, external: true },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden border-t border-line py-28 md:py-40">
      <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_100%,black,transparent_75%)]" />
      <div aria-hidden className="absolute inset-x-0 -bottom-48 mx-auto h-96 max-w-3xl rounded-full bg-[radial-gradient(closest-side,rgb(255_122_69/0.16),transparent)]" />
      <div className="container-page relative text-center">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-fg-subtle">
            <span className="text-accent">08</span> · {c.eyebrow}
          </p>
        </Reveal>
        <Reveal delay={60}>
          <h2 id="contact-title" className="mx-auto mt-6 max-w-4xl text-balance text-[clamp(2.4rem,6.5vw,5rem)] font-semibold leading-[1] tracking-[-0.045em]">
            {c.titleA} <span className="text-fg-subtle md:block">{c.titleB}</span>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-fg-muted md:text-lg">{c.text}</p>
        </Reveal>
        <Reveal delay={180} className="mt-10 flex flex-wrap justify-center gap-3">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={buttonClasses(link.primary ? "primary" : "secondary", "lg")}
            >
              {link.icon}
              {link.label}
              {link.external ? <ArrowUpRight className="size-3.5 opacity-60" aria-hidden /> : null}
            </a>
          ))}
        </Reveal>
        <Reveal delay={240} className="mt-8 flex flex-col items-center gap-3 text-sm text-fg-muted sm:flex-row sm:justify-center sm:gap-6">
          <span className="inline-flex items-center gap-2">
            <span className="select-all font-mono text-[13px] text-fg">{profile.email}</span>
            <button
              type="button"
              onClick={copy}
              className="grid size-7 place-items-center rounded-md border border-line text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
              aria-label={c.copy}
              title={c.copy}
            >
              {copied ? <Check className="size-3.5 text-good" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
            </button>
            <span role="status" className="sr-only">
              {copied ? c.copied : ""}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5 text-accent" aria-hidden />
            {c.location}
          </span>
        </Reveal>
        <Reveal delay={300}>
          <p className="mt-14 font-mono text-xs uppercase tracking-[0.24em] text-fg-subtle">{t.signature}</p>
        </Reveal>
      </div>
    </section>
  );
}
