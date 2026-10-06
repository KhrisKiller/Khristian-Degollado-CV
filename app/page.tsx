import { Contact } from "@/components/contact/Contact";
import { CvCta } from "@/components/contact/CvCta";
import { Approach } from "@/components/engineering/Approach";
import { Experience } from "@/components/experience/Experience";
import { Hero } from "@/components/hero/Hero";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Capabilities } from "@/components/portfolio/Capabilities";
import { DataShowcase, SystemsShowcase } from "@/components/portfolio/SystemsShowcase";
import { WebShowcase } from "@/components/portfolio/WebShowcase";
import { Skills } from "@/components/skills/Skills";

/**
 * The page reveals complexity as you scroll:
 * CV → capabilities → web → systems → data → engineering → experience → contact.
 */
export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Capabilities />
        <WebShowcase />
        <SystemsShowcase />
        <DataShowcase />
        <Approach />
        <Experience />
        <Skills />
        <CvCta />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
