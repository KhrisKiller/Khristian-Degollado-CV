/** Server-side site config (metadata, OG). */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const siteDescription =
  "Industrial Engineer building digital solutions, inventory systems, dashboards and modern web experiences.";
