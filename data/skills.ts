import type { Localized } from "@/lib/i18n/types";

export type ProofKey = "inventory" | "dashboard" | "approach" | "web" | "site";

export const PROOF_HREF: Record<ProofKey, string> = {
  inventory: "#systems",
  dashboard: "#dashboard",
  approach: "#about",
  web: "#web",
  site: "#top",
};

/** Same order as the dictionary's `skills.groups`. */
export const skillGroups: { items: Localized[]; proof: ProofKey[] }[] = [
  {
    items: [
      { en: "Process Analysis", es: "Análisis de procesos" },
      { en: "Inventory Management", es: "Gestión de inventarios" },
      { en: "Operations", es: "Operaciones" },
      { en: "Continuous Improvement", es: "Mejora continua" },
    ],
    proof: ["approach", "inventory"],
  },
  {
    items: [
      { en: "Excel", es: "Excel" },
      { en: "Dashboards", es: "Dashboards" },
      { en: "Data Visualization", es: "Visualización de datos" },
      { en: "Business Systems", es: "Sistemas de negocio" },
    ],
    proof: ["dashboard", "inventory"],
  },
  {
    items: [
      { en: "React", es: "React" },
      { en: "Next.js", es: "Next.js" },
      { en: "TypeScript", es: "TypeScript" },
      { en: "JavaScript", es: "JavaScript" },
      { en: "Tailwind CSS", es: "Tailwind CSS" },
    ],
    proof: ["web", "site"],
  },
  {
    items: [
      { en: "Git", es: "Git" },
      { en: "GitHub", es: "GitHub" },
      { en: "Vercel", es: "Vercel" },
      { en: "QuickBooks", es: "QuickBooks" },
      { en: "ClickUp", es: "ClickUp" },
    ],
    proof: ["site"],
  },
];
