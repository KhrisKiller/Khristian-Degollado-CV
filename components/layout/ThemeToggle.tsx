"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/cn";
import { getServerThemeSnapshot, getThemeSnapshot, setTheme, subscribeTheme } from "@/lib/theme";

export function ThemeToggle({ className }: { className?: string }) {
  const { t } = useI18n();
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);
  const next = theme === "dark" ? "light" : "dark";
  const label = next === "light" ? t.a11y.themeLight : t.a11y.themeDark;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={label}
      title={label}
      className={cn(
        "grid size-9 place-items-center rounded-full border border-line-strong text-fg-muted transition-colors hover:border-overlay/30 hover:text-fg",
        className,
      )}
    >
      {theme === "dark" ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
    </button>
  );
}
