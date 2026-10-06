import { distribute, mulberry32 } from "@/lib/random";

export type PeriodId = "FY" | "Q1" | "Q2" | "Q3" | "Q4";
export const PERIODS: PeriodId[] = ["FY", "Q1", "Q2", "Q3", "Q4"];

/** Meridian Supply Co. — fictional distributor, fiscal year 2026 (MXN, monthly). */
export const months = [
  { revenue: 172_000, orders: 352, otifOrders: 323, receivables: 168_000, inventory: 548_000 },
  { revenue: 168_000, orders: 341, otifOrders: 315, receivables: 175_000, inventory: 561_000 },
  { revenue: 195_000, orders: 389, otifOrders: 362, receivables: 192_000, inventory: 574_000 },
  { revenue: 188_000, orders: 378, otifOrders: 354, receivables: 201_000, inventory: 552_000 },
  { revenue: 204_000, orders: 405, otifOrders: 381, receivables: 196_000, inventory: 539_000 },
  { revenue: 211_000, orders: 417, otifOrders: 389, receivables: 214_000, inventory: 566_000 },
  { revenue: 198_000, orders: 392, otifOrders: 370, receivables: 208_000, inventory: 541_000 },
  { revenue: 214_000, orders: 421, otifOrders: 400, receivables: 199_000, inventory: 528_000 },
  { revenue: 222_000, orders: 431, otifOrders: 411, receivables: 205_000, inventory: 515_000 },
  { revenue: 230_000, orders: 438, otifOrders: 416, receivables: 193_000, inventory: 503_000 },
  { revenue: 236_000, orders: 422, otifOrders: 403, receivables: 188_000, inventory: 494_000 },
  { revenue: 242_000, orders: 435, otifOrders: 417, receivables: 184_000, inventory: 486_000 },
];

/** Closing values of the previous year (Dec 2025). */
const OPENING = { receivables: 205_000, inventory: 512_000 };

export type Summary = {
  revenue: number;
  orders: number;
  otif: number;
  receivables: number;
  inventory: number;
};

/** Comparison bases: 2025 for the full year, previous quarter for quarters. */
const PREVIOUS: Record<PeriodId, Summary> = {
  FY: { revenue: 2_210_000, orders: 4_402, otif: 91.6, receivables: 205_000, inventory: 512_000 },
  Q1: { revenue: 590_000, orders: 1_150, otif: 91.9, receivables: 205_000, inventory: 512_000 },
  Q2: { revenue: 535_000, orders: 1_082, otif: 92.42, receivables: 192_000, inventory: 574_000 },
  Q3: { revenue: 603_000, orders: 1_200, otif: 93.67, receivables: 214_000, inventory: 566_000 },
  Q4: { revenue: 634_000, orders: 1_244, otif: 94.94, receivables: 205_000, inventory: 515_000 },
};

/** Receivables aging at period close: 0–30, 31–60, 61–90, 90+ days. */
const AGING_MIX: Record<PeriodId, [number, number, number, number]> = {
  Q1: [0.55, 0.25, 0.12, 0.08],
  Q2: [0.5, 0.26, 0.14, 0.1],
  Q3: [0.58, 0.24, 0.11, 0.07],
  Q4: [0.64, 0.22, 0.09, 0.05],
  FY: [0.64, 0.22, 0.09, 0.05],
};

export function monthRange(period: PeriodId): [number, number] {
  if (period === "FY") return [0, 12];
  const q = Number(period[1]) - 1;
  return [q * 3, q * 3 + 3];
}

export function summarize(period: PeriodId): Summary {
  const [a, b] = monthRange(period);
  const slice = months.slice(a, b);
  const orders = slice.reduce((s, m) => s + m.orders, 0);
  const otifOrders = slice.reduce((s, m) => s + m.otifOrders, 0);
  const last = slice[slice.length - 1];
  return {
    revenue: slice.reduce((s, m) => s + m.revenue, 0),
    orders,
    otif: (otifOrders / orders) * 100,
    receivables: last.receivables,
    inventory: last.inventory,
  };
}

export function previousSummary(period: PeriodId): Summary {
  return PREVIOUS[period];
}

export function aging(period: PeriodId) {
  const total = summarize(period).receivables;
  const [c, d60, d90, over] = distribute(total / 1000, AGING_MIX[period]).map((v) => v * 1000);
  return { current: c, d60, d90, over };
}

export type SeriesPoint = {
  /** Month index (0–11) for the full year; ISO-like week number for quarters. */
  index: number;
  kind: "month" | "week";
  revenue: number;
  orders: number;
  otif: number;
  inventory: number;
  receivables: number;
};

const WEEKS_PER_MONTH = [4, 4, 5];

/** Monthly points for the full year, weekly points (13) for a quarter. */
export function series(period: PeriodId): SeriesPoint[] {
  if (period === "FY") {
    return months.map((m, i) => ({
      index: i,
      kind: "month",
      revenue: m.revenue,
      orders: m.orders,
      otif: (m.otifOrders / m.orders) * 100,
      inventory: m.inventory,
      receivables: m.receivables,
    }));
  }

  const [start] = monthRange(period);
  const rand = mulberry32(start * 7919 + 17);
  const out: SeriesPoint[] = [];
  let week = start === 0 ? 1 : (start / 3) * 13 + 1;

  for (let k = 0; k < 3; k++) {
    const mi = start + k;
    const m = months[mi];
    const prev = mi === 0 ? OPENING : months[mi - 1];
    const n = WEEKS_PER_MONTH[k];
    const weights = Array.from({ length: n }, () => 0.85 + rand() * 0.3);
    const rev = distribute(m.revenue / 100, weights).map((v) => v * 100);
    const ord = distribute(m.orders, weights);
    const ot = distribute(m.otifOrders, ord.map((o) => o * (0.97 + rand() * 0.06)));
    for (let w = 0; w < n; w++) {
      const tpos = (w + 1) / n;
      const jitter = 1 + (rand() - 0.5) * 0.012;
      out.push({
        index: week++,
        kind: "week",
        revenue: rev[w],
        orders: ord[w],
        otif: Math.min(100, (Math.min(ot[w], ord[w]) / ord[w]) * 100),
        inventory: Math.round((prev.inventory + (m.inventory - prev.inventory) * tpos) * (w === n - 1 ? 1 : jitter)),
        receivables: Math.round((prev.receivables + (m.receivables - prev.receivables) * tpos) * (w === n - 1 ? 1 : jitter)),
      });
    }
  }
  return out;
}

export const OTIF_TARGET = 95;
