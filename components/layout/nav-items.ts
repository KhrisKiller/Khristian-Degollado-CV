import type { Dictionary } from "@/lib/i18n";

export type NavKey = keyof Pick<Dictionary["nav"], "work" | "systems" | "about" | "experience" | "contact">;

/** Each nav entry and the page sections that count as "inside" it. */
export const NAV_ITEMS: { key: NavKey; href: string; sections: string[] }[] = [
  { key: "work", href: "#work", sections: ["work", "web"] },
  { key: "systems", href: "#systems", sections: ["systems", "dashboard"] },
  { key: "about", href: "#about", sections: ["about"] },
  { key: "experience", href: "#experience", sections: ["experience", "skills"] },
  { key: "contact", href: "#contact", sections: ["cv", "contact"] },
];
