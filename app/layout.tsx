import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Space_Grotesk } from "next/font/google";
import { IntroLoader } from "@/components/layout/IntroLoader";
import { Providers } from "@/components/providers/Providers";
import { siteDescription, siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

// Demo-only typefaces: not preloaded so they never compete with the hero.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const title = "Khristian Degollado — Industrial Engineer & Digital Solutions";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description: siteDescription,
  applicationName: "Khristian Degollado — Portfolio",
  authors: [{ name: "Khristian Degollado" }],
  keywords: [
    "Khristian Degollado",
    "Industrial Engineer",
    "Ingeniero Industrial",
    "Inventory management system",
    "Business dashboards",
    "Web development",
    "Next.js",
    "Digital solutions",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title,
    description: siteDescription,
    siteName: "KHRISTIAN.DEV",
    locale: "en_US",
    alternateLocale: ["es_MX"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteDescription,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#07080a",
  colorScheme: "dark",
};

/**
 * Runs before first paint:
 *  - marks JS as available (enables reveal animations; content stays visible without JS)
 *  - sets <html lang> from saved preference or browser language
 *  - skips the intro on repeat visits within the same session
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var s=localStorage.getItem('kd-lang');var n=((navigator.languages&&navigator.languages[0])||navigator.language||'en').toLowerCase();d.lang=(s==='en'||s==='es')?s:((n==='es'||n.indexOf('es-')===0)?'es':'en');}catch(e){}try{if(sessionStorage.getItem('kd-intro'))d.classList.add('kd-skip-intro');sessionStorage.setItem('kd-intro','1');}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-dvh overflow-x-clip">
        <IntroLoader />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
