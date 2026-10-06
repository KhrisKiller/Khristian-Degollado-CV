// Renders scripts/cv-template.html to public/cv/Khristian-Degollado-CV.pdf.
// Requires Playwright (npx playwright) with a Chromium build available.
// Replace the PDF with your own file at the same path at any time — the UI won't change.
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const mod = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const chromium = mod.chromium ?? mod.default.chromium;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`file://${path.join(root, "scripts/cv-template.html")}`);
await page.pdf({ path: path.join(root, "public/cv/Khristian-Degollado-CV.pdf"), format: "Letter", printBackground: true });
await browser.close();
console.log("CV written to public/cv/Khristian-Degollado-CV.pdf");
