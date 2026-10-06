import type { Localized } from "@/lib/i18n/types";

export type CategoryId = "mini" | "mega" | "shapes" | "large" | "complements";
export type WarehouseId = "main" | "dc";

export type Product = {
  sku: string;
  name: string;
  variant?: Localized;
  category: CategoryId;
  warehouse: WarehouseId;
  stock: number;
  min: number;
  unitCost: number; // MXN
  /** Average units shipped per day — drives coverage and history. */
  dailyUsage: number;
};

export const categories: Record<CategoryId, Localized> = {
  mini: { en: "Mini line", es: "Línea Mini" },
  mega: { en: "Mega line", es: "Línea Mega" },
  shapes: { en: "Shapes", es: "Figuras" },
  large: { en: "Large format", es: "Gran formato" },
  complements: { en: "Complements", es: "Complementos" },
};

export const warehouses: Record<WarehouseId, Localized> = {
  main: { en: "Main plant", es: "Planta principal" },
  dc: { en: "North DC", es: "CEDIS Norte" },
};

export const products: Product[] = [
  { sku: "MC-012", name: "Mini Color", variant: { en: "Pack of 12", es: "Paquete 12" }, category: "mini", warehouse: "main", stock: 1240, min: 400, unitCost: 18.5, dailyUsage: 62 },
  { sku: "MC-050", name: "Mini Color", variant: { en: "Box of 50", es: "Caja 50" }, category: "mini", warehouse: "dc", stock: 386, min: 150, unitCost: 71, dailyUsage: 14 },
  { sku: "MB-012", name: "Mini Blanca", variant: { en: "Pack of 12", es: "Paquete 12" }, category: "mini", warehouse: "main", stock: 860, min: 400, unitCost: 17.2, dailyUsage: 48 },
  { sku: "MB-050", name: "Mini Blanca", variant: { en: "Box of 50", es: "Caja 50" }, category: "mini", warehouse: "dc", stock: 118, min: 150, unitCost: 66, dailyUsage: 12 },
  { sku: "MN-100", name: "Mega Nacional", category: "mega", warehouse: "main", stock: 540, min: 300, unitCost: 42, dailyUsage: 26 },
  { sku: "MF-100", name: "Mega FDA", category: "mega", warehouse: "main", stock: 120, min: 250, unitCost: 48.5, dailyUsage: 24 },
  { sku: "FL-020", name: "Flor", category: "shapes", warehouse: "main", stock: 0, min: 150, unitCost: 24, dailyUsage: 11 },
  { sku: "CZ-020", name: "Corazón", category: "shapes", warehouse: "main", stock: 690, min: 200, unitCost: 24, dailyUsage: 18 },
  { sku: "AT-200", name: "Atunera", category: "large", warehouse: "dc", stock: 85, min: 60, unitCost: 135, dailyUsage: 4 },
  { sku: "CL-300", name: "Colchón", category: "large", warehouse: "dc", stock: 42, min: 50, unitCost: 210, dailyUsage: 3 },
  { sku: "MN-024", name: "Mega Nacional", variant: { en: "Box of 24", es: "Caja 24" }, category: "mega", warehouse: "dc", stock: 0, min: 40, unitCost: 980, dailyUsage: 2 },
  { sku: "EX-001", name: "Extra", category: "complements", warehouse: "main", stock: 2300, min: 500, unitCost: 9.8, dailyUsage: 85 },
];
