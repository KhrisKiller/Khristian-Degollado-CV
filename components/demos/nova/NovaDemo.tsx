"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { Activity, ArrowRight, Check, Cpu, Plug, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { novaLogos, novaPlans, novaStreams } from "@/data/nova";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";

const LIME = "#d4ff3f";
const POINTS = 48;

function seedSeries() {
  const out: number[] = [];
  let v = 62;
  for (let i = 0; i < POINTS; i++) {
    v = Math.max(28, Math.min(92, v + Math.sin(i / 3) * 6 + (((i * 37) % 11) - 5)));
    out.push(v);
  }
  return out;
}

/** Live-updating stream; pauses when off-screen or with reduced motion. */
function useLiveSeries(target: React.RefObject<HTMLElement | null>) {
  const reduce = useReducedMotion();
  const [series, setSeries] = useState(seedSeries);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const el = target.current;
    if (!el || reduce) return;
    let timer: number | undefined;
    const start = () => {
      if (timer) return;
      timer = window.setInterval(() => {
        setSeries((s) => {
          const last = s[s.length - 1];
          const next = Math.max(24, Math.min(96, last + (Math.random() - 0.48) * 14));
          return [...s.slice(1), next];
        });
        setTick((x) => x + 1);
      }, 900);
    };
    const stop = () => {
      window.clearInterval(timer);
      timer = undefined;
    };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
  }, [target, reduce]);

  return { series, tick };
}

