"use client";

import { useI18n } from "@/components/providers/LanguageProvider";

/** Quiet loading state shown while a demo's code chunk downloads. */
export function DemoLoading() {
  const { t } = useI18n();
  return (
    <div className="flex h-full min-h-[inherit] w-full items-center justify-center" role="status">
      <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-fg-subtle">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent/60" />
          <span className="relative inline-flex size-2 rounded-full bg-accent" />
        </span>
        {t.common.loadingDemo}
      </div>
    </div>
  );
}
