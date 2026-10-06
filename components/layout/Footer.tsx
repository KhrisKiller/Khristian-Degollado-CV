"use client";

import { ArrowUp } from "lucide-react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { profile } from "@/data/profile";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-line">
      <div className="container-page flex flex-col gap-10 py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[13px] font-medium tracking-[0.14em] text-fg">{profile.brand}</p>
          <p className="mt-2 text-sm text-fg-muted">{t.footer.tagline}</p>
          <p className="mt-1 text-sm text-fg">{t.signature}</p>
          <p className="mt-6 text-xs text-fg-subtle">{t.footer.built}</p>
        </div>
        <div className="flex flex-col items-start gap-5 md:items-end">
          <div className="flex items-center gap-6">
            <LanguageSwitcher />
            <a href="#top" className="inline-flex items-center gap-1.5 text-xs text-fg-muted transition-colors hover:text-fg">
              {t.footer.top}
              <ArrowUp className="size-3.5" aria-hidden />
            </a>
          </div>
          <p className="text-xs text-fg-subtle">© 2026 {profile.name}</p>
        </div>
      </div>
    </footer>
  );
}
