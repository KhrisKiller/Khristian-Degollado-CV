# KHRISTIAN.DEV — Interactive Digital Portfolio

Personal portfolio and CV for **Khristian Degollado** — Industrial Engineer · Digital Solutions.

The site is built as a *proof of capability*: instead of describing what I can build, every section is a working example.

The page follows one thread, *Engineering thinking. Digital execution.*:

| # | Section | Line of the thread | What it demonstrates |
| --- | --- | --- | --- |
| – | Hero | | Name, role, verified work, and the interactive Operations → Data → System → Insights → Decisions pipeline (autoplays, follows scroll, holds on hover/tap, links to its proof) |
| 01 | The thread | | Six statements, each linking to the section that proves it |
| 02 | Inventory Systems | I organize data. I build systems. | **Stockline**: quick actions mapped to floor events, filters, sortable table, product detail with coverage and stock history, validated movement registration |
| 03 | Decision Dashboards | I visualize information. | **BI dashboard**: written period summary, period filters that recompute every KPI, KPI definitions/formulas/"why it matters", customer drill-downs |
| 04 | Approach | I understand problems. I help people decide. | Stockout case study (Problem → Process → Data → System → Insight → Decision) and "How I approach a problem" |
| 05 | Web Experiences | Systems run the operation; websites are where customers meet it. | **AURA** and **NOVA**, two fully interactive sites with opposite identities, resizable to tablet/mobile |
| 06 | Experience | I understand processes. | Real operations → Engineering → Digital systems, from the CV |
| 07–08 | Toolkit, CV, Contact | | Skills with links to proof, EN/ES CV download, email/WhatsApp/LinkedIn/GitHub |

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

## Personal details and CV

Contact links live in one file: **`data/profile.ts`** (email, WhatsApp, LinkedIn, GitHub, CV paths).

The CV buttons serve `public/cv/Khristian-Degollado-CV.pdf` (English) and `public/cv/Khristian-Degollado-CV-ES.pdf` (Spanish); the site offers the visitor's current language first. Replace either file at the same path to update it.

Experience, education, certifications and skills on the site are taken from those CVs.

## Languages

English and Spanish. The language is detected from the browser (`es-*` → Spanish, otherwise English), can be switched with **EN | ES**, and the choice is saved in `localStorage`.
All copy lives in `lib/i18n/en.ts` and `lib/i18n/es.ts`; the Spanish dictionary is typed against the English one, so a missing translation is a type error.

## Project structure

```
app/                  layout, page, metadata routes (icon, OG image, robots, sitemap, manifest)
components/
  layout/             navbar, footer, language switcher, scroll progress, intro loader
  hero/  portfolio/   hero + pipeline, the thread, systems/data/web showcases
  demos/              aura/  nova/  inventory/  dashboard/  (each lazy-loaded in its own chunk)
  engineering/  experience/  skills/  contact/
  ui/                 primitives: Reveal, Dialog (focus-trapped), Counter, frames, error boundary
data/                 mock datasets: products, inventory, movements, sales, customers, aura, nova
lib/                  i18n, formatting, deterministic PRNG
public/cv/            downloadable CVs (EN, ES)
```

## Quality notes

- Demos load only when they approach the viewport and are isolated behind error boundaries — if one fails, the rest of the page keeps working.
- `prefers-reduced-motion` is respected (CSS and Framer Motion).
- Dialogs trap focus, close on Escape and restore focus; tables have captions and sortable headers expose `aria-sort`.
- Chart colors are validated for color-vision deficiency and contrast against the dark surface.
