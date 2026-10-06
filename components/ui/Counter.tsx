"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  format: (n: number) => string;
  duration?: number;
  className?: string;
};

/**
 * Counts up to `value` the first time it scrolls into view and animates
 * between values afterwards (e.g. when a dashboard filter changes).
 */
export function Counter({ value, format, duration = 1.1, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const current = useRef(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(current.current, value, {
      duration: reduce ? 0 : duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        current.current = v;
        setDisplay(v);
      },
    });
    return () => controls.stop();
  }, [value, inView, reduce, duration]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden>{format(display)}</span>
      <span className="sr-only">{format(value)}</span>
    </span>
  );
}
