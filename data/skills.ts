import type { Localized } from "@/lib/i18n/types";

export type ProofKey = "inventory" | "dashboard" | "approach" | "web" | "experience" | "site";

export const PROOF_HREF: Record<ProofKey, string> = {
  inventory: "#systems",
  dashboard: "#dashboard",
  approach: "#about",
  web: "#web",
  experience: "#experience",
  site: "#top",
};

const same = (s: string): Localized => ({ en: s, es: s });

/** Same order as the dictionary's `skills.groups`. Sourced from the CV. */
export const skillGroups: { items: Localized[]; proof: ProofKey[] }[] = [
  {
    items: [
      { en: "Process analysis", es: "Análisis de procesos" },
      { en: "Inventory control", es: "Control de inventarios" },
      { en: "Inventory forecasting", es: "Pronóstico de inventario" },
      { en: "Process documentation", es: "Documentación de procesos" },
      { en: "Continuous improvement", es: "Mejora continua" },
    ],
    proof: ["approach", "experience"],
  },
  {
    items: [
      { en: "Inventory systems (catalog, BOM, movements, valuation)", es: "Sistemas de inventario (catálogo, BOM, movimientos, valuación)" },
      { en: "KPI dashboards", es: "Dashboards de KPIs" },
      { en: "Excel: pivot tables, INDEX/MATCH, SUMIFS, VLOOKUP", es: "Excel: tablas dinámicas, INDEX/MATCH, SUMIFS, BUSCARV" },
      { en: "Data validation & cleanup", es: "Validación y depuración de datos" },
      { en: "Inventory reconciliation", es: "Conciliación de inventario" },
    ],
    proof: ["inventory", "dashboard"],
  },
  {
    items: [same("HTML & CSS"), same("JavaScript"), same("TypeScript"), same("React"), same("Next.js"), same("Tailwind CSS"), same("Python"), same("JSON")],
    proof: ["web", "site"],
  },
  {
    items: [
      { en: "QuickBooks Online (Certified ProAdvisor)", es: "QuickBooks Online (Certified ProAdvisor)" },
      same("Git & GitHub"),
      same("Google Sheets"),
      same("ClickUp"),
    ],
    proof: ["experience", "site"],
  },
];
