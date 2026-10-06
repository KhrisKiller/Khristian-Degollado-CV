"use client";

import { LazyMotion, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

// Animation features are code-split and fetched after first paint.
const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures}>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
