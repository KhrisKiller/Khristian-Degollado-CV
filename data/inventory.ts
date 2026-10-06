import { hashString, mulberry32 } from "@/lib/random";
import type { Product } from "./products";

export type StockStatus = "ok" | "low" | "out";

export function stockStatus(p: Pick<Product, "stock" | "min">): StockStatus {
  if (p.stock <= 0) return "out";
  if (p.stock < p.min) return "low";
  return "ok";
}

export function stockValue(p: Pick<Product, "stock" | "unitCost">) {
  return p.stock * p.unitCost;
}

/** Days of demand the current stock can cover. */
export function coverageDays(p: Pick<Product, "stock" | "dailyUsage">) {
  return p.dailyUsage > 0 ? p.stock / p.dailyUsage : Infinity;
}

/** Order up to twice the minimum, rounded to a full pallet-ish lot of 10. */
export function suggestedReorder(p: Pick<Product, "stock" | "min">) {
  return Math.max(0, Math.ceil((p.min * 2 - p.stock) / 10) * 10);
}

export const HISTORY_DAYS = 30;

/**
 * Plausible 30-day stock history ending at the current stock, walked backwards:
 * daily shipments with noise plus periodic replenishments. Deterministic per SKU.
 */
export function buildHistory(p: Product): number[] {
  const rand = mulberry32(hashString(p.sku));
  const out: number[] = new Array(HISTORY_DAYS);
  let level = p.stock;
  out[HISTORY_DAYS - 1] = level;
  const replenishEvery = 6 + Math.floor(rand() * 4);
  // Stocked-out items had no receipts lately — that's why they're out.
  const quietDays = p.stock === 0 ? 9 : p.stock < p.min ? 5 : 0;
  for (let back = 1; back < HISTORY_DAYS; back++) {
    const shipped = Math.round(p.dailyUsage * (0.55 + rand() * 0.9));
    const received =
      back > quietDays && back % replenishEvery === 0 ? Math.round(p.dailyUsage * (5 + rand() * 4)) : 0;
    // walking backwards: yesterday = today + shipped − received
    level = Math.max(0, level + (level === 0 && back <= quietDays ? Math.round(shipped * 0.3) : shipped) - received);
    out[HISTORY_DAYS - 1 - back] = level;
  }
  return out;
}
