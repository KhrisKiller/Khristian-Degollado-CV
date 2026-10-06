# KHRISTIAN.DEV — Interactive Digital Portfolio

Personal portfolio and CV for **Khristian Degollado** — Industrial Engineer · Digital Solutions.

The site is built as a *proof of capability*: instead of describing what I can build, every section is a working example.

| Section | What it demonstrates |
| --- | --- |
| Hero | Animated operations pipeline (Operations → Data → System → Insights → Decisions) |
| Web | **AURA** (editorial coffee brand) and **NOVA** (dark data SaaS) — two fully interactive sites with different identities, resizable to tablet/mobile |
| Systems | **Stockline**, an inventory management app: KPIs, filters, sortable table, product detail with stock history, movement registration with validation |
| Data | **BI dashboard**: period filters that recompute every KPI and chart, KPI drill-downs with data tables, customer performance |
| Approach | Scroll-driven story: Real problem → Process → Data → Digital system → Dashboard → Better decision |
| Experience / Skills / CV / Contact | Timeline, skills with links to where they're demonstrated, downloadable PDF |

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Recharts · Lucide.
No backend — demos run on local mock data.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint
npm run typecheck
```

Deploys to Vercel with zero configuration. Set `NEXT_PUBLIC_SITE_URL` to your production domain so Open Graph and sitemap URLs are absolute (on Vercel, the production URL is detected automatically).

## Before publishing — personal details

Contact links live in one file: **`data/profile.ts`**.

- `email` — currently a placeholder (`hello@example.com`)
- `linkedin` — currently points to linkedin.com
- `github` — `https://github.com/KhrisKiller`

## CV

The download buttons point to `public/cv/Khristian-Degollado-CV.pdf`. A one-page PDF generated from `scripts/cv-template.html` is included; replace the file at the same path with your own CV at any time — no UI changes needed. To regenerate from the template (requires Playwright with Chromium):

```bash
npm run cv:pdf
```

## Languages

English and Spanish. The language is detected from the browser (`es-*` → Spanish, otherwise English), can be switched with **EN | ES**, and the choice is saved in `localStorage`.
All copy lives in `lib/i18n/en.ts` and `lib/i18n/es.ts`; the Spanish dictionary is typed against the English one, so a missing translation is a type error.

## Project structure

```
app/                  layout, page, metadata routes (icon, OG image, robots, sitemap, manifest)
components/
  layout/             navbar, footer, language switcher, scroll progress, intro loader
  hero/  portfolio/   hero + capabilities, web showcase, systems/data showcases
  demos/              aura/  nova/  inventory/  dashboard/  (each lazy-loaded in its own chunk)
  engineering/  experience/  skills/  contact/
  ui/                 primitives: Reveal, Dialog (focus-trapped), Counter, frames, error boundary
data/                 mock datasets: products, inventory, movements, sales, customers, aura, nova
lib/                  i18n, formatting, deterministic PRNG
public/cv/            downloadable CV
scripts/              CV template + PDF generator
```

## Quality notes

- Demos load only when they approach the viewport and are isolated behind error boundaries — if one fails, the rest of the page keeps working.
- `prefers-reduced-motion` is respected (CSS and Framer Motion).
- Dialogs trap focus, close on Escape and restore focus; tables have captions and sortable headers expose `aria-sort`.
- Chart colors are validated for color-vision deficiency and contrast against the dark surface.
