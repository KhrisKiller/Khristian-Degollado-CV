"use client";

import { AnimatePresence, m } from "framer-motion";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

// Only the top-most dialog reacts to Escape / Tab when dialogs are nested.
const stack: string[] = [];

type DialogProps = {
  open: boolean;
  onClose: () => void;
  /** id of the element that names the dialog */
  labelledBy?: string;
  label?: string;
  variant?: "center" | "drawer" | "fullscreen";
  /** Render inside the nearest positioned ancestor instead of the page. */
  contained?: boolean;
  className?: string;
  children: ReactNode;
};

export function Dialog(props: DialogProps) {
  const { open, contained } = props;
  const content = <AnimatePresence>{open ? <DialogInner key="dialog" {...props} /> : null}</AnimatePresence>;
  if (contained) return content;
  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
}

function DialogInner({ onClose, labelledBy, label, variant = "center", contained, className, children }: DialogProps) {
  const id = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    stack.push(id);
    const previous = document.activeElement as HTMLElement | null;

    const getFocusable = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);

    const raf = requestAnimationFrame(() => {
      const target = panel.querySelector<HTMLElement>("[data-autofocus]") ?? getFocusable()[0] ?? panel;
      target.focus({ preventScroll: true });
    });

    const onKey = (e: KeyboardEvent) => {
      if (stack[stack.length - 1] !== id) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const items = getFocusable();
      if (!items.length) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    if (!contained) document.body.style.overflow = "hidden";

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      const idx = stack.lastIndexOf(id);
      if (idx >= 0) stack.splice(idx, 1);
      if (!contained) document.body.style.overflow = prevOverflow;
      if (previous && document.contains(previous)) previous.focus({ preventScroll: true });
    };
  }, [id, contained]);

  const position = contained ? "absolute" : "fixed";

  const panelMotion =
    variant === "drawer"
      ? { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } }
      : variant === "fullscreen"
        ? { initial: { opacity: 0, scale: 0.98 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.98 } }
        : { initial: { opacity: 0, y: 16, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 8, scale: 0.98 } };

  return (
    <div className={cn(position, "inset-0 z-[80] flex", variant === "drawer" ? "justify-end" : "items-center justify-center p-3 sm:p-6")}>
      <m.div
        aria-hidden
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={() => onCloseRef.current()}
      />
      <m.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : label}
        tabIndex={-1}
        {...panelMotion}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "relative outline-none",
          variant === "drawer" && "h-full w-full max-w-[26rem] overflow-y-auto scrollbar-thin",
          variant === "center" && "max-h-full w-full max-w-md overflow-y-auto scrollbar-thin",
          variant === "fullscreen" && "h-full w-full",
          className,
        )}
      >
        {children}
      </m.div>
    </div>
  );
}
