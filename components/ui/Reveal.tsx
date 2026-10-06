"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

let observer: IntersectionObserver | null = null;

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          observer?.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );
  return observer;
}

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  id?: string;
};

/**
 * Fades content up when it enters the viewport. CSS does the animating;
 * a single shared IntersectionObserver toggles the state.
 */
export function Reveal({ children, as: Tag = "div", delay = 0, className, id }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }
    const io = getObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  return (
    <Tag
      ref={ref}
      id={id}
      data-reveal=""
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
