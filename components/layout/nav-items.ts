import type { Dictionary } from "@/lib/i18n";

export type NavKey = keyof Pick<Dictionary["nav"], "systems" | "approach" | "web" | "experience" | "contact">;

/** Each nav entry and the page sections that count as "inside" it (in page order). */
export const NAV_ITEMS: { key: NavKey; href: string; sections: string[] }[] = [
  { key: "systems", href: "#systems", sections: ["systems", "dashboard"] },
  { key: "approach", href: "#about", sections: ["about"] },
  { key: "web", href: "#web", sections: ["web"] },
  { key: "experience", href: "#experience", sections: ["experience", "skills"] },
  { key: "contact", href: "#contact", sections: ["cv", "contact"] },
];
