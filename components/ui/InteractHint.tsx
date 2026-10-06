"use client";

import { AnimatePresence, m } from "framer-motion";
import { MousePointerClick } from "lucide-react";
import { useState, type ReactNode } from "react";

/**
 * A quiet "this is live" cue floating over a demo. It disappears the moment
 * the visitor interacts with the demo, so it never gets in the way.
 */
export function InteractHint({ label, children }: { label: string; children: ReactNode }) {
  const [dismissed, setDismissed] = useState(false);
  const dismiss = () => setDismissed(true);

  return (
    <div className="relative h-full" onPointerDownCapture={dismiss} onWheelCapture={dismiss} onKeyDownCapture={dismiss}>
      {children}
      <AnimatePresence>
        {dismissed ? null : (
          <m.div
            aria-hidden
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 1.2, duration: 0.5 } }}
            exit={{ opacity: 0, y: 6, transition: { duration: 0.25 } }}
            className="pointer-events-none absolute bottom-5 left-1/2 z-[70] -translate-x-1/2"
          >
            <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-[#0b0c0f]/85 px-3.5 py-2 text-xs text-[#eceef1] shadow-[0_12px_40px_-8px_rgb(0_0_0/0.7)] backdrop-blur-md">
              <MousePointerClick className="size-3.5 animate-pulse-soft text-[#ff9b72]" />
              {label}
            </span>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
