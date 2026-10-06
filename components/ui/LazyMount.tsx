"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { DemoErrorBoundary } from "./ErrorBoundary";

type Props = {
  children: ReactNode;
  /** Classes for the reserved box (set a height so layout doesn't shift). */
  className?: string;
  rootMargin?: string;
};

/**
 * Mounts heavy demos only when they approach the viewport, and isolates
 * failures behind an error boundary.
 */
export function LazyMount({ children, className, rootMargin = "600px 0px" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {visible ? <DemoErrorBoundary className="h-full">{children}</DemoErrorBoundary> : null}
    </div>
  );
}
