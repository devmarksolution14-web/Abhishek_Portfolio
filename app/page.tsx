import { About } from "@/components/sections/About";
import { Clients } from "@/components/sections/Clients";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { Skills } from "@/components/sections/Skills";
import { Testimonials } from "@/components/sections/Testimonials";
import { Work } from "@/components/sections/Work";
import { HashScroll } from "@/components/ui/HashScroll";
import { Marquee } from "@/components/ui/Marquee";
import { site } from "@/data/site";
import { marqueeItems } from "@/data/skills";
import { publicFileExists } from "@/lib/assets";

export default function HomePage() {
  const hasPhoto = publicFileExists(site.photo);
  return (
    <main id="main" tabIndex={-1} className="overflow-x-clip outline-none">
      <Hero hasPhoto={hasPhoto} />
      <section aria-label="Skills marquee" className="relative z-10 overflow-x-clip py-10 sm:py-14">
        <div className="-rotate-2 scale-[1.04] border-y border-accent bg-accent py-5 text-accent-contrast">
          <Marquee items={marqueeItems} />
        </div>
      </section>
      <Clients />
      <About />
      <Skills />
      <Work />
      <Experience />
      <Process />
      <Testimonials />
      <Contact />
      <HashScroll />
    </main>
  );
}
