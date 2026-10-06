"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "./LanguageProvider";
import { MotionProvider } from "./MotionProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <MotionProvider>{children}</MotionProvider>
    </LanguageProvider>
  );
}
