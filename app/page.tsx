import { Contact } from "@/components/contact/Contact";
import { CvCta } from "@/components/contact/CvCta";
import { Approach } from "@/components/engineering/Approach";
import { Experience } from "@/components/experience/Experience";
import { Hero } from "@/components/hero/Hero";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { DataShowcase, SystemsShowcase } from "@/components/portfolio/SystemsShowcase";
import { Thread } from "@/components/portfolio/Thread";
import { WebShowcase } from "@/components/portfolio/WebShowcase";
import { Skills } from "@/components/skills/Skills";

/**
 * The page follows one thread:
 * who → how I work → inventory system → dashboard → the thinking behind them
 * → the customer-facing web → where it was learned → contact.
 */
export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Thread />
        <SystemsShowcase />
        <DataShowcase />
        <Approach />
        <WebShowcase />
        <Experience />
        <Skills />
        <CvCta />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
