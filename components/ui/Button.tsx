import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[background-color,border-color,color,transform,box-shadow] duration-300 ease-out active:scale-[0.98] select-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-ink hover:bg-accent-soft shadow-[0_0_0_1px_rgb(255_122_69/0.4),0_8px_30px_-8px_rgb(255_122_69/0.55)]",
  secondary: "border border-line-strong bg-overlay/[0.03] text-fg hover:border-overlay/30 hover:bg-overlay/[0.06]",
  ghost: "text-fg-muted hover:text-fg",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[0.95rem]",
};

type Common = { variant?: Variant; size?: Size; children: ReactNode; className?: string };

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

export function ButtonLink({
  variant,
  size,
  className,
  children,
  ...rest
}: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </a>
  );
}

export function Button({
  variant,
  size,
  className,
  children,
  type = "button",
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
