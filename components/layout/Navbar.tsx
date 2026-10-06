"use client";

import { m } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Dialog } from "@/components/ui/Dialog";
import { profile } from "@/data/profile";
import { cn } from "@/lib/cn";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { NAV_ITEMS, type NavKey } from "./nav-items";

function useActiveNav(): NavKey | null {
  const [active, setActive] = useState<NavKey | null>(null);

  useEffect(() => {
    const sectionToKey = new Map<string, NavKey>();
    NAV_ITEMS.forEach((item) => item.sections.forEach((s) => sectionToKey.set(s, item.key)));
    const elements = [...sectionToKey.keys()]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
        // Pick the last section (in document order) that crosses the reading line.
        const current = elements.filter((el) => visible.has(el.id)).pop();
        setActive(current ? (sectionToKey.get(current.id) ?? null) : null);
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return active;
}

export function Navbar() {
  const { t, lang } = useI18n();
  const active = useActiveNav();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-3 z-[90] -translate-y-20 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-transform focus:translate-y-0"
      >
        {t.a11y.skip}
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled ? "border-b border-line bg-ink-950/70 backdrop-blur-xl" : "border-b border-transparent",
        )}
      >
        <div className="container-page flex h-16 items-center justify-between gap-6">
          <a href="#top" className="group flex items-center gap-2 font-mono text-[13px] font-medium tracking-[0.14em] text-fg">
            <span
              aria-hidden
              className="grid size-6 place-items-center rounded-md bg-accent text-[10px] font-bold tracking-normal text-accent-ink transition-transform duration-500 group-hover:rotate-90"
            >
              KD
            </span>
            {profile.brand}
          </a>

          <nav aria-label={t.a11y.primaryNav} className="hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    aria-current={active === item.key ? "location" : undefined}
                    className={cn(
                      "relative block rounded-full px-3.5 py-1.5 text-sm transition-colors duration-300",
                      active === item.key ? "text-fg" : "text-fg-muted hover:text-fg",
                    )}
                  >
                    {active === item.key ? (
                      <m.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-full border border-line-strong bg-overlay/[0.05]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                    {t.nav[item.key]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher className="hidden md:flex" />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t.a11y.openMenu}
              aria-expanded={menuOpen}
              className="grid size-10 place-items-center rounded-full border border-line-strong text-fg md:hidden"
            >
              <Menu className="size-[18px]" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <Dialog open={menuOpen} onClose={() => setMenuOpen(false)} label={t.a11y.primaryNav} variant="fullscreen" className="md:hidden">
        <div className="flex h-full flex-col bg-ink-950 px-5 pb-8">
          <div className="flex h-16 items-center justify-between">
            <span className="font-mono text-[13px] tracking-[0.14em] text-fg">{profile.brand}</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label={t.a11y.closeMenu}
              className="grid size-10 place-items-center rounded-full border border-line-strong text-fg"
            >
              <X className="size-[18px]" aria-hidden />
            </button>
          </div>
          <nav aria-label={t.a11y.primaryNav} className="mt-10 flex-1">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item, i) => (
                <m.li
                  key={item.key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-baseline justify-between border-b border-line py-4 text-3xl font-semibold tracking-[-0.03em] text-fg"
                  >
                    {t.nav[item.key]}
                    <span className="font-mono text-xs text-fg-subtle">0{i + 1}</span>
                  </a>
                </m.li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center justify-between">
            <LanguageSwitcher className="text-sm" />
            <a
              href={profile.cv[lang]}
              download
              className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg"
            >
              {t.hero.ctaSecondary}
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </div>
        </div>
      </Dialog>
    </>
  );
}
