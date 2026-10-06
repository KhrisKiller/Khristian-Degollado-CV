import type { Localized } from "@/lib/i18n/types";
import { distribute } from "@/lib/random";
import { monthRange, summarize, type PeriodId } from "./sales";

type CustomerDef = {
  id: string;
  name: Localized;
  /** Share of revenue per quarter (Q1..Q4). */
  revenueShare: [number, number, number, number];
  orderShare: number;
  otifOffset: number;
  dso: number;
  balanceShare: number;
};

const defs: CustomerDef[] = [
  { id: "monterra", name: { en: "Distribuidora Monterra", es: "Distribuidora Monterra" }, revenueShare: [0.235, 0.24, 0.245, 0.25], orderShare: 0.21, otifOffset: 1.2, dso: 32, balanceShare: 0.223 },
  { id: "bajio", name: { en: "Comercial Bajío Sur", es: "Comercial Bajío Sur" }, revenueShare: [0.185, 0.18, 0.175, 0.18], orderShare: 0.19, otifOffset: -0.4, dso: 41, balanceShare: 0.207 },
  { id: "costa", name: { en: "Grupo Costa Azul", es: "Grupo Costa Azul" }, revenueShare: [0.15, 0.155, 0.15, 0.145], orderShare: 0.14, otifOffset: 0.6, dso: 36, balanceShare: 0.158 },
  { id: "central", name: { en: "Mayoreo Central", es: "Mayoreo Central" }, revenueShare: [0.12, 0.115, 0.12, 0.125], orderShare: 0.13, otifOffset: -1.8, dso: 47, balanceShare: 0.13 },
  { id: "estrella", name: { en: "Abarrotes La Estrella", es: "Abarrotes La Estrella" }, revenueShare: [0.09, 0.095, 0.09, 0.085], orderShare: 0.11, otifOffset: -3.1, dso: 58, balanceShare: 0.098 },
  { id: "norte", name: { en: "Retail Norte", es: "Retail Norte" }, revenueShare: [0.075, 0.08, 0.085, 0.09], orderShare: 0.09, otifOffset: 0.9, dso: 29, balanceShare: 0.065 },
  { id: "other", name: { en: "Other accounts", es: "Otras cuentas" }, revenueShare: [0.145, 0.135, 0.135, 0.125], orderShare: 0.13, otifOffset: -0.2, dso: 44, balanceShare: 0.119 },
];

export type CustomerHealth = "healthy" | "watch" | "risk";

export type CustomerRow = {
  id: string;
  name: Localized;
  revenue: number;
  share: number;
  orders: number;
  otif: number;
  dso: number;
  balance: number;
  byQuarter: number[];
  health: CustomerHealth;
};

const quarterRevenue = (q: number) => summarize(`Q${q + 1}` as PeriodId).revenue;

const revenueByQuarter: number[][] = [0, 1, 2, 3].map((q) =>
  distribute(quarterRevenue(q) / 100, defs.map((d) => d.revenueShare[q])).map((v) => v * 100),
);

export function customerRows(period: PeriodId): CustomerRow[] {
  const sum = summarize(period);
  const [a] = monthRange(period);
  const quarters = period === "FY" ? [0, 1, 2, 3] : [a / 3];
  const orders = distribute(sum.orders, defs.map((d) => d.orderShare));
  const balances = distribute(Math.round(sum.receivables / 100), defs.map((d) => d.balanceShare)).map((v) => v * 100);

  return defs.map((d, i) => {
    const revenue = quarters.reduce((s, q) => s + revenueByQuarter[q][i], 0);
    const otif = Math.min(99.5, sum.otif + d.otifOffset);
    const health: CustomerHealth = otif < 92 ? "risk" : d.dso > 50 ? "watch" : "healthy";
    return {
      id: d.id,
      name: d.name,
      revenue,
      share: revenue / sum.revenue,
      orders: orders[i],
      otif,
      dso: d.dso,
      balance: balances[i],
      byQuarter: [0, 1, 2, 3].map((q) => revenueByQuarter[q][i]),
      health,
    };
  });
}
