"use client";

import { useI18n } from "@/components/providers/LanguageProvider";
import { LANGS } from "@/lib/i18n";
import { cn } from "@/lib/cn";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div role="group" aria-label={t.a11y.language} className={cn("flex items-center font-mono text-xs", className)}>
      {LANGS.map((code, i) => (
        <span key={code} className="flex items-center">
          {i > 0 ? (
            <span aria-hidden className="px-1.5 text-fg-subtle/60">
              |
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={lang === code}
            title={`${t.a11y.switchTo} ${code === "en" ? "English" : "Español"}`}
            lang={code}
            className={cn(
              "rounded px-1 py-1 uppercase tracking-[0.12em] transition-colors",
              lang === code ? "text-fg" : "text-fg-subtle hover:text-fg-muted",
            )}
          >
            {code}
            <span className="sr-only">{code === "en" ? " English" : " Español"}</span>
          </button>
        </span>
      ))}
    </div>
  );
}
