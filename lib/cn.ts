type ClassValue = string | false | null | undefined | 0;

/** Minimal className joiner — avoids pulling in clsx/tailwind-merge. */
export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}
