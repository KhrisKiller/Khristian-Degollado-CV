"use client";

import { ArrowRight, X } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Dialog } from "@/components/ui/Dialog";
import { MOVEMENT_TYPES, type MovementType } from "@/data/movements";
import type { Product } from "@/data/products";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import type { RegisterInput } from "./InventoryApp";
import { MOVEMENT_ICON } from "./ui";

type Props = {
  open: boolean;
  presetSku?: string;
  presetType?: MovementType;
  products: Product[];
  onClose: () => void;
  onSubmit: (input: RegisterInput) => void;
};

export function MovementForm(props: Props) {
  return (
    <Dialog open={props.open} onClose={props.onClose} labelledBy="inv-form-title" contained>
      <FormBody {...props} />
    </Dialog>
  );
}

function FormBody({ presetSku, presetType, products, onClose, onSubmit }: Props) {
  const { t, l, lang } = useI18n();
  const f = t.inventory.form;
  const [sku, setSku] = useState(presetSku ?? products[0].sku);
  const [type, setType] = useState<MovementType>(presetType ?? "inbound");
  const [qty, setQty] = useState("");
  const [ref, setRef] = useState("");
  const [error, setError] = useState<string | null>(null);
  const qtyRef = useRef<HTMLInputElement>(null);

  const product = products.find((p) => p.sku === sku) ?? products[0];
  const n = Number(qty);
  const valid = qty.trim() !== "" && Number.isFinite(n) && Number.isInteger(n);
  const after = !valid
    ? null
    : type === "adjustment"
      ? n
      : type === "outbound"
        ? product.stock - n
        : product.stock + n;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (type === "adjustment") {
      if (!valid || n < 0) return setError(f.errorCount);
    } else if (!valid || n <= 0) {
      return setError(f.errorQty);
    }
    if (type === "outbound" && n > product.stock) {
      return setError(`${f.errorStock} ${formatNumber(product.stock, lang)}`);
    }
    const delta = type === "adjustment" ? n - product.stock : type === "outbound" ? -n : n;
    onSubmit({ sku, type, delta, ref: ref.trim() });
  };

  return (
    <form onSubmit={submit} noValidate className="rounded-2xl border border-line-strong bg-ink-850 shadow-2xl">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <h4 id="inv-form-title" className="text-[15px] font-semibold">
          {f.title}
        </h4>
        <button type="button" onClick={onClose} aria-label={t.a11y.close} className="grid size-8 place-items-center rounded-lg text-fg-muted hover:bg-white/5 hover:text-fg">
          <X className="size-4" aria-hidden />
        </button>
      </div>

      <div className="space-y-4 px-5 py-5">
        <label className="block">
          <span className="text-[12px] text-fg-muted">{f.product}</span>
          <select
            value={sku}
            onChange={(e) => {
              setSku(e.target.value);
              setError(null);
            }}
            className="mt-1.5 h-10 w-full rounded-lg border border-line bg-ink-900 px-3 text-[13px] text-fg outline-none focus-visible:border-accent"
          >
            {products.map((p) => (
              <option key={p.sku} value={p.sku} className="bg-ink-850">
                {p.sku} — {p.name}
                {p.variant ? ` · ${l(p.variant)}` : ""}
              </option>
            ))}
          </select>
        </label>

        <fieldset>
          <legend className="text-[12px] text-fg-muted">{f.type}</legend>
          <div className="mt-1.5 grid grid-cols-2 gap-1.5">
            {MOVEMENT_TYPES.map((mt) => {
              const Icon = MOVEMENT_ICON[mt];
              return (
                <button
                  key={mt}
                  type="button"
                  aria-pressed={type === mt}
                  onClick={() => {
                    setType(mt);
                    setError(null);
                    qtyRef.current?.focus();
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] transition-colors",
                    type === mt ? "border-accent/60 bg-accent/10 text-fg" : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
                  )}
                >
                  <Icon className="size-3.5" aria-hidden />
                  {t.inventory.movementTypes[mt]}
                </button>
              );
            })}
          </div>
          <p className="mt-1.5 text-[11px] text-fg-subtle">{f.typeHelp[type]}</p>
        </fieldset>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[12px] text-fg-muted">{type === "adjustment" ? f.counted : f.quantity}</span>
            <input
              ref={qtyRef}
              data-autofocus
              inputMode="numeric"
              type="number"
              min={0}
              step={1}
              value={qty}
              onChange={(e) => {
                setQty(e.target.value);
                setError(null);
              }}
              aria-invalid={error !== null}
              aria-describedby={error ? "inv-form-error" : undefined}
              className="mt-1.5 h-10 w-full rounded-lg border border-line bg-ink-900 px-3 text-[13px] tabular text-fg outline-none focus-visible:border-accent"
            />
          </label>
          <label className="block">
            <span className="text-[12px] text-fg-muted">{f.reference}</span>
            <input
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              placeholder={f.referencePlaceholder}
              maxLength={16}
              className="mt-1.5 h-10 w-full rounded-lg border border-line bg-ink-900 px-3 font-mono text-[13px] uppercase text-fg outline-none placeholder:normal-case placeholder:text-fg-subtle focus-visible:border-accent"
            />
          </label>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-line bg-ink-900 px-3 py-2.5 text-[12px]">
          <span className="text-fg-muted">{f.after}</span>
          <span className="flex items-center gap-2 font-mono tabular">
            <span className="text-fg-subtle">{formatNumber(product.stock, lang)}</span>
            <ArrowRight className="size-3 text-fg-subtle" aria-hidden />
            <span className={cn(after !== null && after < 0 ? "text-critical" : after !== null && after < product.min ? "text-warning" : "text-fg")}>
              {after === null ? "—" : formatNumber(after, lang)}
            </span>
          </span>
        </div>

        {error ? (
          <p id="inv-form-error" role="alert" className="text-[12px] text-critical">
            {error}
          </p>
        ) : null}
      </div>

      <div className="flex justify-end gap-2 border-t border-line px-5 py-4">
        <button type="button" onClick={onClose} className="h-9 rounded-lg border border-line px-4 text-[13px] text-fg-muted hover:text-fg">
          {f.cancel}
        </button>
        <button type="submit" className="h-9 rounded-lg bg-accent px-4 text-[13px] font-medium text-accent-ink hover:bg-accent-soft">
          {f.submit}
        </button>
      </div>
    </form>
  );
}
