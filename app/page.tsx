import AboutSection from "@/components/AboutSection";
import HeroSection from "@/components/HeroSection";
import ExperienceSection from "@/components/ExperienceSection";
import Motto from "@/components/Motto";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 md:max-w-5xl mb-8">
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <Motto />
      <Contact />
    </main>
  );
}
