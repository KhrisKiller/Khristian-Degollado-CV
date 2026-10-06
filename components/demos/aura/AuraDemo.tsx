"use client";

import { AnimatePresence, m } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useMemo, useRef, useState, type FormEvent } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Dialog } from "@/components/ui/Dialog";
import { auraMarquee, auraProducts, auraReviews, type AuraProduct, type Roast } from "@/data/aura";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { CoffeeBag } from "./CoffeeBag";

type Grind = "whole" | "ground";
type CartLine = { key: string; product: AuraProduct; grind: Grind; qty: number };

const C = {
  cream: "#f4eee6",
  paper: "#fbf8f3",
  espresso: "#2a1d15",
  terracotta: "#b4572e",
  sand: "#e3d6c4",
};

export default function AuraDemo() {
  const { t, l, lang } = useI18n();
  const a = t.aura;
  const scrollRef = useRef<HTMLDivElement>(null);
  const shopRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);

  const [filter, setFilter] = useState<"all" | Roast>("all");
  const [grinds, setGrinds] = useState<Record<string, Grind>>({});
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);

  const products = useMemo(
    () => (filter === "all" ? auraProducts : auraProducts.filter((p) => p.roast === filter)),
    [filter],
  );
  const count = cart.reduce((n, line) => n + line.qty, 0);
  const subtotal = cart.reduce((n, line) => n + line.qty * line.product.price, 0);
  const money = (v: number) => `$${formatNumber(v, lang)}`;

  const scrollTo = (el: HTMLElement | null) => {
    const box = scrollRef.current;
    if (!el || !box) return;
    box.scrollTo({ top: el.offsetTop - 56, behavior: "smooth" });
  };

  const add = (product: AuraProduct) => {
    const grind = grinds[product.id] ?? "whole";
    const key = `${product.id}-${grind}`;
    setCart((lines) => {
      const found = lines.find((x) => x.key === key);
      if (found) return lines.map((x) => (x.key === key ? { ...x, qty: x.qty + 1 } : x));
      return [...lines, { key, product, grind, qty: 1 }];
    });
    setCheckedOut(false);
    setJustAdded(product.id);
    window.setTimeout(() => setJustAdded((cur) => (cur === product.id ? null : cur)), 1400);
  };

  const changeQty = (key: string, delta: number) =>
    setCart((lines) => lines.flatMap((x) => (x.key !== key ? [x] : x.qty + delta <= 0 ? [] : [{ ...x, qty: x.qty + delta }])));

  return (
    <div className="relative h-full overflow-hidden" style={{ background: C.cream, color: C.espresso }}>
      <div ref={scrollRef} className="@container h-full overflow-y-auto overflow-x-hidden scrollbar-thin">
        {/* ---------- Header ---------- */}
        <header
          className="sticky top-0 z-20 flex h-14 items-center justify-between border-b px-5 backdrop-blur-md @3xl:px-10"
          style={{ background: "rgb(244 238 230 / 0.85)", borderColor: "rgb(42 29 21 / 0.08)" }}
        >
          <span className="font-serif text-2xl tracking-[0.3em]">AURA</span>
          <nav className="hidden items-center gap-8 text-[13px] @2xl:flex" aria-label="AURA">
            {a.nav.map((item, i) => (
              <button
                key={item}
                type="button"
                onClick={() => scrollTo(i === 0 ? shopRef.current : storyRef.current)}
                className="opacity-70 transition-opacity hover:opacity-100"
              >
                {item}
              </button>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] transition-colors hover:bg-black/[0.04]"
            style={{ borderColor: "rgb(42 29 21 / 0.2)" }}
          >
            <ShoppingBag className="size-4" aria-hidden />
            {a.cart}
            <span
              className="grid min-w-5 place-items-center rounded-full px-1 text-[11px] font-medium tabular"
              style={{ background: C.espresso, color: C.cream }}
            >
              {count}
            </span>
          </button>
        </header>

        {/* ---------- Hero ---------- */}
        <section className="grid items-center gap-10 px-5 pb-14 pt-10 @3xl:grid-cols-[1.1fr_0.9fr] @3xl:px-10 @3xl:pb-20 @3xl:pt-16">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] opacity-70">{a.heroKicker}</p>
            <h3 className="mt-5 font-serif text-[clamp(2.6rem,9cqi,5.2rem)] leading-[0.95] tracking-[-0.02em]">
              {a.heroTitleA}
              <br />
              <em style={{ color: C.terracotta }}>{a.heroTitleB}</em>
            </h3>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed opacity-75">{a.heroText}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => scrollTo(shopRef.current)}
                className="inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-medium transition-transform hover:-translate-y-0.5"
                style={{ background: C.espresso, color: C.cream }}
              >
                {a.heroCta}
                <ArrowRight className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => scrollTo(storyRef.current)}
                className="inline-flex h-11 items-center rounded-full border px-6 text-sm transition-colors hover:bg-black/[0.04]"
                style={{ borderColor: "rgb(42 29 21 / 0.25)" }}
              >
                {a.heroSecondary}
              </button>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute inset-x-6 bottom-4 top-10 rounded-[40%_40%_8px_8px]" style={{ background: C.sand }} aria-hidden />
            <CoffeeBag product={auraProducts[0]} className="relative mx-auto w-[78%] drop-shadow-[0_30px_30px_rgb(42_29_21/0.18)]" />
            <RoastBadge label={a.badge} />
          </div>
        </section>

        {/* ---------- Marquee ---------- */}
        <div className="overflow-hidden border-y py-3" style={{ borderColor: "rgb(42 29 21 / 0.12)" }} aria-hidden>
          <div className="flex w-max animate-[aura-marquee_28s_linear_infinite] gap-10 whitespace-nowrap font-serif text-lg italic opacity-70">
            {[...l(auraMarquee), ...l(auraMarquee)].map((item, i) => (
              <span key={i} className="flex items-center gap-10">
                {item}
                <span style={{ color: C.terracotta }}>✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* ---------- Shop ---------- */}
        <section ref={shopRef} className="px-5 py-14 @3xl:px-10 @3xl:py-20">
          <div className="flex flex-col gap-6 @3xl:flex-row @3xl:items-end @3xl:justify-between">
            <div>
              <h3 className="font-serif text-4xl tracking-[-0.01em] @3xl:text-5xl">{a.shopTitle}</h3>
              <p className="mt-3 max-w-md text-sm opacity-70">{a.shopText}</p>
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label={a.shopTitle}>
              {(["all", "light", "medium", "dark"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                  className="rounded-full border px-4 py-1.5 text-[13px] transition-colors"
                  style={
                    filter === f
                      ? { background: C.espresso, color: C.cream, borderColor: C.espresso }
                      : { borderColor: "rgb(42 29 21 / 0.2)" }
                  }
                >
                  {a.filters[f]}
                </button>
              ))}
            </div>
          </div>

          <m.ul layout className="mt-10 grid gap-5 @xl:grid-cols-2 @4xl:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {products.map((p) => {
                const grind = grinds[p.id] ?? "whole";
                const added = justAdded === p.id;
                return (
                  <m.li
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.35 }}
                    className="group flex flex-col rounded-2xl p-4"
                    style={{ background: C.paper }}
                  >
                    <div className="relative grid aspect-[4/3.4] place-items-center overflow-hidden rounded-xl" style={{ background: "#efe6da" }}>
                      <CoffeeBag product={p} className="h-[88%] transition-transform duration-700 group-hover:-translate-y-1.5 group-hover:rotate-[-2deg]" />
                      <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em]" style={{ background: C.cream }}>
                        {a.filters[p.roast]}
                      </span>
                    </div>
                    <div className="mt-4 flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-serif text-2xl leading-tight">{p.name}</h4>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] opacity-70">
                          {p.region} · {p.altitude}
                        </p>
                      </div>
                      <p className="whitespace-nowrap text-sm font-medium tabular">
                        {money(p.price)} <span className="text-[10px] opacity-70">MXN</span>
                      </p>
                    </div>
                    <p className="mt-3 text-[13px] opacity-70">
                      <span className="sr-only">{a.notes}: </span>
                      {l(p.notes).join(" · ")}
                    </p>
                    <div className="mt-4 grid grid-cols-2 rounded-full p-1 text-[12px]" style={{ background: "#efe6da" }} role="group" aria-label={a.grind}>
                      {(["whole", "ground"] as const).map((g) => (
                        <button
                          key={g}
                          type="button"
                          aria-pressed={grind === g}
                          onClick={() => setGrinds((s) => ({ ...s, [p.id]: g }))}
                          className="rounded-full py-1.5 transition-colors"
                          style={grind === g ? { background: C.paper, boxShadow: "0 1px 2px rgb(42 29 21 / 0.12)" } : undefined}
                        >
                          {a.grinds[g]}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => add(p)}
                      className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-full text-[13px] font-medium transition-colors"
                      style={added ? { background: "#5f7150", color: C.cream } : { background: C.espresso, color: C.cream }}
                    >
                      {added ? <Check className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
                      {added ? a.added : a.add}
                    </button>
                  </m.li>
                );
              })}
            </AnimatePresence>
          </m.ul>
        </section>

        {/* ---------- Story ---------- */}
        <section ref={storyRef} className="relative overflow-hidden px-5 py-16 @3xl:px-10 @3xl:py-24" style={{ background: C.espresso, color: C.cream }}>
          <Contours />
          <div className="relative grid gap-10 @3xl:grid-cols-2 @3xl:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] opacity-70">{a.storyKicker}</p>
              <h3 className="mt-4 font-serif text-[clamp(2.2rem,6cqi,3.6rem)] leading-[1.02]">{a.storyTitle}</h3>
            </div>
            <p className="text-[15px] leading-relaxed opacity-75">{a.storyText}</p>
          </div>
          <dl className="relative mt-12 grid grid-cols-3 gap-4 border-t pt-8" style={{ borderColor: "rgb(244 238 230 / 0.15)" }}>
            {a.storyStats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="mt-1 text-[12px] opacity-70">{s.label}</dt>
                <dd className="font-serif text-3xl @3xl:text-5xl" style={{ color: "#e3a17f" }}>
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---------- Reviews ---------- */}
        <Reviews />

        {/* ---------- CTA ---------- */}
        <Newsletter />

        {/* ---------- Footer ---------- */}
        <footer className="flex flex-col gap-6 border-t px-5 py-10 @3xl:flex-row @3xl:items-center @3xl:justify-between @3xl:px-10" style={{ borderColor: "rgb(42 29 21 / 0.12)" }}>
          <div>
            <span className="font-serif text-xl tracking-[0.3em]">AURA</span>
            <p className="mt-1 text-[13px] opacity-70">{a.footer}</p>
          </div>
          <ul className="flex gap-6 text-[13px] opacity-70">
            {a.footerLinks.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <p className="text-[11px] opacity-70">© 2026 AURA Café · {t.common.fictional}</p>
        </footer>
      </div>

      {/* ---------- Cart drawer ---------- */}
      <Dialog open={cartOpen} onClose={() => setCartOpen(false)} labelledBy="aura-cart-title" variant="drawer" contained>
        <div className="flex h-full flex-col" style={{ background: C.paper, color: C.espresso }}>
          <div className="flex h-14 items-center justify-between border-b px-5" style={{ borderColor: "rgb(42 29 21 / 0.1)" }}>
            <h3 id="aura-cart-title" className="font-serif text-2xl">
              {a.cartTitle}
            </h3>
            <button type="button" onClick={() => setCartOpen(false)} aria-label={t.a11y.close} className="grid size-9 place-items-center rounded-full hover:bg-black/5">
              <X className="size-4" aria-hidden />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {checkedOut ? (
              <p className="mt-10 text-center font-serif text-xl leading-snug" role="status">
                {a.checkoutDone}
              </p>
            ) : cart.length === 0 ? (
              <p className="mt-10 text-center text-sm opacity-70">{a.cartEmpty}</p>
            ) : (
              <ul className="space-y-4">
                {cart.map((line) => (
                  <li key={line.key} className="flex gap-3">
                    <div className="grid size-20 shrink-0 place-items-center rounded-lg" style={{ background: "#efe6da" }}>
                      <CoffeeBag product={line.product} className="h-[86%]" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <p className="font-serif text-lg leading-tight">{line.product.name}</p>
                        <p className="text-sm tabular">{money(line.product.price * line.qty)}</p>
                      </div>
                      <p className="text-[12px] opacity-70">{a.grinds[line.grind]}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-full border" style={{ borderColor: "rgb(42 29 21 / 0.2)" }} role="group" aria-label={a.qty}>
                          <button type="button" onClick={() => changeQty(line.key, -1)} className="grid size-7 place-items-center" aria-label="−1">
                            <Minus className="size-3" aria-hidden />
                          </button>
                          <span className="w-6 text-center text-[13px] tabular">{line.qty}</span>
                          <button type="button" onClick={() => changeQty(line.key, 1)} className="grid size-7 place-items-center" aria-label="+1">
                            <Plus className="size-3" aria-hidden />
                          </button>
                        </div>
                        <button type="button" onClick={() => changeQty(line.key, -line.qty)} className="text-[12px] underline underline-offset-2 opacity-70 hover:opacity-100">
                          {a.remove}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="border-t px-5 py-4" style={{ borderColor: "rgb(42 29 21 / 0.1)" }}>
            <div className="flex justify-between text-sm">
              <span>{a.subtotal}</span>
              <span className="font-medium tabular">{money(subtotal)} MXN</span>
            </div>
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={() => {
                setCart([]);
                setCheckedOut(true);
              }}
              className="mt-4 h-11 w-full rounded-full text-sm font-medium transition-opacity disabled:opacity-40"
              style={{ background: C.espresso, color: C.cream }}
            >
              {a.checkout}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

function RoastBadge({ label }: { label: string }) {
  return (
    <div className="absolute -right-1 top-2 size-28 @3xl:-right-4" aria-hidden>
      <svg viewBox="0 0 100 100" className="size-full animate-[spin_26s_linear_infinite]">
        <defs>
          <path id="aura-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <circle cx="50" cy="50" r="49" fill={C.terracotta} />
        <text style={{ fontFamily: "var(--font-geist-mono)", fontSize: 7.4, letterSpacing: 1.6 }} fill={C.cream}>
          <textPath href="#aura-circle">{label.toUpperCase()}</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 grid place-items-center font-serif text-2xl italic" style={{ color: C.cream }}>
        ✦
      </span>
    </div>
  );
}

function Contours() {
  return (
    <svg aria-hidden viewBox="0 0 600 300" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]">
      {Array.from({ length: 9 }).map((_, i) => (
        <path
          key={i}
          d={`M-20 ${60 + i * 26} C 120 ${20 + i * 24}, 220 ${120 + i * 22}, 340 ${70 + i * 25} S 520 ${30 + i * 28}, 640 ${90 + i * 22}`}
          fill="none"
          stroke="#f4eee6"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

function Reviews() {
  const { t, l } = useI18n();
  const [i, setI] = useState(0);
  const review = auraReviews[i];
  const go = (d: number) => setI((x) => (x + d + auraReviews.length) % auraReviews.length);
  return (
    <section className="px-5 py-16 @3xl:px-10 @3xl:py-24" aria-roledescription="carousel" aria-label={t.aura.reviewsTitle}>
      <p className="text-center font-mono text-[10px] uppercase tracking-[0.28em] opacity-70">{t.aura.reviewsTitle}</p>
      <div className="relative mx-auto mt-8 min-h-[11rem] max-w-2xl text-center" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <m.figure key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
            <blockquote className="font-serif text-[clamp(1.5rem,4.2cqi,2.3rem)] leading-[1.2]">“{l(review.quote)}”</blockquote>
            <figcaption className="mt-6 text-[13px]">
              <span className="font-medium">{review.name}</span>
              <span className="opacity-70"> · {l(review.place)}</span>
            </figcaption>
          </m.figure>
        </AnimatePresence>
      </div>
      <div className="mt-8 flex items-center justify-center gap-4">
        <button type="button" onClick={() => go(-1)} aria-label={t.aura.prev} className="grid size-10 place-items-center rounded-full border transition-colors hover:bg-black/5" style={{ borderColor: "rgb(42 29 21 / 0.2)" }}>
          <ArrowLeft className="size-4" aria-hidden />
        </button>
        <div className="flex gap-1.5" aria-hidden>
          {auraReviews.map((_, k) => (
            <span key={k} className="h-1.5 rounded-full transition-all duration-500" style={{ width: k === i ? 20 : 6, background: k === i ? C.espresso : "rgb(42 29 21 / 0.25)" }} />
          ))}
        </div>
        <button type="button" onClick={() => go(1)} aria-label={t.aura.next} className="grid size-10 place-items-center rounded-full border transition-colors hover:bg-black/5" style={{ borderColor: "rgb(42 29 21 / 0.2)" }}>
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
    </section>
  );
}

function Newsletter() {
  const { t } = useI18n();
  const a = t.aura;
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setState(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "done" : "error");
  };

  return (
    <section className="px-5 pb-16 @3xl:px-10 @3xl:pb-24">
      <div className="relative overflow-hidden rounded-3xl px-6 py-12 text-center @3xl:px-16" style={{ background: C.sand }}>
        <h3 className="font-serif text-[clamp(2rem,5.5cqi,3.2rem)] leading-[1.05]">{a.ctaTitle}</h3>
        <p className="mx-auto mt-3 max-w-md text-sm opacity-70">{a.ctaText}</p>
        {state === "done" ? (
          <p role="status" className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm" style={{ background: C.paper }}>
            <Check className="size-4" style={{ color: "#5f7150" }} aria-hidden />
            {a.subscribed}
          </p>
        ) : (
          <form onSubmit={submit} noValidate className="mx-auto mt-8 flex max-w-md flex-col gap-2 @md:flex-row">
            <label htmlFor="aura-email" className="sr-only">
              {a.emailPlaceholder}
            </label>
            <input
              id="aura-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state === "error") setState("idle");
              }}
              placeholder={a.emailPlaceholder}
              aria-invalid={state === "error"}
              aria-describedby={state === "error" ? "aura-email-error" : undefined}
              className="h-11 flex-1 rounded-full border bg-transparent px-5 text-sm outline-none placeholder:opacity-70 focus:border-[#2a1d15]"
              style={{ borderColor: state === "error" ? C.terracotta : "rgb(42 29 21 / 0.25)", color: C.espresso }}
            />
            <button type="submit" className="h-11 rounded-full px-6 text-sm font-medium" style={{ background: C.espresso, color: C.cream }}>
              {a.subscribe}
            </button>
          </form>
        )}
        {state === "error" ? (
          <p id="aura-email-error" className={cn("mt-3 text-[13px]")} style={{ color: "#8f3f1d" }}>
            {a.emailError}
          </p>
        ) : null}
      </div>
    </section>
  );
}
