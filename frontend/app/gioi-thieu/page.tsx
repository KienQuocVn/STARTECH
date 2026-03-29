import { Hero } from "./sections/hero-section";
import { AboutIntroSection } from "./sections/about-intro-section";
import { ServicesSection } from "./sections/services-section";
import { AboutSection } from "./sections/about-section";
import { ValuesSection } from "./sections/values-section";

export default function IntroducePage() {
  return (
      <div className="w-full overflow-hidden ">
        <Hero />
        <AboutIntroSection />
        <ServicesSection />
        <AboutSection />
        <ValuesSection />
      </div>
  );
}