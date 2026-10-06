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
  { sku: "MC-012", type: "outbound", qty: -96, daysAgo: 0, hour: 11, ref: "SO-1938", user: "M. López" },
  { sku: "EX-001", type: "production", qty: 400, daysAgo: 0, hour: 9, ref: "PO-0221", user: "A. Ruiz" },
  { sku: "MF-100", type: "outbound", qty: -60, daysAgo: 0, hour: 8, ref: "SO-1937", user: "M. López" },
  { sku: "FL-020", type: "outbound", qty: -24, daysAgo: 1, hour: 16, ref: "SO-1931", user: "J. Pérez" },
  { sku: "CZ-020", type: "production", qty: 240, daysAgo: 1, hour: 13, ref: "PO-0219", user: "A. Ruiz" },
  { sku: "MB-050", type: "adjustment", qty: -6, daysAgo: 1, hour: 10, ref: "CC-041", user: "K. Degollado" },
  { sku: "MN-100", type: "inbound", qty: 300, daysAgo: 2, hour: 15, ref: "PR-4821", user: "J. Pérez" },
  { sku: "MC-050", type: "outbound", qty: -40, daysAgo: 2, hour: 12, ref: "SO-1926", user: "M. López" },
  { sku: "MN-024", type: "outbound", qty: -8, daysAgo: 2, hour: 9, ref: "SO-1924", user: "M. López" },
  { sku: "CL-300", type: "outbound", qty: -6, daysAgo: 3, hour: 17, ref: "SO-1919", user: "J. Pérez" },
  { sku: "MB-012", type: "production", qty: 360, daysAgo: 3, hour: 11, ref: "PO-0216", user: "A. Ruiz" },
  { sku: "MC-012", type: "production", qty: 480, daysAgo: 3, hour: 8, ref: "PO-0215", user: "A. Ruiz" },
  { sku: "AT-200", type: "inbound", qty: 40, daysAgo: 4, hour: 14, ref: "PR-4807", user: "J. Pérez" },
  { sku: "MF-100", type: "outbound", qty: -72, daysAgo: 4, hour: 10, ref: "SO-1911", user: "M. López" },
  { sku: "EX-001", type: "outbound", qty: -210, daysAgo: 5, hour: 16, ref: "SO-1904", user: "M. López" },
  { sku: "CZ-020", type: "outbound", qty: -54, daysAgo: 5, hour: 12, ref: "SO-1902", user: "J. Pérez" },
  { sku: "FL-020", type: "adjustment", qty: -12, daysAgo: 6, hour: 18, ref: "CC-040", user: "K. Degollado" },
  { sku: "MB-050", type: "outbound", qty: -30, daysAgo: 6, hour: 11, ref: "SO-1897", user: "M. López" },
  { sku: "MN-100", type: "outbound", qty: -78, daysAgo: 7, hour: 15, ref: "SO-1890", user: "J. Pérez" },
  { sku: "MC-050", type: "inbound", qty: 150, daysAgo: 8, hour: 9, ref: "PR-4795", user: "J. Pérez" },
  { sku: "CL-300", type: "inbound", qty: 20, daysAgo: 9, hour: 13, ref: "PR-4788", user: "J. Pérez" },
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
