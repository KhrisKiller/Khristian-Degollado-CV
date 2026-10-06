import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/cn";

function WindowDots() {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      <span className="size-2.5 rounded-full bg-overlay/15" />
      <span className="size-2.5 rounded-full bg-overlay/15" />
      <span className="size-2.5 rounded-full bg-overlay/15" />
    </div>
  );
}

type BrowserFrameProps = {
  url: string;
  label?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Browser chrome around a website demo. */
export function BrowserFrame({ url, label, actions, children, className }: BrowserFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-line-strong bg-ink-850 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)]",
        className,
      )}
    >
      <div className="flex h-11 items-center gap-3 border-b border-line px-4">
        <WindowDots />
        <div className="mx-auto flex h-7 min-w-0 max-w-sm flex-1 items-center justify-center gap-1.5 rounded-md bg-overlay/[0.04] px-3 font-mono text-[11px] text-fg-subtle">
          <Lock className="size-3 shrink-0" aria-hidden />
          <span className="truncate">{url}</span>
        </div>
        <div className="flex items-center gap-2">
          {label ? (
            <span className="hidden items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-soft sm:inline-flex">
              <span className="size-1.5 rounded-full bg-accent animate-pulse-soft" aria-hidden />
              {label}
            </span>
          ) : null}
          {actions}
        </div>
      </div>
      {children}
    </div>
  );
}

type AppFrameProps = {
  title: string;
  label?: string;
  children: ReactNode;
  className?: string;
};

/** Desktop-app chrome around a system demo. */
export function AppFrame({ title, label, children, className }: AppFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-line-strong bg-ink-900 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)]",
        className,
      )}
    >
      <div className="flex h-10 items-center gap-3 border-b border-line bg-ink-850 px-4">
        <WindowDots />
        <p className="mx-auto truncate font-mono text-[11px] text-fg-subtle">{title}</p>
        {label ? (
          <span className="hidden items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-soft sm:inline-flex">
            <span className="size-1.5 rounded-full bg-accent animate-pulse-soft" aria-hidden />
            {label}
          </span>
        ) : (
          <span className="w-10" aria-hidden />
        )}
      </div>
      {children}
    </div>
  );
}
