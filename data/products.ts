import type { Localized } from "@/lib/i18n/types";

export type CategoryId = "raw" | "packaging" | "finished";
export type WarehouseId = "main" | "dc";

export type Product = {
  sku: string;
  name: Localized;
  variant?: Localized;
  category: CategoryId;
  warehouse: WarehouseId;
  stock: number;
  min: number;
  unitCost: number; // MXN
  /** Average units consumed or shipped per day — drives coverage and history. */
  dailyUsage: number;
};

export const categories: Record<CategoryId, Localized> = {
  raw: { en: "Raw materials", es: "Materia prima" },
  packaging: { en: "Packaging", es: "Empaque" },
  finished: { en: "Finished goods", es: "Producto terminado" },
};

export const warehouses: Record<WarehouseId, Localized> = {
  main: { en: "Main plant", es: "Planta principal" },
  dc: { en: "Distribution center", es: "Centro de distribución" },
};

/** Fictional granola and oat-bar manufacturer. */
export const products: Product[] = [
  { sku: "MP-101", name: { en: "Rolled oats", es: "Avena en hojuela" }, variant: { en: "25 kg sack", es: "Saco 25 kg" }, category: "raw", warehouse: "main", stock: 64, min: 30, unitCost: 420, dailyUsage: 3.5 },
  { sku: "MP-102", name: { en: "Honey", es: "Miel de abeja" }, variant: { en: "20 L pail", es: "Cubeta 20 L" }, category: "raw", warehouse: "main", stock: 9, min: 12, unitCost: 1850, dailyUsage: 1.2 },
  { sku: "MP-103", name: { en: "Almonds", es: "Almendra" }, variant: { en: "10 kg box", es: "Caja 10 kg" }, category: "raw", warehouse: "main", stock: 0, min: 8, unitCost: 2400, dailyUsage: 0.9 },
  { sku: "MP-104", name: { en: "Cocoa powder", es: "Cacao en polvo" }, variant: { en: "5 kg bag", es: "Bolsa 5 kg" }, category: "raw", warehouse: "main", stock: 22, min: 10, unitCost: 760, dailyUsage: 1 },
  { sku: "EM-201", name: { en: "Stand-up pouch", es: "Bolsa stand-up" }, variant: { en: "500 g", es: "500 g" }, category: "packaging", warehouse: "main", stock: 4800, min: 2000, unitCost: 3.2, dailyUsage: 260 },
  { sku: "EM-202", name: { en: "Bar wrapper film", es: "Película para barra" }, variant: { en: "Roll", es: "Rollo" }, category: "packaging", warehouse: "main", stock: 14, min: 20, unitCost: 950, dailyUsage: 1.6 },
  { sku: "EM-203", name: { en: "Shipping box", es: "Caja de embarque" }, variant: { en: "24 units", es: "24 piezas" }, category: "packaging", warehouse: "dc", stock: 610, min: 300, unitCost: 11, dailyUsage: 38 },
  { sku: "PT-301", name: { en: "Classic granola", es: "Granola clásica" }, variant: { en: "500 g", es: "500 g" }, category: "finished", warehouse: "dc", stock: 1240, min: 400, unitCost: 38, dailyUsage: 62 },
  { sku: "PT-302", name: { en: "Cocoa granola", es: "Granola de cacao" }, variant: { en: "500 g", es: "500 g" }, category: "finished", warehouse: "dc", stock: 120, min: 250, unitCost: 41, dailyUsage: 24 },
  { sku: "PT-303", name: { en: "Honey oat bar", es: "Barra de avena con miel" }, variant: { en: "Box of 12", es: "Caja 12" }, category: "finished", warehouse: "dc", stock: 0, min: 150, unitCost: 96, dailyUsage: 11 },
  { sku: "PT-304", name: { en: "Cocoa oat bar", es: "Barra de avena con cacao" }, variant: { en: "Box of 12", es: "Caja 12" }, category: "finished", warehouse: "dc", stock: 690, min: 200, unitCost: 98, dailyUsage: 18 },
  { sku: "PT-305", name: { en: "Granola sampler", es: "Surtido de granola" }, variant: { en: "Box of 6", es: "Caja 6" }, category: "finished", warehouse: "dc", stock: 85, min: 60, unitCost: 210, dailyUsage: 4 },
];
