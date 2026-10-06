import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

type Props = {
  index: string;
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  className?: string;
  titleId?: string;
};

export function SectionHeader({ index, eyebrow, title, subtitle, align = "left", className, titleId }: Props) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <Reveal>
        <p
          className={cn(
            "flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-fg-subtle",
            align === "center" && "justify-center",
          )}
        >
          <span className="text-accent">{index}</span>
          <span aria-hidden className="h-px w-8 bg-line-strong" />
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={60}>
        <h2
          id={titleId}
          className="mt-5 text-balance text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-fg"
        >
          {title}
        </h2>
      </Reveal>
      {subtitle ? (
        <Reveal delay={120}>
          <p className="mt-5 text-pretty text-base leading-relaxed text-fg-muted md:text-lg">{subtitle}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