export default function NovaDemo() {
  const { t, lang } = useI18n();
  const n = t.nova;
  const vizRef = useRef<HTMLDivElement>(null);
  const { series, tick } = useLiveSeries(vizRef);
  const [feature, setFeature] = useState(0);
  const [annual, setAnnual] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  const eps = Math.round(4200 + series[series.length - 1] * 38);
  const latency = 31 + Math.round((series[series.length - 1] % 9) * 1.1);
  const anomaly = tick % 12 >= 8;

  // Build the chart path in a 400×120 box
  const path = series
    .map((v, i) => `${i === 0 ? "M" : "L"}${((i / (POINTS - 1)) * 400).toFixed(1)},${(120 - (v / 100) * 110).toFixed(1)}`)
    .join(" ");

  return (
    <div className="relative h-full overflow-hidden bg-[#050505] font-grotesk text-[#f2f2f2]">
      <div className="@container h-full overflow-y-auto overflow-x-hidden scrollbar-thin">
        {/* ---------- Nav ---------- */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-white/10 bg-[#050505]/85 px-5 backdrop-blur-md @3xl:px-10">
          <span className="flex items-center gap-2 text-[15px] font-semibold tracking-[0.18em]">
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
              <path d="M4 20V4l16 16V4" fill="none" stroke={LIME} strokeWidth="2.5" strokeLinejoin="round" />
            </svg>
            NOVA
          </span>
          <nav className="hidden gap-7 text-[13px] text-white/60 @3xl:flex" aria-label="NOVA">
            {n.nav.map((x) => (
              <span key={x} className="cursor-default transition-colors hover:text-white">
                {x}
              </span>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden text-[13px] text-white/60 @xl:inline">{n.signIn}</span>
            <button type="button" className="h-8 rounded-md px-3.5 text-[13px] font-medium text-black transition-opacity hover:opacity-90" style={{ background: LIME }}>
              {n.start}
            </button>
          </div>
        </header>

        {/* ---------- Hero ---------- */}
        <section className="relative px-5 pb-12 pt-14 text-center @3xl:px-10 @3xl:pt-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
          />
          <p className="relative mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-white/70">
            <span className="size-1.5 rounded-full" style={{ background: LIME }} aria-hidden />
            {n.badge}
          </p>
          <h3 className="relative mx-auto mt-6 max-w-3xl text-[clamp(2.2rem,7cqi,4.4rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
            {n.heroTitleA}
            <br />
            <span className="text-white/55">{n.heroTitleB}</span>
          </h3>
          <p className="relative mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-white/60">{n.heroText}</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" className="inline-flex h-11 items-center gap-2 rounded-md px-5 text-sm font-medium text-black" style={{ background: LIME }}>
              {n.heroCta}
              <ArrowRight className="size-4" aria-hidden />
            </button>
            <button type="button" className="h-11 rounded-md border border-white/15 px-5 text-sm text-white/80 transition-colors hover:bg-white/5">
              {n.heroSecondary}
            </button>
          </div>

          {/* ---------- Product visualization ---------- */}
          <div ref={vizRef} className="relative mx-auto mt-14 max-w-4xl rounded-xl border border-white/10 bg-[#0b0b0b] p-3 text-left shadow-[0_0_80px_-20px_rgb(212_255_63/0.25)] @3xl:p-4">
            <div className="grid gap-3 @3xl:grid-cols-[1fr_15rem]">
              <div className="rounded-lg border border-white/[0.08] bg-black p-4">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">{n.throughput}</p>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: LIME }}>
                    <span className="size-1.5 animate-pulse-soft rounded-full" style={{ background: LIME }} aria-hidden />
                    {n.live}
                  </span>
                </div>
                <p className="mt-2 font-mono text-3xl tabular tracking-tight">{formatNumber(eps, lang)}</p>
                <svg viewBox="0 0 400 120" className="mt-3 h-32 w-full" preserveAspectRatio="none" aria-hidden>
                  {[30, 60, 90].map((y) => (
                    <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="rgb(255 255 255 / 0.06)" />
                  ))}
                  <path d={`${path} L400,120 L0,120 Z`} fill={LIME} opacity="0.08" />
                  <path d={path} fill="none" stroke={LIME} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="grid grid-cols-2 gap-3 @3xl:grid-cols-1">
                <Stat label={n.latency} value={`${latency} ms`} />
                <Stat label={n.uptime} value="99.99%" />
                <div className="col-span-2 rounded-lg border border-white/[0.08] bg-black p-3 @3xl:col-span-1">
                  <ul className="space-y-2 font-mono text-[11px]">
                    {novaStreams.map((s, i) => (
                      <li key={s.name} className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2 text-white/60">
                          <span className={cn("size-1.5 rounded-full", anomaly && i === 1 ? "bg-[#ff5c3a]" : "bg-white/40")} aria-hidden />
                          {s.name}
                        </span>
                        <span className="tabular text-white/80">{formatNumber(s.rate + ((tick * (i + 3) * 17) % 140), lang)}/s</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <AnimatePresence>
              {anomaly ? (
                <m.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  role="status"
                  className="mt-3 flex items-center gap-2 rounded-md border border-[#ff5c3a]/30 bg-[#ff5c3a]/10 px-3 py-2 font-mono text-[11px] text-[#ffb3a3]"
                >
                  <Activity className="size-3.5" aria-hidden />
                  {n.anomaly}
                </m.p>
              ) : null}
            </AnimatePresence>
          </div>
        </section>

        {/* ---------- Logos ---------- */}
        <section className="border-y border-white/10 px-5 py-8 @3xl:px-10">
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.24em] text-white/55">{n.trusted}</p>
          <ul className="mt-6 grid grid-cols-3 gap-6 text-center text-white/55 @3xl:grid-cols-6">
            {novaLogos.map((logo, i) => (
              <li
                key={logo}
                className={cn(
                  "text-lg",
                  i % 3 === 0 && "font-semibold tracking-[0.2em]",
                  i % 3 === 1 && "font-serif italic text-xl",
                  i % 3 === 2 && "font-mono tracking-tight",
                )}
              >
                {logo}
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- Features ---------- */}
        <section className="px-5 py-16 @3xl:px-10 @3xl:py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em]" style={{ color: LIME }}>
            {n.featuresKicker}
          </p>
          <h3 className="mt-3 text-[clamp(1.9rem,5cqi,3rem)] font-semibold tracking-[-0.04em]">{n.featuresTitle}</h3>
          <div className="mt-10 grid gap-4 @3xl:grid-cols-[0.9fr_1.1fr]">
            <div role="tablist" aria-label={n.featuresTitle} className="flex flex-col gap-2">
              {n.features.map((f, i) => {
                const Icon = [Plug, Cpu, Zap][i];
                const on = feature === i;
                return (
                  <button
                    key={f.title}
                    type="button"
                    role="tab"
                    id={`nova-tab-${i}`}
                    aria-selected={on}
                    aria-controls="nova-tabpanel"
                    onClick={() => setFeature(i)}
                    className={cn(
                      "relative rounded-lg border p-4 text-left transition-colors",
                      on ? "border-white/20 bg-white/[0.04]" : "border-white/[0.07] hover:border-white/15",
                    )}
                  >
                    {on ? <m.span layoutId="nova-tab" className="absolute inset-y-3 left-0 w-0.5 rounded-full" style={{ background: LIME }} /> : null}
                    <span className="flex items-center gap-3">
                      <Icon className="size-4" style={{ color: on ? LIME : "rgb(255 255 255 / 0.5)" }} aria-hidden />
                      <span className="font-medium">{f.title}</span>
                      <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">{f.stat}</span>
                    </span>
                    <span className={cn("mt-2 block text-[13px] leading-relaxed text-white/55", !on && "hidden @3xl:block")}>{f.text}</span>
                  </button>
                );
              })}
            </div>
            <div id="nova-tabpanel" role="tabpanel" aria-labelledby={`nova-tab-${feature}`} className="relative min-h-64 overflow-hidden rounded-lg border border-white/10 bg-[#0b0b0b] p-5">
              <AnimatePresence mode="wait" initial={false}>
                <m.div key={feature} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="h-full">
                  {feature === 0 ? <IngestPanel /> : feature === 1 ? <ModelPanel /> : <ActPanel />}
                </m.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* ---------- Metrics ---------- */}
        <section className="border-y border-white/10 px-5 py-14 @3xl:px-10">
          <h3 className="sr-only">{n.metricsTitle}</h3>
          <dl className="grid grid-cols-2 gap-8 @3xl:grid-cols-4">
            {n.metrics.map((x) => (
              <div key={x.label} className="flex flex-col-reverse border-l border-white/10 pl-4">
                <dt className="mt-2 text-[13px] text-white/50">{x.label}</dt>
                <dd className="text-[clamp(1.8rem,5cqi,2.8rem)] font-semibold tracking-[-0.04em]">{x.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---------- Pricing ---------- */}
        <section className="px-5 py-16 @3xl:px-10 @3xl:py-24">
          <div className="flex flex-col items-start gap-6 @3xl:flex-row @3xl:items-end @3xl:justify-between">
            <h3 className="max-w-md text-[clamp(1.9rem,5cqi,3rem)] font-semibold leading-[1.02] tracking-[-0.04em]">{n.pricingTitle}</h3>
            <div className="flex items-center gap-3">
              <div className="relative flex rounded-md border border-white/15 p-1 text-[13px]" role="group" aria-label={n.pricingTitle}>
                {([false, true] as const).map((isAnnual) => (
                  <button key={String(isAnnual)} type="button" aria-pressed={annual === isAnnual} onClick={() => setAnnual(isAnnual)} className={cn("relative z-[1] rounded px-3 py-1.5 transition-colors", annual === isAnnual ? "text-black" : "text-white/60")}>
                    {annual === isAnnual ? <m.span layoutId="nova-billing" className="absolute inset-0 -z-[1] rounded" style={{ background: LIME }} /> : null}
                    {isAnnual ? n.annual : n.monthly}
                  </button>
                ))}
              </div>
              <span className="font-mono text-[11px]" style={{ color: LIME }}>
                {n.save}
              </span>
            </div>
          </div>
          <ul className="mt-10 grid gap-4 @4xl:grid-cols-3">
            {novaPlans.map((plan, i) => {
              const copy = n.plans[i];
              const price = annual ? plan.annual : plan.monthly;
              const featured = "featured" in plan && plan.featured;
              const isSelected = selected === plan.id;
              return (
                <li key={plan.id} className={cn("relative flex flex-col rounded-xl border p-6", featured ? "border-[#d4ff3f]/40 bg-[#d4ff3f]/[0.04]" : "border-white/10")}>
                  {featured ? (
                    <span className="absolute right-4 top-4 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-black" style={{ background: LIME }}>
                      {n.popular}
                    </span>
                  ) : null}
                  <p className="text-lg font-semibold">{copy.name}</p>
                  <p className="mt-1 text-[13px] text-white/55">{copy.desc}</p>
                  <p className="mt-6 flex items-baseline gap-1">
                    {price === null ? (
                      <span className="text-4xl font-semibold tracking-[-0.04em]">{n.custom}</span>
                    ) : (
                      <>
                        <AnimatePresence mode="popLayout" initial={false}>
                          <m.span key={price} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="font-mono text-4xl tabular tracking-[-0.04em]">
                            ${price}
                          </m.span>
                        </AnimatePresence>
                        <span className="text-sm text-white/50">USD{n.perMonth}</span>
                      </>
                    )}
                  </p>
                  <p className="mt-1 h-4 font-mono text-[11px] text-white/55">{price === null ? "" : annual ? n.billedAnnually : n.billedMonthly}</p>
                  <ul className="mt-6 space-y-2.5 text-[13px] text-white/75">
                    {copy.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Check className="size-3.5" style={{ color: LIME }} aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => setSelected(plan.id)}
                    aria-pressed={isSelected}
                    className={cn("mt-8 h-10 rounded-md text-[13px] font-medium transition-colors", featured || isSelected ? "text-black" : "border border-white/15 text-white hover:bg-white/5")}
                    style={featured || isSelected ? { background: LIME } : undefined}
                  >
                    {isSelected ? `✓ ${n.selectedPlan}` : copy.cta}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ---------- CTA ---------- */}
        <section className="px-5 pb-16 @3xl:px-10">
          <div className="relative overflow-hidden rounded-xl border border-white/10 px-6 py-14 text-center">
            <div aria-hidden className="absolute inset-x-0 -bottom-24 mx-auto h-48 max-w-lg rounded-full blur-3xl" style={{ background: "rgb(212 255 63 / 0.18)" }} />
            <h3 className="relative text-[clamp(1.8rem,5cqi,2.8rem)] font-semibold tracking-[-0.04em]">{n.ctaTitle}</h3>
            <p className="relative mt-3 text-sm text-white/55">{n.ctaText}</p>
            <button type="button" className="relative mt-8 inline-flex h-11 items-center gap-2 rounded-md px-5 text-sm font-medium text-black" style={{ background: LIME }}>
              {n.heroCta}
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </section>

        <footer className="border-t border-white/10 px-5 py-8 font-mono text-[11px] text-white/55 @3xl:px-10">{n.footer}</footer>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-black p-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">{label}</p>
      <p className="mt-1.5 font-mono text-xl tabular">{value}</p>
    </div>
  );
}

function IngestPanel() {
  const { t } = useI18n();
  return (
    <pre className="overflow-x-auto font-mono text-[12px] leading-6 text-white/70">
      <code>
        <span className="text-white/55"># nova.config</span>
        {"\n"}
        <span style={{ color: LIME }}>source</span> <span className="text-[#9ecbff]">&quot;plc.line-03&quot;</span> {"{"}
        {"\n"}  protocol = <span className="text-[#9ecbff]">&quot;opc-ua&quot;</span>
        {"\n"}  sample   = <span className="text-[#9ecbff]">&quot;100ms&quot;</span>
        {"\n"}  schema   = <span className="text-[#ffb86b]">auto</span>
        {"\n"}{"}"}
        {"\n\n"}
        <span style={{ color: LIME }}>source</span> <span className="text-[#9ecbff]">&quot;erp.orders&quot;</span> {"{"}
        {"\n"}  connector = <span className="text-[#9ecbff]">&quot;rest&quot;</span>
        {"\n"}  poll      = <span className="text-[#9ecbff]">&quot;5s&quot;</span>
        {"\n"}{"}"}
        {"\n\n"}
        <span className="text-white/55">{t.nova.ingestStatus}</span>
      </code>
    </pre>
  );
}

function ModelPanel() {
  const nodes = [
    { x: 40, y: 40, l: "L1" },
    { x: 40, y: 110, l: "L2" },
    { x: 40, y: 180, l: "L3" },
    { x: 200, y: 75, l: "WMS" },
    { x: 200, y: 160, l: "ERP" },
    { x: 340, y: 118, l: "TWIN" },
  ];
  const edges = [
    [0, 3],
    [1, 3],
    [2, 4],
    [1, 4],
    [3, 5],
    [4, 5],
  ];
  return (
    <svg viewBox="0 0 400 220" className="h-full min-h-56 w-full" aria-hidden>
      {edges.map(([a, b], i) => (
        <path
          key={i}
          d={`M${nodes[a].x + 22} ${nodes[a].y} C ${(nodes[a].x + nodes[b].x) / 2} ${nodes[a].y}, ${(nodes[a].x + nodes[b].x) / 2} ${nodes[b].y}, ${nodes[b].x - 22} ${nodes[b].y}`}
          fill="none"
          stroke={b === 5 ? LIME : "rgb(255 255 255 / 0.25)"}
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="animate-flow"
        />
      ))}
      {nodes.map((nd, i) => (
        <g key={nd.l}>
          <rect x={nd.x - 22} y={nd.y - 16} width="44" height="32" rx="6" fill={i === 5 ? "rgb(212 255 63 / 0.12)" : "#111"} stroke={i === 5 ? LIME : "rgb(255 255 255 / 0.2)"} />
          <text x={nd.x} y={nd.y + 4} textAnchor="middle" fill={i === 5 ? LIME : "rgb(255 255 255 / 0.7)"} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10 }}>
            {nd.l}
          </text>
        </g>
      ))}
    </svg>
  );
}

function ActPanel() {
  const { t } = useI18n();
  return (
    <div className="space-y-3 font-mono text-[12px]">
      <div className="rounded-md border border-white/10 bg-black p-4 leading-6 text-white/70">
        <span style={{ color: LIME }}>WHEN</span> temperature.line_3 &gt; <span className="text-[#ffb86b]">82°C</span> <span style={{ color: LIME }}>FOR</span> 2m
        <br />
        <span style={{ color: LIME }}>THEN</span> pause(<span className="text-[#9ecbff]">&quot;line-3&quot;</span>)
        <br />
        <span className="pl-4" style={{ color: LIME }}>AND</span> notify(<span className="text-[#9ecbff]">&quot;#maintenance&quot;</span>)
      </div>
      <div className="flex items-center justify-between rounded-md border border-white/10 px-4 py-3 text-white/60">
        <span>playbook.overheat</span>
        <span className="inline-flex items-center gap-1.5" style={{ color: LIME }}>
          <span className="size-1.5 rounded-full" style={{ background: LIME }} aria-hidden />
          {t.nova.armed}
        </span>
      </div>
      <div className="flex items-center justify-between rounded-md border border-white/10 px-4 py-3 text-white/60">
        <span>playbook.low-stock</span>
        <span className="inline-flex items-center gap-1.5" style={{ color: LIME }}>
          <span className="size-1.5 rounded-full" style={{ background: LIME }} aria-hidden />
          {t.nova.armed}
        </span>
      </div>
    </div>
  );
}
