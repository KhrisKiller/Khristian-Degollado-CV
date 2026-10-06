"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { useI18n } from "@/components/providers/LanguageProvider";

type Props = { children: ReactNode; className?: string };
type State = { error: Error | null; attempt: number };

/** Keeps a failing demo from taking the rest of the page down. */
export class DemoErrorBoundary extends Component<Props, State> {
  state: State = { error: null, attempt: 0 };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[demo] render failed", error, info.componentStack);
    }
  }

  private retry = () => this.setState((s) => ({ error: null, attempt: s.attempt + 1 }));

  render() {
    if (this.state.error) return <DemoFallback onRetry={this.retry} className={this.props.className} />;
    return <div key={this.state.attempt} className="contents">{this.props.children}</div>;
  }
}

function DemoFallback({ onRetry, className }: { onRetry: () => void; className?: string }) {
  const { t } = useI18n();
  return (
    <div
      role="alert"
      className={
        "flex flex-col items-center justify-center gap-4 rounded-2xl border border-line bg-ink-900 p-10 text-center " +
        (className ?? "")
      }
    >
      <TriangleAlert className="size-6 text-warning" aria-hidden />
      <p className="max-w-sm text-sm text-fg-muted">{t.common.demoError}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm text-fg hover:bg-white/5"
      >
        <RotateCcw className="size-4" aria-hidden />
        {t.common.retry}
      </button>
    </div>
  );
}
