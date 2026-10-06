export type MovementType = "inbound" | "outbound" | "adjustment" | "production";

export type SeedMovement = {
  sku: string;
  type: MovementType;
  /** Signed change in stock. */
  qty: number;
  daysAgo: number;
  hour: number;
  ref: string;
  user: string;
};

export type Movement = Omit<SeedMovement, "daysAgo" | "hour"> & {
  id: string;
  date: Date;
  /** Stock after the movement was applied. */
  balance: number;
};

export const MOVEMENT_TYPES: MovementType[] = ["inbound", "outbound", "adjustment", "production"];

/** Recent operational log — newest first. */
export const seedMovements: SeedMovement[] = [
  { sku: "PT-301", type: "outbound", qty: -96, daysAgo: 0, hour: 11, ref: "SO-1938", user: "M. López" },
  { sku: "EM-201", type: "inbound", qty: 2400, daysAgo: 0, hour: 9, ref: "PO-4830", user: "J. Pérez" },
  { sku: "PT-302", type: "outbound", qty: -60, daysAgo: 0, hour: 8, ref: "SO-1937", user: "M. López" },
  { sku: "PT-303", type: "outbound", qty: -24, daysAgo: 1, hour: 16, ref: "SO-1931", user: "J. Pérez" },
  { sku: "PT-304", type: "production", qty: 240, daysAgo: 1, hour: 13, ref: "MO-0219", user: "A. Ruiz" },
  { sku: "MP-102", type: "adjustment", qty: -2, daysAgo: 1, hour: 10, ref: "CC-041", user: "K. Degollado" },
  { sku: "MP-101", type: "inbound", qty: 40, daysAgo: 2, hour: 15, ref: "PO-4821", user: "J. Pérez" },
  { sku: "EM-203", type: "outbound", qty: -40, daysAgo: 2, hour: 12, ref: "SO-1926", user: "M. López" },
  { sku: "PT-305", type: "outbound", qty: -18, daysAgo: 2, hour: 9, ref: "SO-1924", user: "M. López" },
  { sku: "MP-103", type: "outbound", qty: -4, daysAgo: 3, hour: 17, ref: "MO-0217", user: "A. Ruiz" },
  { sku: "PT-301", type: "production", qty: 480, daysAgo: 3, hour: 11, ref: "MO-0216", user: "A. Ruiz" },
  { sku: "EM-202", type: "outbound", qty: -3, daysAgo: 3, hour: 8, ref: "MO-0215", user: "A. Ruiz" },
  { sku: "MP-104", type: "inbound", qty: 10, daysAgo: 4, hour: 14, ref: "PO-4807", user: "J. Pérez" },
  { sku: "PT-302", type: "outbound", qty: -72, daysAgo: 4, hour: 10, ref: "SO-1911", user: "M. López" },
  { sku: "PT-301", type: "outbound", qty: -210, daysAgo: 5, hour: 16, ref: "SO-1904", user: "M. López" },
  { sku: "PT-304", type: "outbound", qty: -54, daysAgo: 5, hour: 12, ref: "SO-1902", user: "J. Pérez" },
  { sku: "PT-303", type: "adjustment", qty: -12, daysAgo: 6, hour: 18, ref: "CC-040", user: "K. Degollado" },
  { sku: "MP-101", type: "outbound", qty: -22, daysAgo: 6, hour: 11, ref: "MO-0211", user: "A. Ruiz" },
  { sku: "PT-302", type: "production", qty: 120, daysAgo: 7, hour: 15, ref: "MO-0208", user: "A. Ruiz" },
  { sku: "EM-203", type: "inbound", qty: 300, daysAgo: 8, hour: 9, ref: "PO-4795", user: "J. Pérez" },
  { sku: "MP-102", type: "inbound", qty: 6, daysAgo: 9, hour: 13, ref: "PO-4788", user: "J. Pérez" },
];

/** Attach ids, dates and running balances (walking back from current stock). */
export function hydrateMovements(seed: SeedMovement[], stockBySku: Record<string, number>, now: Date): Movement[] {
  const running = { ...stockBySku };
  return seed.map((s, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - s.daysAgo);
    date.setHours(s.hour, (i * 17) % 60, 0, 0);
    // Keep "today" entries in the past regardless of the visitor's clock.
    if (date > now) date.setTime(now.getTime() - (i + 1) * 11 * 60_000);
    const balance = running[s.sku] ?? 0;
    running[s.sku] = balance - s.qty;
    return { id: `m-${i}`, sku: s.sku, type: s.type, qty: s.qty, ref: s.ref, user: s.user, date, balance };
  });
}
