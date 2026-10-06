import type { AuraProduct } from "@/data/aura";

type Props = {
  product: Pick<AuraProduct, "name" | "region" | "roast" | "bag">;
  className?: string;
};

const ROAST_LEVEL = { light: 1, medium: 2, dark: 3 } as const;

/** Illustrated stand-up pouch — no stock photography needed. */
export function CoffeeBag({ product, className }: Props) {
  const { body, label, ink } = product.bag;
  const level = ROAST_LEVEL[product.roast];
  const gid = `aura-shade-${product.name.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg viewBox="0 0 200 260" className={className} role="img" aria-label={`${product.name} — ${product.region}`}>
      <defs>
        <linearGradient id={gid} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.16" />
          <stop offset="0.18" stopColor="#000" stopOpacity="0" />
          <stop offset="0.82" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="1" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {/* shadow */}
      <ellipse cx="100" cy="248" rx="70" ry="7" fill="#2a1d15" opacity="0.14" />
      {/* body */}
      <path d="M38 40 L162 40 L170 238 Q100 246 30 238 Z" fill={body} />
      <path d="M38 40 L162 40 L170 238 Q100 246 30 238 Z" fill={`url(#${gid})`} />
      {/* crimped top */}
      <rect x="36" y="18" width="128" height="26" rx="2" fill={body} />
      <rect x="36" y="18" width="128" height="26" rx="2" fill="#000" opacity="0.08" />
      {Array.from({ length: 15 }).map((_, i) => (
        <line key={i} x1={42 + i * 8.3} x2={42 + i * 8.3} y1="22" y2="40" stroke="#000" strokeOpacity="0.12" strokeWidth="1.2" />
      ))}
      {/* valve */}
      <circle cx="100" cy="64" r="6" fill="#000" opacity="0.12" />
      <circle cx="100" cy="64" r="2.5" fill="#000" opacity="0.18" />
      {/* label */}
      <rect x="52" y="92" width="96" height="118" rx="3" fill={label} />
      <text x="100" y="124" textAnchor="middle" fill={ink} style={{ fontFamily: "var(--font-serif)", fontSize: 24, letterSpacing: 6 }}>
        AURA
      </text>
      <line x1="72" x2="128" y1="134" y2="134" stroke={ink} strokeOpacity="0.35" />
      <text x="100" y="152" textAnchor="middle" fill={ink} style={{ fontFamily: "var(--font-serif)", fontSize: 11, fontStyle: "italic" }}>
        {product.name}
      </text>
      <text x="100" y="168" textAnchor="middle" fill={ink} opacity="0.7" style={{ fontFamily: "var(--font-geist-mono)", fontSize: 7, letterSpacing: 2 }}>
        {product.region.toUpperCase()} · 340G
      </text>
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={88 + i * 12} cy={189} r={3.2} fill={ink} opacity={i < level ? 0.85 : 0.2} />
      ))}
    </svg>
  );
}
